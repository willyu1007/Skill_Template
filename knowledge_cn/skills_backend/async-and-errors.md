# Async Patterns and Error Handling（异步模式与错误处理）

async/await 模式与自定义错误处理的完整指南。

## Table of Contents（目录）

- [Async Patterns and Error Handling（异步模式与错误处理）](#async-patterns-and-error-handling异步模式与错误处理)
  - [Table of Contents（目录）](#table-of-contents目录)
  - [Async/Await Best Practices（Async/Await 最佳实践）](#asyncawait-best-practicesasyncawait-最佳实践)
    - [Always Use Try-Catch（始终使用 try-catch）](#always-use-try-catch始终使用-try-catch)
    - [Avoid .then() Chains（避免 .then() 链式调用）](#avoid-then-chains避免-then-链式调用)
  - [Promise Error Handling（Promise 错误处理）](#promise-error-handlingpromise-错误处理)
    - [Parallel Operations（并行操作）](#parallel-operations并行操作)
  - [Custom Error Types（自定义错误类型）](#custom-error-types自定义错误类型)
    - [Define Custom Errors（定义自定义错误）](#define-custom-errors定义自定义错误)
    - [Usage（用法）](#usage用法)
  - [asyncErrorWrapper Utility（asyncErrorWrapper 工具函数）](#asyncerrorwrapper-utilityasyncerrorwrapper-工具函数)
    - [Pattern（模式）](#pattern模式)
    - [Usage（用法）](#usage用法-1)
  - [Error Propagation（错误传播）](#error-propagation错误传播)
    - [Proper Error Chains（正确的错误链路）](#proper-error-chains正确的错误链路)
  - [Common Async Pitfalls（常见异步陷阱）](#common-async-pitfalls常见异步陷阱)
    - [Fire and Forget (Bad)（发了就不管：不推荐）](#fire-and-forget-bad发了就不管不推荐)
    - [Unhandled Rejections（未处理的 rejection）](#unhandled-rejections未处理的-rejection)

---

## Async/Await Best Practices（Async/Await 最佳实践）

### Always Use Try-Catch（始终使用 try-catch）

```typescript
// ❌ NEVER: Unhandled async errors
async function fetchData() {
    const data = await database.query(); // If throws, unhandled!
    return data;
}

// ✅ ALWAYS: Wrap in try-catch
async function fetchData() {
    try {
        const data = await database.query();
        return data;
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}
```

要点：

- 在 `await` 可能抛错的位置，务必用 `try/catch` 包起来。
- 在 `catch` 中做必要的记录（例如 Sentry），然后重新抛出，让上层决定如何响应。

### Avoid .then() Chains（避免 .then() 链式调用）

```typescript
// ❌ AVOID: Promise chains
function processData() {
    return fetchData()
        .then(data => transform(data))
        .then(transformed => save(transformed))
        .catch(error => {
            console.error(error);
        });
}

// ✅ PREFER: Async/await
async function processData() {
    try {
        const data = await fetchData();
        const transformed = await transform(data);
        return await save(transformed);
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}
```

要点：

- 在大多数 Node.js/TypeScript 后端代码中，优先使用 `async/await`，可读性更强，错误链更清晰。
- `then/catch` 不是不能用，但复杂流程更容易因为遗漏 `return` 或错误吞掉而埋坑。

---

## Promise Error Handling（Promise 错误处理）

### Parallel Operations（并行操作）

```typescript
// ✅ Handle errors in Promise.all
try {
    const [users, profiles, settings] = await Promise.all([
        userService.getAll(),
        profileService.getAll(),
        settingsService.getAll(),
    ]);
} catch (error) {
    // One failure fails all
    Sentry.captureException(error);
    throw error;
}

// ✅ Handle errors individually with Promise.allSettled
const results = await Promise.allSettled([
    userService.getAll(),
    profileService.getAll(),
    settingsService.getAll(),
]);

results.forEach((result, index) => {
    if (result.status === 'rejected') {
        Sentry.captureException(result.reason, {
            tags: { operation: ['users', 'profiles', 'settings'][index] }
        });
    }
});
```

要点：

- `Promise.all`：任意一个失败会导致整体失败（fail-fast）。适合“必须全部成功”的场景。
- `Promise.allSettled`：每个任务单独给结果，适合“尽可能多成功”的场景；失败项要逐个记录/处理。

---

## Custom Error Types（自定义错误类型）

### Define Custom Errors（定义自定义错误）

```typescript
// Base error class
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number,
        public isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Specific error types
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 'NOT_FOUND', 404);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 'FORBIDDEN', 403);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 'CONFLICT', 409);
    }
}
```

要点：

- 用统一的 `AppError` 抽象携带 `code` / `statusCode` 等信息。
- 业务可预期错误（validation / not found / forbidden / conflict）建议标记为 `isOperational = true`，便于错误边界区分“可控错误 vs 未知错误”。

### Usage（用法）

```typescript
// Throw specific errors
if (!user) {
    throw new NotFoundError('User not found');
}

if (user.age < 18) {
    throw new ValidationError('User must be 18+');
}

// Error boundary handles them
function errorBoundary(error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code
            }
        });
    }

    // Unknown error
    Sentry.captureException(error);
    res.status(500).json({ error: { message: 'Internal server error' } });
}
```

要点：

- Controller / middleware 最终需要一个“错误边界”统一把错误转换为 HTTP 响应。
- 对于未知错误：上报监控并返回 500，避免泄露内部细节。

---

## asyncErrorWrapper Utility（asyncErrorWrapper 工具函数）

### Pattern（模式）

```typescript
export function asyncErrorWrapper(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
```

要点：

- Express 中 `async` handler 抛错时，必须确保错误传给 `next(error)`，否则可能出现未处理错误或请求挂起。

### Usage（用法）

```typescript
// Without wrapper - error can be unhandled
router.get('/users', async (req, res) => {
    const users = await userService.getAll(); // If throws, unhandled!
    res.json(users);
});

// With wrapper - errors caught
router.get('/users', asyncErrorWrapper(async (req, res) => {
    const users = await userService.getAll();
    res.json(users);
}));
```

---

## Error Propagation（错误传播）

### Proper Error Chains（正确的错误链路）

```typescript
// ✅ Propagate errors up the stack
async function repositoryMethod() {
    try {
        return await PrismaService.main.user.findMany();
    } catch (error) {
        Sentry.captureException(error, { tags: { layer: 'repository' } });
        throw error; // Propagate to service
    }
}

async function serviceMethod() {
    try {
        return await repositoryMethod();
    } catch (error) {
        Sentry.captureException(error, { tags: { layer: 'service' } });
        throw error; // Propagate to controller
    }
}

async function controllerMethod(req, res) {
    try {
        const result = await serviceMethod();
        res.json(result);
    } catch (error) {
        this.handleError(error, res, 'controllerMethod'); // Final handler
    }
}
```

要点：

- 每一层可以补充自己的上下文（例如 `layer` tag），但不要把错误吞掉。
- 错误最终应在 controller 或 error middleware 统一转换为响应。

---

## Common Async Pitfalls（常见异步陷阱）

### Fire and Forget (Bad)（发了就不管：不推荐）

```typescript
// ❌ NEVER: Fire and forget
async function processRequest(req, res) {
    sendEmail(user.email); // Fires async, errors unhandled!
    res.json({ success: true });
}

// ✅ ALWAYS: Await or handle
async function processRequest(req, res) {
    try {
        await sendEmail(user.email);
        res.json({ success: true });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}

// ✅ OR: Intentional background task
async function processRequest(req, res) {
    sendEmail(user.email).catch(error => {
        Sentry.captureException(error);
    });
    res.json({ success: true });
}
```

要点：

- 如果确实要后台执行（不阻塞请求返回），也必须 `.catch(...)`，否则错误会变成未处理 rejection。

### Unhandled Rejections（未处理的 rejection）

```typescript
// ✅ Global handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    Sentry.captureException(reason, {
        tags: { type: 'unhandled_rejection' }
    });
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    Sentry.captureException(error, {
        tags: { type: 'uncaught_exception' }
    });
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
```

要点：

- 为 `unhandledRejection` 与 `uncaughtException` 增加全局兜底，至少做到“记录 + 上报”。
- `uncaughtException` 后通常需要退出进程，让进程管理器重启，避免进入不一致状态。

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [sentry-and-monitoring.md](sentry-and-monitoring.md)
- [complete-examples.md](complete-examples.md)

