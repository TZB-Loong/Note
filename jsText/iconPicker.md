<!--
 * @Author: long
 * @Date: 2024-10-22 16:56:38
 * @LastEditors: long
 * @LastEditTime: 2024-10-22 22:24:31
 * @Description: 
-->

### 安装依赖

首先，确保你已经安装了必要的依赖：

```bash
npm install vue@next @vue/compiler-sfc ant-design-vue @ant-design/icons-vue
```

### 创建 `IconSelector.vue` 组件

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

### 使用 `IconSelector` 组件

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
