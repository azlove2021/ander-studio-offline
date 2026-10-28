/* Only a short-lived, explicitly requested guest selection may use sessionStorage. */
(()=>{
 'use strict';
 const TRAINING_DRAFT='ander.question-training.resume.v1',DRAFT_TTL=10*60*1000;
 const clearTrainingDraft=()=>{try{sessionStorage.removeItem(TRAINING_DRAFT);}catch{/* Storage may be unavailable. */}};
 function trainingSelection(value){
  const c=value?.config,p=value?.preferences,f=value?.free,kinds=['single','multi','indeterminate','written'];
  if(!c||!p||!f||!['all','chapter','topic'].includes(c.scope)||!['daily','weekly','mock','province','free'].includes(c.mode)||!['basic','middle','advanced'].includes(c.difficulty)||!(c.province===null||typeof c.province==='string'&&/^[a-z_]{1,40}$/.test(c.province))||!Array.isArray(c.selected)||c.selected.length>365||!c.selected.every(id=>typeof id==='string'&&id.length>0&&id.length<=128)||!['single','multi','indeterminate'].includes(p.choiceMode)||!['all','mock','gaokao'].includes(p.source)||![3,5,10].includes(p.yearWindow)||!kinds.every(k=>Number.isInteger(f[k])&&f[k]>=0&&f[k]<=30))return null;
  return {config:{scope:c.scope,selected:[...new Set(c.selected)],mode:c.mode,province:c.province,difficulty:c.difficulty},free:Object.fromEntries(kinds.map(k=>[k,f[k]])),preferences:{choiceMode:p.choiceMode,source:p.source,yearWindow:p.yearWindow}};
 }
 function readTrainingDraft(){
  try{
   const raw=sessionStorage.getItem(TRAINING_DRAFT);if(!raw)return null;
   if(raw.length>65536)throw new Error('size');const d=JSON.parse(raw),now=Date.now();
   if(d.format!==1||!Number.isSafeInteger(d.createdAt)||d.createdAt>now+1000||!Number.isSafeInteger(d.expiresAt)||d.expiresAt<=now||d.expiresAt-d.createdAt!==DRAFT_TTL||!['/#exams','/question-bank.html'].includes(d.target)||typeof d.releaseId!=='string'||d.releaseId.length>128||typeof d.catalogVersion!=='string'||d.catalogVersion.length>128||!(d.contextRevision===null||typeof d.contextRevision==='string'&&/^[a-f0-9]{64}$/.test(d.contextRevision))||!trainingSelection(d.selection))throw new Error('invalid');
   d.selection=trainingSelection(d.selection);
   return d;
  }catch{clearTrainingDraft();return null;}
 }
 function create(){
  let csrf='',context='',epoch=0,invalid=false,checking=false,trainingClient=false,trainingPublic=false,trainingGuest=false;const pending=new Set(),listeners=new Set();let accounts,favorites,baskets;
  const emit=type=>listeners.forEach(fn=>fn(type));
  const invalidate=()=>{epoch++;invalid=true;csrf='';clearTrainingDraft();for(const c of pending)c.abort();emit('invalid');};
  async function request(url,input,download=false,exportTask=null){
   if(invalid)throw Object.assign(new Error('登录状态已变化，请重新进入。'),{code:'ACCOUNT_CONTEXT_CHANGED'});
   const run=epoch,c=new AbortController();pending.add(c);const timeout=setTimeout(()=>c.abort(),download?150000:20000);
   try{
    const response=await fetch(url,{method:input===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',signal:c.signal,headers:{...(context?{'x-ander-library-context':context}:{}),...(download&&exportTask?{'x-ander-export-task':exportTask}:{}),...(input===undefined?{}:{'content-type':'application/json','x-ander-csrf':csrf})},...(input===undefined?{}:{body:JSON.stringify(input)})});
    if(run!==epoch)throw Object.assign(new Error('当前页面状态已失效。'),{code:'STALE_RESPONSE'});
    if(download&&response.ok)return response;
    const data=await response.json();if(run!==epoch)throw Object.assign(new Error('当前页面状态已失效。'),{code:'STALE_RESPONSE'});
    if(!response.ok||data.ok===false){if(response.status===401||['ACCOUNT_CONTEXT_CHANGED','FAVORITE_CONTEXT_CHANGED'].includes(data.code))invalidate();throw Object.assign(new Error(data.message||'请求未完成。'),{code:data.code,status:response.status,details:data.details});}
    if(context&&data.contextRevision&&context!==data.contextRevision){invalidate();throw Object.assign(new Error('账户已变化，请重新进入。'),{code:'ACCOUNT_CONTEXT_CHANGED'});}return data;
   }catch(e){if(e.name==='AbortError')throw Object.assign(new Error('请求未确认，请先核对保存状态。'),{code:'REQUEST_UNKNOWN'});if(e instanceof TypeError)throw Object.assign(new Error('网络中断，请先核对保存状态。'),{code:'REQUEST_UNKNOWN'});throw e;}
   finally{clearTimeout(timeout);pending.delete(c);}
  }
  function adoptIdentity(s){
   if(!s.authenticated){invalidate();throw Object.assign(new Error('请先登录学习账号。'),{code:'AUTH_REQUIRED'});}
   if(!/^[a-f0-9]{64}$/.test(s.contextRevision)||context&&context!==s.contextRevision){invalidate();throw Object.assign(new Error('登录账户已变化。'),{code:'ACCOUNT_CONTEXT_CHANGED'});}
   context=s.contextRevision;csrf=s.csrfToken;trainingGuest=false;
  }
  async function identity(){adoptIdentity(await request('/api/account/session'));}
  function claimTrainingDraft(boot){
   const d=readTrainingDraft();if(!d)return null;
   if(!context||d.releaseId!==boot.releaseId||d.catalogVersion!==boot.catalogVersion||d.contextRevision&&d.contextRevision!==context){clearTrainingDraft();return null;}
   if(d.contextRevision===null){d.contextRevision=context;try{sessionStorage.setItem(TRAINING_DRAFT,JSON.stringify(d));}catch{clearTrainingDraft();return null;}}
   return d;
  }
  async function initialize(){await identity();const boot=await request('/api/questions/library/bootstrap');claimTrainingDraft(boot);return boot;}
  async function initializeTraining(){
   trainingClient=true;let publicBoot;
   try{publicBoot=await request('/api/questions/training/bootstrap');}
   catch(error){
    if(error.status!==404)throw error;clearTrainingDraft();const session=await request('/api/account/session');
    if(session.authenticated===false&&!context)throw Object.assign(new Error('请先登录学习账号。'),{code:'AUTH_REQUIRED'});
    adoptIdentity(session);return {...await request('/api/questions/library/bootstrap'),trainingPublic:false,authenticated:true};
   }
   if(publicBoot.enabled!==true)throw Object.assign(new Error('练习配置暂未开放。'),{code:'TRAINING_CLOSED'});
   trainingPublic=true;const session=await request('/api/account/session');
   if(session.authenticated){adoptIdentity(session);const boot=await request('/api/questions/library/bootstrap');claimTrainingDraft(boot);return {...boot,trainingPublic:true,authenticated:true};}
   if(session.authenticated!==false||context){invalidate();throw Object.assign(new Error('登录状态已变化，请重新进入。'),{code:'ACCOUNT_CONTEXT_CHANGED'});}
   trainingGuest=true;csrf=session.csrfToken;
   return {...publicBoot,trainingPublic:true,authenticated:false,preferences:{choiceMode:'single',source:'all',yearWindow:3,...publicBoot.defaults}};
  }
  async function saveTrainingDraft(boot,selection,target){
   if(!trainingPublic||!trainingGuest||context||invalid)throw Object.assign(new Error('请重新核对登录状态。'),{code:'ACCOUNT_CONTEXT_CHANGED'});
   const session=await request('/api/account/session');if(session.authenticated!==false){invalidate();throw Object.assign(new Error('登录状态已变化，请重新进入。'),{code:'ACCOUNT_CONTEXT_CHANGED'});}
   if(!['/#exams','/question-bank.html'].includes(target))throw new Error('返回地址无效。');
   const safe=trainingSelection(selection);if(!safe)throw new Error('请先修正题目数量或练习选项，再继续登录。');
   const createdAt=Date.now(),draft={format:1,createdAt,expiresAt:createdAt+DRAFT_TTL,target,releaseId:boot.releaseId,catalogVersion:boot.catalogVersion,contextRevision:null,selection:safe};
   const raw=JSON.stringify(draft);if(raw.length>65536)throw new Error('所选范围过大，请调整后继续。');
   try{sessionStorage.setItem(TRAINING_DRAFT,raw);}catch{throw new Error('浏览器暂不能保留选题设置，请允许本网站使用会话存储后重试。');}
  }
  function takeTrainingDraft(boot){const d=claimTrainingDraft(boot);if(!d)return null;clearTrainingDraft();return d.selection;}
  async function mutate(endpoint,payload){
   await identity();const body={...payload,operationId:crypto.randomUUID(),contextRevision:context};
   try{const result=await request(endpoint,body);baskets?.postMessage('changed');return result;}
   catch(e){if(e.status&&e.status<500)throw e;
    if(invalid||e.code==='STALE_RESPONSE')throw e;
    const result=await request('/api/questions/library/operations/'+body.operationId);
    if(result.found){baskets?.postMessage('changed');return {...result.result,confirmedByRead:true};}
    throw Object.assign(new Error('保存结果仍未确认。请刷新核对后再操作；本次没有自动重发。'),{code:'SAVE_UNKNOWN'});
   }
  }
  async function favorite(question,desired){
   await identity();const input={questionId:question.questionId,desired,contextRevision:context,...(desired?{releaseId:question.releaseId,version:question.version}:{})};
   try{const result=await request('/api/questions/favorites',input);favorites?.postMessage('changed');return result;}
   catch(e){if(invalid||e.code==='STALE_RESPONSE'||e.status&&e.status<500)throw e;const result=await request('/api/questions/favorites?questionId='+question.questionId);favorites?.postMessage('changed');return {...result,confirmedByRead:true};}
  }
  async function downloadBasket(revision,options,task){
   await identity();
   if(task){if(!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(task.taskId||''))throw Object.assign(new Error('下载任务编号无效。'),{code:'EXPORT_TASK_REQUIRED'});if(task.contextRevision!==context)throw Object.assign(new Error('登录状态已变化，下载已取消。'),{code:'ACCOUNT_CONTEXT_CHANGED'});}
   const run=epoch,response=await request('/api/questions/basket/export',{revision,options,contextRevision:context},true,task?.taskId);
   if(task&&response.headers.get('x-ander-export-task')!==task.taskId)throw Object.assign(new Error('下载任务尚未核对，请重试同一任务。'),{code:'EXPORT_TASK_MISMATCH'});
   const type=options.format==='pdf'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
   if(response.headers.get('content-type')?.split(';')[0]!==type)throw new Error('下载文件格式不匹配。');
   const blob=await response.blob();await identity();if(run!==epoch||invalid)throw new Error('登录状态已变化，下载已取消。');
   const object=URL.createObjectURL(blob),a=document.createElement('a'),encoded=response.headers.get('content-disposition')?.match(/filename\*=UTF-8''([^;]+)/)?.[1];a.href=object;a.download=encoded?decodeURIComponent(encoded):'我的生物学组卷.'+options.format;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(object),60000);
   return {taskId:response.headers.get('x-ander-export-task')||task?.taskId||null,reused:response.headers.get('x-ander-export-reused')==='true'};
  }
  async function refreshSession(){if(checking||invalid||!context&&!trainingClient||document.hidden)return;checking=true;emit('suspend');try{if(!context&&trainingClient){const s=await request('/api/account/session');if(s.authenticated!==false){invalidate();return;}}else await identity();emit('resume');}catch(e){if(!invalid)emit('unavailable');}finally{checking=false;}}
  const hidden=()=>{if(document.hidden){epoch++;for(const c of pending)c.abort();emit('suspend');}else refreshSession();};
  document.addEventListener('visibilitychange',hidden);window.addEventListener('focus',refreshSession);window.addEventListener('ander:account-changed',invalidate);window.addEventListener('pagehide',()=>{epoch++;for(const c of pending)c.abort();emit('suspend');});window.addEventListener('pageshow',e=>{if(e.persisted)refreshSession();});
  try{accounts=new BroadcastChannel('ander-account-session');favorites=new BroadcastChannel('ander-question-favorites');baskets=new BroadcastChannel('ander-question-library');accounts.onmessage=invalidate;favorites.onmessage=baskets.onmessage=()=>{if(!invalid)emit('refresh');};}catch{/* pre-write and focus checks remain mandatory */}
  return {initialize,initializeTraining,saveTrainingDraft,takeTrainingDraft,request,mutate,favorite,downloadBasket,get context(){return context;},answers:items=>request('/api/questions/answers',{releaseId:items[0]?.releaseId,items:items.map(q=>({questionId:q.questionId,version:q.version})),contextRevision:context}),subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
 }
 window.AnderLibraryAPI={create};
})();
