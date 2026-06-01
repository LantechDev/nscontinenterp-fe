/**
 * Finance Dashboard Page AR/AP Composable
 * Provides computed stats and handlers for the Accounts Receivable/Payable tab
 */
export function useFinanceDashboardPageArAp() {
  const {
    arApItems,
    arApStats,
    fetchArApItems,
    fetchArApStats,
    arApPagination: pagination,
  } = useFinanceDashboard();
  // confirm is not used - keeping the import for potential future use
  useConfirm();
  const {
    selectedPeriod,
    currentPage,
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,
    getArApFilters,
  } = useFinanceDashboardFilters();

  // Debounce timer for search
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  // Search input handler with debounce
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    arApSearch.value = target.value;

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
    await Promise.all([
      fetchArApItems(
        selectedPeriod.value,
        currentPage.value,
        pagination.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod.value, getArApFilters()),
    ]);
  }

  // Toggle change handler (AR/AP switch)
  async function handleToggleChange(toggle: "ar" | "ap") {
    arApToggle.value = toggle;
    await Promise.all([
      fetchArApItems(
        selectedPeriod.value,
        currentPage.value,
        pagination.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod.value, getArApFilters()),
    ]);
  }

  // Sort handler
  async function handleSort(field: string) {
    if (arApSortBy.value === field) {
      arApSortOrder.value = arApSortOrder.value === "asc" ? "desc" : "asc";
    } else {
      arApSortBy.value = field;
      arApSortOrder.value = "desc";
    }
    showArApSortDropdown.value = false;
    await Promise.all([
      fetchArApItems(
        selectedPeriod.value,
        currentPage.value,
        pagination.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod.value, getArApFilters()),
    ]);
  }

  // Toggle sort dropdown
  function handleSortDropdownToggle() {
    showArApSortDropdown.value = !showArApSortDropdown.value;
  }

  // Status filter change handler
  async function handleStatusFilterChange(status: string) {
    arApStatusFilter.value = status;
    await Promise.all([
      fetchArApItems(
        selectedPeriod.value,
        currentPage.value,
        pagination.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod.value, getArApFilters()),
    ]);
  }

  // Fetch AR/AP data
  async function fetchArAp(period: "day" | "week" | "month" | "year" | "custom") {
    await Promise.all([
      fetchArApItems(period, currentPage.value, pagination.value.limit, getArApFilters()),
      fetchArApStats(period, getArApFilters()),
    ]);
  }

  // Refresh handler (for after payment is made)
  async function handleRefresh() {
    await Promise.all([
      fetchArApItems(
        selectedPeriod.value,
        currentPage.value,
        pagination.value.limit,
        getArApFilters(),
      ),
      fetchArApStats(selectedPeriod.value, getArApFilters()),
    ]);
  }

  return {
    arApItems,
    arApStats,
    pagination,
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,
    getArApFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleToggleChange,
    handleSort,
    handleSortDropdownToggle,
    handleStatusFilterChange,
    fetchArAp,
    handleRefresh,
  };
}
