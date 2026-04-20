import { _ as q } from "./Doao-lii.js";
import {
  e as O,
  o as D,
  r as i,
  q as k,
  R as P,
  Q as o,
  O as L,
  a2 as n,
  $ as A,
  K as s,
  U as I,
  W as E,
  aa as _,
  a3 as Q,
  Z as z,
  T as G,
  _ as g,
  t as K,
} from "./D9q6143x.js";
import { c as R } from "./DrxnuvjT.js";
import { _ as W } from "./j4w9AyIt.js";
import { _ as Z } from "./CuFnaGyI.js";
import { _ as H } from "./CcDXUsis.js";
import { u as J } from "./DivQEVj9.js";
import { L as X, a as Y } from "./BopvTZHI.js";
import { S as ee } from "./DK0cRrZx.js";
import { P as te } from "./CWUm5Boh.js";
import "./DhCF3Kco.js";
import "./DKEGG4ny.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./C0WRWJjF.js";
import "./CfuPgfv3.js";
import "./C22E21xF.js";
import "./DeUJRdQC.js";
import "./Bigz6vPD.js";
const se = { class: "space-y-6 animate-fade-in p-6" },
  oe = { class: "flex items-center justify-between" },
  re = { class: "flex items-center gap-2" },
  ae = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  ie = { class: "flex items-center justify-between gap-4" },
  ne = { class: "relative w-full max-w-sm" },
  le = { class: "flex items-center gap-3" },
  ce = { key: 0, class: "flex items-center justify-center py-12" },
  ue = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  Me = O({
    __name: "index",
    setup(de) {
      const { services: M, isLoading: $, fetchServices: w, createService: F } = J();
      D(async () => {
        await w();
      });
      const l = i(""),
        c = i("all"),
        U = (t) =>
          t
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(t)
            : "Rp 0",
        C = (t) => {
          const e = t.replace(/[^\d]/g, "");
          return parseInt(e) || 0;
        },
        N = k(() => {
          let t = M.value.map((e) => ({
            id: e.id,
            name: e.name,
            code: e.code,
            price: U(e.customerPrice),
            rawPrice: e.customerPrice || 0,
            unit: e.unit?.name || "-",
            unitId: e.unit?.id || "",
            selected: !1,
            status: e.isActive ? "Active" : "Inactive",
          }));
          if (l.value) {
            const e = l.value.toLowerCase();
            t = t.filter(
              (a) => a.name.toLowerCase().includes(e) || a.code.toLowerCase().includes(e),
            );
          }
          return (
            c.value !== "all" &&
              (t = t.filter((e) => e.status.toLowerCase() === c.value.toLowerCase())),
            t
          );
        }),
        m = i("name"),
        u = i("asc"),
        x = k(() => {
          const t = [...N.value];
          return (
            t.sort((e, a) => {
              let r = 0;
              switch (m.value) {
                case "name":
                  r = e.name.localeCompare(a.name);
                  break;
                case "code":
                  r = e.code.localeCompare(a.code);
                  break;
                case "price":
                  r = e.rawPrice - a.rawPrice;
                  break;
                case "status":
                  r = e.status.localeCompare(a.status);
                  break;
                default:
                  r = e.name.localeCompare(a.name);
              }
              return u.value === "asc" ? r : -r;
            }),
            t
          );
        }),
        j = (t) => {
          m.value === t
            ? (u.value = u.value === "asc" ? "desc" : "asc")
            : ((m.value = t), (u.value = "asc"));
        },
        d = i("list"),
        p = i(!1),
        b = i(!1),
        v = i(null),
        y = i(null),
        B = () => {
          (y.value && y.value.resetForm(), (p.value = !0));
        },
        T = async (t) => {
          if (!t.name || !t.code) {
            v.value = "Please fill in all required fields (Name, Code)";
            return;
          }
          ((b.value = !0), (v.value = null));
          const e = {
              name: t.name,
              code: t.code,
              vendorPrice: C(t.vendorPrice),
              customerPrice: C(t.customerPrice),
              currency: t.currency,
              taxRate: parseFloat(t.taxRate) || 0,
              unitId: t.unitId || void 0,
              categoryId: t.categoryId || void 0,
              isActive: t.status === "Active",
            },
            a = await F(e);
          (a.success
            ? ((p.value = !1), await w())
            : (v.value = a.error || "Failed to create service"),
            (b.value = !1));
        },
        h = (t) => {
          K(`/master/services/${t}`);
        },
        f = i(1),
        S = i({ total: 0, limit: 10, page: 1 }),
        V = (t) => {
          ((f.value = t), w());
        };
      return (t, e) => {
        const a = q;
        return (
          g(),
          P("div", se, [
            o("div", oe, [
              e[6] || (e[6] = o("h1", { class: "text-2xl font-bold" }, "Services", -1)),
              o("div", re, [
                o("div", ae, [
                  o(
                    "button",
                    {
                      onClick: e[0] || (e[0] = (r) => (d.value = "list")),
                      class: A(
                        s(R)(
                          "p-1.5 rounded transition-colors",
                          s(d) === "list"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [n(s(X), { class: "w-4 h-4" })],
                    2,
                  ),
                  o(
                    "button",
                    {
                      onClick: e[1] || (e[1] = (r) => (d.value = "grid")),
                      class: A(
                        s(R)(
                          "p-1.5 rounded transition-colors",
                          s(d) === "grid"
                            ? "bg-[#012D5A] text-white"
                            : "text-muted-foreground hover:bg-muted",
                        ),
                      ),
                    },
                    [n(s(Y), { class: "w-4 h-4" })],
                    2,
                  ),
                ]),
              ]),
            ]),
            o("div", ie, [
              o("div", ne, [
                n(s(ee), {
                  class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                }),
                I(
                  o(
                    "input",
                    {
                      "onUpdate:modelValue": e[2] || (e[2] = (r) => (_(l) ? (l.value = r) : null)),
                      type: "text",
                      placeholder: "Search Service...",
                      class:
                        "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                    },
                    null,
                    512,
                  ),
                  [[E, s(l)]],
                ),
              ]),
              o("div", le, [
                I(
                  o(
                    "select",
                    {
                      "onUpdate:modelValue": e[3] || (e[3] = (r) => (_(c) ? (c.value = r) : null)),
                      class:
                        "px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground border border-border",
                    },
                    [
                      ...(e[7] ||
                        (e[7] = [
                          o("option", { value: "all" }, "All Status", -1),
                          o("option", { value: "active" }, "Active", -1),
                          o("option", { value: "inactive" }, "Inactive", -1),
                        ])),
                    ],
                    512,
                  ),
                  [[Q, s(c)]],
                ),
                o(
                  "button",
                  {
                    onClick: B,
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                  },
                  [
                    n(s(te), { class: "w-4 h-4" }),
                    e[8] || (e[8] = o("span", null, "New Service", -1)),
                  ],
                ),
              ]),
            ]),
            s($)
              ? (g(), P("div", ce, [n(s(z), { class: "w-8 h-8 animate-spin text-[#012D5A]" })]))
              : s(d) === "list"
                ? (g(),
                  L(
                    s(Z),
                    {
                      key: 1,
                      services: s(x),
                      "sort-field": s(m),
                      "sort-direction": s(u),
                      onToggleSort: j,
                      onRowClick: h,
                    },
                    null,
                    8,
                    ["services", "sort-field", "sort-direction"],
                  ))
                : (g(), L(s(H), { key: 2, services: s(x), onRowClick: h }, null, 8, ["services"])),
            o("div", ue, [
              o("p", null, G(s(x).length) + " data found.", 1),
              n(
                a,
                {
                  page: s(f),
                  "onUpdate:page": [e[4] || (e[4] = (r) => (_(f) ? (f.value = r) : null)), V],
                  total: s(S).total,
                  "items-per-page": s(S).limit,
                },
                null,
                8,
                ["page", "total", "items-per-page"],
              ),
            ]),
            n(
              s(W),
              {
                ref_key: "createModalRef",
                ref: y,
                "is-open": s(p),
                "is-submitting": s(b),
                error: s(v),
                "onUpdate:isOpen": e[5] || (e[5] = (r) => (p.value = r)),
                onSubmit: T,
              },
              null,
              8,
              ["is-open", "is-submitting", "error"],
            ),
          ])
        );
      };
    },
  });
export { Me as default };
