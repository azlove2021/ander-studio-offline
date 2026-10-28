"use strict";

const ANDER_MODEL_CONTENT = {"id":"dna-webgl","accent":"#0EA5E9","title":"DNA 双螺旋结构（WebGL 重建版）","titleEn":"DNA Double Helix / WebGL Rebuild","chapter":"遗传信息的分子基础 / Molecular Basis of Inheritance","type":"3D WebGL 动态模型","state":"真实三维深度","visual":"dnaWebgl","structures":[["磷酸球形 Phosphate","#06B6D4"],["脱氧核糖五边形 Deoxyribose","#F59E0B"],["糖中碳原子 Sugar C","#475569"],["糖中氧原子 Sugar O","#EF4444"],["A/G 嘌呤双环 Purines","#22C55E"],["C/T 嘧啶单环 Pyrimidines","#A855F7"],["3',5'-磷酸二酯键 Phosphodiester","#2563EB"],["氢键 Hydrogen Bonds","#94A3B8"]],"stages":[{"title":"整体观察","titleEn":"Overview","goal":"从整体上认识 DNA 的双螺旋结构。","keywords":["DNA","双螺旋 Double Helix","两条链 Two Strands"],"explanation":"DNA 分子通常由两条长链组成，两条链围绕同一中心轴盘旋，形成双螺旋结构。","mistake":"模型为了便于观察放大了各组成部分，不代表真实比例。","question":"为什么 DNA 的结构既要稳定，又要能够在复制时解开？","id":"overview"},{"title":"组成单位","titleEn":"Building Blocks","goal":"识别一个脱氧核苷酸中的磷酸、脱氧核糖和碱基。","keywords":["脱氧核苷酸 Nucleotide","磷酸 Phosphate","碱基 Base"],"explanation":"每个脱氧核苷酸由一分子磷酸、一分子脱氧核糖和一个含氮碱基组成。","mistake":"不要把一个碱基对误认为一个完整的脱氧核苷酸。","question":"一个脱氧核苷酸中，哪一部分会体现 A、T、C、G 的差异？","id":"building-blocks"},{"title":"外侧骨架","titleEn":"Backbone","goal":"观察磷酸-糖骨架在 DNA 外侧的位置。","keywords":["骨架 Backbone","磷酸 Phosphate","脱氧核糖 Deoxyribose"],"explanation":"DNA 的外侧由磷酸和脱氧核糖交替连接，形成稳定的磷酸-糖骨架。","mistake":"碱基位于内侧，磷酸-糖骨架位于外侧。","question":"为什么稳定的外侧骨架有利于遗传信息保存？","id":"backbone"},{"title":"碱基配对","titleEn":"Base Pairing","goal":"理解 A-T、C-G 的互补配对关系。","keywords":["A-T","C-G","互补配对 Complementary Pairing"],"explanation":"DNA 中的 A 通常与 T 配对，C 通常与 G 配对，这种固定关系有助于 DNA 准确复制。","mistake":"A 不与 C 配对，T 不与 G 配对。","question":"如果一条链上是 A-T-C-G，另一条链对应序列是什么？","id":"base-pairing"},{"title":"信息储存","titleEn":"Genetic Information","goal":"理解碱基排列顺序与遗传信息之间的关系。","keywords":["碱基序列 Sequence","遗传信息 Genetic Information"],"explanation":"DNA 中遗传信息主要储存在碱基的排列顺序中，不同序列可以对应不同遗传信息。","mistake":"遗传信息不是由磷酸或脱氧核糖的种类决定的。","question":"同样长度的 DNA 片段，为什么能携带不同信息？","id":"genetic-information"},{"title":"练习检测","titleEn":"Practice","goal":"通过识别结构和配对关系检查理解情况。","keywords":["识别 Identify","配对 Pairing","反馈 Feedback"],"explanation":"练习模式会要求学生识别结构或判断碱基配对关系，适合课堂提问和自学检测。","mistake":"如果答错，先回到相关阶段重新观察结构位置和颜色。","question":"请指出一个磷酸结构，并说出它在 DNA 中的位置。","id":"practice"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"dna-webgl","version":"2.4.2","publish":true,"title":{"zh":"DNA 双螺旋结构模型","en":"DNA Double Helix Model"},"summary":{"zh":"观察 DNA 双螺旋、核苷酸组成、碱基配对和信息储存。","en":"Explore the DNA double helix, nucleotides, base pairing and genetic information."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"整体观察","en":"Overview"}},{"id":"building-blocks","title":{"zh":"组成单位","en":"Building Blocks"}},{"id":"backbone","title":{"zh":"外侧骨架","en":"Backbone"}},{"id":"base-pairing","title":{"zh":"碱基配对","en":"Base Pairing"}},{"id":"genetic-information","title":{"zh":"信息储存","en":"Genetic Information"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"dna-webgl","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"dnaOpen":0,"dnaSelected":"","dnaWebglQuaternion":{"x":0,"y":0,"z":0,"w":1},"dnaWebglZoom":1,"dnaWebglPan":{"x":0,"y":0},"dnaWebglViewIndex":-1,"dnaWebglSelected":"","dnaReferenceOpen":true};
ANDER_MODEL_CONTENT.stages = ANDER_MODEL_CONTENT.stages.filter((stage) => stage.id !== "practice");

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
        <nav class="stage-strip" data-stage-strip aria-label="模型阶段" ${currentModel().id === "plant-cell-webgl" ? "hidden" : ""}></nav>
        <div class="model-stage" data-model-stage></div>
        <div class="control-dock" data-control-dock>
          <div class="control-group control-group-primary">
            <button class="control-button is-primary" type="button" data-action="play"></button>
            <button class="control-button" type="button" data-action="reset"></button>
            <button class="control-button" type="button" data-action="prev"></button>
            <button class="control-button" type="button" data-action="next"></button>
          </div>
          <div class="timeline-wrap structure-timeline"><span>双链分离</span></div>
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


function dnaWebglVisual() {
  return `
    <div class="dna-webgl-stack" data-dna-webgl-root>
      <div class="dna-3d-shell dna-webgl-shell" data-dna-webgl-shell>
        <div class="dna-webgl-viewport-frame" data-dna-webgl-viewport>
          <div class="dna-webgl-host" data-dna-webgl-host></div>
          <div class="dna-webgl-labels" data-dna-webgl-labels></div>
        </div>
        <div class="dna-webgl-loading" data-dna-webgl-loading>正在加载 WebGL 三维模型...</div>
      </div>
      <aside class="dna-webgl-sidecar" aria-label="DNA 模型辅助信息">
        <div class="dna-state-control" data-dna-webgl-state-control>
          <div class="dna-state-header">
            <span>分子状态调节</span>
            <strong data-dna-webgl-open-value>${Math.round(state.dnaOpen * 100)}%</strong>
          </div>
          <label>
            <span>双链分离 / Strand Separation</span>
            <input type="range" min="0" max="100" value="${Math.round(state.dnaOpen * 100)}" data-dna-webgl-unzip />
          </label>
        </div>
        ${dnaReferenceDisclosure()}
      </aside>
    </div>
  `;
}

function dnaReferenceDisclosure() {
  const isOpen = state.dnaReferenceOpen;
  return `
    <div class="dna-reference-disclosure ${isOpen ? "is-open" : ""}" data-dna-reference-disclosure>
      <button class="dna-reference-toggle" type="button" data-dna-reference-toggle aria-expanded="${isOpen}" aria-controls="dna-reference-panel">
        <span>碱基与核苷酸说明 / Base Guide</span>
        <strong>${isOpen ? "收起" : "展开"}</strong>
      </button>
      <div class="dna-reference-panel-wrap" id="dna-reference-panel" ${isOpen ? "" : "hidden"}>
        ${dnaReferencePanel()}
      </div>
    </div>
  `;
}

function dnaReferencePanel() {
  const baseItems = [
    { base: "A", name: "腺嘌呤", en: "Adenine", type: "嘌呤双环", pair: "T", bonds: 2 },
    { base: "G", name: "鸟嘌呤", en: "Guanine", type: "嘌呤双环", pair: "C", bonds: 3 },
    { base: "C", name: "胞嘧啶", en: "Cytosine", type: "嘧啶单环", pair: "G", bonds: 3 },
    { base: "T", name: "胸腺嘧啶", en: "Thymine", type: "嘧啶单环", pair: "A", bonds: 2 },
  ];
  return `
    <aside class="dna-reference-panel" data-dna-reference-panel aria-label="DNA 结构说明" tabindex="0">
      <section class="dna-reference-section dna-reference-section--bases">
        <h3>含氮碱基 <span>结构简图省略部分氢原子</span></h3>
        <div class="dna-reference-list">
          ${baseItems
            .map(
              (item) => `
                <article class="dna-reference-card">
                  ${dnaBaseMiniSvg(item.base)}
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
        <h3>脱氧核苷酸 <span>磷酸 + 脱氧核糖 + 含氮碱基</span></h3>
        <div class="dna-nucleotide-figure">
          ${dnaNucleotideMiniSvg()}
          <p>碱基连接在脱氧核糖的 1′ 碳上，磷酸连接在 5′ 碳一侧；2′ 碳连接 H，是“脱氧”的结构特征。</p>
        </div>
      </section>
    </aside>
  `;
}

const DNA_BASE_CHEMISTRY = Object.freeze({
  A: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], element:[7,7,7,7,7,6,6,6,6,6,1,1,1,1,1], x:[4.6783,4.6783,2.866,2,2.866,3.7321,3.7321,2.866,5.2619,2,4.8709,5.8819,1.4631,2.3291,3.403], y:[0.1497,-1.4597,-1.655,-0.155,1.345,-0.155,-1.155,0.345,-0.655,-1.155,0.7391,-0.655,-1.465,1.655,1.655], a:[1,1,1,2,2,3,3,4,4,5,5,5,6,6,9,10], b:[6,9,11,7,9,7,10,8,10,8,14,15,7,8,12,13], order:[1,1,1,1,2,2,1,1,2,1,1,1,1,2,1,1] },
  G: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], element:[8,7,7,7,7,7,6,6,6,6,6,1,1,1,1,1], x:[4.269,4.269,6.0812,6.0812,3.403,2.5369,5.135,5.135,4.269,3.403,6.6648,4.269,6.2738,7.2848,2,2.5369], y:[1.81,-1.19,0.6147,-0.9947,0.31,-1.19,0.31,-0.69,0.81,-0.69,-0.19,-1.81,1.204,-0.19,-0.88,-1.81], a:[1,2,2,2,3,3,3,4,4,5,5,6,6,6,7,7,11], b:[9,8,10,12,7,11,13,8,11,9,10,10,15,16,8,9,14], order:[2,1,1,1,1,1,1,1,2,1,2,1,1,1,2,1,1] },
  C: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13], element:[8,7,7,7,6,6,6,6,1,1,1,1,1], x:[6.001,4.269,2.5369,5.135,3.403,3.403,5.135,4.269,4.269,2.866,4.269,2,2.5369], y:[-0.69,-0.69,-0.69,0.81,-0.19,0.81,-0.19,1.31,-1.31,1.12,1.93,-0.38,-1.31], a:[1,2,2,2,3,3,3,4,4,5,6,6,8], b:[7,5,7,9,5,12,13,7,8,6,8,10,11], order:[2,1,1,1,1,1,1,1,2,2,1,1,1] },
  T: { aid:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], element:[8,8,7,7,6,6,6,6,6,1,1,1,1,1,1], x:[2,5.4641,3.7321,4.5981,2.866,2.866,3.7321,2,4.5981,3.7321,3.7321,5.135,2.31,1.4631,1.69], y:[-0.69,-0.69,-0.69,0.81,0.81,-0.19,1.31,1.31,-0.19,1.93,-1.31,1.12,1.8469,1.62,0.7731], a:[1,2,3,3,3,4,4,4,5,5,5,7,8,8,8], b:[6,9,6,9,11,7,9,12,6,7,8,10,13,14,15], order:[2,2,1,1,1,1,1,1,1,2,1,1,1,1,1] },
});

const DNA_BASE_RINGS = Object.freeze({
  A: [[1, 6, 7, 2, 9], [6, 7, 3, 10, 4, 8]],
  G: [[3, 7, 8, 4, 11], [7, 8, 2, 10, 5, 9]],
  C: [[2, 5, 6, 8, 4, 7]],
  T: [[3, 6, 5, 7, 4, 9]],
});

function dnaBaseMiniSvg(base) {
  const structure = DNA_BASE_CHEMISTRY[base];
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
  const ringFills = DNA_BASE_RINGS[base].map((ring) => {
    const points = ring.map((id) => {
      const p = point(atomById.get(id));
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");
    return `<polygon class="chemical-ring-fill" points="${points}" style="--base-color:${DNA_MODEL.colors[base]}" />`;
  }).join("");
  const atomLabel = (atom) => {
    const hydrogens = hydrogenCount.get(atom.id) || 0;
    if (atom.element === 7) return hydrogens === 2 ? "NH₂" : hydrogens === 1 ? "NH" : "N";
    if (atom.element === 8) return hydrogens ? "OH" : "O";
    if (atom.element === 6 && hydrogens === 3) return "CH₃";
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

function dnaNucleotideMiniSvg() {
  return `
    <svg class="dna-reference-structure dna-reference-nucleotide" viewBox="0 0 320 180" role="img" aria-label="脱氧核苷酸组成与碳原子编号">
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
        <text class="chemical-node" x="182" y="149">H</text><text class="chemical-node" x="117" y="151">OH</text>
      </g>
      <g class="nucleotide-base" style="--base-color:#dbeafe">
        <line class="chemical-bond" x1="186" y1="70" x2="208" y2="70" />
        <polygon class="base-ring" points="214,70 231,44 264,44 281,70 264,96 231,96" />
        <text class="chemical-node" x="214" y="70">N</text>
        <text class="base-label" x="249" y="67">碱基</text>
        <text class="base-options" x="249" y="83">A / T / C / G</text>
      </g>
      <g class="nucleotide-part-labels">
        <text x="38" y="171">磷酸</text><text x="152" y="171">脱氧核糖</text><text x="249" y="113">含氮碱基</text>
      </g>
    </svg>
  `;
}

const DNA_MODEL = {
  count: 18,
  rise: 4.6,
  radius: 7.8,
  twist: Math.PI / 5,
  offset: 2.39,
  y0: -((18 - 1) * 4.6) / 2,
  sequence: "ATGCAGTCTAGCATGCTA".split(""),
  complement: { A: "T", T: "A", G: "C", C: "G" },
  hbonds: { A: 2, T: 2, G: 3, C: 3 },
  colors: {
    phosphate: "#06B6D4",
    sugar: "#F59E0B",
    sugarCarbon: "#475569",
    sugarOxygen: "#EF4444",
    backbone: "#1D4ED8",
    phosphodiester: "#2563EB",
    hbond: "#94A3B8",
    A: "#22C55E",
    T: "#EF4444",
    C: "#A855F7",
    G: "#F97316",
  },
};

const DNA_PART_LABELS = {
  phosphate: "磷酸 / Phosphate",
  sugar: "脱氧核糖 / Deoxyribose",
  base: "碱基 / Base",
  hbond: "氢键 / Hydrogen Bond",
  backbone: "磷酸-糖骨架 / Sugar-phosphate Backbone",
  phosphodiester: "3',5'-磷酸二酯键 / 3',5'-Phosphodiester Bond",
};

function buildDnaObjects() {
  const items = [];
  const focus = dnaFocusTags();
  const add = (object) => {
    object.focus = object.tags.some((tag) => focus.includes(tag));
    items.push(object);
  };
  const sugars = [[], []];

  for (let strand = 0; strand < 2; strand += 1) {
    const phase = strand === 0 ? 0 : DNA_MODEL.offset;
    for (let i = 0; i < DNA_MODEL.count; i += 1) {
      const center = dnaOpenedPoint(dnaHelix(i, phase), strand, i);
      const sugar = sugarGeometry(center, phase, strand, i);
      sugars[strand][i] = sugar;
      const nucleotideTag = i === 8 && strand === 0 ? "nucleotide" : "";

      add(sugarRingObject(sugar, ["sugar", nucleotideTag]));
      add({
        kind: "line",
        p1: sugar.atoms.C4,
        p2: sugar.atoms.C5,
        width: 0.18,
        color: DNA_MODEL.colors.sugar,
        part: "sugar",
        tags: ["sugar", nucleotideTag],
      });

      sugar.atomList.forEach((atom) => {
        add({
          kind: "sphere",
          p: atom.p,
          r: atom.element === "O" ? 0.52 : 0.46,
          color: atom.element === "O" ? DNA_MODEL.colors.sugarOxygen : DNA_MODEL.colors.sugarCarbon,
          part: "sugar",
          tags: ["sugar", "sugarAtom", atom.element === "O" ? "oxygen" : "carbon", nucleotideTag],
        });
      });

      if (state.labels && !isDnaAxialView() && state.stageIndex === 1 && strand === 0 && i === 8) {
        ["C1", "C3", "C5", "O4"].forEach((name) => {
          add({
            kind: "text",
            p: sugar.atoms[name],
            text: `${name}'`,
            size: 9,
            color: "#0F172A",
            part: "sugar",
            tags: ["sugar", "sugarAtom", "nucleotide"],
          });
        });
      }
    }
  }

  for (let strand = 0; strand < 2; strand += 1) {
    const terminalIndex = strand === 0 ? 0 : DNA_MODEL.count - 1;
    const terminalSugar = sugars[strand][terminalIndex];
    const terminalPhosphate = addPoint(terminalSugar.atoms.C5, addPoint(scalePoint(terminalSugar.outward, 3.05), scalePoint(terminalSugar.vertical, 0.28)));
    add({
      kind: "sphere",
      p: terminalPhosphate,
      r: 1.12,
      color: DNA_MODEL.colors.phosphate,
      part: "phosphate",
      tags: ["phosphate", "backbone"],
    });
    add({
      kind: "line",
      p1: terminalSugar.atoms.C5,
      p2: terminalPhosphate,
      width: 0.24,
      color: DNA_MODEL.colors.backbone,
      part: "backbone",
      tags: ["backbone", "phosphate"],
    });

    for (let i = 0; i < DNA_MODEL.count - 1; i += 1) {
      const fromSugar = strand === 0 ? sugars[strand][i] : sugars[strand][i + 1];
      const toSugar = strand === 0 ? sugars[strand][i + 1] : sugars[strand][i];
      const phosphateAnchor = lerpPoint(fromSugar.atoms.C3, toSugar.atoms.C5, 0.52);
      let phosphateOutward = addPoint(fromSugar.outward, toSugar.outward);
      phosphateOutward = pointLength(phosphateOutward) < 0.0001 ? fromSugar.outward : normalizePoint(phosphateOutward);
      const phosphate = addPoint(phosphateAnchor, scalePoint(phosphateOutward, 1.28));
      const focusTag = i === 8 && strand === 0 ? "nucleotide" : "";
      const phosphodiesterTag = i >= 7 && i <= 9 ? "phosphodiester" : "";

      add({
        kind: "sphere",
        p: phosphate,
        r: 1.08,
        color: DNA_MODEL.colors.phosphate,
        part: "phosphate",
        tags: ["phosphate", "backbone", phosphodiesterTag, focusTag],
      });
      add({
        kind: "line",
        p1: fromSugar.atoms.C3,
        p2: phosphate,
        width: 0.28,
        color: DNA_MODEL.colors.phosphodiester,
        part: "phosphodiester",
        tags: ["backbone", "phosphodiester", focusTag],
      });
      add({
        kind: "line",
        p1: phosphate,
        p2: toSugar.atoms.C5,
        width: 0.28,
        color: DNA_MODEL.colors.phosphodiester,
        part: "phosphodiester",
        tags: ["backbone", "phosphodiester", focusTag],
      });
    }
  }

  for (let i = 0; i < DNA_MODEL.count; i += 1) {
    const bA = DNA_MODEL.sequence[i % DNA_MODEL.sequence.length];
    const bB = DNA_MODEL.complement[bA];
    const sugarA = sugars[0][i];
    const sugarB = sugars[1][i];
    const pA = sugarA.atoms.C1;
    const pB = sugarB.atoms.C1;
    const innerA = lerpPoint(pA, pB, 0.46);
    const innerB = lerpPoint(pA, pB, 0.54);
    const midA = lerpPoint(pA, pB, 0.28);
    const midB = lerpPoint(pA, pB, 0.72);
    const sequenceTag = "sequence";
    const basePairTag = "basepair";
    const nucleotideTag = i === 8 ? "nucleotide" : "";

    const baseA = addBaseRingObjects(add, bA, sugarA, ["base", sequenceTag, basePairTag, nucleotideTag]);
    const baseB = addBaseRingObjects(add, bB, sugarB, ["base", basePairTag]);

    const hbondDir = normalizePoint({
      x: baseB.hbondPoint.x - baseA.hbondPoint.x,
      y: baseB.hbondPoint.y - baseA.hbondPoint.y,
      z: baseB.hbondPoint.z - baseA.hbondPoint.z,
    });
    let side = normalizePoint(crossPoint({ x: 0, y: 1, z: 0 }, hbondDir));
    if (Math.hypot(side.x, side.y, side.z) < 0.01) side = baseA.side;
    const bonds = DNA_MODEL.hbonds[bA];
    const hbondOpacity = clamp(0.74 * (1 - state.dnaOpen * 1.45), 0, 0.74);
    if (hbondOpacity > 0.02) {
      for (let k = 0; k < bonds; k += 1) {
        const offset = (k - (bonds - 1) / 2) * 0.56;
        add({
          kind: "line",
          p1: addPoint(baseA.hbondPoint, scalePoint(side, offset)),
          p2: addPoint(baseB.hbondPoint, scalePoint(side, offset)),
          width: 0.08,
          color: DNA_MODEL.colors.hbond,
          dash: true,
          opacity: hbondOpacity,
          part: "hbond",
          tags: ["hbond", basePairTag],
        });
      }
    }

    if (state.labels && !isDnaAxialView()) {
      add({
        kind: "text",
        p: baseA.labelPoint,
        text: bA,
        color: "#0F172A",
        part: "base",
        tags: ["base", sequenceTag, basePairTag],
      });
      add({
        kind: "text",
        p: baseB.labelPoint,
        text: bB,
        color: "#0F172A",
        part: "base",
        tags: ["base", basePairTag],
      });
    }
  }

  return items.map((item) => ({ ...item, tags: item.tags.filter(Boolean) }));
}

