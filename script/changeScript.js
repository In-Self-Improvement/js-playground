import { google } from 'googleapis';
import fs from 'fs';
// const path = require('path');
import dotenv from 'dotenv';
dotenv.config();
// 서비스 계정 키 파일 경로
const KEY_FILE_PATH = './env/service-account-key.json';

// 스프레드시트 ID (URL에서 찾을 수 있습니다)
const SPREADSHEET_ID = process.env.GOOGLE_SPREAD_SHEET_ID_DEMO;
const tabName = '수정요청';
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

const authenticateGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const readSpreadsheetData = async (sheets) => {
  const range = await findRange();
  console.log('range', range);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `수정요청!${range}`,
  });

  return response.data.values;
};

const updateTranslationFiles = (modifiedRows) => {
  const languageCodes = modifiedRows[0].slice(2);
  console.log('languageCodes', languageCodes);
  modifiedRows.slice(1).forEach((row) => {
    const key = row[0];

    languageCodes.forEach((langCode, index) => {
      const newValue = row[index + 2];
      console.log('newValue', newValue);
      console.log('langCode', langCode);

      let dirPath = `./translates/${langCode}`;
      let filePath = `${dirPath}/${langCode}.json`;

      if (langCode === 'zh-CN') {
        dirPath = `./translates/zh_cn`;
        filePath = `${dirPath}/zh_cn.json`;
      } else {
        dirPath = `./translates/${langCode}`;
        filePath = `${dirPath}/${langCode}.json`;
      }

      if (fs.existsSync(filePath)) {
        console.log('hihi');

        const languageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (key in languageData) {
          languageData[key] = newValue;
          fs.writeFileSync(filePath, JSON.stringify(languageData, null, 2));
          console.log(`Updated key '${key}' in ${langCode}.json`);
        }
      } else {
        console.error(`File ${langCode}.json not found`);
      }
    });
  });
};

const updateSpreadsheet = async () => {
  try {
    const sheets = await authenticateGoogleSheets();
    const modifiedRows = await readSpreadsheetData(sheets);
    updateTranslationFiles(modifiedRows);
  } catch (error) {
    console.error(error);
  }
};

updateSpreadsheet();
