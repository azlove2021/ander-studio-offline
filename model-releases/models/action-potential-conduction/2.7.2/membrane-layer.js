// Compile the original lipid SVG once. The same paths, positions, masks and
// mature thermal-motion function are drawn into two thin canvas strips.
// Scientific geometry is retained; thousands of per-frame SVG mutations are not.
const sources=new WeakMap();
export async function createMembraneLayer(board,{width,scale=1}){
 const original=sources.get(board)||[...board.querySelectorAll('[data-membrane-art]')],defs=board.querySelector('.scene-underlay defs'),layers=[];
 sources.set(board,original);for(const group of original)group.remove();
 for(const group of original){
  const mask=defs.querySelector('#'+group.getAttribute('mask').match(/#([^)]*)/)[1]);
  const bounds=mask.firstElementChild,top=Number(bounds.getAttribute('y')),height=Number(bounds.getAttribute('height'));
  const holes=[...mask.querySelectorAll('rect')].slice(1).map(n=>['x','y','width','height'].map(a=>Number(n.getAttribute(a))));
  const base=group.firstElementChild,baseRect=['x','y','width','height'].map(a=>Number(base.getAttribute(a)));
  const matrix=group.querySelector('g[transform]').transform.baseVal.consolidate().matrix;
  const tails=[];for(const lipid of group.querySelectorAll('.active-lipid'))for(const node of lipid.querySelectorAll('.lipid-tail-shadow')){
   tails.push(Object.fromEntries(Object.entries(node.dataset).map(([key,value])=>[key,Number(value)])));
  }
  const heads=group.cloneNode(true);heads.firstElementChild.remove();heads.querySelectorAll('[data-lipid-tail]').forEach(n=>n.remove());
  const markup=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 ${top} ${width} ${height}">${defs.outerHTML}${heads.outerHTML}</svg>`;
  const image=new Image(),url=URL.createObjectURL(new Blob([markup],{type:'image/svg+xml'}));
  try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('膜结构绘制初始化失败'));image.src=url;});}finally{URL.revokeObjectURL(url);}
  const canvas=document.createElement('canvas');canvas.className='membrane-canvas';canvas.setAttribute('aria-hidden','true');canvas.dataset.membrane=group.dataset.membraneArt;
  Object.assign(canvas.style,{inset:'auto',left:'0',top:top+'px',width:'100%',height:height+'px',zIndex:'0',pointerEvents:'none'});
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw Error('膜结构画布不可用');
  layers.push({group,canvas,ctx,image,heads:document.createElement('canvas'),top,height,maskX:Number(bounds.getAttribute('x')),maskWidth:Number(bounds.getAttribute('width')),holes,baseRect,matrix:{a:matrix.a,b:matrix.b,c:matrix.c,d:matrix.d,e:matrix.e,f:matrix.f},tails});
 }
 let density=0,lastTime=0,frames=0;
 // Exact arithmetic from transport-primitives.js: UpdateLipidTail + LipidTailPath.
 // Keep numeric coordinates until drawing, avoiding format/parse work per tail.
 // qa-science compares every reconstructed path with the original SVG routine.
 function coordinates(t,time){
  const motion=time*(.32+.16*4.8),wave=Math.sin(motion+t.phase)*t.amp+Math.cos(motion*1.34+t.phase*1.9)*t.amp*.52,bend=t.bend+Math.sin(motion*.9+t.phase*1.31)*t.amp*.58;
  const midY=t.y+t.leaflet*19,endY=t.y+t.leaflet*(41.5-Math.min(5,Math.abs(wave)*.9)),midX=t.x+t.side*(5.1+wave*1.25)+bend*.66,endX=t.x+t.side*(8.2+wave*2.15)+bend*.92;
  return[t.x,t.y,midX,midY-t.leaflet*9.4,midX-t.side*(2.2+Math.abs(bend)*.24),midY+t.leaflet*8.2,endX,endY];
 }
 // Bounding box of the original cubic, for the original objectBoundingBox
 // horizontal gradient. Control-point bounds alone would change its colors.
 function cubicBounds(a,b,c,d){
  const A=-a+3*b-3*c+d,B=2*(a-2*b+c),C=b-a,ts=[0,1];
  if(Math.abs(A)<1e-12){if(Math.abs(B)>1e-12)ts.push(-C/B);}else{const disc=B*B-4*A*C;if(disc>=0){ts.push((-B+Math.sqrt(disc))/(2*A),(-B-Math.sqrt(disc))/(2*A));}}
  const values=ts.filter(t=>t>=0&&t<=1).map(t=>(1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d);return[Math.min(...values),Math.max(...values)];
 }
 function paint(){
  for(const l of layers){
   const {ctx}=l;ctx.setTransform(density,0,0,density,0,-l.top*density);ctx.clearRect(0,l.top,width,l.height);ctx.save();
   ctx.beginPath();ctx.rect(l.maskX,l.top,l.maskWidth,l.height);for(const[x,y,w,h]of l.holes)ctx.rect(x,y,w,h);ctx.clip('evenodd');
   ctx.fillStyle='rgba(223,238,244,.5)';ctx.fillRect(...l.baseRect);
   const m=l.matrix;ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f);ctx.lineCap='round';
   for(const tail of l.tails){
    const p=tail.points||coordinates(tail,lastTime);
    ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.lineWidth=4.6;ctx.strokeStyle='rgba(14,165,233,.16)';ctx.stroke();
    const[min,max]=cubicBounds(p[0],p[2],p[4],p[6]),gradient=ctx.createLinearGradient(min,0,max||min+1,0);gradient.addColorStop(0,'#a0d9f0');gradient.addColorStop(1,'#d1e9f4');ctx.strokeStyle=gradient;ctx.lineWidth=2.7;ctx.stroke();
   }
   ctx.restore();ctx.drawImage(l.heads,0,l.top,width,l.height);
  }frames++;
 }
 function update(time){lastTime=time;for(const l of layers)for(const tail of l.tails)tail.points=coordinates(tail,time);paint();}
 function setResolution(viewScale){const next=Math.min(4096/width,Math.max(.5,Math.ceil(viewScale*Math.min(devicePixelRatio||1,2)*4)/4));if(next===density)return;density=next;for(const l of layers){l.canvas.width=l.heads.width=Math.ceil(width*density);l.canvas.height=l.heads.height=Math.ceil(l.height*density);l.heads.getContext('2d').drawImage(l.image,0,0,l.heads.width,l.heads.height);}paint();}
 for(const l of layers){board.querySelector('.protein-canvas').before(l.canvas);l.group.remove();}
 setResolution(scale);update(0);
 const api={update,setResolution,getState:()=>({frames,time:lastTime,density,membranes:layers.length,lipids:layers.reduce((n,l)=>n+l.group.querySelectorAll('.active-lipid').length,0),tailCurves:layers.reduce((n,l)=>n+l.tails.length,0)}),paths:()=>layers.flatMap(l=>l.tails.map(t=>{const p=t.points||coordinates(t,lastTime);return`M${p[0]} ${p[1]} C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}`;}))};
 globalThis.ConductionMembrane=api;return api;
}
