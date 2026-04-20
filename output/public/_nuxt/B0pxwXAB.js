import { _ as h } from "./kUcy7b0j.js";
import { e as v, R as l, Q as e, a0 as i, a1 as c, T as m, a2 as b, _ as n } from "./D9q6143x.js";
import "./DrxnuvjT.js";
import "./C0WRWJjF.js";
const k = { class: "border border-border rounded-lg overflow-hidden bg-white" },
  A = { class: "w-full text-sm" },
  V = { class: "bg-gray-50 border-b border-border" },
  T = { class: "py-3 px-4" },
  U = { class: "font-medium text-foreground" },
  w = { class: "text-xs text-muted-foreground" },
  R = { class: "flex justify-center" },
  B = { class: "text-center py-3 px-4" },
  P = { class: "flex justify-center" },
  z = v({
    __name: "PermissionsTable",
    props: { permissions: {}, availableActions: {}, availableResources: {} },
    emits: ["toggle", "toggle-all"],
    setup(a, { emit: g }) {
      const d = a,
        u = g,
        x = (o, t) => d.permissions[o]?.includes(t) || !1,
        _ = (o) => {
          const t = d.permissions[o];
          return t && t.length === d.availableActions.length;
        },
        f = (o, t) => {
          u("toggle", o, t);
        },
        y = (o) => {
          u("toggle-all", o);
        };
      return (o, t) => {
        const p = h;
        return (
          n(),
          l("div", k, [
            e("table", A, [
              e("thead", V, [
                e("tr", null, [
                  t[0] ||
                    (t[0] = e(
                      "th",
                      { class: "text-left py-3 px-4 font-medium text-muted-foreground w-1/3" },
                      "Resource",
                      -1,
                    )),
                  (n(!0),
                  l(
                    i,
                    null,
                    c(
                      a.availableActions,
                      (s) => (
                        n(),
                        l(
                          "th",
                          {
                            key: s,
                            class:
                              "text-center py-3 px-4 font-medium text-muted-foreground capitalize",
                          },
                          m(s),
                          1,
                        )
                      ),
                    ),
                    128,
                  )),
                  t[1] ||
                    (t[1] = e(
                      "th",
                      { class: "text-center py-3 px-4 font-medium text-muted-foreground" },
                      "All",
                      -1,
                    )),
                ]),
              ]),
              e("tbody", null, [
                (n(!0),
                l(
                  i,
                  null,
                  c(
                    a.availableResources,
                    (s) => (
                      n(),
                      l(
                        "tr",
                        {
                          key: s.key,
                          class:
                            "border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors",
                        },
                        [
                          e("td", T, [
                            e("div", U, m(s.label), 1),
                            e("div", w, m(s.description), 1),
                          ]),
                          (n(!0),
                          l(
                            i,
                            null,
                            c(
                              a.availableActions,
                              (r) => (
                                n(),
                                l("td", { key: r, class: "text-center py-3 px-4" }, [
                                  e("div", R, [
                                    b(
                                      p,
                                      {
                                        "model-value": x(s.key, r),
                                        "onUpdate:modelValue": (j) => f(s.key, r),
                                      },
                                      null,
                                      8,
                                      ["model-value", "onUpdate:modelValue"],
                                    ),
                                  ]),
                                ])
                              ),
                            ),
                            128,
                          )),
                          e("td", B, [
                            e("div", P, [
                              b(
                                p,
                                { "model-value": _(s.key), "onUpdate:modelValue": (r) => y(s.key) },
                                null,
                                8,
                                ["model-value", "onUpdate:modelValue"],
                              ),
                            ]),
                          ]),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { z as PermissionsTable };
