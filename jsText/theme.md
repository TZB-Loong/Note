Vue3 主题切换

Vue3 是一个现代的 JavaScript 框架，用于构建用户界面。主题切换功能在现代 web 应用中越来越受欢迎，因为它可以增强用户体验，使应用更具个性化。本文将介绍如何在 Vue3 项目中实现主题切换功能，并提供一些示例代码。

安装和设置

首先，你需要确保已经安装了 Vue CLI。如果没有安装，可以通过以下命令进行安装：

```bash
npm install -g @vue/cli

```

然后，创建一个新的 Vue3 项目：

```bash

vue create my-vue-app
cd my-vue-app
```

创建主题

在 Vue3 项目中，我们可以使用 CSS 变量来定义主题。CSS 变量是一种强大的工具，可以让我们在运行时动态地更改样式。

首先，在项目的 `src` 目录下创建一个名为 `themes.js` 的文件，用于定义不同的主题：

```javascript
// src/themes.js
export const lightTheme = {
  "--background-color": "#ffffff",
  "--text-color": "#000000",
  "--primary-color": "#007bff",
};

export const darkTheme = {
  "--background-color": "#343a40",

  "--text-color": "#ffffff",
  "--primary-color": "#007bff",
};
```

然后，在 `src/main.js` 文件中引入这些主题：

```javascript
// src/main.js
import { lightTheme, darkTheme } from "./themes";
import App from "./App.vue";
import { createApp } from "vue"; // 添加此行以确保 createApp 被导入

const app = createApp(App);

app.mixin({
  methods: {
    applyTheme(theme) {
      for (let key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
      }
    },
  },
});

app.mount("#app");

// 初始应用主题

app.applyTheme(lightTheme);
```

动态切换主题

为了实现主题切换功能，我们需要在组件中添加一个切换按钮，并在按钮点击时调用 `applyTheme` 方法。

首先，在 `src/App.vue` 文件中添加一个切换按钮：

```vue
<!-- src/App.vue -->

<template>
  <div>
    <button @click="toggleTheme">切换主题</button>
    <!-- 修改按钮文本为中文 -->
  </div>
</template>

<script>
import { lightTheme, darkTheme } from "./themes"; // 添加此行以确保主题被导入

export default {
  data() {
    return {
      isDarkTheme: false,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;

      this.$root.applyTheme(this.isDarkTheme ? darkTheme : lightTheme);
    },
  },
};
</script>

<style>
/* 全局样式 */

body {
  background-color: var(--background-color);

  color: var(--text-color);
}
button {
  background-color: var(--primary-color);

  color: #ffffff;
}
</style>
```

示例代码

完整的示例代码如下：

```javascript
// src/main.js
import { createApp } from "vue";
import App from "./App.vue";

import { lightTheme, darkTheme } from "./themes";

const app = createApp(App);

app.mixin({
  methods: {
    applyTheme(theme) {
      for (let key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
      }
    },
  },
});

app.mount("#app");

// 初始应用主题

app.applyTheme(lightTheme);
```

```vue
<!-- src/App.vue -->

<template>
  <div>
    <button @click="toggleTheme">切换主题</button>
    <!-- 修改按钮文本为中文 -->
  </div>
</template>

<script>
import { lightTheme, darkTheme } from "./themes"; // 添加此行以确保主题被导入

export default {
  data() {
    return {
      isDarkTheme: false,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;

      this.$root.applyTheme(this.isDarkTheme ? darkTheme : lightTheme);
    },
  },
};
</script>

<style>
/* 全局样式 */
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
button {
  background-color: var(--primary-color);

  color: #ffffff;
}
</style>
```
