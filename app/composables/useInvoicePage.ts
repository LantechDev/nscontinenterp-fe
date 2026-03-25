import { useInvoices } from "./useInvoices";
import { useCompanies } from "./useCompanies";
import { useJobs } from "./useJobs";
import { useServices } from "./useServices";
import { useConfirm } from "./useConfirm";
import { toNumber, formatRupiah } from "~/lib/utils";
import type { ViewMode } from "./useExpensePage";

// Pure helper functions outside composable
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};

const statusLabel = (code: string) => {
  const labels: Record<string, string> = {
    PAID: "LUNAS",
    UNPAID: "BELUM LUNAS",
    PARTIALLY_PAID: "SEBAGIAN",
    OVERDUE: "JATUH TEMPO",
  };
  return labels[code] || code;
};

const calculateItemAmount = (item: InvoiceItemForm) => {
  return item.quantity * item.unitPrice;
};

// Navigation handler outside composable
const navigateToInvoice = (id: string) => {
  navigateTo(`/finance/invoice/${id}`);
};

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: { code: string; name: string };
  company: { name: string };
}

export interface InvoiceItemForm {
  id?: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  companyId: string;
  jobId: string;
  notes: string;
  subTotal: number;
  taxAmount: number;
  total: number;
  statusId: string;
  items: InvoiceItemForm[];
}

export type StatusType = "pending" | "paid" | "partially" | "overdue";

export interface StatusConfig {
  label: string;
  class: string;
}

export function useInvoicePage() {
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

  // State
  const invoices = ref<InvoiceData[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const selectedStatus = ref<string>("");
  const viewMode = ref<ViewMode>("list");

  // Edit modal state
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref<string | null>(null);
  const editingInvoiceId = ref<string>("");
  const formData = ref<InvoiceFormData>({
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

  // Pagination
  const currentPage = ref(1);
  const pagination = ref({ total: 0, limit: 10, page: 1 });

  // Status configuration
  const statusMap: Record<string, StatusType> = {
    UNPAID: "pending",
    PARTIALLY_PAID: "partially",
    PAID: "paid",
    OVERDUE: "overdue",
  };

  const statusConfig: Record<StatusType, StatusConfig> = {
    pending: { label: "Belum Lunas", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    partially: { label: "Sebagian", class: "bg-blue-50 text-blue-700 border-blue-200" },
    paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
    overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
  };

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "PAID", label: "Lunas" },
    { value: "UNPAID", label: "Belum Lunas" },
    { value: "PARTIALLY_PAID", label: "Sebagian" },
    { value: "OVERDUE", label: "Jatuh Tempo" },
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

  // Format helpers
  const formatCurrency = formatRupiah;

  const getStatusType = (statusCode: string): StatusType => {
    return statusMap[statusCode] || "pending";
  };

  const getStatusConfig = (statusCode: string): StatusConfig => {
    const type = getStatusType(statusCode);
    return statusConfig[type];
  };

  // Computed
  const filteredInvoices = computed(() => {
    let result = invoices.value;
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

  // Calculations

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

  // Line item management
  const addLineItem = () => {
    formData.value.items.push({
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    });
  };

  const removeLineItem = (index: number) => {
    formData.value.items.splice(index, 1);
    recalculateTotals();
  };

  const updateItemAmount = (index: number) => {
    const item = formData.value.items[index];
    if (item) {
      item.amount = calculateItemAmount(item);
      recalculateTotals();
    }
  };

  // Load data
  const loadInvoices = async () => {
    try {
      loading.value = true;
      error.value = null;
      const result = await fetchInvoices(selectedStatus.value || undefined);
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

  // Edit modal handlers
  const openEditModal = async (id: string) => {
    try {
      editingInvoiceId.value = id;
      const result = await fetchInvoiceById(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to load invoice");
      }

      const inv = result.data;
      await loadDropdownData();

      const issuedDateVal: string = (inv.issuedDate as string) || "";
      const dueDateVal: string = (inv.dueDate as string) || "";

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
        jobId: formData.value.jobId || undefined,
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

  // Row click handler
  const handleRowClick = (id: string) => {
    navigateToInvoice(id);
  };

  // Delete handler
  const handleDelete = async (id: string) => {
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
      } catch (error) {
        console.error("Failed to delete invoice:", error);
        alert("Failed to delete invoice. Please try again.");
      }
    }
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    currentPage.value = page;
    loadInvoices();
  };

  // Initialize
  const initialize = () => {
    loadInvoices();
  };

  // Watch for status filter changes
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
