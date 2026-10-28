// Deterministic teaching state. Times are seconds, never RAF milliseconds.
export const DURATION = 32;
export const STAGES = Object.freeze([
  {id:'replication',zh:'复制',en:'DNA replication',start:0,end:4},
  {id:'meiosis-1',zh:'减数Ⅰ',en:'Meiosis I',start:4,end:20},
  {id:'meiosis-2',zh:'减数Ⅱ',en:'Meiosis II',start:20,end:29},
  {id:'gamete-formation',zh:'配子形成',en:'Haploid products',start:29,end:32}
]);
export const COLUMNS = Object.freeze([
  {id:'segregation',title:'分离定律',short:'分离',pairCount:1,linked:false},
  {id:'independent-assortment',title:'自由组合定律',short:'自由组合',pairCount:2,linked:false},
  {id:'linkage-crossover',title:'连锁与交换',short:'连锁交换',pairCount:1,linked:true}
]);
export const ROWS = Object.freeze([
  {time:0,y:110,label:'复制前'}, {time:4,y:320,label:'复制完成'},
  {time:13,y:550,label:'减Ⅰ前期'}, {time:15,y:780,label:'减Ⅰ中期'},
  {time:20,y:1030,label:'减Ⅰ完成'}, {time:32,y:1320,label:'四个单倍体产物'}
]);
export const WORLD_HEIGHT=1460;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const mix=(a,b,p)=>a+(b-a)*p;
export const unit=(t,a,b)=>clamp((t-a)/(b-a),0,1);
export const smooth=p=>p*p*(3-2*p);
export function normalizeConditions(c={}) {return {arrangement:c.arrangement==='repulsion'?'repulsion':'coupling',exchange:c.exchange==='none'?'none':'cross'};}
export function stageAt(t){return t<4?0:t<20?1:t<29?2:3;}
export function centerAt(t){
  if(t<4)return mix(110,320,smooth(unit(t,0,4)));
  if(t<7)return mix(320,550,smooth(unit(t,4,7)));
  if(t<13)return 550;
  if(t<15)return mix(550,780,smooth(unit(t,13,15)));
  if(t<20)return mix(780,1030,smooth(unit(t,15,20)));
  return mix(1030,1320,smooth(unit(t,20,29)));
}
export function phaseAt(t){return t<4?'DNA复制':t<7?'同源染色体联会':t<13?'减Ⅰ前期 · 条件对照':t<15?'减Ⅰ中期 · 排列':t<20?'同源染色体分离':t<29?'姐妹染色单体分离':'四产物与群体规律';}
export function definitions(column){
  const list=[];
  for(let pair=0;pair<column.pairCount;pair++)for(let origin=1;origin<=2;origin++)for(let sister=0;sister<2;sister++){
    const id=`${column.id}:P${pair+1}:${origin}:${sister}`;
    const gene=pair===1?'B':'A';
    list.push({id,pair,origin,sister,sisterGroupId:`${column.id}:P${pair+1}:${origin}`,
      proximalId:id+':proximal',distalId:id+':distal',
      proximalAllele:column.linked?(origin===1?'A':'a'):null,
      distalAllele:column.linked?(origin===1?'B':'b'):(origin===1?gene:gene.toLowerCase())});
  }
  return list;
}
const allDefinitions=COLUMNS.map(definitions);
export function evaluateColumn(index,time,conditions={}){
  const column=COLUMNS[index],t=clamp(Number(time)||0,0,DURATION),c=normalizeConditions(conditions);
  const replicated=unit(t,0,4),exchange=column.linked&&c.exchange==='cross'?unit(t,7,13):0;
  const reconnected=exchange>=.5;
  const defs=allDefinitions[index];
  const chromatids=defs.map(d=>{
    let donor=d;
    // Material identity survives reconnection: only the attachment changes.
    if(reconnected&&((d.origin===1&&d.sister===1)||(d.origin===2&&d.sister===0)))
      donor=defs.find(x=>x.origin===3-d.origin&&x.sister===1-d.sister);
    let pole=d.origin-1;
    if(index===1&&d.pair===1&&c.arrangement==='repulsion')pole=1-pole;
    const g=d.proximalAllele?d.proximalAllele+donor.distalAllele:donor.distalAllele;
    return {...d,distalId:donor.distalId,distalOrigin:donor.origin,distalAllele:donor.distalAllele,alleles:g,pole,
      cellId:t>=29?`G${pole*2+d.sister+1}`:t>=20?`C${pole+1}`:'C0',
      visible:d.sister===0||replicated>0,copyProgress:d.sister===0?1:replicated,
      recombinant:column.linked&&donor.origin!==d.origin};
  });
  const products=Array.from({length:4},(_,i)=>{
    const rods=chromatids.filter(x=>x.pole===Math.floor(i/2)&&x.sister===i%2).sort((a,b)=>a.pair-b.pair);
    return {id:'G'+(i+1),genotype:rods.map(x=>x.alleles).join(''),chromatidIds:rods.map(x=>x.id),formed:t>=29};
  });
  const count=t===0?{chromosomes:column.pairCount*2,dna:column.pairCount*2,cells:1,settled:true}:
    t<4?{cells:1,settled:false}:
    t<=15?{chromosomes:column.pairCount*2,dna:column.pairCount*4,cells:1,settled:true}:
    t<20?{cells:1,settled:false}:
    t===20?{chromosomes:column.pairCount,dna:column.pairCount*2,cells:2,settled:true}:
    t<29?{cells:2,settled:false}:{chromosomes:column.pairCount,dna:column.pairCount,cells:4,settled:true};
  return {id:column.id,index,time:t,stageIndex:stageAt(t),phase:phaseAt(t),conditions:c,replicated,exchange,reconnected,
    chromatids,products,counts:count,centerY:centerAt(t),condition: index===0?'Aa · 标记位点无互换':index===1?(c.arrangement==='coupling'?'AaBb · AB｜ab':'AaBb · Ab｜aB'):(c.exchange==='cross'?'AB/ab · 一次区间互换':'AB/ab · 本次区间不互换')};
}
export function evaluate(time,conditions){return COLUMNS.map((_,i)=>evaluateColumn(i,time,conditions));}

