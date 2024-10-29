# Vue 3 + TypeScript 定时器函数封装最佳实践

## 引言

在前端开发中，定时器的使用不仅仅是简单的 `setTimeout` 和 `setInterval`。一个优秀的定时器封装需要考虑内存泄漏、性能优化、错误处理等多个方面。本文将介绍如何在 Vue 3 和 TypeScript 环境下进行更完善的定时器封装。

## 基础知识

在开始之前，我们需要了解以下几个概念：

1. **setTimeout**: 延迟执行一次
2. **setInterval**: 按照固定时间间隔重复执行
3. **clearTimeout/clearInterval**: 清除定时器
4. **Vue 3 组件生命周期**: 特别是 `onUnmounted` 钩子

## 定时器函数封装

### 完善的类型定义

```typescript
// 定义定时器选项接口
interface TimerOptions {
  immediate?: boolean; // 是否立即执行
  immediateCallback?: boolean; // 是否立即执行回调
  errorHandler?: (e: Error) => void; // 错误处理函数
}

// 定义返回值接口
interface TimerControls {
  clear: () => void; // 清除定时器
  pause: () => void; // 暂停定时器
  resume: () => void; // 恢复定时器
}

// 定义定时器状态接口
interface TimerStatus {
  isRunning: boolean;
  isPaused: boolean;
  count: number;
}
```

### 增强版 `setTimeout` 封装

```typescript
import { ref, onUnmounted } from 'vue';

export function useTimeoutFn<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 0,
  options: TimerOptions = {},
  ...args: Parameters<T>
): TimerControls {
  let timerId: number | null = null;
  let stopped = false;

  const {
    immediate = false,
    immediateCallback = false,
    errorHandler = console.error,
  } = options;

  const status = ref<TimerStatus>({
    isRunning: false,
    isPaused: false,
    count: 0
  });

  const doTimeout = (): void => {
    try {
      status.value.isRunning = true;
      status.value.isPaused = false;
      
      timerId = window.setTimeout(() => {
        if (stopped) return;
        status.value.count++;
        callback(...args);
      }, delay);
    } catch (e) {
      errorHandler(e as Error);
    }
  };

  if (immediate && immediateCallback) {
    try {
      callback(...args);
    } catch (e) {
      errorHandler(e as Error);
    }
  }

  if (immediate) {
    doTimeout();
  }

  const clear = (): void => {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }
    status.value.isRunning = false;
    status.value.isPaused = false;
    status.value.count = 0;
  };

  const pause = (): void => {
    stopped = true;
    status.value.isPaused = true;
    clear();
  };

  const resume = (): void => {
    if (!status.value.isPaused) return;
    stopped = false;
    doTimeout();
  };

  onUnmounted(() => {
    clear();
  });

  return {
    clear,
    pause,
    resume,
  };
}
```

### 增强版 `setInterval` 封装

```typescript
export function useIntervalFn<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 1000,
  options: TimerOptions = {},
  ...args: Parameters<T>
): TimerControls {
  let timerId: number | null = null;
  let stopped = false;

  const {
    immediate = false,
    immediateCallback = false,
    errorHandler = console.error,
  } = options;

  const status = ref<TimerStatus>({
    isRunning: false,
    isPaused: false,
    count: 0
  });

  const doInterval = (): void => {
    try {
      status.value.isRunning = true;
      status.value.isPaused = false;
      
      timerId = window.setInterval(() => {
        if (stopped) return;
        status.value.count++;
        callback(...args);
      }, interval);
    } catch (e) {
      errorHandler(e as Error);
    }
  };

  if (immediate && immediateCallback) {
    try {
      callback(...args);
    } catch (e) {
      errorHandler(e as Error);
    }
  }

  if (immediate) {
    doInterval();
  }

  const clear = (): void => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
    status.value.isRunning = false;
    status.value.isPaused = false;
    status.value.count = 0;
  };

  const pause = (): void => {
    stopped = true;
    status.value.isPaused = true;
    clear();
  };

  const resume = (): void => {
    if (!status.value.isPaused) return;
    stopped = false;
    doInterval();
  };

  onUnmounted(() => {
    clear();
  });

  return {
    clear,
    pause,
    resume,
  };
}
```

