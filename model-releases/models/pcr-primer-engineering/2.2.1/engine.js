// The motif, nucleotide coordinates, colors, row layout and timeline contract
// are copied from pcr-product-types@2.3.0. Each synthetic tail has its own
// homology domain; an overlapping original flank is never its complement.
export const BASE_COLORS=Object.freeze({A:'#ef6f84',T:'#35b98a',C:'#3186c7',G:'#f1bd45'});
export const STRAND_COLORS=Object.freeze({original:'#a41734',new:'#075b35',primer:'#9d4a07'});
export const STRAND_FILLS=Object.freeze({original:'#c8526a',new:'#388a61',primer:'#bf7d3e'});
export const COMPLEMENT=Object.freeze({A:'T',T:'A',C:'G',G:'C'});
const SOURCE_MOTIF='ATGCCATGACGTTACGGTACAGCTTCAGGATCCGATGC';
export const SEQUENCE=(SOURCE_MOTIF.repeat(3)).slice(0,84);
export const GEOMETRY=Object.freeze({bases:84,left:15,right:69,primer:18,step:14,width:1440,height:640,dnaX:142,scale:.86,thirdScale:.62,gap:44,rowTop:62,rowBottom:608,initialPrimerOffset:60,tailBend:17,mutationIndex:24,mismatchPeak:12});
export const MODES=Object.freeze(['restriction','mutation']);
export const STAGES=Object.freeze([{id:'template',zh:'引物设计',en:'Primer design'},{id:'cycle-1',zh:'第一轮',en:'First cycle'},{id:'cycle-2',zh:'第二轮',en:'Second cycle'},{id:'cycle-3',zh:'第三轮',en:'Third cycle'},{id:'products',zh:'目标产物',en:'Target products'}]);
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const baseX=q=>GEOMETRY.dnaX+q*GEOMETRY.step*GEOMETRY.scale;
export const viewX=(view,q)=>GEOMETRY.dnaX+view.x+q*GEOMETRY.step*(view.scale??GEOMETRY.scale);
const primerEntryX=(strand,scale)=>-GEOMETRY.dnaX-(primerBounds(strand).reduce((a,b)=>a+b)/2)*GEOMETRY.step*scale-40;
export const rowY=(count,index)=>GEOMETRY.rowTop+(index+.5)*(GEOMETRY.rowBottom-GEOMETRY.rowTop)/count;
export const tokenKey=t=>`${t.domain}:${t.q}`;
function residue(q,base,domain='gene',role='original',feature=null){return Object.freeze({q,base,domain,role,feature});}
export function primerTokens(dir,mode){
  if(!MODES.includes(mode)||![1,-1].includes(dir))throw new RangeError('无效的引物模式或方向');
  const {left,right,primer,mutationIndex}=GEOMETRY,a=dir===1?left:right-primer,b=dir===1?left+primer:right,tokens=[];
  for(let q=a;q<b;q++)tokens.push(residue(q,mode==='mutation'&&dir===1&&q===mutationIndex?'C':dir===1?SEQUENCE[q]:COMPLEMENT[SEQUENCE[q]],'gene','primer',mode==='mutation'&&dir===1&&q===mutationIndex?'mutation':null));
  if(mode==='restriction'){
    // Four protective bases and six recognition bases. These are illustrative,
    // not an experimental primer prescription. R is stored left-to-right.
    const tail=dir===1?'GCGCGAATTC':[...'GCGCGGATCC'].reverse().join(''),start=dir===1?5:right;
    for(let i=0;i<tail.length;i++)tokens.push(residue(start+i,tail[i],dir===1?'left-tail':'right-tail','primer',(dir===1?i>=4:i<6)?'site':'protect'));
  }
  return tokens.sort((a,b)=>a.q-b.q);
}
function strand(id,dir,tokens,cycle=0,templateId=null){
  return Object.freeze({id,dir,tokens:Object.freeze(tokens),start:tokens[0].q,end:tokens.at(-1).q+1,origin:cycle===0?'original':'new',createdCycle:cycle,templateId});
}
export function kind(pair){
  const gene=pair.flatMap(s=>s.tokens.filter(t=>t.domain==='gene').map(t=>t.q));
  const a=Math.min(...gene)<GEOMETRY.left,b=Math.max(...gene)>=GEOMETRY.right;
  return a&&b?'double':a||b?'single':'exact';
}
export const categoryName=type=>({double:'双长型DNA',single:'单长型DNA',exact:'目标DNA'}[type]);
export function pairInfo(pair){
  const at=(s,q)=>s.tokens.find(t=>t.domain==='gene'&&t.q===q)?.base;
  const a=at(pair[0],GEOMETRY.mutationIndex),b=at(pair[1],GEOMETRY.mutationIndex);
  const siteEnds=['left-tail','right-tail'].filter(domain=>pair.every(s=>s.tokens.filter(t=>t.domain===domain&&t.feature==='site').length===6)).length;
  return {kind:kind(pair),siteEnds,mutant:a==='C'&&b==='G',mismatch:a==='C'&&b==='A',wildtype:a==='T'&&b==='A'};
}
export function makeLineage(mode){
  if(!MODES.includes(mode))throw new RangeError('未知模式');
  const strands=[strand(0,1,[...SEQUENCE].map((b,q)=>residue(q,b))),strand(1,-1,[...SEQUENCE].map((b,q)=>residue(q,COMPLEMENT[b])))];
  const pair=[strands[0],strands[1]],rounds=[{cycle:0,products:[pair],orderedPairs:[pair],templates:[]}],rank={double:0,single:1,exact:2};
  for(let cycle=1;cycle<=3;cycle++){
    const beforePairs=rounds[cycle-1].orderedPairs,templates=beforePairs.flat();
    const products=templates.map(parent=>{
      const dir=-parent.dir,primer=primerTokens(dir,mode),copied=parent.tokens.filter(t=>dir===1?t.q>=GEOMETRY.left+GEOMETRY.primer:t.q<GEOMETRY.right-GEOMETRY.primer).map(t=>residue(t.q,COMPLEMENT[t.base],t.domain,'new',t.feature));
      const child=strand(strands.length,dir,[...primer,...copied].sort((a,b)=>a.q-b.q),cycle,parent.id);strands.push(child);
      return [parent,child].sort((a,b)=>b.dir-a.dir);
    });
    rounds.push({cycle,beforePairs,templates,products,orderedPairs:[...products].sort((a,b)=>rank[kind(a)]-rank[kind(b)])});
  }
  return {mode,strands,rounds};
}
export function counts(lineage,n){
  const pairs=lineage.rounds[n].products,info=pairs.map(pairInfo);
  return {total:pairs.length,double:n?info.filter(p=>p.kind==='double').length:0,single:info.filter(p=>p.kind==='single').length,exact:info.filter(p=>p.kind==='exact').length,oneSite:info.filter(p=>p.siteEnds===1).length,twoSites:info.filter(p=>p.siteEnds===2).length,mutant:info.filter(p=>p.mutant).length,mismatch:info.filter(p=>p.mismatch).length,wildtype:info.filter(p=>p.wildtype).length};
}
export const extensionGroups=round=>['double','single','exact'].map(groupType=>({groupType,templates:round.products.map((pair,i)=>kind(pair)===groupType?i:-1).filter(i=>i>=0)})).filter(g=>g.templates.length);
export function buildTimeline(lineage){
  const segments=[];let t=0;
  const add=(phase,cycle,duration,extra={})=>{segments.push({phase,cycle,templates:[],finishedTemplates:[],...extra,start:t,end:t+duration,duration});t+=duration;};
  add('setup',0,1.6);
  for(let cycle=1;cycle<=3;cycle++){
    add('denature',cycle,2.4);add('anneal',cycle,2.4);
    let finishedTemplates=[];const groups=extensionGroups(lineage.rounds[cycle]);
    groups.forEach((group,groupIndex)=>{add('extend',cycle,4.2,{...group,groupIndex,groupCount:groups.length,finishedTemplates:[...finishedTemplates]});finishedTemplates.push(...group.templates);});
    add('collect',cycle,1.5);
  }
  add('result',3,2.4);return {segments,duration:t,lineage};
}
export function stateAt(timeline,time){
  const t=clamp(time,0,timeline.duration),done=t===timeline.duration,index=done?timeline.segments.length-1:timeline.segments.findIndex(s=>t<s.end),segment=timeline.segments[index],{phase,cycle}=segment,p=clamp((t-segment.start)/segment.duration);
  const completed=phase==='setup'?0:['collect','result'].includes(phase)?cycle:cycle-1;
  return {...segment,time:t,index,p,done,stage:phase==='setup'?0:phase==='result'?4:cycle,completed,counts:counts(timeline.lineage,completed),progress:t/timeline.duration,extension:phase==='extend'?smooth((p-.06)/.86):0,phaseName:{setup:'引物定位',denature:'变性',anneal:'复性（退火）',extend:'分组同步延伸',collect:'本轮产物',result:'三轮完成'}[phase],temperature:phase==='setup'?25:phase==='denature'?95:phase==='anneal'?55:72};
}
export function primerBounds(s){const a=s.dir===1?s.start:GEOMETRY.right-GEOMETRY.primer,b=s.dir===1?GEOMETRY.left+GEOMETRY.primer:s.end;return [a,b];}
export function growingBounds(s,p){const[a,b]=primerBounds(s);return s.dir===1?[a,lerp(b,s.end,clamp(p))]:[lerp(a,s.start,clamp(p)),b];}
export function detailFrame(state,lineage){
  const s=state.phase==='result'?{...state,phase:'collect',p:1}:state,G=GEOMETRY;
  if(s.phase==='setup'){
    const pair=lineage.rounds[0].products[0],center=rowY(1,0),placement=smooth(s.p/.55);
    const views=pair.map(strand=>({strand,x:0,y:center-strand.dir*G.gap/2,scale:G.scale,start:strand.start,end:strand.end,opacity:1,row:0,partner:pair.find(p=>p!==strand),bound:1,tailActivation:1}));
    for(const strand of lineage.strands.slice(2,4)){const[start,end]=primerBounds(strand);views.push({strand,x:lerp(primerEntryX(strand,G.scale),0,placement),y:center+strand.dir*G.initialPrimerOffset,scale:G.scale,start,end,opacity:1,row:-1,bound:0,growth:0,tailActivation:0});}
    return {views,bonds:[{pair,views:views.slice(0,2),opacity:1}],rows:[{y:center,label:'起始模板',type:null,state:'initial',opacity:1}],activeRows:[],phase:s.phase,cycle:0,scale:G.scale,x:0};
  }
  const round=lineage.rounds[s.cycle],views=[],bonds=[],rows=[],split=s.phase==='denature'?smooth(s.p):1,binding=s.phase==='anneal'?(s.cycle===1?smooth((s.p-.20)/.66):smooth((s.p-.76)/.20)):s.phase==='denature'?0:1,sort=s.phase==='collect'?smooth(s.p/.86):0;
  const scale=s.cycle===3?lerp(G.scale,G.thirdScale,split):G.scale,ratio=scale/G.scale,layoutX=(G.scale-scale)*G.bases*G.step/2,gap=G.gap*ratio,arrival=s.phase==='anneal'?smooth(s.p/.78):s.phase==='denature'?0:1;
  round.templates.forEach((template,i)=>{
    const pair=round.products[i],child=pair.find(p=>p!==template),destination=lerp(rowY(round.templates.length,i),rowY(round.templates.length,round.orderedPairs.indexOf(pair)),sort),old=rowY(round.beforePairs.length,Math.floor(i/2)),y=lerp(old,destination,split);
    const active=s.phase==='extend'&&s.templates.includes(i),previous=s.phase==='extend'&&s.finishedTemplates.includes(i),growth=s.phase==='collect'||previous?1:active?s.extension:0,[start,end]=growingBounds(child,growth);
    let childY=y-child.dir*gap/2+(1-arrival)*child.dir*28*ratio;
    if(s.cycle===1&&['denature','anneal'].includes(s.phase))childY=lerp(rowY(1,0)+child.dir*G.initialPrimerOffset,y-child.dir*G.gap/2,binding);
    const priorPartner=round.beforePairs[Math.floor(i/2)].find(p=>p!==template);
    const inheritedMismatch=template.tokens.some(t=>t.q===G.mutationIndex&&t.feature==='mutation'&&t.base==='C')&&priorPartner.tokens.some(t=>t.domain==='gene'&&t.q===G.mutationIndex&&t.base==='A');
    const parentView={strand:template,x:layoutX,y:y-template.dir*gap/2,scale,start:template.start,end:template.end,opacity:1,row:i,partner:child,bound:binding,tailActivation:1,inheritedMismatch,priorPartner:s.phase==='denature'?priorPartner:null,priorStrength:1-split};
    const childView={strand:child,x:s.cycle===1?0:lerp(primerEntryX(child,scale),layoutX,arrival),y:childY,scale,start,end,opacity:s.cycle===1?1:s.phase==='denature'?0:s.phase==='anneal'?smooth(s.p/.12):1,row:i,partner:template,bound:binding,growth,tailActivation:binding};
    views.push(parentView,childView);
    if(s.phase!=='denature')bonds.push({pair,views:template.dir===1?[parentView,childView]:[childView,parentView],opacity:binding,row:i});
    rows.push({y,label:`${s.phase==='collect'||previous||active&&s.p>=.92?'产物':'模板'} ${i+1}`,type:kind(pair),templateId:template.id,childId:child.id,state:s.phase==='collect'||previous?'complete':active?'active':'waiting',opacity:split});
  });
  if(s.phase==='denature')round.beforePairs.forEach(pair=>{bonds.push({pair,views:pair.map(p=>views.find(v=>v.strand===p)),opacity:1-smooth(s.p/.65)});});
  return {views,bonds,rows,activeRows:s.phase==='extend'?s.templates:state.phase==='result'?rows.flatMap((r,i)=>r.type==='exact'?[i]:[]):[],phase:s.phase,cycle:s.cycle,scale,x:layoutX};
}
export function visibleResidue(view,t){return clamp(view.end-t.q)*clamp(t.q+1-view.start);}
function complementary(a,b){return b&&a.domain===b.domain&&a.q===b.q&&COMPLEMENT[a.base]===b.base;}
export function pairedResidues(a,b){const map=new Map(b.tokens.map(t=>[tokenKey(t),t]));return a.tokens.flatMap(t=>complementary(t,map.get(tokenKey(t)))?[t]:[]);}
export function tailOffset(view,t,frame){
  if(t.domain==='gene')return 0;
  let strength=0;
  if(view.priorPartner){const partner=view.priorPartner.tokens.find(p=>tokenKey(p)===tokenKey(t));if(complementary(t,partner))strength=view.priorStrength;}
  const mate=frame.views.find(v=>v.strand===view.partner),token=mate?.strand.tokens.find(p=>tokenKey(p)===tokenKey(t));
  if(mate&&complementary(t,token))strength=Math.max(strength,view.bound*visibleResidue(mate,token));
  return -view.strand.dir*GEOMETRY.tailBend*smooth((t.domain==='left-tail'?GEOMETRY.left-t.q:t.q-GEOMETRY.right+1)/4)*(1-strength)*(view.tailActivation??1);
}
export function residueOffset(view,t,frame){
  if(t.domain!=='gene')return tailOffset(view,t,frame);
  if(t.feature!=='mutation'||t.base!=='C')return 0;
  const mismatch=partner=>{const mate=partner?.tokens.find(p=>tokenKey(p)===tokenKey(t));return mate&&COMPLEMENT[t.base]!==mate.base;};
  let strength=mismatch(view.priorPartner)?view.priorStrength:0;
  const mate=frame.views.find(v=>v.strand===view.partner),token=mate?.strand.tokens.find(p=>tokenKey(p)===tokenKey(t));
  if(mate&&mismatch(mate.strand))strength=Math.max(strength,view.bound*visibleResidue(mate,token));
  // Retain the small teaching marker on a previously mismatched template until
  // the correctly complementary base is actually synthesized. No bases added.
  if(view.inheritedMismatch){const paired=mate&&token&&COMPLEMENT[t.base]===token.base?view.bound*visibleResidue(mate,token):0;strength=Math.max(strength,1-paired);}
  return strength?-view.strand.dir*GEOMETRY.mismatchPeak*strength:0;
}
export const stageTime=(timeline,i)=>timeline.segments.find(s=>i===0?s.phase==='setup':i===4?s.phase==='result':s.cycle===i&&s.phase==='denature')?.start??timeline.duration;
export function cycleTime(timeline,cycle,result=false){const seg=timeline.segments.find(s=>s.cycle===cycle&&s.phase===(result?'collect':'denature'));if(!seg)throw new RangeError('无效轮次');return seg.start+(result?seg.duration*.98:0);}
export function selectedPair(state,lineage){
  if(state.phase==='setup')return {pair:lineage.rounds[1].products[1],index:1,feature:lineage.mode==='mutation'?'mutation':'left-tail'};
  const round=lineage.rounds[state.cycle];
  let index=state.phase==='extend'&&lineage.mode==='mutation'?state.templates.find(i=>pairInfo(round.products[i]).mutant):undefined;
  if(index===undefined&&state.phase==='extend')index=state.templates.find(i=>round.products[i].some(s=>s.tokens.some(t=>lineage.mode==='mutation'?t.feature==='mutation':t.domain==='left-tail')));
  if(index===undefined&&['denature','anneal'].includes(state.phase)&&lineage.mode==='mutation')index=round.products.findIndex(p=>pairInfo(p).mismatch);
  if(index===undefined)index=round.products.findIndex(p=>state.cycle===3?kind(p)==='exact':state.cycle===2?lineage.mode==='restriction'?pairInfo(p).siteEnds===1&&p.every(s=>s.tokens.some(t=>t.domain==='left-tail')):pairInfo(p).mutant:lineage.mode==='restriction'?p.some(s=>s.dir===1&&s.origin==='new'):pairInfo(p).mismatch);
  index=Math.max(0,index);const pair=round.products[index];let feature='mutation';
  if(lineage.mode==='restriction'){
    const child=pair.find(s=>s.createdCycle===state.cycle),copied=state.phase==='extend'?child?.tokens.find(t=>t.role==='new'&&t.feature==='site')?.domain:null;
    const paired=['left-tail','right-tail'].find(domain=>pair.every(s=>s.tokens.some(t=>t.domain===domain&&t.feature==='site')));
    feature=copied??(['collect','result'].includes(state.phase)?paired:null)??(pair.some(s=>s.tokens.some(t=>t.domain==='left-tail'))?'left-tail':'right-tail');
  }
  return {pair,index,feature};
}
