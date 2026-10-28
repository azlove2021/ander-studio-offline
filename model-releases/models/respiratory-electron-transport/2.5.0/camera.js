// Adapted from cellular-respiration 2.2.0 lab-gesture.js; retains multi-pointer tail blocking.
export function createCamera(svg,viewport,onSelect,onManual){
 const points=new Map(),abort=new AbortController(),signal=abort.signal,background=viewport.querySelector('#science-background');
 let multi=false,moved=false,previous=null,origin=null,target=null,blocked=0,w=0,h=0,base=1,cx=800,cy=360,zoom=1,manual=false,mode='follow',context='overview',presetRect=null;
 const listen=(n,t,f,o={})=>n.addEventListener(t,f,{...o,signal});
 const local=e=>{const b=viewport.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}};
 const pair=()=>{const[a,b]=[...points.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))}};
 function draw(){
  const halfW=w/(2*base*zoom),halfH=h/(2*base*zoom);
  const immersive=viewport.closest('.model-area').dataset.immersive==='true';
  const pocketFocus=context==='synthase'&&presetRect?.[1]>=419&&mode!=='manual';
  cx=pocketFocus?cx:halfW>=800?800:Math.max(halfW,Math.min(1600-halfW,cx));cy=immersive?Math.max(80-halfH,Math.min(640+halfH,cy)):(halfH>=360?360:Math.max(halfH,Math.min(720-halfH,cy)));
  const box=[cx-halfW,cy-halfH,halfW*2,halfH*2];svg.setAttribute('viewBox',box.join(' '));
  background.setAttribute('viewBox',box.join(' '));
  svg.dataset.view=zoom>1.05?'focus':'overview';
  svg.dataset.focus=context;
  const clip=svg.querySelector('#camera-rect');if(clip)['x','y','width','height'].forEach((a,i)=>clip.setAttribute(a,box[i]));
 }
 function transform(factor,from,to){manual=true;mode='manual';context='overview';const old=base*zoom,next=Math.max(1,Math.min(9,zoom*factor)),s=base*next;
  const sx=cx+(from.x-w/2)/old,sy=cy+(from.y-h/2)/old;cx=sx-(to.x-w/2)/s;cy=sy-(to.y-h/2)/s;zoom=next;draw();}
 function setRect(rect,chosenMode='focus',chosenContext='overview'){
  presetRect=[...rect];
  manual=chosenMode!=='follow';mode=chosenMode;context=chosenContext;const area=viewport.closest('.model-area'),immersive=area.dataset.immersive==='true';
  const top=immersive?78:0,bottom=immersive?(parseFloat(getComputedStyle(area).getPropertyValue('--shell-dock-height'))||100)+84:0;
  const usable=Math.max(110,h-top-bottom),scale=Math.min(w/rect[2],usable/rect[3]);
  zoom=Math.max(1,Math.min(9,scale/base));cx=rect[0]+rect[2]/2;cy=rect[1]+rect[3]/2+(bottom-top)/(2*base*zoom);draw();
 }
 function resize(){const b=viewport.getBoundingClientRect();w=Math.max(1,b.width);h=Math.max(1,b.height);base=Math.min(w/1600,h/720);if(presetRect&&mode!=='manual')setRect(presetRect,mode,context);else draw();}
 function cancel(){for(const id of points.keys())try{viewport.releasePointerCapture(id)}catch{}points.clear();multi=false;previous=null;origin=null;target=null;blocked=performance.now()+450;}
 listen(viewport,'pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;if(!points.size){multi=false;moved=false;origin=local(e);target=e.target;
  // Contact owns the current view immediately; the drag threshold still governs pan and tap selection.
  manual=true;mode='manual';onManual?.();}
  points.set(e.pointerId,local(e));try{viewport.setPointerCapture(e.pointerId)}catch{}if(points.size>=2){multi=true;moved=true;manual=true;mode='manual';previous=pair()}else previous=local(e);e.preventDefault();});
 listen(viewport,'pointermove',e=>{if(!points.has(e.pointerId))return;const p=local(e);points.set(e.pointerId,p);
  if(points.size>=2){const now=pair();if(previous)transform(now.d/previous.d,previous,now);previous=now;}
  else if(!multi){if(origin&&Math.hypot(p.x-origin.x,p.y-origin.y)>5)moved=true;if(moved&&previous)transform(1,previous,p);previous=p;}
  if(moved)e.preventDefault();});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(viewport,type,e=>{
  if(!points.has(e.pointerId))return;if(type!=='pointerup'){multi=true;moved=true;}
  const tap=type==='pointerup'&&points.size===1&&!multi&&!moved?target:null;points.delete(e.pointerId);previous=points.size>=2?pair():null;
  if(multi||moved)blocked=performance.now()+450;if(!points.size){multi=false;origin=null;target=null;}if(tap)onSelect?.(tap.closest('[data-object]')?.dataset.object);
 });
 listen(viewport,'click',e=>{if(e.detail>0||moved||performance.now()<blocked){e.preventDefault();e.stopImmediatePropagation();moved=false;}},{capture:true});
 listen(viewport,'wheel',e=>{e.preventDefault();const p=local(e);transform(Math.exp(-e.deltaY*.0015),p,p);},{passive:false});
 listen(viewport,'contextmenu',e=>e.preventDefault());listen(viewport,'dragstart',e=>e.preventDefault());
 listen(viewport,'keydown',e=>{if(e.target!==viewport)return;const p={x:w/2,y:h/2};
  if(['+','='].includes(e.key))transform(1.25,p,p);else if(e.key==='-')transform(.8,p,p);else if(['Home','0'].includes(e.key))setRect([0,0,1600,720],'overview');else if(e.key.startsWith('Arrow'))transform(1,p,{x:p.x+({ArrowLeft:30,ArrowRight:-30}[e.key]||0),y:p.y+({ArrowUp:30,ArrowDown:-30}[e.key]||0)});else return;e.preventDefault();});
 listen(window,'blur',cancel);listen(window,'pagehide',cancel);listen(document,'visibilitychange',()=>{if(document.hidden)cancel()});
 const observer=new ResizeObserver(resize);observer.observe(viewport);resize();
 return{setRect,resize,cancel,getState:()=>({cx,cy,zoom,manual,mode,context,pointers:[...points.keys()],multi,w,h}),destroy(){cancel();observer.disconnect();abort.abort();}};
}
