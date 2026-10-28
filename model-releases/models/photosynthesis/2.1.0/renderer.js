import {clamp,smooth,windowAt,OFFSETS} from './engine.js';
const ns='http://www.w3.org/2000/svg';
const attr=(node,key,value)=>{const text=String(value);if(node.getAttribute(key)!==text)node.setAttribute(key,text);};
const firstWindow=(time,start,end)=>smooth(time,start,end);
export class PhotosynthesisRenderer{
 constructor(svg){
  this.svg=svg;this.defs=svg.querySelector('defs');this.layer=svg.querySelector('#material-layer');this.labels=svg.querySelector('#structure-labels');this.note=svg.querySelector('#conversion-note');this.view=null;
  this.records=Object.fromEntries(['water','oxygen','co2','c3','c5','triose','sugar','atp','nadph','adp','nadp'].map(id=>[id,svg.querySelector('#'+id+'-record')]));
  this.routes={};
  // Reuse the accepted respiration draw-mask method: dashed scientific paths
  // are revealed in their forward direction; their arrows appear at arrival.
  for(const id of ['light','water','oxygen','nadph','atp','adp','nadp','fixation','reduction','regeneration','co2','sugar']){
   const node=svg.querySelector('#'+id+'-path'),length=node.getTotalLength();
   const mask=document.createElementNS(ns,'mask');mask.id='flow-mask-'+id;
   for(const[k,v]of Object.entries({maskUnits:'userSpaceOnUse',x:-50,y:-50,width:1900,height:1000}))mask.setAttribute(k,v);
   const stroke=document.createElementNS(ns,'path');
   for(const[k,v]of Object.entries({d:node.getAttribute('d'),fill:'none',stroke:'white','stroke-width':32,'stroke-linecap':'butt','stroke-dasharray':`${length} ${length}`}))stroke.setAttribute(k,v);
   mask.append(stroke);this.defs.append(mask);node.setAttribute('mask',`url(#${mask.id})`);node.classList.add('scientific-flow');
   this.routes[id]={node,length,stroke};
  }
  this.tokens={};
  // Formula cards, not generic dots. All instances exist once; frames only
  // change position/opacity. Supply records are replenished after transfer.
  for(const [id,record]of Object.entries(this.records)){
   if(['c5','triose','sugar'].includes(id))continue;
   const node=record.cloneNode(true);node.id='moving-'+id;node.classList.add('moving-material');
   const rect=node.querySelector('rect'),w=rect?Number(rect.getAttribute('width')):76,h=rect?Number(rect.getAttribute('height')):76;
   const origin=rect?[w/2,h/2]:[0,0];
   node.removeAttribute('transform');node.setAttribute('opacity','0');this.layer.append(node);
   this.tokens[id]={node,w,h,origin,position:{x:0,y:0,opacity:0}};
  }
  const makeMotion=(id,d)=>{const p=document.createElementNS(ns,'path');p.id='motion-'+id;p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke','none');this.defs.append(p);this.routes[id]={node:p,length:p.getTotalLength(),motionOnly:true};};
  makeMotion('water-move','M303.5 315.5Q361 318 434 376');
  makeMotion('oxygen-move','M617 333Q687 272 782 275.5');
  makeMotion('co2-move','M1601.5 318.5C1532 314 1487 319 1430 332');
  makeMotion('carbon-move','M1220 332C1115 407 1134 531 1201 620');
  this.c3Substrate=this.tokens.c3.node.querySelector('text');
  this.carbonName=svg.querySelector('.carbon-name');this.stepLabels=[...svg.querySelectorAll('.cycle-step')];
  this.recordPositions=Object.fromEntries(Object.entries(this.records).map(([id,record])=>{const matrix=record.transform.baseVal.consolidate()?.matrix,rect=record.querySelector('rect');return[id,{x:(matrix?.e||0)+(rect?Number(rect.getAttribute('width'))/2:0),y:(matrix?.f||0)+(rect?Number(rect.getAttribute('height'))/2:0)}];}));
  this.nodeCount=svg.querySelectorAll('*').length;
 }
 route(id,amount,flowTime,active){
  const p=this.routes[id],value=clamp(amount);
  attr(p.node,'opacity',value>0?1:0);attr(p.stroke,'stroke-dashoffset',p.length*(1-value));
  // A negative offset advances dashes from path start to end, including all
  // right-to-left return paths whose geometry is authored in that direction.
  attr(p.node,'stroke-dashoffset',-flowTime*22);
  p.node.style.markerEnd=value>.995?'':'none';p.node.style.strokeOpacity=active?'1':'.82';
  p.progress=value;p.active=active;
 }
 token(id,routeId,progress,opacity){
  const token=this.tokens[id],route=this.routes[routeId],p=route.node.getPointAtLength(route.length*clamp(progress));
  attr(token.node,'transform',`translate(${p.x-token.origin[0]} ${p.y-token.origin[1]})`);
  attr(token.node,'opacity',opacity);attr(token.node,'aria-hidden',opacity<=0);
  token.position={x:p.x,y:p.y,opacity,scale:1};
 }
 draw(state,labels,view){
  const t=state.time;
  const pulseTime=t%10;
  const reveal=(id,a,b)=>firstWindow(t,a,b);
  // After each transfer, restore the midpoint supply record. Fade it out
  // before the next traveling card enters; distinct substrates and products
  // are independent and can coexist throughout the reaction.
  const supply=(entry,exit)=>Math.max(...OFFSETS.map((offset,i)=>
   smooth(t-offset,exit,exit+.6)*(i+1<OFFSETS.length?1-smooth(t,OFFSETS[i+1]+entry-.6,OFFSETS[i+1]+entry):1)));
  const carbonConvertedAt=19.1;
  const visible={
   water:pulseTime<=2?1:smooth(pulseTime,5.4,6),
   co2:t<=9?1:t<=33?smooth(t,31.6,32.2):0,
   c5:1,
   oxygen:pulseTime>=8?1:t>=10?1-smooth(pulseTime,3.8,4.4):0,
   nadph:supply(4,13.5),atp:supply(4.6,14.1),adp:supply(16.2,25),nadp:supply(16.6,25.5),
   c3:smooth(t,10,14)*OFFSETS.reduce((opacity,offset)=>opacity*(t-offset<=16?1:smooth(t-offset,carbonConvertedAt,carbonConvertedAt+.6)),1),
   triose:reveal('triose',22,23),sugar:reveal('sugar',25,29)
  };
  const schedule={light:[.4,1.2,1,54],water:[1.2,2.8,1.2,54],oxygen:[4.4,7.6,4.4,54],nadph:[7,13,7,21],atp:[7.6,13.6,7.6,27],co2:[9,11.7,9,14],fixation:[10,14,10,14],reduction:[16,21,16,21],adp:[16.6,23.6,16.6,25],nadp:[17,24,17,25.5],regeneration:[24,28,24,28],sugar:[25,29,25,29]};
  for(const [id,[a,b,start,end]] of Object.entries(schedule)){
   const continuous=['water','light','oxygen'].includes(id);
   const active=continuous?state.lightActive:OFFSETS.some(offset=>t-offset>=start&&t-offset<end);
   const flowTime=continuous?clamp(t-start,0,54-start):OFFSETS.reduce((sum,offset)=>sum+clamp(t-offset-start,0,end-start),0);
   this.route(id,smooth(t,a,b),flowTime,active);
  }
  const hide=state.completed?0:1;
  this.token('water','water-move',smooth(pulseTime,2,4.4),windowAt(pulseTime,1.4,2,4.3,5.2)*hide);
  this.token('oxygen','oxygen-move',smooth(pulseTime,5,8),windowAt(pulseTime,4.4,5,8.1,9)*hide);
  // Finish each entrance fade before movement begins. Returning products are
  // generated during reduction, and travel in their own lower lanes.
  const lifetimes={co2:['co2-move',9,12.2,8.4,9,12.1,13.1],nadph:['nadph',7,13,4,6,12.4,13.5],atp:['atp',7.6,13.6,4.6,6.6,13,14.1],adp:['adp',16.6,23.6,16.2,16.6,23.6,25],nadp:['nadp',17,24,16.6,17,24,25.5],c3:['carbon-move',16,21,15.5,16,21,22]};
  const localTimes={};
  for(const [id,[path,a,b,c,d,e,f]] of Object.entries(lifetimes)){
   const candidates=OFFSETS.map(offset=>({u:t-offset,opacity:windowAt(t-offset,c,d,e,f)})).sort((left,right)=>right.opacity-left.opacity);
   const chosen=candidates[0];localTimes[id]=chosen.u;this.token(id,path,smooth(chosen.u,a,b),chosen.opacity*hide);
  }
  const reduction=smooth(localTimes.c3,17.8,20.4);
  // Only the identity changes during the actual carbon reaction; its size and
  // visual template stay identical to the stationary C3 node.
  const carbonLabel=reduction<.5?'C₃':'G3P';
  if(this.c3Substrate.textContent!==carbonLabel)this.c3Substrate.textContent=carbonLabel;
  attr(this.c3Substrate,'opacity',reduction<.5?1-smooth(reduction,.3,.5):smooth(reduction,.5,.7));
  // C3 and G3P are different identities. Only a moving G3P replaces the
  // existing triose product record; incoming C3 does not erase that product.
  visible.triose*=OFFSETS.reduce((opacity,offset)=>opacity*(1-windowAt(t-offset,carbonConvertedAt-.6,carbonConvertedAt,22,23)),1);
  if(state.completed)for(const id of Object.keys(visible))visible[id]=1;
  // Same-identity cards hand off one at a time, while C3 may be replenished
  // beside its converted G3P successor. Exact coincident handoffs paint once.
  for(const[id,record]of Object.entries(this.records)){
   let opacity=visible[id];const token=this.tokens[id];
   const sameIdentity=id!=='c3'||carbonLabel==='C₃';
   if(token&&sameIdentity&&token.position.opacity>0){
    const {x:cx,y:cy}=this.recordPositions[id],dx=Math.abs(token.position.x-cx),dy=Math.abs(token.position.y-cy);
    const coincident=dx<.001&&dy<.001;
    if(coincident){
     opacity=Math.max(opacity,token.position.opacity);
     attr(token.node,'opacity',0);attr(token.node,'aria-hidden',true);token.position.opacity=0;
    }else opacity=0;
   }
   attr(record,'opacity',opacity);attr(record,'aria-hidden',opacity<=0);
  }
  // Transformed products change shape/label in the moving carbon node; fixed
  // records become visible only when the corresponding conversion has occurred.
  this.carbonName.style.opacity=String(visible.c3);
  this.stepLabels.forEach((node,i)=>attr(node,'opacity',smooth(t,[9,15,23][i],[10,16,24][i])));
  this.labels.style.display=labels?'':'none';
  if(this.note.textContent!==state.conversion)this.note.textContent=state.conversion;
  if(view!==this.view){this.view=view;this.svg.setAttribute('viewBox',({overview:'0 0 1792 896',light:'65 190 1060 600',calvin:'755 185 960 650'})[view]);this.svg.closest('.science-world').dataset.view=view;}
  this.lastState=state;
 }
 getDiagnostics(){return{nodeCount:this.nodeCount,liveNodeCount:this.svg.querySelectorAll('*').length,view:this.view,artwork:'assets/chloroplast.webp',routes:Object.fromEntries(Object.entries(this.routes).filter(([,v])=>!v.motionOnly).map(([k,v])=>[k,{progress:v.progress,active:v.active,d:v.node.getAttribute('d'),dashOffset:Number(v.node.getAttribute('stroke-dashoffset')),arrowVisible:v.node.style.markerEnd!=='none'}])),materials:Object.fromEntries(Object.entries(this.tokens).map(([id,v])=>[id,v.position]))};}
}
