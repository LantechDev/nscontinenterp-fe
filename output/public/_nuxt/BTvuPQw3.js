import {
  e as k,
  R as u,
  Q as e,
  V as l,
  O as x,
  S as a,
  K as n,
  $ as m,
  a0 as C,
  a1 as D,
  T as g,
  Y as p,
  a2 as f,
  _ as r,
} from "./D9q6143x.js";
import { c as N } from "./DrxnuvjT.js";
import { C as b } from "./C22E21xF.js";
import { E as V } from "./DeUJRdQC.js";
import { P as $ } from "./p41O2Qdo.js";
import { T as F } from "./DhzAXlPS.js";
const E = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  T = { class: "overflow-x-auto" },
  A = { class: "w-full" },
  B = { class: "border-b border-border bg-white text-left" },
  M = { class: "flex items-center gap-1" },
  S = { class: "flex items-center gap-1" },
  I = { class: "flex items-center gap-1" },
  z = { class: "flex items-center gap-1" },
  O = { class: "py-3 px-4 text-sm font-medium" },
  P = { class: "py-3 px-4 text-sm font-medium" },
  K = { class: "py-3 px-4 text-sm text-muted-foreground" },
  L = { class: "py-3 px-4" },
  Q = { class: "py-3 px-4 text-right relative" },
  R = ["onClick"],
  Y = {
    key: 0,
    class:
      "absolute right-4 top-10 z-10 w-36 bg-white border border-border rounded-lg shadow-lg overflow-hidden dropdown-menu",
  },
  j = ["onClick"],
  q = ["onClick"],
  G = { key: 0 },
  _ = k({
    __name: "VesselTable",
    props: { vessels: {}, sortField: {}, sortDirection: {}, openMenuId: {} },
    emits: ["toggle-sort", "toggle-menu", "edit", "delete"],
    setup(s, { emit: w }) {
      const d = w,
        c = (i) => {
          d("toggle-sort", i);
        },
        y = (i) => {
          d("edit", i);
        },
        v = (i) => {
          d("delete", i);
        };
      return (i, t) => (
        r(),
        u("div", E, [
          e("div", T, [
            e("table", A, [
              e("thead", null, [
                e("tr", B, [
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[0] || (t[0] = (o) => c("imoNumber")),
                    },
                    [
                      e("div", M, [
                        t[4] || (t[4] = l(" IMO Number ", -1)),
                        s.sortField === "imoNumber"
                          ? (r(),
                            x(
                              n(b),
                              {
                                key: 0,
                                class: m(["w-4 h-4", { "rotate-180": s.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[1] || (t[1] = (o) => c("name")),
                    },
                    [
                      e("div", S, [
                        t[5] || (t[5] = l(" Vessel Name ", -1)),
                        s.sortField === "name"
                          ? (r(),
                            x(
                              n(b),
                              {
                                key: 0,
                                class: m(["w-4 h-4", { "rotate-180": s.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[2] || (t[2] = (o) => c("createdAt")),
                    },
                    [
                      e("div", I, [
                        t[6] || (t[6] = l(" Create Date ", -1)),
                        s.sortField === "createdAt"
                          ? (r(),
                            x(
                              n(b),
                              {
                                key: 0,
                                class: m(["w-4 h-4", { "rotate-180": s.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[3] || (t[3] = (o) => c("status")),
                    },
                    [
                      e("div", z, [
                        t[7] || (t[7] = l(" Status ", -1)),
                        s.sortField === "status"
                          ? (r(),
                            x(
                              n(b),
                              {
                                key: 0,
                                class: m(["w-4 h-4", { "rotate-180": s.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  t[8] || (t[8] = e("th", { class: "py-3 px-4 w-10" }, null, -1)),
                ]),
              ]),
              e("tbody", null, [
                (r(!0),
                u(
                  C,
                  null,
                  D(
                    s.vessels,
                    (o) => (
                      r(),
                      u(
                        "tr",
                        {
                          key: o.id,
                          class:
                            "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                        },
                        [
                          e("td", O, g(o.imoNumber), 1),
                          e("td", P, g(o.name), 1),
                          e("td", K, g(o.createdAt), 1),
                          e("td", L, [
                            e(
                              "span",
                              {
                                class: m(
                                  n(N)(
                                    "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                    o.status === "Active"
                                      ? "text-blue-500 border-blue-200"
                                      : "text-red-500 border-red-200",
                                  ),
                                ),
                              },
                              g(o.status),
                              3,
                            ),
                          ]),
                          e("td", Q, [
                            e(
                              "button",
                              {
                                onClick: p((h) => d("toggle-menu", o.id), ["stop"]),
                                class: "text-muted-foreground hover:text-foreground dropdown-menu",
                              },
                              [f(n(V), { class: "w-4 h-4" })],
                              8,
                              R,
                            ),
                            s.openMenuId === o.id
                              ? (r(),
                                u("div", Y, [
                                  e(
                                    "button",
                                    {
                                      onClick: p(
                                        (h) => {
                                          (y(o.id), d("toggle-menu", o.id));
                                        },
                                        ["stop"],
                                      ),
                                      class:
                                        "w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors",
                                    },
                                    [
                                      f(n($), { class: "w-4 h-4" }),
                                      t[9] || (t[9] = l(" Edit ", -1)),
                                    ],
                                    8,
                                    j,
                                  ),
                                  e(
                                    "button",
                                    {
                                      onClick: p(
                                        (h) => {
                                          (v(o.id), d("toggle-menu", o.id));
                                        },
                                        ["stop"],
                                      ),
                                      class:
                                        "w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors",
                                    },
                                    [
                                      f(n(F), { class: "w-4 h-4" }),
                                      t[10] || (t[10] = l(" Delete ", -1)),
                                    ],
                                    8,
                                    q,
                                  ),
                                ]))
                              : a("", !0),
                          ]),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
                s.vessels.length === 0
                  ? (r(),
                    u("tr", G, [
                      ...(t[11] ||
                        (t[11] = [
                          e(
                            "td",
                            { colspan: "5", class: "py-8 text-center text-muted-foreground" },
                            "No vessels found",
                            -1,
                          ),
                        ])),
                    ]))
                  : a("", !0),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { _ };
