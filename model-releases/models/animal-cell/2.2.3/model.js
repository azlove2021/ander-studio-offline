"use strict";

const ANDER_MODEL_CONTENT = {"id":"animal-cell","accent":"#8B5CF6","title":"动物细胞结构模型","titleEn":"Animal Cell Structure","chapter":"细胞的基本结构 / Cell Structure","type":"3D WebGL 动态模型","state":"动物细胞主要结构综合观察","visual":"animalCellWebgl","structures":[["细胞膜 Plasma Membrane","#38BDF8"],["细胞核 Nucleus","#A855F7"],["内质网 Endoplasmic Reticulum","#B45309"],["高尔基体 Golgi Apparatus","#06B6D4"],["核糖体 Ribosome","#7C3AED"],["线粒体 Mitochondrion","#F97316"],["中心体 Centrosome","#EC4899"],["溶酶体 Lysosome","#F59E0B"]],"stages":[{"title":"整体结构","titleEn":"Overall Structure","goal":"从三维模型中认识动物细胞膜、细胞核和主要细胞器的空间关系。","keywords":["动物细胞 Animal Cell","细胞器 Organelles","空间分布 3D Arrangement"],"explanation":"动物细胞没有细胞壁，细胞膜直接构成细胞边界。细胞核、内质网、高尔基体、线粒体、核糖体、中心体和溶酶体分布在细胞质中。","mistake":"动物细胞没有固定的长方形外形；本模型用近似球形表示常见的游离动物细胞。","question":"与植物细胞相比，动物细胞缺少哪些结构，又具有哪些典型结构？","id":"overview"},{"title":"细胞膜","titleEn":"Cell Membrane","goal":"观察球形细胞膜与细胞质之间的边界关系。","keywords":["细胞膜 Plasma Membrane","选择透过性 Selective Permeability","细胞边界 Cell Boundary"],"explanation":"动物细胞没有细胞壁，细胞膜直接包围细胞质，控制物质进出并参与细胞间的信息交流。","mistake":"细胞膜不是坚硬外壳，它具有一定流动性，形状可随细胞状态发生变化。","question":"动物细胞为什么比有细胞壁的植物细胞更容易发生形状变化？","id":"cell-membrane"},{"title":"细胞核","titleEn":"Nucleus","goal":"观察核膜、核孔、染色质和核仁的空间结构。","keywords":["核膜 Nuclear Envelope","核孔 Nuclear Pore","核仁 Nucleolus"],"explanation":"细胞核储存遗传信息，并通过核孔与细胞质交换物质和信息，调控细胞的代谢和遗传活动。","mistake":"核仁不是独立的小细胞，而是细胞核内部与核糖体形成有关的结构。","question":"核孔在遗传信息表达过程中承担什么作用？","id":"nucleus"},{"title":"生物膜系统","titleEn":"Biomembrane System","goal":"比较细胞膜、核膜、内质网、高尔基体、线粒体和溶酶体的膜结构。","keywords":["生物膜系统 Biomembrane System","内质网 ER","高尔基体 Golgi"],"explanation":"细胞膜、核膜以及多种具膜细胞器在结构和功能上相互联系，使细胞内不同反应能够分区、有序地进行。","mistake":"生物膜系统不是一张连续的大膜，而是多种膜结构之间的分工与协作。","question":"具膜细胞器为什么能提高细胞内化学反应的效率？","id":"biomembrane"},{"title":"能量转化","titleEn":"Energy Conversion","goal":"观察线粒体外膜、内膜和嵴，理解其能量转化功能。","keywords":["线粒体 Mitochondrion","线粒体嵴 Cristae","细胞呼吸 Cellular Respiration"],"explanation":"线粒体内膜向内折叠形成嵴，为有氧呼吸有关反应提供较大的膜面积，是动物细胞进行能量转化的重要场所。","mistake":"动物细胞不含叶绿体，生命活动所需能量主要由线粒体等结构参与转化。","question":"线粒体内膜形成大量嵴有什么意义？","id":"energy"},{"title":"蛋白质合成与加工","titleEn":"Protein Synthesis and Processing","goal":"追踪核糖体、内质网、高尔基体和囊泡在蛋白质合成加工中的分工。","keywords":["核糖体 Ribosome","粗面内质网 Rough ER","高尔基体 Golgi"],"explanation":"核糖体合成蛋白质，粗面内质网参与初步加工与运输，高尔基体进一步修饰、分类和包装，囊泡承担定向运输。","mistake":"核糖体没有膜结构，但它是蛋白质合成的场所，并与内质网和高尔基体密切配合。","question":"分泌蛋白从合成到排出细胞通常依次经过哪些结构？","id":"protein-synthesis"},{"title":"中心体与溶酶体","titleEn":"Centrosome and Lysosome","goal":"认识动物细胞中中心体和溶酶体的结构与功能。","keywords":["中心体 Centrosome","中心粒 Centriole","溶酶体 Lysosome"],"explanation":"中心体由两个互相垂直的中心粒及周围物质组成，参与细胞分裂；溶酶体内含多种水解酶，参与分解衰老、损伤的细胞器以及吞入细胞的物质。","mistake":"中心体和溶酶体功能不同：中心体主要参与微管组织与细胞分裂，溶酶体主要承担细胞内消化。","question":"中心体和溶酶体分别如何维持动物细胞的正常生命活动？","id":"animal-organelles"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"animal-cell","version":"2.2.3","publish":true,"title":{"zh":"动物细胞结构模型","en":"Animal Cell Structure Model"},"summary":{"zh":"观察球形动物细胞膜、细胞核、主要细胞器，以及中心体和溶酶体。","en":"Explore the spherical animal-cell membrane, nucleus, major organelles, centrosome and lysosomes."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"整体结构","en":"Overall Structure"}},{"id":"cell-membrane","title":{"zh":"细胞膜","en":"Cell Membrane"}},{"id":"nucleus","title":{"zh":"细胞核","en":"Nucleus"}},{"id":"biomembrane","title":{"zh":"生物膜系统","en":"Biomembrane System"}},{"id":"energy","title":{"zh":"能量转化","en":"Energy Conversion"}},{"id":"protein-synthesis","title":{"zh":"蛋白质合成与加工","en":"Protein Synthesis and Processing"}},{"id":"animal-organelles","title":{"zh":"中心体与溶酶体","en":"Centrosome and Lysosome"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.0"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"animal-cell","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"animalCellSelected":"","animalCellSoloPart":"all","animalCellWebglQuaternion":{"x":0,"y":0,"z":0,"w":1},"animalCellWebglRotation":{"x":0,"y":0},"animalCellWebglZoom":1,"animalCellWebglPan":{"x":0,"y":0},"animalCellWebglViewIndex":-1};
const speeds = [0.5, 1, 1.5, 2];
const views = ["整体视角", "局部视角", "侧面视角", "顶部视角", "底部视角"];
const state = cloneValue(ANDER_MODEL_DEFAULT_STATE);
const models = [ANDER_MODEL_CONTENT];
let dnaAnimationFrame = 0;
let dnaWebglAnimationFrame = 0;
let dnaWebglCleanup = null;
let threeModulePromise = null;
let animalCellRuntime = null;
let animalCellMountFrame = 0;
let shellExperience = null;

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
      <button class="shell-icon-button" type="button" data-animal-settings aria-label="显示与操作"></button>
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
          <button class="control-button" type="button" data-shell-tools></button>
          <div class="control-group control-group-personal">
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
  play: "play",
  reset: "reset",
  prev: "stages",
  next: "stages",
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
  if (animalCellMountFrame) cancelAnimationFrame(animalCellMountFrame);
  animalCellMountFrame = 0;
  if (dnaAnimationFrame) cancelAnimationFrame(dnaAnimationFrame);
  if (dnaWebglAnimationFrame) cancelAnimationFrame(dnaWebglAnimationFrame);
  dnaAnimationFrame = 0;
  dnaWebglAnimationFrame = 0;
  if (typeof dnaWebglCleanup === "function") dnaWebglCleanup();
  dnaWebglCleanup = null;
  animalCellRuntime = null;
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
  set("prev", "prev", "上一阶段");
  set("next", "next", "下一阶段");
  set("speed", "speed", `${speeds[state.speedIndex]}x`);
  set("labels", "labels", "标签");
  set("highlight", "highlight", "高亮");
  set("view", "view", "视角");
  set("practice", "practice", "练习");
  set("fullscreen", "fullscreen", isModelFullscreenActive() ? "退出全屏" : "全屏");
  $(`[data-action="labels"]`)?.setAttribute("aria-pressed", String(state.labels));
  $(`[data-action="highlight"]`)?.setAttribute("aria-pressed", String(state.highlight));
  $('[data-action="prev"]').disabled=state.stageIndex===0;
  $('[data-action="next"]').disabled=state.stageIndex===currentModel().stages.length-1;
  $('[data-animal-stage-title]')?.replaceChildren(document.createTextNode(currentStage().title));
  $('[data-animal-stage-description]')?.replaceChildren(document.createTextNode(currentStage().explanation));
}

function renderVisual(options = {}) {
  const visualClass = [state.labels ? "" : "hidden-labels", state.highlight ? "highlight-on" : "", state.playing ? "playing" : ""].filter(Boolean).join(" ");
  refs.stage.className = "model-stage";
  refs.stage.style.setProperty("--speed-factor", speeds[state.speedIndex]);
  const existing = refs.stage.querySelector('.visual-wrap');
  if (existing) {
    existing.className = `visual-wrap ${ANDER_MODEL_ADAPTER.wrapClass || ""} ${visualClass}`;
    if (animalCellRuntime) {
      animalCellRuntime.sync(options);
      return;
    }
  } else {
    refs.stage.innerHTML = `<div class="visual-wrap ${ANDER_MODEL_ADAPTER.wrapClass || ""} ${visualClass}">${ANDER_MODEL_ADAPTER.visual()}</div>`;
  }
  if (!animalCellMountFrame && !dnaWebglCleanup) {
    animalCellMountFrame = requestAnimationFrame(() => {
      animalCellMountFrame = 0;
      ANDER_MODEL_ADAPTER.mount?.();
    });
  }
}

function render(options = {}) {
  renderStages();
  renderVisual(options);
  updateControls();
  reportModelState();
}

function setStage(index) {
  state.stageIndex = Math.max(0, Math.min(Number(index) || 0, currentModel().stages.length - 1));
  state.dnaSelected = "";
  state.rnaSelected = "";
  state.proteinSelected = "";
  state.membraneSelected = "";
  state.animalCellSelected = "";
  state.activeTransportSelected = "";
  if (currentModel().visual === "animalCellWebgl") state.animalCellSoloPart = "all";
  if (currentModel().visual === "proteinWebgl") state.proteinProgress = state.stageIndex;
  if (currentModel().visual === "transport") {
    state.transportProgress = 0.08;
    state.transportPlayStartProgress = 0.08;
    state.transportPlayStartTime = state.playing ? performance.now() * 0.001 : 0;
  }
  render({ resetAnimation: true });
  emitModelMessage("model:stage-changed", { stageId: currentStage().id || String(state.stageIndex), stageIndex: state.stageIndex });
}

function resetState() {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, cloneValue(ANDER_MODEL_DEFAULT_STATE));
  render({ resetAnimation: true });
}


function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DNA_THREE_URL = "./vendor/three.module.min.js";
let threeModuleAttempt = 0;

function loadThreeForDna() {
  if (!threeModulePromise) {
    // Failed dynamic imports stay cached for this document; an explicit retry needs a fresh URL.
    threeModulePromise = import(threeModuleAttempt ? `${DNA_THREE_URL}?retry=${threeModuleAttempt}` : DNA_THREE_URL);
  }
  return threeModulePromise;
}

function mountAnimalCellWebgl() {
  const shell = document.querySelector("[data-animal-cell-shell]");
  const host = document.querySelector("[data-animal-cell-host]");
  const labelsLayer = document.querySelector("[data-animal-cell-labels]");
  const feedback = document.querySelector("[data-animal-cell-feedback]");
  const loading = document.querySelector("[data-animal-cell-loading]");
  if (!shell || !host || !labelsLayer) return;

  let disposed = false;
  let instance = null;
  dnaWebglCleanup = () => {
    disposed = true;
    if (instance) instance.dispose();
    animalCellRuntime = null;
    dnaWebglCleanup = null;
  };

  loadThreeForDna()
    .then((THREE) => {
      if (disposed || !document.body.contains(shell)) return;
      instance = startAnimalCellWebgl(THREE, shell, host, labelsLayer, feedback, loading);
      animalCellRuntime = instance;
      shellExperience?.setSceneStatus('ready');
    })
    .catch((error) => {
      if (disposed || !document.body.contains(shell)) return;
      console.warn("Three.js failed to load", error);
      if (loading) {
        loading.textContent = "WebGL 动物细胞模型加载失败：请检查网络或 Three.js 文件。";
      }
      shellExperience?.setSceneStatus('error','三维画面未能加载，请重试或换用支持 WebGL 的浏览器。',()=>{
        stopVisualRuntime();threeModulePromise=null;threeModuleAttempt++;setAnimalSceneStatus('loading');render();
      });
    });
}

function membraneOrganicBlobGeometry(THREE, radiusX, radiusY, radiusZ, seed, options = {}) {
  const widthSegments = 32;
  const heightSegments = 18;
  const vertices = [];
  const indices = [];
  const lobes = options.lobes || [];
  const surfaceStrength = options.surfaceStrength ?? 0.04;
  for (let yi = 0; yi <= heightSegments; yi += 1) {
    const v = yi / heightSegments;
    const phi = v * Math.PI;
    for (let xi = 0; xi <= widthSegments; xi += 1) {
      const u = xi / widthSegments;
      const theta = u * Math.PI * 2;
      const bump = 1
        + Math.sin(theta * 2.5 + seed) * Math.sin(phi * 1.7) * 0.08
        + Math.cos(theta * 4.1 - seed * 0.7) * Math.sin(phi * 2.4) * 0.055
        + Math.sin(theta + phi * 3 + seed * 0.5) * 0.035;
      let lobeScale = 0;
      lobes.forEach((lobe) => {
        const angleDelta = Math.atan2(Math.sin(theta - lobe.angle), Math.cos(theta - lobe.angle));
        const vDelta = v - lobe.v;
        const angularFalloff = Math.exp(-(angleDelta * angleDelta) / (2 * (lobe.widthAngle || 0.86) ** 2));
        const verticalFalloff = Math.exp(-(vDelta * vDelta) / (2 * (lobe.widthV || 0.2) ** 2));
        lobeScale += (lobe.strength || 0) * angularFalloff * verticalFalloff;
      });
      const surfaceDetail = (
        Math.sin(theta * 3.8 + phi * 2.2 + seed) * 0.58
        + Math.cos(theta * 5.4 - phi * 3.1 + seed * 0.5) * 0.42
      ) * surfaceStrength * Math.sin(phi);
      const surfaceScale = Math.max(0.55, bump * (1 + lobeScale + surfaceDetail));
      vertices.push(
        Math.sin(phi) * Math.cos(theta) * radiusX * surfaceScale,
        Math.cos(phi) * radiusY * (1 + Math.sin(theta * 2 + seed) * 0.035),
        Math.sin(phi) * Math.sin(theta) * radiusZ * surfaceScale,
      );
    }
  }
  const row = widthSegments + 1;
  for (let yi = 0; yi < heightSegments; yi += 1) {
    for (let xi = 0; xi < widthSegments; xi += 1) {
      const a = yi * row + xi;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const ANIMAL_CELL_VIEW_SIZE = 82;

const ANIMAL_CELL_STRUCTURE_MODES = [
  { id: "er", label: "内质网", labelEn: "Endoplasmic Reticulum", color: "#B45309" },
  { id: "golgi", label: "高尔基体", labelEn: "Golgi Apparatus", color: "#06B6D4" },
  { id: "ribosome", label: "核糖体", labelEn: "Ribosome", color: "#7C3AED" },
  { id: "mitochondrion", label: "线粒体", labelEn: "Mitochondrion", color: "#F97316" },
  { id: "centrosome", label: "中心体", labelEn: "Centrosome", color: "#EC4899" },
  { id: "lysosome", label: "溶酶体", labelEn: "Lysosome", color: "#F59E0B" },
];

const ANIMAL_CELL_PART_LABELS = {
  membrane: "细胞膜 / Plasma Membrane",
  cytoplasm: "细胞质 / Cytoplasm",
  nucleus: "细胞核 / Nucleus",
  nuclearEnvelope: "核膜 / Nuclear Envelope",
  nuclearPore: "核孔 / Nuclear Pore",
  nucleolus: "核仁 / Nucleolus",
  er: "内质网 / Endoplasmic Reticulum",
  ribosome: "核糖体 / Ribosome",
  golgi: "高尔基体 / Golgi Apparatus",
  vesicle: "囊泡 / Vesicle",
  mitochondrion: "线粒体 / Mitochondrion",
  centrosome: "中心体 / Centrosome",
  lysosome: "溶酶体 / Lysosome",
  peroxisome: "过氧化物酶体 / Peroxisome",
};

function startAnimalCellWebgl(THREE, shell, host, labelsLayer, feedback, loading) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
  renderer.domElement.className = "dna-webgl-canvas";
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL 动物细胞结构模型");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 560);
  camera.position.set(0, 0, 150);
  camera.lookAt(0, 0, 0);

  const panRoot = new THREE.Group();
  const plantRoot = new THREE.Group();
  const modelGroup = new THREE.Group();
  scene.add(panRoot);
  panRoot.add(plantRoot);
  plantRoot.add(modelGroup);

  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const hemi = new THREE.HemisphereLight(0xf8fbff, 0xfff6dc, 0.78);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.72);
  key.position.set(-8, 10, 13);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdff6ff, 0.84);
  fill.position.set(9, 4, 6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.68);
  rim.position.set(0, -8, 10);
  scene.add(rim);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  const animationItems = [];
  const partGroups = new Map();
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
  const stack = shell.closest(".animal-cell-stack") || shell;
  const partModeButtons = [...stack.querySelectorAll("[data-animal-cell-part-mode]")];
  const partModeCurrent = stack.querySelector("[data-animal-cell-part-current]");
  let disposed = false;

  applyAnimalCellWebglViewPreset(THREE, plantRoot, panRoot, camera);

  let labelWidth = 0, labelHeight = 0;
  const resize = () => {
    const rect = host.getBoundingClientRect();
    labelWidth = rect.width;
    labelHeight = rect.height;
    const width = Math.max(1, Math.round(rect.width || shell.clientWidth || 1));
    const height = Math.max(1, Math.round(rect.height || shell.clientHeight || 1));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    // Fit the original sphere to the shorter viewport edge, without changing
    // authored geometry or the user's zoom/pan/rotation. Immersion uses more of it.
    const viewSize=ANIMAL_CELL_VIEW_SIZE*(refs.modelArea.dataset.immersive==='true'?1.04:1.16)/Math.min(1,aspect);
    camera.left = (-viewSize * aspect) / 2;
    camera.right = (viewSize * aspect) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.zoom = state.animalCellWebglZoom;
    camera.updateProjectionMatrix();
    labelItems.forEach(item=>{item.width=item.el.offsetWidth||item.width;item.height=item.el.offsetHeight||item.height;});
  };

  const saveTransformState = () => {
    state.animalCellWebglRotation = {
      x: plantRoot.rotation.x,
      y: plantRoot.rotation.y,
    };
    state.animalCellWebglQuaternion = {
      x: plantRoot.quaternion.x,
      y: plantRoot.quaternion.y,
      z: plantRoot.quaternion.z,
      w: plantRoot.quaternion.w,
    };
    state.animalCellWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.animalCellWebglZoom = camera.zoom;
  };

  const setFeedback = (text) => {
    if (feedback) feedback.textContent = text;
  };

  const plantPartModeLabel = () =>
    ANIMAL_CELL_STRUCTURE_MODES.find((mode) => mode.id === (state.animalCellSoloPart || "all")) ||
    { id: "all", label: "完整细胞", labelEn: "Whole Cell", color: "#16A34A" };

  const syncPartModeControls = () => {
    const mode = plantPartModeLabel();
    if (partModeCurrent) partModeCurrent.textContent = mode.label;
    partModeButtons.forEach((button) => {
      const isActive = button.dataset.animalCellPartMode === mode.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const addLabel = (text, position, color = "#0f172a", offset = { x: 0, y: -32 }, parent = modelGroup) => {
    const anchor = new THREE.Object3D();
    anchor.position.copy(position);
    parent.add(anchor);
    const el = document.createElement("div");
    el.className = "dna-webgl-label";
    el.textContent = text;
    el.style.setProperty("--label-color", color);
    labelsLayer.appendChild(el);
    const line=document.createElementNS('http://www.w3.org/2000/svg','path');
    line.setAttribute('stroke',color);labelsLayer.querySelector('svg').append(line);
    const item = { anchor, el, line, offset, opacity: 1, width:el.offsetWidth, height:el.offsetHeight };
    labelItems.push(item);
    return item;
  };

  const build = () => {
    buildCoreAnimalCellModel(THREE, modelGroup, pickables, addLabel, animationItems, partGroups);
    applyAnimalCellStageFocus(partGroups);
    syncPartModeControls();
  };

  const labelPosition = new THREE.Vector3();
  const projectLabels = () => {
    labelsLayer.hidden = !state.labels;
    if (!state.labels) return;
    // renderer.render has already updated the full world hierarchy once.
    // Read those matrices, rather than walking thousands of meshes per label.
    const occupied=[];
    const compact=labelWidth<600||labelHeight<360;
    const intersects=(a,b)=>a.x<b.x+b.width+5&&a.x+a.width+5>b.x&&a.y<b.y+b.height+5&&a.y+a.height+5>b.y;
    // Reserve the standard corner mark and the model-specific context entry.
    occupied.push({x:0,y:labelHeight-66,width:68,height:66});
    if(refs.modelArea.dataset.immersive!=='true'&&compact)occupied.push({x:labelWidth-140,y:0,width:140,height:42});
    labelItems.forEach((item) => {
      const projected = labelPosition.setFromMatrixPosition(item.anchor.matrixWorld).project(camera);
      const ax=(projected.x*.5+.5)*labelWidth, ay=(-projected.y*.5+.5)*labelHeight;
      const w=item.width||60,h=item.height||25;
      const visible=Number.isFinite(ax)&&Number.isFinite(ay)&&projected.z>=-1&&projected.z<=1&&ax>=0&&ax<=labelWidth&&ay>=0&&ay<=labelHeight;
      item.el.hidden=!visible;item.line.style.display=visible?'':'none';
      if(!visible)return;
      const home={x:clamp(ax+(item.offset?.x||0)-w/2,4,labelWidth-w-4),y:clamp(ay+(item.offset?.y||0)-h/2,4,labelHeight-h-24),width:w,height:h};
      const candidates=[home];
      for(let radius=1;radius<=8;radius++)for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]]){
        candidates.push({x:clamp(home.x+dx*radius*(w+7)/2,4,labelWidth-w-4),y:clamp(home.y+dy*radius*(h+7),4,labelHeight-h-24),width:w,height:h});
      }
      const place=candidates.find(candidate=>!occupied.some(other=>intersects(candidate,other)));
      if(!place){item.el.hidden=true;item.line.style.display='none';return;}
      occupied.push(place);
      item.el.style.transform=`translate(${Math.round(place.x)}px, ${Math.round(place.y)}px)`;
      item.el.style.opacity=String(item.opacity??1);
      const endX=clamp(ax,place.x,place.x+w),endY=clamp(ay,place.y,place.y+h);
      item.line.setAttribute('d',`M${ax.toFixed(1)} ${ay.toFixed(1)}L${endX.toFixed(1)} ${endY.toFixed(1)}`);
    });
  };

  const renderPlantFrame = (time = performance.now() * 0.001) => {
    const speed = state.playing ? speeds[state.speedIndex] : 0.46;
    updateAnimalCellAnimations(THREE, animationItems, time, speed);
    renderer.render(scene, camera);
    projectLabels();
  };

  const animate = () => {
    dnaWebglAnimationFrame = 0;
    if (disposed || document.hidden || !document.body.contains(shell)) return;
    renderPlantFrame();
    dnaWebglAnimationFrame = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  build();
  resize();
  // Keep the original animation's initial transforms and mutable fields. Stage
  // changes reset these values without recreating any geometry or label nodes.
  const initialAnimations = animationItems.map(item => ({
    item, values: { ...item }, position: item.group.position.clone(),
    rotation: item.group.rotation.clone(), scale: item.group.scale.clone(),
  }));
  const resetAnimations = () => {
    initialAnimations.forEach(({item, values, position, rotation, scale}) => {
      Object.keys(item).forEach(key => { if (!(key in values)) delete item[key]; });
      Object.assign(item, values);
      item.group.position.copy(position);
      // Preserve Euler representation/order: softSway only changes y/z, so an
      // equivalent quaternion-to-Euler round trip can otherwise leave x = PI.
      item.group.rotation.copy(rotation);
      item.group.scale.copy(scale);
    });
    activePointers.clear();
    touchGesture = null;
    dragMode = "";
    movedDuringDrag = false;
    shell.classList.remove("is-panning");
  };
  renderPlantFrame();
  animate();
  if (loading) loading.hidden = true;
  const sync = ({ resetAnimation = false } = {}) => {
    if (disposed) return;
    if (resetAnimation) resetAnimations();
    applyAnimalCellWebglViewPreset(THREE, plantRoot, panRoot, camera);
    applyAnimalCellStageFocus(partGroups);
    syncPartModeControls();
    setFeedback(state.animalCellSelected || "");
    if (resetAnimation) renderPlantFrame(); // original fresh scene's first two updates
    renderPlantFrame();
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      if (dnaWebglAnimationFrame) cancelAnimationFrame(dnaWebglAnimationFrame);
      dnaWebglAnimationFrame = 0;
    } else if (!disposed && !dnaWebglAnimationFrame) animate();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  const updatePanByPixels = (dx, dy) => {
    const rect = host.getBoundingClientRect();
    const worldWidth = (camera.right - camera.left) / camera.zoom;
    const worldHeight = (camera.top - camera.bottom) / camera.zoom;
    panRoot.position.x += (dx / (rect.width || 1)) * worldWidth;
    panRoot.position.y -= (dy / (rect.height || 1)) * worldHeight;
    saveTransformState();
  };

  const setZoom = (zoom) => {
    const maxZoom = (state.animalCellSoloPart || "all") === "all" ? 4.6 : 8.5;
    camera.zoom = clamp(zoom, 0.48, maxZoom);
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
      state.animalCellWebglRotation = state.animalCellWebglRotation || { x: plantRoot.rotation.x, y: plantRoot.rotation.y };
      state.animalCellWebglRotation.y += dx * 0.0072;
      state.animalCellWebglRotation.x = clamp(
        state.animalCellWebglRotation.x + dy * 0.0072,
        -Math.PI / 2 + 0.03,
        Math.PI / 2 - 0.03,
      );
      applyAnimalCellLockedRotation(plantRoot);
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
    const hit = hits.find((item) => item.object.userData?.plantPart&&!['membrane','cytoplasm'].includes(item.object.userData.plantPart))
      || hits.find((item) => item.object.userData?.plantPart);
    if (!hit) return;
    const part = hit.object.userData.plantPart;
    const label = ANIMAL_CELL_PART_LABELS[part] || hit.object.userData.plantLabel || "动物细胞结构";
    state.animalCellSelected = `已选中：${label}`;
    if(ANIMAL_CELL_STRUCTURE_MODES.some(mode=>mode.id===part)){
      state.animalCellSoloPart=part;applyAnimalCellStageFocus(partGroups);syncPartModeControls();
    }
    setFeedback(state.animalCellSelected);
  };

  shell.addEventListener("pointerdown", onPointerDown);
  shell.addEventListener("pointermove", onPointerMove);
  shell.addEventListener("pointerup", finishPointer);
  shell.addEventListener("pointercancel", finishPointer);
  shell.addEventListener("lostpointercapture", finishPointer);
  const onContextMenu = event => event.preventDefault();
  shell.addEventListener("contextmenu", onContextMenu);
  shell.addEventListener("wheel", onWheel, { passive: false });
  shell.addEventListener("click", onClick);
  window.addEventListener("blur", cancelPointers);
  window.addEventListener("pagehide", cancelPointers);
  document.addEventListener("visibilitychange", onGestureVisibilityChange);
  const partModeHandlers = partModeButtons.map((button) => {
    const handler = () => {
      const selectedPart = button.dataset.animalCellPartMode || "all";
      state.animalCellSoloPart = state.animalCellSoloPart === selectedPart ? "all" : selectedPart;
      const mode = plantPartModeLabel();
      state.animalCellSelected = "";
      applyAnimalCellStageFocus(partGroups);
      syncPartModeControls();
      setFeedback(mode.id === "all" ? "已恢复完整动物细胞。" : `已高亮：${mode.label}。再次点击可取消高亮。`);
      renderPlantFrame();
    };
    button.addEventListener("click", handler);
    return { button, handler };
  });

  const dispose = () => {
    if (disposed) return;
    disposed = true;
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
    shell.removeEventListener("contextmenu", onContextMenu);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    partModeHandlers.forEach(({ button, handler }) => button.removeEventListener("click", handler));
    labelItems.forEach((item) => {item.el.remove();item.line.remove();});
    disposeDnaWebglObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  };
  return { sync, dispose, resize };
}

function animalCellMaterials(THREE) {
  const physical = (color, options = {}) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: options.roughness ?? 0.42,
      metalness: options.metalness ?? 0.02,
      clearcoat: options.clearcoat ?? 0.26,
      clearcoatRoughness: options.clearcoatRoughness ?? 0.44,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1,
      depthWrite: options.depthWrite ?? true,
      side: options.side ?? THREE.FrontSide,
    });
  return {
    cellWall: physical("#166534", { transparent: true, opacity: 0.26, depthWrite: false, roughness: 0.62, clearcoat: 0.08, side: THREE.DoubleSide }),
    cellWallInner: physical("#14532D", { transparent: true, opacity: 0.22, depthWrite: false, roughness: 0.6, clearcoat: 0.08, side: THREE.DoubleSide }),
    membrane: physical("#C5D982", { transparent: true, opacity: 0.36, depthWrite: false, roughness: 0.42, clearcoat: 0.22, side: THREE.DoubleSide }),
    cytoplasm: physical("#FFFBEA", { transparent: true, opacity: 0.14, depthWrite: false, roughness: 0.82, side: THREE.DoubleSide }),
    cytoplasmParticle: physical("#FDE68A", { transparent: true, opacity: 0.72, depthWrite: false, roughness: 0.5 }),
    nucleus: physical("#F3E8FF", { transparent: true, opacity: 0.4, depthWrite: false, roughness: 0.38, clearcoat: 0.52, side: THREE.DoubleSide }),
    nuclearEnvelope: physical("#A855F7", { transparent: true, opacity: 0.46, depthWrite: false, roughness: 0.36, clearcoat: 0.45, side: THREE.DoubleSide }),
    nuclearPore: physical("#6B21A8", { roughness: 0.36, clearcoat: 0.36 }),
    nucleolus: physical("#1D4ED8", { roughness: 0.32, clearcoat: 0.54 }),
    nuclearChromatin: physical("#8B5CF6", { transparent: true, opacity: 0.42, depthWrite: false, roughness: 0.44, clearcoat: 0.16 }),
    er: physical("#C27A32", { transparent: true, opacity: 0.58, depthWrite: false, roughness: 0.45, clearcoat: 0.28, side: THREE.DoubleSide }),
    erLight: physical("#E0A04E", { transparent: true, opacity: 0.48, depthWrite: false, roughness: 0.48, clearcoat: 0.24, side: THREE.DoubleSide }),
    smoothEr: physical("#86D49B", { transparent: true, opacity: 0.72, depthWrite: false, roughness: 0.42, clearcoat: 0.32, side: THREE.DoubleSide }),
    ribosome: physical("#7C2D12", { roughness: 0.52 }),
    golgi: physical("#22D3EE", { roughness: 0.36, clearcoat: 0.5, side: THREE.DoubleSide }),
    golgiDark: physical("#0891B2", { roughness: 0.38, clearcoat: 0.42, side: THREE.DoubleSide }),
    golgiLumen: physical("#FEF3C7", { transparent: true, opacity: 0.72, depthWrite: false, roughness: 0.46, clearcoat: 0.16, side: THREE.DoubleSide }),
    golgiVesicle: physical("#0284C7", { roughness: 0.34, clearcoat: 0.5 }),
    vesicle: physical("#A855F7", { roughness: 0.36, clearcoat: 0.46 }),
    mitochondrion: physical("#FB923C", { transparent: true, opacity: 0.28, depthWrite: false, roughness: 0.34, clearcoat: 0.52, side: THREE.DoubleSide }),
    mitochondrionInner: physical("#FDBA74", { transparent: true, opacity: 0.58, depthWrite: false, roughness: 0.4, clearcoat: 0.3, side: THREE.DoubleSide }),
    mitochondrionCrista: physical("#FED7AA", { transparent: true, opacity: 0.72, depthWrite: false, roughness: 0.38, clearcoat: 0.24, side: THREE.DoubleSide }),
    chloroplast: physical("#B7F7A7", { transparent: true, opacity: 0.22, depthWrite: false, roughness: 0.34, clearcoat: 0.54, side: THREE.DoubleSide }),
    chloroplastInner: physical("#D9F99D", { transparent: true, opacity: 0.18, depthWrite: false, roughness: 0.36, clearcoat: 0.46, side: THREE.DoubleSide }),
    chloroplastRibosome: physical("#7C3AED", { roughness: 0.42, clearcoat: 0.2 }),
    chloroplastDNA: physical("#EF4444", { roughness: 0.4, clearcoat: 0.18 }),
    thylakoid: physical("#22C55E", { roughness: 0.32, clearcoat: 0.44 }),
    thylakoidDark: physical("#16A34A", { roughness: 0.36, clearcoat: 0.3 }),
    vacuole: physical("#7DD3FC", { transparent: true, opacity: 0.66, depthWrite: false, roughness: 0.42, clearcoat: 0.52, side: THREE.DoubleSide }),
    vacuoleMembrane: physical("#0EA5E9", { transparent: true, opacity: 0.46, depthWrite: false, roughness: 0.36, clearcoat: 0.42, side: THREE.DoubleSide }),
    peroxisome: physical("#FACC15", { roughness: 0.4, clearcoat: 0.42 }),
    animalMembrane: physical("#67E8F9", { transparent: true, opacity: 0.12, depthWrite: false, roughness: 0.34, clearcoat: 0.42, side: THREE.DoubleSide }),
    animalMembraneInner: physical("#BAE6FD", { transparent: true, opacity: 0.05, depthWrite: false, roughness: 0.5, clearcoat: 0.22, side: THREE.BackSide }),
    animalCytoplasm: physical("#DFF7FF", { transparent: true, opacity: 0.035, depthWrite: false, roughness: 0.8, clearcoat: 0.04, side: THREE.DoubleSide }),
    lysosomeEnvelope: physical("#F59E0B", { transparent: true, opacity: 0.68, depthWrite: false, roughness: 0.32, clearcoat: 0.62, side: THREE.DoubleSide }),
    lysosomeCore: physical("#FDE68A", { transparent: true, opacity: 0.42, depthWrite: false, roughness: 0.5, clearcoat: 0.25 }),
    lysosomeEnzyme: physical("#B45309", { roughness: 0.46, clearcoat: 0.24 }),
    centriole: physical("#EC4899", { roughness: 0.34, clearcoat: 0.48 }),
    centrioleDark: physical("#9D174D", { roughness: 0.4, clearcoat: 0.36 }),
    centrosomeAster: physical("#F9A8D4", { transparent: true, opacity: 0.54, depthWrite: false, roughness: 0.55 }),
    connector: physical("#94A3B8", { transparent: true, opacity: 0.42, depthWrite: false, roughness: 0.55 }),
  };
}

