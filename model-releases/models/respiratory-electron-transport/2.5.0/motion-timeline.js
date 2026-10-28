import {straight,joinRoutes} from './motion-paths.js';
export const TRANSIT_SPEED=120;
export function makeTimeline(entry,R){
 const isI=entry==='nadh',d=p=>p.length/TRANSIT_SPEED,site=isI?[195,497]:[604,496],qRoute=isI?'q-I':'q-II',qBack=isI?'q-return-I':'q-return-II';
 const pairs=[],electrons=[],transfers=[];let cytAvailable=0;
 for(let pair=0;pair<2;pair++){
  const start=pair?pairs[0].q.reset:0,home=isI?[180+pair*195,624]:[548+pair*162,652],donorIn=straight(home,site),donorOut=straight(site,home);
  const es=[0,1].map(k=>{const routeId='entry-'+(isI?'I':'II')+'-'+k,emit=start+k*.45;return{id:pair*2+k,pair,k,emit,loaded:emit+d(R[routeId]),entryRoute:routeId,relayRoute:'III-'+k};});
  const q={start:Math.max(...es.map(e=>e.loaded))};q.arrive=q.start+d(R[qRoute]);
  for(const e of es){e.cyt=Math.max(q.arrive+d(R[e.relayRoute]),cytAvailable);e.leave=e.cyt-d(R[e.relayRoute]);e.arrive=e.cyt+d(R.cytc);e.finish=e.arrive+d(R.IV);e.cytReturnEnd=e.arrive+d(R['cytc-return']);cytAvailable=e.cytReturnEnd;}
  q.end=es[1].leave;q.reset=q.end+d(R[qBack]);
  const donor={home,site,in:donorIn,out:donorOut,start:pair?start-d(donorIn):0,bound:start,release:es[1].emit,end:es[1].emit+d(donorOut)};
  pairs.push({id:pair,start,q,electrons:es,donor});electrons.push(...es);
 }
 function proton(site,pair,k,kind,start){
  const slot=pair*(site==='IV'?2:4)+k,ims=[({I:125,III:763,IV:1158})[site]+(slot%4)*36,58+Math.floor(slot/4)*34],routeId=kind==='QH2'?'proton-Q':'proton-'+site;
  const stem=R[routeId],tail=straight(stem.at(1),ims),out=joinRoutes([stem,tail]);
  transfers.push({id:site+'-'+pair+'-'+k,site,pair,kind,slot,ims,routeId,start,stemEnd:start+d(stem),end:start+d(out),out,stemLength:stem.length});
 }
 for(const g of pairs){
  if(isI)for(let k=0;k<4;k++)proton('I',g.id,k,'pump',g.start+d(R[g.electrons[0].entryRoute])*.35+k*.4);
  for(let k=0;k<4;k++)proton('III',g.id,k,k<2?'QH2':'q-cycle',(k<2?g.q.arrive:g.electrons[1].leave)+(k%2)*.35);
  g.electrons.forEach((e,k)=>proton('IV',g.id,k,'pump',e.finish));
 }
 const oxygen={start:electrons[0].finish-d(R['oxygen-in']),bound:electrons[0].finish};
 const chemical=electrons.map((e,i)=>{const home=[1035+(i%2)*34,613+Math.floor(i/2)*34],access=straight(home,R['chemical-H'].at(0)),path=joinRoutes([access,R['chemical-H']]);return{id:i,home,path,accessLength:access.length,start:e.finish-d(path),end:e.finish};});
 const reactionStart=Math.max(oxygen.bound,...electrons.map(e=>e.finish),...chemical.map(h=>h.end)),formed=reactionStart+.65,waterEnd=formed+d(R['water-out']);
 const couplingStart=Math.max(waterEnd,...transfers.map(h=>h.end),...pairs.map(g=>Math.max(g.q.reset,g.donor.end)));
 // Reuse the finite pumped inventory. Two traced protons remain in the reservoir.
 const returning=[...transfers].sort((a,b)=>a.end-b.end).slice(0,-2);
 for(const h of returning){
  const access=straight(h.ims,[h.ims[0],22]),bus=straight([h.ims[0],22],[1358,22]),parts=[access,bus,R['H-inlet'],R['H-rotor'],R['H-exit']];
  let length=0;h.returnLegs=parts.map((p,i)=>{const begin=length;length+=p.length;return{begin,end:length,routeId:[null,'H-bus','H-inlet','H-rotor','H-exit'][i]};});
  h.returnPath=joinRoutes(parts);h.preRotor=d(access)+d(bus)+d(R['H-inlet']);
 }
 let rotorAvailable=couplingStart;
 for(const h of returning.sort((a,b)=>a.preRotor-b.preRotor)){
  h.rotorStart=Math.max(couplingStart+h.preRotor,rotorAvailable);h.returnStart=h.rotorStart-h.preRotor;h.rotorEnd=h.rotorStart+d(R['H-rotor']);h.returnEnd=h.returnStart+d(h.returnPath);rotorAvailable=h.rotorStart+.42;
 }
 const atpIn=straight([1445,630],[1445,487]),atpOut=straight([1445,487],[1445,638]),joinStart=returning[0].rotorStart;
 const synthesis={in:atpIn,out:atpOut,start:joinStart-d(atpIn),bound:joinStart,joinStart,formed:joinStart+.65};synthesis.end=synthesis.formed+d(atpOut);
 const duration=Math.ceil(Math.max(synthesis.end,...returning.map(h=>h.returnEnd))*100)/100;
 const stages=[{id:'location',zh:'结构定位',en:'Orientation',start:0},{id:'entry',zh:'电子输入',en:'Electron entry',start:.01},{id:'transfer',zh:'载体接力与泵氢',en:'Carrier relay',start:pairs[0].q.start},{id:'oxygen',zh:'氧还原成水',en:'Oxygen reduction',start:reactionStart},{id:'coupling',zh:'ATP 合成',en:'ATP synthesis',start:couplingStart}];
 return{entry,isI,speed:TRANSIT_SPEED,pairs,electrons,transfers,returning,chemical,oxygen:{...oxygen,reactionStart,formed,end:waterEnd},synthesis,couplingStart,duration,stages,qRoute,qBack};
}
