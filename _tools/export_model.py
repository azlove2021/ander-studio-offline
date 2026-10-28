# -*- coding: utf-8 -*-
"""把教学模型导出成可独立运行的单模型包。

    python _tools/export_model.py photosynthesis      # 导出单个
    python _tools/export_model.py --all               # 导出全部 29 个

导出的每个目录都包含模型全部文件和两个启动件：
    打开模型.bat   —— 双击启动本地服务并打开浏览器（需要 Python）
    说明.txt       —— 使用说明

注意：模型使用 ES module，浏览器禁止 file:// 下加载，必须经由 HTTP 打开，
所以不能直接双击 index.html。
"""
import json
import os
import re
import shutil
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "model-releases", "catalog.json")
MODELS_DIR = os.path.join(ROOT, "model-releases", "models")
OUT_DIR = os.path.join(ROOT, "导出")

BAT = """@echo off
cd /d "%~dp0"
start "" http://127.0.0.1:8099/index.html
python -m http.server 8099
pause
"""

NOTE = """{title}

使用方式
--------
双击「打开模型.bat」，浏览器会自动打开这个模型。
关闭弹出的黑色窗口即可停止。

为什么不能直接双击 index.html
----------------------------
模型使用了 ES module，浏览器的安全策略禁止 file:// 协议加载模块脚本，
必须通过本地 HTTP 服务打开。所以请用 bat 启动。

需要 Python（安装时勾选 Add to PATH）。
没有 Python 的电脑，可以把整个文件夹放进任意静态服务器，
或直接用「安德生物工作室离线镜像」的主服务打开。
"""


def clean_html(path):
    """去掉站点适配层的绝对路径引用（收藏、会话），这些独立运行时不需要。"""
    with open(path, encoding="utf-8") as f:
        s = f.read()
    before = len(s)
    s = re.sub(r'\s*<script[^>]*src="/assets/accounts/model-favorite[^"]*"[^>]*></script>', "", s)
    s = re.sub(r'\s*<script[^>]*src="/session\.js[^"]*"[^>]*></script>', "", s)
    with open(path, "w", encoding="utf-8") as f:
        f.write(s)
    return before, len(s)


def export_one(model, out_root):
    mid, ver = model["id"], model["version"]
    src = os.path.join(MODELS_DIR, mid, ver)
    if not os.path.isdir(src):
        print("  跳过 %s：本地没有该模型包" % mid)
        return None
    title = (model.get("title") or {}).get("zh") or mid
    dst = os.path.join(out_root, mid)
    # 不用 rmtree / copytree：本机 safe-delete 垫片会拦截删除，
    # 且 Windows 上文件可能被索引或云同步短暂占用，改为逐文件复制 + 重试
    failed = 0
    for base, _, files in os.walk(src):
        rel = os.path.relpath(base, src)
        target_dir = dst if rel == "." else os.path.join(dst, rel)
        os.makedirs(target_dir, exist_ok=True)
        for name in files:
            sp = os.path.join(base, name)
            dp = os.path.join(target_dir, name)
            for attempt in range(3):
                try:
                    shutil.copy2(sp, dp)
                    break
                except OSError:
                    if attempt == 2:
                        failed += 1
                    else:
                        time.sleep(0.3)

    entry = os.path.join(dst, model.get("entry") or "index.html")
    before, after = clean_html(entry)

    with open(os.path.join(dst, "打开模型.bat"), "w", encoding="ascii") as f:
        f.write(BAT)
    with open(os.path.join(dst, "说明.txt"), "w", encoding="utf-8") as f:
        f.write(NOTE.format(title=title))

    n = b = 0
    for r, _, fs in os.walk(dst):
        for name in fs:
            n += 1
            b += os.path.getsize(os.path.join(r, name))
    print("  [OK] %-32s %2d 个文件 %6.1f KB" % (mid, n, b / 1024.0))
    return dst


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 1
    with open(CATALOG, encoding="utf-8") as f:
        catalog = json.load(f)
    models = {m["id"]: m for m in catalog["models"]}

    if args[0] == "--all":
        targets = list(models.values())
        os.makedirs(OUT_DIR, exist_ok=True)
        print("导出全部 %d 个模型到 %s\n" % (len(targets), OUT_DIR))
    else:
        targets = []
        for name in args:
            if name not in models:
                print("找不到模型：%s" % name)
                continue
            targets.append(models[name])
        if not targets:
            return 1
        os.makedirs(OUT_DIR, exist_ok=True)

    for m in targets:
        export_one(m, OUT_DIR)

    total = 0
    for r, _, fs in os.walk(OUT_DIR):
        for name in fs:
            total += os.path.getsize(os.path.join(r, name))
    print("\n导出完成，合计 %.2f MB → %s" % (total / 1048576.0, OUT_DIR))
    print("每个模型目录内双击「打开模型.bat」即可运行。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
