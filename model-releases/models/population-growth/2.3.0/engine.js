// Continuous population models. Time here is in years; the player clock uses seconds.
export const DEFAULTS = Object.freeze({n0:20,r:0.6,k:400});
export const PLAYBACK_SECONDS = 40;
export const INITIAL_AXIS_MAX = 500;
export function parameters(n0,r){
  if(!Number.isInteger(n0)||n0<1||n0>=DEFAULTS.k)throw new RangeError('N₀ 请输入 1–399 的整数，须小于 K = 400。');
  if(!Number.isFinite(r)||r<0.05||r>2)throw new RangeError('r 请输入 0.05–2 之间的数值，单位为年⁻¹。');
  return Object.freeze({n0,r,k:DEFAULTS.k});
}
export function timeline(p){
  const a=p.k/p.n0-1;
  const near=Math.max(0,Math.log(a*199)/p.r);
  const raw=near+1.5/p.r;
  const unit=raw<10?0.1:1;
  const end=Math.ceil(raw/unit-1e-10)*unit;
  const inflection=p.n0<p.k/2?Math.log(a)/p.r:p.n0===p.k/2?0:null;
  return Object.freeze({end,near,inflection,stageTimes:[0,inflection>0?inflection:end*0.1,Math.max(near,end*0.6)]});
}
export function at(p,time){
  const q=p.r*Math.max(0,time),j=p.n0*Math.exp(q);
  const a=p.k/p.n0-1,decay=a*Math.exp(-q),s=p.k/(1+decay);
  // This expression preserves the small positive growth near K without clamping.
  const sRelative=p.r*decay/(1+decay);
  return {j:{n:j,speed:p.r*j,relative:p.r},s:{n:s,speed:s*sRelative,relative:sRelative}};
}
export function niceCeiling(value){
  if(!(value>0))return 1;
  const magnitude=10**Math.floor(Math.log10(value));
  const normalized=value/magnitude;
  const step=normalized<=1+1e-10?1:normalized<=2+1e-10?2:normalized<=5+1e-10?5:10;
  return step*magnitude;
}
// A continuous linear-axis domain: 0–500 initially, then a C1 shoulder over
// N=400..500 before tracking N with headroom. No 1–2–5 range jumps.
export function jAxisMax(n){
  if(n<=400)return INITIAL_AXIS_MAX;
  if(n<500)return INITIAL_AXIS_MAX+0.006*(n-400)**2;
  return 1.2*n-40;
}
export function stageAt(time,line){return time<=1e-8?0:time>=line.stageTimes[2]-1e-8?2:1;}
export function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
export function sampleCurve(p,time,kind){
  const count=Math.max(1,Math.ceil(360*time/timeline(p).end));
  return Array.from({length:count+1},(_,i)=>{const t=time*i/count;return {t,n:at(p,t)[kind].n};});
}
export function formatNumber(n,decimals=1){
  if(Math.abs(n)>=1e8)return (n/1e8).toLocaleString('zh-CN',{maximumFractionDigits:2})+'亿';
  if(Math.abs(n)>=1e4)return (n/1e4).toLocaleString('zh-CN',{maximumFractionDigits:2})+'万';
  return n.toLocaleString('zh-CN',{maximumFractionDigits:decimals});
}
export function formatTime(t){return t.toLocaleString('zh-CN',{maximumFractionDigits:2});}
