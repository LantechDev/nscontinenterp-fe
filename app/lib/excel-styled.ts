import * as XLSX from "xlsx";
import JSZip from "jszip";

export const EXCEL_COLORS = {
  darkNavy: "012D5A",
  lightBlue: "D6E4F0",
  lightGray: "F5F5F5",
  white: "FFFFFF",
  black: "000000",
};

export const EXCEL_FONTS = {
  name: "Arial",
  headerSize: 11,
  colHeaderSize: 10,
  dataSize: 10,
};

type CellValue = string | number | null | undefined;

export interface StyledRow {
  cells: CellValue[];
  style: number;
  cellStyles?: number[];
}

export type StyleIdx =
  | 0 // header: darkNavy bg, white bold, center
  | 1 // data even: white bg
  | 2 // data odd: lightGray bg
  | 3 // total: lightBlue bold, right-aligned
  | 4 // header merged: darkNavy bg, white bold, center, merged
  | 5 // data even right: white bg, right-aligned (for currency)
  | 6 // data odd right: lightGray bg, right-aligned (for currency)
  | 7 // title merged: darkNavy bg, white bold, center, larger font
  | 8 // period merged: darkNavy bg, white normal, center
  | 9; // total label: lightBlue bold, left-aligned

function escapeXml(val: string): string {
  return String(val).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colLetter(c: number): string {
  return String.fromCharCode(65 + c);
}

function cellRef(c: number, r: number): string {
  return `${colLetter(c)}${r + 1}`;
}

function buildStylesXml(): string {
  const C = EXCEL_COLORS;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="${EXCEL_FONTS.headerSize}"/><color rgb="FF${C.white}"/><name val="${EXCEL_FONTS.name}"/><b/></font>
<font><sz val="${EXCEL_FONTS.dataSize}"/><color rgb="FF${C.black}"/><name val="${EXCEL_FONTS.name}"/></font>
<font><sz val="${EXCEL_FONTS.dataSize}"/><color rgb="FF${C.darkNavy}"/><name val="${EXCEL_FONTS.name}"/><b/></font>
<font><sz val="14"/><color rgb="FF${C.white}"/><name val="${EXCEL_FONTS.name}"/><b/></font>
</fonts>
<fills count="6">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF${C.darkNavy}"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF${C.white}"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF${C.lightGray}"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF${C.lightBlue}"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border>
<left style="thin"><color rgb="FF${C.darkNavy}"/></left>
<right style="thin"><color rgb="FF${C.darkNavy}"/></right>
<top style="thin"><color rgb="FF${C.darkNavy}"/></top>
<bottom style="thin"><color rgb="FF${C.darkNavy}"/></bottom>
</border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="10">
<!-- 0: header darkNavy, white bold, center -->
<xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
<!-- 1: data even white, left -->
<xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>
<!-- 2: data odd lightGray, left -->
<xf numFmtId="0" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>
<!-- 3: total lightBlue bold, right -->
<xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>
<!-- 4: header darkNavy (same as 0, for explicit use) -->
<xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
<!-- 5: data even white, right (currency) -->
<xf numFmtId="2" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
<!-- 6: data odd lightGray, right (currency) -->
<xf numFmtId="2" fontId="1" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyNumberFormat="1"><alignment horizontal="right" vertical="center"/></xf>
<!-- 7: title merged, darkNavy, white bold, 14pt -->
<xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
<!-- 8: period merged, darkNavy, white normal, center -->
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>
<!-- 9: total label, lightBlue bold, left -->
<xf numFmtId="0" fontId="2" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>
</cellXfs>
</styleSheet>`;
}

function buildSheetXml(rows: StyledRow[], colWidths?: number[]): string {
  const numRows = rows.length;
  const numCols = numRows > 0 ? Math.max(...rows.map((r) => r.cells.length)) : 0;
  const lastCol = numCols > 0 ? colLetter(numCols - 1) : "A";

  let sheetData = "";
  rows.forEach((row, ri) => {
    const cells: string[] = [];
    row.cells.forEach((val, ci) => {
      const ref = cellRef(ci, ri);
      const s = row.style;
      if (typeof val === "number") {
        cells.push(`<c r="${ref}" s="${s}"><v>${val}</v></c>`);
      } else if (val != null && val !== "") {
        cells.push(
          `<c r="${ref}" s="${s}" t="inlineStr"><is><t>${escapeXml(String(val))}</t></is></c>`,
        );
      } else {
        cells.push(`<c r="${ref}" s="${s}"/>`);
      }
    });
    sheetData += `<row r="${ri + 1}">${cells.join("")}</row>`;
  });

  let colsXml = "";
  if (colWidths && colWidths.length > 0) {
    colWidths.forEach((w, i) => {
      colsXml += `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`;
    });
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<dimension ref="A1:${lastCol}${numRows}"/>
${colsXml ? `<cols>${colsXml}</cols>` : ""}
<sheetData>
${sheetData}
</sheetData>
</worksheet>`;
}

export function buildStyledWorkbook(
  sheetName: string,
  rows: StyledRow[],
  colWidths?: number[],
  filename?: string,
): void {
  const wb = XLSX.utils.book_new();
  const wsData = rows.map((r) => r.cells);
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const uint8 = new Uint8Array(buf);

  JSZip.loadAsync(uint8)
    .then((zip) => {
      zip.file("xl/styles.xml", buildStylesXml());
      zip.file("xl/worksheets/sheet1.xml", buildSheetXml(rows, colWidths));
      return zip.generateAsync({ type: "uint8array" });
    })
    .then((newBuf) => {
      const blob = new Blob([newBuf.buffer as ArrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `${sheetName}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
}
