"use strict";

const ANDER_MODEL_CONTENT = {"id":"membrane","accent":"#10B981","title":"细胞膜流动镶嵌模型","titleEn":"Fluid Mosaic Model","chapter":"细胞的基本结构 / Cell Structure","type":"3D WebGL 动态模型","state":"结构与流动性观察","visual":"membraneFluidWebgl","structures":[["磷脂双分子层 Phospholipid Bilayer","#38BDF8"],["疏水尾部 Hydrophobic Tails","#93C5FD"],["贯穿膜蛋白 Integral Protein","#14B8A6"],["表面蛋白 Peripheral Protein","#8B5CF6"],["多糖链 Carbohydrate Chain","#EC4899"],["胆固醇 Cholesterol","#F8D67A"]],"stages":[{"title":"整体观察","titleEn":"Overview","goal":"认识细胞膜由磷脂双分子层、膜蛋白、多糖链和胆固醇等结构共同组成。","keywords":["流动镶嵌 Fluid Mosaic","磷脂双层 Bilayer","膜蛋白 Membrane Protein"],"explanation":"细胞膜以磷脂双分子层为基本支架，蛋白质像马赛克一样以不同方式镶嵌在膜中或附着在膜表面，外侧还可连接多糖链。","mistake":"细胞膜不是一层静止的硬壳，也不是只有磷脂；它是多种分子组成的动态结构。","question":"为什么细胞膜既能保持边界，又能进行物质交换？","id":"overview"},{"title":"磷脂双层","titleEn":"Bilayer","goal":"观察亲水头部和疏水尾部的排列方向。","keywords":["亲水 Hydrophilic","疏水 Hydrophobic","双分子层 Bilayer"],"explanation":"磷脂分子的亲水头部朝向水环境，疏水尾部相对排列在膜的内部。","mistake":"不要把头部和尾部的亲水、疏水性质弄反。","question":"为什么磷脂会自发形成双分子层？","id":"bilayer"},{"title":"膜蛋白","titleEn":"Membrane Proteins","goal":"区分表面蛋白、嵌入蛋白和贯穿膜蛋白，并观察复杂蛋白质外形。","keywords":["表面蛋白 Peripheral","嵌入蛋白 Embedded","贯穿蛋白 Integral"],"explanation":"膜蛋白不是简单几何形状，而是具有复杂空间结构。不同蛋白可以附着在膜表面、部分插入膜内，或贯穿整个磷脂双层。","mistake":"蛋白质不是均匀铺在膜表面，也不是都完全贯穿细胞膜。","question":"哪些物质可能需要借助膜蛋白通过细胞膜？","id":"proteins"},{"title":"多糖链","titleEn":"Carbohydrate Chains","goal":"观察细胞膜外侧糖蛋白和糖脂上的多糖链。","keywords":["糖蛋白 Glycoprotein","糖脂 Glycolipid","细胞识别 Cell Recognition"],"explanation":"多糖链通常位于细胞膜外侧，可以连接在蛋白质或脂质上，参与细胞识别、保护和信号交流。","mistake":"多糖链一般不朝向细胞内侧；它们主要分布在细胞外侧。","question":"为什么细胞表面的多糖链有助于细胞识别？","id":"carbohydrates"},{"title":"胆固醇","titleEn":"Cholesterol","goal":"观察胆固醇位于磷脂尾部之间，并调节膜的流动性。","keywords":["胆固醇 Cholesterol","流动性调节 Fluidity Control"],"explanation":"胆固醇分子插在磷脂尾部之间，可以影响磷脂分子的运动，使膜在不同温度下保持合适的稳定性和流动性。","mistake":"胆固醇不是漂在膜外表面，而是主要位于磷脂尾部之间。","question":"胆固醇为什么能影响细胞膜的流动性？","id":"cholesterol"},{"title":"流动性","titleEn":"Fluidity","goal":"观察磷脂、膜蛋白和多糖链在同一膜平面内的协调运动。","keywords":["流动性 Fluidity","侧向运动 Lateral Movement"],"explanation":"细胞膜中的磷脂和部分膜蛋白可以进行侧向运动，多糖链会随连接点摆动。流动性使细胞膜既稳定又灵活。","mistake":"流动性不等于结构完全松散；细胞膜仍然维持基本边界和双层排列。","question":"膜的流动性对细胞生命活动有什么意义？","id":"fluidity"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"membrane","version":"2.4.0","publish":true,"title":{"zh":"细胞膜流动镶嵌模型","en":"Fluid Mosaic Model"},"summary":{"zh":"观察磷脂双层、膜蛋白、糖链、胆固醇及细胞膜流动性。","en":"Explore the bilayer, proteins, carbohydrates, cholesterol and membrane fluidity."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"整体观察","en":"Overview"}},{"id":"bilayer","title":{"zh":"磷脂双层","en":"Bilayer"}},{"id":"proteins","title":{"zh":"膜蛋白","en":"Membrane Proteins"}},{"id":"carbohydrates","title":{"zh":"多糖链","en":"Carbohydrate Chains"}},{"id":"cholesterol","title":{"zh":"胆固醇","en":"Cholesterol"}},{"id":"fluidity","title":{"zh":"流动性","en":"Fluidity"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
const ANDER_MODEL_DEFAULT_STATE = {"modelId":"membrane","stageIndex":0,"playing":false,"speedIndex":1,"labels":true,"highlight":true,"practice":false,"viewIndex":0,"membraneSelected":"","membraneWebglQuaternion":{"x":0,"y":0,"z":0,"w":1},"membraneWebglZoom":1,"membraneWebglPan":{"x":0,"y":0},"membraneWebglViewIndex":-1,"membraneFlowSpeed":0.62,"membraneFlowAmplitude":0.72};
const speeds = [0.5, 1, 1.5, 2];
const views = ["整体视角", "局部视角", "侧面视角", "顶部视角", "底部视角"];
const state = cloneValue(ANDER_MODEL_DEFAULT_STATE);
const models = [ANDER_MODEL_CONTENT];
let dnaAnimationFrame = 0;
let dnaWebglAnimationFrame = 0;
let dnaWebglCleanup = null;
let threeModulePromise = null;
let threeLoadAttempt = 0;
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


const MEMBRANE_THREE_VIEW_SIZE = 92;
// Presentation bounds are identical across teaching stages; cache them separately
// from the rebuilt scientific objects and their animation state.
let membraneFramingCorners = null;

const MEMBRANE_PART_LABELS = {
  phospholipid: "磷脂双分子层 / Phospholipid Bilayer",
  lipidHead: "亲水头部 / Hydrophilic Head",
  lipidTail: "疏水尾部 / Hydrophobic Tail",
  protein: "膜蛋白 / Membrane Protein",
  integralProtein: "贯穿膜蛋白 / Integral Membrane Protein",
  peripheralProtein: "表面蛋白 / Peripheral Protein",
  embeddedProtein: "嵌入蛋白 / Embedded Protein",
  glycoprotein: "糖蛋白 / Glycoprotein",
  carbohydrate: "多糖链 / Carbohydrate Chain",
  cholesterol: "胆固醇 / Cholesterol",
  fluidity: "膜流动性 / Membrane Fluidity",
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DNA_THREE_URL = "./vendor/three.module.min.js";

function loadThreeForDna() {
  if (!threeModulePromise) {
    // A failed module URL is cached by the browser; an explicit retry needs a fresh local URL.
    threeModulePromise = import(threeLoadAttempt ? DNA_THREE_URL + '?retry=' + threeLoadAttempt : DNA_THREE_URL);
  }
  return threeModulePromise;
}

function mountMembraneFluidWebgl() {
  const shell = document.querySelector("[data-membrane-webgl-shell]");
  const host = document.querySelector("[data-membrane-webgl-host]");
  const labelsLayer = document.querySelector("[data-membrane-webgl-labels]");
  const feedback = document.querySelector("[data-membrane-webgl-feedback]");
  const loading = document.querySelector("[data-membrane-webgl-loading]");
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
      instanceCleanup = startMembraneFluidWebgl(THREE, shell, host, labelsLayer, feedback, loading);
      sceneRuntime.sync();shellExperience?.setSceneStatus('ready');
      emitModelMessage('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities});
    })
    .catch((error) => {
      threeModulePromise=null;threeLoadAttempt++;
      shellExperience?.setSceneStatus('error','三维画面未能加载，请重试。',()=>{stopVisualRuntime();host.replaceChildren();labelsLayer.replaceChildren();shellExperience.setSceneStatus('loading');mountMembraneFluidWebgl();});
      console.warn("Three.js failed to load for membrane", error);
      if (loading) {
        loading.hidden = true;
      }
    });
}

function startMembraneFluidWebgl(THREE, shell, host, labelsLayer, feedback, loading) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;
  renderer.domElement.className = "dna-webgl-canvas";
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL 细胞膜流动镶嵌模型");
  host.appendChild(renderer.domElement);
  if (loading) loading.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 520);
  camera.position.set(0, 0, 140);
  camera.lookAt(0, 0, 0);

  const panRoot = new THREE.Group();
  const membraneRoot = new THREE.Group();
  const modelGroup = new THREE.Group();
  scene.add(panRoot);
  panRoot.add(membraneRoot);
  membraneRoot.add(modelGroup);

  scene.add(new THREE.AmbientLight(0xffffff, 1.02));
  const hemi = new THREE.HemisphereLight(0xf8fbff, 0xfff0d8, 0.72);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.72);
  key.position.set(-6, 10, 12);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdff6ff, 0.86);
  fill.position.set(9, 3, 7);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.72);
  rim.position.set(0, -8, 9);
  scene.add(rim);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];
  const animationItems = [];
  const partGroups = new Map();
  let labelItems = [];
  const labelLeaders = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  labelLeaders.classList.add("membrane-label-leaders");
  labelLeaders.setAttribute("aria-hidden", "true");
  labelsLayer.appendChild(labelLeaders);
  let movedDuringDrag = false;
  let dragMode = "";
  let lastX = 0;
  let lastY = 0;
  const activePointers = new Map();
  let touchGesture = null;
  // A multi-finger session stays locked against rotation until every finger lifts.
  let multiTouchUsed = false;
  let gestureCancelled = false;

  applyMembraneWebglViewPreset(THREE, membraneRoot, panRoot, camera);
  const lockedRotation = { ...state.membraneWebglRotation };
  const viewport = shell.querySelector("[data-membrane-webgl-viewport]");
  let framingCorners = [];
  let fittedZoom = 1;
  const fittedPan = new THREE.Vector2();
  const viewportSize = { width: 1, height: 1 };

  // Fit cached geometry bounds, including the full carbohydrate chains and their
  // maximum sway. Resize never rewrites molecular positions or flow parameters.
  const fitCamera = (preserveObservation = false) => {
    if (!framingCorners.length) return;
    const bounds = new THREE.Box3();
    const projected = new THREE.Vector3();
    framingCorners.forEach(point => bounds.expandByPoint(projected.copy(point).applyQuaternion(membraneRoot.quaternion)));
    bounds.expandByScalar(5);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    fittedZoom = 0.9 * Math.min((camera.right - camera.left) / size.x, (camera.top - camera.bottom) / size.y);
    fittedPan.set(-center.x, -center.y);
    if (preserveObservation) {
      state.membraneViewScale = camera.zoom / fittedZoom;
      state.membraneViewOffset = { x: panRoot.position.x - fittedPan.x, y: panRoot.position.y - fittedPan.y };
      return;
    }
    const offset = state.membraneViewOffset || { x: 0, y: 0 };
    panRoot.position.set(fittedPan.x + offset.x, fittedPan.y + offset.y, 0);
    camera.zoom = fittedZoom * (state.membraneViewScale || 1);
    camera.updateProjectionMatrix();
    state.membraneWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.membraneWebglZoom = camera.zoom;
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    viewportSize.width = rect.width;
    viewportSize.height = rect.height;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = (-MEMBRANE_THREE_VIEW_SIZE * aspect) / 2;
    camera.right = (MEMBRANE_THREE_VIEW_SIZE * aspect) / 2;
    camera.top = MEMBRANE_THREE_VIEW_SIZE / 2;
    camera.bottom = -MEMBRANE_THREE_VIEW_SIZE / 2;
    camera.zoom = state.membraneWebglZoom;
    camera.updateProjectionMatrix();
    fitCamera();
  };

  const saveTransformState = () => {
    state.membraneWebglRotation = { x: lockedRotation.x, y: lockedRotation.y };
    state.membraneWebglQuaternion = {
      x: membraneRoot.quaternion.x,
      y: membraneRoot.quaternion.y,
      z: membraneRoot.quaternion.z,
      w: membraneRoot.quaternion.w,
    };
    state.membraneWebglPan = { x: panRoot.position.x, y: panRoot.position.y };
    state.membraneWebglZoom = camera.zoom;
    state.membraneViewScale = camera.zoom / fittedZoom;
    state.membraneViewOffset = { x: panRoot.position.x - fittedPan.x, y: panRoot.position.y - fittedPan.y };
  };

  const setFeedback = (text) => {
    if (feedback) feedback.textContent = text;
  };

  const addLabel = (text, position, color = "#0f172a", offset = { x: 0, y: -34 }) => {
    const anchor = new THREE.Object3D();
    anchor.position.copy(position);
    modelGroup.add(anchor);
    const el = document.createElement("div");
    el.className = "dna-webgl-label";
    el.textContent = text;
    el.style.setProperty("--label-color", color);
    labelsLayer.appendChild(el);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    labelLeaders.appendChild(line);
    const item = { anchor, el, line, offset, opacity: 1 };
    labelItems.push(item);
    return item;
  };

  const rebuild = () => {
    pickables.length = 0;
    animationItems.length = 0;
    partGroups.clear();
    labelItems.forEach((item) => { item.el.remove(); item.line.remove(); });
    labelItems = [];
    while (modelGroup.children.length) {
      const child = modelGroup.children.pop();
      disposeDnaWebglObject(child);
    }
    buildMembraneFluidModel(THREE, modelGroup, pickables, addLabel, animationItems, partGroups);
    applyMembraneStageFocus(partGroups);
    // Work in model coordinates, independent of the current observation angle.
    const rotation = membraneRoot.quaternion.clone();
    const pan = panRoot.position.clone();
    membraneRoot.quaternion.identity();
    panRoot.position.set(0, 0, 0);
    modelGroup.updateWorldMatrix(true, true);
    framingCorners = [];
    if (membraneFramingCorners) framingCorners = membraneFramingCorners;
    else modelGroup.traverse((object) => {
      if (!object.geometry) return;
      if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
      const bounds = object.geometry.boundingBox;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) framingCorners.push(new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld));
        }
      }
    });
    membraneFramingCorners = framingCorners;
    membraneRoot.quaternion.copy(rotation);
    panRoot.position.copy(pan);
    fitCamera();
  };

  const projectLabels = () => {
    camera.updateMatrixWorld(true);
    panRoot.updateMatrixWorld(true);
    membraneRoot.updateMatrixWorld(true);
    modelGroup.updateMatrixWorld(true);
    const rect = viewportSize;
    const compact = rect.height < 280;
    labelsLayer.classList.toggle("is-compact-labels", compact);
    const placed = [];
    const positions = labelItems.map((item) => {
      const world = new THREE.Vector3();
      item.anchor.getWorldPosition(world);
      const projected = world.project(camera);
      return { item, projected, anchorX: (projected.x * 0.5 + 0.5) * rect.width, anchorY: (-projected.y * 0.5 + 0.5) * rect.height };
    });
    if (compact) positions.sort((a, b) => a.anchorY - b.anchorY);
    positions.forEach(({item, projected, anchorX, anchorY}, order) => {
      let x = anchorX + (item.offset?.x || 0);
      let y = anchorY + (item.offset?.y || 0);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(projected.z)) {
        item.el.style.opacity = "0";
        item.line.style.opacity = "0";
        return;
      }
      const width = item.el.textContent.length * (compact ? 9 : 12) + 18;
      const height = compact ? 19 : 28;
      const visible = projected.z >= -1 && projected.z <= 1 && anchorX >= 0 && anchorX <= rect.width && anchorY >= 0 && anchorY <= rect.height;
      if (compact) {
        const side = order % 2 ? 1 : -1;
        x = rect.width / 2 + side * Math.max(88, rect.width * 0.32);
        y = 16 + Math.floor(order / 2) * (rect.height - 32) / Math.max(1, Math.ceil(positions.length / 2) - 1);
      }
      x = clamp(x, width / 2 + 4, rect.width - width / 2 - 4);
      y = clamp(y, height / 2 + 4, rect.height - height / 2 - 4);
      // In a full-height phone view keep labels near their anchors, but separate
      // intersecting text boxes. Short views use two columns around the model.
      if (!compact) {
        for (const previous of placed) {
          if (Math.abs(x - previous.x) < (width + previous.width) / 2 + 3 && Math.abs(y - previous.y) < height + 3) {
            y = previous.y + height + 4;
            if (y > rect.height - height / 2 - 4) y = previous.y - height - 4;
          }
        }
      }
      if (visible) placed.push({x, y, width});
      item.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      item.el.style.opacity = visible ? String(item.opacity ?? 1) : "0";
      item.line.setAttribute("x1", anchorX.toFixed(2));
      item.line.setAttribute("y1", anchorY.toFixed(2));
      item.line.setAttribute("x2", x.toFixed(2));
      item.line.setAttribute("y2", y.toFixed(2));
      item.line.style.opacity = visible && (compact || Math.abs(y - anchorY - (item.offset?.y || 0)) > 2) ? "1" : "0";
    });
  };

  const renderMembraneFrame = (time = performance.now() * 0.001) => {
    const playBoost = state.playing ? speeds[state.speedIndex] : 0.72;
    updateMembraneFluidAnimations(
      THREE,
      animationItems,
      time,
      (state.membraneFlowSpeed || 0.62) * playBoost,
      state.membraneFlowAmplitude || 0.72,
    );
    renderer.render(scene, camera);
    projectLabels();
  };

  const animate = () => {
    if (!document.body.contains(shell)) return;
    renderMembraneFrame();
    dnaWebglAnimationFrame = requestAnimationFrame(animate);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  rebuild();
  renderMembraneFrame();
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
    camera.zoom = clamp(zoom, fittedZoom * 0.55, fittedZoom * 5);
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
    viewport.setPointerCapture?.(event.pointerId);
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
      lockedRotation.x = clamp(lockedRotation.x + dy * 0.0072, -Math.PI / 2 + 0.03, Math.PI / 2 - 0.03);
      lockedRotation.y += dx * 0.0072;
      membraneRoot.rotation.set(lockedRotation.x, lockedRotation.y, 0, "XYZ");
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
      fitCamera(true);
      saveTransformState();
    }
    if (viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
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
    for (const id of ids) if (viewport.hasPointerCapture?.(id)) viewport.releasePointerCapture(id);
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
    const hit = hits.find((item) => item.object.userData?.membranePart);
    if (!hit) return;
    const part = hit.object.userData.membranePart;
    const label = MEMBRANE_PART_LABELS[part] || hit.object.userData.membraneLabel || "细胞膜结构";
    state.membraneSelected = `已选中：${label}`;
    setFeedback(state.membraneSelected);
  };

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", finishPointer);
  viewport.addEventListener("pointercancel", finishPointer);
  viewport.addEventListener("lostpointercapture", finishPointer);
  viewport.addEventListener("contextmenu", (event) => event.preventDefault());
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("click", onClick);
  window.addEventListener("blur", cancelPointers);
  window.addEventListener("pagehide", cancelPointers);
  document.addEventListener("visibilitychange", onGestureVisibilityChange);

  root.querySelector("[data-membrane-view-tools]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-membrane-view]");
    if (!button) return;
    const action = button.dataset.membraneView;
    if (action === "panel") {
      const panel = root.querySelector("[data-membrane-webgl-state-control]");
      shell.scrollTop += panel.getBoundingClientRect().top - shell.getBoundingClientRect().top - 38;
      return;
    }
    shell.scrollTop = 0;
    if (action === "fit") {
      state.membraneViewScale = 1;
      state.membraneViewOffset = { x: 0, y: 0 };
      fitCamera();
    } else setZoom(camera.zoom * (action === "in" ? 1.25 : 0.8));
  });

  const stateControl = root.querySelector("[data-membrane-webgl-state-control]");
  const flowInput = root.querySelector("[data-membrane-flow-speed]");
  const flowAmplitudeInput = root.querySelector("[data-membrane-flow-amplitude]");
  const flowValue = root.querySelector("[data-membrane-flow-value]");
  flowInput?.addEventListener("input", (event) => {
    state.membraneFlowSpeed = Number(event.target.value) / 100;
    if (flowValue) flowValue.textContent = `${Math.round(state.membraneFlowSpeed * 100)}%`;
    setFeedback(`膜流动速度：${Math.round(state.membraneFlowSpeed * 100)}%`);
  });
  flowAmplitudeInput?.addEventListener("input", (event) => {
    state.membraneFlowAmplitude = Number(event.target.value) / 100;
    root.querySelector('[data-membrane-amplitude-value]').textContent=Math.round(state.membraneFlowAmplitude*100)+'%';
    setFeedback(`膜流动幅度：${Math.round(state.membraneFlowAmplitude * 100)}%`);
  });

  sceneRuntime={resize,sync(){
    if(state.membraneWebglViewIndex!==state.viewIndex){applyMembraneWebglViewPreset(THREE,membraneRoot,panRoot,camera);Object.assign(lockedRotation,state.membraneWebglRotation);fitCamera();}
    applyMembraneStageFocus(partGroups);labelsLayer.hidden=!state.labels;
    flowInput.value=String(Math.round(state.membraneFlowSpeed*100));flowAmplitudeInput.value=String(Math.round(state.membraneFlowAmplitude*100));
    flowValue.textContent=flowInput.value+'%';root.querySelector('[data-membrane-amplitude-value]').textContent=flowAmplitudeInput.value+'%';
    setFeedback(state.membraneSelected||'');renderMembraneFrame();
  }};
  return () => {
    sceneRuntime=null;resizeObserver.disconnect();
    if (dnaWebglAnimationFrame) {
      cancelAnimationFrame(dnaWebglAnimationFrame);
      dnaWebglAnimationFrame = 0;
    }
    cancelPointers();
    window.removeEventListener("blur", cancelPointers);
    window.removeEventListener("pagehide", cancelPointers);
    document.removeEventListener("visibilitychange", onGestureVisibilityChange);
    viewport.removeEventListener("pointerdown", onPointerDown);
    viewport.removeEventListener("pointermove", onPointerMove);
    viewport.removeEventListener("pointerup", finishPointer);
    viewport.removeEventListener("pointercancel", finishPointer);
    viewport.removeEventListener("lostpointercapture", finishPointer);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("click", onClick);
    labelItems.forEach((item) => item.el.remove());
    labelLeaders.remove();
    disposeDnaWebglObject(scene);
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function membraneWebglMaterials(THREE) {
  const physical = (color, options = {}) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: options.roughness ?? 0.42,
      metalness: options.metalness ?? 0.02,
      clearcoat: options.clearcoat ?? 0.32,
      clearcoatRoughness: options.clearcoatRoughness ?? 0.42,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1,
      depthWrite: options.depthWrite ?? true,
      side: options.side ?? THREE.FrontSide,
    });
  const line = (color, options = {}) =>
    new THREE.LineBasicMaterial({
      color,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1,
    });
  return {
    waterTop: physical("#DDF6FF", { transparent: true, opacity: 0.24, depthWrite: false, roughness: 0.82, side: THREE.DoubleSide }),
    waterBottom: physical("#FFE7B8", { transparent: true, opacity: 0.2, depthWrite: false, roughness: 0.82, side: THREE.DoubleSide }),
    lipidHead: physical("#38BDF8", { roughness: 0.3, clearcoat: 0.45 }),
    lipidTail: physical("#BAE6FD", { roughness: 0.58, clearcoat: 0.16, side: THREE.DoubleSide }),
    lipidTailShadow: physical("#0284C7", { transparent: true, opacity: 0.12, depthWrite: false, roughness: 0.76, side: THREE.DoubleSide }),
    lipidCore: physical("#DDF6FF", { transparent: true, opacity: 0.18, depthWrite: false, roughness: 0.82, side: THREE.DoubleSide }),
    proteinTeal: physical("#20B8B3", { roughness: 0.34, clearcoat: 0.58, side: THREE.DoubleSide }),
    proteinBlue: physical("#3195CF", { roughness: 0.34, clearcoat: 0.58, side: THREE.DoubleSide }),
    proteinChannelA: physical("#0EA5E9", { roughness: 0.33, clearcoat: 0.6, side: THREE.DoubleSide }),
    proteinChannelB: physical("#4F46E5", { roughness: 0.35, clearcoat: 0.56, side: THREE.DoubleSide }),
    proteinPurple: physical("#8B5CF6", { roughness: 0.34, clearcoat: 0.54, side: THREE.DoubleSide }),
    proteinOrange: physical("#F59E0B", { roughness: 0.38, clearcoat: 0.46, side: THREE.DoubleSide }),
    proteinRibbon: physical("#0EA5E9", { roughness: 0.28, clearcoat: 0.62, side: THREE.DoubleSide }),
    proteinDark: physical("#075985", { transparent: true, opacity: 0.24, depthWrite: false, roughness: 0.52 }),
    carbohydrate: physical("#EF4444", { roughness: 0.35, clearcoat: 0.48 }),
    carbohydrateBlue: physical("#EF4444", { roughness: 0.35, clearcoat: 0.48 }),
    carbohydrateBranch: physical("#DC2626", { roughness: 0.36, clearcoat: 0.42 }),
    cholesterol: physical("#F59E0B", { roughness: 0.3, clearcoat: 0.42 }),
    cholesterolOh: physical("#DC2626", { roughness: 0.34, clearcoat: 0.4 }),
    cholesterolLine: line("#92400E", { transparent: true, opacity: 0.72 }),
    flowArrow: physical("#2563EB", { transparent: true, opacity: 0.38, depthWrite: false, roughness: 0.4 }),
  };
}

