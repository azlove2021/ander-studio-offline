import {mountProductExperience} from './shell-adapter.js';
import {GEOMETRY as G,DETAILED_CYCLES,STAGES,STRAND_COLORS,makeLineage,buildTimeline,stateAt,detailFrame,stageTime,cycleTime,baseX,rowY,primerBounds,categoryName,clamp,smooth,validCycles} from './engine.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"pcr-product-types","version":"2.3.5","publish":true,"title":{"zh":"PCR的产物类型","en":"Types of PCR Products"},"summary":{"zh":"前六轮按产物类型分组同步延伸，第七轮起保留第六轮末DNA画面，统计区继续记录产物数量。","en":"Compare grouped parallel extensions through six cycles, then track product accumulation."},"module":{"id":"biotechnology","zh":"选择性必修三 · 生物技术与工程","en":"Biotechnology & Engineering"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"template","title":{"zh":"内侧引物","en":"Internal primers"}},{"id":"cycle-1","title":{"zh":"第一轮","en":"First cycle"}},{"id":"cycle-2","title":{"zh":"第二轮","en":"Second cycle"}},{"id":"cycle-3","title":{"zh":"第三轮","en":"Third cycle"}},{"id":"cycle-4","title":{"zh":"第四轮","en":"Fourth cycle"}},{"id":"cycle-5","title":{"zh":"第五轮","en":"Fifth cycle"}},{"id":"cycle-6","title":{"zh":"第六轮","en":"Sixth cycle"}},{"id":"amplification","title":{"zh":"产物积累","en":"Product accumulation"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","scene-view.js","shell-adapter.js","model.js","brand-watermark.js"],"styles":["model.css","shell-layout.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const shell=AnderModelShell,$=id=>document.getElementById(id),svg=$('scene'),NS='http://www.w3.org/2000/svg';
const lineage=makeLineage(DETAILED_CYCLES),fmt=n=>n.toLocaleString('en-US');
svg.setAttribute('viewBox',`0 0 ${G.width} ${G.height}`);
let timeline=buildTimeline(30),time=0,current=stateAt(timeline,0),playing=false,speed=1,labels=true,highlight=true;
const view='overview';
let experience=null;
let raf=0,lastFrame=0,lastUi=-1,lastSent=0,lastPhase='',hostOrigin='*';
const viewport=document.querySelector('.scene-viewport'),modelArea=document.querySelector('.model-area');
function el(tag,attrs={},parent=svg,value){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(value!==undefined)n.textContent=value;parent.appendChild(n);return n;}
function attr(node,name,value){const str=String(value);if(node.getAttribute(name)!==str)node.setAttribute(name,str);}
function text(node,value){const str=String(value);if(node.textContent!==str)node.textContent=str;}
function show(node,value){attr(node,'display',value?'inline':'none');}
const defs=el('defs');
const arrow=el('marker',{id:'extension-arrow',markerWidth:7,markerHeight:7,refX:6,refY:3.5,orient:'auto',markerUnits:'userSpaceOnUse'},defs);
el('path',{d:'M0 0 L7 3.5 L0 7',fill:'none',stroke:STRAND_COLORS.primer,'stroke-width':1.6},arrow);
const guides=el('g',{id:'target-guides'});
const guidePanels=Array.from({length:2},()=>{
  const group=el('g',{},guides);
  const band=el('rect',{y:44,height:572,fill:'#e6f1e9',opacity:.5},group);
  const lines=[G.left,G.right].map(position=>({
    line:el('path',{fill:'none',stroke:'#82a995','stroke-width':1.4,'stroke-dasharray':'5 7'},group),
    label:el('text',{y:26,'text-anchor':'middle',class:'guide-label optional-label'},group,position===G.left?'目标左界 · 5′':'目标右界 · 5′'),
  }));
  return {group,band,lines};
});
const panelDivider=el('path',{d:'M720 44V616',stroke:'#cbded5','stroke-width':1,'stroke-dasharray':'3 7',display:'none'},guides);
const detailLayer=el('g',{id:'detail-layer'}),rowLayer=el('g',{id:'row-layer'},detailLayer),bondLayer=el('g',{id:'bond-layer'},detailLayer),strandLayer=el('g',{id:'strand-layer'},detailLayer);
const rowNodes=Array.from({length:2**DETAILED_CYCLES},(_,i)=>{
  const g=el('g',{'data-row':i},rowLayer);
  const background=el('rect',{x:12,y:-31,width:G.width-24,height:62,rx:10,fill:'#cce7d8',opacity:0},g);
  const label=el('text',{x:20,y:-4,class:'row-label optional-label'},g);
  const detail=el('text',{x:20,y:18,class:'row-detail optional-label'},g);
  const status=el('circle',{cx:10,cy:-10,r:3.2,fill:'#38917a'},g);
  const category=el('text',{x:1225,y:3,class:'product-name optional-label'},g);
  const categoryStatus=el('text',{x:1225,y:22,class:'product-status optional-label'},g);
  return {g,label,detail,status,background,category,categoryStatus};
});
const bondNodes=Array.from({length:2**DETAILED_CYCLES},()=>el('path',{fill:'none',stroke:'#8aab9d','stroke-width':1.25,'stroke-dasharray':'2 2'},bondLayer));
function assetFor(strand){return `assets/strand-${strand.origin}-${strand.dir===1?'plus':'minus'}.svg`;}
function chainNode(strand,id,parent){
  const g=el('g',{'data-strand-id':strand.id,'data-origin':strand.origin,'data-created-cycle':strand.createdCycle,'data-template-id':strand.templateId??'',display:'none'},parent);
  const clip=el('clipPath',{id},defs),clipRect=el('rect',{x:0,y:-31,width:1,height:62},clip);
  const imageGroup=el('g',{transform:`scale(${G.scale})`,'clip-path':`url(#${id})`},g);
  el('image',{href:assetFor(strand),x:-8,y:-30,width:G.bases*G.step+16,height:60},imageGroup);
  const left=el('text',{class:'dna-end optional-label','text-anchor':'end',y:6},g,strand.dir===1?'5′':'3′');
  const right=el('text',{class:'dna-end optional-label','text-anchor':'start',y:6},g,strand.dir===1?'3′':'5′');
  return {g,clipRect,left,right,strand};
}
const chainNodes=lineage.strands.map(strand=>chainNode(strand,`chain-clip-${strand.id}`,strandLayer));
function drawChain(node,v,opacity=1){
  show(node.g,v.opacity>0);if(v.opacity<=0)return;
  attr(node.g,'transform',`translate(${(v.x+G.dnaX*v.scale).toFixed(3)} ${v.y.toFixed(3)}) scale(${v.scale.toFixed(5)})`);
  attr(node.g,'opacity',(v.opacity*opacity).toFixed(4));
  attr(node.g,'data-formed-start',v.start.toFixed(5));attr(node.g,'data-formed-end',v.end.toFixed(5));
  attr(node.clipRect,'x',v.start*G.step-3);attr(node.clipRect,'width',(v.end-v.start)*G.step+6);
  attr(node.left,'x',v.start*G.step*G.scale-11);attr(node.right,'x',v.end*G.step*G.scale+11);
}
function bondPath(bond){
  let d='';const top=bond.topLayout,bottom=bond.bottomLayout;
  const y1=bond.top+20*G.scale*top.scale,y2=bond.bottom-20*G.scale*bottom.scale;
  for(let i=Math.ceil(bond.start-.5);i<bond.end-.5;i++){
    const x1=top.x+baseX(i+.5)*top.scale,x2=bottom.x+baseX(i+.5)*bottom.scale;
    d+=`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return d;
}
const referenceLayer=el('g',{id:'reference-primers'});
for(const strand of lineage.strands.slice(2,4)){
  const [a,b]=primerBounds(strand),y=rowY(1,0)+strand.dir*G.initialPrimerOffset;
  el('text',{x:baseX((a+b)/2),y:y+(strand.dir===1?44:-36),'text-anchor':'middle',class:'primer-label optional-label'},referenceLayer,strand.dir===1?'正向引物':'反向引物');
}
const stageButtons=STAGES.map((stage,index)=>{
  const button=document.createElement('button');button.type='button';button.className='stage-tab';button.dataset.stageIndex=index;
  button.innerHTML=shell.stageContent(index,stage.zh,stage.en);button.addEventListener('click',()=>{setPlaying(false);seek(stageTime(timeline,index));});
  document.querySelector('.stage-strip').appendChild(button);return button;
});
const controlNodes=Object.fromEntries([...document.querySelectorAll('[data-action]')].map(b=>[b.dataset.action,b]));
const phaseNodes=[...document.querySelectorAll('.reaction-steps>div')].map(g=>({g,fill:g.querySelector('i'),phase:g.dataset.phase}));
function drawDetails(s){
  const frame=detailFrame(s,lineage);
  const visible=new Map(frame.views.map(v=>[v.strand.id,v]));
  for(const node of chainNodes){const v=visible.get(node.strand.id);if(!v){show(node.g,false);continue;}const focus=highlight&&frame.activeRows.length&&!frame.activeRows.includes(v.row)?.28:1;drawChain(node,v,focus);}
  rowNodes.forEach((node,i)=>{
    const row=frame.rows[i];show(node.g,Boolean(row));if(!row)return;
    attr(node.g,'transform',`translate(${row.x.toFixed(3)} ${row.y.toFixed(3)})`);attr(node.g,'opacity',row.opacity??1);attr(node.g,'data-status',row.state);attr(node.g,'data-template-id',row.templateId??'');
    const dense=row.scale<.999;
    const nameSize=!dense?20:frame.rows.length<=16?17:frame.rows.length<=32?14:11.5;
    attr(node.background,'x',12*row.scale);attr(node.background,'y',-31*row.scale);
    attr(node.background,'width',(G.width-24)*row.scale);attr(node.background,'height',62*row.scale);attr(node.background,'rx',10*row.scale);
    attr(node.label,'x',(dense?G.dnaX-40:20)*row.scale);attr(node.label,'text-anchor',dense?'end':'start');attr(node.label,'y',dense?3:-4);node.label.style.fontSize=`${dense?nameSize*.8:17}px`;
    text(node.label,row.label);text(node.detail,row.detail);show(node.detail,!dense);show(node.status,row.state==='active');
    attr(node.status,'cx',10*row.scale);attr(node.status,'cy',dense?0:-10);attr(node.status,'r',dense?2:3.2);
    for(const label of [node.category,node.categoryStatus])attr(label,'x',1225*row.scale);
    node.category.style.fontSize=`${nameSize}px`;attr(node.category,'y',dense?nameSize*.35:3);
    show(node.categoryStatus,!dense);
    text(node.category,row.type?categoryName(row.type):'原始模板DNA');text(node.categoryStatus,row.type?(row.state==='complete'?'':row.state==='active'?'正在形成':'本轮将形成'):'');
    attr(node.background,'opacity',highlight&&frame.activeRows.includes(i)?.42:0);attr(node.g,'data-category',row.type??'initial');
  });
  bondNodes.forEach((node,i)=>{
    const b=frame.bonds[i];show(node,Boolean(b)&&b.opacity>0);if(!b)return;
    attr(node,'d',bondPath(b));attr(node,'opacity',b.opacity*(highlight&&frame.activeRows.length&&!frame.activeRows.includes(i)?.28:1));
    attr(node,'data-paired-start',b.start.toFixed(5));attr(node,'data-paired-end',b.end.toFixed(5));
  });
  show(referenceLayer,s.phase==='setup');
  guidePanels.forEach((node,i)=>{
    const panel=frame.panels[i];show(node.group,Boolean(panel));if(!panel)return;
    attr(node.group,'opacity',panel.opacity??1);
    attr(node.band,'x',panel.x+baseX(G.left)*panel.scale);attr(node.band,'width',(baseX(G.right)-baseX(G.left))*panel.scale);
    node.lines.forEach((item,j)=>{
      const x=panel.x+baseX(j===0?G.left:G.right)*panel.scale;
      attr(item.line,'d',`M${x.toFixed(3)} 44V616`);attr(item.label,'x',x);
      item.label.style.fontSize=`${panel.scale<.5?11:17}px`;
    });
  });
  show(panelDivider,frame.panels.length>1);attr(panelDivider,'opacity',frame.panels[1]?.opacity??1);
}
let lastSceneKey=null;
function render(s=current,force=false){
  // Reuse the exact completed sixth-cycle scene. Deterministic drawing also
  // handles direct jumps from any earlier phase into later cycle counts.
  const completedSixth=s.summary||s.cycle===DETAILED_CYCLES&&(s.phase==='final'||s.phase==='collect'&&s.p>=.82);
  const sceneKey=completedSixth?'completed-sixth':null;
  if(!sceneKey||sceneKey!==lastSceneKey)drawDetails(s);
  lastSceneKey=sceneKey;
  if(force||Math.abs(time-lastUi)>.08){updateUi(s);lastUi=time;}
  if(playing&&performance.now()-lastSent>350){post('model:progress',statePayload());lastSent=performance.now();}
}
function description(s){
  if(s.phase==='setup')return '两条引物位于原始模板内侧，3′端朝向目标区内部。虚线经过两条引物的5′端。';
  if(s.phase==='denature')return '升温使链间配对解除。每条共价主链和已有的引物区段保持完整，分别作为本轮模板。';
  if(s.phase==='anneal')return '降温后，两种引物分别与互补模板结合。接下来同类产物一起延伸，依次观察双长型DNA、单长型DNA和目标DNA。';
  if(s.phase==='extend'){
    const reason=s.groupType==='double'?'新链越过对侧目标边界，延伸到原始长模板末端。':s.groupType==='exact'?'定长短单链作为模板，新链与它齐平，形成目标DNA。':'当前模板末端限制新链长度；产物整体仍有一侧超出目标区。';
    return `${s.templates.length}个${categoryName(s.groupType)}同步形成：从引物3′端沿5′→3′方向延伸。${reason}`;
  }
  if(s.phase==='collect')return s.cycle===1?'两条初始母链各形成一个双长型DNA。每个分子内的两条链并非等长。':s.cycle===2?'第一次出现定长短单链，但它仍与一条较长模板配对，因此还没有目标DNA双链。':`${s.cycle===3?'第一次出现目标DNA。':''}本轮共${fmt(s.counts.total)}个分子：2个双长型DNA、${s.counts.single}个单长型DNA、${fmt(s.counts.exact)}个目标DNA。`;
  if(s.phase==='summary')return '第七轮起保留第六轮末的64个DNA画面，统计区继续记录实际产物数量；实际反应仍需经历三步循环。';
  return '最后延伸不额外增加循环数。双长型DNA保持2个，单长型DNA线性增加，目标DNA逐渐占据绝大多数。';
}
function stageAvailable(i){return i===0||i<=DETAILED_CYCLES&&i<=timeline.cycles||i===DETAILED_CYCLES+1&&timeline.cycles>DETAILED_CYCLES;}
function groupLabel(s){return s.templates.length<=8?s.templates.map(i=>i+1).join('、'):`${s.templates.length}条同类模板`;}
function updateUi(s){
  text($('process-title'),s.phase==='setup'?'内侧引物与初始模板':s.summary?'第6轮末 DNA · 保留画面':`第 ${s.cycle} 轮 · ${s.phaseName}`);
  text($('process-detail'),s.phase==='extend'?`同步延伸：${groupLabel(s)} · ${categoryName(s.groupType)}`:s.phase==='setup'?'两条引物的 5′ 端限定目标片段两端':s.summary?'图像保持静止，后续数量在统计区持续更新':s.phase==='collect'?'同一批分子按长度归类':'每条链保持其原有颜色与端点');
  text($('phase-name'),s.summary?'画面固定':s.done?'扩增完成':s.phaseName);text($('temperature'),s.summary?'':`${Math.round(s.temperature)}°C`);
  text($('scene-caption'),s.phase==='setup'?'引物持续可见，降温后再与模板结合':s.summary?'保留第6轮末64个DNA；后续实际数量见统计区':s.cycle>=4?`本轮 ${2**s.cycle} 个DNA · 左右两区等比例缩小，全部显示`:s.phase==='extend'?`模板 ${groupLabel(s)} 的子链同步延伸`:'所有分子使用相同的长度比例');
  text($('strand-progress'),s.phase==='setup'?'准备':s.summary?'画面固定':`${s.finished} / ${2**s.cycle} 条完成`);
  const progress={denature:s.phase==='denature'?s.p:s.phase==='setup'?0:1,anneal:s.phase==='anneal'?s.p:['setup','denature'].includes(s.phase)?0:1,extend:s.phase==='extend'?(s.finishedTemplates.length+s.templates.length*s.extension)/2**s.cycle:['collect','summary','final'].includes(s.phase)?1:0};
  phaseNodes.forEach(node=>{node.fill.style.transform=`scaleX(${s.summary?1:progress[node.phase]})`;node.g.classList.toggle('active',!s.summary&&s.phase===node.phase);});
  text($('counts-title'),s.completed?`第 ${s.completed} 轮末产物`:'起始模板');
  for(const [id,key]of [['total-count','total'],['double-count','double'],['single-count','single'],['exact-count','exact']]){const value=!s.completed&&['double','single'].includes(key)?'—':fmt(s.counts[key]);text($(id),value);$(id).classList.toggle('large',value.length>8);}
  text($('phase-description'),description(s));$('count-formulas').hidden=s.completed<3;text($('formula-n'),s.completed);
  $('timeline').value=Math.round(s.progress*10000);text($('percent'),`${Math.round(s.progress*100)}%`);attr($('timeline'),'aria-valuetext',`${s.phaseName}，第${s.cycle}轮，${Math.round(s.progress*100)}%`);
  stageButtons.forEach((button,i)=>{const active=i===s.stage;button.classList.toggle('is-active',active);attr(button,'aria-current',active?'step':'false');button.disabled=!stageAvailable(i);});
  shell.syncActiveStage();experience?.syncStage();$('finish-cycle').disabled=s.phase==='final'||s.done;
  const key=`${s.stage}:${s.cycle}:${s.phase}:${s.template}`;
  if(lastPhase!==key){post('model:stage-changed',{stage:s.stage,stageId:STAGES[s.stage].id,cycle:s.cycle,phase:s.phase,templateIndex:s.template});lastPhase=key;}
}
function controls(){
  shell.setControl(controlNodes.play,playing?'pause':'play',playing?'暂停':current.done?'重播':'播放');
  shell.setControl(controlNodes.speed,'speed',`${speed}×`);shell.setControl(controlNodes.labels,'labels','标签',labels);
  shell.setControl(controlNodes.highlight,'highlight','聚焦',highlight);
  // Fullscreen control presentation belongs to the shared experience.
}
function tick(now){
  if(!playing){raf=0;return;}const seconds=now*.001;
  const dt=lastFrame?Math.min(seconds-lastFrame,.1):0;lastFrame=seconds;time=Math.min(timeline.duration,time+dt*speed);current=stateAt(timeline,time);render();
  if(current.done){playing=false;raf=0;controls();post('model:state',statePayload());return;}raf=requestAnimationFrame(tick);
}
function setPlaying(value){if(value&&current.done){time=0;current=stateAt(timeline,0);}playing=Boolean(value);lastFrame=0;if(playing&&!raf)raf=requestAnimationFrame(tick);if(!playing&&raf){cancelAnimationFrame(raf);raf=0;}render(current,true);controls();post('model:state',statePayload());}
function seek(value){time=clamp(value,0,timeline.duration);current=stateAt(timeline,time);document.querySelector('.model-stage').scrollTop=0;render(current,true);controls();post('model:state',statePayload());}
function reset(){setPlaying(false);seek(0);text($('input-feedback'),`已重置；计划 ${timeline.cycles} 轮。`);}
function validate(id,max=40){const field=$(id),n=Number(field.value),ok=validCycles(n)&&n<=max;attr(field,'aria-invalid',!ok);$('input-feedback').classList.toggle('error',!ok);if(!ok)text($('input-feedback'),`请输入 1–${max} 的整数轮次。`);return ok?n:null;}
function updatePlan(){$('cycles-input').value=timeline.cycles;$('jump-cycle').max=timeline.cycles;$('jump-cycle').value=Math.min(Number($('jump-cycle').value)||1,timeline.cycles);}
$('apply-cycles').addEventListener('click',()=>{const n=validate('cycles-input');if(n===null)return;setPlaying(false);timeline=buildTimeline(n);updatePlan();reset();});
for(const result of [false,true])$(result?'jump-result':'jump-start').addEventListener('click',()=>{const n=validate('jump-cycle',timeline.cycles);if(n===null)return;setPlaying(false);seek(cycleTime(timeline,n,result));text($('input-feedback'),`已定位第 ${n} 轮${result?'产物':'过程'}。`);});
$('finish-cycle').addEventListener('click',()=>{const n=Math.max(1,current.cycle);timeline=buildTimeline(n);updatePlan();$('input-feedback').classList.remove('error');text($('input-feedback'),`完成第 ${n} 轮后进入最后延伸。`);seek(Math.min(time,timeline.duration));});
$('timeline').addEventListener('input',()=>{const target=Number($('timeline').value)/10000*timeline.duration;setPlaying(false);seek(target);});
modelArea.addEventListener('click',event=>{
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='play')setPlaying(!playing);
  if(action==='reset')reset();
  if(action==='prev'||action==='next'){setPlaying(false);const i=clamp(current.index+(action==='next'?1:-1),0,timeline.segments.length-1);seek(timeline.segments[i].start);}
  if(action==='speed'){const speeds=[.5,1,1.5,2,4,8];speed=speeds[(speeds.indexOf(speed)+1)%speeds.length];controls();post('model:state',statePayload());}
  if(action==='labels'){labels=!labels;svg.classList.toggle('hide-labels',!labels);controls();post('model:state',statePayload());}
  if(action==='highlight'){highlight=!highlight;render(current,true);controls();post('model:state',statePayload());}
  // Shared full-screen listener handles this action, including controls moved into panels.
});
function statePayload(){return {playing,speed,labels,highlight,view,stage:current.stage,stageId:STAGES[current.stage].id,cycle:current.cycle,phase:current.phase,templateIndex:current.template,templateIndices:[...current.templates],groupType:current.groupType??null,completedCycles:current.completed,counts:{...current.counts},totalCopies:current.counts.total,plannedCycles:timeline.cycles,progress:current.progress,phaseProgress:current.p,time,duration:timeline.duration,done:current.done};}
function post(type,payload,requestId){if(window.parent===window)return;const message={source:'ander-model',protocolVersion:'1.0',modelId:'pcr-product-types',type,payload};if(requestId!==undefined)message.requestId=requestId;window.parent.postMessage(message,hostOrigin);}
window.addEventListener('message',event=>{
  const m=event.data;if(event.source!==window.parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!=='pcr-product-types')return;
  if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;
  const p=m.payload||{};
  try{
    switch(m.type){
      case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()},m.requestId);break;
      case 'host:play':setPlaying(true);break;
      case 'host:pause':setPlaying(false);break;
      case 'host:reset':reset();break;
      case 'host:set-stage':{const value=p.stageId??p.stage??p.stageIndex;const index=typeof value==='string'?STAGES.findIndex(s=>s.id===value):value;if(!Number.isInteger(index)||index<0||index>=STAGES.length||!stageAvailable(index))throw new Error('无效的阶段');setPlaying(false);seek(stageTime(timeline,index));break;}
      case 'host:set-speed':if(!Number.isFinite(p.speed)||p.speed<.25||p.speed>8)throw new Error('无效的播放速度');speed=p.speed;controls();break;
      case 'host:set-labels':{const value=p.visible??p.enabled;if(typeof value!=='boolean')throw new Error('标签状态须为布尔值');labels=value;svg.classList.toggle('hide-labels',!labels);controls();break;}
      case 'host:set-highlight':if(typeof p.enabled!=='boolean')throw new Error('聚焦状态须为布尔值');highlight=p.enabled;controls();break;
      case 'host:set-view':{const value=p.viewId??p.view;if(value!=='overview')throw new Error('宿主仅支持overview预设，请在模型内放大查看');break;}
      default:throw new Error('不支持的宿主指令');
    }
    render(current,true);post('model:state',statePayload(),m.requestId);
  }catch(error){post('model:error',{message:error.message},m.requestId);}
});
window.PCRProductsModel=Object.freeze({getState:statePayload,seek,play:()=>setPlaying(true),pause:()=>setPlaying(false)});
updatePlan();render(current,true);controls();post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()});

queueMicrotask(()=>{experience=mountProductExperience({manifest:ANDER_MODEL_MANIFEST,getState:statePayload,onReturn:()=>post('model:state',{...statePayload(),navigation:'home'}),post});experience.syncStage();});
