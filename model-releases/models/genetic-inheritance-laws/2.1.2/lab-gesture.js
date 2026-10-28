// Derived from bacteriophage-reproduction@2.5.0 bindLabGesture. The same
// One session covers the whole shared scene, including contacts in different columns.
export function bindLabGesture({viewport,transform,onStart,onTap,reference=()=>({x:0,y:0})}){
 const abort=new AbortController(),{signal}=abort;
 const listen=(el,type,fn,options={})=>el.addEventListener(type,fn,{...options,signal});
 const points=new Map();let multi=false,moved=false,previous=null,origin=null,blocked=0,tapTarget=null;
 const local=e=>{const r=viewport.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};};
 const projected=p=>({x:p.x-p.reference.x,y:p.y-p.reference.y});
 // Measure distance in the shared screen plane. Project the midpoint into the
 // repeated column camera using each contact's fixed starting-column origin.
 // Keeping origins fixed avoids a jump when a finger crosses a column border.
 const pair=()=>{const [a,b]=[...points.values()],pa=projected(a),pb=projected(b);return{x:(pa.x+pb.x)/2,y:(pa.y+pb.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};};
 listen(viewport,'pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(points.has(e.pointerId))return;
  const p={...local(e),reference:reference(e)};
  if(!points.size){multi=false;moved=false;origin=projected(p);tapTarget=e.target;onStart?.();}
  points.set(e.pointerId,p);try{viewport.setPointerCapture(e.pointerId);}catch{}
  if(points.size>=2){multi=true;moved=true;previous=pair();}else previous=projected(p);
  if(e.cancelable)e.preventDefault();
 });
 listen(viewport,'pointermove',e=>{
  if(!points.has(e.pointerId))return;const current={...local(e),reference:points.get(e.pointerId).reference};points.set(e.pointerId,current);const p=projected(current);
  if(points.size>=2){const now=pair();if(previous)transform({factor:now.d/previous.d,from:previous,to:now});previous=now;}
  else if(!multi){if(origin&&Math.hypot(p.x-origin.x,p.y-origin.y)>5)moved=true;if(moved&&previous)transform({factor:1,from:previous,to:p});previous=p;}
  if(moved)e.preventDefault();
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])listen(viewport,name,e=>{
  if(!points.has(e.pointerId))return;if(name!=='pointerup'){multi=true;moved=true;}
  const tap=name==='pointerup'&&points.size===1&&!multi&&!moved?tapTarget:null;
  points.delete(e.pointerId);previous=points.size>=2?pair():null;
  if(multi||moved)blocked=performance.now()+450;if(!points.size){multi=false;origin=null;tapTarget=null;}
  if(tap)onTap?.(tap);
 });
 const cancel=()=>{const ids=[...points.keys()];points.clear();multi=false;previous=null;origin=null;tapTarget=null;blocked=performance.now()+450;for(const id of ids)try{viewport.releasePointerCapture(id);}catch{}};
 listen(window,'blur',cancel);listen(window,'pagehide',cancel);listen(document,'visibilitychange',()=>{if(document.hidden)cancel();});
 listen(viewport,'click',e=>{if(e.detail>0||moved||performance.now()<blocked){e.preventDefault();e.stopImmediatePropagation();moved=false;}},{capture:true});
 listen(viewport,'contextmenu',e=>e.preventDefault());listen(viewport,'dragstart',e=>e.preventDefault());
 listen(viewport,'wheel',e=>{e.preventDefault();onStart?.();const p=projected({...local(e),reference:reference(e)});transform({factor:Math.exp(-e.deltaY*.0015),from:p,to:p});},{passive:false});
 return{getState:()=>({pointers:points.size,ids:[...points.keys()],multi,moved}),cancel,destroy(){cancel();abort.abort();}};
}
