import {mountLabShell} from './lab-shell.js';
import {bindLabGesture} from './lab-gesture.js';
let labExperience=null,manualViewBox=null;
import {STAGES,SEQUENCE,PAIRED,BASE_COLORS,STRAND_COLORS,STRAND_FILLS,SCENE,PRIMER_LENGTH,COUNT_CAP,DETAILED_CYCLES,SUMMARY_CAP,SUMMARY_SECONDS,STEP,LENGTH,clamp,smooth,lerp,validCycles,buildTimeline,stateAt,stageTime,layout,summaryLayout,growingTip,incorporatedBase,stopAfterCycle,isOriginalStrand,retainedHalf} from './pcr-engine.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"pcr","version":"2.5.1","publish":true,"title":{"zh":"PCR的基本过程","en":"The Basic Process of PCR"},"summary":{"zh":"跟随模板、引物、dNTP与Taq观察PCR三步循环、等长子代形成及理想指数扩增。","en":"Follow template DNA, primers, dNTPs and Taq through thermal cycling and ideal exponential amplification."},"module":{"id":"biotechnology","zh":"选择性必修三 · 生物技术与工程","en":"Biotechnology & Engineering"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.webp","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":true,"fullscreen":true,"practice":false},"stages":[{"id":"initial","title":{"zh":"预变性","en":"Initial denaturation"}},{"id":"denature","title":{"zh":"变性","en":"Denaturation"}},{"id":"anneal","title":{"zh":"复性（退火）","en":"Annealing"}},{"id":"extend","title":{"zh":"延伸","en":"Extension"}},{"id":"final","title":{"zh":"最后延伸","en":"Final extension"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","pcr-engine.js","lab-gesture.js","lab-shell.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","lab-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const shell=AnderModelShell,svg=$('scene');
function el(tag,attrs={},parent=svg,text){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;parent.appendChild(n);return n;}
function set(node,key,value){const v=String(value);if(node.getAttribute(key)!==v)node.setAttribute(key,v);}
function show(node,value){set(node,'display',value?'inline':'none');}
function text(node,value){const v=String(value);if(node.textContent!==v)node.textContent=v;}
const use=(id,attrs,parent)=>el('use',{href:'#'+id,...attrs},parent);
const fmt=n=>n.toLocaleString('en-US');
const defs=el('defs');
const tempDefs=el('defs',{},$('temperature-scene'));
function thermalGradient(id,colors,radial=false){
  const g=el(radial?'radialGradient':'linearGradient',{id,...(radial?{cx:'.32',cy:'.26',r:'.78'}:{x1:'0',y1:'0',x2:'1',y2:'0'})},tempDefs);
  colors.forEach(([offset,color])=>el('stop',{offset,'stop-color':color},g));
}
thermalGradient('temperature-gradient',[['0%','#c3504d'],['38%','#ffb296'],['65%','#ee806e'],['100%','#c8514d']]);
thermalGradient('thermo-glass',[['0%','#b6cecf'],['20%','#f9ffff'],['45%','#e6f2f1'],['74%','#fff'],['100%','#9cbabd']]);
thermalGradient('thermo-bulb',[['0%','#ffd0a6'],['45%','#ee8a70'],['100%','#cc5b54']],true);
thermalGradient('thermo-backing',[['0%','#f8fcfc'],['70%','#eaf3f1'],['100%','#d5e4e2']]);

// Each molecular species has one shared SVG definition in stock, flight and reaction.
for(const [base,color]of Object.entries(BASE_COLORS)){
  for(const dir of [1,-1]){
    const symbol=el('g',{id:`residue-${base}-${dir}`},defs);
    el('circle',{cx:-7,cy:0,r:2.4,fill:STRAND_COLORS.primer,stroke:'#fff','stroke-width':.5},symbol);
    el('path',{d:'M-4 -3 1 -5 5 -1 3 4 -3 4Z',fill:STRAND_FILLS.primer,stroke:STRAND_COLORS.primer,'stroke-width':.9},symbol);
    el('path',{d:`M0 ${dir*4}V${dir*10}`,stroke:'#9eaeaf','stroke-width':1},symbol);
    el('rect',{x:-5.8,y:dir===1?9:-20,width:11.6,height:11,rx:2,fill:color},symbol);
    el('text',{x:0,y:dir===1?17.4:-11.6,'text-anchor':'middle',fill:base==='G'?'#63531f':'white','font-size':8,'font-weight':650},symbol,base);
  }
  const free=el('g',{id:`dntp-${base}`},defs);
  el('path',{d:'M-9 -2 -1 -9 9 -4 7 8 -6 9Z',fill:'#fcf1dc',stroke:'#ba8f52','stroke-width':1.4},free);
  el('path',{d:'M8 -1H17M-9 1H-37',stroke:'#8aa9af','stroke-width':1.7},free);
  for(const x of [-16,-26,-36]){el('circle',{cx:x,cy:1,r:4.6,fill:'#a9ddea',stroke:'#58a9c0','stroke-width':.8},free);el('text',{x,y:3.3,'text-anchor':'middle','font-size':6,fill:'#3d8094'},free,'P');}
  el('rect',{x:16,y:-9,width:19,height:20,rx:4,fill:color},free);
  el('text',{x:25.5,y:5,'text-anchor':'middle',fill:base==='G'?'#63531f':'white','font-size':12,'font-weight':650},free,base);
}
const taqDef=el('g',{id:'taq-shape'},defs);
el('image',{href:'assets/taq.webp',x:-62,y:-62,width:124,height:124},taqDef);
function strand(parent,dir,original){
  return el('image',{href:strandAsset(dir,original),x:-380,y:-30,width:760,height:60,'data-origin':original?'original':'new'},parent);
}
function strandAsset(dir,original){
  return `assets/strand-${original?'template':'new'}-${dir===1?'top':'bottom'}.webp`;
}
for(const top of [true,false]){
  const g=el('g',{id:top?'primer-r':'primer-f'},defs),seq=top?PAIRED:SEQUENCE;
  el('path',{d:'M-125 0H125',stroke:STRAND_COLORS.primer,'stroke-width':9,'stroke-linecap':'round'},g);
  for(let j=0;j<18;j++)use(`residue-${seq[j+(top?36:0)]}-${top?-1:1}`,{x:(j-8.5)*STEP},g);
  el('text',{x:-140,y:4,class:'dna-end optional-label'},g,top?'3′':'5′');el('text',{x:130,y:4,class:'dna-end optional-label'},g,top?'5′':'3′');
}

