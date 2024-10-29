# IndexedDB：前端本地存储的强大武器

## 引言

随着前端应用日益复杂，对本地存储的需求也在不断增长。传统的 `localStorage` 和 `sessionStorage` 由于存储空间有限且只能存储字符串，已经难以满足现代应用的需求。在这种背景下，IndexedDB 作为 HTML5 提供的强大本地存储解决方案，凭借其出色的性能和灵活性，成为了前端开发者的新宠。

## IndexedDB 的优势

相比传统的本地存储机制，IndexedDB 具有以下显著优势：

1. **存储容量大**：通常不少于 250MB，远超 `localStorage` 的 5MB 限制。
2. **支持多种数据类型**：可存储字符串、二进制数据（如 `ArrayBuffer` 和 `Blob` 对象）等。
3. **键值对存储**：每条数据都有唯一的主键。
4. **异步操作**：不会阻塞浏览器，提高用户体验。
5. **事务支持**：确保数据一致性。
6. **同源策略**：保证数据安全。

## IndexedDB 的应用场景

IndexedDB 特别适合以下场景：

- **离线应用**：缓存数据实现离线访问。
- **大型数据集处理**：如图像编辑器或本地数据库。
- **性能优化**：存储静态数据，减少服务器请求。

## IndexedDB 的基本使用

使用 IndexedDB 涉及几个核心概念：数据库、对象仓库、索引、事务和游标。以下是基本使用步骤：

### 1. 打开数据库

```javascript
var request = window.indexedDB.open("TestDB", 1);
request.onsuccess = function (event) {
  var db = event.target.result;
  // 数据库操作
};
```

### 2. 创建/升级数据库

```javascript
request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("person", { keyPath: "id" });
  objectStore.createIndex("name", "name", { unique: false });
};
```

### 3. 数据操作

```javascript
var transaction = db.transaction(["person"], "readwrite");
var objectStore = transaction.objectStore("person");
var request = objectStore.add({ id: 1, name: "John Doe" });
request.onsuccess = function (event) {
  console.log("数据添加成功");
};
```

### 4. 查询数据

```javascript
var objectStore = transaction.objectStore("person");
var index = objectStore.index("name");
var request = index.get("John Doe");
request.onsuccess = function (event) {
  var data = event.target.result;
  if (data) {
    console.log(data);
  }
};
```

### 5. 关闭数据库连接

```javascript
transaction.oncomplete = function (event) {
  db.close();
};
```

## Vue3 + TypeScript 中的 IndexedDB Hooks

为了在 Vue3 和 TypeScript 项目中更方便地使用 IndexedDB，我们可以封装一个自定义 hook：

```ts
import { ref } from "vue";
import { isJson } from "@/utils/is";
// 定义一个数据项接口，包含 id 和 data 两个属性
interface DataItem {
  id: string;
  data: any;
}

/**
 * 使用 IndexedDB 的自定义 hook
 *
 * @param {string} dbName - 数据库名称
 * @param {string} storeName - 对象仓库名称
 * @returns {Object} - 包含操作 IndexedDB 方法的对象
 */
export default function useIndexedDB(dbName: string, storeName: string) {
  // 使用 Vue 的 ref 创建一个响应式引用，用于存储数据库实例
  const db = ref<IDBDatabase | null>(null);
  /**
   * 异步打开 IndexedDB 数据库
   *
   * @param {string} dbName - 数据库名称
   * @param {string} storeName - 对象仓库名称
   * @returns {Promise<IDBDatabase>} - 当数据库打开成功时解析为数据库实例的 Promise
   */
  async function openDB(
    dbName: string,
    storeName: string
  ): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onerror = () => reject("Failed to open database");
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(storeName, { keyPath: "id" });
      };
    });
  }
  /**
   * 根据指定的模式获取 IndexedDB 中的对象仓库
   *
   * @param {IDBTransactionMode} mode - 事务模式，默认为 'readonly'
   * @returns {IDBObjectStore} - 返回对应的对象仓库
   */
  function getStore(mode: IDBTransactionMode = "readonly"): IDBObjectStore {
    const tx = db.value!.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }
  /**
   * 将数据项保存到 IndexedDB 中
   *
   * @param {DataItem} data - 要保存的数据项
   * @returns {Promise<string>} - 当数据保存成功时解析为保存结果的 Promise
   */
  async function putDb(data: DataItem): Promise<string> {
    if (!db.value) {
      db.value = await openDB(dbName, storeName);
    }
    const store = getStore("readwrite");
    return new Promise((resolve, reject) => {
      const request: any = store.put(data);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject("Failed to put data");
    });
  }
  /**
   * 从 IndexedDB 中获取指定 ID 的数据项
   *
   * @param {string} id - 要获取的数据项的 ID
   * @returns {Promise<DataItem | undefined>} - 当数据获取成功时解析为数据项的 Promise，未找到时返回 undefined
   */
  async function getDb(id: string): Promise<DataItem | undefined> {
    if (!db.value) {
      db.value = await openDB(dbName, storeName);
    }
    const store = getStore();
    return new Promise((resolve, reject) => {
      const request: any = store.get(id);
      request.onsuccess = () => {
        if (request.result && isJson(request.result)) {
          request.result = JSON.parse(request.result);
        }
        resolve(request.result as DataItem | undefined);
      };
      request.onerror = () => reject("Failed to get data");
    });
  }
  /**
   * 从 IndexedDB 中删除指定 ID 的数据项
   *
   * @param {string} id - 要删除的数据项的 ID
   * @returns {Promise<string>} - 当数据删除成功时解析为删除结果的 Promise
   */
  async function removeDb(id: string): Promise<string> {
    if (!db.value) {
      db.value = await openDB(dbName, storeName);
    }
    const store = getStore("readwrite");
    return new Promise((resolve, reject) => {
      const request: any = store.delete(id);
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject("Failed to delete data");
    });
  }
  // 返回包含操作数据库方法的对象
  return { putDb, getDb, removeDb };
}
```

> 注意：IndexedDB 的数据可以与 同源iframe 子应用和微前端应用共享，无需特殊处理。

## 总结

IndexedDB 作为前端强大的本地存储解决方案，为处理大量数据提供了高效和灵活的方式。它的大容量存储、异步操作和事务支持等特性，使其成为构建离线应用、处理大型数据集和优化应用性能的理想选择。随着现代浏览器对 IndexedDB 的广泛支持，它已成为前端开发中不可或缺的工具之一。

## 参考资料

- [MDN Web Docs: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [使用 IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [Vue 3 组合式 API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
