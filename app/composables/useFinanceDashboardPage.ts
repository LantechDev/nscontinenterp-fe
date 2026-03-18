/**
 * Finance Dashboard Page Composable
 * Main entry point re-exporting finance dashboard page functionality from sub-composables.
 */
import { onMounted, onUnmounted, watch } from "vue";
import type { TabName, PeriodType } from "~/types/finance";

export function useFinanceDashboardPage() {
  // State
  const pageState = useFinanceDashboardPageState();
  const { activeTab, selectedPeriod, currentPage, resetPage } = pageState;

  // Filters
  const filters = useFinanceDashboardFilters();
  const {
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
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,
  } = filters;

  // Tab modules
  const overview = useFinanceDashboardPageOverview();
  const cogs = useFinanceDashboardPageCogs();
  const transactions = useFinanceDashboardPageTransactions();
  const financeClose = useFinanceDashboardPageFinanceClose();
  const arAp = useFinanceDashboardPageArAp();

  // Shared dashboard
  const dashboard = useFinanceDashboard();
  const { isLoading, error, jobCosts, cogsPagination, transactionPagination, arApPagination } =
    dashboard;

  // Computed pagination bridge for component compatibility
  const pagination = computed(() => {
    switch (activeTab.value) {
      case "COGS":
        return cogsPagination.value;
      case "Transaction":
        return transactionPagination.value;
      case "Accounts Receivable":
        return arApPagination.value;
      default:
        return cogsPagination.value;
    }
  });

  // Companies & services
  const { companies, fetchCompanies } = useCompanies();
  const { services, fetchServices } = useServices();
  const isLoadingCustomers = ref(false);
  const isLoadingServices = ref(false);

  // Data fetching
  async function fetchDataForTab(tab: TabName, period: PeriodType) {
    switch (tab) {
      case "Overview": {
        const year = selectedYear.value ? parseInt(selectedYear.value) : undefined;
        await overview.fetchOverview(period, year);
        break;
      }
      case "COGS":
        await dashboard.fetchAll(period, filters.getCogsFilters());
        break;
      case "Transaction":
        await transactions.fetchTxData(period);
        break;
      case "Finance Close":
        await financeClose.fetchFinanceClose(period);
        break;
      case "Accounts Receivable":
        await arAp.fetchArAp(period);
        break;
      case "Assets":
        // Assets are loaded separately via the assets composable
        // No need to fetch here as it's handled in the dashboard.vue
        break;
    }
  }

  // Event handlers
  async function loadCustomers() {
    if (companies.value.length) return;
    isLoadingCustomers.value = true;
    try {
      await fetchCompanies({ type: "CUSTOMER" });
    } finally {
      isLoadingCustomers.value = false;
    }
  }

  async function loadServices() {
    if (services.value.length) return;
    isLoadingServices.value = true;
    try {
      await fetchServices();
    } finally {
      isLoadingServices.value = false;
    }
  }

  async function handlePeriodChange(period: PeriodType) {
    selectedPeriod.value = period;
    resetPage();
    await fetchDataForTab(activeTab.value, period);
  }

  async function handleTabChange(tab: TabName) {
    activeTab.value = tab;
    resetPage();
    if (["COGS", "Transaction", "Finance Close"].includes(tab)) await loadCustomers();
    if (tab === "COGS") await loadServices();
    await fetchDataForTab(tab, selectedPeriod.value);
  }

  async function handlePageChange(newPage: number) {
    currentPage.value = newPage;

    const active = activeTab.value;
    if (active === "COGS") {
      await dashboard.fetchJobCosts(selectedPeriod.value, {
        ...filters.getCogsFilters(),
        page: newPage,
      });
    } else if (active === "Transaction") {
      await dashboard.fetchTransactions(
        selectedPeriod.value,
        newPage,
        transactionPagination.value.limit,
        filters.getTransactionFilters(),
      );
    } else if (active === "Finance Close") {
      await financeClose.fetchFinanceClose(selectedPeriod.value);
    } else if (active === "Accounts Receivable") {
      await dashboard.fetchArApItems(
        selectedPeriod.value,
        newPage,
        arApPagination.value.limit,
        filters.getArApFilters(),
      );
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) filters.closeAllDropdowns();
  }

  // Lifecycle
  onMounted(async () => {
    document.addEventListener("click", handleClickOutside);
    try {
      const { session } = useAuth();
      console.log("[FE_TRACE] Active Org ID:", session.value?.activeOrganizationId);
    } catch {
      /* ignore */
    }
    await Promise.all([loadCustomers(), loadServices()]);
    await fetchDataForTab(activeTab.value, selectedPeriod.value);
  });

  onUnmounted(() => document.removeEventListener("click", handleClickOutside));

  watch(arApToggle, async () => {
    if (activeTab.value === "Accounts Receivable") {
      resetPage();
      await fetchDataForTab("Accounts Receivable", selectedPeriod.value);
    }
  });

  // Combined return
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
    arApToggle,
    arApSearch,
    arApSortBy,
    arApSortOrder,
    showArApSortDropdown,
    arApStatusFilter,
    isLoadingCustomers,
    isLoadingServices,

    // Data
    stats: overview.overviewStats,
    overviewStats: overview.overviewStats,
    jobCosts,
    transactions: dashboard.transactions,
    transactionStats: dashboard.transactionStats,
    financeCloseStats: financeClose.financeCloseStats,
    closedPeriods: financeClose.closedPeriods,
    arApItems: arAp.arApItems,
    arApStats: arAp.arApStats,
    pagination,
    companies,
    services,

    // Chart data
    chartData: overview.chartData,
    financialChartOptions: overview.financialChartOptions,
    financialChartSeries: overview.financialChartSeries,
    marginTrendChartOptions: overview.marginTrendChartOptions,
    marginTrendChartSeries: overview.marginTrendChartSeries,
    top5ChartOptions: overview.top5ChartOptions,
    top5ChartSeries: overview.top5ChartSeries,

    // Computed stats
    overviewStatsCards: overview.overviewStatsCards,
    cogsStats: cogs.cogsStats,
    transactionStatsCards: transactions.transactionStatsCards,
    financeCloseData: financeClose.financeCloseData,

    // Handlers
    handlePeriodChange,
    handleTabChange,
    handlePageChange,
    handleClosePeriod: financeClose.handleClosePeriod,
    handleReopenPeriod: financeClose.handleReopenPeriod,
    handleYearChange: cogs.handleYearChange,
    handleCogsCustomerChange: cogs.handleCustomerChange,
    handleCogsServiceChange: cogs.handleServiceChange,
    handleCogsSearch: cogs.handleSearch,
    handleCogsSearchInput: cogs.handleSearchInput,
    handleCogsSearchKeydown: cogs.handleSearchKeydown,
    handleCogsSort: cogs.handleSort,
    handleTransactionYearChange: transactions.handleYearChange,
    handleTransactionTypeChange: transactions.handleTypeChange,
    handleTransactionCustomerChange: transactions.handleCustomerChange,
    handleTransactionSearch: transactions.handleSearch,
    handleTransactionSearchInput: transactions.handleSearchInput,
    handleTransactionSearchKeydown: transactions.handleSearchKeydown,
    handleTransactionSort: transactions.handleSort,
    handleTransactionSortDropdownToggle: transactions.handleSortDropdownToggle,
    handleTransactionExport: () => {},
    handleFinanceCloseYearChange: financeClose.handleYearChange,
    handleFinanceCloseTypeChange: financeClose.handleTypeChange,
    handleFinanceCloseCustomerChange: financeClose.handleCustomerChange,
    handleFinanceCloseSearch: financeClose.handleSearch,
    handleFinanceCloseSearchInput: financeClose.handleSearchInput,
    handleFinanceCloseSearchKeydown: financeClose.handleSearchKeydown,
    handleFinanceCloseSort: financeClose.handleSort,
    handleArApToggleChange: arAp.handleToggleChange,
    handleArApSearch: arAp.handleSearch,
    handleArApSearchInput: arAp.handleSearchInput,
    handleArApSearchKeydown: arAp.handleSearchKeydown,
    handleArApSort: arAp.handleSort,
    handleArApSortDropdownToggle: arAp.handleSortDropdownToggle,
    handleArApStatusFilterChange: arAp.handleStatusFilterChange,
  };
}
