# Vue3 + TypeScript 实现 iframe 嵌入与通信的完整指南

## 前言

在现代前端开发中,使用 `iframe` 嵌入外部内容是一个常见需求。本文将详细介绍如何在 Vue3 和 TypeScript 项目中内嵌 `iframe`,实现与其之间的通信,以及如何实现 iframe 的弹框全屏效果。

## 技术栈

- Vue 3
- TypeScript
- Vue CLI / Vite

## 正文

### 1. 创建 Vue3 项目

首先,我们需要创建一个新的 Vue3 项目。根据你的喜好,可以选择使用 Vue CLI 或 Vite。

#### 使用 Vue CLI

```bash
# 安装Vue CLI (如果尚未安装)
npm install -g @vue/cli

# 创建新项目
vue create vue-iframe-demo
cd vue-iframe-demo
```

#### 使用 Vite

```bash
npm init vite@latest vue-iframe-demo --template vue-ts
cd vue-iframe-demo
npm install
```

### 2. 添加 iframe 组件

接下来,我们将创建一个 `IframeComponent` 组件,用于嵌入 `iframe`。

创建 `src/components/IframeComponent.vue` 文件:

```vue
<template>
  <div class="iframe-container">
    <iframe ref="iframe" :src="src" :style="iframeStyle"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "IframeComponent",
  props: {
    src: {
      type: String,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const iframe = ref<HTMLIFrameElement | null>(null);

    const iframeStyle = computed(() => ({
      width: props.fullscreen ? "100vw" : "600px",
      height: props.fullscreen ? "100vh" : "400px",
      border: "none",
    }));

    onMounted(() => {
      if (iframe.value) {
        iframe.value.addEventListener("load", () => {
          console.log("Iframe loaded");
        });
      }
    });

    return {
      iframe,
      iframeStyle,
    };
  },
});
</script>

<style scoped>
.iframe-container {
  position: relative;
  overflow: hidden;
}
</style>
```

### 3. 实现父子通信

为了实现父组件和 `iframe` 之间的通信,我们将使用 `postMessage` API。

创建 `src/components/ParentComponent.vue` 文件:

```vue
<template>
  <div class="parent-container">
    <h1>父组件</h1>
    <button @click="sendMessage">向Iframe发送消息</button>
    <button @click="toggleFullscreen">切换全屏</button>
    <IframeComponent
      ref="iframeComponent"
      :src="iframeSrc"
      :fullscreen="isFullscreen"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import IframeComponent from "./IframeComponent.vue";

export default defineComponent({
  name: "ParentComponent",
  components: {
    IframeComponent,
  },
  setup() {
    const iframeComponent = ref(null);
    const iframeSrc = "https://example.com";
    const isFullscreen = ref(false);

    const sendMessage = () => {
      const iframeWindow = iframeComponent.value.$refs.iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage("来自父组件的问候", "*");
      }
    };

    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
    };

    return {
      iframeComponent,
      iframeSrc,
      isFullscreen,
      sendMessage,
      toggleFullscreen,
    };
  },
});
</script>

<style scoped>
.parent-container {
  padding: 20px;
}

button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
```

### 4. iframe 接收消息

在 `iframe` 加载的页面中,我们需要添加代码来监听来自父页面的消息。

创建 `public/iframe.html` 文件:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Iframe页面</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #f0f0f0;
      }
      .message-container {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="message-container">
      <h1>Iframe页面</h1>
      <p id="message">等待消息...</p>
    </div>
    <script>
      window.addEventListener("message", (event) => {
        console.log("收到来自父页面的消息:", event.data);
        document.getElementById(
          "message"
        ).textContent = `收到消息: ${event.data}`;
      });
    </script>
  </body>
</html>
```

### 5. 使用组件

最后,在 `App.vue` 中使用我们创建的 `ParentComponent`:

```vue
<template>
  <div id="app">
    <ParentComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ParentComponent from "./components/ParentComponent.vue";

export default defineComponent({
  name: "App",
  components: {
    ParentComponent,
  },
});
</script>
```

### 6. iframe 内置弹框全屏问题解决方案

1. iframe 宽高设置全屏,背景透明,border 设为 0,position 设置为 absolute top,left 设为 0
2. 内嵌的 html 页面添加 padding 限制实际展示大小（具体值可由父级传到子级）
3. 内嵌页面 bodypadding
4. 监听内嵌页面的鼠标移动事件,和父级鼠标移动事件,判断鼠标位置确定用户操作范围,动态修改 iframe 范围外的其他元素层级,以便鼠标点击

## 总结

通过以上步骤,我们成功地在 Vue3 + TypeScript 项目中实现了:

1. 嵌入 iframe
2. 父组件与 iframe 之间的通信
3. iframe 的弹框全屏切换功能

`postMessage` API 为我们提供了强大的跨域通信能力,但在实际应用中,请务必注意对消息来源进行验证,以确保通信安全。

本文介绍的方法为 iframe 的集成和通信提供了一个基础框架,你可以根据实际需求进行进一步的定制和扩展。

## 参考资料

- [Vue 3 官方文档](https://v3.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [MDN Web Docs: postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
