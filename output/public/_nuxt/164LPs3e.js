import { a as i } from "./DrxnuvjT.js";
import { S as l } from "./BsM_H8Mt.js";
import {
  e as m,
  R as r,
  Q as e,
  a2 as u,
  K as a,
  T as s,
  a0 as c,
  a1 as b,
  _ as n,
} from "./D9q6143x.js";
const f = { class: "space-y-6 animate-fade-in p-6-up" },
  p = { class: "card-elevated p-6" },
  x = { class: "flex items-center gap-4 mb-6 pb-6 border-b border-border" },
  g = { class: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center" },
  v = { class: "text-xl font-semibold" },
  _ = { class: "grid grid-cols-1 md:grid-cols-3 gap-8" },
  y = { class: "space-y-4" },
  h = { class: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-4" },
  j = { class: "space-y-6" },
  w = { class: "font-medium text-lg" },
  B = { class: "text-sm text-muted-foreground" },
  T = { class: "font-medium text-lg" },
  k = { class: "text-sm text-muted-foreground" },
  D = { class: "space-y-4" },
  P = { class: "space-y-3" },
  L = { class: "flex justify-between border-b border-dashed border-border pb-2" },
  O = { class: "font-medium" },
  R = { class: "flex justify-between border-b border-dashed border-border pb-2" },
  C = { class: "font-medium" },
  N = { class: "flex justify-between border-b border-dashed border-border pb-2" },
  S = { class: "font-medium" },
  V = { class: "space-y-4" },
  A = { class: "space-y-3" },
  J = { class: "text-xs text-muted-foreground mb-1" },
  E = { class: "font-medium truncate" },
  q = m({
    __name: "JobOverviewTab",
    props: { job: {} },
    setup(o) {
      return (F, t) => (
        n(),
        r("div", f, [
          e("div", p, [
            e("div", x, [
              e("div", g, [u(a(l), { class: "w-7 h-7 text-primary" })]),
              e("div", null, [
                e("h2", v, s(o.job.commodity), 1),
                t[0] || (t[0] = e("p", { class: "text-muted-foreground" }, "Job Overview", -1)),
              ]),
            ]),
            e("div", _, [
              e("div", y, [
                t[4] ||
                  (t[4] = e(
                    "h4",
                    { class: "text-sm font-medium text-muted-foreground uppercase tracking-wider" },
                    "Route",
                    -1,
                  )),
                e("div", h, [
                  t[3] ||
                    (t[3] = e(
                      "div",
                      { class: "w-1 h-full bg-border relative" },
                      [
                        e("div", {
                          class:
                            "absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary",
                        }),
                        e("div", {
                          class:
                            "absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary",
                        }),
                      ],
                      -1,
                    )),
                  e("div", j, [
                    e("div", null, [
                      t[1] ||
                        (t[1] = e(
                          "p",
                          { class: "text-xs text-muted-foreground" },
                          "POL (Port of Loading)",
                          -1,
                        )),
                      e("p", w, s(o.job.pol), 1),
                      e("p", B, s(a(i)(o.job.etd) || "TBA"), 1),
                    ]),
                    e("div", null, [
                      t[2] ||
                        (t[2] = e(
                          "p",
                          { class: "text-xs text-muted-foreground" },
                          "POD (Port of Discharge)",
                          -1,
                        )),
                      e("p", T, s(o.job.pod), 1),
                      e("p", k, s(a(i)(o.job.eta) || "TBA"), 1),
                    ]),
                  ]),
                ]),
              ]),
              e("div", D, [
                t[8] ||
                  (t[8] = e(
                    "h4",
                    { class: "text-sm font-medium text-muted-foreground uppercase tracking-wider" },
                    " Details ",
                    -1,
                  )),
                e("div", P, [
                  e("div", L, [
                    t[5] ||
                      (t[5] = e("span", { class: "text-sm text-muted-foreground" }, "Vessel", -1)),
                    e("span", O, s(o.job.vessel?.name || "-"), 1),
                  ]),
                  e("div", R, [
                    t[6] ||
                      (t[6] = e(
                        "span",
                        { class: "text-sm text-muted-foreground" },
                        "Container Type",
                        -1,
                      )),
                    e("span", C, s(o.job.containerType?.name || "-"), 1),
                  ]),
                  e("div", N, [
                    t[7] ||
                      (t[7] = e(
                        "span",
                        { class: "text-sm text-muted-foreground" },
                        "Total BLs",
                        -1,
                      )),
                    e("span", S, s(o.job.totalBlCount), 1),
                  ]),
                ]),
              ]),
              e("div", V, [
                t[9] ||
                  (t[9] = e(
                    "h4",
                    { class: "text-sm font-medium text-muted-foreground uppercase tracking-wider" },
                    " Parties (Default) ",
                    -1,
                  )),
                e("div", A, [
                  (n(!0),
                  r(
                    c,
                    null,
                    b(
                      o.job.jobParties,
                      (d) => (
                        n(),
                        r("div", { key: d.id, class: "p-3 bg-muted/30 rounded-lg" }, [
                          e("p", J, s(d.partyRole?.name || d.partyRoleId), 1),
                          e("p", E, s(d.companyName || d.company?.name), 1),
                        ])
                      ),
                    ),
                    128,
                  )),
                ]),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { q as default };
