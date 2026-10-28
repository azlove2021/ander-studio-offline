"use strict";

const ANDER_MODEL_CONTENT = {"id":"optical-microscope","accent":"#31816e","title":"光学显微镜模型","titleEn":"Optical Microscope Model","chapter":"细胞的观察 / Cell Observation","type":"3D WebGL 交互模型","state":"显微镜结构与规范操作综合观察","visual":"opticalMicroscopeWebgl","structures":[["目镜 Eyepiece","#2F4858"],["镜筒 Body Tube","#5D756C"],["转换器 Revolving Nosepiece","#52616B"],["物镜 Objective Lenses","#E58B43"],["载物台 Stage","#3E5D52"],["粗准焦螺旋 Coarse Focus","#D39A3B"],["细准焦螺旋 Fine Focus","#E7B65D"],["聚光器与光圈 Condenser and Diaphragm","#4E9E8A"],["反光镜 Mirror","#74B7C5"],["镜臂 Arm","#71877D"],["镜座 Base","#50675E"],["玻片标本 Specimen Slide","#8CC9C1"]],"stages":[{"id":"overview","title":"整体结构","titleEn":"Overall Structure","goal":"从整体上辨认显微镜的机械系统、成像系统和照明系统。","keywords":["机械系统 Mechanical System","成像系统 Imaging System","照明系统 Illumination System"],"explanation":"镜座和镜臂支撑整机；目镜与物镜组成主要成像系统；反光镜、光圈和聚光器负责把光线送入标本。","mistake":"反光镜和光圈只负责照明，不参与物像的放大。","question":"显微镜中哪些结构负责放大，哪些结构负责照明？"},{"id":"optical-system","title":"成像系统","titleEn":"Imaging System","goal":"观察目镜、镜筒、转换器和物镜之间连续、同轴的结构关系。","keywords":["目镜 Eyepiece","物镜 Objective","转换器 Nosepiece"],"explanation":"当前物镜必须准确转到载玻片通光孔上方，光线通过物镜形成放大的实像，再由目镜进一步放大。总放大倍数等于目镜倍数与物镜倍数的乘积。","mistake":"切换倍率时应转动转换器，不能直接扳动物镜。","question":"目镜为10×、物镜为40×时，总放大倍数是多少？"},{"id":"stage-focus","title":"载物与调焦","titleEn":"Stage and Focus","goal":"理解载玻片、通光孔与同轴粗细准焦螺旋的相对位置。","keywords":["载物台 Stage","粗准焦 Coarse Focus","细准焦 Fine Focus"],"explanation":"玻片材料应正对通光孔。粗、细准焦螺旋安装在镜臂上部的同一调焦轴附近：粗准焦移动幅度大，细准焦用于精细调节。","mistake":"下降镜筒或升高载物台时，应从侧面观察，防止物镜压坏玻片。","question":"换成高倍物镜后物像略模糊，应优先调节哪一种准焦螺旋？"},{"id":"illumination","title":"照明光路","titleEn":"Illumination Path","goal":"追踪反光镜到目镜的连续光路。","keywords":["反光镜 Mirror","光圈 Diaphragm","聚光器 Condenser"],"explanation":"外界光线经反光镜改变方向，依次通过光圈、聚光器、通光孔和薄而透明的标本，再进入当前物镜、镜筒和目镜。","mistake":"反光镜必须通过支架连接主体，并调整到能把光线反射向通光孔的角度。","question":"从反光镜到眼睛，光线依次通过哪些主要结构？"},{"id":"low-power","title":"低倍对焦","titleEn":"Low-power Focusing","goal":"使用低倍物镜寻找目标并完成初步对焦。","keywords":["低倍物镜 Low Power","视野较大 Wide Field","粗准焦 Coarse Focus"],"explanation":"低倍物镜工作距离较长、视野较大且较亮，适合先寻找目标。先用粗准焦进入清晰范围，再用细准焦微调。","mistake":"开始观察时不能先使用高倍物镜寻找目标。","question":"为什么显微观察通常从低倍物镜开始？"},{"id":"high-power","title":"高倍观察","titleEn":"High-power Observation","goal":"比较倍率升高后视野、亮度和工作距离的变化。","keywords":["高倍物镜 High Power","视野变小 Narrower Field","细准焦 Fine Focus"],"explanation":"换用高倍物镜后物像变大、视野范围变小、亮度降低、工作距离缩短。此时主要使用细准焦螺旋，并适当增加进光量。","mistake":"高倍观察时不可大幅转动粗准焦螺旋。","question":"从低倍换到高倍后，视野亮度和看到的细胞数量通常怎样变化？"}]};
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"optical-microscope","version":"2.7.5","publish":true,"title":{"zh":"光学显微镜模型","en":"Optical Microscope Model"},"summary":{"zh":"认识光学显微镜的机械结构、成像系统、照明光路和规范调焦过程。","en":"Explore the mechanical structure, imaging system, illumination path and focusing procedure of a compound light microscope."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"threejs","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"overview","title":{"zh":"整体结构","en":"Overall Structure"}},{"id":"optical-system","title":{"zh":"成像系统","en":"Imaging System"}},{"id":"stage-focus","title":{"zh":"载物与调焦","en":"Stage and Focus"}},{"id":"illumination","title":{"zh":"照明光路","en":"Illumination Path"}},{"id":"low-power","title":{"zh":"低倍对焦","en":"Low-power Focusing"}},{"id":"high-power","title":{"zh":"高倍观察","en":"High-power Observation"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const speeds = [0.5, 1, 1.5, 2];
const views = ["整体视角", "正面视角", "侧面视角", "光轴视角"];
const DEFAULT_STATE = Object.freeze({
  stageIndex: 0,
  playing: false,
  speedIndex: 1,
  labels: true,
  highlight: true,
  viewIndex: 0,
  selectedPart: "",
  objective: 4,
  coarseFocus: -2,
  fineFocus: 0,
  diaphragm: 65,
  mirrorSide: "plane",
  adjustingFocus: false,
});
const state = { ...DEFAULT_STATE };
let microscopeRuntime = null;
let shellExperience=null;
let threeLoadAttempts=0;
const controlSignatures=new Map();
let threeModulePromise = null;
let autoStageChangedAt = performance.now();
let focusHighlightTimer = 0;

const PARTS = [
  { id: "eyepiece", zh: "目镜", en: "Eyepiece" },
  { id: "tube", zh: "镜筒", en: "Body Tube" },
  { id: "nosepiece", zh: "转换器", en: "Nosepiece" },
  { id: "objectives", zh: "物镜", en: "Objectives" },
  { id: "stage", zh: "载物台", en: "Stage" },
  { id: "coarse-focus", zh: "粗准焦", en: "Coarse Focus" },
  { id: "fine-focus", zh: "细准焦", en: "Fine Focus" },
  { id: "illumination", zh: "照明系统", en: "Illumination" },
  { id: "mirror", zh: "反光镜", en: "Mirror" },
  { id: "arm", zh: "镜臂", en: "Arm" },
  { id: "base", zh: "镜座", en: "Base" },
  { id: "specimen", zh: "玻片标本", en: "Specimen Slide" },
];

const STAGE_FOCUS_PARTS = {
  overview: [],
  "optical-system": ["eyepiece", "tube", "nosepiece", "objectives"],
  "stage-focus": ["stage", "specimen", "coarse-focus", "fine-focus"],
  illumination: ["mirror", "illumination", "stage", "specimen", "objectives", "tube", "eyepiece", "light-path"],
  "low-power": ["objectives", "coarse-focus", "fine-focus", "stage", "specimen"],
  "high-power": ["objectives", "fine-focus", "stage", "specimen"],
};
const FOCUS_OPTICAL_PATH_PARTS = ["mirror", "illumination", "stage", "specimen", "objectives", "tube", "eyepiece", "light-path"];
const FOCUS_PROFILES = {
  4: { coarse: -2, fine: 0 },
  10: { coarse: -2, fine: 2 },
  40: { coarse: -2, fine: 4 },
};

function focusMetrics() {
  const profile = FOCUS_PROFILES[state.objective] || FOCUS_PROFILES[4];
  const coarseError = Math.abs(state.coarseFocus - profile.coarse);
  const fineError = Math.abs(state.fineFocus - profile.fine);
  const highPower = state.objective === 40;
  const lowPowerBaseMissing = highPower && coarseError > 0.5;
  const focusError = highPower
    ? Math.max(lowPowerBaseMissing ? 2.3 : 0, fineError * 0.45)
    : coarseError * 1.15 + fineError * 0.12;
  const blur = Math.min(5.5, focusError * 0.85);
  return { blur, highPower, lowPowerBaseMissing, isClear: blur < 0.55 };
}

function illuminationMetrics() {
  const apertureRatio = Math.max(0, Math.min(1, (state.diaphragm - 20) / 80));
  const apertureFactor = 0.5 + apertureRatio * 0.55;
  const mirrorFactor = state.mirrorSide === "concave" ? 1.16 : 0.86;
  const objectiveFactor = state.objective === 40 ? 0.78 : state.objective === 10 ? 0.94 : 1;
  const brightness = Math.max(0.28, Math.min(1.22, apertureFactor * mirrorFactor * objectiveFactor));
  const level = brightness >= 0.92 ? "明亮" : brightness >= 0.68 ? "适中" : "较暗";
  return { brightness, level, mirrorName: state.mirrorSide === "concave" ? "凹面镜" : "平面镜" };
}

function currentStage() {
  return ANDER_MODEL_CONTENT.stages[state.stageIndex] || ANDER_MODEL_CONTENT.stages[0];
}

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

const root = document.querySelector("[data-independent-model-root]");
root.innerHTML = `
  <main class="independent-model-app" data-model-app>
    <header class="independent-model-header">
      <a class="independent-model-back" href="${resolveModelLibraryUrl()}" aria-label="返回主页">
        <span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span>
        <span class="independent-model-back-label"><span>返回</span><span>主页</span></span>
      </a>
      <div class="independent-model-heading">
        <span class="independent-model-kicker">${ANDER_MODEL_CONTENT.chapter}</span>
        <h1>${ANDER_MODEL_CONTENT.title} <small>/ ${ANDER_MODEL_CONTENT.titleEn}</small></h1>
      </div>
    </header>
    <section class="independent-model-workspace">
      <section class="model-area" data-model-area>
        <nav class="stage-strip" data-stage-strip aria-label="模型阶段"></nav>
        <div class="model-stage" data-model-stage>
          <div class="microscope-layout">
            <div class="microscope-view-tools" aria-label="模型取景">
              <button type="button" data-microscope-view="fit">完整视图</button>
              <button type="button" data-microscope-view="in" aria-label="放大模型">＋</button>
              <button type="button" data-microscope-view="out" aria-label="缩小模型">−</button>
              <button type="button" data-microscope-view="panel">调节与目镜 ↓</button>
            </div>
            <div class="microscope-viewport" data-microscope-viewport aria-label="Three.js WebGL 光学显微镜模型">
              <div class="microscope-host" data-microscope-host></div>
              <div class="microscope-labels" data-microscope-labels></div>
              <div class="microscope-loading" data-microscope-loading>正在构建光学显微镜...</div>
            </div>
            <aside class="microscope-sidepanel" aria-label="显微镜部件与调节">
              <h2>结构聚焦 <small>Structure Focus</small></h2>
              <p class="microscope-panel-note">点击部件突出显示，再次点击恢复整体模型。</p>
              <div class="microscope-status" data-microscope-status></div>
              <div class="microscope-part-grid" data-part-grid></div>
              <section class="microscope-control-block">
                <h3>物镜倍率 / Objective</h3>
                <div class="microscope-objectives" data-objective-buttons></div>
                <label class="microscope-range">
                  <span>粗准焦螺旋 <output data-coarse-output></output></span>
                  <input type="range" min="-10" max="10" step="1" data-coarse-focus aria-label="粗准焦螺旋" />
                </label>
                <label class="microscope-range">
                  <span>细准焦螺旋 <output data-fine-output></output></span>
                  <input type="range" min="-10" max="10" step="1" data-fine-focus aria-label="细准焦螺旋" />
                </label>
                <label class="microscope-range">
                  <span>遮光器光圈 <output data-diaphragm-output></output></span>
                  <input type="range" min="20" max="100" step="1" data-diaphragm aria-label="遮光器光圈大小" />
                </label>
                <div class="microscope-mirror-control">
                  <h3>反光镜镜面 / Mirror Side</h3>
                  <div class="microscope-mirror-buttons" data-mirror-buttons></div>
                </div>
              </section>
              <div class="microscope-field-card">
                <div class="microscope-field-view" data-field-view>
                  <i class="microscope-field-cell"></i>
                </div>
                <div class="microscope-field-copy"><strong data-field-title></strong><span data-field-copy></span></div>
              </div>
            </aside>
          </div>
        </div>
        <div class="control-dock">
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
          <div class="control-group control-group-end">
            <button class="control-button" type="button" data-action="fullscreen"></button>
          </div>
        </div>
      </section>
    </section>
  </main>
`;

// Move the original result and controls as one observation station; retain every input node.
const sidepanel=root.querySelector('.microscope-sidepanel'),information=document.createElement('div'),lab=document.createElement('section');
information.className='microscope-information';lab.className='microscope-lab';lab.setAttribute('aria-label','目镜结果与调焦');
sidepanel.before(information);information.append(lab,sidepanel);
lab.innerHTML='<div class="microscope-lab-heading"><h2>目镜与调焦</h2><button type="button" data-microscope-context>调节与部件 ↗</button></div>';
lab.append(sidepanel.querySelector('.microscope-field-card'),sidepanel.querySelector('.microscope-control-block'));
const field=lab.querySelector('[data-field-view]'),eyeFrame=document.createElement('div');eyeFrame.className='microscope-eyepiece-frame';field.before(eyeFrame);eyeFrame.append(field);
lab.querySelector('.microscope-field-copy').insertAdjacentHTML('beforeend','<span data-focus-summary aria-live="polite"></span>');
const lighting=document.createElement('div');lighting.className='microscope-light-controls';lab.querySelector('.microscope-control-block').append(lighting);lighting.append(lab.querySelector('[data-diaphragm]').closest('label'),lab.querySelector('.microscope-mirror-control'));
sidepanel.insertAdjacentHTML('beforeend','<section class="microscope-stage-notes" data-stage-notes></section>');
const viewTools=root.querySelector('.control-group-view');for(const button of root.querySelectorAll('[data-microscope-view]:not([data-microscope-view="panel"])')){button.className='control-button';viewTools.append(button);}root.querySelector('.microscope-view-tools').remove();
root.querySelector('.independent-model-header').insertAdjacentHTML('beforeend','<button class="shell-icon-button" type="button" data-microscope-settings></button>');
root.querySelector('.control-group-end').outerHTML='<button class="control-button" type="button" data-shell-tools></button><div class="control-group control-group-personal"><button class="control-button" type="button" data-shell-help></button><button class="control-button" type="button" data-shell-favorite></button><button class="control-button" type="button" data-action="fullscreen"></button></div>';

// Keep the instrument's controls beside its live result. Only immersion or very
// short portrait screens use the bottom dock; always move the original inputs.
const adjustmentDock=document.createElement('div');adjustmentDock.className='timeline-wrap microscope-adjustments';adjustmentDock.hidden=true;
root.querySelector('.control-group-primary').after(adjustmentDock);
const adjustmentHomes=[...lab.querySelectorAll('.microscope-range')].map((node,index)=>{const marker=document.createComment('microscope-range-home');node.before(marker);const label=node.querySelector('span').firstChild;return {node,marker,label,fullLabel:label.textContent,shortLabel:['粗调 ','细调 ','光圈 '][index]};});
function syncAdjustmentPlacement(){
 const docked=refs.modelArea.dataset.immersive==='true'||matchMedia('(max-width:679px) and (max-height:580px) and (orientation:portrait)').matches;
 const compact=docked||matchMedia('(max-width:679px)').matches||document.body.dataset.shellCompact==='true';
 const placement=`${docked}:${compact}`;
 if(adjustmentDock.dataset.active===placement)return;
 adjustmentDock.dataset.active=placement;adjustmentDock.hidden=!docked;refs.modelArea.dataset.exposedAdjustments=String(docked);
 for(const {node,marker,label,fullLabel,shortLabel} of adjustmentHomes){label.textContent=compact?shortLabel:fullLabel;if(docked)adjustmentDock.append(node);else marker.after(node);}
}

const refs = {
  modelArea: document.querySelector("[data-model-area]"),
  stageStrip: document.querySelector("[data-stage-strip]"),
  viewport: document.querySelector("[data-microscope-viewport]"),
  host: document.querySelector("[data-microscope-host]"),
  labels: document.querySelector("[data-microscope-labels]"),
  loading: document.querySelector("[data-microscope-loading]"),
  status: document.querySelector("[data-microscope-status]"),
  partGrid: document.querySelector("[data-part-grid]"),
  objectiveButtons: document.querySelector("[data-objective-buttons]"),
  coarse: document.querySelector("[data-coarse-focus]"),
  fine: document.querySelector("[data-fine-focus]"),
  coarseOutput: document.querySelector("[data-coarse-output]"),
  fineOutput: document.querySelector("[data-fine-output]"),
  diaphragm: document.querySelector("[data-diaphragm]"),
  diaphragmOutput: document.querySelector("[data-diaphragm-output]"),
  mirrorButtons: document.querySelector("[data-mirror-buttons]"),
  field: document.querySelector("[data-field-view]"),
  fieldTitle: document.querySelector("[data-field-title]"),
  fieldCopy: document.querySelector("[data-field-copy]"),
  lesson: document.querySelector("[data-stage-notes]"),
};

function buttonContent(name, label) {
  return globalThis.AnderModelShell.controlContent(name, label);
}

function renderStages(){
 if(!refs.stageStrip.childElementCount){refs.stageStrip.style.setProperty('--stage-count',String(ANDER_MODEL_CONTENT.stages.length));refs.stageStrip.innerHTML=ANDER_MODEL_CONTENT.stages.map((stage,index)=>`<button class="stage-tab" type="button" data-stage-index="${index}">${globalThis.AnderModelShell.stageContent(index,stage.title,stage.titleEn)}</button>`).join('');}
 for(const button of refs.stageStrip.children){const active=Number(button.dataset.stageIndex)===state.stageIndex;button.classList.toggle('is-active',active);button.setAttribute('aria-current',active?'step':'false');}
 globalThis.AnderModelShell.syncActiveStage();shellExperience?.syncStage();
}

function renderControls(){
 const values={play:[state.playing?'pause':'play',state.playing?'暂停':'播放'],reset:['reset','重置'],prev:['prev','上一步'],next:['next','下一步'],speed:['speed',speeds[state.speedIndex]+'×'],labels:['labels','标签',state.labels],highlight:['highlight','高亮',state.highlight],view:['view','视角']};
 for(const [action,args] of Object.entries(values)){const key=JSON.stringify(args);if(controlSignatures.get(action)===key)continue;globalThis.AnderModelShell.setControl(root.querySelector(`[data-action="${action}"]`),...args);controlSignatures.set(action,key);}
}

function renderPanel() {
  if(!refs.partGrid.childElementCount) refs.partGrid.innerHTML = PARTS.map((part) => `
    <button class="microscope-part-button ${state.selectedPart === part.id ? "is-active" : ""}" type="button" data-part="${part.id}" aria-pressed="${state.selectedPart === part.id}">
      <strong>${part.zh}</strong><span>${part.en}</span>
    </button>
  `).join("");
  if(!refs.objectiveButtons.childElementCount) refs.objectiveButtons.innerHTML = [4, 10, 40].map((value) => `
    <button class="microscope-objective-button ${state.objective === value ? "is-active" : ""}" type="button" data-objective="${value}" aria-pressed="${state.objective === value}">${value}×</button>
  `).join("");
  refs.coarse.value = String(state.coarseFocus);
  refs.fine.value = String(state.fineFocus);
  refs.diaphragm.value = String(state.diaphragm);
  const coarseLocked = state.objective === 40;
  refs.coarse.disabled = coarseLocked;
  refs.coarse.closest(".microscope-range")?.classList.toggle("is-locked", coarseLocked);
  refs.coarse.title = coarseLocked ? "高倍镜下锁定粗准焦，请只使用细准焦螺旋" : "低倍镜下先用粗准焦进入清晰范围";
  refs.coarseOutput.value = coarseLocked ? "高倍锁定" : `${(state.coarseFocus * 0.1).toFixed(1)} mm`;
  refs.fineOutput.value = `${(state.fineFocus * 0.01).toFixed(2)} mm`;
  refs.diaphragmOutput.value = `${state.diaphragm}%`;
  if(!refs.mirrorButtons.childElementCount) refs.mirrorButtons.innerHTML = [
    { id: "plane", label: "平面镜" },
    { id: "concave", label: "凹面镜" },
  ].map((item) => `
    <button class="microscope-objective-button ${state.mirrorSide === item.id ? "is-active" : ""}" type="button" data-mirror-side="${item.id}" aria-pressed="${state.mirrorSide === item.id}">${item.label}</button>
  `).join("");

  for(const [selector,attribute,value] of [['[data-part]','part',state.selectedPart],['[data-objective]','objective',String(state.objective)],['[data-mirror-side]','mirrorSide',state.mirrorSide]])for(const b of root.querySelectorAll(selector)){const active=b.dataset[attribute]===value;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));}
  const focus = focusMetrics();
  const illumination = illuminationMetrics();
  refs.field.style.filter = `blur(${focus.blur.toFixed(2)}px) brightness(${illumination.brightness.toFixed(2)})`;
  refs.field.style.setProperty("--cell-scale", String(state.objective === 40 ? 2.7 : state.objective === 10 ? 1.35 : 0.78));
  refs.fieldTitle.textContent = `${state.objective * 10}× 总放大 · ${Math.round(illumination.brightness * 100)}%亮度`;
  const lightSummary = `光圈 ${state.diaphragm}%、${illumination.mirrorName}，视野${illumination.level}`;
  if (focus.lowPowerBaseMissing) {
    refs.fieldCopy.textContent = `粗准焦未处于低倍清晰位置；请返回低倍完成对焦，再切换高倍。${lightSummary}。`;
  } else if (focus.isClear) {
    refs.fieldCopy.textContent = `${state.objective}×物镜：物像清晰。${lightSummary}。`;
  } else if (focus.highPower) {
    refs.fieldCopy.textContent = `高倍镜已锁定粗准焦，请只调节细准焦螺旋。${lightSummary}。`;
  } else {
    refs.fieldCopy.textContent = `先用粗准焦进入清晰范围，再用细准焦微调。${lightSummary}。`;
  }

  root.querySelector('[data-focus-summary]').textContent=focus.lowPowerBaseMissing?'请先返回低倍对焦':focus.isClear?'物像清晰':focus.highPower?'高倍：调节细准焦':'调节粗准焦，再微调';
  const activePart = PARTS.find((part) => part.id === state.selectedPart);
  refs.status.innerHTML = activePart
    ? `<strong>${activePart.zh}</strong> · ${activePart.en}<br>再次点击该按钮可恢复整体显示。`
    : `<strong>${currentStage().title}</strong> · ${currentStage().goal}`;
}

