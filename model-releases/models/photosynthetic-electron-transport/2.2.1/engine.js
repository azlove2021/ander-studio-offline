// Deterministic teaching clock: guided attention first, coupled operation last.
import {clamp,progress,smooth,lerp,point,route,joinRoutes,FLOW_STYLE} from './path-utils.js';
import {makeTimeline,TRANSIT_SPEED} from './motion-timeline.js';
export {TRANSIT_SPEED};
export {clamp,progress,smooth,lerp,point,route,FLOW_STYLE};
export const WORLD=[1800,720];
const line=(a,b)=>route([[a,point([a,b],1/3),point([a,b],2/3),b]]);
export const ROUTES={
 waterElectron:route([[[225,470],[225,430],[225,375],[250,350]]]),
 psii:route([[[250,350],[275,325],[345,355],[385,355]]]),
 pq:line([385,355],[565,355]),pqReturn:route([[[565,355],[565,391],[415,391],[385,355]]]),
 b6f:route([[[565,355],[600,355],[645,400],[670,430]],[[670,430],[690,454],[705,460],[735,460]]]),
 pc:route([[[735,460],[800,460],[845,440],[900,415]]]),
 pcReturn:route([[[900,415],[885,510],[780,520],[735,460]]]),
 psi:route([[[900,415],[933,400],[945,335],[985,310]],[[985,310],[1006,296.875],[1006,245],[1040,228]]]),
 fd:route([[[1040,228],[1090,203],[1140,148],[1198,148]]]),nadph:route([[[1198,148],[1240,148],[1295,161],[1333,161]]]),fdReturn:route([[[1198,148],[1150,273],[1080,278],[1040,228]]]),
 water:line([165,620],[211,470]),waterRight:line([285,620],[239,470]),oxygen:line([225,470],[225,625]),
 waterH:line([280,475],[280,575]),pqH:line([385,225],[385,330]),cycleH:line([685,225],[685,350]),releaseH:line([685,350],[685,545]),fnrH:line([1160,65],[1200,135]),
 foIn:route([[[1510,555],[1510,500],[1510,420],[1510,392]],[[1510,392],[1510,375],[1530,368],[1540,368]]]),
 foRotor:route([[[1540,368],[1560,368],[1560,390],[1584,390]],[[1584,390],[1608,390],[1602,344],[1625,344]]]),
 foOut:route([[[1625,344],[1654,344],[1668,333],[1668,313]],[[1668,313],[1668,304],[1668,295],[1668,286]]])
};
export const PATHS=[['waterElectron','electron',false],['psii','electron',false],['pq','electron',false],['b6f','electron',false],['pc','electron',false],['psi','electron',false],['fd','electron',false],['nadph','electron',true],['pqReturn','carrier',true],['pcReturn','carrier',true],['fdReturn','carrier',true],['water','material',true],['oxygen','material',true],['waterH','proton',true],['pqH','proton',true],['cycleH','proton',false],['releaseH','proton',true],['fnrH','proton',true],['foIn','proton',false],['foRotor','proton',false],['foOut','proton',true]].map(([id,kind,arrow])=>({id,kind,arrow}));
// A lane has one uninterrupted base stroke and one terminal arrowhead.
// Teaching highlights are overlays; an inactive segment never erases its neighbour.
export const FLOW_LANES=[
 {id:'electron-chain',kind:'electron',ids:['waterElectron','psii','pq','b6f','pc','psi','fd','nadph'],segmented:true},
 ...['pqReturn','pcReturn','fdReturn'].map(id=>({id,kind:'carrier',ids:[id],offset:id==='pcReturn'?[0,25]:id==='fdReturn'?[0,22]:[0,0]})),
 {id:'water-in-left',kind:'material',ids:['water']},{id:'water-in-right',kind:'material',ids:['water'],geometry:['waterRight']},
 {id:'oxygen-out',kind:'material',ids:['oxygen']},
 {id:'water-H',kind:'proton',ids:['waterH']},{id:'PQ-H',kind:'proton',ids:['pqH']},
 {id:'b6f-H',kind:'proton',ids:['cycleH','releaseH']},
 {id:'FNR-H',kind:'proton',ids:['fnrH']},{id:'ATP-H',kind:'proton',ids:['foIn','foRotor','foOut']}
].map(lane=>({...lane,curve:joinRoutes((lane.geometry||lane.ids).map(id=>ROUTES[id]))}));
export const ATP_H_ROUTE=FLOW_LANES.find(l=>l.id==='ATP-H').curve;
const photonSegments=[[[115,75],[100,89],[100,100],[120,109]],[[120,109],[140,118],[140,130],[126,141]],[[126,141],[112,152],[120,163],[140,172]],[[140,172],[160,181],[160,193],[146,204]],[[146,204],[132,215],[158,229],[170,237]],[[170,237],[182,245],[198,268],[210,285]]];
export const LIGHT_ROUTES={psii:route(photonSegments),psi:route(photonSegments.map(s=>s.map(([x,y])=>[x+735,y-10])))};

