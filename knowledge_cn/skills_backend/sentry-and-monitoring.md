# Sentry Integration and Monitoring（Sentry 集成与监控）

使用 Sentry v8 进行错误追踪与性能监控的完整指南。

## Table of Contents（目录）

- [Sentry Integration and Monitoring（Sentry 集成与监控）](#sentry-integration-and-monitoringsentry-集成与监控)
  - [Table of Contents（目录）](#table-of-contents目录)
  - [Core Principles（核心原则）](#core-principles核心原则)
  - [Sentry Initialization（Sentry 初始化）](#sentry-initializationsentry-初始化)
    - [instrument.ts Pattern（instrument.ts 模式）](#instrumentts-patterninstrumentts-模式)
  - [Error Capture Patterns（错误捕获模式）](#error-capture-patterns错误捕获模式)
    - [1. BaseController Pattern（1. BaseController 模式）](#1-basecontroller-pattern1-basecontroller-模式)
    - [2. Workflow Error Handling（2. 工作流错误处理）](#2-workflow-error-handling2-工作流错误处理)
    - [3. Service Layer Error Handling（3. Service 层错误处理）](#3-service-layer-error-handling3-service-层错误处理)
  - [Performance Monitoring（性能监控）](#performance-monitoring性能监控)
    - [Database Performance Tracking（数据库性能追踪）](#database-performance-tracking数据库性能追踪)
    - [API Endpoint Spans（API Endpoint Span）](#api-endpoint-spansapi-endpoint-span)
  - [Cron Job Monitoring（定时任务监控）](#cron-job-monitoring定时任务监控)
    - [Mandatory Pattern（强制模式）](#mandatory-pattern强制模式)
  - [Error Context Best Practices（错误上下文最佳实践）](#error-context-best-practices错误上下文最佳实践)
    - [Rich Context Example（丰富上下文示例）](#rich-context-example丰富上下文示例)
  - [Common Mistakes（常见错误）](#common-mistakes常见错误)

---

## Core Principles（核心原则）

**MANDATORY**：所有错误都必须捕获并上报到 Sentry，不得例外。

**ALL ERRORS MUST BE CAPTURED** - 使用 Sentry v8，在所有服务中实现全面的错误追踪。

---

## Sentry Initialization（Sentry 初始化）

### instrument.ts Pattern（instrument.ts 模式）

**Location:** `src/instrument.ts`（必须作为 `server.ts` 以及所有 cron job 的第一条 import）

**Template for Microservices（微服务模板）：**

```typescript
import * as Sentry from '@sentry/node';
import * as fs from 'fs';
import * as path from 'path';
import * as ini from 'ini';

const sentryConfigPath = path.join(__dirname, '../sentry.ini');
const sentryConfig = ini.parse(fs.readFileSync(sentryConfigPath, 'utf-8'));

Sentry.init({
    dsn: sentryConfig.sentry?.dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: parseFloat(sentryConfig.sentry?.tracesSampleRate || '0.1'),
    profilesSampleRate: parseFloat(sentryConfig.sentry?.profilesSampleRate || '0.1'),

    integrations: [
        ...Sentry.getDefaultIntegrations({}),
        Sentry.extraErrorDataIntegration({ depth: 5 }),
        Sentry.localVariablesIntegration(),
        Sentry.requestDataIntegration({
            include: {
                cookies: false,
                data: true,
                headers: true,
                ip: true,
                query_string: true,
                url: true,
                user: { id: true, email: true, username: true },
            },
        }),
        Sentry.consoleIntegration(),
        Sentry.contextLinesIntegration(),
        Sentry.prismaIntegration(),
    ],

    beforeSend(event, hint) {
        // Filter health checks
        if (event.request?.url?.includes('/healthcheck')) {
            return null;
        }

        // Scrub sensitive headers
        if (event.request?.headers) {
            delete event.request.headers['authorization'];
            delete event.request.headers['cookie'];
        }

        // Mask emails for PII
        if (event.user?.email) {
            event.user.email = event.user.email.replace(/^(.{2}).*(@.*)$/, '$1***$2');
        }

        return event;
    },

    ignoreErrors: [
        /^Invalid JWT/,
        /^JWT expired/,
        'NetworkError',
    ],
});

// Set service context
Sentry.setTags({
    service: 'form',
    version: '1.0.1',
});

Sentry.setContext('runtime', {
    node_version: process.version,
    platform: process.platform,
});
```

**Critical Points（关键点）：**

- 内置 PII 保护（`beforeSend`）
- 过滤非关键错误
- 集成项完整
- Prisma instrumentation
- 为服务打上专用标签

---

## Error Capture Patterns（错误捕获模式）

### 1. BaseController Pattern（1. BaseController 模式）

```typescript
// Use BaseController.handleError
protected handleError(error: unknown, res: Response, context: string, statusCode = 500): void {
    Sentry.withScope((scope) => {
        scope.setTag('controller', this.constructor.name);
        scope.setTag('operation', context);
        scope.setUser({ id: res.locals?.claims?.userId });
        Sentry.captureException(error);
    });

    res.status(statusCode).json({
        success: false,
        error: { message: error instanceof Error ? error.message : 'Error occurred' }
    });
}
```

### 2. Workflow Error Handling（2. 工作流错误处理）

```typescript
import { SentryHelper } from '../utils/sentryHelper';

try {
    await businessOperation();
} catch (error) {
    SentryHelper.captureOperationError(error, {
        operationType: 'POST_CREATION',
        entityId: 123,
        userId: 'user-123',
        operation: 'createPost',
    });
    throw error;
}
```

### 3. Service Layer Error Handling（3. Service 层错误处理）

```typescript
try {
    await someOperation();
} catch (error) {
    Sentry.captureException(error, {
        tags: {
            service: 'form',
            operation: 'someOperation'
        },
        extra: {
            userId: currentUser.id,
            entityId: 123
        }
    });
    throw error;
}
```

---

## Performance Monitoring（性能监控）

### Database Performance Tracking（数据库性能追踪）

```typescript
import { DatabasePerformanceMonitor } from '../utils/databasePerformance';

const result = await DatabasePerformanceMonitor.withPerformanceTracking(
    'findMany',
    'UserProfile',
    async () => {
        return await PrismaService.main.userProfile.findMany({ take: 5 });
    }
);
```

### API Endpoint Spans（API Endpoint Span）

```typescript
router.post('/operation', async (req, res) => {
    return await Sentry.startSpan({
        name: 'operation.execute',
        op: 'http.server',
        attributes: {
            'http.method': 'POST',
            'http.route': '/operation'
        }
    }, async () => {
        const result = await performOperation();
        res.json(result);
    });
});
```

---

## Cron Job Monitoring（定时任务监控）

### Mandatory Pattern（强制模式）

```typescript
#!/usr/bin/env node
import '../instrument'; // FIRST LINE after shebang
import * as Sentry from '@sentry/node';

async function main() {
    return await Sentry.startSpan({
        name: 'cron.job-name',
        op: 'cron',
        attributes: {
            'cron.job': 'job-name',
            'cron.startTime': new Date().toISOString(),
        }
    }, async () => {
        try {
            // Cron job logic here
        } catch (error) {
            Sentry.captureException(error, {
                tags: {
                    'cron.job': 'job-name',
                    'error.type': 'execution_error'
                }
            });
            console.error('[Cron] Error:', error);
            process.exit(1);
        }
    });
}

main().then(() => {
    console.log('[Cron] Completed successfully');
    process.exit(0);
}).catch((error) => {
    console.error('[Cron] Fatal error:', error);
    process.exit(1);
});
```

---

## Error Context Best Practices（错误上下文最佳实践）

### Rich Context Example（丰富上下文示例）

```typescript
Sentry.withScope((scope) => {
    // User context
    scope.setUser({
        id: user.id,
        email: user.email,
        username: user.username
    });

    // Tags for filtering
    scope.setTag('service', 'form');
    scope.setTag('endpoint', req.path);
    scope.setTag('method', req.method);

    // Structured context
    scope.setContext('operation', {
        type: 'workflow.complete',
        workflowId: 123,
        stepId: 456
    });

    // Breadcrumbs for timeline
    scope.addBreadcrumb({
        category: 'workflow',
        message: 'Starting step completion',
        level: 'info',
        data: { stepId: 456 }
    });

    Sentry.captureException(error);
});
```

---

## Common Mistakes（常见错误）

```typescript
// ❌ Swallowing errors
try {
    await riskyOperation();
} catch (error) {
    // Silent failure
}

// ❌ Generic error messages
throw new Error('Error occurred');

// ❌ Exposing sensitive data
Sentry.captureException(error, {
    extra: { password: user.password } // NEVER
});

// ❌ Missing async error handling
async function bad() {
    fetchData().then(data => processResult(data)); // Unhandled
}

// ✅ Proper async handling
async function good() {
    try {
        const data = await fetchData();
        processResult(data);
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}
```

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [routing-and-controllers.md](routing-and-controllers.md)
- [async-and-errors.md](async-and-errors.md)

