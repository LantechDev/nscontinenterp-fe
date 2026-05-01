import {
  e as y,
  r as w,
  R as d,
  Q as t,
  $ as p,
  K as o,
  a2 as r,
  a0 as c,
  a1 as x,
  T as n,
  V as a,
  t as f,
  Y as C,
  _ as i,
} from "./D9q6143x.js";
import { c as g } from "./DrxnuvjT.js";
import { L as k, a as R } from "./BopvTZHI.js";
import { S as T } from "./DK0cRrZx.js";
import { C as B } from "./Btb_jfTP.js";
import { C as L } from "./DnWmaOSL.js";
import { C as b } from "./BoOMJ_MG.js";
import { C as h } from "./DD8oliij.js";
import { E as _ } from "./DeUJRdQC.js";
const P = { class: "space-y-6 animate-fade-in p-6" },
  $ = { class: "flex items-center justify-between" },
  N = { class: "flex items-center gap-2" },
  D = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  J = { class: "flex items-center justify-between gap-4" },
  V = { class: "relative w-full max-w-sm" },
  A = { key: 0, class: "border border-border rounded-xl bg-white overflow-hidden" },
  I = { class: "overflow-x-auto" },
  S = { class: "w-full" },
  E = ["onClick"],
  M = { class: "py-3 px-4" },
  j = { class: "text-sm font-medium" },
  O = { class: "py-3 px-4 text-sm" },
  z = { class: "py-3 px-4 text-sm text-green-600 font-medium" },
  F = { class: "py-3 px-4 text-sm text-red-600 font-medium" },
  G = { class: "py-3 px-4 text-sm text-[#012D5A] font-bold" },
  K = { class: "py-3 px-4" },
  Q = {
    key: 0,
    class:
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
  },
  Y = {
    key: 1,
    class:
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  q = { class: "py-3 px-4 text-right" },
  H = { class: "text-muted-foreground hover:text-foreground" },
  U = { key: 1, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  W = ["onClick"],
  X = { class: "flex items-start justify-between mb-4" },
  Z = { class: "font-bold text-base text-foreground" },
  tt = { class: "text-xs text-muted-foreground" },
  et = { class: "space-y-4 mb-4" },
  st = { class: "grid grid-cols-2 gap-2 text-sm" },
  ot = { class: "space-y-1" },
  rt = { class: "font-medium text-green-600" },
  nt = { class: "space-y-1" },
  dt = { class: "font-medium text-red-600" },
  it = { class: "pt-3 border-t border-border" },
  lt = { class: "flex items-center justify-between" },
  at = { class: "text-lg font-bold text-[#012D5A]" },
  ut = { class: "flex items-center justify-between pt-4 border-t border-border" },
  mt = {
    key: 0,
    class:
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
  },
  pt = {
    key: 1,
    class:
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  ct = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  xt = { class: "flex items-center gap-2" },
  ft = { class: "p-1 hover:text-foreground disabled:opacity-50" },
  gt = { class: "flex items-center gap-1 hover:text-foreground" },
  Bt = y({
    __name: "closing",
    setup(bt) {
      const m = [
          {
            id: "1",
            jobId: "3",
            number: "JOB-2024-001232",
            customer: "PT Logistik Nusantara",
            totalRevenue: "Rp 32.500.000",
            totalCost: "Rp 24.200.000",
            profit: "Rp 8.300.000",
            status: "closed",
          },
          {
            id: "2",
            jobId: "4",
            number: "JOB-2024-001230",
            customer: "PT Maju Bersama",
            totalRevenue: "Rp 28.000.000",
            totalCost: "Rp 21.500.000",
            profit: "Rp 6.500.000",
            status: "pending",
          },
        ],
        l = w("list");
      return (u, e) => (
        i(),
        d("div", P, [
          t("div", $, [
            e[3] ||
              (e[3] = t(
                "div",
                null,
                [
                  t("h1", { class: "text-2xl font-bold" }, "Closing Job"),
                  t("p", { class: "text-muted-foreground mt-1" }, "Tutup job dan hitung profit"),
                ],
                -1,
              )),
            t("div", N, [
              t("div", D, [
                t(
                  "button",
                  {
                    onClick: e[0] || (e[0] = (s) => (l.value = "list")),
                    class: p(
                      o(g)(
                        "p-1.5 rounded transition-colors",
                        o(l) === "list"
                          ? "bg-[#012D5A] text-white"
                          : "text-muted-foreground hover:bg-muted",
                      ),
                    ),
                  },
                  [r(o(k), { class: "w-4 h-4" })],
                  2,
                ),
                t(
                  "button",
                  {
                    onClick: e[1] || (e[1] = (s) => (l.value = "grid")),
                    class: p(
                      o(g)(
                        "p-1.5 rounded transition-colors",
                        o(l) === "grid"
                          ? "bg-[#012D5A] text-white"
                          : "text-muted-foreground hover:bg-muted",
                      ),
                    ),
                  },
                  [r(o(R), { class: "w-4 h-4" })],
                  2,
                ),
              ]),
            ]),
          ]),
          t("div", J, [
            t("div", V, [
              r(o(T), {
                class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
              }),
              e[4] ||
                (e[4] = t(
                  "input",
                  {
                    type: "text",
                    placeholder: "Cari job untuk closing...",
                    class:
                      "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                  },
                  null,
                  -1,
                )),
            ]),
          ]),
          o(l) === "list"
            ? (i(),
              d("div", A, [
                t("div", I, [
                  t("table", S, [
                    e[7] ||
                      (e[7] = t(
                        "thead",
                        null,
                        [
                          t("tr", { class: "border-b border-border bg-white text-left" }, [
                            t(
                              "th",
                              { class: "py-3 px-4 text-sm font-medium text-foreground" },
                              "No. Job",
                            ),
                            t(
                              "th",
                              { class: "py-3 px-4 text-sm font-medium text-foreground" },
                              "Customer",
                            ),
                            t(
                              "th",
                              { class: "py-3 px-4 text-sm font-medium text-foreground" },
                              "Total Revenue",
                            ),
                            t(
                              "th",
                              { class: "py-3 px-4 text-sm font-medium text-foreground" },
                              "Total Cost",
                            ),
                            t(
                              "th",
                              { class: "py-3 px-4 text-sm font-medium text-foreground" },
                              "Profit",
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
                      (i(),
                      d(
                        c,
                        null,
                        x(m, (s) =>
                          t(
                            "tr",
                            {
                              key: s.id,
                              class:
                                "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                              onClick: (v) =>
                                ("navigateTo" in u ? u.navigateTo : o(f))(
                                  `/operational/jobs?id=${s.jobId}`,
                                ),
                            },
                            [
                              t("td", M, [t("span", j, n(s.number), 1)]),
                              t("td", O, n(s.customer), 1),
                              t("td", z, n(s.totalRevenue), 1),
                              t("td", F, n(s.totalCost), 1),
                              t("td", G, n(s.profit), 1),
                              t("td", K, [
                                s.status === "closed"
                                  ? (i(),
                                    d("span", Q, [
                                      r(o(b), { class: "w-3 h-3" }),
                                      e[5] || (e[5] = a(" Closed ", -1)),
                                    ]))
                                  : (i(),
                                    d("span", Y, [
                                      r(o(h), { class: "w-3 h-3" }),
                                      e[6] || (e[6] = a(" Pending ", -1)),
                                    ])),
                              ]),
                              t("td", q, [t("button", H, [r(o(_), { class: "w-4 h-4" })])]),
                            ],
                            8,
                            E,
                          ),
                        ),
                        64,
                      )),
                    ]),
                  ]),
                ]),
              ]))
            : (i(),
              d("div", U, [
                (i(),
                d(
                  c,
                  null,
                  x(m, (s) =>
                    t(
                      "div",
                      {
                        key: s.id,
                        class:
                          "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                        onClick: (v) =>
                          ("navigateTo" in u ? u.navigateTo : o(f))(
                            `/operational/jobs?id=${s.jobId}`,
                          ),
                      },
                      [
                        t("div", X, [
                          t("div", null, [
                            t("h3", Z, n(s.number), 1),
                            t("p", tt, n(s.customer), 1),
                          ]),
                          t(
                            "button",
                            {
                              class: "text-muted-foreground hover:text-foreground",
                              onClick: e[2] || (e[2] = C(() => {}, ["stop"])),
                            },
                            [r(o(_), { class: "w-4 h-4" })],
                          ),
                        ]),
                        t("div", et, [
                          t("div", st, [
                            t("div", ot, [
                              e[8] ||
                                (e[8] = t(
                                  "p",
                                  { class: "text-xs text-muted-foreground" },
                                  "Revenue",
                                  -1,
                                )),
                              t("p", rt, n(s.totalRevenue), 1),
                            ]),
                            t("div", nt, [
                              e[9] ||
                                (e[9] = t(
                                  "p",
                                  { class: "text-xs text-muted-foreground" },
                                  "Cost",
                                  -1,
                                )),
                              t("p", dt, n(s.totalCost), 1),
                            ]),
                          ]),
                          t("div", it, [
                            t("div", lt, [
                              e[10] ||
                                (e[10] = t(
                                  "p",
                                  { class: "text-sm font-medium text-muted-foreground" },
                                  "Profit",
                                  -1,
                                )),
                              t("p", at, n(s.profit), 1),
                            ]),
                          ]),
                        ]),
                        t("div", ut, [
                          s.status === "closed"
                            ? (i(),
                              d("span", mt, [
                                r(o(b), { class: "w-3 h-3" }),
                                e[11] || (e[11] = a(" Closed ", -1)),
                              ]))
                            : (i(),
                              d("span", pt, [
                                r(o(h), { class: "w-3 h-3" }),
                                e[12] || (e[12] = a(" Pending ", -1)),
                              ])),
                        ]),
                      ],
                      8,
                      W,
                    ),
                  ),
                  64,
                )),
              ])),
          t("div", ct, [
            t("p", null, n(m.length) + " data found.", 1),
            t("div", xt, [
              t("button", ft, [
                r(o(B), { class: "w-4 h-4" }),
                e[13] || (e[13] = t("span", { class: "sr-only" }, "Previous", -1)),
              ]),
              e[15] ||
                (e[15] = t(
                  "button",
                  {
                    class:
                      "w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium",
                  },
                  " 1 ",
                  -1,
                )),
              e[16] || (e[16] = t("span", { class: "px-1" }, "...", -1)),
              t("button", gt, [e[14] || (e[14] = a(" Next ", -1)), r(o(L), { class: "w-4 h-4" })]),
            ]),
          ]),
        ])
      );
    },
  });
export { Bt as default };