function buildMembraneFluidModel(THREE, parent, pickables, addLabel, animationItems, partGroups) {
  const materials = membraneWebglMaterials(THREE);
  const membraneGroup = new THREE.Group();
  const lipidGroup = new THREE.Group();
  const proteinGroup = new THREE.Group();
  const carbohydrateGroup = new THREE.Group();
  const cholesterolGroup = new THREE.Group();
  const flowGroup = new THREE.Group();
  parent.add(membraneGroup, lipidGroup, cholesterolGroup, proteinGroup, carbohydrateGroup, flowGroup);
  partGroups.set("phospholipid", lipidGroup);
  partGroups.set("protein", proteinGroup);
  partGroups.set("carbohydrate", carbohydrateGroup);
  partGroups.set("cholesterol", cholesterolGroup);
  partGroups.set("fluidity", flowGroup);

  membraneWebglRegisterPickable(membraneGroup, pickables, "phospholipid");

  const skippedCenters = [
    { x: -35, z: -12, r: 3.8 },
    { x: -18, z: -5, r: 3.85 },
    { x: 0, z: 4, r: 4.45 },
    { x: 18, z: -8, r: 3.65 },
    { x: 34, z: 12, r: 3.7 },
  ];
  for (let xi = 0; xi < 29; xi += 1) {
    for (let zi = 0; zi < 11; zi += 1) {
      const seed = xi * 1.73 + zi * 2.41;
      const x = -43.0 + xi * 3.04 + Math.sin(seed * 1.91) * 0.22;
      const z = -20.1 + zi * 3.62 + Math.cos(seed * 2.13) * 0.18;
      const skip = skippedCenters.some((center) => Math.hypot(x - center.x, z - center.z) < center.r);
      if (skip) continue;
      const waveY = membraneSurfaceWave(x, z);
      const top = createMembraneLipid(THREE, materials, x, z, 1, seed, waveY);
      const bottom = createMembraneLipid(THREE, materials, x, z, -1, seed + 4.1, waveY);
      top.animation.flowSeed = seed;
      bottom.animation.flowSeed = seed;
      lipidGroup.add(top.group, bottom.group);
      animationItems.push(top.animation, bottom.animation);
      membraneWebglRegisterPickable(top.group, pickables, "phospholipid");
      membraneWebglRegisterPickable(bottom.group, pickables, "phospholipid");
    }
  }

  const cholesterolPositions = [
    [-37, -16, 0.2], [-28, 10, -0.35], [-13, -14, 0.42], [4, 16, -0.25],
    [16, -17, 0.18], [28, 5, -0.18], [39, -9, 0.34], [36, 16, -0.52],
  ];
  cholesterolPositions.forEach(([x, z, rotation], index) => {
    const cholesterol = createMembraneCholesterol(THREE, materials, x, z, rotation, index);
    cholesterolGroup.add(cholesterol.group);
    animationItems.push(cholesterol.animation);
    membraneWebglRegisterPickable(cholesterol.group, pickables, "cholesterol");
  });

  const channel = createMembraneChannelProtein(THREE, materials, -35, -12, { material: materials.proteinChannelA });
  const secondChannel = createMembraneChannelProtein(THREE, materials, -18, -5, { scale: 0.82, seed: 3.7, material: materials.proteinChannelB });
  const carrier = createMembraneGlycoprotein(THREE, materials, 0, 4);
  const embedded = createMembraneEmbeddedProtein(THREE, materials, 18, -8);
  const embeddedTop = createMembraneEmbeddedProtein(THREE, materials, 31, 7, { scale: 0.72, topSide: true, seed: 24.2 });
  const peripheralTop = createMembranePeripheralProtein(THREE, materials, -30, 16, 1);
  const peripheralBottom = createMembranePeripheralProtein(THREE, materials, 20, 14, -1);
  const transmembraneHelix = createMembraneTransmembraneHelix(THREE, materials, 34, 12);
  proteinGroup.add(channel.group, secondChannel.group, carrier.group, embedded.group, embeddedTop.group, peripheralTop.group, peripheralBottom.group, transmembraneHelix.group);
  [channel, secondChannel, carrier, embedded, embeddedTop, peripheralTop, peripheralBottom, transmembraneHelix].forEach((item) => {
    animationItems.push(item.animation);
    membraneWebglRegisterPickable(item.group, pickables, item.part);
  });

  const sugarChains = [
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(-39, 6.05, -16), -0.9, "carbohydrate", { length: 7, anchor: -0.72 }),
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(-25, 6.1, 10), 1.2, "carbohydrate", { length: 8, anchor: -0.74 }),
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(0, 10.1, 4), 0.3, "glycoprotein", { length: 10, anchor: -1.05, large: true }),
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(14, 6.0, 16), -0.25, "carbohydrate", { length: 7, anchor: -0.7 }),
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(34, 10.7, 12), -0.65, "carbohydrate", { length: 11, anchor: -1.1, large: true }),
    createMembraneCarbohydrateChain(THREE, materials, new THREE.Vector3(41, 6.0, -6), 1.85, "carbohydrate", { length: 7, anchor: -0.72 }),
  ];
  sugarChains.forEach((chain) => {
    carbohydrateGroup.add(chain.group);
    animationItems.push(chain.animation);
    membraneWebglRegisterPickable(chain.group, pickables, "carbohydrate");
  });

  createMembraneFlowArrows(THREE, materials, flowGroup, pickables, animationItems);

  addLabel("磷脂双分子层", new THREE.Vector3(-37, 7.2, -19), "#0EA5E9", { x: -8, y: -26 });
  addLabel("复杂膜蛋白", new THREE.Vector3(-7, 12, 3), "#0F766E", { x: 18, y: -36 });
  addLabel("多糖链", new THREE.Vector3(11, 15, 5), "#DC2626", { x: 20, y: -28 });
  addLabel("胆固醇", new THREE.Vector3(15, 1.8, -17), "#B45309", { x: 18, y: 20 });
  addLabel("表面蛋白", new THREE.Vector3(32, -8.5, 14), "#6D28D9", { x: 18, y: 28 });
}