function animalCellCachedGeometry(THREE, type, args, create) {
  const cache = THREE.animalGeometryCache;
  if (!cache) return create();
  const key = type + JSON.stringify(args);
  if (!cache.has(key)) cache.set(key, create());
  return cache.get(key);
}

function animalCellRoundedDiskGeometry(THREE, ...args) {
  return animalCellCachedGeometry(THREE, "animalCellRoundedDiskGeometry", args,
    () => animalCellRoundedDiskGeometryUncached(THREE, ...args));
}

function animalCellFusedMitoInnerGeometry(THREE, ...args) {
  return animalCellCachedGeometry(THREE, "animalCellFusedMitoInnerGeometry", args,
    () => animalCellFusedMitoInnerGeometryUncached(THREE, ...args));
}

function animalCellHollowCylinderGeometry(THREE, ...args) {
  return animalCellCachedGeometry(THREE, "animalCellHollowCylinderGeometry", args,
    () => animalCellHollowCylinderGeometryUncached(THREE, ...args));
}

function buildCoreAnimalCellModel(THREE, parent, pickables, addLabel, animationItems, partGroups) {
  // Only immutable geometry with exactly equal constructor parameters is shared.
  // The cache belongs to this build; meshes and mutable focus materials stay separate.
  const geometryCache = new Map();
  const nativeTHREE = THREE;
  THREE = { ...THREE, animalGeometryCache: geometryCache };
  for (const type of ["SphereGeometry", "CapsuleGeometry", "TorusGeometry", "CylinderGeometry"]) {
    THREE[type] = function (...args) {
      return animalCellCachedGeometry(THREE, type, args, () => new nativeTHREE[type](...args));
    };
  }
  const materials = animalCellMaterials(THREE);
  const groups = {
    membrane: new THREE.Group(),
    cytoplasm: new THREE.Group(),
    nucleus: new THREE.Group(),
    er: new THREE.Group(),
    golgi: new THREE.Group(),
    mitochondrion: new THREE.Group(),
    centrosome: new THREE.Group(),
    lysosome: new THREE.Group(),
    small: new THREE.Group(),
  };
  Object.values(groups).forEach((group) => parent.add(group));
  Object.entries(groups).forEach(([part, group]) => partGroups.set(part, group));

  const cellCenter = new THREE.Vector3(0, -2.4, 0);
  const cytoplasm = new THREE.Mesh(new THREE.SphereGeometry(29.35, 96, 64), materials.animalCytoplasm);
  cytoplasm.position.copy(cellCenter);
  cytoplasm.renderOrder = 0;
  groups.cytoplasm.add(cytoplasm);
  animalCellRegisterPickable(cytoplasm, pickables, "cytoplasm");

  const innerMembrane = new THREE.Mesh(new THREE.SphereGeometry(29.8, 96, 64), materials.animalMembraneInner);
  innerMembrane.position.copy(cellCenter);
  innerMembrane.renderOrder = 2;
  groups.membrane.add(innerMembrane);
  animalCellRegisterPickable(innerMembrane, pickables, "membrane");

  const outerMembrane = new THREE.Mesh(new THREE.SphereGeometry(30.45, 96, 64), materials.animalMembrane);
  outerMembrane.position.copy(cellCenter);
  outerMembrane.renderOrder = 3;
  groups.membrane.add(outerMembrane);
  animalCellRegisterPickable(outerMembrane, pickables, "membrane");

  const nucleusPosition = new THREE.Vector3(-2.0, -1.8, 1.6);
  const nucleus = createPlantNucleus(THREE, materials, pickables, animationItems);
  nucleus.position.copy(nucleusPosition);
  nucleus.scale.setScalar(1.72);
  nucleus.rotation.set(0.08, -0.72, 0.2);
  groups.nucleus.add(nucleus);

  const er = createPlantEndoplasmicReticulum(THREE, materials, pickables, animationItems);
  er.position.copy(nucleusPosition);
  er.scale.setScalar(2.36);
  er.rotation.set(-0.08, 0.78, -0.16);
  groups.er.add(er);

  const golgiPlacements = [
    { position: [-9.8, -2.0, 8.8], scale: 1.02, rotation: [0.18, -0.86, -0.34] },
    { position: [13.2, -7.4, -6.4], scale: 0.74, rotation: [-0.12, 0.48, 0.22] },
  ];
  const golgiObjects = golgiPlacements.map((placement) => {
    const golgi = createPlantGolgi(THREE, materials, pickables, animationItems);
    golgi.position.set(...placement.position);
    golgi.scale.setScalar(placement.scale);
    golgi.rotation.set(...placement.rotation);
    groups.golgi.add(golgi);
    return golgi;
  });

  const mitochondrionPlacements = [
    { position: [-16.0, -2.2, 12.4], rotation: [0.1, -0.72, 0.12], scale: 1.3 },
    { position: [-17.2, 4.1, -8.6], rotation: [-0.08, 0.54, -0.18], scale: 1.18 },
    { position: [14.4, -8.0, -13.2], rotation: [0.14, 1.08, 0.08], scale: 1.24 },
    { position: [18.2, 3.4, 9.2], rotation: [-0.08, -1.22, 0.18], scale: 1.14 },
    { position: [-2.8, 8.8, -18.0], rotation: [0.12, 0.28, -0.24], scale: 1.12 },
    { position: [4.2, -11.2, 16.2], rotation: [-0.06, 0.82, 0.14], scale: 1.08 },
  ];
  const mitochondria = mitochondrionPlacements.map((placement) => {
    const mitochondrion = createPlantMitochondrion(THREE, materials, pickables, animationItems, placement.scale);
    mitochondrion.position.set(...placement.position);
    mitochondrion.rotation.set(...placement.rotation);
    groups.mitochondrion.add(mitochondrion);
    return mitochondrion;
  });

  const centrosome = createAnimalCentrosome(THREE, materials, pickables, animationItems);
  centrosome.position.set(12.0, -1.0, 0);
  centrosome.scale.setScalar(1.34);
  centrosome.rotation.set(0.18, -0.38, 0.14);
  groups.centrosome.add(centrosome);

  const lysosomePlacements = [
    { position: [12.6, 7.4, 14.0], radius: 1.72 },
    { position: [-13.2, 7.8, -1.8], radius: 1.56 },
    { position: [17.2, -6.2, 0.6], radius: 1.64 },
    { position: [-2.4, -10.0, 15.4], radius: 1.46 },
  ];
  const lysosomes = lysosomePlacements.map((placement, index) => {
    const lysosome = createAnimalLysosome(THREE, materials, pickables, animationItems, placement.radius, index);
    lysosome.position.set(...placement.position);
    groups.lysosome.add(lysosome);
    return lysosome;
  });

  addAnimalCellRibosomes(THREE, groups.cytoplasm, materials, pickables, animationItems, nucleusPosition);
  addAnimalCellVesicles(THREE, groups.small, materials, pickables, animationItems);

  addLabel("细胞膜", new THREE.Vector3(-24.8, 12.6, 8.0), "#0284C7", { x: -12, y: -30 });
  addLabel("细胞核", new THREE.Vector3(-2.0, 5.0, 1.6), "#7C3AED", { x: 0, y: -34 });
  addLabel("内质网", new THREE.Vector3(2.6, -1.0, 5.2), "#92400E", { x: 24, y: -28 });
  addLabel("高尔基体", new THREE.Vector3(-0.8, 4.6, 0), "#0891B2", { x: -24, y: -34 }, golgiObjects[0]);
  addLabel("线粒体", new THREE.Vector3(0, 3.0, 0), "#EA580C", { x: 8, y: -44 }, mitochondria[0]);
  addLabel("核糖体", new THREE.Vector3(-5.0, 11.6, 5.6), "#7C3AED", { x: 0, y: -30 });
  addLabel("中心体", new THREE.Vector3(0, -3.2, 0), "#BE185D", { x: -16, y: 24 }, centrosome);
  addLabel("溶酶体", new THREE.Vector3(0, 2.4, 0), "#B45309", { x: 4, y: -30 }, lysosomes[0]);
  animalCellCloneMaterials(parent);
}

