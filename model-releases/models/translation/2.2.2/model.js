"use strict";

const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"translation","version":"2.2.2","publish":true,"title":{"zh":"mRNA翻译模型（2D）","en":"mRNA Translation Model (2D)"},"summary":{"zh":"连续展示核糖体装配、tRNA识别密码子、肽键形成、逐密码子易位和终止释放。","en":"Explore ribosome assembly, codon recognition, peptide-bond formation, translocation and translation termination as one continuous process."},"module":{"id":"molecular-genetics","zh":"遗传信息的翻译","en":"Translation of Genetic Information"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"mrna-binding","title":{"zh":"mRNA识别","en":"mRNA Binding"}},{"id":"initiation","title":{"zh":"翻译起始","en":"Initiation"}},{"id":"codon-recognition","title":{"zh":"密码子识别","en":"Codon Recognition"}},{"id":"peptide-bond","title":{"zh":"形成肽键","en":"Peptide Bond Formation"}},{"id":"elongation","title":{"zh":"延伸与易位","en":"Elongation and Translocation"}},{"id":"termination","title":{"zh":"终止与释放","en":"Termination and Release"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","scene-view.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const MODEL_CONTENT = {
  id: "translation",
  title: "mRNA翻译模型（2D）",
  titleEn: "mRNA Translation Model (2D)",
  chapter: "遗传信息的翻译 / Translation of Genetic Information",
  stages: [
    { id: "mrna-binding", title: "mRNA识别", titleEn: "mRNA Binding", summary: "核糖体大亚基从左上方、小亚基从左下方进入，共同夹合成熟mRNA并定位起始密码子AUG。" },
    { id: "initiation", title: "翻译起始", titleEn: "Initiation", summary: "携带甲硫氨酸的起始tRNA以反密码子UAC识别AUG并进入P位，翻译起始复合体形成。" },
    { id: "codon-recognition", title: "密码子识别", titleEn: "Codon Recognition", summary: "与下一个密码子互补的氨酰-tRNA进入A位，反密码子与密码子逐碱基配对。" },
    { id: "peptide-bond", title: "形成肽键", titleEn: "Peptide Bond Formation", summary: "P位tRNA携带的肽链转移到A位氨基酸，新氨基酸连接到多肽C端。" },
    { id: "elongation", title: "延伸与易位", titleEn: "Elongation and Translocation", summary: "核糖体逐密码子向3′端移动，tRNA依次完成A→P→E位迁移，肽链持续延长。" },
    { id: "termination", title: "终止与释放", titleEn: "Termination and Release", summary: "终止密码子进入A位，释放因子促使多肽释放，核糖体大小亚基最终解离。" },
  ],
};

const STRUCTURES = [
  { id: "mrna", name: "成熟mRNA", en: "Mature mRNA", role: "密码子模板", color: "#27a889", detail: "成熟mRNA按5′→3′方向通过核糖体；三个连续碱基组成一个密码子。" },
  { id: "ribosome", name: "核糖体", en: "Ribosome", role: "翻译装置", color: "#8063b5", detail: "浅紫色大小亚基紧密结合并共同形成mRNA通道；加高的大亚基与tRNA顶部齐平，E、P、A三个纵深结合腔分别容纳离开、携带肽链和新进入的tRNA。" },
  { id: "trna", name: "tRNA", en: "Transfer RNA", role: "运送氨基酸", color: "#e47a96", detail: "模型使用三叶草形tRNA；上端连接氨基酸，下方反密码子环识别mRNA密码子。" },
  { id: "pairing", name: "密码子—反密码子", en: "Codon–Anticodon", role: "互补配对", color: "#efb63d", detail: "反密码子只有在tRNA抵达作用位点后才与对应密码子显示三组配对。" },
  { id: "polypeptide", name: "多肽链", en: "Polypeptide", role: "翻译产物", color: "#e3537b", detail: "肽链连接在当前肽基tRNA上，新氨基酸添加到C端，N端逐渐伸出核糖体。" },
  { id: "release-factor", name: "释放因子", en: "Release Factor", role: "识别终止", color: "#8b5fc0", detail: "终止密码子没有对应tRNA；释放因子进入A位后促使完整多肽脱离。" },
];

const CODONS = [
  { code: "GCC", type: "utr" },
  { code: "CCA", type: "utr" },
  { code: "AUG", type: "start", aa: "Met", anticodon: "UAC", name: "甲硫氨酸" },
  { code: "GCU", type: "sense", aa: "Ala", anticodon: "CGA", name: "丙氨酸" },
  { code: "UUU", type: "sense", aa: "Phe", anticodon: "AAA", name: "苯丙氨酸" },
  { code: "GGA", type: "sense", aa: "Gly", anticodon: "CCU", name: "甘氨酸" },
  { code: "AAA", type: "sense", aa: "Lys", anticodon: "UUU", name: "赖氨酸" },
  { code: "CCG", type: "sense", aa: "Pro", anticodon: "GGC", name: "脯氨酸" },
  { code: "UAC", type: "sense", aa: "Tyr", anticodon: "AUG", name: "酪氨酸" },
  { code: "GAA", type: "sense", aa: "Glu", anticodon: "CUU", name: "谷氨酸" },
  { code: "UGA", type: "stop" },
  { code: "CCA", type: "utr" },
];

const TRNA_COLORS = ["#d7a93e", "#e57191", "#5a9fd5", "#58b68e", "#9b78d2", "#e18b49", "#4ba9a8", "#d0668e"];
const AMINO_COLORS = ["#f4c64e", "#ef7f99", "#65afe0", "#6fc59f", "#ac8bda", "#ed9d5d", "#63b9b7", "#df789d"];
const CODON_COLORS = ["#ffe6ad", "#d7f2e5", "#d9edff", "#ffd9e3", "#e8dcff", "#f3e3c7"];
const START_CODON_INDEX = 2;
const SENSE_TRNA_COUNT = 8;
const MRNA_START = 36;
const CODON_WIDTH = 100;
const BASE_STEP = 30;
const BASE_WIDTH = 24;
const BASE_HEIGHT = 38;
const BASE_TOP = 457;
const CODON_BODY_WIDTH = BASE_STEP * 2 + BASE_WIDTH;
const MRNA_Y = 520;
const TRNA_Y = 400;
const RIBOSOME_Y = 500;
const TRNA_SCALE = .72;
const ANTICODON_OFFSET = BASE_STEP / TRNA_SCALE;
const SITE_OFFSET = CODON_WIDTH;
const RIBOSOME_X_SCALE = CODON_WIDTH / 86;
const LARGE_SUBUNIT_Y_SCALE = 2.5;
const CLOCK_START = .34;
const CLOCK_END = .86;
const MOTION_PHASE_SPAN = .32;
const DIRECT_MOTION_SPAN = (CLOCK_END - CLOCK_START) / 7 * MOTION_PHASE_SPAN;
const FIRST_TRNA_START = DIRECT_MOTION_SPAN;
const SECOND_TRNA_START = FIRST_TRNA_START + DIRECT_MOTION_SPAN;
const SPEEDS = [.8, 1.2, 1.6, 2];
const STAGE_DURATION = 5000;
const state = { stageIndex: 0, stageProgress: 0, playing: false, speedIndex: 1, labels: true, highlight: true, activeStructure: "", lastTime: 0 };
const root = document.querySelector("[data-independent-model-root]");
let sceneView = null;
let shellExperience = null;
const controlSignatures = new Map();
let lastStageInfo = -1;

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
      <button class="shell-icon-button" type="button" data-translation-settings aria-label="显示与操作"></button>
    </header>

    <section class="independent-model-workspace">
      <section class="model-area" data-model-area>
        <nav class="stage-strip" data-stage-strip aria-label="mRNA翻译阶段"></nav>
        <div class="model-stage">
          <button class="shell-action translation-context-trigger" type="button" data-translation-context>阶段与结构 ↗</button>
          <div class="translation-workbench">
            <section class="translation-scene-panel" aria-label="mRNA翻译动画工作区">
              <svg class="translation-scene" data-scene viewBox="0 0 1260 680" preserveAspectRatio="xMidYMin meet" role="img" aria-labelledby="sceneTitle sceneDescription">
                <title id="sceneTitle">mRNA翻译二维模型</title>
                <desc id="sceneDescription">展示核糖体装配、三叶草形tRNA识别密码子、肽键形成、易位和终止释放的连续过程。</desc>
                <defs>
                  <filter id="softShadow" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#17424b" flood-opacity=".18"/></filter>
                  <filter id="codonGlow" x="-70%" y="-80%" width="240%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffd65a" flood-opacity=".95"/></filter>
                  <filter id="aminoGlow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#fff1a6" flood-opacity=".9"/></filter>
                  <filter id="peptideGlow" x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ff9aba" flood-opacity=".72"/></filter>
                  <filter id="structureFocus" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#ffd65a" flood-opacity=".96"/></filter>
                  <linearGradient id="releaseGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e4d7ff"/><stop offset=".5" stop-color="#a887d4"/><stop offset="1" stop-color="#7651aa"/></linearGradient>
                  <radialGradient id="capBallGradient" cx="30%" cy="25%" r="72%"><stop stop-color="#ff9aaa"/><stop offset=".38" stop-color="#ec5278"/><stop offset="1" stop-color="#b92f57"/></radialGradient>
                  <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10z" fill="#2f8472"/></marker>
                </defs>
                <rect class="scene-background" x="10" y="10" width="1240" height="660" rx="24"/>

                <g data-translation-content transform="translate(0 -180)">

                <g class="structure-node" data-structure-node="mrna" data-mrna>
                  <text class="ribosome-label" x="630" y="420">成熟mRNA / Mature mRNA</text>
                  <circle class="mrna-cap" cx="26" cy="476" r="10"/>
                  <path class="poly-a-tail" d="M1220 476 L1242 476"/>
                  <text class="codon-label" x="1200" y="446">多聚A尾 Poly(A)</text>
                  <g data-mrna-connectors></g>
                  <g data-codon-zones></g>
                  <g data-mrna-bases></g>
                  <path class="mrna-backbone" d="M48 ${MRNA_Y} L1208 ${MRNA_Y}"/>
                  <g data-backbone-codon-segments></g>
                  <text class="end-label" x="2" y="482">5′</text>
                  <text class="end-label" x="1244" y="482">3′</text>
                  <path class="direction-arrow" d="M185 640 L1090 640"/>
                  <text class="direction-text" x="630" y="672">核糖体沿mRNA的移动方向 5′ → 3′</text>
                </g>

                <g class="structure-node" data-structure-node="ribosome" data-ribosome-root>
                  <g class="ribosome-subunit" data-small-subunit>
                    <image class="ribosome-image" href="assets/ribosome-small-subunit.webp" x="-180" y="-180" width="360" height="360" preserveAspectRatio="xMidYMid meet" transform="scale(${RIBOSOME_X_SCALE} 1)"/>
                  </g>
                  <g class="ribosome-subunit" data-large-subunit>
                    <image class="ribosome-image" href="assets/ribosome-large-subunit.webp" x="-180" y="-180" width="360" height="360" preserveAspectRatio="xMidYMid meet" transform="scale(${RIBOSOME_X_SCALE} ${LARGE_SUBUNIT_Y_SCALE})"/>
                  </g>
                  <g data-sites>
                    <g transform="translate(${-SITE_OFFSET} -56)"><rect class="site-marker e" x="-18" y="-14" width="36" height="28" rx="10"/><text class="site-letter" y="0">E</text><text class="site-caption" y="-24">出口位</text></g>
                    <g transform="translate(0 -56)"><rect class="site-marker p" x="-18" y="-14" width="36" height="28" rx="10"/><text class="site-letter" y="0">P</text><text class="site-caption" y="-24">肽酰位</text></g>
                    <g transform="translate(${SITE_OFFSET} -56)"><rect class="site-marker a" x="-18" y="-14" width="36" height="28" rx="10"/><text class="site-letter" y="0">A</text><text class="site-caption" y="-24">氨酰位</text></g>
                  </g>
                </g>

                <g class="structure-node" data-structure-node="pairing" data-pairing-layer></g>
                <g class="structure-node" data-structure-node="trna" data-trna-layer></g>
                <text class="trna-caption" data-trna-label opacity="0">tRNA（三叶草结构）</text>

                <g class="structure-node" data-structure-node="polypeptide" data-peptide opacity="0">
                  <path class="peptide-link" data-peptide-link/>
                  <g data-peptide-beads></g>
                  <circle class="peptide-bond-flash" data-bond-flash r="19"/>
                  <text class="peptide-label" data-peptide-label>多肽链 Polypeptide</text>
                  <text class="peptide-label" data-n-label>N端</text>
                  <text class="peptide-label" data-c-label>C端</text>
                </g>

                <g class="structure-node" data-structure-node="release-factor" data-release-factor opacity="0">
                  <path class="release-factor-shape" d="M0-92 C35-104 58-75 43-48 C74-38 73 4 45 15 C57 48 22 68 0 48 C-24 68-58 47-45 15 C-75 2-70-38-42-48 C-58-75-34-104 0-92z"/>
                  <ellipse class="release-factor-core" cx="0" cy="-18" rx="20" ry="28"/>
                  <path class="stop-signal" d="M-15 21 0 38 15 21"/>
                  <text class="release-factor-label" x="0" y="82">释放因子</text>
                  <text class="release-factor-label" x="0" y="97">Release factor</text>
                </g>
                </g>
              </svg>
            </section>

            <aside class="translation-info" aria-live="polite">
              <section class="stage-status">
                <p class="stage-status-kicker" data-stage-kicker>STAGE 01 / 06</p>
                <h2 data-stage-title>mRNA识别<small data-stage-title-en>mRNA Binding</small></h2>
                <p data-stage-summary></p>
              </section>
              <div class="direction-rule"><strong>翻译方向的绝对规则</strong><span class="direction-main">核糖体沿mRNA 5′ → 3′移动</span><br/>肽链按N端→C端延长，新氨基酸连接到多肽C端。</div>
              <div class="structure-panel-title"><strong>结构与作用位点</strong><span>再次点击可取消聚焦</span></div>
              <div class="structure-buttons" data-structure-buttons></div>
              <div class="structure-detail" data-structure-detail><strong>结构聚焦：</strong>选择结构可观察其在连续翻译过程中的位置变化。</div>
              <div class="legend-row">
                <span class="legend-pill"><i class="legend-line" style="--legend:#a985df"></i>核糖体大亚基</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#8063b5"></i>核糖体小亚基</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#e3537b"></i>多肽链</span>
              </div>
            </aside>
          </div>
        </div>

        <div class="control-dock" data-control-dock>
          <div class="control-group control-group-primary">
            <button class="control-button is-primary" type="button" data-action="play"></button>
            <button class="control-button" type="button" data-action="reset"></button>
            <button class="control-button" type="button" data-action="prev"></button>
            <button class="control-button" type="button" data-action="next"></button>
          </div>
          <label class="timeline-wrap"><span>过程进度</span><input data-timeline type="range" aria-label="过程进度" min="0" max="6000" value="0"/><output data-progress-label>0%</output></label>
          <div class="control-group control-group-view">
            <button class="control-button" type="button" data-action="speed"></button>
            <button class="control-button" type="button" data-action="labels"></button>
            <button class="control-button" type="button" data-action="highlight"></button>
            <button class="control-button" type="button" data-scene-follow></button>
            <button class="control-button" type="button" data-scene-mode></button>
          </div>
          <div class="control-group control-group-personal">
            <button class="control-button" type="button" data-shell-tools></button>
            <button class="control-button shell-help" type="button" data-shell-help></button>
            <button class="control-button" type="button" data-shell-favorite></button>
            <button class="control-button" type="button" data-action="fullscreen"></button>
          </div>
        </div>
      </section>
    </section>
  </main>`;

const refs = {
  app: root.querySelector("[data-model-app]"),
  modelArea: root.querySelector("[data-model-area]"),
  scene: root.querySelector("[data-scene]"),
  stageStrip: root.querySelector("[data-stage-strip]"),
  stageKicker: root.querySelector("[data-stage-kicker]"),
  stageTitle: root.querySelector("[data-stage-title]"),
  stageTitleEn: root.querySelector("[data-stage-title-en]"),
  stageSummary: root.querySelector("[data-stage-summary]"),
  structureButtons: root.querySelector("[data-structure-buttons]"),
  structureDetail: root.querySelector("[data-structure-detail]"),
  timeline: root.querySelector("[data-timeline]"),
  mrnaConnectors: root.querySelector("[data-mrna-connectors]"),
  backboneCodonSegments: root.querySelector("[data-backbone-codon-segments]"),
  codonZones: root.querySelector("[data-codon-zones]"),
  mrnaBases: root.querySelector("[data-mrna-bases]"),
  ribosomeRoot: root.querySelector("[data-ribosome-root]"),
  smallSubunit: root.querySelector("[data-small-subunit]"),
  largeSubunit: root.querySelector("[data-large-subunit]"),
  sites: root.querySelector("[data-sites]"),
  trnaLayer: root.querySelector("[data-trna-layer]"),
  pairingLayer: root.querySelector("[data-pairing-layer]"),
  trnaLabel: root.querySelector("[data-trna-label]"),
  peptide: root.querySelector("[data-peptide]"),
  peptideLink: root.querySelector("[data-peptide-link]"),
  peptideBeads: root.querySelector("[data-peptide-beads]"),
  bondFlash: root.querySelector("[data-bond-flash]"),
  peptideLabel: root.querySelector("[data-peptide-label]"),
  nLabel: root.querySelector("[data-n-label]"),
  cLabel: root.querySelector("[data-c-label]"),
  releaseFactor: root.querySelector("[data-release-factor]"),
};

const NS = "http://www.w3.org/2000/svg";
const codonNodes = [];
const trnaNodes = [];
const peptideNodes = [];

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
function mix(a, b, amount) { return a + (b - a) * amount; }
function smooth(value) { const t = clamp(value); return t * t * (3 - 2 * t); }
function windowProgress(p, start, end) { return smooth((p - start) / (end - start)); }
function linearWindow(p, start, end) { return clamp((p - start) / (end - start)); }
function motionWindow(value, start, end) { return smooth((value - start) / (end - start)); }
function cubicBezier(start, controlA, controlB, end, value) {
  const t = clamp(value);
  const inverse = 1 - t;
  return inverse ** 3 * start + 3 * inverse ** 2 * t * controlA + 3 * inverse * t ** 2 * controlB + t ** 3 * end;
}
function opacityWindow(p, enterStart, enterEnd, exitStart, exitEnd) { return windowProgress(p, enterStart, enterEnd) * (1 - windowProgress(p, exitStart, exitEnd)); }
function pathFrom(points) { return points.length ? `M${points.map((point) => `${point[0]} ${point[1]}`).join(" L")}` : ""; }
function shadeHex(hex, factor) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (shift) => Math.round(((value >> shift) & 255) * factor).toString(16).padStart(2, "0");
  return `#${channel(16)}${channel(8)}${channel(0)}`;
}
function codonStart(index) { return MRNA_START + index * CODON_WIDTH; }
function codonCenter(index) { return codonStart(index) + CODON_BODY_WIDTH / 2; }
function globalProgress() { return (state.stageIndex + state.stageProgress) / MODEL_CONTENT.stages.length; }

function installMrna() {
  CODONS.forEach((codon, codonIndex) => {
    const x = codonStart(codonIndex);
    const codonColor = CODON_COLORS[codonIndex % CODON_COLORS.length];
    const zone = svgEl("path", { d: `M${x - 2} ${MRNA_Y + 22} L${x + CODON_BODY_WIDTH + 2} ${MRNA_Y + 22}`, class: `codon-zone ${codon.type}` });
    refs.codonZones.append(zone);
    const baseGroup = svgEl("g");
    [...codon.code].forEach((base, baseIndex) => {
      const baseX = x + baseIndex * BASE_STEP;
      const baseCenter = baseX + BASE_WIDTH / 2;
      refs.mrnaConnectors.append(svgEl("path", { d: `M${baseCenter} ${BASE_TOP + BASE_HEIGHT} L${baseCenter} ${MRNA_Y}`, class: "mrna-base-connector" }));
      baseGroup.append(svgEl("rect", { x: baseX, y: BASE_TOP, width: BASE_WIDTH, height: BASE_HEIGHT, rx: 4, class: "base-box", fill: codonColor, stroke: codonColor }));
      const text = svgEl("text", { x: baseCenter, y: BASE_TOP + BASE_HEIGHT / 2 + 1, class: "base-letter" });
      text.textContent = base;
      baseGroup.append(text);
    });
    refs.mrnaBases.append(baseGroup);
    if (codon.type === "start" || codon.type === "stop") {
      refs.backboneCodonSegments.append(svgEl("path", {
        d: `M${x + BASE_WIDTH / 2} ${MRNA_Y} L${x + 2 * BASE_STEP + BASE_WIDTH / 2} ${MRNA_Y}`,
        class: `mrna-backbone-segment ${codon.type}`,
      }));
      const label = svgEl("text", { x: codonCenter(codonIndex), y: 440, class: "codon-label" });
      label.textContent = codon.type === "start" ? "起始密码子 AUG" : "终止密码子 UGA";
      refs.codonZones.append(label);
    }
    codonNodes.push({ zone, codon, x });
  });
}

function trnaMarkup(codon, index) {
  const letters = [...codon.anticodon];
  const aminoColor = AMINO_COLORS[index];
  const aminoShadow = shadeHex(aminoColor, .57);
  return `
    <defs><radialGradient id="amino-sphere-${index}" cx="30%" cy="24%" r="72%"><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="${aminoColor}"/><stop offset=".72" stop-color="${aminoColor}"/><stop offset="1" stop-color="${aminoShadow}"/></radialGradient></defs>
    <image class="trna-model-image" href="assets/trna-cloverleaf.webp" x="-76" y="-142" width="152" height="212" preserveAspectRatio="xMidYMid meet"/>
    <g data-amino-acid>
      <circle class="trna-amino-acid" cx="0" cy="-122" r="19" fill="url(#amino-sphere-${index})"/>
      <ellipse class="amino-specular" cx="-6" cy="-129" rx="6" ry="4"/>
      <text class="trna-amino-label" data-amino-label x="0" y="-121">${codon.aa}</text>
    </g>
    <g class="anticodon-connectors" aria-hidden="true"><path d="M-18 31 L${-ANTICODON_OFFSET} 39"/><path d="M0 34 L0 39"/><path d="M18 31 L${ANTICODON_OFFSET} 39"/></g>
    <g data-anticodon>
      <text class="trna-base-letter" x="${-ANTICODON_OFFSET}" y="50">${letters[0]}</text><text class="trna-base-letter" x="0" y="50">${letters[1]}</text><text class="trna-base-letter" x="${ANTICODON_OFFSET}" y="50">${letters[2]}</text>
    </g>
    <g data-pair-lines opacity="0"><path class="pair-bond" d="M${-ANTICODON_OFFSET} 67 L${-ANTICODON_OFFSET} 79"/><path class="pair-bond" d="M0 67 L0 79"/><path class="pair-bond" d="M${ANTICODON_OFFSET} 67 L${ANTICODON_OFFSET} 79"/></g>`;
}

function installTrnas() {
  for (let index = 0; index < SENSE_TRNA_COUNT; index += 1) {
    const codon = CODONS[START_CODON_INDEX + index];
    const group = svgEl("g", { class: "trna-unit", "data-trna-index": index, style: `--trna-color:${TRNA_COLORS[index]};--amino-color:${AMINO_COLORS[index]}` });
    group.innerHTML = trnaMarkup(codon, index);
    refs.trnaLayer.append(group);
    trnaNodes.push({ group, pairLines: group.querySelector("[data-pair-lines]"), aminoAcid: group.querySelector("[data-amino-acid]"), aminoLabel: group.querySelector("[data-amino-label]"), codon });
  }
}

function installPeptide() {
  for (let index = 0; index < SENSE_TRNA_COUNT; index += 1) {
    const bead = svgEl("circle", { class: "peptide-bead", r: 13, fill: `url(#amino-sphere-${index})`, opacity: 0 });
    refs.peptideBeads.append(bead);
    peptideNodes.push(bead);
  }
}

function translationClock(p) {
  if (p < CLOCK_START) return 0;
  if (p < CLOCK_END) return 7 * linearWindow(p, CLOCK_START, CLOCK_END);
  return 7;
}

function clockState(p) {
  const clock = translationClock(p);
  if (clock >= 7) return { clock: 7, cycle: 6, phase: 1, ribosomeStep: 7, transfer: 1 };
  const cycle = Math.floor(clock);
  const phase = clock - cycle;
  const move = motionWindow(phase, 1 - MOTION_PHASE_SPAN, 1);
  const transfer = motionWindow(phase, .34, .34 + MOTION_PHASE_SPAN);
  return { clock, cycle, phase, ribosomeStep: cycle + move, transfer };
}

function updateRibosome(p, timing) {
  const entryPhase = linearWindow(p, 0, DIRECT_MOTION_SPAN);
  const entry = smooth(entryPhase);
  const departure = motionWindow(p, .942, .942 + DIRECT_MOTION_SPAN);
  const activeX = codonCenter(START_CODON_INDEX) + timing.ribosomeStep * CODON_WIDTH;
  const ribosomeX = activeX + 275 * departure;
  const shiftX = cubicBezier(-430, -360, -125, 0, entry);
  const largeShiftY = cubicBezier(-165, -245, -72, 0, entry);
  const smallShiftY = cubicBezier(155, 235, 68, 0, entry);
  const largeRotation = cubicBezier(-7, -11, 2, 0, entry);
  const smallRotation = cubicBezier(7, 11, -2, 0, entry);
  refs.ribosomeRoot.setAttribute("transform", `translate(${ribosomeX} ${RIBOSOME_Y})`);
  refs.ribosomeRoot.setAttribute("opacity", String(1 - .42 * departure));
  refs.smallSubunit.setAttribute("transform", `translate(${shiftX} ${smallShiftY}) rotate(${smallRotation})`);
  refs.smallSubunit.setAttribute("opacity", String(entry * (1 - .18 * departure)));
  refs.largeSubunit.setAttribute("transform", `translate(${shiftX} ${largeShiftY}) rotate(${largeRotation})`);
  refs.largeSubunit.setAttribute("opacity", String(entry * (1 - .18 * departure)));
  refs.sites.setAttribute("transform", `translate(${shiftX} ${largeShiftY}) rotate(${largeRotation})`);
  const sitesFade = motionWindow(timing.clock, 1 - MOTION_PHASE_SPAN, 1 - MOTION_PHASE_SPAN / 2);
  refs.sites.setAttribute("opacity", String(entry * (1 - sitesFade) * (1 - departure)));
  return { x: ribosomeX, assembly: entry, dissociate: departure };
}

function trnaState(index, p, timing) {
  const boundX = codonCenter(START_CODON_INDEX + index);
  if (index === 0) {
    const entry = motionWindow(p, FIRST_TRNA_START, FIRST_TRNA_START + DIRECT_MOTION_SPAN);
    const terminationExit = motionWindow(p, .942, .942 + DIRECT_MOTION_SPAN);
    const cycleExit = timing.clock < 1 - MOTION_PHASE_SPAN ? 0 : motionWindow(timing.clock, 1 - MOTION_PHASE_SPAN, 1);
    const exit = Math.max(cycleExit, terminationExit);
    return {
      visible: entry * (1 - exit),
      x: mix(boundX + 120, boundX, entry) - 120 * exit,
      y: mix(TRNA_Y - 145, TRNA_Y, entry) - 125 * exit,
      paired: entry > .995 && exit < .2,
      entry,
      exit,
    };
  }

  if (index === 1) {
    const arrival = motionWindow(p, SECOND_TRNA_START, SECOND_TRNA_START + DIRECT_MOTION_SPAN);
    const exit = motionWindow(timing.clock, 2 - MOTION_PHASE_SPAN, 2);
    return {
      visible: arrival * (1 - exit),
      x: mix(boundX + 120, boundX, arrival) - 120 * exit,
      y: mix(TRNA_Y - 145, TRNA_Y, arrival) - 125 * exit,
      paired: arrival > .995 && exit < .18,
      entry: arrival,
      exit,
    };
  }

  const arrivalCycle = index - 1;
  const arrival = motionWindow(timing.clock, arrivalCycle, arrivalCycle + MOTION_PHASE_SPAN);
  const exit = index === SENSE_TRNA_COUNT - 1
    ? motionWindow(p, .942, .942 + DIRECT_MOTION_SPAN)
    : motionWindow(timing.clock, index + 1 - MOTION_PHASE_SPAN, index + 1);
  return {
    visible: arrival * (1 - exit),
    x: mix(boundX + 120, boundX, arrival) - 120 * exit,
    y: mix(TRNA_Y - 145, TRNA_Y, arrival) - 125 * exit,
    paired: arrival > .995 && exit < .18,
    entry: arrival,
    exit,
  };
}

function updateTrnas(p, timing, ribosome) {
  let labelTarget = null;
  trnaNodes.forEach((node, index) => {
    const current = trnaState(index, p, timing);
    node.group.setAttribute("transform", `translate(${current.x} ${current.y}) scale(${TRNA_SCALE})`);
    node.group.setAttribute("opacity", String(current.visible));
    node.pairLines.setAttribute("opacity", current.paired ? "1" : "0");

    let aminoRemaining = 1;
    if (index === 0) aminoRemaining = 1 - motionWindow(timing.clock, .34, .34 + MOTION_PHASE_SPAN);
    else aminoRemaining = 1 - motionWindow(timing.clock, index - 1 + .34, index - 1 + .34 + MOTION_PHASE_SPAN);
    node.aminoAcid.setAttribute("opacity", String(aminoRemaining));
    node.aminoLabel.setAttribute("opacity", String(aminoRemaining));
    if (current.visible > .55 && current.exit < .15) labelTarget = current;
  });

  if (labelTarget) {
    refs.trnaLabel.setAttribute("x", String(labelTarget.x + 88));
    refs.trnaLabel.setAttribute("y", String(labelTarget.y - 48));
    refs.trnaLabel.setAttribute("opacity", "1");
  } else refs.trnaLabel.setAttribute("opacity", "0");

  refs.pairingLayer.innerHTML = "";
  const pairingVisible = p > SECOND_TRNA_START && p < .942 && ribosome.assembly > .75;
  if (pairingVisible) {
    const label = svgEl("text", { x: ribosome.x + SITE_OFFSET, y: 560, class: "pairing-label" });
    label.textContent = "密码子—反密码子配对";
    refs.pairingLayer.append(label);
  }
}

function updateActiveCodon(p, timing) {
  let activeIndex = START_CODON_INDEX;
  if (p >= SECOND_TRNA_START && p < CLOCK_START) activeIndex = START_CODON_INDEX + 1;
  if (p >= CLOCK_START && p < CLOCK_END) activeIndex = START_CODON_INDEX + Math.min(8, timing.cycle + 1);
  if (p >= CLOCK_END) activeIndex = 10;
  codonNodes.forEach((node, index) => node.zone.classList.toggle("is-active", index === activeIndex));
}

function peptideState(p, timing) {
  if (p < CLOCK_START) return { opacity: 0, count: 0, rootX: codonCenter(START_CODON_INDEX), release: 0 };
  const cycle = timing.cycle;
  const previousX = codonCenter(START_CODON_INDEX + cycle);
  const nextX = codonCenter(START_CODON_INDEX + Math.min(cycle + 1, SENSE_TRNA_COUNT - 1));
  const rootX = timing.clock >= 7 ? codonCenter(9) : mix(previousX, nextX, timing.transfer);
  const count = timing.clock >= 7 ? SENSE_TRNA_COUNT : 1 + cycle + timing.transfer;
  return { opacity: motionWindow(timing.clock, .4, .4 + MOTION_PHASE_SPAN / 2), count, rootX, release: motionWindow(p, .912, .912 + DIRECT_MOTION_SPAN) };
}

function updatePeptide(p, timing) {
  const peptide = peptideState(p, timing);
  refs.peptide.setAttribute("opacity", String(peptide.opacity));
  if (peptide.opacity <= .005) return;

  const releaseX = 112 * peptide.release;
  const releaseY = -170 * peptide.release;
  const points = [];
  peptideNodes.forEach((node, index) => {
    const full = Math.floor(peptide.count + 1e-5);
    const fraction = peptide.count - full;
    const opacity = index < full ? 1 : index === full ? fraction : 0;
    const distance = Math.max(0, peptide.count - 1 - index) * 24;
    const settled = clamp(distance / 24);
    const emerging = index === full && fraction > 0 && timing.clock < 7;
    const incomingX = codonCenter(START_CODON_INDEX + Math.min(timing.cycle + 1, SENSE_TRNA_COUNT - 1));
    const x = emerging
      ? incomingX + releaseX
      : peptide.rootX - distance * .58 + Math.sin(index * 1.7) * 7 * settled + releaseX;
    const y = emerging
      ? TRNA_Y - 88 + releaseY
      : TRNA_Y - 88 - distance * .82 - Math.sin(index * 1.1) * 4 * settled + releaseY;
    node.setAttribute("cx", String(x));
    node.setAttribute("cy", String(y));
    node.setAttribute("opacity", String(opacity));
    if (opacity > .02) points.push([x, y]);
  });
  refs.peptideLink.setAttribute("d", pathFrom(points));

  const newest = points[points.length - 1] || [peptide.rootX, TRNA_Y - 88];
  const oldest = points[0] || newest;
  refs.peptideLabel.setAttribute("x", String(oldest[0] - 42));
  refs.peptideLabel.setAttribute("y", String(oldest[1] - 17));
  refs.nLabel.setAttribute("x", String(oldest[0] - 28));
  refs.nLabel.setAttribute("y", String(oldest[1] + 4));
  refs.cLabel.setAttribute("x", String(newest[0] + 16));
  refs.cLabel.setAttribute("y", String(newest[1] + 5));
  const chainLabelOpacity = peptide.count > 1.22 ? "1" : "0";
  refs.peptideLabel.setAttribute("opacity", chainLabelOpacity);
  refs.nLabel.setAttribute("opacity", chainLabelOpacity);
  refs.cLabel.setAttribute("opacity", chainLabelOpacity);

  const flash = timing.clock < 7 ? opacityWindow(timing.phase, .34, .42, .58, .66) : 0;
  refs.bondFlash.setAttribute("cx", String(newest[0]));
  refs.bondFlash.setAttribute("cy", String(newest[1]));
  refs.bondFlash.setAttribute("opacity", String(flash));
}

function updateReleaseFactor(p, ribosome) {
  const entry = motionWindow(p, .88, .88 + DIRECT_MOTION_SPAN);
  const exit = motionWindow(p, .942, .942 + DIRECT_MOTION_SPAN);
  const targetX = ribosome.x + SITE_OFFSET;
  const x = mix(targetX + 170, targetX, entry) + 90 * exit;
  const y = mix(230, TRNA_Y - 12, entry) - 95 * exit;
  refs.releaseFactor.setAttribute("transform", `translate(${x} ${y}) scale(.72)`);
  refs.releaseFactor.setAttribute("opacity", String(entry * (1 - exit)));
}

function updateStructureFocus() {
  root.querySelectorAll("[data-structure-node]").forEach((node) => {
    const match = node.dataset.structureNode === state.activeStructure;
    node.classList.toggle("is-focused", Boolean(state.activeStructure && match && state.highlight));
    node.classList.toggle("is-dimmed", Boolean(state.activeStructure && !match));
  });
  root.querySelectorAll("[data-structure-button]").forEach((button) => button.classList.toggle("is-active", button.dataset.structureButton === state.activeStructure));
}

function updateScene() {
  const p = globalProgress();
  const timing = clockState(p);
  const ribosome = updateRibosome(p, timing);
  updateTrnas(p, timing, ribosome);
  updateActiveCodon(p, timing);
  updatePeptide(p, timing);
  updateReleaseFactor(p, ribosome);
  refs.scene.classList.toggle("hidden-labels", !state.labels);
  refs.scene.classList.toggle("highlight-off", !state.highlight);
  updateStructureFocus();
  sceneView?.sync();
}

function renderStageInfo() {
  if(lastStageInfo===state.stageIndex)return;lastStageInfo=state.stageIndex;
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
  globalThis.AnderModelShell.syncActiveStage();shellExperience?.syncStage();
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
  refs.timeline.value=String(Math.round(globalProgress()*6000));
  root.querySelector("[data-progress-label]").textContent=`${Math.round(globalProgress()*100)}%`;
}

function render() { renderStageInfo(); renderControls(); updateScene(); }

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
    refs.structureDetail.innerHTML = item ? `<strong>${item.name}：</strong>${item.detail}` : "<strong>结构聚焦：</strong>选择结构可观察其在连续翻译过程中的位置变化。";
    render();
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
  if(action==="fullscreen")return; // Shared shell owns both display modes.
  if (action === "play") {
    if (!state.playing && globalProgress() >= .999) setGlobalProgress(0);
    state.playing = !state.playing;
    state.lastTime = 0;
  } else if (action === "reset") {
    Object.assign(state, { stageIndex: 0, stageProgress: 0, playing: false, activeStructure: "", lastTime: 0 });
    refs.structureDetail.innerHTML = "<strong>结构聚焦：</strong>选择结构可观察其在连续翻译过程中的位置变化。";
  } else if (action === "prev") stepStage(-1);
  else if (action === "next") stepStage(1);
  else if (action === "speed") state.speedIndex = (state.speedIndex + 1) % SPEEDS.length;
  else if (action === "labels") state.labels = !state.labels;
  else if (action === "highlight") state.highlight = !state.highlight;

  render();
});

