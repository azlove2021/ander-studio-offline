"use strict";
(() => {
  function create(root = document, signal) {
  const $ = s => root.querySelector(s);
  const node = (tag, text, cls) => {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
  const date = n => n ? new Date(n).toLocaleString("zh-CN", {hour12:false}) : "暂无";
  function tab(name, focus=false) {
    if (![...root.querySelectorAll("[data-center-tab]")].some(b=>b.dataset.centerTab===name)) name="profile";
    root.querySelectorAll("[data-center-tab]").forEach(b=>{const selected=b.dataset.centerTab===name;b.setAttribute("aria-selected",String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
    root.querySelectorAll("[data-center-panel]").forEach(p=>p.hidden=p.dataset.centerPanel!==name);
  }
  root.querySelectorAll("[data-center-tab]").forEach((b,i)=>{
    b.addEventListener("click",()=>{history.replaceState(history.state,"","#"+b.dataset.centerTab);tab(b.dataset.centerTab);});
    b.addEventListener("keydown",e=>{const tabs=[...root.querySelectorAll("[data-center-tab]")];const idx=e.key==="ArrowRight"?(i+1)%tabs.length:e.key==="ArrowLeft"?(i+tabs.length-1)%tabs.length:e.key==="Home"?0:e.key==="End"?tabs.length-1:null;if(idx!==null){e.preventDefault();tabs[idx].click();tabs[idx].focus();}});
  });
  tab(location.hash.slice(1));window.addEventListener("hashchange",()=>tab(location.hash.slice(1)), {signal});
  return {tab, async initialize({session, request, show, communityCenter}) {
    if (communityCenter) await communityCenter.initialize({session});
    const changes=$("[data-phone-events]");
    try{const data=await request("/api/account/security-events");changes.replaceChildren();
      const labels={register:"手机号注册",bind:"绑定手机",rebind:"更换手机",reset:"通过手机重置密码","password-change":"修改密码","password-reset":"通过邮箱找回密码","email-bind":"绑定邮箱","email-change":"更换邮箱"};
      for(const e of data.events){const receipt={accepted:"安全邮件请求已受理",sent:"安全邮件请求已受理",failed:"安全提醒未确认成功",pending:"安全提醒结果待确认",no_verified_email:"仅站内记录",not_configured:"未配置站外提醒",mock:"本机模拟提醒"}[e.notificationState];changes.append(node("li",`${labels[e.action]||"账户变更"} · ${date(e.createdAt)}${receipt?" · "+receipt:""}`));}
      if(!data.events.length)changes.append(node("li","暂无账户安全变更记录。"));
    }catch{changes.replaceChildren(node("li","变更记录暂时无法加载，请刷新后重试。"));}
    let checked=null, busy=false, grantOffset=0;
    const cancel=()=>{checked=null;$("[data-code-confirm]").hidden=true;$("[data-code-teacher]").checked=false;};
    const run=async fn=>{if(busy)return;busy=true;const panel=$("#panel-rights");panel.inert=true;try{await fn();}catch(e){show(e.message,true);}finally{panel.inert=false;busy=false;}};
    function renderBadges(membership){
      let row=$('[data-vip-badges]');
      if(!row){const heading=$('.profile-hero h1');if(!heading)return;const wrap=node('div',undefined,'center-greeting');heading.before(wrap);wrap.append(heading);row=node('div',undefined,'vip-badges');row.dataset.vipBadges='';row.setAttribute('aria-label','VIP 状态');wrap.append(row);}
      row.hidden=!membership?.enabled;row.replaceChildren();if(!membership?.enabled)return;
      for(const [id,name]of[['book','图书 VIP'],['game','游戏 VIP'],['community','社区 VIP']]){
        const active=membership.vip[id],a=node('a',undefined,'vip-badge '+(active?'is-active':'is-inactive'));a.href='#rights';a.onclick=()=>tab('rights');
        const state=active?(membership.official?'官方权益':'已开通'):'未开通';a.setAttribute('aria-label',name+'，'+state);a.title=name+' · '+state;
        const img=node('img');img.src='/assets/membership/vip-'+id+'-v2.png';img.alt='';img.width=72;img.height=72;
        const label=node('span',name,'vip-name');label.append(node('small',state));a.append(img,label);row.append(a);
      }
    }
    function renderRights(rights,membership) {
      const byId=Object.fromEntries(rights.map(r=>[r.id,r])),cards=$("[data-rights-cards]");cards.replaceChildren();
      const access=(title,r)=>{const el=node(r?.available?"a":"button",title,"access-button");if(r?.available)el.href=r.url;else{el.type="button";el.disabled=true;el.append(node("small",!r||r.id==="ai"?"未开放":r.owned?"暂不可用":"未开通"));}el.title=r?.rule||"暂未开放";return el;};
      const card=(title,kicker,rule,cls,buttons)=>{const c=node("article",undefined,"center-card service-card "+cls);c.append(node("span",kicker,"service-kicker"),node("h3",title),node("p",rule,"center-note"));const row=node("div",undefined,"service-buttons");row.append(...buttons);c.append(row);cards.append(c);};
      card("生物学模型","BIOLOGY MODELS","公开模型免费浏览，学习足迹随账户保存。","models-card",[access("浏览模型",byId.models)]);
      const unified=byId['question-download'];
      card("题目训练","PRACTICE & REFLECTION",membership?.enabled?`${membership.official?'官方账号':membership.vip.book?'图书 VIP 已开通':'普通账户'} · 自由查看题目和生成练习。${unified.rule}`:unified?.rule||'可按当前账户权限生成练习和下载试题。',"questions-card",[access("生成练习",byId.practice),...(unified?[access("下载试题",unified)]:[access("下载试题",byId.student||byId.teacher)]),access("AI 批改",byId.ai)]);
      card("生命方舟","LIFE ARK",(membership?.enabled?(membership.official?'官方账号':membership.vip.game?'游戏 VIP 已开通':'普通账户')+' · ':'')+(byId.game?.rule||'生命的探索，从这里启航。'),"ark-card",[access("进入生命方舟",byId.game)]);
      if(byId.community){const r=byId.community,a=node('a',r.available?'上传资料 / 发起讨论':'加入社区并查看投稿条件','access-button');a.href=r.url;card('学习社区','LEARNING COMMUNITY',(membership?.enabled?(membership.official?'官方账号':membership.vip.community?'社区 VIP 已开通':'普通账户')+' · ':'')+r.rule,'models-card',[a]);
        if(r.submissionQuotas){const list=node('ul',undefined,'rights-quota-list');for(const [key,name]of[['resources','资料投稿'],['discussions','讨论'],['replies','回复']]){const q=r.submissionQuotas[key];list.append(node('li',`${name}：${q.limit===null?'不限次数':q.used===null?'每日 '+q.limit+' 次，今日用量暂不可读':'今日剩余 '+q.remaining+' / '+q.limit+' 次'}`));}cards.lastElementChild.querySelector('.center-note').after(list);}}
      if(membership?.enabled)cards.append(node('p','三类 VIP 独立生效，可以同时拥有。每日额度按北京时间零点刷新，升级保留当天已用次数；AI 批改尚未开放。','rights-reset-note'));
      card("商城订单","STUDIO STORE","商城与订单系统尚未开放，已为后续接入预留。","shop-card",[access("已购订单",null)]);
    }
    async function redemptionHistory(offset=0) {
      const data=await request(`/api/account/redemptions?limit=10&offset=${offset}`);grantOffset=offset;
      const hist=$("[data-rights-history]");hist.replaceChildren();
      for(const g of data.items){const a=node("article",undefined,"center-item");a.append(node("h3",g.title),node("p",`${date(g.createdAt)} · ${g.state==="active"?"兑换来源有效":"该兑换来源已撤销"}`));hist.append(a);}
      if(!data.total)hist.append(node("p","暂无兑换记录。","center-empty"));
      const pager=$("[data-rights-pager]");pager.replaceChildren();
      for(const [label,to,disabled]of[["上一页",Math.max(0,offset-10),offset===0],["下一页",offset+10,offset+10>=data.total]]){const b=node("button",label,"secondary compact");b.type="button";b.disabled=disabled;b.onclick=()=>run(()=>redemptionHistory(to));pager.append(b);}pager.append(node("span",`共 ${data.total} 条`));
    }
    $("[data-history-toggle]").onclick=()=>run(async()=>{const panel=$("#redemption-records"),open=panel.hidden;panel.hidden=!open;$("[data-history-toggle]").setAttribute("aria-expanded",String(open));if(open)await redemptionHistory(0);});
    async function refresh(offset=grantOffset) {
      const data=await request(`/api/account/center?limit=10&offset=${offset}`);grantOffset=offset;
      $("[data-account-id]").textContent=data.accountId;$("[data-account-created]").textContent=date(data.profile.createdAt);
      renderBadges(data.membership);renderRights(data.rights,data.membership);
      $("[data-unified-code]").hidden=!data.codeRedemptionEnabled;
      if(!$("#redemption-records").hidden)await redemptionHistory(offset);
      const game=$("[data-game-history]");game.replaceChildren();
      if(data.gameSave)game.append(node("p",`最近云保存：${date(data.gameSave.updatedAt)}`),node("p",`存档修订 ${data.gameSave.revision} · 内容版本 ${data.gameSave.releaseId}`,"small-note"));
      else game.append(node("p","还没有本账户的云存档。","center-empty"));
      return data;
    }
    $("[data-rights-refresh]").onclick=()=>run(()=>refresh());
    $("[data-code-cancel]").onclick=cancel;$("[data-unified-code] [name=code]").oninput=cancel;
    $("[data-unified-code]").onsubmit=e=>{e.preventDefault();run(async()=>{
      cancel();const code=e.target.elements.code.value.trim(),live=await request("/api/account/session");
      if(live.csrfToken!==session.csrfToken)throw new Error("登录身份已变化，请刷新后重新核对。");
      const result=await request("/api/account/entitlement-preview",{code});checked={code,result,csrf:live.csrfToken};
      $("[data-code-title]").textContent=result.package.title;$("[data-code-scope]").textContent=result.package.resources.map(r=>r.title).join("、")+(result.openMode?"。社区已全面开放，确认后直接继续，不消耗内测码。":result.allOwned?"。已全部拥有，确认不会消耗兑换码。":result.alreadyRedeemed?"。此码已兑换，不会重复开通。":"。请确认本次范围。");
      $("[data-code-account]").textContent="将绑定："+live.user.displayName+"（"+(live.user.emailVerified?live.user.emailMasked:live.user.phoneMasked)+"）";
      $("[data-code-teacher-wrap]").hidden=!result.teacher;$("[data-code-confirm]").hidden=false;
    });};
    $("[data-code-redeem]").onclick=()=>run(async()=>{
      if(!checked)return;const accepted=checked;
      if(accepted.result.teacher&&!$("[data-code-teacher]").checked)throw new Error("请先勾选确认本次兑换权益。");
      const live=await request("/api/account/session");if(live.csrfToken!==accepted.csrf)throw new Error("登录身份已变化，请刷新后重新核对。");
      const r=await request("/api/account/entitlement-redeem",{code:accepted.code,confirmed:true,teacherConfirmed:$("[data-code-teacher]").checked});
      cancel();$("[data-unified-code]").reset();await refresh(0);show(r.openMode?"社区已全面开放，无需兑换；内测码未消耗。":r.alreadyOwned?"已拥有全部权限，兑换码未消耗。":r.alreadyRedeemed?"该码已兑换，当前权限已刷新。":"兑换成功，权限已绑定当前账户。");
    });
    await refresh();
    const historyWrap=$("[data-question-history]");
    if (session.questionPracticeOpen === false) {historyWrap.textContent="题目训练当前未开放，已有记录会保留。";return;}
    try{
      const data=await request("/api/questions/history");historyWrap.replaceChildren();
      for(const p of data.items||data.papers||[]){const item=node("article",undefined,"center-item"),a=node(p.unavailable?"span":"a",`${p.unavailable?"原题目版本暂不可用":p.submitted?"查看练习":"继续练习"} · ${p.total||0} 题`);if(!p.unavailable)a.href="/practice.html?id="+encodeURIComponent(p.id);item.append(a,node("p",`${date(p.updatedAt||p.createdAt)} · 已作答 ${p.done||0} 题`));historyWrap.append(item);}
      if(!historyWrap.children.length)historyWrap.append(node("p","尚无题目训练记录。","center-empty"));
    }catch(e){historyWrap.textContent=e.message;}
    // A private entry, not a public list or an inference from model favorites.
    try {
      const boot=await request('/api/questions/bootstrap');
      if(!signal?.aborted&&boot.capabilities?.favorites===true){const a=node('a','我的题目收藏','quiet-link');a.href='/practice.html?favorites=1';historyWrap.append(a);}
    }catch{/* Closed capability does not disrupt existing practice history. */}
  }};
  }
  window.AnderAccountCenter = {create};
})();
