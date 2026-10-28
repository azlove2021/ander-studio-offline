"use strict";

const ANDER_MODEL_CONTENT = {"id":"rna-webgl","accent":"#14B8A6","title":"RNA 单链结构（WebGL 测试版）","titleEn":"RNA Single-Strand / WebGL Prototype","chapter":"遗传信息的表达 / Gene Expression","type":"3D WebGL 动态模型","state":"单链与折叠观察","visual":"rnaWebgl","practiceStageIndex":1,"structures":[["磷酸球形 Phosphate","#06B6D4"],["核糖五边形 Ribose","#F59E0B"],["2'-OH 羟基 2'-OH","#EC4899"],["A 腺嘌呤 Adenine","#22C55E"],["U 尿嘧啶 Uracil","#EF4444"],["C 胞嘧啶 Cytosine","#A855F7"],["G 鸟嘌呤 Guanine","#F97316"],["3',5'-磷酸二酯键 Phosphodiester","#2563EB"],["内部氢键 Internal H-bonds","#94A3B8"]],"stages":[{"title":"整体观察","titleEn":"Overview","goal":"认识 RNA 通常为单链结构，并可在局部形成折叠。","keywords":["RNA","单链 Single Strand","可折叠 Foldable"],"explanation":"RNA 与 DNA 一样由核苷酸连接而成，但 RNA 通常是单链。单链并不代表完全伸直，它可以通过局部碱基互补配对形成折叠结构。","mistake":"不要把 RNA 简单理解为 DNA 的一半；RNA 的糖、碱基和空间折叠都有自己的特点。","question":"为什么单链 RNA 也能形成复杂的空间结构？","id":"overview"},{"title":"核糖特点","titleEn":"Ribose Feature","goal":"识别 RNA 核糖中的 2'-OH 羟基。","keywords":["核糖 Ribose","2'-OH","脱氧核糖 Deoxyribose"],"explanation":"RNA 的糖是核糖，2' 号碳上有一个羟基 2'-OH；DNA 的脱氧核糖在这个位置少一个氧原子，这是两者的重要区别。","mistake":"RNA 不是脱氧核糖核酸，不能把核糖写成脱氧核糖。","question":"RNA 名称中的“核糖”与 DNA 的“脱氧核糖”有什么差别？","id":"ribose"},{"title":"四种碱基","titleEn":"Four Bases","goal":"观察 RNA 中 A、U、C、G 四种含氮碱基。","keywords":["A","U","C","G","尿嘧啶 Uracil"],"explanation":"RNA 使用 A、U、C、G 四种碱基，其中 U 是尿嘧啶。与 DNA 相比，RNA 中通常用 U 代替 T。","mistake":"RNA 中讲互补关系时应使用 A-U、C-G，不应写成 A-T。","question":"如果 RNA 中出现 A，它在互补配对时通常对应哪一种碱基？","id":"bases"},{"title":"骨架方向","titleEn":"Backbone Direction","goal":"观察 RNA 的磷酸-核糖骨架和 5' 到 3' 方向。","keywords":["磷酸-核糖骨架 Backbone","5' 端","3' 端"],"explanation":"相邻核糖核苷酸通过 3',5'-磷酸二酯键连接，形成具有方向性的磷酸-核糖骨架。RNA 序列通常按 5' 到 3' 方向书写。","mistake":"不能只看碱基字母，还要注意单链有 5' 端和 3' 端方向。","question":"为什么 RNA 序列通常要注明 5' 到 3' 方向？","id":"direction"},{"title":"单链折叠","titleEn":"Single-Strand Folding","goal":"理解 RNA 可以通过内部互补配对形成局部折叠。","keywords":["内部配对 Internal Pairing","发夹结构 Hairpin","氢键 Hydrogen Bonds"],"explanation":"同一条 RNA 链的不同片段之间也可能发生 A-U、C-G 配对，使 RNA 形成发夹、环和更复杂的空间构象。","mistake":"RNA 的单链状态不等于没有碱基配对；配对可以发生在同一条链内部。","question":"tRNA 为什么能形成比较稳定的三维形态？","id":"folding"},{"title":"RNA 种类","titleEn":"RNA Types","goal":"比较 mRNA、tRNA 和 rRNA 的基本功能与结构特点。","keywords":["mRNA","tRNA","rRNA"],"explanation":"mRNA 主要携带遗传信息，tRNA 负责转运氨基酸并识别密码子，rRNA 是核糖体的重要组成部分。三者都属于 RNA，但结构和功能并不相同。","mistake":"不要把所有 RNA 都画成同一种直线；不同 RNA 的结构特点和作用场景不同。","question":"为什么同样是 RNA，mRNA、tRNA 和 rRNA 的形态会明显不同？","id":"types"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"rna-webgl","version":"2.4.2","publish":true,"title":{"zh":"RNA 结构模型","en":"RNA Structure Model"},"summary":{"zh":"观察 RNA 单链、核糖、四种碱基及单链折叠。","en":"Explore RNA single strands, ribose, bases and folding."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"整体观察","en":"Overview"}},{"id":"ribose","title":{"zh":"核糖特点","en":"Ribose Feature"}},{"id":"bases","title":{"zh":"四种碱基","en":"Four Bases"}},{"id":"direction","title":{"zh":"骨架方向","en":"Backbone Direction"}},{"id":"folding","title":{"zh":"单链折叠","en":"Single-Strand Folding"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
ANDER_MODEL_CONTENT.stages = ANDER_MODEL_CONTENT.stages.filter((stage) => stage.id !== "types");
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"rna-webgl","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"rnaFold":0.18,"rnaSelected":"","rnaReferenceOpen":true,"rnaWebglQuaternion":{"x":0,"y":0,"z":0,"w":1},"rnaWebglZoom":1,"rnaWebglPan":{"x":0,"y":0},"rnaWebglViewIndex":-1};
const speeds = [0.5, 1, 1.5, 2];
const views = ["整体视角", "局部视角", "侧面视角", "顶部视角", "底部视角"];
const state = cloneValue(ANDER_MODEL_DEFAULT_STATE);
const models = [ANDER_MODEL_CONTENT];
let dnaAnimationFrame = 0;
let dnaWebglAnimationFrame = 0;
let dnaWebglCleanup = null;
let threeModulePromise = null;
let shellExperience = null;
let structureRuntime = null;
let structureMountFrame = 0;

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function $(selector) {
  return document.querySelector(selector);
}

function currentModel() {
  return ANDER_MODEL_CONTENT;
}

function currentStage() {
  return currentModel().stages[state.stageIndex] || currentModel().stages[0];
}

function currentTuning() {
  return { structures: {}, labels: state.labels, speedIndex: state.speedIndex, motion: 100 };
}

function setCurrentTuning() {}
function applyStageTuning() {}

function resolveModelLibraryUrl() {
  const requested = new URLSearchParams(window.location.search).get("return");
  if (requested) {
    try {
      const url = new URL(requested, window.location.href);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch (_) {}
  }
  if (document.referrer) return document.referrer;
  if (window.location.hostname === "127.0.0.1" && window.location.port === "4180") {
    return "http://127.0.0.1:4181/site/index.html";
  }
  return new URL("../../../../index.html", window.location.href).href;
}

const root = document.querySelector("[data-independent-model-root]");
root.innerHTML = `
  <main class="independent-model-app" data-model-app>
    <header class="independent-model-header">
      <a class="independent-model-back" href="${resolveModelLibraryUrl()}" aria-label="返回主页">
        <span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span>
        <span class="independent-model-back-label"><span>返回</span><span>主页</span></span>
      </a>
      <div class="independent-model-heading">
        <span class="independent-model-kicker">${currentModel().chapter || "生物学互动模型"}</span>
        <h1>${ANDER_MODEL_MANIFEST.title.zh} <small>/ ${ANDER_MODEL_MANIFEST.title.en}</small></h1>
      </div>
      <button class="shell-icon-button" type="button" data-structure-settings aria-label="显示与操作"></button>
    </header>
    <section class="independent-model-workspace">
      <section class="model-area" data-model-area>
        <nav class="stage-strip" data-stage-strip aria-label="模型阶段"></nav>
        <div class="model-stage" data-model-stage></div>
        <div class="control-dock" data-control-dock>
          <div class="control-group control-group-primary">
            <button class="control-button is-primary" type="button" data-action="play"></button>
            <button class="control-button" type="button" data-action="reset"></button>
            <button class="control-button" type="button" data-action="prev"></button>
            <button class="control-button" type="button" data-action="next"></button>
          </div>
          <div class="timeline-wrap structure-timeline"><span>单链折叠</span></div>
          <div class="control-group control-group-view">
            <button class="control-button" type="button" data-action="speed"></button>
            <button class="control-button" type="button" data-action="labels"></button>
            <button class="control-button" type="button" data-action="highlight"></button>
            <button class="control-button" type="button" data-action="view"></button>
          </div>
          <div class="control-group control-group-personal">
            <button class="control-button" type="button" data-shell-tools></button>
            <button class="control-button" type="button" data-shell-help></button>
            <button class="control-button" type="button" data-shell-favorite></button>
            <button class="control-button" type="button" data-action="fullscreen"></button>
          </div>
        </div>
      </section>
    </section>
  </main>
`;

const app = $("[data-model-app]");
const refs = {
  stageStrip: $("[data-stage-strip]"),
  modelArea: $("[data-model-area]"),
  stage: $("[data-model-stage]"),
};

const CONTROL_CAPABILITIES = {
  "play": "play",
  reset: "reset",
  "prev": "stages",
  "next": "stages",
  speed: "speed",
  labels: "labels",
  highlight: "highlight",
  view: "viewPresets",
  fullscreen: "fullscreen",
};
Object.entries(CONTROL_CAPABILITIES).forEach(([action, capability]) => {
  if (!ANDER_MODEL_MANIFEST.capabilities[capability]) document.querySelector('[data-action="' + action + '"]')?.remove();
});
document.querySelectorAll(".control-group").forEach((group) => {
  if (!group.children.length) group.remove();
});

function icon(name) {
  const paths = {
    play: '<polygon points="8 5 19 12 8 19 8 5"></polygon>',
    pause: '<path d="M9 5v14"></path><path d="M15 5v14"></path>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.6"></path><path d="M4 4v6h6"></path>',
    prev: '<path d="M15 18l-6-6 6-6"></path>',
    next: '<path d="M9 18l6-6-6-6"></path>',
    speed: '<path d="M5 17a8 8 0 1 1 14 0"></path><path d="M12 13l4-4"></path>',
    labels: '<path d="M4 6h16"></path><path d="M7 12h10"></path><path d="M9 18h6"></path>',
    highlight: '<path d="M12 3l2.5 6 6.5.5-5 4.2 1.5 6.3-5.5-3.3L6.5 20l1.5-6.3-5-4.2L9.5 9 12 3z"></path>',
    view: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"></path><circle cx="12" cy="12" r="3"></circle>',
    practice: '<path d="M9 11l2 2 4-5"></path><path d="M5 4h14v16H5z"></path>',
    fullscreen: '<path d="M8 3H3v5"></path><path d="M16 3h5v5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function controlContent(name, label) {
  return globalThis.AnderModelShell.controlContent(name, label);
}

function renderStages() {
  refs.stageStrip.style.setProperty("--stage-count", String(currentModel().stages.length));
  if (!refs.stageStrip.children.length) refs.stageStrip.innerHTML = currentModel().stages.map((stage, index) => `
    <button class="stage-tab ${index === state.stageIndex ? "is-active" : ""}" type="button" data-stage-index="${index}">
      ${globalThis.AnderModelShell.stageContent(index, stage.title, stage.titleEn)}
    </button>
  `).join("");
  refs.stageStrip.querySelectorAll('.stage-tab').forEach((button,index) => {
    const active=index===state.stageIndex;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
    if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  shellExperience?.syncStage();
}

function stopVisualRuntime() {
  if(structureMountFrame)cancelAnimationFrame(structureMountFrame);structureMountFrame=0;
  structureRuntime=null;
  if (dnaAnimationFrame) cancelAnimationFrame(dnaAnimationFrame);
  if (dnaWebglAnimationFrame) cancelAnimationFrame(dnaWebglAnimationFrame);
  dnaAnimationFrame = 0;
  dnaWebglAnimationFrame = 0;
  if (typeof dnaWebglCleanup === "function") dnaWebglCleanup();
  dnaWebglCleanup = null;
}

function modelFullscreenTarget() {
  return refs.modelArea;
}

function isModelFullscreenActive() {
  return document.fullscreenElement === modelFullscreenTarget() || modelFullscreenTarget().classList.contains("is-css-fullscreen");
}

async function toggleModelFullscreen() {
  const target = modelFullscreenTarget();
  if (document.fullscreenElement) return document.exitFullscreen?.();
  if (target.requestFullscreen) return target.requestFullscreen();
  target.classList.toggle("is-css-fullscreen");
  document.documentElement.classList.toggle("model-css-fullscreen-active", target.classList.contains("is-css-fullscreen"));
}

function updateControls() {
  const set = (action, name, label) => {
    const button = $(`[data-action="${action}"]`);
    if (button) globalThis.AnderModelShell.setControl(button, name, label);
  };
  set("play", state.playing ? "pause" : "play", state.playing ? "暂停" : "播放");
  set("reset", "reset", "重置");
  set("prev", "prev", "上一步");
  set("next", "next", "下一步");
  set("speed", "speed", `${speeds[state.speedIndex]}x`);
  set("labels", "labels", "标签");
  set("highlight", "highlight", "高亮");
  set("view", "view", "视角");
  set("practice", "practice", "练习");
  set("fullscreen", "fullscreen", isModelFullscreenActive() ? "退出全屏" : "全屏");
  $(`[data-action="labels"]`)?.setAttribute("aria-pressed", String(state.labels));
  $(`[data-action="highlight"]`)?.setAttribute("aria-pressed", String(state.highlight));
}

function renderVisual(options = {}) {
  const visualClass=[state.labels?'':'hidden-labels',state.highlight?'highlight-on':'',state.playing?'playing':''].filter(Boolean).join(' ');
  refs.stage.className='model-stage';refs.stage.style.setProperty('--speed-factor',speeds[state.speedIndex]);
  let visual=refs.stage.querySelector('.visual-wrap');
  if(!visual){refs.stage.innerHTML=`<div class="visual-wrap ${ANDER_MODEL_ADAPTER.wrapClass||''}">${ANDER_MODEL_ADAPTER.visual()}</div>`;visual=refs.stage.firstElementChild;prepareStructureLayout();}
  visual.className=`visual-wrap ${ANDER_MODEL_ADAPTER.wrapClass||''} ${visualClass}`;
  const runtime=structureRuntime;
  if(runtime)runtime.sync(options);
  else if(!structureMountFrame&&!dnaWebglCleanup)structureMountFrame=requestAnimationFrame(()=>{structureMountFrame=0;ANDER_MODEL_ADAPTER.mount?.();});
  syncStructureInfo();
}

function render() {
  renderStages();
  renderVisual();
  updateControls();
  reportModelState();
}

function setStage(index) {
  state.stageIndex = Math.max(0, Math.min(Number(index) || 0, currentModel().stages.length - 1));
  state.dnaSelected = "";
  state.rnaSelected = "";
  state.proteinSelected = "";
  state.membraneSelected = "";
  state.plantCellSelected = "";
  state.activeTransportSelected = "";
  if (currentModel().visual === "proteinWebgl") state.proteinProgress = state.stageIndex;
  if (currentModel().visual === "transport") {
    state.transportProgress = 0.08;
    state.transportPlayStartProgress = 0.08;
    state.transportPlayStartTime = state.playing ? performance.now() * 0.001 : 0;
  }
  render();
  emitModelMessage("model:stage-changed", { stageId: currentStage().id || String(state.stageIndex), stageIndex: state.stageIndex });
}

function resetState() {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, cloneValue(ANDER_MODEL_DEFAULT_STATE));
  render();
}


function rnaWebglVisual() {
  return `
    <div class="rna-webgl-stack" data-rna-webgl-root>
      <div class="dna-3d-shell dna-webgl-shell rna-webgl-shell" data-rna-webgl-shell>
        <div class="dna-webgl-viewport-frame" data-rna-webgl-viewport>
          <div class="dna-webgl-host" data-rna-webgl-host></div>
          <div class="dna-webgl-labels" data-rna-webgl-labels></div>
        </div>
        <div class="dna-webgl-loading" data-rna-webgl-loading>正在加载 RNA WebGL 三维模型...</div>
      </div>
      <aside class="rna-webgl-sidecar" aria-label="RNA 模型辅助信息">
        <div class="dna-state-control rna-state-control" data-rna-webgl-state-control>
            <div class="dna-state-header">
              <span>结构状态调节</span>
              <strong data-rna-webgl-fold-value>${Math.round(state.rnaFold * 100)}%</strong>
            </div>
            <label>
              <span>单链折叠 / Single-Strand Folding</span>
              <input type="range" min="0" max="100" value="${Math.round(state.rnaFold * 100)}" data-rna-webgl-fold />
            </label>
        </div>
        ${rnaReferenceDisclosure()}
      </aside>
    </div>
  `;
}

function rnaTypePanel() {
  const items = [
    {
      key: "mrna",
      title: "mRNA 信使 RNA",
      en: "Messenger RNA",
      note: "较长单链，携带密码子序列，把 DNA 信息带到翻译过程。",
    },
    {
      key: "trna",
      title: "tRNA 转运 RNA",
      en: "Transfer RNA",
      note: "折叠成稳定结构，一端连接氨基酸，反密码子识别 mRNA 密码子。",
    },
    {
      key: "rrna",
      title: "rRNA 核糖体 RNA",
      en: "Ribosomal RNA",
      note: "与蛋白质共同组成核糖体，是核糖体结构和催化功能的重要基础。",
    },
  ];

  return `
    <aside class="rna-type-panel" data-rna-type-panel aria-label="RNA 种类说明">
      <div class="rna-type-heading">
        <strong>RNA 种类窗口</strong>
        <span>mRNA · tRNA · rRNA</span>
      </div>
      <div class="rna-type-list">
        ${items
          .map(
            (item) => `
              <article class="rna-type-card ${state.stageIndex === 5 ? "is-emphasized" : ""}">
                ${rnaTypeMiniSvg(item.key)}
                <div>
                  <strong>${item.title}</strong>
                  <span>${item.en}</span>
                  <p>${item.note}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </aside>
  `;
}

function rnaTypeMiniSvg(type) {
  // RNA type cards now use the larger reference-image style diagrams below.
  return rnaReferenceStyleTypeSvg(type);

  if (type === "trna") {
    return `
      <svg class="rna-type-svg" viewBox="0 0 132 96" role="img" aria-label="tRNA 三叶草结构示意图">
        <path d="M61 12 H71 V37 H61 Z" fill="#F0FDFA" stroke="#0F766E" stroke-width="3" />
        <path d="M66 37 C43 24 25 36 27 56 C42 63 57 55 66 37Z" fill="#ECFDF5" stroke="#0F766E" stroke-width="3" />
        <path d="M66 37 C89 24 107 36 105 56 C90 63 75 55 66 37Z" fill="#ECFDF5" stroke="#0F766E" stroke-width="3" />
        <path d="M56 47 H76 V67 H56 Z" fill="#F0FDFA" stroke="#0F766E" stroke-width="3" />
        <path d="M56 67 C56 84 76 84 76 67" fill="#DCFCE7" stroke="#0F766E" stroke-width="3" />
        <path d="M66 12 V4" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
        <circle cx="66" cy="3" r="4" fill="#F59E0B" />
        <g stroke="#0F766E" stroke-width="1.6">
          <line x1="61" y1="18" x2="71" y2="18" />
          <line x1="61" y1="25" x2="71" y2="25" />
          <line x1="61" y1="32" x2="71" y2="32" />
          <line x1="56" y1="53" x2="76" y2="53" />
          <line x1="56" y1="60" x2="76" y2="60" />
        </g>
        <text x="66" y="89">反密码子环</text>
      </svg>
    `;
  }

  if (type === "rrna") {
    return `
      <svg class="rna-type-svg" viewBox="0 0 132 96" role="img" aria-label="rRNA 与核糖体结构示意图">
        <path d="M24 46 C26 24 46 16 67 22 C92 12 114 27 111 53 C108 78 80 86 62 75 C39 84 18 70 24 46Z" fill="#E0F2FE" stroke="#0369A1" stroke-width="3" />
        <path d="M32 58 C48 43 60 70 76 54 C91 40 96 65 107 50" fill="none" stroke="#14B8A6" stroke-width="4.5" stroke-linecap="round" />
        <path d="M35 40 C47 24 61 45 72 31 C84 18 99 31 98 45" fill="none" stroke="#F97316" stroke-width="4" stroke-linecap="round" />
        <path d="M46 69 C56 57 68 69 80 62 C90 56 96 62 101 72" fill="none" stroke="#A855F7" stroke-width="3.8" stroke-linecap="round" />
        <circle cx="49" cy="34" r="4.5" fill="#22C55E" />
        <circle cx="84" cy="46" r="4.5" fill="#EF4444" />
        <circle cx="68" cy="64" r="4.5" fill="#06B6D4" />
        <text x="66" y="13">核糖体 RNA</text>
      </svg>
    `;
  }

  return `
    <svg class="rna-type-svg" viewBox="0 0 132 96" role="img" aria-label="mRNA 长单链示意图">
      <path d="M12 48 C25 38 37 57 50 47 C63 36 75 58 88 48 C101 38 112 50 121 42" fill="none" stroke="#14B8A6" stroke-width="5" stroke-linecap="round" />
      <circle cx="12" cy="48" r="7" fill="#F59E0B" stroke="#D97706" stroke-width="2" />
      <text x="12" y="48">5'</text>
      <path d="M118 42 H127" stroke="#64748B" stroke-width="3" stroke-linecap="round" />
      <text x="120" y="59">3'</text>
      <g>
        <rect x="24" y="63" width="21" height="14" rx="4" fill="#DCFCE7" stroke="#16A34A" />
        <rect x="50" y="63" width="21" height="14" rx="4" fill="#DBEAFE" stroke="#2563EB" />
        <rect x="76" y="63" width="21" height="14" rx="4" fill="#FEE2E2" stroke="#EF4444" />
      </g>
      <text x="61" y="18">密码子连续排列</text>
    </svg>
  `;
}

function rnaReferenceStyleTypeSvg(type) {
  if (type === "trna") {
    return `
      <svg class="rna-type-svg" viewBox="0 0 160 230" role="img" aria-label="tRNA cloverleaf diagram">
        <rect width="160" height="230" fill="#fff1f7" />
        <text class="rna-type-title" x="80" y="38">tRNA</text>
        <path
          d="M67 55
             L67 92
             L67 105
             L52 105
             L52 116
             C34 118 29 140 45 148
             C56 154 69 145 67 132
             L67 170
             C55 175 52 191 63 202
             C77 216 100 207 97 188
             C96 179 88 172 80 170
             L93 132
             C91 145 104 154 115 148
             C131 140 126 118 108 116
             L108 105
             L93 105
             L93 92
             L93 55"
          fill="none"
          stroke="#fff1f7"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M67 55
             L67 92
             L67 105
             L52 105
             L52 116
             C34 118 29 140 45 148
             C56 154 69 145 67 132
             L67 170
             C55 175 52 191 63 202
             C77 216 100 207 97 188
             C96 179 88 172 80 170
             L93 132
             C91 145 104 154 115 148
             C131 140 126 118 108 116
             L108 105
             L93 105
             L93 92
             L93 55"
          fill="none"
          stroke="#08718d"
          stroke-width="3.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g stroke="#08718d" stroke-width="2.1" stroke-linecap="round">
          <line x1="67" y1="64" x2="93" y2="64" />
          <line x1="67" y1="72" x2="93" y2="72" />
          <line x1="67" y1="80" x2="93" y2="80" />
          <line x1="67" y1="88" x2="93" y2="88" />
          <line x1="67" y1="96" x2="93" y2="96" />
          <line x1="52" y1="112" x2="67" y2="112" />
          <line x1="52" y1="121" x2="67" y2="121" />
          <line x1="52" y1="130" x2="67" y2="130" />
          <line x1="93" y1="112" x2="108" y2="112" />
          <line x1="93" y1="121" x2="108" y2="121" />
          <line x1="93" y1="130" x2="108" y2="130" />
          <line x1="67" y1="142" x2="93" y2="142" />
          <line x1="67" y1="151" x2="93" y2="151" />
          <line x1="67" y1="160" x2="93" y2="160" />
        </g>
      </svg>
    `;
  }

  if (type === "rrna") {
    return `
      <svg class="rna-type-svg" viewBox="0 0 160 230" role="img" aria-label="rRNA ribosome diagram">
        <rect width="160" height="230" fill="#f2e9fb" />
        <text class="rna-type-title" x="80" y="38">rRNA</text>
        <path d="M34 121 C26 103 43 92 58 95 C69 75 110 76 121 94 C138 99 145 116 132 131 C119 148 96 145 82 135 C67 150 43 143 34 121Z" fill="#bee8c5" stroke="#63b974" stroke-width="2.2" />
        <path d="M36 165 C28 146 43 140 57 145 C72 137 86 150 100 144 C120 135 141 148 136 167 C128 187 101 187 83 179 C67 191 43 184 36 165Z" fill="#c8eff8" stroke="#79cbd9" stroke-width="2.2" />
        <path d="M45 121 C56 105 72 122 83 107 C94 91 111 98 105 120 C101 134 116 126 121 138" fill="none" stroke="#08718d" stroke-width="3.2" stroke-linecap="round" />
        <path d="M46 166 C60 153 77 171 94 160 C108 151 120 160 128 168" fill="none" stroke="#08718d" stroke-width="3.2" stroke-linecap="round" />
        <g stroke="#08718d" stroke-width="1.8" stroke-linecap="round">
          <line x1="48" y1="119" x2="43" y2="114" />
          <line x1="54" y1="112" x2="49" y2="107" />
          <line x1="62" y1="109" x2="60" y2="102" />
          <line x1="72" y1="116" x2="76" y2="110" />
          <line x1="84" y1="107" x2="79" y2="101" />
          <line x1="92" y1="100" x2="91" y2="93" />
          <line x1="101" y1="101" x2="104" y2="95" />
          <line x1="106" y1="112" x2="113" y2="111" />
          <line x1="109" y1="127" x2="116" y2="124" />
          <line x1="119" y1="137" x2="126" y2="134" />
          <line x1="49" y1="164" x2="45" y2="158" />
          <line x1="58" y1="158" x2="57" y2="151" />
          <line x1="69" y1="160" x2="72" y2="153" />
          <line x1="81" y1="170" x2="84" y2="163" />
          <line x1="95" y1="159" x2="94" y2="152" />
          <line x1="108" y1="156" x2="111" y2="150" />
          <line x1="122" y1="164" x2="128" y2="160" />
        </g>
      </svg>
    `;
  }

  return `
    <svg class="rna-type-svg" viewBox="0 0 160 230" role="img" aria-label="mRNA curved strand diagram">
      <rect width="160" height="230" fill="#eaf5ff" />
      <text class="rna-type-title" x="80" y="38">mRNA</text>
      <path d="M39 204 C31 162 39 134 61 121 C84 108 109 108 122 84 C128 74 131 64 133 53" fill="none" stroke="#08718d" stroke-width="3.4" stroke-linecap="round" />
      <g stroke="#08718d" stroke-width="2" stroke-linecap="round">
        <line x1="39" y1="202" x2="49" y2="202" />
        <line x1="38" y1="193" x2="48" y2="194" />
        <line x1="37" y1="184" x2="47" y2="186" />
        <line x1="37" y1="175" x2="47" y2="178" />
        <line x1="38" y1="166" x2="48" y2="170" />
        <line x1="40" y1="158" x2="49" y2="163" />
        <line x1="43" y1="150" x2="51" y2="156" />
        <line x1="47" y1="142" x2="55" y2="149" />
        <line x1="52" y1="134" x2="59" y2="142" />
        <line x1="58" y1="125" x2="63" y2="134" />
        <line x1="67" y1="118" x2="71" y2="128" />
        <line x1="77" y1="114" x2="80" y2="124" />
        <line x1="88" y1="112" x2="90" y2="122" />
        <line x1="99" y1="108" x2="103" y2="118" />
        <line x1="110" y1="100" x2="117" y2="108" />
        <line x1="119" y1="90" x2="129" y2="95" />
        <line x1="125" y1="79" x2="135" y2="83" />
        <line x1="130" y1="67" x2="141" y2="70" />
        <line x1="133" y1="55" x2="144" y2="58" />
      </g>
    </svg>
  `;
}

function rnaReferenceDisclosure() {
  const isOpen = state.rnaReferenceOpen;
  return `
    <div class="dna-reference-disclosure ${isOpen ? "is-open" : ""}" data-rna-reference-disclosure>
      <button class="dna-reference-toggle" type="button" data-rna-reference-toggle aria-expanded="${isOpen}" aria-controls="rna-reference-panel">
        <span>碱基与核苷酸的结构 / Base &amp; Nucleotide Structures</span>
        <strong>${isOpen ? "收起" : "展开"}</strong>
      </button>
      <div class="dna-reference-panel-wrap" id="rna-reference-panel" ${isOpen ? "" : "hidden"}>
        ${rnaReferencePanel()}
      </div>
    </div>
  `;
}

function rnaReferencePanel() {
  const baseItems = [
    { base: "A", name: "腺嘌呤", en: "Adenine", type: "嘌呤双环", pair: "U", bonds: 2 },
    { base: "G", name: "鸟嘌呤", en: "Guanine", type: "嘌呤双环", pair: "C", bonds: 3 },
    { base: "C", name: "胞嘧啶", en: "Cytosine", type: "嘧啶单环", pair: "G", bonds: 3 },
    { base: "U", name: "尿嘧啶", en: "Uracil", type: "嘧啶单环", pair: "A", bonds: 2 },
  ];

  return `
    <aside class="dna-reference-panel" data-rna-reference-panel aria-label="RNA 结构说明" tabindex="0">
      <section class="dna-reference-section dna-reference-section--bases">
        <h3>含氮碱基 <span>结构简图省略部分氢原子</span></h3>
        <div class="dna-reference-list">
          ${baseItems
            .map(
              (item) => `
                <article class="dna-reference-card">
                  ${rnaBaseMiniSvg(item.base)}
                  <div class="dna-reference-card-copy">
                    <strong>${item.base} ${item.name}</strong>
                    <span>${item.en} · ${item.type}</span>
                    <p>与 ${item.pair} 配对，形成 ${item.bonds} 条氢键</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="dna-reference-section dna-reference-section--nucleotide">
        <h3>核糖核苷酸 <span>磷酸 + 核糖 + 含氮碱基</span></h3>
        <div class="dna-nucleotide-figure">
          ${rnaNucleotideMiniSvg()}
          <p>碱基连接在核糖的 1′ 碳上，磷酸连接在 5′ 碳一侧；2′ 碳和 3′ 碳均连接 OH，是核糖的结构特征。</p>
        </div>
      </section>
    </aside>
  `;
}

const RNA_BASE_CHEMISTRY = Object.freeze({
  A: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], element:[7,7,7,7,7,6,6,6,6,6,1,1,1,1,1], x:[4.6783,4.6783,2.866,2,2.866,3.7321,3.7321,2.866,5.2619,2,4.8709,5.8819,1.4631,2.3291,3.403], y:[0.1497,-1.4597,-1.655,-0.155,1.345,-0.155,-1.155,0.345,-0.655,-1.155,0.7391,-0.655,-1.465,1.655,1.655], a:[1,1,1,2,2,3,3,4,4,5,5,5,6,6,9,10], b:[6,9,11,7,9,7,10,8,10,8,14,15,7,8,12,13], order:[1,1,1,1,2,2,1,1,2,1,1,1,1,2,1,1] },
  G: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], element:[8,7,7,7,7,7,6,6,6,6,6,1,1,1,1,1], x:[4.269,4.269,6.0812,6.0812,3.403,2.5369,5.135,5.135,4.269,3.403,6.6648,4.269,6.2738,7.2848,2,2.5369], y:[1.81,-1.19,0.6147,-0.9947,0.31,-1.19,0.31,-0.69,0.81,-0.69,-0.19,-1.81,1.204,-0.19,-0.88,-1.81], a:[1,2,2,2,3,3,3,4,4,5,5,6,6,6,7,7,11], b:[9,8,10,12,7,11,13,8,11,9,10,10,15,16,8,9,14], order:[2,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1,1] },
  C: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13], element:[8,7,7,7,6,6,6,6,1,1,1,1,1], x:[6.001,4.269,2.5369,5.135,3.403,3.403,5.135,4.269,4.269,2.866,4.269,2,2.5369], y:[-0.69,-0.69,-0.69,0.81,-0.19,0.81,-0.19,1.31,-1.31,1.12,1.93,-0.38,-1.31], a:[1,2,2,2,3,3,3,4,4,5,6,6,8], b:[7,5,7,9,5,12,13,7,8,6,8,10,11], order:[2,1,1,1,1,1,1,1,2,2,1,1,1] },
  U: { aid:[1,2,3,4,5,6,7,8,9,10,11,12], element:[8,8,7,7,6,6,6,6,1,1,1,1], x:[5.4641,2,3.7321,4.5981,4.5981,2.866,3.7321,2.866,3.7321,5.135,2.3291,3.7321], y:[-0.69,-0.69,-0.69,0.81,-0.19,-0.19,1.31,0.81,-1.31,1.12,1.12,1.93], a:[1,2,3,3,3,4,4,4,6,7,7,8], b:[5,6,5,6,9,5,7,10,8,8,12,11], order:[2,2,1,1,1,1,1,1,1,2,1,1] },
});

const RNA_BASE_RINGS = Object.freeze({
  A: [[1, 6, 7, 2, 9], [6, 7, 3, 10, 4, 8]],
  G: [[3, 7, 8, 4, 11], [7, 8, 2, 10, 5, 9]],
  C: [[2, 5, 6, 8, 4, 7]],
  U: [[3, 5, 6, 8, 4, 7]],
});

function rnaBaseMiniSvg(base) {
  const structure = RNA_BASE_CHEMISTRY[base];
  const atoms = structure.aid.map((id, index) => ({ id, element: structure.element[index], x: structure.x[index], y: structure.y[index] }));
  const atomById = new Map(atoms.map((atom) => [atom.id, atom]));
  const hydrogenCount = new Map();
  structure.a.forEach((fromId, index) => {
    const toId = structure.b[index];
    const from = atomById.get(fromId);
    const to = atomById.get(toId);
    if (from.element === 1 && to.element !== 1) hydrogenCount.set(to.id, (hydrogenCount.get(to.id) || 0) + 1);
    if (to.element === 1 && from.element !== 1) hydrogenCount.set(from.id, (hydrogenCount.get(from.id) || 0) + 1);
  });
  const heavyAtoms = atoms.filter((atom) => atom.element !== 1);
  const minX = Math.min(...heavyAtoms.map((atom) => atom.x));
  const maxX = Math.max(...heavyAtoms.map((atom) => atom.x));
  const minY = Math.min(...heavyAtoms.map((atom) => atom.y));
  const maxY = Math.max(...heavyAtoms.map((atom) => atom.y));
  const scale = Math.min(112 / Math.max(maxX - minX, 0.1), 76 / Math.max(maxY - minY, 0.1));
  const offsetX = (160 - (maxX - minX) * scale) / 2;
  const offsetY = (108 - (maxY - minY) * scale) / 2;
  const point = (atom) => ({ x: offsetX + (atom.x - minX) * scale, y: offsetY + (maxY - atom.y) * scale });
  const ringFills = RNA_BASE_RINGS[base].map((ring) => {
    const points = ring.map((id) => {
      const p = point(atomById.get(id));
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");
    return `<polygon class="chemical-ring-fill" points="${points}" style="--base-color:${RNA_MODEL.colors[base]}" />`;
  }).join("");
  const atomLabel = (atom) => {
    const hydrogens = hydrogenCount.get(atom.id) || 0;
    if (atom.element === 7) return hydrogens === 2 ? "NH₂" : hydrogens === 1 ? "NH" : "N";
    if (atom.element === 8) return hydrogens ? "OH" : "O";
    return "";
  };
  const labels = new Map(heavyAtoms.map((atom) => [atom.id, atomLabel(atom)]));
  const trimRadius = (id) => labels.get(id) ? Math.max(6.5, labels.get(id).length * 3.1) : 0;
  const bondLine = (from, to, offset = 0) => {
    const a = point(from);
    const b = point(to);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const nx = -uy;
    const ny = ux;
    const startTrim = trimRadius(from.id);
    const endTrim = trimRadius(to.id);
    return `<line class="chemical-bond" x1="${(a.x + ux * startTrim + nx * offset).toFixed(2)}" y1="${(a.y + uy * startTrim + ny * offset).toFixed(2)}" x2="${(b.x - ux * endTrim + nx * offset).toFixed(2)}" y2="${(b.y - uy * endTrim + ny * offset).toFixed(2)}" />`;
  };
  const bonds = structure.a.map((fromId, index) => {
    const from = atomById.get(fromId);
    const to = atomById.get(structure.b[index]);
    if (from.element === 1 || to.element === 1) return "";
    return structure.order[index] === 2 ? `${bondLine(from, to, -1.8)}${bondLine(from, to, 1.8)}` : bondLine(from, to);
  }).join("");
  const atomLabels = heavyAtoms.map((atom) => {
    const label = labels.get(atom.id);
    if (!label) return "";
    const p = point(atom);
    return `<text class="chemical-node" x="${p.x.toFixed(2)}" y="${p.y.toFixed(2)}">${label}</text>`;
  }).join("");

  return `
    <svg class="dna-reference-structure dna-reference-base" viewBox="0 0 160 108" role="img" aria-label="${base} 碱基规范结构式">
      <g>${ringFills}${bonds}${atomLabels}</g>
    </svg>
  `;
}

function rnaNucleotideMiniSvg() {
  return `
    <svg class="dna-reference-structure dna-reference-nucleotide rna-reference-nucleotide" viewBox="0 0 320 180" role="img" aria-label="核糖核苷酸组成与碳原子编号">
      <g class="nucleotide-phosphate">
        <circle class="phosphate-node" cx="38" cy="82" r="23" />
        <line class="chemical-bond" x1="35" y1="59" x2="35" y2="43" /><line class="chemical-bond" x1="41" y1="59" x2="41" y2="43" />
        <line class="chemical-bond" x1="15" y1="82" x2="11" y2="82" /><line class="chemical-bond" x1="38" y1="105" x2="38" y2="118" />
        <line class="chemical-bond" x1="61" y1="82" x2="68" y2="82" /><line class="chemical-bond" x1="82" y1="77" x2="94" y2="64" />
        <text class="phosphate-label" x="38" y="83">P</text>
        <text class="chemical-node" x="38" y="35">O</text><text class="chemical-node" x="7" y="83">O⁻</text>
        <text class="chemical-node" x="38" y="127">O⁻</text><text class="chemical-node" x="75" y="82">O</text>
      </g>
      <g class="nucleotide-sugar">
        <line class="chemical-bond" x1="102" y1="62" x2="118" y2="70" />
        <polygon class="sugar-ring" points="152,45 186,70 173,110 131,110 118,70" />
        <text class="chemical-node sugar-oxygen" x="152" y="45">O</text>
        <text class="carbon-index" x="193" y="63">1′</text><text class="carbon-index" x="183" y="118">2′</text>
        <text class="carbon-index" x="122" y="120">3′</text><text class="carbon-index" x="107" y="78">4′</text>
        <circle class="carbon-vertex" cx="98" cy="60" r="2.4" />
        <text class="carbon-index" x="98" y="47">5′</text>
        <line class="chemical-bond" x1="173" y1="110" x2="179" y2="136" /><line class="chemical-bond" x1="131" y1="110" x2="122" y2="138" />
        <text class="chemical-node" x="184" y="149">OH</text><text class="chemical-node" x="117" y="151">OH</text>
      </g>
      <g class="nucleotide-base" style="--base-color:#dbeafe">
        <line class="chemical-bond" x1="186" y1="70" x2="208" y2="70" />
        <polygon class="base-ring" points="214,70 231,44 264,44 281,70 264,96 231,96" />
        <text class="chemical-node" x="214" y="70">N</text>
        <text class="base-label" x="249" y="67">碱基</text>
        <text class="base-options" x="249" y="83">A / U / C / G</text>
      </g>
      <g class="nucleotide-part-labels">
        <text x="38" y="171">磷酸</text><text x="152" y="171">核糖</text><text x="249" y="113">含氮碱基</text>
      </g>
    </svg>
  `;
}

const RNA_MODEL = {
  count: 20,
  rise: 3.85,
  radius: 6.4,
  twist: Math.PI / 5.15,
  y0: -((20 - 1) * 3.85) / 2,
  sequence: "AUGCGAAUUCGCAAUCGCUA".split(""),
  complement: { A: "U", U: "A", G: "C", C: "G" },
  hbonds: { A: 2, U: 2, G: 3, C: 3 },
  colors: {
    phosphate: "#06B6D4",
    sugar: "#F59E0B",
    sugarCarbon: "#475569",
    sugarOxygen: "#EF4444",
    hydroxyl: "#EC4899",
    hydroxylHydrogen: "#F8FAFC",
    backbone: "#1D4ED8",
    phosphodiester: "#2563EB",
    internalHbond: "#94A3B8",
    A: "#22C55E",
    U: "#EF4444",
    C: "#A855F7",
    G: "#F97316",
  },
};

const RNA_PART_LABELS = {
  phosphate: "磷酸 / Phosphate",
  sugar: "核糖 / Ribose",
  hydroxyl: "2'-OH 羟基 / 2'-OH hydroxyl",
  base: "含氮碱基 / Nitrogenous Base",
  backbone: "磷酸-核糖骨架 / Sugar-phosphate Backbone",
  phosphodiester: "3',5'-磷酸二酯键 / 3',5'-Phosphodiester Bond",
  internalHbond: "内部氢键 / Internal Hydrogen Bond",
};

function smoothOpen(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DNA_THREE_URL = "./vendor/three.module.min.js";

const RNA_THREE_VIEW_SIZE = 96;

const RNA_THREE_PHOSPHATE_OFFSET = 2.85;

const RNA_THREE_SUGAR_ATOMS = {
  C1: { x: 1.36, y: 0, z: 0 },
  C2: { x: 0.42, y: -1.29, z: 0 },
  C3: { x: -1.1, y: -0.8, z: 0 },
  C4: { x: -1.1, y: 0.8, z: 0 },
  O4: { x: 0.42, y: 1.29, z: 0 },
  C5: { x: -2.06, y: 1.52, z: 0 },
  O2: { x: 0.92, y: -2.04, z: 0 },
  H2: { x: 1.46, y: -2.42, z: 0 },
};

const RNA_INTERNAL_PAIRS = [
  [2, 17],
  [3, 16],
  [4, 15],
  [5, 14],
  [7, 12],
];

function loadThreeForDna() {
  if (!threeModulePromise) {
    threeModulePromise = import(DNA_THREE_URL);
  }
  return threeModulePromise;
}

function mountRnaWebgl() {
  const shell = document.querySelector("[data-rna-webgl-shell]");
  const host = document.querySelector("[data-rna-webgl-host]");
  const labelsLayer = document.querySelector("[data-rna-webgl-labels]");
  const feedback = document.querySelector("[data-rna-webgl-feedback]");
  const loading = document.querySelector("[data-rna-webgl-loading]");
  if (!shell || !host || !labelsLayer) return;

  let disposed = false;
  let instanceCleanup = null;
  dnaWebglCleanup = () => {
    disposed = true;
    if (instanceCleanup) instanceCleanup();
    dnaWebglCleanup = null;
  };

  loadThreeForDna()
    .then((THREE) => {
      if (disposed || !document.body.contains(shell)) return;
      instanceCleanup = startRnaWebgl(THREE, shell, host, labelsLayer, feedback, loading);
      shellExperience?.setSceneStatus('ready');
    })
    .catch((error) => {
      console.warn("Three.js failed to load", error);
      threeModulePromise=null;
      shellExperience?.setSceneStatus('error','三维画面未能加载，请重试或换用支持 WebGL 的浏览器。',()=>{shellExperience.setSceneStatus('loading');stopVisualRuntime();host.replaceChildren();labelsLayer.replaceChildren();mountRnaWebgl();});
      if (loading) {
        loading.textContent = "三维画面未能加载，请重试。";
      }
    });
}

function mountRnaReferenceDisclosure() {
  const disclosure = document.querySelector("[data-rna-reference-disclosure]");
  const toggle = disclosure?.querySelector("[data-rna-reference-toggle]");
  const panelWrap = disclosure?.querySelector(".dna-reference-panel-wrap");
  const toggleLabel = toggle?.querySelector("strong");
  if (!disclosure || !toggle || !panelWrap) return;

  const sync = () => {
    disclosure.classList.toggle("is-open", state.rnaReferenceOpen);
    toggle.setAttribute("aria-expanded", String(state.rnaReferenceOpen));
    panelWrap.hidden = !state.rnaReferenceOpen;
    if (toggleLabel) toggleLabel.textContent = state.rnaReferenceOpen ? "收起" : "展开";
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    state.rnaReferenceOpen = !state.rnaReferenceOpen;
    sync();
  });

  sync();
}

function startRnaWebgl(THREE, shell, host, labelsLayer, feedback, loading) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
  renderer.domElement.className = "dna-webgl-canvas";
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL RNA 单链结构模型");
  host.appendChild(renderer.domElement);
  if (loading) loading.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
  camera.position.set(0, 0, 120);
  camera.lookAt(0, 0, 0);

  const panRoot = new THREE.Group();
  const rnaRoot = new THREE.Group();
  const molecule = new THREE.Group();
  scene.add(panRoot);
  panRoot.add(rnaRoot);
  rnaRoot.add(molecule);

  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const hemi = new THREE.HemisphereLight(0xf8fbff, 0xe2e8f0, 0.62);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.62);
  key.position.set(-5, 8, 10);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0f2fe, 0.82);
  fill.position.set(6, 2, 5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.78);
  rim.position.set(0, -5, 9);
  scene.add(rim);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  let labelItems = [];
  let movedDuringDrag = false;
  let dragMode = "";
  let lastX = 0;
  let lastY = 0;
  const activePointers = new Map();
  let touchGesture = null;
  // A multi-finger session stays locked against rotation until every finger lifts.
  let multiTouchUsed = false;
  let gestureCancelled = false;

  applyRnaWebglViewPreset(THREE, rnaRoot, panRoot, camera);
  const lockedRotation = { ...state.rnaWebglRotation };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewSize = RNA_THREE_VIEW_SIZE / Math.min(1, aspect);
    camera.left = (-viewSize * aspect) / 2;
    camera.right = (viewSize * aspect) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.zoom = state.rnaWebglZoom;
    camera.updateProjectionMatrix();
  };

  const saveTransformState = () => {
    state.rnaWebglRotation = { x: lockedRotation.x, y: lockedRotation.y };
    state.rnaWebglQuaternion = {
      x: rnaRoot.quaternion.x,
      y: rnaRoot.quaternion.y,
      z: rnaRoot.quaternion.z,
      w: rnaRoot.quaternion.w,
    };
    state.rnaWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.rnaWebglZoom = camera.zoom;
  };

  const setFeedback = (text) => {
    if (feedback) feedback.textContent = text;
  };

  const addLabel = (text, position, color = "#0f172a", offset = { x: 0, y: -34 }) => {
    if (!state.labels) return;
    const anchor = new THREE.Object3D();
    anchor.position.copy(position);
    molecule.add(anchor);
    const el = document.createElement("div");
    el.className = "dna-webgl-label";
    el.textContent = text;
    el.style.setProperty("--label-color", color);
    labelsLayer.appendChild(el);
    const item = { anchor, el, offset, opacity: 1 };
    labelItems.push(item);
    return item;
  };

  const clearLabels = () => {
    labelItems.forEach((item) => {
      item.el.remove();item.line?.remove();
      item.anchor.removeFromParent();
    });
    labelItems = [];
  };

  let liveMolecule = createRnaWebglLiveMolecule(THREE, molecule, pickables);
  const refreshLabels = () => {
    clearLabels();
    addRnaWebglTeachingLabels(THREE, addLabel, liveMolecule.nucleotides, liveMolecule.baseAnchors);
    labelsLayer.classList.remove("is-folding");
  };

  const projectLabels = () => {
    placeStructureLabels(THREE,labelItems,camera,host,labelsLayer);
  };
  const animate = () => {
    if (!document.body.contains(shell)) return;
    if (state.playing) {
      lockedRotation.y += 0.006 * speeds[state.speedIndex];
      rnaRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
      saveTransformState();
    }
    renderer.render(scene, camera);
    projectLabels();
    dnaWebglAnimationFrame = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  liveMolecule.update(state.rnaFold || 0);
  refreshLabels();
  animate();

  const updatePanByPixels = (dx, dy) => {
    const rect = host.getBoundingClientRect();
    const worldWidth = (camera.right - camera.left) / camera.zoom;
    const worldHeight = (camera.top - camera.bottom) / camera.zoom;
    panRoot.position.x += (dx / (rect.width || 1)) * worldWidth;
    panRoot.position.y -= (dy / (rect.height || 1)) * worldHeight;
    saveTransformState();
  };

  const setZoom = (zoom) => {
    camera.zoom = clamp(zoom, 0.55, 5.2);
    camera.updateProjectionMatrix();
    saveTransformState();
  };

  const currentTouchGesture = () => {
    const points = [...activePointers.values()];
    if (points.length < 2) return null;
    const [a, b] = points;
    return {
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2,
      distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
    };
  };

  const startTouchGesture = () => {
    const gesture = currentTouchGesture();
    if (!gesture) return;
    touchGesture = {
      ...gesture,
      startZoom: camera.zoom,
      startPan: { x: panRoot.position.x, y: panRoot.position.y },
    };
    dragMode = "touch";
    shell.classList.add("is-panning");
  };

  const onPointerDown = (event) => {
    event.preventDefault();
    if (activePointers.size === 0) {
      multiTouchUsed = false;
      gestureCancelled = false;
      movedDuringDrag = false;
      lastX = event.clientX;
      lastY = event.clientY;
      dragMode = event.button === 2 || (event.buttons & 2) ? "pan" : "rotate";
    }
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    shell.setPointerCapture?.(event.pointerId);
    if (activePointers.size >= 2) {
      multiTouchUsed = true;
      movedDuringDrag = true;
      if (!gestureCancelled) startTouchGesture();
    } else {
      shell.classList.toggle("is-panning", dragMode === "pan");
    }
  };

  const onPointerMove = (event) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (gestureCancelled) return;

    if (activePointers.size >= 2) {
      if (!touchGesture) startTouchGesture();
      const gesture = currentTouchGesture();
      if (!gesture || !touchGesture) return;
      const rect = host.getBoundingClientRect();
      const worldWidth = (camera.right - camera.left) / camera.zoom;
      const worldHeight = (camera.top - camera.bottom) / camera.zoom;
      panRoot.position.x = touchGesture.startPan.x + ((gesture.midX - touchGesture.midX) / (rect.width || 1)) * worldWidth;
      panRoot.position.y = touchGesture.startPan.y - ((gesture.midY - touchGesture.midY) / (rect.height || 1)) * worldHeight;
      setZoom(touchGesture.startZoom * (gesture.distance / touchGesture.distance));
      movedDuringDrag = true;
      return;
    }

    // The last finger of a pinch must never become a rotation drag.
    if (multiTouchUsed) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.hypot(dx, dy) > 1.5) movedDuringDrag = true;

    if (dragMode === "pan" || (event.buttons & 2)) {
      updatePanByPixels(dx, dy);
      shell.classList.add("is-panning");
    } else {
      lockedRotation.x = clamp(lockedRotation.x + dy * 0.0075, -Math.PI / 2 + 0.03, Math.PI / 2 - 0.03);
      lockedRotation.y += dx * 0.0075;
      rnaRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
      saveTransformState();
    }
    lastX = event.clientX;
    lastY = event.clientY;
  };

  const finishPointer = (event) => {
    // An explicit release can also emit lostpointercapture; finish only once.
    if (!activePointers.delete(event.pointerId)) return;
    if (event.type !== "pointerup") {
      gestureCancelled = true;
      movedDuringDrag = true;
    }
    touchGesture = null;
    if (activePointers.size >= 2 && !gestureCancelled) startTouchGesture();
    if (activePointers.size === 0) {
      dragMode = "";
      shell.classList.remove("is-panning");
    }
    if (shell.hasPointerCapture?.(event.pointerId)) shell.releasePointerCapture(event.pointerId);
  };

  const cancelPointers = () => {
    if (!activePointers.size) return;
    gestureCancelled = true;
    movedDuringDrag = true;
    const ids = [...activePointers.keys()];
    activePointers.clear();
    touchGesture = null;
    dragMode = "";
    shell.classList.remove("is-panning");
    for (const id of ids) if (shell.hasPointerCapture?.(id)) shell.releasePointerCapture(id);
  };
  const onGestureVisibilityChange = () => { if (document.hidden) cancelPointers(); };

  const onWheel = (event) => {
    event.preventDefault();
    setZoom(camera.zoom * (1 - event.deltaY * 0.0015));
  };

  const onClick = (event) => {
    if (multiTouchUsed || gestureCancelled) return;
    if (movedDuringDrag) {
      movedDuringDrag = false;
      return;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, true);
    const hit = hits.find((item) => item.object.userData?.rnaPart);
    if (!hit) return;
    const part = hit.object.userData.rnaPart;
    const label = RNA_PART_LABELS[part] || hit.object.userData.rnaLabel || "RNA 结构";
    if (state.practice) {
      state.rnaSelected =
        part === "hydroxyl"
          ? `正确：${label}。2'-OH 是 RNA 核糖区别于 DNA 脱氧核糖的重要结构。`
          : `再观察：当前选中的是${label}，练习目标是 2'-OH 羟基。`;
    } else {
      state.rnaSelected = `已选中：${label}`;
    }
    setFeedback(state.rnaSelected);
  };

  shell.addEventListener("pointerdown", onPointerDown);
  shell.addEventListener("pointermove", onPointerMove);
  shell.addEventListener("pointerup", finishPointer);
  shell.addEventListener("pointercancel", finishPointer);
  shell.addEventListener("lostpointercapture", finishPointer);
  shell.addEventListener("contextmenu", (event) => event.preventDefault());
  shell.addEventListener("wheel", onWheel, { passive: false });
  shell.addEventListener("click", onClick);
  window.addEventListener("blur", cancelPointers);
  window.addEventListener("pagehide", cancelPointers);
  document.addEventListener("visibilitychange", onGestureVisibilityChange);

  const interactionRoot = shell.closest("[data-rna-webgl-root]") || shell;
  const stateControl = interactionRoot.querySelector("[data-rna-webgl-state-control]");
  const referencePanel = interactionRoot.querySelector("[data-rna-reference-panel]");
  const foldInput = root.querySelector("[data-rna-webgl-fold]");
  const foldValue = root.querySelector("[data-rna-webgl-fold-value]");
  const stopPanelInteraction = (event) => event.stopPropagation();
  stateControl?.addEventListener("pointerdown", (event) => event.stopPropagation());
  stateControl?.addEventListener("click", (event) => event.stopPropagation());
  referencePanel?.addEventListener("pointerdown", stopPanelInteraction);
  referencePanel?.addEventListener("click", stopPanelInteraction);
  referencePanel?.addEventListener("wheel", stopPanelInteraction);
  let foldFrame = 0;
  const updateFoldAtNextFrame = () => {
    if (foldFrame) return;
    foldFrame = requestAnimationFrame(() => {
      foldFrame = 0;
      liveMolecule.update(state.rnaFold || 0);
    });
  };
  const onFoldInput = (event) => {
    state.rnaFold = Number(event.target.value) / 100;
    state.playing = false;
    if (foldValue) foldValue.textContent = `${Math.round(state.rnaFold * 100)}%`;
    setFeedback(
      state.rnaFold > 0.55
        ? "RNA 单链正在折叠：同一条链内部可以形成 A-U、C-G 配对和局部氢键。"
        : "",
    );
    labelsLayer.classList.add("is-folding");
    updateFoldAtNextFrame();
  };
  const onFoldChange = () => {
    if (foldFrame) {
      cancelAnimationFrame(foldFrame);
      foldFrame = 0;
    }
    liveMolecule.update(state.rnaFold || 0);
    refreshLabels();
    updateControls();
  };
  foldInput?.addEventListener("input", onFoldInput);
  foldInput?.addEventListener("change", onFoldChange);

  structureRuntime={resize,sync:()=>{
    applyRnaWebglViewPreset(THREE, rnaRoot, panRoot, camera);
    Object.assign(lockedRotation,state.rnaWebglRotation);
    clearLabels();pickables.length=0;
    while(molecule.children.length){const child=molecule.children.pop();disposeDnaWebglObject(child);}
    liveMolecule=createRnaWebglLiveMolecule(THREE,molecule,pickables);liveMolecule.update(state.rnaFold||0);refreshLabels();
    if(foldInput)foldInput.value=String(Math.round(state.rnaFold*100));
    if(foldValue)foldValue.textContent=Math.round(state.rnaFold*100)+'%';
    resize();setFeedback(state.rnaSelected||'');
  }};
  return () => {
    structureRuntime=null;
    resizeObserver.disconnect();
    if (dnaWebglAnimationFrame) {
      cancelAnimationFrame(dnaWebglAnimationFrame);
      dnaWebglAnimationFrame = 0;
    }
    if (foldFrame) cancelAnimationFrame(foldFrame);
    cancelPointers();
    window.removeEventListener("blur", cancelPointers);
    window.removeEventListener("pagehide", cancelPointers);
    document.removeEventListener("visibilitychange", onGestureVisibilityChange);
    shell.removeEventListener("pointerdown", onPointerDown);
    shell.removeEventListener("pointermove", onPointerMove);
    shell.removeEventListener("pointerup", finishPointer);
    shell.removeEventListener("pointercancel", finishPointer);
    shell.removeEventListener("lostpointercapture", finishPointer);
    shell.removeEventListener("wheel", onWheel);
    shell.removeEventListener("click", onClick);
    referencePanel?.removeEventListener("pointerdown", stopPanelInteraction);
    referencePanel?.removeEventListener("click", stopPanelInteraction);
    referencePanel?.removeEventListener("wheel", stopPanelInteraction);
    foldInput?.removeEventListener("input", onFoldInput);
    foldInput?.removeEventListener("change", onFoldChange);
    clearLabels();
    disposeDnaWebglObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function dnaWebglQuaternionFromCamera(THREE, theta, phi) {
  const pitch = phi - Math.PI / 2;
  const matrix = new THREE.Matrix4().makeRotationY(-theta);
  matrix.premultiply(new THREE.Matrix4().makeRotationX(pitch));
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function applyRnaWebglViewPreset(THREE, rnaRoot, panRoot, camera) {
  if (state.rnaWebglViewIndex !== state.viewIndex) {
    const preset = rnaWebglViewPreset(THREE, state.viewIndex);
    state.rnaWebglRotation = { ...preset.rotation };
    state.rnaWebglQuaternion = {
      x: preset.quaternion.x,
      y: preset.quaternion.y,
      z: preset.quaternion.z,
      w: preset.quaternion.w,
    };
    state.rnaWebglZoom = preset.zoom;
    state.rnaWebglPan = { x: 0, y: 0 };
    state.rnaWebglViewIndex = state.viewIndex;
  }

  if (!state.rnaWebglRotation) {
    const restored = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(
        state.rnaWebglQuaternion.x,
        state.rnaWebglQuaternion.y,
        state.rnaWebglQuaternion.z,
        state.rnaWebglQuaternion.w,
      ),
      "XYZ",
    );
    state.rnaWebglRotation = { x: restored.x, y: restored.y };
  }
  rnaRoot.rotation.set(state.rnaWebglRotation.x, state.rnaWebglRotation.y, 0, "XYZ");
  panRoot.position.set(state.rnaWebglPan.x, state.rnaWebglPan.y, 0);
  camera.zoom = state.rnaWebglZoom;
}

function rnaWebglViewPreset(THREE, index) {
  const presets = [
    { theta: 0.62, phi: 1.26, zoom: 1 },
    { theta: 1.32, phi: 1.18, zoom: 1.22 },
    { theta: -0.04, phi: 1.53, zoom: 1.06 },
    { theta: 1.1, phi: 0, zoom: 1.22 },
    { theta: 1.1, phi: Math.PI, zoom: 1.22 },
  ];
  const selected = presets[index] || presets[0];
  const quaternion = dnaWebglQuaternionFromCamera(THREE, selected.theta, selected.phi);
  return {
    quaternion,
    rotation: { x: selected.phi - Math.PI / 2, y: -selected.theta },
    zoom: selected.zoom,
  };
}

function createRnaWebglLiveMolecule(THREE, parent, pickables) {
  const materials = rnaWebglMaterials(THREE);
  const localItem = rnaWebglLocalNucleotideFrame(THREE);
  const nucleotideGroups = [];
  const phosphateMeshes = [];
  const backboneBonds = [];
  const hbondLines = [];
  const api = { nucleotides: [], baseAnchors: [], update: null };

  for (let i = 0; i < RNA_MODEL.count; i += 1) {
    const base = RNA_MODEL.sequence[i % RNA_MODEL.sequence.length];
    const group = new THREE.Group();
    const sugarFocus = rnaWebglPartFocused("sugar", i) || rnaWebglPartFocused("hydroxyl", i);
    const sugar = createRnaWebglSugar(THREE, materials, localItem, sugarFocus);
    group.add(sugar);
    rnaWebglRegisterPickable(sugar, pickables, "sugar");

    const hydroxylFocus = rnaWebglPartFocused("hydroxyl", i);
    const hydroxyl = createRnaWebglHydroxyl(THREE, materials, localItem, hydroxylFocus);
    group.add(hydroxyl);
    rnaWebglRegisterPickable(hydroxyl, pickables, "hydroxyl", RNA_PART_LABELS.hydroxyl);

    const baseDistance = base === "A" || base === "G" ? 2.08 : 2.18;
    const baseCenter = localItem.atoms.C1.clone().add(localItem.inward.clone().multiplyScalar(baseDistance));
    const baseFocus = rnaWebglPartFocused("base", i);
    const baseGroup = createRnaWebglBase(THREE, materials, base, baseCenter, localItem.inward, localItem.tangent, baseFocus);
    group.add(baseGroup);
    rnaWebglRegisterPickable(baseGroup, pickables, "base", `${base} 碱基 / Base`);
    group.add(
      rnaWebglPart(
        dnaWebglBond(THREE, localItem.atoms.C1, baseCenter, 0.08, materials.material(RNA_MODEL.colors[base], baseFocus)),
        "base",
        `${base} 碱基 / Base`,
        pickables,
      ),
    );
    parent.add(group);
    nucleotideGroups.push(group);

    const phosphateFocus = rnaWebglPartFocused("phosphate", i) || rnaWebglPartFocused("phosphodiester", i);
    const phosphateMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 28, 18),
      materials.material(RNA_MODEL.colors.phosphate, phosphateFocus),
    );
    phosphateMesh.userData = { rnaPart: "phosphate", rnaLabel: RNA_PART_LABELS.phosphate };
    parent.add(phosphateMesh);
    pickables.push(phosphateMesh);
    phosphateMeshes.push(phosphateMesh);

    const bondFocus = i === 0 ? phosphateFocus : rnaWebglPartFocused("phosphodiester", i);
    const bondMaterial = materials.material(i === 0 ? RNA_MODEL.colors.backbone : RNA_MODEL.colors.phosphodiester, bondFocus);
    const bonds = [rnaWebglCreateLiveBond(THREE, i === 0 ? 0.1 : 0.085, bondMaterial)];
    if (i > 0) bonds.push(rnaWebglCreateLiveBond(THREE, 0.085, bondMaterial));
    bonds.forEach((bond) => {
      const part = i === 0 ? "backbone" : "phosphodiester";
      bond.userData = { rnaPart: part, rnaLabel: RNA_PART_LABELS[part] };
      parent.add(bond);
      pickables.push(bond);
    });
    backboneBonds.push(bonds);
  }

  RNA_INTERNAL_PAIRS.forEach(([a, b]) => {
    const base = RNA_MODEL.sequence[a % RNA_MODEL.sequence.length];
    const pairedBase = RNA_MODEL.sequence[b % RNA_MODEL.sequence.length];
    if (!rnaBasesCanPair(base, pairedBase)) return;
    const bondCount = RNA_MODEL.hbonds[base] || 2;
    for (let k = 0; k < bondCount; k += 1) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
      const material = new THREE.LineDashedMaterial({
        color: new THREE.Color(RNA_MODEL.colors.internalHbond),
        dashSize: 0.32,
        gapSize: 0.2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      line.userData = { rnaPart: "internalHbond", rnaLabel: RNA_PART_LABELS.internalHbond };
      parent.add(line);
      hbondLines.push({ line, a, b, k, bondCount });
    }
  });

  const basis = new THREE.Matrix4();
  api.update = (rawFold) => {
    const fold = smoothOpen(rawFold || 0);
    api.nucleotides.length = 0;
    api.baseAnchors.length = 0;

    for (let i = 0; i < RNA_MODEL.count; i += 1) {
      const base = RNA_MODEL.sequence[i % RNA_MODEL.sequence.length];
      const item = rnaWebglNucleotideFrame(THREE, i, fold);
      api.nucleotides[i] = item;
      const group = nucleotideGroups[i];
      group.position.copy(item.origin);
      basis.makeBasis(item.frame.x, item.frame.y, item.frame.z);
      group.quaternion.setFromRotationMatrix(basis);

      const baseCenter = item.atoms.C1.clone().add(item.inward.clone().multiplyScalar(base === "A" || base === "G" ? 2.08 : 2.18));
      const hbondPoint = item.atoms.C1.clone().add(item.inward.clone().multiplyScalar(base === "A" || base === "G" ? 4.75 : 4.08));
      api.baseAnchors[i] = { base, center: baseCenter, hbondPoint, side: item.side };
    }

    api.nucleotides.forEach((item, i) => {
      const phosphate =
        i === 0
          ? item.atoms.C5.clone().add(item.outward.clone().multiplyScalar(RNA_THREE_PHOSPHATE_OFFSET))
          : api.nucleotides[i - 1].atoms.C3
              .clone()
              .lerp(item.atoms.C5, 0.52)
              .add(item.outward.clone().add(api.nucleotides[i - 1].outward).normalize().multiplyScalar(1.18));
      item.phosphate = phosphate;
      phosphateMeshes[i].position.copy(phosphate);

      if (i === 0) {
        rnaWebglUpdateLiveBond(THREE, backboneBonds[i][0], item.atoms.C5, phosphate);
      } else {
        rnaWebglUpdateLiveBond(THREE, backboneBonds[i][0], api.nucleotides[i - 1].atoms.C3, phosphate);
        rnaWebglUpdateLiveBond(THREE, backboneBonds[i][1], phosphate, item.atoms.C5);
      }
    });

    const hbondOpacity = state.stageIndex === 4 ? Math.max(0.42, fold * 0.82) : fold * 0.62;
    hbondLines.forEach(({ line, a, b, k, bondCount }) => {
      const left = api.baseAnchors[a];
      const right = api.baseAnchors[b];
      if (!left || !right) {
        line.visible = false;
        return;
      }
      const direction = right.hbondPoint.clone().sub(left.hbondPoint);
      if (direction.lengthSq() < 0.0001) {
        line.visible = false;
        return;
      }
      direction.normalize();
      let side = left.side.clone().add(right.side);
      if (side.lengthSq() < 0.0001) side.copy(left.side);
      side.normalize();
      const offset = (k - (bondCount - 1) / 2) * 0.46;
      const start = left.hbondPoint.clone().add(side.clone().multiplyScalar(offset));
      const end = right.hbondPoint.clone().add(side.clone().multiplyScalar(offset)).add(direction.clone().multiplyScalar(-0.6));
      const positions = line.geometry.getAttribute("position");
      positions.setXYZ(0, start.x, start.y, start.z);
      positions.setXYZ(1, end.x, end.y, end.z);
      positions.needsUpdate = true;
      line.computeLineDistances();
      line.material.opacity = hbondOpacity;
      line.visible = hbondOpacity > 0.08;
    });
  };

  return api;
}

function rnaWebglLocalNucleotideFrame(THREE) {
  const origin = new THREE.Vector3(0, 0, 0);
  const inward = new THREE.Vector3(1, 0, 0);
  const outward = new THREE.Vector3(-1, 0, 0);
  const tangent = new THREE.Vector3(0, -1, 0);
  const side = new THREE.Vector3(0, 0, -1);
  const sugarSide = new THREE.Vector3(0, 0, 1);
  const frame = { origin, x: inward, y: new THREE.Vector3(0, 1, 0), z: sugarSide };
  const atom = (key) => rnaFramePoint(THREE, frame, RNA_THREE_SUGAR_ATOMS[key]);
  const atoms = {
    C1: atom("C1"), C2: atom("C2"), C3: atom("C3"), C4: atom("C4"),
    O4: atom("O4"), C5: atom("C5"), O2: atom("O2"), H2: atom("H2"),
  };
  return {
    origin, frame, inward, outward, tangent, side, sugarSide, atoms,
    ringPoints: [atoms.O4, atoms.C1, atoms.C2, atoms.C3, atoms.C4],
  };
}

function rnaWebglCreateLiveBond(THREE, radius, material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 12), material);
}

