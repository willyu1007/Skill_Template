---
description: Update dev documentation before context compaction
argument-hint: Optional - specific context or tasks to focus on (leave empty for comprehensive update)
---

我们即将接近上下文限制。请更新开发文档，以确保在上下文重置后可以无缝继续。

## Required Updates（必须更新项）

### 1. Update Active Task Documentation（更新进行中的任务文档）

对 `/dev/active/` 下的每个任务：

- 更新 `[task-name]-context.md`，包含：
  - 当前实现状态
  - 本次会话关键决策
  - 修改了哪些文件以及原因
  - 发现的阻塞/问题
  - 下一步最直接要做什么
  - Last Updated 时间戳

- 更新 `[task-name]-tasks.md`，包含：
  - 标记已完成任务为 ✅
  - 补充本次会话新发现的任务
  - 更新 in-progress 任务状态
  - 如有必要，调整优先级顺序

### 2. Capture Session Context（记录会话上下文）

记录任何可能对后续继续推进至关重要的信息，例如：

- 已解决的复杂问题
- 架构决策
- 难定位且已修复的 bug
- 发现的关键集成点
- 使用的测试方法
- 性能优化点

### 3. Update Memory (if applicable)（如适用，更新记忆/知识库）

- 将新模式/新解决方案写入项目记忆/文档
- 更新发现的实体关系
- 补充对系统行为的观察

### 4. Document Unfinished Work（记录未完成工作）

- 上下文接近极限时正在做什么
- 任何“做到一半”的改动的精确状态
- 重启后需要运行的命令
- 任何临时 workaround 需要后续固化的点

### 5. Create Handoff Notes（创建交接说明）

如果即将切换到新对话：

- 正在编辑的文件与行号
- 当前改动目标
- 任何未提交变更需要注意的点
- 用于验证的测试命令

## Additional Context（补充上下文）：$ARGUMENTS

**Priority（优先级）**：重点记录那些“难以从代码本身重新推导/复现”的信息。

