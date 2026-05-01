import {
  e as p,
  R as d,
  a0 as b,
  a1 as h,
  $ as n,
  Q as t,
  a2 as u,
  K as i,
  S as y,
  T as o,
  Y as D,
  _ as l,
} from "./D9q6143x.js";
import { c as _ } from "./DrxnuvjT.js";
import { R as w } from "./ByE3J7Q6.js";
import { D as k } from "./BgSnr_43.js";
const C = { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  v = ["onClick"],
  N = { class: "flex items-start justify-between mb-4" },
  V = { class: "flex items-start gap-4" },
  I = { class: "flex items-center gap-2 flex-wrap" },
  A = {
    key: 0,
    class:
      "text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded",
  },
  j = { class: "text-xs text-muted-foreground" },
  E = { class: "space-y-3 mb-4" },
  O = { class: "text-sm font-mono uppercase text-muted-foreground" },
  S = { class: "text-sm font-medium" },
  F = { class: "text-lg font-bold text-[#012D5A]" },
  B = { class: "text-sm text-gray-700" },
  P = { class: "flex items-center justify-between pt-4 border-t border-border" },
  R = { class: "flex gap-1" },
  $ = ["onClick"],
  J = p({
    __name: "InvoiceGridView",
    props: {
      invoices: {},
      getStatusConfig: { type: Function },
      formatCurrency: { type: Function },
      formatDate: { type: Function },
    },
    emits: ["row-click", "download-pdf"],
    setup(a, { emit: m }) {
      const c = m,
        x = (r) => {
          c("row-click", r);
        },
        f = (r) => {
          c("download-pdf", r);
        };
      return (r, s) => (
        l(),
        d("div", C, [
          (l(!0),
          d(
            b,
            null,
            h(
              a.invoices,
              (e) => (
                l(),
                d(
                  "div",
                  {
                    key: e.id,
                    class: n([
                      "border border-border rounded-xl p-5 transition-all cursor-pointer",
                      e.status?.code === "VOIDED"
                        ? "bg-gray-50 opacity-60 hover:opacity-80 hover:shadow-none"
                        : "bg-white hover:shadow-sm",
                    ]),
                    onClick: (g) => x(e.id),
                  },
                  [
                    t("div", N, [
                      t("div", V, [
                        t(
                          "div",
                          {
                            class: n([
                              "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                              e.status?.code === "VOIDED"
                                ? "bg-gray-100 text-gray-400"
                                : "bg-blue-50 text-[#012D5A]",
                            ]),
                          },
                          [u(i(w), { class: "w-6 h-6" })],
                          2,
                        ),
                        t("div", null, [
                          t("div", I, [
                            t(
                              "h3",
                              {
                                class: n([
                                  "font-bold text-base",
                                  e.status?.code === "VOIDED"
                                    ? "line-through text-gray-400"
                                    : "text-foreground",
                                ]),
                              },
                              o(e.invoiceNumber),
                              3,
                            ),
                            e.status?.code === "VOIDED" ? (l(), d("span", A, "VOID")) : y("", !0),
                          ]),
                          t("p", j, o(a.formatDate(e.issuedDate)), 1),
                        ]),
                      ]),
                    ]),
                    t("div", E, [
                      t("div", null, [
                        s[0] ||
                          (s[0] = t(
                            "p",
                            { class: "text-xs text-muted-foreground mb-1" },
                            "Job No.",
                            -1,
                          )),
                        t("p", O, o(e.job?.jobNumber || "-"), 1),
                      ]),
                      t("div", null, [
                        s[1] ||
                          (s[1] = t(
                            "p",
                            { class: "text-xs text-muted-foreground mb-1" },
                            "Customer",
                            -1,
                          )),
                        t("p", S, o(e.company?.name || "N/A"), 1),
                      ]),
                      t("div", null, [
                        s[2] ||
                          (s[2] = t(
                            "p",
                            { class: "text-xs text-muted-foreground mb-1" },
                            "Total Amount",
                            -1,
                          )),
                        t("p", F, o(a.formatCurrency(e.total)), 1),
                      ]),
                      t("div", null, [
                        s[3] ||
                          (s[3] = t(
                            "p",
                            { class: "text-xs text-muted-foreground mb-1" },
                            "Due Date",
                            -1,
                          )),
                        t("p", B, o(a.formatDate(e.dueDate)), 1),
                      ]),
                    ]),
                    t("div", P, [
                      t(
                        "span",
                        {
                          class: n(
                            i(_)(
                              "px-2 py-0.5 rounded border text-xs font-medium",
                              a.getStatusConfig(e.status?.code || "UNPAID").class,
                            ),
                          ),
                        },
                        o(a.getStatusConfig(e.status?.code || "UNPAID").label),
                        3,
                      ),
                      t("div", R, [
                        t(
                          "button",
                          {
                            class: "p-1.5 rounded hover:bg-muted transition-colors",
                            onClick: D((g) => f(e.id), ["stop"]),
                          },
                          [u(i(k), { class: "w-4 h-4 text-muted-foreground" })],
                          8,
                          $,
                        ),
                      ]),
                    ]),
                  ],
                  10,
                  v,
                )
              ),
            ),
            128,
          )),
        ])
      );
    },
  });
export { J as _ };