function rnaWebglUpdateLiveBond(THREE, mesh, start, end) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.visible = length > 0.0001;
  if (!mesh.visible) return;
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.multiplyScalar(1 / length));
  mesh.scale.set(1, length, 1);
}

function buildRnaWebglMolecule(THREE, parent, pickables, addLabel) {
  const fold = smoothOpen(state.rnaFold || 0);
  const materials = rnaWebglMaterials(THREE);
  const nucleotides = [];
  const baseAnchors = [];

  for (let i = 0; i < RNA_MODEL.count; i += 1) {
    const base = RNA_MODEL.sequence[i % RNA_MODEL.sequence.length];
    const item = rnaWebglNucleotideFrame(THREE, i, fold);
    nucleotides[i] = item;

    const sugarFocus = rnaWebglPartFocused("sugar", i) || rnaWebglPartFocused("hydroxyl", i);
    const sugar = createRnaWebglSugar(THREE, materials, item, sugarFocus);
    parent.add(sugar);
    rnaWebglRegisterPickable(sugar, pickables, "sugar");

    const hydroxylFocus = rnaWebglPartFocused("hydroxyl", i);
    const hydroxyl = createRnaWebglHydroxyl(THREE, materials, item, hydroxylFocus);
    parent.add(hydroxyl);
    rnaWebglRegisterPickable(hydroxyl, pickables, "hydroxyl", RNA_PART_LABELS.hydroxyl);

    const baseCenter = item.atoms.C1.clone().add(item.inward.clone().multiplyScalar(base === "A" || base === "G" ? 2.08 : 2.18));
    const hbondPoint = item.atoms.C1.clone().add(item.inward.clone().multiplyScalar(base === "A" || base === "G" ? 4.75 : 4.08));
    baseAnchors[i] = { base, center: baseCenter, hbondPoint, side: item.side };

    const baseFocus = rnaWebglPartFocused("base", i);
    const baseGroup = createRnaWebglBase(THREE, materials, base, baseCenter, item.inward, item.tangent, baseFocus);
    parent.add(baseGroup);
    rnaWebglRegisterPickable(baseGroup, pickables, "base", `${base} 碱基 / Base`);
    parent.add(
      rnaWebglPart(
        dnaWebglBond(THREE, item.atoms.C1, baseCenter, 0.08, materials.material(RNA_MODEL.colors[base], baseFocus)),
        "base",
        `${base} 碱基 / Base`,
        pickables,
      ),
    );
  }

  nucleotides.forEach((item, i) => {
    const focus = rnaWebglPartFocused("phosphate", i) || rnaWebglPartFocused("phosphodiester", i);
    const phosphate =
      i === 0
        ? item.atoms.C5.clone().add(item.outward.clone().multiplyScalar(RNA_THREE_PHOSPHATE_OFFSET))
        : nucleotides[i - 1].atoms.C3
            .clone()
            .lerp(item.atoms.C5, 0.52)
            .add(item.outward.clone().add(nucleotides[i - 1].outward).normalize().multiplyScalar(1.18));
    item.phosphate = phosphate;

    const phosphateMesh = new THREE.Mesh(new THREE.SphereGeometry(0.98, 36, 22), materials.material(RNA_MODEL.colors.phosphate, focus));
    phosphateMesh.position.copy(phosphate);
    phosphateMesh.userData = { rnaPart: "phosphate", rnaLabel: RNA_PART_LABELS.phosphate };
    parent.add(phosphateMesh);
    pickables.push(phosphateMesh);

    if (i === 0) {
      parent.add(
        rnaWebglPart(
          dnaWebglBond(THREE, item.atoms.C5, phosphate, 0.1, materials.material(RNA_MODEL.colors.backbone, focus)),
          "backbone",
          RNA_PART_LABELS.backbone,
          pickables,
        ),
      );
    } else {
      const previous = nucleotides[i - 1];
      const bondFocus = rnaWebglPartFocused("phosphodiester", i);
      const bondMaterial = materials.material(RNA_MODEL.colors.phosphodiester, bondFocus);
      parent.add(rnaWebglPart(dnaWebglBond(THREE, previous.atoms.C3, phosphate, 0.085, bondMaterial), "phosphodiester", RNA_PART_LABELS.phosphodiester, pickables));
      parent.add(rnaWebglPart(dnaWebglBond(THREE, phosphate, item.atoms.C5, 0.085, bondMaterial), "phosphodiester", RNA_PART_LABELS.phosphodiester, pickables));
    }
  });

  const hbondOpacity = state.stageIndex === 4 ? Math.max(0.42, fold * 0.82) : fold * 0.62;
  if (hbondOpacity > 0.08) {
    RNA_INTERNAL_PAIRS.forEach(([a, b]) => {
      const left = baseAnchors[a];
      const right = baseAnchors[b];
      if (!left || !right) return;
      if (!rnaBasesCanPair(left.base, right.base)) return;
      const direction = right.hbondPoint.clone().sub(left.hbondPoint).normalize();
      const side = left.side.clone().add(right.side).normalize();
      const bonds = RNA_MODEL.hbonds[left.base] || 2;
      for (let k = 0; k < bonds; k += 1) {
        const offset = (k - (bonds - 1) / 2) * 0.46;
        const start = left.hbondPoint.clone().add(side.clone().multiplyScalar(offset));
        const end = right.hbondPoint.clone().add(side.clone().multiplyScalar(offset)).add(direction.clone().multiplyScalar(-0.6));
        parent.add(
          rnaWebglPart(
            dnaWebglDashedBond(THREE, start, end, 0.026, materials.hbond(hbondOpacity)),
            "internalHbond",
            RNA_PART_LABELS.internalHbond,
            pickables,
          ),
        );
      }
    });
  }

  addRnaWebglTeachingLabels(THREE, addLabel, nucleotides, baseAnchors);
}

