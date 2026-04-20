import { _ as S } from "./DXifQ5ls.js";
import { _ as I } from "./BoRvqSZZ.js";
import {
  r as x,
  d as $,
  e as A,
  o as V,
  q as M,
  R as n,
  Q as t,
  S as k,
  a2 as a,
  $ as y,
  K as s,
  P as T,
  a0 as w,
  a1 as B,
  T as u,
  V as J,
  aa as R,
  Y as F,
  _ as l,
} from "./D9q6143x.js";
import { c as j } from "./DrxnuvjT.js";
import { L as O, a as P } from "./BopvTZHI.js";
import { S as U } from "./DK0cRrZx.js";
import { C as K } from "./Btb_jfTP.js";
import { C as q } from "./DnWmaOSL.js";
import { P as z } from "./CWUm5Boh.js";
import { F as C } from "./CJ5hAAEc.js";
import { E as G } from "./DeUJRdQC.js";
import "./CqILFn4p.js";
import "./DivQEVj9.js";
import "./CJdNv5wq.js";
import "./DKEGG4ny.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./C0WRWJjF.js";
import "./DhCF3Kco.js";
import "./CEUvAbAU.js";
import "./DhzAXlPS.js";
import "./BS85nYjr.js";
import "./DXEQVQnt.js";
import "./DlAUqK2U.js";
import "./CCv5WdYi.js";
import "./ByE3J7Q6.js";
import "./BMMhT9Ph.js";
import "./M8y9e51z.js";
import "./CB1d33eS.js";
import "./CCD4SlHB.js";
import "./DD8oliij.js";
import "./CdOyNhW7.js";
import "./BgSnr_43.js";
import "./p41O2Qdo.js";
import "./DzdgE9z_.js";
import "./Drc3X-mx.js";
import "./BfskLp3w.js";
import "./BGAbB0k0.js";
import "./ighQaoU7.js";
import "./CHWjNEBX.js";
import "./CQwnAZS6.js";
import "./CfuPgfv3.js";
import "./D__u8pJn.js";
import "./BsM_H8Mt.js";
import "./DvCSiYg8.js";
import "./C8fnjjG_.js";
import "./C22E21xF.js";
function E(d) {
  if (d && typeof d == "object" && "data" in d) {
    const o = d.data;
    if (o?.message) return o.message;
    if (o?.error) return o.error;
  }
  return d instanceof Error ? d.message : "An error occurred";
}
function Q() {
  const d = $(),
    o = x([]),
    p = x(!1),
    b = x(null);
  async function h() {
    ((p.value = !0), (b.value = null));
    try {
      const c = await $fetch(`${d.public.apiBase}/operational/jobs/bls`, {
        credentials: "include",
      });
      return ((o.value = c || []), o.value);
    } catch (c) {
      return ((b.value = E(c)), console.error("Error fetching EBLs:", c), []);
    } finally {
      p.value = !1;
    }
  }
  async function f(c) {
    ((p.value = !0), (b.value = null));
    try {
      return await $fetch(`${d.public.apiBase}/operational/jobs/bl/${c}`, {
        credentials: "include",
      });
    } catch (_) {
      return ((b.value = E(_)), console.error("Error fetching EBL:", _), null);
    } finally {
      p.value = !1;
    }
  }
  return { ebls: o, isLoading: p, error: b, fetchEbls: h, getEblById: f };
}
const Y = { class: "space-y-6 animate-fade-in p-6" },
  H = { class: "flex items-center justify-between" },
  W = { class: "flex items-center gap-2" },
  X = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  Z = { class: "flex items-center justify-between gap-4" },
  tt = { class: "relative w-full max-w-sm" },
  et = { class: "flex items-center gap-3" },
  st = { key: 0, class: "p-8 text-center text-muted-foreground" },
  ot = { key: 1, class: "border border-border rounded-xl bg-white overflow-hidden" },
  rt = { class: "overflow-x-auto" },
  nt = { class: "w-full" },
  lt = { class: "bg-gray-50 border-b border-border" },
  it = { colspan: "3", class: "py-2.5 px-4" },
  at = { class: "flex items-center gap-2" },
  dt = { class: "text-sm font-bold text-[#012D5A]" },
  ut = {
    class: "text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2",
  },
  ct = ["onClick"],
  mt = { class: "py-3 px-4 pl-8" },
  pt = { class: "flex items-center gap-2" },
  bt = { class: "p-1.5 rounded bg-blue-50 text-[#012D5A]" },
  ft = { class: "text-sm font-medium" },
  gt = { class: "py-3 px-4 text-sm text-muted-foreground" },
  xt = { class: "py-3 px-4" },
  ht = { key: 0 },
  _t = { key: 2, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  vt = ["onClick"],
  yt = { class: "flex items-start justify-between mb-4" },
  wt = { class: "flex items-start gap-4" },
  jt = {
    class:
      "w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0",
  },
  kt = { class: "font-bold text-base text-foreground" },
  Bt = { class: "text-xs text-muted-foreground" },
  Lt = { class: "flex items-center justify-between pt-4 border-t border-border" },
  Ct = { key: 0, class: "col-span-full p-8 text-center text-muted-foreground" },
  Et = { key: 3, class: "flex items-center justify-between text-sm text-muted-foreground" },
  Dt = { class: "flex items-center gap-2" },
  Nt = { class: "p-1 hover:text-foreground disabled:opacity-50" },
  St = { class: "flex items-center gap-1 hover:text-foreground" },
  Le = A({
    __name: "index",
    setup(d) {
      const { ebls: o, fetchEbls: p, isLoading: b } = Q();
      V(async () => {
        await p();
      });
      const h = (i) => {
          const e = i.status?.code || i.statusId || "";
          return (
            {
              draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
              issued: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
              surrendered: {
                label: "Surrendered",
                class: "bg-yellow-50 text-yellow-700 border-yellow-200",
              },
              DRAFT: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
              ISSUED: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
            }[e] || { label: i.status?.name || e || "Unknown", class: "bg-gray-100 text-gray-700" }
          );
        },
        f = x("list"),
        c = x(""),
        _ = x(""),
        v = x(!1);
      function L(i) {
        const e = o.value.find((m) => m.id === i);
        e && ((c.value = e.jobId), (_.value = i), (v.value = !0));
      }
      const D = M(() => {
        const i = {};
        return (
          o.value.forEach((e) => {
            const m = e.jobId;
            (i[m] || (i[m] = { jobId: m, jobNumber: e.job?.jobNumber || "Unknown Job", ebls: [] }),
              i[m].ebls.push(e));
          }),
          Object.values(i)
        );
      });
      return (i, e) => {
        const m = S,
          N = I;
        return (
          l(),
          n("div", Y, [
            t("div", H, [
              e[4] ||
                (e[4] = t(
                  "div",
                  null,
                  [
                    t("h1", { class: "text-2xl font-bold" }, "eBL (Electronic Bill of Lading)"),
                    t("p", { class: "text-muted-foreground mt-1" }, "Kelola dokumen eBL"),
                  ],
                  -1,
                )),
              t("div", W, [
                t("div", X, [
                  t(
                    "button",
                    {
                      onClick: e[0] || (e[0] = (r) => (f.value = "list")),
                      class: y(
                        s(j)(
                          "p-1.5 rounded transition-colors",
                          s(f) === "list"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [a(s(O), { class: "w-4 h-4" })],
                    2,
                  ),
                  t(
                    "button",
                    {
                      onClick: e[1] || (e[1] = (r) => (f.value = "grid")),
                      class: y(
                        s(j)(
                          "p-1.5 rounded transition-colors",
                          s(f) === "grid"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [a(s(P), { class: "w-4 h-4" })],
                    2,
                  ),
                ]),
              ]),
            ]),
            t("div", Z, [
              t("div", tt, [
                a(s(U), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                e[5] ||
                  (e[5] = t(
                    "input",
                    {
                      type: "text",
                      placeholder: "Cari eBL...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    -1,
                  )),
              ]),
              t("div", et, [
                a(
                  m,
                  {
                    to: "/operational/ebl/create",
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  {
                    default: T(() => [
                      a(s(z), { class: "w-4 h-4" }),
                      e[6] || (e[6] = t("span", null, "Buat eBL", -1)),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ]),
            s(b)
              ? (l(), n("div", st, "Loading EBLs..."))
              : s(f) === "list"
                ? (l(),
                  n("div", ot, [
                    t("div", rt, [
                      t("table", nt, [
                        e[9] ||
                          (e[9] = t(
                            "thead",
                            null,
                            [
                              t("tr", { class: "border-b border-border bg-white text-left" }, [
                                t(
                                  "th",
                                  { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                  "No. eBL",
                                ),
                                t(
                                  "th",
                                  { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                  "No. Job",
                                ),
                                t(
                                  "th",
                                  { class: "py-3 px-4 text-sm font-medium text-foreground" },
                                  "Status",
                                ),
                              ]),
                            ],
                            -1,
                          )),
                        t("tbody", null, [
                          (l(!0),
                          n(
                            w,
                            null,
                            B(
                              s(D),
                              (r) => (
                                l(),
                                n(
                                  w,
                                  { key: r.jobId },
                                  [
                                    t("tr", lt, [
                                      t("td", it, [
                                        t("div", at, [
                                          e[7] ||
                                            (e[7] = t(
                                              "span",
                                              {
                                                class:
                                                  "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
                                              },
                                              "Job:",
                                              -1,
                                            )),
                                          t("span", dt, u(r.jobNumber), 1),
                                          t(
                                            "span",
                                            ut,
                                            u(r.ebls.length) +
                                              " BL" +
                                              u(r.ebls.length > 1 ? "S" : ""),
                                            1,
                                          ),
                                        ]),
                                      ]),
                                    ]),
                                    (l(!0),
                                    n(
                                      w,
                                      null,
                                      B(
                                        r.ebls,
                                        (g) => (
                                          l(),
                                          n(
                                            "tr",
                                            {
                                              key: g.id,
                                              class:
                                                "border-b border-border last:border-b hover:bg-muted/30 transition-colors cursor-pointer",
                                              onClick: (It) => L(g.id),
                                            },
                                            [
                                              t("td", mt, [
                                                t("div", pt, [
                                                  t("div", bt, [a(s(C), { class: "w-4 h-4" })]),
                                                  t("span", ft, u(g.blNumber), 1),
                                                ]),
                                              ]),
                                              t("td", gt, u(g.job?.jobNumber || "-"), 1),
                                              t("td", xt, [
                                                t(
                                                  "span",
                                                  {
                                                    class: y(
                                                      s(j)(
                                                        "px-2 py-0.5 rounded border text-xs font-medium",
                                                        h(g).class,
                                                      ),
                                                    ),
                                                  },
                                                  u(h(g).label),
                                                  3,
                                                ),
                                              ]),
                                            ],
                                            8,
                                            ct,
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ],
                                  64,
                                )
                              ),
                            ),
                            128,
                          )),
                          s(o).length === 0
                            ? (l(),
                              n("tr", ht, [
                                ...(e[8] ||
                                  (e[8] = [
                                    t(
                                      "td",
                                      {
                                        colspan: "3",
                                        class: "p-8 text-center text-muted-foreground",
                                      },
                                      "Belum ada data eBL.",
                                      -1,
                                    ),
                                  ])),
                              ]))
                            : k("", !0),
                        ]),
                      ]),
                    ]),
                  ]))
                : (l(),
                  n("div", _t, [
                    (l(!0),
                    n(
                      w,
                      null,
                      B(
                        s(o),
                        (r) => (
                          l(),
                          n(
                            "div",
                            {
                              key: r.id,
                              class:
                                "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                              onClick: (g) => L(r.id),
                            },
                            [
                              t("div", yt, [
                                t("div", wt, [
                                  t("div", jt, [a(s(C), { class: "w-6 h-6" })]),
                                  t("div", null, [
                                    t("h3", kt, u(r.blNumber), 1),
                                    t("p", Bt, u(r.job?.jobNumber || "-"), 1),
                                  ]),
                                ]),
                                t(
                                  "button",
                                  {
                                    class: "text-muted-foreground hover:text-foreground",
                                    onClick: e[2] || (e[2] = F(() => {}, ["stop"])),
                                  },
                                  [a(s(G), { class: "w-4 h-4" })],
                                ),
                              ]),
                              t("div", Lt, [
                                t(
                                  "span",
                                  {
                                    class: y(
                                      s(j)(
                                        "px-2 py-0.5 rounded border text-xs font-medium",
                                        h(r).class,
                                      ),
                                    ),
                                  },
                                  u(h(r).label),
                                  3,
                                ),
                              ]),
                            ],
                            8,
                            vt,
                          )
                        ),
                      ),
                      128,
                    )),
                    s(o).length === 0 ? (l(), n("div", Ct, " Belum ada data eBL. ")) : k("", !0),
                  ])),
            s(o).length > 0
              ? (l(),
                n("div", Et, [
                  t("p", null, u(s(o).length) + " data found.", 1),
                  t("div", Dt, [
                    t("button", Nt, [
                      a(s(K), { class: "w-4 h-4" }),
                      e[10] || (e[10] = t("span", { class: "sr-only" }, "Previous", -1)),
                    ]),
                    e[12] ||
                      (e[12] = t(
                        "button",
                        {
                          class:
                            "w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium",
                        },
                        " 1 ",
                        -1,
                      )),
                    e[13] || (e[13] = t("span", { class: "px-1" }, "...", -1)),
                    t("button", St, [
                      e[11] || (e[11] = J(" Next ", -1)),
                      a(s(q), { class: "w-4 h-4" }),
                    ]),
                  ]),
                ]))
              : k("", !0),
            a(
              N,
              {
                modelValue: s(v),
                "onUpdate:modelValue": e[3] || (e[3] = (r) => (R(v) ? (v.value = r) : null)),
                "job-id": s(c),
                "initial-tab": "ebl",
                "initial-bl-id": s(_),
              },
              null,
              8,
              ["modelValue", "job-id", "initial-bl-id"],
            ),
          ])
        );
      };
    },
  });
export { Le as default };
