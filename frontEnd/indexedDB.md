## 简介

### 引入

#### cookie

`Cookie`设计之初只是为了让网站验证用户身份用的。至于`Cookie`的本地存储功能只是它的一个手段而已。`Cookie`虽然可以做前端存储方案,但是却也有着很多局限性.首先它的存储空间大小只有4K,其次它的存储有效时间有限制,然后存在`Cookie`中的数据,在你每次进行请求的时候都会将它带上.使得每次的请求数据都会无意义的增大。

#### web Storage

HTML5中有了真正的前端存储方案`Web Storage`.它分为两种,一种是永久存储的`localStorage`,一种是会话期间存储的`sessionStorage`.对比`Cookie`,`Web Storage`的优势很明显:

1. 存储空间更大,有5M大小
2. 在浏览器发送请求是不会带上`web Storage`里的数据
3. 更加友好的API
4. 可以做永久存储(localStorage).

这一切看起来很完美,但是随着前端的不断发展,`web Storage`也有了一些不太合适的地方:

1. 随着web应用程序的不断发展,5M的存储大小对于一些大型的web应用程序来说有些不够

2. `web Storage`只能存储`string`类型的数据.对于`Object`类型的数据只能先用`JSON.stringify()`转换一下在存储.

  基于上述原因,前端社区又提出了浏览器数据库存储这个概念.而`Web SQL Database`和`indexedDB(索引数据库)`是对这个概念的实现.其中`Web SQL Database`在目前来说基本已经被放弃.所以目前主流的浏览器数据库的实现就是`indexedDB(索引数据库)`.也就是我们要介绍的 **新一代的前端存储方案--indexedDB**

### indexedDB

> indexedDB就是一个基于事务操作的 `key-value` 型的前端数据库.其API大多是异步的

indexedDB 是一种使用浏览器存储大量数据的方法.它创造的数据可以被查询，并且可以离线使用. indexedDB对于那些需要存储大量数据，或者是需要离线使用的程序是非常有效的解决方法。

## 使用

### 创建数据库

浏览器原生提供`indexedDB`对象，作为开发者的操作接口。

```js
const openRequest = window.indexedDB.open('test', 1);
//或者直接
const openRequest = indexedDB.open('test', 1);
```

#### indexedDB.open() 

**功能：**

`indexedDB.open()`方法用于打开数据库。这是一个异步操作，但是会立刻返回一个 `IDBOpenDBRequest` 对象。

**参数：**

- 参数1：数据库名；`open()`会先去查找本地是否已有这个数据库,如果有则直接将这个数据库返回,如果没有,则先创建这个数据库,再返回。
- 参数2：数据库的版本号；是一个可选参数,如果不传,默认为1.但如果传入就必须是一个整数。

**返回值：**

 `IDBOpenDBRequest` 对象。该对象有四个监听函数分别监听四个事件。

- **success**：打开成功。
- **error**：打开失败。
- **upgradeneeded**：第一次打开该数据库，或者数据库版本发生变化。
- **blocked**：上一次的数据库连接还未关闭。

```js
const openRequest = indexedDB.open('test', 1);
const db;

openRequest.onupgradeneeded = () => {
  console.log("新建数据库");
}

openRequest.onsuccess = (e) => {
  console.log('Success!');
  db = openRequest.result;
  // 或者
  // db = e.target.result;
}

openRequest.onerror = (e) => {
  console.log('Error');
  console.log(e);
}
```

从`openRequest.result`属性可以拿到已经打开的`IndexedDB`数据库对象。或者从 `e.target.result` 中获取数据库对象。



### 创建数据仓库（存储空间）

要创建一个对象仓库必须在`upgradeneeded`事件中,而`upgradeneeded`事件只会在版本号更新的时候触发.这是因为`indexedDB API`中不允许数据库中的数据仓库在同一版本中发生变化。所以只能在`onupgradeneeded`回调函数中创建存储空间，而不能在数据库打开后的`success`回调函数中创建。

```js
const openRequest = indexedDB.open('test', 1);

openRequest.onupgradeneeded = (e) => {
  console.log("新建数据库成功");
  const db = e.target.result;
  const store = db.createObjectStore("Users", { keyPath: 'userId', autoIncrement: false });
  console.log('创建对象仓库成功');

}
```

