import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { Check } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    disabled: { type: Boolean },
    class: {},
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<button${ssrRenderAttrs(
          mergeProps(
            {
              type: "button",
              role: "checkbox",
              "aria-checked": __props.modelValue,
              disabled: __props.disabled,
              class: unref(cn)(
                "peer h-5 w-5 shrink-0 rounded border border-muted-foreground/30 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                __props.modelValue
                  ? "bg-[#012D5A] border-[#012D5A] text-white"
                  : "hover:border-[#012D5A]/50 bg-white",
                props.class,
              ),
            },
            _attrs,
          ),
        )}>`,
      );
      if (__props.modelValue) {
        _push(`<div class="flex items-center justify-center w-full h-full">`);
        _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5 stroke-[3]" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/Checkbox.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "UiCheckbox" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Checkbox-BPDemuax.mjs.map
