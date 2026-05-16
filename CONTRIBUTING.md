# 贡献指南

## 分支管理

- `main`: 生产分支，禁止直接推送
- `develop`: 开发分支，功能集成
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复

## 开发流程

1. 从 `develop` 创建功能分支
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. 开发并提交
   ```bash
   git add .
   git commit -m "feat: 描述"
   ```

3. 推送到远程
   ```bash
   git push origin feature/your-feature
   ```

4. 创建 Pull Request 到 `develop` 分支

5. 等待代码审核通过后合并

## 提交规范

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

示例: `feat: 添加用户登录功能`
