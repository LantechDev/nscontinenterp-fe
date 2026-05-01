import { _ as R } from "./DXifQ5ls.js";
import { c as P } from "./DrxnuvjT.js";
import { _ as D } from "./j4w9AyIt.js";
import {
  e as C,
  ab as j,
  r as l,
  o as L,
  R as c,
  a2 as d,
  K as s,
  Z as N,
  a0 as F,
  Q as e,
  P as y,
  T as i,
  $ as h,
  V as u,
  _ as p,
} from "./D9q6143x.js";
import { u as V } from "./DivQEVj9.js";
import { S as B } from "./CHWjNEBX.js";
import { P as w } from "./Bigz6vPD.js";
import { A as E } from "./CdOyNhW7.js";
import "./DhCF3Kco.js";
import "./DKEGG4ny.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./CWUm5Boh.js";
import "./C0WRWJjF.js";
import "./CfuPgfv3.js";
const T = { class: "space-y-6 animate-fade-in p-6" },
  U = { key: 0, class: "flex items-center justify-center py-20" },
  $ = { class: "page-header" },
  z = { class: "flex items-center gap-4" },
  M = { class: "page-title" },
  O = { class: "text-muted-foreground mt-1" },
  q = { class: "flex items-center gap-3" },
  G = { class: "grid grid-cols-1 lg:grid-cols-4 gap-6" },
  K = { class: "lg:col-span-3 space-y-6" },
  Q = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  Z = { class: "p-4 border-b border-border bg-slate-50 flex items-center gap-4" },
  H = { class: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center" },
  J = { class: "p-6" },
  W = { class: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm" },
  X = { class: "space-y-1" },
  Y = { class: "font-bold text-slate-900" },
  ee = { class: "space-y-1" },
  te = { class: "font-bold text-slate-900 capitalize" },
  se = { class: "space-y-1" },
  oe = { class: "font-bold text-slate-900" },
  re = { class: "space-y-1" },
  ie = { class: "font-bold text-[#012D5A]" },
  de = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  ne = { class: "border border-border rounded-xl bg-white p-6 relative overflow-hidden" },
  ae = { class: "flex items-center justify-between mb-4" },
  le = {
    class:
      "px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase leading-none",
  },
  ce = { class: "text-2xl font-black text-slate-800 tabular-nums leading-none" },
  ue = { class: "border border-border rounded-xl bg-white p-6 relative overflow-hidden" },
  pe = { class: "flex items-center justify-between mb-4" },
  me = {
    class: "px-2 py-1 bg-[#012D5A] rounded text-[10px] font-bold text-white uppercase leading-none",
  },
  xe = { class: "text-2xl font-black text-[#012D5A] tabular-nums leading-none" },
  fe = { class: "space-y-6" },
  ge = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  ve = { class: "p-5 space-y-4" },
  be = { class: "space-y-1" },
  _e = { class: "text-sm font-semibold text-slate-700" },
  ye = { class: "space-y-1" },
  he = { class: "text-sm font-semibold text-slate-700" },
  we = { class: "border border-border border-dashed rounded-xl p-4 bg-slate-50/50" },
  Se = { class: "text-[11px] text-muted-foreground leading-relaxed font-medium" },
  ke = { key: 2, class: "flex flex-col items-center justify-center py-20 text-muted-foreground" },
  Me = C({
    __name: "[id]",
    setup(Ie) {
      const f = j().params.id,
        { getService: S, isLoading: k, updateService: I } = V(),
        o = l(null);
      L(async () => {
        const r = await S(f);
        r.success && (o.value = r.data || null);
      });
      const g = (r, t = "IDR") =>
          r
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: t,
                minimumFractionDigits: 0,
              }).format(r)
            : `${t} 0`,
        v = (r) =>
          new Date(r).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        a = l(!1),
        m = l(!1),
        x = l(null),
        b = (r) => {
          const t = r.replace(/[^\d]/g, "");
          return parseInt(t) || 0;
        },
        A = async (r) => {
          ((m.value = !0), (x.value = null));
          const t = {
              name: r.name,
              code: r.code,
              vendorPrice: b(r.vendorPrice),
              customerPrice: b(r.customerPrice),
              currency: r.currency,
              taxRate: parseFloat(r.taxRate) || 0,
              unitId: r.unitId || void 0,
              categoryId: r.categoryId || void 0,
              isActive: r.status === "Active",
            },
            n = await I(f, t);
          (n.success
            ? ((o.value = n.data || null), (a.value = !1))
            : (x.value = n.error || "Failed to update service"),
            (m.value = !1));
        };
      return (r, t) => {
        const n = R;
        return (
          p(),
          c("div", T, [
            s(k)
              ? (p(), c("div", U, [d(s(N), { class: "w-8 h-8 animate-spin text-primary" })]))
              : s(o)
                ? (p(),
                  c(
                    F,
                    { key: 1 },
                    [
                      e("div", $, [
                        e("div", z, [
                          d(
                            n,
                            {
                              to: "/master/services",
                              class: "p-2 rounded-lg hover:bg-muted transition-colors",
                            },
                            { default: y(() => [d(s(E), { class: "w-5 h-5" })]), _: 1 },
                          ),
                          e("div", null, [
                            e("h1", M, i(s(o).name), 1),
                            e("p", O, "Detail jasa untuk " + i(s(o).code), 1),
                          ]),
                        ]),
                        e("div", q, [
                          e(
                            "div",
                            {
                              class: h(
                                s(P)(
                                  "px-3 py-1 rounded-full text-xs font-medium",
                                  s(o).isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700",
                                ),
                              ),
                            },
                            i(s(o).isActive ? "Active" : "Inactive"),
                            3,
                          ),
                          e(
                            "button",
                            {
                              onClick: t[0] || (t[0] = (_) => (a.value = !0)),
                              class: "btn-secondary",
                            },
                            [d(s(B), { class: "w-4 h-4 mr-2" }), t[2] || (t[2] = u(" Edit ", -1))],
                          ),
                        ]),
                      ]),
                      e("div", G, [
                        e("div", K, [
                          e("div", Q, [
                            e("div", Z, [
                              e("div", H, [d(s(w), { class: "w-5 h-5 text-primary" })]),
                              t[3] ||
                                (t[3] = e(
                                  "div",
                                  null,
                                  [
                                    e(
                                      "h2",
                                      { class: "font-bold text-foreground" },
                                      "Service Information",
                                    ),
                                    e(
                                      "p",
                                      {
                                        class:
                                          "text-[10px] font-medium text-muted-foreground uppercase tracking-widest",
                                      },
                                      " General details & classification ",
                                    ),
                                  ],
                                  -1,
                                )),
                            ]),
                            e("div", J, [
                              e("div", W, [
                                e("div", X, [
                                  t[4] ||
                                    (t[4] = e(
                                      "p",
                                      { class: "text-muted-foreground font-medium" },
                                      "Service Code",
                                      -1,
                                    )),
                                  e("p", Y, i(s(o).code), 1),
                                ]),
                                e("div", ee, [
                                  t[5] ||
                                    (t[5] = e(
                                      "p",
                                      { class: "text-muted-foreground font-medium" },
                                      "Category",
                                      -1,
                                    )),
                                  e("p", te, i(s(o).category?.name || "-"), 1),
                                ]),
                                e("div", se, [
                                  t[6] ||
                                    (t[6] = e(
                                      "p",
                                      { class: "text-muted-foreground font-medium" },
                                      "Unit",
                                      -1,
                                    )),
                                  e("p", oe, i(s(o).unit?.name || "-"), 1),
                                ]),
                                e("div", re, [
                                  t[7] ||
                                    (t[7] = e(
                                      "p",
                                      { class: "text-muted-foreground font-medium" },
                                      "Tax Rate",
                                      -1,
                                    )),
                                  e("p", ie, i(s(o).taxRate || 0) + "%", 1),
                                ]),
                              ]),
                            ]),
                          ]),
                          e("div", de, [
                            e("div", ne, [
                              e("div", ae, [
                                t[8] ||
                                  (t[8] = e(
                                    "p",
                                    {
                                      class:
                                        "text-xs font-bold uppercase tracking-widest text-muted-foreground",
                                    },
                                    " Net Cost (Vendor) ",
                                    -1,
                                  )),
                                e("div", le, i(s(o).currency || "IDR"), 1),
                              ]),
                              e(
                                "p",
                                ce,
                                i(
                                  g(s(o).vendorPrice, s(o).currency || "IDR")
                                    .replace(s(o).currency || "IDR", "")
                                    .trim(),
                                ),
                                1,
                              ),
                              t[9] ||
                                (t[9] = e(
                                  "p",
                                  { class: "text-[11px] text-muted-foreground mt-3 font-medium" },
                                  " Purchasing rate from primary vendor. ",
                                  -1,
                                )),
                            ]),
                            e("div", ue, [
                              e("div", pe, [
                                t[10] ||
                                  (t[10] = e(
                                    "p",
                                    {
                                      class:
                                        "text-xs font-bold uppercase tracking-widest text-[#012D5A]",
                                    },
                                    " Selling Price (Customer) ",
                                    -1,
                                  )),
                                e("div", me, i(s(o).currency || "IDR"), 1),
                              ]),
                              e(
                                "p",
                                xe,
                                i(
                                  g(s(o).customerPrice, s(o).currency || "IDR")
                                    .replace(s(o).currency || "IDR", "")
                                    .trim(),
                                ),
                                1,
                              ),
                              t[11] ||
                                (t[11] = e(
                                  "div",
                                  { class: "flex items-center gap-1.5 mt-3" },
                                  [
                                    e("div", { class: "w-1.5 h-1.5 rounded-full bg-green-500" }),
                                    e(
                                      "p",
                                      { class: "text-[11px] text-green-600 font-bold uppercase" },
                                      "Standard Sales Rate",
                                    ),
                                  ],
                                  -1,
                                )),
                            ]),
                          ]),
                        ]),
                        e("div", fe, [
                          e("div", ge, [
                            t[14] ||
                              (t[14] = e(
                                "div",
                                { class: "p-4 bg-slate-50 border-b border-border" },
                                [
                                  e(
                                    "h3",
                                    {
                                      class:
                                        "font-bold text-xs uppercase tracking-widest text-slate-500",
                                    },
                                    "Metadata",
                                  ),
                                ],
                                -1,
                              )),
                            e("div", ve, [
                              e("div", be, [
                                t[12] ||
                                  (t[12] = e(
                                    "p",
                                    {
                                      class:
                                        "text-[10px] font-bold uppercase text-muted-foreground",
                                    },
                                    "Registered At",
                                    -1,
                                  )),
                                e("p", _e, i(v(s(o).createdAt)), 1),
                              ]),
                              e("div", ye, [
                                t[13] ||
                                  (t[13] = e(
                                    "p",
                                    {
                                      class:
                                        "text-[10px] font-bold uppercase text-muted-foreground",
                                    },
                                    "Last Updated",
                                    -1,
                                  )),
                                e("p", he, i(v(s(o).updatedAt)), 1),
                              ]),
                            ]),
                          ]),
                          e("div", we, [
                            t[17] ||
                              (t[17] = e(
                                "p",
                                {
                                  class:
                                    "text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest",
                                },
                                " Service Status ",
                                -1,
                              )),
                            e("p", Se, [
                              t[15] || (t[15] = u(" This service is currently ", -1)),
                              e(
                                "span",
                                {
                                  class: h(
                                    s(o).isActive
                                      ? "text-green-600 font-bold"
                                      : "text-red-600 font-bold",
                                  ),
                                },
                                i(s(o).isActive ? "operational" : "suspended"),
                                3,
                              ),
                              t[16] || (t[16] = u(". ", -1)),
                            ]),
                          ]),
                        ]),
                      ]),
                    ],
                    64,
                  ))
                : (p(),
                  c("div", ke, [
                    d(s(w), { class: "w-12 h-12 mb-4 opacity-20" }),
                    t[19] || (t[19] = e("p", null, "Service not found", -1)),
                    d(
                      n,
                      { to: "/master/services", class: "mt-4 text-primary hover:underline" },
                      {
                        default: y(() => [...(t[18] || (t[18] = [u(" Back to Services ", -1)]))]),
                        _: 1,
                      },
                    ),
                  ])),
            d(
              s(D),
              {
                "is-open": s(a),
                "is-submitting": s(m),
                error: s(x),
                "initial-data": s(o),
                "onUpdate:isOpen": t[1] || (t[1] = (_) => (a.value = _)),
                onSubmit: A,
              },
              null,
              8,
              ["is-open", "is-submitting", "error", "initial-data"],
            ),
          ])
        );
      };
    },
  });
export { Me as default };
