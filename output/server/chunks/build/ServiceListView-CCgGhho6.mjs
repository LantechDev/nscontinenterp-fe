import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ChevronDown, MoreVertical } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ServiceListView",
  __ssrInlineRender: true,
  props: {
    services: {},
    sortField: {},
    sortDirection: {},
  },
  emits: ["toggle-sort", "row-click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isAllSelected = computed(() => {
      return props.services.length > 0 && props.services.every((s) => s.selected);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl bg-white overflow-hidden" }, _attrs))}><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 w-10"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(isAllSelected)) ? ssrLooseContain(unref(isAllSelected), null) : unref(isAllSelected)) ? " checked" : ""} class="w-4 h-4 rounded border-gray-300"></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Code `,
      );
      if (__props.sortField === "code") {
        _push(
          ssrRenderComponent(
            unref(ChevronDown),
            {
              class: ["w-4 h-4", { "rotate-180": __props.sortDirection === "desc" }],
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Service Name `,
      );
      if (__props.sortField === "name") {
        _push(
          ssrRenderComponent(
            unref(ChevronDown),
            {
              class: ["w-4 h-4", { "rotate-180": __props.sortDirection === "desc" }],
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Price `,
      );
      if (__props.sortField === "price") {
        _push(
          ssrRenderComponent(
            unref(ChevronDown),
            {
              class: ["w-4 h-4", { "rotate-180": __props.sortDirection === "desc" }],
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground">Unit</th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Status `,
      );
      if (__props.sortField === "status") {
        _push(
          ssrRenderComponent(
            unref(ChevronDown),
            {
              class: ["w-4 h-4", { "rotate-180": __props.sortDirection === "desc" }],
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</div></th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(__props.services, (service) => {
        _push(
          `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(service.selected) ? ssrLooseContain(service.selected, null) : service.selected) ? " checked" : ""} class="w-4 h-4 rounded border-gray-300"></td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(service.code)}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(service.name)}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(service.price)}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(service.unit)}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
              service.status === "Active"
                ? "text-blue-500 border-blue-200"
                : "text-red-500 border-red-200",
            ),
          )}">${ssrInterpolate(service.status)}</span></td><td class="py-3 px-4 text-right"><button class="text-muted-foreground hover:text-foreground">`,
        );
        _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (__props.services.length === 0) {
        _push(
          `<tr><td colspan="7" class="py-8 text-center text-muted-foreground">No services found</td></tr>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/services/components/ServiceListView.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ServiceListView-CCgGhho6.mjs.map