// Coordinate system shared by the source, stocks, moving reagents and bound molecules.
el('rect',{id:'reaction-chamber',...SCENE.reactor,rx:15,fill:'#f3f9f7',stroke:'#d9e8e3'},svg);
const sourceGroup=el('g',{id:'template-source'},svg);
el('image',{href:'assets/cell.webp',x:SCENE.source.x-31,y:SCENE.source.y-31,width:62,height:62},sourceGroup);
el('text',{x:SCENE.stockCenters[0],y:18,'text-anchor':'middle',class:'reagent-title optional-label'},sourceGroup,'模板来源');
el('text',{x:150,y:48,class:'scene-label optional-label'},sourceGroup,'细胞 DNA');
el('text',{x:150,y:71,class:'scene-note optional-label'},sourceGroup,'提取、纯化（省略）');
const stocks=el('g',{id:'reagent-stock'},svg);
const stockNames=['dNTP','一对 DNA 引物','Taq DNA 聚合酶'];
const stockX=SCENE.stockCenters.slice(1);
for(let i=0;i<3;i++){
  el('text',{x:stockX[i],y:18,'text-anchor':'middle',class:'reagent-title'},stocks,stockNames[i]);
}
for(const [i,b]of Object.keys(BASE_COLORS).entries())use(`dntp-${b}`,{transform:poseString({...SCENE.dntp,x:SCENE.dntp.x+i*SCENE.dntp.step})},stocks);
use('primer-f',{transform:poseString(SCENE.primerF)},stocks);
use('primer-r',{transform:poseString(SCENE.primerR)},stocks);
use('taq-shape',{transform:poseString(SCENE.taq)},stocks);
el('text',{x:SCENE.stockCenters[1],y:84,'text-anchor':'middle',class:'scene-note optional-label'},stocks,'四种脱氧核苷三磷酸');
el('text',{x:SCENE.primerF.x-72,y:45,class:'scene-note optional-label'},stocks,'F');
el('text',{x:SCENE.primerR.x-72,y:72,class:'scene-note optional-label'},stocks,'R');
el('text',{x:SCENE.taq.x+42,y:48,class:'scene-note optional-label'},stocks,'耐高温');
el('text',{x:SCENE.taq.x+42,y:68,class:'scene-note optional-label'},stocks,'重复催化');
const sampleText=el('text',{x:28,y:119,class:'scene-note'},svg,'1 个双链模板');
el('text',{x:1180,y:119,'text-anchor':'end',class:'scene-note optional-label'},svg,'A—T / G—C · 5′→3′ 合成');

