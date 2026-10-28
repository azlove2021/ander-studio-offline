// One educational cohort; seconds describe presentation time, not cellular kinetics.
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const smooth=(t,a,b)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p)};
export const MODES={
 aerobic:{title:'有氧呼吸',duration:42,starts:[0,11,26],stages:[['糖酵解','Glycolysis'],['丙酮酸彻底氧化','Pyruvate oxidation & TCA'],['氧化磷酸化','Oxidative phosphorylation']],notes:['葡萄糖在细胞质基质中形成丙酮酸和还原力，净得 2 ATP。此阶段不直接消耗 O₂。','丙酮酸进入线粒体基质，经氧化和三羧酸循环释放 CO₂，形成还原力及少量 ATP。','内膜上的反应利用还原力，O₂ 在此参与形成水，释放的能量用于合成大量 ATP。'],energy:'ATP：少量 → 少量 → 大量'},
 lactate:{title:'无氧呼吸（乳酸发酵）',duration:30,starts:[0,11],stages:[['糖酵解','Glycolysis'],['乳酸形成','Lactate fermentation'],['无第三阶段','Not applicable']],notes:['葡萄糖在细胞质基质中形成丙酮酸和还原力，净得 2 ATP。','丙酮酸在细胞质基质中被还原为乳酸，再生 NAD⁺。不释放 CO₂，不再产生 ATP。'],energy:'总净得 2 ATP／葡萄糖'},
 ethanol:{title:'无氧呼吸（酒精发酵）',duration:30,starts:[0,11],stages:[['糖酵解','Glycolysis'],['乙醇和 CO₂ 形成','Alcoholic fermentation'],['无第三阶段','Not applicable']],notes:['葡萄糖在细胞质基质中形成丙酮酸和还原力，净得 2 ATP。','丙酮酸在细胞质基质中先脱羧形成乙醛，再被还原为乙醇；释放 CO₂，再生 NAD⁺，不再产生 ATP。'],energy:'总净得 2 ATP／葡萄糖'}
};
export function config(mode){if(!Object.hasOwn(MODES,mode))throw new RangeError('无效呼吸方式。');return MODES[mode]}
export function stageAt(mode,t){const starts=config(mode).starts;return starts.reduce((index,value,i)=>t>=value?i:index,0)}
// End-point stoichiometry, with school-level [H] bookkeeping. ATP totals in
// aerobic respiration deliberately stay qualitative; no universal 38 ATP claim.
export const REACTIONS=Object.freeze({
 glycolysis:{site:'cytosol',substrates:{glucose:1},products:{pyruvate:2,reducingH:4},netATP:2},
 matrix:{site:'matrix',substrates:{pyruvate:2,water:6},products:{co2:6,reducingH:20},ATP:'small'},
 oxidative:{site:'inner-membrane',substrates:{reducingH:24,oxygen:6},products:{water:12},ATP:'large'},
 lactate:{site:'cytosol',substrates:{pyruvate:2,reducingH:4},products:{lactate:2},netATP:0},
 ethanol:{site:'cytosol',substrates:{pyruvate:2,reducingH:4},products:{ethanol:2,co2:2},netATP:0}
});
export function stateAt(mode,time){
 const c=config(mode),t=clamp(time,0,c.duration),stage=stageAt(mode,t);
 const glycolysis=smooth(t,2,8),matrix=mode==='aerobic'?smooth(t,17,23):0;
 const decarboxylation=mode==='ethanol'?smooth(t,16,20):0;
 const reduction=mode==='lactate'?smooth(t,18,24):mode==='ethanol'?smooth(t,22,26):0;
 const oxidative=mode==='aerobic'?smooth(t,32,38):0;
 // A cohort balance for tests/diagnostics, not a quantitative rate model.
 const pool={glucose:1-glycolysis,pyruvate:2*(glycolysis-(mode==='aerobic'?matrix:mode==='ethanol'?decarboxylation:reduction)),acetaldehyde:2*(decarboxylation-(mode==='ethanol'?reduction:0)),lactate:mode==='lactate'?2*reduction:0,ethanol:mode==='ethanol'?2*reduction:0,co2:6*matrix+2*decarboxylation};
 const reducingH=4*glycolysis+20*matrix-24*oxidative-(mode==='aerobic'?0:4*reduction);
 return{mode,time:t,duration:c.duration,progress:t/c.duration,stage,stageProgress:clamp((t-c.starts[stage])/((c.starts[stage+1]??c.duration)-c.starts[stage])),completed:t>=c.duration,site:stage===0||mode!=='aerobic'?'cytosol':stage===1?'matrix':'inner-membrane',glycolysis,matrix,decarboxylation,reduction,oxidative,pool,reducingH,oxygenConsumed:6*oxidative,waterConsumed:6*matrix,waterFormed:12*oxidative,glycolysisNetATP:2*glycolysis,fermentationSecondATP:0,note:c.notes[stage]};
}
