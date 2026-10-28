/* Website response adapter only. Never copied into immutable model packages. */
(function (scope) {
  "use strict";
  const entry = /^\/model-releases\/models\/([a-z0-9][a-z0-9-]{0,99})\/(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\/index\.html$/;
  const revision = value => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
  const error = code => Object.assign(new Error(code === "AUTH_CHANGED" ? "登录状态已变化，请重新读取收藏。" : "收藏服务暂不可用，请重新读取。"), {code});
  function returnTarget(location) {
    const fallback=new URL('/#models',location.origin).href;
    try {
      const values=new URLSearchParams(location.search||'').getAll('return');
      if(values.length!==1)return fallback;
      const url=new URL(values[0],location.origin);
      if(url.origin===location.origin&&!url.username&&!url.password&&url.pathname==='/account'&&['','#learning'].includes(url.hash))return new URL('/account#learning',location.origin).href;
      if(url.origin!==location.origin||url.username||url.password||!['/','/index.html'].includes(url.pathname)||url.hash!=='#models')return fallback;
      const books=url.searchParams.getAll('book');
      if(books.length>1||books.length===1&&!/^(required-[12]|optional-[123])$/.test(books[0]))return fallback;
      // Reconstruct, never forward arbitrary query strings or return tokens.
      const safe=new URL('/index.html',location.origin);if(books.length)safe.searchParams.set('book',books[0]);safe.hash='models';return safe.href;
    }catch{return fallback;}
  }

  function create({modelId, client = scope.AnderModelFavorites, window: win = scope,
    pollMs = 1000, loginTimeoutMs = 120000} = {}) {
    const match = entry.exec(win.location?.pathname || "");
    let supported = !!match && match[1] === modelId && /^https?:$/.test(win.location?.protocol || "") && !!client;
    try { if (win.top && win.top.location.origin !== win.location.origin) supported = false; } catch { supported = false; }
    const listeners = new Set();
    let disposed = false, known = null, context, login = null, needsRefresh = false, activeReads = 0;
    const unavailable = () => ({status:"unavailable",favorite:null,contextRevision:null});
    const notify = () => {for (const callback of [...listeners]) {try {callback();} catch { /* Isolated views. */ }}};
    const observe = next => {
      const changed = context !== undefined && context !== next;
      context = next;
      if (changed) {known = null;notify();}
    };
    const unsubscribe = supported ? client.subscribe(event => {
      if (disposed) return;
      // get/set emit their own state events. Forwarding them makes the model
      // call get again indefinitely and can discard an in-flight set result.
      if (event.type === "state") return;
      if (event.type === "invalidate") {
        const wasKnown = context !== undefined;
        context = undefined;known = null;
        if (wasKnown) notify(); // Failure invalidations cannot form a retry loop.
      } else if (event.type === "session") {
        const value = event.state;
        if (value?.status === "guest" && value.contextRevision === null) observe(null);
        else if (value?.status === "ready" && revision(value.contextRevision)) observe(value.contextRevision);
        else return;
        // A hidden or failed read must wake on a later successful visible
        // session refresh, even when invalidate already cleared its context.
        if (needsRefresh && !win.document?.hidden && activeReads === 0) {needsRefresh=false;notify();}
      }
    }) : () => {};

    function accept(value) {
      if (value?.modelId !== modelId || value.status !== "ready" || typeof value.favorite !== "boolean" ||
        typeof value.available !== "boolean" || !revision(value.contextRevision)) throw error("UNKNOWN");
      observe(value.contextRevision);known = value;
      return {status:!value.available && !value.favorite ? "unavailable" : "ready",
        favorite:value.favorite,contextRevision:value.contextRevision};
    }
    async function getFavorite() {
      if (disposed || !supported) return unavailable();
      if (win.document?.hidden) {known=null;needsRefresh=true;return unavailable();}
      activeReads++;
      try {
        const value = await client.get(modelId);
        if (disposed) throw error("UNKNOWN");
        if (win.document?.hidden) {known=null;needsRefresh=true;return unavailable();}
        needsRefresh=false;
        if (value?.modelId === modelId && value.status === "guest" && value.favorite === null && value.contextRevision === null) {
          observe(null);known = null;return {status:"anonymous",favorite:null,contextRevision:null};
        }
        return accept(value);
      } catch (failure) {
        known = null;needsRefresh=true;
        if (failure?.code === "FAVORITE_CONTEXT_CHANGED") throw error("AUTH_CHANGED");
        throw error("UNKNOWN");
      } finally {activeReads--;}
    }
    async function setFavorite(desired, {contextRevision} = {}) {
      if (disposed || !supported) throw error("REJECTED");
      if (win.document?.hidden) {known=null;needsRefresh=true;throw error("AUTH_CHANGED");}
      if (typeof desired !== "boolean" || !known || !revision(contextRevision) || known.contextRevision !== contextRevision) throw error("AUTH_CHANGED");
      if (desired && !known.available) throw error("REJECTED");
      try {
        const value = await client.set(modelId,desired,{contextRevision});
        if (disposed || value?.contextRevision !== contextRevision) throw error("AUTH_CHANGED");
        // The shell treats every resolved set as success; never resolve an
        // unknown, guest, rejected, or malformed result into that success path.
        const result = accept(value);
        if (result.status !== "ready") throw error("UNKNOWN");
        return result;
      } catch (failure) {
        known = null;
        if (failure?.code === "AUTH_CHANGED" || failure?.code === "FAVORITE_CONTEXT_CHANGED") throw error("AUTH_CHANGED");
        if (failure?.status && failure.status >= 400 && failure.status < 500 && ![401,403,409].includes(failure.status)) throw error("REJECTED");
        throw error("UNKNOWN");
      }
    }
    function requestLogin() {
      if (disposed || !supported) return Promise.reject(error("REJECTED"));
      if (login) return login.promise;
      // Open synchronously from the model's click gesture, then remove opener.
      // `noopener` as a window.open feature returns null even when it succeeds,
      // making a blocked-popup diagnosis impossible. No model-page navigation.
      let popup;
      try {
        popup = win.open("about:blank", "_blank");
        if (!popup) throw error("LOGIN_POPUP_BLOCKED");
        popup.opener = null;
        popup.location.replace(new URL("/account/login?next=%2Faccount",win.location.origin).href);
      } catch (failure) {
        try {popup?.close();} catch {}
        return Promise.reject(error(failure?.code === "LOGIN_POPUP_BLOCKED" ? "LOGIN_POPUP_BLOCKED" : "REJECTED"));
      }
      let finish;
      const promise = new Promise((resolve,reject) => {finish = (failure,value) => {
        if (!login) return;
        clearTimeout(login.timer);login = null;
        if (failure) reject(failure);else resolve(value);
      };});
      const started = Date.now();
      login = {promise,timer:null,cancel:()=>finish(error("LOGIN_CANCELLED"))};
      async function poll() {
        if (!login || disposed) return;
        try {
          const value = await client.refreshSession();
          if (!login || disposed) return;
          if (value?.authenticated === true && value.status === "ready" && revision(value.contextRevision)) {
            finish(null,{status:"ready",contextRevision:value.contextRevision});return;
          }
        } catch { /* No write or auto-favorite; a later login poll may succeed. */ }
        if (!login) return;
        if (popup.closed || Date.now() - started >= loginTimeoutMs) {finish(error("LOGIN_CANCELLED"));return;}
        login.timer = setTimeout(poll,pollMs);
      }
      login.timer = setTimeout(poll,pollMs);
      return promise;
    }
    function returnClick(event) {
      // Only the two frozen shell return controls, only a direct page. Frames
      // retain their existing parent navigation/protocol handling.
      if(disposed||!supported||win.top&&win.top!==win||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      if(!event.target?.closest?.('.independent-model-back, .shell-compact-back'))return;
      event.preventDefault();event.stopImmediatePropagation();win.location.assign(returnTarget(win.location));
    }
    win.document?.addEventListener?.('click',returnClick,true);
    function dispose() {if(disposed)return;disposed=true;known=null;login?.cancel();unsubscribe();listeners.clear();win.removeEventListener?.("pagehide",pagehide);win.document?.removeEventListener?.('click',returnClick,true);}
    function pagehide(event) {
      // BFCache restores this same host; the client's pageshow resync invalidates
      // identity. Do not leave a permanently disposed host in a restored model.
      if (event?.persisted) {known=null;needsRefresh=true;login?.cancel();return;}
      dispose();
    }
    win.addEventListener?.("pagehide",pagehide);
    return Object.freeze({modelId,getFavorite,setFavorite,requestLogin,subscribe(callback){listeners.add(callback);return()=>listeners.delete(callback);},dispose});
  }
  if (typeof module === "object" && module.exports) module.exports = {create,returnTarget};
  else if (!scope.AnderModelHost) {
    const modelId = scope.document?.currentScript?.getAttribute("data-model-id");
    if (modelId) scope.AnderModelHost = create({modelId});
  }
})(typeof window !== "undefined" ? window : globalThis);
