/**
 * Finance Dashboard Page Finance Close Composable
 * Provides computed stats and handlers for the Finance Close tab
 */
export function useFinanceDashboardPageFinanceClose() {
  const {
    financeCloseStats,
    closedPeriods,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  } = useFinanceDashboard();
  const { confirm } = useConfirm();
  const {
    selectedPeriod,
    currentPage,
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,
    getFinanceCloseFilters,
  } = useFinanceDashboardFilters();
  const { transactions, fetchTransactions, pagination } = useFinanceDashboard();

  // Finance Close Stats from API
  const financeCloseData = computed(() => {
    return (
      financeCloseStats.value || {
        period: "Loading...",
        status: "Open" as const,
        description: "Loading...",
        revenue: "Rp0",
        cogs: "Rp0",
        nettPL: "Rp0",
        readinessScore: 0,
      }
    );
  });

  // Debounce timer for search
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  // Search input handler with debounce
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    financeCloseSearch.value = target.value;

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
      getFinanceCloseFilters(),
    );
  }

  // Year change handler
  async function handleYearChange(year: string) {
    financeCloseYear.value = year;
    const yearValue = year ? parseInt(year) : undefined;
    await fetchFinanceCloseStats(selectedPeriod.value, yearValue);
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  }

  // Type change handler
  async function handleTypeChange(type: string) {
    financeCloseType.value = type;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  }

  // Customer change handler
  async function handleCustomerChange(customerId: string) {
    financeCloseCustomerId.value = customerId;
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  }

  // Sort handler
  async function handleSort(field: string) {
    if (financeCloseSortBy.value === field) {
      financeCloseSortOrder.value = financeCloseSortOrder.value === "asc" ? "desc" : "asc";
    } else {
      financeCloseSortBy.value = field;
      financeCloseSortOrder.value = "desc";
    }
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  }

  // Toggle sort dropdown
  function handleSortDropdownToggle() {
    showFinanceCloseSortDropdown.value = !showFinanceCloseSortDropdown.value;
  }

  // Close period handler
  async function handleClosePeriod() {
    const confirmed = await confirm({
      title: "Close Period",
      message: "Are you sure you want to close this period? This action cannot be undone.",
      type: "danger",
    });
    if (!confirmed) return;

    const result = await closePeriod(selectedPeriod.value);
    if (result) {
      await confirm({
        title: result.success ? "Success" : "Error",
        message: result.message,
        type: result.success ? undefined : "danger",
      });
    }
  }

  // Reopen period handler
  async function handleReopenPeriod(periodCloseId: string) {
    const confirmed = await confirm({
      title: "Reopen Period",
      message:
        "Are you sure you want to reopen this period? This will allow modifications to transactions in this period.",
    });
    if (!confirmed) return;

    const result = await reopenPeriod(periodCloseId);
    if (result) {
      await confirm({
        title: result.success ? "Success" : "Error",
        message: result.message,
        type: result.success ? undefined : "danger",
      });
    }
  }

  // Fetch finance close data
  async function fetchFinanceClose(period: "day" | "week" | "month" | "year") {
    const yearValue = financeCloseYear.value ? parseInt(financeCloseYear.value) : undefined;
    await fetchFinanceCloseStats(period, yearValue);
    await fetchClosedPeriods();
    await fetchTransactions(
      period,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  }

  return {
    financeCloseStats,
    closedPeriods,
    financeCloseData,
    transactions,
    pagination,
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,
    getFinanceCloseFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleTypeChange,
    handleCustomerChange,
    handleSort,
    handleSortDropdownToggle,
    handleClosePeriod,
    handleReopenPeriod,
    fetchFinanceClose,
  };
}
