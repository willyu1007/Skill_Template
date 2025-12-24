---
name: backend-dev-guidelines
description: Comprehensive backend development guide for Node.js/Express/TypeScript microservices. Use when creating routes, controllers, services, repositories, middleware, or working with Express APIs, Prisma database access, Sentry error tracking, Zod validation, unifiedConfig, dependency injection, or async patterns. Covers layered architecture (routes в†?controllers в†?services в†?repositories), BaseController pattern, error handling, performance monitoring, testing strategies, and migration from legacy patterns.
---

# Backend Development Guidelines（后端开发规范）

## Purpose（目的）

使用现代 Node.js/Express/TypeScript 模式，在后端微服务（blog-api、auth-service、notifications-service）之间建立一致性与最佳实践。

## When to Use This Skill（何时使用）

当你在做以下事情时自动触发：

- 创建或修改 routes / endpoints / APIs
- 编写 controllers / services / repositories
- 实现 middleware（auth、validation、error handling）
- 使用 Prisma 做数据库操作
- 接入 Sentry 做错误追踪
- 使用 Zod 做输入校验
- 做配置管理
- 做后端测试与重构

---

## Quick Start（快速开始）

### New Backend Feature Checklist（新增后端功能检查表）

- [ ] **Route**：定义干净，仅负责路由并委托给 controller
- [ ] **Controller**：继承 BaseController
- [ ] **Service**：放业务逻辑（DI）
- [ ] **Repository**：复杂数据访问才引入
- [ ] **Validation**：Zod schema 校验
- [ ] **Sentry**：错误追踪
- [ ] **Tests**：单测 + 集成测试
- [ ] **Config**：使用 unifiedConfig

### New Microservice Checklist（新增微服务检查表）

- [ ] 目录结构（见 [architecture-overview.md](architecture-overview.md)）
- [ ] Sentry 的 instrument.ts（必须第一 import）
- [ ] unifiedConfig 配置
- [ ] BaseController
- [ ] middleware 栈
- [ ] 错误边界
- [ ] 测试框架

---

## Architecture Overview（架构概览）

### Layered Architecture（分层架构）

```
HTTP Request
    ->
Routes (routing only)
    ->
Controllers (request handling)
    ->
Services (business logic)
    ->
Repositories (data access)
    ->
Database (Prisma)
```

**Key Principle（关键原则）：** 每一层只做一件事（单一职责）。

完整细节见 [architecture-overview.md](architecture-overview.md)。

---

## Directory Structure（目录结构）

```
service/src/
├── config/              # UnifiedConfig
├── controllers/         # Request handlers
├── services/            # Business logic
├── repositories/        # Data access
├── routes/              # Route definitions
├── middleware/          # Express middleware
├── types/               # TypeScript types
├── validators/          # Zod schemas
├── utils/               # Utilities
├── tests/               # Tests
├── instrument.ts        # Sentry (FIRST IMPORT)
├── app.ts               # Express setup
└── server.ts            # HTTP server
```

**Naming Conventions（命名约定）：**

- Controllers：`PascalCase` - `UserController.ts`
- Services：`camelCase` - `userService.ts`
- Routes：`camelCase + Routes` - `userRoutes.ts`
- Repositories：`PascalCase + Repository` - `UserRepository.ts`

---

## Core Principles (7 Key Rules)（核心原则：7 条关键规则）

### 1. Routes Only Route, Controllers Control（路由只路由，控制器负责控制）

```typescript
// ❌ NEVER: Business logic in routes
router.post('/submit', async (req, res) => {
    // 200 lines of logic
});

// ✅ ALWAYS: Delegate to controller
router.post('/submit', (req, res) => controller.submit(req, res));
```

### 2. All Controllers Extend BaseController（所有 Controller 必须继承 BaseController）

```typescript
export class UserController extends BaseController {
    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.findById(req.params.id);
            this.handleSuccess(res, user);
        } catch (error) {
            this.handleError(error, res, 'getUser');
        }
    }
}
```

### 3. All Errors to Sentry（所有错误都要上报到 Sentry）

```typescript
try {
    await operation();
} catch (error) {
    Sentry.captureException(error);
    throw error;
}
```

### 4. Use unifiedConfig, NEVER process.env（使用 unifiedConfig，绝不要直接用 process.env）

```typescript
// ❌ NEVER
const timeout = process.env.TIMEOUT_MS;

// ✅ ALWAYS
import { config } from './config/unifiedConfig';
const timeout = config.timeouts.default;
```

### 5. Validate All Input with Zod（所有输入都用 Zod 校验）

```typescript
const schema = z.object({ email: z.string().email() });
const validated = schema.parse(req.body);
```

### 6. Use Repository Pattern for Data Access（数据访问用 Repository 模式）

```typescript
// Service -> Repository -> Database
const users = await userRepository.findActive();
```

### 7. Comprehensive Testing Required（必须有完整测试）

```typescript
describe('UserService', () => {
    it('should create user', async () => {
        expect(user).toBeDefined();
    });
});
```

---

## Common Imports（常用 import）

```typescript
// Express
import express, { Request, Response, NextFunction, Router } from 'express';

// Validation
import { z } from 'zod';

// Database
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

// Sentry
import * as Sentry from '@sentry/node';

// Config
import { config } from './config/unifiedConfig';

// Middleware
import { SSOMiddlewareClient } from './middleware/SSOMiddleware';
import { asyncErrorWrapper } from './middleware/errorBoundary';
```

---

## Quick Reference（速查）

### HTTP Status Codes（HTTP 状态码）

| Code | Use Case |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

### Service Templates（服务模板）

**Blog API**（✅ Mature）- 可作为 REST API 模板  
**Auth Service**（✅ Mature）- 可作为认证模式模板

---

## Anti-Patterns to Avoid（避免的反模式）

❌ Business logic in routes  
❌ Direct process.env usage  
❌ Missing error handling  
❌ No input validation  
❌ Direct Prisma everywhere  
❌ console.log instead of Sentry

