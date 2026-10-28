"use strict";
(() => {
  if (window.top !== window.self || !document.querySelector(".studio-sidebar")) return;
  let session = null, panel = null, refreshing = false, styled = false;
  function render() {
    if (!styled) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "/assets/accounts/widget.css?v=accounts-v1";
      document.head.append(stylesheet);
      styled = true;
    }
    panel = document.querySelector(".studio-sidebar .account-entry") || document.createElement("section");
    panel.replaceChildren();
    panel.className = "account-entry";
    panel.setAttribute("aria-label", "我的账户");
    const title = document.createElement("strong");
    title.textContent = session.authenticated ? session.user.displayName : "留住每一次发现";
    const hint = document.createElement("p");
    hint.textContent = session.authenticated ? "资料、学习记录与已有权限" : "登录后，保存学习足迹与收藏";
    const link = document.createElement("a");
    link.href = session.authenticated ? "/account" : "/account/login";
    link.textContent = session.authenticated ? "我的学习中心" : "登录 / 注册";
    panel.append(title, hint, link);
    const sidebar = document.querySelector(".studio-sidebar");
    const entry=sidebar.querySelector("[data-learning-community-entry]");
    if (entry) entry.setAttribute("aria-label", "学习社区");
    if (!entry) {
      const community = document.createElement("a");
      community.href = "/community";
      community.innerHTML = '<span class="studio-nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5"></path></svg></span><span>学习社区</span>';
      community.className = "studio-nav-button"; community.dataset.learningCommunityEntry = "";
      const navigation = sidebar.querySelector(".studio-nav");
      navigation?.insertBefore(community, navigation.querySelector('[data-portal-section="products"]'));
    }
    if (!panel.isConnected) sidebar.insertBefore(panel, sidebar.querySelector(".studio-sidebar-ornament"));
    window.AnderSiteNavigation?.mark();
  }
  async function refreshSession() {
    if (refreshing) return;
    refreshing = true;
    session = null;
    clear();
    try {
      const response = await fetch("/api/account/session", {credentials: "same-origin", cache: "no-store"});
      if (!response.ok) return;
      const latest = await response.json();
      if (!latest.enabled) return latest;
      session = latest;
      render();
      return latest;
    } catch { /* Static/offline previews must not retain another account's identity. */ }
    finally { refreshing = false; }
  }
  function clear(){if(panel){panel.querySelector("strong").textContent="我的账户";panel.querySelector("p").textContent="资料、学习记录与已有权限";}}
  window.AnderAccountWidget={setSession(value){session=value;if(value?.enabled!==false)render();},clear,refresh:refreshSession};
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-model-id]");
    if (!session?.authenticated || !link?.dataset.modelId || event.defaultPrevented) return;
    fetch("/api/account/visits", {method: "POST", credentials: "same-origin", keepalive: true,
      headers: {"content-type": "application/json", "x-ander-csrf": session.csrfToken}, body: JSON.stringify({modelId: link.dataset.modelId})}).catch(() => {});
  });
  window.addEventListener("focus", refreshSession);
  window.addEventListener("ander:site-view",()=>{if(session)render();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)clear();else refreshSession();});
  window.addEventListener("pageshow", event => {if (event.persisted) refreshSession();});
  try {
    const channel = new BroadcastChannel("ander-account-session");
    channel.onmessage = refreshSession;
  } catch { /* Focus/pageshow remain the fallback; no identity is stored locally. */ }
  window.AnderAccountBootstrap = refreshSession();
})();