function membraneSurfaceWave(x, z) {
  return Math.sin(x * 0.12 + z * 0.18) * 0.28 + Math.cos(x * 0.07 - z * 0.11) * 0.16;
}

function createMembraneLipid(THREE, materials, x, z, leaflet, seed, waveY = 0) {
  const group = new THREE.Group();
  group.position.set(x, waveY, z);
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.32, 12, 8), materials.lipidHead);
  head.position.set(0, leaflet * 5.15, 0);
  head.userData = { membranePart: "lipidHead" };
  group.add(head);
  const tailRoots = [];
  [-0.28, 0.28].forEach((offsetX, index) => {
    const root = new THREE.Group();
    root.position.set(offsetX, leaflet * 4.48, index ? -0.19 : 0.19);
    root.userData = {
      phase: seed + index * 1.57,
      amp: 0.78 + Math.sin(seed * 1.7 + index) * 0.24,
      side: index ? 1 : -1,
    };
    const tailSeed = seed + index * 2.3;
    const tailSide = index ? 1 : -1;
    const tail = new THREE.Mesh(createMembraneTailRopeGeometry(THREE, leaflet, tailSide, tailSeed), materials.lipidTail);
    tail.userData = { membranePart: "lipidTail" };
    const tailTip = new THREE.Mesh(createMembraneTailTipGeometry(THREE), materials.lipidTail);
    tailTip.position.copy(membraneTailTipPosition(THREE, leaflet, tailSide, tailSeed));
    tailTip.userData = { membranePart: "lipidTail" };
    root.add(tail, tailTip);
    group.add(root);
    tailRoots.push(root);
  });
  return {
    group,
    animation: {
      type: "lipid",
      group,
      tailRoots,
      baseX: x,
      baseZ: z,
      baseY: waveY,
      leaflet,
      seed,
      cholesterolDamp: 1,
    },
  };
}

