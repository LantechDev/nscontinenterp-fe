import { B as l } from "./CEUvAbAU.js";
import {
  e as u,
  R as a,
  Q as t,
  a0 as c,
  a1 as x,
  a2 as d,
  K as f,
  T as o,
  _ as i,
} from "./D9q6143x.js";
const y = { class: "flex justify-start items-start gap-2 overflow-hidden" },
  g = {
    class:
      "p-2 bg-zinc-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden",
  },
  _ = { class: "self-stretch inline-flex flex-col justify-between items-start" },
  v = { class: "justify-start text-black text-sm font-semibold font-['Inter'] leading-5" },
  h = { class: "justify-start text-black text-sm font-normal font-['Inter'] leading-5" },
  p = { class: "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  b = { key: 1, class: "w-full py-8 flex flex-col items-center justify-center text-gray-400" },
  k = u({
    __name: "CompanyActivityTab",
    props: { activities: {} },
    setup(r) {
      const m = (n) =>
        n
          ? new Date(n).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) + " WIB"
          : "-";
      return (n, e) => (
        i(),
        a(
          c,
          null,
          [
            e[1] ||
              (e[1] = t(
                "div",
                {
                  class: "justify-start text-black text-sm font-semibold font-['Inter'] leading-5",
                },
                " Latest Activity ",
                -1,
              )),
            r.activities.length > 0
              ? (i(!0),
                a(
                  c,
                  { key: 0 },
                  x(
                    r.activities,
                    (s) => (
                      i(),
                      a(
                        "div",
                        {
                          key: s.id,
                          class:
                            "self-stretch inline-flex justify-between items-start flex-wrap content-start",
                        },
                        [
                          t("div", y, [
                            t("div", g, [d(f(l), { class: "w-4 h-4 text-[#012D5A]" })]),
                            t("div", _, [
                              t("div", v, o(s.action), 1),
                              t("div", h, " by " + o(s.user?.name || "System"), 1),
                            ]),
                          ]),
                          t("div", p, o(m(s.createdAt)), 1),
                        ],
                      )
                    ),
                  ),
                  128,
                ))
              : (i(),
                a("div", b, [
                  d(f(l), { class: "w-8 h-8 mb-2 text-gray-300" }),
                  e[0] || (e[0] = t("p", { class: "text-sm" }, "No activity available yet.", -1)),
                ])),
          ],
          64,
        )
      );
    },
  });
export { k as _ };
