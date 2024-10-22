/*
 * @Author: long
 * @Date: 2024-10-22 15:28:18
 * @LastEditors: long
 * @LastEditTime: 2024-10-22 22:29:06
 * @Description:
 */
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/Note/",
  title: "我的开发笔记",
  description: "一个记录前端开发经验的VitePress站点",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "开发杂记", link: "/jsText/vuedraggable" },
    ],

    sidebar: [
      {
        text: "开发杂记",
        items: [
          { text: "Vue拖拽实现", link: "/jsText/vuedraggable" },
          { text: "HTML转图片", link: "/jsText/html2canvas" },
          { text: "高性能表格组件", link: "/jsText/vxe-table" },
          { text: "UniApp缓存清理", link: "/jsText/uniappclear" },
          { text: "日志模块封装", link: "/jsText/logger" },
          { text: "浏览器存储配额问题解决", link: "/jsText/local" },
          { text: "Pinia持久化与存储配额", link: "/jsText/piniaLocal" },
          { text: "自定义图标选择器", link: "/jsText/iconPicker" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://tzb-loong.github.io/Note/" },
    ],
    search: {
      provider: "local",
    },
    footer: {
      message: '使用 VitePress 构建',
      copyright: 'Copyright © 2024-present Long'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
  },
  lastUpdated: true,
});
