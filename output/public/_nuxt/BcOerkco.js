import { _ as J } from "./DXifQ5ls.js";
import { _ as Y } from "./Doao-lii.js";
import {
  e as q,
  o as H,
  R as i,
  Q as t,
  a2 as r,
  $ as C,
  K as e,
  U as D,
  W as X,
  aa as Z,
  a3 as tt,
  P as et,
  a0 as f,
  S as x,
  a1 as E,
  O as ot,
  T as n,
  Y as l,
  _ as d,
} from "./D9q6143x.js";
import { c as $ } from "./DrxnuvjT.js";
import { u as st } from "./BxSHOl50.js";
import { u as rt } from "./D0dPopTU.js";
import { ExpenseEditModal as nt } from "./CPeXr-X7.js";
import { generateExpensePdf as dt } from "./DBSLGs47.js";
import { L as it, a as at } from "./BopvTZHI.js";
import { S as lt } from "./DK0cRrZx.js";
import { P as ut } from "./CWUm5Boh.js";
import { W as j } from "./CCD4SlHB.js";
import { P } from "./p41O2Qdo.js";
import { T as M } from "./DhzAXlPS.js";
import { D as N } from "./BgSnr_43.js";
import "./CJdNv5wq.js";
import "./ighQaoU7.js";
import "./BfskLp3w.js";
import "./BS85nYjr.js";
const ct = { class: "space-y-6 animate-fade-in p-6" },
  mt = { class: "flex items-center justify-between" },
  pt = { class: "flex items-center gap-2" },
  ft = { class: "flex items-center bg-white border border-border rounded-lg p-1 mr-2" },
  gt = { class: "flex items-center justify-between gap-4" },
  xt = { class: "relative w-full max-w-sm" },
  bt = { class: "flex items-center gap-3" },
  _t = { key: 0, class: "flex justify-center py-12" },
  ht = { key: 0, class: "border border-border rounded-xl bg-white overflow-hidden" },
  vt = { class: "overflow-x-auto" },
  yt = { class: "w-full" },
  wt = ["onClick"],
  kt = { class: "py-3 px-4" },
  Ct = { class: "flex items-center gap-2" },
  Dt = { class: "p-1.5 rounded bg-red-50 text-destructive" },
  Et = { class: "text-sm font-medium" },
  $t = { class: "py-3 px-4 text-sm" },
  jt = { class: "py-3 px-4 text-sm text-muted-foreground" },
  Pt = { class: "py-3 px-4 text-sm text-muted-foreground" },
  Mt = { class: "py-3 px-4 text-sm font-medium text-destructive" },
  Nt = { class: "py-3 px-4" },
  St = { class: "text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border" },
  Ut = { class: "py-3 px-4 text-right" },
  Bt = { class: "flex gap-1 justify-end" },
  Tt = ["onClick"],
  At = ["onClick"],
  Lt = ["onClick"],
  Vt = { key: 0 },
  zt = { key: 1, class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
  It = ["onClick"],
  Ot = { class: "flex items-start justify-between mb-4" },
  Kt = { class: "flex items-start gap-4" },
  Rt = {
    class:
      "w-12 h-12 rounded-lg bg-red-50 text-destructive flex items-center justify-center shrink-0",
  },
  Wt = { class: "font-bold text-base text-foreground" },
  Ft = { class: "text-xs text-muted-foreground" },
  Qt = { class: "flex gap-2" },
  Gt = ["onClick"],
  Jt = ["onClick"],
  Yt = ["onClick"],
  qt = { class: "space-y-3 mb-4 mt-3" },
  Ht = { class: "text-sm font-medium line-clamp-2" },
  Xt = { class: "text-sm font-medium" },
  Zt = { class: "text-lg font-bold text-destructive" },
  te = { class: "flex items-center justify-between pt-4 border-t border-border" },
  ee = { class: "text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border" },
  oe = { key: 0, class: "col-span-full py-12 text-center text-muted-foreground" },
  se = { class: "flex items-center justify-between text-sm text-muted-foreground" },
  Ce = q({
    __name: "index",
    setup(re) {
      const {
          expenses: c,
          filters: m,
          pagination: p,
          viewMode: u,
          searchQuery: g,
          isEditModalOpen: S,
          isSubmitting: U,
          editError: B,
          editingExpenseId: T,
          formData: A,
          categoryOptions: L,
          companies: V,
          jobs: z,
          formatCurrency: b,
          formatDate: _,
          isLoading: I,
          handlePageChange: O,
          handleRowClick: h,
          openEditModal: v,
          closeEditModal: K,
          handleUpdate: R,
          handleDelete: y,
          initialize: W,
        } = st(),
        { fetchExpenseById: F } = rt(),
        w = async (k) => {
          await dt(k, F);
        };
      return (
        H(() => {
          W();
        }),
        (k, s) => {
          const Q = J,
            G = Y;
          return (
            d(),
            i(
              f,
              null,
              [
                t("div", ct, [
                  t("div", mt, [
                    s[5] ||
                      (s[5] = t(
                        "div",
                        null,
                        [
                          t("h1", { class: "text-2xl font-bold" }, "Biaya Operasional"),
                          t(
                            "p",
                            { class: "text-muted-foreground mt-1" },
                            "Catat pengeluaran operasional",
                          ),
                        ],
                        -1,
                      )),
                    t("div", pt, [
                      t("div", ft, [
                        t(
                          "button",
                          {
                            onClick: s[0] || (s[0] = (o) => (u.value = "list")),
                            class: C(
                              e($)(
                                "p-1.5 rounded transition-colors",
                                e(u) === "list"
                                  ? "bg-[#012D5A] text-white"
                                  : "text-muted-foreground hover:bg-muted",
                              ),
                            ),
                          },
                          [r(e(it), { class: "w-4 h-4" })],
                          2,
                        ),
                        t(
                          "button",
                          {
                            onClick: s[1] || (s[1] = (o) => (u.value = "grid")),
                            class: C(
                              e($)(
                                "p-1.5 rounded transition-colors",
                                e(u) === "grid"
                                  ? "bg-[#012D5A] text-white"
                                  : "text-muted-foreground hover:bg-muted",
                              ),
                            ),
                          },
                          [r(e(at), { class: "w-4 h-4" })],
                          2,
                        ),
                      ]),
                    ]),
                  ]),
                  t("div", gt, [
                    t("div", xt, [
                      r(e(lt), {
                        class:
                          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                      }),
                      D(
                        t(
                          "input",
                          {
                            "onUpdate:modelValue":
                              s[2] || (s[2] = (o) => (Z(g) ? (g.value = o) : null)),
                            type: "text",
                            placeholder: "Cari biaya...",
                            class:
                              "w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground",
                          },
                          null,
                          512,
                        ),
                        [[X, e(g)]],
                      ),
                    ]),
                    t("div", bt, [
                      D(
                        t(
                          "select",
                          {
                            "onUpdate:modelValue": s[3] || (s[3] = (o) => (e(m).categoryId = o)),
                            class:
                              "px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary",
                          },
                          [
                            ...(s[6] ||
                              (s[6] = [
                                t("option", { value: "" }, "Semua Kategori", -1),
                                t("option", { value: "trucking" }, "Trucking", -1),
                                t("option", { value: "port" }, "Port", -1),
                                t("option", { value: "customs" }, "Customs", -1),
                              ])),
                          ],
                          512,
                        ),
                        [[tt, e(m).categoryId]],
                      ),
                      r(
                        Q,
                        {
                          to: "/finance/expenses/create",
                          class:
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
                        },
                        {
                          default: et(() => [
                            r(e(ut), { class: "w-4 h-4" }),
                            s[7] || (s[7] = t("span", null, "Catat Biaya", -1)),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  e(I)
                    ? (d(),
                      i("div", _t, [
                        ...(s[8] ||
                          (s[8] = [
                            t(
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
                    : (d(),
                      i(
                        f,
                        { key: 1 },
                        [
                          e(u) === "list"
                            ? (d(),
                              i("div", ht, [
                                t("div", vt, [
                                  t("table", yt, [
                                    s[10] ||
                                      (s[10] = t(
                                        "thead",
                                        null,
                                        [
                                          t(
                                            "tr",
                                            { class: "border-b border-border bg-white text-left" },
                                            [
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "No. Biaya",
                                              ),
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Deskripsi",
                                              ),
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Vendor",
                                              ),
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Tanggal",
                                              ),
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Jumlah",
                                              ),
                                              t(
                                                "th",
                                                {
                                                  class:
                                                    "py-3 px-4 text-sm font-medium text-foreground",
                                                },
                                                "Kategori",
                                              ),
                                              t("th", { class: "py-3 px-4 w-10" }),
                                            ],
                                          ),
                                        ],
                                        -1,
                                      )),
                                    t("tbody", null, [
                                      (d(!0),
                                      i(
                                        f,
                                        null,
                                        E(
                                          e(c),
                                          (o) => (
                                            d(),
                                            i(
                                              "tr",
                                              {
                                                key: o.id,
                                                class:
                                                  "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                                                onClick: (a) => e(h)(o.id),
                                              },
                                              [
                                                t("td", kt, [
                                                  t("div", Ct, [
                                                    t("div", Dt, [r(e(j), { class: "w-4 h-4" })]),
                                                    t("span", Et, n(o.number), 1),
                                                  ]),
                                                ]),
                                                t("td", $t, n(o.description), 1),
                                                t("td", jt, n(o.vendor?.name || "N/A"), 1),
                                                t("td", Pt, n(e(_)(o.date)), 1),
                                                t("td", Mt, n(e(b)(Number(o.amount))), 1),
                                                t("td", Nt, [
                                                  t(
                                                    "span",
                                                    St,
                                                    n(o.category?.name || "Uncategorized"),
                                                    1,
                                                  ),
                                                ]),
                                                t("td", Ut, [
                                                  t("div", Bt, [
                                                    t(
                                                      "button",
                                                      {
                                                        class:
                                                          "p-1.5 rounded hover:bg-muted transition-colors",
                                                        onClick: l((a) => e(v)(o.id), ["stop"]),
                                                      },
                                                      [
                                                        r(e(P), {
                                                          class: "w-4 h-4 text-muted-foreground",
                                                        }),
                                                      ],
                                                      8,
                                                      Tt,
                                                    ),
                                                    t(
                                                      "button",
                                                      {
                                                        class:
                                                          "p-1.5 rounded hover:bg-muted transition-colors",
                                                        onClick: l((a) => e(y)(o.id), ["stop"]),
                                                      },
                                                      [
                                                        r(e(M), {
                                                          class: "w-4 h-4 text-muted-foreground",
                                                        }),
                                                      ],
                                                      8,
                                                      At,
                                                    ),
                                                    t(
                                                      "button",
                                                      {
                                                        class:
                                                          "p-1.5 rounded hover:bg-muted transition-colors",
                                                        onClick: l((a) => w(o.id), ["stop"]),
                                                      },
                                                      [
                                                        r(e(N), {
                                                          class: "w-4 h-4 text-muted-foreground",
                                                        }),
                                                      ],
                                                      8,
                                                      Lt,
                                                    ),
                                                  ]),
                                                ]),
                                              ],
                                              8,
                                              wt,
                                            )
                                          ),
                                        ),
                                        128,
                                      )),
                                      e(c).length === 0
                                        ? (d(),
                                          i("tr", Vt, [
                                            ...(s[9] ||
                                              (s[9] = [
                                                t(
                                                  "td",
                                                  {
                                                    colspan: "7",
                                                    class:
                                                      "py-12 text-center text-muted-foreground",
                                                  },
                                                  " Tidak ada biaya ditemukan. ",
                                                  -1,
                                                ),
                                              ])),
                                          ]))
                                        : x("", !0),
                                    ]),
                                  ]),
                                ]),
                              ]))
                            : (d(),
                              i("div", zt, [
                                (d(!0),
                                i(
                                  f,
                                  null,
                                  E(
                                    e(c),
                                    (o) => (
                                      d(),
                                      i(
                                        "div",
                                        {
                                          key: o.id,
                                          class:
                                            "border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer",
                                          onClick: (a) => e(h)(o.id),
                                        },
                                        [
                                          t("div", Ot, [
                                            t("div", Kt, [
                                              t("div", Rt, [r(e(j), { class: "w-6 h-6" })]),
                                              t("div", null, [
                                                t("h3", Wt, n(o.number), 1),
                                                t("p", Ft, n(e(_)(o.date)), 1),
                                              ]),
                                            ]),
                                          ]),
                                          t("div", Qt, [
                                            t(
                                              "button",
                                              {
                                                class:
                                                  "text-muted-foreground hover:text-foreground p-1",
                                                onClick: l((a) => e(v)(o.id), ["stop"]),
                                              },
                                              [r(e(P), { class: "w-4 h-4" })],
                                              8,
                                              Gt,
                                            ),
                                            t(
                                              "button",
                                              {
                                                class:
                                                  "text-muted-foreground hover:text-foreground p-1",
                                                onClick: l((a) => e(y)(o.id), ["stop"]),
                                              },
                                              [r(e(M), { class: "w-4 h-4" })],
                                              8,
                                              Jt,
                                            ),
                                            t(
                                              "button",
                                              {
                                                class:
                                                  "text-muted-foreground hover:text-foreground p-1",
                                                onClick: l((a) => w(o.id), ["stop"]),
                                              },
                                              [r(e(N), { class: "w-4 h-4" })],
                                              8,
                                              Yt,
                                            ),
                                          ]),
                                          t("div", qt, [
                                            t("div", null, [
                                              s[11] ||
                                                (s[11] = t(
                                                  "p",
                                                  { class: "text-xs text-muted-foreground mb-1" },
                                                  "Description",
                                                  -1,
                                                )),
                                              t("p", Ht, n(o.description), 1),
                                            ]),
                                            t("div", null, [
                                              s[12] ||
                                                (s[12] = t(
                                                  "p",
                                                  { class: "text-xs text-muted-foreground mb-1" },
                                                  "Vendor",
                                                  -1,
                                                )),
                                              t("p", Xt, n(o.vendor?.name || "N/A"), 1),
                                            ]),
                                            t("div", null, [
                                              s[13] ||
                                                (s[13] = t(
                                                  "p",
                                                  { class: "text-xs text-muted-foreground mb-1" },
                                                  "Amount",
                                                  -1,
                                                )),
                                              t("p", Zt, n(e(b)(Number(o.amount))), 1),
                                            ]),
                                          ]),
                                          t("div", te, [
                                            t(
                                              "span",
                                              ee,
                                              n(o.category?.name || "Uncategorized"),
                                              1,
                                            ),
                                          ]),
                                        ],
                                        8,
                                        It,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                                e(c).length === 0
                                  ? (d(), i("div", oe, " Tidak ada biaya ditemukan. "))
                                  : x("", !0),
                              ])),
                          t("div", se, [
                            t("p", null, n(e(p).total) + " data found.", 1),
                            e(p).total > 0
                              ? (d(),
                                ot(
                                  G,
                                  {
                                    key: 0,
                                    page: e(m).page,
                                    "onUpdate:page": [
                                      s[4] || (s[4] = (o) => (e(m).page = o)),
                                      e(O),
                                    ],
                                    total: e(p).total,
                                    "items-per-page": e(p).limit,
                                  },
                                  null,
                                  8,
                                  ["page", "total", "items-per-page", "onUpdate:page"],
                                ))
                              : x("", !0),
                          ]),
                        ],
                        64,
                      )),
                ]),
                r(
                  e(nt),
                  {
                    "is-open": e(S),
                    "is-submitting": e(U),
                    "edit-error": e(B),
                    "editing-expense-id": e(T),
                    "form-data": e(A),
                    "category-options": e(L),
                    companies: e(V),
                    jobs: e(z),
                    onClose: e(K),
                    onSubmit: e(R),
                  },
                  null,
                  8,
                  [
                    "is-open",
                    "is-submitting",
                    "edit-error",
                    "editing-expense-id",
                    "form-data",
                    "category-options",
                    "companies",
                    "jobs",
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
export { Ce as default };
