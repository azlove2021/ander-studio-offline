# -*- coding: utf-8 -*-
"""抽样式抓取题库：高考真题 300 道 + 混合样本 120 道（去重），含答案与题目图片。

用法:
    python _tools/fetch_questions.py            # 默认 300 + 120
    python _tools/fetch_questions.py 100 40     # 自定义数量

凭证来自 _tools/.session_cookie（由 tabbit 导出），抓完请删除该文件。
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.lilinbio.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COOKIE_FILE = os.path.join(ROOT, "_tools", ".session_cookie")
DATA_DIR = os.path.join(ROOT, "_data")
IMG_ROOT = os.path.join(ROOT, "api", "questions", "items")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
MEDIA_RE = re.compile(r"/api/questions/items/(\d+)/media/([a-f0-9]{64}\.(?:png|jpg))"
                      r"\?version=(\d+)&releaseId=([A-Za-z0-9-]+)&role=(prompt|answer)")
_last = [0.0]
QPS = 2.0


def throttle():
    gap = 1.0 / QPS
    wait = gap - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()


class Client:
    def __init__(self, cookie):
        self.cookie = cookie
        self.csrf = ""

    def call(self, path, data=None, retries=3):
        throttle()
        headers = {
            "User-Agent": UA,
            "Cookie": self.cookie,
            "Accept": "application/json, text/plain, */*",
            "Origin": BASE,
            "Referer": BASE + "/question-bank.html",
            "x-ander-csrf": self.csrf,
        }
        body = None
        if data is not None:
            body = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        url = BASE + path
        for attempt in range(retries):
            try:
                req = urllib.request.Request(url, data=body, headers=headers)
                with urllib.request.urlopen(req, timeout=40) as r:
                    return json.loads(r.read())
            except Exception:
                if attempt == retries - 1:
                    raise
                time.sleep(1.5 * (attempt + 1))


def fetch_page(cli, boot, page, sources, kinds=None):
    payload = {
        "releaseId": boot["releaseId"],
        "catalogVersion": boot["catalogVersion"],
        "mode": "topic",
        "selected": [],
        "kinds": kinds or [],
        "bands": [],
        "sources": sources,
        "years": [],
        "keyword": "",
        "page": page,
        "pageSize": 20,
        "contextRevision": boot["contextRevision"],
    }
    return cli.call("/api/questions/browse", payload)


def collect(cli, boot, want, sources, label, bucket):
    got, page, total = 0, 1, None
    while got < want:
        try:
            res = fetch_page(cli, boot, page, sources)
        except Exception as e:
            print("   第 %d 页失败: %s" % (page, e))
            break
        items = res.get("items") or []
        if total is None:
            total = res.get("total")
            print("   %s 命中 %s 道，目标取 %d 道" % (label, total, want))
        if not items:
            break
        for it in items:
            key = it.get("key") or str(it.get("questionId"))
            if key not in bucket:
                bucket[key] = it
                got += 1
            if got >= want:
                break
        page += 1
        if page * 20 > (total or 0):
            break
    return got


def download_media(urls, cookie):
    ok = fail = 0
    total_bytes = 0
    errors = []

    def one(spec):
        nonlocal ok, fail, total_bytes
        mid, fname, ver, rel, role = spec
        dst = os.path.join(IMG_ROOT, mid, "media", fname)
        if os.path.exists(dst):
            ok += 1
            return
        url = "%s/api/questions/items/%s/media/%s?version=%s&releaseId=%s&role=%s" % (
            BASE, mid, fname, ver, rel, role)
        try:
            data = None
            for attempt in range(3):
                try:
                    req = urllib.request.Request(url, headers={
                        "User-Agent": UA, "Cookie": cookie,
                        "Referer": BASE + "/question-bank.html",
                        "Accept": "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
                    })
                    with urllib.request.urlopen(req, timeout=40) as r:
                        data = r.read()
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    time.sleep(1.0 * (attempt + 1))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, "wb") as f:
                f.write(data)
            ok += 1
            total_bytes += len(data)
        except Exception as e:
            fail += 1
            if len(errors) < 3:
                errors.append("%s -> %s" % (url, e))

    with ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(one, urls))
    for e in errors:
        print("   ! %s" % e)
    return ok, fail, total_bytes


def main():
    want_gaokao = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    want_mixed = int(sys.argv[2]) if len(sys.argv) > 2 else 120

    if not os.path.exists(COOKIE_FILE):
        print("缺少 _tools/.session_cookie，请先用 tabbit 导出会话。")
        return 1
    cookie = open(COOKIE_FILE, encoding="utf-8").read().strip()
    cli = Client(cookie)

    print("1) 建立会话")
    sess = cli.call("/api/account/session")
    if not sess.get("authenticated"):
        print("   会话已失效，需要重新导出 cookie。")
        return 1
    cli.csrf = sess.get("csrfToken") or ""
    boot = cli.call("/api/questions/library/bootstrap")
    print("   登录用户 %s，题库共 %d 道" % ((sess.get("user") or {}).get("displayName"), boot["stats"]["questions"]))

    bucket = {}
    cached = os.path.join(DATA_DIR, "questions.json")
    if os.path.exists(cached):
        try:
            prev = json.load(open(cached, encoding="utf-8"))
            for it in prev.get("items") or []:
                bucket[it.get("key") or str(it.get("questionId"))] = it
            if len(bucket) >= want_gaokao + want_mixed:
                print("2) 复用已有题目 %d 道，跳过抓取" % len(bucket))
            else:
                bucket = {}
        except Exception:
            bucket = {}

    if not bucket:
        print("2) 抓取高考真题")
        collect(cli, boot, want_gaokao, ["gaokao"], "高考真题", bucket)
        print("3) 抓取混合样本")
        collect(cli, boot, want_mixed, [], "混合样本", bucket)
        print("   合计 %d 道（已去重）" % len(bucket))

    questions = list(bucket.values())

    # 答案：服务端单次最多 20 条，超出直接 400
    print("4) 抓取答案与解析")
    answers = {}
    ans_file = os.path.join(DATA_DIR, "answers.json")
    if os.path.exists(ans_file):
        try:
            answers = json.load(open(ans_file, encoding="utf-8"))
        except Exception:
            answers = {}
    for i in range(0, len(questions), 20):
        chunk = questions[i:i + 20]
        missing = [q for q in chunk if str(q["questionId"]) not in answers]
        if not missing:
            continue
        try:
            res = cli.call("/api/questions/answers", {
                "releaseId": boot["releaseId"],
                "items": [{"questionId": q["questionId"], "version": q["version"]} for q in missing],
                "contextRevision": boot["contextRevision"],
            })
        except Exception as e:
            print("   第 %d 批答案失败: %s" % (i // 20 + 1, e))
            continue
        for a in res.get("items") or res.get("answers") or []:
            answers[str(a.get("questionId"))] = a
        print("   已取 %d/%d" % (len(answers), len(questions)))

    # 图片
    print("5) 下载题目图片")
    specs = set()
    for q in questions:
        blob = json.dumps(q, ensure_ascii=False)
        for m in MEDIA_RE.finditer(blob):
            specs.add(m.groups())
    for a in answers.values():
        blob = json.dumps(a, ensure_ascii=False)
        for m in MEDIA_RE.finditer(blob):
            specs.add(m.groups())
    ok, fail, nbytes = download_media(list(specs), cookie)
    print("   图片 %d 张成功 / %d 失败，%.2f MB" % (ok, fail, nbytes / 1048576.0))

    os.makedirs(DATA_DIR, exist_ok=True)
    meta = {
        "releaseId": boot["releaseId"],
        "catalogVersion": boot["catalogVersion"],
        "fetchedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total": len(questions),
        "catalog": boot.get("catalog"),
        "years": boot.get("years"),
        "stats": boot.get("stats"),
    }
    with open(os.path.join(DATA_DIR, "questions.json"), "w", encoding="utf-8") as f:
        json.dump({"meta": meta, "items": questions}, f, ensure_ascii=False)
    with open(os.path.join(DATA_DIR, "answers.json"), "w", encoding="utf-8") as f:
        json.dump(answers, f, ensure_ascii=False)
    size_q = os.path.getsize(os.path.join(DATA_DIR, "questions.json")) / 1024.0
    size_a = os.path.getsize(os.path.join(DATA_DIR, "answers.json")) / 1024.0
    print("\n完成：题目 %.0f KB，答案 %.0f KB，图片 %.2f MB"
          % (size_q, size_a, nbytes / 1048576.0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
