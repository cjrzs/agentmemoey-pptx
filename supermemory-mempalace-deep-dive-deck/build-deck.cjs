const pptxgen = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "Supermemory and MemPalace codebase deep dive";
pptx.title = "Supermemory 与 MemPalace 深度调研";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "PingFang SC",
  bodyFontFace: "PingFang SC",
  lang: "zh-CN",
};

const C = {
  bg: "F4F7FB",
  text: "0E2033",
  muted: "586577",
  line: "D3DDE8",
  panel: "FFFFFF",
  panelAlt: "EDF3F9",
  blue: "1E5A89",
  blueSoft: "D8E9F7",
  teal: "237D72",
  tealSoft: "D8F0EC",
  orange: "B86A1A",
  orangeSoft: "F7E6D0",
  red: "A84A54",
  redSoft: "F7DCE0",
  ink: "000000",
};

function addBg(slide) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.16,
    line: { color: C.blue, transparency: 100 },
    fill: { color: C.blue },
  });
}

function addHeader(slide, eyebrow, title, subtitle) {
  slide.addText(eyebrow, {
    x: 0.65,
    y: 0.36,
    w: 4.9,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: C.blue,
    charSpace: 0.4,
  });
  slide.addText(title, {
    x: 0.65,
    y: 0.62,
    w: 11.5,
    h: 0.5,
    fontSize: 23,
    bold: true,
    color: C.text,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.65,
      y: 1.17,
      w: 11.8,
      h: 0.3,
      fontSize: 10.5,
      color: C.muted,
    });
  }
}

function addPageNum(slide, n) {
  slide.addText(String(n), {
    x: 12.1,
    y: 0.36,
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
    y: 7.02,
    w: 12,
    h: 0.16,
    fontSize: 8.2,
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
    rectRadius: 0.05,
    line: { color: opts.line || C.line, pt: opts.pt || 1 },
    fill: { color: opts.fill || C.panel },
  });
}

function tag(slide, x, y, w, text, fill, color = C.text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.28,
    rectRadius: 0.05,
    line: { color: fill, transparency: 100 },
    fill: { color: fill },
  });
  slide.addText(text, {
    x: x + 0.04,
    y: y + 0.07,
    w: w - 0.08,
    h: 0.12,
    fontSize: 8.5,
    bold: true,
    color,
    align: "center",
  });
}

function bullets(slide, items, x, y, w, h, fontSize = 11, color = C.text) {
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
    fontSize,
    color,
    margin: 0,
    paraSpaceAfterPt: 6,
    breakLine: false,
  });
}

function card(slide, x, y, w, h, title, items, tone, soft) {
  panel(slide, x, y, w, h);
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.1,
    line: { color: tone, transparency: 100 },
    fill: { color: tone },
  });
  slide.addText(title, {
    x: x + 0.16,
    y: y + 0.15,
    w: w - 0.32,
    h: 0.2,
    fontSize: 13.5,
    bold: true,
    color: C.text,
  });
  tag(slide, x + 0.16, y + 0.45, 0.86, "结论", soft, tone);
  bullets(slide, items, x + 0.16, y + 0.82, w - 0.32, h - 0.96, 10.2);
}

function sourceBlock(slide, x, y, w, h, title, lines) {
  panel(slide, x, y, w, h, { fill: "FCFDFE" });
  slide.addText(title, {
    x: x + 0.12,
    y: y + 0.12,
    w: w - 0.24,
    h: 0.16,
    fontSize: 10,
    bold: true,
    color: C.blue,
  });
  slide.addText(lines.join("\n"), {
    x: x + 0.12,
    y: y + 0.31,
    w: w - 0.24,
    h: h - 0.4,
    fontFace: "Menlo",
    fontSize: 7.3,
    color: C.text,
    margin: 0,
  });
}

function timelineRow(slide, y, left, right, fill) {
  panel(slide, 0.9, y, 11.55, 0.56, { fill: "FFFFFF" });
  tag(slide, 1.06, y + 0.13, 1.9, left, fill, C.text);
  slide.addText(right, {
    x: 3.18,
    y: y + 0.17,
    w: 8.95,
    h: 0.18,
    fontSize: 10.4,
    color: C.text,
  });
}

