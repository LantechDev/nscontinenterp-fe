import { C as y } from "./DKEGG4ny.js";
import {
  e as h,
  a5 as x,
  a6 as b,
  q as u,
  R as d,
  Q as s,
  S as p,
  V,
  T as l,
  a7 as w,
  a2 as v,
  $ as f,
  a0 as B,
  a8 as S,
  _ as n,
} from "./D9q6143x.js";
const z = {
    class:
      "col-span-1 md:col-span-2 font-semibold text-[11px] md:pt-2.5 text-muted-foreground uppercase tracking-wider flex flex-col",
  },
  E = { key: 0, class: "text-destructive" },
  N = { key: 0, class: "text-[10px] font-normal lowercase mt-0.5 opacity-70" },
  A = { class: "col-span-1 md:col-span-4 space-y-2 transform transition-transform flex flex-col" },
  D = { class: "border-b border-border/40 pb-1.5 mb-1.5 text-foreground leading-snug font-medium" },
  M = { class: "flex justify-between items-center opacity-80" },
  $ = { class: "text-foreground shrink-0" },
  j = { class: "flex justify-between items-center opacity-80" },
  q = { class: "text-foreground shrink-0" },
  T = { key: 0, class: "flex justify-between items-center opacity-80 pt-0.5" },
  R = { class: "text-foreground shrink-0" },
  U = {
    key: 1,
    class:
      "text-center italic opacity-40 bg-muted/20 py-4 rounded-lg border border-dashed border-border/40 text-[10px]",
  },
  O = h({
    __name: "JobPartyRow",
    props: x(
      {
        label: {},
        description: {},
        required: { type: Boolean },
        companies: {},
        disabledCompany: { type: Boolean },
        disabledAddress: { type: Boolean },
        zIndex: {},
        hasExtraControls: { type: Boolean },
      },
      { companyId: {}, companyIdModifiers: {}, addressId: {}, addressIdModifiers: {} },
    ),
    emits: x(["create"], ["update:companyId", "update:addressId"]),
    setup(e, { emit: g }) {
      const C = e,
        i = b(e, "companyId"),
        c = b(e, "addressId"),
        I = g,
        m = u(() => C.companies.find((t) => t.id === i.value)),
        k = u(() =>
          (m.value?.addresses || []).map((t) => ({
            id: t.id,
            label: `${t.label || "Default"} (${t.city || "No City"})`,
          })),
        ),
        o = u(() =>
          !m.value || !c.value ? null : m.value.addresses?.find((t) => t.id === c.value),
        );
      return (t, a) => (
        n(),
        d(
          "div",
          {
            class:
              "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 md:px-6 py-5 items-start hover:bg-muted/5 transition-colors relative",
            style: S({ zIndex: e.zIndex }),
          },
          [
            s("div", z, [
              s("span", null, [
                V(l(e.label) + " ", 1),
                e.required ? (n(), d("span", E, "*")) : p("", !0),
              ]),
              e.description ? (n(), d("span", N, l(e.description), 1)) : p("", !0),
            ]),
            s("div", A, [
              w(t.$slots, "extra-controls"),
              v(
                y,
                {
                  modelValue: i.value,
                  "onUpdate:modelValue": a[0] || (a[0] = (r) => (i.value = r)),
                  options: e.companies,
                  "label-key": "name",
                  "value-key": "id",
                  placeholder: "Select Company...",
                  "allow-create": "",
                  disabled: e.disabledCompany,
                  onCreate: a[1] || (a[1] = (r) => I("create", r)),
                },
                null,
                8,
                ["modelValue", "options", "disabled"],
              ),
            ]),
            s(
              "div",
              { class: f(["col-span-1 md:col-span-4", { "md:pt-[38px]": e.hasExtraControls }]) },
              [
                v(
                  y,
                  {
                    modelValue: c.value,
                    "onUpdate:modelValue": a[2] || (a[2] = (r) => (c.value = r)),
                    options: k.value,
                    "label-key": "label",
                    "value-key": "id",
                    placeholder: "Select Address...",
                    disabled: e.disabledAddress || !i.value,
                  },
                  null,
                  8,
                  ["modelValue", "options", "disabled"],
                ),
              ],
              2,
            ),
            s(
              "div",
              {
                class: f([
                  "col-span-1 md:col-span-2 text-[11px] text-muted-foreground/80 space-y-1 leading-relaxed",
                  { "md:pt-[40px]": e.hasExtraControls, "md:pt-2.5": !e.hasExtraControls },
                ]),
              },
              [
                o.value
                  ? (n(),
                    d(
                      B,
                      { key: 0 },
                      [
                        s("div", D, l(o.value.fullAddress), 1),
                        s("div", M, [
                          a[3] || (a[3] = s("span", { class: "mr-2" }, "Country:", -1)),
                          s("span", $, l(o.value.country), 1),
                        ]),
                        s("div", j, [
                          a[4] || (a[4] = s("span", { class: "mr-2" }, "City:", -1)),
                          s("span", q, l(o.value.city), 1),
                        ]),
                        o.value.taxId
                          ? (n(),
                            d("div", T, [
                              a[5] || (a[5] = s("span", { class: "mr-2" }, "Tax ID:", -1)),
                              s("span", R, l(o.value.taxId), 1),
                            ]))
                          : p("", !0),
                      ],
                      64,
                    ))
                  : (n(), d("div", U, " Select company ")),
              ],
              2,
            ),
          ],
          4,
        )
      );
    },
  });
export { O as _ };
