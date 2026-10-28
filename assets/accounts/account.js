"use strict";
(() => {
  function mount(root = document) {
  const lifecycle = new AbortController(), signal = lifecycle.signal;
  const modelFavorites = window.AnderModelFavorites;
  const center = window.AnderAccountCenter?.create(root, signal), communityCenter = window.AnderCommunityCenter?.create(root, signal);
  const page = root === document ? document.body.dataset.accountPage : "profile";
  const returnTarget = new URLSearchParams(location.search).get("next");
  const libraryReturn=["/question-bank.html","/question-basket.html"].includes(returnTarget)||/^\/question-detail\.html\?id=[1-9]\d{0,15}$/.test(returnTarget||"");
  const questionReturn = libraryReturn || returnTarget === "/#exams" || returnTarget === "/question-downloads" || /^\/practice\.html(?:\?id=[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})?$/i.test(returnTarget || "") ? returnTarget : null;
  const communityReturn = window.AnderCommunityReturn?.(returnTarget);
  const modelReturn = returnTarget === "/#models" ? returnTarget : null;
  const afterLogin = returnTarget === "game-enter" ? "/games/life-ark?enter=1" : returnTarget === "game-trial" ? "/games/life-ark" : returnTarget === "ark-portal" ? "/#ark" : modelReturn || questionReturn || communityReturn || "/account";
  const safeReturnTarget = ["ark-portal", "game-trial", "game-enter"].includes(returnTarget) || modelReturn || questionReturn || communityReturn ? returnTarget : null;
  const centerLogin = () => "/account/login" + (window.AnderCommunityReturn?.(location.pathname + location.search + location.hash) ? "?next=" + encodeURIComponent(location.pathname + location.search + location.hash) : "");
  if (safeReturnTarget) {
    root.querySelectorAll('a[href="/account/login"], a[href="/account/register"], a[href="/account/recover"], a[href="/account/login?password=reset"]').forEach(link => {
      link.href += (link.href.includes("?") ? "&" : "?") + "next=" + encodeURIComponent(returnTarget);
    });
  }
  const notice = root.querySelector("[data-notice]");
  let session, challengeId = "", sentEmail = "", cooldownUntil = 0;
  document.addEventListener("ander-registration-changed", () => {challengeId = ""; sentEmail = ""; const code = root.querySelector("[data-register-form] [name=code]"); if (code) code.value = "";}, {signal});
  let recordKind = "visits", recordOffset = 0, recordGeneration = 0;
  let favoriteBindings = [], recordsReady = false, resumeRecords = false;
  const clearFavoriteBindings = () => {favoriteBindings.forEach(dispose => dispose());favoriteBindings=[];};
  const stopFavorites = modelFavorites?.subscribe(event => {
    if (page !== "profile" || signal.aborted || !recordsReady) return;
    if (event.type === "invalidate") {
      recordGeneration++;recordOffset=0;resumeRecords=true;clearFavoriteBindings();
      const list=root.querySelector("[data-records]");
      if(list){const note=document.createElement("p"),retry=document.createElement("button");
        note.textContent="学习记录已暂时隐藏，正在重新核对当前登录状态。";
        retry.type="button";retry.className="secondary";retry.textContent="重新加载学习记录";
        retry.addEventListener("click",()=>{resumeRecords=false;records().catch(error=>show(error.message,true));});
        list.replaceChildren(note,retry);}
      const count=root.querySelector("[data-record-count]");if(count)count.textContent="— 条";
    }
    if (event.type === "session" && resumeRecords) {
      resumeRecords=false;
      if(event.state.authenticated && event.state.contextRevision!==session?.contextRevision) {location.reload();return;}
      if(event.state.authenticated) records().catch(error=>show(error.message,true));
      else location.assign(centerLogin());
    }
  });
  signal.addEventListener("abort",()=>{clearFavoriteBindings();stopFavorites?.();},{once:true});
  let sessionChannel;
  try {
    sessionChannel = new BroadcastChannel("ander-account-session");
    signal.addEventListener("abort",()=>sessionChannel.close(),{once:true});
    sessionChannel.onmessage = () => window.dispatchEvent(new Event("focus"));
  } catch { /* Focus/pageshow still recheck when this API is unavailable. */ }
  window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); }, {signal});
  let checkingSession = false;
  window.addEventListener("focus", async () => {
    if (!session || checkingSession) return;
    checkingSession = true;
    try {
      const latest = await request("/api/account/session");
      if (latest.csrfToken !== session.csrfToken || latest.authenticated !== session.authenticated || latest.user?.displayName !== session.user?.displayName) {
        if (page === "profile") root.querySelector("[data-records]")?.replaceChildren();
        location.reload();
      }
    } catch { /* No writes on focus; normal operations still fail closed server-side. */ }
    finally { checkingSession = false; }
  }, {signal});
  const show = (message, error = false) => {
    if (signal.aborted) return;
    notice.textContent = message;
    notice.classList.toggle("error", error);
    notice.hidden = false;
  };
  const formValue = (form) => Object.fromEntries(new FormData(form));
  async function request(url, body, {keepalive = false} = {}) {
    const response = await fetch(url, {signal, credentials: "same-origin", cache: "no-store", method: body ? "POST" : "GET",
      headers: body ? {"content-type": "application/json", "x-ander-csrf": session?.csrfToken || ""} : {},
      ...(body ? {body: JSON.stringify(body)} : {}), keepalive});
    let value;
    try { value = await response.json(); } catch { throw new Error("服务暂时不可用，请稍后重试。"); }
    if (signal.aborted) throw new DOMException("Page closed", "AbortError");
    if (!response.ok || value.ok === false) {
      if (response.status === 401 && page === "profile") { communityCenter?.clear(); location.assign(centerLogin()); }
      const error = new Error(value.message || "暂时无法完成操作，请稍后再试。");
      error.code = value.code;
      error.retryAfter = Number(response.headers.get("retry-after") || 0);
      if (value.code === "RATE_LIMITED" && value.smsRateLimit && ["step", "grant", "phone", "cooldown", "ip", "global"].includes(value.smsRateLimit.kind) &&
        ["global", "recipient"].includes(value.smsRateLimit.scope) && typeof value.smsRateLimit.canRetry === "boolean") error.smsRateLimit = value.smsRateLimit;
      throw error;
    }
    if (body && ["/api/account/login", "/api/account/register", "/api/account/logout", "/api/account/password", "/api/account/reset-password", "/api/account/profile", "/api/account/phone/login", "/api/account/phone/register", "/api/account/phone/reset", "/api/account/phone/bind", "/api/account/email/change"].includes(url)) {
      // Signal only; never put identity, credentials or session tokens in a browser channel.
      sessionChannel?.postMessage("changed");
      if (url === "/api/account/logout") {
        // Stop this private page's late record/community/session callbacks
        // before the shared controller observes the now-anonymous session.
        // Otherwise an old panel's resume can override the explicit logout URL.
        communityCenter?.clear();recordGeneration++;lifecycle.abort();session=null;
      }
      window.dispatchEvent(new Event("ander:account-changed"));
    }
    return value;
  }
  function bindForm(selector, action) {
    const form = root.querySelector(selector);
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = formValue(form);
      const fieldset = form.querySelector("fieldset");
      fieldset.disabled = true;
      try { await action(values, form); } catch (error) { show(error.message, true); }
      finally { fieldset.disabled = false; }
    });
  }
  function profile(user) {
    root.querySelector("[data-display-name]").textContent = user.displayName;
    root.querySelector("[data-email]").textContent = user.emailMasked;
    if (root.querySelector("[data-verified]")) root.querySelector("[data-verified]").textContent = user.emailVerified ? "已验证" : "未验证";
    if (root.querySelector("[data-phone]")) root.querySelector("[data-phone]").textContent = user.phoneMasked;
    const name = root.querySelector("[data-nickname-text]");
    if (name) { name.textContent = user.displayName; root.querySelector("[data-nickname-view]").hidden = false; root.querySelector("[data-profile-form]").hidden = true; }
    root.querySelector("[data-profile-form] [name=displayName]").value = name ? "" : user.displayName;
    if (session) session.user = user;
  }
  function recordItem(item) {
    const row = document.createElement("article");
    row.className = "record-item";
    const content = document.createElement("div");
    const heading = document.createElement("h3");
    if (item.url) {
      const link = document.createElement("a");
      link.href = item.url + "?return=" + encodeURIComponent(location.origin + "/account");
      link.textContent = item.title;
      link.addEventListener("click", () => { request("/api/account/visits", {modelId: item.modelId}, {keepalive: true}).catch(() => {}); });
      heading.append(link);
    } else heading.textContent = item.title;
    const info = document.createElement("p");
    const date = new Date(item.lastVisitedAt || item.createdAt).toLocaleDateString("zh-CN");
    info.textContent = recordKind === "visits" ? `${date} · 浏览 ${item.visitCount} 次` : `${date} 收藏`;
    content.append(heading, info);
    const actions = document.createElement("div");
    actions.className = "record-actions";
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.textContent = "正在核对…";favorite.disabled = true;favorite.setAttribute("aria-pressed","false");
    if(modelFavorites) favoriteBindings.push(modelFavorites.bindButton(favorite,{modelId:item.modelId,title:item.title,
      onChange:()=>records().catch(error=>show(error.message,true)),onError:error=>show(error.message,true)}));
    else favorite.textContent="收藏暂不可用";
    actions.append(favorite);
    if (recordKind === "visits") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.remove = "true";
      remove.textContent = "移除";
      remove.setAttribute("aria-label", `移除${item.title}的浏览记录`);
      remove.addEventListener("click", async () => {
        remove.disabled = true;
        try { await request("/api/account/visits", {modelId: item.modelId, remove: true}); await records(); }
        catch (error) { show(error.message, true); remove.disabled = false; }
      });
      actions.append(remove);
    }
    row.append(content, actions);
    return row;
  }
  async function records(append = false) {
    const generation = ++recordGeneration;
    const context=await modelFavorites?.refreshSession();
    if(signal.aborted || generation!==recordGeneration)return;
    if(modelFavorites && !context.authenticated){location.assign(centerLogin());return;}
    if(modelFavorites && context.contextRevision!==session?.contextRevision){location.reload();return;}
    if (!append) recordOffset = 0;
    const more = root.querySelector("[data-load-more]");
    more.disabled = true;
    const result = await request(`/api/account/records?kind=${recordKind}&limit=20&offset=${recordOffset}`);
    const current=await modelFavorites?.refreshSession();
    if (signal.aborted || generation !== recordGeneration || modelFavorites && context.contextRevision!==current.contextRevision) return;
    const list = root.querySelector("[data-records]");
    if (!append) {clearFavoriteBindings();list.replaceChildren();}
    result.items.forEach((item) => list.append(recordItem(item)));
    recordOffset += result.items.length;
    if (!result.total) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      const title = document.createElement("strong");
      title.textContent = recordKind === "visits" ? "还没有浏览足迹" : "把喜欢的模型收好";
      const text = document.createElement("p");
      text.textContent = recordKind === "visits" ? "从首页打开一个模型，这里就会留下记录。" : "在模型目录或模型页面点击“收藏”，即可在这里继续探索。";
      const link = document.createElement("a");
      link.href = "/#models";
      link.textContent = "去探索模型";
      empty.append(title, text, link);
      list.append(empty);
    }
    root.querySelector("[data-record-count]").textContent = `${result.total} 条`;
    more.hidden = recordOffset >= result.total;
    more.disabled = false;
  }
  async function initialize() {
    window.AnderAccountBootstrap = request("/api/account/session");
    session = await window.AnderAccountBootstrap;
    if(signal.aborted)return;
    window.AnderAccountWidget?.setSession(session);window.AnderCommunityFrame?.setAccount(session);
    if (!session.enabled) { show("账户功能尚未开启，请稍后再试。"); return; }
    if (page === "profile" && !session.authenticated) { location.replace(centerLogin()); return; }
    if (!["profile", "recover"].includes(page) && session.authenticated) { location.replace(afterLogin); return; }
    const phoneUi = window.AnderPhoneAccount?.initialize({root, signal, session, request, show, afterLogin, returnTarget: safeReturnTarget, bindForm});
    root.querySelectorAll("[data-phone-preview]").forEach(el=>{if(el.firstChild?.nodeType===3)el.firstChild.textContent="本地模拟验收 · 不发送真实短信或邮件";});
    if (page === "register") window.AnderRegistration?.initialize(session);
    if (page === "register" && !session.registrationOpen) { if (!phoneUi?.active) show("邮箱注册暂未开放。已注册用户仍可登录，账户问题请通过联系页面反馈。"); return; }
    if (page === "register" && session.deliveryMode === "allowlist" && !phoneUi?.active) show("当前为指定邮箱邀请试用，不面向所有邮箱开放注册。申请加入请联系 lil327@126.com。");
    if (page === "recover" && !session.recoveryOpen) { if (!phoneUi?.active) show("邮箱找回密码暂不可用，原密码没有改变。需要帮助请联系 lil327@126.com。"); return; }
    if (page === "recover" && session.deliveryMode === "allowlist" && !phoneUi?.active) show("当前为邀请试用，仅对已加入名单的邮箱开放找回密码。");
    root.querySelectorAll("[data-fields]").forEach((field) => { field.disabled = false; });
    root.querySelectorAll("[data-show-password]").forEach((button) => button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "显示" : "隐藏";
      button.setAttribute("aria-label", input.type === "password" ? "显示密码" : "隐藏密码");
    }));
    bindForm("[data-login-form]", async (values) => { await request("/api/account/login", values); location.assign(afterLogin); });
    bindForm("[data-register-form]", async (values) => {
      if (!challengeId || values.email.trim().toLowerCase() !== sentEmail) throw new Error("请先为当前邮箱获取验证码。");
      await request("/api/account/register", {...values, agree: values.agree === "on", challengeId, ...window.AnderRegistration?.read()});
      location.assign(afterLogin);
    });
    bindForm("[data-recover-form]", async (values, form) => {
      if (!challengeId || values.email.trim().toLowerCase() !== sentEmail) throw new Error("请先为当前邮箱获取找回密码验证码。");
      const result = await request("/api/account/reset-password", {...values, challengeId});
      form.reset(); form.hidden = true; challengeId = ""; sentEmail = "";
      show(result.notificationAccepted ? "密码已重置，安全通知发送请求已被接受。请使用新密码登录。" : "密码已重置，但安全通知邮件暂未确认发送成功。重置已生效，请使用新密码登录。", false);
      root.querySelector("[data-recovery-success]").hidden = false;
      root.querySelector(".form-switch").hidden = true;
      root.querySelector("[data-recovery-success] a").focus();
    });
    if (["register", "recover"].includes(page)) {
      const recovering = page === "recover";
      const form = root.querySelector(recovering ? "[data-recover-form]" : "[data-register-form]");
      const button = root.querySelector("[data-send-code]");
      const email = form.elements.email;
      // Keep the input's accessible name stable while the adjacent button counts down.
      form.elements.code.setAttribute("aria-label", recovering ? "找回密码验证码" : "邮箱验证码");
      email.addEventListener("input", () => { challengeId = ""; sentEmail = ""; });
      button.addEventListener("click", async () => {
        if (!email.reportValidity() || (!recovering && !await window.AnderRegistration.ensureAgreement(form))) return;
        button.disabled = true;
        const requestedEmail = email.value.trim().toLowerCase();
        try {
          const registration = recovering ? {} : window.AnderRegistration?.read() || {};
          let captcha;
          if (session.emailAuth?.captchaRequired) {
            if (!window.AnderCaptcha) throw new Error("人机验证尚未加载，未发送邮件。请刷新后重试。");
            try {
              captcha = await window.AnderCaptcha.verify({request, channel: "email", purpose: recovering ? "reset" : "register", email: requestedEmail, agree: true, registration,
                current: () => email.value.trim().toLowerCase() === requestedEmail && (recovering || form.elements.agree.checked && JSON.stringify(window.AnderRegistration?.read() || {}) === JSON.stringify(registration))});
            } catch (error) { error.message = error.message.replaceAll("短信", "邮件"); throw error; }
          }
          const result = await request(recovering ? "/api/account/reset-code" : "/api/account/register-code", {email: requestedEmail, ...(recovering ? {} : {agree: true, ...registration}), ...(captcha ? {captcha} : {})});
          if (email.value.trim().toLowerCase() === requestedEmail) { challengeId = result.challengeId; sentEmail = requestedEmail; }
          cooldownUntil = Date.now() + result.retryAfter * 1000;
          show(result.message);
        } catch (error) { show(error.message, true); cooldownUntil = Date.now() + (error.retryAfter || 0) * 1000; }
        finally { if (cooldownUntil <= Date.now()) button.disabled = false; }
      });
      setInterval(() => {
        if (!cooldownUntil) return;
        const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        button.textContent = remaining ? `${remaining} 秒后重发` : "重新获取";
        button.disabled = remaining > 0;
        if (!remaining) cooldownUntil = 0;
      }, 500);
    }
    if (page === "profile") {
      profile(session.user);
      window.AnderEmailChange?.initialize({root, signal, session,request,show,bindForm});
      root.querySelector("[data-nickname-edit]")?.addEventListener("click", () => {
        root.querySelector("[data-nickname-view]").hidden = true;
        const form = root.querySelector("[data-profile-form]"); form.hidden = false; form.elements.displayName.value = ""; form.elements.displayName.focus();
      });
      root.querySelector("[data-nickname-cancel]")?.addEventListener("click", () => profile(session.user));
      const entitlementLink = root.querySelector("[data-entitlements-link]");
      if (entitlementLink) entitlementLink.hidden = !session.entitlementsOpen;
      if (session.gameTrialOpen && !center) {
        const area = root.querySelector(".future-note"), link = document.createElement("a"), note = document.createElement("p");
        link.className = "quiet-link"; link.href = "/games/life-ark"; link.textContent = "生命方舟 · 兑换试玩码 / 继续游戏";
        note.textContent = "当前完整生命物质体验已接入。游戏进度独立保存，不影响模型收藏和浏览记录。";
        area?.replaceChildren(link, note);
      }
      const logout = root.querySelector("[data-logout]");
      logout.disabled = false;
      logout.addEventListener("click", async () => {
        logout.disabled = true;
        try { await request("/api/account/logout", {}); communityCenter?.clear(); location.assign("/account/login"); }
        catch (error) { show(error.message, true); logout.disabled = false; }
      });
      bindForm("[data-profile-form]", async (values) => { const result = await request("/api/account/profile", values); profile(result.user); show("昵称已保存。"); });
      bindForm("[data-password-form]", async (values, form) => {
        await request("/api/account/password", values); form.reset(); location.assign("/account/login?password=updated");
      });
      root.querySelectorAll("[data-record-tab]").forEach((button) => button.addEventListener("click", () => {
        recordKind = button.dataset.recordTab;
        root.querySelectorAll("[data-record-tab]").forEach((tab) => tab.setAttribute("aria-pressed", String(tab === button)));
        records().catch((error) => show(error.message, true));
      }));
      root.querySelector("[data-load-more]").addEventListener("click", () => records(true).catch((error) => show(error.message, true)));
      if (center) await center.initialize({session, request, show, communityCenter});
      await records();
      recordsReady=true;
    }
    if (page === "login" && new URLSearchParams(location.search).get("password") === "updated") show("密码已修改，所有设备已退出。请使用新密码登录。");
    if (page === "login" && new URLSearchParams(location.search).get("password") === "reset") show("密码重置已完成。请使用新密码登录，原密码不再有效。");
    if (page === "login" && new URLSearchParams(location.search).get("contact") === "updated") show("手机号已更新，原账户和学习记录保留。所有设备已退出，请重新登录。");
    if (page === "login" && new URLSearchParams(location.search).get("email") === "updated") show("登录邮箱已更新，原账户和学习记录保留。所有设备已退出，请用新邮箱或原绑定手机重新登录。");
    if (page === "login" && new URLSearchParams(location.search).get("notice") === "failed") show("账户变更已生效，但站外安全提醒未发送或未确认成功。请重新登录，原有学习记录保留。", true);
    if (page === "login" && new URLSearchParams(location.search).get("notice") === "in-app") show("账户变更已生效。未绑定验证邮箱，本次只有站内安全记录，不会发送安全邮件。请重新登录，原有学习记录保留。");
    if (page === "login" && new URLSearchParams(location.search).get("notice") === "accepted") show("账户变更已生效，安全邮件请求已受理，尚未确认送达。请重新登录，原有学习记录保留。");
  }
  const ready=initialize().catch((error) => {if(!signal.aborted)show(error.message || "暂时无法连接账户服务，请稍后刷新。", true);});
  return {ready, dispose(){lifecycle.abort();recordGeneration++;session=null;}, refreshTab(){center?.tab(location.hash.slice(1));if(location.hash==="#community")return communityCenter?.load();}};
  }
  window.AnderAccountPage={mount};
  if(window.AnderSiteNavigation){let page;
    window.AnderSiteNavigation.register("account",{
      async activate(root){if(!page){page=mount(root);await page.ready;}else await page.refreshTab();document.title="我的学习中心 · 安德生物工作室";},
      deactivate(){page?.dispose();page=null;window.AnderCommunityWorkflow?.reset();},
      confirmLeave(){return !window.AnderCommunityWorkflow || window.AnderCommunityWorkflow.confirmLeave();}
    });
  }else mount();
})();