function rnaBasesCanPair(leftBase, rightBase) {
  return RNA_MODEL.complement[leftBase] === rightBase;
}

function rnaWebglMaterials(THREE) {
  const color = (hex, mix = 0) => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), mix);
  const dim = (focus) => (state.highlight || state.teacher) && !focus;
  const material = (hex, focus = false, extra = {}) => {
    const opacity = extra.opacity ?? (dim(focus) ? 0.18 : 1);
    return new THREE.MeshPhysicalMaterial({
      color: color(hex, extra.mix ?? 0),
      roughness: extra.flat ? 0.42 : 0.32,
      metalness: 0,
      clearcoat: extra.flat ? 0.32 : 0.58,
      clearcoatRoughness: 0.28,
      side: THREE.DoubleSide,
      transparent: opacity < 0.98,
      opacity,
      depthWrite: opacity > 0.72,
      emissive: focus ? new THREE.Color(0xf59e0b) : new THREE.Color(0x000000),
      emissiveIntensity: focus ? 0.15 : 0,
    });
  };

  return {
    material,
    base: (base, focus = false) => material(RNA_MODEL.colors[base], focus, { flat: true }),
    baseEdge: material("#475569"),
    hbond: (opacity) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(RNA_MODEL.colors.internalHbond),
        roughness: 0.38,
        transparent: true,
        opacity,
        depthWrite: false,
      }),
  };
}

