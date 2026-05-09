import { jsPDF } from "jspdf";
import { toast } from "vue-sonner";
import type { Expense } from "~/composables/useFinanceExpense";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export async function generateExpensePdf(
  expenseId: string,
  fetchExpenseById: (id: string) => Promise<Expense | null>,
) {
  try {
    const expenseData = await fetchExpenseById(expenseId);
    if (!expenseData) {
      throw new Error("Failed to fetch expense data");
    }

    const e = expenseData as Expense & { notes?: string };

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
    doc.text("EXPENSE VOUCHER", pageWidth / 2, contentMargin + 7, { align: "center" });

    // Right Header
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(`NO: ${e.number || "-"}`, pageWidth - contentMargin, contentMargin + 5, {
      align: "right",
    });
    doc.text(`DATE: ${formatDate(e.date)}`, pageWidth - contentMargin, contentMargin + 9, {
      align: "right",
    });

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.2);
    doc.line(contentMargin, contentMargin + 15, pageWidth - contentMargin, contentMargin + 15);

    let yPos = contentMargin + 25;

    // Amount Box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(contentMargin, yPos, pageWidth - contentMargin * 2, 35, 2, 2, "F");
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.text("TOTAL AMOUNT", pageWidth / 2, yPos + 10, { align: "center" });
    doc.setTextColor(...primaryColor);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(Number(e.amount) || 0), pageWidth / 2, yPos + 25, {
      align: "center",
    });

    yPos += 50;

    // Details Table
    const drawDetailRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      doc.text(label, contentMargin, yPos);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor);
      const lines = doc.splitTextToSize(value, pageWidth - contentMargin * 2 - 40);
      doc.text(lines, contentMargin + 40, yPos);

      yPos += lines.length * 5 + 3;
    };

    drawDetailRow("DESCRIPTION", e.description || "-");
    drawDetailRow("VENDOR / PAYEE", e.vendor?.name || "N/A");
    drawDetailRow("CATEGORY", e.category?.name || "Uncategorized");
    drawDetailRow("JOB REFERENCE", e.job?.jobNumber || "N/A");

    // Notes
    if (e.notes) {
      yPos += 5;
      doc.setFillColor(249, 250, 251);
      doc.rect(contentMargin, yPos, pageWidth - contentMargin * 2, 25, "F");
      doc.setDrawColor(229, 231, 235);
      doc.rect(contentMargin, yPos, pageWidth - contentMargin * 2, 25, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...primaryColor);
      doc.text("ADDITIONAL NOTES:", contentMargin + 3, yPos + 7);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      const noteLines = doc.splitTextToSize(e.notes, pageWidth - contentMargin * 2 - 10);
      doc.text(noteLines, contentMargin + 3, yPos + 13);
    }

    // Signatures
    const sigY = pageHeight - 45;
    const sigWidth = 40;

    const drawSig = (x: number, label: string) => {
      doc.setDrawColor(200, 200, 200);
      doc.line(x, sigY + 20, x + sigWidth, sigY + 20);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text(label, x + sigWidth / 2, sigY + 25, { align: "center" });
    };

    drawSig(contentMargin + 10, "PREPARED BY");
    drawSig(pageWidth / 2 - sigWidth / 2, "REVIEWED BY");
    drawSig(pageWidth - contentMargin - sigWidth - 10, "APPROVED BY");

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is a computer generated document. No signature required.",
      pageWidth / 2,
      pageHeight - contentMargin + 3,
      { align: "center" },
    );

    // Generate filename
    const filename = `Expense_${e.number?.replace(/\//g, "-") || "Record"}.pdf`;

    // Download the PDF directly
    doc.save(filename);
  } catch (error) {
    console.error("Failed to download expense PDF:", error);
    toast.error("Failed to download PDF. Please try again.");
  }
}
