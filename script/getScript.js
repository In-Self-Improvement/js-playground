import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
// 서비스 계정 키 파일 경로
const KEY_FILE_PATH = './env/service-account-key.json';

// 스프레드시트 ID (URL에서 찾을 수 있습니다)
const SPREADSHEET_ID = process.env.GOOGLE_SPREAD_SHEET_ID;
// 탭 이름
// 최종본 / 산업코드 / 국가코드
const tabName = '산업코드';
const columnToLetter = (column) => {
  let temp,
    letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
};
const findRange = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const fullRowResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!1:1`,
  });

  const fullRowData = fullRowResponse.data.values;
  let lastColumn = fullRowData[0].length;
  for (let i = fullRowData[0].length - 1; i >= 0; i--) {
    if (fullRowData[0][i] !== '') {
      lastColumn = i + 1;
      break;
    }
  }

  // A열 전체를 읽어들임
  const fullColumnResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A:A`,
  });

  const fullColumnData = fullColumnResponse.data.values;
  let lastRow = fullColumnData.length;
  for (let i = fullColumnData.length - 1; i >= 0; i--) {
    if (fullColumnData[i][0] !== '') {
      lastRow = i + 1;
      break;
    }
  }

  const range = `A1:${columnToLetter(lastColumn)}${lastRow}`;
  return range;
};

async function accessSpreadsheet() {
  // 서비스 계정 키 파일을 사용하여 인증
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const range = await findRange();

  // 스프레드시트 데이터 읽기
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!${range}`,
  });

  const rows = response.data.values;
  if (rows.length === 0) {
    console.log('No data found.');
  } else {
    // 첫 번째 행(언어 코드)을 제외하고 데이터 처리
    const headers = rows[0].slice(1); // 언어 코드
    const data = rows.slice(1); // 실제 데이터

    // 각 언어별로 JSON 파일 생성
    headers.forEach((header, index) => {
      const languageData = {};
      let hasError = false;
      data.forEach((row) => {
        const key = row[0]; // Key
        const value = row[index + 1]; // 해당 언어의 값

        // 값이 유효한지 확인
        const isValueExist =
          value === '' || value === undefined || value === '#VALUE!';
        if (isValueExist) {
          hasError = true;
        } else {
          languageData[key] = value;
        }
      });
      if (!hasError) {
        // 파일로 저장 (언어코드.json)
        let dirPath = `./translates/${header}`;
        let filePath = `${dirPath}/${header}.json`;
        if (tabName === '최종본') {
          if (header === 'zh-CN') {
            dirPath = `./translates/zh_cn`;
            filePath = `${dirPath}/zh_cn.json`;
          } else {
            dirPath = `./translates/${header}`;
            filePath = `${dirPath}/${header}.json`;
          }
        } else if (tabName === '산업코드') {
          if (header === 'zh-CN') {
            dirPath = `./translates/zh_cn`;
            filePath = `${dirPath}/industry.json`;
          } else {
            dirPath = `./translates/${header}`;
            filePath = `${dirPath}/industry.json`;
          }
        } else if (tabName === '국가코드') {
          if (header === 'zh-CN') {
            dirPath = `./translates/zh_cn`;
            filePath = `${dirPath}/country.json`;
          } else {
            dirPath = `./translates/${header}`;
            filePath = `${dirPath}/country.json`;
          }
        }

        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFile(
          `${filePath}`,
          JSON.stringify(languageData, null, 2),
          (err) => {
            if (err) throw err;
            console.log(`Saved ${header}.json`);
          }
        );
      } else {
        console.error(
          `${header} 언어 스크립트에 빈 값이 있습니다. 스크립트를 확인해주세요`
        );
      }
    });
  }
}

accessSpreadsheet().catch(console.error);
