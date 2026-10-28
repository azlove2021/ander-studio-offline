/* Source-backed course introductions. No enrollment, payment or account integration. */
(function (root) {
  "use strict";
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const course = Object.freeze({
    id: "senior-three", index: 2, title: "高三生物全年复习课", cohort: "2027届", teacher: "李林",
    sourceUrl: "https://www.lckmzx.com/course/1205?nav=3&advisor_id=0", checkedAt: "2026-09-23",
    portrait: "assets/courses/teacher-senior-three-r3.png", portraitWidth: 1401, portraitHeight: 1491,
    format: "录播 + 直播",
    subtitle: "从知识梳理，到方法运用，再到考前整合。",
    description: "围绕高中生物五册教材组织全年复习，将知识、题型与分析方法联系起来。按一轮、二轮、三轮逐步推进，兼顾基础理解、专题训练与考前回顾。",
    stats: Object.freeze([["3", "轮系统复习"], ["5", "册教材内容"], ["4", "项核心能力"], ["183", "平台标注课时"]]),
    stages: Object.freeze([
      { title: "一轮 · 夯实基础", tag: "知识与方法", description: "按知识模块梳理概念、原理与常见题型，联系细胞、遗传、调节、生态及实验，建立完整的知识脉络。", keywords: "概念理解 / 原理梳理 / 题型归纳" },
      { title: "二轮 · 专题训练", tag: "联系与应用", description: "结合分类真题串联核心知识，训练信息分析、逻辑推导、长句表达与实验设计，将理解转化为作答方法。", keywords: "专题串联 / 真题分类 / 能力训练" },
      { title: "三轮 · 考前整合", tag: "实战与回归", description: "结合模拟套卷练习与讲解，检查知识和方法中的薄弱环节，再回到五册教材梳理概念与知识联系。", keywords: "模拟练习 / 查缺补漏 / 回归教材" },
    ]),
    abilities: Object.freeze([
      ["信息分析", "辨认题干条件，提取关键变量与证据。"],
      ["逻辑推导", "联系已有知识，说明条件与结论之间的关系。"],
      ["长句表达", "有层次地组织语言，写清分析过程与依据。"],
      ["实验设计", "围绕实验目的，梳理变量、对照与结果分析。"],
    ]),
    firstRound: Object.freeze(["绪论 · 生物学是什么", "组成细胞的分子", "细胞的基本结构", "细胞的物质输入和输出", "细胞的能量供应和利用", "细胞的生命历程", "古典遗传学", "分子遗传学", "生物的变异与进化", "人体内环境稳态与调节", "植物生命活动的调节", "基础生态学", "生物技术与工程", "科学史实验", "教材基础实验", "探究性实验"]),
    laterRounds: Object.freeze([
      ["指导篇", "五册教材的命题重点与备考方向"],
      ["能力篇", "信息分析、长句表达、实验分析与设计"],
      ["体系篇", "细胞代谢、遗传、生理、生态与基因工程"],
      ["刷题篇", "真题分类讲解，归纳解题规律"],
      ["套卷篇", "模拟卷练习与分析"],
      ["回归篇", "回到五册教材，复盘核心概念"],
    ]),
  });

  const learningFormats = Object.freeze([
    ["核心知识", "理解概念与原理，梳理知识之间的联系。"],
    ["刷题巩固", "围绕重点题型练习，把理解落实到解题。"],
    ["实验专题", "梳理实验原理、变量与分析方法。"],
    ["能力训练", "练习信息分析、长句表达与实验分析设计。"],
    ["体系构建", "回看章节脉络，把分散知识组织成框架。"],
    ["复习总结", "配合阶段复习，查找薄弱环节并巩固。"],
  ]);
  const annualDefaults = {
    teacher: course.teacher, format: course.format, checkedAt: course.checkedAt,
    coverLabel: "全年同步课", routeTitle: "按学期展开，串联一年的学习",
    learningTitle: "六类课程，相互配合", learningLabel: "课程结构与学习支持", abilities: learningFormats,
  };
  const annualCourses = Object.freeze([
    Object.freeze({
      ...annualDefaults, id: "senior-one", index: 0, shortTitle: "高一同步课", coverTitle: "高一生物",
      portrait: "assets/courses/teacher-senior-one-r3.png", portraitWidth: 1830, portraitHeight: 1971,
      title: "高一生物全年同步课", cohort: "2029届", sourceUrl: "https://www.lckmzx.com/course/1202?advisor_id=16",
      subtitle: "从细胞到遗传，打好高中生物的基础。",
      description: "围绕必修一《分子与细胞》和必修二《遗传与进化》展开全年同步学习。把知识讲解、题型练习与实验方法联系起来，在章节学习中逐步建立体系。",
      stats: Object.freeze([["2", "册必修教材"], ["2", "个学期安排"], ["6", "类课程结构"], ["110", "平台标注课时"]]),
      stages: Object.freeze([
        { title: "高一上 · 分子与细胞", tag: "必修一", description: "从组成细胞的分子出发，理解细胞结构、物质运输、能量代谢与生命历程，结合实验观察和题型练习巩固。", keywords: "结构与功能 / 细胞代谢 / 实验观察" },
        { title: "高一下 · 遗传与进化", tag: "必修二", description: "联系细胞分裂、遗传规律与基因的分子基础，梳理变异和进化，在遗传问题中练习推理与方法运用。", keywords: "遗传规律 / 分子遗传 / 变异与进化" },
      ]),
      outlines: Object.freeze([
        { title: "高一上课程目录", note: "分子与细胞 · 内容概览", items: ["走进细胞", "组成细胞的分子", "细胞的基本结构", "细胞的物质输入和输出", "细胞代谢：酶、ATP、呼吸与光合", "细胞的生命历程", "教材实验与能力训练", "知识体系构建与阶段复习"] },
        { title: "高一下课程目录", note: "遗传与进化 · 内容概览", items: ["遗传的细胞学基础：分裂与受精", "遗传规律与解题方法", "伴性遗传与遗传题型归纳", "基因的本质与 DNA 复制", "基因的表达", "生物的变异与进化", "教材实验与能力训练", "知识体系构建与阶段复习"] },
      ]),
    }),
    Object.freeze({
      ...annualDefaults, id: "senior-two", index: 1, shortTitle: "高二同步课", coverTitle: "高二生物",
      portrait: "assets/courses/teacher-senior-two-r3.png", portraitWidth: 1608, portraitHeight: 1551,
      title: "高二生物全年同步课", cohort: "2028届", sourceUrl: "https://www.lckmzx.com/course/1199?advisor_id=0",
      subtitle: "从稳态到生态与工程，把知识连成体系。",
      description: "覆盖三册选择性必修教材，将稳态与调节、生物与环境、生物技术与工程逐步串联。同步学习之外安排零轮复习，为后续系统复习做好衔接。",
      stats: Object.freeze([["3", "册选择性必修"], ["2", "个学期安排"], ["6", "类课程结构"], ["114", "平台标注课时"]]),
      stages: Object.freeze([
        { title: "高二上 · 稳态与生态", tag: "选择性必修一、二", description: "联系人体内环境、神经体液与免疫调节、植物调节，再拓展到种群、群落和生态系统，训练信息题分析。", keywords: "生命活动调节 / 生态系统 / 信息分析" },
        { title: "高二下 · 工程与衔接", tag: "选择性必修三 + 零轮复习", description: "学习发酵、细胞与基因工程，结合实验分析形成知识框架；通过零轮复习回看代谢、分裂、遗传等重点内容。", keywords: "生物技术 / 实验方法 / 零轮复习" },
      ]),
      outlines: Object.freeze([
        { title: "高二上课程目录", note: "稳态与调节、生物与环境", items: ["人体内环境与稳态", "神经、体液与免疫调节", "植物生命活动的调节", "种群与群落", "生态系统的结构与功能", "稳态与生态信息题方法", "教材实验与能力训练", "知识体系构建与阶段复习"] },
        { title: "高二下课程目录", note: "生物技术与工程、零轮复习", items: ["发酵工程", "植物与动物细胞工程", "胚胎工程", "基因工程的工具、步骤与应用", "DNA 相关实验与能力训练", "零轮复习：代谢、分裂与遗传", "零轮复习：调节、生态与工程", "知识体系构建与阶段复习"] },
      ]),
    }),
    course,
  ]);
  const topics = Object.freeze([
    Object.freeze({ id: "genetics", title: "遗传专题课", description: "从概念到能力，全面解决遗传题。", image: "assets/courses/genetics-r3.png", alt: "豌豆植株与果蝇的遗传主题插画" }),
    Object.freeze({ id: "gene-engineering", title: "基因工程专题课", description: "从基础到拓展，解决基因工程复杂信息分析。", image: "assets/courses/gene-engineering-r3.png", alt: "向导 RNA 引导 CRISPR-Cas9 切割 DNA 的主题插画" }),
    Object.freeze({ id: "cell-division", title: "细胞分裂专题课", description: "构建模型、形成体系，全面掌握细胞分裂。", image: "assets/courses/cell-division-r3.png", alt: "减数分裂Ⅰ后期的一个细胞，同源染色体分向两极，周围有虚化的小细胞" }),
  ]);

  function outlinesMarkup(course) {
    if (course.outlines) return course.outlines.map(outline => `<details class="notes-outline"><summary><span><strong>${escape(outline.title)}</strong><span>${escape(outline.note)}</span></span><span class="notes-outline-cue" aria-hidden="true"></span></summary><ol>${outline.items.map((title, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${escape(title)}</li>`).join("")}</ol></details>`).join("");
    return `<details class="notes-outline"><summary><span><strong>一轮课程目录</strong><span>绪论与 15 个专题模块</span></span><span class="notes-outline-cue" aria-hidden="true"></span></summary><ol>${course.firstRound.map((title, i) => `<li><span>${String(i).padStart(2, "0")}</span>${escape(title)}</li>`).join("")}</ol></details>
      <details class="notes-outline"><summary><span><strong>二、三轮课程安排</strong><span>六个板块，循序推进</span></span><span class="notes-outline-cue" aria-hidden="true"></span></summary><ol class="course-later-outline">${course.laterRounds.map(([title, text]) => `<li><strong>${escape(title)}</strong><p>${escape(text)}</p></li>`).join("")}</ol></details>`;
  }

  function featuredMarkup(course, item, index, open) {
    const detailId = `studio-course-detail-${index}`, introId = `${detailId}-intro`;
    const shortTitle = escape(item[0]), coverTitle = course.coverTitle || "高三生物", coverLabel = course.coverLabel || "全年复习课";
    return `<article class="shelf-book shelf-book-featured shelf-course annual-course${course.id === "senior-three" ? " senior-course" : ""}${open ? " is-expanded" : ""}" data-studio-course-id="${course.id}">
      <div class="book-hero course-hero">
        <button type="button" class="book-cover-toggle notes-cover-toggle course-cover-toggle" data-studio-course="${index}" aria-expanded="${open}" aria-controls="${detailId} ${introId}" aria-label="${shortTitle}，展开或收起介绍">
          <span class="notes-cover-label"><span class="book-number">${String(index + 1).padStart(2, "0")} / STUDIO</span><span class="notes-series">STUDIO COURSES</span></span>
          <span class="course-cover-art"><span class="course-cover-poster">
            <img ${root.AnderStudioImages.attributes(`teacher-${course.id}`)} alt="李林老师" decoding="async">
            <span class="course-cover-copy"><small>${course.cohort.slice(0, 4)} · BIOLOGY</small><strong>${coverTitle}</strong><span>${coverLabel} · 李林主讲</span></span>
          </span></span>
          <span class="notes-cover-caption"><strong>${shortTitle}</strong><span>${course.cohort} · ${coverLabel}</span></span>
          <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
        </button>
        <header class="notes-heading book-hero-copy course-hero-copy" id="${introId}"${open ? "" : " hidden"}>
          <span class="notes-edition">${course.cohort} · ${course.format}</span>
          <h2>${course.title}</h2><p class="course-teacher">${course.teacher}老师 主讲</p>
          <p class="notes-subtitle">${course.subtitle}</p><p>${course.description}</p>
          <div class="course-actions"><button type="button" class="course-action" data-course-outline="${index}" aria-controls="studio-course-outlines-${index}">查看课程大纲</button><a class="course-action is-primary" href="${escape(course.sourceUrl)}" target="_blank" rel="noopener noreferrer">前往课程平台</a></div>
          <p class="course-action-note">课程平台将在新窗口打开。</p>
        </header>
      </div>
      <div class="book-detail notes-detail course-detail" id="${detailId}"${open ? "" : " hidden"}>
        <dl class="notes-stats" aria-label="课程概览">${course.stats.map(([number, label]) => `<div><dt>${label}</dt><dd>${number}</dd></div>`).join("")}</dl>
        <section class="course-route${course.stages.length === 2 ? " course-route-two" : ""}" aria-labelledby="course-route-title-${index}"><h3 id="course-route-title-${index}">${course.routeTitle || "一年的复习，分三步走"}</h3>
          <ol>${course.stages.map((stage, i) => `<li><span class="course-stage-number" aria-hidden="true">0${i + 1}</span><div><span class="course-stage-tag">${stage.tag}</span><h4>${stage.title}</h4><p>${stage.description}</p><small>${stage.keywords}</small></div></li>`).join("")}</ol>
        </section>
        <section class="notes-features course-learning" aria-label="${course.learningLabel || "能力训练与学习支持"}">
          <div class="book-keypoints"><h3>${course.learningTitle || "把四项能力，落实到具体问题"}</h3><ul>${course.abilities.map(([title, text]) => `<li><strong>${title}</strong><p>${text}</p></li>`).join("")}</ul></div>
          <div class="course-support"><h3>课程之外，也有学习支持</h3><dl><div><dt>录播与直播</dt><dd>兼顾按进度学习与集中讲解。</dd></div><div><dt>答疑</dt><dd>围绕学习中遇到的问题，获得解答与反馈。</dd></div><div><dt>督学</dt><dd>配合课程学习，关注学习过程与进度。</dd></div></dl><p>具体安排及服务范围以课程平台说明为准。</p></div>
        </section>
        <section class="course-outlines" id="studio-course-outlines-${index}" aria-label="课程内容目录">
          ${outlinesMarkup(course)}
        </section>
        <footer class="course-source-note"><p>按 ${course.cohort}公开课程介绍整理 · ${course.checkedAt} 核对。课时、课表与最新安排以课程平台为准。</p><a href="${escape(course.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看原课程介绍</a></footer>
      </div>
    </article>`;
  }

  function topicsMarkup(item, index, open) {
    const title = escape(item[0]), detailId = `studio-course-detail-${index}`;
    return `<article class="shelf-book shelf-book-featured shelf-course topic-collection${open ? " is-expanded" : ""}" data-studio-course-id="topics">
      <button type="button" class="book-cover-toggle notes-cover-toggle" data-studio-course="${index}" aria-expanded="${open}" aria-controls="${detailId}" aria-label="${title}，展开或收起介绍">
        <span class="notes-cover-label"><span class="book-number">${String(index + 1).padStart(2, "0")} / STUDIO</span></span>
        <span class="topic-cover-art" aria-hidden="true"><img ${root.AnderStudioImages.attributes(topics[0].id)} alt="" loading="lazy" decoding="async"></span>
        <span class="notes-cover-caption"><strong>${title}</strong><span>遗传 · 基因工程 · 细胞分裂</span></span>
        <span class="book-cover-cue" aria-hidden="true">${open ? "−" : "+"}</span>
      </button>
      <div class="book-detail notes-detail topic-detail" id="${detailId}"${open ? "" : " hidden"}>
        <h2>${title}</h2>
        <div class="topic-grid">${topics.map(topic => `<article class="topic-card" data-topic-id="${topic.id}"><img ${root.AnderStudioImages.attributes(topic.id, !open)} alt="${topic.alt}" loading="lazy" decoding="async"><div><h3>${topic.title}</h3><p>${topic.description}</p></div></article>`).join("")}</div>
      </div>
    </article>`;
  }

  function render(items, expandedIndex = course.index) {
    return `<div class="book-shelf course-shelf" aria-label="工作室课程目录">${items.map((item, index) => annualCourses[index] ? featuredMarkup(annualCourses[index], item, index, expandedIndex === index) : topicsMarkup(item, index, expandedIndex === index)).join("")}</div><p class="book-shelf-note">点击课程卡片展开或收起介绍。支持键盘 Tab、方向键和回车操作。</p>`;
  }
  function indexForId(id) {
    if (id === "topics") return 3;
    return annualCourses.find(item => item.id === id)?.index ?? null;
  }
  root.AnderStudioCourses = Object.freeze({ course, annualCourses, topics, render, indexForId });
})(typeof window === "undefined" ? globalThis : window);
