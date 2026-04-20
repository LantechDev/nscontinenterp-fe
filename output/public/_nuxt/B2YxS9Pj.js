import { E as u } from "./BS85nYjr.js";
import { f as r, t as F } from "./DrxnuvjT.js";
import "./D9q6143x.js";
const x = [1, 45, 90],
  s = [31, 41, 55],
  h = [107, 114, 128],
  d = [229, 231, 235];
function b(n) {
  return (
    { PAID: "LUNAS", UNPAID: "BELUM LUNAS", PARTIALLY_PAID: "SEBAGIAN", OVERDUE: "JATUH TEMPO" }[
      n
    ] || n
  );
}
function T(n) {
  return new Date(n).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
async function I(n) {
  const t = new u(),
    a = t.internal.pageSize.getWidth(),
    g = t.internal.pageSize.getHeight(),
    o = 20,
    i = a - o * 2;
  let e = o;
  (t.setFillColor(...x),
    t.rect(0, 0, a, 40, "F"),
    t.setTextColor(255, 255, 255),
    t.setFontSize(24),
    t.setFont("helvetica", "bold"),
    t.text("INVOICE", o, 25),
    t.setFontSize(12),
    t.setFont("helvetica", "normal"),
    t.text(n.invoiceNumber, a - o, 20, { align: "right" }),
    t.text(b(n.status?.code || ""), a - o, 30, { align: "right" }),
    (e = 55),
    t.setTextColor(...s),
    t.setFontSize(10),
    t.setFont("helvetica", "bold"),
    t.text("From:", o, e),
    t.setFont("helvetica", "normal"),
    t.text("PT. Nusantara Continent", o, e + 7),
    t.setTextColor(...h),
    t.text("Jakarta, Indonesia", o, e + 14),
    t.setTextColor(...s),
    t.setFont("helvetica", "bold"),
    t.text("Invoice Date:", a - o - 50, e),
    t.setFont("helvetica", "normal"),
    t.text(T(n.issuedDate), a - o, e, { align: "right" }),
    t.setFont("helvetica", "bold"),
    t.text("Due Date:", a - o - 50, e + 7),
    t.setFont("helvetica", "normal"),
    t.text(T(n.dueDate), a - o, e + 7, { align: "right" }),
    n.job &&
      (t.setFont("helvetica", "bold"),
      t.text("Job Reference:", a - o - 50, e + 14),
      t.setFont("helvetica", "normal"),
      t.text(n.job.jobNumber, a - o, e + 14, { align: "right" })),
    (e += 35),
    t.setDrawColor(...d),
    t.line(o, e, a - o, e),
    (e += 10),
    t.setFont("helvetica", "bold"),
    t.setFontSize(10),
    t.text("BILL TO:", o, e),
    (e += 7),
    t.setTextColor(...s),
    t.setFont("helvetica", "bold"),
    t.setFontSize(12),
    t.text(n.company?.name || "-", o, e),
    (e += 7),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.setTextColor(...h),
    n.company?.address && (t.text(n.company.address, o, e), (e += 6)),
    n.company?.email && (t.text(n.company.email, o, e), (e += 6)),
    n.company?.phone && (t.text(n.company.phone, o, e), (e += 6)),
    (e += 15),
    t.setFillColor(...x),
    t.rect(o, e, i, 10, "F"),
    t.setTextColor(255, 255, 255),
    t.setFont("helvetica", "bold"),
    t.setFontSize(9),
    t.text("DESCRIPTION", o + 5, e + 7),
    t.text("QTY", o + 95, e + 7, { align: "center" }),
    t.text("UNIT PRICE", o + 125, e + 7, { align: "right" }),
    t.text("AMOUNT", a - o - 5, e + 7, { align: "right" }),
    (e += 10),
    t.setTextColor(...s),
    t.setFont("helvetica", "normal"),
    t.setFontSize(9));
  for (const l of n.items)
    (e > g - 50 && (t.addPage(), (e = o)),
      t.setFillColor(249, 250, 251),
      t.rect(o, e, i, 12, "F"),
      t.text(l.description, o + 5, e + 8),
      t.text(String(l.quantity), o + 95, e + 8, { align: "center" }),
      t.text(r(l.unitPrice), o + 125, e + 8, { align: "right" }),
      t.text(r(l.amount), a - o - 5, e + 8, { align: "right" }),
      (e += 12));
  (t.setDrawColor(...d), t.line(o, e, a - o, e), (e += 15));
  const c = a - o - 80;
  if (
    (t.setTextColor(...s),
    t.setFont("helvetica", "normal"),
    t.setFontSize(10),
    t.text("Subtotal:", c, e),
    t.text(r(F(n.subTotal) || 0), a - o, e, { align: "right" }),
    (e += 8),
    t.text("Pajak (PPN):", c, e),
    t.text(r(F(n.taxAmount) || 0), a - o, e, { align: "right" }),
    (e += 12),
    t.setDrawColor(...x),
    t.setLineWidth(0.5),
    t.line(c - 5, e, a - o, e),
    (e += 8),
    t.setFont("helvetica", "bold"),
    t.setFontSize(12),
    t.text("TOTAL:", c, e),
    t.text(r(F(n.total)), a - o, e, { align: "right" }),
    (e += 20),
    n.notes)
  ) {
    (e > g - 40 && (t.addPage(), (e = o)),
      t.setFillColor(249, 250, 251),
      t.rect(o, e, i, 30, "F"),
      t.setFont("helvetica", "bold"),
      t.setFontSize(10),
      t.setTextColor(...s),
      t.text("Notes:", o + 5, e + 8),
      t.setFont("helvetica", "normal"),
      t.setFontSize(9),
      t.setTextColor(...h));
    const l = t.splitTextToSize(n.notes, i - 10);
    t.text(l, o + 5, e + 16);
  }
  const m = g - 15;
  (t.setFillColor(...x),
    t.rect(0, m - 5, a, 20, "F"),
    t.setTextColor(255, 255, 255),
    t.setFont("helvetica", "normal"),
    t.setFontSize(8),
    t.text("Thank you for your business!", a / 2, m + 5, { align: "center" }));
  const C = `Invoice_${n.invoiceNumber.replace(/\//g, "-")}.pdf`;
  t.save(C);
}
export { I as generateInvoicePdf };
