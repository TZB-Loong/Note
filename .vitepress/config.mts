/*
 * @Author: long
 * @Date: 2024-10-22 15:28:18
 * @LastEditors: long
 * @LastEditTime: 2024-11-15 09:23:17
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
          { text: "Vue3 + TS 实现 iframe 嵌入与通信", link: "/jsText/iframe" },
          {
            text: "Vue3 + TS 实现可视化拖拽编辑器(低代码平台)",
            link: "/jsText/vuedaraggableCom",
          },
          {
            text: "IndexedDB：前端本地存储的强大武器",
            link: "/jsText/indexedDb",
          },
          {
            text: "Vue 3 中自动添加 CSS 前缀的最佳实践",
            link: "/jsText/cssTarget",
          },
          {
            text: "Vue3 + Vite + TypeScript 代理配置",
            link: "/jsText/proxy",
          },
          {
            text: "可视化看板画布的缩放方案实践指南",
            link: "/jsText/transform",
          },
          {
            text: "Vue 3 + TypeScript 中 Vue-i18n Hooks 的最佳实践",
            link: "/jsText/i18n",
          },
          {
            text: "Pinia 持久化存储在 Vue3 + TypeScript 中的最佳实践",
            link: "/jsText/pinia",
          },
          {
            text: " sn-e-scankit 强大的uni-app扫码插件",
            link: "/jsText/scankit",
          },
          {
            text: "HBuilderX 连接 MuMu 模拟器",
            link: "/jsText/mumu",
          },
          {
            text: "Vue3 + TypeScript + Axios 文件下载的Hooks封装及使用",
            link: "/jsText/download",
          },
          {
            text: "JSP",
            link: "/jsText/jsp",
          },
          {
            text: "动态使用 KeepAlive 组件的实现指南",
            link: "/jsText/keepAlive",
          },
          {
            text: "Vue3 + TypeScript 接入 UnoCSS 及常用原子类",
            link: "/jsText/unocss",
          },
          {
            text: "Vue3 + TypeScript 避免上传同名文件不触发上传文件窗口问题解决方案",
            link: "/jsText/upload",
          },
          {
            text: "http-server 使用指南",
            link: "/jsText/http-server",
          },
          {
            text: "Vue3 主题切换",
            link: "/jsText/theme",
          },
          {
            text: "Vue3 多主题预览插件",
            link: "/jsText/mupTheme",
          },
          {
            text: "Vue3 + TypeScript 中 Axios 的封装",
            link: "/jsText/axios",
          },
        ],
      },
      {
        text: "工具",
        items: [
          {
            text: "一键屏蔽搜索结果中的 AI 内容",
            link: "/tools/uBlackList",
          },
          {
            text: "JavSP：专业的 AV 元数据一键刮削工具",
            link: "/tools/javsp",
          },
          {
            text: "Cookie-share：一款开源的跨设备 Cookies 共享插件",
            link: "/tools/cookieShare",
          },
          {
            text: "MoonDream 使用指南",
            link: "/tools/MoonDream",
          },
          {
            text: "Bookmarks Artist - 一个高颜值的浏览器书签查看工具",
            link: "/tools/bookmarks",
          },
          {
            text: "Web Archive - 基于 Cloudflare 的免费网页归档与分享工具",
            link: "/tools/webArchive",
          },
          {
            text: "NewsNow - 一个开源的实时热门新闻程序",
            link: "/tools/news",
          },
          {
            text: "MediaGo",
            link: "/tools/mediaGo",
          },
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
      message: "使用 VitePress 构建",
      copyright: "Copyright © 2024-present Long",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
  },
  lastUpdated: true,
  // 添加自定义主题配置
  // @ts-ignore
  theme: {
    // 自定义CSS变量
    vars: {
      // 示例：修改主色调
      "c-brand": "#3eaf7c",
      // 示例：修改字体
      "font-family-base": '"Microsoft YaHei", sans-serif',
    },
    // 自定义CSS
    css: {
      // 示例：添加全局样式
      ".vp-doc a": {
        "text-decoration": "none",
        "border-bottom": "1px solid var(--c-brand)",
      },
    },
  },
});
