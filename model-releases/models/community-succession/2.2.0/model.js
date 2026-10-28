import {mountEcologyShell} from './ecology-shell.js';
import{DURATION,TIMES,STAGES,clamp,stageAt,getScience}from'./engine.js?v=2.1.1';
import{loadAssets,SuccessionRenderer}from'./renderer.js?v=2.1.1';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"community-succession","version":"2.2.0","publish":true,"title":{"zh":"群落的演替","en":"Ecological Succession"},"summary":{"zh":"独立选择初生或次生演替进度，比较裸岩定居与火后恢复；写实土壤剖面可按需开启。","en":"Choose separate primary and secondary succession timelines, with optional realistic soil cutaways."},"module":{"id":"ecology","zh":"选择性必修二 · 生物与环境","en":"Biology & Environment"},"technology":"canvas-2d-interactive","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"initial","title":{"zh":"初始条件","en":"Initial sites"}},{"id":"pioneers","title":{"zh":"先锋定居","en":"Pioneer establishment"}},{"id":"expansion","title":{"zh":"植被扩展","en":"Vegetation expansion"}},{"id":"turnover","title":{"zh":"群落更替","en":"Community turnover"}},{"id":"woodland","title":{"zh":"木本发展","en":"Woody establishment"}},{"id":"forest","title":{"zh":"森林形成","en":"Forest development"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","ecology-shell.js","model.js","brand-watermark.js"],"styles":["model.css","ecology-layout.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
let ecology=null;
const $=s=>document.querySelector(s),area=$('.model-area');
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(e=>[e.dataset.action,e]));
// Copied from species-interactions@2.0.1 / population-growth@2.2.1:
// preserve button child nodes through pointer-down/up while playback renders.
const controlPresentations=new WeakMap();
function updateControl(button,kind,value=''){
 const active=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
 const key=JSON.stringify([kind,value,active]);if(controlPresentations.get(button)===key)return;
 AnderModelShell.setControl(button,kind,value);controlPresentations.set(button,key);
}
const refs={slider:$('#progress-slider'),progress:$('#progress-value'),soil:$('#soil-toggle'),loading:$('.loading-status'),announcement:$('#announcement'),mode:$('#succession-kind'),timelineLabel:$('#timeline-label')};
let time=0,playing=false,speed=1,labels=true,soil=false,ready=false,renderer=null;
let assets=null,soilRequested=false,soilLoading=false,soilRequest=0,firstSceneMs=null,readyMs=null;
let frame=0,lastSeconds=null,lastPost=0,reportedStage=-1,hostOrigin='*',disposed=false;
let activeKind='primary';
const timelines={primary:{time:0,speed:1},secondary:{time:0,speed:1}};
const kindName={primary:'初生演替',secondary:'次生演替'};
function scienceForScenes(){timelines[activeKind]={time,speed};return getScience(timelines.primary.time,timelines.secondary.time)}
function selectKind(kind){if(!Object.hasOwn(timelines,kind))throw RangeError('无效的演替类型。');if(kind===activeKind)return;timelines[activeKind]={time,speed};playing=false;stopClock();activeKind=kind;({time,speed}=timelines[kind]);reportedStage=-1;render({notify:true});announce()}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
$('.stage-strip').innerHTML=STAGES.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')];
function post(type,payload,requestId){if(parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)m.requestId=requestId;parent.postMessage(m,hostOrigin)}
function getState(){const science=scienceForScenes();return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready,playing,speed,time,duration:DURATION,progress:time/DURATION,stage:stageAt(time),stageId:STAGES[stageAt(time)].id,labels,soil,loading:{initialSceneReady:!!renderer,soilRequested,soilLoading,firstSceneMs,readyMs},stageTimes:[...TIMES],activeKind,timelines:Object.fromEntries(Object.entries(timelines).map(([k,v])=>[k,{...v,playing:playing&&k===activeKind,progress:v.time/DURATION}])),timeMeaning:'Independent illustrative progress for each succession type; not ecological years',science}}
function schedule(){if(!disposed&&!document.hidden&&playing&&!frame)frame=requestAnimationFrame(tick)}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null}
function announce(){const s=scienceForScenes();refs.announcement.textContent=`当前控制${kindName[activeKind]}，进程 ${Math.round(time/DURATION*100)}%，${s[activeKind].name}。${playing?'正在播放':'已暂停'}，另一侧进度保留。`}
function render({notify=false}={}){
 const science=scienceForScenes(),stage=stageAt(time),v=String(Math.round(time/DURATION*10000));if(refs.slider.value!==v)refs.slider.value=v;
 refs.progress.textContent=Math.round(time/DURATION*100)+'%';refs.slider.setAttribute('aria-valuetext',`${refs.progress.textContent}，${STAGES[stage].title.zh}，非等时`);
 refs.soil.checked=soilRequested;refs.soil.setAttribute('aria-busy',String(soilLoading));refs.mode.value=activeKind;refs.timelineLabel.textContent=kindName[activeKind];refs.slider.setAttribute('aria-label',kindName[activeKind]+'独立进程');
 for(const k of['primary','secondary']){$('#'+k+'-stage').textContent=science[k].name;$('#'+k+'-note').textContent=science[k].note;const h=document.querySelector('.scene-heading[data-kind='+k+']');h.classList.toggle('is-current',k===activeKind);h.querySelector('.site-tag').textContent=Math.round(timelines[k].time/DURATION*100)+'% · '+(k===activeKind?'当前控制':'进度保留')}
 renderer?.draw(science,{labels,soil,reduced:reduced.matches});
 updateControl(controls.play,playing?'pause':'play',playing?'暂停':time>=DURATION?'重播':'播放');
 for(const kind of['reset','prev','next'])updateControl(controls[kind],kind);
 updateControl(controls.speed,'speed',String(speed));updateControl(controls.labels,'labels');controls.labels.setAttribute('aria-pressed',String(labels));controls.labels.classList.toggle('is-active',labels);
 for(const b of Object.values(controls))b.disabled=!ready;controls.prev.disabled=!ready||time<=0;controls.next.disabled=!ready||time>=DURATION;
 refs.slider.disabled=!ready;refs.soil.disabled=!ready;refs.mode.disabled=!ready;stageButtons.forEach(b=>b.disabled=!ready);
 if(stage!==reportedStage){stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===stage);b.setAttribute('aria-pressed',String(i===stage))});AnderModelShell.syncActiveStage();reportedStage=stage;post('model:stage-changed',{stageIndex:stage,stageId:STAGES[stage].id})}
 ecology?.sync();
  if(notify)post('model:state',getState());schedule();
}
function requireReady(){if(!ready)throw Error('生态场景尚未载入。')}
function seek(value){if(!Number.isFinite(value))throw RangeError('进程必须为有限数值。');requireReady();playing=false;stopClock();time=clamp(value,0,DURATION);render({notify:true});announce()}
function pause(){playing=false;stopClock();render({notify:true});announce()}
function play(){requireReady();if(time>=DURATION)time=0;playing=true;lastSeconds=null;render({notify:true})}
function reset(){playing=false;stopClock();time=0;render({notify:true});announce()}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=STAGES.length)throw RangeError('无效阶段。');seek(TIMES[i])}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw RangeError('速度须为 0.25–4 倍。');speed=value;render({notify:true})}
function setLabels(value){if(typeof value!=='boolean')throw TypeError('标签状态须为布尔值。');labels=value;render({notify:true})}
function setSoil(value){
 if(typeof value!=='boolean')throw TypeError('剖面状态须为布尔值。');requireReady();
 const request=++soilRequest;soilRequested=value;refs.loading.classList.remove('is-error');
 if(!value||assets.images['soil-profiles-atlas']){soil=value;soilLoading=false;refs.loading.hidden=true;render({notify:true});return Promise.resolve(value)}
 soilLoading=true;refs.loading.textContent='正在载入土壤剖面…';refs.loading.classList.add('is-background-loading');refs.loading.hidden=false;render({notify:true});
 return assets.ensure(['soil-profiles-atlas']).then(()=>{
  if(request!==soilRequest||disposed)return false;
  soil=true;soilLoading=false;refs.loading.hidden=true;render({notify:true});return true;
 }).catch(()=>{
  if(request!==soilRequest||disposed)return false;
  soilRequested=false;soilLoading=false;refs.loading.textContent='剖面载入失败，请重新勾选重试。';refs.loading.classList.add('is-error');render({notify:true});
  post('model:error',{message:'土壤剖面图片载入失败；其他场景仍可操作。'});return false;
 });
}
function tick(stamp){frame=0;if(disposed||document.hidden)return;const seconds=stamp*.001;if(playing&&lastSeconds!==null){time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed);if(time>=DURATION)playing=false}lastSeconds=seconds;render();if(seconds-lastPost>.3){lastPost=seconds;post('model:progress',{time,duration:DURATION,progress:time/DURATION,stageIndex:stageAt(time)})}if(!playing){lastSeconds=null;post('model:state',getState())}}
refs.slider.addEventListener('pointerdown',e=>{if(e.button===0&&playing)pause()});
refs.slider.addEventListener('input',()=>seek(Number(refs.slider.value)/10000*DURATION));
refs.mode.addEventListener('change',()=>selectKind(refs.mode.value));
refs.soil.addEventListener('change',()=>setSoil(refs.soil.checked));
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>seek(TIMES.filter(t=>t<time-1e-8).at(-1)??0));
controls.next.addEventListener('click',()=>seek(TIMES.find(t=>t>time+1e-8)??DURATION));
controls.speed.addEventListener('click',()=>{const values=[.5,1,1.5,2,4];setSpeed(values[(values.indexOf(speed)+1)%values.length])});controls.labels.addEventListener('click',()=>setLabels(!labels));
stageButtons.forEach((b,i)=>b.addEventListener('click',()=>jumpStage(i)));
const resize=new ResizeObserver(()=>render());resize.observe($('.scene-scroll'));
document.addEventListener('fullscreenchange',()=>render());reduced.addEventListener('change',()=>render());
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;stopClock();post('model:state',getState())}else render()});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&ready&&!/INPUT|BUTTON|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();playing?pause():play()}});
window.addEventListener('message',e=>{
 const m=e.data;if(parent===window||e.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;if(hostOrigin!=='*'&&e.origin!==hostOrigin)return;if(e.origin!=='null')hostOrigin=e.origin;const p=m.payload||{};
 try{switch(m.type){case'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;case'host:set-stage':{const s=p.stageId??p.stage??p.stageIndex;jumpStage(typeof s==='string'?STAGES.findIndex(v=>v.id===s):s);break}case'host:set-speed':setSpeed(p.speed);break;case'host:set-labels':setLabels(p.visible??p.labels??p.enabled);break;default:throw Error('本模型不支持此宿主操作。')}post('model:state',getState(),m.requestId)}catch(error){post('model:error',{message:error.message},m.requestId)}
});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();resize.disconnect()});window.addEventListener('pageshow',e=>{if(e.persisted){disposed=false;resize.observe($('.scene-scroll'));render()}});
window.CommunitySuccessionModel=Object.freeze({getState,getRenderState:()=>renderer?.inspect(),seek,play,pause,reset,setSpeed,setLabels,setSoil,jumpStage,selectKind});
ecology=mountEcologyShell({manifest:ANDER_MODEL_MANIFEST,getState,render,post,selectKind});
render();
async function initializeScene(retry=false){
if(retry){refs.loading.classList.remove('is-error');refs.loading.textContent='正在重新载入生态场景…';refs.loading.hidden=false;}
try{
 assets=await loadAssets(initial=>{
  renderer=new SuccessionRenderer($('#landscape-background'),$('#ecology-canvas'),$('.scene-scroll'),$('.scene-world'),initial);
  refs.loading.textContent='正在准备后续阶段…';refs.loading.classList.add('is-background-loading');render();firstSceneMs=performance.now();
 },retry?String(Date.now()):'');
 ready=true;readyMs=performance.now();refs.loading.hidden=true;render();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
}catch(error){refs.loading.textContent='场景载入失败，请刷新重试。';refs.loading.classList.add('is-error');ecology?.setError(()=>initializeScene(true));post('model:error',{message:error.message});console.error(error)}
}
initializeScene();

