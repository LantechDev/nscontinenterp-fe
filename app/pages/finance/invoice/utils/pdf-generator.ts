import { jsPDF } from "jspdf";
import { toNumber, formatFullRupiah } from "~/lib/utils";
import type { InvoiceDetail } from "~/composables/useInvoices";

/**
 * Get status label for PDF display
 */
function getStatusLabel(code: string): string {
  const labels: Record<string, string> = {
    PAID: "PAID",
    UNPAID: "UNPAID",
    PARTIALLY_PAID: "PARTIALLY PAID",
    OVERDUE: "OVERDUE",
    VOIDED: "VOIDED",
  };
  return labels[code] || code;
}

/**
 * Format date for PDF display
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Generate and download invoice PDF
 */
export async function generateInvoicePdf(invoice: InvoiceDetail): Promise<void> {
  // Load Logo
  const logoUrl = "/images/transparentnscontinenttebal.png";
  const getLogoBase64 = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(null);
        }
      });
      img.addEventListener("error", () => resolve(null));
      img.src = logoUrl;
    });
  };

  const logoBase64 = await getLogoBase64();
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentMargin = 15;
  const contentWidth = pageWidth - contentMargin * 2;

  // Colors
  const primaryColor: [number, number, number] = [6, 44, 88]; // #062c58
  const textColor: [number, number, number] = [31, 41, 55]; // #1f2937
  const grayColor: [number, number, number] = [107, 114, 128]; // #6b7280

  // Draw Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  // Header Section
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", contentMargin, contentMargin, 30, 10);
  }

  doc.setFontSize(7);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "normal");
  doc.text("OPERATIONAL MANAGEMENT SYSTEM", contentMargin, contentMargin + 13);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth / 2, contentMargin + 7, { align: "center" });

  // Right Header
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  doc.text(
    `INV NO: ${invoice.invoiceNumber || "-"}`,
    pageWidth - contentMargin,
    contentMargin + 5,
    { align: "right" },
  );
  doc.text(
    `STATUS: ${getStatusLabel(invoice.status?.code || "")}`,
    pageWidth - contentMargin,
    contentMargin + 9,
    { align: "right" },
  );

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.2);
  doc.line(contentMargin, contentMargin + 15, pageWidth - contentMargin, contentMargin + 15);

  let yPos = contentMargin + 25;

  // Bill To and Date Info Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text("BILL TO:", contentMargin, yPos);
  doc.text("INVOICE DETAILS:", pageWidth - contentMargin - 50, yPos);

  yPos += 5;
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.company?.name || "-", contentMargin, yPos);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`DATE: ${formatDate(invoice.issuedDate)}`, pageWidth - contentMargin, yPos, {
    align: "right",
  });

  yPos += 4;
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  if (invoice.company?.address) {
    doc.text(invoice.company.address, contentMargin, yPos);
    yPos += 4;
  }
  doc.text(`DUE DATE: ${formatDate(invoice.dueDate)}`, pageWidth - contentMargin, yPos - 4, {
    align: "right",
  });

  if (invoice.job) {
    doc.text(`JOB REF: ${invoice.job.jobNumber}`, pageWidth - contentMargin, yPos, {
      align: "right",
    });
  }

  yPos += 15;

  // Items Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(contentMargin, yPos, contentWidth, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DESCRIPTION", contentMargin + 3, yPos + 5);
  doc.text("QTY", contentMargin + contentWidth - 65, yPos + 5, { align: "center" });
  doc.text("UNIT PRICE", contentMargin + contentWidth - 35, yPos + 5, { align: "right" });
  doc.text("AMOUNT", contentMargin + contentWidth - 3, yPos + 5, { align: "right" });

  yPos += 8;

  // Items Table Body
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  invoice.items.forEach((item, idx) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
      yPos = margin + 10;
    }

    if (idx % 2 !== 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(contentMargin, yPos, contentWidth, 8, "F");
    }

    doc.text(item.description, contentMargin + 3, yPos + 5);
    doc.text(String(item.quantity), contentMargin + contentWidth - 65, yPos + 5, {
      align: "center",
    });
    doc.text(formatFullRupiah(item.unitPrice), contentMargin + contentWidth - 35, yPos + 5, {
      align: "right",
    });
    doc.text(formatFullRupiah(item.amount), contentMargin + contentWidth - 3, yPos + 5, {
      align: "right",
    });

    yPos += 8;
  });

  // Totals Section
  yPos += 5;
  const totalsW = 70;
  const totalsX = contentMargin + contentWidth - totalsW;

  const drawTotalLine = (label: string, value: number, isBold: boolean = false) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...(isBold ? primaryColor : textColor));
    doc.text(label, totalsX, yPos);
    doc.text(formatFullRupiah(value), contentMargin + contentWidth - 3, yPos, { align: "right" });
    yPos += 6;
  };

  drawTotalLine("Subtotal:", toNumber(invoice.subTotal) || 0);
  drawTotalLine("Tax (PPN):", toNumber(invoice.taxAmount) || 0);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(totalsX, yPos - 2, contentMargin + contentWidth, yPos - 2);
  yPos += 2;
  drawTotalLine("TOTAL:", toNumber(invoice.total), true);

  // Notes Section
  if (invoice.notes) {
    yPos += 10;
    doc.setFillColor(249, 250, 251);
    doc.rect(contentMargin, yPos, contentWidth, 20, "F");
    doc.setDrawColor(229, 231, 235);
    doc.rect(contentMargin, yPos, contentWidth, 20, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...primaryColor);
    doc.text("NOTES:", contentMargin + 3, yPos + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    const noteLines = doc.splitTextToSize(invoice.notes, contentWidth - 6);
    doc.text(noteLines, contentMargin + 3, yPos + 12);
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Thank you for your business! This is a computer generated document.",
    pageWidth / 2,
    pageHeight - contentMargin + 3,
    { align: "center" },
  );

  // Generate filename and save
  const filename = `Invoice_${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;
  doc.save(filename);
}
