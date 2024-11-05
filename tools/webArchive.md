<!--
 * @Author: long
 * @Date: 2024-11-05 19:21:21
 * @LastEditors: long
 * @LastEditTime: 2024-11-05 19:22:30
 * @Description: 
-->
# Web Archive - 基于 Cloudflare 的免费网页归档与分享工具

## 简介

Web Archive 是一个基于 Cloudflare Worker 开发的开源网页归档与分享工具，提供浏览器插件、服务器及网页客户端三部分功能，旨在为用户提供高效的网页存档服务。支持文件夹分类、页面预览图、标题关键字查询等高级功能，用户还可以分享自己抓取的页面，并适配移动端设备。

## 功能特点

- **网页存档服务**：允许用户访问互联网上过去的网页版本，了解特定网页在某个时间点的内容和布局。
- **文件夹分类**：用户可以对存档的网页进行分类，便于管理和检索。
- **页面预览图**：提供页面预览图功能，用户可以快速查看网页存档的概览。
- **标题关键字查询**：支持通过标题关键字查询存档网页，提高查找效率。
- **橱窗分享**：用户可以分享自己抓取的页面，实现内容共享。
- **移动端适配**：确保在不同设备上提供良好的用户体验。

## 部署与使用

Web Archive 的部署需要一定的技术背景，包括 Node 环境的安装和命令行操作。以下是基本的部署步骤：

1. **下载代码**：在 release 页面下载最新的 service.zip，解压后在根目录执行后续操作。
2. **创建 r2 存储桶**：
   ```bash
   npx wrangler r2 bucket create web-archive
   ```
   成功后将显示创建的存储桶信息。
3. **创建 d1 数据库**：
   ```bash
   npx wrangler d1 create web-archive
   ```
   执行后将输出数据库相关信息，并需替换 `wrangler.toml` 文件中的 `database_id` 值。
4. **执行初始化 SQL**：
   ```bash
   npx wrangler d1 execute web-archive --remote --file=./init.sql
   ```
   成功后将初始化数据库。
5. **修改 BEARER_TOKEN**：BEARER_TOKEN 是访问 Web Archive 的凭证，相当于密码，需要在 `wrangler.toml` 文件中修改其值。
6. **部署服务**：
   ```bash
   npx wrangler pages deploy
   ```
   完成服务的部署。

## 项目地址

Web Archive 的项目地址为：[https://github.com/Ray-D-Song/web-archive](https://github.com/Ray-D-Song/web-archive)。感兴趣的开发者可以访问该地址了解更多详情和源代码。

通过 Web Archive，用户可以轻松存档和分享网页内容，同时为研究人员和历史学家提供宝贵资源，用于研究和分析互联网上的历史事件和趋势。
