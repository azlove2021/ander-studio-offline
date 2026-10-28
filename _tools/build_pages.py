# -*- coding: utf-8 -*-
"""准备 GitHub Pages 站点目录。

产物在 pages/，结构是「扁平 + 相对路径」：
    pages/index.html        模型库总览
    pages/<模型id>/...       29 个模型（自包含，路径已相对化）
    pages/assets/...        封面图、站点图标、站点级样式

之所以做成扁平结构：模型目录深度固定为 1，于是模型里的 `/assets/x`
可以统一改写成 `../assets/x`，同一份内容既能放本地也能放 Pages 子路径，
不需要为两种场景各维护一套。
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPORT = os.path.join(ROOT, "导出")
PAGES = os.path.join(ROOT, "pages")
ASSETS = os.path.join(ROOT, "assets")


def main():
    if not os.path.isdir(EXPORT):
        print("缺少导出目录，请先跑 export_model.py --all")
        return 1

    if os.path.isdir(PAGES):
        shutil.rmtree(PAGES, ignore_errors=True)
    os.makedirs(PAGES, exist_ok=True)

    # 1) 29 个模型
    models = 0
    for name in sorted(os.listdir(EXPORT)):
        src = os.path.join(EXPORT, name)
        if not os.path.isdir(src):
            continue
        shutil.copytree(src, os.path.join(PAGES, name), dirs_exist_ok=True)
        models += 1

    # 2) 站点资源：封面图、图标、站点级样式与脚本
    for sub in ("model-covers", "accounts", "textbook-icons"):
        src = os.path.join(ASSETS, sub)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(PAGES, "assets", sub), dirs_exist_ok=True)
    for name in ("ande-biology-logo.png", "life-ark-nav.png"):
        src = os.path.join(ASSETS, name)
        if os.path.exists(src):
            os.makedirs(os.path.join(PAGES, "assets"), exist_ok=True)
            shutil.copy2(src, os.path.join(PAGES, "assets", name))

    # 3) 生成相对路径版总览页
    subprocess.run([sys.executable,
                    os.path.join(ROOT, "_tools", "build_models_index.py"), "--pages"],
                   check=True, cwd=ROOT)

    total = sum(os.path.getsize(os.path.join(r, f))
                for r, _, fs in os.walk(PAGES) for f in fs)
    print("Pages 目录就绪：%d 个模型，%.2f MB → %s" % (models, total / 1048576.0, PAGES))
    return 0


if __name__ == "__main__":
    sys.exit(main())
