import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderList,
  ssrRenderClass,
  ssrRenderComponent,
} from "vue/server-renderer";
import _sfc_main$1 from "./CompanyActivityTab-CyC0EgTh.mjs";
import _sfc_main$2 from "./CompanyJobTab-CfI_QLca.mjs";
import _sfc_main$3 from "./CompanyInvoiceTab-DxL6RABJ.mjs";
import _sfc_main$4 from "./CompanyAddressTab-CvjBOTg2.mjs";
import _sfc_main$5 from "./CompanyNotesTab-BrQDifYh.mjs";
import "lucide-vue-next";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyMainContent",
  __ssrInlineRender: true,
  props: {
    company: {},
    activeTab: {},
    tabList: {},
    activeAddressMenu: {},
  },
  emits: ["update:activeTab", "add-address", "edit-address", "delete-address", "toggle-menu"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const addresses = computed(() => props.company.addresses || []);
    const activities = computed(() => props.company.activities || []);
    const jobs = computed(() => props.company.jobs || []);
    const invoices = computed(() => props.company.invoices || []);
    const totalJobs = computed(() => props.company.totalJobs || 0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex-1 self-stretch flex flex-col justify-center items-end gap-4 overflow-hidden" }, _attrs))}><div class="self-stretch flex-1 flex flex-col justify-start items-start overflow-hidden"><div class="self-stretch p-5 flex justify-start items-center gap-4"><div class="flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"><div class="justify-start text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> Total Job </div><div class="text-center justify-start text-black text-base font-semibold font-[&#39;Inter&#39;] leading-6">${ssrInterpolate(unref(totalJobs))}</div></div><div class="flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"><div class="justify-start text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> Type </div><div class="text-center justify-start text-black text-base font-semibold font-[&#39;Inter&#39;] leading-6">`,
      );
      if (__props.company.isCustomer && __props.company.isVendor) {
        _push(`<span>Both</span>`);
      } else if (__props.company.isCustomer) {
        _push(`<span>Customer</span>`);
      } else if (__props.company.isVendor) {
        _push(`<span>Vendor</span>`);
      } else {
        _push(`<span>-</span>`);
      }
      _push(
        `</div></div><div class="flex-1 p-3 bg-slate-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex flex-col justify-center items-start"><div class="justify-start text-gray-500 text-sm font-normal font-[&#39;Inter&#39;] leading-5"> Status </div><div class="text-center justify-start text-[#012D5A] text-base font-semibold font-[&#39;Inter&#39;] leading-6">${ssrInterpolate(__props.company.isActive ? "Active" : "Inactive")}</div></div></div><div class="self-stretch flex flex-col justify-start items-start gap-4 flex-1 overflow-hidden"><div class="self-stretch border-b border-black/5 flex justify-start items-start gap-2.5 overflow-hidden shrink-0"><!--[-->`,
      );
      ssrRenderList(__props.tabList, (tab) => {
        _push(
          `<div class="${ssrRenderClass([
            "px-4 py-3 border-b inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden cursor-pointer transition-colors",
            __props.activeTab === tab
              ? "border-[#012D5A]"
              : "border-transparent hover:border-gray-200",
          ])}"><div class="${ssrRenderClass([
            "justify-start text-sm leading-5",
            __props.activeTab === tab
              ? "text-[#012D5A] font-semibold font-['Inter']"
              : "text-black font-normal font-['Inter']",
          ])}">${ssrInterpolate(tab)}</div></div>`,
        );
      });
      _push(
        `<!--]--></div><div class="self-stretch px-5 flex flex-col justify-start items-start gap-4 overflow-y-auto flex-1 pb-4">`,
      );
      if (__props.activeTab === "Activity") {
        _push(ssrRenderComponent(_sfc_main$1, { activities: unref(activities) }, null, _parent));
      } else if (__props.activeTab === "Job") {
        _push(
          ssrRenderComponent(
            _sfc_main$2,
            {
              jobs: unref(jobs),
              "company-code": __props.company.code,
            },
            null,
            _parent,
          ),
        );
      } else if (__props.activeTab === "Invoice") {
        _push(ssrRenderComponent(_sfc_main$3, { invoices: unref(invoices) }, null, _parent));
      } else if (__props.activeTab === "Address") {
        _push(
          ssrRenderComponent(
            _sfc_main$4,
            {
              addresses: unref(addresses),
              "active-address-menu": __props.activeAddressMenu,
              onAddAddress: ($event) => emit("add-address"),
              onEditAddress: ($event) => emit("edit-address", $event),
              onDeleteAddress: ($event) => emit("delete-address", $event),
              onToggleMenu: ($event) => emit("toggle-menu", $event),
            },
            null,
            _parent,
          ),
        );
      } else if (__props.activeTab === "Notes") {
        _push(
          ssrRenderComponent(
            _sfc_main$5,
            {
              notes: __props.company.notes,
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(
          `<div class="w-full py-12 flex flex-col items-center justify-center text-gray-400"><p class="text-sm">No data available for ${ssrInterpolate(__props.activeTab.toLowerCase())} yet.</p></div>`,
        );
      }
      _push(`</div></div></div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyMainContent.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyMainContent-CRL18xQD.mjs.map