function createAnimalCellRodBetween(THREE, start, end, radius, material) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 12), material);
  rod.position.copy(start).add(end).multiplyScalar(0.5);
  rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return rod;
}

function createAnimalCentrosome(THREE, materials, pickables, animationItems) {
  const group = new THREE.Group();
  const makeCentriole = () => {
    const centriole = new THREE.Group();
    const tripletOffsets = [
      { radial: 0.69, tangent: -0.18, radius: 0.118, material: materials.centrioleDark },
      { radial: 0.82, tangent: 0, radius: 0.112, material: materials.centriole },
      { radial: 0.95, tangent: 0.18, radius: 0.106, material: materials.centriole },
    ];
    for (let bundleIndex = 0; bundleIndex < 9; bundleIndex += 1) {
      const angle = (bundleIndex / 9) * Math.PI * 2;
      const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      tripletOffsets.forEach((offset) => {
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(offset.radius, offset.radius, 3.5, 14),
          offset.material,
        );
        rod.position.copy(radial).multiplyScalar(offset.radial).addScaledVector(tangent, offset.tangent);
        centriole.add(rod);
      });
    }
    [-1.62, 1.62].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.085, 10, 48), materials.centrioleDark);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      centriole.add(ring);
    });
    return centriole;
  };

  const centrioleA = makeCentriole();
  centrioleA.position.set(-1.15, 0, 0);
  centrioleA.rotation.z = Math.PI / 2;
  group.add(centrioleA);
  const centrioleB = makeCentriole();
  centrioleB.position.set(1.05, 0.15, 0.7);
  centrioleB.rotation.x = Math.PI / 2;
  group.add(centrioleB);

  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    const start = new THREE.Vector3(Math.cos(angle) * 1.15, Math.sin(index * 1.7) * 0.3, Math.sin(angle) * 1.15);
    const end = new THREE.Vector3(Math.cos(angle) * (4.6 + (index % 3) * 0.35), Math.sin(index * 1.7) * 1.05, Math.sin(angle) * (4.6 + (index % 3) * 0.35));
    group.add(createAnimalCellRodBetween(THREE, start, end, 0.045, materials.centrosomeAster));
  }
  animalCellRegisterPickable(group, pickables, "centrosome");
  animationItems.push({ type: "organelleDrift", group, seed: 17.6, amplitude: 0.06 });
  return group;
}

function createAnimalLysosome(THREE, materials, pickables, animationItems, radius = 1.3, seed = 0) {
  const group = new THREE.Group();
  const envelope = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), materials.lysosomeEnvelope);
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.82, 36, 24), materials.lysosomeCore);
  group.add(envelope, core);
  for (let index = 0; index < 10; index += 1) {
    const angle = index * 2.399 + seed;
    const height = -0.62 + (index / 9) * 1.24;
    const ringRadius = Math.sqrt(Math.max(0, 1 - height * height));
    const enzyme = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.105, 12, 9), materials.lysosomeEnzyme);
    enzyme.position.set(Math.cos(angle) * ringRadius * radius * 0.52, height * radius * 0.52, Math.sin(angle) * ringRadius * radius * 0.52);
    group.add(enzyme);
  }
  animalCellRegisterPickable(group, pickables, "lysosome");
  animationItems.push({ type: "organelleDrift", group, seed: 18.4 + seed, amplitude: 0.09 });
  return group;
}

function addAnimalCellRibosomes(THREE, group, materials, pickables, animationItems, nucleusPosition) {
  const random01 = (seed) => {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  const positions = [];
  for (let index = 0; index < 800 && positions.length < 58; index += 1) {
    const point = new THREE.Vector3(
      -23 + random01(index + 1.4) * 46,
      -18 + random01(index + 9.7) * 32,
      -22 + random01(index + 17.3) * 44,
    );
    if (point.clone().sub(new THREE.Vector3(0, -2.4, 0)).length() > 24.4) continue;
    if (point.distanceTo(nucleusPosition) < 9.2) continue;
    if (positions.some((position) => position.distanceTo(point) < 1.65)) continue;
    positions.push(point);
  }
  positions.forEach((position, index) => {
    const ribosome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 14, 10), materials.chloroplastRibosome);
    ribosome.position.copy(position);
    ribosome.scale.set(1.12, 0.92, 1.04);
    group.add(ribosome);
    animalCellRegisterPickable(ribosome, pickables, "ribosome");
    animationItems.push({ type: "cytoplasmParticle", group: ribosome, base: position.clone(), seed: 60 + index * 1.31, amplitude: 0.055 });
  });
}

function addAnimalCellVesicles(THREE, group, materials, pickables, animationItems) {
  const placements = [
    [-7.4, -7.0, -12.8], [10.0, 9.0, -9.8], [-18.0, -5.8, 2.6],
    [3.0, 11.0, 11.4], [20.0, -1.8, -4.6], [-9.6, 3.8, 17.0],
  ];
  placements.forEach((position, index) => {
    const radius = 0.42 + (index % 3) * 0.08;
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), materials.vesicle);
    vesicle.position.set(...position);
    group.add(vesicle);
    animalCellRegisterPickable(vesicle, pickables, "vesicle");
    animationItems.push({ type: "vesicle", group: vesicle, base: vesicle.position.clone(), seed: 72 + index, amplitude: 0.22 });
  });
}

function buildAnimalCellModel(THREE, parent, pickables, addLabel, animationItems, partGroups) {
  const materials = animalCellMaterials(THREE);
  const groups = {
    cellWall: new THREE.Group(),
    membrane: new THREE.Group(),
    cytoplasm: new THREE.Group(),
    nucleus: new THREE.Group(),
    er: new THREE.Group(),
    golgi: new THREE.Group(),
    mitochondrion: new THREE.Group(),
    chloroplast: new THREE.Group(),
    vacuole: new THREE.Group(),
    small: new THREE.Group(),
  };
  Object.values(groups).forEach((group) => parent.add(group));
  Object.entries(groups).forEach(([part, group]) => partGroups.set(part, group));

  const outer = animalCellHexFootprint(36.8, 22.8);
  const inner = outer.map((point) => ({ x: point.x * 0.91, z: point.z * 0.86 }));
  const wall = createAnimalCellCompleteWallShell(THREE, materials, pickables, {
    width: 73.6,
    height: 31.8,
    depth: 45.6,
    centerY: -5.9,
    faceOpacity: 0.26,
    innerOpacity: 0.18,
  });
  groups.cellWall.add(wall);

  const cytoplasm = createAnimalCellCytoplasmShell(THREE, materials, pickables, {
    width: 66.8,
    height: 27.4,
    depth: 40.6,
    centerY: -5.9,
    opacity: 0.1,
  });
  groups.cytoplasm.add(cytoplasm);

  const membrane = createAnimalCellMembraneShell(THREE, materials, pickables, {
    width: 69.2,
    height: 28.6,
    depth: 42.0,
    centerY: -5.9,
    opacity: 0.26,
    edgeOpacity: 0.28,
  });
  groups.membrane.add(membrane);

  const pores = [
    [-31.2, -3.0, -15.0], [-32.2, -0.45, -4.3], [-30.2, -6.0, 13.8],
    [29.3, -3.25, -11.0], [29.2, -0.55, 8.8], [2.8, -6.15, 19.6],
  ];
  pores.forEach((coords, index) => {
    const pore = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.085, 8, 26), materials.cellWallInner);
    pore.position.set(coords[0], coords[1], coords[2]);
    pore.rotation.x = Math.PI / 2;
    pore.rotation.z = index % 2 ? 0.55 : -0.45;
    groups.cellWall.add(pore);
    animalCellRegisterPickable(pore, pickables, "plasmodesmata");
  });
  addPlantCytoplasmParticles(THREE, groups.cytoplasm, materials, pickables, animationItems);

  const nucleusScreenMirror = new THREE.Group();
  nucleusScreenMirror.position.set(12.6, -3.05, 0.9);
  nucleusScreenMirror.scale.x = -1;
  nucleusScreenMirror.rotation.z = Math.PI / 10 + Math.PI / 18;
  const nucleusMirror = new THREE.Group();
  nucleusMirror.scale.x = -1;
  nucleusMirror.rotation.z = -Math.PI / 2;
  const nucleus = createPlantNucleus(THREE, materials, pickables, animationItems);
  nucleus.position.set(0, 0, 0);
  nucleus.scale.setScalar(1.62);
  nucleus.rotation.y = -0.2 - Math.PI / 4 + Math.PI;
  nucleus.rotation.z = 0;
  nucleusMirror.add(nucleus);
  nucleusScreenMirror.add(nucleusMirror);
  groups.nucleus.add(nucleusScreenMirror);

  const erScreenMirror = new THREE.Group();
  erScreenMirror.position.set(12.6, -3.05, 0.9);
  erScreenMirror.scale.x = -1;
  erScreenMirror.rotation.z = Math.PI / 10 + Math.PI / 18;
  const erMirror = new THREE.Group();
  erMirror.scale.x = -1;
  erMirror.rotation.z = -Math.PI / 2;
  const er = createPlantEndoplasmicReticulum(THREE, materials, pickables, animationItems);
  er.position.set(0, 0, 0);
  er.scale.setScalar(2.35);
  er.rotation.y = -0.7 - Math.PI / 4 + Math.PI;
  er.rotation.z = 0.05;
  erMirror.add(er);
  erScreenMirror.add(erMirror);
  groups.er.add(erScreenMirror);

  const golgiPlacements = [
    { position: [17.0, -5.62, 16.2], scale: 0.8, rotation: [0.08, -1.15, -0.24] },
    { position: [30.4, -5.64, -0.4], scale: 0.8, rotation: [-0.04, 0.16, 0.3] },
    { position: [11.0, -5.72, -11.0], scale: 0.8, rotation: [0.06, 0.88, -0.36] },
  ];
  const golgiObjects = [];
  golgiPlacements.forEach((item, index) => {
    const golgi = createPlantGolgi(THREE, materials, pickables, animationItems);
    golgi.position.set(...item.position);
    golgi.scale.setScalar(item.scale);
    golgi.rotation.set(...item.rotation);
    groups.golgi.add(golgi);
    registerAnimalCellClockwiseOrbit(THREE, animationItems, golgi, 20 + index, "golgi");
    golgiObjects.push(golgi);
  });

  const vacuole = createPlantVacuole(THREE, materials, pickables, animationItems);
  vacuole.position.set(-11.15, -5.55, 0.9);
  vacuole.scale.set(3.4875, 3.6, 2.446875);
  vacuole.rotation.y = 0.03;
  vacuole.rotation.z = 0.0;
  groups.vacuole.add(vacuole);

  const chloroplastPlacements = [
    { position: [-28.0, -5.88, 13.6], scale: 0.88, rotation: [0.02, -Math.PI / 4, -0.04] },
    { position: [26.6, -5.88, 13.2], scale: 0.88, rotation: [0.02, Math.PI / 6, 0.04] },
    { position: [-28.0, -5.9, -13.7], scale: 0.88, rotation: [0.02, Math.PI / 4, 0.02] },
    { position: [4.6, -5.9, -15.1], scale: 0.88, rotation: [0.02, 0.0, 0.02] },
    { position: [24.8, -5.9, -13.6], scale: 0.88, rotation: [0.02, -Math.PI / 4, -0.02] },
  ];
  const chloroplastObjects = [];
  chloroplastPlacements.forEach((item, index) => {
    const chloroplast = createPlantChloroplast(THREE, materials, pickables, animationItems, item.scale);
    chloroplast.position.set(...item.position);
    chloroplast.rotation.set(...item.rotation);
    groups.chloroplast.add(chloroplast);
    registerAnimalCellClockwiseOrbit(THREE, animationItems, chloroplast, 30 + index, "chloroplast");
    chloroplastObjects.push(chloroplast);
  });

  const frontPlaneAngle = (degrees) => -THREE.MathUtils.degToRad(degrees);
  const mitochondrionScale = 0.84;
  const membraneFootprint = animalCellHexFootprint(34.6, 21.0);
  const normalizeAxisAngle = (degrees) => {
    let angle = degrees % 180;
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;
    return angle;
  };
  const nearestMembraneAngle = ([x, , z]) => {
    let nearest = { distance: Infinity, angle: 0 };
    membraneFootprint.forEach((start, index) => {
      const end = membraneFootprint[(index + 1) % membraneFootprint.length];
      const dx = end.x - start.x;
      const dz = end.z - start.z;
      const lengthSq = dx * dx + dz * dz;
      const t = Math.max(0, Math.min(1, ((x - start.x) * dx + (z - start.z) * dz) / lengthSq));
      const closestX = start.x + dx * t;
      const closestZ = start.z + dz * t;
      const distanceSq = (x - closestX) * (x - closestX) + (z - closestZ) * (z - closestZ);
      if (distanceSq < nearest.distance) {
        nearest = {
          distance: distanceSq,
          angle: normalizeAxisAngle(THREE.MathUtils.radToDeg(Math.atan2(dz, dx))),
        };
      }
    });
    return nearest.angle;
  };
  const mitochondrionPlacements = [
    { position: [-30.8, -6.04, 4.2] },
    { position: [-30.4, -6.02, -6.1] },
    { position: [-19.5, -6.0, 17.2] },
    { position: [-19.8, -6.04, -18.9] },
    { position: [-5.2, -5.98, 16.3] },
    { position: [-8.1, -6.05, -19.4] },
    { position: [1.1, -6.06, -19.4] },
    { position: [3.8, -6.0, -18.1] },
    { position: [16.5, -6.02, -18.2] },
    { position: [12.8, -5.98, 18.2] },
    { position: [24.2, -6.0, 18.0] },
    { position: [30.8, -6.02, 9.2] },
    { position: [32.4, -6.04, 5.9] },
    { position: [31.9, -6.02, -6.2] },
    { position: [31.0, -6.04, -12.2] },
    { position: [20.6, -6.02, -18.4] },
  ];
  const mitochondrionObjects = [];
  mitochondrionPlacements.forEach((item, index) => {
    const mitochondrion = createPlantMitochondrion(THREE, materials, pickables, animationItems, mitochondrionScale);
    mitochondrion.position.set(...item.position);
    mitochondrion.rotation.set(0.02, frontPlaneAngle(nearestMembraneAngle(item.position)), 0.02);
    groups.mitochondrion.add(mitochondrion);
    registerAnimalCellClockwiseOrbit(THREE, animationItems, mitochondrion, 40 + index, "mitochondrion");
    mitochondrionObjects.push(mitochondrion);
  });

  addPlantSmallOrganelles(THREE, groups.small, materials, pickables, animationItems);

  addLabel("细胞壁", new THREE.Vector3(-31.8, 2.0, -16.6), "#65A30D", { x: -18, y: -28 });
  addLabel("细胞膜", new THREE.Vector3(30, -4.8, -10.6), "#0284C7", { x: 10, y: -26 });
  addLabel("细胞核", new THREE.Vector3(12.6, 2.8, 0.9), "#7C3AED", { x: -4, y: -38 });
  addLabel("核孔", new THREE.Vector3(7.6, -0.3, 0.9), "#6B21A8", { x: -6, y: -28 });
  addLabel("内质网", new THREE.Vector3(8.4, -2.8, 0.9), "#92400E", { x: 6, y: -30 });
  addLabel("高尔基体", new THREE.Vector3(0, 3.62, 0), "#0891B2", { x: -8, y: -34 }, golgiObjects[0]);
  addLabel("液泡", new THREE.Vector3(-11.15, -1.65, 0.9), "#0284C7", { x: 0, y: -36 });
  addLabel("叶绿体", new THREE.Vector3(0, 3.2, -0.5), "#15803D", { x: 6, y: -34 }, chloroplastObjects[3]);
  addLabel("线粒体", new THREE.Vector3(0, 3.0, 0), "#EA580C", { x: 6, y: -32 }, mitochondrionObjects[13]);
  addLabel("囊泡", new THREE.Vector3(8.2, -4.5, -10.5), "#7C3AED", { x: 0, y: -28 });
  animalCellCloneMaterials(parent);
}

