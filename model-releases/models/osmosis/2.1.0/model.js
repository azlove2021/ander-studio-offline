import{experiment,DURATION,STAGE_TIMES,stageAt,clamp,liquidPalette,liquids}from'./engine.js';
import{OsmosisRenderer}from'./renderer.js';
import{mountOsmosisShell}from'./osmosis-shell.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"osmosis","version":"2.1.0","publish":true,"title":{"zh":"渗透作用","en":"Osmosis"},"summary":{"zh":"选择漏斗内外液体，同步观察连续液面变化、半透膜两侧粒子与双向水分子运动。","en":"Compare liquids inside and outside a thistle funnel, with coupled liquid levels, solute concentrations and bidirectional water exchange."},"module":{"id":"cell-metabolism","zh":"必修一 · 分子与细胞","en":"Molecules & Cells"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"initial","title":{"zh":"初始条件","en":"Initial conditions"}},{"id":"osmosis","title":{"zh":"净渗透与液面变化","en":"Net osmosis"}},{"id":"approaching","title":{"zh":"趋近平衡","en":"Approaching equilibrium"}},{"id":"equilibrium","title":{"zh":"动态平衡","en":"Dynamic equilibrium"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","physics.js","engine.js","brownian.js","scene.js","renderer.js","lab-gesture.js","osmosis-shell.js","model.js","brand-watermark.js"],"styles":["model.css","osmosis-layout.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=selector=>document.querySelector(selector),area=$('.model-area'),stages=ANDER_MODEL_MANIFEST.stages;
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(e=>[e.dataset.action,e]));
const refs={slider:$('#time-slider'),output:$('#time-output'),inside:$('#inside-liquid'),outside:$('#outside-liquid'),note:$('#state-note'),status:$('#playback-state'),announcement:$('#announcement')};
const presentations=new WeakMap(),views=['overview','apparatus','membrane'],viewNames=['总览','装置','半透膜局部'];
const scrubPointers=new Set();
let exp=experiment(),time=0,playing=false,speed=1,labels=true,view=matchMedia('(max-width:599px) and (orientation:portrait)').matches?'apparatus':'overview';
let shellAdapter=null;
let frame=0,lastSeconds=null,lastPost=0,reportedStage=-1,disposed=false,hostOrigin='*';
const renderer=new OsmosisRenderer($('#scene-host'),exp.at(0));renderer.setExperiment(exp);
$('.stage-strip').innerHTML=stages.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')];
const putText=(el,value)=>{if(el.textContent!==value)el.textContent=value};
function updateControl(button,kind,value='',pressed){
 const full=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
 const key=JSON.stringify([kind,value,pressed,full]);if(presentations.get(button)===key)return;
 // Keep button descendants connected from pointerdown through pointerup.
 AnderModelShell.setControl(button,kind,value,pressed);presentations.set(button,key);
}
function post(type,payload,requestId){
 if(parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};
 if(requestId!==undefined)m.requestId=requestId;parent.postMessage(m,hostOrigin);
}
function getState(){return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready:true,playing,speed,time,duration:DURATION,progress:time/DURATION,stageIndex:stageAt(time),stageId:stages[stageAt(time)].id,labels,view,liquids:{inside:exp.inside,outside:exp.outside},science:exp.at(time),crossingCounts:exp.counts(time),rendering:renderer.getDiagnostics()};}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null;}
function schedule(){if(!disposed&&!document.hidden&&!frame&&playing)frame=requestAnimationFrame(tick);}
function announce(){putText(refs.announcement,`${stages[stageAt(time)].title.zh}。${exp.at(time).note}${playing?'':'画面已暂停。'}`);}
function render(notify=false){
 const s=exp.at(time);renderer.draw(s,labels,view);
 const percent=Math.round(time/DURATION*100),slider=String(Math.round(time/DURATION*10000));
 if(refs.slider.value!==slider)refs.slider.value=slider;
 refs.slider.setAttribute('aria-valuetext',`${percent}%，${stages[s.stage].title.zh}`);putText(refs.output,percent+'%');
 putText(refs.note,s.note);putText(refs.status,playing?'正在观察':time===0?'准备观察':time>=DURATION?'观察结束 · 画面已暂停':'已暂停');
 updateControl(controls.play,playing?'pause':'play',playing?'暂停':time>=DURATION?'重播':time>0?'继续':'播放');
 for(const kind of['reset','prev','next'])updateControl(controls[kind],kind);
 updateControl(controls.speed,'speed',String(speed));updateControl(controls.labels,'labels','标签',labels);updateControl(controls.view,'view','视角');
 const vi=views.indexOf(view);controls.view.title=`当前：${viewNames[vi]}；点击切换为${viewNames[(vi+1)%3]}`;
 controls.prev.disabled=time===0;controls.next.disabled=time>=DURATION;
 if(s.stage!==reportedStage){
  reportedStage=s.stage;stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===s.stage);b.setAttribute('aria-pressed',String(i===s.stage));});
  AnderModelShell.syncActiveStage();post('model:stage-changed',{stageIndex:s.stage,stageId:stages[s.stage].id});
  if(time>0)announce();
 }
 shellAdapter?.sync();if(notify)post('model:state',getState());schedule();
}
function play(){if(scrubPointers.size)return;if(time>=DURATION)time=0;playing=true;lastSeconds=null;render(true);announce();}
function pause(){playing=false;stopClock();render(true);announce();}
function reset(){playing=false;stopClock();time=0;render(true);announce();}
function seek(t){if(!Number.isFinite(t))throw new RangeError('进度必须为有限数值。');playing=false;stopClock();time=clamp(t,0,DURATION);render(true);announce();}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=stages.length)throw new RangeError('无效阶段。');seek(STAGE_TIMES[i]);}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw new RangeError('速度须为 0.25–4 倍。');speed=value;lastSeconds=null;render(true);}
function setLabels(value){if(typeof value!=='boolean')throw new TypeError('标签开关须为布尔值。');labels=value;render(true);}
function setView(value){if(!views.includes(value))throw new RangeError('无效视角。');view=value;render(true);$('.art-scroll').scrollTo(0,0);}
function setLiquids(inside,outside){
 const next=experiment(inside,outside);playing=false;stopClock();time=0;exp=next;renderer.setExperiment(exp);
 refs.inside.value=inside;refs.outside.value=outside;
 for(const [side,id]of[['inside',inside],['outside',outside]])$('#'+side+'-mark').style.background=liquidPalette(liquids[id].concentration).edge;
 render(true);announce();return getState();
}
function tick(stamp){
 frame=0;if(disposed||document.hidden||!playing)return;const seconds=stamp*.001;
 if(lastSeconds!==null){time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed);if(time>=DURATION)playing=false;}
 lastSeconds=seconds;render();
 if(seconds-lastPost>.25){lastPost=seconds;post('model:progress',{time,duration:DURATION,progress:time/DURATION,stageIndex:stageAt(time)});}
 if(!playing){lastSeconds=null;post('model:state',getState());announce();}
}
refs.inside.addEventListener('change',()=>setLiquids(refs.inside.value,refs.outside.value));
refs.outside.addEventListener('change',()=>setLiquids(refs.inside.value,refs.outside.value));
refs.slider.addEventListener('pointerdown',event=>{if(event.button===0){scrubPointers.add(event.pointerId);pause();}});
for(const type of ['pointerup','pointercancel','lostpointercapture'])addEventListener(type,event=>scrubPointers.delete(event.pointerId));
addEventListener('blur',()=>scrubPointers.clear());addEventListener('pagehide',()=>scrubPointers.clear());
document.addEventListener('visibilitychange',()=>{if(document.hidden)scrubPointers.clear();});
refs.slider.addEventListener('input',()=>seek(Number(refs.slider.value)/10000*DURATION));
refs.slider.addEventListener('change',()=>{const t=Number(refs.slider.value)/10000*DURATION;if(Math.abs(t-time)>DURATION/10000)seek(t);else announce();});
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>seek(STAGE_TIMES.filter(t=>t<time-1e-7).at(-1)??0));
controls.next.addEventListener('click',()=>seek([...STAGE_TIMES,DURATION].find(t=>t>time+1e-7)??DURATION));
controls.speed.addEventListener('click',()=>{const options=[.5,1,1.5,2];setSpeed(options[(options.indexOf(speed)+1)%options.length]);});
controls.labels.addEventListener('click',()=>setLabels(!labels));controls.view.addEventListener('click',()=>setView(views[(views.indexOf(view)+1)%3]));
stageButtons.forEach((button,i)=>button.addEventListener('click',()=>jumpStage(i)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else render();});
document.addEventListener('keydown',event=>{
 if(event.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA|A/.test(event.target.tagName)){event.preventDefault();playing?pause():play();}
});
const visibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)pause();});visibility.observe(area);
window.addEventListener('message',event=>{
 const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
 if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;
 const p=m.payload||{};
 try{
  switch(m.type){
   case'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;
   case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;
   case'host:set-stage':{const s=p.stageId??p.stage??p.stageIndex;jumpStage(typeof s==='string'?stages.findIndex(v=>v.id===s):s);break;}
   case'host:set-speed':setSpeed(p.speed);break;
   case'host:set-labels':setLabels(p.visible??p.enabled??p.labels);break;
   case'host:set-view':setView(p.view??p.preset??p.viewId);break;
   default:throw new Error('本模型不支持此宿主操作。');
  }
  post('model:state',getState(),m.requestId);
 }catch(error){post('model:error',{message:error.message},m.requestId);}
});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();visibility.disconnect();});
window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;visibility.observe(area);render();}});
window.OsmosisModel=Object.freeze({getState,play,pause,reset,seek,setLiquids,setSpeed,jumpStage,setLabels,setView});
shellAdapter=mountOsmosisShell({manifest:ANDER_MODEL_MANIFEST,getState,post,pause,setView});
setLiquids('high','water');post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
