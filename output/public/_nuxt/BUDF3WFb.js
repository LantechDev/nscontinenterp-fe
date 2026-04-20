import { _ as F } from "./DXifQ5ls.js";
import {
  f as P,
  r as u,
  q as M,
  d as O,
  e as z,
  o as q,
  R as l,
  Q as e,
  S as B,
  a2 as g,
  P as K,
  K as s,
  T as S,
  U as D,
  W as I,
  aa as j,
  V as $,
  a0 as Q,
  a1 as W,
  ae as X,
  O as Y,
  _ as i,
} from "./D9q6143x.js";
import { u as G, S as H } from "./DjL8dL1R.js";
import { g as Z } from "./DrxnuvjT.js";
import { P as ee } from "./CWUm5Boh.js";
import { S as te } from "./CfuPgfv3.js";
import { A as se } from "./CdOyNhW7.js";
import { T as oe } from "./DhzAXlPS.js";
import { _ as ne } from "./DlAUqK2U.js";
import "./CpiYPBe4.js";
import "./f0iIvSiy.js";
import "./C0WRWJjF.js";
const E = (r) =>
  !r || r === 0
    ? "Rp 0"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(r);
function re() {
  const r = new Date(),
    x = r.getFullYear().toString().slice(-2),
    c = (r.getMonth() + 1).toString().padStart(2, "0"),
    m = Math.floor(Math.random() * 1e4)
      .toString()
      .padStart(4, "0");
  return `JV/${x}${c}/${m}`;
}
function ae() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
function de(r) {
  r.debit > 0 && (r.credit = 0);
}
function ie(r) {
  r.credit > 0 && (r.debit = 0);
}
function le() {
  const r = O(),
    x = P(),
    {
      accounts: c,
      fetchAccounts: m,
      searchAccounts: C,
      formatAccountDisplay: v,
      isLoading: h,
    } = G(),
    _ = u(!1),
    p = u(!1),
    y = u(null),
    b = u(null),
    w = u(new Date().toISOString().split("T")[0]),
    k = u(""),
    V = u(""),
    a = u([
      { id: "1", accountId: "", debit: 0, credit: 0 },
      { id: "2", accountId: "", debit: 0, credit: 0 },
    ]),
    f = M(() => a.value.reduce((t, n) => t + (n.debit || 0), 0)),
    N = M(() => a.value.reduce((t, n) => t + (n.credit || 0), 0)),
    R = M(() => f.value > 0 && f.value === N.value),
    A = M(() => R.value && a.value.length > 0);
  async function T(t) {
    const n = await C(t.query);
    return n.success && n.data
      ? { success: !0, data: n.data.map((d) => ({ id: d.id, name: v(d) })) }
      : { success: !1, error: n.error };
  }
  function U() {
    a.value.push({ id: ae(), accountId: "", debit: 0, credit: 0 });
  }
  function J(t) {
    a.value.length > 1 && (a.value = a.value.filter((n) => n.id !== t));
  }
  async function o() {
    if (A.value) {
      ((p.value = !0), (y.value = null), (b.value = null));
      try {
        const t = {
          journalDate: w.value,
          referenceNumber: k.value,
          description: V.value,
          entries: a.value
            .filter((n) => n.accountId && (n.debit > 0 || n.credit > 0))
            .map((n) => ({ accountId: n.accountId, debit: n.debit, credit: n.credit })),
        };
        (await $fetch(`${r.public.apiBase}/finance/journal`, {
          method: "POST",
          body: t,
          credentials: "include",
        }),
          (b.value = "Journal entry saved successfully!"),
          setTimeout(() => {
            x.push("/finance/dashboard");
          }, 1500));
      } catch (t) {
        y.value = Z(t);
      } finally {
        p.value = !1;
      }
    }
  }
  return {
    isLoading: _,
    isSaving: p,
    error: y,
    successMessage: b,
    journalDate: w,
    referenceNumber: k,
    description: V,
    entries: a,
    accounts: c,
    isAccountsLoading: h,
    totalDebit: f,
    totalCredit: N,
    isBalanced: R,
    canSave: A,
    handleAccountSearch: T,
    addRow: U,
    removeRow: J,
    handleDebitChange: de,
    handleCreditChange: ie,
    saveJournalEntry: o,
    initialize: async () => {
      (await m(), (k.value = re()));
    },
  };
}
const ue = { class: "space-y-6 animate-fade-in p-6 bg-background min-h-screen" },
  ce = { class: "flex items-center gap-4" },
  pe = {
    key: 0,
    class:
      "bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in",
  },
  me = {
    key: 1,
    class:
      "bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm animate-fade-in",
  },
  be = { class: "card-elevated p-8 space-y-8 bg-card shadow-soft border-border" },
  fe = { class: "grid grid-cols-1 md:grid-cols-3 gap-8" },
  ge = { class: "space-y-2" },
  xe = { class: "space-y-2" },
  ve = { class: "space-y-2" },
  he = { class: "space-y-4 pt-4 border-t border-border" },
  _e = { class: "flex items-center justify-between" },
  ye = { class: "overflow-x-auto rounded-lg border border-border" },
  we = { class: "data-table w-full border-collapse" },
  ke = { class: "divide-y divide-border" },
  Se = { class: "text-center text-sm text-muted-foreground" },
  De = { class: "py-3 px-4" },
  Ie = { class: "py-3 px-4" },
  Ce = { class: "relative group" },
  Ve = ["onUpdate:modelValue", "disabled", "onInput"],
  Ne = { class: "py-3 px-4" },
  Re = { class: "relative group" },
  Ae = ["onUpdate:modelValue", "disabled", "onInput"],
  Te = { class: "py-3 px-2 text-center" },
  Me = ["disabled", "onClick"],
  Be = { class: "bg-muted/30 font-medium" },
  Ue = { class: "py-4 px-4 text-right text-sm font-bold text-foreground" },
  je = { class: "py-4 px-4 text-right text-sm font-bold text-foreground" },
  $e = { class: "flex justify-center pt-4" },
  Je = {
    key: 0,
    class: "badge-success px-8 py-2 text-sm font-medium rounded-full shadow-sm animate-fade-in",
  },
  Le = {
    key: 1,
    class:
      "inline-flex items-center px-8 py-2 rounded-full text-sm font-medium bg-warning/10 text-warning border border-warning/20",
  },
  Ee = { class: "flex justify-end gap-3 pt-6 border-t border-border" },
  Pe = ["disabled"],
  Fe = { key: 1 },
  Oe = { key: 2 },
  ze = z({
    __name: "create",
    setup(r) {
      const x = P(),
        {
          isSaving: c,
          error: m,
          successMessage: C,
          journalDate: v,
          referenceNumber: h,
          description: _,
          entries: p,
          isAccountsLoading: y,
          totalDebit: b,
          totalCredit: w,
          isBalanced: k,
          canSave: V,
          handleAccountSearch: a,
          addRow: f,
          removeRow: N,
          handleDebitChange: R,
          handleCreditChange: A,
          saveJournalEntry: T,
          initialize: U,
        } = le();
      return (
        q(() => {
          U();
        }),
        (J, o) => {
          const L = F;
          return (
            i(),
            l("div", ue, [
              e("div", ce, [
                g(
                  L,
                  {
                    to: "/finance/dashboard",
                    class:
                      "p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                  },
                  { default: K(() => [g(s(se), { class: "w-6 h-6" })]), _: 1 },
                ),
                o[6] ||
                  (o[6] = e(
                    "div",
                    null,
                    [
                      e("h1", { class: "page-title text-foreground" }, "Jurnal Manual"),
                      e(
                        "p",
                        { class: "text-sm text-muted-foreground" },
                        "Buat entri jurnal debit/kredit secara manual",
                      ),
                    ],
                    -1,
                  )),
              ]),
              s(m) ? (i(), l("div", pe, S(s(m)), 1)) : B("", !0),
              s(C) ? (i(), l("div", me, S(s(C)), 1)) : B("", !0),
              e("div", be, [
                e("div", fe, [
                  e("div", ge, [
                    o[7] ||
                      (o[7] = e(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        "Tanggal",
                        -1,
                      )),
                    D(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            o[0] || (o[0] = (t) => (j(v) ? (v.value = t) : null)),
                          type: "date",
                          class: "input-field",
                        },
                        null,
                        512,
                      ),
                      [[I, s(v)]],
                    ),
                  ]),
                  e("div", xe, [
                    o[8] ||
                      (o[8] = e(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        "Referensi (Invoice/PO)",
                        -1,
                      )),
                    D(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            o[1] || (o[1] = (t) => (j(h) ? (h.value = t) : null)),
                          type: "text",
                          placeholder: "No. Referensi...",
                          class: "input-field",
                        },
                        null,
                        512,
                      ),
                      [[I, s(h)]],
                    ),
                  ]),
                  e("div", ve, [
                    o[9] ||
                      (o[9] = e(
                        "label",
                        { class: "text-sm font-medium text-foreground" },
                        [$("Deskripsi "), e("span", { class: "text-destructive" }, "*")],
                        -1,
                      )),
                    D(
                      e(
                        "input",
                        {
                          "onUpdate:modelValue":
                            o[2] || (o[2] = (t) => (j(_) ? (_.value = t) : null)),
                          type: "text",
                          placeholder: "Deskripsi jurnal",
                          class: "input-field",
                        },
                        null,
                        512,
                      ),
                      [[I, s(_)]],
                    ),
                  ]),
                ]),
                e("div", he, [
                  e("div", _e, [
                    o[11] ||
                      (o[11] = e(
                        "h2",
                        { class: "text-lg font-bold text-foreground" },
                        "Detail Entry",
                        -1,
                      )),
                    e(
                      "button",
                      {
                        type: "button",
                        class: "btn-outline border-border text-foreground hover:bg-muted py-2",
                        onClick: o[3] || (o[3] = (...t) => s(f) && s(f)(...t)),
                      },
                      [
                        g(s(ee), { class: "w-4 h-4 mr-2" }),
                        o[10] || (o[10] = $(" Tambah Baris ", -1)),
                      ],
                    ),
                  ]),
                  e("div", ye, [
                    e("table", we, [
                      o[14] ||
                        (o[14] = e(
                          "thead",
                          null,
                          [
                            e("tr", { class: "bg-muted/50 border-b border-border" }, [
                              e(
                                "th",
                                { class: "w-12 text-center text-xs font-semibold py-4" },
                                "No",
                              ),
                              e(
                                "th",
                                { class: "text-left py-4 px-4 text-xs font-semibold" },
                                "Akun",
                              ),
                              e(
                                "th",
                                { class: "w-40 text-right py-4 px-4 text-xs font-semibold" },
                                "Debit",
                              ),
                              e(
                                "th",
                                { class: "w-40 text-right py-4 px-4 text-xs font-semibold" },
                                "Kredit",
                              ),
                              e(
                                "th",
                                { class: "w-16 text-center py-4 px-2 text-xs font-semibold" },
                                "Aksi",
                              ),
                            ]),
                          ],
                          -1,
                        )),
                      e("tbody", ke, [
                        (i(!0),
                        l(
                          Q,
                          null,
                          W(
                            s(p),
                            (t, n) => (
                              i(),
                              l("tr", { key: t.id, class: "hover:bg-muted/20 transition-colors" }, [
                                e("td", Se, S(n + 1), 1),
                                e("td", De, [
                                  g(
                                    H,
                                    {
                                      modelValue: t.accountId,
                                      "onUpdate:modelValue": (d) => (t.accountId = d),
                                      "fetch-options": s(a),
                                      placeholder: "Pilih akun...",
                                      disabled: s(y),
                                    },
                                    null,
                                    8,
                                    [
                                      "modelValue",
                                      "onUpdate:modelValue",
                                      "fetch-options",
                                      "disabled",
                                    ],
                                  ),
                                ]),
                                e("td", Ie, [
                                  e("div", Ce, [
                                    D(
                                      e(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (d) => (t.debit = d),
                                          type: "number",
                                          min: "0",
                                          step: "0.01",
                                          class:
                                            "w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50",
                                          disabled: t.credit > 0,
                                          onInput: (d) => s(R)(t),
                                        },
                                        null,
                                        40,
                                        Ve,
                                      ),
                                      [[I, t.debit, void 0, { number: !0 }]],
                                    ),
                                  ]),
                                ]),
                                e("td", Ne, [
                                  e("div", Re, [
                                    D(
                                      e(
                                        "input",
                                        {
                                          "onUpdate:modelValue": (d) => (t.credit = d),
                                          type: "number",
                                          min: "0",
                                          step: "0.01",
                                          class:
                                            "w-full h-10 px-4 text-right bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:bg-muted/50",
                                          disabled: t.debit > 0,
                                          onInput: (d) => s(A)(t),
                                        },
                                        null,
                                        40,
                                        Ae,
                                      ),
                                      [[I, t.credit, void 0, { number: !0 }]],
                                    ),
                                  ]),
                                ]),
                                e("td", Te, [
                                  e(
                                    "button",
                                    {
                                      type: "button",
                                      class:
                                        "p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
                                      disabled: s(p).length <= 1,
                                      onClick: (d) => s(N)(t.id),
                                    },
                                    [g(s(oe), { class: "w-4 h-4" })],
                                    8,
                                    Me,
                                  ),
                                ]),
                              ])
                            ),
                          ),
                          128,
                        )),
                      ]),
                      e("tfoot", null, [
                        e("tr", Be, [
                          o[12] ||
                            (o[12] = e(
                              "td",
                              {
                                colspan: "2",
                                class: "py-4 px-4 text-sm text-foreground font-bold",
                              },
                              "Total",
                              -1,
                            )),
                          e("td", Ue, S(s(E)(s(b))), 1),
                          e("td", je, S(s(E)(s(w))), 1),
                          o[13] || (o[13] = e("td", null, null, -1)),
                        ]),
                      ]),
                    ]),
                  ]),
                  e("div", $e, [
                    s(k)
                      ? (i(), l("span", Je, " Seimbang "))
                      : s(p).some((t) => t.accountId) && s(b) !== s(w)
                        ? (i(), l("span", Le, " Tidak Seimbang "))
                        : B("", !0),
                  ]),
                ]),
                e("div", Ee, [
                  e(
                    "button",
                    {
                      type: "button",
                      class: "btn-outline border-border text-foreground py-2.5",
                      onClick: o[4] || (o[4] = (t) => s(x).back()),
                    },
                    [g(s(X), { class: "w-4 h-4 mr-2" }), o[15] || (o[15] = $(" Batal ", -1))],
                  ),
                  e(
                    "button",
                    {
                      type: "button",
                      class: "btn-primary py-2.5 px-8",
                      disabled: !s(V) || s(c),
                      onClick: o[5] || (o[5] = (...t) => s(T) && s(T)(...t)),
                    },
                    [
                      s(c)
                        ? B("", !0)
                        : (i(),
                          Y(s(te), { key: 0, class: "w-4 h-4 mr-2 text-primary-foreground" })),
                      s(c)
                        ? (i(), l("span", Fe, "Menyimpan..."))
                        : (i(), l("span", Oe, "Simpan Jurnal")),
                    ],
                    8,
                    Pe,
                  ),
                ]),
              ]),
            ])
          );
        }
      );
    },
  }),
  ot = ne(ze, [["__scopeId", "data-v-477296e7"]]);
export { ot as default };