function finalize(slide, n, footer) {
  addPageNum(slide, n);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

// 1 Cover
{
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addText("Supermemory 与 MemPalace", {
    x: 0.76,
    y: 0.96,
    w: 6.1,
    h: 0.62,
    fontSize: 28,
    bold: true,
    color: C.text,
  });
  slide.addText("双库深度调研：设计思路、运行方式、存储与检索", {
    x: 0.78,
    y: 1.68,
    w: 6.5,
    h: 0.24,
    fontSize: 13,
    color: C.muted,
  });
  tag(slide, 0.8, 2.12, 1.2, "仓库 A", C.blueSoft, C.blue);
  slide.addText("github.com/supermemoryai/supermemory", {
    x: 2.14,
    y: 2.17,
    w: 4.5,
    h: 0.12,
    fontSize: 10.4,
    color: C.text,
  });
  tag(slide, 0.8, 2.5, 1.2, "仓库 B", C.tealSoft, C.teal);
  slide.addText("github.com/milla-jovovich/mempalace", {
    x: 2.14,
    y: 2.55,
    w: 4.5,
    h: 0.12,
    fontSize: 10.4,
    color: C.text,
  });

  panel(slide, 7.42, 1.12, 4.95, 1.92, { fill: C.panelAlt });
  slide.addText("本次结论先看", {
    x: 7.68,
    y: 1.28,
    w: 1.7,
    h: 0.18,
    fontSize: 12.5,
    bold: true,
    color: C.text,
  });
  bullets(
    slide,
    [
      "Supermemory 更像“托管式 memory/context API + 插件生态”，开源仓库主要公开客户端、文档、前端与可视化层。",
      "MemPalace 更像“本地优先、原文优先”的个人/agent 记忆库，核心存储、MCP 与检索逻辑都在仓库里。",
      "两者都面向 agent memory，但一个偏 SaaS 编排层，一个偏本地 verbatim memory runtime。",
    ],
    7.68,
    1.62,
    4.2,
    1.14,
    10.6
  );

  timelineRow(slide, 4.1, "supermemory 快照", "2026-04-09 latest commit: 3cf7e77 · fix: pro plugin and free plugin confusion (#843)", C.blueSoft);
  timelineRow(slide, 4.82, "mempalace 快照", "2026-04-09 latest commit: 252e440 · version 3.0.14 (pyproject)", C.tealSoft);

  panel(slide, 0.78, 5.58, 11.6, 1.04, { fill: "FFFFFF" });
  slide.addText("分析范围", {
    x: 1.02,
    y: 5.8,
    w: 1.2,
    h: 0.16,
    fontSize: 12,
    bold: true,
    color: C.text,
  });
  bullets(
    slide,
    [
      "README、源码入口、SDK/MCP/CLI、配置与文档页。",
      "重点回答：设计思路、核心概念、如何运行、数据如何保存、如何检索，以及仓库开源边界。",
    ],
    1.02,
    6.05,
    10.8,
    0.36,
    10.4
  );
  finalize(slide, 1, "Sources from GitHub repos, README, docs.supermemory.ai / supermemory.ai/docs, and local code inspection.");
}

// 2 Executive compare
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "EXECUTIVE SUMMARY", "两个库在 memory 上的根本差异", "先定性：一个偏统一托管 API，一个偏本地持久化原文记忆宫殿。");
  card(slide, 0.7, 1.7, 6.0, 4.75, "Supermemory", [
    "定位是“memory and context layer for AI”，强调 API、MCP、profiles、connectors、hybrid search。",
    "README 与 docs 明确描述文档入库、抽取、chunking、embedding、reranking、profiles，但生产引擎实现不在开源仓库内。",
    "仓库公开部分主要是 docs、SDK、OpenAI/AI SDK middleware、browser/web app、memory graph 组件与插件集成。",
    "因此它适合被分析为“开放接口与使用模型”，而不是完整自托管内核。"
  ], C.blue, C.blueSoft);
  card(slide, 6.95, 1.7, 5.7, 4.75, "MemPalace", [
    "定位是“Give your AI a memory. No API key required.”，默认本地运行，强调把原文 verbatim 存下来。",
    "核心实现开源且直接可跑：CLI、miner、ChromaDB 持久化、semantic search、MCP server、graph traversal、SQLite knowledge graph。",
    "设计上反对先用 AI 决定什么该存，先尽量保留原文，再在检索和图遍历阶段利用结构。",
    "因此它更像一个本地 memory substrate / runtime。"
  ], C.teal, C.tealSoft);
  panel(slide, 0.7, 6.62, 11.95, 0.48, { fill: C.orangeSoft, line: C.orange });
  slide.addText("一句话：Supermemory 解决“怎么把 memory 能力接进产品和多客户端”；MemPalace 解决“怎么在本地把记忆可靠保存并按原文找回来”。", {
    x: 0.92,
    y: 6.78,
    w: 11.45,
    h: 0.14,
    fontSize: 10.6,
    bold: true,
    color: C.text,
  });
  finalize(slide, 2, "The distinction matters for self-hosting expectations, storage assumptions, and how much architecture is inspectable from source.");
}

