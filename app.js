const app = document.querySelector("[data-app]");
const portalRoot = document.querySelector('[data-site-view="portal"]') || document.querySelector(".studio-main");
const portalActive = () => !window.AnderSiteNavigation || window.AnderSiteNavigation.active("portal");
window.AnderSiteNavigation?.applyStudioStyles();
const modelList = document.querySelector("[data-model-list]");
const resourceEmpty = document.querySelector("[data-resource-empty]");
const resourceTitle = document.querySelector("[data-resource-title]");
const resourceSubtitle = document.querySelector("[data-resource-subtitle]");
const resourceCount = document.querySelector("[data-resource-count]");
const heroModelCount = document.querySelector("[data-hero-model-count]");
const inlineMap = document.querySelector("[data-inline-map]");
const mapFrame = document.querySelector("[data-map-frame]");
const openMapButton = document.querySelector("[data-open-map]");

function closeInlineMap() {
  inlineMap.hidden = true;
  openMapButton.setAttribute("aria-expanded", "false");
}

openMapButton.addEventListener("click", () => {
  inlineMap.hidden = false;
  openMapButton.setAttribute("aria-expanded", "true");
  if (!mapFrame.hasAttribute("src")) mapFrame.src = mapFrame.dataset.src;
  inlineMap.scrollIntoView({ block: "start", behavior: "instant" });
});
document.querySelector("[data-close-map]").addEventListener("click", () => {
  closeInlineMap();
  openMapButton.focus({ preventScroll: true });
  openMapButton.scrollIntoView({ block: "center", behavior: "instant" });
});
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.source !== mapFrame.contentWindow) return;
  if (event.data?.type !== "ander:knowledge-map-height" || !Number.isFinite(event.data.height)) return;
  mapFrame.style.height = `${Math.min(2600, Math.max(600, Math.ceil(event.data.height)))}px`;
});

const PORTAL_SECTIONS = Object.freeze({
  models: {
    eyebrow: "BIOLOGY INTERACTIVE MODELS",
    title: "生物学模型",
    subtitle: "从微观结构到生命过程，让知识可以观察，也可以探索。",
    emptyTitle: "模型正在整理",
    emptyText: "独立模型包发布后会自动出现在这里。",
  },
  exams: {
    eyebrow: "BIOLOGY PRACTICE",
    title: "题目训练",
    subtitle: "在练习与思考中，建立自己的生物学知识体系。",
    emptyTitle: "题目专区 · 待接入",
    emptyText: "这里将接入生物学题目与学习练习，当前暂未开放。",
  },
  ark: {
    eyebrow: "LIFE ARK",
    title: "生命方舟",
    subtitle: "以探索为起点，开启一段关于生命的旅程。",
    emptyTitle: "方舟入口 · 准备接入",
    emptyText: "这里预留生命方舟的统一入口。本轮仅更新入口设计，网站内暂未接入游戏。",
  },
  products: {
    eyebrow: "STUDIO PRODUCTS",
    title: "工作室产品",
    subtitle: "为课堂与自主学习，准备更多有用的工具和内容。",
    emptyTitle: "产品专区 · 待整理",
    emptyText: "工作室的学习工具、教辅及其他产品将在这里统一展示。",
  },
  about: {
    eyebrow: "ABOUT THE STUDIO",
    title: "工作室简介",
    subtitle: "用逻辑和模型，发现生物的美。",
  },
});