// Vector glass housing and independent liquid column, calibrated to the same
// temperature map as the numerical readout. No image-frame switching.
const thermometer=el('g',{id:'thermometer'},$('temperature-scene'));
el('ellipse',{cx:48,cy:359,rx:29,ry:5,fill:'#567b7d',opacity:.12},thermometer);
el('rect',{x:19,y:29,width:80,height:329,rx:15,fill:'url(#thermo-backing)',stroke:'#c9dbd8','stroke-width':1.2},thermometer);
el('path',{d:'M32 309V42a12 12 0 0 1 24 0v267a25 25 0 1 1-24 0Z',fill:'url(#thermo-glass)',stroke:'#93b0b4','stroke-width':1.3},thermometer);
el('rect',{x:38,y:42,width:12,height:277,rx:6,fill:'#deebea',stroke:'#c0d3d1','stroke-width':.7},thermometer);
const mercury=el('rect',{id:'thermometer-liquid',x:39,y:301,width:10,height:12,rx:4,fill:'url(#temperature-gradient)'},thermometer);
el('rect',{x:39,y:307,width:10,height:23,fill:'url(#temperature-gradient)'},thermometer);
el('circle',{cx:44,cy:330,r:18,fill:'url(#thermo-bulb)',stroke:'#cf7668','stroke-width':.7},thermometer);
el('path',{d:'M35 48v249M29 321q-7 12 3 20',fill:'none',stroke:'#fff','stroke-width':2.2,'stroke-linecap':'round',opacity:.83},thermometer);
el('path',{d:'M53 48v251',fill:'none',stroke:'#c0d8d7','stroke-width':1,opacity:.8},thermometer);
for(let t=25;t<=95;t+=5){const y=SCENE.thermometer.bottom-(t-20)*SCENE.thermometer.units;el('path',{d:`M63 ${y}h${[25,55,95].includes(t)?9:4}`,stroke:'#83a2a7','stroke-width':.9},thermometer);}
for(const t of [25,55,72,95]){const y=SCENE.thermometer.bottom-(t-20)*SCENE.thermometer.units;el('path',{d:`M63 ${y}h9`,stroke:'#658a92'},thermometer);el('text',{x:77,y:y+3.6,'font-size':11,fill:'#587b83'},thermometer,String(t));}
el('rect',{x:14,y:0,width:85,height:25,rx:8,fill:'#edf5f3',stroke:'#d5e5e0'},thermometer);
const thermoValue=el('text',{x:56.5,y:18,'text-anchor':'middle',class:'scene-title'},thermometer,'25°C');
el('text',{x:56,y:378,'text-anchor':'middle',class:'scene-label optional-label'},thermometer,'温度');

const moleculeLayer=el('g',{id:'molecule-layer'},svg),flightLayer=el('g',{id:'flight-layer'},svg);
const units=[];
for(let i=0;i<COUNT_CAP;i++){
  const halves=[];
  for(let h=0;h<2;h++){
    const top=h===0,g=el('g',{'data-dna-unit':i,'data-half':h},moleculeLayer);
    const templateY=top?-22:22,newY=-templateY;
    const template=el('g',{transform:`translate(0 ${templateY})`},g);
    const templateImage=strand(template,top?1:-1,true);
    el('text',{x:-408,y:5,class:'dna-end optional-label'},template,top?'5′':'3′');
    el('text',{x:391,y:5,class:'dna-end optional-label'},template,top?'3′':'5′');
    const clip=el('clipPath',{id:`grow-${i}-${h}`,clipPathUnits:'userSpaceOnUse'},defs);
    const clipRect=el('rect',{x:-380,y:-35,width:0,height:70},clip);
    const bonds=el('g',{'clip-path':`url(#grow-${i}-${h})`},g);
    const bondPath=Array.from({length:54},(_,b)=>`M${(b-26.5)*STEP} -2V2`).join('');
    el('path',{d:bondPath,stroke:'#9cb7b4','stroke-width':1.2,'stroke-dasharray':'1 1'},bonds);
    const originalBonds=el('g',{},g);
    if(top)el('path',{d:bondPath,stroke:'#9cb7b4','stroke-width':1.2,'stroke-dasharray':'1 1'},originalBonds);
    const daughter=el('g',{transform:`translate(0 ${newY})`,'clip-path':`url(#grow-${i}-${h})`},g);
    strand(daughter,top?-1:1,false);
    const end5=el('text',{x:top?391:-408,y:newY+5,class:'dna-end optional-label'},g,'5′');
    const end3=el('text',{x:0,y:newY+(top?22:-13),class:'dna-end optional-label','text-anchor':'middle'},g,'3′');
    const primerFlight=use(top?'primer-r':'primer-f',{},flightLayer);
    const enzyme=use('taq-shape',{'data-enzyme':`${i}-${h}`},flightLayer);
    halves.push({g,template,templateImage,daughter,clipRect,end5,end3,primerFlight,enzyme,top,newY,originalBonds});
  }
  units.push(halves);
}
const particles=[0,1].map(()=>({node:use('dntp-A',{},flightLayer)}));
const ppis=[0,1].map(()=>{const g=el('g',{},flightLayer);for(const x of [-4,4])el('circle',{cx:x,cy:0,r:4,fill:'#a9ddea',stroke:'#58a9c0','stroke-width':.8},g);return g;});

