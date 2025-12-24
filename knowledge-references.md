# Knowledge 文档引用关系

生成时间：2025-12-24 15:02:11
范围：`knowledge/**/*.md`
匹配规则：仅按“文档文本名”(文件 basename) 做大小写不敏感匹配，可匹配 `name` 或 `name.md`；不解析或校验实际路径，可能存在误匹配。

## 统计
- 文件数：37
- 文档名（basename）数：36
- 引用边数（出链总和）：100
- 重名文档名数：1
- 孤立文档名数（无出链且无入链）：2

## Top 入链（被引用最多）
- `performance`：14
- `SKILL`：13
- `configuration`：13
- `complete-examples`：11
- `component-patterns`：9
- `data-fetching`：7
- `services-and-repositories`：6
- `routing-and-controllers`：6
- `loading-and-error-states`：5
- `async-and-errors`：4

## Top 出链（引用最多）
- `frontend_guideline`：11
- `routing-guide`：5
- `complete-examples`：5
- `services-and-repositories`：5
- `validation-patterns`：5
- `data-fetching`：4
- `routing-and-controllers`：4
- `sentry-and-monitoring`：4
- `file-organization`：4
- `backend_guideline`：4

## 重名（同 basename 多文件）
- `complete-examples`：knowledge/skills_backend/complete-examples.md，knowledge/skills_frontend/complete-examples.md

## 孤立文档名
- `auto-error-resolver`
- `dev-docs`

## 出链（A 引用 -> B）
- `architecture-overview` -> `configuration`, `routing-and-controllers`, `services-and-repositories`, `SKILL`
- `async-and-errors` -> `complete-examples`, `sentry-and-monitoring`, `SKILL`
- `auth-route-debugger` -> `configuration`
- `auth-route-tester` -> *(none)*
- `auto-error-resolver` -> *(none)*
- `backend_guideline` -> `architecture-overview`, `configuration`, `performance`, `SKILL`
- `code-architecture-reviewer` -> `performance`
- `code-refactor-master` -> `performance`
- `common-patterns` -> `component-patterns`, `configuration`, `data-fetching`, `loading-and-error-states`
- `complete-examples` -> `performance`, `routing-and-controllers`, `services-and-repositories`, `SKILL`, `validation-patterns`
- `component-patterns` -> `complete-examples`, `data-fetching`, `loading-and-error-states`
- `configuration` -> `SKILL`, `testing-guide`
- `database-patterns` -> `async-and-errors`, `services-and-repositories`, `SKILL`
- `data-fetching` -> `complete-examples`, `component-patterns`, `configuration`, `loading-and-error-states`
- `dev-docs` -> *(none)*
- `dev-docs-update` -> `performance`
- `documentation-architect` -> `configuration`
- `file-organization` -> `complete-examples`, `component-patterns`, `configuration`, `data-fetching`
- `frontend_guideline` -> `common-patterns`, `complete-examples`, `component-patterns`, `data-fetching`, `file-organization`, `loading-and-error-states`, `performance`, `routing-guide`, `SKILL`, `styling-guide`, `typescript-standards`
- `frontend-error-fixer` -> `configuration`
- `loading-and-error-states` -> `component-patterns`, `data-fetching`, `performance`
- `middleware-guide` -> `async-and-errors`, `routing-and-controllers`, `SKILL`
- `performance` -> `complete-examples`, `component-patterns`, `data-fetching`
- `plan-reviewer` -> `performance`
- `refactor-planner` -> `performance`
- `route-research-for-testing` -> `auth-route-tester`
- `routing-and-controllers` -> `complete-examples`, `performance`, `services-and-repositories`, `SKILL`
- `routing-guide` -> `complete-examples`, `component-patterns`, `configuration`, `loading-and-error-states`, `performance`
- `sentry-and-monitoring` -> `async-and-errors`, `performance`, `routing-and-controllers`, `SKILL`
- `services-and-repositories` -> `complete-examples`, `configuration`, `database-patterns`, `routing-and-controllers`, `SKILL`
- `SKILL` -> `auth-route-tester`, `configuration`
- `styling-guide` -> `complete-examples`, `component-patterns`
- `testing-guide` -> `complete-examples`, `services-and-repositories`, `SKILL`
- `typescript-standards` -> `component-patterns`, `configuration`, `data-fetching`
- `validation-patterns` -> `async-and-errors`, `performance`, `routing-and-controllers`, `services-and-repositories`, `SKILL`
- `web-research-specialist` -> `configuration`, `performance`

