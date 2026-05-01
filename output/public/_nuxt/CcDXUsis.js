import {
  e as _,
  R as o,
  S as x,
  a0 as f,
  a1 as p,
  Q as e,
  a2 as c,
  K as d,
  T as s,
  Y as h,
  $ as g,
  _ as r,
} from "./D9q6143x.js";
import { c as b } from "./DrxnuvjT.js";
import { P as w } from "./Bigz6vPD.js";
import { E as k } from "./DeUJRdQC.js";
const v = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  y = ["onClick"],
  C = { class: "flex items-start justify-between mb-4" },
  V = { class: "flex items-start gap-4" },
  N = { class: "w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0" },
  j = { class: "font-bold text-base text-foreground" },
  B = { class: "text-xs text-muted-foreground" },
  E = { class: "space-y-1 mb-6" },
  S = { class: "flex items-baseline gap-1" },
  A = { class: "text-lg font-bold text-foreground" },
  D = { class: "text-xs text-muted-foreground" },
  P = { class: "flex items-center justify-between pt-4 border-t border-border" },
  $ = { key: 0, class: "col-span-3 py-8 text-center text-muted-foreground" },
  M = _({
    __name: "ServiceGridView",
    props: { services: {} },
    emits: ["row-click"],
    setup(i, { emit: l }) {
      const m = l,
        u = (n) => {
          m("row-click", n);
        };
      return (n, a) => (
        r(),
        o("div", v, [
          (r(!0),
          o(
            f,
            null,
            p(
              i.services,
              (t) => (
                r(),
                o(
                  "div",
                  {
                    key: t.id,
                    class:
                      "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                    onClick: (z) => u(t.id),
                  },
                  [
                    e("div", C, [
                      e("div", V, [
                        e("div", N, [c(d(w), { class: "w-6 h-6 text-[#012D5A]" })]),
                        e("div", null, [e("h3", j, s(t.name), 1), e("p", B, s(t.code), 1)]),
                      ]),
                      e(
                        "button",
                        {
                          class: "text-muted-foreground hover:text-foreground",
                          onClick: a[0] || (a[0] = h(() => {}, ["stop"])),
                        },
                        [c(d(k), { class: "w-4 h-4" })],
                      ),
                    ]),
                    e("div", E, [
                      e("div", S, [e("span", A, s(t.price), 1)]),
                      e("p", D, s(t.unit), 1),
                    ]),
                    e("div", P, [
                      e(
                        "span",
                        {
                          class: g(
                            d(b)(
                              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
                              t.status === "Active"
                                ? "text-blue-500 border-blue-200"
                                : "text-red-500 border-red-200",
                            ),
                          ),
                        },
                        s(t.status),
                        3,
                      ),
                    ]),
                  ],
                  8,
                  y,
                )
              ),
            ),
            128,
          )),
          i.services.length === 0 ? (r(), o("div", $, " No services found ")) : x("", !0),
        ])
      );
    },
  });
export { M as _ };
