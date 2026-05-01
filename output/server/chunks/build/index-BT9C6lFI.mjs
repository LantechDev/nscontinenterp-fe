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
import { u as useExpensePage } from "./useExpensePage-CibEMg65.mjs";

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ExpenseEditModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    isSubmitting: { type: Boolean },
    editError: {},
    editingExpenseId: {},
    formData: {},
    categoryOptions: {},
    companies: {},
    jobs: {},
  },
  emits: ["close", "submit"],
  setup(__props, { emit: __emit }) {
    useExpensePage();
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(
        _push,
        (_push2) => {
          if (__props.isOpen) {
            _push2(
              `<div class="fixed inset-0 z-[1100] flex items-center justify-center"><div class="absolute inset-0 bg-black/50"></div><div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"><div class="flex items-center justify-between p-6 border-b border-border"><h2 class="text-xl font-bold">Edit Biaya</h2><button class="p-1 hover:bg-muted rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div><form class="p-6 space-y-4">`,
            );
            if (__props.editError) {
              _push2(
                `<div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">${ssrInterpolate(__props.editError)}</div>`,
              );
            } else {
              _push2(`<!---->`);
            }
            _push2(
              `<div><label class="block text-sm font-medium mb-1">Nomor Biaya</label><input${ssrRenderAttr("value", __props.formData.number)} type="text" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"></div><div><label class="block text-sm font-medium mb-1">Deskripsi</label><textarea rows="2" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">${ssrInterpolate(__props.formData.description)}</textarea></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Jumlah</label><input${ssrRenderAttr("value", __props.formData.amount)} type="number" step="0.01" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"></div><div><label class="block text-sm font-medium mb-1">Tanggal</label><input${ssrRenderAttr("value", __props.formData.date)} type="date" required class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"></div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Vendor</label><select class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(__props.formData.vendorId) ? ssrLooseContain(__props.formData.vendorId, "") : ssrLooseEqual(__props.formData.vendorId, "")) ? " selected" : ""}>Pilih Vendor</option><!--[-->`,
            );
            ssrRenderList(__props.companies, (company) => {
              _push2(
                `<option${ssrRenderAttr("value", company.id)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.vendorId) ? ssrLooseContain(__props.formData.vendorId, company.id) : ssrLooseEqual(__props.formData.vendorId, company.id)) ? " selected" : ""}>${ssrInterpolate(company.name)}</option>`,
              );
            });
            _push2(
              `<!--]--></select></div><div><label class="block text-sm font-medium mb-1">Job</label><select class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(__props.formData.jobId) ? ssrLooseContain(__props.formData.jobId, "") : ssrLooseEqual(__props.formData.jobId, "")) ? " selected" : ""}>Pilih Job</option><!--[-->`,
            );
            ssrRenderList(__props.jobs, (job) => {
              _push2(
                `<option${ssrRenderAttr("value", job.id)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.jobId) ? ssrLooseContain(__props.formData.jobId, job.id) : ssrLooseEqual(__props.formData.jobId, job.id)) ? " selected" : ""}>${ssrInterpolate(job.jobNumber)}</option>`,
              );
            });
            _push2(
              `<!--]--></select></div></div><div><label class="block text-sm font-medium mb-1">Kategori</label><select class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"><!--[-->`,
            );
            ssrRenderList(__props.categoryOptions, (opt) => {
              _push2(
                `<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(__props.formData.categoryId) ? ssrLooseContain(__props.formData.categoryId, opt.value) : ssrLooseEqual(__props.formData.categoryId, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`,
              );
            });
            _push2(
              `<!--]--></select></div><div><label class="block text-sm font-medium mb-1">Catatan</label><textarea rows="2" class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary">${ssrInterpolate(__props.formData.notes)}</textarea></div><div class="flex justify-end gap-3 pt-4 border-t border-border"><button type="button" class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"> Batal </button><button type="submit"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""} class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50">${ssrInterpolate(__props.isSubmitting ? "Menyimpan..." : "Simpan")}</button></div></form></div></div>`,
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
    "pages/finance/expenses/components/ExpenseEditModal.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const ExpenseEditModalC1Z8cnVn = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

const indexBT9C6lFI = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      ExpenseEditModal: _sfc_main,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);

export { ExpenseEditModalC1Z8cnVn as E, _sfc_main as _, indexBT9C6lFI as i };
//# sourceMappingURL=index-BT9C6lFI.mjs.map
