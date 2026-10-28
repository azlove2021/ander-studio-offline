"use strict";

const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"dna-transcription","version":"2.2.4","publish":true,"title":{"zh":"DNA转录与RNA加工模型（2D）","en":"DNA Transcription and RNA Processing Model (2D)"},"summary":{"zh":"连续展示RNA聚合酶识别启动子、形成转录泡、沿模板链合成前体mRNA，并经剪接、加帽和加尾形成成熟mRNA。","en":"Explore promoter recognition, transcription-bubble formation, pre-mRNA synthesis, splicing, capping and polyadenylation as one continuous process."},"module":{"id":"molecular-genetics","zh":"遗传信息的转录与加工","en":"Transcription and Processing of Genetic Information"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"promoter-recognition","title":{"zh":"识别启动子","en":"Promoter Recognition"}},{"id":"bubble-formation","title":{"zh":"形成转录泡","en":"Transcription Bubble Formation"}},{"id":"elongation","title":{"zh":"延伸前体mRNA","en":"Pre-mRNA Elongation"}},{"id":"termination","title":{"zh":"终止与释放","en":"Termination and Release"}},{"id":"rna-processing","title":{"zh":"RNA加工成熟","en":"RNA Processing"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","scene-view.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const MODEL_CONTENT = {
  id: "dna-transcription",
  title: "DNA转录与RNA加工模型（2D）",
  titleEn: "DNA Transcription and RNA Processing Model (2D)",
  chapter: "遗传信息的转录与加工 / Transcription and Processing of Genetic Information",
  stages: [
    { id: "promoter-recognition", title: "识别启动子", titleEn: "Promoter Recognition", summary: "巨大的RNA聚合酶从左侧进入，识别基因上游启动子并稳定结合。" },
    { id: "bubble-formation", title: "形成转录泡", titleEn: "Transcription Bubble Formation", summary: "RNA聚合酶局部打开DNA双链并包裹转录泡，模板链在酶内部暴露。" },
    { id: "elongation", title: "延伸前体mRNA", titleEn: "Pre-mRNA Elongation", summary: "RNA的3′端在转录泡内与模板短暂配对并按5′→3′延伸，较早合成的部分连续弯出形成直链。" },
    { id: "termination", title: "终止与释放", titleEn: "Termination and Release", summary: "聚合酶识别终止信号；前体mRNA脱离，聚合酶离开，DNA双链重新闭合。" },
    { id: "rna-processing", title: "RNA加工成熟", titleEn: "RNA Processing", summary: "剪接体切除内含子并连接外显子，随后添加5′帽和3′多聚A尾。" },
  ],
};

const STRUCTURES = [
  { id: "rna-polymerase", name: "RNA聚合酶", en: "RNA Polymerase", role: "催化转录", color: "#5a72c9", detail: "多结构域大分子酶，结合时包裹整个转录泡；半透明显示便于观察内部DNA和新生RNA。" },
  { id: "transcription-bubble", name: "转录泡", en: "Transcription Bubble", role: "局部解链", color: "#34a0a4", detail: "DNA只在聚合酶内部局部打开，聚合酶后方的亲代双链随即重新配对。" },
  { id: "pre-mrna", name: "前体mRNA", en: "pre-mRNA", role: "初始产物", color: "#20b889", detail: "转录直接得到的RNA同时包含外显子和内含子，尚不是成熟mRNA。" },
  { id: "spliceosome", name: "剪接体", en: "Spliceosome", role: "剪接RNA", color: "#f49d3f", detail: "依次识别内含子边界，使内含子弯曲成套索并被物理切除，再连接外显子。" },
  { id: "cap", name: "5′帽", en: "5′ Cap", role: "修饰5′端", color: "#f04f78", detail: "加帽酶在成熟RNA的5′端添加帽结构，帮助保护RNA并参与后续识别。" },
  { id: "poly-a", name: "多聚A尾", en: "Poly(A) Tail", role: "修饰3′端", color: "#8b5cf6", detail: "多聚A聚合酶在3′端添加一串腺嘌呤核苷酸，形成多聚A尾。" },
];

const SPEEDS = [0.65, 1, 1.4, 1.8];
const STAGE_DURATION = 6200;
const state = { stageIndex: 0, stageProgress: 0, playing: false, speedIndex: 1, labels: true, highlight: true, activeStructure: "", lastTime: 0 };
const root = document.querySelector("[data-independent-model-root]");
let sceneView = null;
let shellExperience = null;
let lastStageInfo = -1;
const controlSignatures = new Map();
let hostLastReport = 0, hostLastStage = -1;
const hostOrigin = document.referrer ? new URL(document.referrer).origin : '*';

function resolveModelLibraryUrl() {
  const requested = new URLSearchParams(window.location.search).get("return");
  if (requested) {
    try {
      const url = new URL(requested, window.location.href);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch (_) {}
  }
  if (document.referrer) return document.referrer;
  return new URL("../../../../index.html", window.location.href).href;
}

root.innerHTML = `
  <main class="independent-model-app" data-model-app>
    <header class="independent-model-header">
      <a class="independent-model-back" href="${resolveModelLibraryUrl()}" aria-label="返回主页">
        <span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span>
        <span class="independent-model-back-label"><span>返回</span><span>主页</span></span>
      </a>
      <div class="independent-model-heading">
        <span class="independent-model-kicker">${MODEL_CONTENT.chapter}</span>
        <h1>${MODEL_CONTENT.title} <small>/ ${MODEL_CONTENT.titleEn}</small></h1>
      </div>
      <button class="shell-icon-button" type="button" data-transcription-settings></button>
    </header>

    <section class="independent-model-workspace">
      <section class="model-area" data-model-area>
        <nav class="stage-strip" data-stage-strip aria-label="DNA转录与RNA加工阶段"></nav>
        <div class="model-stage">
          <div class="transcription-workbench">
            <section class="transcription-scene-panel" aria-label="DNA转录动画工作区">
              <svg class="transcription-scene" data-scene viewBox="0 0 1100 650" role="img" aria-labelledby="sceneTitle sceneDescription">
                <title id="sceneTitle">DNA转录与RNA加工二维模型</title>
                <desc id="sceneDescription">展示RNA聚合酶识别启动子、形成转录泡、合成前体mRNA，以及剪接、加帽和加尾的连续过程。</desc>
                <defs>
                  <filter id="strandShadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#17384a" flood-opacity=".17"/></filter>
                  <filter id="rnaGlow" filterUnits="userSpaceOnUse" x="0" y="0" width="1100" height="650"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#4ee5bc" flood-opacity=".58"/></filter>
                  <filter id="structureFocus" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ffd65a" flood-opacity=".95"/></filter>
                  <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" fill="#31816e"/></marker>
                  <linearGradient id="spliceGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd98a"/><stop offset=".48" stop-color="#f49d3f"/><stop offset="1" stop-color="#b75b2b"/></linearGradient>
                  <linearGradient id="capGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff9bb2"/><stop offset="1" stop-color="#e83266"/></linearGradient>
                  <linearGradient id="tailGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c4b5fd"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
                </defs>
                <rect x="10" y="10" width="1080" height="630" rx="24" fill="#fbfefe"/>

                <g data-gene-map>
                  <text class="gene-title" x="70" y="182">DNA上的基因（矩形标示各区段）/ Gene regions on DNA</text>
                  <g data-gene-regions></g>
                </g>

                <g class="structure-node" data-structure-node="transcription-bubble">
                  <ellipse data-bubble-glow cx="190" cy="263" rx="95" ry="78" fill="#58d1c0" opacity="0"/>
                </g>
                <g data-base-compounds></g>
                <path class="dna-backbone" data-dna-top/>
                <path class="dna-backbone" data-dna-bottom/>
                <g data-dna-region-strands></g>

                <g class="structure-node polymerase-node" data-structure-node="rna-polymerase" data-polymerase opacity="0">
                  <image class="polymerase-image" href="assets/rna-polymerase.webp" x="-125" y="-125" width="250" height="250" preserveAspectRatio="xMidYMid meet"/>
                  <text class="enzyme-caption" x="0" y="139">RNA聚合酶</text>
                  <text class="enzyme-caption-small" x="0" y="155">RNA Polymerase</text>
                </g>

                <g class="structure-node" data-structure-node="pre-mrna">
                  <g data-rna-base-compounds></g>
                  <path class="rna-path rna-exon rna-nascent" data-rna-exon-1 fill="none" stroke="#20b889" stroke-width="9"/>
                  <path class="rna-path rna-intron rna-nascent" data-rna-intron-1 fill="none" stroke="#f49d3f" stroke-width="9"/>
                  <path class="rna-path rna-exon rna-nascent" data-rna-exon-2 fill="none" stroke="#20b889" stroke-width="9"/>
                  <path class="rna-path rna-intron rna-nascent" data-rna-intron-2 fill="none" stroke="#f49d3f" stroke-width="9"/>
                  <path class="rna-path rna-exon rna-nascent" data-rna-exon-3 fill="none" stroke="#20b889" stroke-width="9"/>
                  <text class="end-label rna" data-rna-five>5′</text>
                  <text class="end-label rna" data-rna-three>3′</text>
                  <text class="model-label" data-rna-label>前体mRNA pre-mRNA</text>
                </g>

                <g class="structure-node" data-structure-node="spliceosome" data-spliceosome-1 opacity="0">
                  <image class="processing-enzyme-image" href="assets/spliceosome.webp" x="-54" y="-54" width="108" height="108"/>
                  <text class="enzyme-caption" x="0" y="-61">剪接体</text><text class="enzyme-caption-small" x="0" y="-47">Spliceosome</text>
                </g>
                <g class="structure-node" data-structure-node="spliceosome" data-spliceosome-2 opacity="0">
                  <image class="processing-enzyme-image" href="assets/spliceosome.webp" x="-54" y="-54" width="108" height="108"/>
                  <text class="enzyme-caption" x="0" y="-61">剪接体</text><text class="enzyme-caption-small" x="0" y="-47">Spliceosome</text>
                </g>
                <g data-cut-marks opacity="0"><path class="cut-mark" data-cut-left d="M-6 -10 6 10M6 -10-6 10"/><path class="cut-mark" data-cut-right d="M-6 -10 6 10M6 -10-6 10"/></g>

                <g class="structure-node" data-structure-node="cap" data-cap-enzyme opacity="0">
                  <image class="processing-enzyme-image" href="assets/capping-enzyme.webp" x="-49" y="-49" width="98" height="98"/>
                  <text class="enzyme-caption" x="0" y="-56">加帽酶</text><text class="enzyme-caption-small" x="0" y="-42">Capping enzyme</text>
                </g>
                <g class="structure-node" data-structure-node="cap" data-cap opacity="0"><path class="cap-symbol" d="M0-15 13-7 13 8 0 16-13 8-13-7z"/><text class="cap-text" x="0" y="1">CAP</text></g>

                <g class="structure-node" data-structure-node="poly-a" data-tail-enzyme opacity="0">
                  <image class="processing-enzyme-image" href="assets/poly-a-polymerase.webp" x="-52" y="-52" width="104" height="104"/>
                  <text class="enzyme-caption" x="0" y="-59">多聚A聚合酶</text><text class="enzyme-caption-small" x="0" y="-45">Poly(A) polymerase</text>
                </g>
                <g class="structure-node" data-structure-node="poly-a" data-poly-a opacity="0"><path class="poly-a-path" data-poly-a-path/><text class="model-label" data-poly-a-label>多聚A尾 Poly(A) tail</text></g>

                <g data-direction-labels>
                  <path class="process-arrow" data-rna-arrow opacity="0"/>
                  <text class="model-label" data-rna-arrow-label opacity="0">RNA合成方向 5′ → 3′</text>
                  <text class="end-label" x="58" y="247">5′</text><text class="end-label" x="1022" y="247">3′</text>
                  <text class="end-label" x="58" y="302">3′</text><text class="end-label" x="1022" y="302">5′</text>
                  <text class="model-label subtle" x="62" y="333">下链为模板链 / Template strand</text>
                  <text class="model-label" data-mature-label x="160" y="385" opacity="0">成熟mRNA Mature mRNA</text>
                </g>
              </svg>
            </section>

            <aside class="transcription-info" aria-live="polite">
              <section class="stage-status">
                <p class="stage-status-kicker" data-stage-kicker>STAGE 01 / 05</p>
                <h2 data-stage-title>识别启动子<small data-stage-title-en>Promoter Recognition</small></h2>
                <p data-stage-summary></p>
              </section>
              <div class="direction-rule"><strong>转录方向的绝对规则</strong><span class="direction-main">RNA始终 5′ → 3′ 合成</span><br/>RNA聚合酶沿DNA模板链3′→5′移动，新的核糖核苷酸连接到RNA的3′端。</div>
              <div class="structure-panel-title"><strong>结构与加工因子</strong><span>再次点击可取消聚焦</span></div>
              <div class="structure-buttons" data-structure-buttons></div>
              <div class="structure-detail" data-structure-detail><strong>观察提示：</strong>选择结构可聚焦其当前位置与形态变化。</div>
              <div class="legend-row">
                <span class="legend-pill"><i class="legend-line" style="--legend:#273f59"></i>DNA亲代链</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#20b889"></i>外显子RNA</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#f49d3f"></i>内含子RNA</span>
              </div>
            </aside>
          </div>
          <button class="shell-action transcription-context-trigger" type="button" data-transcription-context>阶段与结构 ↗</button>
        </div>

        <div class="control-dock" data-control-dock>
          <div class="control-group control-group-primary">
            <button class="control-button is-primary" type="button" data-action="play"></button>
            <button class="control-button" type="button" data-action="reset"></button>
            <button class="control-button" type="button" data-action="prev"></button>
            <button class="control-button" type="button" data-action="next"></button>
          </div>
          <label class="timeline-wrap"><span>过程进度</span><input data-timeline type="range" aria-label="过程进度" min="0" max="5000" value="0"/><output data-progress-label>0%</output></label>
          <div class="control-group control-group-view">
            <button class="control-button" type="button" data-action="speed"></button>
            <button class="control-button" type="button" data-action="labels"></button>
            <button class="control-button" type="button" data-action="highlight"></button>
            <button class="control-button" type="button" data-scene-follow></button>
            <button class="control-button" type="button" data-scene-mode></button>
          </div>
          <button class="control-button" type="button" data-shell-tools></button>
          <div class="control-group control-group-personal">
            <button class="control-button" type="button" data-shell-help></button>
            <button class="control-button" type="button" data-shell-favorite></button>
            <button class="control-button" type="button" data-action="fullscreen"></button>
          </div>
        </div>
      </section>
    </section>
  </main>`;

const refs = {
  app: root.querySelector("[data-model-app]"), modelArea: root.querySelector("[data-model-area]"), scene: root.querySelector("[data-scene]"),
  stageStrip: root.querySelector("[data-stage-strip]"), stageKicker: root.querySelector("[data-stage-kicker]"), stageTitle: root.querySelector("[data-stage-title]"), stageTitleEn: root.querySelector("[data-stage-title-en]"), stageSummary: root.querySelector("[data-stage-summary]"),
  structureButtons: root.querySelector("[data-structure-buttons]"), structureDetail: root.querySelector("[data-structure-detail]"), timeline: root.querySelector("[data-timeline]"),
  geneRegions: root.querySelector("[data-gene-regions]"), dnaRegionStrands: root.querySelector("[data-dna-region-strands]"), baseCompounds: root.querySelector("[data-base-compounds]"), rnaBaseCompounds: root.querySelector("[data-rna-base-compounds]"), dnaTop: root.querySelector("[data-dna-top]"), dnaBottom: root.querySelector("[data-dna-bottom]"), bubbleGlow: root.querySelector("[data-bubble-glow]"), polymerase: root.querySelector("[data-polymerase]"),
  rnaExon1: root.querySelector("[data-rna-exon-1]"), rnaIntron1: root.querySelector("[data-rna-intron-1]"), rnaExon2: root.querySelector("[data-rna-exon-2]"), rnaIntron2: root.querySelector("[data-rna-intron-2]"), rnaExon3: root.querySelector("[data-rna-exon-3]"), rnaFive: root.querySelector("[data-rna-five]"), rnaThree: root.querySelector("[data-rna-three]"), rnaLabel: root.querySelector("[data-rna-label]"),
  spliceosome1: root.querySelector("[data-spliceosome-1]"), spliceosome2: root.querySelector("[data-spliceosome-2]"), cutMarks: root.querySelector("[data-cut-marks]"), cutLeft: root.querySelector("[data-cut-left]"), cutRight: root.querySelector("[data-cut-right]"), capEnzyme: root.querySelector("[data-cap-enzyme]"), cap: root.querySelector("[data-cap]"), tailEnzyme: root.querySelector("[data-tail-enzyme]"), polyA: root.querySelector("[data-poly-a]"), polyAPath: root.querySelector("[data-poly-a-path]"), polyALabel: root.querySelector("[data-poly-a-label]"), rnaArrow: root.querySelector("[data-rna-arrow]"), rnaArrowLabel: root.querySelector("[data-rna-arrow-label]"), matureLabel: root.querySelector("[data-mature-label]"),
};

const NS = "http://www.w3.org/2000/svg";
const BASE_COUNT = 64;
const X_MIN = 70;
const X_MAX = 1030;
const DNA_CENTER = 275;
const OPEN_GAP = 122;
const HELIX_AMPLITUDE = 19;
const RNA_BASE_COUNT = 56;
const baseNodes = [];
const rnaBaseNodes = [];
const dnaRegionNodes = [];
const baseColors = ["#ef647f", "#37b98d", "#f2b63d", "#3187c7"];
const GENE_REGIONS = [
  { id: "promoter", start: 110, end: 200, className: "promoter", label: "启动子 Promoter" },
  { id: "exon-1", start: 200, end: 350, className: "exon", label: "外显子1 Exon 1" },
  { id: "intron-1", start: 350, end: 460, className: "intron", label: "内含子1 Intron 1" },
  { id: "exon-2", start: 460, end: 620, className: "exon", label: "外显子2 Exon 2" },
  { id: "intron-2", start: 620, end: 730, className: "intron", label: "内含子2 Intron 2" },
  { id: "exon-3", start: 730, end: 890, className: "exon", label: "外显子3 Exon 3" },
  { id: "terminator", start: 900, end: 990, className: "terminator", label: "终止子 Terminator" },
];

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function installGeneMap() {
  GENE_REGIONS.forEach((region) => {
    const width = region.end - region.start;
    refs.geneRegions.append(svgEl("rect", { x: region.start, y: 192, width, height: 145, rx: 8, class: `gene-region region-${region.className}` }));
    const text = svgEl("text", { x: region.start + width / 2, y: 211, class: "gene-region-label" });
    text.textContent = region.label;
    refs.geneRegions.append(text);
    const top = svgEl("path", { class: `dna-region-backbone dna-region-${region.className}` });
    const bottom = svgEl("path", { class: `dna-region-backbone dna-region-${region.className}` });
    refs.dnaRegionStrands.append(top, bottom);
    dnaRegionNodes.push({ region, top, bottom });
  });
}

function installBases() {
  for (let i = 0; i < BASE_COUNT; i += 1) {
    const group = svgEl("g", { class: "base-compound" });
    const top = svgEl("path", { class: "base-line" });
    const bottom = svgEl("path", { class: "base-line" });
    const bond = svgEl("path", { class: "hydrogen-bond" });
    group.append(top, bottom, bond);
    refs.baseCompounds.append(group);
    baseNodes.push({ group, top, bottom, bond });
  }
}

function installRnaBases() {
  for (let i = 0; i < RNA_BASE_COUNT; i += 1) {
    const group = svgEl("g", { class: "rna-base-compound", opacity: 0 });
    const base = svgEl("path", { class: "rna-base-line" });
    const bond = svgEl("path", { class: "rna-hydrogen-bond" });
    group.append(base, bond);
    refs.rnaBaseCompounds.append(group);
    rnaBaseNodes.push({ group, base, bond });
  }
}

installGeneMap();
installBases();
installRnaBases();

function clamp(v, min = 0, max = 1) { return Math.min(max, Math.max(min, v)); }
function mix(a, b, t) { return a + (b - a) * t; }
function smooth(t) { const x = clamp(t); return x * x * (3 - 2 * x); }
function windowProgress(p, start, end) { return smooth((p - start) / (end - start)); }
function opacityWindow(p, enterStart, enterEnd, exitStart, exitEnd) { return windowProgress(p, enterStart, enterEnd) * (1 - windowProgress(p, exitStart, exitEnd)); }
function pathFrom(points) { return points.length ? points.map((pt, index) => `${index ? "L" : "M"}${pt[0].toFixed(3)} ${pt[1].toFixed(3)}`).join(" ") : ""; }

function globalProgress() { return (state.stageIndex + state.stageProgress) / MODEL_CONTENT.stages.length; }

function polymeraseState(p) {
  if (p < .12) return { x: mix(-135, 185, smooth(p / .12)), y: 275, opacity: windowProgress(p, .01, .055), bound: false };
  if (p < .2) return { x: mix(185, 235, smooth((p - .12) / .08)), y: 275, opacity: 1, bound: true };
  if (p < .68) return { x: mix(235, 925, smooth((p - .2) / .48)), y: 275, opacity: 1, bound: true };
  if (p < .79) return { x: mix(925, 1215, smooth((p - .68) / .11)), y: 275, opacity: 1 - windowProgress(p, .72, .79), bound: p < .73 };
  return { x: 1215, y: 275, opacity: 0, bound: false };
}

function bubbleAmount(p) {
  return windowProgress(p, .12, .19) * (1 - windowProgress(p, .69, .76));
}

function dnaPoint(x, strand, pol, bubble) {
  const wave = Math.sin((x - X_MIN) * Math.PI / 34);
  const closedY = DNA_CENTER + strand * HELIX_AMPLITUDE * wave;
  const distance = Math.abs(x - pol.x);
  const localOpen = bubble * smooth((108 - distance) / 42);
  const openY = DNA_CENTER + strand * (OPEN_GAP / 2 + Math.sin((x - pol.x) * .045) * 5);
  return mix(closedY, openY, localOpen);
}

function updateDna(p, pol) {
  const bubble = bubbleAmount(p);
  const topPoints = [];
  const bottomPoints = [];
  for (let i = 0; i <= 128; i += 1) {
    const x = mix(X_MIN, X_MAX, i / 128);
    topPoints.push([x, dnaPoint(x, -1, pol, bubble)]);
    bottomPoints.push([x, dnaPoint(x, 1, pol, bubble)]);
  }
  refs.dnaTop.setAttribute("d", pathFrom(topPoints));
  refs.dnaBottom.setAttribute("d", pathFrom(bottomPoints));
  dnaRegionNodes.forEach(({ region, top, bottom }) => {
    const count = Math.max(4, Math.ceil((region.end - region.start) / 7));
    const regionTop = [];
    const regionBottom = [];
    for (let index = 0; index <= count; index += 1) {
      const x = mix(region.start, region.end, index / count);
      regionTop.push([x, dnaPoint(x, -1, pol, bubble)]);
      regionBottom.push([x, dnaPoint(x, 1, pol, bubble)]);
    }
    top.setAttribute("d", pathFrom(regionTop));
    bottom.setAttribute("d", pathFrom(regionBottom));
  });

  baseNodes.forEach((node, index) => {
    const x = mix(X_MIN + 7, X_MAX - 7, index / (BASE_COUNT - 1));
    const yTop = dnaPoint(x, -1, pol, bubble);
    const yBottom = dnaPoint(x, 1, pol, bubble);
    const localOpen = bubble * smooth((103 - Math.abs(x - pol.x)) / 38);
    const middle = (yTop + yBottom) / 2;
    const direction = Math.sign(yBottom - yTop) || 1;
    const topInner = mix(middle - direction * 2, yTop + direction * 21, localOpen);
    const bottomInner = mix(middle + direction * 2, yBottom - direction * 21, localOpen);
    node.top.setAttribute("d", `M${x} ${yTop} L${x} ${topInner}`);
    node.bottom.setAttribute("d", `M${x} ${yBottom} L${x} ${bottomInner}`);
    node.bond.setAttribute("d", `M${x} ${topInner} L${x} ${bottomInner}`);
    node.bond.setAttribute("opacity", String(1 - localOpen));
    node.top.setAttribute("stroke", baseColors[index % 4]);
    node.bottom.setAttribute("stroke", baseColors[(index + 2) % 4]);
  });

  refs.bubbleGlow.setAttribute("cx", pol.x);
  refs.bubbleGlow.setAttribute("cy", pol.y);
  refs.bubbleGlow.setAttribute("opacity", String(.16 * bubble));
  refs.bubbleGlow.setAttribute("rx", String(102 + 5 * bubble));
}

const RNA_REGIONS = [
  { ref: "rnaExon1", start: 200, end: 350, type: "exon" },
  { ref: "rnaIntron1", start: 350, end: 460, type: "intron" },
  { ref: "rnaExon2", start: 460, end: 620, type: "exon" },
  { ref: "rnaIntron2", start: 620, end: 730, type: "intron" },
  { ref: "rnaExon3", start: 730, end: 890, type: "exon" },
];

function setSampledSegment(node, start, end, visibleEnd, pointForX, opacity = 1) {
  const actualEnd = Math.min(end, visibleEnd);
  if (actualEnd <= start + .5 || opacity <= .005) {
    node.setAttribute("d", "");
    node.setAttribute("opacity", "0");
    return false;
  }
  const count = Math.max(2, Math.ceil((actualEnd - start) / 9));
  const points = [];
  for (let index = 0; index <= count; index += 1) {
    const x = mix(start, actualEnd, index / count);
    points.push(pointForX(x));
  }
  node.setAttribute("d", pathFrom(points));
  node.setAttribute("opacity", String(opacity));
  return true;
}

function loopSegmentPoint(start, end, y, amount, t) {
  const loopWidth = 46 * amount;
  const loopHeight = 88 * amount;
  return [
    mix(start, end, t) + loopWidth * Math.sin(Math.PI * 2 * t),
    y - loopHeight * Math.sin(Math.PI * t),
  ];
}

function loopSegmentPath(start, end, y, amount) {
  const points = [];
  for (let index = 0; index <= 32; index += 1) {
    const t = index / 32;
    points.push(loopSegmentPoint(start, end, y, amount, t));
  }
  return pathFrom(points);
}

function nascentRnaPoint(x, p, pol, rnaY) {
  const release = windowProgress(p, .68, .76);
  const activePolX = Math.min(pol.x, 925);
  const pairStart = activePolX - 74;
  const exitStart = activePolX - 142;
  const templateY = dnaPoint(x, 1, { ...pol, x: activePolX }, bubbleAmount(p));
  const pairedY = templateY - 38;
  let y = rnaY;
  if (x >= pairStart) y = pairedY;
  else if (x > exitStart) y = mix(rnaY, pairedY, smooth((x - exitStart) / (pairStart - exitStart)));
  return [x, mix(y, rnaY, release)];
}

function setRnaBaseGeometry(node, index, point, tangentPoint, opacity, pairedTarget = null) {
  const dx = tangentPoint[0] - point[0];
  const dy = tangentPoint[1] - point[1];
  const length = Math.hypot(dx, dy) || 1;
  let normalX = -dy / length;
  let normalY = dx / length;
  if (normalY < 0) { normalX *= -1; normalY *= -1; }
  const start = [point[0] + normalX * 3, point[1] + normalY * 3];
  const end = [point[0] + normalX * 16, point[1] + normalY * 16];
  node.base.setAttribute("d", `M${start[0]} ${start[1]} L${end[0]} ${end[1]}`);
  node.base.setAttribute("stroke", baseColors[(index + 1) % baseColors.length]);
  if (pairedTarget) {
    node.bond.setAttribute("d", `M${end[0]} ${end[1]} L${pairedTarget[0]} ${pairedTarget[1]}`);
    node.bond.setAttribute("opacity", "1");
  } else {
    node.bond.setAttribute("d", "");
    node.bond.setAttribute("opacity", "0");
  }
  node.group.setAttribute("opacity", String(opacity));
}

function updateTranscribingRnaBases(p, pol, visibleEnd, rnaY) {
  const activePolX = Math.min(pol.x, 925);
  const pairStart = activePolX - 74;
  const pairEnd = Math.min(visibleEnd, activePolX - 8);
  rnaBaseNodes.forEach((node, index) => {
    const x = mix(200, 890, index / (RNA_BASE_COUNT - 1));
    const visible = p >= .18 && x <= visibleEnd;
    if (!visible) {
      node.group.setAttribute("opacity", "0");
      return;
    }
    const point = nascentRnaPoint(x, p, pol, rnaY);
    const tangentPoint = nascentRnaPoint(x < 889 ? x + 1 : x - 1, p, pol, rnaY);
    const paired = p < .71 && x >= pairStart && x <= pairEnd;
    const templateY = paired ? dnaPoint(x, 1, { ...pol, x: activePolX }, bubbleAmount(p)) : 0;
    setRnaBaseGeometry(node, index, point, tangentPoint, 1, paired ? [x, templateY - 21] : null);
  });
}

function processingRnaPoint(originalX, p, rna) {
  const y = rna.rnaY;
  if (originalX <= 350) return { point: [originalX, y], opacity: 1 };
  if (originalX <= 460) {
    return { point: loopSegmentPoint(rna.joints[1], rna.joints[2], y, rna.splice1, (originalX - 350) / 110), opacity: 1 - windowProgress(p, .855, .875) };
  }
  if (originalX <= 620) return { point: [originalX - rna.shift1, y], opacity: 1 };
  if (originalX <= 730) {
    return { point: loopSegmentPoint(rna.joints[3], rna.joints[4], y, rna.splice2, (originalX - 620) / 110), opacity: 1 - windowProgress(p, .925, .945) };
  }
  return { point: [originalX - rna.shift1 - rna.shift2, y], opacity: 1 };
}

function updateProcessingRnaBases(p, rna) {
  rnaBaseNodes.forEach((node, index) => {
    const x = mix(200, 890, index / (RNA_BASE_COUNT - 1));
    const current = processingRnaPoint(x, p, rna);
    const next = processingRnaPoint(x < 889.2 ? x + .8 : x - .8, p, rna);
    setRnaBaseGeometry(node, index, current.point, next.point, current.opacity);
  });
}

function updateRna(p, pol) {
  const transcribe = windowProgress(p, .18, .68);
  const visibleEnd = mix(200, 890, transcribe);
  const release = windowProgress(p, .68, .76);
  const rnaY = mix(430, 455, release);
  const splice1 = windowProgress(p, .80, .855);
  const splice2 = windowProgress(p, .87, .925);
  const intron1Fade = 1 - windowProgress(p, .855, .875);
  const intron2Fade = 1 - windowProgress(p, .925, .945);
  const shift1 = 110 * splice1;
  const shift2 = 110 * splice2;
  let joints = [200, 350, 460, 620, 730, 890];

  if (p < .79) {
    const pointForX = (x) => nascentRnaPoint(x, p, pol, rnaY);
    RNA_REGIONS.forEach((region) => setSampledSegment(refs[region.ref], region.start, region.end, visibleEnd, pointForX));
    updateTranscribingRnaBases(p, pol, visibleEnd, rnaY);
  } else {
    joints = [200, 350, 460 - shift1, 620 - shift1, 730 - shift1 - shift2, 890 - shift1 - shift2];
    refs.rnaExon1.setAttribute("d", `M${joints[0]} ${rnaY} L${joints[1]} ${rnaY}`);
    refs.rnaIntron1.setAttribute("d", loopSegmentPath(joints[1], joints[2], rnaY, splice1));
    refs.rnaIntron1.setAttribute("opacity", String(intron1Fade));
    refs.rnaExon2.setAttribute("d", `M${joints[2]} ${rnaY} L${joints[3]} ${rnaY}`);
    refs.rnaIntron2.setAttribute("d", loopSegmentPath(joints[3], joints[4], rnaY, splice2));
    refs.rnaIntron2.setAttribute("opacity", String(intron2Fade));
    refs.rnaExon3.setAttribute("d", `M${joints[4]} ${rnaY} L${joints[5]} ${rnaY}`);
    [refs.rnaExon1, refs.rnaExon2, refs.rnaExon3].forEach((node) => node.setAttribute("opacity", "1"));
    updateProcessingRnaBases(p, { rnaY, splice1, splice2, shift1, shift2, joints });
  }

  const produced = transcribe > .015;
  const startPoint = p < .79 ? nascentRnaPoint(200, p, pol, rnaY) : [joints[0], rnaY];
  const finalRnaEnd = p < .79 ? visibleEnd : joints[5];
  const endPoint = p < .79 ? nascentRnaPoint(finalRnaEnd, p, pol, rnaY) : [finalRnaEnd, rnaY];
  refs.rnaFive.setAttribute("x", String(startPoint[0] - 24));
  refs.rnaFive.setAttribute("y", String(startPoint[1] + 6));
  refs.rnaFive.setAttribute("opacity", produced ? "1" : "0");
  refs.rnaThree.setAttribute("x", String(endPoint[0] + 9));
  refs.rnaThree.setAttribute("y", String(endPoint[1] + 6));
  refs.rnaThree.setAttribute("opacity", transcribe > .05 ? "1" : "0");
  refs.rnaLabel.setAttribute("x", String(startPoint[0]));
  refs.rnaLabel.setAttribute("y", String(startPoint[1] - 22));
  refs.rnaLabel.setAttribute("opacity", produced && p < .96 ? "1" : "0");
  refs.matureLabel.setAttribute("y", String(rnaY - 24));
  refs.matureLabel.setAttribute("x", String(joints[0]));
  refs.matureLabel.setAttribute("opacity", String(windowProgress(p, .945, .975)));

  const arrowEnd = Math.max(startPoint[0] + 80, Math.min(finalRnaEnd - 18, pol.x - 145));
  refs.rnaArrow.setAttribute("d", `M${Math.max(startPoint[0], arrowEnd - 125)} ${rnaY + 42} L${arrowEnd} ${rnaY + 42}`);
  refs.rnaArrow.setAttribute("opacity", String(opacityWindow(p, .22, .27, .68, .73)));
  refs.rnaArrowLabel.setAttribute("x", String(Math.max(startPoint[0], arrowEnd - 130)));
  refs.rnaArrowLabel.setAttribute("y", String(rnaY + 70));
  refs.rnaArrowLabel.setAttribute("opacity", String(opacityWindow(p, .22, .27, .68, .73)));

  return { rnaY, splice1, splice2, shift1, shift2, joints, finalRnaEnd };
}

function updateProcessing(p, rna) {
  const s1Opacity = opacityWindow(p, .79, .805, .855, .88);
  const s2Opacity = opacityWindow(p, .86, .875, .925, .95);
  refs.spliceosome1.setAttribute("transform", `translate(${(rna.joints[1] + rna.joints[2]) / 2} ${rna.rnaY - 35})`);
  refs.spliceosome1.setAttribute("opacity", String(s1Opacity));
  refs.spliceosome2.setAttribute("transform", `translate(${(rna.joints[3] + rna.joints[4]) / 2} ${rna.rnaY - 35})`);
  refs.spliceosome2.setAttribute("opacity", String(s2Opacity));
  const firstCuts = opacityWindow(p, .835, .845, .855, .875);
  const secondCuts = opacityWindow(p, .905, .915, .925, .945);
  const cutPair = secondCuts > firstCuts ? [rna.joints[3], rna.joints[4]] : [rna.joints[1], rna.joints[2]];
  refs.cutLeft.setAttribute("transform", `translate(${cutPair[0]} ${rna.rnaY})`);
  refs.cutRight.setAttribute("transform", `translate(${cutPair[1]} ${rna.rnaY})`);
  refs.cutMarks.setAttribute("opacity", String(Math.max(firstCuts, secondCuts)));

  const capProgress = windowProgress(p, .945, .97);
  refs.capEnzyme.setAttribute("transform", `translate(185 ${rna.rnaY - 12})`);
  refs.capEnzyme.setAttribute("opacity", String(opacityWindow(p, .935, .95, .97, .99)));
  refs.cap.setAttribute("transform", `translate(185 ${rna.rnaY}) scale(${capProgress})`);
  refs.cap.setAttribute("opacity", String(capProgress));

  const tailProgress = windowProgress(p, .965, 1);
  const matureEnd = rna.finalRnaEnd;
  refs.tailEnzyme.setAttribute("transform", `translate(${matureEnd + 8} ${rna.rnaY - 12})`);
  refs.tailEnzyme.setAttribute("opacity", String(opacityWindow(p, .955, .97, .992, 1)));
  const tailEnd = matureEnd + 150 * tailProgress;
  refs.polyAPath.setAttribute("d", `M${matureEnd} ${rna.rnaY} L${tailEnd} ${rna.rnaY}`);
  refs.polyA.setAttribute("opacity", String(tailProgress));
  refs.polyALabel.setAttribute("x", String(matureEnd + 20));
  refs.polyALabel.setAttribute("y", String(rna.rnaY + 38));
}

function updatePolymerase(p, pol) {
  refs.polymerase.setAttribute("transform", `translate(${pol.x} ${pol.y})`);
  refs.polymerase.setAttribute("opacity", String(pol.opacity));
  refs.polymerase.classList.toggle("is-bound", pol.bound);
}

function updateStructureFocus() {
  const nodes = [...root.querySelectorAll("[data-structure-node]")];
  nodes.forEach((node) => {
    const match = node.dataset.structureNode === state.activeStructure;
    node.classList.toggle("is-focused", Boolean(state.activeStructure && match && state.highlight));
    node.classList.toggle("is-dimmed", Boolean(state.activeStructure && !match));
  });
  root.querySelectorAll("[data-structure-button]").forEach((button) => button.classList.toggle("is-active", button.dataset.structureButton === state.activeStructure));
}

function updateScene() {
  const p = globalProgress();
  const pol = polymeraseState(p);
  updateDna(p, pol);
  updatePolymerase(p, pol);
  const rna = updateRna(p, pol);
  updateProcessing(p, rna);
  refs.scene.classList.toggle("hidden-labels", !state.labels);
  refs.scene.classList.toggle("highlight-off", !state.highlight);
  updateStructureFocus();
  sceneView?.sync();
}

function renderStageInfo() {
  if(lastStageInfo===state.stageIndex)return;
  lastStageInfo=state.stageIndex;
  const stage = MODEL_CONTENT.stages[state.stageIndex];
  refs.stageKicker.textContent = `STAGE ${String(state.stageIndex + 1).padStart(2, "0")} / ${String(MODEL_CONTENT.stages.length).padStart(2, "0")}`;
  refs.stageTitle.firstChild.textContent = stage.title;
  refs.stageTitleEn.textContent = stage.titleEn;
  refs.stageSummary.textContent = stage.summary;
  root.querySelectorAll("[data-stage-index]").forEach((button) => {
    const active = Number(button.dataset.stageIndex) === state.stageIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
  });
  globalThis.AnderModelShell.syncActiveStage();
  shellExperience?.syncStage();
}

function renderControls() {
  const shellButton = action => root.querySelector(`[data-action="${action}"]`);
  const present=(action,kind,label,pressed)=>{
    const signature=JSON.stringify([kind,label,pressed]);
    if(controlSignatures.get(action)===signature)return;
    globalThis.AnderModelShell.setControl(shellButton(action),kind,label,pressed);
    controlSignatures.set(action,signature);
  };
  present('play',state.playing?'pause':'play',state.playing?'暂停':'播放');
  present('reset','reset','重置');present('prev','prev','上一步');present('next','next','下一步');
  present('speed','speed',`${SPEEDS[state.speedIndex]}×`);present('labels','labels','标签',state.labels);present('highlight','highlight','高亮',state.highlight);
  shellButton('prev').disabled=state.stageIndex===0;
  shellButton('next').disabled=state.stageIndex===MODEL_CONTENT.stages.length-1;
  refs.timeline.value = String(Math.round(globalProgress() * 5000));
  root.querySelector('[data-progress-label]').textContent=`${Math.round(globalProgress()*100)}%`;
  reportHostState();
}

function render() {
  renderStageInfo();
  renderControls();
  updateScene();
}

function installStageTabs() {
  refs.stageStrip.innerHTML = MODEL_CONTENT.stages.map((stage, index) => `
    <button class="stage-tab" type="button" data-stage-index="${index}">
      ${globalThis.AnderModelShell.stageContent(index, stage.title, stage.titleEn)}
    </button>`).join("");
  refs.stageStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-stage-index]");
    if (!button) return;
    state.stageIndex = Number(button.dataset.stageIndex);
    state.stageProgress = 0;
    state.playing = false;
    state.lastTime = 0;
    render();
  });
}