// 3 supermemory design
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SUPERMEMORY", "设计思路与核心概念", "从文档与 SDK 可见，它把 memory、RAG、profiles、connectors 抽象成一套统一 context API。");
  card(slide, 0.72, 1.65, 5.85, 4.95, "设计思路", [
    "把“长期记忆 + 文档检索 + 用户画像 + 连接器同步”收敛成一个 API 层，减少应用侧自建向量库和管道的负担。",
    "文档是入口对象，memory 是处理后的可检索单元；API 先 ingest documents，再自动切成 memories。",
    "除了 search，它把 profile 作为一级能力暴露：静态事实 + 动态近况，可直接注入 system prompt。",
    "以 containerTag / projectId 作为最核心的隔离与上下文分组机制。"
  ], C.blue, C.blueSoft);
  card(slide, 6.8, 1.65, 5.85, 4.95, "核心概念", [
    "Document: 任意上传内容、URL、文件，是处理和状态跟踪单位。",
    "Memory: 从 document 抽取和 chunk 后的检索单位。",
    "Profile: 自动维护的用户画像，分 static / dynamic 两层。",
    "Hybrid Search: 统一搜 memories 与 document chunks。",
    "Container Tag: 用户、项目、空间的逻辑命名空间。"
  ], C.teal, C.tealSoft);
  panel(slide, 0.72, 6.72, 11.93, 0.36, { fill: C.panel });
  slide.addText("代码层信号：`apps/docs/memory-api/ingesting.mdx` 定义了 document→processing→multiple memories；`packages/tools` 与 `openai-sdk-python` 则展示了 profile/search/add 作为对外最稳定的调用界面。", {
    x: 0.94,
    y: 6.84,
    w: 11.5,
    h: 0.12,
    fontSize: 9.9,
    color: C.text,
  });
  finalize(slide, 3, "Important boundary: the repo documents and consumes the engine; it does not include the whole backend service implementation.");
}

