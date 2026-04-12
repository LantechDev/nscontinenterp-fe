import { useFinanceDashboardPageState } from "./useFinanceDashboardPageState";

/**
 * Filter state interfaces
 */
export interface CogsFilters {
  selectedYear: string;
  searchQuery: string;
  customerId: string;
  serviceId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
}

export interface TransactionFilters {
  year: string;
  type: string;
  customerId: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
}

export interface FinanceCloseFilters {
  year: string;
  type: string;
  customerId: string;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
}

export interface ArApFilters {
  arApToggle: "ar" | "ap";
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
  statusFilter: string;
}

/**
 * Singletons to ensure consistency across the dashboard
 */
// COGS Filter/Sort/Search state
const selectedYear = ref<string>(new Date().getFullYear().toString());
const searchQuery = ref<string>("");
const cogsCustomerId = ref<string>("");
const cogsServiceId = ref<string>("");
const sortBy = ref<string>("createdAt");
const sortOrder = ref<"asc" | "desc">("desc");
const showSortDropdown = ref(false);

// Transaction Filter/Sort/Search state
const transactionYear = ref<string>("");
const transactionType = ref<string>("all");
const transactionCustomerId = ref<string>("");
const transactionSearch = ref<string>("");
const transactionSortBy = ref<string>("date");
const transactionSortOrder = ref<"asc" | "desc">("desc");
const showTransactionSortDropdown = ref(false);

// Finance Close Filter/Sort/Search state
const financeCloseYear = ref<string>("");
const financeCloseType = ref<string>("all");
const financeCloseCustomerId = ref<string>("");
const financeCloseSearch = ref<string>("");
const financeCloseSortBy = ref<string>("date");
const financeCloseSortOrder = ref<"asc" | "desc">("desc");
const showFinanceCloseSortDropdown = ref(false);

// Accounts Receivable/Payable Filter/Sort/Search state
const arApToggle = ref<"ar" | "ap">("ar");
const arApSearch = ref<string>("");
const arApSortBy = ref<string>("dueDate");
const arApSortOrder = ref<"asc" | "desc">("asc");
const showArApSortDropdown = ref(false);
const arApStatusFilter = ref<string>("all");

/**
 * Available years for dropdown - last 6 years including current
 */
export function useAvailableYears() {
  return computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i.toString());
    }
    return years;
  });
}

/**
 * COGS Sort options
 */
export function useCogsSortOptions() {
  return [
    { value: "createdAt", label: "Date" },
    { value: "jobNumber", label: "Job Number" },
    { value: "revenue", label: "Revenue" },
    { value: "cogs", label: "COGS" },
    { value: "profit", label: "Profit" },
    { value: "margin", label: "Margin" },
  ];
}

/**
 * Transaction sort options
 */
export function useTransactionSortOptions() {
  return [
    { value: "date", label: "Date" },
    { value: "jobNumber", label: "Job Number" },
    { value: "customer", label: "Customer" },
    { value: "total", label: "Total Amount" },
  ];
}

/**
 * Transaction type options
 */
export function useTransactionTypeOptions() {
  return [
    { value: "all", label: "All" },
    { value: "invoice", label: "Customer Invoice" },
    { value: "payment", label: "Payment Out" },
  ];
}

/**
 * Assets sort options
 */
export function useAssetsSortOptions() {
  return [
    { value: "date", label: "Date" },
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "createdAt", label: "Created" },
  ];
}

/**
 * AR/AP status options
 */
export function useArApStatusOptions() {
  return [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "partial", label: "Partial" },
    { value: "payment_out", label: "Payment Out" },
  ];
}

/**
 * AR/AP sort options
 */
export function useArApSortOptions() {
  return [
    { value: "dueDate", label: "Due Date" },
    { value: "invoiceNumber", label: "Invoice Number" },
    { value: "company", label: "Company" },
    { value: "total", label: "Total Amount" },
    { value: "remaining", label: "Remaining" },
    { value: "aging", label: "Aging" },
  ];
}

