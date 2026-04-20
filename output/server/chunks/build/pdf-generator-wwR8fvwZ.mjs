import { jsPDF } from "jspdf";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
async function generateExpensePdf(expenseId, fetchExpenseById) {
  try {
    const expenseData = await fetchExpenseById(expenseId);
    if (!expenseData) {
      throw new Error("Failed to fetch expense data");
    }
    const e = expenseData;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const redColor = [220, 38, 38];
    const textColor = [31, 41, 55];
    const grayColor = [107, 114, 128];
    doc.setFillColor(...redColor);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("EXPENSE RECORD", margin, 25);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(e.number || "-", pageWidth - margin, 20, { align: "right" });
    doc.text(formatDate(e.date), pageWidth - margin, 30, { align: "right" });
    let yPos = 55;
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 40, 3, 3, "F");
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", pageWidth / 2, yPos + 15, { align: "center" });
    doc.setTextColor(...redColor);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(Number(e.amount) || 0), pageWidth / 2, yPos + 32, {
      align: "center",
    });
    yPos += 55;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Description:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.description || "-", margin + 35, yPos);
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Vendor:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.vendor?.name || "N/A", margin + 35, yPos);
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Category:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.category?.name || "Uncategorized", margin + 35, yPos);
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Job Number:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.job?.jobNumber || "N/A", margin + 35, yPos);
    if (expenseData.notes) {
      yPos += 20;
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 3, 3, "F");
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text("Additional Notes:", margin + 5, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      const noteLines = doc.splitTextToSize(expenseData.notes, pageWidth - margin * 2 - 10);
      doc.text(noteLines, margin + 5, yPos);
    }
    const footerY = pageHeight - 15;
    doc.setFillColor(...redColor);
    doc.rect(0, footerY - 5, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("PT. Nusantara Continent - Expense Record", pageWidth / 2, footerY + 5, {
      align: "center",
    });
    const filename = `Expense_${e.number?.replace(/\//g, "-") || "Record"}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Failed to download expense PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
}

export { generateExpensePdf };
//# sourceMappingURL=pdf-generator-wwR8fvwZ.mjs.map