function sugarGeometry(center, phase, strand, index) {
  const open = state.dnaOpen || 0;
  const openAmount = smoothOpen(open);
  const inward = dnaPairAxis(phase, strand, index, center);
  const frame = makeFrame(center, inward, dnaStrandAxis(phase, strand, index, inward));
  const sugarFrame = dnaSugarFaceFrame(center, frame.x, frame.y);
  const outward = scalePoint(frame.x, -1);
  const baseSide = dnaBaseSide(frame.x);
  const sugarRadius = 1.36;
  const sugarStep = (Math.PI * 2) / 5;
  const ringPoint = (angle) => framePoint(sugarFrame, Math.cos(angle) * sugarRadius, Math.sin(angle) * sugarRadius, 0);
  const atoms = {
    C1: ringPoint(0),
    C2: ringPoint(-sugarStep),
    C3: ringPoint(-sugarStep * 2),
    C4: ringPoint(-sugarStep * 3),
    O4: ringPoint(-sugarStep * 4),
  };
  atoms.C5 = addPoint(atoms.C4, frameVector(sugarFrame, -0.96, 0.72, 0));

  return {
    center,
    frame,
    sugarFrame,
    points: [atoms.C1, atoms.C2, atoms.C3, atoms.C4, atoms.O4],
    atoms,
    atomList: [
      { name: "C1", element: "C", p: atoms.C1 },
      { name: "C2", element: "C", p: atoms.C2 },
      { name: "C3", element: "C", p: atoms.C3 },
      { name: "C4", element: "C", p: atoms.C4 },
      { name: "C5", element: "C", p: atoms.C5 },
      { name: "O4", element: "O", p: atoms.O4 },
    ],
    inward: frame.x,
    outward,
    vertical: frame.y,
    tangent: frame.z,
    baseSide,
    open: openAmount,
    normal: sugarFrame.z,
  };
}

