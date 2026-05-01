import {
  e as N,
  q as w,
  r as p,
  am as Y,
  d as q,
  N as P,
  o as S,
  R as r,
  Q as e,
  a2 as $,
  K as l,
  S as B,
  T as o,
  a0 as b,
  a1 as _,
  $ as f,
  an as j,
  _ as n,
} from "./D9q6143x.js";
import { f as E, c as F } from "./DrxnuvjT.js";
import { A as L } from "./CdOyNhW7.js";
const I = { class: "space-y-6 animate-fade-in p-6" },
  V = { class: "flex items-center gap-4" },
  z = { key: 0, class: "text-muted-foreground mt-1" },
  Q = { class: "flex flex-col sm:flex-row gap-4" },
  U = { class: "flex items-center gap-2" },
  G = { class: "flex bg-white border border-border rounded-lg p-1" },
  J = ["onClick"],
  K = { class: "flex items-center gap-2" },
  M = ["value"],
  O = ["value"],
  H = { key: 0, class: "flex items-center justify-center py-12" },
  W = { key: 1, class: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" },
  X = { key: 2, class: "space-y-6" },
  Z = { class: "grid grid-cols-2 md:grid-cols-4 gap-4" },
  ee = { class: "p-4 bg-gray-50 rounded-lg" },
  te = { class: "p-4 bg-gray-50 rounded-lg" },
  se = { class: "text-lg font-semibold" },
  oe = { class: "p-4 bg-gray-50 rounded-lg" },
  ae = { class: "text-lg font-semibold" },
  re = { class: "p-4 bg-gray-50 rounded-lg" },
  ne = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  de = { class: "overflow-x-auto" },
  le = { class: "w-full" },
  ie = { class: "divide-y divide-border" },
  ue = { class: "px-4 py-3 text-sm" },
  ce = { class: "px-4 py-3 text-sm" },
  pe = { key: 0, class: "text-muted-foreground" },
  xe = { key: 1, class: "text-muted-foreground" },
  ge = { class: "px-4 py-3 text-sm" },
  me = { class: "px-4 py-3 text-sm text-right" },
  fe = { class: "px-4 py-3 text-sm text-right" },
  ve = { key: 0, class: "text-center py-8 text-muted-foreground" },
  he = { key: 3, class: "text-center py-12 text-muted-foreground" },
  Ce = N({
    __name: "[accountId]",
    setup(be) {
      const u = Y(),
        y = j(),
        v = w(() => u.params.accountId),
        h = p(!1),
        a = p(null),
        x = p(null),
        g = p(u.query.period || "month"),
        c = p(u.query.year || new Date().getFullYear().toString()),
        C = w(() => {
          const d = new Date().getFullYear(),
            t = [];
          for (let s = d; s >= d - 5; s--) t.push(s.toString());
          return t;
        }),
        i = E,
        D = q().public.apiBase || "";
      async function m() {
        if (v.value) {
          ((h.value = !0), (x.value = null), (a.value = null));
          try {
            const d = new URLSearchParams({ period: g.value });
            c.value && d.append("year", c.value);
            const t = await $fetch(
              `${D}/finance/dashboard/trial-balance/${v.value}?${d.toString()}`,
              { method: "GET", credentials: "include" },
            );
            a.value = t;
          } catch (d) {
            (console.error("Failed to fetch account detail:", d),
              (x.value = "Failed to load account details"));
          } finally {
            h.value = !1;
          }
        }
      }
      function T(d) {
        ((g.value = d), k(), m());
      }
      function R(d) {
        ((c.value = d), k(), m());
      }
      function k() {
        y.replace({ query: { ...u.query, period: g.value, year: c.value } });
      }
      function A() {
        y.push("/finance/dashboard?tab=Trial%20Balance");
      }
      return (
        P(
          () => u.params.accountId,
          () => {
            v.value && m();
          },
          { immediate: !0 },
        ),
        S(() => {
          m();
        }),
        (d, t) => (
          n(),
          r("div", I, [
            e("div", V, [
              e(
                "button",
                { class: "p-2 hover:bg-gray-100 rounded-lg transition-colors", onClick: A },
                [$(l(L), { class: "w-5 h-5" })],
              ),
              e("div", null, [
                t[1] || (t[1] = e("h1", { class: "text-2xl font-bold" }, "Account Detail", -1)),
                a.value
                  ? (n(), r("p", z, o(a.value.accountCode) + " - " + o(a.value.accountName), 1))
                  : B("", !0),
              ]),
            ]),
            e("div", Q, [
              e("div", U, [
                t[2] ||
                  (t[2] = e(
                    "label",
                    { class: "text-sm font-medium text-muted-foreground" },
                    "Period:",
                    -1,
                  )),
                e("div", G, [
                  (n(),
                  r(
                    b,
                    null,
                    _(["day", "week", "month", "year"], (s) =>
                      e(
                        "button",
                        {
                          key: s,
                          class: f(
                            l(F)(
                              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                              g.value === s
                                ? "bg-[#012D5A] text-white"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            ),
                          ),
                          onClick: (ye) => T(s),
                        },
                        o(s),
                        11,
                        J,
                      ),
                    ),
                    64,
                  )),
                ]),
              ]),
              e("div", K, [
                t[3] ||
                  (t[3] = e(
                    "label",
                    { class: "text-sm font-medium text-muted-foreground" },
                    "Year:",
                    -1,
                  )),
                e(
                  "select",
                  {
                    value: c.value,
                    class:
                      "px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#012D5A]",
                    onChange: t[0] || (t[0] = (s) => R(s.target.value)),
                  },
                  [
                    (n(!0),
                    r(
                      b,
                      null,
                      _(C.value, (s) => (n(), r("option", { key: s, value: s }, o(s), 9, O))),
                      128,
                    )),
                  ],
                  40,
                  M,
                ),
              ]),
            ]),
            h.value
              ? (n(),
                r("div", H, [
                  ...(t[4] ||
                    (t[4] = [
                      e(
                        "div",
                        { class: "flex items-center gap-2" },
                        [
                          e("div", {
                            class:
                              "w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin",
                          }),
                          e(
                            "span",
                            { class: "text-muted-foreground" },
                            "Loading account details...",
                          ),
                        ],
                        -1,
                      ),
                    ])),
                ]))
              : x.value
                ? (n(), r("div", W, o(x.value), 1))
                : a.value
                  ? (n(),
                    r("div", X, [
                      e("div", Z, [
                        e("div", ee, [
                          t[5] ||
                            (t[5] = e(
                              "div",
                              { class: "text-xs text-muted-foreground uppercase" },
                              "Opening Balance",
                              -1,
                            )),
                          e(
                            "div",
                            {
                              class: f([
                                "text-lg font-semibold",
                                a.value.openingBalance >= 0 ? "text-green-600" : "text-red-600",
                              ]),
                            },
                            o(l(i)(a.value.openingBalance)),
                            3,
                          ),
                        ]),
                        e("div", te, [
                          t[6] ||
                            (t[6] = e(
                              "div",
                              { class: "text-xs text-muted-foreground uppercase" },
                              "Debit Total",
                              -1,
                            )),
                          e("div", se, o(l(i)(a.value.debitTotal)), 1),
                        ]),
                        e("div", oe, [
                          t[7] ||
                            (t[7] = e(
                              "div",
                              { class: "text-xs text-muted-foreground uppercase" },
                              "Credit Total",
                              -1,
                            )),
                          e("div", ae, o(l(i)(a.value.creditTotal)), 1),
                        ]),
                        e("div", re, [
                          t[8] ||
                            (t[8] = e(
                              "div",
                              { class: "text-xs text-muted-foreground uppercase" },
                              "Closing Balance",
                              -1,
                            )),
                          e(
                            "div",
                            {
                              class: f([
                                "text-lg font-semibold",
                                a.value.closingBalance >= 0 ? "text-green-600" : "text-red-600",
                              ]),
                            },
                            o(l(i)(a.value.closingBalance)),
                            3,
                          ),
                        ]),
                      ]),
                      e("div", ne, [
                        t[10] ||
                          (t[10] = e(
                            "div",
                            { class: "px-6 py-4 border-b border-border" },
                            [e("h2", { class: "text-lg font-semibold" }, "Journal Entries")],
                            -1,
                          )),
                        e("div", de, [
                          e("table", le, [
                            t[9] ||
                              (t[9] = e(
                                "thead",
                                { class: "bg-gray-50" },
                                [
                                  e("tr", null, [
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Date ",
                                    ),
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Reference ",
                                    ),
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Description ",
                                    ),
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Debit ",
                                    ),
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Credit ",
                                    ),
                                    e(
                                      "th",
                                      {
                                        class:
                                          "px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase",
                                      },
                                      " Running Balance ",
                                    ),
                                  ]),
                                ],
                                -1,
                              )),
                            e("tbody", ie, [
                              (n(!0),
                              r(
                                b,
                                null,
                                _(
                                  a.value.journalEntries,
                                  (s) => (
                                    n(),
                                    r("tr", { key: s.id, class: "hover:bg-gray-50" }, [
                                      e("td", ue, o(s.journalDate), 1),
                                      e("td", ce, [
                                        s.referenceType
                                          ? (n(), r("span", pe, o(s.referenceType), 1))
                                          : (n(), r("span", xe, "-")),
                                      ]),
                                      e("td", ge, [e("div", null, o(s.description || "-"), 1)]),
                                      e("td", me, o(s.debit > 0 ? l(i)(s.debit) : "-"), 1),
                                      e("td", fe, o(s.credit > 0 ? l(i)(s.credit) : "-"), 1),
                                      e(
                                        "td",
                                        {
                                          class: f([
                                            "px-4 py-3 text-sm text-right font-medium",
                                            s.runningBalance >= 0
                                              ? "text-green-600"
                                              : "text-red-600",
                                          ]),
                                        },
                                        o(l(i)(s.runningBalance)),
                                        3,
                                      ),
                                    ])
                                  ),
                                ),
                                128,
                              )),
                            ]),
                          ]),
                        ]),
                        a.value.journalEntries.length === 0
                          ? (n(),
                            r(
                              "div",
                              ve,
                              " No journal entries for this account in the selected period ",
                            ))
                          : B("", !0),
                      ]),
                    ]))
                  : (n(), r("div", he, "No account details available")),
          ])
        )
      );
    },
  });
export { Ce as default };