#### createObjectStore()

**功能：**创建一个数据仓库。

**参数：**

- 参数1：数据仓库的名称，在同一数据库中,仓库名不能重复。
- 参数2：可选参数。用于指定数据的主键以及是否自增主键。
  - `keyPath`值为存储对象的某个属性，这个属性能够在获取存储空间数据的时候当做key值使用。主键也可以指定为下一层对象的属性。
  - `autoIncrement`指定了`key`值是否自增（key值为默认的从1开始到2^53的整数时）。当keyPath 有指定值时，`autoIncrement : false`

**返回值：** IDBObjectStore 对象



### 创建事务

#### 事务

> 简单来说事务就是用来保证数据库操作要么全部成功,要么全部失败的一个限制.比如,在修改多条数据时,前面几条已经成功了.,在中间的某一条是失败了.那么在这时,如果是基于事务的数据库操作,那么这时数据库就应该重置前面数据的修改,放弃后面的数据修改.直接返回错误,一条数据也不修改.

一个数据库事务通常包含了一个序列的对数据库的读/写操作。它的存在包含有以下两个目的：

1. 为数据库操作序列提供了一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持一致性的方法。

2. 当多个应用程序在并发访问数据库时，可以在这些应用程序之间提供一个隔离方法，以防止彼此的操作互相干扰。

并非任意的对数据库的操作序列都是数据库事务。数据库事务拥有以下四个特性，习惯上被称之为ACID特性。

- 原子性（Atomicity）：事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行
- 一致性（Consistency）：事务应确保数据库的状态从一个一致状态转变为另一个一致状态。一致状态的含义是数据库中的数据应满足完整性约束
- 隔离性（Isolation）：多个事务并发执行时，一个事务的执行不应影响其他事务的执行
- 持久性（Durability）：已被提交的事务对数据库的修改应该永久保存在数据库中

```js
const openRequest = indexedDB.open('test', 1);

openRequest.onupgradeneeded = (e) => {
  console.log("新建数据库成功");
  const db = e.target.result;
  const store = db.createObjectStore("Users", { keyPath: 'userId', autoIncrement: false });
  console.log('创建对象仓库成功');

}

openRequest.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("Users", 'readwrite');
  console.log("成功");
}
```

#### transaction()

**功能：**创建一个事务。

**参数：**

- 参数1：需要关联的数据仓库
- 参数2：可选参数。创建的事务模式。默认为只读模式
  - `readOnly`，只读。
  - `readwrite`，读写。
  - `versionchange`，数据库版本变化。

**返回值：**IDBTransaction 对象



### 操作数据

add() : 增加数据。接收一个参数，为需要保存到对象仓库中的对象。

put() : 增加或修改数据。接收一个参数，为需要保存到对象仓库中的对象。

get() : 获取数据。接收一个参数，为需要获取数据的主键值。

delete() : 删除数据。接收一个参数，为需要获取数据的主键值。

> add 和 put 的作用类似，区别在于 put 保存数据时，如果该数据的主键在数据库中已经有相同主键的时候，则会修改数据库中对应主键的对象，而使用 add 保存数据，如果该主键已经存在，则保存失败。

这几个方法都返回一个 IDBRequest 对象。

#### 添加数据

```js
const openRequest = indexedDB.open('test', 1);

openRequest.onupgradeneeded = (e) => {
  console.log("新建数据库成功");
  const db = e.target.result;
  const store = db.createObjectStore("Users", { keyPath: 'userId', autoIncrement: false });
  console.log('创建对象仓库成功');

}

openRequest.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("Users", 'readwrite');
  const store = tx.objectStore('Users'); //返回指定名称的对象仓库 IDBObjectStore。
    
  const reqAdd = store.add({ 'userId': 1, 'userName': '张三', 'age': 12 })
  reqAdd.onsuccess = () => {
    console.log("添加数据成功");
  }
  
  console.log("成功");
}
```

**IDBObjectStore.add()**

