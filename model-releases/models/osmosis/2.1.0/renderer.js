import{scene}from'./scene.js';
import{funnelHalfWidth,liquidPalette,liquids,crossingPose,clamp}from'./engine.js';
import{brownianTransform}from'./brownian.js';
const NS='http://www.w3.org/2000/svg';
const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const attr=(e,k,v)=>{const value=typeof v==='number'?String(Math.round(v*10000)/10000):String(v);if(e.getAttribute(k)!==value)e.setAttribute(k,value)};
const text=(e,v)=>{if(e.textContent!==v)e.textContent=v};
const use=(id,parent)=>{const e=document.createElementNS(NS,'use');e.setAttribute('href','#'+id);parent.append(e);return e};
export class OsmosisRenderer{
 constructor(host,initial){
  this.host=host;host.innerHTML=scene({...initial,stage:1,direction:1},true);
  this.svg=host.querySelector('svg');const q=s=>this.svg.querySelector(s),qa=s=>[...this.svg.querySelectorAll(s)];
  this.gradient=Object.fromEntries(['waterFill','waterSurface','solutionFill','microTop','microBottom'].map(id=>[id,qa('#'+id+' stop')]));
  const exterior=qa('.apparatus > g[clip-path="url(#beakerClip)"]');
  this.out=[...exterior[0].children];this.veil=[...exterior[1].children];this.inn=[...q('.funnel > g[clip-path]').children];
  this.height=q('.height-difference');this.h=[...this.height.children];this.equality=q('.level-equality');this.description=q('#scene-desc');
  this.labels=q('.labels');this.names=qa('.labels .structure-label');this.leaders=qa('.labels .leader');
  this.regions=qa('.region-label');this.readout=qa('.flux-readout .flow-value');this.readoutLabels=qa('.flux-readout .small-label');
  text(this.readoutLabels[0],'外 → 内 · 近3秒');text(this.readoutLabels[1],'内 → 外 · 近3秒');
  this.arrows=qa('.crossing-traces path');this.particles=[];
  this.ranked=Array.from({length:40},(_,j)=>j).sort((a,b)=>rand(a+313)-rand(b+313));
  for(let side=0;side<2;side++){
   const parent=q('.particle-region[data-side="'+(side?'outside':'inside')+'"]');
   for(const kind of['water','sucrose'])for(let j=0;j<(kind==='water'?40:28);j++){
    const slot=kind==='water'?j:this.ranked[j],r=Math.floor(slot/10),c=slot%10,n=side*83+slot;
    const x=830+c*56+rand(n)*15,y=(side?346:150)+r*31+rand(n+90)*10;
    const node=use(kind,parent),scale=kind==='water'?.96:.86;
    const descriptor={dataset:{baseX:x,baseY:y,phase:rand(n+20)*9,phaseB:rand(n+3)*5,speed:.1,rangeX:16,rangeY:9,jitter:.3,spin:kind==='water'?.4:.15,
     minX:Math.max(815,x-17),maxX:Math.min(1384,x+17),minY:Math.max(side?335:138,y-10),maxY:Math.min(side?472:263,y+10)}};
    this.particles.push({node,side,kind,j,slot,descriptor,scale,active:true});
   }
  }
  this.crossLayer=q('.crossing-molecules');this.crossNodes=Array.from({length:32},()=>{const node=use('water',this.crossLayer);node.classList.add('transiting-water');attr(node,'opacity',0);return node});
  this.nodeCount=qa('*').length;this.lastCondition='';this.visibleCrossings=[];
 }
 setExperiment(exp){
  this.exp=exp;this.lastCondition='';
  for(const p of this.particles){const initial=liquids[p.side?exp.outside:exp.inside].concentration;const reserved=new Set(this.ranked.slice(0,Math.round(initial*9)));p.active=p.kind!=='water'||!reserved.has(p.slot);}
 }
 draw(state,labels=true,view='overview'){
  const{inner:i,outer:o}=state,inn=liquidPalette(state.ci),ext=liquidPalette(state.co),radius=funnelHalfWidth(i);
  const destinations={waterFill:[ext.top,ext.mid,ext.bottom],waterSurface:[ext.light,ext.surface],solutionFill:[inn.top,inn.mid,inn.bottom],microTop:['#fdfefc',inn.light],microBottom:[ext.light,'#fbfdfa']};
  for(const[id,colors]of Object.entries(destinations))colors.forEach((color,j)=>attr(this.gradient[id][j],'stop-color',color));
  attr(this.out[0],'d',`M168 ${o} C168 ${o+31} 512 ${o+31} 512 ${o} V510 C512 550 168 550 168 510Z`);
  attr(this.out[1],'cy',o);attr(this.out[1],'stroke',ext.edge);
  attr(this.out[2],'d',`M175 ${o-2} C189 ${o-27} 489 ${o-27} 504 ${o-2}`);
  for(const e of this.inn.slice(0,2)){attr(e,'y',i);attr(e,'height',490-i)}
  attr(this.inn[2],'cy',i);attr(this.inn[2],'rx',radius);attr(this.inn[2],'ry',Math.max(3.5,radius*.14));attr(this.inn[2],'fill',inn.surface);attr(this.inn[2],'stroke',inn.edge);
  attr(this.inn[3],'d',`M${331-radius} ${i-1} Q330 ${i+Math.max(3,radius*.13)} ${329+radius} ${i-1}`);
  attr(this.veil[0],'y',o+7);attr(this.veil[1],'d',`M175 ${o+5} C204 ${o+30} 481 ${o+30} 505 ${o+5}`);
  attr(this.height,'opacity',state.time===0||!state.direction?0:1);
  attr(this.h[0],'d',`M${339+radius} ${i}H564 M517 ${o}H564 M553 ${i}V${o}`);
  attr(this.h[1],'d',`M548 ${Math.min(i,o)+6} L553 ${Math.min(i,o)} L558 ${Math.min(i,o)+6} M548 ${Math.max(i,o)-6} L553 ${Math.max(i,o)} L558 ${Math.max(i,o)-6}`);
  attr(this.h[2],'y',(i+o)/2+7);attr(this.h[3],'y',(i+o)/2+30);
  attr(this.equality,'opacity',state.time===0||!state.direction?1:0);text(this.equality,state.time===0?'初始液面齐平':'液面保持齐平');
  attr(this.labels,'opacity',labels?1:0);const pointerY=Math.min(466,Math.max(418,i+20));attr(this.leaders[2],'d',`M142 383H206L${340-funnelHalfWidth(pointerY)} ${pointerY}`);
  text(this.names[2],state.insideName);text(this.names[3],state.outsideName);this.names[2].style.fill=inn.text;this.names[3].style.fill=ext.text;
  text(this.regions[0],'漏斗内 · '+state.insideName);text(this.regions[1],'漏斗外 · '+state.outsideName);attr(this.regions[0],'fill',inn.text);attr(this.regions[1],'fill',ext.text);
  text(this.description,`漏斗内为${state.insideName}，漏斗外为${state.outsideName}。底部半透膜用扎带固定；放大图上方对应漏斗内，下方对应漏斗外。水可双向通过，蔗糖不能通过。${state.note}`);
  const counts=this.exp.counts(state.time);text(this.readout[0],counts.up+' 次');text(this.readout[1],counts.down+' 次');text(this.readout[2],state.net);
  for(const p of this.particles){
   const opacity=p.kind==='water'?(p.active?1:0):clamp((p.side?state.co:state.ci)*9-p.j,0,1);
   attr(p.node,'opacity',opacity);if(opacity>0)attr(p.node,'transform',brownianTransform(p.descriptor,state.time,.16)+` scale(${p.scale})`);
  }
  const visible=this.exp.events.filter(e=>Math.abs(state.time-e.crossing)<=1.2);
  this.visibleCrossings=[];
  // Keep each visible molecule on one DOM node throughout its crossing.
  // Fewer than 16 events can overlap; the 32 slots cannot collide.
  const active=new Set(visible.map(e=>e.id%this.crossNodes.length));
  this.crossNodes.forEach((node,j)=>{if(!active.has(j))attr(node,'opacity',0)});
  for(const e of visible){
   const node=this.crossNodes[e.id%this.crossNodes.length];
   const p=crossingPose(e,state.time);attr(node,'opacity',p.opacity);attr(node,'transform',`translate(${p.x} ${p.y}) rotate(${p.rotation}) scale(1.13)`);attr(node,'data-event',e.id);attr(node,'data-direction',e.direction);
   this.visibleCrossings.push({id:e.id,direction:e.direction,...p});
  }
  for(const a of this.arrows){const sign=a.dataset.direction==='up'?1:-1;attr(a,'opacity',state.time===0?0:.42+state.drive*sign*.16);attr(a,'stroke-width',2+state.drive*sign*.4)}
  const boxes={overview:'0 0 1440 610',apparatus:'0 0 685 610',membrane:'778 0 645 610'};
  attr(this.svg,'viewBox',boxes[view]);this.host.dataset.view=view;
 }
 getDiagnostics(){return{nodeCount:this.nodeCount,currentNodeCount:this.svg.querySelectorAll('*').length,crossings:this.visibleCrossings};}
}
