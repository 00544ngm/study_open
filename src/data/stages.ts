export interface Topic {
  id: string;
  title: string;
  order: number;
  prerequisites?: string[];
}

export interface Stage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  topics: Topic[];
}

export const stages: Stage[] = [
  {
    id: "01-basics",
    number: 1,
    title: "基础层",
    subtitle: "Foundation",
    description: "AI Agent 开发的基石。Python、Git、TypeScript、Linux 是 AI 编程时代的核心技能。",
    color: "from-blue-500 to-cyan-500",
    topics: [
      { id: "python", title: "Python", order: 1 },
      { id: "git", title: "Git", order: 2 },
      { id: "typescript", title: "TypeScript", order: 3 },
      { id: "windows", title: "Windows", order: 4 },
      { id: "linux", title: "Linux", order: 5 },
      { id: "system-setup", title: "系统安装", order: 6 },
      { id: "ffmpeg", title: "FFmpeg", order: 7 },
      { id: "pytest", title: "Pytest 测试", order: 8 },
      { id: "react", title: "React 基础", order: 9 },
    ],
  },
  {
    id: "02-backend",
    number: 2,
    title: "后端层",
    subtitle: "Backend",
    description: "构建 API 接口与数据层。FastAPI 是 AI Agent 首选的 Web 框架，配合 WebSocket 实现实时通信。",
    color: "from-emerald-500 to-teal-500",
    topics: [
      { id: "fastapi", title: "FastAPI", order: 1, prerequisites: ["01-basics/python"] },
      { id: "postgresql", title: "PostgreSQL", order: 2 },
      { id: "redis", title: "Redis", order: 3 },
      { id: "task-queue", title: "异步任务队列", order: 4, prerequisites: ["02-backend/redis"] },
      { id: "websocket", title: "WebSocket", order: 5, prerequisites: ["02-backend/fastapi"] },
      { id: "sqlalchemy", title: "SQLAlchemy", order: 6, prerequisites: ["02-backend/postgresql"] },
      { id: "database-design", title: "数据库设计", order: 7, prerequisites: ["02-backend/postgresql"] },
    ],
  },
  {
    id: "03-llm",
    number: 3,
    title: "大模型层",
    subtitle: "LLM",
    description: "与大模型对话的能力。掌握 Prompt、Tool Calling、Embedding 以及本地模型部署和微调。",
    color: "from-violet-500 to-purple-500",
    topics: [
      { id: "openai-api", title: "OpenAI API", order: 1 },
      { id: "prompt-engineering", title: "Prompt Engineering", order: 2, prerequisites: ["03-llm/openai-api"] },
      { id: "claude-api", title: "Claude API", order: 3 },
      { id: "ollama", title: "Ollama & vLLM", order: 4 },
      { id: "finetuning", title: "模型微调", order: 5, prerequisites: ["03-llm/openai-api", "03-llm/ollama"] },
    ],
  },
  {
    id: "04-agent",
    number: 4,
    title: "Agent层",
    subtitle: "Agent",
    description: "Agent 的核心。LangChain 封装 LLM 调用，LangGraph 和 PydanticAI 构建 Agent 工作流，Dify 可视化搭建。",
    color: "from-orange-500 to-red-500",
    topics: [
      { id: "langchain", title: "LangChain", order: 1, prerequisites: ["03-llm/openai-api", "03-llm/prompt-engineering"] },
      { id: "langgraph", title: "LangGraph", order: 2, prerequisites: ["04-agent/langchain"] },
      { id: "pydantic-ai", title: "PydanticAI", order: 3, prerequisites: ["03-llm/openai-api"] },
      { id: "evaluation", title: "Agent 评估", order: 4, prerequisites: ["04-agent/langchain", "04-agent/langgraph"] },
      { id: "testing", title: "LLM 测试", order: 5, prerequisites: ["04-agent/langchain"] },
      { id: "ui", title: "Agent 前端交互", order: 6, prerequisites: ["01-basics/react"] },
      { id: "projects", title: "实战项目", order: 7, prerequisites: ["04-agent/langchain", "04-agent/langgraph", "02-backend/fastapi"] },
      { id: "comfyui", title: "ComfyUI", order: 8 },
      { id: "dify", title: "Dify", order: 9 },
      { id: "agent-patterns", title: "Agent 设计模式", order: 10, prerequisites: ["04-agent/langgraph"] },
    ],
  },
  {
    id: "05-monitoring",
    number: 5,
    title: "监控层",
    subtitle: "Monitoring",
    description: "监控 Agent 的运行状态、Token 消耗和性能指标。",
    color: "from-pink-500 to-rose-500",
    topics: [
      { id: "langsmith", title: "LangSmith", order: 1, prerequisites: ["04-agent/langchain"] },
      { id: "prometheus", title: "Prometheus", order: 2, prerequisites: ["08-deployment/docker"] },
      { id: "grafana", title: "Grafana", order: 3, prerequisites: ["05-monitoring/prometheus"] },
    ],
  },
  {
    id: "06-knowledge-base",
    number: 6,
    title: "知识库层",
    subtitle: "Knowledge Base",
    description: "RAG（检索增强生成）的核心技术。Embedding、向量数据库、检索策略、搜索引擎。",
    color: "from-indigo-500 to-blue-500",
    topics: [
      { id: "embedding", title: "Embedding", order: 1, prerequisites: ["03-llm/openai-api"] },
      { id: "rag", title: "RAG", order: 2, prerequisites: ["06-knowledge-base/embedding"] },
      { id: "qdrant", title: "Qdrant", order: 3, prerequisites: ["06-knowledge-base/embedding"] },
      { id: "ingestion", title: "数据摄入", order: 4, prerequisites: ["06-knowledge-base/rag"] },
      { id: "comparison", title: "向量数据库对比", order: 5, prerequisites: ["06-knowledge-base/qdrant"] },
      { id: "elasticsearch", title: "Elasticsearch", order: 6 },
    ],
  },
  {
    id: "07-mcp",
    number: 7,
    title: "MCP层",
    subtitle: "MCP",
    description: "Model Context Protocol — AI 世界的 USB 接口，让 Agent 连接真实世界。",
    color: "from-amber-500 to-yellow-500",
    topics: [
      { id: "mcp-protocol", title: "MCP 协议", order: 1 },
      { id: "mcp-server", title: "MCP Server", order: 2, prerequisites: ["07-mcp/mcp-protocol"] },
      { id: "mcp-client", title: "MCP Client", order: 3, prerequisites: ["07-mcp/mcp-protocol"] },
    ],
  },
  {
    id: "08-deployment",
    number: 8,
    title: "部署层",
    subtitle: "Deployment",
    description: "容器化与部署。Docker + Nginx + 云平台让应用在任何环境运行。",
    color: "from-slate-600 to-slate-800",
    topics: [
      { id: "docker", title: "Docker", order: 1 },
      { id: "docker-compose", title: "Docker Compose", order: 2, prerequisites: ["08-deployment/docker"] },
      { id: "nginx", title: "Nginx", order: 3, prerequisites: ["08-deployment/docker"] },
      { id: "kubernetes", title: "Kubernetes", order: 4, prerequisites: ["08-deployment/docker"] },
      { id: "ci-cd", title: "CI/CD", order: 5, prerequisites: ["01-basics/git"] },
      { id: "cloud", title: "云平台部署", order: 6, prerequisites: ["08-deployment/docker"] },
    ],
  },
  {
    id: "09-enterprise",
    number: 9,
    title: "企业级",
    subtitle: "Enterprise",
    description: "多 Agent 协作、复杂工作流、自动化平台与安全对抗 —— 将所学串联成完整系统。",
    color: "from-green-500 to-lime-500",
    topics: [
      { id: "multi-agent", title: "多 Agent 系统", order: 1, prerequisites: ["04-agent/langgraph", "04-agent/agent-patterns"] },
      { id: "workflow", title: "工作流设计", order: 2, prerequisites: ["04-agent/langgraph"] },
      { id: "automation", title: "自动化平台", order: 3, prerequisites: ["02-backend/task-queue"] },
      { id: "security", title: "AI 安全", order: 4 },
      { id: "cost-optimization", title: "成本优化", order: 5, prerequisites: ["03-llm/openai-api"] },
      { id: "project-structure", title: "项目最佳实践", order: 6 },
      { id: "security-advanced", title: "AI 安全对抗", order: 7, prerequisites: ["09-enterprise/security"] },
    ],
  },
  {
    id: "10-spider",
    number: 10,
    title: "爬虫层",
    subtitle: "Spider",
    description: "数据采集是 AI Agent 的眼睛。从 Requests 到 AI 智能爬虫，从反爬对抗到 JS 逆向，系统掌握数据获取的全栈武艺。",
    color: "from-teal-500 to-cyan-600",
    topics: [
      { id: "requests", title: "Requests", order: 1 },
      { id: "beautifulsoup", title: "BeautifulSoup", order: 2, prerequisites: ["10-spider/requests"] },
      { id: "xpath", title: "XPath", order: 3 },
      { id: "regex", title: "正则表达式", order: 4 },
      { id: "asyncio", title: "Asyncio", order: 5, prerequisites: ["01-basics/python"] },
      { id: "aiohttp", title: "Aiohttp", order: 6, prerequisites: ["10-spider/asyncio"] },
      { id: "playwright", title: "Playwright", order: 7 },
      { id: "scrapy", title: "Scrapy 框架", order: 8, prerequisites: ["10-spider/requests"] },
      { id: "crawl4ai", title: "Crawl4AI", order: 9 },
      { id: "browser-use", title: "Browser Use", order: 10, prerequisites: ["10-spider/playwright"] },
      { id: "api-reverse", title: "API 逆向", order: 11, prerequisites: ["10-spider/requests"] },
      { id: "packet-capture", title: "F12 抓包", order: 12 },
      { id: "selenium", title: "Selenium", order: 13 },
      { id: "anti-crawl", title: "反爬对抗", order: 14, prerequisites: ["10-spider/requests", "10-spider/playwright"] },
      { id: "data-cleaning", title: "数据清洗与存储", order: 15, prerequisites: ["10-spider/requests"] },
      { id: "js-reverse", title: "JS 逆向与混淆", order: 16, prerequisites: ["10-spider/api-reverse", "10-spider/packet-capture"] },
    ],
  },
  {
    id: "11-ai-programming",
    number: 11,
    title: "AI 编程工具",
    subtitle: "AI Programming",
    description: "AI 编程工具（Claude Code、Cursor、Copilot）的实战用法。掌握 AI 编程的 Prompt 技巧、代码审查、测试兜底和架构原则，真正让 AI 成为你的生产力倍增器。",
    color: "from-fuchsia-500 to-pink-500",
    topics: [
      { id: "ai-coding-tools", title: "AI 编程工具实战", order: 1 },
      { id: "code-prompt", title: "AI 代码 Prompt", order: 2, prerequisites: ["03-llm/prompt-engineering"] },
      { id: "code-review-ai", title: "代码审查策略", order: 3 },
      { id: "testing-strategy", title: "测试策略", order: 4, prerequisites: ["01-basics/pytest"] },
      { id: "architecture-principles", title: "软件架构原则", order: 5 },
      { id: "git-advanced", title: "Git 高级工作流", order: 6, prerequisites: ["01-basics/git"] },
      { id: "projects", title: "实战项目", order: 7, prerequisites: ["11-ai-programming/ai-coding-tools", "11-ai-programming/code-prompt"] },
    ],
  },
  {
    id: "12-building-coding-agents",
    number: 12,
    title: "编程智能体构建",
    subtitle: "Coding Agents",
    description: "拆解 Claude Code、Codex 的核心技术。从文件精确操作到进程管理，从代码搜索到上下文窗口控制，系统掌握手搓 AI 编程智能体所需的工程知识。",
    color: "from-rose-500 to-pink-500",
    topics: [
      { id: "file-operations", title: "文件系统精确操作", order: 1, prerequisites: ["01-basics/python"] },
      { id: "process-shell", title: "进程与 Shell 管理", order: 2, prerequisites: ["01-basics/python", "01-basics/linux"] },
      { id: "code-search-engine", title: "代码搜索与理解", order: 3 },
      { id: "context-management", title: "上下文窗口管理", order: 4, prerequisites: ["03-llm/openai-api"] },
      { id: "security-approval", title: "安全审批体系", order: 5 },
      { id: "streaming-ui", title: "流式终端 UI", order: 6, prerequisites: ["02-backend/websocket"] },
      { id: "projects", title: "实战项目", order: 7, prerequisites: ["12-building-coding-agents/file-operations", "12-building-coding-agents/process-shell"] },
    ],
  },
];

export function getStage(slug: string): Stage | undefined {
  return stages.find((s) => s.id === slug);
}

export function getAllStages(): Stage[] {
  return stages;
}
