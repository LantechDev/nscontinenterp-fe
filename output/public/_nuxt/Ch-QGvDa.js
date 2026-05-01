import { _ as ie } from "./DXifQ5ls.js";
import { _ as ue } from "./DhCF3Kco.js";
import {
  e as ce,
  ab as me,
  f as pe,
  r as y,
  N as be,
  o as fe,
  R as i,
  S as N,
  a2 as x,
  K as s,
  Q as e,
  T as r,
  P as L,
  V as f,
  $ as ve,
  a0 as _,
  a1 as h,
  aa as $,
  U as m,
  W as w,
  a3 as U,
  Y as ge,
  O as z,
  Z as ye,
  _ as d,
} from "./D9q6143x.js";
import { u as xe } from "./CqILFn4p.js";
import { u as _e } from "./CJdNv5wq.js";
import { u as he } from "./ighQaoU7.js";
import { u as we } from "./DivQEVj9.js";
import { f as Ie, t as b } from "./DrxnuvjT.js";
import { generateInvoicePdf as De } from "./B2YxS9Pj.js";
import { D as Pe } from "./BgSnr_43.js";
import { S as ke } from "./CHWjNEBX.js";
import { R as Te } from "./ByE3J7Q6.js";
import { A as Ne } from "./CdOyNhW7.js";
import { P as Ue } from "./CWUm5Boh.js";
import { T as Ve } from "./DhzAXlPS.js";
import { S as je } from "./CfuPgfv3.js";
import "./BS85nYjr.js";
const Ae = { key: 0, class: "flex items-center justify-center py-20" },
  Ce = { key: 1, class: "text-center py-12" },
  Se = { class: "text-red-500" },
  qe = { key: 2, class: "space-y-6 animate-fade-in p-6" },
  Re = { class: "page-header" },
  Ee = { class: "flex items-center gap-4" },
  Le = { class: "page-title" },
  Me = { class: "flex gap-2" },
  Fe = { class: "card-elevated p-6" },
  Je = { class: "flex items-center gap-4 mb-6 pb-6 border-b border-border" },
  Oe = { class: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center" },
  Be = { class: "text-xl font-semibold" },
  $e = { class: "text-muted-foreground" },
  ze = { class: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" },
  Ke = { class: "space-y-1" },
  Ye = { class: "font-medium text-primary" },
  He = { class: "space-y-1" },
  Qe = { class: "font-medium" },
  We = { class: "space-y-1" },
  Ze = { class: "font-medium" },
  Ge = { key: 0, class: "space-y-1" },
  Xe = { class: "font-medium" },
  et = { class: "border-t border-border pt-6" },
  tt = { class: "space-y-2" },
  st = { class: "font-medium" },
  ot = { key: 0, class: "text-sm text-muted-foreground ml-2" },
  nt = { class: "text-sm text-muted-foreground" },
  at = { class: "font-medium" },
  rt = { class: "mt-4 pt-4 border-t border-border space-y-2" },
  lt = { class: "flex justify-between" },
  dt = { class: "font-medium" },
  it = { class: "flex justify-between" },
  ut = { class: "font-medium" },
  ct = { class: "flex justify-between pt-2 border-t border-border" },
  mt = { class: "font-medium text-lg" },
  pt = { key: 0, class: "border-t border-border pt-6 mt-6" },
  bt = { class: "text-muted-foreground whitespace-pre-wrap" },
  ft = { key: 0, class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
  vt = { class: "text-sm text-red-600" },
  gt = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  yt = { class: "space-y-1.5" },
  xt = { class: "space-y-1.5" },
  _t = ["value"],
  ht = { class: "space-y-1.5" },
  wt = { class: "space-y-1.5" },
  It = { class: "space-y-1.5" },
  Dt = ["value"],
  Pt = { class: "space-y-1.5" },
  kt = ["value"],
  Tt = { class: "space-y-3" },
  Nt = { class: "flex items-center justify-between" },
  Ut = { class: "border border-border rounded-lg overflow-hidden" },
  Vt = { key: 0, class: "p-4 text-center text-muted-foreground" },
  jt = { class: "col-span-4" },
  At = ["onUpdate:modelValue"],
  Ct = { class: "col-span-2" },
  St = ["onUpdate:modelValue"],
  qt = ["value"],
  Rt = { class: "col-span-2" },
  Et = ["onUpdate:modelValue", "onInput"],
  Lt = { class: "col-span-2" },
  Mt = ["onUpdate:modelValue", "onInput"],
  Ft = { class: "col-span-1.5 text-sm font-medium" },
  Jt = { class: "col-span-0.5" },
  Ot = ["onClick"],
  Bt = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  $t = { class: "space-y-1.5" },
  zt = ["value"],
  Kt = { class: "space-y-1.5" },
  Yt = { class: "border-t border-border pt-4" },
  Ht = { class: "flex justify-end" },
  Qt = { class: "w-64 space-y-2" },
  Wt = { class: "flex justify-between text-sm" },
  Zt = { class: "font-medium" },
  Gt = { class: "flex justify-between text-sm" },
  Xt = { class: "text-muted-foreground" },
  es = { class: "font-medium" },
  ts = { class: "flex justify-between pt-2 border-t border-border" },
  ss = { class: "font-bold text-lg" },
  os = ["disabled"],
  ns = ["disabled"],
  Is = ce({
    __name: "[id]",
    setup(as) {
      const K = me();
      pe();
      const Y = K.params.id,
        { fetchInvoiceById: H, updateInvoice: Q } = xe(),
        { companies: W, fetchCompanies: Z } = _e(),
        { jobs: G, fetchJobs: X } = he(),
        { services: ee, fetchServices: te } = we(),
        l = y(null),
        A = y(!0),
        V = y(null),
        P = y(!1),
        I = y(!1),
        D = y(null),
        a = y({
          invoiceNumber: "",
          issuedDate: "",
          dueDate: "",
          companyId: "",
          jobId: "",
          notes: "",
          subTotal: 0,
          taxAmount: 0,
          total: 0,
          statusId: "",
          items: [],
        }),
        se = [
          { id: "PAID", name: "Lunas (Paid)" },
          { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
          { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
        ],
        oe = [
          { value: 0, label: "Tanpa PPN" },
          { value: 1.1, label: "PPN 1.1% (Freight)" },
          { value: 11, label: "PPN 11%" },
        ],
        g = y(0),
        ne = async () => {
          l.value && (await De(l.value));
        },
        M = (n) =>
          ({
            PAID: { label: "Lunas", class: "badge-success" },
            UNPAID: { label: "Pending", class: "badge-warning" },
            PARTIALLY_PAID: { label: "Sebagian", class: "badge-warning" },
            OVERDUE: { label: "Jatuh Tempo", class: "badge-danger" },
          })[n] || { label: n, class: "badge-warning" },
        v = Ie,
        F = (n) => {
          if (!n) return "";
          const t = new Date(n);
          return isNaN(t.getTime()) ? "" : t.toISOString().split("T")[0] || "";
        },
        J = (n) =>
          new Date(n).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        C = (n) => n.quantity * n.unitPrice,
        k = () => a.value.items.reduce((n, t) => n + C(t), 0),
        j = () => (k() * g.value) / 100,
        S = () => k() + j(),
        ae = () => {
          a.value.items.push({ description: "", quantity: 1, unitPrice: 0, amount: 0 });
        },
        re = (n) => {
          (a.value.items.splice(n, 1), q());
        },
        q = () => {
          ((a.value.subTotal = k()), (a.value.taxAmount = j()), (a.value.total = S()));
        },
        O = (n) => {
          const t = a.value.items[n];
          t && ((t.amount = C(t)), q());
        },
        R = async () => {
          try {
            ((A.value = !0), (V.value = null));
            const n = await H(Y);
            if (n.success && n.data) l.value = n.data;
            else throw new Error(n.error || "Failed to load invoice");
          } catch (n) {
            (console.error("Failed to fetch invoice:", n), (V.value = "Failed to load invoice"));
          } finally {
            A.value = !1;
          }
        },
        le = async () => {
          await Promise.all([Z({ type: "CUSTOMER" }), X(), te()]);
        },
        de = async () => {
          if (!l.value) return;
          await le();
          const n = l.value,
            t = n.issuedDate || "",
            T = n.dueDate || "";
          ((a.value = {
            invoiceNumber: n.invoiceNumber || "",
            issuedDate: F(t),
            dueDate: F(T),
            companyId: n.company?.id || "",
            jobId: n.job?.id || "",
            notes: n.notes || "",
            subTotal: b(n.subTotal),
            taxAmount: b(n.taxAmount),
            total: b(n.total),
            statusId: n.status?.code || "",
            items:
              n.items?.map((p) => ({
                id: p.id,
                serviceId: p.service?.id,
                description: p.description,
                quantity: b(p.quantity),
                unitPrice: b(p.unitPrice),
                amount: b(p.amount),
              })) || [],
          }),
            l.value.subTotal && l.value.taxAmount
              ? (g.value = (b(l.value.taxAmount) / b(l.value.subTotal)) * 100)
              : (g.value = 0),
            (P.value = !0),
            (D.value = null));
        },
        E = () => {
          ((P.value = !1), (D.value = null));
        },
        B = async () => {
          if (!(!l.value || !a.value.companyId))
            try {
              ((I.value = !0), (D.value = null));
              const n = a.value.items.map((c) => ({
                  id: c.id,
                  serviceId: c.serviceId,
                  description: c.description,
                  quantity: c.quantity,
                  unitPrice: c.unitPrice,
                  amount: c.amount,
                })),
                t = k(),
                T = j(),
                p = S(),
                o = await Q(l.value.id, {
                  invoiceNumber: a.value.invoiceNumber,
                  issuedDate: a.value.issuedDate,
                  dueDate: a.value.dueDate,
                  companyId: a.value.companyId,
                  jobId: a.value.jobId || void 0,
                  notes: a.value.notes,
                  subTotal: t,
                  taxAmount: T,
                  total: p,
                  balanceDue: p,
                  statusId: a.value.statusId,
                  items: n,
                });
              if (o.success && o.data) (await R(), E());
              else throw new Error(o.error || "Failed to update invoice");
            } catch (n) {
              (console.error("Failed to update invoice:", n),
                (D.value = "Failed to update invoice"));
            } finally {
              I.value = !1;
            }
        };
      return (
        be(g, () => {
          q();
        }),
        fe(() => {
          R();
        }),
        (n, t) => {
          const T = ie,
            p = ue;
          return (
            d(),
            i(
              _,
              null,
              [
                s(A)
                  ? (d(),
                    i("div", Ae, [
                      ...(t[9] ||
                        (t[9] = [
                          e(
                            "div",
                            {
                              class:
                                "animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]",
                            },
                            null,
                            -1,
                          ),
                        ])),
                    ]))
                  : s(V)
                    ? (d(),
                      i("div", Ce, [
                        e("p", Se, r(s(V)), 1),
                        e(
                          "button",
                          {
                            onClick: R,
                            class: "mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg",
                          },
                          " Retry ",
                        ),
                      ]))
                    : s(l)
                      ? (d(),
                        i("div", qe, [
                          e("div", Re, [
                            e("div", Ee, [
                              x(
                                T,
                                {
                                  to: "/finance/invoice",
                                  class: "p-2 rounded-lg hover:bg-muted transition-colors",
                                },
                                { default: L(() => [x(s(Ne), { class: "w-5 h-5" })]), _: 1 },
                              ),
                              e("div", null, [
                                e("h1", Le, r(s(l).invoiceNumber), 1),
                                t[10] ||
                                  (t[10] = e(
                                    "p",
                                    { class: "text-muted-foreground mt-1" },
                                    "Detail invoice",
                                    -1,
                                  )),
                              ]),
                            ]),
                            e("div", Me, [
                              e("button", { class: "btn-secondary", onClick: ne }, [
                                x(s(Pe), { class: "w-4 h-4 mr-2" }),
                                t[11] || (t[11] = f(" Download ", -1)),
                              ]),
                              e("button", { class: "btn-primary", onClick: de }, [
                                x(s(ke), { class: "w-4 h-4 mr-2" }),
                                t[12] || (t[12] = f(" Edit Invoice ", -1)),
                              ]),
                            ]),
                          ]),
                          e("div", Fe, [
                            e("div", Je, [
                              e("div", Oe, [x(s(Te), { class: "w-7 h-7 text-primary" })]),
                              e("div", null, [
                                e("h2", Be, r(s(l).invoiceNumber), 1),
                                e("p", $e, r(s(l).company?.name), 1),
                              ]),
                              e(
                                "span",
                                { class: ve(["ml-auto", M(s(l).status?.code || "").class]) },
                                r(M(s(l).status?.code || "").label),
                                3,
                              ),
                            ]),
                            e("div", ze, [
                              e("div", Ke, [
                                t[13] ||
                                  (t[13] = e(
                                    "p",
                                    { class: "text-sm text-muted-foreground" },
                                    "Customer",
                                    -1,
                                  )),
                                e("p", Ye, r(s(l).company?.name), 1),
                              ]),
                              e("div", He, [
                                t[14] ||
                                  (t[14] = e(
                                    "p",
                                    { class: "text-sm text-muted-foreground" },
                                    "Tanggal",
                                    -1,
                                  )),
                                e("p", Qe, r(J(s(l).issuedDate)), 1),
                              ]),
                              e("div", We, [
                                t[15] ||
                                  (t[15] = e(
                                    "p",
                                    { class: "text-sm text-muted-foreground" },
                                    "Jatuh Tempo",
                                    -1,
                                  )),
                                e("p", Ze, r(J(s(l).dueDate)), 1),
                              ]),
                              s(l).job
                                ? (d(),
                                  i("div", Ge, [
                                    t[16] ||
                                      (t[16] = e(
                                        "p",
                                        { class: "text-sm text-muted-foreground" },
                                        "Job Reference",
                                        -1,
                                      )),
                                    e("p", Xe, r(s(l).job.jobNumber), 1),
                                  ]))
                                : N("", !0),
                            ]),
                            e("div", et, [
                              t[20] ||
                                (t[20] = e(
                                  "h3",
                                  { class: "font-semibold mb-4" },
                                  "Detail Item",
                                  -1,
                                )),
                              e("div", tt, [
                                (d(!0),
                                i(
                                  _,
                                  null,
                                  h(
                                    s(l).items,
                                    (o, c) => (
                                      d(),
                                      i(
                                        "div",
                                        {
                                          key: c,
                                          class:
                                            "flex justify-between py-2 border-b border-border last:border-0",
                                        },
                                        [
                                          e("div", null, [
                                            e("span", st, r(o.description), 1),
                                            o.service
                                              ? (d(),
                                                i("span", ot, "(" + r(o.service.name) + ")", 1))
                                              : N("", !0),
                                            e(
                                              "div",
                                              nt,
                                              r(o.quantity) + " x " + r(s(v)(o.unitPrice)),
                                              1,
                                            ),
                                          ]),
                                          e("span", at, r(s(v)(o.amount)), 1),
                                        ],
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                              e("div", rt, [
                                e("div", lt, [
                                  t[17] ||
                                    (t[17] = e(
                                      "span",
                                      { class: "text-muted-foreground" },
                                      "Subtotal",
                                      -1,
                                    )),
                                  e("span", dt, r(s(v)(s(b)(s(l).subTotal) || 0)), 1),
                                ]),
                                e("div", it, [
                                  t[18] ||
                                    (t[18] = e(
                                      "span",
                                      { class: "text-muted-foreground" },
                                      "Pajak (PPN)",
                                      -1,
                                    )),
                                  e("span", ut, r(s(v)(s(b)(s(l).taxAmount) || 0)), 1),
                                ]),
                                e("div", ct, [
                                  t[19] ||
                                    (t[19] = e(
                                      "span",
                                      { class: "text-muted-foreground" },
                                      "Total",
                                      -1,
                                    )),
                                  e("span", mt, r(s(v)(s(b)(s(l).total))), 1),
                                ]),
                              ]),
                            ]),
                            s(l).notes
                              ? (d(),
                                i("div", pt, [
                                  t[21] ||
                                    (t[21] = e(
                                      "h3",
                                      { class: "font-semibold mb-2" },
                                      "Catatan",
                                      -1,
                                    )),
                                  e("p", bt, r(s(l).notes), 1),
                                ]))
                              : N("", !0),
                          ]),
                        ]))
                      : N("", !0),
                x(
                  p,
                  {
                    modelValue: s(P),
                    "onUpdate:modelValue": t[8] || (t[8] = (o) => ($(P) ? (P.value = o) : null)),
                    title: "Edit Invoice",
                    description: "Ubah semua detail invoice",
                    width: "max-w-4xl",
                    onClose: E,
                  },
                  {
                    footer: L(() => [
                      e(
                        "button",
                        {
                          type: "button",
                          onClick: E,
                          class:
                            "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                          disabled: s(I),
                        },
                        " Cancel ",
                        8,
                        os,
                      ),
                      e(
                        "button",
                        {
                          type: "button",
                          onClick: B,
                          disabled: s(I) || !s(a).companyId || s(a).items.length === 0,
                          class:
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        },
                        [
                          s(I)
                            ? (d(), z(s(ye), { key: 0, class: "w-4 h-4 animate-spin" }))
                            : (d(), z(s(je), { key: 1, class: "w-4 h-4" })),
                          f(" " + r(s(I) ? "Saving..." : "Save Changes"), 1),
                        ],
                        8,
                        ns,
                      ),
                    ]),
                    default: L(() => [
                      e(
                        "form",
                        { class: "space-y-6", onSubmit: ge(B, ["prevent"]) },
                        [
                          s(D) ? (d(), i("div", ft, [e("p", vt, r(s(D)), 1)])) : N("", !0),
                          e("div", gt, [
                            e("div", yt, [
                              t[22] ||
                                (t[22] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [f(" Nomor Invoice "), e("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              m(
                                e(
                                  "input",
                                  {
                                    "onUpdate:modelValue":
                                      t[0] || (t[0] = (o) => (s(a).invoiceNumber = o)),
                                    type: "text",
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                    required: "",
                                  },
                                  null,
                                  512,
                                ),
                                [[w, s(a).invoiceNumber]],
                              ),
                            ]),
                            e("div", xt, [
                              t[24] ||
                                (t[24] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [
                                    f(" Status Invoice "),
                                    e("span", { class: "text-red-500" }, "*"),
                                  ],
                                  -1,
                                )),
                              m(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue":
                                      t[1] || (t[1] = (o) => (s(a).statusId = o)),
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                    required: "",
                                  },
                                  [
                                    t[23] ||
                                      (t[23] = e(
                                        "option",
                                        { value: "", disabled: "" },
                                        "Pilih status",
                                        -1,
                                      )),
                                    (d(),
                                    i(
                                      _,
                                      null,
                                      h(se, (o) =>
                                        e("option", { key: o.id, value: o.id }, r(o.name), 9, _t),
                                      ),
                                      64,
                                    )),
                                  ],
                                  512,
                                ),
                                [[U, s(a).statusId]],
                              ),
                            ]),
                            e("div", ht, [
                              t[25] ||
                                (t[25] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [
                                    f(" Tanggal Invoice "),
                                    e("span", { class: "text-red-500" }, "*"),
                                  ],
                                  -1,
                                )),
                              m(
                                e(
                                  "input",
                                  {
                                    "onUpdate:modelValue":
                                      t[2] || (t[2] = (o) => (s(a).issuedDate = o)),
                                    type: "date",
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                    required: "",
                                  },
                                  null,
                                  512,
                                ),
                                [[w, s(a).issuedDate]],
                              ),
                            ]),
                            e("div", wt, [
                              t[26] ||
                                (t[26] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [f(" Jatuh Tempo "), e("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              m(
                                e(
                                  "input",
                                  {
                                    "onUpdate:modelValue":
                                      t[3] || (t[3] = (o) => (s(a).dueDate = o)),
                                    type: "date",
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                    required: "",
                                  },
                                  null,
                                  512,
                                ),
                                [[w, s(a).dueDate]],
                              ),
                            ]),
                            e("div", It, [
                              t[28] ||
                                (t[28] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [f(" Customer "), e("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              m(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue":
                                      t[4] || (t[4] = (o) => (s(a).companyId = o)),
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                    required: "",
                                  },
                                  [
                                    t[27] ||
                                      (t[27] = e(
                                        "option",
                                        { value: "", disabled: "" },
                                        "Pilih customer",
                                        -1,
                                      )),
                                    (d(!0),
                                    i(
                                      _,
                                      null,
                                      h(
                                        s(W),
                                        (o) => (
                                          d(),
                                          i("option", { key: o.id, value: o.id }, r(o.name), 9, Dt)
                                        ),
                                      ),
                                      128,
                                    )),
                                  ],
                                  512,
                                ),
                                [[U, s(a).companyId]],
                              ),
                            ]),
                            e("div", Pt, [
                              t[30] ||
                                (t[30] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  " Job Reference ",
                                  -1,
                                )),
                              m(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue": t[5] || (t[5] = (o) => (s(a).jobId = o)),
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                  },
                                  [
                                    t[29] ||
                                      (t[29] = e(
                                        "option",
                                        { value: "" },
                                        "Pilih job (opsional)",
                                        -1,
                                      )),
                                    (d(!0),
                                    i(
                                      _,
                                      null,
                                      h(
                                        s(G),
                                        (o) => (
                                          d(),
                                          i(
                                            "option",
                                            { key: o.id, value: o.id },
                                            r(o.jobNumber),
                                            9,
                                            kt,
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ],
                                  512,
                                ),
                                [[U, s(a).jobId]],
                              ),
                            ]),
                          ]),
                          e("div", Tt, [
                            e("div", Nt, [
                              t[32] ||
                                (t[32] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  [f(" Item Invoice "), e("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              e(
                                "button",
                                {
                                  type: "button",
                                  onClick: ae,
                                  class:
                                    "flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors",
                                },
                                [
                                  x(s(Ue), { class: "w-4 h-4" }),
                                  t[31] || (t[31] = f(" Tambah Item ", -1)),
                                ],
                              ),
                            ]),
                            e("div", Ut, [
                              t[34] ||
                                (t[34] = e(
                                  "div",
                                  {
                                    class:
                                      "grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium",
                                  },
                                  [
                                    e("div", { class: "col-span-4" }, "Deskripsi"),
                                    e("div", { class: "col-span-2" }, "Layanan"),
                                    e("div", { class: "col-span-2" }, "Jumlah"),
                                    e("div", { class: "col-span-2" }, "Harga Satuan"),
                                    e("div", { class: "col-span-1.5" }, "Total"),
                                    e("div", { class: "col-span-0.5" }),
                                  ],
                                  -1,
                                )),
                              s(a).items.length === 0
                                ? (d(),
                                  i(
                                    "div",
                                    Vt,
                                    ' Belum ada item. Klik "Tambah Item" untuk menambahkan. ',
                                  ))
                                : (d(!0),
                                  i(
                                    _,
                                    { key: 1 },
                                    h(
                                      s(a).items,
                                      (o, c) => (
                                        d(),
                                        i(
                                          "div",
                                          {
                                            key: c,
                                            class:
                                              "grid grid-cols-12 gap-2 p-3 border-t border-border items-center",
                                          },
                                          [
                                            e("div", jt, [
                                              m(
                                                e(
                                                  "input",
                                                  {
                                                    "onUpdate:modelValue": (u) =>
                                                      (o.description = u),
                                                    type: "text",
                                                    placeholder: "Deskripsi item",
                                                    class:
                                                      "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                  },
                                                  null,
                                                  8,
                                                  At,
                                                ),
                                                [[w, o.description]],
                                              ),
                                            ]),
                                            e("div", Ct, [
                                              m(
                                                e(
                                                  "select",
                                                  {
                                                    "onUpdate:modelValue": (u) => (o.serviceId = u),
                                                    class:
                                                      "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                                  },
                                                  [
                                                    t[33] ||
                                                      (t[33] = e(
                                                        "option",
                                                        { value: "" },
                                                        "Pilih",
                                                        -1,
                                                      )),
                                                    (d(!0),
                                                    i(
                                                      _,
                                                      null,
                                                      h(
                                                        s(ee),
                                                        (u) => (
                                                          d(),
                                                          i(
                                                            "option",
                                                            { key: u.id, value: u.id },
                                                            r(u.name),
                                                            9,
                                                            qt,
                                                          )
                                                        ),
                                                      ),
                                                      128,
                                                    )),
                                                  ],
                                                  8,
                                                  St,
                                                ),
                                                [[U, o.serviceId]],
                                              ),
                                            ]),
                                            e("div", Rt, [
                                              m(
                                                e(
                                                  "input",
                                                  {
                                                    "onUpdate:modelValue": (u) => (o.quantity = u),
                                                    type: "number",
                                                    min: "1",
                                                    onInput: (u) => O(c),
                                                    class:
                                                      "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                  },
                                                  null,
                                                  40,
                                                  Et,
                                                ),
                                                [[w, o.quantity, void 0, { number: !0 }]],
                                              ),
                                            ]),
                                            e("div", Lt, [
                                              m(
                                                e(
                                                  "input",
                                                  {
                                                    "onUpdate:modelValue": (u) => (o.unitPrice = u),
                                                    type: "number",
                                                    min: "0",
                                                    onInput: (u) => O(c),
                                                    class:
                                                      "w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                                  },
                                                  null,
                                                  40,
                                                  Mt,
                                                ),
                                                [[w, o.unitPrice, void 0, { number: !0 }]],
                                              ),
                                            ]),
                                            e("div", Ft, r(s(v)(C(o))), 1),
                                            e("div", Jt, [
                                              e(
                                                "button",
                                                {
                                                  type: "button",
                                                  onClick: (u) => re(c),
                                                  class:
                                                    "p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors",
                                                },
                                                [x(s(Ve), { class: "w-4 h-4" })],
                                                8,
                                                Ot,
                                              ),
                                            ]),
                                          ],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                            ]),
                          ]),
                          e("div", Bt, [
                            e("div", $t, [
                              t[35] ||
                                (t[35] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  " PPN ",
                                  -1,
                                )),
                              m(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue":
                                      t[6] || (t[6] = (o) => ($(g) ? (g.value = o) : null)),
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                                  },
                                  [
                                    (d(),
                                    i(
                                      _,
                                      null,
                                      h(oe, (o) =>
                                        e(
                                          "option",
                                          { key: o.value, value: o.value },
                                          r(o.label),
                                          9,
                                          zt,
                                        ),
                                      ),
                                      64,
                                    )),
                                  ],
                                  512,
                                ),
                                [[U, s(g), void 0, { number: !0 }]],
                              ),
                            ]),
                            e("div", Kt, [
                              t[36] ||
                                (t[36] = e(
                                  "label",
                                  { class: "text-sm font-medium text-foreground" },
                                  " Catatan ",
                                  -1,
                                )),
                              m(
                                e(
                                  "textarea",
                                  {
                                    "onUpdate:modelValue": t[7] || (t[7] = (o) => (s(a).notes = o)),
                                    rows: "3",
                                    placeholder: "Catatan invoice...",
                                    class:
                                      "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white resize-none",
                                  },
                                  null,
                                  512,
                                ),
                                [[w, s(a).notes]],
                              ),
                            ]),
                          ]),
                          e("div", Yt, [
                            e("div", Ht, [
                              e("div", Qt, [
                                e("div", Wt, [
                                  t[37] ||
                                    (t[37] = e(
                                      "span",
                                      { class: "text-muted-foreground" },
                                      "Subtotal",
                                      -1,
                                    )),
                                  e("span", Zt, r(s(v)(k())), 1),
                                ]),
                                e("div", Gt, [
                                  e("span", Xt, "Pajak (PPN " + r(s(g)) + "%)", 1),
                                  e("span", es, r(s(v)(j())), 1),
                                ]),
                                e("div", ts, [
                                  t[38] ||
                                    (t[38] = e("span", { class: "font-medium" }, "Total", -1)),
                                  e("span", ss, r(s(v)(S())), 1),
                                ]),
                              ]),
                            ]),
                          ]),
                        ],
                        32,
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue"],
                ),
              ],
              64,
            )
          );
        }
      );
    },
  });
export { Is as default };
