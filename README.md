# AI Agent 学习路线

一个面向 AI Agent 开发的学习平台，覆盖从基础到企业级实践的知识体系。

## 内容

| 阶段 | 主题数 | 内容 |
|------|--------|------|
| 01-basics | 9 | Python、TypeScript、Git、Linux 等基础 |
| 02-backend | 7 | FastAPI、PostgreSQL、Redis、WebSocket 等 |
| 03-llm | 5 | OpenAI/Claude API、Prompt Engineering、微调 |
| 04-agent | 10 | LangChain、LangGraph、Dify、ComfyUI 等 |
| 05-monitoring | 3 | LangSmith、Prometheus、Grafana |
| 06-knowledge-base | 6 | RAG、Embedding、Qdrant、Elasticsearch |
| 07-mcp | 3 | MCP 协议、Server、Client |
| 08-deployment | 7 | Docker、K8s、CI/CD、Nginx、云平台 |
| 09-enterprise | 7 | 多 Agent、工作流、安全、成本优化 |
| 10-spider | 16 | 爬虫与反爬、API 逆向、浏览器自动化 |
| 11-ai-programming | 7 | AI 编程工具、代码审查、测试策略 |
| 12-building-coding-agents | 7 | 编程智能体构建实战 |

每个主题包含基础概念、进阶内容和动手练习。

## 快速启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 访问 http://localhost:3000
```

## Docker 部署

```bash
# 构建并启动
docker compose up -d

# 访问 http://localhost:3000
```

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **内容**: MDX + gray-matter + marked
- **运行时**: Node.js 22+
