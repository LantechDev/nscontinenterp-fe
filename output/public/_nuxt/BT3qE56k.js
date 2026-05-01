import { B as n } from "./CEUvAbAU.js";
import { e as l, R as e, Q as s, T as r, a2 as i, K as c, a0 as f, _ as o } from "./D9q6143x.js";
const m = {
    key: 0,
    class:
      "self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-slate-50",
  },
  p = { class: "text-black text-sm font-normal font-['Inter'] leading-5 whitespace-pre-wrap" },
  d = { key: 1, class: "w-full py-8 flex flex-col items-center justify-center text-gray-400" },
  g = l({
    __name: "CompanyNotesTab",
    props: { notes: {} },
    setup(a) {
      return (u, t) => (
        o(),
        e(
          f,
          null,
          [
            t[1] ||
              (t[1] = s(
                "div",
                {
                  class: "justify-start text-black text-sm font-semibold font-['Inter'] leading-5",
                },
                "Notes",
                -1,
              )),
            a.notes
              ? (o(), e("div", m, [s("p", p, r(a.notes), 1)]))
              : (o(),
                e("div", d, [
                  i(c(n), { class: "w-8 h-8 mb-2 text-gray-300" }),
                  t[0] || (t[0] = s("p", { class: "text-sm" }, "No notes available yet.", -1)),
                ])),
          ],
          64,
        )
      );
    },
  });
export { g as _ };
