const pptxgen = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "Agent Memory history opening deck";
pptx.title = "Agent Memory: 从记忆机制到 Memory OS";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "PingFang SC",
  bodyFontFace: "PingFang SC",
  lang: "zh-CN",
};

const C = {
  bg: "F6F1E8",
  text: "102033",
  muted: "5B6472",
  soft: "E7DED0",
  panel: "FFFDF9",
  teal: "177E89",
  tealSoft: "D8EEF0",
  navy: "16324F",
  gold: "B7791F",
  goldSoft: "F5E7C9",
  coral: "C65D4B",
  coralSoft: "F7DDD7",
  green: "3D7A57",
  greenSoft: "DCEBDD",
  line: "D7CCBC",
  white: "FFFFFF",
};

function addBg(slide) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.18,
    line: { color: C.teal, transparency: 100 },
    fill: { color: C.teal },
  });
}

function addHeader(slide, eyebrow, title, subtitle) {
  slide.addText(eyebrow, {
    x: 0.7,
    y: 0.45,
    w: 4.2,
    h: 0.28,
    fontFace: "PingFang SC",
    fontSize: 10,
    color: C.teal,
    bold: true,
    charSpace: 0.5,
  });
  slide.addText(title, {
    x: 0.7,
    y: 0.72,
    w: 9.6,
    h: 0.75,
    fontFace: "PingFang SC",
    fontSize: 25,
    color: C.text,
    bold: true,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.7,
      y: 1.45,
      w: 11.5,
      h: 0.5,
      fontFace: "PingFang SC",
      fontSize: 11,
      color: C.muted,
      breakLine: false,
    });
  }
}

function addCue(slide, text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.72,
    y: 6.72,
    w: 11.9,
    h: 0.48,
    rectRadius: 0.04,
    line: { color: C.soft, transparency: 100 },
    fill: { color: "EFE8DB" },
  });
  slide.addText(`讲法提示：${text}`, {
    x: 0.92,
    y: 6.86,
    w: 11.4,
    h: 0.18,
    fontFace: "PingFang SC",
    fontSize: 8.5,
    color: C.muted,
    italic: true,
  });
}

function addPageNum(slide, n) {
  slide.addText(String(n), {
    x: 12.05,
    y: 0.42,
    w: 0.7,
    h: 0.2,
    fontSize: 10,
    color: C.muted,
    align: "right",
  });
}

function addTag(slide, text, x, y, w, fill, color = C.text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.34,
    rectRadius: 0.05,
    line: { color: fill, transparency: 100 },
    fill: { color: fill },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.09,
    w: w - 0.24,
    h: 0.15,
    fontSize: 8.5,
    color,
    bold: true,
    align: "center",
  });
}

function addBulletLines(slide, items, x, y, w, lineH = 0.34, fontSize = 13) {
  items.forEach((item, idx) => {
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: y + idx * lineH + 0.09,
      w: 0.08,
      h: 0.08,
      line: { color: C.teal, transparency: 100 },
      fill: { color: C.teal },
    });
    slide.addText(item, {
      x: x + 0.16,
      y: y + idx * lineH,
      w,
      h: 0.22,
      fontSize,
      color: C.text,
      breakLine: false,
    });
  });
}

function addTimelineCard(slide, x, y, w, h, tone, era, title, items) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: C.line, pt: 1 },
    fill: { color: C.panel },
    shadow: { type: "outer", color: "D9D0C2", blur: 1, angle: 45, distance: 1, opacity: 0.12 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.12,
    line: { color: tone, transparency: 100 },
    fill: { color: tone },
  });
  slide.addText(era, {
    x: x + 0.18,
    y: y + 0.2,
    w: w - 0.36,
    h: 0.22,
    fontSize: 9,
    color: tone,
    bold: true,
  });
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.48,
    w: w - 0.36,
    h: 0.45,
    fontSize: 15,
    color: C.text,
    bold: true,
  });
  addBulletLines(slide, items, x + 0.18, y + 1.03, w - 0.3, 0.34, 10.5);
}

function addProjectBox(slide, x, y, w, h, title, desc, tone, soft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    line: { color: tone, pt: 1.2 },
    fill: { color: soft },
  });
  slide.addText(title, {
    x: x + 0.16,
    y: y + 0.15,
    w: w - 0.32,
    h: 0.28,
    fontSize: 14,
    color: C.text,
    bold: true,
    align: "center",
  });
  slide.addText(desc, {
    x: x + 0.16,
    y: y + 0.5,
    w: w - 0.32,
    h: h - 0.62,
    fontSize: 9.5,
    color: C.muted,
    valign: "mid",
    align: "center",
  });
}

function addShiftCard(slide, x, y, w, h, idx, title, body, tone, soft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: C.line, pt: 1 },
    fill: { color: C.panel },
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.18,
    y: y + 0.18,
    w: 0.52,
    h: 0.42,
    rectRadius: 0.08,
    line: { color: tone, transparency: 100 },
    fill: { color: soft },
  });
  slide.addText(String(idx), {
    x: x + 0.18,
    y: y + 0.28,
    w: 0.52,
    h: 0.12,
    fontSize: 10,
    color: tone,
    bold: true,
    align: "center",
  });
  slide.addText(title, {
    x: x + 0.84,
    y: y + 0.17,
    w: w - 1.02,
    h: 0.32,
    fontSize: 14,
    color: C.text,
    bold: true,
  });
  slide.addText(body, {
    x: x + 0.84,
    y: y + 0.55,
    w: w - 1.02,
    h: h - 0.72,
    fontSize: 10.5,
    color: C.muted,
  });
}

