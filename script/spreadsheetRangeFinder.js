const columnToLetter = (column) => {
  let temp,
    letter = "";
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
};

const findLastNonEmptyColumn = async (sheets) => {
  const fullRowResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "수정요청!1:1",
  });
  const fullRowData = fullRowResponse.data.values[0];

  for (let i = fullRowData.length - 1; i >= 0; i--) {
    if (fullRowData[i] !== "") {
      return i + 1;
    }
  }
  return fullRowData.length;
};

const findLastNonEmptyRow = async (sheets) => {
  const fullColumnResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "수정요청!A:A",
  });
  const fullColumnData = fullColumnResponse.data.values;

  for (let i = fullColumnData.length - 1; i >= 0; i--) {
    if (fullColumnData[i][0] !== "") {
      return i + 1;
    }
  }
  return fullColumnData.length;
};

const findRange = async (sheets) => {
  const lastColumn = await findLastNonEmptyColumn(sheets);
  const lastRow = await findLastNonEmptyRow(sheets);
  const range = `A1:${columnToLetter(lastColumn)}${lastRow}`;
  return range;
};

export { findRange };
