import type { PeriodType, TabName } from "~/types/finance";

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
 * Finance Dashboard Filters Composable
 * Manages all filter state for COGS, Transaction, and Finance Close tabs
 */
export function useFinanceDashboardFilters() {
  // Tab state
  const activeTab = ref<TabName>("Overview");
  const selectedPeriod = ref<PeriodType>("month");
  const currentPage = ref(1);

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

  // Get current filters for COGS tab (exclude undefined values)
  const getCogsFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: sortBy.value as "jobNumber" | "revenue" | "cogs" | "profit" | "margin" | "createdAt",
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

  // Get current filters for Transaction tab (exclude undefined values)
  const getTransactionFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: transactionSortBy.value as "date" | "jobNumber" | "customer" | "total",
      sortOrder: transactionSortOrder.value,
      type: transactionType.value as "invoice" | "payment" | "all",
      page: currentPage.value,
      limit: 10,
    };
    if (transactionSearch.value) filters.search = transactionSearch.value;
    if (transactionCustomerId.value) filters.companyId = transactionCustomerId.value;
    if (transactionYear.value) filters.year = parseInt(transactionYear.value);
    return filters;
  };

  // Get current filters for Finance Close tab (exclude undefined values)
  const getFinanceCloseFilters = (): Record<string, string | number> => {
    const filters: Record<string, string | number> = {
      sortBy: financeCloseSortBy.value as "date" | "jobNumber" | "customer" | "total",
      sortOrder: financeCloseSortOrder.value,
      type: financeCloseType.value as "invoice" | "payment" | "all",
      page: currentPage.value,
      limit: 10,
    };
    if (financeCloseSearch.value) filters.search = financeCloseSearch.value;
    if (financeCloseCustomerId.value) filters.companyId = financeCloseCustomerId.value;
    if (financeCloseYear.value) filters.year = parseInt(financeCloseYear.value);
    return filters;
  };

  // Reset page when tab changes
  const resetPage = () => {
    currentPage.value = 1;
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

  // Close all dropdowns
  const closeAllDropdowns = () => {
    showSortDropdown.value = false;
    showTransactionSortDropdown.value = false;
    showFinanceCloseSortDropdown.value = false;
  };

  return {
    // Tab state
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

    // Filter getters
    getCogsFilters,
    getTransactionFilters,
    getFinanceCloseFilters,

    // Actions
    resetPage,
    toggleSortDropdown,
    toggleTransactionSortDropdown,
    toggleFinanceCloseSortDropdown,
    closeAllDropdowns,
  };
}
