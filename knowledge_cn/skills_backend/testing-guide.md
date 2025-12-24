# Testing Guide - Backend Testing Strategies（测试指南：后端测试策略）

使用 Jest 测试后端服务与相关最佳实践的完整指南。

## Table of Contents（目录）

- [Unit Testing（单元测试）](#unit-testing)
- [Integration Testing（集成测试）](#integration-testing)
- [Mocking Strategies（Mock 策略）](#mocking-strategies)
- [Test Data Management（测试数据管理）](#test-data-management)
- [Testing Authenticated Routes（测试需要认证的路由）](#testing-authenticated-routes)
- [Coverage Targets（覆盖率目标）](#coverage-targets)

---

## Unit Testing（单元测试）

### Test Structure（测试结构）

```typescript
// services/userService.test.ts
import { UserService } from './userService';
import { UserRepository } from '../repositories/UserRepository';

jest.mock('../repositories/UserRepository');

describe('UserService', () => {
    let service: UserService;
    let mockRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        } as any;

        service = new UserService();
        (service as any).userRepository = mockRepository;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw error if email exists', async () => {
            mockRepository.findByEmail.mockResolvedValue({ id: '123' } as any);

            await expect(
                service.create({ email: 'test@test.com' })
            ).rejects.toThrow('Email already in use');
        });

        it('should create user if email is unique', async () => {
            mockRepository.findByEmail.mockResolvedValue(null);
            mockRepository.create.mockResolvedValue({ id: '123' } as any);

            const user = await service.create({
                email: 'test@test.com',
                firstName: 'John',
                lastName: 'Doe',
            });

            expect(user).toBeDefined();
            expect(mockRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@test.com'
                })
            );
        });
    });
});
```

---

## Integration Testing（集成测试）

### Test with Real Database（使用真实数据库测试）

```typescript
import { PrismaService } from '@project-lifecycle-portal/database';

describe('UserService Integration', () => {
    let testUser: any;

    beforeAll(async () => {
        // Create test data
        testUser = await PrismaService.main.user.create({
            data: {
                email: 'test@test.com',
                profile: { create: { firstName: 'Test', lastName: 'User' } },
            },
        });
    });

    afterAll(async () => {
        // Cleanup
        await PrismaService.main.user.delete({ where: { id: testUser.id } });
    });

    it('should find user by email', async () => {
        const user = await userService.findByEmail('test@test.com');
        expect(user).toBeDefined();
        expect(user?.email).toBe('test@test.com');
    });
});
```

---

## Mocking Strategies（Mock 策略）

### Mock PrismaService（Mock PrismaService）

```typescript
jest.mock('@project-lifecycle-portal/database', () => ({
    PrismaService: {
        main: {
            user: {
                findMany: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
            },
        },
        isAvailable: true,
    },
}));
```

### Mock Services（Mock Service）

```typescript
const mockUserService = {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
} as jest.Mocked<UserService>;
```

---

## Test Data Management（测试数据管理）

### Setup and Teardown（准备与清理）

```typescript
describe('PermissionService', () => {
    let instanceId: number;

    beforeAll(async () => {
        // Create test post
        const post = await PrismaService.main.post.create({
            data: { title: 'Test Post', content: 'Test', authorId: 'test-user' },
        });
        instanceId = post.id;
    });

    afterAll(async () => {
        // Cleanup
        await PrismaService.main.post.delete({
            where: { id: instanceId },
        });
    });

    beforeEach(() => {
        // Clear caches
        permissionService.clearCache();
    });

    it('should check permissions', async () => {
        const hasPermission = await permissionService.checkPermission(
            'user-id',
            instanceId,
            'VIEW_WORKFLOW'
        );
        expect(hasPermission).toBeDefined();
    });
});
```

---

## Testing Authenticated Routes（测试需要认证的路由）

### Using test-auth-route.js（使用 test-auth-route.js）

```bash
# Test authenticated endpoint
node scripts/test-auth-route.js http://localhost:3002/form/api/users

# Test with POST data
node scripts/test-auth-route.js http://localhost:3002/form/api/users POST '{"email":"test@test.com"}'
```

### Mock Authentication in Tests（在测试中 Mock 认证）

```typescript
// Mock auth middleware
jest.mock('../middleware/SSOMiddleware', () => ({
    SSOMiddlewareClient: {
        verifyLoginStatus: (req, res, next) => {
            res.locals.claims = {
                sub: 'test-user-id',
                preferred_username: 'testuser',
            };
            next();
        },
    },
}));
```

---

## Coverage Targets（覆盖率目标）

### Recommended Coverage（建议覆盖率）

- **Unit Tests（单测）**：70%+ coverage
- **Integration Tests（集成测试）**：覆盖关键路径
- **E2E Tests（端到端测试）**：覆盖主要 happy path

### Run Coverage（运行覆盖率）

```bash
npm test -- --coverage
```

---

**相关文件：**
- [SKILL.md](SKILL.md)
- [services-and-repositories.md](services-and-repositories.md)
- [complete-examples.md](complete-examples.md)

