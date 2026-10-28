import {at,sampleCurve,niceCeiling,formatNumber,formatTime} from './engine.js';
const NS='http://www.w3.org/2000/svg';
const make=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);set(n,attrs);if(text!==undefined)n.textContent=text;return n;};
function set(n,a){for(const[k,v]of Object.entries(a))if(n.getAttribute(k)!==String(v))n.setAttribute(k,v);}
function text(n,value){if(n.textContent!==value)n.textContent=value;}
export class GrowthChart{
  constructor(svg,kind){this.svg=svg;this.kind=kind;this.comparisonKind=kind==='j'?'s':'j';this.key='';this.buildCount=0;}
  build(width,height,end){
    const svg=this.svg,left=width>=500?72:62,right=width-22,top=35,bottom=height-45;
    this.box={left,right,top,bottom,width,height};
    this.x=t=>left+t/end*(right-left);
    const x=this.x,gridY=i=>bottom-i/5*(bottom-top);
    set(svg,{viewBox:`0 0 ${width} ${height}`,'data-axis-scale':'linear'});
    const title=make('title'),defs=make('defs'),clip=make('clipPath',{id:`clip-${this.kind}`});
    clip.append(make('rect',{x:left,y:top,width:right-left,height:bottom-top}));defs.append(clip);
    const fill=make('linearGradient',{id:`area-${this.kind}`,x1:0,y1:0,x2:0,y2:1});
    fill.append(make('stop',{offset:'0%','stop-color':'var(--curve-color)','stop-opacity':'.17'}),make('stop',{offset:'100%','stop-color':'var(--curve-color)','stop-opacity':'.015'}));defs.append(fill);
    const base=make('g',{'data-chart-grid':this.kind});
    base.append(make('rect',{x:left,y:top,width:right-left,height:bottom-top,rx:8,class:'plot-frame','data-chart-frame':''}));
    base.append(make('text',{x:left,y:18,class:'axis-title','data-axis':'y'},'种群数量 N / 个'));
    this.ticks=[];
    for(let i=1;i<10;i++){
      if(this.kind==='s'&&(i===4||i===8))continue;
      base.append(make('line',{x1:left,x2:right,y1:gridY(i/2),y2:gridY(i/2),class:i%2?'gridline grid-minor':'gridline'}));
    }
    for(let i=0;i<=5;i++){
      base.append(make('line',{x1:left-4,x2:left,y1:gridY(i),y2:gridY(i),class:'axis-tick'}));
      const tick=make('text',{x:left-10,y:gridY(i)+4,'text-anchor':'end',class:'tick','data-y-tick':i});this.ticks.push(tick);base.append(tick);
    }
    const step=niceCeiling(end/(width<440?3:5)),times=[];
    for(let t=0;t<end-1e-7;t+=step)if(t===0||x(end)-x(t)>42)times.push(t);
    times.push(end);
    for(const t of times){
      if(t>0&&t<end)base.append(make('line',{x1:x(t),x2:x(t),y1:top,y2:bottom,class:'gridline grid-vertical'}));
      base.append(make('line',{x1:x(t),x2:x(t),y1:bottom,y2:bottom+5,class:'axis-tick'}));
      base.append(make('text',{x:x(t),y:bottom+22,'text-anchor':t===0?'start':t===end?'end':'middle',class:'tick'},formatTime(t)));
    }
    base.append(make('path',{d:`M${left},${top}V${bottom}H${right}`,class:'axis'}));
    base.append(make('text',{x:(left+right)/2,y:height-4,'text-anchor':'middle',class:'axis-title','data-axis':'x'},'时间 t / 年'));
    if(this.kind==='s'){
      for(const [value,label]of [[200,'K/2 = 200'],[400,'K = 400 · 环境容纳量']]){
        const y=gridY(value/100);
        base.append(make('line',{x1:left,x2:right,y1:y,y2:y,class:value===400?'reference reference-k':'reference'}));
        base.append(make('text',{x:left+12,y:y-9,class:'reference-label label-halo'},label));
      }
    }
    const live=make('g',{'clip-path':`url(#clip-${this.kind})`,'data-chart-live':this.kind});
    this.fill=make('path',{fill:`url(#area-${this.kind})`,'data-curve-fill':this.kind});
    this.comparison=make('path',{class:'comparison-curve','data-comparison-curve':this.comparisonKind});
    this.curve=make('path',{class:'curve','data-curve':this.kind});
    this.guide=make('path',{class:'current-guide'});
    this.tangent=make('line',{class:'tangent','data-tangent':this.kind});
    this.inflection=make('circle',{r:4.5,class:'inflection','data-inflection':this.kind});
    this.focus=make('circle',{r:10,class:'point-focus'});
    this.point=make('circle',{r:5.5,class:'current-point','data-current-point':this.kind});
    live.append(this.fill,this.guide,this.comparison,this.curve,this.tangent,this.inflection,this.focus,this.point);
    this.comparisonOverflow=make('path',{class:'comparison-overflow','data-comparison-overflow':this.comparisonKind,visibility:'hidden'});
    this.comparisonOverflow.append(make('title',{},'J 型继续增长，超出本图纵轴范围的部分不显示。'));
    this.value=make('text',{class:'population-label label-halo','data-population-label':this.kind});
    svg.replaceChildren(title,defs,base,live,this.comparisonOverflow,this.value);this.title=title;
    svg.dataset.buildCount=String(++this.buildCount);
  }
  draw(p,line,time,yMax,tangents){
    const width=this.svg.clientWidth,height=this.svg.clientHeight;
    if(width<180||height<95)return;
    // Range changes update the existing nodes; only real layout changes rebuild.
    const key=[width,height,line.end].join('/');
    if(key!==this.key){this.key=key;this.build(width,height,line.end);}
    const b=this.box,x=this.x,y=n=>b.bottom-n/yMax*(b.bottom-b.top),f=at(p,time)[this.kind];
    this.ticks.forEach((node,i)=>text(node,formatNumber(yMax*i/5,0)));
    const path=sampleCurve(p,time,this.kind).map((d,i)=>`${i?'L':'M'}${x(d.t).toFixed(2)},${y(d.n).toFixed(2)}`).join(' ');
    set(this.curve,{d:path});set(this.fill,{d:`${path}L${x(time).toFixed(2)},${b.bottom}H${b.left}Z`});
    const comparison=at(p,time)[this.comparisonKind];
    // Both curves use this plot's linear scale and the same scientific time.
    // Stop the visible J comparison exactly at the upper boundary, not at K.
    const comparisonEnd=this.comparisonKind==='j'?Math.min(time,Math.log(yMax/p.n0)/p.r):time;
    const comparisonPath=sampleCurve(p,comparisonEnd,this.comparisonKind).map((d,i)=>`${i?'L':'M'}${x(d.t).toFixed(2)},${y(d.n).toFixed(2)}`).join(' ');
    set(this.comparison,{d:comparisonPath,'data-time':time,'data-visible-end':comparisonEnd,'data-population':comparison.n});
    const comparisonClipped=comparison.n>yMax;
    set(this.comparisonOverflow,{d:`M${x(comparisonEnd)-4},${b.top+2}l4,-6l4,6M${x(comparisonEnd)},${b.top-4}v12`,visibility:comparisonClipped?'visible':'hidden'});
    set(this.guide,{d:`M${b.left},${y(f.n)}H${x(time)}V${b.bottom}`,visibility:time>0?'visible':'hidden'});
    set(this.point,{cx:x(time),cy:y(f.n),'data-population':f.n,'data-growth-speed':f.speed});set(this.focus,{cx:x(time),cy:y(f.n)});
    const dt=line.end*.06;
    set(this.tangent,{x1:x(time-dt),x2:x(time+dt),y1:y(f.n-f.speed*dt),y2:y(f.n+f.speed*dt),visibility:tangents?'visible':'hidden'});
    const showInflection=this.kind==='s'&&line.inflection!==null&&time>=line.inflection-1e-8;
    set(this.inflection,{cx:x(line.inflection||0),cy:y(p.k/2),visibility:showInflection?'visible':'hidden'});
    let labelY=Math.max(b.top+16,y(f.n)-16);
    if(this.kind==='s'&&(Math.abs(y(f.n)-y(p.k))<28||Math.abs(y(f.n)-y(p.k/2))<25))labelY=y(f.n)+25;
    labelY=Math.min(b.bottom-10,labelY);text(this.value,`N ≈ ${formatNumber(f.n)}`);
    const labelWidth=this.value.getComputedTextLength(),toLeft=time>line.end*.67;
    const labelX=Math.max(b.left+8,Math.min(b.right-labelWidth-8,x(time)+(toLeft?-labelWidth-13:13)));
    set(this.value,{x:labelX,y:labelY});
    text(this.title,`${this.kind.toUpperCase()}型增长：t=${formatTime(time)}年，N=${formatNumber(f.n)}个，线性纵轴上限${formatNumber(yMax,0)}个。浅灰虚线为同一时刻的${this.comparisonKind.toUpperCase()}型增长，N=${formatNumber(comparison.n)}个。${comparisonClipped?'虚线继续增长，超出纵轴上界。':''}`);
    this.svg.dataset.axisMax=String(yMax);this.svg.dataset.time=String(time);
  }
}
