# xuyu_space Sealos 部署手册

本文档面向仓库 `Cicoiii/xuyu_space` 的生产部署：

```text
https://github.com/Cicoiii/xuyu_space/tree/master
```

当前项目是 Tailchat 派生的 pnpm monorepo。根目录 `Dockerfile` 会构建 `client/web` 和 `server`，并把前端产物复制到 `server/dist/public`。同一个镜像可以通过不同环境变量启动为核心 Web/API 服务、插件服务、OpenAPI 服务。

你提供的域名标识是 `xuyuspace`。注意：生产环境里的 `API_URL` 必须填完整公网地址，例如 Sealos 分配或你绑定后的 `https://xuyuspace.xxx`，不能只填 `xuyuspace`。

## 一、最终架构

推荐在 Sealos App Launchpad 中拆成多个应用，不建议直接照搬 `docker-compose.yml`。

| Sealos 应用 | 镜像 | 公网 | 端口 | 作用 |
| --- | --- | --- | --- | --- |
| `xuyuspace-core` | `ghcr.io/cicoiii/xuyu_space:20260518` | 开启 | `3000` | 网站首页、`/api`、`/upload`、`/static`、Socket.IO |
| `xuyuspace-plugins` | 同一个镜像 | 关闭 | 不暴露 | 后端插件服务，包含 AI assistant 等插件 |
| `xuyuspace-openapi` | 同一个镜像 | 默认关闭 | `3003` | OpenAPI/OIDC，可选 |
| MongoDB | Sealos 数据库或 `mongo:4` | 关闭 | `27017` | 主数据库 |
| Redis | Sealos 数据库或 `redis:alpine` | 关闭 | `6379` | Moleculer transporter、缓存、Socket.IO adapter |
| MinIO | Sealos 模板或 `minio/minio` | 控制台可选 | `9000/9001` | 文件对象存储 |

第一版最小可用组合：

```text
xuyuspace-core + xuyuspace-plugins + MongoDB + Redis + MinIO
```

`xuyuspace-openapi` 只有在你需要开放平台、机器人集成、OIDC/OAuth 相关能力时才部署。

## 二、仓库里的部署适配

已经补好的文件：

```text
.dockerignore
deploy/sealos/core.env.example
deploy/sealos/plugins.env.example
deploy/sealos/openapi.env.example
deploy/sealos/minio.env.example
docs/sealos-deploy.zh-CN.md
```

`.dockerignore` 已经排除 `**/.env`、`docker-compose.env`、`node_modules`、`dist`、`logs`、桌面端、移动端等内容，避免本地密钥和无关构建产物进入镜像。

## 三、先准备这些值

### 1. 完整公网地址

假设 Sealos 最终给你的访问地址是：

```text
https://xuyuspace.xxx
```

后面所有环境变量中的 `API_URL` 都填这个完整地址。

如果你后面绑定了正式域名，比如：

```text
https://xuyuspace.com
```

那就把所有应用里的 `API_URL` 统一改成这个正式域名。

### 2. 生产 SECRET

在本地 PowerShell 执行：

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

把输出保存下来，后面 `xuyuspace-core`、`xuyuspace-plugins`、`xuyuspace-openapi` 必须使用同一个 `SECRET`。

上线后不要随便修改 `SECRET`，否则用户登录态会失效。

### 3. MinIO 密码和管理后台密码

分别执行两次：

