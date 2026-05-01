import { u as useFinanceExpense } from "./useFinanceExpense-CyuGq-0f.mjs";
import { u as useCompanies } from "./useCompanies-D5TCq9CR.mjs";
import { u as useJobs } from "./useJobs-BuvuAhhz.mjs";
import { u as useConfirm } from "./useConfirm-iFV_8p0v.mjs";
import { n as navigateTo } from "./server.mjs";
import { ref, computed, watch } from "vue";

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
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};
const navigateToExpense = (id) => {
  navigateTo(`/finance/expenses/${id}`);
};
const categoryOptions = [
  { value: "", label: "Pilih Kategori" },
  { value: "trucking", label: "Trucking" },
  { value: "port", label: "Port" },
  { value: "customs", label: "Customs" },
  { value: "handling", label: "Handling" },
  { value: "storage", label: "Storage" },
  { value: "other", label: "Lainnya" },
];
function useExpensePage() {
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
  const filters = ref({
    search: "",
    categoryId: "",
    page: 1,
    limit: 10,
  });
  const expenses = ref([]);
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
  const editingExpenseId = ref("");
  const formData = ref({
    number: "",
    description: "",
    amount: 0,
    date: "",
    categoryId: "",
    vendorId: "",
    jobId: "",
    notes: "",
  });
  const isLoading = computed(() => isExpenseLoading.value);
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
  const loadExpenses = async () => {
    try {
      const result = await fetchExpenses(filters.value);
      expenses.value = result.items;
      pagination.value = result.pagination;
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };
  const loadDropdownData = async () => {
    await Promise.all([fetchCompanies({ type: "VENDOR" }), fetchJobs()]);
  };
  const handlePageChange = (page) => {
    filters.value.page = page;
  };
  const handleRowClick = (id) => {
    navigateToExpense(id);
  };
  const openEditModal = async (id) => {
    try {
      editingExpenseId.value = id;
      const expenseData = await fetchExpenseById(id);
      if (!expenseData) {
        throw new Error("Failed to load expense data");
      }
      const exp = expenseData;
      await loadDropdownData();
      formData.value = {
        number: exp.number || "",
        description: exp.description || "",
        amount: Number(exp.amount) || 0,
        date: formatDateForInput(exp.date),
        categoryId: exp.categoryId || "",
        vendorId: exp.vendor?.id || exp.vendorId || "",
        jobId: exp.job?.id || exp.jobId || "",
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
        categoryId: formData.value.categoryId || void 0,
        vendorId: formData.value.vendorId || void 0,
        jobId: formData.value.jobId || void 0,
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
  const handleDelete = async (id) => {
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
        alert("Gagal menghapus biaya. Silakan coba lagi.");
      }
    }
  };
  const initialize = () => {
    loadExpenses();
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

export { formatCurrency as f, useExpensePage as u };
//# sourceMappingURL=useExpensePage-CibEMg65.mjs.map
