import { defineComponent, useSSRContext } from "vue";
import {
  ssrRenderTeleport,
  ssrInterpolate,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
} from "vue/server-renderer";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TaxEditModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    isSubmitting: { type: Boolean },
    editError: {},
    editingTaxId: {},
    formData: {},
    taxTypeOptions: {},
  },
  emits: ["close", "submit"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (__props.isOpen) {
            _push2(
              `<div class="fixed inset-0 z-[1100] flex items-center justify-center"><div class="absolute inset-0 bg-black/50"></div><div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between p-6 border-b border-border"><h2 class="text-xl font-bold">Edit Pajak</h2><button class="p-1 hover:bg-muted rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div><form class="p-6 space-y-4">`,
            );
            if (__props.editError) {
              _push2(
                `<div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">${ssrInterpolate(__props.editError)}</div>`,
              );
            } else {
              _push2(`<!---->`);
            }
            _push2(
              `<div><label class="block text-sm font-medium mb-1">Nama Pajak</label><input${ssrRenderAttr("value", __props.formData.name)} type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Tipe</label><select required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(__props.formData.type) ? ssrLooseContain(__props.formData.type, "") : ssrLooseEqual(__props.formData.type, "")) ? " selected" : ""}>Pilih Tipe</option><!--[-->`,
            );
            ssrRenderList(__props.taxTypeOptions, (opt) => {
              _push2(
                `<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.type) ? ssrLooseContain(__props.formData.type, opt.value) : ssrLooseEqual(__props.formData.type, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`,
              );
            });
            _push2(
              `<!--]--></select></div><div><label class="block text-sm font-medium mb-1">Rate (%)</label><input${ssrRenderAttr("value", __props.formData.rate)} type="number" step="0.01" min="0" max="100" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"></div></div><div><label class="block text-sm font-medium mb-1">Deskripsi</label><textarea rows="2" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">${ssrInterpolate(__props.formData.description)}</textarea></div><div class="flex items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(__props.formData.isActive) ? ssrLooseContain(__props.formData.isActive, null) : __props.formData.isActive) ? " checked" : ""} type="checkbox" id="isActive" class="w-4 h-4 rounded border-border text-[#012D5A] focus:ring-[#012D5A]"><label for="isActive" class="text-sm font-medium">Pajak Aktif</label></div><div class="flex justify-end gap-3 pt-4 border-t border-border"><button type="button" class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50">${ssrInterpolate(__props.isSubmitting ? "Menyimpan..." : "Simpan")}</button></div></form></div></div>`,
            );
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
    "pages/finance/tax/components/TaxEditModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const TaxEditModalBEm0lFoO = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

const indexXuQBAI3p = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      TaxEditModal: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

export { TaxEditModalBEm0lFoO as T, _sfc_main as _, indexXuQBAI3p as i };
//# sourceMappingURL=index-xuQBAI3p.mjs.map