function dnaStrandAxis(phase, strand, index, inward) {
  const previousIndex = Math.max(0, index - 0.5);
  const nextIndex = Math.min(DNA_MODEL.count - 1, index + 0.5);
  const previous = dnaOpenedPoint(dnaHelix(previousIndex, phase), strand, previousIndex);
  const next = dnaOpenedPoint(dnaHelix(nextIndex, phase), strand, nextIndex);
  const rawAxis = strand === 0 ? normalizePoint(subtractPoint(next, previous)) : normalizePoint(subtractPoint(previous, next));
  const radialLeak = dotPoint(rawAxis, inward);
  return normalizePoint(subtractPoint(rawAxis, scalePoint(inward, radialLeak)));
}

function dnaPairAxis(phase, strand, index, center) {
  const pairedPhase = strand === 0 ? DNA_MODEL.offset : 0;
  const pairedCenter = dnaOpenedPoint(dnaHelix(index, pairedPhase), 1 - strand, index);
  const axis = subtractPoint(pairedCenter, center);

  if (Math.hypot(axis.x, axis.y, axis.z) < 0.0001) {
    return strand === 0 ? { x: 1, y: 0, z: 0 } : { x: -1, y: 0, z: 0 };
  }

  return normalizePoint(axis);
}

function dnaBaseSide(inward) {
  const side = crossPoint(DNA_AXIS, inward);
  if (pointLength(side) < 0.0001) return { x: 0, y: 0, z: 1 };
  return normalizePoint(side);
}

function dnaSugarFaceFrame(center, inward, strandAxis) {
  // Reuse one pentagon template, then place it in each nucleotide's helical frame.
  // The template's C3'/C5' vertical relation is opposite to the strand-axis vector used for backbone travel.
  return makeFrame(center, inward, scalePoint(strandAxis, -1));
}

function dnaResetScreenAxes() {
  const theta = 0.65;
  const pitch = 1.28 - Math.PI / 2;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  return {
    x: normalizePoint({ x: cosT, y: 0, z: -sinT }),
    y: normalizePoint({ x: -sinT * sinP, y: cosP, z: -cosT * sinP }),
    view: normalizePoint({ x: sinT * cosP, y: sinP, z: cosT * cosP }),
  };
}

function sugarRingObject(sugar, tags) {
  return {
    kind: "polygon",
    points: sugar.points,
    p: sugar.center,
    normal: sugar.normal,
    thickness: 0.5,
    color: DNA_MODEL.colors.sugar,
    part: "sugar",
    tags,
  };
}

