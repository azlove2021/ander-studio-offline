# -*- coding: utf-8 -*-
"""按缺失清单补齐模型资源。

清单来源：用真实浏览器逐个打开模型，收集所有 404 的 GET 请求路径。
原因：部分素材由 JS 动态拼接（`assets/${id}.png`）或用 import 引入
（`vendor/three.module.min.js`），静态解析 HTML/CSS 抓不到。

用法：
    python _tools/fetch_missing.py            # 读取 _tools/_missing_all.txt
"""
import os
import sys
import time
import urllib.parse
import urllib.request

ORIGIN = "https://www.lilinbio.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIST = os.path.join(ROOT, "_tools", "_missing_all.txt")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
_last = [0.0]


def throttle(qps=4.0):
    wait = 1.0 / qps - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()


def main():
    if not os.path.exists(LIST):
        print("缺少清单文件 %s" % LIST)
        return 1
    paths = [ln.strip() for ln in open(LIST, encoding="utf-8") if ln.strip()]
    print("待补 %d 个资源\n" % len(paths))

    ok = skip = fail = 0
    total = 0
    failures = []
    for p in paths:
        if not p.startswith("/"):
            continue
        dst = os.path.join(ROOT, p.lstrip("/").replace("/", os.sep))
        if os.path.exists(dst):
            skip += 1
            continue
        url = ORIGIN + urllib.parse.quote(p, safe="/?=&%:@!$'()*+,;~")
        got = False
        for attempt in range(3):
            throttle()
            try:
                req = urllib.request.Request(url, headers={
                    "User-Agent": UA, "Referer": ORIGIN + "/"})
                with urllib.request.urlopen(req, timeout=30) as r:
                    data = r.read()
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                with open(dst, "wb") as f:
                    f.write(data)
                ok += 1
                total += len(data)
                got = True
                break
            except Exception as e:
                if attempt == 2:
                    failures.append((p, str(e)))
                else:
                    time.sleep(1.0 * (attempt + 1))
        if not got:
            fail += 1

    print("补抓完成：成功 %d，已存在 %d，失败 %d，共 %.2f MB"
          % (ok, skip, fail, total / 1048576.0))
    if failures:
        print("\n失败明细（最多 15 条）:")
        for p, e in failures[:15]:
            print("  %s  %s" % (p, e))
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