function installStructureButtons() {
  refs.structureButtons.innerHTML = STRUCTURES.map((item) => `
    <button class="structure-button" type="button" data-structure-button="${item.id}" style="--structure-color:${item.color}">
      <span class="structure-button-dot"></span><span><strong>${item.name}</strong><small>${item.en}</small></span><span class="structure-button-role">${item.role}</span>
    </button>`).join("");
  refs.structureButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-structure-button]");
    if (!button) return;
    const id = button.dataset.structureButton;
    state.activeStructure = state.activeStructure === id ? "" : id;
    const item = STRUCTURES.find((entry) => entry.id === state.activeStructure);
    refs.structureDetail.innerHTML = item ? `<strong>${item.name}：</strong>${item.detail}` : "<strong>观察提示：</strong>选择结构可聚焦其当前位置与形态变化。";
    render();
    sceneView?.reveal();
  });
}

function setGlobalProgress(p) {
  const scaled = clamp(p) * MODEL_CONTENT.stages.length;
  state.stageIndex = Math.min(MODEL_CONTENT.stages.length - 1, Math.floor(scaled));
  state.stageProgress = state.stageIndex === MODEL_CONTENT.stages.length - 1 && p >= 1 ? 1 : scaled - state.stageIndex;
}

function stepStage(delta) {
  state.stageIndex = clamp(state.stageIndex + delta, 0, MODEL_CONTENT.stages.length - 1);
  state.stageProgress = 0;
  state.playing = false;
  state.lastTime = 0;
  render();
}