注：`add`方法中的第二个参数key值是指定存储空间中的`keyPath`(主键)值，如果`data`中包含`keyPath`值或者此值为自增值，那么可以略去此参数。



#### 查找数据

##### 通过特定值获取数据

`IDBObjectStore.get()`用于获取主键对应的数据记录。

```js
//获取数据
const reqGet = store.get(1);
reqGet.onsuccess = () => {
    console.log(reqGet.result); // {userId: 1, userName: "张三", age: 12}
}
```

`IDBObjectStore.getKey()`用于获取主键。

```js
const reqGet = store.getKey(1);
reqGet.onsuccess = () => {
    console.log(reqGet.result); //1
}
```

##### 通过游标获取数据

当你需要遍历整个存储空间中的数据时，你就需要使用到游标。游标使用方法如下：



#### 修改数据

**IDBObjectStore.put(item, key)**

**功能：**用于更新某个主键对应的数据记录，如果对应的键值不存在，则插入一条新的记录。

**参数：**

- 参数1：为新数据
- 参数2：为主键，可选，且只在自动递增时才有必要提供，因为那时主键不包含在数据值里面。

```js
//修改数据
const reqPut = store.put({'userId': 2, 'userName': '李四', 'age': 16});
reqPut.onsuccess = () => {
    console.log(reqPut.result); //2
}
```



#### 删除数据

`IDBObjectStore.delete()`方法用于删除指定主键的记录。

```js
//删除数据
const reqDelete = store.delete(2);
```

`IDBObjectStore.clear()`删除当前对象仓库的所有记录。

```js
//清空数据
const reqClear = store.clear();
```



### 游标

**IDBObjectStore.openCursor()**

**参数：**

- 参数1：范围，可以是一个`IDBKeyRange`对象。

  > 默认(false)包括端点值，可以传入一个布尔值，修改这个属性。

  - `IDBKeyRange.lowerBound()`：指定下限。
  - `IDBKeyRange.upperBound()`：指定上限。
  - `IDBKeyRange.bound()`：同时指定上下限。
  - `IDBKeyRange.only()`：指定只包含一个值。

- 参数2：方向。

  - `next` : 游标中的数据按主键值升序排列，主键值相等的数据都被读取
  - `nextunique`: 游标中的数据按主键值升序排列，主键值相等只读取第一条数据
  - `prev` : 游标中的数据按主键值降序排列，主键值相等的数据都被读取
  - `prevunique` : 游标中的数据按主键值降序排列，主键值相等只读取第一条数据

**返回值：**IDBRequest 对象（不是 IDBCursor 对象）



- IDBKeyRange 对象方法的使用

```js
// boundRange 表示主键值从1到10(包含1和10)的集合。
// 如果第三个参数为true，则表示不包含最小键值1，如果第四参数为true，则表示不包含最大键值10，默认都为false
const boundRange = IDBKeyRange.bound(1, 10, false, false);

// onlyRange 表示由一个主键值的集合。only() 参数则为主键值，整数类型。
const onlyRange = IDBKeyRange.only(1);

// lowerRaneg 表示大于等于1的主键值的集合。
// 第二个参数可选，为true则表示不包含最小主键1，false则包含，默认为false
const lowerRange = IDBKeyRange.lowerBound(1, false);

// upperRange 表示小于等于10的主键值的集合。
// 第二个参数可选，为true则表示不包含最大主键10，false则包含，默认为false
const upperRange = IDBKeyRange.upperBound(10, false);
```



```js

const openRequest = indexedDB.open('test', 1);

openRequest.onupgradeneeded = (e) => {
  console.log("新建数据库成功");
  const db = e.target.result;
  const store = db.createObjectStore("Users", { keyPath: 'userId', autoIncrement: false });
  console.log('创建对象仓库成功');

}

openRequest.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("Users", 'readwrite');
  const store = tx.objectStore('Users'); //返回指定名称的对象仓库 IDBObjectStore。
    
  const boundRange = IDBKeyRange.bound(1, 3, false, false);
  const req = store.openCursor(boundRange, 'next');
  console.log(req);

  req.onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value.userName);
      cursor.continue();
    } else {
      console.log('检索结束');
    }
  }

}
```