function addRecentMilestone(slide, x, y, w, date, project, body, tone, soft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 2.45,
    rectRadius: 0.06,
    line: { color: tone, pt: 1.2 },
    fill: { color: C.panel },
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.18,
    y: y + 0.18,
    w: w - 0.36,
    h: 0.34,
    rectRadius: 0.06,
    line: { color: soft, transparency: 100 },
    fill: { color: soft },
  });
  slide.addText(date, {
    x: x + 0.24,
    y: y + 0.28,
    w: w - 0.48,
    h: 0.12,
    fontSize: 8.5,
    color: tone,
    bold: true,
    align: "center",
  });
  slide.addText(project, {
    x: x + 0.16,
    y: y + 0.7,
    w: w - 0.32,
    h: 0.36,
    fontSize: 16,
    color: C.text,
    bold: true,
    align: "center",
  });
  slide.addText(body, {
    x: x + 0.18,
    y: y + 1.15,
    w: w - 0.36,
    h: 0.9,
    fontSize: 10,
    color: C.muted,
    align: "center",
    valign: "mid",
  });
}

function addInfoListCard(slide, x, y, w, h, title, items, tone, soft, options = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    line: { color: tone, pt: 1.2 },
    fill: { color: options.usePanel ? C.panel : soft },
  });
  if (options.kicker) {
    addTag(slide, options.kicker, x + 0.16, y + 0.16, Math.min(w - 0.32, 1.5), soft, tone);
  }
  slide.addText(title, {
    x: x + 0.16,
    y: y + (options.kicker ? 0.58 : 0.18),
    w: w - 0.32,
    h: 0.3,
    fontSize: options.titleSize || 14,
    color: C.text,
    bold: true,
    align: options.center ? "center" : "left",
  });
  const startY = y + (options.kicker ? 1.0 : 0.62);
  const lineH = options.lineH || 0.32;
  const fontSize = options.fontSize || 9.4;
  items.forEach((item, idx) => {
    if (!options.noBullets) {
      slide.addShape(pptx.ShapeType.ellipse, {
        x: x + 0.18,
        y: startY + idx * lineH + 0.08,
        w: 0.07,
        h: 0.07,
        line: { color: tone, transparency: 100 },
        fill: { color: tone },
      });
    }
    slide.addText(item, {
      x: x + (options.noBullets ? 0.18 : 0.32),
      y: startY + idx * lineH,
      w: w - (options.noBullets ? 0.36 : 0.5),
      h: 0.22,
      fontSize,
      color: C.muted,
      breakLine: false,
      align: options.center ? "center" : "left",
    });
  });
}

function addKpiCard(slide, x, y, w, h, metric, label, tone, soft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    line: { color: tone, pt: 1.1 },
    fill: { color: soft },
  });
  slide.addText(metric, {
    x: x + 0.14,
    y: y + 0.18,
    w: w - 0.28,
    h: 0.28,
    fontSize: 18,
    color: C.text,
    bold: true,
    align: "center",
  });
  slide.addText(label, {
    x: x + 0.14,
    y: y + 0.56,
    w: w - 0.28,
    h: 0.38,
    fontSize: 9.5,
    color: C.muted,
    align: "center",
    valign: "mid",
  });
}

function finalizeSlide(slide) {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// Slide 1
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 1);
  addTag(slide, "INTERNAL SHARE OPENING", 0.72, 0.46, 1.82, C.tealSoft, C.teal);
  slide.addText("Agent Memory", {
    x: 0.7,
    y: 1.2,
    w: 5.5,
    h: 0.72,
    fontSize: 28,
    color: C.text,
    bold: true,
  });
  slide.addText("从记忆机制到 Memory OS", {
    x: 0.7,
    y: 1.9,
    w: 7.4,
    h: 0.6,
    fontSize: 22,
    color: C.navy,
    bold: true,
  });
  slide.addText(
    "它已经不只是“把聊天历史存下来”。\n它正演化为让 agent 能持续存在、持续学习、持续装配上下文的一层基础设施。",
    {
      x: 0.72,
      y: 2.95,
      w: 5.3,
      h: 1.0,
      fontSize: 14,
      color: C.muted,
      breakLine: true,
    }
  );
  addTag(slide, "记忆机制", 0.72, 4.38, 1.08, C.goldSoft, C.gold);
  addTag(slide, "长期记忆", 1.9, 4.38, 1.08, C.greenSoft, C.green);
  addTag(slide, "状态化 Agent", 3.08, 4.38, 1.36, C.coralSoft, C.coral);
  addTag(slide, "Profile Graph", 4.58, 4.38, 1.26, C.tealSoft, C.teal);
  addTag(slide, "Memory API / OS", 5.96, 4.38, 1.55, "DDE7F8", C.navy);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.5,
    y: 1.1,
    w: 4.95,
    h: 4.9,
    rectRadius: 0.08,
    line: { color: C.line, pt: 1 },
    fill: { color: C.panel },
  });
  slide.addText("今天这段开场想让大家记住的不是所有项目名，\n而是 3 件事：", {
    x: 7.9,
    y: 1.55,
    w: 4.2,
    h: 0.7,
    fontSize: 16,
    color: C.text,
    bold: true,
  });
  addBulletLines(
    slide,
    [
      "Agent memory 经历了几次定义变化",
      "不同项目解决的是不同层的问题",
      "今天它正在变成独立基础设施",
    ],
    7.94,
    2.55,
    3.7,
    0.6,
    12
  );
  addCue(slide, "先把主命题抛出来：memory 不再是附件，而是在变成 agent 的基础设施层。");
  finalizeSlide(slide);
}

