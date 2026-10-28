"use strict";

const ANDER_MODEL_CONTENT = {"id":"transport","accent":"#F59E0B","title":"物质跨膜运输","titleEn":"Membrane Transport","chapter":"物质输入和输出 / Transport Across Membranes","type":"2D 动态样板","state":"过程演示","visual":"transport","structures":[["小分子 Small Molecule","#38BDF8"],["通道蛋白 Channel Protein","#7ECCEB"],["载体蛋白 Carrier Protein","#A855F7"],["ATP / ADP / Pi","#EF4444"],["协同转运 Cotransport","#F59E0B"],["浓度梯度 Concentration Gradient","#2563EB"]],"stages":[{"title":"物质运输","titleEn":"Transport Overview","goal":"在同一条细胞膜上比较五种跨膜运输方式，观察是否需要蛋白质、是否消耗 ATP，以及运输方向和构象变化的差异。","keywords":["跨膜运输 Membrane Transport","浓度梯度 Gradient","膜蛋白 Membrane Protein","ATP"],"explanation":"物质跨膜运输包括不需要蛋白质的自由扩散，也包括依赖通道蛋白或载体蛋白的运输方式。不同方式的共同点是都发生在细胞膜上，差异主要体现在是否需要膜蛋白、运输方向是否顺浓度梯度、是否直接或间接需要能量。","mistake":"不要把所有通过膜蛋白的运输都称为主动运输；协助扩散需要蛋白质，但不直接消耗 ATP，方向仍然是顺浓度梯度。","question":"观察五种运输方式时，可以从哪些角度判断它们是否需要能量？","id":"overview"},{"title":"自由扩散","titleEn":"Simple Diffusion","goal":"观察脂溶性小分子或气体分子直接顺浓度梯度通过磷脂双分子层。","keywords":["自由扩散 Diffusion","浓度梯度 Gradient"],"explanation":"自由扩散不需要膜蛋白，也不消耗 ATP，物质从高浓度一侧向低浓度一侧移动。","mistake":"不是所有小分子都能自由扩散；带电离子和较大的极性分子通常需要膜蛋白帮助。","question":"氧气、二氧化碳这类分子为什么可以直接通过磷脂双分子层？","id":"simple-diffusion"},{"title":"通道蛋白协助扩散","titleEn":"Channel-Mediated Facilitated Diffusion","goal":"观察离子或水分子通过通道蛋白顺浓度梯度扩散。","keywords":["通道蛋白 Channel","协助扩散 Facilitated Diffusion","顺浓度梯度"],"explanation":"通道蛋白提供亲水通道，使特定离子或水分子顺浓度梯度快速通过细胞膜，不直接消耗 ATP。","mistake":"通道蛋白不是把物质主动推过去，而是提供选择性通路。","question":"为什么 Na+、K+ 等离子通常不能像氧气一样直接穿过磷脂双分子层？","id":"channel"},{"title":"载体蛋白协助扩散","titleEn":"Carrier-Mediated Facilitated Diffusion","goal":"观察溶质与载体蛋白结合后，载体构象改变并顺浓度梯度释放溶质。","keywords":["载体蛋白 Carrier","构象变化 Conformational Change","不消耗 ATP"],"explanation":"载体蛋白协助扩散需要溶质先与载体结合，载体蛋白改变形状后把溶质释放到另一侧，但运输方向仍然是顺浓度梯度。","mistake":"载体蛋白发生构象变化不等于一定消耗 ATP。","question":"葡萄糖进入某些细胞时，为什么可能需要载体蛋白？","id":"carrier"},{"title":"载体主动运输","titleEn":"ATP-Driven Active Transport","goal":"观察载体蛋白利用 ATP 水解释放的能量，将物质逆浓度梯度运输。","keywords":["主动运输 Active Transport","ATP","逆浓度梯度 Against Gradient"],"explanation":"主动运输通常需要载体蛋白，并消耗 ATP，使物质可以从低浓度一侧运输到高浓度一侧。","mistake":"逆浓度梯度运输不能只靠扩散完成，需要能量输入。","question":"为什么主动运输对细胞维持内部环境很重要？","id":"active"},{"title":"协同转运","titleEn":"Cotransport","goal":"观察一种物质顺浓度梯度移动时，带动另一种物质逆浓度梯度通过同一载体。","keywords":["协同转运 Cotransport","次级主动运输 Secondary Active Transport","同向/反向转运"],"explanation":"协同转运利用某种物质已有的浓度梯度作为能量来源，带动另一种物质逆浓度梯度运输，属于主动运输的一种形式。","mistake":"协同转运不一定直接消耗 ATP，但它依赖先前建立的浓度梯度。","question":"为什么协同转运可以不直接消耗 ATP，却仍然属于主动运输？","id":"cotransport"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"transport","version":"2.3.0","publish":true,"title":{"zh":"物质跨膜运输模型","en":"Membrane Transport Model"},"summary":{"zh":"恢复 2.1.4 的载体凹坑绘制与构象切换，保留后续非凹坑改进。","en":"Restore the carrier pocket drawing and conformation switching from 2.1.4 while retaining later non-pocket improvements."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"2.5d-canvas","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"物质运输","en":"Transport Overview"}},{"id":"simple-diffusion","title":{"zh":"自由扩散","en":"Simple Diffusion"}},{"id":"channel","title":{"zh":"通道蛋白协助扩散","en":"Channel-Mediated Diffusion"}},{"id":"carrier","title":{"zh":"载体蛋白协助扩散","en":"Carrier-Mediated Diffusion"}},{"id":"active","title":{"zh":"载体主动运输","en":"ATP-Driven Active Transport"}},{"id":"cotransport","title":{"zh":"协同转运","en":"Cotransport"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","scene-navigation.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"transport","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"activeTransportSelected":"","activeTransportParticleSpeed":0.16,"transportProgress":0.08,"transportPlayStartTime":0,"transportPlayStartProgress":0.08};
const speeds = [0.5, 1, 1.5, 2];
const views = ["整体视角", "局部视角", "侧面视角", "顶部视角", "底部视角"];
const state = cloneValue(ANDER_MODEL_DEFAULT_STATE);
const models = [ANDER_MODEL_CONTENT];
let dnaAnimationFrame = 0;
let dnaWebglAnimationFrame = 0;
let dnaWebglCleanup = null;
let threeModulePromise = null;
let shellExperience=null, sceneRuntime=null, sceneNavigation=null;

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
        <h1>${currentModel().title} <small>/ ${currentModel().titleEn}</small></h1>
      </div>
      <button class="shell-icon-button" type="button" data-foundation-settings aria-label="显示与操作"></button>
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
          <div class="control-group control-group-personal"><button class="control-button" type="button" data-shell-tools></button><button class="control-button" type="button" data-shell-help></button><button class="control-button" type="button" data-shell-favorite></button><button class="control-button" type="button" data-action="fullscreen"></button></div>
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
  refs.stageStrip.style.setProperty('--stage-count',String(currentModel().stages.length));
  if(!refs.stageStrip.children.length) refs.stageStrip.innerHTML=currentModel().stages.map((stage,index)=>`<button class="stage-tab" type="button" data-stage-index="${index}">${globalThis.AnderModelShell.stageContent(index,stage.title,stage.titleEn)}</button>`).join('');
  refs.stageStrip.querySelectorAll('[data-stage-index]').forEach((b,i)=>{b.classList.toggle('is-active',i===state.stageIndex);if(i===state.stageIndex)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  shellExperience?.syncStage();
}

function stopVisualRuntime() {
  if (dnaAnimationFrame) cancelAnimationFrame(dnaAnimationFrame);
  if (dnaWebglAnimationFrame) cancelAnimationFrame(dnaWebglAnimationFrame);
  dnaAnimationFrame = 0;
  dnaWebglAnimationFrame = 0;
  if (typeof dnaWebglCleanup === "function") dnaWebglCleanup();
  dnaWebglCleanup = null;
}



function updateControls() {
  const set = (action, name, label) => {
    const button = $(`[data-action="${action}"]`);
    if(button&&button.dataset.controlSignature!==name+'|'+label){globalThis.AnderModelShell.setControl(button,name,label);button.dataset.controlSignature=name+'|'+label;}
  };
  set("play", state.playing ? "pause" : "play", state.playing ? "暂停" : "播放");
  set("reset", "reset", "重置");
  set("prev", "prev", "上一阶段");
  set("next", "next", "下一阶段");
  set("speed", "speed", `${speeds[state.speedIndex]}x`);
  set("labels", "labels", "标签");
  set("highlight", "highlight", "高亮");
  set("view", "view", "视角");
  set("practice", "practice", "练习");
  $(`[data-action="labels"]`)?.setAttribute("aria-pressed", String(state.labels));
  $(`[data-action="highlight"]`)?.setAttribute("aria-pressed", String(state.highlight));
}

function renderVisual() {
  if(!refs.stage.firstElementChild){
    refs.stage.innerHTML=`<div class="visual-wrap ${ANDER_MODEL_ADAPTER.wrapClass||''}">${ANDER_MODEL_ADAPTER.visual()}</div>`;
    prepareFoundationLayout();
    requestAnimationFrame(()=>ANDER_MODEL_ADAPTER.mount?.());
  }
  const visual=refs.stage.querySelector('.visual-wrap');
  visual.classList.toggle('hidden-labels',!state.labels);visual.classList.toggle('highlight-on',state.highlight);visual.classList.toggle('playing',state.playing);
  refs.stage.style.setProperty('--speed-factor',speeds[state.speedIndex]);
  sceneRuntime?.sync();syncFoundationInfo();
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
  sceneNavigation?.reset();
  render();
}


const TRANSPORT_2D_PLAY_RATE = 0.2;

const TRANSPORT_2D_DEFAULT_PARTICLE_SPEED = 0.16;

const TRANSPORT_STRUCTURE_TUNING_DEFS = Object.freeze({
  atpRibose: {
    label: "ATP 五碳糖",
    controls: [
      { key: "color", label: "颜色", type: "color", default: "#fdba74" },
      { key: "size", label: "大小", type: "range", min: 60, max: 150, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -32, max: 32, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -32, max: 32, step: 1, default: 0, unit: "px" },
    ],
  },
  atpMolecule: {
    label: "ATP / ADP 整体",
    controls: [
      { key: "size", label: "整体大小", type: "range", min: 60, max: 145, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -48, max: 48, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -48, max: 48, step: 1, default: 0, unit: "px" },
    ],
  },
  activeProtein: {
    label: "主动运输蛋白",
    controls: [
      { key: "color", label: "颜色", type: "color", default: "#a855f7" },
      { key: "width", label: "左右宽度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "height", label: "上下高度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "pocket", label: "凹坑明显程度", type: "range", min: 45, max: 160, step: 1, default: 100, unit: "%" },
    ],
  },
  facilitatedProtein: {
    label: "载体蛋白协助扩散",
    controls: [
      { key: "color", label: "颜色", type: "color", default: "#22c55e" },
      { key: "width", label: "左右宽度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "height", label: "上下高度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "pocket", label: "凹坑明显程度", type: "range", min: 45, max: 160, step: 1, default: 100, unit: "%" },
    ],
  },
  cotransportProtein: {
    label: "协同转运蛋白",
    controls: [
      { key: "color", label: "颜色", type: "color", default: "#f97316" },
      { key: "width", label: "左右宽度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "height", label: "上下高度", type: "range", min: 82, max: 128, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "pocket", label: "凹坑明显程度", type: "range", min: 45, max: 160, step: 1, default: 100, unit: "%" },
    ],
  },
  channelProtein: {
    label: "通道蛋白",
    controls: [
      { key: "color", label: "颜色", type: "color", default: "#06b6d4" },
      { key: "width", label: "左右宽度", type: "range", min: 82, max: 135, step: 1, default: 100, unit: "%" },
      { key: "height", label: "上下高度", type: "range", min: 78, max: 122, step: 1, default: 100, unit: "%" },
      { key: "x", label: "水平位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
      { key: "y", label: "上下位置", type: "range", min: -40, max: 40, step: 1, default: 0, unit: "px" },
    ],
  },
  membraneLipids: {
    label: "磷脂分子",
    controls: [
      { key: "headColor", label: "头部颜色", type: "color", default: "#7dd3fc" },
      { key: "tailColor", label: "尾部颜色", type: "color", default: "#bae6fd" },
      { key: "size", label: "整体粗细", type: "range", min: 75, max: 135, step: 1, default: 100, unit: "%" },
    ],
  },
});

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function transportStructureDefaults(structureId) {
  const definition = TRANSPORT_STRUCTURE_TUNING_DEFS[structureId];
  if (!definition) return {};
  return definition.controls.reduce((result, control) => {
    result[control.key] = control.default;
    return result;
  }, {});
}

function activeTransport2dLipidTailPath(x, y, leaflet, side, wave, bend = 0) {
  const midY = y + leaflet * 19;
  const endY = y + leaflet * (41.5 - Math.min(5, Math.abs(wave) * 0.9));
  const midX = x + side * (5.1 + wave * 1.25) + bend * 0.66;
  const endX = x + side * (8.2 + wave * 2.15) + bend * 0.92;
  return `M${x} ${y} C${midX} ${midY - leaflet * 9.4} ${midX - side * (2.2 + Math.abs(bend) * 0.24)} ${midY + leaflet * 8.2} ${endX} ${endY}`;
}

function activeTransport2dNoise(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function activeTransport2dValueNoise(seed, t) {
  const index = Math.floor(t);
  const fraction = t - index;
  const eased = fraction * fraction * (3 - 2 * fraction);
  const a = activeTransport2dNoise(seed + index * 17.17);
  const b = activeTransport2dNoise(seed + (index + 1) * 17.17);
  return activeTransport2dMixNumber(a, b, eased) * 2 - 1;
}

function activeTransport2dBrownianNoise(seed, t) {
  const slow = activeTransport2dValueNoise(seed, t);
  const middle = activeTransport2dValueNoise(seed + 19.31, t * 2.17 + 3.7) * 0.48;
  const fine = activeTransport2dValueNoise(seed + 43.83, t * 4.33 + 8.9) * 0.18;
  return (slow + middle + fine) / 1.66;
}

function activeTransport2dReflect(value, min, max) {
  const span = max - min;
  if (span <= 0) return min;
  const wrapped = ((value - min) % (span * 2) + span * 2) % (span * 2);
  return wrapped > span ? max - (wrapped - span) : min + wrapped;
}

function activeTransport2dParticleTransform(particle, time, particleSpeed) {
  const baseX = Number(particle.dataset.baseX);
  const baseY = Number(particle.dataset.baseY);
  const phase = Number(particle.dataset.phase);
  const phaseB = Number(particle.dataset.phaseB) || phase * 1.73;
  const speed = Number(particle.dataset.speed) || 0.1;
  const rangeX = Number(particle.dataset.rangeX) || 80;
  const rangeY = Number(particle.dataset.rangeY) || 24;
  const laneY = Number(particle.dataset.laneY) || baseY;
  const jitter = Number(particle.dataset.jitter) || 0.3;
  const side = particle.dataset.side;
  const minX = Number(particle.dataset.minX || 24);
  const maxX = Number(particle.dataset.maxX || 936);
  const minY = Number(particle.dataset.minY || (side === "outside" ? 28 : 368));
  const maxY = Number(particle.dataset.maxY || (side === "outside" ? 192 : 532));
  const direction = Number(particle.dataset.direction) || 1;
  const seed = phase * 97 + phaseB * 31 + direction * 11;
  const motion = time * (0.32 + speed * 2.4) * (0.7 + particleSpeed * 5);
  const driftX = activeTransport2dBrownianNoise(seed, motion) * rangeX
    + activeTransport2dBrownianNoise(seed + 71.9, motion * 1.7) * rangeX * jitter * 0.32;
  const driftY = activeTransport2dBrownianNoise(seed + 137.5, motion * 1.08) * rangeY
    + activeTransport2dBrownianNoise(seed + 211.2, motion * 2.1) * rangeY * jitter * 0.28;
  const x = activeTransport2dReflect(baseX + driftX, minX, maxX);
  const y = activeTransport2dReflect(laneY + driftY, minY, maxY);
  const spin = Number(particle.dataset.spin || 0);
  const rotation = spin ? (time * spin * 42 + phase * 30) % 360 : 0;
  return `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})`;
}

function activeTransport2dUpdateLipidTail(tail, time, particleSpeed) {
  const x = Number(tail.dataset.x);
  const y = Number(tail.dataset.y);
  const leaflet = Number(tail.dataset.leaflet);
  const side = Number(tail.dataset.side);
  const phase = Number(tail.dataset.phase);
  const amp = Number(tail.dataset.amp) || 0.8;
  const bend = Number(tail.dataset.bend) || 0;
  const tailMotion = time * (0.32 + particleSpeed * 4.8);
  const wave = Math.sin(tailMotion + phase) * amp
    + Math.cos(tailMotion * 1.34 + phase * 1.9) * amp * 0.52;
  const liveBend = bend + Math.sin(tailMotion * 0.9 + phase * 1.31) * amp * 0.58;
  tail.setAttribute("d", activeTransport2dLipidTailPath(x, y, leaflet, side, wave, liveBend));
}

function activeTransport2dNucleotide(label, phosphateCount) {
  if (label === "Pi") {
    return `
      <g class="active-transport-2d-pi">
        ${activeTransport2dPhosphateGroup(0, 0, "Pi")}
      </g>
    `;
  }
  const phosphates = [];
  for (let i = 0; i < phosphateCount; i += 1) {
    const x = 17 + i * 19;
    const terminal = i === phosphateCount - 1 && label === "ATP";
    phosphates.push(activeTransport2dPhosphateGroup(x, 0, terminal ? "P" : "", terminal));
    if (i > 0) phosphates.push(`<path class="phosphate-bond" d="M${x - 12} 0 L${x - 8} 0" />`);
  }
  return `
    <g class="active-transport-2d-nucleotide">
      <g class="active-transport-2d-nucleotide-body" data-nucleotide-body>
        <g class="active-transport-2d-adenosine">
          <polygon class="adenine-ring" points="-58,-10 -47,-18 -34,-13 -31,1 -40,12 -55,8" />
          <polygon class="adenine-ring adenine-ring-small" points="-34,-13 -20,-8 -17,6 -29,14 -40,12 -31,1" />
          <path class="nucleotide-bond" d="M-22 3 L-11 0" />
          <polygon class="ribose-ring" points="-10,-13 4,-4 0,11 -16,12 -23,-3" />
          <path class="phosphate-bond" d="M4 0 L10 0" />
        </g>
        ${phosphates.join("")}
        <text x="22" y="-22" data-atp-label>${label}</text>
        <text x="22" y="-22" data-adp-label opacity="0">ADP</text>
      </g>
    </g>
  `;
}

function activeTransport2dPhosphateGroup(x, y, label = "", terminal = false) {
  return `
    <g class="active-transport-2d-phosphate" transform="translate(${x} ${y})" ${terminal ? `data-terminal-phosphate data-home-x="${x}" data-home-y="${y}"` : ""}>
      <circle cx="0" cy="0" r="9.2" fill="url(#phosphate2d)" stroke="#0891B2" stroke-width="1.7" />
      <circle cx="-3.2" cy="-3.6" r="3.1" fill="#ECFEFF" opacity="0.46" />
      <text x="0" y="4">${label}</text>
    </g>
  `;
}

function activeTransport2dConformation(progress) {
  const bottomOpen = clamp(1 - activeTransportSmoothStep(0.12, 0.3, progress) + activeTransportSmoothStep(0.88, 0.98, progress), 0, 1);
  const topOpen = activeTransportSmoothStep(0.5, 0.67, progress) * (1 - activeTransportSmoothStep(0.78, 0.92, progress));
  const occluded = activeTransportSmoothStep(0.28, 0.44, progress) * (1 - activeTransportSmoothStep(0.52, 0.65, progress));
  const flip = activeTransportSmoothStep(0.42, 0.69, progress) * (1 - activeTransportSmoothStep(0.82, 0.98, progress));
  return { bottomOpen, topOpen, occluded, flip };
}

function activeTransport2dProteinShapes(progress) {
  const { bottomOpen, topOpen, occluded, flip } = activeTransport2dConformation(progress);
  const topGap = 9 + topOpen * 39 - occluded * 4;
  const bottomGap = 11 + bottomOpen * 44 - occluded * 5;
  const middleGap = 12 + topOpen * 5 + bottomOpen * 5 - occluded * 8;
  const topY = 158 - topOpen * 9;
  const bottomY = 410 + bottomOpen * 9;
  const channelTopY = topY + 18;
  const channelBottomY = bottomY - 18;
  const channelShift = flip * 4;
  const centerX = 480 + channelShift;
  const leftNeck = 420 + topOpen * 8 - occluded * 5 + flip * 3;
  const rightNeck = 540 - topOpen * 8 + occluded * 5 + flip * 3;
  const leftLower = 370 + occluded * 15 + flip * 8;
  const rightLower = 590 - occluded * 15 + flip * 8;
  const leftBottom = 414 + bottomOpen * 12 + flip * 5;
  const rightBottom = 546 - bottomOpen * 12 + flip * 5;
  const cavityTopY = topY + 12;
  const cavityMidY = 282;
  const cavityBottomY = bottomY - 7;
  const channelTopWidth = clamp(topGap * (0.62 + topOpen * 0.08), 5, topGap - 2);
  const channelMidWidth = clamp(middleGap * (0.62 - occluded * 0.16), 4.5, Math.max(5, middleGap - 1.5));
  const channelBottomWidth = clamp(bottomGap * (0.66 + bottomOpen * 0.06), 5.5, bottomGap - 2);
  const channelTopLeft = centerX - channelTopWidth;
  const channelTopRight = centerX + channelTopWidth;
  const channelMidLeft = centerX - channelMidWidth;
  const channelMidRight = centerX + channelMidWidth;
  const channelBottomLeft = centerX - channelBottomWidth;
  const channelBottomRight = centerX + channelBottomWidth;
  const geometry = { topY, bottomY, centerX, topGap, middleGap, bottomGap };
  const pocket = activeTransport2dStructuralPocket(progress, geometry);
  const edgeStrength = pocket.strength
    * activeTransportSmoothStep(0.24, 0.36, progress)
    * (1 - activeTransportSmoothStep(0.7, 0.84, progress));
  const edgePocket = { ...pocket, strength: edgeStrength };
  const usePocketEdge = edgeStrength > 0.08;
  const leftInner = usePocketEdge
    ? activeTransport2dCarrierPocketInnerEdge("left", geometry, edgePocket)
    : activeTransport2dSimpleCarrierInnerEdge("left", geometry);
  const rightInner = usePocketEdge
    ? activeTransport2dCarrierPocketInnerEdge("right", geometry, edgePocket)
    : activeTransport2dSimpleCarrierInnerEdge("right", geometry);
  const pocketRecess = pocket.strength > 0.08 ? activeTransport2dPocketRecessPath(pocket) : "";

  return {
    left: `M${480 - topGap} ${topY} C${454 - topOpen * 4} ${topY - 8} ${432 - topOpen * 7} ${topY - 2} ${leftNeck} ${topY + 14} C393 184 ${401 + flip * 6} 238 ${388 + flip * 6} 292 C${leftLower - 25} 343 ${leftLower - 4} 401 ${leftBottom} 425 C450 433 ${471 - bottomGap * 0.48} 410 ${480 - bottomGap} ${bottomY} ${leftInner}`,
    right: `M${480 + topGap} ${topY} C${506 + topOpen * 4} ${topY - 8} ${528 + topOpen * 7} ${topY - 2} ${rightNeck} ${topY + 14} C567 184 ${559 + flip * 6} 238 ${572 + flip * 6} 292 C${rightLower + 25} 343 ${rightLower + 4} 401 ${rightBottom} 425 C510 433 ${489 + bottomGap * 0.48} 410 ${480 + bottomGap} ${bottomY} ${rightInner}`,
    cavity: `M${centerX - topGap} ${topY + 12} C${centerX - topGap * 1.08} 211 ${centerX - middleGap} 245 ${centerX - middleGap} 282 C${centerX - bottomGap * 0.82} 322 ${centerX - bottomGap * 0.96} 374 ${centerX - bottomGap} ${bottomY - 7} C${centerX + bottomGap * 0.96} 374 ${centerX + bottomGap * 0.82} 322 ${centerX + middleGap} 282 C${centerX + middleGap} 245 ${centerX + topGap * 1.08} 211 ${centerX + topGap} ${topY + 12} Z`,
    channel: `M${channelTopLeft} ${cavityTopY + 3} C${centerX - topGap * 0.72} 213 ${channelMidLeft} 246 ${channelMidLeft} ${cavityMidY} C${centerX - bottomGap * 0.68} 322 ${centerX - bottomGap * 0.78} 374 ${channelBottomLeft} ${cavityBottomY - 3} C${centerX - channelBottomWidth * 0.28} ${cavityBottomY + 5} ${centerX + channelBottomWidth * 0.28} ${cavityBottomY + 5} ${channelBottomRight} ${cavityBottomY - 3} C${centerX + bottomGap * 0.78} 374 ${centerX + bottomGap * 0.68} 322 ${channelMidRight} ${cavityMidY} C${channelMidRight} 246 ${centerX + topGap * 0.72} 213 ${channelTopRight} ${cavityTopY + 3} C${centerX + channelTopWidth * 0.32} ${cavityTopY - 2} ${centerX - channelTopWidth * 0.32} ${cavityTopY - 2} ${channelTopLeft} ${cavityTopY + 3} Z`,
    pocketRecess,
    pocketOpacity: pocket.strength > 0.08 ? pocket.opacity : 0,
    innerLeft: `M${464 - topGap * 0.32} ${channelTopY + 3} C${452 - topOpen * 4} 234 ${454 - middleGap * 0.5} 315 ${462 - bottomGap * 0.28} ${channelBottomY - 5}`,
    innerRight: `M${496 + topGap * 0.32} ${channelTopY + 3} C${508 + topOpen * 4} 234 ${506 + middleGap * 0.5} 315 ${498 + bottomGap * 0.28} ${channelBottomY - 5}`,
  };
}

function activeTransport2dStructuralPocket(progress, geometry = {}) {
  const rawPoint = activeTransport2dBindingPocketPoint(progress);
  const topLimit = (geometry.topY ?? 158) + 20;
  const bottomLimit = (geometry.bottomY ?? 410) - 18;
  const { topOpen, occluded } = activeTransport2dConformation(progress);
  const formed = activeTransportSmoothStep(0.14, 0.24, progress);
  const released = 1 - activeTransportSmoothStep(0.78, 0.9, progress);
  const strength = formed * released;

  return {
    x: rawPoint.x,
    y: clamp(rawPoint.y, topLimit, bottomLimit),
    strength,
    opacity: strength * 0.76,
    halfWidth: 20 + occluded * 3 + topOpen * 1.5,
    halfHeight: 25 + occluded * 4,
  };
}

function activeTransport2dSimpleCarrierInnerEdge(side, geometry) {
  const sign = side === "left" ? -1 : 1;
  const baseCenter = geometry.baseCenter ?? 480;
  const topInnerX = baseCenter + sign * geometry.topGap;
  const midY = 282;
  const midX = geometry.centerX + sign * geometry.middleGap;

  return `C${geometry.centerX + sign * geometry.bottomGap * 0.78} ${geometry.bottomY - 28} ${midX} ${geometry.bottomY - 82} ${midX} ${midY + 24} C${midX} ${midY - 58} ${baseCenter + sign * geometry.topGap * 0.72} ${geometry.topY + 44} ${topInnerX} ${geometry.topY} Z`;
}

function activeTransport2dCarrierPocketInnerEdge(side, geometry, pocket) {
  const sign = side === "left" ? -1 : 1;
  const baseCenter = geometry.baseCenter ?? 480;
  const topInnerX = baseCenter + sign * geometry.topGap;
  const pTopY = clamp(pocket.y - pocket.halfHeight, geometry.topY + 20, geometry.bottomY - 44);
  const pBottomY = clamp(pocket.y + pocket.halfHeight, pTopY + 24, geometry.bottomY - 18);
  const baseTopX = geometry.centerX + sign * activeTransport2dGapAtY(pTopY, geometry);
  const baseBottomX = geometry.centerX + sign * activeTransport2dGapAtY(pBottomY, geometry);
  const basePocketX = geometry.centerX + sign * activeTransport2dGapAtY(pocket.y, geometry);
  const wallX = pocket.x + sign * pocket.halfWidth;
  const pocketX = basePocketX + (wallX - basePocketX) * pocket.strength;
  const returnControlX = geometry.centerX + sign * activeTransport2dGapAtY(Math.max(geometry.topY + 52, pTopY - 34), geometry);

  return `C${geometry.centerX + sign * geometry.bottomGap * 0.82} ${geometry.bottomY - 24} ${baseBottomX} ${pBottomY + 18} ${baseBottomX} ${pBottomY} C${baseBottomX + (pocketX - baseBottomX) * 0.68} ${pBottomY - 12} ${pocketX} ${pocket.y + pocket.halfHeight * 0.52} ${pocketX} ${pocket.y} C${pocketX} ${pocket.y - pocket.halfHeight * 0.52} ${baseTopX + (pocketX - baseTopX) * 0.68} ${pTopY + 12} ${baseTopX} ${pTopY} C${returnControlX} ${Math.max(geometry.topY + 54, pTopY - 42)} ${baseCenter + sign * geometry.topGap * 0.62} ${geometry.topY + 36} ${topInnerX} ${geometry.topY} Z`;
}

function activeTransport2dGapAtY(y, geometry) {
  if (y <= 282) {
    return activeTransport2dMixNumber(
      geometry.topGap,
      geometry.middleGap,
      activeTransportSmoothStep(geometry.topY + 12, 282, y),
    );
  }
  return activeTransport2dMixNumber(
    geometry.middleGap,
    geometry.bottomGap,
    activeTransportSmoothStep(282, geometry.bottomY - 12, y),
  );
}

function activeTransport2dPocketRecessPath(pocket) {
  const w = pocket.halfWidth * 1.08;
  const h = pocket.halfHeight * 0.88;
  return `M${pocket.x - w} ${pocket.y} C${pocket.x - w} ${pocket.y - h * 0.66} ${pocket.x - w * 0.58} ${pocket.y - h} ${pocket.x} ${pocket.y - h} C${pocket.x + w * 0.58} ${pocket.y - h} ${pocket.x + w} ${pocket.y - h * 0.66} ${pocket.x + w} ${pocket.y} C${pocket.x + w} ${pocket.y + h * 0.66} ${pocket.x + w * 0.58} ${pocket.y + h} ${pocket.x} ${pocket.y + h} C${pocket.x - w * 0.58} ${pocket.y + h} ${pocket.x - w} ${pocket.y + h * 0.66} ${pocket.x - w} ${pocket.y} Z`;
}

function activeTransport2dMixNumber(from, to, progress) {
  return from + (to - from) * progress;
}

const ACTIVE_TRANSPORT_PART_LABELS = {
  membrane: "磷脂双分子层 / Phospholipid Bilayer",
  carrier: "载体蛋白跨膜螺旋束 / Carrier Protein",
  domain: "ATPase 胞质结构域 / ATPase Domain",
  ion: "被运输离子 / Transported Ion",
  atp: "ATP 结合与水解 / ATP Hydrolysis",
  adp: "ADP / Pi 释放",
  gradient: "膜两侧浓度差 / Concentration Gradient",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mountTransport2d() {
  const shell = document.querySelector("[data-transport-2d-shell]");
  const svg = document.querySelector("[data-transport-2d-svg]");
  const feedback = document.querySelector("[data-transport-2d-feedback]");
  const progressInput = document.querySelector("[data-transport-2d-progress]");
  const speedInput = document.querySelector("[data-transport-2d-particle-speed]");
  const progressValue = document.querySelector("[data-transport-2d-progress-value]");
  const stageNote = document.querySelector("[data-transport-2d-note]");
  if (!shell || !svg) return;

  const mode = () => state.stageIndex===0?-1:state.stageIndex-1;
  const setFeedback = (text) => {
    if (feedback) feedback.textContent = text;
  };

  const renderFrame = () => {
    if (!document.body.contains(shell)) return;
    const time = performance.now() * 0.001;
    const progress = transport2dProgressValue(time);
    updateTransport2d(svg, mode(), progress, time);
    if (progressInput && Math.abs(Number(progressInput.value) - progress * 100) > 1.2) {
      progressInput.value = String(Math.round(progress * 100));
    }
    if (progressValue) progressValue.textContent = `${Math.round(progress * 100)}%`;
    if (stageNote) stageNote.textContent = currentStage().goal;
    dnaAnimationFrame = requestAnimationFrame(renderFrame);
  };

  progressInput?.addEventListener("input", (event) => {
    state.playing = false;
    state.transportProgress = Number(event.target.value) / 100;
    state.transportPlayStartProgress = state.transportProgress;
    updateTransport2d(svg, mode(), state.transportProgress, performance.now() * 0.001);
    if (progressValue) progressValue.textContent = `${Math.round(state.transportProgress * 100)}%`;
    updateControls();
  });

  speedInput?.addEventListener("input", (event) => {
    state.activeTransportParticleSpeed = Number(event.target.value) / 100;
    root.querySelector('[data-transport-speed-value]').textContent=event.target.value+'%';
    setFeedback(`背景分子运动速度：${Math.round(state.activeTransportParticleSpeed * 100)}%`);
  });

  shell.addEventListener("click", (event) => {
    const target = event.target.closest("[data-transport-part], [data-part]");
    if (!target) return;
    const label =
      target.dataset.transportPart ||
      ACTIVE_TRANSPORT_PART_LABELS[target.dataset.part] ||
      "跨膜运输结构";
    setFeedback(`已选中：${label}`);
  });

  sceneRuntime={resize:()=>sceneNavigation.resize(),sync(){
    const selected=mode();shell.className='transport-2d-shell transport-integrated-shell mode-'+(selected<0?'overview':selected);shell.dataset.transportModeIndex=selected;
    svg.querySelectorAll('.transport-integrated-module').forEach((el,i)=>el.classList.toggle('is-current',selected<0||i===selected));
    progressInput.value=String(Math.round(transport2dProgressValue()*100));speedInput.value=String(Math.round(state.activeTransportParticleSpeed*100));root.querySelector('[data-transport-speed-value]').textContent=speedInput.value+'%';
  }};
  sceneRuntime.sync();renderFrame();shellExperience?.setSceneStatus('ready');
  emitModelMessage('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities});
}

function transport2dProgressValue(time = performance.now() * 0.001) {
  if (state.playing) {
    const startTime = state.transportPlayStartTime || time;
    const startProgress = Number.isFinite(state.transportPlayStartProgress)
      ? state.transportPlayStartProgress
      : state.transportProgress || 0.08;
    return (startProgress + (time - startTime) * TRANSPORT_2D_PLAY_RATE * speeds[state.speedIndex]) % 1;
  }
  return state.transportProgress ?? 0.08;
}

function updateTransport2d(svg, mode, progress, time) {
  if (svg.dataset.transportIntegrated === "true") {
    updateActiveTransport2d(svg, progress, time);
    updateTransport2dIntegrated(svg, progress, time);
    return;
  }

  if (svg.dataset.transportComparison === "true") {
    updateActiveTransport2d(svg, progress, time);
    updateTransport2dEnvironment(svg, time);
    updateTransport2dTokens(svg, mode, progress);
    updateTransport2dComparisonProteins(svg, progress);
    return;
  }

  if (mode === 3) {
    updateActiveTransport2d(svg, progress, time);
    return;
  }

  updateTransport2dEnvironment(svg, time);
  updateTransport2dTokens(svg, mode, progress);

  if (mode === 1) {
    const open = activeTransportSmoothStep(0.14, 0.32, progress) * (1 - activeTransportSmoothStep(0.7, 0.88, progress));
    svg.querySelector("[data-channel-gate-top]")?.setAttribute("transform", `translate(0 ${(-10 * open).toFixed(2)}) scale(${(1 + open * 0.18).toFixed(3)} 1)`);
    svg.querySelector("[data-channel-gate-bottom]")?.setAttribute("transform", `translate(0 ${(10 * open).toFixed(2)}) scale(${(1 + open * 0.18).toFixed(3)} 1)`);
    svg.querySelector("[data-channel-pore]")?.setAttribute("opacity", String(0.32 + open * 0.42));
  }

  if (mode === 2 || mode === 4) {
    const phase = mode === 2 ? (progress + 0.48) % 1 : (progress + 0.42) % 1;
    const shapes = activeTransport2dProteinShapes(phase);
    svg.querySelector("[data-transport-carrier-left]")?.setAttribute("d", shapes.left);
    svg.querySelector("[data-transport-carrier-right]")?.setAttribute("d", shapes.right);
    svg.querySelector("[data-transport-carrier-cavity]")?.setAttribute("d", shapes.cavity);
    svg.querySelector("[data-transport-carrier-channel]")?.setAttribute("d", shapes.channel);
    svg.querySelector("[data-transport-carrier-pocket]")?.setAttribute("d", shapes.pocketRecess);
    svg.querySelector("[data-transport-carrier-pocket]")?.setAttribute("opacity", String(Math.max(0.18, shapes.pocketOpacity)));
  }
}

function updateTransport2dEnvironment(svg, time) {
  const particleSpeed = clamp(state.activeTransportParticleSpeed || TRANSPORT_2D_DEFAULT_PARTICLE_SPEED, 0.01, 0.18);
  svg.querySelectorAll("[data-lipid-tail]").forEach((tail) => {
    activeTransport2dUpdateLipidTail(tail, time, particleSpeed);
  });

  svg.querySelectorAll("[data-particle]").forEach((particle) => {
    particle.setAttribute("transform", activeTransport2dParticleTransform(particle, time, particleSpeed));
  });
}

function updateTransport2dTokens(svg, mode, progress) {
  svg.querySelectorAll("[data-transport2d-token]").forEach((token) => {
    const id = token.dataset.tokenId;
    const offset = Number(token.dataset.offset || 0);
    const tokenMode = Number(token.dataset.modeIndex ?? mode);
    const point = token.dataset.transportMini === "true"
      ? transport2dMiniTokenPoint(tokenMode, id, progress, offset)
      : transport2dTokenPoint(tokenMode, id, progress, offset);
    token.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) scale(${(point.scale || 1).toFixed(3)})`);
    token.setAttribute("opacity", String(point.opacity ?? 1));
  });
}

function updateTransport2dComparisonProteins(svg, progress) {
  svg.querySelectorAll("[data-mini-channel]").forEach((channel) => {
    const p = (progress + Number(channel.dataset.phase || 0)) % 1;
    const open = activeTransportSmoothStep(0.12, 0.3, p) * (1 - activeTransportSmoothStep(0.68, 0.86, p));
    channel.querySelector("[data-mini-channel-pore]")?.setAttribute("opacity", String(0.3 + open * 0.42));
    channel.querySelector("[data-mini-channel-top-gate]")?.setAttribute("transform", `translate(0 ${(-6 * open).toFixed(2)}) scale(${(1 + open * 0.2).toFixed(3)} 1)`);
    channel.querySelector("[data-mini-channel-bottom-gate]")?.setAttribute("transform", `translate(0 ${(6 * open).toFixed(2)}) scale(${(1 + open * 0.2).toFixed(3)} 1)`);
  });

  svg.querySelectorAll("[data-mini-carrier]").forEach((carrier) => {
    const mode = Number(carrier.dataset.modeIndex || 2);
    const phase = Number(carrier.dataset.phase || 0);
    const p = (progress + phase) % 1;
    const shapes = transport2dMiniCarrierShapes(mode, p);
    carrier.querySelector("[data-mini-left]")?.setAttribute("d", shapes.left);
    carrier.querySelector("[data-mini-right]")?.setAttribute("d", shapes.right);
    carrier.querySelector("[data-mini-cavity]")?.setAttribute("d", shapes.cavity);
    carrier.querySelector("[data-mini-channel-shadow]")?.setAttribute("d", shapes.channel);
    carrier.querySelectorAll("[data-mini-pocket]").forEach((pocket) => {
      const point = transport2dMiniPocketPoint(mode, pocket.dataset.pocketId || "main", p);
      pocket.setAttribute("d", transport2dMiniPocketPath(point));
      pocket.setAttribute("opacity", String(point.opacity));
    });
    const atpase = carrier.querySelector("[data-mini-atpase]");
    if (atpase) {
      const phosphorylated = activeTransportSmoothStep(0.35, 0.48, p) * (1 - activeTransportSmoothStep(0.8, 0.94, p));
      atpase.setAttribute("transform", `translate(${(phosphorylated * 4).toFixed(2)} ${(-phosphorylated * 5).toFixed(2)}) rotate(${(phosphorylated * 10).toFixed(2)} 152 348)`);
    }
    const terminal = carrier.querySelector("[data-mini-terminal-phosphate]");
    if (terminal) {
      const detach = activeTransportSmoothStep(0.38, 0.54, p);
      const release = activeTransportSmoothStep(0.78, 0.96, p);
      terminal.setAttribute("transform", `translate(${(detach * -18 + release * 34).toFixed(2)} ${(-detach * 34 - release * 5).toFixed(2)})`);
      terminal.setAttribute("opacity", String(1 - activeTransportSmoothStep(0.94, 1, p)));
    }
  });
}

function updateTransport2dIntegrated(svg, progress, time) {
  svg.querySelectorAll("[data-integrated-token]").forEach((token) => {
    const id = token.dataset.tokenId;
    const mode = Number(token.dataset.modeIndex || 0);
    const offset = Number(token.dataset.offset || 0);
    const point = transportIntegratedTokenPoint(mode, id, progress, offset);
    token.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) scale(${(point.scale || 1).toFixed(3)})`);
    token.setAttribute("opacity", String(point.opacity ?? 1));
    const rotor = token.querySelector("[data-molecule-core]");
    if (rotor) rotor.setAttribute("transform", `rotate(${Number(point.rotation || 0).toFixed(2)})`);
  });

  const open = activeTransportSmoothStep(0.24, 0.38, progress) * (1 - activeTransportSmoothStep(0.84, 0.96, progress));
  svg.querySelector("[data-integrated-channel-gate-left]")?.setAttribute(
    "transform",
    `rotate(${(-64 * open).toFixed(2)} 326 166)`,
  );
  svg.querySelector("[data-integrated-channel-gate-right]")?.setAttribute(
    "transform",
    `rotate(${(64 * open).toFixed(2)} 434 166)`,
  );

  svg.querySelectorAll("[data-integrated-carrier]").forEach((carrier) => {
    const kind = carrier.dataset.kind || "facilitated";
    const cx = Number(carrier.dataset.cx || 500);
    const shapes = transportIntegratedCarrierShapes(kind, progress, cx);
    carrier.querySelector("[data-integrated-carrier-left]")?.setAttribute("d", shapes.left);
    carrier.querySelector("[data-integrated-carrier-right]")?.setAttribute("d", shapes.right);
    carrier.querySelector("[data-integrated-carrier-cavity]")?.setAttribute("d", shapes.cavity);
    carrier.querySelector("[data-integrated-carrier-channel]")?.setAttribute("d", shapes.channel);
    carrier.querySelector("[data-integrated-facilitated-pocket-recess]")?.setAttribute("d", shapes.pocketRecess);
    carrier.querySelector("[data-integrated-facilitated-pocket-recess]")?.setAttribute(
      "opacity",
      String(transportTunedPocketOpacity("facilitatedProtein", shapes.pocketOpacity || 0)),
    );
    carrier.querySelectorAll("[data-integrated-cotransport-pocket-recess]").forEach((pocket) => {
      const recess = shapes.pocketRecesses?.[pocket.dataset.pocketId || ""];
      if (!recess) return;
      pocket.setAttribute("d", recess.d);
      pocket.setAttribute("opacity", String(transportTunedPocketOpacity("cotransportProtein", recess.opacity)));
    });
  });
  applyTransportStructureTuning(svg);
}

function transportStructureSettings(structureId) {
  return currentTuning().structures?.[structureId] || transportStructureDefaults(structureId);
}

function transportTunedPocketOpacity(structureId, opacity) {
  const settings = transportStructureSettings(structureId);
  const strength = Number(settings.pocket ?? 100) / 100;
  return clamp((Number(opacity) || 0) * strength, 0, 1);
}

function applyTransportStructureTuning(svg) {
  if (!svg || currentModel().visual !== "transport") return;
  const atpRibose = transportStructureSettings("atpRibose");
  const atpMolecule = transportStructureSettings("atpMolecule");
  const activeProtein = transportStructureSettings("activeProtein");
  const facilitatedProtein = transportStructureSettings("facilitatedProtein");
  const cotransportProtein = transportStructureSettings("cotransportProtein");
  const channelProtein = transportStructureSettings("channelProtein");
  const membraneLipids = transportStructureSettings("membraneLipids");

  svg.querySelectorAll("[data-atp-molecule] [data-nucleotide-body], [data-adp-molecule] [data-nucleotide-body]").forEach((body) => {
    setSvgTransformAround(body, { size: atpMolecule.size, x: atpMolecule.x, y: atpMolecule.y }, 8, 0);
  });
  svg.querySelectorAll("[data-atp-molecule] .ribose-ring, [data-adp-molecule] .ribose-ring").forEach((ribose) => {
    setTunedFill(ribose, atpRibose.color, "#fdba74");
    setSvgTransformAround(ribose, { size: atpRibose.size, x: atpRibose.x, y: atpRibose.y }, -10, 0);
  });

  const activeCarrier = svg.querySelector(".transport-integrated-active-reuse .active-transport-2d-carrier");
  if (activeCarrier) {
    setSvgTransformAround(activeCarrier, activeProtein, 480, 284);
    activeCarrier.querySelectorAll("[data-carrier-left], [data-carrier-right]").forEach((path) => {
      setTunedFill(path, activeProtein.color, "#a855f7");
    });
  }

  applyIntegratedCarrierStructureTuning(svg, "facilitated", "facilitatedProtein", facilitatedProtein, 630);
  applyIntegratedCarrierStructureTuning(svg, "cotransport", "cotransportProtein", cotransportProtein, 1130);

  const channel = svg.querySelector("[data-integrated-channel]");
  if (channel) {
    setSvgTransformAround(channel, channelProtein, 380, 279);
    channel.querySelectorAll(".transport-integrated-channel-shell, .transport-integrated-channel-gate").forEach((shape) => {
      setTunedFill(shape, channelProtein.color, "#06b6d4");
    });
  }

  applyTransportLipidStructureTuning(svg, membraneLipids);
}

function applyIntegratedCarrierStructureTuning(svg, kind, structureId, settings, centerX) {
  const carrier = svg.querySelector(`[data-integrated-carrier][data-kind="${kind}"]`);
  if (!carrier) return;
  const shapes = carrier.querySelectorAll(
    "[data-integrated-carrier-left], [data-integrated-carrier-right], [data-integrated-carrier-cavity], [data-integrated-carrier-channel], [data-integrated-facilitated-pocket-recess], [data-integrated-cotransport-pocket-recess]",
  );
  shapes.forEach((shape) => setSvgTransformAround(shape, settings, centerX, 284));
  carrier.querySelectorAll("[data-integrated-carrier-left], [data-integrated-carrier-right]").forEach((path) => {
    setTunedFill(path, settings.color, structureId === "facilitatedProtein" ? "#22c55e" : "#f97316");
  });
}

function applyTransportLipidStructureTuning(svg, settings) {
  const scale = Number(settings.size || 100) / 100;
  svg.querySelectorAll(".transport-integrated-membrane circle").forEach((circle) => {
    setTunedFill(circle, settings.headColor, "#7dd3fc");
    setTunedRadius(circle, scale);
  });
  svg.querySelectorAll(".transport-integrated-membrane .lipid-tail-core").forEach((tail) => {
    setTunedStroke(tail, settings.tailColor, "#bae6fd");
    setOptionalSvgAttribute(tail, "stroke-width", Math.abs(scale - 1) < 0.001 ? "" : (2.7 * scale).toFixed(2));
  });
  svg.querySelectorAll(".transport-integrated-membrane .lipid-tail-shadow").forEach((tail) => {
    setOptionalSvgAttribute(tail, "stroke-width", Math.abs(scale - 1) < 0.001 ? "" : (4.6 * scale).toFixed(2));
  });
}

function setSvgTransformAround(element, settings, centerX, centerY) {
  if (!element) return;
  const width = Number(settings.width ?? settings.size ?? 100) / 100;
  const height = Number(settings.height ?? settings.size ?? 100) / 100;
  const x = Number(settings.x || 0);
  const y = Number(settings.y || 0);
  const isDefault = Math.abs(width - 1) < 0.001 && Math.abs(height - 1) < 0.001 && Math.abs(x) < 0.001 && Math.abs(y) < 0.001;
  if (isDefault) {
    element.removeAttribute("transform");
    return;
  }
  element.setAttribute(
    "transform",
    `translate(${x.toFixed(2)} ${y.toFixed(2)}) translate(${centerX} ${centerY}) scale(${width.toFixed(3)} ${height.toFixed(3)}) translate(${-centerX} ${-centerY})`,
  );
}

function setTunedFill(element, color, defaultColor) {
  if (!element) return;
  if (element.dataset.tuningOriginalFill === undefined) {
    element.dataset.tuningOriginalFill = element.getAttribute("fill") || "";
  }
  if (!isHexColor(color) || color.toLowerCase() === defaultColor.toLowerCase()) {
    if (element.dataset.tuningOriginalFill) element.setAttribute("fill", element.dataset.tuningOriginalFill);
    else element.removeAttribute("fill");
    return;
  }
  element.setAttribute("fill", color);
}

function setTunedStroke(element, color, defaultColor) {
  if (!element) return;
  if (element.dataset.tuningOriginalStroke === undefined) {
    element.dataset.tuningOriginalStroke = element.getAttribute("stroke") || "";
  }
  if (!isHexColor(color) || color.toLowerCase() === defaultColor.toLowerCase()) {
    if (element.dataset.tuningOriginalStroke) element.setAttribute("stroke", element.dataset.tuningOriginalStroke);
    else element.removeAttribute("stroke");
    return;
  }
  element.setAttribute("stroke", color);
}

function setTunedRadius(element, scale) {
  if (!element) return;
  if (element.dataset.tuningOriginalR === undefined) {
    element.dataset.tuningOriginalR = element.getAttribute("r") || "";
  }
  const original = Number(element.dataset.tuningOriginalR);
  if (!Number.isFinite(original)) return;
  if (Math.abs(scale - 1) < 0.001) element.setAttribute("r", element.dataset.tuningOriginalR);
  else element.setAttribute("r", (original * scale).toFixed(2));
}

function setOptionalSvgAttribute(element, name, value) {
  if (!element) return;
  if (value === "" || value == null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}

function transportIntegratedTokenPoint(mode, id, progress, offset = 0) {
  const t = (progress + offset) % 1;
  const fadeIn = activeTransportSmoothStep(0.03, 0.14, t);
  const fadeOut = 1 - activeTransportSmoothStep(0.86, 0.98, t);
  const opacity = clamp(fadeIn * fadeOut, 0.12, 1);

  if (mode === 0) {
    const pass = activeTransportSmoothStep(0.06, 0.92, t);
    const freeConfig = {
      o2: { lane: -30, outward: false, spin: 1, seed: 0.4 },
      o2b: { lane: -6, outward: false, spin: -1, seed: 1.7 },
      o2c: { lane: 20, outward: false, spin: 1, seed: 2.9 },
      co2: { lane: -20, outward: true, spin: -1, seed: 4.1 },
      co2b: { lane: 8, outward: true, spin: 1, seed: 5.3 },
      co2c: { lane: 34, outward: true, spin: -1, seed: 6.8 },
    };
    const config = freeConfig[id] || freeConfig.o2;
    const crossing = activeTransportSmoothStep(0.28, 0.44, t) * (1 - activeTransportSmoothStep(0.68, 0.84, t));
    const wobble = Math.sin(t * Math.PI * 10 + config.seed) * 18 + Math.cos(t * Math.PI * 16 + config.seed * 1.7) * 9;
    const rotation = config.spin * (config.seed * 31 + t * 210 + crossing * (92 + wobble));
    return {
      x: 130 + config.lane + Math.sin(t * Math.PI * 2 + offset * 7) * 7,
      y: config.outward ? activeTransport2dMixNumber(472, 92, pass) : activeTransport2dMixNumber(92, 472, pass),
      opacity,
      scale: 0.92 + Math.sin(t * Math.PI) * 0.06,
      rotation,
    };
  }

  if (mode === 1) {
    const p = progress;
    if (id === "signal") {
      const start = { x: 304, y: 92 };
      const signalHeldByGate = activeTransportSmoothStep(0.24, 0.38, p) * (1 - activeTransportSmoothStep(0.68, 0.82, p));
      const bound = { x: 334 - signalHeldByGate * 8, y: 147 + signalHeldByGate * 7 };
      const depart = { x: 304, y: 82 };
      const bind = activeTransportSmoothStep(0.05, 0.22, p);
      const leave = activeTransportSmoothStep(0.68, 0.82, p);
      const point = activeTransport2dMix(activeTransport2dMix(start, bound, bind), depart, leave);
      return {
        x: point.x,
        y: point.y,
        opacity: clamp(activeTransportSmoothStep(0.02, 0.08, p) * (1 - activeTransportSmoothStep(0.86, 0.96, p)), 0.12, 1),
        scale: 0.76,
      };
    }
    const channelConfig = {
      k: { lane: -12, start: 0.36, end: 0.68, wiggle: 0 },
      kb: { lane: 0, start: 0.43, end: 0.75, wiggle: 1.4 },
      kc: { lane: 12, start: 0.5, end: 0.82, wiggle: 2.8 },
    };
    const config = channelConfig[id] || channelConfig.k;
    const pass = activeTransportSmoothStep(config.start, config.end, p);
    const ionOpacity = activeTransportSmoothStep(config.start - 0.08, config.start + 0.02, p)
      * (1 - activeTransportSmoothStep(config.end + 0.02, config.end + 0.12, p));
    return {
      x: 380 + config.lane + Math.sin(p * Math.PI * 6 + config.wiggle) * 1.6,
      y: activeTransport2dMixNumber(102, 470, pass),
      opacity: clamp(ionOpacity, 0, 1),
      scale: 0.84,
    };
  }

  if (mode === 2) {
    return transportIntegratedMoveThroughCarrier(t, "facilitated", "main", opacity, 630);
  }

  if (mode === 4) {
    return transportIntegratedMoveThroughCarrier(t, "cotransport", id === "na" ? "na" : "glucose", opacity, 1130);
  }

  return { x: 120, y: 280, opacity: 1, scale: 1 };
}

function transportIntegratedMoveThroughCarrier(t, kind, route, opacity, cx) {
  const routeOffset = route === "na" ? -22 : route === "glucose" ? 22 : 0;
  const start = { x: cx + routeOffset, y: 96 };
  const bind = { x: cx + routeOffset * 0.55, y: route === "glucose" ? 236 : 208 };
  const middle = { x: cx + 6 + routeOffset * 0.1, y: route === "glucose" ? 296 : 264 };
  const release = { x: cx + routeOffset * 0.42, y: 386 };
  const end = { x: cx + routeOffset * 0.85, y: 492 };
  if (t < 0.25) return { ...activeTransport2dMix(start, bind, activeTransportSmoothStep(0.02, 0.25, t)), opacity, scale: 0.92 };
  if (t < 0.52) return { ...activeTransport2dMix(bind, middle, activeTransportSmoothStep(0.25, 0.52, t)), opacity: 1, scale: 1.03 };
  if (t < 0.78) return { ...activeTransport2dMix(middle, release, activeTransportSmoothStep(0.52, 0.78, t)), opacity: 1, scale: 1 };
  return { ...activeTransport2dMix(release, end, activeTransportSmoothStep(0.78, 0.98, t)), opacity, scale: 0.92 };
}

function transportIntegratedCarrierShapes(kind, progress, cx) {
  const topOpen = clamp(1 - activeTransportSmoothStep(0.14, 0.34, progress) + activeTransportSmoothStep(0.9, 1, progress), 0, 1);
  const bottomOpen = clamp(activeTransportSmoothStep(0.58, 0.78, progress) * (1 - activeTransportSmoothStep(0.9, 1, progress)), 0, 1);
  const occluded = activeTransportSmoothStep(0.3, 0.46, progress) * (1 - activeTransportSmoothStep(0.54, 0.68, progress));
  const flip = activeTransportSmoothStep(0.42, 0.72, progress) * (1 - activeTransportSmoothStep(0.88, 1, progress));
  const topY = 150 - topOpen * 6;
  const midY = 282;
  const bottomY = 410 + bottomOpen * 6;
  const topGap = 12 + topOpen * 34 - occluded * 5;
  const midGap = 12 + topOpen * 6 + bottomOpen * 6 - occluded * 8;
  const bottomGap = 12 + bottomOpen * 38 - occluded * 5;
  const topOuter = kind === "facilitated" ? 88 : 82;
  const midOuter = kind === "facilitated" ? 68 : 70;
  const bottomOuter = kind === "facilitated" ? 48 : 84;
  const shift = flip * 4;
  const center = cx + shift;
  const pocketStrength = kind === "facilitated"
    ? activeTransportSmoothStep(0.16, 0.3, progress) * (1 - activeTransportSmoothStep(0.76, 0.92, progress))
    : 0;
  const structuralPocket = kind === "facilitated"
    ? {
      ...transportIntegratedPocketPoint(kind, "main", progress, cx),
      strength: pocketStrength,
      opacity: pocketStrength * 0.82,
      halfWidth: 22 + occluded * 2.4,
      halfHeight: 24 + occluded * 3.4,
    }
    : null;
  const useStructuralPocket = Boolean(structuralPocket && structuralPocket.strength > 0.08);
  const cotransportPockets = kind === "cotransport"
    ? transportIntegratedCotransportStructuralPockets(progress, cx, occluded)
    : null;
  const useCotransportPocket = Boolean(cotransportPockets && (cotransportPockets.na.strength > 0.08 || cotransportPockets.glucose.strength > 0.08));
  const pocketRecesses = kind === "cotransport"
    ? transportIntegratedCotransportPocketRecesses(cotransportPockets)
    : {};
  const geometry = {
    topY,
    bottomY,
    centerX: center,
    baseCenter: cx,
    topGap: topGap / 2,
    middleGap: midGap / 2,
    bottomGap: bottomGap / 2,
  };
  const leftInnerStart = `C${center - bottomGap / 2 - 18} ${bottomY + 10} ${center - bottomGap / 2 - 5} ${midY + 75} ${center - bottomGap / 2} ${bottomY}`;
  const rightInnerStart = `C${center + bottomGap / 2 + 18} ${bottomY + 10} ${center + bottomGap / 2 + 5} ${midY + 75} ${center + bottomGap / 2} ${bottomY}`;
  const leftPocket = useStructuralPocket ? structuralPocket : cotransportPockets?.na;
  const rightPocket = useStructuralPocket ? structuralPocket : cotransportPockets?.glucose;
  const useLeftPocket = useStructuralPocket || (useCotransportPocket && leftPocket.strength > 0.08);
  const useRightPocket = useStructuralPocket || (useCotransportPocket && rightPocket.strength > 0.08);
  const leftPocketEdge = useLeftPocket ? activeTransport2dCarrierPocketInnerEdge("left", geometry, leftPocket).replace(/\s*Z$/, "") : "";
  const rightPocketEdge = useRightPocket ? activeTransport2dCarrierPocketInnerEdge("right", geometry, rightPocket).replace(/\s*Z$/, "") : "";
  const leftInner = useLeftPocket
    ? `${leftInnerStart} ${leftPocketEdge}
    C${center - topGap / 2 - 16} ${topY - 12} ${center - topOuter + 12} ${topY - 15} ${center - topOuter - topOpen * 4} ${topY} Z`
    : `C${center - bottomGap / 2 - 18} ${bottomY + 10} ${center - bottomGap / 2 - 5} ${midY + 75} ${center - midGap / 2} ${midY + 20}
    C${center - midGap / 2 - 5} ${midY - 56} ${center - topGap / 2 - 11} ${topY + 24} ${center - topGap / 2} ${topY}
    C${center - topGap / 2 - 16} ${topY - 12} ${center - topOuter + 12} ${topY - 15} ${center - topOuter - topOpen * 4} ${topY} Z`;
  const rightInner = useRightPocket
    ? `${rightInnerStart} ${rightPocketEdge}
    C${center + topGap / 2 + 16} ${topY - 12} ${center + topOuter - 12} ${topY - 15} ${center + topOuter + topOpen * 4} ${topY} Z`
    : `C${center + bottomGap / 2 + 18} ${bottomY + 10} ${center + bottomGap / 2 + 5} ${midY + 75} ${center + midGap / 2} ${midY + 20}
    C${center + midGap / 2 + 5} ${midY - 56} ${center + topGap / 2 + 11} ${topY + 24} ${center + topGap / 2} ${topY}
    C${center + topGap / 2 + 16} ${topY - 12} ${center + topOuter - 12} ${topY - 15} ${center + topOuter + topOpen * 4} ${topY} Z`;
  let pocketRecess = "";
  let pocketOpacity = 0;
  if (useStructuralPocket) {
    pocketRecess = transportIntegratedPocketRecessPath({
      ...structuralPocket,
      halfWidth: 18,
      halfHeight: 17,
      shape: "hex",
    });
    pocketOpacity = structuralPocket.opacity;
  }
  const left = `
    M${center - topOuter - topOpen * 4} ${topY}
    C${center - topOuter - 18} ${topY + 38} ${center - midOuter - 14} ${midY - 80} ${center - midOuter} ${midY}
    C${center - bottomOuter - 12} ${midY + 76} ${center - bottomOuter - 7} ${bottomY - 18} ${center - bottomOuter + 12} ${bottomY}
    ${leftInner}
  `;
  const right = `
    M${center + topOuter + topOpen * 4} ${topY}
    C${center + topOuter + 18} ${topY + 38} ${center + midOuter + 14} ${midY - 80} ${center + midOuter} ${midY}
    C${center + bottomOuter + 12} ${midY + 76} ${center + bottomOuter + 7} ${bottomY - 18} ${center + bottomOuter - 12} ${bottomY}
    ${rightInner}
  `;
  const cavity = `
    M${center - topGap / 2} ${topY + 10}
    C${center - midGap / 2 - 5} ${midY - 76} ${center - midGap / 2 - 5} ${midY + 56} ${center - bottomGap / 2} ${bottomY - 10}
    C${center - 6} ${bottomY + 4} ${center + 6} ${bottomY + 4} ${center + bottomGap / 2} ${bottomY - 10}
    C${center + midGap / 2 + 5} ${midY + 56} ${center + midGap / 2 + 5} ${midY - 76} ${center + topGap / 2} ${topY + 10}
    C${center + 6} ${topY - 3} ${center - 6} ${topY - 3} ${center - topGap / 2} ${topY + 10} Z
  `;
  const channel = `
    M${center - Math.max(5, topGap * 0.46)} ${topY + 16}
    C${center - Math.max(5, midGap * 0.46)} ${midY - 70} ${center - Math.max(5, midGap * 0.42)} ${midY + 58} ${center - Math.max(6, bottomGap * 0.46)} ${bottomY - 16}
    C${center} ${bottomY - 5} ${center + Math.max(6, bottomGap * 0.46)} ${bottomY - 16} ${center + Math.max(5, midGap * 0.42)} ${midY + 58}
    C${center + Math.max(5, midGap * 0.46)} ${midY - 70} ${center + Math.max(5, topGap * 0.46)} ${topY + 16} ${center + Math.max(5, topGap * 0.46)} ${topY + 16}
    C${center + 5} ${topY + 5} ${center - 5} ${topY + 5} ${center - Math.max(5, topGap * 0.46)} ${topY + 16} Z
  `;
  return { left, right, cavity, channel, pocketRecess, pocketOpacity, pocketRecesses };
}

function transportIntegratedCotransportStructuralPockets(progress, cx, occluded) {
  return ["na", "glucose"].reduce((pockets, id) => {
    const pocketProgress = (progress + (id === "glucose" ? 0.1 : 0)) % 1;
    const strength = activeTransportSmoothStep(0.16, 0.3, pocketProgress)
      * (1 - activeTransportSmoothStep(0.76, 0.92, pocketProgress));
    const visibleStrength = clamp(strength * 1.08, 0, 1);
    const point = transportIntegratedPocketPoint("cotransport", id, progress, cx);
    const isGlucose = id === "glucose";
    pockets[id] = {
      ...point,
      strength: visibleStrength,
      opacity: visibleStrength * 0.88,
      halfWidth: isGlucose ? 24 + occluded * 1.8 : 20.5 + occluded * 1.2,
      halfHeight: isGlucose ? 23 + occluded * 1.6 : 24 + occluded * 1.2,
    };
    return pockets;
  }, {});
}

function transportIntegratedCotransportPocketRecesses(pockets) {
  if (!pockets) return {};
  return Object.entries(pockets).reduce((recesses, [id, point]) => {
    const isGlucose = id === "glucose";
    const recessPoint = {
      ...point,
      halfWidth: isGlucose ? point.halfWidth * 1.02 : point.halfWidth * 1.04,
      halfHeight: isGlucose ? point.halfHeight * 1.02 : point.halfHeight * 1.04,
    };
    recesses[id] = {
      d: isGlucose
        ? transportIntegratedSmallHexRecessPath(recessPoint)
        : activeTransport2dPocketRecessPath(recessPoint),
      opacity: point.strength > 0.06 ? 0.24 + point.strength * 0.7 : 0,
    };
    return recesses;
  }, {});
}

function transportIntegratedSmallHexRecessPath(point) {
  const { x, y, halfWidth: w, halfHeight: h } = point;
  return `M${x} ${y - h} L${x + w * 0.86} ${y - h * 0.5} L${x + w * 0.86} ${y + h * 0.5} L${x} ${y + h} L${x - w * 0.86} ${y + h * 0.5} L${x - w * 0.86} ${y - h * 0.5} Z`;
}

function transportIntegratedPocketPoint(kind, pocketId, progress, cx) {
  const route = kind === "cotransport" ? pocketId : "main";
  const pocketProgress = (progress + (route === "glucose" ? 0.1 : 0)) % 1;
  const point = transportIntegratedMoveThroughCarrier(pocketProgress, kind, route, 1, cx);
  const baseOpacity = activeTransportSmoothStep(0.12, 0.26, pocketProgress) * (1 - activeTransportSmoothStep(0.84, 0.98, pocketProgress));
  const size = route === "na" ? { w: 18, h: 15 } : route === "glucose" ? { w: 24, h: 19 } : { w: 25, h: 20 };
  return {
    x: point.x,
    y: point.y,
    halfWidth: size.w,
    halfHeight: size.h,
    shape: route === "na" ? "oval" : "hex",
    opacity: clamp(baseOpacity * 1.38, 0.42, 0.98),
  };
}

function transportIntegratedPocketRecessPath(point) {
  const x = point.x;
  const y = point.y;
  const w = point.halfWidth * 1.2;
  const h = point.halfHeight * 1.16;
  if (point.shape === "hex") {
    return `M${x} ${y - h} L${x + w * 0.86} ${y - h * 0.5} L${x + w * 0.86} ${y + h * 0.5} L${x} ${y + h} L${x - w * 0.86} ${y + h * 0.5} L${x - w * 0.86} ${y - h * 0.5} Z`;
  }
  return `M${x - w} ${y} C${x - w} ${y - h * 0.62} ${x - w * 0.58} ${y - h} ${x} ${y - h} C${x + w * 0.58} ${y - h} ${x + w} ${y - h * 0.62} ${x + w} ${y} C${x + w} ${y + h * 0.62} ${x + w * 0.58} ${y + h} ${x} ${y + h} C${x - w * 0.58} ${y + h} ${x - w} ${y + h * 0.62} ${x - w} ${y} Z`;
}

function transport2dTokenPoint(mode, id, progress, offset = 0) {
  const t = (progress + offset) % 1;
  const fadeIn = activeTransportSmoothStep(0.03, 0.14, t);
  const fadeOut = 1 - activeTransportSmoothStep(0.86, 0.98, t);
  const opacity = clamp(fadeIn * fadeOut, 0.12, 1);

  if (mode === 0) {
    const pass = activeTransportSmoothStep(0.06, 0.92, t);
    const wiggle = Math.sin(t * Math.PI * 2 + offset * 7);
    const lane = id === "co2" ? 1 : id === "o2b" ? -1 : 0;
    return { x: 480 + lane * 32 + wiggle * 13, y: activeTransport2dMixNumber(88, 468, pass), opacity, scale: 0.95 + Math.sin(t * Math.PI) * 0.08 };
  }

  if (mode === 1) {
    const pass = activeTransportSmoothStep(0.08, 0.88, t);
    const lane = id === "water" ? -13 : id === "na" ? 13 : 0;
    return { x: 480 + lane + Math.sin(t * Math.PI * 4) * 3, y: activeTransport2dMixNumber(86, 472, pass), opacity, scale: 0.9 + Math.sin(t * Math.PI) * 0.1 };
  }

  if (mode === 2) {
    const p1 = { x: 480, y: 98 };
    const p2 = { x: 480, y: 202 };
    const p3 = { x: 492, y: 282 };
    const p4 = { x: 480, y: 378 };
    const p5 = { x: 480, y: 482 };
    if (t < 0.24) return { ...activeTransport2dMix(p1, p2, activeTransportSmoothStep(0.02, 0.24, t)), opacity };
    if (t < 0.5) return { ...activeTransport2dMix(p2, p3, activeTransportSmoothStep(0.24, 0.5, t)), opacity: 1, scale: 1.06 };
    if (t < 0.78) return { ...activeTransport2dMix(p3, p4, activeTransportSmoothStep(0.5, 0.78, t)), opacity: 1, scale: 1.02 };
    return { ...activeTransport2dMix(p4, p5, activeTransportSmoothStep(0.78, 0.98, t)), opacity };
  }

  if (mode === 4) {
    const sodiumLane = id === "na" ? -22 : 22;
    const start = { x: 480 + sodiumLane, y: 96 };
    const bind = { x: 480 + sodiumLane * 0.55, y: id === "na" ? 225 : 253 };
    const middle = { x: 488 + sodiumLane * 0.15, y: id === "na" ? 285 : 314 };
    const release = { x: 480 + sodiumLane * 0.48, y: 414 };
    const end = { x: 480 + sodiumLane * 0.9, y: 486 };
    if (t < 0.28) return { ...activeTransport2dMix(start, bind, activeTransportSmoothStep(0.02, 0.28, t)), opacity };
    if (t < 0.55) return { ...activeTransport2dMix(bind, middle, activeTransportSmoothStep(0.28, 0.55, t)), opacity: 1, scale: 1.05 };
    if (t < 0.8) return { ...activeTransport2dMix(middle, release, activeTransportSmoothStep(0.55, 0.8, t)), opacity: 1 };
    return { ...activeTransport2dMix(release, end, activeTransportSmoothStep(0.8, 0.98, t)), opacity };
  }

  return { x: 480, y: 280, opacity: 1, scale: 1 };
}

function transport2dMiniTokenPoint(mode, id, progress, offset = 0) {
  const t = (progress + offset) % 1;
  const fadeIn = activeTransportSmoothStep(0.03, 0.14, t);
  const fadeOut = 1 - activeTransportSmoothStep(0.86, 0.98, t);
  const opacity = clamp(fadeIn * fadeOut, 0.14, 1);

  if (mode === 0) {
    const pass = activeTransportSmoothStep(0.06, 0.92, t);
    const lane = id === "co2" ? 16 : id === "o2b" ? -15 : 0;
    return {
      x: 110 + lane + Math.sin(t * Math.PI * 2 + offset * 8) * 5,
      y: activeTransport2dMixNumber(54, 422, pass),
      opacity,
      scale: 0.78 + Math.sin(t * Math.PI) * 0.05,
    };
  }

  if (mode === 1) {
    const pass = activeTransportSmoothStep(0.08, 0.88, t);
    const lane = id === "water" ? -10 : id === "na" ? 10 : 0;
    return {
      x: 110 + lane + Math.sin(t * Math.PI * 4) * 1.8,
      y: activeTransport2dMixNumber(56, 420, pass),
      opacity,
      scale: 0.72 + Math.sin(t * Math.PI) * 0.06,
    };
  }

  if (mode === 2) {
    return transport2dMiniMoveThroughCarrier(t, "main", opacity);
  }

  if (mode === 3) {
    return transport2dMiniMoveThroughCarrier(t, "active", opacity);
  }

  if (mode === 4) {
    return transport2dMiniMoveThroughCarrier(t, id === "na" ? "na" : "glucose", opacity);
  }

  return { x: 110, y: 240, opacity: 1, scale: 0.8 };
}

function transport2dMiniMoveThroughCarrier(t, route, opacity) {
  const routeOffset = route === "na" ? -15 : route === "glucose" ? 15 : 0;
  const active = route === "active";
  const start = active ? { x: 110, y: 420 } : { x: 110 + routeOffset, y: 54 };
  const bind = active ? { x: 110, y: 346 } : { x: 110 + routeOffset * 0.55, y: route === "glucose" ? 184 : 162 };
  const middle = active ? { x: 114, y: 250 } : { x: 112 + routeOffset * 0.16, y: route === "glucose" ? 248 : 226 };
  const release = active ? { x: 105, y: 146 } : { x: 110 + routeOffset * 0.48, y: 336 };
  const end = active ? { x: 104, y: 58 } : { x: 110 + routeOffset * 0.9, y: 420 };
  if (t < 0.25) return { ...activeTransport2dMix(start, bind, activeTransportSmoothStep(0.02, 0.25, t)), opacity, scale: 0.74 };
  if (t < 0.52) return { ...activeTransport2dMix(bind, middle, activeTransportSmoothStep(0.25, 0.52, t)), opacity: 1, scale: 0.82 };
  if (t < 0.78) return { ...activeTransport2dMix(middle, release, activeTransportSmoothStep(0.52, 0.78, t)), opacity: 1, scale: 0.8 };
  return { ...activeTransport2dMix(release, end, activeTransportSmoothStep(0.78, 0.98, t)), opacity, scale: 0.74 };
}

function transport2dMiniCarrierConformation(mode, progress) {
  if (mode === 3) {
    return activeTransport2dConformation(progress);
  }
  const topOpen = clamp(1 - activeTransportSmoothStep(0.14, 0.34, progress) + activeTransportSmoothStep(0.9, 1, progress), 0, 1);
  const bottomOpen = clamp(activeTransportSmoothStep(0.58, 0.78, progress) * (1 - activeTransportSmoothStep(0.9, 1, progress)), 0, 1);
  const occluded = activeTransportSmoothStep(0.3, 0.46, progress) * (1 - activeTransportSmoothStep(0.54, 0.68, progress));
  const flip = activeTransportSmoothStep(0.42, 0.72, progress) * (1 - activeTransportSmoothStep(0.88, 1, progress));
  return { topOpen, bottomOpen, occluded, flip };
}

function transport2dMiniCarrierShapes(mode, progress) {
  const { topOpen, bottomOpen, occluded, flip } = transport2dMiniCarrierConformation(mode, progress);
  const cx = 110 + flip * 2;
  const topY = 116 - topOpen * 3;
  const midY = 246;
  const bottomY = 374 + bottomOpen * 3;
  const topGap = 8 + topOpen * 26 - occluded * 3;
  const midGap = 9 + topOpen * 4 + bottomOpen * 4 - occluded * 5;
  const bottomGap = 9 + bottomOpen * 30 - occluded * 4;
  const topOuter = mode === 4 ? 48 : 43;
  const midOuter = mode === 4 ? 67 : 61;
  const bottomOuter = mode === 4 ? 76 : 69;
  const left = `
    M${cx - topOuter - topOpen * 2} ${topY}
    C${cx - topOuter - 16} ${topY + 28} ${cx - midOuter - 12} ${midY - 70} ${cx - midOuter} ${midY}
    C${cx - bottomOuter - 12} ${midY + 72} ${cx - bottomOuter - 6} ${bottomY - 18} ${cx - bottomOuter + 12} ${bottomY}
    C${cx - bottomGap / 2 - 18} ${bottomY + 10} ${cx - bottomGap / 2 - 4} ${midY + 74} ${cx - midGap / 2} ${midY + 18}
    C${cx - midGap / 2 - 4} ${midY - 54} ${cx - topGap / 2 - 10} ${topY + 22} ${cx - topGap / 2} ${topY}
    C${cx - topGap / 2 - 15} ${topY - 10} ${cx - topOuter + 10} ${topY - 14} ${cx - topOuter - topOpen * 2} ${topY} Z
  `;
  const right = `
    M${cx + topOuter + topOpen * 2} ${topY}
    C${cx + topOuter + 16} ${topY + 28} ${cx + midOuter + 12} ${midY - 70} ${cx + midOuter} ${midY}
    C${cx + bottomOuter + 12} ${midY + 72} ${cx + bottomOuter + 6} ${bottomY - 18} ${cx + bottomOuter - 12} ${bottomY}
    C${cx + bottomGap / 2 + 18} ${bottomY + 10} ${cx + bottomGap / 2 + 4} ${midY + 74} ${cx + midGap / 2} ${midY + 18}
    C${cx + midGap / 2 + 4} ${midY - 54} ${cx + topGap / 2 + 10} ${topY + 22} ${cx + topGap / 2} ${topY}
    C${cx + topGap / 2 + 15} ${topY - 10} ${cx + topOuter - 10} ${topY - 14} ${cx + topOuter + topOpen * 2} ${topY} Z
  `;
  const cavity = `
    M${cx - topGap / 2} ${topY + 8}
    C${cx - midGap / 2 - 4} ${midY - 74} ${cx - midGap / 2 - 5} ${midY + 54} ${cx - bottomGap / 2} ${bottomY - 8}
    C${cx - 5} ${bottomY + 4} ${cx + 5} ${bottomY + 4} ${cx + bottomGap / 2} ${bottomY - 8}
    C${cx + midGap / 2 + 5} ${midY + 54} ${cx + midGap / 2 + 4} ${midY - 74} ${cx + topGap / 2} ${topY + 8}
    C${cx + 5} ${topY - 2} ${cx - 5} ${topY - 2} ${cx - topGap / 2} ${topY + 8} Z
  `;
  const channel = `
    M${cx - Math.max(4, topGap * 0.46)} ${topY + 14}
    C${cx - Math.max(4, midGap * 0.48)} ${midY - 70} ${cx - Math.max(4, midGap * 0.42)} ${midY + 56} ${cx - Math.max(5, bottomGap * 0.48)} ${bottomY - 14}
    C${cx} ${bottomY - 4} ${cx + Math.max(5, bottomGap * 0.48)} ${bottomY - 14} ${cx + Math.max(4, midGap * 0.42)} ${midY + 56}
    C${cx + Math.max(4, midGap * 0.48)} ${midY - 70} ${cx + Math.max(4, topGap * 0.46)} ${topY + 14} ${cx + Math.max(4, topGap * 0.46)} ${topY + 14}
    C${cx + 5} ${topY + 4} ${cx - 5} ${topY + 4} ${cx - Math.max(4, topGap * 0.46)} ${topY + 14} Z
  `;
  return { left, right, cavity, channel };
}

function transport2dMiniPocketPoint(mode, pocketId, progress) {
  const active = mode === 3;
  const baseOpacity = activeTransportSmoothStep(0.12, 0.26, progress) * (1 - activeTransportSmoothStep(0.84, 0.98, progress));
  if (mode === 4) {
    const route = pocketId === "na" ? "na" : "glucose";
    const point = transport2dMiniMoveThroughCarrier(progress, route, 1);
    return {
      x: point.x,
      y: point.y,
      halfWidth: route === "na" ? 13 : 17,
      halfHeight: route === "na" ? 12 : 14,
      opacity: clamp(baseOpacity, 0.18, 0.82),
    };
  }
  const route = active ? "active" : "main";
  const point = transport2dMiniMoveThroughCarrier(progress, route, 1);
  return {
    x: point.x,
    y: point.y,
    halfWidth: active ? 16 : 19,
    halfHeight: active ? 14 : 15,
    opacity: clamp(baseOpacity, 0.16, 0.82),
  };
}

function transport2dMiniPocketPath(point) {
  const { x, y, halfWidth: w, halfHeight: h } = point;
  return `
    M${x - w} ${y - h}
    C${x - w * 1.2} ${y - h * 0.25} ${x - w * 0.92} ${y + h * 0.7} ${x - w * 0.2} ${y + h * 0.92}
    C${x - w * 0.06} ${y + h} ${x + w * 0.06} ${y + h} ${x + w * 0.2} ${y + h * 0.92}
    C${x + w * 0.92} ${y + h * 0.7} ${x + w * 1.2} ${y - h * 0.25} ${x + w} ${y - h}
    C${x + w * 0.46} ${y - h * 0.32} ${x - w * 0.46} ${y - h * 0.32} ${x - w} ${y - h} Z
  `;
}

function activeTransportStageFromProgress(progress) {
  if (progress < 0.21) return 0;
  if (progress < 0.38) return 1;
  if (progress < 0.56) return 2;
  if (progress < 0.8) return 3;
  return 4;
}

function updateActiveTransport2d(svg, progress, time) {
  const shapes = activeTransport2dProteinShapes(progress);
  svg.querySelector("[data-carrier-left]")?.setAttribute("d", shapes.left);
  svg.querySelector("[data-carrier-right]")?.setAttribute("d", shapes.right);
  svg.querySelector("[data-carrier-cavity]")?.setAttribute("d", shapes.cavity);
  svg.querySelector("[data-carrier-channel]")?.setAttribute("d", shapes.channel);
  svg.querySelector("[data-carrier-pocket-recess]")?.setAttribute("d", shapes.pocketRecess);
  svg.querySelector("[data-carrier-pocket-recess]")?.setAttribute("opacity", String(transportTunedPocketOpacity("activeProtein", shapes.pocketOpacity)));

  const { bottomOpen, topOpen, occluded, flip } = activeTransport2dConformation(progress);
  const phosphorylated = activeTransportSmoothStep(0.35, 0.48, progress) * (1 - activeTransportSmoothStep(0.8, 0.94, progress));

  const ionPoint = activeTransport2dIonPoint(progress);
  const pocketPoint = activeTransport2dStructuralPocket(progress);

  const particleSpeed = clamp(state.activeTransportParticleSpeed || TRANSPORT_2D_DEFAULT_PARTICLE_SPEED, 0.01, 0.18);
  svg.querySelectorAll("[data-lipid-tail]").forEach((tail) => {
    activeTransport2dUpdateLipidTail(tail, time, particleSpeed);
  });

  svg.querySelectorAll("[data-particle]").forEach((particle) => {
    particle.setAttribute("transform", activeTransport2dParticleTransform(particle, time, particleSpeed));
  });

  const ion = svg.querySelector("[data-transported-ion]");
  ion?.setAttribute("transform", `translate(${ionPoint.x} ${ionPoint.y}) scale(${1 + occluded * 0.16 + topOpen * 0.08})`);
  ion?.setAttribute("opacity", progress > 0.9 ? "0.55" : "1");

  const atpase = svg.querySelector("[data-atpase-domain]");
  const atpaseOffsetX = Number(atpase?.dataset.offsetX || 0);
  const atpaseOffsetY = Number(atpase?.dataset.offsetY || 0);
  const atpaseScale = Number(atpase?.dataset.scale || 1);
  const atpaseRotate = (-7 * activeTransportSmoothStep(0.2, 0.38, progress) + 12 * phosphorylated - 5 * flip).toFixed(2);
  const atpaseMotion = `translate(${(atpaseOffsetX + flip * 7).toFixed(2)} ${(atpaseOffsetY - phosphorylated * 4).toFixed(2)}) rotate(${atpaseRotate} 600 440)`;
  const atpaseSize = atpaseScale === 1 ? "" : ` translate(600 440) scale(${atpaseScale}) translate(-600 -440)`;
  atpase?.setAttribute("transform", `${atpaseMotion}${atpaseSize}`);

  const atp = svg.querySelector("[data-atp-molecule]");
  const adp = svg.querySelector("[data-adp-molecule]");
  const pi = svg.querySelector("[data-pi-molecule]");
  const phosphateLink = svg.querySelector("[data-phosphate-link]");
  const atpStart = {
    x: Number(atp?.dataset.startX || 760),
    y: Number(atp?.dataset.startY || 488),
  };
  const atpBound = {
    x: Number(atp?.dataset.boundX || 650),
    y: Number(atp?.dataset.boundY || 443),
  };
  const atpBind = activeTransportSmoothStep(0.18, 0.33, progress);
  const hydrolysis = activeTransportSmoothStep(0.36, 0.48, progress);
  const adpDepart = activeTransportSmoothStep(0.52, 0.74, progress);
  const atpBoundPoint = activeTransport2dMix(atpStart, atpBound, atpBind);
  const atpDepart = {
    x: Number(atp?.dataset.departX || 770),
    y: Number(atp?.dataset.departY || 456),
  };
  const nucleotidePoint = activeTransport2dMix(atpBoundPoint, atpDepart, adpDepart);
  const nucleotideOpacity = 1 - activeTransportSmoothStep(0.76, 0.9, progress);
  const nucleotideScale = 0.82;
  activeTransport2dSetTransform(atp, nucleotidePoint, -12 * atpBind * (1 - hydrolysis) + 20 * adpDepart, nucleotideScale);
  activeTransport2dSetOpacity(atp, nucleotideOpacity);
  activeTransport2dSetOpacity(adp, 0);
  activeTransport2dSetOpacity(pi, 0);

  const atpLabel = atp?.querySelector("[data-atp-label]");
  const adpLabel = atp?.querySelector("[data-adp-label]");
  atpLabel?.setAttribute("opacity", String(1 - hydrolysis));
  adpLabel?.setAttribute("opacity", String(hydrolysis * nucleotideOpacity));

  const terminalPhosphate = atp?.querySelector("[data-terminal-phosphate]");
  if (terminalPhosphate) {
    const homeX = Number(terminalPhosphate.dataset.homeX || 0);
    const homeY = Number(terminalPhosphate.dataset.homeY || 0);
    const detach = activeTransportSmoothStep(0.38, 0.54, progress);
    const release = activeTransportSmoothStep(0.78, 0.96, progress);
    const homeGlobal = {
      x: nucleotidePoint.x + homeX * nucleotideScale,
      y: nucleotidePoint.y + homeY * nucleotideScale,
    };
    const phosphateBound = {
      x: Number(atp?.dataset.phosphateBoundX || 602),
      y: Number(atp?.dataset.phosphateBoundY || 418),
    };
    const phosphateReleased = {
      x: Number(atp?.dataset.phosphateReleaseX || 705),
      y: Number(atp?.dataset.phosphateReleaseY || 392),
    };
    const proteinBound = activeTransport2dMix(homeGlobal, phosphateBound, detach);
    const released = activeTransport2dMix(proteinBound, phosphateReleased, release);
    const localX = (released.x - nucleotidePoint.x) / nucleotideScale;
    const localY = (released.y - nucleotidePoint.y) / nucleotideScale;
    terminalPhosphate.setAttribute("transform", `translate(${localX} ${localY}) rotate(${-20 * release})`);
    terminalPhosphate.setAttribute("opacity", String((1 - activeTransportSmoothStep(0.94, 1, progress)) * nucleotideOpacity));
  }
  phosphateLink?.setAttribute("opacity", String(phosphorylated * 0.92));

  const cavity = svg.querySelector("[data-carrier-cavity]");
  cavity?.setAttribute("opacity", String(0.28 + occluded * 0.1 + topOpen * 0.04 + bottomOpen * 0.03));

  window.__activeTransport2dDebug = {
    progress: Number(progress.toFixed(3)),
    stage: activeTransportStageFromProgress(progress),
    ionX: Number(ionPoint.x.toFixed(1)),
    ionY: Number(ionPoint.y.toFixed(1)),
    recessX: Number(pocketPoint.x.toFixed(1)),
    recessY: Number(pocketPoint.y.toFixed(1)),
    recessOpacity: Number(pocketPoint.opacity.toFixed(2)),
    recessIonDx: Number((pocketPoint.x - ionPoint.x).toFixed(2)),
    recessIonDy: Number((pocketPoint.y - ionPoint.y).toFixed(2)),
  };
}

function activeTransport2dIonPoint(progress) {
  const { bottomOpen, topOpen, occluded, flip } = activeTransport2dConformation(progress);
  const inside = { x: 612, y: 492 };
  const lowerSite = { x: 480 + flip * 5 + bottomOpen * 7, y: 389 + bottomOpen * 9 - occluded * 8 };
  const occludedSite = { x: 480 + flip * 5, y: 286 - occluded * 4 };
  const upperSite = { x: 480 + flip * 5 - topOpen * 7, y: 178 - topOpen * 10 };
  const outside = { x: 480, y: 82 };

  if (progress < 0.16) return activeTransport2dMix(inside, lowerSite, activeTransportSmoothStep(0, 0.16, progress));
  if (progress < 0.3) return lowerSite;
  if (progress < 0.56) return activeTransport2dMix(lowerSite, occludedSite, activeTransportSmoothStep(0.3, 0.56, progress));
  if (progress < 0.76) return activeTransport2dMix(occludedSite, upperSite, activeTransportSmoothStep(0.56, 0.76, progress));
  if (progress < 0.9) return activeTransport2dMix(upperSite, outside, activeTransportSmoothStep(0.76, 0.9, progress));
  return activeTransport2dMix(outside, inside, activeTransportSmoothStep(0.9, 1, progress));
}

function activeTransport2dBindingPocketPoint(progress) {
  const { bottomOpen, topOpen, occluded, flip } = activeTransport2dConformation(progress);
  const lowerSite = {
    x: 480 + flip * 5 + bottomOpen * 7,
    y: 389 + bottomOpen * 9 - occluded * 8,
  };
  const upperSite = {
    x: 480 + flip * 5 - topOpen * 7,
    y: 178 - topOpen * 10,
  };
  const ionPoint = activeTransport2dIonPoint(progress);
  if (progress < 0.16) return lowerSite;
  if (progress < 0.9) return ionPoint;
  return activeTransport2dMix(upperSite, lowerSite, activeTransportSmoothStep(0.9, 1, progress));
}

function activeTransport2dMix(from, to, progress) {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

function activeTransport2dSetTransform(element, point, rotation = 0, scale = 1) {
  if (!element) return;
  element.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${rotation}) scale(${scale})`);
}

function activeTransport2dSetOpacity(element, opacity) {
  if (!element) return;
  element.setAttribute("opacity", String(clamp(opacity, 0, 1)));
}

function activeTransportSmoothStep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0 || 1), 0, 1);
  return x * x * (3 - 2 * x);
}

function transportVisual() {
  const selected = state.stageIndex === 0 ? -1 : clamp(state.stageIndex - 1, 0, 4);
  const isOverview = selected < 0;
  const progress = transport2dProgressValue(performance.now() * 0.001);
  const meta = isOverview
    ? {
      title: "物质运输 / Membrane Transport",
      sequence: "五种运输方式同步展示；点击具体方式后单独强调观察",
    }
    : transport2dModeMeta(selected);
  return `
    <div class="transport-2d-shell transport-integrated-shell mode-${isOverview ? "overview" : selected}" data-transport-2d-shell data-transport-mode-index="${selected}">
      <svg class="transport-2d-svg transport-integrated-svg active-transport-2d-svg" data-transport-2d-svg data-transport-integrated="true" viewBox="0 0 1280 660" role="img" aria-label="完整细胞膜上的五种物质跨膜运输方式动态模型">
        ${transport2dDefs()}

        <rect width="1280" height="660" fill="url(#transportWaterGlow)" />
        <path d="M0 334 C170 326 300 340 486 332 C705 320 870 342 1280 332 L1280 660 L0 660 Z" fill="url(#transportCytoplasm)" opacity="0.94" />
        <path d="M0 220 L1280 220 L1280 336 L0 336 Z" fill="url(#transportCore)" opacity="0.58" />
        <g class="transport-2d-title-block">
          <text x="640" y="34" text-anchor="middle">物质跨膜运输模型</text>
          <text x="640" y="58" text-anchor="middle">同一条细胞膜上比较：自由扩散、通道蛋白、载体蛋白、主动运输与协同转运</text>
        </g>
        <g class="transport-integrated-zone-labels active-transport-2d-labels">
          <text x="56" y="96">细胞外 / Extracellular</text>
          <text x="56" y="600">细胞内 / Intracellular</text>
        </g>

        <g class="active-transport-2d-particles transport-integrated-particles" data-active-particles>
          ${transportIntegratedParticles()}
        </g>

        <g class="active-transport-2d-membrane transport-integrated-membrane" data-transport-part="完整磷脂双分子层 / Cell Membrane">
          ${transportIntegratedLipids()}
        </g>

        <g class="transport-integrated-processes">
          ${transportIntegratedFreeLayer(progress, isOverview || selected === 0)}
          ${transportIntegratedChannelLayer(progress, isOverview || selected === 1)}
          ${transportIntegratedCarrierLayer("facilitated", progress, isOverview || selected === 2)}
          ${transportIntegratedActiveLayer(progress, isOverview || selected === 3)}
          ${transportIntegratedCarrierLayer("cotransport", progress, isOverview || selected === 4)}
        </g>
      </svg>

    </div>
  `;
}

function transport2dDefs() {
  return `
    <defs>
      <radialGradient id="transportWaterGlow" cx="50%" cy="18%" r="70%">
        <stop offset="0%" stop-color="#BFF6FF" />
        <stop offset="52%" stop-color="#7DD3FC" />
        <stop offset="100%" stop-color="#E0F2FE" />
      </radialGradient>
      <linearGradient id="transportCytoplasm" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.72" />
        <stop offset="100%" stop-color="#B45309" stop-opacity="0.34" />
      </linearGradient>
      <linearGradient id="transportCore" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.42" />
        <stop offset="50%" stop-color="#0F172A" stop-opacity="0.34" />
        <stop offset="100%" stop-color="#EFF6FF" stop-opacity="0.42" />
      </linearGradient>
      <radialGradient id="lipidHead2d" cx="38%" cy="26%" r="68%">
        <stop offset="0%" stop-color="#F0FDFF" />
        <stop offset="54%" stop-color="#7DD3FC" />
        <stop offset="100%" stop-color="#0284C7" />
      </radialGradient>
      <linearGradient id="lipidTail2d" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#F0FDFF" />
        <stop offset="54%" stop-color="#BAE6FD" />
        <stop offset="100%" stop-color="#7DD3FC" />
      </linearGradient>
      <linearGradient id="carrierLeft2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#C4B5FD" />
        <stop offset="48%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </linearGradient>
      <linearGradient id="carrierRight2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#93C5FD" />
        <stop offset="46%" stop-color="#2563EB" />
        <stop offset="100%" stop-color="#1D4ED8" />
      </linearGradient>
      <linearGradient id="channelProtein2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#E0F2FE" />
        <stop offset="48%" stop-color="#38BDF8" />
        <stop offset="100%" stop-color="#0E7490" />
      </linearGradient>
      <linearGradient id="carrierAssist2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#F5F3FF" />
        <stop offset="50%" stop-color="#C4B5FD" />
        <stop offset="100%" stop-color="#7C3AED" />
      </linearGradient>
      <linearGradient id="cotransport2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#DCFCE7" />
        <stop offset="54%" stop-color="#4ADE80" />
        <stop offset="100%" stop-color="#15803D" />
      </linearGradient>
      <linearGradient id="proteinChannelUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ECFEFF" />
        <stop offset="48%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0891B2" />
      </linearGradient>
      <linearGradient id="proteinCarrierUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#DCFCE7" />
        <stop offset="48%" stop-color="#22C55E" />
        <stop offset="100%" stop-color="#15803D" />
      </linearGradient>
      <linearGradient id="proteinActiveUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#F3E8FF" />
        <stop offset="48%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </linearGradient>
      <linearGradient id="proteinCotransportUnified2d" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#FFEDD5" />
        <stop offset="48%" stop-color="#F97316" />
        <stop offset="100%" stop-color="#C2410C" />
      </linearGradient>
      <radialGradient id="carrierCavity2d" cx="50%" cy="52%" r="66%">
        <stop offset="0%" stop-color="#F0F9FF" stop-opacity="0.72" />
        <stop offset="58%" stop-color="#BAE6FD" stop-opacity="0.36" />
        <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.18" />
      </radialGradient>
      <linearGradient id="carrierChannelShadow2d" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#0F172A" stop-opacity="0.2" />
        <stop offset="48%" stop-color="#0F172A" stop-opacity="0.42" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.24" />
      </linearGradient>
      <radialGradient id="carrierPocketDepth2d" cx="50%" cy="52%" r="70%">
        <stop offset="0%" stop-color="#0F172A" stop-opacity="0.34" />
        <stop offset="68%" stop-color="#1E3A8A" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.06" />
      </radialGradient>
      <radialGradient id="carrierPocketFloor2d" cx="42%" cy="30%" r="76%">
        <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.9" />
        <stop offset="58%" stop-color="#BAE6FD" stop-opacity="0.56" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.16" />
      </radialGradient>
      <radialGradient id="atpaseDomain2d" cx="44%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </radialGradient>
      <radialGradient id="phosphate2d" cx="36%" cy="28%" r="68%">
        <stop offset="0%" stop-color="#CFFAFE" />
        <stop offset="56%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#0891B2" />
      </radialGradient>
      <radialGradient id="ion2d" cx="35%" cy="28%" r="65%">
        <stop offset="0%" stop-color="#F5D0FE" />
        <stop offset="54%" stop-color="#A855F7" />
        <stop offset="100%" stop-color="#6B21A8" />
      </radialGradient>
      <radialGradient id="smallMolecule2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FCA5A5" />
        <stop offset="100%" stop-color="#DC2626" />
      </radialGradient>
      <radialGradient id="moleculeGreen2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#BBF7D0" />
        <stop offset="100%" stop-color="#16A34A" />
      </radialGradient>
      <radialGradient id="moleculeGold2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#FDE68A" />
        <stop offset="100%" stop-color="#D97706" />
      </radialGradient>
      <radialGradient id="moleculeBlue2d" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stop-color="#BFDBFE" />
        <stop offset="100%" stop-color="#2563EB" />
      </radialGradient>
      <filter id="softShadow2d" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#0F172A" flood-opacity="0.22" />
      </filter>
      <filter id="glow2d" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <marker id="transport2dArrow" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
        <path d="M0 0 L14 7 L0 14 Z" fill="#2563EB" opacity="0.72" />
      </marker>
      <marker id="transport2dArrowRed" markerWidth="14" markerHeight="14" refX="10" refY="7" orient="auto">
        <path d="M0 0 L14 7 L0 14 Z" fill="#DC2626" opacity="0.78" />
      </marker>
    </defs>
  `;
}

function transport2dModeMeta(mode) {
  const modes = [
    {
      title: "自由扩散 / Simple Diffusion",
      subtitle: "小分子直接穿过磷脂双分子层，不需要膜蛋白，不消耗 ATP。",
      sequence: "高浓度一侧 → 穿过脂质双层 → 低浓度一侧",
      gradient: "顺浓度梯度，不消耗 ATP",
      arrowPath: "M712 94 C675 158 632 216 582 278 C532 340 501 408 480 490",
    },
    {
      title: "通道蛋白协助扩散 / Channel-Mediated Diffusion",
      subtitle: "离子或水分子通过选择性通道，通道可开闭，方向仍为顺浓度梯度。",
      sequence: "信号结合开关 → 门页打开 → 3 个离子通过 → 信号离开 → 门页关闭",
      gradient: "顺浓度梯度，不消耗 ATP",
      arrowPath: "M710 92 C650 156 576 204 515 256 C475 290 462 378 480 490",
    },
    {
      title: "载体蛋白协助扩散 / Carrier-Mediated Diffusion",
      subtitle: "底物先与载体蛋白结合，载体构象变化后释放到底物浓度较低的一侧。",
      sequence: "底物结合 → 载体闭合翻转 → 释放底物",
      gradient: "顺浓度梯度，不消耗 ATP",
      arrowPath: "M710 92 C650 164 552 214 500 282 C456 340 456 420 480 490",
    },
    {
      title: "主动运输 / Active Transport",
      subtitle: "ATP 水解提供能量，使载体蛋白把离子逆浓度梯度运输到另一侧。",
      sequence: "离子结合 → ATP 水解 → 构象改变 → 释放 → 复位",
      gradient: "逆浓度梯度，消耗 ATP",
      arrowPath: "M126 486 C146 418 150 346 148 276 C146 204 146 134 164 72",
    },
    {
      title: "协同转运 / Cotransport",
      subtitle: "一个物质顺浓度梯度移动，带动另一个物质逆浓度梯度同向或反向运输。",
      sequence: "驱动物质结合 → 共同结合 → 载体翻转 → 同步释放",
      gradient: "利用浓度势能，属于次级主动运输",
      arrowPath: "M710 92 C638 158 555 224 510 290 C470 352 460 430 480 490",
    },
  ];
  return modes[mode] || modes[0];
}

function transportIntegratedLipids() {
  const pieces = [];
  const lipidXs = [];
  for (let i = 0; i < 64; i += 1) lipidXs.push(4 + i * 20.2);
  lipidXs
    .forEach((x, i) => {
      const phase = (i * 0.63).toFixed(2);
      const ampA = (3.4 + (i % 5) * 0.62).toFixed(2);
      const ampB = (3.75 + ((i + 2) % 5) * 0.58).toFixed(2);
      const bendA = (((i % 7) - 3) * 1.08).toFixed(2);
      const bendB = ((((i + 3) % 7) - 3) * 1.02).toFixed(2);
      const topLeft = activeTransport2dLipidTailPath(x - 4.8, 229, 1, -1, Math.sin(Number(phase)) * Number(ampA), Number(bendA));
      const topRight = activeTransport2dLipidTailPath(x + 4.8, 229, 1, 1, Math.sin(Number(phase) + 1.5) * Number(ampB), Number(bendB));
      const bottomLeft = activeTransport2dLipidTailPath(x - 4.8, 329, -1, -1, Math.sin(Number(phase) + 0.8) * Number(ampB), -Number(bendB));
      const bottomRight = activeTransport2dLipidTailPath(x + 4.8, 329, -1, 1, Math.sin(Number(phase) + 2.3) * Number(ampA), -Number(bendA));
      pieces.push(`
        <g class="active-lipid">
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x - 4.8}" data-y="229" data-leaflet="1" data-side="-1" data-phase="${phase}" data-amp="${ampA}" data-bend="${bendA}" d="${topLeft}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x - 4.8}" data-y="229" data-leaflet="1" data-side="-1" data-phase="${phase}" data-amp="${ampA}" data-bend="${bendA}" d="${topLeft}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x + 4.8}" data-y="229" data-leaflet="1" data-side="1" data-phase="${Number(phase) + 1.5}" data-amp="${ampB}" data-bend="${bendB}" d="${topRight}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x + 4.8}" data-y="229" data-leaflet="1" data-side="1" data-phase="${Number(phase) + 1.5}" data-amp="${ampB}" data-bend="${bendB}" d="${topRight}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x - 4.8}" data-y="329" data-leaflet="-1" data-side="-1" data-phase="${Number(phase) + 0.8}" data-amp="${ampB}" data-bend="${-Number(bendB)}" d="${bottomLeft}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x - 4.8}" data-y="329" data-leaflet="-1" data-side="-1" data-phase="${Number(phase) + 0.8}" data-amp="${ampB}" data-bend="${-Number(bendB)}" d="${bottomLeft}" />
          <path class="lipid-tail lipid-tail-shadow" data-lipid-tail data-x="${x + 4.8}" data-y="329" data-leaflet="-1" data-side="1" data-phase="${Number(phase) + 2.3}" data-amp="${ampA}" data-bend="${-Number(bendA)}" d="${bottomRight}" />
          <path class="lipid-tail lipid-tail-core" data-lipid-tail data-x="${x + 4.8}" data-y="329" data-leaflet="-1" data-side="1" data-phase="${Number(phase) + 2.3}" data-amp="${ampA}" data-bend="${-Number(bendA)}" d="${bottomRight}" />
          <circle cx="${x}" cy="216" r="11.8" fill="url(#lipidHead2d)" stroke="rgba(14,165,233,0.38)" stroke-width="0.65" />
          <ellipse cx="${x - 3.7}" cy="211.7" rx="4.4" ry="3.2" fill="#FFFFFF" opacity="0.38" />
          <circle cx="${x}" cy="342" r="11.8" fill="url(#lipidHead2d)" stroke="rgba(14,165,233,0.38)" stroke-width="0.65" />
          <ellipse cx="${x - 3.7}" cy="337.7" rx="4.4" ry="3.2" fill="#FFFFFF" opacity="0.34" />
        </g>
      `);
    });
  return pieces.join("");
}

function transportIntegratedParticleMarkup(shape, radius, fillId) {
  const glow = `<circle class="transport-integrated-particle-glow" r="${radius + 4}" fill="url(#${fillId})" />`;
  if (shape === "triangle") {
    const points = `0,${(-radius * 1.18).toFixed(1)} ${(radius * 1.05).toFixed(1)},${(radius * 0.74).toFixed(1)} ${(-radius * 1.05).toFixed(1)},${(radius * 0.74).toFixed(1)}`;
    return `${glow}<polygon class="transport-integrated-particle-core" points="${points}" fill="url(#${fillId})" />`;
  }
  if (shape === "hex") {
    const points = Array.from({ length: 6 }, (_, index) => {
      const angle = -Math.PI / 6 + index * Math.PI / 3;
      return `${(Math.cos(angle) * radius * 1.06).toFixed(1)},${(Math.sin(angle) * radius * 1.06).toFixed(1)}`;
    }).join(" ");
    return `${glow}<polygon class="transport-integrated-particle-core" points="${points}" fill="url(#${fillId})" />`;
  }
  return `${glow}<circle class="transport-integrated-particle-core" r="${radius}" fill="url(#${fillId})" />`;
}

function transportIntegratedParticles() {
  const particles = [];
  const outsideRows = [
    { y: 42, type: "smallMolecule2d", shape: "circle", radius: 5.8 },
    { y: 72, type: "ion2d", shape: "hex", radius: 6.6 },
    { y: 104, type: "moleculeGreen2d", shape: "circle", radius: 5.4 },
    { y: 136, type: "moleculeGold2d", shape: "triangle", radius: 6.4 },
    { y: 168, type: "moleculeBlue2d", shape: "circle", radius: 5.8 },
  ];
  const outsideColumns = [88, 328, 568, 808, 1048];
  outsideColumns.forEach((columnX, column) => {
    outsideRows.forEach((row, rowIndex) => {
      const i = column * outsideRows.length + rowIndex;
      const x = columnX + (rowIndex % 2 === 0 ? -14 : 14) + (column % 2 === 0 ? 0 : 18);
      const y = row.y;
      const spin = row.shape === "circle" ? 0 : ((column + rowIndex) % 2 === 0 ? 0.026 : -0.028);
      const direction = (column + rowIndex) % 2 === 0 ? 1 : -1;
      particles.push(`
      <g data-particle data-side="outside" data-base-x="${x}" data-base-y="${y}" data-lane-y="${y}" data-phase="${(i * 0.91).toFixed(2)}" data-phase-b="${(i * 1.57 + rowIndex * 0.61).toFixed(2)}" data-speed="${(0.16 + rowIndex * 0.026).toFixed(2)}" data-range-x="${72 + rowIndex * 16}" data-range-y="${12 + rowIndex * 2}" data-jitter="${(0.5 + (column % 3) * 0.14).toFixed(2)}" data-direction="${direction}" data-spin="${spin}" data-min-x="20" data-max-x="1260" data-min-y="26" data-max-y="194">
        ${transportIntegratedParticleMarkup(row.shape, row.radius, row.type)}
      </g>
    `);
    });
  });
  const insideLanes = [404, 438, 478, 520];
  const insideTypes = ["ion2d", "moleculeGreen2d", "moleculeGold2d", "moleculeBlue2d"];
  const insideShapes = ["circle", "triangle", "hex", "circle"];
  for (let i = 0; i < 10; i += 1) {
    const lane = i % insideLanes.length;
    const x = 58 + ((i * 229) % 1160);
    const y = insideLanes[lane] + ((i % 4) - 1.5) * 4;
    const type = insideTypes[i % insideTypes.length];
    const shape = insideShapes[i % insideShapes.length];
    const radius = shape === "hex" ? 7.2 : 6.4;
    const spin = shape === "circle" ? 0 : (i % 2 === 0 ? -0.014 : 0.017);
    particles.push(`
      <g data-particle data-side="inside" data-base-x="${x}" data-base-y="${y}" data-lane-y="${y}" data-phase="${(i * 1.04 + 2).toFixed(2)}" data-phase-b="${(i * 1.63 + lane * 0.74 + 0.8).toFixed(2)}" data-speed="${(0.13 + lane * 0.02).toFixed(2)}" data-range-x="${110 + lane * 28}" data-range-y="${12 + (i % 2) * 4}" data-jitter="${(0.48 + (i % 3) * 0.16).toFixed(2)}" data-direction="${i % 2 === 0 ? -1 : 1}" data-spin="${spin}" data-min-x="20" data-max-x="1260" data-min-y="382" data-max-y="550">
        ${transportIntegratedParticleMarkup(shape, radius, type)}
      </g>
    `);
  }
  const specialParticles = [
    { side: "outside", x: 246, y: 58, type: "glucose", label: "Glu", phase: 31.4, phaseB: 7.2, speed: 0.13, rangeX: 96, rangeY: 18, spin: 0.022 },
    { side: "outside", x: 548, y: 124, type: "glucose", label: "Glu", phase: 42.9, phaseB: 12.6, speed: 0.14, rangeX: 104, rangeY: 18, spin: -0.021 },
    { side: "outside", x: 850, y: 74, type: "ion", label: "K+", phase: 23.7, phaseB: 17.5, speed: 0.15, rangeX: 92, rangeY: 16, spin: 0 },
    { side: "outside", x: 1152, y: 154, type: "ion", label: "K+", phase: 56.1, phaseB: 22.9, speed: 0.145, rangeX: 98, rangeY: 16, spin: 0 },
    { side: "inside", x: 320, y: 468, type: "atp", label: "ATP", phase: 62.5, phaseB: 31.9, speed: 0.105, rangeX: 118, rangeY: 22, spin: 0.006 },
    { side: "inside", x: 760, y: 512, type: "atp", label: "ATP", phase: 73.3, phaseB: 41.2, speed: 0.11, rangeX: 136, rangeY: 20, spin: -0.005 },
  ];
  specialParticles.forEach((particle, index) => {
    const minY = particle.side === "outside" ? 26 : 382;
    const maxY = particle.side === "outside" ? 194 : 550;
    const body = particle.type === "atp"
      ? `<g class="transport-integrated-atp-particle" transform="scale(0.34)">${activeTransport2dNucleotide("ATP", 3)}</g>`
      : `<g class="transport-integrated-labeled-particle" transform="scale(0.72)">${transport2dMoleculeShape(particle.type, particle.label)}</g>`;
    particles.push(`
      <g data-particle data-side="${particle.side}" data-base-x="${particle.x}" data-base-y="${particle.y}" data-lane-y="${particle.y}" data-phase="${particle.phase}" data-phase-b="${particle.phaseB}" data-speed="${particle.speed}" data-range-x="${particle.rangeX}" data-range-y="${particle.rangeY}" data-jitter="0.62" data-direction="${index % 2 === 0 ? 1 : -1}" data-spin="${particle.spin}" data-min-x="26" data-max-x="1254" data-min-y="${minY}" data-max-y="${maxY}">
        ${body}
      </g>
    `);
  });
  return particles.join("");
}

function transportIntegratedFreeLayer(progress, selected) {
  return `
    <g class="transport-integrated-module free ${selected ? "is-current" : ""}" data-transport-part="自由扩散 / Simple Diffusion">
      ${transportIntegratedToken(0, "o2", "oxygen", "O₂", 0)}
      ${transportIntegratedToken(0, "o2b", "oxygen", "O₂", 0.36)}
      ${transportIntegratedToken(0, "o2c", "oxygen", "O₂", 0.68)}
      ${transportIntegratedToken(0, "co2", "carbon", "CO₂", 0.08)}
      ${transportIntegratedToken(0, "co2b", "carbon", "CO₂", 0.42)}
      ${transportIntegratedToken(0, "co2c", "carbon", "CO₂", 0.78)}
      <text class="transport-integrated-label" x="130" y="128">自由扩散</text>
      <text class="transport-integrated-sublabel" x="130" y="152">无蛋白，不消耗 ATP</text>
    </g>
  `;
}

function transportIntegratedChannelLayer(progress, selected) {
  return `
    <g class="transport-integrated-module channel ${selected ? "is-current" : ""}" data-transport-part="通道蛋白协助扩散 / Channel Protein">
      <g class="transport-integrated-channel" data-integrated-channel>
        <path class="transport-integrated-channel-shell" d="M302 182 C302 158 332 146 380 146 C428 146 458 158 458 182 L458 374 C458 398 428 412 380 412 C332 412 302 398 302 374 Z" />
        <path class="transport-integrated-channel-pore" d="M354 150 L406 150 L406 408 L354 408 Z" />
        <ellipse class="transport-integrated-channel-mouth" cx="380" cy="150" rx="30" ry="8" />
        <ellipse class="transport-integrated-channel-mouth" cx="380" cy="408" rx="30" ry="8" />
        <path class="transport-integrated-channel-gate" data-integrated-channel-gate-left d="M326 152 C344 144 366 147 382 160 L382 181 C363 172 344 172 326 182 Z" />
        <path class="transport-integrated-channel-gate" data-integrated-channel-gate-right d="M434 152 C416 144 394 147 378 160 L378 181 C397 172 416 172 434 182 Z" />
      </g>
      ${transportIntegratedToken(1, "signal", "signal", "信号", 0)}
      ${transportIntegratedToken(1, "k", "ion", "K+", 0)}
      ${transportIntegratedToken(1, "kb", "ion", "K+", 0)}
      ${transportIntegratedToken(1, "kc", "ion", "K+", 0)}
      <text class="transport-integrated-label" x="380" y="108">通道蛋白</text>
      <text class="transport-integrated-sublabel" x="380" y="468">信号结合后开门，亲水通道连续通过离子</text>
    </g>
  `;
}

function transportIntegratedCarrierLayer(kind, progress, selected) {
  const cx = kind === "facilitated" ? 630 : 1130;
  const shapes = transportIntegratedCarrierShapes(kind, progress, cx);
  const proteinFill = kind === "facilitated" ? "url(#proteinCarrierUnified2d)" : "url(#proteinCotransportUnified2d)";
  const title = kind === "facilitated" ? "载体蛋白协助扩散" : "协同转运";
  const desc = kind === "facilitated" ? "GLU 嵌入凹坑，顺浓度梯度转运" : "上下都大，双底物共同结合";
  const pockets = kind === "facilitated"
    ? `<path data-integrated-facilitated-pocket-recess d="${shapes.pocketRecess}" fill="url(#carrierPocketDepth2d)" opacity="${shapes.pocketOpacity}" />`
    : Object.entries(shapes.pocketRecesses || {}).map(([id, recess]) => (
      `<path data-integrated-cotransport-pocket-recess data-pocket-id="${id}" d="${recess.d}" fill="url(#carrierPocketDepth2d)" opacity="${recess.opacity}" />`
    )).join("");
  const tokens = kind === "facilitated"
    ? `${transportIntegratedToken(2, "glucose", "glucose", "Glu", 0)}`
    : `
      ${transportIntegratedToken(4, "na", "sodium", "Na+", 0)}
      ${transportIntegratedToken(4, "glucose", "glucose", "Glu", 0.1)}
    `;
  return `
    <g class="transport-integrated-module carrier ${kind} ${selected ? "is-current" : ""}" data-integrated-carrier data-kind="${kind}" data-cx="${cx}" data-transport-part="${title}">
      <path data-integrated-carrier-left d="${shapes.left}" fill="${proteinFill}" />
      <path data-integrated-carrier-right d="${shapes.right}" fill="${proteinFill}" />
      <path data-integrated-carrier-cavity d="${shapes.cavity}" fill="url(#carrierCavity2d)" />
      <path data-integrated-carrier-channel d="${shapes.channel}" fill="url(#carrierChannelShadow2d)" opacity="0.58" />
      ${pockets}
      ${tokens}
      <text class="transport-integrated-label" x="${cx}" y="128">${title}</text>
      <text class="transport-integrated-sublabel" x="${cx}" y="448">${desc}</text>
    </g>
  `;
}

function transportIntegratedActiveLayer(progress, selected) {
  const shapes = activeTransport2dProteinShapes(progress);
  return `
    <g class="transport-integrated-module active ${selected ? "is-current" : ""}" data-transport-part="主动运输 / Active Transport">
      <g class="transport-integrated-active-reuse" transform="translate(400 0)">
        <g class="active-transport-2d-carrier" data-part="carrier">
          <path data-carrier-left d="${shapes.left}" fill="url(#proteinActiveUnified2d)" />
          <path data-carrier-right d="${shapes.right}" fill="url(#proteinActiveUnified2d)" />
          <path data-carrier-cavity d="${shapes.cavity}" fill="url(#carrierCavity2d)" />
          <path data-carrier-channel d="${shapes.channel}" fill="url(#carrierChannelShadow2d)" opacity="0.72" />
          <path data-carrier-pocket-recess d="${shapes.pocketRecess}" fill="url(#carrierPocketDepth2d)" opacity="${shapes.pocketOpacity}" />
        </g>
        <g class="active-transport-2d-atpase" data-atpase-domain data-part="domain" data-offset-x="-42" data-offset-y="6" data-scale="0.78">
          <path d="M522 431 C516 407 539 392 563 399 C580 383 618 386 630 407 C657 407 675 426 666 450 C657 475 628 479 606 466 C590 481 559 476 551 454 C534 457 522 448 522 431 Z" fill="url(#atpaseDomain2d)" stroke="#D97706" stroke-width="2.2" />
          <text x="600" y="445">ATPase</text>
        </g>
        <g data-transported-ion data-part="ion" filter="url(#glow2d)">
          <circle cx="0" cy="0" r="18" fill="#A855F7" opacity="0.18" />
          <circle cx="0" cy="0" r="10" fill="url(#ion2d)" />
          <text x="0" y="4">K+</text>
        </g>
        <g class="active-transport-2d-energy">
          <path data-phosphate-link d="M600 418 C574 405 548 384 523 358" fill="none" stroke="#F59E0B" stroke-width="2.8" opacity="0" />
          <g data-atp-molecule data-part="atp" data-start-x="480" data-start-y="526" data-bound-x="566" data-bound-y="455" data-depart-x="500" data-depart-y="530" data-phosphate-bound-x="574" data-phosphate-bound-y="423" data-phosphate-release-x="520" data-phosphate-release-y="476">
            ${activeTransport2dNucleotide("ATP", 3)}
          </g>
          <g data-adp-molecule data-part="atp" opacity="0">
            ${activeTransport2dNucleotide("ADP", 2)}
          </g>
          <g data-pi-molecule data-part="atp" opacity="0">
            ${activeTransport2dNucleotide("Pi", 1)}
          </g>
        </g>
      </g>
      <text class="transport-integrated-label" x="880" y="108">主动运输</text>
      <text class="transport-integrated-sublabel" x="880" y="568">成熟版复用：凹坑、ATP 水解与 K+ 转运</text>
    </g>
  `;
}

function transportIntegratedToken(mode, id, type, label, offset = 0) {
  return `
    <g class="transport-2d-token transport-integrated-token ${type}" data-integrated-token data-mode-index="${mode}" data-token-id="${id}" data-offset="${offset}">
      ${transport2dMoleculeShape(type, label)}
    </g>
  `;
}

function transport2dMoleculeShape(type, label) {
  if (type === "oxygen") {
    return `
      <g data-molecule-core>
        <circle cx="-7" cy="0" r="8.6" fill="url(#smallMolecule2d)" />
        <circle cx="7" cy="0" r="8.6" fill="url(#smallMolecule2d)" />
      </g>
      <text x="0" y="24">${label}</text>
    `;
  }
  if (type === "carbon") {
    return `
      <g data-molecule-core>
        <circle cx="-13" cy="0" r="7.2" fill="url(#smallMolecule2d)" />
        <circle cx="0" cy="0" r="8.2" fill="#64748B" />
        <circle cx="13" cy="0" r="7.2" fill="url(#smallMolecule2d)" />
      </g>
      <text x="0" y="24">${label}</text>
    `;
  }
  if (type === "glucose") {
    return `
      <polygon points="0,-15 13,-7 13,7 0,15 -13,7 -13,-7" fill="url(#moleculeGold2d)" stroke="#92400E" stroke-width="1.7" />
      <path d="M-8 -2 H8 M-8 6 H8" stroke="#92400E" stroke-width="2" stroke-linecap="round" />
      <text x="0" y="30">${label}</text>
    `;
  }
  if (type === "sodium") {
    return `
      <circle r="13" fill="url(#moleculeBlue2d)" stroke="#1D4ED8" stroke-width="1.8" />
      <text x="0" y="4">${label}</text>
    `;
  }
  if (type === "water") {
    return `
      <circle r="10" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.6" />
      <circle cx="-5" cy="-4" r="3.4" fill="#FFFFFF" opacity="0.78" />
      <text x="0" y="26">${label}</text>
    `;
  }
  if (type === "signal") {
    return `
      <circle r="9.5" fill="url(#moleculeGreen2d)" stroke="#15803D" stroke-width="1.6" />
      <circle cx="-3" cy="-3" r="3" fill="#FFFFFF" opacity="0.5" />
      <text x="0" y="24">${label}</text>
    `;
  }
  return `
    <circle r="13" fill="url(#ion2d)" stroke="#6B21A8" stroke-width="1.8" />
    <text x="0" y="4">${label}</text>
  `;
}

const ANDER_MODEL_ADAPTER = Object.freeze({
  id: "transport",
  visual: () => transportVisual(),
  mount: () => { mountTransport2d(); },
  wrapClass: "transport-visual-wrap"
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
  if (message.type === 'host:play' && !state.playing) {state.transportPlayStartProgress=state.transportProgress;state.transportPlayStartTime=performance.now()*.001;state.playing=true;}
  if (message.type === 'host:pause' && state.playing) {state.transportProgress=transport2dProgressValue();state.transportPlayStartProgress=state.transportProgress;state.playing=false;}
  if (message.type === "host:reset") return resetState();
  if (message.type === "host:set-stage") {
    const index = currentModel().stages.findIndex((stage) => stage.id === payload.stageId);
    return setStage(index < 0 ? 0 : index);
  }
  if (message.type === "host:set-speed") {
    preserveTransportPhase();
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
  if (action === "speed") {preserveTransportPhase();state.speedIndex = (state.speedIndex + 1) % speeds.length;}
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
  if (action === "fullscreen") return;
  render();
});

document.addEventListener("fullscreenchange", updateControls);
window.addEventListener("message", handleHostMessage);
window.addEventListener("beforeunload", stopVisualRuntime);

render();
mountFoundationExperience();

// Shell 2.5 presentation adapter; scientific geometry, coordinates and timing stay in place.
function prepareFoundationLayout(){
 const isMembrane=currentModel().id==='membrane', visual=refs.stage.querySelector('.visual-wrap');
 visual.classList.add('foundation-layout');
 const info=document.createElement('aside');info.className='foundation-info';info.setAttribute('aria-label',isMembrane?'结构与说明':'运输与说明');
 info.innerHTML='<h2 data-foundation-title></h2><p data-foundation-goal></p><p data-foundation-explanation></p><p data-foundation-mistake></p><h3>观察问题</h3><p data-foundation-question></p><ul class="foundation-legend"></ul>';
 for(const [name,color]of currentModel().structures||[]){const li=document.createElement('li');const dot=document.createElement('i');dot.style.background=color;li.append(dot,document.createTextNode(name));info.querySelector('ul').append(li);}
 const viewport=isMembrane?visual.querySelector('[data-membrane-webgl-viewport]'):document.createElement('div');
 if(isMembrane){
  const stack=visual.querySelector('.membrane-webgl-stack');stack.classList.add('foundation-scene');
  const tools=stack.querySelector('[data-membrane-view-tools]');tools.querySelector('[data-membrane-view="panel"]').remove();
  for(const button of tools.querySelectorAll('button'))button.className='control-button';root.querySelector('.control-group-view').append(tools);
  const bank=stack.querySelector('[data-membrane-webgl-state-control]');bank.className='timeline-wrap foundation-ranges';
  const labels=[...bank.querySelectorAll('label')],value=bank.querySelector('[data-membrane-flow-value]');
  bank.querySelector('.dna-state-header').remove();
  labels[0].querySelector('span').textContent='流速';labels[0].append(value);
  labels[1].querySelector('span').textContent='摆幅';const output=document.createElement('strong');output.dataset.membraneAmplitudeValue='';labels[1].append(output);
  labels.forEach((label,i)=>label.querySelector('input').setAttribute('aria-label',i?'膜流动摆动幅度':'膜流动速度'));
  root.querySelector('.control-group-primary').after(bank);
 }else{
  const shell=visual.querySelector('[data-transport-2d-shell]');shell.classList.add('foundation-scene');
  viewport.dataset.transportViewport='';viewport.className='transport-viewport';viewport.tabIndex=0;viewport.setAttribute('aria-label','跨膜运输画面，双指或滚轮缩放，拖动平移');
  const svg=shell.querySelector('svg'),plane=document.createElement('div'),background=document.createElement('div');
  plane.className='transport-plane';plane.dataset.transportForeground='';background.className='transport-plane transport-background-plane';background.setAttribute('aria-hidden','true');
  // Original environment paths are behind a viewport-anchored HTML watermark, outside SVG foreignObject.
  const backSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');backSvg.setAttribute('viewBox','0 0 1280 660');
  const defs=svg.querySelector('defs').cloneNode(true);defs.innerHTML=defs.innerHTML.replace(/id="([^"]+)"/g,'id="back-$1"').replace(/url\(#([^)]+)\)/g,'url(#back-$1)');backSvg.append(defs);
  for(const key of ['transportWaterGlow','transportCytoplasm','transportCore']){const node=svg.querySelector('[fill="url(#'+key+')"]');node.setAttribute('fill','url(#back-'+key+')');backSvg.append(node);}
  background.append(backSvg);plane.append(svg);viewport.append(background,plane);shell.append(viewport);
  const bank=document.createElement('div');bank.className='timeline-wrap foundation-ranges';bank.innerHTML='<label><span>进度</span><input type="range" min="0" max="100" step="1" value="8" data-transport-2d-progress aria-label="运输过程进度"><strong data-transport-2d-progress-value>8%</strong></label><label><span>分子速度</span><input type="range" min="1" max="18" step="1" value="16" data-transport-2d-particle-speed aria-label="背景分子运动速度"><strong data-transport-speed-value>16%</strong></label>';
  root.querySelector('.control-group-primary').after(bank);
  const tools=document.createElement('div');tools.className='foundation-view-tools';tools.innerHTML='<button type="button" class="control-button" data-scene-view="fit">全景</button><button type="button" class="control-button" data-scene-view="in">放大</button><button type="button" class="control-button" data-scene-view="out">缩小</button>';root.querySelector('.control-group-view').append(tools);
  sceneNavigation=ModelSceneNavigation({viewport,planes:[plane,background],width:1280,height:660,initial:'fit'});
  tools.addEventListener('click',e=>{const action=e.target.closest('[data-scene-view]')?.dataset.sceneView;if(action==='fit')sceneNavigation.fit();else if(action)sceneNavigation.zoomBy(action==='in'?1.25:.8);});
 }
 const feedback=document.createElement('p');feedback.className='foundation-feedback';feedback.setAttribute(isMembrane?'data-membrane-webgl-feedback':'data-transport-2d-feedback','');feedback.setAttribute('aria-live','polite');viewport.parentElement.append(feedback);
 const trigger=document.createElement('button');trigger.className='shell-action foundation-context';trigger.type='button';trigger.textContent=isMembrane?'结构与说明 ↗':'运输与说明 ↗';trigger.addEventListener('click',event=>openFoundationInfo(event.currentTarget));
 visual.append(info,trigger);
}
function syncFoundationInfo(){
 const stage=currentStage();for(const key of ['title','goal','explanation','mistake','question']){const el=root.querySelector('[data-foundation-'+key+']');if(el)el.textContent=stage[key]||'';}
}
function openFoundationInfo(trigger){shellExperience?.showPanel(root.querySelector('.foundation-info'),currentModel().id==='membrane'?'结构与说明':'运输与说明',trigger);}
function mountFoundationExperience(){
 const isMembrane=currentModel().id==='membrane',common=globalThis.AnderModelShell;
 const help=isMembrane?'<p>单指或鼠标左键拖动旋转；双指移动或鼠标右键拖动平移；双指捏合或滚轮缩放。全部手指离开后，新的单指操作才恢复旋转。</p><p>底部流速与摆幅实时调节膜的运动。“观察”中可切换视角、标签、速度及完整取景。</p>':'<p>同一条细胞膜中比较五种运输方式；选择阶段强调相应过程。播放或拖动底部进度观察过程，另一条滑杆调节背景分子速度。</p><p>双指或滚轮缩放，拖动平移；“观察”中的“全景”恢复完整画面。放大和移动画面不改变分子的科学坐标与运动过程。</p>';
 const description=help+'<p>进入全屏后，松手约 2 秒收起操作栏，触碰唤出；操作滑杆或面板时保持显示。收藏由打开模型的网站提供。</p>';
 const settings=trigger=>shellExperience.showDialog('显示与操作',description,trigger);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();else shellExperience.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);};
 shellExperience=common.mountExperience({root:refs.modelArea,viewport:root.querySelector(isMembrane?'[data-membrane-webgl-viewport]':'[data-transport-viewport]'),title:ANDER_MODEL_MANIFEST.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,contextLabel:isMembrane?'结构与说明':'运输与说明',onContext:openFoundationInfo,hasContext:()=>true,helpContent:description,onSettings:settings,settingsLabel:'显示与操作',onDisplayChange:()=>requestAnimationFrame(()=>{sceneRuntime?.resize();sceneNavigation?.resize();})});
 const button=root.querySelector('[data-foundation-settings]');common.setExtra(button,'settings','显示与操作');button.addEventListener('click',event=>settings(event.currentTarget));
 root.querySelector('.independent-model-back').addEventListener('click',event=>{event.preventDefault();onReturn();});
 shellExperience.setSceneStatus(sceneRuntime?'ready':'loading');
 globalThis.FoundationSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...cloneValue(state),ready:!!sceneRuntime,shell:shellExperience.getState(),navigation:sceneNavigation?.getState()})});
}

function preserveTransportPhase(){if(state.playing){const now=performance.now()*.001;state.transportPlayStartProgress=transport2dProgressValue(now);state.transportPlayStartTime=now;}}
