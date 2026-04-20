import {
  e as b,
  O as f,
  R as n,
  S as u,
  Q as t,
  Y as x,
  T as d,
  U as s,
  W as a,
  a3 as p,
  a0 as g,
  a1 as v,
  a4 as y,
  af as c,
  _ as r,
} from "./D9q6143x.js";
const k = { key: 0, class: "fixed inset-0 z-[1100] flex items-center justify-center" },
  w = {
    class:
      "relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto",
  },
  D = { class: "flex items-center justify-between p-6 border-b border-border" },
  T = { key: 0, class: "p-3 rounded-lg bg-red-50 text-red-700 text-sm" },
  A = { class: "grid grid-cols-2 gap-4" },
  B = ["value"],
  M = { class: "flex items-center gap-2" },
  S = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  j = ["disabled"],
  V = b({
    __name: "TaxEditModal",
    props: {
      isOpen: { type: Boolean },
      isSubmitting: { type: Boolean },
      editError: {},
      editingTaxId: {},
      formData: {},
      taxTypeOptions: {},
    },
    emits: ["close", "submit"],
    setup(i, { emit: m }) {
      const l = m;
      return (C, e) => (
        r(),
        f(c, { to: "body" }, [
          i.isOpen
            ? (r(),
              n("div", k, [
                t("div", {
                  class: "absolute inset-0 bg-black/50",
                  onClick: e[0] || (e[0] = (o) => l("close")),
                }),
                t("div", w, [
                  t("div", D, [
                    e[10] || (e[10] = t("h2", { class: "text-xl font-bold" }, "Edit Pajak", -1)),
                    t(
                      "button",
                      {
                        onClick: e[1] || (e[1] = (o) => l("close")),
                        class: "p-1 hover:bg-muted rounded-lg transition-colors",
                      },
                      [
                        ...(e[9] ||
                          (e[9] = [
                            t(
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
                              [t("path", { d: "M18 6 6 18" }), t("path", { d: "m6 6 12 12" })],
                              -1,
                            ),
                          ])),
                      ],
                    ),
                  ]),
                  t(
                    "form",
                    {
                      onSubmit: e[8] || (e[8] = x((o) => l("submit"), ["prevent"])),
                      class: "p-6 space-y-4",
                    },
                    [
                      i.editError ? (r(), n("div", T, d(i.editError), 1)) : u("", !0),
                      t("div", null, [
                        e[11] ||
                          (e[11] = t(
                            "label",
                            { class: "block text-sm font-medium mb-1" },
                            "Nama Pajak",
                            -1,
                          )),
                        s(
                          t(
                            "input",
                            {
                              "onUpdate:modelValue": e[2] || (e[2] = (o) => (i.formData.name = o)),
                              type: "text",
                              required: "",
                              class:
                                "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                            },
                            null,
                            512,
                          ),
                          [[a, i.formData.name]],
                        ),
                      ]),
                      t("div", A, [
                        t("div", null, [
                          e[13] ||
                            (e[13] = t(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Tipe",
                              -1,
                            )),
                          s(
                            t(
                              "select",
                              {
                                "onUpdate:modelValue":
                                  e[3] || (e[3] = (o) => (i.formData.type = o)),
                                required: "",
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              [
                                e[12] ||
                                  (e[12] = t(
                                    "option",
                                    { value: "", disabled: "" },
                                    "Pilih Tipe",
                                    -1,
                                  )),
                                (r(!0),
                                n(
                                  g,
                                  null,
                                  v(
                                    i.taxTypeOptions,
                                    (o) => (
                                      r(),
                                      n(
                                        "option",
                                        { key: o.value, value: o.value },
                                        d(o.label),
                                        9,
                                        B,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ],
                              512,
                            ),
                            [[p, i.formData.type]],
                          ),
                        ]),
                        t("div", null, [
                          e[14] ||
                            (e[14] = t(
                              "label",
                              { class: "block text-sm font-medium mb-1" },
                              "Rate (%)",
                              -1,
                            )),
                          s(
                            t(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  e[4] || (e[4] = (o) => (i.formData.rate = o)),
                                type: "number",
                                step: "0.01",
                                min: "0",
                                max: "100",
                                required: "",
                                class:
                                  "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[a, i.formData.rate, void 0, { number: !0 }]],
                          ),
                        ]),
                      ]),
                      t("div", null, [
                        e[15] ||
                          (e[15] = t(
                            "label",
                            { class: "block text-sm font-medium mb-1" },
                            "Deskripsi",
                            -1,
                          )),
                        s(
                          t(
                            "textarea",
                            {
                              "onUpdate:modelValue":
                                e[5] || (e[5] = (o) => (i.formData.description = o)),
                              rows: "2",
                              class:
                                "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary",
                            },
                            null,
                            512,
                          ),
                          [[a, i.formData.description]],
                        ),
                      ]),
                      t("div", M, [
                        s(
                          t(
                            "input",
                            {
                              "onUpdate:modelValue":
                                e[6] || (e[6] = (o) => (i.formData.isActive = o)),
                              type: "checkbox",
                              id: "isActive",
                              class:
                                "w-4 h-4 rounded border-border text-[#012D5A] focus:ring-[#012D5A]",
                            },
                            null,
                            512,
                          ),
                          [[y, i.formData.isActive]],
                        ),
                        e[16] ||
                          (e[16] = t(
                            "label",
                            { for: "isActive", class: "text-sm font-medium" },
                            "Pajak Aktif",
                            -1,
                          )),
                      ]),
                      t("div", S, [
                        t(
                          "button",
                          {
                            type: "button",
                            onClick: e[7] || (e[7] = (o) => l("close")),
                            class:
                              "px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors",
                          },
                          " Batal ",
                        ),
                        t(
                          "button",
                          {
                            type: "submit",
                            disabled: i.isSubmitting,
                            class:
                              "px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50",
                          },
                          d(i.isSubmitting ? "Menyimpan..." : "Simpan"),
                          9,
                          j,
                        ),
                      ]),
                    ],
                    32,
                  ),
                ]),
              ]))
            : u("", !0),
        ])
      );
    },
  });
export { V as TaxEditModal };
