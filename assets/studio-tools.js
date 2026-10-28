/* Product facts from the owner's supplied September 2026 images; no checkout integration. */
(function (root) {
  "use strict";
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  // Source rectangles also drive build-time crops; original files remain intact.
  const art = Object.freeze({
    cover: { src: "assets/tools/libing/cover-original.png", width: 2400, height: 2400, rect: [365, 60, 1710, 2250], alt: "砺冰笔记本张扬青春款，金色山野油画封面与白色线圈" },
    mountain: { src: "assets/tools/libing/two-covers-original.jpg", width: 2400, height: 2400, rect: [240, 840, 920, 1210], alt: "张扬青春款笔记本实物封面，金山山野" },
    coast: { src: "assets/tools/libing/two-covers-original.jpg", width: 2400, height: 2400, rect: [1230, 840, 930, 1210], alt: "自由海岸款笔记本实物封面，落日滨海" },
    tasks: { src: "assets/tools/libing/task-plan-original.jpg", width: 2250, height: 3375, rect: [455, 728, 1340, 1805], alt: "学习任务计划表内页，包含科目、学习计划、重要程度与完成情况" },
    review: { src: "assets/tools/libing/exam-review-original.jpg", width: 2250, height: 3375, rect: [455, 1410, 1340, 1805], alt: "考试反思与总结内页，按科目记录反思与总结" },
    grid: { src: "assets/tools/libing/writing-pages-original.jpg", width: 2250, height: 2883, rect: [264, 350, 555, 775], alt: "方格内页实物样张" },
    dots: { src: "assets/tools/libing/writing-pages-original.jpg", width: 2250, height: 2883, rect: [848, 350, 555, 775], alt: "点阵内页实物样张" },
    blank: { src: "assets/tools/libing/writing-pages-original.jpg", width: 2250, height: 2883, rect: [1433, 350, 555, 775], alt: "空白内页实物样张" },
  });
  const notebook = Object.freeze({
    id: "libing-notebook", title: "砺冰笔记本", edition: "2027 新版", fullTitle: "高考多功能笔记本",
    subtitle: "把目标写下来，让每一步学习有迹可循。",
    description: "一本兼顾学习规划、日常记录与考试复盘的多功能笔记本。用年历把握进度，用计划表安排任务，也为知识整理与自由书写留出空间。",
    stats: Object.freeze([["160", "页记录空间"], ["2", "款油画封面"], ["3", "种基础内页"]]),
    workflow: Object.freeze([
      ["规划学期", "学期年历", "标记考试、假期与重要节点，统筹阶段目标和复习进度。"],
      ["安排日常", "任务计划 · 日程计划", "按科目列出任务、区分重要程度，再安排到每天的时间里。"],
      ["回看考试", "成绩记录 · 反思总结", "记录成绩与排名变化，梳理失分原因，为下一阶段调整计划。"],
    ]),
    covers: Object.freeze([
      { art: "mountain", title: "张扬青春", description: "金山山野" },
      { art: "coast", title: "自由海岸", description: "落日滨海" },
    ]),
    samples: Object.freeze([
      { art: "tasks", title: "学习任务计划表", description: "把科目、任务、重要程度与完成情况放在同一页，方便安排与回顾。" },
      { art: "review", title: "考试反思与总结", description: "按科目留下分析与思考，把这次考试的发现带进下一次学习。" },
    ]),
    writing: Object.freeze([
      { art: "grid", title: "方格内页", description: "绘制图表，搭建知识框架。" },
      { art: "dots", title: "点阵内页", description: "辅助排版，兼顾书写与创作。" },
      { art: "blank", title: "空白内页", description: "自由绘图，展开自己的思路。" },
    ]),
    specs: Object.freeze([
      ["尺寸", "185 × 260 mm"], ["页数", "160 页"], ["纸张", "80 g/m² 书写纸"],
      ["封面", "1.5 mm 厚纸板"], ["线圈", "ABS 材质"], ["款式", "张扬青春 / 自由海岸"],
    ]),
  });

  // Public-facing copy verified against the local mini-program implementation.
  // These owner-supplied images are presentation assets, not a live data connection.
  const qingniao = Object.freeze({
    id: "qingniao-learning", title: "青鸟学习",
    subtitle: "有计划地背诵，有依据地复习。",
    description: "从高中生物出发，把知识背诵、自测与错项复习连在一起，也为古诗文和英语单词留出每日积累的空间。",
    code: { src: "assets/tools/qingniao/mini-program-code.jpg", width: 258, height: 258, alt: "青鸟学习微信小程序码，使用微信扫一扫进入" },
    workflow: Object.freeze([
      ["制定计划", "选择年级 · 范围 · 时间", "按自己的学习阶段安排背诵内容，在今日页查看进度与待复习任务。"],
      ["背诵与自测", "主动回想 · 乱序测试", "先背诵，再通过填空或选择题检验掌握情况，不只停留在看过。"],
      ["回到易错处", "错项回顾 · 再次测试", "答错的内容进入待复习，回看知识后再测试，把薄弱处逐步补上。"],
    ]),
    sections: Object.freeze([
      { id: "daily", label: "A DAILY LEARNING ROUTINE", title: "把背诵变成每天可完成的小事", description: "从今日任务出发，先主动回想，再核对答案。", screens: [
        { file: "today-learning.jpg", width: 1206, height: 2436, title: "今日学习，一眼看到进度", description: "查看背诵计划、已学内容与待复习任务，从首页开始当天的学习。", alt: "青鸟学习今日页，展示背诵计划、学习进度和学习入口" },
        { file: "biology-recall.jpg", width: 1206, height: 2459, title: "遮住答案，练习主动回想", description: "按教材章节选择内容，按住显示答案、松开隐藏；支持词条朗读与收藏。", alt: "生物背诵页，按住核对关键词答案，并提供朗读和收藏" },
      ] },
      { id: "understanding", label: "UNDERSTAND / CHECK / REVIEW", title: "结合图表理解，围绕易错点回顾", description: "文字、图表与测试反馈相互补充，让复习更有针对性。", screens: [
        { file: "textbook-images.jpg", width: 1206, height: 2452, title: "教材图表，随时对照", description: "按章节查看图片与表格，支持缩放、拖动和收藏，方便看清过程与细节。", alt: "教材图片页，以ATP为主动运输供能示意图展示图像浏览功能" },
        { file: "common-mistakes.jpg", width: 1206, height: 2454, title: "高频错误考点，查漏补缺", description: "查看匿名测试记录汇总的易错考点，回到对应词条，辨析容易混淆的知识。", alt: "高频错误考点页，展示匿名汇总的错误率排行；截图数据仅作界面示例" },
      ] },
      { id: "subjects", label: "SMALL STEPS, MORE SUBJECTS", title: "不止生物，也留一点时间给积累", description: "古诗文与英语单词，延续先回想、再核对的学习方式。", screens: [
        { file: "classical-chinese.jpg", width: 1206, height: 2468, title: "古诗文，分段巩固", description: "长篇内容分段呈现，按住查看、松开隐藏，一段一段练习背诵。", alt: "古诗文背诵页，屈原列传分段显示并可隐藏原文" },
        { file: "english-words.jpg", width: 1206, height: 2459, title: "英语单词，结合例句记忆", description: "对照音标、词性、释义与例句学习，隐藏释义后检验自己的记忆。", alt: "英语单词学习页，显示音标、释义和例句并支持隐藏释义" },
      ] },
    ]),
  });

  function viewport(key, eager = false) {
    const item = art[key], [, , width, height] = item.rect;
    return `<span class="tool-source-viewport" data-studio-style="--tool-art-ratio:${width}/${height};--tool-art-width:100%;--tool-art-left:0%;--tool-art-top:0%"><img ${root.AnderStudioImages.attributes(`notebook-${key}`, !eager)} alt="${escape(item.alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async"></span>`;
  }
  function figures(items, className) {
    return `<div class="${className}">${items.map(item => `<figure><div class="tool-image-mat">${viewport(item.art)}</div><figcaption><h4>${escape(item.title)}</h4><p>${escape(item.description)}</p></figcaption></figure>`).join("")}</div>`;
  }
  function cardMarkup(open = true) {
    const detailId = "studio-tool-detail-0", introId = `${detailId}-intro`;
    return `<article class="shelf-book shelf-book-featured shelf-tool${open ? " is-expanded" : ""}" data-studio-tool-id="${notebook.id}">
      <div class="book-hero tool-hero">
        <button type="button" class="book-cover-toggle notes-cover-toggle tool-cover-toggle" data-studio-tool="0" aria-expanded="${open}" aria-controls="${detailId} ${introId}" aria-label="砺冰笔记本，展开或收起介绍">
          <span class="notes-cover-label"><span class="book-number">01 / STUDIO</span><span class="notes-series">STUDIO TOOLS</span></span>
          <span class="tool-cover-art">${viewport("cover", true)}</span>
          <span class="notes-cover-caption"><strong>${notebook.title}</strong><span>规划 · 记录 · 复盘</span></span>
          <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
        </button>
        <header class="notes-heading book-hero-copy tool-hero-copy" id="${introId}"${open ? "" : " hidden"}>
          <span class="notes-edition">${notebook.edition} · ${notebook.fullTitle}</span>
          <h2>${notebook.title}</h2><p class="notes-subtitle">${notebook.subtitle}</p><p>${notebook.description}</p>
          <div class="tool-actions"><button type="button" class="tool-action" data-tool-samples aria-controls="notebook-samples">查看内页</button><button type="button" class="tool-action is-primary" disabled aria-describedby="notebook-purchase-note">购买</button></div>
          <p class="tool-action-note" id="notebook-purchase-note">购买入口待接入，当前仅作产品展示。</p>
        </header>
      </div>
      <div class="book-detail notes-detail tool-detail" id="${detailId}"${open ? "" : " hidden"}>
        <dl class="notes-stats book-stats-three" aria-label="笔记本概览">${notebook.stats.map(([number, label]) => `<div><dt>${label}</dt><dd>${number}</dd></div>`).join("")}</dl>
        <section class="tool-section" aria-labelledby="notebook-workflow-title"><header><span class="tool-section-label">PLAN / RECORD / REVIEW</span><h3 id="notebook-workflow-title">从计划到复盘，组织自己的学习</h3></header>
          <ol class="tool-workflow">${notebook.workflow.map(([title, tag, text], i) => `<li><span class="tool-step" aria-hidden="true">0${i + 1}</span><h4>${title}</h4><small>${tag}</small><p>${text}</p></li>`).join("")}</ol>
        </section>
        <section class="tool-section" aria-labelledby="notebook-covers-title"><header><span class="tool-section-label">TWO COVER DESIGNS</span><h3 id="notebook-covers-title">两种封面，各有风景</h3><p>厚涂油画风格，把山野与海岸留在日常书写里。</p></header>${figures(notebook.covers, "tool-cover-options")}</section>
        <section class="tool-section tool-samples" id="notebook-samples" aria-labelledby="notebook-samples-title"><header><span class="tool-section-label">A LOOK INSIDE</span><h3 id="notebook-samples-title" tabindex="-1">内页一览</h3><p>选取原始资料中的真实内页样张，看看计划与复盘如何落在纸上。</p></header>${figures(notebook.samples, "tool-page-samples")}</section>
        <section class="tool-section" aria-labelledby="notebook-writing-title"><header><h3 id="notebook-writing-title">三种基础内页，自由组织知识</h3></header>${figures(notebook.writing, "tool-writing-pages")}</section>
        <aside class="tool-letter" aria-labelledby="notebook-letter-title"><span class="tool-section-label">A LETTER TO YOU</span><h3 id="notebook-letter-title">给少年的信</h3><p>内含李林老师寄语，从学习动力与日常习惯谈起，为记录与行动写下一个开始。</p></aside>
        <section class="tool-section tool-specification" aria-labelledby="notebook-specs-title"><header><h3 id="notebook-specs-title">纸张、尺寸与装订</h3></header><dl class="tool-specs">${notebook.specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl><p class="tool-source-note">产品图片与规格依据所提供的 2027 新版资料整理。具体版本与在售款式以商品实际信息为准。</p></section>
      </div>
    </article>`;
  }
  function qingniaoMarkup(open = false) {
    const detailId = "studio-tool-detail-1", introId = `${detailId}-intro`, code = qingniao.code;
    return `<article class="shelf-book shelf-book-featured shelf-tool shelf-qingniao${open ? " is-expanded" : ""}" data-studio-tool-id="${qingniao.id}">
      <div class="book-hero tool-hero">
        <button type="button" class="book-cover-toggle notes-cover-toggle tool-cover-toggle" data-studio-tool="1" aria-expanded="${open}" aria-controls="${detailId} ${introId}" aria-label="青鸟学习，展开或收起介绍">
          <span class="notes-cover-label"><span class="book-number">02 / STUDIO</span><span class="notes-series">STUDIO TOOLS</span></span>
          <span class="qingniao-cover-art"><span class="qingniao-code"><img src="${code.src}" width="${code.width}" height="${code.height}" alt="${code.alt}" loading="eager" decoding="async"></span><span class="qingniao-scan-hint">微信扫一扫 · 进入青鸟学习</span></span>
          <span class="notes-cover-caption"><strong>${qingniao.title}</strong><span>计划 · 背诵 · 复习</span></span>
          <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
        </button>
        <header class="notes-heading book-hero-copy tool-hero-copy" id="${introId}"${open ? "" : " hidden"}>
          <span class="notes-edition">微信小程序 · 日常学习助手</span>
          <h2>${qingniao.title}</h2><p class="notes-subtitle">${qingniao.subtitle}</p><p>${qingniao.description}</p>
          <div class="qingniao-subjects" aria-label="本页展示内容"><span>高中生物</span><span>古诗文</span><span>英语单词</span></div>
          <div class="tool-actions"><button type="button" class="tool-action" data-qingniao-features aria-controls="qingniao-features">查看功能</button></div>
        </header>
      </div>
      <div class="book-detail notes-detail tool-detail qingniao-detail" id="${detailId}"${open ? "" : " hidden"}>
        <section class="tool-section tool-samples" id="qingniao-features" aria-labelledby="qingniao-features-title"><header><span class="tool-section-label">PLAN / RECALL / REVIEW</span><h3 id="qingniao-features-title" tabindex="-1">从今天开始，让学习形成循环</h3></header>
          <ol class="tool-workflow">${qingniao.workflow.map(([title, tag, text], i) => `<li><span class="tool-step" aria-hidden="true">0${i + 1}</span><h4>${title}</h4><small>${tag}</small><p>${text}</p></li>`).join("")}</ol>
        </section>
        ${qingniao.sections.map(section => `<section class="tool-section qingniao-section" aria-labelledby="qingniao-${section.id}-title"><header><span class="tool-section-label">${section.label}</span><h3 id="qingniao-${section.id}-title">${section.title}</h3><p>${section.description}</p></header><div class="qingniao-screens">${section.screens.map(screen => `<figure class="qingniao-screen"><figcaption><h4>${screen.title}</h4><p>${screen.description}</p></figcaption><div class="qingniao-screen-mat"><img ${root.AnderStudioImages.attributes(`qingniao-${screen.file.replace('.jpg', '')}`, !open)} alt="${screen.alt}" loading="lazy" decoding="async"></div></figure>`).join("")}</div></section>`).join("")}
        <aside class="tool-letter"><span class="tool-section-label">START WITH QINGNIAO</span><h3>慢慢背，稳稳会</h3><p>使用微信扫一扫，扫描页首小程序码，开始自己的学习计划。</p></aside>
        <p class="tool-source-note qingniao-source-note">以上为小程序界面示例。截图中的个人进度、人数与测试统计不代表当前数据，具体内容以小程序内展示为准。</p>
      </div>
    </article>`;
  }
  function placeholder(item, index) {
    return `<article class="shelf-book tool-placeholder" data-studio-tool-id="libing-tools"><span class="book-number">${String(index + 1).padStart(2, "0")} / STUDIO</span><div class="tool-empty-art" aria-hidden="true"></div><h2>${escape(item[0])}</h2><p>学习提效工具，即将上线，敬请期待。</p></article>`;
  }
  function render(items, expandedIndex = 0) {
    return `<div class="book-shelf tools-shelf" aria-label="工作室工具目录">${items.map((item, index) => index === 0 ? cardMarkup(expandedIndex === 0) : index === 1 ? qingniaoMarkup(expandedIndex === 1) : placeholder(item, index)).join("")}</div><p class="book-shelf-note">点击笔记本封面或青鸟学习小程序码展开介绍，再次点击收起。支持键盘回车操作，Esc 收起。</p>`;
  }
  function indexForId(id) { return id === notebook.id ? 0 : id === qingniao.id ? 1 : null; }
  root.AnderStudioTools = Object.freeze({ notebook, art, qingniao, render, cardMarkup, qingniaoMarkup, indexForId });
})(typeof window === "undefined" ? globalThis : window);
