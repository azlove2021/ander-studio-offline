# -*- coding: utf-8 -*-
"""核查深度交互采集结果：交互后是否还有本地缺失的资源。

输入：_tools/_deep_*.json（真实浏览器打开线上模型 + 点击 tab/控件后采集的资源路径）
输出：台账表 + 缺失清单
"""
import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "_tools")


def main():
    data = {}
    for f in sorted(glob.glob(os.path.join(TOOLS, "_deep_d*.json"))):
        try:
            d = json.load(open(f, encoding="utf-8"))
        except Exception as e:
            print("跳过 %s: %s" % (os.path.basename(f), e))
            continue
        data.update(d)

    print("深度交互采集覆盖 %d 个模型（每个都点了 tab 与控件）\n" % len(data))
    print("%-34s %5s %5s %5s %5s %6s" % ("模型", "初始", "交互后", "点击", "本地缺", "状态"))
    print("-" * 72)

    gaps = []
    errs = []
    total_after = total_miss = 0
    grew = []
    for mid in sorted(data):
        d = data[mid]
        if "err" in d:
            errs.append((mid, d["err"]))
            continue
        before, after = d.get("before", 0), d.get("after", 0)
        paths = d.get("paths") or []
        miss = []
        for p in paths:
            dst = os.path.join(ROOT, p.lstrip("/").replace("/", os.sep))
            if not os.path.exists(dst):
                miss.append(p)
        total_after += len(paths)
        total_miss += len(miss)
        gaps.extend(miss)
        if after > before:
            grew.append("%s(+%d)" % (mid, after - before))
        status = "OK" if not miss else "缺 %d" % len(miss)
        print("%-34s %5d %5d %5d %5d %6s"
              % (mid, before, after, d.get("clicked", 0), len(miss), status))

    print("-" * 72)
    print("合计：交互后资源 %d 个，本地缺失 %d 个" % (total_after, total_miss))
    if grew:
        print("交互产生新资源的模型：%s" % ", ".join(grew))
    else:
        print("交互未产生新资源 —— 所有资源在初始加载阶段即全部请求")

    if gaps:
        out = os.path.join(TOOLS, "_deep_gap.txt")
        with open(out, "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(set(gaps))))
        print("\n缺失已写入 _tools/_deep_gap.txt：")
        for g in sorted(set(gaps)):
            print("  " + g)
    if errs:
        print("\n采集异常：")
        for mid, e in errs:
            print("  %s: %s" % (mid, e[:100]))
    return 0 if not gaps and not errs else 1


if __name__ == "__main__":
    raise SystemExit(main())
