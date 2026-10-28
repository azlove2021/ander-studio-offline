// Content adapter only. Original controllers own the scientific clocks and inputs.
export function mountEcologyShell({manifest,getState,render,post,selectKind}) {
 const q=s=>document.querySelector(s),root=q('.model-area'),viewport=q('.science-viewport'),common=AnderModelShell;
 const population=manifest.id==='population-growth',workbench=q(population?'.population-workbench':'.succession-workbench');
 const surface=q(population?'.plots-scroll':'.scene-scroll'),context=document.createElement('section');
 context.className='ecology-context';workbench.append(context);document.body.dataset.modelId=manifest.id;
 let shell,mode='auto',selected=population?'j':'primary',actual='',lastKey='',lastOptions='',lastStage=-1,lastDisplay='normal',frame=0,ready=false;
 const detailHomes=[];
 const button=(text,fn,key)=>{const b=document.createElement('button');b.type='button';b.className='shell-action ecology-action';b.textContent=text;if(key)b.dataset.ecology=key;b.addEventListener('click',()=>fn(b));return b;};
 const toolbar=document.createElement('div');toolbar.className='ecology-toolbar';workbench.prepend(toolbar);
 const tabs=document.createElement('div');tabs.className='ecology-tabs';toolbar.append(tabs);
 const kinds=population?['j','s']:['primary','secondary'],names=population?['J 型','S 型']:['初生','次生'];
 const tabButtons=kinds.map((kind,i)=>{const b=button(names[i],()=>{selected=kind;if(population)mode='single';else selectKind(kind);layout(true);},kind);tabs.append(b);return b;});
 const modeButton=button('双图对照',()=>{mode=actual==='single'?'pair':'single';layout(true);},'view');toolbar.append(modeButton);
 const contextTitle=population?'参数与公式':'情境与说明';
 const status=document.createElement('span');status.className='ecology-status';toolbar.append(status);
 if(population){
  const time=q('.science-time');time.classList.add('timeline-wrap');toolbar.append(q('.tangent-option'));
  q('.control-group-primary').after(time);q('#playback-state').hidden=true;context.append(q('.parameter-form'));
  for(const panel of document.querySelectorAll('.growth-panel')){const section=document.createElement('section');section.className='ecology-equation-note';const h=document.createElement('h3');h.textContent=panel.dataset.kind==='j'?'J 型增长':'S 型增长';section.append(h,panel.querySelector('.growth-equation'));context.append(section);const node=panel.querySelector('.plot-state'),home=document.createComment('plot-state-home');node.before(home);detailHomes.push({node,home,section});}
  const note=document.createElement('p');note.textContent='两图共用 N₀、r 和时间，浅灰虚线为另一模型在同一坐标下的对比。J 图纵轴随数量连续扩展，S 图纵轴固定；不同量程下请用数值比较增长速率。';context.append(note);
 }else{
  q('.context-bar').hidden=true;toolbar.append(q('.soil-toggle'));context.innerHTML='<p>初生演替从缺乏发育土壤的裸岩开始；次生演替从保留土壤和部分生物遗留的火后场地开始。</p><p>两侧分别保存进度和倍速。上方选择控制哪一侧，播放、重置、阶段和底部滑杆只作用于选中侧；另一侧保持。图上百分比是独立示意进程，不对应相同真实年数。</p><p>森林是本例适宜气候、有迁入来源且长期无严重干扰的结果，不是所有群落的必然终点。新旧类群可以共存；剖面厚度和覆盖为示意。</p>';
 }
 const openContext=trigger=>shell.showPanel(context,contextTitle,trigger);
 toolbar.append(button(contextTitle+' ↗',openContext,'context'));
 const personal=document.createElement('div');personal.className='control-group control-group-personal';
 for(const key of ['Tools','Help','Favorite']){const b=document.createElement('button');b.type='button';b.className='control-button';b.dataset['shell'+key]='';personal.append(b);}
 personal.append(q('[data-action=fullscreen]'));q('.control-dock').append(personal);
 const help=population?'<p>两图共用同一时间，底部拖动即暂停。J 型、S 型切换大图，“双图对照”同时看两图；屏幕不足时可在图内滚动。</p><p>参数与公式中可修改 N₀ 和 r，应用后从起点重新观察。勾选切线与速率显示即时数值，定位 K/2 可观察 S 型最大增长速率。</p>':'<p>选择初生或次生后，底部进度条和阶段只控制这一侧。切换会暂停，并恢复该侧已保存的进度和倍速。</p><p>“双图对照”同时查看两侧，“当前大图”放大选中场景；这只改变布局。土壤剖面按需加载，打开时仍保留地上景观。</p>';
 const helpContent=help+'<p>全屏轻触唤出上下控制，最后松手约两秒后收起；按住滑杆不会隐藏。收藏由可选宿主提供。</p>';
 const settings=trigger=>shell.showDialog('显示与操作',helpContent,trigger,[{label:'恢复自适应对照',run:()=>{mode='auto';layout(true);shell.closeDialog();}}]);
 const back=()=>{if(parent!==window)post('model:state',{...getState(),navigation:'home'});else shell.showDialog('独立模型预览','<p>关闭此标签页可返回之前的目录。</p>',document.activeElement);};
 shell=common.mountExperience({root,viewport,title:manifest.title.zh,returnLabel:'返回目录',onReturn:back,host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:contextTitle,onSettings:settings,onContext:openContext,hasContext:()=>true,helpContent,onDisplayChange(){queue();if(lastDisplay!==root.dataset.display){lastDisplay=root.dataset.display;post('model:request-fullscreen',{active:lastDisplay!=='normal'});}}});
 const gear=document.createElement('button');gear.type='button';gear.className='shell-icon-button';common.setExtra(gear,'settings','显示与操作');gear.addEventListener('click',e=>settings(e.currentTarget));q('.independent-model-header').append(gear);
 q('.independent-model-back').addEventListener('click',e=>{e.preventDefault();back();});
 function layout(force=false){
  const width=surface.clientWidth,height=surface.clientHeight;if(!width||!height)return;
  const landscape=width>=560&&width>height*1.2;
  const auto=landscape&&height>=160||!landscape&&height>=430?'pair':'single';
  actual=mode==='auto'?auto:mode;const s=getState();if(!population)selected=s.activeKind;
  const key=[width,height,actual,selected,landscape,s.tangents,s.soil].join('/');if(key===lastKey&&!force)return;lastKey=key;
  const dense=height<205||(s.tangents&&height<250),sparse=height<165||(s.tangents&&height<230);
  root.dataset.ecoLayout=actual;root.dataset.ecoOrientation=landscape?'landscape':'portrait';root.dataset.ecoDense=String(dense);root.dataset.ecoSparse=String(sparse);root.style.setProperty('--eco-surface-height',height+'px');
  for(const {node,home,section}of detailHomes){if(dense){if(node.parentNode!==section)section.append(node);}else if(node.parentNode===section)home.after(node);}
  if(population){document.querySelectorAll('.growth-panel').forEach(p=>p.hidden=actual==='single'&&p.dataset.kind!==selected);}
  else{const world=q('.scene-world');world.dataset.ecoLayout=actual;world.dataset.ecoSelected=selected;world.dataset.ecoOrientation=landscape?'landscape':'portrait';}
  tabButtons.forEach((b,i)=>{const active=population?actual==='pair'||kinds[i]===selected:kinds[i]===selected;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',population?names[i]+'增长大图':'控制'+names[i]+'演替');});
  modeButton.textContent=actual==='single'?'双图对照':population?'单图细看':'当前大图';modeButton.setAttribute('aria-pressed',String(actual==='single'));
  render();
 }
 function queue(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;layout();});}
 function sync(){const s=getState();if(s.stage!==lastStage){lastStage=s.stage;shell.syncStage();}
  const options=String(s.tangents)+'/'+s.soil;if(options!==lastOptions){lastOptions=options;queue();}
  if(population){const text=`N₀ ${s.parameters.n0} · r ${s.parameters.r} · K ${s.parameters.k}`;if(status.textContent!==text)status.textContent=text;}
  else{if(selected!==s.activeKind){selected=s.activeKind;queue();}const text=`${s.activeKind==='primary'?'初生':'次生'}控制 · 两侧进度独立`;if(status.textContent!==text)status.textContent=text;tabButtons.forEach(b=>b.disabled=!s.ready);}
  if(s.ready&&!ready){ready=true;root.dataset.ready='true';shell.setSceneStatus('ready');queue();}
 }
 const resize=new ResizeObserver(queue);resize.observe(surface);addEventListener('resize',queue);
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;resize.disconnect();});addEventListener('pageshow',e=>{if(e.persisted){resize.observe(surface);queue();}});
 const api={sync,resize:queue,setError:retry=>shell.setSceneStatus('error','场景载入失败，请重新加载后重试。',()=>{shell.setSceneStatus('loading');retry();}),getState:()=>({version:manifest.version,science:getState(),shell:shell.getState(),layout:{mode,actual,selected}})};
 globalThis.EcologySample=Object.freeze(api);sync();queue();return api;
}
