import { defineComponent, ref, watch, mergeProps, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
} from "vue/server-renderer";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CompanyAddressForm",
  __ssrInlineRender: true,
  props: {
    mode: {},
    companyId: {},
    address: {},
  },
  emits: ["cancel", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const defaultFormData = {
      label: "",
      type: "main",
      fullAddress: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "id",
      eori: "",
    };
    const formData = ref({ ...defaultFormData });
    watch(
      () => props.address,
      (newAddress) => {
        if (props.mode === "edit" && newAddress) {
          formData.value = {
            label: newAddress.label || "",
            type: "main",
            // Default type since it's not in Address type
            fullAddress: newAddress.fullAddress || "",
            street: newAddress.street || "",
            city: newAddress.city || "",
            state: newAddress.state || "",
            postalCode: newAddress.postalCode || "",
            country: newAddress.country || "id",
            eori: newAddress.eori || "",
          };
        } else if (props.mode === "add") {
          formData.value = { ...defaultFormData };
        }
      },
      { immediate: true },
    );
    watch(
      () => props.mode,
      (newMode) => {
        if (newMode === "add") {
          formData.value = { ...defaultFormData };
        }
      },
    );
    const isSubmitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "flex-1 self-stretch flex flex-col overflow-hidden" }, _attrs))}><div class="self-stretch flex-1 p-6 overflow-y-auto"><div class="self-stretch flex flex-col gap-6"><div class="text-black text-lg font-semibold font-[&#39;Inter&#39;] leading-7">${ssrInterpolate(__props.mode === "add" ? "Add New Address" : "Edit Address")}</div><div class="self-stretch flex flex-col gap-4"><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Address Label <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", formData.value.label)} type="text" placeholder="e.g., Head Office, Branch, Warehouse" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Type</label><select class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="main"${ssrIncludeBooleanAttr(Array.isArray(formData.value.type) ? ssrLooseContain(formData.value.type, "main") : ssrLooseEqual(formData.value.type, "main")) ? " selected" : ""}>Main</option><option value="branch"${ssrIncludeBooleanAttr(Array.isArray(formData.value.type) ? ssrLooseContain(formData.value.type, "branch") : ssrLooseEqual(formData.value.type, "branch")) ? " selected" : ""}>Branch</option><option value="warehouse"${ssrIncludeBooleanAttr(Array.isArray(formData.value.type) ? ssrLooseContain(formData.value.type, "warehouse") : ssrLooseEqual(formData.value.type, "warehouse")) ? " selected" : ""}>Warehouse</option></select></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Full Address <span class="text-red-500">*</span></label><textarea rows="3" placeholder="Enter full address" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none">${ssrInterpolate(formData.value.fullAddress)}</textarea></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Street</label><input${ssrRenderAttr("value", formData.value.street)} type="text" placeholder="Enter street name" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div><div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">City</label><input${ssrRenderAttr("value", formData.value.city)} type="text" placeholder="Enter city" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">State</label><input${ssrRenderAttr("value", formData.value.state)} type="text" placeholder="Enter state/province" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div></div><div class="grid grid-cols-2 gap-4"><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Postal Code</label><input${ssrRenderAttr("value", formData.value.postalCode)} type="text" placeholder="Enter postal code" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">Country</label><select class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"><option value="id"${ssrIncludeBooleanAttr(Array.isArray(formData.value.country) ? ssrLooseContain(formData.value.country, "id") : ssrLooseEqual(formData.value.country, "id")) ? " selected" : ""}>Indonesia</option><option value="sg"${ssrIncludeBooleanAttr(Array.isArray(formData.value.country) ? ssrLooseContain(formData.value.country, "sg") : ssrLooseEqual(formData.value.country, "sg")) ? " selected" : ""}>Singapore</option><option value="my"${ssrIncludeBooleanAttr(Array.isArray(formData.value.country) ? ssrLooseContain(formData.value.country, "my") : ssrLooseEqual(formData.value.country, "my")) ? " selected" : ""}>Malaysia</option></select></div></div><div class="flex flex-col gap-1.5"><label class="text-sm font-medium text-slate-700">EORI Number</label><input${ssrRenderAttr("value", formData.value.eori)} type="text" placeholder="Enter EORI number" class="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></div></div></div></div><div class="self-stretch border-t border-slate-300 flex justify-end gap-3 p-4 bg-white shrink-0"><button class="px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"> Cancel </button><button class="px-4 py-2 bg-primary rounded-md text-sm text-white hover:bg-primary/90 transition-colors disabled:opacity-50"${ssrIncludeBooleanAttr(isSubmitting.value || !formData.value.label || !formData.value.fullAddress) ? " disabled" : ""}>${ssrInterpolate(__props.mode === "add" ? "Add Address" : "Save Changes")}</button></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/master/company/components/CompanyAddressForm.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=CompanyAddressForm-VBZNMe2f.mjs.map