export const TIMELINE=makeTimeline(ROUTES,LIGHT_ROUTES,ATP_H_ROUTE);
export const DURATION=Math.ceil(TIMELINE.duration*100)/100,STAGES=TIMELINE.stages,ELECTRONS=TIMELINE.electrons,RETURN_EVENTS=TIMELINE.returns;
const travelling=(t,e)=>t>=e.start&&t<e.end;
const at=(curve,t,start,end)=>curve.at(progress(t,start,end));
const zLoad=joinRoutes([line([265,146],[265,36]),line([265,36],[480,92])]);
const zFd=[-12,12].map(offset=>joinRoutes([line([790,26],[975,65]),line([975,65],[1140,91]),line([1140,91],[1140+offset,91])]));
function qAt(t){
 const pair=t>=TIMELINE.coupledStart?1:0,g=TIMELINE.pairs[pair],q=g.q,list=g.electrons;
 let xy=[385,355],mode='ready',moving=false;
 if(t>=q.start&&t<q.arrive){xy=at(ROUTES.pq,t,q.start,q.arrive);mode='delivery';moving=true;}
 else if(t>=q.arrive&&t<q.end){xy=[565,355];mode='net-cycle';}
 else if(t>=q.end&&t<q.reset){xy=at(ROUTES.pqReturn,t,q.end,q.reset);mode='return';moving=true;}
 else if(t>=list[0].emit&&t<q.start)mode='loading';
 const loaded=list.filter(e=>t>=e.loaded&&t<e.leave).length;
 return{xy,mode,pair,loaded,reduced:loaded===2,H:loaded===2?2:0,moving};
}
function pcJourney(e,t){
 let fraction,moving;
 if(t<e.dock){fraction=progress(t,e.pc,e.dock)*e.parkFraction;moving=t>=e.pc;}
 else if(e.resume!==undefined&&t>=e.resume){fraction=e.parkFraction+(1-e.parkFraction)*progress(t,e.resume,e.psi);moving=t<e.psi;}
 else{fraction=e.parkFraction;moving=false;}
 return{xy:ROUTES.pc.at(fraction),fraction,moving,routeId:moving?'pc':null};
}
function pcAt(t,index){
 for(const e of ELECTRONS.filter(e=>e.carrier===index)){
  if(t>=e.pc&&t<e.psi)return{...pcJourney(e,t),loaded:true,id:e.id,returning:false,visible:true};
  if(t>=e.psi&&t<e.pcReturnEnd)return{xy:at(ROUTES.pcReturn,t,e.psi,e.pcReturnEnd),loaded:false,returning:true,moving:true,visible:true};
 }
 return{xy:[735,460],loaded:false,returning:false,moving:false,visible:index===0};
}
function fdAt(t){
 for(const e of ELECTRONS){
  if(t>=e.fd&&t<e.fdArrive)return{xy:at(ROUTES.fd,t,e.fd,e.fdArrive),loaded:true,id:e.id,returning:false,moving:true};
  if(t>=e.fdArrive&&t<e.fdReturnEnd)return{xy:at(ROUTES.fdReturn,t,e.fdArrive,e.fdReturnEnd),loaded:false,returning:true,moving:true};
 }
 return{xy:[1040,228],loaded:false,returning:false,moving:false};
}
function electronAt(e,t,q){
 const slot=e.carrier?17:-17,offset=e.carrier?12:-12,paths=TIMELINE.electronPaths[e.carrier];
 let xy=[250,350],z=[265,146],routeId=null,site='PSII',moving=false;
 if(t<e.emit)return{...e,xy,z,visible:false,routeId,site:'reaction-centre',moving};
 if(t<e.loaded){const p=progress(t,e.emit,e.loaded);xy=paths.load.at(p);z=zLoad.at(p);routeId='psii';moving=true;}
 else if(t<e.leave){xy=[q.xy[0]+slot,q.xy[1]-31];routeId=q.mode==='delivery'?'pq':null;site=q.mode==='net-cycle'?'b6f':'PQ';moving=q.mode==='delivery';const c=TIMELINE.pairs[e.pair].q;z=point([[480,92],[610,112]],progress(t,c.start,c.arrive));}
 else if(t<e.pc){const p=progress(t,e.leave,e.pc);xy=paths.relay.at(p);z=point([[610,112],[735,138]],p);routeId='b6f';site='b6f';moving=true;}
 else if(t<e.psi){const p=pcJourney(e,t);xy=p.xy;routeId=p.routeId;site='PC';moving=p.moving;z=point([[735,138],[790,146]],p.fraction);}
 else if(t<e.fd){const p=progress(t,e.psi,e.fd);xy=ROUTES.psi.at(p);z=point([[790,146],[790,26]],p);routeId='psi';site='PSI';moving=true;}
 else if(t<e.arrive){xy=t<e.fdArrive?at(ROUTES.fd,t,e.fd,e.fdArrive):at(paths.fnr,t,e.fdArrive,e.arrive);z=at(zFd[e.carrier],t,e.fd,e.arrive);routeId='fd';site=t<e.fdArrive?'Fd':'FNR';moving=true;}
 else if(t<e.react){xy=[1198+offset,148];site='FNR';z=[1140+offset,91];}
 else{const p=progress(t,e.react,e.finish);xy=paths.redox.at(p);routeId='nadph';site='NADPH';z=[1140+offset*(1-p),91];moving=t<e.finish;}
 return{...e,xy,z,visible:t<e.finish,routeId,site,moving};
}
function lightAt(t,key){
 const events=TIMELINE.lights[key],packets=events.map(e=>({...e,on:travelling(t,e),progress:progress(t,e.start,e.end)}));
 let elapsed=0,merged=[];
 for(const e of events){const last=merged.at(-1);if(last&&e.start<=last.end)last.end=Math.max(last.end,e.end);else merged.push({start:e.start,end:e.end});}
 for(const e of merged)elapsed+=clamp(t-e.start,0,e.end-e.start);
 const absorption=Math.max(0,...events.map(e=>t>=e.end&&t<e.end+.45?(1-progress(t,e.end,e.end+.45))**2:0));
 return{active:packets.some(p=>p.on),phase:elapsed*TRANSIT_SPEED,packets:packets.filter(p=>p.on),absorption};
}
function nucleotideAt(e,t,keep,fadeStart=e.end){
 const p=TIMELINE.atpPaths,bind=progress(t,e.start,e.bound),join=progress(t,e.joinStart,e.formed),release=progress(t,e.formed,e.end);
 const xy=t<e.bound?p.in.at(bind):t<e.formed?[1580,228]:p.out.at(release),formed=t>=e.formed;
 const visible=t>=e.start&&(keep||t<fadeStart+.28);
 const fadeIn=e.index===0?1:progress(t,e.start,e.start+.12),fadeOut=keep?1:1-progress(t,fadeStart,fadeStart+.28);
 return{index:e.index,xy,bind,join,release,formed,bound:t>=e.bound&&t<e.formed,visible,opacity:Math.min(fadeIn,fadeOut),moving:t>=e.start&&t<e.bound||t>=e.formed&&t<e.end};
}
function synthesisAt(t){
 const cycles=TIMELINE.atpCycles,current=cycles.findLast(e=>t>=e.start)||cycles[0],window=TIMELINE.atpWindows.find(e=>travelling(t,e));
 const next=cycles[cycles.indexOf(current)+1],keep=!next||t<next.start;
 const nucs=[0,1].map(slot=>{
  const e=cycles.findLast(c=>c.slot===slot&&t>=c.start);
  if(!e)return{index:slot,xy:[1540,75],bind:0,join:0,release:0,formed:false,bound:false,visible:slot===0&&t<cycles[0].start,opacity:1,moving:false};
  const nextCycle=cycles[cycles.indexOf(e)+1];return nucleotideAt(e,t,!nextCycle||t<nextCycle.start,nextCycle?.start??e.end);
 });
 const n=nucleotideAt(current,t,keep),active=!!window,phase=progress(t,current.start,current.end);
 const local=TIMELINE.atpWindows.reduce((sum,w)=>sum+clamp(t-w.start,0,w.end-w.start),0);
 return{...n,nucleotides:nucs,active,phase,angle:local*110,complete:t>=DURATION,
  label:t<TIMELINE.atpStart?'ADP + Pi':t<current.bound?'ADP + Pi · 进入 F₁':t<current.joinStart?'H⁺到达 Fₒ · 驱动转动':t<current.formed?'催化位点 · 接入 Pi':t<current.end?'ATP · 释放到基质':'ATP · 已释放到基质'};
}
const notes={orientation:'按讲解顺序逐段观察，最后看协同运行；每个电子均经 PSII 与 PSI 两次激发。',light2:'金色光波向 PSII 推进；抵达后立即激发电子，光能与电子使用不同示踪。',water:'反应中心失去电子后由水氧化补回；第二次供电子接续进行，PQ 接满 2e⁻即出发。',relay:'PQH₂到达即交电子；两份 PC 各带 1e⁻，随后暂存于 PSI 一侧，供后面的光照步骤使用。',protons:'集中观察伴随的 H⁺净转移：水释 H⁺、PQ 取 H⁺与 b₆f 净作用接续建立腔侧梯度。',atp:'多个 H⁺连续经过 Fₒ，驱动转动；ADP 与 Pi 在 F₁结合，末端磷酸接入后立即释放 ATP。',light1:'光波向 PSI 推进；抵达后立即开始第二次激发与电子传递。',fd:'PSI → Fd → FNR 连续交接；Fd 空载返回后接续下一电子，每次只携带 1e⁻。',nadph:'FNR 凑足 2e⁻后，NADP⁺进入结合位点；电子与基质 H⁺交接后形成并释放 NADPH。',coupled:'协同运行：第二组电子、质子转移、两次光激发与 ATP 催化共同推进。'};
export function stateAt(requested){
 if(!Number.isFinite(requested))throw new RangeError('时间必须为有限数值');
 const t=clamp(requested,0,DURATION),stage=STAGES.findLastIndex(s=>t>=s.start),chapter=STAGES[stage],coupled=t>=TIMELINE.coupledStart;
 const q=qAt(t),electrons=ELECTRONS.map(e=>electronAt(e,t,q)),pcs=[pcAt(t,0),pcAt(t,1)],fd=fdAt(t);
 const replacements=ELECTRONS.map(e=>({id:e.id,xy:at(ROUTES.waterElectron,t,e.replacementStart,e.replacementEnd),visible:t>=e.replacementStart&&t<e.replacementEnd,moving:t>=e.replacementStart&&t<e.replacementEnd}));
 const protons=TIMELINE.protons.map(e=>({...e,xy:at(ROUTES[e.routeId],t,e.start,e.end),visible:travelling(t,e),moving:travelling(t,e)}));
 const returns=RETURN_EVENTS.map(e=>({...e,xy:at(ATP_H_ROUTE,t,e.start,e.end),visible:travelling(t,e),moving:travelling(t,e),progress:progress(t,e.start,e.end)}));
 const lights={psii:lightAt(t,'psii'),psi:lightAt(t,'psi')};
 const nadp=TIMELINE.pairs.map(g=>{const e=g.nadp,p=TIMELINE.nadpPaths[g.pair];return{id:'nadp-'+g.pair,xy:t<e.formed?at(p.in,t,e.start,e.bound):at(p.out,t,e.formed,e.end),reduced:t>=e.formed,forming:progress(t,e.react,e.formed),bound:t>=e.bound&&t<e.formed,complete:t>=e.end,moving:t>=e.start&&t<e.bound||t>=e.formed&&t<e.end};});
 const waterEntry=progress(t,TIMELINE.water.start,TIMELINE.water.end),oxygenProgress=progress(t,TIMELINE.oxygen.start,TIMELINE.oxygen.end);
 const waters=[0,1].map(i=>{const center=ROUTES.oxygen.at(oxygenProgress),offset=lerp(14,16,oxygenProgress)*(i?1:-1);return{xy:t>=TIMELINE.oxygen.start?[center[0]+offset,center[1]]:ROUTES[i?'waterRight':'water'].at(waterEntry),hydrogenVisible:t<TIMELINE.water.end,visible:t<TIMELINE.water.end||t>=TIMELINE.oxygen.start,moving:travelling(t,TIMELINE.water)||travelling(t,TIMELINE.oxygen)};});
 const synthesis=synthesisAt(t),active=new Set(electrons.filter(e=>e.visible&&e.routeId).map(e=>e.routeId));
 if(replacements.some(e=>e.visible))active.add('waterElectron');
 if(q.mode==='return')active.add('pqReturn');if(pcs.some(p=>p.returning))active.add('pcReturn');if(fd.returning)active.add('fdReturn');
 protons.filter(e=>e.visible).forEach(e=>active.add(e.routeId));
 if(returns.some(e=>e.visible))['foIn','foRotor','foOut'].forEach(id=>active.add(id));
 if(travelling(t,TIMELINE.water))active.add('water');if(travelling(t,TIMELINE.oxygen))active.add('oxygen');
 const sum=kind=>protons.filter(e=>e.kind===kind&&t>=e.end).reduce((n,e)=>n+e.quantity,0),complete=t>=DURATION;
 return{t,stage,stageId:chapter.id,focus:chapter.focus,coupled,q,electrons,replacements,pcs,pc:pcs[0],fd,protons,returns,lights,lightII:lights.psii.active,lightI:lights.psi.active,nadp,waters,
  waterEntry,oxygenProgress,oxygenVisible:t>=TIMELINE.oxygen.start,waterVisible:t<TIMELINE.water.end,oec:ELECTRONS.filter(e=>t>=e.replacementEnd).length,
  oxygen:t>=TIMELINE.oxygen.end?1:0,nadph:nadp.filter(n=>n.reduced).length,delivered:ELECTRONS.filter(e=>t>=e.finish).length,waterReleased:sum('water'),netTransport:sum('release'),fnrConsumed:sum('fnr'),
  gradient:t<TIMELINE.hStart?'待观察':t<TIMELINE.atpStart?'建立中':'已建立',gradientProgress:progress(t,TIMELINE.hStart,TIMELINE.atpStart),synthesis,active:[...active],
  note:complete?'本轮完成：2H₂O → 1O₂，4e⁻ → 2NADPH；ATP 示踪不换算固定产率。':notes[chapter.id],complete};
}
