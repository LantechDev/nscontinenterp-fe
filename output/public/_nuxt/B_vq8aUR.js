import { B as d } from "./CEUvAbAU.js";
import {
  e as u,
  R as o,
  Q as t,
  a0 as c,
  a1 as m,
  a2 as f,
  K as x,
  S as y,
  T as s,
  _ as n,
} from "./D9q6143x.js";
const g = { class: "self-stretch flex justify-between items-start" },
  p = { class: "flex justify-start items-start gap-3" },
  _ = { class: "inline-flex flex-col justify-start items-start gap-1" },
  b = { class: "text-black text-sm font-semibold font-['Inter'] leading-5" },
  h = { class: "text-gray-500 text-sm font-normal font-['Inter'] leading-5" },
  v = {
    key: 0,
    class:
      "px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1",
  },
  k = { class: "text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5" },
  j = { class: "text-gray-500 text-sm" },
  D = { key: 1, class: "w-full py-8 flex flex-col items-center justify-center text-gray-400" },
  w = u({
    __name: "CompanyInvoiceTab",
    props: { invoices: {} },
    setup(i) {
      const l = (r) =>
        r
          ? new Date(r).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "-";
      return (r, a) => (
        n(),
        o(
          c,
          null,
          [
            a[1] ||
              (a[1] = t(
                "div",
                {
                  class: "justify-start text-black text-sm font-semibold font-['Inter'] leading-5",
                },
                " Invoices ",
                -1,
              )),
            i.invoices.length > 0
              ? (n(!0),
                o(
                  c,
                  { key: 0 },
                  m(
                    i.invoices,
                    (e) => (
                      n(),
                      o(
                        "div",
                        {
                          key: e.id,
                          class:
                            "self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 cursor-pointer transition-colors",
                        },
                        [
                          t("div", g, [
                            t("div", p, [
                              t("div", _, [
                                t("div", b, s(e.invoiceNumber), 1),
                                t(
                                  "div",
                                  h,
                                  s(e.currency) + " " + s(Number(e.total).toLocaleString()),
                                  1,
                                ),
                              ]),
                              e.status
                                ? (n(), o("div", v, [t("div", k, s(e.status.name), 1)]))
                                : y("", !0),
                            ]),
                          ]),
                          t(
                            "div",
                            j,
                            " Issued: " + s(l(e.issuedDate)) + " | Due: " + s(l(e.dueDate)),
                            1,
                          ),
                        ],
                      )
                    ),
                  ),
                  128,
                ))
              : (n(),
                o("div", D, [
                  f(x(d), { class: "w-8 h-8 mb-2 text-gray-300" }),
                  a[0] || (a[0] = t("p", { class: "text-sm" }, "No invoices available yet.", -1)),
                ])),
          ],
          64,
        )
      );
    },
  });
export { w as _ };
