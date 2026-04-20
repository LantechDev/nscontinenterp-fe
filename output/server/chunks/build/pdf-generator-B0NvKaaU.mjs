import { jsPDF } from "jspdf";
import { f as formatRupiah, t as toNumber } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const PRIMARY_COLOR = [1, 45, 90];
const TEXT_COLOR = [31, 41, 55];
const GRAY_COLOR = [107, 114, 128];
const LIGHT_GRAY_COLOR = [229, 231, 235];
function getStatusLabel(code) {
  const labels = {
    PAID: "LUNAS",
    UNPAID: "BELUM LUNAS",
    PARTIALLY_PAID: "SEBAGIAN",
    OVERDUE: "JATUH TEMPO",
  };
  return labels[code] || code;
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
async function generateInvoicePdf(invoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", margin, 25);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNumber, pageWidth - margin, 20, { align: "right" });
  doc.text(getStatusLabel(invoice.status?.code || ""), pageWidth - margin, 30, {
    align: "right",
  });
  yPos = 55;
  doc.setTextColor(...TEXT_COLOR);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("From:", margin, yPos);
  doc.setFont("helvetica", "normal");
  doc.text("PT. Nusantara Continent", margin, yPos + 7);
  doc.setTextColor(...GRAY_COLOR);
  doc.text("Jakarta, Indonesia", margin, yPos + 14);
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Date:", pageWidth - margin - 50, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(invoice.issuedDate), pageWidth - margin, yPos, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text("Due Date:", pageWidth - margin - 50, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(invoice.dueDate), pageWidth - margin, yPos + 7, { align: "right" });
  if (invoice.job) {
    doc.setFont("helvetica", "bold");
    doc.text("Job Reference:", pageWidth - margin - 50, yPos + 14);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.job.jobNumber, pageWidth - margin, yPos + 14, { align: "right" });
  }
  yPos += 35;
  doc.setDrawColor(...LIGHT_GRAY_COLOR);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILL TO:", margin, yPos);
  yPos += 7;
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(invoice.company?.name || "-", margin, yPos);
  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY_COLOR);
  if (invoice.company?.address) {
    doc.text(invoice.company.address, margin, yPos);
    yPos += 6;
  }
  if (invoice.company?.email) {
    doc.text(invoice.company.email, margin, yPos);
    yPos += 6;
  }
  if (invoice.company?.phone) {
    doc.text(invoice.company.phone, margin, yPos);
    yPos += 6;
  }
  yPos += 15;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(margin, yPos, contentWidth, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DESCRIPTION", margin + 5, yPos + 7);
  doc.text("QTY", margin + 95, yPos + 7, { align: "center" });
  doc.text("UNIT PRICE", margin + 125, yPos + 7, { align: "right" });
  doc.text("AMOUNT", pageWidth - margin - 5, yPos + 7, { align: "right" });
  yPos += 10;
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const item of invoice.items) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPos, contentWidth, 12, "F");
    doc.text(item.description, margin + 5, yPos + 8);
    doc.text(String(item.quantity), margin + 95, yPos + 8, { align: "center" });
    doc.text(formatRupiah(item.unitPrice), margin + 125, yPos + 8, { align: "right" });
    doc.text(formatRupiah(item.amount), pageWidth - margin - 5, yPos + 8, { align: "right" });
    yPos += 12;
  }
  doc.setDrawColor(...LIGHT_GRAY_COLOR);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  const totalsX = pageWidth - margin - 80;
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Subtotal:", totalsX, yPos);
  doc.text(formatRupiah(toNumber(invoice.subTotal) || 0), pageWidth - margin, yPos, {
    align: "right",
  });
  yPos += 8;
  doc.text("Pajak (PPN):", totalsX, yPos);
  doc.text(formatRupiah(toNumber(invoice.taxAmount) || 0), pageWidth - margin, yPos, {
    align: "right",
  });
  yPos += 12;
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 5, yPos, pageWidth - margin, yPos);
  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", totalsX, yPos);
  doc.text(formatRupiah(toNumber(invoice.total)), pageWidth - margin, yPos, { align: "right" });
  yPos += 20;
  if (invoice.notes) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, yPos, contentWidth, 30, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR);
    doc.text("Notes:", margin + 5, yPos + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GRAY_COLOR);
    const noteLines = doc.splitTextToSize(invoice.notes, contentWidth - 10);
    doc.text(noteLines, margin + 5, yPos + 16);
  }
  const footerY = pageHeight - 15;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Thank you for your business!", pageWidth / 2, footerY + 5, { align: "center" });
  const filename = `Invoice_${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;
  doc.save(filename);
}

export { generateInvoicePdf };
//# sourceMappingURL=pdf-generator-B0NvKaaU.mjs.map
