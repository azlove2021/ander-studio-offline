const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"resting-action-potential","version":"2.7.1","publish":true,"title":{"zh":"静息电位与动作电位","en":"Resting and Action Potentials"},"summary":{"zh":"将钠钾泵、离子通道、离子流动与局部膜电位记录联动，比较阈下刺激与阈上刺激。","en":"Link ion pumps and channels to membrane voltage, comparing subthreshold and suprathreshold stimulation."},"module":{"id":"homeostasis","zh":"选择性必修一 · 神经调节","en":"Homeostasis and Neural Regulation"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"gradient","title":{"zh":"离子梯度","en":"Ion Gradients"}},{"id":"rest","title":{"zh":"静息电位","en":"Resting Potential"}},{"id":"depolarization","title":{"zh":"刺激与去极化","en":"Depolarization"}},{"id":"repolarization","title":{"zh":"复极化","en":"Repolarization"}},{"id":"recovery","title":{"zh":"恢复与维持","en":"Recovery"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","physiology.js","transport-primitives.js","protein-anchors.js","scene-navigation.js","neural-layout.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","neural-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
globalThis.AnderModelShell.register(ANDER_MODEL_MANIFEST);
'use strict';
const PP=PotentialPhysiology, A=POTENTIAL_PROTEIN_ANCHORS;
const traces={standard:PP.simulate('standard'),weak:PP.simulate('weak')};
const state={seconds:0,playing:false,speed:1,labels:true,highlight:true,selected:'pump',stimulus:'standard',ready:false,last:0};
const root=document.querySelector('[data-independent-model-root]');
const NAMES=['离子梯度','静息电位','刺激与去极化','复极化与超极化','恢复与持续维持'];
const STAGE_COLORS=[['#367f65','#e7f4ec'],['#267e89','#e8f5f6'],['#2f76b0','#eaf3fb'],['#82509f','#f3ecf8'],['#647f3b','#f0f5e7']];
const DESCRIPTIONS=[
 '钠钾泵每消耗 1 个 ATP，向外运输 3 个 Na⁺、向内运输 2 个 K⁺。本阶段先观察离子梯度，暂不展示膜电位。',
 '静息时以 K⁺ 通透性为主。K⁺ 外扩散受电场反向作用制约；各项电流相互平衡，膜电位稳定，离子仍在运动。',
 '阈上刺激使电压门控 Na⁺ 通道快速激活，Na⁺ 内流引起去极化并出现电位反转。K⁺ 电压门控通道延迟响应，漏通道仍然工作。',
 'Na⁺ 通道逐渐失活，K⁺ 外流增强，膜发生复极化。随后 K⁺ 电压门控通道缓慢关闭，出现短暂超极化。',
 '电压门控通道逐渐复位，膜电位回到静息水平。钠钾泵持续维护离子梯度；快速复极化主要由通道电流完成。'
];
const STRUCTURES={
 pump:{x:150,w:260,title:'钠钾泵',en:'Na⁺/K⁺-ATPase',detail:'交替向胞内、胞外暴露结合位点；每轮 3 Na⁺ 出、2 K⁺ 入，消耗 1 ATP。',color:'#3d9786'},
 leak:{x:360,w:240,title:'钾漏通道',en:'K⁺ leak',detail:'本模型条件下持续提供背景 K⁺ 通透性。净流向由电化学驱动力决定，静息时仍有背景离子电流。',color:'#8776a8'},
 nav:{x:570,w:240,title:'电压门控钠通道',en:'Voltage-gated Na⁺',detail:'去极化时迅速激活，随后失活。失活后需要复极化才能恢复可激活状态；图示代表通道群的主导状态。',color:'#438bbe'},
 kv:{x:780,w:240,title:'电压门控钾通道',en:'Voltage-gated K⁺',detail:'去极化时延迟开放，K⁺ 外流参与复极化；延迟关闭产生短暂超极化。图示代表通道群的主导状态。',color:'#9673b7'}
};
function ion(kind,extra='',radius=11){const color=kind==='Na⁺'?'#4d91c6':kind==='K⁺'?'#936eb5':'#95a6aa';return `<g class="ion ${extra}"><circle r="${radius}" fill="${color}"/><text y="${radius<10?3:4}">${kind}</text></g>`;}
function particleMarkup(){return Array.from({length:28},(_,i)=>{const outside=i<14,j=i%14;const kind=outside?(j%5===4?'K⁺':j%5===3?'Cl⁻':'Na⁺'):(j%5===4?'Na⁺':j%5===3?'A⁻':'K⁺');const x=44+(j%7)*137,y=outside?178+Math.floor(j/7)*34:405+Math.floor(j/7)*109;if((!outside&&x<270)||(outside&&x>815&&y<200)||(outside&&x>420&&x<510&&y>200))return '';return `<g data-bg data-base-x="${x}" data-base-y="${y}" data-lane-y="${y}" data-phase="${i*.91}" data-phase-b="${i*.41+.2}" data-speed=".1" data-range-x="15" data-range-y="6" data-min-x="20" data-max-x="975" data-min-y="${y-10}" data-max-y="${y+10}" data-side="${outside?'outside':'inside'}">${ion(kind,'background-ion')}</g>`;}).join('');}
function proteinMarkup(){return Object.entries(STRUCTURES).map(([id,o])=>{
 const layers=id==='nav'?['nav-body','nav-activation','nav-inactivation']:[id];
 return `<g class="protein ${id==='leak'?'selected':''}" data-protein="${id}" style="--protein-color:${o.color}" tabindex="0" role="button" aria-label="观察${o.title}"><g class="protein-art">
 ${layers.map(layer=>`<g data-protein-layer="${layer}"><image data-frame-a x="${o.x-o.w/2}" y="${302-o.w/2}" width="${o.w}" height="${o.w}" href="assets/proteins/${layer}-00.webp"/><image data-frame-b x="${o.x-o.w/2}" y="${302-o.w/2}" width="${o.w}" height="${o.w}" opacity="0"/></g>`).join('')}
 </g><text class="label optional-label" x="${o.x}" y="452" text-anchor="middle">${o.title}</text><text class="protein-sub optional-label" x="${o.x}" y="475" text-anchor="middle">${o.en}</text><text class="protein-state" data-protein-state="${id}" x="${o.x}" y="494" text-anchor="middle"></text></g>`;
 }).join('');}
function sceneMarkup(){return `<svg class="scene-svg" viewBox="0 0 1000 615" role="img" aria-label="神经元定位、轴突膜放大、钠钾泵、通道与电极">
 <defs><linearGradient id="outside" x2="0" y2="1"><stop stop-color="#f4fbfd"/><stop offset="1" stop-color="#eaf6fc"/></linearGradient><linearGradient id="inside" x2="0" y2="1"><stop stop-color="#fff9e5"/><stop offset="1" stop-color="#fffdf4"/></linearGradient><radialGradient id="lipidHead2d" cx="35%" cy="28%" r="75%"><stop stop-color="#e1f5ff"/><stop offset="1" stop-color="#8dccea"/></radialGradient><linearGradient id="lipidTail2d"><stop stop-color="#a0d9f0"/><stop offset="1" stop-color="#d1e9f4"/></linearGradient><radialGradient id="phosphate2d"><stop stop-color="#d6f4ff"/><stop offset="1" stop-color="#5db7d3"/></radialGradient><marker id="arrow-na" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#4084b9"/></marker><marker id="arrow-k" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#8a6aad"/></marker><mask id="membrane-mask"><rect x="0" y="235" width="1000" height="135" fill="white"/>${Object.values(STRUCTURES).map(o=>`<rect x="${o.x-37}" y="240" width="74" height="120" fill="black"/>`).join('')}</mask></defs>
<defs><filter id="charge-band-soft" filterUnits="userSpaceOnUse" x="-12" y="187" width="1024" height="232" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter></defs>
<g class="zoom-backdrop" aria-label="轴突观察位置">
 <rect class="zoom-region zoom-region-inset" x="226.08" y="63.8" width="35.36" height="17" rx="3"/>
</g>
<g class="neuron-inset" transform="translate(18 6) scale(.68)" aria-label="多极神经元与轴突观察位置">
 <image href="assets/neuron-v2.png" x="14" y="5" width="500" height="167" preserveAspectRatio="xMidYMid meet"/>
 <path d="M323 39 H312 V84 M341 39 H350 V84" class="circuit-wire"/>
 <circle cx="332" cy="28" r="15" class="circuit-unit"/><text x="332" y="33" text-anchor="middle" font-size="15" font-weight="600">S</text>
 <path d="M312 76 V89 M350 76 V89" class="probe-contact"/>
 <g data-mini-stim opacity="0"><ellipse data-mini-ring cx="331" cy="95" rx="20" ry="9" fill="none" stroke="#e6a039" stroke-width="2"/><path d="M317 66 h8 l3-9 4 17 4-8 h9" class="stim-pulse"/></g>
 <text x="20" y="187" class="label optional-label">神经元</text><text x="95" y="187" class="small optional-label">树突 · 胞体 · 轴突 · 神经末梢</text>
 </g>
 <g class="membrane-cutaway" transform="translate(0 75)">
 <rect x="7" y="130" width="986" height="173" rx="12" fill="url(#outside)" opacity=".52"/><rect x="7" y="302" width="986" height="229" rx="12" fill="url(#inside)" opacity=".52"/>

 <g data-polarity-bands><g class="charge-band-pulse" filter="url(#charge-band-soft)"><rect data-outside-band x="12" y="211" width="976" height="34" rx="10"/><rect data-inside-band x="12" y="359" width="976" height="36" rx="10"/></g></g>
 <g class="optional-label"><text x="20" y="151" class="label">细胞外</text><text x="100" y="151" class="small">Na⁺ 浓度高</text><text x="20" y="526" class="label">轴突内</text><text x="105" y="526" class="small">K⁺ 浓度高</text></g>
 <g data-background>${particleMarkup()}</g>
 <g mask="url(#membrane-mask)"><rect x="0" y="256" width="1000" height="92" fill="#dfeef4" opacity=".55"/><g transform="translate(12 90) scale(.76)">${transportIntegratedLipids()}</g></g>
 ${proteinMarkup()}
 <g data-pump-ions data-focus-activity="pump">${Array.from({length:3},(_,i)=>`<g data-pump-na="${i}">${ion('Na⁺')}</g>`).join('')}${Array.from({length:2},(_,i)=>`<g data-pump-k="${i}">${ion('K⁺')}</g>`).join('')}</g>
 <g data-focus-activity="nav"><path data-na-arrow class="flow-arrow" d="M570 218 V400" stroke="#2f79b0" marker-end="url(#arrow-na)"/></g><g data-focus-activity="kv"><path data-k-arrow class="flow-arrow" d="M780 399 V220" stroke="#8153a3" marker-end="url(#arrow-k)"/></g><g data-focus-activity="leak"><path data-leak-arrow class="flow-arrow" d="M360 397 V220" stroke="#8153a3" marker-end="url(#arrow-k)"/></g>
 <g data-flow-layer>${['leak','nav','kv'].map(id=>`<g data-flow="${id}" data-focus-activity="${id}">${Array.from({length:id==='nav'?12:3},(_,i)=>`<g data-token="${i}">${ion(id==='nav'?'Na⁺':'K⁺',id==='nav'?'influx-ion':'',id==='nav'?8.5:11)}</g>`).join('')}</g>`).join('')}</g>
 <g data-focus-activity="pump"><g data-atp>${activeTransport2dNucleotide('ATP',3)}</g><g data-free-phosphate></g></g>
 <g class="optional-label"><text x="148" y="510" text-anchor="middle" class="small">3 Na⁺ 出 / 2 K⁺ 入 / 1 ATP</text></g>
 <g data-charges>${[24,53,82,219,248,277,306,415,444,473,502,625,654,683,712,849,878,907,936,974].map(x=>`<text class="charge" data-charge-out x="${x}" y="239">+</text><text class="charge inner" data-charge-in x="${x}" y="384">−</text>`).join('')}</g>
 <g class="stimulator-circuit" transform="translate(-240.5 -24)" aria-label="位于钾漏通道与钠通道等距中点的刺激电路">
 <rect x="617.5" y="8" width="176" height="72" rx="7" class="instrument-box"/><text x="633" y="31" font-size="15" font-weight="600">S</text><text x="669" y="30" font-size="14">脉冲刺激器</text>
 <rect x="640" y="41" width="92" height="22" rx="3" fill="#edf4f3" stroke="#c6d7d4"/><path d="M648 55 H665 V46 H680 V55 H723" fill="none" stroke="#648d82" stroke-width="1.6"/>
 <circle data-stim-led cx="765" cy="52" r="5" fill="#c4d4cf"/>
 <path d="M660 80 V108 H688 V204 M745 80 V128 H723 V204" class="circuit-wire"/>
 <circle cx="660" cy="80" r="3" class="circuit-terminal"/><circle cx="745" cy="80" r="3" class="circuit-terminal"/>
 <text x="649" y="97" font-size="13">−</text><text x="754" y="97" font-size="13">+</text>
 <rect x="683" y="194" width="10" height="22" rx="3" class="probe-body"/><rect x="718" y="194" width="10" height="22" rx="3" class="probe-body"/>
 <path d="M688 214 V227 M723 214 V227" class="probe-contact"/>
 <text x="705" y="165" class="small optional-label" text-anchor="middle">刺激电极</text>
 <g data-stim-wave opacity="0"><path data-stim-wire d="M660 80 V108 H688 V226 M745 80 V128 H723 V226" fill="none" stroke="#db942d" stroke-width="3" stroke-dasharray="7 9"/><ellipse data-stim-ring cx="705.5" cy="227" rx="20" ry="10" fill="none" stroke="#e59b30" stroke-width="2.5"/><text x="762" y="180" fill="#ad681c" font-size="15" font-weight="600">刺激中</text></g>
 </g>
 <g class="recording-circuit" aria-label="跨膜差分电压测量电路"><g class="voltmeter-head" transform="translate(136.8 7.2) scale(.85)">
 <circle cx="912" cy="48" r="31" class="circuit-unit"/><path d="M892 46 A21 21 0 0 1 932 46" fill="none" stroke="#bbc9cd" stroke-width="2"/><path d="M912 46 V25" data-meter-needle stroke="#cf4b54" stroke-width="2.4" stroke-linecap="round"/><circle cx="912" cy="46" r="3" fill="#657c84"/><text x="912" y="67" text-anchor="middle" font-size="19" font-weight="600">V</text>
 </g><path d="M885.65 48 H870 V133 H898 V187 M938.35 48 H974 V168 H953 V365" class="circuit-wire"/>
 <circle cx="885.65" cy="48" r="2.6" class="circuit-terminal"/><circle cx="938.35" cy="48" r="2.6" class="circuit-terminal"/>
 <text x="870" y="32" font-size="14">−</text><text x="950" y="32" font-size="14">+</text>
 <rect x="893" y="180" width="10" height="23" rx="3" class="probe-body"/><path d="M898 202 V214" class="probe-contact"/>
 <path d="M948 188 H958 L957 370 953 392 949 370Z" class="recording-probe"/><path d="M953 188 V385" stroke="#627984" stroke-width="2"/><path d="M953 385 V399" class="probe-contact"/>
 <text x="882" y="181" class="small optional-label" text-anchor="end">膜外参比</text><text x="976" y="423" class="small optional-label" text-anchor="end">膜内记录</text>
 <text x="912" y="102" class="small optional-label" text-anchor="middle">V内 − V外</text>
 </g></g>
 </svg>`;}
const plot={left:45,right:376,top:26,bottom:253};
const px=t=>plot.left+t/30*(plot.right-plot.left),py=v=>plot.bottom-(v+90)/140*(plot.bottom-plot.top);
function plotMarkup(){return `<svg class="record-plot" viewBox="0 0 398 292" role="img" aria-label="膜电位曲线与示意阈电位">
 <text data-y-title x="7" y="15" fill="#697e82" font-size="11">膜电位 / mV</text>
 <rect data-stage-band y="26" height="227" fill="#e8f5f6" opacity=".7"/>
 ${[-80,-65,-40,0,40].map(v=>`<path data-plot-grid="${v}" d="M45 ${py(v)} H376" stroke="${v===0?'#bccbce':'#e9f0ed'}" stroke-width="${v===0?1.4:1}" stroke-dasharray="${v===-65?'4 4':'none'}"/><text data-plot-y="${v}" x="37" y="${py(v)+4}" text-anchor="end" font-size="11" fill="#6c8083">${v}</text>`).join('')}
 ${[0,5,10,15,20,25,30].map(t=>`<text data-plot-x="${t}" x="${px(t)}" y="271" text-anchor="middle" font-size="11" fill="#6c8083">${t}</text>`).join('')}
 <path data-plot-axis d="M45 23 V253 H379" fill="none" stroke="#c0d1cb"/>
 <rect data-stim-zone x="${px(3)}" y="28" width="${px(3.7)-px(3)}" height="225" fill="#f4dfae" opacity=".35"/>
 <text data-stim-label x="${px(3.35)}" y="19" text-anchor="middle" font-size="10" fill="#a47735">刺激</text>
 <path data-reference fill="none" stroke="#bfcfd2" stroke-width="2.5" stroke-dasharray="6 5" stroke-linejoin="round"/>
 <path data-threshold-line d="M45 ${py(PP.thresholdReferenceMv)} H376" fill="none" stroke="#bb852d" stroke-width="1.8" stroke-dasharray="7 4"/>
 <text data-threshold-label x="373" y="${py(PP.thresholdReferenceMv)-7}" text-anchor="end" class="threshold-label">阈电位 ≈ −55 mV（示意）</text>
 <path data-trace fill="none" stroke="#d84450" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
 <path data-cursor stroke="#789b8f" stroke-dasharray="3 4"/><circle data-plot-dot r="4.7" fill="#d84450" stroke="#fff" stroke-width="2"/>
 <text data-x-title x="376" y="289" text-anchor="end" font-size="11" fill="#6c8083">生理时间 / ms</text></svg>`;}

const STAGE_EN=['Ion Gradients','Resting Potential','Depolarization','Repolarization & AHP','Recovery & Maintenance'];
root.innerHTML=`<main class="independent-model-app">
 <header class="independent-model-header">
  <button class="independent-model-back" data-action="back" aria-label="返回主页"><span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span><span class="independent-model-back-label"><span>返回</span><span>主页</span></span></button>
  <div class="independent-model-heading"><span class="independent-model-kicker">选择性必修一 · 神经调节 / Neural Regulation</span><h1>静息电位与动作电位 <small>/ Resting & Action Potentials</small></h1></div>
 </header>
 <section class="independent-model-workspace"><section class="model-area" aria-label="电位模型工作区">
  <nav class="stage-strip" aria-label="教学阶段">${NAMES.map((n,i)=>`<button class="stage-tab" data-stage="${i}" style="--stage-color:${STAGE_COLORS[i][0]};--stage-soft:${STAGE_COLORS[i][1]}" aria-pressed="${i===1}">${globalThis.AnderModelShell.stageContent(i,n,STAGE_EN[i])}</button>`).join('')}</nav>
  <div class="model-stage">
   <section class="scene-panel" aria-label="膜电位动画工作区"><div class="scene-title"><span class="phase-step" data-focus-step>02</span><div class="phase-focus"><strong data-focus-title>K⁺ 漏出 · 维持静息</strong><span data-focus-caption>膜内负，膜外正</span></div></div><div class="drawing-scroll">${sceneMarkup()}</div>
    <div class="scene-legend"><span><i class="dot"></i>Na⁺</span><span><i class="dot k"></i>K⁺</span><span><i class="dot anion"></i>背景阴离子</span><span data-focus-legend>当前重点正常显示，其余蛋白半透明</span></div><div class="scene-note">半透明不表示停止工作；点击蛋白查看作用。门控和粒子为机制示意，离子库近似固定。</div>
   </section>
   <aside class="record-panel">
    <section class="stage-status"><div class="status-title"><p class="stage-status-kicker" data-stage-kicker>STAGE 02 / 05</p><span class="status-time" data-ms>0.00 ms</span></div><h2 data-stage-title>静息电位</h2><small data-stage-en>Resting Potential</small><p data-summary></p></section>
    <section class="voltage-card"><div class="record-head"><div><h2>膜电位记录</h2><small>V内 − V外</small></div><div class="reading"><strong data-voltage>−65.0</strong><span> mV</span></div></div>${plotMarkup()}<div class="plot-legend"><span><i></i><span data-reference-label>完整过程</span></span><span><i class="dark"></i>当前阶段</span></div><p class="threshold-note">阈电位为教学参考，实际阈值随细胞状态变化。</p></section>
    <div class="stimulus-controls" aria-label="刺激强度"><button data-stimulus="weak" aria-pressed="false">阈下刺激</button><button data-stimulus="standard" aria-pressed="true">阈上刺激</button><button class="apply-stim" data-action="stimulate">施加刺激</button></div>
    <div class="gate-states"><div class="gate-state">Na⁺ 电压门控通道<b data-na-state></b><div class="conductance"><i data-na-bar></i></div><small data-na-fraction></small></div><div class="gate-state kv">K⁺ 电压门控通道<b data-k-state></b><div class="conductance"><i data-k-bar></i></div><small data-k-fraction></small></div></div>
    <p class="sample-note">经典轴突参数：静息约 −65 mV。通道并非同时开闭；条形表示群体相对电导。</p>
    <div class="structure-panel-title"><strong>结构与作用</strong><span>点击查看</span></div><div class="structure-buttons">${Object.entries(STRUCTURES).map(([id,o])=>`<button class="structure-button" data-select="${id}" aria-pressed="${id==='leak'}" style="--structure-color:${o.color}"><i class="structure-button-dot"></i><span>${o.title}</span></button>`).join('')}</div>
    <div class="structure-detail"><strong data-structure-title>钾漏通道</strong><span data-structure-detail>${STRUCTURES.leak.detail}</span></div>
   </aside>
  </div>
  <footer class="control-dock">
   <div class="control-group control-group-primary"><button class="control-button is-primary" data-action="play" disabled>▶ 播放</button><button class="control-button" data-action="reset">↺ 重置</button><button class="control-button" data-action="prev" aria-label="上一阶段">‹ 上一步</button><button class="control-button" data-action="next" aria-label="下一阶段">› 下一步</button></div>
   <label class="timeline-wrap"><span>过程进度</span><input type="range" min="0" max="${PP.lessonDuration*100}" value="800" step="1" aria-label="演示进度"><output data-progress>21%</output><span data-load class="load-status">载入素材…</span></label>
   <div class="control-group control-group-view"><button class="control-button" data-action="speed">× 1 倍速</button><button class="control-button" data-action="labels" aria-pressed="true">Aa 隐藏标签</button><button class="control-button" data-action="highlight" aria-pressed="false">✦ 开启高亮</button><button class="control-button" data-action="fullscreen">⛶ 全屏</button></div>
  </footer>
 </section></section>
</main>`;

const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
const refs={svg:$('.scene-svg'),area:$('.model-area'),play:$('[data-action=play]'),timeline:$('input[type=range]'),stageTitle:$('[data-stage-title]'),summary:$('[data-summary]'),ms:$('[data-ms]'),voltage:$('[data-voltage]'),trace:$('[data-trace]'),reference:$('[data-reference]'),cursor:$('[data-cursor]'),dot:$('[data-plot-dot]'),na:$('[data-na-state]'),kv:$('[data-k-state]'),naBar:$('[data-na-bar]'),kBar:$('[data-k-bar]'),bg:$$('[data-bg]'),tails:$$('[data-lipid-tail]'),proteins:Object.fromEntries($$('[data-protein]').map(n=>[n.dataset.protein,{node:n}])),layers:Object.fromEntries($$('[data-protein-layer]').map(n=>[n.dataset.proteinLayer,{node:n,a:n.querySelector('[data-frame-a]'),b:n.querySelector('[data-frame-b]'),cache:''}])),pumpNa:$$('[data-pump-na]'),pumpK:$$('[data-pump-k]'),flow:Object.fromEntries(['leak','nav','kv'].map(id=>[id,$$(`[data-flow=${id}] [data-token]`)])),atp:$('[data-atp]'),atpBody:$('[data-nucleotide-body]'),atpLabel:$('[data-atp-label]'),adpLabel:$('[data-adp-label]'),pi:$('[data-terminal-phosphate]'),chargesOut:$$('[data-charge-out]'),chargesIn:$$('[data-charge-in]'),stageButtons:$$('[data-stage]')};
// Keep the terminal phosphate object through hydrolysis; it moves to protein and
// later leaves as Pi. The adenosine and other two phosphates stay in the body.
$('[data-free-phosphate]').append(refs.pi);
const terminalBond=refs.atpBody.querySelectorAll('.phosphate-bond');
const focusNodes=Object.fromEntries(Object.keys(STRUCTURES).map(id=>[id,[refs.proteins[id].node.querySelector('.protein-art'),...$$(`[data-focus-activity=${id}]`)]]));
function pathBetween(trace,start,end){const points=trace.samples.filter((q,i)=>i%5===0&&q.t>=start&&q.t<=end);points.unshift(PP.sample(trace,start));points.push(PP.sample(trace,end));return points.map((q,i)=>`${i?'L':'M'}${px(q.t).toFixed(2)},${py(q.v).toFixed(2)}`).join(' ');}
refs.reference.setAttribute('d',pathBetween(traces.standard,0,30));
function setImage(id,kind,index){const ref=refs.layers[id],count=A.frames[kind],a=Math.max(0,Math.min(count-1,Math.floor(index))),b=Math.min(count-1,a+1),u=PP.clamp(index-a);const key=`${kind}:${a}:${b}`;if(ref.cache!==key){ref.a.setAttribute('href',`assets/proteins/${kind}-${String(a).padStart(2,'0')}.webp`);ref.b.setAttribute('href',`assets/proteins/${kind}-${String(b).padStart(2,'0')}.webp`);ref.cache=key;}ref.a.setAttribute('opacity','1');ref.b.setAttribute('opacity',u.toFixed(3));}
function setPosition(node,x,y,opacity=1,scale=1){node.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale})`);node.setAttribute('opacity',PP.clamp(opacity).toFixed(3));}
const mix=(a,b,u)=>a+(b-a)*u;
function pumpAnchor(p){const k=p*24,i=Math.floor(k)%24,j=(i+1)%24,u=k-Math.floor(k);const a=A.pump[i],b=A.pump[j];return {sites:a.sites.map((pt,n)=>pt.map((v,d)=>mix(v,b.sites[n][d],u))),atp:a.atp};}
function updatePump(q){const p=q.pump,c=PP.pumpCycle(p),anchor=pumpAnchor(p),o=STRUCTURES.pump,scale=o.w/6,world=pt=>[o.x+pt[0]*scale,302-pt[1]*scale];
 // At the cycle seam use the first frame as the next frame, keeping the source
 // geometry/anchor interpolation identical and avoiding a late-frame snap.
 const index=p*24,frame=Math.floor(index),next=(frame+1)%24,u=index-frame,pr=refs.layers.pump,key=`pump:${frame}:${next}`;
 if(pr.cache!==key){pr.a.setAttribute('href',`assets/proteins/pump-${String(frame).padStart(2,'0')}.webp`);pr.b.setAttribute('href',`assets/proteins/pump-${String(next).padStart(2,'0')}.webp`);pr.cache=key;}pr.a.setAttribute('opacity','1');pr.b.setAttribute('opacity',u.toFixed(3));
 refs.pumpNa.forEach((node,i)=>{const site=world(anchor.sites[i]),start=[105+i*38,400],end=[95+i*49,185];let pt=site;const bind=PP.smooth(.015,.14,p),release=PP.smooth(.40,.49,p);pt=site.map((v,d)=>mix(start[d],v,bind));pt=pt.map((v,d)=>mix(v,end[d],release));setPosition(node,...pt,(1-PP.smooth(.47,.50,p))*.98,.80);});
 refs.pumpK.forEach((node,i)=>{const site=world(anchor.sites[i]),start=[115+i*70,181],end=[92+i*95,401],bind=PP.smooth(.51,.58,p),release=PP.smooth(.86,.98,p);let pt=site.map((v,d)=>mix(start[d],v,bind));pt=pt.map((v,d)=>mix(v,end[d],release));setPosition(node,...pt,PP.smooth(.49,.515,p)*(1-PP.smooth(.96,1,p)),.8);});
 const bind=PP.smooth(.12,.21,p),hydro=PP.smooth(.22,.30,p),depart=PP.smooth(.35,.52,p),site=world(anchor.atp),start=[95,426],bound=[site[0]-33,site[1]],end=[106,427],pos=start.map((v,i)=>mix(mix(v,bound[i],bind),end[i],depart));
 setPosition(refs.atp,...pos,(1-PP.smooth(.51,.60,p)),.60);refs.atpLabel.setAttribute('opacity',1-hydro);refs.adpLabel.setAttribute('opacity',hydro);
 // Hydrolysis breaks the original terminal phosphate bond continuously.
 terminalBond[terminalBond.length-1]?.setAttribute('opacity',1-hydro);
 const terminalHome=[pos[0]+55*.6,pos[1]],detach=PP.smooth(.22,.32,p),release=PP.smooth(.66,.80,p);const piPos=terminalHome.map((v,i)=>mix(mix(v,site[i],detach),[242,422][i],release));
 setPosition(refs.pi,...piPos,(1-PP.smooth(.83,.94,p)),.60);refs.pi.querySelector('text').textContent=release>.4?'Pi':'P';
 if(state.selected==='pump')$('[data-structure-detail]').textContent=`${c.label}。每轮 3 Na⁺ 出 / 2 K⁺ 入 / 1 ATP；泵在所有阶段持续工作。`;
}
function updateFlow(q){
 const config={nav:{x:570,phase:q.fluxNa*.009,visible:PP.smooth(.001,.03,q.pNa)*PP.smooth(.02,.20,q.navAxisClearance),dir:q.ina<0?1:-1,clearance:q.navAxisClearance},kv:{x:780,phase:q.fluxK*.008,visible:PP.smooth(.012,.08,q.pK)*PP.smooth(.02,.20,q.kvClearance),dir:q.ik<0?1:-1,clearance:q.kvClearance},leak:{x:360,phase:state.seconds*.16,visible:.85,dir:q.ileak<0?1:-1,clearance:.64}};
 for(const[id,c]of Object.entries(config)){const tokens=refs.flow[id];tokens.forEach((node,i)=>{
  const z=(c.phase+i/tokens.length)%1,y=c.dir===1?mix(191,405,z):mix(405,191,z),radius=id==='nav'?8.5:11;
  const fade=PP.smooth(0,.08,z)*(1-PP.smooth(.92,1,z));
  // The flow axis is fixed to the channel body. A central obstruction fades
  // and stops the column instead of moving ions toward one wall.
  const recruitment=id==='nav'?PP.smooth((i%6)*.011,(i%6)*.011+.018,q.pNa):1;
  const scale=Math.min(.81,c.clearance*40*.42/radius);
  setPosition(node,c.x,y,fade*c.visible*recruitment,scale);
 });}
 for(const[id,c]of [['na',config.nav],['k',config.kv],['leak',config.leak]]){
  $(`[data-${id}-arrow]`).setAttribute('opacity',c.visible*.85);
 }
}
function updateProteinFocus(q){
 const focus=PP.proteinFocus(q,state.stimulus);
 for(const[id,p]of Object.entries(refs.proteins)){
  const active=state.highlight&&id===focus.target,opacity=state.highlight?focus.opacity[id]:1;
  p.node.classList.toggle('is-stage-active',active);p.node.dataset.phaseFocus=String(active);
  focusNodes[id].forEach(node=>node.setAttribute('opacity',opacity.toFixed(3)));
 }
 refs.area.dataset.focusProtein=state.highlight?(focus.target||'all'):'all';
 $('[data-focus-legend]').textContent=!state.highlight||q.stage===4?'全部蛋白正常显示':'当前重点正常显示，其余蛋白半透明';
}
function updateObservation(q,trace){
 const weak=state.stimulus==='weak';let title,caption;
 if(q.stage===0){title='钠钾泵 · 建立与维持离子梯度';caption='ATP 供能：3 Na⁺ 外运，2 K⁺ 内运';}
 else if(q.stage===1){title='K⁺ 漏出 · 维持静息电位';caption='各项电流平衡，膜内负、膜外正';}
 else if(weak&&(q.stage===2||q.stage===3)){title=q.stage===2?'阈下响应 · 未产生动作电位':'局部偏移消退 · 未发生电位反转';caption='膜电位保持负值，观察曲线与阈电位参考线';}
 else if(q.stage===2){
  title=q.v>0?'Na⁺ 内流 · 电位反转':q.v>=PP.thresholdReferenceMv?'Na⁺ 内流 · 膜电位上升':'电极刺激 · 开始去极化';
  caption=q.v>0?'内正外负：对比静息时的符号与色带':'负值减小，此刻尚未形成内正外负';
 }else if(q.stage===3){
  title=q.v<trace.rest-1?'短暂超极化 · 比静息更负':q.v>0?'复极化 · 正电位正在下降':'K⁺ 外流 · 恢复内负外正';
  caption=q.v<trace.rest-1?'K⁺ 通道缓慢关闭，膜电位短暂低于静息值':q.v>0?'Na⁺ 逐渐失活、K⁺ 外流；此刻仍内正外负':'膜内恢复负电位，K⁺ 仍在外流';
 }else{title=q.v<trace.rest-1?'门控复位 · 电位回升至静息':'回到静息 · 持续维护离子梯度';caption='钠钾泵持续工作，维持外 Na⁺ 高、内 K⁺ 高';}
 const [color,soft]=STAGE_COLORS[q.stage];refs.area.style.setProperty('--phase-color',color);refs.area.style.setProperty('--phase-soft',soft);
 $('[data-focus-step]').textContent=String(q.stage+1).padStart(2,'0');$('[data-focus-title]').textContent=title;
 $('[data-focus-caption]').textContent=caption;
 refs.area.dataset.polarity=q.measuring?(q.v>0?'positive':'negative'):'not-shown';
 for(const side of ['inside','outside']){
  const positive=side==='inside'?q.v>0:q.v<=0;
  $(`[data-${side}-band]`).setAttribute('fill',positive?'#f6c5a4':'#bed5f1');
 }
 const chargeOpacity=q.measuring?PP.smooth(PP.bounds[1],PP.bounds[1]+PP.focusTransitionSeconds,q.seconds):0;
 $('[data-charges]').setAttribute('opacity',chargeOpacity.toFixed(3));
 $('[data-polarity-bands]').setAttribute('opacity',(chargeOpacity*Math.max(.15,Math.min(.65,Math.abs(q.v)/65*.65))).toFixed(3));
 const starts=[0,0,3,trace.peak.t,trace.trough.t],ends=[0,3,trace.peak.t,trace.trough.t,30],band=$('[data-stage-band]');
 band.setAttribute('x',px(starts[q.stage]));band.setAttribute('width',px(ends[q.stage])-px(starts[q.stage]));band.setAttribute('fill',soft);
}
function updateCircuit(q){
 const active=q.measuring&&q.stim>0,pulse=(state.seconds*2.8)%1,opacity=active?1:0;
 $('[data-stim-wave]').setAttribute('opacity',opacity);$('[data-mini-stim]').setAttribute('opacity',opacity);
 $('[data-stim-wire]').setAttribute('stroke-dashoffset',(-state.seconds*48).toFixed(2));
 $('[data-stim-ring]').setAttribute('rx',(16+pulse*24).toFixed(2));$('[data-stim-ring]').setAttribute('ry',(8+pulse*14).toFixed(2));$('[data-stim-ring]').setAttribute('opacity',(1-pulse).toFixed(3));
 $('[data-mini-ring]').setAttribute('rx',(15+pulse*18).toFixed(2));$('[data-mini-ring]').setAttribute('opacity',(1-pulse).toFixed(3));
 $('[data-stim-led]').setAttribute('fill',active?'#e39a30':'#c4d4cf');
 $('[data-meter-needle]').setAttribute('transform',`rotate(${-55+PP.clamp((q.v+90)/140)*110} 912 46)`);
 $('[data-meter-needle]').setAttribute('opacity',q.measuring?'1':'0');
}

let lastStage=-1,lastProtocolSecond=-1;
function render(){
 const trace=traces[state.stimulus],q=PP.lessonState(state.seconds,trace),stage=q.stage,weak=state.stimulus==='weak';
 refs.area.classList.toggle('hide-labels',!state.labels);refs.svg.classList.toggle('focus-on',state.highlight);
 refs.stageButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(stage===i)));
 refs.stageTitle.textContent=weak&&stage===2?'阈下刺激 · 未产生动作电位':weak&&stage===3?'局部偏移消退':NAMES[stage];
 refs.summary.textContent=weak&&stage===2?'阈下刺激使膜电位小幅去极化，未触发再生性 Na⁺ 内流，不形成动作电位。浅色虚线保留阈上刺激的曲线，便于比较。':weak&&stage===3?'局部电位偏移逐渐消退，通道活动未形成动作电位的上升支与下降支。':DESCRIPTIONS[stage];
 refs.voltage.textContent=q.measuring?q.v.toFixed(1).replace('-','−'):'—';refs.ms.textContent=q.measuring?`${q.ms.toFixed(2)} ms`:'机制导入';
 refs.na.textContent=q.naState;refs.kv.textContent=q.kState;refs.naBar.style.width=`${q.pNa*100}%`;refs.kBar.style.width=`${q.pK*100}%`;
 refs.naBar.parentElement.title=`相对理论最大电导 ${(q.pNa*100).toFixed(1)}%`;refs.kBar.parentElement.title=`相对理论最大电导 ${(q.pK*100).toFixed(1)}%`;
 const stageStarts=[0,0,3,trace.peak.t,trace.trough.t];refs.trace.setAttribute('d',q.measuring?pathBetween(trace,stageStarts[stage],q.ms):'');
 refs.cursor.setAttribute('d',`M${px(q.ms)} ${plot.top} V${plot.bottom}`);refs.dot.setAttribute('cx',px(q.ms));refs.dot.setAttribute('cy',py(q.v));refs.cursor.setAttribute('opacity',q.measuring?.45:0);refs.dot.setAttribute('opacity',q.measuring?1:0);
 $('[data-reference-label]').textContent=weak?'阈上刺激参考':'完整过程';
 setImage('nav-body','nav-body',0);setImage('nav-activation','nav-activation',q.activation*(A.frames['nav-activation']-1));setImage('nav-inactivation','nav-inactivation',q.inactivation*(A.frames['nav-inactivation']-1));
 setImage('kv','kv',q.potassium*(A.frames.kv-1));setImage('leak','leak',0);updatePump(q);updateFlow(q);updateCircuit(q);updateProteinFocus(q);updateObservation(q,trace);
 refs.bg.forEach(n=>n.setAttribute('transform',activeTransport2dParticleTransform(n,state.seconds,.16)));refs.tails.forEach(n=>activeTransport2dUpdateLipidTail(n,state.seconds,.16));
 refs.chargesOut.forEach(n=>{n.textContent=q.v>0?'−':'+';n.classList.toggle('is-positive',q.v<=0);});refs.chargesIn.forEach(n=>{n.textContent=q.v>0?'+':'−';n.classList.toggle('is-positive',q.v>0);});
 $('[data-protein-state=nav]').textContent=q.naState;$('[data-protein-state=kv]').textContent=q.kState;$('[data-protein-state=leak]').textContent='持续提供 K⁺ 通透性';$('[data-protein-state=pump]').textContent='持续主动运输';
 $('[data-stage-kicker]').textContent=`STAGE 0${stage+1} / 05`;$('[data-stage-en]').textContent=weak&&stage===2?'Subthreshold Response':weak&&stage===3?'Passive Recovery':STAGE_EN[stage];
 $('[data-na-fraction]').textContent=`gNa / 最大电导：${(q.pNa*100).toFixed(1)}%`;$('[data-k-fraction]').textContent=`gK / 最大电导：${(q.pK*100).toFixed(1)}%`;
 refs.area.dataset.activation=q.activation.toFixed(4);refs.area.dataset.inactivation=q.inactivation.toFixed(4);refs.area.dataset.potassium=q.potassium.toFixed(4);refs.area.dataset.stimActive=String(q.stim>0&&q.measuring);refs.area.dataset.navClearance=q.navClearance.toFixed(4);refs.area.dataset.navAxisClearance=q.navAxisClearance.toFixed(4);

 globalThis.AnderModelShell.setControl(refs.play,"play",state.playing?'Ⅱ 暂停':state.seconds>=PP.lessonDuration?'↻ 再播放':'▶ 播放');refs.timeline.value=Math.round(state.seconds*100);$('[data-progress]').textContent=`${Math.round(state.seconds/PP.lessonDuration*100)}%`;
 globalThis.AnderModelShell.setControl($('[data-action=speed]'),"speed",`× ${state.speed} 倍速`);$('[data-action=labels]').setAttribute('aria-pressed',String(state.labels));$('[data-action=highlight]').setAttribute('aria-pressed',String(state.highlight));
 globalThis.AnderModelShell.setControl($('[data-action=labels]'),"labels",state.labels?'Aa 隐藏标签':'Aa 显示标签');globalThis.AnderModelShell.setControl($('[data-action=highlight]'),"highlight",state.highlight?'◐ 关闭聚焦':'◐ 阶段聚焦');
 $$('[data-stimulus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stimulus===state.stimulus)));
 // Small DOM-visible state contract supports non-invasive browser acceptance.
 refs.area.dataset.stage=String(stage);refs.area.dataset.ms=q.ms.toFixed(4);refs.area.dataset.voltage=q.v.toFixed(4);refs.area.dataset.playing=String(state.playing);refs.area.dataset.na=q.naState;refs.area.dataset.k=q.kState;refs.area.dataset.pumpPhase=q.pump.toFixed(4);refs.area.dataset.stimulus=state.stimulus;
 globalThis.NeuralSample?.sync();
 if(stage!==lastStage){lastStage=stage;emit('model:stage-changed',{stageIndex:stage,stageId:ANDER_MODEL_MANIFEST.stages[stage].id});}
 if(Math.floor(state.seconds)!==lastProtocolSecond){lastProtocolSecond=Math.floor(state.seconds);emit('model:progress',{progress:state.seconds/PP.lessonDuration,stageIndex:stage,physiologicalTimeMs:q.ms});}
}
function selectProtein(id){if(!STRUCTURES[id])return;state.selected=id;$$('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===id)));for(const[key,o]of Object.entries(refs.proteins))o.node.classList.toggle('selected',key===id);$('[data-structure-title]').textContent=STRUCTURES[id].title;$('[data-structure-detail]').textContent=STRUCTURES[id].detail;render();}
function seek(seconds){state.seconds=PP.clamp(seconds,0,PP.lessonDuration);state.playing=false;state.last=0;render();report();}
function setStage(index){const stage=Math.max(0,Math.min(4,index));seek(PP.bounds[stage]+(stage>0?PP.focusTransitionSeconds:0));}
function report(requestId){const q=PP.lessonState(state.seconds,traces[state.stimulus]);emit('model:state',{stageIndex:q.stage,stageId:ANDER_MODEL_MANIFEST.stages[q.stage].id,playing:state.playing,speed:state.speed,labels:state.labels,highlight:state.highlight,progress:state.seconds/PP.lessonDuration,stimulus:state.stimulus},requestId);}
let hostOrigin='*';try{if(document.referrer)hostOrigin=new URL(document.referrer).origin;}catch{}
function emit(type,payload={},requestId){if(window.parent===window)return;window.parent.postMessage({source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload,requestId},hostOrigin);}
async function fullScreen(){if(window.parent!==window)emit('model:request-fullscreen',{});try{if(document.fullscreenElement)await document.exitFullscreen();else if(refs.area.requestFullscreen)await refs.area.requestFullscreen();else refs.area.classList.toggle('is-css-fullscreen');}catch{refs.area.classList.toggle('is-css-fullscreen');}}
function startPlayback(){
 if(state.seconds>=PP.lessonDuration)state.seconds=0;
 state.playing=true;state.last=0;
}
async function action(name){
 if(name==='reset')globalThis.NeuralSample?.resetView();
 if(name==='play'&&state.ready){if(state.playing)state.playing=false;else startPlayback();}
 else if(name==='reset'){state.stimulus='standard';state.speed=1;state.labels=true;state.highlight=true;selectProtein('pump');seek(0);}
 else if(name==='prev')setStage(PP.lessonState(state.seconds,traces[state.stimulus]).stage-1);
 else if(name==='next')setStage(PP.lessonState(state.seconds,traces[state.stimulus]).stage+1);
 else if(name==='speed'){const speeds=[.5,1,1.5,2];state.speed=speeds[(speeds.indexOf(state.speed)+1)%4];}
 else if(name==='labels')state.labels=!state.labels;
 else if(name==='highlight')state.highlight=!state.highlight;
 else if(name==='stimulate'&&state.ready){state.seconds=PP.bounds[2];startPlayback();}
 else if(name==='fullscreen')return; // Shared shell owns fullscreen and immersion.
 else if(name==='back'){const params=new URLSearchParams(location.search),value=params.get('return')||params.get('returnTo')||document.referrer;if(value){try{const url=new URL(value,location.href);if(['http:','https:'].includes(url.protocol))location.assign(url.href);}catch{}}else if(history.length>1)history.back();}
 render();report();
}
root.addEventListener('click',e=>{const b=e.target.closest('button,[data-protein]');if(!b)return;if(b.dataset.stage!==undefined)setStage(Number(b.dataset.stage));else if(b.dataset.stimulus){state.stimulus=b.dataset.stimulus;setStage(1);}else if(b.dataset.select)selectProtein(b.dataset.select);else if(b.dataset.protein)selectProtein(b.dataset.protein);else if(b.dataset.action)action(b.dataset.action);});
root.addEventListener('keydown',e=>{if(e.target.matches('[data-protein]')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectProtein(e.target.dataset.protein);}});
refs.timeline.addEventListener('input',()=>seek(Number(refs.timeline.value)/100));
document.addEventListener('visibilitychange',()=>{state.last=0;});
window.addEventListener('message',e=>{const m=e.data;if(e.source!==window.parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;if(hostOrigin!=='*'&&e.origin!==hostOrigin)return;const p=m.payload||{};
 if(m.type==='host:init')emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:state.ready},m.requestId);
 else if(m.type==='host:play'&&state.ready)startPlayback();
 else if(m.type==='host:pause')state.playing=false;
 else if(m.type==='host:reset')action('reset');
 else if(m.type==='host:set-stage'){const index=ANDER_MODEL_MANIFEST.stages.findIndex(s=>s.id===p.stageId);if(index>=0)setStage(index);}
 else if(m.type==='host:set-speed'&&[.5,1,1.5,2].includes(Number(p.speed)))state.speed=Number(p.speed);
 else if(m.type==='host:set-labels')state.labels=p.visible!==false;
 else if(m.type==='host:set-highlight')state.highlight=!!p.enabled;
 render();report(m.requestId);
});
function animate(){const now=performance.now()*.001;if(state.playing&&state.ready){
 let stopped=false;
 if(state.last){const next=PP.advanceLesson(state.seconds,Math.min(.1,now-state.last)*state.speed);state.seconds=next.seconds;stopped=next.ended;if(stopped)state.playing=false;}
 render();if(stopped)report();
 }state.last=now;requestAnimationFrame(animate);}
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
 attrs(svg.querySelector('[data-stage-band]'),{y:plot.top,height:plot.bottom-plot.top});attrs(svg.querySelector('[data-stim-zone]'),{x:px(3),y:plot.top,width:px(3.7)-px(3),height:plot.bottom-plot.top});attrs(svg.querySelector('[data-stim-label]'),{x:px(3.35),y:19});refs.reference.setAttribute('d',pathBetween(traces.standard,0,30));
 render();
}
new ResizeObserver(resizePlot).observe($('.record-plot'));
selectProtein(state.selected);
const neuralLayout=NeuralModelLayout.mount({manifest:ANDER_MODEL_MANIFEST,root,width:1000,height:615,getState:()=>({...state}),onResize:()=>{}});
const assetUrls=['assets/neuron-v2.png',...Object.entries(A.frames).flatMap(([name,count])=>Array.from({length:count},(_,i)=>`assets/proteins/${name}-${String(i).padStart(2,'0')}.webp`))];
let animationStarted=false;
function loadAssets(){neuralLayout.loading();return Promise.all(assetUrls.map(url=>new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(Error(url));img.src=url;}))).then(()=>{state.ready=true;refs.play.disabled=false;$('[data-load]').textContent='';neuralLayout.ready();emit('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true});report();if(!animationStarted){animationStarted=true;requestAnimationFrame(animate);}}).catch(error=>{neuralLayout.failed('膜蛋白素材加载失败。重新加载将保留当前进度。',loadAssets);emit('model:error',{message:`Model asset failed: ${error.message}`});console.error(error);});}
loadAssets();
