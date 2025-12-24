# Knowledge 文档：语义/兼容性分层（项目相关 vs 通用）

生成时间：2025-12-24 15:12:30
范围：`knowledge/**/*.md`

按“语义依赖”与“迁移成本”来判断：哪些内容需要随项目重写/替换，哪些可以作为通用知识复用（或在同技术栈下复用）。

## 兼容性分级（迁移成本）

- **A（低耦合 / 通用）**：基本不依赖某个具体项目或仓库结构，换项目也成立。
- **B（中耦合 / 技术栈或工程约定）**：依赖特定技术栈/工程约定（React+TS、Express+Prisma、Zod、Sentry、TanStack 等），可复用但要对齐“命名/目录/封装层/基础设施”。
- **C（高耦合 / 项目或工具链绑定）**：直接引用具体服务名、脚本、账号、路径、运行方式（PM2/Docker/本地数据库容器），或强依赖某个 AI 工具/Hook 的目录结构；通常需要按你的项目改写。

说明：很多 B/C 文档“主题”是最佳实践，但示例与约定明显绑定内部组件/包名/路径（例如 `@/lib/apiClient`、`SSOMiddleware`、`@project-lifecycle-portal/database`）。从兼容性角度仍属于“需要对齐项目约定”。

## 结论（按分级）

- **C（高耦合）**：9
- **B（中耦合）**：26
- **A（低耦合）**：2

## C：项目/工具链强绑定（建议“按你的项目改写”）

- `knowledge/agents/auth-route-debugger.md`：围绕 Keycloak + cookie JWT + `refresh_token` + 特定脚本/PM2 调试流程，属于“某个项目的认证/部署现实”。
- `knowledge/agents/auth-route-tester.md`：测试流程假设存在 `scripts/test-auth-route.js`、特定 test-data、Docker MySQL 容器与库名，强绑定。
- `knowledge/route-tester/SKILL.md`：硬编码 realm、cookie 名、脚本路径（含 `/root/git/...`）与测试账号，强绑定。
- `knowledge/agents/auto-error-resolver.md`：依赖 `~/.claude/tsc-cache/...` 等 Hook/工具产物与 PM2 服务命名，属于“工具链绑定”。
- `knowledge/commands/route-research-for-testing.md`：依赖 `.claude/tsc-cache/*/edited-files.log` 与 “Task tool” 调度语义，工具链绑定。
- `knowledge/commands/dev-docs.md`：依赖 `dev/active/[task-name]/...` 的工作流与项目内文档体系，模板/流程绑定。
- `knowledge/commands/dev-docs-update.md`：同上（上下文压缩前的 handoff 约定），模板/流程绑定。
- `knowledge/agents/code-architecture-reviewer.md`：强依赖某个项目的技术栈清单 + `dev/active` 输出 + “parent Claude instance” 交互约定。
- `knowledge/agents/code-refactor-master.md`：把 `LoadingOverlay`/`SuspenseLoader`/`PaperWrapper` 当作既定组件与强制规范，属于“项目内组件体系绑定”。

## B：技术栈/工程约定绑定（可复用，但要对齐你的实现）

### 后端（Node/TS/Express/Prisma/Zod/Sentry 等）

- `knowledge/skills_backend/backend_guideline.md`：后端分层与实践可复用，但服务名/示例与配置体系需要替换。
- `knowledge/skills_backend/architecture-overview.md`：分层架构通用，但示例依赖 Express + Prisma + 项目中间件命名。
- `knowledge/skills_backend/configuration.md`：`unifiedConfig` 思路可复用，但示例依赖特定目录与 Keycloak/config.ini 形态。
- `knowledge/skills_backend/middleware-guide.md`：中间件组织方式通用，但认证中间件（cookie/JWT）与命名需映射到你的方案。
- `knowledge/skills_backend/routing-and-controllers.md`：路由/控制器模式通用，但示例引用 `SSOMiddleware` 等项目约定。
- `knowledge/skills_backend/services-and-repositories.md`：Service/Repository 分层通用，但示例依赖 PrismaService/内部包名。
- `knowledge/skills_backend/database-patterns.md`：Prisma 模式可复用，但内部包名（如 `@project-lifecycle-portal/database`）需替换。
- `knowledge/skills_backend/validation-patterns.md`：Zod 验证模式通用，可直接迁移到同栈项目。
- `knowledge/skills_backend/sentry-and-monitoring.md`：Sentry 接入思路通用，但初始化/采样/上下文注入需对齐你的工程。
- `knowledge/skills_backend/async-and-errors.md`：async/await 与错误处理模式通用，但示例默认“全量上报 Sentry”。
- `knowledge/skills_backend/testing-guide.md`：Jest/集成测试思路通用，但数据库访问层/包名需对齐你的项目。
- `knowledge/skills_backend/complete-examples.md`：示例代码可复用，但高度依赖内部包名/架构分层与 Prisma 封装。

### 前端（React/TS/MUI/TanStack/React Hook Form 等）

- `knowledge/skills_frontend/frontend_guideline.md`：总体规范可复用，但强依赖 `@/`/`~types` 等别名与 `useAuth`/`apiClient` 这类封装存在。
- `knowledge/skills_frontend/file-organization.md`：目录与别名组织可复用，但需要映射到你项目的实际结构与导入别名。
- `knowledge/skills_frontend/component-patterns.md`：组件模式通用，但示例里把 `SuspenseLoader` 等组件当既定产物。
- `knowledge/skills_frontend/data-fetching.md`：数据获取原则可复用，但默认存在 `apiClient`（通常还伴随 TanStack Query 约定）。
- `knowledge/skills_frontend/routing-guide.md`：路由模式可复用，但绑定某个路由库/懒加载约定与目录结构。
- `knowledge/skills_frontend/loading-and-error-states.md`：处理方式通用，但示例依赖 `useMuiSnackbar` 等项目封装。
- `knowledge/skills_frontend/styling-guide.md`：MUI styling 实践可复用（同栈迁移成本低）。
- `knowledge/skills_frontend/typescript-standards.md`：TypeScript 标准较通用（偏同栈最佳实践）。
- `knowledge/skills_frontend/performance.md`：性能优化模式通用（React 场景）。
- `knowledge/skills_frontend/common-patterns.md`：模式通用，但例子强绑定项目的 `useAuth`/`useMuiSnackbar` 等封装。
- `knowledge/skills_frontend/complete-examples.md`：例子可复用，但依赖项目封装（`apiClient`、hooks、目录约定）。

### Agents（方法论较通用，但仍有工具/工程假设）

- `knowledge/agents/documentation-architect.md`：方法论较通用，但假设存在 memory MCP、`/documentation/` 目录等工作方式。
- `knowledge/agents/frontend-error-fixer.md`：调试方法论通用，但默认 React/TS 前端与特定工具（如 browser-tools MCP、`pnpm build`）。
- `knowledge/agents/refactor-planner.md`：规划方法论通用，但假设 `CLAUDE.md`/特定文档落点规则。

## A：低耦合通用流程（可直接复用）

- `knowledge/agents/plan-reviewer.md`：偏“方案审查方法论”，不要求特定代码库结构。
- `knowledge/agents/web-research-specialist.md`：偏“检索/调研方法论”，不要求特定工程约定。

## 可读性提醒

- 多个文档里出现 `вњ?`/`вќ?` 等符号乱码（通常是字符/编码或字体符号转换问题）。如果你希望，我可以批量修复为正常的 ✅/❌ 或纯文本。
