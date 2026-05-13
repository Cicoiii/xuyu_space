# 序语·空间 (Xuyu Space)

基于 [Tailchat](https://github.com/msgbyte/tailchat) 的即时通讯协作平台。

## 项目说明

本项目是在 [Tailchat](https://github.com/msgbyte/tailchat) 开源项目基础上进行定制开发的团队协作工具。

### 定制内容

- 自定义品牌标识和主题
- 默认日间模式
- AI 助手集成（DeepSeek）
- 其他插件扩展

---

## CHU小组

### 方式一：Docker 全栈运行（推荐，最简单）

只需要安装 Docker Desktop，然后执行：

```bash
# 克隆仓库
git clone https://github.com/Cicoiii/xuyu_space.git
cd xuyu_space

# 一键启动（首次构建约10分钟）
docker compose up -d --build

# 访问 http://localhost:11000
```

**停止服务：**
```bash
docker compose down
```

详见 [DEVELOPMENT.md](./DEVELOPMENT.md) 中的 "全栈部署" 部分。

---

### 方式二：本地开发运行（前后端分离）

适合需要修改代码、调试开发的场景。

#### 前置要求

- Node.js 18+
- pnpm 8+
- Docker Desktop（用于运行数据库等基础设施）

#### 步骤

**1. 启动基础设施（数据库、缓存、文件存储）**

```bash
# 仅启动 MongoDB、Redis、MinIO
docker compose -f docker-compose.infra.yml up -d
```

**2. 安装依赖**

```bash
pnpm install
```

**3. 启动后端服务**

```bash
# 启动后端（端口 11000）
pnpm dev:server

```

**4. 启动前端**

```bash
# 新终端窗口
pnpm dev:web
```

**5. 访问**

- 前端：http://localhost:11011
- 后端 API：http://localhost:11000

#### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 同时启动前端 + 后端 |
| `pnpm dev:server` | 仅启动后端 |
| `pnpm dev:web` | 仅启动前端 |
| `pnpm build` | 构建生产版本 |

详见 [DEVELOPMENT.md](./DEVELOPMENT.md) 中的 "本地开发" 部分。

---

## 端口说明

| 端口 | 服务 | 说明 |
|------|------|------|
| 11000 | 后端 API | 全栈部署时的访问端口 |
| 11011 | 前端 Dev | 本地开发时的前端端口 |
| 27017 | MongoDB | 数据库 |
| 6379 | Redis | 缓存 |
| 19000 | MinIO API | 对象存储 |
| 19001 | MinIO Console | 文件存储管理界面 |

---

## 开发指南

详见 [DEVELOPMENT.md](./DEVELOPMENT.md)

---


