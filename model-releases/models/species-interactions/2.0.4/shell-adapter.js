const kinds=['predation','parasitism','competition','mutualism'];
const names=['捕食','寄生','竞争','互利'];
export function mountRelationshipExperience({manifest,getState,render,onReturn,post}){
 const shell=AnderModelShell,root=document.querySelector('.model-area'),workbench=document.querySelector('.relationship-workbench'),viewport=document.querySelector('.plots-scroll');
 const panels=[...document.querySelectorAll('.relationship-panel')],settings=document.querySelector('.relationship-settings'),browser=document.querySelector('.relationship-browser');
 const legends=panels.map(panel=>panel.querySelector('.series-legend'));
 const legendHomes=legends.map(legend=>{const home=document.createComment('series legend');legend.before(home);return home;});
 const legendSlot=document.createElement('div');legendSlot.className='relationship-legend-slot';document.querySelector('.science-viewport').append(legendSlot);
 let experience,selected=0,mode='auto',actual='',lastKey='',frame=0,lastDisplay='normal';
 panels.forEach((panel,i)=>{const group=document.createElement('section');group.className='relationship-setting-group';const title=document.createElement('h3');title.textContent=panel.querySelector('h2').textContent;group.append(title,panel.querySelector('.plot-context'));settings.append(group);const summary=document.createElement('div');summary.className='relationship-summary';summary.dataset.summary=kinds[i];panel.querySelector('h2').after(summary);});
 const tabs=kinds.map((kind,i)=>{const b=document.createElement('button');b.type='button';b.className='relationship-tab';b.dataset.relationship=i;b.textContent=names[i];b.addEventListener('click',()=>{selected=i;layout(true);});browser.querySelector('.relationship-tabs').append(b);return b;});
 const modeButton=browser.querySelector('[data-relationship-detail]');
 function sync(){
  const s=getState(),text={predation:'典型周期情境 · 猎物先达峰',parasitism:s.options.reference?'灰虚线：未受寄生的宿主':'未受寄生对照已隐藏',competition:s.options.competition==='periodic'?'资源条件周期变化 · 周期共存':'竞争排斥对照',mutualism:s.options.separate?(s.time<18?'t = 18 解除互利作用':s.options.mutual==='obligate'?'解除后衰减 · 双方依赖':'解除后可独立维持'):(s.options.mutual==='obligate'?'双方必需型 · 共同环境变化':'原始合作 · 共同环境变化')};
  for(const[k,value]of Object.entries(text)){const n=document.querySelector(`[data-summary="${k}"]`);if(n.textContent!==value)n.textContent=value;}
  experience?.syncStage();
 }
 function layout(force=false){
  const width=viewport.clientWidth,height=viewport.clientHeight;if(!width||!height)return;
  const landscape=width>height*1.35;
  const automatic=width>=1050&&height>=400?'all':(landscape&&width>=560&&height>=174)||(!landscape&&height>=360)?'pair':'single';
  actual=mode==='single'?'single':automatic;
  const key=[width,height,actual,selected].join('/');if(key===lastKey&&!force)return;lastKey=key;
  workbench.dataset.layout=actual;workbench.dataset.plotOrientation=landscape?'landscape':'portrait';
  const footer=Number.parseFloat(getComputedStyle(document.querySelector('.science-viewport')).paddingBottom);
  const dense=actual==='single'&&height<185&&footer>=48;workbench.dataset.dense=String(dense);
  legends.forEach((legend,i)=>legendHomes[i].after(legend));
  if(dense)legendSlot.append(legends[selected]);
  panels.forEach((panel,i)=>panel.hidden=actual==='single'?i!==selected:actual==='pair'?Math.floor(i/2)!==Math.floor(selected/2):false);
  tabs.forEach((button,i)=>{const active=!panels[i].hidden;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  modeButton.textContent=mode==='single'?'返回对照':'单图细看';modeButton.setAttribute('aria-pressed',String(mode==='single'));
  browser.querySelector('[data-relationship-mode]').textContent=actual==='all'?'四图同步':actual==='pair'?'双图同步':'同一时间';
  render();
 }
 const resize=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>layout());};
 modeButton.addEventListener('click',()=>{mode=mode==='single'?'auto':'single';layout(true);});
 const help='<p>四张图始终使用同一时间。电脑显示四图；手机按可用空间显示双图或单图。上方名称切换要看的关系，“单图细看”放大当前图，返回对照恢复自适应布局。</p><p>时间条可前后拖动，拖动即暂停。点图例分别隐藏曲线；在“情境与说明”中切换竞争、互利情境，或设置对照和解除关系，时间保持。</p><p>蓝色读左轴，橙色读右轴，交点不表示数量相等。周期来自本例设定的情境，不是某种关系必然的形状；数据为教学构造。</p><p>全屏触碰唤出上下栏，最后松手约两秒后收起。收藏服务由可选宿主提供。</p>';
 const context=trigger=>experience.showPanel(settings,'情境与说明',trigger);
 const displaySettings=trigger=>experience.showDialog('显示与操作',help,trigger,[{label:'恢复自适应对照',run:()=>{mode='auto';layout(true);experience.closeDialog();}}]);
 const back=()=>{if(parent!==window)onReturn();else if(new URLSearchParams(location.search).has('return')){const u=new URL(new URLSearchParams(location.search).get('return'),location.href);if(['http:','https:'].includes(u.protocol))location.href=u.href;}else experience.showDialog('独立模型预览','<p>当前独立打开种间关系模型，关闭此标签页可返回之前的页面。</p>',document.activeElement);};
 experience=shell.mountExperience({root,viewport:document.querySelector('.science-viewport'),title:'种间关系',returnLabel:'返回目录',onReturn:back,host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'情境与说明',onSettings:displaySettings,onContext:context,hasContext:()=>true,helpContent:help,onDisplayChange:()=>{resize();const display=root.dataset.display;if(display!==lastDisplay){lastDisplay=display;post('model:request-fullscreen',{active:display!=='normal'});}}});
 shell.setExtra(document.querySelector('[data-relationship-settings]'),'settings','显示与操作');
 document.querySelector('[data-relationship-settings]').addEventListener('click',e=>displaySettings(e.currentTarget));
 document.querySelector('[data-relationship-context]').addEventListener('click',e=>context(e.currentTarget));
 document.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();back();});
 const observer=new ResizeObserver(resize);observer.observe(viewport);layout(true);sync();experience.setSceneStatus('ready');
 globalThis.SpeciesInteractionsSample=Object.freeze({version:manifest.version,getState:()=>({...getState(),layout:{mode,actual,selected:kinds[selected],visible:panels.filter(p=>!p.hidden).map(p=>p.dataset.kind)},shell:experience.getState()})});
 return {...experience,sync,resize};
}
