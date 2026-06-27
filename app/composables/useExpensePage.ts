import {
  useFinanceExpense,
  type Expense,
  type ExpenseFilters,
  type Pagination,
} from "./useFinanceExpense";
import { useCompanies } from "./useCompanies";
import { useJobs, type JobWithBls } from "./useJobs";
import { useConfirm } from "./useConfirm";
import { useFinanceTax, type Tax } from "./useFinanceTax";
import { useServices } from "./useServices";
import { toast } from "vue-sonner";
import type { Company } from "./useMasterData";

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
  expenseCategoryId: string;
  vendorId: string;
  jobId: string;
  taxId: string;
  notes: string;
  currency: string;
  exchangeRate: number;
}

export type ViewMode = "list" | "grid";

export interface ExpenseData {
  id: string;
  number: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  expenseCategoryId?: string;
  vendorId?: string;
  jobId?: string;
  taxId?: string;
  category?: { id: string; name: string };
  expenseCategory?: { id: string; name: string };
  vendor?: { id: string; name: string };
  job?: { id: string; jobNumber: string };
  notes?: string;
}

// categoryOptions is now dynamically populated from the API (ServiceCategory model)

export function useExpensePage() {
  const {
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    deleteExpense,
    updateExpense,
    isLoading: isExpenseLoading,
  } = useFinanceExpense();
  const { confirm } = useConfirm();
  const { companies, fetchCompanies } = useCompanies();
  const { jobs, fetchJobs } = useJobs();
  const { fetchTaxes } = useFinanceTax();
  const { fetchCategories } = useServices();
  const { canView: canViewCompanies } = useFeatureAccess("master.company");
  const { canView: canViewJobs } = useFeatureAccess("operational.job");
  const { canView: canViewAccounting } = useFeatureAccess("finance.accounting");
  const { canView: canViewFinanceMaster } = useFeatureAccess("master.finance");
  const { canView: canViewServices } = useFeatureAccess("master.service");

  // Filters & Pagination
  const filters = ref<ExpenseFilters>({
    search: "",
    categoryId: "",
    expenseCategoryId: "",
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

  const summary = ref({
    totalAmount: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    count: 0,
  });

  const viewMode = ref<ViewMode>("list");

  // Debounced search
  const searchQuery = ref("");
  let searchTimeout: ReturnType<typeof setTimeout>;

  // Edit modal state
  const isEditModalOpen = ref(false);
  const isVendorCreateModalOpen = ref(false);
  const isSubmitting = ref(false);
  const editError = ref<string | null>(null);
  const editingExpenseId = ref<string>("");
  const presetVendorName = ref("");

  // Form state
  const formData = ref<ExpenseFormData>({
    number: "",
    description: "",
    amount: 0,
    date: "",
    categoryId: "",
    expenseCategoryId: "",
    vendorId: "",
    jobId: "",
    taxId: "",
    notes: "",
    currency: "IDR",
    exchangeRate: 1,
  });

  const taxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);

  // Dynamic category options fetched from the API
  const serviceCategoryList = ref<
    Array<{ id: string; name: string; code?: string; isDefault?: boolean }>
  >([]);
  const categoryOptions = computed(() => {
    const isJob = filters.value.type === "JOB";
    return [
      { value: "", label: "Pilih Kategori" },
      ...serviceCategoryList.value
        .filter((cat) => {
          if (isJob) {
            return !cat.code || !cat.code.startsWith("GEN_");
          }
          return true;
        })
        .map((cat) => ({ value: cat.id, label: cat.name })),
    ];
  });

  // Computed
  const isLoading = computed(() => isExpenseLoading.value);

  // Watch for filter changes
  watch(
    () => [
      filters.value.search,
      filters.value.categoryId,
      filters.value.expenseCategoryId,
      filters.value.page,
    ],
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
      if (result.summary) {
        summary.value = result.summary;
      }
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };

  // Load dropdown data
  const loadDropdownData = async () => {
    const isJob = filters.value.type === "JOB";
    const fetchCategoryOptions = () =>
      isJob
        ? fetchCategories()
        : $fetch<Array<{ id: string; name: string; code?: string; isDefault?: boolean }>>(
            "/api/master/expense-categories",
          );

    const [_, __, taxes, catResult] = await Promise.all([
      canViewCompanies.value ? fetchCompanies({ type: "VENDOR" }) : Promise.resolve(undefined),
      canViewJobs.value ? fetchJobs() : Promise.resolve(undefined),
      canViewAccounting.value
        ? fetchTaxes({ isActive: true, limit: 100 })
        : Promise.resolve({ items: [] }),
      (isJob ? canViewServices.value : canViewFinanceMaster.value)
        ? fetchCategoryOptions()
        : Promise.resolve([]),
    ]);
    taxOptions.value = taxes?.items || [];
    if (isJob) {
      if (
        catResult &&
        typeof catResult === "object" &&
        "success" in catResult &&
        catResult.success &&
        Array.isArray(catResult.data)
      ) {
        serviceCategoryList.value = catResult.data.map(
          (c: { id: string; name: string; code?: string; isDefault?: boolean }) => ({
            id: c.id,
            name: c.name,
            code: c.code,
            isDefault: c.isDefault,
          }),
        );
      }
    } else {
      serviceCategoryList.value =
        (catResult as Array<{ id: string; name: string; code?: string; isDefault?: boolean }>) ||
        [];
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

  // Create/Edit handlers
  const openCreateModal = async () => {
    try {
      editingExpenseId.value = "";
      await loadDropdownData();

      // Pre-select the default category (service category for JOB, expense category otherwise).
      const isJob = filters.value.type === "JOB";
      const defaultCategoryId = selectDefaultId(serviceCategoryList.value);

      formData.value = {
        number: `EXP-${Date.now().toString().slice(-6)}`,
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0] || "",
        categoryId: isJob ? defaultCategoryId : "",
        expenseCategoryId: isJob ? "" : defaultCategoryId,
        vendorId: "",
        jobId: "",
        taxId: "",
        notes: "",
        currency: "IDR",
        exchangeRate: 1,
      };

      isEditModalOpen.value = true;
      editError.value = null;
    } catch (e) {
      console.error("Failed to open create modal:", e);
      editError.value = "Failed to load form initialization data";
    }
  };

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
        expenseCategoryId: exp.expenseCategoryId || "",
        vendorId: exp.vendor?.id || exp.vendorId || "",
        jobId: exp.job?.id || exp.jobId || "",
        taxId: exp.taxId || "",
        notes: exp.notes || "",
        currency: exp.currency || "IDR",
        exchangeRate: Number(exp.exchangeRate) || 1,
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

  const handleCreateVendor = (name: string) => {
    const vendorName = name.trim().toUpperCase();
    if (!vendorName) return;

    presetVendorName.value = vendorName;
    isVendorCreateModalOpen.value = true;
  };

  const handleVendorCreateSuccess = async (company: Company) => {
    try {
      await fetchCompanies({ type: "VENDOR" });
      formData.value.vendorId = company.id;
      isVendorCreateModalOpen.value = false;
      toast.success(`Vendor "${company.name}" berhasil dibuat.`);
    } catch (error) {
      console.error("Failed to refresh vendors:", error);
      toast.error("Vendor berhasil dibuat, tapi gagal refresh daftar vendor.");
    }
  };

  const handleCreateCategory = async (name: string) => {
    try {
      const categoryName = name.trim().toUpperCase();
      if (!categoryName) return;

      const isJob = filters.value.type === "JOB";
      const endpoint = isJob ? "/api/master/service-categories" : "/api/master/expense-categories";
      const created = await $fetch<{ id: string; name: string; code?: string }>(endpoint, {
        method: "POST",
        body: { name: categoryName },
      });

      serviceCategoryList.value = [
        ...serviceCategoryList.value.filter((item) => item.id !== created.id),
        created,
      ];

      if (isJob) {
        formData.value.categoryId = created.id;
      } else {
        formData.value.expenseCategoryId = created.id;
      }

      toast.success(`Kategori "${created.name}" berhasil dibuat.`);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Gagal membuat kategori.");
    }
  };

  const handleUpdate = async () => {
    try {
      isSubmitting.value = true;
      editError.value = null;

      // Frontend Validation
      if (formData.value.jobId) {
        if (!formData.value.categoryId) {
          editError.value = "Kategori Jasa wajib dipilih untuk Job Expense.";
          isSubmitting.value = false;
          return;
        }
        formData.value.expenseCategoryId = "";
      } else {
        if (!formData.value.expenseCategoryId) {
          editError.value = "Kategori Biaya wajib dipilih untuk General Expense.";
          isSubmitting.value = false;
          return;
        }
        formData.value.categoryId = "";
      }

      const payload = {
        number: formData.value.number,
        description: formData.value.description,
        amount: formData.value.amount,
        date: formData.value.date,
        categoryId: formData.value.categoryId || undefined,
        expenseCategoryId: formData.value.expenseCategoryId || undefined,
        vendorId: formData.value.vendorId || undefined,
        jobId: formData.value.jobId || undefined,
        taxId: formData.value.taxId || undefined,
        notes: formData.value.notes,
        currency: formData.value.currency,
        exchangeRate: formData.value.exchangeRate,
      };

      let result;
      if (editingExpenseId.value) {
        result = await updateExpense(editingExpenseId.value, payload);
      } else {
        result = await createExpense(payload);
      }

      if (result) {
        closeEditModal();
        await loadExpenses();
      } else {
        throw new Error("Failed to save expense");
      }
    } catch (e) {
      console.error("Failed to save expense:", e);
      editError.value = "Failed to save expense";
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

  // SSR Data Injection
  const setData = (data: {
    items?: Expense[];
    pagination?: Pagination;
    companies?: Company[];
    jobs?: JobWithBls[];
    taxOptions?: Tax[];
    summary?: {
      totalAmount: number;
      totalPaid: number;
      totalOutstanding: number;
      count: number;
    };
  }) => {
    if (data?.items) {
      expenses.value = data.items;
    }
    if (data?.pagination) {
      pagination.value = data.pagination;
    }
    if (data?.companies) {
      companies.value = data.companies;
    }
    if (data?.jobs) {
      jobs.value = data.jobs;
    }
    if (data?.taxOptions) {
      taxOptions.value = data.taxOptions;
    }
    if (data?.summary) {
      summary.value = data.summary;
    }
  };

  return {
    // State
    expenses,
    filters,
    pagination,
    summary,
    viewMode,
    searchQuery,
    isEditModalOpen,
    isVendorCreateModalOpen,
    isSubmitting,
    editError,
    editingExpenseId,
    presetVendorName,
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
    openCreateModal,
    openEditModal,
    closeEditModal,
    handleCreateVendor,
    handleVendorCreateSuccess,
    handleCreateCategory,
    handleUpdate,
    handleDelete,
    initialize,
    setData,
  };
}