function addBaseRingObjects(add, base, sugar, tags) {
  const from = sugar.atoms.C1;
  const dir = sugar.inward;
  const side = sugar.baseSide;
  const color = DNA_MODEL.colors[base];
  const isPurineBase = base === "A" || base === "G";
  const baseTags = base === "A" || base === "G" ? [...tags, "purine"] : [...tags, "pyrimidine"];
  const firstDistance = isPurineBase ? 2.05 : 2.15;
  const hbondDistance = isPurineBase ? 4.7 : 3.85;
  const firstCenter = addPoint(from, scalePoint(dir, firstDistance));
  const hbondPoint = addPoint(from, scalePoint(dir, hbondDistance));
  const normal = normalizePoint(crossPoint(dir, side));

  add({
    kind: "line",
    p1: from,
    p2: firstCenter,
    width: 0.22,
    color,
    part: "base",
    tags: baseTags,
  });

  if (isPurineBase) {
    const purine = purineRingGeometry(firstCenter, dir, side);
    purine.rings.forEach((points) => {
      add({
        kind: "polygon",
        points,
        p: purine.center,
        normal,
        thickness: 0.58,
        color,
        part: "base",
        base,
        tags: baseTags,
      });
    });

    add({
      kind: "line",
      p1: purine.sharedEdge[0],
      p2: purine.sharedEdge[1],
      width: 0.1,
      color,
      part: "base",
      tags: baseTags,
    });
  } else {
    add({
      kind: "polygon",
      points: ringPoints(firstCenter, dir, side, 6, 1.32, 1.08, Math.PI / 6),
      p: firstCenter,
      normal,
      thickness: 0.58,
      color,
      part: "base",
      base,
      tags: baseTags,
    });
  }

  return {
    hbondPoint,
    labelPoint: isPurineBase ? addPoint(from, scalePoint(dir, firstDistance + 0.9)) : firstCenter,
    side,
  };
}

function purineRingGeometry(hexCenter, dir, side) {
  const hexRadius = 1.18;
  const sharedOffset = Math.cos(Math.PI / 6) * hexRadius;
  const sharedHalfHeight = Math.sin(Math.PI / 6) * hexRadius;
  const pentSide = sharedHalfHeight * 2;
  const pentApothem = pentSide / (2 * Math.tan(Math.PI / 5));
  const pentRadius = pentSide / (2 * Math.sin(Math.PI / 5));
  const pentCenter = addPoint(hexCenter, scalePoint(dir, sharedOffset + pentApothem));
  const sharedEdge = [
    addPoint(hexCenter, addPoint(scalePoint(dir, sharedOffset), scalePoint(side, -sharedHalfHeight))),
    addPoint(hexCenter, addPoint(scalePoint(dir, sharedOffset), scalePoint(side, sharedHalfHeight))),
  ];

  return {
    center: lerpPoint(hexCenter, pentCenter, 0.5),
    sharedEdge,
    rings: [
      ringPoints(hexCenter, dir, side, 6, hexRadius, hexRadius, Math.PI / 6),
      ringPoints(pentCenter, dir, side, 5, pentRadius, pentRadius, (Math.PI * 4) / 5),
    ],
  };
}

function ringPoints(center, ex, ey, sides, rx, ry, startAngle) {
  const points = [];
  for (let i = 0; i < sides; i += 1) {
    const a = startAngle + (i * Math.PI * 2) / sides;
    points.push(addPoint(center, addPoint(scalePoint(ex, Math.cos(a) * rx), scalePoint(ey, Math.sin(a) * ry))));
  }
  return points;
}

function isDnaAxialView() {
  return state.viewIndex === 3 || state.viewIndex === 4;
}

function dnaPoint(strand, t) {
  const phase = strand === 0 ? 0 : DNA_MODEL.offset;
  return dnaOpenedPoint(dnaHelix(t, phase), strand, t);
}

function sugarAtomPoint(strand, index, atomName) {
  const phase = strand === 0 ? 0 : DNA_MODEL.offset;
  const center = dnaOpenedPoint(dnaHelix(index, phase), strand, index);
  return sugarGeometry(center, phase, strand, index).atoms[atomName];
}

function phosphodiesterPoint(strand, index) {
  const currentIndex = clamp(index, 0, DNA_MODEL.count - 2);
  const fromIndex = strand === 0 ? currentIndex : currentIndex + 1;
  const toIndex = strand === 0 ? currentIndex + 1 : currentIndex;
  const fromSugar = {
    C3: sugarAtomPoint(strand, fromIndex, "C3"),
  };
  const toSugar = {
    C5: sugarAtomPoint(strand, toIndex, "C5"),
  };
  return lerpPoint(fromSugar.C3, toSugar.C5, 0.52);
}

function dnaFocusTags() {
  if (state.stageIndex === 1) return ["nucleotide", "sugarAtom"];
  if (state.stageIndex === 2) return ["backbone", "phosphate", "sugar", "phosphodiester"];
  if (state.stageIndex === 3) return ["basepair", "hbond"];
  if (state.stageIndex === 4) return ["sequence"];
  if (state.stageIndex === 5) return ["phosphate"];
  return ["base", "backbone", "phosphate", "sugar", "hbond"];
}

