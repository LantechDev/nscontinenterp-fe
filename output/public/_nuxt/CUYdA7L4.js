import {
  e as p,
  R as a,
  Q as t,
  T as l,
  a2 as n,
  K as o,
  a0 as v,
  a1 as g,
  S as m,
  Y as h,
  _ as r,
} from "./D9q6143x.js";
import { P as y } from "./CWUm5Boh.js";
import { M as b } from "./DvCSiYg8.js";
import { P as _ } from "./DLVTjFfJ.js";
import { M as j } from "./DOtcRZfx.js";
import { E as w } from "./DeUJRdQC.js";
import { P as k } from "./p41O2Qdo.js";
import { T as I } from "./DhzAXlPS.js";
const C = {
    class:
      "w-96 shrink-0 self-stretch p-5 border-r border-slate-200 flex flex-col justify-between items-start overflow-y-auto",
  },
  A = { class: "self-stretch flex flex-col justify-start items-start gap-4" },
  D = { class: "self-stretch inline-flex justify-start items-start" },
  P = { class: "inline-flex flex-col justify-start items-start" },
  M = { class: "text-black text-base font-semibold font-['Inter'] leading-6" },
  E = { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  N = { class: "self-stretch inline-flex justify-center items-center gap-4" },
  $ = { class: "self-stretch flex flex-col justify-start items-start gap-4 mt-2" },
  B = { class: "self-stretch text-black text-sm font-normal font-['Inter'] leading-5" },
  S = { class: "self-stretch flex flex-col justify-start items-start gap-4 mt-2" },
  V = { class: "self-stretch flex flex-col justify-start items-start gap-4" },
  T = { class: "inline-flex justify-center items-center gap-2.5" },
  L = {
    class:
      "p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden",
  },
  z = { class: "inline-flex flex-col justify-center items-start" },
  F = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  J = { class: "inline-flex justify-center items-center gap-2.5" },
  K = {
    class:
      "p-2 bg-slate-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden",
  },
  Q = { class: "inline-flex flex-col justify-center items-start" },
  R = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  U = { class: "self-stretch flex flex-col justify-start items-start gap-4 mt-2" },
  W = { class: "self-stretch flex flex-col justify-start items-start gap-2" },
  Y = { class: "self-stretch inline-flex justify-between items-center" },
  q = { class: "self-stretch inline-flex justify-between items-start" },
  G = { class: "flex-1 flex justify-start items-center gap-3" },
  H = { class: "flex-1 inline-flex flex-col justify-start items-start gap-1" },
  O = { class: "self-stretch inline-flex justify-between items-start" },
  X = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  Z = { class: "address-menu-container relative" },
  tt = {
    key: 0,
    class:
      "absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 min-w-[120px]",
  },
  et = ["onClick"],
  st = ["onClick"],
  it = { class: "self-stretch text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  lt = {
    key: 0,
    class:
      "px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 inline-flex justify-start items-center gap-1 mt-1",
  },
  nt = {
    key: 1,
    class: "self-stretch text-gray-400 text-sm font-normal font-['Inter'] leading-5 py-4",
  },
  ot = { class: "self-stretch flex flex-col justify-start items-start gap-3 mt-6" },
  at = { class: "inline-flex justify-center items-center gap-2.5" },
  rt = { class: "inline-flex flex-col justify-center items-start" },
  dt = { class: "text-gray-400 text-sm font-normal font-['Inter'] leading-5" },
  ht = p({
    __name: "CompanySidebar",
    props: { company: {}, addresses: {}, activeAddressMenu: {} },
    emits: [
      "new-job",
      "add-address",
      "edit-address",
      "delete-address",
      "toggle-menu",
      "close-menu",
    ],
    setup(i, { emit: x }) {
      const d = x,
        u = (c) =>
          c
            ? new Date(c).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) + " WIB"
            : "-";
      return (c, e) => (
        r(),
        a("div", C, [
          t("div", A, [
            t("div", D, [
              t("div", P, [t("div", M, l(i.company.name), 1), t("div", E, l(i.company.code), 1)]),
            ]),
            t("div", N, [
              t(
                "div",
                {
                  class:
                    "flex-1 px-4 py-2.5 bg-primary rounded-md flex justify-center items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-colors",
                  onClick: e[0] || (e[0] = (s) => d("new-job")),
                },
                [
                  n(o(y), { class: "w-4 h-4 text-white" }),
                  e[2] ||
                    (e[2] = t(
                      "div",
                      { class: "text-white text-sm font-medium font-['Inter'] leading-5" },
                      "New Job",
                      -1,
                    )),
                ],
              ),
            ]),
            t("div", $, [
              e[3] ||
                (e[3] = t(
                  "div",
                  { class: "self-stretch flex flex-col justify-start items-start gap-2" },
                  [
                    t(
                      "div",
                      { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
                      "Description",
                    ),
                    t("div", { class: "self-stretch h-px bg-slate-100" }),
                  ],
                  -1,
                )),
              t("div", B, l(i.company.description || "-"), 1),
            ]),
            t("div", S, [
              e[6] ||
                (e[6] = t(
                  "div",
                  { class: "self-stretch flex flex-col justify-start items-start gap-2" },
                  [
                    t(
                      "div",
                      { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
                      " Contact Details ",
                    ),
                    t("div", { class: "self-stretch h-px bg-slate-100" }),
                  ],
                  -1,
                )),
              t("div", V, [
                t("div", T, [
                  t("div", L, [n(o(b), { class: "w-4 h-4 text-[#012D5A]" })]),
                  t("div", z, [
                    e[4] ||
                      (e[4] = t(
                        "div",
                        { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
                        " Email Address ",
                        -1,
                      )),
                    t("div", F, l(i.company.email || "-"), 1),
                  ]),
                ]),
                t("div", J, [
                  t("div", K, [n(o(_), { class: "w-4 h-4 text-[#012D5A]" })]),
                  t("div", Q, [
                    e[5] ||
                      (e[5] = t(
                        "div",
                        { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
                        "Phone",
                        -1,
                      )),
                    t("div", R, l(i.company.phone || "-"), 1),
                  ]),
                ]),
              ]),
            ]),
            t("div", U, [
              t("div", W, [
                t("div", Y, [
                  e[8] ||
                    (e[8] = t(
                      "div",
                      { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
                      "Address",
                      -1,
                    )),
                  t(
                    "div",
                    {
                      class:
                        "flex justify-end items-center gap-2 px-4 py-2 cursor-pointer hover:opacity-80",
                      onClick: e[1] || (e[1] = (s) => d("add-address")),
                    },
                    [
                      n(o(j), { class: "w-4 h-4 text-primary" }),
                      e[7] ||
                        (e[7] = t(
                          "div",
                          { class: "text-primary text-sm font-medium font-['Inter'] leading-5" },
                          " Add Address ",
                          -1,
                        )),
                    ],
                  ),
                ]),
                e[9] || (e[9] = t("div", { class: "self-stretch h-px bg-slate-100" }, null, -1)),
              ]),
              i.addresses.length > 0
                ? (r(!0),
                  a(
                    v,
                    { key: 0 },
                    g(
                      i.addresses,
                      (s) => (
                        r(),
                        a(
                          "div",
                          {
                            key: s.id,
                            class:
                              "self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 relative",
                          },
                          [
                            t("div", q, [
                              t("div", G, [
                                t("div", H, [
                                  t("div", O, [
                                    t("div", X, l(s.label), 1),
                                    t("div", Z, [
                                      n(
                                        o(w),
                                        {
                                          class: "w-4 h-4 text-slate-500 cursor-pointer",
                                          onClick: h((f) => d("toggle-menu", s.id), ["stop"]),
                                        },
                                        null,
                                        8,
                                        ["onClick"],
                                      ),
                                      i.activeAddressMenu === s.id
                                        ? (r(),
                                          a("div", tt, [
                                            t(
                                              "div",
                                              {
                                                class:
                                                  "px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2",
                                                onClick: (f) => d("edit-address", s.id),
                                              },
                                              [
                                                n(o(k), { class: "w-3.5 h-3.5 text-slate-600" }),
                                                e[10] ||
                                                  (e[10] = t(
                                                    "span",
                                                    { class: "text-sm text-slate-700" },
                                                    "Edit",
                                                    -1,
                                                  )),
                                              ],
                                              8,
                                              et,
                                            ),
                                            t(
                                              "div",
                                              {
                                                class:
                                                  "px-3 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-2",
                                                onClick: (f) => d("delete-address", s.id),
                                              },
                                              [
                                                n(o(I), { class: "w-3.5 h-3.5 text-red-500" }),
                                                e[11] ||
                                                  (e[11] = t(
                                                    "span",
                                                    { class: "text-sm text-red-500" },
                                                    "Delete",
                                                    -1,
                                                  )),
                                              ],
                                              8,
                                              st,
                                            ),
                                          ]))
                                        : m("", !0),
                                    ]),
                                  ]),
                                  t("div", it, l(s.fullAddress || "-"), 1),
                                ]),
                              ]),
                            ]),
                            s.isDefault
                              ? (r(),
                                a("div", lt, [
                                  ...(e[12] ||
                                    (e[12] = [
                                      t(
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
                              : m("", !0),
                          ],
                        )
                      ),
                    ),
                    128,
                  ))
                : (r(), a("div", nt, " No address available ")),
            ]),
          ]),
          t("div", ot, [
            t("div", at, [
              t("div", rt, [t("div", dt, " Created " + l(u(i.company.createdAt)), 1)]),
            ]),
          ]),
        ])
      );
    },
  });
export { ht as _ };
