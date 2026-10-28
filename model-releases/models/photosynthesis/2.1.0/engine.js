// Educational presentation seconds, not biochemical rates. Two carbon cohorts
// make the regeneration and reuse visible while light reactions keep running.
export const DURATION=54;
export const STARTS=Object.freeze([0,9,30]);
export const OFFSETS=Object.freeze([0,24]);
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x)};
export const windowAt=(t,a,b,c,d)=>smooth(t,a,b)*(1-smooth(t,c,d));
export const stageAt=t=>t>=30?2:t>=9?1:0;
export function stateAt(time){
 if(!Number.isFinite(time))throw new TypeError('演示时间必须为有限数值。');
 const t=clamp(time,0,DURATION),cohorts=OFFSETS.map(offset=>{
  const u=t-offset;
  return{offset,time:u,charge:smooth(u,4,7),fixation:smooth(u,10,14),reduction:smooth(u,16,21),regeneration:smooth(u,24,28),export:smooth(u,25,29)};
 });
 const sum=key=>cohorts.reduce((n,c)=>n+c[key],0);
 const F=sum('fixation'),R=sum('reduction'),G=sum('regeneration'),E=sum('export'),charge=sum('charge');
 // Carbon-accounting cohort: 3 CO2 + 3 C5 -> 6 C3 -> 6 triose-P;
 // five triose-P regenerate three C5, one is a net product. This is not shown
 // as literal particle counts. Carriers are normalized to the Calvin demand,
 // not a claim about the ATP:NADPH yield of linear electron flow.
 const pools={c5:3-3*F+3*G,c3:6*(F-R),triose:6*R-5*G-E,exportedTriose:E,co2:6-3*F};
 const cofactors={atp:9*charge-6*R-3*G,adp:9-9*charge+6*R+3*G,nadph:6*charge-6*R,nadp:6-6*charge+6*R};
 let note,conversion,focus;
 const u=t<30?t:t-24;
 if(t>=DURATION){note='光反应与暗反应持续协同；C₅ 再生后可再次固定 CO₂。图中保留完整反应记录。';conversion='光能 → ATP、NADPH 中的化学能 → 糖类中的化学能';focus='complete';}
 else if(u<4){note='光合色素吸收光能，水在类囊体薄膜处参与光反应。';conversion='光能输入 · 水的光解';focus='light';}
 else if(u<9){note='水的光解释放 O₂，光反应形成 ATP 和 NADPH。';conversion='ADP + Pi → ATP　　NADP⁺ → NADPH';focus='supply';}
 else if(u<16){note='CO₂ 与 C₅ 化合物结合，形成 C₃ 化合物；ATP 和 NADPH 向暗反应侧传递。';conversion='CO₂ 固定：CO₂ + C₅ → 2 C₃';focus='fixation';}
 else if(u<24){note='C₃ 接受能量与还原力形成三碳糖；ATP 转为 ADP + Pi，NADPH 转为 NADP⁺。';conversion='C₃ 还原：ATP → ADP + Pi　　NADPH → NADP⁺';focus='reduction';}
 else{note='大部分三碳糖参与 C₅ 再生，部分用于合成糖类；ADP、Pi 和 NADP⁺ 返回光反应侧。';conversion='三碳糖 → C₅ 再生（需 ATP）／部分用于合成糖类';focus='regeneration';}
 return{time:t,duration:DURATION,progress:t/DURATION,stage:stageAt(t),completed:t===DURATION,lightActive:t>1&&t<DURATION,cohorts,pools,cofactors,fixation:F,reduction:R,regeneration:G,export:E,focus,note,conversion,carbonTotal:5*pools.c5+3*(pools.c3+pools.triose+pools.exportedTriose)+pools.co2};
}
