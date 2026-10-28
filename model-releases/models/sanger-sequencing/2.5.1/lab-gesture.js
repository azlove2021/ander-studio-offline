// Presentation-only touch session. A remaining finger never resumes a pinch as a drag.
export function bindLabGesture({viewport,zoom,pan,transform,onStart,onTap}){
 const points=new Map();let multi=false,moved=false,previous=null,origin=null,blocked=0,tapTarget=null;
 const local=e=>{const r=viewport.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 const pair=()=>{const [a,b]=[...points.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};};
 const update=(factor,from,to)=>{if(transform)transform({factor,from,to});else{if(factor!==1)zoom(factor,from);pan(to.x-from.x,to.y-from.y);}};
 viewport.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(!points.size){multi=false;moved=false;origin=local(e);tapTarget=e.target;onStart?.();}
  points.set(e.pointerId,local(e));try{(onTap?viewport:e.target).setPointerCapture(e.pointerId);}catch{}
  if(points.size>=2){multi=true;moved=true;previous=pair();}else previous=local(e);
  if(onTap&&e.cancelable)e.preventDefault();
 });
 viewport.addEventListener('pointermove',e=>{
  if(!points.has(e.pointerId))return;const p=local(e);points.set(e.pointerId,p);
  if(points.size>=2){const now=pair();if(previous)update(now.d/previous.d,previous,now);previous=now;}
  else if(!multi){if(origin&&Math.hypot(p.x-origin.x,p.y-origin.y)>5)moved=true;if(moved&&previous)update(1,previous,p);previous=p;}
  if(moved)e.preventDefault();
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(name,e=>{
  if(!points.has(e.pointerId))return;if(name!=='pointerup'){multi=true;moved=true;}
  const tap=name==='pointerup'&&points.size===1&&!multi&&!moved?tapTarget:null;
  points.delete(e.pointerId);previous=points.size>=2?pair():null;
  if(multi||moved)blocked=performance.now()+450;if(!points.size){multi=false;origin=null;tapTarget=null;}
  if(tap)onTap?.(tap);
 });
 const cancel=()=>{const ids=[...points.keys()];points.clear();multi=false;previous=null;origin=null;tapTarget=null;blocked=performance.now()+450;for(const id of ids)try{viewport.releasePointerCapture(id);}catch{}};
 addEventListener('blur',cancel);addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 viewport.addEventListener('click',e=>{if(onTap&&e.detail>0||moved||performance.now()<blocked){e.preventDefault();e.stopImmediatePropagation();moved=false;}},{capture:true});
 viewport.addEventListener('wheel',e=>{e.preventDefault();const p=local(e);update(Math.exp(-e.deltaY*.0015),p,p);},{passive:false});
 return{getState:()=>({pointers:points.size,multi}),cancel};
}

export function createLabScreenView(viewport,plane,onManual,background){
 let scale=1,x=0,y=0,w=0,h=0;
 function draw(){x=Math.max(w-w*scale,Math.min(0,x));y=Math.max(h-h*scale,Math.min(0,y));for(const n of [plane,background])if(n)n.style.transform=`translate(${x}px,${y}px) scale(${scale})`;}
 function resize(){const nw=viewport.clientWidth,nh=viewport.clientHeight;if(nw<1||nh<1)return;x=w?x*nw/w:0;y=h?y*nh/h:0;w=nw;h=nh;draw();}
 function fit(){scale=1;x=0;y=0;draw();}
 function zoom(factor,p={x:w/2,y:h/2}){onManual?.();const next=Math.max(1,Math.min(8,scale*factor)),ratio=next/scale;x=p.x-(p.x-x)*ratio;y=p.y-(p.y-y)*ratio;scale=next;draw();}
 const touch=bindLabGesture({viewport,zoom,pan(dx,dy){if(scale>1){onManual?.();x+=dx;y+=dy;draw();}}});
 viewport.tabIndex=0;viewport.setAttribute('aria-label','模型画面，双指或滚轮缩放，拖动平移');
 viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;if(['+','='].includes(e.key))zoom(1.25);else if(e.key==='-')zoom(.8);else if(e.key==='Home'||e.key==='0')fit();else return;e.preventDefault();});
 new ResizeObserver(resize).observe(viewport);resize();
 return{fit,zoom,resize,getState:()=>({scale,x,y,...touch.getState()})};
}
