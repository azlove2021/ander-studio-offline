import {mountEcologyShell} from './ecology-shell.js';
import {DEFAULTS,PLAYBACK_SECONDS,INITIAL_AXIS_MAX,parameters,timeline,at,jAxisMax,stageAt,clamp,formatNumber,formatTime} from './engine.js';
import {GrowthChart} from './renderer.js';
// The preparation step replaces this line with the exact package manifest.
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"population-growth","version":"2.3.0","publish":true,"title":{"zh":"种群的增长曲线","en":"Population Growth Curves"},"summary":{"zh":"同步比较 J 型与 S 型增长，自设初始数量和内禀增长率，观察自适应纵轴、K 与 K/2。","en":"Compare exponential and logistic growth with editable initial size and intrinsic rate, an adaptive J-axis, and K and K/2 guides."},"module":{"id":"ecology","zh":"选择性必修二 · 生物与环境","en":"Biology & Environment"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":false,"highlight":false,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"initial","title":{"zh":"初始条件","en":"Initial conditions"}},{"id":"growth","title":{"zh":"同步增长","en":"Compare growth"}},{"id":"near-capacity","title":{"zh":"接近环境容纳量","en":"Approaching K"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","ecology-shell.js","model.js","brand-watermark.js"],"styles":["model.css","ecology-layout.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
let ecology=null;
const $=selector=>document.querySelector(selector);
const controls=Object.fromEntries([...document.querySelectorAll('.control-dock [data-action]')].map(e=>[e.dataset.action,e]));
const area=$('.model-area'),stages=ANDER_MODEL_MANIFEST.stages;
const controlPresentations=new WeakMap();
function updateControl(button,kind,value=''){
  const fullscreenActive=kind==='fullscreen'&&(!!document.fullscreenElement||area.classList.contains('is-css-fullscreen'));
  const key=JSON.stringify([kind,value,fullscreenActive]);
  if(controlPresentations.get(button)===key)return;
  // Keep pressed targets connected between pointerdown and pointerup. The
  // canonical shell's SVG HTML serialization is not a safe per-frame cache.
  AnderModelShell.setControl(button,kind,value);
  controlPresentations.set(button,key);
}
const refs={n0:$('#initial-population'),r:$('#intrinsic-rate'),form:$('#parameters'),error:$('#parameter-error'),slider:$('#time-slider'),time:$('#time-value'),end:$('#time-end'),tangents:$('#tangent-toggle'),jump:$('#jump-inflection'),panels:$('.growth-panels')};
let p=parameters(DEFAULTS.n0,DEFAULTS.r),line=timeline(p),time=0,playing=false,speed=1,tangents=false;
let frame=0,lastSeconds=null,axis=INITIAL_AXIS_MAX,hostOrigin='*',lastPost=0,reportedStage=-1,disposed=false;
const charts={j:new GrowthChart($('#j-chart'),'j'),s:new GrowthChart($('#s-chart'),'s')};
$('.stage-strip').innerHTML=stages.map((s,i)=>`<button type="button" class="stage-tab" data-stage-index="${i}">${AnderModelShell.stageContent(i,s.title.zh,s.title.en)}</button>`).join('');
const stageButtons=[...document.querySelectorAll('.stage-tab')];
function post(type,payload,requestId){if(parent===window)return;const msg={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)msg.requestId=requestId;parent.postMessage(msg,hostOrigin);}
function getState(){return {modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready:true,playing,speed,time,duration:line.end,progress:time/line.end,stage:stageAt(time,line),stageId:stages[stageAt(time,line)].id,parameters:{...p},tangents,populations:at(p,time),axis:{j:axis,jTarget:jAxisMax(at(p,time).j.n),s:INITIAL_AXIS_MAX},timeline:{...line,stageTimes:[...line.stageTimes]},playbackSeconds:PLAYBACK_SECONDS};}
function schedule(){if(!disposed&&!document.hidden&&!frame&&playing)frame=requestAnimationFrame(tick);}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastSeconds=null;}
function announce(){const s=at(p,time);$('#announcement').textContent=`t=${formatTime(time)}年，J型${formatNumber(s.j.n)}个，S型${formatNumber(s.s.n)}个。`;}
function render({notify=false}={}){
  // The axis is a deterministic continuous function of the same scientific time.
  // Seeking, pausing and playing therefore share exactly the same geometry.
  axis=jAxisMax(at(p,time).j.n);
  const values=at(p,time),stage=stageAt(time,line),isAtInflection=line.inflection!==null&&Math.abs(time-line.inflection)<1e-8;
  refs.time.textContent=`${formatTime(time)} 年`;refs.end.textContent=`/ ${formatTime(line.end)} 年`;
  const sliderValue=String(Math.round(time/line.end*10000));
  if(refs.slider.value!==sliderValue)refs.slider.value=sliderValue;
  refs.slider.setAttribute('aria-valuetext',`${formatTime(time)} 年，共 ${formatTime(line.end)} 年`);
  refs.tangents.checked=tangents;refs.panels.classList.toggle('show-rates',tangents);
  for(const kind of ['j','s']){
    $('#'+kind+'-rates').hidden=!tangents;
    $('#'+kind+'-speed').textContent=`${formatNumber(values[kind].speed,2)} 个/年`;
    $('#'+kind+'-relative').textContent=`${values[kind].relative.toFixed(4)} 年⁻¹`;
    charts[kind].draw(p,line,time,kind==='j'?axis:INITIAL_AXIS_MAX,tangents);
  }
  const expanded=axis>INITIAL_AXIS_MAX+.1;
  $('#j-scale').classList.toggle('is-expanded',expanded);
  $('#j-scale').textContent=`${expanded?'纵轴连续扩展':'起始纵轴'} 0–${formatNumber(axis,0)} 个${expanded?'':' · 每格 100 个'}`;
  $('#axis-note').textContent=expanded?'J 轴已缩放，比较速率请看数值':'两图纵轴相同 · 每格 100 个';
  $('#j-state').textContent=time===0?'两图使用相同的 N₀ 和 r':expanded?'数量持续增加 · 曲线随纵轴量程重绘':'增长速率随种群数量增大';
  $('#s-state').textContent=isAtInflection?'N = K/2 · 增长速率最大':values.s.n>=p.k*.995?'接近 K · 数量近似稳定':values.s.n<p.k/2?'N < K/2 · 增长逐渐加快':'N > K/2 · 增长逐渐减慢';
  refs.jump.disabled=line.inflection===null;
  refs.jump.textContent=line.inflection===null?'初始已高于 K/2':line.inflection===0?'起点即 K/2':'定位 K/2';
  updateControl(controls.play,playing?'pause':'play',playing?'暂停':time>=line.end?'重播':'播放');
  for(const kind of ['reset','prev','next'])updateControl(controls[kind],kind);
  updateControl(controls.speed,'speed',String(speed));
  controls.prev.disabled=time<=0;controls.next.disabled=time>=line.end;
  $('#playback-state').textContent=playing?`正在观察 · ${Math.round(time/line.end*100)}%`:time===0?'准备观察':time>=line.end?'观察结束':'已暂停';
  stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===stage);b.setAttribute('aria-pressed',String(i===stage));});
  AnderModelShell.syncActiveStage();
  if(stage!==reportedStage){reportedStage=stage;post('model:stage-changed',{stageIndex:stage,stageId:stages[stage].id});}
  ecology?.sync();
  if(notify)post('model:state',getState());
  schedule();
}
function seek(t){if(!Number.isFinite(t))throw new RangeError('时间必须是有限数值。');time=clamp(t,0,line.end);lastSeconds=null;if(time>=line.end)playing=false;render({notify:true});announce();}
function pause(){playing=false;stopClock();render({notify:true});announce();}
function play(){if(time>=line.end)time=0;playing=true;lastSeconds=null;render({notify:true});}
function reset(){playing=false;stopClock();time=0;render({notify:true});announce();}
function applyParameters(n0,r){const next=parameters(n0,r);playing=false;stopClock();p=next;line=timeline(p);time=0;refs.n0.value=String(n0);refs.r.value=String(r);refs.n0.removeAttribute('aria-invalid');refs.r.removeAttribute('aria-invalid');refs.error.hidden=true;render({notify:true});$('#announcement').textContent=`参数已应用。N₀=${n0}，r=${r}，观察至${formatTime(line.end)}年。`;return getState();}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=stages.length)throw new RangeError('无效阶段。');playing=false;stopClock();seek(line.stageTimes[i]);}
function setSpeed(value){if(!Number.isFinite(value)||value<.25||value>4)throw new RangeError('播放速度须在 0.25–4 倍之间。');speed=value;render({notify:true});}
function tick(stamp){
  frame=0;if(disposed||document.hidden)return;
  const seconds=stamp*.001;
  if(playing&&lastSeconds!==null){time=Math.min(line.end,time+Math.min(.12,Math.max(0,seconds-lastSeconds))*speed*line.end/PLAYBACK_SECONDS);if(time>=line.end)playing=false;}
  lastSeconds=seconds;render();
  if(seconds-lastPost>.25){lastPost=seconds;post('model:progress',{time,duration:line.end,progress:time/line.end,stageIndex:stageAt(time,line)});}
  if(!playing){lastSeconds=null;post('model:state',getState());}
}
refs.form.addEventListener('submit',event=>{event.preventDefault();try{const n0=refs.n0.value.trim()===''?NaN:Number(refs.n0.value),r=refs.r.value.trim()===''?NaN:Number(refs.r.value);applyParameters(n0,r);}catch(error){refs.error.textContent=error.message;refs.error.hidden=false;const input=/N₀/.test(error.message)?refs.n0:refs.r;input.setAttribute('aria-invalid','true');input.focus();}});
refs.slider.addEventListener('pointerdown',event=>{if(event.button===0&&playing)pause();});
refs.slider.addEventListener('input',()=>{playing=false;stopClock();time=Number(refs.slider.value)/10000*line.end;render();});
refs.slider.addEventListener('change',()=>{post('model:state',getState());announce();});
refs.tangents.addEventListener('change',()=>{tangents=refs.tangents.checked;render({notify:true});});
refs.jump.addEventListener('click',()=>{if(line.inflection===null)return;playing=false;stopClock();tangents=true;seek(line.inflection);});
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);
controls.prev.addEventListener('click',()=>{const past=line.stageTimes.filter(t=>t<time-1e-8);playing=false;stopClock();seek(past.at(-1)??0);});
controls.next.addEventListener('click',()=>{const next=[...line.stageTimes,line.end].find(t=>t>time+1e-8);playing=false;stopClock();seek(next??line.end);});
controls.speed.addEventListener('click',()=>{const options=[.5,1,1.5,2,4];setSpeed(options[(options.indexOf(speed)+1)%options.length]);});

