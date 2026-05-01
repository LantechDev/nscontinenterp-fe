import { e as useRoute, u as useRuntimeConfig, _ as __nuxt_component_1$1 } from "./server.mjs";
import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "vue-router";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.id;
    const config = useRuntimeConfig();
    config.public.apiBase || "";
    const isLoading = ref(true);
    const error = ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 p-6" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div class="flex items-center gap-4"><button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Go back"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><div><h1 class="text-2xl font-bold">Closed Period Details</h1><p class="text-muted-foreground mt-1"> View detailed financial data for this closed period </p></div></div></div>`,
      );
      if (unref(isLoading)) {
        _push(
          `<div class="flex items-center justify-center py-20"><div class="flex items-center gap-2"><div class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"></div><span class="text-muted-foreground">Loading period details...</span></div></div>`,
        );
      } else if (unref(error)) {
        _push(
          `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"><p>${ssrInterpolate(unref(error))}</p><button class="mt-2 text-sm font-medium underline"> Try again </button></div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/finance-close/[id].vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Dm8Tq6y5.mjs.map
