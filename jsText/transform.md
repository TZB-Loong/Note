# 可视化看板画布的缩放方案实践指南

在开发数据可视化大屏时，画布的缩放适配是一个关键问题。本文将详细介绍几种常用的缩放方案，并进行深入的分析比较。

## 1. 固定尺寸方案

固定尺寸方案将画布锁定为特定尺寸，适合对展示效果要求严格的场景。

**优点：**

- 布局稳定，像素级精确控制
- 实现简单，维护成本低
- 适合固定尺寸的展示设备

**缺点：**

- 在不同尺寸屏幕上可能出现留白
- 小屏幕设备可能需要滚动查看

**代码示例：**

```css
.canvas {
  position: absolute;
  width: 1920px;
  height: 1080px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* 可选：添加最小缩放限制 */
  min-width: 1366px;
  overflow: auto;
}
```

## 2. 自适应宽度方案

此方案保持宽度自适应，高度按比例计算，适合横向展示为主的大屏。

**优点：**

- 充分利用屏幕宽度
- 保持内容横向分布
- 适合数据指标横向排列的场景

**缺点：**

- 垂直方向可能需要滚动
- 超宽屏幕下展示效果可能失真

**代码示例：**

```javascript
const CanvasLayout = {
  setup() {
    const canvasWidth = ref(1920);
    const canvasHeight = ref(1080);
    const canvasStyle = computed(() => {
      const windowWidth = window.innerWidth;
      const ratioWidth = windowWidth / canvasWidth.value;

      return {
        width: `${windowWidth}px`,
        height: `${canvasHeight.value * ratioWidth}px`,
        left: 0,
        top: "50%",
        transform: `translateY(-50%)`,
        position: "absolute",
        transition: "all 0.3s", // 添加过渡效果
      };
    });

    // 监听窗口变化
    onMounted(() => {
      window.addEventListener("resize", () => {
        // 触发重新计算
      });
    });

    return { canvasStyle };
  },
};
```

## 3. 等比例缩放方案（推荐）

这是目前最常用的方案，通过计算缩放比例，保持画布比例不变。

**优点：**

- 完整保持设计稿的视觉效果
- 支持任意尺寸屏幕
- 不会出现滚动条

**缺点：**

- 在极端尺寸下可能有留白
- 缩放后可能影响文字清晰度

**代码示例：**

```javascript
class ScreenAdapter {
  constructor(options = {}) {
    this.designWidth = options.width || 1920;
    this.designHeight = options.height || 1080;
    this.container = options.container || "#screen";
    this.init();
  }

  init() {
    this.setScale();
    window.addEventListener("resize", this.setScale.bind(this));
  }

  setScale() {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const scaleX = windowWidth / this.designWidth;
    const scaleY = windowHeight / this.designHeight;
    const scale = Math.min(scaleX, scaleY);

    const el = document.querySelector(this.container);
    if (!el) return;

    const style = {
      width: `${this.designWidth}px`,
      height: `${this.designHeight}px`,
      transform: `scale(${scale})`,
      transformOrigin: "left top",
      position: "absolute",
      left: `${(windowWidth - this.designWidth * scale) / 2}px`,
      top: `${(windowHeight - this.designHeight * scale) / 2}px`,
    };

    Object.assign(el.style, style);
  }
}

// 使用示例
new ScreenAdapter({
  width: 1920,
  height: 1080,
  container: "#screen",
});
```

## 4. rem 适配方案

适合需要精确控制元素大小的场景，特别是文字缩放。

**优点：**

- 精确控制元素大小
- 文字缩放效果好
- 适合移动端适配

**缺点：**

- 需要在样式中使用 rem 单位
- 计算相对复杂

**代码示例：**

```javascript
class RemAdapter {
  constructor(designWidth = 1920) {
    this.designWidth = designWidth;
    this.maxWidth = 3840; // 最大宽度限制
    this.init();
  }

  init() {
    this.setRem();
    window.addEventListener('resize', this.setRem.bind(this));
  }

  setRem() {
    const width = document.documentElement.clientWidth;
    const scale = Math.min(width, this.maxWidth) / this.designWidth;
    document.documentElement.style.fontSize = `${scale * 100}px`;
  }
}

// 使用示例
new RemAdapter(1920);

// CSS示例
.element {
  width: 19.2rem; // 1920px / 100
  height: 10.8rem; // 1080px / 100
  font-size: 0.16rem; // 16px / 100
}
```

## 实际应用场景建议

1. **监控大屏**

- 推荐：等比例缩放方案
- 原因：需要保持整体视觉效果，且常用于大尺寸显示器

2. **数据分析平台**

- 推荐：自适应宽度方案
- 原因：需要充分利用屏幕空间，内容较多

3. **展示型大屏**

- 推荐：固定尺寸方案
- 原因：对视觉效果要求高，常用于固定尺寸设备

4. **移动端兼容的大屏**

- 推荐：rem 适配方案
- 原因：需要同时适配 PC 和移动设备

## 最佳实践建议

1. **性能优化**

```javascript
// 使用防抖处理resize事件
function debounce(fn, delay = 100) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

window.addEventListener(
  "resize",
  debounce(() => {
    // 执行缩放逻辑
  }, 150)
);
```

2. **兼容性处理**

```javascript
// 检测transform兼容性
function getTransformProperty() {
  const properties = [
    "transform",
    "WebkitTransform",
    "MozTransform",
    "msTransform",
  ];
  const documentStyle = document.documentElement.style;

  for (const property of properties) {
    if (property in documentStyle) return property;
  }
  return null;
}
```

3. **边界处理**

```javascript
// 添加最小最大缩放限制
const scale = Math.min(Math.max(scaleX, minScale), maxScale);
```

## 总结

选择合适的缩放方案需要考虑：

- 项目具体需求
- 目标设备特点
- 性能要求
- 开发维护成本

建议在开发初期进行充分测试，选择最适合的方案。同时要注意：

1. 做好极端情况的处理
2. 注意性能优化
3. 保证跨浏览器兼容性
4. 预留足够的可扩展性