// 4 supermemory architecture
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SUPERMEMORY", "架构抽象与开源边界", "可以明确画出来的，是接口面与消费面；生产内核只在文档层可见。");
  panel(slide, 0.7, 1.68, 12.0, 4.8);
  tag(slide, 0.96, 1.98, 1.45, "客户端", C.blueSoft, C.blue);
  slide.addText("App / Browser Extension /\nClaude Code Plugin /\nMCP Client / SDK Wrappers", {
    x: 0.98,
    y: 2.34,
    w: 1.95,
    h: 1.12,
    fontSize: 11,
    color: C.text,
    fit: "shrink",
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 3.08, y: 3.1, w: 0.52, h: 0.34,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 3.78, 1.98, 1.7, "公开接口层", C.tealSoft, C.teal);
  slide.addText("REST API\n`/v3/documents`\n`/v3/search`\n`/v4/profile`\nMCP `memory/recall/context`", {
    x: 3.9, y: 2.34, w: 1.48, h: 1.55, fontSize: 10.8, color: C.text, align: "center"
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 5.78, y: 3.0, w: 0.55, h: 0.42,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 6.54, 1.98, 1.85, "托管引擎", C.orangeSoft, C.orange);
  slide.addText("文档处理\n抽取/清洗\nchunking\nembeddings\nindexing\nprofiles\nreranking", {
    x: 6.7, y: 2.34, w: 1.5, h: 1.72, fontSize: 11, color: C.text, align: "center"
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 8.72, y: 3.0, w: 0.55, h: 0.42,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 9.48, 1.98, 2.18, "输出给应用/LLM", C.redSoft, C.red);
  slide.addText("搜索结果\nprofile.static\nprofile.dynamic\nfull docs / chunks\ncontext injection", {
    x: 9.72, y: 2.34, w: 1.72, h: 1.72, fontSize: 11, color: C.text, align: "center"
  });

  sourceBlock(slide, 0.92, 4.72, 5.15, 1.4, "Repo Signals", [
    "apps/docs/memory-api/ingesting.mdx",
    "apps/docs/user-profiles/overview.mdx",
    "packages/tools/src/tools-shared.ts",
    "packages/openai-sdk-python/src/.../middleware.py",
  ]);
  sourceBlock(slide, 6.32, 4.72, 5.78, 1.4, "Interpretation", [
    "Open repo exposes client-side contract and wrappers.",
    "Docs describe engine stages; production persistence/index internals",
    "are consumed through hosted endpoints, not shipped here.",
  ]);
  finalize(slide, 4, "Do not promise self-hostability of the full Supermemory engine based on this repo alone.");
}

// 5 supermemory run
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SUPERMEMORY", "如何运行", "严格说它有三种“运行”：消费端使用、SDK 接入、MCP 集成。");
  card(slide, 0.7, 1.7, 3.9, 4.85, "1. 直接使用产品", [
    "Web app: `https://app.supermemory.ai`。",
    "浏览器扩展、Raycast、各类插件把用户会话与内容接到 hosted API。",
    "这一层主要给最终用户和无代码场景。"
  ], C.blue, C.blueSoft);
  card(slide, 4.72, 1.7, 3.9, 4.85, "2. 代码接入", [
    "`npm install supermemory` 或 `pip install supermemory`。",
    "用 SDK 调 `add()`、`search`、`profile()`。",
    "中间件封装已覆盖 OpenAI、Vercel AI SDK、Microsoft Agent Framework、Pipecat。"
  ], C.teal, C.tealSoft);
  card(slide, 8.74, 1.7, 3.9, 4.85, "3. MCP / 插件", [
    "README 推荐 `npx -y install-mcp@latest https://mcp.supermemory.ai/mcp --client claude --oauth=yes`。",
    "工具面向 `memory`、`recall`、`context`。",
    "对用户来说，它是跨客户端的统一记忆层。"
  ], C.orange, C.orangeSoft);
  panel(slide, 0.72, 6.72, 11.92, 0.34, { fill: C.panel });
  slide.addText("仓库本身能本地跑的是 docs / web / 插件等前端或 wrapper，但不是完整托管引擎。", {
    x: 0.94,
    y: 6.84,
    w: 11.4,
    h: 0.12,
    fontSize: 10.2,
    bold: true,
    color: C.text,
  });
  finalize(slide, 5, "This distinction is likely the biggest expectation gap when people first open the repo.");
}

// 6 supermemory storage and retrieval
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SUPERMEMORY", "数据如何保存、如何检索", "这里能说清的部分来自 docs、schema 和 SDK 调用链。");
  card(slide, 0.72, 1.7, 5.8, 4.95, "保存模型", [
    "输入内容先作为 document 入库，API 立即返回 `id + status`，后台异步处理。",
    "文档会经历 content extraction、memory creation、embedding & indexing。",
    "元数据可带 `containerTag/containerTags`、`customId`、扁平 `metadata`。",
    "README 与 docs 明确存在 documents 与 memories 两层；具体底层数据库/索引实现未在仓库公开。"
  ], C.blue, C.blueSoft);
  card(slide, 6.82, 1.7, 5.8, 4.95, "检索模型", [
    "Search 支持 `hybrid` 与 `memories` 两种模式；`hybrid` 同时搜 memories 与 document chunks。",
    "可用 `containerTag` 和 metadata filters 缩小范围；可选 rerank。",
    "Reranking 文档页注明当前使用 `bge-reranker-base`。",
    "Profile API 会返回 `profile.static`、`profile.dynamic`，并可叠加 `searchResults` 形成 prompt 注入上下文。"
  ], C.teal, C.tealSoft);
  panel(slide, 0.72, 6.76, 11.92, 0.28, { fill: C.orangeSoft, line: C.orange });
  slide.addText("最准确的理解：Supermemory 对外暴露的是“统一记忆查询面”，而不是让你直接管理底层向量库。", {
    x: 0.94,
    y: 6.85,
    w: 11.4,
    h: 0.1,
    fontSize: 10.3,
    bold: true,
    color: C.text,
  });
  finalize(slide, 6, "Search docs also mention advanced filtering, query rewriting, and hybrid ranking beyond naive vector lookup.");
}

