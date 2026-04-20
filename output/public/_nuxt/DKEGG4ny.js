import {
  e as N,
  r as f,
  N as v,
  q as k,
  R as i,
  Q as m,
  S as y,
  K as l,
  a2 as g,
  T as x,
  U as O,
  W as R,
  aa as B,
  V,
  a0 as z,
  a1 as A,
  $ as _,
  _ as d,
  ag as T,
} from "./D9q6143x.js";
import { o as U } from "./CpiYPBe4.js";
import { C as Q } from "./f0iIvSiy.js";
import { P as $ } from "./CWUm5Boh.js";
import { C as j } from "./C0WRWJjF.js";
const P = { class: "truncate" },
  q = {
    key: 0,
    class:
      "absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white dark:bg-slate-950 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
  },
  E = { class: "flex items-center border-b px-3 sticky top-0 bg-white dark:bg-slate-950 z-10" },
  F = { class: "p-1" },
  M = { key: 0, class: "py-6 text-center text-sm" },
  W = ["onClick"],
  G = N({
    __name: "Combobox",
    props: {
      modelValue: {},
      options: {},
      labelKey: {},
      valueKey: {},
      placeholder: {},
      allowCreate: { type: Boolean },
      filterLocal: { type: Boolean, default: !0 },
    },
    emits: ["update:modelValue", "create", "search"],
    setup(c, { emit: K }) {
      const t = c,
        b = K,
        n = f(!1),
        a = f(""),
        w = f(null),
        C = f(null);
      v(a, (e) => {
        b("search", e);
      });
      const r = (e) => (t.valueKey && e[t.valueKey] ? String(e[t.valueKey]) : e.id || ""),
        p = (e) => (t.labelKey && e[t.labelKey] ? String(e[t.labelKey]) : e.name || ""),
        h = k(() => {
          if (!t.options) return [];
          if (!t.filterLocal || !a.value) return t.options;
          const e = a.value.toLowerCase();
          return t.options.filter((o) => p(o).toLowerCase().includes(e));
        }),
        u = f(null);
      (v(
        () => t.modelValue,
        (e) => {
          e || (u.value = null);
        },
      ),
        v(
          () => t.options,
          (e) => {
            if (t.modelValue && e) {
              const o = e.find((s) => r(s) === t.modelValue);
              o && (u.value = o);
            }
          },
          { immediate: !0, deep: !0 },
        ));
      const D = k(() => {
        if (u.value && r(u.value) === t.modelValue) return p(u.value);
        const e = t.options.find((o) => r(o) === t.modelValue);
        return e ? ((u.value = e), p(e)) : t.placeholder || "Select option...";
      });
      function L(e) {
        ((u.value = e), b("update:modelValue", r(e)), (n.value = !1), (a.value = ""));
      }
      function S() {
        !t.allowCreate || !a.value || (b("create", a.value), (n.value = !1), (a.value = ""));
      }
      return (
        v(n, (e) => {
          e &&
            T(() => {
              C.value?.focus();
            });
        }),
        U(w, () => {
          n.value = !1;
        }),
        (e, o) => (
          d(),
          i(
            "div",
            { ref_key: "containerRef", ref: w, class: "relative" },
            [
              m(
                "button",
                {
                  type: "button",
                  class:
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  onClick: o[0] || (o[0] = (s) => (n.value = !l(n))),
                },
                [m("span", P, x(l(D)), 1), g(l(Q), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })],
              ),
              l(n)
                ? (d(),
                  i("div", q, [
                    m("div", E, [
                      O(
                        m(
                          "input",
                          {
                            ref_key: "inputRef",
                            ref: C,
                            "onUpdate:modelValue":
                              o[1] || (o[1] = (s) => (B(a) ? (a.value = s) : null)),
                            class:
                              "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                            placeholder: "Search...",
                          },
                          null,
                          512,
                        ),
                        [[R, l(a)]],
                      ),
                    ]),
                    m("div", F, [
                      l(h).length === 0 && !c.allowCreate
                        ? (d(), i("div", M, " No results found. "))
                        : y("", !0),
                      l(h).length === 0 && c.allowCreate && l(a)
                        ? (d(),
                          i(
                            "div",
                            {
                              key: 1,
                              class:
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-[#012D5A]/10 hover:bg-[#012D5A] hover:text-white",
                              onClick: S,
                            },
                            [
                              g(l($), { class: "mr-2 h-4 w-4" }),
                              V(' Create "' + x(l(a)) + '" ', 1),
                            ],
                          ))
                        : y("", !0),
                      (d(!0),
                      i(
                        z,
                        null,
                        A(
                          l(h),
                          (s) => (
                            d(),
                            i(
                              "div",
                              {
                                key: r(s),
                                class: _([
                                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#012D5A] hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                  { "bg-[#012D5A] text-white": c.modelValue === r(s) },
                                ]),
                                onClick: (H) => L(s),
                              },
                              [
                                g(
                                  l(j),
                                  {
                                    class: _([
                                      "mr-2 h-4 w-4",
                                      c.modelValue === r(s) ? "opacity-100" : "opacity-0",
                                    ]),
                                  },
                                  null,
                                  8,
                                  ["class"],
                                ),
                                V(" " + x(p(s)), 1),
                              ],
                              10,
                              W,
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]))
                : y("", !0),
            ],
            512,
          )
        )
      );
    },
  }),
  ee = Object.assign(G, { __name: "UiCombobox" });
export { ee as C };