function rnaWebglNucleotideFrame(THREE, index, fold) {
  const origin = rnaWebglPoint(THREE, index, fold);
  const previous = rnaWebglPoint(THREE, Math.max(0, index - 0.48), fold);
  const next = rnaWebglPoint(THREE, Math.min(RNA_MODEL.count - 1, index + 0.48), fold);
  let tangent = next.clone().sub(previous).normalize();
  if (tangent.lengthSq() < 0.0001) tangent = new THREE.Vector3(0, 1, 0);

  let inward = rnaWebglInward(THREE, index, fold, origin);
  inward.sub(tangent.clone().multiplyScalar(inward.dot(tangent)));
  if (inward.lengthSq() < 0.0001) inward = new THREE.Vector3(1, 0, 0);
  inward.normalize();

  let side = inward.clone().cross(tangent).normalize();
  if (side.lengthSq() < 0.0001) side = new THREE.Vector3(0, 0, 1);
  tangent = side.clone().cross(inward).normalize();
  const outward = inward.clone().multiplyScalar(-1);
  const sugarTangent = tangent.clone().multiplyScalar(-1);
  const sugarSide = inward.clone().cross(sugarTangent).normalize();
  const frame = { origin, x: inward, y: sugarTangent, z: sugarSide };

  const atom = (key) => rnaFramePoint(THREE, frame, RNA_THREE_SUGAR_ATOMS[key]);
  const atoms = {
    C1: atom("C1"),
    C2: atom("C2"),
    C3: atom("C3"),
    C4: atom("C4"),
    O4: atom("O4"),
    C5: atom("C5"),
    O2: atom("O2"),
    H2: atom("H2"),
  };

  return {
    origin,
    frame,
    inward,
    outward,
    tangent,
    side,
    sugarSide,
    atoms,
    ringPoints: [atoms.O4, atoms.C1, atoms.C2, atoms.C3, atoms.C4],
  };
}

