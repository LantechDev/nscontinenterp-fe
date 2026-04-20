import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { Package, MoreVertical } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ServiceGridView",
  __ssrInlineRender: true,
  props: {
    services: {},
  },
  emits: ["row-click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, _attrs))}><!--[-->`,
      );
      ssrRenderList(__props.services, (service) => {
        _push(
          `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">`,
        );
        _push(
          ssrRenderComponent(unref(Package), { class: "w-6 h-6 text-[#012D5A]" }, null, _parent),
        );
        _push(
          `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(service.name)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(service.code)}</p></div></div><button class="text-muted-foreground hover:text-foreground">`,
        );
        _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
        _push(
          `</button></div><div class="space-y-1 mb-6"><div class="flex items-baseline gap-1"><span class="text-lg font-bold text-foreground">${ssrInterpolate(service.price)}</span></div><p class="text-xs text-muted-foreground">${ssrInterpolate(service.unit)}</p></div><div class="flex items-center justify-between pt-4 border-t border-border"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
              service.status === "Active"
                ? "text-blue-500 border-blue-200"
                : "text-red-500 border-red-200",
            ),
          )}">${ssrInterpolate(service.status)}</span></div></div>`,
        );
      });
      _push(`<!--]-->`);
      if (__props.services.length === 0) {
        _push(
          `<div class="col-span-3 py-8 text-center text-muted-foreground"> No services found </div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/services/components/ServiceGridView.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ServiceGridView-BmWLe_q5.mjs.map
