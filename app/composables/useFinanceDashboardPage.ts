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
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let yPos = margin;

        const darkNavy: [number, number, number] = [1, 45, 90];
        const white: [number, number, number] = [255, 255, 255];
        const black: [number, number, number] = [31, 41, 55];
        const gray: [number, number, number] = [249, 250, 251];
        const lightBlue: [number, number, number] = [214, 228, 240];

        // Column widths: No. | Date | Job | Customer | Type | Total
        const colW = [
          contentWidth * 0.05, // No.
          contentWidth * 0.12, // Date
          contentWidth * 0.15, // Job Number
          contentWidth * 0.25, // Customer
          contentWidth * 0.18, // Type
          contentWidth * 0.25, // Total
        ];
        const colHeaders = ["No.", "Tanggal", "Job Number", "Customer", "Type", "Total"];

        // Page break helper
        const checkPage = (needed: number) => {
          if (yPos + needed > pageHeight - margin - 12) {
            addFooter();
            doc.addPage();
            yPos = margin;
          }
        };

        // Footer helper
        const addFooter = () => {
          const pageCount = doc.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(...darkNavy);
            doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
            doc.setTextColor(...white);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(new Date().toLocaleDateString("id-ID"), margin, pageHeight - 4);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 4, {
              align: "right",
            });
          }
        };

        // Header bar
        doc.setFillColor(...darkNavy);
        doc.rect(0, 0, pageWidth, 16, "F");
        doc.setTextColor(...white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("PT NOVA SYNC", margin, 11);
        doc.setFontSize(11);
        doc.text("Transactions Report", pageWidth / 2, 11, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const yearLabel = transactionYear.value ? `Year: ${transactionYear.value}` : "All Years";
        doc.text(`Generated: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - margin, 11, {
          align: "right",
        });
        yPos = 20;

        // Period bar
        doc.setFillColor(...darkNavy);
        doc.rect(0, yPos - 4, pageWidth, 8, "F");
        doc.setTextColor(...white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`Period: ${yearLabel}`, margin, yPos);
        yPos += 12;

        // Column headers
        checkPage(10);
        doc.setFillColor(...darkNavy);
        doc.rect(margin, yPos, contentWidth, 8, "F");
        doc.setDrawColor(...darkNavy);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPos, contentWidth, 8);
        doc.setTextColor(...white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        let hx = margin + 2;
        colHeaders.forEach((col, i) => {
          doc.text(col, hx, yPos + 5.5);
          hx += colW[i] ?? 0;
        });
        yPos += 8;

        // Data rows
        doc.setTextColor(...black);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        const transactionsList = transactions.transactions.value || [];
        let totalAmount = 0;

        transactionsList.forEach((tx: TransactionItem, idx: number) => {
          checkPage(8);
          const bg = idx % 2 === 0 ? white : gray;
          doc.setFillColor(...bg);
          doc.rect(margin, yPos, contentWidth, 7, "F");
          doc.setDrawColor(...darkNavy);
          doc.setLineWidth(0.3);
          // Draw cell borders
          let cx = margin;
          colW.forEach((w, i) => {
            doc.rect(cx, yPos, w, 7);
            cx += w;
          });
          // Cell content
          doc.setTextColor(...black);
          doc.setFont("helvetica", "normal");
          let cellX = margin + 2;
          const rowData = [
            String(idx + 1),
            tx.date ? new Date(tx.date).toLocaleDateString("id-ID") : "-",
            (tx.jobNumber || "-").substring(0, 18),
            (tx.customer || "-").substring(0, 20),
            (tx.type || "-").substring(0, 14),
            formatRupiah(tx.total || 0),
          ];
          rowData.forEach((cell, i) => {
            doc.text(cell, cellX, yPos + 5);
            cellX += colW[i] ?? 0;
          });
          totalAmount += tx.total || 0;
          yPos += 7;
        });

        // Total row
        checkPage(10);
        doc.setFillColor(...lightBlue);
        doc.rect(margin, yPos, contentWidth, 8, "F");
        doc.setDrawColor(...darkNavy);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPos, contentWidth, 8);
        doc.setTextColor(...darkNavy);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("TOTAL", margin + 2, yPos + 5.5);
        doc.text(formatRupiah(totalAmount), pageWidth - margin - 2, yPos + 5.5, { align: "right" });
        yPos += 8;

        addFooter();
        const filename = `Transactions_Report_${new Date().toISOString().split("T")[0]}.pdf`;
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
