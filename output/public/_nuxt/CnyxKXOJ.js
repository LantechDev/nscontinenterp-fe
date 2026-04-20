import {
  e as D,
  q as w,
  R as d,
  Q as t,
  a0 as m,
  a1 as p,
  K as l,
  T as o,
  $ as u,
  S as k,
  a2 as x,
  Y as C,
  _ as c,
} from "./D9q6143x.js";
import { c as N } from "./DrxnuvjT.js";
import { R as j } from "./ByE3J7Q6.js";
import { D as I } from "./BgSnr_43.js";
const V = { class: "border border-border rounded-xl bg-white overflow-hidden" },
  v = { class: "overflow-x-auto" },
  E = { class: "w-full" },
  O = { class: "bg-gray-50 border-b border-border" },
  S = { colspan: "8", class: "py-2.5 px-4" },
  A = { class: "flex items-center gap-2" },
  T = { class: "text-sm font-bold text-[#012D5A]" },
  F = { class: "text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2" },
  J = ["onClick"],
  B = { class: "py-3 px-4 pl-8" },
  K = { class: "flex items-center gap-2" },
  P = {
    key: 0,
    class:
      "text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded",
  },
  R = { class: "py-3 px-4 text-sm font-mono text-muted-foreground uppercase" },
  $ = { class: "py-3 px-4 text-sm font-medium" },
  L = { class: "py-3 px-4 text-sm text-muted-foreground" },
  U = { class: "py-3 px-4 text-sm text-muted-foreground" },
  q = { class: "py-3 px-4 text-sm font-medium" },
  z = { class: "py-3 px-4" },
  M = { class: "py-3 px-4 text-right" },
  Q = { class: "flex gap-1 justify-end" },
  Y = ["onClick"],
  Z = D({
    __name: "InvoiceListView",
    props: {
      invoices: {},
      getStatusConfig: { type: Function },
      formatCurrency: { type: Function },
      formatDate: { type: Function },
    },
    emits: ["row-click", "download-pdf"],
    setup(n, { emit: b }) {
      const f = n,
        i = b,
        g = (r) => {
          i("row-click", r);
        },
        h = (r) => {
          i("download-pdf", r);
        },
        y = w(() => {
          const r = {};
          return (
            f.invoices.forEach((a) => {
              const s = a.job?.jobNumber || "no-job";
              (r[s] ||
                (r[s] = { jobKey: s, jobNumber: a.job?.jobNumber || "Tanpa Job", invoices: [] }),
                r[s].invoices.push(a));
            }),
            Object.values(r)
          );
        });
      return (r, a) => (
        c(),
        d("div", V, [
          t("div", v, [
            t("table", E, [
              a[1] ||
                (a[1] = t(
                  "thead",
                  null,
                  [
                    t("tr", { class: "border-b border-border bg-white text-left" }, [
                      t(
                        "th",
                        { class: "py-3 px-4 text-sm font-medium text-foreground" },
                        "No. Invoice",
                      ),
                      t(
                        "th",
                        { class: "py-3 px-4 text-sm font-medium text-foreground" },
                        "Job No.",
                      ),
                      t(
                        "th",
                        { class: "py-3 px-4 text-sm font-medium text-foreground" },
                        "Customer",
                      ),
                      t(
                        "th",
                        { class: "py-3 px-4 text-sm font-medium text-foreground" },
                        "Tanggal",
                      ),
                      t(
                        "th",
                        { class: "py-3 px-4 text-sm font-medium text-foreground" },
                        "Jatuh Tempo",
                      ),
                      t("th", { class: "py-3 px-4 text-sm font-medium text-foreground" }, "Total"),
                      t("th", { class: "py-3 px-4 text-sm font-medium text-foreground" }, "Status"),
                      t("th", { class: "py-3 px-4 w-10" }),
                    ]),
                  ],
                  -1,
                )),
              t("tbody", null, [
                (c(!0),
                d(
                  m,
                  null,
                  p(
                    l(y),
                    (s) => (
                      c(),
                      d(
                        m,
                        { key: s.jobKey },
                        [
                          t("tr", O, [
                            t("td", S, [
                              t("div", A, [
                                a[0] ||
                                  (a[0] = t(
                                    "span",
                                    {
                                      class:
                                        "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
                                    },
                                    "Job:",
                                    -1,
                                  )),
                                t("span", T, o(s.jobNumber), 1),
                                t(
                                  "span",
                                  F,
                                  o(s.invoices.length) +
                                    " INVOICE" +
                                    o(s.invoices.length > 1 ? "S" : ""),
                                  1,
                                ),
                              ]),
                            ]),
                          ]),
                          (c(!0),
                          d(
                            m,
                            null,
                            p(
                              s.invoices,
                              (e) => (
                                c(),
                                d(
                                  "tr",
                                  {
                                    key: e.id,
                                    class: u([
                                      "border-b border-border last:border-b transition-colors cursor-pointer",
                                      e.status?.code === "VOIDED"
                                        ? "bg-gray-50/80 opacity-60 hover:opacity-80"
                                        : "hover:bg-muted/30",
                                    ]),
                                    onClick: (_) => g(e.id),
                                  },
                                  [
                                    t("td", B, [
                                      t("div", K, [
                                        t(
                                          "div",
                                          {
                                            class: u([
                                              "p-1.5 rounded",
                                              e.status?.code === "VOIDED"
                                                ? "bg-gray-100 text-gray-400"
                                                : "bg-blue-50 text-[#012D5A]",
                                            ]),
                                          },
                                          [x(l(j), { class: "w-4 h-4" })],
                                          2,
                                        ),
                                        t(
                                          "span",
                                          {
                                            class: u([
                                              "text-sm font-medium",
                                              e.status?.code === "VOIDED"
                                                ? "line-through text-gray-400"
                                                : "",
                                            ]),
                                          },
                                          o(e.invoiceNumber),
                                          3,
                                        ),
                                        e.status?.code === "VOIDED"
                                          ? (c(), d("span", P, " VOID "))
                                          : k("", !0),
                                      ]),
                                    ]),
                                    t("td", R, o(e.job?.jobNumber || "-"), 1),
                                    t("td", $, o(e.company?.name || "N/A"), 1),
                                    t("td", L, o(n.formatDate(e.issuedDate)), 1),
                                    t("td", U, o(n.formatDate(e.dueDate)), 1),
                                    t("td", q, o(n.formatCurrency(e.total)), 1),
                                    t("td", z, [
                                      t(
                                        "span",
                                        {
                                          class: u(
                                            l(N)(
                                              "px-2 py-0.5 rounded border text-xs font-medium",
                                              n.getStatusConfig(e.status?.code || "UNPAID").class,
                                            ),
                                          ),
                                        },
                                        o(n.getStatusConfig(e.status?.code || "UNPAID").label),
                                        3,
                                      ),
                                    ]),
                                    t("td", M, [
                                      t("div", Q, [
                                        t(
                                          "button",
                                          {
                                            class: "p-1.5 rounded hover:bg-muted transition-colors",
                                            onClick: C((_) => h(e.id), ["stop"]),
                                          },
                                          [x(l(I), { class: "w-4 h-4 text-muted-foreground" })],
                                          8,
                                          Y,
                                        ),
                                      ]),
                                    ]),
                                  ],
                                  10,
                                  J,
                                )
                              ),
                            ),
                            128,
                          )),
                        ],
                        64,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
            ]),
          ]),
        ])
      );
    },
  });
export { Z as _ };