function rnaWebglPoint(THREE, t, fold) {
  const angle = t * RNA_MODEL.twist;
  const helical = new THREE.Vector3(
    RNA_MODEL.radius * Math.cos(angle),
    -(t * RNA_MODEL.rise + RNA_MODEL.y0),
    RNA_MODEL.radius * Math.sin(angle),
  );
  const folded = rnaHairpinPoint(THREE, t);
  return helical.lerp(folded, fold);
}

function rnaHairpinPoint(THREE, t) {
  const n = clamp(t / (RNA_MODEL.count - 1), 0, 1);
  const ease = (value) => value * value * (3 - value * 2);
  if (n < 0.16) {
    const k = ease(n / 0.16);
    const terminalFlare = Math.pow(1 - k, 2.4);
    return new THREE.Vector3(
      -9.6 - (1 - k) * 3.5 - terminalFlare * 1.8,
      22.8 + (1 - k) * 11.2 + terminalFlare * 0.8,
      Math.sin(t * 0.72) * 0.72,
    );
  }
  if (n < 0.4) {
    const k = (n - 0.16) / 0.24;
    return new THREE.Vector3(-9.6, 22.8 - k * 31.8, Math.sin(t * 0.72) * 0.72);
  }
  if (n < 0.6) {
    const k = (n - 0.4) / 0.2;
    const angle = Math.PI - k * Math.PI;
    return new THREE.Vector3(Math.cos(angle) * 9.6, -9 - Math.sin(angle) * 10.6, Math.sin(angle * 2) * 0.9);
  }
  if (n < 0.84) {
    const k = (n - 0.6) / 0.24;
    return new THREE.Vector3(9.6, -9 + k * 31.8, Math.cos(t * 0.72) * 0.72);
  }
  const k = (n - 0.84) / 0.16;
  const terminalFlare = Math.pow(k, 2.4);
  return new THREE.Vector3(
    9.6 + k * 1.6 + terminalFlare * 1.8,
    22.8 + k * 12.6 + terminalFlare * 0.8,
    Math.cos(t * 0.72) * 0.72,
  );
}

