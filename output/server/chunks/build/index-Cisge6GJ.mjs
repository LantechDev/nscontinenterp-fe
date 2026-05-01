import { _ as __nuxt_component_0 } from "./nuxt-link-c0iC1rLL.mjs";
import { _ as __nuxt_component_1 } from "./Pagination-RMwlys3Y.mjs";
import {
  _ as __nuxt_component_1$1,
  J as JobInvoicePreview,
} from "./JobDetailSlideOver-BAyYqm_H.mjs";
import {
  defineComponent,
  ref,
  mergeProps,
  unref,
  withCtx,
  createVNode,
  createTextVNode,
  isRef,
  computed,
  watch,
  nextTick,
  useSSRContext,
} from "vue";
import {
  ssrRenderAttrs,
  ssrRenderList,
  ssrRenderAttr,
  ssrInterpolate,
  ssrIncludeBooleanAttr,
  ssrLooseContain,
  ssrLooseEqual,
  ssrRenderClass,
  ssrRenderComponent,
  ssrRenderStyle,
} from "vue/server-renderer";
import { LayoutList, LayoutGrid, Search, Plus, Receipt } from "lucide-vue-next";
import { c as cn, f as formatRupiah, t as toNumber } from "./utils-C_kyg7_s.mjs";
import { u as useInvoices } from "./useInvoices-DKKCQ9mY.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { u as useServices } from "./useServices-DFtvjO_i.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { n as navigateTo } from "./server.mjs";
import _sfc_main$1 from "./InvoiceListView-XMs5mdHT.mjs";
import _sfc_main$2 from "./InvoiceGridView-CoQ_ezBl.mjs";
import _sfc_main$3 from "./InvoiceEditModal-D0WGWSNK.mjs";
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
import "./Combobox-BrxCx0QJ.mjs";
import "@vueuse/core";
import "./Modal-DzxIm9v2.mjs";
import "./index-DJGQOf1Z.mjs";
import "jspdf";
import "html2canvas";
import "./_plugin-vue_export-helper-1tPrXgE0.mjs";
import "./usePayments-BGfFm4PO.mjs";
import "./DatePicker-I7QCahB1.mjs";
import "./JobPartyRow-CsBs8qVt.mjs";
import "./SectionCard-BNHBHmfw.mjs";
import "clsx";
import "tailwind-merge";
import "vue-router";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};
const statusLabel = (code) => {
  const labels = {
    PAID: "LUNAS",
    UNPAID: "BELUM LUNAS",
    PARTIALLY_PAID: "SEBAGIAN",
    OVERDUE: "JATUH TEMPO",
  };
  return labels[code] || code;
};
const calculateItemAmount = (item) => {
  return item.quantity * item.unitPrice;
};
const navigateToInvoice = (id) => {
  navigateTo(`/finance/invoice/${id}`);
};
function useInvoicePage() {
  const {
    fetchInvoices,
    fetchInvoiceById,
    deleteInvoice,
    updateInvoice,
    // isLoading removed - not used in this composable
  } = useInvoices();
  const { confirm } = useConfirm();
  const { companies, fetchCompanies } = useCompanies();
  const { jobs, fetchJobs } = useJobs();
  const { services, fetchServices } = useServices();
  const invoices = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const searchQuery = ref("");
  const selectedStatus = ref("");
  const viewMode = ref("list");
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref(null);
  const editingInvoiceId = ref("");
  const formData = ref({
    invoiceNumber: "",
    issuedDate: "",
    dueDate: "",
    companyId: "",
    jobId: "",
    notes: "",
    subTotal: 0,
    taxAmount: 0,
    total: 0,
    statusId: "",
    items: [],
  });
  const selectedTaxRate = ref(0);
  const currentPage = ref(1);
  const pagination = ref({ total: 0, limit: 10, page: 1 });
  const statusMap = {
    UNPAID: "pending",
    PARTIALLY_PAID: "partially",
    PAID: "paid",
    OVERDUE: "overdue",
    VOIDED: "voided",
  };
  const statusConfig = {
    pending: { label: "Belum Lunas", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    partially: { label: "Sebagian", class: "bg-blue-50 text-blue-700 border-blue-200" },
    paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
    overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
    voided: { label: "Void", class: "bg-gray-100 text-gray-500 border-gray-300 line-through" },
  };
  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "PAID", label: "Lunas" },
    { value: "UNPAID", label: "Belum Lunas" },
    { value: "PARTIALLY_PAID", label: "Sebagian" },
    { value: "OVERDUE", label: "Jatuh Tempo" },
    { value: "VOIDED", label: "Void" },
  ];
  const editStatusOptions = [
    { id: "PAID", name: "Lunas (Paid)" },
    { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
    { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
  ];
  const editTaxOptions = [
    { value: 0, label: "Tanpa PPN" },
    { value: 1.1, label: "PPN 1.1% (Freight)" },
    { value: 11, label: "PPN 11%" },
  ];
  const formatCurrency = formatRupiah;
  const getStatusType = (statusCode) => {
    return statusMap[statusCode] || "pending";
  };
  const getStatusConfig = (statusCode) => {
    const type = getStatusType(statusCode);
    return statusConfig[type];
  };
  const filteredInvoices = computed(() => {
    let result = invoices.value;
    if (selectedStatus.value) {
      result = result.filter((invoice) => invoice.status?.code === selectedStatus.value);
    }
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.company.name.toLowerCase().includes(query),
      );
    }
    return result;
  });
  const calculateSubTotal = () => {
    return formData.value.items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
  };
  const calculateTaxAmount = () => {
    return (calculateSubTotal() * selectedTaxRate.value) / 100;
  };
  const calculateTotal = () => {
    return calculateSubTotal() + calculateTaxAmount();
  };
  const recalculateTotals = () => {
    formData.value.subTotal = calculateSubTotal();
    formData.value.taxAmount = calculateTaxAmount();
    formData.value.total = calculateTotal();
  };
  const addLineItem = () => {
    formData.value.items.push({
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };
  const removeLineItem = (index) => {
    formData.value.items.splice(index, 1);
    recalculateTotals();
  };
  const updateItemAmount = (index) => {
    const item = formData.value.items[index];
    if (item) {
      item.amount = calculateItemAmount(item);
      recalculateTotals();
    }
  };
  const loadInvoices = async () => {
    try {
      loading.value = true;
      error.value = null;
      const result = await fetchInvoices(selectedStatus.value || void 0);
      if (result.success && result.data) {
        invoices.value = result.data;
      } else {
        throw new Error(result.error || "Failed to load invoices");
      }
    } catch (e) {
      console.error("Failed to fetch invoices:", e);
      error.value = "Failed to load invoices";
      invoices.value = [];
    } finally {
      loading.value = false;
    }
  };
  const loadDropdownData = async () => {
    await Promise.all([fetchCompanies({ type: "CUSTOMER" }), fetchJobs(), fetchServices()]);
  };
  const openEditModal = async (id) => {
    try {
      editingInvoiceId.value = id;
      const result = await fetchInvoiceById(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to load invoice");
      }
      const inv = result.data;
      await loadDropdownData();
      const issuedDateVal = inv.issuedDate || "";
      const dueDateVal = inv.dueDate || "";
      formData.value = {
        invoiceNumber: inv.invoiceNumber || "",
        issuedDate: formatDateForInput(issuedDateVal),
        dueDate: formatDateForInput(dueDateVal),
        companyId: inv.company?.id || "",
        jobId: inv.job?.id || "",
        notes: inv.notes || "",
        subTotal: toNumber(inv.subTotal),
        taxAmount: toNumber(inv.taxAmount),
        total: toNumber(inv.total),
        statusId: inv.status?.code || "",
        items:
          inv.items?.map((item) => ({
            id: item.id,
            serviceId: item.service?.id,
            description: item.description,
            quantity: toNumber(item.quantity),
            unitPrice: toNumber(item.unitPrice),
            amount: toNumber(item.amount),
          })) || [],
      };
      if (inv.subTotal && inv.taxAmount) {
        selectedTaxRate.value = (toNumber(inv.taxAmount) / toNumber(inv.subTotal)) * 100;
      } else {
        selectedTaxRate.value = 0;
      }
      isEditModalOpen.value = true;
      editError.value = null;
    } catch (e) {
      console.error("Failed to open edit modal:", e);
      editError.value = "Failed to load invoice data";
    }
  };
  const closeEditModal = () => {
    isEditModalOpen.value = false;
    editError.value = null;
    editingInvoiceId.value = "";
  };
  const handleFullUpdate = async () => {
    if (!formData.value.companyId || !editingInvoiceId.value) return;
    try {
      isSubmitting.value = true;
      editError.value = null;
      const invoiceId = editingInvoiceId.value;
      const itemsToUpdate = formData.value.items.map((item) => ({
        id: item.id,
        serviceId: item.serviceId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      }));
      const subTotal = calculateSubTotal();
      const taxAmount = calculateTaxAmount();
      const total = calculateTotal();
      const result = await updateInvoice(invoiceId, {
        invoiceNumber: formData.value.invoiceNumber,
        issuedDate: formData.value.issuedDate,
        dueDate: formData.value.dueDate,
        companyId: formData.value.companyId,
        jobId: formData.value.jobId || void 0,
        notes: formData.value.notes,
        subTotal,
        taxAmount,
        total,
        balanceDue: total,
        statusId: formData.value.statusId,
        items: itemsToUpdate,
      });
      if (result.success) {
        closeEditModal();
        await loadInvoices();
      } else {
        throw new Error(result.error || "Failed to update invoice");
      }
    } catch (e) {
      console.error("Failed to update invoice:", e);
      editError.value = "Failed to update invoice";
    } finally {
      isSubmitting.value = false;
    }
  };
  const handleRowClick = (id) => {
    navigateToInvoice(id);
  };
  const handleDelete = async (id) => {
    const invoice = invoices.value.find((inv) => inv.id === id);
    const invoiceNumber = invoice?.invoiceNumber || id;
    const confirmed = await confirm({
      title: "Hapus Invoice",
      message: `Apakah Anda yakin ingin menghapus invoice ${invoiceNumber}? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      type: "danger",
    });
    if (confirmed) {
      try {
        const result = await deleteInvoice(id);
        if (result.success) {
          await loadInvoices();
        } else {
          console.error("Failed to delete invoice:", result.error);
          alert(result.error || "Failed to delete invoice");
        }
      } catch (error2) {
        console.error("Failed to delete invoice:", error2);
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };
  const handlePageChange = (page) => {
    currentPage.value = page;
    loadInvoices();
  };
  const initialize = () => {
    loadInvoices();
  };
  watch(selectedStatus, () => {
    loadInvoices();
  });
  watch(selectedTaxRate, () => {
    recalculateTotals();
  });
  return {
    // State
    invoices,
    loading,
    error,
    searchQuery,
    selectedStatus,
    viewMode,
    isEditModalOpen,
    isSubmitting,
    editError,
    editingInvoiceId,
    formData,
    selectedTaxRate,
    currentPage,
    pagination,
    // Options
    statusOptions,
    editStatusOptions,
    editTaxOptions,
    companies,
    jobs,
    services,
    // Helpers
    formatCurrency,
    formatDate,
    statusLabel,
    getStatusType,
    getStatusConfig,
    // Computed
    filteredInvoices,
    // Methods
    loadInvoices,
    openEditModal,
    closeEditModal,
    handleFullUpdate,
    handleRowClick,
    handleDelete,
    handlePageChange,
    addLineItem,
    removeLineItem,
    updateItemAmount,
    initialize,
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchInvoiceById } = useInvoices();
    const {
      loading,
      error,
      searchQuery,
      selectedStatus,
      viewMode,
      isEditModalOpen,
      isSubmitting,
      editError,
      formData,
      selectedTaxRate,
      currentPage,
      pagination,
      statusOptions,
      editStatusOptions,
      editTaxOptions,
      companies,
      jobs,
      services,
      formatCurrency,
      formatDate: formatDate2,
      getStatusConfig,
      filteredInvoices,
      closeEditModal,
      handleFullUpdate,
      handleRowClick,
      handlePageChange,
      addLineItem,
      removeLineItem,
      updateItemAmount,
    } = useInvoicePage();
    const isDownloading = ref(false);
    const downloadInvoice = ref(null);
    const previewRef = ref(null);
    const handleDownloadPdf = async (id) => {
      if (isDownloading.value) return;
      isDownloading.value = true;
      try {
        const result = await fetchInvoiceById(id);
        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to fetch invoice");
        }
        downloadInvoice.value = result.data;
        await nextTick();
        await nextTick();
        await previewRef.value?.generatePDF();
      } catch (err) {
        console.error("Failed to download invoice PDF:", err);
        alert("Failed to download invoice. Please try again.");
      } finally {
        isDownloading.value = false;
        downloadInvoice.value = null;
      }
    };
    const isJobDetailOpen = ref(false);
    const selectedJobId = ref("");
    const initialInvoiceId = ref("");
    const handleInvoiceClick = (id) => {
      const invoice = filteredInvoices.value.find((inv) => inv.id === id);
      if (invoice?.job?.id) {
        selectedJobId.value = invoice.job.id;
        initialInvoiceId.value = id;
        isJobDetailOpen.value = true;
      } else {
        handleRowClick(id);
      }
    };
    const handleTaxRateChange = (value) => {
      selectedTaxRate.value = value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_UiPagination = __nuxt_component_1;
      const _component_OperationalJobDetailSlideOver = __nuxt_component_1$1;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in p-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold">Invoice</h1><p class="text-muted-foreground mt-1">Kelola tagihan customer</p></div><div class="flex items-center gap-2"><select class="bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]"><!--[-->`,
      );
      ssrRenderList(unref(statusOptions), (option) => {
        _push(
          `<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), option.value) : ssrLooseEqual(unref(selectedStatus), option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`,
        );
      });
      _push(
        `<!--]--></select><div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2"><button class="${ssrRenderClass(
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
        `<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Cari invoice..." class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"></div><div class="flex items-center gap-3">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          {
            to: "/finance/invoice/create",
            class:
              "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap",
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                );
                _push2(`<span${_scopeId}>Buat Invoice</span>`);
              } else {
                return [
                  createVNode(unref(Plus), { class: "w-4 h-4" }),
                  createVNode("span", null, "Buat Invoice"),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(
          `<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div></div>`,
        );
      } else if (unref(error)) {
        _push(
          `<div class="text-center py-12"><p class="text-red-500">${ssrInterpolate(unref(error))}</p><button class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg"> Retry </button></div>`,
        );
      } else if (unref(filteredInvoices).length === 0) {
        _push(`<div class="text-center py-12 border border-border rounded-xl bg-white">`);
        _push(
          ssrRenderComponent(
            unref(Receipt),
            { class: "w-12 h-12 text-muted-foreground mx-auto mb-4" },
            null,
            _parent,
          ),
        );
        _push(`<p class="text-muted-foreground">Belum ada invoice</p>`);
        _push(
          ssrRenderComponent(
            _component_NuxtLink,
            {
              to: "/finance/invoice/create",
              class:
                "mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#012D5A] text-white rounded-lg",
            },
            {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(
                    ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId),
                  );
                  _push2(` Buat Invoice Pertama `);
                } else {
                  return [
                    createVNode(unref(Plus), { class: "w-4 h-4" }),
                    createTextVNode(" Buat Invoice Pertama "),
                  ];
                }
              }),
              _: 1,
            },
            _parent,
          ),
        );
        _push(`</div>`);
      } else if (unref(viewMode) === "list") {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$1),
            {
              invoices: unref(filteredInvoices),
              "get-status-config": unref(getStatusConfig),
              "format-currency": unref(formatCurrency),
              "format-date": unref(formatDate2),
              onRowClick: handleInvoiceClick,
              onDownloadPdf: handleDownloadPdf,
            },
            null,
            _parent,
          ),
        );
      } else {
        _push(
          ssrRenderComponent(
            unref(_sfc_main$2),
            {
              invoices: unref(filteredInvoices),
              "get-status-config": unref(getStatusConfig),
              "format-currency": unref(formatCurrency),
              "format-date": unref(formatDate2),
              onRowClick: handleInvoiceClick,
              onDownloadPdf: handleDownloadPdf,
            },
            null,
            _parent,
          ),
        );
      }
      _push(
        `<div class="flex items-center justify-between text-sm text-muted-foreground"><p>${ssrInterpolate(unref(filteredInvoices).length)} data found.</p>`,
      );
      _push(
        ssrRenderComponent(
          _component_UiPagination,
          {
            page: unref(currentPage),
            "onUpdate:page": [
              ($event) => (isRef(currentPage) ? (currentPage.value = $event) : null),
              unref(handlePageChange),
            ],
            total: unref(pagination).total,
            "items-per-page": unref(pagination).limit,
          },
          null,
          _parent,
        ),
      );
      _push(`</div>`);
      _push(
        ssrRenderComponent(
          unref(_sfc_main$3),
          {
            "is-open": unref(isEditModalOpen),
            "is-submitting": unref(isSubmitting),
            "edit-error": unref(editError),
            "form-data": unref(formData),
            "selected-tax-rate": unref(selectedTaxRate),
            "status-options": unref(editStatusOptions),
            "tax-options": unref(editTaxOptions),
            companies: unref(companies),
            jobs: unref(jobs),
            services: unref(services),
            onClose: unref(closeEditModal),
            onSubmit: unref(handleFullUpdate),
            onAddLineItem: unref(addLineItem),
            onRemoveLineItem: unref(removeLineItem),
            onUpdateItemAmount: unref(updateItemAmount),
            onUpdateTaxRate: handleTaxRateChange,
          },
          null,
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _component_OperationalJobDetailSlideOver,
          {
            modelValue: unref(isJobDetailOpen),
            "onUpdate:modelValue": ($event) =>
              isRef(isJobDetailOpen) ? (isJobDetailOpen.value = $event) : null,
            "job-id": unref(selectedJobId),
            "initial-tab": "invoice",
            "initial-invoice-id": unref(initialInvoiceId),
          },
          null,
          _parent,
        ),
      );
      if (unref(downloadInvoice)) {
        _push(
          `<div aria-hidden="true" style="${ssrRenderStyle({ position: "fixed", left: "-9999px", top: "0", opacity: "0", "pointer-events": "none", "z-index": "-1", width: "210mm" })}">`,
        );
        _push(
          ssrRenderComponent(
            JobInvoicePreview,
            {
              ref_key: "previewRef",
              ref: previewRef,
              invoice: unref(downloadInvoice),
            },
            null,
            _parent,
          ),
        );
        _push(`</div>`);
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
    "pages/finance/invoice/index.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Cisge6GJ.mjs.map
