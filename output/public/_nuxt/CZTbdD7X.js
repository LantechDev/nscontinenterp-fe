import {
  e as k,
  ab as S,
  d as P,
  r as g,
  o as C,
  R as l,
  Q as t,
  S as b,
  a2 as D,
  K as s,
  T as n,
  P as L,
  al as G,
  t as R,
  $ as p,
  a8 as B,
  _ as d,
} from "./D9q6143x.js";
const N = { class: "space-y-6 p-6" },
  $ = { key: 0, class: "flex items-center justify-center py-20" },
  E = { key: 1, class: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" },
  V = { key: 0, class: "space-y-6" },
  T = { class: "bg-[#012D5A] rounded-xl p-6" },
  U = { class: "flex flex-col lg:flex-row gap-6" },
  j = { class: "flex-1" },
  A = { class: "flex items-center gap-3 mb-3" },
  M = { class: "text-xl font-semibold text-white" },
  O = { class: "px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700" },
  z = { key: 0, class: "text-white/60 text-sm mb-4 max-w-2xl" },
  F = { class: "grid grid-cols-2 md:grid-cols-4 gap-4" },
  I = { class: "text-white text-lg font-semibold" },
  K = { class: "text-white text-lg font-semibold" },
  Q = { class: "text-white text-lg font-semibold" },
  q = { class: "flex flex-col items-end lg:w-48" },
  H = { class: "text-right mb-4" },
  J = { class: "w-full h-2 bg-white/10 rounded-full overflow-hidden" },
  W = { class: "bg-white rounded-xl border border-gray-200 p-6" },
  X = { class: "grid grid-cols-1 md:grid-cols-3 gap-6" },
  Y = { class: "text-base font-medium text-gray-900 mt-1" },
  Z = { class: "text-base font-medium text-gray-900 mt-1" },
  tt = { class: "text-base font-medium text-gray-900 mt-1" },
  et = { class: "bg-white rounded-xl border border-gray-200 p-6" },
  st = { class: "grid grid-cols-2 md:grid-cols-4 gap-4" },
  ot = { class: "bg-gray-50 rounded-lg p-4" },
  rt = { class: "text-xl font-semibold text-gray-900 mt-1" },
  nt = { class: "bg-gray-50 rounded-lg p-4" },
  lt = { class: "text-xl font-semibold text-gray-900 mt-1" },
  dt = { class: "bg-gray-50 rounded-lg p-4" },
  it = { class: "text-xl font-semibold text-gray-900 mt-1" },
  at = { class: "bg-gray-50 rounded-lg p-4" },
  ct = { key: 1, class: "bg-gray-50 rounded-xl border border-border p-8 text-center" },
  mt = k({
    __name: "[id]",
    setup(xt) {
      const y = S().params.id,
        v = P().public.apiBase || "",
        c = g(!0),
        i = g(null),
        o = g(null);
      async function f() {
        ((c.value = !0), (i.value = null));
        try {
          const r = await $fetch(`${v}/finance/dashboard/finance-close/periods/${y}`, {
            method: "GET",
            credentials: "include",
          });
          o.value = r;
        } catch (r) {
          const e = r instanceof Error ? r.message : String(r);
          (console.error("Failed to fetch period details:", e), (i.value = e));
        } finally {
          c.value = !1;
        }
      }
      function x(r) {
        if (!r) return "-";
        try {
          return new Date(r).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return "-";
        }
      }
      function a(r) {
        if (!r) return 0;
        const e = r.replace(/[^0-9.-]/g, "");
        return Number(e) || 0;
      }
      function m(r, e) {
        const u = a(r),
          w = a(e);
        return (u - w).toLocaleString("en-US", { style: "currency", currency: "USD" });
      }
      function _(r) {
        return `${r}%`;
      }
      function h() {
        R("/finance/dashboard");
      }
      return (
        C(() => {
          f();
        }),
        (r, e) => {
          const u = G;
          return (
            d(),
            l("div", N, [
              t(
                "div",
                { class: "flex flex-col md:flex-row md:items-center justify-between gap-4" },
                [
                  t("div", { class: "flex items-center gap-4" }, [
                    t(
                      "button",
                      {
                        onClick: h,
                        class: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                        "aria-label": "Go back",
                      },
                      [
                        ...(e[0] ||
                          (e[0] = [
                            t(
                              "svg",
                              {
                                xmlns: "http://www.w3.org/2000/svg",
                                class: "h-5 w-5 text-gray-600",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                              },
                              [
                                t("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M15 19l-7-7 7-7",
                                }),
                              ],
                              -1,
                            ),
                          ])),
                      ],
                    ),
                    e[1] ||
                      (e[1] = t(
                        "div",
                        null,
                        [
                          t("h1", { class: "text-2xl font-bold" }, "Closed Period Details"),
                          t(
                            "p",
                            { class: "text-muted-foreground mt-1" },
                            " View detailed financial data for this closed period ",
                          ),
                        ],
                        -1,
                      )),
                  ]),
                ],
              ),
              s(c)
                ? (d(),
                  l("div", $, [
                    ...(e[2] ||
                      (e[2] = [
                        t(
                          "div",
                          { class: "flex items-center gap-2" },
                          [
                            t("div", {
                              class:
                                "w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin",
                            }),
                            t(
                              "span",
                              { class: "text-muted-foreground" },
                              "Loading period details...",
                            ),
                          ],
                          -1,
                        ),
                      ])),
                  ]))
                : s(i)
                  ? (d(),
                    l("div", E, [
                      t("p", null, n(s(i)), 1),
                      t(
                        "button",
                        { onClick: f, class: "mt-2 text-sm font-medium underline" },
                        " Try again ",
                      ),
                    ]))
                  : b("", !0),
              D(u, null, {
                default: L(() => [
                  s(o)
                    ? (d(),
                      l("div", V, [
                        t("div", T, [
                          t("div", U, [
                            t("div", j, [
                              t("div", A, [
                                t("h2", M, n(s(o).period), 1),
                                t("span", O, n(s(o).status), 1),
                              ]),
                              s(o).description
                                ? (d(), l("p", z, n(s(o).description), 1))
                                : b("", !0),
                              t("div", F, [
                                t("div", null, [
                                  e[3] ||
                                    (e[3] = t(
                                      "p",
                                      { class: "text-white/60 text-xs" },
                                      "Revenue",
                                      -1,
                                    )),
                                  t("p", I, n(s(o).revenue), 1),
                                ]),
                                t("div", null, [
                                  e[4] ||
                                    (e[4] = t("p", { class: "text-white/60 text-xs" }, "COGS", -1)),
                                  t("p", K, n(s(o).cogs), 1),
                                ]),
                                t("div", null, [
                                  e[5] ||
                                    (e[5] = t(
                                      "p",
                                      { class: "text-white/60 text-xs" },
                                      "Gross Profit",
                                      -1,
                                    )),
                                  t("p", Q, n(m(s(o).revenue, s(o).cogs)), 1),
                                ]),
                                t("div", null, [
                                  e[6] ||
                                    (e[6] = t(
                                      "p",
                                      { class: "text-white/60 text-xs" },
                                      "Nett P&L",
                                      -1,
                                    )),
                                  t(
                                    "p",
                                    {
                                      class: p([
                                        "text-lg font-semibold",
                                        a(s(o).nettPL) >= 0 ? "text-green-400" : "text-red-400",
                                      ]),
                                    },
                                    n(s(o).nettPL),
                                    3,
                                  ),
                                ]),
                              ]),
                            ]),
                            t("div", q, [
                              t("div", H, [
                                e[7] ||
                                  (e[7] = t(
                                    "p",
                                    { class: "text-white/60 text-xs" },
                                    "Readiness Score",
                                    -1,
                                  )),
                                t(
                                  "p",
                                  {
                                    class: p([
                                      "text-4xl font-bold",
                                      s(o).readinessScore >= 80
                                        ? "text-green-400"
                                        : s(o).readinessScore >= 50
                                          ? "text-yellow-400"
                                          : "text-red-400",
                                    ]),
                                  },
                                  n(_(s(o).readinessScore)),
                                  3,
                                ),
                              ]),
                              t("div", J, [
                                t(
                                  "div",
                                  {
                                    class: "h-full bg-white rounded-full transition-all",
                                    style: B({ width: `${s(o).readinessScore}%` }),
                                  },
                                  null,
                                  4,
                                ),
                              ]),
                            ]),
                          ]),
                        ]),
                        t("div", W, [
                          e[11] ||
                            (e[11] = t(
                              "h3",
                              { class: "text-lg font-semibold text-gray-900 mb-4" },
                              "Period Information",
                              -1,
                            )),
                          t("div", X, [
                            t("div", null, [
                              e[8] ||
                                (e[8] = t(
                                  "p",
                                  { class: "text-sm text-gray-500" },
                                  "Period Start",
                                  -1,
                                )),
                              t("p", Y, n(x(s(o).periodStart)), 1),
                            ]),
                            t("div", null, [
                              e[9] ||
                                (e[9] = t(
                                  "p",
                                  { class: "text-sm text-gray-500" },
                                  "Period End",
                                  -1,
                                )),
                              t("p", Z, n(x(s(o).periodEnd)), 1),
                            ]),
                            t("div", null, [
                              e[10] ||
                                (e[10] = t(
                                  "p",
                                  { class: "text-sm text-gray-500" },
                                  "Closed Date",
                                  -1,
                                )),
                              t("p", tt, n(x(s(o).closedAt)), 1),
                            ]),
                          ]),
                        ]),
                        t("div", et, [
                          e[16] ||
                            (e[16] = t(
                              "h3",
                              { class: "text-lg font-semibold text-gray-900 mb-4" },
                              "Financial Summary",
                              -1,
                            )),
                          t("div", st, [
                            t("div", ot, [
                              e[12] ||
                                (e[12] = t(
                                  "p",
                                  { class: "text-xs text-gray-500 uppercase tracking-wide" },
                                  "Revenue",
                                  -1,
                                )),
                              t("p", rt, n(s(o).revenue), 1),
                            ]),
                            t("div", nt, [
                              e[13] ||
                                (e[13] = t(
                                  "p",
                                  { class: "text-xs text-gray-500 uppercase tracking-wide" },
                                  "COGS",
                                  -1,
                                )),
                              t("p", lt, n(s(o).cogs), 1),
                            ]),
                            t("div", dt, [
                              e[14] ||
                                (e[14] = t(
                                  "p",
                                  { class: "text-xs text-gray-500 uppercase tracking-wide" },
                                  "Gross Profit",
                                  -1,
                                )),
                              t("p", it, n(m(s(o).revenue, s(o).cogs)), 1),
                            ]),
                            t("div", at, [
                              e[15] ||
                                (e[15] = t(
                                  "p",
                                  { class: "text-xs text-gray-500 uppercase tracking-wide" },
                                  "Nett P&L",
                                  -1,
                                )),
                              t(
                                "p",
                                {
                                  class: p([
                                    "text-xl font-semibold mt-1",
                                    a(s(o).nettPL) >= 0 ? "text-green-600" : "text-red-600",
                                  ]),
                                },
                                n(s(o).nettPL),
                                3,
                              ),
                            ]),
                          ]),
                        ]),
                      ]))
                    : (d(),
                      l("div", ct, [
                        ...(e[17] ||
                          (e[17] = [
                            t("p", { class: "text-muted-foreground" }, "Period not found", -1),
                          ])),
                      ])),
                ]),
                _: 1,
              }),
            ])
          );
        }
      );
    },
  });
export { mt as default };
