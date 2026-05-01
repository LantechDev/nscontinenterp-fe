import { c as f } from "./DrxnuvjT.js";
import {
  e as x,
  O as p,
  R as s,
  S as a,
  Q as t,
  T as r,
  a2 as b,
  K as d,
  ae as h,
  a7 as c,
  $ as y,
  af as _,
  _ as o,
} from "./D9q6143x.js";
const g = { key: 0, class: "fixed inset-0 z-[1100] flex items-center justify-center p-4" },
  v = { class: "flex items-start justify-between px-6 py-4 border-b border-border" },
  k = { key: 0, class: "text-xl font-bold text-foreground overflow-hidden text-ellipsis" },
  w = { key: 1, class: "text-sm text-muted-foreground mt-1" },
  V = { class: "p-6 overflow-y-auto" },
  B = {
    key: 0,
    class:
      "px-6 py-4 border-t border-border bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3",
  },
  C = x({
    __name: "Modal",
    props: { modelValue: { type: Boolean }, title: {}, description: {}, width: {} },
    emits: ["update:modelValue", "close"],
    setup(e, { emit: u }) {
      const m = e,
        i = u,
        n = () => {
          (i("update:modelValue", !1), i("close"));
        };
      return (l, j) => (
        o(),
        p(_, { defer: "", to: "body" }, [
          e.modelValue
            ? (o(),
              s("div", g, [
                t("div", {
                  class: "fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm",
                  onClick: n,
                }),
                t(
                  "div",
                  {
                    class: y(
                      d(f)(
                        "relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95",
                        m.width || "max-w-3xl",
                      ),
                    ),
                  },
                  [
                    t("div", v, [
                      t("div", null, [
                        e.title ? (o(), s("h2", k, r(e.title), 1)) : a("", !0),
                        e.description ? (o(), s("p", w, r(e.description), 1)) : a("", !0),
                      ]),
                      t(
                        "button",
                        {
                          onClick: n,
                          class:
                            "p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors",
                        },
                        [b(d(h), { class: "w-5 h-5" })],
                      ),
                    ]),
                    t("div", V, [c(l.$slots, "default")]),
                    l.$slots.footer ? (o(), s("div", B, [c(l.$slots, "footer")])) : a("", !0),
                  ],
                  2,
                ),
              ]))
            : a("", !0),
        ])
      );
    },
  }),
  N = Object.assign(C, { __name: "UiModal" });
export { N as _ };
