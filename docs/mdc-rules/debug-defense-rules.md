# 历史踩坑

## Bug根源

### 1.1 Daily Agent 插件不显示、不生效

- 现象：`/main/personal/plugins` 中看不到 `daily-agent`，刷新后仍然不显示；即使代码已修改，插件中心仍读取旧列表。
- 根源：
  - 插件同时依赖构建脚本、前端注册表、服务端安装列表和运行时扫描，任意一处遗漏都会导致插件不可见。
  - 插件注册表被 React Query/localStorage 持久化，刷新后可能继续命中旧缓存。
  - Service Worker 在开发环境缓存旧资源，导致前端仍加载旧插件列表或旧插件产物。
  - AI 容易只改插件源码，忽略 `registry.json`、`package.json build:server`、`server/public/plugins` 和缓存层。

### 1.2 插件运行时报错或数据异常

- 现象：插件已显示但交互失败，接口返回值读取不对，前端代码导入路径不兼容。
- 根源：
  - `pluginRequest` 返回的是 axios 风格响应，业务数据在 `res.data`。
  - 插件运行时上下文使用 `@capital/*` 暴露能力，不能随意假设普通 Web 源码别名可用。

### 1.3 深色模式白底白字

- 现象：深色模式下，入口页、右侧聊天区、插件中心顶栏、模态框、小序助手、小序聊天出现白色文字叠在白色背景上。
- 根源：
  - 组件硬编码 `#fff`、`#f8fafc`、`bg-white`、`bg-gray-50`，只把文字切到 dark，没有同步背景。
  - Tailwind 的 `dark:` 选择器依赖 `.dark` 作用域；根节点、`#app`、`#xuyu-app`、`body`、portal 节点不一致时会失效。
  - 小序聊天使用 `createPortal(..., document.body)`，如果主题变量只定义在 `#xuyu-app`，浮窗拿不到变量。
  - AI 容易局部替换颜色，忽略弹层、portal、插件构建产物和内联 style。

### 1.4 插件源码已修但页面仍旧

- 现象：改了 `client/web/plugins/.../src`，页面仍显示旧 UI。
- 根源：
  - 插件页面可能加载 `client/web/dist/plugins/...` 中的构建产物。
  - 只改源码不重建插件，运行时仍是旧 bundle。

## 2. 严厉的禁令与防御行为规范

### Don'ts：严禁再犯的反模式

- 禁止只修改插件源码，却不检查插件是否被注册、构建、安装、扫描。
- 禁止把插件注册表、插件列表、插件扫描结果放入长期 localStorage 持久化缓存。
- 禁止用 `_once`、单次初始化标记或无限 `staleTime/cacheTime` 缓存插件注册表。
- 禁止开发环境继续启用会缓存插件资源的 Service Worker。
- 禁止在插件代码里直接把 `pluginRequest.post(...)` 的返回对象当业务数据使用。
- 禁止在深色模式相关组件中硬编码 `#fff`、`#ffffff`、`#f8fafc`、`#f1f5f9`、`#e2e8f0`、`bg-white`、`bg-gray-50` 作为主体背景。
- 禁止只在 `#xuyu-app` 上定义主题变量，而忽略 `html`、`body`、`#app` 和 portal 节点。
- 禁止依赖单一 Tailwind `dark:bg-*` 修复深色模式核心容器；核心容器必须直接吃主题变量。
- 禁止在插件浮窗、Popover、Modal、FullModal 里写死浅色背景和浅色边框。
- 禁止改完 `client/web/plugins/*/src` 后不重建对应插件 bundle。
- 禁止把构建产物是否更新当作猜测；必须检查 `client/web/dist/plugins/<plugin>/` 的修改时间或 bundle 内容。

### Do's：必须执行的标准解法

- 插件可见性修改必须同时检查：
  - `client/web/registry.json`
  - 根目录或服务端构建脚本中的插件安装列表
  - `server/public/plugins/<plugin>/`
  - `client/web/dist/plugins/<plugin>/`
  - 插件中心的扫描和缓存逻辑
- 插件注册表必须按“短缓存或不持久化”处理，刷新后必须能重新拉取最新列表。
- 开发环境必须禁用或注销 Service Worker，避免旧插件资源污染调试结果。
- 插件请求必须显式解包 `res.data`。
- 主题颜色必须先进入底层 token，再通过 CSS 变量给 Less、Tailwind、TSX inline style 使用。
- 深色模式的基础变量必须同时覆盖 `html`、`body`、`#app`、`#xuyu-app`。
- 所有主内容、侧栏、聊天区、插件中心、Modal、FullModal、插件 portal 浮窗必须使用：
  - `var(--tc-surface-color)`
  - `var(--tc-surface-panel-color)`
  - `var(--tc-surface-soft-color)`
  - `var(--tc-content-background-color)`
  - `var(--tc-text-color)`
  - `var(--tc-text-secondary-color)`
  - `var(--tc-text-muted-color)`
  - `var(--tc-border-color)`
- 插件源码修改后必须执行对应构建：
  - `client/web/node_modules/.bin/ministar.CMD buildPlugin com.msgbyte.ai-assistant`
  - `client/web/node_modules/.bin/ministar.CMD buildPlugin com.msgbyte.xiaoxu-chat`
