# 桌面端开发

这是基于 Electron 的桌面端封装，启动后会加载 Web 端地址。

## 安装依赖

```powershell
corepack enable
corepack yarn install
```

如果 Windows 下安装 Electron 时报 `truev18.3.3` 一类下载地址错误，执行：

```powershell
$env:ELECTRON_SKIP_BINARY_DOWNLOAD = '1'
corepack yarn install
Remove-Item Env:ELECTRON_SKIP_BINARY_DOWNLOAD
$env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
node node_modules\electron\install.js
```

## 启动开发

只启动桌面壳：

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
corepack yarn dev
```

桌面壳开发服务默认运行在：


## 本地联调

同时启动本地 Web、Server 和桌面壳：

```powershell
# 仓库根目录
pnpm exec concurrently --kill-others --names app,desktop "pnpm dev" "powershell -NoProfile -Command `"Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue; Set-Location client/desktop; corepack yarn dev`""
```

启动后，在桌面端添加本地 Web 地址：

```text
http://localhost:11011/
```

也可以直接点击默认的 `Local Web`。不要把 `http://localhost:1212/` 添加为 Web 地址，`1212` 只是桌面壳自身的开发页面。

如果启动时报 `EADDRINUSE`，先清理残留开发进程：

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*xuyu-space*' -and $_.Name -in @('node.exe','esbuild.exe','electron.exe') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

## 构建

```powershell
corepack yarn build
```

## 打包

```powershell
corepack yarn package
```
