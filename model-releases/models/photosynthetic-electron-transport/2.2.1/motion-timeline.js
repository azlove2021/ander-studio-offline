import {point,route,joinRoutes} from './path-utils.js';

// World-space teaching speed, not a physiological rate. Playback speed scales this clock once.
export const TRANSIT_SPEED=120;
const line=(a,b)=>route([[a,point([a,b],1/3),point([a,b],2/3),b]]);
export function makeTimeline(R,light,atpRoute){
 const duration=p=>p.length/TRANSIT_SPEED;
 const slot=[-17,17],fnrSlot=[-12,12];
 const electronPaths=slot.map((x,i)=>({
  load:joinRoutes([R.psii,line([385,355],[385+x,324])]),
  detach:line([565+x,324],[565,355]),
  relay:joinRoutes([line([565+x,324],[565,355]),R.b6f]),
  fnr:line([1198,148],[1198+fnrSlot[i],148]),
  redox:joinRoutes([line([1198+fnrSlot[i],148],[1198,148]),R.nadph])
 }));
 const nadpPaths=[0,1].map(i=>({in:line(i?[1350,250]:[1335,80],[1260,165]),out:line([1260,165],i?[1340,255]:[1350,75])}));
 const atpPaths={in:line([1540,75],[1580,228]),out:line([1580,228],[1690,80])};
 const lightDuration=Math.hypot(...light.psii.at(1).map((x,i)=>x-light.psii.at(0)[i]))/TRANSIT_SPEED;
 const waterDuration=duration(R.water),refillDuration=duration(R.waterElectron);
 const h=[],atpCycles=[],returnEvents=[];
 const proton=(id,kind,routeId,start,quantity=1)=>{const e={id,kind,routeId,start,end:start+duration(R[routeId]),quantity};h.push(e);return e;};
 const finishPSI=e=>{e.fd=e.psi+duration(R.psi);e.fdArrive=e.fd+duration(R.fd);e.arrive=e.fdArrive+duration(electronPaths[e.carrier].fnr);e.fdReturnEnd=e.fdArrive+duration(R.fdReturn);e.pcReturnEnd=e.psi+duration(R.pcReturn);};
 function psiiPair(pair,start){
  const electrons=[];
  for(let i=0;i<2;i++){
   const emit=i?Math.max(electrons[0].loaded,electrons[0].replacementEnd):start+lightDuration;
   const e={id:'e'+(pair*2+i+1),pair,carrier:i,emit,loaded:emit+duration(electronPaths[i].load)};
   e.replacementStart=pair===0&&i===0?emit+waterDuration:emit;
   e.replacementEnd=e.replacementStart+refillDuration;electrons.push(e);
  }
  return{pair,start,electrons,q:{start:electrons[1].loaded,arrive:electrons[1].loaded+duration(R.pq)}};
 }
 function relay(g,guided){
  const gap=guided?.75:duration(R.fd)+duration(R.fdReturn);
  g.electrons.forEach((e,i)=>{
   e.leave=g.q.arrive+i*gap;e.pc=e.leave+duration(electronPaths[i].relay);
   e.parkFraction=guided&&i===1?.62:1;e.dock=e.pc+duration(R.pc)*e.parkFraction;
   if(!guided){e.psi=e.dock;finishPSI(e);}
  });
  g.q.end=g.electrons[1].leave+duration(electronPaths[1].detach);
  g.q.reset=g.q.end+duration(R.pqReturn);
  g.relayEnd=Math.max(...g.electrons.map(e=>e.dock));
 }
 function nadph(g,start){
  const paths=nadpPaths[g.pair],n={id:g.pair,start,bound:start+duration(paths.in)};
  n.react=Math.max(n.bound,...g.electrons.map(e=>e.arrive));
  n.formed=n.react+duration(electronPaths[0].redox);n.end=n.formed+duration(paths.out);
  g.electrons.forEach(e=>{e.react=n.react;e.finish=n.formed;});
  n.h=proton('fnr-'+g.pair,'fnr','fnrH',n.formed-duration(R.fnrH));
  g.nadp=n;return n;
 }
 function atpCycle(start,first,index){
  const bound=start+duration(atpPaths.in),joinStart=first?Math.max(bound,start+duration(R.foIn)):bound;
  // Local catalytic rearrangement is a structural change, separately readable from transport.
  const formed=joinStart+.65,end=formed+duration(atpPaths.out);
  return{start,bound,joinStart,formed,end,index,slot:index%2};
 }
 function stream(start,end,prefix){
  const travel=duration(atpRoute);
  for(let i=0;start+i*.5+travel<=end+1e-8;i++)returnEvents.push({id:prefix+'-'+i,start:start+i*.5,end:start+i*.5+travel});
 }

 const guide=psiiPair(0,.4);relay(guide,true);
 const hStart=guide.relayEnd;
 proton('water-0','water','waterH',hStart);
 const uptake=proton('pq-0','pq','pqH',hStart,2);
 const cycle=proton('cycle-0','cycle','cycleH',uptake.end,2);
 const release=proton('release-0','release','releaseH',cycle.end,4);
 const atpStart=release.end,firstATP=atpCycle(atpStart,true,0);atpCycles.push(firstATP);
 const atpEnd=Math.max(firstATP.end,atpStart+1.5+duration(atpRoute));stream(atpStart,atpEnd,'guide');
 const lightIStart=atpEnd,a=guide.electrons[0],b=guide.electrons[1];
 a.psi=lightIStart+lightDuration;finishPSI(a);
 b.psi=Math.max(a.fdReturnEnd-duration(R.psi),b.dock+duration(R.pc)*(1-b.parkFraction));
 b.resume=b.psi-duration(R.pc)*(1-b.parkFraction);finishPSI(b);
 const guideNADP=nadph(guide,b.arrive),coupledStart=guideNADP.end;

 const coupled=psiiPair(1,coupledStart);relay(coupled,false);
 const [c,d]=coupled.electrons;
 proton('pq-1','pq','pqH',coupled.q.start-duration(R.pqH),2);
 const cycle2=proton('cycle-1','cycle','cycleH',Math.max(coupled.q.arrive,d.pc-duration(R.cycleH)-duration(R.releaseH)),2);
 proton('release-1','release','releaseH',cycle2.end,4);
 proton('water-1','water','waterH',c.replacementEnd);
 proton('water-2','water','waterH',d.replacementEnd);
 proton('water-3','water','waterH',d.replacementEnd+.25);
 const oxygen={start:d.replacementEnd,end:d.replacementEnd+duration(R.oxygen)};
 const coupledNADP=nadph(coupled,Math.max(coupledStart,d.arrive-duration(nadpPaths[1].in)));
 const end=Math.max(coupledNADP.end,oxygen.end,coupled.q.reset,...coupled.electrons.map(e=>Math.max(e.pcReturnEnd,e.fdReturnEnd)),...h.map(e=>e.end));
 let next=coupledStart;
 while(true){const e=atpCycle(next,next===coupledStart,atpCycles.length);if(e.end>end+1e-8)break;atpCycles.push(e);next=e.end;}
 stream(coupledStart,end,'coupled');

 const electrons=[...guide.electrons,...coupled.electrons];
 const stageData=[
  ['orientation','结构与两侧','Orientation',0,'overview'],['light2','光照 PSII','Light input II',guide.start,'psii'],
  ['water','激发与水供电子','Charge separation',a.emit,'psii'],['relay','链间电子传递','Electron relay',guide.q.start,'relay'],
  ['protons','H⁺ 转移','Proton gradient',hStart,'relay'],['atp','ATP 合成','ATP synthesis',atpStart,'atp'],
  ['light1','光照 PSI','Light input I',lightIStart,'psi'],['fd','电子传给 Fd','Electron transfer',a.psi,'psi'],
  ['nadph','NADPH 合成','NADPH formation',b.arrive,'nadph'],['coupled','协同运行','Coupled overview',coupledStart,'overview']
 ];
 return{speed:TRANSIT_SPEED,duration:end,stages:stageData.map(([id,zh,en,start,focus])=>({id,zh,en,start,focus})),
  pairs:[guide,coupled],electrons,electronPaths,nadpPaths,atpPaths,protons:h,returns:returnEvents,atpCycles,
  atpWindows:[{start:atpStart,end:atpEnd},{start:coupledStart,end}],oxygen,water:{start:a.emit,end:a.emit+waterDuration},
  lightDuration,lights:{psii:electrons.map(e=>({id:e.id,start:e.emit-lightDuration,end:e.emit})),psi:electrons.map(e=>({id:e.id,start:e.psi-lightDuration,end:e.psi}))},
  coupledStart,hStart,atpStart};
}
