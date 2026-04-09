const pptxgen = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "MemOS codebase deep dive";
pptx.title = "MemOS 深度调研：设计、存储、检索与运行";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "PingFang SC",
  bodyFontFace: "PingFang SC",
  lang: "zh-CN",
};

const C = {
  bg: "F5F7FA",
  text: "102033",
  muted: "5C6677",
  line: "D6DEE8",
  panel: "FFFFFF",
  panelAlt: "EEF3F8",
  blue: "195C8B",
  blueSoft: "D8EAF6",
  green: "2F7D57",
  greenSoft: "DDEFE4",
  orange: "B86B1D",
  orangeSoft: "F8E7D3",
  red: "B94B57",
  redSoft: "F8DDE2",
  purple: "5A4E9C",
  purpleSoft: "E4E0F6",
  black: "000000",
};

function addBg(slide) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.18,
    line: { color: C.blue, transparency: 100 },
    fill: { color: C.blue },
  });
}

function addHeader(slide, eyebrow, title, subtitle) {
  slide.addText(eyebrow, {
    x: 0.65,
    y: 0.38,
    w: 5.2,
    h: 0.22,
    fontFace: "PingFang SC",
    fontSize: 10,
    bold: true,
    color: C.blue,
    charSpace: 0.4,
  });
  slide.addText(title, {
    x: 0.65,
    y: 0.64,
    w: 11.2,
    h: 0.58,
    fontFace: "PingFang SC",
    fontSize: 24,
    bold: true,
    color: C.text,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.65,
      y: 1.22,
      w: 11.8,
      h: 0.36,
      fontFace: "PingFang SC",
      fontSize: 10.5,
      color: C.muted,
    });
  }
}

function addPageNum(slide, n) {
  slide.addText(String(n), {
    x: 12.1,
    y: 0.38,
    w: 0.55,
    h: 0.18,
    fontSize: 10,
    color: C.muted,
    align: "right",
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.7,
    y: 7.0,
    w: 12.0,
    h: 0.18,
    fontSize: 8.5,
    color: C.muted,
    italic: true,
  });
}

function panel(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    line: { color: opts.line || C.line, pt: opts.pt || 1 },
    fill: { color: opts.fill || C.panel },
  });
}

function tag(slide, x, y, w, text, fill, color = C.text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.3,
    rectRadius: 0.05,
    line: { color: fill, transparency: 100 },
    fill: { color: fill },
  });
  slide.addText(text, {
    x: x + 0.06,
    y: y + 0.075,
    w: w - 0.12,
    h: 0.12,
    fontSize: 8.5,
    bold: true,
    color,
    align: "center",
  });
}

function bullets(slide, items, x, y, w, h, fontSize = 12, color = C.text, bulletColor = C.blue) {
  const runs = [];
  items.forEach((item) => {
    runs.push({
      text: item,
      options: {
        bullet: { indent: 12 },
        breakLine: true,
      },
    });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: "PingFang SC",
    fontSize,
    color,
    breakLine: false,
    paraSpaceAfterPt: 6,
    bullet: { type: "ul" },
    hanging: 2,
    indent: 0,
    margin: 0,
  });
}

function twoColCard(slide, x, y, w, h, title, items, tone, soft) {
  panel(slide, x, y, w, h, { fill: C.panel });
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.11,
    line: { color: tone, transparency: 100 },
    fill: { color: tone },
  });
  slide.addText(title, {
    x: x + 0.16,
    y: y + 0.16,
    w: w - 0.32,
    h: 0.25,
    fontSize: 14,
    bold: true,
    color: C.text,
  });
  tag(slide, x + 0.16, y + 0.5, 0.92, "重点", soft, tone);
  bullets(slide, items, x + 0.16, y + 0.88, w - 0.32, h - 1.0, 10.5, C.text, tone);
}

function sourceBlock(slide, x, y, w, h, title, lines) {
  panel(slide, x, y, w, h, { fill: "FCFDFE" });
  slide.addText(title, {
    x: x + 0.12,
    y: y + 0.12,
    w: w - 0.24,
    h: 0.18,
    fontSize: 10.5,
    bold: true,
    color: C.blue,
  });
  slide.addText(lines.join("\n"), {
    x: x + 0.12,
    y: y + 0.34,
    w: w - 0.24,
    h: h - 0.44,
    fontFace: "Menlo",
    fontSize: 7.8,
    color: C.text,
    margin: 0,
  });
}

