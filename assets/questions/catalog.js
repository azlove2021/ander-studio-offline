/* Public directory navigation; no question content and no database connection. */
(function (root) {
  "use strict";
  const data = typeof module === "object" && module.exports ? require("./catalog-data.js") : root.AnderQuestionCatalogData;
  const index = new Map(data.nodes.map(node => [node.id, node]));
  const children = new Map();
  data.nodes.forEach(node => {
    const key = node.parentId || node.taxonomy;
    if (!children.has(key)) children.set(key, []);
    children.get(key).push(node);
  });
  children.forEach(list => list.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)));
  const taxonomy = scope => scope === "chapter" ? "chapter" : "notes";
  const nodesFor = scope => data.nodes.filter(node => node.taxonomy === taxonomy(scope));
  const childrenOf = id => children.get(id) || [];
  const roots = scope => childrenOf(taxonomy(scope));
  const leafCache = new Map();
  function leafIds(id) {
    if (!index.has(id)) return [];
    if (!leafCache.has(id)) {
      const list = childrenOf(id);
      leafCache.set(id, list.length ? list.flatMap(node => leafIds(node.id)) : [id]);
    }
    return leafCache.get(id);
  }
  function normalize(scope, ids) {
    const valid = (ids || []).filter(id => index.get(id)?.taxonomy === taxonomy(scope));
    return [...new Set(valid.flatMap(leafIds))];
  }
  function search(scope, query = "") {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return nodesFor(scope).filter(node => !childrenOf(node.id).length &&
      words.every(word => node.path.join(" ").toLocaleLowerCase().includes(word)));
  }
  function state(id, selected, visibleIds) {
    const leaves = leafIds(id).filter(leaf => !visibleIds || visibleIds.has(leaf));
    const size = leaves.filter(leaf => selected.has(leaf)).length;
    return {checked: leaves.length > 0 && size === leaves.length,
      partial: size > 0 && size < leaves.length, total: leaves.length, selected: size};
  }
  function toggle(scope, selected, id, checked, visibleIds) {
    const next = new Set(normalize(scope, selected));
    leafIds(id).filter(leaf => !visibleIds || visibleIds.has(leaf)).forEach(leaf => checked ? next.add(leaf) : next.delete(leaf));
    return [...next];
  }
  const api = {data, index, nodesFor, childrenOf, roots, leafIds, normalize, search, state, toggle};
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AnderQuestionCatalog = api;
})(typeof window === "object" ? window : globalThis);