function createMembraneTailRopeGeometry(THREE, leaflet, side, seed) {
  const variant = membraneTailVariant(seed);
  createMembraneTailRopeGeometry.cache ||= new Map();
  const cacheKey = `${leaflet}:${side}:${variant}`;
  if (createMembraneTailRopeGeometry.cache.has(cacheKey)) {
    return createMembraneTailRopeGeometry.cache.get(cacheKey);
  }
  const points = membraneTailControlPoints(THREE, leaflet, side, variant);
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 9, 0.18, 8, false);
  createMembraneTailRopeGeometry.cache.set(cacheKey, geometry);
  return geometry;
}

function createMembraneTailTipGeometry(THREE) {
  createMembraneTailTipGeometry.cache ||= new THREE.SphereGeometry(0.18, 12, 8);
  return createMembraneTailTipGeometry.cache;
}

function membraneTailVariant(seed) {
  return Math.abs(Math.round(seed * 10)) % 10;
}

function membraneTailTipPosition(THREE, leaflet, side, seed) {
  const points = membraneTailControlPoints(THREE, leaflet, side, membraneTailVariant(seed));
  return points[points.length - 1].clone();
}

function membraneTailControlPoints(THREE, leaflet, side, variant) {
  const points = [];
  const variantSeed = variant * 0.73 + side * 1.1;
  for (let i = 0; i <= 7; i += 1) {
    const t = i / 7;
    const swayA = Math.sin(variantSeed * 1.1 + t * Math.PI * 1.7) * 0.18 * t;
    const swayB = Math.cos(variantSeed * 1.7 + t * Math.PI * 2.2) * 0.16 * t;
    const centerX = side * (0.04 + t * 0.18) + swayA;
    const centerY = -leaflet * (t * 4.18);
    const centerZ = side * 0.05 + swayB;
    points.push(new THREE.Vector3(centerX, centerY, centerZ));
  }
  return points;
}

