import {COLUMNS,ROWS,WORLD_HEIGHT,definitions,evaluateColumn,clamp,smooth,unit} from './science.js';
import {atlasGeometry as geometry} from './atlas-geometry.js';
const NS='http://www.w3.org/2000/svg';
const node=(tag,attrs={},parent)=>{const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));parent?.append(el);return el;};
const set=(n,k,v)=>{const s=String(v);if(n.getAttribute(k)!==s)n.setAttribute(k,s);};
export class GeneticsRenderer{
  constructor(host,onPick){
    this.host=host;this.onPick=onPick;this.width=0;this.height=0;this.states=[];this.labels=true;this.highlight=true;this.selection=null;this.view='focus';this.scale=1;this.centerX=0;this.centerY=110;this.follow=true;this.layoutDirty=true;this.conditionsKey='';
    this.columns=COLUMNS.map((column,index)=>{
      const viewport=document.createElement('div');viewport.className='gene-column';viewport.dataset.law=column.id;viewport.tabIndex=0;viewport.setAttribute('aria-label',column.title+'；拖动平移、双指缩放，Enter选择首个对象');host.append(viewport);
      const svg=node('svg',{class:'gene-scene',role:'img','aria-label':column.title+'连续过程',preserveAspectRatio:'xMidYMid meet'},viewport);
      const title=node('title',{},svg);title.textContent=column.title+'的染色体与基因传递';
      const history=node('g',{'data-history':'', 'aria-hidden':'true'},svg);
      const lines=node('g',{},history);const paths=Array.from({length:8},()=>node('path',{class:'lineage'},lines));
      const snapshots=ROWS.slice(0,5).map(row=>({row,...this.makeLayer(history,index,'history-'+row.time)}));
      const live=this.makeLayer(svg,index,'live');
      return{column,index,viewport,svg,history,paths,snapshots,live};
    });
  }
  makeLayer(parent,index,name){
    const group=node('g',{'data-layer':name},parent),cells=[node('path',{class:'cell-boundary'},group)];
    const outline=node('path',{class:'selection-outline',visibility:'hidden'},group);
    const bodies=node('g',{'data-bodies':''},group),centers=node('g',{},group),annotations=node('g',{'data-genes':''},group);
    const materials=new Map(),centromeres=new Map(),connectors=new Map();
    for(const d of definitions(COLUMNS[index])){
      for(const segment of ['proximal','distal']){
        const id=d.id+':'+segment,path=node('path',{class:'material','data-origin':d.origin,'data-fragment':id},bodies);
        const bands=node('path',{class:'chromosome-bands','data-origin':d.origin},bodies);
        const hit=name==='live'?node('path',{class:'gene-hit','data-fragment':id},bodies):null;
        const leader=node('path',{class:'gene-leader'},annotations);
        const badge=node('g',{class:'gene-badge','data-fragment':id,'data-origin':d.origin},annotations);
        const plate=node('rect',{class:'gene-plate',rx:3},badge);
        const text=node('text',{class:'gene-text','data-gene-fragment':id},badge);
        text.textContent=segment==='proximal'?(d.proximalAllele||''):d.distalAllele;
        materials.set(id,{path,bands,hit,text,badge,plate,leader});
      }
      centromeres.set(d.id,node('ellipse',{class:'centromere'},centers));
      if(d.sister===0)connectors.set(d.sisterGroupId,node('rect',{class:'centromere',height:6,rx:3},centers));
    }
    const title=node('text',{class:'stage-text'+(name==='live'?'':' history-title')},group);
    const products=Array.from({length:4},(_,i)=>node('text',{class:'product-text','data-product':'G'+(i+1)},group));
    const cellNames=Array.from({length:4},()=>node('text',{class:'stage-text cell-name'},group));
    return{group,cells,materials,centromeres,connectors,title,products,cellNames,outline};
  }
  resize(){
    const b=this.columns[0].viewport.getBoundingClientRect();if(b.width<1||b.height<1)return;
    const old=this.layoutWidth;this.width=b.width;this.height=b.height;
    this.layoutWidth=this.width/this.defaultScale();
    if(old)this.centerX=this.centerX/old*this.layoutWidth;else this.centerX=this.layoutWidth/2;
    if(this.follow)this.focusScale();else if(this.view==='overview'){this.scale=this.minScale();this.centerX=this.layoutWidth/2;this.centerY=WORLD_HEIGHT/2;}else this.scale=clamp(this.scale,this.minScale(),4);
    this.layoutDirty=true;this.draw(this.states);
  }
  minScale(){return Math.min(1,this.height/(WORLD_HEIGHT+64),this.width/(this.layoutWidth+20));}
  defaultScale(){return Math.max(.08,Math.min(2.4,this.height/254,this.width/110));}
  focusScale(){this.scale=this.defaultScale();this.centerX=this.layoutWidth/2;}
  setView(view){this.view=view==='overview'?'overview':'focus';this.follow=this.view==='focus';if(this.follow){this.focusScale();this.centerY=this.states[0]?.centerY||110;}else{this.scale=this.minScale();this.centerX=this.layoutWidth/2;this.centerY=WORLD_HEIGHT/2;}this.drawCamera();this.draw(this.states);}
  manual(){this.follow=false;this.view='manual';}
  transform({factor,from,to}){
    if(!this.width||!this.height)return;this.manual();const old=this.scale,next=clamp(old*factor,this.minScale(),4);
    const worldX=this.centerX+(from.x-this.width/2)/old,worldY=this.centerY+(from.y-this.height/2)/old;
    this.centerX=worldX-(to.x-this.width/2)/next;this.centerY=worldY-(to.y-this.height/2)/next;this.scale=next;this.drawCamera();this.draw(this.states);
  }
  zoom(factor){const p={x:this.width/2,y:this.height/2};this.transform({factor,from:p,to:p});}
  pan(x,y){const p={x:this.width/2,y:this.height/2};this.transform({factor:1,from:p,to:{x:p.x+x,y:p.y+y}});}
  drawCamera(){
    if(!this.width||!this.height)return;
    const vw=this.width/this.scale,vh=this.height/this.scale;
    this.centerX=vw>=this.layoutWidth?this.layoutWidth/2:clamp(this.centerX,vw/2,this.layoutWidth-vw/2);
    if(!this.follow){this.centerY=clamp(this.centerY,-10+vh/2,WORLD_HEIGHT+10-vh/2);if(vh>=WORLD_HEIGHT)this.centerY=WORLD_HEIGHT/2;}
    const box=[this.centerX-vw/2,this.centerY-vh/2,vw,vh].map(v=>v.toFixed(3)).join(' ');
    for(const c of this.columns)set(c.svg,'viewBox',box);
  }
  draw(states){
    if(!states?.length||!this.width)return;this.states=states;
    if(this.follow)this.centerY=states[0].centerY+12;
    this.drawCamera();const key=JSON.stringify(states[0].conditions),changed=key!==this.conditionsKey;
    for(const c of this.columns){
      const s=states[c.index];
      for(const layer of c.snapshots){
        const visible=this.view!=='focus'&&s.time>layer.row.time+.01&&s.centerY-layer.row.y>190;
        set(layer.group,'display',visible?'':'none');
        if(visible&&(this.layoutDirty||changed||!layer.drawn||layer.lastScale!==this.scale)){
          const ss=evaluateColumn(c.index,layer.row.time,s.conditions);this.paint(layer,ss,false,layer.row.label);layer.drawn=true;layer.lastScale=this.scale;
        }
      }
      set(c.history,'display',this.view==='focus'?'none':'');
      this.drawLineage(c,s);
      this.paint(c.live,s,true,s.phase);
    }
    this.conditionsKey=key;this.layoutDirty=false;
  }
  drawLineage(c,s){
    if(this.view==='focus')return;
    const W=this.layoutWidth,cx=W/2,horizontalProducts=this.height<175&&this.width>=155;
    const end=geometry(evaluateColumn(c.index,32,s.conditions),W,{horizontalProducts});
    const [left,right]=end.childCenters,products=end.productCenters;
    const curve=(x1,y1,x2,y2)=>`M${x1} ${y1} C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}`;
    const branch=(pole,j)=>{
      const parent=end.childCenters[pole],p=products[j];
      if(horizontalProducts||j%2===0)return curve(parent.x,1126,p.x,p.y-(horizontalProducts?96:40));
      const radius=W*.46*.414,edge=parent.x+(pole===0?-1:1)*(radius+2);
      return `M${parent.x} 1126 C${edge} 1170 ${edge} ${p.y} ${p.x+(pole===0?-1:1)*radius} ${p.y}`;
    };
    const paths=[[curve(cx,206,cx,224),4],[curve(cx,416,cx,454),7],[curve(cx,646,cx,684),15],
      [curve(cx-W*.10,876,left.x,934),20],[curve(cx+W*.10,876,right.x,934),20],
      [branch(0,0),29],[branch(0,1),29],[branch(1,2)+' '+branch(1,3),29]];
    paths.forEach(([d,time],i)=>{set(c.paths[i],'d',d);set(c.paths[i],'opacity',s.time>=time?1:0);});
  }
  paint(layer,state,live,label){
    const horizontalProducts=this.height<175&&this.width>=155;
    const g=geometry(state,this.layoutWidth,{horizontalProducts,compact:this.height<180}),W=this.layoutWidth,cy=g.centerY,t=state.time,scale=this.scale;
    const screenFont=this.height<180?11:this.width<140?12:this.width<260?15:18;
    const font=clamp(screenFont/scale,8,32),small=clamp(11/scale,8,28);
    set(layer.cells[0],'d',g.cellPath);set(layer.cells[0],'data-cell-count',g.cells.length);
    const selected=this.selection?.column===state.index?this.selection:null;
    const badges=[];
    for(const r of g.rods){
      const visible=r.visible;
      const proximal=layer.materials.get(r.proximalId),distal=layer.materials.get(r.distalId);
      for(const[m,path,isDist]of [[proximal,r.proximal,false],[distal,r.distal,true]]){
        set(m.path,'d',path);set(m.path,'opacity',visible?1:0);
        set(m.bands,'d',isDist?r.distalBands:r.proximalBands);set(m.bands,'visibility',visible?'visible':'hidden');
        if(m.hit){set(m.hit,'d',path);set(m.hit,'visibility',visible&&path?'visible':'hidden');m.hit.dataset.chromatid=r.id;}
        const active=this.highlight&&selected&&(selected.fragment===r.proximalId||selected.fragment===r.distalId||selected.chromatid===r.id||selected.product===r.cellId);
        m.path.classList.toggle('is-selected',Boolean(active));
        set(m.path,'data-attached-to',r.id);set(m.path,'data-alleles',r.alleles);
        set(m.path,'data-full-length',r.h);
        const anchor=isDist?r.distalLabel:r.proximalLabel;
        let show=this.labels&&visible&&Boolean(m.text.textContent);
        const mate=g.rods.find(x=>x.sisterGroupId===r.sisterGroupId&&x.sister!==r.sister);
        const mateAnchor=mate&&(isDist?mate.distalLabel:mate.proximalLabel);
        const bw=font*.8+2/scale,bh=font+3/scale;
        let offset=0;
        let offsetY=0;
        // During copying, identical labels overlap until their own chromatids
        // open: no independent label motion or advance separation is allowed.
        // Compact post-replication views may use short annotation leaders.
        if(t>4&&mate?.visible&&Math.abs(mateAnchor.y-anchor.y)<bh){
          const radians=anchor.angle*Math.PI/180,wanted=bw*Math.abs(Math.cos(radians))+bh*Math.abs(Math.sin(radians))+2/scale;
          const direction=anchor.x<mateAnchor.x?-1:anchor.x>mateAnchor.x?1:r.sister===0?-1:1;
          offset=direction*Math.max(0,(wanted-Math.abs(anchor.x-mateAnchor.x))/2)*smooth(unit(t,4,7));
        }
        // During meiosis II, the two pairs use separate label columns. Sisters
        // fan vertically until their own movement provides enough separation.
        if(state.index===1&&g.preII>0&&mate?.visible){
          if(horizontalProducts){
            offsetY=(r.pair===0?-1:1)*font*.65*g.preII*(1-smooth(unit(g.second,.35,.75)));
          }else{
            offset=offset*(1-g.preII)+(r.labelColumnX-anchor.x)*g.preII;
            offsetY=(r.sister===0?-1:1)*Math.max(0,(bh+2/scale-Math.abs(mateAnchor.y-anchor.y))/2)*g.preII;
          }
        }
        if(state.index===1&&r.pair===0&&horizontalProducts&&state.conditions.arrangement==='repulsion')offsetY-=8*Math.sin(Math.PI*smooth(unit(t,13,15)));
        if(!live&&scale<.3)show=false;
        if(show)badges.push({m,r,anchor,x:anchor.x+offset,y:anchor.y+offsetY,bw,bh});
        set(m.badge,'transform',`translate(${anchor.x+offset} ${anchor.y+offsetY}) rotate(${anchor.angle})`);
        set(m.badge,'data-attached-to',r.id);set(m.badge,'data-angle',anchor.angle);set(m.badge,'visibility',show?'visible':'hidden');
        set(m.plate,'x',-bw/2);set(m.plate,'y',-bh/2);set(m.plate,'width',bw);set(m.plate,'height',bh);set(m.plate,'rx',3/scale);
        set(m.text,'x',0);set(m.text,'y',font*.35);set(m.text,'font-size',font);
        set(m.leader,'d',`M${anchor.x} ${anchor.y} L${anchor.x+offset} ${anchor.y+offsetY}`);set(m.leader,'visibility',show&&Math.hypot(offset,offsetY)>1/scale?'visible':'hidden');
      }
      const dot=layer.centromeres.get(r.id);set(dot,'cx',r.centromere.x);set(dot,'cy',r.centromere.y);set(dot,'rx',r.width*.28);set(dot,'ry',r.width*.20);
      set(dot,'opacity',visible?Math.max(1-g.copied,g.midSplit):0);
    }
    // Resolve the brief change from vertically stacked pairs to two gene
    // columns. Only annotations move; material, loci and cell identity do not.
    if(state.index===1&&g.preII>0&&g.preII<1){
      const bounds=b=>{const a=b.anchor.angle*Math.PI/180;return{w:Math.abs(Math.cos(a))*b.bw+Math.abs(Math.sin(a))*b.bh,h:Math.abs(Math.sin(a))*b.bw+Math.abs(Math.cos(a))*b.bh};};
      const radiusX=(Math.max(...g.cells[0].map(p=>p.x))-Math.min(...g.cells[0].map(p=>p.x)))/2-.5/scale,radiusY=96-.5/scale;
      for(let pass=0;pass<8;pass++){
       for(let i=0;i<badges.length;i++)for(let j=i+1;j<badges.length;j++){
        const a=badges[i],b=badges[j];if(a.r.pole!==b.r.pole)continue;
        const A=bounds(a),B=bounds(b),dx=(A.w+B.w)/2+1/scale-Math.abs(a.x-b.x),dy=(A.h+B.h)/2+1/scale-Math.abs(a.y-b.y);
        if(dx<=0||dy<=0)continue;
        if(a.r.pair===b.r.pair){const sign=a.r.sister===0?-1:1;a.y+=sign*dy/2;b.y-=sign*dy/2;}
        else{const sign=a.r.pair===0?-1:1;a.x+=sign*dx/2;b.x-=sign*dx/2;}
       }
       for(const b of badges){
        const center=g.childCenters[b.r.pole],angle=b.anchor.angle*Math.PI/180;
        for(const dx of [-b.bw/2,b.bw/2])for(const dy of [-b.bh/2,b.bh/2]){
          const x=b.x+dx*Math.cos(angle)-dy*Math.sin(angle)-center.x,y=b.y+dx*Math.sin(angle)+dy*Math.cos(angle)-cy;
          const ratio=Math.hypot(x/radiusX,y/radiusY);
          if(ratio>1){b.x-=x*(1-1/ratio);b.y-=y*(1-1/ratio);}
        }
       }
      }
      for(const b of badges){set(b.m.badge,'transform',`translate(${b.x} ${b.y}) rotate(${b.anchor.angle})`);set(b.m.leader,'d',`M${b.anchor.x} ${b.anchor.y} L${b.x} ${b.y}`);set(b.m.leader,'visibility',Math.hypot(b.x-b.anchor.x,b.y-b.anchor.y)>1/scale?'visible':'hidden');}
    }
    for(const[key,bar]of layer.connectors){
      const rods=g.rods.filter(r=>r.sisterGroupId===key),[a,b]=rods;
      const x=Math.min(a.centromere.x,b.centromere.x),y=(a.centromere.y+b.centromere.y)/2,h=a.width*.4;
      set(bar,'x',x-a.width*.26);set(bar,'y',y-h/2);set(bar,'height',h);set(bar,'width',Math.abs(a.centromere.x-b.centromere.x)+a.width*.52);set(bar,'opacity',g.copied*(1-g.midSplit));
    }
    set(layer.title,'x',W/2);set(layer.title,'y',cy-112);set(layer.title,'font-size',small);layer.title.textContent=live?'':label;
    layer.products.forEach((el,j)=>{const p=g.productCenters[j];set(el,'x',p.x);set(el,'y',p.y+(horizontalProducts?100:42)+9/scale);set(el,'font-size',Math.min(font,14/scale));set(el,'opacity',t>=29&&this.height>=200&&scale>=.65?1:0);el.textContent=state.products[j].genotype;});
    layer.cellNames.forEach((el,j)=>{set(el,'font-size',small);set(el,'opacity',live&&this.labels&&t>=20&&this.height>=200?1:0);const end=t>=29,p=end?g.productCenters[j]:g.childCenters[j%2];set(el,'x',p.x);set(el,'y',end?p.y-(horizontalProducts?100:42):cy-105);el.textContent=end?'G'+(j+1):(j<2?'子细胞'+(j+1):'');});
    set(layer.outline,'visibility','hidden');
  }
  getState(){return{view:this.view,follow:this.follow,scale:this.scale,centerX:this.centerX,centerY:this.centerY,width:this.width,layoutWidth:this.layoutWidth,height:this.height,viewBoxes:this.columns.map(c=>c.svg.getAttribute('viewBox'))};}
}
