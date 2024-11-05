# Pinia 持久化存储在 Vue3 + TypeScript 中的最佳实践

### 1. 安装 Pinia 和 Pinia 持久化插件

在 Vue3 + TypeScript 项目中，首先需要安装 Pinia 和 Pinia 持久化插件 `pinia-plugin-persist`。

```bash
npm install pinia
npm install pinia-plugin-persist
```

### 2. 配置 Pinia

在 `main.ts` 中配置 Pinia，并使用持久化插件。

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersist);
app.use(pinia);
app.mount("#app");
```

### 3. 定义 Pinia Store

使用 `defineStore` 定义一个 Pinia store，并开启持久化。

```typescript
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
  persist: {
    enabled: true,
  },
});
```

### 4. 在组件中使用 Pinia Store

在 Vue 组件中使用定义好的 Pinia store。

```vue
<template>
  <div>
    <button @click="increment">Count is: {{ count }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMainStore } from "./stores/main";

export default defineComponent({
  setup() {
    const store = useMainStore();
    return {
      count: store.count,
      increment: store.increment,
    };
  },
});
</script>
```

### 5. 持久化配置

可以在 `persist` 配置中自定义持久化的行为，例如指定存储的 key 值、修改存储形式、选择性存储对应字段等。

```typescript
persist: {
  enabled: true,
  strategies: [
    {
      key: 'my-store',
      storage: localStorage,
      paths: ['count'], // 只持久化 count 状态
    },
  ],
}
```

### 6. 高级持久化配置示例

```typescript
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    age: 0,
  }),
  persist: {
    enabled: true,
    key: "user",
    storage: localStorage,
    paths: ["name"], // 只持久化 name 状态
  },
});
```
