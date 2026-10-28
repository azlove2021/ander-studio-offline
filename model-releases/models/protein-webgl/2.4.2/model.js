"use strict";

const ANDER_MODEL_CONTENT = {"id":"protein-webgl","accent":"#F97316","title":"蛋白质的结构","titleEn":"Protein Structure","chapter":"生命活动的主要承担者 / Proteins","type":"3D WebGL 动态模型","state":"结构层次演示","visual":"proteinWebgl","structures":[["氨基酸 Amino Acid","#38BDF8"],["肽键 Peptide Bond","#2563EB"],["脱水缩合 H2O Released","#EF4444"],["α 螺旋 Alpha Helix","#F59E0B"],["β 折叠 Beta Sheet","#22C55E"],["氢键 Hydrogen Bond","#94A3B8"],["三级结构 Tertiary Fold","#A855F7"],["蛋白质亚基 Subunit","#14B8A6"]],"stages":[{"title":"脱水缩合","titleEn":"Dehydration Condensation","goal":"观察两个氨基酸通过脱水缩合形成肽键，并释放一分子水。","keywords":["氨基 Amino Group","羧基 Carboxyl Group","肽键 Peptide Bond","H2O"],"explanation":"一个氨基酸羧基中的 -OH 与另一个氨基酸氨基上的 -H 脱去，二者结合成 H2O；剩余部分形成肽键，把两个氨基酸连接起来。","mistake":"脱水缩合不是先拿走一个现成的水分子，而是分别脱去 H 和 OH 后再形成水。","question":"如果很多个氨基酸连续发生脱水缩合，会形成什么结构？","id":"condensation"},{"title":"一级结构","titleEn":"Primary Structure","goal":"观察氨基酸按一定顺序连接成多肽链，并理解肽键形成过程。","keywords":["氨基酸 Amino Acid","肽键 Peptide Bond","脱水缩合 Dehydration"],"explanation":"蛋白质的一级结构是氨基酸的排列顺序。相邻氨基酸通过脱水缩合形成肽键，释放一分子水，逐步连接成多肽链。","mistake":"一级结构不是空间折叠形状，而是氨基酸的线性排列顺序。","question":"如果氨基酸排列顺序改变，蛋白质的后续结构可能会怎样变化？","id":"primary"},{"title":"二级结构","titleEn":"Secondary Structure","goal":"观察多肽链局部形成 α 螺旋和 β 折叠两类常见二级结构。","keywords":["α 螺旋 Alpha Helix","β 折叠 Beta Sheet","主链氢键 Backbone H-bonds"],"explanation":"蛋白质的二级结构是多肽链局部有规律的空间结构，常见形式包括 α 螺旋和 β 折叠，主要由主链之间的氢键稳定。","mistake":"二级结构不是由不同蛋白质亚基结合形成的，而是同一条多肽链的局部折叠。","question":"为什么氢键能让局部结构保持稳定？","id":"secondary"},{"title":"三级结构","titleEn":"Tertiary Structure","goal":"观察一条多肽链在保留二级结构的基础上进一步折叠成复杂空间结构。","keywords":["空间折叠 3D Folding","侧链相互作用 Side-chain Interactions","结构域 Domain"],"explanation":"蛋白质的三级结构是一条多肽链整体折叠形成的三维构象。α 螺旋、β 折叠等二级结构会作为局部结构保留下来，并通过侧链相互作用进一步稳定。","mistake":"三级结构仍然属于一条多肽链的整体结构，不等于多个亚基组合。","question":"为什么同一条多肽链可以折叠成非常复杂的空间形状？","id":"tertiary"},{"title":"四级结构","titleEn":"Quaternary Structure","goal":"观察多个蛋白质亚基结合形成更大的功能性蛋白质结构。","keywords":["蛋白质亚基 Subunit","亚基组装 Assembly","四级结构 Quaternary Structure"],"explanation":"有些蛋白质由两条或多条多肽链作为亚基共同组成。不同亚基通过相互作用结合在一起，形成四级结构。","mistake":"并不是所有蛋白质都有四级结构；只有由多个亚基组成的蛋白质才具有四级结构。","question":"为什么多个亚基组合后，蛋白质可能获得新的功能？","id":"quaternary"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"protein-webgl","version":"2.4.2","publish":true,"title":{"zh":"蛋白质的结构模型","en":"Protein Structure Model"},"summary":{"zh":"规范氨基和羧基的直角几何，并以双色包裹光晕突出反应基团。","en":"Refine amino and carboxyl geometry and highlight reacting groups with close-fitting two-color halos."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"condensation","title":{"zh":"脱水缩合","en":"Dehydration Condensation"}},{"id":"primary","title":{"zh":"一级结构","en":"Primary Structure"}},{"id":"secondary","title":{"zh":"二级结构","en":"Secondary Structure"}},{"id":"tertiary","title":{"zh":"三级结构","en":"Tertiary Structure"}},{"id":"quaternary","title":{"zh":"四级结构","en":"Quaternary Structure"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"protein-webgl","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"proteinSelected":"","proteinWebglQuaternion":{"x":0,"y":0,"z":0,"w":1},"proteinWebglZoom":1,"proteinWebglPan":{"x":0,"y":0},"proteinWebglViewIndex":-1,"proteinProgress":0,"proteinPlayStartProgress":0,"proteinPlayStartTime":0};
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
          <div class="timeline-wrap structure-timeline"><span>结构进度</span><output data-structure-progress>0%</output></div>
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
  if (currentModel().visual === "proteinWebgl") {
    state.proteinProgress = state.stageIndex;
    state.proteinPlayStartProgress = state.proteinProgress;
    state.proteinPlayStartTime = performance.now() * 0.001;
    state.playing = false;
  }
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


function proteinWebglVisual() {
  const progress = proteinProgressValue();
  return `
    <div class="dna-webgl-stack protein-webgl-stack">
      <div class="dna-3d-shell dna-webgl-shell protein-webgl-shell" data-protein-webgl-shell>
        <div class="dna-webgl-viewport-frame" data-protein-webgl-viewport>
          <div class="dna-webgl-host" data-protein-webgl-host></div>
          <div class="dna-webgl-labels" data-protein-webgl-labels></div>
        </div>
        <div class="dna-webgl-loading" data-protein-webgl-loading>正在加载蛋白质 WebGL 三维模型...</div>
        <div class="protein-stage-note" data-protein-webgl-stage-note>${proteinProgressNote(progress)}</div>
        <div class="dna-state-control protein-state-control" data-protein-webgl-state-control>
          <div class="dna-state-header">
            <span>结构形成进度</span>
            <strong data-protein-webgl-progress-value>${proteinProgressLabel(progress)}</strong>
          </div>
          <label>
            <span>手动控制：脱水缩合 → 一级 → 二级 → 三级 → 四级</span>
            <input type="range" min="0" max="400" step="1" value="${Math.round(progress * 100)}" aria-label="手动控制蛋白质结构形成进度" data-protein-webgl-progress />
          </label>
          <div class="protein-progress-marks" aria-hidden="true">
            <span>缩合</span>
            <span>一级</span>
            <span>二级</span>
            <span>三级</span>
            <span>四级</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function proteinProgressValue() {
  return clamp(Number(state.proteinProgress ?? state.stageIndex ?? 0), 0, 4);
}

function proteinProgressStageIndex(progress = proteinProgressValue()) {
  return progress >= 3.999 ? 4 : clamp(Math.floor(progress + 0.001), 0, 3);
}

function proteinProgressSegment(progress = proteinProgressValue()) {
  if (progress < 1) return { from: -1, to: 0, local: progress, name: "脱水缩合 → 一级" };
  return proteinStructuralProgressSegment(progress - 1);
}

function proteinStructuralProgressSegment(progress) {
  if (progress < 1) return { from: 0, to: 1, local: progress, name: "一级 → 二级" };
  if (progress < 2) return { from: 1, to: 2, local: progress - 1, name: "二级 → 三级" };
  return { from: 2, to: 3, local: progress - 2, name: "三级 → 四级" };
}

function proteinProgressLabel(progress = proteinProgressValue()) {
  const exact = Math.abs(progress - Math.round(progress)) < 0.005;
  const stageNames = ["脱水缩合", "一级结构", "二级结构", "三级结构", "四级结构"];
  if (exact) return stageNames[proteinProgressStageIndex(progress)];
  const segment = proteinProgressSegment(progress);
  return `${segment.name} ${Math.round(segment.local * 100)}%`;
}

function proteinProgressNote(progress = proteinProgressValue()) {
  if (progress < 0.98) return "脱水缩合：羧基脱去 OH，氨基脱去 H，H 与 OH 结合形成 H2O，同时形成肽键。";
  if (Math.abs(progress - 1) < 0.005) return "一级结构：氨基酸按顺序连接，脱水缩合形成肽键并释放 H2O。";
  if (Math.abs(progress - 2) < 0.005) return "二级结构：同一条多肽链局部形成 α 螺旋和 β 折叠，主要由主链氢键稳定。";
  if (Math.abs(progress - 3) < 0.005) return "三级结构：一条多肽链在保留二级结构的基础上，进一步折叠成复杂空间结构。";
  if (progress < 1) return "连续转化：两个氨基酸完成脱水缩合后，继续连接成多肽链。";
  if (progress < 2) return "连续转化：同一条多肽链正在由一级结构弯曲成 α 螺旋和 β 折叠。";
  if (progress < 3) return "连续转化：二级结构作为局部结构保留，整条多肽链继续折叠成三级结构。";
  if (progress < 3.98) return "连续转化：已经形成三级结构的蛋白质亚基靠近另一个亚基，准备形成四级结构。";
  return "四级结构：多个已经形成三级结构的亚基结合，组成更大的功能性蛋白质结构。";
}

function proteinSyncStageToProgress() {
  state.stageIndex = proteinProgressStageIndex();
}

const PROTEIN_PLAY_SECONDS_PER_STAGE = 4.8;

function proteinPlaybackProgress(time = performance.now() * 0.001) {
  const startProgress = clamp(Number(state.proteinPlayStartProgress ?? proteinProgressValue()), 0, 4);
  const startTime = Number(state.proteinPlayStartTime || time);
  const elapsed = Math.max(0, time - startTime);
  return clamp(startProgress + (elapsed * speeds[state.speedIndex]) / PROTEIN_PLAY_SECONDS_PER_STAGE, 0, 4);
}

function startProteinPlayback(time = performance.now() * 0.001) {
  let progress = proteinProgressValue();
  if (progress >= 3.999) progress = 0;
  state.proteinProgress = progress;
  state.proteinPlayStartProgress = progress;
  state.proteinPlayStartTime = time;
  proteinSyncStageToProgress();
  state.playing = true;
}

function pauseProteinPlayback(time = performance.now() * 0.001) {
  if (state.playing) state.proteinProgress = proteinPlaybackProgress(time);
  state.proteinPlayStartProgress = proteinProgressValue();
  state.proteinPlayStartTime = time;
  proteinSyncStageToProgress();
  state.playing = false;
}

const PROTEIN_THREE_VIEW_SIZE = 104;

const PROTEIN_RESIDUE_LIBRARY = {
  A: ["Ala", "#22C55E"],
  C: ["Cys", "#EAB308"],
  D: ["Asp", "#14B8A6"],
  E: ["Glu", "#EC4899"],
  F: ["Phe", "#0EA5E9"],
  G: ["Gly", "#38BDF8"],
  H: ["His", "#6366F1"],
  I: ["Ile", "#06B6D4"],
  K: ["Lys", "#EF4444"],
  L: ["Leu", "#F97316"],
  M: ["Met", "#64748B"],
  N: ["Asn", "#8B5CF6"],
  P: ["Pro", "#F59E0B"],
  Q: ["Gln", "#10B981"],
  R: ["Arg", "#F43F5E"],
  S: ["Ser", "#38BDF8"],
  T: ["Thr", "#64748B"],
  V: ["Val", "#A855F7"],
  W: ["Trp", "#0F766E"],
  Y: ["Tyr", "#84CC16"],
};

const PROTEIN_RESIDUE_SEQUENCE = "GACVKDLTFCEYRHIPNQCWVKSLGTAMDEFPYRHINQCWLKTGVADPFCEMYRHINQSW";

const PROTEIN_MODEL = {
  residues: [...PROTEIN_RESIDUE_SEQUENCE].map((code) => {
    const residue = PROTEIN_RESIDUE_LIBRARY[code] || ["Amino acid", "#38BDF8"];
    return [residue[0], code, residue[1]];
  }),
  colors: {
    amino: "#38BDF8",
    peptide: "#2563EB",
    waterO: "#EF4444",
    waterH: "#F8FAFC",
    helix: "#F59E0B",
    sheet: "#22C55E",
    helixGuide: "#FBBF24",
    sheetGuide: "#38BDF8",
    loop: "#64748B",
    hbond: "#94A3B8",
    tertiary: "#A855F7",
    subunitA: "#14B8A6",
    subunitB: "#F97316",
    disulfide: "#EAB308",
    ionic: "#0EA5E9",
    hydrophobic: "#475569",
    interface: "#EC4899",
  },
};

const PROTEIN_PART_LABELS = {
  amino: "氨基酸 / Amino Acid",
  peptide: "肽键 / Peptide Bond",
  water: "脱水缩合释放的水 / Released H2O",
  helix: "α 螺旋 / Alpha Helix",
  sheet: "β 折叠 / Beta Sheet",
  hbond: "氢键 / Hydrogen Bond",
  loop: "连接环区 / Loop",
  tertiary: "三级结构 / Tertiary Structure",
  interaction: "侧链相互作用 / Side-chain Interaction",
  subunit: "蛋白质亚基 / Protein Subunit",
  interface: "亚基结合界面 / Subunit Interface",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DNA_THREE_URL = "./vendor/three.module.min.js";

function loadThreeForDna() {
  if (!threeModulePromise) {
    threeModulePromise = import(DNA_THREE_URL);
  }
  return threeModulePromise;
}

function mountProteinWebgl() {
  const shell = document.querySelector("[data-protein-webgl-shell]");
  const host = document.querySelector("[data-protein-webgl-host]");
  const labelsLayer = document.querySelector("[data-protein-webgl-labels]");
  const feedback = document.querySelector("[data-protein-webgl-feedback]");
  const loading = document.querySelector("[data-protein-webgl-loading]");
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
      instanceCleanup = startProteinWebgl(THREE, shell, host, labelsLayer, feedback, loading);
      shellExperience?.setSceneStatus('ready');
    })
    .catch((error) => {
      console.warn("Three.js failed to load", error);
      threeModulePromise=null;
      shellExperience?.setSceneStatus('error','三维画面未能加载，请重试或换用支持 WebGL 的浏览器。',()=>{shellExperience.setSceneStatus('loading');stopVisualRuntime();host.replaceChildren();labelsLayer.replaceChildren();mountProteinWebgl();});
      if (loading) {
        loading.textContent = "三维画面未能加载，请重试。";
      }
    });
}

function startProteinWebgl(THREE, shell, host, labelsLayer, feedback, loading) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
  renderer.domElement.className = "dna-webgl-canvas";
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL 蛋白质四级结构模型");
  host.appendChild(renderer.domElement);
  if (loading) loading.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
  camera.position.set(0, 0, 120);
  camera.lookAt(0, 0, 0);

  const panRoot = new THREE.Group();
  const proteinRoot = new THREE.Group();
  const molecule = new THREE.Group();
  scene.add(panRoot);
  panRoot.add(proteinRoot);
  proteinRoot.add(molecule);

  scene.add(new THREE.AmbientLight(0xffffff, 1.08));
  const hemi = new THREE.HemisphereLight(0xf8fbff, 0xe2e8f0, 0.66);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.58);
  key.position.set(-5, 8, 10);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0f2fe, 0.84);
  fill.position.set(6, 2, 5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.72);
  rim.position.set(0, -5, 9);
  scene.add(rim);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  const animationItems = [];
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

  applyProteinWebglViewPreset(THREE, proteinRoot, panRoot, camera);
  const lockedRotation = { ...state.proteinWebglRotation };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewSize = PROTEIN_THREE_VIEW_SIZE / Math.min(1, aspect);
    camera.left = (-viewSize * aspect) / 2;
    camera.right = (viewSize * aspect) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.zoom = state.proteinWebglZoom;
    camera.updateProjectionMatrix();
  };

  const saveTransformState = () => {
    state.proteinWebglRotation = { x: lockedRotation.x, y: lockedRotation.y };
    state.proteinWebglQuaternion = {
      x: proteinRoot.quaternion.x,
      y: proteinRoot.quaternion.y,
      z: proteinRoot.quaternion.z,
      w: proteinRoot.quaternion.w,
    };
    state.proteinWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.proteinWebglZoom = camera.zoom;
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

  const rebuild = () => {
    pickables.length = 0;
    animationItems.length = 0;
    labelItems.forEach((item) => {item.el.remove();item.line?.remove();});
    labelItems = [];
    while (molecule.children.length) {
      const child = molecule.children.pop();
      disposeDnaWebglObject(child);
    }
    const formationProgress = proteinProgressValue();
    let modelScale = 4.6;
    if (formationProgress < 1) {
      modelScale = proteinLerp(4.6, 3, proteinSmoothStep(clamp((formationProgress - 0.54) / 0.42, 0, 1)));
    } else if (formationProgress < 2) {
      modelScale = proteinLerp(3, 2.5, proteinSmoothStep(formationProgress - 1));
    } else if (formationProgress < 3) {
      modelScale = proteinLerp(2.5, 4.8, proteinSmoothStep(formationProgress - 2));
    } else {
      modelScale = proteinLerp(4.8, 5.8, proteinSmoothStep(formationProgress - 3));
    }
    molecule.scale.setScalar(modelScale);
    buildProteinWebglMolecule(THREE, molecule, pickables, addLabel, animationItems);
  };

  const projectLabels = () => {
    placeStructureLabels(THREE,labelItems,camera,host,labelsLayer);
  };
  const renderProteinFrame = (time = performance.now() * 0.001) => {
    updateProteinWebglAnimations(THREE, animationItems, time);
    renderer.render(scene, camera);
    projectLabels();
  };

  const stateControl = root.querySelector("[data-protein-webgl-state-control]");
  const progressInput = root.querySelector("[data-protein-webgl-progress]");
  const progressValue = root.querySelector("[data-protein-webgl-progress-value]");
  const stageNote = root.querySelector("[data-protein-webgl-stage-note]");
  const syncProgressText = () => {
    const progress = proteinProgressValue();
    const output=root.querySelector("[data-structure-progress]");if(output)output.textContent=Math.round(progress/4*100)+"%";
    syncStructureInfo();
    if (progressInput) progressInput.value = String(Math.round(progress * 100));
    if (progressValue) progressValue.textContent = proteinProgressLabel(progress);
    if (stageNote) stageNote.textContent = proteinProgressNote(progress);
    const stage = currentStage();
    const captionStrong = refs.stage?.querySelector(".stage-caption strong");
    const captionSpan = refs.stage?.querySelector(".stage-caption span");
    if (captionStrong) captionStrong.textContent = `阶段 ${state.stageIndex + 1} / ${currentModel().stages.length}：${stage.title}`;
    if (captionSpan) captionSpan.textContent = stage.titleEn;
  };

  let lastPlaybackRebuild = 0;
  const updatePlayback = (time) => {
    if (!state.playing) return;
    const nextProgress = proteinPlaybackProgress(time);
    if (nextProgress < 3.999 && time - lastPlaybackRebuild < 0.05) return;
    lastPlaybackRebuild = time;
    const previousStage = state.stageIndex;
    state.proteinProgress = nextProgress;
    proteinSyncStageToProgress();
    rebuild();
    syncProgressText();
    if (state.stageIndex !== previousStage) {
      renderStages();
      emitModelMessage("model:stage-changed", { stageId: currentStage().id, stageIndex: state.stageIndex });
    }
    if (nextProgress >= 3.999) {
      state.proteinProgress = 4;
      state.proteinPlayStartProgress = 4;
      state.playing = false;
      syncProgressText();
      renderStages();
      updateControls();
      reportModelState();
    }
  };

  const animate = () => {
    if (!document.body.contains(shell)) return;
    const time = performance.now() * 0.001;
    updatePlayback(time);
    renderProteinFrame(time);
    dnaWebglAnimationFrame = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  rebuild();
  renderProteinFrame();
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
      proteinRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
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
    const hit = hits.find((item) => item.object.userData?.proteinPart);
    if (!hit) return;
    const part = hit.object.userData.proteinPart;
    const label = PROTEIN_PART_LABELS[part] || hit.object.userData.proteinLabel || "蛋白质结构";
    state.proteinSelected = `已选中：${label}`;
    setFeedback(state.proteinSelected);
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

  stateControl?.addEventListener("pointerdown", (event) => event.stopPropagation());
  stateControl?.addEventListener("click", (event) => event.stopPropagation());
  progressInput?.addEventListener('pointerdown',()=>{pauseProteinPlayback();updateControls();});
  progressInput?.addEventListener("input", (event) => {
    state.proteinProgress = Number(event.target.value) / 100;
    proteinSyncStageToProgress();
    state.playing = false;
    state.proteinPlayStartProgress = state.proteinProgress;
    state.proteinPlayStartTime = performance.now() * 0.001;
    state.proteinSelected = "";
    syncProgressText();
    setFeedback(proteinProgressNote());
    rebuild();
    renderProteinFrame();
    renderStages();
    updateControls();
  });

  structureRuntime={resize,sync:()=>{
    applyProteinWebglViewPreset(THREE, proteinRoot, panRoot, camera);
    Object.assign(lockedRotation,state.proteinWebglRotation);
    rebuild();syncProgressText();renderProteinFrame();
    resize();setFeedback(state.proteinSelected||'');
  }};
  return () => {
    structureRuntime=null;
    resizeObserver.disconnect();
    if (dnaWebglAnimationFrame) {
      cancelAnimationFrame(dnaWebglAnimationFrame);
      dnaWebglAnimationFrame = 0;
    }
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
    labelItems.forEach((item) => {item.el.remove();item.line?.remove();});
    disposeDnaWebglObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function updateProteinWebglAnimations(THREE, animationItems, time) {
  animationItems.forEach((item) => {
    if (item.type === "condensationDemo") {
      updateProteinCondensationDemo(THREE, item, time);
    }
    if (item.type === "water") {
      const raw = (time * 0.52) % 1;
      const eased = raw * raw * (3 - raw * 2);
      item.group.position.copy(item.start.clone().lerp(item.end, eased));
      const scale = 0.78 + Math.sin(raw * Math.PI) * 0.22;
      item.group.scale.setScalar(scale);
      item.group.rotation.y = time * 1.4;
    }
    if (item.type === "pulse") {
      const scale = 1 + Math.max(0, Math.sin(time * 4.2)) * 0.22;
      item.object.scale.x = scale;
      item.object.scale.z = scale;
    }
    if (item.type === "float") {
      item.group.rotation.y = item.baseRotation + Math.sin(time * 0.9 + item.offset) * 0.12;
      item.group.position.y = item.baseY + Math.sin(time * 1.2 + item.offset) * 0.38;
    }
    if (item.type === "morphChain") {
      const shapeProgress = item.fixedProgress ?? proteinFormationProgress(time, item);
      const moveProgress = item.moveAsSubunit ? proteinFormationProgress(time, item) : shapeProgress;
      updateProteinMorphChain(THREE, item, shapeProgress, moveProgress);
    }
    if (item.type === "formationFade") {
      const progress = proteinFormationProgress(time, item);
      setProteinGroupOpacity(item.group, proteinLerp(item.fromOpacity, item.toOpacity, progress));
    }
    if (item.type === "formationAppear") {
      const progress = proteinFormationProgress(time, item);
      const scale = proteinLerp(item.startScale, item.endScale, progress);
      item.group.scale.setScalar((item.baseScale || 1) * scale);
      setProteinGroupOpacity(item.group, proteinLerp(item.fromOpacity, item.toOpacity, progress));
    }
    if (item.type === "subunitJoin") {
      const progress = proteinFormationProgress(time, item);
      item.group.position.copy(item.start.clone().lerp(item.end, progress));
      item.group.position.y += Math.sin(time * 1.1 + (item.offset || 0)) * 0.18;
      item.group.rotation.y = item.baseRotationY + (1 - progress) * 0.42;
      item.group.rotation.z = item.baseRotationZ + Math.sin(progress * Math.PI) * 0.08;
    }
  });
}

function proteinFormationProgress(time, item) {
  if (item.startedAt === undefined) item.startedAt = time;
  const elapsed = time - item.startedAt;
  const phase = ((elapsed * (item.speed || 0.12) + (item.phase || 0)) % 1 + 1) % 1;
  const wave = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
  return wave * wave * (3 - wave * 2);
}

function proteinLerp(from, to, progress) {
  return from + (to - from) * progress;
}

function setProteinGroupOpacity(group, opacity) {
  group.traverse?.((child) => {
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      material.transparent = opacity < 0.985;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.72;
      material.needsUpdate = true;
    });
  });
}

function setProteinObjectOpacity(object, opacity) {
  const apply = (target) => {
    const materials = Array.isArray(target.material) ? target.material : [target.material];
    materials.forEach((material) => {
      if (!material) return;
      material.transparent = opacity < 0.985;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.72;
      material.needsUpdate = true;
    });
  };
  if (object.traverse) object.traverse(apply);
  else apply(object);
}

function applyProteinWebglViewPreset(THREE, proteinRoot, panRoot, camera) {
  if (state.proteinWebglViewIndex !== state.viewIndex) {
    const preset = proteinWebglViewPreset(THREE, state.viewIndex);
    state.proteinWebglRotation = { ...preset.rotation };
    state.proteinWebglQuaternion = {
      x: preset.quaternion.x,
      y: preset.quaternion.y,
      z: preset.quaternion.z,
      w: preset.quaternion.w,
    };
    state.proteinWebglZoom = preset.zoom;
    state.proteinWebglPan = { x: 0, y: 0 };
    state.proteinWebglViewIndex = state.viewIndex;
  }

  if (!state.proteinWebglRotation) {
    const restored = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(
        state.proteinWebglQuaternion.x,
        state.proteinWebglQuaternion.y,
        state.proteinWebglQuaternion.z,
        state.proteinWebglQuaternion.w,
      ),
      "XYZ",
    );
    state.proteinWebglRotation = { x: restored.x, y: restored.y };
  }
  proteinRoot.rotation.set(state.proteinWebglRotation.x, state.proteinWebglRotation.y, 0, "XYZ");
  panRoot.position.set(state.proteinWebglPan.x, state.proteinWebglPan.y, 0);
  camera.zoom = state.proteinWebglZoom;
  camera.updateProjectionMatrix();
}

function proteinWebglViewPreset(THREE, index) {
  const presets = [
    { theta: 0.68, phi: 1.22, zoom: 0.92 },
    { theta: 1.12, phi: 1.2, zoom: 1.08 },
    { theta: Math.PI / 2, phi: 1.45, zoom: 0.96 },
    { theta: 0.68, phi: 0.02, zoom: 1.0 },
    { theta: 0.68, phi: Math.PI - 0.02, zoom: 1.0 },
  ];
  const selected = presets[index] || presets[0];
  return {
    quaternion: dnaWebglQuaternionFromCamera(THREE, selected.theta, selected.phi),
    rotation: { x: selected.phi - Math.PI / 2, y: -selected.theta },
    zoom: selected.zoom,
  };
}

function buildProteinWebglMolecule(THREE, parent, pickables, addLabel, animationItems) {
  const materials = proteinWebglMaterials(THREE);
  buildProteinUnifiedState(THREE, parent, materials, pickables, addLabel, animationItems);
}

function buildProteinUnifiedState(THREE, parent, materials, pickables, addLabel, animationItems) {
  const progress = proteinProgressValue();
  if (progress < 1) {
    buildProteinCondensationState(THREE, parent, materials, pickables, addLabel, animationItems, progress);
    return;
  }

  const structureProgress = clamp(progress - 1, 0, 3);
  const stageIndex = clamp(Math.round(structureProgress), 0, 3);
  const segment = proteinStructuralProgressSegment(structureProgress);
  const local = proteinSmoothStep(segment.local);
  const currentPoints = proteinInterpolatedChainPositions(THREE, structureProgress);

  if (structureProgress <= 2) {
    const chain = createProteinMorphChain(THREE, materials, pickables, {
      fromLevel: segment.from,
      toLevel: segment.to,
      fixedProgress: local,
      showLetters: structureProgress < 0.14,
      colorLevel: stageIndex,
    });
    parent.add(chain.group);

    if (structureProgress < 0.14) {
      addProteinPrimaryProcess(THREE, parent, materials, pickables, addLabel, animationItems);
      addLabel("同一条多肽链", new THREE.Vector3(-18, 8, 5), PROTEIN_MODEL.colors.amino, { x: -110, y: -32 });
      addLabel("氨基酸序列", new THREE.Vector3(14, -7, 5), PROTEIN_MODEL.colors.peptide, { x: 92, y: 30 });
    }

    const guideOpacity = structureProgress < 1 ? clamp((structureProgress - 0.5) / 0.34, 0, 1) * 0.5 : 0.5;
    if (guideOpacity > 0.02) {
      parent.add(createProteinSecondaryGuides(THREE, materials, pickables, currentPoints, { opacity: guideOpacity }));
    }

    const hbondOpacity = structureProgress < 1 ? clamp((structureProgress - 0.42) / 0.48, 0, 1) * 0.82 : 0.82;
    if (hbondOpacity > 0.02) {
      const hbondGroup = createProteinSecondaryHydrogenBonds(THREE, materials, pickables, currentPoints);
      setProteinGroupOpacity(hbondGroup, hbondOpacity);
      parent.add(hbondGroup);
    }

    if (structureProgress > 1.015) {
      const interactionOpacity = clamp((structureProgress - 1.15) / 0.68, 0, 1) * 0.9;
      const interactions = createProteinTertiaryInteractions(THREE, materials, pickables, currentPoints);
      setProteinGroupOpacity(interactions, interactionOpacity);
      parent.add(interactions);
    }

    if (structureProgress <= 1.015) {
      addLabel(structureProgress < 0.96 ? "同一条链：一级 → 二级" : "二级结构已形成", new THREE.Vector3(0, -14, 5), "#0f172a", { x: 0, y: 28 });
      if (structureProgress > 0.52) {
        addLabel(structureProgress < 0.96 ? "α 螺旋逐渐形成" : "α 螺旋区域", new THREE.Vector3(-21, 15, 6), PROTEIN_MODEL.colors.helix, { x: -36, y: -30 });
        addLabel(structureProgress < 0.96 ? "β 折叠逐渐形成" : "β 折叠区域", new THREE.Vector3(15, 12.5, 6), PROTEIN_MODEL.colors.sheet, { x: 36, y: -30 });
      }
    } else {
      addLabel("同一条链：二级 → 三级", new THREE.Vector3(0, -15, 7), "#0f172a", { x: 0, y: 30 });
      addLabel("α 螺旋仍保留", new THREE.Vector3(-5.1, 7, 6.4), PROTEIN_MODEL.colors.helix, { x: -28, y: -30 });
      addLabel("β 折叠仍保留", new THREE.Vector3(-1.2, -2.2, 6.4), PROTEIN_MODEL.colors.sheet, { x: 42, y: 24 });
      if (structureProgress > 1.38) addLabel("侧链相互作用稳定空间结构", new THREE.Vector3(-2.4, 10.3, 7.6), PROTEIN_MODEL.colors.disulfide, { x: 0, y: -36 });
    }
    return;
  }

  const quaternaryProgress = proteinSmoothStep(structureProgress - 2);
  const offsetA = new THREE.Vector3().lerp(new THREE.Vector3(0.9, 0, 0), quaternaryProgress);
  const offsetB = new THREE.Vector3(12, 1.1, -0.9).lerp(new THREE.Vector3(-1.1, 0.35, 0.2), quaternaryProgress);
  const scaleA = proteinLerp(1, 0.76, quaternaryProgress);
  const subunitA = createProteinMorphChain(THREE, materials, pickables, {
    fromLevel: 2,
    toLevel: 2,
    fixedProgress: 1,
    endOffset: offsetA,
    baseScale: scaleA,
    showLetters: false,
    colorLevel: 2,
  });
  const subunitB = createProteinMorphChain(THREE, materials, pickables, {
    fromLevel: 2,
    toLevel: 2,
    fixedProgress: 1,
    endOffset: offsetB,
    baseScale: 0.76,
    showLetters: false,
    part: "subunit",
    colorTint: PROTEIN_MODEL.colors.subunitB,
    mirror: true,
  });
  parent.add(subunitA.group, subunitB.group);
  const subunitBOpacity = clamp((structureProgress - 2.04) / 0.26, 0, 1);
  setProteinGroupOpacity(subunitB.group, subunitBOpacity);

  const baseGuidePoints = proteinLevelPositions(THREE, 2);
  const guideA = createProteinSecondaryGuides(
    THREE,
    materials,
    pickables,
    proteinTransformPointList(THREE, baseGuidePoints, { baseScale: scaleA, offset: offsetA }),
    { opacity: 0.44 },
  );
  const guideB = createProteinSecondaryGuides(
    THREE,
    materials,
    pickables,
    proteinTransformPointList(THREE, baseGuidePoints, { baseScale: 0.76, offset: offsetB, mirror: true }),
    { opacity: 0.44 },
  );
  setProteinGroupOpacity(guideB, 0.44 * subunitBOpacity);
  parent.add(guideA, guideB);

  const interfaceOpacity = clamp((structureProgress - 2.58) / 0.32, 0, 1) * 0.9;
  const interfaceGroup = createProteinInterfaceBonds(THREE, materials, pickables, {
    offsetA,
    offsetB,
    scaleA,
    scaleB: 0.76,
  });
  setProteinGroupOpacity(interfaceGroup, interfaceOpacity);
  parent.add(interfaceGroup);

  addLabel("亚基 A：由三级结构转来", new THREE.Vector3(-5.8, 13.5, 8), PROTEIN_MODEL.colors.subunitA, { x: 18, y: -30 });
  if (structureProgress > 2.08) addLabel("亚基 B：靠近并结合", new THREE.Vector3(5.8, 13.5, 8), PROTEIN_MODEL.colors.subunitB, { x: -18, y: -30 });
  addLabel("三级结构 → 四级结构", new THREE.Vector3(0, -12, 8), "#0f172a", { x: 0, y: -18 });
  if (structureProgress > 2.58) addLabel("亚基结合界面", new THREE.Vector3(0, 4.4, 10), PROTEIN_MODEL.colors.interface, { x: 0, y: -38 });
}

function buildProteinCondensationState(THREE, parent, materials, pickables, addLabel, animationItems, progress) {
  const demo = createProteinCondensationDemo(THREE, materials, pickables);
  parent.add(demo.group);
  const bridgeProgress = proteinSmoothStep(clamp((progress - 0.72) / 0.24, 0, 1));
  const primaryStart = proteinLevelPositions(THREE, 0);
  const demoProductCenter = demo.animation.base.leftCa.clone().lerp(demo.animation.base.rightCa, 0.5);
  const primaryStartCenter = primaryStart[0].clone().lerp(primaryStart[1], 0.5);
  const bridgeScale = 0.18;
  const bridgeOffset = primaryStartCenter.clone().sub(demoProductCenter.clone().multiplyScalar(bridgeScale));
  const dynamicLabels = [];
  const addDynamicLabel = (text, color, key, offset3d, screenOffset, lineOpacity = 0.58) => {
    const label = addLabel(text, new THREE.Vector3(), color, screenOffset);
    const line = createProteinDynamicBond(THREE, 0.032, materials.hbond(lineOpacity));
    proteinWebglRegisterPart(line, pickables, "water", text);
    parent.add(line);
    dynamicLabels.push({ text, label, line, key, target: key, offset: offset3d, lineOpacity });
  };
  addDynamicLabel("OH", PROTEIN_MODEL.colors.waterO, "leftOho", new THREE.Vector3(-2.35, 1.1, 1.05), { x: 0, y: 0 });
  addDynamicLabel("H", "#475569", "rightHLeave", new THREE.Vector3(0.25, 2.25, 1.05), { x: 0, y: 0 });
  addDynamicLabel("H2O", PROTEIN_MODEL.colors.waterO, "leftOho", new THREE.Vector3(0, 2.55, 1.2), { x: 0, y: -4 }, 0.68);
  animationItems.push({
    type: "condensationDemo",
    ...demo.animation,
    dynamicLabels,
    bridgeProgress,
    bridgeScale,
    bridgeOffset,
    manualProgress: proteinSmoothStep(clamp(progress / 0.82, 0, 1)),
  });

  const detailLabelOpacity = 1 - proteinSmoothStep(clamp((bridgeProgress - 0.08) / 0.44, 0, 1));
  [
    addLabel("羧基 -COOH", new THREE.Vector3(-2.2, -3.6, 4.2), PROTEIN_MODEL.colors.waterO, { x: 72, y: 46 }),
    addLabel("氨基 -NH2", new THREE.Vector3(4.7, 2.8, 4.2), PROTEIN_MODEL.colors.amino, { x: 82, y: -30 }),
    addLabel("H + OH → H2O", new THREE.Vector3(0, 7.6, 4.8), PROTEIN_MODEL.colors.waterO, { x: 0, y: -36 }),
    addLabel("肽键形成", new THREE.Vector3(-0.8, 0, 4.8), PROTEIN_MODEL.colors.peptide, { x: 0, y: 34 }),
  ].forEach((label) => {
    if (label) label.opacity = detailLabelOpacity;
  });

  const chainOpacity = clamp((progress - 0.62) / 0.2, 0, 1);
  const chainGrowth = proteinSmoothStep(clamp((progress - 0.68) / 0.28, 0, 1));
  if (chainOpacity > 0.01) {
    const connectedChain = createProteinMorphChain(THREE, materials, pickables, {
      fromLevel: 0,
      toLevel: 0,
      fixedProgress: 0,
      showLetters: false,
      colorLevel: 0,
    });
    setProteinMorphChainGrowthOpacity(connectedChain.animation, chainGrowth, chainOpacity * 0.96);
    parent.add(connectedChain.group);
    const bridgeLabel = addLabel("二肽继续脱水缩合，延长为同一条多肽链", new THREE.Vector3(3.2, -5.4, 5.2), PROTEIN_MODEL.colors.amino, { x: 0, y: 34 });
    if (bridgeLabel) bridgeLabel.opacity = chainOpacity;
  }
}

function createProteinReactionGroupGlow(THREE, theme) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const palette = theme === "yellow"
    ? ["rgba(253, 224, 71, 0.72)", "rgba(250, 204, 21, 0.42)", "rgba(234, 179, 8, 0.16)", "rgba(234, 179, 8, 0)"]
    : ["rgba(110, 231, 183, 0.72)", "rgba(52, 211, 153, 0.42)", "rgba(16, 185, 129, 0.16)", "rgba(16, 185, 129, 0)"];
  const gradient = context.createRadialGradient(128, 128, 12, 128, 128, 124);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.5, palette[1]);
  gradient.addColorStop(0.78, palette[2]);
  gradient.addColorStop(1, palette[3]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace || texture.colorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.72,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = -2;
  sprite.userData.texture = texture;
  return sprite;
}

function createProteinCondensationDemo(THREE, materials, pickables) {
  const group = new THREE.Group();
  const carbon = "#64748B";
  const nitrogen = PROTEIN_MODEL.colors.amino;
  const oxygen = PROTEIN_MODEL.colors.waterO;
  const hydrogen = PROTEIN_MODEL.colors.waterH;
  const rLeft = "#A855F7";
  const rRight = "#F97316";

  const base = {
    leftN: new THREE.Vector3(-6.9, 0, 0),
    leftH1: new THREE.Vector3(-6.9, 1.08, 0),
    leftH2: new THREE.Vector3(-7.98, 0, 0),
    leftCa: new THREE.Vector3(-4.8, 0, 0),
    leftR: new THREE.Vector3(-4.8, 1.72, 0),
    leftAlphaH: new THREE.Vector3(-4.8, -1.62, 0),
    leftC: new THREE.Vector3(-2.4, 0, 0),
    leftO: new THREE.Vector3(-2.4, 1.52, 0),
    leftOho: new THREE.Vector3(-1.15, 0, 0),
    leftOhh: new THREE.Vector3(-0.25, 0, 0),
    rightN: new THREE.Vector3(0.15, 0, 0),
    rightHLeave: new THREE.Vector3(0.15, 1.08, 0),
    rightHKeep: new THREE.Vector3(-0.93, 0, 0),
    rightCa: new THREE.Vector3(2.25, 0, 0),
    rightR: new THREE.Vector3(2.25, 1.72, 0),
    rightAlphaH: new THREE.Vector3(2.25, -1.62, 0),
    rightC: new THREE.Vector3(4.65, 0, 0),
    rightO: new THREE.Vector3(4.65, 1.52, 0),
    rightOho: new THREE.Vector3(5.9, 0, 0),
    rightOhh: new THREE.Vector3(6.8, 0, 0),
  };

  const atomSpecs = [
    ["leftN", nitrogen, 0.56, "N", "amino"],
    ["leftH1", hydrogen, 0.34, "H", "amino"],
    ["leftH2", hydrogen, 0.34, "H", "amino"],
    ["leftCa", carbon, 0.64, "C", "amino"],
    ["leftR", rLeft, 0.62, "R", "amino"],
    ["leftAlphaH", hydrogen, 0.34, "H", "amino"],
    ["leftC", carbon, 0.58, "C", "amino"],
    ["leftO", oxygen, 0.5, "O", "amino"],
    ["leftOho", oxygen, 0.5, "O", "water"],
    ["leftOhh", hydrogen, 0.32, "H", "water"],
    ["rightN", nitrogen, 0.56, "N", "amino"],
    ["rightHLeave", hydrogen, 0.34, "H", "water"],
    ["rightHKeep", hydrogen, 0.34, "H", "amino"],
    ["rightCa", carbon, 0.64, "C", "amino"],
    ["rightR", rRight, 0.62, "R", "amino"],
    ["rightAlphaH", hydrogen, 0.34, "H", "amino"],
    ["rightC", carbon, 0.58, "C", "amino"],
    ["rightO", oxygen, 0.5, "O", "amino"],
    ["rightOho", oxygen, 0.5, "O", "amino"],
    ["rightOhh", hydrogen, 0.32, "H", "amino"],
  ];

  const atoms = {};
  atomSpecs.forEach(([key, color, radius, text, part]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 18), materials.residue(color, false));
    const symbol = createDnaWebglTextSprite(THREE, text, "#0f172a");
    symbol.position.set(0, 0.03, radius + 0.08);
    symbol.scale.set(Math.max(0.58, radius * 1.55), Math.max(0.44, radius * 1.12), 1);
    symbol.renderOrder = 32;
    mesh.add(symbol);
    proteinWebglRegisterPart(mesh, pickables, part, text);
    group.add(mesh);
    atoms[key] = mesh;
  });

  const glows = {
    leftCarboxyl: createProteinReactionGroupGlow(THREE, "yellow"),
    rightAmino: createProteinReactionGroupGlow(THREE, "green"),
  };
  glows.leftCarboxyl.scale.set(4.8, 3.4, 1);
  glows.rightAmino.scale.set(3.4, 3.4, 1);
  group.add(glows.leftCarboxyl, glows.rightAmino);

  const bondSpecs = [
    ["leftN", "leftH1"],
    ["leftN", "leftH2"],
    ["leftN", "leftCa"],
    ["leftCa", "leftR"],
    ["leftCa", "leftAlphaH"],
    ["leftCa", "leftC"],
    ["leftC", "leftO"],
    ["leftC", "leftOho", "breakOh"],
    ["leftOho", "leftOhh"],
    ["rightN", "rightHLeave", "breakH"],
    ["rightN", "rightHKeep"],
    ["rightN", "rightCa"],
    ["rightCa", "rightR"],
    ["rightCa", "rightAlphaH"],
    ["rightCa", "rightC"],
    ["rightC", "rightO"],
    ["rightC", "rightOho"],
    ["rightOho", "rightOhh"],
    ["leftOho", "rightHLeave", "waterBond"],
    ["leftC", "rightN", "peptide"],
  ];

  const bonds = bondSpecs.map(([start, end, role]) => {
    const radius = role === "peptide" ? 0.16 : 0.075;
    const material = role === "peptide" ? materials.peptide(true) : role === "waterBond" ? materials.waterO() : materials.loop("#94A3B8", false);
    const mesh = createProteinDynamicBond(THREE, radius, material);
    proteinWebglRegisterPart(mesh, pickables, role === "peptide" ? "peptide" : "amino");
    group.add(mesh);
    return { mesh, start, end, role };
  });

  const animation = {
    group,
    base,
    atoms,
    bonds,
    glows,
    rightKeys: new Set(["rightN", "rightHKeep", "rightCa", "rightR", "rightAlphaH", "rightC", "rightO", "rightOho", "rightOhh"]),
  };
  updateProteinCondensationDemo(THREE, { ...animation, manualProgress: 0 }, 0);
  return { group, animation };
}

function updateProteinCondensationDemo(THREE, item) {
  const progress = clamp(item.manualProgress ?? 0, 0, 1);
  const bridgeProgress = item.bridgeProgress ?? 0;
  const detailOpacity = 1 - proteinSmoothStep(clamp((bridgeProgress - 0.12) / 0.42, 0, 1));
  const release = proteinSmoothStep(clamp((progress - 0.16) / 0.44, 0, 1));
  const approach = proteinSmoothStep(clamp((progress - 0.08) / 0.48, 0, 1));
  const waterOpacity = clamp((progress - 0.42) / 0.26, 0, 1);
  const peptideOpacity = clamp((progress - 0.5) / 0.28, 0, 1);
  const breakOpacity = 1 - clamp((progress - 0.2) / 0.26, 0, 1);
  const rightShift = new THREE.Vector3(4.0 * (1 - approach), 0, 0);
  const waterO = new THREE.Vector3(-0.35, 4.75, 2.15);
  const waterH1 = waterO.clone().add(new THREE.Vector3(-0.78, 0.78, 0));
  const waterH2 = waterO.clone().add(new THREE.Vector3(0.78, 0.78, 0));
  const positions = {};

  Object.entries(item.base).forEach(([key, value]) => {
    positions[key] = value.clone();
    if (item.rightKeys.has(key)) positions[key].add(rightShift);
  });
  positions.leftOho = item.base.leftOho.clone().lerp(waterO, release);
  positions.leftOhh = item.base.leftOhh.clone().lerp(waterH1, release);
  positions.rightHLeave = item.base.rightHLeave.clone().add(rightShift).lerp(waterH2, release);

  if (item.group && item.bridgeOffset) {
    const scale = proteinLerp(1, item.bridgeScale ?? 1, bridgeProgress);
    item.group.position.copy(new THREE.Vector3().lerp(item.bridgeOffset, bridgeProgress));
    item.group.scale.setScalar(scale);
    item.group.updateMatrix();
  }

  Object.entries(item.atoms).forEach(([key, mesh]) => {
    mesh.position.copy(positions[key]);
  });

  if (item.glows) {
    const average = (keys) => keys.reduce((center, key) => center.add(positions[key]), new THREE.Vector3()).multiplyScalar(1 / keys.length);
    item.glows.leftCarboxyl.position.copy(average(["leftC", "leftO", "leftOho", "leftOhh"]));
    item.glows.rightAmino.position.copy(average(["rightN", "rightHLeave", "rightHKeep"]));
    const glowOpacity = detailOpacity * proteinLerp(0.72, 0.38, release);
    item.glows.leftCarboxyl.material.opacity = glowOpacity;
    item.glows.rightAmino.material.opacity = glowOpacity;
  }

  item.bonds.forEach((bond) => {
    updateProteinDynamicBond(THREE, bond.mesh, positions[bond.start], positions[bond.end]);
    let opacity = 1;
    if (bond.role === "breakOh" || bond.role === "breakH") opacity = breakOpacity;
    if (bond.role === "waterBond") opacity = waterOpacity;
    if (bond.role === "peptide") opacity = peptideOpacity;
    setProteinObjectOpacity(bond.mesh, opacity);
  });

  item.dynamicLabels?.forEach((label) => {
    const target = positions[label.target] || positions[label.key];
    if (!target) return;
    const anchorPosition = target.clone().add(label.offset);
    const displayedTarget = item.group ? target.clone().applyMatrix4(item.group.matrix) : target;
    const displayedAnchor = item.group ? anchorPosition.clone().applyMatrix4(item.group.matrix) : anchorPosition;
    const opacity = label.label ? (label.text === "H2O" ? waterOpacity : 1) * detailOpacity : 0;
    if (label.label?.anchor) {
      label.label.anchor.position.copy(displayedAnchor);
      label.label.opacity = opacity;
    }
    if (label.line) {
      updateProteinDynamicBond(THREE, label.line, displayedTarget, displayedAnchor);
      setProteinObjectOpacity(label.line, opacity * (label.lineOpacity ?? 0.58));
    }
  });
}

function createProteinMorphChain(THREE, materials, pickables, options = {}) {
  const group = new THREE.Group();
  const fromLevel = options.fromLevel ?? 0;
  const toLevel = options.toLevel ?? fromLevel;
  const fromPoints = proteinLevelPositions(THREE, fromLevel);
  const toPoints = proteinLevelPositions(THREE, toLevel);
  const spheres = [];
  const bonds = [];
  const letters = [];
  const targetLevel = options.colorLevel ?? Math.max(fromLevel, toLevel);

  PROTEIN_MODEL.residues.forEach((residue, index) => {
    const segment = proteinMorphSegment(index, targetLevel, options);
    const focus = proteinWebglPartFocused(segment.part);
    const radius = options.part === "subunit" ? 0.5 : targetLevel === 0 ? 0.58 : targetLevel >= 2 ? 0.56 : 0.5;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), materials.residue(segment.color, focus));
    proteinWebglRegisterPart(sphere, pickables, segment.part, `${residue[0]} / ${residue[1]}`);
    group.add(sphere);
    spheres.push({ mesh: sphere, radius });

    if (options.showLetters && (index === 0 || index === PROTEIN_MODEL.residues.length - 1 || index % 5 === 0)) {
      const letter = createDnaWebglTextSprite(THREE, residue[1], residue[2]);
      letter.scale.set(1.0, 0.72, 1);
      proteinWebglRegisterPart(letter, pickables, "amino", `${residue[0]} / ${residue[1]}`);
      group.add(letter);
      letters[index] = { sprite: letter, radius };
    }
  });

  for (let index = 1; index < PROTEIN_MODEL.residues.length; index += 1) {
    const segment = proteinMorphBondSegment(index, targetLevel, options);
    const radius = options.part === "subunit" ? 0.065 : targetLevel === 0 ? 0.06 : targetLevel >= 2 ? 0.085 : 0.075;
    const bond = createProteinDynamicBond(THREE, radius, proteinMorphBondMaterial(materials, segment.part, segment.color));
    proteinWebglRegisterPart(bond, pickables, segment.part === "amino" ? "peptide" : segment.part);
    group.add(bond);
    bonds.push({ mesh: bond, startIndex: index - 1, endIndex: index });
  }

  const animation = {
    type: "morphChain",
    group,
    fromPoints,
    toPoints,
    spheres,
    bonds,
    letters,
    mirror: Boolean(options.mirror),
    baseScale: options.baseScale || 1,
    startOffset: options.startOffset || new THREE.Vector3(),
    endOffset: options.endOffset || new THREE.Vector3(),
    fixedProgress: options.fixedProgress,
    speed: options.speed,
    phase: options.phase,
    moveAsSubunit: Boolean(options.moveAsSubunit),
  };

  const initialShape = options.fixedProgress ?? 0;
  const initialMove = options.moveAsSubunit ? 0 : initialShape;
  updateProteinMorphChain(THREE, animation, initialShape, initialMove);
  return { group, animation };
}

function proteinSmoothStep(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - t * 2);
}

function proteinInterpolatedChainPositions(THREE, progress) {
  const clamped = clamp(progress, 0, 2);
  const fromLevel = clamped < 1 ? 0 : 1;
  const toLevel = clamped < 1 ? 1 : 2;
  const local = proteinSmoothStep(clamped - fromLevel);
  const fromPoints = proteinLevelPositions(THREE, fromLevel);
  const toPoints = proteinLevelPositions(THREE, toLevel);
  return fromPoints.map((point, index) => point.clone().lerp(toPoints[index], local));
}

function proteinLevelPositions(THREE, level) {
  const count = PROTEIN_MODEL.residues.length;
  const ranges = proteinStructureRanges(count);
  if (level === 0) {
    return PROTEIN_MODEL.residues.map((residue, index) => {
      const x = (index - (count - 1) / 2) * 0.9;
      const y = Math.sin(index * 0.5) * 1.15 + Math.sin(index * 0.15) * 0.55;
      const z = Math.cos(index * 0.42) * 0.78;
      return new THREE.Vector3(x, y, z);
    });
  }

  if (level === 1) {
    const points = [];
    for (let index = 0; index < count; index += 1) {
      if (index < ranges.helixCount) {
        const angle = index * 1.24;
        const y = -12.5 + index * (25 / Math.max(1, ranges.helixCount - 1));
        points.push(new THREE.Vector3(-20 + Math.cos(angle) * 2.25, y, Math.sin(angle) * 2.25));
        continue;
      }

      if (index < ranges.sheetStart) {
        const local = (index - ranges.loopStart) / Math.max(1, ranges.loopCount - 1);
        const x = -17.5 + local * 22.5;
        const y = 12.8 - local * 2.4 + Math.sin(local * Math.PI) * 2.2;
        const z = Math.cos(local * Math.PI * 1.4) * 1.25;
        points.push(new THREE.Vector3(x, y, z));
        continue;
      }

      const sheetLocal = index - ranges.sheetStart;
      const strand = Math.min(ranges.strandCount - 1, Math.floor(sheetLocal / ranges.strandLength));
      const strandSize = proteinBetaStrandSize(ranges, strand);
      const pos = sheetLocal - strand * ranges.strandLength;
      const local = pos / Math.max(1, strandSize - 1);
      const x = 4.5 + strand * 7.0;
      const y = strand % 2 === 0 ? 12 - local * 24 : -12 + local * 24;
      const z = (strand - 1) * 1.35 + (pos % 2 === 0 ? 0.55 : -0.55);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }

  const points = [];
  for (let index = 0; index < count; index += 1) {
    if (index < ranges.helixCount) {
      const angle = index * 1.2;
      const y = 3.0 + (index - (ranges.helixCount - 1) / 2) * 0.4;
      points.push(new THREE.Vector3(-4.4 + Math.cos(angle) * 1.55, y, 0.35 + Math.sin(angle) * 1.55));
      continue;
    }

    if (index < ranges.sheetStart) {
      const local = (index - ranges.loopStart) / Math.max(1, ranges.loopCount - 1);
      const x = -4.2 + local * 1.35 + Math.sin(local * Math.PI) * 0.65;
      const y = 6.7 - local * 0.25 + Math.sin(local * Math.PI) * 0.9;
      const z = 0.45 - local * 1.45 + Math.cos(local * Math.PI) * 0.65;
      points.push(new THREE.Vector3(x, y, z));
      continue;
    }

    const sheetLocal = index - ranges.sheetStart;
    const strand = Math.min(ranges.strandCount - 1, Math.floor(sheetLocal / ranges.strandLength));
    const strandSize = proteinBetaStrandSize(ranges, strand);
    const pos = sheetLocal - strand * ranges.strandLength;
    const local = pos / Math.max(1, strandSize - 1);
    const wave = sheetLocal * 0.28;
    const wrapAngle = -0.85 + strand * 0.85;
    const x = -4.4 + Math.cos(wrapAngle) * 2.55 + Math.sin(wave) * 0.38;
    const y = strand % 2 === 0 ? 6.4 - local * 7.8 : -1.4 + local * 7.8;
    const z = 0.35 + Math.sin(wrapAngle) * 2.05 + Math.cos(wave * 0.8) * 0.38;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function proteinStructureRanges(count = PROTEIN_MODEL.residues.length) {
  const helixCount = Math.min(Math.max(18, Math.round(count * 0.36)), count - 20);
  const loopCount = Math.min(Math.max(6, Math.round(count * 0.13)), count - helixCount - 12);
  const sheetStart = helixCount + loopCount;
  const sheetCount = Math.max(0, count - sheetStart);
  const strandCount = 3;
  const strandLength = Math.ceil(sheetCount / strandCount) || 1;
  return {
    helixCount,
    helixEnd: helixCount - 1,
    loopStart: helixCount,
    loopCount,
    loopEnd: sheetStart - 1,
    sheetStart,
    sheetCount,
    sheetEnd: count - 1,
    strandCount,
    strandLength,
  };
}

function proteinBetaStrandSize(ranges, strand) {
  return Math.max(0, Math.min(ranges.strandLength, ranges.sheetCount - strand * ranges.strandLength));
}

function proteinMorphSegment(index, level, options = {}) {
  const ranges = proteinStructureRanges();
  if (options.part) {
    return { part: options.part, color: options.colorTint || PROTEIN_MODEL.colors.subunitA };
  }
  if (level <= 0) {
    return { part: "amino", color: PROTEIN_MODEL.residues[index][2] };
  }
  if (index <= ranges.helixEnd) {
    return { part: "helix", color: PROTEIN_MODEL.colors.helix };
  }
  if (index >= ranges.sheetStart) {
    return { part: "sheet", color: PROTEIN_MODEL.colors.sheet };
  }
  return { part: level >= 2 ? "tertiary" : "loop", color: level >= 2 ? PROTEIN_MODEL.colors.tertiary : PROTEIN_MODEL.colors.loop };
}

function proteinMorphBondSegment(index, level, options = {}) {
  const ranges = proteinStructureRanges();
  if (options.part) {
    return { part: options.part, color: options.colorTint || PROTEIN_MODEL.colors.subunitA };
  }
  if (level <= 0) {
    return { part: "peptide", color: PROTEIN_MODEL.colors.peptide };
  }
  if (index <= ranges.helixEnd) {
    return { part: "helix", color: PROTEIN_MODEL.colors.helix };
  }
  if (index > ranges.sheetStart) {
    return { part: "sheet", color: PROTEIN_MODEL.colors.sheet };
  }
  return { part: level >= 2 ? "tertiary" : "loop", color: level >= 2 ? PROTEIN_MODEL.colors.tertiary : PROTEIN_MODEL.colors.loop };
}

function proteinMorphBondMaterial(materials, part, color) {
  if (part === "helix") return materials.helix(proteinWebglPartFocused("helix"));
  if (part === "sheet") return materials.sheet(proteinWebglPartFocused("sheet"));
  if (part === "tertiary" || part === "loop" || part === "subunit") return materials.loop(color, proteinWebglPartFocused(part));
  return materials.peptide(proteinWebglPartFocused("peptide"));
}

function createProteinDynamicBond(THREE, radius, material) {
  const geometry = new THREE.CylinderGeometry(radius, radius, 1, 14);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.dynamicProteinBond = true;
  return mesh;
}

function updateProteinDynamicBond(THREE, mesh, start, end) {
  const vector = end.clone().sub(start);
  const length = vector.length();
  mesh.visible = length > 0.001;
  if (!mesh.visible) return;
  mesh.position.copy(start.clone().lerp(end, 0.5));
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.normalize());
}

function updateProteinMorphChain(THREE, item, shapeProgress, moveProgress = shapeProgress) {
  const offset = item.startOffset.clone().lerp(item.endOffset, moveProgress);
  const points = item.fromPoints.map((fromPoint, index) => {
    const point = fromPoint.clone().lerp(item.toPoints[index], shapeProgress);
    return proteinMorphTransformPoint(THREE, point, {
      mirror: item.mirror,
      baseScale: item.baseScale,
      offset,
    });
  });

  points.forEach((point, index) => {
    item.spheres[index].mesh.position.copy(point);
    const letter = item.letters[index];
    if (letter) {
      letter.sprite.position.copy(point.clone().add(new THREE.Vector3(0, 0.1, letter.radius + 0.42)));
    }
  });

  item.bonds.forEach((bond) => {
    updateProteinDynamicBond(THREE, bond.mesh, points[bond.startIndex], points[bond.endIndex]);
  });
}

function setProteinMorphChainGrowthOpacity(item, growthProgress, opacity = 1) {
  const count = item.spheres.length;
  const visibleHead = 2 + clamp(growthProgress, 0, 1) * Math.max(0, count - 2);
  item.spheres.forEach((sphere, index) => {
    setProteinObjectOpacity(sphere.mesh, opacity * clamp(visibleHead - index, 0, 1));
  });
  item.bonds.forEach((bond, index) => {
    setProteinObjectOpacity(bond.mesh, opacity * clamp(visibleHead - (index + 1), 0, 1));
  });
  item.letters.forEach((letter, index) => {
    if (letter) setProteinObjectOpacity(letter.sprite, opacity * clamp(visibleHead - index, 0, 1));
  });
}

function proteinMorphTransformPoint(THREE, point, options = {}) {
  const transformed = point.clone();
  if (options.mirror) {
    transformed.x *= -1;
    transformed.z *= -1;
  }
  transformed.multiplyScalar(options.baseScale || 1);
  transformed.add(options.offset || new THREE.Vector3());
  return transformed;
}

function proteinTransformPointList(THREE, points, options = {}) {
  return points.map((point) => proteinMorphTransformPoint(THREE, point, options));
}

function addProteinPrimaryProcess(THREE, parent, materials, pickables, addLabel, animationItems) {
  const points = proteinLevelPositions(THREE, 0);
  const bondStart = points[5];
  const bondEnd = points[6];
  const bondMid = bondStart.clone().lerp(bondEnd, 0.5);
  const pulseBond = dnaWebglBond(THREE, bondStart, bondEnd, 0.18, materials.peptide(true));
  pulseBond.material.transparent = true;
  pulseBond.material.opacity = 0.72;
  proteinWebglRegisterPart(pulseBond, pickables, "peptide");
  parent.add(pulseBond);
  animationItems.push({ type: "pulse", object: pulseBond });

  const waterStart = bondMid.clone().add(new THREE.Vector3(0, 3.0, 0));
  const waterEnd = waterStart.clone().add(new THREE.Vector3(0, 10.8, 7.2));
  const water = createProteinWaterMolecule(THREE, materials);
  water.position.copy(waterStart);
  proteinWebglRegisterPart(water, pickables, "water");
  parent.add(water);
  animationItems.push({ type: "water", group: water, start: waterStart, end: waterEnd });

  const arrow = dnaWebglDashedBond(THREE, waterStart.clone().add(new THREE.Vector3(0, 0.8, 0)), waterEnd.clone().add(new THREE.Vector3(0, -1.35, 0)), 0.035, materials.hbond(0.52));
  parent.add(arrow);
  addLabel("肽键形成", bondMid, PROTEIN_MODEL.colors.peptide, { x: 92, y: 28 });
  addLabel("脱水缩合释放 H2O", waterEnd, PROTEIN_MODEL.colors.waterO, { x: 0, y: -34 });
}

function createProteinSecondaryGuides(THREE, materials, pickables, points, options = {}) {
  const group = new THREE.Group();
  const ranges = proteinStructureRanges(points.length);
  const opacity = options.opacity ?? 0.32;
  const helixMaterial = materials.secondaryGuide(PROTEIN_MODEL.colors.helixGuide, opacity);
  const sheetMaterial = materials.secondaryGuide(PROTEIN_MODEL.colors.sheetGuide, opacity);

  const helixPoints = points.slice(0, ranges.helixCount);
  if (helixPoints.length > 4) {
    const helixGuide = proteinGuideTube(THREE, helixPoints, 0.72, helixMaterial);
    proteinWebglRegisterPart(helixGuide, pickables, "helix");
    group.add(helixGuide);
  }

  for (let strand = 0; strand < ranges.strandCount - 1; strand += 1) {
    const sheetPlane = createProteinBetaSheetPlane(THREE, ranges, points, strand, strand + 1, sheetMaterial);
    if (!sheetPlane) continue;
    proteinWebglRegisterPart(sheetPlane, pickables, "sheet");
    group.add(sheetPlane);
  }

  return group;
}

function createProteinBetaSheetPlane(THREE, ranges, points, strandA, strandB, material) {
  const strandSizeA = proteinBetaStrandSize(ranges, strandA);
  const strandSizeB = proteinBetaStrandSize(ranges, strandB);
  const pairCount = Math.min(strandSizeA, strandSizeB);
  if (pairCount < 2) return null;

  const startA = ranges.sheetStart + strandA * ranges.strandLength;
  const startB = ranges.sheetStart + strandB * ranges.strandLength;
  const vertices = [];
  const indices = [];

  for (let pos = 0; pos < pairCount; pos += 1) {
    const pointA = points[startA + pos];
    const pointB = points[startB + (pairCount - 1 - pos)];
    if (!pointA || !pointB) return null;
    const center = pointA.clone().lerp(pointB, 0.5);
    const pleat = Math.sin(pos * Math.PI * 0.5) * 0.28;
    const liftedA = pointA.clone().lerp(center, 0.08).add(new THREE.Vector3(0, 0, pleat));
    const liftedB = pointB.clone().lerp(center, 0.08).add(new THREE.Vector3(0, 0, -pleat));
    vertices.push(liftedA.x, liftedA.y, liftedA.z, liftedB.x, liftedB.y, liftedB.z);
  }

  for (let pos = 0; pos < pairCount - 1; pos += 1) {
    const a0 = pos * 2;
    const b0 = a0 + 1;
    const a1 = a0 + 2;
    const b1 = a0 + 3;
    indices.push(a0, b0, a1, b0, b1, a1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const plane = new THREE.Mesh(geometry, material.clone());
  plane.renderOrder = 2;
  return plane;
}

function proteinGuideTube(THREE, points, radius, material) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => point.clone()));
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(24, points.length * 5), radius, 10, false), material.clone());
  tube.renderOrder = 2;
  return tube;
}

function createProteinSecondaryHydrogenBonds(THREE, materials, pickables, points = proteinLevelPositions(THREE, 1)) {
  const group = new THREE.Group();
  const ranges = proteinStructureRanges(points.length);
  const pairs = [];
  for (let index = 0; index <= ranges.helixEnd - 4; index += 2) {
    pairs.push([index, index + 4]);
  }
  for (let strand = 0; strand < ranges.strandCount - 1; strand += 1) {
    const strandSize = proteinBetaStrandSize(ranges, strand);
    const nextSize = proteinBetaStrandSize(ranges, strand + 1);
    const maxPair = Math.min(strandSize, nextSize);
    for (let pos = 1; pos < maxPair - 1; pos += 2) {
      const current = ranges.sheetStart + strand * ranges.strandLength + pos;
      const next = ranges.sheetStart + (strand + 1) * ranges.strandLength + (maxPair - 1 - pos);
      pairs.push([current, next]);
    }
  }

  pairs.forEach(([startIndex, endIndex]) => {
    if (!points[startIndex] || !points[endIndex]) return;
    const hbond = dnaWebglDashedBond(THREE, points[startIndex], points[endIndex], 0.03, materials.hbond(0.56));
    proteinWebglRegisterPart(hbond, pickables, "hbond");
    group.add(hbond);
  });
  return group;
}

function createProteinTertiaryInteractions(THREE, materials, pickables, points) {
  const group = new THREE.Group();
  const ranges = proteinStructureRanges(points.length);
  const safeIndex = (index) => Math.max(0, Math.min(points.length - 1, index));
  const sideChainBond = (startIndex, endIndex, material, radius, dashed = false) => {
    const start = points[safeIndex(startIndex)];
    const end = points[safeIndex(endIndex)];
    const midpoint = start.clone().lerp(end, 0.5);
    const sideA = start.clone().lerp(midpoint, 0.58);
    const sideB = end.clone().lerp(midpoint, 0.58);
    group.add(dnaWebglBond(THREE, start, sideA, 0.045, materials.loop(PROTEIN_MODEL.colors.loop, false)));
    group.add(dnaWebglBond(THREE, end, sideB, 0.045, materials.loop(PROTEIN_MODEL.colors.loop, false)));
    const interaction = dashed
      ? dnaWebglDashedBond(THREE, sideA, sideB, radius, material)
      : dnaWebglBond(THREE, sideA, sideB, radius, material);
    proteinWebglRegisterPart(interaction, pickables, "interaction");
    group.add(interaction);
  };

  sideChainBond(Math.round(ranges.helixEnd * 0.25), ranges.sheetStart + ranges.strandLength * 2 + 3, materials.disulfide(proteinWebglPartFocused("interaction")), 0.075);
  sideChainBond(Math.round(ranges.helixEnd * 0.62), ranges.sheetStart + ranges.strandLength + 5, materials.ionic(0.64), 0.035, true);
  sideChainBond(ranges.loopStart + 2, ranges.sheetEnd - 4, materials.ionic(0.54), 0.032, true);

  [
    Math.round(ranges.helixEnd * 0.38),
    Math.round(ranges.helixEnd * 0.78),
    ranges.sheetStart + 4,
    ranges.sheetStart + ranges.strandLength + 4,
    ranges.sheetEnd - 5,
  ].forEach((index) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.48, 22, 14), materials.hydrophobic(proteinWebglPartFocused("interaction")));
    mesh.position.copy(points[safeIndex(index)].clone().add(new THREE.Vector3(0.7, -0.4, 0.65)));
    proteinWebglRegisterPart(mesh, pickables, "interaction");
    group.add(mesh);
  });
  return group;
}

function createProteinInterfaceBonds(THREE, materials, pickables, options = {}) {
  const group = new THREE.Group();
  const points = proteinLevelPositions(THREE, 2);
  const ranges = proteinStructureRanges(points.length);
  const offsetA = options.offsetA || new THREE.Vector3(0.9, 0, 0);
  const offsetB = options.offsetB || new THREE.Vector3(-1.1, 0.35, 0.2);
  const scaleA = options.scaleA ?? 0.76;
  const scaleB = options.scaleB ?? 0.76;
  const aPoint = (index) => proteinMorphTransformPoint(THREE, points[index], { baseScale: scaleA, offset: offsetA });
  const bPoint = (index) => proteinMorphTransformPoint(THREE, points[index], { baseScale: scaleB, offset: offsetB, mirror: true });
  [
    [Math.round(ranges.helixEnd * 0.55), ranges.sheetStart + ranges.strandLength * 2 + 2],
    [ranges.loopStart + 2, ranges.loopStart + 2],
    [ranges.sheetEnd - 4, Math.round(ranges.helixEnd * 0.25)],
  ].forEach(([aIndex, bIndex]) => {
    const bond = dnaWebglDashedBond(THREE, aPoint(aIndex), bPoint(bIndex), 0.038, materials.interface(0.72));
    proteinWebglRegisterPart(bond, pickables, "interface");
    group.add(bond);
  });
  return group;
}

function createProteinWaterMolecule(THREE, materials) {
  const group = new THREE.Group();
  const oxygen = new THREE.Mesh(new THREE.SphereGeometry(0.64, 28, 18), materials.waterO());
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), materials.waterH());
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), materials.waterH());
  h1.position.set(-0.72, 0.72, 0);
  h2.position.set(0.72, 0.72, 0);
  group.add(oxygen, h1, h2);
  group.add(dnaWebglBond(THREE, new THREE.Vector3(0, 0, 0), h1.position, 0.045, materials.waterO()));
  group.add(dnaWebglBond(THREE, new THREE.Vector3(0, 0, 0), h2.position, 0.045, materials.waterO()));
  return group;
}

function proteinWebglMaterials(THREE) {
  const white = new THREE.Color(0xffffff);
  const material = (hex, focus = false, options = {}) =>
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hex).lerp(white, focus ? 0.02 : options.mix ?? 0.1),
      roughness: options.roughness ?? 0.36,
      metalness: 0.02,
      clearcoat: options.clearcoat ?? 0.42,
      clearcoatRoughness: 0.32,
      transparent: options.opacity !== undefined,
      opacity: options.opacity ?? 1,
      depthWrite: options.depthWrite ?? true,
      side: THREE.DoubleSide,
      emissive: focus ? new THREE.Color(0xf59e0b) : new THREE.Color(0x000000),
      emissiveIntensity: focus ? 0.12 : 0,
    });

  return {
    residue: (hex, focus = false) => material(hex, focus, { roughness: 0.3, clearcoat: 0.64, mix: 0.08 }),
    peptide: (focus = false) => material(PROTEIN_MODEL.colors.peptide, focus, { roughness: 0.34, mix: 0.07 }),
    waterO: () => material(PROTEIN_MODEL.colors.waterO, false, { roughness: 0.26, clearcoat: 0.7, mix: 0.04 }),
    waterH: () => material(PROTEIN_MODEL.colors.waterH, false, { roughness: 0.24, clearcoat: 0.7, mix: 0 }),
    helix: (focus = false) => material(PROTEIN_MODEL.colors.helix, focus, { roughness: 0.32, clearcoat: 0.55, mix: 0.06 }),
    sheet: (focus = false) => material(PROTEIN_MODEL.colors.sheet, focus, { roughness: 0.34, clearcoat: 0.48, mix: 0.08 }),
    secondaryGuide: (hex, opacity = 0.5) => material(hex, false, { roughness: 0.24, clearcoat: 0.42, opacity, depthWrite: false, mix: 0.02 }),
    loop: (hex, focus = false) => material(hex, focus, { roughness: 0.42, clearcoat: 0.32, mix: 0.12 }),
    hbond: (opacity = 0.45) => material(PROTEIN_MODEL.colors.hbond, false, { roughness: 0.5, opacity, mix: 0.04 }),
    disulfide: (focus = false) => material(PROTEIN_MODEL.colors.disulfide, focus, { roughness: 0.28, clearcoat: 0.62, mix: 0.06 }),
    ionic: (opacity = 0.55) => material(PROTEIN_MODEL.colors.ionic, false, { roughness: 0.45, opacity, mix: 0.04 }),
    hydrophobic: (focus = false) => material(PROTEIN_MODEL.colors.hydrophobic, focus, { roughness: 0.46, clearcoat: 0.22, mix: 0.16 }),
    interface: (opacity = 0.7) => material(PROTEIN_MODEL.colors.interface, false, { roughness: 0.38, opacity, mix: 0.04 }),
    process: (hex, opacity = 0.55) => material(hex, false, { roughness: 0.38, opacity, mix: 0.04 }),
  };
}

function proteinWebglRegisterPart(object, pickables, part, label = "") {
  object.traverse?.((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData = { ...child.userData, proteinPart: child.userData.proteinPart || part, proteinLabel: label };
      pickables.push(child);
    }
  });
  if ((object.isMesh || object.isSprite) && !object.userData?.proteinPart) {
    object.userData = { ...object.userData, proteinPart: part, proteinLabel: label };
    pickables.push(object);
  }
  return object;
}

function proteinWebglPartFocused(part) {
  const focus = proteinFocusTags();
  if (state.practice && part === "peptide") return true;
  return focus.includes(part);
}

function proteinFocusTags() {
  if (state.stageIndex === 0) return ["amino", "peptide", "water"];
  if (state.stageIndex === 1) return ["amino", "peptide"];
  if (state.stageIndex === 2) return ["helix", "sheet", "hbond"];
  if (state.stageIndex === 3) return ["tertiary", "interaction", "helix", "sheet"];
  return ["subunit", "interface"];
}

function dnaWebglQuaternionFromCamera(THREE, theta, phi) {
  const pitch = phi - Math.PI / 2;
  const matrix = new THREE.Matrix4().makeRotationY(-theta);
  matrix.premultiply(new THREE.Matrix4().makeRotationX(pitch));
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
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
  id: "protein-webgl",
  visual: () => proteinWebglVisual(),
  mount: () => { mountProteinWebgl(); },
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
  if (message.type === "host:play") startProteinPlayback();
  if (message.type === "host:pause") pauseProteinPlayback();
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
    if (currentModel().visual === "proteinWebgl") {
      if (state.playing) pauseProteinPlayback();
      else startProteinPlayback();
    }
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
    if (currentModel().visual !== "proteinWebgl") state.playing = !state.playing;
  }
  if (action === "reset") return resetState();
  if (action === "prev") return setStage(state.stageIndex - 1);
  if (action === "next") return setStage(state.stageIndex + 1);
  if (action === "speed") {
    const now = performance.now() * 0.001;
    const proteinProgress = state.playing && currentModel().visual === "proteinWebgl" ? proteinPlaybackProgress(now) : null;
    state.speedIndex = (state.speedIndex + 1) % speeds.length;
    if (proteinProgress !== null) {
      state.proteinProgress = proteinProgress;
      state.proteinPlayStartProgress = proteinProgress;
      state.proteinPlayStartTime = now;
    }
  }
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
  const layout=refs.stage.querySelector('.dna-webgl-stack');layout.classList.add('structure-layout');
  const scene=refs.stage.querySelector('[data-protein-webgl-shell]');scene.classList.add('structure-scene');
  let info=refs.stage.querySelector('.protein-webgl-sidecar');
  if(!info){info=document.createElement('aside');layout.append(info);}info.classList.add('structure-info');info.setAttribute('aria-label','结构与说明');
  info.append(root.querySelector('[data-protein-webgl-stage-note]'),root.querySelector('[data-protein-webgl-state-control]'));
  const input=root.querySelector('[data-protein-webgl-progress]');const timeline=root.querySelector('.structure-timeline');timeline.insertBefore(input,timeline.querySelector('output'));input.setAttribute('data-timeline','');
  const summary=document.createElement('section');summary.className='structure-stage-summary';summary.innerHTML='<h2 data-structure-stage-title></h2><p data-structure-stage-description></p>';info.prepend(summary);
  const trigger=document.createElement('button');trigger.type='button';trigger.className='shell-action structure-context-trigger';trigger.dataset.structureContext='';trigger.textContent='结构与说明 ↗';layout.append(trigger);
  trigger.addEventListener('click',event=>openStructureContext(event.currentTarget));
  let feedback=root.querySelector('[data-protein-webgl-feedback]');if(!feedback){feedback=document.createElement('p');feedback.setAttribute('data-protein-webgl-feedback','');scene.append(feedback);}feedback.classList.add('structure-feedback');feedback.setAttribute('aria-live','polite');
}
function syncStructureInfo(){
  const title=root.querySelector('[data-structure-stage-title]'),description=root.querySelector('[data-structure-stage-description]');
  if(title)title.textContent=currentStage().title;if(description)description.textContent=currentStage().explanation;
  
}
function openStructureContext(trigger){shellExperience?.showPanel(root.querySelector('.structure-info'),'结构与说明',trigger);}
function mountStructureExperience(){
 if(shellExperience)return;const shell=globalThis.AnderModelShell;
 const help='<p>单指或鼠标左键拖动旋转；双指移动或鼠标右键拖动平移；双指捏合或滚轮缩放。点选结构查看名称，点“结构与说明”查看阶段说明和模型参数。</p><p>播放连续展示蛋白质结构形成过程；拖动底部进度条暂停并定位到对应画面。重置回到第一阶段和默认观察状态。</p><p>沉浸模式放大画面，松手 2 秒后收起上下控件，轻触唤出；操作面板时保持显示。收藏由打开模型的网站提供。</p>';
 const onSettings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'还原视角',run:()=>{state.viewIndex=0;state.proteinWebglViewIndex=-1;render();shellExperience.closeDialog();}}]);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();else shellExperience.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);};
 shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('[data-protein-webgl-viewport]'),title:ANDER_MODEL_MANIFEST.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'结构与说明',onSettings,onContext:openStructureContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>structureRuntime?.resize())});
 shell.setExtra(root.querySelector('[data-structure-settings]'),'settings','显示与操作');root.querySelector('[data-structure-settings]').addEventListener('click',event=>onSettings(event.currentTarget));
 root.querySelector('.independent-model-back').addEventListener('click',event=>{event.preventDefault();onReturn();});
 shellExperience.setSceneStatus(structureRuntime?'ready':'loading');
 globalThis.StructureSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...cloneValue(state),shell:shellExperience.getState(),ready:!!structureRuntime})});
}

// Screen-space label placement adapted from animal-cell@2.2.2. Scientific anchors stay fixed.
function placeStructureLabels(THREE,items,camera,host,layer){
 layer.hidden=!state.labels;if(!state.labels)return;
 const rect=host.getBoundingClientRect(),width=rect.width,height=rect.height,occupied=[{x:0,y:height-66,width:68,height:66}];
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
