import {
  e as a,
  R as d,
  Q as o,
  O as r,
  a9 as n,
  T as i,
  $ as l,
  a7 as c,
  _ as t,
} from "./D9q6143x.js";
const m = ["id"],
  b = {
    class:
      "px-6 py-3.5 border-b border-border/40 flex items-center gap-2.5 bg-muted/5 rounded-t-xl",
  },
  p = { class: "p-1.5 rounded-lg bg-primary/5 text-primary" },
  g = { class: "font-semibold text-[14px] text-foreground/90 uppercase tracking-tight" },
  x = a({
    __name: "SectionCard",
    props: { id: {}, title: {}, icon: {}, bodyClass: {}, noPadding: { type: Boolean } },
    setup(e) {
      return (s, u) => (
        t(),
        d(
          "section",
          {
            id: e.id,
            class:
              "bg-card rounded-xl border border-border/60 shadow-sm scroll-mt-24 transition-all duration-300",
          },
          [
            o("div", b, [
              o("div", p, [(t(), r(n(e.icon), { class: "w-4 h-4" }))]),
              o("h2", g, i(e.title), 1),
            ]),
            o(
              "div",
              { class: l(e.noPadding ? "" : "p-4 md:p-6 " + (e.bodyClass || "")) },
              [c(s.$slots, "default")],
              2,
            ),
          ],
          8,
          m,
        )
      );
    },
  });
export { x as _ };