for(const origin of ['new','upper','lower']){
  const g=el('g',{id:'summary-dna-'+origin},defs);
  el('path',{d:'M-27 -4v8m9-8v8m9-8v8m9-8v8m9-8v8m9-8v8m9-8v8',stroke:'#a3c7bb','stroke-width':1.2},g);
  el('path',{d:'M-34 -5H34',stroke:origin==='upper'?STRAND_COLORS.original:STRAND_COLORS.new,'stroke-width':3,'stroke-linecap':'round'},g);
  el('path',{d:'M-34 5H34',stroke:origin==='lower'?STRAND_COLORS.original:STRAND_COLORS.new,'stroke-width':3,'stroke-linecap':'round'},g);
  if(origin!=='upper')el('path',{d:'M-34 -5h13',stroke:STRAND_COLORS.primer,'stroke-width':3,'stroke-linecap':'round'},g);
  if(origin!=='lower')el('path',{d:'M21 5h13',stroke:STRAND_COLORS.primer,'stroke-width':3,'stroke-linecap':'round'},g);
}
const summaryLayer=el('g',{id:'summary-layer',display:'none'},svg);
const summaryNodes=Array.from({length:SUMMARY_CAP},(_,i)=>use('summary-dna-new',{'data-summary-dna':i,display:'none'},summaryLayer));
let lastSummaryKey='',wasSummary=false;

let timeline=buildTimeline(30),time=0,playing=false,speed=1,labels=true,view='overview',highlight=false,raf=0,lastFrame=0,lastUi=-1,lastSent=0,hostOrigin='*';
let current=stateAt(timeline,time),lastPhase='',lastCount=-1;
const stageButtons=STAGES.map((stage,i)=>{
  const b=document.createElement('button');b.type='button';b.className='stage-tab';b.dataset.stage=stage.id;b.innerHTML=shell.stageContent(i,stage.zh,stage.en);b.addEventListener('click',()=>goStage(i));document.querySelector('.stage-strip').appendChild(b);return b;
});
const trackFills=STAGES.map((stage,i)=>{
  const b=document.createElement('button');b.type='button';b.className='phase-step';b.dataset.phase=i;b.innerHTML=`<span class="phase-line"><i class="phase-fill"></i></span><strong>${i+1} ${stage.zh}</strong><small>${stage.temp}°C · ${stage.hold<60?stage.hold+' s':stage.hold/60+' min'}</small>`;b.addEventListener('click',()=>goStage(i));document.querySelector(i>0&&i<4?'.cycle-loop-steps':i===0?'.phase-once-first':'.phase-once-last').appendChild(b);return b;
});
const historyNodes=Array.from({length:41},(_,i)=>{
  const n=document.createElement('div');n.className='history-row';
  const copies=Math.min(8,2**i),molecules=Array.from({length:copies},(_,j)=>{
    const upper=isOriginalStrand(i+1,j,0,8)?STRAND_COLORS.original:STRAND_COLORS.new;
    const lower=isOriginalStrand(i+1,j,1,8)?STRAND_COLORS.original:STRAND_COLORS.new;
    return `<path d="M${5+j*23} 9h17" stroke="${upper}" stroke-width="2.5"/><path d="M${5+j*23} 16h17" stroke="${lower}" stroke-width="2.5"/><path d="M${8+j*23} 10v5m4-5v5m4-5v5m4-5v5" stroke="#afc7c3"/>`;
  }).join('');
  n.innerHTML=`<header><span>${i?'第 '+i+' 轮':'起始模板'}</span><strong>${fmt(2**i)}</strong></header>${i<=DETAILED_CYCLES?`<svg viewBox="0 0 195 25" aria-hidden="true">${molecules}</svg>`:''}`;
  $('product-history').appendChild(n);return n;
});
const descriptions=[
  '升温至 95°C，互补双链分离；两条模板的主链保持完整。预变性只进行一次。',
  '95°C 使双链分开，每一条单链均可作为模板；第 1 轮延续预变性后的分离状态。',
  '降至 55°C，两种 DNA 引物分别与相反模板的末端互补结合，3′ 端朝向待扩增区域。',
  '72°C 下，Taq 从引物 3′ 端延伸。dNTP 按互补规则加入，两个子链均沿 5′→3′ 方向合成。',
  '72°C 保温，给未完成的延伸留出时间。图中已完整的子链保持完整，DNA 总量不再翻倍。',
];
function poseString(p,angle=0){return `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${p.scale.toFixed(4)}) rotate(${angle})`;}
function lerpPose(a,b,p){return {x:lerp(a.x,b.x,p),y:lerp(a.y,b.y,p),scale:lerp(a.scale,b.scale,p)};}
function flightPose(start,end,p,lift=45){const k=smooth(p);const v=lerpPose(start,end,k);v.y-=Math.sin(Math.PI*k)*lift;return v;}

