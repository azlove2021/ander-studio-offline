# -*- coding: utf-8 -*-
"""按考点目录遍历，为题库快照建立「题目 → 目录节点」映射。

做法：
1. 取 catalog 里的叶子节点（没有子节点的最细粒度考点）；
2. 对每个叶子节点请求第一页；把返回的题目 id 记到该节点名下 ——
   这样即使题目已在快照里，也能补上归属；
3. 每个考点最多新增 PER_NODE 道题入库（去重）；
4. 合并回 _data/questions.json，给每道题写 nodes 字段，并下载新增题目的图片。

用法：
    python _tools/fetch_node_map.py            # 每个考点最多补 2 道
    python _tools/fetch_node_map.py 3          # 每个考点最多补 3 道
"""
import json
import os
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.lilinbio.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COOKIE_FILE = os.path.join(ROOT, "_tools", ".session_cookie")
DATA = os.path.join(ROOT, "_data")
IMG_ROOT = os.path.join(ROOT, "api", "questions", "items")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
MEDIA_RE = re.compile(r"/api/questions/items/(\d+)/media/([a-f0-9]{64}\.(?:png|jpg))"
                      r"\?version=(\d+)&releaseId=([A-Za-z0-9-]+)&role=(prompt|answer)")
QPS = 2.0
_last = [0.0]


def throttle():
    wait = 1.0 / QPS - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()


def make_client(cookie):
    state = {"csrf": ""}

    def call(path, data=None, retries=3):
        throttle()
        headers = {
            "User-Agent": UA, "Cookie": cookie,
            "Accept": "application/json, text/plain, */*",
            "Origin": BASE, "Referer": BASE + "/question-bank.html",
            "x-ander-csrf": state["csrf"],
        }
        body = None
        if data is not None:
            body = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        for attempt in range(retries):
            try:
                req = urllib.request.Request(BASE + path, data=body, headers=headers)
                with urllib.request.urlopen(req, timeout=40) as r:
                    return json.loads(r.read())
            except Exception:
                if attempt == retries - 1:
                    raise
                time.sleep(1.5 * (attempt + 1))

    return call, state


def leaves_of(nodes):
    parents = {n.get("parentId") for n in nodes if n.get("parentId")}
    return [n for n in nodes if n.get("id") not in parents]


def main():
    per_node = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    if not os.path.exists(COOKIE_FILE):
        print("缺少 _tools/.session_cookie，请先用 tabbit 导出会话。")
        return 1
    cookie = open(COOKIE_FILE, encoding="utf-8").read().strip()
    call, state = make_client(cookie)

    print("1) 建立会话")
    sess = call("/api/account/session")
    if not sess.get("authenticated"):
        print("   会话已失效，请重新导出 cookie。")
        return 1
    state["csrf"] = sess.get("csrfToken") or ""
    boot = call("/api/questions/library/bootstrap")
    nodes = (boot.get("catalog") or {}).get("nodes") or []
    print("   节点 %d 个，题库 %d 道" % (len(nodes), boot["stats"]["questions"]))

    leaves = leaves_of(nodes)
    print("2) 遍历叶子节点 %d 个（每节点最多补 %d 道）" % (len(leaves), per_node))

    snapshot = os.path.join(DATA, "questions.json")
    prev = json.load(open(snapshot, encoding="utf-8")) if os.path.exists(snapshot) else {"meta": {}, "items": []}
    bucket = {str(q["questionId"]): q for q in prev.get("items") or []}
    before = len(bucket)

    node_map = {}          # questionId -> [nodeId]
    added = 0
    failed = 0
    for i, leaf in enumerate(leaves, 1):
        try:
            res = call("/api/questions/browse", {
                "releaseId": boot["releaseId"],
                "catalogVersion": boot["catalogVersion"],
                "mode": "chapter" if leaf.get("taxonomy") == "chapter" else "topic",
                "selected": [leaf["id"]],
                "kinds": [], "bands": [], "sources": [], "years": [], "keyword": "",
                "page": 1, "pageSize": 20,
                "contextRevision": boot["contextRevision"],
            })
        except Exception:
            failed += 1
            continue
        items = res.get("items") or []
        picked = 0
        for it in items:
            qid = str(it["questionId"])
            node_map.setdefault(qid, []).append(leaf["id"])
            if qid not in bucket and picked < per_node:
                bucket[qid] = it
                picked += 1
                added += 1
        if i % 40 == 0 or i == len(leaves):
            print("   %d/%d 节点，新增 %d 道，映射 %d 道" % (i, len(leaves), added, len(node_map)))

    # 写入归属（原有题若在映射里也一并补上）
    for qid, q in bucket.items():
        q["nodes"] = node_map.get(qid, q.get("nodes") or [])

    print("3) 下载新增题目图片")
    specs = set()
    for qid, q in bucket.items():
        blob = json.dumps(q, ensure_ascii=False)
        for m in MEDIA_RE.finditer(blob):
            specs.add(m.groups())
    ok = fail_img = 0

    def one(spec):
        nonlocal ok, fail_img
        mid, fname, ver, rel, role = spec
        dst = os.path.join(IMG_ROOT, mid, "media", fname)
        if os.path.exists(dst):
            ok += 1
            return
        url = "%s/api/questions/items/%s/media/%s?version=%s&releaseId=%s&role=%s" % (
            BASE, mid, fname, ver, rel, role)
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA, "Cookie": cookie,
                "Referer": BASE + "/question-bank.html"})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, "wb") as f:
                f.write(data)
            ok += 1
        except Exception:
            fail_img += 1

    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(one, list(specs)))
    print("   图片 %d 张（已存在计入成功），失败 %d" % (ok, fail_img))

    meta = prev.get("meta") or {}
    meta.update({
        "releaseId": boot["releaseId"],
        "catalogVersion": boot["catalogVersion"],
        "fetchedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total": len(bucket),
        "catalog": boot.get("catalog"),
        "years": boot.get("years"),
        "stats": boot.get("stats"),
        "nodeMapped": sum(1 for q in bucket.values() if q.get("nodes")),
    })
    with open(snapshot, "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "items": list(bucket.values())}, f, ensure_ascii=False)

    mapped = meta["nodeMapped"]
    print("\n完成：题目 %d → %d 道（新增 %d），有节点归属 %d 道，失败节点 %d 个"
          % (before, len(bucket), added, mapped, failed))
    return 0


if __name__ == "__main__":
    sys.exit(main())
