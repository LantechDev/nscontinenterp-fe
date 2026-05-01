import { _ as S } from "./DhCF3Kco.js";
import {
  e as N,
  r as C,
  N as U,
  O as m,
  P as f,
  Q as t,
  R as k,
  S as D,
  T as g,
  U as l,
  V as x,
  W as p,
  K as o,
  X as v,
  Y as M,
  Z as O,
  _ as d,
} from "./D9q6143x.js";
import { S as h } from "./CfuPgfv3.js";
const B = { key: 0, class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
  E = { class: "text-sm text-red-600" },
  I = { class: "space-y-1.5" },
  R = { class: "space-y-1.5" },
  T = { class: "space-y-1.5" },
  F = { class: "flex items-center gap-4" },
  q = { class: "flex items-center gap-2 cursor-pointer" },
  z = { class: "flex items-center gap-2 cursor-pointer" },
  G = { class: "space-y-1.5" },
  K = ["disabled"],
  L = ["disabled"],
  X = N({
    __name: "VesselFormModal",
    props: {
      isOpen: { type: Boolean },
      isSubmitting: { type: Boolean, default: !1 },
      error: { default: null },
      editingVessel: { default: null },
    },
    emits: ["update:isOpen", "submit"],
    setup(r, { expose: y, emit: w }) {
      const V = r,
        a = w,
        s = C({ name: "", imoNumber: "", description: "", isActive: !0 }),
        u = () => {
          s.value = { name: "", imoNumber: "", description: "", isActive: !0 };
        },
        c = () => {
          a("submit", { ...s.value });
        },
        b = () => {
          (a("update:isOpen", !1), u());
        };
      return (
        U(
          () => V.editingVessel,
          (n) => {
            n
              ? (s.value = {
                  name: n.name,
                  imoNumber: n.imoNumber || "",
                  description: n.description || "",
                  isActive: n.isActive,
                })
              : u();
          },
          { immediate: !0 },
        ),
        y({ resetForm: u }),
        (n, e) => {
          const A = S;
          return (
            d(),
            m(
              A,
              {
                "model-value": r.isOpen,
                "onUpdate:modelValue": e[5] || (e[5] = (i) => a("update:isOpen", i)),
                title: r.editingVessel ? "Edit Vessel" : "Add New Vessel",
                description: r.editingVessel
                  ? "Update vessel information"
                  : "Register a new vessel",
                width: "max-w-lg",
                onClose: b,
              },
              {
                footer: f(() => [
                  t(
                    "button",
                    {
                      type: "button",
                      onClick: b,
                      class:
                        "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                      disabled: r.isSubmitting,
                    },
                    " Cancel ",
                    8,
                    K,
                  ),
                  t(
                    "button",
                    {
                      type: "button",
                      onClick: c,
                      disabled: r.isSubmitting,
                      class:
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                    [
                      r.isSubmitting
                        ? (d(), m(o(O), { key: 0, class: "w-4 h-4 animate-spin" }))
                        : (d(), m(o(h), { key: 1, class: "w-4 h-4" })),
                      x(" " + g(r.isSubmitting ? "Saving..." : "Save"), 1),
                    ],
                    8,
                    L,
                  ),
                ]),
                default: f(() => [
                  t(
                    "form",
                    { class: "space-y-4", onSubmit: M(c, ["prevent"]) },
                    [
                      r.error ? (d(), k("div", B, [t("p", E, g(r.error), 1)])) : D("", !0),
                      t("div", I, [
                        e[6] ||
                          (e[6] = t(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            [x(" Vessel Name "), t("span", { class: "text-red-500" }, "*")],
                            -1,
                          )),
                        l(
                          t(
                            "input",
                            {
                              "onUpdate:modelValue": e[0] || (e[0] = (i) => (o(s).name = i)),
                              type: "text",
                              placeholder: "e.g. MV Ever Given",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              required: "",
                            },
                            null,
                            512,
                          ),
                          [[p, o(s).name]],
                        ),
                      ]),
                      t("div", R, [
                        e[7] ||
                          (e[7] = t(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "IMO Number",
                            -1,
                          )),
                        l(
                          t(
                            "input",
                            {
                              "onUpdate:modelValue": e[1] || (e[1] = (i) => (o(s).imoNumber = i)),
                              type: "text",
                              placeholder: "e.g. IMO9811000",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                            },
                            null,
                            512,
                          ),
                          [[p, o(s).imoNumber]],
                        ),
                      ]),
                      t("div", T, [
                        e[10] ||
                          (e[10] = t(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Status",
                            -1,
                          )),
                        t("div", F, [
                          t("label", q, [
                            l(
                              t(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    e[2] || (e[2] = (i) => (o(s).isActive = i)),
                                  type: "radio",
                                  value: !0,
                                  class: "w-4 h-4 text-[#012D5A] border-border focus:ring-primary",
                                },
                                null,
                                512,
                              ),
                              [[v, o(s).isActive]],
                            ),
                            e[8] ||
                              (e[8] = t(
                                "span",
                                { class: "text-sm text-foreground" },
                                "Active",
                                -1,
                              )),
                          ]),
                          t("label", z, [
                            l(
                              t(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    e[3] || (e[3] = (i) => (o(s).isActive = i)),
                                  type: "radio",
                                  value: !1,
                                  class: "w-4 h-4 text-[#012D5A] border-border focus:ring-primary",
                                },
                                null,
                                512,
                              ),
                              [[v, o(s).isActive]],
                            ),
                            e[9] ||
                              (e[9] = t(
                                "span",
                                { class: "text-sm text-foreground" },
                                "Inactive",
                                -1,
                              )),
                          ]),
                        ]),
                      ]),
                      t("div", G, [
                        e[11] ||
                          (e[11] = t(
                            "label",
                            { class: "text-sm font-medium text-foreground" },
                            "Description",
                            -1,
                          )),
                        l(
                          t(
                            "textarea",
                            {
                              "onUpdate:modelValue": e[4] || (e[4] = (i) => (o(s).description = i)),
                              rows: "3",
                              placeholder: "Enter vessel description...",
                              class:
                                "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                            },
                            null,
                            512,
                          ),
                          [[p, o(s).description]],
                        ),
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
export { X as _ };