// 7 mempalace design
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMPALACE", "设计思路与核心概念", "它的 thesis 很鲜明：默认先保存原文，不让 AI 先替你决定什么值得记住。");
  card(slide, 0.72, 1.68, 5.85, 4.98, "设计思路", [
    "记忆以 verbatim drawers 为核心，不做默认摘要化存储；搜索返回的也是原文片段。",
    "通过 palace 隐喻组织结构：wing / hall / room / drawer / tunnel / closet。",
    "同一个 palace 同时承载项目文件和会话导入，两种 ingestion 共享一套搜索面。",
    "本地优先、无 API key，适配 CLI、MCP、本地 LLM context 注入。"
  ], C.teal, C.tealSoft);
  card(slide, 6.8, 1.68, 5.85, 4.98, "核心概念", [
    "Wing: 项目、人、主题级命名空间。",
    "Room: 具体议题或实体名，检索和图遍历的节点粒度。",
    "Drawer: 真正持久化的原文 chunk，存在 Chroma collection 里。",
    "Closet: 指向原文的摘要/压缩层，AAAK 属于可选压缩方言。",
    "Tunnel: 跨 wing 复现的同名 room，形成跨域连通。"
  ], C.blue, C.blueSoft);
  panel(slide, 0.72, 6.78, 11.92, 0.26, { fill: C.panel });
  slide.addText("README 甚至直接把“Store everything verbatim”写成方法论；AAAK 在最新 README 里被明确标成实验层，而非默认路径。", {
    x: 0.94,
    y: 6.86,
    w: 11.4,
    h: 0.1,
    fontSize: 10,
    color: C.text,
  });
  finalize(slide, 7, "This is a materially different design philosophy from profile-first or extraction-first memory systems.");
}

