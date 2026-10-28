import {mountRelationshipExperience} from './shell-adapter.js';
import {DEFAULTS,KINDS,DURATION,PLAYBACK_SECONDS,STAGE_TIMES,stageAt,clamp,formatNumber,formatTime,dataFor,sample,axesFor,validateOptions} from './engine.js';
import {RelationshipChart} from './renderer.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"species-interactions","version":"2.0.4","publish":true,"title":{"zh":"种间关系曲线变化","en":"Interspecific Population Dynamics"},"summary":{"zh":"同步观察捕食、寄生、竞争和互利关系；比较周期波动、竞争排斥及解除互利作用后的变化。","en":"Compare predation, parasitism, competition and mutualism with shared time, explicit periodic environments and partner-removal comparisons."},"module":{"id":"ecology","zh":"选择性必修二 · 生物与环境","en":"Biology & Environment"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":false,"highlight":false,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"initial","title":{"zh":"开始观察","en":"Start"}},{"id":"first-period","title":{"zh":"第 1 段结束","en":"First interval"}},{"id":"second-period","title":{"zh":"第 2 段结束","en":"Second interval"}},{"id":"complete","title":{"zh":"完整曲线","en":"Complete curves"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","shell-adapter.js","model.js","brand-watermark.js"],"styles":["model.css","shell-layout.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=selector=>document.querySelector(selector);
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(e=>[e.dataset.action,e]));
const area=$('.model-area'),stages=ANDER_MODEL_MANIFEST.stages;
// Reused from population-growth@2.2.1: a semantic cache prevents the standard
// shell from replacing a pressed SVG/text target between down and up events.
const controlPresentations=new WeakMap();
function updateControl(button,kind,value=''){
  const fullscreenActive=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
  const key=JSON.stringify([kind,value,fullscreenActive]);if(controlPresentations.get(button)===key)return;
  AnderModelShell.setControl(button,kind,value);controlPresentations.set(button,key);
}
const refs={slider:$('#time-slider'),time:$('#time-value'),competition:$('#competition-mode'),mutual:$('#mutualism-mode'),reference:$('#reference-toggle'),separate:$('#separate-toggle'),panels:$('.relationship-panels'),announcement:$('#announcement'),caption:$('#mutual-caption'),playback:$('#playback-state')};
let options={...DEFAULTS},time=0,playing=false,speed=1;
let experience=null;
let frame=0,lastSeconds=null,hostOrigin='*',lastPost=0,reportedStage=-1,disposed=false;
const visible=Object.fromEntries(KINDS.map(k=>[k,[true,true]]));
const charts=Object.fromEntries(KINDS.map(k=>[k,new RelationshipChart($('#'+k+'-chart'),k)]));
const legends=Object.fromEntries(KINDS.map(k=>[k,[...document.querySelectorAll(`[data-kind="${k}"] [data-series]`)]]));
$('.stage-strip').innerHTML=stages.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')];
function post(type,payload,requestId){if(parent===window)return;const msg={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)msg.requestId=requestId;parent.postMessage(msg,hostOrigin);}
function getState(){return {modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready:true,playing,speed,time,duration:DURATION,progress:time/DURATION,stage:stageAt(time),stageId:stages[stageAt(time)].id,options:{...options},populations:Object.fromEntries(KINDS.map(k=>[k,sample(dataFor(k,options),time)])),axes:Object.fromEntries(KINDS.map(k=>[k,[...charts[k].axes]])),visible:Object.fromEntries(KINDS.map(k=>[k,[...visible[k]]])),stageTimes:[...STAGE_TIMES],playbackSeconds:PLAYBACK_SECONDS,periods:{predation:12,competition:12,mutualism:36},cycles:{predation:3,competition:options.competition==='periodic'?3:null,mutualism:options.separate?null:1}};}
function schedule(){if(!disposed&&!document.hidden&&!frame&&playing)frame=requestAnimationFrame(tick);}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null;}
function announce(){refs.announcement.textContent=`时间 t = ${formatTime(time)}，${playing?'正在播放':'已暂停'}，${stages[stageAt(time)].title.zh}。`;}
function render({notify=false}={}){
  const stage=stageAt(time);refs.time.textContent=formatTime(time);
  const sliderValue=String(Math.round(time/DURATION*10000));if(refs.slider.value!==sliderValue)refs.slider.value=sliderValue;
  refs.slider.setAttribute('aria-valuetext',`${formatTime(time)}，共 ${DURATION} 示意时间单位`);
  refs.competition.value=options.competition;refs.mutual.value=options.mutual;refs.reference.checked=options.reference;refs.separate.checked=options.separate;
  for(const kind of KINDS){const value=charts[kind].draw(options,time,visible[kind])||sample(dataFor(kind,options),time);legends[kind].forEach((button,k)=>{button.setAttribute('aria-pressed',String(visible[kind][k]));button.querySelector('output').textContent=formatNumber(value[k?'b':'a']);});}
  refs.caption.textContent=options.separate?(time<18?'共同环境变化 · t = 18 解除互利作用':options.mutual==='obligate'?'解除后衰减 · 本例双方均依赖对方':'解除后仍能独立维持种群'):'共同环境变化 · 1 个周期';
  updateControl(controls.play,playing?'pause':'play',playing?'暂停':time>=DURATION?'重播':'播放');
  for(const kind of ['reset','prev','next'])updateControl(controls[kind],kind);
  updateControl(controls.speed,'speed',String(speed));controls.prev.disabled=time<=0;controls.next.disabled=time>=DURATION;
  refs.playback.textContent=playing?`正在观察 · ${Math.round(time/DURATION*100)}%`:time===0?'准备观察':time>=DURATION?'观察结束':'已暂停';
  if(stage!==reportedStage){stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===stage);b.setAttribute('aria-pressed',String(i===stage));});AnderModelShell.syncActiveStage();reportedStage=stage;post('model:stage-changed',{stageIndex:stage,stageId:stages[stage].id});}
  experience?.sync();if(notify)post('model:state',getState());schedule();
}
function seek(t){if(!Number.isFinite(t))throw new RangeError('时间必须是有限数值。');time=clamp(t,0,DURATION);lastSeconds=null;if(time>=DURATION)playing=false;render({notify:true});announce();}
function pause(){playing=false;stopClock();render({notify:true});announce();}
function play(){if(time>=DURATION)time=0;playing=true;lastSeconds=null;render({notify:true});}
function reset(){playing=false;stopClock();time=0;render({notify:true});announce();}
function setOptions(next){const valid=validateOptions(next,options);playing=false;stopClock();options=valid;render({notify:true});announce();return getState();}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=stages.length)throw new RangeError('无效阶段。');playing=false;stopClock();seek(STAGE_TIMES[i]);}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw new RangeError('播放速度须在 0.25–4 倍之间。');speed=value;render({notify:true});}
function tick(stamp){frame=0;if(disposed||document.hidden)return;const seconds=stamp*.001;if(playing&&lastSeconds!==null){time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed*DURATION/PLAYBACK_SECONDS);if(time>=DURATION)playing=false;}lastSeconds=seconds;render();if(seconds-lastPost>.25){lastPost=seconds;post('model:progress',{time,duration:DURATION,progress:time/DURATION,stageIndex:stageAt(time)});}if(!playing){lastSeconds=null;post('model:state',getState());}}
refs.slider.addEventListener('pointerdown',event=>{if(event.button===0&&playing)pause();});
refs.slider.addEventListener('input',()=>{playing=false;stopClock();time=Number(refs.slider.value)/10000*DURATION;render();});
refs.slider.addEventListener('change',()=>{post('model:state',getState());announce();});
refs.competition.addEventListener('change',()=>setOptions({competition:refs.competition.value}));refs.mutual.addEventListener('change',()=>setOptions({mutual:refs.mutual.value}));refs.reference.addEventListener('change',()=>setOptions({reference:refs.reference.checked}));refs.separate.addEventListener('change',()=>setOptions({separate:refs.separate.checked}));
for(const kind of KINDS)legends[kind].forEach((b,i)=>b.addEventListener('click',()=>{visible[kind][i]=!visible[kind][i];render({notify:true});}));
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>{const past=STAGE_TIMES.filter(t=>t<time-1e-8);playing=false;stopClock();seek(past.at(-1)??0);});
controls.next.addEventListener('click',()=>{const next=STAGE_TIMES.find(t=>t>time+1e-8);playing=false;stopClock();seek(next??DURATION);});
controls.speed.addEventListener('click',()=>{const values=[.5,1,1.5,2,4];setSpeed(values[(values.indexOf(speed)+1)%values.length]);});stageButtons.forEach((b,i)=>b.addEventListener('click',()=>jumpStage(i)));
const resize=new ResizeObserver(()=>render());resize.observe($('.plots-scroll'));resize.observe(refs.panels);
document.addEventListener('fullscreenchange',()=>render());
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;stopClock();post('model:state',getState());}else render();});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA/.test(event.target.tagName)){event.preventDefault();playing?pause():play();}});
window.addEventListener('message',event=>{const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const payload=m.payload||{};try{switch(m.type){case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;case 'host:play':play();break;case 'host:pause':pause();break;case 'host:reset':reset();break;case 'host:set-stage':{const s=payload.stageId??payload.stage??payload.stageIndex;const i=typeof s==='string'?stages.findIndex(v=>v.id===s):s;jumpStage(i);break;}case 'host:set-speed':setSpeed(payload.speed);break;default:throw new Error('本模型不支持此宿主操作。');}post('model:state',getState(),m.requestId);}catch(error){post('model:error',{message:error.message},m.requestId);}});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();resize.disconnect();});
window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;resize.observe($('.plots-scroll'));resize.observe(refs.panels);render();}});
window.SpeciesInteractionsModel=Object.freeze({getState,seek,play,pause,reset,setOptions,setSpeed,jumpStage});
render();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});

queueMicrotask(()=>{experience=mountRelationshipExperience({manifest:ANDER_MODEL_MANIFEST,getState,render,onReturn:()=>post('model:state',{...getState(),navigation:'home'}),post});});
