import {
  e as v,
  R as u,
  Q as e,
  a2 as c,
  K as r,
  V as m,
  O as p,
  S as a,
  $ as n,
  a0 as h,
  a1 as k,
  Y as g,
  T as i,
  _ as l,
} from "./D9q6143x.js";
import { c as b } from "./DrxnuvjT.js";
import { _ as y } from "./kUcy7b0j.js";
import { C as x } from "./C22E21xF.js";
import { E as C } from "./DeUJRdQC.js";
const w = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  $ = { class: "overflow-x-auto" },
  V = { class: "w-full" },
  D = { class: "border-b border-border bg-white text-left" },
  F = { class: "py-3 px-4 w-10" },
  N = { class: "flex items-center gap-1" },
  A = { class: "flex items-center gap-1" },
  B = { class: "flex items-center gap-1" },
  E = { class: "flex items-center gap-1" },
  S = ["onClick"],
  T = { class: "py-3 px-4 text-sm font-medium" },
  U = { class: "py-3 px-4 text-sm font-medium" },
  J = { class: "py-3 px-4 text-sm font-normal" },
  L = { class: "py-3 px-4 text-sm" },
  z = { class: "py-3 px-4" },
  K = { class: "py-3 px-4" },
  M = { class: "py-3 px-4 text-right" },
  O = { key: 0 },
  G = v({
    __name: "CompanyList",
    props: { companies: {}, sortField: {}, sortDirection: {}, selectAll: { type: Boolean } },
    emits: ["update:sort", "open-detail", "update:selectAll"],
    setup(o) {
      return (d, t) => (
        l(),
        u("div", w, [
          e("div", $, [
            e("table", V, [
              e("thead", null, [
                e("tr", D, [
                  e("th", F, [
                    c(
                      r(y),
                      {
                        "model-value": o.selectAll,
                        "onUpdate:modelValue":
                          t[0] || (t[0] = (s) => d.$emit("update:selectAll", s)),
                      },
                      null,
                      8,
                      ["model-value"],
                    ),
                  ]),
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[1] || (t[1] = (s) => d.$emit("update:sort", "code")),
                    },
                    [
                      e("div", N, [
                        t[7] || (t[7] = m(" No. Cust ", -1)),
                        o.sortField === "code"
                          ? (l(),
                            p(
                              r(x),
                              {
                                key: 0,
                                class: n(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
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
                      onClick: t[2] || (t[2] = (s) => d.$emit("update:sort", "name")),
                    },
                    [
                      e("div", A, [
                        t[8] || (t[8] = m(" Company ", -1)),
                        o.sortField === "name"
                          ? (l(),
                            p(
                              r(x),
                              {
                                key: 0,
                                class: n(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  t[11] ||
                    (t[11] = e(
                      "th",
                      { class: "py-3 px-4 text-sm font-medium text-foreground" },
                      "Email",
                      -1,
                    )),
                  t[12] ||
                    (t[12] = e(
                      "th",
                      { class: "py-3 px-4 text-sm font-medium text-foreground" },
                      "Total Job",
                      -1,
                    )),
                  e(
                    "th",
                    {
                      class:
                        "py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50",
                      onClick: t[3] || (t[3] = (s) => d.$emit("update:sort", "type")),
                    },
                    [
                      e("div", B, [
                        t[9] || (t[9] = m(" Type ", -1)),
                        o.sortField === "type"
                          ? (l(),
                            p(
                              r(x),
                              {
                                key: 0,
                                class: n(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
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
                      onClick: t[4] || (t[4] = (s) => d.$emit("update:sort", "status")),
                    },
                    [
                      e("div", E, [
                        t[10] || (t[10] = m(" Status ", -1)),
                        o.sortField === "status"
                          ? (l(),
                            p(
                              r(x),
                              {
                                key: 0,
                                class: n(["w-4 h-4", { "rotate-180": o.sortDirection === "desc" }]),
                              },
                              null,
                              8,
                              ["class"],
                            ))
                          : a("", !0),
                      ]),
                    ],
                  ),
                  t[13] || (t[13] = e("th", { class: "py-3 px-4 w-10" }, null, -1)),
                ]),
              ]),
              e("tbody", null, [
                (l(!0),
                u(
                  h,
                  null,
                  k(
                    o.companies,
                    (s) => (
                      l(),
                      u(
                        "tr",
                        {
                          key: s.id,
                          class:
                            "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                          onClick: (f) => d.$emit("open-detail", s),
                        },
                        [
                          e(
                            "td",
                            { class: "py-3 px-4", onClick: t[5] || (t[5] = g(() => {}, ["stop"])) },
                            [
                              c(
                                r(y),
                                {
                                  modelValue: s.selected,
                                  "onUpdate:modelValue": (f) => (s.selected = f),
                                },
                                null,
                                8,
                                ["modelValue", "onUpdate:modelValue"],
                              ),
                            ],
                          ),
                          e("td", T, i(s.code), 1),
                          e("td", U, i(s.name), 1),
                          e("td", J, i(s.email), 1),
                          e("td", L, i(s.totalJobs), 1),
                          e("td", z, [
                            e(
                              "span",
                              {
                                class: n(
                                  r(b)(
                                    "px-2 py-1 rounded text-xs font-medium",
                                    s.type === "Shipper" || s.type === "Consignee"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-gray-900 text-white",
                                  ),
                                ),
                              },
                              i(s.type),
                              3,
                            ),
                          ]),
                          e("td", K, [
                            e(
                              "span",
                              {
                                class: n(
                                  r(b)(
                                    "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                                    s.status === "Active"
                                      ? "text-blue-500 border-blue-200"
                                      : "text-red-500 border-red-200",
                                  ),
                                ),
                              },
                              i(s.status),
                              3,
                            ),
                          ]),
                          e("td", M, [
                            e(
                              "button",
                              {
                                class: "text-muted-foreground hover:text-foreground",
                                onClick: t[6] || (t[6] = g(() => {}, ["stop"])),
                              },
                              [c(r(C), { class: "w-4 h-4" })],
                            ),
                          ]),
                        ],
                        8,
                        S,
                      )
                    ),
                  ),
                  128,
                )),
                o.companies.length === 0
                  ? (l(),
                    u("tr", O, [
                      ...(t[14] ||
                        (t[14] = [
                          e(
                            "td",
                            { colspan: "8", class: "py-8 text-center text-muted-foreground" },
                            "No companies found",
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
export { G as _ };
