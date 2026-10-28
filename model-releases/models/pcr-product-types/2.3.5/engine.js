// PCR product lineage and a deterministic teaching timeline. Time is in seconds.
// Base colors, sugar/backbone colors and the sequence motif are copied locally
// from pcr@2.4.0; this package has no runtime dependency on that model.
export const BASE_COLORS=Object.freeze({A:'#ef6f84',T:'#35b98a',C:'#3186c7',G:'#f1bd45'});
export const STRAND_COLORS=Object.freeze({original:'#a41734',new:'#075b35',primer:'#9d4a07'});
export const STRAND_FILLS=Object.freeze({original:'#c8526a',new:'#388a61',primer:'#bf7d3e'});
export const COMPLEMENT=Object.freeze({A:'T',T:'A',C:'G',G:'C'});
// The accepted motif is retained verbatim; the flanks extend the earlier 54-symbol drawing.
const SOURCE_MOTIF='ATGCCATGACGTTACGGTACAGCTTCAGGATCCGATGC';
export const SEQUENCE=(SOURCE_MOTIF.repeat(3)).slice(0,84);
export const PAIRED=[...SEQUENCE].map(b=>COMPLEMENT[b]).join('');
export const GEOMETRY=Object.freeze({bases:84,left:15,right:69,primer:18,step:14,width:1440,height:640,dnaX:142,scale:.86,gap:44,rowTop:62,rowBottom:608,initialPrimerOffset:60});
export const DETAILED_CYCLES=6;
export const STAGES=Object.freeze([
  {id:'template',zh:'内侧引物',en:'Internal primers'},
  {id:'cycle-1',zh:'第一轮',en:'First cycle'},
  {id:'cycle-2',zh:'第二轮',en:'Second cycle'},
  {id:'cycle-3',zh:'第三轮',en:'Third cycle'},
  {id:'cycle-4',zh:'第四轮',en:'Fourth cycle'},
  {id:'cycle-5',zh:'第五轮',en:'Fifth cycle'},
  {id:'cycle-6',zh:'第六轮',en:'Sixth cycle'},
  {id:'amplification',zh:'产物积累',en:'Product accumulation'},
]);
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const validCycles=n=>Number.isInteger(n)&&n>=1&&n<=40;
export const kind=pair=>{
  const longLeft=Math.min(...pair.map(s=>s.start))<GEOMETRY.left;
  const longRight=Math.max(...pair.map(s=>s.end))>GEOMETRY.right;
  return longLeft&&longRight?'double':longLeft||longRight?'single':'exact';
};
export const categoryName=type=>({double:'双长型DNA',single:'单长型DNA',exact:'目标DNA'}[type]);
export function counts(n){
  if(!Number.isInteger(n)||n<0||n>40)throw new RangeError('已完成轮次须为0–40的整数');
  return n===0?{total:1,double:0,single:0,exact:0}:{total:2**n,double:2,single:2*(n-1),exact:2**n-2*n};
}
export function makeLineage(max=3){
  if(!Number.isInteger(max)||max<1||max>12)throw new RangeError('详细谱系上限须为1–12');
  const strands=[{id:0,dir:1,start:0,end:84,origin:'original',createdCycle:0,templateId:null},{id:1,dir:-1,start:0,end:84,origin:'original',createdCycle:0,templateId:null}];
  const rounds=[{cycle:0,products:[[strands[0],strands[1]]],orderedPairs:[[strands[0],strands[1]]],templates:[]}];
  const rank={double:0,single:1,exact:2};
  for(let cycle=1;cycle<=max;cycle++){
    const beforePairs=rounds[cycle-1].orderedPairs;
    const templates=beforePairs.flat();
    const products=templates.map(template=>{
      const dir=-template.dir;
      const child={id:strands.length,dir,start:dir===1?GEOMETRY.left:template.start,end:dir===1?template.end:GEOMETRY.right,origin:'new',createdCycle:cycle,templateId:template.id};
      strands.push(child);
      return [template,child].sort((a,b)=>b.dir-a.dir);
    });
    const orderedPairs=[...products].sort((a,b)=>rank[kind(a)]-rank[kind(b)]);
    rounds.push({cycle,beforePairs,templates,products,orderedPairs});
  }
  return {strands,rounds};
}
export function buildTimeline(cycles=30){
  if(!validCycles(cycles))throw new RangeError('循环数须为1–40的整数');
  const segments=[],lineage=makeLineage(Math.min(DETAILED_CYCLES,cycles));let t=0;
  function add(phase,cycle,seconds,extra={}){segments.push({phase,cycle,template:-1,templates:[],finishedTemplates:[],...extra,start:t,end:t+seconds,duration:seconds});t+=seconds;}
  add('setup',0,2);
  for(let n=1;n<=Math.min(DETAILED_CYCLES,cycles);n++){
    add('denature',n,2.5);add('anneal',n,2);
    const groups=extensionGroups(lineage.rounds[n]);let finishedTemplates=[];
    groups.forEach((group,groupIndex)=>{
      add('extend',n,3.3,{template:group.templates[0],...group,groupIndex,groupCount:groups.length,finishedTemplates:[...finishedTemplates]});
      finishedTemplates.push(...group.templates);
    });
    add('collect',n,1.6);
  }
  for(let n=DETAILED_CYCLES+1;n<=cycles;n++)add('summary',n,1);
  add('final',cycles,2);
  return {cycles,segments,duration:t};
}
export function stateAt(timeline,time){
  const t=clamp(time,0,timeline.duration),done=t===timeline.duration;
  const index=done?timeline.segments.length-1:timeline.segments.findIndex(s=>t<s.end);
  const segment=timeline.segments[index],p=clamp((t-segment.start)/segment.duration),{phase,cycle,template}=segment;
  let completed=phase==='setup'?0:Math.max(0,cycle-1);
  if(phase==='collect'||phase==='final'||phase==='summary'&&p>=.72)completed=cycle;
  const stage=phase==='setup'?0:cycle<=DETAILED_CYCLES?cycle:DETAILED_CYCLES+1;
  const phaseName={setup:'引物定位',denature:'变性',anneal:'复性（退火）',extend:'分组同步延伸',collect:'本轮产物',summary:'数量积累',final:'最后延伸'}[phase];
  const extension=phase==='extend'?smooth((p-.08)/.78):0;
  const finished=phase==='collect'?2**cycle:phase==='extend'?segment.finishedTemplates.length+(p>=.86?segment.templates.length:0):0;
  const temperature=phase==='setup'?25:phase==='denature'?lerp(cycle===1?25:72,95,smooth(p/.36)):phase==='anneal'?lerp(95,55,smooth(p/.24)):phase==='extend'?lerp(segment.groupIndex===0?55:72,72,smooth(p/.08)):72;
  return {...segment,time:t,p,index,done,stage,phaseName,completed,counts:counts(completed),progress:t/timeline.duration,extension,finished,temperature,summary:cycle>DETAILED_CYCLES};
}
export function extensionGroups(round){return ['double','single','exact'].map(groupType=>({groupType,templates:round.products.map((pair,i)=>kind(pair)===groupType?i:-1).filter(i=>i>=0)})).filter(g=>g.templates.length);}
// One fixed teaching plane: early cycles retain their original positions;
// later cycles use two columns with uniform (not stretched) molecular scaling.
export function layoutHeight(){return GEOMETRY.height;}
export function layoutPanels(count){
  const scale=count<=8?1:count<=16?.45:count<=32?.32:.20;
  return Array.from({length:count<=8?1:2},(_,panel)=>({
    x:count<=8?0:panel*GEOMETRY.width/2+(GEOMETRY.width/2-GEOMETRY.width*scale)/2,
    scale,panel,
  }));
}
export function rowLayout(count,index){
  const panels=layoutPanels(count),perColumn=count/panels.length,panel=Math.floor(index/perColumn);
  return {...panels[panel],y:GEOMETRY.rowTop+(index%perColumn+.5)*(GEOMETRY.rowBottom-GEOMETRY.rowTop)/perColumn};
}
export function rowY(count,index){return rowLayout(count,index).y;}
function blendLayout(a,b,t){return {x:lerp(a.x,b.x,t),y:lerp(a.y??0,b.y??0,t),scale:lerp(a.scale,b.scale,t),panel:b.panel};}
export function baseX(position){return GEOMETRY.dnaX+position*GEOMETRY.step*GEOMETRY.scale;}
export function primerBounds(strand){return strand.dir===1?[GEOMETRY.left,GEOMETRY.left+GEOMETRY.primer]:[GEOMETRY.right-GEOMETRY.primer,GEOMETRY.right];}
export function growingBounds(strand,p){
  const [a,b]=primerBounds(strand);
  return strand.dir===1?[a,lerp(b,strand.end,clamp(p))]:[lerp(a,strand.start,clamp(p)),b];
}
export function detailFrame(state,lineage){
  let s=state;
  if(state.phase==='final'||state.summary)s={...state,cycle:Math.min(state.cycle,DETAILED_CYCLES),phase:'collect',p:1};
  if(s.phase==='setup'){
    const pair=lineage.rounds[0].products[0],center=rowY(1,0);
    const views=pair.map(strand=>({strand,x:0,scale:1,y:center-strand.dir*GEOMETRY.gap/2,start:strand.start,end:strand.end,opacity:1,row:0}));
    for(const strand of lineage.strands.slice(2,4)){const [start,end]=primerBounds(strand);views.push({strand,x:0,scale:1,y:center+strand.dir*GEOMETRY.initialPrimerOffset,start,end,opacity:1,row:-1,growth:0});}
    return {views,bonds:[{pair,start:0,end:84,top:center-GEOMETRY.gap/2,bottom:center+GEOMETRY.gap/2,topLayout:views[0],bottomLayout:views[1],opacity:1}],rows:[{x:0,scale:1,y:center,label:'起始模板',detail:'1 个双链 DNA',state:'initial'}],panels:layoutPanels(1),activeRows:[],height:GEOMETRY.height};
  }
  const round=lineage.rounds[s.cycle],views=[],bonds=[],rows=[];
  const split=s.phase==='denature'?smooth(s.p):1;
  const binding=s.phase==='anneal'?smooth((s.p-.28)/.57):s.phase==='denature'?0:1;
  const sort=s.phase==='collect'?smooth(s.p/.82):0;
  round.templates.forEach((template,i)=>{
    const product=round.products[i],child=product.find(strand=>strand.id!==template.id);
    const sortedIndex=round.orderedPairs.indexOf(product);
    const destination=blendLayout(rowLayout(round.templates.length,i),rowLayout(round.templates.length,sortedIndex),sort);
    const oldLayout=rowLayout(round.beforePairs.length,Math.floor(i/2));
    const layout=blendLayout(oldLayout,destination,split);
    const templateY=layout.y-template.dir*GEOMETRY.gap/2*layout.scale;
    let childY=layout.y+(-child.dir*GEOMETRY.gap/2+(1-binding)*child.dir*24)*layout.scale;
    // Initial primers wait in place while the template separates; only the
    // annealing step moves them directly onto their complementary binding sites.
    if(s.cycle===1&&['denature','anneal'].includes(s.phase)){
      const initialY=rowY(1,0)+child.dir*GEOMETRY.initialPrimerOffset;
      const boundY=layout.y-child.dir*GEOMETRY.gap/2*layout.scale;
      childY=lerp(initialY,boundY,binding);
    }
    const active=s.phase==='extend'&&s.templates.includes(i),previous=s.phase==='extend'&&s.finishedTemplates.includes(i);
    const growth=s.phase==='collect'||previous?1:active?s.extension:0;
    const [start,end]=growingBounds(child,growth);
    const parentView={strand:template,...layout,y:templateY,start:template.start,end:template.end,opacity:1,row:i};
    const childView={strand:child,...layout,y:childY,start,end,opacity:s.cycle===1?1:binding,row:i,growth};
    views.push(parentView,childView);
    if(s.phase!=='denature')bonds.push({pair:product,start:Math.max(template.start,start),end:Math.min(template.end,end),top:template.dir===1?templateY:childY,bottom:template.dir===1?childY:templateY,topLayout:template.dir===1?parentView:childView,bottomLayout:template.dir===1?childView:parentView,opacity:binding});
    const complete=s.phase==='collect'||previous||active&&s.p>=.86;
    rows.push({...layout,label:`${complete?'产物':'模板'} ${i+1}`,detail:template.origin==='original'?'初始母链':`第 ${template.createdCycle} 轮子链`,state:complete?'complete':active?'active':'waiting',templateId:template.id,childId:child.id,type:kind(product),opacity:split});
  });
  if(s.phase==='denature')round.beforePairs.forEach(pair=>{
    const top=views.find(v=>v.strand.id===pair[0].id),bottom=views.find(v=>v.strand.id===pair[1].id);
    bonds.push({pair,start:Math.max(...pair.map(s=>s.start)),end:Math.min(...pair.map(s=>s.end)),top:top.y,bottom:bottom.y,topLayout:top,bottomLayout:bottom,opacity:1-smooth(s.p/.66)});
  });
  const beforePanels=layoutPanels(round.beforePairs.length),nextPanels=layoutPanels(round.templates.length);
  const panels=nextPanels.map((panel,i)=>({...blendLayout(beforePanels[i]??beforePanels[0],panel,split),opacity:i<beforePanels.length?1:split}));
  return {views,bonds,rows,panels,activeRows:s.phase==='extend'?s.templates:[],height:GEOMETRY.height};
}
export function stageTime(timeline,index){
  const seg=timeline.segments.find(s=>index===0?s.phase==='setup':index===DETAILED_CYCLES+1?s.phase==='summary':s.cycle===index&&s.phase==='denature');
  return seg?.start??timeline.duration;
}
export function cycleTime(timeline,cycle,result=false){
  if(!Number.isInteger(cycle)||cycle<1||cycle>timeline.cycles)throw new RangeError('轮次超出计划范围');
  const seg=timeline.segments.find(s=>s.cycle===cycle&&(result?s.phase===(cycle<=DETAILED_CYCLES?'collect':'summary'):s.phase===(cycle<=DETAILED_CYCLES?'denature':'summary')));
  return seg.start+(result?seg.duration*.94:0);
}
