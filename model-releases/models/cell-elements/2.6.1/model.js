"use strict";

const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"cell-elements","version":"2.6.1","publish":true,"title":{"zh":"组成细胞的元素（2D）","en":"Elements in Cells (2D)"},"summary":{"zh":"比较所有元素、大量元素、微量元素、基本元素和最基本元素，并查看元素功能与常见物质组成。","en":"Compare biological element groups and explore concise element functions and the composition of common substances."},"module":{"id":"molecules-and-cells","zh":"分子与细胞","en":"Molecules and Cells"},"technology":"dom-2d","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":false,"reset":true,"stages":true,"speed":false,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"all","title":{"zh":"所有元素","en":"All Elements"}},{"id":"major","title":{"zh":"大量元素","en":"Major Elements"}},{"id":"trace","title":{"zh":"微量元素","en":"Trace Elements"}},{"id":"basic","title":{"zh":"基本元素","en":"Basic Elements"}},{"id":"core","title":{"zh":"最基本元素","en":"Core Element"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","scene-navigation.js","model.js","brand-watermark.js"],"styles":["model.css","shell.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);

const MAJOR_ELEMENTS = new Set(["H", "C", "N", "O", "P", "S", "K", "Ca", "Na", "Mg", "Cl"]);
const TRACE_ELEMENTS = new Set(["Fe", "Mn", "B", "Zn", "Mo", "Cu", "Co", "I", "Se", "Ni", "Si"]);
const BASIC_ELEMENTS = new Set(["C", "H", "O", "N"]);
const CORE_ELEMENTS = new Set(["C"]);
const EXTRACELLULAR_MAJOR_ELEMENTS = new Set(["Na", "Cl"]);
const TEXTBOOK_FUNCTION_ELEMENTS = new Set(["H", "C", "N", "O", "P", "S", "K", "Ca", "Na", "Mg", "Fe"]);

const ELEMENT_FUNCTIONS = {
  H: "构成水和多数有机物，是细胞化合物的基本组成元素。",
  C: "生物大分子以碳链为基本骨架，因此碳是生命的核心元素。",
  N: "是氨基酸、蛋白质、核苷酸和核酸的重要组成元素。",
  O: "构成水和多数有机物，并参与细胞有氧呼吸等氧化反应。",
  P: "构成核酸、磷脂等重要化合物，参与细胞结构和生命活动。",
  S: "构成部分氨基酸和蛋白质，参与维持蛋白质结构。",
  K: "钾离子参与维持细胞渗透平衡、酶活性和神经兴奋。",
  Ca: "钙参与骨骼等结构形成，钙离子还参与肌肉收缩和细胞信号。",
  Na: "钠离子主要分布于细胞外液，参与维持渗透平衡和神经、肌肉细胞的兴奋性；将其归入细胞内“大量元素”存在分类口径差异。",
  Mg: "镁是构成叶绿素的元素，也可作为多种酶的辅助因子。",
  Cl: "氯离子主要分布于细胞外液，参与维持体液渗透压和酸碱平衡；将其归入细胞内“大量元素”存在分类口径差异。",
  B: "硼是某些绿色植物和藻类生长所必需的微量元素。",
  Si: "硅有助于部分植物的结构支持，也参与动物结缔组织形成。",
  V: "钒是部分生物酶系统所需或有益的微量元素，但并非所有生物都必需。",
  Cr: "铬可参与某些动物的糖代谢过程，但其必需性需结合物种判断。",
  Mn: "锰是多种酶的辅助因子，并参与植物光合作用中的水分解反应。",
  Fe: "铁是构成血红素的元素，并参与氧运输和电子传递。",
  Co: "钴是维生素B12的组成元素，参与造血和核酸代谢。",
  Ni: "镍是某些微生物和植物酶的组成元素，如尿素酶。",
  Cu: "铜参与多种氧化还原酶的作用，并帮助铁的吸收与利用。",
  Zn: "锌是许多酶和调节蛋白的重要组成或辅助元素。",
  Se: "硒是某些抗氧化酶的组成元素，适量时帮助抵御氧化损伤。",
  Br: "溴存在于部分生物组织中，但其普遍必需功能尚未完全明确。",
  Mo: "钼是固氮酶等多种氧化还原酶的重要组成元素。",
  I: "碘是构成甲状腺激素的重要元素。",
  F: "氟化物可参与牙齿和骨组织矿化，但过量会造成损害。",
  Al: "暂无公认的普遍必需功能，过量的可溶性铝可能产生生物毒性。",
  Ti: "钛不是公认的普遍必需元素，但可能对部分植物具有促进作用。",
  As: "人体中的必需功能尚未明确，许多砷化合物具有毒性。",
  Cd: "暂无公认的生物必需功能，易在生物体内积累并造成毒害。",
  Hg: "暂无公认的生物必需功能，多种汞化合物具有神经毒性。",
  Pb: "暂无公认的生物必需功能，积累可损害神经和造血系统。",
  W: "部分微生物的酶可以利用钨，但它不是普遍生命必需元素。",
  Rn: "暂无公认的生物必需功能，其放射性会损伤生物组织。"
};

const ROW_DEFINITIONS = [
  [1, "1|H|Hydrogen|1|氢 2|He|Helium|18|氦"],
  [2, "3|Li|Lithium|1|锂 4|Be|Beryllium|2|铍 5|B|Boron|13|硼 6|C|Carbon|14|碳 7|N|Nitrogen|15|氮 8|O|Oxygen|16|氧 9|F|Fluorine|17|氟 10|Ne|Neon|18|氖"],
  [3, "11|Na|Sodium|1|钠 12|Mg|Magnesium|2|镁 13|Al|Aluminium|13|铝 14|Si|Silicon|14|硅 15|P|Phosphorus|15|磷 16|S|Sulfur|16|硫 17|Cl|Chlorine|17|氯 18|Ar|Argon|18|氩"],
  [4, "19|K|Potassium|1|钾 20|Ca|Calcium|2|钙 21|Sc|Scandium|3|钪 22|Ti|Titanium|4|钛 23|V|Vanadium|5|钒 24|Cr|Chromium|6|铬 25|Mn|Manganese|7|锰 26|Fe|Iron|8|铁 27|Co|Cobalt|9|钴 28|Ni|Nickel|10|镍 29|Cu|Copper|11|铜 30|Zn|Zinc|12|锌 31|Ga|Gallium|13|镓 32|Ge|Germanium|14|锗 33|As|Arsenic|15|砷 34|Se|Selenium|16|硒 35|Br|Bromine|17|溴 36|Kr|Krypton|18|氪"],
  [5, "37|Rb|Rubidium|1|铷 38|Sr|Strontium|2|锶 39|Y|Yttrium|3|钇 40|Zr|Zirconium|4|锆 41|Nb|Niobium|5|铌 42|Mo|Molybdenum|6|钼 43|Tc|Technetium|7|锝 44|Ru|Ruthenium|8|钌 45|Rh|Rhodium|9|铑 46|Pd|Palladium|10|钯 47|Ag|Silver|11|银 48|Cd|Cadmium|12|镉 49|In|Indium|13|铟 50|Sn|Tin|14|锡 51|Sb|Antimony|15|锑 52|Te|Tellurium|16|碲 53|I|Iodine|17|碘 54|Xe|Xenon|18|氙"],
  [6, "55|Cs|Caesium|1|铯 56|Ba|Barium|2|钡 57|La|Lanthanum|3|镧 72|Hf|Hafnium|4|铪 73|Ta|Tantalum|5|钽 74|W|Tungsten|6|钨 75|Re|Rhenium|7|铼 76|Os|Osmium|8|锇 77|Ir|Iridium|9|铱 78|Pt|Platinum|10|铂 79|Au|Gold|11|金 80|Hg|Mercury|12|汞 81|Tl|Thallium|13|铊 82|Pb|Lead|14|铅 83|Bi|Bismuth|15|铋 84|Po|Polonium|16|钋 85|At|Astatine|17|砹 86|Rn|Radon|18|氡"],
  [7, "87|Fr|Francium|1|钫 88|Ra|Radium|2|镭 89|Ac|Actinium|3|锕 104|Rf|Rutherfordium|4|𬬻 105|Db|Dubnium|5|𬭊 106|Sg|Seaborgium|6|𬭳 107|Bh|Bohrium|7|𬭛 108|Hs|Hassium|8|𬭶 109|Mt|Meitnerium|9|鿏 110|Ds|Darmstadtium|10|𫟼 111|Rg|Roentgenium|11|𬬭 112|Cn|Copernicium|12|鿔 113|Nh|Nihonium|13|鿭 114|Fl|Flerovium|14|𫓧 115|Mc|Moscovium|15|镆 116|Lv|Livermorium|16|𫟷 117|Ts|Tennessine|17|鿬 118|Og|Oganesson|18|鿫"],
  [8, "58|Ce|Cerium|4|铈 59|Pr|Praseodymium|5|镨 60|Nd|Neodymium|6|钕 61|Pm|Promethium|7|钷 62|Sm|Samarium|8|钐 63|Eu|Europium|9|铕 64|Gd|Gadolinium|10|钆 65|Tb|Terbium|11|铽 66|Dy|Dysprosium|12|镝 67|Ho|Holmium|13|钬 68|Er|Erbium|14|铒 69|Tm|Thulium|15|铥 70|Yb|Ytterbium|16|镱 71|Lu|Lutetium|17|镥"],
  [9, "90|Th|Thorium|4|钍 91|Pa|Protactinium|5|镤 92|U|Uranium|6|铀 93|Np|Neptunium|7|镎 94|Pu|Plutonium|8|钚 95|Am|Americium|9|镅 96|Cm|Curium|10|锔 97|Bk|Berkelium|11|锫 98|Cf|Californium|12|锎 99|Es|Einsteinium|13|锿 100|Fm|Fermium|14|镄 101|Md|Mendelevium|15|钔 102|No|Nobelium|16|锘 103|Lr|Lawrencium|17|铹"]
];

const ELEMENTS = ROW_DEFINITIONS.flatMap(([row, source]) => source.split(" ").map((record) => {
  const [atomicNumber, symbol, name, group, zhName] = record.split("|");
  const category = MAJOR_ELEMENTS.has(symbol) ? "major" : TRACE_ELEMENTS.has(symbol) ? "trace" : "other";
  return { atomicNumber: Number(atomicNumber), symbol, name, zhName, group: Number(group), row, category };
})).sort((left, right) => left.atomicNumber - right.atomicNumber);

const CATEGORY_DETAILS = {
  all: {
    title: "所有元素",
    kicker: "完整周期表 · ALL ELEMENTS",
    description: "展示完整的118种元素；点击任一元素可查看其简要生物学功能。"
  },
  major: {
    title: "大量元素",
    kicker: "功能补充 · CLASSIFICATION NOTE",
    description: "本模型按常用含量口径保留 Na、Cl；二者主要分布于细胞外液，将其归入细胞内“大量元素”存在分类口径差异，因此用浅绿色标示。"
  },
  trace: {
    title: "微量元素",
    kicker: "含量分类 · TRACE ELEMENTS",
    description: "本模型列出 Fe、Mn、B、Zn、Mo、Cu、Co、I、Se、Ni、Si 作为常见示例。含量少并不代表作用小，具体必需元素会因生物类群而异。"
  },
  other: {
    title: "其他元素",
    kicker: "含量分类 · OTHER ELEMENTS",
    description: "这里表示未列入本模型“大量元素”和“微量元素”示例清单的元素。这个标签不等于元素对所有生物都无作用。"
  },
  basic: {
    title: "基本元素",
    kicker: "生命基础 · BASIC ELEMENTS",
    description: "C、H、O、N是构成细胞和生命物质的四种基本元素。"
  },
  core: {
    title: "最基本元素",
    kicker: "生命核心 · CORE ELEMENT",
    description: "碳原子能够形成稳定的碳链，是生物大分子的基本骨架。"
  }
};

const COMPOSITIONS = [
  { id: "water", title: "水", subtitle: "H₂O", symbols: ["H", "O"], description: "水由氢和氧组成。每个水分子含 2 个氢原子和 1 个氧原子。" },
  { id: "carbohydrate", title: "糖类", subtitle: "C · H · O", symbols: ["C", "H", "O"], description: "糖类通常由碳、氢、氧组成。许多糖类的氢、氧原子数比接近 2∶1，但这不是所有糖类的绝对通式。" },
  { id: "fat", title: "脂肪", subtitle: "C · H · O", symbols: ["C", "H", "O"], description: "脂肪（甘油三酯）主要由碳、氢、氧组成，分子中碳氢比例通常高于糖类。" },
  { id: "phospholipid", title: "磷脂", subtitle: "C · H · O · N · P", symbols: ["C", "H", "O", "N", "P"], description: "以常见含氮甘油磷脂为例，组成元素包括碳、氢、氧、氮、磷；不同头部基团的磷脂不一定都含氮。" },
  { id: "sterol", title: "固醇", subtitle: "C · H · O", symbols: ["C", "H", "O"], description: "以胆固醇为代表，固醇由碳、氢、氧组成，并具有多个相连的碳环结构。" },
  { id: "chlorophyll", title: "叶绿素", subtitle: "C · H · O · N · Mg", symbols: ["C", "H", "O", "N", "Mg"], description: "叶绿素 a 与叶绿素 b 的具体原子数不同，但元素种类相同，均由碳、氢、氧、氮、镁组成。" },
  { id: "protein", title: "蛋白质", subtitle: "C · H · O · N · S", symbols: ["C", "H", "O", "N", "S"], description: "蛋白质主要由碳、氢、氧、氮组成；含半胱氨酸或甲硫氨酸的蛋白质还含硫，不同蛋白质的元素组成并不完全相同。" },
  { id: "nucleic-acid", title: "核酸", subtitle: "C · H · O · N · P", symbols: ["C", "H", "O", "N", "P"], description: "DNA 和 RNA 的核苷酸由含氮碱基、五碳糖和磷酸基团组成，因此代表性元素为碳、氢、氧、氮、磷。" }
];

const elementBySymbol = new Map(ELEMENTS.map((element) => [element.symbol, element]));
const CATEGORY_SYMBOLS = {
  all: ELEMENTS.map((element) => element.symbol),
  major: ELEMENTS.filter((element) => MAJOR_ELEMENTS.has(element.symbol)).map((element) => element.symbol),
  trace: ELEMENTS.filter((element) => TRACE_ELEMENTS.has(element.symbol)).map((element) => element.symbol),
  basic: ELEMENTS.filter((element) => BASIC_ELEMENTS.has(element.symbol)).map((element) => element.symbol),
  core: ELEMENTS.filter((element) => CORE_ELEMENTS.has(element.symbol)).map((element) => element.symbol)
};
const state = { stageId: "all", selectionKind: "none", selectionId: null, labels: true };
let hostOrigin = "*";
let shellExperience=null, sceneNavigation=null;

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

function upgradeUnifiedCellElementsShell() {
  const main = document.querySelector(".model-shell");
  const header = document.querySelector(".model-header");
  const oldWorkspace = document.querySelector(".workspace");
  const selection = document.querySelector(".selection-panel");
  const footer = document.querySelector(".model-footer");
  const back = document.querySelector("#backLink");
  const reset = document.querySelector("#resetButton");
  const labels = document.querySelector("#labelsButton");
  const fullscreen = document.querySelector("#fullscreenButton");
  if (!main || !header || !oldWorkspace || !selection || !back) return;

  main.classList.add("independent-model-app");
  header.className = "independent-model-header";
  back.className = "independent-model-back";
  back.setAttribute("aria-label", "返回主页");
  back.innerHTML = '<span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span><span class="independent-model-back-label"><span>返回</span><span>主页</span></span>';
  const heading = document.createElement("div");
  heading.className = "independent-model-heading";
  heading.innerHTML = `<span class="independent-model-kicker">${ANDER_MODEL_MANIFEST.module.zh} / ${ANDER_MODEL_MANIFEST.module.en}</span><h1>${ANDER_MODEL_MANIFEST.title.zh} <small>/ ${ANDER_MODEL_MANIFEST.title.en}</small></h1>`;
  header.replaceChildren(back, heading);

  const unifiedWorkspace = document.createElement("section");
  unifiedWorkspace.className = "independent-model-workspace";
  const modelArea = document.createElement("section");
  modelArea.className = "model-area";
  modelArea.dataset.modelArea = "";
  const stageStrip = document.createElement("nav");
  stageStrip.className = "stage-strip";
  stageStrip.style.setProperty("--stage-count", String(ANDER_MODEL_MANIFEST.stages.length));
  stageStrip.setAttribute("aria-label", "模型阶段");
  stageStrip.innerHTML = ANDER_MODEL_MANIFEST.stages.map((stage, index) => `<button class="stage-tab ${index === 0 ? "is-active" : ""}" type="button" data-unified-stage="${stage.id}">${globalThis.AnderModelShell.stageContent(index, stage.title.zh, stage.title.en)}</button>`).join("");
  const modelStage = document.createElement("div");
  modelStage.className = "model-stage cell-elements-model-stage";
  modelStage.append(oldWorkspace, selection, footer);
  const dock = document.createElement("div");
  dock.className = "control-dock";
  const primary = document.createElement("div");
  primary.className = "control-group control-group-primary";
  const view = document.createElement("div");
  view.className = "control-group control-group-view";
  const end = document.createElement("div");
  end.className = "control-group control-group-end";
  [reset, labels, fullscreen].forEach((button) => button?.classList.add("control-button"));
  [[reset,"reset"],[labels,"labels"],[fullscreen,"fullscreen"]].forEach(([button,action]) => { if (button) button.dataset.action = action; });
  if (reset) primary.append(reset);
  if (labels) view.append(labels);
  if (fullscreen) end.append(fullscreen);
  dock.append(primary, view, end);
  modelArea.append(stageStrip, modelStage, dock);
  unifiedWorkspace.append(modelArea);
  main.replaceChildren(header, unifiedWorkspace);
  back.href = unifiedHomeUrl();

  stageStrip.addEventListener("click", (event) => {
    const button = event.target.closest("[data-unified-stage]");
    if (!button) return;
    const category = button.dataset.unifiedStage;
    if (category === "all") resetModel();
    else selectCategory(category);
  });
}
upgradeUnifiedCellElementsShell();

const table = document.querySelector("#periodicTable");
const compositionButtons = document.querySelector("#compositionButtons");
const selectionKicker = document.querySelector("#selectionKicker");
const selectionTitle = document.querySelector("#selectionTitle");
const selectionDescription = document.querySelector("#selectionDescription");
const elementChips = document.querySelector("#elementChips");
const modelShell = document.querySelector(".model-shell");
const fullscreenTarget = document.querySelector("[data-model-area]");
const labelsButton = document.querySelector("#labelsButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const backLink = document.querySelector("#backLink");

function resolveModelLibraryUrl() {
  const requested = new URLSearchParams(window.location.search).get("return");
  if (requested) {
    try {
      const target = new URL(requested, window.location.href);
      if (target.origin === window.location.origin) return target.href;
    } catch {
      // Fall through to the local model library.
    }
  }
  return new URL("/", window.location.href).href;
}

backLink.href = resolveModelLibraryUrl();

function createPeriodicTable() {
  const fragment = document.createDocumentFragment();
  for (const element of ELEMENTS) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `element-cell category-${element.category}`;
    cell.dataset.symbol = element.symbol;
    cell.dataset.category = element.category;
    cell.style.gridColumn = String(element.group);
    cell.style.gridRow = String(element.row);
    cell.setAttribute("aria-label", `${element.zhName}，${element.symbol}，${element.name}，原子序数 ${element.atomicNumber}`);
    cell.title = `${element.atomicNumber} · ${element.zhName} · ${element.symbol} · ${element.name}`;
    cell.innerHTML = `<span class="atomic-number">${element.atomicNumber}</span><span class="element-symbol">${element.symbol}</span><span class="element-chinese-corner">${element.zhName}</span>`;
    cell.addEventListener("click", () => selectElement(element.symbol));
    fragment.appendChild(cell);
  }
  const lanthanideLabel = document.createElement("div");
  lanthanideLabel.className = "series-label lanthanide-label";
  lanthanideLabel.textContent = "镧系 · LANTHANIDES";
  const actinideLabel = document.createElement("div");
  actinideLabel.className = "series-label actinide-label";
  actinideLabel.textContent = "锕系 · ACTINIDES";
  fragment.append(lanthanideLabel, actinideLabel);
  table.appendChild(fragment);
  document.querySelector("#elementCount").textContent = String(ELEMENTS.length);
}

function createCompositionButtons() {
  compositionButtons.innerHTML = COMPOSITIONS.map((item) => `
    <button class="composition-button" type="button" data-composition="${item.id}" aria-pressed="false">
      <strong>${item.title}</strong>
      <small>${item.subtitle}</small>
    </button>
  `).join("");
  compositionButtons.querySelectorAll("[data-composition]").forEach((button) => {
    button.addEventListener("click", () => selectComposition(button.dataset.composition));
  });
}

function setStage(stageId, emit = true) {
  if (!ANDER_MODEL_MANIFEST.stages.some((stage) => stage.id === stageId)) return;
  const changed = state.stageId !== stageId;
  state.stageId = stageId;
  if (changed && emit) emitModelMessage("model:stage-changed", { stageId, stageIndex: ANDER_MODEL_MANIFEST.stages.findIndex((stage) => stage.id === stageId) });
}

function setSelection(kind, id) {
  state.selectionKind = kind;
  state.selectionId = id;
  updateView();
  emitState();
}

function clearSelection() {
  setStage("all");
  setSelection("none", null);
}

function selectCategory(category, toggle = true) {
  if (toggle && state.selectionKind === "category" && state.selectionId === category) {
    clearSelection();
    return;
  }
  setStage(category);
  setSelection("category", category);
}

function selectComposition(id, toggle = true) {
  if (toggle && state.selectionKind === "composition" && state.selectionId === id) {
    clearSelection();
    return;
  }
  setStage("all");
  setSelection("composition", id);
}

function selectElement(symbol) {
  if (state.selectionKind === "element" && state.selectionId === symbol) {
    clearSelection();
    return;
  }
  setStage("all");
  setSelection("element", symbol);
}

function resetModel() {
  state.stageId = "all";
  state.selectionKind = "none";
  state.selectionId = null;
  state.labels = true;
  sceneNavigation?.reset();
  updateView();
  emitModelMessage("model:stage-changed", { stageId: "all", stageIndex: 0 });
  emitState();
}

function selectedSymbols() {
  if (state.selectionKind === "category") {
    return CATEGORY_SYMBOLS[state.selectionId] || [];
  }
  if (state.selectionKind === "composition") {
    return COMPOSITIONS.find((item) => item.id === state.selectionId)?.symbols || [];
  }
  if (state.selectionKind === "element") return [state.selectionId];
  return [];
}

function updateSelectionCopy(symbols) {
  if (state.selectionKind === "category") {
    const detail = CATEGORY_DETAILS[state.selectionId];
    selectionKicker.textContent = detail.kicker;
    selectionTitle.textContent = detail.title;
    selectionDescription.textContent = detail.description;
  } else if (state.selectionKind === "composition") {
    const detail = COMPOSITIONS.find((item) => item.id === state.selectionId);
    selectionKicker.textContent = "组成物质 · BIOLOGICAL COMPOSITION";
    selectionTitle.textContent = detail.title;
    selectionDescription.textContent = detail.description;
  } else if (state.selectionKind === "element") {
    const element = elementBySymbol.get(state.selectionId);
    const categoryTitle = CATEGORY_DETAILS[element.category].title;
    const functionNote = ELEMENT_FUNCTIONS[element.symbol] || "目前没有公认的普遍必需生物学功能，其生物效应取决于化学形态和剂量。";
    selectionKicker.textContent = EXTRACELLULAR_MAJOR_ELEMENTS.has(element.symbol)
      ? "功能补充 · CLASSIFICATION NOTE"
      : TEXTBOOK_FUNCTION_ELEMENTS.has(element.symbol)
        ? "教材功能 · TEXTBOOK NOTE"
        : "功能补充 · REFERENCE NOTE";
    selectionTitle.textContent = `${element.zhName} · ${element.symbol} · ${element.name}`;
    selectionDescription.textContent = `${functionNote} 原子序数 ${element.atomicNumber}，位于第 ${element.row > 7 ? (element.row === 8 ? 6 : 7) : element.row} 周期，在含量底色中归入“${categoryTitle}”。`;
  } else {
    selectionKicker.textContent = "观察提示";
    selectionTitle.textContent = "选择分类、组成物质或任一元素";
    selectionDescription.textContent = "上方按钮用于比较元素类别；点击单个元素可查看其简要生物学功能。";
  }

  if (!symbols.length) {
    elementChips.innerHTML = '<span class="element-chip placeholder-chip">等待选择</span>';
    return;
  }
  elementChips.innerHTML = symbols.map((symbol) => {
    const element = elementBySymbol.get(symbol);
    return `<span class="element-chip"><strong>${element.zhName}</strong><span>${symbol} · ${element.name}</span></span>`;
  }).join("");
}

function updateShellControls() {
  labelsButton.setAttribute('aria-pressed',String(state.labels));
  globalThis.AnderModelShell.setControl(labelsButton,'labels','标签',state.labels);
}

function updateView() {
  const symbols = selectedSymbols();
  const symbolSet = new Set(symbols);
  document.querySelectorAll(".element-cell").forEach((cell) => {
    const hasSelection = symbols.length > 0;
    const selected = symbolSet.has(cell.dataset.symbol);
    cell.classList.toggle("is-highlighted", hasSelection && selected);
    cell.classList.toggle("is-dimmed", hasSelection && !selected);
    cell.classList.toggle("is-major-caveat", state.selectionKind === "category" && state.selectionId === "major" && EXTRACELLULAR_MAJOR_ELEMENTS.has(cell.dataset.symbol));
    cell.setAttribute("aria-pressed", String(hasSelection && selected));
  });
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.setAttribute("aria-pressed", String(state.selectionKind === "category" && state.selectionId === button.dataset.category));
  });
  document.querySelectorAll("[data-composition]").forEach((button) => {
    button.setAttribute("aria-pressed", String(state.selectionKind === "composition" && state.selectionId === button.dataset.composition));
  });
  modelShell.classList.toggle("labels-hidden", !state.labels);
  updateSelectionCopy(symbols);
  document.querySelectorAll("[data-unified-stage]").forEach((button) => {
    const active = button.dataset.unifiedStage === state.stageId;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  updateShellControls();
  shellExperience?.syncStage();
  const summary=document.querySelector('[data-elements-summary]');if(summary)summary.textContent=selectionTitle.textContent;
}

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => selectCategory(button.dataset.category));
});
document.querySelector("#resetButton").addEventListener("click", resetModel);
labelsButton.addEventListener("click", () => {
  state.labels = !state.labels;
  updateView();
  emitState();
});


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
    stageId: state.stageId,
    playing: false,
    labels: state.labels,
    highlight: state.selectionKind !== "none",
    selectionKind: state.selectionKind,
    selectionId: state.selectionId,
    highlightedElements: selectedSymbols()
  }, requestId);
}

