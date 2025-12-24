# Configuration Management - UnifiedConfig Pattern（配置管理：UnifiedConfig 模式）

后端微服务中配置管理的完整指南。

## Table of Contents（目录）

- [UnifiedConfig Overview（UnifiedConfig 概览）](#unifiedconfig-overview)
- [NEVER Use process.env Directly（绝不要直接使用 process.env）](#never-use-processenv-directly)
- [Configuration Structure（配置结构）](#configuration-structure)
- [Environment-Specific Configs（按环境区分的配置）](#environment-specific-configs)
- [Secrets Management（密钥管理）](#secrets-management)
- [Migration Guide（迁移指南）](#migration-guide)

---

## UnifiedConfig Overview（UnifiedConfig 概览）

### Why UnifiedConfig?（为什么要用 UnifiedConfig？）

**process.env 的问题：**

- ❌ 没有类型安全
- ❌ 没有校验
- ❌ 难以测试
- ❌ 分散在代码各处
- ❌ 没有默认值
- ❌ 环境变量名拼写错误会在运行时才暴露

**unifiedConfig 的收益：**

- ✅ 类型安全的配置访问
- ✅ 单一事实来源（SSOT）
- ✅ 启动时验证
- ✅ 易于用 mock 测试
- ✅ 结构清晰
- ✅ 仍可回落到环境变量

---

## NEVER Use process.env Directly（绝不要直接使用 process.env）

### The Rule（规则）

```typescript
// ❌ NEVER DO THIS
const timeout = parseInt(process.env.TIMEOUT_MS || '5000');
const dbHost = process.env.DB_HOST || 'localhost';

// ✅ ALWAYS DO THIS
import { config } from './config/unifiedConfig';
const timeout = config.timeouts.default;
const dbHost = config.database.host;
```

### Why This Matters（为什么重要）

**问题示例：**

```typescript
// Typo in environment variable name
const host = process.env.DB_HSOT; // undefined! No error!

// Type safety
const port = process.env.PORT; // string! Need parseInt
const timeout = parseInt(process.env.TIMEOUT); // NaN if not set!
```

**使用 unifiedConfig：**

```typescript
const port = config.server.port; // number, guaranteed
const timeout = config.timeouts.default; // number, with fallback
```

---

## Configuration Structure（配置结构）

### UnifiedConfig Interface（UnifiedConfig 接口）

```typescript
export interface UnifiedConfig {
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    server: {
        port: number;
        sessionSecret: string;
    };
    tokens: {
        jwt: string;
        inactivity: string;
        internal: string;
    };
    keycloak: {
        realm: string;
        client: string;
        baseUrl: string;
        secret: string;
    };
    aws: {
        region: string;
        emailQueueUrl: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
    sentry: {
        dsn: string;
        environment: string;
        tracesSampleRate: number;
    };
    // ... more sections
}
```

### Implementation Pattern（实现模式）

**File:** `/blog-api/src/config/unifiedConfig.ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as ini from 'ini';

const configPath = path.join(__dirname, '../../config.ini');
const iniConfig = ini.parse(fs.readFileSync(configPath, 'utf-8'));

export const config: UnifiedConfig = {
    database: {
        host: iniConfig.database?.host || process.env.DB_HOST || 'localhost',
        port: parseInt(iniConfig.database?.port || process.env.DB_PORT || '3306'),
        username: iniConfig.database?.username || process.env.DB_USER || 'root',
        password: iniConfig.database?.password || process.env.DB_PASSWORD || '',
        database: iniConfig.database?.database || process.env.DB_NAME || 'blog_dev',
    },
    server: {
        port: parseInt(iniConfig.server?.port || process.env.PORT || '3002'),
        sessionSecret: iniConfig.server?.sessionSecret || process.env.SESSION_SECRET || 'dev-secret',
    },
    // ... more configuration
};

// Validate critical config
if (!config.tokens.jwt) {
    throw new Error('JWT secret not configured!');
}
```

**Key Points（要点）：**

- 优先读取 `config.ini`
- 回落到 `process.env`
- 为开发环境提供默认值
- 启动时做关键配置校验
- 类型安全访问

---

## Environment-Specific Configs（按环境区分的配置）

### config.ini Structure（config.ini 结构）

```ini
[database]
host = localhost
port = 3306
username = root
password = password1
database = blog_dev

[server]
port = 3002
sessionSecret = your-secret-here

[tokens]
jwt = your-jwt-secret
inactivity = 30m
internal = internal-api-token

[keycloak]
realm = myapp
client = myapp-client
baseUrl = http://localhost:8080
secret = keycloak-client-secret

[sentry]
dsn = https://your-sentry-dsn
environment = development
tracesSampleRate = 0.1
```

### Environment Overrides（环境变量覆盖）

```bash
# .env file (optional overrides)
DB_HOST=production-db.example.com
DB_PASSWORD=secure-password
PORT=80
```

**Precedence（优先级）：**

1. `config.ini`（最高）
2. `process.env` 环境变量
3. 硬编码默认值（最低）

---

## Secrets Management（密钥管理）

### DO NOT Commit Secrets（不要提交密钥）

```gitignore
# .gitignore
config.ini
.env
sentry.ini
*.pem
*.key
```

### Use Environment Variables in Production（生产环境使用环境变量）

```typescript
// Development: config.ini
// Production: Environment variables

export const config: UnifiedConfig = {
    database: {
        password: process.env.DB_PASSWORD || iniConfig.database?.password || '',
    },
    tokens: {
        jwt: process.env.JWT_SECRET || iniConfig.tokens?.jwt || '',
    },
};
```

---

## Migration Guide（迁移指南）

### Find All process.env Usage（查找所有 process.env 用法）

```bash
grep -r \"process.env\" blog-api/src/ --include=\"*.ts\" | wc -l
```

### Migration Example（迁移示例）

**Before（迁移前）：**

```typescript
// Scattered throughout code
const timeout = parseInt(process.env.OPENID_HTTP_TIMEOUT_MS || '15000');
const keycloakUrl = process.env.KEYCLOAK_BASE_URL;
const jwtSecret = process.env.JWT_SECRET;
```

**After（迁移后）：**

```typescript
import { config } from './config/unifiedConfig';

const timeout = config.keycloak.timeout;
const keycloakUrl = config.keycloak.baseUrl;
const jwtSecret = config.tokens.jwt;
```

**Benefits（收益）：**

- 类型安全
- 集中管理
- 易于测试
- 启动时校验

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [testing-guide.md](testing-guide.md)