function finalize(slide, n, footer) {
  addPageNum(slide, n);
  if (footer) addFooter(slide, footer);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// 1
{
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addText("MemOS 深度调研", {
    x: 0.75,
    y: 0.95,
    w: 5.8,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: C.text,
  });
  slide.addText("设计思路、核心概念、运行方式、数据保存、检索链路", {
    x: 0.75,
    y: 1.72,
    w: 5.9,
    h: 0.3,
    fontSize: 13,
    color: C.muted,
  });
  tag(slide, 0.75, 2.18, 1.55, "仓库", C.blueSoft, C.blue);
  slide.addText("github.com/MemTensor/MemOS", {
    x: 2.42,
    y: 2.23,
    w: 3.9,
    h: 0.12,
    fontSize: 10.5,
    color: C.text,
  });
  tag(slide, 0.75, 2.55, 1.55, "快照", C.greenSoft, C.green);
  slide.addText("2026-04-09 主干，latest commit: 45f4c1b", {
    x: 2.42,
    y: 2.6,
    w: 4.8,
    h: 0.12,
    fontSize: 10.5,
    color: C.text,
  });
  panel(slide, 7.95, 1.18, 4.35, 5.1, { fill: C.panel });
  slide.addText("一句话判断", {
    x: 8.22,
    y: 1.42,
    w: 1.8,
    h: 0.2,
    fontSize: 14,
    bold: true,
    color: C.blue,
  });
  slide.addText("MemOS 不是“外挂一个向量库”的 memory 插件，而是在做一层 Memory Operating System。", {
    x: 8.22,
    y: 1.82,
    w: 3.7,
    h: 0.92,
    fontSize: 18,
    bold: true,
    color: C.text,
    valign: "mid",
  });
  bullets(slide, [
    "用 MOSCore 统一编排多用户、多会话、多 MemCube。",
    "把文本、偏好、KV cache、LoRA 等 memory 做成可插拔 backend。",
    "既支持 SDK，也支持 REST API、MCP、Cloud 与 Self-hosted 两种模式。",
  ], 8.24, 3.12, 3.45, 2.2, 11);
  slide.addShape(pptx.ShapeType.line, {
    x: 0.78, y: 6.25, w: 11.5, h: 0,
    line: { color: C.line, pt: 1 },
  });
  slide.addText("本 deck 基于 README、源码、配置文件、API 入口与数据库后端实现整理。", {
    x: 0.82,
    y: 6.42,
    w: 8.0,
    h: 0.18,
    fontSize: 10,
    color: C.muted,
  });
  finalize(slide, 1);
}

// 2
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "POSITIONING", "它到底想解决什么问题", "官方定位是“Memory Operating System for LLMs and AI agents”，目标不是单点检索，而是统一 store / retrieve / manage。");
  twoColCard(slide, 0.7, 1.72, 4.1, 4.7, "它想替代什么", [
    "只靠长上下文窗口，成本高且历史难维护。",
    "只靠 embedding store，结构信息、权限、多模态、偏好都散落在外层逻辑。",
    "每个 agent 自己写一套 memory pipeline，重复建设且难运维。"
  ], C.red, C.redSoft);
  twoColCard(slide, 4.98, 1.72, 4.1, 4.7, "它提供什么", [
    "统一 Memory API：add / search / update / delete / chat。",
    "统一容器：MemCube，支持项目隔离、共享与动态组合。",
    "统一运行面：MemReader 负责摄取，MemScheduler 负责异步调度。"
  ], C.blue, C.blueSoft);
  twoColCard(slide, 9.26, 1.72, 3.35, 4.7, "README 明确强调", [
    "Multi-modal memory",
    "Multi-Cube knowledge base management",
    "Memory feedback & correction",
    "Enterprise-grade optimizations",
    "Asynchronous ingestion via MemScheduler"
  ], C.green, C.greenSoft);
  finalize(slide, 2, "关键信号：它的设计中心是“操作系统层编排”，而不是“某一种检索算法”。");
}

