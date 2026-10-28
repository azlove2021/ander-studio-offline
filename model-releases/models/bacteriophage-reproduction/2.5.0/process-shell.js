import {bindLabGesture} from './lab-gesture.js';

// Presentation adapter. Scientific clocks, stages and drawing objects stay in model.js.
export function mountProcessShell({manifest,getState,post,pause,setView,seek,setScrubbing}){
 const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],common=AnderModelShell;
 const phage=manifest.id==='bacteriophage-reproduction',resp=manifest.id==='cellular-respiration';
 const root=q('.model-area'),stage=q('.model-stage'),surface=q(phage?'.animation-viewport':'.art-scroll');
 const svg=q(phage?'#phageScene':resp?'#respiration-scene':'#photosynthesis-scene');
 let plane=q('.science-world');if(phage){plane=document.createElement('div');plane.className='science-world';svg.before(plane);plane.append(svg);}
 // Background-only duplicate preserves the original SVG fill/pattern behind a
 // viewport-anchored HTML watermark. The scientific SVG and objects are intact.
 let background=null;
 if(phage){
  background=document.createElement('div');background.className='process-scene-backdrop';background.setAttribute('aria-hidden','true');
  const bgSvg=svg.cloneNode(false);bgSvg.removeAttribute('id');bgSvg.removeAttribute('role');bgSvg.removeAttribute('aria-labelledby');
  const defs=svg.querySelector('defs').cloneNode(true);defs.querySelectorAll('[id]').forEach(n=>n.id='process-background-'+n.id);bgSvg.append(defs);
  for(const [name,id]of [['scene-background','sceneBg'],['scene-pattern','microDots']]){const node=svg.querySelector('.'+name).cloneNode(true);node.style.fill='url(#process-background-'+id+')';bgSvg.append(node);}
  background.append(bgSvg);surface.prepend(background);
 }
 document.body.dataset.modelId=manifest.id;document.body.dataset.modelVersion=manifest.version;
 root.dataset.processModel=phage?'phage':resp?'respiration':'photosynthesis';
 const button=(label,fn,key)=>{const b=document.createElement('button');b.type='button';b.className='shell-action';b.textContent=label;b.dataset.process=key;b.addEventListener('click',()=>fn(b));return b;};
 const toolbar=document.createElement('div');toolbar.className='process-toolbar';stage.prepend(toolbar);
 const title=document.createElement('strong');title.className='process-stage-title';toolbar.append(title);
 const views=document.createElement('div');views.className='process-views';toolbar.append(views);
 const names=phage?[]:resp?[['overview','全貌'],['cytosol','细胞质'],['mitochondrion','线粒体']]:[['overview','全貌'],['light','光反应'],['calvin','暗反应']];
 let shell,frame=0,lastStage='',lastView='',lastDisplay='normal',ready=false,disposed=false;
 const camera=createCamera(surface,plane,()=>window.ModelBrandWatermark?.refresh(),background);
 if(phage)views.append(button('全貌',()=>camera.fit(),'overview'));
 else names.forEach(([value,label])=>views.append(button(label,()=>{setView(value);camera.fit();},value)));
 const detail=document.createElement('section');detail.className='process-context';stage.append(detail);
 const contextTitle=phage?'阶段与说明':'过程与说明';
 if(phage){detail.append(q('.stage-copy'));const note=document.createElement('p');note.textContent='本模型展示噬菌体裂解周期的简化过程，图中比例与数量为示意，不代表真实尺寸或完整产量。拖动底部进度可前进或回退；松手后停在所选位置，点击播放继续。';detail.append(note);}
 else detail.append(q('.notation-note'));
 const modePanel=q('.mode-panel'),modeHome=document.createComment('respiration-mode-home');
 if(modePanel)modePanel.before(modeHome);
 const restoreMode=()=>{if(q('.shell-dialog').open&&q('.shell-dialog').contains(detail))return;if(modePanel&&modePanel.parentNode===detail)modeHome.after(modePanel);};
 const openContext=trigger=>{if(modePanel)detail.prepend(modePanel);shell.showPanel(detail,contextTitle,trigger);};
 toolbar.append(button('说明 ↗',openContext,'context'));
 if(phage){
  const wrap=q('.timeline-wrap'),input=q('#time-slider'),pointers=new Set();
  input.max=String(getState().durationMs);q('.control-group-primary').after(wrap);
  input.addEventListener('pointerdown',event=>{pointers.add(event.pointerId);setScrubbing(true);});
  const release=event=>{if(pointers.delete(event.pointerId)&&!pointers.size)setScrubbing(false);};
  for(const type of ['pointerup','pointercancel','lostpointercapture'])addEventListener(type,release);
  const cancel=()=>{pointers.clear();setScrubbing(false);};
  addEventListener('blur',cancel);addEventListener('pagehide',cancel);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  input.addEventListener('input',()=>seek(input.valueAsNumber));
  // Some assistive/native controls commit with change rather than input.
  input.addEventListener('change',()=>{if(Math.abs(input.valueAsNumber-getState().timeMs)>.5)seek(input.valueAsNumber);});
 }
 const personal=document.createElement('div');personal.className='control-group control-group-personal';
 for(const key of ['Tools','Help','Favorite']){const b=document.createElement('button');b.type='button';b.className='control-button';b.dataset['shell'+key]='';personal.append(b);}
 personal.append(q('[data-action=fullscreen]'));q('.control-dock').append(personal);
 q('.control-group-end')?.remove();
 const viewGroup=q('.control-group-view');
 const minus=button('缩小',()=>camera.zoom(.8),'zoom-out'),plus=button('放大',()=>camera.zoom(1.25),'zoom-in');
 for(const[b,text]of [[minus,'－ 缩小'],[plus,'＋ 放大']]){b.className='control-button';const label=document.createElement('span');label.className='shell-control-label';label.textContent=text;b.replaceChildren(label);viewGroup.append(b);}
 const helpContent='<p>单指拖动画面，双指缩放和平移；“全貌”恢复完整画面。双指操作后需全部松手，再开始新的单指拖动。鼠标滚轮也可缩放。</p>'+(phage?'<p>底部过程进度可拖动或点击定位，支持前进和回退。拖动时暂停，松手后保持当前位置，点击播放继续。键盘方向键微调，Home/End 跳至首尾。百分比按五个阶段的原有演示时长计算。</p>':'<p>底部进度条可直接拖动并暂停。上方按钮切换全貌和局部画面；切换视角不会改变反应进度。观察中可调倍速和标签。</p>')+'<p>全屏轻触唤出上下操作栏，最后松手约两秒后收起；按住进度条时不会隐藏。收藏由可选宿主提供。</p>';
 const settings=trigger=>shell.showDialog('显示与操作',helpContent,trigger,[{label:'恢复全貌',run:()=>{if(setView)setView('overview');camera.fit();shell.closeDialog();}}]);
 const back=()=>{pause();if(parent!==window)post('model:state',{...getState(),navigation:'home'});else shell.showDialog('独立模型预览','<p>关闭此标签页可返回之前的目录。</p>',document.activeElement);};
 shell=common.mountExperience({root,viewport:surface,title:manifest.title.zh,returnLabel:'返回目录',host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,onReturn:back,helpContent,settingsLabel:'显示与操作',onSettings:settings,contextLabel:contextTitle,onContext:openContext,hasContext:()=>true,onDisplayChange(){queue();if(root.dataset.display!==lastDisplay){lastDisplay=root.dataset.display;post('model:request-fullscreen',{active:lastDisplay!=='normal'});}}});
 q('.shell-dialog').addEventListener('close',restoreMode);
 const gear=document.createElement('button');gear.type='button';gear.className='shell-icon-button';common.setExtra(gear,'settings','显示与操作');gear.addEventListener('click',()=>settings(gear));q('.independent-model-header').append(gear);
 q('.independent-model-back').addEventListener('click',event=>{event.preventDefault();back();});
 function sync(){
  const s=getState(),index=s.stageIndex,key=index+'/'+(s.mode||'');
  if(key!==lastStage){lastStage=key;shell.syncStage();}
  const current=q('.stage-tab.is-active strong')?.textContent||manifest.stages[index]?.title.zh||manifest.title.zh;if(title.textContent!==current)title.textContent=current;
  if(!phage&&s.view!==lastView){lastView=s.view;all('.process-views button').forEach(b=>{const active=b.dataset.process===s.view;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});camera.fit();}
  if(phage){const percent=Math.round(s.totalProgress*100),output=q('#process-progress'),input=q('#time-slider');if(output.textContent!==percent+'%')output.textContent=percent+'%';const value=String(Math.round(s.timeMs));if(input.value!==value)input.value=value;input.setAttribute('aria-valuetext',percent+'%，'+current);}
 }
 function queue(){if(frame||disposed)return;frame=requestAnimationFrame(()=>{frame=0;camera.resize();window.ModelBrandWatermark?.refresh();});}
 async function loadScene(retry=false){
  shell.setSceneStatus('loading');
  try{
   await Promise.all([...svg.querySelectorAll('image')].map(async node=>{const img=new Image(),url=new URL(node.getAttribute('href'),location.href);if(retry)url.searchParams.set('scene-retry',Date.now());img.src=url.href;await img.decode();if(retry)node.setAttribute('href',url.href);}));
   ready=true;root.dataset.ready='true';shell.setSceneStatus('ready');queue();
  }catch{ready=false;root.dataset.ready='false';shell.setSceneStatus('error','场景图片未能加载，请重试。当前反应进度会保留。',()=>loadScene(true));}
 }
 const resize=new ResizeObserver(queue);resize.observe(surface);addEventListener('resize',queue);
 addEventListener('pagehide',()=>{disposed=true;resize.disconnect();cancelAnimationFrame(frame);frame=0;camera.cancel();});
 addEventListener('pageshow',event=>{if(event.persisted){disposed=false;resize.observe(surface);queue();}});
 const api={sync,resize:queue,getState:()=>({ready,version:manifest.version,science:getState(),shell:shell.getState(),camera:camera.getState()})};
 window.ProcessSample=Object.freeze(api);sync();loadScene();return api;
}

