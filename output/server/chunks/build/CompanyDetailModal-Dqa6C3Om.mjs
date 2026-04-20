import { defineComponent, computed, ref, watch, unref, useSSRContext } from "vue";
import {
  ssrRenderTeleport,
  ssrRenderStyle,
  ssrInterpolate,
  ssrRenderComponent,
} from "vue/server-renderer";
import { X } from "lucide-vue-next";
import _sfc_main$1 from "./CompanySidebar-C5zL0YBH.mjs";
import _sfc_main$3 from "./CompanyMainContent-CRL18xQD.mjs";
import _sfc_main$2 from "./CompanyAddressForm-VBZNMe2f.mjs";
import { useCompanyAddressForm } from "./useCompanyAddressForm-5b9x2tuV.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { n as navigateTo } from "./server.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "./CompanyActivityTab-CyC0EgTh.mjs";
import "./CompanyJobTab-CfI_QLca.mjs";
import "./CompanyInvoiceTab-DxL6RABJ.mjs";
import "./CompanyAddressTab-CvjBOTg2.mjs";
import "./CompanyNotesTab-BrQDifYh.mjs";
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
  __name: "CompanyDetailModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    company: {},
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { getCompanyDetails } = useCompanies();
    const isOpen = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });
    const activeTab = ref("Activity");
    const tabList = ["Activity", "Job", "Invoice", "Address", "Notes"];
    const companyDetails = ref(null);
    const isLoading = ref(false);
    const {
      activeAddressMenu,
      showAddressMenu,
      closeAddressMenu,
      addressMode,
      editingAddress,
      openAddAddressMode,
      openEditAddressMode,
      closeAddressMode,
      handleAddressSave,
      handleDeleteAddress,
      companyAddresses,
    } = useCompanyAddressForm(companyDetails);
    watch(
      () => props.modelValue,
      async (val) => {
        if (val && props.company?.id) {
          activeTab.value = "Activity";
          isLoading.value = true;
          const { success, data } = await getCompanyDetails(props.company.id);
          if (success && data) {
            companyDetails.value = data;
          }
          isLoading.value = false;
        }
      },
    );
    watch(
      () => props.modelValue,
      (val) => {
        if (!val) {
          closeAddressMode();
          closeAddressMenu();
          companyDetails.value = null;
        }
      },
    );
    const navigateToNewJob = () => {
      isOpen.value = false;
      navigateTo("/operational/jobs/create");
    };
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (isOpen.value) {
            _push2(
              `<div class="fixed inset-0 z-[1050] flex justify-end" data-v-9b3c022e><div class="absolute inset-0 bg-black/40 transition-opacity" data-v-9b3c022e></div><div class="slide-panel relative w-full bg-white h-full shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300" style="${ssrRenderStyle(unref(addressMode) !== "view" ? "max-width: 600px;" : "max-width: calc(100vw - 320px);")}" data-v-9b3c022e>`,
            );
            if (isLoading.value) {
              _push2(
                `<div class="flex items-center justify-center h-full" data-v-9b3c022e><div class="flex flex-col items-center gap-3" data-v-9b3c022e><div class="h-10 w-10 animate-spin rounded-full border-4 border-[#012D5A] border-t-transparent" data-v-9b3c022e></div><p class="text-sm text-gray-500" data-v-9b3c022e>Loading company details...</p></div></div>`,
              );
            } else if (companyDetails.value) {
              _push2(
                `<div class="w-full h-full bg-white flex flex-col overflow-hidden" data-v-9b3c022e><div class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20" data-v-9b3c022e><div class="flex items-center gap-2 text-sm text-muted-foreground font-medium" data-v-9b3c022e> Master Data <span class="mx-1" data-v-9b3c022e>›</span> Company <span class="mx-1" data-v-9b3c022e>›</span><span class="text-foreground" data-v-9b3c022e>${ssrInterpolate(companyDetails.value.name)}</span>`,
              );
              if (unref(addressMode) !== "view") {
                _push2(
                  `<!--[--><span class="mx-1" data-v-9b3c022e>›</span> Address <span class="mx-1" data-v-9b3c022e>›</span><span class="text-foreground" data-v-9b3c022e>${ssrInterpolate(unref(addressMode) === "add" ? "Add" : "Edit")}</span><!--]-->`,
                );
              } else {
                _push2(`<!---->`);
              }
              _push2(
                `</div><div class="flex items-center gap-2" data-v-9b3c022e><button class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" data-v-9b3c022e>`,
              );
              _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
              _push2(
                `</button></div></div><div class="self-stretch flex-1 flex justify-start items-stretch overflow-hidden" data-v-9b3c022e>`,
              );
              if (unref(addressMode) === "view") {
                _push2(
                  ssrRenderComponent(
                    _sfc_main$1,
                    {
                      company: companyDetails.value,
                      addresses: unref(companyAddresses),
                      "active-address-menu": unref(activeAddressMenu),
                      onNewJob: navigateToNewJob,
                      onAddAddress: unref(openAddAddressMode),
                      onEditAddress: unref(openEditAddressMode),
                      onToggleMenu: unref(showAddressMenu),
                      onCloseMenu: unref(closeAddressMenu),
                      onDeleteAddress: unref(handleDeleteAddress),
                    },
                    null,
                    _parent,
                  ),
                );
              } else {
                _push2(`<!---->`);
              }
              if (unref(addressMode) !== "view") {
                _push2(
                  ssrRenderComponent(
                    _sfc_main$2,
                    {
                      mode: unref(addressMode),
                      "company-id": companyDetails.value.id,
                      address: unref(editingAddress),
                      onCancel: unref(closeAddressMode),
                      onSave: unref(handleAddressSave),
                    },
                    null,
                    _parent,
                  ),
                );
              } else {
                _push2(`<!---->`);
              }
              if (unref(addressMode) === "view") {
                _push2(
                  ssrRenderComponent(
                    _sfc_main$3,
                    {
                      company: companyDetails.value,
                      "active-tab": activeTab.value,
                      "tab-list": tabList,
                      "active-address-menu": unref(activeAddressMenu),
                      "onUpdate:activeTab": ($event) => (activeTab.value = $event),
                      onAddAddress: unref(openAddAddressMode),
                      onEditAddress: unref(openEditAddressMode),
                      onToggleMenu: unref(showAddressMenu),
                      onDeleteAddress: unref(handleDeleteAddress),
                    },
                    null,
                    _parent,
                  ),
                );
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
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
    "pages/master/company/components/CompanyDetailModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CompanyDetailModal = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ["__scopeId", "data-v-9b3c022e"],
]);

export { CompanyDetailModal as default };
//# sourceMappingURL=CompanyDetailModal-Dqa6C3Om.mjs.map
