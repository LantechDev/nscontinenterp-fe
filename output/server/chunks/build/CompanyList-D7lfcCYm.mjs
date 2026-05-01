import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderList,
  ssrInterpolate,
  ssrRenderClass,
} from "vue/server-renderer";
import { ChevronDown, MoreVertical } from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { _ as __nuxt_component_0 } from "./Checkbox-BPDemuax.mjs";
import "clsx";
import "tailwind-merge";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyList",
  __ssrInlineRender: true,
  props: {
    companies: {},
    sortField: {},
    sortDirection: {},
    selectAll: { type: Boolean },
  },
  emits: ["update:sort", "open-detail", "update:selectAll"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "border border-border rounded-xl bg-white overflow-hidden" }, _attrs))}><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 w-10">`,
      );
      _push(
        ssrRenderComponent(
          unref(__nuxt_component_0),
          {
            "model-value": __props.selectAll,
            "onUpdate:modelValue": ($event) => _ctx.$emit("update:selectAll", $event),
          },
          null,
          _parent,
        ),
      );
      _push(
        `</th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> No. Cust `,
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
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Company `,
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
        `</div></th><th class="py-3 px-4 text-sm font-medium text-foreground">Email</th><th class="py-3 px-4 text-sm font-medium text-foreground">Total Job</th><th class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"><div class="flex items-center gap-1"> Type `,
      );
      if (__props.sortField === "type") {
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
      ssrRenderList(__props.companies, (company) => {
        _push(
          `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"><td class="py-3 px-4">`,
        );
        _push(
          ssrRenderComponent(
            unref(__nuxt_component_0),
            {
              modelValue: company.selected,
              "onUpdate:modelValue": ($event) => (company.selected = $event),
            },
            null,
            _parent,
          ),
        );
        _push(
          `</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(company.code)}</td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(company.name)}</td><td class="py-3 px-4 text-sm font-normal">${ssrInterpolate(company.email)}</td><td class="py-3 px-4 text-sm">${ssrInterpolate(company.totalJobs)}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-1 rounded text-xs font-medium",
              company.type === "Shipper"
                ? "bg-gray-100 text-gray-700"
                : company.type === "Consignee"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-900 text-white",
            ),
          )}">${ssrInterpolate(company.type)}</span></td><td class="py-3 px-4"><span class="${ssrRenderClass(
            unref(cn)(
              "px-2 py-0.5 rounded border text-xs font-medium bg-white",
              company.status === "Active"
                ? "text-blue-500 border-blue-200"
                : "text-red-500 border-red-200",
            ),
          )}">${ssrInterpolate(company.status)}</span></td><td class="py-3 px-4 text-right"><button class="text-muted-foreground hover:text-foreground">`,
        );
        _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></td></tr>`);
      });
      _push(`<!--]-->`);
      if (__props.companies.length === 0) {
        _push(
          `<tr><td colspan="8" class="py-8 text-center text-muted-foreground">No companies found</td></tr>`,
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
    "pages/master/company/components/CompanyList.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyList-D7lfcCYm.mjs.map
