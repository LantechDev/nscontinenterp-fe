import * as XLSX from "xlsx";

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

interface BorderSide {
  style: string;
  color: { rgb: string };
}

interface CellStyle {
  font?: {
    name?: string;
    sz?: number;
    bold?: boolean;
    color?: { rgb?: string };
  };
  fill?: {
    patternType?: string;
    fgColor?: { rgb?: string };
  };
  alignment?: {
    horizontal?: "left" | "center" | "right";
    vertical?: "top" | "center" | "bottom";
    wrapText?: boolean;
  };
  border?: {
    top?: BorderSide;
    bottom?: BorderSide;
    left?: BorderSide;
    right?: BorderSide;
  };
  numFmt?: string;
}

interface CellObj {
  t?: string;
  v?: string | number;
  s?: CellStyle;
  r?: string;
  k?: string;
}

export function makeBorder(): CellStyle["border"] {
  return {
    top: { style: "thin", color: { rgb: EXCEL_COLORS.darkNavy } },
    bottom: { style: "thin", color: { rgb: EXCEL_COLORS.darkNavy } },
    left: { style: "thin", color: { rgb: EXCEL_COLORS.darkNavy } },
    right: { style: "thin", color: { rgb: EXCEL_COLORS.darkNavy } },
  };
}

export function makeCellStyle(opts: {
  bold?: boolean;
  fontSize?: number;
  fontColor?: string;
  bgColor?: string;
  align?: "left" | "center" | "right";
  valign?: "top" | "center" | "bottom";
  numFmt?: string;
  wrapText?: boolean;
}): CellStyle {
  return {
    font: {
      name: EXCEL_FONTS.name,
      sz: opts.fontSize ?? EXCEL_FONTS.dataSize,
      bold: opts.bold ?? false,
      color: { rgb: opts.fontColor ?? EXCEL_COLORS.black },
    },
    fill: opts.bgColor
      ? {
          patternType: "solid",
          fgColor: { rgb: opts.bgColor },
        }
      : { patternType: "none" as const },
    alignment: {
      horizontal: opts.align ?? "left",
      vertical: opts.valign ?? "center",
      wrapText: opts.wrapText ?? false,
    },
    border: makeBorder(),
    numFmt: opts.numFmt,
  };
}

export function applyStyleToRange(
  ws: XLSX.WorkSheet,
  range: { s: { c: number; r: number }; e: { c: number; r: number } },
  style: CellStyle,
) {
  const styleMap = style as unknown as Record<string, unknown>;
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) {
        ws[addr] = { t: "s", v: "", s: style };
      } else {
        const cell = ws[addr] as CellObj;
        const existing: Record<string, unknown> = (cell.s as Record<string, unknown>) || {};
        const merged: Record<string, unknown> = { ...existing };
        for (const key of Object.keys(styleMap)) {
          if (!(key in merged)) {
            merged[key] = styleMap[key];
          }
        }
        cell.s = merged;
      }
    }
  }
}

export function mergeCells(
  ws: XLSX.WorkSheet,
  s: { c: number; r: number },
  e: { c: number; r: number },
) {
  if (!ws["!merges"]) ws["!merges"] = [];
  ws["!merges"].push({ s, e });
}

export function setColWidth(ws: XLSX.WorkSheet, col: number, width: number) {
  if (!ws["!cols"]) ws["!cols"] = [];
  ws["!cols"][col] = { wch: width };
}

export function setRowHeight(ws: XLSX.WorkSheet, row: number, height: number) {
  if (!ws["!rows"]) ws["!rows"] = [];
  ws["!rows"][row] = { hpt: height };
}