function animalCellCloneMaterials(object) {
  const owners = new Map();
  object.traverse?.((child) => {
    if (!child.isMesh || !child.material) return;
    let owner = child;
    while (owner.parent && owner.parent !== object) owner = owner.parent;
    if (!owners.has(owner)) owners.set(owner, new Map());
    const cache = owners.get(owner);
    // Ribosomes have a separate within-group focus override. Never share a
    // mutable material across that boundary or across top-level focus groups.
    const focusClass = child.userData.plantPart === "ribosome" ? "ribosome" : "group";
    const clone = material => {
      if (!cache.has(material)) cache.set(material, new Map());
      const variants = cache.get(material);
      if (!variants.has(focusClass)) variants.set(focusClass, material.clone());
      return variants.get(focusClass);
    };
    if (Array.isArray(child.material)) {
      child.material = child.material.map(clone);
      return;
    }
    child.material = clone(child.material);
  });
}

function createPlantSoloMitochondrion(THREE, materials, pickables, animationItems, scale = 1) {
  const group = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.CapsuleGeometry(0.74 * scale, 2.18 * scale, 24, 64), materials.mitochondrion);
  outer.rotation.z = Math.PI / 2;
  outer.scale.z = 1;
  group.add(outer);
  animalCellRegisterPickable(outer, pickables, "mitochondrion");

  const cristaOpenings = [
    { x: -1.02, side: 1, width: 0.24, depth: 0.82, phase: 0.4, yOffset: -0.02 },
    { x: -0.58, side: 1, width: 0.28, depth: 0.92, phase: 1.6, yOffset: 0.02 },
    { x: -0.14, side: 1, width: 0.3, depth: 1.02, phase: 2.7, yOffset: -0.01 },
    { x: 0.32, side: 1, width: 0.28, depth: 0.9, phase: 3.4, yOffset: 0.03 },
    { x: 0.78, side: 1, width: 0.25, depth: 0.8, phase: 4.1, yOffset: -0.02 },
    { x: -0.82, side: -1, width: 0.26, depth: 0.84, phase: 5.2, yOffset: 0.02 },
    { x: -0.38, side: -1, width: 0.3, depth: 0.96, phase: 6.1, yOffset: -0.03 },
    { x: 0.08, side: -1, width: 0.28, depth: 1.03, phase: 7.0, yOffset: 0.01 },
    { x: 0.54, side: -1, width: 0.29, depth: 0.92, phase: 7.8, yOffset: -0.01 },
    { x: 1.0, side: -1, width: 0.24, depth: 0.78, phase: 8.9, yOffset: 0.02 },
  ];
  const innerMembrane = new THREE.Mesh(
    animalCellFusedMitoInnerGeometry(THREE, 0.58 * scale, 2.08 * scale, cristaOpenings.map((opening) => ({
      x: opening.x * scale,
      y: (0.08 + opening.yOffset) * scale,
      side: opening.side,
      xRadius: 0.095 * scale,
      yRadius: opening.width * 1.28 * scale,
      width: opening.width * 1.24 * scale,
      depth: opening.depth * scale,
      height: 0.16 * scale,
      phase: opening.phase,
    }))),
    materials.mitochondrionInner,
  );
  group.add(innerMembrane);
  animalCellRegisterPickable(innerMembrane, pickables, "mitochondrion");

  const addMitoDnaLoop = (x, center, radiusY, radiusZ, seed) => {
    const points = [];
    for (let i = 0; i < 42; i += 1) {
      const t = (i / 42) * Math.PI * 2;
      const ripple = 1 + Math.sin(t * 5 + seed) * 0.08;
      points.push(new THREE.Vector3(
        (x + Math.sin(t + seed) * 0.018) * scale,
        (center.y + Math.cos(t) * radiusY * ripple) * scale,
        (center.z + Math.sin(t) * radiusZ * (1 + Math.cos(t * 2 + seed) * 0.05)) * scale,
      ));
    }
    const dna = animalCellPolylineTube(THREE, points, 0.03 * scale, materials.chloroplastDNA, true, 84);
    group.add(dna);
    animalCellRegisterPickable(dna, pickables, "mitochondrion");
  };
  addMitoDnaLoop(-0.72, { y: -0.08, z: 0.04 }, 0.11, 0.2, 1.4);
  addMitoDnaLoop(0.22, { y: 0.12, z: -0.04 }, 0.12, 0.22, 2.7);
  addMitoDnaLoop(0.88, { y: -0.12, z: 0.02 }, 0.09, 0.16, 3.5);

  const ribosomePositions = [
    [-1.22, 0.18, 0.08], [-1.18, -0.16, -0.12], [-0.7, 0.24, 0.16], [-0.7, -0.18, -0.18],
    [-0.25, 0.2, -0.14], [-0.25, -0.24, 0.14], [0.2, 0.18, 0.18], [0.2, -0.18, -0.16],
    [0.66, 0.22, -0.12], [0.66, -0.2, 0.16], [1.14, 0.1, -0.08], [1.14, -0.12, 0.1],
  ];
  ribosomePositions.forEach((position) => {
    const ribosome = new THREE.Mesh(new THREE.SphereGeometry(0.045 * scale, 14, 10), materials.chloroplastRibosome);
    ribosome.position.set(position[0] * scale, position[1] * scale, position[2] * scale);
    group.add(ribosome);
    animalCellRegisterPickable(ribosome, pickables, "mitochondrion");
  });

  animationItems.push({ type: "softSway", group, seed: 23.1, amplitude: 0.018, preserveRotation: true });
  return group;
}

function createPlantErCisternaeSystem(THREE, materials, pickables, animationItems, options = {}) {
  const group = new THREE.Group();
  const scale = options.scale ?? 1;
  if (options.includeNucleus) {
    const ghostNucleus = createPlantNucleus(THREE, materials, pickables, []);
    ghostNucleus.scale.setScalar(0.72 * scale);
    ghostNucleus.traverse?.((child) => {
      if (!child.material) return;
      child.material = child.material.clone();
      child.material.transparent = true;
      child.material.opacity = Math.min(child.material.opacity ?? 1, 0.2);
      child.material.depthWrite = false;
    });
    group.add(ghostNucleus);
  }

  const phi0 = -1.22;
  const phiLen = 2.44;
  const theta0 = 0.48;
  const thetaLen = 2.0;
  const radii = [2.43, 2.72, 3.02, 3.32, 3.62, 3.92];
  const centerPhi = phi0 + phiLen / 2;
  const centerTheta = theta0 + thetaLen / 2;
  const outerLayerShape = { sides: 10, phiScale: 1.1, thetaScale: 1.08, rotation: -0.08 };
  const layerShapes = radii.map((_, layerIndex) => ({
    ...outerLayerShape,
    phiScale: outerLayerShape.phiScale + [0.02, -0.04, 0.03, -0.02, 0.04, -0.01][layerIndex],
    thetaScale: outerLayerShape.thetaScale + [-0.03, 0.02, -0.015, 0.035, -0.02, 0.025][layerIndex],
    rotation: outerLayerShape.rotation + [-0.08, 0.04, -0.025, 0.075, -0.045, 0.025][layerIndex],
    centerPhi: centerPhi + [-0.035, 0.018, -0.024, 0.032, -0.012, 0.026][layerIndex],
    centerTheta: centerTheta + [0.026, -0.018, 0.034, -0.026, 0.014, -0.032][layerIndex],
  }));
  const erPatchAngles = (shape, distance, angle, seed = 0) => {
    const boundary = animalCellErPatchBoundary(angle, shape.sides, shape.rotation, seed);
    const localCenterPhi = shape.centerPhi ?? centerPhi;
    const localCenterTheta = shape.centerTheta ?? centerTheta;
    return {
      phi: localCenterPhi + Math.cos(angle) * (phiLen / 2) * shape.phiScale * distance * boundary,
      theta: localCenterTheta + Math.sin(angle) * (thetaLen / 2) * shape.thetaScale * distance * boundary,
    };
  };
  const erWavePoint = (radius, phi, theta, seed = 0) => {
    const wave = Math.sin(phi * 4.6 + seed) * 0.055
      + Math.cos(theta * 5.8 - seed * 0.7) * 0.045
      + Math.sin((phi + theta) * 2.2 + seed * 0.4) * 0.028;
    const rr = (radius + wave) * scale;
    return new THREE.Vector3(
      -Math.cos(phi) * Math.sin(theta) * rr,
      Math.cos(theta) * rr,
      Math.sin(phi) * Math.sin(theta) * rr,
    );
  };

  radii.forEach((radius, layerIndex) => {
    const shape = layerShapes[layerIndex] || layerShapes[layerShapes.length - 1];
    const membrane = new THREE.Mesh(
      animalCellErShellPatchGeometry(
        THREE,
        radius * scale,
        0.12 * scale,
        phi0,
        phiLen,
        theta0,
        thetaLen,
        5.8 + layerIndex * 1.4,
        58,
        34,
        {
          centerPhi: shape.centerPhi ?? centerPhi,
          centerTheta: shape.centerTheta ?? centerTheta,
          phiRadius: (phiLen / 2) * shape.phiScale,
          thetaRadius: (thetaLen / 2) * shape.thetaScale,
          sides: shape.sides,
          rotation: shape.rotation,
        },
      ),
      layerIndex % 2 ? materials.erLight : materials.er,
    );
    group.add(membrane);
    animalCellRegisterPickable(membrane, pickables, "er");

    const ribosomeRows = [0.32, 0.46, 0.6, 0.74, 0.88];
    const ribosomeColumns = 11;
    for (let iv = 0; iv < ribosomeRows.length; iv += 1) {
      for (let iu = 0; iu < ribosomeColumns; iu += 1) {
        const angleJitter = Math.sin((iu + 1) * 1.91 + (iv + 1) * 0.73 + layerIndex * 1.37) * 0.045;
        const distanceJitter = Math.cos((iu + 1) * 1.27 - (iv + 1) * 1.13 + layerIndex * 0.91) * 0.018;
        const layerShift = Math.sin(layerIndex * 1.2 + iv * 0.44) * 0.035;
        const angle = ((iu + 0.5 + (iv % 2) * 0.5) / ribosomeColumns) * Math.PI * 2 + angleJitter + layerShift;
        const distance = Math.min(0.91, Math.max(0.3, ribosomeRows[iv] + distanceJitter));
        const { phi, theta } = erPatchAngles(shape, Math.min(0.92, distance), angle, 5.8 + layerIndex * 1.4);
        const ribosome = new THREE.Mesh(new THREE.SphereGeometry(0.082 * scale, 14, 10), materials.chloroplastRibosome);
        ribosome.position.copy(erWavePoint(radius + 0.105, phi, theta, 5.8 + layerIndex * 1.4));
        group.add(ribosome);
        animalCellRegisterPickable(ribosome, pickables, "ribosome");
      }
    }
  });

  for (let layerIndex = 0; layerIndex < radii.length - 1; layerIndex += 1) {
    const shape = layerShapes[layerIndex] || layerShapes[layerShapes.length - 1];
    const nextShape = layerShapes[layerIndex + 1] || shape;
    const connectorSites = [
      { angle: Math.PI * 0.22, distance: 0.48 },
      { angle: Math.PI * 0.82, distance: 0.68 },
      { angle: Math.PI * 1.38, distance: 0.56 },
      { angle: Math.PI * 1.82, distance: 0.74 },
    ];
    for (let i = 0; i < connectorSites.length; i += 1) {
      const site = connectorSites[(i + layerIndex) % connectorSites.length];
      const angle = site.angle + layerIndex * 0.1;
      const distance = site.distance;
      const connectorAngles = erPatchAngles(shape, distance, angle, 0);
      const nextConnectorAngles = erPatchAngles(nextShape, distance, angle + 0.03, 0);
      const start = erWavePoint(radii[layerIndex] + 0.035, connectorAngles.phi, connectorAngles.theta, 5.8 + layerIndex * 1.4);
      const end = erWavePoint(radii[layerIndex + 1] - 0.035, nextConnectorAngles.phi, nextConnectorAngles.theta, 5.8 + (layerIndex + 1) * 1.4);
      const tube = animalCellPolylineTube(
        THREE,
        [start, end],
        (0.11 + ((layerIndex + i) % 3) * 0.025) * scale,
        (layerIndex + i) % 2 ? materials.erLight : materials.er,
        false,
        4,
      );
      group.add(tube);
      animalCellRegisterPickable(tube, pickables, "er");
    }
  }

  const smoothErGroup = new THREE.Group();
  const outerRadius = radii[radii.length - 1];
  const smoothFrame = (angle, distance, seed = 0) => {
    const shape = layerShapes[layerShapes.length - 1];
    const { phi, theta } = erPatchAngles(shape, distance, angle, seed);
    const origin = erWavePoint(outerRadius + 0.16, phi, theta, 5.8 + (radii.length - 1) * 1.4);
    const radial = origin.clone().normalize();
    const tangentPhi = new THREE.Vector3(Math.sin(phi), 0, Math.cos(phi)).normalize();
    const tangentTheta = new THREE.Vector3(
      -Math.cos(phi) * Math.cos(theta),
      -Math.sin(theta),
      Math.sin(phi) * Math.cos(theta),
    ).normalize();
    return { origin, radial, tangentPhi, tangentTheta };
  };
  const addSmoothNode = (position, radius) => {
    const node = new THREE.Mesh(new THREE.SphereGeometry(radius * scale, 18, 12), materials.smoothEr);
    node.position.copy(position);
    smoothErGroup.add(node);
    animalCellRegisterPickable(node, pickables, "er");
  };
  const addSmoothTube = (points, radius, nodeRadius = radius * 0.78) => {
    const tube = animalCellPolylineTube(THREE, points, radius * scale, materials.smoothEr, false, 42);
    smoothErGroup.add(tube);
    animalCellRegisterPickable(tube, pickables, "er");
    const startRadius = typeof nodeRadius === "object" ? nodeRadius.start : nodeRadius;
    const endRadius = typeof nodeRadius === "object" ? nodeRadius.end : nodeRadius;
    if (startRadius > 0) addSmoothNode(points[0], startRadius);
    if (endRadius > 0) addSmoothNode(points[points.length - 1], endRadius);
  };
  const smoothSurfacePoint = (angle, distance, outward = 0.76, seed = 0) => {
    const shape = layerShapes[layerShapes.length - 1];
    const { phi, theta } = erPatchAngles(shape, Math.min(0.99, distance), angle, seed);
    const surface = erWavePoint(outerRadius + outward, phi, theta, 5.8 + (radii.length - 1) * 1.4);
    const radial = surface.clone().normalize();
    const tangentTheta = new THREE.Vector3(
      -Math.cos(phi) * Math.cos(theta),
      -Math.sin(theta),
      Math.sin(phi) * Math.cos(theta),
    ).normalize();
    return { point: surface, radial, tangentTheta, phi, theta };
  };
  const smoothTubeRadius = 0.135;
  const smoothAngles = [0.36, 0.48, 0.6, 0.72, 0.84, 0.96];
  const smoothRows = [-0.88, -0.54, -0.18, 0.18, 0.54, 0.88];
  const smoothLayerDistances = [0.5, 0.64, 0.78];
  const smoothCompanionAngleOffsets = [-0.09, -0.08, -0.06, 0.06, 0.08, 0.09];
  const smoothCompanionDistances = [0.42, 0.72, 0.9];
  const smoothCompanionRowOffsets = [-0.32, -0.24, -0.16, 0.16, 0.24, 0.32];
  const trunkSites = smoothLayerDistances.flatMap((distance, layerIndex) =>
    smoothAngles.flatMap((angle, angleIndex) => [0, 1].map((variantIndex) => {
      return {
        angle: Math.PI * (angle + (variantIndex ? smoothCompanionAngleOffsets[angleIndex] : 0)),
        distance: variantIndex ? smoothCompanionDistances[layerIndex] : distance,
        layerIndex,
        liftOffset: variantIndex ? [0.02, 0.11, 0.18][layerIndex] : 0,
        row: smoothRows[angleIndex] + (layerIndex - 1) * 0.035 + (variantIndex ? smoothCompanionRowOffsets[angleIndex] : 0),
      };
    })),
  );
  trunkSites.forEach((site, siteIndex) => {
    const frame = smoothFrame(site.angle, site.distance, 28 + siteIndex);
    const branchLayerLift = (([0.07, 0.24, 0.42][site.layerIndex] || 0.24) + (site.liftOffset || 0)) * scale;
    const trunkRadius = smoothTubeRadius;
    const trunkStart = frame.origin.clone().addScaledVector(frame.radial, -0.1 * scale);
    const trunkMid = frame.origin.clone()
      .addScaledVector(frame.radial, 0.36 * scale)
      .addScaledVector(frame.tangentTheta, site.row * 0.05 * scale);
    const trunkEnd = frame.origin.clone()
      .addScaledVector(frame.radial, 0.82 * scale)
      .addScaledVector(frame.tangentTheta, site.row * 0.08 * scale);
    const mainAngle = site.angle;
    const mainShoulder = smoothSurfacePoint(mainAngle, Math.min(0.9, site.distance + 0.16), 0.74, 67 + siteIndex);
    const mainMid = smoothSurfacePoint(mainAngle, Math.min(0.97, site.distance + 0.36), 0.82, 69 + siteIndex);
    const mainEnd = smoothSurfacePoint(mainAngle, 0.998, 0.86, 71 + siteIndex);
    const mainP1 = trunkEnd.clone()
      .addScaledVector(frame.radial, 0.08 * scale)
      .lerp(mainShoulder.point, 0.42);
    const mainP2 = mainMid.point.clone().addScaledVector(mainMid.radial, 0.035 * scale);
    const mainP3 = mainEnd.point.clone().addScaledVector(mainEnd.radial, 0.02 * scale);
    const mainPath = [trunkStart, trunkMid, trunkEnd, mainP1, mainP2, mainP3];
    addSmoothTube(mainPath, trunkRadius, {
      start: trunkRadius,
      end: trunkRadius,
    });
    const mainCurve = new THREE.CatmullRomCurve3(mainPath, false, "catmullrom", 0.45);
    [0.34, 0.57].forEach((branchT, branchIndex) => {
      const p0 = mainCurve.getPoint(branchT);
      const edgeDirection = mainP3.clone().sub(p0);
      if (edgeDirection.lengthSq() < 0.0001) edgeDirection.copy(mainCurve.getTangent(branchT));
      edgeDirection.normalize();
      const sideDirection = new THREE.Vector3().crossVectors(frame.radial, edgeDirection);
      if (sideDirection.lengthSq() < 0.0001) sideDirection.copy(frame.tangentTheta);
      sideDirection.normalize();
      const sideSign = (branchIndex + siteIndex) % 2 === 0 ? -1 : 1;
      const sideOffset = (0.32 + branchIndex * 0.05) * scale;
      const branchReach = Math.max(0.72 * scale, p0.distanceTo(mainP3) * 0.96);
      const p1 = p0.clone()
        .addScaledVector(sideDirection, sideSign * sideOffset * 0.78)
        .addScaledVector(frame.radial, branchLayerLift);
      const p2 = p0.clone()
        .addScaledVector(sideDirection, sideSign * sideOffset * 1.02)
        .addScaledVector(edgeDirection, branchReach * 0.48)
        .addScaledVector(frame.radial, branchLayerLift + 0.03 * scale);
      const p3 = p0.clone()
        .addScaledVector(sideDirection, sideSign * sideOffset * 1.22)
        .addScaledVector(edgeDirection, branchReach)
        .addScaledVector(frame.radial, branchLayerLift + 0.03 * scale);
      addSmoothTube([p0, p1, p2, p3], smoothTubeRadius, { start: 0, end: smoothTubeRadius });
    });
  });
  group.add(smoothErGroup);

  animationItems.push({ type: "softSway", group, seed: 24.6, amplitude: 0.018 });
  return group;
}

