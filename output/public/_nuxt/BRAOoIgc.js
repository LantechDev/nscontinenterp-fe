import { P as x } from "./CWUm5Boh.js";
import { F as f } from "./CJ5hAAEc.js";
import { S as g } from "./CHWjNEBX.js";
import {
  e as _,
  R as i,
  Q as e,
  a2 as r,
  V as d,
  K as l,
  a0 as h,
  a1 as v,
  T as o,
  _ as a,
} from "./D9q6143x.js";
const y = { class: "space-y-6 animate-fade-in p-6-up" },
  N = { class: "flex justify-between items-center" },
  w = { class: "btn-primary text-sm", disabled: "" },
  k = { key: 0, class: "grid gap-4" },
  C = { class: "p-5 flex items-start gap-4" },
  S = {
    class:
      "w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0",
  },
  B = { class: "flex-1 min-w-0" },
  P = { class: "flex items-center justify-between mb-1" },
  j = ["onClick"],
  L = { class: "badge-secondary" },
  E = { class: "flex gap-6 text-sm text-muted-foreground mb-3" },
  R = { class: "flex items-center gap-1" },
  T = { class: "flex items-center gap-1" },
  F = { class: "flex gap-2 text-xs text-muted-foreground mt-2" },
  O = { class: "px-2 py-1 bg-muted rounded border border-border" },
  V = { class: "px-2 py-1 bg-muted rounded border border-border" },
  D = { class: "flex flex-col gap-2" },
  I = ["onClick"],
  $ = {
    key: 1,
    class:
      "text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border",
  },
  J = _({
    __name: "JobBlTab",
    props: { job: {} },
    emits: ["edit-bl"],
    setup(c, { emit: p }) {
      const b = p;
      function m(u) {
        b("edit-bl", u);
      }
      return (u, t) => (
        a(),
        i("div", y, [
          e("div", N, [
            t[1] ||
              (t[1] = e("h2", { class: "text-lg font-semibold" }, "Managed Bills of Lading", -1)),
            e("button", w, [
              r(l(x), { class: "w-4 h-4 mr-2" }),
              t[0] || (t[0] = d(" New BL ", -1)),
            ]),
          ]),
          c.job.billsOfLading && c.job.billsOfLading.length > 0
            ? (a(),
              i("div", k, [
                (a(!0),
                i(
                  h,
                  null,
                  v(
                    c.job.billsOfLading,
                    (s) => (
                      a(),
                      i(
                        "div",
                        {
                          key: s.id,
                          class:
                            "card-elevated p-0 overflow-hidden hover:shadow-lg transition-shadow group",
                        },
                        [
                          e("div", C, [
                            e("div", S, [r(l(f), { class: "w-5 h-5" })]),
                            e("div", B, [
                              e("div", P, [
                                e(
                                  "h3",
                                  {
                                    class:
                                      "font-semibold text-lg hover:text-primary cursor-pointer transition-colors",
                                    onClick: (n) => m(s.id),
                                  },
                                  o(s.blNumber),
                                  9,
                                  j,
                                ),
                                e("span", L, o(s.status?.name || "DRAFT"), 1),
                              ]),
                              e("div", E, [
                                e("span", R, [
                                  t[2] ||
                                    (t[2] = e(
                                      "span",
                                      { class: "font-medium text-foreground" },
                                      "Container:",
                                      -1,
                                    )),
                                  d(" " + o(s.containerNumber || "Pending"), 1),
                                ]),
                                e("span", T, [
                                  t[3] ||
                                    (t[3] = e(
                                      "span",
                                      { class: "font-medium text-foreground" },
                                      "Seal:",
                                      -1,
                                    )),
                                  d(" " + o(s.sealNumber || "-"), 1),
                                ]),
                              ]),
                              e("div", F, [
                                e(
                                  "div",
                                  O,
                                  " Shipper: " +
                                    o(
                                      s.blParties?.find((n) => n.partyRoleCode === "SHIPPER")
                                        ?.companyName || "Not Set",
                                    ),
                                  1,
                                ),
                                e(
                                  "div",
                                  V,
                                  " Consignee: " +
                                    o(
                                      s.blParties?.find((n) => n.partyRoleCode === "CONSIGNEE")
                                        ?.companyName || "Not Set",
                                    ),
                                  1,
                                ),
                              ]),
                            ]),
                            e("div", D, [
                              e(
                                "button",
                                { onClick: (n) => m(s.id), class: "btn-outline text-xs w-full" },
                                [
                                  r(l(g), { class: "w-3.5 h-3.5 mr-2" }),
                                  t[4] || (t[4] = d(" Edit Details ", -1)),
                                ],
                                8,
                                I,
                              ),
                            ]),
                          ]),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
              ]))
            : (a(),
              i("div", $, [
                r(l(f), { class: "w-12 h-12 mx-auto mb-3 opacity-20" }),
                t[5] || (t[5] = d(" No Bills of Lading found. ", -1)),
              ])),
        ])
      );
    },
  });
export { J as default };
