import {
  useFinanceExpense,
  type Expense,
  type ExpenseFilters,
  type Pagination,
} from "./useFinanceExpense";
import { useCompanies } from "./useCompanies";
import { useJobs } from "./useJobs";
import { useConfirm } from "./useConfirm";
import { useFinanceTax } from "./useFinanceTax";
import { useServices } from "./useServices";
import { toast } from "vue-sonner";

// Pure helper functions outside composable
export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Navigation handler
const navigateToExpense = (id: string) => {
  navigateTo(`/finance/expenses/${id}`);
};

export interface ExpenseFormData {
  number: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  vendorId: string;
  jobId: string;
  taxId: string;
  notes: string;
}

export type ViewMode = "list" | "grid";

export interface ExpenseData {
  id: string;
  number: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  vendorId?: string;
  jobId?: string;
  taxId?: string;
  category?: { id: string; name: string };
  vendor?: { id: string; name: string };
  job?: { id: string; jobNumber: string };
  notes?: string;
}

// categoryOptions is now dynamically populated from the API (ServiceCategory model)

export function useExpensePage() {
  const {
    fetchExpenses,
    fetchExpenseById,
    deleteExpense,
    updateExpense,
    isLoading: isExpenseLoading,
  } = useFinanceExpense();
  const { confirm } = useConfirm();
  const { companies, fetchCompanies } = useCompanies();
  const { jobs, fetchJobs } = useJobs();
  const { fetchTaxes } = useFinanceTax();
  const { fetchCategories } = useServices();

  // Filters & Pagination
  const filters = ref<ExpenseFilters>({
    search: "",
    categoryId: "",
    page: 1,
    limit: 10,
  });

  const expenses = ref<Expense[]>([]);
  const pagination = ref<Pagination>({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  });

  const viewMode = ref<ViewMode>("list");

  // Debounced search
  const searchQuery = ref("");
  let searchTimeout: ReturnType<typeof setTimeout>;

  // Edit modal state
  const isEditModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref<string | null>(null);
  const editingExpenseId = ref<string>("");

  // Form state
  const formData = ref<ExpenseFormData>({
    number: "",
    description: "",
    amount: 0,
    date: "",
    categoryId: "",
    vendorId: "",
    jobId: "",
    taxId: "",
    notes: "",
  });

  const taxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);

  // Dynamic category options fetched from the API
  const serviceCategoryList = ref<Array<{ id: string; name: string }>>([]);
  const categoryOptions = computed(() => [
    { value: "", label: "Pilih Kategori" },
    ...serviceCategoryList.value.map((cat) => ({ value: cat.id, label: cat.name })),
  ]);

  // Computed
  const isLoading = computed(() => isExpenseLoading.value);

  // Watch for filter changes
  watch(
    () => [filters.value.search, filters.value.categoryId, filters.value.page],
    () => {
      loadExpenses();
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
  const loadExpenses = async () => {
    try {
      const result = await fetchExpenses(filters.value);
      expenses.value = result.items;
      pagination.value = result.pagination;
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };

  // Load dropdown data
  const loadDropdownData = async () => {
    const [_, __, taxes, catResult] = await Promise.all([
      fetchCompanies({ type: "VENDOR" }),
      fetchJobs(),
      fetchTaxes({ isActive: true, limit: 100 }),
      fetchCategories(),
    ]);
    taxOptions.value = taxes?.items || [];
    if (catResult.success && catResult.data) {
      serviceCategoryList.value = catResult.data.map((c) => ({ id: c.id, name: c.name }));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    filters.value.page = page;
  };

  // Row click handler
  const handleRowClick = (id: string) => {
    navigateToExpense(id);
  };

  // Edit handlers
  const openEditModal = async (id: string) => {
    try {
      editingExpenseId.value = id;
      const expenseData = await fetchExpenseById(id);
      if (!expenseData) {
        throw new Error("Failed to load expense data");
      }

      const exp = expenseData as Expense & { notes?: string };
      await loadDropdownData();

      formData.value = {
        number: exp.number || "",
        description: exp.description || "",
        amount: Number(exp.amount) || 0,
        date: formatDateForInput(exp.date),
        categoryId: exp.categoryId || "",
        vendorId: exp.vendor?.id || exp.vendorId || "",
        jobId: exp.job?.id || exp.jobId || "",
        taxId: exp.taxId || "",
        notes: exp.notes || "",
      };

      isEditModalOpen.value = true;
      editError.value = null;
    } catch (e) {
      console.error("Failed to open edit modal:", e);
      editError.value = "Failed to load expense data";
    }
  };

  const closeEditModal = () => {
    isEditModalOpen.value = false;
    editError.value = null;
    editingExpenseId.value = "";
  };

  // Update handler
  const handleUpdate = async () => {
    if (!editingExpenseId.value) return;

    try {
      isSubmitting.value = true;
      editError.value = null;

      const result = await updateExpense(editingExpenseId.value, {
        number: formData.value.number,
        description: formData.value.description,
        amount: formData.value.amount,
        date: formData.value.date,
        categoryId: formData.value.categoryId || undefined,
        vendorId: formData.value.vendorId || undefined,
        jobId: formData.value.jobId || undefined,
        taxId: formData.value.taxId || undefined,
        notes: formData.value.notes,
      });

      if (result) {
        closeEditModal();
        await loadExpenses();
      } else {
        throw new Error("Failed to update expense");
      }
    } catch (e) {
      console.error("Failed to update expense:", e);
      editError.value = "Failed to update expense";
    } finally {
      isSubmitting.value = false;
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const expense = expenses.value.find((e) => e.id === id);
    const expenseNumber = expense?.number || id;

    const confirmed = await confirm({
      title: "Hapus Biaya",
      message: `Apakah Anda yakin ingin menghapus biaya ${expenseNumber}? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      type: "danger",
    });

    if (confirmed) {
      try {
        await deleteExpense(id);
        loadExpenses();
      } catch (error) {
        console.error("Failed to delete expense:", error);
        toast.error("Gagal menghapus biaya. Silakan coba lagi.");
      }
    }
  };

  // Initialize
  const initialize = async () => {
    await Promise.all([loadExpenses(), loadDropdownData()]);
  };

  return {
    // State
    expenses,
    filters,
    pagination,
    viewMode,
    searchQuery,
    isEditModalOpen,
    isSubmitting,
    editError,
    editingExpenseId,
    formData,
    taxOptions,
    // Options
    categoryOptions,
    companies,
    jobs,
    // Helpers
    formatCurrency,
    formatDate,
    formatDateForInput,
    // Computed
    isLoading,
    // Methods
    loadExpenses,
    loadDropdownData,
    handlePageChange,
    handleRowClick,
    openEditModal,
    closeEditModal,
    handleUpdate,
    handleDelete,
    initialize,
  };
}
