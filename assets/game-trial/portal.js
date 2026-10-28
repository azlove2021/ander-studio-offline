"use strict";
(() => {
  const root = document.querySelector("[data-ark-portal]");
  if (!root) return;
  const find = name => root.querySelector(`[data-ark-${name}]`);
  const form = find("code-form"), input = form.elements.code, verify = find("verify"), confirm = find("confirm");
  const notice = document.getElementById("ark-access-status");
  const noticeMessage = find("status-message"), loginPrompt = find("login-prompt");
  let session = null, context = null, checked = null, busy = false, generation = 0;
  const visible = () => !root.hidden;
  const show = (message, error = false) => {
    noticeMessage.textContent = message;
    loginPrompt.hidden = true;
    notice.classList.toggle("is-error", error);
  };
  const showLogin = (message = "", error = false) => {
    show(message ? `${message} ` : "", error);
    loginPrompt.hidden = false;
  };
  const clearConfirmation = () => { checked = null; find("confirmation").hidden = true; verify.hidden = false; };
  function pending(value) {
    busy = value;
    input.disabled = value;
    verify.disabled = value || session?.gameTrialOpen !== true;
    confirm.disabled = value;
    find("cancel").disabled = value;
    find("retry").disabled = value;
    root.setAttribute("aria-busy", String(value));
  }
  async function api(url, body) {
    const response = await fetch(url, {
      credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(15000),
      method: body === undefined ? "GET" : "POST",
      headers: {"content-type": "application/json", "x-ander-csrf": session?.csrfToken || ""},
      ...(body === undefined ? {} : {body: JSON.stringify(body)})
    });
    let value;
    try { value = await response.json(); } catch { throw new Error("登舰入口暂时无法连接，请稍后重试。"); }
    if (!response.ok || value.ok === false) {
      const error = new Error(value.message || "验证未完成，请核对后重试。");
      error.code = value.code;
      throw error;
    }
    return value;
  }
  async function readIdentity() {
    session = await api("/api/account/session");
    context = session.authenticated && session.gameTrialOpen === true ? await api("/api/game/context") : null;
    return session;
  }
  function identityView() {
    if (session?.membershipEnabled) {
      form.hidden = true;
      find("ready").hidden = session.gameTrialOpen !== true;
      find("retry").hidden = session.gameTrialOpen === true;
      const enter = find("enter"), description = find("ready").querySelector("p");
      enter.href = session.authenticated ? "/games/life-ark?enter=1" : "/account/login?next=game-enter";
      enter.textContent = "进入生命方舟 →";
      description.textContent = "登录后每天可体验10分钟；游戏 VIP 不限时。暂停、载入和切到后台不计时。";
      if (session.gameTrialOpen !== true) show("登舰入口暂未开放，请稍后再来。你的账号与存档不受影响。");
      else if (!session.authenticated) show("开启你的生命探索。点击进入，登录后接续航程。");
      else if (context?.budget?.unlimited) show(`当前账号：${session.user.displayName} · 游戏时间不限。`);
      else if (context?.budget?.exhausted) show("今日10分钟已用完，明日北京时间00:00恢复。进入后仍可查看保存状态。");
      else show(`当前账号：${session.user.displayName} · 今日还可游玩 ${Math.floor((context?.budget?.remainingSeconds || 0) / 60)}分${(context?.budget?.remainingSeconds || 0) % 60}秒。`);
      return;
    }
    find("ready").hidden = !context?.entitled;
    form.hidden = !!context?.entitled;
    find("retry").hidden = true;
    if (session?.gameTrialOpen !== true) {
      show("登舰入口暂未开放，请稍后再来。你的账号与存档不受影响。");
      find("retry").hidden = false;
    } else if (!session.authenticated) {
      showLogin();
    } else if (context?.entitled) {
      show(`当前账号：${session.user.displayName} · 已获得游戏资格，无需再次输入邀请码。`);
    } else {
      show(`当前账号：${session.user.displayName} · 验证后请核对并确认绑定。`);
    }
  }
  function failed(error) {
    show(error.message || "连接中断，请重试。邀请码尚未确认，不会自动提交兑换。", true);
    if (["AUTH_REQUIRED", "CSRF_FAILED", "SESSION_CHANGED"].includes(error.code)) {
      clearConfirmation();
      find("ready").hidden = true;
      form.hidden = session?.membershipEnabled === true;
      showLogin(error.message || "登录状态已变化。", true);
    }
    find("retry").hidden = false;
  }
  async function refresh() {
    if (!visible() || busy) return;
    const request = ++generation;
    pending(true);
    clearConfirmation();
    find("ready").hidden = true;
    try { await readIdentity(); if (request === generation) identityView(); }
    catch (error) { session = null; context = null; failed(error); }
    finally { pending(false); if (visible() && request !== generation) void refresh(); }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;
    const code = input.value.trim();
    if (!code) { input.focus(); return; }
    pending(true); clearConfirmation(); show("正在核对邀请码…");
    const request = generation;
    try {
      await readIdentity();
      if (!visible() || request !== generation) return;
      identityView();
      if (session.gameTrialOpen !== true) return;
      if (!session.authenticated) { find("login").focus(); return; }
      if (context.entitled) { input.value = ""; location.assign("/games/life-ark?enter=1"); return; }
      const result = await api("/api/account/entitlement-preview", {code});
      if (!visible() || request !== generation) return;
      if (!result.package?.resources?.some(resource => resource.id === "life-ark-molecules-trial")) {
        throw new Error("这不是生命方舟的游戏邀请码，请核对后重试。");
      }
      checked = {code, csrfToken: session.csrfToken};
      find("scope").textContent = `将绑定到「${session.user.displayName}」：${result.package.title}。包含：${result.package.resources.map(resource => resource.title).join("、")}。`;
      find("confirmation").hidden = false;
      verify.hidden = true;
      show("邀请码有效。请确认绑定账号与游戏范围。");
    } catch (error) { clearConfirmation(); failed(error); }
    finally {
      pending(false);
      if (checked && visible()) confirm.focus();
      if (visible() && request !== generation) void refresh();
    }
  });
  input.addEventListener("input", () => { if (checked) { clearConfirmation(); show("邀请码已修改，请重新验证。"); } });
  find("cancel").addEventListener("click", () => { clearConfirmation(); input.focus(); identityView(); });
  confirm.addEventListener("click", async () => {
    if (busy || !checked) return;
    const accepted = checked;
    const request = generation;
    pending(true); show("正在确认登舰资格…");
    try {
      await readIdentity();
      if (!session.authenticated || session.csrfToken !== accepted.csrfToken) {
        clearConfirmation(); identityView();
        throw new Error("登录账号已变化，请重新验证邀请码并核对绑定账号。");
      }
      if (session.gameTrialOpen !== true) { clearConfirmation(); identityView(); return; }
      await api("/api/account/entitlement-redeem", {code: accepted.code, confirmed: true});
      clearConfirmation(); input.value = "";
      show("登舰验证通过，正在进入生命方舟…");
      if (visible() && request === generation) location.assign("/games/life-ark?enter=1");
    } catch (error) { failed(error); }
    finally { pending(false); }
  });
  find("retry").addEventListener("click", refresh);
  window.addEventListener("ander:portal-section", event => {
    if (event.detail === "ark") void refresh();
    else { ++generation; clearConfirmation(); input.value = ""; }
  });
  window.addEventListener("focus", () => { if (!checked) void refresh(); });
  window.addEventListener("online", () => { if (!checked) void refresh(); });
  window.addEventListener("pageshow", event => { if (event.persisted) void refresh(); });
  try {
    const channel = new BroadcastChannel("ander-account-session");
    channel.onmessage = () => { clearConfirmation(); void refresh(); };
  } catch { /* Recheck the session before every preview and redemption as well. */ }
})();
