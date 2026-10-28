# -*- coding: utf-8 -*-
"""由 catalog.json 生成完全静态的教学模型总览页 models.html。

数据全部内联，不依赖 fetch，双击（file://）也能正常打开。
每个卡片直接指向本地已抓取的模型入口。
"""
import json
import os
import html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "model-releases", "catalog.json")
OUT = os.path.join(ROOT, "models.html")

MODULE_ZH = {
    "molecules-and-cells": "分子与细胞",
    "genetics-and-evolution": "遗传与进化",
    "homeostasis": "稳态与调节",
    "ecology": "生物与环境",
    "biotechnology": "生物技术与工程",
    "cell-metabolism": "细胞代谢",
    "molecular-genetics": "分子遗传",
}

TECH_LABEL = {
    "svg-2d-animation": ("2D 动画", "tech"),
    "svg-2d-interactive": ("2D 交互", "tech"),
    "dom-2d": ("2D 交互", "tech"),
    "canvas-2d-interactive": ("2D 交互", "tech"),
    "svg-webgl-2d-animation": ("2D 动画", "tech"),
    "2.5d-canvas": ("2.5D", "tech"),
    "threejs": ("3D 模型", "tech3d"),
}


def esc(s):
    return html.escape(str(s or ""), quote=True)


def main():
    with open(CATALOG, encoding="utf-8") as f:
        catalog = json.load(f)
    models = [m for m in catalog["models"] if m.get("publish")]

    cards = []
    for m in models:
        mid, ver = m["id"], m["version"]
        entry = "/model-releases/models/%s/%s/%s" % (mid, ver, m.get("entry") or "index.html")
        mod_id = (m.get("module") or {}).get("id", "")
        mod_zh = (m.get("module") or {}).get("zh") or MODULE_ZH.get(mod_id, "其他")
        title = (m.get("title") or {}).get("zh") or mid
        title_en = (m.get("title") or {}).get("en") or ""
        summary = (m.get("summary") or {}).get("zh") or ""
        # 优先用优化后的卡片封面，缺失则回退到模型包内的原图
        card_cover = "/assets/model-covers/cards/%s.webp" % mid
        if os.path.exists(os.path.join(ROOT, "assets", "model-covers", "cards", mid + ".webp")):
            cover = card_cover
        else:
            cover = "/model-releases/models/%s/%s/%s" % (mid, ver, m.get("cover") or "assets/cover.png")
        tech_text, tech_cls = TECH_LABEL.get(m.get("technology"), (m.get("technology") or "交互", "tech"))
        stages = m.get("stages") or []
        cards.append(dict(id=mid, href=entry, cover=cover, modId=mod_id, mod=mod_zh, ver=ver,
                          title=title, titleEn=title_en, summary=summary, tech=tech_text,
                          techCls=tech_cls, stages=len(stages), is3d=(tech_cls == "tech3d")))

    mods = []
    seen = set()
    for c in cards:
        if c["modId"] not in seen:
            seen.add(c["modId"])
            mods.append((c["modId"], c["mod"]))

    def card_html(c):
        return f'''    <a class="card" href="{esc(c["href"])}" data-mod="{esc(c["modId"])}" data-text="{esc((c["title"] + " " + c["titleEn"] + " " + c["summary"]).lower())}">
      <div class="cover"><img src="{esc(c["cover"])}" alt="{esc(c["title"])}" loading="eager" decoding="async"></div>
      <div class="body">
        <div class="tags"><span class="tag">{esc(c["mod"])}</span><span class="tag {c["techCls"]}">{esc(c["tech"])}</span>{f'<span class="tag stage">{c["stages"]} 步</span>' if c["stages"] else ''}</div>
        <h3>{esc(c["title"])}</h3>
        <p class="en">{esc(c["titleEn"])}</p>
        <p class="sum">{esc(c["summary"])}</p>
      </div>
    </a>'''

    chips = '<button type="button" class="chip on" data-filter="*">全部 %d</button>' % len(cards)
    for mid, zh in mods:
        n = sum(1 for c in cards if c["modId"] == mid)
        chips += '<button type="button" class="chip" data-filter="%s">%s %d</button>' % (esc(mid), esc(zh), n)

    page = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>教学模型库 · 离线版</title>