function createCamera(viewport,plane,onChange,background){
 let scale=1,x=0,y=0,w=0,h=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function draw(){x=clamp(x,w-w*scale,0);y=clamp(y,h-h*scale,0);for(const node of [plane,background])if(node)node.style.transform=`translate(${x}px,${y}px) scale(${scale})`;onChange?.();}
 function resize(){const nw=viewport.clientWidth,nh=viewport.clientHeight;if(!nw||!nh)return;x=w?x*nw/w:0;y=h?y*nh/h:0;w=nw;h=nh;draw();}
 function fit(){scale=1;x=0;y=0;draw();}
 function transform({factor,from,to}){const next=clamp(scale*factor,1,8),ratio=next/scale;x=to.x-(from.x-x)*ratio;y=to.y-(from.y-y)*ratio;scale=next;draw();}
 function zoom(factor){const p={x:w/2,y:h/2};transform({factor,from:p,to:p});}
 const gesture=bindLabGesture({viewport,transform});
 viewport.tabIndex=0;viewport.setAttribute('aria-label','模型画面，单指拖动、双指或滚轮缩放；全貌可显示完整画面');
 viewport.addEventListener('keydown',event=>{if(event.target!==viewport)return;if(event.key==='+'||event.key==='=')zoom(1.25);else if(event.key==='-')zoom(.8);else if(event.key==='Home'||event.key==='0')fit();else return;event.preventDefault();});
 resize();return{fit,zoom,resize,cancel:gesture.cancel,getState:()=>({scale,x,y,width:w,height:h,...gesture.getState()})};
}