function createPlantGolgiStack(THREE, materials, pickables, animationItems, scale = 1) {
  const group = new THREE.Group();
  const cisternaGeometryUncached = (radiusX, radiusZ, depth, sheetThickness, rimRadius, radialSegments = 96, radialRings = 20, rimSegments = 20, waveSeed = 0) => {
    const vertices = [];
    const indices = [];
    const bottomRows = [];
    const topRows = [];
    const capRows = [];
    const smoothStep = (value) => value * value * value * (value * (value * 6 - 15) + 10);
    const smoothStepDerivative = (value) => 30 * value * value * (value - 1) * (value - 1);
    const bowlCurve = (value) => 0.34 * value * value + 0.66 * smoothStep(value);
    const bowlCurveDerivative = (value) => 0.68 * value + 0.66 * smoothStepDerivative(value);
    const halfSheet = sheetThickness * 0.5;
    const edgeInflation = rimRadius * 0.7;
    const radialBase = Math.max(0.001, (radiusX + radiusZ) * 0.5);
    const waveAmplitude = radialBase * 0.028;
    const waveAt = (angle, u) => {
      const fade = smoothStep(Math.max(0, Math.min(1, (u - 0.18) / 0.82)));
      return fade * (
        Math.sin(angle * 3 + waveSeed) * waveAmplitude
        + Math.sin(angle * 5.2 - waveSeed * 0.73) * waveAmplitude * 0.42
      );
    };
    const profileY = (u) => depth * (0.58 - 1.16 * bowlCurve(u));
    const profileSlope = (u) => (-1.16 * depth * bowlCurveDerivative(u)) / radialBase;
    const frameAt = (u) => {
      const slope = profileSlope(u);
      const length = Math.hypot(1, slope) || 1;
      return {
        normalR: -slope / length,
        normalY: 1 / length,
        tangentR: 1 / length,
        tangentY: slope / length,
      };
    };
    const pushSheetRows = (rows, side) => {
      for (let row = 0; row <= radialRings; row += 1) {
        const u = row / radialRings;
        const edge = smoothStep(Math.max(0, Math.min(1, (u - 0.62) / 0.38)));
        const rowStart = vertices.length / 3;
        const mid = profileY(u);
        const halfThickness = halfSheet + edgeInflation * edge;
        const frame = frameAt(u);
        for (let i = 0; i < radialSegments; i += 1) {
          const angle = (i / radialSegments) * Math.PI * 2;
          const c = Math.cos(angle);
          const s = Math.sin(angle);
          const nxRaw = c / radiusX;
          const nzRaw = s / radiusZ;
          const nLen = Math.hypot(nxRaw, nzRaw) || 1;
          const nx = nxRaw / nLen;
          const nz = nzRaw / nLen;
          const wave = waveAt(angle, u);
          const radialOffset = side * halfThickness * frame.normalR;
          vertices.push(
            c * radiusX * u + nx * (radialOffset + wave),
            mid + side * halfThickness * frame.normalY + wave * 0.12,
            s * radiusZ * u + nz * (radialOffset + wave),
          );
        }
        rows.push(rowStart);
      }
    };
    pushSheetRows(topRows, 1);
    pushSheetRows(bottomRows, -1);
    const edgeHalf = halfSheet + edgeInflation;
    const edgeMid = profileY(1);
    const edgeFrame = frameAt(1);
    for (let row = 1; row < rimSegments; row += 1) {
      const theta = (row / rimSegments) * Math.PI;
      const rowStart = vertices.length / 3;
      for (let i = 0; i < radialSegments; i += 1) {
        const angle = (i / radialSegments) * Math.PI * 2;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const nxRaw = c / radiusX;
        const nzRaw = s / radiusZ;
        const nLen = Math.hypot(nxRaw, nzRaw) || 1;
        const nx = nxRaw / nLen;
        const nz = nzRaw / nLen;
        const wave = waveAt(angle, 1);
        const radialOffset = edgeHalf * (Math.cos(theta) * edgeFrame.normalR + Math.sin(theta) * edgeFrame.tangentR);
        vertices.push(
          c * radiusX + nx * (radialOffset + wave),
          edgeMid + edgeHalf * (Math.cos(theta) * edgeFrame.normalY + Math.sin(theta) * edgeFrame.tangentY) + wave * 0.12,
          s * radiusZ + nz * (radialOffset + wave),
        );
      }
      capRows.push(rowStart);
    }
    for (let row = 0; row < radialRings; row += 1) {
      for (let i = 0; i < radialSegments; i += 1) {
        const next = (i + 1) % radialSegments;
        indices.push(bottomRows[row] + i, bottomRows[row] + next, bottomRows[row + 1] + i);
        indices.push(bottomRows[row] + next, bottomRows[row + 1] + next, bottomRows[row + 1] + i);
        indices.push(topRows[row] + i, topRows[row + 1] + i, topRows[row] + next);
        indices.push(topRows[row] + next, topRows[row + 1] + i, topRows[row + 1] + next);
      }
    }
    const edgeRows = [topRows[radialRings], ...capRows, bottomRows[radialRings]];
    for (let row = 0; row < edgeRows.length - 1; row += 1) {
      for (let i = 0; i < radialSegments; i += 1) {
        const next = (i + 1) % radialSegments;
        indices.push(edgeRows[row] + i, edgeRows[row + 1] + i, edgeRows[row] + next);
        indices.push(edgeRows[row] + next, edgeRows[row + 1] + i, edgeRows[row + 1] + next);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };
  const cisternaGeometry = (...args) => animalCellCachedGeometry(THREE, "golgi-cisterna", args,
    () => cisternaGeometryUncached(...args));
  const layerScales = [0.6, 0.7, 0.984, 1.302, 1.6, 1.288, 0.96];
  const layerGap = 0.31 * scale;
  const topLayerIndex = layerScales.length - 1;
  const stack = new THREE.Group();
  layerScales.forEach((layerScale, index) => {
    const offset = index - 4;
    const faceRadius = 1.16 * scale * layerScale;
    const radiusX = faceRadius;
    const radiusZ = faceRadius;
    const depth = 0.36 * scale * (0.76 + layerScale * 0.24);
    const thickness = 0.06 * scale * (0.88 + layerScale * 0.12);
    const rimRadius = 0.1 * scale * (0.88 + layerScale * 0.12);
    const layer = new THREE.Group();
    const waveSeed = index * 1.71 + 0.43;
    const geometry = cisternaGeometry(radiusX, radiusZ, depth, thickness, rimRadius, 128, 26, 34, waveSeed);
    const sac = new THREE.Mesh(geometry, index % 2 ? materials.golgiDark : materials.golgi);
    layer.add(sac);
    animalCellRegisterPickable(sac, pickables, "golgi");

    const lumenGeometry = cisternaGeometry(radiusX * 0.62, radiusZ * 0.62, depth * 0.34, thickness * 0.08, rimRadius * 0.2, 96, 16, 18, waveSeed + 0.8);
    const lumen = new THREE.Mesh(lumenGeometry, materials.golgiLumen);
    lumen.position.y = thickness * 0.62;
    layer.add(lumen);
    animalCellRegisterPickable(lumen, pickables, "golgi");

    const addGolgiVesicle = (angle, distance, y, radiusSeed) => {
      const vesicleRadius = (0.112 + (radiusSeed % 2) * 0.014) * scale;
      const vesicle = new THREE.Mesh(new THREE.SphereGeometry(vesicleRadius, 20, 14), materials.golgiVesicle);
      vesicle.position.set(
        Math.cos(angle) * distance,
        y,
        Math.sin(angle) * distance,
      );
      layer.add(vesicle);
      animalCellRegisterPickable(vesicle, pickables, "vesicle");
      return vesicle;
    };

    if (index < topLayerIndex) {
      for (let vesicleIndex = 0; vesicleIndex < 2; vesicleIndex += 1) {
        const angle = index * 0.83 + vesicleIndex * Math.PI + Math.sin(index * 1.7 + vesicleIndex) * 0.2;
        const vesicleRadius = (0.112 + ((index + vesicleIndex) % 2) * 0.014) * scale;
        const distance = radiusX + rimRadius * (5.1 + ((index + vesicleIndex) % 3) * 0.38) + vesicleRadius * 2.2;
        const sideLift = (vesicleIndex - 0.5) * 0.055 * scale;
        addGolgiVesicle(angle, distance, depth * -0.16 + sideLift, index + vesicleIndex);
      }
    }

    layer.position.set(0, offset * layerGap, 0);
    stack.add(layer);
  });
  const visualTopY = -4 * layerGap - 0.58 * scale;
  [
    [-0.34, 0.04],
    [0.02, -0.04],
    [0.38, 0.08],
  ].forEach(([x, z], index) => {
    const vesicleRadius = (0.112 + (index % 2) * 0.014) * scale;
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(vesicleRadius, 20, 14), materials.golgiVesicle);
    vesicle.position.set(x * scale, visualTopY - index * 0.03 * scale, z * scale);
    stack.add(vesicle);
    animalCellRegisterPickable(vesicle, pickables, "vesicle");
  });
  stack.rotation.set(0.13, 0.48, -0.28);
  group.add(stack);
  animationItems.push({ type: "softSway", group, seed: 26.3, amplitude: 0.018, preserveRotation: true });
  return group;
}

function animalCellHexFootprint(radiusX, radiusZ) {
  return [
    { x: -radiusX, z: 0 },
    { x: -radiusX * 0.65, z: -radiusZ },
    { x: radiusX * 0.65, z: -radiusZ },
    { x: radiusX, z: 0 },
    { x: radiusX * 0.65, z: radiusZ },
    { x: -radiusX * 0.65, z: radiusZ },
  ];
}

function animalCellHexFacePoints(width, height, centerY = 0) {
  const halfW = width / 2;
  const shoulderW = width * 0.326;
  const halfH = height / 2;
  return [
    { x: -halfW, y: centerY },
    { x: -shoulderW, y: centerY + halfH },
    { x: shoulderW, y: centerY + halfH },
    { x: halfW, y: centerY },
    { x: shoulderW, y: centerY - halfH },
    { x: -shoulderW, y: centerY - halfH },
  ];
}

function animalCellFacePrismGeometry(THREE, points, depth, options = {}) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => shape.lineTo(point.x, point.y));
  shape.lineTo(points[0].x, points[0].y);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: options.bevelEnabled ?? true,
    bevelThickness: options.bevelThickness ?? 0.22,
    bevelSize: options.bevelSize ?? 0.28,
    bevelSegments: options.bevelSegments ?? 4,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createAnimalCellCompleteWallShell(THREE, materials, pickables, options = {}) {
  const group = new THREE.Group();
  const width = options.width ?? 70;
  const height = options.height ?? 30;
  const depth = options.depth ?? 44;
  const face = animalCellHexFacePoints(width, height, options.centerY ?? 0);
  const innerFace = animalCellHexFacePoints(width * 0.955, height * 0.925, options.centerY ?? 0);
  const wallMaterial = materials.cellWall.clone();
  wallMaterial.opacity = options.faceOpacity ?? 0.18;
  wallMaterial.transparent = true;
  wallMaterial.depthWrite = false;
  wallMaterial.side = THREE.DoubleSide;
  const wall = new THREE.Mesh(animalCellFacePrismGeometry(THREE, face, depth, {
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.22,
    bevelSegments: 4,
  }), wallMaterial);
  wall.renderOrder = -5;
  group.add(wall);
  animalCellRegisterPickable(wall, pickables, "cellWall");

  const innerMaterial = materials.cellWallInner.clone();
  innerMaterial.opacity = options.innerOpacity ?? 0.18;
  innerMaterial.transparent = true;
  innerMaterial.depthWrite = false;
  innerMaterial.side = THREE.DoubleSide;
  const innerWall = new THREE.Mesh(animalCellFacePrismGeometry(THREE, innerFace, depth * 0.94, {
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.16,
    bevelSegments: 4,
  }), innerMaterial);
  innerWall.renderOrder = -4;
  group.add(innerWall);
  animalCellRegisterPickable(innerWall, pickables, "cellWall");

  const edgeMaterial = materials.cellWallInner.clone();
  edgeMaterial.color.set("#A7C957");
  edgeMaterial.opacity = options.edgeOpacity ?? 0.32;
  edgeMaterial.transparent = true;
  edgeMaterial.depthWrite = false;
  const front = face.map((p) => new THREE.Vector3(p.x, p.y, depth / 2));
  const back = face.map((p) => new THREE.Vector3(p.x, p.y, -depth / 2));
  const addStraightHexEdges = (points) => {
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const edge = animalCellPolylineTube(THREE, [point, next], 0.035, edgeMaterial, false, 6);
      group.add(edge);
      animalCellRegisterPickable(edge, pickables, "cellWall");
    });
  };
  addStraightHexEdges(front);
  addStraightHexEdges(back);
  face.forEach((point) => {
    const sideEdge = animalCellPolylineTube(THREE, [
      new THREE.Vector3(point.x, point.y, -depth / 2),
      new THREE.Vector3(point.x, point.y, depth / 2),
    ], 0.03, edgeMaterial, false, 8);
    group.add(sideEdge);
    animalCellRegisterPickable(sideEdge, pickables, "cellWall");
  });
  return group;
}

function animalCellRoundedFacePoints(points, radius, segments = 8) {
  const rounded = [];
  points.forEach((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const toPrevious = { x: previous.x - point.x, y: previous.y - point.y };
    const toNext = { x: next.x - point.x, y: next.y - point.y };
    const previousLength = Math.hypot(toPrevious.x, toPrevious.y) || 1;
    const nextLength = Math.hypot(toNext.x, toNext.y) || 1;
    const cut = Math.min(radius, previousLength * 0.42, nextLength * 0.42);
    const start = {
      x: point.x + (toPrevious.x / previousLength) * cut,
      y: point.y + (toPrevious.y / previousLength) * cut,
    };
    const end = {
      x: point.x + (toNext.x / nextLength) * cut,
      y: point.y + (toNext.y / nextLength) * cut,
    };
    for (let step = 0; step <= segments; step += 1) {
      if (index > 0 && step === 0) continue;
      const t = step / segments;
      const inv = 1 - t;
      rounded.push({
        x: inv * inv * start.x + 2 * inv * t * point.x + t * t * end.x,
        y: inv * inv * start.y + 2 * inv * t * point.y + t * t * end.y,
      });
    }
  });
  return rounded;
}

function animalCellExactPolylineTube(THREE, points, radius, material, closed = false, segments = 96) {
  const path = new THREE.CurvePath();
  const max = closed ? points.length : points.length - 1;
  for (let index = 0; index < max; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    path.add(new THREE.LineCurve3(current, next));
  }
  const geometry = new THREE.TubeGeometry(path, segments, radius, 10, false);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

function createAnimalCellMembraneShell(THREE, materials, pickables, options = {}) {
  const group = new THREE.Group();
  const width = options.width ?? 66;
  const height = options.height ?? 27;
  const depth = options.depth ?? 40;
  const baseFace = animalCellHexFacePoints(width, height, options.centerY ?? 0);
  const face = animalCellRoundedFacePoints(baseFace, options.cornerRadius ?? Math.min(width, height) * 0.16, 14);
  const membraneMaterial = materials.membrane.clone();
  membraneMaterial.opacity = options.opacity ?? 0.36;
  membraneMaterial.transparent = true;
  membraneMaterial.depthWrite = false;
  membraneMaterial.side = THREE.DoubleSide;
  const membrane = new THREE.Mesh(animalCellFacePrismGeometry(THREE, face, depth, {
    bevelEnabled: true,
    bevelThickness: 0.34,
    bevelSize: 0.38,
    bevelSegments: 10,
  }), membraneMaterial);
  membrane.renderOrder = -2;
  group.add(membrane);
  animalCellRegisterPickable(membrane, pickables, "membrane");

  const edgeMaterial = materials.membrane.clone();
  edgeMaterial.opacity = options.edgeOpacity ?? 0.34;
  edgeMaterial.transparent = true;
  edgeMaterial.depthWrite = false;
  const edgeInset = 0.22;
  const front = face.map((p) => new THREE.Vector3(p.x, p.y, depth / 2 - edgeInset));
  const back = face.map((p) => new THREE.Vector3(p.x, p.y, -depth / 2 + edgeInset));
  const frontEdge = animalCellExactPolylineTube(THREE, front, 0.022, edgeMaterial, true, 156);
  const backEdge = animalCellExactPolylineTube(THREE, back, 0.022, edgeMaterial, true, 156);
  group.add(frontEdge, backEdge);
  [frontEdge, backEdge].forEach((edge) => animalCellRegisterPickable(edge, pickables, "membrane"));
  return group;
}

function createAnimalCellCytoplasmShell(THREE, materials, pickables, options = {}) {
  const group = new THREE.Group();
  const width = options.width ?? 64;
  const height = options.height ?? 26;
  const depth = options.depth ?? 39;
  const baseFace = animalCellHexFacePoints(width, height, options.centerY ?? 0);
  const face = animalCellRoundedFacePoints(baseFace, options.cornerRadius ?? Math.min(width, height) * 0.16, 14);
  const cytoplasmMaterial = materials.cytoplasm.clone();
  cytoplasmMaterial.opacity = options.opacity ?? 0.12;
  cytoplasmMaterial.transparent = true;
  cytoplasmMaterial.depthWrite = false;
  cytoplasmMaterial.side = THREE.DoubleSide;
  const cytoplasm = new THREE.Mesh(animalCellFacePrismGeometry(THREE, face, depth, {
    bevelEnabled: true,
    bevelThickness: 0.32,
    bevelSize: 0.36,
    bevelSegments: 10,
  }), cytoplasmMaterial);
  cytoplasm.renderOrder = -3;
  group.add(cytoplasm);
  animalCellRegisterPickable(cytoplasm, pickables, "cytoplasm");
  return group;
}

function animalCellPolylineTube(THREE, points, radius, material, closed = false, segments = 80) {
  const curve = new THREE.CatmullRomCurve3(points, closed, "catmullrom", 0.45);
  const geometry = new THREE.TubeGeometry(curve, segments, radius, 14, closed);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, material);
}

