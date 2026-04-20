import {
  e as p,
  O as v,
  R as n,
  S as f,
  Q as o,
  Y as x,
  T as s,
  U as i,
  W as d,
  a3 as a,
  a0 as m,
  a1 as b,
  af as y,
  _ as l,
} from "./D9q6143x.js";
import { u as w } from "./BxSHOl50.js";
import "./D0dPopTU.js";
import "./CJdNv5wq.js";
import "./ighQaoU7.js";
import "./BfskLp3w.js";
const k = { key: 0, class: "fixed inset-0 z-[1100] flex items-center justify-center" },
  D = {
    class:
      "relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
  },
  c = { class: "flex items-center justify-between p-6 border-b border-border" },
  V = { key: 0, class: "p-3 rounded-lg bg-red-50 text-red-700 text-sm" },
  E = { class: "grid grid-cols-2 gap-4" },
  B = { class: "grid grid-cols-2 gap-4" },
  U = ["value"],
  S = ["value"],
  j = ["value"],
  C = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  I = ["disabled"],
  P = p({
    __name: "ExpenseEditModal",
    props: {
      isOpen: { type: Boolean },
      isSubmitting: { type: Boolean },
      editError: {},
      editingExpenseId: {},
      formData: {},
      categoryOptions: {},
      companies: {},
      jobs: {},
    },
    emits: ["close", "submit"],
    setup(r, { emit: g }) {
      const u = g;
      return (
        w(),
        (M, e) => (
          l(),
          v(y, { to: "body" }, [
            r.isOpen
              ? (l(),
                n("div", k, [
                  o("div", {
                    class: "absolute inset-0 bg-black/50",
                    onClick: e[0] || (e[0] = (t) => u("close")),
                  }),
                  o("div", D, [
                    o("div", c, [
                      e[13] || (e[13] = o("h2", { class: "text-xl font-bold" }, "Edit Biaya", -1)),
                      o(
                        "button",
                        {
                          onClick: e[1] || (e[1] = (t) => u("close")),
                          class: "p-1 hover:bg-muted rounded-lg transition-colors",
                        },
                        [
                          ...(e[12] ||
                            (e[12] = [
                              o(
                                "svg",
                                {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  width: "20",
                                  height: "20",
                                  viewBox: "0 0 24 24",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2",
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                },
                                [o("path", { d: "M18 6 6 18" }), o("path", { d: "m6 6 12 12" })],
                                -1,
                              ),
                            ])),
                        ],
                      ),
                    ]),
                    o(
                      "form",
                      {
                        onSubmit: e[11] || (e[11] = x((t) => u("submit"), ["prevent"])),
                        class: "p-6 space-y-4",
                      },
                      [
                        r.editError ? (l(), n("div", V, s(r.editError), 1)) : f("", !0),
                        o("div", null, [
                          e[14] ||
                            (e[14] = o(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Nomor Biaya",
                              -1,
                            )),
                          i(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  e[2] || (e[2] = (t) => (r.formData.number = t)),
                                type: "text",
                                required: "",
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[d, r.formData.number]],
                          ),
                        ]),
                        o("div", null, [
                          e[15] ||
                            (e[15] = o(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Deskripsi",
                              -1,
                            )),
                          i(
                            o(
                              "textarea",
                              {
                                "onUpdate:modelValue":
                                  e[3] || (e[3] = (t) => (r.formData.description = t)),
                                rows: "2",
                                required: "",
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[d, r.formData.description]],
                          ),
                        ]),
                        o("div", E, [
                          o("div", null, [
                            e[16] ||
                              (e[16] = o(
                                "label",
                                { class: "block text-sm font-medium mb-1" },
                                "Jumlah",
                                -1,
                              )),
                            i(
                              o(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    e[4] || (e[4] = (t) => (r.formData.amount = t)),
                                  type: "number",
                                  step: "0.01",
                                  required: "",
                                  class:
                                    "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                512,
                              ),
                              [[d, r.formData.amount, void 0, { number: !0 }]],
                            ),
                          ]),
                          o("div", null, [
                            e[17] ||
                              (e[17] = o(
                                "label",
                                { class: "block text-sm font-medium mb-1" },
                                "Tanggal",
                                -1,
                              )),
                            i(
                              o(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    e[5] || (e[5] = (t) => (r.formData.date = t)),
                                  type: "date",
                                  required: "",
                                  class:
                                    "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                null,
                                512,
                              ),
                              [[d, r.formData.date]],
                            ),
                          ]),
                        ]),
                        o("div", B, [
                          o("div", null, [
                            e[19] ||
                              (e[19] = o(
                                "label",
                                { class: "block text-sm font-medium mb-1" },
                                "Vendor",
                                -1,
                              )),
                            i(
                              o(
                                "select",
                                {
                                  "onUpdate:modelValue":
                                    e[6] || (e[6] = (t) => (r.formData.vendorId = t)),
                                  class:
                                    "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                [
                                  e[18] || (e[18] = o("option", { value: "" }, "Pilih Vendor", -1)),
                                  (l(!0),
                                  n(
                                    m,
                                    null,
                                    b(
                                      r.companies,
                                      (t) => (
                                        l(),
                                        n("option", { key: t.id, value: t.id }, s(t.name), 9, U)
                                      ),
                                    ),
                                    128,
                                  )),
                                ],
                                512,
                              ),
                              [[a, r.formData.vendorId]],
                            ),
                          ]),
                          o("div", null, [
                            e[21] ||
                              (e[21] = o(
                                "label",
                                { class: "block text-sm font-medium mb-1" },
                                "Job",
                                -1,
                              )),
                            i(
                              o(
                                "select",
                                {
                                  "onUpdate:modelValue":
                                    e[7] || (e[7] = (t) => (r.formData.jobId = t)),
                                  class:
                                    "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                [
                                  e[20] || (e[20] = o("option", { value: "" }, "Pilih Job", -1)),
                                  (l(!0),
                                  n(
                                    m,
                                    null,
                                    b(
                                      r.jobs,
                                      (t) => (
                                        l(),
                                        n(
                                          "option",
                                          { key: t.id, value: t.id },
                                          s(t.jobNumber),
                                          9,
                                          S,
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ],
                                512,
                              ),
                              [[a, r.formData.jobId]],
                            ),
                          ]),
                        ]),
                        o("div", null, [
                          e[22] ||
                            (e[22] = o(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Kategori",
                              -1,
                            )),
                          i(
                            o(
                              "select",
                              {
                                "onUpdate:modelValue":
                                  e[8] || (e[8] = (t) => (r.formData.categoryId = t)),
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              [
                                (l(!0),
                                n(
                                  m,
                                  null,
                                  b(
                                    r.categoryOptions,
                                    (t) => (
                                      l(),
                                      n(
                                        "option",
                                        { key: t.value, value: t.value },
                                        s(t.label),
                                        9,
                                        j,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ],
                              512,
                            ),
                            [[a, r.formData.categoryId]],
                          ),
                        ]),
                        o("div", null, [
                          e[23] ||
                            (e[23] = o(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Catatan",
                              -1,
                            )),
                          i(
                            o(
                              "textarea",
                              {
                                "onUpdate:modelValue":
                                  e[9] || (e[9] = (t) => (r.formData.notes = t)),
                                rows: "2",
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[d, r.formData.notes]],
                          ),
                        ]),
                        o("div", C, [
                          o(
                            "button",
                            {
                              type: "button",
                              onClick: e[10] || (e[10] = (t) => u("close")),
                              class:
                                "px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors",
                            },
                            " Batal ",
                          ),
                          o(
                            "button",
                            {
                              type: "submit",
                              disabled: r.isSubmitting,
                              class:
                                "px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50",
                            },
                            s(r.isSubmitting ? "Menyimpan..." : "Simpan"),
                            9,
                            I,
                          ),
                        ]),
                      ],
                      32,
                    ),
                  ]),
                ]))
              : f("", !0),
          ])
        )
      );
    },
  });
export { P as ExpenseEditModal };
