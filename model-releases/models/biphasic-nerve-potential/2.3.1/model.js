const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"biphasic-nerve-potential","version":"2.3.1","publish":true,"title":{"zh":"双相神经干电位","en":"Biphasic Nerve Potential"},"summary":{"zh":"观察成束神经纤维的兴奋传导，比较双极膜外记录与四种电极条件下的复合电位。","en":"Explore compound action potentials in a nerve bundle with bipolar extracellular recording and four electrode configurations."},"module":{"id":"homeostasis","zh":"选择性必修一 · 神经调节","en":"Homeostasis and Neural Regulation"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"rest","title":{"zh":"静息与接线","en":"Rest & Electrodes"}},{"id":"stimulation","title":{"zh":"刺激与传导","en":"Stimulation & Conduction"}},{"id":"first-phase","title":{"zh":"第一相","en":"First Phase"}},{"id":"second-phase","title":{"zh":"第二相","en":"Second Phase"}},{"id":"recovery","title":{"zh":"回零与比较","en":"Recovery & Comparison"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","signal.js","circuit-assets.js","anatomy.js","scene-navigation.js","neural-layout.js","model.js","brand-watermark.js"],"styles":["shell.css","model.css","brand-watermark.css","neural-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
import {PARAMETERS,CONDITIONS,STAGES,VISIBLE_SPEEDS,clamp,activation,measurement,buildTrace,stageAt,msAtSeconds,secondsAtMs,frontPosition,stimulation} from './signal.js';
import {SPACE,axonX,chamberX,localScale,sceneMarkup,IMAGE_ASSETS} from './anatomy.js';
const root=document.querySelector('[data-independent-model-root]');
const state={seconds:0,playing:false,speed:1,labels:true,highlight:true,condition:'near',ready:false};
const traces=Object.fromEntries(Object.keys(CONDITIONS).map(k=>[k,buildTrace(k)]));
const $=s=>root.querySelector(s),$$=s=>Array.from(root.querySelectorAll(s));
const controls=[['play','▶ 播放'],['reset','↺ 重置'],['prev','‹ 上一步'],['next','下一步 ›']];
root.innerHTML=`<main class="independent-model-app">
 <header class="independent-model-header"><button type="button" class="independent-model-back" data-action="back" aria-label="返回主页"><span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 50 36"><path class="back-arrow-secondary" d="M28 2L1 18L28 34Z"/><path class="back-arrow-separator" d="M32 2L7 18L32 34Z"/><path class="back-arrow-primary" d="M49 2L20 18L49 34Z"/></svg></span><span class="independent-model-back-label">返回<br>主页</span></button><div class="independent-model-heading"><div class="independent-model-kicker">选择性必修一 · 神经调节 / Neural Regulation</div><h1>双相神经干电位 <small>/ Biphasic Nerve Potential</small></h1></div></header>
 <div class="independent-model-workspace"><section class="model-area" data-ready="false" aria-label="双相神经干电位交互模型">
  <nav class="stage-strip" aria-label="五个教学阶段">${STAGES.map((s,i)=>`<button type="button" class="stage-tab" data-stage="${i}">${globalThis.AnderModelShell.stageContent(i,s.zh,s.en)}</button>`).join('')}</nav>
  <div class="model-stage">
   <section class="scene-panel"><div class="scene-title"><strong>完整神经干 · 双极膜外记录</strong><span data-condition-label></span></div><div class="drawing-scroll"><div class="scene-board">${sceneMarkup()}</div></div>
    <div class="scene-legend"><span><i></i>兴奋区</span><span><i class="recovery-key"></i>已通过 · 恢复区</span><span><i class="sheath-key"></i>神经外膜</span></div>
    <p class="scene-note"><span class="mobile-note">左右滑动查看整束与末梢，向下查看记录曲线。</span>胞体与末梢为标本外结构示意；图中主要呈现向右的记录路径。</p>
   </section>
   <aside class="record-panel"><section class="stage-status" aria-live="polite"><div class="status-title"><span class="status-kicker" data-stage-kicker>STAGE 01 / 05</span><span class="status-time" data-time>0.00 ms</span></div><h2 data-stage-title>静息与接线</h2><small data-stage-en>Rest & Electrodes</small><p data-summary></p></section><h2 class="conditions-title">记录条件</h2><div class="condition-grid" aria-label="四种记录电极条件">${Object.entries(CONDITIONS).map(([id,c])=>`<button type="button" data-condition="${id}">${c.name.replace('记录电极','记录电极<br>').replace('距离刺激电极','距离刺激电极<br>')}</button>`).join('')}</div>
    <section class="voltage-card" aria-label="双极记录曲线"><div class="record-head"><div><h2>双相复合电位</h2><small data-equation>φ(R2) − φ(R1)</small></div><div class="reading"><strong data-reading>0.00</strong> <span>相对值</span></div></div>
     <svg class="record-plot" role="img" aria-label="电位随时间变化：橙色细线为固定近距基准，浅色虚线为当前条件完整过程，红色为当前动态记录，三者同轴同增益"><defs><clipPath id="wave-reveal"><rect data-reveal x="0" y="0" width="0" height="260"/></clipPath></defs><path data-grid class="plot-grid"/><path data-axis class="plot-axis"/><text data-y-title>记录电位 / 相对值</text><text data-x-title>示意时间 / ms</text>${[0,1,2,3,4].map(i=>`<text data-xtick="${i}" text-anchor="middle">${i}</text>`).join('')}${[-1,-.5,0,.5,1].map(v=>`<text data-ytick="${v}" text-anchor="end">${v>0?'+':''}${v}</text>`).join('')}<path data-baseline data-baseline-condition="near" class="plot-baseline"/><path data-reference class="plot-reference"/><path data-current class="plot-current" clip-path="url(#wave-reveal)"/><path data-cursor class="plot-cursor"/><circle data-plot-point class="plot-point" r="4"/></svg>
     <div class="plot-legend"><span title="固定为近距条件的基本双相电位；同一时间轴、同一增益"><i class="baseline"></i>近距基准</span><span><i></i>本条件</span><span><i class="current"></i>当前记录</span></div>
     <div class="record-values"><span>R1 膜外变化<b data-r1-value>0.00</b></span><span>R2 膜外变化<b data-r2-value>0.00</b></span></div>
    </section>
    <p class="condition-detail" data-condition-detail></p><div class="stimulate-row"><button type="button" data-action="stimulate">施加刺激</button><span data-load class="load-status"></span></div>
    <p class="sample-note">所有条件使用相同坐标范围和增益。多纤维响应叠加；比例与数值为教学示意。</p>
   </aside>
  </div>
  <footer class="control-dock"><div class="control-group control-group-primary">${controls.map(([action,label])=>`<button type="button" data-action="${action}" class="control-button ${action==='play'?'is-primary':''}">${label}</button>`).join('')}</div><label class="timeline-wrap"><span>过程进度</span><input type="range" min="0" max="2400" step="1" value="0" data-timeline aria-label="过程进度"><output data-progress>0%</output></label><div class="control-group control-group-view">${[['speed','× 1 倍速'],['labels','Aa 隐藏标签'],['highlight','✦ 关闭高亮'],['fullscreen','⛶ 全屏']].map(([action,label])=>`<button type="button" class="control-button" data-action="${action}">${label}</button>`).join('')}</div></footer>
 </section></div></main>`;
const refs={area:$('.model-area'),drawing:$('.drawing-scroll'),board:$('.scene-board'),plot:$('.record-plot'),range:$('[data-timeline]'),
  play:$('[data-action="play"]'),progress:$('[data-progress]'),baseline:$('[data-baseline]'),reference:$('[data-reference]'),current:$('[data-current]'),reveal:$('[data-reveal]'),cursor:$('[data-cursor]'),point:$('[data-plot-point]'),
  gradients:$$('[data-gradient]'),fibers:$$('[data-fiber]'),stages:$$('[data-stage]'),conditions:$$('[data-condition]'),probes:$$('[data-probe]'),wires:$$('[data-record-wire]'),bands:$$('[data-response-band]'),
  chamberElectrodes:$$('[data-chamber-electrode]'),chamberLeads:$$('[data-chamber-lead]'),unusedPosts:$$('[data-unused-post]'),
  led:$('[data-stim-led]'),stimWire:$('[data-stim-wire]'),pulse:$('[data-pulse-callout]'),stageTitle:$('[data-stage-title]'),stageEn:$('[data-stage-en]'),kicker:$('[data-stage-kicker]'),summary:$('[data-summary]'),time:$('[data-time]'),
  r1:$('[data-r1-value]'),r2:$('[data-r2-value]'),reading:$('[data-reading]')};
let plot={left:42,right:250,top:32,bottom:170,width:270,height:210,mid:100,gain:65},lastStage=-1,lastReport=-1,raf=0,lastTime=0,lastPaint=0,lastText=-1,plotKey='';
let hostOrigin='*';try{if(document.referrer)hostOrigin=new URL(document.referrer).origin;}catch{}
const px=ms=>plot.left+ms/PARAMETERS.endMs*(plot.right-plot.left),py=u=>plot.mid-u*plot.gain;
const set=(node,attributes)=>{for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));};
const format=v=>(Math.abs(v)<.005?0:v).toFixed(2).replace('-','−');
function emit(type,payload={},requestId){if(window.parent!==window)window.parent.postMessage({source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload,requestId},hostOrigin);}
function report(requestId){const ms=msAtSeconds(state.seconds),stage=stageAt(traces[state.condition],ms);emit('model:state',{stageIndex:stage,stageId:STAGES[stage].id,playing:state.playing,speed:state.speed,labels:state.labels,highlight:state.highlight,progress:state.seconds/PARAMETERS.lessonSeconds,condition:state.condition,physiologicalTimeMs:ms,...measurement(state.condition,ms)},requestId);}
function updateCondition(){
  const c=CONDITIONS[state.condition];refs.conditions.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.condition===state.condition)));
  $('[data-condition-label]').textContent=state.condition==='near'?'R1、R2 较近':state.condition==='wide'?'R1、R2 较远':state.condition==='swap'?'记录输入对调':'记录点整体远移';
  $('[data-condition-detail]').textContent=c.detail;
  $('[data-equation]').textContent=c.sign===1?'φ(R2) − φ(R1)':'φ(R1) − φ(R2)';$('[data-circuit-equation]').textContent=c.sign===1?'R2 − R1':'R1 − R2';
  for(const node of refs.probes){const key=node.dataset.probe,x=axonX(c[key]);node.setAttribute('transform',`translate(${x} 0)`);node.dataset.distance=c[key];}
  for(const wire of refs.wires){const id=wire.dataset.recordWire,x=axonX(c[id]),first=id==='r1',y=first?277:292,input=first?265:281;
    wire.setAttribute('d',`M${x} 305V${y}H${first?774:782}V${input}H817`);}
  for(const id of ['r1','r2']){const sign=(id==='r1'? -1:1)*c.sign>0?'+':'−';$(`[data-record-label="${id}"]`).textContent=id.toUpperCase()+' '+sign;$(`[data-input-sign="${id}"]`).textContent=sign;$(`[data-chamber-sign="${id}"]`).textContent=sign;}
  const positions={anode:-6,cathode:0,ground:12,r1:c.r1,r2:c.r2};
  refs.chamberElectrodes.forEach(n=>{const mm=positions[n.dataset.chamberElectrode];n.setAttribute('transform',`translate(${chamberX(mm)} 0)`);n.dataset.distance=mm;});
  refs.unusedPosts.forEach(n=>n.setAttribute('visibility',Object.values(positions).includes(Number(n.dataset.unusedPost))?'hidden':'visible'));
  refs.chamberLeads.forEach(n=>{const key=n.dataset.chamberLead,y=key==='r1'?40:55;n.setAttribute('d',`M${chamberX(c[key])} 84V${y}H869`);});
  plotKey='';updatePlot();
}
function updatePlot(){
  const key=state.condition+':'+plot.width;if(key===plotKey)return;
  const d=traces[state.condition].samples.map((p,i)=>`${i?'L':'M'}${px(p.ms).toFixed(3)} ${py(p.u).toFixed(3)}`).join(' ');
  refs.baseline.setAttribute('d',traces.near.samples.map((p,i)=>`${i?'L':'M'}${px(p.ms).toFixed(3)} ${py(p.u).toFixed(3)}`).join(' '));
  refs.reference.setAttribute('d',d);refs.current.setAttribute('d',d);plotKey=key;
  refs.reference.setAttribute('opacity',state.condition==='near'?'0':'1');
}
function stageSummary(stage,c){const positive=c.sign===1?'正':'负',negative=c.sign===1?'负':'正';return [
  '两个记录点都位于膜外，静息时电位相近，差分记录为零。',
  '刺激阴极附近先兴奋。纤维群一起响应，以略有差异的速度传导。',
  `兴奋先经过 R1，R1 附近膜外电位下降，当前接法下出现${positive}偏转。`,
  `兴奋随后经过 R2，两个位置的响应差改变方向，形成${negative}偏转。两处响应可以重叠。`,
  '两个记录点的响应消退，差分曲线回零。单根纤维的动作电位不会随传播距离衰减。'
][stage];}
function render(force=false){
  const ms=msAtSeconds(state.seconds),c=CONDITIONS[state.condition],q=measurement(c,ms),stage=stageAt(traces[state.condition],ms),on=activation(ms),stim=stimulation(ms);
  Object.assign(refs.area.dataset,{ready:String(state.ready),playing:String(state.playing),condition:state.condition,stage:String(stage),seconds:state.seconds.toFixed(5),ms:ms.toFixed(5),r1:q.r1.toFixed(7),r2:q.r2.toFixed(7),voltage:q.u.toFixed(7),stimActive:String(stim>.01)});
  for(const g of refs.gradients){const i=Number(g.dataset.index),v=VISIBLE_SPEEDS[i],kind=g.dataset.gradient,front=frontPosition(v,ms,kind==='backward'?-1:1);
    let a,b;if(kind==='recovery'){a=front-v*.58;b=front-v*.24;}else{a=front-v*PARAMETERS.templateSigmaMs*3.4;b=front+v*PARAMETERS.templateSigmaMs*3.4;}
    set(g,{x1:axonX(a),x2:axonX(b)});
  }
  refs.fibers.forEach((n,i)=>{n.style.setProperty('--active-opacity',on.toFixed(4));n.dataset.frontMm=frontPosition(VISIBLE_SPEEDS[i],ms).toFixed(5);});
  refs.board.style.setProperty('--excitation-opacity',on.toFixed(4));
  refs.bands.forEach(n=>n.setAttribute('opacity',state.highlight?Math.min(1,-q[n.dataset.responseBand]*1.3):0));
  refs.led.setAttribute('fill',stim>.01?'#df9d2f':'#c4d4cf');set(refs.stimWire,{opacity:stim,'stroke-dashoffset':(-state.seconds*74).toFixed(3)});refs.pulse.setAttribute('opacity',stim);
  set(refs.reveal,{width:Math.max(0,px(ms)-plot.left)});refs.cursor.setAttribute('d',`M${px(ms)} ${plot.top}V${plot.bottom}`);set(refs.point,{cx:px(ms),cy:py(q.u)});
  if(force||stage!==lastStage||Math.abs(state.seconds-lastText)>=.1){
    refs.time.textContent=`${ms.toFixed(2)} ms`;refs.reading.textContent=format(q.u);refs.r1.textContent=format(q.r1);refs.r2.textContent=format(q.r2);
    refs.range.value=Math.round(state.seconds*100);refs.progress.textContent=`${Math.round(state.seconds/PARAMETERS.lessonSeconds*100)}%`;lastText=state.seconds;
  }
  if(force||stage!==lastStage){
    refs.stages.forEach((b,i)=>{const chosen=i===stage;b.setAttribute('aria-pressed',String(chosen));b.classList.toggle('is-active',chosen);});
    const nav=refs.stages[stage].parentElement,tabBox=refs.stages[stage].getBoundingClientRect(),navBox=nav.getBoundingClientRect();
    if(tabBox.left<navBox.left+6)nav.scrollLeft+=tabBox.left-navBox.left-6;
    else if(tabBox.right>navBox.right-6)nav.scrollLeft+=tabBox.right-navBox.right+6;
    refs.kicker.textContent=`STAGE 0${stage+1} / 05`;refs.stageTitle.textContent=STAGES[stage].zh+(stage===2?' · '+(c.sign===1?'正':'负')+'相':stage===3?' · '+(c.sign===1?'负':'正')+'相':'');refs.stageEn.textContent=STAGES[stage].en;refs.summary.textContent=stageSummary(stage,c);
    $('[data-action="prev"]').disabled=stage===0;$('[data-action="next"]').disabled=stage===4;
    if(lastStage!==stage){lastStage=stage;emit('model:stage-changed',{stageIndex:stage,stageId:STAGES[stage].id});}
  }
  if(force){
    globalThis.AnderModelShell.setControl(refs.play,"play",state.playing?'Ⅱ 暂停':state.seconds>=PARAMETERS.lessonSeconds?'↻ 再播放':'▶ 播放');
    refs.area.classList.toggle('hide-labels',!state.labels);refs.area.classList.toggle('no-highlight',!state.highlight);
    globalThis.AnderModelShell.setControl($('[data-action="speed"]'),"speed",`× ${state.speed} 倍速`);
    globalThis.AnderModelShell.setControl($('[data-action="labels"]'),"labels",state.labels?'Aa 隐藏标签':'Aa 显示标签');globalThis.AnderModelShell.setControl($('[data-action="highlight"]'),"highlight",state.highlight?'✦ 关闭高亮':'✦ 开启高亮');
    for(const k of ['labels','highlight'])$(`[data-action="${k}"]`).setAttribute('aria-pressed',String(state[k]));
  }
 globalThis.NeuralSample?.sync();
  if(Math.floor(state.seconds)!==lastReport){lastReport=Math.floor(state.seconds);emit('model:progress',{progress:state.seconds/PARAMETERS.lessonSeconds,stageIndex:stage,physiologicalTimeMs:ms});}
}
function tick(){raf=0;if(!state.playing)return;const now=performance.now()*.001;if(lastTime)state.seconds=Math.min(PARAMETERS.lessonSeconds,state.seconds+Math.min(.2,now-lastTime)*state.speed);lastTime=now;
  if(now-lastPaint>=1/30||state.seconds>=PARAMETERS.lessonSeconds){render();lastPaint=now;}
  if(state.seconds>=PARAMETERS.lessonSeconds){state.playing=false;render(true);report();}else raf=requestAnimationFrame(tick);
}
function play(){if(!state.ready)return;if(state.seconds>=PARAMETERS.lessonSeconds)state.seconds=0;state.playing=true;lastTime=0;lastPaint=0;if(!raf)raf=requestAnimationFrame(tick);render(true);}
function pause(){state.playing=false;if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;render(true);}
function seek(seconds){pause();state.seconds=clamp(seconds,0,PARAMETERS.lessonSeconds);render(true);report();}
function goStage(index){const i=clamp(index,0,4);seek(secondsAtMs(traces[state.condition].jumps[i]));}
async function action(name){
 if(name==='reset')globalThis.NeuralSample?.resetView();
  if(name==='play'){if(state.playing)pause();else play();}
  else if(name==='reset'){pause();Object.assign(state,{seconds:0,speed:1,labels:true,highlight:true,condition:'near'});updateCondition();render(true);}
  else if(name==='prev'||name==='next')goStage(stageAt(traces[state.condition],msAtSeconds(state.seconds))+(name==='next'?1:-1));
  else if(name==='speed'){const speeds=[.5,1,1.5,2];state.speed=speeds[(speeds.indexOf(state.speed)+1)%speeds.length];render(true);}
  else if(name==='labels'||name==='highlight'){state[name]=!state[name];render(true);}
  else if(name==='stimulate'){seek(secondsAtMs(PARAMETERS.stimulusMs-.018));play();}
  else if(name==='fullscreen')return; // Shared shell owns fullscreen and immersion.
  else if(name==='back'){const p=new URLSearchParams(location.search),v=p.get('return')||p.get('returnTo')||document.referrer;if(v){try{const u=new URL(v,location.href);if(['http:','https:'].includes(u.protocol))location.assign(u.href);}catch{}}else if(history.length>1)history.back();}
  report();
}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.condition){state.condition=b.dataset.condition;updateCondition();render(true);report();}else if(b.dataset.stage!==undefined)goStage(Number(b.dataset.stage));else if(b.dataset.action)action(b.dataset.action);});
refs.range.addEventListener('input',()=>seek(Number(refs.range.value)/100));
document.addEventListener('visibilitychange',()=>{lastTime=0;});
window.addEventListener('message',e=>{
  const m=e.data;if(e.source!==window.parent||window.parent===window||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id||(hostOrigin!=='*'&&e.origin!==hostOrigin))return;
  const p=m.payload||{};
  if(m.type==='host:init'){if(hostOrigin==='*'&&e.origin!=='null')hostOrigin=e.origin;emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:state.ready},m.requestId);}
  else if(m.type==='host:play')play();else if(m.type==='host:pause')pause();else if(m.type==='host:reset')action('reset');
  else if(m.type==='host:set-stage'){const i=STAGES.findIndex(s=>s.id===p.stageId);if(i>=0)goStage(i);}
  else if(m.type==='host:set-speed'&&[.5,1,1.5,2].includes(Number(p.speed)))state.speed=Number(p.speed);
  else if(m.type==='host:set-labels')state.labels=p.visible!==false;else if(m.type==='host:set-highlight')state.highlight=!!p.enabled;
  render(true);report(m.requestId);
});
function resize(){
  globalThis.NeuralSample?.resize();
  const width=Math.max(120,refs.plot.clientWidth),height=Math.max(70,refs.plot.clientHeight),top=23,bottom=height-32;plot={width,height,left:34,right:width-10,top,bottom,mid:top+69/137*(bottom-top),gain:65/137*(bottom-top)};refs.plot.setAttribute('viewBox',`0 0 ${width} ${height}`);
  let grid='';for(const v of [-1,-.5,.5,1])grid+=`M${plot.left} ${py(v)}H${plot.right}`;
  $('[data-grid]').setAttribute('d',grid);$('[data-axis]').setAttribute('d',`M${plot.left} ${plot.top}V${plot.bottom}M${plot.left} ${py(0)}H${plot.right}`);
  set($('[data-y-title]'),{x:2,y:13});set($('[data-x-title]'),{x:plot.right,y:height-2,'text-anchor':'end'});
  $$('[data-xtick]').forEach(t=>set(t,{x:px(Number(t.dataset.xtick)),y:plot.bottom+15}));$$('[data-ytick]').forEach(t=>set(t,{x:plot.left-7,y:py(Number(t.dataset.ytick))+4}));
  set(refs.reveal,{x:plot.left,y:plot.top-3,height:plot.bottom-plot.top+6});plotKey='';updatePlot();render(true);
}
new ResizeObserver(resize).observe(refs.drawing);new ResizeObserver(resize).observe(refs.plot);
async function init(){neuralLayout.loading();try{
  updateCondition();resize();await Promise.all(IMAGE_ASSETS.map(src=>{const img=new Image();img.src=src;return img.decode();}));
  state.ready=true;neuralLayout.ready();render(true);emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true});report();
}catch(error){pause();neuralLayout.failed('神经干插图加载失败。重新加载将保留当前进度。',init);emit('model:error',{message:error.message});console.error(error);}}
const neuralLayout=NeuralModelLayout.mount({manifest:ANDER_MODEL_MANIFEST,root,width:SPACE.width,height:SPACE.height,getState:()=>({...state}),onResize:resize});
init();
