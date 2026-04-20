import { _ as G } from "./DXifQ5ls.js";
import {
  e as H,
  ab as I,
  f as K,
  ad as z,
  ac as O,
  r as u,
  o as Y,
  R as n,
  Q as e,
  S as m,
  a2 as f,
  P as V,
  K as t,
  V as U,
  Z as C,
  T as p,
  Y as Q,
  U as v,
  W as _,
  $ as y,
  a3 as j,
  a0 as A,
  a1 as W,
  O as S,
  ak as Z,
  M as b,
  _ as l,
} from "./D9q6143x.js";
import { T as q } from "./DhzAXlPS.js";
import { S as J } from "./CfuPgfv3.js";
import { A as X } from "./CdOyNhW7.js";
import { o as ss, _ as es, s as k } from "./8kB48tSz.js";
const ts = { class: "space-y-6 animate-fade-in p-6" },
  as = { class: "page-header" },
  os = { class: "flex items-center gap-4" },
  rs = { key: 0, class: "p-12 text-center" },
  is = { key: 1 },
  ls = { key: 0, class: "bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200" },
  ns = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  ds = { class: "space-y-2" },
  us = { key: 0, class: "text-xs text-red-500" },
  ms = { class: "space-y-2" },
  ps = { key: 0, class: "text-xs text-red-500" },
  cs = { class: "col-span-1 md:col-span-2 border-t pt-4 mt-2" },
  fs = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  vs = { class: "space-y-2" },
  bs = { key: 0, class: "text-xs text-red-500" },
  gs = { class: "space-y-2" },
  ws = { key: 0, class: "text-xs text-red-500" },
  xs = { class: "space-y-2" },
  ys = ["value"],
  ks = { key: 0, class: "text-xs text-red-500" },
  hs = { class: "space-y-2" },
  _s = { class: "flex justify-end items-center gap-6 pt-4 border-t border-border" },
  Ps = ["disabled"],
  Us = {
    key: 0,
    class: "fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 animate-fade-in",
  },
  Cs = { class: "bg-background rounded-lg shadow-lg max-w-md w-full p-6 mx-4" },
  Ss = { class: "flex items-center gap-3 text-red-600 mb-4" },
  Ts = { class: "p-2 bg-red-100 rounded-full" },
  Vs = { class: "flex justify-end gap-3" },
  js = ["disabled"],
  As = ["disabled"],
  Bs = { key: 1 },
  Fs = H({
    __name: "edit",
    setup(Es) {
      const B = I(),
        P = K(),
        c = B.params.id,
        { fetchUserById: E, adminUpdateUser: N, deleteUser: R } = z(),
        { roles: D, fetchRoles: $ } = O(),
        h = u(!1),
        T = u(!0),
        g = u(""),
        L = ss({
          name: k().min(1, "Nama wajib diisi"),
          email: k().email("Format email tidak valid"),
          password: k().optional(),
          confirmPassword: k().optional(),
          role: k().min(1, "Role wajib dipilih"),
          status: es(["active", "inactive"]).default("active"),
        }).refine((a) => !(a.password && a.password !== a.confirmPassword), {
          message: "Password dan Konfirmasi Password tidak cocok",
          path: ["confirmPassword"],
        }),
        o = u({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          status: "active",
        }),
        i = u({});
      Y(async () => {
        try {
          await $();
          const a = await E(c);
          if (a.success && a.data) {
            const s = a.data.user || a.data;
            s
              ? (o.value = {
                  name: s.name || "",
                  email: s.email || "",
                  password: "",
                  confirmPassword: "",
                  role: s.role || "",
                  status: s.banned === !0 ? "inactive" : "active",
                })
              : (g.value = "Data user kosong atau tidak ditemukan.");
          } else
            ((g.value = a.error || "Gagal mengambil data user (API Error)."),
              console.error("Fetch user error:", a));
        } catch (a) {
          const s = a;
          ((g.value = s.message || "Terjadi kesalahan saat memuat data."),
            console.error("Mount error:", a));
        } finally {
          T.value = !1;
        }
      });
      const M = async () => {
          i.value = {};
          const a = L.safeParse(o.value);
          if (!a.success) {
            a.error.issues.forEach((s) => {
              s.path[0] && (i.value[s.path[0].toString()] = s.message);
            });
            return;
          }
          h.value = !0;
          try {
            const s = {
              name: o.value.name,
              email: o.value.email,
              role: o.value.role,
              banned: o.value.status === "inactive",
            };
            o.value.password && (s.password = o.value.password);
            const d = await N(c, s);
            d.success
              ? (b.success("User berhasil diupdate"), P.push(`/settings/users/${c}`))
              : b.error(d.error || "Gagal mengupdate user.");
          } catch (s) {
            const d = s;
            b.error(d.message || "Terjadi kesalahan sistem.");
          } finally {
            h.value = !1;
          }
        },
        w = u(!1),
        x = u(!1),
        F = async () => {
          x.value = !0;
          try {
            const a = await R(c);
            a.success
              ? (b.success("User berhasil dihapus", { duration: 3e3 }), P.push("/settings/users"))
              : (b.error(a.error || "Gagal menghapus user."), (w.value = !1));
          } catch (a) {
            const s = a;
            (b.error(s.message || "Terjadi kesalahan sistem."), (w.value = !1));
          } finally {
            x.value = !1;
          }
        };
      return (a, s) => {
        const d = G;
        return (
          l(),
          n(
            A,
            null,
            [
              e("div", ts, [
                e("div", as, [
                  e("div", os, [
                    f(
                      d,
                      {
                        to: `/settings/users/${t(c)}`,
                        class: "p-2 rounded-lg hover:bg-muted transition-colors",
                      },
                      { default: V(() => [f(t(X), { class: "w-5 h-5" })]), _: 1 },
                      8,
                      ["to"],
                    ),
                    s[9] ||
                      (s[9] = e(
                        "div",
                        null,
                        [
                          e("h1", { class: "page-title" }, "Edit User"),
                          e("p", { class: "text-muted-foreground mt-1" }, "Edit informasi user"),
                        ],
                        -1,
                      )),
                  ]),
                  e(
                    "button",
                    {
                      type: "button",
                      onClick: s[0] || (s[0] = (r) => (w.value = !0)),
                      class: "btn-destructive",
                    },
                    [f(t(q), { class: "w-4 h-4 mr-2" }), s[10] || (s[10] = U(" Hapus User ", -1))],
                  ),
                ]),
                t(T)
                  ? (l(),
                    n("div", rs, [
                      f(t(C), { class: "w-8 h-8 mx-auto animate-spin text-muted-foreground" }),
                      s[11] ||
                        (s[11] = e(
                          "p",
                          { class: "mt-2 text-muted-foreground" },
                          "Loading user data...",
                          -1,
                        )),
                    ]))
                  : (l(),
                    n("div", is, [
                      t(g)
                        ? (l(),
                          n("div", ls, [
                            s[12] || (s[12] = e("p", { class: "font-medium" }, "Error:", -1)),
                            e("p", null, p(t(g)), 1),
                            e(
                              "button",
                              {
                                onClick: s[1] || (s[1] = (r) => t(P).go(0)),
                                class: "text-sm underline mt-2",
                              },
                              "Coba lagi/Refresh",
                            ),
                          ]))
                        : m("", !0),
                      e(
                        "form",
                        { onSubmit: Q(M, ["prevent"]), class: "card-elevated p-6 space-y-6" },
                        [
                          e("div", ns, [
                            e("div", ds, [
                              s[13] ||
                                (s[13] = e("label", { class: "text-sm font-medium" }, "Nama", -1)),
                              v(
                                e(
                                  "input",
                                  {
                                    "onUpdate:modelValue": s[2] || (s[2] = (r) => (t(o).name = r)),
                                    type: "text",
                                    placeholder: "Nama lengkap",
                                    class: y(["input-field", { "border-red-500": t(i).name }]),
                                  },
                                  null,
                                  2,
                                ),
                                [[_, t(o).name]],
                              ),
                              t(i).name ? (l(), n("p", us, p(t(i).name), 1)) : m("", !0),
                            ]),
                            e("div", ms, [
                              s[14] ||
                                (s[14] = e("label", { class: "text-sm font-medium" }, "Email", -1)),
                              v(
                                e(
                                  "input",
                                  {
                                    "onUpdate:modelValue": s[3] || (s[3] = (r) => (t(o).email = r)),
                                    type: "email",
                                    placeholder: "email@example.com",
                                    class: y(["input-field", { "border-red-500": t(i).email }]),
                                  },
                                  null,
                                  2,
                                ),
                                [[_, t(o).email]],
                              ),
                              t(i).email ? (l(), n("p", ps, p(t(i).email), 1)) : m("", !0),
                            ]),
                            e("div", cs, [
                              s[17] ||
                                (s[17] = e(
                                  "p",
                                  { class: "text-sm font-medium mb-4 text-muted-foreground" },
                                  "Ubah Password (Optional)",
                                  -1,
                                )),
                              e("div", fs, [
                                e("div", vs, [
                                  s[15] ||
                                    (s[15] = e(
                                      "label",
                                      { class: "text-sm font-medium" },
                                      "Password Baru",
                                      -1,
                                    )),
                                  v(
                                    e(
                                      "input",
                                      {
                                        "onUpdate:modelValue":
                                          s[4] || (s[4] = (r) => (t(o).password = r)),
                                        type: "password",
                                        placeholder: "Biarkan kosong jika tidak diubah",
                                        class: y([
                                          "input-field",
                                          { "border-red-500": t(i).password },
                                        ]),
                                      },
                                      null,
                                      2,
                                    ),
                                    [[_, t(o).password]],
                                  ),
                                  t(i).password
                                    ? (l(), n("p", bs, p(t(i).password), 1))
                                    : m("", !0),
                                ]),
                                e("div", gs, [
                                  s[16] ||
                                    (s[16] = e(
                                      "label",
                                      { class: "text-sm font-medium" },
                                      "Konfirmasi Password",
                                      -1,
                                    )),
                                  v(
                                    e(
                                      "input",
                                      {
                                        "onUpdate:modelValue":
                                          s[5] || (s[5] = (r) => (t(o).confirmPassword = r)),
                                        type: "password",
                                        placeholder: "Ulangi password baru",
                                        class: y([
                                          "input-field",
                                          { "border-red-500": t(i).confirmPassword },
                                        ]),
                                      },
                                      null,
                                      2,
                                    ),
                                    [[_, t(o).confirmPassword]],
                                  ),
                                  t(i).confirmPassword
                                    ? (l(), n("p", ws, p(t(i).confirmPassword), 1))
                                    : m("", !0),
                                ]),
                              ]),
                            ]),
                            e("div", xs, [
                              s[19] ||
                                (s[19] = e("label", { class: "text-sm font-medium" }, "Role", -1)),
                              v(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue": s[6] || (s[6] = (r) => (t(o).role = r)),
                                    class: y(["input-field", { "border-red-500": t(i).role }]),
                                  },
                                  [
                                    s[18] || (s[18] = e("option", { value: "" }, "Pilih role", -1)),
                                    (l(!0),
                                    n(
                                      A,
                                      null,
                                      W(
                                        t(D),
                                        (r) => (
                                          l(),
                                          n(
                                            "option",
                                            { key: r.id, value: r.code },
                                            p(r.name),
                                            9,
                                            ys,
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ],
                                  2,
                                ),
                                [[j, t(o).role]],
                              ),
                              t(i).role ? (l(), n("p", ks, p(t(i).role), 1)) : m("", !0),
                            ]),
                            e("div", hs, [
                              s[21] ||
                                (s[21] = e(
                                  "label",
                                  { class: "text-sm font-medium" },
                                  "Status",
                                  -1,
                                )),
                              v(
                                e(
                                  "select",
                                  {
                                    "onUpdate:modelValue":
                                      s[7] || (s[7] = (r) => (t(o).status = r)),
                                    class: "input-field",
                                  },
                                  [
                                    ...(s[20] ||
                                      (s[20] = [
                                        e("option", { value: "active" }, "Aktif", -1),
                                        e("option", { value: "inactive" }, "Tidak Aktif", -1),
                                      ])),
                                  ],
                                  512,
                                ),
                                [[j, t(o).status]],
                              ),
                            ]),
                          ]),
                          e("div", _s, [
                            f(
                              d,
                              { to: `/settings/users/${t(c)}`, class: "btn-secondary" },
                              {
                                default: V(() => [...(s[22] || (s[22] = [U("Batal", -1)]))]),
                                _: 1,
                              },
                              8,
                              ["to"],
                            ),
                            e(
                              "button",
                              { type: "submit", disabled: t(h), class: "btn-primary" },
                              [
                                t(h)
                                  ? (l(), S(t(C), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                                  : (l(), S(t(J), { key: 1, class: "w-4 h-4 mr-2" })),
                                s[23] || (s[23] = U(" Simpan Perubahan ", -1)),
                              ],
                              8,
                              Ps,
                            ),
                          ]),
                        ],
                        32,
                      ),
                    ])),
              ]),
              t(w)
                ? (l(),
                  n("div", Us, [
                    e("div", Cs, [
                      e("div", Ss, [
                        e("div", Ts, [f(t(Z), { class: "w-6 h-6" })]),
                        s[24] ||
                          (s[24] = e("h3", { class: "text-lg font-semibold" }, "Hapus User?", -1)),
                      ]),
                      s[25] ||
                        (s[25] = e(
                          "p",
                          { class: "text-muted-foreground mb-6" },
                          " Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan. ",
                          -1,
                        )),
                      e("div", Vs, [
                        e(
                          "button",
                          {
                            type: "button",
                            onClick: s[8] || (s[8] = (r) => (w.value = !1)),
                            class: "btn-secondary",
                            disabled: t(x),
                          },
                          " Batal ",
                          8,
                          js,
                        ),
                        e(
                          "button",
                          { type: "button", onClick: F, class: "btn-destructive", disabled: t(x) },
                          [
                            t(x)
                              ? (l(), S(t(C), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                              : (l(), n("span", Bs, "Ya, Hapus")),
                          ],
                          8,
                          As,
                        ),
                      ]),
                    ]),
                  ]))
                : m("", !0),
            ],
            64,
          )
        );
      };
    },
  });
export { Fs as default };
