export const SEQUENCE='ACAGCTTCAGGA';
export const PRIMER='ATGCCATGACGTTACGGT';
export const COMPLEMENT=Object.freeze({A:'T',T:'A',C:'G',G:'C'});
export const TEMPLATE=[...SEQUENCE].map(b=>COMPLEMENT[b]).join('');
export const BASES=Object.freeze(['A','C','G','T']);
export const DYES=Object.freeze({A:'#d93170',C:'#287eca',G:'#bc8714',T:'#138767'});
export const SIGNALS=Object.freeze({A:'#ff79ab',C:'#79b8ff',G:'#f4ce57',T:'#55dfb4'});
export const G=Object.freeze({width:1660,height:850,left:310,x0:470,step:56,templateY:207,liveY:273,rowStart:337,rowStep:36,productScale:1.65,liveScale:1.8,gelX:1375,sequenceX:1570,wellY:758,dyeOffset:-26.4});
export const STAGES=Object.freeze([{id:'prepare',zh:'测序体系',en:'Sequencing mixture'},{id:'extend',zh:'延伸与终止',en:'Extension & termination'},{id:'load',zh:'清理与上样',en:'Cleanup & loading'},{id:'separate',zh:'向上电泳',en:'Upward electrophoresis'},{id:'read',zh:'读取序列',en:'Read the sequence'}]);
export const FRAGMENTS=Object.freeze([...SEQUENCE].map((base,i)=>Object.freeze({id:`fragment-${i+1}`,k:i+1,base,length:PRIMER.length+i+1,sequence:PRIMER+SEQUENCE.slice(0,i+1),templateId:`template-copy-${i+1}`})));
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const mix=(a,b,p)=>a+(b-a)*p;
export const ease=p=>{p=clamp(p);return p*p*(3-2*p);};
export const rowY=k=>G.rowStart+(k-1)*G.rowStep;
export const bandY=k=>rowY(k)+G.dyeOffset;
export const ntX=j=>G.x0+(j+.5)*G.step;
export const sourceOf=(base,dd=false)=>({x:(dd?1004:340)+BASES.indexOf(base)*166,y:100});
export function createTimeline(){const segments=[];let t=0;const add=(phase,duration,data={})=>{const s={phase,start:t,end:t+duration,duration,...data};segments.push(s);t=s.end;return s;};
  add('prepare',2.2,{stage:0,k:1});
  for(const f of FRAGMENTS){if(f.k>1)add('new-copy',.3,{stage:1,k:f.k});for(let j=0;j<f.k;j++){const dd=j===f.k-1;add('incorporate',dd?(f.k===1?1.15:.68):.30,{stage:1,k:f.k,j,base:SEQUENCE[j],dd,monomerId:`${f.id}-nt-${j+1}`});}add('terminated',f.k===1?.85:.42,{stage:1,k:f.k});add('collect',.55,{stage:1,k:f.k});}
  add('cleanup',1.7,{stage:2});add('load',3.5,{stage:2});add('separate',8,{stage:3});add('read',5.4,{stage:4});add('result',1.2,{stage:4});
  const stageStarts=STAGES.map((_,i)=>segments.find(s=>s.stage===i).start);return Object.freeze({segments,duration:t,stageStarts});
}
export const TIMELINE=createTimeline();
export function stateAt(time){time=clamp(Number.isFinite(time)?time:0,0,TIMELINE.duration);let lo=0,hi=TIMELINE.segments.length-1;while(lo<hi){const m=Math.floor((lo+hi+1)/2);if(TIMELINE.segments[m].start<=time)lo=m;else hi=m-1;}const segment=TIMELINE.segments[lo],p=clamp((time-segment.start)/segment.duration),s={...segment,time,p,index:lo,progress:time/TIMELINE.duration,done:time>=TIMELINE.duration};
  s.activeK=s.k??null;s.formed=0;s.completed=s.k?s.k-1:12;s.flight=null;
  if(s.phase==='incorporate'){const bond=ease((p-.72)/.19);s.formed=s.j+bond;const from=sourceOf(s.base,s.dd),target={x:ntX(s.j),y:G.liveY},u=ease(p/.72);s.flight={...from,x:mix(from.x,target.x,u),y:mix(from.y,target.y,u)-Math.sin(Math.PI*u)*30,base:s.base,dd:s.dd,visible:p<.72,monomerId:s.monomerId,target,from,arrival:p>=.72,ppi:clamp((p-.72)/.28),fraction:bond};}
  else if(['terminated','collect'].includes(s.phase))s.formed=s.k;
  if(s.phase==='collect'&&p>=1-1e-9)s.completed=s.k;
  s.readCount=s.phase==='result'?12:s.phase==='read'?Math.min(12,Math.floor(p*12+1e-8)):0;
  s.separation=s.stage>3?1:s.phase==='separate'?p:0;
  s.records=s.stage>=2;s.bandVisible=s.stage>=3;
  return s;
}
export function rowFrame(f,s){const active=f.k===s.activeK,previous=s.activeK===null||f.k<s.activeK,visible=active||previous;let formed=previous?f.k:active?s.formed:0,y=previous?rowY(f.k):G.liveY,scale=previous?G.productScale:G.liveScale,opacity=visible?1:0;
  if(active&&s.phase==='collect'){const p=ease(s.p);y=mix(G.liveY,rowY(f.k),p);scale=mix(G.liveScale,G.productScale,p);}
  if(active&&s.phase==='new-copy')opacity=ease(s.p);
  return{...f,active,visible,formed,y,scale,opacity,terminalVisible:formed>=f.k-1e-8,frontX:G.x0+formed*G.step,stored:previous||s.phase==='collect'&&s.p>=1-1e-9};
}
export function selectedFor(s,manual=null){return manual??(s.stage===4?Math.max(1,s.readCount):s.activeK??12);}
export function loadingFrame(f,s){const active=s.phase==='load',p=active?clamp((s.p-(f.k-1)*.018)/.79):s.stage>2?1:0,u=ease(p);return{visible:active,progress:p,x:mix(G.left,G.gelX-7,u),y:mix(rowY(f.k),G.wellY,u),scale:mix(1,.015,u),opacity:active?1:0};}
export function bandFrame(f,s){return{...f,visible:s.bandVisible,y:mix(G.wellY,bandY(f.k),s.separation),width:62,read:s.readCount>=f.k};}
export function frameAt(time,manual=null){const s=stateAt(time);return{state:s,selected:selectedFor(s,manual),rows:FRAGMENTS.map(f=>rowFrame(f,s)),bands:FRAGMENTS.map(f=>bandFrame(f,s)),loads:FRAGMENTS.map(f=>loadingFrame(f,s))};}
