import { D as p } from "./BgSnr_43.js";
import {
  c,
  e as u,
  R as n,
  Q as t,
  ah as m,
  a2 as x,
  V as r,
  K as o,
  a0 as h,
  a1 as g,
  T as s,
  O as l,
  _ as d,
} from "./D9q6143x.js";
const f = c("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }],
]);
const y = c("arrow-up", [
    ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
    ["path", { d: "M12 19V5", key: "x0mq9r" }],
  ]),
  v = { class: "space-y-6 animate-fade-in p-6" },
  _ = { class: "page-header" },
  b = { class: "btn-outline" },
  k = { class: "card-elevated overflow-hidden" },
  w = { class: "data-table" },
  R = { class: "text-muted-foreground" },
  P = { class: "flex items-center gap-2" },
  T = { class: "text-right font-medium text-success" },
  V = { class: "text-right font-medium text-destructive" },
  M = { class: "text-right font-medium" },
  S = u({
    __name: "cashflow",
    setup(D) {
      const i = [
        {
          id: "1",
          date: "7 Jan 2025",
          description: "Pembayaran dari PT Maju Bersama",
          type: "in",
          amount: "Rp 25.500.000",
          balance: "Rp 125.500.000",
        },
        {
          id: "2",
          date: "6 Jan 2025",
          description: "Pembayaran ke CV Trucking Mandiri",
          type: "out",
          amount: "Rp 3.500.000",
          balance: "Rp 100.000.000",
        },
        {
          id: "3",
          date: "5 Jan 2025",
          description: "Pembayaran dari CV Sukses Makmur",
          type: "in",
          amount: "Rp 18.250.000",
          balance: "Rp 103.500.000",
        },
        {
          id: "4",
          date: "5 Jan 2025",
          description: "Pembayaran ke PT Pelayaran Nusantara",
          type: "out",
          amount: "Rp 12.500.000",
          balance: "Rp 85.250.000",
        },
      ];
      return (B, e) => (
        d(),
        n("div", v, [
          t("div", _, [
            e[1] ||
              (e[1] = t(
                "div",
                null,
                [
                  t("h1", { class: "page-title" }, "Laporan Arus Kas"),
                  t("p", { class: "text-muted-foreground mt-1" }, "Periode: Januari 2025"),
                ],
                -1,
              )),
            t("button", b, [
              x(o(p), { class: "w-4 h-4 mr-2" }),
              e[0] || (e[0] = r(" Export PDF ", -1)),
            ]),
          ]),
          e[3] ||
            (e[3] = m(
              '<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Saldo Awal</p><p class="text-2xl font-bold">Rp 72.250.000</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Masuk</p><p class="text-2xl font-bold text-success">Rp 69.250.000</p></div><div class="stat-card"><p class="text-sm text-muted-foreground mb-1">Total Keluar</p><p class="text-2xl font-bold text-destructive">Rp 16.000.000</p></div></div>',
              1,
            )),
          t("div", k, [
            t("table", w, [
              e[2] ||
                (e[2] = t(
                  "thead",
                  null,
                  [
                    t("tr", null, [
                      t("th", null, "Tanggal"),
                      t("th", null, "Deskripsi"),
                      t("th", { class: "text-right" }, "Masuk"),
                      t("th", { class: "text-right" }, "Keluar"),
                      t("th", { class: "text-right" }, "Saldo"),
                    ]),
                  ],
                  -1,
                )),
              t("tbody", null, [
                (d(),
                n(
                  h,
                  null,
                  g(i, (a) =>
                    t("tr", { key: a.id }, [
                      t("td", R, s(a.date), 1),
                      t("td", null, [
                        t("div", P, [
                          a.type === "in"
                            ? (d(), l(o(f), { key: 0, class: "w-4 h-4 text-success" }))
                            : (d(), l(o(y), { key: 1, class: "w-4 h-4 text-destructive" })),
                          r(" " + s(a.description), 1),
                        ]),
                      ]),
                      t("td", T, s(a.type === "in" ? a.amount : "-"), 1),
                      t("td", V, s(a.type === "out" ? a.amount : "-"), 1),
                      t("td", M, s(a.balance), 1),
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
export { S as default };