## 入链（A 被 <- B 引用）
- `architecture-overview` <- `backend_guideline`
- `async-and-errors` <- `database-patterns`, `middleware-guide`, `sentry-and-monitoring`, `validation-patterns`
- `auth-route-debugger` <- *(none)*
- `auth-route-tester` <- `route-research-for-testing`, `SKILL`
- `auto-error-resolver` <- *(none)*
- `backend_guideline` <- *(none)*
- `code-architecture-reviewer` <- *(none)*
- `code-refactor-master` <- *(none)*
- `common-patterns` <- `frontend_guideline`
- `complete-examples` <- `async-and-errors`, `component-patterns`, `data-fetching`, `file-organization`, `frontend_guideline`, `performance`, `routing-and-controllers`, `routing-guide`, `services-and-repositories`, `styling-guide`, `testing-guide`
- `component-patterns` <- `common-patterns`, `data-fetching`, `file-organization`, `frontend_guideline`, `loading-and-error-states`, `performance`, `routing-guide`, `styling-guide`, `typescript-standards`
- `configuration` <- `architecture-overview`, `auth-route-debugger`, `backend_guideline`, `common-patterns`, `data-fetching`, `documentation-architect`, `file-organization`, `frontend-error-fixer`, `routing-guide`, `services-and-repositories`, `SKILL`, `typescript-standards`, `web-research-specialist`
- `database-patterns` <- `services-and-repositories`
- `data-fetching` <- `common-patterns`, `component-patterns`, `file-organization`, `frontend_guideline`, `loading-and-error-states`, `performance`, `typescript-standards`
- `dev-docs` <- *(none)*
- `dev-docs-update` <- *(none)*
- `documentation-architect` <- *(none)*
- `file-organization` <- `frontend_guideline`
- `frontend_guideline` <- *(none)*
- `frontend-error-fixer` <- *(none)*
- `loading-and-error-states` <- `common-patterns`, `component-patterns`, `data-fetching`, `frontend_guideline`, `routing-guide`
- `middleware-guide` <- *(none)*
- `performance` <- `backend_guideline`, `code-architecture-reviewer`, `code-refactor-master`, `complete-examples`, `dev-docs-update`, `frontend_guideline`, `loading-and-error-states`, `plan-reviewer`, `refactor-planner`, `routing-and-controllers`, `routing-guide`, `sentry-and-monitoring`, `validation-patterns`, `web-research-specialist`
- `plan-reviewer` <- *(none)*
- `refactor-planner` <- *(none)*
- `route-research-for-testing` <- *(none)*
- `routing-and-controllers` <- `architecture-overview`, `complete-examples`, `middleware-guide`, `sentry-and-monitoring`, `services-and-repositories`, `validation-patterns`
- `routing-guide` <- `frontend_guideline`
- `sentry-and-monitoring` <- `async-and-errors`
- `services-and-repositories` <- `architecture-overview`, `complete-examples`, `database-patterns`, `routing-and-controllers`, `testing-guide`, `validation-patterns`
- `SKILL` <- `architecture-overview`, `async-and-errors`, `backend_guideline`, `complete-examples`, `configuration`, `database-patterns`, `frontend_guideline`, `middleware-guide`, `routing-and-controllers`, `sentry-and-monitoring`, `services-and-repositories`, `testing-guide`, `validation-patterns`
- `styling-guide` <- `frontend_guideline`
- `testing-guide` <- `configuration`
- `typescript-standards` <- `frontend_guideline`
- `validation-patterns` <- `complete-examples`
- `web-research-specialist` <- *(none)*

## 路径索引（basename -> files）
- `architecture-overview`：knowledge/skills_backend/architecture-overview.md
- `async-and-errors`：knowledge/skills_backend/async-and-errors.md
- `auth-route-debugger`：knowledge/agents/auth-route-debugger.md
- `auth-route-tester`：knowledge/agents/auth-route-tester.md
- `auto-error-resolver`：knowledge/agents/auto-error-resolver.md
- `backend_guideline`：knowledge/skills_backend/backend_guideline.md
- `code-architecture-reviewer`：knowledge/agents/code-architecture-reviewer.md
- `code-refactor-master`：knowledge/agents/code-refactor-master.md
- `common-patterns`：knowledge/skills_frontend/common-patterns.md
- `complete-examples`：knowledge/skills_backend/complete-examples.md，knowledge/skills_frontend/complete-examples.md
- `component-patterns`：knowledge/skills_frontend/component-patterns.md
- `configuration`：knowledge/skills_backend/configuration.md
- `database-patterns`：knowledge/skills_backend/database-patterns.md
- `data-fetching`：knowledge/skills_frontend/data-fetching.md
- `dev-docs`：knowledge/commands/dev-docs.md
- `dev-docs-update`：knowledge/commands/dev-docs-update.md
- `documentation-architect`：knowledge/agents/documentation-architect.md
- `file-organization`：knowledge/skills_frontend/file-organization.md
- `frontend_guideline`：knowledge/skills_frontend/frontend_guideline.md
- `frontend-error-fixer`：knowledge/agents/frontend-error-fixer.md
- `loading-and-error-states`：knowledge/skills_frontend/loading-and-error-states.md
- `middleware-guide`：knowledge/skills_backend/middleware-guide.md
- `performance`：knowledge/skills_frontend/performance.md
- `plan-reviewer`：knowledge/agents/plan-reviewer.md
- `refactor-planner`：knowledge/agents/refactor-planner.md
- `route-research-for-testing`：knowledge/commands/route-research-for-testing.md
- `routing-and-controllers`：knowledge/skills_backend/routing-and-controllers.md
- `routing-guide`：knowledge/skills_frontend/routing-guide.md
- `sentry-and-monitoring`：knowledge/skills_backend/sentry-and-monitoring.md
- `services-and-repositories`：knowledge/skills_backend/services-and-repositories.md
- `SKILL`：knowledge/route-tester/SKILL.md
- `styling-guide`：knowledge/skills_frontend/styling-guide.md
- `testing-guide`：knowledge/skills_backend/testing-guide.md
- `typescript-standards`：knowledge/skills_frontend/typescript-standards.md
- `validation-patterns`：knowledge/skills_backend/validation-patterns.md
- `web-research-specialist`：knowledge/agents/web-research-specialist.md

