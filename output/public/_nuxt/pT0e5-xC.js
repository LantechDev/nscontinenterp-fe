import { e as n, f as o, o as a, R as r, Q as s, _ as u } from "./D9q6143x.js";
const c = { class: "min-h-screen flex items-center justify-center bg-background" },
  l = n({
    __name: "index",
    setup(i) {
      const t = o();
      return (
        a(() => {
          t.push("/login");
        }),
        (d, e) => (
          u(),
          r("div", c, [
            ...(e[0] ||
              (e[0] = [
                s(
                  "div",
                  { class: "animate-pulse" },
                  [s("p", { class: "text-muted-foreground" }, "Memuat...")],
                  -1,
                ),
              ])),
          ])
        )
      );
    },
  });
export { l as default };
