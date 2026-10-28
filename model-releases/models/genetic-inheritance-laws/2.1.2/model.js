const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"genetic-inheritance-laws","version":"2.1.2","publish":true,"title":{"zh":"遗传学三大定律","en":"Principles of Genetic Inheritance"},"summary":{"zh":"以同一教学进度并排比较分离、自由组合和连锁交换的染色体基础。","en":"Compare segregation, independent assortment and linkage with crossing over on one shared teaching timeline."},"module":{"id":"genetics-and-evolution","zh":"遗传与进化","en":"Genetics and Evolution"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"replication","title":{"zh":"复制","en":"DNA replication"}},{"id":"meiosis-1","title":{"zh":"减数Ⅰ","en":"Meiosis I"}},{"id":"meiosis-2","title":{"zh":"减数Ⅱ","en":"Meiosis II"}},{"id":"gamete-formation","title":{"zh":"配子形成","en":"Haploid products"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","model.js","science.js","atlas-geometry.js","renderer.js","lab-gesture.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
import {DURATION,STAGES,COLUMNS,evaluate,normalizeConditions,stageAt,clamp} from './science.js';
import {GeneticsRenderer} from './renderer.js';
import {bindLabGesture} from './lab-gesture.js';

const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const root=q('.model-area'),host=q('.science-world'),timeline=q('#time-slider'),context=q('#genetics-context');
const abort=new AbortController(),listen=(el,type,fn,options={})=>el.addEventListener(type,fn,{...options,signal:abort.signal});
let state={time:0,playing:false,speed:1,labels:true,highlight:true,conditions:normalizeConditions(),selection:null};
let frames=evaluate(0,state.conditions),raf=0,previousTime=0,shell=null,resizeFrame=0,lastUI='',lastStage=-1,lastReport=0,hostOrigin='*',disposed=false;
const renderer=new GeneticsRenderer(host,pick),gesture=[];
const stageButtons=STAGES.map((stage,i)=>{const b=document.createElement('button');b.type='button';b.className='stage-tab';b.dataset.geneticsStage=stage.id;b.innerHTML=AnderModelShell.stageContent(i,stage.zh,stage.en);q('.stage-strip').append(b);listen(b,'click',()=>seek(stage.start));return b;});
const readouts=COLUMNS.map((_,i)=>{const n=document.createElement('div');n.innerHTML='<strong></strong><span></span>';q('.comparison-readouts').append(n);return{root:n,title:n.querySelector('strong'),detail:n.querySelector('span')};});
function text(el,value){if(el.textContent!==value)el.textContent=value;}
function getState(){const i=stageAt(state.time),s=STAGES[i];return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,time:state.time,duration:DURATION,stageIndex:i,stageId:s.id,progress:clamp((state.time-s.start)/(s.end-s.start),0,1),totalProgress:state.time/DURATION,playing:state.playing,speed:state.speed,labels:state.labels,highlight:state.highlight,conditions:{...state.conditions},selection:state.selection?{...state.selection}:null,columns:frames.map(f=>({id:f.id,time:f.time,phase:f.phase,counts:f.counts,chromatids:f.chromatids.map(r=>({id:r.id,proximalId:r.proximalId,distalId:r.distalId,origin:r.origin,distalOrigin:r.distalOrigin,alleles:r.alleles,cell:r.cellId,sisterGroupId:r.sisterGroupId,visible:r.visible})),products:f.products})),camera:renderer.getState(),gestures:gesture.map(g=>g.getState()),shell:shell?.getState()};}
function post(type,payload={},requestId){if(parent===window)return;parent.postMessage({source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload,...(requestId?{requestId}:{})},hostOrigin);}
function report(force=false,requestId){const now=performance.now();if(!force&&now-lastReport<220)return;lastReport=now;const s=getState();post('model:state',s,requestId);post('model:progress',{stageId:s.stageId,stageIndex:s.stageIndex,progress:s.progress},requestId);}
function render(){
  frames=evaluate(state.time,state.conditions);renderer.labels=state.labels;renderer.highlight=state.highlight;renderer.selection=state.selection;renderer.draw(frames);
  const current=stageAt(state.time),signature=[state.playing,state.speed,state.labels,state.highlight,current,state.time===0,state.time===DURATION,JSON.stringify(state.conditions)].join('/');
  if(signature!==lastUI){
    lastUI=signature;AnderModelShell.setControl(q('[data-action="play"]'),state.playing?'pause':'play',state.playing?'暂停':state.time>0?'继续':'播放',state.playing);
    AnderModelShell.setControl(q('[data-action="speed"]'),'speed',state.speed+'×');
    AnderModelShell.setControl(q('[data-action="labels"]'),'labels','标签',state.labels);
    AnderModelShell.setControl(q('[data-action="highlight"]'),'highlight','高亮',state.highlight);
    stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===current);b.setAttribute('aria-pressed',String(i===current));if(i===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    text(q('#speed-readout'),state.speed+'×');
    text(q('[data-condition-column="1"]'),state.conditions.arrangement==='coupling'?'AB｜ab':'Ab｜aB');
    text(q('[data-condition-column="2"]'),state.conditions.exchange==='cross'?'A—B间一次互换':'A—B间不互换');
    if(current!==lastStage){lastStage=current;shell?.syncStage();post('model:stage-changed',{stageId:STAGES[current].id,stageIndex:current});}
  }
  q('[data-action="prev"]').disabled=state.time===0;
  q('[data-action="next"]').disabled=state.time>=DURATION;
  text(q('#phase-title'),frames[0].phase);
  text(q('#time-readout'),state.time.toFixed(1)+' / 32 s');timeline.value=String(state.time);timeline.setAttribute('aria-valuetext',state.time.toFixed(1)+'秒，'+frames[0].phase);
  readouts.forEach((r,i)=>{
    const f=frames[i],count=f.counts;
    text(r.title,state.time>=29?f.products.map(p=>p.genotype).join(' · '):i===0?(state.time<15?'同一位点 A / a':'等位基因随染色体传递'):i===1?(state.time<15?'两对同源染色体':'不同染色体对独立组合'):(state.time<10?'同一染色体上 A—B':state.conditions.exchange==='cross'?'B / b 随远端片段交换':'A—B区间本次无互换'));
    text(r.detail,count.settled?`${count.cells===1?'当前细胞':'每个产物细胞'}：${count.chromosomes}条染色体 · ${count.dna} DNA`:'分裂 / 复制进行中');
  });
  updateSelection();
  if(context.closest('dialog[open]'))updateContext();
  report();
}
function tick(now){raf=0;if(!state.playing||disposed)return;if(previousTime)state.time=clamp(state.time+(now-previousTime)/1000*state.speed,0,DURATION);previousTime=now;if(state.time===DURATION)state.playing=false;render();if(state.playing)raf=requestAnimationFrame(tick);else previousTime=0;}
function pause(){state.playing=false;previousTime=0;cancelAnimationFrame(raf);raf=0;render();}
function play(){if(state.time>=DURATION){shell?.notify('已到达终点，可回拖进度或重置后播放。');return;}if(state.playing)return;state.playing=true;previousTime=0;render();raf=requestAnimationFrame(tick);}
function seek(value){state.time=clamp(Number(value)||0,0,DURATION);pause();}
function reset(){state.time=0;state.selection=null;pause();renderer.setView('focus');syncViewButtons();}
function setSpeed(speed){if(![.5,1,2].includes(speed))return;state.speed=speed;previousTime=0;render();}
function setConditions(value){state.conditions=normalizeConditions(value);state.selection=null;pause();updateContext();}
function setView(view){renderer.setView(view);syncViewButtons();report(true);}
function syncViewButtons(){all('[data-genetics-view]').forEach(b=>{const active=b.dataset.geneticsView===renderer.view;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});}
function pick(target){
  const path=target.closest?.('[data-fragment]');if(!path)return;
  const id=path.dataset.fragment,index=COLUMNS.findIndex(c=>id.startsWith(c.id+':'));
  const r=frames[index].chromatids.find(r=>r.proximalId===id||r.distalId===id);if(!r)return;
  state.selection={column:index,fragment:id};renderer.layoutDirty=true;render();
}
function updateSelection(){
  const s=state.selection;if(!s){text(q('.genetics-selection'),'三栏独立示例 · 同阶段比较');return;}
  const f=frames[s.column],r=f.chromatids.find(r=>r.proximalId===s.fragment||r.distalId===s.fragment);
  if(!r){state.selection=null;return;}
  const distal=r.distalId===s.fragment,allele=distal?r.distalAllele:r.proximalAllele,origin=distal?r.distalOrigin:r.origin;
  text(q('.genetics-selection'),`${COLUMNS[s.column].short} · ${allele||'近端'}片段来源${origin===1?'Ⅰ':'Ⅱ'} → 当前${r.alleles} · ${r.cellId}`);
}
function updateContext(){
  const detail=frames.map((f,i)=>`<p><strong>${COLUMNS[i].title}</strong>：${f.condition}。${state.time>=29?'本次四产物：'+f.products.map(p=>p.genotype).join('、'):'四产物尚未形成。'}</p>`).join('');
  if(q('#context-current').innerHTML!==detail)q('#context-current').innerHTML=detail;
  const population='<div class="population-row"><strong>分离：</strong>正常分离、无偏倚时，A、a理论各1/2。</div><div class="population-row"><strong>自由组合：</strong>两对染色体独立且等可能取向，多次独立分裂的AB、Ab、aB、ab理论各1/4；本次无标记互换的一次分裂只产生其中两类。</div><div class="population-row"><strong>连锁：</strong>群体说明例r=20%，亲本型AB、ab各40%，重组型Ab、aB各10%。该例值来自群体参数假设，不由当前四产物计算，也不根据图上距离推算。</div>';
  if(q('#population-results').innerHTML!==population)q('#population-results').innerHTML=population;
}
function openContext(trigger){q('#arrangement-select').value=state.conditions.arrangement;q('#exchange-select').value=state.conditions.exchange;context.hidden=false;updateContext();shell.showPanel(context,'条件与科学说明',trigger);}
function queueResize(){if(resizeFrame||disposed)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;if(root.dataset.immersive==='true'){
    root.style.setProperty('--genetics-safe-top',q('.shell-identity').getBoundingClientRect().height+'px');
    root.style.setProperty('--genetics-safe-bottom',q('.control-dock').getBoundingClientRect().height+'px');
    const corner=q('.model-brand-corner');if(corner)root.style.setProperty('--genetics-corner-clearance',(corner.getBoundingClientRect().right+4)+'px');
  }
  const tiny=innerWidth<=380&&innerHeight<=540&&root.dataset.immersive!=='true',views=q('.genetics-views');
  root.classList.toggle('genetics-tiny',tiny);
  const destination=tiny||root.dataset.immersive==='true'?context:q('.genetics-toolbar');if(views.parentElement!==destination)destination.append(views);
  const bounds=renderer.columns[0].viewport.getBoundingClientRect();
  if(renderer.width&&(Math.abs(bounds.width-renderer.width)>.5||Math.abs(bounds.height-renderer.height)>.5))gesture.forEach(g=>g.cancel());
  renderer.resize();window.ModelBrandWatermark?.refresh();});}