// 8 mempalace architecture
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMPALACE", "运行时架构", "实现比 README 说得更朴素：CLI + ChromaDB + metadata graph + optional SQLite knowledge graph。");
  panel(slide, 0.7, 1.74, 12, 4.76);
  tag(slide, 1.0, 2.0, 1.3, "入口", C.tealSoft, C.teal);
  slide.addText("CLI\n`init`\n`mine`\n`search`\n`wake-up`\n`status`\n`repair`\nMCP server", {
    x: 0.95, y: 2.35, w: 1.35, h: 1.95, fontSize: 11, color: C.text, align: "center"
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 2.65, y: 3.05, w: 0.55, h: 0.42,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 3.4, 2.0, 1.68, "Ingestion", C.blueSoft, C.blue);
  slide.addText("`miner.py`\n项目文件切块\n`convo_miner.py`\n会话导入\nroom / wing 检测", {
    x: 3.49, y: 2.35, w: 1.55, h: 1.85, fontSize: 11, color: C.text, align: "center"
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 5.45, y: 3.05, w: 0.55, h: 0.42,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 6.2, 2.0, 1.84, "持久化层", C.orangeSoft, C.orange);
  slide.addText("ChromaDB PersistentClient\ncollection: `mempalace_drawers`\nmetadata: wing/room/hall/... \n+ SQLite knowledge graph", {
    x: 6.28, y: 2.35, w: 1.7, h: 1.85, fontSize: 10.8, color: C.text, align: "center"
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 8.45, y: 3.05, w: 0.55, h: 0.42,
    line: { color: C.line }, fill: { color: C.blueSoft }
  });
  tag(slide, 9.22, 2.0, 2.1, "检索与编排层", C.redSoft, C.red);
  slide.addText("`searcher.py`\nsemantic search\n`palace_graph.py`\ntraverse / tunnels\n`knowledge_graph.py`\ntemporal triples", {
    x: 9.38, y: 2.35, w: 1.8, h: 1.95, fontSize: 10.8, color: C.text, align: "center"
  });
  sourceBlock(slide, 0.95, 4.82, 4.0, 1.26, "Primary Files", [
    "mempalace/cli.py",
    "mempalace/miner.py",
    "mempalace/convo_miner.py",
    "mempalace/mcp_server.py",
  ]);
  sourceBlock(slide, 5.15, 4.82, 6.6, 1.26, "Storage + Search Files", [
    "mempalace/palace.py · get_collection()",
    "mempalace/searcher.py · semantic retrieval",
    "mempalace/palace_graph.py · graph from metadata",
    "mempalace/knowledge_graph.py · temporal KG in SQLite",
  ]);
  finalize(slide, 8, "MemPalace is inspectable end-to-end from code, which makes claims about storage/retrieval much easier to verify.");
}

// 9 mempalace run
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMPALACE", "如何运行", "这部分几乎全在 README 和 CLI 里，且默认都走本地路径。");
  card(slide, 0.72, 1.72, 3.7, 4.8, "CLI Quickstart", [
    "`pip install mempalace`",
    "`mempalace init ~/projects/myapp`",
    "`mempalace mine ~/projects/myapp`",
    "`mempalace search \"query\"`",
    "`mempalace status` / `wake-up`"
  ], C.teal, C.tealSoft);
  card(slide, 4.55, 1.72, 3.7, 4.8, "会话导入", [
    "`mempalace mine ~/claude-sessions --mode convos`",
    "会话和项目文件进入同一个 palace。",
    "`convo_miner.py` 为每个 chunk 生成 drawer ID 和 metadata。"
  ], C.blue, C.blueSoft);
  card(slide, 8.38, 1.72, 4.24, 4.8, "MCP 与 Agent", [
    "`python -m mempalace.mcp_server`",
    "README 示例：`claude mcp add mempalace -- python -m mempalace.mcp_server`",
    "暴露 status、list_wings、search、add_drawer、find_tunnels、diary 等工具。"
  ], C.orange, C.orangeSoft);
  panel(slide, 0.72, 6.72, 11.9, 0.34, { fill: C.panel });
  slide.addText("和 Supermemory 不同，这里“本地运行”意味着核心存储、语义检索、graph 逻辑都真的在本机发生。", {
    x: 0.95,
    y: 6.84,
    w: 11.35,
    h: 0.12,
    fontSize: 10.1,
    bold: true,
    color: C.text,
  });
  finalize(slide, 9, "It is much closer to a local-first developer tool than a hosted memory API.");
}

// 10 mempalace storage
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMPALACE", "数据如何保存", "仓库里对持久化位置、集合名和元数据字段写得很直接。");
  card(slide, 0.72, 1.72, 5.8, 4.95, "主存储：ChromaDB drawers", [
    "`config.py` 默认 palace path 为 `~/.mempalace/palace`。",
    "`palace.py` 用 `chromadb.PersistentClient(path=palace_path)` 打开持久化目录。",
    "collection 默认名是 `mempalace_drawers`。",
    "每个 drawer 存原文 chunk，metadata 至少含 `wing`、`room`、`source_file`，很多路径还会写 `hall`、`date`、`added_by` 等。"
  ], C.teal, C.tealSoft);
  card(slide, 6.82, 1.72, 5.8, 4.95, "辅助存储：SQLite knowledge graph", [
    "`knowledge_graph.py` 默认库文件 `~/.mempalace/knowledge_graph.sqlite3`。",
    "表结构包括 `entities` 和 `triples`，支持 `valid_from` / `valid_to`。",
    "图谱不是替代 drawers，而是补一层实体-关系-时间索引。",
    "README / MCP 里的 diary、AAAK、closet 更像围绕主存储的额外写法，不是主数据面。"
  ], C.blue, C.blueSoft);
  panel(slide, 0.72, 6.74, 11.92, 0.3, { fill: C.orangeSoft, line: C.orange });
  slide.addText("所以最精确的保存模型是：原文 chunk 进 Chroma；关系事实进 SQLite KG；两者都本地持久化。", {
    x: 0.94,
    y: 6.85,
    w: 11.4,
    h: 0.1,
    fontSize: 10.3,
    bold: true,
    color: C.text,
  });
  finalize(slide, 10, "This is a dual-store design, but the drawer store remains the canonical memory surface.");
}

