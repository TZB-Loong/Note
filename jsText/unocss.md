# Vue3 + TypeScript 接入 UnoCSS 及常用原子类

## 一、简介

UnoCSS 是一个高性能且极具灵活性的即时原子化 CSS 引擎，核心在于其灵活性，所有 CSS 工具类均通过预设提供。在 Vue3 + TypeScript 项目中接入 UnoCSS，可以显著提高开发效率和代码可维护性。

## 二、安装与配置

### 1. 安装 UnoCSS

在项目中安装 UnoCSS：

```bash
npm install -D unocss
```

### 2. 配置 Vite 插件

在 `vite.config.ts` 中引入 UnoCSS 插件：

```typescript
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [UnoCSS()],
});
```

### 3. 创建 UnoCSS 配置文件

创建 `uno.config.ts` 文件：

```typescript
import { defineConfig } from "unocss";

export default defineConfig({
  // 配置选项，如预设、规则等
});
```

### 4. 在主入口文件中引入

在 `main.ts` 中引入 UnoCSS：

```typescript
import "virtual:uno.css";
```

## 三、常用原子类

### 1. 宽度和高度

- `w-0`: `width: 0;`
- `w-1`: `width: 0.25rem;`
- `h-100px`: `height: 100px;`
- `h--10px`: `height: -10px;`
- `h-full`: `height: 100%;`
- `min-w-screen`: `min-width: 100vw;`

### 2. 颜色和背景

- `text-25px`: `font-size: 25px;`
- `text-#ff6700`: `color: #ff6700;`
- `bg-#ccc`: `background: #ccc;`

### 3. 边距和填充

- `m-2`: `margin: 0.5rem;`
- `mt-4`: `margin-top: 1rem;`
- `p-3`: `padding: 0.75rem;`
- `pt-6`: `padding-top: 1.5rem;`

### 4. 布局和定位

- `flex`: `display: flex;`
- `items-center`: `align-items: center;`
- `justify-between`: `justify-content: space-between;`
- `h-screen`: `height: 100vh;`

```

```