window.addEventListener("message", (event) => {
  const message = event.data;
  if (event.source !== window.parent || !message || message.source !== "ander-host" || message.protocolVersion !== "1.0" || message.modelId !== ANDER_MODEL_MANIFEST.id) return;
  if (message.type === "host:init") hostOrigin = event.origin;
  const payload = message.payload || {};
  if (message.type === "host:reset") {
    resetModel();
    return;
  }
  if (message.type === "host:set-stage") {
    const stageId = payload.stageId;
    if (stageId === "all") resetModel();
    else if (CATEGORY_SYMBOLS[stageId]) selectCategory(stageId, false);
    return;
  }
  if (message.type === "host:set-labels") {
    state.labels = payload.visible !== false;
    updateView();
  }
  if (message.type === "host:set-highlight") {
    if (payload.enabled && state.selectionKind === "none") selectCategory("major", false);
    if (!payload.enabled) {
      clearSelection();
      return;
    }
  }
  emitState(message.requestId);
});

createPeriodicTable();
createCompositionButtons();
prepareElementsExperience();
updateView();
emitModelMessage("model:ready", { version: ANDER_MODEL_MANIFEST.version, capabilities: ANDER_MODEL_MANIFEST.capabilities });

function prepareElementsExperience(){
 const common=globalThis.AnderModelShell,area=document.querySelector('[data-model-area]'),workspace=document.querySelector('.workspace'),card=document.querySelector('.table-card'),viewport=document.querySelector('.periodic-scroll');
 const aside=document.createElement('aside');aside.className='elements-info';aside.setAttribute('aria-label','元素与组成');
 aside.append(document.querySelector('.selection-panel'),document.querySelector('.composition-card'),document.querySelector('.model-footer'));workspace.append(aside);
 const plane=document.createElement('div');plane.className='elements-plane';viewport.append(plane);plane.append(table);
 viewport.setAttribute('aria-label','元素周期表：双指或滚轮缩放，拖动平移；键盘加减缩放，0 显示全表');
 const heading=card.querySelector('.section-heading');heading.innerHTML='<h2>元素周期表 <small data-zoom-value></small></h2><button class="shell-action" type="button" data-elements-context>元素与组成 ↗</button>';
 const summary=document.createElement('p');summary.className='elements-summary';summary.dataset.elementsSummary='';card.append(summary);
 const hint=document.createElement('p');hint.className='elements-gesture-hint';hint.textContent='双指缩放 · 拖动平移 · 点击元素';card.append(hint);
 const primary=area.querySelector('.control-group-primary');
 common.setControl(document.querySelector('#resetButton'),'reset','重置');
 for(const [action,label,icon]of [['fit','全表','view'],['in','放大','zoom-in'],['out','缩小','zoom-out']]){const b=document.createElement('button');b.type='button';b.className='control-button';b.dataset.elementsView=action;common.setControl(b,'camera',label);b.querySelector('svg').innerHTML=action==='fit'?'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>':'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M6 10h8'+(action==='in'?'M10 6v8':'')+'"/>';primary.append(b);}
 const personal=area.querySelector('.control-group-end');personal.className='control-group control-group-personal';
 for(const key of ['tools','help','favorite']){const b=document.createElement('button');b.type='button';b.className='control-button';b.setAttribute('data-shell-'+key,'');personal.insertBefore(b,fullscreenButton);}
 // Static scientific content still has four genuine actions; no artificial playback/timeline.
 sceneNavigation=ModelSceneNavigation({viewport,planes:[plane],width:1030,height:540,initial:'detail',onChange:s=>{heading.querySelector('[data-zoom-value]').textContent=Math.round(s.scale*100)+'%';}});
 primary.addEventListener('click',e=>{const action=e.target.closest('[data-elements-view]')?.dataset.elementsView;if(action==='fit')sceneNavigation.fit();else if(action)sceneNavigation.zoomBy(action==='in'?1.25:.8);});
 const context=trigger=>shellExperience.showPanel(aside,'元素与组成',trigger);
 const help='<p>向内捏合可把全部 118 个元素（含镧系、锕系）缩进当前画面，向外展开可放大细节。双指缩放只改变周期表，不改变按钮和说明文字。</p><p>拖动平移；点“全表”一键查看完整表格。鼠标滚轮缩放；聚焦表格后可用加减号缩放、方向键平移、0 查看全表。双指或拖动结束不会误选元素。</p><p>上方分类高亮相应元素；点选元素后在“元素与组成”查看原有说明和物质组成。进入全屏后，松手约两秒隐藏按钮，触碰唤出。</p>';
 const settings=trigger=>shellExperience.showDialog('显示与操作',help,trigger);
 const onReturn=()=>{if(new URLSearchParams(location.search).has('return')||document.referrer)location.href=unifiedHomeUrl();else shellExperience.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面，也可以继续观察。</p>',document.activeElement);};
 shellExperience=common.mountExperience({root:area,viewport,title:ANDER_MODEL_MANIFEST.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,helpContent:help,settingsLabel:'显示与操作',onSettings:settings,contextLabel:'元素与组成',onContext:context,hasContext:()=>true,onDisplayChange:()=>requestAnimationFrame(()=>sceneNavigation.resize())});
 heading.querySelector('[data-elements-context]').addEventListener('click',e=>context(e.currentTarget));
 const settingsButton=document.createElement('button');settingsButton.type='button';settingsButton.className='shell-icon-button';common.setExtra(settingsButton,'settings','显示与操作');document.querySelector('.independent-model-header').append(settingsButton);settingsButton.addEventListener('click',e=>settings(e.currentTarget));
 backLink.addEventListener('click',e=>{e.preventDefault();onReturn();});shellExperience.setSceneStatus('ready');
 globalThis.ElementsSample=Object.freeze({version:ANDER_MODEL_MANIFEST.version,getState:()=>({...state,shell:shellExperience.getState(),navigation:sceneNavigation.getState()})});
}
