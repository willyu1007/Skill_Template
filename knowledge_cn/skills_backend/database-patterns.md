# Database Patterns - Prisma Best Practices（数据库模式：Prisma 最佳实践）

后端微服务中使用 Prisma 的数据库访问模式完整指南。

## Table of Contents（目录）

- [PrismaService Usage（PrismaService 用法）](#prismaservice-usage)
- [Repository Pattern（Repository 模式）](#repository-pattern)
- [Transaction Patterns（事务模式）](#transaction-patterns)
- [Query Optimization（查询优化）](#query-optimization)
- [N+1 Query Prevention（避免 N+1 查询）](#n1-query-prevention)
- [Error Handling（错误处理）](#error-handling)

---

## PrismaService Usage（PrismaService 用法）

### Basic Pattern（基础模式）

```typescript
import { PrismaService } from '@project-lifecycle-portal/database';

// Always use PrismaService.main
const users = await PrismaService.main.user.findMany();
```

### Check Availability（检查可用性）

```typescript
if (!PrismaService.isAvailable) {
    throw new Error('Prisma client not initialized');
}

const user = await PrismaService.main.user.findUnique({ where: { id } });
```

---

## Repository Pattern（Repository 模式）

### Why Use Repositories（为什么要用 Repository）

✅ **在这些场景使用 Repository：**

- 复杂查询（joins/includes）
- 同一个查询在多处复用
- 需要缓存层
- 希望在测试中方便 mock

❌ **在这些场景可以不引入 Repository：**

- 简单的一次性查询
- 原型阶段（后续可再重构）

### Repository Template（Repository 模板）

```typescript
export class UserRepository {
    async findById(id: string): Promise<User | null> {
        return PrismaService.main.user.findUnique({
            where: { id },
            include: { profile: true },
        });
    }

    async findActive(): Promise<User[]> {
        return PrismaService.main.user.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return PrismaService.main.user.create({ data });
    }
}
```

---

## Transaction Patterns（事务模式）

### Simple Transaction（简单事务）

```typescript
const result = await PrismaService.main.$transaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const profile = await tx.userProfile.create({ data: { userId: user.id } });
    return { user, profile };
});
```

### Interactive Transaction（交互式事务）

```typescript
const result = await PrismaService.main.$transaction(
    async (tx) => {
        const user = await tx.user.findUnique({ where: { id } });
        if (!user) throw new Error('User not found');

        return await tx.user.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    },
    {
        maxWait: 5000,
        timeout: 10000,
    }
);
```

---

## Query Optimization（查询优化）

### Use select to Limit Fields（用 select 限制字段）

```typescript
// ❌ Fetches all fields
const users = await PrismaService.main.user.findMany();

// ✅ Only fetch needed fields
const users = await PrismaService.main.user.findMany({
    select: {
        id: true,
        email: true,
        profile: { select: { firstName: true, lastName: true } },
    },
});
```

### Use include Carefully（谨慎使用 include）

```typescript
// ❌ Excessive includes
const user = await PrismaService.main.user.findUnique({
    where: { id },
    include: {
        profile: true,
        posts: { include: { comments: true } },
        workflows: { include: { steps: { include: { actions: true } } } },
    },
});

// ✅ Only include what you need
const user = await PrismaService.main.user.findUnique({
    where: { id },
    include: { profile: true },
});
```

---

## N+1 Query Prevention（避免 N+1 查询）

### Problem: N+1 Queries（问题：N+1 查询）

```typescript
// ❌ N+1 Query Problem
const users = await PrismaService.main.user.findMany(); // 1 query

for (const user of users) {
    // N queries (one per user)
    const profile = await PrismaService.main.userProfile.findUnique({
        where: { userId: user.id },
    });
}
```

### Solution: Use include or Batching（方案：用 include 或批量查询）

```typescript
// ✅ Single query with include
const users = await PrismaService.main.user.findMany({
    include: { profile: true },
});

// ✅ Or batch query
const userIds = users.map(u => u.id);
const profiles = await PrismaService.main.userProfile.findMany({
    where: { userId: { in: userIds } },
});
```

---

## Error Handling（错误处理）

### Prisma Error Types（Prisma 错误类型）

```typescript
import { Prisma } from '@prisma/client';

try {
    await PrismaService.main.user.create({ data });
} catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
            throw new ConflictError('Email already exists');
        }

        // Foreign key constraint
        if (error.code === 'P2003') {
            throw new ValidationError('Invalid reference');
        }

        // Record not found
        if (error.code === 'P2025') {
            throw new NotFoundError('Record not found');
        }
    }

    // Unknown error
    Sentry.captureException(error);
    throw error;
}
```

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [services-and-repositories.md](services-and-repositories.md)
- [async-and-errors.md](async-and-errors.md)

