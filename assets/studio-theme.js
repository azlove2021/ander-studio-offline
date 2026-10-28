/* Appearance only: no account requests, form resets, reloads or server writes. */
(function () {
  "use strict";
  const root = document.documentElement;
  const choices = [{id: "natural", title: "自然青绿"}, {id: "blue", title: "蓝色科技"}, {id: "dark", title: "黑色酷炫"}];
  const key = "ander.studio.appearance.v1";
  const valid = value => choices.some(choice => choice.id === value);
  let preferred = "natural";
  try { const saved = localStorage.getItem(key); if (valid(saved)) preferred = saved; } catch (_) { /* Private browsing can disable storage. */ }
  function isArk() {
    const shell = document.querySelector("[data-portal-current]");
    return shell ? shell.dataset.portalCurrent === "ark" : /^(?:#ark)$/.test(location.hash) && /\/(?:index.html)?$/.test(location.pathname);
  }
  function apply(suspended = isArk()) {
    if (suspended) root.removeAttribute("data-site-theme");
    else root.dataset.siteTheme = preferred;
    // Ark keeps its original main scene; only its shared sidebar receives the palette.
    const sidebar = document.querySelector(".studio-sidebar");
    if (sidebar) sidebar.dataset.sidebarTheme = preferred;
    document.querySelectorAll("[data-theme-picker]").forEach(picker => {
      picker.hidden = suspended;
      picker.querySelectorAll("[data-theme-choice]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === preferred)));
    });
  }
  function mount() {
    if (!document.querySelector("[data-theme-picker]")) {
      const target = document.querySelector(".account-header, .center-header, .foundation-hero, .qp-paper");
      if (target) { const picker = document.createElement("div"); picker.dataset.themePicker = ""; target.append(picker); }
    }
    document.querySelectorAll("[data-theme-picker]").forEach(picker => {
      picker.classList.add("theme-picker"); picker.setAttribute("role", "group"); picker.setAttribute("aria-label", "页面外观");
      picker.innerHTML = '<span class="theme-label">外观</span>' + choices.map(choice => `<button type="button" data-theme-choice="${choice.id}" aria-pressed="false"><i aria-hidden="true"></i>${choice.title}</button>`).join("");
    });
    apply();
  }
  window.AnderStudioTheme = {mount, apply};
  apply(); // Head script applies the saved palette before first paint.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-theme-choice]");
    if (!button || !valid(button.dataset.themeChoice)) return;
    preferred = button.dataset.themeChoice;
    try { localStorage.setItem(key, preferred); } catch (_) { /* Switching still works without persistence. */ }
    apply();
  });
  window.addEventListener("ander:portal-section", event => apply(event.detail === "ark"));
  window.addEventListener("storage", event => { if (event.key === key) { preferred = valid(event.newValue) ? event.newValue : "natural"; apply(); } });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once: true}); else mount();
}());
