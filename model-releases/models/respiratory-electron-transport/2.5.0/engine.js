// Arrival-driven teaching clock; ATP remains the final chapter.
import {clamp,progress,smooth,lerp,point,route,straight,joinRoutes} from './motion-paths.js';
import {makeTimeline,TRANSIT_SPEED} from './motion-timeline.js';
export {clamp,progress,smooth,lerp,point,route,TRANSIT_SPEED};
export const ENTRIES=['nadh','succinate-via-II'];
export const ATLAS={I:[287,316],II:[609,311],III:[894,314],IV:[1166,316],synthase:[1451,430],qI:[465,321],qII:[735,321],qIII:[810,321]};
export const ROUTES={
 ...Object.fromEntries([0,1].flatMap(k=>[
  ['entry-I-'+k,route([[[195,497],[207,422],[247,385],[315,345]],[[315,345],[366,315],[414,320],[465+(k?20:-20),285]]])],
  ['entry-II-'+k,route([[[604,496],[645,470],[682,409],[700,359]],[[700,359],[710,333],[714,304],[735+(k?20:-20),285]]])],
  ['III-'+k,route([[[810+(k?20:-20),285],[858,340],[909,306],[937,254]],[[937,254],[947,236],[953,224],[964,215]]])]
 ])),
 cytc:route([[[964,215],[1029,179],[1094,204],[1132,266]]]),
 'cytc-return':route([[[1132,266],[1105,172],[1012,151],[964,215]]]),
 IV:route([[[1132,266],[1163,290],[1168,342],[1168,394]]]),
 'q-I':route([[[465,321],[580,321],[695,321],[810,321]]]),
 'q-II':route([[[735,321],[760,321],[785,321],[810,321]]]),
 'q-return-I':route([[[810,321],[735,352],[540,352],[465,321]]]),
 'q-return-II':route([[[810,321],[786,345],[759,345],[735,321]]]),
 'proton-I':straight([178,390],[178,114]),
 'proton-III':straight([815,390],[815,114]),
 'proton-Q':straight([815,321],[815,114]),
 'proton-IV':straight([1210,390],[1210,114]),
 'H-bus':straight([125,22],[1358,22]),
 'H-inlet':route([[[1358,22],[1370,22],[1378,30],[1378,42]],[[1378,42],[1378,119],[1378,218],[1378,284]],[[1378,284],[1378,301],[1393,307],[1410,307]]]),
 'H-rotor':route([[[1410,307],[1430,346],[1470,358],[1494,336]]]),
 'H-exit':route([[[1494,336],[1512,336],[1524,347],[1524,365]],[[1524,365],[1524,382],[1524,399],[1524,415]]]),
 'oxygen-in':route([[[1290,620],[1290,559],[1290,487],[1290,430]],[[1290,430],[1290,394],[1216,394],[1168,394]]]),
 'water-out':route([[[1168,394],[1214,394],[1250,419],[1250,455]],[[1250,455],[1250,510],[1250,565],[1250,620]]]),
 'chemical-H':route([[[1050,613],[1050,558],[1050,500],[1050,450]],[[1050,450],[1050,415],[1115,410],[1150,402]]])
};
export const FLOW_STYLE={electron:{color:'#bd6256',width:5.2,head:30,idle:.24},proton:{color:'#7795a4',width:5,head:26,idle:.23},carrier:{color:'#91a185',width:3.2,head:26,idle:.23},material:{color:'#b08a74',width:3.2,head:26,idle:.23}};
export const DRAWN_ROUTES=[
 ...[0,1].flatMap(k=>[{id:'entry-I-'+k,kind:'electron',entry:'nadh',arrow:k===1},{id:'entry-II-'+k,kind:'electron',entry:'succinate-via-II',arrow:k===1},{id:'III-'+k,kind:'electron',arrow:false}]),
 {id:'q-I',kind:'electron',entry:'nadh'},{id:'q-II',kind:'electron',entry:'succinate-via-II'},
 {id:'q-return-I',kind:'carrier',entry:'nadh'},{id:'q-return-II',kind:'carrier',entry:'succinate-via-II'},
 {id:'cytc',kind:'electron',arrow:false},{id:'cytc-return',kind:'carrier'},{id:'IV',kind:'electron'},
 ...['proton-I','proton-III','proton-IV','H-bus','H-inlet','H-rotor','H-exit','chemical-H'].map(id=>({id,kind:'proton',arrow:!['H-bus','H-inlet','H-rotor'].includes(id)})),
 {id:'oxygen-in',kind:'material'},{id:'water-out',kind:'material'}
];
export const TIMELINES=Object.fromEntries(ENTRIES.map(entry=>[entry,makeTimeline(entry,ROUTES)]));
export const durationFor=entry=>TIMELINES[entry].duration,stagesFor=entry=>TIMELINES[entry].stages;
export const DURATION=durationFor('nadh'),STAGES=stagesFor('nadh'),ARRIVALS=TIMELINES.nadh.electrons.map(e=>e.arrive);
const travelling=(t,start,end)=>t>=start&&t<end;
const at=(path,t,start,end)=>path.at(progress(t,start,end));
export function transferSchedule(entry){return TIMELINES[entry].transfers;}
export function stateAt(entry,requested){
 if(!ENTRIES.includes(entry)||!Number.isFinite(requested))throw new RangeError('无效的入口或进度');
 const T=TIMELINES[entry],duration=T.duration,t=clamp(requested,0,duration),isI=T.isI,stage=T.stages.findLastIndex(s=>t>=s.start),stageId=T.stages[stage].id;
 const pairs=T.pairs.map(g=>{
  const e=g.electrons,delivered=e.filter(e=>t>=e.loaded).length,emitted=e.filter(e=>t>=e.leave).length,q=g.q;
  const qMode=t===0||t>=q.reset?'ready':t<g.start?'ready':t<q.start?'loading':t<q.arrive?'delivery':t<q.end?'handoff':'return';
  const qXY=t<q.arrive?at(ROUTES[T.qRoute],t,q.start,q.arrive):t<q.end?ROUTES[T.qRoute].at(1):at(ROUTES[T.qBack],t,q.end,q.reset);
  const donor=g.donor,donorXY=g.id===0&&t<donor.release?donor.site:t<donor.bound?at(donor.in,t,donor.start,donor.bound):t<donor.release?donor.site:at(donor.out,t,donor.release,donor.end);
  const entryElectrons=e.map(e=>({id:e.id,p:progress(t,e.emit,e.loaded),route:e.entryRoute,visible:t>0&&travelling(t,e.emit,e.loaded),moving:t>0&&travelling(t,e.emit,e.loaded),xy:at(ROUTES[e.entryRoute],t,e.emit,e.loaded)}));
  const passageElectrons=e.map(e=>({id:e.id,p:progress(t,e.leave,e.cyt),route:e.relayRoute,visible:travelling(t,e.leave,e.cyt),moving:travelling(t,e.leave,e.cyt),xy:at(ROUTES[e.relayRoute],t,e.leave,e.cyt)}));
  return{id:g.id,start:g.start,oxidized:t>e[0].emit,active:travelling(t,g.start,q.reset),delivered,emitted,load:Math.max(0,delivered-emitted),qH:delivered===2?Math.max(0,2-T.transfers.filter(h=>h.site==='III'&&h.pair===g.id&&h.kind==='QH2'&&t>=h.start).length):0,q:qXY,qActive:travelling(t,g.start,q.reset),mode:qMode,route:T.qRoute,moving:qMode==='delivery'||qMode==='return',entryElectrons,passageElectrons,
   donor:{xy:donorXY,moving:travelling(t,donor.start,donor.bound)||travelling(t,donor.release,donor.end),mode:t<donor.bound?'incoming':t<donor.release?'bound':t<donor.end?'outgoing':'released'}};
 });
 const tracked=pairs[t>=T.pairs[1].start?1:0],qCarrier={...tracked,status:({ready:'Q 在入口旁 · 待接收 2e⁻',loading:'接收电子 '+tracked.delivered+' / 2',delivery:'QH₂ 携带 2e⁻ → III',handoff:'向 III 交接 · 剩余 '+tracked.load+'e⁻',return:'电子已交出 · Q 返回'})[tracked.mode]};
 let cyt={xy:[964,215],loaded:false,active:false,moving:false,trip:-1};
 for(const e of T.electrons){if(travelling(t,e.cyt,e.cytReturnEnd)){const loaded=t<e.arrive,routeId=loaded?'cytc':'cytc-return',start=loaded?e.cyt:e.arrive,end=loaded?e.arrive:e.cytReturnEnd;cyt={xy:at(ROUTES[routeId],t,start,end),loaded,active:true,moving:true,trip:e.id,flowRoute:routeId,flowP:progress(t,start,end)};break;}}
 const terminalElectrons=T.electrons.map(e=>({id:e.id,p:progress(t,e.arrive,e.finish),route:'IV',visible:travelling(t,e.arrive,e.finish),moving:travelling(t,e.arrive,e.finish),xy:at(ROUTES.IV,t,e.arrive,e.finish)}));
 const electrons=T.electrons.map(e=>{let xy,site,moving,visible=t>0&&t>=e.emit&&t<e.finish;
  if(t<e.loaded){xy=pairs[e.pair].entryElectrons[e.k].xy;site='entry';moving=visible;}
  else if(t<e.leave){const q=pairs[e.pair];xy=[q.q[0]+(e.k?20:-20),q.q[1]-36];site='Q';moving=q.mode==='delivery';}
  else if(t<e.cyt){xy=pairs[e.pair].passageElectrons[e.k].xy;site='III';moving=true;}
  else if(t<e.arrive){xy=at(ROUTES.cytc,t,e.cyt,e.arrive);site='cytc';moving=true;}
  else{xy=terminalElectrons[e.id].xy;site='IV';moving=t<e.finish;}
  return{id:e.id,xy,site,moving:visible&&moving,visible};
 });
 const transfers=T.transfers.map(h=>{
  const p=progress(t,h.start,h.end),back=h.returnPath?progress(t,h.returnStart,h.returnEnd):0;
  let xy=h.out.at(0),mode='matrix',flowRoute=null,flowP=0;
  if(travelling(t,h.start,h.end)){mode='outward';xy=h.out.at(p);if(t<h.stemEnd){flowRoute=h.routeId==='proton-Q'?'proton-III':h.routeId;flowP=progress(t,h.start,h.stemEnd);}}
  else if(t>=h.end&&(!h.returnPath||t<h.returnStart)){mode='ims';xy=h.ims;}
  else if(h.returnPath&&t>=h.returnStart){mode=t<h.returnEnd?'returning':'returned';xy=h.returnPath.at(back);if(mode==='returning'){const distance=back*h.returnPath.length,leg=h.returnLegs.find(l=>distance<l.end)||h.returnLegs.at(-1);flowRoute=leg.routeId;flowP=(distance-leg.begin)/(leg.end-leg.begin);}}
  return{id:h.id,site:h.site,pair:h.pair,kind:h.kind,start:h.start,end:h.end,ims:h.ims,p,back,returnStart:h.returnStart??null,returnDuration:h.returnPath?h.returnEnd-h.returnStart:0,xy,mode,flowRoute,flowP,visible:t>=h.start&&back<1,moving:mode==='outward'||mode==='returning'};
 });
 const chemicalH=T.chemical.map(h=>{const p=progress(t,h.start,h.end),moving=travelling(t,h.start,h.end);return{id:h.id,p,visible:t<h.end,moving,xy:h.path.at(p),flowRoute:moving&&p*h.path.length>=h.accessLength?'chemical-H':null,flowP:clamp((p*h.path.length-h.accessLength)/(h.path.length-h.accessLength))};});
 const oxygenApproach=progress(t,T.oxygen.start,T.oxygen.bound),oxygenReaction=progress(t,T.oxygen.reactionStart,T.oxygen.formed),waterP=progress(t,T.oxygen.formed,T.oxygen.end),oxygenXY=t<T.oxygen.formed?ROUTES['oxygen-in'].at(oxygenApproach):ROUTES['water-out'].at(waterP);
 const hOut=Object.fromEntries(['I','III','IV'].map(site=>[site,transfers.filter(h=>h.site===site&&h.p===1).length]));
 const gradientAmount=transfers.reduce((sum,h)=>sum+h.p-h.back,0),hasGradient=gradientAmount>.2;
 const phase=T.returning.reduce((n,h)=>n+progress(t,h.rotorStart,h.rotorEnd),0)/T.returning.length,active=transfers.some(h=>h.mode==='returning'),syn=T.synthesis;
 const synthesis={active,started:t>=T.couplingStart,angle:phase*360,phase,catalytic:[0,1,2].map(i=>{const q=i===0?phase:(phase+i/3)%1;return{id:i,phase:q,site:q<1/3?'binding':q<2/3?'closed':'release',active};}),
  bind:progress(t,syn.start,syn.bound),join:progress(t,syn.joinStart,syn.formed),release:progress(t,syn.formed,syn.end),bound:travelling(t,syn.bound,syn.formed),formed:t>=syn.formed,complete:t>=syn.end,
  xy:t<syn.bound?at(syn.in,t,syn.start,syn.bound):t<syn.formed?syn.in.at(1):at(syn.out,t,syn.formed,syn.end),moving:travelling(t,syn.start,syn.bound)||travelling(t,syn.formed,syn.end),rotorEngaged:t>=T.returning[0].rotorStart,
  label:t<T.couplingStart?'ADP + Pi · 最后一步合成':t<syn.start?'H⁺ 回流 · 接近 Fₒ':t<syn.bound?'ADP + Pi · 进入位点':t<syn.formed?'位点内接入末端 Pi':t<syn.end?'ATP · 正在释放':'ATP · 已从位点释放'};
 const flowActivity={},activate=(id,p)=>{if(id)flowActivity[id]={active:true,p:clamp(p)};};
 for(const e of [...pairs.flatMap(p=>p.entryElectrons),...pairs.flatMap(p=>p.passageElectrons),...terminalElectrons])if(e.visible)activate(e.route,e.p);
 if(cyt.active)activate(cyt.flowRoute,cyt.flowP);
 if(qCarrier.mode==='delivery')activate(T.qRoute,progress(t,T.pairs[qCarrier.id].q.start,T.pairs[qCarrier.id].q.arrive));
 if(qCarrier.mode==='return')activate(T.qBack,progress(t,T.pairs[qCarrier.id].q.end,T.pairs[qCarrier.id].q.reset));
 for(const h of [...transfers,...chemicalH])if(h.visible)activate(h.flowRoute,h.flowP);
 if(travelling(t,T.oxygen.start,T.oxygen.bound))activate('oxygen-in',oxygenApproach);
 if(travelling(t,T.oxygen.formed,T.oxygen.end))activate('water-out',waterP);
 const electronArrivals=T.electrons.filter(e=>t>=e.arrive).length,chemicalConsumed=chemicalH.filter(h=>h.p===1).length;
 const notes=[
  '首份底物已在结合位点；点击播放，电子立即开始传递。O₂ 在膜下方等待。',
  isI?'NADH 在 I 供电子；Q 接满 2e⁻即出发，I 同时泵出 H⁺。':'FAD/FADH₂ 固定于 II 内，电子交给膜内 Q；II 不泵 H⁺。',
  'Q：接收 → 递送 → 交接 → 返回。细胞色素 c 每次接力 1e⁻，空载返回后接续下一电子；III 为 Q 循环净过程。',
  '4e⁻与 4 个造水 H⁺到位后，原有两个氧原子形成两分子水并接续释放。',
  '最后单独演示 ATP 合成：原有 H⁺回流，ADP/Pi 到位即接入末端磷酸，形成后立即释放；不按粒子数量计算产率。'
 ];
 const reaction=stageId==='location'?'首份底物已结合 · 点击播放立即传递电子':stageId==='entry'?(isI?'NADH + H⁺ + Q → NAD⁺ + QH₂':'琥珀酸 + Q → 延胡索酸 + QH₂'):stageId==='transfer'?'第 '+(qCarrier.id+1)+' 批 · '+qCarrier.status+'（IV 已接收 '+electronArrivals+' / 4e⁻）':stageId==='oxygen'?(t<T.oxygen.formed?'O₂ + 4e⁻ + 4H⁺（基质） → 2H₂O':'2H₂O 接续释放；H⁺梯度储存势能'):synthesis.label;
 return{entry,t,stage,stageId,duration,complete:t===duration,focus:['orientation','entry','transfer','oxygen','synthase'][stage],note:notes[stage],reaction,pairs,qCarrier,electrons,cyts:[cyt],passageElectrons:pairs.flatMap(p=>p.passageElectrons),terminalElectrons,transfers,hOut,hOutTotal:Object.values(hOut).reduce((a,b)=>a+b,0),packetsComplete:T.pairs.filter(g=>t>=g.q.reset).length,
  hReturned:transfers.filter(h=>h.back===1).length,gradient:clamp(gradientAmount/(isI?20:12)),gradientAmount,hasGradient,gradientLabel:!hasGradient?'待建立':t<T.oxygen.formed?'建立中':t<T.couplingStart?'已储能':active?'供能合成':'剩余梯度',
  electronArrivals,chemicalConsumed,oxygenConsumed:t>=T.oxygen.formed?1:0,waterFormed:t>=T.oxygen.formed?2:0,oxygenReaction,oxygenXY,oxygenApproach,waterP,oxygenMoving:travelling(t,T.oxygen.start,T.oxygen.bound)||travelling(t,T.oxygen.formed,T.oxygen.end),chemicalH,flowActivity,synthesis,
  energyMode:t===0?'ready':t<T.oxygen.formed?'transfer':t<T.couplingStart?'gradient':'synthase',energyNode:t<T.pairs[0].q.start?0:t<T.couplingStart?1:2,noteUnit:'每批 2e⁻；外向净转移与造水 H⁺分开；只追踪部分回流 H⁺'};
}
