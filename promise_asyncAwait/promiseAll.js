// 가상 api (1초 걸린다고 가정)
function fetchDataWithPromise(index) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${index}번째 데이터 수신`);
    }, index * 1000);
  });
}

function promiseAllExample() {
  console.time("promise");
  let promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(fetchDataWithPromise(i));
  }
  Promise.all(promises).then((results) => {
    console.log("promise.all 결과", results);
    console.timeEnd("promise");
  });
}

promiseAllExample();
