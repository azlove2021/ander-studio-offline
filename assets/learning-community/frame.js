"use strict";
(() => {
  const sidebar = document.querySelector(".lc-frame .studio-sidebar");
  if (!sidebar) return;
  const name = sidebar.querySelector("[data-frame-name]"), hint = sidebar.querySelector("[data-frame-hint]"), account = sidebar.querySelector("[data-community-account]");
  function clearAccount() {if (window.AnderAccountWidget) {window.AnderAccountWidget.clear();return;}name.textContent = "学习，从这里继续"; hint.textContent = "资料、学习记录与已有权限";}
  function setAccount(session) {
    if (window.AnderAccountWidget) {window.AnderAccountWidget.setSession(session);return;}
    clearAccount();
    const authenticated = Boolean(session?.authenticated);
    name.textContent = authenticated ? session.user?.displayName || "我的账户" : "留住每一次发现";
    hint.textContent = authenticated ? "资料、学习记录与已有权限" : "登录后，保存学习足迹与收藏";
    account.textContent = authenticated ? "我的学习中心" : "登录 / 注册";
    account.href = authenticated ? "/account#community" : "/account/login?next=" + encodeURIComponent(window.AnderCommunityReturn?.(location.pathname + location.search + location.hash) || "/community");
  }
  if (location.pathname === "/account" && account) {
    sidebar.querySelector("[data-learning-community-entry]").classList.remove("is-active");
    sidebar.querySelector("[data-learning-community-entry]").removeAttribute("aria-current");
    account.setAttribute("aria-current", "page");
  }
  window.AnderCommunityFrame = {setAccount, clearAccount};
  document.addEventListener("DOMContentLoaded", () => {document.querySelectorAll("[data-theme-choice]").forEach(button => {button.title = button.textContent.trim();});}, {once:true});
  window.addEventListener("pagehide", clearAccount);
  document.addEventListener("visibilitychange", () => {if (document.hidden) clearAccount();});
})();
