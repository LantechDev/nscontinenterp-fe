import {
  e as z,
  r as d,
  q as x,
  aq as Q,
  N as $,
  R as y,
  Q as g,
  O as D,
  $ as O,
  K as o,
  a2 as V,
  T as F,
  S as L,
  a8 as U,
  U as j,
  W as E,
  aa as I,
  Z as K,
  V as B,
  a0 as W,
  a1 as q,
  af as Z,
  _ as h,
  ag as G,
  d as H,
} from "./D9q6143x.js";
import { o as J } from "./CpiYPBe4.js";
import { C as P } from "./f0iIvSiy.js";
import { C as X } from "./C0WRWJjF.js";
const Y = ["disabled"],
  ee = { class: "truncate" },
  te = { class: "flex items-center border-b px-3 sticky top-0 bg-popover" },
  ae = ["disabled"],
  ne = { class: "p-1" },
  se = { key: 0, class: "py-6 text-center text-sm text-muted-foreground" },
  oe = { key: 1, class: "py-6 text-center text-sm text-muted-foreground" },
  re = ["onClick"],
  le = z({
    __name: "SearchSelect",
    props: {
      modelValue: {},
      placeholder: {},
      labelKey: {},
      valueKey: {},
      fetchOptions: { type: Function },
      initialOptions: {},
      formatDisplay: { type: Function },
      debounceMs: {},
      disabled: { type: Boolean },
    },
    emits: ["update:modelValue"],
    setup(a, { expose: l, emit: i }) {
      const t = a,
        w = i,
        f = d(!1),
        n = d(""),
        c = d(null),
        C = d(null),
        p = x(() => {
          if (!c.value) return {};
          const e = c.value.getBoundingClientRect();
          return {
            top: `${e.bottom + 4}px`,
            left: `${e.left}px`,
            width: `${e.width}px`,
            maxWidth: `${e.width}px`,
          };
        }),
        r = d([]),
        u = d(!1),
        v = d(!1),
        N = (e) => (t.labelKey && e[t.labelKey] ? String(e[t.labelKey]) : e.name || e.label || ""),
        R = x(() => t.formatDisplay || N),
        b = (e) => (t.valueKey && e[t.valueKey] ? String(e[t.valueKey]) : e.id),
        S = (e) => R.value(e),
        k = x(() => {
          if (!r.value || r.value.length === 0) return [];
          if (!n.value || t.fetchOptions) return r.value;
          const e = n.value.toLowerCase();
          return r.value.filter((s) => S(s).toLowerCase().includes(e));
        }),
        A = x(() => {
          if (!t.modelValue) return t.placeholder || "Select option...";
          const e = r.value.find((s) => b(s) === t.modelValue);
          return e ? S(e) : t.placeholder || "Select option...";
        }),
        M = Q(async (e) => {
          if (t.fetchOptions) {
            u.value = !0;
            try {
              const s = await t.fetchOptions({ query: e, limit: 50 });
              s.success && s.data && ((r.value = s.data), (v.value = !0));
            } catch (s) {
              console.error("[SearchSelect] Failed to fetch options:", s);
            } finally {
              u.value = !1;
            }
          }
        }, t.debounceMs || 300);
      $(n, (e) => {
        t.fetchOptions && M(e);
      });
      async function _() {
        if (t.initialOptions && t.initialOptions.length > 0) {
          ((r.value = t.initialOptions), (v.value = !0));
          return;
        }
        if (t.fetchOptions && !v.value) {
          u.value = !0;
          try {
            const e = await t.fetchOptions({ query: "", limit: 50 });
            e.success && e.data && ((r.value = e.data), (v.value = !0));
          } catch (e) {
            console.error("[SearchSelect] Initial fetch failed:", e);
          } finally {
            u.value = !1;
          }
        }
      }
      function T(e) {
        (w("update:modelValue", b(e)), (f.value = !1), (n.value = ""));
      }
      return (
        $(f, (e) => {
          e &&
            G(() => {
              (C.value?.focus(), v.value || _());
            });
        }),
        J(c, () => {
          f.value = !1;
        }),
        l({ refresh: _ }),
        (e, s) => (
          h(),
          y(
            "div",
            { ref_key: "containerRef", ref: c, class: "relative" },
            [
              g(
                "button",
                {
                  type: "button",
                  class: O([
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    { "opacity-50": a.disabled },
                  ]),
                  disabled: a.disabled,
                  onClick: s[0] || (s[0] = (m) => (f.value = !o(f))),
                },
                [g("span", ee, F(o(A)), 1), V(o(P), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })],
                10,
                Y,
              ),
              (h(),
              D(Z, { to: "body" }, [
                o(f)
                  ? (h(),
                    y(
                      "div",
                      {
                        key: 0,
                        class:
                          "fixed z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95",
                        style: U(o(p)),
                      },
                      [
                        g("div", te, [
                          j(
                            g(
                              "input",
                              {
                                ref_key: "inputRef",
                                ref: C,
                                "onUpdate:modelValue":
                                  s[1] || (s[1] = (m) => (I(n) ? (n.value = m) : null)),
                                class:
                                  "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                                placeholder: "Search...",
                                disabled: a.disabled,
                              },
                              null,
                              8,
                              ae,
                            ),
                            [[E, o(n)]],
                          ),
                          o(u)
                            ? (h(),
                              D(o(K), {
                                key: 0,
                                class: "h-4 w-4 animate-spin text-muted-foreground",
                              }))
                            : L("", !0),
                        ]),
                        g("div", ne, [
                          o(u) && o(k).length === 0
                            ? (h(),
                              y("div", se, [
                                V(o(K), { class: "h-4 w-4 animate-spin mx-auto mb-2" }),
                                s[2] || (s[2] = B(" Loading... ", -1)),
                              ]))
                            : !o(u) && o(k).length === 0
                              ? (h(), y("div", oe, " No results found. "))
                              : L("", !0),
                          (h(!0),
                          y(
                            W,
                            null,
                            q(
                              o(k),
                              (m) => (
                                h(),
                                y(
                                  "div",
                                  {
                                    key: b(m),
                                    class: O([
                                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                      { "bg-accent": a.modelValue === b(m) },
                                    ]),
                                    onClick: (ue) => T(m),
                                  },
                                  [
                                    V(
                                      o(X),
                                      {
                                        class: O([
                                          "mr-2 h-4 w-4",
                                          a.modelValue === b(m) ? "opacity-100" : "opacity-0",
                                        ]),
                                      },
                                      null,
                                      8,
                                      ["class"],
                                    ),
                                    B(" " + F(S(m)), 1),
                                  ],
                                  10,
                                  re,
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ],
                      4,
                    ))
                  : L("", !0),
              ])),
            ],
            512,
          )
        )
      );
    },
  }),
  he = Object.assign(le, { __name: "UiSearchSelect" });
function ce(a) {
  return `${a.accountCode} - ${a.accountName}`;
}
function ie(a) {
  if (a && typeof a == "object" && "data" in a) {
    const l = a.data;
    if (l?.message) return l.message;
    if (l?.error) return l.error;
  }
  return a instanceof Error ? a.message : "An error occurred";
}
function ve() {
  const a = H(),
    l = d(!1),
    i = d([]);
  async function t() {
    l.value = !0;
    try {
      const n = await $fetch(`${a.public.apiBase}/finance/chart-of-accounts`, {
        credentials: "include",
      });
      return ((i.value = n || []), { success: !0, data: i.value });
    } catch (n) {
      return (
        console.error("[ChartOfAccounts] Failed to fetch:", n), { success: !1, error: ie(n) }
      );
    } finally {
      l.value = !1;
    }
  }
  async function w(n) {
    if (i.value.length === 0) {
      const p = await t();
      if (!p.success) return p;
    }
    if (!n || n.trim() === "") return { success: !0, data: i.value };
    const c = n.toLowerCase().trim();
    return {
      success: !0,
      data: i.value.filter((p) => {
        const r = p.accountCode.toLowerCase().includes(c),
          u = p.accountName.toLowerCase().includes(c),
          v = p.accountType.toLowerCase().includes(c);
        return r || u || v;
      }),
    };
  }
  function f(n) {
    return i.value.find((c) => c.id === n);
  }
  return {
    isLoading: l,
    accounts: i,
    fetchAccounts: t,
    searchAccounts: w,
    formatAccountDisplay: ce,
    getAccountById: f,
  };
}
export { he as S, ve as u };
