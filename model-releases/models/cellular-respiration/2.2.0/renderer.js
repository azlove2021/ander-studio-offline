import {reactionScene,MOTION} from './scene.js';
import {smooth,clamp} from './engine.js';
const ns='http://www.w3.org/2000/svg';
const intervals=el=>el.split(',').map(Number);
const attr=(el,key,value)=>{const text=String(value);if(el.getAttribute(key)!==text)el.setAttribute(key,text)};
const stageOpacity=(s,n)=>1-(n<s.stage?.38*smooth(s.time,n===0?11:26,(n===0?11:26)+.8):0)*(1-smooth(s.time,s.duration-2,s.duration));
export class RespirationRenderer{
 constructor(svg){
  this.svg=svg;svg.querySelector('#reaction-overlay').innerHTML=reactionScene();
  this.reveals=[...svg.querySelectorAll('[data-reveal]')].map(el=>({el,t:intervals(el.dataset.reveal)}));
  this.windows=[...svg.querySelectorAll('[data-window]')].map(el=>({el,t:intervals(el.dataset.window)}));
  this.groups=[...svg.querySelectorAll('[data-mode-group]')];
  this.stageGroups=[...svg.querySelectorAll('[data-stage-group]')];
  this.paths=[...svg.querySelectorAll('[data-draw]')].map((el,i)=>{
   const length=el.getTotalLength(),t=intervals(el.dataset.draw);
   const mask=document.createElementNS(ns,'mask');mask.id='draw-mask-'+i;
   for(const[k,v]of Object.entries({maskUnits:'userSpaceOnUse',x:-100,y:-100,width:2000,height:1100}))mask.setAttribute(k,v);
   const stroke=document.createElementNS(ns,'path');stroke.setAttribute('d',el.getAttribute('d'));stroke.setAttribute('fill','none');stroke.setAttribute('stroke','white');stroke.setAttribute('stroke-width','52');stroke.setAttribute('stroke-linecap','butt');stroke.setAttribute('stroke-dasharray',`${length} ${length}`);
   mask.append(stroke);svg.querySelector('defs').append(mask);el.setAttribute('mask',`url(#${mask.id})`);
   return{el,t,length,stroke};
  });
  this.materials=Object.fromEntries(Object.entries(MOTION).map(([key,definition])=>[key,{
   el:svg.querySelector(`[data-material="${key}"]`),record:svg.querySelector(`[data-material-record="${key}"]`),origin:definition.origin,
   routes:Object.fromEntries(Object.keys(definition).filter(mode=>mode!=='origin').map(mode=>{
    const path=svg.querySelector(`#motion-${key}-${mode}`);return[mode,{path,length:path.getTotalLength()}];
   }))
  }]));
  for(const material of Object.values(this.materials)){const box=material.record.querySelector('rect');material.size=[Number(box.getAttribute('width')),Number(box.getAttribute('height'))];}
  this.labels=svg.querySelector('#structure-labels');this.ethanolNote=svg.querySelector('#ethanol-step-note');
  this.nodeCount=svg.querySelectorAll('*').length;this.mode=null;this.view=null;
 }
 placeMaterial(key,mode,progress,opacity,scale=1,merge=0){
  const material=this.materials[key],route=material.routes[mode];
  const point=route?route.path.getPointAtLength(route.length*clamp(progress)):{x:material.origin[0],y:material.origin[1]};
  // The original card, including its label and outline, travels as one SVG node.
  // [H] is a reducing-power symbol; merging into 24[H] is not membrane diffusion.
  const x=point.x+(951-point.x)*merge,y=point.y+(783-point.y)*merge;
  const [ox,oy]=material.origin;
  attr(material.el,'transform',`translate(${x} ${y}) scale(${scale}) translate(${-ox} ${-oy})`);
  attr(material.el,'opacity',opacity);attr(material.el,'aria-hidden',opacity===0);
  material.position={x,y,scale,opacity};
 }
 drawMaterials(s){
  const t=s.time,aerobic=s.mode==='aerobic',lactate=s.mode==='lactate';
  const pyruvateOpacity=smooth(t,4.5,6.5)*(aerobic?1:1-smooth(t,lactate?18.2:16,lactate?19:16.5));
  this.placeMaterial('pyruvate',s.mode,smooth(t,11.5,16),pyruvateOpacity);
  if(aerobic){
   const merge=smooth(t,30.4,31.1),visibility=1-smooth(t,30.45,31.1);
   for(const[key,start,appear,end]of[['cytoH',26,6.4,8.2],['matrixH',26.6,21.5,23.5]]){
    const progress=smooth(t,start,30.4),scale=(1-.54*smooth(progress,.68,1))*(1-.65*merge);
    this.placeMaterial(key,'aerobic',progress,smooth(t,appear,end)*visibility,scale,merge);
   }
  }else{
   const start=lactate?17.5:21,end=lactate?20.5:24,progress=smooth(t,start,end);
   this.placeMaterial('cytoH',s.mode,progress,smooth(t,6.4,8.2)*(1-smooth(t,end,end+1)),1-.58*smooth(progress,.65,1));
   this.placeMaterial('matrixH',s.mode,0,0);
  }
 }
 drawRecords(s){
  for(const[key,material]of Object.entries(this.materials)){
   const [ox,oy]=material.origin,[width,height]=material.size,{x,y}=material.position;
   // Reveal the fixed record only once the moving card clears its source,
   // avoiding doubled text while preserving the complete reaction afterwards.
   const separation=Math.max(Math.abs(x-ox)/width,Math.abs(y-oy)/height);
   const visible=(key!=='matrixH'||s.mode==='aerobic')?smooth(separation,1,1.3)*stageOpacity(s,key==='matrixH'?1:0):0;
   attr(material.record,'opacity',visible);attr(material.record,'aria-hidden',visible===0);
   material.recordOpacity=visible;
  }
 }
 draw(s,labels,view){
  if(s.mode!==this.mode){this.groups.forEach(el=>{const active=el.dataset.modeGroup===s.mode;el.style.display=active?'':'none';el.setAttribute('aria-hidden',String(!active))});this.mode=s.mode;}
  const t=s.time;
  for(const{el,t:[a,b]}of this.reveals){const value=smooth(t,a,b);attr(el,'opacity',value);attr(el,'aria-hidden',value===0);}
  for(const{el,t:[a,b,c,d]}of this.windows)attr(el,'opacity',smooth(t,a,b)*(1-smooth(t,c,d)));
  for(const{el,t:[a,b],length,stroke}of this.paths){const p=smooth(t,a,b);attr(stroke,'stroke-dashoffset',length*(1-p));attr(el,'opacity',p>0?1:0);el.style.markerEnd=p>.995?'':'none';}
  this.drawMaterials(s);
  this.drawRecords(s);
  // Completed stages remain as a reaction record; no disappearance of upstream work.
  for(const el of this.stageGroups)attr(el,'opacity',stageOpacity(s,Number(el.dataset.stageGroup)));
  this.labels.style.display=labels?'':'none';
  const note=t<22?'丙酮酸脱羧，形成乙醛并释放 CO₂':'乙醛接受还原力，转变为乙醇';
  if(this.ethanolNote.textContent!==note)this.ethanolNote.textContent=note;
  if(view!==this.view){this.view=view;this.svg.setAttribute('viewBox',({overview:'0 0 1792 896',cytosol:'160 190 640 630',mitochondrion:'815 185 940 690'})[view]);this.svg.closest('.science-world').dataset.view=view;}
 }
 getDiagnostics(){return{nodeCount:this.nodeCount,liveNodeCount:this.svg.querySelectorAll('*').length,image:'assets/cell-mitochondrion.webp',imageInvariant:true,view:this.view,materials:Object.fromEntries(Object.entries(this.materials).map(([key,value])=>[key,{...value.position,recordOpacity:value.recordOpacity}]))}};
}
