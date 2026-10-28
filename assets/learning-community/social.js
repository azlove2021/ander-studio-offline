"use strict";
(() => {
  const U=window.AnderCommunityUI,W=window.AnderCommunityWorkflow,{el,link}=U,{button,field,message}=W.controls;
  const names={pending:"待审核",approved:"已发布",returned:"已退回",withdrawn:"已撤回",removed:"已下架",open:"待处理",resolved:"已处理",dismissed:"不予采纳",upheld:"维持原处理",resubmit:"可修改后再提交"};
  const caseNames={return:"稿件退回",remove:"内容下架",reply_return:"回复退回",reply_remove:"回复下架",profile_return:"社区资料退回",mute:"社区限言"};
  const para=(s)=>el("p",s,"lc-body-text");
  function ledgerView(op) {
    const value=op.cloudLedger,fields=["capMicros","spentMicros","reservedMicros","requests","uncertainRequests"];
    if(value?.ledgerAvailable===true&&value.currency==="CNY"&&value.timeZone==="Asia/Shanghai"&&/^\d{4}-\d{2}$/.test(value.month)&&fields.every(k=>Number.isSafeInteger(value[k])&&value[k]>=0)) {
      const yuan=n=>(n/1000000).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:6})+" 元";
      return {cards:[["本月云请求记录",value.requests+" 条"],["软件账本已计费用",yuan(value.spentMicros)],["预留费用",yuan(value.reservedMicros)],["月预算",yuan(value.capMicros)]],
        note:`${value.month}（北京时间）· 进行中或待核对请求 ${value.uncertainRequests} 条。`+(value.stopped?"费用控制已暂停处理。":"")+(value.recoveryRequired?"当前运行状态需要核对。":"")+"费用预留用于限制后续处理；最终账单以云服务账单为准。"};
    }
    return {cards:[["云费用账本",op.localSimulation?"本地模拟":"暂不可显示"]],note:op.localSimulation?"当前为本地模拟，不能代表正式云费用。":"费用账本未完整返回，请刷新后核对；暂不显示费用数值。"};
  }
  function quoteView(quote) {const node=el("blockquote",null,"lc-quote");node.append(el("strong",quote.available?quote.author.displayName+"：":"引用提示"),para(quote.available?quote.body:quote.message));return node;}
  function form(title,label,{value="",max=1000}={}) {const box=el("details",null,"lc-inline-form"),f=field(label,"note",value,{type:"textarea",rows:3,max});box.append(el("summary",title),f.wrap);f.input.oninput=()=>W.interactionDirty();return {box,input:f.input};}
  function actions(parent){const row=el("div",null,"lc-actions");parent.append(row);return row;}
  async function thread(item,{token,request=U.request}) {
    const root=el("section",null,"lc-thread"),write=U.writer(token),status=el("p",null,"lc-operation-message");
    let data=await request("/api/community/threads/"+item.id),body="",quote=null,busy=false;const reports=new Map();
    async function perform(fn){if(busy)return;busy=true;const locks=[...root.querySelectorAll("button")];locks.forEach(b=>b.disabled=true);try{await fn();if(!root.isConnected)return;data=await request("/api/community/threads/"+item.id);render();message(status,"已保存。");}catch(e){if(root.isConnected)message(status,e.message,true);}finally{busy=false;locks.forEach(b=>{if(b.isConnected)b.disabled=false;});}}
    function reportForm(replyId) {
      const key=replyId||"item",saved=reports.get(key)||{},f=form("纠错 / 举报","问题说明",{value:saved.detail||""}),type=field("反馈类型","category",saved.category||data.reportCategories[0],{type:"select",options:data.reportCategories});
      f.box.insertBefore(type.wrap,f.input.parentElement);f.box.append(el("p","举报人身份只向审核人员展示。知识纠错、分类建议也可在这里反馈。","lc-muted"));
      const remember=()=>{reports.set(key,{category:type.input.value,detail:f.input.value});W.interactionDirty();};f.input.oninput=remember;type.input.onchange=remember;
      f.box.append(button("提交反馈",()=>perform(async()=>{await write("/api/community/reports",{itemId:item.id,...(replyId?{replyId}:{}),category:type.input.value,detail:f.input.value});reports.delete(key);W.reset();}),true));return f.box;
    }
    function render() {
      root.replaceChildren();const bar=el("div",null,"lc-interaction-bar"),bookmark=button(data.bookmarked?"已收藏 · 取消":"收藏",()=>perform(()=>write("/api/community/bookmarks",{itemId:item.id,active:!data.bookmarked}))),help=button(`${data.markedHelpful?"已标记有帮助":"有帮助"} ${data.helpful}`,()=>perform(()=>write("/api/community/helpful",{itemId:item.id,active:!data.markedHelpful})));
      bookmark.setAttribute("aria-pressed",String(data.bookmarked));help.setAttribute("aria-pressed",String(data.markedHelpful));help.disabled=data.own;bar.append(bookmark,help);
      if(data.resolvedReply)bar.append(el("span","作者已标记解决","lc-tag"));
      if(data.own&&item.revision)bar.append(link("编辑这份"+(item.kind==="discussion"?"讨论":"资料"),"/community/publish?type="+item.kind+"&draft="+item.id,"lc-button"));
      root.append(bar,reportForm(),el("h2",(item.kind==="discussion"?"讨论回复":"留言与交流")+`（${data.replies.length}）`));
      if(!data.replies.length)root.append(el("p","还没有公开回复，欢迎分享你的思路。","lc-muted"));
      for(const reply of data.replies) {
        const card=el("article",null,"lc-reply");card.id=reply.id;const top=el("div",null,"lc-section-title");top.append(link(reply.author.displayName,"/community/u/"+reply.author.id),el("small",U.date(reply.createdAt),"lc-muted"));
        if(data.resolvedReply===reply.id)top.append(el("span","帮助解决了问题","lc-tag"));card.append(top);if(reply.quote)card.append(quoteView(reply.quote));card.append(para(reply.body));
        const row=actions(card),help=button(`${reply.markedHelpful?"已标记有帮助":"有帮助"} ${reply.helpful}`,()=>perform(()=>write("/api/community/helpful",{itemId:item.id,replyId:reply.id,active:!reply.markedHelpful})));help.disabled=reply.own;help.setAttribute("aria-pressed",String(reply.markedHelpful));row.append(help,button("引用回复",()=>{quote=reply;render();root.querySelector("[name=reply-body]").focus();W.interactionDirty();}));
        if(reply.own)row.append(link("管理回复","/account?communityTab=replies#community","lc-button"));
        if(data.own&&item.kind==="discussion")row.append(button(data.resolvedReply===reply.id?"取消已解决":"标记已解决",()=>perform(()=>write("/api/community/solved",{itemId:item.id,replyId:data.resolvedReply===reply.id?null:reply.id,replyRevision:reply.revision,expectedVersion:data.controlVersion}))));
        card.append(reportForm(reply.id));root.append(card);
      }
      if(data.ownPending.length)root.append(el("p",`你有 ${data.ownPending.length} 条回复等待审核，审核通过前仅自己可见。`,"lc-note"),link("查看我的回复","/account?communityTab=replies#community"));
      const composer=el("section",null,"lc-reply-composer"),f=field("写下你的回复","reply-body",body,{type:"textarea",rows:4,max:2000});f.input.placeholder="说清楚你的思路、依据或仍有疑问的地方。";f.input.oninput=()=>{body=f.input.value;W.interactionDirty();};
      if(quote){const q=el("div",null,"lc-note lc-section-title");q.append(el("span","引用 "+quote.author.displayName+" 的回复"),button("取消引用",()=>{quote=null;render();}));composer.append(q);}
      composer.append(f.wrap,el("p","提交后先审核，通过后向已登录用户展示。","lc-muted"));
      const submit=button("提交回复",()=>perform(async()=>{await write("/api/community/replies",{itemId:item.id,body,...(quote?{quoteId:quote.id,quoteRevision:quote.revision}:{})});body="";quote=null;W.reset();}),true);composer.append(submit);
      if(data.restriction){submit.disabled=true;composer.prepend(el("p","发言暂受限制："+data.restriction.reason,"lc-note"),link("查看说明或申诉","/account?communityTab=cases#community"));}
      root.append(composer,status);if(body||quote||reports.size)W.interactionDirty();
    }
    render();return root;
  }
  function center(data,section,{token,onSaved}) {
    const root=el("div",null,"lc-social-center"),status=el("p"),write=U.writer(token);let busy=false;
    async function perform(fn){if(busy)return;busy=true;try{await fn();W.reset();if(root.isConnected)await onSaved();}catch(e){message(status,e.message,true);}finally{busy=false;}}
    if(section==="notifications") {
      if(data.items.some(n=>!n.readAt))root.append(button("全部标为已读",()=>perform(()=>write("/api/community/notifications/read",{id:"all"}))));
      for(const n of data.items){const card=el("article",null,"lc-private-item");card.append(el("h3",n.title),para(n.message),el("small",`${n.readAt?"已读":"未读"} · ${U.date(n.createdAt)}`,"lc-muted"));
        if(n.unavailable)card.append(el("p","关联内容已不可见，可在我的社区查看自己的处理记录。","lc-muted"));
        const a=link("查看详情",n.url,"lc-button");a.onclick=async e=>{e.preventDefault();try{await write("/api/community/notifications/read",{id:n.id});W.reset();window.AnderSiteNavigation?window.AnderSiteNavigation.go(n.url):location.assign(n.url);}catch(err){message(status,err.message,true);}};card.append(a);root.append(card);}
      if(!data.items.length)root.append(U.empty("暂时没有新通知","审核和交流进度会出现在这里。"));
    } else if(section==="replies") {
      for(const r of data.items){const card=el("article",null,"lc-private-item");card.append(el("span",names[r.state],"lc-tag"));if(r.quote)card.append(quoteView(r.quote));card.append(para(r.body));if(r.reason)card.append(el("p",r.reason,"lc-note"));
        if(r.itemAvailable)card.append(link("回到原文",r.url,"lc-button"));
        if(r.canEdit&&r.itemAvailable){const f=form("修改回复","回复内容",{value:r.body,max:2000});f.box.append(el("p","新版本审核通过前，原来已通过的回复继续展示。","lc-muted"),button("提交修改",()=>perform(()=>write("/api/community/replies",{itemId:r.itemId,id:r.id,expectedRevision:r.revision,body:f.input.value,...(r.quoteId?{quoteId:r.quoteId,quoteRevision:r.quoteRevision}:{})})),true));card.append(f.box);}
        if(!["withdrawn","removed"].includes(r.state))card.append(button("撤回回复",()=>perform(()=>write("/api/community/reply-withdrawals",{id:r.id,expectedRevision:r.revision}))));root.append(card);}
      if(!data.items.length)root.append(U.empty("还没有回复","在资料或讨论下分享你的思路。"));
    } else {
      if(data.restriction)root.append(el("p",`发言限制至 ${new Date(data.restriction.untilAt).toLocaleString("zh-CN")}：${data.restriction.reason}`,"lc-note"));
      root.append(el("h3","与我有关的处理"));
      for(const c of data.cases){const card=el("article",null,"lc-private-item"),appeals=data.appeals.filter(a=>a.caseId===c.id);card.append(el("h4",caseNames[c.kind]||"处理记录"),para(c.reason),el("small",U.date(c.createdAt),"lc-muted"));
        for(const a of appeals)card.append(el("p",`申诉：${a.body}`),el("p",`结果：${names[a.state]}${a.reason?" · "+a.reason:""}`,"lc-note"));
        if(!appeals.some(a=>a.state==="pending")&&appeals.length<3){const f=form("提出申诉","补充说明与依据",{max:1500});f.box.append(button("提交申诉",()=>perform(()=>write("/api/community/appeals",{caseId:c.id,body:f.input.value})),true));card.append(f.box);}root.append(card);}
      if(!data.cases.length)root.append(el("p","暂无处理记录。","lc-muted"));root.append(el("h3","我提交的纠错与举报"));
      for(const r of data.reports){const card=el("article",null,"lc-private-item");card.append(el("h4",r.category+" · "+names[r.state]),para(r.detail));if(r.resolution)card.append(el("p","处理说明："+r.resolution,"lc-note"));root.append(card);}
      if(!data.reports.length)root.append(el("p","暂无反馈记录。","lc-muted"));
    }
    root.append(status);return root;
  }
  async function admin({token,request=U.request,onChange,onFailure}) {
    const root=el("section",null,"lc-governance"),write=U.writer(token,true),status=el("p"),tabs=el("nav",null,"lc-subtabs"),panel=el("section");let data=await request("/api/community-admin/governance"),tab="replies",busy=false,view=0;
    root.refresh=async()=>{const next=await request("/api/community-admin/governance");if(root.isConnected){data=next;render();}};
    root.append(el("h2","讨论与社区管理"),tabs,panel,status);
    async function perform(fn){if(busy)return;busy=true;const buttons=[...root.querySelectorAll("button")];buttons.forEach(b=>b.disabled=true);try{await fn();if(!root.isConnected)return;data=await request("/api/community-admin/governance");render();await onChange();message(status,"处理结果已保存。");}catch(e){if([401,403].includes(e.status))onFailure(e);else message(status,e.message,true);}finally{busy=false;buttons.forEach(b=>{if(b.isConnected)b.disabled=false;});}}
    function choice(label,values,value){return field(label,label,value,{type:"select",options:values});}
    function decisionForm(parent,{label="处理说明",max=500}={}) {const f=field(label,label,"",{type:"textarea",rows:2,max});parent.append(f.wrap);return f.input;}
    function render(){view++;tabs.replaceChildren();panel.replaceChildren();
      const labels={replies:`回复审核 ${data.replies.length}`,reports:`举报与申诉 ${data.reports.length+data.appeals.length}`,content:"内容管理",operations:"运行概览"};
      for(const[k,label]of Object.entries(labels)){const b=button(label,()=>{tab=k;render();});b.setAttribute("aria-current",tab===k?"page":"false");tabs.append(b);}
      if(tab==="replies") {
        panel.append(el("p","回复由审核员逐条检查，确认内容符合社区规范后再批准。","lc-muted"));
        for(const r of data.replies){const card=el("article",null,"lc-private-item");card.append(el("h3",r.author.displayName+"的回复"),el("small",`第 ${r.revision} 版 · ${U.date(r.createdAt)}`,"lc-muted"));if(r.quote)card.append(quoteView(r.quote));card.append(para(r.body));
          card.append(button("审核通过",()=>perform(()=>write("/api/community-admin/reply-decisions",{id:r.id,expectedRevision:r.revision,decision:"approve"})),true));
          const f=form("退回修改","退回原因",{max:500});f.input.oninput=null;f.box.append(button("确认退回",()=>perform(()=>write("/api/community-admin/reply-decisions",{id:r.id,expectedRevision:r.revision,decision:"return",reason:f.input.value}))));card.append(f.box);panel.append(card);}
        if(!data.replies.length)panel.append(U.empty("暂无待审回复","新回复和修改后的回复会在这里等待审核。"));
      } else if(tab==="reports") {
        for(const r of data.reports){const card=el("article",null,"lc-private-item");card.append(el("span",r.priority===3?"优先处理":"待处理","lc-tag"),el("h3",r.category),para(r.detail),el("small","反馈人："+r.reporter.displayName+"（仅审核端可见）","lc-muted"));
          const inspect=button("查看被反馈内容",async()=>{try{const d=await request("/api/community-admin/content/"+r.itemId+(r.replyId?"?reply="+r.replyId:""));if(card.isConnected){const target=el("div",null,"lc-note");target.append(el("strong",d.title),para(d.body));card.append(target);inspect.remove();}}catch(e){message(status,e.message,true);}});card.append(inspect);
          const reason=decisionForm(card),row=actions(card);for(const[decision,label]of [["resolve","完成处理"],["dismiss","不予采纳"],["remove","下架被举报内容"]])row.append(button(label,()=>perform(()=>write("/api/community-admin/report-decisions",{id:r.id,expectedVersion:r.version,decision,reason:reason.value})),decision==="resolve"));panel.append(card);}
        for(const a of data.appeals){const card=el("article",null,"lc-private-item");card.append(el("h3",a.author.displayName+"的申诉"),el("p",`${caseNames[a.kind]||"原处理"}：${a.originalReason}`,"lc-note"),para(a.body));const reason=decisionForm(card,{label:"申诉答复"}),row=actions(card);
          row.append(button(a.kind==="mute"?"解除该次限言":"允许修改后再提交",()=>perform(()=>write("/api/community-admin/appeal-decisions",{id:a.id,expectedVersion:a.version,decision:"resubmit",reason:reason.value})),true),button("维持原处理",()=>perform(()=>write("/api/community-admin/appeal-decisions",{id:a.id,expectedVersion:a.version,decision:"uphold",reason:reason.value}))));panel.append(card);}
        if(!data.reports.length&&!data.appeals.length)panel.append(U.empty("暂无待处理反馈","紧急举报优先排列；处理结果只发送给相关用户。"));
      } else if(tab==="content") {
        panel.append(el("p","置顶、精华与分类独立设置；“精华”不代表官方发布。","lc-muted"));
        for(const i of data.items){const card=el("details",null,"lc-manage-item");card.append(el("summary",i.title));const category=choice("内容分类",data.categories[i.kind],i.category),pin=choice("列表置顶",[["0","不置顶"],["1","置顶"]],i.pinned?"1":"0"),feature=choice("精华推荐",[["0","普通内容"],["1","精华"]],i.featured?"1":"0"),grid=el("div",null,"lc-editor-form");grid.append(category.wrap,pin.wrap,feature.wrap);card.append(grid,button("保存内容设置",()=>perform(()=>write("/api/community-admin/curation",{itemId:i.id,expectedVersion:i.controlVersion,category:category.input.value,pinned:pin.input.value==="1",featured:feature.input.value==="1"})),true));
          const f=form("下架内容","下架原因",{max:500});f.input.oninput=null;f.box.append(button("确认下架",()=>perform(()=>write("/api/community-admin/removals",{id:i.id,kind:"item",expectedRevision:i.revision,reason:f.input.value}))));card.append(f.box);
          const replyBox=el("section"),show=button("查看已发布回复",async()=>{const run=view;try{const thread=await request("/api/community-admin/threads/"+i.id);if(run!==view||!replyBox.isConnected)return;replyBox.replaceChildren();for(const r of thread.replies){const row=el("div",null,"lc-reply");row.append(el("strong",r.author.displayName),para(r.body));const f=form("下架回复","下架原因",{max:500});f.input.oninput=null;f.box.append(button("确认下架回复",()=>perform(()=>write("/api/community-admin/removals",{id:r.id,kind:"reply",expectedRevision:r.revision,reason:f.input.value}))));row.append(f.box);replyBox.append(row);}if(!thread.replies.length)replyBox.append(el("p","暂无已发布回复。","lc-muted"));}catch(e){message(status,e.message,true);}});card.append(show,replyBox);panel.append(card);}
        const limits=el("details",null,"lc-manage-item");limits.append(el("summary","社区发言限制"));
        for(const person of data.people){const card=el("section",null,"lc-private-item");card.append(el("h3",person.displayName),el("p",person.untilAt>Date.now()?"限制至 "+new Date(person.untilAt).toLocaleString("zh-CN")+" · "+person.reason:"当前没有发言限制","lc-muted"));const hours=choice("限制时长",[["0","解除限制"],["24","1 天"],["72","3 天"],["168","7 天"],["720","30 天"]],"24"),reason=decisionForm(card);card.append(hours.wrap,button("保存发言限制",()=>perform(()=>write("/api/community-admin/restrictions",{publicId:person.publicId,expectedVersion:person.version,hours:Number(hours.input.value),reason:reason.value}))));limits.append(card);}panel.append(limits);
      } else {
        const op=data.operations,ledger=ledgerView(op),
          grid=el("div",null,"lc-operation-cards");for(const[label,value]of [["预计审核工作量",op.estimatedMinutes+" 分钟"],["待审投稿与回复",op.counts.resources+op.counts.discussions+op.counts.replies],["举报 / 申诉",op.counts.reports+" / "+op.counts.appeals],...ledger.cards]){const card=el("div",null,"lc-note");card.append(el("small",label),el("strong",String(value)));grid.append(card);}panel.append(grid,el("p","工作量按资料 6 分钟、讨论 2 分钟、回复及社区资料 1 分钟、反馈及申诉 3 分钟估算。","lc-muted"),el("p",ledger.note,"lc-note"));
        if(op.paused||op.estimatedMinutes>=op.queueMinutes*.8)panel.append(el("p",op.paused?"当前已暂缓接收新内容。":"审核积压接近上限，请优先处理待审内容。","lc-note lc-error"));
        panel.append(el("p",`常规每日提交上限为 ${op.dailySubmissionCeiling} 次，指定白名单账号的资料／讨论投稿豁免每日次数限制。社区云处理月预算上限仍为 ${op.monthlyBudgetCeilingCents/100} 元。可降低设置，不可超出上限。按北京时间自然日／自然月计。`,"lc-note"));
        const mode=choice("新内容提交",[["0","正常接收"],["1","暂缓接收"]],op.paused?"1":"0"),minutes=field("积压上限（分钟）","minutes",String(op.queueMinutes)),daily=field("常规每日提交上限","daily",String(op.dailySubmissions)),budget=field("月预算设置（元，留空采用已确认上限）","budget",String(op.budgetCents/100));
        [minutes,daily,budget].forEach(f=>{f.input.type="number";f.input.min="0";});minutes.input.min="1";minutes.input.max="1440";daily.input.min="1";daily.input.max=String(op.dailySubmissionCeiling);budget.input.max=String(op.monthlyBudgetCeilingCents/100);budget.input.step="0.01";panel.append(mode.wrap,minutes.wrap,daily.wrap,budget.wrap,button("保存运行设置",()=>perform(()=>write("/api/community-admin/operations",{expectedVersion:op.version,paused:mode.input.value==="1",queueMinutes:Number(minutes.input.value),dailySubmissions:Number(daily.input.value),budgetCents:budget.input.value===""?null:Math.round(Number(budget.input.value)*100)})),true),el("p","资料／讨论、回复和自定义资料提交共用每日限额。加入、草稿、撤回、阅读、收藏及举报申诉不占提交次数；原请求重复查询不重复计数。","lc-muted"));
        const history=el("details",null,"lc-manage-item"),labels={approve:"稿件审核通过",return:"稿件退回",remove:"内容下架",reply_approve:"回复审核通过",reply_return:"回复退回",reply_remove:"回复下架",mute:"社区限言",unmute:"解除限言",curate:"分类与推荐设置",operations_update:"运行设置修改",report_resolve:"反馈处理",report_dismiss:"反馈不予采纳",report_remove:"举报下架",appeal_uphold:"维持原处理",appeal_resubmit:"申诉允许修改",profile_approve:"社区资料审核通过",profile_return:"社区资料退回"};history.append(el("summary","最近管理记录（最多 100 条）"));
        for(const e of data.events){const row=el("div",null,"lc-reply");row.append(el("strong",labels[e.action]||e.action),el("small",` · ${U.date(e.createdAt)} · ${e.actor.replace(/^internal:/,"")}`,"lc-muted"));if(e.reason)row.append(para(e.reason));history.append(row);}panel.append(history);
      }
    }
    render();return root;
  }
  window.AnderCommunitySocial={thread,center,admin};
})();