// 3
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MENTAL MODEL", "最重要的抽象层", "从源码上看，整体分成 5 层：OS Core、Cube、Memory Backend、Reader、Scheduler。");
  panel(slide, 0.85, 1.8, 11.6, 4.8, { fill: C.panel });
  const boxes = [
    { x: 1.15, y: 2.15, w: 2.0, h: 0.9, t: "MOS / MOSCore", s: "用户、session、chat、search、add 总控", c: C.blue, f: C.blueSoft },
    { x: 3.65, y: 2.15, w: 1.9, h: 0.9, t: "MemCube", s: "一个记忆容器 / namespace", c: C.green, f: C.greenSoft },
    { x: 5.95, y: 2.15, w: 2.05, h: 0.9, t: "Memory Backends", s: "text / pref / act / para", c: C.orange, f: C.orangeSoft },
    { x: 8.45, y: 2.15, w: 1.75, h: 0.9, t: "MemReader", s: "把消息/文档转成记忆", c: C.purple, f: C.purpleSoft },
    { x: 10.55, y: 2.15, w: 1.45, h: 0.9, t: "Scheduler", s: "异步与高并发", c: C.red, f: C.redSoft },
  ];
  boxes.forEach((b) => {
    panel(slide, b.x, b.y, b.w, b.h, { fill: b.f, line: b.c });
    slide.addText(b.t, {
      x: b.x + 0.1, y: b.y + 0.12, w: b.w - 0.2, h: 0.18,
      fontSize: 12, bold: true, align: "center", color: C.text,
    });
    slide.addText(b.s, {
      x: b.x + 0.1, y: b.y + 0.4, w: b.w - 0.2, h: 0.22,
      fontSize: 8.5, align: "center", color: C.muted,
    });
  });
  for (let i = 0; i < boxes.length - 1; i++) {
    slide.addShape(pptx.ShapeType.chevron, {
      x: boxes[i].x + boxes[i].w + 0.1, y: 2.42, w: 0.24, h: 0.28,
      line: { color: C.line, transparency: 100 }, fill: { color: C.line },
    });
  }
  bullets(slide, [
    "MOSCore 里最关键的方法是 `register_mem_cube()`、`add()`、`search()`、`chat()`。",
    "MemCube 内部再挂不同 memory backend，形成“一个容器装多种记忆”的形态。",
    "Reader 和 Scheduler 不直接回答问题，但决定了写入质量和系统吞吐。"
  ], 1.2, 3.5, 10.8, 1.4, 11);
  sourceBlock(slide, 1.15, 4.95, 3.35, 1.15, "关键文件", [
    "mem_os/core.py",
    "mem_cube/general.py",
    "memories/factory.py"
  ]);
  sourceBlock(slide, 4.95, 4.95, 3.35, 1.15, "配置入口", [
    "configs/mem_os.py",
    "configs/mem_cube.py",
    "configs/memory.py"
  ]);
  sourceBlock(slide, 8.75, 4.95, 2.95, 1.15, "运行面", [
    "api/server_api.py",
    "api/mcp_serve.py"
  ]);
  finalize(slide, 3);
}

