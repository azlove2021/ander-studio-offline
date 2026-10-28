(function () {
  "use strict";

  const modules = [
    {
      id: "molecules",
      title: "模块一：组成细胞的分子",
      shortTitle: "组成细胞的分子",
      models: [
        [1, "组成细胞的元素（2D）"],
        [2, "水的结构与流动性（3D）"],
        [3, "细胞中的无机盐（2D）"],
        [4, "糖类的种类与结构（2D）"],
        [5, "脂质的种类与结构（2D）"],
        [6, "蛋白质的结构模型（3D）"],
        [7, "DNA双螺旋结构模型（3D）"],
        [8, "RNA结构模型（3D）"],
      ],
    },
    {
      id: "cell-structure",
      title: "模块二：细胞的基本结构",
      shortTitle: "细胞的基本结构",
      models: [
        [9, "原核细胞与真核细胞（2D）"],
        [10, "细胞膜流动镶嵌模型（3D）"],
        [11, "植物细胞结构模型（3D）"],
        [12, "动物细胞结构模型（3D）"],
        [13, "分泌蛋白的合成与加工（动画）"],
        [14, "蛋白质的分选（2D）"],
        [15, "内共生学说（动画）"],
        [16, "染色质与染色体的相互转化（动画）"],
        [17, "生命系统的结构层次（2D）"],
        [18, "噬菌体的繁殖（动画）"],
        [19, "HIV的繁殖（动画）"],
        [20, "流感病毒的繁殖（动画）"],
      ],
    },
    {
      id: "cell-metabolism",
      title: "模块三：细胞代谢",
      shortTitle: "细胞代谢",
      models: [
        [21, "渗透作用模型"],
        [22, "质壁分离与复原（拍摄）"],
        [23, "动物细胞的吸水与失水（拍摄）"],
        [24, "物质跨膜运输模型（2D）"],
        [25, "胞吞、胞吐与通过核孔的运输（动画）"],
        [26, "酶的催化过程（动画）"],
        [27, "酶促反应的曲线（2D）"],
        [28, "ATP的结构与功能（2D）"],
        [29, "辅酶的种类与功能（2D）"],
        [30, "细胞呼吸的种类与过程（2D）"],
        [31, "三羧酸循环过程"],
        [32, "细胞呼吸电子传递链"],
        [33, "细胞呼吸的影响因素"],
        [34, "光合作用的过程"],
        [35, "光合色素的提取与分离（拍摄）"],
        [36, "光系统电子传递"],
        [37, "卡尔文循环"],
        [38, "光合作用的影响因素"],
        [39, "光呼吸的过程"],
        [40, "C4植物"],
        [41, "CAM植物"],
        [42, "光合作用与细胞呼吸的关系"],
        [43, "光合作用与细胞呼吸的图像"],
        [44, "光合呼吸日变化问题"],
      ],
    },
    {
      id: "cell-life",
      title: "模块四：细胞的生命历程",
      shortTitle: "细胞的生命历程",
      models: [
        [45, "有丝分裂模型"],
        [46, "植物细胞与动物细胞有丝分裂区别"],
        [47, "细胞周期的控制"],
        [48, "细胞周期同步化"],
        [49, "减数分裂模型"],
        [50, "精子与卵细胞形成的区别"],
        [51, "受精作用过程"],
        [52, "同源染色体模型"],
        [53, "染色体组模型"],
        [54, "细胞分裂折线图"],
        [55, "染色体复制标记分析"],
        [56, "细胞的分化与衰老"],
        [57, "细胞的凋亡与坏死"],
        [58, "细胞自噬"],
      ],
    },
    {
      id: "genetics",
      title: "模块五：遗传学",
      shortTitle: "遗传学",
      models: [
        [59, "遗传学三大定律"],
        [60, "伴性遗传及特点"],
        [61, "DNA复制模型"],
        [62, "DNA转录模型"],
        [63, "密码子模型"],
        [64, "基因翻译模型"],
        [65, "表观遗传模型"],
      ],
    },
    {
      id: "variation-evolution",
      title: "模块六：变异与进化",
      shortTitle: "变异与进化",
      models: [
        [66, "基因突变原理"],
        [67, "基因重组原理"],
        [68, "染色体结构变异与联会"],
        [69, "减数分裂与染色体数目变异"],
        [70, "单倍体与多倍体"],
      ],
    },
    {
      id: "homeostasis",
      title: "模块七：内环境与稳态",
      shortTitle: "内环境与稳态",
      models: [
        [71, "内环境的组成与转化"],
        [72, "内环境的功能"],
        [73, "泌尿系统"],
        [74, "循环系统"],
        [75, "跨膜层数问题"],
        [75, "反射与反射弧"],
        [75, "静息电位与动作电位"],
        [76, "动作电位的传导"],
        [77, "细胞内记录电位图"],
        [78, "细胞外记录电位图"],
        [79, "突触与兴奋传递"],
        [80, "大脑皮层与功能"],
        [81, "激素的分级调节"],
        [82, "内分泌器官与激素"],
        [83, "血糖平衡的调节"],
        [84, "体温平衡的调节"],
        [85, "水盐平衡的调节"],
        [86, "特异性免疫的过程"],
        [87, "植物向光性原理"],
        [88, "生长素的极性运输"],
        [89, "光敏色素及功能"],
      ],
    },
    {
      id: "ecology",
      title: "模块八：生物与环境",
      shortTitle: "生物与环境",
      models: [
        [90, "种群的增长曲线"],
        [91, "种间关系曲线变化"],
        [92, "群落的空间结构"],
        [93, "群落的演替（动画）"],
        [94, "生态系统的能量流动"],
      ],
    },
    {
      id: "biotechnology",
      title: "模块九：生物技术与工程",
      shortTitle: "生物技术与工程",
      models: [
        [95, "微生物的培养（拍摄）"],
        [96, "单克隆抗体的制备"],
        [97, "核移植与克隆"],
        [98, "胚胎的发育（动画）"],
        [99, "PCR的过程"],
        [100, "利用引物添加酶切位点"],
        [101, "利用引物定点诱变"],
        [102, "反向PCR"],
        [103, "实时定量荧光PCR"],
        [104, "重叠延伸PCR"],
        [105, "senger测序技术"],
        [106, "电泳技术（2D+拍摄）"],
        [107, "双酶切构建表达载体"],
        [108, "双标记"],
        [109, "同尾酶与二次酶切"],
        [110, "应用CRISPER-Cas9进行基因编辑"],
        [111, "利用Cre-LoxP进行基因敲除"],
        [112, "利用siRNA进行基因沉默"],
        [113, "融合基因与同和蛋白"],
      ],
    },
  ];

  const key = (number, title) => `${number}|${title}`;

  const completed = new Map([
    [key(1, "组成细胞的元素（2D）"), "cell-elements"],
    [key(6, "蛋白质的结构模型（3D）"), "protein-webgl"],
    [key(7, "DNA双螺旋结构模型（3D）"), "dna-webgl"],
    [key(61, "DNA复制模型"), "dna-replication"],
    [key(62, "DNA转录模型"), "dna-transcription"],
    [key(64, "基因翻译模型"), "translation"],
    [key(8, "RNA结构模型（3D）"), "rna-webgl"],
    [key(10, "细胞膜流动镶嵌模型（3D）"), "membrane"],
    [key(11, "植物细胞结构模型（3D）"), "plant-cell-webgl"],
    [key(18, "噬菌体的繁殖（动画）"), "bacteriophage-reproduction"],
    [key(24, "物质跨膜运输模型（2D）"), "transport"],
  ]);

  const secondBatch = new Map([
    [key(5, "脂质的种类与结构（2D）"), "lipid-structures"],
    [key(9, "原核细胞与真核细胞（2D）"), "prokaryotic-eukaryotic-cells"],
    [key(12, "动物细胞结构模型（3D）"), "animal-cell"],
    [key(19, "HIV的繁殖（动画）"), "hiv-reproduction"],
    [key(21, "渗透作用模型"), "osmosis"],
    [key(30, "细胞呼吸的种类与过程（2D）"), "cellular-respiration"],
    [key(31, "三羧酸循环过程"), "tca-cycle"],
    [key(32, "细胞呼吸电子传递链"), "respiratory-electron-transport"],
    [key(33, "细胞呼吸的影响因素"), "respiration-factors"],
    [key(34, "光合作用的过程"), "photosynthesis"],
    [key(36, "光系统电子传递"), "photosynthetic-electron-transport"],
    [key(37, "卡尔文循环"), "calvin-cycle"],
    [key(39, "光呼吸的过程"), "photorespiration"],
    [key(40, "C4植物"), "c4-plants"],
    [key(44, "光合呼吸日变化问题"), "diurnal-photosynthesis-respiration"],
    [key(45, "有丝分裂模型"), "mitosis"],
    [key(49, "减数分裂模型"), "meiosis"],
    [key(52, "同源染色体模型"), "homologous-chromosomes"],
    [key(53, "染色体组模型"), "chromosome-set"],
    [key(63, "密码子模型"), "codon"],
    [key(66, "基因突变原理"), "gene-mutation"],
    [key(68, "染色体结构变异与联会"), "chromosome-structural-variation"],
    [key(75, "反射与反射弧"), "reflex-arc"],
    [key(75, "静息电位与动作电位"), "resting-action-potential"],
    [key(76, "动作电位的传导"), "action-potential-conduction"],
    [key(77, "细胞内记录电位图"), "intracellular-potential"],
    [key(78, "细胞外记录电位图"), "extracellular-potential"],
    [key(79, "突触与兴奋传递"), "synapse-transmission"],
    [key(83, "血糖平衡的调节"), "blood-glucose-regulation"],
    [key(86, "特异性免疫的过程"), "adaptive-immunity"],
    [key(90, "种群的增长曲线"), "population-growth"],
    [key(99, "PCR的过程"), "pcr"],
    [key(100, "利用引物添加酶切位点"), "primer-restriction-site"],
    [key(101, "利用引物定点诱变"), "site-directed-mutagenesis"],
    [key(110, "应用CRISPER-Cas9进行基因编辑"), "crispr-cas9-gene-editing"],
    [key(111, "利用Cre-LoxP进行基因敲除"), "cre-loxp-gene-knockout"],
    [key(112, "利用siRNA进行基因沉默"), "sirna-gene-silencing"],
  ]);

  const plannedSummaries = {
    "cell-elements": "比较大量元素与微量元素，理解元素组成与细胞生命活动的联系。",
    "lipid-structures": "对比脂肪、磷脂和固醇的结构特点及主要生理功能。",
    "prokaryotic-eukaryotic-cells": "并列观察两类细胞的边界、遗传物质与细胞器差异。",
    "animal-cell": "从空间结构认识动物细胞膜、细胞核和主要细胞器。",
    "bacteriophage-reproduction": "追踪吸附、注入、合成、装配与裂解释放全过程。",
    "hiv-reproduction": "展示 HIV 侵入、逆转录、整合、装配和出芽的关键环节。",
    osmosis: "用半透膜与浓度差解释水分子的净移动方向和动态平衡。",
    "cellular-respiration": "串联糖酵解、有氧呼吸与无氧呼吸，比较场所和能量收益。",
    "tca-cycle": "跟踪乙酰辅酶 A 的逐步氧化及 NADH、FADH₂ 的形成。",
    "respiratory-electron-transport": "观察电子传递、质子梯度建立与 ATP 合成的耦联。",
    "respiration-factors": "探索温度、氧气、底物等因素对呼吸速率的影响。",
    photosynthesis: "串联光反应与碳反应，观察能量转换和物质变化。",
    "photosynthetic-electron-transport": "展示光系统 II、细胞色素复合体与光系统 I 的电子流。",
    "calvin-cycle": "动态呈现 CO₂ 固定、还原与 RuBP 再生三个阶段。",
    photorespiration: "比较光呼吸与光合作用，理解 Rubisco 加氧反应的影响。",
    "c4-plants": "展示 C4 植物的空间分工与 CO₂ 浓缩机制。",
    "diurnal-photosynthesis-respiration": "用昼夜曲线分析光合、呼吸与有机物积累的关系。",
    mitosis: "连续观察染色体复制后的凝缩、排列、分离与细胞质分裂。",
    meiosis: "追踪同源染色体联会、互换及两次连续分裂。",
    "homologous-chromosomes": "辨认同源染色体、姐妹染色单体及等位基因位置。",
    "chromosome-set": "通过不同细胞示例理解染色体组、倍性与基因组关系。",
    "dna-replication": "展示解旋、引物形成以及前导链和后随链的合成。",
    "dna-transcription": "观察 RNA 聚合酶沿模板链合成 RNA 的方向与配对规则。",
    codon: "连接 mRNA 密码子、tRNA 反密码子与氨基酸对应关系。",
    translation: "动态呈现核糖体装配、肽链延伸与终止过程。",
    "gene-mutation": "比较碱基替换、插入和缺失对编码信息的影响。",
    "chromosome-structural-variation": "演示缺失、重复、倒位、易位及减数分裂联会图像。",
    "reflex-arc": "沿感受器、传入神经、中枢、传出神经到效应器追踪信号。",
    "resting-action-potential": "联动离子通道、膜电位与离子跨膜流动解释电位变化。",
    "action-potential-conduction": "观察局部电流推动兴奋沿神经纤维传播的过程。",
    "intracellular-potential": "模拟细胞内电极记录并解析静息电位和动作电位曲线。",
    "extracellular-potential": "比较不同电极位置下细胞外记录波形与兴奋方向。",
    "synapse-transmission": "展示递质释放、受体结合及突触后电位形成。",
    "blood-glucose-regulation": "联动胰岛素、胰高血糖素与靶器官解释反馈调节。",
    "adaptive-immunity": "梳理体液免疫与细胞免疫中的识别、增殖和效应阶段。",
    "population-growth": "交互比较 J 形与 S 形增长及环境容纳量的意义。",
    pcr: "按变性、退火、延伸循环展示 DNA 片段指数扩增。",
    "primer-restriction-site": "演示通过引物 5′ 端附加序列引入限制性酶切位点。",
    "site-directed-mutagenesis": "展示含突变碱基的引物如何定点改写目标序列。",
    "crispr-cas9-gene-editing": "展示向导 RNA 识别、Cas9 切割与 DNA 修复结果。",
    "cre-loxp-gene-knockout": "演示 Cre 重组酶识别 LoxP 位点并删除目标片段。",
    "sirna-gene-silencing": "展示 siRNA 引导 RISC 识别并降解互补 mRNA。",
  };

  const crossLinks = [
    ["dna-webgl", "dna-replication", "DNA 双螺旋结构是理解半保留复制的结构基础"],
    ["dna-webgl", "dna-transcription", "先理解 DNA 链方向和碱基配对，再学习转录"],
    ["rna-webgl", "codon", "RNA 的链结构与碱基组成是阅读密码子的基础"],
    ["codon", "translation", "密码子和反密码子配对连接到翻译过程"],
    ["protein-webgl", "translation", "翻译生成的肽链进一步形成蛋白质结构"],
    ["membrane", "transport", "膜结构决定物质跨膜运输的方式"],
    ["transport", "osmosis", "跨膜运输概念帮助解释水的净移动"],
    ["plant-cell-webgl", "osmosis", "液泡与细胞壁共同影响植物细胞吸水表现"],
    ["photosynthesis", "cellular-respiration", "两个过程共同构成细胞能量与物质转化网络"],
    ["homologous-chromosomes", "meiosis", "同源染色体行为是理解减数分裂的关键"],
    ["dna-replication", "gene-mutation", "复制差错是基因突变的重要来源之一"],
    ["meiosis", "chromosome-structural-variation", "联会和分离异常有助于解释染色体变异"],
    ["dna-replication", "pcr", "PCR 利用体外条件模拟 DNA 复制的基本原则"],
    ["pcr", "site-directed-mutagenesis", "定点诱变以 PCR 扩增和引物设计为基础"],
    ["dna-transcription", "sirna-gene-silencing", "基因沉默通过影响转录产物 mRNA 实现"],
  ];

  // Map delivered packages onto existing topic identities; no duplicate topic.
  const websiteReleases = {
    "respiratory-electron-transport": "respiratory-electron-transport",
    "photosynthetic-electron-transport": "photosynthetic-electron-transport",
    "future-genetics-059": "genetic-inheritance-laws",
    "cellular-respiration": "cellular-respiration",
    "osmosis": "osmosis",
    "photosynthesis": "photosynthesis",
    "population-growth": "population-growth",
    "future-ecology-091": "species-interactions",
    "future-ecology-093": "community-succession",
    "resting-action-potential": "resting-action-potential",
    "action-potential-conduction": "action-potential-conduction",
    "extracellular-potential": "biphasic-nerve-potential",
    "pcr": "pcr",
    "primer-restriction-site": "pcr-primer-engineering",
    "site-directed-mutagenesis": "pcr-primer-engineering",
    "future-biotechnology-105": "sanger-sequencing",
  };

  let order = 0;
  const normalizedModules = modules.map((module, moduleIndex) => {
    const duplicateCounts = new Map();
    const models = module.models.map(([number, title], modelIndex) => {
      const recordKey = key(number, title);
      const completedId = completed.get(recordKey);
      const plannedId = secondBatch.get(recordKey);
      const baseId = completedId || plannedId || `future-${module.id}-${String(number).padStart(3, "0")}`;
      const duplicateIndex = duplicateCounts.get(baseId) || 0;
      duplicateCounts.set(baseId, duplicateIndex + 1);
      const id = duplicateIndex ? `${baseId}-${duplicateIndex + 1}` : baseId;
      const formatMatch = title.match(/（([^）]+)）$/);
      const format = formatMatch ? formatMatch[1] : "交互";
      return {
        id,
        number,
        title,
        moduleId: module.id,
        moduleTitle: module.shortTitle,
        moduleIndex,
        modelIndex,
        order: order++,
        format,
        status: completedId || websiteReleases[baseId] ? "completed" : plannedId ? "second-batch" : "future",
        publishedModelId: completedId || websiteReleases[baseId] || null,
        summary:
          plannedSummaries[plannedId || completedId] ||
          (completedId ? "模型已完成，可进入互动页面进行观察与学习。" : `围绕“${title.replace(/（[^）]+）$/, "")}”规划的后续互动模型。`),
      };
    });
    return { ...module, moduleIndex, models };
  });

  // New topic without reusing a historical planning number. Existing 99/100/101/105 identities stay intact.
  const biotechnology = normalizedModules.find((module) => module.id === "biotechnology");
  const pcrPlan = biotechnology.models.find((model) => model.id === "pcr");
  biotechnology.models.splice(biotechnology.models.indexOf(pcrPlan) + 1, 0, {
    id: "pcr-product-types", number: null, title: "PCR的产物类型",
    moduleId: biotechnology.id, moduleTitle: biotechnology.shortTitle,
    moduleIndex: biotechnology.moduleIndex, modelIndex: pcrPlan.modelIndex + 0.5,
    order: pcrPlan.order + 0.5, format: "交互", status: "completed",
    publishedModelId: "pcr-product-types", summary: "前六轮按产物类型分组同步延伸，第七轮起保留第六轮末DNA画面，右侧继续统计产物数量。",
  });
  const allModels = normalizedModules.flatMap((module) => module.models);
  const ecologySummaries = {"population-growth":"同步比较 J 型与 S 型增长，自设初始数量和内禀增长率，观察自适应纵轴、K 与 K/2。","species-interactions":"同步观察捕食、寄生、竞争和互利关系；比较周期波动、竞争排斥及解除互利作用后的变化。","community-succession":"独立选择初生或次生演替进度，比较裸岩定居与火后恢复；写实土壤剖面可按需开启。"};
  allModels.forEach((model) => { if (ecologySummaries[model.publishedModelId]) model.summary = ecologySummaries[model.publishedModelId]; });
  const counts = allModels.reduce(
    (result, model) => {
      result[model.status] += 1;
      return result;
    },
    { completed: 0, "second-batch": 0, future: 0 }
  );

  window.ANDER_LEARNING_MAP_DATA = Object.freeze({
    schemaVersion: "1.0",
    modules: normalizedModules,
    models: allModels,
    counts,
    crossLinks,
  });
})();
