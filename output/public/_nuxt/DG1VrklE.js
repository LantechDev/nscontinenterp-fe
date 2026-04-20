import { _ as De } from "./DXifQ5ls.js";
import { _ as _e } from "./Doao-lii.js";
import { _ as Ae, J as Pe } from "./BoRvqSZZ.js";
import {
  r as l,
  q as Te,
  N as ue,
  t as Le,
  e as Ce,
  o as Se,
  R as T,
  Q as s,
  O as ce,
  a2 as m,
  S as Ne,
  U as de,
  a3 as Ue,
  K as e,
  aa as H,
  a0 as ke,
  a1 as Ee,
  $ as me,
  W as Re,
  P as pe,
  T as re,
  V as Fe,
  _ as v,
  ag as ve,
} from "./D9q6143x.js";
import { f as Oe, t as w, c as fe } from "./DrxnuvjT.js";
import { u as xe } from "./CqILFn4p.js";
import { u as Ve } from "./CJdNv5wq.js";
import { u as je } from "./ighQaoU7.js";
import { u as Be } from "./DivQEVj9.js";
import { u as Me } from "./BfskLp3w.js";
import { _ as Je } from "./CnyxKXOJ.js";
import { _ as $e } from "./DmWLdJbJ.js";
import { _ as qe } from "./WPflT88e.js";
import { L as ze, a as He } from "./BopvTZHI.js";
import { S as Qe } from "./DK0cRrZx.js";
import { R as Ye } from "./ByE3J7Q6.js";
import { P as be } from "./CWUm5Boh.js";
import "./DKEGG4ny.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./C0WRWJjF.js";
import "./DhCF3Kco.js";
import "./CEUvAbAU.js";
import "./DhzAXlPS.js";
import "./BS85nYjr.js";
import "./DXEQVQnt.js";
import "./DlAUqK2U.js";
import "./CCv5WdYi.js";
import "./BMMhT9Ph.js";
import "./M8y9e51z.js";
import "./CB1d33eS.js";
import "./Btb_jfTP.js";
import "./DnWmaOSL.js";
import "./CCD4SlHB.js";
import "./DD8oliij.js";
import "./CJ5hAAEc.js";
import "./CdOyNhW7.js";
import "./BgSnr_43.js";
import "./p41O2Qdo.js";
import "./DzdgE9z_.js";
import "./Drc3X-mx.js";
import "./BGAbB0k0.js";
import "./CHWjNEBX.js";
import "./CQwnAZS6.js";
import "./CfuPgfv3.js";
import "./D__u8pJn.js";
import "./BsM_H8Mt.js";
import "./DvCSiYg8.js";
import "./C8fnjjG_.js";
import "./C22E21xF.js";
const Ge = (u) =>
    new Date(u).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
  ge = (u) => {
    if (!u) return "";
    const I = new Date(u);
    return isNaN(I.getTime()) ? "" : I.toISOString().split("T")[0] || "";
  },
  Ke = (u) =>
    ({ PAID: "LUNAS", UNPAID: "BELUM LUNAS", PARTIALLY_PAID: "SEBAGIAN", OVERDUE: "JATUH TEMPO" })[
      u
    ] || u,
  ye = (u) => u.quantity * u.unitPrice,
  We = (u) => {
    Le(`/finance/invoice/${u}`);
  };
