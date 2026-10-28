/* Local presentation adapter: original scientific objects, controls and clock are retained. */
(() => {
 'use strict';
 globalThis.NeuralModelLayout={mount({manifest,root,width,height,getState,onResize}){
  const find=s=>root.querySelector(s),area=find('.model-area'),stage=find('.model-stage'),panel=find('.record-panel'),scene=find('.scene-panel'),viewport=find('.drawing-scroll'),common=AnderModelShell;
  let shell,layoutResizePending=false,manualLayout=false;
  area.dataset.neuralView='linked';
  const detail=document.createElement('section');detail.className='neural-details';detail.setAttribute('aria-label','过程与说明');
  const card=find('.voltage-card'),conditions=find('.condition-grid')||find('.stimulus-controls');
  for(const node of [...panel.children])if(node!==card&&node!==conditions)detail.append(node);
  for(const selector of ['.scene-note','.threshold-note']){const node=find(selector);if(node)detail.append(node);}
  detail.querySelector('.conditions-title')?.remove();detail.querySelector('.mobile-note')?.remove();
  panel.append(detail);
  const toolbar=document.createElement('div');toolbar.className='neural-toolbar';toolbar.setAttribute('aria-label','记录与取景');
  toolbar.append(conditions);
  const shortNames={near:'近距',wide:'远距',swap:'对调',remote:'远移'};
  for(const button of conditions.querySelectorAll('button')){
   button.classList.add('shell-action');
   if(button.dataset.stimulus){button.setAttribute('aria-label',button.textContent);button.textContent=button.dataset.stimulus==='weak'?'阈下':'阈上';}
   if(button.dataset.action==='stimulate'){button.setAttribute('aria-label','施加刺激');button.textContent='刺激';}
   if(button.dataset.condition){const original=button.textContent;button.setAttribute('aria-label',original);button.title=original;button.textContent=shortNames[button.dataset.condition]||original;}
  }
  const mode=document.createElement('select');mode.className='neural-view-choice';mode.setAttribute('aria-label','观察布局');
  for(const[value,label]of [['linked','联动'],['scene','模型大图'],['plot','曲线大图']]){const option=document.createElement('option');option.value=value;option.textContent=label;mode.append(option);}
  toolbar.append(mode);
  mode.addEventListener('change',()=>{manualLayout=true;area.dataset.neuralView=mode.value;queueResize();});
  const fit=document.createElement('button');fit.type='button';fit.className='shell-action';fit.textContent='全景';fit.setAttribute('aria-label','恢复模型全景');toolbar.append(fit);
  const info=document.createElement('button');info.type='button';info.className='shell-action neural-context';info.textContent='说明 ↗';toolbar.append(info);
  stage.prepend(toolbar);
  // The legend and corner mark share the scene edge; the logo has no layout row.
  const sceneView=document.createElement('div');sceneView.className='neural-scene-view';viewport.before(sceneView);sceneView.append(viewport,find('.scene-legend'));
  const originalBoard=find('.scene-board'),plane=originalBoard||document.createElement('div');
  plane.classList.add('neural-plane');plane.style.width=width+'px';plane.style.height=height+'px';
  if(!originalBoard){plane.append(find('.scene-svg'));viewport.append(plane);}
  viewport.tabIndex=0;viewport.setAttribute('aria-label','科学画面：双指或滚轮缩放，拖动平移，按0恢复全景');
  // Environment-only shapes stay below the fixed viewport watermark. All scientific art stays above it.
  const svg=plane.querySelector('svg'),back=document.createElement('div');back.className='neural-background-plane';back.style.width=width+'px';back.style.height=height+'px';back.setAttribute('aria-hidden','true');
  const backSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');backSvg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const defs=svg.querySelector('defs')?.cloneNode(true);if(defs){defs.innerHTML=defs.innerHTML.replace(/id="([^"]+)"/g,'id="environment-$1"').replace(/url\(#([^)]+)\)/g,'url(#environment-$1)');backSvg.append(defs);}
  if(manifest.id==='resting-action-potential'){
   const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.setAttribute('transform',plane.querySelector('.membrane-cutaway').getAttribute('transform'));
   for(const rect of plane.querySelectorAll('.membrane-cutaway > rect')){rect.setAttribute('fill',rect.getAttribute('fill').replace('url(#','url(#environment-'));group.append(rect);}backSvg.append(group);
  }else if(manifest.id==='action-potential-conduction'){
   for(const rect of plane.querySelectorAll('.scene-underlay > rect'))backSvg.append(rect);
  }
  back.append(backSvg);viewport.prepend(back);
  const navigation=ModelSceneNavigation({viewport,planes:[plane,back],width,height,initial:'fit'});
  fit.addEventListener('click',()=>{if(mode.value==='plot'){mode.value='linked';area.dataset.neuralView='linked';queueResize();}navigation.fit();});
  const view=find('.control-group-view');
  for(const [kind,label]of [['in','放大'],['out','缩小'],['fit','全景']]){const button=document.createElement('button');button.type='button';button.className='control-button';common.setControl(button,'camera',label);button.dataset.neuralCamera=kind;button.addEventListener('click',()=>kind==='fit'?navigation.fit():navigation.zoomBy(kind==='in'?1.25:.8));view.append(button);}
  const favorite=document.createElement('button');favorite.type='button';favorite.className='control-button';favorite.dataset.shellFavorite='';
  const personal=document.createElement('div');personal.className='control-group control-group-personal';
  const tools=document.createElement('button');tools.type='button';tools.className='control-button';tools.dataset.shellTools='';
  const helpButton=document.createElement('button');helpButton.type='button';helpButton.className='control-button';helpButton.dataset.shellHelp='';
  personal.append(tools,helpButton,favorite,find('[data-action=fullscreen]'));find('.control-dock').append(personal);
  const openInfo=trigger=>shell.showPanel(detail,'过程与说明',trigger);info.addEventListener('click',e=>openInfo(e.currentTarget));
  const help='<p>播放或拖动底部进度，观察模型和电位曲线同步变化。阈下／阈上刺激或记录条件沿用原模型。</p><p>“联动”同时显示两图；“模型大图”与“曲线大图”可单独放大观察。模型支持双指或滚轮缩放、拖动平移，“全景”恢复全貌。</p><p>全屏后，最后一根手指松开约2秒收起上下操作栏；触碰唤出，按住滑杆和操作面板时保持显示。收藏由打开模型的网站提供。</p>';
  const settings=trigger=>shell.showPanel(toolbar,'记录与取景',trigger);
  const onReturn=()=>find('[data-action=back]').click();
  shell=common.mountExperience({root:area,viewport,title:manifest.title.zh,returnLabel:'返回目录',onReturn,host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,contextLabel:'过程与说明',hasContext:()=>true,onContext:openInfo,helpContent:help,onSettings:settings,settingsLabel:'显示与操作',onDisplayChange:queueResize});
  const settingsButton=document.createElement('button');settingsButton.type='button';settingsButton.className='shell-icon-button';common.setExtra(settingsButton,'settings','显示与操作');settingsButton.addEventListener('click',e=>settings(e.currentTarget));find('.independent-model-header').append(settingsButton);
  const brief=document.createElement('div');brief.className='neural-brief';scene.append(brief);
  function responsiveChoice(){if(!manualLayout){mode.value=innerWidth<=700&&innerHeight>innerWidth&&innerHeight<=560?'scene':'linked';area.dataset.neuralView=mode.value;}}
  function queueResize(){if(layoutResizePending)return;layoutResizePending=true;requestAnimationFrame(()=>{layoutResizePending=false;responsiveChoice();navigation.resize();onResize?.();});}
  window.addEventListener('resize',queueResize);
  function sync(){for(const button of root.querySelectorAll('.stage-tab'))button.classList.toggle('is-active',button.getAttribute('aria-pressed')==='true');brief.textContent=(find('.record-head h2')?.textContent||'记录电位')+' '+(find('.reading')?.textContent.trim()||'');shell.syncStage();}
  const api=Object.freeze({sync,resize:()=>navigation.resize(),resetView(){manualLayout=false;responsiveChoice();navigation.fit();queueResize();},getState:()=>({version:manifest.version,science:getState(),shell:shell.getState(),navigation:navigation.getState(),layout:area.dataset.neuralView}),loading(){shell.setSceneStatus('loading');},ready(){find('[data-load]').textContent='';area.dataset.ready='true';shell.setSceneStatus('ready');queueResize();},failed(message,retry){area.dataset.ready='false';shell.setSceneStatus('error',message,retry);}});
  globalThis.NeuralSample=api;sync();return api;
 }};
})();