function animalCellRoundedDiskGeometryUncached(THREE, radiusX, radiusZ, height, radialSegments = 56) {
  const vertices = [];
  const indices = [];
  const profile = [
    { y: -0.5, r: 0.04 },
    { y: -0.47, r: 0.42 },
    { y: -0.4, r: 0.75 },
    { y: -0.28, r: 0.96 },
    { y: -0.1, r: 1.03 },
    { y: 0.1, r: 1.03 },
    { y: 0.28, r: 0.96 },
    { y: 0.4, r: 0.75 },
    { y: 0.47, r: 0.42 },
    { y: 0.5, r: 0.04 },
  ];
  profile.forEach((ring) => {
    for (let i = 0; i < radialSegments; i += 1) {
      const angle = (i / radialSegments) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * radiusX * ring.r,
        ring.y * height,
        Math.sin(angle) * radiusZ * ring.r,
      );
    }
  });
  for (let row = 0; row < profile.length - 1; row += 1) {
    const current = row * radialSegments;
    const next = (row + 1) * radialSegments;
    for (let i = 0; i < radialSegments; i += 1) {
      const a = current + i;
      const b = current + ((i + 1) % radialSegments);
      const c = next + i;
      const d = next + ((i + 1) % radialSegments);
      indices.push(a, c, b, b, c, d);
    }
  }
  const bottomCenter = vertices.length / 3;
  vertices.push(0, -height / 2, 0);
  const topCenter = vertices.length / 3;
  vertices.push(0, height / 2, 0);
  const bottomRow = 0;
  const topRow = (profile.length - 1) * radialSegments;
  for (let i = 0; i < radialSegments; i += 1) {
    const next = (i + 1) % radialSegments;
    indices.push(bottomCenter, bottomRow + next, bottomRow + i);
    indices.push(topCenter, topRow + i, topRow + next);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellRoundedCuboidGeometry(THREE, radiusX, radiusY, radiusZ, roundness = 0.42, widthSegments = 96, heightSegments = 48) {
  const vertices = [];
  const indices = [];
  const signedPow = (value, power) => Math.sign(value || 1) * Math.pow(Math.abs(value), power);

  for (let row = 0; row <= heightSegments; row += 1) {
    const u = -Math.PI / 2 + (row / heightSegments) * Math.PI;
    const cosU = Math.cos(u);
    const sinU = Math.sin(u);
    for (let col = 0; col <= widthSegments; col += 1) {
      const v = -Math.PI + (col / widthSegments) * Math.PI * 2;
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);
      const softWave = 1 + Math.sin(v * 1.6 + u * 0.7) * 0.008 + Math.cos(v * 2.7 - u * 1.2) * 0.006;
      const x = radiusX * signedPow(cosU, roundness) * signedPow(cosV, roundness) * softWave;
      const y = radiusY * signedPow(sinU, roundness) * (1 + (softWave - 1) * 0.35);
      const z = radiusZ * signedPow(cosU, roundness) * signedPow(sinV, roundness) * softWave;
      vertices.push(x, y, z);
    }
  }

  const stride = widthSegments + 1;
  for (let row = 0; row < heightSegments; row += 1) {
    for (let col = 0; col < widthSegments; col += 1) {
      const a = row * stride + col;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellErPatchBoundary(angle, sides = 10, rotation = 0, seed = 0) {
  const n = Math.max(5, sides || 10);
  let boundary = 1;
  if (n < 10) {
    const sector = (Math.PI * 2) / n;
    const local = ((((angle - rotation + sector / 2) % sector) + sector) % sector) - sector / 2;
    const minRadius = Math.cos(sector / 2);
    const polygonRadius = minRadius / Math.max(0.3, Math.cos(local));
    const normalized = (polygonRadius - minRadius) / Math.max(0.001, 1 - minRadius);
    boundary = 0.86 + normalized * 0.18;
  }
  return boundary * (1 + Math.sin(angle * 2.1 + seed) * 0.025 + Math.cos(angle * 3.7 - seed) * 0.018);
}

function animalCellErShellPatchGeometry(THREE, radius, thickness, phi0, phiLen, theta0, thetaLen, seed, phiSegments = 56, thetaSegments = 34, shapeOptions = {}) {
  const vertices = [];
  const indices = [];
  const outerRows = [];
  const innerRows = [];
  const centerPhi = shapeOptions.centerPhi ?? (phi0 + phiLen / 2);
  const centerTheta = shapeOptions.centerTheta ?? (theta0 + thetaLen / 2);
  const phiRadius = shapeOptions.phiRadius ?? phiLen / 2;
  const thetaRadius = shapeOptions.thetaRadius ?? thetaLen / 2;
  const sides = shapeOptions.sides ?? 10;
  const rotation = shapeOptions.rotation ?? 0;
  const radialSegments = shapeOptions.radialSegments ?? thetaSegments;
  const angleSegments = shapeOptions.angleSegments ?? phiSegments;
  const radialWave = (phi, theta) =>
    Math.sin(phi * 4.6 + seed) * 0.055
    + Math.cos(theta * 5.8 - seed * 0.7) * 0.045
    + Math.sin((phi + theta) * 2.2 + seed * 0.4) * 0.028;
  const pointAt = (r, phi, theta) => {
    const w = radialWave(phi, theta);
    const rr = r + w;
    return new THREE.Vector3(
      -Math.cos(phi) * Math.sin(theta) * rr,
      Math.cos(theta) * rr,
      Math.sin(phi) * Math.sin(theta) * rr,
    );
  };
  const patchAngles = (distance, angle) => {
    const boundary = animalCellErPatchBoundary(angle, sides, rotation, seed);
    return {
      phi: centerPhi + Math.cos(angle) * phiRadius * distance * boundary,
      theta: centerTheta + Math.sin(angle) * thetaRadius * distance * boundary,
    };
  };
  for (let i = 0; i <= radialSegments; i += 1) {
    const distance = i / radialSegments;
    const outerStart = vertices.length / 3;
    for (let j = 0; j < angleSegments; j += 1) {
      const angle = (j / angleSegments) * Math.PI * 2;
      const { phi, theta } = patchAngles(distance, angle);
      const p = pointAt(radius + thickness / 2, phi, theta);
      vertices.push(p.x, p.y, p.z);
    }
    const innerStart = vertices.length / 3;
    for (let j = 0; j < angleSegments; j += 1) {
      const angle = (j / angleSegments) * Math.PI * 2;
      const { phi, theta } = patchAngles(distance, angle);
      const p = pointAt(radius - thickness / 2, phi, theta);
      vertices.push(p.x, p.y, p.z);
    }
    outerRows.push(outerStart);
    innerRows.push(innerStart);
  }
  for (let i = 0; i < radialSegments; i += 1) {
    for (let j = 0; j < angleSegments; j += 1) {
      const next = (j + 1) % angleSegments;
      const oa = outerRows[i] + j;
      const ob = outerRows[i + 1] + j;
      const oc = outerRows[i] + next;
      const od = outerRows[i + 1] + next;
      indices.push(oa, ob, oc, oc, ob, od);
      const ia = innerRows[i] + j;
      const ib = innerRows[i + 1] + j;
      const ic = innerRows[i] + next;
      const id = innerRows[i + 1] + next;
      indices.push(ia, ic, ib, ic, id, ib);
    }
  }
  for (let j = 0; j < angleSegments; j += 1) {
    const next = (j + 1) % angleSegments;
    indices.push(outerRows[radialSegments] + j, innerRows[radialSegments] + j, outerRows[radialSegments] + next);
    indices.push(outerRows[radialSegments] + next, innerRows[radialSegments] + j, innerRows[radialSegments] + next);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellFusedMitoInnerGeometryUncached(THREE, radius, cylinderLength, openings, lengthSegments = 96, radialSegments = 48) {
  const vertices = [];
  const indices = [];
  const rows = [];
  const halfCylinder = cylinderLength / 2;
  const totalHalf = halfCylinder + radius;
  const sectionRadiusAt = (x) => {
    if (x < -halfCylinder) {
      const u = (x + halfCylinder) / radius;
      return radius * Math.sqrt(Math.max(0, 1 - u * u));
    }
    if (x > halfCylinder) {
      const u = (x - halfCylinder) / radius;
      return radius * Math.sqrt(Math.max(0, 1 - u * u));
    }
    return radius;
  };
  const membraneWaveAt = (x, angle) =>
    1 + Math.sin(x * 3.1 + angle * 4.3) * 0.026 + Math.cos(x * 5.2 - angle * 2.2) * 0.014;
  const isInsideOpening = (x, y, z) => openings.some((opening) => {
    if (opening.side * z < radius * 0.22) return false;
    const dx = (x - opening.x) / opening.xRadius;
    const dy = (y - opening.y) / opening.yRadius;
    return dx * dx + dy * dy < 1;
  });
  for (let i = 0; i <= lengthSegments; i += 1) {
    const x = -totalHalf + (i / lengthSegments) * totalHalf * 2;
    const sectionRadius = sectionRadiusAt(x);
    const row = vertices.length / 3;
    for (let j = 0; j < radialSegments; j += 1) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const wavedRadius = sectionRadius * membraneWaveAt(x, angle);
      vertices.push(
        x,
        Math.sin(angle) * wavedRadius,
        Math.cos(angle) * wavedRadius,
      );
    }
    rows.push(row);
  }
  for (let i = 0; i < lengthSegments; i += 1) {
    const xA = -totalHalf + (i / lengthSegments) * totalHalf * 2;
    const xB = -totalHalf + ((i + 1) / lengthSegments) * totalHalf * 2;
    const rA = sectionRadiusAt(xA);
    const rB = sectionRadiusAt(xB);
    for (let j = 0; j < radialSegments; j += 1) {
      const next = (j + 1) % radialSegments;
      const angle = ((j + 0.5) / radialSegments) * Math.PI * 2;
      const centerX = (xA + xB) / 2;
      const centerRadius = (rA + rB) / 2;
      const centerY = Math.sin(angle) * centerRadius;
      const centerZ = Math.cos(angle) * centerRadius;
      if (isInsideOpening(centerX, centerY, centerZ)) continue;
      const a = rows[i] + j;
      const b = rows[i + 1] + j;
      const c = rows[i] + next;
      const d = rows[i + 1] + next;
      indices.push(a, b, c, c, b, d);
    }
  }

  openings.forEach((opening) => {
    const depthSegments = 20;
    const widthSegments = 24;
    const topRows = [];
    const bottomRows = [];
    const openingSectionRadius = sectionRadiusAt(opening.x);
    const surfaceZAtY = (yValue) => opening.side * Math.sqrt(Math.max(0.002, openingSectionRadius * openingSectionRadius - yValue * yValue));
    for (let i = 0; i <= depthSegments; i += 1) {
      const d = i / depthSegments;
      const rootBlendT = Math.min(1, d / 0.16);
      const rootEase = rootBlendT * rootBlendT * (3 - 2 * rootBlendT);
      const inwardCurve = Math.sin(d * Math.PI);
      const bodyHalfWidth = opening.width * Math.sqrt(Math.max(0.006, 1 - Math.pow(d, 1.55))) * (1 + Math.sin(d * 5 + opening.phase) * 0.03);
      const halfWidth = opening.yRadius * (1 - rootEase) + bodyHalfWidth * rootEase;
      const rowTop = vertices.length / 3;
      for (let j = 0; j <= widthSegments; j += 1) {
        const s = -1 + (j / widthSegments) * 2;
        const edgeSoft = Math.sqrt(Math.max(0, 1 - s * s));
        const yWave = Math.sin(d * 4 + s * 2 + opening.phase) * opening.width * 0.03 * inwardCurve;
        const zWave = Math.cos(d * 3 - s * 2 + opening.phase) * opening.depth * 0.022 * inwardCurve;
        const edgeRound = 0.22 + edgeSoft * 0.28;
        const tipRound = 0.7 + Math.sqrt(Math.max(0.08, 1 - d * d)) * 0.3;
        const bodyCrown = opening.height * edgeRound * tipRound;
        const surfaceRipple = Math.sin(d * 8 + s * 3.2 + opening.phase) * opening.height * 0.055 * inwardCurve;
        const y = opening.y + s * halfWidth + yWave;
        const z = surfaceZAtY(y) - opening.side * opening.depth * d + zWave;
        vertices.push(
          opening.x + bodyCrown + surfaceRipple + Math.sin(s * Math.PI + opening.phase) * opening.height * 0.02 * inwardCurve,
          y,
          z,
        );
      }
      const rowBottom = vertices.length / 3;
      for (let j = 0; j <= widthSegments; j += 1) {
        const s = -1 + (j / widthSegments) * 2;
        const edgeSoft = Math.sqrt(Math.max(0, 1 - s * s));
        const yWave = Math.sin(d * 4 + s * 2 + opening.phase) * opening.width * 0.03 * inwardCurve;
        const zWave = Math.cos(d * 3 - s * 2 + opening.phase) * opening.depth * 0.022 * inwardCurve;
        const edgeRound = 0.22 + edgeSoft * 0.28;
        const tipRound = 0.7 + Math.sqrt(Math.max(0.08, 1 - d * d)) * 0.3;
        const bodyCrown = opening.height * edgeRound * tipRound;
        const surfaceRipple = Math.sin(d * 8 + s * 3.2 + opening.phase + 0.7) * opening.height * 0.055 * inwardCurve;
        const y = opening.y + s * halfWidth + yWave;
        const z = surfaceZAtY(y) - opening.side * opening.depth * d + zWave;
        vertices.push(
          opening.x - bodyCrown + surfaceRipple + Math.sin(s * Math.PI + opening.phase) * opening.height * 0.016 * inwardCurve,
          y,
          z,
        );
      }
      topRows.push(rowTop);
      bottomRows.push(rowBottom);
    }
    for (let i = 0; i < depthSegments; i += 1) {
      const topA = topRows[i];
      const topB = topRows[i + 1];
      const bottomA = bottomRows[i];
      const bottomB = bottomRows[i + 1];
      for (let j = 0; j < widthSegments; j += 1) {
        indices.push(topA + j, topB + j, topA + j + 1, topA + j + 1, topB + j, topB + j + 1);
        indices.push(bottomA + j, bottomA + j + 1, bottomB + j, bottomA + j + 1, bottomB + j + 1, bottomB + j);
      }
      indices.push(topA, bottomA, topB, bottomA, bottomB, topB);
      indices.push(topA + widthSegments, topB + widthSegments, bottomA + widthSegments, bottomA + widthSegments, topB + widthSegments, bottomB + widthSegments);
    }
    for (let j = 0; j < widthSegments; j += 1) {
      indices.push(topRows[depthSegments] + j, bottomRows[depthSegments] + j, topRows[depthSegments] + j + 1);
      indices.push(topRows[depthSegments] + j + 1, bottomRows[depthSegments] + j, bottomRows[depthSegments] + j + 1);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellSphereWithOpeningsGeometry(THREE, radius, openings, widthSegments = 96, heightSegments = 54) {
  const vertices = [];
  const indices = [];
  const rows = [];
  for (let row = 0; row <= heightSegments; row += 1) {
    const theta = (row / heightSegments) * Math.PI;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const rowStart = vertices.length / 3;
    for (let column = 0; column <= widthSegments; column += 1) {
      const phi = (column / widthSegments) * Math.PI * 2;
      vertices.push(
        Math.cos(phi) * sinTheta * radius,
        cosTheta * radius,
        Math.sin(phi) * sinTheta * radius,
      );
    }
    rows.push(rowStart);
  }
  const isInsideOpening = (direction) => openings.some((opening) =>
    direction.dot(opening.dir) > Math.cos(opening.angle)
  );
  for (let row = 0; row < heightSegments; row += 1) {
    for (let column = 0; column < widthSegments; column += 1) {
      const a = rows[row] + column;
      const b = rows[row + 1] + column;
      const c = rows[row] + column + 1;
      const d = rows[row + 1] + column + 1;
      const center = new THREE.Vector3(
        vertices[a * 3] + vertices[b * 3] + vertices[c * 3] + vertices[d * 3],
        vertices[a * 3 + 1] + vertices[b * 3 + 1] + vertices[c * 3 + 1] + vertices[d * 3 + 1],
        vertices[a * 3 + 2] + vertices[b * 3 + 2] + vertices[c * 3 + 2] + vertices[d * 3 + 2],
      ).normalize();
      if (isInsideOpening(center)) continue;
      indices.push(a, b, c, c, b, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellHollowCylinderGeometryUncached(THREE, outerRadius, innerRadius, length, radialSegments = 28, lengthSegments = 2) {
  const vertices = [];
  const indices = [];
  const outerRows = [];
  const innerRows = [];
  for (let row = 0; row <= lengthSegments; row += 1) {
    const z = -length / 2 + (row / lengthSegments) * length;
    const outerStart = vertices.length / 3;
    for (let i = 0; i < radialSegments; i += 1) {
      const angle = (i / radialSegments) * Math.PI * 2;
      vertices.push(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, z);
    }
    const innerStart = vertices.length / 3;
    for (let i = 0; i < radialSegments; i += 1) {
      const angle = (i / radialSegments) * Math.PI * 2;
      vertices.push(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, z);
    }
    outerRows.push(outerStart);
    innerRows.push(innerStart);
  }
  for (let row = 0; row < lengthSegments; row += 1) {
    for (let i = 0; i < radialSegments; i += 1) {
      const next = (i + 1) % radialSegments;
      indices.push(outerRows[row] + i, outerRows[row + 1] + i, outerRows[row] + next);
      indices.push(outerRows[row] + next, outerRows[row + 1] + i, outerRows[row + 1] + next);
      indices.push(innerRows[row] + i, innerRows[row] + next, innerRows[row + 1] + i);
      indices.push(innerRows[row] + next, innerRows[row + 1] + next, innerRows[row + 1] + i);
    }
  }
  [0, lengthSegments].forEach((row) => {
    for (let i = 0; i < radialSegments; i += 1) {
      const next = (i + 1) % radialSegments;
      if (row === 0) {
        indices.push(outerRows[row] + i, outerRows[row] + next, innerRows[row] + i);
        indices.push(outerRows[row] + next, innerRows[row] + next, innerRows[row] + i);
      } else {
        indices.push(outerRows[row] + i, innerRows[row] + i, outerRows[row] + next);
        indices.push(outerRows[row] + next, innerRows[row] + i, innerRows[row] + next);
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function animalCellNuclearPoreDirections(THREE, count = 34) {
  const directions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - ((i + 0.5) / count) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * golden + 0.35;
    directions.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).normalize());
  }
  return directions;
}

function createPlantNucleus(THREE, materials, pickables, animationItems) {
  const group = new THREE.Group();
  const outerRadius = 3.18;
  const innerRadius = 2.94;
  const poreDirections = animalCellNuclearPoreDirections(THREE, 36);
  const poreOpenings = poreDirections.map((direction) => ({ dir: direction, angle: 0.082 }));

  const outerMembrane = new THREE.Mesh(
    animalCellSphereWithOpeningsGeometry(THREE, outerRadius, poreOpenings, 108, 60),
    materials.nucleus,
  );
  const innerMembrane = new THREE.Mesh(
    animalCellSphereWithOpeningsGeometry(THREE, innerRadius, poreOpenings, 108, 60),
    materials.nuclearEnvelope,
  );
  group.add(outerMembrane);
  group.add(innerMembrane);
  animalCellRegisterPickable(outerMembrane, pickables, "nuclearEnvelope");
  animalCellRegisterPickable(innerMembrane, pickables, "nuclearEnvelope");

  const poreGroup = new THREE.Group();
  const zAxis = new THREE.Vector3(0, 0, 1);
  poreDirections.forEach((direction, index) => {
    const normal = direction.clone().normalize();
    const orientation = new THREE.Quaternion().setFromUnitVectors(zAxis, normal);
    const center = normal.clone().multiplyScalar((outerRadius + innerRadius) / 2);
    const poreLining = new THREE.Mesh(
      animalCellHollowCylinderGeometry(THREE, 0.245, 0.122, outerRadius - innerRadius + 0.24, 32, 2),
      materials.nuclearPore,
    );
    poreLining.position.copy(center);
    poreLining.quaternion.copy(orientation);
    poreLining.scale.setScalar(index % 3 === 0 ? 1.08 : 1);
    poreGroup.add(poreLining);
    animalCellRegisterPickable(poreLining, pickables, "nuclearPore");

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.048, 12, 44), materials.nuclearPore);
    ring.position.copy(normal.clone().multiplyScalar(outerRadius + 0.025));
    ring.quaternion.copy(orientation);
    ring.scale.setScalar(index % 3 === 0 ? 1.08 : 1);
    poreGroup.add(ring);
    animalCellRegisterPickable(ring, pickables, "nuclearPore");

    const basisA = Math.abs(normal.y) > 0.82
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(0, 1, 0);
    basisA.cross(normal).normalize();
    const basisB = normal.clone().cross(basisA).normalize();
    for (let lobeIndex = 0; lobeIndex < 8; lobeIndex += 1) {
      const angle = (lobeIndex / 8) * Math.PI * 2 + (index % 2) * 0.12;
      const lobeCenter = normal.clone().multiplyScalar(outerRadius + 0.045)
        .addScaledVector(basisA, Math.cos(angle) * 0.245)
        .addScaledVector(basisB, Math.sin(angle) * 0.245);
      const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.064, 14, 10), materials.nuclearPore);
      lobe.position.copy(lobeCenter);
      lobe.scale.set(1.08, 0.92, 0.84);
      lobe.quaternion.copy(orientation);
      poreGroup.add(lobe);
      animalCellRegisterPickable(lobe, pickables, "nuclearPore");
    }
  });
  group.add(poreGroup);

  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.72, 44, 30), materials.nucleolus);
  nucleolus.position.set(0.55, 0.18, 0.34);
  nucleolus.scale.set(1.12, 0.96, 1.02);
  group.add(nucleolus);
  animalCellRegisterPickable(nucleolus, pickables, "nucleolus");

  const nucleolusHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 10), materials.nuclearEnvelope);
  nucleolusHighlight.position.set(0.22, 0.36, 0.84);
  nucleolusHighlight.scale.set(1.55, 0.72, 0.5);
  group.add(nucleolusHighlight);

  const chromatinGroup = new THREE.Group();
  const chromatinLayouts = [
    { p: [-0.95, 0.48, 0.28], s: 0.55, r: [0.16, 0.28, -0.22] },
    { p: [0.92, -0.5, -0.38], s: 0.54, r: [-0.38, -0.58, 0.34] },
    { p: [0.06, 0.08, 0.92], s: 0.5, r: [0.42, 0.94, -0.58] },
  ];
  chromatinLayouts.forEach((layout, layoutIndex) => {
    const strandA = [];
    const strandB = [];
    for (let i = 0; i <= 600; i += 1) {
      const t = i / 600;
      const openT = 0.08 + t * 4.2;
      const pathAngle = -0.7 + openT * Math.PI * 2.12 + layoutIndex * 0.31;
      const seed = layoutIndex * 0.73;
      const radiusX = 1.58 + Math.sin(openT * Math.PI * 0.9 + seed) * 0.28 + Math.sin(openT * Math.PI * 2.25) * 0.12;
      const radiusZ = 1.28 + Math.cos(openT * Math.PI * 0.7 + seed) * 0.24;
      const center = new THREE.Vector3(
        Math.cos(pathAngle) * radiusX - 0.2 + Math.sin(openT * Math.PI * 1.7 + seed) * 0.24,
        Math.sin(openT * Math.PI * 2.45 + seed) * 0.5 + Math.cos(openT * Math.PI * 0.65 + seed) * 0.22 - 0.08,
        Math.sin(pathAngle) * radiusZ + Math.cos(openT * Math.PI * 1.4 + seed) * 0.22,
      );
      const helixAngle = openT * Math.PI * 22 + layoutIndex * 0.48;
      const offset = new THREE.Vector3(0, Math.cos(helixAngle) * 0.105, Math.sin(helixAngle) * 0.105);
      strandA.push(center.clone().add(offset));
      strandB.push(center.clone().sub(offset));
    }
    const dna = new THREE.Group();
    dna.position.set(layout.p[0] * 0.76, layout.p[1] * 0.76, layout.p[2] * 0.76);
    dna.rotation.set(layout.r[0], layout.r[1], layout.r[2]);
    dna.scale.setScalar(layout.s * 1.58);
    const chromatinA = animalCellPolylineTube(THREE, strandA, 0.035, materials.nuclearChromatin, false, 260);
    const chromatinB = animalCellPolylineTube(THREE, strandB, 0.035, materials.nuclearChromatin, false, 260);
    dna.add(chromatinA);
    dna.add(chromatinB);
    for (let i = 8; i < strandA.length; i += 42) {
      const bridge = animalCellPolylineTube(THREE, [strandA[i], strandB[i]], 0.012, materials.nuclearChromatin, false, 3);
      dna.add(bridge);
    }
    chromatinGroup.add(dna);
  });
  group.add(chromatinGroup);
  animalCellRegisterPickable(chromatinGroup, pickables, "nucleus");

  animationItems.push({ type: "organelleDrift", group, seed: 2.1, amplitude: 0.08 });
  return group;
}

function createPlantEndoplasmicReticulum(THREE, materials, pickables, animationItems) {
  return createPlantErCisternaeSystem(THREE, materials, pickables, animationItems, { includeNucleus: false, scale: 0.92 });
}

function createPlantGolgi(THREE, materials, pickables, animationItems) {
  return createPlantGolgiStack(THREE, materials, pickables, animationItems, 1.65);
}

function createPlantVacuole(THREE, materials, pickables, animationItems) {
  const group = new THREE.Group();
  const geometry = animalCellRoundedCuboidGeometry(THREE, 4.4, 2.35, 6.25, 0.68, 112, 56);
  const membrane = new THREE.Mesh(geometry, materials.vacuole);
  group.rotation.set(0.015, 0, -0.01);
  group.add(membrane);
  animalCellRegisterPickable(group, pickables, "vacuole");
  animationItems.push({ type: "organelleDrift", group, seed: 8.8, amplitude: 0.06 });
  return group;
}

function createPlantMitochondrion(THREE, materials, pickables, animationItems, scale = 1) {
  const group = createPlantSoloMitochondrion(THREE, materials, pickables, animationItems, scale);
  animationItems.push({ type: "organelleDrift", group, seed: 9.7 + scale, amplitude: 0.08 * scale });
  return group;
}

function createPlantChloroplast(THREE, materials, pickables, animationItems, scale = 1) {
  const group = new THREE.Group();
  const makeEnvelope = (radii, material, label) => {
    const envelope = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 36), material);
    envelope.scale.set(radii.x * scale, radii.y * scale, radii.z * scale);
    envelope.userData.plantPart = "chloroplast";
    envelope.userData.structureLabel = label;
    group.add(envelope);
    animalCellRegisterPickable(envelope, pickables, "chloroplast");
    return envelope;
  };

  makeEnvelope({ x: 4.75, y: 1.48, z: 2.58 }, materials.chloroplast, "outerEnvelope");
  makeEnvelope({ x: 4.42, y: 1.28, z: 2.36 }, materials.chloroplastInner, "innerEnvelope");

  const granumCenters = [
    { x: -2.75, y: -0.12, z: -0.82, rx: 0.68, rz: 0.48 },
    { x: -1.22, y: 0.08, z: 0.62, rx: 0.62, rz: 0.44 },
    { x: 0.28, y: -0.06, z: -0.18, rx: 0.7, rz: 0.5 },
    { x: 1.68, y: 0.12, z: 0.78, rx: 0.63, rz: 0.46 },
    { x: 2.72, y: -0.08, z: -0.62, rx: 0.66, rz: 0.48 },
  ];

  granumCenters.forEach((center, stackIndex) => {
    for (let i = 0; i < 10; i += 1) {
      const disk = new THREE.Mesh(
        animalCellRoundedDiskGeometry(THREE, center.rx * scale, center.rz * scale, 0.12 * scale, 56),
        materials.thylakoid,
      );
      disk.position.set(center.x * scale, (center.y - 0.52 + i * 0.115) * scale, center.z * scale);
      disk.rotation.y = (stackIndex % 2 ? -0.08 : 0.08) + Math.sin(i * 0.73 + stackIndex) * 0.018;
      group.add(disk);
      animalCellRegisterPickable(disk, pickables, "chloroplast");
    }
  });

  const connectGrana = (fromIndex, toIndex, layer, bend = 0.18, penetration = 0.48) => {
    const from = granumCenters[fromIndex];
    const to = granumCenters[toIndex];
    const start = new THREE.Vector3(from.x, layer, from.z);
    const end = new THREE.Vector3(to.x, layer + Math.sin(fromIndex + toIndex) * 0.08, to.z);
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z).normalize();
    start.addScaledVector(direction, penetration);
    end.addScaledVector(direction, -penetration);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += bend;
    mid.z += Math.sin(fromIndex * 1.9 + toIndex) * 0.18;
    const scaledPoints = [start, mid, end].map((point) => point.clone().multiplyScalar(scale));
    const lamella = animalCellPolylineTube(
      THREE,
      scaledPoints,
      0.14 * scale,
      materials.thylakoid,
      false,
      42,
    );
    group.add(lamella);
    animalCellRegisterPickable(lamella, pickables, "chloroplast");
  };

  connectGrana(0, 1, -0.02, 0.16);
  connectGrana(1, 2, 0.24, 0.08);
  connectGrana(2, 3, -0.12, 0.18);
  connectGrana(3, 4, 0.12, 0.1);
  connectGrana(0, 2, 0.34, 0.035, 0.18);
  connectGrana(2, 4, 0.32, 0.04, 0.18);

  const ribosomePositions = [
    [-3.24, 0.36, 0.72], [-2.78, -0.5, 1.12], [-2.08, 0.58, -1.26], [-1.76, -0.66, -0.12],
    [-0.86, 0.68, 1.22], [-0.42, -0.72, -1.04], [0.46, 0.62, -1.22], [0.82, -0.58, 1.12],
    [1.38, 0.7, -0.96], [1.96, -0.64, 1.1], [2.48, 0.5, -1.18], [3.0, -0.4, 0.58],
    [-3.2, 0.0, -0.28], [-1.18, -0.18, 1.42], [0.02, 0.34, 1.38], [1.7, -0.08, -1.42],
    [2.82, 0.14, 0.98], [0.18, -0.34, -1.55],
  ];
  ribosomePositions.forEach((position) => {
    const ribosome = new THREE.Mesh(new THREE.SphereGeometry(0.07 * scale, 14, 10), materials.chloroplastRibosome);
    ribosome.position.set(position[0] * scale, position[1] * scale, position[2] * scale);
    group.add(ribosome);
    animalCellRegisterPickable(ribosome, pickables, "chloroplast");
  });

  const addDnaLoop = (center, radiusX, radiusZ, y, tilt, seed) => {
    const points = [];
    for (let i = 0; i < 34; i += 1) {
      const t = (i / 34) * Math.PI * 2;
      const ripple = 1 + Math.sin(t * 3 + seed) * 0.08;
      const x = center.x + Math.cos(t) * radiusX * ripple;
      const z = center.z + Math.sin(t) * radiusZ * (1 + Math.cos(t * 2 + seed) * 0.06);
      points.push(new THREE.Vector3(x * scale, (y + Math.sin(t + seed) * 0.045) * scale, z * scale));
    }
    const dna = animalCellPolylineTube(THREE, points, 0.035 * scale, materials.chloroplastDNA, true, 72);
    dna.rotation.y = tilt;
    group.add(dna);
    animalCellRegisterPickable(dna, pickables, "chloroplast");
  };
  addDnaLoop({ x: -2.65, z: 1.18 }, 0.44, 0.2, -0.28, 0.08, 1.1);
  addDnaLoop({ x: 0.52, z: -1.42 }, 0.54, 0.24, -0.34, -0.05, 2.4);
  addDnaLoop({ x: 2.72, z: 1.08 }, 0.42, 0.18, -0.2, 0.12, 3.2);

  animationItems.push({ type: "organelleDrift", group, seed: 10.4 + scale, amplitude: 0.1 * scale });
  return group;
}

function addPlantSmallOrganelles(THREE, group, materials, pickables, animationItems) {
  const organelles = [
    { type: "peroxisome", pos: [23.8, -5.9, 7.8], r: 0.58, mat: materials.peroxisome },
    { type: "peroxisome", pos: [-22.6, -5.95, 3.8], r: 0.5, mat: materials.peroxisome },
    { type: "peroxisome", pos: [0.6, -5.85, 10.8], r: 0.46, mat: materials.peroxisome },
    { type: "vesicle", pos: [8.2, -5.7, -10.5], r: 0.42, mat: materials.vesicle },
    { type: "vesicle", pos: [17.4, -5.65, -16.2], r: 0.36, mat: materials.vesicle },
    { type: "vesicle", pos: [-11.6, -5.6, -14.2], r: 0.38, mat: materials.vesicle },
    { type: "vesicle", pos: [23.2, -4.3, 13.0], r: 0.34, mat: materials.vesicle },
    { type: "vesicle", pos: [-5.4, -4.7, 17.1], r: 0.34, mat: materials.vesicle },
  ];
  organelles.forEach((item, index) => {
    const mesh = new THREE.Mesh(membraneOrganicBlobGeometry(THREE, item.r, item.r * 0.82, item.r * 0.9, 62 + index, { surfaceStrength: 0.018 }), item.mat);
    mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
    group.add(mesh);
    animalCellRegisterPickable(mesh, pickables, item.type);
    animationItems.push({ type: "vesicle", group: mesh, base: mesh.position.clone(), seed: 12.2 + index, amplitude: item.type === "vesicle" ? 0.34 : 0.12 });
  });
}

function addPlantCytoplasmParticles(THREE, group, materials, pickables, animationItems) {
  const cytoplasmShape = animalCellHexFootprint(32.6, 18.8);
  const pointInPolygon = (x, z, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const pi = polygon[i];
      const pj = polygon[j];
      const intersects = ((pi.z > z) !== (pj.z > z))
        && (x < ((pj.x - pi.x) * (z - pi.z)) / (pj.z - pi.z || 0.0001) + pi.x);
      if (intersects) inside = !inside;
    }
    return inside;
  };
  const inEllipse = (x, z, exclusion) => {
    const dx = (x - exclusion.x) / exclusion.rx;
    const dz = (z - exclusion.z) / exclusion.rz;
    return dx * dx + dz * dz < 1;
  };
  const exclusions = [
    { x: -11.15, z: 0.9, rx: 16.2, rz: 14.4 },
    { x: 12.6, z: 0.9, rx: 10.6, rz: 10.0 },
    { x: -28.0, z: 13.6, rx: 5.1, rz: 3.8 },
    { x: 26.6, z: 13.2, rx: 5.1, rz: 3.8 },
    { x: -28.0, z: -13.7, rx: 5.1, rz: 3.8 },
    { x: 4.6, z: -15.1, rx: 5.1, rz: 3.8 },
    { x: 24.8, z: -13.6, rx: 5.1, rz: 3.8 },
    { x: 17.0, z: 16.2, rx: 4.5, rz: 3.5 },
    { x: 30.4, z: -0.4, rx: 4.2, rz: 4.2 },
    { x: 11.0, z: -11.0, rx: 4.5, rz: 3.6 },
    { x: 23.8, z: 7.8, rx: 1.5, rz: 1.5 },
    { x: -22.6, z: 3.8, rx: 1.4, rz: 1.4 },
    { x: 0.6, z: 10.8, rx: 1.3, rz: 1.3 },
    { x: 8.2, z: -10.5, rx: 1.3, rz: 1.3 },
    { x: 17.4, z: -16.2, rx: 1.2, rz: 1.2 },
    { x: -11.6, z: -14.2, rx: 1.2, rz: 1.2 },
    { x: 23.2, z: 13.0, rx: 1.2, rz: 1.2 },
    { x: -5.4, z: 17.1, rx: 1.2, rz: 1.2 },
  ];
  [
    [-30.8, 4.2], [-30.4, -6.1], [-19.5, 17.2], [-19.8, -18.9],
    [-5.2, 16.3], [-8.1, -19.4], [1.1, -19.4], [3.8, -18.1],
    [16.5, -18.2], [12.8, 18.2], [24.2, 18.0], [30.8, 9.2],
    [32.4, 5.9], [31.9, -6.2], [31.0, -12.2], [20.6, -18.4],
  ].forEach(([x, z]) => exclusions.push({ x, z, rx: 2.4, rz: 1.7 }));

  const random01 = (seed) => {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  const positions = [];
  for (let index = 0; index < 520 && positions.length < 20; index += 1) {
    const x = -31.0 + random01(index + 1.37) * 62.0;
    const z = -18.0 + random01(index + 9.91) * 36.0;
    if (!pointInPolygon(x, z, cytoplasmShape)) continue;
    if (exclusions.some((exclusion) => inEllipse(x, z, exclusion))) continue;
    if (positions.some((position) => Math.hypot(position.x - x, position.z - z) < 2.2)) continue;
    positions.push({
      x,
      y: -5.6 + (random01(index + 15.2) - 0.5) * 1.1,
      z,
      radius: 0.168 + (random01(index + 24.8) - 0.5) * 0.018,
    });
  }

  const ribosomeMaterial = materials.chloroplastRibosome;
  positions.forEach((position, index) => {
    const ribosome = new THREE.Mesh(new THREE.SphereGeometry(position.radius, 14, 10), ribosomeMaterial);
    ribosome.position.set(position.x, position.y, position.z);
    ribosome.scale.set(1.08, 0.96, 1.02);
    group.add(ribosome);
    animalCellRegisterPickable(ribosome, pickables, "ribosome");
    animationItems.push({
      type: "cytoplasmParticle",
      group: ribosome,
      base: ribosome.position.clone(),
      seed: 40 + index * 1.73,
      amplitude: 0.045,
    });
  });
}

function animalCellRegisterPickable(object, pickables, part) {
  object.traverse?.((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData = { ...child.userData, plantPart: child.userData.plantPart || part };
      pickables.push(child);
    }
  });
  if (!object.traverse && (object.isMesh || object.isSprite)) {
    object.userData = { ...object.userData, plantPart: object.userData.plantPart || part };
    pickables.push(object);
  }
}

function animalCellStreamingPath(THREE, lane) {
  animalCellStreamingPath.cache ||= new Map();
  if (animalCellStreamingPath.cache.has(lane)) return animalCellStreamingPath.cache.get(lane);
  const centerX = 0.725;
  const centerY = -5.9;
  const centerZ = 0.9;
  const laneSettings = {
    mitochondrion: {
      corridorPosition: 0.34,
      longRadius: 1.72,
      shortRadius: 0.78,
      halfHeight: 0.78,
      clearance: 0.34,
      bypassDirection: 1,
    },
    chloroplast: {
      corridorPosition: 0.78,
      longRadius: 4.36,
      shortRadius: 2.46,
      halfHeight: 1.55,
      clearance: 0.38,
      bypassDirection: 1,
    },
    golgi: {
      corridorPosition: 0.58,
      longRadius: 2.78,
      shortRadius: 2.64,
      halfHeight: 2.12,
      clearance: 0.4,
      bypassDirection: -1,
    },
  };
  const settings = laneSettings[lane] || laneSettings.chloroplast;
  const {
    corridorPosition,
    longRadius,
    shortRadius,
    halfHeight,
    clearance,
    bypassDirection,
  } = settings;
  // The cell shell is a hexagonal face extruded along Z.  The former path treated
  // X/Z as a hexagon, which made the raised path leave the real X/Y wall at both
  // lateral tips.  These values match the cytoplasm shell used above.
  const cell = {
    halfWidth: 33.4,
    shoulderWidth: 21.78,
    halfHeight: 13.7,
    halfDepth: 20.3,
  };
  const worldExtentsAt = (angle) => {
    const tangent = angle + Math.PI / 2;
    const cos = Math.cos(tangent);
    const sin = Math.sin(tangent);
    return {
      x: Math.hypot(longRadius * cos, shortRadius * sin),
      z: Math.hypot(longRadius * sin, shortRadius * cos),
    };
  };
  const outerRadiusAt = (angle, y, extents) => {
    const verticalReach = Math.abs(y - centerY) + halfHeight + clearance;
    if (verticalReach >= cell.halfHeight) return 0;
    const xLimitAtHeight = cell.halfWidth
      - (cell.halfWidth - cell.shoulderWidth) * (verticalReach / cell.halfHeight);
    const xLimit = Math.max(0, xLimitAtHeight - extents.x - clearance);
    const zLimit = Math.max(0, cell.halfDepth - extents.z - clearance);
    const directionX = Math.cos(angle);
    const directionZ = Math.sin(angle);
    let radius = Infinity;
    if (directionX > 0.0001) radius = Math.min(radius, (xLimit - centerX) / directionX);
    if (directionX < -0.0001) radius = Math.min(radius, (-xLimit - centerX) / directionX);
    if (directionZ > 0.0001) radius = Math.min(radius, (zLimit - centerZ) / directionZ);
    if (directionZ < -0.0001) radius = Math.min(radius, (-zLimit - centerZ) / directionZ);
    return Math.max(0, radius);
  };
  const pointInsideCentralOrganelles = (x, y, z, extents, projected = false) => {
    const vacuoleExponent = 4.762;
    const vacuoleYTerm = projected
      ? 0
      : Math.abs((y + 5.55) / (8.46 + halfHeight + clearance)) ** vacuoleExponent;
    const inVacuole = (
      Math.abs((x + 11.15) / (15.35 + extents.x + clearance)) ** vacuoleExponent
      + vacuoleYTerm
      + Math.abs((z - 0.9) / (15.3 + extents.z + clearance)) ** vacuoleExponent
    ) <= 1;
    // The nucleus and ER must always be skirted in projection.  Only the broad
    // vacuole uses a short upper/lower bypass where the flat cytoplasm corridor
    // becomes narrower than the moving organelle.
    const inNucleusAndEr = (
      ((x - 12.6) / (9.2 + extents.x + clearance)) ** 2
      + ((z - 0.9) / (8.7 + extents.z + clearance)) ** 2
    ) <= 1;
    return inVacuole || inNucleusAndEr;
  };
  const innerRadiusAt = (angle, y, extents, outerRadius, projected = false) => {
    const directionX = Math.cos(angle);
    const directionZ = Math.sin(angle);
    let innerRadius = 0;
    for (let radius = 0; radius <= outerRadius; radius += 0.08) {
      const x = centerX + directionX * radius;
      const z = centerZ + directionZ * radius;
      if (pointInsideCentralOrganelles(x, y, z, extents, projected)) innerRadius = radius;
    }
    return innerRadius;
  };
  const pointCount = 128;
  const pathSamples = [];
  for (let index = 0; index < pointCount; index += 1) {
    const angle = (index / pointCount) * Math.PI * 2;
    const extents = worldExtentsAt(angle);
    // One closed curve must not change directly from the upper bypass to the
    // lower bypass.  Keeping a lane on one side makes every detour return to the
    // central layer before another vertical transition can begin.
    const preferredVerticalDirection = bypassDirection;
    const maxPreferredDelta = cell.halfHeight - halfHeight - clearance;
    let selected = null;
    let best = null;
    const tryDirection = (verticalDirection) => {
      for (let delta = 0; delta <= maxPreferredDelta + 0.001; delta += 0.16) {
        if (delta > 0 && verticalDirection === 0) break;
        const y = centerY + delta * verticalDirection;
        const outerRadius = outerRadiusAt(angle, y, extents);
        if (outerRadius <= 0) continue;
        const innerRadius = innerRadiusAt(angle, y, extents, outerRadius, false);
        const gap = outerRadius - innerRadius;
        if (!best || gap > best.gap) best = { y, outerRadius, innerRadius, gap };
        if (gap >= 0.28) return { y, outerRadius, innerRadius, gap };
      }
      return null;
    };
    selected = tryDirection(preferredVerticalDirection);
    if (!selected) selected = best;
    const projectedOuter = outerRadiusAt(angle, centerY, extents);
    const projectedInner = innerRadiusAt(angle, centerY, extents, projectedOuter, true);
    const visualInner = Math.min(selected.outerRadius, projectedInner * 0.965);
    const usableInner = Math.max(selected.innerRadius, visualInner);
    const pathRadius = usableInner + Math.max(0, selected.outerRadius - usableInner) * corridorPosition;
    pathSamples.push({ angle, y: selected.y, radius: pathRadius });
  }
  // Build the smallest closed height envelope that preserves every required
  // bypass but limits the vertical slope between neighboring samples.  This
  // prevents Catmull-Rom from turning a height discontinuity into a vertical
  // chord through the vacuole.
  const maxVerticalStep = 0.42;
  const verticalOffsets = pathSamples.map((sample) => Math.max(0, (sample.y - centerY) * bypassDirection));
  for (let pass = 0; pass < pointCount; pass += 1) {
    let changed = false;
    for (let index = 0; index < pointCount; index += 1) {
      const next = (index + 1) % pointCount;
      const nextFloor = Math.max(0, verticalOffsets[index] - maxVerticalStep);
      if (verticalOffsets[next] < nextFloor) {
        verticalOffsets[next] = nextFloor;
        changed = true;
      }
      const currentFloor = Math.max(0, verticalOffsets[next] - maxVerticalStep);
      if (verticalOffsets[index] < currentFloor) {
        verticalOffsets[index] = currentFloor;
        changed = true;
      }
    }
    if (!changed) break;
  }
  pathSamples.forEach((sample, index) => {
    sample.y = centerY + verticalOffsets[index] * bypassDirection;
  });
  const points = pathSamples.map((sample) => {
    const extents = worldExtentsAt(sample.angle);
    const outerRadius = outerRadiusAt(sample.angle, sample.y, extents);
    const safeRadius = Math.min(sample.radius, outerRadius);
    const directionX = Math.cos(sample.angle);
    const directionZ = Math.sin(sample.angle);
    return new THREE.Vector3(
      centerX + directionX * safeRadius,
      sample.y,
      centerZ + directionZ * safeRadius,
    );
  });
  const curve = new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
  animalCellStreamingPath.cache.set(lane, curve);
  return curve;
}

function nearestAnimalCellPathProgress(curve, position) {
  let nearestProgress = 0;
  let nearestDistance = Infinity;
  const sample = curve.points[0].clone();
  for (let index = 0; index < 720; index += 1) {
    const progress = index / 720;
    curve.getPointAt(progress, sample);
    const dx = position.x - sample.x;
    const dz = position.z - sample.z;
    const distance = dx * dx + dz * dz;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestProgress = progress;
    }
  }
  return nearestProgress;
}

function registerAnimalCellClockwiseOrbit(THREE, animationItems, group, seed, lane) {
  const centerX = 0.725;
  const centerZ = 0.9;
  const curve = animalCellStreamingPath(THREE, lane);
  const initialPosition = group.position.clone();
  const initialProgress = nearestAnimalCellPathProgress(curve, initialPosition);
  const initialInwardAngle = Math.atan2(centerX - group.position.x, centerZ - group.position.z);
  const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
  const directGap = Math.abs(normalizeAngle(group.rotation.y - initialInwardAngle));
  const flippedGap = Math.abs(normalizeAngle(group.rotation.y - initialInwardAngle - Math.PI));
  const facingFlip = directGap <= flippedGap ? 0 : Math.PI;
  group.userData.animalCellOrbitManaged = true;
  animationItems.push({
    type: "organelleOrbit",
    group,
    centerX,
    centerZ,
    curve,
    progress: initialProgress,
    initialPosition,
    pathPoint: new THREE.Vector3(),
    baseY: group.position.y,
    baseRotation: group.rotation.clone(),
    facingFlip,
    lastFacingY: null,
    lastTime: null,
    elapsed: 0,
    verticalTransitionDuration: 0.65,
    lateralTransitionDuration: 0.85,
    seed,
  });
}

function updateAnimalCellAnimations(THREE, animationItems, time, speed) {
  const motion = time * (0.16 + speed * 0.42);
  animationItems.forEach((item) => {
    if (item.type === "vesicle") {
      item.group.position.x = item.base.x + Math.sin(motion * 1.1 + item.seed) * item.amplitude;
      item.group.position.y = item.base.y + Math.cos(motion * 0.82 + item.seed * 0.7) * item.amplitude * 0.32;
      item.group.position.z = item.base.z + Math.cos(motion * 0.94 + item.seed) * item.amplitude * 0.72;
      item.group.rotation.y += 0.004 * speed;
    }
    if (item.type === "cytoplasmParticle") {
      item.group.position.x = item.base.x + Math.sin(motion * 0.8 + item.seed) * item.amplitude;
      item.group.position.z = item.base.z + Math.cos(motion * 0.75 + item.seed * 1.2) * item.amplitude;
    }
    if (item.type === "softSway") {
      if (item.preserveRotation) {
        if (!item.baseRotation) item.baseRotation = item.group.rotation.clone();
        item.group.rotation.y = item.baseRotation.y + Math.sin(motion * 0.42 + item.seed) * item.amplitude;
        item.group.rotation.z = item.baseRotation.z + Math.cos(motion * 0.36 + item.seed) * item.amplitude * 0.55;
      } else {
        item.group.rotation.y = Math.sin(motion * 0.42 + item.seed) * item.amplitude;
        item.group.rotation.z = Math.cos(motion * 0.36 + item.seed) * item.amplitude * 0.55;
      }
    }
    if (item.type === "organelleDrift" && !item.group.userData.animalCellOrbitManaged) {
      if (!item.base) item.base = item.group.position.clone();
      if (!item.baseRotation) item.baseRotation = item.group.rotation.clone();
      item.group.position.x = item.base.x + Math.sin(motion * 0.22 + item.seed) * item.amplitude;
      item.group.position.z = item.base.z + Math.cos(motion * 0.19 + item.seed * 1.3) * item.amplitude * 0.65;
      item.group.rotation.x = item.baseRotation.x;
      item.group.rotation.y = item.baseRotation.y + Math.sin(motion * 0.28 + item.seed) * item.amplitude;
      item.group.rotation.z = item.baseRotation.z;
    }
    if (item.type === "organelleOrbit") {
      const deltaTime = item.lastTime === null ? 0 : Math.max(0, Math.min(0.05, time - item.lastTime));
      item.lastTime = time;
      item.elapsed += deltaTime;
      item.progress = (item.progress + deltaTime * (0.014 + speed * 0.01)) % 1;
      item.curve.getPointAt(item.progress, item.pathPoint);
      const verticalTransition = Math.min(1, item.elapsed / item.verticalTransitionDuration);
      const verticalBlend = verticalTransition * verticalTransition * (3 - 2 * verticalTransition);
      const lateralTransition = Math.min(1, Math.max(0, (item.elapsed - item.verticalTransitionDuration) / item.lateralTransitionDuration));
      const lateralBlend = lateralTransition * lateralTransition * (3 - 2 * lateralTransition);
      const x = THREE.MathUtils.lerp(item.initialPosition.x, item.pathPoint.x, lateralBlend);
      const y = THREE.MathUtils.lerp(item.initialPosition.y, item.pathPoint.y, verticalBlend);
      const z = THREE.MathUtils.lerp(item.initialPosition.z, item.pathPoint.z, lateralBlend);
      const initialBob = Math.sin(item.seed);
      const bob = (Math.sin(item.elapsed * 0.72 + item.seed) - initialBob) * 0.045;
      item.group.position.set(x, y + bob, z);

      const inwardAngle = Math.atan2(item.centerX - x, item.centerZ - z) + item.facingFlip;
      if (item.lastFacingY === null) item.lastFacingY = inwardAngle;
      const facingDelta = Math.atan2(Math.sin(inwardAngle - item.lastFacingY), Math.cos(inwardAngle - item.lastFacingY));
      item.lastFacingY += facingDelta;
      item.group.rotation.set(item.baseRotation.x, item.lastFacingY, item.baseRotation.z);
    }
  });
}

function applyAnimalCellStageFocus(partGroups) {
  // Start each focus pass from the authored transparency, as a fresh 2.1.0
  // scene did. Preserve the original within-pass ribosome override ordering.
  partGroups.forEach(group => group.traverse(child => {
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach(material => {
      if (material?.userData.plantBaseTransparent !== undefined &&
          material.transparent !== material.userData.plantBaseTransparent) {
        material.transparent = material.userData.plantBaseTransparent;
        material.needsUpdate = true;
      }
    });
  }));
  const selectedPart = state.animalCellSoloPart || "all";
  if (selectedPart !== "all") {
    partGroups.forEach((group, part) => {
      const isFocused = part === selectedPart;
      setAnimalCellGroupOpacity(group, isFocused ? 1 : 0.14);
    });
    if (selectedPart === "ribosome") {
      partGroups.forEach((group) => {
        group.traverse?.((child) => {
          if (child.userData?.plantPart === "ribosome") setAnimalCellObjectOpacity(child, 1);
        });
      });
    }
    return;
  }
  const focusMap = {
    1: ["membrane"],
    2: ["nucleus"],
    3: ["membrane", "nucleus", "er", "golgi", "mitochondrion", "lysosome"],
    4: ["mitochondrion"],
    5: ["nucleus", "er", "golgi", "small"],
    6: ["centrosome", "lysosome"],
  };
  const focusParts = focusMap[state.stageIndex] || [];
  partGroups.forEach((group, part) => {
    const opacity = focusParts.length === 0 || focusParts.includes(part) ? 1 : 0.2;
    setAnimalCellGroupOpacity(group, opacity);
  });
  if (state.stageIndex === 5) {
    partGroups.forEach((group) => {
      group.traverse?.((child) => {
        if (child.userData?.plantPart === "ribosome") setAnimalCellObjectOpacity(child, 1);
      });
    });
  }
}

function setAnimalCellGroupOpacity(group, opacity) {
  group.traverse?.((child) => {
    setAnimalCellObjectOpacity(child, opacity);
  });
}

function setAnimalCellObjectOpacity(object, opacity) {
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  materials.forEach((material) => {
    if (!material) return;
    if (material.userData.plantBaseOpacity === undefined) {
      material.userData.plantBaseOpacity = material.opacity ?? 1;
      material.userData.plantBaseTransparent = material.transparent;
    }
    const effectiveOpacity = material.userData.plantBaseOpacity * opacity;
    const transparent = effectiveOpacity < 0.985 || material.transparent;
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.opacity = effectiveOpacity;
    material.depthWrite = effectiveOpacity > 0.72 && !material.userData?.forceNoDepthWrite;
  });
}

function applyAnimalCellLockedRotation(plantRoot) {
  const rotation = state.animalCellWebglRotation || { x: 0, y: 0 };
  plantRoot.rotation.set(rotation.x, rotation.y, 0, "YXZ");
}

function applyAnimalCellWebglViewPreset(THREE, plantRoot, panRoot, camera) {
  if (state.animalCellWebglViewIndex !== state.viewIndex) {
    const preset = animalCellWebglViewPreset(THREE, state.viewIndex);
    state.animalCellWebglRotation = { ...preset.rotation };
    applyAnimalCellLockedRotation(plantRoot);
    state.animalCellWebglQuaternion = {
      x: plantRoot.quaternion.x,
      y: plantRoot.quaternion.y,
      z: plantRoot.quaternion.z,
      w: plantRoot.quaternion.w,
    };
    state.animalCellWebglZoom = preset.zoom;
    state.animalCellWebglPan = preset.pan || { x: 0, y: 0 };
    state.animalCellWebglViewIndex = state.viewIndex;
  }

  applyAnimalCellLockedRotation(plantRoot);
  panRoot.position.set(state.animalCellWebglPan.x, state.animalCellWebglPan.y, 0);
  camera.zoom = state.animalCellWebglZoom;
  camera.updateProjectionMatrix();
}

function animalCellWebglViewPreset(THREE, index) {
  const presets = [
    { theta: 0.66, phi: 1.08, zoom: 1.28, pan: { x: -1.2, y: 1.0 } },
    { theta: 0.92, phi: 1.18, zoom: 1.5, pan: { x: -6.4, y: 1.2 } },
    { theta: -0.04, phi: 1.55, zoom: 1.22, pan: { x: 0, y: 1.0 } },
    { theta: 0.42, phi: 0.12, zoom: 1.12, pan: { x: 0, y: 0.7 } },
    { theta: 0.62, phi: Math.PI - 0.13, zoom: 1.12, pan: { x: 0, y: -0.5 } },
  ];
  const selected = presets[index] || presets[0];
  const rotation = {
    x: selected.phi - Math.PI / 2,
    y: -selected.theta,
  };
  return {
    quaternion: dnaWebglQuaternionFromCamera(THREE, selected.theta, selected.phi),
    rotation,
    zoom: selected.zoom,
    pan: selected.pan,
  };
}

function dnaWebglQuaternionFromCamera(THREE, theta, phi) {
  const pitch = phi - Math.PI / 2;
  const matrix = new THREE.Matrix4().makeRotationY(-theta);
  matrix.premultiply(new THREE.Matrix4().makeRotationX(pitch));
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function disposeDnaWebglObject(object) {
  const geometries = new Set(), materialsSeen = new Set(), textures = new Set();
  object.traverse?.((child) => {
    if (child.geometry) geometries.add(child.geometry);
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      if (material.map) textures.add(material.map);
      materialsSeen.add(material);
    });
    if (child.userData?.texture) textures.add(child.userData.texture);
  });
  geometries.forEach(geometry => geometry.dispose());
  materialsSeen.forEach(material => material.dispose());
  textures.forEach(texture => texture.dispose());
}