// Slide 2
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 2);
  addHeader(
    slide,
    "TIMELINE",
    "Agent Memory 的 5 个阶段",
    "重点不是项目越来越多，而是“memory 的定义”在不断变化。"
  );
  addTimelineCard(
    slide,
    0.72,
    2.1,
    2.36,
    3.7,
    C.gold,
    "2023 上半年",
    "启蒙期：记忆机制",
    ["Generative Agents", "Reflexion", "Auto-GPT", "关键词：retrieval / reflection"]
  );
  addTimelineCard(
    slide,
    3.24,
    2.1,
    2.36,
    3.7,
    C.green,
    "2023 下半年",
    "框架内 Memory",
    ["LangChain Memory", "LlamaIndex Memory", "关键词：history / summary"]
  );
  addTimelineCard(
    slide,
    5.76,
    2.1,
    2.36,
    3.7,
    C.coral,
    "2024 上半年",
    "长期记忆成形",
    ["Zep", "MemoryBank", "MemGPT", "关键词：persistent / long-term"]
  );
  addTimelineCard(
    slide,
    8.28,
    2.1,
    2.36,
    3.7,
    C.teal,
    "2024 下半年",
    "项目爆发期",
    ["Graphiti 2024-08", "Mem0 2024-09", "Letta 2024-09", "关键词：graph / layer / state"]
  );
  addTimelineCard(
    slide,
    10.8,
    2.1,
    1.82,
    3.7,
    C.navy,
    "2025 - 现在",
    "平台化扩展",
    ["Supermemory", "API / MCP", "关键词：context infra"]
  );
  addCue(slide, "讲这页时按“定义变化”走；到 2024 下半年以后，再切到下一页按具体项目讲。");
  finalizeSlide(slide);
}

// Slide 3
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 3);
  addHeader(
    slide,
    "RECENT CORE PROJECTS",
    "2024 后期到 2026-04-09：按主流核心项目看",
    "后面展开时，建议就沿着这 4 个项目讲：Graphiti、Mem0、Letta、Supermemory。"
  );
  addRecentMilestone(slide, 0.82, 2.15, 2.85, "2024 下半年", "Graphiti", "Zep 开源 temporal knowledge graph，图谱型 memory 开始成主线。", C.gold, C.goldSoft);
  addRecentMilestone(slide, 3.9, 2.15, 2.85, "2024-09-09", "Mem0", "把 AI memory layer 说得最直白，强调长期偏好与可复用基础设施。", C.green, C.greenSoft);
  addRecentMilestone(slide, 6.98, 2.15, 2.85, "2024-09-23", "Letta", "从 MemGPT 走向生产平台，强调 stateful agents 与 memory management。", C.coral, C.coralSoft);
  addRecentMilestone(slide, 10.06, 2.15, 2.45, "2025 起", "Supermemory", "把 memory API 推向 context infrastructure：profile、graph、retrieval、connectors 一起讲。", C.teal, C.tealSoft);
  slide.addShape(pptx.ShapeType.line, {
    x: 1.1,
    y: 5.35,
    w: 10.95,
    h: 0,
    line: { color: C.line, pt: 1.5 },
  });
  slide.addText("这 4 个项目基本对应 4 条后续主线：图谱型 memory、memory layer、stateful agent 平台、context infrastructure。", {
    x: 1.0,
    y: 5.55,
    w: 11.3,
    h: 0.42,
    fontSize: 13,
    color: C.navy,
    bold: true,
    align: "center",
  });
  addCue(slide, "你可以直接把后半段目录接成 4 个项目：Graphiti、Mem0、Letta、Supermemory。这样 2024 后期到现在就不再是一整块。");
  finalizeSlide(slide);
}

// Slide 4
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 4);
  addHeader(
    slide,
    "CATEGORY MAP",
    "为什么这些项目不能混着讲",
    "同样都叫 memory，但它们在系统里的角色并不一样。"
  );
  const boxes = [
    [0.82, 2.1, 2.3, 1.45, "框架内记忆", "LangChain Memory\nLlamaIndex Memory", C.gold, C.goldSoft],
    [3.35, 2.1, 2.55, 1.45, "独立长期记忆库", "Zep\nMem0\nSupermemory", C.green, C.greenSoft],
    [6.15, 2.1, 2.55, 1.45, "研究原型 / 方法论", "Generative Agents\nReflexion\nMemoryBank", C.coral, C.coralSoft],
    [8.95, 2.1, 2.45, 1.45, "状态化 Agent", "MemGPT\nLetta\nLangGraph persistence", C.teal, C.tealSoft],
    [4.2, 4.1, 4.8, 1.55, "图谱 / 系统级 Memory", "Graphiti\nMemory OS 风格系统\nProfile graph / memory API", C.navy, "DDE7F8"],
  ];
  boxes.forEach(([x, y, w, h, t, d, tone, soft]) => addProjectBox(slide, x, y, w, h, t, d, tone, soft));
  slide.addText("一句话记忆：\n不是所有 memory 都在回答同一个问题。", {
    x: 0.9,
    y: 4.35,
    w: 2.7,
    h: 0.8,
    fontSize: 16,
    color: C.text,
    bold: true,
  });
  slide.addText("有的在解决上下文管理，有的在解决长期偏好，有的在解决 agent 状态持久化，还有的在尝试把 memory 做成系统层。", {
    x: 0.9,
    y: 5.12,
    w: 2.9,
    h: 0.9,
    fontSize: 10.5,
    color: C.muted,
  });
  addCue(slide, "这一页的任务是帮听众“分堆”：后面提项目时，大家不会把 RAG 库、agent 状态和 memory service 混为一谈。");
  finalizeSlide(slide);
}

// Slide 5
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 5);
  addHeader(
    slide,
    "ANCHOR PROJECTS",
    "历史上最值得记住的 6 个代表项目",
    "它们代表了 6 种不同的“问题定义方式”。"
  );
  const projectData = [
    [0.82, 2.0, "Generative Agents", "把 memory stream、reflection、retrieval 这套范式讲明白了。", C.gold, C.goldSoft],
    [4.36, 2.0, "LangChain Memory", "让“agent 应该有 memory”成为工程圈默认抽象。", C.green, C.greenSoft],
    [7.9, 2.0, "Zep", "很早把长期记忆做成独立服务，而不只是聊天记录存储。", C.coral, C.coralSoft],
    [0.82, 4.08, "MemGPT / Letta", "把 memory 提升成状态管理问题，接近操作系统式视角。", C.teal, C.tealSoft],
    [4.36, 4.08, "Mem0", "把 memory layer 明确包装成可复用的基础设施能力。", C.navy, "DDE7F8"],
    [7.9, 4.08, "Graphiti", "把 temporal graph memory 带进主流讨论，强调关系与时间。", C.gold, C.goldSoft],
  ];
  projectData.forEach(([x, y, title, desc, tone, soft]) => addProjectBox(slide, x, y, 3.0, 1.55, title, desc, tone, soft));
  addCue(slide, "讲这页时别展开技术细节，只讲“它重新定义了什么”，帮助大家建立锚点。");
  finalizeSlide(slide);
}

