## Vue3 + TypeScript 使用 Vite 打包的基本配置

### 1. 项目初始化

使用 Vite 初始化一个 Vue3 + TypeScript 的项目，可以通过以下命令：

```bash
npm create vite@latest my-vue-app -- --template vue-ts
```

然后安装依赖并运行项目：

```bash
npm install
npm run dev
```

### 2. Vite 配置文件 (`vite.config.ts`)

在项目根目录下创建 `vite.config.ts` 文件，并配置如下内容：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true, // 默认启动项目打开页面
    port: 5173, // 端口号
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 正式域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
```

### 3. 环境变量配置

在项目根目录下创建 `.env.development` 和 `.env.production` 文件，用于不同环境的配置：

- `.env.development`:

```
VITE_APP_BASE_API=http://localhost:3000/api
```

- `.env.production`:

```
VITE_APP_BASE_API=https://api.example.com
```

### 4. TypeScript 配置 (`tsconfig.json`)

在项目根目录下创建 `tsconfig.json` 文件，并配置如下内容：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "sourceMap": true,
    "strict": true,
    "jsx": "preserve",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

### 5. 打包命令配置

在 `package.json` 中添加如下 scripts：

```json
{
  "scripts": {
    "dev": "vite",
    "build:dev": "vite build",
    "build:prod": "cross-env NODE_ENV=production vite build"
  }
}
```

### 6. 其他优化建议

- **代码分割**: 考虑使用动态导入来实现代码分割，提高应用性能。
- **环境变量管理**: 使用 `dotenv` 库来管理环境变量，确保安全性和灵活性。
- **Linting 和格式化**: 配置 ESLint 和 Prettier，保持代码风格一致性。
