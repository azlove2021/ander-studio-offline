// Geometry, relative concentrations and hydrostatic balance from the approved v2 design.
export const liquids=Object.freeze({
 water:{name:'清水',concentration:0},
 low:{name:'低浓度蔗糖',concentration:1},
 high:{name:'高浓度蔗糖',concentration:2}
});
export const stages=[['初始条件','Initial conditions'],['净渗透与液面变化','Net osmosis'],['趋近平衡','Approaching equilibrium'],['动态平衡','Dynamic equilibrium']];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const cubic=(v,t)=>(1-t)**3*v[0]+3*(1-t)**2*t*v[1]+3*(1-t)*t*t*v[2]+t**3*v[3];
// These are the existing SVG funnel inner-wall Bezier control points.
export function funnelHalfWidth(y){
 if(y<=339)return 9;
 const xs=y<=398?[321,321,291,271]:[271,254,255,268];
 const ys=y<=398?[339,366,374,398]:[398,421,458,486];
 let a=0,b=1;
 for(let k=0;k<28;k++){const t=(a+b)/2;if(cubic(ys,t)<y)a=t;else b=t;}
 return 330-cubic(xs,(a+b)/2);
}
const top=55,bottom=486,step=.5;
const table=new Float64Array((bottom-top)/step+1);
for(let k=table.length-2;k>=0;k--){
 const y=top+k*step;
 table[k]=table[k+1]+Math.PI*step*(funnelHalfWidth(y)**2+funnelHalfWidth(y+step)**2)/2;
}
function volumeAt(y){
 const p=(clamp(y,top,bottom)-top)/step,k=Math.floor(p),f=p-k;
 return table[k]*(1-f)+(table[Math.min(k+1,table.length-1)])*f;
}
const outsideVolumeAt=y=>Math.PI*172**2*(530-y)-volumeAt(y);
const initialHeight=314,vi0=volumeAt(initialHeight),vo0=outsideVolumeAt(initialHeight);
function inverseVolume(fn,volume,a,b){
 for(let k=0;k<38;k++){const mid=(a+b)/2;if(fn(mid)>volume)a=mid;else b=mid;}
 return(a+b)/2;
}
export function fromTransfer(q,cin,cout){
 const vi=vi0+q,vo=vo0-q;
 const inner=inverseVolume(volumeAt,vi,top,bottom);
 const outer=inverseVolume(outsideVolumeAt,vo,225,480);
 const ci=cin*vi0/vi,co=cout*vo0/vo;
 // 65 SVG units per relative concentration unit: schematic length only.
 const pressureBalance=65*(ci-co)-(outer-inner);
 return{q,vi,vo,inner,outer,ci,co,pressureBalance};
}
export function designState(inside='high',outside='water',stage=0){
 const a=liquids[inside],b=liquids[outside];
 if(!a||!b)throw new Error('Unknown liquid');
 const direction=Math.sign(a.concentration-b.concentration);
 const frame=clamp(Math.round(stage),0,3);
 let equilibriumTransfer=0;
 if(direction){
  let lo=-vi0*.96,hi=volumeAt(60)-vi0;
  for(let k=0;k<50;k++){
   const q=(lo+hi)/2;
   if(fromTransfer(q,a.concentration,b.concentration).pressureBalance>0)lo=q;else hi=q;
  }
  equilibriumTransfer=(lo+hi)/2;
 }
 const s=fromTransfer(equilibriumTransfer*[0,.52,.87,1][frame],a.concentration,b.concentration);
 const balanced=!direction||frame===3;
 const average=frame===0?'—':balanced?'平均相当':frame===2?'略多':'较多';
 const smaller=frame===0?'—':balanced?'平均相当':frame===2?'略少':'较少';
 const net=frame===0?'初始液面齐平':balanced?'净移动量为零':direction>0?'水净进入漏斗':'水净离开漏斗';
 const note=frame===0?'初始液面齐平；可切换阶段观察所选条件。':!direction?'两侧浓度相同，水双向交换，液面保持齐平。':frame===3?'液面稳定，水仍双向交换；两侧浓度不必相同。':frame===2?'液柱压力抵消部分渗透趋势，净移动量减小。':direction>0?'漏斗内更浓，水净进入漏斗，内液面升高。':'漏斗外更浓，水净离开漏斗，内液面降低。';
 return{...s,stage:frame,inside,outside,insideName:a.name,outsideName:b.name,direction,balanced,
  more:direction<0?smaller:average,less:direction<0?average:smaller,net,note,equilibriumTransfer,
  initialTotalVolume:vi0+vo0,initialInsideAmount:a.concentration*vi0,initialOutsideAmount:b.concentration*vo0};
}
const colors=[
 {top:'#bde5ef',mid:'#9fd3e2',bottom:'#7bbccc',surface:'#d3edf3',edge:'#70aeba',light:'#f1f9fb',text:'#467d8e'},
 {top:'#b7dcc9',mid:'#a2cfb8',bottom:'#85bba2',surface:'#d5e9de',edge:'#77ac96',light:'#f1f8f3',text:'#527f69'},
 {top:'#95ccb3',mid:'#78b69a',bottom:'#57997e',surface:'#b5daca',edge:'#43876d',light:'#edf6ef',text:'#396e58'}
];
const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
export function liquidPalette(concentration){
 const n=clamp(concentration,0,2),i=Math.floor(n),j=Math.min(2,i+1),t=n-i;
 return Object.fromEntries(Object.keys(colors[0]).map(k=>[k,mix(colors[i][k],colors[j][k],t)]));
}
