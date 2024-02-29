const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
import { findRange } from './spreadsheetRangeFinder';
import dotenv from 'dotenv';
dotenv.config();
// 서비스 계정 키 파일 경로
const KEY_FILE_PATH = './env/service-account-key.json';

// 스프레드시트 ID (URL에서 찾을 수 있습니다)
const SPREADSHEET_ID = process.env.GOOGLE_SPREAD_SHEET_ID;

const authenticateGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const readSpreadsheetData = async (sheets) => {
  const range = await findRange(sheets);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `수정요청!${range}`,
  });

  return response.data.values;
};

const updateTranslationFiles = (modifiedRows) => {
  const languageCodes = modifiedRows[0].slice(1);

  modifiedRows.slice(1).forEach((row) => {
    const key = row[0];

    languageCodes.forEach((langCode, index) => {
      const newValue = row[index + 1];
      const filePath = path.join(
        `./translates/${langCode}`,
        `${langCode}.json`
      );

      if (fs.existsSync(filePath)) {
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
