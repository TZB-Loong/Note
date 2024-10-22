# 解决 Pinia 数据持久化超过浏览器存储配额问题的方案总结及示例

## 前言

在现代前端开发中，状态管理库如 Vuex 和 Pinia 被广泛使用。Pinia 是 Vue 3 的新一代状态管理库，它提供了更简洁和高效的 API。然而，当我们需要将 Pinia 的数据持久化到浏览器存储（如 LocalStorage 或 IndexedDB）时，可能会遇到存储配额不足的问题。本文将总结几种解决 Pinia 数据持久化超过浏览器存储配额问题的方法，并提供相应的示例代码。

## 为什么需要数据持久化？

数据持久化可以确保应用在刷新或关闭后仍能保留用户的状态和数据，从而提升用户体验。常见的持久化方式包括 LocalStorage、SessionStorage 和 IndexedDB。

## 浏览器存储配额概述

不同浏览器对存储配额的限制有所不同：

- **LocalStorage** 和 **SessionStorage**：每个域名通常限制在 5MB 左右。
- **IndexedDB**：配额较大，但具体大小取决于浏览器和设备，一般在几十 MB 到几百 MB 不等。

当存储数据超过配额时，浏览器会抛出 `QuotaExceededError` 异常。因此，我们需要合理管理存储空间，以避免存储失败的问题。

## 方法一：压缩数据

通过压缩数据，可以有效减少存储空间占用。常用的压缩算法有 LZString 等。

### 示例代码

```javascript
import { defineStore } from "pinia";
import LZString from "lz-string";

export const useStore = defineStore("main", {
  state: () => ({
    data: {},
  }),
  actions: {
    saveData(key, value) {
      const compressedValue = LZString.compress(JSON.stringify(value));
      localStorage.setItem(key, compressedValue);
    },
    loadData(key) {
      const compressedValue = localStorage.getItem(key);
      if (compressedValue) {
        this.data = JSON.parse(LZString.decompress(compressedValue));
      }
    },
  },
});

// 示例使用
const store = useStore();
store.saveData("myData", { name: "John Doe", age: 30 });
store.loadData("myData");
console.log(store.data);
```

## 方法二：分片存储

对于大数据，可以将其拆分成多个小片段分别存储，从而绕过单个键值对的存储限制。

### 示例代码

```javascript
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    data: {},
  }),
  actions: {
    saveChunkedData(key, value, chunkSize = 1024) {
      const jsonString = JSON.stringify(value);
      const chunks = [];
      for (let i = 0; i < jsonString.length; i += chunkSize) {
        chunks.push(jsonString.slice(i, i + chunkSize));
      }
      localStorage.setItem(`${key}_length`, chunks.length);
      chunks.forEach((chunk, index) => {
        localStorage.setItem(`${key}_${index}`, chunk);
      });
    },
    loadChunkedData(key) {
      const length = parseInt(localStorage.getItem(`${key}_length`), 10);
      if (!length) return;

      let jsonString = "";
      for (let i = 0; i < length; i++) {
        jsonString += localStorage.getItem(`${key}_${i}`);
      }
      this.data = JSON.parse(jsonString);
    },
  },
});

// 示例使用
const store = useStore();
store.saveChunkedData("largeData", {
  /* 大量数据 */
});
store.loadChunkedData("largeData");
console.log(store.data);
```

## 方法三：清理旧数据

定期清理不再需要的旧数据，可以释放存储空间，避免超过配额。

### 示例代码

```javascript
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    data: {},
  }),
  actions: {
    saveDataWithTimestamp(key, value) {
      const item = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    loadData(key) {
      const item = localStorage.getItem(key);
      if (item) {
        this.data = JSON.parse(item).value;
      }
    },
    clearOldItems(expirationTime) {
      const now = Date.now();
      Object.keys(localStorage).forEach((key) => {
        const item = localStorage.getItem(key);
        try {
          const parsedItem = JSON.parse(item);
          if (
            parsedItem.timestamp &&
            now - parsedItem.timestamp > expirationTime
          ) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // 忽略解析错误
        }
      });
    },
  },
});

// 示例使用
const store = useStore();
store.saveDataWithTimestamp("data1", { name: "John Doe" });
store.clearOldItems(7 * 24 * 60 * 60 * 1000); // 清理一周前的数据
store.loadData("data1");
console.log(store.data);
```

## 方法四：使用 IndexedDB

如果 LocalStorage 的配额不足，可以考虑使用 IndexedDB，它提供了更大的存储空间。

### 示例代码

```javascript
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    data: {},
  }),
  actions: {
    async openDatabase(dbName, storeName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        };
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    },
    async setIndexedDBItem(db, storeName, value) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add({ value });
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    },
    async getIndexedDBItem(db, storeName, id) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    },
  },
});

// 示例使用
(async () => {
  const store = useStore();
  const db = await store.openDatabase("myDatabase", "myStore");
  await store.setIndexedDBItem(db, "myStore", { name: "John Doe" });
  const item = await store.getIndexedDBItem(db, "myStore", 1);
  console.log(item);
})();
```

## 方法五：使用第三方存储服务

对于一些需要大量存储空间的应用，可以考虑使用第三方存储服务，如 Firebase、AWS S3 等。这些服务提供了更大的存储空间和更高的可靠性。

### 示例代码（Firebase）

```javascript
import { defineStore } from "pinia";
import firebase from "firebase/app";
import "firebase/firestore";

// 初始化 Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export const useStore = defineStore("main", {
  state: () => ({
    data: {},
  }),
  actions: {
    async setFirestoreItem(collection, docId, value) {
      await db.collection(collection).doc(docId).set(value);
    },
    async getFirestoreItem(collection, docId) {
      const doc = await db.collection(collection).doc(docId).get();
      if (doc.exists) {
        this.data = doc.data();
      } else {
        this.data = null;
      }
    },
  },
});

// 示例使用
(async () => {
  const store = useStore();
  await store.setFirestoreItem("users", "user1", { name: "John Doe" });
  await store.getFirestoreItem("users", "user1");
  console.log(store.data);
})();
```
