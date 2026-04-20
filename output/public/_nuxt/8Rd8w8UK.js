import { _ as U } from "./DXifQ5ls.js";
import {
  e as C,
  r as m,
  q as I,
  o as M,
  R as r,
  Q as o,
  a2 as k,
  P as O,
  Y as P,
  U as l,
  W as u,
  K as n,
  a3 as f,
  a0 as g,
  a1 as v,
  t as V,
  O as E,
  S as J,
  T as y,
  _ as i,
} from "./D9q6143x.js";
import { u as L } from "./D0dPopTU.js";
import { u as R } from "./CJdNv5wq.js";
import { u as X } from "./ighQaoU7.js";
import { u as q } from "./DivQEVj9.js";
import { S as A } from "./CfuPgfv3.js";
import { A as K } from "./CdOyNhW7.js";
const F = { class: "space-y-6 animate-fade-in p-6" },
  $ = { class: "page-header" },
  z = { class: "flex items-center gap-4" },
  G = { class: "max-w-3xl" },
  Q = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  W = { class: "space-y-2" },
  Y = { class: "space-y-2" },
  H = { class: "space-y-2 md:col-span-2" },
  Z = { class: "space-y-2" },
  ee = ["value"],
  oe = { class: "space-y-2" },
  se = ["value"],
  te = { class: "space-y-2" },
  ne = { class: "space-y-2" },
  ae = ["value"],
  ie = { class: "space-y-2 md:col-span-2" },
  re = { class: "flex justify-end gap-3 pt-4 border-t" },
  le = ["disabled"],
  de = { key: 1 },
  ue = { key: 2 },
  we = C({
    __name: "create",
    setup(pe) {
      const { createExpense: S, isLoading: c } = L(),
        { fetchCompanies: _ } = R(),
        { fetchJobs: B } = X(),
        { fetchServices: h } = q(),
        t = m({
          number: "",
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          categoryId: "",
          vendorId: "",
          jobId: "",
          notes: "",
        }),
        b = m([]),
        x = m([]),
        w = m([]),
        j = I(() => b.value),
        D = I(() => x.value);
      async function T() {
        const [a, e, d] = await Promise.all([_({ type: "VENDOR" }), B(), h()]);
        if (
          (a.success && a.data && (b.value = a.data),
          e.success && e.data && (x.value = e.data),
          d.success && d.data)
        ) {
          const s = new Map();
          for (const p of d.data)
            p.category && s.set(p.category.id, { id: p.category.id, name: p.category.name });
          w.value = Array.from(s.values());
        }
      }
      async function N() {
        try {
          const a = {
            number: t.value.number,
            description: t.value.description,
            amount: Number(t.value.amount),
            date: t.value.date,
          };
          (t.value.categoryId && (a.categoryId = t.value.categoryId),
            t.value.vendorId && (a.vendorId = t.value.vendorId),
            t.value.jobId && (a.jobId = t.value.jobId),
            await S(a),
            V("/finance/expenses"));
        } catch (a) {
          alert("Gagal mencatat biaya: " + a.message);
        }
      }
      return (
        M(() => {
          (T(), (t.value.number = `EXP-${Date.now().toString().slice(-6)}`));
        }),
        (a, e) => {
          const d = U;
          return (
            i(),
            r("div", F, [
              o("div", $, [
                o("div", z, [
                  k(
                    d,
                    {
                      to: "/finance/expenses",
                      class: "p-2 rounded-lg hover:bg-muted transition-colors",
                    },
                    { default: O(() => [k(n(K), { class: "w-5 h-5" })]), _: 1 },
                  ),
                  e[9] ||
                    (e[9] = o(
                      "div",
                      null,
                      [
                        o("h1", { class: "text-2xl font-bold" }, "Catat Biaya Baru"),
                        o(
                          "p",
                          { class: "text-muted-foreground mt-1" },
                          "Masukkan detail pengeluaran operasional",
                        ),
                      ],
                      -1,
                    )),
                ]),
              ]),
              o("div", G, [
                o(
                  "form",
                  {
                    onSubmit: P(N, ["prevent"]),
                    class: "space-y-6 bg-white p-8 rounded-xl border border-border",
                  },
                  [
                    o("div", Q, [
                      o("div", W, [
                        e[10] ||
                          (e[10] = o("label", { class: "text-sm font-medium" }, "No. Biaya", -1)),
                        l(
                          o(
                            "input",
                            {
                              "onUpdate:modelValue": e[0] || (e[0] = (s) => (n(t).number = s)),
                              type: "text",
                              required: "",
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                              placeholder: "EXP-2024-XXXX",
                            },
                            null,
                            512,
                          ),
                          [[u, n(t).number]],
                        ),
                      ]),
                      o("div", Y, [
                        e[11] ||
                          (e[11] = o("label", { class: "text-sm font-medium" }, "Tanggal", -1)),
                        l(
                          o(
                            "input",
                            {
                              "onUpdate:modelValue": e[1] || (e[1] = (s) => (n(t).date = s)),
                              type: "date",
                              required: "",
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                            },
                            null,
                            512,
                          ),
                          [[u, n(t).date]],
                        ),
                      ]),
                      o("div", H, [
                        e[12] ||
                          (e[12] = o("label", { class: "text-sm font-medium" }, "Deskripsi", -1)),
                        l(
                          o(
                            "input",
                            {
                              "onUpdate:modelValue": e[2] || (e[2] = (s) => (n(t).description = s)),
                              type: "text",
                              required: "",
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                              placeholder: "Contoh: Biaya Trucking JOB...",
                            },
                            null,
                            512,
                          ),
                          [[u, n(t).description]],
                        ),
                      ]),
                      o("div", Z, [
                        e[14] ||
                          (e[14] = o("label", { class: "text-sm font-medium" }, "Vendor", -1)),
                        l(
                          o(
                            "select",
                            {
                              "onUpdate:modelValue": e[3] || (e[3] = (s) => (n(t).vendorId = s)),
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white",
                            },
                            [
                              e[13] ||
                                (e[13] = o("option", { value: "" }, "Pilih Vendor (Opsional)", -1)),
                              (i(!0),
                              r(
                                g,
                                null,
                                v(
                                  n(j),
                                  (s) => (
                                    i(), r("option", { key: s.id, value: s.id }, y(s.name), 9, ee)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[f, n(t).vendorId]],
                        ),
                      ]),
                      o("div", oe, [
                        e[16] ||
                          (e[16] = o("label", { class: "text-sm font-medium" }, "Kategori", -1)),
                        l(
                          o(
                            "select",
                            {
                              "onUpdate:modelValue": e[4] || (e[4] = (s) => (n(t).categoryId = s)),
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white",
                            },
                            [
                              e[15] ||
                                (e[15] = o(
                                  "option",
                                  { value: "" },
                                  "Pilih Kategori (Opsional)",
                                  -1,
                                )),
                              (i(!0),
                              r(
                                g,
                                null,
                                v(
                                  n(w),
                                  (s) => (
                                    i(), r("option", { key: s.id, value: s.id }, y(s.name), 9, se)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[f, n(t).categoryId]],
                        ),
                      ]),
                      o("div", te, [
                        e[17] ||
                          (e[17] = o(
                            "label",
                            { class: "text-sm font-medium" },
                            "Jumlah (IDR)",
                            -1,
                          )),
                        l(
                          o(
                            "input",
                            {
                              "onUpdate:modelValue": e[5] || (e[5] = (s) => (n(t).amount = s)),
                              type: "number",
                              required: "",
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                              placeholder: "0",
                            },
                            null,
                            512,
                          ),
                          [[u, n(t).amount]],
                        ),
                      ]),
                      o("div", ne, [
                        e[19] ||
                          (e[19] = o(
                            "label",
                            { class: "text-sm font-medium" },
                            "No. Job (Opsional)",
                            -1,
                          )),
                        l(
                          o(
                            "select",
                            {
                              "onUpdate:modelValue": e[6] || (e[6] = (s) => (n(t).jobId = s)),
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white",
                            },
                            [
                              e[18] || (e[18] = o("option", { value: "" }, "Pilih Job", -1)),
                              (i(!0),
                              r(
                                g,
                                null,
                                v(
                                  n(D),
                                  (s) => (
                                    i(),
                                    r("option", { key: s.id, value: s.id }, y(s.jobNumber), 9, ae)
                                  ),
                                ),
                                128,
                              )),
                            ],
                            512,
                          ),
                          [[f, n(t).jobId]],
                        ),
                      ]),
                      o("div", ie, [
                        e[20] ||
                          (e[20] = o(
                            "label",
                            { class: "text-sm font-medium" },
                            "Keterangan Tambahan",
                            -1,
                          )),
                        l(
                          o(
                            "textarea",
                            {
                              "onUpdate:modelValue": e[7] || (e[7] = (s) => (n(t).notes = s)),
                              rows: "3",
                              class:
                                "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none",
                              placeholder: "Tambahkan catatan jika perlu...",
                            },
                            null,
                            512,
                          ),
                          [[u, n(t).notes]],
                        ),
                      ]),
                    ]),
                    o("div", re, [
                      o(
                        "button",
                        {
                          type: "button",
                          onClick:
                            e[8] ||
                            (e[8] = (s) =>
                              ("navigateTo" in a ? a.navigateTo : n(V))("/finance/expenses")),
                          class:
                            "px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium",
                        },
                        " Batal ",
                      ),
                      o(
                        "button",
                        {
                          type: "submit",
                          disabled: n(c),
                          class:
                            "px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2",
                        },
                        [
                          n(c) ? J("", !0) : (i(), E(n(A), { key: 0, class: "w-4 h-4" })),
                          n(c)
                            ? (i(), r("span", de, "Menyimpan..."))
                            : (i(), r("span", ue, "Simpan Biaya")),
                        ],
                        8,
                        le,
                      ),
                    ]),
                  ],
                  32,
                ),
              ]),
            ])
          );
        }
      );
    },
  });
export { we as default };