// 11 mempalace retrieval
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "MEMPALACE", "如何检索", "它不是只有一个 search：至少有三条 retrieval 路径。");
  card(slide, 0.72, 1.7, 3.85, 4.95, "1. 语义搜索", [
    "`searcher.py` 直接对 Chroma collection 做 `query_texts=[query]`。",
    "返回 documents、metadatas、distances。",
    "支持 `wing` / `room` where filter。",
    "输出仍是 verbatim text，不自动摘要。"
  ], C.teal, C.tealSoft);
  card(slide, 4.72, 1.7, 3.85, 4.95, "2. Metadata Graph", [
    "`palace_graph.py` 从 Chroma metadata 重建 graph。",
    "room 是 node；同名 room 跨 wing 出现时形成 tunnel/edge。",
    "支持 `traverse(start_room)` 和 `find_tunnels(wing_a, wing_b)`。",
    "不需要外部图数据库。"
  ], C.blue, C.blueSoft);
  card(slide, 8.72, 1.7, 3.85, 4.95, "3. Temporal KG", [
    "`knowledge_graph.py` 支持按实体和时间查询三元组。",
    "可做 outgoing/incoming/both traversal。",
    "用于表达“什么事实在什么时候为真”。",
    "补足纯向量检索对时间与关系的弱点。"
  ], C.orange, C.orangeSoft);
  panel(slide, 0.72, 6.74, 11.92, 0.3, { fill: C.panel });
  slide.addText("所以 MemPalace 的 retrieval 不是单一路径，而是 `semantic recall + metadata graph + temporal KG` 的轻量组合。", {
    x: 0.94,
    y: 6.85,
    w: 11.4,
    h: 0.1,
    fontSize: 10.2,
    bold: true,
    color: C.text,
  });
  finalize(slide, 11, "Compared with many local-memory tools, the graph and temporal layers are the main differentiators.");
}