function smoothOpen(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function dnaOpenedPoint(point, strand, t) {
  const open = smoothOpen(state.dnaOpen || 0);
  if (open <= 0) return point;

  const sign = strand === 0 ? -1 : 1;
  const normalized = clamp(t / (DNA_MODEL.count - 1), 0, 1);
  const axes = dnaResetScreenAxes();
  const flatPoint = addPoint(
    scalePoint(axes.x, sign * 24),
    scalePoint(axes.y, (normalized - 0.5) * (DNA_MODEL.count - 1) * DNA_MODEL.rise),
  );

  return {
    x: point.x + (flatPoint.x - point.x) * open,
    y: point.y + (flatPoint.y - point.y) * open,
    z: point.z + (flatPoint.z - point.z) * open,
  };
}

const DNA_AXIS = { x: 0, y: 1, z: 0 };

function dnaHelix(t, phase) {
  const angle = t * DNA_MODEL.twist + phase;
  return {
    x: DNA_MODEL.radius * Math.cos(angle),
    y: t * DNA_MODEL.rise + DNA_MODEL.y0,
    z: DNA_MODEL.radius * Math.sin(angle),
  };
}

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

function addPoint(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scalePoint(a, scale) {
  return { x: a.x * scale, y: a.y * scale, z: a.z * scale };
}

function crossPoint(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dotPoint(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function pointLength(a) {
  return Math.hypot(a.x, a.y, a.z);
}

function normalizePoint(a) {
  const length = pointLength(a) || 1;
  return { x: a.x / length, y: a.y / length, z: a.z / length };
}

function makeFrame(origin, xAxis, yAxis) {
  const x = normalizePoint(xAxis);
  let yRaw = subtractPoint(yAxis, scalePoint(x, dotPoint(yAxis, x)));

  if (Math.hypot(yRaw.x, yRaw.y, yRaw.z) < 0.0001) {
    const fallback = Math.abs(x.y) < 0.95 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
    yRaw = subtractPoint(fallback, scalePoint(x, dotPoint(fallback, x)));
  }

  const y = normalizePoint(yRaw);
  const z = normalizePoint(crossPoint(x, y));
  return { origin, x, y, z };
}

function frameVector(frame, x = 0, y = 0, z = 0) {
  return addPoint(addPoint(scalePoint(frame.x, x), scalePoint(frame.y, y)), scalePoint(frame.z, z));
}

function framePoint(frame, x = 0, y = 0, z = 0) {
  return addPoint(frame.origin, frameVector(frame, x, y, z));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DNA_THREE_URL = "./vendor/three.module.min.js";

const DNA_THREE_VIEW_SIZE = 104;

const DNA_THREE_OPEN_SPACING = 16.5;

const DNA_THREE_PHOSPHATE_OFFSET = 3.35;

const dnaWebglGeometryCache = new Map();
const dnaWebglTextTextureCache = new Map();

function dnaWebglSharedGeometry(key, createGeometry) {
  if (!dnaWebglGeometryCache.has(key)) {
    const geometry = createGeometry();
    geometry.userData = { ...geometry.userData, dnaSharedGeometry: true };
    dnaWebglGeometryCache.set(key, geometry);
  }
  return dnaWebglGeometryCache.get(key);
}

const DNA_THREE_SUGAR_ATOMS = {
  C1: { x: 1.1, y: -0.16, z: 0 },
  C2: { x: 0.42, y: -1.0, z: 0 },
  C3: { x: -0.62, y: -0.82, z: 0 },
  C4: { x: -1.0, y: 0.16, z: 0 },
  O4: { x: -0.22, y: 0.98, z: 0 },
  C5: { x: -1.7, y: 0.98, z: 0 },
};

function loadThreeForDna() {
  if (!threeModulePromise) {
    threeModulePromise = import(DNA_THREE_URL);
  }
  return threeModulePromise;
}

function mountDnaWebgl() {
  const shell = document.querySelector("[data-dna-webgl-shell]");
  const host = document.querySelector("[data-dna-webgl-host]");
  const labelsLayer = document.querySelector("[data-dna-webgl-labels]");
  const feedback = document.querySelector("[data-dna-webgl-feedback]");
  const loading = document.querySelector("[data-dna-webgl-loading]");
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
      instanceCleanup = startDnaWebgl(THREE, shell, host, labelsLayer, feedback, loading);
      shellExperience?.setSceneStatus('ready');
    })
    .catch((error) => {
      console.warn("Three.js failed to load", error);
      threeModulePromise=null;
      shellExperience?.setSceneStatus('error','三维画面未能加载，请重试或换用支持 WebGL 的浏览器。',()=>{shellExperience.setSceneStatus('loading');stopVisualRuntime();host.replaceChildren();labelsLayer.replaceChildren();mountDnaWebgl();});
      if (loading) {
        loading.textContent = "三维画面未能加载，请重试。";
      }
    });
}

function mountDnaReferenceDisclosure() {
  const disclosure = document.querySelector("[data-dna-reference-disclosure]");
  const toggle = disclosure?.querySelector("[data-dna-reference-toggle]");
  const panelWrap = disclosure?.querySelector(".dna-reference-panel-wrap");
  const toggleLabel = toggle?.querySelector("strong");
  if (!disclosure || !toggle || !panelWrap) return;

  const sync = () => {
    disclosure.classList.toggle("is-open", state.dnaReferenceOpen);
    toggle.setAttribute("aria-expanded", String(state.dnaReferenceOpen));
    panelWrap.hidden = !state.dnaReferenceOpen;
    if (toggleLabel) toggleLabel.textContent = state.dnaReferenceOpen ? "收起" : "展开";
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    state.dnaReferenceOpen = !state.dnaReferenceOpen;
    sync();
  });

  sync();
}

function startDnaWebgl(THREE, shell, host, labelsLayer, feedback, loading) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
  renderer.domElement.className = "dna-webgl-canvas";
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL DNA 双螺旋结构模型");
  host.appendChild(renderer.domElement);
  if (loading) loading.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
  camera.position.set(0, 0, 120);
  camera.lookAt(0, 0, 0);

  const panRoot = new THREE.Group();
  const dnaRoot = new THREE.Group();
  const molecule = new THREE.Group();
  scene.add(panRoot);
  panRoot.add(dnaRoot);
  dnaRoot.add(molecule);

  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const hemi = new THREE.HemisphereLight(0xf8fbff, 0xe2e8f0, 0.62);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.62);
  key.position.set(-5, 8, 10);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0f2fe, 0.82);
  fill.position.set(6, 3, 5);
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
  let unzipFrame = 0;

  applyDnaWebglViewPreset(THREE, dnaRoot, panRoot, camera);
  const lockedRotation = { ...state.dnaWebglRotation };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewSize = DNA_THREE_VIEW_SIZE / Math.min(1, aspect);
    camera.left = (-viewSize * aspect) / 2;
    camera.right = (viewSize * aspect) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.zoom = state.dnaWebglZoom;
    camera.updateProjectionMatrix();
  };

  const saveTransformState = () => {
    state.dnaWebglRotation = { x: lockedRotation.x, y: lockedRotation.y };
    state.dnaWebglQuaternion = {
      x: dnaRoot.quaternion.x,
      y: dnaRoot.quaternion.y,
      z: dnaRoot.quaternion.z,
      w: dnaRoot.quaternion.w,
    };
    state.dnaWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.dnaWebglZoom = camera.zoom;
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
    labelItems.forEach((item) => {item.el.remove();item.line?.remove();});
    labelItems = [];
    while (molecule.children.length) {
      const child = molecule.children.pop();
      disposeDnaWebglObject(child);
    }
    buildDnaWebglMolecule(THREE, molecule, pickables, addLabel);
  };

  const projectLabels = () => {
    placeStructureLabels(THREE,labelItems,camera,host,labelsLayer);
  };
  const animate = () => {
    if (!document.body.contains(shell)) return;
    if (state.playing) {
      lockedRotation.y += 0.0065 * speeds[state.speedIndex];
      dnaRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
      saveTransformState();
    }
    renderer.render(scene, camera);
    projectLabels();
    dnaWebglAnimationFrame = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  rebuild();
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
    camera.zoom = clamp(zoom, 0.55, 5.4);
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
      dnaRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
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
    const hit = hits.find((item) => item.object.userData?.dnaPart);
    if (!hit) return;
    const part = hit.object.userData.dnaPart;
    const label = DNA_PART_LABELS[part] || hit.object.userData.dnaLabel || "DNA 结构";
    if (state.practice) {
      state.dnaWebglSelected =
        part === "phosphate"
          ? `正确：${label}。磷酸位于 DNA 外侧骨架上。`
          : `再观察：当前选中的是${label}，练习目标是磷酸。`;
    } else {
      state.dnaWebglSelected = `已选中：${label}`;
    }
    setFeedback(state.dnaWebglSelected);
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

  const interactionRoot = shell.closest("[data-dna-webgl-root]") || shell;
  const stateControl = interactionRoot.querySelector("[data-dna-webgl-state-control]");
  const referencePanel = interactionRoot.querySelector("[data-dna-reference-panel]");
  const unzipInput = root.querySelector("[data-dna-webgl-unzip]");
  const unzipValue = root.querySelector("[data-dna-webgl-open-value]");
  const stopPanelInteraction = (event) => event.stopPropagation();
  stateControl?.addEventListener("pointerdown", (event) => event.stopPropagation());
  stateControl?.addEventListener("click", (event) => event.stopPropagation());
  referencePanel?.addEventListener("pointerdown", stopPanelInteraction);
  referencePanel?.addEventListener("click", stopPanelInteraction);
  referencePanel?.addEventListener("wheel", stopPanelInteraction);
  const rebuildAtNextFrame = () => {
    if (unzipFrame) return;
    unzipFrame = requestAnimationFrame(() => {
      unzipFrame = 0;
      rebuild();
      updateControls();
    });
  };
  const onUnzipInput = (event) => {
    state.dnaOpen = Number(event.target.value) / 100;
    state.playing = false;
    if (unzipValue) unzipValue.textContent = `${Math.round(state.dnaOpen * 100)}%`;
    setFeedback(
      state.dnaOpen > 0
        ? "双链正在打开：两条单链保持同一平面，磷酸和脱氧核糖在外侧，碱基朝向内侧。"
        : "",
    );
    rebuildAtNextFrame();
  };
  const onUnzipChange = () => {
    if (unzipFrame) {
      cancelAnimationFrame(unzipFrame);
      unzipFrame = 0;
    }
    rebuild();
    updateControls();
  };
  unzipInput?.addEventListener("input", onUnzipInput);
  unzipInput?.addEventListener("change", onUnzipChange);

  structureRuntime={resize,sync:()=>{
    applyDnaWebglViewPreset(THREE, dnaRoot, panRoot, camera);
    Object.assign(lockedRotation,state.dnaWebglRotation);
    rebuild();
    if(unzipInput)unzipInput.value=String(Math.round(state.dnaOpen*100));
    if(unzipValue)unzipValue.textContent=Math.round(state.dnaOpen*100)+'%';
    resize();setFeedback(state.dnaSelected||'');
  }};
  return () => {
    structureRuntime=null;
    resizeObserver.disconnect();
    if (dnaWebglAnimationFrame) {
      cancelAnimationFrame(dnaWebglAnimationFrame);
      dnaWebglAnimationFrame = 0;
    }
    if (unzipFrame) cancelAnimationFrame(unzipFrame);
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
    unzipInput?.removeEventListener("input", onUnzipInput);
    unzipInput?.removeEventListener("change", onUnzipChange);
    labelItems.forEach((item) => {item.el.remove();item.line?.remove();});
    disposeDnaWebglObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function applyDnaWebglViewPreset(THREE, dnaRoot, panRoot, camera) {
  if (state.dnaWebglViewIndex !== state.viewIndex) {
    const preset = dnaWebglViewPreset(THREE, state.viewIndex);
    state.dnaWebglRotation = { ...preset.rotation };
    state.dnaWebglQuaternion = {
      x: preset.quaternion.x,
      y: preset.quaternion.y,
      z: preset.quaternion.z,
      w: preset.quaternion.w,
    };
    state.dnaWebglZoom = preset.zoom;
    state.dnaWebglPan = { x: 0, y: 0 };
    state.dnaWebglViewIndex = state.viewIndex;
  }

  if (!state.dnaWebglRotation) {
    const restored = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(
        state.dnaWebglQuaternion.x,
        state.dnaWebglQuaternion.y,
        state.dnaWebglQuaternion.z,
        state.dnaWebglQuaternion.w,
      ),
      "XYZ",
    );
    state.dnaWebglRotation = { x: restored.x, y: restored.y };
  }
  dnaRoot.rotation.set(state.dnaWebglRotation.x, state.dnaWebglRotation.y, 0, "XYZ");
  panRoot.position.set(state.dnaWebglPan.x, state.dnaWebglPan.y, 0);
  camera.zoom = state.dnaWebglZoom;
}

function dnaWebglViewPreset(THREE, index) {
  const presets = [
    { theta: 0.65, phi: 1.28, zoom: 1 },
    { theta: 1.45, phi: 1.18, zoom: 1.24 },
    { theta: -0.05, phi: 1.52, zoom: 1.08 },
    { theta: 1.1696005988362006, phi: 0, zoom: 1.28 },
    { theta: 1.1696005988362006, phi: Math.PI, zoom: 1.28 },
  ];
  const selected = presets[index] || presets[0];
  const quaternion = dnaWebglQuaternionFromCamera(THREE, selected.theta, selected.phi);
  return {
    quaternion,
    rotation: { x: selected.phi - Math.PI / 2, y: -selected.theta },
    zoom: selected.zoom,
  };
}

function dnaWebglQuaternionFromCamera(THREE, theta, phi) {
  const pitch = phi - Math.PI / 2;
  const matrix = new THREE.Matrix4().makeRotationY(-theta);
  matrix.premultiply(new THREE.Matrix4().makeRotationX(pitch));
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function buildDnaWebglMolecule(THREE, parent, pickables, addLabel) {
  buildDnaWebglSharedMolecule(THREE, parent, pickables, addLabel);
  return;

  const open = smoothOpen(state.dnaOpen || 0);
  const materials = dnaWebglMaterials(THREE);
  const strands = [[], []];
  const baseCenters = [];
  if (open < 0.72) {
    const guide = new THREE.Mesh(
      new THREE.TorusGeometry(DNA_MODEL.radius, 0.035, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22 * (1 - open), depthWrite: false }),
    );
    guide.rotation.x = Math.PI / 2;
    parent.add(guide);
  }

  for (let strand = 0; strand < 2; strand += 1) {
    for (let i = 0; i < DNA_MODEL.count; i += 1) {
      const sugarPosition = dnaWebglPoint(THREE, strand, i, open);
      const outward = dnaWebglOutward(THREE, strand, i, open);
      const sugarAngle = strand === 0 ? 0 : Math.PI;
      const atoms = dnaWebglSugarAtoms(THREE, sugarPosition, sugarAngle);
      const phosphate = atoms.C5.clone().add(outward.clone().multiplyScalar(DNA_THREE_PHOSPHATE_OFFSET));
      const item = { sugarPosition, outward, sugarAngle, atoms, phosphate };
      strands[strand][i] = item;

      const focus = dnaWebglPartFocused("sugar", i) || dnaWebglPartFocused("nucleotide", i);
      const sugarGroup = createDnaWebglSugar(THREE, materials, item, focus);
      parent.add(sugarGroup);
      dnaWebglRegisterPickable(sugarGroup, pickables, "sugar");

      const phosphateMesh = new THREE.Mesh(new THREE.SphereGeometry(0.86, 40, 24), focus ? materials.phosphateFocus : materials.phosphate);
      phosphateMesh.position.copy(phosphate);
      phosphateMesh.userData = { dnaPart: "phosphate", dnaLabel: DNA_PART_LABELS.phosphate };
      parent.add(phosphateMesh);
      pickables.push(phosphateMesh);

      parent.add(dnaWebglBond(THREE, atoms.C5, phosphate, 0.095, materials.phosphodiester));
      if (i > 0) {
        const otherIndex = strand === 0 ? i - 1 : i;
        const other = strand === 0 ? strands[strand][i - 1] : strands[strand][i - 1];
        const from = strand === 0 ? other.atoms.C3 : atoms.C3;
        const to = strand === 0 ? phosphate : other.phosphate;
        parent.add(dnaWebglBond(THREE, from, to, 0.085, materials.phosphodiester));
      }
    }
  }

  for (let i = 0; i < DNA_MODEL.count; i += 1) {
    const baseA = DNA_MODEL.sequence[i % DNA_MODEL.sequence.length];
    const baseB = DNA_MODEL.complement[baseA];
    const left = strands[0][i];
    const right = strands[1][i];
    const pairDir = right.sugarPosition.clone().sub(left.sugarPosition);
    pairDir.y = 0;
    pairDir.normalize();
    const vertical = new THREE.Vector3(0, 1, 0);
    const pairSide = pairDir.clone().cross(vertical).normalize();
    const leftBase = left.sugarPosition.clone().add(pairDir.clone().multiplyScalar(3.45));
    const rightBase = right.sugarPosition.clone().add(pairDir.clone().multiplyScalar(-3.45));
    baseCenters[i] = { leftBase, rightBase, pairDir, pairSide };

    const leftMesh = createDnaWebglBase(THREE, materials, baseA, leftBase, pairDir, dnaWebglPartFocused("base", i));
    const rightMesh = createDnaWebglBase(THREE, materials, baseB, rightBase, pairDir.clone().multiplyScalar(-1), dnaWebglPartFocused("base", i));
    parent.add(leftMesh, rightMesh);
    dnaWebglRegisterPickable(leftMesh, pickables, "base");
    dnaWebglRegisterPickable(rightMesh, pickables, "base");

    parent.add(dnaWebglBond(THREE, left.atoms.C1, leftBase, 0.08, materials.backbone));
    parent.add(dnaWebglBond(THREE, right.atoms.C1, rightBase, 0.08, materials.backbone));

    const hbondOpacity = clamp(1 - open * 1.45, 0, 1);
    if (hbondOpacity > 0.05) {
      const hbondCount = DNA_MODEL.hbonds[baseA];
      for (let h = 0; h < hbondCount; h += 1) {
        const offset = (h - (hbondCount - 1) / 2) * 0.38;
        const start = leftBase.clone().add(pairDir.clone().multiplyScalar(1.12)).add(pairSide.clone().multiplyScalar(offset));
        const end = rightBase.clone().add(pairDir.clone().multiplyScalar(-1.12)).add(pairSide.clone().multiplyScalar(offset));
        const hbond = dnaWebglBond(THREE, start, end, 0.022, materials.hbond(hbondOpacity));
        hbond.userData = { dnaPart: "hbond", dnaLabel: DNA_PART_LABELS.hbond };
        parent.add(hbond);
        pickables.push(hbond);
      }
    }
  }

  const mid = Math.floor(DNA_MODEL.count / 2);
  const labelAnchor = (point, dx = 0, dy = 0, dz = 0) => point.clone().add(new THREE.Vector3(dx, dy, dz));
  if (state.stageIndex === 0) {
    addLabel(
      open > 0.65 ? "氢键已断开 Hydrogen bonds broken" : "氢键 Hydrogen Bonds",
      labelAnchor(baseCenters[mid].leftBase.clone().lerp(baseCenters[mid].rightBase, 0.5), 0, 2.2, 0),
      "#64748b",
    );
  }
  if (state.stageIndex === 1) {
    addLabel("磷酸 Phosphate", labelAnchor(strands[0][mid].phosphate, -2.2, 1.2, 0), DNA_MODEL.colors.phosphate);
    addLabel("脱氧核糖 Deoxyribose", labelAnchor(strands[0][mid].sugarPosition, -2.2, -1.6, 0), DNA_MODEL.colors.sugar);
    addLabel("C1' 连接碱基", labelAnchor(strands[0][mid].atoms.C1, 1.2, -1.1, 0), "#475569");
    addLabel("C5' 连接磷酸", labelAnchor(strands[0][mid].atoms.C5, -1.2, 1.4, 0), "#475569");
    addLabel("C3' 形成链间连接", labelAnchor(strands[0][mid].atoms.C3, -1.2, -1.4, 0), "#475569");
  }
  if (state.stageIndex === 2) {
    addLabel("磷酸-糖骨架 Backbone", labelAnchor(strands[1][mid].phosphate, 2.4, 1.2, 0), "#2563eb");
    addLabel("3',5'-磷酸二酯键", labelAnchor(strands[0][mid].phosphate, -2.2, -1.8, 0), "#2563eb");
  }
  if (state.stageIndex === 3) {
    addLabel("A-T / C-G 互补配对", labelAnchor(baseCenters[mid].leftBase.clone().lerp(baseCenters[mid].rightBase, 0.5), 0, 2.8, 0), "#0f172a");
    addLabel("A/G 双环，C/T 单环", labelAnchor(baseCenters[mid + 1].leftBase.clone().lerp(baseCenters[mid + 1].rightBase, 0.5), 0, -2.8, 0), "#0f172a");
  }
  if (state.stageIndex === 4) {
    addLabel("碱基序列 Base Sequence", labelAnchor(baseCenters[mid].leftBase.clone().lerp(baseCenters[mid].rightBase, 0.5), 0, 3.0, 0), "#0f172a");
  }
  if (state.stageIndex === 5) {
    addLabel("练习目标：点击一个磷酸", labelAnchor(strands[0][mid].phosphate, -2.8, 1.8, 0), DNA_MODEL.colors.phosphate);
  }

  addLabel("5'端", labelAnchor(strands[0][DNA_MODEL.count - 1].phosphate, -1.2, 2.2, 0), "#0f172a");
  addLabel("3'端", labelAnchor(strands[0][0].sugarPosition, -1.2, -2.2, 0), "#0f172a");
  addLabel("3'端", labelAnchor(strands[1][DNA_MODEL.count - 1].sugarPosition, 1.2, 2.2, 0), "#0f172a");
  addLabel("5'端", labelAnchor(strands[1][0].phosphate, 1.2, -2.2, 0), "#0f172a");
}

function buildDnaWebglSharedMolecule(THREE, parent, pickables, addLabel) {
  const materialCache = new Map();
  const toVec = (point) => new THREE.Vector3(point.x, point.y, point.z || 0);
  const objects = buildDnaObjects();

  const materialFor = (object, extra = {}) => {
    const dim = (state.highlight || state.teacher) && !object.focus;
    const baseOpacity = object.opacity ?? (object.kind === "line" && object.dash ? 0.72 : 1);
    const opacity = dim ? Math.min(baseOpacity, 0.18) : baseOpacity;
    const color = object.color || "#64748B";
    const focus = object.focus && (state.highlight || state.teacher);
    const key = `${color}-${opacity}-${focus}-${extra.flat ? "flat" : "solid"}`;
    if (materialCache.has(key)) return materialCache.get(key);

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: extra.flat ? 0.42 : 0.3,
      metalness: 0,
      clearcoat: extra.flat ? 0.32 : 0.62,
      clearcoatRoughness: 0.28,
      side: THREE.DoubleSide,
      transparent: opacity < 0.98,
      opacity,
      depthWrite: opacity > 0.72,
      emissive: focus ? new THREE.Color(0xf59e0b) : new THREE.Color(0x000000),
      emissiveIntensity: focus ? 0.18 : 0,
    });
    materialCache.set(key, material);
    return material;
  };

  const addPickable = (object, source) => {
    object.traverse?.((child) => {
      if (!child.isMesh && !child.isSprite) return;
      child.userData = {
        ...child.userData,
        dnaPart: source.part,
        dnaLabel: DNA_PART_LABELS[source.part] || source.part,
      };
      pickables.push(child);
    });
  };

  objects
    .filter((object) => object.kind === "line")
    .forEach((object) => {
      const material = materialFor(object);
      const start = toVec(object.p1);
      const end = toVec(object.p2);
      const radius = object.dash ? Math.max(0.018, object.width * 0.24) : Math.max(0.04, object.width * 0.58);
      const group = object.dash
        ? dnaWebglDashedBond(THREE, start, end, radius, material)
        : dnaWebglBond(THREE, start, end, radius, material);
      parent.add(group);
      addPickable(group, object);
    });

  objects
    .filter((object) => object.kind !== "line")
    .forEach((object) => {
      if (object.kind === "sphere") {
        const geometry = dnaWebglSharedGeometry(
          `sphere:${object.r.toFixed(3)}`,
          () => new THREE.SphereGeometry(object.r, 20, 14),
        );
        const mesh = new THREE.Mesh(geometry, materialFor(object));
        mesh.position.copy(toVec(object.p));
        parent.add(mesh);
        addPickable(mesh, object);
      }

      if (object.kind === "polygon") {
        const mesh = dnaWebglPolygonMesh(THREE, object, materialFor(object, { flat: true }));
        parent.add(mesh);
        addPickable(mesh, object);
      }

      if (object.kind === "text") {
        const sprite = createDnaWebglTextSprite(THREE, object.text, object.color || "#0F172A");
        const size = object.size || 14;
        sprite.position.copy(toVec(object.p));
        sprite.scale.set(size * 0.15, size * 0.105, 1);
        parent.add(sprite);
        sprite.userData = {
          dnaPart: object.part,
          dnaLabel: DNA_PART_LABELS[object.part] || object.part,
        };
        pickables.push(sprite);
      }
    });

  addDnaWebglSharedTeachingLabels(THREE, addLabel);
}

