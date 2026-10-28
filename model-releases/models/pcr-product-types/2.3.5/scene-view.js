// Screen-only magnification of the existing scientific SVG. Model coordinates,
// lineage, timing and the default complete overview remain unchanged.
export function createProductView(viewport,plane,svg){
  let zoom=1,metrics=null,gesture=null,frame=0;
  const pointers=new Map(),abort=new AbortController(),signal=abort.signal;
  const fitButton=viewport.parentElement.querySelector('[data-products-fit]');
  function layout(next=zoom,anchor){
    const width=viewport.clientWidth,height=viewport.clientHeight;if(!width||!height)return;
    const old=metrics;
    const ax=anchor?.x??width/2,ay=anchor?.y??height/2;
    const point=old?{x:(viewport.scrollLeft+(anchor?.x??old.width/2)-old.left)/old.scale,y:(viewport.scrollTop+(anchor?.y??old.height/2)-old.top)/old.scale}:{x:720,y:320};
    zoom=Math.max(1,Math.min(8,next));const scale=Math.min(width/1440,height/640)*zoom;
    const w=1440*scale,h=640*scale,left=Math.max(0,(width-w)/2),top=Math.max(0,(height-h)/2);
    plane.style.width=Math.max(width,w)+'px';plane.style.height=Math.max(height,h)+'px';
    Object.assign(svg.style,{width:w+'px',height:h+'px',left:left+'px',top:top+'px'});
    metrics={width,height,scale,left,top};viewport.dataset.zoomed=String(zoom>1.001);
    viewport.scrollLeft=zoom===1?0:point.x*scale+left-ax;viewport.scrollTop=zoom===1?0:point.y*scale+top-ay;
    fitButton.hidden=zoom<=1.001;fitButton.textContent=`回到全图 · ${zoom.toFixed(1)}×`;
    fitButton.setAttribute('aria-label',`当前放大${zoom.toFixed(1)}倍，回到完整产物总览`);
  }
  const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>layout());};
  const position=e=>{const r=viewport.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const pair=()=>{const [a,b]=[...pointers.values()];return {distance:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2};};
  const resetGesture=()=>{if(pointers.size>=2){const p=pair();gesture={...p,zoom};}else if(pointers.size){const p=[...pointers.values()][0];gesture={...p,left:viewport.scrollLeft,top:viewport.scrollTop};}else gesture=null;};
  viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.pointerType==='mouse'&&e.button!==0)return;pointers.set(e.pointerId,position(e));viewport.setPointerCapture(e.pointerId);resetGesture();},{signal});
  viewport.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,position(e));
    if(pointers.size>=2){const p=pair();layout(gesture.zoom*p.distance/Math.max(1,gesture.distance),p);}
    else if(zoom>1.001&&gesture){const p=position(e);viewport.scrollLeft=gesture.left-(p.x-gesture.x);viewport.scrollTop=gesture.top-(p.y-gesture.y);}
  },{signal});
  for(const name of ['pointerup','pointercancel'])viewport.addEventListener(name,e=>{pointers.delete(e.pointerId);resetGesture();},{signal});
  viewport.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();layout(zoom*Math.exp(-e.deltaY*.003),position(e));}},{passive:false,signal});
  viewport.addEventListener('keydown',e=>{
    if(e.target!==viewport)return;
    if(e.key==='Home'){e.preventDefault();layout(1);}
    else if(['+','=','-','_'].includes(e.key)){e.preventDefault();layout(zoom*(['-','_'].includes(e.key)?1/1.5:1.5));}
    else if(e.key.startsWith('Arrow')&&zoom>1){e.preventDefault();viewport.scrollBy({left:e.key==='ArrowRight'?64:e.key==='ArrowLeft'?-64:0,top:e.key==='ArrowDown'?64:e.key==='ArrowUp'?-64:0});}
  },{signal});
  fitButton.addEventListener('click',()=>layout(1),{signal});
  const observer=new ResizeObserver(resize);observer.observe(viewport);layout();
  return {resize,fit:()=>layout(1),zoomIn:()=>layout(zoom*1.5),zoomOut:()=>layout(zoom/1.5),getState:()=>({zoom,scroll:{x:viewport.scrollLeft,y:viewport.scrollTop},...metrics}),destroy(){abort.abort();observer.disconnect();cancelAnimationFrame(frame);}};
}
