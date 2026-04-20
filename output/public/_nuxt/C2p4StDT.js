import { _ as H } from "./DXifQ5ls.js";
import { _ as K } from "./Doao-lii.js";
import {
  r as u,
  q,
  N as z,
  t as W,
  e as Y,
  o as J,
  R as i,
  Q as e,
  a2 as r,
  $ as E,
  K as t,
  U as I,
  W as X,
  aa as Z,
  a3 as ee,
  P as te,
  a0 as M,
  S as B,
  a1 as Q,
  O as oe,
  T as l,
  Y as R,
  _ as n,
} from "./D9q6143x.js";
import { c as N } from "./DrxnuvjT.js";
import { u as se } from "./DddWBLY3.js";
import { u as ae } from "./BfskLp3w.js";
import { f as ne } from "./BxSHOl50.js";
import { TaxEditModal as ie } from "./DN89QwQ6.js";
import { L as re, a as le } from "./BopvTZHI.js";
import { S as de } from "./DK0cRrZx.js";
import { P as ue } from "./CWUm5Boh.js";
import { C as G } from "./BHGkPdUC.js";
import { P as ce } from "./p41O2Qdo.js";
import { T as pe } from "./DhzAXlPS.js";
import { E as me } from "./DeUJRdQC.js";
import "./D0dPopTU.js";
import "./CJdNv5wq.js";
import "./ighQaoU7.js";
const fe = (C) => {
    W(`/finance/tax/${C}`);
  },
  ge = [
    { value: "ppn", label: "PPN" },
    { value: "pph", label: "PPh" },
  ];