function Xe() {
  const { fetchInvoices: u, fetchInvoiceById: I, deleteInvoice: Q, updateInvoice: M } = xe(),
    { confirm: R } = Me(),
    { companies: F, fetchCompanies: h } = Ve(),
    { jobs: Y, fetchJobs: G } = je(),
    { services: K, fetchServices: W } = Be(),
    f = l([]),
    D = l(!0),
    L = l(null),
    O = l(""),
    _ = l(""),
    X = l("list"),
    V = l(!1),
    j = l(!1),
    b = l(null),
    g = l(""),
    i = l({
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
    y = l(0),
    x = l(1),
    Z = l({ total: 0, limit: 10, page: 1 }),
    ee = {
      UNPAID: "pending",
      PARTIALLY_PAID: "partially",
      PAID: "paid",
      OVERDUE: "overdue",
      VOIDED: "voided",
    },
    te = {
      pending: { label: "Belum Lunas", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      partially: { label: "Sebagian", class: "bg-blue-50 text-blue-700 border-blue-200" },
      paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
      overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
      voided: { label: "Void", class: "bg-gray-100 text-gray-500 border-gray-300 line-through" },
    },
    oe = [
      { value: "", label: "Semua Status" },
      { value: "PAID", label: "Lunas" },
      { value: "UNPAID", label: "Belum Lunas" },
      { value: "PARTIALLY_PAID", label: "Sebagian" },
      { value: "OVERDUE", label: "Jatuh Tempo" },
      { value: "VOIDED", label: "Void" },
    ],
    ae = [
      { id: "PAID", name: "Lunas (Paid)" },
      { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
      { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
    ],
    ne = [
      { value: 0, label: "Tanpa PPN" },
      { value: 1.1, label: "PPN 1.1% (Freight)" },
      { value: 11, label: "PPN 11%" },
    ],
    ie = Oe,
    C = (t) => ee[t] || "pending",
    B = (t) => {
      const a = C(t);
      return te[a];
    },
    S = Te(() => {
      let t = f.value;
      if ((_.value && (t = t.filter((a) => a.status?.code === _.value)), O.value)) {
        const a = O.value.toLowerCase();
        t = t.filter(
          (n) =>
            n.invoiceNumber.toLowerCase().includes(a) || n.company.name.toLowerCase().includes(a),
        );
      }
      return t;
    }),
    A = () => i.value.items.reduce((t, a) => t + ye(a), 0),
    N = () => (A() * y.value) / 100,
    P = () => A() + N(),
    U = () => {
      ((i.value.subTotal = A()), (i.value.taxAmount = N()), (i.value.total = P()));
    },
    J = () => {
      i.value.items.push({ description: "", quantity: 1, unitPrice: 0, amount: 0 });
    },
    $ = (t) => {
      (i.value.items.splice(t, 1), U());
    },
    se = (t) => {
      const a = i.value.items[t];
      a && ((a.amount = ye(a)), U());
    },
    c = async () => {
      try {
        ((D.value = !0), (L.value = null));
        const t = await u(_.value || void 0);
        if (t.success && t.data) f.value = t.data;
        else throw new Error(t.error || "Failed to load invoices");
      } catch (t) {
        (console.error("Failed to fetch invoices:", t),
          (L.value = "Failed to load invoices"),
          (f.value = []));
      } finally {
        D.value = !1;
      }
    },
    o = async () => {
      await Promise.all([h({ type: "CUSTOMER" }), G(), W()]);
    },
    k = async (t) => {
      try {
        g.value = t;
        const a = await I(t);
        if (!a.success || !a.data) throw new Error(a.error || "Failed to load invoice");
        const n = a.data;
        await o();
        const z = n.issuedDate || "",
          d = n.dueDate || "";
        ((i.value = {
          invoiceNumber: n.invoiceNumber || "",
          issuedDate: ge(z),
          dueDate: ge(d),
          companyId: n.company?.id || "",
          jobId: n.job?.id || "",
          notes: n.notes || "",
          subTotal: w(n.subTotal),
          taxAmount: w(n.taxAmount),
          total: w(n.total),
          statusId: n.status?.code || "",
          items:
            n.items?.map((p) => ({
              id: p.id,
              serviceId: p.service?.id,
              description: p.description,
              quantity: w(p.quantity),
              unitPrice: w(p.unitPrice),
              amount: w(p.amount),
            })) || [],
        }),
          n.subTotal && n.taxAmount
            ? (y.value = (w(n.taxAmount) / w(n.subTotal)) * 100)
            : (y.value = 0),
          (V.value = !0),
          (b.value = null));
      } catch (a) {
        (console.error("Failed to open edit modal:", a), (b.value = "Failed to load invoice data"));
      }
    },
    q = () => {
      ((V.value = !1), (b.value = null), (g.value = ""));
    },
    le = async () => {
      if (!(!i.value.companyId || !g.value))
        try {
          ((j.value = !0), (b.value = null));
          const t = g.value,
            a = i.value.items.map((E) => ({
              id: E.id,
              serviceId: E.serviceId,
              description: E.description,
              quantity: E.quantity,
              unitPrice: E.unitPrice,
              amount: E.amount,
            })),
            n = A(),
            z = N(),
            d = P(),
            p = await M(t, {
              invoiceNumber: i.value.invoiceNumber,
              issuedDate: i.value.issuedDate,
              dueDate: i.value.dueDate,
              companyId: i.value.companyId,
              jobId: i.value.jobId || void 0,
              notes: i.value.notes,
              subTotal: n,
              taxAmount: z,
              total: d,
              balanceDue: d,
              statusId: i.value.statusId,
              items: a,
            });
          if (p.success) (q(), await c());
          else throw new Error(p.error || "Failed to update invoice");
        } catch (t) {
          (console.error("Failed to update invoice:", t), (b.value = "Failed to update invoice"));
        } finally {
          j.value = !1;
        }
    },
    r = (t) => {
      We(t);
    },
    we = async (t) => {
      const n = f.value.find((d) => d.id === t)?.invoiceNumber || t;
      if (
        await R({
          title: "Hapus Invoice",
          message: `Apakah Anda yakin ingin menghapus invoice ${n}? Tindakan ini tidak dapat dibatalkan.`,
          confirmText: "Hapus",
          cancelText: "Batal",
          type: "danger",
        })
      )
        try {
          const d = await Q(t);
          d.success
            ? await c()
            : (console.error("Failed to delete invoice:", d.error),
              alert(d.error || "Failed to delete invoice"));
        } catch (d) {
          (console.error("Failed to delete invoice:", d),
            alert("Failed to delete invoice. Please try again."));
        }
    },
    Ie = (t) => {
      ((x.value = t), c());
    },
    he = () => {
      c();
    };
  return (
    ue(_, () => {
      c();
    }),
    ue(y, () => {
      U();
    }),
    {
      invoices: f,
      loading: D,
      error: L,
      searchQuery: O,
      selectedStatus: _,
      viewMode: X,
      isEditModalOpen: V,
      isSubmitting: j,
      editError: b,
      editingInvoiceId: g,
      formData: i,
      selectedTaxRate: y,
      currentPage: x,
      pagination: Z,
      statusOptions: oe,
      editStatusOptions: ae,
      editTaxOptions: ne,
      companies: F,
      jobs: Y,
      services: K,
      formatCurrency: ie,
      formatDate: Ge,
      statusLabel: Ke,
      getStatusType: C,
      getStatusConfig: B,
      filteredInvoices: S,
      loadInvoices: c,
      openEditModal: k,
      closeEditModal: q,
      handleFullUpdate: le,
      handleRowClick: r,
      handleDelete: we,
      handlePageChange: Ie,
      addLineItem: J,
      removeLineItem: $,
      updateItemAmount: se,
      initialize: he,
    }
  );
}
const Ze = { class: "space-y-6 animate-fade-in p-6" },
  et = { class: "flex items-center justify-between" },
  tt = { class: "flex items-center gap-2" },
  ot = ["value"],
  at = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  nt = { class: "flex items-center justify-between gap-4" },
  it = { class: "relative w-full max-w-sm" },
  st = { class: "flex items-center gap-3" },
  lt = { key: 0, class: "flex items-center justify-center py-12" },
  rt = { key: 1, class: "text-center py-12" },
  ut = { class: "text-red-500" },
  ct = { key: 2, class: "text-center py-12 border border-border rounded-xl bg-white" },
  dt = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  mt = {
    key: 5,
    "aria-hidden": "true",
    style: {
      position: "fixed",
      left: "-9999px",
      top: "0",
      opacity: "0",
      "pointer-events": "none",
      "z-index": "-1",
      width: "210mm",
    },
  },
  uo = Ce({
    __name: "index",
    setup(u) {
      const { fetchInvoiceById: I } = xe(),
        {
          loading: Q,
          error: M,
          searchQuery: R,
          selectedStatus: F,
          viewMode: h,
          isEditModalOpen: Y,
          isSubmitting: G,
          editError: K,
          formData: W,
          selectedTaxRate: f,
          currentPage: D,
          pagination: L,
          statusOptions: O,
          editStatusOptions: _,
          editTaxOptions: X,
          companies: V,
          jobs: j,
          services: b,
          formatCurrency: g,
          formatDate: i,
          getStatusConfig: y,
          filteredInvoices: x,
          closeEditModal: Z,
          handleFullUpdate: ee,
          handleRowClick: te,
          handlePageChange: oe,
          addLineItem: ae,
          removeLineItem: ne,
          updateItemAmount: ie,
          initialize: C,
        } = Xe(),
        B = l(!1),
        S = l(null),
        A = l(null),
        N = async (c) => {
          if (!B.value) {
            B.value = !0;
            try {
              const o = await I(c);
              if (!o.success || !o.data) throw new Error(o.error || "Failed to fetch invoice");
              ((S.value = o.data), await ve(), await ve(), await A.value?.generatePDF());
            } catch (o) {
              (console.error("Failed to download invoice PDF:", o),
                alert("Failed to download invoice. Please try again."));
            } finally {
              ((B.value = !1), (S.value = null));
            }
          }
        },
        P = l(!1),
        U = l(""),
        J = l(""),
        $ = (c) => {
          const o = x.value.find((k) => k.id === c);
          o?.job?.id ? ((U.value = o.job.id), (J.value = c), (P.value = !0)) : te(c);
        },
        se = (c) => {
          f.value = c;
        };
      return (
        Se(() => {
          C();
        }),
        (c, o) => {
          const k = De,
            q = _e,
            le = Ae;
          return (
            v(),
            T("div", Ze, [
              s("div", et, [
                o[7] ||
                  (o[7] = s(
                    "div",
                    null,
                    [
                      s("h1", { class: "text-2xl font-bold" }, "Invoice"),
                      s("p", { class: "text-muted-foreground mt-1" }, "Kelola tagihan customer"),
                    ],
                    -1,
                  )),
                s("div", tt, [
                  de(
                    s(
                      "select",
                      {
                        "onUpdate:modelValue":
                          o[0] || (o[0] = (r) => (H(F) ? (F.value = r) : null)),
                        class:
                          "bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]",
                      },
                      [
                        (v(!0),
                        T(
                          ke,
                          null,
                          Ee(
                            e(O),
                            (r) => (
                              v(), T("option", { key: r.value, value: r.value }, re(r.label), 9, ot)
                            ),
                          ),
                          128,
                        )),
                      ],
                      512,
                    ),
                    [[Ue, e(F)]],
                  ),
                  s("div", at, [
                    s(
                      "button",
                      {
                        onClick: o[1] || (o[1] = (r) => (h.value = "list")),
                        class: me(
                          e(fe)(
                            "p-1.5 rounded transition-colors",
                            e(h) === "list"
                              ? "bg-[#012D5A] text-white"
                              : "text-muted-foreground hover:bg-muted",
                          ),
                        ),
                      },
                      [m(e(ze), { class: "w-4 h-4" })],
                      2,
                    ),
                    s(
                      "button",
                      {
                        onClick: o[2] || (o[2] = (r) => (h.value = "grid")),
                        class: me(
                          e(fe)(
                            "p-1.5 rounded transition-colors",
                            e(h) === "grid"
                              ? "bg-[#012D5A] text-white"
                              : "text-muted-foreground hover:bg-muted",
                          ),
                        ),
                      },
                      [m(e(He), { class: "w-4 h-4" })],
                      2,
                    ),
                  ]),
                ]),
              ]),
              s("div", nt, [
                s("div", it, [
                  m(e(Qe), {
                    class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                  }),
                  de(
                    s(
                      "input",
                      {
                        "onUpdate:modelValue":
                          o[3] || (o[3] = (r) => (H(R) ? (R.value = r) : null)),
                        type: "text",
                        placeholder: "Cari invoice...",
                        class:
                          "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                      },
                      null,
                      512,
                    ),
                    [[Re, e(R)]],
                  ),
                ]),
                s("div", st, [
                  m(
                    k,
                    {
                      to: "/finance/invoice/create",
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                    },
                    {
                      default: pe(() => [
                        m(e(be), { class: "w-4 h-4" }),
                        o[8] || (o[8] = s("span", null, "Buat Invoice", -1)),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
              ]),
              e(Q)
                ? (v(),
                  T("div", lt, [
                    ...(o[9] ||
                      (o[9] = [
                        s(
                          "div",
                          {
                            class: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]",
                          },
                          null,
                          -1,
                        ),
                      ])),
                  ]))
                : e(M)
                  ? (v(),
                    T("div", rt, [
                      s("p", ut, re(e(M)), 1),
                      s(
                        "button",
                        {
                          onClick: o[4] || (o[4] = (...r) => e(C) && e(C)(...r)),
                          class: "mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg",
                        },
                        " Retry ",
                      ),
                    ]))
                  : e(x).length === 0
                    ? (v(),
                      T("div", ct, [
                        m(e(Ye), { class: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
                        o[11] ||
                          (o[11] = s(
                            "p",
                            { class: "text-muted-foreground" },
                            "Belum ada invoice",
                            -1,
                          )),
                        m(
                          k,
                          {
                            to: "/finance/invoice/create",
                            class:
                              "mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#012D5A] text-white rounded-lg",
                          },
                          {
                            default: pe(() => [
                              m(e(be), { class: "w-4 h-4" }),
                              o[10] || (o[10] = Fe(" Buat Invoice Pertama ", -1)),
                            ]),
                            _: 1,
                          },
                        ),
                      ]))
                    : e(h) === "list"
                      ? (v(),
                        ce(
                          e(Je),
                          {
                            key: 3,
                            invoices: e(x),
                            "get-status-config": e(y),
                            "format-currency": e(g),
                            "format-date": e(i),
                            onRowClick: $,
                            onDownloadPdf: N,
                          },
                          null,
                          8,
                          ["invoices", "get-status-config", "format-currency", "format-date"],
                        ))
                      : (v(),
                        ce(
                          e($e),
                          {
                            key: 4,
                            invoices: e(x),
                            "get-status-config": e(y),
                            "format-currency": e(g),
                            "format-date": e(i),
                            onRowClick: $,
                            onDownloadPdf: N,
                          },
                          null,
                          8,
                          ["invoices", "get-status-config", "format-currency", "format-date"],
                        )),
              s("div", dt, [
                s("p", null, re(e(x).length) + " data found.", 1),
                m(
                  q,
                  {
                    page: e(D),
                    "onUpdate:page": [o[5] || (o[5] = (r) => (H(D) ? (D.value = r) : null)), e(oe)],
                    total: e(L).total,
                    "items-per-page": e(L).limit,
                  },
                  null,
                  8,
                  ["page", "total", "items-per-page", "onUpdate:page"],
                ),
              ]),
              m(
                e(qe),
                {
                  "is-open": e(Y),
                  "is-submitting": e(G),
                  "edit-error": e(K),
                  "form-data": e(W),
                  "selected-tax-rate": e(f),
                  "status-options": e(_),
                  "tax-options": e(X),
                  companies: e(V),
                  jobs: e(j),
                  services: e(b),
                  onClose: e(Z),
                  onSubmit: e(ee),
                  onAddLineItem: e(ae),
                  onRemoveLineItem: e(ne),
                  onUpdateItemAmount: e(ie),
                  onUpdateTaxRate: se,
                },
                null,
                8,
                [
                  "is-open",
                  "is-submitting",
                  "edit-error",
                  "form-data",
                  "selected-tax-rate",
                  "status-options",
                  "tax-options",
                  "companies",
                  "jobs",
                  "services",
                  "onClose",
                  "onSubmit",
                  "onAddLineItem",
                  "onRemoveLineItem",
                  "onUpdateItemAmount",
                ],
              ),
              m(
                le,
                {
                  modelValue: e(P),
                  "onUpdate:modelValue": o[6] || (o[6] = (r) => (H(P) ? (P.value = r) : null)),
                  "job-id": e(U),
                  "initial-tab": "invoice",
                  "initial-invoice-id": e(J),
                },
                null,
                8,
                ["modelValue", "job-id", "initial-invoice-id"],
              ),
              e(S)
                ? (v(),
                  T("div", mt, [
                    m(Pe, { ref_key: "previewRef", ref: A, invoice: e(S) }, null, 8, ["invoice"]),
                  ]))
                : Ne("", !0),
            ])
          );
        }
      );
    },
  });
export { uo as default };
