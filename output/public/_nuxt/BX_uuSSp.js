import { _ as F } from "./DXifQ5ls.js";
import {
  c as Y,
  f as O,
  r as o,
  q,
  d as K,
  e as X,
  o as E,
  R as m,
  Q as t,
  S as I,
  a2 as f,
  P as G,
  K as s,
  T as P,
  U as V,
  W as D,
  aa as k,
  V as U,
  $ as H,
  Y as J,
  ae as $,
  O as W,
  _ as l,
} from "./D9q6143x.js";
import { u as Q, S as j } from "./DjL8dL1R.js";
import { g as Z } from "./DrxnuvjT.js";
import { S as ee } from "./CfuPgfv3.js";
import { A as te } from "./CdOyNhW7.js";
import { _ as se } from "./DlAUqK2U.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./C0WRWJjF.js";
const ae = Y("upload", [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
]);
function oe() {
  const R = K(),
    B = O(),
    {
      accounts: h,
      fetchAccounts: T,
      searchAccounts: w,
      formatAccountDisplay: S,
      isLoading: _,
    } = Q(),
    d = o(!1),
    r = o(null),
    u = o(null),
    v = o(new Date().toISOString().split("T")[0]),
    c = o(""),
    g = o(""),
    b = o(0),
    x = o(""),
    y = o(""),
    i = o(""),
    A = q(() => x.value && y.value && b.value > 0 && g.value.trim().length > 0);
  async function C(a) {
    const p = await w(a.query);
    return p.success && p.data
      ? { success: !0, data: p.data.map((n) => ({ id: n.id, name: S(n) })) }
      : { success: !1, error: p.error };
  }
  async function M(a) {
    const n = a.target.files?.[0];
    if (n) {
      if (!n.type.startsWith("image/") && n.type !== "application/pdf") {
        r.value = "Hanya file gambar atau PDF yang diperbolehkan";
        return;
      }
      if (n.size > 5 * 1024 * 1024) {
        r.value = "Ukuran file maksimal 5MB";
        return;
      }
      i.value = URL.createObjectURL(n);
    }
  }
  function L() {
    i.value && (URL.revokeObjectURL(i.value), (i.value = ""));
  }
  async function e() {
    if (A.value) {
      ((d.value = !0), (r.value = null), (u.value = null));
      try {
        const a = {
          journalDate: v.value,
          referenceNumber: c.value,
          description: g.value,
          attachmentUrl: i.value,
          entries: [
            { accountId: x.value, debit: b.value, credit: 0 },
            { accountId: y.value, debit: 0, credit: b.value },
          ],
        };
        (await $fetch(`${R.public.apiBase}/finance/journal`, {
          method: "POST",
          body: a,
          credentials: "include",
        }),
          (u.value = "Transaksi berhasil disimpan!"),
          setTimeout(() => {
            B.push("/finance/dashboard");
          }, 1500));
      } catch (a) {
        r.value = Z(a);
      } finally {
        d.value = !1;
      }
    }
  }
  return {
    isSaving: d,
    error: r,
    successMessage: u,
    transactionDate: v,
    referenceNumber: c,
    description: g,
    amount: b,
    debitAccountId: x,
    creditAccountId: y,
    attachmentUrl: i,
    accounts: h,
    isAccountsLoading: _,
    canSave: A,
    handleAccountSearch: C,
    handleFileUpload: M,
    removeAttachment: L,
    saveTransaction: e,
    initialize: async () => {
      await T();
      const a = new Date(),
        p = a.getFullYear().toString().slice(-2),
        n = (a.getMonth() + 1).toString().padStart(2, "0"),
        z = Math.floor(Math.random() * 1e4)
          .toString()
          .padStart(4, "0");
      c.value = `TRX/${p}${n}/${z}`;
    },
  };
}
const ne = { class: "space-y-6 animate-fade-in p-6 bg-background min-h-screen" },
  re = { class: "flex items-center gap-4" },
  ie = {
    key: 0,
    class:
      "bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in",
  },
  le = {
    key: 1,
    class:
      "bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm animate-fade-in",
  },
  de = { class: "card-elevated p-8 space-y-8 bg-card shadow-soft border-border" },
  ue = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  ce = { class: "space-y-2" },
  pe = { class: "space-y-2" },
  me = { class: "space-y-2" },
  fe = { class: "space-y-2" },
  ve = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  ge = { class: "space-y-2" },
  be = { class: "space-y-2" },
  xe = { class: "space-y-2" },
  ye = { key: 0, class: "flex flex-col items-center gap-2" },
  ke = { key: 1, class: "relative" },
  he = ["src"],
  Se = { class: "flex justify-end gap-3 pt-6 border-t border-border" },
  _e = ["disabled"],
  Ae = { key: 1 },
  Ue = { key: 2 },
  Te = X({
    __name: "create",
    setup(R) {
      const B = O(),
        {
          isSaving: h,
          error: T,
          successMessage: w,
          transactionDate: S,
          referenceNumber: _,
          description: d,
          amount: r,
          debitAccountId: u,
          creditAccountId: v,
          attachmentUrl: c,
          isAccountsLoading: g,
          canSave: b,
          handleAccountSearch: x,
          handleFileUpload: y,
          removeAttachment: i,
          saveTransaction: A,
          initialize: C,
        } = oe(),
        M = o(null);
      return (
        E(() => {
          C();
        }),
        (L, e) => {
          const N = F;
          return (
            l(),
            m("div", ne, [
              t("div", re, [
                f(
                  N,
                  {
                    to: "/finance/dashboard",
                    class:
                      "p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                  },
                  { default: G(() => [f(s(te), { class: "w-6 h-6" })]), _: 1 },
                ),
                e[11] ||
                  (e[11] = t(
                    "div",
                    null,
                    [
                      t("h1", { class: "page-title text-foreground" }, "Buat Transaksi"),
                      t(
                        "p",
                        { class: "text-sm text-muted-foreground" },
                        " Buat transaksi dengan bukti dan akun debit/kredit ",
                      ),
                    ],
                    -1,
                  )),
              ]),
              s(T) ? (l(), m("div", ie, P(s(T)), 1)) : I("", !0),
              s(w) ? (l(), m("div", le, P(s(w)), 1)) : I("", !0),
              t("div", de, [
                t("div", ue, [
                  t("div", ce, [
                    e[12] ||
                      (e[12] = t(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        "Tanggal Transaksi",
                        -1,
                      )),
                    V(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue":
                            e[0] || (e[0] = (a) => (k(S) ? (S.value = a) : null)),
                          type: "date",
                          class: "input-field",
                        },
                        null,
                        512,
                      ),
                      [[D, s(S)]],
                    ),
                  ]),
                  t("div", pe, [
                    e[13] ||
                      (e[13] = t(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        "Nomor Referensi",
                        -1,
                      )),
                    V(
                      t(
                        "input",
                        {
                          "onUpdate:modelValue":
                            e[1] || (e[1] = (a) => (k(_) ? (_.value = a) : null)),
                          type: "text",
                          placeholder: "TRX/YYMM/0001",
                          class: "input-field",
                          readonly: "",
                        },
                        null,
                        512,
                      ),
                      [[D, s(_)]],
                    ),
                  ]),
                ]),
                t("div", me, [
                  e[14] ||
                    (e[14] = t(
                      "label",
                      { class: "text-sm font-medium text-foreground" },
                      [U(" Deskripsi "), t("span", { class: "text-destructive" }, "*")],
                      -1,
                    )),
                  V(
                    t(
                      "input",
                      {
                        "onUpdate:modelValue":
                          e[2] || (e[2] = (a) => (k(d) ? (d.value = a) : null)),
                        type: "text",
                        placeholder: "Deskripsi transaksi...",
                        class: "input-field",
                      },
                      null,
                      512,
                    ),
                    [[D, s(d)]],
                  ),
                ]),
                t("div", fe, [
                  e[15] ||
                    (e[15] = t(
                      "label",
                      { class: "text-sm font-medium text-foreground" },
                      [U(" Jumlah "), t("span", { class: "text-destructive" }, "*")],
                      -1,
                    )),
                  V(
                    t(
                      "input",
                      {
                        "onUpdate:modelValue":
                          e[3] || (e[3] = (a) => (k(r) ? (r.value = a) : null)),
                        type: "number",
                        min: "0",
                        step: "0.01",
                        placeholder: "0",
                        class: "input-field",
                      },
                      null,
                      512,
                    ),
                    [[D, s(r), void 0, { number: !0 }]],
                  ),
                ]),
                t("div", ve, [
                  t("div", ge, [
                    e[16] ||
                      (e[16] = t(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        [U(" Akun Debit "), t("span", { class: "text-destructive" }, "*")],
                        -1,
                      )),
                    f(
                      j,
                      {
                        modelValue: s(u),
                        "onUpdate:modelValue":
                          e[4] || (e[4] = (a) => (k(u) ? (u.value = a) : null)),
                        "fetch-options": s(x),
                        placeholder: "Pilih akun debit...",
                        disabled: s(g),
                      },
                      null,
                      8,
                      ["modelValue", "fetch-options", "disabled"],
                    ),
                  ]),
                  t("div", be, [
                    e[17] ||
                      (e[17] = t(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        [U(" Akun Kredit "), t("span", { class: "text-destructive" }, "*")],
                        -1,
                      )),
                    f(
                      j,
                      {
                        modelValue: s(v),
                        "onUpdate:modelValue":
                          e[5] || (e[5] = (a) => (k(v) ? (v.value = a) : null)),
                        "fetch-options": s(x),
                        placeholder: "Pilih akun kredit...",
                        disabled: s(g),
                      },
                      null,
                      8,
                      ["modelValue", "fetch-options", "disabled"],
                    ),
                  ]),
                ]),
                t("div", xe, [
                  e[20] ||
                    (e[20] = t(
                      "label",
                      { class: "text-sm font-medium text-foreground" },
                      "Bukti Transaksi",
                      -1,
                    )),
                  t(
                    "div",
                    {
                      class: H([
                        "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors",
                        { "border-primary bg-primary/5": s(c) },
                      ]),
                      onClick: e[8] || (e[8] = (a) => s(M)?.click()),
                    },
                    [
                      t(
                        "input",
                        {
                          ref_key: "fileInput",
                          ref: M,
                          type: "file",
                          accept: "image/*",
                          class: "hidden",
                          onChange: e[6] || (e[6] = (...a) => s(y) && s(y)(...a)),
                        },
                        null,
                        544,
                      ),
                      s(c)
                        ? (l(),
                          m("div", ke, [
                            t(
                              "img",
                              {
                                src: s(c),
                                alt: "Bukti transaksi",
                                class: "max-h-48 mx-auto rounded-lg object-contain",
                              },
                              null,
                              8,
                              he,
                            ),
                            t(
                              "button",
                              {
                                type: "button",
                                class:
                                  "absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90",
                                onClick: e[7] || (e[7] = J((...a) => s(i) && s(i)(...a), ["stop"])),
                              },
                              [f(s($), { class: "w-4 h-4" })],
                            ),
                          ]))
                        : (l(),
                          m("div", ye, [
                            f(s(ae), { class: "w-8 h-8 text-muted-foreground" }),
                            e[18] ||
                              (e[18] = t(
                                "p",
                                { class: "text-sm text-muted-foreground" },
                                "Klik untuk upload bukti transaksi",
                                -1,
                              )),
                            e[19] ||
                              (e[19] = t(
                                "p",
                                { class: "text-xs text-muted-foreground" },
                                "PNG, JPG, atau PDF (maks. 5MB)",
                                -1,
                              )),
                          ])),
                    ],
                    2,
                  ),
                ]),
                t("div", Se, [
                  t(
                    "button",
                    {
                      type: "button",
                      class: "btn-outline border-border text-foreground py-2.5",
                      onClick: e[9] || (e[9] = (a) => s(B).back()),
                    },
                    [f(s($), { class: "w-4 h-4 mr-2" }), e[21] || (e[21] = U(" Batal ", -1))],
                  ),
                  t(
                    "button",
                    {
                      type: "button",
                      class: "btn-primary py-2.5 px-8",
                      disabled: !s(b) || s(h),
                      onClick: e[10] || (e[10] = (...a) => s(A) && s(A)(...a)),
                    },
                    [
                      s(h)
                        ? I("", !0)
                        : (l(),
                          W(s(ee), { key: 0, class: "w-4 h-4 mr-2 text-primary-foreground" })),
                      s(h)
                        ? (l(), m("span", Ae, "Menyimpan..."))
                        : (l(), m("span", Ue, "Simpan Transaksi")),
                    ],
                    8,
                    _e,
                  ),
                ]),
              ]),
            ])
          );
        }
      );
    },
  }),
  Pe = se(Te, [["__scopeId", "data-v-414003fb"]]);
export { Pe as default };
