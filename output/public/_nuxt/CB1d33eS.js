import {
  c as j,
  r as D,
  d as R,
  e as Y,
  q as M,
  R as h,
  Q as u,
  S as z,
  $,
  K as m,
  a2 as _,
  T as v,
  a0 as B,
  a1 as S,
  _ as p,
} from "./D9q6143x.js";
import { o as E } from "./CpiYPBe4.js";
import { C as N } from "./M8y9e51z.js";
import { C as q } from "./Btb_jfTP.js";
import { C as U } from "./DnWmaOSL.js";
const ce = j("box", [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      key: "hh9hay",
    },
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
]);
const ie = j("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
]);
function K(t) {
  if (t && typeof t == "object" && "data" in t) {
    const o = t.data;
    if (o?.message) return o.message;
    if (o?.error) return o.error;
  }
  return t instanceof Error ? t.message : "An error occurred";
}
function T(t) {
  return { success: !1, error: K(t) };
}
function le() {
  const t = R(),
    o = D(!1);
  async function n() {
    try {
      return await $fetch(`${t.public.apiBase}/master/companies`, { credentials: "include" });
    } catch {
      return [];
    }
  }
  async function w() {
    try {
      return await $fetch(`${t.public.apiBase}/master/container-types`, { credentials: "include" });
    } catch {
      return [];
    }
  }
  async function l() {
    try {
      return await $fetch(`${t.public.apiBase}/master/package-types`, { credentials: "include" });
    } catch {
      return [];
    }
  }
  async function y(s) {
    try {
      return await $fetch(`${t.public.apiBase}/master/vessels`, {
        params: { search: s },
        credentials: "include",
      });
    } catch {
      return [];
    }
  }
  async function c(s) {
    try {
      return await $fetch(`${t.public.apiBase}/master/ports`, {
        params: { search: s },
        credentials: "include",
      });
    } catch {
      return [];
    }
  }
  async function k(s, d) {
    try {
      return (
        (o.value = !0),
        {
          success: !0,
          data: await $fetch(`${t.public.apiBase}/master/companies`, {
            method: "POST",
            body: { name: s, isCustomer: !0, isVendor: !1, ...d },
            credentials: "include",
          }),
        }
      );
    } catch (g) {
      return T(g);
    } finally {
      o.value = !1;
    }
  }
  async function x(s) {
    try {
      return (
        (o.value = !0),
        {
          success: !0,
          data: await $fetch(`${t.public.apiBase}/master/vessels`, {
            method: "POST",
            body: { name: s },
            credentials: "include",
          }),
        }
      );
    } catch (d) {
      return T(d);
    } finally {
      o.value = !1;
    }
  }
  async function C() {
    try {
      return await $fetch(`${t.public.apiBase}/master/payment-methods`, { credentials: "include" });
    } catch {
      return [];
    }
  }
  return {
    isLoading: o,
    fetchCompanies: n,
    fetchContainerTypes: w,
    fetchPackageTypes: l,
    fetchVessels: y,
    fetchPorts: c,
    fetchPaymentMethods: C,
    createCompany: k,
    createVessel: x,
  };
}
const H = ["disabled"],
  J = { class: "truncate" },
  Q = {
    key: 0,
    class:
      "absolute z-[1001] mt-1 w-72 rounded-md border bg-white dark:bg-slate-950 p-3 shadow-lg animate-in fade-in zoom-in-95",
  },
  Z = { class: "flex items-center justify-between mb-4" },
  G = { class: "text-sm font-semibold" },
  W = { class: "grid grid-cols-7 gap-1 mb-1" },
  X = { class: "grid grid-cols-7 gap-1" },
  ee = ["onClick"],
  te = Y({
    __name: "DatePicker",
    props: { modelValue: {}, placeholder: {}, disabled: { type: Boolean } },
    emits: ["update:modelValue"],
    setup(t, { emit: o }) {
      const n = t,
        w = o,
        l = D(!1),
        y = D(null),
        c = D(n.modelValue ? new Date(n.modelValue) : new Date()),
        k = M(() => {
          if (!n.modelValue) return n.placeholder || "Select date...";
          try {
            const e = new Date(n.modelValue);
            return new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(e);
          } catch {
            return n.modelValue;
          }
        }),
        x = M(() =>
          new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(c.value),
        ),
        C = M(() => {
          const e = c.value.getFullYear(),
            a = c.value.getMonth(),
            r = new Date(e, a, 1),
            b = new Date(e, a + 1, 0),
            f = [],
            P = r.getDay(),
            O = new Date(e, a, 0).getDate();
          for (let i = P - 1; i >= 0; i--)
            f.push({ day: O - i, month: a - 1, year: e, isCurrentMonth: !1 });
          for (let i = 1; i <= b.getDate(); i++)
            f.push({ day: i, month: a, year: e, isCurrentMonth: !0 });
          const L = 42 - f.length;
          for (let i = 1; i <= L; i++)
            f.push({ day: i, month: a + 1, year: e, isCurrentMonth: !1 });
          return f;
        }),
        s = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      function d() {
        n.disabled ||
          ((l.value = !l.value), l.value && n.modelValue && (c.value = new Date(n.modelValue)));
      }
      function g() {
        c.value = new Date(c.value.getFullYear(), c.value.getMonth() - 1, 1);
      }
      function A() {
        c.value = new Date(c.value.getFullYear(), c.value.getMonth() + 1, 1);
      }
      function F(e) {
        const a = new Date(e.year, e.month, e.day),
          r = a.getTimezoneOffset(),
          f = new Date(a.getTime() - r * 60 * 1e3).toISOString().split("T")[0];
        (w("update:modelValue", f), (l.value = !1));
      }
      function V(e) {
        if (!n.modelValue) return !1;
        const a = new Date(n.modelValue);
        return a.getDate() === e.day && a.getMonth() === e.month && a.getFullYear() === e.year;
      }
      function I(e) {
        const a = new Date();
        return a.getDate() === e.day && a.getMonth() === e.month && a.getFullYear() === e.year;
      }
      return (
        E(y, () => {
          l.value = !1;
        }),
        (e, a) => (
          p(),
          h(
            "div",
            { ref_key: "containerRef", ref: y, class: "relative w-full" },
            [
              u(
                "button",
                {
                  type: "button",
                  class: $([
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-muted/50",
                    {
                      "text-muted-foreground": !t.modelValue,
                      "ring-2 ring-ring ring-offset-2": m(l),
                    },
                  ]),
                  disabled: t.disabled,
                  onClick: d,
                },
                [u("span", J, v(m(k)), 1), _(m(N), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })],
                10,
                H,
              ),
              m(l)
                ? (p(),
                  h("div", Q, [
                    u("div", Z, [
                      u(
                        "button",
                        {
                          type: "button",
                          onClick: g,
                          class: "p-1 hover:bg-muted rounded-md transition-colors",
                        },
                        [_(m(q), { class: "w-4 h-4" })],
                      ),
                      u("span", G, v(m(x)), 1),
                      u(
                        "button",
                        {
                          type: "button",
                          onClick: A,
                          class: "p-1 hover:bg-muted rounded-md transition-colors",
                        },
                        [_(m(U), { class: "w-4 h-4" })],
                      ),
                    ]),
                    u("div", W, [
                      (p(),
                      h(
                        B,
                        null,
                        S(s, (r) =>
                          u(
                            "span",
                            {
                              key: r,
                              class:
                                "text-center text-[10px] font-bold text-muted-foreground uppercase py-1",
                            },
                            v(r),
                            1,
                          ),
                        ),
                        64,
                      )),
                    ]),
                    u("div", X, [
                      (p(!0),
                      h(
                        B,
                        null,
                        S(
                          m(C),
                          (r, b) => (
                            p(),
                            h(
                              "button",
                              {
                                key: b,
                                type: "button",
                                onClick: (f) => F(r),
                                class: $([
                                  "h-8 w-full flex items-center justify-center rounded-md text-xs transition-all",
                                  [
                                    r.isCurrentMonth
                                      ? "text-foreground hover:bg-muted"
                                      : "text-muted-foreground/40",
                                    V(r) ? "bg-[#012D5A] text-white hover:bg-[#012D5A]" : "",
                                    I(r) && !V(r) ? "border border-[#012D5A] text-[#012D5A]" : "",
                                  ],
                                ]),
                              },
                              v(r.day),
                              11,
                              ee,
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]))
                : z("", !0),
            ],
            512,
          )
        )
      );
    },
  }),
  ue = Object.assign(te, { __name: "UiDatePicker" });
export { ce as B, ue as D, ie as U, le as u };
