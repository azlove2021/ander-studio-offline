import {mountProcessShell} from './process-shell.js';
let shellAdapter=null;
"use strict";

const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"bacteriophage-reproduction","version":"2.5.0","publish":true,"title":{"zh":"噬菌体的繁殖（2D动画）","en":"Bacteriophage Reproduction (2D Animation)"},"summary":{"zh":"分阶段观察噬菌体吸附、注入、合成、装配与裂解释放的裂解周期。","en":"Follow phage attachment, genome injection, biosynthesis, assembly and lytic release."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":false,"highlight":false,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"attachment","title":{"zh":"吸附","en":"Attachment"}},{"id":"injection","title":{"zh":"注入","en":"Genome Injection"}},{"id":"biosynthesis","title":{"zh":"复制与合成","en":"Replication and Biosynthesis"}},{"id":"assembly","title":{"zh":"装配","en":"Assembly"}},{"id":"lysis","title":{"zh":"裂解释放","en":"Lysis and Release"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","brand-watermark.js","process-shell.js","lab-gesture.js"],"styles":["model.css","shell.css","brand-watermark.css","process-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const STAGES = [
  {
    id: "attachment",
    title: "吸附",
    description: "噬菌体尾纤维识别细菌表面受体，尾部逐渐靠近并稳定结合细菌。",
    duration: 1900,
    goal: "观察噬菌体尾纤维识别细菌表面受体，并使尾部稳定结合细菌。",
    keywords: ["尾纤维", "受体", "吸附"],
    explanation: "噬菌体通常通过尾纤维或尾部蛋白识别特定细菌表面受体。识别具有专一性，因此某种噬菌体通常只能感染一定范围的宿主。",
    mistake: "吸附不是噬菌体整体进入细菌；此时噬菌体仍位于细菌外部。",
    question: "为什么一种噬菌体不能感染所有种类的细菌？"
  },
  {
    id: "injection",
    title: "注入",
    description: "颈尾连接处下移，尾管穿过细菌包膜；盘绕在头部的 DNA 展开并进入细胞质。",
    duration: 2600,
    goal: "观察颈尾连接处下移、尾管穿过细菌包膜，以及头部 DNA 展开并进入细菌。",
    keywords: ["基因组注入", "尾管", "头壳留在细胞外"],
    explanation: "噬菌体的遗传物质经尾管进入细菌细胞质，头部蛋白质外壳留在细菌外。动画把盘绕 DNA 逐渐拉直，用来表示基因组转位过程。",
    mistake: "进入细菌的是噬菌体核酸，而不是完整噬菌体颗粒。",
    question: "噬菌体头壳留在细菌外，为什么仍能控制细菌内部的生命活动？"
  },
  {
    id: "biosynthesis",
    title: "复制与合成",
    description: "噬菌体 DNA 大量复制，并利用细菌核糖体合成头部、颈部和尾部蛋白质。",
    duration: 3400,
    goal: "观察噬菌体 DNA 复制，并利用细菌的核糖体和物质合成头部、颈部与尾部蛋白质。",
    keywords: ["DNA复制", "蛋白质合成", "宿主核糖体"],
    explanation: "进入细菌的噬菌体 DNA 指导自身复制和噬菌体蛋白质合成。细菌的核糖体等合成装置被利用来制造子代噬菌体所需的结构蛋白。",
    mistake: "噬菌体没有独立的细胞结构和完整代谢系统，不能脱离宿主细胞自行增殖。",
    question: "为什么噬菌体的蛋白质必须借助细菌核糖体合成？"
  },
  {
    id: "assembly",
    title: "装配",
    description: "DNA 装入头部，分散的头部、颈部与尾部依次靠拢，形成多个完整子代噬菌体。",
    duration: 3100,
    goal: "观察 DNA 装入头部，随后头部、颈部和尾部组合成完整子代噬菌体。",
    keywords: ["装配", "DNA包装", "成熟噬菌体"],
    explanation: "复制产生的噬菌体 DNA 与分别合成的结构蛋白按照一定顺序装配，形成多个具有感染能力的完整噬菌体颗粒。",
    mistake: "子代噬菌体不是由亲代噬菌体直接分裂形成，而是先合成部件，再完成装配。",
    question: "为什么先合成大量相同部件，再统一装配，有利于快速产生子代噬菌体？"
  },
  {
    id: "lysis",
    title: "裂解释放",
    description: "细菌包膜失去完整性并破裂，已经装配成熟的子代噬菌体向周围环境释放。",
    duration: 2900,
    goal: "观察细菌包膜破裂以及成熟噬菌体从细胞中释放。",
    keywords: ["细胞裂解", "释放", "子代噬菌体"],
    explanation: "裂解相关蛋白破坏细菌细胞膜和细胞壁，细胞完整性丧失，积累的成熟噬菌体被释放到环境中并可继续感染其他细菌。",
    mistake: "本模型展示的是裂解周期；温和噬菌体还可能进入溶原周期，并不立即裂解宿主。",
    question: "细菌裂解后释放多个子代噬菌体，对噬菌体种群扩增有什么意义？"
  }
];

