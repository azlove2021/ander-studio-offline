"use strict";
(() => {
  const U=window.AnderCommunityUI,{el,link}=U;
  const states={draft:"草稿",checking:"正在检查",pending:"待人工处理",approved:"审核通过",returned:"退回修改",withdrawn:"已撤回",removed:"已下架"};
  const issueKinds={content:"内容复核",format:"格式异常",security:"安全检查异常",processing:"处理异常"};
  let dirty=false, editorActive=false;
  const imageGalleries=new Set();
  const button=(label,fn,primary=false)=>{const b=el("button",label,"lc-button"+(primary?" lc-primary":""));b.type="button";b.onclick=fn;return b;};
  function field(label,name,value,{type="input",options,rows=4,max=300,required=false}={}) {
    const wrap=el("label",null,"lc-field"),input=el(type);wrap.append(el("span",label));input.name=name;input.value=value||"";input.required=required;
    if(type==="select") for(const entry of options){const [v,t]=Array.isArray(entry)?entry:[entry,entry],o=el("option",t);o.value=v;input.append(o);} 
    if(type==="select")input.value=value;else input.maxLength=max;
    if(type==="textarea")input.rows=rows;wrap.append(input);return {wrap,input};
  }
  function checkbox(label,name){const wrap=el("label",null,"lc-check"),input=el("input");input.type="checkbox";input.name=name;wrap.append(input,el("span",label));return {wrap,input};}
  function message(node,text,error=false){node.textContent=text;node.className=error?"lc-operation-message lc-error":"lc-operation-message";node.setAttribute("role",error?"alert":"status");}
  function bytes(size){return size>=1048576?(size/1048576).toFixed(1)+" MiB":Math.max(1,Math.round(size/1024))+" KiB";}
  function processingStatus(item) {
    const box=el("section",null,"lc-processing-evidence"),e=item.processingEvidence;
    if(item.ownerReviewed||item.ownerReview?.needed||item.state==="pending"&&item.checks?.failure){
      box.append(el("p",item.ownerReviewed?"站长已人工审核并决定公开。自动检查的未完成或未通过结果保留，不代表查毒通过。":"自动检查未通过或未完成，已转交站长人工处理。无需为此重复提交，站长可查看原件后决定公开或退回。","lc-note"));
      if(item.reason||item.checks?.summary){const old=el("details");old.append(el("summary","自动处理原记录"));
        if(item.reason)old.append(el("p",item.reason));if(item.checks?.summary&&item.checks.summary!==item.reason)old.append(el("p",item.checks.summary));box.append(old);}return box;
    }
    if(e?.status==="TECHNICAL_COMPLETE_LOCAL"&&e.inputBound===true&&e.coverageComplete===true&&e.simulated===false){
      box.setAttribute("aria-label","本版真实处理结果");
      box.append(el("h3","本版真实处理结果"),el("p","已复核本轮原件、转换页图和内容审核回执，技术检查已完成。仅适用于当前两份固定文件的本地验收副本，不是新的云处理，也不代表生产环境已开放。","lc-muted"));
      box.append(el("p",item.state==="approved"?"本地测试审核员已通过此版本。登录测试账号可受控预览和下载；撤回后旧链接立即失效。":"等待人工审核。当前仅审核员可预览页图；作者及普通账号的预览、原件下载均未开放。","lc-note"));
      return box;
    }
    if(e?.status!=="VERIFIED_HELD"||e.inputBound!==true||e.cloudResultsVerified!==true){
      if(item.checks?.summary&&item.checks.summary!==item.reason)box.append(el("p",item.checks.summary,"lc-note"));
      if(item.reason)box.append(el("p",item.reason,"lc-note"));return box;
    }
    box.setAttribute("aria-label","本版真实处理结果");
    box.append(el("h3","本版真实处理结果"),el("p","已核对后续云回执，且与当前稿件和附件一致。以下是本轮已授权范围的结果，不代表整份资料已审核通过。","lc-muted"));
    const list=el("ul",null,"lc-processing-stages"),labels={preflight:"身份与配置核对",storage:"私有存储",virus:"文件查毒",conversion:"文档转换",contentReview:"指定内容审核"},statuses={complete:"已核对",pending:"待完成",held:"保留待核对",failed:"未通过",not_started:"未开始"};
    for(const [key,label]of Object.entries(labels)){
      const stage=e.stages?.[key],row=el("li");row.append(el("span",label),el("strong",statuses[stage?.status]||"待核对"));list.append(row);
    }
    const reviewerPreview=e.previewAvailable===true&&e.previewAudience==="reviewer-only";
    box.append(list,el("p",`本版已核对 ${e.reviewedPageImages} 张页图和 ${e.reviewedTextUnits} 个指定文本单元。`,"lc-muted"),el("p",reviewerPreview?"仅本地测试审核员可查看下方已核对页图，用于继续审核。原件完整覆盖与人工审核尚未完成；发布、普通用户预览及原件下载仍未开放。":"尚未完成：原件内容的完整覆盖确认、人工审核与受控访问验收。资料继续保持私有，本账号的预览、下载及发布均未开放。","lc-note"));
    if(item.reason||item.checks?.summary){const history=el("details");history.append(el("summary","查看最初处理记录（保留，不覆盖）"));
      if(item.reason)history.append(el("p",item.reason));if(item.checks?.summary&&item.checks.summary!==item.reason)history.append(el("p",item.checks.summary));box.append(history);}
    return box;
  }
  function attachments(item,{token,admin=false}={}) {
    const block=el("section",null,"lc-attachments"),write=U.writer(token,admin),viewer=el("section",null,"lc-document-viewer"),status=el("p",null,"lc-operation-message");
    block.append(el("h2",item.kind==="discussion"?"配图":"资料附件"));let viewRun=0;
    for(const f of item.files||[]) {
      const canPreview=f.previewAvailable===true,canDownload=f.downloadAvailable===true;
      const fileDetail=admin?(f.ownerReviewed?" · 站长人工决定公开":f.reviewerOriginal?" · 原件供站长核对":f.pages?` · ${f.pages} 页`:item.processingEvidence?" · 尚未开放预览":" · 等待检查"):(f.pages?` · ${f.pages} 页`:"");
      const row=el("div",null,"lc-file-row"),copy=el("div"),actions=el("div",null,"lc-actions");copy.append(el("strong",f.name),el("small",`${f.type.toUpperCase()} · ${bytes(f.size)}${fileDetail}`,"lc-muted"));
      if(admin&&f.ownerReviewed)copy.append(el("small",f.detectedRisk?"自动安全检查曾检出风险，站长确认后公开原件。":"自动检查未完成或未通过，站长核对后公开原件。","lc-note"));
      if(f.reviewedDownload)copy.append(el("small",admin?"下载内容为已检查的页面图像 PDF，原件私有保留。":"提供 PDF 副本下载。","lc-muted"));
      async function ticket(purpose,page){return write(`/api/community${admin?"-admin":""}/files/${f.id}/tickets`,{itemId:item.id,revision:item.revision,purpose,...(page?{page}:{})});}
      async function show(page=1) {
        const run=++viewRun;message(status,"正在载入第 "+page+" 页…");
        try {
          const result=await ticket("preview",page);if(!block.isConnected||run!==viewRun)return;
          const toolbar=el("div",null,"lc-viewer-toolbar"),prev=button("上一页",()=>show(page-1)),next=button("下一页",()=>show(page+1)),canvas=el("div",null,"lc-page-canvas");prev.disabled=page===1;next.disabled=page===f.pages;
          canvas.tabIndex=0;canvas.setAttribute("aria-label","文档页面，放大后可滚动阅读");
          const zoom=button("放大阅读",()=>{const expanded=canvas.classList.toggle("is-zoomed");zoom.textContent=expanded?"适应宽度":"放大阅读";zoom.setAttribute("aria-pressed",String(expanded));});zoom.setAttribute("aria-pressed","false");
          toolbar.append(el("strong",f.name),prev,el("span",`${page} / ${f.pages}`,"lc-page-number"),next,zoom,button("收起预览",()=>{viewRun++;viewer.replaceChildren();message(status,"");}));
          const image=el("img");image.alt=f.name+"，第 "+page+" 页";image.className="lc-document-page";
          image.onload=()=>{if(run===viewRun)message(status,"");};image.onerror=()=>{if(run===viewRun){viewer.replaceChildren();message(status,"预览链接已失效，请重新打开资料。",true);}};image.src=result.url;
          canvas.append(image);viewer.replaceChildren(toolbar,canvas);viewer.scrollIntoView({block:"nearest",behavior:"smooth"});
        }catch(e){if(block.isConnected&&run===viewRun){viewer.replaceChildren();message(status,e.message,true);}}
      }
      const preview=button(admin&&f.previewKind==="reviewer-evidence"?"审核页图预览":"预览",()=>show()),download=button(f.reviewerOriginal?"下载原件供人工审核":f.reviewedDownload?"下载已审核 PDF":"下载原件",async()=>{
        if(f.detectedRisk&&!confirm("安全检查曾检出风险。是否仍下载这份原件？"))return;
        download.disabled=true;message(status,"正在核对下载权限…");
        try{const result=await ticket("download");if(!block.isConnected)return;const a=link("下载",result.url);a.download=f.reviewedDownload?f.name.replace(/\.[^.]+$/,"")+".pdf":f.name;a.hidden=true;block.append(a);a.click();a.remove();message(status,"下载已交给浏览器处理。资料下架后，旧链接将停止访问。");}catch(e){if(block.isConnected)message(status,e.message,true);}finally{download.disabled=!canDownload;}
      });preview.disabled=!canPreview;download.disabled=!canDownload;actions.append(preview,download);row.append(copy,actions);block.append(row);
    }
    block.append(status,viewer);return block;
  }
  function discussionImages(item,{token}={}) {
    const block=el("section",null,"lc-discussion-images"),write=U.writer(token),states=[];
    block.setAttribute("aria-label","讨论配图");
    let disposed=false,started=false,dialog=null,dialogRun=0;
    const active=()=>!disposed&&block.isConnected;
    function removeImages(node){for(const img of node.querySelectorAll("img")){img.onload=null;img.onerror=null;img.removeAttribute("src");}}
    async function preview(file){return write(`/api/community/files/${file.id}/tickets`,{itemId:item.id,revision:item.revision,purpose:"preview",page:1});}
    function closeImage(){dialogRun++;if(dialog){removeImages(dialog);if(dialog.open)dialog.close();dialog.remove();dialog=null;}}
    async function enlarge(file,label){
      if(!active())return;closeImage();
      const run=++dialogRun,current=dialog=el("dialog",null,"lc-image-dialog"),stage=el("div",null,"lc-image-dialog-stage");
      current.setAttribute("aria-label",label+"，放大查看");
      const close=button("×",closeImage);close.className="lc-image-close";close.setAttribute("aria-label","关闭放大图片");
      stage.append(el("p","正在载入图片…","lc-muted"));current.append(close,stage);block.append(current);
      current.addEventListener("cancel",e=>{e.preventDefault();closeImage();});
      current.addEventListener("click",e=>{if(e.target===current)closeImage();});current.showModal();
      try{
        const result=await preview(file);if(!active()||run!==dialogRun)return;
        const image=el("img");image.alt=label;image.className="lc-image-enlarged";image.hidden=true;stage.append(image);
        image.onload=()=>{if(active()&&run===dialogRun){image.hidden=false;stage.replaceChildren(image);}};
        image.onerror=()=>{if(active()&&run===dialogRun){removeImages(stage);image.removeAttribute("src");stage.replaceChildren(el("p","图片暂时无法显示，请关闭后重试。","lc-note"));}};
        image.src=result.url;
      }catch{if(active()&&run===dialogRun)stage.replaceChildren(el("p","图片暂时无法显示，请关闭后重试。","lc-note"));}
    }
    for(const [index,file] of (item.files||[]).entries()){
      const slot=el("div",null,"lc-discussion-image"),label=`讨论配图 ${index+1}`,state={run:0};states.push(state);block.append(slot);
      async function load(){
        if(!active())return;const run=++state.run;removeImages(slot);slot.replaceChildren(el("p","正在载入配图…","lc-muted"));
        const failed=()=>{if(!active()||run!==state.run)return;removeImages(slot);slot.replaceChildren(el("p","配图暂时无法显示。","lc-muted"),button("重新加载图片",load));};
        try{
          const result=await preview(file);if(!active()||run!==state.run)return;
          const image=el("img");image.alt=label;image.className="lc-discussion-picture";image.decoding="async";image.hidden=true;slot.append(image);
          image.onload=()=>{if(!active()||run!==state.run)return;image.hidden=false;const open=button("",()=>enlarge(file,label));open.className="lc-image-open";open.setAttribute("aria-label","放大查看"+label);open.append(image);slot.replaceChildren(open);};
          image.onerror=()=>{image.removeAttribute("src");failed();};image.src=result.url;
        }catch{failed();}
      }
      state.load=file.previewAvailable===true?load:()=>{
        slot.replaceChildren(el("p","配图暂不可查看。","lc-muted"));
        if(file.ownerReviewed&&file.downloadAvailable){const download=button("下载原图",async()=>{
          if(file.detectedRisk&&!confirm("安全检查曾检出风险，是否仍下载原图？"))return;
          download.disabled=true;try{const result=await write(`/api/community/files/${file.id}/tickets`,{itemId:item.id,revision:item.revision,purpose:"download"});
            if(!active())return;const a=link("下载",result.url);a.download=file.name;a.hidden=true;slot.append(a);a.click();a.remove();
          }catch(e){if(active())slot.append(el("p",e.message,"lc-note"));}finally{download.disabled=false;}
        });slot.append(download);}
      };
    }
    const gallery={block,start(){if(started||!active())return;started=true;for(const state of states)state.load();},dispose(){disposed=true;for(const state of states)state.run++;closeImage();removeImages(block);block.replaceChildren();}};
    imageGalleries.add(gallery);return block;
  }
  function mountImages(){for(const gallery of imageGalleries)if(gallery.block.isConnected)gallery.start();}
  function otherText(item) {
    const notes=[item.body||""],source={original:"原创自编",authorized:"已取得分享授权"},ai={none:"未使用 AI 生成内容",assisted:"AI 辅助整理，作者已核对",generated:"包含 AI 生成内容，作者已核对"};
    if(source[item.sourceKind])notes.push("分享依据："+source[item.sourceKind]);
    if(item.sourceNote)notes.push("来源及授权说明："+item.sourceNote);
    if(ai[item.aiDeclaration])notes.push("AI 使用说明："+ai[item.aiDeclaration]);
    return notes.filter(Boolean).join("\n\n");
  }
  function otherDetails(item) {
    const text=otherText(item);if(!text)return document.createDocumentFragment();
    const box=el("section",null,"lc-source-note lc-other-details");box.append(el("h3","其他"),el("p",text));return box;
  }
  function reviewIssues(item) {
    if(!Array.isArray(item.reviewIssues)||!item.reviewIssues.length)return null;
    const label=item.ownerReviewed?"自动检查原记录":"本版待处理问题",box=el("section",null,"lc-processing-evidence");box.setAttribute("aria-label",label);box.append(el("h3",label));
    for(const issue of item.reviewIssues){const row=el("p",null,"lc-note");row.append(el("strong",issueKinds[issue.kind]||"待核对问题"),el("span",`${Number.isInteger(issue.filePosition)?` · 附件 ${issue.filePosition}`:""}：${issue.message||"请核对本版处理结果。"}`));box.append(row);}
    return box;
  }
  function contentReviewMode(moderation){return moderation?.policy==="content-manual-review-v1"?moderation.reviewRequired===true?"content":null:moderation?.adsReviewRequired===true?"ads":null;}
  function moderationDetails(item,{token}={}) {
    const moderation=item.moderation;
    const mode=contentReviewMode(moderation);if(moderation?.available!==true||!mode)return null;
    const generic=mode==="content",ready=generic?moderation.reviewReady:moderation.adsAcceptanceReady;
    const box=el("section",null,"lc-processing-evidence");box.setAttribute("aria-label","本版内容提示人工复核");
    box.append(el("h3",item.state==="approved"?"本版内容提示与人工处置":"内容提示待人工复核"),
      el("p","机审原判定保留。请核对下列当前版本提示及对应内容，说明处理理由；可执行的操作以本版审核条件为准。","lc-note"));
    if(ready!==true)box.append(el("p","自动复核证据尚未齐备，可由站长查看原件后使用人工决定。以下机器标记继续保留。","lc-note"));
    const verdict={normal:"正常",review:"待复核",block:"命中拦截"},flags={0:"未命中",1:"命中",2:"待复核"};
    for(const unit of moderation.units||[]){
      if(generic?!["content_manual_review","ads_manual_review"].includes(unit.disposition):unit.disposition!=="ads_manual_review")continue;
      const entry=el("section"),context=moderation.contexts?.find(v=>v.id===unit.id&&v.sha256===unit.sha256),
        file=context?.fileId?item.files.find(f=>f.id===context.fileId):null;
      entry.append(el("h4",`${unit.kind==="text"?"文本":"图片"}单元 ${unit.id}`),
        el("p",`机审原判定：${verdict[unit.decision]||"未知"} · 分类 ${unit.label||"未知"}${unit.label==="Ads"?"（广告）":""}`,"lc-muted"));
      for(const [scope,scenes]of [["总场景",unit.scenes],...(unit.sections||[]).map((s,i)=>[`分段 ${i+1}`,s.scenes])]){
        for(const scene of scenes||[])if(generic?scene.hitFlag!==0:scene.name==="AdsInfo")entry.append(el("p",`${scope} · ${scene.name}：${flags[scene.hitFlag]||"未知"} · Score ${scene.score==null?"未提供":scene.score}`));
      }
      if(unit.kind==="text"&&typeof context?.text==="string")entry.append(el("p",context.text,"lc-body-text"));
      else if(unit.kind==="image"&&context?.fileId){
        const imagePage=context.image?.previewPage;
        if(generic&&Number.isInteger(imagePage)&&imagePage>0&&ready===true){
          const preview=el("div",null,"lc-review-hit-image"),status=el("p",null,"lc-operation-message"),write=U.writer(token,true);let previewRun=0;
          const show=button("查看命中配图",async()=>{const run=++previewRun;show.disabled=true;preview.replaceChildren();message(status,"正在载入命中配图…");
            try{const result=await write(`/api/community-admin/files/${context.fileId}/tickets`,{itemId:item.id,revision:item.revision,purpose:"preview",page:imagePage});if(!entry.isConnected||run!==previewRun)return;
              const image=el("img");image.alt="待复核命中配图";image.className="lc-document-page";image.onload=()=>{if(entry.isConnected&&run===previewRun)message(status,"");};image.onerror=()=>{if(entry.isConnected&&run===previewRun){preview.replaceChildren();message(status,"命中配图暂时无法显示，请重新打开。",true);}};image.src=result.url;preview.append(image);
            }catch{if(entry.isConnected&&run===previewRun)message(status,"命中配图暂时无法显示，请重新打开。",true);}finally{show.disabled=false;}});
          entry.append(el("p",file?.name||"对应附件","lc-note"),show,status,preview);
        }else entry.append(el("p",`${file?.name||"对应附件"}${Number.isInteger(context.page)&&ready===true?` · 第 ${context.page} 页。请打开下方对应的受控页图预览核对。`:" · 当前没有可核验的命中图片预览；不能凭其他附件页图批准。"}`,"lc-note"));
      }
      else entry.append(el("p","当前未取得该单元的正文或附件定位，请刷新核对；不要仅凭分类批准。","lc-note"));
      box.append(entry);
    }
    box.append(el("p","Score 为云端原始解释信息，不是客观概率，也不是人工放行阈值。","lc-muted"));return box;
  }
  async function editor({token,request=U.request}) {
    const params=new URLSearchParams(location.search),kind=params.get("type")||"resource",discussion=kind==="discussion",config=await request("/api/community/composer?type="+kind),id=params.get("draft");
    if(!id&&!config.publishingAccess.available){
      const gate=U.empty(config.publishingAccess.restricted?'社区发言暂受限制':'社区投稿内测中','浏览、下载和评论无需内测码。开通投稿资格后，可以上传资料、发起讨论。');
      if(config.publishingAccess.needsCode)gate.append(button('输入社区内测码',async()=>{try{if(await U.ensurePublishingAccess())window.AnderSiteNavigation ? window.AnderSiteNavigation.refresh() : location.reload();}catch(e){gate.append(el('p',e.message,'lc-error'));}},true));
      gate.append(link('返回学习社区','/community','lc-button'));return gate;
    }
    let draft=id?(await request("/api/community/drafts/"+id)).draft:{id:null,kind,revision:0,state:"draft",title:"",excerpt:"",body:"",subject:"生物",category:discussion?"学习经验":"知识总结",sourceKind:"unspecified",sourceNote:"",aiDeclaration:"unspecified",files:[],canEdit:true,history:[]};
    if(draft.kind!==kind)throw new Error("稿件类型不匹配，请从我的投稿重新打开。");
    const root=el("div",null,"lc-composer"),write=U.writer(token);let busy=false,poll=null;
    editorActive=true;dirty=false;
    const metaInputs={};
    function data(){const data=Object.fromEntries(Object.entries(metaInputs).map(([key,input])=>[key,input.value]));data.fileIds=draft.files.map(f=>f.id);return {...data,sourceKind:"unspecified",sourceNote:"",aiDeclaration:"unspecified"};}
    function rememberId(){const url=new URL(location.href);url.searchParams.set("draft",draft.id);url.searchParams.set("type",kind);history.replaceState(history.state,"",url);}
    async function save(force=false){if(!draft.id||dirty||force){const input=data();if(draft.id)input.expectedRevision=draft.revision;const result=await write(draft.id?`/api/community/drafts/${draft.id}/revisions`:discussion?"/api/community/discussion-drafts":"/api/community/drafts",input);if(!root.isConnected)throw new Error("页面已切换，保存结果可在我的投稿中查看。");draft=result.draft;dirty=false;rememberId();}return draft;}
    async function refresh(){const result=await request("/api/community/drafts/"+draft.id);if(!root.isConnected)return;draft=result.draft;render();}
    async function run(action,status){if(busy)return;busy=true;const locks=[...root.querySelectorAll("button,input,textarea,select")].map(n=>[n,n.disabled]);locks.forEach(([n])=>n.disabled=true);message(status,"正在保存操作，请稍候…");
      try{await action();if(root.isConnected){render();message(root.querySelector("[data-operation-status]"),"操作已完成。");}}
      catch(e){if(root.isConnected){message(status,e.message,true);root.querySelectorAll("[data-lock]").forEach(n=>n.disabled=false);if([401,403].includes(e.status)&&!["PUBLISH_FORBIDDEN","COMMUNITY_CODE_REQUIRED"].includes(e.code)){dirty=false;root.replaceChildren(U.loginGate("登录或页面验证已变化，请重新打开稿件。"));}}}
      finally{busy=false;for(const[n,disabled]of locks)if(n.isConnected)n.disabled=disabled;}}
    function render(){
      clearTimeout(poll);root.replaceChildren();for(const key of Object.keys(metaInputs))delete metaInputs[key];
      const top=el("div",null,"lc-section-title"),heading=el("div");heading.append(el("p",discussion?"START A DISCUSSION":"SHARE A RESOURCE","eyebrow"),el("h2",discussion?(draft.id?"编辑与管理讨论":"发起讨论"):(draft.id?"编辑与管理资料":"分享学习资料")));top.append(heading,link("返回我的投稿","/account#community","lc-button"));root.append(top);
      const stepLabels=config.officialDirectPublish?["整理草稿","直接发布"]:["整理草稿",discussion?"内容检查":"文件检查","人工审核","公开分享"];
      const currentStep=config.officialDirectPublish?(draft.state==="approved"?1:0):(draft.state==="checking"?1:draft.state==="pending"?2:draft.state==="approved"?3:0);
      const steps=el("ol",null,"lc-workflow-steps");for(const [i,label] of stepLabels.entries()){const li=el("li",`${i+1}  ${label}`);if(i===currentStep)li.setAttribute("aria-current","step");steps.append(li);}root.append(steps);
      const banner=el("div",null,"lc-note lc-section-title");banner.append(el("strong",draft.itemState==="removed"?"已下架":states[draft.state]),el("span",draft.revision?`第 ${draft.revision} 版${draft.published?" · 已发布版本继续可见":" · 仅本人及审核人员可见"}`:"新草稿，仅自己可见"));root.append(banner);
      if(config.submissionPolicy)root.append(el("p",config.vipMode?(config.officialDirectPublish?'官方账号投稿与回复不限每日次数，确认提交后直接公开；文件数量与大小要求仍适用。':`每天可提交 3 篇资料、3 个讨论、10 次回复，分别计数；本类今日已用 ${config.submissionPolicy.used} / ${config.submissionPolicy.dailyLimit} 次。北京时间零点恢复，草稿与失败提交不扣次。`):config.submissionPolicy.dailyLimitExempt===true?"当前账号的资料／讨论投稿不限每日次数；文件规格、审核和处理队列限制仍适用。回复及自定义资料修改仍按常规每日限额执行。":`资料／讨论、回复及自定义资料每天合计最多提交 ${config.submissionPolicy.dailyLimit} 次，北京时间零点恢复。保存草稿、加入、撤回和举报申诉不占次数；提交成功后即计数，不因撤回返还。`,"lc-muted"));
      root.append(processingStatus(draft));
      if(draft.publishingAccess&&!draft.publishingAccess.available){const note=el('div',null,'lc-note');note.append(el('p','投稿资格当前不可用，稿件和已完成的检查结果已保留；仍可查看或撤回。'));
        if(draft.publishingAccess.needsCode)note.append(button('开通投稿资格',async()=>{if(await U.ensurePublishingAccess())window.AnderSiteNavigation ? window.AnderSiteNavigation.refresh() : location.reload();}));root.append(note);}
      const formal=config.processingMode==="durable-queue",replay=config.processingMode==="cloud-evidence-replay",pipeline=config.processingMode==="local-pipeline",boundedCloud=config.processingMode==="bounded-cloud-upload";
      if(config.officialDirectPublish){
        root.append(el('p','官方投稿确认后直接发布，保留原始附件供已登录用户下载；不会等待自动检查或人工审核。','lc-note'));
      }else if(formal){
        const help=el("section",null,"lc-note");help.setAttribute("aria-label","投稿审核说明");
        help.append(el("h3","投稿审核说明"),el("p","提交后，文字与附件会经过安全和内容检查，再由审核员决定是否公开。文件会按需送交腾讯云检查；检查完成不代表审核通过。"),
          el("p","请上传有权分享的内容。若文件无法处理，请按稿件中的提示修改；撤回或下架后，原分享链接停止公开。","lc-muted"));root.append(help);
      }else{
      const local=el("details",null,"lc-local-help");local.open=!draft.id;local.append(el("summary",boundedCloud?"本机受限云联调说明":pipeline?"本地处理链路验收说明":replay?"历史云结果隔离复核说明":"本地试用说明与可上传样例"),el("p",boundedCloud?"本入口仅面向合成测试账号，只有与本轮已授权清单匹配的新上传才允许进入受限云处理。超出范围或结果不明确时停止，不自动重复提交。处理结果绑定当前整份稿件，未完成全部技术与人工验收前仍不能发布、预览或下载。":pipeline?"此入口仅用于隔离验收，附件只接受验收专用的固定自编样本。文件结构会实际检查；存储、查毒、转换和内容审核步骤均为本地模拟，不调用云服务。本稿文字和附件尚未获得完整审核，完成本地流程后仍不能发布、预览或下载。":replay?"此入口仅将已完成的真实云测试结果接入隔离队列，不发起新的云请求，也不是正式上传服务。原文件与本稿全部文字的审核尚未齐备，复核成功后仍不能发布或下载。":"本轮使用自编样例模拟云处理，不进行真实云审核或杀毒。可先下载下列文件，再原样上传。其他文件会保留在本人稿件中，并提示尚不支持处理。"));
      const sampleLinks=el("div",null,"lc-actions");for(const sample of config.samples){const a=link(sample.name,sample.url,"lc-button");a.setAttribute("download",sample.name);sampleLinks.append(a);}local.append(sampleLinks);if(!replay&&!pipeline&&!boundedCloud)local.append(el("p",discussion?"可以直接发表文字讨论，配图选填。本地图片检查仅接受这张自编样例；真实图片处理将在云联调时验收。":"PDF 样例使用实际生成的页图；DOCX 页图为配套转图替身，真实文档的格式保真将在云联调时验收。","lc-muted"));root.append(local);
      }
      const status=el("p",null,"lc-operation-message");status.dataset.operationStatus="";
      if(draft.canEdit){
        const form=el("form",null,"lc-editor-form");form.onsubmit=e=>e.preventDefault();
        const definitions=[
          ["标题","title",{max:100,required:true}], [discussion?"内容":"说明",discussion?"body":"excerpt",{type:"textarea",rows:discussion?6:3,max:discussion?6000:300,required:true}],
          ["学科","subject",{type:"select",options:config.subjects,required:true}], ["类型","category",{type:"select",options:config.categories,required:true}]
        ];
        for(const [label,name,options]of definitions){const f=field(label,name,draft[name],options);metaInputs[name]=f.input;f.input.dataset.lock="";f.input.oninput=()=>dirty=true;if(["title","excerpt","body"].includes(name))f.wrap.classList.add("lc-field-wide");form.append(f.wrap);}
        if(!discussion){
        const other=el("details",null,"lc-editor-other lc-field-wide"),extra=field("其他","body",otherText(draft),{type:"textarea",rows:3,max:14000}),hint=el("p","可补充资料来源、适用年级、使用建议或 AI 使用情况；不填也能提交。","lc-muted");
        hint.id="resource-other-hint";extra.input.setAttribute("aria-describedby",hint.id);extra.input.placeholder="例如：适合高一复习，建议配合课本第二章使用。";extra.input.dataset.lock="";extra.input.oninput=()=>dirty=true;metaInputs.body=extra.input;
        other.open=Boolean(extra.input.value);other.append(el("summary","其他（选填）"),hint,extra.wrap);form.append(other);
        }
        root.append(form);
        const uploads=el("section",null,"lc-upload-box"),limits=config.limits;
        uploads.append(el("h3",discussion?"配图（选填）":"附件"),el("p",(discussion?"PNG / JPG / WebP":"PDF / DOCX")+` · 单件最多 ${limits.fileMiB} MiB · 最多 ${limits.files} 件 · 合计 ${limits.totalMiB} MiB`,"lc-muted"));
        if(!discussion&&!config.officialDirectPublish)uploads.append(el("p","Word 和含无法识别替代文字的 PDF 可转换为已检查的 PDF 副本；自动处理无法完成时，由站长查看原件后决定是否公开。","lc-muted"));
        if(!formal&&limits.completion?.format==="community-completion-contract-v1"){
          const c=limits.completion,budgetHelp=el("details",null,"lc-completion-help");
          budgetHelp.append(el("summary",`整稿处理上限：${c.taskSeconds} 秒，最多 ${c.requestLimit} 次请求`),
            el("p",c.explanation,"lc-muted"),
            el("p",`预算包含至少 ${c.parserSeconds} 秒解析、${c.finishSeconds} 秒收尾，以及每次请求最多 ${c.requestSeconds} 秒；图片另预留整批 ${c.imageBatchScanSeconds} 秒本地扫描。实际本地处理若更久，剩余可用时间也会相应减少。`,"lc-muted"),
            el("p",`请求按 ${c.bootstrapRequests} 次公共核对＋每份 PDF/DOCX ${c.documentRequests} 次＋每张原图 ${c.imageRequests} 次＋每个文字审核块／页图／内嵌图各 1 次计算；每份文档还预留 ${c.documentPollSeconds} 秒查毒结果等待。文字块和预览图以完整解析结果为准，不能由文件大小或页数直接推算。`,"lc-muted"));
          uploads.append(budgetHelp);
        }
        for(const file of draft.files){const row=el("div",null,"lc-file-row"),remove=button("移除",()=>{draft.files=draft.files.filter(f=>f.id!==file.id);dirty=true;const snapshot=data();draft={...draft,...snapshot};render();});remove.dataset.lock="";row.append(el("span",`${file.name} · ${bytes(file.size)}`),remove);uploads.append(row);}
        const input=el("input");input.type="file";input.accept=discussion?".png,.jpg,.jpeg,.webp":".pdf,.docx";input.multiple=true;input.setAttribute("aria-label",discussion?"添加讨论配图":"添加资料附件");input.dataset.lock="";
        input.onchange=()=>{const selected=[...input.files];if(!selected.length)return;
          if(selected.length+draft.files.length>config.limits.files||selected.some(f=>f.size>config.limits.fileMiB*1048576)||selected.reduce((n,f)=>n+f.size,0)+draft.files.reduce((n,f)=>n+f.size,0)>config.limits.totalMiB*1048576){message(status,"附件超过数量或大小上限，请重新选择。",true);input.value="";return;}
          run(async()=>{await save();for(const file of selected){const ext=file.name.split(".").pop().toLowerCase(),result=await write("/api/community/upload-intents",{draftId:draft.id,expectedRevision:draft.revision,name:file.name,size:file.size,type:ext==="jpeg"?"jpg":ext});await write(result.upload.url,file,{method:"PUT",raw:true});const completed=await write(`/api/community/uploads/${result.upload.id}/complete`,{});draft.files.push(completed.file);dirty=true;}await save();},status);
        };uploads.append(input);root.append(uploads);
        root.append(el("p",config.officialDirectPublish?'点击“直接发布”，即确认向已登录用户分享正文及附件，标题与摘要可公开浏览。':discussion?"点击“提交审核”，即同意审核通过后向已登录用户展示讨论正文与配图，标题与摘要可公开浏览。":"点击“提交审核”，即同意资料审核通过后供已登录用户预览和下载。","lc-muted lc-submit-note"));
        const actions=el("div",null,"lc-actions"),saveButton=button("保存草稿",()=>run(async()=>{await save(draft.state!=="draft");},status)),submitButton=button(config.officialDirectPublish?(draft.published?'发布新版本':'直接发布'):draft.published?"提交新版本审核":"提交审核",()=>{
          run(async()=>{await save(draft.state!=="draft");const result=await write(`/api/community/drafts/${draft.id}/submit`,{expectedRevision:draft.revision,agree:true,rulesVersion:config.rulesVersion});draft=result.draft;},status);
        },true);saveButton.dataset.lock=submitButton.dataset.lock="";actions.append(saveButton,submitButton);root.append(actions);
      }else{
        root.append(U.heading(draft.title,discussion?null:draft.excerpt),discussion?el("div",draft.body,"lc-body-text"):otherDetails(draft));
        if(draft.files.length)root.append(attachments(draft,{token}));
      }
      const actions=el("div",null,"lc-actions lc-editor-bottom");
      if(draft.id){const reload=button("刷新进度",()=>{if(dirty&&!confirm("尚有未保存的修改，刷新会丢弃这些修改。继续刷新？"))return;dirty=false;run(refresh,status);});reload.dataset.lock="";actions.append(reload);}
      if(draft.published)actions.append(link("查看已发布内容",U.href(draft),"lc-button"));
      if(draft.id&&draft.itemState!=="removed"&&draft.state!=="withdrawn"){
        const withdraw=button(discussion?"撤回讨论":"撤回资料",()=>run(async()=>{if(dirty&&draft.canEdit)await save();await write(`/api/community/posts/${draft.id}/withdraw`,{expectedRevision:draft.revision});dirty=false;await refresh();},status));withdraw.dataset.lock="";actions.append(withdraw);
        root.append(el("p","撤回会停止所有已发布版本的展示和旧链接访问，未发布的修改仍保留在本人稿件中。","lc-muted"));
      }
      root.append(actions,status);
      if(draft.history.length){const history=el("details",null,"lc-revision-history");history.append(el("summary","版本记录"));for(const version of draft.history)history.append(el("p",`第 ${version.number} 版 · ${states[version.state]} · ${U.date(version.createdAt)}${version.reason?" · "+version.reason:""}`));root.append(history);}
      if(draft.state==="checking")poll=setTimeout(()=>{if(root.isConnected&&!document.hidden&&!busy)refresh().catch(e=>message(status,e.message,true));},1800);
    }
    render();return root;
  }
  async function admin({request=U.request,embedded=false,onAuthFailure}) {
    editorActive=false;dirty=false;
    const session=await request("/api/community-admin/session"),write=U.writer(session.csrfToken,true),root=el("div",null,"lc-review"),notice=el("p",null,"lc-operation-message");let viewGeneration=0,socialPanel=null;
    root.dataset.adminToken=session.csrfToken;
    const heading=el("div",null,"lc-section-title"),tools=el("div",null,"lc-actions");tools.append(button("刷新队列",()=>queue(true)));if(!embedded)tools.append(button("退出审核",async()=>{
      try{const result=await fetch("/api/logout",{method:"POST",credentials:"same-origin",cache:"no-store"});if(!result.ok)throw new Error("退出未完成，请重试。");root.replaceChildren();location.replace("/login?next=%2Fmanage%2Fcommunity");}catch(e){message(notice,e.message,true);}
    }));heading.append(U.heading("待人工处理","核对当前版本，留下清楚的处理结果。"),tools);
    if(embedded){const title=heading.querySelector("h1");title.replaceWith(el("h2",title.textContent));}
    const reviewHelp=session.processingMode==="durable-queue"?"自动检查作为辅助。格式不兼容、查毒异常或检查未完成，均由站长查看原件后决定公开或退回；原检查结果和人工意见分别保留。":session.processingMode==="bounded-cloud-upload"?"本机受限云联调 · 真实回执按稿件版本展示，技术检查与人工决定分开。仅证据完整且经本地测试审核通过的授权版本可供测试账号访问；缺项继续关闭。本入口使用合成审核身份，未上线正式环境。":session.processingMode==="cloud-evidence-replay"?"本地历史证据复核 · 不发起新云请求；完整覆盖与正式管理员登录仍待验收。":"本地模拟审核 · 检查结果来自自编样例替身，真实云审核与管理员短信登录另行联调。";
    root.append(heading,el("p",reviewHelp,"lc-note"),notice);
    const layout=el("div",null,"lc-review-layout"),list=el("section",null,"lc-review-list"),detail=el("section",null,"lc-review-detail");layout.append(list,detail);root.append(layout);
    function failure(e){
      if(e.status===401||["ADMIN_REQUIRED","CSRF_FAILED"].includes(e.code)){if(onAuthFailure){onAuthFailure(e);return;}viewGeneration++;const gate=U.empty("审核登录已失效","请重新使用管理身份登录后继续。");gate.append(link("返回管理登录","/login?next=%2Fmanage%2Fcommunity","lc-button lc-primary"));root.replaceChildren(gate);}
      else message(notice,e.message,true);
    }
    async function queue(refreshSocial=false){try{
      const data=await request("/api/community-admin/queue");list.replaceChildren(el("h2","稿件与处理记录"));
      for(const item of data.items){const b=button("",()=>open(item.id));b.classList.add("lc-review-pick");b.append(el("strong",item.title),el("small",`${states[item.state]} · 第 ${item.revision} 版 · ${item.subject}`));const kinds=[...new Set((item.reviewIssues||[]).map(issue=>issueKinds[issue.kind]||"待核对问题"))];if(kinds.length)b.append(el("small",kinds.join(" · ")));list.append(b);}
      for(const p of data.profiles){const b=button("社区资料："+p.displayName,()=>profile(p));list.append(b);}
      if(!data.items.length&&!data.profiles.length)list.append(U.empty("暂无待处理内容","用户提交资料后，检查状态和审核任务会出现在这里。"));
      if(refreshSocial&&socialPanel)await socialPanel.refresh();
    }catch(e){failure(e);}}
    async function perform(btn,fn){btn.disabled=true;message(notice,"正在保存处理结果…");try{await fn();if(!root.isConnected)return;await queue();message(notice,"处理结果已保存，当前稿件状态已更新。");}catch(e){if(root.isConnected)failure(e);}finally{btn.disabled=false;}}
    async function open(id){const run=++viewGeneration;try{
      const {draft}=await request("/api/community-admin/resources/"+id);if(!root.isConnected||run!==viewGeneration)return;detail.replaceChildren();
      detail.append(el("span",`${states[draft.state]} · 第 ${draft.revision} 版`,"lc-tag"),U.heading(draft.title,draft.kind==="discussion"?null:draft.excerpt),el("p",`${draft.subject} · ${draft.category} · ${draft.author.displayName}`,"lc-muted"),draft.kind==="discussion"?el("div",draft.body,"lc-body-text"):otherDetails(draft));
      detail.append(processingStatus(draft));
      const issues=reviewIssues(draft);if(issues)detail.append(issues);
      const moderation=moderationDetails(draft,{token:session.csrfToken});if(moderation)detail.append(moderation);
      if(draft.files.length)detail.append(attachments(draft,{token:session.csrfToken,admin:true}));
      const reason=field("退回或下架原因","review-reason","",{type:"textarea",rows:3,max:500}),actions=el("div",null,"lc-actions"),secondary=el("div",null,"lc-actions");
      if(draft.state==="pending"){
        const ownerNeeded=draft.ownerReview?.needed===true;
        if(ownerNeeded){
          const panel=el("section",null,"lc-processing-evidence"),opinion=field("人工审核意见（3–500字）","owner-review-reason","",{type:"textarea",rows:3,max:500,required:true}),
            seen=checkbox("我已查看本版内容及原附件","owner-reviewed-originals"),
            accept=checkbox("我了解自动检查未完成或未通过，决定公开本版内容和原件","owner-accept-outcome"),
            risk=draft.ownerReview.detectedRisk?checkbox("我已核对查毒检出风险，仍明确决定公开这份原件","owner-accept-risk"):null;
          panel.append(el("h3","站长人工决定"),el("p","无需重新解析或重提稿件。公开后提供原件下载；原检查记录保留，不会标为查毒通过。","lc-note"),opinion.wrap,seen.wrap,accept.wrap);
          if(risk)panel.append(risk.wrap);let saving=false;
          const publish=button("人工审核后公开原件",async()=>{
            saving=true;sync();try{await perform(publish,async()=>{
              try{await write("/api/community-admin/decisions",{id,expectedRevision:draft.revision,decision:"approve",ownerReview:{
                snapshotHash:draft.ownerReview.snapshotHash,reason:opinion.input.value,reviewedOriginals:seen.input.checked,
                acceptCheckOutcome:accept.input.checked,acceptDetectedRisk:risk?.input.checked===true}});}
              finally{if(root.isConnected&&run===viewGeneration)await open(id);}
            });}finally{saving=false;sync();}
          },true);
          function sync(){publish.disabled=saving||opinion.input.value.trim().length<3||opinion.input.value.length>500||!seen.input.checked||!accept.input.checked||risk&&!risk.input.checked;}
          opinion.input.oninput=sync;seen.input.onchange=sync;accept.input.onchange=sync;if(risk)risk.input.onchange=sync;sync();panel.append(publish);detail.append(panel);
        }
        const reviewMode=ownerNeeded?null:contentReviewMode(draft.moderation),needsReview=Boolean(reviewMode),actionKey=reviewMode==="content"?"approveContent":reviewMode==="ads"?"approveAds":"approve",
          reviewReason=needsReview?field("本版内容复核与接受理由（3–500字）","content-review-reason","",{type:"textarea",rows:3,max:500,required:true}):null;
        if(reviewReason)detail.append(reviewReason.wrap);
        async function decide(decision){
          try{await write("/api/community-admin/decisions",{id,expectedRevision:draft.revision,decision,...(decision==="return"?{reason:reason.input.value}:{}),
            ...(decision==="approve"&&needsReview?{[reviewMode==="content"?"contentReview":"adsReview"]:{evidenceHash:draft.moderation.evidenceHash,policy:draft.moderation.policy,
              decision:"accept",reason:reviewReason.input.value}}:{})});}
          catch(e){
            // A previously enabled button is not authority. Re-read changed
            // conditions after rejection, without switching a newer selection.
            if(root.isConnected&&run===viewGeneration){detail.replaceChildren(U.empty("正在重新核对当前稿件","提交未成功；不会自动重新提交。"));await open(id);}
            throw e;
          }
          if(root.isConnected&&run===viewGeneration)await open(id);
        }
        const approveLabel=needsReview?"已复核内容提示，审核通过并发布":"审核通过";let approving=false;
        const approve=button(approveLabel,async()=>{approving=true;try{await perform(approve,()=>decide("approve"));}finally{approving=false;if(needsReview)syncReviewButton();}},true);
        const back=button("退回修改",()=>perform(back,()=>decide("return")));
        for(const [decision,label,control] of [[actionKey,approveLabel,approve],["return","退回修改",back]]){
          if(ownerNeeded&&decision!=="return")continue;
          const state=draft.reviewActions?.revision===draft.revision?draft.reviewActions[decision]:null;
          control.disabled=state?.allowed!==true;
          if(control.disabled){const hint=el("p",`${label}暂不可用：${state?.message||"尚未取得本版审核条件，请刷新当前稿件。"}`,"lc-note");hint.id=`lc-review-${decision}-reason`;control.setAttribute("aria-describedby",hint.id);detail.append(hint);}
        }
        function syncReviewButton(){approve.disabled=approving||draft.reviewActions?.revision!==draft.revision||draft.reviewActions?.[actionKey]?.allowed!==true
          ||draft.moderation?.available!==true||(reviewMode==="content"?draft.moderation.reviewReady:draft.moderation.adsAcceptanceReady)!==true
          ||reviewReason.input.value.trim().length<3||reviewReason.input.value.length>500;}
        if(needsReview){reviewReason.input.oninput=syncReviewButton;syncReviewButton();}
        if(!ownerNeeded)actions.append(approve);actions.append(button("刷新当前稿件",()=>{message(notice,"");return open(id);}));secondary.append(back);
        if(!ownerNeeded&&draft.reviewActions?.revision===draft.revision&&draft.reviewActions.recheck?.allowed===true){
          const recheck=button("重新检查",async()=>{if(!confirm("将保留原记录并重新检查，计入今日提交次数。"))return;
            await perform(recheck,async()=>{try{await write("/api/community-admin/rechecks",{id,expectedRevision:draft.revision});}finally{if(root.isConnected&&run===viewGeneration)await open(id);}});
          });actions.append(recheck);
        }
      }
      if(draft.published){const remove=button("下架资料",()=>perform(remove,async()=>{await write("/api/community-admin/actions",{id,expectedRevision:draft.publishedRevision||draft.revision,action:"remove",reason:reason.input.value});detail.replaceChildren(U.empty("资料已下架","全部版本的对外展示、预览和下载链接已停用。"));}));secondary.append(remove);}
      if(actions.childElementCount)detail.append(actions);
      if(secondary.childElementCount){const extra=el("details",null,"lc-review-secondary");extra.append(el("summary",draft.state==="pending"?(draft.published?"退回或下架":"退回修改"):"下架资料"),reason.wrap,secondary);detail.append(extra);}
      if(draft.events.length){const history=el("details");history.append(el("summary","处理记录"));const labels={create:"创建草稿",save_revision:"保存新版本",submit:"提交审核",checks_complete:"检查完成",checks_failed:"检查失败",ads_review_accept:"本版广告提示已明确接受",content_review_accept:"本版内容提示已明确接受",owner_review_accept:"站长人工决定公开",approve:"批准发布",return:"退回修改",withdraw:"作者撤回",remove:"管理员下架"};for(const event of draft.events){
        let reason=event.reason;if(["ads_review_accept","content_review_accept","owner_review_accept"].includes(event.action)){try{const saved=JSON.parse(reason);reason=["community-ads-review-accept-v1","community-content-review-accept-v1","community-owner-review-accept-v1"].includes(saved.format)?saved.reason:"内容处置记录已保留";}catch{reason="内容处置记录暂无法展示";}}
        history.append(el("p",`${labels[event.action]||event.action} · ${U.date(event.createdAt)}${reason?" · "+reason:""}`));
      }detail.append(history);}
    }catch(e){if(root.isConnected)failure(e);}}
    function profile(p){viewGeneration++;detail.replaceChildren(U.heading("社区资料审核",p.displayName),el("p",p.bio));const reason=field("退回原因","profile-reason","",{type:"textarea",max:500});detail.append(reason.wrap);const actions=el("div",null,"lc-actions");for(const [decision,label]of [["approve","通过社区资料"],["return","退回社区资料"]]){const b=button(label,()=>perform(b,async()=>{await write("/api/community-admin/profile-decisions",{id:p.id,expectedRevision:p.revision,decision,reason:reason.input.value});detail.replaceChildren(U.empty("社区资料已处理","已通过的昵称和简介才会公开展示。"));}),decision==="approve");actions.append(b);}detail.append(actions);}
    await queue();detail.append(U.empty("选择一份稿件","查看本版处理结果及剩余事项。自动检查异常时，由站长查看原件后决定公开或退回。"));
    if(window.AnderCommunitySocial){socialPanel=await window.AnderCommunitySocial.admin({token:session.csrfToken,request,onChange:queue,onFailure:failure});root.append(socialPanel);}return root;
  }
  function profileForm(data,{token,onSaved}) {
    const enrollment=!data.profile?.visible,member=data.enrollment;
    if(enrollment&&data.age?.needsConfirmation)return ageForm(data.age,{token,onSaved});
    if(enrollment&&data.age?.message&&!member?.canApply)return el("p",data.age.message,"lc-note");
    if(enrollment&&!member?.canApply)return el("p",member?.message||"当前暂不能加入；若有旧申请，请先撤回，保留原记录后重新同意。","lc-note");
    const form=el("form",null,"lc-profile-form"),write=U.writer(token),status=el("p");
    const name=enrollment?null:field("社区昵称","displayName",data.profile?.displayName,{max:20,required:true}),
      bio=enrollment?null:field("社区简介","bio",data.profile?.bio,{type:"textarea",rows:3,max:200}),
      agree=checkbox(enrollment?"我单独同意加入学习社区并使用社区身份互动；昵称可随已审核内容向访问者展示，简介向登录用户展示；账号联系方式和学习记录不公开。":"同意本次自定义资料审核；通过后昵称可随已审核内容向访问者展示，简介向登录用户展示；账号联系方式和学习记录不公开。","public-consent");
    if(enrollment)form.append(el("p","同意后即可加入，无需人工审批。先使用“社区成员”昵称；加入后可另行提交自定义昵称和简介审核。资料、讨论和回复仍需内容审核，投稿权限另行核验。","lc-note"));
    else form.append(name.wrap,bio.wrap);
    form.append(agree.wrap);
    const submit=button(enrollment?"同意并加入社区":"提交资料修改",async()=>{
      submit.disabled=true;
      try{
        await write(enrollment?"/api/community/me/enrollment":"/api/community/me/profile-revisions",
          enrollment?{agree:agree.input.checked,rulesVersion:member.rulesVersion,policyVersion:member.policyVersion,expectedRevision:member.expectedRevision}
            :{displayName:name.input.value,bio:bio.input.value,agree:agree.input.checked,rulesVersion:data.rulesVersion});
        if(form.isConnected)await onSaved();
      }catch(e){message(status,e.message,true);}finally{submit.disabled=false;}
    },true);form.append(submit,status);form.onsubmit=e=>e.preventDefault();return form;
  }
  function ageForm(age,{token,onSaved}) {
    const form=el("form",null,"lc-profile-form"),label=el("label","你的年龄范围","lc-field"),select=el("select"),status=el("p"),write=U.writer(token);
    select.name="ageBand";select.required=true;
    for(const [value,text]of [["","请选择"],["under14","未满 14 周岁"],["14to17","14–17 周岁"],["adult","已满 18 周岁"]]){const option=el("option",text);option.value=value;select.append(option);}
    label.append(select);
    const agree=checkbox("我确认所选年龄范围真实。此次补录仅用于社区准入判断，不表示同意加入社区或获得投稿权限。","confirm-community-age");
    form.append(el("p","旧账号尚未记录年龄范围，请先由本人补充。仅记录年龄范围，不收集生日；如需更正，请联系工作室。当前社区暂未开放未成年人加入。","lc-note"),label,agree.wrap);
    const submit=button("确认年龄范围",async()=>{
      if(!select.value||!agree.input.checked){message(status,"请选择真实年龄范围并勾选确认。",true);return;}
      submit.disabled=true;
      try{await write("/api/account/community-age",{ageBand:select.value,confirmed:true,version:age.version});if(form.isConnected)await onSaved();}
      catch(e){message(status,e.message,true);}finally{submit.disabled=false;}
    },true);
    status.setAttribute("role","status");form.append(submit,status);form.onsubmit=e=>e.preventDefault();return form;
  }
  function membershipWithdrawal(data,{token,onSaved}) {
    const wrap=el("section",null,"lc-note"),status=el("p"),write=U.writer(token);
    wrap.append(el("p","撤回社区展示同意后，旧帖、回复和文件链接停止公开；内容与处置记录保留，重新加入不会自动恢复旧内容。"));
    const consent=checkbox("确认撤回社区展示同意。","withdraw-community-consent");
    const submit=button("撤回社区展示",async()=>{
      if(!consent.input.checked){message(status,"请先勾选确认。",true);return;}
      submit.disabled=true;
      try{await write("/api/community/me/enrollment-withdrawal",{confirmed:true,expectedRevision:data.enrollment.expectedRevision});if(wrap.isConnected)await onSaved();}
      catch(e){message(status,e.message,true);}finally{submit.disabled=false;}
    });
    wrap.append(consent.wrap,submit,status);return wrap;
  }
  function reset(){dirty=false;editorActive=false;for(const gallery of imageGalleries)gallery.dispose();imageGalleries.clear();}
  window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue="";}});
  window.AnderCommunityWorkflow={editor,admin,attachments,discussionImages,mountImages,otherDetails,profileForm,membershipWithdrawal,reset,isEditor:()=>editorActive,controls:{button,field,message},interactionDirty(){dirty=true;editorActive=true;},
    confirmLeave(){if(!dirty)return true;if(confirm("这份稿件还有未保存的修改。离开会丢弃这些修改，是否继续？")){dirty=false;return true;}return false;}};
})();
