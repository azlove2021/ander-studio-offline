import {createProductView} from './scene-view.js';
export function mountProductExperience({manifest,getState,onReturn,post}){
 const shell=AnderModelShell,root=document.querySelector('.model-area'),viewport=document.querySelector('.scene-viewport');
 const view=createProductView(viewport,document.querySelector('.pcr-scene-plane'),document.querySelector('#scene'));
 let experience,lastDisplay='normal';
 const help='<p>总进度和阶段按钮控制原来的同一段过程；“轮次与统计”中可以设置轮次、定位过程或查看计数规则。</p><p>默认完整显示所有产物。双指捏合或在“观察”中放大细节，放大后拖动画面；点“回到全图”恢复总览。键盘可用＋／－缩放，方向键平移，Home恢复全图。</p><p>第七轮起主图保留第六轮末64个DNA，实际产物数量继续更新。分组顺序供观察，实际各组也可并行合成。</p><p>全屏轻触唤出操作栏，最后松手约两秒后收起；统计是当前结果，保持可见。收藏由可选宿主提供。</p>';
 const context=trigger=>experience.showPanel(document.querySelector('.products-information'),'轮次与统计',trigger);
 const settings=trigger=>experience.showDialog('显示与操作',help,trigger,[{label:'恢复完整总览',run:()=>{view.fit();experience.closeDialog();}}]);
 const back=()=>{if(parent!==window)onReturn();else if(new URLSearchParams(location.search).has('return')){const url=new URL(new URLSearchParams(location.search).get('return'),location.href);if(['http:','https:'].includes(url.protocol))location.href=url.href;}else experience.showDialog('独立模型预览','<p>当前独立打开PCR产物类型模型，关闭此标签页可返回之前的页面。</p>',document.activeElement);};
 experience=shell.mountExperience({root,viewport,title:'PCR产物类型',returnLabel:'返回目录',onReturn:back,host:globalThis.AnderModelHost?.modelId===manifest.id?globalThis.AnderModelHost:null,settingsLabel:'显示与操作',contextLabel:'轮次与统计',onSettings:settings,onContext:context,hasContext:()=>true,helpContent:help,onDisplayChange:()=>{view.resize();const display=root.dataset.display;if(display!==lastDisplay){lastDisplay=display;post('model:request-fullscreen',{active:display!=='normal'});}}});
 shell.setExtra(document.querySelector('[data-products-settings]'),'settings','显示与操作');
 document.querySelector('[data-products-settings]').addEventListener('click',e=>settings(e.currentTarget));
 document.querySelector('[data-products-context]').addEventListener('click',e=>context(e.currentTarget));
 document.querySelector('.independent-model-back').addEventListener('click',e=>{e.preventDefault();back();});
 for(const button of document.querySelectorAll('[data-products-view]'))button.addEventListener('click',()=>{view[button.dataset.productsView]();experience.closeDialog();});
 const ready=()=>experience.setSceneStatus('ready');if(document.readyState==='complete')ready();else window.addEventListener('load',ready,{once:true});
 globalThis.PCRProductsSample=Object.freeze({version:manifest.version,getState:()=>({...getState(),displayView:view.getState(),shell:experience.getState()})});
 return {...experience,view};
}
