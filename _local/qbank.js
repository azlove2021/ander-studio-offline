/* 离线题库页驱动。
   目录与题目全部来自本地 /api/questions/*，卡片渲染复用线上的
   AnderLibraryView（card / paintAnswer），保证视觉与线上一致。
   离线版只保留：浏览、筛选、搜索、分页、显示答案。 */
(() => {
  'use strict';
  const V = window.AnderLibraryView;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = {
    scope: 'notes',
    selected: new Set(),
    kinds: [],
    bands: [],
    sources: [],
    years: [],
    keyword: '',
    page: 1,
    pageSize: 20,
    total: 0,
    items: [],
    boot: null,
    treeKeyword: '',
    answers: new Map(),
    loading: false,
  };

  async function api(path, body) {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'content-type': 'application/json' } : { accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || ('请求失败 ' + res.status));
    }
    return res.json();
  }

  /* ---------- 目录树 ---------- */
  function renderTree() {
    const box = $('[data-setup-tree]');
    if (!box) return;
    const nodes = (state.boot?.catalog?.nodes) || [];
    const scopeNodes = nodes.filter(n => n.taxonomy === state.scope);
    const kids = id => scopeNodes.filter(n => (n.parentId || null) === (id || null))
      .sort((a, b) => (a.order || 0) - (b.order || 0) || a.id.localeCompare(b.id));
    const q = state.treeKeyword.trim().toLowerCase();
    const hit = n => !q || (n.title || '').toLowerCase().includes(q);
    const subHas = (id, d = 0) => d > 8 ? false : kids(id).some(n => hit(n) || subHas(n.id, d + 1));

    const counts = state.boot?.nodeCounts || {};
    const walk = (id, depth) => {
      const list = kids(id).filter(n => !q || hit(n) || subHas(n.id));
      if (!list.length) return '';
      return '<ul>' + list.map(n => {
        const sub = kids(n.id);
        const open = Boolean(q) || depth < 2;
        const cnt = counts[n.id];
        const label = '<label class="ql-tree-row">' +
          '<span class="ql-tree-leaf-mark"></span>' +
          '<input type="checkbox" data-node-select="' + V.esc(n.id) + '"' +
          (state.selected.has(n.id) ? ' checked' : '') + '>' +
          '<span>' + (sub.length ? '选择此范围' : V.esc(n.title)) + '</span>' +
          '<small>' + (cnt ? cnt : '') + '</small></label>';
        return sub.length
          ? '<li><details data-node="' + V.esc(n.id) + '"' + (open ? ' open' : '') + '><summary>' +
            V.esc(n.title) + (cnt ? ' <em style="font-style:normal;font-size:10px;color:var(--ql-muted)">' + cnt + '</em>' : '') +
            '</summary>' + label + walk(n.id, depth + 1) + '</details></li>'
          : '<li>' + label + '</li>';
      }).join('') + '</ul>';
    };

    const rootCount = scopeNodes.length;
    const hint = '<div class="ql-counts" style="margin-bottom:8px;font-size:11px;color:var(--ql-muted)">' +
      (rootCount ? '共 ' + rootCount + ' 个目录节点' : '暂无目录') + '</div>';
    box.innerHTML = hint + (walk(null, 0) || '<p class="ql-status">没有匹配的目录。</p>');
  }

  /* ---------- 列表 ---------- */
  function renderList() {
    const box = $('[data-question-list]');
    const pages = Math.max(1, Math.ceil(state.total / state.pageSize));
    if (state.page > pages) state.page = pages;

    if (!state.items.length) {
      box.innerHTML = V.empty('没有匹配的题目', '试试放宽题型、来源或年份条件，或清空搜索关键词。');
    } else {
      const start = (state.page - 1) * state.pageSize;
      box.innerHTML = state.items.map((q, i) =>
        V.card(q, { displayNumber: start + i + 1 })).join('');
      // 离线版：把「查看详情」换成「显示答案」，移除收藏与试题篮按钮
      $$('[data-question-list] .ql-actions').forEach(foot => {
        foot.querySelectorAll('[data-favorite],[data-add],[data-move],[data-remove]').forEach(el => el.remove());
        const link = foot.querySelector('[data-detail-link]');
        const article = foot.closest('.ql-card');
        if (link && article) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.dataset.reveal = article.dataset.q;
          btn.textContent = '显示答案';
          link.replaceWith(btn);
        }
      });
    }

    $('[data-total]').textContent = '共 ' + state.total + ' 题';
    $('[data-page-info]').textContent = '第 ' + state.page + ' / ' + pages + ' 页';
    $('[data-page-prev]').disabled = state.page <= 1;
    $('[data-page-next]').disabled = state.page >= pages;
  }

  async function load() {
    if (state.loading) return;
    state.loading = true;
    const box = $('[data-question-list]');
    box.innerHTML = '<div class="ql-panel ql-empty"><p class="ql-kicker">LOADING</p><h2>正在读取本地题库…</h2></div>';
    try {
      const res = await api('/api/questions/browse', {
        releaseId: state.boot?.releaseId,
        catalogVersion: state.boot?.catalogVersion,
        mode: state.scope,
        selected: [...state.selected],
        kinds: state.kinds,
        bands: state.bands,
        sources: state.sources,
        years: state.years,
        keyword: state.keyword,
        page: state.page,
        pageSize: state.pageSize,
        contextRevision: state.boot?.contextRevision,
      });
      state.items = res.items || [];
      state.total = res.total || 0;
      renderList();
    } catch (e) {
      box.innerHTML = V.empty('读取失败', e.message);
    } finally {
      state.loading = false;
    }
  }

  /* ---------- 答案 ---------- */
  async function reveal(id, btn) {
    const article = document.querySelector('.ql-card[data-q="' + CSS.escape(id) + '"]');
    if (!article) return;
    const q = state.items.find(x => String(x.questionId) === String(id));
    if (!q) return;
    let a = state.answers.get(String(id));
    if (!a) {
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = '读取中…';
      try {
        const res = await api('/api/questions/answers', {
          releaseId: q.releaseId,
          items: [{ questionId: q.questionId, version: q.version }],
          contextRevision: state.boot?.contextRevision,
        });
        a = (res.items || [])[0];
        if (a) state.answers.set(String(id), a);
      } catch (e) {
        btn.disabled = false;
        btn.textContent = original;
        btn.title = e.message;
        return;
      }
      btn.disabled = false;
    }
    if (!a) {
      btn.textContent = '暂无答案';
      btn.disabled = true;
      return;
    }
    try {
      V.paintAnswer(article, q, a);
    } catch (e) {
      btn.textContent = '答案渲染失败';
      return;
    }
    btn.textContent = '隐藏答案';
    btn.dataset.on = '1';
  }

  function conceal(id, btn) {
    const article = document.querySelector('.ql-card[data-q="' + CSS.escape(id) + '"]');
    const q = state.items.find(x => String(x.questionId) === String(id));
    if (article) {
      article.querySelectorAll('.ql-option.correct').forEach(o => {
        o.classList.remove('correct');
        o.querySelectorAll('.ql-answer-correct-mark').forEach(m => m.remove());
      });
      const area = article.querySelector('[data-mapped-answers]');
      if (area) area.replaceChildren();
      const prompt = article.querySelector('.ql-prompt');
      if (prompt && q) prompt.innerHTML = V.rich(q.promptHtml);
    }
    btn.textContent = '显示答案';
    delete btn.dataset.on;
  }

  /* ---------- 事件 ---------- */
  function bind() {
    document.addEventListener('click', e => {
      const rev = e.target.closest('[data-reveal]');
      if (rev) {
        rev.dataset.on ? conceal(rev.dataset.reveal, rev) : reveal(rev.dataset.reveal, rev);
        return;
      }
      if (e.target.closest('[data-filter-reset]')) {
        state.kinds = []; state.bands = []; state.sources = []; state.years = [];
        state.keyword = ''; state.page = 1; state.selected.clear();
        $$('[name=kind],[name=difficulty],[name=source],[name=year]').forEach(i => i.checked = true);
        $('[data-search-input]').value = '';
        renderTree(); load(); return;
      }
      if (e.target.closest('[data-tree-all]')) {
        (state.boot?.catalog?.nodes || [])
          .filter(n => n.taxonomy === state.scope && n.depth >= 2)
          .forEach(n => state.selected.add(n.id));
        renderTree(); state.page = 1; load(); return;
      }
      if (e.target.closest('[data-tree-clear]')) {
        state.selected.clear(); renderTree(); state.page = 1; load(); return;
      }
      if (e.target.closest('[data-toggle-tree]')) {
        const p = $('[data-tree-panel]');
        p.dataset.open = p.dataset.open === 'true' ? 'false' : 'true';
        return;
      }
      if (e.target.closest('[data-page-prev]')) { state.page = Math.max(1, state.page - 1); load(); return; }
      if (e.target.closest('[data-page-next]')) { state.page += 1; load(); return; }
      const themeBtn = e.target.closest('[data-theme-choice]');
      if (themeBtn) {
        document.documentElement.dataset.siteTheme = themeBtn.dataset.themeChoice;
        try { localStorage.setItem('ander-site-theme', themeBtn.dataset.themeChoice); } catch (_) {}
        $$('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', String(b === themeBtn)));
      }
    });

    document.addEventListener('change', e => {
      const node = e.target.closest('[data-node-select]');
      if (node) {
        node.checked ? state.selected.add(node.dataset.nodeSelect) : state.selected.delete(node.dataset.nodeSelect);
        state.page = 1;
        load();
        return;
      }
      if (e.target.name === 'kind') {
        state.kinds = $$('[name=kind]:checked').map(i => i.value);
        state.page = 1; load(); return;
      }
      if (e.target.name === 'difficulty') {
        state.bands = $$('[name=difficulty]:checked').map(i => Number(i.value));
        state.page = 1; load(); return;
      }
      if (e.target.name === 'source') {
        state.sources = $$('[name=source]:checked').map(i => i.value).filter(Boolean);
        state.page = 1; load(); return;
      }
      if (e.target.name === 'year') {
        state.years = $$('[name=year]:checked').map(i => Number(i.value));
        state.page = 1; load(); return;
      }
      if (e.target.matches('[data-scope-choice]')) {
        state.scope = e.target.value; state.selected.clear(); renderTree(); return;
      }
    });

    $('[data-search-form]').addEventListener('submit', e => {
      e.preventDefault();
      state.keyword = $('[data-search-input]').value.trim();
      state.page = 1; load();
    });

    let tid;
    $('[data-tree-search]').addEventListener('input', e => {
      clearTimeout(tid);
      const v = e.target.value;
      tid = setTimeout(() => { state.treeKeyword = v; renderTree(); }, 160);
    });
  }

  async function init() {
    if (!V) { console.error('AnderLibraryView 未加载'); return; }
    try {
      const saved = localStorage.getItem('ander-site-theme');
      if (saved) document.documentElement.dataset.siteTheme = saved;
    } catch (_) {}
    try {
      state.boot = await api('/api/questions/library/bootstrap');
    } catch (e) {
      $('[data-question-list]').innerHTML = V.empty('无法读取本地题库', e.message);
      return;
    }
    renderTree();
    bind();
    await load();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
