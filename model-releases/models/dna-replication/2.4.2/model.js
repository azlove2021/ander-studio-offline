"use strict";

const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"dna-replication","version":"2.4.2","publish":true,"title":{"zh":"DNA复制模型（2D）","en":"DNA Replication Model (2D)"},"summary":{"zh":"以原核生物DNA复制为基础，连续展示超螺旋松弛、同步解旋与复制、引物形成、冈崎片段成熟及连接。","en":"Explore prokaryotic DNA replication through relaxation, synchronized unwinding and synthesis, primer formation, Okazaki-fragment maturation and ligation."},"module":{"id":"molecular-genetics","zh":"遗传信息的复制","en":"Replication of Genetic Information"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"relaxation","title":{"zh":"超螺旋松弛","en":"Supercoil Relaxation"}},{"id":"unwinding","title":{"zh":"复制叉建立","en":"Replication Fork Formation"}},{"id":"priming","title":{"zh":"引物形成","en":"Primer Formation"}},{"id":"elongation","title":{"zh":"同步复制","en":"Synchronized Replication"}},{"id":"maturation","title":{"zh":"替换与连接","en":"Primer Replacement and Ligation"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","scene-view.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const MODEL_CONTENT = {
  id: "dna-replication",
  title: "DNA复制模型（2D）",
  titleEn: "DNA Replication Model (2D)",
  chapter: "遗传信息的复制 / Replication of Genetic Information",
  stages: [
    {
      id: "relaxation",
      title: "超螺旋松弛",
      titleEn: "Supercoil Relaxation",
      summary: "拓扑异构酶暂时切断并重新连接DNA；图中将横向双螺旋松弛为平行双链，表示扭转张力被释放。",
      goal: "理解环状DNA复制时拓扑异构酶为何必须在复制叉前方工作。",
      keywords: ["环状DNA", "复制起点 oriC", "双向复制", "拓扑异构酶"],
      explanation: "原核生物染色体通常是环状双链DNA。复制从oriC开始并向两个方向进行；主图放大其中一个复制叉。拓扑异构酶通过可逆的切断与重连释放拓扑张力。二维图把双螺旋展开为两条平行线，是观察骨架方向的教学简化。",
      mistake: "平行双链仍由氢键维持配对；拓扑异构酶不负责拆开互补碱基，也不会把DNA永久切断。",
      question: "复制叉前方的扭转张力若不能释放，会怎样影响复制？",
    },
    {
      id: "unwinding",
      title: "复制叉建立",
      titleEn: "Replication Fork Formation",
      summary: "解旋酶沿DNA推进并破坏互补碱基间的氢键，使两条亲代模板链分离形成复制叉。",
      goal: "区分拓扑异构酶释放扭转张力与解旋酶打开双链的作用。",
      keywords: ["解旋酶", "氢键", "复制叉", "亲代模板链"],
      explanation: "解旋酶利用能量打开双链；拓扑异构酶在其前方继续缓解拓扑压力。被分开的两条亲代链分别作为新链合成的模板。",
      mistake: "解旋酶破坏的是氢键，不切断DNA骨架中的磷酸二酯键。",
      question: "为什么两条亲代链都能够指导互补子链合成？",
    },
    {
      id: "priming",
      title: "引物形成",
      titleEn: "Primer Formation",
      summary: "复制叉继续前移时，引物酶在新暴露模板上合成与模板准确配对的RNA引物。",
      goal: "理解前导链通常只需一个起始引物，而后随链需要反复合成引物。",
      keywords: ["引物酶", "RNA引物", "3′-OH", "前导链"],
      explanation: "DNA聚合酶不能从零开始合成。前导链在起点附近形成一个引物；后随链随着复制叉推进，要在新暴露的模板上反复形成引物。",
      mistake: "RNA引物只提供合成起点，成熟DNA中不会永久保留这些引物。",
      question: "后随链为什么比前导链需要更多引物？",
    },
    {
      id: "elongation",
      title: "同步复制",
      titleEn: "Synchronized Replication",
      summary: "解旋酶继续打开双链，DNA聚合酶Ⅲ同步延伸前导链和多个冈崎片段。",
      goal: "比较连续合成与分段合成，并掌握所有新链都沿5′→3′方向延伸。",
      keywords: ["DNA聚合酶Ⅲ", "5′→3′", "后随链", "冈崎片段"],
      explanation: "前导链的合成方向与复制叉推进方向一致；后随链的每个冈崎片段都背离复制叉合成。虽然空间方向不同，化学方向始终是5′→3′。",
      mistake: "后随链并不是3′→5′合成，每个冈崎片段仍然是5′→3′延伸。",
      question: "模板链反向平行怎样造成半不连续复制？",
    },
    {
      id: "maturation",
      title: "替换与连接",
      titleEn: "Primer Replacement and Ligation",
      summary: "DNA聚合酶Ⅰ切除RNA引物并补入DNA，DNA连接酶随后封闭片段间的切口。",
      goal: "区分DNA聚合酶Ⅰ的引物切除和补链作用，以及DNA连接酶的封口作用。",
      keywords: ["DNA聚合酶Ⅰ", "DNA连接酶", "切口", "磷酸二酯键"],
      explanation: "DNA聚合酶Ⅰ去除RNA引物并用DNA替换；仍存在的相邻片段切口由DNA连接酶催化形成磷酸二酯键后封闭。",
      mistake: "连接酶不负责填补一段缺失的核苷酸，它只封闭已经相邻的DNA末端。",
      question: "引物被DNA替换后，为什么还需要连接酶？",
    },
  ],
};

const ENZYMES = [
  { id: "topoisomerase", name: "拓扑异构酶", en: "Topoisomerase", role: "松弛超螺旋", color: "#8B5CF6", detail: "在复制叉前方暂时切断并重新连接DNA，释放扭转张力。" },
  { id: "helicase", name: "解旋酶", en: "Helicase", role: "打开双链", color: "#2F9E73", detail: "破坏互补碱基间的氢键，使两条亲代模板链分开。" },
  { id: "primase", name: "引物酶", en: "Primase", role: "合成RNA引物", color: "#F59E0B", detail: "合成短RNA引物，为DNA聚合酶提供可延伸的3′-OH末端。" },
  { id: "pol3", name: "DNA聚合酶Ⅲ", en: "DNA Polymerase III", role: "延伸子链", color: "#2677D9", detail: "沿模板加入脱氧核苷酸，使新链始终按5′→3′方向延伸。" },
  { id: "pol1", name: "DNA聚合酶Ⅰ", en: "DNA Polymerase I", role: "去引物并补链", color: "#A855F7", detail: "切除RNA引物，并以DNA核苷酸填补原来由引物占据的位置。" },
  { id: "ligase", name: "DNA连接酶", en: "DNA Ligase", role: "封闭切口", color: "#E0A11B", detail: "催化形成磷酸二酯键，封闭相邻DNA片段之间的切口。" },
];

const SPEEDS = [0.65, 1, 1.4, 1.8];
const STAGE_DURATION = 6000;
const state = {
  stageIndex: 0,
  stageProgress: 0,
  playing: false,
  speedIndex: 1,
  labels: true,
  highlight: true,
  activeEnzyme: "",
  lastTime: 0,
};

const root = document.querySelector("[data-independent-model-root]");

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
        <span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span>
        <span class="independent-model-back-label"><span>返回</span><span>主页</span></span>
      </a>
      <div class="independent-model-heading">
        <span class="independent-model-kicker">${MODEL_CONTENT.chapter}</span>
        <h1>${MODEL_CONTENT.title} <small>/ ${MODEL_CONTENT.titleEn}</small></h1>
      </div>
      <button class="shell-icon-button" type="button" data-replication-settings aria-label="显示与操作"></button>
    </header>

    <section class="independent-model-workspace">
      <section class="model-area" data-model-area>
        <nav class="stage-strip" data-stage-strip aria-label="DNA复制阶段"></nav>
        <div class="model-stage" data-model-stage>
          <button class="shell-action replication-context-trigger" type="button" data-replication-context>阶段与酶 ↗</button>
          <div class="replication-workbench">
            <section class="replication-scene-panel" aria-label="DNA复制动画工作区">
              <svg class="replication-scene" data-replication-scene viewBox="0 0 980 640" role="img" aria-labelledby="sceneTitle sceneDescription">
                <title id="sceneTitle">原核生物DNA复制二维模型</title>
                <desc id="sceneDescription">展示拓扑异构酶、解旋酶、引物酶、DNA聚合酶Ⅲ、DNA聚合酶Ⅰ和DNA连接酶参与DNA复制的连续过程。</desc>
                <defs>
                  <filter id="strandShadow" x="-20%" y="-30%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#17384a" flood-opacity=".18"/></filter>
                  <filter id="newStrandGlow" x="-30%" y="-40%" width="160%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#22a8b6" flood-opacity=".28"/></filter>
                  <filter id="enzymeFocus" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#ffcc55" flood-opacity=".9"/></filter>
                  <filter id="okazakiGlow" x="-40%" y="-160%" width="180%" height="420%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#79ff69" flood-opacity=".95"/></filter>
                  <marker id="arrowGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#31816e"/></marker>
                  <marker id="arrowRed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="#e0526a"/></marker>
                  <linearGradient id="topoGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b794f6"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
                  <linearGradient id="helicaseGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#78d7ad"/><stop offset="1" stop-color="#21835f"/></linearGradient>
                  <linearGradient id="pol3Gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#64b5f6"/><stop offset="1" stop-color="#1c63c7"/></linearGradient>
                  <linearGradient id="primaseGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd978"/><stop offset=".55" stop-color="#f59e0b"/><stop offset="1" stop-color="#b96405"/></linearGradient>
                  <linearGradient id="pol1Gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8b4fe"/><stop offset=".52" stop-color="#a855f7"/><stop offset="1" stop-color="#7030a0"/></linearGradient>
                  <linearGradient id="ligaseGradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe07c"/><stop offset=".55" stop-color="#e0a11b"/><stop offset="1" stop-color="#a46606"/></linearGradient>
                </defs>

                <rect x="10" y="10" width="960" height="620" rx="24" fill="#fbfefe"/>

                <g data-base-pairs></g>
                <g data-hydrogen-bonds></g>
                <path class="dna-template-path" data-template-top/>
                <path class="dna-template-path" data-template-bottom/>
                <g data-leading-chain>
                  <path class="dna-new-path" data-leading-dna/>
                  <path class="primer-path" data-leading-primer/>
                  <path class="dna-new-path" data-leading-primer-replacement/>
                </g>
                <g data-lagging-chain></g>
                <g data-nicks></g>

                <g data-direction-arrows>
                  <path class="flow-arrow" data-leading-arrow opacity="0"/>
                  <path class="flow-arrow" data-lagging-arrow opacity="0"/>
                </g>

                <g data-okazaki-label opacity="0">
                  <path class="okazaki-guide" data-okazaki-guide marker-end="url(#arrowGreen)"/>
                  <text class="model-label okazaki-label" data-okazaki-text text-anchor="middle">冈崎片段 Okazaki fragment</text>
                </g>

                <g data-enzymes>
                  <g class="enzyme-node" data-enzyme-node="topoisomerase" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node="helicase" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node="primase" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node="pol3" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node-secondary="pol3" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node="pol1" opacity="0"></g>
                  <g class="enzyme-node" data-enzyme-node="ligase" opacity="0"></g>
                </g>

                <g data-labels>
                  <text class="model-label" data-label-leading x="185" y="178" opacity="0">前导链 Leading strand</text>
                  <text class="model-label" data-label-lagging x="185" y="492" opacity="0">后随链 Lagging strand</text>
                  <text class="model-label" data-label-fork x="640" y="300" opacity="0">复制叉</text>
                  <text class="model-label primer-label" data-label-primer x="112" y="252" opacity="0">RNA引物</text>
                  <text class="end-label" data-end-top-left x="72" y="0">3′</text>
                  <text class="end-label" data-end-top-right x="914" y="0">5′</text>
                  <text class="end-label" data-end-bottom-left x="72" y="0">5′</text>
                  <text class="end-label" data-end-bottom-right x="914" y="0">3′</text>
                  <text class="end-label new" data-end-leading-left x="110" y="0" opacity="0">5′</text>
                  <text class="end-label new" data-end-leading-right x="0" y="0" opacity="0">3′</text>
                  <text class="end-label primer" data-end-lagging-primer x="0" y="0" opacity="0">5′</text>
                  <text class="end-label new" data-end-lagging-growing x="0" y="0" opacity="0">3′</text>
                </g>
              </svg>
            </section>

            <aside class="replication-info" aria-live="polite">
              <section class="stage-status">
                <p class="stage-status-kicker" data-stage-kicker>STAGE 01 / 05</p>
                <h2 data-stage-title>超螺旋松弛<small data-stage-title-en>Supercoil Relaxation</small></h2>
                <p data-stage-summary></p>
              </section>
              <div class="direction-rule"><strong>复制方向的绝对规则</strong><span class="direction-main">新链始终 5′ → 3′ 合成</span><br />DNA聚合酶沿模板链3′→5′读取，并把新核苷酸连接到子链3′端。</div>
              <div class="enzyme-panel-title"><strong>复制酶与结构</strong><span>再次点击可取消聚焦</span></div>
              <div class="enzyme-buttons" data-enzyme-buttons></div>
              <div class="enzyme-detail" data-enzyme-detail><strong>观察提示：</strong>选择一种酶，可在模型中聚焦其当前位置与作用。</div>
              <div class="legend-row">
                <span class="legend-pill"><i class="legend-line" style="--legend:#263d56"></i>亲代链</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#22a8b6"></i>新DNA</span>
                <span class="legend-pill"><i class="legend-line" style="--legend:#e85d75"></i>RNA引物</span>
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
          <label class="timeline-wrap"><span>过程进度</span><input data-timeline type="range" aria-label="过程进度" min="0" max="1000" value="0" /><output data-progress-label>0%</output></label>
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
  </main>
`;

const refs = {
  app: root.querySelector("[data-model-app]"),
  modelArea: root.querySelector("[data-model-area]"),
  stageStrip: root.querySelector("[data-stage-strip]"),
  scene: root.querySelector("[data-replication-scene]"),
  stageKicker: root.querySelector("[data-stage-kicker]"),
  stageTitle: root.querySelector("[data-stage-title]"),
  stageTitleEn: root.querySelector("[data-stage-title-en]"),
  stageSummary: root.querySelector("[data-stage-summary]"),
  enzymeButtons: root.querySelector("[data-enzyme-buttons]"),
  enzymeDetail: root.querySelector("[data-enzyme-detail]"),
  timeline: root.querySelector("[data-timeline]"),
  templateTop: root.querySelector("[data-template-top]"),
  templateBottom: root.querySelector("[data-template-bottom]"),
  basePairs: root.querySelector("[data-base-pairs]"),
  hydrogenBonds: root.querySelector("[data-hydrogen-bonds]"),
  leadingDna: root.querySelector("[data-leading-dna]"),
  leadingPrimer: root.querySelector("[data-leading-primer]"),
  leadingPrimerReplacement: root.querySelector("[data-leading-primer-replacement]"),
  laggingChain: root.querySelector("[data-lagging-chain]"),
  nicks: root.querySelector("[data-nicks]"),
  leadingArrow: root.querySelector("[data-leading-arrow]"),
  laggingArrow: root.querySelector("[data-lagging-arrow]"),
  okazakiLabel: root.querySelector("[data-okazaki-label]"),
  okazakiGuide: root.querySelector("[data-okazaki-guide]"),
  okazakiText: root.querySelector("[data-okazaki-text]"),
  labelLeading: root.querySelector("[data-label-leading]"),
  labelLagging: root.querySelector("[data-label-lagging]"),
  labelFork: root.querySelector("[data-label-fork]"),
  labelPrimer: root.querySelector("[data-label-primer]"),
  endTopLeft: root.querySelector("[data-end-top-left]"),
  endTopRight: root.querySelector("[data-end-top-right]"),
  endBottomLeft: root.querySelector("[data-end-bottom-left]"),
  endBottomRight: root.querySelector("[data-end-bottom-right]"),
  endLeadingLeft: root.querySelector("[data-end-leading-left]"),
  endLeadingRight: root.querySelector("[data-end-leading-right]"),
  endLaggingPrimer: root.querySelector("[data-end-lagging-primer]"),
  endLaggingGrowing: root.querySelector("[data-end-lagging-growing]"),
};

const enzymeNodes = Object.fromEntries(ENZYMES.map((enzyme) => [enzyme.id, root.querySelector(`[data-enzyme-node="${enzyme.id}"]`)]));
const pol3LagNode = root.querySelector('[data-enzyme-node-secondary="pol3"]');
let sceneView = null;
let shellExperience = null;
const controlSignatures = new Map();
let lastStageInfo = -1;

function installEnzymeStructures() {
  const asset = (id, size = 94) => `<image class="enzyme-image" href="assets/enzyme-${id}.png" x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
  enzymeNodes.topoisomerase.innerHTML = `${asset("topoisomerase", 102)}<text class="enzyme-caption" x="0" y="60" text-anchor="middle">拓扑异构酶</text><text class="enzyme-caption-small" x="0" y="73" text-anchor="middle">Topoisomerase</text>`;
  enzymeNodes.helicase.innerHTML = `${asset("helicase", 96)}<text class="enzyme-caption" x="0" y="58" text-anchor="middle">解旋酶</text><text class="enzyme-caption-small" x="0" y="71" text-anchor="middle">Helicase</text>`;
  enzymeNodes.primase.innerHTML = `${asset("primase", 92)}<text class="enzyme-caption" x="0" y="56" text-anchor="middle">引物酶</text><text class="enzyme-caption-small" x="0" y="69" text-anchor="middle">Primase</text>`;
  const pol3Markup = (subtitle) => `${asset("pol3", 102)}<text class="enzyme-caption" x="0" y="61" text-anchor="middle">DNA聚合酶Ⅲ</text><text class="enzyme-caption-small" x="0" y="74" text-anchor="middle">${subtitle}</text>`;
  enzymeNodes.pol3.innerHTML = pol3Markup("前导链 Leading");
  pol3LagNode.innerHTML = pol3Markup("后随链 Lagging");
  enzymeNodes.pol1.innerHTML = `${asset("pol1", 100)}<text class="enzyme-caption" x="0" y="60" text-anchor="middle">DNA聚合酶Ⅰ</text><text class="enzyme-caption-small" x="0" y="73" text-anchor="middle">DNA Polymerase I</text>`;
  enzymeNodes.ligase.innerHTML = `${asset("ligase", 96)}<text class="enzyme-caption" x="0" y="58" text-anchor="middle">DNA连接酶</text><text class="enzyme-caption-small" x="0" y="71" text-anchor="middle">DNA Ligase</text>`;
}

installEnzymeStructures();
const X_MIN = 76;
const X_MAX = 916;
const CENTER_Y = 330;
const CLOSED_TOP_Y = 314;
const CLOSED_BOTTOM_Y = 346;
const OPEN_TOP_Y = 210;
const OPEN_BOTTOM_Y = 450;
const FORK_TRANSITION = 140;
const TOPO_START_X = 70;
const TOPO_END_X = 975;
const TOPO_HELICASE_SPACING = 105;
const REPLISOME_SLOT_SPACING = TOPO_HELICASE_SPACING;
const LAGGING_SLOT_OFFSET = 55;
const ENZYME_MOTION_END = 0.72;
const HELICASE_ENTRY_PROGRESS = 0.088;
const BASE_COUNT = 42;
const BASES = ["A", "T", "G", "C", "C", "A", "T", "G", "A", "C", "G", "T", "T", "A", "C", "G", "G", "T", "A", "C", "A", "G", "C", "T", "T", "C", "A", "G", "G", "A", "T", "C", "C", "G", "A", "T", "G", "C"];
const BASE_COLORS = { A: "#ef6f84", T: "#35b98a", C: "#3186c7", G: "#f1bd45" };
const COMPLEMENT = { A: "T", T: "A", C: "G", G: "C" };
const FRAGMENTS = [
  { left: 150, right: 330, start: 0.04 },
  { left: 330, right: 510, start: 0.34 },
  { left: 510, right: 690, start: 0.64 },
];
const POL1_ACTIONS = [
  { x: 136, side: "top", offset: 34, arrive: 0.68, replaceStart: 0.70, replaceEnd: 0.75 },
  { x: 318, side: "bottom", offset: -34, arrive: 0.76, replaceStart: 0.78, replaceEnd: 0.83 },
  { x: 498, side: "bottom", offset: -34, arrive: 0.84, replaceStart: 0.86, replaceEnd: 0.91 },
  { x: 678, side: "bottom", offset: -34, arrive: 0.92, replaceStart: 0.94, replaceEnd: 0.99 },
];
const LIGASE_ACTIONS = [
  { x: 330, arrive: 0.84, sealStart: 0.86, sealEnd: 0.90 },
  { x: 510, arrive: 0.92, sealStart: 0.94, sealEnd: 0.98 },
];
const fragmentVisuals = [];
const nickVisuals = [];
const dnaLayers = {};

function svgElement(name, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function pointsPath(points) {
  return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

function emptyBasePathData() {
  return { A: "", T: "", G: "", C: "" };
}

function createColoredPathMap(group, className) {
  return Object.fromEntries(Object.keys(BASE_COLORS).map((base) => {
    const node = svgElement("path", { class: className, stroke: BASE_COLORS[base] });
    group.append(node);
    return [base, node];
  }));
}

function applyPathData(nodes, pathData) {
  Object.keys(BASE_COLORS).forEach((base) => nodes[base].setAttribute("d", pathData[base] || ""));
}

function baseX(index) {
  return mix(X_MIN + 12, X_MAX - 12, index / (BASE_COUNT - 1));
}

function baseForX(x) {
  const index = Math.round(clamp((x - X_MIN) / (X_MAX - X_MIN)) * (BASE_COUNT - 1));
  return BASES[index % BASES.length];
}

function initializeSceneElements() {
  refs.basePairs.replaceChildren();
  refs.hydrogenBonds.replaceChildren();
  const templateTopBases = createColoredPathMap(refs.basePairs, "base-line base-compound");
  const templateBottomBases = createColoredPathMap(refs.basePairs, "base-line base-compound");
  const hydrogenPaths = [0.92, 0.56, 0.25].map((opacity) => {
    const node = svgElement("path", { class: "hydrogen-bond hydrogen-compound", opacity });
    refs.hydrogenBonds.append(node);
    return node;
  });

  const leadingBaseGroup = svgElement("g", { class: "new-base-pairs" });
  const leadingBasePaths = createColoredPathMap(leadingBaseGroup, "base-line new-base-line base-compound");
  refs.leadingDna.parentNode.insertBefore(leadingBaseGroup, refs.leadingDna);
  Object.assign(dnaLayers, { templateTopBases, templateBottomBases, hydrogenPaths, leadingBasePaths });

  FRAGMENTS.forEach((fragment, index) => {
    const bases = svgElement("g", { class: "new-base-pairs" });
    const basePaths = createColoredPathMap(bases, "base-line new-base-line base-compound");
    const highlight = svgElement("path", { class: "okazaki-highlight", "data-okazaki-highlight": index });
    const dna = svgElement("path", { class: "dna-new-path okazaki-dna", "data-fragment-index": index });
    const primer = svgElement("path", { class: "primer-path", "data-primer-index": index });
    const replacement = svgElement("path", { class: "dna-new-path", "data-replacement-index": index });
    const end5 = svgElement("text", { class: "end-label primer fragment-end-label", x: fragment.right + 5, y: OPEN_BOTTOM_Y - 46, opacity: 0 });
    end5.textContent = "5′";
    const end3 = svgElement("text", { class: "end-label new fragment-end-label", x: fragment.left - 18, y: OPEN_BOTTOM_Y - 46, opacity: 0 });
    end3.textContent = "3′";
    refs.laggingChain.append(highlight, bases, dna, primer, replacement, end5, end3);
    fragmentVisuals.push({ ...fragment, highlight, bases, basePaths, dna, primer, replacement, end5, end3 });
  });

  [330, 510].forEach((x) => {
    const bridge = svgElement("path", { class: "ligation-bridge" });
    refs.nicks.append(bridge);
    nickVisuals.push({ x, bridge });
  });
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
    highlight: '<path d="M12 3l2.2 5 5.3.5-4 3.6 1.2 5.2-4.7-2.7-4.7 2.7 1.2-5.2-4-3.6 5.3-.5z"></path>',
    fullscreen: '<path d="M8 3H3v5"></path><path d="M16 3h5v5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function button(action) {
  return root.querySelector(`[data-action="${action}"]`);
}

function renderNavigation() {
  if(!refs.stageStrip.children.length)refs.stageStrip.innerHTML=MODEL_CONTENT.stages.map((stage,index)=>`<button class="stage-tab" type="button" data-stage-index="${index}">${globalThis.AnderModelShell.stageContent(index,stage.title,stage.titleEn)}</button>`).join('');
  refs.stageStrip.querySelectorAll('[data-stage-index]').forEach(button=>{const active=Number(button.dataset.stageIndex)===state.stageIndex;button.classList.toggle('is-active',active);button.setAttribute('aria-current',active?'step':'false');});
  globalThis.AnderModelShell.syncActiveStage();shellExperience?.syncStage();
}

function renderEnzymeButtons() {
  refs.enzymeButtons.innerHTML = ENZYMES.map((enzyme) => `
    <button class="enzyme-button${state.activeEnzyme === enzyme.id ? " is-active" : ""}" type="button" data-enzyme-button="${enzyme.id}" style="--enzyme-color:${enzyme.color}" aria-pressed="${state.activeEnzyme === enzyme.id}">
      <span class="enzyme-button-dot" aria-hidden="true"></span>
      <span><strong>${enzyme.name}</strong><small>${enzyme.en}</small></span>
      <span class="enzyme-button-role">${enzyme.role}</span>
    </button>
  `).join("");
}

function renderStageCopy() {
  if(lastStageInfo===state.stageIndex)return;lastStageInfo=state.stageIndex;
  const stage = MODEL_CONTENT.stages[state.stageIndex];
  const counter = String(state.stageIndex + 1).padStart(2, "0");
  refs.stageKicker.textContent = `STAGE ${counter} / 05`;
  refs.stageTitle.childNodes[0].nodeValue = stage.title;
  refs.stageTitleEn.textContent = stage.titleEn;
  refs.stageSummary.textContent = stage.summary;
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
  refs.app.classList.toggle("hidden-labels", !state.labels);
  refs.app.classList.toggle("highlight-off", !state.highlight);
  refs.scene.classList.toggle("is-paused", !state.playing);
  renderTimeline();
}

function renderTimeline() {
  const globalProgress = (state.stageIndex + state.stageProgress) / MODEL_CONTENT.stages.length;
  refs.timeline.value = String(Math.round(globalProgress * 1000));
  root.querySelector("[data-progress-label]").textContent=`${Math.round(globalProgress*100)}%`;
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

function smooth(value) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function mix(a, b, amount) {
  return a + (b - a) * amount;
}

function processProgress() {
  return clamp((state.stageIndex + state.stageProgress) / MODEL_CONTENT.stages.length);
}

function windowProgress(start, end, progress = processProgress()) {
  return smooth(clamp((progress - start) / (end - start)));
}

function linearWindowProgress(start, end, progress = processProgress()) {
  return clamp((progress - start) / (end - start));
}

function topoisomeraseX() {
  return mix(TOPO_START_X, TOPO_END_X, linearWindowProgress(0, ENZYME_MOTION_END));
}

function currentForkX() {
  return clamp(topoisomeraseX() - TOPO_HELICASE_SPACING, X_MIN, 870);
}

function topoisomeraseFrontX() {
  return topoisomeraseX();
}

function forkGeometryAt(x, forkX = currentForkX()) {
  const open = smooth(clamp((forkX - x) / FORK_TRANSITION));
  const separation = mix((CLOSED_BOTTOM_Y - CLOSED_TOP_Y) / 2, (OPEN_BOTTOM_Y - OPEN_TOP_Y) / 2, open);
  return {
    top: { x, y: CENTER_Y - separation },
    bottom: { x, y: CENTER_Y + separation },
    open,
  };
}

function geometryAt(x) {
  const ratio = (x - X_MIN) / (X_MAX - X_MIN);
  const phase = ratio * Math.PI * 18;
  const helixTop = CENTER_Y - 18 * Math.sin(phase);
  const helixBottom = CENTER_Y + 18 * Math.sin(phase);
  const relaxed = smooth(clamp((topoisomeraseFrontX() - x) / 72));
  const fork = forkGeometryAt(x);
  const open = fork.open * windowProgress(HELICASE_ENTRY_PROGRESS, HELICASE_ENTRY_PROGRESS + 0.025);
  const relaxedTop = mix(helixTop, CLOSED_TOP_Y, relaxed);
  const relaxedBottom = mix(helixBottom, CLOSED_BOTTOM_Y, relaxed);
  return {
    top: { x, y: mix(relaxedTop, fork.top.y, open) },
    bottom: { x, y: mix(relaxedBottom, fork.bottom.y, open) },
    open,
    relaxed,
  };
}

function newStrandY(x, side, offset, forkX = currentForkX()) {
  return geometryAt(x)[side].y + offset;
}

function newStrandPath(startX, endX, side, offset, reverse = false, forkX = currentForkX()) {
  if (endX <= startX + 1) return "";
  const count = Math.max(3, Math.ceil((endX - startX) / 10));
  const points = [];
  for (let index = 0; index <= count; index += 1) {
    const x = mix(startX, endX, index / count);
    points.push({ x, y: newStrandY(x, side, offset, forkX) });
  }
  if (reverse) points.reverse();
  return pointsPath(points);
}

function setOpacity(node, value) {
  node.setAttribute("opacity", String(clamp(value)));
}

function updateTemplateState() {
  const topPoints = [];
  const bottomPoints = [];
  for (let index = 0; index <= 96; index += 1) {
    const x = mix(X_MIN, X_MAX, index / 96);
    const geometry = geometryAt(x);
    topPoints.push(geometry.top);
    bottomPoints.push(geometry.bottom);
  }
  refs.templateTop.setAttribute("d", pointsPath(topPoints));
  refs.templateBottom.setAttribute("d", pointsPath(bottomPoints));

  const topBaseData = emptyBasePathData();
  const bottomBaseData = emptyBasePathData();
  const hydrogenData = ["", "", ""];
  for (let index = 0; index < BASE_COUNT; index += 1) {
    const x = baseX(index);
    const geometry = geometryAt(x);
    const top = geometry.top;
    const bottom = geometry.bottom;
    const direction = Math.sign(bottom.y - top.y) || 1;
    const midpointY = (top.y + bottom.y) / 2;
    const split = smooth(clamp(geometry.open * 1.25));
    const topInner = mix(midpointY - direction * 2, top.y + direction * 18, split);
    const bottomInner = mix(midpointY + direction * 2, bottom.y - direction * 18, split);
    const base = BASES[index % BASES.length];
    topBaseData[base] += `M${x.toFixed(1)} ${top.y.toFixed(1)} L${x.toFixed(1)} ${topInner.toFixed(1)} `;
    bottomBaseData[COMPLEMENT[base]] += `M${x.toFixed(1)} ${bottom.y.toFixed(1)} L${x.toFixed(1)} ${bottomInner.toFixed(1)} `;
    if (geometry.open < 0.92) {
      const bucket = geometry.open < 0.3 ? 0 : geometry.open < 0.65 ? 1 : 2;
      hydrogenData[bucket] += `M${x.toFixed(1)} ${topInner.toFixed(1)} L${x.toFixed(1)} ${bottomInner.toFixed(1)} `;
    }
  }
  applyPathData(dnaLayers.templateTopBases, topBaseData);
  applyPathData(dnaLayers.templateBottomBases, bottomBaseData);
  dnaLayers.hydrogenPaths.forEach((node, index) => node.setAttribute("d", hydrogenData[index]));
}

function updateNewBasePaths(nodes, startX, endX, side, forkX = currentForkX(), exclusions = []) {
  const pathData = emptyBasePathData();
  if (endX > startX + 1) {
    for (let index = 0; index < BASE_COUNT; index += 1) {
      const x = baseX(index);
      if (x < startX || x > endX) continue;
      if (exclusions.some((center) => Math.abs(x - center) < 10)) continue;
      const templateBase = baseForX(x);
      const newBase = side === "top" ? COMPLEMENT[templateBase] : templateBase;
      const templateY = geometryAt(x)[side].y;
      const direction = side === "top" ? 1 : -1;
      pathData[newBase] += `M${x.toFixed(1)} ${(templateY + direction * 19).toFixed(1)} L${x.toFixed(1)} ${(templateY + direction * 32).toFixed(1)} `;
    }
  }
  applyPathData(nodes, pathData);
}

function fragmentKinetics(fragment, forkX = currentForkX()) {
  const triggerX = fragment.right + 38;
  const primer = smooth(clamp((forkX - triggerX) / 32));
  const synthesis = smooth(clamp((forkX - triggerX - 26) / 110));
  return { triggerX, primer, synthesis, front: mix(fragment.right - 24, fragment.left, synthesis) };
}

function leadingKinetics(forkX = currentForkX()) {
  return {
    primer: smooth(clamp((forkX - 215) / 48)),
    synthesis: smooth(clamp((forkX - 270) / 82)),
  };
}

function primaseVisibility(position, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd) {
  const fadeIn = smooth(clamp((position - fadeInStart) / (fadeInEnd - fadeInStart)));
  const fadeOut = 1 - smooth(clamp((position - fadeOutStart) / (fadeOutEnd - fadeOutStart)));
  return fadeIn * fadeOut;
}

function laggingPrimaseState(fragment, forkX = currentForkX()) {
  const kinetics = fragmentKinetics(fragment, forkX);
  const opacity = primaseVisibility(
    forkX,
    kinetics.triggerX - 26,
    kinetics.triggerX - 8,
    kinetics.triggerX + 48,
    kinetics.triggerX + 76,
  );
  return {
    fragment,
    kinetics,
    opacity,
    x: mix(fragment.right, fragment.right - 24, kinetics.primer),
  };
}

function replacementProgress(action) {
  return windowProgress(action.replaceStart, action.replaceEnd);
}

function updateNewStrands() {
  const forkX = currentForkX();
  const leadingPrimerEnd = 162;
  const leading = leadingKinetics(forkX);
  const leadingPrimerGrowth = leading.primer;
  const leadingReplace = replacementProgress(POL1_ACTIONS[0]);
  const leadingPrimerVisibleEnd = mix(108, leadingPrimerEnd, leadingPrimerGrowth);
  const leadingPrimerDegradeFront = mix(108, leadingPrimerEnd, leadingReplace);
  refs.leadingPrimer.setAttribute("d", newStrandPath(leadingPrimerDegradeFront, leadingPrimerVisibleEnd, "top", 34));
  setOpacity(refs.leadingPrimer, leadingPrimerVisibleEnd > leadingPrimerDegradeFront + 1 ? 1 : 0);

  const leadingTarget = Math.max(leadingPrimerEnd, forkX - REPLISOME_SLOT_SPACING);
  const leadingEnd = mix(leadingPrimerEnd, leadingTarget, leading.synthesis);
  refs.leadingDna.setAttribute("d", leading.synthesis > 0 ? newStrandPath(leadingPrimerEnd, leadingEnd, "top", 34) : "");
  const leadingPairEnd = mix(108, leadingPrimerEnd, leadingPrimerGrowth);
  const pairedLeadingEnd = Math.max(leadingPairEnd, leading.synthesis > 0 ? leadingEnd : leadingPairEnd);
  updateNewBasePaths(dnaLayers.leadingBasePaths, 108, pairedLeadingEnd, "top", forkX);

  refs.leadingPrimerReplacement.setAttribute("d", newStrandPath(108, leadingPrimerDegradeFront, "top", 34));
  setOpacity(refs.leadingPrimerReplacement, leadingReplace > 0 ? 1 : 0);

  const fragmentStates = [];
  fragmentVisuals.forEach((visual, index) => {
    const kinetics = fragmentKinetics(visual, forkX);
    const primerStart = visual.right - 24;
    const primerFront = mix(visual.right, primerStart, kinetics.primer);
    const replacement = replacementProgress(POL1_ACTIONS[index + 1]);
    const replacementTarget = visual.right - (index < fragmentVisuals.length - 1 ? 5 : 0);
    const primerDegradeFront = mix(primerStart, visual.right, replacement);
    const remainingPrimerStart = Math.max(primerFront, primerDegradeFront);
    visual.primer.setAttribute("d", newStrandPath(remainingPrimerStart, visual.right, "bottom", -34, true, forkX));
    setOpacity(visual.primer, visual.right > remainingPrimerStart + 1 ? 1 : 0);
    const replacementFront = mix(primerStart, replacementTarget, replacement);
    visual.replacement.setAttribute("d", newStrandPath(primerStart, replacementFront, "bottom", -34, false, forkX));
    setOpacity(visual.replacement, replacement > 0 ? 1 : 0);
    const dnaTarget = visual.left + (index > 0 ? 5 : 0);
    const growingFront = mix(primerStart, dnaTarget, kinetics.synthesis);
    const fragmentPath = kinetics.synthesis > 0 ? newStrandPath(growingFront, primerStart, "bottom", -34, true, forkX) : "";
    visual.dna.setAttribute("d", fragmentPath);
    setOpacity(visual.dna, kinetics.synthesis);
    visual.highlight.setAttribute("d", fragmentPath);
    const highlightFade = index < LIGASE_ACTIONS.length
      ? 1 - windowProgress(LIGASE_ACTIONS[index].sealStart, LIGASE_ACTIONS[index].sealEnd)
      : 1 - windowProgress(0.96, 1);
    setOpacity(visual.highlight, kinetics.synthesis * 0.72 * highlightFade);
    setOpacity(visual.end5, kinetics.primer);
    setOpacity(visual.end3, kinetics.synthesis);
    const end5Y = newStrandY(visual.right, "bottom", -34, forkX) - 12;
    const end3Y = newStrandY(growingFront, "bottom", -34, forkX) - 12;
    visual.end5.setAttribute("x", (visual.right + 5).toFixed(1));
    visual.end5.setAttribute("y", end5Y.toFixed(1));
    visual.end3.setAttribute("x", (growingFront - 18).toFixed(1));
    visual.end3.setAttribute("y", end3Y.toFixed(1));
    const pairFront = kinetics.primer > 0.02 ? Math.min(primerFront, growingFront) : visual.right;
    const pairEnd = replacement > 0 ? replacementTarget : visual.right;
    updateNewBasePaths(visual.basePaths, pairFront, pairEnd, "bottom", forkX, [330, 510]);
    fragmentStates.push({ visual, kinetics, primerStart, primerFront, growingFront, replacement });
  });

  nickVisuals.forEach((visual, index) => {
    const action = LIGASE_ACTIONS[index];
    const sealed = windowProgress(action.sealStart, action.sealEnd);
    visual.bridge.setAttribute("d", newStrandPath(visual.x - 6, visual.x + 6, "bottom", -34, false, forkX));
    setOpacity(visual.bridge, sealed);
  });

  const leadingArrowStart = 218;
  const straightRegionEnd = forkX - FORK_TRANSITION * 0.82;
  const leadingArrowEnd = Math.min(leadingEnd - 24, straightRegionEnd);
  const leadingArrowY = newStrandY(leadingArrowStart, "top", 70, forkX);
  refs.leadingArrow.setAttribute("d", leadingArrowEnd > leadingArrowStart ? `M${leadingArrowStart.toFixed(1)} ${leadingArrowY.toFixed(1)} L${leadingArrowEnd.toFixed(1)} ${leadingArrowY.toFixed(1)}` : "");
  const leadingArrowActivity = 1 - windowProgress(0.82, 0.88);
  setOpacity(refs.leadingArrow, smooth(clamp((leadingArrowEnd - leadingArrowStart) / 80)) * leadingArrowActivity);

  const activeLagging = fragmentStates.find(({ kinetics }) => kinetics.synthesis > 0.03 && kinetics.synthesis < 0.995);
  if (activeLagging) {
    const arrowLeft = activeLagging.growingFront + 10;
    const arrowRight = activeLagging.primerStart - 8;
    refs.laggingArrow.setAttribute("d", arrowRight > arrowLeft ? newStrandPath(arrowLeft, arrowRight, "bottom", -70, true, forkX) : "");
    setOpacity(refs.laggingArrow, smooth(clamp((arrowRight - arrowLeft) / 60)));
  } else {
    refs.laggingArrow.setAttribute("d", "");
    setOpacity(refs.laggingArrow, 0);
  }

  const firstFragment = fragmentStates[0];
  const okazakiVisible = firstFragment.kinetics.synthesis * (1 - windowProgress(LIGASE_ACTIONS[0].sealStart, LIGASE_ACTIONS[0].sealEnd));
  const okazakiLeft = Math.min(firstFragment.growingFront, firstFragment.primerStart - 14);
  const okazakiRight = firstFragment.primerStart;
  const okazakiMiddle = (okazakiLeft + okazakiRight) / 2;
  const okazakiStrandY = newStrandY(okazakiMiddle, "bottom", -34, forkX);
  const okazakiY = okazakiStrandY - 58;
  refs.okazakiGuide.setAttribute("d", `M${okazakiMiddle.toFixed(1)} ${(okazakiY + 9).toFixed(1)} L${okazakiMiddle.toFixed(1)} ${(okazakiStrandY - 9).toFixed(1)}`);
  refs.okazakiText.setAttribute("x", okazakiMiddle.toFixed(1));
  refs.okazakiText.setAttribute("y", okazakiY.toFixed(1));
  setOpacity(refs.okazakiLabel, okazakiVisible);

  setOpacity(refs.labelLeading, leadingPrimerGrowth);
  setOpacity(refs.labelLagging, leadingPrimerGrowth);
  setOpacity(refs.labelFork, windowProgress(0.10, 0.14));
  setOpacity(refs.endLeadingLeft, leadingPrimerGrowth);
  setOpacity(refs.endLeadingRight, leading.synthesis);

  refs.endLeadingLeft.setAttribute("x", "102"); refs.endLeadingLeft.setAttribute("y", (newStrandY(108, "top", 34, forkX) + 24).toFixed(1));
  refs.endLeadingRight.setAttribute("x", (Math.max(leadingPrimerEnd, leadingEnd) + 6).toFixed(1)); refs.endLeadingRight.setAttribute("y", (newStrandY(Math.max(leadingPrimerEnd, leadingEnd), "top", 34, forkX) + 24).toFixed(1));
  setOpacity(refs.endLaggingPrimer, 0);
  setOpacity(refs.endLaggingGrowing, 0);

  const activePrimer = fragmentStates.find(({ kinetics }) => kinetics.primer > 0.05 && kinetics.primer < 0.98);
  if (leadingPrimerGrowth > 0.04 && leadingPrimerGrowth < 0.98) {
    refs.labelPrimer.textContent = "RNA引物（前导链）";
    refs.labelPrimer.setAttribute("x", "112");
    refs.labelPrimer.setAttribute("y", (newStrandY(128, "top", 34, forkX) + 20).toFixed(1));
  } else if (activePrimer) {
    refs.labelPrimer.textContent = "RNA引物（后随链）";
    refs.labelPrimer.setAttribute("x", (activePrimer.visual.right - 28).toFixed(1));
    refs.labelPrimer.setAttribute("y", (newStrandY(activePrimer.visual.right, "bottom", -34, forkX) - 18).toFixed(1));
  }
  setOpacity(refs.labelPrimer, leadingPrimerGrowth > 0.04 && leadingPrimerGrowth < 0.98 || Boolean(activePrimer) ? 1 : 0);
}

function positionEnzyme(id, x, y, opacity, scale = 1) {
  const node = enzymeNodes[id];
  node.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`);
  setOpacity(node, opacity);
}

function actionPosition(actions, progress, holdEndKey) {
  if (progress <= actions[0].arrive) return actions[0];
  for (let index = 0; index < actions.length; index += 1) {
    const current = actions[index];
    const next = actions[index + 1];
    if (!next || progress <= current[holdEndKey]) return current;
    if (progress < next.arrive) {
      const travel = smooth(clamp((progress - current[holdEndKey]) / (next.arrive - current[holdEndKey])));
      return {
        x: mix(current.x, next.x, travel),
        side: travel < 0.5 ? current.side : next.side,
        offset: mix(current.offset ?? -34, next.offset ?? -34, travel),
        from: current,
        to: next,
        travel,
      };
    }
  }
  return actions.at(-1);
}

function updateEnzymes() {
  const progress = processProgress();
  const forkX = currentForkX();
  const topoX = topoisomeraseX();
  const topoGeometry = geometryAt(topoX);
  const topoOpacity = 1 - windowProgress(0.72, 0.79, progress);
  const helicaseOpacity = windowProgress(HELICASE_ENTRY_PROGRESS, HELICASE_ENTRY_PROGRESS + 0.025, progress) * (1 - windowProgress(0.82, 0.90, progress));
  positionEnzyme("topoisomerase", topoX, (topoGeometry.top.y + topoGeometry.bottom.y) / 2 - 8, topoOpacity, 0.78);
  positionEnzyme("helicase", forkX, CENTER_Y - 8, helicaseOpacity, 0.76);

  let primaseOpacity = 0;
  let primaseX = 136;
  let primaseY = newStrandY(primaseX, "top", 34, forkX);
  const leadingPrimerGrowth = leadingKinetics(forkX).primer;
  const leadingPrimaseOpacity = primaseVisibility(forkX, 190, 210, 252, 280);
  if (leadingPrimaseOpacity > 0.001) {
    primaseOpacity = leadingPrimaseOpacity;
    primaseX = forkX - REPLISOME_SLOT_SPACING;
    primaseY = newStrandY(primaseX, "top", 34, forkX);
  } else {
    const active = fragmentVisuals
      .map((visual) => laggingPrimaseState(visual, forkX))
      .find(({ opacity }) => opacity > 0.001);
    if (active) {
      primaseOpacity = active.opacity;
      primaseX = active.x;
      primaseY = newStrandY(primaseX, "bottom", -34, forkX);
    }
  }
  positionEnzyme("primase", primaseX, primaseY, primaseOpacity, 0.72);

  const leading = leadingKinetics(forkX);
  const leadingFront = forkX - REPLISOME_SLOT_SPACING;
  const leadingPolymeraseFadeIn = smooth(clamp(leading.synthesis / 0.18));
  const leadingPolymeraseOpacity = leadingPolymeraseFadeIn * (1 - windowProgress(0.80, 0.87, progress));
  positionEnzyme("pol3", leadingFront, newStrandY(leadingFront, "top", 34, forkX), leadingPolymeraseOpacity, 0.76);

  const activeLagging = fragmentVisuals.find((visual) => {
    const kinetics = fragmentKinetics(visual, forkX);
    return kinetics.primer > 0.95 && kinetics.synthesis > 0.02 && kinetics.synthesis < 0.99;
  });
  if (activeLagging) {
    const kinetics = fragmentKinetics(activeLagging, forkX);
    const front = mix(activeLagging.right - 24, activeLagging.left, kinetics.synthesis);
    const laggingX = Math.min(front, forkX - REPLISOME_SLOT_SPACING - LAGGING_SLOT_OFFSET);
    const fadeIn = smooth(clamp((kinetics.synthesis - 0.02) / 0.16));
    const fadeOut = 1 - smooth(clamp((kinetics.synthesis - 0.88) / 0.11));
    pol3LagNode.setAttribute("transform", `translate(${laggingX.toFixed(1)} ${newStrandY(laggingX, "bottom", -34, forkX).toFixed(1)}) scale(.72)`);
    pol3LagNode.setAttribute("opacity", String(fadeIn * fadeOut));
  } else {
    pol3LagNode.setAttribute("opacity", "0");
  }

  const pol1Position = actionPosition(POL1_ACTIONS, progress, "replaceEnd");
  let pol1Y;
  if (pol1Position.from && pol1Position.to) {
    const fromY = newStrandY(pol1Position.from.x, pol1Position.from.side, pol1Position.from.offset, forkX);
    const toY = newStrandY(pol1Position.to.x, pol1Position.to.side, pol1Position.to.offset, forkX);
    pol1Y = mix(fromY, toY, pol1Position.travel);
  } else {
    pol1Y = newStrandY(pol1Position.x, pol1Position.side, pol1Position.offset, forkX);
  }
  const pol1Opacity = windowProgress(0.66, 0.68, progress) * (1 - windowProgress(0.99, 1, progress));
  positionEnzyme("pol1", pol1Position.x, pol1Y, pol1Opacity, 0.74);

  const ligasePosition = actionPosition(LIGASE_ACTIONS, progress, "sealEnd");
  const ligaseY = newStrandY(ligasePosition.x, "bottom", -34, forkX);
  const ligaseOpacity = windowProgress(0.82, 0.84, progress);
  positionEnzyme("ligase", ligasePosition.x, ligaseY, ligaseOpacity, 0.72);
}

function updateEnzymeFocus() {
  Object.entries(enzymeNodes).forEach(([id, node]) => {
    node.classList.toggle("is-focused", Boolean(state.highlight && state.activeEnzyme === id));
    node.classList.toggle("is-dimmed", Boolean(state.highlight && state.activeEnzyme && state.activeEnzyme !== id));
  });
  pol3LagNode.classList.toggle("is-focused", Boolean(state.highlight && state.activeEnzyme === "pol3"));
  pol3LagNode.classList.toggle("is-dimmed", Boolean(state.highlight && state.activeEnzyme && state.activeEnzyme !== "pol3"));
}

function updateEndLabels() {
  const left = geometryAt(X_MIN);
  const right = geometryAt(X_MAX);
  refs.endTopLeft.setAttribute("x", String(X_MIN - 20)); refs.endTopLeft.setAttribute("y", (left.top.y - 20).toFixed(1));
  refs.endTopRight.setAttribute("x", String(X_MAX + 7)); refs.endTopRight.setAttribute("y", (right.top.y - 20).toFixed(1));
  refs.endBottomLeft.setAttribute("x", String(X_MIN - 20)); refs.endBottomLeft.setAttribute("y", (left.bottom.y + 30).toFixed(1));
  refs.endBottomRight.setAttribute("x", String(X_MAX + 7)); refs.endBottomRight.setAttribute("y", (right.bottom.y + 30).toFixed(1));
  refs.labelFork.setAttribute("x", currentForkX() - 26);
  refs.labelFork.setAttribute("y", CENTER_Y - 48);
}

function updateScene() {
  updateTemplateState();
  updateNewStrands();
  updateEnzymes();
  updateEndLabels();
  sceneView?.sync();
}

function renderAll({ navigation = false } = {}) {
  if (navigation) renderNavigation();
  renderStageCopy();
  renderControls();
  updateScene();
}

function selectStage(index, progress = 0, shouldEmit = true) {
  state.stageIndex = Math.max(0, Math.min(MODEL_CONTENT.stages.length - 1, index));
  state.stageProgress = clamp(progress);
  state.activeEnzyme = "";
  renderEnzymeButtons();
  updateEnzymeFocus();
  refs.enzymeDetail.innerHTML = "<strong>观察提示：</strong>选择一种酶，可在模型中聚焦其当前位置与作用。";
  renderAll({ navigation: true });
  if (shouldEmit) emit("model:stage-changed", { stageIndex: state.stageIndex, stageId: MODEL_CONTENT.stages[state.stageIndex].id });
}

function togglePlay(force) {
  state.playing = typeof force === "boolean" ? force : !state.playing;
  if (state.playing && state.stageIndex === MODEL_CONTENT.stages.length - 1 && state.stageProgress >= 0.999) {
    state.stageIndex = 0;
    state.stageProgress = 0;
    renderNavigation();
    renderStageCopy();
  }
  state.lastTime = performance.now();
  renderControls();
  emit("model:state", publicState());
  if (state.playing) requestAnimationFrame(animationLoop);
}

function animationLoop(time) {
  if (!state.playing) return;
  const delta = Math.min(80, time - state.lastTime);
  state.lastTime = time;
  state.stageProgress += (delta * SPEEDS[state.speedIndex]) / STAGE_DURATION;
  if (state.stageProgress >= 1) {
    if (state.stageIndex < MODEL_CONTENT.stages.length - 1) {
      state.stageIndex += 1;
      state.stageProgress = 0;
      state.activeEnzyme = "";
      renderNavigation();
      renderEnzymeButtons();
      updateEnzymeFocus();
      renderStageCopy();
      emit("model:stage-changed", { stageIndex: state.stageIndex, stageId: MODEL_CONTENT.stages[state.stageIndex].id });
    } else {
      state.stageProgress = 1;
      state.playing = false;
      renderControls();
    }
  }
  renderTimeline();
  updateScene();
  emit("model:progress", { progress: (state.stageIndex + state.stageProgress) / MODEL_CONTENT.stages.length, stageIndex: state.stageIndex });
  if (state.playing) requestAnimationFrame(animationLoop);
}

function resetModel() {
  state.stageIndex = 0;
  state.stageProgress = 0;
  state.playing = false;
  state.speedIndex = 1;
  state.labels = true;
  state.highlight = true;
  state.activeEnzyme = "";
  renderEnzymeButtons();
  updateEnzymeFocus();
  refs.enzymeDetail.innerHTML = "<strong>观察提示：</strong>选择一种酶，可在模型中聚焦其当前位置与作用。";
  renderAll({ navigation: true });
  emit("model:state", publicState());
}

function publicState() {
  return {
    modelId: ANDER_MODEL_MANIFEST.id,
    version: ANDER_MODEL_MANIFEST.version,
    stageIndex: state.stageIndex,
    stageId: MODEL_CONTENT.stages[state.stageIndex].id,
    stageProgress: state.stageProgress,
    playing: state.playing,
    speed: SPEEDS[state.speedIndex],
    labels: state.labels,
    highlight: state.highlight,
    activeEnzyme: state.activeEnzyme,
  };
}

function emit(type, payload) {
  if (window.parent === window) return;
  window.parent.postMessage({ source: "ander-model", protocolVersion: "1.0", modelId: ANDER_MODEL_MANIFEST.id, type, payload }, "*");
}

root.addEventListener("click", (event) => {
  const stageButton = event.target.closest("[data-stage-index]");
  if (stageButton) {
    state.playing = false;
    selectStage(Number(stageButton.dataset.stageIndex), 0);
    return;
  }

  const enzymeButton = event.target.closest("[data-enzyme-button]");
  if (enzymeButton) {
    const id = enzymeButton.dataset.enzymeButton;
    state.activeEnzyme = state.activeEnzyme === id ? "" : id;
    const enzyme = ENZYMES.find((item) => item.id === state.activeEnzyme);
    refs.enzymeDetail.innerHTML = enzyme ? `<strong>${enzyme.name}：</strong>${enzyme.detail}` : "<strong>观察提示：</strong>选择一种酶，可在模型中聚焦其当前位置与作用。";
    renderEnzymeButtons();
    updateEnzymeFocus();
    emit("model:state", publicState());
    return;
  }

  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;
  if (action === "play") togglePlay();
  if (action === "reset") resetModel();
  if (action === "prev") { state.playing = false; selectStage(state.stageIndex - 1, 0); }
  if (action === "next") { state.playing = false; selectStage(state.stageIndex + 1, 0); }
  if (action === "speed") { state.speedIndex = (state.speedIndex + 1) % SPEEDS.length; renderControls(); emit("model:state", publicState()); }
  if (action === "labels") { state.labels = !state.labels; renderControls(); emit("model:state", publicState()); }
  if (action === "highlight") { state.highlight = !state.highlight; renderControls(); updateEnzymeFocus(); emit("model:state", publicState()); }
  if (action === "fullscreen") return; // Shared shell owns both display modes.
});

refs.timeline.addEventListener("pointerdown", () => {state.playing=false;renderControls();});
refs.timeline.addEventListener("input", () => {
  state.playing = false;
  const global = Number(refs.timeline.value) / 1000 * MODEL_CONTENT.stages.length;
  const index = Math.min(MODEL_CONTENT.stages.length - 1, Math.floor(global));
  const progress = index === MODEL_CONTENT.stages.length - 1 && global >= MODEL_CONTENT.stages.length ? 1 : global - index;
  const changedStage = index !== state.stageIndex;
  state.stageIndex = index;
  state.stageProgress = clamp(progress);
  if (changedStage) {
    state.activeEnzyme = "";
    renderNavigation();
    renderEnzymeButtons();
    renderStageCopy();
  }
  renderControls();
  updateScene();
  emit("model:progress", { progress: Number(refs.timeline.value) / 1000, stageIndex: state.stageIndex });
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !/INPUT|BUTTON|SELECT|TEXTAREA/.test(event.target.tagName)) {
    event.preventDefault();
    togglePlay();
  }
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || message.source !== "ander-host" || message.protocolVersion !== "1.0") return;
  if (message.modelId && message.modelId !== ANDER_MODEL_MANIFEST.id) return;
  if (message.type === "host:play") togglePlay(true);
  if (message.type === "host:pause") togglePlay(false);
  if (message.type === "host:reset") resetModel();
  if (message.type === "host:set-stage") selectStage(Number(message.payload?.stageIndex || 0), 0);
  if (message.type === "host:set-speed") {
    const requested = Number(message.payload?.speed);
    const nearest = SPEEDS.reduce((best, value, index) => Math.abs(value - requested) < Math.abs(SPEEDS[best] - requested) ? index : best, 0);
    state.speedIndex = nearest;
    renderControls();
  }
  if (message.type === "host:set-labels") { state.labels = Boolean(message.payload?.enabled); renderControls(); }
  if (message.type === "host:set-highlight") { state.highlight = Boolean(message.payload?.enabled); renderControls(); updateEnzymeFocus(); }
  if (message.type === "host:init") emit("model:state", publicState());
});

initializeSceneElements();
renderEnzymeButtons();
updateEnzymeFocus();
renderAll({ navigation: true });
sceneView = globalThis.createReplicationSceneView({ root, scene: refs.scene, nodes: enzymeNodes, getState: () => state, getForkX: currentForkX });
emit("model:ready", { version: ANDER_MODEL_MANIFEST.version, capabilities: ANDER_MODEL_MANIFEST.capabilities });
emit("model:state", publicState());

function mountReplicationExperience(){
  if(shellExperience)return;
  const shell=globalThis.AnderModelShell;
  const openContext=trigger=>shellExperience.showPanel(root.querySelector('.replication-info'),'阶段与酶',trigger);
  const help='<p>播放连续演示；阶段按钮和进度条可定位过程。拖动进度会暂停，切换横竖屏和全屏不会重置过程。</p><p>手机默认跟随当前作用位置，手指拖动可自由观察；在“观察”中点“返回作用处”恢复跟随，点“全景”查看完整画面。</p><p>“阶段与酶”可查看当前摘要并聚焦结构。全屏时轻触唤出控件，松手约两秒后收起。收藏由宿主网站提供，独立打开不写入账户。</p>';
  const settings=trigger=>shellExperience.showDialog('显示与操作',help,trigger,[{label:'返回当前作用处',run:()=>{sceneView.reveal();shellExperience.closeDialog();}}]);
  const onReturn=()=>{
    if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=resolveModelLibraryUrl();
    else shellExperience.showDialog('独立模型预览','<p>当前独立打开 DNA 复制模型，关闭此标签页可返回之前的页面。</p>',document.activeElement);
  };
  shellExperience=shell.mountExperience({root:refs.modelArea,viewport:root.querySelector('.replication-scene-viewport'),title:'DNA 复制',returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'阶段与酶',onSettings:settings,onContext:openContext,hasContext:()=>true,helpContent:help,onDisplayChange:()=>requestAnimationFrame(()=>sceneView?.resize())});
  shell.setExtra(root.querySelector('[data-replication-settings]'),'settings','显示与操作');
  root.querySelector('[data-replication-settings]').addEventListener('click',e=>settings(e.currentTarget));
  root.querySelector('[data-replication-context]').addEventListener('click',e=>openContext(e.currentTarget));
  root.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();onReturn();});
  globalThis.ReplicationSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...state,progress:(state.stageIndex+state.stageProgress)/MODEL_CONTENT.stages.length,speed:SPEEDS[state.speedIndex],view:sceneView.getState(),shell:shellExperience.getState()})});
  const ready=()=>shellExperience.setSceneStatus('ready');
  if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountReplicationExperience,{once:true});else mountReplicationExperience();