const RIBOSOMES = [
  [233, 340, 7], [269, 387, 6], [301, 462, 7], [332, 307, 6], [365, 491, 5], [397, 327, 6],
  [427, 468, 7], [455, 298, 5], [486, 451, 6], [520, 322, 7], [552, 478, 5], [584, 298, 6],
  [615, 466, 7], [646, 334, 5], [680, 487, 6], [714, 308, 7], [748, 451, 6], [782, 363, 6],
  [249, 440, 5], [289, 318, 5], [349, 412, 6], [403, 386, 5], [470, 352, 6], [538, 410, 5],
  [606, 379, 6], [668, 418, 5], [724, 386, 6], [771, 474, 5]
];

const PROGENY = [
  { x: 320, y: 330, scale: 0.25, releaseX: 112, releaseY: 110, rotation: -20 },
  { x: 445, y: 390, scale: 0.24, releaseX: 330, releaseY: 72, rotation: -8 },
  { x: 570, y: 322, scale: 0.25, releaseX: 680, releaseY: 70, rotation: 10 },
  { x: 700, y: 388, scale: 0.24, releaseX: 886, releaseY: 150, rotation: 22 }
];

const COMPONENTS = [
  { progeny: 0, kind: "head", x: 276, y: 348, rotation: -14, ribosome: 1 },
  { progeny: 0, kind: "neck", x: 350, y: 304, rotation: 12, ribosome: 6 },
  { progeny: 0, kind: "tail", x: 333, y: 445, rotation: -8, ribosome: 18 },
  { progeny: 1, kind: "head", x: 410, y: 320, rotation: 9, ribosome: 3 },
  { progeny: 1, kind: "neck", x: 470, y: 458, rotation: -10, ribosome: 8 },
  { progeny: 1, kind: "tail", x: 500, y: 344, rotation: 6, ribosome: 22 },
  { progeny: 2, kind: "head", x: 568, y: 425, rotation: -8, ribosome: 11 },
  { progeny: 2, kind: "neck", x: 620, y: 348, rotation: 10, ribosome: 14 },
  { progeny: 2, kind: "tail", x: 646, y: 455, rotation: -7, ribosome: 24 },
  { progeny: 3, kind: "head", x: 722, y: 327, rotation: 8, ribosome: 16 },
  { progeny: 3, kind: "neck", x: 750, y: 440, rotation: -8, ribosome: 26 },
  { progeny: 3, kind: "tail", x: 684, y: 402, rotation: 11, ribosome: 27 }
];

const GENOME_COUNT = 36;

// Keep the original stage durations. All poses, including small oscillations,
// derive from this one timeline so seeking backward leaves no animation history.
const STAGE_STARTS = STAGES.map((_, index) => STAGES.slice(0, index).reduce((sum, stage) => sum + stage.duration, 0));
const TOTAL_DURATION = STAGES.reduce((sum, stage) => sum + stage.duration, 0);

const state = {
  timeMs: 0,
  stageIndex: 0,
  progress: 0,
  playing: false,
  speed: 1
};

let hostOrigin = "*";
let animationFrame = 0;
let previousTimestamp = 0;
let sceneClock = 0;
let scrubbing = false;

function unifiedHomeUrl() {
  const requested = new URLSearchParams(window.location.search).get("return");
  if (requested) {
    try {
      const target = new URL(requested, window.location.href);
      if (target.origin === window.location.origin) return target.href;
    } catch {}
  }
  if (document.referrer) return document.referrer;
  return new URL("../../../../index.html", window.location.href).href;
}

