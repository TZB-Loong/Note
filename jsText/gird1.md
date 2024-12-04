## css3 gird 布局 3 行式布局

### 三行均分当前容器高度

```vue
<template>
  <div class="grid">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>  
  </div>
</template>
<style>
.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr; // 一列
  /* grid-template-columns: repeat(3, 1fr);  // 三列均分当前容器宽度 */
  grid-template-rows: repeat(3, 1fr); // 三行均分当前容器高度
  grid-gap: 10px; // 网格间距
}
</style>
```

### 一行固定两行均分剩下的高度

```vue
<template>
  <div class="grid">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
  </div>
</template>
<style>
.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr; // 一列
  grid-template-rows: 50px 1fr 1fr; // 两行，第一行高度为 50px，第二行自适应
  grid-gap: 10px; // 网格间距
</style>
```

### 首行固定 第二行设置最大最小值 最后一行自适应剩余高度

```vue
<template>
  <div class="grid">
    <div class="grid-item">1</div>
    <div class="grid-item2">2</div>
    <div class="grid-item">3</div>
  </div>
</template>
<style>
.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr; // 一列
  grid-template-rows: 50px auto 1fr; // 两行，第一行高度为 50px，第二行高度最小为 100px，最大为剩余高度
  grid-gap: 10px; // 网格间距
}
.grid-item2 {
  min-height: 100px;
  max-height: 400px;
}
</style>
```