gesture.push(bindLabGesture({viewport:host,reference:e=>{
  const column=e.target.closest?.('.gene-column')||renderer.columns[1].viewport;
  return{x:column.getBoundingClientRect().left-host.getBoundingClientRect().left,y:0};
},transform:v=>{renderer.transform(v);syncViewButtons();},onStart:()=>{renderer.manual();syncViewButtons();},onTap:pick}));
for(const c of renderer.columns){
  listen(c.viewport,'keydown',e=>{if(e.target!==c.viewport)return;const arrows={ArrowLeft:[24,0],ArrowRight:[-24,0],ArrowUp:[0,24],ArrowDown:[0,-24]};if(arrows[e.key])renderer.pan(...arrows[e.key]);else if(e.key==='+'||e.key==='=')renderer.zoom(1.2);else if(e.key==='-')renderer.zoom(1/1.2);else if(e.key==='Home')setView('overview');else if(e.key==='Enter')pick(c.viewport.querySelector('[data-layer="live"] .gene-hit'));else return;e.preventDefault();syncViewButtons();});
}
listen(timeline,'pointerdown',pause);listen(timeline,'input',()=>seek(timeline.valueAsNumber));listen(timeline,'change',()=>{if(Math.abs(state.time-timeline.valueAsNumber)>.005)seek(timeline.valueAsNumber);});
listen(timeline,'keydown',e=>{if(e.key==='Home')seek(0);else if(e.key==='End')seek(DURATION);else if(e.key==='ArrowLeft'||e.key==='ArrowDown')seek(state.time-.1);else if(e.key==='ArrowRight'||e.key==='ArrowUp')seek(state.time+.1);else return;e.preventDefault();});
listen(root,'click',e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(!a||a==='fullscreen')return;
  if(a==='play')state.playing?pause():play();else if(a==='reset')reset();else if(a==='speed')setSpeed([.5,1,2][([.5,1,2].indexOf(state.speed)+1)%3]);
  else if(a==='prev'){const prev=[0,4,20,29].filter(t=>t<state.time-.01).at(-1);seek(prev??0);}else if(a==='next'){seek([4,20,29,32].find(t=>t>state.time+.01)??32);}
  else if(a==='labels'){state.labels=!state.labels;renderer.layoutDirty=true;render();}else if(a==='highlight'){state.highlight=!state.highlight;renderer.layoutDirty=true;render();}
});
all('[data-genetics-view]').forEach(b=>listen(b,'click',()=>setView(b.dataset.geneticsView)));
listen(q('#apply-conditions'),'click',()=>{setConditions({arrangement:q('#arrangement-select').value,exchange:q('#exchange-select').value});shell.closeDialog();});
listen(q('#conditions-button'),'click',e=>openContext(e.currentTarget));
all('[data-condition-column]').forEach(b=>listen(b,'click',e=>openContext(e.currentTarget)));
const help='<p>左、中、右分别展示分离、自由组合和连锁交换；三栏共用一条32秒教学进度。播放、阶段和拖动同时控制三栏。</p><p>拖动即暂停，可前进或回退，松手停住；点击播放接续。键盘方向键微调，Home/End定位首尾。两项条件可在相同阶段分别调整。</p><p>“全流程”查看竖向谱系，“同阶段”恢复当前作用处。单指拖动、双指或滚轮缩放三栏共同取景；双指全部松开后再单指操作。点击基因可追踪实际片段。</p><p>全屏轻触唤出控件，最后松手约2秒收起，按住不收。收藏由可选宿主提供，独立预览无账户连接。</p>';
function mount(){
  const back=()=>{pause();shell.showDialog('独立模型预览','<p>关闭此标签页可返回之前的页面。</p>',document.activeElement);};
  shell=AnderModelShell.mountExperience({root,viewport:q('.science-viewport'),title:'遗传学三大定律',returnLabel:'返回目录',onReturn:back,host:globalThis.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?globalThis.AnderModelHost:null,helpContent:help,contextLabel:'条件与科学说明',hasContext:()=>true,onContext:openContext,settingsLabel:'显示与条件',onSettings:openContext,onDisplayChange:()=>{queueResize();post('model:request-fullscreen',{active:root.dataset.display!=='normal'});}});
  AnderModelShell.setExtra(q('#settings-button'),'settings','显示与条件');listen(q('#settings-button'),'click',e=>openContext(e.currentTarget));listen(q('.independent-model-back'),'click',e=>{e.preventDefault();back();});
  renderer.resize();render();shell.setSceneStatus('ready');root.dataset.ready='true';post('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities});report(true);
  resizeObserver.observe(q('.shell-identity'));resizeObserver.observe(q('.control-dock'));resizeObserver.observe(q('.comparison-readouts'));
}
const resizeObserver=new ResizeObserver(queueResize);resizeObserver.observe(host);listen(window,'resize',queueResize);
listen(document,'visibilitychange',()=>{if(document.hidden){pause();gesture.forEach(g=>g.cancel());}});
listen(window,'blur',()=>{previousTime=0;});
listen(window,'pagehide',e=>{pause();gesture.forEach(g=>g.cancel());if(!e.persisted){disposed=true;resizeObserver.disconnect();cancelAnimationFrame(resizeFrame);gesture.forEach(g=>g.destroy());shell?.destroy();abort.abort();}});
listen(window,'pageshow',e=>{if(e.persisted){previousTime=0;queueResize();}});
listen(window,'message',e=>{
  const m=e.data;if(parent===window||e.source!==parent||m?.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id||(hostOrigin!=='*'&&e.origin!==hostOrigin))return;
  const p=m.payload||{};
  if(m.type==='host:init'){hostOrigin=e.origin;post('model:ready',{version:ANDER_MODEL_MANIFEST.version,capabilities:ANDER_MODEL_MANIFEST.capabilities},m.requestId);}
  else if(m.type==='host:play')play();else if(m.type==='host:pause')pause();else if(m.type==='host:reset')reset();
  else if(m.type==='host:set-stage'){const stage=STAGES.find(s=>s.id===p.stageId);if(!stage)return post('model:error',{code:'INVALID_STAGE'},m.requestId);seek(stage.start);}
  else if(m.type==='host:set-speed'){if(![.5,1,2].includes(Number(p.speed)))return post('model:error',{code:'INVALID_SPEED'},m.requestId);setSpeed(Number(p.speed));}
  else if(m.type==='host:set-labels'){state.labels=p.visible!==false;renderer.layoutDirty=true;render();}
  else if(m.type==='host:set-highlight'){state.highlight=Boolean(p.enabled);renderer.layoutDirty=true;render();}
  else if(m.type==='host:set-view'){const view=p.view??p.preset;if(!['overview','focus'].includes(view))return post('model:error',{code:'INVALID_VIEW'},m.requestId);setView(view);}
  else return;report(true,m.requestId);
});
window.GeneticsModel=Object.freeze({getState,evaluate:(t,c)=>evaluate(t,c),seek,play,pause,setConditions,setView});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else queueMicrotask(mount);
