const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"action-potential-conduction","version":"2.7.2","publish":true,"title":{"zh":"动作电位的传导","en":"Action Potential Conduction"},"summary":{"zh":"观察无髓轴突中部刺激后，局部电流推动动作电位向两侧逐段再生。","en":"Explore local currents and bidirectional action potential regeneration in an unmyelinated axon."},"module":{"id":"homeostasis","zh":"选择性必修一 · 神经调节","en":"Homeostasis and Neural Regulation"},"technology":"svg-webgl-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"rest","title":{"zh":"全膜静息","en":"Resting Membrane"}},{"id":"central","title":{"zh":"中央刺激与兴奋","en":"Central Excitation"}},{"id":"local-current","title":{"zh":"局部电流","en":"Local Currents"}},{"id":"regeneration","title":{"zh":"邻区兴奋与复极","en":"Propagation and Repolarization"}},{"id":"bidirectional","title":{"zh":"双向传导与恢复","en":"Bidirectional Conduction"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","transport-primitives.js","physiology.js","presentation.js","circuit-assets.js","proteins.js","scene-navigation.js","neural-layout.js","simulation-cache.js","simulation-worker.js","membrane-layer.js","model.js","brand-watermark.js"],"styles":["shell.css","model.css","brand-watermark.css","neural-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
import {P,simulate,sample,feature,channelState,clamp,smooth} from './physiology.js';
import {buildTeachingTimeline as timeline,teachingState as lessonState,buildConductionPlan,pairedPolarity,currentFocus,currentArc,diagramLayout,currentWindow,partialCurrentArc,polarityBlend,motion,spatialPlot,spatialProfile,lessonDuration,buildTeachingTrace} from './presentation.js';
import {createProteins} from './proteins.js';
import {createMembraneLayer} from './membrane-layer.js';
let membraneLayer,membraneReady;
function ensureMembraneLayer(){
 if(!membraneReady)membraneReady=createMembraneLayer(refs.board,{width:W,scale:globalThis.NeuralSample?.getState().navigation.scale||.25}).then(value=>{membraneLayer=value;value.setResolution(globalThis.NeuralSample?.getState().navigation.scale||.25);return value;}).catch(error=>{membraneReady=null;throw error;});
 return membraneReady;
}
import {loadTeachingTraces} from './simulation-cache.js';
import {neuronInset,stimulatorCircuit} from './circuit-assets.js';
const root=document.querySelector('[data-independent-model-root]');
const W=1100,H=680,centres=diagramLayout.centres,membranes=[{id:'upper',y:285,normal:1},{id:'lower',y:diagramLayout.lowerY,normal:-1}];
const proteinScale=10,offset=15,lipidScale=.19,middle=(centres.length-1)/2,siteNames=centres.map((_,i)=>i<middle?'L'+(middle-i):i>middle?'R'+(i-middle):'S');
const segmentWidth=centres[1]-centres[0],regions=[{index:-1,x:45,width:centres[0]-segmentWidth/2-45},...centres.map((x,index)=>({index,x:x-segmentWidth/2,width:segmentWidth})),{index:centres.length,x:centres.at(-1)+segmentWidth/2,width:1055-centres.at(-1)-segmentWidth/2}];
const NAMES=['全膜静息','中央刺激与兴奋','局部电流','邻区兴奋与复极','双向传导与恢复'];
const EN=['Resting Membrane','Central Excitation','Local Currents','Propagation & Repolarization','Bidirectional Conduction'];
const DESCRIPTIONS=[
 '上下两条膜是同一轴突的边界，中间为细胞内。各处内负外正；梯度已经建立，背景离子运动持续。',
 '中央 Na⁺ 通道快速激活，Na⁺ 内流。膜电位超过 0 mV 时，中央两对符号同步变为内正外负。',
 '每条局部电流箭头均由 + 指向 −。膜内由兴奋区流向两侧，膜外反向回流；四条虚线持续运动，使邻区去极化。',
 '前一区恢复内负外正时，两侧各两对符号同步反转，四条电流从起点逐渐退去，并在新的兴奋前沿接续出现。恢复极性后，复极化仍可继续。',
 '两侧各以两对符号为一个示意膜段，依次兴奋并恢复。四条箭头连续交接，直到兴奋传出视野；后方仍经历不应期与恢复。'
];
const state={seconds:0,playing:false,speed:1,labels:true,highlight:true,stimulus:'standard',selected:middle+1,ready:false,last:0};
let traces,landmarks,conductionPlan,sites,proteins,lastStage=-1,lastProtocolSecond=-1,plotKey='',lastDraw=0,lastLipid=-1;
const ion=(kind,r=10,extra='')=>`<g class="ion ${extra}"><circle r="${r}" fill="${kind==='Na⁺'?'#4c91c3':kind==='K⁺'?'#936eb4':'#99aaaf'}"/><text y="${r*.34}" style="font-size:${r*.82}px">${kind}</text></g>`;
const marker=(id,color)=>`<marker id="${id}" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M1 0 L6 3 L1 6" fill="none" stroke="${color}" stroke-width="1.4"/></marker>`;
function background(){return ['outside-top','inside'].map((side,lane)=>Array.from({length:7},(_,i)=>{
 const inside=side==='inside',x=70+i*154,y=inside?385:174;
 const kind=inside?(i%5===0?'Na⁺':i%5===4?'A⁻':'K⁺'):(i%5===0?'K⁺':i%5===4?'Cl⁻':'Na⁺');
 return `<g data-bg data-base-x="${x}" data-base-y="${y}" data-lane-y="${y}" data-phase="${(i+lane*17)*.91}" data-phase-b="${i*.41+.2+lane}" data-speed=".1" data-range-x="10" data-range-y="5" data-min-x="45" data-max-x="1055" data-min-y="${y-7}" data-max-y="${y+7}" data-side="${inside?'inside':'outside'}">${ion(kind,9,'background-ion')}</g>`;
 }).join('')).join('');}
function underlay(){
 const count=Math.ceil(1000/(20.2*lipidScale))+1,exclusions=centres.flatMap(x=>[x-offset,x+offset]);
 return `<svg class="scene-underlay" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
 <radialGradient id="lipidHead2d" cx="35%" cy="28%" r="75%"><stop stop-color="#e1f5ff"/><stop offset="1" stop-color="#8dccea"/></radialGradient><linearGradient id="lipidTail2d"><stop stop-color="#a0d9f0"/><stop offset="1" stop-color="#d1e9f4"/></linearGradient>
 <filter id="charge-soft" x="-15%" y="-70%" width="130%" height="240%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="4"/></filter>
 ${membranes.map(m=>`<mask id="membrane-${m.id}"><rect x="45" y="${m.y-17}" width="1010" height="34" fill="white"/>${m.id==='upper'?exclusions.map(x=>`<rect x="${x-10}" y="${m.y-19}" width="20" height="38" fill="black"/>`).join(''):''}</mask>`).join('')}</defs>
 <rect x="32" y="158" width="1036" height="127" rx="10" fill="#eff8fc"/><rect x="32" y="285" width="1036" height="${diagramLayout.lowerY-285}" fill="#fffaf0"/><rect x="32" y="${diagramLayout.lowerY}" width="1036" height="${664-diagramLayout.lowerY}" rx="10" fill="#eff8fc"/>
 <g class="charge-pulse" filter="url(#charge-soft)">${membranes.map(m=>regions.map(r=>['outside','inside'].map(side=>`<rect data-band data-location="${r.index}" data-side="${side}" x="${r.x}" y="${m.y+(side==='outside'?-1:1)*m.normal*30-12}" width="${r.width}" height="24" rx="4" fill="${side==='outside'?'#f6c5a4':'#bed5f1'}"/>`).join('')).join('')).join('')}</g>
 <g data-background>${background()}</g>
 ${membranes.map(m=>`<g data-membrane-art="${m.id}" data-head-separation="23.94" mask="url(#membrane-${m.id})"><rect x="45" y="${m.y-10.5}" width="1010" height="21" fill="#dfeef4" opacity=".5"/><g transform="translate(49 ${m.y-279*lipidScale}) scale(${lipidScale})">${transportIntegratedLipids(count)}</g></g>`).join('')}
 </svg>`;
}
function chargeSymbol(x,m,location,pair,side){const outside=side==='outside';return `<g data-charge data-location="${location}" data-pair="${location}-${pair}" data-side="${side}" data-membrane="${m.id}" data-x="${x}" transform="translate(${x} ${m.y+(outside?-1:1)*m.normal*30+9})"><text data-positive class="charge is-positive" opacity="${outside?1:0}">+</text><text data-negative class="charge" opacity="${outside?0:1}">−</text></g>`;}
function overlay(){return `<svg class="scene-overlay" viewBox="0 0 ${W} ${H}" role="img" aria-label="同一轴突纵剖面，上下膜之间为细胞内，局部电流推动双向传导"><defs>${marker('arrow-na','#397dab')}${marker('arrow-k','#84569d')}${marker('arrow-current','#bf7b20')}<filter id="current-soft" x="-25%" y="-100%" width="150%" height="300%"><feGaussianBlur stdDeviation="3.8"/></filter></defs>
 <rect x="226.08" y="63.8" width="35.36" height="17" rx="3" fill="#dfefe5" stroke="#66aa95" stroke-width="1.5"/>${neuronInset}
 <g class="optional-label"><text x="550" y="35" class="small" text-anchor="middle">中部一次刺激</text>
 <text x="45" y="153" class="label">细胞外</text><text x="45" y="378" class="label">细胞内 / 轴浆</text><text x="45" y="662" class="small">细胞外</text></g>
 <g data-currents>${['left','right'].map(side=>['outer-top','inner'].map(lane=>`<g data-current-slot="${side}-${lane}" data-side="${side}" data-lane="${lane}" data-active="false" opacity="0" visibility="hidden"><path data-current-glow class="current-glow" filter="url(#current-soft)" transform="translate(0 3)"/><path data-current-path class="current-arrow"/><path data-current-tip class="current-tip" d="M-7 -3.3 L0 0 L-7 3.3"/></g>`).join('')).join('')}</g>
 ${membranes.filter(m=>m.id==='upper').map(m=>centres.map((cx,i)=>['nav','kv'].map(kind=>{
 const x=cx+(kind==='nav'?-offset:offset),count=kind==='nav'?4:2;
 return `<g data-channel="${kind}" data-location="${i}" data-membrane="${m.id}" data-axis="${x}" aria-label="${siteNames[i]} ${m.id==='upper'?'上':'下'}膜 ${kind==='nav'?'钠':'钾'}通道"><path data-flow-arrow class="flow-arrow" stroke="${kind==='nav'?'#397dab':'#84569d'}" marker-end="url(#${kind==='nav'?'arrow-na':'arrow-k'})"/><g data-flow-tokens>${Array.from({length:count},()=>`<g data-token>${ion(kind==='nav'?'Na⁺':'K⁺',3)}</g>`).join('')}</g></g>`;
 }).join('')).join('')).join('')}
 <g data-charges>${membranes.map(m=>[
  ...centres.map((cx,i)=>diagramLayout.chargeOffsets.map((dx,pair)=>['outside','inside'].map(side=>chargeSymbol(cx+dx,m,i,pair,side)).join('')).join('')),
  ...['left','right'].map(side=>['outside','inside'].map(lane=>chargeSymbol(diagramLayout.edgeCentres[side],m,side==='left'?-1:centres.length,0,lane)).join(''))
 ].join('')).join('')}</g>
 ${stimulatorCircuit}
 <g class="recording-circuit" aria-label="所选位置的膜内电极与膜外参比"><circle cx="976" cy="91" r="29" class="circuit-unit"/><path d="M956 88 A21 21 0 0 1 996 88" fill="none" stroke="#bcccd2" stroke-width="2"/><path d="M976 89 V69" data-meter-needle stroke="#d34754" stroke-width="2.6"/><circle cx="976" cy="89" r="3" fill="#607e89"/><text x="976" y="110" text-anchor="middle" font-size="19" font-weight="700">V</text><text x="939" y="69" font-size="15">−</text><text x="1006" y="69" font-size="15">+</text>
 <path data-record-wire-inner class="circuit-wire"/><path data-record-wire-outer class="circuit-wire"/><g data-probe-inner><path d="M-3 240 H3 V306 L0 316 L-3 306 Z" fill="#e0edf1" stroke="#5e7f8c" stroke-width="1.2"/><path d="M0 312 V323" class="probe-contact"/></g><g data-probe-outer><rect x="-3.5" y="221" width="7" height="19" rx="2" class="probe-body"/><path d="M0 237 V246" class="probe-contact"/></g><text data-record-label x="976" y="43" class="small optional-label" text-anchor="middle">R1：膜内 − 膜外</text></g>
 <g data-position-labels>${centres.map((x,i)=>`<g data-site="${i}" data-voltage="-65"><rect data-selected-site x="${x-20}" y="495" width="40" height="24" rx="6" class="selected-site" opacity="${i===middle+1?1:0}"/><text x="${x}" y="514" text-anchor="middle" class="site-name">${siteNames[i]}</text><text data-site-status x="${x}" y="535" text-anchor="middle" class="site-status">静息</text><rect data-choose-site="${i}" x="${x-(segmentWidth-4)/2}" y="491" width="${segmentWidth-4}" height="49" rx="5" class="site-hit" role="button" tabindex="0" aria-label="记录 ${siteNames[i]} 位置膜电位"/></g>`).join('')}</g>
 <g data-spatial-plot role="img" aria-label="沿轴突各位置的教学膜电位，恢复时程压缩，横向位置与上方膜段一致"><defs><clipPath id="spatial-clip"><rect x="${spatialPlot.left}" y="${spatialPlot.top}" width="${spatialPlot.right-spatialPlot.left}" height="${spatialPlot.bottom-spatialPlot.top}"/></clipPath><clipPath id="spatial-recovery-clip"><rect x="${spatialPlot.left}" y="${spatialPlot.baseline}" width="${spatialPlot.right-spatialPlot.left}" height="${spatialPlot.bottom-spatialPlot.baseline}"/></clipPath></defs><path class="spatial-baseline" d="M${spatialPlot.left} ${spatialPlot.baseline} H${spatialPlot.right}"/>${centres.map(x=>`<path class="spatial-tick" d="M${x} ${spatialPlot.baseline-3} V${spatialPlot.baseline+3}"/>`).join('')}<g clip-path="url(#spatial-clip)"><path data-spatial-fill class="spatial-fill"/><path data-spatial-recovery class="spatial-recovery" clip-path="url(#spatial-recovery-clip)"/><path data-spatial-trace class="spatial-trace"/><circle data-spatial-dot class="spatial-dot" r="3.2"/></g></g>
 <g class="optional-label"><text x="1060" y="149" text-anchor="end" class="small" fill="#a07b22">膜外局部电流</text><text x="1060" y="378" text-anchor="end" class="small">膜内局部电流</text></g>
 </svg>`;}
const plot={left:51,right:378,top:34,bottom:240,width:395,height:278};
const px=t=>plot.left+t/P.duration*(plot.right-plot.left),py=v=>plot.top+(50-v)/140*(plot.bottom-plot.top);
function plotMarkup(){return `<svg class="record-plot" viewBox="0 0 395 278" role="img" aria-label="所选位置膜电位随教学示意时间变化，恢复时程压缩，红色已发生曲线，虚线完整参考"><defs><clipPath id="plot-clip"><rect x="${plot.left}" y="${plot.top}" width="${plot.right-plot.left}" height="${plot.bottom-plot.top}"/></clipPath></defs><text data-y-title x="7" y="18" font-size="14" fill="#6e8790">膜电位 / mV</text>
 ${[-80,-65,-40,0,40].map(v=>`<path data-plot-grid="${v}" d="M${plot.left} ${py(v)} H${plot.right}" stroke="${v===0?'#c9d8dc':'#e5eef0'}" stroke-width="1"/><text data-plot-y="${v}" x="${plot.left-8}" y="${py(v)+4}" text-anchor="end" font-size="13" fill="#78909a">${v}</text>`).join('')}
 <path data-plot-axis d="M${plot.left} ${plot.top} V${plot.bottom} H${plot.right}" fill="none" stroke="#adc6cc"/>
 ${[0,10,20,30,40].map(t=>`<text data-plot-x="${t}" x="${px(t)}" y="259" text-anchor="${t===40?'end':'middle'}" font-size="13" fill="#78909a">${t}</text>`).join('')}
 <path data-threshold-line d="M${plot.left} ${py(-55)} H${plot.right}" stroke="#c2a269" stroke-dasharray="4 4"/><text data-threshold-label x="${plot.right-1}" y="${py(-55)-7}" text-anchor="end" font-size="13" fill="#b29668">阈电位 ≈ −55 mV</text>
 <g clip-path="url(#plot-clip)"><path data-reference fill="none" stroke="#c2d5db" stroke-width="2.5" stroke-dasharray="5 5"/><path data-trace fill="none" stroke="#d94755" stroke-width="3.3"/><path data-cursor stroke="#8caaa1" stroke-dasharray="3 5"/><circle data-plot-dot r="4.5" fill="#d94755" stroke="#fff" stroke-width="1.6"/></g><text data-x-title x="378" y="276" text-anchor="end" font-size="13" fill="#738d94">示意时间 / ms</text></svg>`;}
root.innerHTML=`<main class="independent-model-app"><header class="independent-model-header"><button class="independent-model-back" data-action="back" aria-label="返回主页"><span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span><span class="independent-model-back-label"><span>返回</span><span>主页</span></span></button><div class="independent-model-heading"><span class="independent-model-kicker">选择性必修一 · 神经调节 / Neural Regulation</span><h1>动作电位的传导 <small>/ Action Potential Conduction</small></h1></div></header>
 <section class="independent-model-workspace"><section class="model-area" aria-label="动作电位传导模型" data-playing="false"><nav class="stage-strip" aria-label="教学阶段">${NAMES.map((n,i)=>`<button class="stage-tab" data-stage="${i}" aria-pressed="${i===0}">${globalThis.AnderModelShell.stageContent(i,n,EN[i])}</button>`).join('')}</nav><div class="model-stage">
 <section class="scene-panel" aria-label="轴突纵剖面"><div class="scene-title"><strong>轴突纵剖面 · 局部电流与传导</strong><span data-conduction-focus>各处保持静息</span></div><div class="drawing-scroll"><div class="scene-board">${underlay()}<canvas class="protein-canvas" aria-label="Blender 通道蛋白的连续构象"></canvas>${overlay()}</div></div><div class="scene-legend"><span><i class="dot"></i>Na⁺ / 钠通道</span><span><i class="dot k"></i>K⁺ / 钾通道</span><span><i class="gold-line"></i>局部电流</span></div><p class="scene-note">两对符号代表一个膜段；符号原位反转，兴奋向两侧再生。箭头表示前沿局部电流，其余分量省略。</p></section>
 <aside class="record-panel"><section class="stage-status"><div class="status-title"><p class="stage-status-kicker" data-stage-kicker>STAGE 01 / 05</p><span class="status-time" data-ms-label>0.00 ms</span></div><h2 data-stage-title>全膜静息</h2><small data-stage-en>Resting Membrane</small><p data-summary>${DESCRIPTIONS[0]}</p></section>
 <section class="voltage-card"><div class="record-head"><div><h2>膜电位记录 · <span data-record-site>R1</span></h2><small>V内 − V外</small></div><div class="reading"><strong data-voltage-reading>−65.0</strong><span> mV</span></div></div><div class="probe-choices" aria-label="记录位置"><button data-probe="${middle}" aria-pressed="false">S 刺激点</button><button data-probe="${middle+1}" aria-pressed="true">R1 近端</button><button data-probe="${centres.length-1}" aria-pressed="false">${siteNames.at(-1)} 远端</button></div>${plotMarkup()}<div class="plot-legend"><span><i></i><span data-reference-label>完整过程</span></span><span><i class="dark"></i>已发生记录</span></div><p class="threshold-note">阈电位为教学参考，实际阈值随状态变化。</p></section>
 <div class="stimulus-controls" aria-label="刺激强度"><button data-stimulus="weak" aria-pressed="false">阈下刺激</button><button data-stimulus="standard" aria-pressed="true">阈上刺激</button><button class="apply-stim" data-action="stimulate" disabled>施加刺激</button></div>
 <div class="gate-states"><div class="gate-state">所选位置 Na⁺ 通道<b data-na-state>关闭 · 可激活</b><div class="conductance"><i data-na-bar></i></div><small data-na-fraction></small></div><div class="gate-state kv">所选位置 K⁺ 通道<b data-k-state>关闭为主</b><div class="conductance"><i data-k-bar></i></div><small data-k-fraction></small></div></div>
 <p class="sample-note">恢复内负外正不等于已完全恢复静息。恢复时程作教学压缩，两图与通道状态同步；膜段宽度为示意。</p><div class="structure-detail"><strong>观察位置 <span data-detail-site>R1</span></strong><span data-site-detail>内负外正 · 关闭的 Na⁺ 通道仍可激活。</span></div></aside></div>
 <footer class="control-dock"><div class="control-group control-group-primary"><button class="control-button is-primary" data-action="play" disabled>▶ 播放</button><button class="control-button" data-action="reset">↺ 重置</button><button class="control-button" data-action="prev" aria-label="上一阶段">‹ 上一步</button><button class="control-button" data-action="next" aria-label="下一阶段">› 下一步</button></div><label class="timeline-wrap"><span>过程进度</span><input type="range" min="0" max="${lessonDuration*100}" value="0" step="1" aria-label="演示进度"><output data-progress>0%</output><span data-load class="load-status">载入中…</span></label><div class="control-group control-group-view"><button class="control-button" data-action="speed">× 1 倍速</button><button class="control-button" data-action="labels" aria-pressed="true">Aa 隐藏标签</button><button class="control-button" data-action="highlight" aria-pressed="true">✦ 关闭高亮</button><button class="control-button" data-action="fullscreen">⛶ 全屏</button></div></footer></section></section></main>`;
// Stable original nodes survive panel moves; no full-tree queries in animation.
const singles=new WeakMap(),multiples=new WeakMap(),controlValues=new WeakMap();
function cached(scope,selector,many){const store=many?multiples:singles;let cache=store.get(scope);if(!cache){cache=new Map();store.set(scope,cache);}if(!cache.has(selector))cache.set(selector,many?[...scope.querySelectorAll(selector)]:scope.querySelector(selector));return cache.get(selector);}
const $=(s,scope=root)=>cached(scope,s,false),$$=(s,scope=root)=>cached(scope,s,true);
function text(node,value){const next=String(value);if(node.textContent!==next)node.textContent=next;}
function control(button,kind,value){const key=kind+':'+value;if(controlValues.get(button)!==key){controlValues.set(button,key);globalThis.AnderModelShell.setControl(button,kind,value);}}

const refs={area:$('.model-area'),board:$('.scene-board'),drawing:$('.drawing-scroll'),play:$('[data-action=play]'),range:$('input[type=range]'),bg:$$('[data-bg]'),tails:$$('[data-lipid-tail]'),charges:$$('[data-charge]'),bands:$$('[data-band]'),sites:$$('[data-site]'),flow:$$('[data-channel]').map(node=>({node,kind:node.dataset.channel,index:Number(node.dataset.location),x:Number(node.dataset.axis),membrane:membranes.find(m=>m.id===node.dataset.membrane),arrow:$('[data-flow-arrow]',node),tokens:[...node.querySelectorAll('[data-token]')]})),currents:$$('[data-current-slot]').map(node=>({node,side:node.dataset.side,lane:node.dataset.lane,path:$('[data-current-path]',node),glow:$('[data-current-glow]',node),tip:$('[data-current-tip]',node)}))};

function tracePath(trace,index,end=P.duration){const pts=[],stride=2;for(let k=0;k<trace.count&&k*trace.p.sampleDt<end;k+=stride){const q=sample(trace,k*trace.p.sampleDt,sites[index]);pts.push([q.t,q.v]);}const q=sample(trace,end,sites[index]);pts.push([end,q.v]);return pts.map(([t,v],i)=>`${i?'L':'M'}${px(t).toFixed(2)} ${py(v).toFixed(2)}`).join(' ');}
function buildFlux(trace){const flux=sites.map(()=>({na:new Float32Array(trace.count),k:new Float32Array(trace.count)}));for(let i=0;i<sites.length;i++)for(let t=1;t<trace.count;t++){const q=sample(trace,t*trace.p.sampleDt,sites[i]);flux[i].na[t]=flux[i].na[t-1]+Math.abs(q.ina)*trace.p.sampleDt;flux[i].k[t]=flux[i].k[t-1]+Math.abs(q.ik)*trace.p.sampleDt;}return flux;}
const fluxes={};
function fluxAt(index,kind,t){const a=fluxes[state.stimulus][index][kind],f=clamp(t/P.sampleDt,0,a.length-1),n=Math.floor(f);return a[n]+(a[Math.min(a.length-1,n+1)]-a[n])*(f-n);}
function setPosition(node,x,y,opacity=1,scale=1){node.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(3)})`);node.setAttribute('opacity',clamp(opacity).toFixed(3));}
function drawFlows(qs,ms){for(const f of refs.flow){const q=qs[f.index],na=f.kind==='nav',clearance=na?q.navAxisClearance:q.kvClearance,p=na?q.pNa:q.pK;
 const visible=smooth(na?.001:.012,na?.026:.075,p)*smooth(.015,.18,clearance),current=na?q.ina:q.ik;
 const inward=current<0,direction=(inward?1:-1)*f.membrane.normal,start=f.membrane.y-direction*34,end=f.membrane.y+direction*34;
 const phase=fluxAt(f.index,na?'na':'k',ms)*.010;
 f.arrow.setAttribute('d',`M${f.x} ${start} V${end}`);f.arrow.setAttribute('opacity',(.86*visible).toFixed(3));
 const scale=Math.min(1,clearance*proteinScale*.41/3);
 f.tokens.forEach((node,i)=>{const t=(phase+i/f.tokens.length)%1,fade=smooth(0,.09,t)*(1-smooth(.91,1,t));setPosition(node,f.x,start+(end-start)*t,visible*fade,scale);});
 f.node.dataset.voltage=q.v.toFixed(3);f.node.dataset.activation=q.activation.toFixed(4);f.node.dataset.inactivation=q.inactivation.toFixed(4);f.node.dataset.potassium=q.potassium.toFixed(4);f.node.dataset.flow=inward?'inward':'outward';f.node.dataset.clearance=clearance.toFixed(4);
 }}
function drawCurrents(ms){
 const focus=currentFocus(ms,conductionPlan,state.stimulus);
 refs.area.dataset.currentSequence=focus?String(focus.index):'none';refs.area.dataset.currentVisibleCount=focus?'4':'0';
 for(const c of refs.currents){
  const shown=!!focus;c.node.dataset.active=String(shown);c.node.setAttribute('visibility',shown?'visible':'hidden');c.node.setAttribute('opacity',shown?'1':'0');
  if(!focus){c.node.dataset.source='';c.node.dataset.target='';continue;}
  const pair=focus.pairs.find(p=>p.side===c.side),outward=pair.side==='right'?1:-1,outside=pair.target<0||pair.target>=centres.length,shift=diagramLayout.chargeOffsets.at(-1);
  const source=centres[pair.source]+outward*shift,target=outside?diagramLayout.edgeCentres[pair.side]:centres[pair.target]-outward*shift;
  const from=c.lane==='inner'?source:target,to=c.lane==='inner'?target:source,arc=currentArc(from,to,c.lane),window=currentWindow(state.seconds,focus,landmarks),part=partialCurrentArc(arc,window.tail,window.head);
  c.path.setAttribute('d',part.d);c.glow.setAttribute('d',part.d);c.path.setAttribute('stroke-dashoffset',(-state.seconds*motion.dashUnitsPerSecond).toFixed(2));
  c.tip.setAttribute('transform',`translate(${part.tip.x} ${part.tip.y}) rotate(${part.tip.angle})`);
  c.node.dataset.source=siteNames[pair.source];c.node.dataset.target=outside?'outside-view':siteNames[pair.target];c.node.dataset.direction=to>from?'right':'left';c.node.dataset.sequence=focus.index;
  c.node.dataset.fromPolarity='+';c.node.dataset.toPolarity='−';c.node.dataset.headProgress=window.head.toFixed(5);c.node.dataset.tailProgress=window.tail.toFixed(5);
 }
}
function drawSpatial(trace,ms,q){
 const points=spatialProfile(trace,ms,conductionPlan),path=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(3)}`).join(' ');
 const fill=path+` L${spatialPlot.right} ${spatialPlot.baseline} H${spatialPlot.left} Z`;
 $('[data-spatial-trace]').setAttribute('d',path);$('[data-spatial-fill]').setAttribute('d',fill);$('[data-spatial-recovery]').setAttribute('d',fill);
 $('[data-spatial-dot]').setAttribute('cx',centres[state.selected]);$('[data-spatial-dot]').setAttribute('cy',spatialPlot.baseline-(q.v-trace.rest)*spatialPlot.gain);
 $('[data-spatial-plot]').dataset.ms=ms.toFixed(4);
}
function drawCircuit(lesson,q){const active=lesson.stim,pulse=(state.seconds*2.8)%1;
 $$('[data-stim-wave],[data-mini-stim]').forEach(e=>e.setAttribute('opacity',active?1:0));$('[data-stim-led]').setAttribute('fill',active?'#e39a30':'#c4d4cf');$('[data-stim-wire]').setAttribute('stroke-dashoffset',(-state.seconds*48).toFixed(2));
 $('[data-stim-ring]').setAttribute('rx',16+pulse*24);$('[data-stim-ring]').setAttribute('ry',8+pulse*14);$('[data-stim-ring]').setAttribute('opacity',1-pulse);$('[data-mini-ring]').setAttribute('rx',15+pulse*18);$('[data-mini-ring]').setAttribute('opacity',1-pulse);
 const x=centres[state.selected];$('[data-record-wire-inner]').setAttribute('d',`M947 91 H926 V139 H${x-5} V240`);$('[data-record-wire-outer]').setAttribute('d',`M1005 91 H1020 V130 H${x+5} V221`);
 $('[data-probe-inner]').setAttribute('transform',`translate(${x-5} 0)`);$('[data-probe-outer]').setAttribute('transform',`translate(${x+5} 0)`);text($('[data-record-label]'),`${siteNames[state.selected]}：膜内 − 膜外`);
 $('[data-meter-needle]').setAttribute('transform',`rotate(${-55+clamp((q.v+90)/140)*110} 976 89)`);
}
function render(){if(!traces)return;const trace=traces[state.stimulus],lesson=lessonState(state.seconds,trace,landmarks),ms=lesson.ms,reversed=pairedPolarity(ms,conductionPlan,state.stimulus),qs=sites.map((x,i)=>{const q=sample(trace,ms,x);if(Math.abs(q.v)<1e-9)q.v=reversed.includes(i)?1e-12:-1e-12;return {...q,...channelState(q)};}),q=qs[state.selected],weak=state.stimulus==='weak';
 refs.area.dataset.playing=String(state.playing);refs.area.dataset.ms=ms.toFixed(4);refs.area.dataset.stage=lesson.stage;refs.area.dataset.voltage=q.v.toFixed(4);refs.area.dataset.probe=siteNames[state.selected];refs.area.dataset.stimulus=state.stimulus;refs.area.dataset.stimActive=String(lesson.stim);refs.area.dataset.ready=String(state.ready);refs.area.classList.toggle('hide-labels',!state.labels);
 $$('button[data-stage]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===lesson.stage));b.classList.toggle('is-active',i===lesson.stage);});text($('[data-stage-title]'),weak&&lesson.stage>0?'阈下响应 · 无动作电位传导':NAMES[lesson.stage]);text($('[data-stage-en]'),weak&&lesson.stage>0?'Subthreshold Local Response':EN[lesson.stage]);text($('[data-stage-kicker]'),`STAGE 0${lesson.stage+1} / 05`);
 text($('[data-summary]'),weak&&lesson.stage>0?'局部弱去极化未触发再生性动作电位，随距离和时间衰减。浅色虚线为同一位置的阈上刺激参考。':DESCRIPTIONS[lesson.stage]);text($('[data-ms-label]'),`${ms.toFixed(2)} ms`);text($('[data-voltage-reading]'),(Math.abs(q.v)<.05?0:q.v).toFixed(1).replace('-','−'));
 text($('[data-conduction-focus]'),weak&&lesson.stage>0?'局部响应消退':lesson.stage===0?'各处保持静息':lesson.stage===1?'中央 Na⁺ 内流':lesson.stage===2?'局部电流推动邻区':lesson.stage===3?'前方兴奋 · 后方复极':'两侧依次传导并恢复');
 const key=`${state.stimulus}:${state.selected}`;if(key!==plotKey){$('[data-reference]').setAttribute('d',tracePath(traces.standard,state.selected));plotKey=key;}$('[data-trace]').setAttribute('d',tracePath(trace,state.selected,ms));$('[data-cursor]').setAttribute('d',`M${px(ms)} ${plot.top} V${plot.bottom}`);$('[data-plot-dot]').setAttribute('cx',px(ms));$('[data-plot-dot]').setAttribute('cy',py(q.v));text($('[data-reference-label]'),weak?'阈上刺激参考':'完整过程');
 text($('[data-na-state]'),q.na);text($('[data-k-state]'),q.k);$('[data-na-bar]').style.width=`${q.pNa*100}%`;$('[data-k-bar]').style.width=`${q.pK*100}%`;text($('[data-na-fraction]'),`相对最大电导 ${(q.pNa*100).toFixed(1)}%`);text($('[data-k-fraction]'),`相对最大电导 ${(q.pK*100).toFixed(1)}%`);
 for(const label of $$('[data-record-site],[data-detail-site]'))text(label,siteNames[state.selected]);text($('[data-site-detail]'),`${q.label} · ${q.v>0?'内正外负':'内负外正'}。${q.h<.34?'Na⁺ 失活比例较高，需要恢复后才能再次兴奋。':'电位由本地离子电流与相邻膜段电流共同决定。'}`);
 $$('button[data-probe]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.probe)===state.selected)));
 refs.area.dataset.reversedSites=reversed.map(i=>siteNames[i]).join(',');refs.area.dataset.dipolesPerSegment='2';refs.area.dataset.dipolesPerMembrane='28';
 const edgeStates={[-1]:sample(trace,ms,-conductionPlan.representatives.at(-1)),[centres.length]:sample(trace,ms,conductionPlan.representatives.at(-1))};
 const local=i=>qs[i]||edgeStates[i];
 for(const node of refs.charges){
  const i=Number(node.dataset.location),inside=polarityBlend(state.seconds,i,conductionPlan,landmarks,state.stimulus),mix=node.dataset.side==='inside'?inside:1-inside;
  $('[data-positive]',node).setAttribute('opacity',mix.toFixed(4));$('[data-negative]',node).setAttribute('opacity',(1-mix).toFixed(4));
  node.dataset.positiveMix=mix.toFixed(5);node.dataset.reversed=String(local(i).v>0);node.dataset.voltage=local(i).v.toFixed(5);
 }
 const positive=[246,197,164],negative=[190,213,241];for(const node of refs.bands){const v=local(Number(node.dataset.location)).v,u=smooth(-8,8,node.dataset.side==='inside'?v:-v);node.setAttribute('fill',`rgb(${positive.map((p,i)=>Math.round(negative[i]+(p-negative[i])*u)).join(',')})`);node.setAttribute('opacity',(.3+.7*clamp(Math.abs(v)/65)).toFixed(3));}
 refs.sites.forEach((node,i)=>{node.dataset.voltage=qs[i].v.toFixed(3);node.dataset.m=qs[i].m.toFixed(4);node.dataset.h=qs[i].h.toFixed(4);node.dataset.n=qs[i].n.toFixed(4);$('[data-site-status]',node).textContent=qs[i].label==='复极 / 不应期'?'复极':qs[i].label;$('[data-selected-site]',node).setAttribute('opacity',i===state.selected?1:0);});
 drawFlows(qs,ms);drawCurrents(ms);drawCircuit(lesson,q);drawSpatial(trace,ms,q);proteins?.update(qs,state.highlight);
 refs.bg.forEach(n=>n.setAttribute('transform',activeTransport2dParticleTransform(n,state.seconds,.16)));
 if(Math.abs(state.seconds-lastLipid)>.12||!state.playing){membraneLayer?.update(state.seconds);lastLipid=state.seconds;}
 refs.range.value=Math.round(state.seconds*100);text($('[data-progress]'),`${Math.round(state.seconds/lessonDuration*100)}%`);control(refs.play,"play",state.playing?'Ⅱ 暂停':state.seconds>=lessonDuration?'↻ 再播放':'▶ 播放');control($('[data-action=speed]'),"speed",`× ${state.speed} 倍速`);
 for(const k of ['labels','highlight'])$(`[data-action=${k}]`).setAttribute('aria-pressed',String(state[k]));control($('[data-action=labels]'),"labels",state.labels?'Aa 隐藏标签':'Aa 显示标签');control($('[data-action=highlight]'),"highlight",state.highlight?'✦ 关闭高亮':'✦ 开启高亮');$$('button[data-stimulus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stimulus===state.stimulus)));
 globalThis.NeuralSample?.sync();
 if(lastStage!==lesson.stage){lastStage=lesson.stage;emit('model:stage-changed',{stageIndex:lesson.stage,stageId:ANDER_MODEL_MANIFEST.stages[lesson.stage].id});}
 if(Math.floor(state.seconds)!==lastProtocolSecond){lastProtocolSecond=Math.floor(state.seconds);emit('model:progress',{progress:state.seconds/lessonDuration,stageIndex:lesson.stage,physiologicalTimeMs:ms});}
}
function seek(seconds){state.seconds=clamp(seconds,0,lessonDuration);state.playing=false;state.last=0;render();report();}
function setStage(i){if(landmarks)seek(landmarks.jumps[clamp(i,0,4)]);}
function start(){if(!state.ready)return;if(state.seconds>=lessonDuration)state.seconds=0;state.playing=true;state.last=0;}
function chooseSite(i){state.selected=clamp(i,0,centres.length-1);render();report();}
let hostOrigin='*';try{if(document.referrer)hostOrigin=new URL(document.referrer).origin;}catch{}
function emit(type,payload={},requestId){if(window.parent===window)return;window.parent.postMessage({source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload,requestId},hostOrigin);}
function report(requestId){if(!traces)return;const lesson=lessonState(state.seconds,traces[state.stimulus],landmarks);emit('model:state',{stageIndex:lesson.stage,stageId:ANDER_MODEL_MANIFEST.stages[lesson.stage].id,playing:state.playing,speed:state.speed,labels:state.labels,highlight:state.highlight,progress:state.seconds/lessonDuration,stimulus:state.stimulus,recordingSite:siteNames[state.selected]},requestId);}
async function action(name){
 if(name==='reset')globalThis.NeuralSample?.resetView();
 if(name==='play'){if(state.playing)state.playing=false;else start();}
 else if(name==='reset'){state.speed=1;state.labels=true;state.highlight=true;state.stimulus='standard';state.selected=middle+1;seek(0);}
 else if(name==='prev'||name==='next'){if(traces)setStage(lessonState(state.seconds,traces[state.stimulus],landmarks).stage+(name==='next'?1:-1));}
 else if(name==='speed'){const a=[.5,1,1.5,2];state.speed=a[(a.indexOf(state.speed)+1)%4];}
 else if(name==='labels')state.labels=!state.labels;
 else if(name==='highlight')state.highlight=!state.highlight;
 else if(name==='stimulate'&&state.ready){state.seconds=landmarks.jumps[1];start();}
 else if(name==='fullscreen')return; // Shared shell owns fullscreen and immersion.
 else if(name==='back'){const p=new URLSearchParams(location.search),v=p.get('return')||p.get('returnTo')||document.referrer;if(v){try{const u=new URL(v,location.href);if(['http:','https:'].includes(u.protocol))location.assign(u.href);}catch{}}else if(history.length>1)history.back();}
 render();report();
}
root.addEventListener('click',e=>{const b=e.target.closest('button,[data-choose-site]');if(!b)return;if(b.dataset.stage!==undefined)setStage(Number(b.dataset.stage));else if(b.dataset.probe!==undefined)chooseSite(Number(b.dataset.probe));else if(b.dataset.chooseSite!==undefined)chooseSite(Number(b.dataset.chooseSite));else if(b.dataset.stimulus){state.stimulus=b.dataset.stimulus;seek(0);}else if(b.dataset.action)action(b.dataset.action);});
root.addEventListener('keydown',e=>{if(e.target.matches('[data-choose-site]')&&['Enter',' '].includes(e.key)){e.preventDefault();chooseSite(Number(e.target.dataset.chooseSite));}});
refs.range.addEventListener('input',()=>seek(Number(refs.range.value)/100));
document.addEventListener('visibilitychange',()=>{state.last=0;});
window.addEventListener('message',e=>{const m=e.data;if(e.source!==window.parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id||(hostOrigin!=='*'&&e.origin!==hostOrigin))return;const p=m.payload||{};
 if(m.type==='host:init')emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:state.ready},m.requestId);
 else if(m.type==='host:play')start();else if(m.type==='host:pause')state.playing=false;else if(m.type==='host:reset')action('reset');
 else if(m.type==='host:set-stage'){const i=ANDER_MODEL_MANIFEST.stages.findIndex(s=>s.id===p.stageId);if(i>=0)setStage(i);}
 else if(m.type==='host:set-speed'&&[.5,1,1.5,2].includes(Number(p.speed)))state.speed=Number(p.speed);
 else if(m.type==='host:set-labels')state.labels=p.visible!==false;else if(m.type==='host:set-highlight')state.highlight=!!p.enabled;
 render();report(m.requestId);
});
// Responsive chart projection retains the original voltage and time domains.
let plotLayoutKey='';
function resizePlot(){
 const svg=$('.record-plot'),w=Math.round(svg.clientWidth),h=Math.round(svg.clientHeight);
 if(w<80||h<55||plotLayoutKey===w+':'+h)return;plotLayoutKey=w+':'+h;
 Object.assign(plot,{left:34,right:w-12,top:23,bottom:h-32,width:w,height:h});svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const attrs=(n,a)=>{if(n)for(const[k,v]of Object.entries(a))n.setAttribute(k,v);};
 attrs(svg.querySelector('[data-y-title]'),{x:2,y:13});attrs(svg.querySelector('[data-x-title]'),{x:plot.right,y:h-2});
 for(const n of svg.querySelectorAll('[data-plot-grid]'))attrs(n,{d:`M${plot.left} ${py(Number(n.dataset.plotGrid))} H${plot.right}`});
 for(const n of svg.querySelectorAll('[data-plot-y]'))attrs(n,{x:plot.left-6,y:py(Number(n.dataset.plotY))+3});
 for(const n of svg.querySelectorAll('[data-plot-x]'))attrs(n,{x:px(Number(n.dataset.plotX)),y:plot.bottom+15});
 attrs(svg.querySelector('[data-plot-axis]'),{d:`M${plot.left} ${plot.top} V${plot.bottom} H${plot.right}`});
 attrs(svg.querySelector('[data-threshold-line]'),{d:`M${plot.left} ${py(-55)} H${plot.right}`});
 attrs(svg.querySelector('[data-threshold-label]'),{x:plot.right-1,y:py(-55)-5});
 attrs(svg.querySelector('#plot-clip rect'),{x:plot.left,y:plot.top,width:plot.right-plot.left,height:plot.bottom-plot.top});plotKey='';
 render();
}
new ResizeObserver(resizePlot).observe($('.record-plot'));
let proteinCanvasSized=false;
function resize(){globalThis.NeuralSample?.resize();if(proteins&&!proteinCanvasSized){proteins.resize(W,H);proteinCanvasSized=true;}}
new ResizeObserver(resize).observe(refs.drawing);
function animate(){const now=performance.now()*.001;if(state.playing&&state.ready){if(state.last)state.seconds=Math.min(lessonDuration,state.seconds+Math.min(.12,now-state.last)*state.speed);if(state.seconds>=lessonDuration)state.playing=false;if(now-lastDraw>1/30||!state.playing){render();lastDraw=now;if(!state.playing)report();}}state.last=now;requestAnimationFrame(animate);}
let animationStarted=false;
async function init(){neuralLayout.loading();try{
  // Allow the shell to paint before deterministic precomputation.
  await new Promise(resolve=>requestAnimationFrame(resolve));
  [traces]=await Promise.all([loadTeachingTraces(),ensureMembraneLayer()]);conductionPlan=buildConductionPlan(traces.standard);sites=conductionPlan.sites;landmarks=timeline(traces.standard,conductionPlan);for(const kind of ['standard','weak'])fluxes[kind]=buildFlux(traces[kind]);
  if(!proteins)proteins=await createProteins($('.protein-canvas'),{width:W,height:H,membranes,centres,offset,proteinScale,onContextLost:()=>{state.playing=false;state.ready=false;neuralLayout.failed('图形显示已中断。重新加载会保留当前观察状态。',recoverProteins);render();}});
  await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(Error('神经元素材加载失败'));img.src='assets/neuron.png';});
  state.ready=true;neuralLayout.ready();refs.play.disabled=false;$('[data-action=stimulate]').disabled=false;text($('[data-load]'),'');refs.area.dataset.geometryParts=proteins.geometryParts;refs.area.dataset.channelCount=proteins.units.length;resize();render();emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true});report();if(!animationStarted){animationStarted=true;requestAnimationFrame(animate);}
 }catch(error){state.ready=false;neuralLayout.failed('模型素材或图形加载失败。重新加载将保留当前进度。',init);emit('model:error',{message:error.message});}}
async function recoverProteins(){proteins?.renderer.dispose();proteins=null;proteinCanvasSized=false;await init();}
// Remove the compiled source SVG from live layout before the first shell measure.
// init awaits this same promise and exposes the normal retry UI on failure.
ensureMembraneLayer().catch(()=>{});
const neuralLayout=NeuralModelLayout.mount({manifest:ANDER_MODEL_MANIFEST,root,width:W,height:H,getState:()=>({...state}),onResize:resize});
init();