### 实际应用示例

```vue
<template>
  <div class="timer-demo">
    <p>倒计时：{{ formatTime(time) }}</p>
    <div class="controls">
      <button @click="startCountdown" :disabled="isRunning">开始</button>
      <button @click="pauseCountdown" :disabled="!isRunning">暂停</button>
      <button @click="resumeCountdown" :disabled="isRunning">继续</button>
      <button @click="resetCountdown">重置</button>
    </div>
    <div class="status">
      <p>执行次数: {{ status.count }}</p>
      <p>状态: {{ status.isRunning ? '运行中' : (status.isPaused ? '已暂停' : '已停止') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useTimeoutFn } from './useTimeoutFn';

const time = ref(60);
const isRunning = ref(false);
let timerControls: TimerControls | null = null;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const startCountdown = () => {
  if (isRunning.value) return;
  
  time.value = 60;
  isRunning.value = true;
  
  timerControls = useTimeoutFn(
    () => {
      time.value--;
      if (time.value > 0) {
        startCountdown();
      } else {
        isRunning.value = false;
      }
    },
    1000,
    {
      immediate: true,
      errorHandler: (e) => {
        console.error('倒计时出错：', e);
        isRunning.value = false;
      }
    }
  );
};

const pauseCountdown = () => {
  timerControls?.pause();
  isRunning.value = false;
};

const resumeCountdown = () => {
  timerControls?.resume();
  isRunning.value = true;
};

const resetCountdown = () => {
  timerControls?.clear();
  time.value = 60;
  isRunning.value = false;
};
</script>

<style scoped>
.timer-demo {
  text-align: center;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.status {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## 性能优化建议

1. **防抖和节流**
   - 对于高频率触发的定时器，建议结合防抖或节流使用
   - 可以使用 `lodash` 的 `debounce` 和 `throttle` 函数

2. **清理机制**
   - 确保在组件卸载时清理所有定时器
   - 使用 `onUnmounted` 生命周期钩子自动清理
   - 提供手动清理方法

3. **内存管理**
   - 避免在定时器回调中创建大量对象
   - 及时清理不再使用的定时器
   - 避免闭包导致的内存泄漏

4. **时间间隔**
   - 合理设置时间间隔，避免过于频繁的执行
   - 考虑使用 `requestAnimationFrame` 代替短间隔的定时器

## 最佳实践

1. **类型安全**
   - 始终使用 TypeScript 类型定义
   - 为回调函数和参数提供正确的类型注解
   - 使用泛型增强类型推导

2. **错误处理**
   - 实现全局错误处理机制
   - 提供自定义错误处理选项
   - 记录错误日志

3. **状态管理**
   - 提供暂停/恢复功能
   - 维护定时器运行状态
   - 支持立即执行选项

4. **代码组织**
   - 使用 setup 语法糖提高代码可读性
   - 将定时器逻辑封装为可复用的组合式函数
   - 遵循单一职责原则

5. **生命周期管理**
   - 在组件卸载时自动清理
   - 提供手动控制方法
   - 避免内存泄漏

## 常见问题与解决方案

1. **定时器不准确问题**
   - 使用 `performance.now()` 进行时间补偿
   - 考虑使用 Web Workers 处理耗时任务

2. **内存泄漏**
   - 确保清理所有定时器实例
   - 避免循环引用
   - 使用 WeakMap/WeakSet 存储引用

3. **性能问题**
   - 使用 `requestAnimationFrame` 优化动画
   - 实现节流和防抖
   - 避免嵌套定时器

## 总结

通过以上优化，我们的定时器封装不仅类型安全，还具备了错误处理、状态控制等高级特性。这样的封装更适合在实际项目中使用，能够有效提高代码质量和可维护性。主要特点包括：

1. 完整的 TypeScript 类型支持
2. 可靠的错误处理机制
3. 灵活的状态控制
4. 优秀的性能表现
5. 友好的开发体验

希望这篇文章能帮助你在 Vue 3 项目中更好地使用定时器功能。

## 参考资料

1. [Vue 3 文档](https://v3.vuejs.org/)
2. [TypeScript 文档](https://www.typescriptlang.org/)
3. [MDN - setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
4. [MDN - setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)