import {
  e as c,
  R as r,
  S as m,
  a0 as u,
  a1 as x,
  Q as e,
  a2 as i,
  K as n,
  T as s,
  Y as p,
  _ as d,
} from "./D9q6143x.js";
import { B as _ } from "./CEUvAbAU.js";
import { E as h } from "./DeUJRdQC.js";
import { M as f } from "./DvCSiYg8.js";
import { P as g } from "./DLVTjFfJ.js";
const b = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  v = ["onClick"],
  w = { class: "flex items-start justify-between mb-4" },
  y = { class: "flex items-start gap-4" },
  k = { class: "w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0" },
  C = { class: "font-bold text-base text-foreground" },
  B = { class: "text-xs text-muted-foreground" },
  N = { class: "space-y-2 mb-6" },
  V = { class: "flex items-center gap-3 text-sm text-gray-600" },
  j = { class: "flex items-center gap-3 text-sm text-gray-600" },
  E = { class: "flex items-center justify-between pt-4 border-t border-border" },
  M = { class: "flex items-center gap-2" },
  D = { class: "px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium" },
  J = {
    class: "px-2 py-0.5 rounded border border-blue-200 text-blue-500 bg-white text-xs font-medium",
  },
  P = { class: "text-right" },
  S = { class: "font-bold text-sm text-foreground" },
  T = { key: 0, class: "col-span-2 py-8 text-center text-muted-foreground" },
  Q = c({
    __name: "CompanyGrid",
    props: { companies: {} },
    emits: ["open-detail"],
    setup(a) {
      return (l, o) => (
        d(),
        r("div", b, [
          (d(!0),
          r(
            u,
            null,
            x(
              a.companies,
              (t) => (
                d(),
                r(
                  "div",
                  {
                    key: t.id,
                    class:
                      "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                    onClick: ($) => l.$emit("open-detail", t),
                  },
                  [
                    e("div", w, [
                      e("div", y, [
                        e("div", k, [i(n(_), { class: "w-6 h-6 text-[#012D5A]" })]),
                        e("div", null, [e("h3", C, s(t.name), 1), e("p", B, s(t.code), 1)]),
                      ]),
                      e(
                        "button",
                        {
                          class: "text-muted-foreground hover:text-foreground",
                          onClick: o[0] || (o[0] = p(() => {}, ["stop"])),
                        },
                        [i(n(h), { class: "w-4 h-4" })],
                      ),
                    ]),
                    e("div", N, [
                      e("div", V, [i(n(f), { class: "w-4 h-4" }), e("span", null, s(t.email), 1)]),
                      e("div", j, [i(n(g), { class: "w-4 h-4" }), e("span", null, s(t.phone), 1)]),
                    ]),
                    e("div", E, [
                      e("div", M, [e("span", D, s(t.type), 1), e("span", J, s(t.status), 1)]),
                      e("div", P, [
                        e("span", S, s(t.totalJobs), 1),
                        o[1] ||
                          (o[1] = e(
                            "span",
                            { class: "text-xs text-muted-foreground ml-1" },
                            "Total Job",
                            -1,
                          )),
                      ]),
                    ]),
                  ],
                  8,
                  v,
                )
              ),
            ),
            128,
          )),
          a.companies.length === 0 ? (d(), r("div", T, " No companies found ")) : m("", !0),
        ])
      );
    },
  });
export { Q as _ };