// Layout changes only spacing; every rod, segment and allele has stable identity.
export function geometry(state,width){
  const W=Math.max(80,width),cx=W/2,t=state.time,cy=state.centerY,index=state.index;
  const copied=smooth(state.replicated),pro=smooth(unit(t,4,7)),align=smooth(unit(t,13,15));
  const first=smooth(unit(t,15,20)),second=smooth(unit(t,20,29));
  const midSplit=smooth(unit(t,20,23));
  const gap=Math.min(11,Math.max(6.5,W*.045));
  const exchangeGap=Math.min(24,W*.095);
  const baseSpread=Math.min(62,W*.22),pairSpread=state.index===2?exchangeGap*2:gap*2;
  const spread=t<13?mix(baseSpread,pairSpread,pro):mix(pairSpread,baseSpread,align);
  const rods=state.chromatids.map(d=>{
    const side=d.origin===1?-1:1;
    let orientation=side,rotationY=0;
    if(index===1&&d.pair===1&&state.conditions.arrangement==='repulsion'){
      orientation=side*Math.cos(Math.PI*align);
      rotationY=side*Math.sin(Math.PI*align)*24;
    }
    const localGap=index===2?mix(gap,exchangeGap,pro*(1-align)):gap;
    const sisterOffset=(d.sister===0?-1:1)*localGap*copied;
    let x=cx+orientation*spread+sisterOffset;
    const childX=W*(d.pole===0?.255:.745);
    x=mix(x,childX+sisterOffset,first);
    const pairOffset=index===1?(d.pair===0?-Math.min(10,W*.036):Math.min(10,W*.036)):0;
    const productX=W*[.125,.375,.625,.875][d.pole*2+d.sister]+pairOffset;
    x=mix(x,productX,second);
    const pairY=index===1?(d.pair===0?-37:37):0;
    let y=cy+mix(pairY+rotationY,index===1?(d.pair===0?-10:11):0,second);
    const h=index===1?(d.pair===0?56:36):88;
    const top=y-h/2,cut=top+h*.61,bottom=top+h;
    let proximalEndX=x,distalX=x;
    if(index===2&&state.exchange>0&&state.exchange<1&&((d.origin===1&&d.sister===1)||(d.origin===2&&d.sister===0))){
      const approach=smooth(unit(state.exchange,0,.35)),release=smooth(unit(state.exchange,.65,1));
      proximalEndX=mix(x,cx,approach*(1-release));
      // At reconnection both fragments meet at the same locus. Original distal
      // pieces stay in place, then travel to their new chromatid as they resolve.
      distalX=state.reconnected?mix(2*cx-x,x,release):x;
    }
    const terminal=top+(bottom-top)*d.copyProgress;
    return {...d,x,y,h,top,cut,bottom,proximalEndX,distalX,terminal,
      distalLabelY:index===2?top+h*.82:top+h*.62,
      centromereY:top+h*.2,centromereSeparated:midSplit,
      proximalPath:`M${x} ${top} L${x} ${Math.min(cut-14,terminal)} Q${x} ${Math.min(cut-4,terminal)} ${proximalEndX} ${Math.min(cut,terminal)}`,
      distalPath:terminal<=cut?'':`M${proximalEndX} ${cut} Q${distalX} ${Math.min(cut+12,terminal)} ${distalX} ${Math.min(cut+22,terminal)} L${distalX} ${terminal}`};
  });
  return {width:W,centerY:cy,rods,first,second,copied,midSplit};
}
