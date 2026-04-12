/**
 * Finance Dashboard Page Composable
 * Main entry point re-exporting finance dashboard page functionality from sub-composables.
 */
import { onMounted, onUnmounted, watch } from "vue";
import type { TabName, PeriodType } from "~/types/finance";
import type { TransactionItem } from "~/types/finance-dashboard";
import { jsPDF } from "jspdf";
import { formatRupiah } from "~/lib/utils";
import { toast } from "vue-sonner";

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
    await fetchDataForTab(activeTab.value, period);
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
      // Generate PDF export with filter values using jsPDF
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let yPos = margin;

        // Colors
        const primaryColor: [number, number, number] = [1, 45, 90]; // #012D5A
        const textColor: [number, number, number] = [31, 41, 55]; // #1f2937
        const grayColor: [number, number, number] = [107, 114, 128]; // #6b7280
        const lightGrayColor: [number, number, number] = [229, 231, 235]; // #e5e7eb

        // Company Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TRANSACTIONS REPORT", margin, 25);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const yearLabel = transactionYear.value ? `Year: ${transactionYear.value}` : "All Years";
        doc.text(yearLabel, pageWidth - margin, 20, { align: "right" });
        const dateLabel = new Date().toLocaleDateString("id-ID");
        doc.text(`Generated: ${dateLabel}`, pageWidth - margin, 30, { align: "right" });

        yPos = 55;

        // Filter info
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Filters:", margin, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 7;

        const filtersList: string[] = [];
        if (transactionYear.value) filtersList.push(`Year: ${transactionYear.value}`);
        if (transactionType.value) filtersList.push(`Type: ${transactionType.value}`);
        if (transactionCustomerId.value)
          filtersList.push(`Customer ID: ${transactionCustomerId.value}`);
        if (transactionSearch.value) filtersList.push(`Search: ${transactionSearch.value}`);
        if (filtersList.length === 0) filtersList.push("None (All Data)");

        doc.setTextColor(...grayColor);
        filtersList.forEach((filter) => {
          doc.text(filter, margin, yPos);
          yPos += 6;
        });

        yPos += 10;

        // Table Header
        doc.setFillColor(...primaryColor);
        doc.rect(margin, yPos, contentWidth, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("No.", margin + 2, yPos + 7);
        doc.text("Date", margin + 20, yPos + 7);
        doc.text("Job Number", margin + 45, yPos + 7);
        doc.text("Customer", margin + 85, yPos + 7);
        doc.text("Type", margin + 130, yPos + 7);
        doc.text("Amount", margin + 160, yPos + 7);

        yPos += 10;

        // Table Content
        doc.setTextColor(...textColor);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        const transactionsList = transactions.transactions.value || [];
        let totalAmount = 0;

        transactionsList.forEach((tx: TransactionItem, index: number) => {
          // Check if we need a new page
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
          }

          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(249, 250, 251);
            doc.rect(margin, yPos, contentWidth, 10, "F");
          }

          doc.setTextColor(...textColor);
          doc.text((index + 1).toString(), margin + 2, yPos + 7);
          doc.text(
            tx.date ? new Date(tx.date).toLocaleDateString("id-ID") : "-",
            margin + 20,
            yPos + 7,
          );
          doc.text(tx.jobNumber?.substring(0, 15) || "-", margin + 45, yPos + 7);
          doc.text(tx.customer?.substring(0, 18) || "-", margin + 85, yPos + 7);
          doc.text(tx.type?.substring(0, 10) || "-", margin + 130, yPos + 7);
          doc.text(formatRupiah(tx.total || 0), margin + 160, yPos + 7);

          totalAmount += tx.total || 0;
          yPos += 10;
        });

        // Total row
        yPos += 5;
        doc.setFillColor(...lightGrayColor);
        doc.rect(margin, yPos, contentWidth, 12, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...textColor);
        doc.text("TOTAL", margin + 2, yPos + 8);
        doc.text(formatRupiah(totalAmount), margin + 160, yPos + 8);

        // Footer
        const footerY = pageHeight - 15;
        doc.setFillColor(...primaryColor);
        doc.rect(0, footerY - 5, pageWidth, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("PT. Nusantara Continent - Transactions Report", pageWidth / 2, footerY + 5, {
          align: "center",
        });

        // Generate filename
        const filename = `Transactions_Report${transactionYear.value ? `_${transactionYear.value}` : ""}.pdf`;

        // Download the PDF directly
        doc.save(filename);
      } catch (exportError) {
        console.error("Failed to export transactions PDF:", exportError);
        toast.error("Failed to export PDF. Please try again.");
      }
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
