# NewsNow - 一个开源的实时热门新闻程序

## 概述

NewsNow 是一个开源的实时热门新闻聚合程序，旨在为用户提供一个简洁的界面和流畅的阅读体验，以便随时掌握最新的全球资讯。该程序支持多种部署方式，包括 Cloudflare Pages、Vercel 以及 Docker，同时提供了灵活的配置和数据库支持。

## 功能特点

1. **实时新闻更新**：NewsNow 提供实时更新的热门新闻，让用户能够及时了解全球动态。
2. **优雅界面**：用户界面简洁优雅，提升阅读体验。
3. **灵活部署**：支持 Cloudflare Pages、Vercel 以及 Docker 等多种部署方式。
4. **自定义配置**：用户可以根据需要配置环境变量和数据库，以定制新闻阅读体验。
5. **数据库支持**：支持多种数据库，包括 Cloudflare D1 数据库。
6. **开源项目**：基于 MIT 许可证，用户可以自由使用和修改。

## 使用总结

NewsNow 的主要优势在于其简洁的界面设计和实时新闻更新能力。作为一个开源项目，它允许用户根据自己的需求进行定制和部署。以下是一些关键点：

- **部署简便**：如果不需要登录和缓存功能，可以直接将 NewsNow 部署到 Cloudflare Pages 或 Vercel，只需 Fork 项目后在对应平台上导入即可。
- **登录功能**：登录功能涉及到 GitHub OAuth。创建 GitHub App 后，将获得 Client ID 和 Client Secret，不同平台的环境变量设置位置不同，请参考 `example.env.server` 文件。
- **数据库部署**：推荐使用 Cloudflare Pages 和 Docker 部署。对于 Vercel，需要自行解决数据库问题。支持的数据库可以在 db0 connectors 查看。
- **开源社区**：NewsNow Labs 是 NewsNow 的研发部门，进行自然语言处理、机器学习、基础设施管理和软件开发工具等方面的前沿研究，并公开其研究成果。

## 项目地址

- **项目地址**：[https://github.com/ourongxing/newsnow](https://github.com/ourongxing/newsnow)
- **在线地址**：[https://newsnow.busiyi.world](https://newsnow.busiyi.world)
