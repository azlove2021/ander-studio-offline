/* Real-question client: no question bank, reference answers or scoring keys in JS. */
(() => {
  "use strict";
  const catalog=window.AnderQuestionCatalog, kinds=["single","multi","written","indeterminate"];
  const labels={single:"单选题",multi:"多选题",written:"非选择题",indeterminate:"不定项"};
  const levels={basic:"基础巩固",middle:"中档进阶",advanced:"能力提升"};
  const production=document.querySelector('meta[name="ander-question-mode"]')?.content==="production";
  let csrf="",boot=null,available={},signature="",timer,serial=0,pending=true,failure="",context="",identityEpoch=0;
  const downloadTasks=new Map(),downloads=new Set(),taskPattern=/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
  // 09. Task reuse is bound to the server's account context, not a user id.
  function changed(){identityEpoch++;for(const controller of downloads)controller.abort();downloadTasks.clear();csrf="";context="";boot=null;}
  function contextError(){return Object.assign(new Error('登录账户已变化，请重新登录后打开试卷。'),{code:'ACCOUNT_CONTEXT_CHANGED',status:401});}
  function acceptContext(value){if(typeof value!=='string'||!/^[a-f0-9]{64}$/.test(value))return;if(context&&value!==context){changed();throw contextError();}context=value;}
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function request(url,body) {
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),20000);
    try {
      const response=await fetch(url,{method:body===undefined?"GET":"POST",credentials:"same-origin",cache:"no-store",signal:abort.signal,
        headers:{...(context?{'x-ander-library-context':context}:{}),...(body===undefined?{}:{"content-type":"application/json","x-ander-csrf":csrf})},body:body===undefined?undefined:JSON.stringify(body)});
      const data=await response.json();
      if(!response.ok||data.ok===false){if(response.status===401||data.code==='ACCOUNT_CONTEXT_CHANGED')changed();throw Object.assign(new Error(data.message||"请求未完成。"),{code:data.code,status:response.status,details:data.details});}
      acceptContext(data.contextRevision);if(url==='/api/questions/bootstrap')boot=data;
      return data;
    }catch(error){if(error.name==="AbortError")throw new Error("请求超时，请保留当前输入并重试。");if(error instanceof TypeError)throw new Error("网络连接中断，请保留当前输入并重试。");throw error;}finally{clearTimeout(timeout);}
  }
  async function initialize() {
    const session=await request("/api/account/session");csrf=session.csrfToken;acceptContext(session.contextRevision);
    if(!session.authenticated)throw Object.assign(new Error(production?"请先登录你的学习账号。":"请先进入独立的本地试用账号。"),{code:"AUTH_REQUIRED"});
    boot=await request("/api/questions/bootstrap");
    if(boot.catalogVersion!==catalog.data.version)throw new Error("目录已更新，请刷新页面。");
    available=boot.counts;return boot;
  }
  // 10. New quota mode retains one id for a source/configuration. A lost response
  // or a processing response never silently starts another charged generation.
  async function exportIdentity(){const session=await request('/api/account/session');if(!session.authenticated){changed();throw contextError();}acceptContext(session.contextRevision);csrf=session.csrfToken;if(!context)throw contextError();}
  function exportTask(source,key,provided){
    if(provided){if(!taskPattern.test(provided.taskId)||provided.contextRevision!==context)throw contextError();return {...provided};}
    const registry=window.AnderPaperExport?.tasks;
    let task=registry?registry.select(source,key,context):downloadTasks.get(context+'|'+source+'|'+key);
    if(!task){task=registry?registry.create(source,key,context):{taskId:crypto.randomUUID(),contextRevision:context,createdAt:Date.now(),state:'prepared'};downloadTasks.set(context+'|'+source+'|'+key,task);}
    if(task.state==='failed')throw Object.assign(new Error('上次生成未完成，请在下载窗口明确选择重新生成。'),{code:'EXPORT_FAILED'});
    if(task.state==='expired')throw Object.assign(new Error('服务器已确认原下载任务过期，请在下载窗口明确选择重新生成。'),{code:'EXPORT_EXPIRED'});
    return task;
  }
  function taskState(task,state){if(!task)return;task.state=state;window.AnderPaperExport?.tasks.update(task.taskId,task.contextRevision,state);}
  // 12. A converter may return its original safe error code after the job was
  // durably failed. Resolve that state with GET, never another generating POST.
  async function inspectTaskFailure(task,error){
    if(!task||!Number.isInteger(error.status)||error.status===401||['ACCOUNT_CONTEXT_CHANGED','DOWNLOAD_RESTRICTED','EXPORT_PROCESSING','EXPORT_IN_PROGRESS'].includes(error.code))return;
    error.exportStatusChecked=true;
    try{const state=await request('/api/questions/exports/'+encodeURIComponent(task.taskId));if(state.taskId===task.taskId&&['ready','processing','failed','expired'].includes(state.state)){error.exportStatus=state;if(!['EXPORT_ARTIFACT_UNAVAILABLE','EXPORT_REQUEST_CONFLICT'].includes(error.code))taskState(task,state.state);}}
    catch(failure){if(failure.status===401||['AUTH_REQUIRED','ACCOUNT_CONTEXT_CHANGED','DOWNLOAD_RESTRICTED'].includes(failure.code))throw failure;if(failure.status===404)error.exportStatus={notFound:true};}
  }
  async function downloadFile(paperId,body,format,route,provided){
    const tasks=boot?.capabilities?.paperExport?.tasks===true,controller=new AbortController();let task=null;
    if(tasks){await exportIdentity();const source=route==='word'?'word:'+paperId+':'+body.variant:'paper:'+paperId,key=route==='word'?JSON.stringify([body.variant]):JSON.stringify([body.format,body.answers,body.explanations,body.ordering,body.style]);task=exportTask(source,key,provided);}
    const epoch=identityEpoch,runContext=context,timeout=setTimeout(()=>controller.abort(),150000);downloads.add(controller);
    try{
      const response=await fetch('/api/questions/papers/'+encodeURIComponent(paperId)+'/'+route,{method:'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,
        headers:{'content-type':'application/json','x-ander-csrf':csrf,...(runContext?{'x-ander-library-context':runContext}:{}),...(task?{'x-ander-export-task':task.taskId}:{})},body:JSON.stringify(body)});
      if(!response.ok){const data=await response.json();if(response.status===401||data.code==='ACCOUNT_CONTEXT_CHANGED')changed();if(task&&['EXPORT_FAILED','EXPORT_CANCELLED','EXPORT_ARTIFACT_UNAVAILABLE'].includes(data.code))taskState(task,'failed');if(task&&data.code==='EXPORT_EXPIRED')taskState(task,'expired');throw Object.assign(new Error(data.message||'下载失败，请稍后重试。'),{code:data.code,status:response.status,details:data.details,taskId:task?.taskId});}
      if(epoch!==identityEpoch||runContext!==context)throw contextError();
      if(task&&response.headers.get('x-ander-export-task')!==task.taskId)throw Object.assign(new Error('下载任务未能核对，请保留当前任务后重试。'),{code:'EXPORT_TASK_MISMATCH'});
      const type=format==='pdf'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if(response.headers.get('content-type')?.split(';')[0]!==type)throw new Error('下载文件格式不正确，请重试。');
      const blob=await response.blob();if(epoch!==identityEpoch||runContext!==context)throw contextError();
      if(tasks){await exportIdentity();if(epoch!==identityEpoch||runContext!==context)throw contextError();}
      const url=URL.createObjectURL(blob),link=document.createElement('a'),encoded=response.headers.get('content-disposition')?.match(/filename\*=UTF-8''([^;]+)/)?.[1];
      link.href=url;link.download=encoded?decodeURIComponent(encoded):'生物学试卷.'+format;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
      taskState(task,'ready');return {taskId:task?.taskId,reused:['true','1'].includes(response.headers.get('x-ander-export-reused'))};
    }catch(error){if(epoch!==identityEpoch)throw contextError();if(error.name==='AbortError'||error instanceof TypeError)throw Object.assign(new Error(task?'网络或等待中断；再次点击会核对同一任务，不会自动新建。':'下载等待中断，请稍后重试。'),{code:'EXPORT_NETWORK_UNCERTAIN',taskId:task?.taskId});await inspectTaskFailure(task,error);throw error;}
    finally{clearTimeout(timeout);downloads.delete(controller);}
  }
  const downloadWord=(paperId,variant,task)=>downloadFile(paperId,{variant},'docx','word',task);
  const downloadPaper=(paperId,options,task)=>downloadFile(paperId,{...options,ordering:options.answers||options.explanations?options.ordering:'separate'},options.format,'export',task);
  const defaults=()=>({scope:"all",selected:[],catalogVersion:catalog.data.version,counts:{single:10,multi:0,written:3,indeterminate:0},difficulty:"basic"});
  const scopeTitle=c=>c.scope==="all"?"全部考点":c.selected.length===1?(catalog.index.get(c.selected[0])?.title||"所选范围"):"已选 "+c.selected.length+(c.scope==="chapter"?" 节":" 个考点");
  function errors(c) {
    const issues=[];
    if(pending)issues.push("正在核对真实可用题量…");
    if(failure)issues.push(failure);
    if(c.scope!=="all"&&!c.selected.length)issues.push("请先选择章节或考点。");
    const total=kinds.reduce((n,k)=>n+(c.counts[k]||0),0);
    if(!total||total>60)issues.push("整卷请选择 1–60 道题。");
    if(!pending&&!failure)for(const k of kinds)if((c.counts[k]||0)>(available[k]||0))issues.push(labels[k]+"最多可选 "+(available[k]||0)+" 道。");
    return issues;
  }
  function refresh(c,callback) {
    const next=JSON.stringify(c);if(next===signature)return;
    signature=next;pending=true;failure="";clearTimeout(timer);const token=++serial;
    if(c.scope!=="all"&&!c.selected.length){pending=false;available={};return;}
    timer=setTimeout(async()=>{
      try {const result=await request("/api/questions/availability",{config:JSON.parse(next)});if(token!==serial)return;available=result.counts;}
      catch(error){if(token!==serial)return;failure=error.message+" 可点击下方重试。";}
      pending=false;callback();
    },160);
  }
  const api={live:true,catalog,kinds,labels,levels,esc,request,initialize,defaults,scopeTitle,errors,refresh,downloadWord,downloadPaper,
    estimate:c=>Math.round(kinds.reduce((sum,k)=>sum+(c.counts[k]||0)*(k==="written"?6:k==="single"?2:3),0)),
    read:()=>({session:boot?.latest||null}),stats:s=>({total:s.total,done:s.done}),availability:()=>available,
    pool:c=>({length:c.scope==="all"?boot.onlineCount:(boot.nodeCounts[c.selected[0]]||0)}),
    catalogLinks:{migrate:(scope,selected)=>catalog.normalize(scope,selected)},
    retry:()=>{signature="";},get bootstrap(){return boot;},get context(){return context;},get availabilityPending(){return pending;},
    unavailable:(root,error)=>{root.innerHTML=production?((['AUTH_REQUIRED','ACCOUNT_CONTEXT_CHANGED'].includes(error.code)||error.status===401)?'<section class="qp-panel ql-empty practice-welcome"><p class="section-kicker">PRACTICE, REFLECT, GROW</p><h2>从一次练习，发现新的理解。</h2><p class="welcome-lead">登录学习账号，选择自己的练习范围。作答和练习记录随账号保存，下次可以继续回顾。</p><div class="welcome-steps"><div><small>01 / CHOOSE</small><strong>选择练习</strong><span>按章节或考点，设置题型与难度。</span></div><div><small>02 / THINK</small><strong>专注作答</strong><span>在完整的练习中整理思路。</span></div><div><small>03 / REFLECT</small><strong>回顾反馈</strong><span>对照参考答案，留下学习记录。</span></div></div><a class="qp-button qp-primary" href="/account/login?next='+esc(encodeURIComponent(location.pathname+location.search+location.hash))+'">登录学习账号</a><p class="welcome-rules">正常学习账号登录后可使用基础练习；下载额度以当前账户页面为准。AI 批改暂未开放。</p></section>':'<section class="qp-panel ql-empty practice-welcome"><p class="section-kicker">PRACTICE STATUS</p><h2>暂时无法进入练习</h2><p class="welcome-lead">'+esc(error.message)+'</p><button class="qp-button qp-primary" type="button" data-practice-reload>重新加载练习</button><p class="welcome-rules">如网络恢复后仍无法进入，请通过网站底部的“联系与反馈”联系工作室。</p></section>'):'<section class="qp-panel ql-empty"><h2>真实题库 · 本地试用</h2><p>'+esc(error.message)+'</p><a class="qp-button qp-primary" href="/local-trial">进入本地试用</a><p>不连接生产账号；不会发送邮件。</p></section>';root.querySelector('[data-practice-reload]')?.addEventListener('click',()=>location.reload());}
  };
  try{const channel=new BroadcastChannel('ander-account-session');channel.onmessage=changed;}catch{/* Exports also recheck the current server session. */}
  window.AnderPracticeLive=api;
})();
