import {mountLabShell} from './lab-shell.js';
import {bindLabGesture} from './lab-gesture.js';
let labExperience=null;
import {MODES,STAGES,makeLineage,buildTimeline,stateAt,stageTime,cycleTime,clamp,pairInfo} from './engine.js';
import {createRenderer,drawPrimerLibrary,attr,text} from './renderer.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"pcr-primer-engineering","version":"2.2.1","publish":true,"title":{"zh":"利用引物改造DNA","en":"Engineering DNA with Primers"},"summary":{"zh":"通过三轮PCR，对比5′端添加酶切位点与引物内部定点替换的形成过程。","en":"Follow three PCR cycles to compare added restriction sites and a primer-encoded point mutation."},"module":{"id":"biotechnology","zh":"选择性必修三 · 生物技术与工程","en":"Biotechnology & Engineering"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"template","title":{"zh":"引物设计","en":"Primer design"}},{"id":"cycle-1","title":{"zh":"第一轮","en":"First cycle"}},{"id":"cycle-2","title":{"zh":"第二轮","en":"Second cycle"}},{"id":"cycle-3","title":{"zh":"第三轮","en":"Third cycle"}},{"id":"products","title":{"zh":"目标产物","en":"Target products"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","lab-gesture.js","lab-shell.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","lab-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const shell=AnderModelShell,$=id=>document.getElementById(id),svg=$('scene'),zoom=$('site-zoom'),area=document.querySelector('.model-area'),modelStage=document.querySelector('.model-stage');
const lineages=Object.fromEntries(MODES.map(m=>[m,makeLineage(m)])),timelines=Object.fromEntries(MODES.map(m=>[m,buildTimeline(lineages[m])]));
let mode='restriction',timeline=timelines[mode],time=.9,current=stateAt(timeline,time),playing=false,speed=1,labels=true,highlight=true,raf=0,lastFrame=0,lastUi=-1,lastSent=0,lastStage=-1,hostOrigin='*',stopAt=null,drawn=null;
const renderer=createRenderer(svg,zoom,lineages);drawPrimerLibrary($('restriction-primers'),'restriction');drawPrimerLibrary($('mutation-primers'),'mutation');
const controlsByAction=Object.fromEntries([...document.querySelectorAll('[data-action]')].map(n=>[n.dataset.action,n]));
const stageButtons=STAGES.map((s,i)=>{const b=document.createElement('button');b.type='button';b.className='stage-tab';b.dataset.stageIndex=i;b.innerHTML=shell.stageContent(i,s.zh,s.en);b.addEventListener('click',()=>{setPlaying(false);seek(stageTime(timeline,i));});document.querySelector('.stage-strip').appendChild(b);return b;});
const phaseNodes=[...document.querySelectorAll('.reaction-steps>div')].map(g=>({g,fill:g.querySelector('i'),phase:g.dataset.phase}));
function controls(){
  shell.setControl(controlsByAction.play,playing?'pause':'play',playing?'暂停':'播放');shell.setControl(controlsByAction.reset,'reset','重置');shell.setControl(controlsByAction.prev,'prev','上一步');shell.setControl(controlsByAction.next,'next','下一步');shell.setControl(controlsByAction.speed,'speed',String(speed));shell.setControl(controlsByAction.labels,'labels','标签',labels);shell.setControl(controlsByAction.highlight,'highlight','聚焦',highlight);
  controlsByAction.prev.disabled=time<=0;controlsByAction.next.disabled=current.index===timeline.segments.length-1;
}
function observeDescription(){
  const s=current,n=s.cycle,info=drawn?.selected?pairInfo(drawn.selected.pair):null;
  if(mode==='restriction'){
    if(s.phase==='setup')return ['两种引物的5′端均附加识别序列，3′端是模板互补区。','附加序列外侧含保护碱基；只演示序列引入，不演示酶切。'];
    if(s.phase==='denature')return ['双链分离；附加序列随所属链移动。','DNA主链保持完整，原始母链序列不变。'];
    if(s.phase==='anneal')return [n===1?'3′互补区结合，5′附加序列保持未配对。':'引物与当前模板结合；已有互补尾段可正常配对。','没有互补模板的5′尾段不绘制配对键。'];
    if(s.phase==='extend')return [info?.siteEnds===2?'逐段合成互补链，形成两端完整位点。':n>=2&&info?.siteEnds?'复制前一轮附加序列，补出互补链。':'从引物3′端延伸，附加序列成为子链的一部分。','延伸终点取决于当前模板末端，不能在对侧引物处自动停止。'];
    return [n===1?'首轮产物含单链识别序列。':n===2?'部分产物一端已形成双链识别位点。':'出现2个两端均有双链识别位点的目标DNA。',n===3?'8个产物中只有2个是定长目标双链；原模板与其他长度产物保留。':'后续循环将继续复制这些新增序列。'];
  }
  if(s.phase==='setup')return ['F引物内部预置一个C；正常R引物位于另一端。','仅改变引物覆盖区域内的位点，3′端保持正确匹配。'];
  if(s.phase==='denature')return ['模板分开，旧序列及已有替换碱基分别保留。','原始母链T—A不会被直接改写。'];
  if(s.phase==='anneal')return ['突变引物C与旧模板A错配，3′端仍正确配对。','错配处局部凸起；正确配对后恢复平直，碱基数不变。'];
  if(s.phase==='extend')return [info?.mutant?'以含替换碱基的新链为模板，补出C—G互补对。':'C已经在引物中，随新链延伸而保留。','碱基替换不改变DNA长度；旧模板的碱基保持原样。'];
  return [n===1?'首轮出现C—A错配，突变C保留在新链中。':n===2?'部分产物已形成正常互补的C—G碱基对。':'出现2个具有C—G的定长目标DNA。',n===3?'保留旧型、错配及其他长度产物；不会把所有8个分子都画成目标DNA。':'第二轮即可出现突变碱基对，第三轮首次出现定长目标双链。'];
}
function render(force=false){
  drawn=renderer.draw(mode,current,{labels,highlight});
  if(!force&&time-lastUi>=0&&time-lastUi<.07)return;lastUi=time;
  text($('process-title'),mode==='restriction'?'添加酶切位点':'利用引物定点诱变');text($('process-detail'),mode==='restriction'?'5′附加序列 · 3′端正确配对':'引物内部替换 · 原始模板保持不变');text($('phase-name'),current.phaseName);text($('cycle-label'),current.cycle?`第 ${current.cycle} / 3 轮 · ${current.temperature}°C`:'引物定位');
  $('timeline').value=Math.round(current.progress*10000);$('timeline').setAttribute('aria-valuetext',`${current.cycle?`第${current.cycle}轮，`:''}${current.phaseName}，${Math.round(current.progress*100)}%`);text($('percent'),`${Math.round(current.progress*100)}%`);
  text($('counts-title'),current.completed?`第 ${current.completed} 轮已完成产物`:'起始模板');text($('total-count'),current.counts.total);text($('double-count'),current.completed?current.counts.double:'—');text($('single-count'),current.completed?current.counts.single:'—');text($('exact-count'),current.counts.exact);
  const [site,description]=observeDescription();text($('site-description'),site);text($('phase-description'),description);
  document.querySelectorAll('.zoom-directions span').forEach((n,i)=>text(n,drawn.zoomDirections[i]?`${drawn.zoomDirections.length===1?'单':i===0?'上':'下'}链 ${drawn.zoomDirections[i]}`:''));
  text($('site-label'),`${mode==='mutation'?'替换位点 · T—A → C—G':drawn.feature==='left-tail'?'EcoRI · GAATTC':'BamHI · GGATCC'}${current.phase==='setup'?' · 引物预览':''}`);
  text($('group-progress'),current.phase==='extend'?`第 ${current.groupIndex+1} / ${current.groupCount} 组`:current.phase==='result'?'三轮完成':current.phase==='collect'?'本轮完成':current.phase==='setup'?'准备':current.phase==='denature'?'双链分离':'引物结合');
  phaseNodes.forEach(({g,fill,phase},i)=>{const rank={setup:-1,denature:0,anneal:1,extend:2,collect:3,result:3}[current.phase];let progress=rank>i?1:rank<i?0:current.phase==='extend'?(current.groupIndex+current.p)/current.groupCount:current.p;fill.style.transform=`scaleX(${clamp(progress)})`;g.classList.toggle('active',phase===current.phase);});
  stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===current.stage);b.setAttribute('aria-pressed',String(i===current.stage));});
  if(lastStage!==current.stage){lastStage=current.stage;shell.syncActiveStage();labExperience?.sync();post('model:stage-changed',statePayload());}controls();
}
function seek(t){if(!Number.isFinite(t))throw new TypeError('进度须为有效数字');time=clamp(t,0,timeline.duration);current=stateAt(timeline,time);render(true);post('model:progress',statePayload());}
function setPlaying(value){stopAt=null;if(value&&current.done)seek(0);playing=value;cancelAnimationFrame(raf);lastFrame=performance.now()*.001;if(playing)raf=requestAnimationFrame(tick);controls();post('model:state',statePayload());}
function tick(){if(!playing)return;const now=performance.now()*.001,dt=Math.min(.12,now-lastFrame);lastFrame=now;time=Math.min(stopAt??timeline.duration,time+dt*speed);current=stateAt(timeline,time);render();if(now-lastSent>.18){post('model:progress',statePayload());lastSent=now;}if(current.done||stopAt!==null&&time>=stopAt){playing=false;stopAt=null;render(true);controls();post('model:state',statePayload());}else raf=requestAnimationFrame(tick);}
function reset(){labExperience?.view.fit();setPlaying(false);seek(.9);modelStage.scrollTo({top:0});}
function chooseMode(value){if(!MODES.includes(value))throw new Error('无效模式');setPlaying(false);mode=value;timeline=timelines[mode];document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));lastStage=-1;seek(0);modelStage.scrollTo({top:0});setPlaying(true);stopAt=.9;}
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>chooseMode(button.dataset.mode));
$('timeline').addEventListener('input',()=>{setPlaying(false);seek(Number($('timeline').value)/10000*timeline.duration);});
document.querySelector('.model-area').addEventListener('click',event=>{const action=event.target.closest('[data-action]')?.dataset.action;if(action==='play')setPlaying(!playing);if(action==='reset')reset();if(action==='prev'||action==='next'){setPlaying(false);seek(timeline.segments[clamp(current.index+(action==='next'?1:-1),0,timeline.segments.length-1)].start);}if(action==='speed'){const speeds=[.5,1,1.5,2,4,8];speed=speeds[(speeds.indexOf(speed)+1)%speeds.length];controls();post('model:state',statePayload());}if(action==='labels'){labels=!labels;render(true);post('model:state',statePayload());}if(action==='highlight'){highlight=!highlight;render(true);post('model:state',statePayload());}});
function scrollToPanel(selector){const node=document.querySelector(selector);modelStage.scrollTo({top:node.getBoundingClientRect().top-modelStage.getBoundingClientRect().top+modelStage.scrollTop-10,behavior:'auto'});}
function measure(){const h=modelStage.clientHeight,short=innerWidth>=600&&innerWidth<=860&&innerHeight<=500,layout=document.querySelector('.engineering-layout');layout.style.setProperty('--reaction-height',`${Math.max(short?245:290,h-(short?0:135))}px`);layout.style.setProperty('--detail-height',`${Math.max(88,Math.min(230,h-108))}px`);}
new ResizeObserver(()=>requestAnimationFrame(measure)).observe(modelStage);
function statePayload(){return {mode,playing,speed,labels,highlight,view:'overview',stage:current.stage,stageId:STAGES[current.stage].id,cycle:current.cycle,phase:current.phase,phaseProgress:current.p,completedCycles:current.completed,counts:{...current.counts},templateIndices:[...current.templates],groupType:current.groupType??null,time,duration:timeline.duration,progress:current.progress,done:current.done};}
function post(type,payload,requestId){if(window.parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:'pcr-primer-engineering',type,payload};if(requestId!==undefined)m.requestId=requestId;window.parent.postMessage(m,hostOrigin);}
window.addEventListener('message',event=>{const m=event.data;if(event.source!==window.parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!=='pcr-primer-engineering')return;if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const p=m.payload||{};try{switch(m.type){
  case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()},m.requestId);break;
  case 'host:play':setPlaying(true);break;case 'host:pause':setPlaying(false);break;case 'host:reset':reset();break;
  case 'host:set-stage':{const v=p.stageId??p.stage??p.stageIndex,i=typeof v==='string'?STAGES.findIndex(s=>s.id===v):v;if(!Number.isInteger(i)||i<0||i>=STAGES.length)throw new Error('无效阶段');setPlaying(false);seek(stageTime(timeline,i));break;}
  case 'host:set-speed':if(!Number.isFinite(p.speed)||p.speed<.25||p.speed>8)throw new Error('无效速度');speed=p.speed;break;
  case 'host:set-labels':{const v=p.visible??p.enabled;if(typeof v!=='boolean')throw new Error('标签状态须为布尔值');labels=v;break;}
  case 'host:set-highlight':if(typeof p.enabled!=='boolean')throw new Error('聚焦状态须为布尔值');highlight=p.enabled;break;
  case 'host:set-view':if((p.viewId??p.view)!=='overview')throw new Error('只支持总览视角，位点放大自动跟随反应');break;
  default:throw new Error('不支持的宿主指令');}
  render(true);post('model:state',statePayload(),m.requestId);
}catch(error){post('model:error',{message:error.message},m.requestId);}});
window.PCRPrimerModel=Object.freeze({getState:statePayload,seek,play:()=>setPlaying(true),pause:()=>setPlaying(false),getTimeline:()=>timeline.segments.map(s=>({...s})),getFrame:()=>({views:drawn.frame.views.map(v=>({id:v.strand.id,y:v.y,x:v.x,start:v.start,end:v.end,row:v.row,opacity:v.opacity})),feature:drawn.feature,zoomViews:drawn.zoomViews,mismatch:drawn.mismatch}),showCycle:(n,result=false)=>{setPlaying(false);seek(cycleTime(timeline,n,result));}});
measure();render(true);controls();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()});

labExperience=mountLabShell({manifest:ANDER_MODEL_MANIFEST,getState:statePayload,post,onResize:measure});