// Slide 6
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 6);
  addHeader(
    slide,
    "CURRENT WAVE",
    "今天这波 Agent Memory 真正变了什么",
    "这也是为什么最近会出现 memory OS、profile graph、memory API 这一波。"
  );
  addShiftCard(
    slide,
    0.82,
    2.05,
    11.7,
    1.15,
    1,
    "从 chat history 变成 profile + experience + state",
    "记忆对象不再只是对话文本，而是用户偏好、长期事实、行为轨迹、技能经验和 agent 当前状态。",
    C.gold,
    C.goldSoft
  );
  addShiftCard(
    slide,
    0.82,
    3.48,
    11.7,
    1.15,
    2,
    "从 agent 附件变成独立基础设施",
    "Memory 不再只是框架里的一个模块，而是在向 service、API、graph store、context assembly layer 演化。",
    C.coral,
    C.coralSoft
  );
  addShiftCard(
    slide,
    0.82,
    4.91,
    11.7,
    1.15,
    3,
    "竞争焦点从“能不能存”变成“会不会提、会不会更、会不会装”",
    "更关键的是抽取什么、什么时候更新、如何检索、如何做 relevance filtering，以及如何把上下文装配给 agent。",
    C.teal,
    C.tealSoft
  );
  addCue(slide, "历史讲到这里要收束成判断：memory 的竞争点已经从存储层上移到了决策层和装配层。");
  finalizeSlide(slide);
}

// Slide 7
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 7);
  addHeader(
    slide,
    "CHEAT SHEET",
    "一页记住今天这段开场",
    "你可以把这页当成自己的讲稿索引。"
  );
  addProjectBox(slide, 0.82, 2.0, 3.55, 3.9, "5 个阶段", "1. 方法论启蒙\n2. 框架内 memory\n3. 长期记忆成形\n4. memory layer / graph\n5. context infra / API / OS", C.gold, C.goldSoft);
  addProjectBox(slide, 4.9, 2.0, 3.55, 3.9, "5 类系统", "框架内记忆\n独立长期记忆库\n研究原型 / 方法论\n状态化 agent\n图谱 / 系统级 memory", C.teal, C.tealSoft);
  addProjectBox(slide, 8.98, 2.0, 3.55, 3.9, "4 个近期核心项目", "Graphiti\nMem0\nLetta\nSupermemory", C.coral, C.coralSoft);
  slide.addText("一句话结论：Agent memory 的发展史，本质上是 agent 从“会对话”走向“会持续存在”的历史。", {
    x: 1.0,
    y: 6.15,
    w: 11.2,
    h: 0.32,
    fontSize: 14,
    color: C.navy,
    bold: true,
    align: "center",
  });
  addCue(slide, "最后用这一句收尾，然后自然过渡到你后面要展开的产品、开源库或设计方法。");
  finalizeSlide(slide);
}

// Slide 8
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 8);
  addHeader(
    slide,
    "WHY BENCHMARKS",
    "为什么 Agent Memory 需要专门的 benchmark",
    "只看“回答得像不像”不够，因为 memory system 的问题经常出在写入、更新、检索和冲突处理。"
  );
  addInfoListCard(
    slide,
    0.82,
    2.0,
    4.0,
    3.9,
    "如果没有 benchmark，很容易把 3 类问题讲混",
    [
      "模型本体强不强",
      "memory system 会不会写、会不会取、会不会更",
      "prompt 拼接策略是否碰巧有效",
      "供应商自己的评测口径是否可比",
    ],
    C.gold,
    C.goldSoft
  );
  addInfoListCard(
    slide,
    5.05,
    2.0,
    3.2,
    1.82,
    "真正要测什么",
    [
      "长期记忆是否能跨 session 保持",
      "时间变化后是否会正确更新",
      "冲突信息出现时能否覆盖旧知识",
      "是否会在不知道时拒答",
    ],
    C.teal,
    C.tealSoft
  );
  addInfoListCard(
    slide,
    5.05,
    4.08,
    3.2,
    1.82,
    "不同 benchmark 的侧重点",
    [
      "LongMemEval: 长期聊天助手",
      "LoCoMo: 时间线和叙事一致性",
      "PersonaMem: 个性化偏好",
      "BEAM / LifeBench: 超长、多源、长期",
    ],
    C.coral,
    C.coralSoft
  );
  addInfoListCard(
    slide,
    8.5,
    2.0,
    4.0,
    3.9,
    "讲 benchmark 时我建议你一直强调 3 个口径",
    [
      "public leaderboard：第三方/公开榜单",
      "paper-reported：论文统一实验配置",
      "vendor-claimed：项目首页或 README 自报成绩",
      "这三种数字不能直接混比",
    ],
    C.navy,
    "DDE7F8"
  );
  addCue(slide, "先把评估框架讲清楚，后面分析项目时听众才知道你是在比较 memory system，而不是比较模型。");
  finalizeSlide(slide);
}

