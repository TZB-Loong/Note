## Vue3 + TypeScript + Vite 动态路由

### 1. 引言

前端项目中，动态路由是一个重要的概念。通过动态路由，我们可以根据用户的权限和需求，在运行时动态地添加、删除和修改路由。本文将介绍如何在 Vue3 + TypeScript + Vite 中实现动态路由。

### 2. 环境准备

确保你已经安装了以下工具：

- Node.js
- Vue CLI
- Vite

### 3. 路由配置

#### 3.1 `route/index.ts`

```ts
import { createRouter, createWebHashHistory } from "vue-router";
import publicRoutes from "./public";
import { getLocal } from "@/utils/localStorage";
import { PublicStore } from "@/store/public";
import { findUserMenuAuthority } from "@/api/login";
import { getAsyncMenu } from "@/utils/utils";
import { RouteTool } from "@/utils/routeTools";

const routes = [...publicRoutes];
let router: any = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_HIMS_BASE_PATH),
  routes,
});

// 即时获取
let token = getLocal("token");

window.addEventListener("setItemEvent", function (e: any) {
  if (e.key === "token") {
    token = e.newValue;
  }
});

window.addEventListener("removeItemEvent", function (e: any) {
  if (e.key === "token") {
    token = e.newValue;
  }
});

const RouteEnt = new RouteTool();
const whitelist = []; // 免登录白名单
router.beforeEach(async (to: any, from: any, next: any) => {
  const publicDataStore = PublicStore();

  let routers = publicDataStore.getMenu();

  if (!(routers && routers.length)) {
    let { data } = await findUserMenuAuthority(); // 获取路由数据
    publicDataStore.setMenu(data);
  }

  // 动态加载路由
  if (!RouteEnt.hasRoute(to, router)) {
    await RouteEnt.addRoute(router, routers, "Layout");
  }

  if (whitelist.some((item) => to.path.includes(item))) {
    next();
    return;
  }

  // 登录拦截
  if (!token) {
    next("/login");
    return;
  }

  next();
});

export default router;
```

#### 3.2 `routeTools.ts`

```ts
export class RouteTool {
  constructor() {}

  /**
   * @description: 重组路由
   * @param {any} val
   * @return {*}
   */
  recombination(val: any) {
    const res = [];
    val.forEach((item: any) => {
      const paramPattern = /[?&]([^=#]+)=([^&#]*)/g;
      const queryParams = {};
      let match;
      while ((match = paramPattern.exec(item.path))) {
        const [, key, value] = match;
        queryParams[key] = decodeURIComponent(value);
      }
      let str = "";

      res.push({
        ...item,
        path: `${item.path?.split("?")[0]}${str}`,
        children:
          item.children && item.children.length
            ? this.recombination(item.children)
            : item.children,
      });
    });
    return res;
  }

  /**
   * @description: 判断路由是否存在
   * @param {any} to
   * @return {*}
   */
  hasRoute(to: any, router: any): boolean {
    let find = router
      .getRoutes()
      .find((item) => item.path.split("?")[0] === to.path.split("?")[0]);
    return !!find;
  }

  /**
   * @description: 添加路由
   * @return {*}
   */
  addRoute(router: any, menu: any, routerKey: string): any {
    menu = this.recombination(menu);
    return new Promise((resolve, reject) => {
      menu.map((item: any) => {
        if (!this.hasRoute(item, router)) {
          router.addRoute(routerKey, item);
        }
        return false;
      });
      resolve("OK");
    });
  }
}
```

#### 3.3 `utils.ts`

```ts
export const getAsyncMenu = (routes) => {
  const res = [];
  routes.forEach((item) => {
    let newItem = {
      path: item.uri || "/",
      name: item.uri,
      parentId: item.parentId,
      key: item.uri || item.id + "" + (item.menuName || item.name),
      componentName: item.componentName,
      component: modules[`../views${item.componentName}`],
      meta: {
        title: item.menuName || item.name,
        icon: "",
        id: item.id || item.meta.id,
        alone: false,
        hidden: false,
        btnPermissions: ["admin", "visitor"],
      },
    };
    if (item.children && item.children.length > 0) {
      newItem.children = getAsyncMenu(item.children);
    }
    res.push(newItem);
  });
  return res;
};
```

### 4. 参考资料

- [Vue Router 官方文档](https://router.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vite 官方文档](https://vitejs.dev/)
