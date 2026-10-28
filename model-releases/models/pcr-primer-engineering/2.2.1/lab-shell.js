import {createLabScreenView} from './lab-gesture.js';
// This adapter moves original controls and result nodes; scientific controllers remain authoritative.
export function mountLabShell({manifest,getState,post,onOverview,onFollow,onManual,onResize}){
 const q=s=>document.querySelector(s),root=q('.model-area'),viewport=q('.scene-viewport'),svg=q('#scene'),common=AnderModelShell,id=manifest.id;
 document.body.dataset.modelId=id;
 let shell,view=null,contextNode,contextTitle='说明',lastStage=-1,lastDisplay='normal',resizeQueued=false;
 const button=(label,fn)=>{const b=document.createElement('button');b.type='button';b.className='shell-action';b.textContent=label;b.addEventListener('click',e=>fn(e.currentTarget));return b;};
 const toolbar=document.createElement('div');toolbar.className='lab-toolbar';
 if(id==='pcr'){
  const panel=q('.products-area'),summary=document.createElement('div'),info=document.createElement('div');summary.className='lab-count-summary';info.className='lab-context-content';
  for(const sel of ['.count-label','#count-value','#visible-count'])summary.append(q(sel));
  for(const n of [...panel.childNodes])info.append(n);panel.append(summary,info);contextNode=info;contextTitle='轮次与记录';
  toolbar.append(button('全景',()=>{view.fit();onOverview();}),button('跟随',()=>{view.fit();onFollow();}));
  q('.reaction-heading').append(toolbar);
 }else if(id==='pcr-primer-engineering'){
  contextNode=document.createElement('div');contextNode.className='lab-context-content';
  const library=q('.primer-library'),notes=document.createElement('div');notes.className='lab-notes';
  for(const sel of ['#site-description','#phase-description','.science-boundary','.observation-note'])notes.append(q(sel));
  contextNode.append(notes);q('.site-detail').append(contextNode);contextTitle='引物与说明';
  for(const b of library.querySelectorAll('button')){b.classList.add('shell-action');b.setAttribute('aria-label',b.querySelector('strong').textContent);}
  toolbar.append(library,button('全景',()=>view.fit()));q('.engineering-layout').prepend(toolbar);
  q('.product-summary').classList.add('lab-primer-summary');q('.engineering-layout').append(q('.product-summary'));
  q('#jump-detail').addEventListener('click',()=>{root.dataset.labView='detail';queueResize();});q('#back-reaction').addEventListener('click',()=>{root.dataset.labView='linked';queueResize();});
  const toggle=button('位点大图',()=>{root.dataset.labView=root.dataset.labView==='detail'?'linked':'detail';toggle.textContent=root.dataset.labView==='detail'?'联动观察':'位点大图';queueResize();});toolbar.append(toggle);
  root.dataset.labView='linked';
 }else{
  contextTitle='观察与操作';contextNode=document.createElement('div');contextNode.className='lab-context-content';
  contextNode.innerHTML='<p>片段、条带和右侧碱基按同一行对应。点击已形成的片段或条带可暂停并查看对应位置。</p><p>默认跟随当前作用处。双指缩放或拖动后停止自动跟随；点“总览”查看完整画面，点“跟随”恢复。</p>';
  q('.sequencing-workbench').append(contextNode);q('.reaction-heading').append(toolbar);
  const frame=document.createElement('div');frame.className='lab-scene-frame';viewport.before(frame);frame.append(viewport,q('.view-tools'));
 }
 // A fixed HTML watermark behind the scientific SVG avoids WebKit foreignObject compositing differences.
 let back=null;
 if(id!=='pcr-primer-engineering'){
  const original=id==='pcr'?q('#reaction-chamber'):svg.querySelector(':scope > rect[x="279"]');
  if(original){back=document.createElementNS('http://www.w3.org/2000/svg','svg');back.classList.add('lab-svg-backdrop');back.setAttribute('aria-hidden','true');back.setAttribute('preserveAspectRatio',svg.getAttribute('preserveAspectRatio')||'xMidYMid meet');const rect=original.cloneNode(true);rect.removeAttribute('id');back.append(rect);original.setAttribute('fill','none');original.setAttribute('stroke','none');viewport.prepend(back);}
 }
 if(id!=='sanger-sequencing'){
  const plane=document.createElement('div');plane.className='lab-plane';viewport.append(plane);plane.append(svg);view=createLabScreenView(viewport,plane,onManual,back);
 }
 const syncBackground=()=>{if(!back)return;for(const name of ['viewBox','preserveAspectRatio']){const value=svg.getAttribute(name)||'xMidYMid meet';if(back.getAttribute(name)!==value)back.setAttribute(name,value);}};syncBackground();if(back)new MutationObserver(syncBackground).observe(svg,{attributes:true,attributeFilter:['viewBox','preserveAspectRatio']});
 const openContext=trigger=>shell.showPanel(contextNode,contextTitle,trigger);toolbar.append(button(contextTitle+' ↗',openContext));
 const personal=document.createElement('div');personal.className='control-group control-group-personal';
 for(const key of ['Tools','Help','Favorite']){const b=document.createElement('button');b.type='button';b.className='control-button';b.dataset['shell'+key]='';personal.append(b);}
 personal.append(q('[data-action=fullscreen]'));q('.control-dock').append(personal);q('.timeline-control').classList.add('timeline-wrap');
 const help='<p>阶段、播放和底部总进度控制同一个过程。双指内滑可缩小，外滑可放大，拖动查看细节；“全景”或“总览”恢复完整画面。</p><p>全屏时轻触唤出操作栏，最后松手约两秒后收起；按住进度条时保持显示。收藏由可选网站宿主提供。</p>';
 const settings=trigger=>shell.showPanel(toolbar,'显示与操作',trigger);
 const backAction=()=>{if(parent!==window)post('model:state',{...getState(),navigation:'home'});else shell.showDialog('独立模型预览','<p>关闭此标签页可返回之前的目录。</p>',document.activeElement);};
 shell=common.mountExperience({root,viewport,title:manifest.title.zh,returnLabel:'返回目录',onReturn:backAction,host:globalThis.AnderModelHost?.modelId===id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:contextTitle,onSettings:settings,onContext:openContext,hasContext:()=>true,helpContent:help,onDisplayChange(){queueResize();if(lastDisplay!==root.dataset.display){lastDisplay=root.dataset.display;post('model:request-fullscreen',{active:lastDisplay!=='normal'});}}});
 q('.independent-model-back').addEventListener('click',e=>{e.preventDefault();backAction();});
 const settingsButton=document.createElement('button');settingsButton.className='shell-icon-button';settingsButton.type='button';common.setExtra(settingsButton,'settings','显示与操作');settingsButton.addEventListener('click',e=>settings(e.currentTarget));q('.independent-model-header').append(settingsButton);
 function queueResize(){if(resizeQueued)return;resizeQueued=true;requestAnimationFrame(()=>{resizeQueued=false;view?.resize();onResize?.();syncBackground();for(const [selector,name] of [['.shell-identity','--lab-identity-height'],['.control-dock','--lab-dock-height']]){const h=Math.ceil(q(selector)?.getBoundingClientRect().height||0);const value=h+'px';if(root.style.getPropertyValue(name)!==value)root.style.setProperty(name,value);}});}
 function sync(){const s=getState();if(s.stage!==lastStage){lastStage=s.stage;shell.syncStage();}syncBackground();}
 new ResizeObserver(queueResize).observe(viewport);addEventListener('resize',queueResize);
 const ready=()=>{shell.setSceneStatus('ready');root.dataset.ready='true';queueResize();};if(document.readyState==='complete')ready();else addEventListener('load',ready,{once:true});
 const api={sync,resize:queueResize,view,getState:()=>({version:manifest.version,science:getState(),shell:shell.getState(),navigation:view?.getState(),layout:root.dataset.labView})};globalThis.LabSample=api;sync();return api;
}
