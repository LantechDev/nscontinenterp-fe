import { B as c } from "./CEUvAbAU.js";
import {
  e as f,
  R as o,
  Q as t,
  a0 as d,
  a1 as m,
  a2 as u,
  K as x,
  S as p,
  T as n,
  _ as i,
} from "./D9q6143x.js";
const _ = { class: "flex justify-start items-start gap-2" },
  g = { class: "inline-flex flex-col justify-start items-start gap-1" },
  y = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  v = { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  b = {
    key: 0,
    class:
      "px-2 py-0.5 bg-blue-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1",
  },
  h = { class: "text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5" },
  k = { class: "flex-1 flex justify-end items-center gap-4 overflow-hidden" },
  j = { class: "inline-flex flex-col justify-center items-end gap-1" },
  w = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  I = { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  C = { class: "inline-flex flex-col justify-center items-start gap-1" },
  B = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  D = { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  N = { key: 1, class: "w-full py-8 flex flex-col items-center justify-center text-gray-400" },
  E = f({
    __name: "CompanyJobTab",
    props: { jobs: {}, companyCode: {} },
    setup(a) {
      const r = (l) =>
        l
          ? new Date(l).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "-";
      return (l, s) => (
        i(),
        o(
          d,
          null,
          [
            s[2] ||
              (s[2] = t(
                "div",
                {
                  class: "justify-start text-black text-sm font-semibold font-['Inter'] leading-5",
                },
                " Current Job ",
                -1,
              )),
            a.jobs.length > 0
              ? (i(!0),
                o(
                  d,
                  { key: 0 },
                  m(
                    a.jobs,
                    (e) => (
                      i(),
                      o(
                        "div",
                        {
                          key: e.id,
                          class:
                            "self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 inline-flex justify-start items-start gap-2 overflow-hidden hover:bg-slate-50 cursor-pointer transition-colors",
                        },
                        [
                          t("div", _, [
                            t("div", g, [
                              t("div", y, n(e.jobNumber), 1),
                              t("div", v, n(a.companyCode), 1),
                            ]),
                            e.status
                              ? (i(), o("div", b, [t("div", h, n(e.status.name), 1)]))
                              : p("", !0),
                          ]),
                          t("div", k, [
                            t("div", j, [
                              t("div", w, n(e.pol), 1),
                              t("div", I, " ETD: " + n(r(e.etd)), 1),
                            ]),
                            s[0] ||
                              (s[0] = t(
                                "div",
                                {
                                  class:
                                    "size-4 relative overflow-hidden flex items-center justify-center",
                                },
                                [
                                  t("div", {
                                    class:
                                      "w-2.5 h-2.5 outline-2 outline-offset-[-1px] outline-black rotate-45 border-t-2 border-r-2 border-black",
                                  }),
                                ],
                                -1,
                              )),
                            t("div", C, [
                              t("div", B, n(e.pod), 1),
                              t("div", D, " ETA: " + n(r(e.eta)), 1),
                            ]),
                          ]),
                        ],
                      )
                    ),
                  ),
                  128,
                ))
              : (i(),
                o("div", N, [
                  u(x(c), { class: "w-8 h-8 mb-2 text-gray-300" }),
                  s[1] || (s[1] = t("p", { class: "text-sm" }, "No jobs available yet.", -1)),
                ])),
          ],
          64,
        )
      );
    },
  });
export { E as _ };