// 12 compare
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "COMPARISON", "放到同一张图里看", "定位、数据主语和检索主语不同，导致接入方式和适用场景也不同。");
  panel(slide, 0.72, 1.7, 11.9, 4.95);
  slide.addText("维度", { x: 0.95, y: 1.95, w: 0.8, h: 0.16, fontSize: 11.5, bold: true, color: C.text });
  slide.addText("Supermemory", { x: 2.3, y: 1.95, w: 3.65, h: 0.16, fontSize: 11.5, bold: true, color: C.text });
  slide.addText("MemPalace", { x: 7.0, y: 1.95, w: 3.65, h: 0.16, fontSize: 11.5, bold: true, color: C.text });

  const rows = [
    ["产品形态", "托管 API + app/MCP/plugins/SDK", "本地 CLI + MCP + local storage"],
    ["开源边界", "接口层/文档层开源，生产引擎未完整公开", "核心实现基本都在仓库里"],
    ["主数据对象", "document → memories → profiles", "drawer(verbatim chunk) + optional closet"],
    ["主要存储", "仓库未公开底层细节；文档说明 embedding/indexing", "ChromaDB 持久化目录 + SQLite KG"],
    ["主要检索", "hybrid search + profiles + rerank", "semantic search + tunnel graph + temporal triples"],
    ["适合场景", "给产品快速接 memory/context 能力", "给本地 agent / 个人知识库做持久化记忆"],
  ];
  rows.forEach((row, i) => {
    const y = 2.28 + i * 0.58;
    slide.addShape(pptx.ShapeType.line, {
      x: 0.92, y: y + 0.42, w: 11.45, h: 0,
      line: { color: C.line, pt: 1 }
    });
    slide.addText(row[0], { x: 0.95, y, w: 1.05, h: 0.18, fontSize: 10.5, bold: true, color: C.text });
    slide.addText(row[1], { x: 2.3, y, w: 4.15, h: 0.24, fontSize: 10.2, color: C.text, fit: "shrink" });
    slide.addText(row[2], { x: 7.0, y, w: 4.15, h: 0.24, fontSize: 10.2, color: C.text, fit: "shrink" });
  });
  panel(slide, 0.72, 6.72, 11.92, 0.32, { fill: C.redSoft, line: C.red });
  slide.addText("如果你的需求是“我想自己掌控数据并看懂每一层怎么工作”，优先看 MemPalace；如果你的需求是“我想最快把 memory 做进产品”，Supermemory 的 API 面更顺手。", {
    x: 0.95,
    y: 6.83,
    w: 11.4,
    h: 0.1,
    fontSize: 10.1,
    bold: true,
    color: C.text,
  });
  finalize(slide, 12, "This is a product/architecture tradeoff, not a pure quality judgment.");
}

// 13 source map
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "SOURCE MAP", "关键源码与文档入口", "方便二次深入。");
  sourceBlock(slide, 0.72, 1.72, 5.8, 4.95, "Supermemory", [
    "README.md",
    "apps/docs/memory-api/introduction.mdx",
    "apps/docs/memory-api/ingesting.mdx",
    "apps/docs/memory-api/features/reranking.mdx",
    "apps/docs/user-profiles/overview.mdx",
    "packages/tools/src/tools-shared.ts",
    "packages/ai-sdk/src/tools.ts",
    "packages/openai-sdk-python/src/supermemory_openai/middleware.py",
  ]);
  sourceBlock(slide, 6.82, 1.72, 5.8, 4.95, "MemPalace", [
    "README.md",
    "pyproject.toml",
    "mempalace/cli.py",
    "mempalace/config.py",
    "mempalace/palace.py",
    "mempalace/miner.py",
    "mempalace/searcher.py",
    "mempalace/palace_graph.py",
    "mempalace/knowledge_graph.py",
    "mempalace/mcp_server.py",
  ]);
  finalize(slide, 13, "All listed files were inspected locally from cloned repositories.");
}

// 14 links
{
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, "LINKS", "外部来源与引用链接", "PPT 内容主要来自源码；这里补上官方页面与仓库链接。");
  sourceBlock(slide, 0.72, 1.72, 5.8, 4.9, "Supermemory URLs", [
    "https://github.com/supermemoryai/supermemory",
    "https://supermemory.ai/docs",
    "https://supermemory.ai/docs/search/reranking",
    "https://docs.supermemory.ai/supermemory-mcp/introduction",
    "https://supermemory.ai/docs/quickstart",
    "https://console.supermemory.ai",
  ]);
  sourceBlock(slide, 6.82, 1.72, 5.8, 4.9, "MemPalace URLs", [
    "https://github.com/milla-jovovich/mempalace",
    "https://pypi.org/project/mempalace/",
    "README and examples inside repository are primary reference.",
    "No separate official docs site was needed for core verification.",
  ]);
  panel(slide, 0.72, 6.72, 11.92, 0.32, { fill: C.panel });
  slide.addText("说明：supermemory 的部分结论必须标注“基于文档与 SDK 推断”，因为核心托管引擎未在仓库里完整公开；mempalace 的部分结论则可以直接落到源码。", {
    x: 0.95,
    y: 6.84,
    w: 11.4,
    h: 0.1,
    fontSize: 9.9,
    color: C.text,
  });
  finalize(slide, 14, "Use this distinction when presenting confidence levels to others.");
}

async function main() {
  await pptx.writeFile({ fileName: "supermemory-mempalace-deep-dive.pptx" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
