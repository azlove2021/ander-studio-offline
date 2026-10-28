import {clamp,smooth,feature,sample} from './physiology.js';

// Display pacing is independent of the physiological model's time constants.
export const lessonDuration=32;

export const recoveryPresentation=Object.freeze({factor:8,rampMs:.35});
export function buildTeachingTrace(raw){
 // The teaching diagram shortens only post-trough recovery. This is a
 // presentation approximation, not a new solution of the cable equations.
 // V/m/h/n are resampled together so both graphs and gates use one state.
 if(raw.kind!=='standard')return raw;
 const values=new Float32Array(raw.values),starts=new Float64Array(raw.N),dt=raw.p.sampleDt;
 const {factor,rampMs}=recoveryPresentation;
 for(let site=0;site<raw.N;site++){
  const at=k=>(k*raw.N+site)*4;
  let peak=0;
  for(let k=1;k<raw.count;k++)if(raw.values[at(k)]>raw.values[at(peak)])peak=k;
  if(raw.values[at(peak)]<=0){starts[site]=Infinity;continue;}
  let trough=peak;
  for(let k=peak+1;k<raw.count;k++)if(raw.values[at(k)]<raw.values[at(trough)])trough=k;
  starts[site]=trough*dt;
  for(let k=trough+1;k<raw.count;k++){
   const age=k*dt-starts[site],u=Math.min(1,age/rampMs);
   // Integral of smoothstep: source-time speed changes smoothly from 1 to 8.
   const advance=age+(factor-1)*(age<rampMs?rampMs*(u**3-.5*u**4):age-rampMs/2);
   const source=Math.min(raw.count-1,(starts[site]+advance)/dt),a=Math.floor(source),b=Math.min(raw.count-1,a+1),mix=source-a;
   for(let d=0;d<4;d++)values[at(k)+d]=raw.values[at(a)+d]+mix*(raw.values[at(b)+d]-raw.values[at(a)+d]);
  }
 }
 return {...raw,values,recoveryPresentation:{...recoveryPresentation,starts,kind:'post-trough-time-compression'}};
}

// Each schematic segment uses one shared teaching sample for its two dipoles,
// channels and probe. Diagram widths are not calibrated physical distances.
const dipoleSpacing=990/27,segmentSpacing=dipoleSpacing*2;
export const diagramLayout=Object.freeze({centres:Object.freeze(Array.from({length:13},(_,i)=>550+(i-6)*segmentSpacing)),
 chargeOffsets:Object.freeze([-dipoleSpacing/2,dipoleSpacing/2]),edgeCentres:Object.freeze({left:55,right:1045}),lowerY:445});