```powershell
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

一个作为 `MINIO_ROOT_PASSWORD` / `MINIO_PASS`，另一个作为 `ADMIN_PASS`。

### 4. AI Key

本地 `docker-compose.env` 曾出现过真实 AI API Key。建议立刻去对应平台吊销并重新生成。

生产环境只把新 Key 填到 Sealos 环境变量：

```text
AI_API_KEY=你的新Key
```

不要再把真实 Key 写进 Git、Dockerfile、文档或镜像。

## 四、构建并推送镜像

### 方案 A：推送到 GitHub Container Registry

镜像建议命名为：

```text
ghcr.io/cicoiii/xuyu_space:20260518
```

如果还没登录 GHCR，先准备一个 GitHub Personal Access Token，至少需要 `write:packages` 权限，然后执行：

```powershell
docker login ghcr.io -u Cicoiii
```

根据提示输入 GitHub Token。

在仓库根目录构建并推送：

```powershell
docker build --build-arg VERSION=20260518 -t ghcr.io/cicoiii/xuyu_space:20260518 .
docker push ghcr.io/cicoiii/xuyu_space:20260518
```

如果 Sealos 拉取私有 GHCR 镜像，需要在 Sealos 中配置镜像仓库凭据。为了第一次部署省心，也可以先把这个 package 设为 public。

### 方案 B：推送到 Docker Hub

如果你更想用 Docker Hub，可以用：

```powershell
docker build --build-arg VERSION=20260518 -t cicoiii/xuyu_space:20260518 .
docker push cicoiii/xuyu_space:20260518
```

后文镜像地址全部替换成：

```text
cicoiii/xuyu_space:20260518
```

## 五、创建依赖服务

### 推荐：使用 Sealos 托管数据库

在 Sealos 中创建：

1. MongoDB：记录内网连接地址、端口、用户名、密码、数据库名。
2. Redis：记录内网地址、端口、密码。
3. MinIO 或对象存储：记录内网地址、Access Key、Secret Key。

常见格式如下：

```text
MONGO_URL=mongodb://user:password@mongo-host:27017/tailchat?authSource=admin
REDIS_URL=redis://:password@redis-host:6379
TRANSPORTER=redis://:password@redis-host:6379
MINIO_URL=minio-host:9000
MINIO_USER=tailchat
MINIO_PASS=你的MinIO密码
```

如果 Sealos 页面给了明确连接串，以页面为准。

### 备选：在 App Launchpad 自建依赖

如果不用托管数据库，可以创建三个内部应用。

MongoDB：

```text
应用名：xuyuspace-mongo
镜像：mongo:4
端口：27017
持久化路径：/data/db
公网访问：关闭
```

Redis：

```text
应用名：xuyuspace-redis
镜像：redis:alpine
端口：6379
公网访问：关闭
```

MinIO：

```text
应用名：xuyuspace-minio
镜像：minio/minio
端口：9000、9001
启动命令：server /data --console-address ":9001"
持久化路径：/data
公网访问：9001 控制台可按需开启，9000 建议仅内网
```

MinIO 环境变量：

```text
MINIO_ROOT_USER=tailchat
MINIO_ROOT_PASSWORD=你的MinIO密码
```

如果三个依赖和业务应用在同一命名空间，通常可以先尝试这些内网地址：

```text
MONGO_URL=mongodb://xuyuspace-mongo:27017/tailchat
REDIS_URL=redis://xuyuspace-redis:6379
TRANSPORTER=redis://xuyuspace-redis:6379
MINIO_URL=xuyuspace-minio:9000
```

如果 Sealos 显示了更具体的内部访问地址，以 Sealos 页面为准。

## 六、部署 xuyuspace-core

在 Sealos App Launchpad 创建应用：

| 配置项 | 值 |
| --- | --- |
| 应用名 | `xuyuspace-core` |
| 镜像 | `ghcr.io/cicoiii/xuyu_space:20260518` |
| 实例数 | `1` |
| CPU/内存 | 建议先 `1 CPU / 1GiB` |
| 容器端口 | `3000` |
| 公网访问 | 开启 |
| 域名 | 使用 Sealos 分配域名或绑定你的 `xuyuspace` 正式域名 |

环境变量从 `deploy/sealos/core.env.example` 复制，然后按实际地址替换。最终类似：

```text
NODE_ENV=production
LOGGER=true
LOGLEVEL=info
DISABLE_TRACING=true
SERVICES=core/gateway,core/user/*.service.js,core/group/*.service.js,core/chat/*.service.js,core/file,core/plugin/registry,core/config
PORT=3000
API_URL=https://xuyuspace.xxx
SECRET=替换为生产SECRET
TRANSPORTER=redis://xuyuspace-redis:6379
REDIS_URL=redis://xuyuspace-redis:6379
MONGO_URL=mongodb://xuyuspace-mongo:27017/tailchat
MINIO_URL=xuyuspace-minio:9000
MINIO_USER=tailchat
MINIO_PASS=替换为MinIO密码
MINIO_BUCKET_NAME=tailchat
MINIO_SSL=false
MINIO_PATH_STYLE=PathStyle
EMAIL_VERIFY=false
SMTP_SENDER=
SMTP_URI=
PROMETHEUS=0
ADMIN_USER=tailchat
ADMIN_PASS=替换为管理后台密码
AI_PROVIDER_NAME=DeepSeek
AI_API_URL=https://api.deepseek.com/v1
AI_API_KEY=替换为AI服务Key
AI_CHAT_MODEL=deepseek-chat
```

部署完成后访问：

```text
https://xuyuspace.xxx/health
```

能返回健康信息，说明 core 服务启动成功。

## 七、部署 xuyuspace-plugins

创建第二个 App Launchpad 应用：

| 配置项 | 值 |
| --- | --- |
| 应用名 | `xuyuspace-plugins` |
| 镜像 | `ghcr.io/cicoiii/xuyu_space:20260518` |
| 实例数 | `1` |
| CPU/内存 | 建议先 `0.5 CPU / 512MiB` |
| 公网访问 | 关闭 |

环境变量从 `deploy/sealos/plugins.env.example` 复制。最终类似：

```text
NODE_ENV=production
LOGGER=true
LOGLEVEL=info
DISABLE_TRACING=true
SERVICEDIR=plugins
API_URL=https://xuyuspace.xxx
SECRET=替换为生产SECRET
TRANSPORTER=redis://xuyuspace-redis:6379
REDIS_URL=redis://xuyuspace-redis:6379
MONGO_URL=mongodb://xuyuspace-mongo:27017/tailchat
MINIO_URL=xuyuspace-minio:9000
MINIO_USER=tailchat
MINIO_PASS=替换为MinIO密码
MINIO_BUCKET_NAME=tailchat
MINIO_SSL=false
MINIO_PATH_STYLE=PathStyle
EMAIL_VERIFY=false
SMTP_SENDER=
SMTP_URI=
PROMETHEUS=0
AI_PROVIDER_NAME=DeepSeek
AI_API_URL=https://api.deepseek.com/v1
AI_API_KEY=替换为AI服务Key
AI_CHAT_MODEL=deepseek-chat
```

这些值必须和 core 完全一致：

```text
API_URL
SECRET
TRANSPORTER
REDIS_URL
MONGO_URL
MINIO_URL
MINIO_USER
MINIO_PASS
MINIO_BUCKET_NAME
AI_API_KEY
```

`xuyuspace-plugins` 不需要公网地址。看日志没有 Mongo、Redis、MinIO 连接错误即可。

## 八、可选：部署 xuyuspace-openapi

只有需要 OpenAPI、机器人集成或 OIDC/OAuth 时才部署。

| 配置项 | 值 |
| --- | --- |
| 应用名 | `xuyuspace-openapi` |
| 镜像 | `ghcr.io/cicoiii/xuyu_space:20260518` |
| 实例数 | `1` |
| CPU/内存 | 建议先 `0.5 CPU / 512MiB` |
| 容器端口 | `3003` |
| 公网访问 | 默认关闭 |

环境变量：

```text
NODE_ENV=production
LOGGER=true
LOGLEVEL=info
DISABLE_TRACING=true
SERVICES=openapi/app,openapi/bot,openapi/integration,openapi/oidc/oidc
OPENAPI_PORT=3003
OPENAPI_UNDER_PROXY=true
API_URL=https://xuyuspace.xxx
SECRET=替换为生产SECRET
TRANSPORTER=redis://xuyuspace-redis:6379
REDIS_URL=redis://xuyuspace-redis:6379
MONGO_URL=mongodb://xuyuspace-mongo:27017/tailchat
MINIO_URL=xuyuspace-minio:9000
MINIO_USER=tailchat
MINIO_PASS=替换为MinIO密码
MINIO_BUCKET_NAME=tailchat
MINIO_SSL=false
MINIO_PATH_STYLE=PathStyle
EMAIL_VERIFY=false
SMTP_SENDER=
SMTP_URI=
PROMETHEUS=0
```

如果你必须让公网访问 `/open`，更稳的做法是再加一层 Nginx/Traefik，把 `/` 转发到 `xuyuspace-core:3000`，把 `/open` 转发到 `xuyuspace-openapi:3003`。如果只是先上线网站，可以暂时不部署 openapi。

## 九、上线验证

按顺序检查：

1. 打开 `https://xuyuspace.xxx/health`，确认健康检查可访问。
2. 打开 `https://xuyuspace.xxx`，确认前端能加载。
3. 注册或登录一个账号。
4. 创建群组，发送一条消息。
5. 刷新页面，确认消息还在。
6. 上传一张小图片，刷新后确认图片还能访问。
7. 查看 `xuyuspace-core` 日志，确认没有 `MONGO_URL`、`REDIS_URL`、`MINIO`、`SECRET` 相关错误。
8. 查看 `xuyuspace-plugins` 日志，确认插件服务已连接到同一个 Redis transporter。

## 十、常见问题

### 1. 页面能打开，但接口或上传失败

重点检查：

```text
API_URL
MINIO_URL
MINIO_USER
MINIO_PASS
MINIO_BUCKET_NAME
MINIO_SSL
MINIO_PATH_STYLE
```

`API_URL` 必须是完整公网地址，比如 `https://xuyuspace.xxx`。`MINIO_URL` 对应用来说应该是内网地址，比如 `xuyuspace-minio:9000`，不要填 MinIO 控制台公网地址。

### 2. 登录后刷新变成未登录

检查 `xuyuspace-core`、`xuyuspace-plugins`、`xuyuspace-openapi` 的 `SECRET` 是否完全一致。

### 3. core 日志提示找不到 action

通常是 `xuyuspace-plugins` 没启动，或者 `TRANSPORTER` 没和 core 指向同一个 Redis。

### 4. Sealos 环境变量值异常

批量粘贴环境变量时，每行只写：

```text
KEY=value
```

不要写行内注释：

```text
API_URL=https://xuyuspace.xxx # 不要这样写
```

Sealos 会把 `# 不要这样写` 也当成值的一部分。

### 5. 镜像拉取失败

优先确认三件事：

```text
镜像地址是否正确
镜像 tag 是否存在
Sealos 是否有私有仓库凭据
```

如果使用 GHCR 私有镜像，建议第一次部署先把 package 设为 public，跑通后再切回私有并配置凭据。

## 十一、升级发布

以后每次发布新版本，换一个 tag：

```powershell
docker build --build-arg VERSION=20260518-2 -t ghcr.io/cicoiii/xuyu_space:20260518-2 .
docker push ghcr.io/cicoiii/xuyu_space:20260518-2
```

然后在 Sealos 中把这三个应用的镜像 tag 改成新版本：

```text
xuyuspace-core
xuyuspace-plugins
xuyuspace-openapi
```

如果没有部署 openapi，只更新 core 和 plugins。

## 十二、生产安全清单

上线前确认：

1. `server/.env` 和 `docker-compose.env` 没有被提交到 Git。
2. 真实 AI Key 已经从本地明文文件中移除，并且旧 Key 已吊销。
3. `SECRET` 足够长，并且所有服务一致。
4. MongoDB、Redis、MinIO 不开放不必要的公网端口。
5. MinIO 挂载了持久化存储。
6. MongoDB 挂载了持久化存储或使用了托管数据库。
7. `API_URL` 是完整 `https://...` 地址，不是 `localhost`，也不是裸的 `xuyuspace`。
