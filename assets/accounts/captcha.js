/* Only loads the fixed Tencent SDK after an explicit request for a code. */
"use strict";
(() => {
  let loading;
  function loadSdk() {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://turing.captcha.qcloud.com/TJCaptcha.js";
      script.async = true; script.referrerPolicy = "no-referrer";
      const timer = setTimeout(() => failed(), 15000);
      const failed = () => {clearTimeout(timer); script.remove(); loading = null; reject(new Error("人机验证加载失败，本次未发送短信。请稍后手动重试。"));};
      script.addEventListener("error", failed, {once: true});
      script.addEventListener("load", () => {clearTimeout(timer); if (typeof window.TencentCaptcha !== "function") failed(); else resolve(window.TencentCaptcha);}, {once: true});
      document.head.append(script);
    });
    return loading;
  }
  function localChallenge(start) {
    if (!["127.0.0.1", "localhost", "[::1]"].includes(location.hostname)) throw new Error("模拟人机验证仅可在本机预览。");
    return new Promise((resolve, reject) => {
      const dialog = document.createElement("dialog"), title = document.createElement("h2"), note = document.createElement("p"), yes = document.createElement("button"), no = document.createElement("button");
      dialog.className = "local-captcha-dialog"; title.id = "local-captcha-title"; title.textContent = "本机模拟人机验证";
      dialog.setAttribute("aria-labelledby", title.id); note.textContent = "这里只演示验证成功／取消后的页面流程，不连接腾讯云，也不发送真实短信或邮件。";
      yes.type = no.type = "button"; yes.className = "primary"; no.className = "secondary";
      yes.textContent = "模拟验证通过"; no.textContent = "取消，不发送";
      const finish = passed => {clearTimeout(timer); dialog.close(); dialog.remove(); if (passed) resolve({ticket: "local-synthetic-ticket-" + start.id, randstr: "@local"}); else reject(new Error("已取消人机验证，未发送短信。"));};
      const timer = setTimeout(() => finish(false), 240000);
      yes.addEventListener("click", () => finish(true), {once: true}); no.addEventListener("click", () => finish(false), {once: true});
      dialog.addEventListener("cancel", event => {event.preventDefault(); finish(false);}, {once: true});
      dialog.append(title, note, yes, no); document.body.append(dialog); dialog.showModal(); yes.focus();
    });
  }
  function failureMessage(result) {
    // Only fixed messages/codes are rendered. Never expose SDK URLs, tickets,
    // encrypted configuration or untrusted errorMessage strings to the page.
    const code = String(result?.errorCode || "");
    if (["1001", "1003", "1004", "1007", "1008", "1009", "1010"].includes(code))
      return "人机验证窗口加载失败（" + code + "），本次未发送短信。请刷新页面后手动重试；若仍不弹窗，请联系网站管理员。";
    if (code === "1006" || code === "1013")
      return "人机验证服务连接或配置异常（" + code + "），本次未发送短信。请稍后手动重试；若持续出现，请联系网站管理员。";
    if (code === "1002" || code === "1085") return "人机验证窗口响应超时，本次未发送短信。请稍后手动重试。";
    if (!code && result?.ret === 2) return "已取消人机验证，本次未发送短信。";
    if (code || /^trerror/i.test(result?.ticket || "")) return "人机验证暂不可用，本次未发送短信。请稍后手动重试。";
    return "人机验证未完成，本次未发送短信。请完成验证后再继续。";
  }
  async function verify({request, purpose, phone, email, channel = "phone", agree, registration = {}, current, challenge}) {
    const start = challenge || await request(channel === "email" ? "/api/account/email/captcha" : "/api/account/phone/captcha", {purpose, ...(channel === "email" ? {email} : {phone}), ...(purpose === "register" ? {agree,...registration} : {})});
    if (!current()) throw new Error("输入已变化，请为当前操作重新获取验证码。");
    if (!/^[a-f0-9]{48}$/.test(start.id) || !/^[1-9][0-9]{5,11}$/.test(start.appId)) throw new Error("人机验证配置异常，本次未发送短信。");
    let proof;
    if (start.simulated === true) proof = await localChallenge(start);
    else {
      const Captcha = await loadSdk();
      if (!current()) throw new Error("输入已变化，请重新验证。");
      proof = await new Promise((resolve, reject) => {
        let widget, settled = false;
        const timer = setTimeout(() => finish(new Error("人机验证已超时，未发送短信。")), 240000);
        const finish = (error, value) => {if (settled) return; settled = true; clearTimeout(timer); try {widget?.destroy?.();} catch { /* Widget cleanup must not hide the result. */ } error ? reject(error) : resolve(value);};
        try {
          widget = new Captcha(start.appId, result => {
            if (result?.ret !== 0 || result.errorCode || typeof result.ticket !== "string" || !result.ticket || /^trerror/i.test(result.ticket) || typeof result.randstr !== "string" || !result.randstr) {
              finish(new Error(failureMessage(result))); return;
            }
            finish(null, {ticket: result.ticket, randstr: result.randstr});
          }, {userLanguage: "zh-cn", aidEncryptedType: "gcm", aidEncrypted: start.aidEncrypted});
          widget.show();
        } catch {finish(new Error("人机验证暂不可用，本次未发送短信。"));}
      });
    }
    if (!current()) throw new Error("输入已变化，刚才的验证不会用于新的号码或操作。");
    return {id: start.id, ticket: proof.ticket, randstr: proof.randstr};
  }
  window.AnderCaptcha = Object.freeze({verify});
})();
