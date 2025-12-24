# Middleware Guide - Express Middleware Patterns（中间件指南：Express 中间件模式）

后端微服务中创建与使用中间件的完整指南。

## Table of Contents（目录）

- [Authentication Middleware（认证中间件）](#authentication-middleware)
- [Audit Middleware with AsyncLocalStorage（基于 AsyncLocalStorage 的审计中间件）](#audit-middleware-with-asynclocalstorage)
- [Error Boundary Middleware（错误边界中间件）](#error-boundary-middleware)
- [Validation Middleware（校验中间件）](#validation-middleware)
- [Composable Middleware（可组合中间件）](#composable-middleware)
- [Middleware Ordering（中间件顺序）](#middleware-ordering)

---

## Authentication Middleware（认证中间件）

### SSOMiddleware Pattern（SSOMiddleware 模式）

**File:** `/form/src/middleware/SSOMiddleware.ts`

```typescript
export class SSOMiddlewareClient {
    static verifyLoginStatus(req: Request, res: Response, next: NextFunction): void {
        const token = req.cookies.refresh_token;

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        try {
            const decoded = jwt.verify(token, config.tokens.jwt);
            res.locals.claims = decoded;
            res.locals.effectiveUserId = decoded.sub;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    }
}
```

---

## Audit Middleware with AsyncLocalStorage（基于 AsyncLocalStorage 的审计中间件）

### Excellent Pattern from Blog API（来自 Blog API 的优秀模式）

**File:** `/form/src/middleware/auditMiddleware.ts`

```typescript
import { AsyncLocalStorage } from 'async_hooks';

export interface AuditContext {
    userId: string;
    userName?: string;
    impersonatedBy?: string;
    sessionId?: string;
    timestamp: Date;
    requestId: string;
}

export const auditContextStorage = new AsyncLocalStorage<AuditContext>();

export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
    const context: AuditContext = {
        userId: res.locals.effectiveUserId || 'anonymous',
        userName: res.locals.claims?.preferred_username,
        impersonatedBy: res.locals.isImpersonating ? res.locals.originalUserId : undefined,
        timestamp: new Date(),
        requestId: req.id || uuidv4(),
    };

    auditContextStorage.run(context, () => {
        next();
    });
}

// Getter for current context
export function getAuditContext(): AuditContext | null {
    return auditContextStorage.getStore() || null;
}
```

**Benefits（收益）：**

- 上下文可在整个请求链路中传播
- 无需在每一层显式传参
- 在 service / repository 中可直接读取
- 类型安全的上下文访问

**Usage in Services（在 Service 中使用）：**

```typescript
import { getAuditContext } from '../middleware/auditMiddleware';

async function someOperation() {
    const context = getAuditContext();
    console.log('Operation by:', context?.userId);
}
```

---

## Error Boundary Middleware（错误边界中间件）

### Comprehensive Error Handler（完整的错误处理器）

**File:** `/form/src/middleware/errorBoundary.ts`

```typescript
export function errorBoundary(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Determine status code
    const statusCode = getStatusCodeForError(error);

    // Capture to Sentry
    Sentry.withScope((scope) => {
        scope.setLevel(statusCode >= 500 ? 'error' : 'warning');
        scope.setTag('error_type', error.name);
        scope.setContext('error_details', {
            message: error.message,
            stack: error.stack,
        });
        Sentry.captureException(error);
    });

    // User-friendly response
    res.status(statusCode).json({
        success: false,
        error: {
            message: getUserFriendlyMessage(error),
            code: error.name,
        },
        requestId: Sentry.getCurrentScope().getPropagationContext().traceId,
    });
}

// Async wrapper
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

---

## Composable Middleware（可组合中间件）

### withAuthAndAudit Pattern（withAuthAndAudit 模式）

```typescript
export function withAuthAndAudit(...authMiddleware: any[]) {
    return [
        ...authMiddleware,
        auditMiddleware,
    ];
}

// Usage
router.post('/:formID/submit',
    ...withAuthAndAudit(SSOMiddlewareClient.verifyLoginStatus),
    async (req, res) => controller.submit(req, res)
);
```

---

## Middleware Ordering（中间件顺序）

### Critical Order (Must Follow)（关键顺序：必须遵守）

```typescript
// 1. Sentry request handler (FIRST)
app.use(Sentry.Handlers.requestHandler());

// 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parsing
app.use(cookieParser());

// 4. Auth initialization
app.use(SSOMiddleware.initialize());

// 5. Routes registered here
app.use('/api/users', userRoutes);

// 6. Error handler (AFTER routes)
app.use(errorBoundary);

// 7. Sentry error handler (LAST)
app.use(Sentry.Handlers.errorHandler());
```

**Rule（规则）：** 错误处理器必须在所有 routes 之后注册！

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [routing-and-controllers.md](routing-and-controllers.md)
- [async-and-errors.md](async-and-errors.md)

