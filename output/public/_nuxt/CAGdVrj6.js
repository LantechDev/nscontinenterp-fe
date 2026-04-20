import { _ as B } from "./DXifQ5ls.js";
import {
  e as K,
  ab as O,
  f as z,
  ac as Z,
  r as c,
  o as $,
  R as d,
  Q as s,
  a2 as m,
  P as y,
  K as t,
  Z as R,
  S as u,
  T as g,
  Y as F,
  U as w,
  V as f,
  W as A,
  $ as C,
  O as M,
  _ as r,
} from "./D9q6143x.js";
import { PermissionsTable as G } from "./B0pxwXAB.js";
import { S as Q } from "./CfuPgfv3.js";
import { A as H } from "./CdOyNhW7.js";
import { o as J, s as x } from "./8kB48tSz.js";
import "./kUcy7b0j.js";
import "./DrxnuvjT.js";
import "./C0WRWJjF.js";
const W = { class: "space-y-6 animate-fade-in p-6" },
  Y = { class: "page-header" },
  q = { class: "flex items-center gap-4" },
  X = { key: 0, class: "p-12 text-center" },
  ee = { key: 1 },
  se = { key: 0, class: "bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200" },
  te = {
    key: 1,
    class: "bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 mb-6",
  },
  oe = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  ae = { class: "space-y-2" },
  ie = { key: 0, class: "text-xs text-red-500" },
  ne = { class: "space-y-2" },
  re = ["value"],
  le = { key: 0, class: "text-xs text-red-500" },
  de = { class: "col-span-1 md:col-span-2 space-y-2" },
  me = { class: "col-span-1 md:col-span-2 pt-4 border-t border-border" },
  pe = { class: "flex justify-end items-center gap-6 pt-4 border-t border-border" },
  ce = ["disabled"],
  Re = K({
    __name: "edit",
    setup(ue) {
      const N = O(),
        S = z(),
        _ = N.params.id,
        { updateRole: j, roles: P, fetchRoles: I } = Z(),
        v = c(!1),
        k = c(!0),
        p = c(""),
        U = J({
          name: x().min(1, "Nama Role wajib diisi"),
          code: x()
            .min(1, "Kode Role wajib diisi")
            .regex(
              /^[A-Z0-9_]+$/,
              "Kode harus huruf besar, angka, dan underscore (contoh: ADMIN_USER)",
            ),
          description: x().optional(),
        }),
        a = c({ name: "", code: "", description: "", permissions: {} }),
        V = (o) => {
          let i = o.target.value.toUpperCase();
          ((i = i.replace(/[\s-]/g, "_").replace(/[^A-Z0-9_]/g, "")), (a.value.code = i));
        },
        b = ["create", "read", "update", "delete"],
        E = [
          { key: "organization", label: "Organization", description: "Manage company settings" },
          { key: "member", label: "Member", description: "Manage team members" },
          { key: "invitation", label: "Invitation", description: "Manage invites" },
          { key: "job", label: "Job", description: "Operational jobs" },
          { key: "invoice", label: "Invoice", description: "Financial invoices" },
          { key: "payment", label: "Payment", description: "Payment records" },
          { key: "company", label: "Company", description: "Master data companies" },
          { key: "report", label: "Report", description: "View analytical reports" },
        ],
        n = c({}),
        T = (o, e) => {
          a.value.permissions[o] || (a.value.permissions[o] = []);
          const i = a.value.permissions[o];
          i.includes(e)
            ? (a.value.permissions[o] = i.filter((l) => l !== e))
            : a.value.permissions[o].push(e);
        },
        D = (o) => {
          a.value.permissions[o] && a.value.permissions[o].length === b.length
            ? (a.value.permissions[o] = [])
            : (a.value.permissions[o] = [...b]);
        };
      $(async () => {
        try {
          await I();
          const o = P.value.find((e) => e.id === _);
          o
            ? (a.value = {
                name: o.name,
                code: o.code,
                description: o.description || "",
                permissions: o.permissions || {},
              })
            : (p.value = "Role tidak ditemukan.");
        } catch (o) {
          const e = o;
          p.value = e.message || "Gagal memuat data role.";
        } finally {
          k.value = !1;
        }
      });
      const L = async () => {
        n.value = {};
        const o = U.safeParse(a.value);
        if (!o.success) {
          o.error.issues.forEach((e) => {
            e.path[0] && (n.value[e.path[0].toString()] = e.message);
          });
          return;
        }
        v.value = !0;
        try {
          const e = {};
          for (const [l, h] of Object.entries(a.value.permissions)) h.length > 0 && (e[l] = h);
          const i = await j(_, {
            name: a.value.name,
            code: a.value.code,
            description: a.value.description,
            permissions: e,
          });
          if (i.success) S.push("/settings/roles");
          else {
            const l = i;
            n.value.root = l.error || "Gagal mengupdate role.";
          }
        } catch (e) {
          const i = e;
          n.value.root = i.message || "Terjadi kesalahan sistem.";
        } finally {
          v.value = !1;
        }
      };
      return (o, e) => {
        const i = B;
        return (
          r(),
          d("div", W, [
            s("div", Y, [
              s("div", q, [
                m(
                  i,
                  {
                    to: "/settings/roles",
                    class: "p-2 rounded-lg hover:bg-muted transition-colors",
                  },
                  { default: y(() => [m(t(H), { class: "w-5 h-5" })]), _: 1 },
                ),
                e[2] ||
                  (e[2] = s(
                    "div",
                    null,
                    [
                      s("h1", { class: "page-title" }, "Edit Role"),
                      s(
                        "p",
                        { class: "text-muted-foreground mt-1" },
                        "Update informasi dan permission role",
                      ),
                    ],
                    -1,
                  )),
              ]),
            ]),
            t(k)
              ? (r(),
                d("div", X, [
                  m(t(R), { class: "w-8 h-8 mx-auto animate-spin text-muted-foreground" }),
                  e[3] ||
                    (e[3] = s(
                      "p",
                      { class: "mt-2 text-muted-foreground" },
                      "Loading role data...",
                      -1,
                    )),
                ]))
              : (r(),
                d("div", ee, [
                  t(p)
                    ? (r(),
                      d("div", se, [
                        e[5] || (e[5] = s("p", { class: "font-medium" }, "Error:", -1)),
                        s("p", null, g(t(p)), 1),
                        m(
                          i,
                          { to: "/settings/roles", class: "text-sm underline mt-2" },
                          {
                            default: y(() => [
                              ...(e[4] || (e[4] = [f("Kembali ke List Role", -1)])),
                            ]),
                            _: 1,
                          },
                        ),
                      ]))
                    : u("", !0),
                  t(n).root ? (r(), d("div", te, g(t(n).root), 1)) : u("", !0),
                  t(p)
                    ? u("", !0)
                    : (r(),
                      d(
                        "form",
                        {
                          key: 2,
                          onSubmit: F(L, ["prevent"]),
                          class: "card-elevated p-6 space-y-6",
                        },
                        [
                          s("div", oe, [
                            s("div", ae, [
                              e[6] ||
                                (e[6] = s(
                                  "label",
                                  { class: "text-sm font-medium" },
                                  [f("Nama Role "), s("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              w(
                                s(
                                  "input",
                                  {
                                    "onUpdate:modelValue": e[0] || (e[0] = (l) => (t(a).name = l)),
                                    type: "text",
                                    placeholder: "Contoh: Administrator",
                                    class: C(["input-field", { "border-red-500": t(n).name }]),
                                  },
                                  null,
                                  2,
                                ),
                                [[A, t(a).name]],
                              ),
                              t(n).name ? (r(), d("p", ie, g(t(n).name), 1)) : u("", !0),
                            ]),
                            s("div", ne, [
                              e[7] ||
                                (e[7] = s(
                                  "label",
                                  { class: "text-sm font-medium" },
                                  [f("Kode Role "), s("span", { class: "text-red-500" }, "*")],
                                  -1,
                                )),
                              s(
                                "input",
                                {
                                  value: t(a).code,
                                  onInput: V,
                                  type: "text",
                                  placeholder: "Contoh: ADMIN",
                                  class: C([
                                    "input-field uppercase",
                                    { "border-red-500": t(n).code },
                                  ]),
                                },
                                null,
                                42,
                                re,
                              ),
                              e[8] ||
                                (e[8] = s(
                                  "p",
                                  { class: "text-[10px] text-muted-foreground" },
                                  " Hanya huruf besar, angka, dan underscore (UNIQUE). ",
                                  -1,
                                )),
                              t(n).code ? (r(), d("p", le, g(t(n).code), 1)) : u("", !0),
                            ]),
                            s("div", de, [
                              e[9] ||
                                (e[9] = s(
                                  "label",
                                  { class: "text-sm font-medium" },
                                  "Deskripsi",
                                  -1,
                                )),
                              w(
                                s(
                                  "textarea",
                                  {
                                    "onUpdate:modelValue":
                                      e[1] || (e[1] = (l) => (t(a).description = l)),
                                    rows: "2",
                                    placeholder: "Deskripsi singkat tentang role ini...",
                                    class: "input-field",
                                  },
                                  null,
                                  512,
                                ),
                                [[A, t(a).description]],
                              ),
                            ]),
                            s("div", me, [
                              e[10] ||
                                (e[10] = s(
                                  "div",
                                  { class: "flex items-center justify-between mb-4" },
                                  [s("label", { class: "text-sm font-medium" }, "Permissions")],
                                  -1,
                                )),
                              m(
                                t(G),
                                {
                                  permissions: t(a).permissions,
                                  "available-actions": b,
                                  "available-resources": E,
                                  onToggle: T,
                                  onToggleAll: D,
                                },
                                null,
                                8,
                                ["permissions"],
                              ),
                            ]),
                          ]),
                          s("div", pe, [
                            m(
                              i,
                              { to: "/settings/roles", class: "btn-secondary" },
                              {
                                default: y(() => [...(e[11] || (e[11] = [f("Batal", -1)]))]),
                                _: 1,
                              },
                            ),
                            s(
                              "button",
                              { type: "submit", disabled: t(v), class: "btn-primary" },
                              [
                                t(v)
                                  ? (r(), M(t(R), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                                  : (r(), M(t(Q), { key: 1, class: "w-4 h-4 mr-2" })),
                                e[12] || (e[12] = f(" Simpan Perubahan ", -1)),
                              ],
                              8,
                              ce,
                            ),
                          ]),
                        ],
                        32,
                      )),
                ])),
          ])
        );
      };
    },
  });
export { Re as default };
