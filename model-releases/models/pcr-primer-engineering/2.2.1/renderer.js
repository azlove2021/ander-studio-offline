import {GEOMETRY as G,BASE_COLORS,STRAND_COLORS,STRAND_FILLS,COMPLEMENT,baseX,viewX,tokenKey,residueOffset,visibleResidue,detailFrame,selectedPair,primerTokens,clamp} from './engine.js';
const NS='http://www.w3.org/2000/svg';
export function el(tag,attrs={},parent,value){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(value!==undefined)n.textContent=value;if(parent)parent.appendChild(n);return n;}
const attributeCache=new WeakMap();
export function attr(n,k,v){const s=String(v);let cache=attributeCache.get(n);if(!cache){cache=new Map();attributeCache.set(n,cache);}if(cache.get(k)!==s){n.setAttribute(k,s);cache.set(k,s);}}
export function text(n,v){if(n.textContent!==String(v))n.textContent=String(v);}
const show=(n,on)=>attr(n,'display',on?'inline':'none');
let nucleotideDefinitions='';
// Actual phosphate, sugar and base primitives copied from the accepted asset
// generator. Symbols keep the geometry shared without runtime file imports.
function glyphs(defs){for(const role of Object.keys(STRAND_COLORS))for(const dir of[1,-1])for(const base of Object.keys(BASE_COLORS)){
  const g=el('g',{id:`nt-${role}-${dir}-${base}`},defs);
  el('circle',{cx:-7,cy:0,r:2.4,fill:STRAND_COLORS[role],stroke:'#fff','stroke-width':.5},g);
  el('path',{d:'M-4 -3 1 -5 5 -1 3 4 -3 4Z',fill:STRAND_FILLS[role],stroke:STRAND_COLORS[role],'stroke-width':.9},g);
  el('path',{d:`M0 ${dir*4}V${dir*10}`,stroke:'#9eaeaf','stroke-width':1},g);
  el('rect',{x:-5.8,y:dir===1?9:-20,width:11.6,height:11,rx:2,fill:BASE_COLORS[base]},g);
  el('text',{x:0,y:dir===1?17.4:-11.6,'text-anchor':'middle',fill:base==='G'?'#63531f':'white','font-size':8,'font-weight':650},g,base);
}nucleotideDefinitions=[...defs.querySelectorAll('g[id^="nt-"]')].map(n=>n.outerHTML).join('');}
function createChain(strand,parent,defs,key){
  const group=el('g',{'data-strand-id':strand.id,'data-origin':strand.origin,'data-template-id':strand.templateId??'','data-created-cycle':strand.createdCycle,display:'none'},parent),clip=el('clipPath',{id:key},defs),clipRect=el('rect',{x:0,y:-65,width:1,height:130},clip);
  const molecule=el('g',{transform:`scale(${G.scale})`,'clip-path':`url(#${key})`},group);
  const site=el('path',{class:'site-glow',fill:'none',stroke:'#19bce2','stroke-width':39,'stroke-linecap':'round',opacity:.3,filter:'url(#site-glow)'},molecule);
  const siteFrame=el('path',{class:'site-outline',fill:'#c8f1ff',stroke:'#087da3','stroke-width':2,'stroke-linejoin':'round'},molecule);
  const paths=Object.fromEntries(Object.entries(STRAND_COLORS).map(([role,color])=>[role,el('path',{fill:'none',stroke:color,'stroke-width':9,'stroke-linecap':'round'},molecule)]));
  // Gene glyphs never change shape. Cache those exact vector primitives in one
  // self-contained SVG image; retain real nodes for bending tails and zoom.
  // Continuous clipping still exposes each copied base at its actual position.
  const cached=key.startsWith('main-');
  if(cached){
    const uses=strand.tokens.filter(t=>t.domain==='gene'&&t.feature!=='mutation').map(t=>`<use href="#nt-${t.role}-${strand.dir}-${t.base}" x="${(t.q+.5)*G.step}"/>`).join('');
    const content=`<svg xmlns="http://www.w3.org/2000/svg" width="${G.bases*G.step}" height="64" viewBox="0 -32 ${G.bases*G.step} 64" font-family="Microsoft YaHei,system-ui,sans-serif"><defs>${nucleotideDefinitions}</defs>${uses}</svg>`;
    el('image',{x:0,y:-32,width:G.bases*G.step,height:64,href:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(content)}`},molecule);
  }
  const nodes=strand.tokens.map(t=>{if(cached&&t.domain==='gene'&&t.feature!=='mutation')return null;
  const n=el('g',{'data-position':t.q,'data-feature':t.feature??'','data-base':t.base},molecule);el('use',{href:`#nt-${t.role}-${strand.dir}-${t.base}`},n);if(t.feature==='mutation')el('rect',{x:-6.8,y:strand.dir===1?8:-21,width:13.6,height:13,rx:2.5,fill:'none',stroke:'#9954a7','stroke-width':1.6},n);return n;});
  const ends=[el('text',{class:'dna-end optional-label','text-anchor':'end',y:6},group,strand.dir===1?'5′':'3′'),el('text',{class:'dna-end optional-label',y:6},group,strand.dir===1?'3′':'5′')];
  return {group,molecule,clipRect,paths,nodes,ends,site,siteFrame,strand,shapeKey:null};
}
function drawChain(node,view,frame,opacity,highlight){
  show(node.group,view.opacity>0);attr(node.group,'transform',`translate(${view.x+G.dnaX} ${view.y})`);attr(node.group,'opacity',(view.opacity*opacity).toFixed(4));attr(node.group,'data-formed-start',view.start);attr(node.group,'data-formed-end',view.end);
  const scale=view.scale??G.scale;attr(node.molecule,'transform',`scale(${scale})`);attr(node.group,'data-scale',scale);
  attr(node.clipRect,'x',view.start*G.step-2);attr(node.clipRect,'width',Math.max(0,(view.end-view.start)*G.step+4));
  const points=view.strand.tokens.map(t=>[(t.q+.5)*G.step,residueOffset(view,t,frame)]),shapeKey=points.map(p=>p[1].toFixed(2)).join(',');
  if(node.shapeKey!==shapeKey){
  const d={original:'',new:'',primer:''};let site='';
  points.forEach(([x,y],i)=>{const prev=points[i-1],next=points[i+1],x0=prev?(prev[0]+x)/2:x-G.step/2,y0=prev?(prev[1]+y)/2:y,x1=next?(next[0]+x)/2:x+G.step/2,y1=next?(next[1]+y)/2:y;const seg=`M${x0.toFixed(2)} ${y0.toFixed(2)}L${x.toFixed(2)} ${y.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}`;d[view.strand.tokens[i].role]+=seg;if(view.strand.tokens[i].feature==='site'){const dy=view.strand.dir*7.5;site+=`M${x0.toFixed(2)} ${(y0+dy).toFixed(2)}L${x.toFixed(2)} ${(y+dy).toFixed(2)}L${x1.toFixed(2)} ${(y1+dy).toFixed(2)}`;}if(node.nodes[i])attr(node.nodes[i],'transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);});
  let outline='';for(const domain of['left-tail','right-tail']){const band=points.filter((_,i)=>view.strand.tokens[i].domain===domain&&view.strand.tokens[i].feature==='site');if(!band.length)continue;const a=band[0],b=band.at(-1),centers=[[a[0]-G.step/2,a[1]],...band,[b[0]+G.step/2,b[1]]],dy=view.strand.dir*7.5;outline+='M'+centers.map(([x,y])=>`${x.toFixed(2)} ${(y+dy-15.5).toFixed(2)}`).join('L')+'L'+[...centers].reverse().map(([x,y])=>`${x.toFixed(2)} ${(y+dy+15.5).toFixed(2)}`).join('L')+'Z';}
  for(const role of Object.keys(d))attr(node.paths[role],'d',d[role]);attr(node.site,'d',site);attr(node.siteFrame,'d',outline);node.shapeKey=shapeKey;node.hasSite=Boolean(site);
  }
  for(const n of[node.site,node.siteFrame])show(n,highlight&&node.hasSite);
  attr(node.ends[0],'x',view.start*G.step*scale-10);attr(node.ends[1],'x',view.end*G.step*scale+10);
  const first=view.strand.tokens.find(t=>t.q+1>view.start),last=[...view.strand.tokens].reverse().find(t=>t.q<view.end);
  attr(node.ends[0],'y',6+(first?residueOffset(view,first,frame)*scale:0));attr(node.ends[1],'y',6+(last?residueOffset(view,last,frame)*scale:0));
}
function bondGeometry(bond,frame){
  const [top,bottom]=bond.views;if(!top||!bottom)return '';
  const map=new Map(bottom.strand.tokens.map(t=>[tokenKey(t),t]));let d='';
  for(const t of top.strand.tokens){const b=map.get(tokenKey(t));if(!b||COMPLEMENT[t.base]!==b.base||visibleResidue(top,t)<.5||visibleResidue(bottom,b)<.5)continue;
    const x1=viewX(top,t.q+.5),x2=viewX(bottom,b.q+.5),y1=top.y+(residueOffset(top,t,frame)+20)*(top.scale??G.scale),y2=bottom.y+(residueOffset(bottom,b,frame)-20)*(bottom.scale??G.scale);
    d+=`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }return d;
}
function pool(svg,lineages,defs,key){const g=el('g',{'data-chain-pool':key},svg),map={};for(const [mode,lineage]of Object.entries(lineages))map[mode]=lineage.strands.map(s=>createChain(s,g,defs,`${key}-${mode}-${s.id}`));return map;}
export function createRenderer(svg,zoom,lineages){
  svg.setAttribute('viewBox',`0 0 ${G.width} ${G.height}`);
  const defs=el('defs',{},svg);glyphs(defs);const filter=el('filter',{id:'site-glow',filterUnits:'userSpaceOnUse',x:-24,y:-64,width:G.bases*G.step+48,height:128},defs);el('feGaussianBlur',{stdDeviation:4},filter);
  const guides=el('g',{id:'target-guides'},svg),guideArea=el('rect',{y:43,height:575,fill:'#e6f1e9',opacity:.55},guides);
  const guideLines=[G.left,G.right].map(q=>({q,path:el('path',{stroke:'#8baa9a','stroke-dasharray':'5 7','stroke-width':1.3},guides),label:el('text',{y:26,'text-anchor':'middle',class:'guide-label optional-label'},guides,q===G.left?'目标左界':'目标右界')}));
  const rowLayer=el('g',{id:'row-layer'},svg),rows=Array.from({length:8},(_,i)=>{const g=el('g',{'data-row':i},rowLayer);return {g,bg:el('rect',{x:10,y:-28,width:1420,height:56,rx:9,fill:'#cce7d8',opacity:0},g),label:el('text',{x:18,y:6,class:'row-label optional-label'},g)};});
  const bondLayer=el('g',{id:'bond-layer'},svg),bonds=Array.from({length:8},()=>el('path',{fill:'none',stroke:'#89a99b','stroke-width':1.1},bondLayer));
  const chains=pool(svg,lineages,defs,'main'),primerLabels=el('g',{},svg);
  el('text',{x:baseX(24),y:436,'text-anchor':'middle',class:'primer-label optional-label'},primerLabels,'正向引物 F');el('text',{x:baseX(60),y:232,'text-anchor':'middle',class:'primer-label optional-label'},primerLabels,'反向引物 R');
  const zoomDefs=el('defs',{},zoom),zoomBond=el('path',{fill:'none',stroke:'#89a99b','stroke-width':1.1},zoom),zoomChains=pool(zoom,lineages,zoomDefs,'zoom');
  const mismatch=el('path',{stroke:'#9559a6','stroke-width':1.5,fill:'none'},zoom);let previousMode=null;
  function draw(mode,state,{labels=true,highlight=true}={}){
    const lineage=lineages[mode],frame=detailFrame(state,lineage),visible=new Map(frame.views.map(v=>[v.strand.id,v]));
    svg.classList.toggle('hide-labels',!labels);zoom.classList.toggle('hide-labels',!labels);
    if(previousMode!==mode){for(const m of Object.keys(chains))if(m!==mode){for(const n of chains[m])show(n.group,false);for(const n of zoomChains[m])show(n.group,false);}previousMode=mode;}
    for(const node of chains[mode]){const v=visible.get(node.strand.id);if(!v){show(node.group,false);continue;}const opacity=highlight&&frame.activeRows.length&&!frame.activeRows.includes(v.row)?.28:1;drawChain(node,v,frame,opacity,highlight);}
    const guideX=q=>viewX(frame,q);attr(guideArea,'x',guideX(G.left));attr(guideArea,'width',guideX(G.right)-guideX(G.left));for(const {q,path,label}of guideLines){attr(path,'d',`M${guideX(q)} 43V618`);attr(label,'x',guideX(q));}
    rows.forEach((node,i)=>{const row=frame.rows[i];show(node.g,Boolean(row));if(!row)return;attr(node.g,'transform',`translate(0 ${row.y})`);attr(node.g,'opacity',row.opacity);text(node.label,row.label);attr(node.bg,'opacity',highlight&&frame.activeRows.includes(i)?.55:0);attr(node.g,'data-category',row.type??'initial');attr(node.g,'data-status',row.state);});
    bonds.forEach((n,i)=>{const b=frame.bonds[i];show(n,Boolean(b));if(!b)return;attr(n,'d',bondGeometry(b,frame));attr(n,'opacity',b.opacity*(highlight&&frame.activeRows.length&&!frame.activeRows.includes(b.row??i)?.28:1));});show(primerLabels,state.phase==='setup');
    const selected=selectedPair(state,lineage),selectedViews=selected.pair.map(s=>visible.get(s.id)).filter(v=>v&&v.opacity>0);
    const feature=selected.feature;
    let range=feature==='mutation'?[21,28]:feature==='left-tail'?[7,17]:[67,77];
    const anchor=selectedViews.find(v=>v.strand.createdCycle<state.cycle||v.strand.origin==='original')??selectedViews[0]??frame,scale=anchor.scale??G.scale,x=viewX(anchor,range[0]),w=(range[1]-range[0])*G.step*scale;
    const ys=selectedViews.flatMap(v=>v.strand.tokens.filter(t=>t.q>=range[0]&&t.q<range[1]).map(t=>v.y+residueOffset(v,t,frame)*(v.scale??G.scale)));
    let y=ys.length?Math.min(...ys)-30:270,h=ys.length?Math.max(...ys)-Math.min(...ys)+62:90;
    // A small fixed horizontal margin keeps the site legible; the view follows
    // the actual strands rather than an independently staged pairing picture.
    zoom.setAttribute('viewBox',`${x-8} ${y} ${w+16} ${Math.max(82,h)}`);
    for(const node of zoomChains[mode]){const v=selectedViews.find(v=>v.strand.id===node.strand.id);if(!v){show(node.group,false);continue;}drawChain(node,v,frame,1,highlight);for(const n of node.ends)show(n,false);}
    const b=frame.bonds.find(b=>b.pair[0]===selected.pair[0]&&b.pair[1]===selected.pair[1]);attr(zoomBond,'d',b?bondGeometry(b,frame):'');attr(zoomBond,'opacity',b?.opacity??0);
    let mismatchPath='';if(mode==='mutation'&&b&&b.opacity>.9&&selectedViews.length===2){const a=selectedViews[0],c=selectedViews[1],t=a.strand.tokens.find(t=>t.q===G.mutationIndex),u=c.strand.tokens.find(t=>t.q===G.mutationIndex);if(t&&u&&COMPLEMENT[t.base]!==u.base&&visibleResidue(a,t)>.9&&visibleResidue(c,u)>.9){const x=viewX(a,G.mutationIndex+.5),y=(a.y+c.y)/2;mismatchPath=`M${x-2} ${y-2}l4 4M${x+2} ${y-2}l-4 4`;}}
    attr(mismatch,'d',mismatchPath);
    return {frame,selected,feature,zoomViews:selectedViews.map(v=>({id:v.strand.id,start:v.start,end:v.end})),zoomDirections:[...selectedViews].sort((a,b)=>a.y-b.y).map(v=>v.strand.dir===1?'5′ → 3′':'3′ ← 5′'),pairedCount:b?bondGeometry(b,frame).split('M').length-1:0,mismatch:Boolean(mismatchPath)};
  }
  return {draw};
}
export function drawPrimerLibrary(svg,mode){
  svg.setAttribute('viewBox','0 0 470 136');
  for(const [dir,y]of[[1,34],[-1,103]]){
    const tokens=primerTokens(dir,mode),a=tokens[0].q,b=tokens.at(-1).q+1,scale=360/((b-a)*14),g=el('g',{transform:`translate(65 ${y}) scale(${scale})`},svg);
    el('text',{x:7,y:y+5,'font-size':20,fill:'#64838b'},svg,dir===1?'F':'R');
    for(const t of tokens){const x=(t.q-a+.5)*14;if(t.feature==='site'){for(const [stroke,width]of[['#087da3',33],['#c8f1ff',29]])el('path',{d:`M${x-7} ${dir*7.5}H${x+7}`,stroke,'stroke-width':width},g);}el('path',{d:`M${x-7} 0H${x+7}`,stroke:t.feature==='protect'?'#879b91':STRAND_COLORS.primer,'stroke-width':9},g);const n=el('g',{transform:`translate(${x} 0)`},g);el('use',{href:`#nt-primer-${dir}-${t.base}`},n);if(t.feature==='mutation')el('rect',{x:-6.5,y:dir===1?8:-21,width:13,height:13,fill:'none',stroke:'#9954a7','stroke-width':2},n);}
    el('text',{x:58,y:y+5,'text-anchor':'end','font-size':17,fill:'#416b70'},svg,dir===1?'5′':'3′');el('text',{x:432,y:y+5,'font-size':17,fill:'#416b70'},svg,dir===1?'3′':'5′');
  }
}
