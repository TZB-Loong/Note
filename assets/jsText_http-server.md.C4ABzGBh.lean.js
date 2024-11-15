import{_ as e,c as s,a2 as d,o as a}from"./chunks/framework.C0utc8P3.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"jsText/http-server.md","filePath":"jsText/http-server.md","lastUpdated":1731495914000}'),i={name:"jsText/http-server.md"};function p(o,t,c,h,r,n){return a(),s("div",null,t[0]||(t[0]=[d('<p>http-server 使用指南</p><p><code>http-server</code> 是一个简单且强大的基于 Node.js 的命令行 HTTP 服务器。它非常适合用于前端开发中的本地测试和开发。本文将详细介绍 <code>http-server</code> 的安装、使用方法以及常用命令。</p><p>安装</p><p>首先，你需要确保已经安装了 Node.js。然后可以通过 npm 来全局安装 <code>http-server</code>：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> http-server</span></span></code></pre></div><p>使用方法</p><p>安装完成后，你可以通过以下命令启动服务器：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http-server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [path] [options]</span></span></code></pre></div><p>其中 <code>[path]</code> 是你想要作为服务器根目录的路径，默认是当前目录。<code>[options]</code> 是一些可选的配置参数。</p><p>常用命令和选项</p><p>以下是 <code>http-server</code> 的一些常用命令和选项：</p><table tabindex="0"><thead><tr><th>命令/选项</th><th>描述</th></tr></thead><tbody><tr><td><code>http-server</code></td><td>启动服务器，默认监听 8080 端口。</td></tr><tr><td><code>-p</code> 或 <code>--port</code></td><td>指定服务器监听的端口号，默认是 8080。</td></tr><tr><td><code>-a</code> 或 <code>--address</code></td><td>指定服务器绑定的 IP 地址，默认是 <code>0.0.0.0</code>。</td></tr><tr><td><code>-d</code> 或 <code>--show-dir</code></td><td>是否显示目录列表，默认是 <code>true</code>。</td></tr><tr><td><code>-i</code> 或 <code>--auto-index</code></td><td>是否自动索引，默认是 <code>true</code>。</td></tr><tr><td><code>-e</code> 或 <code>--ext</code></td><td>设置默认的文件扩展名，默认是 <code>html</code>。</td></tr><tr><td><code>-s</code> 或 <code>--silent</code></td><td>禁用日志信息输出。</td></tr><tr><td><code>--cors</code></td><td>启用 CORS，通过 <code>Access-Control-Allow-Origin</code> 头部允许跨域请求。</td></tr><tr><td><code>-o</code></td><td>启动服务器后自动在浏览器中打开。</td></tr><tr><td><code>-c</code> 或 <code>--cache</code></td><td>设置缓存时间（秒），默认是 <code>3600</code> 秒。使用 <code>-c-1</code> 可以禁用缓存。</td></tr><tr><td><code>--utc</code></td><td>使用 UTC 时间格式化日志消息。</td></tr><tr><td><code>--proxy</code></td><td>代理所有无法本地解析的请求到指定的 URL。</td></tr></tbody></table><p>示例</p><p>启动服务器并指定端口</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http-server</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 8081</span></span></code></pre></div><p>启动服务器并自动打开浏览器</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http-server</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span></span></code></pre></div><p>启动服务器并禁用缓存</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http-server</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c-1</span></span></code></pre></div><p>启动服务器并启用 CORS</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http-server</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --cors</span></span></code></pre></div><p>结论</p><p><code>http-server</code> 是一个非常方便的工具，特别适合于前端开发中的本地测试和开发。通过本文的介绍，你应该已经掌握了如何安装和使用 <code>http-server</code>，以及如何通过各种选项来定制服务器的行为。希望这些信息对你有所帮助！</p>',23)]))}const g=e(i,[["render",p]]);export{k as __pageData,g as default};
