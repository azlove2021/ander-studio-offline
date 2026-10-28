// Adapted from respiratory-electron-transport@2.4.1 createCamera.
// One pointer map owns both linked views; first contact stops follow; multi-pointer tails remain inert.
export function createCamera(svg,viewport,surface,onSelect,onManual){
 const points=new Map(),abort=new AbortController(),signal=abort.signal,background=viewport.querySelector('#science-background');
 let multi=false,moved=false,previous=null,origin=null,target=null,blocked=0,w=1,h=1,base=1,cx=900,cy=360,zoom=1,manual=false,mode='overview',context='overview',presetRect=null,startInEnergy=false;
 const listen=(n,t,f,o={})=>n.addEventListener(t,f,{...o,signal});
 const local=e=>{const b=viewport.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top};};
 const pair=()=>{const[a,b]=[...points.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};};
 function draw(){
  const hw=w/(2*base*zoom),hh=h/(2*base*zoom);
  cx=hw>=900?900:Math.max(hw,Math.min(1800-hw,cx));cy=hh>=360?360:Math.max(hh,Math.min(720-hh,cy));
  const box=[cx-hw,cy-hh,hw*2,hh*2].join(' ');svg.setAttribute('viewBox',box);background.setAttribute('viewBox',box);
  svg.dataset.view=zoom>1.05?'focus':'overview';svg.dataset.focus=context;
 }
 function transform(factor,from,to){manual=true;mode='manual';onManual?.();const old=base*zoom,next=Math.max(1,Math.min(8,zoom*factor)),s=base*next;
  const sx=cx+(from.x-w/2)/old,sy=cy+(from.y-h/2)/old;cx=sx-(to.x-w/2)/s;cy=sy-(to.y-h/2)/s;zoom=next;draw();}
 function setRect(rect,chosen='focus',focus='overview'){
  presetRect=[...rect];manual=chosen!=='follow';mode=chosen;context=focus;
  const immersive=viewport.closest('.model-area').dataset.immersive==='true';
  const top=immersive?90:0,bottom=immersive?(parseFloat(getComputedStyle(viewport.closest('.model-area')).getPropertyValue('--shell-dock-height'))||90)+65:0;
  const usable=Math.max(90,h-top-bottom),scale=Math.min(w/rect[2],usable/rect[3]);
  zoom=Math.max(1,Math.min(8,scale/base));cx=rect[0]+rect[2]/2;cy=rect[1]+rect[3]/2+(bottom-top)/(2*base*zoom);draw();
 }
 function resize(){const b=viewport.getBoundingClientRect();w=Math.max(1,b.width);h=Math.max(1,b.height);base=Math.min(w/1800,h/720);if(presetRect&&mode!=='manual')setRect(presetRect,mode,context);else draw();}
 function followCenter(x,y,focus){
  if(mode!=='follow')return;cx=x;cy=y;context=focus;
  if(presetRect){presetRect[0]=x-presetRect[2]/2;presetRect[1]=y-presetRect[3]/2;}draw();
 }
 function cancel(){const ids=[...points.keys()];points.clear();for(const id of ids)try{surface.releasePointerCapture(id);}catch{}multi=false;previous=null;origin=null;target=null;blocked=performance.now()+450;}
 listen(surface,'pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  if(!points.size){multi=false;moved=false;origin=local(e);target=e.target;startInEnergy=!!e.target.closest('.energy-area');manual=true;mode='manual';onManual?.();}
  points.set(e.pointerId,local(e));try{surface.setPointerCapture(e.pointerId);}catch{}
  if(points.size>=2){multi=true;moved=true;previous=pair();}else previous=local(e);e.preventDefault();
 });
 listen(surface,'pointermove',e=>{
  if(!points.has(e.pointerId))return;const p=local(e);points.set(e.pointerId,p);
  if(points.size>=2){const now=pair();if(previous)transform(now.d/previous.d,previous,now);previous=now;}
  else if(!multi){if(origin&&Math.hypot(p.x-origin.x,p.y-origin.y)>5)moved=true;if(moved&&previous&&!startInEnergy)transform(1,previous,p);previous=p;}
  if(moved)e.preventDefault();
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(surface,type,e=>{
  if(!points.has(e.pointerId))return;if(type!=='pointerup'){multi=true;moved=true;}
  const tap=type==='pointerup'&&points.size===1&&!multi&&!moved?target:null;points.delete(e.pointerId);previous=points.size>=2?pair():null;
  if(multi||moved)blocked=performance.now()+450;if(!points.size){multi=false;origin=null;target=null;}if(tap)onSelect?.(tap.closest('[data-object]')?.dataset.object);
 });
 listen(surface,'click',e=>{if(e.detail>0||moved||performance.now()<blocked){e.preventDefault();e.stopImmediatePropagation();moved=false;}},{capture:true});
 listen(surface,'wheel',e=>{e.preventDefault();const p=local(e);transform(Math.exp(-e.deltaY*.0015),p,p);},{passive:false});
 listen(surface,'contextmenu',e=>e.preventDefault());listen(surface,'dragstart',e=>e.preventDefault());
 listen(viewport,'keydown',e=>{if(e.target!==viewport)return;const p={x:w/2,y:h/2};if(['+','='].includes(e.key))transform(1.25,p,p);else if(e.key==='-')transform(.8,p,p);else if(['Home','0'].includes(e.key))setRect([0,0,1800,720],'overview');else if(e.key.startsWith('Arrow'))transform(1,p,{x:p.x+({ArrowLeft:30,ArrowRight:-30}[e.key]||0),y:p.y+({ArrowUp:30,ArrowDown:-30}[e.key]||0)});else return;e.preventDefault();});
 listen(window,'blur',cancel);listen(window,'pagehide',cancel);listen(document,'visibilitychange',()=>{if(document.hidden)cancel();});
 const observer=new ResizeObserver(resize);observer.observe(viewport);resize();
 return{setRect,followCenter,resize,cancel,getState:()=>({cx,cy,zoom,manual,mode,context,pointers:[...points.keys()],multi,w,h}),destroy(){cancel();observer.disconnect();abort.abort();}};
}