// 4
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMCUBE", "MemCube 是它最核心的组织单位", "MemCube 既是 memory 容器，也是隔离边界。用户、项目、agent 都可以通过 cube 拆分。");
  panel(slide, 0.7, 1.78, 4.35, 4.9, { fill: C.panel });
  slide.addText("GeneralMemCubeConfig", {
    x: 0.92, y: 2.0, w: 2.2, h: 0.2, fontSize: 15, bold: true, color: C.blue,
  });
  bullets(slide, [
    "`user_id`：归属用户",
    "`cube_id`：唯一容器 ID",
    "`text_mem`：naive_text / general_text / tree_text",
    "`act_mem`：kv_cache / vllm_kv_cache",
    "`para_mem`：lora",
    "`pref_mem`：pref_text"
  ], 0.95, 2.38, 3.7, 2.3, 11);
  panel(slide, 5.35, 1.78, 3.25, 4.9, { fill: C.panelAlt });
  slide.addText("register_mem_cube()", {
    x: 5.56, y: 2.0, w: 1.9, h: 0.2, fontSize: 15, bold: true, color: C.green,
  });
  bullets(slide, [
    "支持直接传 `GeneralMemCube` 对象",
    "支持从本地目录 load",
    "支持从远端 repo init",
    "会同时写入 `UserManager` 的 cube 访问关系"
  ], 5.58, 2.38, 2.7, 1.9, 10.5);
  panel(slide, 8.9, 1.78, 3.7, 4.9, { fill: C.panel });
  slide.addText("为什么这个抽象重要", {
    x: 9.1, y: 2.0, w: 2.3, h: 0.2, fontSize: 15, bold: true, color: C.orange,
  });
  bullets(slide, [
    "它把多 agent / 多项目 / 多用户隔离变成一等概念。",
    "同一个 user 可以访问多个 cube。",
    "一个 cube 可以装多种 memory，不需要外层自行拼装。"
  ], 9.12, 2.38, 3.0, 2.0, 10.5);
  finalize(slide, 4, "源码里 `register_mem_cube()` 还会校验 user 对 cube 的访问权限，并同步到 user_manager。");
}

// 5
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMORY TYPES", "它不是只有一种 memory", "从配置和工厂映射上看，它显式区分 textual / activation / parametric / preference。");
  twoColCard(slide, 0.72, 1.72, 3.0, 4.9, "Textual", [
    "`general_text`：向量库长期记忆",
    "`tree_text`：图结构长期记忆",
    "`naive_text`：更轻量的基础形态"
  ], C.blue, C.blueSoft);
  twoColCard(slide, 3.95, 1.72, 3.0, 4.9, "Activation", [
    "`kv_cache`：基于模型内部 KV cache",
    "`vllm_kv_cache`：适配 vLLM",
    "只适合本地 HuggingFace / vLLM 类后端"
  ], C.green, C.greenSoft);
  twoColCard(slide, 7.18, 1.72, 2.65, 4.9, "Parametric", [
    "`lora`：参数化记忆",
    "默认落成 adapter 文件"
  ], C.purple, C.purpleSoft);
  twoColCard(slide, 10.05, 1.72, 2.55, 4.9, "Preference", [
    "`pref_text`",
    "对用户偏好单独抽取、存储和检索"
  ], C.orange, C.orangeSoft);
  finalize(slide, 5, "这也是它叫 Memory OS 的原因：它把不同 memory modality 作为可编排资源，而不是只保留一个 vector memory。");
}

// 6
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "INGESTION", "写入流程：先解析，再落到不同 memory backend", "入口是 `MOSCore.add()`，支持 messages、纯文本、文档路径三种输入。");
  panel(slide, 0.8, 1.82, 11.7, 4.75, { fill: C.panel });
  const flow = [
    ["输入", "messages / memory_content / doc_path"],
    ["选 Cube", "按 user_id 与 mem_cube_id 找目标容器"],
    ["MemReader", "聊天转 memory item；文档做解析/切块/抽取"],
    ["Memory.add", "调用 text_mem / pref_mem 等 backend"],
    ["Scheduler", "异步模式继续增强、重排、补写"]
  ];
  flow.forEach((f, idx) => {
    const x = 1.0 + idx * 2.25;
    panel(slide, x, 2.45, 1.7, 1.4, { fill: idx % 2 ? C.panelAlt : C.panel });
    slide.addText(f[0], {
      x: x + 0.08, y: 2.62, w: 1.54, h: 0.18,
      fontSize: 12, bold: true, color: C.text, align: "center",
    });
    slide.addText(f[1], {
      x: x + 0.08, y: 2.95, w: 1.54, h: 0.42,
      fontSize: 8.8, color: C.muted, align: "center", valign: "mid",
    });
    if (idx < flow.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: x + 1.82, y: 2.95, w: 0.28, h: 0.28,
        line: { color: C.line, transparency: 100 }, fill: { color: C.line },
      });
    }
  });
  bullets(slide, [
    "`tree_text` 不会直接把原始话术塞进库，而是先经 `mem_reader.get_memory()` 做结构化抽取。",
    "文档输入支持 `.txt .pdf .json .md .ppt .pptx` 等。",
    "如果 `mode=async`，`MemScheduler` 会接手后续处理。"
  ], 1.05, 4.35, 10.8, 1.15, 11);
  finalize(slide, 6);
}