function renderLesson(){const stage=currentStage();refs.lesson.innerHTML=`<h3>${stage.title}</h3><p>${stage.explanation}</p><p>${stage.mistake}</p>`;}

function syncUI() {
  renderStages();
  renderControls();
  renderPanel();
  renderLesson();
  microscopeRuntime?.applyState();
  reportModelState();
}

function setStage(index) {
  state.stageIndex = (Number(index) + ANDER_MODEL_CONTENT.stages.length) % ANDER_MODEL_CONTENT.stages.length;
  state.selectedPart = "";
  if (currentStage().id === "low-power") {
    state.objective = 4;
    state.coarseFocus = -2;
    state.fineFocus = 0;
  }
  if (currentStage().id === "high-power") {
    state.objective = 40;
  }
  autoStageChangedAt = performance.now();
  syncUI();
}

function resetState() {
  window.clearTimeout(focusHighlightTimer);
  Object.assign(state, DEFAULT_STATE);
  autoStageChangedAt = performance.now();
  microscopeRuntime?.resetView();
  syncUI();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-microscope-view]");
  if (viewButton) {
    const layout = document.querySelector(".microscope-layout");
    if (viewButton.dataset.microscopeView === "panel") {
      const panel = document.querySelector(".microscope-sidepanel");
      layout.scrollTop += panel.getBoundingClientRect().top - layout.getBoundingClientRect().top - 38;
    } else {
      layout.scrollTop = 0;
      if (viewButton.dataset.microscopeView === "fit") microscopeRuntime?.fitView();
      else microscopeRuntime?.zoomBy(viewButton.dataset.microscopeView === "in" ? 1.25 : 0.8);
    }
    return;
  }
  const stageButton = event.target.closest("[data-stage-index]");
  if (stageButton) return setStage(stageButton.dataset.stageIndex);

  const partButton = event.target.closest("[data-part]");
  if (partButton) {
    state.selectedPart = state.selectedPart === partButton.dataset.part ? "" : partButton.dataset.part;
    if (state.selectedPart) state.highlight = true;
    return syncUI();
  }

  const objectiveButton = event.target.closest("[data-objective]");
  if (objectiveButton) {
    state.objective = Number(objectiveButton.dataset.objective);
    state.selectedPart = "objectives";
    return syncUI();
  }

  const mirrorButton = event.target.closest("[data-mirror-side]");
  if (mirrorButton) {
    state.mirrorSide = mirrorButton.dataset.mirrorSide;
    state.selectedPart = "mirror";
    state.highlight = true;
    return syncUI();
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === "play") state.playing = !state.playing;
  if (action === "reset") return resetState();
  if (action === "prev") return setStage(state.stageIndex - 1);
  if (action === "next") return setStage(state.stageIndex + 1);
  if (action === "speed") state.speedIndex = (state.speedIndex + 1) % speeds.length;
  if (action === "labels") state.labels = !state.labels;
  if (action === "highlight") state.highlight = !state.highlight;
  if (action === "view") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    microscopeRuntime?.applyView(state.viewIndex);
  }
  if (action === "fullscreen") return; // Shared shell owns fullscreen.
  autoStageChangedAt = performance.now();
  syncUI();
});