function rnaWebglInward(THREE, index, fold, point) {
  const angle = index * RNA_MODEL.twist;
  const helical = new THREE.Vector3(-Math.cos(angle), 0, -Math.sin(angle));
  const n = clamp(index / (RNA_MODEL.count - 1), 0, 1);
  let folded;
  if (n < 0.4) folded = new THREE.Vector3(1, 0, 0);
  else if (n < 0.6) folded = new THREE.Vector3(0, -9, 0).sub(point).normalize();
  else if (n < 0.84) folded = new THREE.Vector3(-1, 0, 0);
  else folded = new THREE.Vector3(-1, 0, 0);
  return helical.lerp(folded, fold).normalize();
}

function rnaFramePoint(THREE, frame, point) {
  return frame.origin
    .clone()
    .add(frame.x.clone().multiplyScalar(point.x))
    .add(frame.y.clone().multiplyScalar(point.y))
    .add(frame.z.clone().multiplyScalar(point.z || 0));
}

function createRnaWebglSugar(THREE, materials, item, focus) {
  const group = new THREE.Group();
  const sugar = new THREE.Mesh(
    dnaWebglPolygonGeometry(THREE, {
      points: item.ringPoints,
      p: item.origin,
      normal: item.sugarSide,
      thickness: 0.38,
    }),
    materials.material(RNA_MODEL.colors.sugar, focus, { flat: true }),
  );
  sugar.userData = { rnaPart: "sugar", rnaLabel: RNA_PART_LABELS.sugar };
  group.add(sugar);

  ["O4", "C1", "C2", "C3", "C4"].forEach((key, index, atoms) => {
    const next = atoms[(index + 1) % atoms.length];
    const color = key === "O4" || next === "O4" ? RNA_MODEL.colors.sugarOxygen : RNA_MODEL.colors.sugarCarbon;
    group.add(dnaWebglBond(THREE, item.atoms[key], item.atoms[next], 0.052, materials.material(color, focus)));
  });
  group.add(dnaWebglBond(THREE, item.atoms.C4, item.atoms.C5, 0.052, materials.material(RNA_MODEL.colors.sugarCarbon, focus)));

  ["C1", "C2", "C3", "C4", "C5", "O4"].forEach((key) => {
    const isOxygen = key === "O4";
    const atom = new THREE.Mesh(
      new THREE.SphereGeometry(key === "C5" ? 0.28 : 0.24, 20, 14),
      materials.material(isOxygen ? RNA_MODEL.colors.sugarOxygen : RNA_MODEL.colors.sugarCarbon, focus),
    );
    atom.position.copy(item.atoms[key]);
    atom.userData = { rnaPart: "sugar", rnaLabel: `${key}' / Ribose atom` };
    group.add(atom);
  });

  return group;
}