function animalCellWebglVisual() {
  return `
    <div class="dna-webgl-stack membrane-webgl-stack animal-cell-stack">
      <div class="dna-3d-shell dna-webgl-shell membrane-webgl-shell animal-cell-shell" data-animal-cell-shell>
        <div class="dna-webgl-viewport-frame" data-animal-cell-viewport>
          <div class="dna-webgl-host" data-animal-cell-host></div>
          <div class="dna-webgl-labels" data-animal-cell-labels><svg class="animal-cell-label-lines" aria-hidden="true"></svg></div>
        </div>
        <div class="dna-webgl-loading" data-animal-cell-loading>正在加载 WebGL 动物细胞结构模型...</div>
      </div>
      <button class="shell-action animal-cell-context-trigger" type="button" data-animal-context>结构与说明 ↗</button>
      <p class="animal-cell-feedback" data-animal-cell-feedback aria-live="polite"></p>
      <aside class="animal-cell-part-switcher" data-animal-cell-part-switcher aria-label="细胞器聚焦">
        <div class="animal-cell-part-switcher__head">
          <div>
            <strong>细胞器聚焦</strong>
            <small>Organelle Focus</small>
          </div>
        </div>
        <p class="animal-cell-part-switcher__hint">点击按钮高亮对应结构，再次点击恢复完整模型。</p>
        <div class="animal-cell-part-switcher__buttons">
          ${ANIMAL_CELL_STRUCTURE_MODES.map((mode) => `
            <button class="animal-cell-part-button ${mode.id === state.animalCellSoloPart ? "is-active" : ""}" type="button" data-animal-cell-part-mode="${mode.id}" style="--part-color:${mode.color}" aria-pressed="${mode.id === state.animalCellSoloPart}">
              <strong>${mode.label}</strong>
              <span>${mode.labelEn}</span>
            </button>
          `).join("")}
        </div>
        <div class="animal-cell-part-switcher__current">
          <span>当前显示</span>
          <strong data-animal-cell-part-current>${plantPartModeLabelForVisual()}</strong>
        </div>
        <section class="animal-cell-stage-summary">
          <h2 data-animal-stage-title>${currentStage().title}</h2>
          <p data-animal-stage-description>${currentStage().explanation}</p>
        </section>
      </aside>
    </div>
  `;
}

