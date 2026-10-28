import{liquids,designState,fromTransfer}from'./physics.js';
export{liquids,funnelHalfWidth,liquidPalette}from'./physics.js';
export const DURATION=38,EQUILIBRIUM_TIME=30,STAGE_TIMES=[0,1.5,18,30];
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export const stageAt=t=>t>=30?3:t>=18?2:t>0?1:0;
const cache=new Map();
const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function upperBound(values,x,key=v=>v){let a=0,b=values.length;while(a<b){const mid=(a+b)>>>1;if(key(values[mid])<=x)a=mid+1;else b=mid;}return a;}

export function experiment(inside='high',outside='water'){
 if(!Object.hasOwn(liquids,inside)||!Object.hasOwn(liquids,outside))throw new RangeError('无效的液体选项。');
 const key=inside+'/'+outside;if(cache.has(key))return cache.get(key);
 const initial=designState(inside,outside,0),equilibrium=designState(inside,outside,3);
 const cin=liquids[inside].concentration,cout=liquids[outside].concentration;
 const qeq=equilibrium.q,force0=initial.pressureBalance;
 const samples=[{tau:0,f:0}];
 // Integrate dt/df = P(0)/P(f). This is dq/dtau = L*DeltaPressure
 // with positive constant L in each experiment, followed by classroom time compression.
 if(initial.direction){
  let previousF=0,previousInverse=1,tau=0;
  for(let j=1;j<=2400;j++){
   const f=1-Math.exp(-Math.log(1e6)*j/2400);
   const pressure=fromTransfer(qeq*f,cin,cout).pressureBalance;
   const inverse=force0/pressure;
   tau+=(f-previousF)*(inverse+previousInverse)/2;
   samples.push({tau,f});previousF=f;previousInverse=inverse;
  }
 }
 const tauEnd=samples.at(-1).tau;
 function at(time){
  const t=clamp(time,0,DURATION);let f=0;
  if(initial.direction){
   if(t>=EQUILIBRIUM_TIME)f=1;
   else{
    const tau=t/EQUILIBRIUM_TIME*tauEnd,k=upperBound(samples,tau,v=>v.tau);
    const a=samples[Math.max(0,k-1)],b=samples[Math.min(k,samples.length-1)];
    f=a.f+(b.f-a.f)*(b.tau===a.tau?0:(tau-a.tau)/(b.tau-a.tau));
   }
  }
  const state=fromTransfer(qeq*f,cin,cout),balanced=!initial.direction||t>=EQUILIBRIUM_TIME;
  const drive=balanced?0:clamp(state.pressureBalance/Math.max(1,Math.abs(force0)),-1,1);
  const net=t===0?'初始液面齐平':balanced?'净移动量为零':initial.direction>0?'水净进入漏斗':'水净离开漏斗';
  const note=t===0?'选择液体后，点击播放观察。':!initial.direction?'两侧浓度相同，液面齐平；水持续双向交换。':balanced?'液面稳定，水仍双向交换；两侧浓度不必相同。':t>=18?'液柱压力抵消部分渗透趋势，净移动量减小。':initial.direction>0?'漏斗内更浓，水净进入漏斗，内液面升高。':'漏斗外更浓，水净离开漏斗，内液面降低。';
  return{...state,time:t,stage:stageAt(t),fraction:f,direction:initial.direction,drive,balanced,inside,outside,insideName:liquids[inside].name,outsideName:liquids[outside].name,
   more:t===0?'—':balanced?'平均相当':initial.direction>0?'较多':'较少',less:t===0?'—':balanced?'平均相当':initial.direction>0?'较少':'较多',net,note,
   initialTotalVolume:initial.initialTotalVolume,initialInsideAmount:initial.initialInsideAmount,initialOutsideAmount:initial.initialOutsideAmount};
 }
 const events=[],pores={up:[854,970,1085,1205,1310],down:[914,1027,1144,1256,1364]};
 const cumulative={up:0,down:0},sequence={up:0,down:0},nextCrossing={up:1,down:1},dt=.025;
 for(let t=0;t<EQUILIBRIUM_TIME-1e-7;t+=dt){
  const drive=at(t+dt/2).drive;
  for(const direction of['up','down']){
   const rate=2+(direction==='up'?1:-1)*1.2*drive,prev=cumulative[direction];
   cumulative[direction]+=rate*dt;
   while(nextCrossing[direction]<=cumulative[direction]+1e-10){
    const threshold=nextCrossing[direction]++;
    const crossing=t+(threshold-prev)/rate,n=sequence[direction]++;
    events.push({direction,crossing,pore:pores[direction][n%5],seed:n*7+(direction==='up'?13:73)});
   }
  }
 }
 // At equilibrium pair the representative crossings; molecules still keep moving.
 for(let t=EQUILIBRIUM_TIME+.25;t<DURATION+1.25;t+=.5)for(const direction of['up','down']){
  const n=sequence[direction]++;events.push({direction,crossing:t,pore:pores[direction][n%5],seed:n*7+(direction==='up'?13:73)});
 }
 events.sort((a,b)=>a.crossing-b.crossing);events.forEach((event,i)=>event.id=i);
 function counts(time,window=3){
  const start=Math.max(0,time-window),result={up:0,down:0,window,from:start,to:time};
  for(const e of events){if(e.crossing>time)break;if(e.crossing>start)result[e.direction]++;}
  return result;
 }
 const result=Object.freeze({inside,outside,initial,equilibrium,samples,events,at,counts});cache.set(key,result);return result;
}

export function crossingPose(event,time){
 const p=(time-event.crossing+1.2)/2.4;
 if(p<0||p>1)return{visible:false,opacity:0,x:event.pore,y:299};
 const from=event.direction==='up'?470:136,to=event.direction==='up'?136:470;
 const y=p<=.5?from+(299-from)*p*2:299+(to-299)*(p-.5)*2;
 const wobble=clamp((Math.abs(y-299)-22)/52,0,1)*Math.sin(p*Math.PI*2)*(12+noise(event.seed)*18);
 const opacity=clamp(p/.08,0,1)*clamp((1-p)/.08,0,1);
 return{visible:true,opacity,x:event.pore+wobble,y,rotation:noise(event.seed)*90+Math.sin(p*5)*30};
}