refs.modelArea.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "fullscreen") return; // Shared shell owns both fullscreen modes.
  if (action === "play") {
    if (!state.playing && globalProgress() >= .999) setGlobalProgress(0);
    state.playing = !state.playing;
    state.lastTime = 0;
  } else if (action === "reset") {
    Object.assign(state, { stageIndex: 0, stageProgress: 0, playing: false, activeStructure: "", lastTime: 0 });
    refs.structureDetail.innerHTML = "<strong>观察提示：</strong>选择结构可聚焦其当前位置与形态变化。";
  } else if (action === "prev") stepStage(-1);
  else if (action === "next") stepStage(1);
  else if (action === "speed") state.speedIndex = (state.speedIndex + 1) % SPEEDS.length;
  else if (action === "labels") state.labels = !state.labels;
  else if (action === "highlight") state.highlight = !state.highlight;
  render();
  if(['reset','prev','next'].includes(action))sceneView?.reveal();
});

refs.timeline.addEventListener('pointerdown',()=>{state.playing=false;state.lastTime=0;renderControls();});
refs.timeline.addEventListener("input", () => {
  setGlobalProgress(Number(refs.timeline.value) / 5000);
  state.playing = false;
  state.lastTime = 0;
  render();
});

function animate(time) {
  if (state.playing) {
    if (!state.lastTime) state.lastTime = time;
    const elapsed = time - state.lastTime;
    state.lastTime = time;
    state.stageProgress += elapsed * SPEEDS[state.speedIndex] / STAGE_DURATION;
    while (state.stageProgress >= 1 && state.playing) {
      if (state.stageIndex >= MODEL_CONTENT.stages.length - 1) {
        state.stageProgress = 1;
        state.playing = false;
      } else {
        state.stageProgress -= 1;
        state.stageIndex += 1;
      }
    }
    render();
  }
  requestAnimationFrame(animate);
}

