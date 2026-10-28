# -*- coding: utf-8 -*-
"""抓取 29 个教学模型的完整静态包。

每个模型在 catalog.json 里声明了 entry / scripts / styles / content，
但真实依赖还需要从 HTML 与 CSS 里递归解析（图片、字体、子模块等）。
抓取保持原始相对目录结构，落到 model-releases/models/<id>/<version>/ 下。
"""
import json
import os
import posixpath
import re
import sys
import time
import urllib.parse
import urllib.request

ORIGIN = "https://www.lilinbio.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "model-releases", "catalog.json")
UA = {"User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                     "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")}
QPS = 4.0
_last = [0.0]
stats = {"ok": 0, "fail": 0, "bytes": 0, "skip": 0}
failures = []


def throttle():
    gap = 1.0 / QPS
    wait = gap - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()


def fetch(path, retries=3):
    url = ORIGIN + urllib.parse.quote(path, safe="/?=&%:@!$'()*+,;~")
    for attempt in range(retries):
        throttle()
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(1.2 * (attempt + 1))


def refs_from_html(text):
    out = []
    for m in re.finditer(r'(?:href|src|poster|data-src)\s*=\s*["\']([^"\']+)["\']', text, re.I):
        out.append(m.group(1))
    out.extend(refs_from_css(text))
    return out


def refs_from_css(text):
    return [m.group(1) for m in re.finditer(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', text, re.I)]


def normalize(raw, base_dir):
    """把引用解析成站点绝对路径（不含 query）。"""
    if not raw:
        return None
    u = raw.strip()
    if u.startswith(("data:", "blob:", "mailto:", "tel:", "javascript:", "#")):
        return None
    if u.startswith("//"):
        return None
    if u.startswith(("http://", "https://")):
        if ORIGIN not in u:
            return None
        u = u[len(ORIGIN):]
    u = u.split("#")[0].split("?")[0]
    if not u or u.endswith("/") or u in (".", ".."):
        return None
    if not u.startswith("/"):
        u = posixpath.normpath(posixpath.join(base_dir, u))
    # normpath 可能把 "./" 折叠成目录本身，这类引用不是文件，跳过
    if u.endswith("/") or posixpath.basename(u) in ("", ".", ".."):
        return None
    return u


def save(path, data):
    dst = os.path.join(ROOT, path.lstrip("/").replace("/", os.sep))
    if os.path.isdir(dst):
        return False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    with open(dst, "wb") as f:
        f.write(data)
    return True


def crawl_model(model):
    mid, ver = model["id"], model["version"]
    base_dir = "/model-releases/models/%s/%s/" % (mid, ver)
    seeds = [base_dir + (model.get("entry") or "index.html")]
    for key in ("scripts", "styles"):
        for name in model.get(key) or []:
            seeds.append(base_dir + name)
    if model.get("content"):
        seeds.append(base_dir + model["content"])
    if model.get("cover"):
        seeds.append(base_dir + model["cover"])

    queue, seen = list(seeds), set()
    ok = fail = 0
    size = 0
    while queue:
        cur = queue.pop(0)
        if cur in seen:
            continue
        seen.add(cur)
        dst = os.path.join(ROOT, cur.lstrip("/").replace("/", os.sep))
        if os.path.exists(dst):
            stats["skip"] += 1
            with open(dst, "rb") as f:
                data = f.read()
            ctype = ""
        else:
            try:
                data, ctype = fetch(cur)
            except Exception as e:
                fail += 1
                failures.append((mid, cur, str(e)))
                continue
            save(cur, data)
            ok += 1
            size += len(data)

        low = ctype.lower()
        probe = cur.lower()
        if "html" in low or probe.endswith((".html", ".htm")):
            kids = refs_from_html(data.decode("utf-8", "replace"))
        elif "css" in low or probe.endswith(".css"):
            kids = refs_from_css(data.decode("utf-8", "replace"))
        else:
            continue
        for k in kids:
            n = normalize(k, posixpath.dirname(cur) + "/")
            if n and n not in seen:
                queue.append(n)

    stats["ok"] += ok
    stats["fail"] += fail
    stats["bytes"] += size
    flag = "OK " if fail == 0 else "WARN"
    print("  [%s] %-32s v%-8s 新抓 %2d 个, 失败 %d, %.1f KB"
          % (flag, mid, ver, ok, fail, size / 1024.0))
    return fail


def main():
    with open(CATALOG, encoding="utf-8") as f:
        catalog = json.load(f)
    models = [m for m in catalog["models"] if m.get("publish")]
    print("共 %d 个已发布模型\n" % len(models))
    bad = 0
    for m in models:
        try:
            bad += crawl_model(m)
        except Exception as e:
            bad += 1
            failures.append((m["id"], "-", str(e)))
            print("  [FAIL] %s: %s" % (m["id"], e))
    print("\n新抓 %d 个文件 / %.2f MB，跳过已存在 %d，失败 %d"
          % (stats["ok"], stats["bytes"] / 1048576.0, stats["skip"], stats["fail"]))
    if failures:
        print("\n失败明细（最多 20 条）:")
        for mid, p, e in failures[:20]:
            print("  %s  %s  %s" % (mid, p, e))
    return 0 if bad == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
