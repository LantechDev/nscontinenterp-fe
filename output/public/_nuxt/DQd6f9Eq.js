import { D as p } from "./BgSnr_43.js";
import { T as c } from "./DrUezNjA.js";
import { T as u } from "./DxiaezoG.js";
import {
  e as x,
  R as d,
  Q as t,
  a2 as f,
  V as r,
  K as i,
  T as e,
  a0 as g,
  a1 as _,
  O as l,
  $ as v,
  _ as n,
} from "./D9q6143x.js";
const y = { class: "space-y-6 animate-fade-in p-6" },
  b = { class: "page-header" },
  h = { class: "btn-outline" },
  R = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" },
  P = { class: "stat-card" },
  B = { class: "text-2xl font-bold text-success" },
  T = { class: "stat-card" },
  L = { class: "text-2xl font-bold text-destructive" },
  k = { class: "stat-card" },
  w = { class: "text-2xl font-bold text-primary" },
  C = { class: "stat-card" },
  D = { class: "text-2xl font-bold text-accent" },
  J = { class: "card-elevated overflow-hidden" },
  V = { class: "data-table" },
  K = { class: "flex items-center gap-2" },
  Q = x({
    __name: "profit-loss",
    setup(M) {
      const o = {
          totalRevenue: "Rp 805.000.000",
          totalCost: "Rp 542.000.000",
          grossProfit: "Rp 263.000.000",
          profitMargin: "32.7%",
        },
        m = [
          { name: "Pendapatan Jasa Pengiriman", amount: "Rp 650.000.000", type: "income" },
          { name: "Pendapatan Jasa Customs", amount: "Rp 120.000.000", type: "income" },
          { name: "Pendapatan Lainnya", amount: "Rp 35.000.000", type: "income" },
          { name: "Biaya Operasional", amount: "Rp 380.000.000", type: "expense" },
          { name: "Biaya Overhead", amount: "Rp 95.000.000", type: "expense" },
          { name: "Biaya Lainnya", amount: "Rp 67.000.000", type: "expense" },
        ];
      return (N, s) => (
        n(),
        d("div", y, [
          t("div", b, [
            s[1] ||
              (s[1] = t(
                "div",
                null,
                [
                  t("h1", { class: "page-title" }, "Laporan Laba Rugi"),
                  t("p", { class: "text-muted-foreground mt-1" }, "Periode: Januari 2025"),
                ],
                -1,
              )),
            t("button", h, [
              f(i(p), { class: "w-4 h-4 mr-2" }),
              s[0] || (s[0] = r(" Export PDF ", -1)),
            ]),
          ]),
          t("div", R, [
            t("div", P, [
              s[2] ||
                (s[2] = t(
                  "p",
                  { class: "text-sm text-muted-foreground mb-1" },
                  "Total Pendapatan",
                  -1,
                )),
              t("p", B, e(o.totalRevenue), 1),
            ]),
            t("div", T, [
              s[3] ||
                (s[3] = t("p", { class: "text-sm text-muted-foreground mb-1" }, "Total Biaya", -1)),
              t("p", L, e(o.totalCost), 1),
            ]),
            t("div", k, [
              s[4] ||
                (s[4] = t("p", { class: "text-sm text-muted-foreground mb-1" }, "Laba Kotor", -1)),
              t("p", w, e(o.grossProfit), 1),
            ]),
            t("div", C, [
              s[5] ||
                (s[5] = t("p", { class: "text-sm text-muted-foreground mb-1" }, "Margin Laba", -1)),
              t("p", D, e(o.profitMargin), 1),
            ]),
          ]),
          t("div", J, [
            t("table", V, [
              s[6] ||
                (s[6] = t(
                  "thead",
                  null,
                  [
                    t("tr", null, [
                      t("th", null, "Kategori"),
                      t("th", { class: "text-right" }, "Jumlah"),
                    ]),
                  ],
                  -1,
                )),
              t("tbody", null, [
                (n(),
                d(
                  g,
                  null,
                  _(m, (a) =>
                    t("tr", { key: a.name }, [
                      t("td", null, [
                        t("div", K, [
                          a.type === "income"
                            ? (n(), l(i(c), { key: 0, class: "w-4 h-4 text-success" }))
                            : (n(), l(i(u), { key: 1, class: "w-4 h-4 text-destructive" })),
                          r(" " + e(a.name), 1),
                        ]),
                      ]),
                      t(
                        "td",
                        {
                          class: v([
                            "text-right font-medium",
                            a.type === "income" ? "text-success" : "text-destructive",
                          ]),
                        },
                        e(a.amount),
                        3,
                      ),
                    ]),
                  ),
                  64,
                )),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { Q as default };