refs.coarse.addEventListener("input", (event) => {
  if (state.objective === 40) return;
  state.coarseFocus = Number(event.target.value);
  state.selectedPart = "";
  state.adjustingFocus = true;
  state.highlight = true;
  window.clearTimeout(focusHighlightTimer);
  focusHighlightTimer = window.setTimeout(() => {
    state.adjustingFocus = false;
    syncUI();
  }, 1100);
  syncUI();
});
refs.fine.addEventListener("input", (event) => {
  state.fineFocus = Number(event.target.value);
  state.selectedPart = "";
  state.adjustingFocus = true;
  state.highlight = true;
  window.clearTimeout(focusHighlightTimer);
  focusHighlightTimer = window.setTimeout(() => {
    state.adjustingFocus = false;
    syncUI();
  }, 1100);
  syncUI();
});
refs.diaphragm.addEventListener("input", (event) => {
  state.diaphragm = Number(event.target.value);
  state.selectedPart = "illumination";
  state.highlight = true;
  syncUI();
});


function emitModelMessage(type, payload = {}, requestId) {
  if (window.parent === window) return;
  const origin = document.referrer ? new URL(document.referrer).origin : "*";
  window.parent.postMessage({ source: "ander-model", protocolVersion: "1.0", modelId: ANDER_MODEL_MANIFEST.id, type, requestId, payload }, origin);
}