function dnaWebglPolygonMesh(THREE, object, material) {
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

  const localPoints = points.map((point) => {
    const relative = point.clone().sub(origin);
    return { x: relative.dot(xAxis), y: relative.dot(yAxis) };
  });
  const depth = object.thickness || 0.45;
  const geometryKey = `polygon:${depth.toFixed(3)}:${localPoints.map((point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`).join(";")}`;
  const geometry = dnaWebglSharedGeometry(geometryKey, () => {
    const shape = new THREE.Shape();
    localPoints.forEach((point, index) => {
      if (index === 0) shape.moveTo(point.x, point.y);
      else shape.lineTo(point.x, point.y);
    });
    shape.closePath();

    const sharedGeometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.045,
      bevelSegments: 1,
    });
    sharedGeometry.translate(0, 0, -depth / 2);
    return sharedGeometry;
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(origin);
  mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, normal));
  return mesh;
}

function dnaWebglDashedBond(THREE, start, end, radius, material) {
  const group = new THREE.Group();
  const vector = end.clone().sub(start);
  const length = vector.length();
  if (length < 0.001) return group;

  const direction = vector.clone().normalize();
  const dashCount = clamp(Math.floor(length / 0.82), 2, 12);
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

function addDnaWebglSharedTeachingLabels(THREE, addLabel) {
  const toVec = (point) => new THREE.Vector3(point.x, point.y, point.z || 0);
  const midIndex = Math.floor(DNA_MODEL.count / 2);
  const midPair = lerpPoint(dnaPoint(0, midIndex), dnaPoint(1, midIndex), 0.5);
  const open = state.dnaOpen || 0;

  if (state.stageIndex === 0) {
    addLabel(open > 0.65 ? "氢键已断开 Hydrogen bonds broken" : "氢键 Hydrogen Bonds", toVec(midPair), "#64748b", { x: 84, y: -28 });
  }
  if (state.stageIndex === 1) {
    addLabel("磷酸 Phosphate", toVec(dnaPoint(0, midIndex + 0.5)), DNA_MODEL.colors.phosphate, { x: -120, y: -62 });
    addLabel("脱氧核糖 Deoxyribose", toVec(dnaPoint(0, midIndex)), DNA_MODEL.colors.sugar, { x: -124, y: 24 });
    addLabel("C1' 连碱基", toVec(sugarAtomPoint(0, midIndex, "C1")), "#475569", { x: 76, y: -30 });
    addLabel("C5' 连磷酸", toVec(sugarAtomPoint(0, midIndex, "C5")), "#475569", { x: -88, y: -18 });
    addLabel("C3' 连下一个核苷酸", toVec(sugarAtomPoint(0, midIndex, "C3")), "#475569", { x: -52, y: 86 });
  }
  if (state.stageIndex === 2) {
    addLabel("磷酸-糖骨架 Backbone", toVec(dnaPoint(1, midIndex)), "#2563eb", { x: 96, y: -26 });
    addLabel("3',5'-磷酸二酯键", toVec(phosphodiesterPoint(0, midIndex - 1)), "#2563eb", { x: -98, y: 34 });
  }
  if (state.stageIndex === 3) {
    addLabel("A-T / C-G 互补配对", toVec(midPair), "#0f172a", { x: 84, y: -34 });
    addLabel("A/G 双环，C/T 单环", toVec(lerpPoint(dnaPoint(0, midIndex + 1), dnaPoint(1, midIndex + 1), 0.5)), "#0f172a", { x: -92, y: 34 });
  }
  if (state.stageIndex === 4) {
    addLabel("碱基序列 Base Sequence", toVec(midPair), "#0f172a", { x: 92, y: -34 });
  }
  if (state.stageIndex === 5) {
    addLabel("练习目标：点击一个磷酸", toVec(dnaPoint(0, midIndex + 0.5)), DNA_MODEL.colors.phosphate, { x: -108, y: -40 });
  }

  addLabel("5'端", toVec(dnaPoint(0, 0)), "#0f172a", { x: -52, y: 24 });
  addLabel("3'端", toVec(dnaPoint(0, DNA_MODEL.count - 1)), "#0f172a", { x: -56, y: -28 });
  addLabel("3'端", toVec(dnaPoint(1, 0)), "#0f172a", { x: 52, y: 24 });
  addLabel("5'端", toVec(dnaPoint(1, DNA_MODEL.count - 1)), "#0f172a", { x: 56, y: -28 });
}

function dnaWebglMaterials(THREE) {
  const color = (hex, mix = 0.12) => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), mix);
  const standard = (hex, mix = 0.12, extra = {}) =>
    new THREE.MeshPhysicalMaterial({
      color: color(hex, mix),
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.45,
      clearcoatRoughness: 0.28,
      side: THREE.DoubleSide,
      ...extra,
    });

  return {
    phosphate: standard(DNA_MODEL.colors.phosphate, 0.1, { roughness: 0.24, clearcoat: 0.72 }),
    phosphateFocus: standard(DNA_MODEL.colors.phosphate, 0.02, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.18, roughness: 0.22 }),
    sugar: standard(DNA_MODEL.colors.sugar, 0.1, { roughness: 0.38, clearcoat: 0.38 }),
    sugarFocus: standard(DNA_MODEL.colors.sugar, 0.02, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.14 }),
    sugarCarbon: standard(DNA_MODEL.colors.sugarCarbon, 0.02, { roughness: 0.3 }),
    sugarOxygen: standard(DNA_MODEL.colors.sugarOxygen, 0.04, { roughness: 0.26 }),
    backbone: standard(DNA_MODEL.colors.backbone, 0.1, { roughness: 0.36 }),
    phosphodiester: standard(DNA_MODEL.colors.phosphodiester, 0.08, { roughness: 0.34 }),
    base: (base, focus = false) =>
      standard(DNA_MODEL.colors[base], focus ? 0.02 : 0.12, focus ? { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.13 } : { roughness: 0.4 }),
    baseEdge: standard("#475569", 0.04, { roughness: 0.28 }),
    hbond: (opacity) =>
      standard(DNA_MODEL.colors.hbond, 0.04, {
        transparent: true,
        opacity: opacity * 0.62,
        depthWrite: false,
        clearcoat: 0.1,
      }),
  };
}

function dnaWebglPoint(THREE, strand, index, open) {
  const phase = strand === 0 ? 0 : DNA_MODEL.offset;
  const angle = index * DNA_MODEL.twist + phase;
  const y = index * DNA_MODEL.rise + DNA_MODEL.y0;
  const closed = new THREE.Vector3(DNA_MODEL.radius * Math.cos(angle), y, DNA_MODEL.radius * Math.sin(angle));
  const opened = new THREE.Vector3(strand === 0 ? -DNA_THREE_OPEN_SPACING : DNA_THREE_OPEN_SPACING, y, 0);
  return closed.lerp(opened, open);
}

function dnaWebglOutward(THREE, strand, index, open) {
  const phase = strand === 0 ? 0 : DNA_MODEL.offset;
  const angle = index * DNA_MODEL.twist + phase;
  const closed = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
  const opened = new THREE.Vector3(strand === 0 ? -1 : 1, 0, 0);
  return closed.lerp(opened, open).normalize();
}

function dnaWebglSugarAtoms(THREE, origin, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return Object.fromEntries(
    Object.entries(DNA_THREE_SUGAR_ATOMS).map(([key, point]) => {
      const x = point.x * cos - point.y * sin;
      const y = point.x * sin + point.y * cos;
      return [key, new THREE.Vector3(origin.x + x, origin.y + y, origin.z + point.z)];
    }),
  );
}

function createDnaWebglSugar(THREE, materials, item, focus) {
  const group = new THREE.Group();
  group.position.copy(item.sugarPosition);
  group.rotation.z = item.sugarAngle;

  const ringPoints = ["O4", "C1", "C2", "C3", "C4"].map((key) => DNA_THREE_SUGAR_ATOMS[key]);
  const geometry = dnaWebglPlateGeometry(THREE, ringPoints, 0.34, false);
  const sugar = new THREE.Mesh(geometry, focus ? materials.sugarFocus : materials.sugar);
  sugar.userData = { dnaPart: "sugar", dnaLabel: DNA_PART_LABELS.sugar };
  group.add(sugar);

  ["O4", "C1", "C2", "C3", "C4"].forEach((key, index, atoms) => {
    const next = atoms[(index + 1) % atoms.length];
    group.add(
      dnaWebglBond(
        THREE,
        dnaWebglVecFromPlain(THREE, DNA_THREE_SUGAR_ATOMS[key]),
        dnaWebglVecFromPlain(THREE, DNA_THREE_SUGAR_ATOMS[next]),
        0.055,
        key === "O4" || next === "O4" ? materials.sugarOxygen : materials.sugarCarbon,
      ),
    );
  });
  group.add(
    dnaWebglBond(
      THREE,
      dnaWebglVecFromPlain(THREE, DNA_THREE_SUGAR_ATOMS.C4),
      dnaWebglVecFromPlain(THREE, DNA_THREE_SUGAR_ATOMS.C5),
      0.055,
      materials.sugarCarbon,
    ),
  );

  Object.entries(DNA_THREE_SUGAR_ATOMS).forEach(([key, point]) => {
    const material = key === "O4" ? materials.sugarOxygen : materials.sugarCarbon;
    const atom = new THREE.Mesh(new THREE.SphereGeometry(key === "C5" ? 0.28 : 0.24, 20, 14), material);
    atom.position.set(point.x, point.y, 0.24);
    atom.userData = { dnaPart: "sugar", dnaLabel: `${key}' / Deoxyribose atom` };
    group.add(atom);
  });

  return group;
}