stageButtons.forEach((b,i)=>b.addEventListener('click',()=>jumpStage(i)));
const resize=new ResizeObserver(()=>render());resize.observe($('.plots-scroll'));resize.observe(refs.panels);
document.addEventListener('fullscreenchange',()=>render());
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;stopClock();post('model:state',getState());}else render();});
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA/.test(event.target.tagName)){event.preventDefault();playing?pause():play();}});
window.addEventListener('message',event=>{
  const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
  if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;
  const payload=m.payload||{};
  try{
    switch(m.type){
      case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;
      case 'host:play':play();break;case 'host:pause':pause();break;case 'host:reset':reset();break;
      case 'host:set-stage':{const s=payload.stageId??payload.stage??payload.stageIndex;const i=typeof s==='string'?stages.findIndex(v=>v.id===s):s;jumpStage(i);break;}
      case 'host:set-speed':setSpeed(payload.speed);break;
      default:throw new Error('本模型不支持此宿主操作。');
    }
    post('model:state',getState(),m.requestId);
  }catch(error){post('model:error',{message:error.message},m.requestId);}
});
window.addEventListener('pagehide',()=>{disposed=true;playing=false;stopClock();resize.disconnect();});
window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;resize.observe($('.plots-scroll'));resize.observe(refs.panels);render();}});
window.PopulationGrowthModel=Object.freeze({getState,seek,play,pause,reset,applyParameters,setSpeed,jumpStage});
ecology=mountEcologyShell({manifest:ANDER_MODEL_MANIFEST,getState,render,post});
render();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
