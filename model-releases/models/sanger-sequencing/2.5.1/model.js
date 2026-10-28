import {mountLabShell} from './lab-shell.js';
import {bindLabGesture} from './lab-gesture.js';
let labExperience=null;
import {G,SEQUENCE,PRIMER,TEMPLATE,STAGES,TIMELINE,FRAGMENTS,DYES,clamp,frameAt,ntX,bandY} from './engine.js';
import {createRenderer,text,attr} from './renderer.js';
const ANDER_MODEL_MANIFEST = {"schemaVersion":"2.0","id":"sanger-sequencing","version":"2.5.1","publish":true,"title":{"zh":"Sanger测序","en":"Sanger Sequencing"},"summary":{"zh":"荧光单管测序：核苷酸逐个接入、链终止与向上电泳读序。","en":"Single-tube fluorescent chain termination with nucleotide-by-nucleotide synthesis and upward electrophoresis."},"module":{"id":"biotechnology","zh":"选择性必修三 · 生物技术与工程","en":"Biotechnology & Engineering"},"technology":"svg-2d-animation","entry":"index.html","cover":"assets/cover.png","minimumViewport":{"width":320,"height":480},"capabilities":{"play":true,"reset":true,"stages":true,"speed":true,"labels":true,"highlight":true,"viewPresets":false,"fullscreen":true,"practice":false},"stages":[{"id":"prepare","title":{"zh":"测序体系","en":"Sequencing mixture"}},{"id":"extend","title":{"zh":"延伸与终止","en":"Extension & termination"}},{"id":"load","title":{"zh":"清理与上样","en":"Cleanup & loading"}},{"id":"separate","title":{"zh":"向上电泳","en":"Upward electrophoresis"}},{"id":"read","title":{"zh":"读取序列","en":"Read the sequence"}}],"packageKind":"standalone-model","content":"model-content.json","scripts":["shell-standard.js","engine.js","renderer.js","lab-gesture.js","lab-shell.js","model.js","brand-watermark.js"],"styles":["model.css","brand-watermark.css","lab-layout.css","shell-standard.css","window-standard.css"],"runtime":{"mode":"embedded","sharedRuntime":false,"externalDependencies":[]},"windowStandard":"adaptive-model-window-v1","shellStandard":"adaptive-model-shell-2.5.1"};
AnderModelShell.register(ANDER_MODEL_MANIFEST);
const $=id=>document.getElementById(id),svg=$('scene'),viewport=document.querySelector('.scene-viewport'),area=document.querySelector('.model-area'),renderer=createRenderer(svg);
let time=0,playing=false,speed=1,labels=true,highlight=true,manual=null,current,hostOrigin='*',lastStamp=null,lastUI=-1,lastPost=0,lastStage=-1,readoutGeometryKey='';
const camera={zoom:1,cx:G.width/2,cy:G.height/2,follow:false,initialized:false,drag:null};
const stageButtons=STAGES.map((stage,i)=>{const b=document.createElement('button');b.type='button';b.className='stage-tab';b.innerHTML=AnderModelShell.stageContent(i,stage.zh,stage.en);b.addEventListener('click',()=>{pause();seek(TIMELINE.stageStarts[i]);});document.querySelector('.stage-strip').appendChild(b);return b;});
const sequenceButtons=FRAGMENTS.map(f=>{const b=document.createElement('button');b.type='button';b.textContent='·';b.setAttribute('aria-label',`第 ${f.k} 位碱基，等待读序`);b.addEventListener('click',()=>selectFragment(f.k));$('sequence').appendChild(b);return b;});
const controls=Object.fromEntries([...document.querySelectorAll('[data-action]')].map(b=>[b.dataset.action,b]));
function statePayload(){const s=current.state;return{playing,speed,labels,highlight,view:'overview',stage:s.stage,stageId:STAGES[s.stage].id,phase:s.phase,phaseProgress:s.p,time,duration:TIMELINE.duration,progress:s.progress,done:s.done,activeFragment:s.activeK,completedFragments:s.completed,selectedFragment:current.selected,readCount:s.readCount,sequence:SEQUENCE.slice(0,s.readCount),camera:{zoom:camera.zoom,follow:camera.follow}};}
function post(type,payload,requestId){if(parent===window)return;const msg={source:'ander-model',protocolVersion:'1.0',modelId:ANDER_MODEL_MANIFEST.id,type,payload};if(requestId!==undefined)msg.requestId=requestId;parent.postMessage(msg,hostOrigin);}
function captions(s){const base=s.base||'';
  if(s.phase==='prepare')return['引物已结合','一种引物 · 四种 dNTP + 四种荧光 ddNTP','准备'];
  if(s.phase==='new-copy')return['同序列模板的新拷贝','每条代表片段都从同一引物位置起始',`片段 ${s.k} / 12`];
  if(s.phase==='incorporate')return[s.dd?'荧光核苷酸接入':`核苷酸逐个接入`,`${s.dd?'dd':'d'}${base}TP → 新生链 3′端${s.dd?' · 随后终止':' · 继续延伸'}`,`片段 ${s.k} / 12`];
  if(s.phase==='terminated'||s.phase==='collect')return['该链延伸终止',`末端 dd${SEQUENCE[s.k-1]} 缺少 3′-OH · 不能再接入核苷酸`,`${PRIMER.length+s.k} nt`];
  if(s.phase==='cleanup')return['清理测序产物','去除未掺入的荧光 ddNTP 等小分子，再进行变性分离','12 种长度'];
  if(s.phase==='load')return['单孔上样','终止片段进入下方同一点样孔 · 左侧保留合成记录','下方加样'];
  if(s.phase==='separate')return['电泳向上迁移','下负上正 · DNA 带负电 · 短片段迁移更远','逐渐分离'];
  return['从上往下读取','荧光颜色标记末端碱基 · 按短到长读取新生链 5′→3′ 序列',s.done?'完成':`${s.readCount} / 12 位`];
}
function syncUI(force=false){const now=performance.now()*.001;if(!force&&now-lastUI<.07)return;lastUI=now;const s=current.state,[heading,detail,progress]=captions(s);text($('phase-label'),heading);text($('phase-detail'),detail);text($('fragment-progress'),progress);$('timeline').value=Math.round(s.progress*10000);text($('percent'),`${Math.round(s.progress*100)}%`);
  stageButtons.forEach((b,i)=>{b.classList.toggle('is-active',i===s.stage);b.setAttribute('aria-current',i===s.stage?'step':'false');});
  AnderModelShell.setControl(controls.play,'play',playing?'暂停':s.done?'重播':'播放');AnderModelShell.setControl(controls.speed,'speed',`${speed}×`);AnderModelShell.setControl(controls.labels,'labels','标签',labels);AnderModelShell.setControl(controls.highlight,'highlight','聚焦',highlight);controls.prev.disabled=s.stage===0&&time===0;controls.next.disabled=s.done;
  sequenceButtons.forEach((b,i)=>{const revealed=s.readCount>i;const available=current.rows[i].stored;text(b,revealed?SEQUENCE[i]:'·');b.disabled=!available;b.style.color=revealed?DYES[SEQUENCE[i]]:'';b.setAttribute('aria-pressed',String(available&&current.selected===i+1));b.setAttribute('aria-label',`第 ${i+1} 位${revealed?' '+SEQUENCE[i]:'碱基，等待读序'} · ${FRAGMENTS[i].length} nt 片段`);});
  const f=FRAGMENTS[current.selected-1];text($('selected-detail'),s.separation===1?`${f.length} nt · 18 + ${f.k} nt · 末端 ${f.base}`:s.stage===1?`已完成 ${s.completed} / 12 种长度`:'等待荧光条带分离');
  text($('zoom-level'),`${camera.zoom.toFixed(1).replace('.0','')}×`);$('follow').setAttribute('aria-pressed',String(camera.follow));text($('camera-hint'),camera.zoom>1?'拖动画面调整观察位置':'可点击片段与条带查看对应');
  if(lastStage!==s.stage){lastStage=s.stage;labExperience?.sync();post('model:stage-changed',statePayload());}
  if(now-lastPost>.25){lastPost=now;post('model:progress',statePayload());}
}
function cameraMetrics(){const width=Math.max(1,svg.clientWidth),height=Math.max(1,svg.clientHeight),fit=Math.min(width/G.width,height/G.height),scale=fit*camera.zoom;return{width,height,scale,w:width/scale,h:height/scale};}
function setViewBox(){if(camera.follow&&current){const s=current.state;if(s.stage<=1){camera.cx=s.flight?s.flight.x:G.x0+100;camera.cy=s.flight?s.flight.y:(G.templateY+G.liveY)/2;}else if(s.phase==='load'){camera.cx=1100;camera.cy=500;}else{camera.cx=1360;camera.cy=s.stage===4?bandY(current.selected):520;}}
  const {w,h}=cameraMetrics();camera.cx=w>=G.width?G.width/2:clamp(camera.cx,w/2,G.width-w/2);camera.cy=h>=G.height?G.height/2:clamp(camera.cy,h/2,G.height-h/2);attr(svg,'viewBox',`${(camera.cx-w/2).toFixed(3)} ${(camera.cy-h/2).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}`);
  const key=svg.getAttribute('viewBox')+'/'+viewport.clientWidth+'/'+viewport.clientHeight;if(key!==readoutGeometryKey){readoutGeometryKey=key;const matrix=svg.getScreenCTM(),overlay=$('sequence').getBoundingClientRect(),scale=Math.hypot(matrix.a,matrix.b);sequenceButtons.forEach((b,i)=>{const p=new DOMPoint(G.sequenceX,bandY(i+1)).matrixTransform(matrix),x=p.x-overlay.left,y=p.y-overlay.top;b.style.left=`${x}px`;b.style.top=`${y}px`;b.style.width=`${34*scale}px`;b.style.height=`${28*scale}px`;b.style.fontSize=`${22*scale}px`;b.tabIndex=x>=0&&x<=overlay.width&&y>=0&&y<=overlay.height?0:-1;});}
}
function render(force=false){current=renderer.draw(time,{labels,highlight,manual});setViewBox();syncUI(force);}
function seek(t){time=clamp(Number(t)||0,0,TIMELINE.duration);manual=null;lastStamp=null;render(true);if(current.state.done){playing=false;syncUI(true);}post('model:state',statePayload());}
function play(){if(time>=TIMELINE.duration){time=0;manual=null;}playing=true;lastStamp=null;render(true);post('model:state',statePayload());}
function pause(){playing=false;lastStamp=null;render(true);post('model:state',statePayload());}
function reset(){playing=false;manual=null;time=0;lastStamp=null;render(true);post('model:state',statePayload());}
function selectFragment(k){if(!Number.isInteger(k)||k<1||k>12||!current.rows[k-1].stored)return;playing=false;manual=k;render(true);post('model:state',statePayload());}
function overview(){camera.zoom=1;camera.cx=G.width/2;camera.cy=G.height/2;camera.follow=false;render(true);}
function zoom(factor){camera.zoom=clamp(camera.zoom*factor,1,5);if(camera.zoom===1)camera.follow=false;render(true);}
controls.play.addEventListener('click',()=>playing?pause():play());controls.reset.addEventListener('click',reset);controls.prev.addEventListener('click',()=>{pause();seek(TIMELINE.stageStarts[Math.max(0,current.state.stage-1)]);});controls.next.addEventListener('click',()=>{pause();seek(current.state.stage<4?TIMELINE.stageStarts[current.state.stage+1]:TIMELINE.duration);});controls.speed.addEventListener('click',()=>{const values=[.5,1,1.5,2,4];speed=values[(values.indexOf(speed)+1)%values.length];render(true);});controls.labels.addEventListener('click',()=>{labels=!labels;render(true);});controls.highlight.addEventListener('click',()=>{highlight=!highlight;render(true);});
$('timeline').addEventListener('input',()=>{playing=false;seek(Number($('timeline').value)/10000*TIMELINE.duration);});$('zoom-in').addEventListener('click',()=>zoom(1.3));$('zoom-out').addEventListener('click',()=>zoom(1/1.3));$('overview').addEventListener('click',overview);$('follow').addEventListener('click',()=>{camera.follow=!camera.follow;if(camera.follow&&camera.zoom<2)camera.zoom=2.5;render(true);});
svg.addEventListener('click',e=>{if(camera.drag?.moved){camera.drag=null;return;}const node=e.target.closest('[data-pick-fragment]');if(node)selectFragment(Number(node.dataset.pickFragment));});
const touchSession=bindLabGesture({viewport,onStart(){camera.follow=false;syncUI(true);},onTap(target){
 const fragment=target.closest?.('[data-pick-fragment]');if(fragment){selectFragment(Number(fragment.dataset.pickFragment));return;}
 const button=target.closest?.('#sequence button'),index=sequenceButtons.indexOf(button);if(index>=0&&!button.disabled)selectFragment(index+1);
},transform({factor,from,to}){
 const rect=viewport.getBoundingClientRect(),matrix=svg.getScreenCTM();if(!matrix)return;
 const anchor=new DOMPoint(rect.left+from.x,rect.top+from.y).matrixTransform(matrix.inverse()),box=svg.viewBox.baseVal;
 const center=new DOMPoint(box.x+box.width/2,box.y+box.height/2).matrixTransform(matrix);
 camera.follow=false;camera.zoom=clamp(camera.zoom*factor,1,5);
 const metrics=cameraMetrics();camera.cx=anchor.x+(center.x-rect.left-to.x)/metrics.scale;camera.cy=anchor.y+(center.y-rect.top-to.y)/metrics.scale;
 setViewBox();syncUI(true);
}});
new ResizeObserver(()=>{readoutGeometryKey='';if(!camera.initialized){camera.initialized=true;if(innerWidth<=600){camera.zoom=2.8;camera.follow=true;}else if(innerWidth<=860&&innerHeight<=500){camera.zoom=1.6;camera.follow=true;}}setViewBox();syncUI(true);}).observe(viewport);
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON|SELECT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();playing?pause():play();}});
window.addEventListener('message',event=>{const m=event.data;if(parent===window||event.source!==parent||!m||m.source!=='ander-host'||m.protocolVersion!=='1.0'||m.modelId!==ANDER_MODEL_MANIFEST.id)return;if(hostOrigin!=='*'&&event.origin!==hostOrigin)return;if(event.origin!=='null')hostOrigin=event.origin;const p=m.payload||{};try{switch(m.type){
  case 'host:init':post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()},m.requestId);break;
  case 'host:play':play();break;case 'host:pause':pause();break;case 'host:reset':reset();break;
  case 'host:set-stage':{const v=p.stageId??p.stage??p.stageIndex,i=typeof v==='string'?STAGES.findIndex(s=>s.id===v):v;if(!Number.isInteger(i)||i<0||i>=STAGES.length)throw new Error('无效阶段');playing=false;seek(TIMELINE.stageStarts[i]);break;}
  case 'host:set-speed':if(!Number.isFinite(p.speed)||p.speed<.25||p.speed>8)throw new Error('无效速度');speed=p.speed;break;
  case 'host:set-labels':{const v=p.visible??p.enabled;if(typeof v!=='boolean')throw new Error('标签状态须为布尔值');labels=v;break;}
  case 'host:set-highlight':if(typeof p.enabled!=='boolean')throw new Error('聚焦状态须为布尔值');highlight=p.enabled;break;
  case 'host:set-view':if((p.viewId??p.view)!=='overview')throw new Error('仅支持 overview');overview();break;
  default:throw new Error('不支持的宿主指令');}render(true);post('model:state',statePayload(),m.requestId);
}catch(error){post('model:error',{message:error.message},m.requestId);}});
window.SangerModel=Object.freeze({getState:statePayload,seek,play,pause,getTimeline:()=>TIMELINE.segments.map(s=>({...s})),getFrame:()=>frameAt(time,manual),selectFragment,overview,getScience:()=>({sequence:SEQUENCE,template:TEMPLATE,primer:PRIMER,fragments:FRAGMENTS.map(f=>({...f})),geometry:{...G}})});
function tick(stamp){const seconds=stamp*.001;if(playing){const dt=lastStamp===null?0:Math.min(.12,Math.max(0,seconds-lastStamp));time=Math.min(TIMELINE.duration,time+dt*speed);if(time>=TIMELINE.duration)playing=false;render(!playing);}lastStamp=seconds;requestAnimationFrame(tick);}
render(true);post('model:ready',{manifest:ANDER_MODEL_MANIFEST,ready:true,...statePayload()});requestAnimationFrame(tick);

labExperience=mountLabShell({manifest:ANDER_MODEL_MANIFEST,getState:statePayload,post,onResize(){readoutGeometryKey='';setViewBox();}});