installStageTabs();
installStructureButtons();
render();
sceneView = globalThis.createTranscriptionSceneView({ root, scene: refs.scene, nodes: refs, getState: () => state, getProgress: globalProgress, getPolymerase: polymeraseState });
requestAnimationFrame(animate);

function emitHostMessage(type,payload={},requestId){
  if(window.parent===window)return;
  window.parent.postMessage({source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload,...(requestId?{requestId}:{})},hostOrigin);
}
function hostState(){return{stageIndex:state.stageIndex,stageId:MODEL_CONTENT.stages[state.stageIndex].id,progress:globalProgress(),playing:state.playing,speed:SPEEDS[state.speedIndex],labels:state.labels,highlight:state.highlight};}
function reportHostState(force=false,requestId){
  if(window.parent===window)return;
  const now=performance.now();
  if(state.stageIndex!==hostLastStage){hostLastStage=state.stageIndex;emitHostMessage('model:stage-changed',{stageIndex:state.stageIndex,stageId:MODEL_CONTENT.stages[state.stageIndex].id},requestId);}
  if(!force&&state.playing&&now-hostLastReport<200)return;
  hostLastReport=now;emitHostMessage('model:state',hostState(),requestId);emitHostMessage('model:progress',{progress:globalProgress()},requestId);
}
function announceReady(requestId){emitHostMessage('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities},requestId);reportHostState(true,requestId);}
window.addEventListener('message',event=>{
  const m=event.data;if(window.parent===window||event.source!==window.parent||(hostOrigin!=='*'&&event.origin!==hostOrigin)||m?.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
  const p=m.payload||{};
  if(m.type==='host:init')return announceReady(m.requestId);
  if(m.type==='host:play'){if(globalProgress()>=.999)setGlobalProgress(0);state.playing=true;}
  else if(m.type==='host:pause')state.playing=false;
  else if(m.type==='host:reset'){
    Object.assign(state,{stageIndex:0,stageProgress:0,playing:false,activeStructure:'',lastTime:0});
    refs.structureDetail.innerHTML='<strong>观察提示：</strong>选择结构可聚焦其当前位置与形态变化。';sceneView?.reveal();
  }else if(m.type==='host:set-stage'){
    const index=MODEL_CONTENT.stages.findIndex(s=>s.id===p.stageId);
    if(index<0)return emitHostMessage('model:error',{code:'INVALID_STAGE'},m.requestId);
    state.stageIndex=index;state.stageProgress=0;state.playing=false;sceneView?.reveal();
  }else if(m.type==='host:set-speed'){
    const index=SPEEDS.indexOf(Number(p.speed));if(index<0)return emitHostMessage('model:error',{code:'INVALID_SPEED'},m.requestId);state.speedIndex=index;
  }else if(m.type==='host:set-labels')state.labels=p.visible!==false;
  else if(m.type==='host:set-highlight')state.highlight=Boolean(p.enabled);
  else if(m.type==='host:set-view')return emitHostMessage('model:error',{code:'UNSUPPORTED_CAPABILITY'},m.requestId);
  else return;
  state.lastTime=0;render();reportHostState(true,m.requestId);
});
document.addEventListener('visibilitychange',()=>{state.lastTime=0;});
window.addEventListener('pageshow',()=>{state.lastTime=0;});
function mountTranscriptionExperience(){
  if(shellExperience)return;
  const shell=globalThis.AnderModelShell;
  const openContext=trigger=>shellExperience.showPanel(root.querySelector('.transcription-info'),'阶段与结构',trigger);
  const help='<p>播放连续演示；阶段按钮和进度条可定位过程。拖动进度会暂停，切换横竖屏和全屏不会重置过程。</p><p>手机默认跟随当前作用位置，手指拖动可自由观察；在“观察”中点“返回作用处”恢复跟随，点“全景”查看完整画面。</p><p>“阶段与结构”可查看当前摘要并聚焦结构。全屏时轻触唤出控件，松手约两秒后收起。收藏由宿主网站提供，独立打开不写入账户。</p>';
  const settings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'返回当前作用处',run:()=>{sceneView.reveal();shellExperience.closeDialog();}}]);
  const onReturn=()=>{
    if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();
    else shellExperience.showDialog('独立模型预览','<p>当前独立打开 DNA 转录模型，关闭此标签页可返回之前的页面。</p>',document.activeElement);
  };
  shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('.transcription-scene-viewport'),title:'DNA转录',returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'阶段与结构',onSettings:settings,onContext:openContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>sceneView?.resize())});
  shell.setExtra(root.querySelector('[data-transcription-settings]'),'settings','显示与操作');
  root.querySelector('[data-transcription-settings]').addEventListener('click',e=>settings(e.currentTarget));
  root.querySelector('[data-transcription-context]').addEventListener('click',e=>openContext(e.currentTarget));
  root.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();onReturn();});
  globalThis.TranscriptionSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...state,progress:globalProgress(),speed:SPEEDS[state.speedIndex],view:sceneView.getState(),shell:shellExperience.getState()})});
  const ready=()=>{shellExperience.setSceneStatus('ready');announceReady();};
  if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountTranscriptionExperience,{once:true});else mountTranscriptionExperience();