function crossings(trace,x){
 let up=null,down=null;
 for(let i=1;i<trace.count;i++){
  const a=(i-1)*trace.p.sampleDt,b=i*trace.p.sampleDt,va=sample(trace,a,x).v,vb=sample(trace,b,x).v;
  if(up===null&&va<0&&vb>=0)up=a+(b-a)*(-va)/(vb-va);
  if(up!==null&&va>=0&&vb<0){down=a+(b-a)*(-va)/(vb-va);break;}
 }
 if(up===null||down===null)throw Error('A propagated action potential is required for the display layout');
 return {up,down};
}
function nextRepresentative(trace,time,afterX){
 // Leading zero crossing: choose the next representative without modifying V.
 let previous=afterX;
 for(let x=afterX+trace.p.dxCm;x<=trace.p.halfLengthCm;x+=trace.p.dxCm){
  if(sample(trace,time,previous).v>0&&sample(trace,time,x).v<=0){
   let a=previous,b=x;
   for(let i=0;i<48;i++){const mid=(a+b)/2;if(sample(trace,time,mid).v>0)a=mid;else b=mid;}
   return (a+b)/2;
  }
  previous=x;
 }
 throw Error('Leading wavefront is outside the cable domain');
}
export function buildConductionPlan(trace){
 const middle=(diagramLayout.centres.length-1)/2;
 const representatives=[0],windows=[crossings(trace,0)];
 for(let i=1;i<=middle+1;i++){
  const x=nextRepresentative(trace,windows[i-1].down,representatives[i-1]);
  representatives.push(x);windows.push(crossings(trace,x));
 }
 const sites=[...representatives.slice(1,middle+1).reverse().map(x=>-x),0,...representatives.slice(1,middle+1)];
 const start=feature(trace,0).peak.t+trace.p.sampleDt;
 const groups=windows.slice(0,middle+1).map((window,index)=>({index,start:index?windows[index-1].down:start,end:window.down,
  pairs:[{side:'left',source:middle-index,target:middle-index-1},{side:'right',source:middle+index,target:middle+index+1}]}));
 return {sites,representatives,windows,groups,start,end:groups.at(-1).end};
}
export function pairedPolarity(ms,plan,kind='standard'){
 if(kind!=='standard'||ms<plan.windows[0].up||ms>=plan.end)return [];
 const middle=(plan.sites.length-1)/2,index=plan.windows.slice(0,middle+1).findIndex(w=>ms<w.down);
 return index===0?[middle]:[middle-index,middle+index];
}
export function buildTeachingTimeline(trace,plan=buildConductionPlan(trace)){
 const mid=(plan.sites.length-1)/2,central=feature(trace,0),near=feature(trace,plan.sites[mid+1]),middle=feature(trace,plan.sites[mid+3]),far=feature(trace,plan.sites.at(-1));
 return {central,near,middle,far,seconds:[0,1,4,7,13,lessonDuration],
  clockSeconds:[0,1,4,...plan.groups.map((_,i)=>7+18*i/(plan.groups.length-1)),29,31,lessonDuration],
  // Keep the end of the teaching record visible after the wave leaves the field.
  clockMs:[0,trace.p.stimStart,central.peak.t,...plan.groups.map(g=>g.end),22,30,trace.p.duration],jumps:[0,1,5,7.7,14]};
}
export function teachingState(seconds,trace,marks){
 const sec=clamp(seconds,0,lessonDuration),bounds=marks.seconds;
 let stage=bounds.findIndex((v,i)=>i<5&&sec>=v&&sec<bounds[i+1]);if(stage<0)stage=4;
 const clock=marks.clockSeconds;let segment=clock.findIndex((v,i)=>i<clock.length-1&&sec>=v&&sec<clock[i+1]);if(segment<0)segment=clock.length-2;
 const u=(sec-clock[segment])/(clock[segment+1]-clock[segment]);
 const ms=marks.clockMs[segment]+u*(marks.clockMs[segment+1]-marks.clockMs[segment]);
 return {seconds:sec,stage,ms,stim:ms>=trace.p.stimStart&&ms<trace.p.stimEnd,ended:sec>=lessonDuration};
}
export function currentFocus(ms,plan,kind='standard'){
 if(kind!=='standard'||ms<plan.start||ms>=plan.end)return null;
 const group=plan.groups.find(g=>ms<g.end);
 return {...group,progress:clamp((ms-group.start)/(group.end-group.start)),opacity:1};
}
export function currentArc(from,to,lane){
 const y=lane==='inner'?337:236,rx=Math.abs(to-from)/2,ry=Math.min(26,rx),sign=lane==='inner'?1:-1;
 const sweep=(to>from)===(lane!=='inner')?1:0;
 return {from,to,y,rx,ry,sign,sweep,d:`M${from} ${y} A${rx} ${ry} 0 0 ${sweep} ${to} ${y}`};
}
export function clockSecondsAt(ms,marks){
 const t=clamp(ms,marks.clockMs[0],marks.clockMs.at(-1));
 let i=marks.clockMs.findIndex((v,j)=>j<marks.clockMs.length-1&&t>=v&&t<marks.clockMs[j+1]);
 if(i<0)i=marks.clockMs.length-2;
 const u=(t-marks.clockMs[i])/(marks.clockMs[i+1]-marks.clockMs[i]);
 return marks.clockSeconds[i]+u*(marks.clockSeconds[i+1]-marks.clockSeconds[i]);
}
export const motion=Object.freeze({currentEnterSeconds:.32,currentExitSeconds:.24,chargeFadeSeconds:.22,dashUnitsPerSecond:52});
export function currentWindow(seconds,focus,marks){
 const start=clockSecondsAt(focus.start,marks),end=clockSecondsAt(focus.end,marks);
 return {head:smooth(start,start+motion.currentEnterSeconds,seconds),tail:smooth(end-motion.currentExitSeconds,end,seconds)};
}
export function arcPoint(arc,u){
 const a=Math.PI*clamp(u),x=(arc.from+arc.to)/2-(arc.to-arc.from)/2*Math.cos(a),y=arc.y+arc.sign*arc.ry*Math.sin(a);
 const dx=(arc.to-arc.from)/2*Math.sin(a),dy=arc.sign*arc.ry*Math.cos(a);
 return {x,y,angle:Math.atan2(dy,dx)*180/Math.PI};
}
export function partialCurrentArc(arc,tail,head){
 const a=arcPoint(arc,tail),b=arcPoint(arc,head);
 return {d:head-tail<1e-7?`M${b.x} ${b.y}`:`M${a.x} ${a.y} A${arc.rx} ${arc.ry} 0 0 ${arc.sweep} ${b.x} ${b.y}`,tip:b};
}
export function polarityBlend(seconds,site,plan,marks,kind='standard'){
 if(kind!=='standard')return 0;
 const middle=(plan.sites.length-1)/2,w=plan.windows[Math.abs(site-middle)];
 const start=clockSecondsAt(w.up,marks),end=clockSecondsAt(w.down,marks);
 // Shorten the fade for the rapidly exiting edge half-segments so the two
 // transitions do not overlap and the excited polarity remains visible.
 const half=Math.min(motion.chargeFadeSeconds/2,(end-start)/4);
 return smooth(start-half,start+half,seconds)*(1-smooth(end-half,end+half,seconds));
}
export const spatialPlot=Object.freeze({left:55,right:1045,baseline:628,gain:.7,top:548,bottom:654});
export function physicalPosition(x,plan){
 const xs=[spatialPlot.left,...diagramLayout.centres,spatialPlot.right];
 const cm=[-plan.representatives.at(-1),...plan.sites,plan.representatives.at(-1)];
 let i=xs.findIndex((v,j)=>j<xs.length-1&&x>=v&&x<xs[j+1]);if(i<0)i=x<=xs[0]?0:xs.length-2;
 const u=clamp((x-xs[i])/(xs[i+1]-xs[i]));return cm[i]+u*(cm[i+1]-cm[i]);
}
export function spatialProfile(trace,ms,plan){
 // A spatial snapshot of the shared teaching trace. Recovery compression is
 // applied once upstream, not painted as a separate bump on this graph.
 const out=[];
 for(let x=spatialPlot.left;x<=spatialPlot.right;x+=5){const cm=physicalPosition(x,plan),v=sample(trace,ms,cm).v;out.push({x,cm,v,y:spatialPlot.baseline-(v-trace.rest)*spatialPlot.gain});}
 return out;
}