function createMembraneCholesterol(THREE, materials, x, z, rotation, seed) {
  const group = new THREE.Group();
  group.position.set(x, -0.1, z);
  group.rotation.set(0.06, rotation, 0.02);
  const orientation = seed % 2 === 0 ? 1 : -1;
  const ringRadius = 0.64;
  const pentagonRadius = ringRadius / (2 * Math.sin(Math.PI / 5));
  const makeRing = (sides, radius, position, vertexOffset) => {
    const ring = createMembraneSteroidRing(THREE, materials, sides, radius, vertexOffset);
    ring.position.copy(position);
    group.add(ring);
  };
  const hexEdgeDistance = 2 * ringRadius * Math.cos(Math.PI / 6);
  const pentagonEdgeDistance = ringRadius * Math.cos(Math.PI / 6) + pentagonRadius * Math.cos(Math.PI / 5);
  const fusedVector = (angle, distance) => new THREE.Vector3(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
  const downRightAngle = -orientation * Math.PI / 3;
  const downLeftAngle = -orientation * (Math.PI * 2) / 3;
  const startY = 3.15 * orientation;
  const hexVertexOffset = -orientation * Math.PI / 2;
  const ringA = new THREE.Vector3(-hexEdgeDistance * 0.25, startY, 0);
  const ringB = ringA.clone().add(fusedVector(downRightAngle, hexEdgeDistance));
  const ringC = ringB.clone().add(fusedVector(downLeftAngle, hexEdgeDistance));
  const ringD = ringC.clone().add(fusedVector(downRightAngle, pentagonEdgeDistance));
  const pentagonSharedSideNormal = downRightAngle + Math.PI;
  const pentagonVertexOffset = pentagonSharedSideNormal - Math.PI / 5;
  [
    { sides: 6, radius: ringRadius, position: ringA, vertexOffset: hexVertexOffset },
    { sides: 6, radius: ringRadius, position: ringB, vertexOffset: hexVertexOffset },
    { sides: 6, radius: ringRadius, position: ringC, vertexOffset: hexVertexOffset },
    { sides: 5, radius: pentagonRadius, position: ringD, vertexOffset: pentagonVertexOffset },
  ].forEach((ring) => makeRing(ring.sides, ring.radius, ring.position, ring.vertexOffset));
  const hydroxyl = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 10), materials.cholesterolOh);
  hydroxyl.position.set(ringA.x - 0.72, ringA.y + orientation * 0.92, 0.04);
  const hydroxylBond = dnaWebglBond(THREE, new THREE.Vector3(ringA.x - 0.35, ringA.y + orientation * 0.46, 0.02), hydroxyl.position, 0.08, materials.cholesterol);
  const methyl = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), materials.cholesterolOh);
  methyl.position.set(ringB.x + 0.4, ringB.y + orientation * 0.66, 0.04);
  const methylBond = dnaWebglBond(THREE, new THREE.Vector3(ringB.x + 0.2, ringB.y + orientation * 0.32, 0.02), methyl.position, 0.07, materials.cholesterol);
  const sideChain = dnaWebglBond(THREE, new THREE.Vector3(ringD.x + 0.45, ringD.y - orientation * 0.38, 0), new THREE.Vector3(ringD.x + 0.62, ringD.y - orientation * 1.42, 0.12), 0.12, materials.cholesterol);
  group.scale.setScalar(1.18);
  group.add(hydroxyl, hydroxylBond, methyl, methylBond, sideChain);
  return {
    group,
    animation: { type: "cholesterol", group, baseX: x, baseZ: z, baseY: -0.1, seed },
  };
}

function createMembraneSteroidRing(THREE, materials, sides, radius, vertexOffset) {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = vertexOffset + (index * Math.PI * 2) / sides;
    return new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
  });
  const shape = new THREE.Shape(points);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.18, bevelEnabled: false });
  geometry.translate(0, 0, -0.09);
  const mesh = new THREE.Mesh(geometry, materials.cholesterol);
  const linePoints = points.map((point) => new THREE.Vector3(point.x, point.y, 0.1));
  linePoints.push(linePoints[0].clone());
  const edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePoints), materials.cholesterolLine);
  const ring = new THREE.Group();
  ring.add(mesh, edge);
  return ring;
}

function createMembraneChannelProtein(THREE, materials, x, z, options = {}) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const scale = options.scale || 1;
  const seed = options.seed || 1.8;
  const proteinMaterial = options.material || materials.proteinBlue;
  const channelProfile = (t) => 0.9 + Math.sin(t * Math.PI) * 0.16 + Math.exp(-((t - 0.08) ** 2) / 0.012) * 0.12 + Math.exp(-((t - 0.92) ** 2) / 0.012) * 0.12;
  const left = new THREE.Mesh(membraneOrganicContinuousColumnGeometry(THREE, 15.9 * scale, 2.22 * scale, 2.42 * scale, seed, {
    profile: channelProfile,
    lobes: [
      { t: 0.16, angle: Math.PI * 0.1, widthT: 0.14, widthAngle: 0.95, strength: 0.12 },
      { t: 0.84, angle: -Math.PI * 0.16, widthT: 0.15, widthAngle: 0.95, strength: 0.12 },
      { t: 0.52, angle: Math.PI * 0.72, widthT: 0.22, widthAngle: 0.7, strength: 0.08 },
      { t: 0.38, angle: -Math.PI * 0.62, widthT: 0.18, widthAngle: 0.72, strength: 0.07 },
    ],
    capFloor: 0.88,
    capSpan: 0.22,
    capHeight: 1.35 * scale,
    ridgeStrength: 0.055,
  }), proteinMaterial);
  left.position.x = -1.72 * scale;
  const right = new THREE.Mesh(membraneOrganicContinuousColumnGeometry(THREE, 15.9 * scale, 2.22 * scale, 2.42 * scale, seed + 3.5, {
    profile: channelProfile,
    lobes: [
      { t: 0.18, angle: -Math.PI * 0.1, widthT: 0.13, widthAngle: 0.9, strength: 0.1 },
      { t: 0.82, angle: Math.PI * 0.18, widthT: 0.15, widthAngle: 0.96, strength: 0.13 },
      { t: 0.48, angle: -Math.PI * 0.74, widthT: 0.2, widthAngle: 0.74, strength: 0.08 },
      { t: 0.6, angle: Math.PI * 0.66, widthT: 0.18, widthAngle: 0.72, strength: 0.07 },
    ],
    capFloor: 0.88,
    capSpan: 0.22,
    capHeight: 1.35 * scale,
    ridgeStrength: 0.055,
  }), proteinMaterial);
  right.position.x = 1.72 * scale;
  const pore = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * scale, 0.5 * scale, 9.2 * scale, 32, 1, true), materials.proteinDark);
  group.add(left, right, pore);
  return { group, part: "integralProtein", animation: { type: "proteinDrift", group, baseX: x, baseZ: z, seed: seed + 0.3, amplitude: 0.3 * scale } };
}

