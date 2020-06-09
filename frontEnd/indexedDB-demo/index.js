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


  // //添加数据
  // const reqAdd = store.add({ 'userId': 3, 'userName': 'ccc', 'age': 20 })
  // reqAdd.onsuccess = () => {
  //   console.log("添加数据成功");
  // }


  // //获取数据
  // const reqGet = store.getKey(1);
  // reqGet.onsuccess = () => {
  //   console.log(reqGet.result); //1
  // }


  // //修改数据
  // const reqPut = store.put({'userId': 2, 'userName': '李四', 'age': 16});
  // reqPut.onsuccess = () => {
  //   console.log(reqPut.result); //2
  // }


  // //清空数据
  // const reqClear = store.clear();


  //使用游标
  // const boundRange = IDBKeyRange.bound(1, 3, false, false);
  // const req = store.openCursor(boundRange, 'next');
  // req.onsuccess = e => {
  //   // const cursor = e.target.result;
  //   if (req) {
  //     console.log(cursor.value.age);
  //     cursor.continue();
  //   } else {
  //     console.log('检索结束');
  //   }
  // }


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




// // const openRequest = indexedDB.open('test', 2);

// // openRequest.onupgradeneeded = (e) => {
// //   console.log("新建数据库成功");
// // }

// // openRequest.onsuccess = () => {
// //   console.log("成功");

// // }


// const openRequest = indexedDB.open('test', 3);

// openRequest.onupgradeneeded = (e) => {
//   const db = e.target.result;
//   const tx = db.transaction('Users', 'readwrite');
//   const store = tx.objectStore('Users');
//   const idx = store.createIndex('ageIndex', 'age', { unique: false });
// }

// openRequest.onsuccess = e => {
//   const db = e.target.result;
//   const tx = db.transaction('Users', 'readwrite');
//   const store = tx.objectStore('Users');
//   const index = store.index('ageIndex');
//   const req = index.openCursor(IDBKeyRange.lowerBound(18), 'next');

//   req.onsuccess = e => {
//     const cursor = e.target.result;
//     if (cursor) {
//       console.log(cursor.value.age);
//       cursor.continue();
//     } else {
//       console.log('检索结束');
//     }
//   }
// };