function renderDetailed(s){
  const cycle=Math.max(1,s.cycle),parents=Math.min(COUNT_CAP,2**(cycle-1));
  const final=s.stage===4,arrange=final?1:s.arrange,synthesis=final?1:s.synthesis;
  const split=s.stage===-1?0:s.stage===0?smooth((s.p-.24)/.48):s.stage===1?(cycle===1?1:smooth(s.p/.7)):1;
  const annealed=s.stage>=3||(s.stage===2&&s.p>=.73);
  const nextCount=2**cycle;
  const allPoses=[];
  for(let i=0;i<COUNT_CAP;i++){
    const mother=layout(parents,i);
    for(let h=0;h<2;h++){
      const obj=units[i][h],top=h===0,active=i<parents;
      show(obj.g,active);show(obj.primerFlight,active&&s.stage===2&&s.p>=.25&&s.p<.73);show(obj.enzyme,active&&s.stage===3&&s.p<.98);
      if(!active)continue;
      const original=isOriginalStrand(cycle,i,h);
      set(obj.templateImage,'href',strandAsset(top?1:-1,original));
      set(obj.templateImage,'data-origin',original?'original':'new');
      const halfStart={...mother,y:mother.y+(top?-60:60)*split*mother.scale};
      const capped=nextCount>COUNT_CAP,childIndex=capped?i:i*2+h;
      const end=layout(nextCount,childIndex),pose=lerpPose(halfStart,end,arrange);
      // Retain the daughter carrying the original lower strand as well as the
      // original upper strand. Other sampled parents retain their top daughter.
      const opacity=capped&&h!==retainedHalf(cycle,i)?1-arrange:1;
      set(obj.g,'opacity',opacity*(highlight&&i>0?.23:1));
      let actual=pose;
      if(s.stage===-1){const p=smooth((s.p-.12)/.8);actual=flightPose(SCENE.source,pose,p,30);}
      set(obj.g,'transform',poseString(actual));
      set(obj.originalBonds,'opacity',1-split);
      const width=annealed?(PRIMER_LENGTH+(54-PRIMER_LENGTH)*synthesis)*STEP:0;
      set(obj.clipRect,'x',top?LENGTH/2+7-width:-LENGTH/2-7);set(obj.clipRect,'width',width);
      show(obj.end5,annealed);show(obj.end3,annealed);
      const tip=growingTip(top,synthesis);set(obj.end3,'x',tip);
      // Origin and destination share the same primer definition, with no shape swap.
      if(s.stage===2&&s.p>=.25&&s.p<.73){
        const dest={x:mother.x+(top?252:-252)*mother.scale,y:halfStart.y+obj.newY*mother.scale,scale:mother.scale};
        const origin=top?SCENE.primerR:SCENE.primerF;
        set(obj.primerFlight,'transform',poseString(flightPose(origin,dest,(s.p-.25)/.48,30)));
        set(obj.primerFlight,'opacity',highlight&&i>0?.23:1);
      }
      const binding={x:halfStart.x+tip*mother.scale,y:halfStart.y,scale:mother.scale*.87};
      if(s.stage===3&&s.p<.98){
        let enzymePose=binding;
        if(s.p<.22)enzymePose=flightPose(SCENE.taq,binding,s.p/.22,40);
        if(s.p>.82)enzymePose=flightPose(binding,SCENE.taq,(s.p-.82)/.16,15);
        set(obj.enzyme,'transform',poseString(enzymePose,top?180:0));
        set(obj.enzyme,'opacity',highlight&&i>0?.23:1);
        set(obj.enzyme,'data-binding-x',binding.x.toFixed(3));
      }
      if(i===0)allPoses.push({mother,halfStart,obj,tip,pose:actual});
    }
  }
  if(view==='focus'){
    const a=allPoses[0].pose;
    const follow=s.stage===3&&s.p<.82?allPoses[0].tip:s.stage===2?252:0;
    set(svg,'viewBox',`${a.x+(follow-450)*a.scale} ${a.y-80*a.scale} ${900*a.scale} ${170*a.scale}`);
  }
  const incorporating=s.stage===3&&s.p>=.24&&s.p<.82;
  for(let k=0;k<particles.length;k++){
    const h=k%2,top=h===0,part=particles[k];
    // A representative dNTP joins the next complementary position on each strand.
    const n=s.synthesis*36,step=Math.floor(n),q=clamp(n-step),travel=q;
    show(part.node,incorporating&&travel>0&&travel<1);
    if(incorporating){
      const base=incorporatedBase(top,step),bIndex=Object.keys(BASE_COLORS).indexOf(base),{mother,halfStart,obj}=allPoses[h];
      const tip=growingTip(top,clamp((step+1)/36));
      const dest={x:mother.x+tip*mother.scale,y:halfStart.y+obj.newY*mother.scale,scale:.48*mother.scale};
      set(part.node,'href','#dntp-'+base);set(part.node,'transform',poseString(flightPose({...SCENE.dntp,x:SCENE.dntp.x+bIndex*SCENE.dntp.step},dest,travel,20),(top?-90:90)*smooth(travel)));
    }
  }
  for(let h=0;h<2;h++){
    const n=s.synthesis*36,q=n-Math.floor(n);show(ppis[h],incorporating&&n>=1&&q<.5);
    if(incorporating){const {mother,halfStart,obj,tip}=allPoses[h];set(ppis[h],'transform',`translate(${mother.x+tip*mother.scale+q*35} ${halfStart.y+obj.newY*mother.scale-q*55}) scale(${mother.scale})`);set(ppis[h],'opacity',1-q*2);}
  }
}