<style>
  :root{{--ink:#173e49;--muted:#577580;--green:#207a68;--green-d:#196452;--mint:#e6f4ee;
        --line:#cddfd9;--paper:#fff;--bg:#f3f8f6;--shadow:0 10px 28px #234f490a}}
  *{{box-sizing:border-box}}
  body{{margin:0;font:15px/1.65 "Microsoft YaHei","PingFang SC",system-ui,sans-serif;color:var(--ink);
       background:radial-gradient(ellipse at 15% 0,#e6f4ee,transparent 44rem),
                  radial-gradient(ellipse at 100% 30%,#e0f1f4,transparent 38rem),var(--bg);
       min-height:100vh}}
  a{{color:inherit;text-decoration:none}}
  .wrap{{max-width:1560px;margin:auto;padding:34px clamp(18px,3vw,44px) 70px}}
  header.top{{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;
              padding-bottom:20px;border-bottom:1px solid var(--line);margin-bottom:24px}}
  .eyebrow{{font:800 10px/1.7 system-ui;letter-spacing:2px;color:var(--green);margin:0 0 8px}}
  h1{{font-size:clamp(26px,3vw,38px);line-height:1.25;margin:0 0 8px;letter-spacing:-.5px}}
  .sub{{margin:0;color:var(--muted);font-size:13px}}
  .stats{{display:flex;gap:26px;flex-wrap:wrap}}
  .stats div{{text-align:right}}
  .stats b{{display:block;font-size:26px;line-height:1.1;color:var(--green-d)}}
  .stats span{{font-size:11px;color:var(--muted);letter-spacing:.5px}}
  .tools{{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px}}
  .tools input{{flex:1 1 240px;min-width:0;padding:11px 15px;border:1px solid var(--line);border-radius:11px;
               background:var(--paper);font:inherit;font-size:14px;outline:0}}
  .tools input:focus{{border-color:var(--green);box-shadow:0 0 0 3px #56ad9423}}
  .chip{{border:1px solid var(--line);background:var(--paper);color:var(--muted);border-radius:100px;
        padding:8px 15px;font:600 12px/1 inherit;cursor:pointer;transition:.15s;white-space:nowrap}}
  .chip:hover{{color:var(--green-d);border-color:var(--green)}}
  .chip.on{{background:var(--green);border-color:var(--green);color:#fff}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:18px}}
  .card{{display:flex;flex-direction:column;background:var(--paper);border:1px solid var(--line);
        border-radius:18px;overflow:hidden;box-shadow:var(--shadow);transition:.18s}}
  .card:hover{{transform:translateY(-3px);box-shadow:0 16px 38px #234f4914;border-color:#a9d3c3}}
  .cover{{position:relative;aspect-ratio:16/10;background:linear-gradient(135deg,#eef7f2,#e4f2f6);overflow:hidden}}
  .cover img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}}
  .body{{padding:14px 16px 17px;display:flex;flex-direction:column;gap:5px}}
  .tags{{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:3px}}
  .tag{{font:600 10px/1 inherit;padding:5px 9px;border-radius:99px;background:var(--mint);color:var(--green-d)}}
  .tag.tech{{background:#e6effa;color:#2b5f8f}}
  .tag.tech3d{{background:#efe7fb;color:#5b3f96}}
  .tag.stage{{background:#faf1e2;color:#8a6320}}
  h3{{font-size:16px;line-height:1.45;margin:0}}
  .en{{margin:0;font:400 11px/1.4 system-ui;color:#8aa0a8;letter-spacing:.3px}}
  .sum{{margin:4px 0 0;font-size:12px;line-height:1.65;color:var(--muted);
       display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}
  .empty{{grid-column:1/-1;text-align:center;padding:70px 20px;color:var(--muted)}}
  footer{{margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-size:11px;
         color:var(--muted);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}}
  @media(max-width:640px){{.stats{{gap:18px}} .stats b{{font-size:21px}}}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div>
      <p class="eyebrow">BIOLOGY MODEL LIBRARY · OFFLINE</p>
      <h1>教学模型库</h1>
      <p class="sub">共 {len(cards)} 个交互模型，已全部下载到本地，点击即可打开，无需联网。</p>
    </div>
    <div class="stats">
      <div><b>{len(cards)}</b><span>个模型</span></div>
      <div><b>{len(mods)}</b><span>个模块</span></div>
      <div><b>{sum(1 for c in cards if c["is3d"])}</b><span>3D 模型</span></div>
    </div>
  </header>

  <div class="tools">
    <input type="search" id="q" placeholder="搜索模型名称或知识点…" aria-label="搜索模型">
  </div>
  <div class="tools" id="chips">{chips}</div>

  <div class="grid" id="grid">
{chr(10).join(card_html(c) for c in cards)}
    <div class="empty" id="empty" hidden>没有匹配的模型，换个关键词试试。</div>
  </div>

  <footer>
    <span>安德生物工作室 · 本地离线镜像</span>
    <span>模型为自包含应用，可单独复制目录到其他电脑使用</span>
  </footer>
</div>
<script>
(function(){{
  var grid=document.getElementById('grid'), q=document.getElementById('q'),
      empty=document.getElementById('empty'), chips=document.getElementById('chips'),
      mod='*', kw='';
  var cards=[].slice.call(grid.querySelectorAll('.card'));
  function apply(){{
    var shown=0;
    cards.forEach(function(c){{
      var okMod = mod==='*' || c.getAttribute('data-mod')===mod;
      var okKw = !kw || c.getAttribute('data-text').indexOf(kw)>=0;
      var show = okMod && okKw;
      c.hidden = !show;
      if(show) shown++;
    }});
    empty.hidden = shown>0;
  }}
  q.addEventListener('input', function(){{ kw=this.value.trim().toLowerCase(); apply(); }});
  chips.addEventListener('click', function(e){{
    var b=e.target.closest('.chip'); if(!b) return;
    [].forEach.call(chips.querySelectorAll('.chip'), function(x){{ x.classList.remove('on'); }});
    b.classList.add('on'); mod=b.getAttribute('data-filter'); apply();
  }});
}})();
</script>
</body>
</html>
'''
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(page)
    print("已生成 %s（%d 个模型 / %d 个模块，%.1f KB）"
          % (OUT, len(cards), len(mods), len(page.encode("utf-8")) / 1024))


if __name__ == "__main__":
    main()
