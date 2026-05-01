import { _ as h } from "./DhCF3Kco.js";
import {
  e as D,
  O as I,
  P as V,
  Q as e,
  R as d,
  S as U,
  T as i,
  U as l,
  V as u,
  W as m,
  a3 as g,
  a1 as p,
  a0 as b,
  a2 as v,
  K as f,
  Y as k,
  _ as r,
} from "./D9q6143x.js";
import { f as P } from "./DrxnuvjT.js";
import { P as S } from "./CWUm5Boh.js";
import { T } from "./DhzAXlPS.js";
import { S as C } from "./CfuPgfv3.js";
const j = { key: 0, class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
  N = { class: "text-sm text-red-600" },
  q = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  B = { class: "space-y-1.5" },
  O = { class: "space-y-1.5" },
  R = ["value"],
  $ = { class: "space-y-1.5" },
  A = { class: "space-y-1.5" },
  E = { class: "space-y-1.5" },
  M = ["value"],
  L = { class: "space-y-1.5" },
  J = ["value"],
  Q = { class: "space-y-3" },
  F = { class: "flex items-center justify-between" },
  H = { class: "border border-border rounded-lg overflow-hidden" },
  K = { class: "w-full text-sm" },
  W = { class: "divide-y divide-border" },
  Y = { class: "p-2" },
  z = ["onUpdate:modelValue"],
  G = { class: "p-2" },
  X = ["onUpdate:modelValue"],
  Z = ["value"],
  _ = { class: "p-2" },
  ee = ["onUpdate:modelValue", "onInput"],
  te = { class: "p-2" },
  oe = ["onUpdate:modelValue", "onInput"],
  se = { class: "p-2 text-right font-medium" },
  ne = { class: "p-2" },
  re = ["onClick"],
  de = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  ie = { class: "space-y-1.5" },
  le = ["model-value"],
  ae = ["value"],
  ue = { class: "space-y-1.5" },
  me = { class: "border-t border-border pt-4" },
  fe = { class: "flex justify-end" },
  pe = { class: "w-64 space-y-2" },
  be = { class: "flex justify-between text-sm" },
  ce = { class: "font-medium" },
  xe = { class: "flex justify-between text-sm" },
  ge = { class: "font-medium" },
  ve = { class: "flex justify-between pt-2 border-t border-border" },
  ye = { class: "font-semibold text-lg" },
  we = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  he = ["disabled"],
  Te = D({
    __name: "InvoiceEditModal",
    props: {
      isOpen: { type: Boolean },
      isSubmitting: { type: Boolean },
      editError: {},
      formData: {},
      selectedTaxRate: {},
      statusOptions: {},
      taxOptions: {},
      companies: {},
      jobs: {},
      services: {},
    },
    emits: [
      "close",
      "submit",
      "addLineItem",
      "removeLineItem",
      "updateItemAmount",
      "updateTaxRate",
    ],
    setup(s, { emit: y }) {
      const a = y,
        c = P;
      return (De, t) => {
        const w = h;
        return (
          r(),
          I(
            w,
            {
              "model-value": s.isOpen,
              title: "Edit Invoice",
              description: "Ubah semua detail invoice",
              width: "max-w-4xl",
              "onUpdate:modelValue": t[11] || (t[11] = (o) => !o && a("close")),
              onClose: t[12] || (t[12] = (o) => a("close")),
            },
            {
              default: V(() => [
                e(
                  "form",
                  {
                    class: "space-y-6",
                    onSubmit: t[10] || (t[10] = k((o) => a("submit"), ["prevent"])),
                  },
                  [
                    s.editError ? (r(), d("div", j, [e("p", N, i(s.editError), 1)])) : U("", !0),
                    e("div", q, [
                      e("div", B, [
                        t[13] ||
                          (t[13] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Nomor Invoice "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          e(
                            "input",
                            {
                              "onUpdate:modelValue":
                                t[0] || (t[0] = (o) => (s.formData.invoiceNumber = o)),
                              type: "text",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              required: "",
                            },
                            null,
                            512,
                          ),
                          [[m, s.formData.invoiceNumber]],
                        ),
                      ]),
                      e("div", O, [
                        t[15] ||
                          (t[15] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Status Invoice "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          e(
                            "select",
                            {
                              "onUpdate:modelValue":
                                t[1] || (t[1] = (o) => (s.formData.statusId = o)),
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              required: "",
                            },
                            [
                              t[14] ||
                                (t[14] = e(
                                  "option",
                                  { value: "", disabled: "" },
                                  "Pilih status",
                                  -1,
                                )),
                              (r(!0),
                              d(
                                b,
                                null,
                                p(
                                  s.statusOptions,
                                  (o) => (
                                    r(), d("option", { key: o.id, value: o.id }, i(o.name), 9, R)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[g, s.formData.statusId]],
                        ),
                      ]),
                      e("div", $, [
                        t[16] ||
                          (t[16] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Tanggal Invoice "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          e(
                            "input",
                            {
                              "onUpdate:modelValue":
                                t[2] || (t[2] = (o) => (s.formData.issuedDate = o)),
                              type: "date",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              required: "",
                            },
                            null,
                            512,
                          ),
                          [[m, s.formData.issuedDate]],
                        ),
                      ]),
                      e("div", A, [
                        t[17] ||
                          (t[17] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Jatuh Tempo "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          e(
                            "input",
                            {
                              "onUpdate:modelValue":
                                t[3] || (t[3] = (o) => (s.formData.dueDate = o)),
                              type: "date",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              required: "",
                            },
                            null,
                            512,
                          ),
                          [[m, s.formData.dueDate]],
                        ),
                      ]),
                      e("div", E, [
                        t[19] ||
                          (t[19] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Customer "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          e(
                            "select",
                            {
                              "onUpdate:modelValue":
                                t[4] || (t[4] = (o) => (s.formData.companyId = o)),
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                              required: "",
                            },
                            [
                              t[18] ||
                                (t[18] = e(
                                  "option",
                                  { value: "", disabled: "" },
                                  "Pilih customer",
                                  -1,
                                )),
                              (r(!0),
                              d(
                                b,
                                null,
                                p(
                                  s.companies,
                                  (o) => (
                                    r(), d("option", { key: o.id, value: o.id }, i(o.name), 9, M)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[g, s.formData.companyId]],
                        ),
                      ]),
                      e("div", L, [
                        t[21] ||
                          (t[21] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            " Job Reference ",
                            -1,
                          )),
                        l(
                          e(
                            "select",
                            {
                              "onUpdate:modelValue": t[5] || (t[5] = (o) => (s.formData.jobId = o)),
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                            },
                            [
                              t[20] ||
                                (t[20] = e("option", { value: "" }, "Pilih job (opsional)", -1)),
                              (r(!0),
                              d(
                                b,
                                null,
                                p(
                                  s.jobs,
                                  (o) => (
                                    r(),
                                    d("option", { key: o.id, value: o.id }, i(o.jobNumber), 9, J)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[g, s.formData.jobId]],
                        ),
                      ]),
                    ]),
                    e("div", Q, [
                      e("div", F, [
                        t[23] ||
                          (t[23] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [u(" Item Invoice "), e("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        e(
                          "button",
                          {
                            type: "button",
                            onClick: t[6] || (t[6] = (o) => a("addLineItem")),
                            class:
                              "text-sm text-[#012D5A] hover:text-[#012D5A]/80 font-medium flex items-center gap-1",
                          },
                          [
                            v(f(S), { class: "w-4 h-4" }),
                            t[22] || (t[22] = u(" Tambah Item ", -1)),
                          ],
                        ),
                      ]),
                      e("div", H, [
                        e("table", K, [
                          t[25] ||
                            (t[25] = e(
                              "thead",
                              { class: "bg-muted" },
                              [
                                e("tr", null, [
                                  e(
                                    "th",
                                    {
                                      class:
                                        "px-3 py-2 text-left font-medium text-foreground w-1/3",
                                    },
                                    "Deskripsi",
                                  ),
                                  e(
                                    "th",
                                    { class: "px-3 py-2 text-left font-medium text-foreground" },
                                    "Service",
                                  ),
                                  e(
                                    "th",
                                    {
                                      class:
                                        "px-3 py-2 text-center font-medium text-foreground w-20",
                                    },
                                    "Qty",
                                  ),
                                  e(
                                    "th",
                                    { class: "px-3 py-2 text-right font-medium text-foreground" },
                                    "Harga Satuan",
                                  ),
                                  e(
                                    "th",
                                    { class: "px-3 py-2 text-right font-medium text-foreground" },
                                    "Jumlah",
                                  ),
                                  e("th", { class: "px-3 py-2 w-10" }),
                                ]),
                              ],
                              -1,
                            )),
                          e("tbody", W, [
                            (r(!0),
                            d(
                              b,
                              null,
                              p(
                                s.formData.items,
                                (o, x) => (
                                  r(),
                                  d("tr", { key: x, class: "hover:bg-muted/50" }, [
                                    e("td", Y, [
                                      l(
                                        e(
                                          "input",
                                          {
                                            "onUpdate:modelValue": (n) => (o.description = n),
                                            type: "text",
                                            placeholder: "Deskripsi",
                                            class:
                                              "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                                            required: "",
                                          },
                                          null,
                                          8,
                                          z,
                                        ),
                                        [[m, o.description]],
                                      ),
                                    ]),
                                    e("td", G, [
                                      l(
                                        e(
                                          "select",
                                          {
                                            "onUpdate:modelValue": (n) => (o.serviceId = n),
                                            class:
                                              "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                                          },
                                          [
                                            t[24] ||
                                              (t[24] = e(
                                                "option",
                                                { value: "" },
                                                "Pilih service",
                                                -1,
                                              )),
                                            (r(!0),
                                            d(
                                              b,
                                              null,
                                              p(
                                                s.services,
                                                (n) => (
                                                  r(),
                                                  d(
                                                    "option",
                                                    { key: n.id, value: n.id },
                                                    i(n.name),
                                                    9,
                                                    Z,
                                                  )
                                                ),
                                              ),
                                              128,
                                            )),
                                          ],
                                          8,
                                          X,
                                        ),
                                        [[g, o.serviceId]],
                                      ),
                                    ]),
                                    e("td", _, [
                                      l(
                                        e(
                                          "input",
                                          {
                                            "onUpdate:modelValue": (n) => (o.quantity = n),
                                            type: "number",
                                            min: "1",
                                            class:
                                              "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-center",
                                            onInput: (n) => a("updateItemAmount", x),
                                            required: "",
                                          },
                                          null,
                                          40,
                                          ee,
                                        ),
                                        [[m, o.quantity, void 0, { number: !0 }]],
                                      ),
                                    ]),
                                    e("td", te, [
                                      l(
                                        e(
                                          "input",
                                          {
                                            "onUpdate:modelValue": (n) => (o.unitPrice = n),
                                            type: "number",
                                            min: "0",
                                            class:
                                              "w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-right",
                                            onInput: (n) => a("updateItemAmount", x),
                                            required: "",
                                          },
                                          null,
                                          40,
                                          oe,
                                        ),
                                        [[m, o.unitPrice, void 0, { number: !0 }]],
                                      ),
                                    ]),
                                    e("td", se, i(f(c)(o.amount)), 1),
                                    e("td", ne, [
                                      e(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: (n) => a("removeLineItem", x),
                                          class:
                                            "p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded",
                                        },
                                        [v(f(T), { class: "w-4 h-4" })],
                                        8,
                                        re,
                                      ),
                                    ]),
                                  ])
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]),
                      ]),
                    ]),
                    e("div", de, [
                      e("div", ie, [
                        t[26] ||
                          (t[26] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "PPN",
                            -1,
                          )),
                        e(
                          "select",
                          {
                            "model-value": s.selectedTaxRate,
                            class:
                              "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white",
                            "onUpdate:modelValue":
                              t[7] || (t[7] = (o) => a("updateTaxRate", Number(o))),
                          },
                          [
                            (r(!0),
                            d(
                              b,
                              null,
                              p(
                                s.taxOptions,
                                (o) => (
                                  r(),
                                  d("option", { key: o.value, value: o.value }, i(o.label), 9, ae)
                                ),
                              ),
                              128,
                            )),
                          ],
                          8,
                          le,
                        ),
                      ]),
                      e("div", ue, [
                        t[27] ||
                          (t[27] = e(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Catatan",
                            -1,
                          )),
                        l(
                          e(
                            "textarea",
                            {
                              "onUpdate:modelValue": t[8] || (t[8] = (o) => (s.formData.notes = o)),
                              rows: "2",
                              placeholder: "Catatan invoice (opsional)",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm",
                            },
                            null,
                            512,
                          ),
                          [[m, s.formData.notes]],
                        ),
                      ]),
                    ]),
                    e("div", me, [
                      e("div", fe, [
                        e("div", pe, [
                          e("div", be, [
                            t[28] ||
                              (t[28] = e(
                                "span",
                                { class: "text-muted-foreground" },
                                "Subtotal:",
                                -1,
                              )),
                            e("span", ce, i(f(c)(s.formData.subTotal)), 1),
                          ]),
                          e("div", xe, [
                            t[29] ||
                              (t[29] = e(
                                "span",
                                { class: "text-muted-foreground" },
                                "Pajak (PPN):",
                                -1,
                              )),
                            e("span", ge, i(f(c)(s.formData.taxAmount)), 1),
                          ]),
                          e("div", ve, [
                            t[30] || (t[30] = e("span", { class: "font-semibold" }, "Total:", -1)),
                            e("span", ye, i(f(c)(s.formData.total)), 1),
                          ]),
                        ]),
                      ]),
                    ]),
                    e("div", we, [
                      e(
                        "button",
                        {
                          type: "button",
                          onClick: t[9] || (t[9] = (o) => a("close")),
                          class: "btn-secondary",
                        },
                        "Batal",
                      ),
                      e(
                        "button",
                        {
                          type: "submit",
                          disabled: s.isSubmitting,
                          class: "btn-primary flex items-center gap-2",
                        },
                        [
                          v(f(C), { class: "w-4 h-4" }),
                          u(" " + i(s.isSubmitting ? "Menyimpan..." : "Simpan"), 1),
                        ],
                        8,
                        he,
                      ),
                    ]),
                  ],
                  32,
                ),
              ]),
              _: 1,
            },
            8,
            ["model-value"],
          )
        );
      };
    },
  });
export { Te as _ };
