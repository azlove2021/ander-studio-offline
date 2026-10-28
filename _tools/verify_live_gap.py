# -*- coding: utf-8 -*-
"""比对「线上实际加载的资源」与「本地已抓取的文件」，输出缺失台账。

输入：_tools/_live_l*.json —— 用真实浏览器打开线上模型时，
      通过 request 事件采集到的全部 /model-releases/models/<id>/... 请求路径。
输出：控制台台账 + _tools/_live_gap.txt（缺失路径清单）

判定原则：
- 线上请求过、本地不存在 → 缺失（GAP），必须补；
- 本地存在、线上本次未请求 → 不影响（可能是按需加载或已完成缓存），单独列出参考。
"""
import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "_tools")


def main():
    live = {}
    files = sorted(glob.glob(os.path.join(TOOLS, "_live_l*.json")))
    if not files:
        print("没有采集文件")
        return 1
    for f in files:
        try:
            data = json.load(open(f, encoding="utf-8"))
        except Exception as e:
            print("读取失败 %s: %s" % (os.path.basename(f), e))
            continue
        for mid, paths in data.items():
            live.setdefault(mid, set()).update(paths)

    print("线上采集覆盖 %d 个模型\n" % len(live))
    print("%-34s %6s %6s %6s" % ("模型", "线上", "本地有", "缺失"))
    print("-" * 60)

    gaps = []
    extras = []
    total_live = total_ok = 0
    for mid in sorted(live):
        paths = live[mid]
        ok = 0
        for p in paths:
            dst = os.path.join(ROOT, p.lstrip("/").replace("/", os.sep))
            if os.path.exists(dst):
                ok += 1
            else:
                gaps.append(p)
        total_live += len(paths)
        total_ok += ok
        flag = "" if ok == len(paths) else "  ← 缺 %d" % (len(paths) - ok)
        print("%-34s %6d %6d %6d%s" % (mid, len(paths), ok, len(paths) - ok, flag))

        # 本地有、线上本次没请求的（参考信息）
        base = "/model-releases/models/%s/" % mid
        for g in glob.glob(os.path.join(ROOT, "model-releases", "models", mid, "*", "**", "*"),
                           recursive=True):
            if os.path.isfile(g):
                rel = "/" + os.path.relpath(g, ROOT).replace(os.sep, "/")
                if rel not in paths:
                    extras.append(rel)

    print("-" * 60)
    print("合计：线上请求 %d 个资源，本地命中 %d 个，缺失 %d 个"
          % (total_live, total_ok, len(gaps)))

    if gaps:
        out = os.path.join(TOOLS, "_live_gap.txt")
        with open(out, "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(set(gaps))))
        print("\n缺失清单已写入 _tools/_live_gap.txt（%d 条）:" % len(set(gaps)))
        for g in sorted(set(gaps))[:20]:
            print("  " + g)

    print("\n本地多出（线上本次未请求，仅供参考）：%d 个" % len(extras))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
