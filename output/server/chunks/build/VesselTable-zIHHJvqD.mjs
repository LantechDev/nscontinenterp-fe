import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VesselTable",
  __ssrInlineRender: true,
  props: {
    vessels: {},
    sortField: {},
    sortDirection: {},
    openMenuId: {},
  },
  emits: ["toggle-sort", "toggle-menu", "edit", "delete"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl bg-white overflow-hidden" }, _attrs))}><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> IMO Number `,
      );
      if (__props.sortField === "imoNumber") {
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
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Vessel Name `,
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
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Create Date `,
      );
      if (__props.sortField === "createdAt") {
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
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Status `,
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
      ssrRenderList(__props.vessels, (vessel) => {
        _push(
          `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(vessel.imoNumber)}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(vessel.name)}</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(vessel.createdAt)}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
              vessel.status === "Active"
                ? "text-blue-500 border-blue-200"
                : "text-red-500 border-red-200",
            ),
          )}">${ssrInterpolate(vessel.status)}</span></td><td class="py-3 px-4 text-right relative"><button class="text-muted-foreground hover:text-foreground dropdown-menu">`,
        );
        _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
        _push(`</button>`);
        if (__props.openMenuId === vessel.id) {
          _push(
            `<div class="absolute right-4 top-10 z-10 w-36 bg-white border border-border rounded-lg shadow-lg overflow-hidden dropdown-menu"><button class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">`,
          );
          _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
          _push(
            ` Edit </button><button class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">`,
          );
          _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
          _push(` Delete </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]-->`);
      if (__props.vessels.length === 0) {
        _push(
          `<tr><td colspan="5" class="py-8 text-center text-muted-foreground">No vessels found</td></tr>`,
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
    "pages/master/vessel/components/VesselTable.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=VesselTable-zIHHJvqD.mjs.map
