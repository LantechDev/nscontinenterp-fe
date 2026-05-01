import { _ as S } from "./DXifQ5ls.js";
import { u as R } from "./DddWBLY3.js";
import { c as z } from "./DrxnuvjT.js";
import { E as P } from "./BS85nYjr.js";
import {
  e as j,
  ab as N,
  r as E,
  o as I,
  R as m,
  S as L,
  K as s,
  Q as e,
  a0 as B,
  a2 as d,
  P as b,
  T as l,
  $,
  t as v,
  _ as p,
} from "./D9q6143x.js";
import { D as V } from "./BgSnr_43.js";
import { T as H } from "./DhzAXlPS.js";
import { C as W } from "./BHGkPdUC.js";
import { A as X } from "./CdOyNhW7.js";
import { S as q } from "./CHWjNEBX.js";
const G = { class: "space-y-6 animate-fade-in p-6" },
  K = { key: 0, class: "flex justify-center py-12" },
  M = { class: "page-header" },
  O = { class: "flex items-center justify-between" },
  Q = { class: "flex items-center gap-4" },
  U = { class: "text-2xl font-bold" },
  Y = { class: "flex items-center gap-2" },
  J = { class: "bg-white p-8 rounded-xl border border-border shadow-sm" },
  Z = { class: "flex items-center gap-6 mb-8 pb-8 border-b border-border" },
  tt = { class: "w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center" },
  et = { class: "text-2xl font-bold" },
  ot = { class: "text-muted-foreground font-medium uppercase" },
  st = { class: "ml-auto text-right" },
  at = { class: "text-3xl font-black text-[#012D5A]" },
  nt = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
  rt = { class: "space-y-1.5" },
  it = {
    class:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase bg-muted text-muted-foreground border",
  },
  lt = { class: "space-y-1.5" },
  dt = { class: "font-bold text-lg" },
  ct = { class: "space-y-1.5" },
  mt = { class: "space-y-1.5" },
  pt = { class: "font-bold" },
  xt = { class: "space-y-1.5 md:col-span-2 lg:col-span-2 pt-4 border-t" },
  ut = { class: "text-sm text-foreground italic" },
  At = j({
    __name: "[id]",
    setup(gt) {
      const x = N().params.id,
        { fetchTaxById: _, deleteTax: y, isLoading: F } = R(),
        r = E(null);
      async function T() {
        try {
          r.value = await _(x);
        } catch (a) {
          (console.error("Failed to load tax:", a), v("/finance/tax"));
        }
      }
      async function C() {
        if (confirm("Apakah Anda yakin ingin menghapus pajak ini?"))
          try {
            (await y(x), v("/finance/tax"));
          } catch (a) {
            alert("Gagal menghapus pajak: " + a.message);
          }
      }
      const u = (a) =>
        new Date(a).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      function w() {
        if (!r.value) return;
        const a = r.value;
        try {
          const t = new P(),
            i = t.internal.pageSize.getWidth(),
            D = t.internal.pageSize.getHeight(),
            n = 20,
            c = [1, 45, 90],
            g = [31, 41, 55],
            f = [107, 114, 128];
          (t.setFillColor(...c),
            t.rect(0, 0, i, 40, "F"),
            t.setTextColor(255, 255, 255),
            t.setFontSize(24),
            t.setFont("helvetica", "bold"),
            t.text("TAX RECORD", n, 25),
            t.setFontSize(12),
            t.setFont("helvetica", "normal"),
            t.text(a.type?.toUpperCase() || "TAX", i - n, 20, { align: "right" }),
            t.text(a.isActive ? "Active" : "Inactive", i - n, 30, { align: "right" }));
          let o = 55;
          if (
            (t.setFillColor(239, 246, 255),
            t.roundedRect(n, o, i - n * 2, 40, 3, 3, "F"),
            t.setTextColor(...f),
            t.setFontSize(10),
            t.text("RATE", i / 2, o + 15, { align: "center" }),
            t.setTextColor(...c),
            t.setFontSize(32),
            t.setFont("helvetica", "bold"),
            t.text(`${a.rate}%`, i / 2, o + 32, { align: "center" }),
            (o += 55),
            t.setTextColor(...g),
            t.setFontSize(10),
            t.setFont("helvetica", "bold"),
            t.text("Tax Name:", n, o),
            t.setFont("helvetica", "normal"),
            t.text(a.name || "-", n + 35, o),
            (o += 10),
            t.setFont("helvetica", "bold"),
            t.text("Type:", n, o),
            t.setFont("helvetica", "normal"),
            t.text(a.type || "-", n + 35, o),
            (o += 10),
            t.setFont("helvetica", "bold"),
            t.text("Created Date:", n, o),
            t.setFont("helvetica", "normal"),
            t.text(a.createdAt ? u(a.createdAt) : "-", n + 35, o),
            (o += 10),
            t.setFont("helvetica", "bold"),
            t.text("Status:", n, o),
            t.setFont("helvetica", "normal"),
            t.text(a.isActive ? "Active" : "Inactive", n + 35, o),
            a.description)
          ) {
            ((o += 20),
              t.setFillColor(249, 250, 251),
              t.roundedRect(n, o, i - n * 2, 30, 3, 3, "F"),
              (o += 10),
              t.setFont("helvetica", "bold"),
              t.setTextColor(...g),
              t.text("Description:", n + 5, o),
              (o += 8),
              t.setFont("helvetica", "normal"),
              t.setTextColor(...f));
            const k = t.splitTextToSize(a.description, i - n * 2 - 10);
            t.text(k, n + 5, o);
          }
          const h = D - 15;
          (t.setFillColor(...c),
            t.rect(0, h - 5, i, 20, "F"),
            t.setTextColor(255, 255, 255),
            t.setFont("helvetica", "normal"),
            t.setFontSize(8),
            t.text("PT. Nusantara Continent - Tax Record", i / 2, h + 5, { align: "center" }));
          const A = `Tax_${a.name?.replace(/\s+/g, "_") || "Record"}.pdf`;
          t.save(A);
        } catch (t) {
          (console.error("Failed to download tax PDF:", t),
            alert("Failed to download PDF. Please try again."));
        }
      }
      return (
        I(() => {
          T();
        }),
        (a, t) => {
          const i = S;
          return (
            p(),
            m("div", G, [
              s(F) && !s(r)
                ? (p(),
                  m("div", K, [
                    ...(t[0] ||
                      (t[0] = [
                        e(
                          "div",
                          { class: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" },
                          null,
                          -1,
                        ),
                      ])),
                  ]))
                : s(r)
                  ? (p(),
                    m(
                      B,
                      { key: 1 },
                      [
                        e("div", M, [
                          e("div", O, [
                            e("div", Q, [
                              d(
                                i,
                                {
                                  to: "/finance/tax",
                                  class: "p-2 rounded-lg hover:bg-muted transition-colors",
                                },
                                { default: b(() => [d(s(X), { class: "w-5 h-5" })]), _: 1 },
                              ),
                              e("div", null, [
                                e("h1", U, l(s(r).name), 1),
                                t[1] ||
                                  (t[1] = e(
                                    "p",
                                    { class: "text-muted-foreground mt-1" },
                                    "Detail catatan pajak",
                                    -1,
                                  )),
                              ]),
                            ]),
                            e("div", Y, [
                              e(
                                "button",
                                {
                                  onClick: w,
                                  class:
                                    "flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium",
                                },
                                [
                                  d(s(V), { class: "w-4 h-4" }),
                                  t[2] || (t[2] = e("span", null, "Export PDF", -1)),
                                ],
                              ),
                              e(
                                "button",
                                {
                                  onClick: C,
                                  class:
                                    "p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
                                },
                                [d(s(H), { class: "w-5 h-5" })],
                              ),
                              d(
                                i,
                                {
                                  to: `/finance/tax/edit/${s(r).id}`,
                                  class:
                                    "flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium",
                                },
                                {
                                  default: b(() => [
                                    d(s(q), { class: "w-4 h-4" }),
                                    t[3] || (t[3] = e("span", null, "Edit", -1)),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["to"],
                              ),
                            ]),
                          ]),
                        ]),
                        e("div", J, [
                          e("div", Z, [
                            e("div", tt, [d(s(W), { class: "w-8 h-8 text-[#012D5A]" })]),
                            e("div", null, [
                              e("h2", et, l(s(r).name), 1),
                              e("p", ot, l(s(r).type), 1),
                            ]),
                            e("div", st, [
                              t[4] ||
                                (t[4] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground mb-1" },
                                  "Rate",
                                  -1,
                                )),
                              e("p", at, l(s(r).rate) + "%", 1),
                            ]),
                          ]),
                          e("div", nt, [
                            e("div", rt, [
                              t[5] ||
                                (t[5] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground" },
                                  "Tipe Pajak",
                                  -1,
                                )),
                              e("span", it, l(s(r).type), 1),
                            ]),
                            e("div", lt, [
                              t[6] ||
                                (t[6] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground" },
                                  "Rate",
                                  -1,
                                )),
                              e("p", dt, l(s(r).rate) + "%", 1),
                            ]),
                            e("div", ct, [
                              t[7] ||
                                (t[7] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground" },
                                  "Status",
                                  -1,
                                )),
                              e(
                                "span",
                                {
                                  class: $(
                                    s(z)(
                                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                      s(r).isActive
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-gray-100 text-gray-500 border-gray-200",
                                    ),
                                  ),
                                },
                                l(s(r).isActive ? "Aktif" : "Nonaktif"),
                                3,
                              ),
                            ]),
                            e("div", mt, [
                              t[8] ||
                                (t[8] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground" },
                                  "Tanggal Dibuat",
                                  -1,
                                )),
                              e("p", pt, l(u(s(r).createdAt)), 1),
                            ]),
                            e("div", xt, [
                              t[9] ||
                                (t[9] = e(
                                  "p",
                                  { class: "text-sm text-muted-foreground" },
                                  "Deskripsi",
                                  -1,
                                )),
                              e("p", ut, l(s(r).description || "-"), 1),
                            ]),
                          ]),
                        ]),
                      ],
                      64,
                    ))
                  : L("", !0),
            ])
          );
        }
      );
    },
  });
export { At as default };
