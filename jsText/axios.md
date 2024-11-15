Vue3 + TypeScript 中 Axios 的封装

简介
在现代前端开发中，Axios 是一个非常流行的 HTTP 客户端，它允许我们轻松地发出 HTTP 请求并与后端服务进行交互。在 Vue3 和 TypeScript 的项目中，封装 Axios 可以帮助我们更好地管理和使用 HTTP 请求，从而提高代码的可维护性和可读性。

1. 安装 Axios
   首先，我们需要在项目中安装 Axios。你可以使用 npm 或 yarn 来安装。

```bash
npm install axios
```

或者

```bash
yarn add axios
```

2. 创建 Axios 实例
   接下来，我们在 `src` 文件夹下创建一个新的文件夹 `api`，并在其中创建一个名为 `request.ts` 的文件。在这个文件中，我们将创建一个 Axios 实例，并配置它的基本属性。

```typescript
import axios from "axios";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: "https://api.example.com", // API 的基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

export default instance;
```

3. 配置请求和响应拦截器
   为了更好地处理请求和响应，我们可以配置请求和响应拦截器。这些拦截器可以帮助我们统一处理请求头、请求数据、响应数据以及错误处理。

```typescript
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加 token
    config.headers["Authorization"] = "Bearer your-token";
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理 401 错误
          break;
        case 404:
          // 处理 404 错误
          break;
        // 其他错误处理
      }
    }
    return Promise.reject(error);
  }
);
```

4. 封装请求方法
   为了简化请求调用，我们可以封装一些常用的请求方法，如 GET、POST、PUT 和 DELETE。

```typescript
// 封装请求方法
export const get = (url: string, params: any = {}) => {
  return instance.get(url, { params });
};

export const post = (url: string, data: any = {}) => {
  return instance.post(url, data);
};

export const put = (url: string, data: any = {}) => {
  return instance.put(url, data);
};

export const deleteRequest = (url: string) => {
  return instance.delete(url);
};
```

5. 使用封装的 Axios 实例
   现在，我们可以在 Vue 组件或其他地方使用封装的 Axios 实例来发送 HTTP 请求。

```typescript
import { get, post } from "./api/request";

// 发送 GET 请求
get("/api/data")
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

// 发送 POST 请求
post("/api/data", { key: "value" })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

6. 示例代码
   以下是完整的示例代码，展示了如何在 Vue3 和 TypeScript 项目中封装和使用 Axios。

```typescript
// src/api/request.ts
import axios from "axios";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer your-token";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          break;
        case 404:
          break;
      }
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export const get = (url: string, params: any = {}) => {
  return instance.get(url, { params });
};

export const post = (url: string, data: any = {}) => {
  return instance.post(url, data);
};

export const put = (url: string, data: any = {}) => {
  return instance.put(url, data);
};

export const deleteRequest = (url: string) => {
  return instance.delete(url);
};
```
