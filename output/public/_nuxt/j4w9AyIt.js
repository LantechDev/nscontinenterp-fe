import { _ as M } from "./DhCF3Kco.js";
import {
  e as _,
  q as C,
  o as T,
  r as q,
  N as P,
  O as f,
  P as w,
  Q as t,
  R as E,
  S as L,
  T as c,
  U as R,
  V as m,
  W as U,
  K as i,
  a2 as r,
  Y as F,
  Z as X,
  _ as p,
} from "./D9q6143x.js";
import { C as d } from "./DKEGG4ny.js";
import { u as K } from "./DivQEVj9.js";
import { S as Q } from "./CfuPgfv3.js";
const W = { key: 0, class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
  Y = { class: "text-sm text-red-600" },
  Z = { class: "grid grid-cols-2 gap-4" },
  j = { class: "space-y-1.5" },
  z = { class: "space-y-1.5" },
  G = { class: "grid grid-cols-2 gap-4" },
  H = { class: "space-y-1.5" },
  J = { class: "space-y-1.5" },
  $ = { class: "grid grid-cols-3 gap-4" },
  ee = { class: "space-y-1.5" },
  te = { class: "space-y-1.5" },
  oe = { class: "space-y-1.5" },
  ie = { class: "grid grid-cols-2 gap-4" },
  ae = { class: "space-y-1.5" },
  se = { class: "relative" },
  ne = {
    class: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium",
  },
  le = ["value"],
  re = { class: "space-y-1.5" },
  de = { class: "relative" },
  ue = {
    class: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium",
  },
  ce = ["value"],
  me = ["disabled"],
  pe = ["disabled"],
  be = _({
    __name: "ServiceCreateModal",
    props: {
      isOpen: { type: Boolean },
      isSubmitting: { type: Boolean, default: !1 },
      error: { default: null },
      initialData: { default: null },
    },
    emits: ["update:isOpen", "submit"],
    setup(l, { expose: h, emit: O }) {
      const s = l,
        g = O,
        { categories: y, units: x, fetchCategories: A, fetchUnits: N } = K(),
        k = C(() => y.value.map((n) => ({ id: n.id, name: n.name }))),
        B = C(() => x.value.map((n) => ({ id: n.id, name: n.name })));
      T(async () => {
        (y.value.length === 0 && (await A()), x.value.length === 0 && (await N()));
      });
      const o = q({
          name: "",
          code: "",
          vendorPrice: "",
          customerPrice: "",
          currency: "IDR",
          taxRate: "0",
          status: "Active",
          unitId: "",
          categoryId: "",
        }),
        v = () => {
          o.value = {
            name: "",
            code: "",
            vendorPrice: "",
            customerPrice: "",
            currency: "IDR",
            taxRate: "0",
            status: "Active",
            unitId: "",
            categoryId: "",
          };
        },
        b = () => {
          s.initialData
            ? (o.value = {
                name: s.initialData.name || "",
                code: s.initialData.code || "",
                vendorPrice:
                  s.initialData.vendorPrice !== void 0 && s.initialData.vendorPrice !== null
                    ? Number(s.initialData.vendorPrice).toLocaleString("id-ID")
                    : "",
                customerPrice:
                  s.initialData.customerPrice !== void 0 && s.initialData.customerPrice !== null
                    ? Number(s.initialData.customerPrice).toLocaleString("id-ID")
                    : "",
                currency: s.initialData.currency || "IDR",
                taxRate: String(s.initialData.taxRate ?? "0"),
                status: s.initialData.isActive ? "Active" : "Inactive",
                unitId: s.initialData.unitId || "",
                categoryId: s.initialData.categoryId || "",
              })
            : v();
        };
      (P(
        () => s.initialData,
        () => b(),
        { immediate: !0 },
      ),
        P(
          () => s.isOpen,
          (n) => {
            n && b();
          },
        ));
      const D = (n, e) => {
          const u = e.target,
            V = u.value.replace(/\D/g, "");
          (V === "" ? (o.value[n] = "") : (o.value[n] = Number(V).toLocaleString("id-ID")),
            (u.value = o.value[n]));
        },
        S = () => {
          g("submit", { ...o.value });
        },
        I = () => {
          (g("update:isOpen", !1), v());
        };
      return (
        h({ resetForm: v }),
        (n, e) => {
          const u = M;
          return (
            p(),
            f(
              u,
              {
                "model-value": l.isOpen,
                "onUpdate:modelValue": e[9] || (e[9] = (a) => g("update:isOpen", a)),
                title: l.initialData ? "Edit Service" : "Add new Service",
                description: l.initialData ? "Modify service details" : "Register your new Service",
                width: "max-w-3xl",
                onClose: I,
              },
              {
                footer: w(() => [
                  t(
                    "button",
                    {
                      type: "button",
                      onClick: I,
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: l.isSubmitting,
                    },
                    " Cancel ",
                    8,
                    me,
                  ),
                  t(
                    "button",
                    {
                      type: "button",
                      onClick: S,
                      disabled: l.isSubmitting,
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      l.isSubmitting
                        ? (p(), f(i(X), { key: 0, class: "w-4 h-4 animate-spin" }))
                        : (p(), f(i(Q), { key: 1, class: "w-4 h-4" })),
                      m(" " + c(l.isSubmitting ? "Saving..." : "Save"), 1),
                    ],
                    8,
                    pe,
                  ),
                ]),
                default: w(() => [
                  t(
                    "form",
                    { class: "space-y-4 pb-32", onSubmit: F(S, ["prevent"]) },
                    [
                      l.error ? (p(), E("div", W, [t("p", Y, c(l.error), 1)])) : L("", !0),
                      t("div", Z, [
                        t("div", j, [
                          e[10] ||
                            (e[10] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [m(" Service Name "), t("span", { class: "text-red-500" }, "*")],
                              -1,
                            )),
                          R(
                            t(
                              "input",
                              {
                                "onUpdate:modelValue": e[0] || (e[0] = (a) => (i(o).name = a)),
                                type: "text",
                                placeholder: "e.g. Ocean Freight",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              512,
                            ),
                            [[U, i(o).name]],
                          ),
                        ]),
                        t("div", z, [
                          e[11] ||
                            (e[11] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [m(" Code "), t("span", { class: "text-red-500" }, "*")],
                              -1,
                            )),
                          R(
                            t(
                              "input",
                              {
                                "onUpdate:modelValue": e[1] || (e[1] = (a) => (i(o).code = a)),
                                type: "text",
                                placeholder: "SVC-XXX",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              512,
                            ),
                            [[U, i(o).code]],
                          ),
                        ]),
                      ]),
                      t("div", G, [
                        t("div", H, [
                          e[12] ||
                            (e[12] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Category",
                              -1,
                            )),
                          r(
                            d,
                            {
                              modelValue: i(o).categoryId,
                              "onUpdate:modelValue": e[2] || (e[2] = (a) => (i(o).categoryId = a)),
                              options: i(k),
                              placeholder: "-- Select Category --",
                            },
                            null,
                            8,
                            ["modelValue", "options"],
                          ),
                        ]),
                        t("div", J, [
                          e[13] ||
                            (e[13] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Unit",
                              -1,
                            )),
                          r(
                            d,
                            {
                              modelValue: i(o).unitId,
                              "onUpdate:modelValue": e[3] || (e[3] = (a) => (i(o).unitId = a)),
                              options: i(B),
                              placeholder: "-- Select Unit --",
                            },
                            null,
                            8,
                            ["modelValue", "options"],
                          ),
                        ]),
                      ]),
                      t("div", $, [
                        t("div", ee, [
                          e[14] ||
                            (e[14] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Currency",
                              -1,
                            )),
                          r(
                            d,
                            {
                              modelValue: i(o).currency,
                              "onUpdate:modelValue": e[4] || (e[4] = (a) => (i(o).currency = a)),
                              options: [
                                { id: "IDR", name: "IDR" },
                                { id: "USD", name: "USD" },
                                { id: "EUR", name: "EUR" },
                              ],
                              placeholder: "Select Currency",
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                        ]),
                        t("div", te, [
                          e[15] ||
                            (e[15] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Tax Rate (%)",
                              -1,
                            )),
                          r(
                            d,
                            {
                              modelValue: i(o).taxRate,
                              "onUpdate:modelValue": e[5] || (e[5] = (a) => (i(o).taxRate = a)),
                              options: [
                                { id: "0", name: "0%" },
                                { id: "1.1", name: "1.1%" },
                                { id: "11", name: "11%" },
                              ],
                              placeholder: "Select Tax Rate",
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                        ]),
                        t("div", oe, [
                          e[16] ||
                            (e[16] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Status",
                              -1,
                            )),
                          r(
                            d,
                            {
                              modelValue: i(o).status,
                              "onUpdate:modelValue": e[6] || (e[6] = (a) => (i(o).status = a)),
                              options: [
                                { id: "Active", name: "Active" },
                                { id: "Inactive", name: "Inactive" },
                              ],
                              placeholder: "Select Status",
                            },
                            null,
                            8,
                            ["modelValue"],
                          ),
                        ]),
                      ]),
                      t("div", ie, [
                        t("div", ae, [
                          e[17] ||
                            (e[17] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Cost Price (Vendor)",
                              -1,
                            )),
                          t("div", se, [
                            t("div", ne, c(i(o).currency), 1),
                            t(
                              "input",
                              {
                                value: i(o).vendorPrice,
                                onInput: e[7] || (e[7] = (a) => D("vendorPrice", a)),
                                type: "text",
                                placeholder: "0",
                                class:
                                  "w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              40,
                              le,
                            ),
                          ]),
                        ]),
                        t("div", re, [
                          e[18] ||
                            (e[18] = t(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [
                                m("Selling Price (Customer) "),
                                t("span", { class: "text-red-500" }, "*"),
                              ],
                              -1,
                            )),
                          t("div", de, [
                            t("div", ue, c(i(o).currency), 1),
                            t(
                              "input",
                              {
                                value: i(o).customerPrice,
                                onInput: e[8] || (e[8] = (a) => D("customerPrice", a)),
                                type: "text",
                                placeholder: "0",
                                class:
                                  "w-full pl-12 pr-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              40,
                              ce,
                            ),
                          ]),
                        ]),
                      ]),
                    ],
                    32,
                  ),
                ]),
                _: 1,
              },
              8,
              ["model-value", "title", "description"],
            )
          );
        }
      );
    },
  });
export { be as _ };
