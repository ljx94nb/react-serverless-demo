const request = window.indexedDB.open('bike_data_db');
let db = null;

request.onerror = function (e) {
  console.error('indexedDB打开失败');
};

request.onsuccess = function (e) {
  db = request.result;
  console.log('indexedDB打开成功');
};

request.onupgradeneeded = function (e) {
  db = e.target.result;
  let objectStore = null;
  if (!db.objectStoreNames.contains('bike_data')) {
    objectStore = db.createObjectStore('bike_data', { keyPath: 'districtName' });
  }
};

export function addInDB(options) {
  const { districtName, data } = options;
  const request = db
    .transaction(['bike_data'], 'readwrite')
    .objectStore('bike_data')
    .add({ districtName, data });

  request.onsuccess = function (e) {
    console.log('数据写入成功');
  };

  request.onerror = function (e) {
    console.log('数据写入失败');
  };
}

export function readInDB(districtName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bike_data']);
    const objectStore = transaction.objectStore('bike_data');
    const request = objectStore.get(districtName);

    request.onerror = function (e) {
      reject('获取数据失败');
    };

    request.onsuccess = function (e) {
      if (request.result) {
        resolve(request.result.data);
      } else {
        reject('获取数据失败');
      }
    };
  });
}