/**
 * Finance Dashboard Filters Composable
 * Manages all filter state for COGS, Transaction, and Finance Close tabs
 */
export function useFinanceDashboardFilters() {
  // Shared state from the page state singleton
  const {
    activeTab,
    selectedPeriod,
    currentPage,
    resetPage: resetPageInStore,
  } = useFinanceDashboardPageState();

  // Get current filters for COGS tab
  const getCogsFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      page: currentPage.value,
      limit: 10,
    };
    if (searchQuery.value) filters.search = searchQuery.value;
    if (cogsCustomerId.value) filters.companyId = cogsCustomerId.value;
    if (cogsServiceId.value) filters.serviceId = cogsServiceId.value;
    if (selectedYear.value) filters.year = parseInt(selectedYear.value);
    return filters;
  };

  // Get current filters for Transaction tab
  const getTransactionFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: transactionSortBy.value,
      sortOrder: transactionSortOrder.value,
      type: transactionType.value,
      page: currentPage.value,
      limit: 10,
    };
    if (transactionSearch.value && transactionSearch.value.trim()) {
      filters.search = transactionSearch.value.trim();
    }
    if (transactionCustomerId.value) {
      filters.companyId = transactionCustomerId.value;
    }
    if (transactionYear.value) {
      filters.year = parseInt(transactionYear.value);
    }
    return filters;
  };

  // Get current filters for Finance Close tab
  const getFinanceCloseFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: financeCloseSortBy.value,
      sortOrder: financeCloseSortBy.value === "date" ? "desc" : "asc",
      type: financeCloseType.value,
      page: currentPage.value,
      limit: 10,
    };
    if (financeCloseSearch.value && financeCloseSearch.value.trim()) {
      filters.search = financeCloseSearch.value.trim();
    }
    if (financeCloseCustomerId.value) {
      filters.companyId = financeCloseCustomerId.value;
    }
    if (financeCloseYear.value) {
      filters.year = parseInt(financeCloseYear.value);
    }
    return filters;
  };

  // Get current filters for AR/AP tab
  const getArApFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      type: arApToggle.value,
      sortBy: arApSortBy.value,
      sortOrder: arApSortOrder.value,
      status: arApStatusFilter.value,
      page: currentPage.value,
      limit: 10,
    };
    if (arApSearch.value) filters.search = arApSearch.value;
    return filters;
  };

  // Wrap the resetPage function
  const resetPage = () => {
    resetPageInStore();
  };

  // Toggle sort dropdowns
  const toggleSortDropdown = () => {
    showSortDropdown.value = !showSortDropdown.value;
  };

  const toggleTransactionSortDropdown = () => {
    showTransactionSortDropdown.value = !showTransactionSortDropdown.value;
  };

  const toggleFinanceCloseSortDropdown = () => {
    showFinanceCloseSortDropdown.value = !showFinanceCloseSortDropdown.value;
  };

  const toggleArApSortDropdown = () => {
    showArApSortDropdown.value = !showArApSortDropdown.value;
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    showSortDropdown.value = false;
    showTransactionSortDropdown.value = false;
    showFinanceCloseSortDropdown.value = false;
    showArApSortDropdown.value = false;
  };

  return {
    // Tab state (proxied from singleton)
    activeTab,
    selectedPeriod,
    currentPage,

    // COGS state
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,

    // Transaction state
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,

    // Finance Close state
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,

    // AR/AP state
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,

    // Filter getters
    getCogsFilters,
    getTransactionFilters,
    getFinanceCloseFilters,
    getArApFilters,

    // Actions
    resetPage,
    toggleSortDropdown,
    toggleTransactionSortDropdown,
    toggleFinanceCloseSortDropdown,
    toggleArApSortDropdown,
    closeAllDropdowns,
  };
}