// Slide 9
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 9);
  addHeader(
    slide,
    "KEY DATASETS",
    "我建议重点讲的 6 个 Agent Memory benchmark / 数据集",
    "它们覆盖了长期对话、个性化、超长上下文、多源生活痕迹和增量式交互。"
  );
  const cards = [
    [0.82, 2.0, "LongMemEval", ["500 questions", "5 个核心能力", "最像长期聊天助手"], C.gold, C.goldSoft],
    [4.28, 2.0, "LoCoMo", ["最长可到 32 sessions", "时间线 / 事件图", "叙事一致性很强"], C.green, C.greenSoft],
    [7.74, 2.0, "PersonaMem-v2", ["1,000 interactions", "20,000+ user preferences", "偏个性化与隐式偏好"], C.coral, C.coralSoft],
    [0.82, 4.22, "BEAM", ["100K - 10M tokens", "2,000 validated questions", "专门拉长到极限"], C.teal, C.tealSoft],
    [4.28, 4.22, "LifeBench", ["1 年多源数字痕迹", "declarative + non-declarative", "最接近 personal agent"], C.navy, "DDE7F8"],
    [7.74, 4.22, "MemoryAgentBench", ["增量式 multi-turn", "4 个 memory competencies", "强调交互式积累"], C.gold, C.goldSoft],
  ];
  cards.forEach(([x, y, title, items, tone, soft]) => {
    addInfoListCard(slide, x, y, 3.1, 1.86, title, items, tone, soft, {
      titleSize: 15,
      fontSize: 9.3,
      lineH: 0.28,
    });
  });
  addCue(slide, "这页不要讲太细，目标是让大家先认识 benchmark 名字和它们大致各测什么。");
  finalizeSlide(slide);
}

// Slide 10
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 10);
  addHeader(
    slide,
    "BENCHMARK MAP",
    "这些 benchmark 主要在测什么",
    "最简单的记忆方法：横轴看数据来源，纵轴看考察的是“事实回忆”还是“行为 / 个性 / agentic memory”。"
  );
  slide.addShape(pptx.ShapeType.line, {
    x: 1.3,
    y: 5.8,
    w: 10.6,
    h: 0,
    line: { color: C.line, pt: 1.5 },
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 1.3,
    y: 5.8,
    w: 0,
    h: -3.3,
    line: { color: C.line, pt: 1.5 },
  });
  slide.addText("单一/对话型数据", {
    x: 1.25,
    y: 5.96,
    w: 2.0,
    h: 0.2,
    fontSize: 10,
    color: C.muted,
  });
  slide.addText("多源/生活流数据", {
    x: 10.15,
    y: 5.96,
    w: 1.8,
    h: 0.2,
    fontSize: 10,
    color: C.muted,
    align: "right",
  });
  slide.addText("偏行为 / 个性 / agentic", {
    x: 1.05,
    y: 2.15,
    w: 1.2,
    h: 0.2,
    fontSize: 9.5,
    color: C.muted,
    align: "center",
  });
  slide.addText("偏事实回忆 / 时序推理", {
    x: 1.0,
    y: 5.42,
    w: 1.35,
    h: 0.2,
    fontSize: 9.5,
    color: C.muted,
    align: "center",
  });
  addTag(slide, "LongMemEval", 2.1, 4.82, 1.3, C.goldSoft, C.gold);
  addTag(slide, "LoCoMo", 4.15, 4.22, 1.1, C.greenSoft, C.green);
  addTag(slide, "BEAM", 7.05, 4.58, 0.9, C.tealSoft, C.teal);
  addTag(slide, "LifeBench", 9.55, 4.15, 1.2, "DDE7F8", C.navy);
  addTag(slide, "PersonaMem-v2", 5.55, 3.08, 1.55, C.coralSoft, C.coral);
  addTag(slide, "MemoryAgentBench", 8.0, 2.72, 1.8, C.goldSoft, C.gold);
  addInfoListCard(
    slide,
    1.45,
    2.25,
    3.1,
    1.55,
    "一句话理解",
    [
      "LongMemEval / LoCoMo 是“长期对话 memory”主线",
      "PersonaMem-v2 是“个性化 / 用户画像”主线",
      "BEAM / LifeBench 把长度与现实性都拉高",
      "MemoryAgentBench 更像“memory agent 综合测评”",
    ],
    C.navy,
    "DDE7F8",
    { usePanel: true, fontSize: 8.8, lineH: 0.26 }
  );
  addCue(slide, "讲完这页后，听众会明白为什么不同项目在不同 benchmark 上优势不同。");
  finalizeSlide(slide);
}

// Slide 11
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 11);
  addHeader(
    slide,
    "LEADERBOARDS",
    "当前榜首怎么讲才不容易误导",
    "我建议你把“当前最好”拆成公开榜、论文口径和项目自报口径。"
  );
  addInfoListCard(slide, 0.82, 2.0, 4.0, 3.9, "公开榜单快照（2026-04-09）", [
    "LongMemEval S: Hindsight 94.6%",
    "LoCoMo 10: Hindsight 92.0%",
    "PersonaMem 32K: Hindsight 86.6%",
    "BEAM 10M: Hindsight 64.1%",
    "LifeBench EN: Hindsight 71.5%",
  ], C.teal, C.tealSoft, { titleSize: 15, fontSize: 10.2, lineH: 0.5 });
  addInfoListCard(slide, 5.05, 2.0, 3.3, 1.9, "论文口径", [
    "例如 LifeBench 论文里的统一实验里，顶尖系统也只有 55.2% 左右",
    "不同 backbone、retriever、reranker 会明显影响绝对分数",
  ], C.gold, C.goldSoft, { fontSize: 9.3, lineH: 0.32 });
  addInfoListCard(slide, 5.05, 4.12, 3.3, 1.78, "项目自报口径", [
    "MemOS README、MemPalace README、Supermemory 官网都给出各自最强口径",
    "这些数字可以讲，但要明确写明来源和条件",
  ], C.coral, C.coralSoft, { fontSize: 9.2, lineH: 0.31 });
  addInfoListCard(slide, 8.62, 2.0, 3.88, 3.9, "我建议你在台上这样说", [
    "截至 2026 年 4 月 9 日，公开可查的 AMB 聚合快照里，Hindsight 在已覆盖数据集上整体领先。",
    "但这不等于 MemOS、Supermemory、MemPalace 就不能打。",
    "因为不同系统擅长的 benchmark 不同，很多结果也依赖具体 harness 和集成方式。",
  ], C.navy, "DDE7F8", { fontSize: 10.1, lineH: 0.46 });
  addCue(slide, "这页的关键是让你显得严谨：不要把 vendor 自报成绩和公开榜单混成一句“第一名”。");
  finalizeSlide(slide);
}

