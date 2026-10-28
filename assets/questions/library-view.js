(()=>{
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels={single:'单选题',multi:'多选题',indeterminate:'不定项',written:'非选择题'},kinds=Object.keys(labels);
 function rich(html){
  const template=document.createElement('template');template.innerHTML=String(html||'');
  const allowed=new Set(['P','DIV','SPAN','BR','STRONG','B','EM','I','U','SUB','SUP','IMG','TABLE','THEAD','TBODY','TR','TD','TH','UL','OL','LI']);
  function clean(parent){for(const node of [...parent.children]){
   if(!allowed.has(node.tagName)){node.replaceWith(document.createTextNode(node.textContent||''));continue;}
   for(const attr of [...node.attributes])if(!['src','alt','colspan','rowspan','data-slot-id','data-part-id'].includes(attr.name)&&!(node.tagName==='IMG'&&['width','height'].includes(attr.name)))node.removeAttribute(attr.name);
   if(node.tagName==='IMG'){
    const raw=node.getAttribute('src')||'',questionImage=/^\/api\/questions\/items\/[1-9]\d*\/media\/[a-f0-9]{64}\.(png|jpg)\?version=[1-9]\d*&releaseId=questions-[a-f0-9]{12}-v\d+&role=(prompt|answer)$/.test(raw),starImage=/^\/api\/questions\/style\/star-a-(?:[1-9]|10)\.png$/.test(raw);
    if(!questionImage&&!starImage){node.remove();continue;}
    for(const name of ['width','height']){const value=node.getAttribute(name);if(value!==null&&(!/^\d{1,4}$/.test(value)||Number(value)<1))node.removeAttribute(name);}
    if(questionImage)node.setAttribute('data-question-image','');
    node.loading='lazy';node.decoding='async';
   }else node.removeAttribute('src');clean(node);
  }}clean(template.content);
  for(const table of template.content.querySelectorAll('table')){const box=document.createElement('div');box.className='ql-table-scroll';table.replaceWith(box);box.append(table);}
  const div=document.createElement('div');div.append(template.content);return div.innerHTML;
 }
 function tree(catalog,mode,selected=[],counts={}){
  const nodes=catalog.nodes.filter(n=>n.taxonomy===(mode==='chapter'?'chapter':'notes')),ids=new Set(selected),children=id=>nodes.filter(n=>(n.parentId||null)===(id||null)).sort((a,b)=>(a.order||0)-(b.order||0)||a.id.localeCompare(b.id));
  const walk=id=>'<ul>'+children(id).map(n=>{const list=children(n.id),count=counts[n.id];return '<li>'+(list.length?'<details data-node="'+esc(n.id)+'"><summary>'+esc(n.title)+'</summary>':'')+'<label><input type="checkbox" data-node-select="'+esc(n.id)+'"'+(ids.has(n.id)?' checked':'')+(count===0&&!ids.has(n.id)?' disabled':'')+'><span>'+esc(list.length?'选择此范围':n.title)+'</span><small>'+(Number.isInteger(count)?count:'')+'</small></label>'+(list.length?walk(n.id)+'</details>':'')+'</li>';}).join('')+'</ul>';
  return walk(null);
 }
 function card(q,{basket=false,detail=false,displayNumber=null}={}){
  const validDifficulty=kinds.includes(q.kind)&&Number.isInteger(q.difficulty)&&q.difficulty>=(q.kind==='written'?6:1)&&q.difficulty<=(q.kind==='written'?10:5);
  const difficulty=validDifficulty?'<img class="ql-difficulty-stars" src="/api/questions/style/star-a-'+q.difficulty+'.png" alt="难度星级" height="14">':'<span class="ql-difficulty-unavailable">难度未标注</span>';
  const number=Number.isSafeInteger(displayNumber)&&displayNumber>0?'<span class="ql-number" aria-label="第 '+displayNumber+' 题">'+displayNumber+'.</span>':'';
  const html='<article class="ql-panel ql-card" data-q="'+q.questionId+'"><div class="ql-card-head"><span class="ql-chip">'+labels[q.kind]+'</span><span>'+esc(q.sourceDisplay||([q.year,q.source==='gaokao'?'高考题':q.source==='mock'?'模拟题':'来源未标注'].filter(Boolean).join(' · ')))+'</span>'+difficulty+number+'</div><div class="ql-prompt" data-open-question="'+q.questionId+'">'+rich(q.promptHtml)+'</div>'+
   '<div class="ql-options">'+(q.options||[]).map(o=>{const label=typeof o.label==='string'?o.label.trim():'';return '<div class="ql-option'+(String(o.html).replace(/<[^>]+>/g,'').length>32?' long':'')+'" data-option="'+esc(o.id)+'">'+(label?'<b>'+esc(label)+'. </b>':'')+rich(o.html)+'</div>';}).join('')+'</div><div data-mapped-answers></div>'+
   '<footer class="ql-actions"><a href="/question-detail.html?id='+q.questionId+'" data-detail-link>'+ (detail?'当前题目':'查看详情')+'</a><button type="button" data-favorite="'+q.questionId+'" aria-pressed="'+Boolean(q.favorite)+'">'+(q.favorite?'已收藏':'收藏')+'</button>'+(basket?'<button data-move="-1" aria-label="本题上移">↑</button><button data-move="1" aria-label="本题下移">↓</button><button data-remove="'+q.questionId+'">移除</button>':'<button type="button" data-add="'+q.questionId+'" aria-pressed="'+Boolean(q.inBasket)+'">'+(q.inBasket?'已加入':'加入试题篮')+'</button>')+'</footer></article>';
  return html;
 }
 // 08. Unwrap only a single paragraph shell; never flatten complex answer content.
 function answerContent(references){
  const content=document.createElement('div'),blocks='p,div,br,img,table,thead,tbody,tr,td,th,ul,ol,li',substantial='br,img,table,ul,ol,li',parts=[];
  for(const reference of references){
   const original=document.createElement('div');original.innerHTML=rich(reference.html);const part=original.cloneNode(true);
   // Empty imported paragraph shells may surround one real paragraph. Keep all
   // their text/inline nodes, but do not turn those shells into forced new lines.
   for(const node of [...part.querySelectorAll('p,div')].reverse())if(!node.textContent.trim()&&!node.querySelector(substantial)&&!node.classList.contains('ql-table-scroll'))node.replaceWith(...node.childNodes);
   for(;;){
    const meaningful=[...part.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE?node.textContent.trim():node.nodeType===Node.ELEMENT_NODE&&(node.textContent.trim()||node.matches(substantial)||node.querySelector(substantial)));
    const only=meaningful.length===1?meaningful[0]:null;
    if(!only||!['P','DIV'].includes(only.nodeName)||only.classList.contains('ql-table-scroll'))break;
    only.replaceWith(...only.childNodes);
   }
   parts.push({original,part,inline:!part.querySelector(blocks)});
  }
  const inline=parts.every(part=>part.inline);
  for(const [index,part] of parts.entries()){
   if(index)content.append(document.createTextNode(' / '));
   content.append(...(inline?part.part:part.original).childNodes);
  }
  return {content,inline};
 }
 function styleAnswerText(content){
  const walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes)if(node.textContent.trim()&&!node.parentElement?.closest('table,.ql-table-scroll')){
   const span=document.createElement('span');span.className='ql-answer-text';node.replaceWith(span);span.append(node);
  }
 }
 function paintAnswer(article,q,a){
  for(const option of article.querySelectorAll('[data-option]')){
   option.classList.remove('correct');for(const mark of option.querySelectorAll('.ql-answer-correct-mark'))mark.remove();
   if(a.correctOptionIds?.includes(option.dataset.option)){option.classList.add('correct');const mark=document.createElement('em');mark.className='ql-answer-correct-mark';mark.textContent='✓ 正确';option.append(mark);}
  }
  if(q.kind!=='written')return;
  // Rebuild from the immutable question projection before each paint so repeats
  // cannot retain old underscores, duplicate blocks or move punctuation.
  const prompt=article.querySelector('.ql-prompt'),area=article.querySelector('[data-mapped-answers]');
  prompt.innerHTML=rich(q.promptHtml);area.replaceChildren();
  if(!a.mappingComplete){area.innerHTML='<p class="ql-status">填空对应关系不完整，请在详情查看参考答案。</p>';return;}
  for(const map of a.answerMap){
   const slot=q.slots.find(s=>s.id===map.slotId),node=prompt.querySelector('[data-slot-id="'+CSS.escape(map.slotId)+'"]'),answer=answerContent(map.references);
   if(node&&answer.inline){node.classList.add('ql-inline-answer','ql-answer-text');node.replaceChildren(...answer.content.childNodes);}
   else{
    // Complex content is fully visible outside the sentence's inline slot.
    // Keep its original paragraphs, images, tables and mathematical markup.
    const box=document.createElement('section'),heading=document.createElement('div');box.className='ql-answer-block';heading.className='ql-answer-heading';
    heading.textContent=(slot?.partLabel||'本题')+' · 第'+(slot?.ordinal||'')+'空参考答案';
    answer.content.className='ql-answer-content';styleAnswerText(answer.content);box.append(heading,answer.content);area.append(box);
    if(node){node.classList.add('ql-answer-marker');node.textContent='〔答案见下方〕';node.setAttribute('aria-label',heading.textContent+'，见下方答案区');}
   }
  }
 }
 const empty=(title,message,action='')=>'<section class="ql-panel ql-empty"><p class="ql-kicker">BIOLOGY QUESTION LIBRARY</p><h2>'+esc(title)+'</h2><p>'+esc(message)+'</p>'+action+'</section>';
 window.AnderLibraryView={esc,rich,tree,card,paintAnswer,empty,labels,kinds};
})();
