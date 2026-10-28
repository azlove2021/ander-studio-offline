import {DURATION,STAGES,stateAt,clamp,progress,smooth,lerp} from './engine.js';
import {PhotosyntheticScene} from './scene.js';
import {createCamera} from './camera.js';
import {PROTEIN_ASSETS} from './protein-assets.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"photosynthetic-electron-transport","version":"2.2.1","publish":true,"title":{"zh":"光系统电子传递链","en":"Photosynthetic Electron Transport"},"summary":{"zh":"分段观察光能输入、水供电子、链间接力、质子转移、ATP 和 NADPH 合成，最后展示协同运行。","en":"Guided light reactions followed by coupled operation, tracking four net electron equivalents."},"module":{"id":"cell-metabolism","zh":"必修一 · 分子与细胞","en":"Molecules & Cells"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.svg","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"orientation","title":{"zh":"结构与两侧","en":"Orientation"}},{"id":"light2","title":{"zh":"光照 PSII","en":"Light input II"}},{"id":"water","title":{"zh":"激发与水供电子","en":"Charge separation"}},{"id":"relay","title":{"zh":"链间电子传递","en":"Electron relay"}},{"id":"protons","title":{"zh":"H⁺ 转移","en":"Proton gradient"}},{"id":"atp","title":{"zh":"ATP 合成","en":"ATP synthesis"}},{"id":"light1","title":{"zh":"光照 PSI","en":"Light input I"}},{"id":"fd","title":{"zh":"电子传给 Fd","en":"Electron transfer"}},{"id":"nadph","title":{"zh":"NADPH 合成","en":"NADPH formation"}},{"id":"coupled","title":{"zh":"协同运行","en":"Coupled overview"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","reused-geometry.js","reused-motion.js","path-utils.js","motion-timeline.js","engine.js","camera.js","lipids.js","molecules.js","scene.js","protein-assets.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=s=>document.querySelector(s),area=$('.model-area'),viewport=$('.diagram-window'),linked=$('.linked-canvas'),abort=new AbortController(),signal=abort.signal;
const listen=(n,t,f,o={})=>n.addEventListener(t,f,{...o,signal}),put=(n,s)=>{if(n.textContent!==s)n.textContent=s;};
$('.stage-strip').innerHTML=STAGES.map((s,i)=>'<button class="stage-tab" data-stage="'+i+'">'+AnderModelShell.stageContent(i,s.zh,s.en)+'</button>').join('');
const stageButtons=[...document.querySelectorAll('[data-stage]')],slider=$('#time-slider'),output=$('#time-output');
slider.max=String(DURATION);slider.step='.01';
const controls=Object.fromEntries([...document.querySelectorAll('[data-action]')].map(n=>[n.dataset.action,n]));
let shell=null,time=0,playing=false,speed=1,labels=true,display='linked',ready=false,disposed=false,frame=0,lastStamp=null,lastPost=0,reportedStage=-1,hostOrigin='*',selected='psii',content=null;
const scene=new PhotosyntheticScene($('#science'),$('#energy'));
const descriptions={
 psii:['光系统 Ⅱ','天线先汇聚激发能，反应中心发生光化学电荷分离。腔侧放氧复合体为氧化后的反应中心补充电子；四个净电子当量来自两份水。'],
 oec:['放氧复合体 OEC','从 S₀起始的完整教学周期累积四次氧化当量后产 O₂，不是每次激发都产生半颗氧。水源 H⁺释放与跨膜转运分别计数。'],
 pq:['PQ / PQH₂','膜内有一个 PQ 池。本图选择一个净周转代表：装载两电子及两个基质 H⁺，以 PQH₂递送到 b₆f，交接后返回；并非两只固定 Q 串行交棒。'],
 b6f:['细胞色素 b₆f','采用完整 Q 循环净式：PQH₂ + 2PC(ox) + 2H⁺(基质) → PQ + 2PC(red) + 4H⁺(腔)。内部有两次氧化、电子分流和 PQ 再生；蓝灰直线是净效应，不是一个直通孔。'],
 pc:['质体蓝素 PC','腔侧水溶性载体池。图中两份 PC 各带一个电子，沿同一路线到 PSI；卸载后返回。不是两个串联站点，也不是同一分子装两个电子。'],
 psi:['光系统 Ⅰ','发生第二次光化学激发。电子的还原能力重新提高，经内部受体传给基质侧 Fd；PSI 不泵 H⁺。'],
 fd:['铁氧还蛋白 Fd','基质侧的单电子载体。连续两次向 FNR 交接，才能支持一份 NADP⁺还原。'],
 fnr:['FNR / NADPH','FNR 内含结合型 FAD，不产生游离 FADH₂供体。每份 NADPH 对应 2 次 Fd 供电子及 1 个基质 H⁺。'],
 nadp:['NADP⁺ / NADPH','腺苷核糖 2′-磷酸在反应前后始终保留，氧化还原变化发生在烟酰胺端，不是额外添加一个磷酸。'],
 atp:['叶绿体 ATP 合酶','上方基质侧 F₁结合 ADP 和 Pi；H⁺从腔侧经 Fₒ半通道与转子回到基质，驱动耦联催化。末端 Pi 在结合位点加入，ATP 释放。可见催化循环只是代表，不计算固定 H⁺/ATP 或 ATP:NADPH。']
};
function updateLedger(s){
 $('#ledger').innerHTML='<div class="ledger-grid"><span>水氧化释放到腔</span><b>'+s.waterReleased+' / 4 H⁺</b><span>基质 → 腔累计净转移</span><b>'+s.netTransport+' / 8 H⁺</b><span>FNR 消耗基质 H⁺</span><b>'+s.fnrConsumed+' / 2 H⁺</b></div>';
}
function selectObject(id,open=true){if(!descriptions[id])return;selected=id;scene.select(id);put($('#structure-title'),descriptions[id][0]);put($('#structure-description'),descriptions[id][1]);updateLedger(stateAt(time));if(open)shell?.showPanel($('#structure-panel'),'结构与说明');}
const camera=createCamera($('#science'),viewport,linked,id=>selectObject(id),()=>document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed','false')));
function focusRect(s){
 const compact=document.body.dataset.shellCompact==='true';
 const rects={overview:[0,0,1800,720],psii:[50,90,560,620],relay:[350,150,710,480],psi:[830,75,560,550],nadph:[1030,10,430,335],atp:compact?[1450,155,320,285]:[1390,35,410,650]};
 if(viewport.clientHeight<230){const short={psii:[80,225,520,320],relay:[350,245,710,340],psi:[850,150,520,355],nadph:[1080,60,380,240],atp:[1450,155,320,285]};return short[s.focus]||rects.overview;}
 if(innerWidth>860&&!compact&&s.focus!=='atp')return rects.overview;
 return rects[s.focus]||rects.overview;
}
function focusCamera(s,mode='follow'){camera.setRect(focusRect(s),mode,s.focus);}
function followCamera(s){
 // Following can pan, but only an explicit view selection can choose a new scale.
 const centers={overview:[900,360],psii:[260,360],relay:[620,390],psi:[1000,330],nadph:[1250,190],atp:[1580,360]},prev=STAGES[Math.max(0,s.stage-1)],p=smooth(progress(time,STAGES[s.stage].start,STAGES[s.stage].start+1.4));
 const from=centers[prev.focus],to=centers[s.focus];camera.followCenter(lerp(from[0],to[0],p),lerp(from[1],to[1],p),s.focus);
}
function post(type,payload,requestId){if(parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)m.requestId=requestId;parent.postMessage(m,hostOrigin);}
function getState(){const science=stateAt(time),a=STAGES[science.stage].start,b=STAGES[science.stage+1]?.start??DURATION;return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,maturity:'formal-release',ready,time,duration:DURATION,playing,speed,labels,display,stageIndex:science.stage,stageId:science.stageId,progress:clamp((time-a)/(b-a)),overallProgress:time/DURATION,view:camera.getState().mode,selected,science,camera:camera.getState(),rendering:scene.diagnostics()};}
const presentations=new WeakMap();
function control(n,kind,value,pressed){const key=JSON.stringify([kind,value,pressed]);if(presentations.get(n)===key)return;AnderModelShell.setControl(n,kind,value,pressed);presentations.set(n,key);}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;lastStamp=null;}
function schedule(){if(ready&&playing&&!disposed&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
function render(notify=false){
 const s=stateAt(time);scene.draw(s,{labels});put($('#teaching-mode'),s.coupled?'协同运行':'分步讲解');
 slider.value=String(time);slider.setAttribute('aria-valuetext',time.toFixed(1)+' 秒，'+STAGES[s.stage].zh);put(output,time.toFixed(1)+' / '+DURATION.toFixed(1)+' s');
 put($('#electrons-count'),s.delivered+'/4');put($('#oxygen-count'),s.oxygen+'/1');put($('#nadph-count'),s.nadph+'/2');put($('#gradient-status'),'梯度：'+s.gradient);put($('#caption-note'),s.note);
 if($('#ledger').closest('.shell-dialog')&&(!render.lastLedger||render.lastLedger!==[s.waterReleased,s.netTransport,s.fnrConsumed].join(','))){updateLedger(s);render.lastLedger=[s.waterReleased,s.netTransport,s.fnrConsumed].join(',');}
 control(controls.play,playing?'pause':'play',playing?'暂停':s.complete?'重播':time>0?'继续':'播放');
 for(const k of ['reset','prev','next'])control(controls[k],k);
 control(controls.speed,'speed',String(speed));control(controls.labels,'labels','标签',labels);
 controls.prev.disabled=time<=0;controls.next.disabled=s.complete;
 if(s.stage!==reportedStage){reportedStage=s.stage;stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===s.stage);b.setAttribute('aria-current',i===s.stage?'step':'false');b.setAttribute('aria-pressed',String(i===s.stage));});shell?.syncStage();AnderModelShell.syncActiveStage();post('model:stage-changed',{stageIndex:s.stage,stageId:s.stageId});}
 if(camera.getState().mode==='follow')followCamera(s);
 document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===camera.getState().mode||(b.dataset.camera==='atp'&&camera.getState().mode==='focus'&&camera.getState().context==='atp'))));
 if(notify)post('model:state',getState());schedule();
}
function announce(){put($('#announcement'),STAGES[stateAt(time).stage].zh+'。'+(playing?'正在播放':'已暂停'));}
function play(){if(!ready)return;if(time>=DURATION)time=0;playing=true;lastStamp=null;render(true);announce();}
function pause(){playing=false;stop();render(true);announce();}
function seek(v){if(!Number.isFinite(v))throw new RangeError('进度须为有限数值');playing=false;stop();time=clamp(v,0,DURATION);render(true);announce();}
function reset(){playing=false;stop();time=0;display='linked';linked.dataset.display=display;$('#display-view').value=display;camera.setRect([0,0,1800,720],'overview','overview');render(true);announce();}
function setSpeed(v){if(![.5,1,1.5,2].includes(v))throw new RangeError('速度可选 0.5、1、1.5、2 倍');speed=v;lastStamp=null;render(true);}
function setLabels(v){if(typeof v!=='boolean')throw new TypeError('标签须为布尔值');labels=v;render(true);}
function setDisplay(v){if(!['linked','membrane','energy'].includes(v))throw new RangeError('无效科学视图');display=v;linked.dataset.display=v;$('#display-view').value=v;camera.resize();render(true);}
function setView(v){if(['linked','membrane','energy'].includes(v)){setDisplay(v);return;}if(v==='overview')camera.setRect([0,0,1800,720],'overview');else if(v==='atp')focusCamera({...stateAt(time),focus:'atp'},'focus');else if(['focus','follow'].includes(v))focusCamera(stateAt(time),v);else throw new RangeError('无效取景');render(true);}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=STAGES.length)throw new RangeError('无效阶段');seek(STAGES[i].start);}
function tick(stamp){frame=0;if(!playing||disposed||document.hidden)return;const seconds=stamp*.001;if(lastStamp!==null)time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastStamp))*speed);lastStamp=seconds;if(time===DURATION)playing=false;render();if(seconds-lastPost>.3){lastPost=seconds;const s=stateAt(time);post('model:progress',{time,duration:DURATION,stageIndex:s.stage,overallProgress:time/DURATION});}if(!playing){lastStamp=null;post('model:state',getState());announce();}}
const help='<p>先按教学顺序分段观察：光照 PSII → 激发与水供电子 → 链间电子传递 → H⁺转移 → ATP 合成 → 光照 PSI → 电子传给 Fd → NADPH 合成。最后一阶段展示协同运行。</p><p>分步观察将注意力集中到一个过程，并不表示真实反应必须逐段等待。最后一段的第二组 2e⁻与前段一起完成一个四电子净反应单位，不是整轮重播。</p><p>珊瑚红示踪 e1–e4 是净电子当量；水侧较小的无编号 e⁻表示向反应中心补电子，不额外计数。两份 PC 各载 1e⁻，代表载体池。</p><p>底部时间条可前后拖动：按下暂停，松手保留，再点播放接续。默认全链保持固定尺度；跟随只平移，ATP 局部为手动放大。接触画面停止跟随，双指或滚轮缩放，Home 看全链。多指全部松开后，新单指才能继续拖动。</p><p>科学时间与显示方式分离。蛋白表面是功能插图，非原子结构；H⁺回流及 ATP 催化是机制示踪，不计算固定产率。</p>';
shell=AnderModelShell.mountExperience({root:area,viewport:$('.model-stage'),title:'光系统电子传递链',host:window.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?window.AnderModelHost:null,helpContent:help,contextLabel:'结构、净计量与来源',onContext:()=>selectObject(selected),onSettings:()=>shell.showDialog('观察设置','<p>在画面上方切换膜与能量图；全链/跟随/ATP局部改变取景，不改变时间。标签与速度可在观察工具中调整。</p>'),onReturn:()=>post('model:state',getState()),onDisplayChange:()=>{camera.resize();if(camera.getState().mode==='follow')followCamera(stateAt(time));}});
listen(slider,'pointerdown',()=>{if(playing)pause();});listen(slider,'input',()=>seek(Number(slider.value)));listen(slider,'change',announce);
listen(controls.play,'click',()=>playing?pause():play());listen(controls.reset,'click',reset);listen(controls.prev,'click',()=>seek(STAGES.map(s=>s.start).filter(t=>t<time-.01).at(-1)??0));listen(controls.next,'click',()=>seek([...STAGES.map(s=>s.start),DURATION].find(t=>t>time+.01)??DURATION));
listen(controls.speed,'click',()=>setSpeed([.5,1,1.5,2][([.5,1,1.5,2].indexOf(speed)+1)%4]));listen(controls.labels,'click',()=>setLabels(!labels));
stageButtons.forEach((b,i)=>listen(b,'click',()=>jumpStage(i)));document.querySelectorAll('[data-camera]').forEach(b=>listen(b,'click',()=>setView(b.dataset.camera)));listen($('#display-view'),'change',()=>setDisplay($('#display-view').value));
listen(document,'keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA|A/.test(e.target.tagName)){e.preventDefault();playing?pause():play();}});
listen(window,'resize',()=>{camera.resize();if(camera.getState().mode==='follow')followCamera(stateAt(time));});
listen(document,'visibilitychange',()=>{if(document.hidden&&playing)pause();});
listen(window,'message',e=>{
 const m=e.data;if(parent===window||e.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
 if(hostOrigin!=='*'&&e.origin!==hostOrigin)return;if(e.origin!=='null')hostOrigin=e.origin;const p=m.payload||{};
 try{switch(m.type){case'host:init':post(ready?'model:ready':'model:state',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);break;case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;
 case'host:set-stage':{const v=p.stageId??p.stage??p.stageIndex;jumpStage(typeof v==='string'?STAGES.findIndex(x=>x.id===v):v);break;}case'host:set-speed':setSpeed(p.speed);break;case'host:set-labels':setLabels(p.visible??p.enabled??p.labels);break;case'host:set-view':setView(p.view??p.preset??p.viewId);break;default:throw Error('不支持此宿主指令');}post('model:state',getState(),m.requestId);}catch(error){post('model:error',{message:error.message},m.requestId);}
});
listen(window,'pagehide',()=>{playing=false;stop();camera.cancel();});listen(window,'pageshow',e=>{if(e.persisted)render();});
function destroy(){disposed=true;ready=false;playing=false;stop();camera.destroy();scene.destroy();shell.destroy();window.ModelBrandWatermark?.destroy();abort.abort();}
window.PhotosyntheticElectronTransport=Object.freeze({getState,play,pause,reset,seek,setSpeed,setLabels,setDisplay,setView,jumpStage,destroy});
async function loadContent(){
 ready=false;shell.setSceneStatus('loading');
 try{
  const readContent=async()=>{const response=await fetch(new URL('model-content.json',import.meta.url));if(!response.ok)throw Error('模型资料加载失败');return response.json();};
  const images=Object.values(PROTEIN_ASSETS).map(async a=>{const img=new Image();img.src=new URL('assets/'+a.file,import.meta.url).href;await img.decode();if(!img.naturalWidth)throw Error('蛋白素材加载失败');});
  const [loaded]=await Promise.all([readContent(),...images]);if(disposed)return;content=loaded;
  const list=$('#source-list');list.replaceChildren();for(const source of content.scientificModel.sources){const li=document.createElement('li'),a=document.createElement('a');a.textContent=source.title;a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);list.append(li);}
  ready=true;shell.setSceneStatus('ready');render(true);post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
 }catch(error){if(disposed)return;playing=false;stop();shell.setSceneStatus('error','模型资料或图像未能加载，进度已保留。',loadContent);post('model:error',{message:error.message});}
}
selectObject(selected,false);render();loadContent();
