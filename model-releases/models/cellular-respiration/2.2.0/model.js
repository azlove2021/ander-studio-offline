import {mountProcessShell} from './process-shell.js';
let shellAdapter=null;
import{MODES,config,stateAt,stageAt,clamp}from'./engine.js';
import{RespirationRenderer}from'./renderer.js';
// Manifest embedded by the package preparation script.
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"cellular-respiration","version":"2.2.0","publish":true,"title":{"zh":"细胞呼吸的过程","en":"Cellular Respiration"},"summary":{"zh":"在统一细胞图中追踪有氧呼吸、乳酸发酵和酒精发酵的物质转化、反应场所与 ATP 产生。","en":"Follow aerobic respiration, lactate fermentation and alcoholic fermentation in one eukaryotic cell diagram."},"module":{"id":"cell-metabolism","zh":"必修一 · 分子与细胞","en":"Molecules & Cells"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"glycolysis","title":{"zh":"糖酵解","en":"Glycolysis"}},{"id":"second","title":{"zh":"丙酮酸彻底氧化","en":"Pyruvate oxidation & TCA"}},{"id":"oxidative","title":{"zh":"氧化磷酸化","en":"Oxidative phosphorylation"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","scene.js","renderer.js","model.js","brand-watermark.js","process-shell.js","lab-gesture.js"],"styles":["model.css","brand-watermark.css","process-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=s=>document.querySelector(s),area=$('.model-area'),stages=ANDER_MODEL_MANIFEST.stages;
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(e=>[e.dataset.action,e]));
const refs={slider:$('#time-slider'),output:$('#time-output'),title:$('#caption-title'),note:$('#caption-note'),energy:$('#energy-note'),announcement:$('#announcement')};
const presentations=new WeakMap(),views=['overview','cytosol','mitochondrion'],viewNames=['总览','细胞质基质','线粒体'];
let mode='aerobic',time=0,playing=false,speed=1,labels=true,view='overview';
let frame=0,lastSeconds=null,lastPost=0,reportedStage=-1,disposed=false,hostOrigin='*';
const renderer=new RespirationRenderer($('#respiration-scene'));
$('.stage-strip').innerHTML=stages.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')],modeButtons=[...document.querySelectorAll('[data-mode]')];
const putText=(el,value)=>{if(el.textContent!==value)el.textContent=value};
// Adapted from osmosis@2.0.0: a semantic cache avoids replacing descendants
// under a held pointer; timeline dragging always pauses the one global clock.
function updateControl(button,kind,value='',pressed){
 const full=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
 const key=JSON.stringify([kind,value,pressed,full]);if(presentations.get(button)===key)return;
 AnderModelShell.setControl(button,kind,value,pressed);presentations.set(button,key);
}
function post(type,payload,requestId){if(parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)m.requestId=requestId;parent.postMessage(m,hostOrigin)}
function getState(){const c=config(mode),science=stateAt(mode,time);return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready:true,mode,playing,speed,time,duration:c.duration,progress:time/c.duration,stageIndex:science.stage,stageId:stages[science.stage].id,labels,view,availableStages:c.starts.length,science,rendering:renderer.getDiagnostics()}}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null}
function schedule(){if(!disposed&&!document.hidden&&!frame&&playing)frame=requestAnimationFrame(tick)}
function announce(){const s=stateAt(mode,time);putText(refs.announcement,`${config(mode).title}。${config(mode).stages[s.stage][0]}。${s.note}${playing?'':'已暂停。'}`)}
function render(notify=false){
 const c=config(mode),s=stateAt(mode,time);renderer.draw(s,labels,view);
 const percent=Math.round(s.progress*100),value=String(Math.round(s.progress*10000));if(refs.slider.value!==value)refs.slider.value=value;
 refs.slider.setAttribute('aria-valuetext',`${percent}%，${c.stages[s.stage][0]}`);putText(refs.output,percent+'%');
 putText(refs.title,`${c.title} · ${s.completed?'全过程完成':'第'+(s.stage+1)+'阶段'}${playing?' · 播放中':''}`);putText(refs.note,s.note);putText(refs.energy,c.energy);
 updateControl(controls.play,playing?'pause':'play',playing?'暂停':s.completed?'重播':time>0?'继续':'播放');
 for(const kind of['reset','prev','next'])updateControl(controls[kind],kind);
 updateControl(controls.speed,'speed',String(speed));updateControl(controls.labels,'labels','标签',labels);updateControl(controls.view,'view','视角');
 controls.view.title=`当前：${viewNames[views.indexOf(view)]}；点击切换视角`;
 controls.prev.disabled=time===0;controls.next.disabled=s.completed;
 if(s.stage!==reportedStage){reportedStage=s.stage;stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===s.stage);b.setAttribute('aria-pressed',String(i===s.stage))});AnderModelShell.syncActiveStage();post('model:stage-changed',{stageIndex:s.stage,stageId:stages[s.stage].id});}
 shellAdapter?.sync();if(notify)post('model:state',getState());schedule();
}
function play(){if(time>=config(mode).duration)time=0;playing=true;lastSeconds=null;render(true);announce()}
function pause(){playing=false;stopClock();render(true);announce()}
function reset(){playing=false;stopClock();time=0;render(true);announce()}
function seek(t){if(!Number.isFinite(t))throw new RangeError('进度必须为有限数值。');playing=false;stopClock();time=clamp(t,0,config(mode).duration);render(true);announce()}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=config(mode).starts.length)throw new RangeError('当前呼吸方式没有此阶段。');seek(config(mode).starts[i])}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw new RangeError('速度须为 0.25–4 倍。');speed=value;lastSeconds=null;render(true)}
function setLabels(value){if(typeof value!=='boolean')throw new TypeError('标签开关须为布尔值。');labels=value;render(true)}
function setView(value){if(!views.includes(value))throw new RangeError('无效视角。');view=value;render(true);$('.art-scroll').scrollTo(0,0)}
function setMode(value){
 const c=config(value);playing=false;stopClock();mode=value;time=0;reportedStage=-1;
 // Only a user-triggered mode change updates stage titles, never an animation frame.
 stageButtons.forEach((button,i)=>{button.innerHTML=AnderModelShell.stageContent(i,...c.stages[i]);button.disabled=i>=c.starts.length;button.title=button.disabled?'该发酵途径只有两个阶段':''});
 modeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
 render(true);announce();return getState();
}
function tick(stamp){frame=0;if(disposed||document.hidden||!playing)return;const seconds=stamp*.001;
 if(lastSeconds!==null){time=Math.min(config(mode).duration,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed);if(time>=config(mode).duration)playing=false;}
 lastSeconds=seconds;render();if(seconds-lastPost>.25){lastPost=seconds;post('model:progress',{time,duration:config(mode).duration,progress:time/config(mode).duration,stageIndex:stageAt(mode,time)})}
 if(!playing){lastSeconds=null;post('model:state',getState());announce()}
}
refs.slider.addEventListener('pointerdown',event=>{if(event.button===0&&playing)pause()});refs.slider.addEventListener('input',()=>seek(Number(refs.slider.value)/10000*config(mode).duration));refs.slider.addEventListener('change',announce);
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>seek(config(mode).starts.filter(t=>t<time-1e-7).at(-1)??0));controls.next.addEventListener('click',()=>seek([...config(mode).starts,config(mode).duration].find(t=>t>time+1e-7)??config(mode).duration));
controls.speed.addEventListener('click',()=>{const options=[.5,1,1.5,2];setSpeed(options[(options.indexOf(speed)+1)%options.length])});controls.labels.addEventListener('click',()=>setLabels(!labels));controls.view.addEventListener('click',()=>setView(views[(views.indexOf(view)+1)%3]));
stageButtons.forEach((button,i)=>button.addEventListener('click',()=>jumpStage(i)));modeButtons.forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else render()});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA|A/.test(event.target.tagName)){event.preventDefault();playing?pause():play()}});
const visibility=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&playing)pause()});visibility.observe(area);
window.addEventListener('message',event=>{
 const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
 if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const p=m.payload||{};
 try{switch(m.type){case'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;
 case'host:set-stage':{const s=p.stageId??p.stage??p.stageIndex;jumpStage(typeof s==='string'?stages.findIndex(v=>v.id===s):s);break}
 case'host:set-speed':setSpeed(p.speed);break;case'host:set-labels':setLabels(p.visible??p.enabled??p.labels);break;case'host:set-view':setView(p.view??p.preset??p.viewId);break;default:throw new Error('本模型不支持此宿主操作。')}
 post('model:state',getState(),m.requestId)}catch(error){post('model:error',{message:error.message},m.requestId)}
});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();visibility.disconnect()});window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;visibility.observe(area);render()}});
window.CellularRespirationModel=Object.freeze({getState,play,pause,reset,seek,setMode,setSpeed,jumpStage,setLabels,setView});
shellAdapter=mountProcessShell({manifest:ANDER_MODEL_MANIFEST,getState,post,pause,setView});
setMode('aerobic');post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