function renderMolecules(s){
  svg.classList.toggle('summary-mode',s.summary);
  set(svg,'preserveAspectRatio','xMidYMid meet');
  show(summaryLayer,s.summary);show(flightLayer,!s.summary);
  if(!s.summary){
    show(moleculeLayer,true);set(moleculeLayer,'opacity',1);lastSummaryKey='';renderDetailed(s);
  }else{
    const blend=s.cycle===DETAILED_CYCLES+1&&s.stage!==4?smooth(s.cycleProgress/.18):1;
    show(moleculeLayer,blend<1);
    if(blend<1){renderDetailed({...s,stage:4,cycle:DETAILED_CYCLES});set(moleculeLayer,'opacity',1-blend);}
    set(summaryLayer,'opacity',blend);
    const frozen=s.stage===4||2**(s.cycle-1)>=SUMMARY_CAP;
    const count=Math.min(SUMMARY_CAP,2**s.cycle),parents=frozen?count:count/2;
    const completion=(SUMMARY_SECONDS[1]+SUMMARY_SECONDS[2]+SUMMARY_SECONDS[3]*.82)/SUMMARY_SECONDS.reduce((a,b)=>a+b,0);
    const grow=frozen?1:smooth((s.cycleProgress-.18)/(completion-.18));
    const key=`${count}:${grow.toFixed(5)}:${highlight}`;
    if(key!==lastSummaryKey){
      summaryNodes.forEach((node,i)=>{
        const active=i<count;show(node,active);if(!active)return;
        const origin=i===0?'upper':i===count-1?'lower':'new';
        const parent=summaryLayout(parents,Math.floor(i/2)),end=summaryLayout(count,i);
        const persistent=i===count-1||(i%2===0&&i!==count-2);
        set(node,'href','#summary-dna-'+origin);set(node,'data-origin',origin);
        set(node,'transform',poseString(frozen?end:lerpPose(parent,end,grow)));
        set(node,'opacity',(persistent||frozen?1:grow)*(highlight&&i>0?.23:1));
      });
      lastSummaryKey=key;
    }
    const r=SCENE.reactor;
    set(svg,'viewBox',view==='focus'?`${r.x} ${r.y} ${r.width} ${r.height}`:`0 0 ${SCENE.width} ${SCENE.height}`);
  }
  if(s.summary!==wasSummary){wasSummary=s.summary;requestAnimationFrame(()=>{centerSmallView();positionThermometer();});}
}

