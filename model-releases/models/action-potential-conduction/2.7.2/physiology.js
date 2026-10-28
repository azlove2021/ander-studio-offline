// HH membrane rates reused from resting-action-potential@2.4.0.
// Spatial coupling is a finite-volume, uniform, unmyelinated cable.
export const P=Object.freeze({Cm:1,gNa:120,gK:36,gL:.3,ENa:50,EK:-77,EL:-54.387,temperatureC:6.3,
  radiusCm:.0001,axialResistivityOhmCm:100,dxCm:.005,halfLengthCm:.5,dt:.005,sampleDt:.04,
  duration:40,stimStart:3,stimEnd:3.7,stimHalfWidthCm:.0125,amplitude:90,weakAmplitude:6});
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,v)=>{const u=clamp((v-a)/(b-a));return u*u*(3-2*u);};
const trap=(x,k)=>Math.abs(x/k)<1e-6?k+x/2:x/(-Math.expm1(-x/k));
export function rates(v){return {am:.1*trap(v+40,10),bm:4*Math.exp(-(v+65)/18),ah:.07*Math.exp(-(v+65)/20),bh:1/(1+Math.exp(-(v+35)/10)),an:.01*trap(v+55,10),bn:.125*Math.exp(-(v+65)/80)};}
export function equilibrium(v=-65){const r=rates(v);return [v,r.am/(r.am+r.bm),r.ah/(r.ah+r.bh),r.an/(r.an+r.bn)];}
const REST=equilibrium();
export function currents(v,m,h,n,p=P){return {ina:p.gNa*m*m*m*h*(v-p.ENa),ik:p.gK*n**4*(v-p.EK),leak:p.gL*(v-p.EL),pNa:m*m*m*h,pK:n**4};}
export function simulate(kind='standard',options={}){
  const p={...P,...options},N=Math.round(2*p.halfLengthCm/p.dxCm)+1,mid=(N-1)/2;
  // S -> mS: 1000*a/(2*Ri*dx^2) gives mS/cm^2. Currents are uA/cm^2.
  const gax=1000*p.radiusCm/(2*p.axialResistivityOhmCm*p.dxCm**2);
  if(!Number.isInteger(mid)||p.dt*gax/p.Cm>.45)throw Error('Cable grid or time step is unsuitable');
  const count=Math.round(p.duration/p.sampleDt)+1,stride=Math.round(p.sampleDt/p.dt);
  if(Math.abs(stride*p.dt-p.sampleDt)>1e-9)throw Error('Sample interval must be an integer number of steps');
  const values=new Float32Array(count*N*4),s=new Float64Array(N*4),tmp=new Float64Array(s.length);
  const k1=new Float64Array(s.length),k2=new Float64Array(s.length),k3=new Float64Array(s.length),k4=new Float64Array(s.length);
  let init=equilibrium();
  // Equilibrate an isolated uniform patch; the spatial derivative is zero.
  for(let j=0;j<16000;j++){const [v,m,h,n]=init,r=rates(v),c=currents(...init,p),dt=.005;init=[v-dt*(c.ina+c.ik+c.leak)/p.Cm,m+dt*(r.am*(1-m)-r.bm*m),h+dt*(r.ah*(1-h)-r.bh*h),n+dt*(r.an*(1-n)-r.bn*n)];}
  for(let i=0;i<N;i++)s.set(init,i*4);
  const amp=kind==='weak'?p.weakAmplitude:kind==='none'?0:p.amplitude;
  const stimWeights=new Float64Array(N);
  for(let i=0;i<N;i++){
    // Cell overlap avoids changing total injected current on grid refinement.
    const x=(i-mid)*p.dxCm,lo=Math.max(x-p.dxCm/2,-p.stimHalfWidthCm),hi=Math.min(x+p.dxCm/2,p.stimHalfWidthCm);
    stimWeights[i]=Math.max(0,hi-lo)/p.dxCm;
  }
  function derivative(v,out,stim){
    for(let i=0;i<N;i++){
      const o=i*4,V=v[o],m=v[o+1],h=v[o+2],n=v[o+3],r=rates(V),c=currents(V,m,h,n,p);
      // Sealed ends are outside the teaching viewport. Uniform rest is invariant.
      const Vl=v[(i?i-1:i)*4],Vr=v[(i<N-1?i+1:i)*4];
      out[o]=(stim*stimWeights[i]-c.ina-c.ik-c.leak+gax*(Vl-2*V+Vr))/p.Cm;
      out[o+1]=r.am*(1-m)-r.bm*m;out[o+2]=r.ah*(1-h)-r.bh*h;out[o+3]=r.an*(1-n)-r.bn*n;
    }
  }
  const steps=Math.round(p.duration/p.dt);
  for(let step=0;step<=steps;step++){
    if(step%stride===0)values.set(s,(step/stride)*N*4);
    if(step===steps)break;
    // Rectangular pulse edges lie exactly on steps; do not straddle or smear them.
    const t=step*p.dt,stim=t>=p.stimStart-1e-8&&t<p.stimEnd-1e-8?amp:0;
    derivative(s,k1,stim);
    for(let j=0;j<s.length;j++)tmp[j]=s[j]+p.dt*k1[j]/2;derivative(tmp,k2,stim);
    for(let j=0;j<s.length;j++)tmp[j]=s[j]+p.dt*k2[j]/2;derivative(tmp,k3,stim);
    for(let j=0;j<s.length;j++)tmp[j]=s[j]+p.dt*k3[j];derivative(tmp,k4,stim);
    for(let j=0;j<s.length;j++)s[j]+=p.dt*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6;
    if(!Number.isFinite(s[mid*4]))throw Error('Non-finite cable state');
  }
  return {p,N,mid,gax,values,count,kind,rest:init[0],amplitude:amp};
}
export function sample(trace,t,xCm=0){
  const f=clamp(t/trace.p.sampleDt,0,trace.count-1),a=Math.floor(f),b=Math.min(trace.count-1,a+1),u=f-a;
  const pos=clamp(xCm/trace.p.dxCm+trace.mid,0,trace.N-1),i=Math.floor(pos),j=Math.min(trace.N-1,i+1),z=pos-i;
  const at=(k,n,d)=>trace.values[(k*trace.N+n)*4+d];
  const q=Array.from({length:4},(_,d)=>{const left=at(a,i,d)+(at(b,i,d)-at(a,i,d))*u,right=at(a,j,d)+(at(b,j,d)-at(a,j,d))*u;return left+(right-left)*z;});
  const [v,m,h,n]=q,c=currents(...q,trace.p);
  return {t,v,m,h,n,...c};
}
export function feature(trace,xCm){
  let peak={v:-Infinity,t:0},trough={v:Infinity,t:0},cross=null,down=null;
  for(let i=0;i<trace.count;i++){const t=i*trace.p.sampleDt,q=sample(trace,t,xCm);if(q.v>peak.v)peak={v:q.v,t};if(t>trace.p.stimStart&&q.v>=0&&cross===null)cross=t;}
  for(let i=Math.round(peak.t/trace.p.sampleDt);i<trace.count;i++){const t=i*trace.p.sampleDt,q=sample(trace,t,xCm);if(q.v<trough.v)trough={v:q.v,t};if(q.v<0&&down===null)down=t;}
  return {peak,trough,cross,down};
}
export function channelState(q){
  const activation=smooth(REST[1],.65,q.m),inactivation=1-smooth(.06,.30,q.h),potassium=smooth(REST[3],.77,q.n);
  const gap=Math.max(0,-.12+.76*activation),lidRight=Math.min(.32,.82*(1-inactivation)-.35);
  const navAxisClearance=Math.max(0,2*Math.min(.32,gap/2,lidRight));
  const kvClearance=Math.max(0,Math.min(.64,-.12+.76*potassium));
  const r=rates(q.v),dn=r.an*(1-q.n)-r.bn*q.n;
  let label='静息',na='关闭 · 可激活',k='关闭为主';
  if(q.m>.1)na=q.h<.24?'失活占主导':q.h<.48?'开放 · 逐渐失活':'快速激活';
  else if(q.h<REST[2]*.92)na='关闭 · 失活恢复中';
  if(q.n>REST[3]+.015)k=dn>0?'延迟开放':'缓慢关闭';
  if(q.v>0)label='兴奋';else if(q.h<.34)label='复极 / 不应期';else if(q.v>-64)label='去极化';else if(q.n>REST[3]+.055||q.h<REST[2]*.92)label='恢复中';
  return {activation,inactivation,potassium,navAxisClearance,kvClearance,label,na,k};
}
export const sites=Object.freeze([-0.30,-0.20,-0.10,0,.10,.20,.30]);
export const lessonDuration=48;
export function timeline(trace){
  const central=feature(trace,0),near=feature(trace,.10),far=feature(trace,.30);
  // Landmarks are from a computed suprathreshold cable; no artificial propagation delays.
  return {central,near,far,seconds:[0,5,11,17,24,48],ms:[0,trace.p.stimStart,central.peak.t,near.peak.t,far.peak.t,trace.p.duration],jumps:[0,5,13,17.5,24]};
}
export function lessonState(seconds,trace,landmarks){
  const sec=clamp(seconds,0,lessonDuration),s=landmarks.seconds;
  let stage=s.findIndex((v,i)=>i<5&&sec>=v&&sec<s[i+1]);if(stage<0)stage=4;
  const u=(sec-s[stage])/(s[stage+1]-s[stage]),ms=landmarks.ms[stage]+u*(landmarks.ms[stage+1]-landmarks.ms[stage]);
  return {seconds:sec,stage,ms,stim:ms>=trace.p.stimStart&&ms<trace.p.stimEnd,ended:sec>=lessonDuration};
}