function reportModelState() {
  emitModelMessage("model:state", {
    stageIndex: state.stageIndex,
    stageId: currentStage().id,
    playing: state.playing,
    speed: speeds[state.speedIndex],
    labels: state.labels,
    highlight: state.highlight,
    viewIndex: state.viewIndex,
    objective: state.objective,
    diaphragm: state.diaphragm,
    mirrorSide: state.mirrorSide,
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
    const index = ANDER_MODEL_CONTENT.stages.findIndex((stage) => stage.id === payload.stageId);
    return setStage(index < 0 ? 0 : index);
  }
  if (message.type === "host:set-speed") {
    const index = speeds.indexOf(Number(payload.speed));
    if (index >= 0) state.speedIndex = index;
  }
  if (message.type === "host:set-labels") state.labels = payload.visible !== false;
  if (message.type === "host:set-highlight") state.highlight = Boolean(payload.enabled);
  if (message.type === "host:set-view") {
    const index = views.indexOf(payload.viewId);
    state.viewIndex = Math.max(0, index);
    microscopeRuntime?.applyView(state.viewIndex);
  }
  syncUI();
}

window.addEventListener("message", handleHostMessage);

function loadThree() {
  if (!threeModulePromise) threeModulePromise = import("./vendor/three.module.min.js"+(threeLoadAttempts++?"?retry="+threeLoadAttempts:""));
  return threeModulePromise;
}

function roundedRectShape(THREE, width, depth, radius) {
  const x = -width / 2;
  const y = -depth / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function roundedBoxGeometry(THREE, width, height, depth, radius = 0.16) {
  const geometry = new THREE.ExtrudeGeometry(roundedRectShape(THREE, width, depth, radius), {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(radius * 0.45, height * 0.22),
    bevelThickness: Math.min(radius * 0.35, height * 0.18),
    curveSegments: 8,
  });
  geometry.translate(0, 0, -height / 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  return geometry;
}

function microscopeArmGeometry(THREE) {
  const shape = new THREE.Shape();
  shape.moveTo(1.55, 0.45);
  shape.lineTo(4.38, 0.45);
  shape.lineTo(4.38, 7.45);
  shape.bezierCurveTo(4.36, 9.9, 2.72, 11.72, 0.62, 12.2);
  shape.lineTo(0.58, 10.4);
  shape.bezierCurveTo(1.48, 10.12, 2.86, 8.92, 2.92, 7.0);
  shape.lineTo(2.86, 1.25);
  shape.lineTo(1.55, 0.45);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.76,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.16,
    bevelThickness: 0.14,
    curveSegments: 28,
  });
  geometry.translate(0, 0, -0.88);
  geometry.rotateY(Math.PI / 2);
  return geometry;
}

function rodBetween(THREE, start, end, radius, material, partId, registerMesh) {
  const direction = end.clone().sub(start);
  const mesh = registerMesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 18), material, partId);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function buildMicroscope(THREE, labelsLayer) {
  const root = new THREE.Group();
  root.name = "光学显微镜";
  const partGroups = new Map();
  const meshes = [];
  const labelAnchors = [];

  const materials = {
    body: new THREE.MeshStandardMaterial({ color: 0xf2f3ef, roughness: 0.4, metalness: 0.08 }),
    bodyShadow: new THREE.MeshStandardMaterial({ color: 0xd5d9d4, roughness: 0.38, metalness: 0.18 }),
    bodyDark: new THREE.MeshStandardMaterial({ color: 0x36433f, roughness: 0.42, metalness: 0.22 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xa7b4ad, roughness: 0.26, metalness: 0.72 }),
    black: new THREE.MeshStandardMaterial({ color: 0x22332d, roughness: 0.35, metalness: 0.48 }),
    brass: new THREE.MeshStandardMaterial({ color: 0x313b37, roughness: 0.32, metalness: 0.58 }),
    fine: new THREE.MeshStandardMaterial({ color: 0x77817c, roughness: 0.3, metalness: 0.54 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xb7e4df, roughness: 0.08, transmission: 0.52, transparent: true, opacity: 0.72, thickness: 0.18 }),
    mirror: new THREE.MeshStandardMaterial({ color: 0xe9f8f8, roughness: 0.08, metalness: 0.72, emissive: 0x315d60, emissiveIntensity: 0.42 }),
    specimen: new THREE.MeshStandardMaterial({ color: 0x78a85c, roughness: 0.56, transparent: true, opacity: 0.74 }),
    objective4: new THREE.MeshStandardMaterial({ color: 0xd94b4b, roughness: 0.34, metalness: 0.5 }),
    objective10: new THREE.MeshStandardMaterial({ color: 0xe0b33d, roughness: 0.34, metalness: 0.5 }),
    objective40: new THREE.MeshStandardMaterial({ color: 0x3e79bd, roughness: 0.34, metalness: 0.5 }),
    light: new THREE.MeshBasicMaterial({ color: 0xffd45a, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
  };

  function groupFor(partId) {
    if (!partGroups.has(partId)) {
      const group = new THREE.Group();
      group.userData.partId = partId;
      partGroups.set(partId, group);
      root.add(group);
    }
    return partGroups.get(partId);
  }

  function registerMesh(geometry, sourceMaterial, partId, name = partId) {
    const material = sourceMaterial.clone();
    material.userData.baseOpacity = material.opacity;
    material.userData.baseTransparent = material.transparent;
    material.userData.baseColor = material.color?.clone();
    material.userData.baseEmissive = material.emissive?.clone();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.userData.partId = partId;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshes.push(mesh);
    return mesh;
  }

  function addLabel(text, color, target, offset) {
    const element = document.createElement("span");
    element.className = "microscope-label";
    element.textContent = text;
    element.style.setProperty("--label-color", color);
    labelsLayer.appendChild(element);
    labelAnchors.push({ element, target, offset: new THREE.Vector3(...offset) });
  }

  const base = groupFor("base");
  const leftFoot = registerMesh(roundedBoxGeometry(THREE, 1.5, 0.58, 5.4, 0.38), materials.body, "base", "镜座左脚");
  leftFoot.position.set(-2.35, 0.38, 0.25);
  const rightFoot = leftFoot.clone();
  rightFoot.material = leftFoot.material.clone();
  rightFoot.position.x = 2.35;
  meshes.push(rightFoot);
  const bridge = registerMesh(roundedBoxGeometry(THREE, 5.8, 0.68, 2.75, 0.42), materials.body, "base", "镜座后桥");
  bridge.position.set(0, 0.43, -3.05);
  base.add(leftFoot, rightFoot, bridge);
  const padMaterial = materials.black;
  [-2.35, 2.35].forEach((x) => {
    const pad = registerMesh(roundedBoxGeometry(THREE, 1.08, 0.12, 4.7, 0.25), padMaterial, "base", "防滑垫");
    pad.position.set(x, 0.08, 0.28);
    base.add(pad);
  });

  const arm = groupFor("arm");
  const armBody = registerMesh(microscopeArmGeometry(THREE), materials.body, "arm", "C形镜臂");
  arm.add(armBody);
  const guideBack = registerMesh(roundedBoxGeometry(THREE, 1.46, 2.55, 0.4, 0.15), materials.bodyShadow, "arm", "镜筒升降导轨座");
  guideBack.position.set(0, 10.55, -0.8);
  arm.add(guideBack);
  [-0.44, 0.44].forEach((x) => {
    const guideRail = rodBetween(THREE, new THREE.Vector3(x, 9.35, -0.5), new THREE.Vector3(x, 11.75, -0.5), 0.065, materials.metal, "arm", registerMesh);
    arm.add(guideRail);
  });
  const focusRack = registerMesh(roundedBoxGeometry(THREE, 0.2, 2.3, 0.1, 0.035), materials.metal, "arm", "调焦齿条");
  focusRack.position.set(0, 10.55, -0.47);
  arm.add(focusRack);

  const stage = groupFor("stage");
  const stagePlate = registerMesh(roundedBoxGeometry(THREE, 6.4, 0.36, 4.4, 0.32), materials.bodyDark, "stage", "载物台");
  stagePlate.position.set(0, 6.05, 0);
  stage.add(stagePlate);
  const stageSupport = rodBetween(THREE, new THREE.Vector3(0, 6.0, -3.15), new THREE.Vector3(0, 6.0, -1.75), 0.34, materials.body, "stage", registerMesh);
  stage.add(stageSupport);
  const aperture = registerMesh(new THREE.CylinderGeometry(0.52, 0.52, 0.39, 48), materials.black, "stage", "通光孔");
  aperture.position.set(0, 6.08, 0);
  stage.add(aperture);

  const specimen = groupFor("specimen");
  const slide = registerMesh(roundedBoxGeometry(THREE, 4.2, 0.11, 1.5, 0.13), materials.glass, "specimen", "载玻片");
  slide.position.set(0, 6.31, 0);
  specimen.add(slide);
  const specimenPatch = registerMesh(new THREE.CylinderGeometry(0.38, 0.38, 0.035, 36), materials.specimen, "specimen", "洋葱表皮标本");
  specimenPatch.position.set(0, 6.39, 0);
  specimen.add(specimenPatch);
  [-1, 1].forEach((side) => {
    const outer = new THREE.Vector3(side * 1.88, 6.49, -0.48);
    const inner = new THREE.Vector3(side * 0.76, 6.49, 0.08);
    const direction = inner.clone().sub(outer);
    const clip = registerMesh(roundedBoxGeometry(THREE, Math.hypot(direction.x, direction.z), 0.09, 0.2, 0.06), materials.metal, "stage", "压片夹弹片");
    clip.position.copy(outer).add(inner).multiplyScalar(0.5);
    clip.rotation.y = Math.atan2(-direction.z, direction.x);
    const pivot = registerMesh(new THREE.CylinderGeometry(0.18, 0.18, 0.16, 32), materials.metal, "stage", "压片夹转轴");
    pivot.position.copy(outer);
    const pad = registerMesh(roundedBoxGeometry(THREE, 0.34, 0.1, 0.26, 0.07), materials.metal, "stage", "压片夹压片端");
    pad.position.copy(inner);
    stage.add(clip, pivot, pad);
  });

  const illumination = groupFor("illumination");
  const condenser = registerMesh(new THREE.CylinderGeometry(0.75, 0.55, 0.72, 48), materials.bodyDark, "illumination", "聚光器");
  condenser.position.set(0, 5.35, 0);
  illumination.add(condenser);
  const condenserLens = registerMesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 48), materials.glass, "illumination", "聚光镜");
  condenserLens.position.set(0, 5.74, 0);
  illumination.add(condenserLens);
  const diaphragmRim = registerMesh(new THREE.TorusGeometry(0.75, 0.09, 14, 64), materials.brass, "illumination", "遮光器外环");
  diaphragmRim.rotation.x = Math.PI / 2;
  diaphragmRim.position.set(0, 4.86, 0);
  illumination.add(diaphragmRim);
  const diaphragmAperture = registerMesh(new THREE.RingGeometry(0.48, 0.72, 64), materials.black, "illumination", "可变光圈");
  diaphragmAperture.rotation.x = -Math.PI / 2;
  diaphragmAperture.position.set(0, 4.86, 0);
  diaphragmAperture.material.side = THREE.DoubleSide;
  diaphragmAperture.userData.apertureRadius = 0.48;
  illumination.add(diaphragmAperture);
  const diaphragmLever = rodBetween(THREE, new THREE.Vector3(-0.1, 4.85, 0), new THREE.Vector3(-1.25, 4.75, 0.2), 0.07, materials.brass, "illumination", registerMesh);
  illumination.add(diaphragmLever);

  const mirror = groupFor("mirror");
  const mirrorBracket = registerMesh(roundedBoxGeometry(THREE, 1.9, 0.52, 0.78, 0.16), materials.bodyShadow, "mirror", "反光镜连接座");
  mirrorBracket.position.set(0, 2.45, -2.82);
  mirror.add(mirrorBracket);
  const mirrorHinge = rodBetween(THREE, new THREE.Vector3(-1.05, 2.45, -2.48), new THREE.Vector3(1.05, 2.45, -2.48), 0.13, materials.metal, "mirror", registerMesh);
  mirror.add(mirrorHinge);
  const mirrorSupportLeft = rodBetween(THREE, new THREE.Vector3(-0.78, 2.45, -2.48), new THREE.Vector3(-0.92, 3.42, -0.72), 0.11, materials.bodyDark, "mirror", registerMesh);
  const mirrorSupportRight = rodBetween(THREE, new THREE.Vector3(0.78, 2.45, -2.48), new THREE.Vector3(0.92, 3.42, -0.72), 0.11, materials.bodyDark, "mirror", registerMesh);
  mirror.add(mirrorSupportLeft, mirrorSupportRight);
  const mirrorYokeLeft = rodBetween(THREE, new THREE.Vector3(-0.92, 3.42, -0.72), new THREE.Vector3(-0.92, 3.45, 0), 0.1, materials.bodyDark, "mirror", registerMesh);
  const mirrorYokeRight = rodBetween(THREE, new THREE.Vector3(0.92, 3.42, -0.72), new THREE.Vector3(0.92, 3.45, 0), 0.1, materials.bodyDark, "mirror", registerMesh);
  const mirrorAxle = rodBetween(THREE, new THREE.Vector3(-1.05, 3.45, 0), new THREE.Vector3(1.05, 3.45, 0), 0.11, materials.bodyDark, "mirror", registerMesh);
  mirror.add(mirrorYokeLeft, mirrorYokeRight, mirrorAxle);
  const mirrorDiscGroup = new THREE.Group();
  mirrorDiscGroup.position.set(0, 3.45, 0);
  mirrorDiscGroup.rotation.x = 0.95;
  const mirrorFlipGroup = new THREE.Group();
  const mirrorFrame = registerMesh(new THREE.CylinderGeometry(0.92, 0.92, 0.16, 64), materials.bodyDark, "mirror", "反光镜边框");
  const mirrorFace = registerMesh(new THREE.CylinderGeometry(0.78, 0.78, 0.03, 64), materials.mirror, "mirror", "平面镜面");
  mirrorFace.position.y = 0.1;
  const concaveGeometry = new THREE.SphereGeometry(2.05, 64, 18, 0, Math.PI * 2, 0, 0.4);
  const mirrorConcaveFace = registerMesh(concaveGeometry, materials.mirror, "mirror", "凹面镜面");
  mirrorConcaveFace.position.y = -2.13;
  mirrorConcaveFace.material.side = THREE.DoubleSide;
  mirrorFlipGroup.add(mirrorFrame, mirrorFace, mirrorConcaveFace);
  mirrorDiscGroup.add(mirrorFlipGroup);
  mirror.add(mirrorDiscGroup);

  const head = new THREE.Group();
  root.add(head);
  head.userData.baseY = -0.36;
  head.position.y = head.userData.baseY;
  const tubeGroup = groupFor("tube");
  root.remove(tubeGroup);
  head.add(tubeGroup);
  const tubeCarriage = registerMesh(roundedBoxGeometry(THREE, 1.58, 0.64, 1.02, 0.17), materials.bodyShadow, "tube", "镜筒升降滑动座");
  tubeCarriage.position.set(0, 10.42, -0.38);
  tubeGroup.add(tubeCarriage);
  const tubeConnector = registerMesh(roundedBoxGeometry(THREE, 1.12, 0.4, 0.86, 0.12), materials.body, "tube", "镜筒连接座");
  tubeConnector.position.set(0, 10.36, -0.08);
  tubeGroup.add(tubeConnector);
  const tube = registerMesh(new THREE.CylinderGeometry(0.65, 0.72, 3.25, 48), materials.body, "tube", "镜筒");
  tube.position.set(0, 11.7, 0);
  tubeGroup.add(tube);
  const lowerTube = registerMesh(new THREE.CylinderGeometry(0.82, 0.75, 0.72, 48), materials.bodyDark, "tube", "镜筒下壳");
  lowerTube.position.set(0, 9.98, 0);
  tubeGroup.add(lowerTube);

  const eyepiece = groupFor("eyepiece");
  root.remove(eyepiece);
  head.add(eyepiece);
  const eyepieceBody = registerMesh(new THREE.CylinderGeometry(0.49, 0.42, 1.18, 48), materials.black, "eyepiece", "目镜");
  eyepieceBody.position.set(0, 13.9, 0);
  eyepiece.add(eyepieceBody);
  const eyepieceCollar = registerMesh(new THREE.CylinderGeometry(0.64, 0.58, 0.32, 48), materials.bodyDark, "eyepiece", "目镜套筒");
  eyepieceCollar.position.set(0, 13.35, 0);
  eyepiece.add(eyepieceCollar);
  const eyepieceLens = registerMesh(new THREE.CylinderGeometry(0.38, 0.38, 0.055, 48), materials.glass, "eyepiece", "目镜镜片");
  eyepieceLens.position.set(0, 14.52, 0);
  eyepiece.add(eyepieceLens);

  const nosepiece = groupFor("nosepiece");
  root.remove(nosepiece);
  head.add(nosepiece);
  nosepiece.position.set(0, 9.63, -0.82);
  const turretDisk = registerMesh(new THREE.CylinderGeometry(1.18, 1.05, 0.34, 64), materials.black, "nosepiece", "物镜转换器");
  nosepiece.add(turretDisk);
  const turretTrim = registerMesh(new THREE.TorusGeometry(1.02, 0.08, 12, 64), materials.metal, "nosepiece", "转换器金属边");
  turretTrim.rotation.x = Math.PI / 2;
  turretTrim.position.y = 0.2;
  nosepiece.add(turretTrim);

  const objectiveGroup = groupFor("objectives");
  root.remove(objectiveGroup);
  head.add(objectiveGroup);
  objectiveGroup.position.copy(nosepiece.position);
  const objectiveDefinitions = [
    { value: 4, angle: 0, length: 1.0, color: materials.objective4 },
    { value: 10, angle: Math.PI * 2 / 3, length: 1.18, color: materials.objective10 },
    { value: 40, angle: Math.PI * 4 / 3, length: 1.42, color: materials.objective40 },
  ];
  const objectiveMounts = [];
  objectiveDefinitions.forEach((definition) => {
    const mount = new THREE.Group();
    mount.userData.value = definition.value;
    mount.userData.radialAxis = new THREE.Vector3(Math.cos(definition.angle), 0, -Math.sin(definition.angle));
    mount.userData.targetQuaternion = new THREE.Quaternion();
    const radius = 0.82;
    mount.position.set(Math.sin(definition.angle) * radius, -0.18, Math.cos(definition.angle) * radius);
    const collar = registerMesh(new THREE.CylinderGeometry(0.34, 0.38, 0.32, 32), materials.metal, "objectives", `${definition.value}倍物镜接环`);
    collar.position.y = -0.08;
    const barrel = registerMesh(new THREE.CylinderGeometry(0.25, 0.3, definition.length, 32), materials.black, "objectives", `${definition.value}倍物镜`);
    barrel.position.y = -definition.length / 2 - 0.25;
    const ring = registerMesh(new THREE.CylinderGeometry(0.31, 0.31, 0.16, 32), definition.color, "objectives", `${definition.value}倍物镜色环`);
    ring.position.y = -definition.length * 0.52;
    const tip = registerMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.2, 32), materials.metal, "objectives", `${definition.value}倍物镜前端`);
    tip.position.y = -definition.length - 0.3;
    mount.add(collar, barrel, ring, tip);
    objectiveGroup.add(mount);
    objectiveMounts.push(mount);
  });

  const focusAxisCenter = new THREE.Vector3(0, 10.75, -2.72);
  const axis = rodBetween(THREE, new THREE.Vector3(-1.52, focusAxisCenter.y, focusAxisCenter.z), new THREE.Vector3(1.52, focusAxisCenter.y, focusAxisCenter.z), 0.13, materials.metal, "coarse-focus", registerMesh);
  root.add(axis);
  const coarseGroup = groupFor("coarse-focus");
  const fineGroup = groupFor("fine-focus");
  [-1, 1].forEach((side) => {
    const coarseKnob = registerMesh(new THREE.CylinderGeometry(0.62, 0.62, 0.3, 48), materials.brass, "coarse-focus", "粗准焦螺旋");
    coarseKnob.rotation.z = Math.PI / 2;
    coarseKnob.position.set(side * 1.18, focusAxisCenter.y, focusAxisCenter.z);
    coarseGroup.add(coarseKnob);
    const fineKnob = registerMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.2, 48), materials.fine, "fine-focus", "细准焦螺旋");
    fineKnob.rotation.z = Math.PI / 2;
    fineKnob.position.set(side * 1.46, focusAxisCenter.y, focusAxisCenter.z);
    fineGroup.add(fineKnob);
  });

  const lightPath = groupFor("light-path");
  const lightCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.25, 3.45),
    new THREE.Vector3(0, 3.45, 0),
    new THREE.Vector3(0, 5.2, 0),
    new THREE.Vector3(0, 6.38, 0),
    new THREE.Vector3(0, 8.0, 0),
    new THREE.Vector3(0, 9.45, 0),
    new THREE.Vector3(0, 11.6, 0),
    new THREE.Vector3(0, 14.45, 0),
  ]);
  const beam = registerMesh(new THREE.TubeGeometry(lightCurve, 96, 0.055, 10, false), materials.light, "light-path", "照明光路");
  lightPath.add(beam);
  const lightDots = Array.from({ length: 6 }, (_, index) => {
    const dot = registerMesh(new THREE.SphereGeometry(0.13, 16, 12), materials.light, "light-path", "光线粒子");
    dot.userData.phase = index / 6;
    lightPath.add(dot);
    return dot;
  });

  addLabel("目镜", "#2F4858", eyepiece, [0.75, 14.25, 0]);
  addLabel("物镜", "#B76B2D", objectiveGroup, [1.4, -1.2, 0.4]);
  addLabel("载物台", "#365F54", stage, [-3.1, 6.55, 1.35]);
  addLabel("粗准焦", "#365F54", coarseGroup, [2.25, 11.3, -2.72]);
  addLabel("细准焦", "#557168", fineGroup, [2.52, 10.05, -2.72]);
  addLabel("聚光器", "#31816E", illumination, [1.3, 5.35, 0]);
  addLabel("反光镜", "#3E8595", mirror, [-1.45, 3.4, 0.15]);
  addLabel("镜臂", "#4D6F63", arm, [0, 7.9, -3.72]);
  addLabel("镜座", "#405B52", base, [3.1, 0.9, 1.4]);

  return {
    root,
    meshes,
    partGroups,
    labelAnchors,
    head,
    nosepiece,
    objectiveGroup,
    objectiveDefinitions,
    objectiveMounts,
    coarseGroup,
    fineGroup,
    diaphragmAperture,
    mirrorFlipGroup,
    lightPath,
    lightCurve,
    lightDots,
  };
}

