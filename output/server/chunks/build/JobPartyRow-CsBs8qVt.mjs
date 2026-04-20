import { defineComponent, mergeModels, useModel, computed, mergeProps, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrInterpolate,
  ssrRenderSlot,
  ssrRenderComponent,
  ssrRenderClass,
} from "vue/server-renderer";
import { C as Combobox } from "./Combobox-BrxCx0QJ.mjs";
import "lucide-vue-next";
import "@vueuse/core";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "JobPartyRow",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(
    {
      label: {},
      description: {},
      required: { type: Boolean },
      companies: {},
      disabledCompany: { type: Boolean },
      disabledAddress: { type: Boolean },
      zIndex: {},
      hasExtraControls: { type: Boolean },
    },
    {
      companyId: {},
      companyIdModifiers: {},
      addressId: {},
      addressIdModifiers: {},
    },
  ),
  emits: /* @__PURE__ */ mergeModels(["create"], ["update:companyId", "update:addressId"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const companyId = useModel(__props, "companyId");
    const addressId = useModel(__props, "addressId");
    const emit = __emit;
    const company = computed(() => props.companies.find((c) => c.id === companyId.value));
    const addressOptions = computed(() => {
      return (company.value?.addresses || []).map((addr) => ({
        id: addr.id,
        label: `${addr.label || "Default"} (${addr.city || "No City"})`,
      }));
    });
    const addressDetails = computed(() => {
      if (!company.value || !addressId.value) return null;
      return company.value.addresses?.find((a) => a.id === addressId.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<div${ssrRenderAttrs(
          mergeProps(
            {
              class:
                "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 md:px-6 py-5 items-start hover:bg-muted/5 transition-colors relative",
              style: { zIndex: __props.zIndex },
            },
            _attrs,
          ),
        )}><div class="col-span-1 md:col-span-2 font-semibold text-[11px] md:pt-2.5 text-muted-foreground uppercase tracking-wider flex flex-col"><span>${ssrInterpolate(__props.label)} `,
      );
      if (__props.required) {
        _push(`<span class="text-destructive">*</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span>`);
      if (__props.description) {
        _push(
          `<span class="text-[10px] font-normal lowercase mt-0.5 opacity-70">${ssrInterpolate(__props.description)}</span>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `</div><div class="col-span-1 md:col-span-4 space-y-2 transform transition-transform flex flex-col">`,
      );
      ssrRenderSlot(_ctx.$slots, "extra-controls", {}, null, _push, _parent);
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: companyId.value,
            "onUpdate:modelValue": ($event) => (companyId.value = $event),
            options: __props.companies,
            "label-key": "name",
            "value-key": "id",
            placeholder: "Select Company...",
            "allow-create": "",
            disabled: __props.disabledCompany,
            onCreate: (name) => emit("create", name),
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="${ssrRenderClass([{ "md:pt-[38px]": __props.hasExtraControls }, "col-span-1 md:col-span-4"])}">`,
      );
      _push(
        ssrRenderComponent(
          Combobox,
          {
            modelValue: addressId.value,
            "onUpdate:modelValue": ($event) => (addressId.value = $event),
            options: addressOptions.value,
            "label-key": "label",
            "value-key": "id",
            placeholder: "Select Address...",
            disabled: __props.disabledAddress || !companyId.value,
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div class="${ssrRenderClass([{ "md:pt-[40px]": __props.hasExtraControls, "md:pt-2.5": !__props.hasExtraControls }, "col-span-1 md:col-span-2 text-[11px] text-muted-foreground/80 space-y-1 leading-relaxed"])}">`,
      );
      if (addressDetails.value) {
        _push(
          `<!--[--><div class="border-b border-border/40 pb-1.5 mb-1.5 text-foreground leading-snug font-medium">${ssrInterpolate(addressDetails.value.fullAddress)}</div><div class="flex justify-between items-center opacity-80"><span class="mr-2">Country:</span><span class="text-foreground shrink-0">${ssrInterpolate(addressDetails.value.country)}</span></div><div class="flex justify-between items-center opacity-80"><span class="mr-2">City:</span><span class="text-foreground shrink-0">${ssrInterpolate(addressDetails.value.city)}</span></div>`,
        );
        if (addressDetails.value.taxId) {
          _push(
            `<div class="flex justify-between items-center opacity-80 pt-0.5"><span class="mr-2">Tax ID:</span><span class="text-foreground shrink-0">${ssrInterpolate(addressDetails.value.taxId)}</span></div>`,
          );
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(
          `<div class="text-center italic opacity-40 bg-muted/20 py-4 rounded-lg border border-dashed border-border/40 text-[10px]"> Select company </div>`,
        );
      }
      _push(`</div></div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/operational/jobs/components/JobPartyRow.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=JobPartyRow-CsBs8qVt.mjs.map
