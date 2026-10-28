"use strict";
(() => {
  const el = (tag, text, cls) => {const node = document.createElement(tag); if (text != null) node.textContent = text; if (cls) node.className = cls; return node;};
  const link = (text, href, cls = "lc-link") => {const node = el("a", text, cls); node.href = href; return node;};
  const date = value => new Date(value).toLocaleDateString("zh-CN", {year: "numeric", month: "long", day: "numeric"});
  const href = item => "/community/" + (item.kind === "resource" ? "resources/" : "discussions/") + encodeURIComponent(item.id);
  async function request(url, {signal, ...options} = {}) {
    const response = await fetch(url, {...options, credentials: "same-origin", cache: "no-store", signal});
    let data;
    try {data = await response.json();} catch {throw new Error("暂时无法连接社区，请稍后重试。");}
    if (!response.ok || data.ok === false) {const error = new Error(data.message || "页面暂不可用。"); error.status = response.status; error.code=data.code; throw error;}
    return data;
  }
  function heading(title, text) {const h = el("div", null, "lc-heading"); h.append(el("h1", title)); if (text) h.append(el("p", text, "lc-muted")); return h;}
  function empty(title, message) {const block = el("section", null, "lc-empty"); block.append(el("h2", title), el("p", message)); return block;}
  function loginGate(message, target = location.pathname + location.search + location.hash) {
    const block = empty("登录后，继续探索", message);
    block.append(link("登录 / 注册", "/account/login?next=" + encodeURIComponent(window.AnderCommunityReturn?.(target) || "/community"), "lc-button lc-primary"));
    return block;
  }
  function row(item) {
    const article = el("article", null, "lc-item"), symbol = el("div", null, "lc-item-symbol"), content = el("div", null, "lc-item-content");
    if (item.kind === "resource") {symbol.append(el("span", "资料"), el("small", item.subject));}
    else {symbol.classList.add("lc-discussion-avatar"); symbol.textContent = item.author.displayName.slice(0, 1);}
    symbol.setAttribute("aria-hidden", "true");
    const tags = el("div", null, "lc-tags");
    tags.append(el("span", item.subject, "lc-tag"), el("span", item.category, "lc-tag lc-tag-neutral"));
    if (item.featured) tags.append(el("span", "精华", "lc-tag lc-tag-warm"));
    if(item.pinned)tags.append(el("span","置顶","lc-tag"));
    if(item.solved)tags.append(el("span","已解决","lc-tag"));
    if(["assisted","generated"].includes(item.aiDeclaration))tags.append(el("span",item.aiDeclaration==="generated"?"含 AI 生成内容":"AI 辅助整理","lc-tag lc-tag-neutral"));
    const title = el("h3"); title.append(link(item.title, href(item), "lc-title-link"));
    const meta = el("div", null, "lc-meta"); meta.append(link(item.author.displayName, "/community/u/" + item.author.id), el("span", date(item.updatedAt)));
    if (item.author.official) meta.prepend(el("span", "官方", "lc-official"));
    content.append(tags, title, el("p", item.excerpt, "lc-muted"), meta); article.append(symbol, content); return article;
  }
  function list(items, message = "新的分享会出现在这里。") {const block = el("div", null, "lc-list"); block.append(...(items.length ? items.map(row) : [empty("暂时没有内容", message)])); return block;}
  function writer(token, admin=false) {
    const keys=new Map();
    return async (url,body,{method="POST",raw=false}={})=>{
      const serialized=raw?body:JSON.stringify(body),identity=raw?null:url+serialized;
      if(identity&&!keys.has(identity))keys.set(identity,crypto.randomUUID());
      const result=await request(url,{method,headers:{"content-type":raw?"application/octet-stream":"application/json",[admin?"x-community-admin-csrf":"x-ander-csrf"]:token,...(identity?{"idempotency-key":keys.get(identity)}:{})},body:serialized});
      if(identity)keys.delete(identity);return result;
    };
  }
  function previewNote() {return el("p", "这份早期自编示例只有正文，未附带文件。", "lc-note");}
  let accessDialog=null,accessPromise=null,checkingAccess=false;
  async function ensurePublishingAccess() {
    if(accessPromise)return accessPromise;
    if(checkingAccess)return false;
    checkingAccess=true;
    let access,openedSession;
    try{openedSession=await request('/api/account/session');({access}=await request('/api/community/publishing-access'));}finally{checkingAccess=false;}
    if(access.available)return true;
    if(!access.needsCode)throw new Error(access.restricted?'社区发言暂受限制，请在我的社区查看说明。':'请先到“我的社区 → 社区资料”确认年龄范围并单独同意加入，再开通投稿资格。');
    accessPromise=new Promise(resolve=>{
      const dialog=el('dialog',null,'lc-access-dialog'),form=el('form'),title=el('h2','开通社区投稿内测'),hint=el('p','兑换一次，绑定当前账号，即可上传资料、发起讨论。浏览、下载和评论无需内测码。','lc-muted'),label=el('label','社区内测码','lc-field'),input=el('input'),message=el('p',null,'lc-operation-message'),actions=el('div',null,'lc-actions');
      title.id='community-access-title';dialog.setAttribute('aria-labelledby',title.id);input.name='communityCode';input.required=true;input.maxLength=100;input.autocomplete='off';input.spellcheck=false;input.placeholder='请输入社区投稿内测码';label.append(input);message.setAttribute('role','status');
      const submit=el('button','开通并继续','lc-button lc-primary'),cancel=el('button','暂不投稿','lc-button'),refresh=el('button','重新检查资格','lc-button');submit.type='submit';cancel.type=refresh.type='button';cancel.onclick=()=>dialog.close('cancel');
      refresh.onclick=async()=>{try{const r=await request('/api/community/publishing-access');if(r.access.available)dialog.close('ready');else message.textContent='当前仍需社区投稿资格。';}catch(e){message.textContent=e.message;}};
      form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;input.readOnly=true;message.textContent='正在核对内测码…';try{
        const session=await request('/api/account/session');if(!session.authenticated||session.csrfToken!==openedSession.csrfToken)throw Error('登录账号已变化，请关闭弹窗后重新打开，核对当前账号。');
        const r=await writer(session.csrfToken)('/api/community/publishing-access/redeem',{code:input.value,confirmed:true});
        if(r.access.available)dialog.close('ready');else message.textContent='此码已兑换，但该授权来源已撤销。请使用新的社区内测码或联系工作室。';
      }catch(error){message.textContent=error.message;}finally{submit.disabled=false;input.readOnly=false;}};
      actions.append(submit,cancel,refresh);form.append(title,hint,label,message,actions);dialog.append(form);document.body.append(dialog);accessDialog=dialog;
      dialog.addEventListener('close',()=>{const ready=dialog.returnValue==='ready';input.value='';dialog.remove();accessDialog=null;accessPromise=null;resolve(ready);},{once:true});dialog.showModal();input.focus();
    });
    return accessPromise;
  }
  // Intercept only new contribution links, preserving the originating page when cancelled.
  document.addEventListener('click',async event=>{
    if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const a=event.target.closest('a[href]');if(!a||a.target&&a.target!=='_self')return;
    const url=new URL(a.href);if(url.origin!==location.origin||url.pathname!=='/community/publish'||url.searchParams.has('draft'))return;
    event.preventDefault();event.stopImmediatePropagation();
    try{if(await ensurePublishingAccess()){if(window.AnderSiteNavigation)await window.AnderSiteNavigation.go(url);else location.assign(url.href);}}
    catch(e){if(e.status===401){location.assign('/account/login?next='+encodeURIComponent(url.pathname+url.search));return;}const note=el('p',e.message,'lc-note lc-error');note.setAttribute('role','alert');a.closest('.lc-actions,.center-item')?.append(note);}
  },true);
  window.addEventListener('pagehide',()=>accessDialog?.close('cancel'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)accessDialog?.close('cancel');});
  try{const sessionChanges=new BroadcastChannel('ander-account-session');sessionChanges.onmessage=()=>accessDialog?.close('cancel');}catch{}
  window.addEventListener("ander:site-view",()=>accessDialog?.close("cancel"));
  window.AnderCommunityUI = {el, link, date, href, request, writer, heading, empty, loginGate, row, list, previewNote,ensurePublishingAccess};
})();
