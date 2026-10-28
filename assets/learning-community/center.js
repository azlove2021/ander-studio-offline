"use strict";
(() => {
  function create(root = document, signal) {
  const U = window.AnderCommunityUI, {el, link} = U, container = root.querySelector("[data-community-center]");
  const sections = {posts: "我的投稿", replies:"我的回复", bookmarks: "我的收藏", notifications: "消息通知", cases:"处理与申诉", settings: "社区资料"};
  const states = {draft: "草稿", checking:"正在检查", pending: "待审核", published: "已发布", returned: "已退回", withdrawn: "已撤回", removed: "已下架"};
  let generation = 0, initialized = false, sessionToken = "", lastResume = 0;
  const clear = () => {
    generation++;
    if (!container) return;
    container.style.minHeight = Math.max(container.getBoundingClientRect().height, 260) + "px";
    container.setAttribute("aria-busy", "true"); container.replaceChildren(el("p", "正在核对访问状态…", "lc-empty"));
  };
  function ownPosts(items) {
    const wrap = el("div"), filterLabel = el("label", "投稿状态", "lc-status-filter"), select = el("select"); select.setAttribute("aria-label", "投稿状态");
    for (const [value, label] of [["all", "全部状态"], ...Object.entries(states)]) {const option = el("option", label); option.value = value; select.append(option);}
    filterLabel.append(select); const output = el("div", null, "lc-list");
    function render() {
      const visible = items.filter(item => select.value === "all" || item.state === select.value); output.replaceChildren();
      for (const item of visible) {
        const card = el("article", null, "lc-private-item"), top = el("div", null, "lc-section-title"), title = el("h3", item.title);
        top.append(title, el("span", states[item.state], "lc-tag"));
        card.append(top, el("p", `${item.subject} · ${item.kind === "resource" ? "资料" : "讨论"} · ${U.date(item.updatedAt)}`, "lc-muted"));
        if (item.reviewReason) card.append(el("p", "审核说明：" + item.reviewReason, "lc-note"));
        if(item.managed)card.append(link(item.canEdit?"编辑稿件 / 查看进度":"查看稿件进度","/community/publish?type="+item.kind+"&draft="+item.id,"lc-button"));
        if (item.visible) card.append(link("查看已发布内容 →", U.href(item)));
        else {const details = el("details"), summary = el("summary", "查看我的稿件"); details.append(summary, el("div", item.body, "lc-body-text")); card.append(details);}
        output.append(card);
      }
      if (!visible.length) output.append(U.empty("此状态下暂无投稿", "已提交、草稿及退回稿会分别显示在这里。"));
    }
    select.onchange = render; render(); wrap.append(filterLabel, output); return wrap;
  }
  async function load({focusTab = false} = {}) {
    if (!initialized || !container || signal?.aborted) return;
    const run = ++generation;
    container.setAttribute("aria-busy", "true");
    const requested = new URLSearchParams(location.search).get("communityTab"), section = Object.hasOwn(sections, requested) ? requested : "posts";
    try {
      // A tab may outlive its account session. Never render data for the next user in the old shell.
      const current = await U.request("/api/account/session");
      if (run !== generation) return;
      if (!current.authenticated || current.csrfToken !== sessionToken) {clear(); location.replace("/account/login?next=" + encodeURIComponent("/account?communityTab=" + section + "#community")); return;}
      const data = await U.request("/api/community/me?section=" + section); if (run !== generation) return;
      if(section==="settings") {data.age=(await U.request("/api/account/community-age")).age;if(run!==generation)return;}
      window.AnderCommunityFrame?.setAccount(current);
      const fragment = document.createDocumentFragment(), heading = el("div", null, "lc-section-title"), intro = el("div");
      intro.append(el("p", "MY COMMUNITY", "eyebrow"), el("h2", "我的社区", "lc-center-title"), el("p", "每一份分享，都有清楚的进度。", "lc-muted")); heading.append(intro, el("span", "管理内容仅自己可见", "lc-tag lc-tag-neutral")); fragment.append(heading);
      const identity = el("section", null, "lc-identity");
      identity.append(el("div", (data.profile?.displayName || "我").slice(0, 1), "lc-avatar")); const identityText = el("div");
      identityText.append(el("h3", data.profile?.displayName || "尚未设置社区资料"), el("p", "这里使用社区昵称；账号资料和学习记录保持私密。", "lc-muted")); identity.append(identityText);
      if (data.profile?.visible) identity.append(link("查看社区主页 ↗", "/community/u/" + data.profile.id, "lc-button"));
      fragment.append(identity);
      const access=(await U.request('/api/community/publishing-access')).access;if(run!==generation)return;
      const accessNote=el('p',access.available?(access.mode==='open'?'社区投稿已全面开放，无需内测码。':'社区投稿内测资格已开通。'):access.restricted?'社区发言暂受限制，请查看处理与申诉。':!access.eligible?'请先完善社区资料并单独同意加入。':access.owned?'投稿资格已开通，请完成社区准入。':'投稿内测中；请兑换社区内测码或联系工作室开通投稿资格。','lc-note');
      if(!access.eligible&&!access.restricted)accessNote.append(el('span',' '),link('前往社区资料','/account?communityTab=settings#community'));
      fragment.append(accessNote);
      const tabs = el("div", null, "lc-subtabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "我的社区栏目");
      for (const [key, label] of Object.entries(sections)) {
        const button = el("button", label); button.type = "button"; button.id = "community-tab-" + key; button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "community-section"); button.setAttribute("aria-selected", String(section === key)); button.tabIndex = section === key ? 0 : -1;
        button.onclick = () => {if (key === section || !window.AnderCommunityWorkflow.confirmLeave()) return; const url = new URL(location.href); url.searchParams.set("communityTab", key); url.hash = "community"; history.replaceState(history.state, "", url); load({focusTab: true});};
        button.onkeydown = event => {const keys = Object.keys(sections), i = keys.indexOf(key); const next = event.key === "ArrowRight" ? (i + 1) % keys.length : event.key === "ArrowLeft" ? (i + keys.length - 1) % keys.length : event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1 : null; if (next !== null) {event.preventDefault(); tabs.children[next].click();}};
        tabs.append(button);
      }
      const panel = el("section"); panel.id = "community-section"; panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", "community-tab-" + section);
      if (section === "posts") {const actions=el("div",null,"lc-actions lc-new-resource");actions.append(link("分享资料","/community/publish?type=resource","lc-button lc-primary"),link("发起讨论","/community/publish?type=discussion","lc-button"));panel.append(actions,ownPosts(data.items));}
      else if (section === "bookmarks") panel.append(U.list(data.items, "收藏的已发布内容会出现在这里；撤回内容将停止展示。"));
      else if (["notifications","replies","cases"].includes(section)) panel.append(window.AnderCommunitySocial.center(data,section,{token:sessionToken,onSaved:()=>load()}));
      else {
        const card = el("section", null, "lc-card"); card.append(el("h3", data.profile?.visible?"我的社区资料":"单独同意并加入社区"), el("p", "昵称：" + (data.profile?.displayName || "尚未设置")), el("p", "简介：" + (data.profile?.bio || "尚未填写")));
        if (data.pending) {const note = el("div", null, "lc-note"); note.append(el("h3", data.profile?.visible?"资料修改待审核":"保留的旧资料申请"), el("p", "新昵称：" + data.pending.displayName), el("p", data.pending.bio), el("small", data.profile?.visible?"其他用户继续看到原来已通过的资料。":"旧申请不会自动转成加入资格；可先撤回，再按当前规则单独同意加入。首次加入无需人工审批。")); card.append(note);}
        if(!data.pending)card.append(window.AnderCommunityWorkflow.profileForm(data,{token:sessionToken,onSaved:()=>load()}));
        if(data.enrollment?.canWithdraw)card.append(window.AnderCommunityWorkflow.membershipWithdrawal(data,{token:sessionToken,onSaved:()=>load()}));
        panel.append(card);
      }
      fragment.append(tabs, panel, link("← 返回学习社区", "/community"));window.AnderCommunityWorkflow.reset();container.replaceChildren(fragment);
      if (focusTab) container.querySelector('[aria-selected="true"]')?.focus();
    } catch (e) {if (run === generation) container.replaceChildren(e.status === 401 ? U.loginGate(e.message, "/account#community") : U.empty("我的社区暂不可用", e.message));}
    finally {if (run === generation) {container.removeAttribute("aria-busy"); container.style.minHeight = "";}}
  }
  const api = {clear, load, async initialize({session}) {initialized = true; sessionToken = session.csrfToken; await load();}};
  window.addEventListener("pagehide", clear, {signal});
  window.addEventListener("pageshow", event => {if (event.persisted) {clear(); load();}}, {signal});
  async function resume() {if (signal?.aborted || document.hidden || Date.now() - lastResume < 150) return; lastResume = Date.now();if(window.AnderCommunityWorkflow?.isEditor()){try{const s=await U.request("/api/account/session");if(s.csrfToken===sessionToken){document.documentElement.classList.remove("lc-private-paused");return;}}catch{}}clear();load();}
  window.addEventListener("focus", resume, {signal});
  window.addEventListener("hashchange", () => {if (location.hash === "#community") load();}, {signal});
  root.querySelector('[data-center-tab="community"]')?.addEventListener("click", () => load());
  document.addEventListener("visibilitychange", () => {if (document.hidden) {lastResume = 0;if(window.AnderCommunityWorkflow?.isEditor())document.documentElement.classList.add("lc-private-paused");else clear();} else resume();}, {signal});
  try {const channel = new BroadcastChannel("ander-account-session"); signal?.addEventListener("abort",()=>channel.close(),{once:true}); channel.onmessage = () => {clear(); if (!document.hidden) load();};} catch { /* Focus/pageshow remain available. */ }
  signal?.addEventListener("abort", clear, {once:true});
  return api;
  }
  window.AnderCommunityCenter = {create};
})();
