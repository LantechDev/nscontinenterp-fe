import { S as o } from "./BsM_H8Mt.js";
import { e as i, R as l, Q as e, a2 as d, K as r, T as n, _ as c } from "./D9q6143x.js";
const a = { class: "grid grid-cols-1 md:grid-cols-3 gap-4" },
  x = { class: "bg-white border border-border rounded-xl p-5" },
  u = { class: "flex items-center gap-4" },
  g = { class: "w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0" },
  _ = { class: "text-2xl font-bold text-foreground" },
  f = { class: "bg-white border border-border rounded-xl p-5" },
  h = { class: "flex items-center gap-4" },
  m = { class: "w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0" },
  b = { class: "text-2xl font-bold text-foreground" },
  p = { class: "bg-white border border-border rounded-xl p-5" },
  v = { class: "flex items-center gap-4" },
  w = { class: "w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0" },
  V = { class: "text-2xl font-bold text-foreground" },
  j = i({
    __name: "VesselStats",
    props: { total: {}, active: {}, inactive: {} },
    setup(s) {
      return (k, t) => (
        c(),
        l("div", a, [
          e("div", x, [
            e("div", u, [
              e("div", g, [d(r(o), { class: "w-6 h-6 text-blue-600" })]),
              e("div", null, [
                t[0] ||
                  (t[0] = e("p", { class: "text-sm text-muted-foreground" }, "Total Vessels", -1)),
                e("p", _, n(s.total), 1),
              ]),
            ]),
          ]),
          e("div", f, [
            e("div", h, [
              e("div", m, [d(r(o), { class: "w-6 h-6 text-green-600" })]),
              e("div", null, [
                t[1] ||
                  (t[1] = e("p", { class: "text-sm text-muted-foreground" }, "Active Vessels", -1)),
                e("p", b, n(s.active), 1),
              ]),
            ]),
          ]),
          e("div", p, [
            e("div", v, [
              e("div", w, [d(r(o), { class: "w-6 h-6 text-red-600" })]),
              e("div", null, [
                t[2] ||
                  (t[2] = e(
                    "p",
                    { class: "text-sm text-muted-foreground" },
                    "Inactive Vessels",
                    -1,
                  )),
                e("p", V, n(s.inactive), 1),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { j as _ };
