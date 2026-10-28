import {bindLabGesture} from './lab-gesture.js';

// Only presentation is adapted here. The accepted experiment and SVG renderer
// still own every liquid level, molecule, crossing event and scientific readout.
export function mountOsmosisShell({manifest,getState,post,pause,setView}){
 const q=s=>document.querySelector(s),common=AnderModelShell,root=q('.model-area');
 const surface=q('.art-scroll'),plane=q('.science-world'),toolbar=q('.condition-bar');
 const options=q('.liquid-options'),home=document.createComment('liquid-options-home');options.before(home);
 const context=document.createElement('section');context.className='osmosis-context';
 const explanation=document.createElement('p');explanation.textContent='人工半透膜只允许水通过，蔗糖留在原侧。膜局部图上侧对应漏斗内，下侧对应漏斗外。液体着色、粒子数量和演示时间均为教学示意。改变液体条件会暂停并回到初始液面；切换视图保留实验进度。';context.append(explanation);q('.model-stage').append(context);
 const button=(label,key,run)=>{const b=document.createElement('button');b.type='button';b.className='shell-action';b.dataset.osmosis=key;b.textContent=label;b.addEventListener('click',()=>run(b));return b;};
 let shell,frame=0,disposed=false,lastStage=-1,lastView='',lastDisplay='normal';
 const camera=createCamera(surface,plane);
 const viewButtons=document.createElement('div');viewButtons.className='osmosis-views';
 for(const [id,label]of [['overview','总览'],['apparatus','装置'],['membrane','膜局部']])viewButtons.append(button(label,id,()=>{setView(id);camera.fit();}));
 toolbar.prepend(viewButtons);
 const openContext=trigger=>{context.prepend(options);shell.showPanel(context,'液体与说明',trigger);};
 toolbar.append(button('液体与说明 ↗','context',openContext));
 const personal=document.createElement('div');personal.className='control-group control-group-personal';
 for(const key of ['Tools','Help','Favorite']){const b=document.createElement('button');b.type='button';b.className='control-button';b.dataset['shell'+key]='';personal.append(b);}
 personal.append(q('[data-action=fullscreen]'));q('.control-dock').append(personal);
 const viewGroup=q('.control-group-view');
 for(const [label,id,run]of [['－ 缩小','zoom-out',()=>camera.zoom(.8)],['＋ 放大','zoom-in',()=>camera.zoom(1.25)],['适合画面','fit',()=>camera.fit()]]){
  const b=button(label,id,run);b.className='control-button';const span=document.createElement('span');span.className='shell-control-label';span.textContent=label;b.replaceChildren(span);viewGroup.append(b);
 }
 const helpContent='<p>选择漏斗内、外液体后播放，观察液面和水分子的双向运动。更改液体会从初始条件重新开始。</p><p>底部进度条可拖动或点击，支持前进、回退和键盘方向键。拖动时暂停，松手后保持当前位置，点击播放继续。</p><p>“总览”同时显示装置与膜局部；“装置”和“膜局部”可分别放大观察，切换不改变实验进度。单指拖动、双指或滚轮缩放；双指操作后全部松手，再开始新的单指拖动。“适合画面”或画面聚焦后按 Home 恢复完整视图。</p><p>沉浸模式轻触唤出操作栏，最后松手约两秒后收起；按住进度条不会隐藏。收藏由可选宿主提供。</p>';
 const settings=trigger=>shell.showDialog('显示与操作',helpContent,trigger,[{label:'恢复总览',run:()=>{setView('overview');camera.fit();shell.closeDialog();}}]);
 const back=()=>{pause();if(parent!==window)post('model:state',{...getState(),navigation:'home'});else shell.showDialog('独立模型预览','<p>关闭此标签页可返回之前的目录。</p>',document.activeElement);};
 shell=common.mountExperience({root,viewport:surface,title:manifest.title.zh,returnLabel:'返回目录',host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,onReturn:back,helpContent,onSettings:settings,settingsLabel:'显示与操作',contextLabel:'液体与说明',onContext:openContext,hasContext:()=>true,onDisplayChange(){queue();if(root.dataset.display!==lastDisplay){lastDisplay=root.dataset.display;post('model:request-fullscreen',{active:lastDisplay!=='normal'});}}});
 q('.shell-dialog').addEventListener('close',()=>{if(q('.shell-dialog').open&&q('.shell-dialog').contains(context))return;if(options.parentNode===context)home.after(options);});
 const gear=document.createElement('button');gear.type='button';gear.className='shell-icon-button';common.setExtra(gear,'settings','显示与操作');gear.addEventListener('click',()=>settings(gear));q('.independent-model-header').append(gear);
 q('.independent-model-back').addEventListener('click',event=>{event.preventDefault();back();});
 function sync(){const s=getState();if(s.stageIndex!==lastStage){lastStage=s.stageIndex;shell.syncStage();}if(s.view!==lastView){lastView=s.view;for(const b of viewButtons.children){const selected=b.dataset.osmosis===s.view;b.classList.toggle('is-primary',selected);b.setAttribute('aria-pressed',String(selected));}camera.fit();}}
 function queue(){if(disposed||frame)return;frame=requestAnimationFrame(()=>{frame=0;camera.resize();window.ModelBrandWatermark?.refresh();});}
 const resize=new ResizeObserver(queue);resize.observe(surface);addEventListener('resize',queue);
 addEventListener('pagehide',()=>{disposed=true;resize.disconnect();cancelAnimationFrame(frame);frame=0;camera.cancel();});
 addEventListener('pageshow',event=>{if(event.persisted){disposed=false;resize.observe(surface);queue();}});
 shell.setSceneStatus('ready');root.dataset.ready='true';
 const api={sync,resize:queue,getState:()=>({ready:true,version:manifest.version,science:getState(),shell:shell.getState(),camera:camera.getState()})};
 window.OsmosisSample=Object.freeze(api);sync();queue();return api;
}

function createCamera(viewport,plane){
 let scale=1,x=0,y=0,w=0,h=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function draw(){x=clamp(x,w-w*scale,0);y=clamp(y,h-h*scale,0);plane.style.transform=`translate(${x}px,${y}px) scale(${scale})`;}
 function resize(){const nw=viewport.clientWidth,nh=viewport.clientHeight;if(!nw||!nh)return;x=w?x*nw/w:0;y=h?y*nh/h:0;w=nw;h=nh;draw();}
 function fit(){scale=1;x=0;y=0;draw();}
 function transform({factor,from,to}){const next=clamp(scale*factor,1,8),ratio=next/scale;x=to.x-(from.x-x)*ratio;y=to.y-(from.y-y)*ratio;scale=next;draw();}
 function zoom(factor){const p={x:w/2,y:h/2};transform({factor,from:p,to:p});}
 const gesture=bindLabGesture({viewport,transform});viewport.tabIndex=0;viewport.setAttribute('aria-label','渗透作用画面，单指拖动、双指或滚轮缩放；Home 恢复完整视图');
 viewport.addEventListener('keydown',event=>{if(event.target!==viewport)return;if(event.key==='+'||event.key==='=')zoom(1.25);else if(event.key==='-')zoom(.8);else if(event.key==='Home'||event.key==='0')fit();else return;event.preventDefault();});
 resize();return{fit,zoom,resize,cancel:gesture.cancel,getState:()=>({scale,x,y,width:w,height:h,...gesture.getState()})};
}
