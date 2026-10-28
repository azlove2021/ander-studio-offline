"use strict";
// Presentation adapter derived from dna-transcription@2.2.1.
// Original translation@2.1.4 actionPoint, science coordinates and clock are preserved; see provenance.json.
globalThis.createTranslationSceneView=({root,scene,nodes,getState,getProgress,getTiming})=>{
  const panel=scene.parentElement,workbench=root.querySelector('.translation-workbench');
  const viewport=document.createElement('div');viewport.className='translation-scene-viewport';
  viewport.setAttribute('role','region');viewport.setAttribute('aria-label','mRNA 翻译观察区；拖动或方向键平移，Home返回作用处');
  panel.insertBefore(viewport,scene);viewport.append(scene);
  const followButton=root.querySelector('[data-scene-follow]'),modeButton=root.querySelector('[data-scene-mode]');
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
    const p = getProgress();
    const timing = getTiming(p);
    const activeX = 278 + timing.ribosomeStep * 100;
    const selected = state.activeStructure;
    // All coordinates below include the original translation-content offset (0, -180).
    const peptidePoint = () => {
      const beads = nodes.peptideBeads.children;
      const visible = [...beads].filter(node => Number(node.getAttribute("opacity")) > .1 && Number(node.getAttribute("cy")) >= 180);
      if (!visible.length || Number(nodes.peptide.getAttribute("opacity")) < .1) return null;
      const first = visible[0], last = visible[visible.length - 1];
      return { x: (Number(first.getAttribute("cx")) + Number(last.getAttribute("cx"))) / 2, y: (Number(first.getAttribute("cy")) + Number(last.getAttribute("cy"))) / 2 - 180 + 8 };
    };
    if (selected === "polypeptide") {
      const point = peptidePoint();
      if (point) return point;
    }
    if ((selected === "release-factor" || (p >= .88 && p <= .912)) && Number(nodes.releaseFactor.getAttribute("opacity")) > .05) {
      const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(nodes.releaseFactor.getAttribute("transform"));
      if (m) return { x: Number(m[1]), y: Number(m[2]) - 165 };
    }
    if (selected === "trna") {
      const candidates = [...nodes.trnaLayer.children].filter(node => Number(node.getAttribute("opacity")) > .5);
      const node = candidates[candidates.length - 1];
      const m = node && /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(node.getAttribute("transform"));
      if (m) return { x: Number(m[1]), y: Number(m[2]) - 175 };
    }
    if (selected === "pairing") return { x: Math.min(1110, activeX + 90), y: 330 };
    if (selected === "mrna") return { x: Math.min(1110, activeX + 50), y: 310 };
    if ((viewHeight < 210 && timing.phase >= .34 && timing.phase <= .66 && p >= .34 && p < .86) || (p > .912 && p < .938)) {
      const point = peptidePoint();
      if (point) return point;
    }
    if (p >= .938) return { x: 1100, y: 310 };
    if (p >= .88) return { x: 1078, y: viewHeight >= 360 ? 240 : 290 };
    return { x: Math.min(1110, activeX + 45), y: p < .015 ? 300 : viewHeight >= 360 ? 235 : 290 };
  }

  function centerAt(point){
    viewport.scrollLeft=Math.max(0,Math.min(1260*scale-viewWidth,point.x*scale+offsetX-viewWidth/2));
    viewport.scrollTop=Math.max(0,Math.min(680*scale-viewHeight,point.y*scale+offsetY-viewHeight/2));
  }
  function center(){return{x:(viewport.scrollLeft+viewWidth/2-offsetX)/scale,y:(viewport.scrollTop+viewHeight/2-offsetY)/scale};}
  function sync(){if(compact&&following&&viewWidth&&viewHeight)centerAt(actionPoint());}
  function resize(){
    const oldCenter=compact&&!following?center():null;
    viewWidth=viewport.clientWidth;viewHeight=viewport.clientHeight;
    if(!viewWidth||!viewHeight)return;
    if(manualScale!==null){applyManualScale(manualScale,oldCenter);updateControls();return;}
    offsetY=0;scene.style.marginTop='';
    compact=mode==='local'||(mode==='auto'&&(viewWidth<820||viewHeight<460));
    workbench.toggleAttribute('data-local-view',compact);viewport.tabIndex=compact?0:-1;
    const immersive=root.querySelector('.model-area').dataset.immersive==='true';
    scale=compact?Math.min(immersive?1.35:1.3,Math.max(1.05,viewHeight/330)):Math.min(viewWidth/1260,viewHeight/680);
    offsetX=compact?Math.max(0,(viewWidth-1260*scale)/2):0;
    scene.style.width=compact?`${1260*scale}px`:'100%';scene.style.height=compact?`${680*scale}px`:'100%';
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
  root.addEventListener('click',event=>{if(event.target.closest('[data-stage-index], [data-action="reset"], [data-action="prev"], [data-action="next"], [data-structure-button]'))reveal();});
  root.querySelector('[data-timeline]').addEventListener('input',reveal);

  // Scale the original scientific plane around the fingers. Public chrome and the
  // initial auto-follow framing stay unchanged until the first pinch gesture.
  const planeWidth=1260,planeHeight=680;
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
