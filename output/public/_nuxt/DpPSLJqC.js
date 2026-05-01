import { _ as p } from "./DXifQ5ls.js";
import {
  e as u,
  ab as _,
  R as i,
  Q as s,
  a2 as a,
  P as f,
  T as e,
  V as l,
  K as n,
  a0 as b,
  a1 as g,
  _ as r,
} from "./D9q6143x.js";
import { S as x } from "./CQwnAZS6.js";
import { S as v } from "./CHWjNEBX.js";
import { F as h } from "./CJ5hAAEc.js";
import { A as y } from "./CdOyNhW7.js";
const w = { class: "space-y-6 animate-fade-in p-6" },
  T = { class: "page-header" },
  k = { class: "flex items-center gap-4" },
  R = { class: "page-title" },
  F = { class: "flex gap-2" },
  S = { class: "btn-secondary" },
  B = { class: "btn-secondary" },
  j = { class: "card-elevated p-6" },
  C = { class: "flex items-center gap-4 mb-6 pb-6 border-b border-border" },
  D = { class: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center" },
  L = { class: "text-xl font-semibold" },
  N = { class: "text-muted-foreground" },
  O = { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" },
  V = { class: "space-y-1" },
  q = { class: "font-medium" },
  J = { class: "space-y-1" },
  P = { class: "font-medium" },
  U = { class: "space-y-1" },
  A = { class: "font-medium" },
  E = { class: "border-t border-border pt-6" },
  H = { class: "space-y-2" },
  K = { class: "font-medium" },
  Q = { class: "flex justify-between py-3 font-semibold text-lg" },
  M = { class: "text-primary" },
  ts = u({
    __name: "[id]",
    setup(z) {
      _().params.id;
      const o = {
        number: "QUO-2024-001",
        customer: "PT Maju Bersama",
        date: "7 Jan 2025",
        validUntil: "7 Feb 2025",
        origin: "Jakarta",
        destination: "Singapore",
        amount: "Rp 25.500.000",
        services: [
          { name: "Ocean Freight - FCL 20ft", price: "Rp 18.000.000" },
          { name: "Trucking Origin", price: "Rp 3.500.000" },
          { name: "Documentation", price: "Rp 2.500.000" },
          { name: "THC Origin", price: "Rp 1.500.000" },
        ],
      };
      return (I, t) => {
        const m = p;
        return (
          r(),
          i("div", w, [
            s("div", T, [
              s("div", k, [
                a(
                  m,
                  {
                    to: "/sales/quotation",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: f(() => [a(n(y), { class: "w-5 h-5" })]), _: 1 },
                ),
                s("div", null, [
                  s("h1", R, e(o.number), 1),
                  t[0] ||
                    (t[0] = s(
                      "p",
                      { class: "text-muted-foreground mt-1" },
                      "Detail penawaran",
                      -1,
                    )),
                ]),
              ]),
              s("div", F, [
                s("button", S, [
                  a(n(x), { class: "w-4 h-4 mr-2" }),
                  t[1] || (t[1] = l(" Kirim ", -1)),
                ]),
                s("button", B, [
                  a(n(v), { class: "w-4 h-4 mr-2" }),
                  t[2] || (t[2] = l(" Edit ", -1)),
                ]),
              ]),
            ]),
            s("div", j, [
              s("div", C, [
                s("div", D, [a(n(h), { class: "w-7 h-7 text-primary" })]),
                s("div", null, [s("h2", L, e(o.number), 1), s("p", N, e(o.customer), 1)]),
                t[3] || (t[3] = s("span", { class: "ml-auto badge-warning" }, "Terkirim", -1)),
              ]),
              s("div", O, [
                s("div", V, [
                  t[4] ||
                    (t[4] = s("p", { class: "text-sm text-muted-foreground" }, "Tanggal", -1)),
                  s("p", q, e(o.date), 1),
                ]),
                s("div", J, [
                  t[5] ||
                    (t[5] = s(
                      "p",
                      { class: "text-sm text-muted-foreground" },
                      "Berlaku Hingga",
                      -1,
                    )),
                  s("p", P, e(o.validUntil), 1),
                ]),
                s("div", U, [
                  t[6] || (t[6] = s("p", { class: "text-sm text-muted-foreground" }, "Rute", -1)),
                  s("p", A, e(o.origin) + " → " + e(o.destination), 1),
                ]),
              ]),
              s("div", E, [
                t[8] || (t[8] = s("h3", { class: "font-semibold mb-4" }, "Detail Jasa", -1)),
                s("div", H, [
                  (r(!0),
                  i(
                    b,
                    null,
                    g(
                      o.services,
                      (d, c) => (
                        r(),
                        i(
                          "div",
                          {
                            key: c,
                            class: "flex justify-between py-2 border-b border-border last:border-0",
                          },
                          [s("span", null, e(d.name), 1), s("span", K, e(d.price), 1)],
                        )
                      ),
                    ),
                    128,
                  )),
                  s("div", Q, [
                    t[7] || (t[7] = s("span", null, "Total", -1)),
                    s("span", M, e(o.amount), 1),
                  ]),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { ts as default };