function createDnaWebglBase(THREE, materials, base, position, xAxis, focus) {
  const group = new THREE.Group();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const zAxis = xAxis.clone().cross(yAxis).normalize();
  const matrix = new THREE.Matrix4().makeBasis(xAxis.clone().normalize(), yAxis, zAxis);
  group.quaternion.setFromRotationMatrix(matrix);
  group.position.copy(position);
  group.userData = { dnaPart: "base", dnaLabel: `${base} 碱基 / Base` };

  if (base === "A" || base === "G") {
    group.add(dnaWebglRingPlate(THREE, materials, base, 6, -0.42, 0.68, 0.56, focus));
    group.add(dnaWebglRingPlate(THREE, materials, base, 5, 0.58, 0.55, 0.5, focus, Math.PI / 5));
  } else {
    group.add(dnaWebglRingPlate(THREE, materials, base, 6, 0, 0.72, 0.58, focus));
  }

  const letter = createDnaWebglTextSprite(THREE, base, DNA_MODEL.colors[base]);
  letter.position.set(0, 0.42, 0);
  letter.scale.set(1.85, 1.15, 1);
  group.add(letter);
  return group;
}

function dnaWebglRingPlate(THREE, materials, base, sides, cx, rx, ry, focus, start = Math.PI / 6) {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = start + (index / sides) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * rx, y: Math.sin(angle) * ry, z: 0 };
  });
  const group = new THREE.Group();
  const plate = new THREE.Mesh(dnaWebglPlateGeometry(THREE, points, 0.26, true), materials.base(base, focus));
  plate.userData = { dnaPart: "base", dnaLabel: `${base} 碱基 / Base` };
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
  const geometry = dnaWebglSharedGeometry("unit-bond-cylinder", () => new THREE.CylinderGeometry(1, 1, 1, 10, 1, false));
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(from.clone().add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.scale.set(radius, length, radius);
  return mesh;
}

