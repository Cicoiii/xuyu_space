# tailchat-server

## Build development environment

Checkout more detail in [https://tailchat.msgbyte.com/docs/deployment/dev](https://tailchat.msgbyte.com/docs/deployment/dev)

#### 服务端插件安装方式

安装所有插件
```
pnpm plugin:install all
```

安装单个插件
```
pnpm plugin:install com.msgbyte.tasks
```

## 单节点部署

#### docker-compose 一键部署

请确保已经安装了:
- docker
- docker-compose(或者docker compose plugin)


在项目根目录下执行
```bash
docker compose build # 需要编译
docker compose up -d
```

## DevOps

### Database management

Checkout more detail in [https://tailchat.msgbyte.com/docs/devops/mongodb](https://tailchat.msgbyte.com/docs/devops/mongodb)
