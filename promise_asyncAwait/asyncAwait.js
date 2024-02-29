function fetchDataWithAsync(index) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${index}번째 데이터 수신`);
    }, index * 1000);
  });
}

async function asyncAwaitExample() {
  console.time("AsyncAwait Time");
  let results = [];
  for (let i = 0; i < 5; i++) {
    results.push(await fetchDataWithAsync(i));
  }
  console.log("async/await 결과:", results);
  console.timeEnd("AsyncAwait Time");
}

asyncAwaitExample();
