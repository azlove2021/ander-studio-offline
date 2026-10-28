/* Package-local presentation camera. It never changes scientific coordinates or state. */
(() => {
  'use strict';
  globalThis.ModelSceneNavigation = function ({viewport, planes, width, height, initial = 'detail', onChange}) {
    const abort = new AbortController(), {signal} = abort, points = new Map();
    let scale = 1, x = 0, y = 0, vw = 0, vh = 0, minimum = 1, fitted = false;
    let multi = false, moved = false, blockedUntil = 0, previous = null, origin = null;
    const limit = (n, a, b) => Math.max(a, Math.min(b, n));
    const listen = (node, name, fn, options = {}) => node.addEventListener(name, fn, {...options, signal});
    const state = () => ({scale, x, y, width, height, viewportWidth:vw, viewportHeight:vh, minimum, fitted, pointers:points.size, multi});
    function draw() {
      x = width * scale <= vw ? (vw-width*scale)/2 : limit(x, vw-width*scale, 0);
      y = height * scale <= vh ? (vh-height*scale)/2 : limit(y, vh-height*scale, 0);
      for (const plane of planes) plane.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
      viewport.dataset.sceneScale = scale.toFixed(5); onChange?.(state());
    }
    function fit() { fitted=true; scale=minimum; x=(vw-width*scale)/2; y=(vh-height*scale)/2; draw(); }
    function reset() {
      if(initial==='fit') return fit();
      fitted=false;scale=Math.max(minimum, Math.min(1,(vh-12)/height));x=0;y=(vh-height*scale)/2;draw();
    }
    function resize() {
      const nw=viewport.clientWidth, nh=viewport.clientHeight;
      if(nw<1||nh<1||nw===vw&&nh===vh)return;
      const cx=vw?(vw/2-x)/scale:width/2, cy=vh?(vh/2-y)/scale:height/2, fresh=!vw;
      vw=nw;vh=nh;minimum=Math.min((vw-12)/width,(vh-12)/height);
      minimum=Math.max(.01,minimum);
      if(fresh)return reset(); if(fitted)return fit();
      scale=Math.max(minimum,scale);x=vw/2-cx*scale;y=vh/2-cy*scale;draw();
      previous=null;
    }
    function zoomBy(factor, anchor={x:vw/2,y:vh/2}) {
      const next=limit(scale*factor,minimum,Math.max(2.5,minimum*5)), ratio=next/scale;
      x=anchor.x-(anchor.x-x)*ratio;y=anchor.y-(anchor.y-y)*ratio;scale=next;
      fitted=Math.abs(scale-minimum)<.0001;draw();
    }
    const local = event => {const r=viewport.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top};};
    const pair = () => {const [a,b]=[...points.values()];return{x:(a.x+b.x)/2,y:(a.y+b.y)/2,d:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};};
    listen(viewport,'pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      if(!points.size){multi=false;moved=false;origin=local(event);}
      points.set(event.pointerId,local(event));
      // Capture on the actual target: stationary taps on element buttons retain their click target.
      try{event.target.setPointerCapture(event.pointerId);}catch{}
      if(points.size>=2){multi=true;moved=true;previous=pair();}else previous=local(event);
    });
    listen(viewport,'pointermove',event=>{
      if(!points.has(event.pointerId))return;
      const p=local(event);points.set(event.pointerId,p);
      if(points.size>=2){
        const now=pair();if(previous){zoomBy(now.d/previous.d,{x:previous.x,y:previous.y});x+=now.x-previous.x;y+=now.y-previous.y;fitted=Math.abs(scale-minimum)<.0001;draw();}previous=now;
      }else if(!multi){
        if(origin&&Math.hypot(p.x-origin.x,p.y-origin.y)>5)moved=true;
        if(moved&&previous){x+=p.x-previous.x;y+=p.y-previous.y;fitted=false;draw();}previous=p;
      }
      if(moved)event.preventDefault();
    });
    function finish(event){
      if(!points.has(event.pointerId))return;
      if(event.type!=='pointerup'){multi=true;moved=true;}
      points.delete(event.pointerId);
      // Never interpret the tail of a pinch as a drag or an element selection.
      previous=points.size>=2?pair():null;
      if(multi||moved)blockedUntil=performance.now()+450;
      if(!points.size){multi=false;origin=null;}
    }
    for(const name of ['pointerup','pointercancel','lostpointercapture'])listen(viewport,name,finish);
    function cancel(){points.clear();previous=null;origin=null;multi=false;blockedUntil=performance.now()+450;}
    listen(window,'blur',cancel);listen(window,'pagehide',cancel);
    listen(document,'visibilitychange',()=>{if(document.hidden)cancel();});
    listen(viewport,'click',event=>{if(moved||performance.now()<blockedUntil){event.preventDefault();event.stopImmediatePropagation();moved=false;}}, {capture:true});
    listen(viewport,'wheel',event=>{event.preventDefault();zoomBy(Math.exp(-event.deltaY*.0015),local(event));},{passive:false});
    listen(viewport,'keydown',event=>{
      if(event.target!==viewport)return;
      if(event.key==='+'||event.key==='=')zoomBy(1.25);else if(event.key==='-')zoomBy(.8);else if(event.key==='0')fit();
      else if(event.key.startsWith('Arrow')){x+=event.key==='ArrowLeft'?40:event.key==='ArrowRight'?-40:0;y+=event.key==='ArrowUp'?40:event.key==='ArrowDown'?-40:0;fitted=false;draw();}
      else return;event.preventDefault();
    });
    const observer=new ResizeObserver(resize);observer.observe(viewport);resize();
    return Object.freeze({fit,reset,resize,zoomBy,getState:state,destroy(){abort.abort();observer.disconnect();cancel();}});
  };
})();
