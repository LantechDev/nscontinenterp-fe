import { _ as y } from "./DXifQ5ls.js";
import {
  e as v,
  r as x,
  R as d,
  Q as e,
  a2 as u,
  P as w,
  Y as k,
  U as n,
  W as p,
  K as s,
  a3 as m,
  t as c,
  O as _,
  S as h,
  _ as r,
} from "./D9q6143x.js";
import { u as P } from "./DddWBLY3.js";
import { S as A } from "./CfuPgfv3.js";
import { A as N } from "./CdOyNhW7.js";
const S = { class: "space-y-6 animate-fade-in p-6" },
  T = { class: "page-header" },
  V = { class: "flex items-center gap-4" },
  j = { class: "max-w-3xl" },
  C = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  U = { class: "space-y-2" },
  B = { class: "space-y-2" },
  D = { class: "space-y-2" },
  M = { class: "space-y-2" },
  q = { class: "space-y-2" },
  L = { class: "flex justify-end gap-3 pt-4 border-t border-border" },
  R = ["disabled"],
  z = { key: 1 },
  E = { key: 2 },
  Y = v({
    __name: "create",
    setup(F) {
      const { createTax: f, isLoading: l } = P(),
        o = x({ name: "", rate: 0, type: "", description: "", isActive: !0 });
      async function g() {
        try {
          (await f(o.value), c("/finance/tax"));
        } catch (i) {
          alert("Gagal menyimpan pajak: " + i.message);
        }
      }
      return (i, t) => {
        const b = y;
        return (
          r(),
          d("div", S, [
            e("div", T, [
              e("div", V, [
                u(
                  b,
                  { to: "/finance/tax", class: "p-2 rounded-lg hover:bg-muted transition-colors" },
                  { default: w(() => [u(s(N), { class: "w-5 h-5" })]), _: 1 },
                ),
                t[6] ||
                  (t[6] = e(
                    "div",
                    null,
                    [
                      e("h1", { class: "text-2xl font-bold" }, "Catat Pajak"),
                      e("p", { class: "text-muted-foreground mt-1" }, "Tambah catatan pajak baru"),
                    ],
                    -1,
                  )),
              ]),
            ]),
            e("div", j, [
              e(
                "form",
                {
                  onSubmit: k(g, ["prevent"]),
                  class: "space-y-6 bg-white p-8 rounded-xl border border-border",
                },
                [
                  e("div", C, [
                    e("div", U, [
                      t[7] ||
                        (t[7] = e("label", { class: "text-sm font-medium" }, "Nama Pajak", -1)),
                      n(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": t[0] || (t[0] = (a) => (s(o).name = a)),
                            type: "text",
                            required: "",
                            class:
                              "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                            placeholder: "Contoh: PPN 11%",
                          },
                          null,
                          512,
                        ),
                        [[p, s(o).name]],
                      ),
                    ]),
                    e("div", B, [
                      t[9] ||
                        (t[9] = e("label", { class: "text-sm font-medium" }, "Tipe Pajak", -1)),
                      n(
                        e(
                          "select",
                          {
                            "onUpdate:modelValue": t[1] || (t[1] = (a) => (s(o).type = a)),
                            required: "",
                            class:
                              "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white",
                          },
                          [
                            ...(t[8] ||
                              (t[8] = [
                                e("option", { value: "" }, "Pilih tipe pajak", -1),
                                e("option", { value: "ppn" }, "PPN", -1),
                                e("option", { value: "pph" }, "PPh", -1),
                              ])),
                          ],
                          512,
                        ),
                        [[m, s(o).type]],
                      ),
                    ]),
                    e("div", D, [
                      t[10] ||
                        (t[10] = e("label", { class: "text-sm font-medium" }, "Rate (%)", -1)),
                      n(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": t[2] || (t[2] = (a) => (s(o).rate = a)),
                            type: "number",
                            step: "0.01",
                            required: "",
                            class:
                              "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none",
                            placeholder: "0",
                          },
                          null,
                          512,
                        ),
                        [[p, s(o).rate]],
                      ),
                    ]),
                    e("div", M, [
                      t[12] || (t[12] = e("label", { class: "text-sm font-medium" }, "Status", -1)),
                      n(
                        e(
                          "select",
                          {
                            "onUpdate:modelValue": t[3] || (t[3] = (a) => (s(o).isActive = a)),
                            class:
                              "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none bg-white",
                          },
                          [
                            ...(t[11] ||
                              (t[11] = [
                                e("option", { value: !0 }, "Aktif", -1),
                                e("option", { value: !1 }, "Nonaktif", -1),
                              ])),
                          ],
                          512,
                        ),
                        [[m, s(o).isActive]],
                      ),
                    ]),
                  ]),
                  e("div", q, [
                    t[13] ||
                      (t[13] = e("label", { class: "text-sm font-medium" }, "Deskripsi", -1)),
                    n(
                      e(
                        "textarea",
                        {
                          "onUpdate:modelValue": t[4] || (t[4] = (a) => (s(o).description = a)),
                          rows: "3",
                          class:
                            "w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none",
                          placeholder: "Catatan tambahan...",
                        },
                        null,
                        512,
                      ),
                      [[p, s(o).description]],
                    ),
                  ]),
                  e("div", L, [
                    e(
                      "button",
                      {
                        type: "button",
                        onClick:
                          t[5] ||
                          (t[5] = (a) => ("navigateTo" in i ? i.navigateTo : s(c))("/finance/tax")),
                        class:
                          "px-6 py-2 border rounded-lg hover:bg-muted transition-colors font-medium",
                      },
                      " Batal ",
                    ),
                    e(
                      "button",
                      {
                        type: "submit",
                        disabled: s(l),
                        class:
                          "px-6 py-2 bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors font-medium flex items-center gap-2",
                      },
                      [
                        s(l) ? h("", !0) : (r(), _(s(A), { key: 0, class: "w-4 h-4" })),
                        s(l) ? (r(), d("span", z, "Menyimpan...")) : (r(), d("span", E, "Simpan")),
                      ],
                      8,
                      R,
                    ),
                  ]),
                ],
                32,
              ),
            ]),
          ])
        );
      };
    },
  });
export { Y as default };