let releaseCatalog = [];
const roadmapData = window.ANDER_LEARNING_MAP_DATA || { models: [], counts: {} };
const library = window.AnderStudioLibrary;
let catalogLoaded = false;
let catalogFailed = false;
let catalogTask = null;
let modelFavoriteBindings = [];
let productsRendered = false;
const query = new URLSearchParams(location.search);
let selectedBook = library.books.some(book => book.id === query.get("book")) ? query.get("book") : library.books[0].id;
let selectedProduct = library.products.some(group => group.id === query.get("product")) ? query.get("product") : "books";
let expandedStudioBook = window.AnderStudioBooks?.indexForId(query.get("studioBook")) ?? null;
let expandedStudioCourse = window.AnderStudioCourses?.indexForId(query.get("studioCourse")) ?? 2;
let expandedStudioTool = window.AnderStudioTools?.indexForId(query.get("studioTool")) ?? 0;
const OPTIMIZED_MODEL_COVERS = Object.freeze({
  "cell-elements": "assets/model-covers/cards/cell-elements.webp",
  "bacteriophage-reproduction": "assets/model-covers/cards/bacteriophage-reproduction.webp",
  "dna-webgl": "assets/model-covers/cards/dna-webgl.webp",
  "dna-replication": "assets/model-covers/cards/dna-replication.webp",
  "rna-webgl": "assets/model-covers/cards/rna-webgl.webp",
  "protein-webgl": "assets/model-covers/cards/protein-webgl.webp",
  transport: "assets/model-covers/cards/transport.webp",
  membrane: "assets/model-covers/cards/membrane.webp",
  "plant-cell-webgl": "assets/model-covers/cards/plant-cell-webgl.webp",
  "animal-cell": "assets/model-covers/cards/animal-cell.webp",
  "optical-microscope": "assets/model-covers/cards/optical-microscope.webp",
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function modelUrl(model) {
  const path = String(model.releasePath || "").replace(/^\/+/, "");
  const url = new URL(`/model-releases/${path}`, location.origin);
  const returnUrl = new URL("/index.html", location.origin);
  returnUrl.searchParams.set("book", selectedBook);
  returnUrl.hash = "models";
  url.searchParams.set("return", returnUrl.href);
  return url.href;
}

function cardMarkup(model, index = 0) {
  const title = escapeHtml(model.title?.zh || model.id);
  const summary = escapeHtml(model.summary?.zh || "进入模型进行互动观察。");
  const moduleName = escapeHtml(model.module?.zh || "互动模型");
  const coverPath = String(model.cover || "assets/cover.png").replace(/^\/+/, "");
  const optimizedCoverPath = OPTIMIZED_MODEL_COVERS[model.id];
  const coverUrl = new URL("/" + (optimizedCoverPath || `model-releases/models/${model.id}/${model.version}/${coverPath}`), location.origin);
  if (optimizedCoverPath) coverUrl.searchParams.set("v", String(model.version || "current"));
  const cover = coverUrl.href;
  const firstRowCount = window.matchMedia("(max-width: 540px)").matches ? 2 : window.matchMedia("(max-width: 820px)").matches ? 3 : window.matchMedia("(max-width: 1199px)").matches ? 4 : 5;
  const firstRow = index < firstRowCount;
  return `
    <article class="model-card-item"><a class="resource-card model-card" href="${modelUrl(model)}" data-model-id="${escapeHtml(model.id)}">
      <span class="resource-thumb resource-thumb-image">
        <img src="${cover}" alt="${title}模型封面" loading="${firstRow ? "eager" : "lazy"}" decoding="async" fetchpriority="${index === 0 ? "high" : "auto"}" />
      </span>
      <span class="resource-card-body">
        <small>${moduleName}</small>
        <strong>${title}</strong>
        <span>${summary}</span>
      </span>
    </a><button class="model-favorite-button" type="button" data-model-favorite="${escapeHtml(model.id)}" data-model-title="${title}" aria-pressed="false" disabled>正在核对…</button></article>`;
}

function plannedCardMarkup(model) {
  return `
    <article class="resource-card model-card is-planned" data-model-id="${escapeHtml(model.id)}">
      <span class="resource-card-body">
        <small>${escapeHtml(model.format)} <em class="planned-badge">${model.status === "second-batch" ? "制作规划" : "后续规划"}</em></small>
        <strong title="${escapeHtml(model.title)}">${escapeHtml(model.title)}</strong>
        <span>尚未开放 · ${escapeHtml(model.moduleTitle)}</span>
      </span>
    </article>`;
}

function modelSectionMarkup({ id, eyebrow, title, count, cards, planned = false }) {
  return `
    <section class="model-library-section${planned ? " is-planned-section" : ""}" aria-labelledby="${id}-title">
      <header class="model-library-section-header">
        <div>
          <span>${escapeHtml(eyebrow)}</span>
          <h2 id="${id}-title">${escapeHtml(title)}</h2>
        </div>
        <strong>${count} 个</strong>
      </header>
      <div class="resource-grid">${cards}</div>
    </section>`;
}

function renderModels() {
  modelFavoriteBindings.forEach(dispose => dispose());
  modelFavoriteBindings = [];
  if (!catalogLoaded) {
    modelList.innerHTML = `<div class="catalog-message" role="status"><h2>${catalogFailed ? "模型目录暂未加载" : "正在读取模型目录…"}</h2><p>${catalogFailed ? "请检查网络后重试；不会把已发布模型误列为未完成。" : "正在核对可访问的正式模型。"}</p>${catalogFailed ? '<button class="studio-button" type="button" data-catalog-retry>重新加载</button>' : ""}</div>`;
    heroModelCount.textContent = "—";
    return;
  }
  const catalog = library.collect(releaseCatalog, roadmapData.models);
  const book = library.books.find(item => item.id === selectedBook);
  const entries = catalog.entries.filter(item => item.book === selectedBook);
  const ready = entries.filter(item => item.state === "ready");
  const planned = entries.filter(item => item.state === "planned");
  const tabs = library.books.map(item => `<button type="button" role="tab" id="book-tab-${item.id}" data-book="${item.id}" aria-controls="book-panel" aria-selected="${selectedBook === item.id}" tabindex="${selectedBook === item.id ? 0 : -1}"><img class="book-tab-icon" src="/assets/textbook-icons/${item.id}.svg" alt="" aria-hidden="true" width="34" height="34"><span class="book-tab-copy"><small>${item.label}</small><strong>${item.title}</strong></span></button>`).join("");
  modelList.innerHTML = `<div class="library-heading"><div><p class="section-kicker">EXPLORE BY TEXTBOOK</p><h2>按教材，开始探索</h2></div><p>已开放模型优先展示 · 公开模型免费浏览</p></div><div class="studio-tabs book-tabs" role="tablist" aria-label="模型教材分类">${tabs}</div><div id="book-panel" class="library-tab-panel" role="tabpanel" aria-labelledby="book-tab-${book.id}">${ready.length ? modelSectionMarkup({ id: "completed-models", eyebrow: "AVAILABLE NOW", title: "已开放模型", count: ready.length, cards: ready.map((item, index) => cardMarkup(item.release, index)).join("") }) : '<div class="book-empty"><span aria-hidden="true">◌</span><div><h3>这一册的模型正在准备</h3><p>先看看下面的规划，或切换其他教材探索已开放模型。</p></div></div>'}${planned.length ? modelSectionMarkup({ id: "planned-models", eyebrow: "ON THE HORIZON", title: "后续模型规划", count: planned.length, cards: planned.map(item => plannedCardMarkup(item.plan)).join(""), planned: true }) : ""}</div>${catalog.unclassified.length ? '<section class="catalog-message"><h2>新内容 · 教材分类待整理</h2><p>以下内容保留入口，教材归属核对后再纳入对应栏目。</p><div class="resource-grid">' + catalog.unclassified.map((item, index) => item.release ? cardMarkup(item.release, ready.length + index) : plannedCardMarkup(item.plan)).join("") + '</div></section>' : ""}`;
  heroModelCount.textContent = String(releaseCatalog.length);
  modelList.querySelectorAll("[data-model-favorite]").forEach(button => {
    if (window.AnderModelFavorites) modelFavoriteBindings.push(window.AnderModelFavorites.bindButton(button,
      {modelId:button.dataset.modelFavorite,title:button.dataset.modelTitle}));
    else button.textContent = "收藏暂不可用";
  });
  if (app.dataset.portalCurrent === "models") resourceCount.textContent = `${releaseCatalog.length} 个已开放模型`;
}

function studioBookMarkup(item, i) {
  const open = expandedStudioBook === i;
  const featured = window.AnderStudioBooks?.cardMarkup(item[0], i, open);
  if (featured) return featured;
  return `<article class="shelf-book${open ? " is-expanded" : ""}"><button type="button" class="book-cover-toggle" data-studio-book="${i}" aria-expanded="${open}" aria-controls="studio-book-detail-${i}" aria-label="${escapeHtml(item[0])}，展开或收起介绍"><span class="book-number">${String(i + 1).padStart(2, "0")} / STUDIO</span><strong class="book-cover-title">${escapeHtml(item[0])}</strong><span class="book-cover-foot">安德生物工作室<br>封面待补充</span><span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span></button><div class="book-detail" id="studio-book-detail-${i}"${open ? "" : " hidden"}><span class="product-type">${escapeHtml(item[1])}</span><h2>${escapeHtml(item[0])}</h2><p>${escapeHtml(item[2])}</p><div class="product-pending">目录、样章及版本资料待补充。<br>当前仅为内容展示，不提供购买。</div></div></article>`;
}

function toggleStudioBook(index) {
  expandedStudioBook = expandedStudioBook === index ? null : index;
  document.querySelectorAll("[data-studio-book]").forEach(button => {
    const open = Number(button.dataset.studioBook) === expandedStudioBook;
    button.setAttribute("aria-expanded", String(open));
    button.closest(".shelf-book").classList.toggle("is-expanded", open);
    button.getAttribute("aria-controls").split(/\s+/).forEach(id => {
      const region = document.getElementById(id);
      if (region) { region.hidden = !open; if (open) window.AnderStudioImages?.activate(region); }
    });
    button.querySelector(".book-cover-cue").textContent = open ? "−" : "+";
  });
}

function renderProducts() {
  productsRendered = true;
  const group = library.products.find(item => item.id === selectedProduct);
  const tabs = library.products.map(item => `<button type="button" role="tab" id="product-tab-${item.id}" data-product="${item.id}" aria-controls="product-panel" aria-selected="${selectedProduct === item.id}" tabindex="${selectedProduct === item.id ? 0 : -1}"><small>${item.english}</small><strong>${item.title}</strong></button>`).join("");
  let content;
  if (group.id === "books") {
    content = `<div class="book-shelf" aria-label="工作室图书书架">${group.items.map(studioBookMarkup).join("")}</div><p class="book-shelf-note">点击封面展开介绍，再次点击收起。支持键盘 Tab、方向键和回车操作。</p>`;
  } else if (group.id === "courses" && window.AnderStudioCourses) {
    content = window.AnderStudioCourses.render(group.items, expandedStudioCourse);
  } else if (group.id === "tools" && window.AnderStudioTools) {
    content = window.AnderStudioTools.render(group.items, expandedStudioTool);
  } else {
    content = `<div class="product-grid">${group.items.map((item, i) => `<article class="product-card"><div class="product-art is-${group.id}" aria-label="${escapeHtml(item[0])}配图占位"><div class="product-art-object"><span>ANDER BIOLOGY</span><strong>${escapeHtml(item[0])}</strong><small>${group.id === "courses" ? "LEARN & CONNECT" : "TOOLS FOR LEARNING"}</small></div><span class="art-index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="art-placeholder">配图待补充</span></div><div class="product-card-copy"><span class="product-type">${escapeHtml(item[1])}</span><h2>${escapeHtml(item[0])}</h2><p>${escapeHtml(item[2])}</p><div class="product-pending">${group.id === "courses" ? "课程介绍与安排待补充" : "功能介绍与使用入口待补充"}</div></div></article>`).join("")}</div>`;
  }
  const status = group.id === "books" ? "6 本图书介绍 · 4 本新书规划" : group.id === "courses" ? "3 个全年课程 · 3 个专题课程" : "砺冰笔记本 · 青鸟学习 · 砺冰工具";
  const productMarkup = `<div class="studio-tabs product-tabs" role="tablist" aria-label="产品类别">${tabs}</div><section id="product-panel" class="library-tab-panel" role="tabpanel" aria-labelledby="product-tab-${group.id}">${content}<div class="product-intro"><p>${group.note}</p><span>${status}</span></div></section>`;
  const productRoot=document.querySelector("[data-studio-products]");
  if(window.AnderSiteNavigation)window.AnderSiteNavigation.setContent(productRoot,productMarkup);else productRoot.innerHTML=productMarkup;
  window.AnderSiteNavigation?.applyStudioStyles(productRoot);
  revealLibraryTab(document.getElementById(`product-tab-${selectedProduct}`));
  window.AnderStudioImages?.activate(document.querySelector("[data-studio-products]"));
}

function toggleStudioCourse(index) {
  const courses = library.products.find(group => group.id === "courses").items;
  if (!Number.isInteger(index) || index < 0 || index >= courses.length) return;
  expandedStudioCourse = expandedStudioCourse === index ? null : index;
  document.querySelectorAll("[data-studio-course]").forEach(button => {
    const open = Number(button.dataset.studioCourse) === expandedStudioCourse;
    button.setAttribute("aria-expanded", String(open));
    button.closest(".shelf-course").classList.toggle("is-expanded", open);
    button.getAttribute("aria-controls").split(/\s+/).forEach(id => {
      const region = document.getElementById(id);
      if (region) { region.hidden = !open; if (open) window.AnderStudioImages?.activate(region); }
    });
    button.querySelector(".book-cover-cue").textContent = open ? "−" : "+";
  });
}

function toggleStudioTool(index) {
  if (index !== 0 && index !== 1) return;
  expandedStudioTool = expandedStudioTool === index ? null : index;
  document.querySelectorAll("[data-studio-tool]").forEach(button => {
    const open = Number(button.dataset.studioTool) === expandedStudioTool;
    button.setAttribute("aria-expanded", String(open));
    button.closest(".shelf-tool").classList.toggle("is-expanded", open);
    button.getAttribute("aria-controls").split(/\s+/).forEach(id => {
      const region = document.getElementById(id);
      if (region) { region.hidden = !open; if (open) window.AnderStudioImages?.activate(region); }
    });
    button.querySelector(".book-cover-cue").textContent = open ? "−" : "+";
  });
}

function rememberTab(key, value) {
  const url = new URL(location.href);
  url.searchParams.set(key, value);
  history.replaceState(history.state, "", url);
}
function focusLibraryTab(id) {
  const tab = document.getElementById(id);
  tab.focus({ preventScroll: true });
  revealLibraryTab(tab);
}
function revealLibraryTab(tab) {
  if (!tab) return;
  const strip = tab.parentElement;
  // Reveal an offscreen mobile tab without moving the whole page vertically.
  const rect = tab.getBoundingClientRect(), parent = strip.getBoundingClientRect();
  if (rect.left < parent.left) strip.scrollLeft -= parent.left - rect.left + 6;
  if (rect.right > parent.right) strip.scrollLeft += rect.right - parent.right + 6;
}
document.addEventListener("click", event => {
  const studioTool = event.target.closest("[data-studio-tool]");
  if (studioTool) toggleStudioTool(Number(studioTool.dataset.studioTool));
  if (event.target.closest("[data-tool-samples]")) {
    const heading = document.getElementById("notebook-samples-title");
    if (heading) {
      heading.focus({ preventScroll: true });
      document.getElementById("notebook-samples").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }
  if (event.target.closest("[data-qingniao-features]")) {
    const heading = document.getElementById("qingniao-features-title");
    if (heading) {
      heading.focus({ preventScroll: true });
      document.getElementById("qingniao-features").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }
  const studioCourse = event.target.closest("[data-studio-course]");
  if (studioCourse) toggleStudioCourse(Number(studioCourse.dataset.studioCourse));
  const courseOutline = event.target.closest("[data-course-outline]");
  if (courseOutline) {
    const outlines = document.getElementById(`studio-course-outlines-${courseOutline.dataset.courseOutline}`);
    if (outlines) {
      outlines.querySelector("details").open = true;
      outlines.querySelector("summary").focus({ preventScroll: true });
      outlines.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }
  const studioBook = event.target.closest("[data-studio-book]");
  if (studioBook) toggleStudioBook(Number(studioBook.dataset.studioBook));
  const book = event.target.closest("[data-book]");
  const product = event.target.closest("[data-product]");
  if (book) { selectedBook = book.dataset.book; rememberTab("book", selectedBook); renderModels(); focusLibraryTab(`book-tab-${selectedBook}`); }
  if (product) { selectedProduct = product.dataset.product; rememberTab("product", selectedProduct); renderProducts(); focusLibraryTab(`product-tab-${selectedProduct}`); }
  if (event.target.closest("[data-catalog-retry]")) { catalogFailed = false; renderModels(); void ensureCatalog(); }
});
document.addEventListener("keydown", event => {
  const toolCover = event.target.closest("[data-studio-tool]");
  if (toolCover && event.key === "Escape" && expandedStudioTool !== null) { event.preventDefault(); toggleStudioTool(expandedStudioTool); return; }
  const courseCover = event.target.closest("[data-studio-course]");
  if (courseCover && event.key === "Escape" && expandedStudioCourse !== null) { event.preventDefault(); toggleStudioCourse(expandedStudioCourse); return; }
  if (courseCover && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    const covers = [...document.querySelectorAll("[data-studio-course]")];
    const next = event.key === "Home" ? 0 : event.key === "End" ? covers.length - 1 : (covers.indexOf(courseCover) + (event.key === "ArrowRight" ? 1 : -1) + covers.length) % covers.length;
    event.preventDefault(); covers[next].focus(); return;
  }
  const cover = event.target.closest("[data-studio-book]");
  if (cover && event.key === "Escape" && expandedStudioBook !== null) { event.preventDefault(); toggleStudioBook(expandedStudioBook); }
  if (cover && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    const covers = [...document.querySelectorAll("[data-studio-book]")];
    const next = event.key === "Home" ? 0 : event.key === "End" ? covers.length - 1 : (covers.indexOf(cover) + (event.key === "ArrowRight" ? 1 : -1) + covers.length) % covers.length;
    event.preventDefault(); covers[next].focus(); return;
  }
  const tab = event.target.closest(".studio-tabs [role=tab]");
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = [...tab.parentElement.querySelectorAll("[role=tab]")];
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault(); tabs[next].click();
});

function setSection(sectionId) {
  if (!Object.hasOwn(PORTAL_SECTIONS, sectionId)) sectionId = "models";
  const section = PORTAL_SECTIONS[sectionId];
  app.dataset.portalCurrent = sectionId;
  document.querySelectorAll("[data-portal-section]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.portalSection === sectionId);
    button.setAttribute("aria-pressed", String(button.dataset.portalSection === sectionId));
  });
  resourceTitle.textContent = section.title;
  document.title = `${section.title} · 安德生物工作室`;
  portalRoot.querySelector(".resource-header").dataset.sectionEyebrow = section.eyebrow;
  resourceSubtitle.textContent = section.subtitle;
  const isModels = sectionId === "models";
  if (!isModels) closeInlineMap();
  modelList.hidden = !isModels;
  if (isModels) { renderModels(); if (!catalogLoaded && !catalogFailed) void ensureCatalog(); }
  document.querySelector("[data-model-intro]").hidden = !isModels;
  document.querySelector("[data-studio-products]").hidden = sectionId !== "products";
  if (sectionId === "products") {
    if (!productsRendered) renderProducts();
    revealLibraryTab(document.getElementById(`product-tab-${selectedProduct}`));
  }
  resourceEmpty.hidden = true;
  document.querySelector("[data-question-setup]").hidden = sectionId !== "exams";
  document.querySelector("[data-ark-portal]").hidden = sectionId !== "ark";
  resourceEmpty.querySelector("[data-game-trial-entry]")?.remove();
  document.querySelector("[data-studio-about]").hidden = sectionId !== "about";
  resourceCount.textContent = "";
  if (!isModels && sectionId !== "about") {
    resourceEmpty.querySelector("[data-resource-empty-title]").textContent = section.emptyTitle;
    resourceEmpty.querySelector("[data-resource-empty-text]").textContent = section.emptyText;
    resourceCount.textContent = "";
  } else if (isModels) {
    resourceCount.textContent = catalogLoaded ? `${releaseCatalog.length} 个已开放模型` : "";
  }
  window.dispatchEvent(new CustomEvent("ander:portal-section", {detail: sectionId}));
}

function mountHeroCarousel() {
  const images = [...document.querySelectorAll(".hero-preview-image")];
  if (images.length < 2) return;
  const loadImage = (image) => {
    if (!image.getAttribute("src") && image.dataset.src) image.src = image.dataset.src;
  };
  const transitions = ["enter-up", "enter-down", "enter-left", "enter-fan"];
  let current = images.findIndex((image) => image.classList.contains("is-active"));
  current = current < 0 ? 0 : current;
  const preloadNext = () => loadImage(images[(current + 1) % images.length]);
  window.setTimeout(preloadNext, 2200);
  window.setInterval(() => {
    if (!portalActive() || document.hidden) return;
    images[current].classList.remove("is-active", ...transitions);
    current = (current + 1) % images.length;
    loadImage(images[current]);
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    images[current].classList.add("is-active", transition);
    window.setTimeout(preloadNext, 2200);
  }, 5000);
}

function mountOrganelleGestures() {
  const items = [...document.querySelectorAll("[data-organelle-bg-item]")];
  if (!items.length) return;

  let activeDrag = null;
  const foregroundControls = "a, button, input, select, textarea, [contenteditable], .resource-card, .studio-sidebar, .site-record-footer";
  const numberFrom = (value) => Number.parseFloat(value || "0") || 0;
  const itemAtPoint = (x, y) => [...items].reverse().find((item) => {
    const rect = item.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  });

  document.addEventListener("pointerdown", (event) => {
    if (!portalActive() || app.dataset.portalCurrent === "ark") return;
    if (event.button !== 0 || event.target.closest(foregroundControls)) return;
    const item = itemAtPoint(event.clientX, event.clientY);
    if (!item) return;

    activeDrag = {
      item,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: numberFrom(item.dataset.dragX),
      originY: numberFrom(item.dataset.dragY),
      originRotation: numberFrom(item.dataset.rotation),
    };
    item.classList.add("is-dragging");
    document.documentElement.classList.add("is-dragging-organelle");
    event.target.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  window.addEventListener("pointermove", (event) => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const deltaX = event.clientX - activeDrag.startX;
    const deltaY = event.clientY - activeDrag.startY;
    activeDrag.item.style.setProperty("--drag-x", `${activeDrag.originX + deltaX}px`);
    activeDrag.item.style.setProperty("--drag-y", `${activeDrag.originY + deltaY}px`);
    activeDrag.item.style.setProperty("--drag-rotate", `${activeDrag.originRotation + deltaX * 0.18}deg`);
    event.preventDefault();
  }, { passive: false });

  const stopDrag = (event) => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const deltaX = event.clientX - activeDrag.startX;
    const deltaY = event.clientY - activeDrag.startY;
    activeDrag.item.dataset.dragX = String(activeDrag.originX + deltaX);
    activeDrag.item.dataset.dragY = String(activeDrag.originY + deltaY);
    activeDrag.item.dataset.rotation = String(activeDrag.originRotation + deltaX * 0.18);
    activeDrag.item.classList.remove("is-dragging");
    document.documentElement.classList.remove("is-dragging-organelle");
    activeDrag = null;
  };

  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);
}

async function loadCatalog() {
  const response = await fetch("/model-releases/catalog.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`模型清单加载失败：${response.status}`);
  const catalog = await response.json();
  if (!Array.isArray(catalog.models)) throw new Error("模型清单格式暂不可用");
  releaseCatalog = catalog.models.filter((model) => model.publish !== false);
  catalogLoaded = true;
  catalogFailed = false;
  // A late response may arrive after switching away. Do not create hidden images.
  if (app.dataset.portalCurrent === "models") renderModels();

  const requestedModel = new URLSearchParams(window.location.search).get("model");
  if (requestedModel) {
    const mappedModel = roadmapData.models.find((item) => item.id === requestedModel)?.publishedModelId || requestedModel;
    const model = releaseCatalog.find((item) => item.id === mappedModel);
    if (model) window.location.replace(modelUrl(model));
  }
}

function ensureCatalog() {
  if (catalogLoaded) { renderModels(); return Promise.resolve(); }
  if (!catalogTask) catalogTask = loadCatalog().catch(catalogError).finally(() => { catalogTask = null; });
  return catalogTask;
}

document.querySelectorAll("[data-portal-section]").forEach((button) => {
  button.addEventListener("click", () => {
    if (window.AnderSiteNavigation) return;
    setSection(button.dataset.portalSection);
    history.replaceState(null, "", `${location.pathname}${location.search}#${button.dataset.portalSection}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  });
});

window.addEventListener("hashchange", () => {if (portalActive()) setSection(location.hash.slice(1));});
if (window.AnderSiteNavigation) window.AnderSiteNavigation.portal(setSection, closeInlineMap);
else setSection(location.hash.slice(1) || "models");
if (query.get("model")) void ensureCatalog();
mountHeroCarousel();
mountOrganelleGestures();

function catalogError(error) {
  console.error(error);
  catalogFailed = true;
  catalogLoaded = false;
  if (app.dataset.portalCurrent === "models") {
    renderModels();
    resourceCount.textContent = "模型清单暂不可用";
  }
}
