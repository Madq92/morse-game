# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指引。

## 项目概览

PCB 主题的摩斯电码练习工具。按住按键输入点和划，通过二叉树遍历解码。灵感来自 https://softcorelab.com/。

## 常用命令

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器 (Vite)
npm run build   # 生产构建
npm run preview # 预览生产构建
```

未配置测试框架和 linter。

## 架构

### 摩斯解码：`gameData.js` 中的二叉树

核心数据模型是 `src/data/gameData.js` 中以 `nodeDefs` 定义的**静态二叉树**。每个节点通过 ID 引用可选的 `dot`（左子节点）和 `dash`（右子节点）。根节点 `id: 'root'`，没有 letter。所有中间/叶节点都有 `letter`（解码后的字符）。

- `nodes` — 由 `nodeDefs` 构建的扁平查找表 `{ id: node }`
- `boardConnections` — SVG path 字符串，用于渲染 PCB 连线（父→子）
- `getTiming(baseMs)` — 根据基础速度返回 `{ tMs, dashThresholdMs, letterCommitMs, wordCommitMs }`

### 游戏状态：`useGameState` Hook

`src/hooks/useGameState.js` 是核心状态管理器：

1. 按下/释放时遍历二叉树：短按 = 点（左移），长按 = 划（右移）
2. 使用 `performance.now()` 测量按压时长，与 `dashThresholdMs` 比较
3. 空闲 `letterCommitMs` 后自动提交当前字母，再空闲 `wordCommitMs` 后添加词间空格
4. 维护 `activePath`（节点 ID 数组）用于棋盘高亮
5. 管理启动动画序列，按时间分阶段：`init → board → silk → trace → ready → live`

状态混合使用 `useState`（触发渲染）和 `useRef`（计时/路径遍历，不触发重渲染）。

### 输入

- **指针**：`PressKey` 组件处理 `onPointerDown/Up`，用 `pointerDownRef` 防重复
- **键盘**：`App.jsx` 全局监听 `Space` 键的 keydown/keyup，用 `keyDownRef` 防重复
- 两者都调用 hook 的 `pressStart()` / `pressEnd()`

### 音频

`src/utils/audio.js` — Web Audio API，单例 `AudioContext`。`playDot()` = 680Hz 100ms，`playDash()` = 680Hz 280ms。

### 渲染

- **棋盘**：基于 SVG，内联 `<svg viewBox="0 0 100 140">`。灯（圆形 = 绿色，方形 = 琥珀色）、连线、天线、扬声器、安装孔全部用 SVG 渲染
- **CSS**：所有样式在 `src/App.css` 中，使用 CSS 自定义属性。深色 PCB 主题。启动动画使用 `body:has(.boot-*)` 选择器。支持 `prefers-reduced-motion`
- **浮动字母**：基于 DOM 的回显动画，绝对定位覆盖在棋盘上方

### 速度档位

`gameData.js` 中定义三档：慢 (280ms) / 中 (200ms) / 快 (130ms)。切换速度会重置当前输入和所有计时器。
