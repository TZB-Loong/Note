# uni-app 混合式开发指南：APP、小程序一键多平台部署

## 引言

Uni-app 是一个基于 Vue.js 的跨平台框架，允许开发者编写一套代码，发布到 iOS、Android、Web 以及各种小程序（微信、支付宝、百度、头条、QQ、钉钉等）平台。

## 1. 环境准备

在开始开发之前，我们需要准备好开发环境。Uni-app 使用 HBuilderX 作为官方推荐的开发工具。

### 安装 HBuilderX

你可以从 [官网下载并安装最新版本的 HBuilderX](https://www.dcloud.io/hbuilderx.html)。

### 安装 Node.js

Uni-app 需要 Node.js 环境，你可以从 [官网下载并安装最新版本的 Node.js](https://nodejs.org/)。

## 2. 创建 Uni-app 项目

安装好开发工具后，我们可以开始创建 Uni-app 项目。

### 使用 HBuilderX 创建项目

1. 打开 HBuilderX，点击菜单栏的 `File` -> `New` -> `Project`。
2. 在弹出的窗口中选择 `Uni-app Project`，然后点击 `Next`。
3. 输入项目名称和项目路径，然后点击 `Finish`。

### 初始化项目

创建好项目后，我们需要初始化项目，安装必要的依赖。

```bash
npm install
```

## 3. 项目结构介绍

Uni-app 项目的结构如下：

```
your-project/
├── common/          # 公共模块
├── components/      # 组件
├── pages/           # 页面
│   ├── index/       # 首页
│   │   ├── index.vue # 首页视图
│   │   └── index.js   # 首页逻辑
├── static/          # 静态资源
├── utils/           # 工具函数
├── manifest.json    # 应用配置
└── main.js           # 入口文件
```

## 4. h5+app

使用 uni-app 打包成安卓或者 iOS，具体业务使用 h5 项目进行开发，利用 webview 进行安卓与 h5 之间的通信，以便调用安卓的 API 或者 iOS 的 API。

- uni-app 负责安卓 APK 的开发并提供调用设备功能的一些 API。
- h5 负责开发业务逻辑，使用 uni-app 提供的 API 进行调用安卓或者 iOS 的 API。

## 5. uni-app webview 部分

```html
<template>
  <web-view
    id="web-view"
    class="uni-flex-item"
    :src="src"
    :webview-styles="webview_styles"
    :horizontalScrollBarAccess="horizontalScrollBarAccess"
    :verticalScrollBarAccess="verticalScrollBarAccess"
    @message="message"
    @error="error"
    @loading="loading"
    @load="load"
    @download="download"
    @touchstart="touchstart"
    @tap="tap"
  >
  </web-view>
</template>
<script>
  import { useHandleMessage } from "@/utssdk/useHandleMessage";
  export default {
    data() {
      return {
        webview_styles: { progress: { color: "#00FF00" } },
        verticalScrollBarAccess: false,
        horizontalScrollBarAccess: false,
        src: "http://192.168.110.224:9989",
        webviewElement: null,
        webviewContext: null,
      };
    },
    onLoad() {},
    onReady() {
      this.webviewContext = uni.createWebviewContext("web-view", this);
      this.webviewElement = uni.getElementById("web-view");
    },
    methods: {
      load() {},
      loading() {},
      download() {},
      touchstart() {},
      error() {},
      tap() {},
      message: (event) => {
        const res = event.detail.data[0];
        let messageData = useHandleMessage();
        let handleMessage = messageData.get("handleMessage");
        let data = handleMessage(res);
        this.webviewContext?.evalJS(
          `_receiveAndoidData(${JSON.stringify(data)})`
        );
      },
    },
  };
</script>

<style></style>
```

## 安卓 API 封装

```typescript
export function useHandleMessage() {
  return {
    handleMessage: function (e) {
      let key = e.get("key");
      let params = e.get("params");
      let data = {
        success: true,
        result: {},
      };
      switch (key) {
        case "openUrl":
          console.log("other-Page", params);
          break;
        case "camera":
          uni.chooseImage({
            count: 9,
            sizeType: ["sizeType"],
            sourceType: ["album", "camera"],
            success: (res) => {
              data.result = { data: res.tempFilePaths };
            },
          });
          break;
        default:
          break;
      }
      return data;
    },
  };
}
```

## h5 与安卓之间的通信

```html
<!DOCTYPE html>
<html>
  <head>
    <title>H5与安卓通信</title>
  </head>
  <body>
    <script type="text/javascript">
      !(function (e, n) {
        "object" == typeof exports && "undefined" != typeof module
          ? (module.exports = n())
          : "function" == typeof define && define.amd
          ? define(n)
          : ((e = e || self).uni = n());
      })(this, function () {
        "use strict";
        try {
          var e = {};
          Object.defineProperty(e, "passive", {
            get: function () {
              !0;
            },
          }),
            window.addEventListener("test-passive", null, e);
        } catch (e) {}
        var n = Object.prototype.hasOwnProperty;
        function i(e, i) {
          return n.call(e, i);
        }
        var t = [];
        function o() {
          return window.__dcloud_weex_postMessage || window.__dcloud_weex_;
        }
        function a() {
          return window.__uniapp_x_postMessage || window.__uniapp_x_;
        }
        var r = function (e, n) {
            var i = { options: { timestamp: +new Date() }, name: e, arg: n };
            if (a()) {
              if ("postMessage" === e) {
                var r = { data: n };
                return window.__uniapp_x_postMessage
                  ? window.__uniapp_x_postMessage(r)
                  : window.__uniapp_x_.postMessage(JSON.stringify(r));
              }
              var d = {
                type: "WEB_INVOKE_APPSERVICE",
                args: { data: i, webviewIds: t },
              };
              window.__uniapp_x_postMessage
                ? window.__uniapp_x_postMessageToService(d)
                : window.__uniapp_x_.postMessageToService(JSON.stringify(d));
            } else if (o()) {
              if ("postMessage" === e) {
                var s = { data: [n] };
                return window.__dcloud_weex_postMessage
                  ? window.__dcloud_weex_postMessage(s)
                  : window.__dcloud_weex_.postMessage(JSON.stringify(s));
              }
              var w = {
                type: "WEB_INVOKE_APPSERVICE",
                args: { data: i, webviewIds: t },
              };
              window.__dcloud_weex_postMessage
                ? window.__dcloud_weex_postMessageToService(w)
                : window.__dcloud_weex_.postMessageToService(JSON.stringify(w));
            } else {
              if (!window.plus)
                return window.parent.postMessage(
                  { type: "WEB_INVOKE_APPSERVICE", data: i, pageId: "" },
                  "*"
                );
              if (0 === t.length) {
                var u = plus.webview.currentWebview();
                if (!u)
                  throw new Error("plus.webview.currentWebview() is undefined");
                var g = u.parent(),
                  v = "";
                (v = g ? g.id : u.id), t.push(v);
              }
              if (plus.webview.getWebviewById("__uniapp__service"))
                plus.webview.postMessageToUniNView(
                  {
                    type: "WEB_INVOKE_APPSERVICE",
                    args: { data: i, webviewIds: t },
                  },
                  "__uniapp__service"
                );
              else {
                var c = JSON.stringify(i);
                plus.webview
                  .getLaunchWebview()
                  .evalJS(
                    'UniPlusBridge.subscribeHandler("'
                      .concat("WEB_INVOKE_APPSERVICE", '",')
                      .concat(c, ",")
                      .concat(JSON.stringify(t), ");")
                  );
              }
            }
          },
          d = {
            navigateTo: function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                n = e.url;
              r("navigateTo", { url: encodeURI(n) });
            },
            navigateBack: function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                n = e.delta;
              r("navigateBack", { delta: parseInt(n) || 1 });
            },
            switchTab: function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                n = e.url;
              r("switchTab", { url: encodeURI(n) });
            },
            reLaunch: function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                n = e.url;
              r("reLaunch", { url: encodeURI(n) });
            },
            redirectTo: function () {
              var e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                n = e.url;
              r("redirectTo", { url: encodeURI(n) });
            },
            getEnv: function (e) {
              a()
                ? e({ uvue: !0 })
                : o()
                ? e({ nvue: !0 })
                : window.plus
                ? e({ plus: !0 })
                : e({ h5: !0 });
            },
            postMessage: function () {
              var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              r("postMessage", e.data || {});
            },
          },
          s = /uni-app/i.test(navigator.userAgent),
          w = /Html5Plus/i.test(navigator.userAgent),
          u = /complete|loaded|interactive/;
        var g =
          window.my &&
          navigator.userAgent.indexOf(
            ["t", "n", "e", "i", "l", "C", "y", "a", "p", "i", "l", "A"]
              .reverse()
              .join("")
          ) > -1;
        var v =
          window.swan &&
          window.swan.webView &&
          /swan/i.test(navigator.userAgent);
        var c =
          window.qq &&
          window.qq.miniProgram &&
          /QQ/i.test(navigator.userAgent) &&
          /miniProgram/i.test(navigator.userAgent);
        var p =
          window.tt &&
          window.tt.miniProgram &&
          /toutiaomicroapp/i.test(navigator.userAgent);
        var _ =
          window.wx &&
          window.wx.miniProgram &&
          /micromessenger/i.test(navigator.userAgent) &&
          /miniProgram/i.test(navigator.userAgent);
        var m = window.qa && /quickapp/i.test(navigator.userAgent);
        var f =
          window.ks &&
          window.ks.miniProgram &&
          /micromessenger/i.test(navigator.userAgent) &&
          /miniProgram/i.test(navigator.userAgent);
        var l =
          window.tt &&
          window.tt.miniProgram &&
          /Lark|Feishu/i.test(navigator.userAgent);
        var E =
          window.jd &&
          window.jd.miniProgram &&
          /micromessenger/i.test(navigator.userAgent) &&
          /miniProgram/i.test(navigator.userAgent);
        var x =
          window.xhs &&
          window.xhs.miniProgram &&
          /xhsminiapp/i.test(navigator.userAgent);
        for (
          var S,
            h = function () {
              (window.UniAppJSBridge = !0),
                document.dispatchEvent(
                  new CustomEvent("UniAppJSBridgeReady", {
                    bubbles: !0,
                    cancelable: !0,
                  })
                );
            },
            y = [
              function (e) {
                if (s || w)
                  return (
                    window.__uniapp_x_postMessage ||
                    window.__uniapp_x_ ||
                    window.__dcloud_weex_postMessage ||
                    window.__dcloud_weex_
                      ? document.addEventListener("DOMContentLoaded", e)
                      : window.plus && u.test(document.readyState)
                      ? setTimeout(e, 0)
                      : document.addEventListener("plusready", e),
                    d
                  );
              },
              function (e) {
                if (_)
                  return (
                    window.WeixinJSBridge && window.WeixinJSBridge.invoke
                      ? setTimeout(e, 0)
                      : document.addEventListener("WeixinJSBridgeReady", e),
                    window.wx.miniProgram
                  );
              },
              function (e) {
                if (c)
                  return (
                    window.QQJSBridge && window.QQJSBridge.invoke
                      ? setTimeout(e, 0)
                      : document.addEventListener("QQJSBridgeReady", e),
                    window.qq.miniProgram
                  );
              },
              function (e) {
                if (g) {
                  document.addEventListener("DOMContentLoaded", e);
                  var n = window.my;
                  return {
                    navigateTo: n.navigateTo,
                    navigateBack: n.navigateBack,
                    switchTab: n.switchTab,
                    reLaunch: n.reLaunch,
                    redirectTo: n.redirectTo,
                    postMessage: n.postMessage,
                    getEnv: n.getEnv,
                  };
                }
              },
              function (e) {
                if (v)
                  return (
                    document.addEventListener("DOMContentLoaded", e),
                    window.swan.webView
                  );
              },
              function (e) {
                if (p)
                  return (
                    document.addEventListener("DOMContentLoaded", e),
                    window.tt.miniProgram
                  );
              },
              function (e) {
                if (m) {
                  window.QaJSBridge && window.QaJSBridge.invoke
                    ? setTimeout(e, 0)
                    : document.addEventListener("QaJSBridgeReady", e);
                  var n = window.qa;
                  return {
                    navigateTo: n.navigateTo,
                    navigateBack: n.navigateBack,
                    switchTab: n.switchTab,
                    reLaunch: n.reLaunch,
                    redirectTo: n.redirectTo,
                    postMessage: n.postMessage,
                    getEnv: n.getEnv,
                  };
                }
              },
              function (e) {
                if (f)
                  return (
                    window.WeixinJSBridge && window.WeixinJSBridge.invoke
                      ? setTimeout(e, 0)
                      : document.addEventListener("WeixinJSBridgeReady", e),
                    window.ks.miniProgram
                  );
              },
              function (e) {
                if (l)
                  return (
                    document.addEventListener("DOMContentLoaded", e),
                    window.tt.miniProgram
                  );
              },
              function (e) {
                if (E)
                  return (
                    window.JDJSBridgeReady && window.JDJSBridgeReady.invoke
                      ? setTimeout(e, 0)
                      : document.addEventListener("JDJSBridgeReady", e),
                    window.jd.miniProgram
                  );
              },
              function (e) {
                if (x) return window.xhs.miniProgram;
              },
              function (e) {
                return document.addEventListener("DOMContentLoaded", e), d;
              },
            ],
            M = 0;
          M < y.length && !(S = y[M](h));
          M++
        );
        S || (S = {});
        var P = "undefined" != typeof uni ? uni : {};
        if (!P.navigateTo) for (var b in S) i(S, b) && (P[b] = S[b]);
        return (P.webView = S), P;
      });
    </script>
    <script type="text/javascript">
      function getUrlParams(e) {
        if (!e) return "";
        var t = {},
          r = [],
          n = "",
          a = "";
        try {
          var i = [];
          if (
            (e.indexOf("?") >= 0 &&
              (i = e.substring(e.indexOf("?") + 1, e.length).split("&")),
            i.length > 0)
          )
            for (var o in i)
              (n = (r = i[o].split("="))[0]), (a = r[1]), (t[n] = a);
        } catch (s) {
          t = {};
        }
        return t;
      }
      window.localStorage.setItem(
        "android_env",
        JSON.stringify(getUrlParams(window.location.href))
      );
    </script>
  </body>
</html>
```

## 安卓调用安卓 API 统一封装

```typescript
// webView.ts
export const postMessage = async (key = "", params = {}) => {
  const data = await new Promise((resolve) => {
    window._receiveAndoidData = (data) => {
      resolve(data); // 等待 data 的值返回
    };
    // 传递参数到 postMessage
    uni.webView?.postMessage({
      data: {
        key: key,
        params: {
          ...params,
        },
      },
    });
  });
  return data; // 返回 data
};
```

### 调用示例

```typescript
const postInfo = async () => {
  let data = await postMessage("openUrl", {});
  alert(JSON.stringify(data));
};
```

## 结语

自己对前端开发很热爱，平时除了工作，也希望能把技能用在更多地方，如果有合适的机会也很乐意尝试。如果你有任何问题或建议，欢迎在下方留言，我会尽快回复你。感谢你的阅读！
