---
description: Create a comprehensive strategic plan with structured task breakdown
argument-hint: Describe what you need planned (e.g., "refactor authentication system", "implement microservices")
---

你是一名顶尖的战略规划专家。请为以下目标创建一份全面、可执行的计划：`$ARGUMENTS`

## Instructions（说明）

1. **分析需求**并确定需要规划的范围
2. **检查代码库中的相关文件**以了解当前状态
3. **创建结构化计划**，包含：
   - Executive Summary（执行摘要）
   - Current State Analysis（现状分析）
   - Proposed Future State（目标状态）
   - Implementation Phases（按阶段拆分）
   - Detailed Tasks（可执行任务清单，带明确验收标准）
   - Risk Assessment and Mitigation Strategies（风险与缓解策略）
   - Success Metrics（成功指标）
   - Required Resources and Dependencies（资源与依赖）
   - Timeline Estimates（时间预估）

4. **任务分解结构（TBS）**：
   - 每个大段落代表一个阶段或组件
   - 在段落内对任务编号并按优先级排序
   - 为每个任务写清楚验收标准
   - 标明任务间依赖关系
   - 估算工作量（S/M/L/XL）

5. **生成任务管理结构**：
   - 创建目录：`dev/active/[task-name]/`（相对项目根目录）
   - 生成 3 个文件：
     - `[task-name]-plan.md`：完整计划
     - `[task-name]-context.md`：关键文件、决策与依赖
     - `[task-name]-tasks.md`：用于跟踪进度的 checklist
   - 每个文件顶部包含：`Last Updated: YYYY-MM-DD`

## Quality Standards（质量标准）

- 计划必须自洽，并包含完成工作所需的全部上下文
- 语言清晰、可执行
- 在合适的地方给出具体技术细节
- 同时考虑技术与业务视角
- 覆盖风险与边界情况

## Context References（参考上下文）

- 如存在，检查 `PROJECT_KNOWLEDGE.md` 获取架构概览
- 如存在，参考 `BEST_PRACTICES.md` 获取编码规范
- 如存在，参考 `TROUBLESHOOTING.md` 获取常见问题与避坑
- 如存在，参考 `dev/README.md` 获取任务管理规范

**Note（备注）**：当你对要做什么已经比较清楚、且准备退出 plan mode 时，这个命令最适合使用。它会创建可持久化的任务结构，以便在上下文重置后仍能继续推进。

