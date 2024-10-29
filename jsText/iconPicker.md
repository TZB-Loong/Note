<!--
 * @Author: long
 * @Date: 2024-10-22 16:56:38
 * @LastEditors: long
 * @LastEditTime: 2024-10-23 19:27:42
 * @Description:
-->

# Vue 3 + TypeScript 实现 Ant Design Vue 图标选择器

## 前言

在 Vue 3 项目中，我们经常需要使用图标选择器来让用户选择合适的图标。本文将介绍如何使用 Vue 3、TypeScript 和 Ant Design Vue 来实现一个简单而实用的图标选择器组件。

## 技术栈

- Vue 3
- TypeScript
- Ant Design Vue
- @ant-design/icons-vue

## 实现步骤

### 1. 安装依赖

首先，确保你已经安装了必要的依赖：

```bash
npm install vue@next @vue/compiler-sfc ant-design-vue @ant-design/icons-vue
```

### 2. 创建 IconSelector 组件

我们将创建一个新的 Vue 组件 `IconSelector.vue`，并使用 `<script lang="ts" setup>` 语法。

```vue
<template>
  <a-select
    v-model:value="selectedIcon"
    placeholder="请选择一个图标"
    style="width: 200px;"
    @change="handleChange"
  >
    <a-select-option v-for="icon in iconList" :key="icon" :value="icon">
      <component :is="getIconComponent(icon)" />
      {{ icon }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import * as Icons from "@ant-design/icons-vue";

const props = defineProps<{ selectedIcon: string | null }>();
const emit = defineEmits<{ (e: "update:selectedIcon", value: string): void }>();

const selectedIcon = ref<string | null>(props.selectedIcon);
const iconList = Object.keys(Icons);

function getIconComponent(iconName: string) {
  return Icons[iconName as keyof typeof Icons];
}

function handleChange(value: string) {
  selectedIcon.value = value;
  emit("update:selectedIcon", value); 
}
</script>

<style scoped>
/* 添加一些样式以更好地展示图标 */
.a-select-option {
  display: flex;
  align-items: center;
}
.a-select-option component {
  margin-right: 8px;
}
</style>
```

### 3. 在 App.vue 中使用 IconSelector 组件

接下来，我们在 `App.vue` 中使用这个 `IconSelector` 组件。

```vue
<template>
  <div id="app">
    <h1>图标选择器示例</h1>
    <IconSelector v-model:selectedIcon="selectedIcon" />
    <div v-if="selectedIcon" class="selected-icon-display">
      <component :is="getIconComponent(selectedIcon)" />
      <span>{{ selectedIcon }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import IconSelector from "./components/IconSelector.vue";
import * as Icons from "@ant-design/icons-vue";

const selectedIcon = ref<string | null>(null);

function getIconComponent(iconName: string) {
  return Icons[iconName as keyof typeof Icons];
}
</script>

<style>
.selected-icon-display {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.selected-icon-display component {
  margin-right: 8px;
}
</style>
```

## 核心代码讲解

1. **IconSelector 组件**:

   - 使用 `a-select` 组件作为基础，遍历所有可用的图标。
   - 通过 `getIconComponent` 函数动态渲染每个图标。
   - 使用 `v-model:selectedIcon` 实现双向绑定。

2. **App.vue**:
   - 引入并使用 `IconSelector` 组件。
   - 展示选中的图标及其名称。

## 参考资料

- [Vue 3 文档](https://v3.vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/docs/vue/introduce-cn/)
- [@ant-design/icons-vue 文档](https://github.com/ant-design/ant-design-icons/tree/master/packages/icons-vue)
