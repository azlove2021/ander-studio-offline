/* Shared website controller. Identity/CSRF stay in this closure, never in
   storage, a channel payload, a model callback, or a model release bundle. */
(function (scope) {
  "use strict";
  function create({fetch: fetcher = scope.fetch.bind(scope), window: win = scope,
    document: doc = scope.document, location = scope.location, BroadcastChannel: Channel = scope.BroadcastChannel} = {}) {
    const states = new Map(), lanes = new Map(), requests = new Set(), listeners = new Set();
    let epoch = 0, session = null, sessionTask = null, disposed = false;
    const validId = id => typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,99}$/.test(id);
    const token = value => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
    const fault = (code, message) => Object.assign(new Error(message), {code});
    const stale = () => fault("FAVORITE_CONTEXT_CHANGED", "登录状态已变化，请重新核对收藏。");
    const emit = event => {for (const listener of [...listeners]) {try {listener(event);} catch { /* One view cannot disrupt another. */ }}};
    const publicSession = () => ({authenticated:session?.authenticated === true, contextRevision:session?.contextRevision || null,
      status:session ? (session.authenticated ? "ready" : "guest") : "unavailable"});
    function check(run) {if (disposed || epoch !== run) throw stale();}
    function invalidate() {
      epoch++;session=null;sessionTask=null;states.clear();
      for (const controller of requests) controller.abort();
      emit({type:"invalidate"});
    }
    async function request(url, body, run) {
      check(run);
      const controller = new AbortController();requests.add(controller);
      const timeout = setTimeout(()=>controller.abort(),8000);
      try {
        const response = await fetcher(url,{signal:controller.signal,credentials:"same-origin",cache:"no-store",
          method:body ? "POST" : "GET",headers:body ? {"content-type":"application/json","x-ander-csrf":session?.csrfToken || ""} : {},
          ...(body ? {body:JSON.stringify(body)} : {})});
        const value = await response.json();check(run);
        if (!response.ok || value?.ok !== true) {
          const error = fault(value?.code || "FAVORITE_UNAVAILABLE", "暂时无法核对收藏，请稍后重试。");
          error.status=response.status;throw error;
        }
        return value;
      } catch(error) {
        check(run);
        if(error?.code)throw error;
        throw fault("FAVORITE_UNAVAILABLE","暂时无法核对收藏，请稍后重试。");
      } finally {clearTimeout(timeout);requests.delete(controller);}
    }
    async function refreshSession() {
      if (disposed) throw stale();
      if (sessionTask) return sessionTask;
      const run=epoch;
      const task=(async()=>{
        try {
          const value=await request("/api/account/session",null,run);check(run);
          if (value.enabled !== true || typeof value.authenticated !== "boolean" || !token(value.csrfToken) ||
            (value.authenticated ? !token(value.contextRevision) : value.contextRevision !== null)) {
            throw fault("FAVORITE_UNAVAILABLE","收藏服务尚未就绪，请稍后刷新。");
          }
          if (session && session.contextRevision !== value.contextRevision) invalidate();
          session={authenticated:value.authenticated,contextRevision:value.contextRevision,csrfToken:value.csrfToken};
          emit({type:"session",state:publicSession()});return publicSession();
        } catch (error) {
          if (run === epoch) invalidate();
          throw error;
        }
      })();
      sessionTask=task;
      try {return await task;} finally {if(sessionTask===task)sessionTask=null;}
    }
    const ensureSession = () => session ? Promise.resolve(publicSession()) : refreshSession();
    function serial(modelId, action) {
      if (!validId(modelId)) return Promise.reject(fault("INVALID_MODEL","模型编号不正确。"));
      const run=epoch, prior=lanes.get(modelId) || Promise.resolve();
      const operation=prior.catch(()=>{}).then(()=>{check(run);return action(run);});
      lanes.set(modelId,operation);
      operation.finally(()=>{if(lanes.get(modelId)===operation)lanes.delete(modelId);}).catch(()=>{});
      return operation;
    }
    function accept(modelId, value, run) {
      check(run);
      if (token(value.contextRevision) && session?.authenticated && value.contextRevision !== session.contextRevision) {
        invalidate();throw stale();
      }
      if (value.modelId !== modelId || typeof value.favorite !== "boolean" || typeof value.available !== "boolean" ||
        !session?.authenticated || value.contextRevision !== session.contextRevision) {
        throw fault("FAVORITE_RESPONSE_INVALID","收藏结果尚未核对，请重试查询。");
      }
      const state=Object.freeze({modelId,favorite:value.favorite,available:value.available,contextRevision:value.contextRevision,status:"ready"});
      states.set(modelId,state);emit({type:"state",modelId,state});return state;
    }
    async function read(modelId,run) {return accept(modelId,await request(`/api/account/favorites?modelId=${encodeURIComponent(modelId)}`,null,run),run);}
    function get(modelId) {
      return serial(modelId,async run=>{
        await ensureSession();check(run);
        if (!session.authenticated) return Object.freeze({modelId,favorite:null,available:null,contextRevision:null,status:"guest"});
        try {return await read(modelId,run);} catch(error) {
          if(run===epoch) {states.delete(modelId);emit({type:"state",modelId,state:null});}
          if(run===epoch && [401,409].includes(error.status)) invalidate();
          throw error;
        }
      });
    }
    function set(modelId,desired,{contextRevision}={}) {
      if(typeof desired!=="boolean" || !token(contextRevision)) return Promise.reject(stale());
      return serial(modelId,async run=>{
        // Recheck cookies before each user-intended write, even without a
        // BroadcastChannel event. No session refresh failure can permit POST.
        await refreshSession();check(run);
        if(!session.authenticated || session.contextRevision!==contextRevision) throw stale();
        try {
          const result=accept(modelId,await request("/api/account/favorites",{modelId,desired,contextRevision},run),run);
          changes?.postMessage("changed");return result;
        } catch(error) {
          check(run);
          if([401,403,409].includes(error.status)) {invalidate();refreshSession().catch(()=>{});throw stale();}
          if(error.status && error.status<500) throw error;
          // A failed/invalid/unknown POST may already have committed. The
          // recovery path is GET only, never an automatic repeated POST.
          states.delete(modelId);emit({type:"state",modelId,state:null});
          try {
            await refreshSession();check(run);
            if(!session.authenticated || session.contextRevision!==contextRevision) throw stale();
            const actual=await read(modelId,run);changes?.postMessage("changed");
            return Object.freeze({...actual,confirmedByRead:true});
          } catch(readError) {
            check(run);states.delete(modelId);emit({type:"state",modelId,state:null});
            throw fault("FAVORITE_UNKNOWN","提交结果尚未确认，请点击按钮重新查询；不会自动重复提交。");
          }
        }
      });
    }
    function subscribe(listener) {listeners.add(listener);return()=>listeners.delete(listener);}
    function requestLogin() {location.assign("/account/login?next="+encodeURIComponent("/#models"));}
    function bindButton(button,{modelId,title=modelId,onChange=()=>{},onError=()=>{}}) {
      let current=null, alive=true, generation=0, loading=false;
      function render(value, message) {
        if(!alive)return;current=value;
        const ready=value?.status==="ready", guest=value?.status==="guest", selected=ready&&value.favorite;
        button.textContent=loading ? "正在核对…" : guest ? "登录收藏" : ready ? selected ? "已收藏 ✓" : "收藏" : "重试收藏";
        button.setAttribute("aria-pressed",selected ? "true" : "false");
        button.setAttribute("aria-label",`${selected ? "取消收藏" : guest ? "登录后收藏" : "收藏"}${title}`);
        button.disabled=loading || ready && !value.available && !value.favorite;
        button.title=message || (ready && !value.available ? "模型暂不可用，仍可取消已有收藏" : "");
      }
      async function load() {
        if(!alive || loading || doc?.hidden)return;
        const run=generation;loading=true;render(null);
        try {const value=await get(modelId);if(run===generation)render(value);}
        catch(error){if(run===generation)render(null,error.message);}
        finally {if(run===generation){loading=false;render(current,button.title);}}
      }
      const unsubscribe=subscribe(event=>{
        if(event.type==="invalidate"){generation++;loading=false;render(null);}
        if(event.type==="session" && event.state.status==="guest"){loading=false;render({status:"guest"});}
        if(event.type==="session" && event.state.status==="ready" && !current && !loading)load();
        if(event.type==="state" && event.modelId===modelId)render(event.state);
      });
      const click=async()=>{
        if(loading)return;
        if(current?.status==="guest"){requestLogin();return;}
        if(current?.status!=="ready"){await load();return;}
        const run=generation, before=current;loading=true;render(before);
        try {const value=await set(modelId,!before.favorite,{contextRevision:before.contextRevision});
          if(run===generation){render(value);onChange(value);}}
        catch(error){if(run===generation){render(null,error.message);onError(error);}}
        finally{if(run===generation){loading=false;render(current,button.title);}}
      };
      button.addEventListener("click",click);load();
      return()=>{alive=false;generation++;unsubscribe();button.removeEventListener("click",click);};
    }
    function resync() {invalidate();if(!doc?.hidden)refreshSession().catch(()=>{});}
    const cleanup=[];
    function listen(target,event,action){target?.addEventListener(event,action);cleanup.push(()=>target?.removeEventListener(event,action));}
    // A fresh document already starts with no identity and its shell reads
    // immediately. The initial pageshow must not abort that first GET and turn
    // a healthy load into an unknown-result warning. BFCache still revalidates.
    listen(win,"pageshow",event=>{if(event.persisted!==false)resync();});listen(win,"focus",resync);
    listen(doc,"visibilitychange",resync);listen(win,"ander:account-changed",resync);
    let accountChanges,changes;
    if(Channel)try {
      accountChanges=new Channel("ander-account-session");changes=new Channel("ander-model-favorites");
      accountChanges.onmessage=resync;changes.onmessage=resync;
    }catch{/* Events and pre-write session GET are the fallback. */}
    return Object.freeze({get,set,subscribe,refreshSession,invalidate,requestLogin,bindButton,
      dispose(){disposed=true;invalidate();cleanup.forEach(fn=>fn());accountChanges?.close();changes?.close();listeners.clear();}});
  }
  if(typeof module==="object" && module.exports)module.exports={create};
  else if(!scope.AnderModelFavorites)scope.AnderModelFavorites=create();
})(typeof window!=="undefined" ? window : globalThis);
