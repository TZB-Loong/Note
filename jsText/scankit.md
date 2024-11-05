<!--
 * @Author: long
 * @Date: 2024-11-01 17:19:52
 * @LastEditors: long
 * @LastEditTime: 2024-11-01 17:26:22
 * @Description:
-->

# sn-e-scankit 强大的uni-app扫码插件

## 1. 插件介绍

`sn-e-scankit` 是一个基于华为统一扫码服务（Scan Kit）封装的扩展插件，它在常规扫码场景以及复杂扫码场景（如反光、暗光、污损、小码、大角度等）中都有优异的表现。该插件提供基础的 Default View 模式，支持相机扫码和导入图片扫码，但不支持自定义扫码界面。

## 2. 安装插件

在 uni-app 项目中，你可以通过插件市场直接安装`sn-e-scankit`插件。安装完成后，在你的页面中引入并使用该插件。

## 3. 基本使用

### 3.1 扫码功能

以下是使用`sn-e-scankit`插件进行扫码的基本示例：

```typescript
// 引入插件
import { scan, ScanConfigs, ScanResult } from "@/uni_modules/sn-e-scankit";

// 调用扫码
scan({} as ScanConfigs, (res: ScanResult) => {
  uni.showModal({
    title: "扫码结果",
    content: `格式：${res.format}\n数据：${res.data}`,
  });
});
```

### 3.2 扫码配置

`ScanConfigs` 类型允许你配置扫码的相关参数，例如扫码类型、标题类型和权限请求提示语：

```typescript
export type ScanConfigs = {
  scanTypes?: ScanTypes | null;
  titleType?: titleType | null;
  permTip?: string | null;
};
```

### 3.3 扫码结果

扫码结果`ScanResult`包含了扫描结果的格式和数据：

```typescript
export type ScanResult = {
  format: ScanResultFormat;
  data: string;
};
```

## 4. 兼容性

`sn-e-scankit`插件在 Android 平台上支持，而 Web 平台不支持。

## 5. 进阶使用

### 5.1 生成码图

`sn-e-scankit`还支持将字符串转换为一维码或二维码，支持多种码制式。以下是生成码图的示例：

```vue
<template>
  <sn-e-scankit-code
    data="Hello, world!"
    style="width: 100px;height: 100px;"
  ></sn-e-scankit-code>
</template>
```

### 5.2 属性配置

在生成码图时，你可以配置以下属性：

- `data`: 需要编码的数据
- `type`: 码图类型
- `margin`: 码图边距
- `bgColor`: 码图背景颜色
- `frontColor`: 码图前景颜色
- `qrErrorLevel`: 二维码错误容错级别
- `qrLogo`: 二维码中间的 Logo 图片路径。

## 6. 注意事项

在使用`sn-e-scankit`插件之前，请确保你的应用已经申请了必要的权限，如相机、存储等权限。

在 HBuilderX 的某些版本中，使用 UTS 插件时可能会遇到回调函数重复触发的问题。这种情况通常会导致应用出现内存泄漏或者不必要的性能开销。

#### 对于 HBuilderX 4.25 版本及以后

在 HBuilderX 4.25 版本及以后的版本中，`UTS插件` 导出的方法中的回调函数参数默认触发一次后立即自动回收，以避免内存泄漏。如果你需要回调函数参数支持持续触发，可以按照以下方案进行适配：

1. **方法名称调整**：将方法名称调整为以 `on` 开头，且仅有一个 `callback` 类型的参数。这种方式可以让回调函数持续触发。

   ```javascript
   // 示例：调整方法名称
   onScanResult(callback) {
       // 方法实现
   }
   ```

2. **使用装饰器 `@UTSJS.keepAlive`**：HBuilderX 4.27 版本新增了装饰器 `@UTSJS.keepAlive`，通过这个装饰器声明方法中的回调函数参数一直存活（不自动回收），从而支持回调函数可持续触发回调。

   ```javascript
   // 示例：使用装饰器
   @UTSJS.keepAlive
   export function onScanResult(callback) {
       // 方法实现
   }
   ```

   **注意事项**：

   - 如果使用了 `@UTSJS.keepAlive` 装饰器，则该方法参数里的所有回调都会在内存中持续存在，需要提醒使用者避免频繁调用此方法。
   - 目前装饰器不支持 `export const test: Test = () => {}` 这种导出方式，需要使用 `export function test() {}`。
   - 如果同时存在 `app-android/app-ios`，需要两个平台都同时配置 `@UTSJS.keepAlive`。

#### 其他注意事项

- **避免函数重载**：在 Uni-app 项目 Android 环境中不支持函数重载。如果同时存在两个同名函数，仅参数个数/类型不同，在 Android 环境中会无法正确区分两个函数。临时解决办法是以不同的函数名称来区分函数。
