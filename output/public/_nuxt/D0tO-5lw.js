import {
  e as p,
  R as i,
  Q as e,
  a2 as o,
  K as n,
  a0 as c,
  a1 as g,
  S as f,
  T as m,
  Y as v,
  _ as l,
} from "./D9q6143x.js";
import { M as u } from "./DOtcRZfx.js";
import { E as y } from "./DeUJRdQC.js";
import { P as b } from "./p41O2Qdo.js";
import { T as h } from "./DhzAXlPS.js";
const k = { class: "self-stretch flex justify-between items-center" },
  w = { class: "self-stretch flex justify-between items-start" },
  _ = { class: "flex-1 flex justify-start items-center gap-3" },
  C = { class: "flex-1 flex flex-col justify-start items-start gap-1" },
  j = { class: "self-stretch flex justify-between items-start" },
  A = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  M = { class: "address-menu-container relative" },
  I = {
    key: 0,
    class:
      "absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]",
  },
  E = ["onClick"],
  N = ["onClick"],
  P = { class: "self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  T = {
    key: 0,
    class:
      "px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1 mt-1",
  },
  V = { key: 1, class: "w-full py-8 flex flex-col items-center justify-center text-gray-400" },
  K = p({
    __name: "CompanyAddressTab",
    props: { addresses: {}, activeAddressMenu: {} },
    emits: ["add-address", "edit-address", "delete-address", "toggle-menu"],
    setup(a, { emit: x }) {
      const r = x;
      return ($, t) => (
        l(),
        i(
          c,
          null,
          [
            e("div", k, [
              t[2] ||
                (t[2] = e(
                  "div",
                  { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
                  "Address",
                  -1,
                )),
              e(
                "div",
                {
                  class:
                    "bg-primary flex justify-end items-center gap-3 rounded-[6px] px-4 py-2 cursor-pointer hover:opacity-80",
                  onClick: t[0] || (t[0] = (s) => r("add-address")),
                },
                [
                  o(n(u), { class: "w-4 h-4 text-white" }),
                  t[1] ||
                    (t[1] = e(
                      "div",
                      { class: "text-white text-sm font-medium font-['Inter'] leading-5" },
                      "Add Address",
                      -1,
                    )),
                ],
              ),
            ]),
            a.addresses.length > 0
              ? (l(!0),
                i(
                  c,
                  { key: 0 },
                  g(
                    a.addresses,
                    (s) => (
                      l(),
                      i(
                        "div",
                        {
                          key: s.id,
                          class:
                            "self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 transition-colors relative",
                        },
                        [
                          e("div", w, [
                            e("div", _, [
                              e("div", C, [
                                e("div", j, [
                                  e("div", A, m(s.label), 1),
                                  e("div", M, [
                                    o(
                                      n(y),
                                      {
                                        class: "w-4 h-4 text-slate-500 cursor-pointer",
                                        onClick: v(
                                          (d) => r("toggle-menu", "tab-" + s.id),
                                          ["stop"],
                                        ),
                                      },
                                      null,
                                      8,
                                      ["onClick"],
                                    ),
                                    a.activeAddressMenu === "tab-" + s.id
                                      ? (l(),
                                        i("div", I, [
                                          e(
                                            "div",
                                            {
                                              class:
                                                "px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2",
                                              onClick: (d) => r("edit-address", "tab-" + s.id),
                                            },
                                            [
                                              o(n(b), { class: "w-3.5 h-3.5 text-slate-600" }),
                                              t[3] ||
                                                (t[3] = e(
                                                  "span",
                                                  { class: "text-sm text-slate-700" },
                                                  "Edit",
                                                  -1,
                                                )),
                                            ],
                                            8,
                                            E,
                                          ),
                                          e(
                                            "div",
                                            {
                                              class:
                                                "px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2",
                                              onClick: (d) => r("delete-address", s.id),
                                            },
                                            [
                                              o(n(h), { class: "w-3.5 h-3.5 text-red-500" }),
                                              t[4] ||
                                                (t[4] = e(
                                                  "span",
                                                  { class: "text-sm text-red-500" },
                                                  "Delete",
                                                  -1,
                                                )),
                                            ],
                                            8,
                                            N,
                                          ),
                                        ]))
                                      : f("", !0),
                                  ]),
                                ]),
                                e("div", P, m(s.fullAddress || "-"), 1),
                              ]),
                            ]),
                          ]),
                          s.isDefault
                            ? (l(),
                              i("div", T, [
                                ...(t[5] ||
                                  (t[5] = [
                                    e(
                                      "div",
                                      {
                                        class:
                                          "text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5",
                                      },
                                      " Main ",
                                      -1,
                                    ),
                                  ])),
                              ]))
                            : f("", !0),
                        ],
                      )
                    ),
                  ),
                  128,
                ))
              : (l(),
                i("div", V, [
                  o(n(u), { class: "w-8 h-8 mb-2 text-gray-300" }),
                  t[6] || (t[6] = e("p", { class: "text-sm" }, "No address available yet.", -1)),
                ])),
          ],
          64,
        )
      );
    },
  });
export { K as _ };
