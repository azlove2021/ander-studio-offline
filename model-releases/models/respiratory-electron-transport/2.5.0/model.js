import{ENTRIES,stateAt,clamp,durationFor,stagesFor}from'./engine.js';
import{ETCScene}from'./scene.js';
import{createCamera}from'./camera.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"respiratory-electron-transport","version":"2.5.0","publish":true,"title":{"zh":"细胞呼吸电子传递链","en":"Respiratory Electron Transport"},"summary":{"zh":"追踪 NADH 和复合体 II 两条电子入口，观察质子梯度、氧还原与 ATP 旋转催化的能量耦联。","en":"Trace electron transfer, proton gradients, oxygen reduction and rotary ATP synthesis."},"module":{"id":"cell-metabolism","zh":"必修一 · 分子与细胞","en":"Molecules & Cells"},"technology":"svg-2d-interactive","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":false,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"location","title":{"zh":"结构定位","en":"Orientation"}},{"id":"entry","title":{"zh":"电子输入","en":"Electron entry"}},{"id":"transfer","title":{"zh":"载体接力与泵氢","en":"Carrier relay"}},{"id":"oxygen","title":{"zh":"氧还原成水","en":"Oxygen reduction"}},{"id":"coupling","title":{"zh":"ATP 合成","en":"ATP synthesis"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","reused-geometry.js","reused-motion.js","art-helpers.js","science-art.js","motion-paths.js","motion-timeline.js","engine.js","camera.js","lipids.js","molecules.js","scene.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=s=>document.querySelector(s),area=$('.model-area'),viewport=$('.diagram-window'),abort=new AbortController(),signal=abort.signal;
const listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal});
let DURATION=durationFor('nadh'),stages=stagesFor('nadh');
const controls=Object.fromEntries([...document.querySelectorAll('[data-action]')].map(e=>[e.dataset.action,e]));
$('.stage-strip').innerHTML=stages.map((s,i)=>'<button class="stage-tab" data-stage="'+i+'">'+AnderModelShell.stageContent(i,s.zh,s.en)+'</button>').join('');
const stageButtons=[...document.querySelectorAll('[data-stage]')],slider=$('#time-slider'),output=$('#time-output');
slider.max=DURATION;slider.step='.01';
const help='<p>选择 NADH 或复合体 II 入口。首份底物已位于结合位点，点击播放立即开始递电子；切换入口会从起点开始。</p><p>直接拖动底部进度可前进或回退；按下暂停，松手保持，再点播放接续。</p><p>接触科学画面即锁定当前取景，播放继续；拖动画面平移，双指或滚轮缩放；“全貌”显示完整内膜，“作用处”定位当前反应，“跟随”恢复自动取景。键盘 Home 看全貌，+ / − 缩放。</p><p>暖珊瑚红追踪电子交接，蓝灰色表示 H⁺。所选入口的路线常驻显示：待用时半透明，传递时高亮；连续通路只在终点保留箭头；H⁺ 上行通路为加粗直线，空载体返回为柔和虚线。所有空间移动按路径长度和相近画面速度计时；相连路线随粒子立即交接，必要的双电子装载及载体空载返回保留。O₂ 先在膜下等待，随后移入 IV。两批电子各 2e⁻，第二批补齐氧还原所需的 4e⁻。电子最终交给氧，H⁺ 经 Fₒ 回流驱动催化。每批追踪两个电子；同一颜色保持同一含义。ATP 的腺嘌呤为六元环与五元环稠合，核糖为五元环，三个磷酸由核糖 5′ 侧依次连接。只跟踪膜内 Q 池中的一个代表，连续展示接收、递送、交接与返回；其他 Q 分子也可并行工作，没有固定的左右 Q 接力顺序。为便于观察，ATP 合成独立放在最后一步；ADP 和 Pi 先进入位点，随后多个原有 H⁺ 快速通过 Fₒ，转动随其通过推进；粒子数量不代表固定 H⁺/ATP 比值；真实呼吸中各过程持续耦联。时间、相对能量及结构比例为教学示意。</p>';
let shell=null,entry='nadh',time=0,playing=false,speed=1,labels=true,paths=true,ready=false,disposed=false,frame=0,lastStamp=null,lastPost=0,reportedStage=-1,reportedFocus='',hostOrigin='*',selected='complex-I',loadGeneration=0;
const scene=new ETCScene($('#science'),$('#energy'));
const descriptions={
 'complex-I':['复合体 I','基质侧接收 NADH 的电子，交给膜内 Q。每对电子对应 4 个 H⁺ 的外向转运贡献。'],
 'complex-II':['复合体 II','琥珀酸被氧化为延胡索酸；FAD/FADH₂ 结合在酶内。电子汇入 Q，此处不泵送 H⁺。'],
 'Q-pool':['Q / QH₂','内膜中有许多可移动的 Q，组成 Q 池；并无固定的“左 Q → 右 Q”顺序。本图追踪其中一个代表：在 I 或 II 入口接收 2e⁻ 与基质 H⁺，以 QH₂ 递送至 III，交接后返回。III 按 Q 循环净过程表示，未展开其内部各 Q 分子和半醌中间体。'],
 'complex-III':['复合体 III','用 Q 循环净过程表示：每净两电子交给细胞色素 c，对膜间隙产生 4H⁺ 的净贡献。蓝色曲线并非四质子直通孔。'],
 'cytochrome-c':['细胞色素 c','位于膜间隙侧，在 III、IV 之间移动，每次携带一个电子。'],
 'complex-IV':['复合体 IV','完整轮转：4e⁻ + 4个基质 H⁺ + O₂ → 2H₂O；另有 4H⁺ 被向外转运，两个质子用途分开记录。'],
 'ATP-synthase':['ATP 合酶','H⁺ 经 Fₒ 的两个半通道与转子作用，驱动转子和中央轴。外周支架固定；基质侧 F₁ 催化位点结合 ADP/Pi、改变构象、合成并释放 ATP。本演示不计算固定总产率。']
};
function selectObject(id,open=true){if(!descriptions[id])return;selected=id;scene.select(id);$('#structure-title').textContent=descriptions[id][0];$('#structure-description').textContent=descriptions[id][1];if(open)shell.showPanel($('#structure-panel'),'结构与说明');}
const camera=createCamera($('#science'),viewport,id=>selectObject(id),()=>document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed','false')));
function focusRect(s){
 const tiny=innerWidth<360&&innerHeight<530,compact=document.body.dataset.shellCompact==='true';
 if(s.focus==='oxygen')return tiny||compact?[1040,350,255,250]:[1030,185,300,520];
 if(s.focus==='synthase'){if(!s.synthesis.rotorEngaged)return[1100,10,500,695];return tiny||compact?(s.synthesis.bound?[1325,419,275,173]:[1305,240,295,465]):[1310,250,290,455];}
 if(s.focus==='transfer'){const loading=s.qCarrier.mode==='loading',carrying=s.qCarrier.mode==='delivery'||s.qCarrier.mode==='loaded';return loading?(s.entry==='nadh'?[95,185,705,450]:[480,175,410,405]):carrying?(s.entry==='nadh'?[365,155,620,295]:[635,155,380,295]):tiny?[765,190,475,275]:[755,140,620,535];}
 if(s.focus==='overview')return[0,0,1600,720];
 return s.entry==='nadh'?(tiny?[100,255,415,310]:compact?[65,245,755,330]:[0,160,820,520]):tiny?[480,260,300,290]:[455,190,490,480];
}
function focusCamera(s,mode='follow'){
 const small=innerWidth<=860||document.body.dataset.shellCompact==='true';
 const box=mode==='follow'&&!small&&DURATION>12?[0,0,1600,720]:s.focus==='orientation'?[0,60,825,660]:focusRect(s);
 camera.setRect(box,mode,s.focus);
}
function post(type,payload,requestId){if(parent===window)return;const m={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)m.requestId=requestId;parent.postMessage(m,hostOrigin);}
function getState(){const science=stateAt(entry,time),start=stages[science.stage].start,end=stages[science.stage+1]?.start??DURATION;return{modelId:ANDER_MODEL_MANIFEST.id,version:ANDER_MODEL_MANIFEST.version,ready,entry,time,duration:DURATION,playing,speed,labels,paths,stageIndex:science.stage,stageId:science.stageId,progress:clamp((time-start)/(end-start)),overallProgress:time/DURATION,view:camera.getState().mode,selected,science,camera:camera.getState(),rendering:scene.getDiagnostics()};}
const presentations=new WeakMap();
function control(node,kind,value,pressed){const key=JSON.stringify([kind,value,pressed]);if(presentations.get(node)===key)return;AnderModelShell.setControl(node,kind,value,pressed);presentations.set(node,key);}
const put=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;lastStamp=null;}
function schedule(){if(ready&&playing&&!disposed&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
function render(notify=false){
 const s=stateAt(entry,time);scene.draw(s,{labels,paths});
 slider.value=String(time);slider.setAttribute('aria-valuetext',time.toFixed(1)+' 秒，共 '+DURATION+' 秒，'+stages[s.stage].zh);put(output,time.toFixed(1)+' / '+DURATION+' s');
 put($('#caption-note'),s.note);
 put($('#reaction-readout'),s.reaction);
 control(controls.play,playing?'pause':'play',playing?'暂停':s.complete?'重播':time>0?'继续':'播放');
 for(const kind of ['reset','prev','next'])control(controls[kind],kind);
 control(controls.speed,'speed',String(speed));control(controls.labels,'labels','标签',labels);if(!controls.paths.dataset.presented){AnderModelShell.setExtra(controls.paths,'tools','路径');controls.paths.dataset.presented='true';}controls.paths.setAttribute('aria-pressed',String(paths));
 controls.prev.disabled=time<=0;controls.next.disabled=s.complete;
 if(s.stage!==reportedStage){reportedStage=s.stage;stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===s.stage);b.setAttribute('aria-current',i===s.stage?'step':'false');b.setAttribute('aria-pressed',String(i===s.stage));});shell?.syncStage();AnderModelShell.syncActiveStage();if(!camera.getState().manual||camera.getState().mode==='focus')focusCamera(s,camera.getState().mode==='focus'?'focus':'follow');post('model:stage-changed',{stageIndex:s.stage,stageId:s.stageId});}
 const focusKey=s.focus+':'+(s.focus==='transfer'?s.qCarrier.mode:s.focus==='synthase'?s.synthesis.bound:'');
 if(focusKey!==reportedFocus){reportedFocus=focusKey;if(!camera.getState().manual||camera.getState().mode==='focus')focusCamera(s,camera.getState().mode==='focus'?'focus':'follow');}
 document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.camera===camera.getState().mode)));
 if(notify)post('model:state',getState());schedule();
}
function announce(){put($('#announcement'),stages[stateAt(entry,time).stage].zh+'。'+(playing?'正在播放。':'已暂停。'));}
function play(){if(!ready)return;if(time>=DURATION)time=0;playing=true;lastStamp=performance.now()*.001;render(true);announce();}
function pause(){playing=false;stop();render(true);announce();}
function seek(value){if(!Number.isFinite(value))throw new RangeError('进度须为有限数值。');playing=false;stop();time=clamp(value,0,DURATION);render(true);announce();}
function reset(){seek(0);}
function setEntry(value){if(!ENTRIES.includes(value))throw new RangeError('此入口不可用。');entry=value;DURATION=durationFor(entry);stages=stagesFor(entry);slider.max=DURATION;$('#entry').value=value;reportedStage=-1;seek(0);}
function setSpeed(value){if(![.5,1,1.5,2].includes(value))throw new RangeError('速度可选 0.5、1、1.5、2 倍。');speed=value;lastStamp=null;render(true);}
function setLabels(value){if(typeof value!=='boolean')throw new TypeError('标签须为布尔值。');labels=value;render(true);}
function setView(value){if(!['overview','focus','follow'].includes(value))throw new RangeError('无效视角。');if(value==='overview')camera.setRect([0,0,1600,720],'overview');else focusCamera(stateAt(entry,time),value);render(true);}
function jumpStage(i){if(!Number.isInteger(i)||i<0||i>=stages.length)throw new RangeError('无效阶段。');seek(stages[i].start);}
function tick(stamp){frame=0;if(!playing||disposed||document.hidden)return;const seconds=stamp*.001;if(lastStamp!==null)time=Math.min(DURATION,time+Math.min(.12,Math.max(0,seconds-lastStamp))*speed);lastStamp=seconds;if(time===DURATION)playing=false;render();if(seconds-lastPost>.25){lastPost=seconds;const s=getState();post('model:progress',{time,duration:DURATION,stageIndex:s.stageIndex,progress:s.progress,overallProgress:s.overallProgress});}if(!playing){lastStamp=null;post('model:state',getState());announce();}}
async function loadImages(){const generation=++loadGeneration;ready=false;shell.setSceneStatus('loading');stop();try{
 await Promise.all(['complex-I','complex-II','complex-III','complex-IV','atp-synthase'].map(id=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>img.decode().then(resolve,reject);img.onerror=()=>reject(new Error('蛋白素材加载失败：'+id));img.src='assets/'+id+'.png';})));
 if(disposed||generation!==loadGeneration)return;ready=true;shell.setSceneStatus('ready');render(true);post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()});
 }catch(e){if(generation!==loadGeneration)return;playing=false;ready=false;shell.setSceneStatus('error','素材未能加载，当前进度已保留。',loadImages);post('model:error',{message:e.message});}}
