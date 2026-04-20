import { E as h } from "./BS85nYjr.js";
import "./D9q6143x.js";
const u = (l) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(l),
  p = (l) =>
    new Date(l).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
async function v(l, F) {
  try {
    const a = await F(l);
    if (!a) throw new Error("Failed to fetch expense data");
    const r = a,
      e = new h(),
      n = e.internal.pageSize.getWidth(),
      x = e.internal.pageSize.getHeight(),
      o = 20,
      i = [220, 38, 38],
      s = [31, 41, 55],
      c = [107, 114, 128];
    (e.setFillColor(...i),
      e.rect(0, 0, n, 40, "F"),
      e.setTextColor(255, 255, 255),
      e.setFontSize(24),
      e.setFont("helvetica", "bold"),
      e.text("EXPENSE RECORD", o, 25),
      e.setFontSize(12),
      e.setFont("helvetica", "normal"),
      e.text(r.number || "-", n - o, 20, { align: "right" }),
      e.text(p(r.date), n - o, 30, { align: "right" }));
    let t = 55;
    if (
      (e.setFillColor(254, 242, 242),
      e.roundedRect(o, t, n - o * 2, 40, 3, 3, "F"),
      e.setTextColor(...c),
      e.setFontSize(10),
      e.text("TOTAL AMOUNT", n / 2, t + 15, { align: "center" }),
      e.setTextColor(...i),
      e.setFontSize(28),
      e.setFont("helvetica", "bold"),
      e.text(u(Number(r.amount) || 0), n / 2, t + 32, { align: "center" }),
      (t += 55),
      e.setTextColor(...s),
      e.setFontSize(10),
      e.setFont("helvetica", "bold"),
      e.text("Description:", o, t),
      e.setFont("helvetica", "normal"),
      e.text(r.description || "-", o + 35, t),
      (t += 10),
      e.setFont("helvetica", "bold"),
      e.text("Vendor:", o, t),
      e.setFont("helvetica", "normal"),
      e.text(r.vendor?.name || "N/A", o + 35, t),
      (t += 10),
      e.setFont("helvetica", "bold"),
      e.text("Category:", o, t),
      e.setFont("helvetica", "normal"),
      e.text(r.category?.name || "Uncategorized", o + 35, t),
      (t += 10),
      e.setFont("helvetica", "bold"),
      e.text("Job Number:", o, t),
      e.setFont("helvetica", "normal"),
      e.text(r.job?.jobNumber || "N/A", o + 35, t),
      a.notes)
    ) {
      ((t += 20),
        e.setFillColor(249, 250, 251),
        e.roundedRect(o, t, n - o * 2, 30, 3, 3, "F"),
        (t += 10),
        e.setFont("helvetica", "bold"),
        e.setTextColor(...s),
        e.text("Additional Notes:", o + 5, t),
        (t += 8),
        e.setFont("helvetica", "normal"),
        e.setTextColor(...c));
      const g = e.splitTextToSize(a.notes, n - o * 2 - 10);
      e.text(g, o + 5, t);
    }
    const d = x - 15;
    (e.setFillColor(...i),
      e.rect(0, d - 5, n, 20, "F"),
      e.setTextColor(255, 255, 255),
      e.setFont("helvetica", "normal"),
      e.setFontSize(8),
      e.text("PT. Nusantara Continent - Expense Record", n / 2, d + 5, { align: "center" }));
    const m = `Expense_${r.number?.replace(/\//g, "-") || "Record"}.pdf`;
    e.save(m);
  } catch (a) {
    (console.error("Failed to download expense PDF:", a),
      alert("Failed to download PDF. Please try again."));
  }
}
export { v as generateExpensePdf };
