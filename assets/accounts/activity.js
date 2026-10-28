"use strict";
(() => {
  // No background heartbeat: renew only on a visible visit or actual activity.
  // No tokens in web storage; internal administrator sessions use another cookie.
  if (window.top !== window.self || window.AnderAccountActivity) return;
  window.AnderAccountActivity = true;
  let pending = false, last = 0, usedBootstrap = false;
  async function active(force = false) {
    if (document.visibilityState !== "visible" || pending || (!force && Date.now() - last < 60000)) return;
    // The page's identity controller must establish the first anonymous CSRF
    // cookie alone. Two concurrent first GETs could otherwise install two seeds.
    const hasController = document.querySelector('script[src*="accounts/account.js"],script[src*="accounts/widget.js"]');
    if (hasController && !window.AnderAccountBootstrap) return;
    pending = true; last = Date.now();
    try {
      let session;
      if (hasController && !usedBootstrap) {
        usedBootstrap = true;
        session = await window.AnderAccountBootstrap;
      } else {
        const response = await fetch("/api/account/session", {credentials: "same-origin", cache: "no-store"});
        if (!response.ok) return;
        session = await response.json();
      }
      if (!session?.authenticated || !session.csrfToken || document.visibilityState !== "visible") return;
      await fetch("/api/account/session/renew", {method: "POST", credentials: "same-origin", cache: "no-store",
        headers: {"content-type": "application/json", "x-ander-csrf": session.csrfToken}, body: "{}"});
    } catch { /* Never treat a failed renewal as a new login. */ }
    finally { pending = false; }
  }
  for (const name of ["pointerdown", "keydown", "touchstart", "scroll"]) document.addEventListener(name, e => {if (e.isTrusted) active();}, {passive: true});
  document.addEventListener("visibilitychange", () => active());
  window.addEventListener("focus", () => active());
  window.addEventListener("pageshow", () => active());
  document.addEventListener("DOMContentLoaded", () => active());
  active();
})();
