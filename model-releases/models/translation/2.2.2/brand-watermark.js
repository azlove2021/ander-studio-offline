// model-brand-watermark-1.0, runtime 1.0.2.
// Same vector assets, shader and timing as user-accepted style 13 (2026-09-29).
// This component never advances or pauses the scientific model.
const STANDARD='model-brand-watermark-1.0', VERSION='1.0.2';
const PERIOD=20000,DURATION=2000,OPACITY=.10;
const config=await fetch(new URL('brand-watermark.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('Missing watermark configuration');return r.json();});
if(config.standard!==STANDARD)throw new Error('Unsupported watermark standard');
const cornerAsset=new Image();cornerAsset.src=new URL('assets/brand-stacked.svg',import.meta.url);
const centerAsset=new Image();centerAsset.src=new URL('assets/brand-horizontal.svg',import.meta.url);
await Promise.all([cornerAsset.decode(),centerAsset.decode()]);
const raster=document.createElement('canvas');raster.width=2048;raster.height=Math.round(2048*centerAsset.naturalHeight/centerAsset.naturalWidth);
let rasterFailure=null;
try{const context=raster.getContext('2d');if(!context)throw new Error('Canvas 2D unavailable');context.drawImage(centerAsset,0,0,raster.width,raster.height);}catch(error){rasterFailure=error.message;}
let pending=null, mounting=false, generation=0;
function targets(){
  const viewport=document.querySelector(config.viewport),host=document.querySelector(config.host||config.viewport);
  const sceneSvg=config.svg?document.querySelector(config.svg):null;
  const sceneParent=sceneSvg&&(config.svgParent?sceneSvg.querySelector(config.svgParent):sceneSvg);
  const anchor=config.after?sceneParent?.querySelector(config.after):null;
  const foreground=config.foreground?document.querySelector(config.foreground):null;
  if(!host||!viewport||(config.svg&&(!sceneParent||(config.after&&!anchor)))||(config.foreground&&!foreground)||(config.ready&&!document.querySelector(config.ready)))return null;
  return {host,viewport,sceneSvg,sceneParent,anchor,foreground};
}
function attach(){
  if(mounting)return;
  const nodes=targets();if(!nodes)return;
  mounting=true;pending?.disconnect();pending=null;
  try{window.ModelBrandWatermark=createWatermark(nodes,++generation);}catch(error){console.error('Brand watermark:',error);}
}
function waitForScene(){
  mounting=false;pending?.disconnect();
  pending=new MutationObserver(attach);
  pending.observe(document.body,{childList:true,subtree:true});
  attach();
}
function createWatermark({host,viewport,sceneSvg,sceneParent,anchor,foreground},generation){
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const addedClasses=[];
function addClass(node,name){if(node&&!node.classList.contains(name)){node.classList.add(name);addedClasses.push([node,name]);}}
addClass(host,'model-brand-host');
if(config.cornerFooter)addClass(host,'model-brand-footer-host');
if(getComputedStyle(host).position==='static')addClass(host,'model-brand-positioned');
if(foreground){addClass(foreground,'model-brand-foreground');if(getComputedStyle(foreground).position==='static')addClass(foreground,'model-brand-positioned');}
const layer=document.createElement('div');layer.className='model-brand-layer';layer.setAttribute('aria-hidden','true');
const originalMaxHeight=viewport.style.getPropertyValue('max-height'),originalMaxHeightPriority=viewport.style.getPropertyPriority('max-height');
const corner=document.createElement('div');corner.className='model-brand-corner';const cornerImage=cornerAsset.cloneNode();cornerImage.alt='';corner.append(cornerImage);layer.append(corner);host.append(layer);
const center=document.createElement('canvas');center.className='model-brand-center';
// Keep the drawing buffer stable across rotation/fullscreen. WebKit can retain
// stale compositing storage after a WebGL canvas resize even when readPixels is correct.
// Size once for either screen orientation, capped at the source raster resolution.
const pixelRatio=Math.min(2,devicePixelRatio||1);
center.width=Math.max(1,Math.ceil(Math.min(raster.width,Math.max(screen.width,screen.height,innerWidth,innerHeight)*.75*pixelRatio)));
center.height=Math.max(1,Math.round(center.width*centerAsset.naturalHeight/centerAsset.naturalWidth));
let backdrop,sceneObserver=null;
// Sanger's background was originally emitted after its nonoverlapping tube group.
// Move only that background before the tube so *all* science stays in front.
const originalAnchorNext=anchor?.nextSibling;
if(config.backgroundFirst&&anchor){const first=[...sceneParent.children].find(n=>!['defs','title','desc'].includes(n.localName));if(first!==anchor)sceneParent.insertBefore(anchor,first);}
if(sceneSvg){
  backdrop=document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
  backdrop.classList.add('model-brand-svg-background');backdrop.setAttribute('aria-hidden','true');backdrop.append(center);
  if(anchor)anchor.after(backdrop);else{const first=[...sceneParent.children].find(n=>!['defs','title','desc'].includes(n.localName));sceneParent.insertBefore(backdrop,first||null);}
}else{
  backdrop=document.createElement('div');backdrop.className='model-brand-background';backdrop.setAttribute('aria-hidden','true');backdrop.append(center);host.prepend(backdrop);
}
// The static corner has its own DOM/layout lifecycle. GPU failure only disables the central effect.
let gl=null,program=null,buffer=null,texture=null,phaseUniform=null;
let shaderResources=[],rendererReady=false,fallbackReason=null,contextLossCount=0;
const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=vec2((position.x+1.0)*.5,(1.0-position.y)*.5);gl_Position=vec4(position,0.,1.);}`;
// A single diagonal wave reveals and then hides the same vector artwork.
// Only the watermark is displaced; its maximum opacity is exactly 10%.
const fragment=`precision highp float;varying vec2 uv;uniform sampler2D brandImage;uniform float phase;uniform float opacity;uniform vec2 logicalSize;
float inside(vec2 p){return step(0.,p.x)*step(0.,p.y)*step(p.x,1.)*step(p.y,1.);}
void main(){
 vec2 pixel=uv*logicalSize;
 float diagonal=(pixel.x+pixel.y)/(logicalSize.x+logicalSize.y);
 float presence=smoothstep(0.,.12,phase)*(1.-smoothstep(.88,1.,phase))*step(0.,phase);
 float front=clamp(phase,0.,1.)*1.5-.25,distance=diagonal-front;
 float band=exp(-pow(distance/.20,2.));
 float ripple=sin(distance*31.4)*band*presence;
 vec2 waved=uv+vec2(ripple*11.,ripple*6.)/logicalSize;
 vec4 mark=texture2D(brandImage,clamp(waved,0.,1.));
 float alpha=opacity*mark.a*inside(waved)*band*presence;
 gl_FragColor=vec4(mark.rgb*alpha,alpha);
}`;

function releaseGpu(loseContext=true){
  const context=gl,old={program,buffer,texture,shaders:shaderResources};
  gl=null;program=null;buffer=null;texture=null;phaseUniform=null;shaderResources=[];rendererReady=false;
  if(!context)return;
  const attempt=fn=>{try{fn();}catch(_){/* Continue releasing the remaining partially initialized resources. */}};
  if(old.texture)attempt(()=>context.deleteTexture(old.texture));
  if(old.buffer)attempt(()=>context.deleteBuffer(old.buffer));
  if(old.program)attempt(()=>context.deleteProgram(old.program));
  for(const shader of old.shaders)attempt(()=>context.deleteShader(shader));
  if(loseContext)attempt(()=>{if(!context.isContextLost())context.getExtension('WEBGL_lose_context')?.loseContext();});
}
function disableEffect(reason,contextLost=false){
  stop();phase=-1;available=false;fallbackReason=String(reason||'Watermark renderer unavailable');
  center.style.visibility='hidden';releaseGpu(!contextLost);
}
function initializeEffect(){
  try{
    if(rasterFailure)throw new Error(rasterFailure);
    gl=center.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
    if(!gl||gl.isContextLost())throw new Error('WebGL unavailable for the central watermark');
    const requireResource=(value,name)=>{if(!value)throw new Error('Unable to allocate '+name);return value;};
    function shader(type,source){
      const value=requireResource(gl.createShader(type),'shader');shaderResources.push(value);
      gl.shaderSource(value,source);gl.compileShader(value);
      if(!gl.getShaderParameter(value,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(value)||'Watermark shader compilation failed');
      return value;
    }
    program=requireResource(gl.createProgram(),'program');
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'Watermark program linking failed');
    gl.useProgram(program);
    buffer=requireResource(gl.createBuffer(),'buffer');gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const positionLocation=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,0,0);
    texture=requireResource(gl.createTexture(),'texture');gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    // Upload straight-alpha artwork; premultiply the final wave alpha exactly once in the shader.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,raster);
    gl.uniform1i(gl.getUniformLocation(program,'brandImage'),0);gl.uniform1f(gl.getUniformLocation(program,'opacity'),OPACITY);
    gl.uniform2f(gl.getUniformLocation(program,'logicalSize'),centerAsset.naturalWidth,centerAsset.naturalHeight);
    phaseUniform=gl.getUniformLocation(program,'phase');
    if(gl.getError()!==gl.NO_ERROR)throw new Error('Watermark GPU initialization failed');
    gl.viewport(0,0,center.width,center.height);rendererReady=true;fallbackReason=null;
  }catch(error){disableEffect(error.message);}
}
let frame=0,timer=0,phase=-1,pulseCount=0,nextStart=0,auto=true,enabled=true,intersecting=false,available=false,disposed=false,holding=false;
let layerBox={},cornerBox={},centerBox={},cornerAvailable=false;
const removers=[],pulseStarts=[];
function listen(target,type,fn,options){target.addEventListener(type,fn,options);removers.push(()=>target.removeEventListener(type,fn,options));}
function draw(p=-1){
  if(disposed)return;
  if(!rendererReady){phase=-1;center.style.visibility='hidden';return;}
  phase=p;center.style.visibility=p>=0&&p<1?'visible':'hidden';
  try{gl.uniform1f(phaseUniform,p);gl.drawArrays(gl.TRIANGLES,0,6);}catch(error){disableEffect(error.message);}
}
function stop(){cancelAnimationFrame(frame);clearTimeout(timer);frame=0;timer=0;nextStart=0;}
function schedule(delay=PERIOD){
  clearTimeout(timer);timer=0;
  if(auto&&available&&rendererReady&&!holding){nextStart=performance.now()+delay;timer=setTimeout(play,delay);}
}
function play(){
  if(reduced.matches||document.hidden){sync();stop();draw();return;}
  if(!available||!rendererReady||disposed)return;
  stop();holding=false;pulseCount++;const start=performance.now();const followingStart=start+PERIOD;nextStart=followingStart;
  pulseStarts.push(start);if(pulseStarts.length>4)pulseStarts.shift();
  const tick=now=>{frame=0;if(reduced.matches||document.hidden){sync();stop();draw();return;}const p=(now-start)/DURATION;if(p>=1){draw();schedule(Math.max(0,followingStart-performance.now()));return;}draw(p);if(available&&rendererReady)frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);
}
const ancestors=new Set();
for(let node=host;node;node=node.parentElement)ancestors.add(node);
try{for(let f=window.frameElement;f;f=f.ownerDocument.defaultView.frameElement)for(let node=f;node;node=node.parentElement)ancestors.add(node);}catch(_){/* Cross-origin hosts remain controlled by page visibility and intersection. */}
const shown=node=>node.isConnected&&(getComputedStyle(node).display==='contents'||(node.checkVisibility?node.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}):getComputedStyle(node).display!=='none'));
function disconnected(){return !host.isConnected||(sceneSvg&&!sceneSvg.isConnected)||(foreground&&!foreground.isConnected);}
function reconnect(){if(disposed)return;destroy();waitForScene();}
// Fullscreen and viewport-fixed containers escape the outer page's overflow clips.
// A transformed/contained ancestor can instead establish a fixed containing block.
function clippingAncestors(){
  const chain=[];
  for(let node=viewport;node;node=node.parentElement){
    if(node!==viewport)chain.push(node);
    if(node===document.fullscreenElement)break;
    if(getComputedStyle(node).position!=='fixed')continue;
    let containingBlock=false;
    for(let parent=node.parentElement;parent;parent=parent.parentElement){
      const s=getComputedStyle(parent);
      if(s.transform!=='none'||s.perspective!=='none'||s.filter!=='none'||
        (s.backdropFilter&&s.backdropFilter!=='none')||/(layout|paint|strict|content)/.test(s.contain)||
        /(transform|perspective|filter)/.test(s.willChange)||s.contentVisibility==='auto'){
        containingBlock=true;break;
      }
    }
    if(!containingBlock)break;
  }
  return chain;
}
function sync(){
  if(disposed)return;
  if(disconnected()){reconnect();return;}
  cornerAvailable=enabled&&!document.hidden&&intersecting&&[...ancestors].every(shown)&&layerBox.width>0&&layerBox.height>0;
  const next=cornerAvailable&&!reduced.matches&&rendererReady;
  if(next!==available){available=next;stop();draw();if(next)schedule(pulseCount===0?1600:PERIOD);}
  layer.classList.toggle('is-hidden',!enabled);backdrop.classList.toggle('is-hidden',!enabled);
}
function layout(){
  if(disposed)return;if(disconnected()){reconnect();return;}
  const clipping=clippingAncestors();
  if(config.cornerFooter){
    let visibleBottom=innerHeight;
    for(const node of clipping){
      if(node===host)continue;
      if(/auto|scroll|hidden|clip/.test(getComputedStyle(node).overflowY)){const r=node.getBoundingClientRect();visibleBottom=Math.min(visibleBottom,r.top+node.clientTop+node.clientHeight);}
    }
    const footerSpace=parseFloat(getComputedStyle(host).paddingBottom)+4;
    const cap=Math.max(20,Math.floor(visibleBottom-viewport.getBoundingClientRect().top-footerSpace))+'px';
    if(viewport.style.maxHeight!==cap)viewport.style.setProperty('max-height',cap,'important');
  }
  const measured=getComputedStyle(viewport).display==='contents'&&sceneSvg?sceneSvg:viewport;
  const hb=host.getBoundingClientRect(),vb=measured.getBoundingClientRect();
  let left=Math.max(0,vb.left+measured.clientLeft),top=Math.max(0,vb.top+measured.clientTop),right=Math.min(innerWidth,vb.left+measured.clientLeft+measured.clientWidth),bottom=Math.min(innerHeight,vb.top+measured.clientTop+measured.clientHeight);
  for(const node of clipping){
    const style=getComputedStyle(node),b=node.getBoundingClientRect();
    if(style.display==='contents')continue;
    if(/auto|scroll|hidden|clip/.test(style.overflowX)){left=Math.max(left,b.left+node.clientLeft);right=Math.min(right,b.left+node.clientLeft+node.clientWidth);}
    if(/auto|scroll|hidden|clip/.test(style.overflowY)){top=Math.max(top,b.top+node.clientTop);bottom=Math.min(bottom,b.top+node.clientTop+node.clientHeight);}
  }
  layerBox={left:left-hb.left-host.clientLeft+host.scrollLeft,top:top-hb.top-host.clientTop+host.scrollTop,width:Math.max(0,right-left),height:Math.max(0,bottom-top)};
  const setBox=(node,box)=>{for(const [key,v]of Object.entries(box)){const px=v.toFixed(3)+'px';if(node.style[key]!==px)node.style[key]=px;}};
  setBox(layer,config.cornerFooter?{left:0,top:0,width:host.clientWidth,height:host.clientHeight}:layerBox);
  const margin=Math.min(14,Math.max(6,layerBox.width*.009)),aspect=cornerAsset.naturalWidth/cornerAsset.naturalHeight;
  // Retain the accepted accommodation for the legacy PCR short viewport.
  const lifted=config.shortViewportLift&&innerWidth<=860&&layerBox.height<=180;
  const heightLimit=layerBox.height<=180?Math.min(lifted?24:28,layerBox.height-2*margin):Math.min(86,layerBox.height*.24);
  const cw=Math.SQRT1_2*Math.max(0,Math.min(88,Math.max(58,layerBox.width*.09),layerBox.width-2*margin,heightLimit*aspect)),ch=cw/aspect;
  cornerBox={left:margin,top:lifted?2:Math.max(0,layerBox.height-ch-margin),width:cw,height:ch};
  // The periodic table has no safe empty corner at all responsive sizes.
  // Reserve a short footer within its card; never cover element/series labels.
  if(config.cornerFooter){const fw=Math.min(41,host.clientWidth-2*margin,(parseFloat(getComputedStyle(host).paddingBottom)-8)*aspect);cornerBox={left:margin,top:host.clientHeight-fw/aspect-6,width:fw,height:fw/aspect};}
  setBox(corner,cornerBox);
  const centerAspect=centerAsset.naturalWidth/centerAsset.naturalHeight;
  const bw=Math.max(1,Math.min(layerBox.width*.75,Math.max(1,layerBox.height-8)*centerAspect)),bh=bw/centerAspect;
  centerBox={left:(layerBox.width-bw)/2,top:(layerBox.height-bh)/2,width:bw,height:bh};
  if(sceneSvg){
    const matrix=sceneParent.getScreenCTM();
    if(matrix&&matrix.a*matrix.d-matrix.b*matrix.c!==0){
      const origin=new DOMPoint(left+centerBox.left,top+centerBox.top).matrixTransform(matrix.inverse());
      const attrs={x:origin.x,y:origin.y,width:bw/Math.hypot(matrix.a,matrix.b),height:bh/Math.hypot(matrix.c,matrix.d)};
      for(const [key,value]of Object.entries(attrs)){const v=value.toFixed(4);if(backdrop.getAttribute(key)!==v)backdrop.setAttribute(key,v);}
    }
  }else{setBox(backdrop,layerBox);setBox(center,centerBox);}
  layer.classList.add('is-ready');sync();
}
const resize=new ResizeObserver(layout),intersection=new IntersectionObserver(entries=>{intersecting=entries.at(-1).isIntersecting;layout();},{threshold:[0,.01]});
const mutation=new MutationObserver(sync);
if(sceneSvg){sceneObserver=new MutationObserver(layout);sceneObserver.observe(sceneSvg,{attributes:true,attributeFilter:['viewBox','preserveAspectRatio','class']});if(sceneParent!==sceneSvg)sceneObserver.observe(sceneParent,{attributes:true,attributeFilter:['transform','class']});resize.observe(sceneSvg);}
resize.observe(viewport);if(host!==viewport)resize.observe(host);intersection.observe(sceneSvg||viewport);
ancestors.forEach(node=>mutation.observe(node,{attributes:true,attributeFilter:['class','style','hidden'],childList:true}));
if(sceneSvg&&sceneSvg.parentElement!==host)mutation.observe(sceneSvg.parentElement,{childList:true});
listen(document,'scroll',layout,{capture:true,passive:true});listen(window,'resize',layout);listen(document,'fullscreenchange',layout);
listen(document,'visibilitychange',sync);listen(reduced,'change',sync);
listen(window,'pagehide',event=>{stop();draw();if(!event.persisted)destroy();});
listen(window,'pageshow',()=>{available=false;layout();});
function destroy(){
  if(disposed)return;stop();resize.disconnect();intersection.disconnect();mutation.disconnect();sceneObserver?.disconnect();removers.splice(0).forEach(fn=>fn());
  releaseGpu();layer.remove();backdrop.remove();
  if(config.backgroundFirst&&anchor?.isConnected&&originalAnchorNext?.parentNode===sceneParent)sceneParent.insertBefore(anchor,originalAnchorNext);
  if(config.cornerFooter){if(originalMaxHeight)viewport.style.setProperty('max-height',originalMaxHeight,originalMaxHeightPriority);else viewport.style.removeProperty('max-height');}
  addedClasses.forEach(([node,name])=>node.classList.remove(name));available=false;cornerAvailable=false;disposed=true;
}
listen(center,'webglcontextlost',event=>{
  if(disposed||!rendererReady)return;
  event.preventDefault();contextLossCount++;disableEffect('WebGL context lost',true);sync();
});
listen(center,'webglcontextrestored',()=>{
  if(disposed||fallbackReason!=='WebGL context lost')return;
  initializeEffect();layout();
});
initializeEffect();layout();
return Object.freeze({
  play,
  setAuto(value){auto=!!value;holding=false;stop();draw();if(auto)schedule();},
  setVisible(value){enabled=!!value;sync();},
  // Deterministic presentation-only diagnostics; never changes model state.
  setPhase(value){stop();holding=true;if(available)draw(value);},
  refresh:layout,destroy,
  getState:()=>({ready:true,standard:STANDARD,version:VERSION,model:config.model,generation,auto,enabled,available,cornerAvailable,rendererReady,fallbackReason,contextLossCount,gpuResources:{context:!!gl,program:!!program,buffer:!!buffer,texture:!!texture,shaders:shaderResources.length},reducedMotion:reduced.matches,phase,pulseCount,pulseStarts:[...pulseStarts],period:PERIOD,duration:DURATION,opacity:OPACITY,nextStart,framePending:!!frame,timerPending:!!timer,disposed,layerBox:{...layerBox},cornerBox:{...cornerBox},centerBox:{...centerBox},cornerAreaScale:.5,alphaMode:'premultiplied',backgroundMode:sceneSvg?'svg-background':'behind-foreground',centerAsset:centerAsset.src,cornerAsset:cornerAsset.src})
});
}
waitForScene();
