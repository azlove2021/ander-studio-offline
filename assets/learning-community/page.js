"use strict";
(() => {
  const U = window.AnderCommunityUI, main = document.querySelector("#community-main"), {el, link} = U;
  const visible = () => (/^\/community(?:\/|$)/.test(location.pathname) || location.pathname === "/manage/community") && (!window.AnderSiteNavigation || window.AnderSiteNavigation.active("community"));
  let generation = 0, authenticated = false, ownProfileId = null, controller = null, sessionToken = "", lastResume = 0;
  function clear() {
    generation++; controller?.abort();
    window.AnderCommunityWorkflow?.reset(); document.documentElement.classList.remove("lc-private-paused");
    main.style.minHeight = Math.max(main.getBoundingClientRect().height, 260) + "px";
    main.setAttribute("aria-busy", "true"); main.replaceChildren(el("p", "正在核对访问状态…", "lc-empty"));
  }
  function columns(content, aside) {const grid = el("div", null, "lc-columns"); grid.append(content, aside); return grid;}
  function backLink(destination, href, compact = false) {
    if (compact) {
      const anchor=link(null,href,"lc-detail-back");anchor.setAttribute("aria-label","返回"+destination);anchor.title="返回"+destination;
      anchor.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m14 5-7 7 7 7"/></svg>';return anchor;
    }
    const anchor=link(null,href,"studio-back"),icon=el("span",null,"studio-back-icon"),label=el("span",null,"studio-back-label");
    anchor.setAttribute("aria-label","返回"+destination);icon.setAttribute("aria-hidden","true");
    icon.innerHTML='<svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg>';
    label.append(el("span","返回"),el("span",destination));anchor.append(icon,label);return anchor;
  }
  function announcement(data) {
    const card = el("section", null, "lc-notice"), top = el("div", null, "lc-notice-top");
    const icon = el("span", null, "lc-notice-mark"); icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = '<svg viewBox="0 0 32 32" focusable="false"><path d="M6 13h5l14-6v18l-14-6H6zM10 19l2 7h5l-3-6M25 13l3-1m-3 8 3 1"/></svg>';
    top.append(icon, el("h2", "公告栏"), el("span", data.label, "lc-notice-label"));
    card.append(top, el("p", "COMMUNITY NOTICE", "lc-notice-kicker"), el("h3", data.title, "lc-notice-title"), el("p", data.summary, "lc-notice-copy"));
    const bottom = el("div", null, "lc-notice-meta"), time = el("time", data.date.replaceAll("-", ".")); time.dateTime = data.date;
    bottom.append(el("span", "安德生物工作室"), time); card.append(bottom);
    const details = el("details", null, "lc-notice-details"), summary = el("summary", "查看试用说明"); details.append(summary);
    for (const paragraph of data.paragraphs) details.append(el("p", paragraph)); card.append(details); return card;
  }
  function recommendations(title, items, caption) {
    const card = el("section", null, "lc-card lc-editorial-card"), top = el("div", null, "lc-rail-heading"); top.append(el("h2", title), el("span", caption)); card.append(top);
    for (const [index, item] of items.entries()) {
      const row = el("article", null, "lc-recommendation"); row.dataset.recommendationId = item.id;
      const copy = el("div"), number = el("span", String(index + 1).padStart(2, "0"), "lc-recommendation-number"); number.setAttribute("aria-hidden", "true");
      copy.append(link(item.title, U.href(item), "lc-title-link"), el("p", item.recommendationReason || item.excerpt, "lc-recommendation-reason"), el("small", item.subject + " · " + item.author.displayName, "lc-muted")); row.append(number, copy); card.append(row);
    }
    return card;
  }
  function guide(kind, editorial, {exclude = [], detail = false} = {}) {
    const aside = el("aside", null, "lc-guide lc-editorial"); aside.setAttribute("aria-label", detail ? "相关内容" : "社区公告与编辑推荐");
    const resources = editorial.resources.filter(item => !exclude.includes(item.id)), discussions = editorial.discussions.filter(item => !exclude.includes(item.id));
    if (!detail && editorial.announcement) aside.append(announcement(editorial.announcement));
    if (kind === "resources" && resources.length) aside.append(recommendations(detail ? "延伸阅读" : "本期精选", resources, "编辑荐读"));
    if (discussions.length) aside.append(recommendations(detail ? "继续讨论" : kind === "discussions" ? "本期话题" : "值得参与的讨论", discussions, "交流思路"));
    if (detail && kind === "discussions" && resources.length) aside.append(recommendations("延伸阅读", resources, "相关方法"));
    return aside;
  }
  async function listing(kind, request) {
    const isResource = kind === "resources", search = new URLSearchParams(location.search), params = new URLSearchParams();
    for (const key of ["q", "subject", "offset", "sort", "category"]) if (search.has(key)) params.set(key, search.get(key));
    const [data, editorial] = await Promise.all([request("/api/community/" + kind + "?" + params), request("/api/community/editorial")]);
    const unfiltered = !params.get("q") && !params.get("subject") && !params.get("sort") && !params.get("category") && !Number(params.get("offset"));
    const curatedIds = new Set(editorial[kind].map(item => item.id));
    const primaryItems = unfiltered ? data.items.filter(item => item.pinned||!curatedIds.has(item.id)) : data.items;
    const exclude = primaryItems.map(item => item.id);
    const block = el("div"), content = el("section"); content.setAttribute("aria-label", isResource ? "学习资料" : "社区讨论");
    const heading=U.heading(isResource ? "把好资料，分享给需要的人" : "一起把问题想明白", isResource ? "笔记、知识梳理与学习方法，在这里一起整理、交流。" : "分享学习经验，也把卡住你的问题说清楚。");
    const headingRow=el("div",null,"lc-section-title");headingRow.append(heading,link(isResource?"分享资料":"发起讨论","/community/publish?type="+(isResource?"resource":"discussion"),"lc-button lc-primary"));block.append(headingRow);
    const form = el("form", null, "lc-filter"); form.method = "get"; form.action = "/community/" + kind;
    const label = el("label"), input = el("input"); label.append(el("span", "搜索标题或简介", "lc-sr-only")); input.name = "q"; input.maxLength = 100; input.placeholder = isResource ? "搜索资料标题、简介…" : "搜索讨论标题、简介…"; input.value = search.get("q") || ""; label.append(input);
    const subjectInput = el("input"); subjectInput.type = "hidden"; subjectInput.name = "subject"; subjectInput.value = search.get("subject") || "";
    const button = el("button", "搜索", "lc-button lc-primary"); button.type = "submit"; form.append(label, subjectInput, button);
    const filters = el("nav", null, "lc-filters"); filters.setAttribute("aria-label", "按学科筛选");
    for (const subject of ["", "生物", "数学", "语文", "英语", "物理", "化学", "综合"]) {
      const query = new URLSearchParams(params); query.delete("offset"); subject ? query.set("subject", subject) : query.delete("subject");
      const chip = link(subject || "全部学科", "/community/" + kind + (query.size ? "?" + query : ""), "lc-chip");
      if ((search.get("subject") || "") === subject) chip.setAttribute("aria-current", "true"); filters.append(chip);
    }
    const counter = el("div", null, "lc-list-toolbar"),sort=el("select"),category=el("select");sort.name="sort";sort.setAttribute("aria-label","内容排序");category.name="category";category.setAttribute("aria-label","内容类型");
    for(const[v,t]of [["latest","最新发布"],["hot7","近 7 天热门"],["hot30","近 30 天热门"],["featured","精华内容"]]){const o=el("option",t);o.value=v;sort.append(o);}sort.value=params.get("sort")||"latest";
    for(const v of ["",...(isResource?["知识总结","专题练习","学习方法","阅读笔记","知识梳理","复习清单","其他学习资料"]:["学习经验","学科问题","资料求助","网站反馈","兴趣生活","其他"])]){const o=el("option",v||"全部类型");o.value=v;category.append(o);}category.value=params.get("category")||"";
    form.id="community-search";sort.setAttribute("form",form.id);category.setAttribute("form",form.id);sort.onchange=category.onchange=()=>form.requestSubmit();
    const selectors=el("div",null,"lc-list-selectors");selectors.append(category,sort);counter.append(el("span", `共 ${data.total} ${isResource ? "份资料" : "个讨论"}`, "lc-muted"),selectors);
    const list = U.list(primaryItems, "试试其他关键词或学科。");
    if (!primaryItems.length && data.items.length) list.replaceChildren(U.empty("本期内容已收录在精选中", "可以在本页的编辑推荐中继续阅读。"));
    content.append(form, filters, counter, list);
    if((params.get("sort")||"").startsWith("hot")){const rule=el("details",null,"lc-inline-form");rule.append(el("summary","热门如何排序"),el("p","在所选时间内按不同用户去重：收藏 2 分、完整下载 1 分、已通过回复 2 分、有帮助 2 分。同一人同一类互动只计一次；作者自己的互动、取消操作及不可见内容不计分。同分按首次发布时间和编号排序，编辑不会重新置顶。人工置顶与精华独立标记。","lc-muted"));content.append(rule);}
    if (!data.items.length) content.append(link("清除筛选", "/community/" + kind, "lc-button lc-clear-filter"));
    const pager = el("nav", null, "lc-actions lc-pager"); pager.setAttribute("aria-label", "分页");
    for (const [label, offset] of [["上一页", data.offset - data.limit], ["下一页", data.offset + data.limit]]) if (offset >= 0 && offset < data.total) {const query = new URLSearchParams(params); query.set("offset", offset); pager.append(link(label, "/community/" + kind + "?" + query, "lc-button"));}
    if (!pager.children.length && data.items.length) pager.append(el("span", unfiltered ? "本页包含最新分享与本期精选" : "已显示全部筛选结果", "lc-muted"));
    content.append(pager); block.append(columns(content, guide(kind, editorial, {exclude}))); return block;
  }
  async function detail(kind, id, request) {
    const [{item}, editorial] = await Promise.all([request(`/api/community/${kind}/${id}`), request("/api/community/editorial")]), block = el("div");
    const card = el("article", null, "lc-card lc-reading"), heading = el("div", null, "lc-detail-heading");
    heading.append(backLink(kind === "resources" ? "资料库" : "讨论区", "/community/" + kind, true), U.heading(item.title, item.kind==="discussion"?null:item.excerpt));card.append(heading);
    const meta = el("div", null, "lc-meta"); meta.append(el("span", item.subject + " · " + item.category), link(item.author.displayName, "/community/u/" + item.author.id), el("span", U.date(item.updatedAt))); card.append(meta);
    if (item.requiresLogin) card.append(U.loginGate("登录后查看完整正文和作者的社区主页。"));
    else {
      if(item.kind==="discussion")card.append(el("div",item.body,"lc-body-text"));
      else if(item.files?.length)card.append(window.AnderCommunityWorkflow.otherDetails(item));
      else card.append(el("div",item.body,"lc-body-text"));
      if(item.files?.length)card.append(item.kind==="discussion"?window.AnderCommunityWorkflow.discussionImages(item,{token:sessionToken}):window.AnderCommunityWorkflow.attachments(item,{token:sessionToken}));
      card.append(await window.AnderCommunitySocial.thread(item,{token:sessionToken,request}));
    }
    block.append(columns(card, guide(kind, editorial, {exclude: [item.id], detail: true}))); return block;
  }
  async function author(id, request) {
    const data = await request("/api/community/u/" + id), block = el("div"), own = ownProfileId === data.profile.id;
    block.append(backLink(own ? "我的社区" : "社区", own ? "/account#community" : "/community"));
    if (own) {const note = el("div", null, "lc-note lc-section-title"); note.append(el("span", "这是其他已登录用户看到的社区内容"), link("返回管理", "/account#community")); block.append(note);}
    const card = el("section", null, "lc-card lc-author"), banner = el("div", null, "lc-author-banner"), avatar = el("div", data.profile.displayName.slice(0, 1), "lc-avatar");
    card.append(banner, avatar, el("span", "已登录用户可见", "lc-tag"), el("h1", data.profile.displayName + "的社区主页"), el("p", data.profile.bio, "lc-muted"));
    const tabs = el("div", null, "lc-subtabs"), output = el("div"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "作者公开内容");
    for (const [key, title] of [["resources", "公开资料"], ["discussions", "公开讨论"]]) {
      const button = el("button", `${title} ${data[key].total}`); button.type = "button"; button.setAttribute("role", "tab"); button.id = "author-tab-" + key;
      button.setAttribute("aria-controls", "author-content"); button.setAttribute("aria-selected", String(key === "resources")); button.tabIndex = key === "resources" ? 0 : -1;
      button.onclick = () => {for (const b of tabs.children) {b.setAttribute("aria-selected", String(b === button)); b.tabIndex = b === button ? 0 : -1;} output.replaceChildren(U.list(data[key].items)); output.setAttribute("aria-labelledby", button.id);};
      button.onkeydown = event => {if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {event.preventDefault(); const buttons = [...tabs.children], next = event.key === "Home" ? buttons[0] : event.key === "End" ? buttons.at(-1) : buttons.find(b => b !== button); next.click(); next.focus();}};
      tabs.append(button);
    }
    output.id = "author-content"; output.setAttribute("role", "tabpanel"); output.setAttribute("aria-labelledby", "author-tab-resources"); output.append(U.list(data.resources.items));
    const content = el("section", null, "lc-author-content"); content.append(card, tabs, output); block.append(content); return block;
  }
  async function admin(request) {return window.AnderCommunityWorkflow.admin({request});}
  function markNavigation() {
    const routeKind = location.pathname.split("/")[2] || "resources",kind=routeKind==="publish"?(new URLSearchParams(location.search).get("type")==="discussion"?"discussions":"resources"):routeKind;
    document.querySelectorAll("[data-nav]").forEach(a => {if (a.dataset.nav === kind) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");});
  }
  async function load({scroll = null, focus = false} = {}) {
    if (!visible()) return;
    const run = ++generation, route = location.pathname + location.search;
    const current = () => run === generation && visible() && route === location.pathname + location.search;
    controller?.abort(); const active = controller = new AbortController();
    const request = url => U.request(url, {signal: active.signal});
    main.setAttribute("aria-busy", "true"); markNavigation();
    try {
      const session = await request("/api/community/session"); if (!current()) return;
      authenticated = session.authenticated; ownProfileId = session.ownProfileId;
      if (window.AnderAccountBootstrap) await window.AnderAccountBootstrap;
      const accountSession = await request("/api/account/session");
      if (!current()) return;
      if (authenticated && !accountSession.authenticated) {clear(); return load();}
      const nextToken = accountSession.csrfToken || "";
      if (sessionToken !== nextToken) main.replaceChildren(el("p", "正在加载内容…", "lc-empty"));
      sessionToken = nextToken;
      window.AnderCommunityFrame?.setAccount(accountSession);
      document.querySelector("[data-community-logout]").hidden = !authenticated || location.pathname==="/manage/community";
      const segments = location.pathname.split("/").filter(Boolean); let content;
      if(accountSession.membershipEnabled&&!authenticated&&segments[0]==='community'&&['resources','discussions'].includes(segments[1])&&segments[2]){
        location.assign('/account/login?next='+encodeURIComponent(location.pathname+location.search+location.hash));return;
      }
      window.AnderCommunityWorkflow?.reset();
      if (segments[0] === "manage") content = await admin(request);
      else if (segments[1] === "publish") content = await window.AnderCommunityWorkflow.editor({token:sessionToken,request});
      else if (segments.length === 1) content = await listing("resources", request);
      else if (segments[1] === "u") content = await author(segments[2], request);
      else if (segments[2]) content = await detail(segments[1], segments[2], request);
      else content = await listing(segments[1], request);
      if (!current()) return; main.replaceChildren(content);window.AnderCommunityWorkflow?.mountImages();
      if(/^#reply-[a-f0-9-]{36}$/.test(location.hash))document.getElementById(location.hash.slice(1))?.scrollIntoView({block:"center"});
      document.title = (main.querySelector("h1")?.textContent.replace(/\n/g, "") || "学习社区") + " · 安德生物工作室";
    } catch (e) {
      if (!current()) return;
      const message = e.status === 401 ? U.loginGate(e.message) : U.empty("暂时无法查看", e.message);
      if(location.pathname==="/manage/community"&&[401,403].includes(e.status))message.replaceChildren(el("h2","请使用社区审核身份登录"),el("p",e.message),link("前往管理登录","/login?next=%2Fmanage%2Fcommunity","lc-button lc-primary"));
      if (e.status !== 401) {const retry = el("button", "重新加载", "lc-button"); retry.type = "button"; retry.onclick = () => load({focus: true}); message.append(retry);}
      main.replaceChildren(message);
    } finally {
      if (current()) {
        main.removeAttribute("aria-busy"); main.style.minHeight = "";
        if (scroll !== null) window.scrollTo({top: scroll, behavior: "instant"});
        if (focus) main.focus({preventScroll: true});
      }
    }
  }
  // Only community-owned routes are updated here; account and original portal links
  // keep their existing document/session lifecycles. No content is cached between users.
  function accepts(url) {
    // Editing uses the browser's native leave/back protection for unsaved fields.
    if (window.AnderSiteNavigation) return false;
    if(location.pathname==="/community/publish" || url.pathname==="/community/publish")return false;
    return location.pathname.startsWith("/community") && url.origin === location.origin && !url.hash && /^\/community(?:\/publish|\/(?:resources|discussions)(?:\/[a-z0-9][a-z0-9-]{2,63})?|\/u\/[a-z0-9][a-z0-9-]{2,63})?$/.test(url.pathname);
  }
  function navigate(url) {
    if (url.pathname + url.search === location.pathname + location.search) return;
    if(!window.AnderCommunityWorkflow.confirmLeave()) return;
    history.replaceState({...history.state, communityScroll: scrollY}, "");
    history.pushState({communityScroll: 0}, "", url);
    load({scroll: 0, focus: true});
  }
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href);
    if (accepts(url)) {event.preventDefault(); navigate(url);}
  });
  main.addEventListener("submit", event => {
    const form = event.target;
    if (!form.matches("form.lc-filter") || event.defaultPrevented) return;
    const url = new URL(form.action); url.search = new URLSearchParams(new FormData(form)).toString();
    if (window.AnderSiteNavigation) {event.preventDefault(); window.AnderSiteNavigation.go(url);}
    else if (accepts(url)) {event.preventDefault(); navigate(url);}
  });
  window.addEventListener("popstate", event => {if (accepts(new URL(location.href))) load({scroll: event.state?.communityScroll || 0});});
  document.querySelector("[data-community-logout]").onclick = async () => {
    clear();
    try {const s = await U.request("/api/account/session"); const response = await fetch("/api/account/logout", {method: "POST", credentials: "same-origin", cache: "no-store", headers: {"content-type": "application/json", "x-ander-csrf": s.csrfToken}, body: "{}"}); if (!response.ok) throw new Error("退出未完成，请重试。"); channel?.postMessage("changed"); await load();}
    catch (e) {main.removeAttribute("aria-busy"); main.style.minHeight = ""; main.replaceChildren(U.empty("操作未完成", e.message));}
  };
  let channel;
  try {channel = new BroadcastChannel("ander-account-session"); channel.onmessage = () => {clear(); if (!document.hidden) load();};} catch { /* Focus and pageshow also revalidate. */ }
  window.addEventListener("pagehide", clear);
  window.addEventListener("pageshow", e => {if (e.persisted) {clear(); load();}});
  async function resume() {
    if (!visible() || document.hidden || Date.now() - lastResume < 150) return; lastResume = Date.now();
    if(window.AnderCommunityWorkflow?.isEditor() || location.pathname==="/manage/community") {
      const run=generation,adminToken=main.querySelector("[data-admin-token]")?.dataset.adminToken;
      try {
        const current=await U.request(adminToken?"/api/community-admin/session":"/api/account/session");if(run!==generation)return;
        if(current.csrfToken===(adminToken||sessionToken)){document.documentElement.classList.remove("lc-private-paused");return;}
      }catch { /* Clear an expired editing session without caching private fields. */ }
    }
    clear();load();
  }
  document.addEventListener("visibilitychange", () => {if (!visible()) return;if (document.hidden) {lastResume = 0;if(window.AnderCommunityWorkflow?.isEditor() || location.pathname==="/manage/community")document.documentElement.classList.add("lc-private-paused");else clear();} else resume();});
  window.addEventListener("focus", resume);
  if (window.AnderSiteNavigation) window.AnderSiteNavigation.register("community", {activate: load, deactivate: clear, confirmLeave: () => window.AnderCommunityWorkflow.confirmLeave()});
  else load();
})();