// Slide 12
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 12);
  addHeader(
    slide,
    "MEMOS",
    "MemOS：把 memory 直接上升成“操作系统”",
    "如果你想讲一个最系统化、最像“memory substrate”的项目，MemOS 是很合适的入口。"
  );
  addInfoListCard(slide, 0.82, 2.0, 4.15, 3.95, "它的核心叙事", [
    "Memory OS for AI Agents",
    "统一表示、检索、更新、调度 memory",
    "从聊天记忆扩展到 KB、tool memory、多模态、MCP",
    "把 memory 视作一类长期管理资源",
  ], C.gold, C.goldSoft, { titleSize: 16, fontSize: 10, lineH: 0.43 });
  addInfoListCard(slide, 5.2, 2.0, 3.35, 1.84, "为什么值得讲", [
    "它最像“系统论文 / 系统产品”",
    "概念最完整，方便讲架构层次",
    "适合引出 memory scheduling / feedback / KB",
  ], C.teal, C.tealSoft, { fontSize: 9.3, lineH: 0.31 });
  addInfoListCard(slide, 5.2, 4.12, 3.35, 1.84, "你可以怎么定义它", [
    "不是单一 retrieval layer",
    "不是只做 user profile",
    "而是把 memory 当成 agent runtime 的一部分",
  ], C.coral, C.coralSoft, { fontSize: 9.3, lineH: 0.31 });
  addKpiCard(slide, 8.82, 2.0, 1.12, 1.06, "OS", "定位", C.navy, "DDE7F8");
  addKpiCard(slide, 9.98, 2.0, 1.12, 1.06, "MCP", "接口", C.navy, "DDE7F8");
  addKpiCard(slide, 11.14, 2.0, 1.12, 1.06, "KB", "知识库", C.navy, "DDE7F8");
  addKpiCard(slide, 8.82, 3.28, 1.12, 1.06, "MM", "多模态", C.green, C.greenSoft);
  addKpiCard(slide, 9.98, 3.28, 1.12, 1.06, "Tool", "工具记忆", C.green, C.greenSoft);
  addKpiCard(slide, 11.14, 3.28, 1.12, 1.06, "FB", "反馈纠错", C.green, C.greenSoft);
  addInfoListCard(slide, 8.82, 4.62, 3.44, 1.34, "一句话评价", [
    "MemOS 更像“做 memory 平台”的方案，而不是“给聊天机器人加点记忆”。",
  ], C.navy, "DDE7F8", { noBullets: true, fontSize: 10.3, lineH: 0.28 });
  addCue(slide, "介绍 MemOS 时，重点讲它为什么叫 OS：它不是存储插件，而是把 memory 提升成运行时层。");
  finalizeSlide(slide);
}

// Slide 13
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 13);
  addHeader(
    slide,
    "MEMOS DETAILS",
    "MemOS 值得重点分析的角度",
    "我建议你从使用方式、能力边界、工程复杂度、证据强度这 4 个角度讲。"
  );
  addInfoListCard(slide, 0.82, 2.0, 3.75, 3.95, "使用方式", [
    "`pip install MemoryOS -U`",
    "`MemOSClient()` 初始化",
    "`add_message()` 写入会话",
    "`search_memory()` 检索记忆",
    "也支持 self-host + MCP",
  ], C.gold, C.goldSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 4.82, 2.0, 3.75, 3.95, "项目特色", [
    "统一 Memory API / MAG 叙事",
    "知识库系统 + 文档/URL 解析",
    "tool memory、feedback、精确删除",
    "多模态 memory，调度和 DB 优化",
    "更像完整 memory stack",
  ], C.teal, C.tealSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 8.82, 2.0, 3.43, 3.95, "优点与风险", [
    "优点：概念完整、能力广、适合企业型 memory infra",
    "风险：系统面大，部署和治理复杂度高",
    "风险：很多 benchmark 成绩来自项目 README 口径",
    "适合：想把 memory 当平台能力建设的团队",
  ], C.coral, C.coralSoft, { fontSize: 9.6, lineH: 0.38 });
  addCue(slide, "这页你可以把 MemOS 讲成“最像正统系统方案”的代表，但也要提醒它的工程门槛更高。");
  finalizeSlide(slide);
}

// Slide 14
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 14);
  addHeader(
    slide,
    "SUPERMEMORY",
    "Supermemory：把 memory 做成 context infrastructure",
    "它和 MemOS 最大的区别是，它更像产品化的 context stack，而不是“memory OS 论文”风格。"
  );
  addInfoListCard(slide, 0.82, 2.0, 4.15, 3.95, "它怎么定义自己", [
    "long-term + short-term memory",
    "Memory API — learned user context",
    "connectors / syncing / managed RAG",
    "Memory Router：OpenAI-compatible transparent proxy",
  ], C.teal, C.tealSoft, { titleSize: 16, fontSize: 10, lineH: 0.43 });
  addInfoListCard(slide, 5.2, 2.0, 3.35, 1.84, "为什么有吸引力", [
    "最容易被产品团队理解",
    "零改造/少改造接进现有 app",
    "把 profiles、memory、RAG、router 一起讲",
  ], C.green, C.greenSoft, { fontSize: 9.3, lineH: 0.31 });
  addInfoListCard(slide, 5.2, 4.12, 3.35, 1.84, "你可以怎么概括它", [
    "不是只卖 retrieval",
    "也不是只卖 user memory",
    "而是在卖“上下文工程平台”",
  ], C.gold, C.goldSoft, { fontSize: 9.3, lineH: 0.31 });
  addKpiCard(slide, 8.82, 2.0, 1.12, 1.06, "API", "Memory", C.navy, "DDE7F8");
  addKpiCard(slide, 9.98, 2.0, 1.12, 1.06, "RTR", "Router", C.navy, "DDE7F8");
  addKpiCard(slide, 11.14, 2.0, 1.12, 1.06, "RAG", "Managed", C.navy, "DDE7F8");
  addKpiCard(slide, 8.82, 3.28, 1.12, 1.06, "CTX", "Context", C.coral, C.coralSoft);
  addKpiCard(slide, 9.98, 3.28, 1.12, 1.06, "PRO", "Profiles", C.coral, C.coralSoft);
  addKpiCard(slide, 11.14, 3.28, 1.12, 1.06, "CON", "Connectors", C.coral, C.coralSoft);
  addInfoListCard(slide, 8.82, 4.62, 3.44, 1.34, "一句话评价", [
    "Supermemory 更像“memory-native context platform”。",
  ], C.navy, "DDE7F8", { noBullets: true, fontSize: 10.3, lineH: 0.28 });
  addCue(slide, "讲 Supermemory 时，抓住一个词就够了：context infrastructure。");
  finalizeSlide(slide);
}