// 7
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "GENERAL TEXT", "`general_text`：标准向量记忆实现", "这是最接近常见 memory 库的部分：LLM 抽取 -> embedding -> VecDB。");
  panel(slide, 0.72, 1.75, 5.65, 4.95, { fill: C.panel });
  slide.addText("写入", {
    x: 0.95, y: 1.98, w: 0.8, h: 0.18, fontSize: 15, bold: true, color: C.blue,
  });
  bullets(slide, [
    "`extract()` 用 LLM 按 prompt 抽 `memory list` JSON。",
    "`add()` 对 `memory` 文本做 embedding。",
    "生成 `VecDBItem(id, vector, payload)` 后写入 Qdrant / Milvus。"
  ], 0.98, 2.28, 5.0, 1.7, 10.8);
  slide.addText("检索", {
    x: 0.95, y: 4.32, w: 0.8, h: 0.18, fontSize: 15, bold: true, color: C.green,
  });
  bullets(slide, [
    "`search(query)` 先 embed query。",
    "再做向量相似度搜索，按 score 排序。",
    "返回 `TextualMemoryItem` 列表。"
  ], 0.98, 4.62, 5.0, 1.45, 10.8);
  panel(slide, 6.7, 1.75, 5.95, 4.95, { fill: C.panelAlt });
  slide.addText("意味着什么", {
    x: 6.94, y: 1.98, w: 1.4, h: 0.18, fontSize: 15, bold: true, color: C.orange,
  });
  bullets(slide, [
    "它适合快速接入、语义召回、部署心智成本低。",
    "但结构信息主要还是靠 payload，不像 `tree_text` 那样天然是图。",
    "如果你的 agent memory 需求接近“个人长期偏好 + 语义回忆”，这是更轻的选项。"
  ], 6.98, 2.28, 5.1, 1.8, 10.8);
  sourceBlock(slide, 6.95, 4.45, 4.95, 1.05, "源码路径", [
    "memories/textual/general.py",
    "vec_dbs/qdrant.py"
  ]);
  finalize(slide, 7);
}

// 8
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "TREE TEXT", "`tree_text`：图结构 + 混合检索，是 MemOS 的差异化核心", "这一支不是简单向量召回，而是图存储、BM25、重排、互联网检索和 memory type 分层的组合。");
  panel(slide, 0.72, 1.76, 3.65, 4.95, { fill: C.panel });
  slide.addText("存储层", {
    x: 0.95, y: 2.0, w: 1.0, h: 0.18, fontSize: 15, bold: true, color: C.blue,
  });
  bullets(slide, [
    "默认走 GraphStore：Neo4j / Neo4j Community / PolarDB / Postgres。",
    "可同时持有 embedding、metadata、边关系。",
    "MemoryManager 管 working / long-term / user memory 容量与重组。"
  ], 0.98, 2.28, 3.0, 2.0, 10.4);
  panel(slide, 4.58, 1.76, 3.75, 4.95, { fill: C.panelAlt });
  slide.addText("检索层", {
    x: 4.82, y: 2.0, w: 1.0, h: 0.18, fontSize: 15, bold: true, color: C.green,
  });
  bullets(slide, [
    "Searcher 统一调度 graph search、embedding、BM25、reranker。",
    "可选 `memory_type=WorkingMemory/LongTermMemory/UserMemory/All`。",
    "可带 `search_filter`，例如按 `session_id` 过滤。"
  ], 4.85, 2.28, 3.1, 2.0, 10.4);
  panel(slide, 8.55, 1.76, 4.05, 4.95, { fill: C.panel });
  slide.addText("扩展能力", {
    x: 8.8, y: 2.0, w: 1.2, h: 0.18, fontSize: 15, bold: true, color: C.orange,
  });
  bullets(slide, [
    "可选互联网检索。",
    "可选 skill memory / tool memory / preference memory 融合。",
    "可返回相关子图 `get_relevant_subgraph()`。"
  ], 8.82, 2.28, 3.35, 1.7, 10.4);
  sourceBlock(slide, 8.82, 4.45, 3.1, 1.05, "关键文件", [
    "memories/textual/tree.py",
    "graph_dbs/*",
    "retrieve/advanced_searcher.py"
  ]);
  finalize(slide, 8);
}

