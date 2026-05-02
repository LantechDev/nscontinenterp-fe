import { jsPDF } from "jspdf";
import { formatRupiah } from "~/lib/utils";

const C = {
  primary: [1, 45, 90] as [number, number, number],
  text: [31, 41, 55] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBlue: [214, 228, 240] as [number, number, number],
};

export interface PdfCol {
  header: string;
  width: number;
  align?: "left" | "center" | "right";
  isCurrency?: boolean;
}

export interface PdfExportOptions {
  title: string;
  companyName?: string;
  period?: string;
  cols: PdfCol[];
  rows: (string | number)[][];
  totals?: number[];
  filename: string;
}

export function exportStyledPdf(opts: PdfExportOptions): void {
  const { title, companyName = "PT NOVA SYNC", period, cols, rows, totals, filename } = opts;

  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const colW = cols.map((c) => contentWidth * c.width);
  const colAligns = cols.map((c) => c.align || "left");
  const colHeaders = cols.map((c) => c.header);
  const rowH = 7;
  const headerRowH = 10;

  const drawBorders = (x: number, yPos: number, w: number, h: number) => {
    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.3);
    let cx = x;
    colW.forEach((cw) => {
      doc.rect(cx, yPos, cw, h);
      cx += cw;
    });
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...C.primary);
      doc.rect(0, pageHeight - 10, pageWidth, 10, "F");
      doc.setTextColor(...C.white);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString("id-ID"), margin, pageHeight - 3);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 3, { align: "right" });
    }
  };

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin - 12) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };

  // Top header bar
  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(...C.white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, margin, 14);
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 14, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - margin, 14, {
    align: "right",
  });

  if (period) {
    doc.setFillColor(...C.primary);
    doc.rect(0, 18, pageWidth, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(period, margin, 25);
    y = 28;
  } else {
    y = 48;
  }

  // Column headers
  checkPage(headerRowH);
  doc.setFillColor(...C.primary);
  doc.rect(margin, y, contentWidth, headerRowH, "F");
  drawBorders(margin, y, contentWidth, headerRowH);
  doc.setTextColor(...C.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  let cx = margin;
  colHeaders.forEach((h, i) => {
    doc.text(h, cx + 2, y + headerRowH / 2 + 3);
    cx += colW[i]!;
  });
  y += headerRowH;

  // Data rows
  rows.forEach((row) => {
    checkPage(rowH);
    const bg = rows.indexOf(row) % 2 === 0 ? C.lightGray : C.white;
    doc.setFillColor(...bg);
    doc.rect(margin, y, contentWidth, rowH, "F");
    drawBorders(margin, y, contentWidth, rowH);
    doc.setTextColor(...C.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    cx = margin;
    row.forEach((cell, i) => {
      const align = colAligns[i] ?? "left";
      const val =
        typeof cell === "number"
          ? cols[i]?.isCurrency
            ? formatRupiah(cell)
            : String(cell)
          : String(cell ?? "-");
      const offset = align === "left" ? 2 : align === "right" ? colW[i]! - 2 : colW[i]! / 2;
      doc.text(val.substring(0, 30), cx + offset, y + rowH / 2 + 3, { align });
      cx += colW[i]!;
    });
    y += rowH;
  });

  // Totals row
  if (totals && totals.length > 0) {
    checkPage(headerRowH);
    doc.setFillColor(...C.lightBlue);
    doc.rect(margin, y, contentWidth, headerRowH, "F");
    drawBorders(margin, y, contentWidth, headerRowH);
    doc.setTextColor(...C.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    cx = margin;
    colHeaders.forEach((_, i) => {
      const align = colAligns[i] ?? "left";
      if (i === 0) {
        doc.text("TOTAL", cx + 2, y + headerRowH / 2 + 3);
      } else if (totals.includes(i)) {
        const sum = rows.reduce((s, r) => s + (typeof r[i] === "number" ? (r[i] as number) : 0), 0);
        const offset = align === "left" ? 2 : align === "right" ? colW[i]! - 2 : colW[i]! / 2;
        doc.text(formatRupiah(sum), cx + offset, y + headerRowH / 2 + 3, { align });
      }
      cx += colW[i]!;
    });
    y += headerRowH;
  }

  addFooter();
  doc.save(filename);
}
