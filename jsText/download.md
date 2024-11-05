# Vue3 + TypeScript + Axios 文件下载的Hooks封装及使用

## 概述

在现代前端开发中，Vue 3 结合 TypeScript 和 Axios 已经成为了一种流行的技术栈。本文将介绍如何使用 Vue 3 的 Composition API（Hooks）封装 Axios 进行文件下载，并展示如何在组件中使用这些封装的 Hooks。

## 封装 Axios 请求

首先，我们需要封装一个 Axios 的实例，用于后续的 HTTP 请求。在 `src/utils/request.ts` 文件中，我们可以这样配置：

```typescript
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截器
instance.interceptors.request.use(config => {
  // 例如，添加Token
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
  // 处理响应数据
  return response;
}, error => {
  // 处理响应错误
  return Promise.reject(error);
});

export default instance;
```

## 封装文件下载 Hooks

接下来，我们封装一个用于文件下载的 Hooks。在 `src/hooks/useDownload.ts` 文件中，我们可以这样实现：

```typescript
import { ref } from 'vue';
import axiosInstance from '../utils/request';

export function useDownload() {
  const downloadFile = async (url: string, params?: any, filename?: string) => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: 'blob', // 指定响应类型为blob
      });
      const blob = new Blob([response.data]);
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename || 'default.xlsx');
      } else {
        const blobURL = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename || 'default.xlsx');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
      }
    } catch (error) {
      console.error('下载文件失败:', error);
    }
  };

  return {
    downloadFile,
  };
}
```

## 使用封装的 Hooks

最后，在 Vue 组件中使用封装的 Hooks 进行文件下载。例如，在 `src/components/DownloadComponent.vue` 中：

```vue
<template>
  <button @click="handleDownload">下载文件</button>
</template>

<script lang="ts" setup>
import { useDownload } from '@/hooks/useDownload';

const { downloadFile } = useDownload();

const handleDownload = async () => {
  await downloadFile('/api/files/example', {}, 'example.xlsx');
};
</script>
```