// Slide 15
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 15);
  addHeader(
    slide,
    "SUPERMEMORY DETAILS",
    "Supermemory 值得重点分析的角度",
    "最适合从接入方式、平台能力、商业形态、取舍关系去讲。"
  );
  addInfoListCard(slide, 0.82, 2.0, 3.75, 3.95, "使用方式", [
    "Memory API：显式读写 memory",
    "Memory Router：作为代理层接在模型前面",
    "可与 OpenAI-compatible client 集成",
    "同一 user_id 共享同一 memory pool",
  ], C.teal, C.tealSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 4.82, 2.0, 3.75, 3.95, "项目特色", [
    "drop-in 感最强",
    "把 connectors / extraction / RAG 都统一到一个上下文栈",
    "更偏平台产品，而不是纯研究系统",
    "很适合“先上线，再逐步深化”的路线",
  ], C.green, C.greenSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 8.82, 2.0, 3.43, 3.95, "优点与风险", [
    "优点：上手快、产品叙事清楚、适合 API-first 团队",
    "风险：更依赖平台抽象，底层控制感相对弱",
    "风险：benchmark 成绩更多来自项目方/生态页",
    "适合：想快速做 memory-enhanced app 的团队",
  ], C.coral, C.coralSoft, { fontSize: 9.6, lineH: 0.38 });
  addCue(slide, "把 Supermemory 讲成“最快落地的一体化 context 层”会很容易让全员场听懂。");
  finalizeSlide(slide);
}

// Slide 16
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 16);
  addHeader(
    slide,
    "MEMPALACE",
    "MemPalace：把“什么都别丢”做到了极致",
    "它最有辨识度的点不是 memory API，而是它的记忆哲学：先全存，再想办法找。"
  );
  addInfoListCard(slide, 0.82, 2.0, 4.15, 3.95, "它的核心哲学", [
    "不让 AI 先替你决定什么重要",
    "raw verbatim storage",
    "wings / halls / rooms 组织记忆空间",
    "local-first、zero cloud、zero subscription",
  ], C.coral, C.coralSoft, { titleSize: 16, fontSize: 10, lineH: 0.43 });
  addInfoListCard(slide, 5.2, 2.0, 3.35, 1.84, "为什么它会火", [
    "理念非常鲜明",
    "免费、开源、本地优先",
    "LongMemEval raw 96.6% 的话题性极强",
  ], C.gold, C.goldSoft, { fontSize: 9.3, lineH: 0.31 });
  addInfoListCard(slide, 5.2, 4.12, 3.35, 1.84, "你可以怎么定义它", [
    "不是 memory OS",
    "不是 SaaS memory API",
    "而是 local-first verbatim memory system",
  ], C.teal, C.tealSoft, { fontSize: 9.3, lineH: 0.31 });
  addKpiCard(slide, 8.82, 2.0, 1.12, 1.06, "RAW", "Verbatim", C.navy, "DDE7F8");
  addKpiCard(slide, 9.98, 2.0, 1.12, 1.06, "LOC", "Local", C.navy, "DDE7F8");
  addKpiCard(slide, 11.14, 2.0, 1.12, 1.06, "MCP", "Tools", C.navy, "DDE7F8");
  addKpiCard(slide, 8.82, 3.28, 1.12, 1.06, "96.6", "R@5", C.green, C.greenSoft);
  addKpiCard(slide, 9.98, 3.28, 1.12, 1.06, "$0", "Cloud", C.green, C.greenSoft);
  addKpiCard(slide, 11.14, 3.28, 1.12, 1.06, "AAAK", "Experimental", C.green, C.greenSoft);
  addInfoListCard(slide, 8.82, 4.62, 3.44, 1.34, "一句话评价", [
    "MemPalace 是这三者里最“反 extraction、强本地”的方案。",
  ], C.navy, "DDE7F8", { noBullets: true, fontSize: 10.3, lineH: 0.28 });
  addCue(slide, "讲 MemPalace 时，先讲哲学分歧：它不相信先抽取、后丢弃，而相信先保留原文。");
  finalizeSlide(slide);
}

