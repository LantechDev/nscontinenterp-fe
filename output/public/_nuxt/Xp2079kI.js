import { _ as R } from "./Doao-lii.js";
import {
  e as N,
  r as n,
  o as q,
  q as h,
  R as A,
  Q as o,
  O as U,
  a2 as r,
  $ as S,
  K as t,
  U as _,
  W as E,
  aa as i,
  a3 as $,
  Z as I,
  T as Q,
  _ as w,
} from "./D9q6143x.js";
import { _ as z } from "./BRTHGPHk.js";
import { _ as F } from "./DYaXKpGW.js";
import { _ as G } from "./NzrkBPzp.js";
import J from "./C4CVaOeb.js";
import { c as j } from "./DrxnuvjT.js";
import { u as K } from "./CJdNv5wq.js";
import { L as W, a as Z } from "./BopvTZHI.js";
import { S as H } from "./DK0cRrZx.js";
import { C as B } from "./C22E21xF.js";
import { P as X } from "./CWUm5Boh.js";
import "./kUcy7b0j.js";
import "./C0WRWJjF.js";
import "./DeUJRdQC.js";
import "./CEUvAbAU.js";
import "./DvCSiYg8.js";
import "./DLVTjFfJ.js";
import "./DhCF3Kco.js";
import "./CfuPgfv3.js";
import "./CUYdA7L4.js";
import "./DOtcRZfx.js";
import "./p41O2Qdo.js";
import "./DhzAXlPS.js";
import "./Rkz5wlRr.js";
import "./CF_HezSe.js";
import "./Ch8fDJ4_.js";
import "./B_vq8aUR.js";
import "./D0tO-5lw.js";
import "./BT3qE56k.js";
import "./C57YAU4g.js";
import "./b429KWHv.js";
import "./DlAUqK2U.js";
const Y = { class: "space-y-6 animate-fade-in p-6" },
  ee = { class: "flex items-center justify-between" },
  te = { class: "flex items-center gap-2" },
  oe = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  se = { class: "flex items-center justify-between gap-4" },
  ae = { class: "relative w-full max-w-sm" },
  le = { class: "flex items-center gap-3" },
  ne = { class: "relative" },
  re = { class: "relative" },
  ie = { key: 0, class: "flex items-center justify-center py-12" },
  pe = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  ze = N({
    __name: "index",
    setup(ue) {
      const { companies: M, isLoading: O, fetchCompanies: C } = K(),
        v = n(!1),
        D = n(null),
        L = (a) => {
          ((D.value = a), (v.value = !0));
        };
      q(async () => {
        await C();
      });
      const p = n(""),
        u = n("all"),
        m = n("all"),
        f = h(() => {
          let a = M.value.map((e) => ({
            ...e,
            code: e.code || `CUST-${e.id.slice(0, 6).toUpperCase()}`,
            email: e.email || "-",
            phone: e.phone || "-",
            address: e.addresses?.[0]?.fullAddress || "-",
            type: e.isVendor && e.isCustomer ? "Both" : e.isVendor ? "Vendor" : "Company",
            status: e.isActive ? "Active" : "Inactive",
            totalJobs: 0,
            selected: !1,
          }));
          if (p.value) {
            const e = p.value.toLowerCase();
            a = a.filter(
              (l) =>
                l.name.toLowerCase().includes(e) ||
                l.code.toLowerCase().includes(e) ||
                l.email.toLowerCase().includes(e),
            );
          }
          return (
            u.value !== "all" &&
              (a = a.filter((e) => e.type.toLowerCase() === u.value.toLowerCase())),
            m.value !== "all" &&
              (a = a.filter((e) => e.status.toLowerCase() === m.value.toLowerCase())),
            a
          );
        }),
        g = n("name"),
        d = n("asc"),
        b = h(() => {
          const a = [...f.value];
          return (
            a.sort((e, l) => {
              let s = 0;
              switch (g.value) {
                case "name":
                  s = e.name.localeCompare(l.name);
                  break;
                case "code":
                  s = e.code.localeCompare(l.code);
                  break;
                case "type":
                  s = e.type.localeCompare(l.type);
                  break;
                case "status":
                  s = e.status.localeCompare(l.status);
                  break;
                default:
                  s = e.name.localeCompare(l.name);
              }
              return d.value === "asc" ? s : -s;
            }),
            a
          );
        }),
        P = (a) => {
          g.value === a
            ? (d.value = d.value === "asc" ? "desc" : "asc")
            : ((g.value = a), (d.value = "asc"));
        },
        c = n("list"),
        y = n(!1),
        x = n(1),
        V = n({ total: 0, limit: 10, page: 1 }),
        T = (a) => {
          ((x.value = a), C());
        },
        k = h({
          get: () => f.value.length > 0 && f.value.every((a) => a.selected),
          set: (a) => f.value.forEach((e) => (e.selected = a)),
        });
      return (a, e) => {
        const l = R;
        return (
          w(),
          A("div", Y, [
            o("div", ee, [
              e[10] || (e[10] = o("h1", { class: "text-2xl font-bold" }, "Company", -1)),
              o("div", te, [
                o("div", oe, [
                  o(
                    "button",
                    {
                      onClick: e[0] || (e[0] = (s) => (c.value = "list")),
                      class: S(
                        t(j)(
                          "p-1.5 rounded transition-colors",
                          t(c) === "list"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [r(t(W), { class: "w-4 h-4" })],
                    2,
                  ),
                  o(
                    "button",
                    {
                      onClick: e[1] || (e[1] = (s) => (c.value = "grid")),
                      class: S(
                        t(j)(
                          "p-1.5 rounded transition-colors",
                          t(c) === "grid"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [r(t(Z), { class: "w-4 h-4" })],
                    2,
                  ),
                ]),
              ]),
            ]),
            o("div", se, [
              o("div", ae, [
                r(t(H), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                _(
                  o(
                    "input",
                    {
                      "onUpdate:modelValue": e[2] || (e[2] = (s) => (i(p) ? (p.value = s) : null)),
                      type: "text",
                      placeholder: "Search Company...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    512,
                  ),
                  [[E, t(p)]],
                ),
              ]),
              o("div", le, [
                o("div", ne, [
                  _(
                    o(
                      "select",
                      {
                        "onUpdate:modelValue":
                          e[3] || (e[3] = (s) => (i(u) ? (u.value = s) : null)),
                        class:
                          "flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer",
                      },
                      [
                        ...(e[11] ||
                          (e[11] = [
                            o("option", { value: "all" }, "All Types", -1),
                            o("option", { value: "company" }, "Company", -1),
                            o("option", { value: "vendor" }, "Vendor", -1),
                            o("option", { value: "both" }, "Both", -1),
                          ])),
                      ],
                      512,
                    ),
                    [[$, t(u)]],
                  ),
                  r(t(B), {
                    class:
                      "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                o("div", re, [
                  _(
                    o(
                      "select",
                      {
                        "onUpdate:modelValue":
                          e[4] || (e[4] = (s) => (i(m) ? (m.value = s) : null)),
                        class:
                          "flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer",
                      },
                      [
                        ...(e[12] ||
                          (e[12] = [
                            o("option", { value: "all" }, "All Status", -1),
                            o("option", { value: "active" }, "Active", -1),
                            o("option", { value: "inactive" }, "Inactive", -1),
                          ])),
                      ],
                      512,
                    ),
                    [[$, t(m)]],
                  ),
                  r(t(B), {
                    class:
                      "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                  }),
                ]),
                o(
                  "button",
                  {
                    onClick: e[5] || (e[5] = (s) => (y.value = !0)),
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  [
                    r(t(X), { class: "w-4 h-4" }),
                    e[13] || (e[13] = o("span", null, "New Company", -1)),
                  ],
                ),
              ]),
            ]),
            t(O)
              ? (w(), A("div", ie, [r(t(I), { class: "w-8 h-8 animate-spin text-[#012D5A]" })]))
              : t(c) === "list"
                ? (w(),
                  U(
                    z,
                    {
                      key: 1,
                      companies: t(b),
                      "sort-field": t(g),
                      "sort-direction": t(d),
                      "select-all": t(k),
                      "onUpdate:sort": P,
                      onOpenDetail: L,
                      "onUpdate:selectAll": e[6] || (e[6] = (s) => (k.value = s)),
                    },
                    null,
                    8,
                    ["companies", "sort-field", "sort-direction", "select-all"],
                  ))
                : (w(), U(F, { key: 2, companies: t(b), onOpenDetail: L }, null, 8, ["companies"])),
            o("div", pe, [
              o("p", null, Q(t(b).length) + " data found.", 1),
              r(
                l,
                {
                  page: t(x),
                  "onUpdate:page": [e[7] || (e[7] = (s) => (i(x) ? (x.value = s) : null)), T],
                  total: t(V).total,
                  "items-per-page": t(V).limit,
                },
                null,
                8,
                ["page", "total", "items-per-page"],
              ),
            ]),
            r(
              G,
              {
                modelValue: t(y),
                "onUpdate:modelValue": e[8] || (e[8] = (s) => (i(y) ? (y.value = s) : null)),
                onRefresh: t(C),
              },
              null,
              8,
              ["modelValue", "onRefresh"],
            ),
            r(
              J,
              {
                modelValue: t(v),
                "onUpdate:modelValue": e[9] || (e[9] = (s) => (i(v) ? (v.value = s) : null)),
                company: t(D),
              },
              null,
              8,
              ["modelValue", "company"],
            ),
          ])
        );
      };
    },
  });
export { ze as default };
