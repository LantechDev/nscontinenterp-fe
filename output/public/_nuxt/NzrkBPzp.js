import { _ as I } from "./DhCF3Kco.js";
import {
  e as k,
  q as N,
  r as m,
  N as M,
  O as f,
  P as y,
  Q as o,
  R as E,
  S as q,
  T as g,
  U as l,
  V as u,
  W as r,
  a3 as x,
  a4 as C,
  a2 as B,
  K as v,
  Y as P,
  Z as z,
  _ as p,
} from "./D9q6143x.js";
import { u as F } from "./CJdNv5wq.js";
import { C as R } from "./C22E21xF.js";
import { S as T } from "./CfuPgfv3.js";
const Y = { key: 0, class: "p-4 bg-red-50 border border-red-200 rounded-lg" },
  G = { class: "text-sm text-red-600" },
  O = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  Z = { class: "space-y-1.5" },
  K = { class: "space-y-1.5" },
  L = { class: "space-y-1.5" },
  Q = { class: "flex gap-2" },
  W = { class: "space-y-1.5" },
  $ = { class: "flex items-center gap-4 mt-2" },
  j = { class: "flex items-center gap-2 text-sm text-foreground" },
  H = { class: "flex items-center gap-2 text-sm text-foreground" },
  J = { class: "space-y-1.5" },
  X = { class: "relative" },
  h = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  _ = { class: "space-y-1.5" },
  ee = { class: "space-y-1.5" },
  oe = { class: "space-y-1.5 md:col-span-2" },
  te = { class: "space-y-1.5" },
  se = { class: "space-y-1.5" },
  le = { class: "grid grid-cols-1 md:grid-cols-2 gap-4" },
  re = { class: "space-y-1.5" },
  ne = { class: "space-y-1.5" },
  de = ["disabled"],
  ae = ["disabled"],
  ve = k({
    __name: "CompanyCreateModal",
    props: { modelValue: { type: Boolean } },
    emits: ["update:modelValue", "refresh"],
    setup(V, { emit: w }) {
      const U = V,
        c = w,
        i = N({ get: () => U.modelValue, set: (n) => c("update:modelValue", n) }),
        { createCompany: S } = F(),
        d = m(!1),
        a = m(null),
        t = m({
          name: "",
          email: "",
          phone: "",
          countryCode: "ID",
          isCustomer: !0,
          isVendor: !1,
          status: "active",
          country: "",
          city: "",
          fullAddress: "",
          postalCode: "",
          state: "",
          eoriNo: "",
          description: "",
          notes: "",
        }),
        A = () => {
          ((t.value = {
            name: "",
            email: "",
            phone: "",
            countryCode: "ID",
            isCustomer: !0,
            isVendor: !1,
            status: "active",
            country: "",
            city: "",
            fullAddress: "",
            postalCode: "",
            state: "",
            eoriNo: "",
            description: "",
            notes: "",
          }),
            (a.value = null));
        };
      M(i, (n) => {
        n && A();
      });
      const b = async () => {
        if (!t.value.name || !t.value.email || !t.value.phone) {
          a.value = "Please fill in all required fields (Name, Email, Phone)";
          return;
        }
        ((d.value = !0), (a.value = null));
        const n = await S({
          name: t.value.name,
          email: t.value.email,
          phone: t.value.phone,
          fullAddress: t.value.fullAddress,
          country: t.value.country,
          city: t.value.city,
          isCustomer: t.value.isCustomer,
          isVendor: t.value.isVendor,
          description: t.value.description,
          notes: t.value.notes,
        });
        (n.success
          ? ((i.value = !1), c("refresh"))
          : (a.value = n.error || "Failed to create company"),
          (d.value = !1));
      };
      return (n, e) => {
        const D = I;
        return (
          p(),
          f(
            D,
            {
              modelValue: i.value,
              "onUpdate:modelValue": e[15] || (e[15] = (s) => (i.value = s)),
              title: "Add new Company",
              description: "Register your new Company",
              width: "max-w-4xl",
            },
            {
              footer: y(() => [
                o(
                  "button",
                  {
                    type: "button",
                    onClick: e[14] || (e[14] = (s) => (i.value = !1)),
                    class:
                      "px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors",
                    disabled: d.value,
                  },
                  " Cancel ",
                  8,
                  de,
                ),
                o(
                  "button",
                  {
                    type: "button",
                    onClick: b,
                    disabled: d.value,
                    class:
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  },
                  [
                    d.value
                      ? (p(), f(v(z), { key: 0, class: "w-4 h-4 animate-spin" }))
                      : (p(), f(v(T), { key: 1, class: "w-4 h-4" })),
                    u(" " + g(d.value ? "Saving..." : "Save"), 1),
                  ],
                  8,
                  ae,
                ),
              ]),
              default: y(() => [
                o(
                  "form",
                  { class: "space-y-6", onSubmit: P(b, ["prevent"]) },
                  [
                    a.value ? (p(), E("div", Y, [o("p", G, g(a.value), 1)])) : q("", !0),
                    o("div", null, [
                      e[25] ||
                        (e[25] = o(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Company Detail",
                          -1,
                        )),
                      o("div", O, [
                        o("div", Z, [
                          e[16] ||
                            (e[16] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [u("Name "), o("span", { class: "text-red-500" }, "*")],
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue": e[0] || (e[0] = (s) => (t.value.name = s)),
                                type: "text",
                                placeholder: "Input name",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.name]],
                          ),
                        ]),
                        o("div", K, [
                          e[17] ||
                            (e[17] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [u("Email "), o("span", { class: "text-red-500" }, "*")],
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue": e[1] || (e[1] = (s) => (t.value.email = s)),
                                type: "email",
                                placeholder: "Input email",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                required: "",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.email]],
                          ),
                        ]),
                        o("div", L, [
                          e[19] ||
                            (e[19] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              [u("Phone number "), o("span", { class: "text-red-500" }, "*")],
                              -1,
                            )),
                          o("div", Q, [
                            l(
                              o(
                                "select",
                                {
                                  "onUpdate:modelValue":
                                    e[2] || (e[2] = (s) => (t.value.countryCode = s)),
                                  class:
                                    "w-24 px-2 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary",
                                },
                                [
                                  ...(e[18] ||
                                    (e[18] = [
                                      o("option", { value: "ID" }, "ID", -1),
                                      o("option", { value: "US" }, "US", -1),
                                      o("option", { value: "SG" }, "SG", -1),
                                      o("option", { value: "MY" }, "MY", -1),
                                    ])),
                                ],
                                512,
                              ),
                              [[x, t.value.countryCode]],
                            ),
                            l(
                              o(
                                "input",
                                {
                                  "onUpdate:modelValue":
                                    e[3] || (e[3] = (s) => (t.value.phone = s)),
                                  type: "tel",
                                  placeholder: "+62 812-3456-7890",
                                  class:
                                    "flex-1 px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                                  required: "",
                                },
                                null,
                                512,
                              ),
                              [[r, t.value.phone]],
                            ),
                          ]),
                        ]),
                        o("div", W, [
                          e[22] ||
                            (e[22] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Role",
                              -1,
                            )),
                          o("div", $, [
                            o("label", j, [
                              l(
                                o(
                                  "input",
                                  {
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      e[4] || (e[4] = (s) => (t.value.isCustomer = s)),
                                    class:
                                      "rounded border-gray-300 text-primary focus:ring-primary",
                                  },
                                  null,
                                  512,
                                ),
                                [[C, t.value.isCustomer]],
                              ),
                              e[20] || (e[20] = u(" Customer ", -1)),
                            ]),
                            o("label", H, [
                              l(
                                o(
                                  "input",
                                  {
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      e[5] || (e[5] = (s) => (t.value.isVendor = s)),
                                    class:
                                      "rounded border-gray-300 text-primary focus:ring-primary",
                                  },
                                  null,
                                  512,
                                ),
                                [[C, t.value.isVendor]],
                              ),
                              e[21] || (e[21] = u(" Vendor ", -1)),
                            ]),
                          ]),
                        ]),
                        o("div", J, [
                          e[24] ||
                            (e[24] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Status",
                              -1,
                            )),
                          o("div", X, [
                            l(
                              o(
                                "select",
                                {
                                  "onUpdate:modelValue":
                                    e[6] || (e[6] = (s) => (t.value.status = s)),
                                  class:
                                    "w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none",
                                },
                                [
                                  ...(e[23] ||
                                    (e[23] = [
                                      o("option", { value: "active" }, "Active", -1),
                                      o("option", { value: "inactive" }, "Inactive", -1),
                                    ])),
                                ],
                                512,
                              ),
                              [[x, t.value.status]],
                            ),
                            B(v(R), {
                              class:
                                "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                            }),
                          ]),
                        ]),
                      ]),
                    ]),
                    e[35] || (e[35] = o("div", { class: "border-t border-border" }, null, -1)),
                    o("div", null, [
                      e[31] ||
                        (e[31] = o(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Address",
                          -1,
                        )),
                      o("div", h, [
                        o("div", _, [
                          e[26] ||
                            (e[26] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Country",
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  e[7] || (e[7] = (s) => (t.value.country = s)),
                                type: "text",
                                placeholder: "Input country",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.country]],
                          ),
                        ]),
                        o("div", ee, [
                          e[27] ||
                            (e[27] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "City",
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue": e[8] || (e[8] = (s) => (t.value.city = s)),
                                type: "text",
                                placeholder: "Input city",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.city]],
                          ),
                        ]),
                        o("div", oe, [
                          e[28] ||
                            (e[28] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Full Address",
                              -1,
                            )),
                          l(
                            o(
                              "textarea",
                              {
                                "onUpdate:modelValue":
                                  e[9] || (e[9] = (s) => (t.value.fullAddress = s)),
                                placeholder: "Enter full address",
                                rows: "3",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.fullAddress]],
                          ),
                        ]),
                        o("div", te, [
                          e[29] ||
                            (e[29] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Postal/ Zip code",
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  e[10] || (e[10] = (s) => (t.value.postalCode = s)),
                                type: "text",
                                placeholder: "Input postal code",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.postalCode]],
                          ),
                        ]),
                        o("div", se, [
                          e[30] ||
                            (e[30] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "State",
                              -1,
                            )),
                          l(
                            o(
                              "input",
                              {
                                "onUpdate:modelValue":
                                  e[11] || (e[11] = (s) => (t.value.state = s)),
                                type: "text",
                                placeholder: "Input state",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.state]],
                          ),
                        ]),
                      ]),
                    ]),
                    e[36] || (e[36] = o("div", { class: "border-t border-border" }, null, -1)),
                    o("div", null, [
                      e[34] ||
                        (e[34] = o(
                          "h3",
                          { class: "text-base font-bold text-foreground mb-4" },
                          "Additional Information",
                          -1,
                        )),
                      o("div", le, [
                        o("div", re, [
                          e[32] ||
                            (e[32] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Description",
                              -1,
                            )),
                          l(
                            o(
                              "textarea",
                              {
                                "onUpdate:modelValue":
                                  e[12] || (e[12] = (s) => (t.value.description = s)),
                                placeholder: "Enter company description",
                                rows: "3",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.description]],
                          ),
                        ]),
                        o("div", ne, [
                          e[33] ||
                            (e[33] = o(
                              "label",
                              { class: "text-sm font-medium text-foreground" },
                              "Notes",
                              -1,
                            )),
                          l(
                            o(
                              "textarea",
                              {
                                "onUpdate:modelValue":
                                  e[13] || (e[13] = (s) => (t.value.notes = s)),
                                placeholder: "Enter notes",
                                rows: "3",
                                class:
                                  "w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none",
                              },
                              null,
                              512,
                            ),
                            [[r, t.value.notes]],
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
            ["modelValue"],
          )
        );
      };
    },
  });
export { ve as _ };