function createMembraneGlycoprotein(THREE, materials, x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const body = new THREE.Mesh(membraneOrganicContinuousColumnGeometry(THREE, 16.5, 2.68, 2.28, 12.2, {
    profile: (t) => 0.74 + Math.sin(t * Math.PI) * 0.32 + Math.exp(-((t - 0.88) ** 2) / 0.018) * 0.18,
    center: (t) => ({
      x: Math.sin(t * Math.PI * 1.2 + 0.4) * 0.28,
      z: Math.cos(t * Math.PI * 1.05 + 0.7) * 0.18,
    }),
    lobes: [
      { t: 0.82, angle: Math.PI * 0.86, widthT: 0.16, widthAngle: 0.84, strength: 0.35 },
      { t: 0.96, angle: -Math.PI * 0.18, widthT: 0.11, widthAngle: 0.78, strength: 0.28 },
      { t: 0.62, angle: Math.PI * 0.18, widthT: 0.2, widthAngle: 0.7, strength: 0.12 },
      { t: 0.42, angle: -Math.PI * 0.65, widthT: 0.16, widthAngle: 0.72, strength: 0.1 },
      { t: 0.28, angle: Math.PI * 0.52, widthT: 0.15, widthAngle: 0.68, strength: 0.08 },
    ],
    capFloor: 0.84,
    capSpan: 0.23,
    capHeight: 1.55,
    ridgeStrength: 0.06,
  }), materials.proteinTeal);
  body.rotation.z = -0.03;
  group.add(body);
  return { group, part: "glycoprotein", animation: { type: "proteinDrift", group, baseX: x, baseZ: z, seed: 4.9, amplitude: 0.26 } };
}

function createMembraneEmbeddedProtein(THREE, materials, x, z, options = {}) {
  const group = new THREE.Group();
  const scale = options.scale || 1;
  const y = options.topSide ? 4.68 : 3.0;
  const seed = options.seed || 21.4;
  group.position.set(x, y, z);
  const body = new THREE.Mesh(membraneOrganicBlobGeometry(THREE, 5.05 * scale, 2.55 * scale, 3.25 * scale, seed, {
    lobes: [
      { v: 0.46, angle: Math.PI * 0.08, widthV: 0.22, widthAngle: 0.98, strength: 0.2 },
      { v: 0.66, angle: -Math.PI * 0.72, widthV: 0.17, widthAngle: 0.75, strength: 0.16 },
      { v: 0.32, angle: Math.PI * 0.92, widthV: 0.18, widthAngle: 0.7, strength: 0.12 },
      { v: 0.55, angle: Math.PI * 0.48, widthV: 0.16, widthAngle: 0.72, strength: 0.11 },
      { v: 0.38, angle: -Math.PI * 0.18, widthV: 0.15, widthAngle: 0.68, strength: 0.09 },
    ],
    surfaceStrength: 0.055,
  }), materials.proteinOrange);
  body.rotation.z = -0.08;
  group.add(body);
  return { group, part: "embeddedProtein", animation: { type: "proteinDrift", group, baseX: x, baseZ: z, baseY: y, seed: 7.7 + seed * 0.05, amplitude: 0.2 * scale } };
}

function createMembranePeripheralProtein(THREE, materials, x, z, side) {
  const group = new THREE.Group();
  const baseY = side * 6.12;
  group.position.set(x, baseY, z);
  const body = new THREE.Mesh(membraneOrganicBlobGeometry(THREE, 5.05, 1.42, 2.78, side > 0 ? 26.3 : 28.5, {
    lobes: [
      { v: 0.5, angle: Math.PI * 0.1, widthV: 0.28, widthAngle: 1.08, strength: 0.18 },
      { v: 0.43, angle: -Math.PI * 0.78, widthV: 0.24, widthAngle: 0.86, strength: 0.14 },
      { v: 0.6, angle: Math.PI * 0.82, widthV: 0.22, widthAngle: 0.78, strength: 0.12 },
      { v: 0.34, angle: -Math.PI * 0.12, widthV: 0.18, widthAngle: 0.72, strength: 0.09 },
      { v: 0.66, angle: Math.PI * 0.46, widthV: 0.16, widthAngle: 0.68, strength: 0.08 },
    ],
    surfaceStrength: 0.052,
  }), materials.proteinPurple);
  body.scale.y = 0.88;
  group.add(body);
  return { group, part: "peripheralProtein", animation: { type: "proteinDrift", group, baseX: x, baseZ: z, baseY, seed: side > 0 ? 6.2 : 8.4, amplitude: 0.24 } };
}

function createMembraneTransmembraneHelix(THREE, materials, x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  const points = [];
  for (let i = 0; i <= 130; i += 1) {
    const t = i / 130;
    const y = -8.4 + t * 19.2;
    const angle = t * Math.PI * 7.4;
    const radius = 1.15 + Math.sin(t * Math.PI * 2) * 0.18;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.72));
  }
  const helixMaterial = materials.proteinOrange;
  const curve = new THREE.CatmullRomCurve3(points);
  const helix = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.24, 12, false), helixMaterial);
  const helixEnd = points[points.length - 1].clone();
  const bridgePoint = new THREE.Vector3((helixEnd.x + 0.8) * 0.5, 10.8, (helixEnd.z + 0.2) * 0.5);
  const outerTail = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        helixEnd,
        bridgePoint,
        new THREE.Vector3(0.8, 10.2, 0.2),
        new THREE.Vector3(2.9, 12.4, -0.6),
        new THREE.Vector3(5.4, 14.5, 0.7),
        new THREE.Vector3(6.0, 17.0, 1.2),
      ]),
      42,
      0.18,
      10,
      false,
    ),
    helixMaterial,
  );
  group.add(helix, outerTail);
  return { group, part: "integralProtein", animation: { type: "proteinDrift", group, baseX: x, baseZ: z, seed: 11.5, amplitude: 0.2 } };
}

function createMembraneCarbohydrateChain(THREE, materials, start, phase, part, options = {}) {
  const group = new THREE.Group();
  group.position.copy(start);
  const beads = [];
  const points = [];
  const count = options.length || 8;
  const mainMaterial = options.large ? materials.carbohydrateBlue : materials.carbohydrate;
  const branchMaterial = materials.carbohydrateBranch;
  const hexGeometry = new THREE.CylinderGeometry(options.large ? 0.5 : 0.43, options.large ? 0.5 : 0.43, 0.2, 6);
  hexGeometry.rotateX(Math.PI / 2);
  const anchorY = Number.isFinite(options.anchor) ? options.anchor : -0.75;
  const anchor = new THREE.Vector3(0, anchorY, 0);
  for (let i = 0; i < count; i += 1) {
    const p = new THREE.Vector3(
      Math.sin(i * 0.82 + phase) * (0.42 + i * 0.11),
      i * 0.68,
      Math.cos(i * 0.78 + phase) * (0.34 + i * 0.08),
    );
    points.push(p);
    const bead = new THREE.Mesh(hexGeometry, i % 4 === 0 ? branchMaterial : mainMaterial);
    bead.position.copy(p);
    bead.rotation.z = Math.PI / 6 + i * 0.1;
    group.add(bead);
    beads.push({ mesh: bead, base: p.clone(), phase: phase + i * 0.62 });
    if (i === 0) {
      const stem = dnaWebglBond(THREE, anchor, p, 0.055, mainMaterial);
      group.add(stem);
    } else {
      const bond = dnaWebglBond(THREE, points[i - 1], p, 0.06, mainMaterial);
      group.add(bond);
    }
    if (i === 3 || i === 5 || (count > 9 && i === 7)) {
      let previous = p;
      for (let branchIndex = 1; branchIndex <= 3; branchIndex += 1) {
        const branchPoint = new THREE.Vector3(
          p.x + branchIndex * 0.42 * (i % 2 ? 1 : -1),
          p.y + branchIndex * 0.28,
          p.z + branchIndex * 0.32,
        );
        const branchBond = dnaWebglBond(THREE, previous, branchPoint, 0.048, branchMaterial);
        const branch = new THREE.Mesh(hexGeometry, branchMaterial);
        branch.position.copy(branchPoint);
        branch.rotation.z = Math.PI / 6 + branchIndex * 0.16;
        group.add(branchBond, branch);
        beads.push({ mesh: branch, base: branch.position.clone(), phase: phase + i * 0.9 + branchIndex });
        previous = branchPoint;
      }
    }
  }
  return {
    group,
    animation: { type: "carbohydrate", group, beads, base: start.clone(), seed: phase, part },
  };
}