在上面的代码中如果检索到符合条件的数据时,我们可以:

> - 使用`cursor.value`拿到数据.
> - 使用`cursor.updata()`更新数据.
> - 使用`cursor.delete()`删除数据.
> - 使用`cursor.continue()`读取下一条数据.



### 索引

#### 主键和索引的区别

主键就是能够唯一标识表中某一行的属性或属性组，一个表只能有一个主键，但可以有多个候选索引。主键是索引，索引不一定是主键。

主键列不允许空值和重复值，而唯一性索引列允许空值。

索引有很多种，普通索引、唯一索引可以允许字段值重复，候选索引、主索引则不允许字段值重复。



在很多情况下我们并不知道我们需要数据的主键是什么，我们知道一个大概的条件.比如说年龄大于20岁的用户，这个时候我们就需要用到**索引**。以便有条件的查找。

#### 创建索引

**IDBObjectStore.createIndex(name,keyPath,optionalParameters)**

创建索引最好在创建仓库的时候创建，要不会有好多bug。

**功能：**用于新建当前数据库的一个索引。该方法只能在`VersionChange`监听函数里面调用。

**参数：**

- 参数1：索引名，不能重复。
- 参数2：表示要在存储对象上的哪个属性上建立索引，可以是一个单个的key值，也可以是一个包含key值集合的数组。
- 参数3：配置对象（可选）
  - unique：用来指定索引值是否可以重复,为true代表不能相同,为false时代表可以相同
  - multiEntry：当第二个参数`keyPath`为一个数组时.如果`multiEntry`是true,则会以数组中的每个元素建立一条索引.如果是false,则以整个数组为`keyPath`值,添加一条索引.

```js
//创建索引
const idx = store.createIndex('ageIndex','age',{unique: false});
```



#### 使用索引

这在创建了一条索引之后我们就可以来使用它了.我们使用对象仓库上的`index`方法,通过传入一个索引名.来拿到一个索引对象。

```jsx
const index = store.index('ageIndex');
```

然后我们就可以使用这个索引了.比如说我们要拿到年龄在18岁以上的数据,升序排列。

```js
const openRequest = indexedDB.open('test', 1);

openRequest.onupgradeneeded = (e) => {
  console.log("新建数据库成功");
  const db = e.target.result;
  const store = db.createObjectStore("Users", { keyPath: 'userId', autoIncrement: false });
  //创建索引
  const idx = store.createIndex('ageIndex', 'age', { unique: false });
  console.log('创建对象仓库成功');
}

openRequest.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("Users", 'readwrite');
  const store = tx.objectStore('Users'); //返回指定名称的对象仓库 IDBObjectStore。

  //使用索引
  const index = store.index('ageIndex');
  const req = index.openCursor(IDBKeyRange.lowerBound(20), 'next');

  req.addEventListener('success', e => {
    const cursor = e.target.result;
    if (cursor) {
      console.log(cursor.value.age);
      cursor.continue();
    } else {
      console.log('检索结束');
    }
  })
}
```

## API

IndexedDB 是一个比较复杂的 API，涉及不少概念。它把不同的实体，抽象成一个个对象接口。学习这个 API，就是学习它的各种对象接口。

- 数据库：IDBDatabase 对象
- 对象仓库：IDBObjectStore 对象
- 索引： IDBIndex 对象
- 事务： IDBTransaction 对象
- 操作请求：IDBRequest 对象
- 指针： IDBCursor 对象
- 主键集合：IDBKeyRange 对象



### indexedDB 对象

**indexedDB.open()**

**indexedDB.deleteDatabase()**

**功能：**用于删除一个数据库，参数为数据库的名字。

**返回值：**返回一个`IDBOpenDBRequest`对象，然后对数据库执行异步删除。删除操作的结果会通过事件通知，`IDBOpenDBRequest`对象可以监听以下事件。

```js
const DBDeleteRequest = indexedDB.deleteDatabase('test');

DBDeleteRequest.onerror = function (event) {
  console.log('Error');
};

DBDeleteRequest.onsuccess = function (event) {
  console.log('success');
};
```

注意，删除不存在的数据库并不会报错。