function upgradeUnifiedPhageShell() {
  const main = document.querySelector(".model-shell");
  const header = document.querySelector(".model-header");
  const back = document.querySelector(".back-link");
  const card = document.querySelector(".animation-card");
  const stageNavigation = document.querySelector(".stage-navigation");
  const stageCopy = document.querySelector(".stage-copy");
  const viewport = document.querySelector(".animation-viewport");
  const playback = document.querySelector(".playback-controls");
  const progress = document.querySelector(".timeline-wrap");
  if (!main || !header || !back || !card || !stageNavigation || !viewport || !playback) return;

  main.classList.add("independent-model-app");
  header.className = "independent-model-header";
  back.className = "independent-model-back";
  back.setAttribute("aria-label", "返回主页");
  back.innerHTML = '<span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span><span class="independent-model-back-label"><span>返回</span><span>主页</span></span>';
  back.href = unifiedHomeUrl();
  const heading = document.createElement("div");
  heading.className = "independent-model-heading";
  heading.innerHTML = `<span class="independent-model-kicker">${ANDER_MODEL_MANIFEST.module.zh} / ${ANDER_MODEL_MANIFEST.module.en}</span><h1>${ANDER_MODEL_MANIFEST.title.zh} <small>/ ${ANDER_MODEL_MANIFEST.title.en}</small></h1><span id="stageCounter" hidden></span><span id="stageBadgeTitle" hidden></span>`;
  header.replaceChildren(back, heading);

  card.classList.add("model-area");
  card.dataset.modelArea = "";
  stageNavigation.classList.add("stage-strip");
  stageNavigation.style.setProperty("--stage-count", "5");
  stageNavigation.querySelectorAll("button").forEach((button,index) => {
    button.classList.add("stage-tab");
    const title = ANDER_MODEL_MANIFEST.stages[index].title;
    button.innerHTML = globalThis.AnderModelShell.stageContent(index,title.zh,title.en);
  });
  const modelStage = document.createElement("div");
  modelStage.className = "model-stage phage-model-stage";
  modelStage.append(stageCopy, viewport, progress);
  playback.className = "playback-controls control-dock";
  const primary = document.createElement("div");
  primary.className = "control-group control-group-primary";
  const view = document.createElement("div");
  view.className = "control-group control-group-view";
  const end = document.createElement("div");
  end.className = "control-group control-group-end";
  const play = document.querySelector("#playButton");
  const reset = document.querySelector("#resetButton");
  const prev = document.querySelector("#prevButton");
  const next = document.querySelector("#nextButton");
  const speed = document.querySelector(".speed-control");
  [play, reset, prev, next].forEach((button) => button?.classList.add("control-button"));
  play?.classList.add("is-primary");
  speed?.classList.add("control-button", "phage-speed-control");
  const fullscreen = document.createElement("button");
  fullscreen.id = "fullscreenButton";
  fullscreen.type = "button";
  fullscreen.className = "control-button";
  fullscreen.textContent = "全屏";
  [[play,"play"],[reset,"reset"],[prev,"prev"],[next,"next"],[fullscreen,"fullscreen"]].forEach(([button,action]) => { button.dataset.action = action; });
  primary.append(play, reset, prev, next);
  if (speed) view.append(speed);
  end.append(fullscreen);
  playback.replaceChildren(primary, view, end);
  card.replaceChildren(stageNavigation, modelStage, playback);

  const workspace = document.createElement("section");
  workspace.className = "independent-model-workspace";
  workspace.append(card);
  main.replaceChildren(header, workspace);
}
upgradeUnifiedPhageShell();

