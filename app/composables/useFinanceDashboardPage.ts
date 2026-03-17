import { computed, ref, onMounted, onUnmounted } from "vue";
import { formatRupiah } from "~/lib/utils";
import { useFinanceDashboard } from "./useFinanceDashboard";
import { useFinanceCharts } from "./useFinanceCharts";
import { useFinanceDashboardFilters } from "./useFinanceDashboardFilters";
import { useCompanies } from "./useCompanies";
import { useServices } from "./useServices";
import type { StatCardData, TabName, PeriodType } from "~/types/finance";

export function useFinanceDashboardPage() {
  const { confirm } = useConfirm();

  // Composables - Data fetching
  const {
    isLoading,
    stats,
    overviewStats,
    jobCosts,
    transactions,
    transactionStats,
    financeCloseStats,
    closedPeriods,
    pagination,
    error,
    fetchAll,
    fetchOverviewStats,
    fetchTransactions,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  } = useFinanceDashboard();

  const {
    financialChartOptions,
    financialChartSeries,
    marginTrendChartOptions,
    marginTrendChartSeries,
    top5ChartOptions,
    top5ChartSeries,
    fetchChartData: fetchCharts,
  } = useFinanceCharts();

  // Composables - Filter state
  const {
    activeTab,
    selectedPeriod,
    currentPage,
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,
    getCogsFilters,
    getTransactionFilters,
    getFinanceCloseFilters,
    resetPage,
    closeAllDropdowns,
  } = useFinanceDashboardFilters();

  // Customer and Service list for filters
  const { companies, fetchCompanies } = useCompanies();
  const { services, fetchServices } = useServices();
  const isLoadingCustomers = ref(false);
  const isLoadingServices = ref(false);

  // ==================== COMPUTED STATS ====================

  // Overview Stats (from API)
  const overviewStatsCards = computed<StatCardData[]>(() => {
    if (!overviewStats.value) {
      return [
        {
          title: "Total Income",
          value: "Rp0",
          change: 0,
          changeLabel: "vs Last Period",
          isPrimary: true,
        },
        { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Net Profit", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Margins", value: "0%", changeLabel: "From income", suffix: "%" },
      ];
    }
    const o = overviewStats.value;
    return [
      {
        title: "Total Income",
        value: o.totalIncomeFormatted || "Rp0",
        change: o.incomeGrowth,
        changeLabel: "vs Last Period",
        isPrimary: true,
      },
      {
        title: "Total Outcome",
        value: o.totalOutcomeFormatted || "Rp0",
        change: o.outcomeGrowth,
        changeLabel: "vs Last Period",
      },
      {
        title: "Net Profit",
        value: o.netProfitFormatted || "Rp0",
        change: o.incomeGrowth,
        changeLabel: "vs Last Period",
      },
      { title: "Margins", value: `${o.margins || 0}%`, changeLabel: "From income", suffix: "%" },
    ];
  });

  // COGS Stats (computed from API)
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

  // Transaction Stats from API
  const transactionStatsCards = computed<StatCardData[]>(() => {
    if (!transactionStats.value) {
      return [
        { title: "Journal", value: "Rp0", isPrimary: true },
        { title: "Total Income", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Total Outcome", value: "Rp0", change: 0, changeLabel: "vs Last Period" },
        { title: "Today Transaction", value: "0", changeLabel: "", suffix: "" },
      ];
    }
    const t = transactionStats.value;
    return [
      { title: "Journal", value: formatRupiah(t.totalJournal), isPrimary: true },
      {
        title: "Total Income",
        value: formatRupiah(t.totalIncome),
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Total Outcome",
        value: formatRupiah(t.totalOutcome),
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Today Transaction",
        value: `${t.todayTransactions}`,
        changeLabel: "",
        suffix: "",
      },
    ];
  });

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

  // ==================== DATA FETCHING ====================

  // Fetch data based on active tab
  const fetchDataForTab = async (tab: TabName, period: PeriodType) => {
    switch (tab) {
      case "Overview":
        const overviewYear = selectedYear.value ? parseInt(selectedYear.value) : undefined;
        await fetchOverviewStats(period, overviewYear);
        await fetchCharts(period, overviewYear);
        break;
      case "COGS":
        await fetchAll(period, getCogsFilters());
        break;
      case "Transaction":
        await fetchTransactions(
          period,
          currentPage.value,
          pagination.value.limit,
          getTransactionFilters(),
        );
        break;
      case "Finance Close":
        const financeCloseYearValue = financeCloseYear.value
          ? parseInt(financeCloseYear.value)
          : undefined;
        await fetchFinanceCloseStats(period, financeCloseYearValue);
        await fetchClosedPeriods();
        await fetchTransactions(
          period,
          currentPage.value,
          pagination.value.limit,
          getFinanceCloseFilters(),
        );
        break;
    }
  };

  // Load customers for filter
  const loadCustomers = async () => {
    if (companies.value.length) return;
    isLoadingCustomers.value = true;
    try {
      await fetchCompanies({ type: "CUSTOMER" });
    } finally {
      isLoadingCustomers.value = false;
    }
  };

  // Load services for COGS filter
  const loadServices = async () => {
    if (services.value.length) return;
    isLoadingServices.value = true;
    try {
      await fetchServices();
    } finally {
      isLoadingServices.value = false;
    }
  };

  // ==================== EVENT HANDLERS ====================

  // Period and Tab changes
  const handlePeriodChange = async (period: PeriodType) => {
    selectedPeriod.value = period;
    resetPage();
    await fetchDataForTab(activeTab.value, period);
  };

  const handleTabChange = async (tab: TabName) => {
    activeTab.value = tab;
    resetPage();

    if (["COGS", "Transaction", "Finance Close"].includes(tab)) {
      await loadCustomers();
    }
    if (tab === "COGS") {
      await loadServices();
    }

    await fetchDataForTab(tab, selectedPeriod.value);
  };

  // Page change handler
  const handlePageChange = async (newPage: number) => {
    currentPage.value = newPage;
    if (activeTab.value === "COGS") {
      await fetchAll(selectedPeriod.value, { ...getCogsFilters(), page: newPage });
    } else if (activeTab.value === "Transaction") {
      await fetchTransactions(
        selectedPeriod.value,
        newPage,
        pagination.value.limit,
        getTransactionFilters(),
      );
    } else if (activeTab.value === "Finance Close") {
      const yearValue = financeCloseYear.value ? parseInt(financeCloseYear.value) : undefined;
      await fetchFinanceCloseStats(selectedPeriod.value, yearValue);
      await fetchTransactions(
        selectedPeriod.value,
        newPage,
        pagination.value.limit,
        getFinanceCloseFilters(),
      );
    }
  };

  // Period close/reopen handlers
  const handleClosePeriod = async () => {
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
  };

  const handleReopenPeriod = async (periodCloseId: string) => {
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
  };

  // COGS Tab event handlers
  const handleYearChange = async (year: string) => {
    selectedYear.value = year;
    resetPage();
    await fetchAll(selectedPeriod.value, getCogsFilters());
  };

  const handleCogsCustomerChange = async (customerId: string) => {
    cogsCustomerId.value = customerId;
    resetPage();
    await fetchAll(selectedPeriod.value, getCogsFilters());
  };

  const handleCogsServiceChange = async (serviceId: string) => {
    cogsServiceId.value = serviceId;
    resetPage();
    await fetchAll(selectedPeriod.value, getCogsFilters());
  };

  const handleCogsSearch = async () => {
    resetPage();
    await fetchAll(selectedPeriod.value, getCogsFilters());
  };

  // Debounce timer for COGS search
  let cogsSearchTimer: ReturnType<typeof setTimeout> | null = null;

  const handleCogsSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchQuery.value = target.value;

    // Clear existing timer
    if (cogsSearchTimer) {
      clearTimeout(cogsSearchTimer);
    }

    // Debounce the search - trigger after 300ms of no input
    cogsSearchTimer = setTimeout(() => {
      handleCogsSearch();
    }, 300);
  };

  const handleCogsSearchKeydown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // Clear timer and search immediately on Enter
      if (cogsSearchTimer) {
        clearTimeout(cogsSearchTimer);
      }
      await handleCogsSearch();
    }
  };

  const handleCogsSort = async (field: string) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      sortOrder.value = "desc";
    }
    resetPage();
    await fetchAll(selectedPeriod.value, getCogsFilters());
  };

  // Transaction Tab event handlers
  const handleTransactionYearChange = async (year: string) => {
    transactionYear.value = year;
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  };

  const handleTransactionTypeChange = async (type: string) => {
    transactionType.value = type;
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  };

  const handleTransactionCustomerChange = async (customerId: string) => {
    transactionCustomerId.value = customerId;
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  };

  const handleTransactionSearch = async () => {
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  };

  // Debounce timer for transaction search
  let transactionSearchTimer: ReturnType<typeof setTimeout> | null = null;

  const handleTransactionSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    transactionSearch.value = target.value;

    // Clear existing timer
    if (transactionSearchTimer) {
      clearTimeout(transactionSearchTimer);
    }

    // Debounce the search - trigger after 300ms of no input
    transactionSearchTimer = setTimeout(() => {
      handleTransactionSearch();
    }, 300);
  };

  const handleTransactionSearchKeydown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // Clear timer and search immediately on Enter
      if (transactionSearchTimer) {
        clearTimeout(transactionSearchTimer);
      }
      await handleTransactionSearch();
    }
  };

  const handleTransactionSort = async (field: string) => {
    if (transactionSortBy.value === field) {
      transactionSortOrder.value = transactionSortOrder.value === "asc" ? "desc" : "asc";
    } else {
      transactionSortBy.value = field;
      transactionSortOrder.value = "desc";
    }
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getTransactionFilters(),
    );
  };

  // Finance Close Tab event handlers
  const handleFinanceCloseYearChange = async (year: string) => {
    financeCloseYear.value = year;
    resetPage();
    const yearValue = year ? parseInt(year) : undefined;
    await fetchFinanceCloseStats(selectedPeriod.value, yearValue);
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  };

  const handleFinanceCloseTypeChange = async (type: string) => {
    financeCloseType.value = type;
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  };

  const handleFinanceCloseCustomerChange = async (customerId: string) => {
    financeCloseCustomerId.value = customerId;
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  };

  const handleFinanceCloseSearch = async () => {
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  };

  // Debounce timer for finance close search
  let financeCloseSearchTimer: ReturnType<typeof setTimeout> | null = null;

  const handleFinanceCloseSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    financeCloseSearch.value = target.value;

    // Clear existing timer
    if (financeCloseSearchTimer) {
      clearTimeout(financeCloseSearchTimer);
    }

    // Debounce the search - trigger after 300ms of no input
    financeCloseSearchTimer = setTimeout(() => {
      handleFinanceCloseSearch();
    }, 300);
  };

  const handleFinanceCloseSearchKeydown = async (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      // Clear timer and search immediately on Enter
      if (financeCloseSearchTimer) {
        clearTimeout(financeCloseSearchTimer);
      }
      await handleFinanceCloseSearch();
    }
  };

  const handleFinanceCloseSort = async (field: string) => {
    if (financeCloseSortBy.value === field) {
      financeCloseSortOrder.value = financeCloseSortOrder.value === "asc" ? "desc" : "asc";
    } else {
      financeCloseSortBy.value = field;
      financeCloseSortOrder.value = "desc";
    }
    resetPage();
    await fetchTransactions(
      selectedPeriod.value,
      currentPage.value,
      pagination.value.limit,
      getFinanceCloseFilters(),
    );
  };

  // Click outside handler
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      closeAllDropdowns();
    }
  };

  // Lifecycle
  onMounted(async () => {
    document.addEventListener("click", handleClickOutside);

    // TRACE Org Context
    try {
      const { session } = useAuth();
      console.log("[FE_TRACE] Active Organization ID:", session.value?.activeOrganizationId);
    } catch {}

    await fetchDataForTab(activeTab.value, selectedPeriod.value);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return {
    // State
    isLoading,
    error,
    selectedPeriod,
    activeTab,
    currentPage,
    selectedYear,
    searchQuery,
    cogsCustomerId,
    cogsServiceId,
    sortBy,
    sortOrder,
    showSortDropdown,
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
    showTransactionSortDropdown,
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
    showFinanceCloseSortDropdown,
    isLoadingCustomers,
    isLoadingServices,

    // Data
    stats,
    overviewStats,
    jobCosts,
    transactions,
    transactionStats,
    financeCloseStats,
    closedPeriods,
    pagination,
    companies,
    services,

    // Chart data
    financialChartOptions,
    financialChartSeries,
    marginTrendChartOptions,
    marginTrendChartSeries,
    top5ChartOptions,
    top5ChartSeries,

    // Computed stats
    overviewStatsCards,
    cogsStats,
    transactionStatsCards,
    financeCloseData,

    // Event handlers
    handlePeriodChange,
    handleTabChange,
    handlePageChange,
    handleClosePeriod,
    handleReopenPeriod,
    handleYearChange,
    handleCogsCustomerChange,
    handleCogsServiceChange,
    handleCogsSearch,
    handleCogsSearchInput,
    handleCogsSearchKeydown,
    handleCogsSort,
    handleTransactionYearChange,
    handleTransactionTypeChange,
    handleTransactionCustomerChange,
    handleTransactionSearch,
    handleTransactionSearchInput,
    handleTransactionSearchKeydown,
    handleTransactionSort,
    handleFinanceCloseYearChange,
    handleFinanceCloseTypeChange,
    handleFinanceCloseCustomerChange,
    handleFinanceCloseSearch,
    handleFinanceCloseSearchInput,
    handleFinanceCloseSearchKeydown,
    handleFinanceCloseSort,
  };
}
