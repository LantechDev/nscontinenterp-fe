import { _ as O } from "./Cv6YVZ0L.js";
import {
  c as j,
  e as L,
  ad as T,
  r as v,
  ao as N,
  R as m,
  Q as e,
  S as x,
  K as t,
  T as c,
  a2 as b,
  U as p,
  V as y,
  W as g,
  $ as S,
  O as I,
  Z as P,
  Y as R,
  _ as r,
} from "./D9q6143x.js";
import { u as E } from "./BfskLp3w.js";
import { M as D } from "./BGAbB0k0.js";
import { P as F } from "./DLVTjFfJ.js";
import { M as K } from "./DvCSiYg8.js";
import { F as Y } from "./CJ5hAAEc.js";
import { S as G } from "./CfuPgfv3.js";
import { o as W, s as f, l as J } from "./8kB48tSz.js";
const Q = j("building", [
    ["path", { d: "M12 10h.01", key: "1nrarc" }],
    ["path", { d: "M12 14h.01", key: "1etili" }],
    ["path", { d: "M12 6h.01", key: "1vi96p" }],
    ["path", { d: "M16 10h.01", key: "1m94wz" }],
    ["path", { d: "M16 14h.01", key: "1gbofw" }],
    ["path", { d: "M16 6h.01", key: "1x0f13" }],
    ["path", { d: "M8 10h.01", key: "19clt8" }],
    ["path", { d: "M8 14h.01", key: "6423bh" }],
    ["path", { d: "M8 6h.01", key: "1dz90k" }],
    ["path", { d: "M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3", key: "cabbwy" }],
    ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2", key: "1uxh74" }],
  ]),
  Z = { class: "space-y-6 animate-fade-in p-6" },
  $ = { key: 0, class: "bg-green-50 text-green-700 p-4 rounded-lg border border-green-200" },
  q = { key: 1, class: "bg-red-50 text-red-600 p-4 rounded-lg border border-red-200" },
  H = { class: "card-elevated p-6" },
  ee = { class: "flex items-center gap-3 mb-6 pb-4 border-b border-border" },
  te = {
    class: "w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]",
  },
  ae = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  se = { class: "space-y-2" },
  ne = { key: 0, class: "text-xs text-red-500" },
  oe = { class: "space-y-2" },
  le = ["readonly"],
  ie = { key: 0, class: "text-xs text-red-500" },
  de = { class: "text-[10px] text-muted-foreground" },
  re = { class: "col-span-1 md:col-span-2 space-y-2" },
  ue = { class: "flex gap-4 items-center" },
  me = {
    key: 0,
    class: "w-12 h-12 rounded border border-border overflow-hidden bg-white flex-shrink-0",
  },
  ce = { class: "card-elevated p-6" },
  pe = { class: "flex items-center gap-3 mb-6 pb-4 border-b border-border" },
  ge = {
    class: "w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]",
  },
  fe = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  he = { class: "col-span-1 md:col-span-2 space-y-2" },
  ve = { class: "space-y-2" },
  xe = { class: "text-sm font-medium flex items-center gap-2" },
  be = { class: "space-y-2" },
  ye = { class: "text-sm font-medium flex items-center gap-2" },
  ke = { key: 0, class: "text-xs text-red-500" },
  _e = { class: "space-y-2" },
  we = { class: "text-sm font-medium flex items-center gap-2" },
  Se = { class: "flex justify-end pt-4" },
  Te = ["disabled"],
  je = L({
    __name: "index",
    setup(Ie) {
      const {
          session: w,
          fetchSession: M,
          updateOrganization: X,
          createOrganization: U,
          setActiveOrganization: V,
        } = T(),
        { confirm: A } = E(),
        h = v(!1),
        k = v(""),
        _ = v(""),
        o = v(!1),
        z = W({
          name: f().min(1, "Nama Tenant wajib diisi"),
          slug: f().min(1, "Slug wajib diisi"),
          logo: f().optional(),
          address: f().optional(),
          phone: f().optional(),
          email: f().email("Format email tidak valid").optional().or(J("")),
          taxId: f().optional(),
        }),
        n = v({ name: "", slug: "", logo: "", address: "", phone: "", email: "", taxId: "" }),
        i = v({}),
        C = async () => {
          if (!n.value.name) {
            h.value = !0;
            try {
              const { listOrganizations: u } = T(),
                a = await u();
              if (a.success && a.data) {
                const l = w.value?.activeOrganizationId,
                  s = a.data.find((d) => d.id === l);
                s &&
                  (n.value = {
                    name: s.name,
                    slug: s.slug,
                    logo: s.logo || "",
                    address: s.metadata?.address || "",
                    phone: s.metadata?.phone || "",
                    email: s.metadata?.email || "",
                    taxId: s.metadata?.taxId || "",
                  });
              }
            } catch (u) {
              console.error("Failed to load organization data", u);
            } finally {
              h.value = !1;
            }
          }
        };
      N(() => {
        w.value?.activeOrganizationId ? ((o.value = !0), C()) : (o.value = !1);
      });
      const B = async () => {
        ((i.value = {}),
          (_.value = ""),
          (k.value = ""),
          console.log("TenantSettings: handleSubmit triggered", { isEditing: o.value }));
        const u = z.safeParse(n.value);
        if (!u.success) {
          (console.warn("TenantSettings: Validation failed", u.error),
            u.error.issues.forEach((l) => {
              l.path[0] && (i.value[l.path[0].toString()] = l.message);
            }));
          return;
        }
        if (
          !(await A({
            title: o.value ? "Simpan Perubahan?" : "Buat Tenant Baru?",
            message: o.value
              ? "Apakah Anda yakin ingin menyimpan perubahan pada profil Tenant ini?"
              : "Apakah Anda yakin ingin membuat tenant baru ini?",
            confirmText: o.value ? "Ya, Simpan" : "Ya, Buat",
            cancelText: "Batal",
            type: "info",
          }))
        ) {
          console.log("TenantSettings: Confirmation cancelled");
          return;
        }
        h.value = !0;
        try {
          const l = w.value?.activeOrganizationId,
            s = {
              name: n.value.name,
              slug: n.value.slug,
              logo: n.value.logo || void 0,
              metadata: {
                address: n.value.address,
                phone: n.value.phone,
                email: n.value.email,
                taxId: n.value.taxId,
              },
            };
          let d;
          if (o.value) {
            if (!l) throw new Error("Tidak ada organisasi yang aktif untuk diedit");
            (console.log("TenantSettings: Updating tenant", s), (d = await X(l, s)));
          } else (console.log("TenantSettings: Creating tenant", s), (d = await U(s)));
          (console.log("TenantSettings: Result", d),
            d.success
              ? ((_.value = o.value
                  ? "Data tenant berhasil diperbarui."
                  : "Tenant berhasil dibuat."),
                !o.value && d.data?.id ? await V(d.data.id) : await M())
              : (k.value =
                  d.error || (o.value ? "Gagal mengupdate tenant." : "Gagal membuat tenant.")));
        } catch (l) {
          const s = l;
          (console.error("TenantSettings: Error", s),
            (k.value = s.message || "Terjadi kesalahan sistem."));
        } finally {
          h.value = !1;
        }
      };
      return (u, a) => {
        const l = O;
        return (
          r(),
          m("div", Z, [
            a[16] ||
              (a[16] = e(
                "div",
                { class: "flex items-center justify-between" },
                [
                  e("div", null, [
                    e("h1", { class: "text-2xl font-bold" }, "Tenant Settings"),
                    e(
                      "p",
                      { class: "text-muted-foreground mt-1" },
                      " Kelola informasi perusahaan dan profil organisasi Anda. ",
                    ),
                  ]),
                ],
                -1,
              )),
            t(_) ? (r(), m("div", $, c(t(_)), 1)) : x("", !0),
            t(k) ? (r(), m("div", q, c(t(k)), 1)) : x("", !0),
            e(
              "form",
              { onSubmit: R(B, ["prevent"]), class: "space-y-8" },
              [
                e("div", H, [
                  e("div", ee, [
                    e("div", te, [b(t(Q), { class: "w-5 h-5" })]),
                    a[7] ||
                      (a[7] = e(
                        "div",
                        null,
                        [
                          e("h2", { class: "text-lg font-bold" }, "Informasi Umum"),
                          e(
                            "p",
                            { class: "text-sm text-muted-foreground" },
                            "Profil dasar organisasi",
                          ),
                        ],
                        -1,
                      )),
                  ]),
                  e("div", ae, [
                    e("div", se, [
                      a[8] ||
                        (a[8] = e(
                          "label",
                          { class: "text-sm font-medium" },
                          [y("Nama Tenant "), e("span", { class: "text-red-500" }, "*")],
                          -1,
                        )),
                      p(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": a[0] || (a[0] = (s) => (t(n).name = s)),
                            type: "text",
                            placeholder: "Contoh: NS Continent",
                            class: S(["input-field", { "border-red-500": t(i).name }]),
                          },
                          null,
                          2,
                        ),
                        [[g, t(n).name]],
                      ),
                      t(i).name ? (r(), m("p", ne, c(t(i).name), 1)) : x("", !0),
                    ]),
                    e("div", oe, [
                      a[9] ||
                        (a[9] = e(
                          "label",
                          { class: "text-sm font-medium" },
                          [y("Slug "), e("span", { class: "text-red-500" }, "*")],
                          -1,
                        )),
                      p(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": a[1] || (a[1] = (s) => (t(n).slug = s)),
                            type: "text",
                            placeholder: "ns-continent",
                            class: S([
                              "input-field",
                              { "bg-muted/50": t(o), "border-red-500": t(i).slug },
                            ]),
                            readonly: t(o),
                            title: "Slug digunakan untuk identifikasi URL",
                          },
                          null,
                          10,
                          le,
                        ),
                        [[g, t(n).slug]],
                      ),
                      t(i).slug ? (r(), m("p", ie, c(t(i).slug), 1)) : x("", !0),
                      e(
                        "p",
                        de,
                        " Slug digunakan untuk identifikasi URL dan sistem. " +
                          c(t(o) ? "(Read-only)" : "(Auto-generated from name)"),
                        1,
                      ),
                    ]),
                    e("div", re, [
                      a[10] ||
                        (a[10] = e("label", { class: "text-sm font-medium" }, "Logo URL", -1)),
                      e("div", ue, [
                        t(n).logo
                          ? (r(),
                            m("div", me, [
                              b(
                                l,
                                {
                                  src: t(n).logo,
                                  alt: "Logo",
                                  class: "w-full h-full object-contain",
                                },
                                null,
                                8,
                                ["src"],
                              ),
                            ]))
                          : x("", !0),
                        p(
                          e(
                            "input",
                            {
                              "onUpdate:modelValue": a[2] || (a[2] = (s) => (t(n).logo = s)),
                              type: "text",
                              placeholder: "https://...",
                              class: "input-field",
                            },
                            null,
                            512,
                          ),
                          [[g, t(n).logo]],
                        ),
                      ]),
                    ]),
                  ]),
                ]),
                e("div", ce, [
                  e("div", pe, [
                    e("div", ge, [b(t(D), { class: "w-5 h-5" })]),
                    a[11] ||
                      (a[11] = e(
                        "div",
                        null,
                        [
                          e("h2", { class: "text-lg font-bold" }, "Kontak & Alamat"),
                          e(
                            "p",
                            { class: "text-sm text-muted-foreground" },
                            "Informasi detail untuk dokumen dan footer",
                          ),
                        ],
                        -1,
                      )),
                  ]),
                  e("div", fe, [
                    e("div", he, [
                      a[12] ||
                        (a[12] = e(
                          "label",
                          { class: "text-sm font-medium" },
                          "Alamat Lengkap",
                          -1,
                        )),
                      p(
                        e(
                          "textarea",
                          {
                            "onUpdate:modelValue": a[3] || (a[3] = (s) => (t(n).address = s)),
                            rows: "3",
                            placeholder: "Jl. Raya...",
                            class: "input-field",
                          },
                          null,
                          512,
                        ),
                        [[g, t(n).address]],
                      ),
                    ]),
                    e("div", ve, [
                      e("label", xe, [
                        b(t(F), { class: "w-3.5 h-3.5" }),
                        a[13] || (a[13] = y(" Telepon ", -1)),
                      ]),
                      p(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": a[4] || (a[4] = (s) => (t(n).phone = s)),
                            type: "text",
                            placeholder: "+62...",
                            class: "input-field",
                          },
                          null,
                          512,
                        ),
                        [[g, t(n).phone]],
                      ),
                    ]),
                    e("div", be, [
                      e("label", ye, [
                        b(t(K), { class: "w-3.5 h-3.5" }),
                        a[14] || (a[14] = y(" Email Resmi ", -1)),
                      ]),
                      p(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": a[5] || (a[5] = (s) => (t(n).email = s)),
                            type: "email",
                            placeholder: "contact@company.com",
                            class: S(["input-field", { "border-red-500": t(i).email }]),
                          },
                          null,
                          2,
                        ),
                        [[g, t(n).email]],
                      ),
                      t(i).email ? (r(), m("p", ke, c(t(i).email), 1)) : x("", !0),
                    ]),
                    e("div", _e, [
                      e("label", we, [
                        b(t(Y), { class: "w-3.5 h-3.5" }),
                        a[15] || (a[15] = y(" Tax ID (NPWP) ", -1)),
                      ]),
                      p(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue": a[6] || (a[6] = (s) => (t(n).taxId = s)),
                            type: "text",
                            placeholder: "XX.XXX.XXX.X-XXX.XXX",
                            class: "input-field",
                          },
                          null,
                          512,
                        ),
                        [[g, t(n).taxId]],
                      ),
                    ]),
                  ]),
                ]),
                e("div", Se, [
                  e(
                    "button",
                    { type: "submit", disabled: t(h), class: "btn-primary min-w-[150px]" },
                    [
                      t(h)
                        ? (r(), I(t(P), { key: 0, class: "w-4 h-4 mr-2 animate-spin" }))
                        : (r(), I(t(G), { key: 1, class: "w-4 h-4 mr-2" })),
                      y(" " + c(t(o) ? "Simpan Perubahan" : "Buat Tenant"), 1),
                    ],
                    8,
                    Te,
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
export { je as default };
