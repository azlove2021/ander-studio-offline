// Illustrative succession stages, not calibrated ecological years or a growth law.
export const DURATION=60;
export const TIMES=Object.freeze([0,12,24,36,48,60]);
export const STAGES=Object.freeze([
 ['initial','初始条件','Initial sites'],['pioneers','先锋定居','Pioneer establishment'],
 ['expansion','植被扩展','Vegetation expansion'],['turnover','群落更替','Community turnover'],
 ['woodland','木本发展','Woody establishment'],['forest','森林形成','Forest development']
].map(([id,zh,en])=>Object.freeze({id,title:{zh,en}})));
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,t)=>{const f=clamp((t-a)/(b-a));return f*f*(3-2*f)};
export const mix=(a,b,t)=>a+(b-a)*t;
export function phaseAt(time){const p=clamp(time,0,DURATION)/12,i=Math.min(5,Math.floor(p));return i===5?5:i+smooth(.25,.90,p-i)}
export function stageAt(time){return Math.min(5,Math.floor(phaseAt(time)+.5))}
const states={
 primary:{
  names:['裸岩','地衣定居','苔藓扩展','草本群落','灌木与幼树','乔木占优势的森林'],
  notes:['岩面暴露，缺乏发育的土壤基础。','风化与先锋生物共同促进基质改变。','苔藓覆盖增加，碎屑与有机质逐步积累。','草本定居，根系和土壤进一步发展。','灌木占据更多空间，幼树逐步长大。','乔木形成上层，林下仍有灌木和草本。'],
  soil:[0,.08,.22,.53,.80,1],lichen:[0,1,.8,.45,.23,.16],moss:[0,0,1,.65,.45,.35],
  annual:[0,0,.05,1,.45,.12],grass:[0,0,0,.75,.65,.35],
  smallShrub:[0,0,0,.05,.75,.3],shrub:[0,0,0,0,.85,.52],trees:[0,0,0,.025,.28,1],
  deadwood:[0,0,0,0,0,0],butterfly:[0,0,.1,.85,.6,.35],bird:[0,0,.03,.35,.65,.8],mouse:[0,0,0,.1,.35,.6],insect:[0,0,.3,.8,.7,.6]
 },
 secondary:{
  names:['火后的森林遗迹','一年生草本为主','多年生草本增加','灌木开始建立','灌木丛与幼树','恢复中的森林'],
  notes:['土壤尚存，部分种子与地下器官保留。','草本萌发，存活地下器官也可重新抽芽。','多年生草本扩展，与一年生植物共存。','小灌木建立，草本仍占据部分空间。','灌木与幼树共存，群落层次逐步增加。','森林形成，林下植被和部分倒木保留。'],
  soil:[.78,.8,.84,.9,.95,1],lichen:[0,0,0,.03,.06,.1],moss:[0,.02,.12,.25,.32,.38],
  annual:[0,1,.5,.27,.18,.12],grass:[0,.25,1,.8,.6,.35],
  smallShrub:[0,.04,.1,.85,.6,.28],shrub:[0,0,.02,.2,.92,.52],trees:[0,0,.035,.13,.38,1],
  deadwood:[1,.98,.86,.74,.58,.40],butterfly:[0,.35,.75,.7,.5,.35],bird:[.08,.25,.4,.6,.75,.85],mouse:[0,.05,.2,.3,.45,.6],insect:[.05,.4,.8,.75,.65,.6]
 }
};
export const KIND_NAMES=Object.freeze({primary:'初生演替',secondary:'次生演替'});
export function sceneState(kind,time){
 const source=states[kind];if(!source)throw new RangeError('未知演替类型。');
 const phase=phaseAt(time),i=Math.min(4,Math.floor(phase)),f=phase-i,stage=stageAt(time),out={kind,phase,stage,name:source.names[stage],note:source.notes[stage]};
 for(const [k,values]of Object.entries(source))if(!['names','notes'].includes(k))out[k]=mix(values[i],values[i+1],f);
 out.smoke=kind==='secondary'?1-smooth(0,5,clamp(time,0,DURATION)):0;
 out.roots=kind==='primary'?smooth(1.8,4.5,phase):mix(.5,1,phase/5);
 out.retainedPropagules=kind==='secondary';return out;
}
export function getScience(primaryTime,secondaryTime=primaryTime){const t=clamp(primaryTime,0,DURATION),u=clamp(secondaryTime,0,DURATION);return {time:t,times:{primary:t,secondary:u},phase:phaseAt(t),stage:stageAt(t),primary:sceneState('primary',t),secondary:sceneState('secondary',u)}}
export function seededRandom(seed){let n=seed>>>0;return()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296}}
// Model-space anchors are stable through all stages; y is the surface contact.
export function vegetationObjects(kind){
 const rand=seededRandom(kind==='primary'?8342:6197),objects=[];
 const add=(type,count,width,ymin,ymax)=>{for(let i=0;i<count;i++){const y=mix(ymin,ymax,rand());objects.push({id:kind+'-'+type+'-'+i,type,x:65+(i+.15+.7*rand())/count*870,y,width:width*mix(.75,1.2,rand())*(.75+.25*(y/640)),seed:rand()*20,flip:rand()>.5?1:-1})}};
 add('lichen',13,125,495,645);add('moss',13,130,500,642);add('annual',17,124,505,638);add('grass',19,111,505,642);
 add('smallShrub',7,200,485,590);add('shrub',7,235,490,620);
 const trees=[{x:135,y:515,width:315},{x:415,y:500,width:355},{x:790,y:500,width:350},{x:905,y:560,width:335},{x:290,y:580,width:350},{x:610,y:555,width:365}];
 trees.forEach((v,i)=>objects.push({id:kind+'-tree-'+i,type:'trees',...v,seed:i*3.13+(kind==='secondary'?1.2:0),flip:i%2?1:-1}));
 return Object.freeze(objects.sort((a,b)=>a.y-b.y).map(Object.freeze));
}