function updateUi(s){
  const phase=s.stage===-1?'加入模板':s.done?'扩增完成':s.summary&&s.stage!==4?'循环扩增':STAGES[s.stage].zh;
  text($('phase-title'),phase);text($('temperature'),`${Math.round(s.temp)}°C`);
  text($('cycle-readout'),s.stage<=0?'准备':s.stage===4?`已完成 ${s.completed} 轮`:`第 ${s.cycle} / ${timeline.cycles} 轮`);
  text($('phase-description'),s.stage===-1?'从细胞中提取并纯化 DNA，以一段两端限定的双链模板加入体外反应体系。':s.summary&&s.stage!==4?'第 5 轮起省略重复过程，直接展示每轮产量翻倍。反应仍经历变性、复性与延伸；简图达到 256 个后保留画面，右侧继续计数。':descriptions[s.stage]);
  $('timeline').value=Math.round(s.progress*1000);text($('percent'),Math.round(s.progress*100)+'%');
  set($('timeline'),'aria-valuetext',`${phase}，第 ${s.cycle} 轮，总进度 ${Math.round(s.progress*100)}%`);
  for(let i=0;i<5;i++){
    stageButtons[i].classList.toggle('is-active',i===s.stage);set(stageButtons[i],'aria-current',i===s.stage?'step':'false');
    const fill=i===s.stage?s.p:(s.stage===4||i===0&&s.stage>0||i>0&&i<s.stage?1:0);
    trackFills[i].classList.toggle('active',i===s.stage);trackFills[i].querySelector('.phase-fill').style.transform=`scaleX(${fill})`;
  }
  shell.syncActiveStage();
  const sceneCount=s.stage===4||s.stage===3&&s.p>=.82?s.copies:2**Math.max(0,s.cycle-1);
  const represent=sceneCount>COUNT_CAP;
  text(sampleText,s.summary?(s.copies>=SUMMARY_CAP?'保留 256 个 DNA 简图 · 实际总量见右侧':'DNA 数量增长 · 简图展示，重复反应过程省略'):represent?'数量较大 · 仅显示部分代表分子':`反应区显示 ${sceneCount} ${s.stage===2||s.stage===3&&s.p<.82?'组模板':'个 DNA'}`);
  text($('visible-count'),s.summary?(s.copies>=SUMMARY_CAP?'左侧保留 256 个简图，实际总量见上':'左侧简图逐轮翻倍，完整分子总量见上'):represent?'反应区为代表分子，实际总量见上':`本轮显示 ${sceneCount} ${s.stage===2||s.stage===3&&s.p<.82?'组模板':'个 DNA'}`);
  if(s.completed!==lastCount){
    $('count-value').textContent=fmt(s.copies);
    historyNodes.forEach((node,i)=>{node.hidden=i>s.completed;node.classList.toggle('current',i===s.completed);});
    $('product-history').scrollTop=$('product-history').scrollHeight;
    lastCount=s.completed;
  }
  $('finish-cycle').disabled=s.stage===4||s.done;
  const key=`${s.stage}:${s.cycle}`;
  if(key!==lastPhase){post('model:stage-changed',{stage:s.stage<0?0:s.stage,stageId:s.stage<0?'initial':STAGES[s.stage].id,cycle:s.cycle});lastPhase=key;requestAnimationFrame(centerSmallView);}
  labExperience?.sync();
}
function render(force=false){
  current=stateAt(timeline,time);renderMolecules(current);if(manualViewBox)svg.setAttribute('viewBox',manualViewBox);
  const h=(current.temp-20)*SCENE.thermometer.units;set(mercury,'y',SCENE.thermometer.bottom-h);set(mercury,'height',h);text(thermoValue,Math.round(current.temp)+'°C');
  if(force||Math.abs(time-lastUi)>.08){updateUi(current);lastUi=time;}
  if(performance.now()-lastSent>350&&playing){post('model:progress',statePayload());lastSent=performance.now();}
}
function controlButtons(){
  shell.setControl(document.querySelector('[data-action="play"]'),'play',playing?'暂停':current.done?'重播':'播放');
  shell.setControl(document.querySelector('[data-action="speed"]'),'speed',speed+'×');
  shell.setControl(document.querySelector('[data-action="labels"]'),'labels','标签',labels);
}
function tick(now){
  if(!playing){raf=0;return;}
  if(lastFrame&&now-lastFrame<1000/60){raf=requestAnimationFrame(tick);return;}
  const dt=lastFrame?Math.min((now-lastFrame)/1000,.1):0;lastFrame=now;
  time=Math.min(timeline.duration,time+dt*speed);render();
  if(time>=timeline.duration){playing=false;render(true);controlButtons();post('model:state',statePayload());raf=0;return;}
  raf=requestAnimationFrame(tick);
}
function setPlaying(value){
  if(value&&time>=timeline.duration)time=0;
  playing=Boolean(value);lastFrame=0;
  if(playing&&!raf)raf=requestAnimationFrame(tick);
  if(!playing&&raf){cancelAnimationFrame(raf);raf=0;}
  render(true);controlButtons();post('model:state',statePayload());
}
function seek(t){time=clamp(t,0,timeline.duration);render(true);controlButtons();requestAnimationFrame(centerSmallView);post('model:state',statePayload());}
function goStage(i){setPlaying(false);seek(stageTime(timeline,i,Math.max(1,current.cycle)));}
function reset(){manualViewBox=null;labExperience?.view.fit();setPlaying(false);seek(0);$('input-feedback').textContent=`已重置；计划 ${timeline.cycles} 轮。`;}
function updateTarget(){
  $('target-count').textContent=fmt(2**timeline.cycles);$('target-formula').textContent=`1 × 2^${timeline.cycles}`;$('repeat-count').textContent=timeline.cycles;$('jump-cycle').max=timeline.cycles;
}
function validateInput(id){const field=$(id),n=Number(field.value);const ok=validCycles(n)&&(id!=='jump-cycle'||n<=timeline.cycles);field.setAttribute('aria-invalid',String(!ok));$('input-feedback').classList.toggle('error',!ok);if(!ok)$('input-feedback').textContent=id==='jump-cycle'?`请输入 1–${timeline.cycles} 的整数轮次。`:'循环数须为 1–40 的整数。';return ok?n:null;}
$('apply-cycles').addEventListener('click',()=>{const n=validateInput('cycles-input');if(n===null)return;setPlaying(false);timeline=buildTimeline(n);updateTarget();lastCount=-1;reset();});
$('jump-button').addEventListener('click',()=>{const n=validateInput('jump-cycle');if(n===null)return;setPlaying(false);seek(stageTime(timeline,1,n));$('input-feedback').textContent=`已定位第 ${n} 轮。`;});
$('finish-cycle').addEventListener('click',()=>{timeline=stopAfterCycle(timeline,current);updateTarget();$('cycles-input').value=timeline.cycles;$('input-feedback').classList.remove('error');$('input-feedback').textContent=`完成第 ${timeline.cycles} 轮后进入最后延伸。`;render(true);});
$('timeline').addEventListener('input',()=>{const target=Number($('timeline').value)/1000*timeline.duration;setPlaying(false);seek(target);});
function centerSmallView(){ /* Framing is now handled by the viewport camera. */ }
function positionThermometer(){
  const panel=document.querySelector('.temperature-panel');
  if(innerWidth<=860){panel.style.removeProperty('left');panel.style.removeProperty('top');return;}
  const region=document.querySelector('.reaction-visual').getBoundingClientRect();
  const r=document.querySelector('#reaction-chamber').getBoundingClientRect();
  const {width,height}=panel.getBoundingClientRect();
  // Reposition only on layout/view changes. The chamber can be letterboxed
  // inside a wide canvas, so its actual edge is the instrument's anchor.
  const right=view==='focus'?region.right-98:r.right;
  const center=view==='focus'?region.top+region.height*.58:r.top+r.height/2+28;
  panel.style.left=Math.min(region.width-width,right-region.left+10)+'px';
  panel.style.top=clamp(center-region.top-height/2,24,Math.max(24,region.height-height-6))+'px';
}
function setView(value){manualViewBox=null;labExperience?.view.fit();view=value;const focused=view==='focus';if(!focused)svg.setAttribute('viewBox',`0 0 ${SCENE.width} ${SCENE.height}`);svg.classList.toggle('focus-mode',focused);document.querySelector('.scene-viewport').classList.toggle('focused',focused);render(true);document.querySelector('.model-stage').scrollTop=0;requestAnimationFrame(()=>{centerSmallView();positionThermometer();});post('model:state',statePayload());}
document.querySelector('.model-area').addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
  if(action==='play')setPlaying(!playing);
  if(action==='reset')reset();
  if(action==='prev'||action==='next'){setPlaying(false);const index=clamp(current.index+(action==='next'?1:-1),0,timeline.segments.length-1);seek(timeline.segments[index].start);}
  if(action==='speed'){const speeds=[.5,1,2,4,8];speed=speeds[(speeds.indexOf(speed)+1)%speeds.length];controlButtons();post('model:state',statePayload());}
  if(action==='labels'){labels=!labels;for(const canvas of [svg,$('temperature-scene')])canvas.classList.toggle('hide-labels',!labels);controlButtons();post('model:state',statePayload());}
  
});

