import {
  e as V,
  q as c,
  R as i,
  Q as f,
  $ as h,
  K as l,
  a0 as y,
  a1 as w,
  T as _,
  _ as g,
} from "./D9q6143x.js";
const B = { class: "flex items-center gap-1", "aria-label": "Pagination" },
  D = ["disabled"],
  T = { key: 0, class: "px-2 py-1.5 text-sm text-gray-400" },
  A = ["aria-current", "onClick"],
  G = ["disabled"],
  $ = V({
    __name: "Pagination",
    props: {
      page: { default: 1 },
      total: {},
      itemsPerPage: { default: 10 },
      maxVisiblePages: { default: 5 },
    },
    emits: ["update:page"],
    setup(d, { emit: v }) {
      const a = d,
        u = v,
        p = c(() => Math.ceil(a.total / a.itemsPerPage)),
        P = c(() => {
          const e = [],
            s = p.value,
            o = a.page,
            r = a.maxVisiblePages;
          if (s <= r) for (let t = 1; t <= s; t++) e.push(t);
          else {
            let t = Math.max(1, o - Math.floor(r / 2)),
              n = Math.min(s, t + r - 1);
            (n - t < r - 1 && (t = Math.max(1, n - r + 1)),
              t > 1 && (e.push(1), t > 2 && e.push("...")));
            for (let x = t; x <= n; x++) e.push(x);
            n < s && (n < s - 1 && e.push("..."), e.push(s));
          }
          return e;
        }),
        m = c(() => a.page > 1),
        b = c(() => a.page < p.value),
        k = (e) => {
          e >= 1 && e <= p.value && e !== a.page && u("update:page", e);
        },
        C = () => {
          m.value && u("update:page", a.page - 1);
        },
        N = () => {
          b.value && u("update:page", a.page + 1);
        },
        M = (e) => typeof e == "number";
      return (e, s) => (
        g(),
        i("nav", B, [
          f(
            "button",
            {
              disabled: !l(m),
              class: h([
                "px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors",
                [
                  l(m)
                    ? "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed",
                ],
              ]),
              "aria-label": "Previous page",
              onClick: C,
            },
            " Previous ",
            10,
            D,
          ),
          (g(!0),
          i(
            y,
            null,
            w(
              l(P),
              (o, r) => (
                g(),
                i(
                  y,
                  { key: r },
                  [
                    M(o)
                      ? (g(),
                        i(
                          "button",
                          {
                            key: 1,
                            class: h([
                              "px-3 py-1.5 text-sm font-medium rounded-md border transition-colors",
                              [
                                o === d.page
                                  ? "bg-[#012D5A] text-white border-[#012D5A]"
                                  : "bg-white text-gray-700 border-border hover:bg-gray-50 hover:text-gray-900",
                              ],
                            ]),
                            "aria-current": o === d.page ? "page" : void 0,
                            onClick: (t) => k(o),
                          },
                          _(o),
                          11,
                          A,
                        ))
                      : (g(), i("span", T, _(o), 1)),
                  ],
                  64,
                )
              ),
            ),
            128,
          )),
          f(
            "button",
            {
              disabled: !l(b),
              class: h([
                "px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors",
                [
                  l(b)
                    ? "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed",
                ],
              ]),
              "aria-label": "Next page",
              onClick: N,
            },
            " Next ",
            10,
            G,
          ),
        ])
      );
    },
  }),
  q = Object.assign($, { __name: "UiPagination" });
export { q as _ };