// 9
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "CHAT PATH", "`chat()` 的主路径：检索后拼 prompt，再生成", "这是典型 memory-augmented generation，但 MemOS 把 user/cube/session 边界一起纳入了。");
  panel(slide, 0.78, 1.82, 11.7, 4.8, { fill: C.panel });
  const steps = [
    "取当前 user 可访问的 cube",
    "对每个 cube 的 `text_mem.search()` 做检索",
    "把 memories 拼到 system prompt",
    "再调用 chat LLM 生成回答",
    "最后把 query / answer 反向提交给 scheduler",
  ];
  steps.forEach((s, idx) => {
    const y = 2.2 + idx * 0.73;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.05, y, w: 0.42, h: 0.32, rectRadius: 0.06,
      line: { color: C.blue, transparency: 100 }, fill: { color: idx < 3 ? C.blueSoft : C.greenSoft },
    });
    slide.addText(String(idx + 1), {
      x: 1.05, y: y + 0.085, w: 0.42, h: 0.12, fontSize: 9, bold: true, align: "center", color: C.text,
    });
    slide.addText(s, {
      x: 1.65, y: y + 0.02, w: 7.2, h: 0.18, fontSize: 12.5, color: C.text,
    });
  });
  panel(slide, 8.95, 2.15, 2.9, 2.75, { fill: C.panelAlt });
  slide.addText("额外增强", {
    x: 9.18, y: 2.35, w: 1.2, h: 0.18, fontSize: 14, bold: true, color: C.purple,
  });
  bullets(slide, [
    "`PRO_MODE` 会先做 CoT query decomposition。",
    "复杂问题会拆 sub-questions 再检索与综合。",
    "不是所有问题都强制走这个路径。"
  ], 9.18, 2.7, 2.2, 1.45, 10);
  finalize(slide, 9, "这说明 MemOS 不只做“存与搜”，还试图把 retrieval strategy 纳入回答链路。");
}

// 10
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "STORAGE MAP", "数据保存在哪里", "它没有单一存储，而是按对象类型分层：用户与 cube、向量记忆、图记忆、偏好记忆、KV cache。");
  twoColCard(slide, 0.72, 1.75, 3.0, 4.95, "用户 / 权限", [
    "默认 `UserManager` 用 SQLite",
    "文件：`MEMOS_DIR/memos_users.db`",
    "保存 user、cube、user-cube association"
  ], C.blue, C.blueSoft);
  twoColCard(slide, 3.95, 1.75, 3.0, 4.95, "`general_text`", [
    "Qdrant 或 Milvus",
    "每条记录存 `id + vector + payload`",
    "无远程配置时可退到本地 embedded Qdrant path"
  ], C.green, C.greenSoft);
  twoColCard(slide, 7.18, 1.75, 2.65, 4.95, "`tree_text`", [
    "Neo4j / Postgres / PolarDB",
    "图节点、边、properties、可带 embedding"
  ], C.orange, C.orangeSoft);
  twoColCard(slide, 10.05, 1.75, 2.55, 4.95, "其他", [
    "`act_mem` 典型是 pickle",
    "`para_mem` 典型是 LoRA adapter"
  ], C.purple, C.purpleSoft);
  finalize(slide, 10);
}

// 11
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "RUN MODES", "它怎么运行：Cloud、SDK、自托管 API 都有", "README 和代码里能看到 3 条主路径。");
  twoColCard(slide, 0.72, 1.8, 3.85, 4.8, "Cloud API", [
    "官方托管服务",
    "客户端是 `MemOSClient`",
    "API key + base_url 即可调用"
  ], C.blue, C.blueSoft);
  twoColCard(slide, 4.78, 1.8, 3.85, 4.8, "Python SDK", [
    "`MOS.simple()` 自动从环境变量组装默认配置",
    "或手工构建 `MOSConfig` + `GeneralMemCube`",
    "适合本地 agent / app 直接嵌入"
  ], C.green, C.greenSoft);
  twoColCard(slide, 8.84, 1.8, 3.75, 4.8, "Self-hosted API", [
    "Docker Compose：默认 `8000`",
    "Uvicorn CLI 示例：默认 `8001`",
    "FastAPI 入口：`memos.api.server_api:app`"
  ], C.orange, C.orangeSoft);
  finalize(slide, 11, "一个细节：README 中 Docker 暴露 8000，而直接 uvicorn 示例用 8001。");
}