refs.timeline.addEventListener("pointerdown",()=>{state.playing=false;state.lastTime=0;renderControls();});
refs.timeline.addEventListener("input", () => {
  setGlobalProgress(Number(refs.timeline.value) / 6000);
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

installMrna();
installTrnas();
installPeptide();
installStageTabs();
installStructureButtons();
render();
sceneView = globalThis.createTranslationSceneView({ root, scene: refs.scene, nodes: refs, getState: () => state, getProgress: globalProgress, getTiming: clockState });
requestAnimationFrame(animate);

function mountTranslationExperience(){
  if(shellExperience)return;
  const shell=globalThis.AnderModelShell;
  const openContext=trigger=>shellExperience.showPanel(root.querySelector('.translation-info'),'阶段与结构',trigger);
  const help='<p>播放连续演示；阶段按钮和进度条可定位过程。拖动进度会暂停，切换横竖屏和全屏不会重置过程。</p><p>手机默认跟随当前作用位置，手指拖动可自由观察；在“观察”中点“返回作用处”恢复跟随，点“全景”查看完整画面。</p><p>“阶段与结构”可查看当前摘要并聚焦结构。全屏时轻触唤出控件，松手约两秒后收起。收藏由宿主网站提供，独立打开不写入账户。</p>';
  const settings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'返回当前作用处',run:()=>{sceneView.reveal();shellExperience.closeDialog();}}]);
  const onReturn=()=>{
    if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();
    else shellExperience.showDialog('独立模型预览','<p>当前独立打开 mRNA 翻译模型，关闭此标签页可返回之前的页面。</p>',document.activeElement);
  };
  shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('.translation-scene-viewport'),title:'mRNA 翻译',returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'阶段与结构',onSettings:settings,onContext:openContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>sceneView?.resize())});
  shell.setExtra(root.querySelector('[data-translation-settings]'),'settings','显示与操作');
  root.querySelector('[data-translation-settings]').addEventListener('click',e=>settings(e.currentTarget));
  root.querySelector('[data-translation-context]').addEventListener('click',e=>openContext(e.currentTarget));
  root.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();onReturn();});
  globalThis.TranslationSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...state,progress:globalProgress(),speed:SPEEDS[state.speedIndex],view:sceneView.getState(),shell:shellExperience.getState()})});
  const ready=()=>shellExperience.setSceneStatus('ready');
  if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountTranslationExperience,{once:true});else mountTranslationExperience();
document.addEventListener('visibilitychange',()=>{state.lastTime=0;});
window.addEventListener('pageshow',()=>{state.lastTime=0;});
