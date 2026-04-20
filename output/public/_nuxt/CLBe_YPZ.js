import { _ as V } from "./DXifQ5ls.js";
import { u as W } from "./D0dPopTU.js";
import { u as K } from "./BxSHOl50.js";
import { ExpenseEditModal as $ } from "./CPeXr-X7.js";
import { E as H } from "./BS85nYjr.js";
import {
  e as J,
  ab as q,
  r as G,
  o as Q,
  R as c,
  Q as t,
  a2 as d,
  S as X,
  K as o,
  a0 as _,
  P as Y,
  T as l,
  t as y,
  _ as m,
} from "./D9q6143x.js";
import { D as Z } from "./BgSnr_43.js";
import { T as ee } from "./DhzAXlPS.js";
import { S as te } from "./CHWjNEBX.js";
import { W as oe } from "./CCD4SlHB.js";
import { A as se } from "./CdOyNhW7.js";
import "./CJdNv5wq.js";
import "./ighQaoU7.js";
import "./BfskLp3w.js";
const ne = { class: "space-y-6 animate-fade-in p-6" },
  re = { key: 0, class: "flex justify-center py-12" },
  ie = { class: "page-header" },
  ae = { class: "flex items-center justify-between" },
  le = { class: "flex items-center gap-4" },
  de = { class: "text-2xl font-bold" },
  ce = { class: "flex items-center gap-2" },
  me = { class: "bg-white p-8 rounded-xl border border-border shadow-sm" },
  pe = { class: "flex items-center gap-6 mb-8 pb-8 border-b border-border" },
  ue = { class: "w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center" },
  xe = { class: "text-2xl font-bold" },
  ge = { class: "text-muted-foreground font-medium" },
  be = { class: "ml-auto text-right" },
  fe = { class: "text-3xl font-black text-destructive" },
  he = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
  ve = { class: "space-y-1.5 md:col-span-2 lg:col-span-3" },
  _e = { class: "text-lg font-medium" },
  ye = { class: "space-y-1.5" },
  Fe = { key: 0, class: "font-bold text-primary" },
  Ce = { key: 1, class: "text-muted-foreground" },
  we = { class: "space-y-1.5" },
  Ee = { class: "font-bold" },
  De = { class: "space-y-1.5" },
  Te = {
    class:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border",
  },
  Ne = { class: "space-y-1.5 md:col-span-2 lg:col-span-3 pt-4 border-t" },
  Se = { class: "text-sm text-foreground italic" },
  He = J({
    __name: "[id]",
    setup(ke) {
      const u = q().params.id,
        { fetchExpenseById: F, deleteExpense: C, isLoading: w } = W(),
        {
          isEditModalOpen: E,
          isSubmitting: D,
          editError: T,
          editingExpenseId: N,
          formData: S,
          categoryOptions: k,
          companies: z,
          jobs: j,
          openEditModal: A,
          closeEditModal: P,
          handleUpdate: R,
          initialize: I,
        } = K(),
        i = G(null);
      async function M() {
        try {
          i.value = await F(u);
        } catch (n) {
          (console.error("Failed to load expense:", n), y("/finance/expenses"));
        }
      }
      async function L() {
        if (confirm("Apakah Anda yakin ingin menghapus biaya ini?"))
          try {
            (await C(u), y("/finance/expenses"));
          } catch (n) {
            alert("Gagal menghapus biaya: " + n.message);
          }
      }
      const x = (n) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(n),
        g = (n) =>
          new Date(n).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
      function O() {
        if (!i.value) return;
        const n = i.value;
        try {
          const e = new H(),
            a = e.internal.pageSize.getWidth(),
            b = e.internal.pageSize.getHeight(),
            r = 20,
            p = [220, 38, 38],
            f = [31, 41, 55],
            h = [107, 114, 128];
          (e.setFillColor(...p),
            e.rect(0, 0, a, 40, "F"),
            e.setTextColor(255, 255, 255),
            e.setFontSize(24),
            e.setFont("helvetica", "bold"),
            e.text("EXPENSE RECORD", r, 25),
            e.setFontSize(12),
            e.setFont("helvetica", "normal"),
            e.text(n.number || "-", a - r, 20, { align: "right" }),
            e.text(g(n.date), a - r, 30, { align: "right" }));
          let s = 55;
          if (
            (e.setFillColor(254, 242, 242),
            e.roundedRect(r, s, a - r * 2, 40, 3, 3, "F"),
            e.setTextColor(...h),
            e.setFontSize(10),
            e.text("TOTAL AMOUNT", a / 2, s + 15, { align: "center" }),
            e.setTextColor(...p),
            e.setFontSize(28),
            e.setFont("helvetica", "bold"),
            e.text(x(Number(n.amount) || 0), a / 2, s + 32, { align: "center" }),
            (s += 55),
            e.setTextColor(...f),
            e.setFontSize(10),
            e.setFont("helvetica", "bold"),
            e.text("Description:", r, s),
            e.setFont("helvetica", "normal"),
            e.text(n.description || "-", r + 35, s),
            (s += 10),
            e.setFont("helvetica", "bold"),
            e.text("Vendor:", r, s),
            e.setFont("helvetica", "normal"),
            e.text(n.vendor?.name || "N/A", r + 35, s),
            (s += 10),
            e.setFont("helvetica", "bold"),
            e.text("Category:", r, s),
            e.setFont("helvetica", "normal"),
            e.text(n.category?.name || "Uncategorized", r + 35, s),
            (s += 10),
            e.setFont("helvetica", "bold"),
            e.text("Job Number:", r, s),
            e.setFont("helvetica", "normal"),
            e.text(n.job?.jobNumber || "N/A", r + 35, s),
            n.notes)
          ) {
            ((s += 20),
              e.setFillColor(249, 250, 251),
              e.roundedRect(r, s, a - r * 2, 30, 3, 3, "F"),
              (s += 10),
              e.setFont("helvetica", "bold"),
              e.setTextColor(...f),
              e.text("Additional Notes:", r + 5, s),
              (s += 8),
              e.setFont("helvetica", "normal"),
              e.setTextColor(...h));
            const U = e.splitTextToSize(n.notes, a - r * 2 - 10);
            e.text(U, r + 5, s);
          }
          const v = b - 15;
          (e.setFillColor(...p),
            e.rect(0, v - 5, a, 20, "F"),
            e.setTextColor(255, 255, 255),
            e.setFont("helvetica", "normal"),
            e.setFontSize(8),
            e.text("PT. Nusantara Continent - Expense Record", a / 2, v + 5, { align: "center" }));
          const B = `Expense_${n.number?.replace(/\//g, "-") || "Record"}.pdf`;
          e.save(B);
        } catch (e) {
          (console.error("Failed to download expense PDF:", e),
            alert("Failed to download PDF. Please try again."));
        }
      }
      return (
        Q(() => {
          (M(), I());
        }),
        (n, e) => {
          const a = V;
          return (
            m(),
            c(
              _,
              null,
              [
                t("div", ne, [
                  o(w) && !o(i)
                    ? (m(),
                      c("div", re, [
                        ...(e[1] ||
                          (e[1] = [
                            t(
                              "div",
                              {
                                class:
                                  "animate-spin rounded-full h-8 w-8 border-b-2 border-primary",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ]))
                    : o(i)
                      ? (m(),
                        c(
                          _,
                          { key: 1 },
                          [
                            t("div", ie, [
                              t("div", ae, [
                                t("div", le, [
                                  d(
                                    a,
                                    {
                                      to: "/finance/expenses",
                                      class: "p-2 rounded-lg hover:bg-muted transition-colors",
                                    },
                                    { default: Y(() => [d(o(se), { class: "w-5 h-5" })]), _: 1 },
                                  ),
                                  t("div", null, [
                                    t("h1", de, l(o(i).number), 1),
                                    e[2] ||
                                      (e[2] = t(
                                        "p",
                                        { class: "text-muted-foreground mt-1" },
                                        "Detail biaya operasional",
                                        -1,
                                      )),
                                  ]),
                                ]),
                                t("div", ce, [
                                  t(
                                    "button",
                                    {
                                      onClick: O,
                                      class:
                                        "flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium",
                                    },
                                    [
                                      d(o(Z), { class: "w-4 h-4" }),
                                      e[3] || (e[3] = t("span", null, "Export PDF", -1)),
                                    ],
                                  ),
                                  t(
                                    "button",
                                    {
                                      onClick: L,
                                      class:
                                        "p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
                                    },
                                    [d(o(ee), { class: "w-5 h-5" })],
                                  ),
                                  t(
                                    "button",
                                    {
                                      onClick: e[0] || (e[0] = (b) => o(A)(o(i).id)),
                                      class:
                                        "flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium",
                                    },
                                    [
                                      d(o(te), { class: "w-4 h-4" }),
                                      e[4] || (e[4] = t("span", null, "Edit", -1)),
                                    ],
                                  ),
                                ]),
                              ]),
                            ]),
                            t("div", me, [
                              t("div", pe, [
                                t("div", ue, [d(o(oe), { class: "w-8 h-8 text-destructive" })]),
                                t("div", null, [
                                  t("h2", xe, l(o(i).number), 1),
                                  t("p", ge, l(o(i).vendor?.name || "Manual Entry"), 1),
                                ]),
                                t("div", be, [
                                  e[5] ||
                                    (e[5] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground mb-1" },
                                      "Total Amount",
                                      -1,
                                    )),
                                  t("p", fe, l(x(Number(o(i).amount))), 1),
                                ]),
                              ]),
                              t("div", he, [
                                t("div", ve, [
                                  e[6] ||
                                    (e[6] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground" },
                                      "Deskripsi",
                                      -1,
                                    )),
                                  t("p", _e, l(o(i).description), 1),
                                ]),
                                t("div", ye, [
                                  e[7] ||
                                    (e[7] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground" },
                                      "No. Job",
                                      -1,
                                    )),
                                  o(i).job
                                    ? (m(), c("p", Fe, l(o(i).job.jobNumber), 1))
                                    : (m(), c("p", Ce, "N/A")),
                                ]),
                                t("div", we, [
                                  e[8] ||
                                    (e[8] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground" },
                                      "Tanggal",
                                      -1,
                                    )),
                                  t("p", Ee, l(g(o(i).date)), 1),
                                ]),
                                t("div", De, [
                                  e[9] ||
                                    (e[9] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground" },
                                      "Kategori",
                                      -1,
                                    )),
                                  t("div", null, [
                                    t("span", Te, l(o(i).category?.name || "Uncategorized"), 1),
                                  ]),
                                ]),
                                t("div", Ne, [
                                  e[10] ||
                                    (e[10] = t(
                                      "p",
                                      { class: "text-sm text-muted-foreground" },
                                      "Keterangan Tambahan",
                                      -1,
                                    )),
                                  t("p", Se, l(o(i).notes || "-"), 1),
                                ]),
                              ]),
                            ]),
                          ],
                          64,
                        ))
                      : X("", !0),
                ]),
                d(
                  o($),
                  {
                    "is-open": o(E),
                    "is-submitting": o(D),
                    "edit-error": o(T),
                    "editing-expense-id": o(N),
                    "form-data": o(S),
                    "category-options": o(k),
                    companies: o(z),
                    jobs: o(j),
                    onClose: o(P),
                    onSubmit: o(R),
                  },
                  null,
                  8,
                  [
                    "is-open",
                    "is-submitting",
                    "edit-error",
                    "editing-expense-id",
                    "form-data",
                    "category-options",
                    "companies",
                    "jobs",
                    "onClose",
                    "onSubmit",
                  ],
                ),
              ],
              64,
            )
          );
        }
      );
    },
  });
export { He as default };
