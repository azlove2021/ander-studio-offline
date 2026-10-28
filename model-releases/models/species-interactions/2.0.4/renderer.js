import {DURATION,SERIES_NAMES,dataFor,sample,axesFor,formatNumber,formatTime} from './engine.js';
// SVG primitives, fixed-node lifecycle and responsive model-to-screen mapping
// adapted from population-growth@2.2.1/renderer.js (GrowthChart).
const NS='http://www.w3.org/2000/svg';
const make=(tag,attrs={},value)=>{const n=document.createElementNS(NS,tag);set(n,attrs);if(value!==undefined)n.textContent=value;return n;};
function set(n,a){for(const[k,v]of Object.entries(a))if(n.getAttribute(k)!==String(v))n.setAttribute(k,v);}
function text(n,value){if(n.textContent!==value)n.textContent=value;}
export class RelationshipChart{
  constructor(svg,kind){this.svg=svg;this.kind=kind;this.key='';this.dataKey='';this.buildCount=0;this.axes=axesFor(kind);}
  build(width,height){
    const left=width>=550?78:59,right=width-left,top=28,bottom=height-42;
    this.box={left,right,top,bottom,width,height};this.x=t=>left+t/DURATION*(right-left);
    this.y=(n,k)=>bottom-n/this.axes[k]*(bottom-top);
    const x=this.x,y=this.y,svg=this.svg;
    set(svg,{viewBox:`0 0 ${width} ${height}`,'data-axis-scale':'linear','data-axis-left':this.axes[0],'data-axis-right':this.axes[1]});
    const title=make('title'),defs=make('defs'),frameId='frame-'+this.kind,revealId='reveal-'+this.kind;
    const frameClip=make('clipPath',{id:frameId});frameClip.append(make('rect',{x:left-5,y:top-5,width:right-left+10,height:bottom-top+10}));
    const reveal=make('clipPath',{id:revealId});this.reveal=make('rect',{x:left-5,y:top-5,width:0,height:bottom-top+10});reveal.append(this.reveal);defs.append(frameClip,reveal);
    const base=make('g',{'data-chart-grid':this.kind});
    base.append(make('rect',{x:left-5,y:top-5,width:right-left+10,height:bottom-top+10,rx:7,class:'plot-frame','data-chart-frame':''}));
    for(let i=0;i<=4;i++){
      const yy=bottom-i/4*(bottom-top);
      if(i>0&&i<4)base.append(make('line',{x1:left,x2:right,y1:yy,y2:yy,class:'gridline'}));
      base.append(make('text',{x:left-10,y:yy+4,'text-anchor':'end',class:'tick','data-y-left':i},String(this.axes[0]*i/4)));
      base.append(make('text',{x:right+10,y:yy+4,'text-anchor':'start',class:'tick','data-y-right':i},String(this.axes[1]*i/4)));
    }
    for(const t of (width>=520?[0,6,12,18,24,30,36]:[0,12,24,36])){
      if(t>0&&t<DURATION)base.append(make('line',{x1:x(t),x2:x(t),y1:top,y2:bottom,class:'gridline grid-vertical'}));
      base.append(make('line',{x1:x(t),x2:x(t),y1:bottom,y2:bottom+4,class:'axis-tick'}));
      base.append(make('text',{x:x(t),y:bottom+21,'text-anchor':t===0?'start':t===DURATION?'end':'middle',class:'tick'},String(t)));
    }
    base.append(make('path',{d:`M${left},${top}V${bottom}H${right}V${top}`,class:'axis'}));
    const cy=(top+bottom)/2;
    base.append(make('text',{transform:`translate(15,${cy}) rotate(-90)`,'text-anchor':'middle',class:'axis-title axis-a','data-axis':'y'},SERIES_NAMES[this.kind][0]+'数量 / 个'));
    base.append(make('text',{transform:`translate(${width-13},${cy}) rotate(90)`,'text-anchor':'middle',class:'axis-title axis-b','data-axis':'y-right'},SERIES_NAMES[this.kind][1]+'数量 / 个'));
    base.append(make('text',{x:(left+right)/2,y:height-3,'text-anchor':'middle',class:'axis-title','data-axis':'x'},'时间 t / 示意单位'));
    const live=make('g',{'clip-path':`url(#${frameId})`,'data-chart-live':this.kind});
    const curves=make('g',{'clip-path':`url(#${revealId})`});
    this.reference=make('path',{class:'reference-curve','data-reference':'host'});
    this.curves=[make('path',{class:'curve curve-a','data-curve':'a'}),make('path',{class:'curve curve-b','data-curve':'b'})];curves.append(this.reference,...this.curves);
    this.guide=make('line',{class:'current-guide',y1:top,y2:bottom});
    this.points=[make('circle',{r:4.7,class:'current-point point-a','data-current-point':'a'}),make('rect',{width:8,height:8,rx:1.2,class:'current-point point-b','data-current-point':'b'})];
    this.cut=make('line',{x1:x(18),x2:x(18),y1:top,y2:bottom,class:'intervention-line'});
    this.cutLabel=make('text',{x:x(18),y:15,'text-anchor':'middle',class:'intervention-label'},'解除相互作用');
    live.append(curves,this.guide,this.cut,...this.points);svg.replaceChildren(title,defs,base,live,this.cutLabel);this.title=title;
    this.dataKey='';svg.dataset.buildCount=String(++this.buildCount);
  }
  draw(options,time,visible=[true,true]){
    const width=this.svg.clientWidth,height=this.svg.clientHeight;if(width<180||height<120)return;
    const layoutKey=width+'/'+height;
    if(layoutKey!==this.key){this.key=layoutKey;this.build(width,height);}
    const dataKey=[options.competition,options.mutual,options.separate].join('/'),data=dataFor(this.kind,options),value=sample(data,time),x=this.x,y=this.y;
    if(dataKey!==this.dataKey){
      const path=(key,k)=>data.map((p,i)=>`${i?'L':'M'}${x(p.t).toFixed(3)},${y(p[key],k).toFixed(3)}`).join(' ');
      this.curves.forEach((node,k)=>set(node,{d:path(k?'b':'a',k)}));
      if(this.kind==='parasitism')set(this.reference,{d:path('reference',0)});
      this.dataKey=dataKey;
    }
    set(this.reveal,{width:x(time)-this.box.left+5});
    set(this.guide,{x1:x(time),x2:x(time),visibility:time>0?'visible':'hidden'});
    const cut=this.kind==='mutualism'&&options.separate;
    for(const node of [this.cut,this.cutLabel])set(node,{visibility:cut?'visible':'hidden'});
    set(this.reference,{visibility:this.kind==='parasitism'&&options.reference?'visible':'hidden'});
    for(let k=0;k<2;k++){
      const n=value[k?'b':'a'];set(this.curves[k],{visibility:visible[k]?'visible':'hidden','data-visible-time':time});
      set(this.points[k],k?{x:x(time)-4,y:y(n,k)-4,'data-population':n,visibility:visible[k]?'visible':'hidden'}:{cx:x(time),cy:y(n,k),'data-population':n,visibility:visible[k]?'visible':'hidden'});
    }
    text(this.title,`t=${formatTime(time)}，${SERIES_NAMES[this.kind][0]}约${formatNumber(value.a)}个，${SERIES_NAMES[this.kind][1]}约${formatNumber(value.b)}个。左右坐标轴分别读数。`);
    this.svg.dataset.time=String(time);return value;
  }
}
