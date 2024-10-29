# Vue3 + Vite + TypeScript 开发环境配置指南

## 1. 代理配置

### 1.1 基础配置

在 `vite.config.ts` 文件中配置代理（注意使用 `.ts` 后缀以支持 TypeScript）：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // 指定开发服务器端口
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // 支持多个代理配置
      "/ws": {
        target: "ws://localhost:8080",
        ws: true, // 启用 WebSocket 代理
      },
    },
  },
});
```

### 1.2 代理配置说明

- `target`: 代理目标地址
- `changeOrigin`: 修改请求头中的 Origin
- `rewrite`: 重写请求路径
- `ws`: WebSocket 支持
- `secure`: 是否验证 SSL 证书（默认：true）

## 2. 接口调用示例

### 2.1 使用 TypeScript 类型

```typescript
// types/user.ts
interface User {
  id: number;
  name: string;
  email: string;
}

// components/UserList.vue
<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const users = ref<User[]>([]);
const loading = ref<boolean>(false);
const error = ref<string>("");

async function queryUsers() {
  loading.value = true;
  try {
    const response = await axios.get<User[]>("/api/users");
    users.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "未知错误";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="user-list">
    <button @click="queryUsers" :disabled="loading">
      {{ loading ? '加载中...' : '查询用户列表' }}
    </button>

    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="users.length">
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  </div>
</template>
```

## 3. 开发调试指南

### 3.1 环境准备

```bash
# 安装依赖
npm install axios @types/node -D

# 启动开发服务器
npm run dev
```

### 3.2 调试技巧

1. **网络调试**

   - 使用 Chrome DevTools 的 Network 面板监控请求
   - 使用 Vue DevTools 观察组件状态变化

2. **代码调试**
   - 在 VS Code 中配置 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "调试 Vue 应用",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### 3.3 最佳实践

- 使用环境变量管理不同环境的接口地址
- 封装统一的请求拦截器处理错误
- 使用 TypeScript 类型确保类型安全
- 实现加载状态和错误处理逻辑

## 4. 常见问题解决

1. **跨域问题**：确保代理配置正确，`changeOrigin` 设置为 `true`
2. **路径问题**：检查 `rewrite` 规则是否正确
3. **类型错误**：确保接口返回数据符合定义的 TypeScript 接口

## 5. 高级配置示例

### 5.1 环境变量配置

```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:8080

// .env.production
VITE_API_BASE_URL=https://api.production.com
```

### 5.2 请求封装

```typescript
// utils/request.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加 token 等通用处理
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权情况
    }
    return Promise.reject(error);
  }
);

export default request;
```

### 5.3 API 模块化

```typescript
// api/user.ts
import request from "@/utils/request";
import type { User } from "@/types/user";

export const userApi = {
  getUsers() {
    return request.get<User[]>("/users");
  },

  getUserById(id: number) {
    return request.get<User>(`/users/${id}`);
  },

  createUser(user: Omit<User, "id">) {
    return request.post<User>("/users", user);
  },
};
```

## 6. 性能优化建议

1. **代理缓存**

   - 配置代理缓存减少重复请求
   - 使用浏览器缓存策略

2. **请求优化**

   - 合并请求减少网络开销
   - 使用防抖和节流控制请求频率

3. **类型优化**
   - 使用 TypeScript 的 Partial 和 Pick 等工具类型
   - 避免过度使用 any 类型

## 7. 安全建议

1. **代理安全**

   - 限制代理请求的域名范围
   - 配置请求头白名单

2. **数据安全**
   - 敏感数据加密传输
   - 实现 CSRF 防护

```typescript
// vite.config.ts 安全配置示例
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: true,
        headers: {
          "X-Proxy-Header": "proxy",
        },
        // 添加请求白名单
        filter: (path) => {
          return /^\/api\/(users|posts|comments)/.test(path);
        },
      },
    },
  },
});
```
