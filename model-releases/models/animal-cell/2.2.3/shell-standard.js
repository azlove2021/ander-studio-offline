/* ANDER_MODEL_SHELL_2_5_0 — copy at build time; no shared runtime or model logic. */
(() => {
  'use strict';
  const STANDARD = 'adaptive-model-shell-2.5.0';
  const paths = Object.freeze({
    play: '<path d="M8 5 19 12 8 19Z"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v6h6"/>',
    prev: '<path d="m15 18-6-6 6-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    speed: '<path d="M5 17a8 8 0 1 1 14 0M12 13l4-4"/>',
    labels: '<path d="M4 6h16M7 12h10M9 18h6"/>',
    highlight: '<path d="m12 3 2.5 6 6.5.5-5 4.2 1.5 6.3-5.5-3.3L6.5 20 8 13.7 3 9.5 9.5 9Z"/>',
    focus: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    view: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/>',
    fullscreen: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fullscreen = () => Boolean(document.fullscreenElement || document.querySelector('.model-area.is-css-fullscreen'));
  let navigationFrame = 0;
  let activeStageKey = null;
  function syncActiveStage(force = false) {
    if(force)activeStageKey=null;
    if (navigationFrame) return;
    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = 0;
      const strip = document.querySelector('.stage-strip');
      const buttons = [...(strip?.querySelectorAll('.stage-tab') || [])];
      const active = buttons.find(button => button.classList.contains('is-active') || button.getAttribute('aria-current') === 'step' || button.getAttribute('aria-pressed') === 'true');
      if (!active) return;
      const key = buttons.indexOf(active);
      if (activeStageKey === key) return;
      activeStageKey = key;
      const outer = strip.getBoundingClientRect(), inner = active.getBoundingClientRect();
      if (inner.left < outer.left + 7) strip.scrollLeft -= outer.left + 7 - inner.left;
      else if (inner.right > outer.right - 7) strip.scrollLeft += inner.right - outer.right + 7;
    });
  }
  function presentation(kind, value = '') {
    const original = String(value);
    if (kind === 'previous-stage') kind = 'prev';
    if (kind === 'next-stage') kind = 'next';
    if (kind === 'toggle-play' || kind === 'play') kind = /暂停/.test(original) ? 'pause' : /再播放|重播/.test(original) ? 'reset' : 'play';
    if (kind === 'highlight' && /聚焦/.test(original)) kind = 'focus';
    let label = original;
    if (kind === 'play') label = /继续/.test(original) ? '继续' : '播放';
    if (kind === 'pause') label = '暂停';
    if (kind === 'reset') label = /再播放|重播/.test(original) ? '重播' : '重置';
    if (kind === 'prev') label = '上一步';
    if (kind === 'next') label = '下一步';
    if (kind === 'speed') label = `${original.match(/\d+(?:\.\d+)?/)?.[0] || '1'}×`;
    if (kind === 'labels') label = '标签';
    if (kind === 'highlight') label = '高亮';
    if (kind === 'focus') label = '聚焦';
    if (kind === 'view') label = '视角';
    if (kind === 'fullscreen') label = document.fullscreenElement ? '退出全屏' : document.querySelector('.model-area.is-css-fullscreen') ? '退出沉浸' : '全屏';
    return {kind, label};
  }
  function controlContent(kind, value) {
    const p = presentation(kind, value);
    return `<svg class="shell-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[p.kind] || paths.reset}</svg><span class="shell-control-label">${escape(p.label)}</span>`;
  }
  function setControl(button, kind, value, pressed) {
    if (!button) return;
    const html = controlContent(kind, value);
    if (button.innerHTML !== html) button.innerHTML = html;
    const p = presentation(kind, value);
    const label = p.kind === 'speed' ? `播放速度 ${p.label}` : p.label;
    if (button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
    if (typeof pressed === 'boolean') button.setAttribute('aria-pressed', String(pressed));
    syncActiveStage();
  }
  function stageContent(index, zh, en) {
    return `<span class="shell-stage-number" aria-hidden="true">${Number(index) + 1}</span><span class="shell-stage-titles"><strong>${escape(zh)}</strong><small>${escape(en)}</small></span>`;
  }
  function backContent() {
    return '<span class="independent-model-back-icon" aria-hidden="true"><svg viewBox="0 0 72 52" focusable="false"><path class="back-arrow-primary" d="M70 4 28 26 70 48z"/><path class="back-arrow-separator" d="M48 0 0 26l48 26V39L24 26l24-13z"/><path class="back-arrow-secondary" d="M44 4 4 26l40 22V38L22 26l22-12z"/></svg></span><span class="independent-model-back-label"><span>返回</span><span>主页</span></span>';
  }
  const speedButtons = new WeakMap();
  function syncSelectSpeed(select) {
    setControl(speedButtons.get(select), 'speed', select.value);
  }
  function adaptSpeedSelect(select) {
    if (speedButtons.has(select)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'control-button';
    button.dataset.action = 'speed';
    select.parentElement.dataset.shellSpeedSource = '';
    select.parentElement.insertAdjacentElement('afterend', button);
    speedButtons.set(select, button);
    select.addEventListener('change', () => syncSelectSpeed(select));
    button.addEventListener('click', () => {
      const options = [...select.options].filter(option => !option.disabled);
      const index = options.findIndex(option => option.value === select.value);
      select.value = options[(index + 1) % options.length].value;
      select.dispatchEvent(new Event('change', {bubbles: true}));
    });
    syncSelectSpeed(select);
  }
  function refreshFullscreen() {
    document.querySelectorAll('.control-dock [data-action="fullscreen"]').forEach(button => setControl(button, 'fullscreen', '全屏'));
  }
  function mount(manifest) {
    const app = document.querySelector('.independent-model-app');
    if (!app || app.dataset.shellMounted === STANDARD) return;
    app.dataset.shellMounted = STANDARD;
    const header = app.querySelector('.independent-model-header');
    const back = header?.querySelector('.independent-model-back');
    if (back) back.innerHTML = backContent();
    const kicker = header?.querySelector('.independent-model-kicker');
    if (kicker) kicker.textContent = `${manifest.module.zh} / ${manifest.module.en}`;
    const title = header?.querySelector('h1');
    if (title) {
      title.innerHTML = `<span class="shell-model-title">${escape(manifest.title.zh)}</span><small>/ ${escape(manifest.title.en)}</small>`;
      title.title = `${manifest.title.zh} / ${manifest.title.en}`;
    }
    const dock = app.querySelector('.control-dock');
    const view = dock?.querySelector('.control-group-view');
    const end = dock?.querySelector('.control-group-end');
    if (view && end) { view.append(...end.children); end.remove(); }
    dock?.querySelectorAll('select').forEach(adaptSpeedSelect);
    const timeline = dock?.querySelector('input[type="range"]');
    if (timeline) dock.dataset.shellTimeline = '';
    dock?.querySelectorAll('button').forEach(button => {
      const action = button.dataset.action;
      if (action) setControl(button, action, button.textContent);
    });
    app.querySelectorAll('.stage-strip button').forEach(button => {
      const zh = button.querySelector('.shell-stage-titles strong')?.textContent;
      const en = button.querySelector('.shell-stage-titles small')?.textContent;
      if (zh) button.title = `${zh}${en ? ' / ' + en : ''}`;
    });
    dock?.addEventListener('click', event => {
      if (event.target.closest('[data-action="fullscreen"]')) requestAnimationFrame(refreshFullscreen);
    });
  }
  function register(manifest) {
    document.body.dataset.modelShell = STANDARD;
    const run = () => mount(manifest);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
    else queueMicrotask(run);
  }
  document.addEventListener('fullscreenchange', refreshFullscreen);
  window.addEventListener('resize', () => { activeStageKey = null; syncActiveStage(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') requestAnimationFrame(refreshFullscreen);
  });
  globalThis.AnderModelShell = Object.freeze({STANDARD, register, controlContent, setControl, stageContent, backContent, syncSelectSpeed, syncActiveStage});
})();

/* Candidate experience API. Keeps scientific state in the model controller. */
(() => {
  'use strict';
  const base = globalThis.AnderModelShell;
  const icons = {
    bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    tools: '<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="17" r="2"/>',
    settings: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/><circle cx="12" cy="12" r="5"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
    stages: '<path d="m7 10 5 5 5-5"/>',
    concentrate: '<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4M9 9h6v6H9Z"/>',
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const extraSignatures = new WeakMap();
  function setExtra(button, kind, label) {
    const html = `<svg class="shell-control-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[kind] || icons.help}</svg><span class="shell-control-label">${escape(label)}</span>`;
    // DOM serialization expands SVG tags, so comparing innerHTML to the source
    // string would replace otherwise identical pointer targets on every update.
    if (extraSignatures.get(button) !== html) {button.innerHTML = html;extraSignatures.set(button,html);}
    button.setAttribute('aria-label', label);
  }
  function mountExperience(options) {
    const {root, host = null, title, onReturn, helpContent, loginDescription} = options;
    if (root.__shellExperience) return root.__shellExperience;
    const abort = new AbortController(), {signal} = abort;
    const listen = (el, type, fn, options = {}) => el.addEventListener(type, fn, {...options, signal});
    const favorite = root.querySelector('[data-shell-favorite]');
    const full = root.querySelector('[data-action="fullscreen"]');
    const view = root.querySelector('.control-group-view');
    const dock = root.querySelector('.control-dock');
    const header = document.querySelector('.independent-model-header');
    const strip = root.querySelector('.stage-strip');
    let compact = false, focusRequested = false, focusActive = false;
    let immersiveActive=false, chromeVisible=true, hideTimer, stageFitFrame=0, stageSignature='', inlineStages=false;
    let keyboardHold=false, keyboardMode=false, mouseOverChrome=false;
    const activePointers=new Set(), activeTouches=new Set();
    let generation = 0, destroyed = false, toastTimer, dialogRestore, dialogTrigger;
    let state = {status: 'loading', favorite: null, contextRevision: null};
    const identity = document.createElement('div');
    identity.className = 'shell-identity';
    identity.innerHTML = `<button type="button" class="shell-compact-back" aria-label="返回预览目录"></button><strong>${escape(title)}</strong><button type="button" class="shell-stage-picker" aria-haspopup="dialog"></button><span class="shell-display-mode">全屏</span><button type="button" class="shell-icon-button" data-identity-settings aria-label="预览设置"></button>`;
    root.prepend(identity);
    const stageHome=document.createComment('shell-stage-home');strip.before(stageHome);
    const stageSlot=document.createElement('div');stageSlot.className='shell-inline-stages';stageSlot.hidden=true;
    identity.querySelector('.shell-stage-picker').before(stageSlot);
    const stageMeasure=document.createElement('span');stageMeasure.className='shell-stage-measure';stageMeasure.setAttribute('aria-hidden','true');root.append(stageMeasure);
    root.tabIndex=-1;
    setExtra(identity.querySelector('.shell-compact-back'), 'back', options.returnLabel || '返回目录');
    setExtra(identity.querySelector('[data-identity-settings]'), 'settings', options.settingsLabel || '预览设置');
    listen(identity.querySelector('[data-identity-settings]'), 'click', e => options.onSettings?.(e.currentTarget));
    listen(identity.querySelector('.shell-compact-back'), 'click', async () => {
      if(document.fullscreenElement===root)await document.exitFullscreen();
      root.classList.remove('is-css-fullscreen');syncFullscreen();
      onReturn?.(header?.querySelector('.independent-model-back'));
    });
    const toast = document.createElement('div');
    toast.className = 'shell-toast'; toast.hidden = true;
    toast.innerHTML = '<span role="status" aria-live="polite" aria-atomic="true"></span><button type="button" hidden></button><button type="button" class="toast-close" aria-label="关闭提示">×</button>';
    root.append(toast);
    const dialog = document.createElement('dialog');
    dialog.className = 'shell-dialog'; dialog.setAttribute('aria-labelledby', 'shell-dialog-title');
    dialog.innerHTML = '<div class="shell-dialog-heading"><h2 id="shell-dialog-title"></h2><button type="button" class="shell-icon-button" aria-label="关闭面板"></button></div><div class="shell-dialog-body"></div><div class="shell-dialog-actions"></div>';
    root.append(dialog);
    setExtra(dialog.querySelector('.shell-icon-button'), 'close', '关闭面板');
    const closeDialog = () => { if (dialog.open) dialog.close(); dialogRestore?.(); dialogRestore=null; scheduleStageFit(); scheduleHide(); };
    listen(dialog.querySelector('.shell-icon-button'), 'click', closeDialog);
    listen(dialog, 'close', () => { if(dialog.open)return;dialogRestore?.(); dialogRestore = null; const target=dialogTrigger?.getClientRects().length&&!dialogTrigger.closest('[inert]')?dialogTrigger:full;target?.focus({preventScroll: true});scheduleStageFit();scheduleHide(); });
    listen(dialog, 'keydown', e => {
      if(e.key!=='Tab')return;
      const items=[...dialog.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length&&!el.closest('[inert]'));
      const first=items[0],last=items.at(-1);
      if(first&&((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last))){e.preventDefault();(e.shiftKey?last:first).focus();}
    });
    listen(dialog, 'click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(); } });
    listen(toast.querySelector('.toast-close'), 'click', () => { toast.hidden=true; clearTimeout(toastTimer);scheduleHide(); });
    function notify(message, actionLabel, action) {
      clearTimeout(toastTimer);
      toast.hidden=false;
      toast.querySelector('[role="status"]').textContent=message;
      const button=toast.querySelector('button'); button.hidden=!actionLabel; button.textContent=actionLabel || ''; button.onclick=action || null;
      if(actionLabel){showChrome();clearTimeout(hideTimer);}
      else toastTimer=setTimeout(()=>{toast.hidden=true;},immersiveActive?2000:6500);
    }
    function showDialog(heading, content, trigger, actions=[]) {
      showChrome();clearTimeout(hideTimer);
      if(dialog.open) { closeDialog(); dialogRestore?.(); dialogRestore=null; }
      dialogTrigger=trigger || document.activeElement;
      dialog.querySelector('h2').textContent=heading;
      const body=dialog.querySelector('.shell-dialog-body'); body.replaceChildren();
      if(typeof content==='string')body.innerHTML=content; else body.append(content);
      const area=dialog.querySelector('.shell-dialog-actions');area.replaceChildren();
      for(const item of actions){const b=document.createElement('button');b.type='button';b.className=`shell-action${item.primary?' is-primary':''}`;b.textContent=item.label;listen(b,'click',()=>item.run(b));area.append(b);}
      dialog.showModal();
    }
    function showPanel(element, heading, trigger) {
      closeDialog();
      const marker=document.createComment('shell-panel-home');element.before(marker);
      showDialog(heading,element,trigger);
      dialogRestore=()=>{marker.replaceWith(element);};
    }
    const picker=identity.querySelector('.shell-stage-picker');
    function syncStage(){
      const buttons=[...strip.querySelectorAll('.stage-tab')];
      const active=buttons.find(b=>b.classList.contains('is-active')) || buttons[0];
      const index=Math.max(0,buttons.indexOf(active));
      const label=active?.querySelector('strong')?.textContent || '观察阶段';
      setExtra(picker,'stages',`${index+1}/${buttons.length || 1} ${label}`);
      picker.setAttribute('aria-label',`选择阶段，当前 ${index+1}/${buttons.length || 1} ${label}`);
      const signature=buttons.map(b=>b.querySelector('strong')?.textContent).join('|');
      if(signature!==stageSignature){stageSignature=signature;scheduleStageFit();}
    }
    function scheduleStageFit(){if(stageFitFrame||destroyed)return;stageFitFrame=requestAnimationFrame(()=>{stageFitFrame=0;layoutStages();});}
    function layoutStages(){
      if(dialog.contains(strip))return;
      const buttons=[...strip.querySelectorAll('.stage-tab')];
      const eligible=(compact||immersiveActive)&&!focusActive&&root.clientWidth>root.clientHeight*1.1&&buttons.length>0&&buttons.length<=5;
      let fits=false;
      if(eligible){
        let needed=Math.max(0,buttons.length-1)*4;
        buttons.forEach((button,index)=>{stageMeasure.textContent=`${index+1} ${button.querySelector('strong')?.textContent || ''}`;needed+=Math.max(64,Math.ceil(stageMeasure.getBoundingClientRect().width)+22);});
        const css=getComputedStyle(identity),gap=parseFloat(css.columnGap)||0;
        const backWidth=identity.querySelector('.shell-compact-back').getBoundingClientRect().width;
        const titleWidth=identity.querySelector('strong').getBoundingClientRect().width;
        const settingsWidth=identity.querySelector('[data-identity-settings]').getBoundingClientRect().width;
        const available=identity.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight)-backWidth-titleWidth-settingsWidth-gap*3;
        fits=needed+8<=available;
      }
      inlineStages=fits;root.dataset.inlineStages=String(fits);stageSlot.hidden=!fits;picker.hidden=fits;
      if(fits){if(strip.parentElement!==stageSlot)stageSlot.append(strip);}
      else if(strip.parentElement!==root)stageHome.after(strip);
      base.syncActiveStage(true);
    }
    listen(picker,'click',()=>showPanel(strip,'选择观察阶段',picker));
    listen(strip,'click',e=>{if(e.target.closest('.stage-tab')&&!e.target.closest('button').disabled&&dialog.contains(strip))closeDialog();});
    function renderFavorite() {
      const {status}=state;
      const label=status==='loading'?'读取中':status==='pending'?'保存中':status==='unknown'?'待确认':state.favorite===true?'已收藏':'收藏';
      setExtra(favorite,'bookmark',label);
      favorite.disabled=status==='pending'||status==='loading';
      favorite.setAttribute('aria-busy',String(favorite.disabled));
      if(typeof state.favorite==='boolean'&&!['anonymous','unknown','unavailable','loading'].includes(status))favorite.setAttribute('aria-pressed',String(state.favorite));else favorite.removeAttribute('aria-pressed');
      favorite.dataset.status=status;
      if(status==='ready'&&state.favorite)favorite.setAttribute('aria-label','已收藏，点击取消收藏');
      if(status==='unknown')favorite.setAttribute('aria-label','收藏结果待确认，点击核对');
      if(status==='pending'){showChrome();clearTimeout(hideTimer);}else scheduleHide();
    }
    async function refreshFavorite(keepKnownState=false) {
      const token=++generation;
      // Focusing an iframe can occur between pointerdown and click. A background
      // recheck must not replace/disable an already readable favorite button.
      if(!(keepKnownState===true&&host&&['ready','anonymous'].includes(state.status))){
        state={status:host?'loading':'unavailable',favorite:null,contextRevision:null};renderFavorite();
      }
      if(!host)return;
      try {
        const result=await deadline(host.getFavorite(),8000);
        if(token!==generation||destroyed)return;
        state={status:result.status,favorite:typeof result.favorite==='boolean'?result.favorite:null,contextRevision:result.contextRevision};
      } catch(error) {if(token!==generation||destroyed)return;state={status:'unknown',favorite:null,contextRevision:null};notify('暂时无法读取收藏状态。','重新读取',refreshFavorite);}
      renderFavorite();
    }
    async function deadline(promise,ms) {
      let timer;
      try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error('unknown'),{code:'UNKNOWN'})),ms);})]);}finally{clearTimeout(timer);}
    }
    async function toggleFavorite() {
      if(['pending','loading'].includes(state.status))return;
      if(state.status==='unavailable'){notify('独立预览尚未连接收藏服务。');return;}
      if(state.status==='unknown'){await refreshFavorite();if(state.status==='ready')notify(state.favorite?'已核对：当前已收藏。':'已核对：当前未收藏。');return;}
      if(state.status==='anonymous'){
        showDialog('登录后收藏',`<p>${escape(loginDescription || '登录后可在学习中心找到收藏，当前学习现场会保留。')}</p>`,favorite,[{label:'暂不登录',run:closeDialog},{label:options.loginLabel||'前往登录',primary:true,run:async b=>{b.disabled=true;try{await host.requestLogin();closeDialog();await refreshFavorite();notify('登录状态已更新，请再次点击收藏。');}catch{b.disabled=false;notify('暂时无法打开登录入口，请稍后重试。');}}}]);return;
      }
      const previous=state.favorite,revision=state.contextRevision,token=++generation;
      state={...state,status:'pending'};renderFavorite();
      try {
        const result=await deadline(host.setFavorite(!previous,{contextRevision:revision}),8000);
        if(token!==generation||destroyed)return;
        if(result.contextRevision!==revision){await refreshFavorite();return;}
        state={status:'ready',favorite:result.favorite,contextRevision:revision};renderFavorite();notify(result.favorite?'已加入收藏。':'已取消收藏。');
      }catch(error){
        if(token!==generation||destroyed)return;
        if(error.code==='AUTH_CHANGED'){await refreshFavorite();return;}
        state={favorite:previous,contextRevision:revision,status:error.code==='REJECTED'?'ready':'unknown'};renderFavorite();
        notify(error.code==='REJECTED'?'收藏未保存，已保留原状态。':'结果暂未确认，请核对后再操作。',error.code==='REJECTED'?'重试':'核对结果',toggleFavorite);
      }
    }
    function syncFullscreen() {
      const native=document.fullscreenElement===root,immersive=root.classList.contains('is-css-fullscreen');
      root.dataset.display=native?'fullscreen':immersive?'immersive':'normal';
      identity.querySelector('.shell-display-mode').textContent=native?'全屏':'沉浸';
      base.setControl(full,'fullscreen','全屏',native||immersive);
      if(immersive){const label=full.querySelector('.shell-control-label');label.textContent='退出沉浸';full.setAttribute('aria-label','退出沉浸');}
      if(header){header.inert=native||immersive||compact;if(header.inert)header.setAttribute('aria-hidden','true');else header.removeAttribute('aria-hidden');}
      setImmersive(native||immersive);
      base.syncActiveStage();
    }
    async function toggleFullscreen() {
      if(document.fullscreenElement===root){await document.exitFullscreen();return;}
      if(root.classList.contains('is-css-fullscreen')){root.classList.remove('is-css-fullscreen');syncFullscreen();return;}
      try {if(!root.requestFullscreen||!document.fullscreenEnabled)throw Error('unsupported');await root.requestFullscreen();}
      catch {root.classList.add('is-css-fullscreen');syncFullscreen();}
    }
    listen(favorite,'click',toggleFavorite);
    listen(full,'click',toggleFullscreen);
    listen(document,'fullscreenchange',syncFullscreen);
    listen(document,'keydown',e=>{if(e.key==='Escape'&&!dialog.open&&root.classList.contains('is-css-fullscreen')){root.classList.remove('is-css-fullscreen');syncFullscreen();}});
    const tools=root.querySelector('[data-shell-tools]');setExtra(tools,'tools','观察');
    const help=root.querySelector('[data-shell-help]');setExtra(help,'help','帮助');help.setAttribute('aria-label','操作说明');
    listen(help,'click',()=>showDialog('操作说明',helpContent,help));
    const focusButton=document.createElement('button');focusButton.type='button';focusButton.className='control-button';focusButton.dataset.shellFocus='';
    favorite.before(focusButton);
    const rail=document.createElement('nav');rail.className='shell-focus-rail';rail.setAttribute('aria-label','专注观察控制');root.append(rail);
    const railNodes=[root.querySelector('[data-action="play"]'),tools,favorite,focusButton,full];
    const homes=railNodes.filter(Boolean).map(node=>{const marker=document.createComment('shell-focus-home');node.before(marker);return {node,marker};});
    function applyFocus(){
      const next=compact&&focusRequested&&!immersiveActive;
      if(next!==focusActive){closeDialog();for(const {node,marker} of homes){if(next)rail.append(node);else marker.after(node);}}
      focusActive=next;root.dataset.focus=String(next);
      setExtra(focusButton,'concentrate',next?'展开':'专注');
      focusButton.setAttribute('aria-label',next?'退出专注观察':'专注观察');
      focusButton.setAttribute('aria-pressed',String(next));
      scheduleStageFit();
    }
    listen(focusButton,'click',()=>{focusRequested=!focusActive;applyFocus();});
    function showTools(){
      closeDialog();
      const content=document.createElement('div');content.className='shell-tools-panel';
      const nodes=[view];
      if(compact)nodes.push(root.querySelector('[data-action="reset"]'),help);
      if(focusActive)nodes.push(root.querySelector('[data-action="prev"]'),root.querySelector('[data-action="next"]'),root.querySelector('.timeline-wrap'));
      const slots=nodes.filter(Boolean).map(node=>{const marker=document.createComment('shell-tool-home');node.before(marker);content.append(node);return {node,marker};});
      if(options.onContext&&options.hasContext?.()!==false){const button=document.createElement('button');button.className='shell-action';button.textContent=options.contextLabel || '对象与参数';button.type='button';listen(button,'click',()=>options.onContext(tools));content.append(button);}
      if(compact){const button=document.createElement('button');button.className='shell-action';button.textContent=options.settingsLabel || '预览设置';button.type='button';listen(button,'click',()=>options.onSettings?.(tools));content.append(button);}
      showDialog('观察工具',content,tools);
      dialogRestore=()=>{for(const {node,marker} of slots)marker.replaceWith(node);};
    }
    listen(tools,'click',showTools);
    function chromeContains(node){return node&&(identity.contains(node)||dock.contains(node));}
    function showChrome(){
      clearTimeout(hideTimer);chromeVisible=true;root.dataset.chrome='visible';
      identity.inert=false;dock.inert=false;identity.removeAttribute('aria-hidden');dock.removeAttribute('aria-hidden');
    }
    function hideChrome(){
      if(!immersiveActive||activePointers.size||activeTouches.size||dialog.open||keyboardHold||mouseOverChrome||state.status==='pending'||(!toast.hidden&&!toast.querySelector('button').hidden))return;
      if(chromeContains(document.activeElement))root.focus({preventScroll:true});
      chromeVisible=false;root.dataset.chrome='hidden';identity.inert=true;dock.inert=true;identity.setAttribute('aria-hidden','true');dock.setAttribute('aria-hidden','true');
    }
    function scheduleHide(){clearTimeout(hideTimer);if(!destroyed&&immersiveActive&&chromeVisible&&!activePointers.size&&!activeTouches.size&&!dialog.open&&!keyboardHold&&!mouseOverChrome&&state.status!=='pending')hideTimer=setTimeout(hideChrome,2000);}
    function setImmersive(next){
      if(next===immersiveActive)return;
      closeDialog();immersiveActive=next;root.dataset.immersive=String(next);keyboardHold=false;mouseOverChrome=false;
      applyFocus();showChrome();scheduleStageFit();
      options.onDisplayChange?.({immersive:next});
      if(next){notify('轻触画面显示控制，松手 2 秒后收起。');scheduleHide();}
    }
    listen(root,'pointerdown',e=>{if(!immersiveActive)return;activePointers.add(e.pointerId);keyboardMode=false;keyboardHold=false;mouseOverChrome=e.pointerType==='mouse'&&chromeContains(e.target);showChrome();});
    listen(window,'pointerup',e=>{activePointers.delete(e.pointerId);scheduleHide();});
    listen(window,'pointercancel',e=>{activePointers.delete(e.pointerId);scheduleHide();});
    // Native panning sends pointercancel while the finger is still down.
    // Keep touch lifetime separate so the two-second delay starts on release.
    listen(root,'touchstart',e=>{if(!immersiveActive)return;for(const touch of e.changedTouches)activeTouches.add(touch.identifier);showChrome();},{passive:true});
    const endTouch=e=>{for(const touch of e.changedTouches)activeTouches.delete(touch.identifier);scheduleHide();};
    listen(window,'touchend',endTouch,{passive:true});
    listen(window,'touchcancel',endTouch,{passive:true});
    listen(root,'pointermove',e=>{if(!immersiveActive||e.pointerType==='touch')return;mouseOverChrome=chromeContains(e.target);showChrome();scheduleHide();});
    listen(root,'pointerleave',e=>{if(e.pointerType!=='touch'){mouseOverChrome=false;scheduleHide();}});
    listen(root,'focusin',e=>{if(immersiveActive&&keyboardMode&&chromeContains(e.target)){keyboardHold=true;showChrome();}});
    listen(root,'focusout',e=>{if(chromeContains(e.relatedTarget)||dialog.contains(e.relatedTarget))return;queueMicrotask(()=>{if(!dialog.open&&!chromeContains(document.activeElement)){keyboardHold=false;scheduleHide();}});});
    listen(document,'keydown',e=>{if(!immersiveActive||e.key==='Escape')return;keyboardMode=true;showChrome();if(e.key==='Tab'||chromeContains(document.activeElement))keyboardHold=true;scheduleHide();});
    listen(window,'blur',()=>{activePointers.clear();activeTouches.clear();mouseOverChrome=false;keyboardMode=false;keyboardHold=false;scheduleHide();});
    function syncLayout(){
      const vv=window.visualViewport;
      const height=vv&&Math.abs(vv.scale-1)<.02?Math.min(innerHeight,vv.height):innerHeight;
      const next=innerWidth>=560&&innerWidth>height*1.35&&height<=520&&(innerWidth<=1024||matchMedia('(pointer:coarse)').matches);
      if(next!==compact){closeDialog();compact=next;}
      document.body.dataset.shellCompact=String(compact);
      document.body.style.setProperty('--shell-viewport-height',`${height}px`);
      applyFocus();syncFullscreen();syncStage();
      scheduleStageFit();
    }
    listen(window,'resize',syncLayout);
    if(window.visualViewport)listen(window.visualViewport,'resize',syncLayout);
    const resize=new ResizeObserver(()=>{root.style.setProperty('--shell-dock-height',`${dock.getBoundingClientRect().height}px`);scheduleStageFit();});resize.observe(dock);resize.observe(identity);
    const surface=options.viewport || root.querySelector('.model-stage');
    const feedback=document.createElement('div');feedback.className='shell-scene-feedback';feedback.hidden=true;
    feedback.innerHTML='<div class="shell-feedback-content" role="status" aria-live="polite"><span class="feedback-symbol" aria-hidden="true"></span><strong></strong><p></p><button type="button" class="shell-action" hidden>重新加载</button></div>';
    surface.append(feedback);
    function setSceneStatus(status,message,onRetry){feedback.hidden=status==='ready';feedback.dataset.status=status;feedback.querySelector('strong').textContent=status==='loading'?'正在准备画面':'画面暂未加载成功';feedback.querySelector('p').textContent=message || (status==='loading'?'请稍候，画面就绪后即可操作。':'请重试，当前观察设置会保留。');const retry=feedback.querySelector('button');retry.hidden=status!=='error';retry.onclick=onRetry || null;}
    const unsubscribe=host?.subscribe?.(()=>{notify('登录状态已变化，正在更新收藏。');refreshFavorite();});
    listen(window,'focus',()=>{if(state.status!=='pending'&&!dialog.open)refreshFavorite(true);});
    refreshFavorite();syncLayout();
    const api={showDialog,showPanel,closeDialog,notify,refreshFavorite,setExtra,setSceneStatus,syncStage,getState:()=>({...state,display:root.dataset.display,compact,focus:focusActive,immersive:immersiveActive,chromeVisible,inlineStages}),destroy(){destroyed=true;++generation;closeDialog();focusRequested=false;applyFocus();showChrome();abort.abort();unsubscribe?.();resize.disconnect();clearTimeout(toastTimer);clearTimeout(hideTimer);cancelAnimationFrame(stageFitFrame);for(const {marker} of homes)marker.remove();stageHome.after(strip);stageHome.remove();stageMeasure.remove();focusButton.remove();rail.remove();dialog.remove();toast.remove();identity.remove();feedback.remove();root.classList.remove('is-css-fullscreen');delete root.dataset.immersive;delete document.body.dataset.shellCompact;if(header){header.inert=false;header.removeAttribute('aria-hidden');}delete root.__shellExperience;}};
    root.__shellExperience=api;return api;
  }
  globalThis.AnderModelShell=Object.freeze({...base,mountExperience,setExtra});
})();
