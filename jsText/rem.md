## 前端适配不同设备尺寸解决办法

### 1. Meta Viewport

Meta Viewport 是 HTML 中 `<meta>` 标签关于 viewport 的相关配置，它用于在移动浏览器中通过 viewport 元标签来控制页面的布局。具体来说，Meta Viewport 的使用环节主要包括以下几个方面：

- 设置页面的宽度：通过设置 viewport 的宽度（`width=device-width`），可以使不同手机的布局视口宽度尽量接近可视窗口的值。这样可以确保页面在不同设备上以相同的比例显示，提供更好的用户体验。
- 控制页面的缩放：通过设置 `initial-scale` 属性，可以指定页面在加载时的缩放级别。同时，通过禁用用户缩放（`user-scalable=no`）可以确保页面在不同设备上保持一致的布局和外观。

示例代码：

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### 2. Media Query

Media Query 是 CSS3 引入的一项功能，可以根据设备的特性（如屏幕宽度、高度、分辨率等）来应用不同的样式。

示例代码：

```css
@media only screen and (max-width: 600px) {
  .container {
    flex-direction: column;
  }
}
```

### 3. 流式布局

流式布局是指页面元素的宽度采用相对单位（如百分比），使得元素能够根据屏幕宽度自动调整大小。

示例代码：

```css
.container {
  width: 100%;
}
```

### 4. Rem 单位

Rem（font size of the root element）是 CSS3 新增的一个相对单位，是指相对于根元素的字体大小的单位。

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no"
    />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .box {
        width: 10rem;
        height: 4rem;
        background-color: antiquewhite;
        font-size: 0.53rem; /* 20px*/
      }
    </style>
    <script>
      function setRootRem() {
        const root = document.documentElement;
        const scale = root.clientWidth / 10;
        root.style.fontSize = scale + "px";
      }
      setRootRem();
      window.addEventListener("resize", setRootRem);
    </script>
  </head>
  <body>
    <div class="box">前端南玖</div>
  </body>
</html>
```

### 5. Vw/Vh 单位

Vw（Viewport Width）和 Vh（Viewport Height）是视口单位，分别表示视口宽度的 1% 和视口高度的 1%。这些单位非常适合用于响应式设计，因为它们直接基于视口大小。

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vw/vh单位示例</title>
    <style>
      .box {
        width: 80vw; /* 宽度占视口宽度的80% */
        height: 50vh; /* 高度占视口高度的50% */
        background-color: lightgrey;
      }
    </style>
  </head>
  <body>
    <div class="box"></div>
  </body>
</html>
```
