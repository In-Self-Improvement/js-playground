// ES6 모듈 import 구문을 사용
import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { URLSearchParams } from 'url';

const client_id = 'ekbi27osag';
const client_secret = 'GDk3I12J1ArCLa0NDxzJ5ZimAg7uekD6MOXrtrUD';
const api_url = 'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';
const text =
  'ここで買ったこの製品がとても弱くて割れてしまいました。私が怪我をしそうになりましたが、どうつもりですか？';
// 'I bought this product here and it is very weak and cracked. I almost got hurt, how do you intend to do it?';
// '이 제품을 여기서 샀는데 매우 약하고 금이 갔습니다. 다칠 뻔했는데 어떻게 할 건가요?';

const headers = {
  'X-NCP-APIGW-API-KEY-ID': client_id,
  'X-NCP-APIGW-API-KEY': client_secret,
  'Content-Type': 'application/x-www-form-urlencoded',
};

const body = new URLSearchParams({
  speaker: 'matt',
  volume: '0',
  speed: '0',
  pitch: '0',
  text: text,
  format: 'mp3',
});

fetch(api_url, {
  method: 'POST',
  headers: headers,
  body: body,
})
  .then((response) => {
    if (response.ok) {
      response.body.pipe(createWriteStream('영어-.mp3'));
      console.log('음성 파일이 저장되었습니다.');
    } else {
      console.error('API 호출 에러:', response.statusText);
    }
  })
  .catch((error) => console.error('요청 처리 중 에러 발생:', error));
