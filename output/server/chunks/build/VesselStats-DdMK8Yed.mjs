import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Ship } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VesselStats",
  __ssrInlineRender: true,
  props: {
    total: {},
    active: {},
    inactive: {},
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, _attrs))}><div class="bg-white border border-border rounded-xl p-5"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">`,
      );
      _push(ssrRenderComponent(unref(Ship), { class: "w-6 h-6 text-blue-600" }, null, _parent));
      _push(
        `</div><div><p class="text-sm text-muted-foreground">Total Vessels</p><p class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.total)}</p></div></div></div><div class="bg-white border border-border rounded-xl p-5"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">`,
      );
      _push(ssrRenderComponent(unref(Ship), { class: "w-6 h-6 text-green-600" }, null, _parent));
      _push(
        `</div><div><p class="text-sm text-muted-foreground">Active Vessels</p><p class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.active)}</p></div></div></div><div class="bg-white border border-border rounded-xl p-5"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">`,
      );
      _push(ssrRenderComponent(unref(Ship), { class: "w-6 h-6 text-red-600" }, null, _parent));
      _push(
        `</div><div><p class="text-sm text-muted-foreground">Inactive Vessels</p><p class="text-2xl font-bold text-foreground">${ssrInterpolate(__props.inactive)}</p></div></div></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/vessel/components/VesselStats.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=VesselStats-DdMK8Yed.mjs.map
