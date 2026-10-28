import {mountProcessShell} from './process-shell.js';
let shellAdapter=null;
import {DURATION,STARTS,stateAt,stageAt,clamp} from './engine.js';
import {PhotosynthesisRenderer} from './renderer.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"photosynthesis","version":"2.1.0","publish":true,"title":{"zh":"光合作用的过程","en":"Photosynthesis"},"summary":{"zh":"在叶绿体中追踪光反应、卡尔文循环，以及 ATP 和 NADPH 的产生、利用与辅酶回流。","en":"Follow light reactions, the Calvin cycle and the supply and reuse of ATP and NADPH in a chloroplast."},"module":{"id":"cell-metabolism","zh":"必修一 · 分子与细胞","en":"Molecules & Cells"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"light","title":{"zh":"光反应","en":"Light reactions"}},{"id":"calvin","title":{"zh":"暗反应","en":"Calvin cycle"}},{"id":"coupled","title":{"zh":"两阶段协同","en":"Coupled reactions"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","model.js","brand-watermark.js","process-shell.js","lab-gesture.js"],"styles":["model.css","brand-watermark.css","process-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=s=>document.querySelector(s),area=$('.model-area'),stages=ANDER_MODEL_MANIFEST.stages;
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(node=>[node.dataset.action,node]));
const refs={slider:$('#time-slider'),output:$('#time-output'),title:$('#caption-title'),note:$('#caption-note'),status:$('#process-status'),announcement:$('#announcement')};
// Reused from cellular-respiration@2.1.1: seconds clock, semantic control cache,
// pointerdown pause, visibility lifecycle, and the unchanged 1.0 host protocol.
const presentations=new WeakMap(),views=['overview','light','calvin'],viewNames=['总览','光反应','暗反应'];
let time=0,playing=false,speed=1,labels=true,view='overview';
let frame=0,lastSeconds=null,lastPost=0,reportedStage=-1,disposed=false,hostOrigin='*';
const renderer=new PhotosynthesisRenderer($('#photosynthesis-scene'));
$('.stage-strip').innerHTML=stages.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')];
const putText=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
function updateControl(button,kind,value='',pressed){
 const full=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
 const key=JSON.stringify([kind,value,pressed,full]);if(presentations.get(button)===key)return;
 AnderModelShell.setControl(button,kind,value,pressed);presentations.set(button,key);
}
function post(type,payload,requestId){if(parent===window)return;const message={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)message.requestId=requestId;parent.postMessage(message,hostOrigin);}
function getState(){const science=stateAt(time);return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready:true,time,duration:DURATION,progress:time/DURATION,playing,speed,labels,view,stageIndex:science.stage,stageId:stages[science.stage].id,science,rendering:renderer.getDiagnostics()};}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null;}
function schedule(){if(!disposed&&!document.hidden&&!frame&&playing)frame=requestAnimationFrame(tick);}
function announce(){const s=stateAt(time);putText(refs.announcement,`${stages[s.stage].title.zh}。${s.note}${playing?'':'已暂停。'}`);}
function render(notify=false){
 const s=stateAt(time);renderer.draw(s,labels,view);
 const percent=Math.round(s.progress*100),value=String(Math.round(s.progress*10000));if(refs.slider.value!==value)refs.slider.value=value;
 refs.slider.setAttribute('aria-valuetext',`${percent}%，${stages[s.stage].title.zh}`);putText(refs.output,percent+'%');
 putText(refs.title,`${s.completed?'完整过程':stages[s.stage].title.zh}${playing?' · 播放中':''}`);putText(refs.note,s.note);
 putText(refs.status,s.completed?'演示完成 · 可回退观察':s.stage===2?'光反应与暗反应持续协同':s.stage===1?'CO₂ 固定 → C₃ 还原 → C₅ 再生':'光能 → 化学能');
 updateControl(controls.play,playing?'pause':'play',playing?'暂停':s.completed?'重播':time>0?'继续':'播放');
 for(const kind of ['reset','prev','next'])updateControl(controls[kind],kind);
 updateControl(controls.speed,'speed',String(speed));updateControl(controls.labels,'labels','标签',labels);updateControl(controls.view,'view','视角');
 controls.view.title=`当前：${viewNames[views.indexOf(view)]}；点击切换`;
 controls.prev.disabled=time===0;controls.next.disabled=s.completed;
 if(s.stage!==reportedStage){reportedStage=s.stage;stageButtons.forEach((button,i)=>{button.classList.toggle('is-active',i===s.stage);button.setAttribute('aria-pressed',String(i===s.stage));});AnderModelShell.syncActiveStage();post('model:stage-changed',{stageIndex:s.stage,stageId:stages[s.stage].id});}
 shellAdapter?.sync();if(notify)post('model:state',getState());schedule();
}
function play(){if(time>=DURATION)time=0;playing=true;lastSeconds=null;render(true);announce();}
function pause(){playing=false;stopClock();render(true);announce();}
function reset(){playing=false;stopClock();time=0;render(true);announce();}
function seek(value){if(!Number.isFinite(value))throw new RangeError('进度必须为有限数值。');playing=false;stopClock();time=clamp(value,0,DURATION);render(true);announce();}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=STARTS.length)throw new RangeError('无效阶段。');seek(STARTS[i]);}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw new RangeError('速度须为0.25–4倍。');speed=value;lastSeconds=null;render(true);}
function setLabels(value){if(typeof value!=='boolean')throw new TypeError('标签开关须为布尔值。');labels=value;render(true);}
function setView(value){if(!views.includes(value))throw new RangeError('无效视角。');view=value;render(true);$('.art-scroll').scrollTo(0,0);}
function tick(stamp){frame=0;if(disposed||document.hidden||!playing)return;const seconds=stamp*.001;
 if(lastSeconds!==null){time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed);if(time>=DURATION)playing=false;}
 lastSeconds=seconds;render();if(seconds-lastPost>.25){lastPost=seconds;post('model:progress',{time,duration:DURATION,progress:time/DURATION,stageIndex:stageAt(time)});}
 if(!playing){lastSeconds=null;post('model:state',getState());announce();}
}
refs.slider.addEventListener('pointerdown',event=>{if(event.button===0&&playing)pause();});refs.slider.addEventListener('input',()=>seek(Number(refs.slider.value)/10000*DURATION));refs.slider.addEventListener('change',announce);
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>seek(STARTS.filter(t=>t<time-1e-7).at(-1)??0));controls.next.addEventListener('click',()=>seek([...STARTS,DURATION].find(t=>t>time+1e-7)??DURATION));
controls.speed.addEventListener('click',()=>{const options=[.5,1,1.5,2];setSpeed(options[(options.indexOf(speed)+1)%options.length]);});controls.labels.addEventListener('click',()=>setLabels(!labels));controls.view.addEventListener('click',()=>setView(views[(views.indexOf(view)+1)%views.length]));
stageButtons.forEach((button,i)=>button.addEventListener('click',()=>jumpStage(i)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else render();});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA|A/.test(event.target.tagName)){event.preventDefault();playing?pause():play();}});
const visibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)pause();});visibility.observe(area);
window.addEventListener('message',event=>{
 const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
 if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const p=m.payload||{};
 try{switch(m.type){case'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;
 case'host:set-stage':{const index=p.stageId??p.stage??p.stageIndex;jumpStage(typeof index==='string'?stages.findIndex(s=>s.id===index):index);break;}
 case'host:set-speed':setSpeed(p.speed);break;case'host:set-labels':setLabels(p.visible??p.enabled??p.labels);break;case'host:set-view':setView(p.view??p.preset??p.viewId);break;default:throw new Error('本模型不支持此宿主操作。');}
 post('model:state',getState(),m.requestId);}catch(error){post('model:error',{message:error.message},m.requestId);}
});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();visibility.disconnect();});window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;visibility.observe(area);render();}});
window.PhotosynthesisModel=Object.freeze({getState,play,pause,reset,seek,setSpeed,jumpStage,setLabels,setView});
shellAdapter=mountProcessShell({manifest:ANDER_MODEL_MANIFEST,getState,post,pause,setView});
render();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