async function mountMicroscope() {
  const THREE = await loadThree();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-label", "Three.js WebGL 光学显微镜模型");
  refs.host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
  const cameraTarget = new THREE.Vector3(0, 7.1, -0.2);
  const viewPresets = [
    { position: new THREE.Vector3(15.5, 11.0, 19.0), target: new THREE.Vector3(0, 7.1, -0.2) },
    { position: new THREE.Vector3(0.2, 8.6, 23.5), target: new THREE.Vector3(0, 7.1, -0.2) },
    { position: new THREE.Vector3(21.5, 8.6, 0.8), target: new THREE.Vector3(0, 7.0, -0.6) },
    { position: new THREE.Vector3(0.1, 18.8, 5.2), target: new THREE.Vector3(0, 7.2, 0) },
  ];
  camera.position.copy(viewPresets[0].position);
  camera.lookAt(cameraTarget);

  scene.add(new THREE.HemisphereLight(0xf4fff9, 0x9a8f78, 2.15));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(10, 22, 14);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1536, 1536);
  keyLight.shadow.camera.left = -18;
  keyLight.shadow.camera.right = 18;
  keyLight.shadow.camera.top = 20;
  keyLight.shadow.camera.bottom = -4;
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x99d7c6, 1.15);
  fillLight.position.set(-14, 9, 7);
  scene.add(fillLight);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(13.5, 80),
    new THREE.MeshStandardMaterial({ color: 0xf3efe2, roughness: 0.92, metalness: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  const model = buildMicroscope(THREE, refs.labels);
  scene.add(model.root);
  refs.loading.hidden = true;
  const labelLeaders = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  labelLeaders.classList.add("microscope-label-leaders");
  labelLeaders.setAttribute("aria-hidden", "true");
  refs.labels.prepend(labelLeaders);
  const leaderLines = model.labelAnchors.map(() => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    labelLeaders.appendChild(line);
    return line;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pointers = new Map();
  const panOffset = new THREE.Vector3();
  let gestureUsed = false;
  let multiTouchUsed = false;
  let gestureCancelled = false;
  let dragDistance = 0;
  const orbit = { radius: 1, phi: Math.PI / 2, theta: 0 };
  // Include the base, eyepiece and light path. The margin also covers focus travel.
  // This is camera framing only; scientific geometry and animation stay unchanged.
  const framingBounds = new THREE.Box3().setFromObject(model.root).expandByVector(new THREE.Vector3(0.7, 0.65, 0.7));
  const framingCenter = framingBounds.getCenter(new THREE.Vector3());
  const framingCorners = [];
  model.root.traverse((object) => {
    if (!object.geometry) return;
    if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
    const bounds = object.geometry.boundingBox;
    // Per-object boxes avoid treating the empty corners around the microscope as solid.
    const worldBounds = bounds.clone().applyMatrix4(object.matrixWorld).expandByVector(new THREE.Vector3(0.25, 0.55, 0.25));
    for (const x of [worldBounds.min.x, worldBounds.max.x]) {
      for (const y of [worldBounds.min.y, worldBounds.max.y]) {
        for (const z of [worldBounds.min.z, worldBounds.max.z]) framingCorners.push(new THREE.Vector3(x, y, z).sub(framingCenter));
      }
    }
  });
  let viewScale = 1;
  let fittedRadius = 1;
  const viewportSize = { width: 1, height: 1 };

  function syncOrbitFromCamera() {
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(cameraTarget));
    orbit.radius = spherical.radius;
    orbit.phi = spherical.phi;
    orbit.theta = spherical.theta;
  }

  function applyOrbit() {
    const offset = new THREE.Vector3().setFromSpherical(
      new THREE.Spherical(orbit.radius, orbit.phi, orbit.theta),
    );
    camera.position.copy(cameraTarget).add(offset);
    camera.up.set(0, 1, 0);
    camera.lookAt(cameraTarget);
  }

  syncOrbitFromCamera();

  function fitCamera() {
    cameraTarget.copy(framingCenter).add(panOffset);
    applyOrbit();
    const inverse = camera.quaternion.clone().invert();
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.9;
    fittedRadius = Math.max(...framingCorners.map((corner) => {
      const p = corner.clone().applyQuaternion(inverse);
      return Math.max(Math.abs(p.x) / (tangent * camera.aspect), Math.abs(p.y) / tangent) + p.z;
    }));
    orbit.radius = fittedRadius / viewScale;
    applyOrbit();
  }

  function fitView() {
    viewScale = 1;
    panOffset.set(0, 0, 0);
    fitCamera();
  }

  function zoomBy(factor) {
    viewScale = Math.max(0.65, Math.min(4, viewScale * factor));
    orbit.radius = fittedRadius / viewScale;
    applyOrbit();
  }

  function resize() {
    const rect = refs.host.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    viewportSize.width = rect.width;
    viewportSize.height = rect.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitCamera();
  }

  function applyView(index) {
    const preset = viewPresets[index] || viewPresets[0];
    camera.position.copy(preset.position);
    cameraTarget.copy(preset.target);
    camera.up.set(0, 1, 0);
    camera.lookAt(cameraTarget);
    syncOrbitFromCamera();
    fitView();
  }

  function resetView() {
    model.root.rotation.set(0, 0, 0);
    applyView(0);
  }

  function activeFocusParts() {
    if (!state.highlight) return [];
    if (state.adjustingFocus) return FOCUS_OPTICAL_PATH_PARTS;
    if (state.selectedPart) return [state.selectedPart];
    return STAGE_FOCUS_PARTS[currentStage().id] || [];
  }

  function applyState() {
    const focusParts = activeFocusParts();
    const focusSet = new Set(focusParts);
    model.meshes.forEach((mesh) => {
      const material = mesh.material;
      const baseOpacity = material.userData.baseOpacity ?? 1;
      const dimmed = focusSet.size > 0 && !focusSet.has(mesh.userData.partId);
      const selected = focusSet.has(mesh.userData.partId);
      material.opacity = dimmed ? Math.min(0.16, baseOpacity * 0.22) : baseOpacity;
      material.transparent = dimmed || material.userData.baseTransparent || material.opacity < 0.99;
      material.depthWrite = !dimmed && material.opacity > 0.72;
      if (material.emissive && material.userData.baseEmissive) {
        material.emissive.copy(material.userData.baseEmissive);
        if (selected) material.emissive.lerp(new THREE.Color(0x78c9ad), 0.24);
      }
      material.needsUpdate = true;
    });

    const objectiveIndex = model.objectiveDefinitions.findIndex((definition) => definition.value === state.objective);
    const selectedDefinition = model.objectiveDefinitions[Math.max(0, objectiveIndex)];
    model.nosepiece.userData.targetRotation = -selectedDefinition.angle;
    model.objectiveGroup.userData.targetRotation = -selectedDefinition.angle;
    model.objectiveMounts.forEach((mount) => {
      const isActive = mount.userData.value === state.objective;
      mount.userData.targetQuaternion.setFromAxisAngle(mount.userData.radialAxis, isActive ? 0 : -0.46);
    });
    const apertureRadius = 0.18 + state.diaphragm * 0.0048;
    if (Math.abs(model.diaphragmAperture.userData.apertureRadius - apertureRadius) > 0.001) {
      model.diaphragmAperture.geometry.dispose();
      model.diaphragmAperture.geometry = new THREE.RingGeometry(apertureRadius, 0.72, 64);
      model.diaphragmAperture.userData.apertureRadius = apertureRadius;
    }
    model.mirrorFlipGroup.userData.targetRotation = state.mirrorSide === "concave" ? Math.PI : 0;
    model.head.userData.targetY = model.head.userData.baseY + state.coarseFocus * 0.035 + state.fineFocus * 0.008;
    model.coarseGroup.rotation.set(0, 0, 0);
    model.fineGroup.rotation.set(0, 0, 0);
    model.lightPath.visible = currentStage().id === "illumination" || state.playing || state.adjustingFocus;
    model.labelAnchors.forEach((label) => { label.element.hidden = !state.labels; });
    refs.status.hidden = !state.labels;
  }

  function updateLabels() {
    const rect = viewportSize;
    const compact = rect.height < 420 || rect.width < 520;
    const immersive = refs.modelArea.dataset.immersive === 'true';
    const chrome = immersive && refs.modelArea.dataset.chrome !== 'hidden';
    refs.labels.classList.toggle("is-compact-labels", compact);
    labelLeaders.style.display = state.labels ? "block" : "none";
    if (!state.labels) return;
    const positions = model.labelAnchors.map((label, index) => {
      const point = label.offset.clone();
      label.target.localToWorld(point);
      point.project(camera);
      const x = (point.x * 0.5 + 0.5) * rect.width;
      const y = (-point.y * 0.5 + 0.5) * rect.height;
      return { label, index, x, y, visible: point.z > -1 && point.z < 1 && x >= 0 && x <= rect.width && y >= 0 && y <= rect.height };
    });
    positions.sort((a, b) => a.y - b.y);
    positions.forEach(({label, index, x, y, visible}, order) => {
      let labelX = x;
      let labelY = y;
      {
        const side = order % 2 ? 1 : -1;
        labelX = rect.width / 2 + side * Math.min(rect.width / 2 - 32, Math.max(84, rect.width * 0.23));
        const rows = side < 0 ? Math.ceil(positions.length / 2) : Math.floor(positions.length / 2);
        const avoidsEyepiece = immersive && side > 0 && labelX > rect.width - 156;
        const top = avoidsEyepiece ? (chrome ? 206 : 164) : (chrome ? 58 : 20);
        const bottom = rect.height - (chrome ? 104 : side < 0 ? 54 : 26);
        labelY = top + Math.floor(order / 2) * Math.max(0, bottom - top) / Math.max(1, rows - 1);
        const line = leaderLines[index];
        for (const [attribute, value] of Object.entries({ x1: x, y1: y, x2: labelX - side * 22, y2: labelY })) {
          const formatted = value.toFixed(2);
          if (line.getAttribute(attribute) !== formatted) line.setAttribute(attribute, formatted);
        }
        line.style.opacity = visible ? "1" : "0";
      }
      label.element.style.opacity = visible ? "1" : "0";
      label.element.style.transform = `translate3d(${labelX.toFixed(2)}px, ${labelY.toFixed(2)}px, 0) translate(-50%, -50%)`;
    });
  }

  function pickPart(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(model.meshes, false).find((item) => item.object.userData.partId && item.object.userData.partId !== "light-path");
    if (!hit) return;
    state.selectedPart = state.selectedPart === hit.object.userData.partId ? "" : hit.object.userData.partId;
    if (state.selectedPart) state.highlight = true;
    syncUI();
  }

  function panBy(dx, dy) {
    const units = 2 * orbit.radius * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.max(1, viewportSize.height);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    panOffset.addScaledVector(right, -dx * units).addScaledVector(up, dy * units);
    cameraTarget.copy(framingCenter).add(panOffset);
    applyOrbit();
  }
  const pairMetrics = () => {
    const [a, b] = [...pointers.values()];
    return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y)};
  };
  renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
  const onPointerDown = event => {
    if (!pointers.size) {
      dragDistance = 0;
      gestureUsed = event.button !== 0;
      multiTouchUsed = false;
      gestureCancelled = false;
    }
    pointers.set(event.pointerId, {x:event.clientX,y:event.clientY,pan:event.button === 2});
    if (pointers.size > 1) { gestureUsed = true; multiTouchUsed = true; }
    renderer.domElement.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = event => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
    const before = pointers.size > 1 ? pairMetrics() : null;
    pointers.set(event.pointerId, {...previous,x:event.clientX,y:event.clientY});
    dragDistance += Math.abs(dx) + Math.abs(dy);
    if (gestureCancelled) return;
    if (before) {
      const after = pairMetrics();
      if (before.distance > 8) zoomBy(after.distance / before.distance);
      panBy(after.x-before.x, after.y-before.y);
    } else if (multiTouchUsed) return;
    else if (previous.pan) panBy(dx, dy);
    else {
      orbit.theta -= dx * 0.007;
      orbit.phi = Math.max(0.18, Math.min(Math.PI - 0.18, orbit.phi - dy * 0.006));
      applyOrbit();
    }
  };
  const endPointer = event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (event.type !== "pointerup") { gestureCancelled = true; gestureUsed = true; }
    if (event.type === 'pointerup' && !pointers.size && !gestureUsed && dragDistance < 7) pickPart(event);
    if (renderer.domElement.hasPointerCapture?.(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
  };
  const cancelPointers = () => {
    if (!pointers.size) return;
    gestureCancelled = true;
    gestureUsed = true;
    const ids = [...pointers.keys()];
    pointers.clear();
    for (const id of ids) if (renderer.domElement.hasPointerCapture?.(id)) renderer.domElement.releasePointerCapture(id);
  };
  const onGestureVisibilityChange = () => { if (document.hidden) cancelPointers(); };
  window.addEventListener("blur", cancelPointers);
  window.addEventListener("pagehide", cancelPointers);
  document.addEventListener("visibilitychange", onGestureVisibilityChange);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', endPointer);
  renderer.domElement.addEventListener('pointercancel', endPointer);
  renderer.domElement.addEventListener('lostpointercapture', endPointer);
  renderer.domElement.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoomBy(Math.exp(-event.deltaY * 0.001));
  }, { passive: false });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(refs.host);
  resize();
  applyState();

  const clock = new THREE.Clock();
  let animationFrame = 0;
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const speed = speeds[state.speedIndex];
    model.nosepiece.rotation.y += ((model.nosepiece.userData.targetRotation || 0) - model.nosepiece.rotation.y) * 0.12;
    model.objectiveGroup.rotation.y += ((model.objectiveGroup.userData.targetRotation || 0) - model.objectiveGroup.rotation.y) * 0.12;
    model.objectiveMounts.forEach((mount) => {
      mount.quaternion.slerp(mount.userData.targetQuaternion, 0.12);
    });
    model.mirrorFlipGroup.rotation.x += ((model.mirrorFlipGroup.userData.targetRotation || 0) - model.mirrorFlipGroup.rotation.x) * 0.12;
    model.head.position.y += ((model.head.userData.targetY || 0) - model.head.position.y) * 0.12;
    if (model.lightPath.visible) {
      model.lightDots.forEach((dot) => {
        const progress = (dot.userData.phase + elapsed * 0.12 * speed) % 1;
        dot.position.copy(model.lightCurve.getPointAt(progress));
        dot.scale.setScalar(0.8 + Math.sin((progress + elapsed) * Math.PI * 2) * 0.18);
      });
    }
    if (state.playing && performance.now() - autoStageChangedAt > 3300 / speed) setStage(state.stageIndex + 1);
    renderer.render(scene, camera);
    updateLabels();
  }
  animate();

  microscopeRuntime = {
    applyState,
    applyView,
    resetView,
    fitView,
    zoomBy,
    resize,
    getViewState:()=>({scale:viewScale,orbit:{...orbit},pan:panOffset.toArray(),target:cameraTarget.toArray(),size:{...viewportSize}}),
    dispose() {
      cancelPointers();
      window.removeEventListener("blur", cancelPointers);
      window.removeEventListener("pagehide", cancelPointers);
      document.removeEventListener("visibilitychange", onGestureVisibilityChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', endPointer);
      renderer.domElement.removeEventListener('pointercancel', endPointer);
      renderer.domElement.removeEventListener('lostpointercapture', endPointer);
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.dispose();
    },
  };
  applyState();
}

