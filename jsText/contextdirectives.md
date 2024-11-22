## 右键弹出菜单指令封装

## 指令挂载

    main.ts

```ts
    ...
    import { createApp, App as AppInstance } from 'vue'
    import App from './App.vue'
    import Directive from '@/directives'
    const app = createApp(App)
    app.use(Directive)

    ...
```

## 指令注册

/directives/index.ts

```ts
import type { App } from "vue";
import ContextMenu from "./contextmenu";
export default {
  install(app: App) {
    app.directive("contextmenu", ContextMenu);
  },
};
```

/directives/contextmenu/ContextMenu.vue

```vue
<template>
  <div
    class="mask"
    @contextmenu.prevent="removeContextmenu()"
    @mousedown="removeContextmenu()"
  ></div>
  <div
    class="contextmenu"
    :style="{
      left: style.left + 'px',
      top: style.top + 'px',
    }"
    @contextmenu.prevent
  >
    <MenuContent :menus="menus" :handleClickMenuItem="handleClickMenuItem" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ContextmenuItem, Axis } from "./types";

import MenuContent from "./MenuContent.vue";

const props = defineProps<{
  axis: Axis;
  el: HTMLElement;
  menus: ContextmenuItem[];
  removeContextmenu: Function;
}>();

const style = computed(() => {
  const MENU_WIDTH = 170;
  const MENU_HEIGHT = 30;
  const DIVIDER_HEIGHT = 11;
  const PADDING = 5;

  const { x, y } = props.axis;
  const menuCount = props.menus.filter(
    (menu) => !(menu.divider || menu.hide)
  ).length;
  const dividerCount = props.menus.filter((menu) => menu.divider).length;

  const menuWidth = MENU_WIDTH;
  const menuHeight =
    menuCount * MENU_HEIGHT + dividerCount * DIVIDER_HEIGHT + PADDING * 2;

  const screenWidth = document.body.clientWidth;
  const screenHeight = document.body.clientHeight;

  return {
    left: screenWidth <= x + menuWidth ? x - menuWidth : x,
    top: screenHeight <= y + menuHeight ? y - menuHeight : y,
  };
});

const handleClickMenuItem = (item: ContextmenuItem, event: MouseEvent) => {
  if (item.disable) return;
  if (item.children && !item.handler) return;
  if (item.handler) item.handler(props.el, event);
  props.removeContextmenu();
};
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}
.contextmenu {
  position: fixed;
  z-index: 999999999;
  user-select: none;
}
</style>
```

/directives/contextmenu/MenuContent.vue

```vue
<template>
  <ul class="menu-content">
    <template v-for="(menu, index) in menus" :key="menu.text || index">
      <li
        v-if="!menu.hide"
        class="menu-item"
        :class="{ divider: menu.divider, disable: menu.disable }"
        @click.stop="(event:MouseEvent) => handleClickMenuItem(menu, event)"
      >
        <div
          v-if="!menu.divider"
          class="menu-item-content"
          :class="{
            'has-children': menu.children,
            'has-handler': menu.handler,
          }"
        >
          <span class="text">{{ menu.text }}</span>
          <span v-if="menu.subText && !menu.children" class="sub-text">{{
            menu.subText
          }}</span>

          <menu-content
            v-if="menu.children && menu.children.length"
            class="sub-menu"
            :menus="menu.children"
            :handleClickMenuItem="handleClickMenuItem"
          />
        </div>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import type { ContextmenuItem } from "./types";

defineProps<{
  menus: Array<ContextmenuItem>;
  handleClickMenuItem: Function;
}>();
</script>

<style lang="less" scoped>
@menuWidth: 170px;
@menuHeight: 30px;
@subMenuWidth: 120px;
@borderColor: #eee;
@boxShadow: 3px 3px 3px rgba(#000, 0.15);
@transitionDelayFast: 0.1s;
@themeColor: #d14424;
@transitionDelay: 0.2s;
.menu-content {
  width: @menuWidth;
  padding: 5px 0;
  background: #fff;
  border: 1px solid @borderColor;
  box-shadow: @boxShadow;
  border-radius: 2px;
  list-style: none;
  margin: 0;
}
.menu-item {
  padding: 0 20px;
  color: #555;
  font-size: 12px;
  transition: all @transitionDelayFast;
  white-space: nowrap;
  height: @menuHeight;
  line-height: @menuHeight;
  background-color: #fff;
  cursor: pointer;

  &:not(.disable):hover > .menu-item-content > .sub-menu {
    display: block;
  }

  &:not(.disable):hover > .has-children.has-handler::after {
    transform: scale(1);
  }

  &:hover:not(.disable) {
    background-color: #e7e7e7;
  }

  &.divider {
    height: 1px;
    overflow: hidden;
    margin: 5px;
    background-color: #e5e5e5;
    line-height: 0;
    padding: 0;
  }

  &.disable {
    color: #b1b1b1;
    cursor: no-drop;
  }
}
.menu-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &.has-children::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-width: 1px;
    border-style: solid;
    border-color: #666 #666 transparent transparent;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }
  &.has-children.has-handler::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 24px;
    background-color: #f1f1f1;
    position: absolute;
    right: 18px;
    top: 3px;
    transform: scale(0);
    transition: transform @transitionDelay;
  }

  .sub-text {
    opacity: 0.6;
  }
  .sub-menu {
    width: @subMenuWidth;
    position: absolute;
    display: none;
    left: 112%;
    top: -6px;
  }
}
</style>
```

/directives/contextmenu/index.ts

```ts
import type { Directive, DirectiveBinding } from "vue";
import { createVNode, render } from "vue";
import ContextmenuComponent from "./ContextMenu.vue";

const CTX_CONTEXTMENU_HANDLER = "CTX_CONTEXTMENU_HANDLER";

const contextmenuListener = (
  el: HTMLElement,
  event: MouseEvent,
  binding: DirectiveBinding
) => {
  event.preventDefault();
  const { stop } = binding.modifiers;
  if (stop) {
    event.stopPropagation();
  }

  const menus = binding.value(el, event);
  if (!menus) return;

  let container: HTMLDivElement | null = null;

  // 移除右键菜单并取消相关的事件监听
  const removeContextmenu = () => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
    el.classList.remove("contextmenu-active");
    document.body.removeEventListener("scroll", removeContextmenu);
    window.removeEventListener("resize", removeContextmenu);
  };

  // 创建自定义菜单
  const options = {
    axis: { x: event.x, y: event.y + 15 },
    el,
    menus,
    removeContextmenu,
  };
  container = document.createElement("div");
  const vm = createVNode(ContextmenuComponent, options, null);
  render(vm, container);
  document.body.appendChild(container);

  // 为目标节点添加菜单激活状态的className
  el.classList.add("contextmenu-active");

  // 页面变化时移除菜单
  document.body.addEventListener("scroll", removeContextmenu);
  window.addEventListener("resize", removeContextmenu);
};

const ContextmenuDirective: Directive = {
  mounted(el: any, binding) {
    const { capture } = binding.modifiers;
    el[CTX_CONTEXTMENU_HANDLER] = (event: MouseEvent) =>
      contextmenuListener(el, event, binding);
    el.addEventListener("contextmenu", el[CTX_CONTEXTMENU_HANDLER], capture);
  },

  unmounted(el: any) {
    if (el && el[CTX_CONTEXTMENU_HANDLER]) {
      el.removeEventListener("contextmenu", el[CTX_CONTEXTMENU_HANDLER]);
      delete el[CTX_CONTEXTMENU_HANDLER];
    }
  },
};

export default ContextmenuDirective;
```
