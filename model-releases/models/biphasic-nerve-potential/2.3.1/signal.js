// Deterministic teaching model of a bipolar extracellular compound response.
// Distance: mm; biological time: ms; mm/ms is numerically equal to m/s.
export const PARAMETERS = Object.freeze({
  stimulusMs: 0.18, stimulusDurationMs: 0.09, templateSigmaMs: 0.105,
  endMs: 4.4, lessonSeconds: 24, lengthMm: 95, samples: 1101,
  meanSpeed: 30, speedSpread: 2.3,
});
export const CONDITIONS = Object.freeze({
  near: {name:'记录电极距离较近',r1:28,r2:38,sign:1,detail:'R1 固定，R2 较近，两处膜外响应更易重叠，两相间隔较短。'},
  wide: {name:'记录电极距离较远',r1:28,r2:60,sign:1,detail:'只右移 R2，第二相延后，两相分离更明显。'},
  swap: {name:'记录电极交换位置',r1:28,r2:38,sign:-1,detail:'对调记录输入，两个取样位置保持不变，整条曲线上下翻转。'},
  remote: {name:'距离刺激电极较远',r1:58,r2:68,sign:1,detail:'R1、R2 整体远移且间距不变：到达延迟增大，纤维间时间分散更明显。'},
});
export const STAGES = [
  {id:'rest',zh:'静息与接线',en:'Rest & Electrodes'},
  {id:'stimulation',zh:'刺激与传导',en:'Stimulation & Conduction'},
  {id:'first-phase',zh:'第一相',en:'First Phase'},
  {id:'second-phase',zh:'第二相',en:'Second Phase'},
  {id:'recovery',zh:'回零与比较',en:'Recovery & Comparison'},
];
export const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));
export function smooth(a,b,v){const u=clamp((v-a)/(b-a));return u*u*(3-2*u);}
export function makePopulation(spread=PARAMETERS.speedSpread){
  if(spread===0)return [{v:PARAMETERS.meanSpeed,w:1}];
  const out=Array.from({length:61},(_,i)=>({v:24+i*.2,w:Math.exp(-.5*((24+i*.2-30)/spread)**2)}));
  const sum=out.reduce((v,f)=>v+f.w,0);return out.map(f=>({...f,w:f.w/sum}));
}
export const POPULATION=makePopulation();
// Six displayed fibers are representative members, not the whole population.
export const VISIBLE_SPEEDS=[35,33,31,29,27,25];
export function pulse(z){const a=Math.abs(z);return a>=4.5?0:Math.exp(-.5*z*z)*(1-smooth(3.5,4.5,a));}
export function activation(ms){return smooth(PARAMETERS.stimulusMs,PARAMETERS.stimulusMs+.035,ms);}
export function arrival(speed,distance){return PARAMETERS.stimulusMs+Math.abs(distance)/speed;}
export function fiberResponse(speed,distance,ms){
  if(ms<=PARAMETERS.stimulusMs)return 0;
  return -activation(ms)*pulse((ms-arrival(speed,distance))/PARAMETERS.templateSigmaMs);
}
export function extracellular(distance,ms,population=POPULATION){
  if(ms<=PARAMETERS.stimulusMs)return 0;
  let v=0;for(const f of population)v+=f.w*fiberResponse(f.v,distance,ms);return v;
}
export function measurement(condition,ms,population=POPULATION){
  const c=typeof condition==='string'?CONDITIONS[condition]:condition;
  const r1=extracellular(c.r1,ms,population),r2=extracellular(c.r2,ms,population);
  return {r1,r2,u:c.sign*(r2-r1)};
}
export function frontPosition(speed,ms,direction=1){return direction*speed*(ms-PARAMETERS.stimulusMs);}
export const msAtSeconds=s=>clamp(s,0,PARAMETERS.lessonSeconds)/PARAMETERS.lessonSeconds*PARAMETERS.endMs;
export const secondsAtMs=ms=>clamp(ms,0,PARAMETERS.endMs)/PARAMETERS.endMs*PARAMETERS.lessonSeconds;
export function buildTrace(condition){
  const c=CONDITIONS[condition],samples=Array.from({length:PARAMETERS.samples},(_,i)=>{
    const ms=i*PARAMETERS.endMs/(PARAMETERS.samples-1);return {ms,...measurement(c,ms)};
  });
  // Stage boundaries use the un-swapped difference; flipping leads cannot alter conduction timing.
  let first=samples[0],second=samples[0];
  for(const p of samples){if(p.u*c.sign>first.u*c.sign)first=p;if(p.u*c.sign<second.u*c.sign)second=p;}
  const peak=Math.max(Math.abs(first.u),Math.abs(second.u));
  const onset=samples.find(p=>p.ms>PARAMETERS.stimulusMs&&p.u*c.sign>peak*.025)?.ms??first.ms;
  const crossing=samples.find(p=>p.ms>first.ms&&p.u*c.sign<0)?.ms??second.ms;
  const recovered=samples.find(p=>p.ms>second.ms&&Math.abs(p.r1)<.008&&Math.abs(p.r2)<.008)?.ms??PARAMETERS.endMs;
  return {condition,samples,firstMs:first.ms,secondMs:second.ms,onsetMs:onset,crossingMs:crossing,recoveredMs:recovered,
    jumps:[0,PARAMETERS.stimulusMs+.045,first.ms,second.ms,PARAMETERS.endMs]};
}
export function stageAt(trace,ms){
  if(ms<PARAMETERS.stimulusMs)return 0;
  if(ms<trace.onsetMs)return 1;
  if(ms<trace.crossingMs)return 2;
  if(ms<trace.recoveredMs)return 3;
  return 4;
}
export function stimulation(ms){
  const t=ms-PARAMETERS.stimulusMs;
  return smooth(0,.012,t)*(1-smooth(PARAMETERS.stimulusDurationMs-.02,PARAMETERS.stimulusDurationMs,t));
}
