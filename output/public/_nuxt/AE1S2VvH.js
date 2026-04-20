import { _ as R } from "./DXifQ5ls.js";
import {
  e as T,
  f as j,
  ad as A,
  ac as C,
  r as x,
  o as L,
  R as l,
  Q as t,
  a2 as b,
  P as k,
  U as d,
  S as u,
  W as w,
  K as e,
  $ as p,
  T as m,
  a3 as g,
  a0 as M,
  a1 as K,
  O as _,
  V as P,
  Z as E,
  Y as D,
  M as y,
  _ as i,
} from "./D9q6143x.js";
import { S as F } from "./CfuPgfv3.js";
import { A as z } from "./CdOyNhW7.js";
import { o as G, _ as O, s as c } from "./8kB48tSz.js";
const Q = { class: "space-y-6 animate-fade-in p-6" },
  W = { class: "page-header" },
  Y = { class: "flex items-center gap-4" },
  Z = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  $ = { class: "space-y-2" },
  q = { key: 0, class: "text-xs text-red-500" },
  H = { class: "space-y-2" },
  I = { key: 0, class: "text-xs text-red-500" },
  J = { class: "space-y-2" },
  X = { key: 0, class: "text-xs text-red-500" },
  ss = { class: "space-y-2" },
  es = { key: 0, class: "text-xs text-red-500" },
  ts = { class: "space-y-2" },
  as = ["value"],
  os = { key: 0, class: "text-xs text-red-500" },
  rs = { class: "space-y-2" },
  is = { class: "flex justify-end items-center gap-6 pt-4 border-t border-border" },
  ls = ["disabled"],
  fs = T({
    __name: "create",
    setup(ns) {
      const h = j(),
        { createUser: S } = A(),
        { roles: V, fetchRoles: U } = C(),
        f = x(!1);
      L(() => {
        U();
      });
      const N = G({
          name: c().min(1, "Nama wajib diisi"),
          email: c().email("Format email tidak valid"),
          password: c().min(8, "Password minimal 8 karakter"),
          confirmPassword: c().min(8, "Konfirmasi password minimal 8 karakter"),
          role: c().min(1, "Role wajib dipilih"),
          status: O(["active", "inactive"]).default("active"),
        }).refine((n) => n.password === n.confirmPassword, {
          message: "Password dan Konfirmasi Password tidak cocok",
          path: ["confirmPassword"],
        }),
        a = x({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          status: "active",
        }),
        o = x({}),
        B = async () => {
          o.value = {};
          const n = N.safeParse(a.value);
          if (!n.success) {
            n.error.issues.forEach((s) => {
              s.path[0] && (o.value[s.path[0].toString()] = s.message);
            });
            return;
          }
          f.value = !0;
          try {
            const s = await S(a.value.name, a.value.email, a.value.password, a.value.role);
            s.success
              ? (y.success("User berhasil dibuat"), h.push("/settings/users"))
              : y.error(s.error || "Gagal membuat user.");
          } catch (s) {
            const v = s;
            y.error(v.message || "Terjadi kesalahan sistem.");
          } finally {
            f.value = !1;
          }
        };
      return (n, s) => {
        const v = R;
        return (
          i(),
          l("div", Q, [
            t("div", W, [
              t("div", Y, [
                b(
                  v,
                  {
                    to: "/settings/users",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: k(() => [b(e(z), { class: "w-5 h-5" })]), _: 1 },
                ),
                s[6] ||
                  (s[6] = t(
                    "div",
                    null,
                    [
                      t("h1", { class: "page-title" }, "Tambah User"),
                      t("p", { class: "text-muted-foreground mt-1" }, "Buat akun user baru"),
                    ],
                    -1,
                  )),
              ]),
            ]),
            t(
              "form",
              { onSubmit: D(B, ["prevent"]), class: "card-elevated p-6 space-y-6" },
              [
                t("div", Z, [
                  t("div", $, [
                    s[7] || (s[7] = t("label", { class: "text-sm font-medium" }, "Nama", -1)),
                    d(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue": s[0] || (s[0] = (r) => (e(a).name = r)),
                          type: "text",
                          placeholder: "Nama lengkap",
                          class: p(["input-field", { "border-red-500": e(o).name }]),
                        },
                        null,
                        2,
                      ),
                      [[w, e(a).name]],
                    ),
                    e(o).name ? (i(), l("p", q, m(e(o).name), 1)) : u("", !0),
                  ]),
                  t("div", H, [
                    s[8] || (s[8] = t("label", { class: "text-sm font-medium" }, "Email", -1)),
                    d(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue": s[1] || (s[1] = (r) => (e(a).email = r)),
                          type: "email",
                          placeholder: "email@example.com",
                          class: p(["input-field", { "border-red-500": e(o).email }]),
                        },
                        null,
                        2,
                      ),
                      [[w, e(a).email]],
                    ),
                    e(o).email ? (i(), l("p", I, m(e(o).email), 1)) : u("", !0),
                  ]),
                  t("div", J, [
                    s[9] || (s[9] = t("label", { class: "text-sm font-medium" }, "Password", -1)),
                    d(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue": s[2] || (s[2] = (r) => (e(a).password = r)),
                          type: "password",
                          placeholder: "••••••••",
                          class: p(["input-field", { "border-red-500": e(o).password }]),
                        },
                        null,
                        2,
                      ),
                      [[w, e(a).password]],
                    ),
                    e(o).password ? (i(), l("p", X, m(e(o).password), 1)) : u("", !0),
                  ]),
                  t("div", ss, [
                    s[10] ||
                      (s[10] = t(
                        "label",
                        { class: "text-sm font-medium" },
                        "Konfirmasi Password",
                        -1,
                      )),
                    d(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue": s[3] || (s[3] = (r) => (e(a).confirmPassword = r)),
                          type: "password",
                          placeholder: "••••••••",
                          class: p(["input-field", { "border-red-500": e(o).confirmPassword }]),
                        },
                        null,
                        2,
                      ),
                      [[w, e(a).confirmPassword]],
                    ),
                    e(o).confirmPassword
                      ? (i(), l("p", es, m(e(o).confirmPassword), 1))
                      : u("", !0),
                  ]),
                  t("div", ts, [
                    s[12] || (s[12] = t("label", { class: "text-sm font-medium" }, "Role", -1)),
                    d(
                      t(
                        "select",
                        {
                          "onUpdate:modelValue": s[4] || (s[4] = (r) => (e(a).role = r)),
                          class: p(["input-field", { "border-red-500": e(o).role }]),
                        },
                        [
                          s[11] || (s[11] = t("option", { value: "" }, "Pilih role", -1)),
                          (i(!0),
                          l(
                            M,
                            null,
                            K(
                              e(V),
                              (r) => (
                                i(), l("option", { key: r.id, value: r.code }, m(r.name), 9, as)
                              ),
                            ),
                            128,
                          )),
                        ],
                        2,
                      ),
                      [[g, e(a).role]],
                    ),
                    e(o).role ? (i(), l("p", os, m(e(o).role), 1)) : u("", !0),
                  ]),
                  t("div", rs, [
                    s[14] || (s[14] = t("label", { class: "text-sm font-medium" }, "Status", -1)),
                    d(
                      t(
                        "select",
                        {
                          "onUpdate:modelValue": s[5] || (s[5] = (r) => (e(a).status = r)),
                          class: "input-field",
                        },
                        [
                          ...(s[13] ||
                            (s[13] = [
                              t("option", { value: "active" }, "Aktif", -1),
                              t("option", { value: "inactive" }, "Tidak Aktif", -1),
                            ])),
                        ],
                        512,
                      ),
                      [[g, e(a).status]],
                    ),
                  ]),
                ]),
                t("div", is, [
                  b(
                    v,
                    { to: "/settings/users", class: "btn-secondary" },
                    { default: k(() => [...(s[15] || (s[15] = [P("Batal", -1)]))]), _: 1 },
                  ),
                  t(
                    "button",
                    { type: "submit", disabled: e(f), class: "btn-primary" },
                    [
                      e(f)
                        ? (i(), _(e(E), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                        : (i(), _(e(F), { key: 1, class: "w-4 h-4 mr-2" })),
                      s[16] || (s[16] = P(" Simpan ", -1)),
                    ],
                    8,
                    ls,
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
export { fs as default };
