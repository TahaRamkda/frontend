// utils/exportToExcel.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName = "report", columnsMap = {}) => {
  // Map data to custom column names
  const formattedData = data.map(item => {
    const row = {};
    for (const key in columnsMap) {
      row[columnsMap[key]] = item[key];
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `${fileName}.xlsx`);
};