**indexedDB.cmp()**



### IDBObjectStore 对象

##### 属性

- `IDBObjectStore.indexNames`：返回一个类似数组的对象（DOMStringList），包含了当前对象仓库的所有索引。
- `IDBObjectStore.keyPath`：返回当前对象仓库的主键。
- `IDBObjectStore.name`：返回当前对象仓库的名称。
- `IDBObjectStore.transaction`：返回当前对象仓库所属的事务对象。
- `IDBObjectStore.autoIncrement`：布尔值，表示主键是否会自动递增。

##### 方法

> IDBObjectStore 对象的所有方法返回一个 IDBRequest 对象。

- `IDBObjectStore.add()`

- `IDBObjectStore.put()`

- `IDBObjectStore.clear()`

- `IDBObjectStore.delete()`

- `IDBObjectStore.count()`：方法用于计算记录的数量。该方法返回一个 IDBRequest 对象。

  ```
  IDBObjectStore.count(key)
  ```

- `IDBObjectStore.getKey()`

- `IDBObjectStore.get()`

- `IDBObjectStore.getAll()`：用于获取对象仓库的记录。

- `IDBObjectStore.getAllKeys()`：用于获取所有符合条件的主键。

  ```js
  // 获取所有记录的主键
  objectStore.getAllKeys()
  
  // 获取所有符合条件的主键
  objectStore.getAllKeys(query)
  
  // 指定获取主键的数量
  objectStore.getAllKeys(query, count)
  ```

- `IDBObjectStore.index()`：方法返回指定名称的索引对象 IDBIndex。

  ```js
  objectStore.index(name)
  ```

- `IDBObjectStore.createIndex()`

- `IDBObjectStore.deleteIndex()`：方法用于删除指定的索引。该方法只能在`VersionChange`监听函数里面调用。

  ```js
  objectStore.deleteIndex(indexName)
  ```

- `IDBObjectStore.openCursor()`

- `IDBObjectStore.openKeyCursor()`



### IDBTransaction 对象

##### 属性

- `IDBTransaction.db`：返回当前事务所在的数据库对象 IDBDatabase。
- `IDBTransaction.error`：返回当前事务的错误。如果事务没有结束，或者事务成功结束，或者被手动终止，该方法返回`null`。
- `IDBTransaction.mode`：返回当前事务的模式，默认是`readonly`（只读），另一个值是`readwrite`。
- `IDBTransaction.objectStoreNames`：返回一个类似数组的对象 DOMStringList，成员是当前事务涉及的对象仓库的名字。
- `IDBTransaction.onabort`：指定`abort`事件（事务中断）的监听函数。
- `IDBTransaction.oncomplete`：指定`complete`事件（事务成功）的监听函数。
- `IDBTransaction.onerror`：指定`error`事件（事务失败）的监听函数。

##### 方法

- `IDBTransaction.abort()`：终止当前事务，回滚所有已经进行的变更。
- `IDBTransaction.objectStore(name)`：返回指定名称的对象仓库 IDBObjectStore。



### IDBRequest 对象

##### 属性

- `IDBRequest.readyState`：等于`pending`表示操作正在进行，等于`done`表示操作正在完成。
- `IDBRequest.result`：返回请求的结果。如果请求失败、结果不可用，读取该属性会报错。
- `IDBRequest.error`：请求失败时，返回错误对象。
- `IDBRequest.source`：返回请求的来源（比如索引对象或 ObjectStore）。
- `IDBRequest.transaction`：返回当前请求正在进行的事务，如果不包含事务，返回`null`。
- `IDBRequest.onsuccess`：指定`success`事件的监听函数。
- `IDBRequest.onerror`：指定`error`事件的监听函数。

##### 事件

- `success`：打开成功。
- `error`：打开失败。
- `upgradeneeded`：第一次打开该数据库，或者数据库版本发生变化。
- `blocked`：上一次的数据库连接还未关闭。

- IDBOpenDBRequest 对象继承了 IDBRequest 对象，提供了两个额外的事件监听属性。
  - `IDBOpenDBRequest.onblocked`：指定`blocked`事件（`upgradeneeded`事件触发时，数据库仍然在使用）的监听函数。
  - `IDBOpenDBRequest.onupgradeneeded`：`upgradeneeded`事件的监听函数。



