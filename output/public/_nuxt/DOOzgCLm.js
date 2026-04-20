import { c as a } from "./DrxnuvjT.js";
import { T as o } from "./DrUezNjA.js";
import {
  e as l,
  R as s,
  $ as r,
  K as t,
  Q as c,
  S as i,
  T as n,
  a2 as x,
  _ as d,
} from "./D9q6143x.js";
const u = { class: "flex items-start justify-between" },
  f = l({
    __name: "StatCard",
    props: { card: {}, index: {}, class: {} },
    setup(e) {
      return (m, g) => (
        d(),
        s(
          "div",
          {
            class: r(
              t(a)(
                "border border-border rounded-xl p-4",
                e.card.isPrimary
                  ? "bg-[#012D5A] border-[#012D5A] text-white"
                  : "bg-white border-border",
                m.$props.class,
              ),
            ),
          },
          [
            c("div", u, [
              c("div", null, [
                c(
                  "p",
                  {
                    class: r(
                      t(a)(
                        "text-sm font-medium",
                        e.card.isPrimary ? "text-white/80" : "text-muted-foreground",
                      ),
                    ),
                  },
                  n(e.card.title),
                  3,
                ),
                c(
                  "p",
                  {
                    class: r(
                      t(a)(
                        "text-xl font-bold mt-1",
                        e.card.isPrimary ? "text-white" : "text-foreground",
                      ),
                    ),
                  },
                  n(e.card.value),
                  3,
                ),
              ]),
              e.card.change && e.card.change > 0 && !e.card.suffix
                ? (d(),
                  s(
                    "div",
                    {
                      key: 0,
                      class: r(
                        t(a)(
                          "flex items-center gap-1 text-xs font-medium",
                          e.card.isPrimary ? "text-green-400" : "text-green-600",
                        ),
                      ),
                    },
                    [x(t(o), { class: "w-3 h-3" }), c("span", null, n(e.card.change) + "%", 1)],
                    2,
                  ))
                : i("", !0),
            ]),
            e.card.changeLabel
              ? (d(),
                s(
                  "p",
                  {
                    key: 0,
                    class: r(
                      t(a)(
                        "text-xs mt-2",
                        e.card.isPrimary ? "text-white/60" : "text-muted-foreground",
                      ),
                    ),
                  },
                  n(e.card.changeLabel),
                  3,
                ))
              : i("", !0),
          ],
          2,
        )
      );
    },
  }),
  w = Object.assign(f, { __name: "FinanceStatCard" });
export { w as _ };