function createDnaWebglTextSprite(THREE, text, color) {
  const textureKey = `${text}:${color}`;
  let texture = dnaWebglTextTextureCache.get(textureKey);
  if (!texture) {
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
    texture = new THREE.CanvasTexture(canvas);
    texture.userData = { ...texture.userData, dnaSharedTextTexture: true };
    dnaWebglTextTextureCache.set(textureKey, texture);
  }
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 30;
  sprite.userData.texture = texture;
  return sprite;
}

function dnaWebglRegisterPickable(object, pickables, part) {
  object.traverse((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData = { ...child.userData, dnaPart: child.userData.dnaPart || part };
      pickables.push(child);
    }
  });
}

function dnaWebglPartFocused(part, index) {
  const focus = dnaFocusTags();
  if (part === "base" && focus.includes("sequence")) return true;
  if (part === "nucleotide" && focus.includes("nucleotide") && index === Math.floor(DNA_MODEL.count / 2)) return true;
  return focus.includes(part);
}

function dnaWebglVecFromPlain(THREE, point) {
  return new THREE.Vector3(point.x, point.y, point.z || 0);
}

function disposeDnaWebglObject(object) {
  object.traverse?.((child) => {
    if (!child.geometry?.userData?.dnaSharedGeometry) child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      if (!material.map?.userData?.dnaSharedTextTexture) material.map?.dispose?.();
      material.dispose?.();
    });
    if (!child.userData?.texture?.userData?.dnaSharedTextTexture) child.userData?.texture?.dispose?.();
  });
}

const ANDER_MODEL_ADAPTER = Object.freeze({
  id: "dna-webgl",
  visual: () => dnaWebglVisual(),
  mount: () => { mountDnaWebgl(); mountDnaReferenceDisclosure(); },
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
  const scene=refs.stage.querySelector('[data-dna-webgl-shell]');scene.classList.add('structure-scene');
  let info=refs.stage.querySelector('.dna-webgl-sidecar');
  if(!info){info=document.createElement('aside');layout.append(info);}info.classList.add('structure-info');info.setAttribute('aria-label','结构与说明');
  // Reuse the scientific input and readout outside the explanatory panel.
  const control=info.querySelector('[data-dna-webgl-state-control]'),input=control.querySelector('input'),value=control.querySelector('[data-dna-webgl-open-value]');
  input.setAttribute('data-timeline','');input.setAttribute('aria-label','DNA 双链分离程度');
  root.querySelector('.structure-timeline').append(input,value);control.remove();
  const summary=document.createElement('section');summary.className='structure-stage-summary';summary.innerHTML='<h2 data-structure-stage-title></h2><p data-structure-stage-description></p>';info.prepend(summary);
  const trigger=document.createElement('button');trigger.type='button';trigger.className='shell-action structure-context-trigger';trigger.dataset.structureContext='';trigger.textContent='结构与说明 ↗';layout.append(trigger);
  trigger.addEventListener('click',event=>openStructureContext(event.currentTarget));
  let feedback=root.querySelector('[data-dna-webgl-feedback]');if(!feedback){feedback=document.createElement('p');feedback.setAttribute('data-dna-webgl-feedback','');scene.append(feedback);}feedback.classList.add('structure-feedback');feedback.setAttribute('aria-live','polite');
}
function syncStructureInfo(){
  const title=root.querySelector('[data-structure-stage-title]'),description=root.querySelector('[data-structure-stage-description]');
  if(title)title.textContent=currentStage().title;if(description)description.textContent=currentStage().explanation;
  const disclosure=root.querySelector('[data-dna-reference-disclosure]');if(disclosure){const open=state.dnaReferenceOpen;disclosure.classList.toggle('is-open',open);const button=disclosure.querySelector('button');button?.setAttribute('aria-expanded',String(open));if(button?.querySelector('strong'))button.querySelector('strong').textContent=open?'收起':'展开';const wrap=disclosure.querySelector('.dna-reference-panel-wrap');if(wrap)wrap.hidden=!open;}
}
function openStructureContext(trigger){shellExperience?.showPanel(root.querySelector('.structure-info'),'结构与说明',trigger);}
function mountStructureExperience(){
 if(shellExperience)return;const shell=globalThis.AnderModelShell;
 const help='<p>单指或鼠标左键拖动旋转；双指移动或鼠标右键拖动平移；双指捏合或滚轮缩放。点选结构查看名称，拖动底部“双链分离”滑杆实时观察分子变化；点“结构与说明”查看阶段说明。</p><p>播放控制模型原有运动；速度、标签、高亮和视角在手机的“观察”面板中。重置回到第一阶段和默认观察状态。</p><p>沉浸模式放大画面，松手 2 秒后收起上下控件，轻触唤出；操作面板时保持显示。收藏由打开模型的网站提供。</p>';
 const onSettings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'还原视角',run:()=>{state.viewIndex=0;state.dnaWebglViewIndex=-1;render();shellExperience.closeDialog();}}]);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();else shellExperience.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);};
 shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('[data-dna-webgl-viewport]'),title:ANDER_MODEL_MANIFEST.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'结构与说明',onSettings,onContext:openStructureContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>structureRuntime?.resize())});
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
