import type { StatCardData } from "~/types/finance";

/**
 * Finance Dashboard Page COGS Composable
 * Provides computed stats and handlers for the COGS tab
 */
export function useFinanceDashboardPageCogs() {
  const { stats, fetchAll, pagination } = useFinanceDashboard();
  const {
    selectedPeriod,
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,
    getCogsFilters,
  } = useFinanceDashboardFilters();

  // COGS Stats computed from API
  const cogsStats = computed<StatCardData[]>(() => {
    if (!stats.value) {
      return [
        {
          title: "Total COGS",
          value: "Rp0",
          changeLabel: "vs Last Period",
          isPrimary: true,
        },
        { title: "Average Cost/Job", value: "Rp0", changeLabel: "vs Last Period" },
        { title: "Highest Job", value: "Rp0", changeLabel: "vs Last Period" },
        { title: "Cost Growth", value: "0%", changeLabel: "From income", suffix: "%" },
      ];
    }
    const s = stats.value;
    return [
      {
        title: "Total COGS",
        value: s.totalCogsFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: "vs Last Period",
        isPrimary: true,
      },
      {
        title: "Average Cost/Job",
        value: s.averageCostPerJobFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: "vs Last Period",
      },
      {
        title: "Highest Job",
        value: s.highestJob?.cogsFormatted || "Rp0",
        change: s.costGrowth,
        changeLabel: s.highestJob?.jobNumber || "N/A",
      },
      {
        title: "Cost Growth",
        value: `${s.costGrowth || 0}%`,
        changeLabel: "From previous period",
        suffix: "%",
      },
    ];
  });

  // Debounce timer for search
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  // COGS search input handler with debounce
  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery.value = target.value;

    // Clear existing timer
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Debounce the search - trigger after 300ms of no input
    searchTimer = setTimeout(() => {
      handleSearch();
    }, 300);
  }

  // COGS search keydown handler
  async function handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // Clear timer and search immediately on Enter
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      await handleSearch();
    }
  }

  // COGS search handler
  async function handleSearch() {
    await fetchAll(selectedPeriod.value, getCogsFilters());
  }

  // Year change handler
  async function handleYearChange(year: string) {
    selectedYear.value = year;
    await fetchAll(selectedPeriod.value, getCogsFilters());
  }

  // Customer change handler
  async function handleCustomerChange(customerId: string) {
    cogsCustomerId.value = customerId;
    await fetchAll(selectedPeriod.value, getCogsFilters());
  }

  // Service change handler
  async function handleServiceChange(serviceId: string) {
    cogsServiceId.value = serviceId;
    await fetchAll(selectedPeriod.value, getCogsFilters());
  }

  // Sort handler
  async function handleSort(field: string) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      sortOrder.value = "desc";
    }
    await fetchAll(selectedPeriod.value, getCogsFilters());
  }

  // Toggle sort dropdown
  function handleSortDropdownToggle() {
    showSortDropdown.value = !showSortDropdown.value;
  }

  // Fetch COGS data
  async function fetchCogs(period: "day" | "week" | "month" | "year") {
    await fetchAll(period, getCogsFilters());
  }

  return {
    stats,
    cogsStats,
    pagination,
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,
    getCogsFilters,
    handleSearchInput,
    handleSearchKeydown,
    handleSearch,
    handleYearChange,
    handleCustomerChange,
    handleServiceChange,
    handleSort,
    handleSortDropdownToggle,
    fetchCogs,
  };
}
