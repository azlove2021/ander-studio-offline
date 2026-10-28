/* Website presentation metadata only. Published model packages stay untouched. */
(function (root) {
  "use strict";
  const books = Object.freeze([
    { id: "required-1", label: "必修一", title: "分子与细胞" },
    { id: "required-2", label: "必修二", title: "遗传与进化" },
    { id: "optional-1", label: "选择性必修一", title: "稳态与调节" },
    { id: "optional-2", label: "选择性必修二", title: "生物与环境" },
    { id: "optional-3", label: "选择性必修三", title: "生物技术与工程" },
  ]);
  const modules = Object.freeze({
    molecules: "required-1", "cell-structure": "required-1", "cell-metabolism": "required-1",
    "cell-life": "required-1", "molecules-and-cells": "required-1", genetics: "required-2", "molecular-genetics": "required-2", "variation-evolution": "required-2",
    homeostasis: "optional-1", ecology: "optional-2", biotechnology: "optional-3",
  });
  // A primary textbook shelf is a navigation aid, not a rewrite of the model's knowledge tags.
  const exceptions = Object.freeze({
    "dna-webgl": "required-2", "bacteriophage-reproduction": "required-2",
    "dna-replication": "required-2", "dna-transcription": "required-2", translation: "required-2",
    "optical-microscope": "required-1", "animal-cell": "required-1",
  });
  function bookFor(model) {
    const id = model.publishedModelId || model.id;
    if (exceptions[id]) return exceptions[id];
    // Meiosis, chromosome sets and associated inheritance observations belong to Book 2.
    if (model.moduleId === "cell-life" && model.number >= 49 && model.number <= 55) return "required-2";
    if (model.moduleId === "cell-structure" && [19, 20].includes(model.number)) return "optional-1";
    return modules[model.moduleId || model.module?.id] || null;
  }
  function collect(releases, roadmap) {
    const entries = [], seen = new Set(), unclassified = [];
    const source = new Map(roadmap.map(m => [m.publishedModelId || m.id, m]));
    for (const release of releases) {
      if (release.publish === false || seen.has(release.id)) continue;
      const plan = source.get(release.id);
      const book = (plan && bookFor(plan)) || bookFor(release);
      const entry = { id: release.id, book, state: "ready", release, order: plan?.order ?? 10000 };
      (book ? entries : unclassified).push(entry);
      seen.add(release.id);
    }
    for (const plan of roadmap) {
      const id = plan.publishedModelId || plan.id;
      if (seen.has(id)) continue;
      const book = bookFor(plan);
      // The release catalog, not an old roadmap flag, is the authority for availability.
      const entry = { id, book, state: "planned", plan, order: plan.order ?? 10000 };
      (book ? entries : unclassified).push(entry);
      seen.add(id);
    }
    entries.sort((a, b) => Number(b.state === "ready") - Number(a.state === "ready") || a.order - b.order || a.id.localeCompare(b.id));
    return { entries, unclassified };
  }
  const products = Object.freeze([
    { id: "books", title: "工作室图书", english: "STUDIO BOOKS", note: "把知识梳理成脉络，让学习与复习有据可循。", items: [
      ["生物笔记", "知识整理", "围绕高中生物学的知识梳理与学习笔记。"],
      ["一本通", "综合学习", "面向高中生物学的综合学习与复习资料。"],
      ["大题全刷", "非选择题", "聚焦非选择题的思考、分析与表达。"],
      ["小题全刷", "选择题", "围绕选择题开展知识巩固与辨析。"],
      ["遗传与进化", "教材专题", "聚焦遗传与进化模块的专题学习。"],
      ["生物技术与工程", "教材专题", "聚焦生物技术与工程模块的专题学习。"],
      ["规划图书", "后续规划", "为后续图书保留展示位置，具体内容待补充。"],
    ] },
    { id: "courses", title: "工作室课程", english: "STUDIO COURSES", note: "从同步学习到专题突破，让理解逐步深入。", items: [
      ["高一同步课", "同步学习", "围绕高一阶段的生物学学习展开。"],
      ["高二同步课", "同步学习", "围绕高二阶段的生物学学习展开。"],
      ["高三复习课", "系统复习", "面向高三复习，梳理知识与思考方法。"],
      ["专题课", "专题学习", "围绕具体主题组织学习内容。"],
    ] },
    { id: "tools", title: "工作室工具", english: "STUDIO TOOLS", note: "把日常学习中的小需求，变成顺手的工具。", items: [
      ["砺冰笔记本", "学习记录", "用于记录、整理与回顾学习内容。"],
      ["青鸟学习", "小程序", "为日常学习提供便捷入口。"],
      ["砺冰工具", "小程序", "为学习中的常用需求提供工具入口。"],
    ] },
  ]);
  root.AnderStudioLibrary = Object.freeze({ books, bookFor, collect, products });
})(typeof window === "undefined" ? globalThis : window);