// Slide 17
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 17);
  addHeader(
    slide,
    "MEMPALACE DETAILS",
    "MemPalace 值得重点分析的角度",
    "这个项目很适合讲“亮点很亮，但证据和成熟度都要谨慎看”。"
  );
  addInfoListCard(slide, 0.82, 2.0, 3.75, 3.95, "使用方式", [
    "`pip install mempalace`",
    "`mempalace init` 初始化记忆空间",
    "支持本地索引和 MCP tools",
    "更像个人 agent / 本地助理的记忆底座",
  ], C.coral, C.coralSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 4.82, 2.0, 3.75, 3.95, "项目特色", [
    "原文保留，不做先验 extraction",
    "ChromaDB + 本地数据 + 结构化房间/大厅组织",
    "raw mode 96.6% LongMemEval R@5",
    "README 自己公开修正了 AAAK 与若干表述问题",
  ], C.gold, C.goldSoft, { fontSize: 10, lineH: 0.39 });
  addInfoListCard(slide, 8.82, 2.0, 3.43, 3.95, "优点与风险", [
    "优点：理念清楚、本地优先、可解释、个人场景很有吸引力",
    "风险：项目非常新，成熟度和生态还在形成中",
    "风险：100% hybrid 分数存在方法学争议，raw 96.6 更稳",
    "适合：本地私有 agent / 个人知识助手 / 实验型团队",
  ], C.teal, C.tealSoft, { fontSize: 9.6, lineH: 0.38 });
  addCue(slide, "这页一定要把 caveat 讲出来：MemPalace 很值得关注，但 2026 年 4 月它仍然非常新。");
  finalizeSlide(slide);
}

// Slide 18
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 18);
  addHeader(
    slide,
    "SIDE-BY-SIDE",
    "MemOS、Supermemory、MemPalace 的横向比较",
    "如果你只留一页做比较，我建议留这一页。"
  );
  addInfoListCard(slide, 0.82, 2.0, 3.78, 3.95, "MemOS", [
    "定位：memory operating system",
    "形态：平台/框架 + API + MCP",
    "优势：系统完整、memory 类型最全",
    "代价：复杂度高、运维面更大",
    "更适合：想自建 memory infra 的团队",
  ], C.gold, C.goldSoft, { titleSize: 18, fontSize: 10, lineH: 0.42 });
  addInfoListCard(slide, 4.78, 2.0, 3.78, 3.95, "Supermemory", [
    "定位：context infrastructure",
    "形态：Memory API + Router + Connectors",
    "优势：接入快、产品路径清楚",
    "代价：平台化抽象更强，底层控制感弱一些",
    "更适合：要尽快上线 memory app 的团队",
  ], C.teal, C.tealSoft, { titleSize: 18, fontSize: 10, lineH: 0.42 });
  addInfoListCard(slide, 8.74, 2.0, 3.54, 3.95, "MemPalace", [
    "定位：local-first verbatim memory",
    "形态：本地记忆系统 + MCP",
    "优势：原文保留、私有、本地、低成本",
    "代价：新、争议多、成熟度仍在上升",
    "更适合：个人 agent / 隐私敏感 / 实验型探索",
  ], C.coral, C.coralSoft, { titleSize: 18, fontSize: 9.6, lineH: 0.42 });
  addCue(slide, "这一页你只需要反复强调一句：三者不是简单强弱关系，而是三种非常不同的产品哲学。");
  finalizeSlide(slide);
}

// Slide 19
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 19);
  addHeader(
    slide,
    "HOW I’D CHOOSE",
    "如果让我按场景选，我会怎么选",
    "这页能帮你把前面的分析收束成决策建议。"
  );
  addInfoListCard(slide, 0.82, 2.0, 3.72, 3.95, "选 MemOS", [
    "你要的是可持续建设的 memory platform",
    "你需要 KB、tool memory、feedback、MCP、self-host",
    "你接受更高的系统复杂度",
    "关键词：平台能力、体系化、可扩展",
  ], C.gold, C.goldSoft, { titleSize: 17, fontSize: 10, lineH: 0.44 });
  addInfoListCard(slide, 4.8, 2.0, 3.72, 3.95, "选 Supermemory", [
    "你想最快做出 memory-enhanced 产品",
    "你已有 OpenAI-compatible 调用链",
    "你希望 API、router、profiles、connectors 一站式搞定",
    "关键词：接入快、产品化、context stack",
  ], C.teal, C.tealSoft, { titleSize: 17, fontSize: 10, lineH: 0.44 });
  addInfoListCard(slide, 8.78, 2.0, 3.48, 3.95, "选 MemPalace", [
    "你更在意本地、隐私、原文保留",
    "你不想让系统先替你做 aggressive extraction",
    "你愿意接受新项目的不确定性",
    "关键词：local-first、verbatim、个人 agent",
  ], C.coral, C.coralSoft, { titleSize: 17, fontSize: 9.8, lineH: 0.44 });
  addCue(slide, "用这一页收束很有效：不说谁绝对最好，而是说谁最适合什么样的建设路径。");
  finalizeSlide(slide);
}

// Slide 20
{
  const slide = pptx.addSlide();
  addBg(slide);
  addPageNum(slide, 20);
  addHeader(
    slide,
    "CLOSING",
    "40 分钟版本的最后结论",
    "如果你最后只想让大家带走 4 句话，这一页就是答案。"
  );
  addInfoListCard(slide, 1.05, 2.05, 11.2, 3.95, "我希望听众最后记住的 4 件事", [
    "第一，Agent memory 已经从“聊天历史管理”演化为独立基础设施问题。",
    "第二，不同 benchmark 测的是不同 memory 能力，榜单数字一定要分口径讲。",
    "第三，MemOS、Supermemory、MemPalace 分别代表 OS 化、基础设施化、本地原文派这 3 条路线。",
    "第四，未来的竞争点不只是存储，而是写入、更新、检索、冲突处理和上下文装配。",
  ], C.navy, "DDE7F8", { titleSize: 19, fontSize: 12, lineH: 0.66, usePanel: true });
  slide.addText("一句话收尾：Agent memory 的下一阶段，不是谁“记得更多”，而是谁“更会管理记忆”。", {
    x: 0.95,
    y: 6.08,
    w: 11.45,
    h: 0.36,
    fontSize: 15,
    color: C.teal,
    bold: true,
    align: "center",
  });
  addCue(slide, "最后别再展开细节，就用这句话把分享收住，然后进入问答。");
  finalizeSlide(slide);
}

pptx.writeFile({ fileName: "agent-memory-opening.pptx" });
