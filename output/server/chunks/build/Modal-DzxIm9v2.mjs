import { defineComponent, unref, useSSRContext } from "vue";
import {
  ssrRenderTeleport,
  ssrRenderClass,
  ssrInterpolate,
  ssrRenderComponent,
  ssrRenderSlot,
} from "vue/server-renderer";
import { X } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    title: {},
    description: {},
    width: {},
  },
  emits: ["update:modelValue", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (__props.modelValue) {
            _push2(
              `<div class="fixed inset-0 z-[1100] flex items-center justify-center p-4"><div class="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"></div><div class="${ssrRenderClass(
                unref(cn)(
                  "relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95",
                  props.width || "max-w-3xl",
                ),
              )}"><div class="flex items-start justify-between px-6 py-4 border-b border-border"><div>`,
            );
            if (__props.title) {
              _push2(
                `<h2 class="text-xl font-bold text-foreground overflow-hidden text-ellipsis">${ssrInterpolate(__props.title)}</h2>`,
              );
            } else {
              _push2(`<!---->`);
            }
            if (__props.description) {
              _push2(
                `<p class="text-sm text-muted-foreground mt-1">${ssrInterpolate(__props.description)}</p>`,
              );
            } else {
              _push2(`<!---->`);
            }
            _push2(
              `</div><button class="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">`,
            );
            _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
            _push2(`</button></div><div class="p-6 overflow-y-auto">`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
            _push2(`</div>`);
            if (_ctx.$slots.footer) {
              _push2(
                `<div class="px-6 py-4 border-t border-border bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3">`,
              );
              ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
        },
        "body",
        false,
        _parent,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "components/ui/Modal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "UiModal" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Modal-DzxIm9v2.mjs.map