function createMembraneFlowArrows(THREE, materials, parent, pickables, animationItems) {
  const paths = [
    [new THREE.Vector3(-42, 8.4, -21), new THREE.Vector3(-24, 10.2, -22), new THREE.Vector3(-6, 8.6, -21)],
    [new THREE.Vector3(6, -8.2, 21), new THREE.Vector3(23, -10.2, 22), new THREE.Vector3(42, -8.4, 20)],
    [new THREE.Vector3(-18, 7.8, 19), new THREE.Vector3(2, 9.2, 21), new THREE.Vector3(24, 7.6, 19)],
  ];
  paths.forEach((points, index) => {
    const curve = new THREE.CatmullRomCurve3(points);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.105, 8, false), materials.flowArrow);
    const end = points[points.length - 1];
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.05, 18), materials.flowArrow);
    cone.position.copy(end);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(points[points.length - 2]).normalize());
    const group = new THREE.Group();
    group.add(tube, cone);
    parent.add(group);
    membraneWebglRegisterPickable(group, pickables, "fluidity");
    animationItems.push({ type: "flowArrow", group, seed: index * 1.9 });
  });
}

function membraneOrganicContinuousColumnGeometry(THREE, height, radiusX, radiusZ, seed, options = {}) {
  const radialSegments = 56;
  const bodySegments = 42;
  const capSegments = 14;
  const vertices = [];
  const indices = [];
  const profileFn = options.profile || (() => 1);
  const centerFn = options.center || (() => ({ x: 0, z: 0 }));
  const lobes = options.lobes || [];
  const capHeight = options.capHeight ?? Math.max(radiusX, radiusZ) * 0.45;
  const ridgeStrength = options.ridgeStrength ?? 0.045;
  const bodyHalf = height / 2;
  const totalHalf = bodyHalf + capHeight;
  const totalSegments = bodySegments + capSegments * 2;
  const rowStarts = [];
  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const capRadiusFactor = (y) => {
    const overshoot = Math.max(0, Math.abs(y) - bodyHalf);
    if (overshoot <= 0) return 1;
    const q = clamp01(overshoot / capHeight);
    return Math.cos(q * Math.PI * 0.5);
  };

  const bottomPole = vertices.length / 3;
  const bottomCenter = centerFn(0) || { x: 0, z: 0 };
  vertices.push(bottomCenter.x || 0, -totalHalf, bottomCenter.z || 0);

  for (let yi = 1; yi < totalSegments; yi += 1) {
    const y = -totalHalf + (yi / totalSegments) * totalHalf * 2;
    const t = clamp01((y + bodyHalf) / height);
    const capFactor = capRadiusFactor(y);
    const endDamping = Math.min(1, Math.max(0.18, capFactor * 1.6));
    const profile = profileFn(t) * capFactor;
    const center = centerFn(t) || { x: 0, z: 0 };
    const rowStart = vertices.length / 3;
    rowStarts.push(rowStart);
    for (let ai = 0; ai < radialSegments; ai += 1) {
      const angle = (ai / radialSegments) * Math.PI * 2;
      let lobeScale = 0;
      lobes.forEach((lobe) => {
        const angleDelta = Math.atan2(Math.sin(angle - lobe.angle), Math.cos(angle - lobe.angle));
        const tDelta = t - lobe.t;
        const angularFalloff = Math.exp(-(angleDelta * angleDelta) / (2 * (lobe.widthAngle || 0.85) ** 2));
        const verticalFalloff = Math.exp(-(tDelta * tDelta) / (2 * (lobe.widthT || 0.16) ** 2));
        lobeScale += (lobe.strength || 0) * angularFalloff * verticalFalloff;
      });
      lobeScale *= endDamping;
      const noise = 1
        + Math.sin(angle * 2.8 + seed + t * 3.1) * 0.04 * endDamping
        + Math.cos(angle * 4.7 - seed * 0.65 + t * 2.8) * 0.03 * endDamping
        + Math.sin(t * Math.PI * 2.4 + seed * 0.7) * 0.022 * endDamping;
      const surfaceRidge = (
        Math.sin(angle * 3.7 + t * 11.4 + seed * 0.6) * 0.62
        + Math.cos(angle * 6.1 - t * 8.6 + seed * 0.42) * 0.38
      ) * ridgeStrength * Math.sin(t * Math.PI) * endDamping;
      const surfaceScale = Math.max(0.22, noise + surfaceRidge);
      vertices.push(
        (center.x || 0) + Math.cos(angle) * radiusX * profile * (1 + lobeScale) * surfaceScale,
        y + Math.sin(angle * 1.7 + seed) * 0.055 * Math.sin(t * Math.PI) * endDamping,
        (center.z || 0) + Math.sin(angle) * radiusZ * profile * (1 + lobeScale) * surfaceScale,
      );
    }
  }

  const topPole = vertices.length / 3;
  const topCenter = centerFn(1) || { x: 0, z: 0 };
  vertices.push(topCenter.x || 0, totalHalf, topCenter.z || 0);

  if (rowStarts.length > 0) {
    const firstRow = rowStarts[0];
    for (let ai = 0; ai < radialSegments; ai += 1) {
      const next = (ai + 1) % radialSegments;
      indices.push(bottomPole, firstRow + ai, firstRow + next);
    }
  }

  for (let yi = 0; yi < rowStarts.length - 1; yi += 1) {
    const current = rowStarts[yi];
    const nextRow = rowStarts[yi + 1];
    for (let ai = 0; ai < radialSegments; ai += 1) {
      const a = current + ai;
      const b = current + ((ai + 1) % radialSegments);
      const c = nextRow + ai;
      const d = nextRow + ((ai + 1) % radialSegments);
      indices.push(a, c, b, b, c, d);
    }
  }

  if (rowStarts.length > 0) {
    const lastRow = rowStarts[rowStarts.length - 1];
    for (let ai = 0; ai < radialSegments; ai += 1) {
      const next = (ai + 1) % radialSegments;
      indices.push(lastRow + ai, topPole, lastRow + next);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
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

function membraneWebglRegisterPickable(object, pickables, part) {
  object.traverse((child) => {
    if (child.isMesh || child.isSprite) {
      child.userData = { ...child.userData, membranePart: child.userData.membranePart || part };
      pickables.push(child);
    }
  });
}

function updateMembraneFluidAnimations(THREE, animationItems, time, speed, amplitude) {
  const motion = time * (0.18 + speed * 1.25);
  animationItems.forEach((item) => {
    if (item.type === "lipid") {
      const flowSeed = Number.isFinite(item.flowSeed) ? item.flowSeed : item.seed;
      const collectiveWave = (
        Math.sin(item.baseX * 0.12 + motion * 0.92)
        + Math.cos(item.baseZ * 0.16 + motion * 1.08)
      ) * 0.16 * amplitude;
      const xDrift = (
        Math.sin(motion * 3.1 + flowSeed) * 0.12
        + Math.sin(item.baseZ * 0.21 + motion * 0.72) * 0.08
      ) * amplitude;
      const zDrift = (
        Math.cos(motion * 3.45 + flowSeed * 1.17) * 0.12
        + Math.cos(item.baseX * 0.17 + motion * 0.8) * 0.08
      ) * amplitude;
      item.group.position.x = item.baseX + xDrift;
      item.group.position.z = item.baseZ + zDrift;
      if (Number.isFinite(item.baseY)) item.group.position.y = item.baseY + collectiveWave;
      item.tailRoots.forEach((tailRoot, index) => {
        const phase = tailRoot.userData?.phase || item.seed + index * 1.8;
        const amp = tailRoot.userData?.amp || 1;
        const side = tailRoot.userData?.side || (index ? 1 : -1);
        const tailMotion = motion * 2.1;
        const wave = (
          Math.sin(tailMotion * 1.18 + phase) * 0.1
          + Math.cos(tailMotion * 0.78 + phase * 1.9) * 0.055
          + Math.sin(tailMotion * 1.9 + phase * 0.63) * 0.035
        ) * amp * amplitude * (item.cholesterolDamp || 1);
        tailRoot.rotation.z = wave * item.leaflet;
        tailRoot.rotation.x = Math.cos(tailMotion * 1.02 + phase * 0.8) * 0.065 * amplitude;
        tailRoot.rotation.y = Math.sin(tailMotion * 0.74 + phase * 1.5) * 0.05 * side * amplitude;
      });
    }
    if (item.type === "proteinDrift") {
      const slow = motion * 0.36;
      item.group.position.x = item.baseX + Math.sin(slow + item.seed) * item.amplitude * amplitude;
      item.group.position.z = item.baseZ + Math.cos(slow * 0.9 + item.seed * 1.3) * item.amplitude * 0.8 * amplitude;
      if (Number.isFinite(item.baseY)) item.group.position.y = item.baseY + Math.sin(slow * 1.15 + item.seed) * 0.1 * amplitude;
      item.group.rotation.y = Math.sin(slow * 0.72 + item.seed) * 0.035 * amplitude;
      item.group.rotation.z = Math.cos(slow * 0.58 + item.seed) * 0.025 * amplitude;
    }
    if (item.type === "cholesterol") {
      const slow = motion * 0.5;
      item.group.position.x = item.baseX + Math.sin(slow + item.seed) * 0.12 * amplitude;
      item.group.position.z = item.baseZ + Math.cos(slow * 0.8 + item.seed) * 0.1 * amplitude;
      item.group.rotation.z = Math.sin(slow * 1.2 + item.seed) * 0.045 * amplitude;
    }
    if (item.type === "carbohydrate") {
      item.group.rotation.z = Math.sin(motion * 0.8 + item.seed) * 0.12 * amplitude;
      item.group.rotation.x = Math.cos(motion * 0.7 + item.seed) * 0.08 * amplitude;
      item.beads.forEach((bead) => {
        bead.mesh.position.x = bead.base.x + Math.sin(motion * 1.35 + bead.phase) * 0.1 * amplitude;
        bead.mesh.position.z = bead.base.z + Math.cos(motion * 1.1 + bead.phase) * 0.1 * amplitude;
      });
    }
    if (item.type === "flowArrow") {
      const pulse = 0.68 + Math.max(0, Math.sin(motion * 1.25 + item.seed)) * 0.32;
      item.group.scale.setScalar(0.96 + pulse * 0.05);
    }
  });
}

function applyMembraneStageFocus(partGroups) {
  const focusMap = {
    1: ["phospholipid"],
    2: ["protein"],
    3: ["carbohydrate"],
    4: ["cholesterol"],
    5: ["phospholipid", "protein", "carbohydrate", "cholesterol", "fluidity"],
  };
  const focusParts = focusMap[state.stageIndex] || [];
  partGroups.forEach((group, part) => {
    const opacity = focusParts.length === 0 || focusParts.includes(part) ? 1 : 0.22;
    setMembraneGroupOpacity(group, part === "fluidity" && state.stageIndex !== 5 ? 0.14 : opacity);
  });
}

function setMembraneGroupOpacity(group, opacity) {
  group.traverse?.((child) => {
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      if (material.userData.membraneBaseOpacity === undefined) {
        material.userData.membraneBaseOpacity = material.opacity ?? 1;
      }
      const effectiveOpacity = material.userData.membraneBaseOpacity * opacity;
      material.transparent = effectiveOpacity < 0.985 || material.transparent;
      material.opacity = effectiveOpacity;
      material.depthWrite = effectiveOpacity > 0.7 && !material.userData?.forceNoDepthWrite;
      material.needsUpdate = true;
    });
  });
}

function applyMembraneWebglViewPreset(THREE, membraneRoot, panRoot, camera) {
  if (state.membraneWebglViewIndex !== state.viewIndex) {
    const preset = membraneWebglViewPreset(THREE, state.viewIndex);
    state.membraneWebglRotation = { ...preset.rotation };
    state.membraneWebglQuaternion = {
      x: preset.quaternion.x,
      y: preset.quaternion.y,
      z: preset.quaternion.z,
      w: preset.quaternion.w,
    };
    state.membraneWebglZoom = preset.zoom;
    state.membraneWebglPan = preset.pan || { x: 0, y: 0 };
    state.membraneWebglViewIndex = state.viewIndex;
    state.membraneViewScale = state.viewIndex === 1 ? 1.8 : 1;
    state.membraneViewOffset = { x: 0, y: 0 };
  }

  if (!state.membraneWebglRotation) {
    const restored = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(
        state.membraneWebglQuaternion.x,
        state.membraneWebglQuaternion.y,
        state.membraneWebglQuaternion.z,
        state.membraneWebglQuaternion.w,
      ),
      "XYZ",
    );
    state.membraneWebglRotation = { x: restored.x, y: restored.y };
  }
  membraneRoot.rotation.set(state.membraneWebglRotation.x, state.membraneWebglRotation.y, 0, "XYZ");
  panRoot.position.set(state.membraneWebglPan.x, state.membraneWebglPan.y, 0);
  camera.zoom = state.membraneWebglZoom;
  camera.updateProjectionMatrix();
}

