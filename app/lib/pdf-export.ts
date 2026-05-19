import { jsPDF } from "jspdf";
import { formatRupiah } from "~/lib/utils";

const C = {
  primary: [6, 44, 88] as [number, number, number], // #062c58
  text: [31, 41, 55] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  lightGray: [249, 250, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  lightBlue: [214, 228, 240] as [number, number, number],
  border: [6, 44, 88] as [number, number, number],
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
  orientation?: "portrait" | "landscape";
}

export async function exportStyledPdf(opts: PdfExportOptions): Promise<void> {
  const { title, period, cols, rows, totals, filename, orientation = "portrait" } = opts;

  // Load Logo
  const logoUrl = "/images/transparentnscontinenttebal.png";
  const getLogoBase64 = async (): Promise<string | null> => {
    try {
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => resolve(reader.result as string));
        reader.addEventListener("error", () => resolve(null));
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Failed to load logo", e);
      return null;
    }
  };

  const logoBase64 = await getLogoBase64();

  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentMargin = 15;
  const innerWidth = pageWidth - contentMargin * 2;

  let y = contentMargin;

  const colW = cols.map((c) => innerWidth * c.width);
  const colAligns = cols.map((c) => c.align || "left");
  const colHeaders = cols.map((c) => c.header);
  const rowH = 7;
  const headerRowH = 8;

  const drawPageBorder = () => {
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
  };

  const addHeader = () => {
    drawPageBorder();

    // Logo
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", contentMargin, contentMargin, 30, 10);
    } else {
      doc.setTextColor(...C.primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("NS CONTINENT", contentMargin, contentMargin + 5);
    }

    doc.setFontSize(7);
    doc.setTextColor(...C.primary);
    doc.setFont("helvetica", "normal");
    doc.text("OPERATIONAL MANAGEMENT SYSTEM", contentMargin, contentMargin + 13);

    // Title in Middle
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), pageWidth / 2, contentMargin + 7, { align: "center" });

    // Page Info on Right
    const pageNum = doc.getNumberOfPages();
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.text);
    doc.text(`PAGE: ${pageNum}`, pageWidth - contentMargin, contentMargin + 5, { align: "right" });
    doc.text(
      `DATE: ${new Date().toLocaleDateString("id-ID")}`,
      pageWidth - contentMargin,
      contentMargin + 9,
      { align: "right" },
    );

    if (period) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...C.primary);
      doc.text(period.toUpperCase(), pageWidth / 2, contentMargin + 12, { align: "center" });
    }

    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.2);
    doc.line(contentMargin, contentMargin + 15, pageWidth - contentMargin, contentMargin + 15);

    return contentMargin + 20;
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      drawPageBorder();
      doc.setTextColor(...C.gray);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(
        "This report is generated automatically by NS Continent ERP.",
        pageWidth / 2,
        pageHeight - contentMargin + 5,
        { align: "center" },
      );
    }
  };

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - contentMargin - 10) {
      doc.addPage();
      y = addHeader();
    }
  };

  y = addHeader();

  // Column headers
  checkPage(headerRowH);
  doc.setFillColor(...C.primary);
  doc.rect(contentMargin, y, innerWidth, headerRowH, "F");
  doc.setTextColor(...C.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  let cx = contentMargin;
  colHeaders.forEach((h, i) => {
    const align = colAligns[i] ?? "left";
    const offset = align === "left" ? 2 : align === "right" ? colW[i]! - 2 : colW[i]! / 2;
    doc.text(h, cx + offset, y + headerRowH / 2 + 1, { align });
    cx += colW[i]!;
  });
  y += headerRowH;

  // Data rows
  rows.forEach((row, idx) => {
    checkPage(rowH);
    const bg = idx % 2 === 0 ? C.white : C.lightGray;
    doc.setFillColor(...bg);
    doc.rect(contentMargin, y, innerWidth, rowH, "F");

    // Draw horizontal line for each row
    doc.setDrawColor(230, 230, 230);
    doc.line(contentMargin, y + rowH, pageWidth - contentMargin, y + rowH);

    doc.setTextColor(...C.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    cx = contentMargin;
    row.forEach((cell, i) => {
      const align = colAligns[i] ?? "left";
      const val =
        typeof cell === "number"
          ? cols[i]?.isCurrency
            ? formatRupiah(cell)
            : String(cell)
          : String(cell ?? "-");
      const offset = align === "left" ? 2 : align === "right" ? colW[i]! - 2 : colW[i]! / 2;

      // Handle text overflow
      const maxW = colW[i]! - 4;
      const text = doc.splitTextToSize(val, maxW);
      doc.text(text[0] || "", cx + offset, y + rowH / 2 + 1, { align });
      cx += colW[i]!;
    });
    y += rowH;
  });

  // Totals row
  if (totals && totals.length > 0) {
    checkPage(headerRowH);
    doc.setFillColor(...C.lightBlue);
    doc.rect(contentMargin, y, innerWidth, headerRowH, "F");
    doc.setDrawColor(...C.primary);
    doc.setLineWidth(0.3);
    doc.line(contentMargin, y, pageWidth - contentMargin, y);
    doc.line(contentMargin, y + headerRowH, pageWidth - contentMargin, y + headerRowH);

    doc.setTextColor(...C.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    cx = contentMargin;
    colHeaders.forEach((_, i) => {
      const align = colAligns[i] ?? "left";
      if (i === 0) {
        doc.text("TOTAL", cx + 2, y + headerRowH / 2 + 1);
      } else if (totals.includes(i)) {
        const sum = rows.reduce((s, r) => s + (typeof r[i] === "number" ? (r[i] as number) : 0), 0);
        const offset = align === "left" ? 2 : align === "right" ? colW[i]! - 2 : colW[i]! / 2;
        doc.text(formatRupiah(sum), cx + offset, y + headerRowH / 2 + 1, { align });
      }
      cx += colW[i]!;
    });
    y += headerRowH;
  }

  addFooter();
  doc.save(filename);
}