function createRnaWebglHydroxyl(THREE, materials, item, focus) {
  const group = new THREE.Group();
  const oxygen = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 14), materials.material(RNA_MODEL.colors.hydroxyl, focus));
  oxygen.position.copy(item.atoms.O2);
  oxygen.userData = { rnaPart: "hydroxyl", rnaLabel: RNA_PART_LABELS.hydroxyl };
  group.add(oxygen);

  const hydrogen = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 12), materials.material(RNA_MODEL.colors.hydroxylHydrogen, focus, { mix: 0 }));
  hydrogen.position.copy(item.atoms.H2);
  hydrogen.userData = { rnaPart: "hydroxyl", rnaLabel: RNA_PART_LABELS.hydroxyl };
  group.add(hydrogen);
  group.add(dnaWebglBond(THREE, item.atoms.C2, item.atoms.O2, 0.052, materials.material(RNA_MODEL.colors.hydroxyl, focus)));
  group.add(dnaWebglBond(THREE, item.atoms.O2, item.atoms.H2, 0.04, materials.material(RNA_MODEL.colors.hydroxyl, focus)));
  return group;
}

function createRnaWebglBase(THREE, materials, base, position, xAxis, yAxis, focus) {
  const group = new THREE.Group();
  const x = xAxis.clone().normalize();
  let y = yAxis.clone().sub(x.clone().multiplyScalar(yAxis.dot(x)));
  if (y.lengthSq() < 0.0001) y = new THREE.Vector3(0, 1, 0);
  y.normalize();
  const z = x.clone().cross(y).normalize();
  const matrix = new THREE.Matrix4().makeBasis(x, y, z);
  group.quaternion.setFromRotationMatrix(matrix);
  group.position.copy(position);
  group.userData = { rnaPart: "base", rnaLabel: `${base} 碱基 / Base` };

  if (base === "A" || base === "G") {
    group.add(rnaWebglRingPlate(THREE, materials, base, 6, -0.42, 0.68, 0.56, focus));
    group.add(rnaWebglRingPlate(THREE, materials, base, 5, 0.58, 0.55, 0.5, focus, Math.PI / 5));
  } else {
    group.add(rnaWebglRingPlate(THREE, materials, base, 6, 0, 0.72, 0.58, focus));
  }

  const letter = createDnaWebglTextSprite(THREE, base, RNA_MODEL.colors[base]);
  letter.position.set(0, 0.42, 0);
  letter.scale.set(1.8, 1.12, 1);
  group.add(letter);
  return group;
}

function rnaWebglRingPlate(THREE, materials, base, sides, cx, rx, ry, focus, start = Math.PI / 6) {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = start + (index / sides) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * rx, y: Math.sin(angle) * ry, z: 0 };
  });
  const group = new THREE.Group();
  const plate = new THREE.Mesh(dnaWebglPlateGeometry(THREE, points, 0.26, true), materials.base(base, focus));
  plate.userData = { rnaPart: "base", rnaLabel: `${base} 碱基 / Base` };
  group.add(plate);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), materials.baseEdge);
    node.position.copy(dnaWebglBasePlatePoint(THREE, point));
    group.add(node);
    group.add(dnaWebglBond(THREE, dnaWebglBasePlatePoint(THREE, point), dnaWebglBasePlatePoint(THREE, next), 0.046, materials.baseEdge));
  });
  return group;
}

function rnaWebglPart(object, part, label, pickables) {
  object.traverse?.((child) => {
    if (!child.isMesh && !child.isSprite) return;
    child.userData = { ...child.userData, rnaPart: part, rnaLabel: label };
    pickables.push(child);
  });
  return object;
}

function rnaWebglRegisterPickable(object, pickables, part, label = RNA_PART_LABELS[part]) {
  object.traverse((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData = { ...child.userData, rnaPart: child.userData.rnaPart || part, rnaLabel: child.userData.rnaLabel || label };
      pickables.push(child);
    }
  });
}

function rnaWebglPartFocused(part, index) {
  const focus = rnaFocusTags();
  if (state.practice && part === "hydroxyl") return true;
  if (part === "base" && focus.includes("sequence")) return true;
  if (part === "phosphodiester" && index >= 8 && index <= 11) return true;
  return focus.includes(part);
}

function rnaFocusTags() {
  if (state.stageIndex === 1) return ["sugar", "hydroxyl"];
  if (state.stageIndex === 2) return ["base", "sequence"];
  if (state.stageIndex === 3) return ["backbone", "phosphate", "phosphodiester"];
  if (state.stageIndex === 4) return ["base", "internalHbond"];
  return ["base", "sugar", "phosphate", "backbone"];
}

function addRnaWebglTeachingLabels(THREE, addLabel, nucleotides, baseAnchors) {
  const mid = Math.floor(RNA_MODEL.count / 2);
  const first = nucleotides[0];
  const last = nucleotides[RNA_MODEL.count - 1];
  if (!first || !last) return;

  if (state.stageIndex === 0) {
    addLabel("RNA 单链 Single strand", nucleotides[mid].origin, "#0f766e", { x: 88, y: -34 });
    addLabel("可局部折叠 Foldable", nucleotides[Math.min(mid + 4, RNA_MODEL.count - 1)].origin, "#0f766e", { x: -104, y: 28 });
  }
  if (state.stageIndex === 1 || state.practice) {
    addLabel("核糖 Ribose", nucleotides[mid].origin, RNA_MODEL.colors.sugar, { x: -112, y: 24 });
    addLabel("2'-OH 羟基", nucleotides[mid].atoms.O2, RNA_MODEL.colors.hydroxyl, { x: 92, y: -36 });
  }
  if (state.stageIndex === 2) {
    addLabel("A/U/C/G 四种碱基", baseAnchors[mid].center, "#0f172a", { x: 98, y: -36 });
    const uIndex = RNA_MODEL.sequence.findIndex((base) => base === "U");
    addLabel("U 代替 DNA 中的 T", baseAnchors[uIndex].center, RNA_MODEL.colors.U, { x: -116, y: 28 });
  }
  if (state.stageIndex === 3) {
    addLabel("磷酸-核糖骨架 Backbone", nucleotides[mid].phosphate || nucleotides[mid].origin, RNA_MODEL.colors.backbone, { x: 104, y: -32 });
    addLabel("3',5'-磷酸二酯键", nucleotides[mid + 1].phosphate || nucleotides[mid + 1].origin, RNA_MODEL.colors.phosphodiester, { x: -120, y: 30 });
  }
  if (state.stageIndex === 4) {
    const pair = RNA_INTERNAL_PAIRS[1];
    const center = baseAnchors[pair[0]].hbondPoint.clone().lerp(baseAnchors[pair[1]].hbondPoint, 0.5);
    addLabel("内部碱基配对", center, RNA_MODEL.colors.internalHbond, { x: 112, y: -30 });
    addLabel("A-U / C-G", baseAnchors[pair[0]].center, "#0f172a", { x: -86, y: 32 });
  }
  addLabel("5'端", first.phosphate || first.atoms.C5, "#0f172a", { x: -50, y: 24 });
  addLabel("3'端", last.atoms.C3, "#0f172a", { x: 52, y: -28 });
}

function dnaWebglPolygonGeometry(THREE, object) {
  const points = object.points.map((point) => new THREE.Vector3(point.x, point.y, point.z || 0));
  const origin = object.p ? new THREE.Vector3(object.p.x, object.p.y, object.p.z || 0) : dnaWebglAverageVector(THREE, points);
  let normal = object.normal ? new THREE.Vector3(object.normal.x, object.normal.y, object.normal.z || 0) : new THREE.Vector3();
  if (normal.lengthSq() < 0.0001 && points.length >= 3) {
    normal = points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0]));
  }
  normal.normalize();
  if (normal.lengthSq() < 0.0001) normal.set(0, 0, 1);

  let xAxis = points[1]?.clone().sub(points[0]) || new THREE.Vector3(1, 0, 0);
  xAxis.sub(normal.clone().multiplyScalar(xAxis.dot(normal)));
  if (xAxis.lengthSq() < 0.0001) xAxis = Math.abs(normal.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  xAxis.normalize();
  const yAxis = normal.clone().cross(xAxis).normalize();

  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    const relative = point.clone().sub(origin);
    const x = relative.dot(xAxis);
    const y = relative.dot(yAxis);
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();

  const depth = object.thickness || 0.45;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.045,
    bevelSegments: 2,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.applyMatrix4(new THREE.Matrix4().makeBasis(xAxis, yAxis, normal));
  geometry.translate(origin.x, origin.y, origin.z);
  return geometry;
}

