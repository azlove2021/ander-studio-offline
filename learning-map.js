(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const embedded = new URLSearchParams(location.search).get("embedded") === "1";
  if (embedded) document.body.classList.add("is-embedded");
  function reportHeight() {
    if (embedded && parent !== window) {
      const shell = $(".learning-map-shell");
      parent.postMessage({ type: "ander:knowledge-map-height", height: Math.ceil(shell.getBoundingClientRect().height + 2) }, location.origin);
    }
  }
  const board = $("[data-map-board]");
  const canvas = $("[data-map-canvas]");
  const layer = $("[data-map-nodes]");
  const edges = $("[data-map-edges]");
  const svg = $("[data-map-lines]");
  const search = $("[data-map-search]");
  const moduleLocator = $("[data-map-module-filter]");
  const status = $("[data-map-status]");
  const data = window.ANDER_KNOWLEDGE_MAP_DATA;
  if (!board) return;
  if (embedded) new ResizeObserver(reportHeight).observe($(".learning-map-shell"));
  if (!data?.modules?.length) {
    $("[data-map-error]").hidden = false;
    status.textContent = "地图未能载入。请检查网络后刷新页面。";
    document.querySelectorAll(".learning-map-controls input, .learning-map-controls select, .learning-map-controls button, .knowledge-toolbar button").forEach((el) => { el.disabled = true; });
    reportHeight();
    return;
  }

  const nodes = new Map();
  const root = { id: "all", title: "生物学知识地图", level: 0, children: [] };
  nodes.set(root.id, root);
  function index(items, parent, level) {
    return items.map((item) => {
      const node = { id: item.id, title: item.title, level, parent, children: [] };
      nodes.set(node.id, node);
      node.children = index(item.children || [], node, level + 1);
      return node;
    });
  }
  root.children = index(data.modules, root, 1);
  root.children.forEach((module) => {
    const option = document.createElement("option");
    option.value = module.id;
    option.textContent = module.title;
    moduleLocator.append(option);
  });
  Object.entries(data.counts).forEach(([key, count]) => {
    const el = document.querySelector('[data-count="' + key + '"]');
    if (el) el.textContent = count;
  });

  // Every branch starts open; module choice is a camera locator, never a filter.
  const expanded = new Set([...nodes.values()].filter((node) => node.children.length).map((node) => node.id));
  const positions = new Map();
  const WIDTH = 248;
  const ROW_GAP = 14;
  const COLUMN_WIDTH = 328;
  const labels = ["知识总览", "模块", "二级分类", "三级知识点"];
  let selected = "all";
  let query = "";
  let width = 960;
  let height = 560;
  let view = { x: 16, y: 16, scale: 1 };
  let visibleNodes = [];
  let searchMatches = [];
  let searchCursor = -1;
  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");
  const matches = (node) => Boolean(query) && node.level > 0 && normalize(node.title).includes(query);
  const heightOf = (node) => node.level === 3
    ? Math.max(54, 26 + Math.ceil(node.title.length / 12) * 20)
    : Math.max(78, 42 + Math.ceil(node.title.length / 12) * 20);
  const topicCount = (node) => node.level === 3 ? 1 : node.children.reduce((sum, child) => sum + topicCount(child), 0);

  function updateView() {
    canvas.style.transform = "translate(" + view.x + "px," + view.y + "px) scale(" + view.scale + ")";
    $("[data-map-scale]").textContent = Math.round(view.scale * 100) + "%";
  }
  function readableScale() {
    return Math.min(1, Math.max(0.85, (board.clientWidth - 24) / (board.clientWidth < 600 ? width : 346)));
  }
  function readableView(id = "all") {
    view.scale = readableScale();
    const pos = positions.get(id) || positions.get("all");
    const pad = board.clientWidth < 600 ? 12 : 26;
    view.x = pad - Math.max(0, pos.x - 12) * view.scale;
    view.y = pad - Math.max(0, pos.y - 12) * view.scale;
    updateView();
  }
  function fit() {
    const padding = board.clientWidth < 600 ? 18 : 32;
    view.scale = Math.min(1, (board.clientWidth - padding * 2) / width, (board.clientHeight - padding * 2 - 34) / height);
    view.x = (board.clientWidth - width * view.scale) / 2;
    view.y = (board.clientHeight - 30 - height * view.scale) / 2;
    updateView();
  }
  function zoom(factor, point = { x: board.clientWidth / 2, y: board.clientHeight / 2 }) {
    const next = Math.max(0.015, Math.min(2, view.scale * factor));
    view.x = point.x - (point.x - view.x) * next / view.scale;
    view.y = point.y - (point.y - view.y) * next / view.scale;
    view.scale = next;
    updateView();
  }
  function resetDetail() {
    $("[data-map-detail-status]").textContent = labels[0];
    $("[data-map-detail-title]").textContent = "一张地图，串起生物学";
    $("[data-map-detail-summary]").textContent = "所有模块都在当前地图中。点击节点查看路径，搜索或选择模块只定位，不会切换页面或隐藏其他模块。";
    $("[data-map-breadcrumb]").textContent = "模块 → 一、 → 1.";
  }
  function showDetail(node) {
    selected = node.id;
    layer.querySelectorAll(".knowledge-node").forEach((el) => el.classList.toggle("is-current", el.dataset.nodeId === node.id));
    $("[data-map-detail-status]").textContent = labels[node.level];
    $("[data-map-detail-title]").textContent = node.title;
    $("[data-map-detail-summary]").textContent = node.level === 3
      ? "这是目录中的三级知识点，当前仅供浏览，尚未连接学习内容。"
      : "包含 " + node.children.length + " 个下级分类、" + topicCount(node) + " 个三级知识点。右侧加减按钮可在原图中收起或展开分支。";
    const trail = [];
    for (let current = node; current && current.level; current = current.parent) trail.unshift(current.title);
    $("[data-map-breadcrumb]").textContent = trail.join(" → ") || "模块 → 一、 → 1.";
    reportHeight();
  }
  function expandAll() {
    nodes.forEach((node) => { if (node.children.length) expanded.add(node.id); });
  }
  function reset() {
    query = "";
    search.value = "";
    moduleLocator.value = "all";
    searchMatches = [];
    searchCursor = -1;
    expandAll();
    selected = "all";
    resetDetail();
    render();
    readableView();
  }
  function buildTree(node) {
    return { node, matched: matches(node), children: expanded.has(node.id) ? node.children.map(buildTree) : [] };
  }
  function render() {
    const focusedId = layer.contains(document.activeElement) ? document.activeElement.dataset.nodeId : null;
    const anchor = positions.get(selected);
    const screenAnchor = anchor ? { x: view.x + anchor.x * view.scale, y: view.y + anchor.y * view.scale } : null;
    const tree = buildTree(root);
    layer.replaceChildren();
    edges.replaceChildren();
    positions.clear();
    visibleNodes = [];
    const compact = board.clientWidth < 600;
    if (compact) {
      let cursor = 16;
      const indent = board.clientWidth < 320 ? 8 : 22;
      function stack(branch, depth) {
        const h = heightOf(branch.node);
        positions.set(branch.node.id, { x: 16 + depth * indent, y: cursor, h });
        cursor += h + ROW_GAP;
        visibleNodes.push(branch);
        branch.children.forEach((child) => stack(child, depth + 1));
      }
      stack(tree, 0);
      width = WIDTH + 32 + 3 * indent;
      height = cursor + 16;
    } else {
      positions.set("all", { x: 16, y: 16, h: 92 });
      visibleNodes.push(tree);
      let maxBottom = 156;
      tree.children.forEach((module, column) => {
        let cursor = 156;
        function stack(branch, depth) {
          const h = heightOf(branch.node);
          positions.set(branch.node.id, { x: 16 + column * COLUMN_WIDTH + depth * 22, y: cursor, h });
          cursor += h + ROW_GAP;
          visibleNodes.push(branch);
          branch.children.forEach((child) => stack(child, depth + 1));
        }
        stack(module, 0);
        maxBottom = Math.max(maxBottom, cursor);
      });
      width = 32 + Math.max(1, tree.children.length) * COLUMN_WIDTH;
      height = maxBottom + 16;
    }
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    const fragment = document.createDocumentFragment();
    visibleNodes.forEach((branch) => {
      const node = branch.node, pos = positions.get(node.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "knowledge-node level-" + node.level + (branch.matched ? " is-match" : "") + (node.id === selected ? " is-current" : "");
      button.dataset.nodeId = node.id;
      button.dataset.level = node.level;
      Object.assign(button.style, { left: pos.x + "px", top: pos.y + "px", height: pos.h + "px" });
      button.title = node.title;
      const small = document.createElement("small");
      small.textContent = node.level === 0 ? "BIOLOGY KNOWLEDGE" : labels[node.level];
      const title = document.createElement("strong");
      title.textContent = node.title;
      button.append(small, title);
      // Clicking a title only selects it; collapse has its own explicit control.
      button.addEventListener("click", () => showDetail(node));
      button.addEventListener("focus", () => {
        const rect = button.getBoundingClientRect(), bounds = board.getBoundingClientRect();
        if (rect.right < bounds.left || rect.left > bounds.right || rect.bottom < bounds.top || rect.top > bounds.bottom) readableView(node.id);
      });
      fragment.append(button);
      if (node.children.length && node.level > 0) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "knowledge-branch-toggle";
        toggle.dataset.branchId = node.id;
        toggle.textContent = expanded.has(node.id) ? "−" : "+";
        toggle.setAttribute("aria-expanded", String(expanded.has(node.id)));
        toggle.setAttribute("aria-label", (expanded.has(node.id) ? "收起" : "展开") + node.title);
        Object.assign(toggle.style, { left: pos.x + WIDTH - 39 + "px", top: pos.y + pos.h / 2 - 22 + "px" });
        toggle.addEventListener("click", () => {
          showDetail(node);
          if (expanded.has(node.id)) expanded.delete(node.id); else expanded.add(node.id);
          render();
          layer.querySelector('[data-branch-id="' + node.id + '"]')?.focus({ preventScroll: true });
        });
        fragment.append(toggle);
      }
      branch.children.forEach((child) => {
        const to = positions.get(child.node.id);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", !compact && node.level === 0
          ? "M" + (pos.x + WIDTH / 2) + "," + (pos.y + pos.h) + " V130 H" + (to.x + WIDTH / 2) + " V" + to.y
          : "M" + (pos.x + 10) + "," + (pos.y + pos.h) + " V" + (to.y + to.h / 2) + " H" + to.x);
        edges.append(path);
      });
    });
    layer.append(fragment);
    const count = visibleNodes.length - 1;
    const found = visibleNodes.filter((branch) => branch.matched).length;
    status.textContent = query
      ? (found ? "找到 " + found + " 个匹配项 · 按 Enter 定位下一项 · 其他知识仍保留" : "没有匹配项，请更换关键词；完整地图仍保留")
      : "当前显示 " + count + " / 254 个目录标题 · 同一画布浏览全部模块";
    const nextAnchor = positions.get(selected);
    if (screenAnchor && nextAnchor) {
      view.x = screenAnchor.x - nextAnchor.x * view.scale;
      view.y = screenAnchor.y - nextAnchor.y * view.scale;
    }
    updateView();
    if (focusedId) layer.querySelector('[data-node-id="' + focusedId + '"]')?.focus({ preventScroll: true });
    reportHeight();
  }

  moduleLocator.addEventListener("change", () => {
    const node = nodes.get(moduleLocator.value) || root;
    for (let current = node; current; current = current.parent) expanded.add(current.id);
    showDetail(node);
    render();
    readableView(node.id);
  });
  function locateSearchResult() {
    if (!searchMatches.length) return;
    searchCursor = (searchCursor + 1) % searchMatches.length;
    const node = searchMatches[searchCursor];
    showDetail(node);
    readableView(node.id);
  }
  search.addEventListener("input", () => {
    query = normalize(search.value.trim());
    searchMatches = query ? [...nodes.values()].filter(matches) : [];
    searchCursor = -1;
    searchMatches.forEach((node) => {
      for (let current = node.parent; current; current = current.parent) expanded.add(current.id);
    });
    selected = "all";
    resetDetail();
    render();
    if (searchMatches.length) locateSearchResult();
  });
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); locateSearchResult(); }
  });
  $("[data-map-expand]").addEventListener("click", () => { expandAll(); render(); });
  $("[data-map-reset]").addEventListener("click", reset);
  $("[data-map-readable]").addEventListener("click", () => readableView(selected));
  $("[data-map-fit]").addEventListener("click", fit);
  $("[data-map-zoom-in]").addEventListener("click", () => zoom(1.25));
  $("[data-map-zoom-out]").addEventListener("click", () => zoom(0.8));
  board.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = board.getBoundingClientRect();
    zoom(Math.exp(-event.deltaY * 0.0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }, { passive: false });
  board.addEventListener("keydown", (event) => {
    if (event.target !== board) return;
    const shifts = { ArrowLeft: [50, 0], ArrowRight: [-50, 0], ArrowUp: [0, 50], ArrowDown: [0, -50] };
    if (shifts[event.key]) {
      event.preventDefault(); view.x += shifts[event.key][0]; view.y += shifts[event.key][1]; updateView();
    } else if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1.25); }
    else if (event.key === "-") { event.preventDefault(); zoom(0.8); }
    else if (event.key === "Home") { event.preventDefault(); readableView(); }
  });

  // A tap remains a native button click; pointer capture starts only after dragging.
  const pointers = new Map();
  let gestureMoved = false;
  let suppressUntil = 0;
  function point(event) {
    const rect = board.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  board.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (!pointers.size) gestureMoved = false;
    const p = point(event);
    pointers.set(event.pointerId, { ...p, startX: p.x, startY: p.y });
  });
  board.addEventListener("pointermove", (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    const next = point(event);
    const oldPoints = [...pointers.values()];
    if (!gestureMoved && Math.hypot(next.x - previous.startX, next.y - previous.startY) < 5 && pointers.size < 2) return;
    gestureMoved = true;
    board.classList.add("is-dragging");
    board.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { ...previous, ...next });
    if (pointers.size === 2) {
      const newPoints = [...pointers.values()];
      const center = (p) => ({ x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 });
      const distance = (p) => Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const from = center(oldPoints), to = center(newPoints);
      const scale = Math.max(0.02, Math.min(2, view.scale * distance(newPoints) / Math.max(1, distance(oldPoints))));
      view.x = to.x - (from.x - view.x) * scale / view.scale;
      view.y = to.y - (from.y - view.y) * scale / view.scale;
      view.scale = scale;
    } else {
      view.x += next.x - previous.x;
      view.y += next.y - previous.y;
    }
    updateView();
  });
  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (gestureMoved) suppressUntil = performance.now() + 350;
    if (board.hasPointerCapture(event.pointerId)) board.releasePointerCapture(event.pointerId);
    if (!pointers.size) board.classList.remove("is-dragging");
  }
  board.addEventListener("pointerup", endPointer);
  board.addEventListener("pointercancel", endPointer);
  board.addEventListener("lostpointercapture", (event) => pointers.delete(event.pointerId));
  board.addEventListener("pointerleave", (event) => {
    if (!board.hasPointerCapture(event.pointerId)) pointers.delete(event.pointerId);
  });
  board.addEventListener("click", (event) => {
    if (performance.now() < suppressUntil) { event.preventDefault(); event.stopPropagation(); }
  }, true);

  let lastSize = "";
  let lastCompact = board.clientWidth < 600;
  new ResizeObserver(() => {
    const size = board.clientWidth + "x" + board.clientHeight;
    const compact = board.clientWidth < 600;
    if (size !== lastSize) {
      lastSize = size;
      if (compact !== lastCompact) { lastCompact = compact; render(); }
      readableView(selected);
    }
  }).observe(board);
  render();
  readableView();
  reportHeight();
})();
