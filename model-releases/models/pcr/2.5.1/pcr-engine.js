// Pure scientific/timeline state. Seconds here are presentation seconds.
export const BASE_COLORS = Object.freeze({A:'#ef6f84',T:'#35b98a',C:'#3186c7',G:'#f1bd45'});
const MOTIF = 'ATGCCATGACGTTACGGTACAGCTTCAGGATCCGATGC';
export const SEQUENCE = (MOTIF + MOTIF).slice(0,54);
export const COMPLEMENT = Object.freeze({A:'T',T:'A',C:'G',G:'C'});
export const PAIRED = [...SEQUENCE].map(b=>COMPLEMENT[b]).join('');
export const PRIMER_LENGTH = 18;
export const COUNT_CAP = 16;
export const DETAILED_CYCLES = 4;
export const SUMMARY_CAP = 256;
export const SUMMARY_SECONDS = Object.freeze([0,.22,.22,.46]);
export const STEP = 14;
export const LENGTH = STEP * 53;
export const STRAND_COLORS = Object.freeze({original:'#b6203a',new:'#096a3e',primer:'#aa5208'});
export const STRAND_FILLS = Object.freeze({original:'#df8b99',new:'#75b397',primer:'#d8a16e'});
export const SCENE = Object.freeze({
  width:1210,height:600,
  reactor:Object.freeze({x:8,y:96,width:1194,height:496}),
  grid:Object.freeze({x:24,y:132,width:1162,height:442}),
  stockCenters:Object.freeze([180,485,790,1095]),
  source:Object.freeze({x:107,y:31,scale:.08}),
  dntp:Object.freeze({x:398,y:54,step:58,scale:.7}),
  primerF:Object.freeze({x:790,y:42,scale:.37}),
  primerR:Object.freeze({x:790,y:69,scale:.37}),
  taq:Object.freeze({x:1095,y:52,scale:.52}),
  thermometer:Object.freeze({bottom:313,units:3.6}),
});
// Lineage is persistent: becoming a template in a later cycle never turns a
// newly made strand into one of the two original strands. The bounded drawing
// retains both original-bearing molecules; it is not a proportionate sample.
export function isOriginalStrand(cycle,index,half,cap=COUNT_CAP){
  const parents=Math.min(cap,2**(Math.max(1,cycle)-1));
  return half===0?index===0:index===parents-1;
}
export function retainedHalf(cycle,index){
  return isOriginalStrand(cycle,index,1)?1:0;
}
export const STAGES = Object.freeze([
  {id:'initial',zh:'预变性',en:'Initial denaturation',temp:95,hold:120,seconds:4},
  {id:'denature',zh:'变性',en:'Denaturation',temp:95,hold:30,seconds:2},
  {id:'anneal',zh:'复性（退火）',en:'Annealing',temp:55,hold:30,seconds:3},
  {id:'extend',zh:'延伸',en:'Extension',temp:72,hold:60,seconds:6},
  {id:'final',zh:'最后延伸',en:'Final extension',temp:72,hold:300,seconds:4},
]);
export const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth = v=>{const p=clamp(v);return p*p*(3-2*p);};
export const lerp = (a,b,p)=>a+(b-a)*p;
export function validCycles(n){return Number.isInteger(n)&&n>=1&&n<=40;}
export function buildTimeline(cycles=30){
  if(!validCycles(cycles))throw new RangeError('循环数须为 1–40 的整数');
  const segments=[]; let start=0,realStart=0;
  function add(stage,cycle,duration,hold){segments.push({stage,cycle,start,end:start+duration,duration,realStart,hold});start+=duration;realStart+=hold;}
  add(-1,0,2.4,0);
  add(0,0,STAGES[0].seconds,STAGES[0].hold);
  for(let cycle=1;cycle<=cycles;cycle++)for(let stage=1;stage<=3;stage++)add(stage,cycle,cycle>DETAILED_CYCLES?SUMMARY_SECONDS[stage]:STAGES[stage].seconds,STAGES[stage].hold);
  add(4,cycles,STAGES[4].seconds,STAGES[4].hold);
  return {cycles,segments,duration:start,physicalSeconds:realStart};
}
export function stateAt(timeline,time){
  const t=clamp(time,0,timeline.duration),done=t>=timeline.duration;
  const index=done?timeline.segments.length-1:timeline.segments.findIndex(s=>t<s.end);
  const segment=timeline.segments[index],p=clamp((t-segment.start)/segment.duration),stage=segment.stage;
  let completed=stage===4?timeline.cycles:Math.max(0,segment.cycle-1);
  // Chain synthesis ends before the daughter-layout transition.
  if(stage===3&&p>=.82)completed=segment.cycle;
  const previousTemp=stage===0?25:stage===2?95:stage===3?55:stage===1&&segment.cycle>1?72:95;
  const temp=stage===-1?25:stage===4?72:lerp(previousTemp,STAGES[stage].temp,smooth(p/.24));
  const summary=segment.cycle>DETAILED_CYCLES;
  const summaryOffset=stage===2?SUMMARY_SECONDS[1]:stage===3?SUMMARY_SECONDS[1]+SUMMARY_SECONDS[2]:0;
  const cycleProgress=stage===4?1:summary?(summaryOffset+p*segment.duration)/SUMMARY_SECONDS.reduce((a,b)=>a+b,0):0;
  return {time:t,index,segment,stage,cycle:segment.cycle,p,done,completed,copies:2**completed,temp,summary,cycleProgress,
    progress:t/timeline.duration,physicalSeconds:segment.realStart+segment.hold*p,
    synthesis:stage===3?clamp((p-.24)/.58):stage===4?1:0,
    arrange:stage===3?smooth((p-.82)/.18):stage===4?1:0};
}
export function stageTime(timeline,stage,cycle=1){
  return timeline.segments.find(s=>s.stage===stage&&(stage===0||stage===4||s.cycle===cycle))?.start??0;
}
export function layout(count,index){
  const n=Math.min(COUNT_CAP,count),cols=n<=2?1:n<=8?2:4,rows=Math.ceil(n/cols);
  const {x,y,width,height}=SCENE.grid,cellW=width/cols,cellH=height/rows;
  // Preserve full molecule/enzyme geometry at one uniform scale. Extra room
  // serves the two separated templates, their growing daughters and end labels.
  const scale=Math.min(1.35,(cellW-36)/(LENGTH+78),(cellH-12)/236);
  const col=index%cols,row=Math.floor(index/cols);
  return {x:x+cellW*(col+.5),y:y+cellH*(row+.5),scale};
}
// Bounded overview: one lightweight double-strand symbol per molecule, then a
// static sample. This only changes presentation; completed counts remain 2^n.
export function summaryLayout(count,index){
  const n=Math.min(SUMMARY_CAP,count),cols=n<=16?4:n<=64?8:16,rows=Math.ceil(n/cols);
  const {x,y,width,height}=SCENE.grid,cellW=width/cols,cellH=height/rows;
  return {x:x+cellW*(index%cols+.5),y:y+cellH*(Math.floor(index/cols)+.5),scale:Math.min(3,(cellW-10)/80,(cellH-5)/18)};
}
export function growingTip(top,progress){
  const count=PRIMER_LENGTH+(54-PRIMER_LENGTH)*clamp(progress);
  return top?LENGTH/2-(count-1)*STEP:-LENGTH/2+(count-1)*STEP;
}
export function incorporatedBase(top,step){
  const i=top?54-PRIMER_LENGTH-1-step:PRIMER_LENGTH+step;
  return (top?PAIRED:SEQUENCE)[Math.max(0,Math.min(53,i))];
}
export function stopAfterCycle(timeline,state){
  const endCycle=state.stage===4?timeline.cycles:Math.max(1,state.cycle);
  return buildTimeline(Math.min(endCycle,timeline.cycles));
}