function dnaWebglDashedBond(THREE, start, end, radius, material) {
  const group = new THREE.Group();
  const vector = end.clone().sub(start);
  const length = vector.length();
  if (length < 0.001) return group;

  const direction = vector.clone().normalize();
  const dashCount = Math.max(2, Math.floor(length / 0.82));
  for (let i = 0; i < dashCount; i += 1) {
    const t0 = i / dashCount;
    const t1 = Math.min(t0 + 0.48 / dashCount, 1);
    const a = start.clone().add(direction.clone().multiplyScalar(length * t0));
    const b = start.clone().add(direction.clone().multiplyScalar(length * t1));
    group.add(dnaWebglBond(THREE, a, b, radius, material));
  }
  return group;
}

function dnaWebglAverageVector(THREE, points) {
  const sum = new THREE.Vector3();
  points.forEach((point) => sum.add(point));
  return sum.multiplyScalar(1 / Math.max(points.length, 1));
}

function dnaWebglPlateGeometry(THREE, points, depth, rotateToBasePlane) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => shape.lineTo(point.x, point.y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: rotateToBasePlane ? 0.045 : 0.05,
    bevelThickness: rotateToBasePlane ? 0.05 : 0.055,
    bevelSegments: 3,
  });
  geometry.translate(0, 0, -depth / 2);
  if (rotateToBasePlane) geometry.rotateX(Math.PI / 2);
  return geometry;
}

function dnaWebglBasePlatePoint(THREE, point) {
  return new THREE.Vector3(point.x, 0, point.y);
}

function dnaWebglBond(THREE, start, end, radius, material) {
  const from = start.clone();
  const to = end.clone();
  const direction = to.clone().sub(from);
  const length = direction.length() || 0.001;
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 12);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function createDnaWebglTextSprite(THREE, text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "900 58px Microsoft YaHei, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.strokeText(text, 64, 50);
  ctx.fillStyle = color;
  ctx.fillText(text, 64, 50);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 30;
  sprite.userData.texture = texture;
  return sprite;
}

function disposeDnaWebglObject(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      material.map?.dispose?.();
      material.dispose?.();
    });
    child.userData?.texture?.dispose?.();
  });
}

const ANDER_MODEL_ADAPTER = Object.freeze({
  id: "rna-webgl",
  visual: () => rnaWebglVisual(),
  mount: () => { mountRnaWebgl(); mountRnaReferenceDisclosure(); },
  wrapClass: "dna-visual-wrap"
});

function emitModelMessage(type, payload = {}, requestId) {
  if (window.parent === window) return;
  const hostOrigin = document.referrer ? new URL(document.referrer).origin : "*";
  window.parent.postMessage({ source: "ander-model", protocolVersion: "1.0", modelId: ANDER_MODEL_MANIFEST.id, type, requestId, payload }, hostOrigin);
}

function reportModelState() {
  emitModelMessage("model:state", {
    stageIndex: state.stageIndex,
    stageId: currentStage()?.id || String(state.stageIndex),
    playing: state.playing,
    speed: speeds[state.speedIndex],
    labels: state.labels,
    highlight: state.highlight,
    viewIndex: state.viewIndex,
  });
}

function handleHostMessage(event) {
  const message = event.data;
  if (!message || message.source !== "ander-host" || message.protocolVersion !== "1.0" || message.modelId !== ANDER_MODEL_MANIFEST.id) return;
  const payload = message.payload || {};
  if (message.type === "host:play") state.playing = true;
  if (message.type === "host:pause") state.playing = false;
  if (message.type === "host:reset") return resetState();
  if (message.type === "host:set-stage") {
    const index = currentModel().stages.findIndex((stage) => stage.id === payload.stageId);
    return setStage(index < 0 ? 0 : index);
  }
  if (message.type === "host:set-speed") {
    const index = speeds.indexOf(Number(payload.speed));
    state.speedIndex = index < 0 ? state.speedIndex : index;
  }
  if (message.type === "host:set-labels") state.labels = payload.visible !== false;
  if (message.type === "host:set-highlight") state.highlight = Boolean(payload.enabled);
  if (message.type === "host:set-view") state.viewIndex = Math.max(0, views.indexOf(payload.viewId));
  render();
}

document.addEventListener("click", (event) => {
  const stageButton = event.target.closest("[data-stage-index]");
  if (stageButton) return setStage(stageButton.dataset.stageIndex);
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if(action === "fullscreen")return; // Shared experience owns native and CSS immersion.
  if (action === "play") {
    if (currentModel().visual === "transport") {
      const now = performance.now() * 0.001;
      if (state.playing) {
        state.transportProgress = transport2dProgressValue(now);
        state.transportPlayStartProgress = state.transportProgress;
      } else {
        state.transportPlayStartTime = now;
        state.transportPlayStartProgress = transport2dProgressValue(now);
      }
    }
    state.playing = !state.playing;
  }
  if (action === "reset") return resetState();
  if (action === "prev") return setStage(state.stageIndex - 1);
  if (action === "next") return setStage(state.stageIndex + 1);
  if (action === "speed") state.speedIndex = (state.speedIndex + 1) % speeds.length;
  if (action === "labels") state.labels = !state.labels;
  if (action === "highlight") state.highlight = !state.highlight;
  if (action === "view") state.viewIndex = (state.viewIndex + 1) % views.length;
  if (action === "practice") {
    state.practice = !state.practice;
    if (state.practice) {
      state.playing = false;
      state.stageIndex = currentModel().practiceStageIndex ?? currentModel().stages.length - 1;
    }
  }
  render();
});

document.addEventListener("fullscreenchange", updateControls);
window.addEventListener("message", handleHostMessage);
window.addEventListener("beforeunload", stopVisualRuntime);

render();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountStructureExperience,{once:true});else mountStructureExperience();
emitModelMessage("model:ready", { version: ANDER_MODEL_MANIFEST.version, capabilities: ANDER_MODEL_MANIFEST.capabilities });

// This adapter moves original information/parameter nodes; their scientific handlers stay intact.
function prepareStructureLayout(){
  const layout=refs.stage.querySelector('.rna-webgl-stack');layout.classList.add('structure-layout');
  const scene=refs.stage.querySelector('[data-rna-webgl-shell]');scene.classList.add('structure-scene');
  let info=refs.stage.querySelector('.rna-webgl-sidecar');
  if(!info){info=document.createElement('aside');layout.append(info);}info.classList.add('structure-info');info.setAttribute('aria-label','结构与说明');
  // Reuse the scientific input and readout outside the explanatory panel.
  const control=info.querySelector('[data-rna-webgl-state-control]'),input=control.querySelector('input'),value=control.querySelector('[data-rna-webgl-fold-value]');
  input.setAttribute('data-timeline','');input.setAttribute('aria-label','RNA 单链折叠程度');
  root.querySelector('.structure-timeline').append(input,value);control.remove();
  const summary=document.createElement('section');summary.className='structure-stage-summary';summary.innerHTML='<h2 data-structure-stage-title></h2><p data-structure-stage-description></p>';info.prepend(summary);
  const trigger=document.createElement('button');trigger.type='button';trigger.className='shell-action structure-context-trigger';trigger.dataset.structureContext='';trigger.textContent='结构与说明 ↗';layout.append(trigger);
  trigger.addEventListener('click',event=>openStructureContext(event.currentTarget));
  let feedback=root.querySelector('[data-rna-webgl-feedback]');if(!feedback){feedback=document.createElement('p');feedback.setAttribute('data-rna-webgl-feedback','');scene.append(feedback);}feedback.classList.add('structure-feedback');feedback.setAttribute('aria-live','polite');
}
function syncStructureInfo(){
  const title=root.querySelector('[data-structure-stage-title]'),description=root.querySelector('[data-structure-stage-description]');
  if(title)title.textContent=currentStage().title;if(description)description.textContent=currentStage().explanation;
  const disclosure=root.querySelector('[data-rna-reference-disclosure]');if(disclosure){const open=state.rnaReferenceOpen;disclosure.classList.toggle('is-open',open);const button=disclosure.querySelector('button');button?.setAttribute('aria-expanded',String(open));if(button?.querySelector('strong'))button.querySelector('strong').textContent=open?'收起':'展开';const wrap=disclosure.querySelector('.rna-reference-panel-wrap');if(wrap)wrap.hidden=!open;}
}
function openStructureContext(trigger){shellExperience?.showPanel(root.querySelector('.structure-info'),'结构与说明',trigger);}
function mountStructureExperience(){
 if(shellExperience)return;const shell=globalThis.AnderModelShell;
 const help='<p>单指或鼠标左键拖动旋转；双指移动或鼠标右键拖动平移；双指捏合或滚轮缩放。点选结构查看名称，拖动底部“单链折叠”滑杆实时观察分子变化；点“结构与说明”查看阶段说明。</p><p>播放控制模型原有运动；速度、标签、高亮和视角在手机的“观察”面板中。重置回到第一阶段和默认观察状态。</p><p>沉浸模式放大画面，松手 2 秒后收起上下控件，轻触唤出；操作面板时保持显示。收藏由打开模型的网站提供。</p>';
 const onSettings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'还原视角',run:()=>{state.viewIndex=0;state.rnaWebglViewIndex=-1;render();shellExperience.closeDialog();}}]);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();else shellExperience.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);};
 shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('[data-rna-webgl-viewport]'),title:ANDER_MODEL_MANIFEST.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'结构与说明',onSettings,onContext:openStructureContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>structureRuntime?.resize())});
 shell.setExtra(root.querySelector('[data-structure-settings]'),'settings','显示与操作');root.querySelector('[data-structure-settings]').addEventListener('click',event=>onSettings(event.currentTarget));
 root.querySelector('.independent-model-back').addEventListener('click',event=>{event.preventDefault();onReturn();});
 shellExperience.setSceneStatus(structureRuntime?'ready':'loading');
 globalThis.StructureSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...cloneValue(state),shell:shellExperience.getState(),ready:!!structureRuntime})});
}

// Screen-space label placement adapted from animal-cell@2.2.2. Scientific anchors stay fixed.
function placeStructureLabels(THREE,items,camera,host,layer){
 layer.hidden=!state.labels;if(!state.labels)return;
 const rect=host.getBoundingClientRect(),width=rect.width,height=rect.height,occupied=[{x:0,y:height-66,width:68,height:66}];
  const feedback=host.closest('.structure-scene')?.querySelector('.structure-feedback');
  if(feedback?.textContent.trim()){const b=feedback.getBoundingClientRect();occupied.push({x:b.x-rect.x,y:b.y-rect.y,width:b.width,height:b.height});}
 if(refs.modelArea.dataset.immersive!=='true'&&(width<980||height<460))occupied.push({x:width-140,y:0,width:140,height:44});
 const vector=new THREE.Vector3(),intersects=(a,b)=>a.x<b.x+b.width+5&&a.x+a.width+5>b.x&&a.y<b.y+b.height+5&&a.y+a.height+5>b.y;
 for(const item of items){
  const projected=vector.setFromMatrixPosition(item.anchor.matrixWorld).project(camera),ax=(projected.x*.5+.5)*width,ay=(-projected.y*.5+.5)*height;
  const visible=Number.isFinite(ax)&&Number.isFinite(ay)&&projected.z>=-1&&projected.z<=1&&ax>=0&&ax<=width&&ay>=0&&ay<=height;
  item.el.hidden=!visible;if(!visible){if(item.line)item.line.style.display='none';continue;}
  const w=item.el.offsetWidth||60,h=item.el.offsetHeight||24;
  const home={x:clamp(ax+(item.offset?.x||0)-w/2,4,width-w-4),y:clamp(ay+(item.offset?.y||0)-h/2,4,height-h-16),width:w,height:h},candidates=[home];
  for(let radius=1;radius<=8;radius++)for(const[dx,dy]of[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]])candidates.push({x:clamp(home.x+dx*radius*(w+7)/2,4,width-w-4),y:clamp(home.y+dy*radius*(h+7),4,height-h-16),width:w,height:h});
  const place=candidates.find(c=>!occupied.some(other=>intersects(c,other)));
  if(!place){item.el.hidden=true;if(item.line)item.line.style.display='none';continue;}
  occupied.push(place);item.el.style.transform=`translate(${Math.round(place.x)}px, ${Math.round(place.y)}px)`;item.el.style.opacity=String(item.opacity??1);
  if(!item.line){let svg=layer.querySelector('.structure-label-lines');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('structure-label-lines');svg.setAttribute('aria-hidden','true');layer.prepend(svg);}item.line=document.createElementNS(svg.namespaceURI,'path');item.line.setAttribute('stroke',item.el.style.getPropertyValue('--label-color')||'#647c83');svg.append(item.line);}
  item.line.style.display='';item.line.setAttribute('d',`M${ax.toFixed(1)} ${ay.toFixed(1)}L${clamp(ax,place.x,place.x+w).toFixed(1)} ${clamp(ay,place.y,place.y+h).toFixed(1)}`);
 }
}
