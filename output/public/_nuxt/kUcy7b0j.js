import { c as r } from "./DrxnuvjT.js";
import { C as c } from "./C0WRWJjF.js";
import { e as d, R as t, $ as u, K as s, S as m, a2 as b, _ as a } from "./D9q6143x.js";
const f = ["aria-checked", "disabled"],
  h = { key: 0, class: "flex items-center justify-center w-full h-full" },
  k = d({
    __name: "Checkbox",
    props: { modelValue: { type: Boolean }, disabled: { type: Boolean }, class: {} },
    emits: ["update:modelValue"],
    setup(e, { emit: l }) {
      const o = e,
        n = l,
        i = () => {
          o.disabled || n("update:modelValue", !o.modelValue);
        };
      return (g, p) => (
        a(),
        t(
          "button",
          {
            type: "button",
            role: "checkbox",
            "aria-checked": e.modelValue,
            disabled: e.disabled,
            onClick: i,
            class: u(
              s(r)(
                "peer h-5 w-5 shrink-0 rounded border border-muted-foreground/30 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                e.modelValue
                  ? "bg-[#012D5A] border-[#012D5A] text-white"
                  : "hover:border-[#012D5A]/50 bg-white",
                o.class,
              ),
            ),
          },
          [
            e.modelValue
              ? (a(), t("div", h, [b(s(c), { class: "h-3.5 w-3.5 stroke-[3]" })]))
              : m("", !0),
          ],
          10,
          f,
        )
      );
    },
  }),
  C = Object.assign(k, { __name: "UiCheckbox" });
export { C as _ };
