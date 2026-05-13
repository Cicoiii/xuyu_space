# Xuyu-Space 开发指南

## 端口一览

| 端口 | 服务 | 地址 |
|------|------|------|
| 11000 | 后端 API | http://localhost:11000 |
| 11011 | 前端 Dev | http://localhost:11011 |
| 27017 | MongoDB | localhost:27017 |
| 6379 | Redis | localhost:6379 |
| 19000 | MinIO API | http://localhost:19000 |
| 19001 | MinIO Console | http://localhost:19001 |
| 11001 | Traefik Dashboard | http://localhost:11001 (全栈部署) |

## 快速开始

```bash
pnpm install
docker compose -f docker-compose.infra.yml up -d
pnpm dev

pnpm dev:web
pnpm dev:server
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 同时启动前端 + 后端 |
| `pnpm dev:server` | 仅启动后端 :11000 |
| `pnpm dev:web` | 仅启动前端 :11011 |
| `pnpm build` | 构建全部 |
| `pnpm build:web` | 构建前端 |
| `pnpm build:server` | 构建后端 |
| `pnpm check:type` | 类型检查 |
| `pnpm lint:fix` | ESLint 修复 |

## Docker

### 本地开发（推荐）

仅启动基础设施（MongoDB、Redis、MinIO），前后端在本地运行：

```bash
# 启动基础设施
docker compose -f docker-compose.infra.yml up -d

# 停止
docker compose -f docker-compose.infra.yml down

# 查看日志
docker compose -f docker-compose.infra.yml logs -f

# 停止并清除数据（慎用）
docker compose -f docker-compose.infra.yml down -v
```

### 全栈部署（生产/测试）

一键构建并启动所有服务（包含前后端）：

```bash
# 构建镜像并启动全部服务（首次约5分钟）
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 停止并清除数据（慎用）
docker compose down -v
```

**全栈部署访问地址：**
- 应用：http://localhost:11000
- Traefik Dashboard：http://localhost:11001

**包含的服务：**
- `service-core` - 核心服务（用户、群组、消息等）
- `service-openapi` - OpenAPI 服务
- `service-all-plugins` - 插件服务
- `mongo` - MongoDB 数据库
- `redis` - Redis 缓存
- `minio` - MinIO 对象存储
- `traefik` - 反向代理

## 环境变量

本地开发使用 `server/.env`，Docker 全栈使用 `docker-compose.env`，两者区别仅在主机名：

| 变量 | 本地开发 | Docker 全栈 |
|------|---------|------------|
| `MONGO_URL` | `mongodb://localhost:27017/tailchat` | `mongodb://mongo/tailchat` |
| `REDIS_URL` | `redis://localhost:6379/` | `redis://redis:6379` |
| `MINIO_URL` | `127.0.0.1:19000` | `minio:9000` |

必须设置：`SECRET`（JWT 密钥）、`API_URL`（后端地址）、`ADMIN_PASS`（管理员密码）