function xe() {
  const { fetchTaxes: C, fetchTaxById: h, deleteTax: v, updateTax: b, isLoading: m } = se(),
    { confirm: y } = ae(),
    d = u({ search: "", type: "", page: 1, limit: 10 }),
    _ = u([]),
    P = u({ total: 0, limit: 10, page: 1, totalPages: 0 }),
    S = u("list"),
    A = u("");
  let j;
  const w = u(!1),
    k = u(!1),
    p = u(null),
    f = u(""),
    c = u({ name: "", rate: 0, type: "", description: "", isActive: !0 }),
    F = q(() => m.value);
  (z(
    () => [d.value.search, d.value.type, d.value.page],
    () => {
      g();
    },
    { deep: !0 },
  ),
    z(A, (a) => {
      (clearTimeout(j),
        (j = setTimeout(() => {
          ((d.value.search = a), (d.value.page = 1));
        }, 500)));
    }));
  const g = async () => {
      try {
        const a = await C(d.value);
        ((_.value = a.items), (P.value = a.pagination));
      } catch (a) {
        console.error("Failed to load taxes:", a);
      }
    },
    L = (a) => {
      d.value.page = a;
    },
    V = (a) => {
      fe(a);
    },
    o = async (a) => {
      try {
        f.value = a;
        const T = await h(a);
        if (!T) throw new Error("Failed to load tax data");
        const x = T;
        ((c.value = {
          name: x.name || "",
          rate: Number(x.rate) || 0,
          type: x.type || "",
          description: x.description || "",
          isActive: x.isActive ?? !0,
        }),
          (w.value = !0),
          (p.value = null));
      } catch (T) {
        (console.error("Failed to open edit modal:", T), (p.value = "Failed to load tax data"));
      }
    },
    D = () => {
      ((w.value = !1), (p.value = null), (f.value = ""));
    };
  return {
    taxes: _,
    filters: d,
    pagination: P,
    viewMode: S,
    searchQuery: A,
    isEditModalOpen: w,
    isSubmitting: k,
    editError: p,
    editingTaxId: f,
    formData: c,
    taxTypeOptions: ge,
    formatCurrency: ne,
    isLoading: F,
    loadTaxes: g,
    handlePageChange: L,
    handleRowClick: V,
    openEditModal: o,
    closeEditModal: D,
    handleUpdate: async () => {
      if (f.value)
        try {
          if (
            ((k.value = !0),
            (p.value = null),
            await b(f.value, {
              name: c.value.name,
              rate: c.value.rate,
              type: c.value.type,
              description: c.value.description,
              isActive: c.value.isActive,
            }))
          )
            (D(), await g());
          else throw new Error("Failed to update tax");
        } catch (a) {
          (console.error("Failed to update tax:", a), (p.value = "Failed to update tax"));
        } finally {
          k.value = !1;
        }
    },
    handleDelete: async (a) => {
      const x = _.value.find(($) => $.id === a)?.name || a;
      if (
        await y({
          title: "Hapus Pajak",
          message: `Apakah Anda yakin ingin menghapus pajak ${x}? Tindakan ini tidak dapat dibatalkan.`,
          confirmText: "Hapus",
          cancelText: "Batal",
          type: "danger",
        })
      )
        try {
          (await v(a), g());
        } catch ($) {
          (console.error("Failed to delete tax:", $),
            alert("Gagal menghapus pajak. Silakan coba lagi."));
        }
    },
    initialize: () => {
      g();
    },
  };
}
const he = { class: "space-y-6 animate-fade-in p-6" },
  ve = { class: "flex items-center justify-between" },
  be = { class: "flex items-center gap-2" },
  ye = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  _e = { class: "flex items-center justify-between gap-4" },
  we = { class: "relative w-full max-w-sm" },
  ke = { class: "flex items-center gap-3" },
  Te = { key: 0, class: "flex justify-center py-12" },
  Ce = { key: 0, class: "border border-border rounded-xl bg-white overflow-hidden" },
  Pe = { class: "overflow-x-auto" },
  Ae = { class: "w-full" },
  je = { class: "py-3 px-4" },
  De = { class: "flex items-center gap-2" },
  Ee = { class: "p-1.5 rounded bg-blue-50 text-[#012D5A]" },
  Me = { class: "text-sm font-medium" },
  Ne = { class: "py-3 px-4" },
  Se = {
    class:
      "text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border",
  },
  Fe = { class: "py-3 px-4 text-sm font-medium" },
  Le = { class: "py-3 px-4 text-sm text-muted-foreground" },
  Ue = { class: "py-3 px-4" },
  $e = { class: "py-3 px-4 text-right" },
  Be = { class: "flex gap-1 justify-end" },
  Re = ["onClick"],
  Ve = ["onClick"],
  Oe = { key: 0 },
  ze = { key: 1, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  Ie = ["onClick"],
  Qe = { class: "flex items-start justify-between mb-4" },
  Ge = { class: "flex items-start gap-4" },
  He = {
    class:
      "w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0",
  },
  Ke = { class: "font-bold text-base text-foreground" },
  qe = { class: "text-xs text-muted-foreground uppercase" },
  We = { class: "space-y-4 mb-4" },
  Ye = { class: "text-lg font-bold text-[#012D5A]" },
  Je = { class: "pt-3 border-t border-border" },
  Xe = { class: "text-xs text-muted-foreground line-clamp-2" },
  Ze = { key: 0, class: "col-span-full py-12 text-center text-muted-foreground" },
  et = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  yt = Y({
    __name: "index",
    setup(C) {
      const {
        taxes: h,
        filters: v,
        pagination: b,
        viewMode: m,
        searchQuery: y,
        isEditModalOpen: d,
        isSubmitting: _,
        editError: P,
        editingTaxId: S,
        formData: A,
        taxTypeOptions: j,
        isLoading: w,
        handlePageChange: k,
        handleRowClick: p,
        openEditModal: f,
        closeEditModal: c,
        handleUpdate: F,
        handleDelete: g,
        initialize: L,
      } = xe();
      return (
        J(() => {
          L();
        }),
        (V, o) => {
          const D = H,
            O = K;
          return (
            n(),
            i(
              M,
              null,
              [
                e("div", he, [
                  e("div", ve, [
                    o[6] ||
                      (o[6] = e(
                        "div",
                        null,
                        [
                          e("h1", { class: "text-2xl font-bold" }, "Pajak"),
                          e(
                            "p",
                            { class: "text-muted-foreground mt-1" },
                            "Kelola catatan pajak PPN dan PPh",
                          ),
                        ],
                        -1,
                      )),
                    e("div", be, [
                      e("div", ye, [
                        e(
                          "button",
                          {
                            onClick: o[0] || (o[0] = (s) => (m.value = "list")),
                            class: E(
                              t(N)(
                                "p-1.5 rounded transition-colors",
                                t(m) === "list"
                                  ? "bg-[#012D5A] text-white"
                                  : "text-muted-foreground hover:bg-muted",
                              ),
                            ),
                          },
                          [r(t(re), { class: "w-4 h-4" })],
                          2,
                        ),
                        e(
                          "button",
                          {
                            onClick: o[1] || (o[1] = (s) => (m.value = "grid")),
                            class: E(
                              t(N)(
                                "p-1.5 rounded transition-colors",
                                t(m) === "grid"
                                  ? "bg-[#012D5A] text-white"
                                  : "text-muted-foreground hover:bg-muted",
                              ),
                            ),
                          },
                          [r(t(le), { class: "w-4 h-4" })],
                          2,
                        ),
                      ]),
                    ]),
                  ]),
                  e("div", _e, [
                    e("div", we, [
                      r(t(de), {
                        class:
                          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                      }),
                      I(
                        e(
                          "input",
                          {
                            "onUpdate:modelValue":
                              o[2] || (o[2] = (s) => (Z(y) ? (y.value = s) : null)),
                            type: "text",
                            placeholder: "Cari pajak...",
                            class:
                              "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                          },
                          null,
                          512,
                        ),
                        [[X, t(y)]],
                      ),
                    ]),
                    e("div", ke, [
                      I(
                        e(
                          "select",
                          {
                            "onUpdate:modelValue": o[3] || (o[3] = (s) => (t(v).type = s)),
                            class:
                              "px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary",
                          },
                          [
                            ...(o[7] ||
                              (o[7] = [
                                e("option", { value: "" }, "Semua Tipe", -1),
                                e("option", { value: "ppn" }, "PPN", -1),
                                e("option", { value: "pph" }, "PPh", -1),
                              ])),
                          ],
                          512,
                        ),
                        [[ee, t(v).type]],
                      ),
                      r(
                        D,
                        {
                          to: "/finance/tax/create",
                          class:
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                        },
                        {
                          default: te(() => [
                            r(t(ue), { class: "w-4 h-4" }),
                            o[8] || (o[8] = e("span", null, "Catat Pajak", -1)),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  t(w)
                    ? (n(),
                      i("div", Te, [
                        ...(o[9] ||
                          (o[9] = [
                            e(
                              "div",
                              {
                                class:
                                  "animate-spin rounded-full h-8 w-8 border-b-2 border-primary",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ]))
                    : (n(),
                      i(
                        M,
                        { key: 1 },
                        [
                          t(m) === "list"
                            ? (n(),
                              i("div", Ce, [
                                e("div", Pe, [
                                  e("table", Ae, [
                                    o[11] ||
                                      (o[11] = e(
                                        "thead",
                                        null,
                                        [
                                          e(
                                            "tr",
                                            { class: "border-b border-border bg-white text-left" },
                                            [
                                              e(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Nama",
                                              ),
                                              e(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Tipe",
                                              ),
                                              e(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Rate (%)",
                                              ),
                                              e(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Deskripsi",
                                              ),
                                              e(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Status",
                                              ),
                                              e("th", { class: "py-3 px-4 w-10" }),
                                            ],
                                          ),
                                        ],
                                        -1,
                                      )),
                                    e("tbody", null, [
                                      (n(!0),
                                      i(
                                        M,
                                        null,
                                        Q(
                                          t(h),
                                          (s) => (
                                            n(),
                                            i(
                                              "tr",
                                              {
                                                key: s.id,
                                                class:
                                                  "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                                              },
                                              [
                                                e("td", je, [
                                                  e("div", De, [
                                                    e("div", Ee, [r(t(G), { class: "w-4 h-4" })]),
                                                    e("span", Me, l(s.name), 1),
                                                  ]),
                                                ]),
                                                e("td", Ne, [e("span", Se, l(s.type), 1)]),
                                                e("td", Fe, l(s.rate) + "%", 1),
                                                e("td", Le, l(s.description || "-"), 1),
                                                e("td", Ue, [
                                                  e(
                                                    "span",
                                                    {
                                                      class: E(
                                                        t(N)(
                                                          "px-2 py-0.5 rounded border text-xs font-medium",
                                                          s.isActive
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-gray-100 text-gray-500 border-gray-200",
                                                        ),
                                                      ),
                                                    },
                                                    l(s.isActive ? "Aktif" : "Nonaktif"),
                                                    3,
                                                  ),
                                                ]),
                                                e("td", $e, [
                                                  e("div", Be, [
                                                    e(
                                                      "button",
                                                      {
                                                        class:
                                                          "p-1.5 rounded hover:bg-muted transition-colors",
                                                        onClick: R((U) => t(f)(s.id), ["stop"]),
                                                      },
                                                      [
                                                        r(t(ce), {
                                                          class: "w-4 h-4 text-muted-foreground",
                                                        }),
                                                      ],
                                                      8,
                                                      Re,
                                                    ),
                                                    e(
                                                      "button",
                                                      {
                                                        class:
                                                          "p-1.5 rounded hover:bg-muted transition-colors",
                                                        onClick: R((U) => t(g)(s.id), ["stop"]),
                                                      },
                                                      [
                                                        r(t(pe), {
                                                          class: "w-4 h-4 text-muted-foreground",
                                                        }),
                                                      ],
                                                      8,
                                                      Ve,
                                                    ),
                                                  ]),
                                                ]),
                                              ],
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                      t(h).length === 0
                                        ? (n(),
                                          i("tr", Oe, [
                                            ...(o[10] ||
                                              (o[10] = [
                                                e(
                                                  "td",
                                                  {
                                                    colspan: "6",
                                                    class:
                                                      "py-12 text-center text-muted-foreground",
                                                  },
                                                  " Tidak ada pajak ditemukan. ",
                                                  -1,
                                                ),
                                              ])),
                                          ]))
                                        : B("", !0),
                                    ]),
                                  ]),
                                ]),
                              ]))
                            : (n(),
                              i("div", ze, [
                                (n(!0),
                                i(
                                  M,
                                  null,
                                  Q(
                                    t(h),
                                    (s) => (
                                      n(),
                                      i(
                                        "div",
                                        {
                                          key: s.id,
                                          class:
                                            "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                                          onClick: (U) => t(p)(s.id),
                                        },
                                        [
                                          e("div", Qe, [
                                            e("div", Ge, [
                                              e("div", He, [r(t(G), { class: "w-6 h-6" })]),
                                              e("div", null, [
                                                e("h3", Ke, l(s.name), 1),
                                                e("p", qe, l(s.type), 1),
                                              ]),
                                            ]),
                                            e(
                                              "button",
                                              {
                                                class:
                                                  "text-muted-foreground hover:text-foreground",
                                                onClick: o[4] || (o[4] = R(() => {}, ["stop"])),
                                              },
                                              [r(t(me), { class: "w-4 h-4" })],
                                            ),
                                          ]),
                                          e("div", We, [
                                            e("div", null, [
                                              o[12] ||
                                                (o[12] = e(
                                                  "p",
                                                  { class: "text-xs text-muted-foreground mb-1" },
                                                  "Rate",
                                                  -1,
                                                )),
                                              e("p", Ye, l(s.rate) + "%", 1),
                                            ]),
                                            e("div", null, [
                                              o[13] ||
                                                (o[13] = e(
                                                  "p",
                                                  { class: "text-xs text-muted-foreground mb-1" },
                                                  "Status",
                                                  -1,
                                                )),
                                              e(
                                                "span",
                                                {
                                                  class: E(
                                                    t(N)(
                                                      "px-2 py-0.5 rounded border text-xs font-medium",
                                                      s.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-gray-100 text-gray-500 border-gray-200",
                                                    ),
                                                  ),
                                                },
                                                l(s.isActive ? "Aktif" : "Nonaktif"),
                                                3,
                                              ),
                                            ]),
                                          ]),
                                          e("div", Je, [
                                            e(
                                              "p",
                                              Xe,
                                              l(s.description || "Tidak ada deskripsi"),
                                              1,
                                            ),
                                          ]),
                                        ],
                                        8,
                                        Ie,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                                t(h).length === 0
                                  ? (n(), i("div", Ze, " Tidak ada pajak ditemukan. "))
                                  : B("", !0),
                              ])),
                          e("div", et, [
                            e("p", null, l(t(b).total) + " data found.", 1),
                            t(b).total > 0
                              ? (n(),
                                oe(
                                  O,
                                  {
                                    key: 0,
                                    page: t(v).page,
                                    "onUpdate:page": [
                                      o[5] || (o[5] = (s) => (t(v).page = s)),
                                      t(k),
                                    ],
                                    total: t(b).total,
                                    "items-per-page": t(b).limit,
                                  },
                                  null,
                                  8,
                                  ["page", "total", "items-per-page", "onUpdate:page"],
                                ))
                              : B("", !0),
                          ]),
                        ],
                        64,
                      )),
                ]),
                r(
                  t(ie),
                  {
                    "is-open": t(d),
                    "is-submitting": t(_),
                    "edit-error": t(P),
                    "editing-tax-id": t(S),
                    "form-data": t(A),
                    "tax-type-options": t(j),
                    onClose: t(c),
                    onSubmit: t(F),
                  },
                  null,
                  8,
                  [
                    "is-open",
                    "is-submitting",
                    "edit-error",
                    "editing-tax-id",
                    "form-data",
                    "tax-type-options",
                    "onClose",
                    "onSubmit",
                  ],
                ),
              ],
              64,
            )
          );
        }
      );
    },
  });
export { yt as default };
