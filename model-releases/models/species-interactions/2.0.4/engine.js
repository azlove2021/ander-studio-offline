// Illustrative continuous populations; no empirical-species calibration.
export const DURATION=36, PLAYBACK_SECONDS=36, SAMPLE_STEP=.03;
export const STAGE_TIMES=Object.freeze([0,12,24,36]);
export const DEFAULTS=Object.freeze({competition:'periodic',mutual:'obligate',separate:false,reference:true});
export const KINDS=Object.freeze(['predation','parasitism','competition','mutualism']);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const formatNumber=n=>n>=1000?n.toLocaleString('zh-CN',{maximumFractionDigits:0}):n.toFixed(n<1&&n>0?2:1);
export const formatTime=t=>t.toFixed(1);
export function stageAt(time){return Math.min(3,Math.floor((time+1e-9)/12));}

// RK4, with left-limit evaluation at an intervention boundary. Populations
// remain continuous when a coefficient changes; no population is reset.
export function integrate(fn,initial,start,end,step=SAMPLE_STEP,{cut=null,record=true}={}){
  let t=start,y=initial.slice();const rows=record?[{t,a:y[0],b:y[1],extra:y[2]}]:[];
  while(t<end-1e-9){
    const boundary=cut!==null&&t<cut-1e-9?Math.min(end,cut):end;
    const h=Math.min(step,boundary-t),edge=cut!==null&&Math.abs(t+h-cut)<1e-8?t+h-1e-8:t+h;
    const k1=fn(t,y),k2=fn(t+h/2,y.map((v,i)=>v+h*k1[i]/2)),k3=fn(t+h/2,y.map((v,i)=>v+h*k2[i]/2)),k4=fn(edge,y.map((v,i)=>v+h*k3[i]));
    y=y.map((v,i)=>v+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);
    if(y.some(v=>!Number.isFinite(v)||v<0))throw new Error('种群求解超出非负有限范围。');
    t=Math.min(end,t+h);if(Math.abs(t-boundary)<1e-9)t=boundary;
    if(record)rows.push({t,a:y[0],b:y[1],extra:y[2]});
  }
  return record?rows:y;
}

// Only the time unit is calibrated: all four LV rates share the same factor.
// The unscaled orbit starting at a prey minimum has period ~13.124 units.
export const PREDATION_SCALE=1.0936666666666668;
export function predatorDerivative(t,[a,b]){return [(.65*a-.009*a*b)*PREDATION_SCALE,(.0032*a*b-.38*b)*PREDATION_SCALE];}
export function competitionDerivative(mode){return (t,[a,b])=>{
  const wave=Math.sin(2*Math.PI*t/12),ka=240*(1+.52*wave),kb=240*(1-.52*wave);
  const alpha=mode==='exclusion'?.25:.6,beta=mode==='exclusion'?2.4:.6;
  return [.65*a*(1-(a+alpha*b)/ka),.65*b*(1-(b+beta*a)/kb)];
};}
export function mutualDerivative(mode,separate=false){return (t,[a,b])=>{
  const environment=1+.42*Math.sin(2*Math.PI*t/36),linked=!(separate&&t>=18);
  return mode==='obligate'
    ?[a*(-.18-.002/environment*a+(linked?.95*b/(55+b):0)),b*(-.15-.0028/environment*b+(linked?.82*a/(60+a):0))]
    :[a*(.18-.0025/environment*a+(linked?.45*b/(45+b):0)),b*(.15-.0028/environment*b+(linked?.38*a/(60+a):0))];
};}
// Host H, total resident adult parasites P, free-living infective stages L.
// Adapted macroparasite equations: host-dependent acquisition, adult loss with
// host death, aggregation k=1. L is solved but not mislabeled as adult P.
export function parasiteDerivative(t,[h,p,l]){
  const mortality=.06,contact=.015;
  return [.5*h-.0015*h*h-mortality*p,
    contact*h*l-p*(.3+.0015*h+mortality+2*mortality*p/h),
    2*p-(contact*h+1.1)*l];
}
export function hostWithoutParasites(t){const k=.5/.0015;return k/(1+(k/40-1)*Math.exp(-.5*t));}

const cache=new Map();
export function dataFor(kind,options=DEFAULTS){
  const key=kind==='competition'?kind+'/'+options.competition:kind==='mutualism'?kind+'/'+options.mutual+'/'+options.separate:kind;
  if(cache.has(key))return cache.get(key);
  let data;
  if(kind==='predation')data=integrate(predatorDerivative,[50,.65/.009],0,DURATION);
  else if(kind==='parasitism')data=integrate(parasiteDerivative,[40,6,3],0,DURATION).map(d=>({...d,reference:hostWithoutParasites(d.t)}));
  else if(kind==='competition'){
    const fn=competitionDerivative(options.competition);
    // Periodic coexistence is observed after settling, avoiding a fabricated
    // reset between cycles. Exclusion starts with both species present.
    const initial=options.competition==='periodic'?integrate(fn,[140,100],-240,0,SAMPLE_STEP,{record:false}):[140,100];
    data=integrate(fn,initial,0,DURATION);
  }else if(kind==='mutualism'){
    const initial=integrate(mutualDerivative(options.mutual),options.mutual==='obligate'?[180,120]:[140,100],-720,0,SAMPLE_STEP,{record:false});
    data=integrate(mutualDerivative(options.mutual,options.separate),initial,0,DURATION,SAMPLE_STEP,{cut:options.separate?18:null});
  }else throw new Error('未知种间关系。');
  cache.set(key,data);return data;
}
export function sample(data,time){
  const t=clamp(time,0,DURATION);let lo=0,hi=data.length-1;
  while(hi-lo>1){const m=(lo+hi)>>1;if(data[m].t<=t)lo=m;else hi=m;}
  const p=data[lo],q=data[hi],f=q.t===p.t?0:(t-p.t)/(q.t-p.t);
  const result={t,a:p.a+(q.a-p.a)*f,b:p.b+(q.b-p.b)*f};
  for(const key of ['reference','extra'])if(Number.isFinite(p[key]))result[key]=p[key]+(q[key]-p[key])*f;
  return result;
}
export function pointsThrough(data,time){
  const selected=[];for(const point of data){if(point.t>=time)break;selected.push(point);}selected.push(sample(data,time));return selected;
}
export function niceCeiling(value){const scale=10**Math.floor(Math.log10(Math.max(1,value)));return Math.ceil(value/scale)*scale;}
export function axesFor(kind){
  const sets=kind==='competition'?['periodic','exclusion'].map(competition=>dataFor(kind,{...DEFAULTS,competition})):kind==='mutualism'?['obligate','facultative'].flatMap(mutual=>[false,true].map(separate=>dataFor(kind,{...DEFAULTS,mutual,separate}))):[dataFor(kind)];
  let a=0,b=0;for(const data of sets)for(const p of data){a=Math.max(a,p.a,p.reference||0);b=Math.max(b,p.b);}
  if(kind==='competition')a=b=Math.max(a,b);
  return Object.freeze([niceCeiling(a*1.08),niceCeiling(b*1.08)]);
}
export const SERIES_NAMES=Object.freeze({predation:['猎物','捕食者'],parasitism:['宿主','寄生者成体'],competition:['物种 A','物种 B'],mutualism:['物种 A','物种 B']});
export function validateOptions(next,current=DEFAULTS){
  const result={...current,...next};
  if(!['periodic','exclusion'].includes(result.competition)||!['obligate','facultative'].includes(result.mutual)||typeof result.separate!=='boolean'||typeof result.reference!=='boolean')throw new RangeError('无效的关系情境。');
  return result;
}