const SVG_NS = "http://www.w3.org/2000/svg";
const stageCounter = document.querySelector("#stageCounter");
const stageBadgeTitle = document.querySelector("#stageBadgeTitle");
const stageNumber = document.querySelector("#stageNumber");
const stageTitle = document.querySelector("#stageTitle");
const stageDescription = document.querySelector("#stageDescription");
const playButton = document.querySelector("#playButton");
const resetButton = document.querySelector("#resetButton");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const speedSelect = document.querySelector("#speedSelect");
const modelArea = document.querySelector("[data-model-area]");
const fullscreenButton = document.querySelector("#fullscreenButton");
const infectingPhage = document.querySelector("#infectingPhage");
const infectingNeck = document.querySelector("#infectingNeck");
const infectingTail = document.querySelector("#infectingTail");
const contactSignal = document.querySelector("#contactSignal");
const injectionTube = document.querySelector("#injectionTube");
const nucleoid = document.querySelector("#nucleoid");
const ribosomeGroup = document.querySelector("#ribosomeGroup");
const genomePaths = Array.from(document.querySelectorAll(".genome-lineage"));
const componentPool = document.querySelector("#componentPool");
const bacteriumShell = document.querySelector("#bacteriumShell");
const bacteriumLeftOuter = document.querySelector("#bacteriumLeftOuter");
const bacteriumRightOuter = document.querySelector("#bacteriumRightOuter");
const bacteriumLeftInner = document.querySelector("#bacteriumLeftInner");
const bacteriumRightInner = document.querySelector("#bacteriumRightInner");
const bacteriumContinuousOutline = document.querySelector("#bacteriumContinuousOutline");
const bacterialInterior = document.querySelector("#bacterialInterior");
const burstLines = document.querySelector("#burstLines");

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function easeInOut(progress) {
  const value = clamp(progress);
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function smoothstep(edge0, edge1, value) {
  const normalized = clamp((value - edge0) / (edge1 - edge0));
  return normalized * normalized * (3 - 2 * normalized);
}

function createSceneContents() {
  RIBOSOMES.forEach(([x, y, radius], index) => {
    const group = svgElement("g", { class: "ribosome", transform: `translate(${x} ${y})` });
    group.dataset.index = String(index);
    group.append(
      svgElement("circle", { cx: -2, cy: 1, r: radius, fill: "#E09B3D", opacity: 0.95 }),
      svgElement("circle", { cx: 4, cy: -3, r: radius * 0.56, fill: "#F6C46F", opacity: 0.95 })
    );
    ribosomeGroup.appendChild(group);
  });

  COMPONENTS.forEach((component, index) => {
    const use = svgElement("use", {
      class: "protein-part",
      href: `#phage-${component.kind}-structure`,
      opacity: 0
    });
    use.id = `component-${component.progeny}-${component.kind}`;
    use.dataset.index = String(index);
    use.dataset.entityId = `progeny-${component.progeny}-${component.kind}`;
    componentPool.appendChild(use);
  });
}

function buildSmoothPath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0][0]} ${points[0][1]}`;
  let path = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const midpointX = (points[index][0] + points[index + 1][0]) / 2;
    const midpointY = (points[index][1] + points[index + 1][1]) / 2;
    path += ` Q${points[index][0].toFixed(1)} ${points[index][1].toFixed(1)} ${midpointX.toFixed(1)} ${midpointY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  path += ` T${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
  return path;
}

function mixPointSets(from, to, progress) {
  const amount = easeInOut(progress);
  return from.map((point, index) => [
    lerp(point[0], to[index][0], amount),
    lerp(point[1], to[index][1], amount)
  ]);
}

function transformPoint(x, y, centerX, centerY, scale = 1, rotation = 0) {
  const angle = rotation * Math.PI / 180;
  const scaledX = x * scale;
  const scaledY = y * scale;
  return [
    centerX + scaledX * Math.cos(angle) - scaledY * Math.sin(angle),
    centerY + scaledX * Math.sin(angle) + scaledY * Math.cos(angle)
  ];
}

function makeHeadCoil(centerX, centerY, scale = 1, rotation = 0) {
  return Array.from({ length: GENOME_COUNT }, (_, index) => {
    const fraction = index / (GENOME_COUNT - 1);
    const angle = fraction * Math.PI * 5.6;
    const radius = 29 - fraction * 10 + Math.sin(fraction * Math.PI * 5) * 2.5;
    const x = Math.cos(angle) * radius;
    const y = (fraction - 0.5) * 39 + Math.sin(angle) * radius * 0.46;
    return transformPoint(x, y, centerX, centerY, scale, rotation);
  });
}

function makeInjectionThread(phageY) {
  return Array.from({ length: GENOME_COUNT }, (_, index) => {
    const fraction = index / (GENOME_COUNT - 1);
    const envelope = Math.sin(Math.PI * fraction);
    const x = 500 + Math.sin(fraction * Math.PI * 7 + sceneClock * 0.004) * 5 * envelope;
    const y = phageY - 22 + fraction * 274;
    return [x, y];
  });
}

function makeGenomeLoop(centerX, centerY, radiusX, radiusY, rotation = 0) {
  return Array.from({ length: GENOME_COUNT }, (_, index) => {
    const fraction = index / (GENOME_COUNT - 1);
    const angle = fraction * Math.PI * 2;
    const x = Math.cos(angle) * radiusX + Math.sin(angle * 3) * radiusX * 0.12;
    const y = Math.sin(angle * 2) * radiusY + Math.sin(angle) * radiusY * 0.22;
    return transformPoint(x, y, centerX, centerY, 1, rotation);
  });
}

function setGenome(index, points, opacity, strokeWidth = 7) {
  const path = genomePaths[index];
  path.setAttribute("d", buildSmoothPath(points));
  path.setAttribute("stroke-width", strokeWidth.toFixed(2));
  path.style.opacity = String(clamp(opacity));
}

function renderGenomes(phageY, injection, biosynthesis, assembly, lysis) {
  const singleGenome = makeGenomeLoop(520, 400, 82, 41, -4);

  if (state.stageIndex <= 1) {
    const coil = makeHeadCoil(500, phageY, 0.55);
    const thread = makeInjectionThread(phageY);
    const unspooled = mixPointSets(coil, thread, smoothstep(0.04, 0.58, injection));
    const entered = mixPointSets(unspooled, singleGenome, smoothstep(0.48, 1, injection));
    setGenome(0, entered, 1, 7);
    for (let index = 1; index < genomePaths.length; index += 1) setGenome(index, entered, 0, 7);
    return;
  }

  const twoGenomeTargets = [
    makeGenomeLoop(420, 375, 61, 32, -7),
    makeGenomeLoop(615, 414, 61, 32, 7)
  ];
  const fourGenomeTargets = [
    makeGenomeLoop(340, 360, 44, 24, -9),
    makeGenomeLoop(455, 438, 43, 23, 8),
    makeGenomeLoop(565, 365, 44, 24, -7),
    makeGenomeLoop(682, 438, 43, 23, 9)
  ];
  const firstSplit = smoothstep(0.16, 0.45, biosynthesis);
  const secondSplit = smoothstep(0.52, 0.82, biosynthesis);
  const replicationPoints = [
    mixPointSets(mixPointSets(singleGenome, twoGenomeTargets[0], firstSplit), fourGenomeTargets[0], secondSplit),
    mixPointSets(mixPointSets(singleGenome, twoGenomeTargets[1], firstSplit), fourGenomeTargets[2], secondSplit),
    mixPointSets(twoGenomeTargets[0], fourGenomeTargets[1], secondSplit),
    mixPointSets(twoGenomeTargets[1], fourGenomeTargets[3], secondSplit)
  ];
  const replicationOpacity = [
    1,
    smoothstep(0.16, 0.23, biosynthesis),
    smoothstep(0.52, 0.59, biosynthesis),
    smoothstep(0.52, 0.59, biosynthesis)
  ];

  PROGENY.forEach((item, index) => {
    const assemblyStart = 0.12 + index * 0.06;
    const packed = smoothstep(assemblyStart, assemblyStart + 0.52, assembly);
    const released = smoothstep(0.18, 0.94, lysis);
    const centerX = lerp(item.x, item.releaseX, released);
    const centerY = lerp(item.y, item.releaseY, released);
    const scale = item.scale * (1 + released * 0.35);
    const rotation = item.rotation * released;
    const packedCoil = makeHeadCoil(centerX, centerY, scale, rotation);
    const points = mixPointSets(replicationPoints[index], packedCoil, packed);
    const strokeWidth = lerp(6.2, 2.45 * (1 + released * 0.35), packed);
    setGenome(index, points, replicationOpacity[index], strokeWidth);
  });
}

function phaseProgress(stageIndex, phaseIndex, currentProgress) {
  if (stageIndex > phaseIndex) return 1;
  if (stageIndex < phaseIndex) return 0;
  return currentProgress;
}

function makeHalfPath(side, yTop, yMiddle, yBottom, shoulderX, edgeX, radius, split, targets) {
  const boundary = targets.map(([targetX, y]) => [lerp(500, targetX, split), y]);
  const first = boundary[0];
  const last = boundary[boundary.length - 1];
  const reverseBoundary = boundary.slice(0, -1).reverse().map(([x, y]) => `L${x.toFixed(1)} ${y}`).join(" ");
  if (side === "left") {
    return `M${first[0].toFixed(1)} ${yTop} H${shoulderX} A${radius} ${radius} 0 0 0 ${edgeX} ${yMiddle} A${radius} ${radius} 0 0 0 ${shoulderX} ${yBottom} H${last[0].toFixed(1)} ${reverseBoundary} Z`;
  }
  return `M${first[0].toFixed(1)} ${yTop} H${shoulderX} A${radius} ${radius} 0 0 1 ${edgeX} ${yMiddle} A${radius} ${radius} 0 0 1 ${shoulderX} ${yBottom} H${last[0].toFixed(1)} ${reverseBoundary} Z`;
}

function renderBacterium(lysis) {
  const split = smoothstep(0.34, 0.78, lysis);
  const fragmentMove = smoothstep(0.42, 1, lysis);
  const swelling = 1 + smoothstep(0.05, 0.38, lysis) * 0.052;
  const scaleTransform = `translate(500 395) scale(${swelling.toFixed(3)} ${(1 + (swelling - 1) * 1.35).toFixed(3)}) translate(-500 -395)`;
  const leftTransform = `translate(${(-72 * fragmentMove).toFixed(1)} ${(-8 * fragmentMove).toFixed(1)}) rotate(${(-7 * fragmentMove).toFixed(1)} 500 395) ${scaleTransform}`;
  const rightTransform = `translate(${(72 * fragmentMove).toFixed(1)} ${(9 * fragmentMove).toFixed(1)}) rotate(${(7 * fragmentMove).toFixed(1)} 500 395) ${scaleTransform}`;
  const outerLeftTargets = [[500, 270], [486, 305], [511, 339], [487, 376], [512, 415], [486, 455], [500, 520]];
  const outerRightTargets = [[500, 270], [536, 309], [512, 346], [538, 382], [513, 421], [539, 460], [500, 520]];
  const innerLeftTargets = [[500, 282], [489, 315], [509, 348], [488, 382], [510, 421], [489, 461], [500, 508]];
  const innerRightTargets = [[500, 282], [533, 316], [513, 349], [535, 383], [513, 422], [535, 462], [500, 508]];

  bacteriumLeftOuter.setAttribute("d", makeHalfPath("left", 270, 395, 520, 295, 170, 125, split, outerLeftTargets));
  bacteriumRightOuter.setAttribute("d", makeHalfPath("right", 270, 395, 520, 705, 830, 125, split, outerRightTargets));
  bacteriumLeftInner.setAttribute("d", makeHalfPath("left", 282, 395, 508, 295, 182, 113, split, innerLeftTargets));
  bacteriumRightInner.setAttribute("d", makeHalfPath("right", 282, 395, 508, 705, 818, 113, split, innerRightTargets));
  bacteriumLeftOuter.setAttribute("transform", leftTransform);
  bacteriumLeftInner.setAttribute("transform", leftTransform);
  bacteriumRightOuter.setAttribute("transform", rightTransform);
  bacteriumRightInner.setAttribute("transform", rightTransform);
  const crackStroke = smoothstep(0.32, 0.48, lysis);
  bacteriumLeftOuter.setAttribute("stroke-width", (8 * crackStroke).toFixed(2));
  bacteriumRightOuter.setAttribute("stroke-width", (8 * crackStroke).toFixed(2));
  bacteriumLeftInner.setAttribute("stroke-width", (3 * crackStroke).toFixed(2));
  bacteriumRightInner.setAttribute("stroke-width", (3 * crackStroke).toFixed(2));
  bacteriumContinuousOutline.setAttribute("transform", scaleTransform);
  bacteriumContinuousOutline.style.opacity = String(1 - crackStroke);
  bacterialInterior.style.opacity = String(1 - smoothstep(0.42, 0.88, lysis));
  bacterialInterior.setAttribute("transform", scaleTransform);
  burstLines.style.opacity = String(smoothstep(0.46, 0.63, lysis) * (1 - smoothstep(0.86, 1, lysis)));
}

function renderComponents(biosynthesis, assembly, lysis) {
  const releaseAmount = smoothstep(0.18, 0.94, lysis);
  document.querySelectorAll(".protein-part").forEach((part, index) => {
    const component = COMPONENTS[index];
    const item = PROGENY[component.progeny];
    const [originX, originY] = RIBOSOMES[component.ribosome];
    const reveal = smoothstep(0.30 + index * 0.038, 0.48 + index * 0.038, biosynthesis);
    const synthX = lerp(originX, component.x, reveal);
    const synthY = lerp(originY, component.y, reveal);
    const kindDelay = component.kind === "head" ? 0 : component.kind === "neck" ? 0.14 : 0.25;
    const assembled = smoothstep(0.06 + component.progeny * 0.045 + kindDelay, 0.54 + component.progeny * 0.045 + kindDelay, assembly);
    const targetX = lerp(item.x, item.releaseX, releaseAmount);
    const targetY = lerp(item.y, item.releaseY, releaseAmount);
    const x = lerp(synthX, targetX, assembled);
    const y = lerp(synthY, targetY, assembled);
    const baseScale = lerp(0.04, 0.22, reveal);
    const targetScale = item.scale * (1 + releaseAmount * 0.35);
    const scale = lerp(baseScale, targetScale, assembled);
    const rotation = lerp(component.rotation, item.rotation * releaseAmount, assembled);
    const drift = Math.sin(sceneClock * 0.004 + index) * 2.5 * reveal * (1 - assembled);
    part.setAttribute("transform", `translate(${x.toFixed(1)} ${(y + drift).toFixed(1)}) rotate(${rotation.toFixed(1)}) scale(${scale.toFixed(3)})`);
    part.style.opacity = String(reveal);
  });
}

function renderScene() {
  const attachment = phaseProgress(state.stageIndex, 0, state.progress);
  const injection = phaseProgress(state.stageIndex, 1, state.progress);
  const biosynthesis = phaseProgress(state.stageIndex, 2, state.progress);
  const assembly = phaseProgress(state.stageIndex, 3, state.progress);
  const lysis = phaseProgress(state.stageIndex, 4, state.progress);
  const attachEase = easeInOut(attachment);
  const injectionEase = easeInOut(injection);

  const phageY = lerp(105, 154, attachEase);
  infectingPhage.setAttribute("transform", `translate(500 ${phageY.toFixed(2)}) scale(.55)`);
  infectingNeck.setAttribute("transform", `translate(0 ${(injectionEase * 8).toFixed(2)})`);
  infectingTail.setAttribute("transform", `translate(0 ${(injectionEase * 7).toFixed(2)}) scale(1 ${(1 - injectionEase * 0.08).toFixed(3)})`);

  contactSignal.style.opacity = String(smoothstep(0.65, 1, attachment) * (1 - smoothstep(0.65, 1, injection)));
  const contactPulse = 1 + Math.sin(sceneClock * 0.012) * 0.12 * attachment;
  contactSignal.setAttribute("transform", `translate(500 270) scale(${contactPulse.toFixed(3)}) translate(-500 -270)`);
  injectionTube.style.opacity = String(smoothstep(0.05, 0.24, injection) * (1 - smoothstep(0.80, 1, injection)));

  nucleoid.style.opacity = String((0.92 - biosynthesis * 0.42) * (1 - smoothstep(0.42, 0.88, lysis)));
  nucleoid.setAttribute("transform", `translate(${(-biosynthesis * 8).toFixed(1)} ${(biosynthesis * 3).toFixed(1)})`);

  document.querySelectorAll(".ribosome").forEach((group, index) => {
    const active = biosynthesis > 0 ? Math.sin(sceneClock * 0.012 + index * 0.8) * 0.08 * biosynthesis : 0;
    const [x, y] = RIBOSOMES[index];
    group.setAttribute("transform", `translate(${x} ${y}) scale(${(1 + active).toFixed(3)})`);
    group.style.opacity = String((0.72 + biosynthesis * 0.28) * (1 - smoothstep(0.42, 0.88, lysis)));
  });

  renderGenomes(phageY, injection, biosynthesis, assembly, lysis);
  renderComponents(biosynthesis, assembly, lysis);
  renderBacterium(lysis);

}

function renderInterface() {
  const stage = STAGES[state.stageIndex];
  const number = String(state.stageIndex + 1).padStart(2, "0");
  stageCounter.textContent = `${number} / 05`;
  stageBadgeTitle.textContent = stage.title;
  stageNumber.textContent = `阶段 ${number}`;
  stageTitle.textContent = stage.title;
  stageDescription.textContent = stage.description;
  playButton.setAttribute("aria-pressed", String(state.playing));
  const playKey=state.playing?'pause':state.progress>0&&state.progress<1?'resume':'play';
  if(playButton.dataset.presentation!==playKey){globalThis.AnderModelShell.setControl(playButton,state.playing?'pause':'play',state.playing?'暂停':playKey==='resume'?'继续':'播放');playButton.dataset.presentation=playKey;}
  prevButton.disabled = state.stageIndex === 0 && state.progress === 0;
  nextButton.disabled = state.stageIndex === STAGES.length - 1;
  speedSelect.value = String(state.speed);
  globalThis.AnderModelShell.syncSelectSpeed(speedSelect);
  document.querySelectorAll("[data-stage]").forEach((button,index)=>{
    button.classList.toggle('is-active',index===state.stageIndex);button.setAttribute('aria-pressed',String(index===state.stageIndex));
    if(index===state.stageIndex)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  shellAdapter?.sync();
}

function render() {
  renderScene();
  renderInterface();
}

function emitModelMessage(type, payload = {}, requestId) {
  if (window.parent === window) return;
  window.parent.postMessage({
    source: "ander-model",
    protocolVersion: "1.0",
    modelId: ANDER_MODEL_MANIFEST.id,
    type,
    requestId,
    payload
  }, hostOrigin);
}

function emitState(requestId) {
  emitModelMessage("model:state", {
    stageId: STAGES[state.stageIndex].id,
    stageIndex: state.stageIndex,
    progress: state.progress,
    playing: state.playing,
    speed: state.speed,
    labels: false,
    highlight: false
  }, requestId);
}

function notifyStageChanged() {
  emitModelMessage("model:stage-changed", {
    stageId: STAGES[state.stageIndex].id,
    stageIndex: state.stageIndex
  });
}

function setStage(index, progress = 0, emit = true) {
  const nextIndex = clamp(Math.round(index), 0, STAGES.length - 1);
  const changed = applyTimeline(STAGE_STARTS[nextIndex] + STAGES[nextIndex].duration * clamp(progress));
  previousTimestamp = 0;
  render();
  if ((changed || emit) && emit) notifyStageChanged();
  emitState();
}

function applyTimeline(timeMs) {
  const previousStage = state.stageIndex;
  state.timeMs = clamp(timeMs, 0, TOTAL_DURATION);
  let index = STAGES.length - 1;
  while (index > 0 && state.timeMs < STAGE_STARTS[index]) index -= 1;
  state.stageIndex = index;
  state.progress = (state.timeMs - STAGE_STARTS[index]) / STAGES[index].duration;
  sceneClock = state.timeMs;
  return previousStage !== index;
}

function seekTimeline(timeMs) {
  if (!Number.isFinite(timeMs)) return;
  stopAnimation();
  const changed = applyTimeline(timeMs);
  render();
  if (changed) notifyStageChanged();
  emitState();
}

function setScrubbing(active) {
  scrubbing = active;
  if (active) stopAnimation();
}

function getPresentationState() {
  return {...state, stageId: STAGES[state.stageIndex].id, durationMs: TOTAL_DURATION, totalProgress: state.timeMs / TOTAL_DURATION, scrubbing};
}

function stopAnimation() {
  state.playing = false;
  previousTimestamp = 0;
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  renderInterface();
  emitState();
}

function animationLoop(timestamp) {
  if (!state.playing) return;
  if (!previousTimestamp) previousTimestamp = timestamp;
  const elapsed = Math.min(70, timestamp - previousTimestamp);
  previousTimestamp = timestamp;
  if (applyTimeline(state.timeMs + elapsed * state.speed)) notifyStageChanged();
  if (state.timeMs >= TOTAL_DURATION) state.playing = false;

  render();
  if (state.playing) animationFrame = requestAnimationFrame(animationLoop);
  else {
    animationFrame = 0;
    emitState();
  }
}

function setPlaying(playing) {
  if (playing && scrubbing) return;
  if (playing === state.playing) return;
  if (playing && state.stageIndex === STAGES.length - 1 && state.progress >= 1) {
    applyTimeline(0);
    notifyStageChanged();
  }
  state.playing = playing;
  previousTimestamp = 0;
  renderInterface();
  emitState();
  if (state.playing) animationFrame = requestAnimationFrame(animationLoop);
  else if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

function resetModel() {
  stopAnimation();
  applyTimeline(0);
  state.speed = 1;
  render();
  notifyStageChanged();
  emitState();
}

playButton.addEventListener("click", () => setPlaying(!state.playing));
resetButton.addEventListener("click", resetModel);
prevButton.addEventListener("click", () => {
  stopAnimation();
  if (state.progress > 0.08) setStage(state.stageIndex, 0);
  else setStage(state.stageIndex - 1, 0);
});
nextButton.addEventListener("click", () => {
  stopAnimation();
  setStage(state.stageIndex + 1, 0);
});
speedSelect.addEventListener("change", () => {
  state.speed = Number(speedSelect.value) || 1;
  emitState();
});
document.querySelectorAll("[data-stage]").forEach((button, index) => {
  button.addEventListener("click", () => {
    stopAnimation();
    setStage(index, 0);
    setPlaying(true);
  });
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (event.source !== window.parent || !message || message.source !== "ander-host" || message.protocolVersion !== "1.0" || message.modelId !== ANDER_MODEL_MANIFEST.id) return;
  if (message.type === "host:init") hostOrigin = event.origin;
  const payload = message.payload || {};
  if (message.type === "host:play") setPlaying(true);
  else if (message.type === "host:pause") setPlaying(false);
  else if (message.type === "host:reset") resetModel();
  else if (message.type === "host:set-stage") {
    const index = STAGES.findIndex((stage) => stage.id === payload.stageId);
    if (index >= 0) {
      stopAnimation();
      setStage(index, 0);
    }
  } else if (message.type === "host:set-speed") {
    const requestedSpeed = Number(payload.speed);
    if ([0.75, 1, 1.5].includes(requestedSpeed)) {
      state.speed = requestedSpeed;
      renderInterface();
    }
  }
  emitState(message.requestId);
});

shellAdapter=mountProcessShell({manifest:ANDER_MODEL_MANIFEST,getState:getPresentationState,post:emitModelMessage,pause:stopAnimation,seek:seekTimeline,setScrubbing});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimation();});
addEventListener('pagehide',stopAnimation);
window.PhagePresentation=Object.freeze({getState:getPresentationState,pause:stopAnimation});
createSceneContents();
render();
emitModelMessage("model:ready", {
  version: ANDER_MODEL_MANIFEST.version,
  capabilities: ANDER_MODEL_MANIFEST.capabilities
});