function plantPartModeLabelForVisual() {
  return ANIMAL_CELL_STRUCTURE_MODES.find((mode) => mode.id === state.animalCellSoloPart)?.label || "完整细胞";
}

const ANDER_MODEL_ADAPTER = Object.freeze({
  id: "animal-cell",
  visual: () => animalCellWebglVisual(),
  mount: () => { mountAnimalCellWebgl(); },
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
  if (action === "fullscreen") return; // The shared experience owns both fullscreen modes.
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
window.addEventListener("pagehide", stopVisualRuntime);
window.addEventListener("pageshow", event => { if (event.persisted) render(); });

render();
function setAnimalSceneStatus(status){shellExperience?.setSceneStatus(status);}
function mountAnimalExperience(){
  if(shellExperience)return;
  const shell=globalThis.AnderModelShell;
  const openContext=trigger=>shellExperience.showPanel($('[data-animal-cell-part-switcher]'),'结构与说明',trigger);
  const help='<p>单指或鼠标左键拖动旋转；双指移动或鼠标右键拖动平移；双指捏合或滚轮缩放。点选结构或打开“结构与说明”可聚焦细胞器。</p><p>播放与速度控制沿用原模型；暂停后仍保留原有轻微背景运动。标签、高亮和视角在电脑底栏，手机点“观察”展开。重置回到第一阶段和默认观察状态。</p><p>全屏／沉浸时画面放大，上下控件在松手 2 秒后收起，轻触唤出；使用面板时保持显示。收藏服务由打开模型的网站提供，独立打开不会写入账户收藏。</p>';
  const openSettings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'还原视角',run:()=>{
    state.viewIndex=0;state.animalCellWebglViewIndex=-1;render();shellExperience.closeDialog();
  }}]);
  const onReturn=()=>{
    if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();
    else shellExperience.showDialog('独立模型预览','<p>当前独立打开动物细胞模型。关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);
  };
  shellExperience=shell.mountExperience({root:refs.modelArea,viewport:$('[data-animal-cell-viewport]'),title:'动物细胞',returnLabel:'返回目录',onReturn,
    host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,
    settingsLabel:'显示与操作',contextLabel:'结构与说明',onSettings:openSettings,onContext:openContext,hasContext:()=>true,helpContent:help,
    onDisplayChange:()=>requestAnimationFrame(()=>animalCellRuntime?.resize())});
  shell.setExtra($('[data-animal-settings]'),'settings','显示与操作');
  $('[data-animal-settings]').addEventListener('click',event=>openSettings(event.currentTarget));
  $('[data-animal-context]').addEventListener('click',event=>openContext(event.currentTarget));
  $('.independent-model-back').addEventListener('click',event=>{event.preventDefault();onReturn();});
  if(!animalCellRuntime)setAnimalSceneStatus('loading');
  globalThis.AnimalCellSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...cloneValue(state),shell:shellExperience.getState(),ready:!!animalCellRuntime})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAnimalExperience,{once:true});else mountAnimalExperience();
emitModelMessage("model:ready", { version: ANDER_MODEL_MANIFEST.version, capabilities: ANDER_MODEL_MANIFEST.capabilities });
