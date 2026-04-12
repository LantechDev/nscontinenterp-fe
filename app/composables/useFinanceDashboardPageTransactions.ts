import type { StatCardData } from "~/types/finance";
import { formatRupiah } from "~/lib/utils";

/**
 * Finance Dashboard Page Transactions Composable
 * Provides computed stats and handlers for the Transactions tab
 */
export function useFinanceDashboardPageTransactions() {
  const { transactions, transactionStats, fetchTransactions, pagination } = useFinanceDashboard();
  const {
    selectedPeriod,
    currentPage,
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,
    getTransactionFilters,
  } = useFinanceDashboardFilters();

  // Calculate stats from transaction table data (derived from API stats)
  const transactionStatsCards = computed<StatCardData[]>(() => {
    // Use the stats from the API response (which covers all transactions, not just paginated)
    const t = transactionStats.value;

    if (!t) {
      return [
        { title: "Journal", value: "Rp0", isPrimary: true },
        { title: "Total Income", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Today Transaction", value: "0", changeLabel: "", suffix: "" },
      ];
    }

    return [
      {
        title: "Journal Volume",
        value: formatRupiah(t.totalJournal),
        isPrimary: true,
        changeLabel: "vs Last Period",
      },
      {
        title: "Total Transaction",
        value: formatRupiah(t.totalIncome),
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Today Transaction",
        value: `${t.todayTransactions}`,
        changeLabel: "Items today",
        suffix: " items",
      },
      {
        title: "All Transactions",
        value: `${pagination.value.total}`,
        changeLabel: "Total count",
        suffix: " items",
      },
    ];
  });

  // Debounce timer for search
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  // Search input handler with debounce
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    transactionSearch.value = target.value;

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }

  // Search keydown handler
  async function handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }

  // Search handler
  async function handleSearch() {
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  // Year change handler
  async function handleYearChange(year: string) {
    transactionYear.value = year;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  // Type change handler
  async function handleTypeChange(type: string) {
    transactionType.value = type;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  // Customer change handler
  async function handleCustomerChange(customerId: string) {
    transactionCustomerId.value = customerId;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  // Sort handler
  async function handleSort(field: string) {
    if (transactionSortBy.value === field) {
      transactionSortOrder.value = transactionSortOrder.value === "asc" ? "desc" : "asc";
    } else {
      transactionSortBy.value = field;
      transactionSortOrder.value = "desc";
    }
    showTransactionSortDropdown.value = false;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  // Toggle sort dropdown
  function handleSortDropdownToggle() {
    showTransactionSortDropdown.value = !showTransactionSortDropdown.value;
  }

  // Fetch transactions data
  async function fetchTxData(period: "day" | "week" | "month" | "year") {
    await fetchTransactions(
      period,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  }

  return {
    transactions,
    transactionStats,
    transactionStatsCards,
    pagination,
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,
    getTransactionFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleTypeChange,
    handleCustomerChange,
    handleSort,
    handleSortDropdownToggle,
    fetchTxData,
  };
}
