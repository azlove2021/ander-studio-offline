/* Optional account UI. No mock codes, provider keys or account data in storage. */
"use strict";
window.AnderPhoneAccount = {waitLabel(hold, now = Date.now()) {
  if (hold?.canRetry === false) return "本轮此步骤不可再发码";
  const seconds = Math.max(0, Math.ceil(((hold?.until || 0) - now) / 1000));
  if (!seconds) return "";
  if (seconds < 60) return `${seconds} 秒后重发`;
  const minutes = Math.ceil(seconds / 60);
  return minutes < 60 ? `${minutes} 分钟后可再尝试` : `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟后可再尝试`;
}, initialize({root=document,signal,session, request, show, afterLogin, returnTarget, bindForm}) {
  const page = document.body.dataset.accountPage, capability = session.phoneAuth || {};
  const open = page === "register" ? capability.registrationOpen : page === "recover" ? capability.recoveryOpen : page === "profile" ? capability.bindingOpen : (capability.smsLoginOpen ?? capability.loginOpen);
  if (!capability.loginOpen) return {active: false};
  const registrationGuidance = root.querySelector("[data-registration-guidance]");
  if (registrationGuidance && capability.bindingOpen) registrationGuidance.textContent = "已有邮箱账户请先登录，再到学习空间绑定手机号，无需重复注册。";
  if (registrationGuidance && capability.registrationRecoveryOnly) registrationGuidance.textContent = "本轮请用已空出的 A 创建独立测试账户；原账户仍绑定 B，原有学习数据不转入此测试账户。";
  const banner = root.querySelector("[data-phone-preview]");
  if (banner && (capability.mock || capability.localPublicPreview) && ["127.0.0.1", "localhost", "[::1]"].includes(location.hostname)) banner.hidden = false;
  const registrationPolicy = root.querySelector("[data-phone-registration-policy]");
  if (registrationPolicy && capability.public) registrationPolicy.hidden = false;
  if (banner && capability.pilot) {
    banner.textContent = capability.registrationRecoveryOnly ? "本轮仅用 A 注册一个独立测试账户，再为该账户找回密码，各一次短信。登录请用手机号和密码；B 的原账户不变。截止北京时间 9 月 22 日 11:59:43，失败也占用机会，请勿反复点击。仍未公开开放，站外安全提醒尚未启用。" : capability.supplement ? "本次补充仅用于：A 验证原手机一次 → B 验证新手机一次 → B 登录一次。截止北京时间 9 月 22 日 11:59:43；失败也占用机会，请勿反复点击。仍未公开开放，站外安全提醒尚未启用。" : "当前仅对指定号码开展短信联调，尚未公开开放。密码或手机号变更的站外安全提醒尚未启用。";
    banner.hidden = false;
  }
  if (page === "profile" && capability.public && !window.AnderAccountCenter) {
    const area = root.querySelector("[data-phone-security-panel]"); if (area) area.hidden = false;
    const policy = root.querySelector("[data-phone-notification-policy]");
    if (policy) policy.textContent = session.user.emailVerified ? "手机号安全变更会记录在这里，并向已验证邮箱请求发送安全邮件。邮件受理不等于送达，请留意收件箱。" : "你使用的是纯手机账户，无需绑定邮箱。手机号安全变更只记录在站内，不会收到站外安全提醒。";
  }
  if (page === "profile" && !window.AnderAccountCenter) {
    request("/api/account/phone/events").then(result => {
      const list = root.querySelector("[data-phone-events]"); if (!list) return;
      const area = root.querySelector("[data-phone-security-panel]"); if (area) area.hidden = false;
      const names = {register: "手机号注册", reset: "通过手机重置密码", bind: "绑定手机号", rebind: "更换手机号"};
      const states = {no_verified_email: "仅站内记录：未绑定验证邮箱", accepted: "安全邮件已受理，送达未确认", failed: "安全提醒未确认发送成功", not_configured: "邮件提醒尚未配置", pending: "邮件结果待确认", mock: "本机模拟提醒", not_required: "无需另发通知"};
      for (const item of result.events) {
        const line = document.createElement("li"); line.textContent = `${names[item.action] || "安全操作"} · ${new Date(item.createdAt).toLocaleString("zh-CN")} · ${states[item.notificationState] || "结果未确认"}`; list.append(line);
      }
      if (!result.events.length) {const line = document.createElement("li"); line.textContent = "暂无手机安全变更记录。"; list.append(line);}
    }).catch(() => {});
  }
  if (page === "login") {
    const label = root.querySelector("[data-login-identity-label]");
    if (label) label.textContent = "邮箱 / 手机号";
    const identity = root.querySelector("[data-login-form] input[name=email]");
    identity.type = "text"; identity.placeholder = "已验证的邮箱或 +86 手机号";
    if (capability.registrationRecoveryOnly || !open) return {active: false};
  }
  const form = root.querySelector("[data-phone-form]");
  if (!form || !open) return {active: false};
  let challengeId = "", oldChallengeId = "", sentPhone = "", oldTarget = "", generation = 0;
  let sending = false;
  const holds = new Map();
  const phone = form.elements.phone, send = form.querySelector("[data-phone-send]"), next = form.querySelector("[data-phone-new-send]");
  const changing = page === "profile" && session.user.phoneVerified;
  const purpose = page === "register" ? "register" : page === "recover" ? "reset" : page === "profile" ? (changing ? "rebind" : "bind") : "login";
  const canonical = () => "+86" + phone.value.trim().replace(/^\+86/, "");
  const holdKey = isNew => changing && !isNew ? "bound-old-phone" : canonical() + ":" + (isNew ? "new" : "primary");
  const hold = isNew => {
    const items = [holds.get("global"), holds.get(holdKey(isNew))].filter(Boolean);
    return items.find(item => item.canRetry === false) || items.sort((a, b) => b.until - a.until)[0];
  };
  const blocked = isNew => Boolean(window.AnderPhoneAccount.waitLabel(hold(isNew)));
  const resetProof = () => { generation++; challengeId = ""; oldChallengeId = ""; sentPhone = ""; oldTarget = ""; form.elements.code.value = ""; if (form.elements.oldCode) form.elements.oldCode.value = ""; };
  phone.addEventListener("input", resetProof);
  if (page === "register") document.addEventListener("ander-registration-changed",resetProof);
  form.elements.currentPassword?.addEventListener("input", resetProof);
  const update = () => {
    send.textContent = window.AnderPhoneAccount.waitLabel(hold(false)) || (changing ? "获取原手机验证码" : "获取验证码");
    send.disabled = sending || blocked(false);
    if (next) { next.disabled = sending || !oldChallengeId || blocked(true); next.textContent = window.AnderPhoneAccount.waitLabel(hold(true)) || "验证原手机并获取新验证码"; }
  };
  if (page === "profile") {
    root.querySelector("[data-phone-settings]").hidden = false;
    root.querySelector("[data-phone-heading]").textContent = changing ? "更换绑定手机号" : "绑定手机号";
    form.querySelector("[data-phone-submit]").textContent = changing ? "确认换绑，重新登录" : "确认绑定，重新登录";
    form.querySelector("[data-old-phone-step]").hidden = !changing;
    form.elements.oldCode.disabled = !changing;
    if (changing) {
      form.elements.oldCode.required = true;
      form.querySelector("[data-previous-phone]").textContent = session.user.phoneMasked;
    }
    root.querySelector("[data-phone-closed-help]").hidden = true;
  } else {
    const tabs = root.querySelector("[data-auth-methods]"); tabs.hidden = false;
    const emailForm = root.querySelector("[data-login-form], [data-register-form], [data-recover-form]");
    const select = method => {
      // Cancel stale in-flight response ownership when switching channels.
      resetProof(); const sms = method === "phone";
      form.hidden = !sms; emailForm.hidden = sms;
      root.querySelectorAll("[data-email-help]").forEach(el => { el.hidden = sms; });
      tabs.querySelectorAll("button").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.authMethod === method)));
      root.querySelector("[data-notice]").hidden = true;
      if (!sms && (page === "register" && !session.registrationOpen || page === "recover" && !session.recoveryOpen)) show("邮箱的这项功能暂未开放，可切换手机方式或联系工作室。");
      else if (!sms && page !== "login" && session.deliveryMode === "allowlist") show("邮箱方式仅对已加入名单的测试邮箱开放。");
    };
    tabs.querySelectorAll("button").forEach(el => el.addEventListener("click", () => select(el.dataset.authMethod)));
    select("phone");
  }
  form.querySelector("fieldset").disabled = false;
  async function sendRequest(isNew) {
    if (sending || !phone.reportValidity()) return;
    if (purpose === "register" && !await window.AnderRegistration.ensureAgreement(form)) return;
    if (page === "profile" && !isNew && !form.elements.currentPassword.reportValidity()) return;
    if (isNew && (!oldChallengeId || !form.elements.oldCode.reportValidity())) return;
    if (blocked(isNew)) return;
    sending = true; update();
    const requestedPhone = canonical(), requestedGeneration = generation, requestedKey = holdKey(isNew);
    if (isNew) { challengeId = ""; sentPhone = ""; } else { challengeId = ""; sentPhone = ""; oldChallengeId = ""; }
    const body = {purpose: changing && !isNew ? "rebind-old" : purpose, phone: requestedPhone};
    if (purpose === "register") body.agree = true;
    if (page === "profile" && !isNew) body.currentPassword = form.elements.currentPassword.value;
    if (isNew) { body.oldChallengeId = oldChallengeId; body.oldCode = form.elements.oldCode.value; }
    let sendStarted = false;
    try {
      if (purpose === "register") Object.assign(body,window.AnderRegistration?.read());
      if (capability.captchaRequired) {
        if (!window.AnderCaptcha) throw new Error("人机验证组件未加载，本次没有发送短信。");
        body.captcha = await window.AnderCaptcha.verify({request, purpose: body.purpose, phone: body.phone, agree: body.agree,
          registration: purpose === "register" ? window.AnderRegistration?.read() : {},
          current: () => generation === requestedGeneration && canonical() === requestedPhone && (purpose !== "register" || form.elements.agree.checked)});
      }
      sendStarted = true;
      const result = await request("/api/account/phone/code", body);
      holds.set(requestedKey, {until: Date.now() + result.retryAfter * 1000, canRetry: !capability.supplement});
      if (generation === requestedGeneration && canonical() === requestedPhone) {
        if (changing && !isNew) { oldChallengeId = result.challengeId; oldTarget = requestedPhone; }
        else { challengeId = result.challengeId; sentPhone = requestedPhone; }
        show(changing && !isNew ? capability.mock ? "请在模拟收件箱查看原手机验证码，再验证新手机。" : "原手机号验证码请求已受理，请查看原手机短信，再验证新手机。" : result.message);
      }
    } catch (error) {
      if (Number.isFinite(error.retryAfter) && error.retryAfter > 0) holds.set(error.smsRateLimit?.scope === "global" ? "global" : requestedKey,
        {until: Date.now() + error.retryAfter * 1000, canRetry: error.smsRateLimit?.canRetry !== false});
      // A new-number send may have consumed the old proof. Never silently replay it.
      if (isNew && sendStarted && !["CAPTCHA_REQUIRED", "CAPTCHA_UNAVAILABLE", "RATE_LIMITED"].includes(error.code)) oldChallengeId = "";
      show(error.message, true);
    } finally { sending = false; update(); }
  }
  send.addEventListener("click", () => sendRequest(false));
  next?.addEventListener("click", () => sendRequest(true));
  const timer=setInterval(update, 500); signal?.addEventListener("abort",()=>clearInterval(timer),{once:true}); update();
  bindForm("[data-phone-form]", async values => {
    if (sending || !challengeId || canonical() !== sentPhone || (changing && oldTarget !== sentPhone)) throw new Error("请先为当前手机号完成本次验证码验证流程。");
    const body = {phone: canonical(), code: values.code, challengeId};
    if (["register", "reset"].includes(purpose)) { body.password = values.password; body.confirmPassword = values.confirmPassword; }
    if (purpose === "register") { body.displayName = values.displayName; body.agree = values.agree === "on"; Object.assign(body,window.AnderRegistration?.read()); }
    if (page === "profile") body.purpose = purpose;
    const result = await request("/api/account/phone/" + (page === "profile" ? "bind" : purpose), body);
    form.reset(); resetProof();
    let destination = ["register", "login"].includes(purpose) ? afterLogin : result.next;
    if (purpose === "reset" && returnTarget) destination += "&next=" + encodeURIComponent(returnTarget);
    if (["reset", "bind", "rebind"].includes(purpose) && !result.notificationSimulated) destination += "&notice=" +
      (result.notificationState === "no_verified_email" ? "in-app" : result.notificationState === "accepted" ? "accepted" : "failed");
    location.assign(destination);
  });
  return {active: true};
}};
