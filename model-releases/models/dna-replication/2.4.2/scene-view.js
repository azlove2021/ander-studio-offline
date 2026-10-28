"use strict";
// Presentation adapter derived from dna-transcription@2.2.1.
// Original dna-replication@2.3.3 actionPoint, science coordinates and clock are preserved; see provenance.json.
globalThis.createReplicationSceneView=({root,scene,nodes,getState,getForkX})=>{
  const panel=scene.parentElement,workbench=root.querySelector('.replication-workbench');
  const viewport=document.createElement('div');viewport.className='replication-scene-viewport';
  viewport.setAttribute('role','region');viewport.setAttribute('aria-label','DNA 复制观察区；拖动或方向键平移，Home返回作用处');
  panel.insertBefore(viewport,scene);viewport.append(scene);
  const followButton=root.querySelector('[data-scene-follow]'),modeButton=root.querySelector('[data-scene-mode]');
  const priorities=['topoisomerase','helicase','primase','pol3','pol1'];
  let following=true,mode='auto',compact=false,scale=1,viewWidth=0,viewHeight=0,offsetX=0,dragging=null,resizeFrame=0;
  let manualScale=null,offsetY=0,touchGesture=null;
  const shell=globalThis.AnderModelShell;
  const updateControls=()=>{
    shell.setExtra(followButton,'back',following?'跟随作用处':'返回作用处');
    followButton.setAttribute('aria-pressed',String(following));
    shell.setExtra(modeButton,'tools',compact?'全景':'局部');
    modeButton.setAttribute('aria-label',compact?'切换为全景观察':'切换为局部观察');
  };
  const setFollowing=value=>{following=value;updateControls();};
  function actionPoint() {
    const state = getState();
    const visible = (id) => Number(nodes[id]?.getAttribute("opacity")) > 0.05;
    const id = [state.activeEnzyme, priorities[state.stageIndex], "ligase", "pol1", "pol3", "helicase", "topoisomerase"].find(visible);
    const transform = id && nodes[id].getAttribute("transform");
    const position = transform && /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(transform);
    return position ? { x: Number(position[1]), y: Number(position[2]) + 18 } : { x: getForkX(), y: 330 };
  }

  function centerAt(point){
    viewport.scrollLeft=Math.max(0,Math.min(980*scale-viewWidth,point.x*scale+offsetX-viewWidth/2));
    viewport.scrollTop=Math.max(0,Math.min(640*scale-viewHeight,point.y*scale+offsetY-viewHeight/2));
  }
  function center(){return{x:(viewport.scrollLeft+viewWidth/2-offsetX)/scale,y:(viewport.scrollTop+viewHeight/2-offsetY)/scale};}
  function sync(){if(compact&&following&&viewWidth&&viewHeight)centerAt(viewHeight>=430?{...actionPoint(),y:330}:actionPoint());}
  function resize(){
    const oldCenter=compact&&!following?center():null;
    viewWidth=viewport.clientWidth;viewHeight=viewport.clientHeight;
    if(!viewWidth||!viewHeight)return;
    if(manualScale!==null){applyManualScale(manualScale,oldCenter);updateControls();return;}
    offsetY=0;scene.style.marginTop='';
    compact=mode==='local'||(mode==='auto'&&(viewWidth<820||viewHeight<460));
    workbench.toggleAttribute('data-local-view',compact);viewport.tabIndex=compact?0:-1;
    const immersive=root.querySelector('.model-area').dataset.immersive==='true';
    scale=compact?Math.min(immersive?1.35:1.3,Math.max(1.05,viewHeight/330)):Math.min(viewWidth/980,viewHeight/640);
    offsetX=compact?Math.max(0,(viewWidth-980*scale)/2):0;
    scene.style.width=compact?`${980*scale}px`:'100%';scene.style.height=compact?`${640*scale}px`:'100%';
    if(!compact){viewport.scrollLeft=0;viewport.scrollTop=0;}
    else if(oldCenter)centerAt(oldCenter);else sync();
    // Recenter after the browser settles the SVG size and scrollbars on orientation changes.
    cancelAnimationFrame(resizeFrame);
    resizeFrame=requestAnimationFrame(()=>{if(compact){if(following)sync();else if(oldCenter)centerAt(oldCenter);}});
    updateControls();
  }
  function reveal(){manualScale=null;delete viewport.dataset.gestureScale;setFollowing(true);if(mode==='overview'||mode==='manual')mode='auto';resize();sync();}
  followButton.addEventListener('click',()=>{mode='local';reveal();});
  modeButton.addEventListener('click',()=>{manualScale=null;delete viewport.dataset.gestureScale;mode=compact?'overview':'local';following=true;resize();});
  viewport.addEventListener('wheel',()=>{if(compact)setFollowing(false);},{passive:true});
  viewport.addEventListener('pointerdown',event=>{
    if(!compact)return;setFollowing(false);
    if(event.pointerType==='touch'||event.button!==0)return;
    dragging={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove',event=>{
    if(!dragging||dragging.id!==event.pointerId)return;
    viewport.scrollLeft=dragging.left-event.clientX+dragging.x;viewport.scrollTop=dragging.top-event.clientY+dragging.y;
  });
  const endDrag=()=>{dragging=null;};
  for(const name of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(name,endDrag);
  viewport.addEventListener('keydown',event=>{
    if(!compact||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();
    if(event.key==='Home')return reveal();setFollowing(false);
    viewport.scrollLeft+=event.key==='ArrowLeft'?-64:event.key==='ArrowRight'?64:0;
    viewport.scrollTop+=event.key==='ArrowUp'?-64:event.key==='ArrowDown'?64:0;
  });
  root.addEventListener('click',event=>{if(event.target.closest('[data-stage-index], [data-action="reset"], [data-action="prev"], [data-action="next"], [data-enzyme-button]'))reveal();});
  root.querySelector('[data-timeline]').addEventListener('input',reveal);

  // Scale the original scientific plane around the fingers. Public chrome and the
  // initial auto-follow framing stay unchanged until the first pinch gesture.
  const planeWidth=980,planeHeight=640;
  function applyManualScale(value,point=null,screen=null){
    viewport.dataset.gestureScale='true';
    viewWidth=viewport.clientWidth;viewHeight=viewport.clientHeight;
    const fit=Math.min(viewWidth/planeWidth,viewHeight/planeHeight);
    manualScale=scale=Math.max(fit,Math.min(3,value));
    compact=true;mode='manual';following=false;
    offsetX=Math.max(0,(viewWidth-planeWidth*scale)/2);
    offsetY=Math.max(0,(viewHeight-planeHeight*scale)/2);
    scene.style.width=planeWidth*scale+'px';scene.style.height=planeHeight*scale+'px';scene.style.marginTop=offsetY+'px';
    workbench.setAttribute('data-local-view','');viewport.tabIndex=0;
    if(point){
      const p=screen||{x:viewWidth/2,y:viewHeight/2};
      viewport.scrollLeft=point.x*scale+offsetX-p.x;
      viewport.scrollTop=point.y*scale+offsetY-p.y;
    }
    updateControls();
  }
  function fingerPosition(touches){
    const rect=viewport.getBoundingClientRect(),a=touches[0],b=touches[1]||a;
    return{x:(a.clientX+b.clientX)/2-rect.left,y:(a.clientY+b.clientY)/2-rect.top,distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)||1};
  }
  function beginTouch(event){
    if(!event.touches.length)return;
    if(event.touches.length<2&&!compact){touchGesture=null;return;}
    event.preventDefault();setFollowing(false);cancelAnimationFrame(resizeFrame);
    const p=fingerPosition(event.touches);
    // In overview the SVG uses a full-size box with centered letterboxing.
    const xInset=compact?offsetX:Math.max(0,(viewWidth-planeWidth*scale)/2);
    const yInset=compact?offsetY:Math.max(0,(viewHeight-planeHeight*scale)/2);
    touchGesture={count:event.touches.length,point:p,scale,anchor:{x:(viewport.scrollLeft+p.x-xInset)/scale,y:(viewport.scrollTop+p.y-yInset)/scale},left:viewport.scrollLeft,top:viewport.scrollTop};
  }
  viewport.addEventListener('touchstart',beginTouch,{passive:false});
  viewport.addEventListener('touchmove',event=>{
    if(!touchGesture)return;
    event.preventDefault();
    if(event.touches.length!==touchGesture.count){beginTouch(event);return;}
    const p=fingerPosition(event.touches);
    if(event.touches.length>=2)applyManualScale(touchGesture.scale*p.distance/touchGesture.point.distance,touchGesture.anchor,p);
    else{
      viewport.scrollLeft=touchGesture.left+touchGesture.point.x-p.x;
      viewport.scrollTop=touchGesture.top+touchGesture.point.y-p.y;
    }
  },{passive:false});
  viewport.addEventListener('touchend',event=>{touchGesture=null;if(event.touches.length)beginTouch(event);},{passive:false});
  viewport.addEventListener('touchcancel',()=>{touchGesture=null;},{passive:true});
  // Safari must not turn this content gesture into page zoom.
  for(const name of ['gesturestart','gesturechange'])viewport.addEventListener(name,event=>event.preventDefault(),{passive:false});

  const observer=new ResizeObserver(resize);observer.observe(viewport);resize();
  return{sync,resize,reveal,getState:()=>({following,mode,local:compact,scale,manualScale,fitScale:Math.min(viewWidth/planeWidth,viewHeight/planeHeight),viewWidth,viewHeight,center:center(),scroll:{x:viewport.scrollLeft,y:viewport.scrollTop},actionPoint:actionPoint()})};
};
