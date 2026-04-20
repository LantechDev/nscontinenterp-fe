import { _ as Q } from "./DXifQ5ls.js";
import { _ as E } from "./Doao-lii.js";
import {
  r as k,
  L as D,
  d as N,
  e as F,
  o as I,
  q as M,
  R as g,
  Q as t,
  $ as _,
  K as r,
  a2 as d,
  ah as R,
  P as V,
  a0 as $,
  a1 as C,
  T as c,
  aa as K,
  t as T,
  Y as A,
  _ as x,
} from "./D9q6143x.js";
import { c as w } from "./DrxnuvjT.js";
import { L as U, a as z } from "./BopvTZHI.js";
import { S as G } from "./DK0cRrZx.js";
import { P as O } from "./CWUm5Boh.js";
import { F as L } from "./CJ5hAAEc.js";
import { E as P } from "./DeUJRdQC.js";
import { S as Y } from "./CQwnAZS6.js";
function y(i) {
  if (i && typeof i == "object" && "data" in i) {
    const o = i.data;
    if (o?.message) return o.message;
    if (o?.error) return o.error;
  }
  return i instanceof Error ? i.message : "An error occurred";
}
function H(i, o) {
  return i * o;
}
function J(i) {
  const o = i.reduce((v, f) => v + f.quantity * f.unitPrice, 0),
    u = o * 0.11,
    m = o + u;
  return { subTotal: o, taxAmount: u, total: m };
}
function W() {
  const i = N(),
    o = k(!1),
    u = D("quotations-list", () => []),
    m = D("quotations-current", () => null);
  async function v(l, n) {
    o.value = !0;
    try {
      const s = await $fetch(`${i.public.apiBase}/marketing/quotations`, {
        params: { search: l, status: n },
        credentials: "include",
      });
      return ((u.value = s || []), { success: !0, data: u.value });
    } catch (s) {
      return { success: !1, error: y(s) };
    } finally {
      o.value = !1;
    }
  }
  async function f(l) {
    o.value = !0;
    try {
      const n = await $fetch(`${i.public.apiBase}/marketing/quotations/${l}`, {
        credentials: "include",
      });
      return ((m.value = n), { success: !0, data: n });
    } catch (n) {
      return { success: !1, error: y(n) };
    } finally {
      o.value = !1;
    }
  }
  async function b(l) {
    o.value = !0;
    try {
      const n = await $fetch(`${i.public.apiBase}/marketing/quotations`, {
        method: "POST",
        body: l,
        credentials: "include",
      });
      return ((u.value = [...u.value, n]), { success: !0, data: n });
    } catch (n) {
      return { success: !1, error: y(n) };
    } finally {
      o.value = !1;
    }
  }
  async function p(l, n) {
    o.value = !0;
    try {
      const s = await $fetch(`${i.public.apiBase}/marketing/quotations/${l}`, {
        method: "PUT",
        body: n,
        credentials: "include",
      });
      return (
        m.value?.id === l && (m.value = s),
        (u.value = u.value.map((e) => (e.id === l ? { ...e, ...s } : e))),
        { success: !0, data: s }
      );
    } catch (s) {
      return { success: !1, error: y(s) };
    } finally {
      o.value = !1;
    }
  }
  async function h(l) {
    o.value = !0;
    try {
      return (
        await $fetch(`${i.public.apiBase}/marketing/quotations/${l}`, {
          method: "DELETE",
          credentials: "include",
        }),
        (u.value = u.value.filter((n) => n.id !== l)),
        m.value?.id === l && (m.value = null),
        { success: !0 }
      );
    } catch (n) {
      return { success: !1, error: y(n) };
    } finally {
      o.value = !1;
    }
  }
  return {
    quotations: u,
    currentQuotation: m,
    isLoading: o,
    fetchQuotations: v,
    getQuotation: f,
    createQuotation: b,
    updateQuotation: p,
    deleteQuotation: h,
    calculateItemAmount: H,
    calculateTotals: J,
  };
}
const X = { class: "space-y-6 animate-fade-in p-6" },
  Z = { class: "flex items-center justify-between" },
  q = { class: "flex items-center gap-2" },
  tt = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  et = { class: "flex items-center justify-between gap-4" },
  st = { class: "relative w-full max-w-sm" },
  ot = { class: "flex items-center gap-3" },
  rt = { key: 0, class: "border border-border rounded-xl bg-white overflow-hidden" },
  at = { class: "overflow-x-auto" },
  nt = { class: "w-full" },
  it = ["onClick"],
  lt = { class: "py-3 px-4" },
  ut = { class: "flex items-center gap-2" },
  dt = { class: "p-1.5 rounded bg-blue-50 text-[#012D5A]" },
  ct = { class: "text-sm font-medium" },
  mt = { class: "py-3 px-4 text-sm font-medium" },
  ft = { class: "py-3 px-4 text-sm text-muted-foreground" },
  pt = { class: "py-3 px-4 text-sm font-medium" },
  gt = { class: "py-3 px-4" },
  xt = { class: "py-3 px-4 text-right" },
  bt = { class: "text-muted-foreground hover:text-foreground" },
  ht = { key: 1, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  vt = ["onClick"],
  yt = { class: "flex items-start justify-between mb-4" },
  _t = { class: "flex items-start gap-4" },
  wt = {
    class:
      "w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0",
  },
  kt = { class: "font-bold text-base text-foreground" },
  Dt = { class: "text-xs text-muted-foreground" },
  $t = { class: "space-y-3 mb-4" },
  Ct = { class: "text-sm font-medium" },
  Tt = { class: "text-lg font-bold text-[#012D5A]" },
  At = { class: "flex items-center justify-between pt-4 border-t border-border" },
  Lt = { class: "flex gap-2" },
  Pt = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  Vt = F({
    __name: "index",
    setup(i) {
      const { quotations: o, fetchQuotations: u } = W();
      I(async () => {
        await u();
      });
      function m(s) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(s);
      }
      function v(s) {
        return new Date(s).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      const f = M(() =>
          o.value.map((s) => ({
            id: s.id,
            number: s.number,
            customer: s.customer?.name || "-",
            date: v(s.date),
            amount: m(s.total),
            status: s.status.toLowerCase(),
          })),
        ),
        b = {
          draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
          sent: { label: "Terkirim", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
          accepted: { label: "Diterima", class: "bg-green-50 text-green-700 border-green-200" },
          rejected: { label: "Ditolak", class: "bg-red-50 text-red-700 border-red-200" },
        },
        p = k("list"),
        h = k(1),
        l = k({ total: 0, limit: 10, page: 1 }),
        n = (s) => {
          ((h.value = s), u());
        };
      return (s, e) => {
        const S = Q,
          j = E;
        return (
          x(),
          g("div", X, [
            t("div", Z, [
              e[5] ||
                (e[5] = t(
                  "div",
                  null,
                  [
                    t("h1", { class: "text-2xl font-bold" }, "Penawaran"),
                    t(
                      "p",
                      { class: "text-muted-foreground mt-1" },
                      "Kelola quotation dan penawaran harga",
                    ),
                  ],
                  -1,
                )),
              t("div", q, [
                t("div", tt, [
                  t(
                    "button",
                    {
                      onClick: e[0] || (e[0] = (a) => (p.value = "list")),
                      class: _(
                        r(w)(
                          "p-1.5 rounded transition-colors",
                          r(p) === "list"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [d(r(U), { class: "w-4 h-4" })],
                    2,
                  ),
                  t(
                    "button",
                    {
                      onClick: e[1] || (e[1] = (a) => (p.value = "grid")),
                      class: _(
                        r(w)(
                          "p-1.5 rounded transition-colors",
                          r(p) === "grid"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [d(r(z), { class: "w-4 h-4" })],
                    2,
                  ),
                ]),
              ]),
            ]),
            t("div", et, [
              t("div", st, [
                d(r(G), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                e[6] ||
                  (e[6] = t(
                    "input",
                    {
                      type: "text",
                      placeholder: "Cari penawaran...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    -1,
                  )),
              ]),
              t("div", ot, [
                e[8] ||
                  (e[8] = R(
                    '<select class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"><option value="">Semua Status</option><option value="draft">Draft</option><option value="sent">Terkirim</option><option value="accepted">Diterima</option><option value="rejected">Ditolak</option></select>',
                    1,
                  )),
                d(
                  S,
                  {
                    to: "/sales/quotation/create",
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  {
                    default: V(() => [
                      d(r(O), { class: "w-4 h-4" }),
                      e[7] || (e[7] = t("span", null, "Buat Penawaran", -1)),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
            r(p) === "list"
              ? (x(),
                g("div", rt, [
                  t("div", at, [
                    t("table", nt, [
                      e[9] ||
                        (e[9] = t(
                          "thead",
                          null,
                          [
                            t("tr", { class: "border-b border-border bg-white text-left" }, [
                              t(
                                "th",
                                { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                "No. Penawaran",
                              ),
                              t(
                                "th",
                                { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                "Customer",
                              ),
                              t(
                                "th",
                                { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                "Tanggal",
                              ),
                              t(
                                "th",
                                { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                "Total",
                              ),
                              t(
                                "th",
                                { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                "Status",
                              ),
                              t("th", { class: "py-3 px-4 w-10" }),
                            ]),
                          ],
                          -1,
                        )),
                      t("tbody", null, [
                        (x(!0),
                        g(
                          $,
                          null,
                          C(
                            r(f),
                            (a) => (
                              x(),
                              g(
                                "tr",
                                {
                                  key: a.id,
                                  class:
                                    "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                                  onClick: (B) =>
                                    ("navigateTo" in s ? s.navigateTo : r(T))(
                                      `/sales/quotation/${a.id}`,
                                    ),
                                },
                                [
                                  t("td", lt, [
                                    t("div", ut, [
                                      t("div", dt, [d(r(L), { class: "w-4 h-4" })]),
                                      t("span", ct, c(a.number), 1),
                                    ]),
                                  ]),
                                  t("td", mt, c(a.customer), 1),
                                  t("td", ft, c(a.date), 1),
                                  t("td", pt, c(a.amount), 1),
                                  t("td", gt, [
                                    t(
                                      "span",
                                      {
                                        class: _(
                                          r(w)(
                                            "px-2 py-0.5 rounded border text-xs font-medium",
                                            b[a.status]?.class,
                                          ),
                                        ),
                                      },
                                      c(b[a.status]?.label),
                                      3,
                                    ),
                                  ]),
                                  t("td", xt, [t("button", bt, [d(r(P), { class: "w-4 h-4" })])]),
                                ],
                                8,
                                it,
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]),
                  ]),
                ]))
              : (x(),
                g("div", ht, [
                  (x(!0),
                  g(
                    $,
                    null,
                    C(
                      r(f),
                      (a) => (
                        x(),
                        g(
                          "div",
                          {
                            key: a.id,
                            class:
                              "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                            onClick: (B) =>
                              ("navigateTo" in s ? s.navigateTo : r(T))(`/sales/quotation/${a.id}`),
                          },
                          [
                            t("div", yt, [
                              t("div", _t, [
                                t("div", wt, [d(r(L), { class: "w-6 h-6" })]),
                                t("div", null, [
                                  t("h3", kt, c(a.number), 1),
                                  t("p", Dt, c(a.date), 1),
                                ]),
                              ]),
                              t(
                                "button",
                                {
                                  class: "text-muted-foreground hover:text-foreground",
                                  onClick: e[2] || (e[2] = A(() => {}, ["stop"])),
                                },
                                [d(r(P), { class: "w-4 h-4" })],
                              ),
                            ]),
                            t("div", $t, [
                              t("div", null, [
                                e[10] ||
                                  (e[10] = t(
                                    "p",
                                    { class: "text-xs text-muted-foreground mb-1" },
                                    "Customer",
                                    -1,
                                  )),
                                t("p", Ct, c(a.customer), 1),
                              ]),
                              t("div", null, [
                                e[11] ||
                                  (e[11] = t(
                                    "p",
                                    { class: "text-xs text-muted-foreground mb-1" },
                                    "Total Amount",
                                    -1,
                                  )),
                                t("p", Tt, c(a.amount), 1),
                              ]),
                            ]),
                            t("div", At, [
                              t(
                                "span",
                                {
                                  class: _(
                                    r(w)(
                                      "px-2 py-0.5 rounded border text-xs font-medium",
                                      b[a.status]?.class,
                                    ),
                                  ),
                                },
                                c(b[a.status]?.label),
                                3,
                              ),
                              t("div", Lt, [
                                t(
                                  "button",
                                  {
                                    class:
                                      "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors",
                                    title: "Kirim",
                                    onClick: e[3] || (e[3] = A(() => {}, ["stop"])),
                                  },
                                  [d(r(Y), { class: "w-4 h-4" })],
                                ),
                              ]),
                            ]),
                          ],
                          8,
                          vt,
                        )
                      ),
                    ),
                    128,
                  )),
                ])),
            t("div", Pt, [
              t("p", null, c(r(f).length) + " data found.", 1),
              d(
                j,
                {
                  page: r(h),
                  "onUpdate:page": [e[4] || (e[4] = (a) => (K(h) ? (h.value = a) : null)), n],
                  total: r(l).total,
                  "items-per-page": r(l).limit,
                },
                null,
                8,
                ["page", "total", "items-per-page"],
              ),
            ]),
          ])
        );
      };
    },
  });
export { Vt as default };
