import { useFinanceTax, type Tax, type TaxFilters } from "./useFinanceTax";
import type { Pagination } from "./useFinanceExpense";
import { useConfirm } from "./useConfirm";
import { formatCurrency } from "./useExpensePage";
import { toast } from "vue-sonner";

// Navigation handler
const navigateToTax = (id: string) => {
  navigateTo(`/finance/tax/${id}`);
};

export interface TaxFormData {
  name: string;
  rate: number;
  type: string;
  description: string;
  isActive: boolean;
}

export type TaxViewMode = "list" | "grid";

export const taxTypeOptions = [
  { value: "ppn", label: "PPN" },
  { value: "pph", label: "PPh" },
];

export function useTaxPage() {
  const {
    fetchTaxes,
    fetchTaxById,
    deleteTax,
    updateTax,
    isLoading: isTaxLoading,
  } = useFinanceTax();
  const { confirm } = useConfirm();

  // Filters & Pagination
  const filters = ref<TaxFilters>({
    search: "",
    type: "",
    page: 1,
    limit: 10,
  });

  const taxes = ref<Tax[]>([]);
  const pagination = ref<Pagination>({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  });

  const viewMode = ref<TaxViewMode>("list");

  // Debounced search
  const searchQuery = ref("");
  let searchTimeout: ReturnType<typeof setTimeout>;

  // Edit modal state
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref<string | null>(null);
  const editingTaxId = ref<string>("");

  // Form state
  const formData = ref<TaxFormData>({
    name: "",
    rate: 0,
    type: "",
    description: "",
    isActive: true,
  });

  // Computed
  const isLoading = computed(() => isTaxLoading.value);

  // Watch for filter changes
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

  // Load data
  const loadTaxes = async () => {
    try {
      const result = await fetchTaxes(filters.value);
      taxes.value = result.items;
      pagination.value = result.pagination;
    } catch (error) {
      console.error("Failed to load taxes:", error);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    filters.value.page = page;
  };

  // Row click handler
  const handleRowClick = (id: string) => {
    navigateToTax(id);
  };

  // Edit handlers
  const openEditModal = async (id: string) => {
    try {
      editingTaxId.value = id;
      const taxData = await fetchTaxById(id);
      if (!taxData) {
        throw new Error("Failed to load tax data");
      }

      const tax = taxData as Tax;
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

  // Update handler
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

  // Delete handler
  const handleDelete = async (id: string) => {
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
        toast.error("Gagal menghapus pajak. Silakan coba lagi.");
      }
    }
  };

  // Initialize
  const initialize = () => {
    loadTaxes();
  };

  // SSR Data Injection - for useAsyncData integration
  const setData = (data: { items: Tax[]; pagination: Pagination }) => {
    if (data?.items) {
      taxes.value = data.items;
    }
    if (data?.pagination) {
      pagination.value = data.pagination;
    }
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
    setData,
  };
}
