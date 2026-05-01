import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrRenderComponent,
  ssrInterpolate,
} from "vue/server-renderer";
import { Building2, MoreVertical, Mail, Phone } from "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyGrid",
  __ssrInlineRender: true,
  props: {
    companies: {},
  },
  emits: ["open-detail"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, _attrs))}><!--[-->`,
      );
      ssrRenderList(__props.companies, (company) => {
        _push(
          `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">`,
        );
        _push(
          ssrRenderComponent(unref(Building2), { class: "w-6 h-6 text-[#012D5A]" }, null, _parent),
        );
        _push(
          `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(company.name)}</h3><p class="text-xs text-muted-foreground">${ssrInterpolate(company.code)}</p></div></div><button class="text-muted-foreground hover:text-foreground">`,
        );
        _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
        _push(
          `</button></div><div class="space-y-2 mb-6"><div class="flex items-center gap-3 text-sm text-gray-600">`,
        );
        _push(ssrRenderComponent(unref(Mail), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span>${ssrInterpolate(company.email)}</span></div><div class="flex items-center gap-3 text-sm text-gray-600">`,
        );
        _push(ssrRenderComponent(unref(Phone), { class: "w-4 h-4" }, null, _parent));
        _push(
          `<span>${ssrInterpolate(company.phone)}</span></div></div><div class="flex items-center justify-between pt-4 border-t border-border"><div class="flex items-center gap-2"><span class="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">${ssrInterpolate(company.type)}</span><span class="px-2 py-0.5 rounded border border-blue-200 text-blue-500 bg-white text-xs font-medium">${ssrInterpolate(company.status)}</span></div><div class="text-right"><span class="font-bold text-sm text-foreground">${ssrInterpolate(company.totalJobs)}</span><span class="text-xs text-muted-foreground ml-1">Total Job</span></div></div></div>`,
        );
      });
      _push(`<!--]-->`);
      if (__props.companies.length === 0) {
        _push(
          `<div class="col-span-2 py-8 text-center text-muted-foreground"> No companies found </div>`,
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
    "pages/master/company/components/CompanyGrid.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyGrid-BtmfT20H.mjs.map
