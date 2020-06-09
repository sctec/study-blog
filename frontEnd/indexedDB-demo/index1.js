var request = window.indexedDB.open('test2', 1);

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(['table1'], 'readwrite');
  const objectStore = transaction.objectStore('table1');
  const index = objectStore.index('name');

  // // 第一种，get方法
  // index.get('a').onsuccess = function (event) {
  //     console.log(event.target.result);
  // }

  // // 第二种，普通游标方法
  // index.openCursor().onsuccess = function (event) {
  //     console.log('openCursor:', event.target.result.value);
  // }

  // // 第三种，键游标方法，该方法与第二种的差别为：普通游标带有value值表示获取的数据，而键游标没有
  // index.openKeyCursor().onsuccess = function (event) {
  //     console.log('openKeyCursor:', event.target.result);
  // }
}