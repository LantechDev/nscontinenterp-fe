import {
  e as C,
  q as V,
  R as u,
  Q as t,
  U as y,
  a4 as v,
  K as n,
  aa as D,
  V as m,
  O as x,
  S as l,
  $ as i,
  a0 as S,
  a1 as F,
  Y as N,
  T as a,
  a2 as $,
  _ as r,
} from "./D9q6143x.js";
import { c as U } from "./DrxnuvjT.js";
import { C as p } from "./C22E21xF.js";
import { E as B } from "./DeUJRdQC.js";
const E = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  R = { class: "overflow-x-auto" },
  A = { class: "w-full" },
  L = { class: "border-b border-border bg-white text-left" },
  M = { class: "py-3 px-4 w-10" },
  T = { class: "flex items-center gap-1" },
  q = { class: "flex items-center gap-1" },
  z = { class: "flex items-center gap-1" },
  K = { class: "flex items-center gap-1" },
  O = ["onClick"],
  P = ["onUpdate:modelValue"],
  Q = { class: "py-3 px-4 text-sm font-medium" },
  Y = { class: "py-3 px-4 text-sm font-medium" },
  j = { class: "py-3 px-4 text-sm font-medium" },
  G = { class: "py-3 px-4 text-sm text-muted-foreground" },
  H = { class: "py-3 px-4" },
  I = { class: "py-3 px-4 text-right" },
  J = { class: "text-muted-foreground hover:text-foreground" },
  W = { key: 0 },
  et = C({
    __name: "ServiceListView",
    props: { services: {}, sortField: {}, sortDirection: {} },
    emits: ["toggle-sort", "row-click"],
    setup(o, { emit: k }) {
      const g = o,
        b = k,
        f = V(() => g.services.length > 0 && g.services.every((d) => d.selected)),
        c = (d) => {
          b("toggle-sort", d);
        },
        w = (d) => {
          b("row-click", d);
        };
      return (d, e) => (
        r(),
        u("div", E, [
          t("div", R, [
            t("table", A, [
              t("thead", null, [
                t("tr", L, [
                  t("th", M, [
                    y(
                      t(
                        "input",
                        {
                          type: "checkbox",
                          "onUpdate:modelValue":
                            e[0] || (e[0] = (s) => (D(f) ? (f.value = s) : null)),
                          class: "w-4 h-4 rounded border-gray-300",
                        },
                        null,
                        512,
                      ),
                      [[v, n(f)]],
                    ),
                  ]),
                  t(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: e[1] || (e[1] = (s) => c("code")),
                    },
                    [
                      t("div", T, [
                        e[6] || (e[6] = m(" Code ", -1)),
                        o.sortField === "code"
                          ? (r(),
                            x(
                              n(p),
                              {
                                key: 0,
                                class: i(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : l("", !0),
                      ]),
                    ],
                  ),
                  t(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: e[2] || (e[2] = (s) => c("name")),
                    },
                    [
                      t("div", q, [
                        e[7] || (e[7] = m(" Service Name ", -1)),
                        o.sortField === "name"
                          ? (r(),
                            x(
                              n(p),
                              {
                                key: 0,
                                class: i(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : l("", !0),
                      ]),
                    ],
                  ),
                  t(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: e[3] || (e[3] = (s) => c("price")),
                    },
                    [
                      t("div", z, [
                        e[8] || (e[8] = m(" Price ", -1)),
                        o.sortField === "price"
                          ? (r(),
                            x(
                              n(p),
                              {
                                key: 0,
                                class: i(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : l("", !0),
                      ]),
                    ],
                  ),
                  e[10] ||
                    (e[10] = t(
                      "th",
                      { class: "py-3 px-4 text-sm font-medium text-foreground" },
                      "Unit",
                      -1,
                    )),
                  t(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: e[4] || (e[4] = (s) => c("status")),
                    },
                    [
                      t("div", K, [
                        e[9] || (e[9] = m(" Status ", -1)),
                        o.sortField === "status"
                          ? (r(),
                            x(
                              n(p),
                              {
                                key: 0,
                                class: i(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : l("", !0),
                      ]),
                    ],
                  ),
                  e[11] || (e[11] = t("th", { class: "py-3 px-4 w-10" }, null, -1)),
                ]),
              ]),
              t("tbody", null, [
                (r(!0),
                u(
                  S,
                  null,
                  F(
                    o.services,
                    (s) => (
                      r(),
                      u(
                        "tr",
                        {
                          key: s.id,
                          class:
                            "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                          onClick: (h) => w(s.id),
                        },
                        [
                          t(
                            "td",
                            { class: "py-3 px-4", onClick: e[5] || (e[5] = N(() => {}, ["stop"])) },
                            [
                              y(
                                t(
                                  "input",
                                  {
                                    type: "checkbox",
                                    "onUpdate:modelValue": (h) => (s.selected = h),
                                    class: "w-4 h-4 rounded border-gray-300",
                                  },
                                  null,
                                  8,
                                  P,
                                ),
                                [[v, s.selected]],
                              ),
                            ],
                          ),
                          t("td", Q, a(s.code), 1),
                          t("td", Y, a(s.name), 1),
                          t("td", j, a(s.price), 1),
                          t("td", G, a(s.unit), 1),
                          t("td", H, [
                            t(
                              "span",
                              {
                                class: i(
                                  n(U)(
                                    "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                    s.status === "Active"
                                      ? "text-blue-500 border-blue-200"
                                      : "text-red-500 border-red-200",
                                  ),
                                ),
                              },
                              a(s.status),
                              3,
                            ),
                          ]),
                          t("td", I, [t("button", J, [$(n(B), { class: "w-4 h-4" })])]),
                        ],
                        8,
                        O,
                      )
                    ),
                  ),
                  128,
                )),
                o.services.length === 0
                  ? (r(),
                    u("tr", W, [
                      ...(e[12] ||
                        (e[12] = [
                          t(
                            "td",
                            { colspan: "7", class: "py-8 text-center text-muted-foreground" },
                            "No services found",
                            -1,
                          ),
                        ])),
                    ]))
                  : l("", !0),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { et as _ };