### IDBIndex 对象

#### 属性

- `IDBIndex.name`：字符串，索引的名称。
- `IDBIndex.objectStore`：索引所在的对象仓库。
- `IDBIndex.keyPath`：索引的主键。
- `IDBIndex.multiEntry`：布尔值，针对`keyPath`为数组的情况，如果设为`true`，创建数组时，每个数组成员都会有一个条目，否则每个数组都只有一个条目。
- `IDBIndex.unique`：布尔值，表示创建索引时是否允许相同的主键。

#### 方法

> 它们都是异步的，立即返回的都是一个 IDBRequest 对象。

- `IDBIndex.count()`：用来获取记录的数量。它可以接受主键或 IDBKeyRange 对象作为参数，这时只返回符合主键的记录数量，否则返回所有记录的数量。
- `IDBIndex.get(key)`：用来获取符合指定主键的数据记录。
- `IDBIndex.getKey(key)`：用来获取指定的主键。
- `IDBIndex.getAll()`：用来获取所有的数据记录。它可以接受两个参数，都是可选的，第一个参数用来指定主键，第二个参数用来指定返回记录的数量。如果省略这两个参数，则返回所有记录。由于获取成功时，浏览器必须生成所有对象，所以对性能有影响。如果数据集比较大，建议使用 IDBCursor 对象。
- `IDBIndex.getAllKeys()`：该方法与`IDBIndex.getAll()`方法相似，区别是获取所有主键。
- `IDBIndex.openCursor()`：用来获取一个 IDBCursor 对象，用来遍历索引里面的所有条目。
- `IDBIndex.openKeyCursor()`：该方法与`IDBIndex.openCursor()`方法相似，区别是遍历所有条目的主键。



### IDBCursor 对象

#### 属性

- `IDBCursor.source`：返回正在遍历的对象仓库或索引。
- `IDBCursor.direction`：字符串，表示指针遍历的方向。共有四个可能的值：next（从头开始向后遍历）、nextunique（从头开始向后遍历，重复的值只遍历一次）、prev（从尾部开始向前遍历）、prevunique（从尾部开始向前遍历，重复的值只遍历一次）。该属性通过`IDBObjectStore.openCursor()`方法的第二个参数指定，一旦指定就不能改变了。
- `IDBCursor.key`：返回当前记录的主键。
- `IDBCursor.value`：返回当前记录的数据值。
- `IDBCursor.primaryKey`：返回当前记录的主键。对于数据仓库（objectStore）来说，这个属性等同于 IDBCursor.key；对于索引，IDBCursor.key 返回索引的位置值，该属性返回数据记录的主键。

#### 方法

- `IDBCursor.advance(n)`：指针向前移动 n 个位置。
- `IDBCursor.continue()`：指针向前移动一个位置。它可以接受一个主键作为参数，这时会跳转到这个主键。
- `IDBCursor.continuePrimaryKey()`：该方法需要两个参数，第一个是`key`，第二个是`primaryKey`，将指针移到符合这两个参数的位置。
- `IDBCursor.delete()`：用来删除当前位置的记录，返回一个 IDBRequest 对象。该方法不会改变指针的位置。
- `IDBCursor.update()`：用来更新当前位置的记录，返回一个 IDBRequest 对象。它的参数是要写入数据库的新的值。



### IDBKeyRange 对象

#### 静态方法

- `IDBKeyRange.lowerBound()`：指定下限。
- `IDBKeyRange.upperBound()`：指定上限。
- `IDBKeyRange.bound()`：同时指定上下限。
- `IDBKeyRange.only()`：指定只包含一个值。

#### 只读属性

- `IDBKeyRange.lower`：返回下限
- `IDBKeyRange.lowerOpen`：布尔值，表示下限是否为开区间（即下限是否排除在范围之外）
- `IDBKeyRange.upper`：返回上限
- `IDBKeyRange.upperOpen`：布尔值，表示上限是否为开区间（即上限是否排除在范围之外）