function membraneWebglViewPreset(THREE, index) {
  const presets = [
    { theta: 0.62, phi: 1.1, zoom: 1.46, pan: { x: -15.5, y: 1.4 } },
    { theta: 0.98, phi: 1.16, zoom: 1.82, pan: { x: -5.2, y: 1.6 } },
    { theta: -0.02, phi: 1.52, zoom: 1.28, pan: { x: 0, y: 1.8 } },
    { theta: 0.62, phi: 0.03, zoom: 1.18, pan: { x: 0, y: 1.8 } },
    { theta: 0.62, phi: Math.PI - 0.03, zoom: 1.18, pan: { x: 0, y: -1.8 } },
  ];
  const selected = presets[index] || presets[0];
  return {
    quaternion: dnaWebglQuaternionFromCamera(THREE, selected.theta, selected.phi),
    rotation: { x: selected.phi - Math.PI / 2, y: -selected.theta },
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

function membraneFluidWebglVisual() {
  return `
    <div class="dna-webgl-stack membrane-webgl-stack">
      <div class="dna-3d-shell dna-webgl-shell membrane-webgl-shell" data-membrane-webgl-shell>
        <div class="membrane-view-tools" data-membrane-view-tools aria-label="模型取景">
          <button type="button" data-membrane-view="fit">完整视图</button>
          <button type="button" data-membrane-view="in" aria-label="放大模型">＋</button>
          <button type="button" data-membrane-view="out" aria-label="缩小模型">−</button>
          <button type="button" data-membrane-view="panel">流动调节 ↓</button>
        </div>
        <div class="dna-webgl-viewport-frame" data-membrane-webgl-viewport>
          <div class="dna-webgl-host" data-membrane-webgl-host></div>
          <div class="dna-webgl-labels" data-membrane-webgl-labels></div>
        </div>
        <div class="dna-webgl-loading" data-membrane-webgl-loading>正在加载 WebGL 细胞膜模型...</div>
        <div class="dna-state-control membrane-state-control" data-membrane-webgl-state-control>
          <div class="dna-state-header">
            <span>膜流动性调节</span>
            <strong data-membrane-flow-value>${Math.round(state.membraneFlowSpeed * 100)}%</strong>
          </div>
          <label>
            <span>流动速度 / Fluidity Speed</span>
            <input type="range" min="15" max="120" value="${Math.round(state.membraneFlowSpeed * 100)}" data-membrane-flow-speed />
          </label>
          <label>
            <span>摆动幅度 / Motion Range</span>
            <input type="range" min="20" max="110" value="${Math.round(state.membraneFlowAmplitude * 100)}" data-membrane-flow-amplitude />
          </label>
        </div>
      </div>
    </div>
  `;
}

const ANDER_MODEL_ADAPTER = Object.freeze({
  id: "membrane",
  visual: () => membraneFluidWebglVisual(),
  mount: () => { mountMembraneFluidWebgl(); },
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