shell=AnderModelShell.mountExperience({root:area,viewport:$('.model-stage'),title:'细胞呼吸电子传递链',host:window.AnderModelHost?.modelId===ANDER_MODEL_MANIFEST.id?window.AnderModelHost:null,helpContent:help,contextLabel:'结构与说明',onContext:()=>selectObject(selected),onSettings:()=>shell.showDialog('观察设置','<p>切换入口会从起点演示。标签和路径可在观察工具中切换，进度始终在底栏。</p>'),onReturn:()=>post('model:state',getState()),onDisplayChange:()=>{camera.resize();if(!camera.getState().manual||camera.getState().mode==='focus')focusCamera(stateAt(entry,time),camera.getState().mode==='focus'?'focus':'follow');}});
listen(slider,'pointerdown',()=>{if(playing)pause()});listen(slider,'input',()=>seek(Number(slider.value)));listen(slider,'change',announce);
listen(controls.play,'click',()=>playing?pause():play());listen(controls.reset,'click',reset);listen(controls.prev,'click',()=>seek(stages.map(s=>s.start).filter(t=>t<time-1e-6).at(-1)??0));listen(controls.next,'click',()=>seek([...stages.map(s=>s.start),DURATION].find(t=>t>time+1e-6)??DURATION));
listen(controls.speed,'click',()=>setSpeed([.5,1,1.5,2][([.5,1,1.5,2].indexOf(speed)+1)%4]));
listen(controls.labels,'click',()=>setLabels(!labels));listen(controls.paths,'click',()=>{paths=!paths;render(true)});
listen($('#entry'),'change',()=>setEntry($('#entry').value));
stageButtons.forEach((b,i)=>listen(b,'click',()=>jumpStage(i)));
document.querySelectorAll('[data-camera]').forEach(b=>listen(b,'click',()=>setView(b.dataset.camera)));
document.querySelectorAll('[data-energy]').forEach(b=>listen(b,'click',()=>{const id={transfer:entry==='nadh'?'complex-I':'complex-II',gradient:'complex-III',synthase:'ATP-synthase'}[b.dataset.energy];selectObject(id,false);camera.setRect(id==='ATP-synthase'?[1300,82,300,635]:id==='complex-III'?[755,140,550,480]:focusRect({...stateAt(entry,time),focus:'entry'}),'focus',id==='ATP-synthase'?'synthase':id==='complex-III'?'transfer':'entry');}));
listen(document,'keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA|A/.test(e.target.tagName)){e.preventDefault();playing?pause():play()}});
listen(window,'resize',()=>{camera.resize();if(!camera.getState().manual||camera.getState().mode==='focus')focusCamera(stateAt(entry,time),camera.getState().mode==='focus'?'focus':'follow');});
listen(document,'visibilitychange',()=>{if(document.hidden&&playing)pause()});
listen(window,'message',event=>{
 const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;
 if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const p=m.payload||{};
 try{switch(m.type){case'host:init':if(ready)post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...getState()},m.requestId);else post('model:state',getState(),m.requestId);break;case'host:play':play();break;case'host:pause':pause();break;case'host:reset':reset();break;
 case'host:set-stage':{const s=p.stageId??p.stage??p.stageIndex;jumpStage(typeof s==='string'?stages.findIndex(x=>x.id===s):s);break}
 case'host:set-speed':setSpeed(p.speed);break;case'host:set-labels':setLabels(p.visible??p.enabled??p.labels);break;case'host:set-view':setView(p.view??p.preset??p.viewId);break;
 default:throw Error('本模型不支持此宿主指令。');}post('model:state',getState(),m.requestId)}catch(e){post('model:error',{message:e.message},m.requestId);}
});
listen(window,'pagehide',()=>{playing=false;stop();camera.cancel();});listen(window,'pageshow',e=>{if(e.persisted)render()});
function destroy(){disposed=true;ready=false;playing=false;++loadGeneration;stop();camera.destroy();shell.destroy();window.ModelBrandWatermark?.destroy();abort.abort();}
window.RespiratoryElectronTransport=Object.freeze({getState,play,pause,reset,seek,setEntry,setSpeed,setLabels,setView,jumpStage,destroy});
selectObject(selected,false);focusCamera(stateAt(entry,time));render();loadImages();