// 12
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SELF-HOSTED", "自托管依赖关系", "官方 docker-compose 默认用 `MemOS API + Neo4j + Qdrant`。");
  panel(slide, 0.85, 1.86, 11.55, 4.72, { fill: C.panel });
  const svc = [
    { x: 1.2, y: 2.45, w: 2.6, h: 1.35, t: "memos-api-docker", s: "FastAPI 服务\n暴露 8000\n依赖 .env 与 src", c: C.blueSoft },
    { x: 5.35, y: 2.45, w: 2.25, h: 1.35, t: "neo4j-docker", s: "图数据库\n7474 / 7687", c: C.greenSoft },
    { x: 8.95, y: 2.45, w: 2.25, h: 1.35, t: "qdrant-docker", s: "向量数据库\n6333 / 6334", c: C.orangeSoft },
  ];
  svc.forEach((b) => {
    panel(slide, b.x, b.y, b.w, b.h, { fill: b.c });
    slide.addText(b.t, {
      x: b.x + 0.1, y: b.y + 0.18, w: b.w - 0.2, h: 0.18, fontSize: 13, bold: true, align: "center", color: C.text,
    });
    slide.addText(b.s, {
      x: b.x + 0.1, y: b.y + 0.5, w: b.w - 0.2, h: 0.4, fontSize: 9.5, align: "center", color: C.muted,
    });
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 4.15, y: 2.92, w: 0.36, h: 0.32, line: { color: C.line, transparency: 100 }, fill: { color: C.line },
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 7.95, y: 2.92, w: 0.36, h: 0.32, line: { color: C.line, transparency: 100 }, fill: { color: C.line },
  });
  bullets(slide, [
    "默认 `.env.example` 中还能切换：`MOS_TEXT_MEM_TYPE=general_text | tree_text`。",
    "图后端也可换成 `neo4j-community / polardb / postgres`。",
    "偏好记忆、互联网检索、scheduler 都是额外开关，不是强制开启。"
  ], 1.25, 4.55, 10.0, 1.3, 10.8);
  finalize(slide, 12);
}

// 13
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "API & MCP", "对外接口：REST API、客户端 SDK、MCP 都有", "这使它既能作为 agent 内部库，也能作为独立 memory service。");
  panel(slide, 0.74, 1.76, 4.0, 4.95, { fill: C.panel });
  slide.addText("SDK / Client", {
    x: 0.98, y: 2.0, w: 1.2, h: 0.18, fontSize: 15, bold: true, color: C.blue,
  });
  bullets(slide, [
    "`MemOSClient.add_message()`",
    "`MemOSClient.search_memory()`",
    "`MemOSClient.get_memory()`",
    "面向 hosted API 调用"
  ], 1.0, 2.3, 3.3, 1.8, 10.8);
  panel(slide, 4.95, 1.76, 4.0, 4.95, { fill: C.panelAlt });
  slide.addText("REST API", {
    x: 5.18, y: 2.0, w: 1.2, h: 0.18, fontSize: 15, bold: true, color: C.green,
  });
  bullets(slide, [
    "`/product/search`",
    "`/product/add`",
    "`/product/chat/complete`",
    "`/product/chat/stream`"
  ], 5.2, 2.3, 3.3, 1.8, 10.8);
  panel(slide, 9.16, 1.76, 3.45, 4.95, { fill: C.panel });
  slide.addText("MCP", {
    x: 9.4, y: 2.0, w: 0.8, h: 0.18, fontSize: 15, bold: true, color: C.orange,
  });
  bullets(slide, [
    "`search_memories`",
    "`add_memory`",
    "`get_memory`",
    "`update_memory`",
    "直接把 MOSCore 能力暴露给 agent"
  ], 9.42, 2.3, 2.6, 2.2, 10.4);
  finalize(slide, 13);
}

