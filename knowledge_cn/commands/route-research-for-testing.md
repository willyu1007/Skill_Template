---
description: Map edited routes & launch tests
argument-hint: "[/extra/path …]"
allowed-tools: Bash(cat:*), Bash(awk:*), Bash(grep:*), Bash(sort:*), Bash(xargs:*), Bash(sed:*)
model: sonnet
---

## Context（上下文）

本次会话中修改过的路由文件（自动生成）：

!cat "$CLAUDE_PROJECT_DIR/.claude/tsc-cache"/\*/edited-files.log \
 | awk -F: '{print $2}' \
 | grep '/routes/' \
 | sort -u

用户额外指定的路由：`$ARGUMENTS`

## Your task（你的任务）

严格按以下编号步骤执行：

1. 将自动列表与 `$ARGUMENTS` 合并、去重，并解析 `src/app.ts` 中定义的任何 route prefix。
2. 对每个最终路由，输出一条 JSON 记录，包含：
   - path
   - method
   - 预期 request/response 结构
   - valid + invalid payload 示例
3. **现在调用 `Task` tool**，使用以下参数：

```json
{
    "tool": "Task",
    "parameters": {
        "description": "route smoke tests",
        "prompt": "Run the auth-route-tester sub-agent on the JSON above."
    }
}
```

