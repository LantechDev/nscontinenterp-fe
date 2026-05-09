/**
 * Finance Dashboard Page Composable
 * Main entry point re-exporting finance dashboard page functionality from sub-composables.
 */
import { onMounted, onUnmounted, watch } from "vue";
import type { TabName, PeriodType } from "~/types/finance";
import type { TransactionItem } from "~/types/finance-dashboard";
import { toast } from "vue-sonner";
import { exportStyledPdf, type PdfCol } from "~/lib/pdf-export";

export function useFinanceDashboardPage() {
  // Router
  const router = useRouter();

  // State
  const pageState = useFinanceDashboardPageState();
  const { activeTab, selectedPeriod, currentPage, resetPage } = pageState;

  // Filters
  const filters = useFinanceDashboardFilters();
  const {
    selectedYear,
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
  const transactions = useFinanceDashboardPageTransactions();
  const financeClose = useFinanceDashboardPageFinanceClose();
  const arAp = useFinanceDashboardPageArAp();

  // Shared dashboard
  const dashboard = useFinanceDashboard();
  const { isLoading, error, transactionPagination, arApPagination } = dashboard;

  // API utilities for exports
  const api = useFinanceDashboardApi();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { baseUrl: _baseUrl } = api;

  // Computed pagination bridge for component compatibility
  const pagination = computed(() => {
    switch (activeTab.value) {
      case "Transaction":
        return transactionPagination.value;
      case "Accounts Receivable":
        return arApPagination.value;
      default:
        return transactionPagination.value;
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
  }

  async function handleTabChange(tab: TabName) {
    activeTab.value = tab;
    resetPage();
    if (["Transaction", "Finance Close"].includes(tab)) await loadCustomers();
    if (tab === "Assets") {
      await Promise.all([loadCustomers(), loadServices()]);
    }
    await fetchDataForTab(tab, selectedPeriod.value);
  }

  async function handlePageChange(newPage: number) {
    currentPage.value = newPage;

    const active = activeTab.value;
    if (active === "Transaction") {
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
    await loadCustomers();
    // Fetching is now handled by dashboard.vue to avoid loops
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

    // Overview fetch function
    fetchOverview: overview.fetchOverview,

    // Computed stats
    overviewStatsCards: overview.overviewStatsCards,
    transactionStatsCards: transactions.transactionStatsCards,
    financeCloseData: financeClose.financeCloseData,

    // Handlers
    handlePeriodChange,
    handleTabChange,
    handlePageChange,
    handleClosePeriod: financeClose.handleClosePeriod,
    handleReopenPeriod: financeClose.handleReopenPeriod,
    handleTransactionYearChange: transactions.handleYearChange,
    handleTransactionTypeChange: transactions.handleTypeChange,
    handleTransactionCustomerChange: transactions.handleCustomerChange,
    handleTransactionSearch: transactions.handleSearch,
    handleTransactionSearchInput: transactions.handleSearchInput,
    handleTransactionSearchKeydown: transactions.handleSearchKeydown,
    handleTransactionSort: transactions.handleSort,
    handleTransactionSortDropdownToggle: transactions.handleSortDropdownToggle,
    handleTransactionExport: () => {
      const list = transactions.transactions.value || [];
      if (list.length === 0) {
        toast.error("No transaction data to export");
        return;
      }
      const period = transactionYear.value ? `Year: ${transactionYear.value}` : "All Years";

      const rows: (string | number)[][] = list.map((tx: TransactionItem, i: number) => [
        i + 1,
        tx.date ? new Date(tx.date).toLocaleDateString("id-ID") : "-",
        tx.jobNumber || "-",
        tx.customer || "-",
        tx.type || "-",
        tx.total || 0,
      ]);

      const cols: PdfCol[] = [
        { header: "No.", width: 0.06 },
        { header: "Tanggal", width: 0.12 },
        { header: "Job Number", width: 0.18 },
        { header: "Customer", width: 0.28 },
        { header: "Type", width: 0.16 },
        { header: "Total", width: 0.2, align: "right", isCurrency: true },
      ];

      exportStyledPdf({
        title: "TRANSACTIONS REPORT",
        period,
        cols,
        rows,
        totals: [5],
        filename: `Transactions_Report_${new Date().toISOString().split("T")[0]}.pdf`,
        orientation: "landscape",
      });
    },
    handleTransactionCreate: () => {
      router.push("/finance/transactions/create");
    },
    handleTransactionEdit: (transaction: TransactionItem) => {
      router.push(`/finance/transaction/${transaction.id}/edit`);
    },
    handleTransactionDelete: async (transaction: TransactionItem) => {
      const { confirm } = useConfirm();
      const confirmed = await confirm({
        title: "Delete Transaction",
        message: `Are you sure you want to delete this transaction?`,
        type: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (confirmed) {
        await dashboard.deleteManualTransaction(transaction.id);
      }
    },
    handleFinanceCloseYearChange: financeClose.handleYearChange,
    handleFinanceCloseTypeChange: financeClose.handleTypeChange,
    handleFinanceCloseCustomerChange: financeClose.handleCustomerChange,
    handleFinanceCloseSearch: financeClose.handleSearch,
    handleFinanceCloseSearchInput: financeClose.handleSearchInput,
    handleFinanceCloseSearchKeydown: financeClose.handleSearchKeydown,
    handleFinanceCloseSort: financeClose.handleSort,
    handleFinanceCloseSortDropdownToggle: financeClose.handleSortDropdownToggle,
    handleArApToggleChange: arAp.handleToggleChange,
    handleArApSearch: arAp.handleSearch,
    handleArApSearchInput: arAp.handleSearchInput,
    handleArApSearchKeydown: arAp.handleSearchKeydown,
    handleArApSort: arAp.handleSort,
    handleArApSortDropdownToggle: arAp.handleSortDropdownToggle,
    handleArApStatusFilterChange: arAp.handleStatusFilterChange,
    handleArApRefresh: arAp.handleRefresh,
  };
}
