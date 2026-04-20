import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import {
  defineComponent,
  unref,
  withCtx,
  createVNode,
  ref,
  computed,
  watch,
  useSSRContext,
} from "vue";
import {
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderAttr,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderList,
  ssrInterpolate,
} from "vue/server-renderer";
import {
  LayoutList,
  LayoutGrid,
  Search,
  Plus,
  Calculator,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-vue-next";
import { c as cn } from "./utils-C_kyg7_s.mjs";
import { u as useFinanceTax } from "./useFinanceTax-DZl3TxF7.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { f as formatCurrency } from "./useExpensePage-CibEMg65.mjs";
import { n as navigateTo } from "./server.mjs";
import { _ as _sfc_main$1 } from "./index-xuQBAI3p.mjs";
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
import "clsx";
import "tailwind-merge";
import "./useFinanceExpense-CyuGq-0f.mjs";
import "./useCompanies-D5TCq9CR.mjs";
import "./useJobs-BuvuAhhz.mjs";
import "vue-router";

const navigateToTax = (id) => {
  navigateTo(`/finance/tax/${id}`);
};
const taxTypeOptions = [
  { value: "ppn", label: "PPN" },
  { value: "pph", label: "PPh" },
];
function useTaxPage() {
  const {
    fetchTaxes,
    fetchTaxById,
    deleteTax,
    updateTax,
    isLoading: isTaxLoading,
  } = useFinanceTax();
  const { confirm } = useConfirm();
  const filters = ref({
    search: "",
    type: "",
    page: 1,
    limit: 10,
  });
  const taxes = ref([]);
  const pagination = ref({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  });
  const viewMode = ref("list");
  const searchQuery = ref("");
  let searchTimeout;
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref(null);
  const editingTaxId = ref("");
  const formData = ref({
    name: "",
    rate: 0,
    type: "",
    description: "",
    isActive: true,
  });
  const isLoading = computed(() => isTaxLoading.value);
  watch(
    () => [filters.value.search, filters.value.type, filters.value.page],
    () => {
      loadTaxes();
    },
    { deep: true },
  );
  watch(searchQuery, (val) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filters.value.search = val;
      filters.value.page = 1;
    }, 500);
  });
  const loadTaxes = async () => {
    try {
      const result = await fetchTaxes(filters.value);
      taxes.value = result.items;
      pagination.value = result.pagination;
    } catch (error) {
      console.error("Failed to load taxes:", error);
    }
  };
  const handlePageChange = (page) => {
    filters.value.page = page;
  };
  const handleRowClick = (id) => {
    navigateToTax(id);
  };
  const openEditModal = async (id) => {
    try {
      editingTaxId.value = id;
      const taxData = await fetchTaxById(id);
      if (!taxData) {
        throw new Error("Failed to load tax data");
      }
      const tax = taxData;
      formData.value = {
        name: tax.name || "",
        rate: Number(tax.rate) || 0,
        type: tax.type || "",
        description: tax.description || "",
        isActive: tax.isActive ?? true,
      };
      isEditModalOpen.value = true;
      editError.value = null;
    } catch (e) {
      console.error("Failed to open edit modal:", e);
      editError.value = "Failed to load tax data";
    }
  };
  const closeEditModal = () => {
    isEditModalOpen.value = false;
    editError.value = null;
    editingTaxId.value = "";
  };
  const handleUpdate = async () => {
    if (!editingTaxId.value) return;
    try {
      isSubmitting.value = true;
      editError.value = null;
      const result = await updateTax(editingTaxId.value, {
        name: formData.value.name,
        rate: formData.value.rate,
        type: formData.value.type,
        description: formData.value.description,
        isActive: formData.value.isActive,
      });
      if (result) {
        closeEditModal();
        await loadTaxes();
      } else {
        throw new Error("Failed to update tax");
      }
    } catch (e) {
      console.error("Failed to update tax:", e);
      editError.value = "Failed to update tax";
    } finally {
      isSubmitting.value = false;
    }
  };
  const handleDelete = async (id) => {
    const tax = taxes.value.find((t) => t.id === id);
    const taxName = tax?.name || id;
    const confirmed = await confirm({
      title: "Hapus Pajak",
      message: `Apakah Anda yakin ingin menghapus pajak ${taxName}? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      type: "danger",
    });
    if (confirmed) {
      try {
        await deleteTax(id);
        loadTaxes();
      } catch (error) {
        console.error("Failed to delete tax:", error);
        alert("Gagal menghapus pajak. Silakan coba lagi.");
      }
    }
  };
  const initialize = () => {
    loadTaxes();
  };
  return {
    // State
    taxes,
    filters,
    pagination,
    viewMode,
    searchQuery,
    isEditModalOpen,
    isSubmitting,
    editError,
    editingTaxId,
    formData,
    // Options
    taxTypeOptions,
    // Helpers
    formatCurrency,
    // Computed
    isLoading,
    // Methods
    loadTaxes,
    handlePageChange,
    handleRowClick,
    openEditModal,
    closeEditModal,
    handleUpdate,
    handleDelete,
    initialize,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      taxes,
      filters,
      pagination,
      viewMode,
      searchQuery,
      isEditModalOpen,
      isSubmitting,
      editError,
      editingTaxId,
      formData,
      taxTypeOptions: taxTypeOptions2,
      isLoading,
      handlePageChange,
      closeEditModal,
      handleUpdate,
    } = useTaxPage();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiPagination = __nuxt_component_1;
      _push(
        `<!--[--><div class="space-y-6 animate-fade-in p-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Pajak</h1><p class="text-muted-foreground mt-1">Kelola catatan pajak PPN dan PPh</p></div><div class="flex items-center gap-2"><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "list"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutList), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button><button class="${ssrRenderClass(
          unref(cn)(
            "p-1.5 rounded transition-colors",
            unref(viewMode) === "grid"
              ? "bg-[#012D5A] text-white"
              : "text-muted-foreground hover:bg-muted",
          ),
        )}">`,
      );
      _push(ssrRenderComponent(unref(LayoutGrid), { class: "w-4 h-4" }, null, _parent));
      _push(
        `</button></div></div></div><div class="flex items-center justify-between gap-4"><div class="relative w-full max-w-sm">`,
      );
      _push(
        ssrRenderComponent(
          unref(Search),
          { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" },
          null,
          _parent,
        ),
      );
      _push(
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari pajak..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3"><select class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "") : ssrLooseEqual(unref(filters).type, "")) ? " selected" : ""}>Semua Tipe</option><option value="ppn"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "ppn") : ssrLooseEqual(unref(filters).type, "ppn")) ? " selected" : ""}>PPN</option><option value="pph"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).type) ? ssrLooseContain(unref(filters).type, "pph") : ssrLooseEqual(unref(filters).type, "pph")) ? " selected" : ""}>PPh</option></select>`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/tax/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Catat Pajak</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Catat Pajak"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(isLoading)) {
        _push(
          `<div class="flex justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`,
        );
      } else {
        _push(`<!--[-->`);
        if (unref(viewMode) === "list") {
          _push(
            `<div class="border border-border rounded-xl bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-border bg-white text-left"><th class="py-3 px-4 text-sm font-medium text-foreground">Nama</th><th class="py-3 px-4 text-sm font-medium text-foreground">Tipe</th><th class="py-3 px-4 text-sm font-medium text-foreground">Rate (%)</th><th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th><th class="py-3 px-4 text-sm font-medium text-foreground">Status</th><th class="py-3 px-4 w-10"></th></tr></thead><tbody><!--[-->`,
          );
          ssrRenderList(unref(taxes), (tax) => {
            _push(
              `<tr class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"><td class="py-3 px-4"><div class="flex items-center gap-2"><div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">`,
            );
            _push(ssrRenderComponent(unref(Calculator), { class: "w-4 h-4" }, null, _parent));
            _push(
              `</div><span class="text-sm font-medium">${ssrInterpolate(tax.name)}</span></div></td><td class="py-3 px-4"><span class="text-xs font-medium uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">${ssrInterpolate(tax.type)}</span></td><td class="py-3 px-4 text-sm font-medium">${ssrInterpolate(tax.rate)}%</td><td class="py-3 px-4 text-sm text-muted-foreground">${ssrInterpolate(tax.description || "-")}</td><td class="py-3 px-4"><span class="${ssrRenderClass(
                unref(cn)(
                  "px-2 py-0.5 rounded border text-xs font-medium",
                  tax.isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200",
                ),
              )}">${ssrInterpolate(tax.isActive ? "Aktif" : "Nonaktif")}</span></td><td class="py-3 px-4 text-right"><div class="flex gap-1 justify-end"><button class="p-1.5 rounded hover:bg-muted transition-colors">`,
            );
            _push(
              ssrRenderComponent(
                unref(Pencil),
                { class: "w-4 h-4 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push(`</button><button class="p-1.5 rounded hover:bg-muted transition-colors">`);
            _push(
              ssrRenderComponent(
                unref(Trash2),
                { class: "w-4 h-4 text-muted-foreground" },
                null,
                _parent,
              ),
            );
            _push(`</button></div></td></tr>`);
          });
          _push(`<!--]-->`);
          if (unref(taxes).length === 0) {
            _push(
              `<tr><td colspan="6" class="py-12 text-center text-muted-foreground"> Tidak ada pajak ditemukan. </td></tr>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</tbody></table></div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
          ssrRenderList(unref(taxes), (tax) => {
            _push(
              `<div class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"><div class="flex items-start justify-between mb-4"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0">`,
            );
            _push(ssrRenderComponent(unref(Calculator), { class: "w-6 h-6" }, null, _parent));
            _push(
              `</div><div><h3 class="font-bold text-base text-foreground">${ssrInterpolate(tax.name)}</h3><p class="text-xs text-muted-foreground uppercase">${ssrInterpolate(tax.type)}</p></div></div><button class="text-muted-foreground hover:text-foreground">`,
            );
            _push(ssrRenderComponent(unref(MoreVertical), { class: "w-4 h-4" }, null, _parent));
            _push(
              `</button></div><div class="space-y-4 mb-4"><div><p class="text-xs text-muted-foreground mb-1">Rate</p><p class="text-lg font-bold text-[#012D5A]">${ssrInterpolate(tax.rate)}%</p></div><div><p class="text-xs text-muted-foreground mb-1">Status</p><span class="${ssrRenderClass(
                unref(cn)(
                  "px-2 py-0.5 rounded border text-xs font-medium",
                  tax.isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200",
                ),
              )}">${ssrInterpolate(tax.isActive ? "Aktif" : "Nonaktif")}</span></div></div><div class="pt-3 border-t border-border"><p class="text-xs text-muted-foreground line-clamp-2">${ssrInterpolate(tax.description || "Tidak ada deskripsi")}</p></div></div>`,
            );
          });
          _push(`<!--]-->`);
          if (unref(taxes).length === 0) {
            _push(
              `<div class="col-span-full py-12 text-center text-muted-foreground"> Tidak ada pajak ditemukan. </div>`,
            );
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(
          `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(pagination).total)} data found.</p>`,
        );
        if (unref(pagination).total > 0) {
          _push(
            ssrRenderComponent(
              _component_UiPagination,
              {
                page: unref(filters).page,
                "onUpdate:page": [
                  ($event) => (unref(filters).page = $event),
                  unref(handlePageChange),
                ],
                total: unref(pagination).total,
                "items-per-page": unref(pagination).limit,
              },
              null,
              _parent,
            ),
          );
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
      _push(
        ssrRenderComponent(
          unref(_sfc_main$1),
          {
            "is-open": unref(isEditModalOpen),
            "is-submitting": unref(isSubmitting),
            "edit-error": unref(editError),
            "editing-tax-id": unref(editingTaxId),
            "form-data": unref(formData),
            "tax-type-options": unref(taxTypeOptions2),
            onClose: unref(closeEditModal),
            onSubmit: unref(handleUpdate),
          },
          null,
          _parent,
        ),
      );
      _push(`<!--]-->`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "pages/finance/tax/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BDBTQOEl.mjs.map
