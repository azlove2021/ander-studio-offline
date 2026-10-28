/* Editorial book introductions. Trial PDFs await supplied files; no checkout or account changes. */
(function (root) {
  "use strict";
  const notes = Object.freeze({
    id: "biology-notes",
    title: "生物笔记",
    author: "李林",
    publisher: "东北师范大学出版社",
    coverSize: 800,
    edition: "全国通用 · 高中全阶段",
    subtitle: "高中生物知识拓展与题型系统汇编",
    description: "以教材核心知识为主线，将知识拓展、研究方法与经典题型串联起来，让学习与复习有脉络可循。",
    cover: "assets/books/biology-notes/cover.png",
    illustration: "assets/books/biology-notes/model-art-source.jpg",
    stats: Object.freeze([["10", "大知识模块"], ["175", "个微专题"], ["446", "道经典例题"], ["300+", "张模型彩图"]]),
    topics: Object.freeze([["98", "知识拓展"], ["11", "研究方法"], ["66", "题型归纳"]]),
    modules: Object.freeze(["细胞的结构基础", "细胞代谢", "细胞的生命历程", "古典遗传学", "分子遗传学", "生物的变异与进化", "稳态与调节", "生物与环境", "生物技术与工程", "实验与探究"]),
  });
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

  // Keep the accepted source-backed content; all six covers share the same header.
  function heroMarkup(book, index, open) {
    const detailId = `studio-book-detail-${index}`, introId = `${detailId}-intro`;
    return `<div class="book-hero">
      <button type="button" class="book-cover-toggle notes-cover-toggle" data-studio-book="${index}" aria-expanded="${Boolean(open)}" aria-controls="${detailId} ${introId}" aria-label="${escape(book.title)}，展开或收起介绍">
        <span class="notes-cover-label"><span class="book-number">${String(index + 1).padStart(2, "0")} / STUDIO</span><span class="notes-series">溯光系列</span></span>
        <span class="notes-cover-art"><img src="assets/performance/${escape(book.id)}-384-r1.webp" srcset="assets/performance/${escape(book.id)}-384-r1.webp 384w, assets/performance/${escape(book.id)}-768-r1.webp 768w" sizes="300px" width="${book.coverSize}" height="${book.coverSize}" alt="${escape(book.title)}实体书封面，李林主编" loading="lazy" decoding="async"></span>
        <span class="notes-cover-caption"><strong>${escape(book.title)}</strong><span>李林 主编</span></span>
        <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
      </button>
      <header class="notes-heading book-hero-copy" id="${introId}"${open ? "" : " hidden"}>
        <span class="notes-edition">${escape(book.edition)}</span>
        <h2 id="${detailId}-title">${escape(book.displayTitle || book.title)}</h2>
        <p class="notes-subtitle">${escape(book.subtitle)}</p>
        <p>${escape(book.description)}</p>
        <div class="book-actions" aria-label="${escape(book.title)}试读与购买">
          <div><button type="button" class="book-action book-action-trial" disabled aria-describedby="${detailId}-trial-status">试读</button><span id="${detailId}-trial-status">高清 PDF 待补充</span></div>
          <div><button type="button" class="book-action book-action-buy" disabled aria-describedby="${detailId}-buy-status">购买</button><span id="${detailId}-buy-status">店铺链接待开放</span></div>
        </div>
      </header>
    </div>`;
  }

  function notesMarkup(title, index, open) {
    if (title !== notes.title || !Number.isInteger(index) || index < 0) return "";
    const detailId = `studio-book-detail-${index}`;
    return `<article class="shelf-book shelf-book-featured${open ? " is-expanded" : ""}" data-studio-book-id="${notes.id}">
      ${heroMarkup(notes, index, open)}
      <div class="book-detail notes-detail" id="${detailId}"${open ? "" : " hidden"}>
        <dl class="notes-stats" aria-label="图书内容概览">${notes.stats.map(([value, label]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>
        <section class="notes-audience" aria-label="适用学段与学习建议">
          <div><h3>高一 · 高二</h3><p>随课梳理知识，夯实基础、适度拓展。</p></div>
          <div><h3>高三复习</h3><p>系统回顾知识，归纳题型、专项突破。</p></div>
        </section>
        <section class="notes-features" aria-label="内容特点">
          <div class="notes-methods"><h3>知识、方法与题型相互连接</h3><ul>${notes.topics.map(([count, label]) => `<li><strong>${escape(count)}</strong><span>个${escape(label)}专题</span></li>`).join("")}</ul><p>结合经典例题与解析，从知识理解走向解题运用。</p></div>
          <div class="notes-visual"><h3>用模型彩图，看清生命过程</h3><figure><div class="notes-model-crop"><img src="${notes.illustration}" width="2400" height="2400" alt="书内物质运输模式图，展示自由扩散、协助扩散、主动运输与协同转运" loading="lazy" decoding="async"></div><figcaption>李林老师绘制 · 书内模型彩图</figcaption></figure></div>
        </section>
        <details class="notes-outline"><summary><span><strong>10 大知识模块</strong><span>查看目录概览</span></span><span class="notes-outline-cue" aria-hidden="true"></span></summary><ol>${notes.modules.map((module, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${escape(module)}</li>`).join("")}</ol></details>
        <footer class="notes-publication"><span>${escape(notes.author)} 主编</span><span>${escape(notes.publisher)}</span></footer>
      </div>
    </article>`;
  }
  const additions = [
    {
      id: "all-in-one", title: "一本通", displayTitle: "高中生物一本通", coverSize: 2400,
      edition: "全国通用 · 高中全阶段", subtitle: "把五册教材，梳理成随时可查的知识脉络",
      description: "围绕教材核心知识，以必背考点、核心图示和对比表格帮助记忆。结合挖空自查，把“看过”变成对知识的主动回忆。",
      stats: [["5", "册教材知识"], ["1000", "句必背考点"], ["117", "个核心图示"], ["19", "个总结表格"]],
      audience: [["高一 · 高二", "配合课堂随学随记，课后用填空检查掌握情况。"], ["高三复习", "回顾教材核心知识，集中排查遗忘点与易混点。"]],
      methodsTitle: "让记忆有线索，让自查有依据",
      methods: [["考点速记", "以关键语句串联教材知识。"], ["图表对照", "用结构图和表格辨析概念、建立联系。"], ["挖空自查", "先独立回忆，再核对、回看薄弱知识。"]],
      visual: { title: "把抽象结构，放进清晰图示", alt: "一本通书内原核细胞图示，包括大肠杆菌、蓝细菌与支原体", caption: "书内核心图示 · 原核细胞", crop: [85, 552, 1435, 440] },
      outlineTitle: "五册教材内容", modules: ["必修一 · 分子与细胞", "必修二 · 遗传与进化", "选择性必修一 · 稳态与调节", "选择性必修二 · 生物与环境", "选择性必修三 · 生物技术与工程"],
    },
    {
      id: "long-answer", title: "大题全刷", coverSize: 1600,
      edition: "全国通用 · 专项训练", subtitle: "生物三年真题分类全刷 · 非选择题",
      description: "将高考非选择题按知识模块与考查方式整理，围绕信息提取、实验分析和规范表达开展专项训练。收录真题年份为 2023—2025 年。",
      stats: [["8", "大知识模块"], ["30+", "个大题题组"], ["100+", "个考点及题型"], ["300+", "道分类真题"]],
      audience: [["高一 · 高二", "按已学内容选择题组，逐步熟悉非选择题的分析与表达。"], ["高三一轮 · 二轮", "一轮分模块训练，二轮重做薄弱题组、整理答题思路。"]],
      methodsTitle: "由知识模块，走向完整作答",
      methods: [["模块导读", "先梳理知识主线与模块考查要点。"], ["题组训练", "区分基本原理、信息分析与实验类题。"], ["解析复盘", "对照解析，检查推理环节与作答表述。"]],
      flow: { title: "一次大题训练的三个着力点", steps: [["读懂信息", "找出条件、变量与设问要求"], ["建立联系", "联系知识，梳理证据与结论"], ["组织表达", "按逻辑作答，再对照解析复盘"]] },
      outlineTitle: "8 大知识模块", modules: ["细胞代谢", "遗传与进化", "稳态与调节", "生物与环境", "生物技术与工程", "信息分析类题", "实验分析类题", "实验设计与结果预测"],
    },
    {
      id: "short-answer", title: "小题全刷", coverSize: 800,
      edition: "全国通用 · 专项训练", subtitle: "生物三年真题分类全刷 · 选择题",
      description: "把选择题训练拆解到细分专题，结合模块导读与考情分析，定位知识漏洞、辨析选项中的关键条件。收录真题年份为 2023—2025 年。",
      stats: [["12", "大知识模块"], ["142", "个细分专题"], ["1000+", "道分类真题"]],
      audience: [["高一 · 高二", "随课选择对应专题，巩固基础、及时发现知识漏洞。"], ["高三一轮 · 二轮", "一轮系统刷练，二轮针对易错专题重做与复盘。"]],
      methodsTitle: "按专题练习，把薄弱点看清",
      methods: [["细分专题", "将大模块拆成可逐项训练的知识点。"], ["考情分析", "结合知识定位与考点分布安排练习。"], ["分类真题", "在真实题目中检验理解，归纳错误原因。"]],
      flow: { title: "让每次刷题，都有一次回看", steps: [["按专题练", "聚焦当前知识点，独立完成"], ["逐项辨析", "回到题干条件，核对选项依据"], ["重做易错", "整理错因，回看知识与解析"]] },
      outlineTitle: "12 大知识模块", modules: ["组成细胞的分子", "细胞的基本结构", "细胞代谢", "细胞的生命历程", "古典遗传学", "分子遗传学", "变异与进化", "稳态与调节", "生物与环境", "生物技术与工程", "实验与实验设计", "生物知识综合与信息分析"],
    },
    {
      id: "genetics-evolution", title: "遗传与进化", coverSize: 2400,
      edition: "全国通用 · 高中全阶段", subtitle: "从遗传规律到分子基础，串联遗传与进化",
      description: "以古典遗传学、现代遗传学两个分册组织内容，覆盖必修二的核心知识。将概念讲解、典型例题和习题训练结合起来，逐步建立遗传学的分析思路。",
      stats: [["7", "大知识模块"], ["2", "册专题讲练"], ["全彩", "手绘插图"]],
      audience: [["同步学习", "配合必修二学习，理解基本概念与遗传规律。"], ["专题复习", "归纳常见题型，联系细胞、分子与个体层面的遗传。"]],
      methodsTitle: "把概念、推理与训练接起来",
      methods: [["原理与方法", "梳理遗传规律，学习配子法、分解组合法。"], ["题型与讲练", "通过典型例题与对应习题练习分析方法。"], ["图解与拓展", "用手绘彩图和延伸阅读理解知识背景。"]],
      visual: { title: "用图像理解遗传信息的表达", alt: "遗传与进化书内基因表达示意图，展示 DNA 转录为 mRNA、再翻译为蛋白质", caption: "李林老师手绘 · 基因表达的过程", crop: [108, 580, 590, 380] },
      outlineTitle: "7 大模块 · 两个分册", modules: ["古典 · 遗传学基本原理", "古典 · 遗传学分析方法", "古典 · 古典遗传学常规题型归纳", "古典 · 遗传的新信息分析类题", "现代 · 遗传的分子基础", "现代 · 遗传的细胞学基础", "现代 · 生物的变异与进化"],
    },
    {
      id: "biotechnology", title: "生物技术与工程", coverSize: 2400,
      edition: "全国通用 · 高二高三", subtitle: "从技术原理到应用情境，理解每一步操作",
      description: "以“发酵工程与细胞工程”“基因工程”两个分册覆盖选择性必修三内容。结合示意图、对比表格与案例，梳理技术原理、操作过程及其应用。",
      stats: [["5", "大知识模块"], ["2", "册专题讲练"], ["图解", "技术流程"]],
      audience: [["高二同步", "配合选择性必修三，逐步理解概念与操作流程。"], ["高三专题", "联系不同技术的原理与应用，训练信息分析能力。"]],
      methodsTitle: "将抽象技术，拆成可理解的步骤",
      methods: [["概念对照", "示意图配合表格，辨清易混概念。"], ["流程拆解", "按关键步骤梳理操作，理解先后关系。"], ["案例应用", "联系实际案例与前沿信息，练习迁移运用。"]],
      visual: { title: "用手绘彩图，建立结构与过程的联系", alt: "生物技术与工程书内核糖体彩图，展示大小亚基和 tRNA 与核糖体的结合", caption: "李林老师手绘 · 核糖体及其与 tRNA 的结合", crop: [130, 1065, 1355, 455] },
      outlineTitle: "双分册内容", outlineHint: "查看分册安排", modules: ["发酵工程与细胞工程", "基因工程"],
    },
  ].map(book => Object.freeze({ author: "李林", publisher: "广东教育出版社", ...book, cover: `assets/books/${book.id}/cover.png`, illustration: book.visual ? `assets/books/${book.id}/illustration-source.jpg` : null }));
  const books = Object.freeze([notes, ...additions]);
  const planning = Object.freeze({ id: "planned-books", title: "规划图书", titles: Object.freeze(["生物刷题", "生物手卡", "分子与细胞", "稳态与环境"]) });

  function indexForId(id) {
    if (id === planning.id) return books.length;
    const index = books.findIndex(book => book.id === id);
    return index < 0 ? null : index;
  }

  function planningMarkup(index, open) {
    const detailId = `studio-book-detail-${index}`;
    return `<article class="shelf-book shelf-book-featured shelf-book-planning${open ? " is-expanded" : ""}" data-studio-book-id="${planning.id}">
      <button type="button" class="book-cover-toggle notes-cover-toggle" data-studio-book="${index}" aria-expanded="${Boolean(open)}" aria-controls="${detailId}" aria-label="规划图书，展开或收起介绍">
        <span class="notes-cover-label"><span class="book-number">07 / STUDIO</span><span class="notes-series">正在规划</span></span>
        <span class="planned-cover-stack" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <span class="notes-cover-caption"><strong>规划图书</strong><span>四本新书 · 敬请期待</span></span>
        <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
      </button>
      <div class="book-detail notes-detail planned-detail" id="${detailId}"${open ? "" : " hidden"}>
        <header><h2>规划图书</h2><p>四本新书正在规划，封面与详细介绍将陆续补充。</p></header>
        <div class="planned-books-grid">${planning.titles.map((title, i) => `<figure class="planned-book">
          <div class="planned-book-art" role="img" aria-label="${escape(title)}封面占位图"><span class="planned-book-number">${String(i + 1).padStart(2, "0")}</span><span class="planned-book-cover" aria-hidden="true"><small>ANDER BIOLOGY</small><strong>${escape(title)}</strong><span>封面待补充</span></span></div>
          <figcaption><h3>${escape(title)}</h3><span>规划中</span></figcaption>
        </figure>`).join("")}</div>
      </div>
    </article>`;
  }

  function featureMarkup(book) {
    const methods = `<div class="book-keypoints"><h3>${escape(book.methodsTitle)}</h3><ul>${book.methods.map(([title, text]) => `<li><strong>${escape(title)}</strong><p>${escape(text)}</p></li>`).join("")}</ul></div>`;
    if (book.visual) {
      // Crop coordinates use the 1600px reference view of each untouched 2400px source.
      const { title, alt, caption, crop: [x, y, width, height] } = book.visual;
      const viewport = `--book-art-ratio:${width}/${height};--book-art-width:${1600 / width * 100}%;--book-art-left:${-x / width * 100}%;--book-art-top:${-y / height * 100}%`;
      return `${methods}<div class="notes-visual"><h3>${escape(title)}</h3><figure><div class="notes-model-crop book-source-crop" data-studio-style="${viewport}"><img src="${escape(book.illustration)}" width="2400" height="2400" alt="${escape(alt)}" loading="lazy" decoding="async"></div><figcaption>${escape(caption)}</figcaption></figure></div>`;
    }
    return `${methods}<div class="book-study-flow"><h3>${escape(book.flow.title)}</h3><ol>${book.flow.steps.map(([title, text], i) => `<li><span aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><div><strong>${escape(title)}</strong><p>${escape(text)}</p></div></li>`).join("")}</ol><p class="book-flow-note">学习建议 · 可按自身进度安排</p></div>`;
  }

  function cardMarkup(title, index, open) {
    if (!Number.isInteger(index) || index < 0) return "";
    if (title === planning.title) return planningMarkup(index, open);
    if (title === notes.title) return notesMarkup(title, index, open);
    const book = additions.find(item => item.title === title);
    if (!book) return "";
    const detailId = `studio-book-detail-${index}`;
    return `<article class="shelf-book shelf-book-featured${open ? " is-expanded" : ""}" data-studio-book-id="${book.id}">
      ${heroMarkup(book, index, open)}
      <div class="book-detail notes-detail" id="${detailId}"${open ? "" : " hidden"}>
        <dl class="notes-stats${book.stats.length === 3 ? " book-stats-three" : ""}" aria-label="图书内容概览">${book.stats.map(([value, label]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>
        <section class="notes-audience" aria-label="适用学段与学习建议">${book.audience.map(([title, text]) => `<div><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`).join("")}</section>
        <section class="notes-features" aria-label="内容特点">${featureMarkup(book)}</section>
        <details class="notes-outline"><summary><span><strong>${escape(book.outlineTitle)}</strong><span>${escape(book.outlineHint || "查看目录概览")}</span></span><span class="notes-outline-cue" aria-hidden="true"></span></summary><ol>${book.modules.map((module, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${escape(module)}</li>`).join("")}</ol></details>
        <footer class="notes-publication"><span>${escape(book.author)} 主编</span><span>${escape(book.publisher)}</span></footer>
      </div>
    </article>`;
  }
  root.AnderStudioBooks = Object.freeze({ notes, books, planning, cardMarkup, indexForId });
})(typeof window === "undefined" ? globalThis : window);