// 14
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "TAKEAWAYS", "设计优点与代价", "从工程视角看，MemOS 的价值在于统一编排；代价在于复杂度和依赖面明显更大。");
  twoColCard(slide, 0.72, 1.76, 5.75, 4.95, "优点", [
    "memory 抽象完整：用户、session、cube、memory type 都是一等概念。",
    "既可轻量用 `general_text`，也可重型上 `tree_text`。",
    "多模态、偏好、工具记忆、异步 scheduler 都已有挂点。",
    "对“多 agent / 多项目 / 多租户”场景友好。"
  ], C.green, C.greenSoft);
  twoColCard(slide, 6.72, 1.76, 5.9, 4.95, "代价", [
    "组件很多：LLM、embedder、vec db、graph db、scheduler、user manager。",
    "配置面和部署面都比普通 memory 库重。",
    "不同 backend 行为差异大，排障需要理解底层实现。",
    "如果需求只是简单语义记忆，可能会显得过重。"
  ], C.red, C.redSoft);
  finalize(slide, 14);
}

// 15
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "CODE MAP", "这次实际读到的关键源码", "下面这些文件基本覆盖了设计、运行、存储、检索和对外接口。");
  sourceBlock(slide, 0.75, 1.72, 3.85, 4.95, "OS / Cube / Config", [
    "src/memos/mem_os/core.py",
    "src/memos/mem_os/main.py",
    "src/memos/mem_cube/general.py",
    "src/memos/configs/mem_os.py",
    "src/memos/configs/mem_cube.py",
    "src/memos/configs/memory.py"
  ]);
  sourceBlock(slide, 4.74, 1.72, 3.85, 4.95, "Memory / Storage", [
    "src/memos/memories/textual/general.py",
    "src/memos/memories/textual/tree.py",
    "src/memos/vec_dbs/qdrant.py",
    "src/memos/graph_dbs/neo4j.py",
    "src/memos/graph_dbs/postgres.py",
    "src/memos/mem_user/user_manager.py"
  ]);
  sourceBlock(slide, 8.73, 1.72, 3.85, 4.95, "API / Deploy / Client", [
    "README.md",
    "docker/docker-compose.yml",
    "docker/.env.example",
    "src/memos/api/server_api.py",
    "src/memos/api/routers/server_router.py",
    "src/memos/api/client.py",
    "src/memos/api/mcp_serve.py"
  ]);
  finalize(slide, 15);
}

// 16
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SOURCES", "公开来源附录", "用于这次调研的主来源。");
  panel(slide, 0.74, 1.76, 12.0, 4.95, { fill: C.panel });
  slide.addText([
    "1. GitHub 仓库: https://github.com/MemTensor/MemOS",
    "2. README: https://github.com/MemTensor/MemOS/blob/main/README.md",
    "3. 文档入口: https://memos-docs.openmem.net/home/overview/",
    "4. 论文: https://arxiv.org/abs/2507.03724",
    "5. Cloud / Dashboard: https://memos.openmem.net/ , https://memos-dashboard.openmem.net/",
    "6. 本地源码快照时间: 2026-04-09 15:19:27 +0800, commit 45f4c1be96480c69513efb9fcae59f6c3e9c8deb",
  ].join("\n"), {
    x: 1.0,
    y: 2.15,
    w: 11.2,
    h: 1.6,
    fontSize: 12,
    color: C.text,
    margin: 0,
  });
  slide.addText("备注：本 deck 重点用了 README、核心代码路径、配置样例、Docker Compose、自托管 API 入口和客户端 SDK。", {
    x: 1.0,
    y: 4.45,
    w: 11.1,
    h: 0.3,
    fontSize: 11,
    color: C.muted,
  });
  slide.addText("结束语：如果把 MemOS 当成 agent memory 看，最准确的理解是“统一 memory runtime / operating layer”，而不是单一检索库。", {
    x: 1.0,
    y: 5.25,
    w: 11.1,
    h: 0.52,
    fontSize: 16,
    bold: true,
    color: C.blue,
  });
  finalize(slide, 16);
}

pptx.writeFile({ fileName: "/Users/jrc/agentmemoey-pptx/memos-deep-dive-deck/memos-deep-dive.pptx" });
