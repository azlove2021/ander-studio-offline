"use strict";
(() => {
  const form = document.querySelector("[data-admin-login]"), note = document.querySelector("[data-admin-notice]");
  const send = form.querySelector("[data-admin-send]"), submit = form.querySelector('[type="submit"]');
  let csrf = "", challenge = "", generation = 0, pending = false, ready = false, retryAt = 0;
  const nextValue = new URLSearchParams(location.search).get("next");
  // Fixed destinations only: no externally controlled redirect after authentication.
  const next = ["/manage", "/student-admin", "/content-admin", "/qingniao-admin", "/question-feedback-admin", "/site-editor.html", "/project-map.html"].includes(nextValue) ? nextValue : "/manage";
  function update() {send.disabled = !ready || pending || Date.now() < retryAt; submit.disabled = !ready || pending || !challenge;}
  async function request(endpoint, data) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(endpoint, {method:data ? "POST" : "GET", credentials:"same-origin", cache:"no-store", signal:controller.signal,
        headers:data ? {"content-type":"application/json", "x-admin-auth-csrf":csrf} : {}, ...(data ? {body:JSON.stringify(data)} : {})});
      const body = await res.json();
      if (!res.ok || body.ok !== true) throw new Error(body.message || "本次验证未完成，请稍后重试。");
      return body;
    } catch (e) {if (e.name === "AbortError") throw new Error("请求超时，发送结果可能尚未确认。不会自动重发，请稍后手动重试。"); throw e;}
    finally {clearTimeout(timer);}
  }
  for (const name of ["username", "password"]) form.elements[name].addEventListener("input", () => {generation++; challenge=""; form.elements.code.value=""; update();});
  form.querySelector("[data-admin-show]").addEventListener("click", event => {
    const shown = form.elements.password.type === "password"; form.elements.password.type = shown ? "text" : "password";
    event.currentTarget.textContent = shown ? "隐藏密码" : "显示密码"; event.currentTarget.setAttribute("aria-pressed", String(shown));
  });
  send.addEventListener("click", async () => {
    if (pending || !ready || Date.now() < retryAt || !form.elements.username.reportValidity() || !form.elements.password.reportValidity()) return;
    pending=true; challenge=""; update(); const version=generation;
    const input={username:form.elements.username.value.trim(),password:form.elements.password.value};
    const current=()=>version===generation && !document.hidden;
    try {
      note.textContent="正在校验密码；通过后将打开人机验证。";
      const start=await request("/api/admin-auth/captcha",input);
      const captcha=await window.AnderCaptcha.verify({challenge:start,current});
      if (!current()) throw new Error("输入或页面状态已变化，请重新操作。");
      retryAt=Date.now()+60000;
      const result=await request("/api/admin-auth/code",{...input,captcha});
      if (!current()) throw new Error("输入已变化，请重新获取验证码。");
      challenge=result.challengeId; note.textContent=`验证码请求已受理，绑定手机 ${result.phoneMasked}。5 分钟内有效。`; form.elements.code.focus();
    } catch(e) {note.textContent=e.message;}
    finally {input.password="";pending=false;update();setTimeout(update,Math.max(0,retryAt-Date.now())+50);}
  });
  form.addEventListener("submit", async event => {
    event.preventDefault(); if (pending || !challenge || !ready || !form.reportValidity()) return;
    pending=true; update(); const version=generation;
    try {
      await request("/api/admin-auth/login",{username:form.elements.username.value.trim(), password:form.elements.password.value,challengeId:challenge,code:form.elements.code.value});
      form.elements.password.value="";form.elements.code.value="";challenge="";
      if (generation!==version || document.hidden) {await fetch("/api/logout",{method:"POST",credentials:"same-origin"}); throw new Error("页面状态已变化，请重新登录。");}
      location.replace(next);
    } catch(e) {note.textContent=e.message;}
    finally {pending=false;update();}
  });
  addEventListener("pagehide",()=>{generation++;challenge="";form.elements.password.value="";form.elements.code.value="";});
  request("/api/admin-auth/session").then(value=>{csrf=value.csrfToken;ready=value.ready;note.textContent=ready ? "请先输入账号和密码，再获取短信验证码。" : "管理员双重验证尚未完成配置。为保护管理权限，旧密码登录入口已关闭。";update();}).catch(e=>{note.textContent=e.message;});
})();
