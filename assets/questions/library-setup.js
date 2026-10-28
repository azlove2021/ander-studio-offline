(()=>{
 'use strict';
 const {esc,labels,kinds}=window.AnderLibraryView;
 const provinces=[['transition','新高考过渡卷（新疆、西藏）',6,0,0,5],['shandong','山东',15,0,5,5],['northeast','东北卷（辽宁、吉林、黑龙江、内蒙古）',15,0,5,5],['hunan','湖南',12,0,4,5],['hebei','河北',13,5,0,5],['jiangsu','江苏',15,4,0,5],['jiangxi','江西',12,4,0,5],['guangdong','广东',16,0,0,5],['guangxi','广西',16,0,0,5],['fujian','福建',15,0,0,5],['chongqing','重庆',15,0,0,5],['anhui','安徽',15,0,0,5],['hainan','海南',15,0,0,5],['sichuan','四川',15,0,0,5],['guizhou','贵州',16,0,0,5],['yunnan','云南',16,0,0,5],['henan','河南',16,0,0,5],['northwest','西北卷（陕西、山西、宁夏、青海）',16,0,0,5],['gansu','甘肃',16,0,0,5],['tianjin','天津',12,0,0,5],['beijing','北京',15,0,0,6],['hubei','湖北',18,0,0,4],['zhejiang_jan','浙江（1月）',20,0,0,5],['zhejiang_jun','浙江（6月）',20,0,0,5]];
 const modes=[['daily','每日一练','5道选择题'],['weekly','每周一练','12道选择题 + 2道大题'],['mock','模拟考试','20道选择题 + 5道大题'],['province','高考模拟','按省份设置'],['free','自由选择','手动设置题量']];
 const scopeNames={chapter:'按章节选题',topic:'按考点选题',all:'全部考点'};
 function mount(root,api){
  root.classList.remove('qp');
  root.classList.add('ql-training');
  let boot,prefs,catalog,guest=false,temporaryPreferences=null,resumeNotice='',config={scope:'all',selected:[],mode:'daily',province:null,difficulty:'basic'};
  let free={single:5,multi:0,indeterminate:0,written:0},available=null,serial=0,lifecycle=0,busy=false,requestId=null,signature='',dialog=null,dialogOpener=null,openScope=null,provinceMemory=null;
  const freshScope=()=>({selected:[],query:'',expanded:new Set(),searchCollapsed:new Set(),scroll:0,initialized:false});
  let scopeMemory={chapter:freshScope(),topic:freshScope()};
  const listener=new AbortController();let dead=false;
  const $=selector=>root.querySelector(selector);

  // QL-01: Both public training and private training use the current catalog/version.
  function makeCatalog(data){
   const nodes=data.nodes,index=new Map(nodes.map(n=>[n.id,n])),children=new Map(),leaves=new Map();
   for(const n of nodes){const key=n.parentId||n.taxonomy;if(!children.has(key))children.set(key,[]);children.get(key).push(n);}
   for(const list of children.values())list.sort((a,b)=>(a.order||0)-(b.order||0)||a.id.localeCompare(b.id));
   const below=id=>children.get(id)||[];
   const leafIds=id=>{if(!index.has(id))return [];if(!leaves.has(id))leaves.set(id,below(id).length?below(id).flatMap(n=>leafIds(n.id)):[id]);return leaves.get(id);};
   const taxonomy=scope=>scope==='chapter'?'chapter':'notes';
   const roots=scope=>below(taxonomy(scope));
   const pathFor=n=>Array.isArray(n.path)?n.path.join(' › '):n.parentId&&index.has(n.parentId)?pathFor(index.get(n.parentId))+' › '+n.title:n.title;
   const normalize=(scope,ids)=>[...new Set(ids.filter(id=>index.get(id)?.taxonomy===taxonomy(scope)).flatMap(leafIds))];
   const visible=scope=>{const words=scopeMemory[scope].query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);return new Set(nodes.filter(n=>n.taxonomy===taxonomy(scope)&&!below(n.id).length&&words.every(w=>pathFor(n).toLocaleLowerCase().includes(w))).map(n=>n.id));};
   return {nodes,index,below,leafIds,roots,pathFor,normalize,visible};
  }
  function counts(){
   if(config.mode==='free')return {...free};
   if(config.mode==='province'){const p=provinces.find(p=>p[0]===config.province);return Object.fromEntries(kinds.map((k,n)=>[k,p?.[n+2]||0]));}
   const [total,mix,written]=({daily:[5,1,0],weekly:[12,2,2],mock:[20,4,5]})[config.mode];
   return {single:total-(prefs.choiceMode==='single'?0:mix),multi:prefs.choiceMode==='multi'?mix:0,indeterminate:prefs.choiceMode==='indeterminate'?mix:0,written};
  }
  const wire=()=>({...config,ruleVersion:'student-practice-v2',catalogVersion:boot.catalogVersion,counts:counts(),choiceMode:prefs.choiceMode,source:prefs.source,yearWindow:prefs.yearWindow});
  const source=()=>({all:'不限来源',mock:'模拟题',gaokao:'高考题'})[prefs.source];
  function hero(){
   const stats=boot?.stats||(boot?{books:catalog?.roots('chapter').length,questions:boot.onlineCount,concepts:catalog&&boot.nodeCounts?catalog.nodes.filter(n=>n.taxonomy==='notes'&&!catalog.below(n.id).length&&boot.nodeCounts[n.id]>0).length:undefined}:null);
   return '<section class="model-intro ql-hero" aria-label="题目训练学习导语"><div class="resource-hero-copy"><p class="model-intro-kicker">STEP BY STEP, REACH HIGHER</p><h2>心之所向，素履以往，日夜兼程，功不唐捐。<br>一步一步，终会走上最高的山峰。</h2><p class="model-intro-note">注意产生记忆，重复巩固记忆，体系强化记忆</p></div><div class="model-intro-actions"><div class="resource-hero-stats" aria-label="题库概览">'+[['books','册教材'],['questions','道可用题'],['concepts','个考点'],['gaokao','道高考题']].map(([k,label])=>'<span><strong>'+esc(stats?.[k]??'—')+'</strong><small>'+label+'</small></span>').join('')+'</div><div class="resource-hero-actions"><a class="learning-map-action" data-open-library href="/question-bank.html"><span class="learning-map-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M6 3h9l3 3v15H6zM14 3v5h4M9 12h6M9 16h6"></path></svg></span><span class="learning-map-action-copy"><strong>打开生物学题库</strong><small>Open Biology Question Bank</small></span></a></div></div></section>';
  }
  function message(text,retry=false){const el=$('[data-setup-status]');if(el)el.textContent=resumeNotice+text;const button=$('[data-availability-retry]');if(button)button.hidden=!retry;}
  function selection(){return {config:{...config,selected:[...config.selected]},free:{...free},preferences:{choiceMode:prefs.choiceMode,source:prefs.source,yearWindow:prefs.yearWindow}};}
  function restoreSelection(value){
   const c=value?.config,p=value?.preferences,f=value?.free;
   if(!c||!p||!f||!['all','chapter','topic'].includes(c.scope)||!modes.some(m=>m[0]===c.mode)||!['basic','middle','advanced'].includes(c.difficulty)||!(c.province===null||provinces.some(row=>row[0]===c.province))||!Array.isArray(c.selected)||c.selected.length>365||!c.selected.every(id=>typeof id==='string'&&id.length<=128)||!['single','multi','indeterminate'].includes(p.choiceMode)||!['all','mock','gaokao'].includes(p.source)||![3,5,10].includes(p.yearWindow)||!kinds.every(k=>Number.isInteger(f[k])&&f[k]>=0&&f[k]<=30))return false;
   if(c.scope==='all'&&c.selected.length||c.mode!=='province'&&c.province!==null)return false;
   const selected=c.scope==='all'?[]:catalog.normalize(c.scope,c.selected);
   if(selected.length>365||c.selected.some(id=>!selected.includes(id)))return false;
   config={scope:c.scope,selected,mode:c.mode,province:c.province,difficulty:c.difficulty};free=Object.fromEntries(kinds.map(k=>[k,f[k]]));
   temporaryPreferences={choiceMode:p.choiceMode,source:p.source,yearWindow:p.yearWindow};prefs={...prefs,...temporaryPreferences};provinceMemory=c.province;
   if(c.scope!=='all'){scopeMemory[c.scope].selected=[...selected];openScope=c.scope;}
   return true;
  }
  async function loginWithSelection(target){
   if(busy||!guest)return;const run=lifecycle;busy=true;ready();message('正在保留本次选择…');
   try{await api.saveTrainingDraft(boot,selection(),target);if(!dead&&run===lifecycle)location.assign('/account/login?next='+encodeURIComponent(target));}
   catch(error){if(!dead&&run===lifecycle)message(error.message);}
   finally{if(!dead&&run===lifecycle){busy=false;ready();}}
  }
  function scopeDescription(scope){
   if(scope==='all')return '覆盖全部五册，按考点均衡选题';
   const roots=catalog.roots(scope),size=new Set(roots.flatMap(n=>catalog.leafIds(n.id))).size;
   return roots.length+(scope==='chapter'?'册教材 · ':'个模块 · ')+size+(scope==='chapter'?'节':'个考点');
  }
  function directoryMarkup(scope){
   return '<div class="ql-scope-directory" id="ql-directory-'+scope+'" data-scope-directory="'+scope+'" hidden><label class="ql-scope-search"><span class="ql-visually-hidden">搜索'+(scope==='chapter'?'章节或小节':'模块或考点')+'</span><input type="search" data-tree-search="'+scope+'" placeholder="'+(scope==='chapter'?'搜索章节 / 小节':'搜索模块 / 考点')+'" autocomplete="off"></label><small class="ql-scope-help" data-tree-help></small><div class="ql-training-tree" data-setup-tree="'+scope+'" tabindex="0" role="region" aria-label="'+scopeNames[scope]+'复选目录"></div><div class="ql-scope-footer"><strong data-tree-count aria-live="polite"></strong><div><button type="button" data-tree-all="'+scope+'">全选目录</button><button type="button" data-tree-clear="'+scope+'">清空</button></div></div></div>';
  }
  function rememberScroll(){for(const scope of ['chapter','topic']){const el=$('[data-setup-tree="'+scope+'"]');if(el&&config.scope===scope&&openScope===scope)scopeMemory[scope].scroll=el.scrollTop;}}
  function scopeTree(scope){
   const area=$('[data-scope-directory="'+scope+'"]');if(!area)return;
   const memory=scopeMemory[scope],list=area.querySelector('[data-setup-tree]'),visible=catalog.visible(scope),selected=new Set(memory.selected),query=memory.query.trim();
   const focused=document.activeElement?.closest('[data-node-select],[data-tree-toggle]'),focusKey=focused?.hasAttribute('data-node-select')?'data-node-select':'data-tree-toggle',focusId=focused&&list.contains(focused)?focused.getAttribute(focusKey):null;
   const walk=nodes=>'<ul>'+nodes.map(n=>{
    const subset=catalog.leafIds(n.id).filter(id=>visible.has(id));if(!subset.length)return '';
    const children=catalog.below(n.id),branch=children.length>0,total=subset.length,chosen=subset.filter(id=>selected.has(id)).length,checked=chosen===total,partial=chosen>0&&chosen<total;
    const expanded=branch&&(query?!memory.searchCollapsed.has(n.id):memory.expanded.has(n.id));
    return '<li class="ql-tree-node"><div class="ql-tree-row'+(checked?' is-selected':'')+'">'+(branch?'<button type="button" class="ql-tree-expand" data-tree-toggle="'+esc(n.id)+'" data-tree-scope="'+scope+'" aria-expanded="'+expanded+'" aria-controls="ql-children-'+esc(n.id)+'" aria-label="'+(expanded?'收起':'展开')+esc(n.title)+'">'+(expanded?'⌄':'›')+'</button>':'<span class="ql-tree-leaf-mark" aria-hidden="true"></span>')+'<label title="'+esc(catalog.pathFor(n))+'"><input type="checkbox" data-node-select="'+esc(n.id)+'" data-tree-scope="'+scope+'"'+(checked?' checked':'')+(partial?' data-partial="true"':'')+'><span>'+esc(n.title)+'</span></label>'+(branch?'<small>'+total+(scope==='chapter'?'节':'个考点')+'</small>':'')+'</div>'+(branch?'<div id="ql-children-'+esc(n.id)+'"'+(expanded?'':' hidden')+'>'+walk(children)+'</div>':'')+'</li>';
   }).join('')+'</ul>';
   list.innerHTML=visible.size?walk(catalog.roots(scope)):'<p class="ql-status">没有找到匹配目录，请换一个关键词。</p>';
   list.querySelectorAll('[data-partial]').forEach(input=>{input.indeterminate=true;});
   list.scrollTop=memory.scroll;
   if(focusId)list.querySelector('['+focusKey+'="'+CSS.escape(focusId)+'"]')?.focus({preventScroll:true});
   area.querySelector('[data-tree-search]').value=memory.query;
   area.querySelector('[data-tree-count]').textContent='已选 '+memory.selected.length+(scope==='chapter'?' 节':' 个考点');
   area.querySelector('[data-tree-help]').textContent=query?'找到 '+visible.size+' 项；勾选上级仅选择搜索结果。':'勾选上级选整组；可在目录内滚动。';
   const all=area.querySelector('[data-tree-all]');all.disabled=!visible.size;all.textContent=query?'全选结果':'全选目录';
   area.querySelector('[data-tree-clear]').disabled=!memory.selected.length;
  }
  function updateScope(){
   for(const button of root.querySelectorAll('[data-scope-choice]')){const scope=button.dataset.scopeChoice,active=config.scope===scope;button.setAttribute('aria-pressed',String(active));if(scope!=='all')button.setAttribute('aria-expanded',String(active&&openScope===scope));}
   for(const scope of ['chapter','topic']){const area=$('[data-scope-directory="'+scope+'"]'),show=config.scope===scope&&openScope===scope;area.hidden=!show;if(show)scopeTree(scope);}
  }
  function summary(){
   if(!$('[data-total]')||!prefs)return;
   const c=counts(),total=Object.values(c).reduce((a,b)=>a+b,0);
   $('[data-total]').textContent=total;
   // QL-04: Display the same per-kind plan sent to availability and generation.
   for(const k of kinds)$('[data-plan-kind="'+k+'"]').textContent=c[k];
   $('[data-count-summary]').textContent=kinds.filter(k=>c[k]).map(k=>c[k]+labels[k]).join(' + ');
   $('[data-summary-scope]').textContent=config.scope==='all'?'全部范围':'已选 '+config.selected.length+(config.scope==='chapter'?' 节':' 个考点');
   $('[data-summary-source]').textContent=source()+' · 近'+prefs.yearWindow+'年';
   $('[data-summary-minutes]').textContent='约 '+Math.round(c.single*2+(c.multi+c.indeterminate)*3+c.written*6)+' 分钟';
   $('[data-pref-summary]').textContent=({single:'单选',multi:'含多选',indeterminate:'含不定项'})[prefs.choiceMode]+' · '+source()+' · 近'+prefs.yearWindow+'年';
   $('[data-pref-mode]').textContent=config.mode==='province'?'题型按省份设置，原偏好保留。':config.mode==='free'?'题型数量以手动填写为准。':'';
  }
  // QL-02: Presets update existing controls; the hero, scope tree and focus stay put.
  function updatePreset(){
   for(const button of root.querySelectorAll('[data-preset]'))button.setAttribute('aria-pressed',String(button.dataset.preset===config.mode));
   $('[data-preset-extra]').dataset.mode=config.mode;
   $('[data-province-panel]').hidden=config.mode!=='province';
   $('[data-free-panel]').hidden=config.mode!=='free';
   $('[data-province]').value=config.province||provinceMemory||'';
   summary();
  }
  function render(){
   root.innerHTML=hero()+'<div class="ql-training-grid"><section class="ql-training-card ql-scope-card"><h2><span>01</span>选择练习范围</h2><div class="ql-scope-stack" role="group" aria-label="选题范围">'+['chapter','topic','all'].map(scope=>'<button type="button" class="ql-scope-choice" data-scope-choice="'+scope+'" aria-pressed="'+(config.scope===scope)+'"'+(scope==='all'?'':' aria-expanded="false" aria-controls="ql-directory-'+scope+'"')+'><span><strong>'+scopeNames[scope]+'</strong><small>'+scopeDescription(scope)+'</small></span>'+(scope==='all'?'':'<b aria-hidden="true">⌄</b>')+'</button>'+(scope==='all'?'':directoryMarkup(scope))).join('')+'</div></section>'+
    '<section class="ql-training-card ql-preset-card"><h2><span>02</span>选择题型数量</h2><div class="ql-preset-scroll">'+modes.map(([v,t,d])=>'<button type="button" class="ql-training-option" data-preset="'+v+'" aria-pressed="'+(config.mode===v)+'"><strong>'+t+'</strong><small>'+d+'</small></button>').join('')+'</div><div class="ql-preset-extra" data-preset-extra><div data-province-panel hidden><label for="ql-province">省份／卷别</label><select id="ql-province" data-province aria-label="省份或卷别"><option value="">请选择省份 / 卷别</option>'+provinces.map(p=>'<option value="'+p[0]+'">'+p[1]+'</option>').join('')+'</select></div><div class="ql-counts" data-free-panel hidden>'+kinds.map(k=>'<label>'+labels[k]+'<input type="number" min="0" max="30" step="1" data-count="'+k+'" value="'+free[k]+'"></label>').join('')+'</div></div><p class="ql-status" data-count-summary></p><div class="ql-preference"><span data-pref-summary></span><button type="button" data-preferences>选题偏好 ⚙</button><p data-pref-mode></p></div></section>'+
    '<section class="ql-training-card ql-difficulty-card"><h2><span>03</span>选择题目难度</h2><div class="ql-difficulty-options">'+[['basic','基础巩固','70% 基础 · 20% 中档 · 10% 提高'],['middle','中档进阶','20% 基础 · 60% 中档 · 20% 提高'],['advanced','能力提升','10% 基础 · 30% 中档 · 60% 提高']].map(([v,t,d])=>'<button type="button" class="ql-difficulty ql-training-option" data-difficulty="'+v+'" aria-pressed="'+(config.difficulty===v)+'"><strong>'+t+'</strong><small>'+d+'</small></button>').join('')+'</div></section>'+
    '<aside class="ql-training-card ql-training-summary"><p class="ql-kicker">YOUR PRACTICE</p><h2>这次练习</h2><p class="ql-total"><span data-total></span><small> 道题</small></p><ul class="ql-training-kind-counts" aria-label="本次练习题型数量">'+kinds.map(k=>'<li><span>'+({single:'单选题',multi:'多选题',indeterminate:'不定项题',written:'大题'})[k]+'</span><strong data-plan-kind="'+k+'">0</strong><span>道</span></li>').join('')+'</ul><dl><div><dt>练习范围</dt><dd data-summary-scope></dd></div><div><dt>来源与年份</dt><dd data-summary-source></dd></div><div><dt>预计用时</dt><dd data-summary-minutes></dd></div></dl><p class="ql-training-error" role="status" data-setup-status></p><button type="button" data-availability-retry hidden>重新核对题量</button><button type="button" class="ql-primary ql-generate" data-generate disabled>确定生成练习</button></aside></div>';
   updateScope();updatePreset();refresh();
  }
  function ready(){
   const button=$('[data-generate]');if(!button||!prefs)return;
   const c=counts(),total=Object.values(c).reduce((a,b)=>a+b,0),enough=kinds.every(k=>Number.isInteger(c[k])&&c[k]>=0&&c[k]<=30&&(guest||available&&c[k]<=available[k]));
   button.disabled=busy||!enough||total<1||total>60||config.scope!=='all'&&!config.selected.length||config.mode==='province'&&!config.province;
  }
  async function refresh(){
   const run=++serial;available=null;summary();ready();
   if(config.mode==='province'&&!config.province){message('请选择省份或卷别。');return;}
   if(config.scope!=='all'&&!config.selected.length){message('请先选择章节或考点。');return;}
   if(guest){message('可以先设置练习；登录后核对可用题量并生成。');ready();return;}
   message('正在核对所选来源、年份与题量…');
   try{const data=await api.request('/api/questions/availability',{config:wire()});if(run!==serial||dead)return;available=data.counts;message(kinds.some(k=>counts()[k]>(available[k]||0))?'当前硬条件下题量不足，请调整范围或数量。':'题量已读取，生成时将继续核对考点配额和同族去重。');ready();}
   catch(error){if(run===serial&&!dead){message(error.message,true);ready();}}
  }
  function selectLeaves(scope,ids,checked){
   const next=new Set(scopeMemory[scope].selected);ids.forEach(id=>checked?next.add(id):next.delete(id));
   scopeMemory[scope].selected=[...next];config.scope=scope;config.selected=[...next];
   rememberScroll();scopeTree(scope);refresh();
  }
  function preferences(button){
   if(dialog)return;dialogOpener=button;const openedAt=lifecycle;
   const current=document.createElement('dialog');dialog=current;current.className='ql-dialog';current.setAttribute('aria-labelledby','ql-pref-title');
   const groups=[['choiceMode','选择题题型',[['single','单选'],['multi','含多选'],['indeterminate','含不定项']]],['source','题目来源',[['all','不限'],['mock','模拟题'],['gaokao','高考题']]],['yearWindow','年份',[[3,'近3年'],[5,'近5年'],[10,'近10年']]]];
   current.innerHTML='<button type="button" data-close aria-label="关闭选题偏好">×</button><h2 id="ql-pref-title">选题偏好</h2><form class="ql-pref-form">'+groups.map(([name,title,options])=>'<fieldset'+(name==='choiceMode'&&['province','free'].includes(config.mode)?' disabled':'')+'><legend>'+title+'</legend>'+options.map(([v,t])=>'<label><input type="radio" name="'+name+'" value="'+v+'"'+(prefs[name]===v?' checked':'')+'>'+t+'</label>').join('')+'</fieldset>').join('')+'<p data-pref-status role="status"></p><div><button type="button" data-defaults>恢复默认</button> <button class="ql-primary" type="submit">保存偏好</button></div></form>';root.append(current);
   current.querySelector('[data-close]').onclick=()=>current.close();current.addEventListener('close',()=>{current.remove();if(dialog===current)dialog=null;if(!dead&&openedAt===lifecycle)dialogOpener?.focus({preventScroll:true});},{once:true});
   current.querySelector('[data-defaults]').onclick=()=>{for(const [k,v]of Object.entries({choiceMode:'single',source:'all',yearWindow:3})){if(k==='choiceMode'&&['province','free'].includes(config.mode))continue;current.querySelector('input[name="'+k+'"][value="'+v+'"]').checked=true;}};
   current.querySelector('form').onsubmit=async event=>{
    event.preventDefault();const form=event.target,save=form.querySelector('[type=submit]'),status=form.querySelector('[data-pref-status]');save.disabled=true;status.textContent='正在保存…';const selected=name=>form.querySelector('input[name="'+name+'"]:checked').value;
    const choice={choiceMode:selected('choiceMode'),source:selected('source'),yearWindow:Number(selected('yearWindow'))};
    if(guest){temporaryPreferences=choice;prefs={...prefs,...choice};current.close();summary();refresh();return;}
    try{const data=await api.mutate('/api/questions/preferences',{revision:prefs.revision,...choice});if(dead||openedAt!==lifecycle)return;temporaryPreferences=null;prefs=data.preferences;current.close();summary();refresh();}
    catch(error){if(dead||openedAt!==lifecycle)return;if(error.code==='PREFERENCE_CONFLICT'){try{const latest=await api.request('/api/questions/preferences');if(dead||openedAt!==lifecycle)return;prefs=latest.preferences;}catch{/* Keep the original conflict visible; no automatic write retry. */}}status.textContent=error.message;save.disabled=false;}
   };
   current.showModal();
  }
  root.addEventListener('click',async event=>{
   if(event.target.closest('[data-training-reload]')){location.reload();return;}
   if(event.target.closest('[data-open-library]')&&guest&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();await loginWithSelection('/question-bank.html');return;}
   const button=event.target.closest('button');if(!button||button.disabled)return;
   if(button.dataset.scopeChoice){
    rememberScroll();const scope=button.dataset.scopeChoice;
    if(config.scope===scope)openScope=scope==='all'||openScope===scope?null:scope;
    else{config.scope=scope;config.selected=scope==='all'?[]:[...scopeMemory[scope].selected];openScope=scope==='all'?null:scope;}
    updateScope();refresh();
   }
   if(button.dataset.treeToggle){rememberScroll();const scope=button.dataset.treeScope,memory=scopeMemory[scope],id=button.dataset.treeToggle,target=memory.query.trim()?memory.searchCollapsed:memory.expanded;target.has(id)?target.delete(id):target.add(id);scopeTree(scope);}
   if(button.dataset.treeAll)selectLeaves(button.dataset.treeAll,[...catalog.visible(button.dataset.treeAll)],true);
   if(button.dataset.treeClear)selectLeaves(button.dataset.treeClear,scopeMemory[button.dataset.treeClear].selected,false);
   if(button.dataset.preset){if(config.mode===button.dataset.preset)return;config.mode=button.dataset.preset;config.province=config.mode==='province'?provinceMemory:null;updatePreset();refresh();}
   if(button.dataset.difficulty){config.difficulty=button.dataset.difficulty;root.querySelectorAll('[data-difficulty]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));refresh();}
   if(button.hasAttribute('data-preferences'))preferences(button);
   if(button.hasAttribute('data-availability-retry'))refresh();
   if(button.hasAttribute('data-generate')&&!busy){
    if(guest){await loginWithSelection('/#exams');return;}
    resumeNotice='';
    const value=wire(),next=JSON.stringify(value),startedAt=lifecycle;if(next!==signature){signature=next;requestId=crypto.randomUUID();}busy=true;ready();message('正在分配题目…');
    try{
     let result;try{result=await api.request('/api/questions/papers',{config:value,requestId});}
     catch(error){if(dead||startedAt!==lifecycle)return;if(error.code!=='DIFFICULTY_FALLBACK')throw error;const actual=kinds.filter(k=>value.counts[k]).map(k=>labels[k]+'：目标 '+error.details.wanted[k].join('/')+'；实际 '+error.details.actual[k].join('/')).join('\n');if(!confirm(actual+'\n顺序为基础/中档/提高。按此实际分布生成吗？')){message('已取消，未生成练习。');return;}result=await api.request('/api/questions/papers',{config:value,requestId,allowDifficultyFallback:true});}
     if(!dead&&startedAt===lifecycle)location.href='/practice.html?id='+encodeURIComponent(result.paper.id);
    }catch(error){if(!dead&&startedAt===lifecycle)message(error.message+(error.code==='REQUEST_UNKNOWN'?' 再次确认生成将复用本次请求编号，不重复建卷。':''));}
    finally{if(!dead&&startedAt===lifecycle){busy=false;ready();}}
   }
  },{signal:listener.signal});
  root.addEventListener('change',event=>{
   const el=event.target;
   if(el.hasAttribute('data-node-select')){const scope=el.dataset.treeScope,visible=catalog.visible(scope);selectLeaves(scope,catalog.leafIds(el.dataset.nodeSelect).filter(id=>visible.has(id)),el.checked);}
   if(el.hasAttribute('data-province')){provinceMemory=el.value||null;config.province=provinceMemory;refresh();}
   if(el.dataset.count){free[el.dataset.count]=Number(el.value);refresh();}
  },{signal:listener.signal});
  root.addEventListener('input',event=>{const el=event.target;if(el.hasAttribute('data-tree-search')){const scope=el.dataset.treeSearch;rememberScroll();scopeMemory[scope].query=el.value;scopeMemory[scope].searchCollapsed.clear();scopeMemory[scope].scroll=0;scopeTree(scope);}},{signal:listener.signal});
  async function start(){
   const run=++lifecycle;root.innerHTML=hero()+'<p role="status">正在读取账户选题偏好…</p>';
   try{const data=await (api.initializeTraining?api.initializeTraining():api.initialize());if(dead||run!==lifecycle)return;boot=data;guest=data.trainingPublic===true&&data.authenticated===false;prefs={...data.preferences,...temporaryPreferences};catalog=makeCatalog(data.catalog);if(!guest&&data.trainingPublic===true){const pending=api.takeTrainingDraft?.(data);if(pending&&restoreSelection(pending))resumeNotice='已恢复设置，请确认生成练习。';}for(const scope of ['chapter','topic']){const memory=scopeMemory[scope];memory.selected=catalog.normalize(scope,memory.selected);if(!memory.initialized){if(catalog.roots(scope)[0])memory.expanded.add(catalog.roots(scope)[0].id);memory.initialized=true;}}config.selected=config.scope==='all'?[]:[...scopeMemory[config.scope].selected];render();}
   catch(error){if(dead||run!==lifecycle)return;root.innerHTML=hero()+'<section class="ql-panel ql-empty"><h2>'+esc(error.code==='AUTH_REQUIRED'?'登录后开始练习':'暂时无法读取练习配置')+'</h2><p>'+esc(error.message)+'</p><a href="/account/login?next=%2F%23exams">登录学习账号</a></section>';}
  }
  // QL-03: Keep temporary directory choices only within the current account context.
  const unsub=api.subscribe(type=>{
   if(dead)return;
   if(type==='suspend'||type==='invalid'){
    rememberScroll();serial++;lifecycle++;busy=false;dialog?.close();
    if(type==='invalid'){boot=null;prefs=null;catalog=null;guest=false;temporaryPreferences=null;resumeNotice='';config={scope:'all',selected:[],mode:'daily',province:null,difficulty:'basic'};free={single:5,multi:0,indeterminate:0,written:0};scopeMemory={chapter:freshScope(),topic:freshScope()};openScope=null;provinceMemory=null;signature='';requestId=null;}
    root.innerHTML=hero()+'<p>已暂时清除练习配置，正在核对登录状态。</p>';
   }
   if(type==='invalid'){root.innerHTML=hero()+'<section class="ql-panel ql-empty"><p>登录状态已变化，已清除原账户的练习设置。</p><button type="button" data-training-reload>重新加载练习</button></section>';return;}
   if(type==='unavailable'){root.innerHTML=hero()+'<section class="ql-panel ql-empty"><p>暂时无法核对登录状态，请恢复网络后重试。</p><button type="button" data-training-reload>重新加载练习</button></section>';return;}
   if(type==='resume'||type==='refresh'){if(!busy){rememberScroll();start();}}
  });
  start();return()=>{dead=true;serial++;lifecycle++;listener.abort();unsub();dialog?.close();root.replaceChildren();};
 }
 window.AnderLibrarySetup={mount};
 const root=document.querySelector('[data-question-setup]');if(root&&!document.body.hasAttribute('data-library-prototype'))mount(root,window.AnderLibraryAPI.create());
})();
