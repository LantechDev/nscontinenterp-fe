import type { StatCardData } from "~/types/finance";

function formatFullRupiah(value: unknown): string {
  const num = typeof value === "number" ? value : Number(value || 0);
  if (isNaN(num)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Finance Dashboard Page Transactions Composable
 * Provides computed stats and handlers for the Transactions tab
 */
export function useFinanceDashboardPageTransactions() {
  const {
    transactions,
    transactionStats,
    fetchTransactions,
    transactionPagination: pagination,
  } = useFinanceDashboard();
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
        {
          title: "Total Revenue",
          value: "Rp0",
          subtitle: "Semua customer invoice / earned revenue",
          tooltip: "Total revenue from customer invoices.",
          color: "green",
          changeLabel: "vs Last Period",
        },
        {
          title: "Total Expense",
          value: "Rp0",
          subtitle: "Semua vendor invoice + operational expense",
          tooltip: "Total operational and vendor expenses.",
          color: "red",
          changeLabel: "vs Last Period",
        },
        {
          title: "Gross Profit",
          value: "Rp0",
          subtitle: "Formula: Revenue - Expense",
          tooltip: "Gross profit before tax and adjustments.",
          color: "blue",
          changeLabel: "vs Last Period",
        },
        {
          title: "Journal Volume",
          value: "Rp0",
          subtitle: "Formula: Revenue + Expense",
          tooltip: "Total financial movement recorded in journals.",
          color: "neutral",
          changeLabel: "vs Last Period",
        },
      ];
    }

    const revenueVal = t.totalIncome;
    const expenseVal = t.totalOutcome;
    const grossProfitVal = revenueVal - expenseVal;
    const journalVolumeVal = t.totalJournal;

    return [
      {
        title: "Total Revenue",
        value: formatFullRupiah(revenueVal),
        subtitle: "Semua customer invoice / earned revenue",
        tooltip: "Total revenue from customer invoices.",
        color: "green",
        changeLabel: "vs Last Period",
      },
      {
        title: "Total Expense",
        value: formatFullRupiah(expenseVal),
        subtitle: "Semua vendor invoice + operational expense",
        tooltip: "Total operational and vendor expenses.",
        color: "red",
        changeLabel: "vs Last Period",
      },
      {
        title: "Gross Profit",
        value: formatFullRupiah(grossProfitVal),
        subtitle: "Formula: Revenue - Expense",
        tooltip: "Gross profit before tax and adjustments.",
        color: "blue",
        changeLabel: "vs Last Period",
      },
      {
        title: "Journal Volume",
        value: formatFullRupiah(journalVolumeVal),
        subtitle: "Formula: Revenue + Expense",
        tooltip: "Total financial movement recorded in journals.",
        color: "neutral",
        changeLabel: "vs Last Period",
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