window.addEventListener("beforeunload", () => microscopeRuntime?.dispose());


syncUI();
function mountMicroscopeExperience(){
 const shell=globalThis.AnderModelShell;
 const context=trigger=>shellExperience.showPanel(document.querySelector('.microscope-information'),'目镜、调节与部件',trigger);
 const help='<p>单指或左键拖动旋转，双指或右键拖动平移；滚轮、双指捏合或观察工具中的放大/缩小调节取景。“完整视图”恢复全貌。</p><p>先用低倍物镜调焦，再切换高倍；高倍保留粗准焦锁定，使用细准焦。目镜结果随倍率、调焦、光圈和反光镜变化。</p><p>手机上，粗调、细调和光圈位于目镜右侧的倍率按钮下方，边调节边观察结果。极短竖屏及全屏模式改用底部滑杆，并保留目镜小窗。全屏时轻触唤出滑杆，按住时保持显示，松手两秒后收起；倍率、反光镜及部件说明也可从“观察→目镜与部件”打开。</p>';
 const settings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'完整视图',run:()=>{microscopeRuntime?.fitView();shellExperience.closeDialog();}}]);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();else shellExperience.showDialog('独立模型预览','<p>当前独立打开光学显微镜样板，关闭本标签页可返回之前的页面。</p>',document.activeElement);};
 shellExperience=shell.mountExperience({root:refs.modelArea,viewport:refs.viewport,title:'光学显微镜',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'目镜与部件',onSettings:settings,onContext:context,hasContext:()=>true,helpContent:help,onDisplayChange:()=>{syncAdjustmentPlacement();requestAnimationFrame(()=>microscopeRuntime?.resize());}});
 const adjustmentObserver=new MutationObserver(syncAdjustmentPlacement);adjustmentObserver.observe(document.body,{attributes:true,attributeFilter:['data-shell-compact']});
 window.addEventListener('resize',syncAdjustmentPlacement);syncAdjustmentPlacement();
 window.addEventListener('beforeunload',()=>{adjustmentObserver.disconnect();window.removeEventListener('resize',syncAdjustmentPlacement);},{once:true});
 const settingsButton=root.querySelector('[data-microscope-settings]');shell.setExtra(settingsButton,'settings','显示与操作');settingsButton.addEventListener('click',e=>settings(e.currentTarget));
 root.querySelector('[data-microscope-context]').addEventListener('click',e=>context(e.currentTarget));
 root.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();onReturn();});
 shell.setExtra(root.querySelector('[data-microscope-view="fit"]'),'concentrate','完整视图');
 for(const [name,label,path] of [['in','放大','M5 12h14M12 5v14'],['out','缩小','M5 12h14']]){const button=root.querySelector(`[data-microscope-view="${name}"]`);button.innerHTML=`<svg class="shell-control-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span class="shell-control-label">${label}</span>`;button.setAttribute('aria-label',label);}
 const eyeFrame=root.querySelector('.microscope-eyepiece-frame');
 const eyeResize=new ResizeObserver(()=>eyeFrame.style.setProperty('--eyepiece-scale',String(eyeFrame.clientWidth/70)));eyeResize.observe(eyeFrame);
 globalThis.MicroscopeSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...state,focus:focusMetrics(),illumination:illuminationMetrics(),view:microscopeRuntime?.getViewState(),shell:shellExperience.getState(),ready:Boolean(microscopeRuntime)})});
 startMicroscope();
}
let mountingMicroscope=false;
async function startMicroscope(){
 if(mountingMicroscope)return;mountingMicroscope=true;refs.loading.hidden=true;shellExperience.setSceneStatus('loading');
 try{await mountMicroscope();syncUI();shellExperience.setSceneStatus('ready');emitModelMessage('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities});}
 catch(error){threeModulePromise=null;refs.host.replaceChildren();refs.labels.replaceChildren();shellExperience.setSceneStatus('error','显微镜未能加载，请重新加载。调节参数会保留。',startMicroscope);emitModelMessage('model:error',{message:error.message});}
 finally{mountingMicroscope=false;}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountMicroscopeExperience,{once:true});else mountMicroscopeExperience();