function statePayload(){return {playing,speed,labels,highlight,view,stage:Math.max(0,current.stage),stageId:current.stage<0?'initial':STAGES[current.stage].id,cycle:current.cycle,completedCycles:current.completed,totalCopies:current.copies,plannedCycles:timeline.cycles,progress:current.progress,temperature:current.temp,time,duration:timeline.duration,done:current.done};}
function post(type,payload,requestId){if(window.parent===window)return;const msg={source:'ander-model',protocolVersion:'1.0',modelId:'pcr',type,payload};if(requestId!==undefined)msg.requestId=requestId;window.parent.postMessage(msg,hostOrigin);}
window.addEventListener('message',e=>{
  const m=e.data;if(e.source!==window.parent||window.parent===window||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!=='pcr'||!m.payload||typeof m.payload!=='object'||Array.isArray(m.payload))return;
  if(hostOrigin!=='*'&&e.origin!==hostOrigin)return;
  if(e.origin!=='null')hostOrigin=e.origin;
  try{
    const p=m.payload;
    switch(m.type){
      case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()},m.requestId);break;
      case 'host:play':setPlaying(true);break;
      case 'host:pause':setPlaying(false);break;
      case 'host:reset':reset();break;
      case 'host:set-stage':{const value=p.stageId??p.stage??p.stageIndex;const n=typeof value==='string'?STAGES.findIndex(s=>s.id===value):value;if(!Number.isInteger(n)||n<0||n>4)throw new Error('无效的阶段');goStage(n);break;}
      case 'host:set-speed':if(!Number.isFinite(p.speed)||p.speed<.25||p.speed>8)throw new Error('无效的播放速度');speed=p.speed;controlButtons();break;
      case 'host:set-labels':{const value=p.visible??p.enabled;if(typeof value!=='boolean')throw new Error('标签状态须为布尔值');labels=value;for(const canvas of [svg,$('temperature-scene')])canvas.classList.toggle('hide-labels',!labels);controlButtons();break;}
      case 'host:set-highlight':if(typeof p.enabled!=='boolean')throw new Error('聚焦状态须为布尔值');highlight=p.enabled;render(true);break;
      case 'host:set-view':{const value=p.viewId??p.view;if(!['overview','focus'].includes(value))throw new Error('无效的视角');setView(value);break;}
      default:return;
    }
    render(true);post('model:state',statePayload(),m.requestId);
  }catch(error){post('model:error',{code:'INVALID_COMMAND',message:error.message},m.requestId);}
});
window.PCRModel=Object.freeze({getState:()=>({...statePayload(),phaseProgress:current.p,physicalSeconds:current.physicalSeconds}),seek,play:()=>setPlaying(true),pause:()=>setPlaying(false)});
let smallView=innerWidth<=860;
new ResizeObserver(()=>requestAnimationFrame(positionThermometer)).observe(document.querySelector('.reaction-visual'));
updateTarget();render(true);controlButtons();setView('overview');
post('model:ready',{manifest:ANDER_MODEL_MANIFEST,...statePayload()});


labExperience=mountLabShell({manifest:ANDER_MODEL_MANIFEST,getState:statePayload,post,onOverview(){manualViewBox=null;setView('overview');},onFollow(){manualViewBox=null;setView('focus');},onManual(){manualViewBox??=svg.getAttribute('viewBox');},onResize:positionThermometer});
