# Vue3 + TS 实现可视化拖拽编辑器(低代码平台)

## 前言

在当前前端开发中,低代码平台已成为一个无法忽视的热门话题。本文将介绍如何利用 Vue3、TypeScript、Ant Design Vue、vuedraggable 和 vue3-resize-drag 等技术,实现一个功能丰富的前端可视化拖拽编辑器。

主要功能包括:

- 组件拖拽排序
- 跨区域拖拽
- 组件嵌套
- 自由拖拽定位
- 组件间交互
- 数据共享
- 事件脚本编写
- 事件流程构建
- 数据获取等

## 技术栈

- Vue 3.2.37
- TypeScript
- Ant Design Vue 3.3.0-beta.2
- vuedraggable 4.1.0
- vue3-resize-drag 0.3.0

## 实现思路

1. 使用 Vue3 动态组件机制,根据 JSON 配置动态渲染页面组件
2. 左侧组件列表拖拽到中间画布,实现组件添加
3. 画布内组件拖拽排序、嵌套、自由定位等
4. 右侧属性面板配置组件属性
5. 事件系统处理组件交互
6. Pinia 管理全局状态,实现数据共享

## 核心实现

### 1. 组件开发

每个组件包含 3 个文件:

- index.vue: 组件渲染主体
- config.ts: 组件属性、样式、分组等配置
- index.ts: 组件导出入口

以按钮组件为例:

```vue
<!-- index.vue -->
<template>
  <div
    :style="component.style"
    v-on="componentEvents"
    v-bind="component.config"
  >
    按钮组件
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  component: any; // 组件配置信息
  sort?: any; // 是否编辑模式
  componentEvents: any; // 组件事件
}>();
</script>
```

```ts
// config.ts
export const componentName = "btn";
export const group = "functionality";

class BtnComponent {
  icon = "";
  component = componentName;
  name = "按钮";
  children = [];
  config = [];
  style = [];
  events = [];
}

export default BtnComponent;
```

```ts
// index.ts
import BtnComponent, { componentName, group } from "./config";

export default {
  componentName,
  group,
  component: () => import("./index.vue"),
  config: BtnComponent,
};
```

### 2. 拖拽实现

使用 vuedraggable 实现拖拽功能:

```vue
<template>
  <VueDraggable
    :model-value="components"
    :group="{ name: 'canvas' }"
    @update:model-value="draggableUpdate"
    @add="componentsAdd"
    @end="moveItem"
    @remove="removeItem"
  >
    <!-- 组件列表渲染 -->
  </VueDraggable>
</template>

<script setup>
import { VueDraggable } from "vue-draggable-plus";

// 拖拽相关逻辑
</script>
```

### 3. 自由拖拽

使用 vue3-resize-drag 实现组件自由拖拽:

```vue
<template>
  <VueDragResize
    :isActive="isActive"
    :x="itemStyle.x"
    :y="itemStyle.y"
    @dragstop="onDragstop"
  >
    <slot name="dragResize" :item="component"></slot>
  </VueDragResize>
</template>

<script setup>
import VueDragResize from "vue-drag-resize";

// 自由拖拽逻辑
</script>
```

### 4. 事件处理

使用自定义 hook 处理组件事件:

```ts
// useEvents.ts
import { webPageStore } from "@/store/webPage";
import { PublicStore } from "@/store/public";
import { computed, ref } from "vue";
import {
  getItem,
  replaceItem,
  executeJS,
  recombinationStr,
  jsonToObject,
  removeObjectProperty,
} from "@/utils/utils";
import { sendRequest } from "@/api/trends";
import { message } from "ant-design-vue";
import { showDialog, showConfirmDialog } from "vant";
import { useRouter } from "vue-router";
import useIndexedDB from "@/utils/useIndexedDb";
const { getDb } = useIndexedDB("myDatabase", "publicStore");

export const useEvents = (component: any) => {
  let data = component.events?.componentEvent;
  const webPage: any = webPageStore();
  const publicData: any = PublicStore();
  const $router: any = useRouter();
  if (!data) {
    return {};
  }
  const componentList: any = computed({
    get() {
      return webPage.canvasComponents;
    },
    set(val: any) {
      webPage.updateComponents(val);
    },
  });

  const pageGlobalData: any = computed({
    get() {
      let globalData = webPage.pageGlobalData;
      if (component.parentData) {
        globalData = {
          ...globalData,
          parentData: component.parentData,
        };
      }
      return globalData;
    },
    async set(val: any) {
      await webPage.updatePageGlobalData(val);
    },
  });

  const createFunctionArray = (data: any) => {
    let child: any = jsonToObject(data);
    const funArray: any[] = [];
    const commonActions: any = {
      /**
       * 根据配置跳转到指定页面
       * @param {Object} eventParams - 事件参数对象
       * @returns {Promise<void>} - 跳转操作的 Promise
       */
      jump: async (eventParams: any = {}) => {
        const urlData = recombinationStr(child, {
          ...pageGlobalData.value,
          eventParams,
        });
        if (child.type === "inside") {
          $router.push({ path: urlData.href, query: urlData.params });
        } else if (child.type === "external") {
          window.open(urlData.href, child.newWindow ? "_blank" : "_self");
        }
      },

      // 其他公共函数...
    };

    if (commonActions[child.key]) {
      funArray.push(commonActions[child.key]);
    }
    return funArray;
  };

  // 优化类型定义
  interface EventFunction {
    (eventParams?: any): Promise<void>;
  }

  const initEvents = (
    funData: Record<string, any[]>
  ): Record<string, EventFunction> => {
    const events: Record<string, EventFunction> = {};
    Object.keys(funData).forEach((item: any, i: any) => {
      const funArray = (funData[item] || []).map(createFunctionArray).flat();
      events[item] = async (eventParams) => {
        for (const func of funArray) {
          try {
            await func(eventParams);
          } catch (error) {
            console.error("Error executing function:", error);
            publicData.updateLoading(false);
            break; // 考虑是否需要 break，或者继续执行其他函数
          }
        }
      };
    });

    return events;
  };

  return { events: initEvents(data) };
};
```

### 5. 数据共享

使用 Pinia 进行全局状态管理:

```ts
// store/webPage.ts
export const webPageStore = defineStore("webPage", {
  state: () => ({
    pageGlobalData: {},
    canvasComponents: [],
  }),
  actions: {
    updatePageGlobalData(data) {
      this.pageGlobalData = { ...this.pageGlobalData, ...data };
    },
    updateComponents(components) {
      this.canvasComponents = components;
    },
  },
});
```

## 总结

通过 Vue3 + TS 技术栈,结合多个优秀的开源组件,我们实现了一个功能丰富的可视化拖拽编辑器。这为快速开发低代码平台提供了很好的技术参考。

当然,要打造一个完整的低代码平台还有很长的路要走。希望本文能为大家提供一些思路和启发。欢迎在评论区讨论交流!

## 参考资料

- [Vue 3 文档](https://v3.vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next)
- [vue3-resize-drag](https://github.com/kirillmurashov/vue-drag-resize)
