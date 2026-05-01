import { _ as L } from "./DXifQ5ls.js";
import { _ as T } from "./kUcy7b0j.js";
import {
  e as $,
  f as z,
  ac as E,
  r as g,
  R as d,
  Q as s,
  S as x,
  a2 as p,
  P as w,
  K as a,
  T as m,
  U as R,
  V as v,
  W as C,
  $ as U,
  a0 as y,
  a1 as _,
  O as V,
  Z as K,
  Y as O,
  _ as l,
} from "./D9q6143x.js";
import { S as Z } from "./CfuPgfv3.js";
import { A as F } from "./CdOyNhW7.js";
import { o as Q, s as h } from "./8kB48tSz.js";
import "./DrxnuvjT.js";
import "./C0WRWJjF.js";
const G = { class: "space-y-6 animate-fade-in p-6" },
  H = { class: "page-header" },
  J = { class: "flex items-center gap-4" },
  W = { key: 0, class: "bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200" },
  Y = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  q = { class: "space-y-2" },
  X = { key: 0, class: "text-xs text-red-500" },
  ee = { class: "space-y-2" },
  se = ["value"],
  te = { key: 0, class: "text-xs text-red-500" },
  oe = { class: "col-span-1 md:col-span-2 space-y-2" },
  ae = { class: "col-span-1 md:col-span-2 pt-4 border-t border-border" },
  ne = { class: "border border-border rounded-lg overflow-hidden bg-white" },
  re = { class: "w-full text-sm" },
  ie = { class: "bg-gray-50 border-b border-border" },
  le = { class: "py-3 px-4" },
  de = { class: "font-medium text-foreground" },
  ce = { class: "text-xs text-muted-foreground" },
  me = { class: "flex justify-center" },
  pe = { class: "text-center py-3 px-4" },
  ue = { class: "flex justify-center" },
  fe = { class: "flex justify-end items-center gap-6 pt-4 border-t border-border" },
  be = ["disabled"],
  Ve = $({
    __name: "create",
    setup(ve) {
      const j = z(),
        { createRole: A } = E(),
        u = g(!1),
        S = Q({
          name: h().min(1, "Nama Role wajib diisi"),
          code: h()
            .min(1, "Kode Role wajib diisi")
            .regex(
              /^[A-Z0-9_]+$/,
              "Kode harus huruf besar, angka, dan underscore (contoh: ADMIN_USER)",
            ),
          description: h().optional(),
        }),
        t = g({ name: "", code: "", description: "", permissions: {} }),
        N = (o) => {
          let r = o.target.value.toUpperCase();
          ((r = r.replace(/[\s-]/g, "_").replace(/[^A-Z0-9_]/g, "")), (t.value.code = r));
        },
        f = ["create", "read", "update", "delete"],
        M = [
          { key: "organization", label: "Organization", description: "Manage company settings" },
          { key: "member", label: "Member", description: "Manage team members" },
          { key: "invitation", label: "Invitation", description: "Manage invites" },
          { key: "job", label: "Job", description: "Operational jobs" },
          { key: "invoice", label: "Invoice", description: "Financial invoices" },
          { key: "payment", label: "Payment", description: "Payment records" },
          { key: "company", label: "Company", description: "Master data companies" },
          { key: "report", label: "Report", description: "View analytical reports" },
        ],
        i = g({}),
        P = (o, e) => t.value.permissions[o]?.includes(e) || !1,
        I = (o, e) => {
          t.value.permissions[o] || (t.value.permissions[o] = []);
          const r = t.value.permissions[o];
          r.includes(e)
            ? (t.value.permissions[o] = r.filter((c) => c !== e))
            : t.value.permissions[o].push(e);
        },
        k = (o) => {
          const e = t.value.permissions[o];
          return e && e.length === f.length;
        },
        B = (o) => {
          k(o) ? (t.value.permissions[o] = []) : (t.value.permissions[o] = [...f]);
        },
        D = async () => {
          i.value = {};
          const o = S.safeParse(t.value);
          if (!o.success) {
            o.error.issues.forEach((e) => {
              e.path[0] && (i.value[e.path[0].toString()] = e.message);
            });
            return;
          }
          u.value = !0;
          try {
            const e = {};
            for (const [c, n] of Object.entries(t.value.permissions)) n.length > 0 && (e[c] = n);
            const r = await A({
              name: t.value.name,
              code: t.value.code,
              description: t.value.description,
              permissions: e,
            });
            r.success
              ? j.push("/settings/roles")
              : (i.value.root = r.error || "Gagal membuat role.");
          } catch (e) {
            const r = e;
            i.value.root = r.message || "Terjadi kesalahan sistem.";
          } finally {
            u.value = !1;
          }
        };
      return (o, e) => {
        const r = L,
          c = T;
        return (
          l(),
          d("div", G, [
            s("div", H, [
              s("div", J, [
                p(
                  r,
                  {
                    to: "/settings/roles",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: w(() => [p(a(F), { class: "w-5 h-5" })]), _: 1 },
                ),
                e[2] ||
                  (e[2] = s(
                    "div",
                    null,
                    [
                      s("h1", { class: "page-title" }, "Tambah Role"),
                      s(
                        "p",
                        { class: "text-muted-foreground mt-1" },
                        "Buat role baru dengan permission khusus",
                      ),
                    ],
                    -1,
                  )),
              ]),
            ]),
            a(i).root ? (l(), d("div", W, m(a(i).root), 1)) : x("", !0),
            s(
              "form",
              { onSubmit: O(D, ["prevent"]), class: "card-elevated p-6 space-y-6" },
              [
                s("div", Y, [
                  s("div", q, [
                    e[3] ||
                      (e[3] = s(
                        "label",
                        { class: "text-sm font-medium" },
                        [v("Nama Role "), s("span", { class: "text-red-500" }, "*")],
                        -1,
                      )),
                    R(
                      s(
                        "input",
                        {
                          "onUpdate:modelValue": e[0] || (e[0] = (n) => (a(t).name = n)),
                          type: "text",
                          placeholder: "Contoh: Administrator",
                          class: U(["input-field", { "border-red-500": a(i).name }]),
                        },
                        null,
                        2,
                      ),
                      [[C, a(t).name]],
                    ),
                    a(i).name ? (l(), d("p", X, m(a(i).name), 1)) : x("", !0),
                  ]),
                  s("div", ee, [
                    e[4] ||
                      (e[4] = s(
                        "label",
                        { class: "text-sm font-medium" },
                        [v("Kode Role "), s("span", { class: "text-red-500" }, "*")],
                        -1,
                      )),
                    s(
                      "input",
                      {
                        value: a(t).code,
                        onInput: N,
                        type: "text",
                        placeholder: "Contoh: ADMIN",
                        class: U(["input-field uppercase", { "border-red-500": a(i).code }]),
                      },
                      null,
                      42,
                      se,
                    ),
                    e[5] ||
                      (e[5] = s(
                        "p",
                        { class: "text-[10px] text-muted-foreground" },
                        " Hanya huruf besar, angka, dan underscore (UNIQUE). ",
                        -1,
                      )),
                    a(i).code ? (l(), d("p", te, m(a(i).code), 1)) : x("", !0),
                  ]),
                  s("div", oe, [
                    e[6] || (e[6] = s("label", { class: "text-sm font-medium" }, "Deskripsi", -1)),
                    R(
                      s(
                        "textarea",
                        {
                          "onUpdate:modelValue": e[1] || (e[1] = (n) => (a(t).description = n)),
                          rows: "2",
                          placeholder: "Deskripsi singkat tentang role ini...",
                          class: "input-field",
                        },
                        null,
                        512,
                      ),
                      [[C, a(t).description]],
                    ),
                  ]),
                  s("div", ae, [
                    e[9] ||
                      (e[9] = s(
                        "div",
                        { class: "flex items-center justify-between mb-4" },
                        [s("label", { class: "text-sm font-medium" }, "Permissions")],
                        -1,
                      )),
                    s("div", ne, [
                      s("table", re, [
                        s("thead", ie, [
                          s("tr", null, [
                            e[7] ||
                              (e[7] = s(
                                "th",
                                {
                                  class:
                                    "text-left py-3 px-4 font-medium text-muted-foreground w-1/3",
                                },
                                " Resource ",
                                -1,
                              )),
                            (l(),
                            d(
                              y,
                              null,
                              _(f, (n) =>
                                s(
                                  "th",
                                  {
                                    key: n,
                                    class:
                                      "text-center py-3 px-4 font-medium text-muted-foreground capitalize",
                                  },
                                  m(n),
                                  1,
                                ),
                              ),
                              64,
                            )),
                            e[8] ||
                              (e[8] = s(
                                "th",
                                {
                                  class: "text-center py-3 px-4 font-medium text-muted-foreground",
                                },
                                "All",
                                -1,
                              )),
                          ]),
                        ]),
                        s("tbody", null, [
                          (l(),
                          d(
                            y,
                            null,
                            _(M, (n, ge) =>
                              s(
                                "tr",
                                {
                                  key: n.key,
                                  class:
                                    "border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors",
                                },
                                [
                                  s("td", le, [
                                    s("div", de, m(n.label), 1),
                                    s("div", ce, m(n.description), 1),
                                  ]),
                                  (l(),
                                  d(
                                    y,
                                    null,
                                    _(f, (b) =>
                                      s("td", { key: b, class: "text-center py-3 px-4" }, [
                                        s("div", me, [
                                          p(
                                            c,
                                            {
                                              "model-value": P(n.key, b),
                                              "onUpdate:modelValue": (xe) => I(n.key, b),
                                            },
                                            null,
                                            8,
                                            ["model-value", "onUpdate:modelValue"],
                                          ),
                                        ]),
                                      ]),
                                    ),
                                    64,
                                  )),
                                  s("td", pe, [
                                    s("div", ue, [
                                      p(
                                        c,
                                        {
                                          "model-value": k(n.key),
                                          "onUpdate:modelValue": (b) => B(n.key),
                                        },
                                        null,
                                        8,
                                        ["model-value", "onUpdate:modelValue"],
                                      ),
                                    ]),
                                  ]),
                                ],
                              ),
                            ),
                            64,
                          )),
                        ]),
                      ]),
                    ]),
                    e[10] ||
                      (e[10] = s(
                        "p",
                        { class: "text-xs text-muted-foreground mt-2" },
                        " Configure what this role can do for each resource in the system. ",
                        -1,
                      )),
                  ]),
                ]),
                s("div", fe, [
                  p(
                    r,
                    { to: "/settings/roles", class: "btn-secondary" },
                    { default: w(() => [...(e[11] || (e[11] = [v("Batal", -1)]))]), _: 1 },
                  ),
                  s(
                    "button",
                    { type: "submit", disabled: a(u), class: "btn-primary" },
                    [
                      a(u)
                        ? (l(), V(a(K), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                        : (l(), V(a(Z), { key: 1, class: "w-4 h-4 mr-2" })),
                      e[12] || (e[12] = v(" Simpan Role ", -1)),
                    ],
                    8,
                    be,
                  ),
                ]),
              ],
              32,
            ),
          ])
        );
      };
    },
  });
export { Ve as default };