- 每次深色模式修改后必须搜索浅色硬编码残留。

## 3. 前车之鉴：错误示范与正确修复

### 3.1 插件注册表不能持久化到 localStorage

Buggy Code:

```ts
persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: () => true,
  },
});
```

Fixed Code:

```ts
persistQueryClient({
  queryClient,
  persister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.queryKey[0] !== 'pluginRegistry',
  },
});
```

### 3.2 插件注册表不能使用一次性缓存

Buggy Code:

```ts
let pluginRegistryOnce: Promise<PluginManifest[]> | null = null;

export function getRegistryPlugins() {
  if (!pluginRegistryOnce) {
    pluginRegistryOnce = fetchRegistry();
  }

  return pluginRegistryOnce;
}
```

Fixed Code:

```ts
export function getRegistryPlugins() {
  return fetchRegistry();
}
```

### 3.3 插件请求必须读取 `res.data`

Buggy Code:

```ts
const result = await pluginRequest.post('daily-report', payload);
setReport(result.report);
```

Fixed Code:

```ts
const res = await pluginRequest.post('daily-report', payload);
setReport(res.data.report);
```

### 3.4 深色模式核心容器禁止白底硬编码

Buggy Code:

```tsx
<div className="bg-white dark:bg-coolGray-800 text-white">
  {children}
</div>
```

Fixed Code:

```tsx
<div
  style={{
    backgroundColor: 'var(--tc-surface-panel-color)',
    color: 'var(--tc-text-color)',
  }}
>
  {children}
</div>
```

### 3.5 Portal 浮窗不能只依赖 `#xuyu-app` 变量

Buggy Code:

```less
#xuyu-app {
  --tc-surface-panel-color: #ffffff;

  &.dark {
    --tc-surface-panel-color: #1e293b;
  }
}
```

Fixed Code:

```less
html,
body,
#app,
#xuyu-app {
  --tc-surface-panel-color: @tc-surface;
}

html.dark,
body.dark,
#app.dark,
#xuyu-app.dark {
  --tc-surface-panel-color: @tc-surface-panel-dark;
}
```

### 3.6 小序聊天 portal 浮窗禁止浅色内联背景

Buggy Code:

```tsx
createPortal(<FloatingWindow />, document.body);

<div style={{ backgroundColor: '#fff', color: '#334155' }} />
```

Fixed Code:

```tsx
createPortal(<FloatingWindow />, document.body);

<div
  style={{
    backgroundColor: 'var(--tc-surface-panel-color)',
    color: 'var(--tc-text-color)',
  }}
/>
```

### 3.7 聊天内容区不能只靠 Tailwind 深色类

Buggy Code:

```tsx
<div className="flex flex-auto bg-gray-50 dark:bg-coolGray-700">
  <ChatBox />
</div>
```

Fixed Code:

```tsx
<div
  className="flex flex-auto"
  style={{ backgroundColor: 'var(--tc-content-background-color)' }}
>
  <ChatBox />
</div>
```

### 3.8 插件源码修改后必须构建产物

Buggy Workflow:

```txt
edit client/web/plugins/com.msgbyte.xiaoxu-chat/src/ChatPanel.tsx
refresh browser
```

Fixed Workflow:

```txt
edit client/web/plugins/com.msgbyte.xiaoxu-chat/src/ChatPanel.tsx
client/web/node_modules/.bin/ministar.CMD buildPlugin com.msgbyte.xiaoxu-chat
refresh browser
```

## 4. 修改此区域代码时的强制检查清单

- 插件不显示时，先查注册、构建、服务端安装、扫描、缓存，不能只看源码。
- 搜索插件残留：

```txt
rg -n "daily-agent|pluginRegistry|registry.json|ServiceWorker|serviceWorker" client server package.json
```

- 搜索深色模式白底残留：

```txt
rg -n "#fff|#ffffff|#f8fafc|#f1f5f9|#e2e8f0|bg-white|bg-gray-50" client/web/src client/web/plugins -g "*.tsx" -g "*.less"
```

- 搜索插件构建产物是否使用主题变量：

```txt
rg -n "var\\(--tc-surface|var\\(--tc-text|var\\(--tc-border" client/web/dist/plugins -g "*.js"
```

- 修改 `client/web/plugins/*/src` 后必须重建对应插件。
- 修改主题变量后必须检查 portal 场景：AntD Modal、项目 Modal、FullModal、Popover、`createPortal(..., document.body)`。
- 修改深色模式后必须至少打开以下页面手测：
  - `/entry/login`
  - `/main/personal/plugins`
  - 右侧聊天区
  - 普通 Modal
  - FullModal 设置页
  - 小序助手
  - 小序聊天

## 5. 机器执行标准

- 如果需求涉及插件可见性，必须优先读取本文件第 2 节和第 4 节。
- 如果需求涉及主题、深色模式、Modal、Popover、插件浮窗，必须优先读取本文件第 2.3、3.4、3.5、3.6、3.7 节。
- 如果发现新增代码包含主体背景 `#fff`、`#ffffff`、`#f8fafc`、`bg-white`，必须拒绝直接提交，除非该元素明确不是容器背景，且不影响深色模式。
- 如果发现插件源码被修改但 dist 插件产物未更新，必须执行插件构建或明确告知运行时不会生效。
