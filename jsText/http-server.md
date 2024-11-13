<!--
 * @Author: long
 * @Date: 2024-11-12 09:12:12
 * @LastEditors: long
 * @LastEditTime: 2024-11-12 09:33:08
 * @Description: 
-->
http-server 使用指南

`http-server` 是一个简单且强大的基于 Node.js 的命令行 HTTP 服务器。它非常适合用于前端开发中的本地测试和开发。本文将详细介绍 `http-server` 的安装、使用方法以及常用命令。

安装

首先，你需要确保已经安装了 Node.js。然后可以通过 npm 来全局安装 `http-server`：

```bash
npm install -g http-server
```

使用方法

安装完成后，你可以通过以下命令启动服务器：

```bash
http-server [path] [options]
```

其中 `[path]` 是你想要作为服务器根目录的路径，默认是当前目录。`[options]` 是一些可选的配置参数。

常用命令和选项

以下是 `http-server` 的一些常用命令和选项：

| 命令/选项              | 描述                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| `http-server`          | 启动服务器，默认监听 8080 端口。                                 |
| `-p` 或 `--port`       | 指定服务器监听的端口号，默认是 8080。                            |
| `-a` 或 `--address`    | 指定服务器绑定的 IP 地址，默认是 `0.0.0.0`。                     |
| `-d` 或 `--show-dir`   | 是否显示目录列表，默认是 `true`。                                |
| `-i` 或 `--auto-index` | 是否自动索引，默认是 `true`。                                    |
| `-e` 或 `--ext`        | 设置默认的文件扩展名，默认是 `html`。                            |
| `-s` 或 `--silent`     | 禁用日志信息输出。                                               |
| `--cors`               | 启用 CORS，通过 `Access-Control-Allow-Origin` 头部允许跨域请求。 |
| `-o`                   | 启动服务器后自动在浏览器中打开。                                 |
| `-c` 或 `--cache`      | 设置缓存时间（秒），默认是 `3600` 秒。使用 `-c-1` 可以禁用缓存。 |
| `--utc`                | 使用 UTC 时间格式化日志消息。                                    |
| `--proxy`              | 代理所有无法本地解析的请求到指定的 URL。                         |

示例

启动服务器并指定端口

```bash
http-server -p 8081
```

启动服务器并自动打开浏览器

```bash
http-server -o
```

启动服务器并禁用缓存

```bash
http-server -c-1
```

启动服务器并启用 CORS

```bash
http-server --cors
```

结论

`http-server` 是一个非常方便的工具，特别适合于前端开发中的本地测试和开发。通过本文的介绍，你应该已经掌握了如何安装和使用 `http-server`，以及如何通过各种选项来定制服务器的行为。希望这些信息对你有所帮助！
