/* A local HH membrane patch, not a propagation or concentration-depletion model.
 * Classic 6.3 C squid-axon parameters, modern absolute-voltage convention.
 * The combined background current is algebraically identical to HH leakage:
 * 0.1(V-EK) + 0.2(V-Eother) + Ipump = 0.3(V-EL).
 * Splitting leakage is an explicit teaching decomposition, not a fitted dataset.
 */
(function(global){
'use strict';
const P=Object.freeze({Cm:1,gNa:120,gK:36,gLeakK:.1,gOther:.2,ENa:50,EK:-77,EL:-54.387,Ipump:.2,temperatureC:6.3,dt:.005,duration:30,stimStart:3,stimEnd:3.7});
const Eother=(.3*P.EL-P.gLeakK*P.EK+P.Ipump)/P.gOther;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=(a,b,x)=>{const q=clamp((x-a)/(b-a));return q*q*(3-2*q);};
function trap(x,k){return Math.abs(x/k)<1e-6?k+x/2:x/(-Math.expm1(-x/k));}
function rates(v){return {am:.1*trap(v+40,10),bm:4*Math.exp(-(v+65)/18),ah:.07*Math.exp(-(v+65)/20),bh:1/(1+Math.exp(-(v+35)/10)),an:.01*trap(v+55,10),bn:.125*Math.exp(-(v+65)/80)};}
function currents(s){const [v,m,h,n]=s;const pNa=m*m*m*h,pK=n**4;return {pNa,pK,ina:P.gNa*pNa*(v-P.ENa),ik:P.gK*pK*(v-P.EK),ileak:P.gLeakK*(v-P.EK),iother:P.gOther*(v-Eother),ipump:P.Ipump};}
function derivative(s,stim){const [v,m,h,n]=s,r=rates(v),i=currents(s);return [(stim-i.ina-i.ik-i.ileak-i.iother-i.ipump)/P.Cm,r.am*(1-m)-r.bm*m,r.ah*(1-h)-r.bh*h,r.an*(1-n)-r.bn*n];}
function rk4(s,dt,stim){const k1=derivative(s,stim),k2=derivative(s.map((v,i)=>v+k1[i]*dt/2),stim),k3=derivative(s.map((v,i)=>v+k2[i]*dt/2),stim),k4=derivative(s.map((v,i)=>v+k3[i]*dt),stim);return s.map((v,i)=>v+dt*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);}
function simulate(kind='standard',dt=P.dt){
 const r=rates(-65);let s=[-65,r.am/(r.am+r.bm),r.ah/(r.ah+r.bh),r.an/(r.an+r.bn)];
 for(let i=0;i<Math.round(60/dt);i++)s=rk4(s,dt,0);
 const samples=[];let fluxNa=0,fluxK=0,fluxLeak=0;const amplitude=kind==='weak'?3:20;
 for(let step=0;step<=Math.round(P.duration/dt);step++){
  const t=step*dt,stim=t>=P.stimStart&&t<P.stimEnd?amplitude:0,cur=currents(s);
  if(step){fluxNa+=Math.abs(cur.ina)*dt;fluxK+=Math.abs(cur.ik)*dt;fluxLeak+=Math.abs(cur.ileak)*dt;}
  samples.push({t,v:s[0],m:s[1],h:s[2],n:s[3],stim,...cur,fluxNa,fluxK,fluxLeak});
  s=rk4(s,dt,stim);
 }
 const peak=samples.reduce((a,b)=>b.v>a.v?b:a),trough=samples.filter(q=>q.t>peak.t).reduce((a,b)=>b.v<a.v?b:a);
 const rise=samples.find(q=>q.t>=P.stimStart&&q.v>=-45)?.t ?? 4.5;
 const recovery=samples.find(q=>q.t>trough.t&&q.v>-67)?.t ?? 25;
 return {kind,dt,samples,peak,trough,rise,recovery,rest:samples[0].v,amplitude};
}
function sample(trace,t){const k=clamp(t/trace.dt,0,trace.samples.length-1),a=trace.samples[Math.floor(k)],b=trace.samples[Math.min(trace.samples.length-1,Math.floor(k)+1)],u=k-Math.floor(k),o={};for(const key in a)o[key]=a[key]+(b[key]-a[key])*u;
 // A rectangular stimulus is discontinuous: interpolation must not turn it
 // on just before its onset or fade it before its specified end.
 o.stim=t>=P.stimStart&&t<P.stimEnd?trace.amplitude:0;return o;}
// Four equal teaching windows, then a shorter recovery overview. Only the
// presentation clock changes; voltage, currents and gates share the same ms.
const bounds=[0,8,16,24,32,36];
const lessonDuration=bounds[bounds.length-1];
const focusTransitionSeconds=.3;
// Classroom reference only, not a switch in the HH differential equations.
// Actual spike threshold depends on membrane state and stimulus history.
const thresholdReferenceMv=-55;
function advanceLesson(seconds,delta){
 const target=clamp(seconds+Math.max(0,delta),0,lessonDuration);
 return {seconds:target,ended:target>=lessonDuration};
}
// The two Na gates are independent. Drawings show population trends, not
// single-channel pore widths. Fixed calibration comes from the reference
// patch, never from each trial's peak (which would inflate a weak response).
const r0=rates(-65),REST_GATES={m:r0.am/(r0.am+r0.bm),h:r0.ah/(r0.ah+r0.bh),n:r0.an/(r0.an+r0.bn)};
function channelState(q){
 const dh=rates(q.v).ah*(1-q.h)-rates(q.v).bh*q.h;
 const dn=rates(q.v).an*(1-q.n)-rates(q.v).bn*q.n;
 const activation=smooth(REST_GATES.m,.65,q.m);
 const inactivation=1-smooth(.08,REST_GATES.h,q.h);
 const potassium=smooth(REST_GATES.n,.77,q.n);
 let naState='关闭 · 可激活';
 if(q.m>.1)naState=q.h<.24?'失活占主导':q.h<.48?'开放 · 逐渐失活':'正在激活';
 else if(q.h<REST_GATES.h*.92)naState=dh>0?'关闭 · 失活恢复中':'关闭 · 可激活';
 let kState='关闭为主';
 if(q.n>REST_GATES.n+.015)kState=dn>0?'延迟开放':'缓慢关闭';
 // Geometric clearances of the Blender cutaway in world units. Token flow
 // is confined to the remaining pore, never through the activation seal/lid.
 const activationGap=Math.max(0,-.12+.76*activation);
 const lidRight=Math.min(.32,.82*(1-inactivation)-.35);
 const navLeft=-Math.min(.32,activationGap/2),navRight=Math.min(.32,activationGap/2,lidRight);
 const navClearance=Math.max(0,navRight-navLeft);
 // A centered column must fit around x=0; it must not slide toward the
 // lateral slit as the attached inactivation lid covers the central axis.
 const navAxisClearance=Math.max(0,2*Math.min(-navLeft,navRight));
 const kvClearance=Math.max(0,Math.min(.64,-.12+.76*potassium));
 return {activation,inactivation,potassium,navClearance,navAxisClearance,navCenter:(navRight+navLeft)/2,kvClearance,naState,kState};
}
function lessonState(seconds,trace){
 const t=clamp(seconds,0,lessonDuration);let stage=bounds.findIndex((b,i)=>i<5&&t>=b&&t<bounds[i+1]);if(stage<0)stage=4;
 const local=(t-bounds[stage])/(bounds[stage+1]-bounds[stage]);let ms=0;
 if(stage===1)ms=local*P.stimStart;
 if(stage===2)ms=P.stimStart+local*(trace.peak.t-P.stimStart);
 if(stage===3)ms=trace.peak.t+local*(trace.trough.t-trace.peak.t);
 if(stage===4)ms=trace.trough.t+local*(P.duration-trace.trough.t);
 const q=sample(trace,ms);
 const gates=channelState(q);
 return {seconds:t,stage,local,ms,...q,...gates,pump:((t/8)%1),measuring:stage>0};
}
// Focus is explanatory, not a gate or current switch. Its fade is derived
// from lesson time so pausing and reverse seeking reproduce the same image.
function proteinFocus(q,kind='standard'){
 const targets=kind==='weak'?['pump','leak','leak','leak',null]:['pump','leak','nav','kv',null];
 const target=targets[q.stage],previous=targets[Math.max(0,q.stage-1)];
 const u=q.stage===0?1:smooth(0,focusTransitionSeconds,q.seconds-bounds[q.stage]);
 const opacity=Object.fromEntries(['pump','leak','nav','kv'].map(id=>{
  const from=previous===null||previous===id?1:.3,to=target===null||target===id?1:.3;
  return [id,from+(to-from)*u];
 }));
 return {target,opacity};
}
function pumpCycle(p){
 const phase=((p%1)+1)%1;
 // Reuse donor conformational progression, with a return path for K binding.
 const profile=phase<.5?phase*1.4:.7+(phase-.5)*.6;
 const out=smooth(.27,.38,phase)*(1-smooth(.65,.74,phase));
 const inside=1-smooth(.2,.27,phase)+smooth(.80,.90,phase);
 const pocketY=-.42+1.06*smooth(.27,.40,phase)-1.06*smooth(.67,.82,phase);
 return {phase,profile,inside:clamp(inside),out, pocketY,naBound:phase>=.14&&phase<.4,kBound:phase>=.57&&phase<.86,
  label:phase<.2?'3 Na⁺ 在胞内侧结合':phase<.32?'ATP 水解 · 泵磷酸化':phase<.50?'向胞外释放 3 Na⁺':phase<.66?'2 K⁺ 在胞外侧结合':phase<.82?'去磷酸化 · 构象复位':'向胞内释放 2 K⁺'};
}
const api={P,Eother,rates,currents,simulate,sample,channelState,lessonState,proteinFocus,focusTransitionSeconds,pumpCycle,bounds,lessonDuration,thresholdReferenceMv,advanceLesson,smooth,clamp};
global.PotentialPhysiology=Object.freeze(api);
})(globalThis);
