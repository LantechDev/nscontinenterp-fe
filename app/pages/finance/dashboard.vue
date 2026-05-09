<script setup lang="ts">
import { buildStyledWorkbook, type StyledRow } from "~/lib/excel-styled";
import { useFinanceDashboardPage } from "~/composables/useFinanceDashboardPage";
import {
  useFinanceDashboardFilters,
  useAvailableYears,
  useTransactionSortOptions,
  useTransactionTypeOptions,
  useArApSortOptions,
  useArApStatusOptions,
  useAssetsSortOptions,
} from "~/composables/useFinanceDashboardFilters";
import { useFinanceDashboardAssets } from "~/composables/useFinanceDashboardAssets";
import { useExportPopup } from "~/composables/useExportPopup";
import { useFinanceTax } from "~/composables/useFinanceTax";
import { cn, formatRupiah } from "~/lib/utils";
import { exportStyledPdf, type PdfCol } from "~/lib/pdf-export";
import { TABS, TIME_PERIODS, type PeriodType, type TabName } from "~/types/finance";

// Import tab components
import FinanceCloseTab from "~/components/finance/dashboard/FinanceCloseTab.vue";
import OverviewTab from "~/components/finance/dashboard/OverviewTab.vue";
import TransactionTab from "~/components/finance/dashboard/TransactionTab.vue";
import TrialBalanceTab from "~/components/finance/dashboard/TrialBalanceTab.vue";
import AccountsReceivableTab from "~/components/finance/dashboard/AccountsReceivableTab.vue";
import AssetsTab from "~/components/finance/dashboard/AssetsTab.vue";
import TaxReportTab from "~/components/finance/dashboard/TaxReportTab.vue";
import { toast } from "vue-sonner";
import SearchSelect from "~/components/ui/SearchSelect.vue";

definePageMeta({
  layout: "dashboard",
  title: "Finance Dashboard",
  hideHeader: true,
});

// Use the extracted composable
const {
  // State
  isLoading,
  error,
  selectedPeriod,
  activeTab,
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
  transactions,
  financeCloseStats,
  closedPeriods,
  arApItems,
  arApStats,
  pagination,
  companies,
  services,

  // Overview fetch
  fetchOverview,

  // Chart data
  chartData,
  financialChartOptions,
  financialChartSeries,
  marginTrendChartOptions,
  marginTrendChartSeries,
  top5ChartOptions,
  top5ChartSeries,

  // Computed stats
  overviewStatsCards,
  transactionStatsCards,
  financeCloseData,

  // Event handlers
  handlePeriodChange,
  handleTabChange,
  handlePageChange,
  handleReopenPeriod,
  handleTransactionYearChange,
  handleTransactionTypeChange,
  handleTransactionCustomerChange,
  handleTransactionSearch,
  handleTransactionSearchInput,
  handleTransactionSearchKeydown,
  handleTransactionSort,
  handleTransactionSortDropdownToggle,
  handleTransactionExport,
  handleTransactionCreate,
  handleTransactionEdit,
  handleTransactionDelete,
  handleFinanceCloseYearChange,
  handleFinanceCloseTypeChange,
  handleFinanceCloseCustomerChange,
  handleFinanceCloseSearch,
  handleFinanceCloseSearchInput,
  handleFinanceCloseSearchKeydown,
  handleFinanceCloseSort,
  handleFinanceCloseSortDropdownToggle,
  handleArApToggleChange,
  handleArApSearch,
  handleArApSearchInput,
  handleArApSearchKeydown,
  handleArApSort,
  handleArApSortDropdownToggle,
  handleArApStatusFilterChange,
  handleArApRefresh,
} = useFinanceDashboardPage();

// Filter options
const availableYears = useAvailableYears();
const transactionSortOptions = useTransactionSortOptions();
const transactionTypeOptions = useTransactionTypeOptions();
const arApSortOptions = useArApSortOptions();
const arApStatusOptions = useArApStatusOptions();
const assetsSortOptions = useAssetsSortOptions();

// Assets composable
const {
  assets,
  assetStats,
  pagination: assetsPagination,
  fetchAssets,
  fetchAssetStats,
  createAsset,
} = useFinanceDashboardAssets();
const { fetchTaxes } = useFinanceTax();
const { showExportOptions, triggerX, triggerY, triggerWidth, triggerHeight, openExportPopup } =
  useExportPopup();

// Tax Report composable
import { useFinanceDashboardPageTaxReport } from "~/composables/useFinanceDashboardPageTaxReport";
const {
  isLoading: isLoadingTaxReport,
  taxReportData,
  taxStatsCards,
  fetchTaxReport,
} = useFinanceDashboardPageTaxReport();

// Local state for Assets tab
const assetsSearch = ref("");
const assetsYear = ref("");
const assetsServiceId = ref("");
const assetsCompanyId = ref("");
const assetsSortBy = ref("date");
const assetsSortOrder = ref<"asc" | "desc">("desc");
const assetsShowSortDropdown = ref(false);
const showAssetModal = ref(false);
const isSavingAsset = ref(false);
const assetTaxOptions = ref<Array<{ id: string; name: string; rate: number }>>([]);
const assetForm = ref({
  name: "",
  description: "",
  price: 0,
  date: new Date().toISOString().split("T")[0],
  serviceId: "",
  companyId: "",
  taxId: "",
});
const isLoadingAssets = ref(false);

// Computed for SearchSelect options
const serviceOptions = computed(() =>
  services.value.map((service) => ({ id: service.id, name: service.name })),
);
const companyOptions = computed(() =>
  companies.value.map((company) => ({ id: company.id, name: company.name })),
);
const formattedAssetTaxOptions = computed(() =>
  assetTaxOptions.value.map((tax) => ({ id: tax.id, name: `${tax.name} (${tax.rate}%)` })),
);

// Assets data - use the composable data
const assetsData = computed(() => assets.value);

// Computed assets stats
const assetsStatsCards = computed(() => {
  const totalValue = assetStats.value?.totalValue || 0;
  const totalCount = assetStats.value?.totalAssets || 0;
  return [
    { title: "Total Assets", value: formatRupiah(totalValue), isPrimary: true },
    { title: "Assets Count", value: totalCount.toString(), changeLabel: "", suffix: "" },
  ];
});

// Fetch assets when filters change
async function loadAssets() {
  isLoadingAssets.value = true;
  try {
    await fetchAssets(assetsPagination.value.page, assetsPagination.value.limit, {
      search: assetsSearch.value || undefined,
      sortBy: assetsSortBy.value,
      sortOrder: assetsSortOrder.value,
      year: assetsYear.value || undefined,
      serviceId: assetsServiceId.value || undefined,
      companyId: assetsCompanyId.value || undefined,
    });
    await fetchAssetStats(assetsYear.value || undefined);
  } finally {
    isLoadingAssets.value = false;
  }
}

// Watch for filter changes and reload data
async function fetchData() {
  const tab = activeTab.value;
  if (tab === "Overview") {
    await loadOverview();
  } else if (tab === "Assets") {
    await loadAssets();
  } else if (tab === "Tax Report") {
    await loadTaxReport();
  } else if (
    ["Transaction", "Finance Close", "Accounts Receivable", "Trial Balance"].includes(tab)
  ) {
    // Use the composable handler to refresh main tab data
    await handleTabChange(tab as TabName);
  }
}

// Watch for Assets specific filter changes
watch(
  [assetsSearch, assetsYear, assetsServiceId, assetsCompanyId, assetsSortBy, assetsSortOrder],
  () => {
    if (activeTab.value === "Assets") {
      loadAssets();
    }
  },
  { deep: true },
);

async function loadTaxReport() {
  const year = selectedYear.value || new Date().getFullYear().toString();
  let startDate = `${year}-01-01`;
  let endDate = `${year}-12-31`;

  if (selectedPeriod.value === "month") {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    startDate = `${year}-${month}-01`;
    // End of month is tricky, but let's just use the full year if month selection is not granular yet
    // Actually, dashboard filters might have a month selector? Let's check.
  }

  await fetchTaxReport(startDate, endDate);
}

async function loadOverview() {
  const year = selectedYear.value ? parseInt(selectedYear.value) : undefined;
  await fetchOverview(selectedPeriod.value, year);
}

// Watch for primary filters that affect all tabs
watch([selectedPeriod, selectedYear], async () => {
  await fetchData();
});

// Watch for tab change to load data for the selected tab
watch(activeTab, async (newTab) => {
  if (newTab === "Overview") {
    await loadOverview();
  } else if (newTab === "Assets") {
    await loadAssets();
  } else if (newTab === "Tax Report") {
    await loadTaxReport();
  }
  // Main tabs (Transaction, etc) are handled by handleTabChange click event
  // but we can add a guard here for programmatic changes if needed
});

// Hydration and initial load logic
const isHydrated = ref(false);

onMounted(async () => {
  isHydrated.value = true;
  // Ensure we fetch data safely after hydration
  await nextTick();
  if (activeTab.value === "Overview" || activeTab.value === "Assets") {
    await fetchData();
  } else if (activeTab.value === "Tax Report") {
    loadTaxReport();
  }
});

// Assets event handlers
function handleAssetsSearch() {
  loadAssets();
}

function handleAssetsSearchInput(event: Event) {
  // Could implement debounced search here
}

function handleAssetsSearchKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    loadAssets();
  }
}

function handleAssetsSort(field: string) {
  if (assetsSortBy.value === field) {
    assetsSortOrder.value = assetsSortOrder.value === "asc" ? "desc" : "asc";
  } else {
    assetsSortBy.value = field;
    assetsSortOrder.value = "desc";
  }
}

function handleAssetsPageChange(page: number) {
  assetsPagination.value.page = page;
  loadAssets();
}

function handleAssetsExport() {
  const list = assetsData.value || [];
  if (list.length === 0) {
    toast.error("No asset data to export");
    return;
  }
  const period = assetsYear.value ? `Year: ${assetsYear.value}` : "All Years";
  const rows: (string | number)[][] = list.map((asset, i) => [
    i + 1,
    asset.name || "-",
    asset.date ? new Date(asset.date).toLocaleDateString("id-ID") : "-",
    asset.service || "-",
    asset.company || "-",
    Number(asset.price) || 0,
  ]);
  const totalValue = list.reduce((s, a) => s + (Number(a.price) || 0), 0);
  rows.push(["", "", "", "", "TOTAL", totalValue]);
  const cols: PdfCol[] = [
    { header: "No.", width: 0.06 },
    { header: "Name", width: 0.24 },
    { header: "Date", width: 0.12 },
    { header: "Service", width: 0.18 },
    { header: "Company", width: 0.18 },
    { header: "Price", width: 0.16, align: "right", isCurrency: true },
  ];
  exportStyledPdf({
    title: "ASSETS REPORT",
    period,
    cols,
    rows,
    totals: [5],
    filename: `Assets_Report${assetsYear.value ? `_${assetsYear.value}` : ""}.pdf`,
  });
}

function handleTransactionExportExcel() {
  const list = transactions.value || [];
  if (list.length === 0) {
    toast.error("No transaction data to export");
    return;
  }
  const periodLabel = `Year: ${transactionYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`;
  const rows: StyledRow[] = [
    { cells: ["PT NOVA SYNC — TRANSACTIONS REPORT", "", "", "", "", "", ""], style: 7 },
    { cells: [periodLabel, "", "", "", "", "", ""], style: 8 },
    {
      cells: ["No.", "Tanggal", "Job Number", "Customer", "Type", "Payment Method", "Total"],
      style: 0,
    },
  ];
  list.forEach((tx, i) => {
    const isEven = i % 2 === 0;
    rows.push({
      cells: [
        i + 1,
        tx.date,
        tx.jobNumber,
        tx.customer,
        tx.type,
        tx.paymentMethod || "-",
        tx.total,
      ],
      style: isEven ? 1 : 2,
      cellStyles: [
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 5 : 6,
      ],
    });
  });
  const grandTotal = list.reduce((s, tx) => s + (tx.total || 0), 0);
  rows.push({
    cells: ["", "", "", "", "", "GRAND TOTAL", grandTotal],
    style: 3,
    cellStyles: [10, 10, 10, 10, 10, 3, 3],
  });
  const colWidths = [6, 15, 18, 25, 15, 18, 18];
  buildStyledWorkbook(
    "Transactions",
    rows,
    colWidths,
    `TRANSACTIONS_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}

function handleAssetsExportExcel() {
  const list = assetsData.value || [];
  if (list.length === 0) {
    toast.error("No asset data to export");
    return;
  }
  const periodLabel = `Year: ${assetsYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`;
  const rows: StyledRow[] = [
    { cells: ["PT NOVA SYNC — ASSETS REPORT", "", "", "", "", ""], style: 7 },
    { cells: [periodLabel, "", "", "", "", ""], style: 8 },
    { cells: ["No.", "Name", "Date", "Service", "Company", "Price"], style: 0 },
  ];
  list.forEach((asset, i) => {
    const isEven = i % 2 === 0;
    rows.push({
      cells: [
        i + 1,
        asset.name,
        asset.date,
        asset.service || "-",
        asset.company || "-",
        Number(asset.price) || 0,
      ],
      style: isEven ? 1 : 2,
      cellStyles: [
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 5 : 6,
      ],
    });
  });
  const totalValue = list.reduce((s, a) => s + (Number(a.price) || 0), 0);
  rows.push({
    cells: ["", "", "", "", "TOTAL", totalValue],
    style: 3,
    cellStyles: [10, 10, 10, 10, 9, 3],
  });
  const colWidths = [6, 25, 15, 20, 20, 18];
  buildStyledWorkbook(
    "Assets",
    rows,
    colWidths,
    `ASSETS_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}

function handleFinanceCloseExportExcel() {
  const history = closedPeriods.value || [];
  const current = financeCloseStats.value;

  if (history.length === 0 && !current) {
    toast.error("No finance close data to export");
    return;
  }

  const periodLabel = `Year: ${financeCloseYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`;
  const rows: StyledRow[] = [
    { cells: ["PT NOVA SYNC — FINANCE CLOSE REPORT", "", "", "", "", ""], style: 7 },
    { cells: [periodLabel, "", "", "", "", ""], style: 8 },
  ];

  // 1. Current Period
  if (current) {
    rows.push({ cells: ["CURRENT PERIOD", "", "", "", "", ""], style: 0 });
    rows.push({
      cells: ["Period", "Revenue", "COGS", "Nett P&L", "Readiness", "Status"],
      style: 0,
    });
    rows.push({
      cells: [
        current.period || "Open",
        current.revenue || "Rp 0",
        current.cogs || "Rp 0",
        current.nettPL || "Rp 0",
        `${current.readinessScore || 0}%`,
        "OPEN",
      ],
      style: 1,
      cellStyles: [1, 5, 5, 5, 1, 1],
    });
    rows.push({ cells: ["", "", "", "", "", ""], style: 1 }); // Spacer
  }

  // 2. History
  if (history.length > 0) {
    rows.push({ cells: ["CLOSED PERIODS HISTORY", "", "", "", "", ""], style: 0 });
    rows.push({
      cells: ["Period", "Revenue", "COGS", "Nett P&L", "Closed Date", "Status"],
      style: 0,
    });

    history.forEach((period, i) => {
      const isEven = i % 2 === 0;
      rows.push({
        cells: [
          period.period,
          period.revenue || "Rp 0",
          period.cogs || "Rp 0",
          period.nettPL || "Rp 0",
          period.periodEnd ? new Date(period.periodEnd).toLocaleDateString("id-ID") : "-",
          "Closed",
        ],
        style: isEven ? 1 : 2,
        cellStyles: [
          isEven ? 1 : 2,
          isEven ? 5 : 6,
          isEven ? 5 : 6,
          isEven ? 5 : 6,
          isEven ? 1 : 2,
          isEven ? 1 : 2,
        ],
      });
    });
  }

  const colWidths = [20, 20, 20, 20, 18, 12];
  buildStyledWorkbook(
    "Finance Close",
    rows,
    colWidths,
    `FINANCE_CLOSE_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}

async function handleAssetsAdd() {
  showAssetModal.value = true;
  if (assetTaxOptions.value.length === 0) {
    try {
      const taxes = await fetchTaxes({ isActive: true, limit: 100 });
      assetTaxOptions.value = taxes.items || [];
    } catch {
      assetTaxOptions.value = [];
    }
  }
}

function resetAssetForm() {
  assetForm.value = {
    name: "",
    description: "",
    price: 0,
    date: new Date().toISOString().split("T")[0],
    serviceId: "",
    companyId: "",
    taxId: "",
  };
}

async function handleAssetSave() {
  if (!assetForm.value.name || !assetForm.value.date || assetForm.value.price <= 0) return;
  isSavingAsset.value = true;
  try {
    const result = await createAsset({
      name: assetForm.value.name,
      description: assetForm.value.description || undefined,
      price: Number(assetForm.value.price),
      date: assetForm.value.date,
      serviceId: assetForm.value.serviceId || undefined,
      companyId: assetForm.value.companyId || undefined,
      taxId: assetForm.value.taxId || undefined,
    });
    if (result) {
      await loadAssets();
      showAssetModal.value = false;
      resetAssetForm();
    }
  } finally {
    isSavingAsset.value = false;
  }
}

function dispatchExportPdf() {
  if (activeTab.value === "Transaction") {
    handleTransactionExport();
  } else if (activeTab.value === "Assets") {
    handleAssetsExport();
  } else if (activeTab.value === "Finance Close") {
    handleFinanceCloseExport();
  } else if (activeTab.value === "Tax Report") {
    handleTaxReportExport();
  } else if (activeTab.value === "Accounts Receivable") {
    handleArApExport();
  }
}

function dispatchExportExcel() {
  if (activeTab.value === "Transaction") {
    handleTransactionExportExcel();
  } else if (activeTab.value === "Assets") {
    handleAssetsExportExcel();
  } else if (activeTab.value === "Finance Close") {
    handleFinanceCloseExportExcel();
  } else if (activeTab.value === "Tax Report") {
    handleTaxReportExportExcel();
  } else if (activeTab.value === "Accounts Receivable") {
    handleArApExportExcel();
  }
}

function handleArApExport() {
  const list = arApItems.value || [];
  if (list.length === 0) {
    toast.error("No data to export");
    return;
  }
  const typeLabel = arApToggle.value === "ar" ? "ACCOUNTS RECEIVABLE" : "ACCOUNTS PAYABLE";
  const period = `Generated: ${new Date().toLocaleDateString("id-ID")}`;

  const rows: (string | number)[][] = list.map((item) => [
    item.invoiceNumber || "-",
    item.company || "-",
    Number(item.total) || 0,
    Number(item.paid) || 0,
    Number(item.remaining) || 0,
    item.dueDate ? new Date(item.dueDate).toLocaleDateString("id-ID") : "-",
    item.status.toUpperCase(),
  ]);

  const cols: PdfCol[] = [
    { header: "Inv No.", width: 0.18 },
    { header: "Company", width: 0.22 },
    { header: "Total", width: 0.14, align: "right", isCurrency: true },
    { header: "Paid", width: 0.14, align: "right", isCurrency: true },
    { header: "Remaining", width: 0.14, align: "right", isCurrency: true },
    { header: "Due Date", width: 0.12, align: "center" },
    { header: "Status", width: 0.06, align: "center" },
  ];

  exportStyledPdf({
    title: typeLabel,
    period,
    cols,
    rows,
    totals: [2, 3, 4],
    filename: `${typeLabel.replace(" ", "_")}_Report_${new Date().toISOString().split("T")[0]}.pdf`,
  });
}

function handleArApExportExcel() {
  const list = arApItems.value || [];
  if (list.length === 0) {
    toast.error("No data to export");
    return;
  }
  const typeLabel = arApToggle.value === "ar" ? "ACCOUNTS RECEIVABLE" : "ACCOUNTS PAYABLE";
  const periodLabel = `Generated: ${new Date().toLocaleDateString("id-ID")}`;

  const rows: StyledRow[] = [
    { cells: [`PT NOVA SYNC — ${typeLabel}`, "", "", "", "", "", ""], style: 7 },
    { cells: [periodLabel, "", "", "", "", "", ""], style: 8 },
    { cells: ["Inv No.", "Company", "Total", "Paid", "Remaining", "Due Date", "Status"], style: 0 },
  ];

  list.forEach((item, i) => {
    const isEven = i % 2 === 0;
    rows.push({
      cells: [
        item.invoiceNumber,
        item.company,
        item.total,
        item.paid,
        item.remaining,
        item.dueDate,
        item.status,
      ],
      style: isEven ? 1 : 2,
      cellStyles: [
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 5 : 6,
        isEven ? 5 : 6,
        isEven ? 5 : 6,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
      ],
    });
  });

  const colWidths = [18, 25, 18, 18, 18, 15, 12];
  buildStyledWorkbook(
    "AR_AP",
    rows,
    colWidths,
    `${typeLabel.replace(" ", "_")}_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}

// Finance Close PDF export (minimal placeholder)
function handleFinanceCloseExport() {
  const history = closedPeriods.value || [];
  const current = financeCloseStats.value;

  if (history.length === 0 && !current) {
    toast.error("No finance close data to export");
    return;
  }

  const period = financeCloseYear.value ? `Year: ${financeCloseYear.value}` : "All Years";
  const rows: (string | number)[][] = [];

  // 1. Current Period Summary (if exists)
  if (current) {
    rows.push(["CURRENT PERIOD (" + (current.period || "Open") + ")", "", "", "", "", "Open"]);
    rows.push([
      "Current",
      typeof current.revenue === "number"
        ? current.revenue
        : Number(String(current.revenue || "0").replace(/[^\d-]/g, "")),
      typeof current.cogs === "number"
        ? current.cogs
        : Number(String(current.cogs || "0").replace(/[^\d-]/g, "")),
      typeof current.nettPL === "number"
        ? current.nettPL
        : Number(String(current.nettPL || "0").replace(/[^\d-]/g, "")),
      "-",
      "OPEN",
    ]);
    rows.push(["", "", "", "", "", ""]); // Spacer
  }

  // 2. History
  if (history.length > 0) {
    rows.push(["CLOSED PERIODS HISTORY", "", "", "", "", ""]);
    history.forEach((p) => {
      rows.push([
        p.period || "-",
        typeof p.revenue === "number"
          ? p.revenue
          : Number(String(p.revenue || "0").replace(/[^\d-]/g, "")),
        typeof p.cogs === "number" ? p.cogs : Number(String(p.cogs || "0").replace(/[^\d-]/g, "")),
        typeof p.nettPL === "number"
          ? p.nettPL
          : Number(String(p.nettPL || "0").replace(/[^\d-]/g, "")),
        p.periodEnd || "-",
        "CLOSED",
      ]);
    });
  }

  const cols: PdfCol[] = [
    { header: "Period", width: 0.22 },
    { header: "Revenue", width: 0.18, align: "right", isCurrency: true },
    { header: "COGS", width: 0.18, align: "right", isCurrency: true },
    { header: "Nett P&L", width: 0.18, align: "right", isCurrency: true },
    { header: "Closed Date", width: 0.14, align: "center" },
    { header: "Status", width: 0.1, align: "center" },
  ];

  exportStyledPdf({
    title: "FINANCE CLOSE REPORT",
    period,
    cols,
    rows,
    filename: `FINANCE_CLOSE_REPORT_${new Date().toISOString().split("T")[0]}.pdf`,
  });
}

function handleTaxReportExport() {
  const list = taxReportData.value || [];
  if (list.length === 0) {
    toast.error("Tidak ada data pajak untuk diekspor");
    return;
  }
  const period = selectedYear.value
    ? `Tahun: ${selectedYear.value}`
    : `Tahun: ${new Date().getFullYear()}`;

  const rows: (string | number)[][] = list.map((item) => [
    item.invoiceNumber || "-",
    item.issuedDate ? new Date(item.issuedDate).toLocaleDateString("id-ID") : "-",
    item.companyName || "-",
    `${item.taxName} (${item.rate}%)`,
    Number(item.baseAmount) || 0,
    Number(item.taxAmount) || 0,
  ]);

  const cols: PdfCol[] = [
    { header: "No. Invoice", width: 0.2 },
    { header: "Tanggal", width: 0.12 },
    { header: "Customer", width: 0.2 },
    { header: "Pajak", width: 0.18 },
    { header: "Dasar Pengenaan", width: 0.15, align: "right", isCurrency: true },
    { header: "Total Pajak", width: 0.15, align: "right", isCurrency: true },
  ];

  exportStyledPdf({
    title: "LAPORAN PAJAK (DETAIL)",
    period,
    cols,
    rows,
    totals: [4, 5],
    filename: `Laporan_Pajak_Detail_${selectedYear.value || new Date().getFullYear()}.pdf`,
    orientation: "landscape",
  });
}

function handleTaxReportExportExcel() {
  const list = taxReportData.value || [];
  if (list.length === 0) {
    toast.error("Tidak ada data pajak untuk diekspor");
    return;
  }
  const periodLabel = `Tahun: ${selectedYear.value || new Date().getFullYear()} | Dibuat: ${new Date().toLocaleDateString("id-ID")}`;

  const rows: StyledRow[] = [
    { cells: ["PT NOVA SYNC — LAPORAN PAJAK (DETAIL)", "", "", "", "", ""], style: 7 },
    { cells: [periodLabel, "", "", "", "", ""], style: 8 },
    {
      cells: ["No. Invoice", "Tanggal", "Customer", "Pajak", "Dasar Pengenaan", "Total Pajak"],
      style: 0,
    },
  ];

  list.forEach((item, i) => {
    const isEven = i % 2 === 0;
    rows.push({
      cells: [
        item.invoiceNumber || "-",
        item.issuedDate ? new Date(item.issuedDate).toLocaleDateString("id-ID") : "-",
        item.companyName || "-",
        `${item.taxName} (${item.rate}%)`,
        Number(item.baseAmount) || 0,
        Number(item.taxAmount) || 0,
      ],
      style: isEven ? 1 : 2,
      cellStyles: [
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 1 : 2,
        isEven ? 5 : 6,
        isEven ? 5 : 6,
      ],
    });
  });

  const totalBase = list.reduce((s, item) => s + (Number(item.baseAmount) || 0), 0);
  const totalTax = list.reduce((s, item) => s + (Number(item.taxAmount) || 0), 0);

  rows.push({
    cells: ["", "", "", "TOTAL", totalBase, totalTax],
    style: 3,
    cellStyles: [10, 10, 10, 9, 3, 3],
  });

  const colWidths = [20, 15, 25, 20, 20, 20];

  buildStyledWorkbook(
    "Tax Report",
    rows,
    colWidths,
    `LAPORAN_PAJAK_DETAIL_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Sticky Header -->
    <div class="shrink-0 bg-white border-b border-border">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
        <div>
          <h1 class="text-2xl font-bold">Finance</h1>
          <p class="text-muted-foreground text-base">
            Manage cash flow, receivables/payables, and financial reports
          </p>
        </div>
        <div class="flex items-center gap-1 bg-gray-100 border border-transparent rounded-lg p-1">
          <button
            v-for="period in TIME_PERIODS"
            :key="period.value"
            :class="
              cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                selectedPeriod === period.value
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )
            "
            @click="handlePeriodChange(period.value)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="">
        <nav class="flex gap-1 overflow-x-auto -mb-px">
          <button
            v-for="tab in TABS"
            :key="tab"
            :class="
              cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                activeTab === tab
                  ? 'border-[#012D5A] text-[#012D5A]'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-gray-300',
              )
            "
            @click="handleTabChange(tab)"
          >
            {{ tab }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Scrollable Tab Content -->
    <div class="flex-1 overflow-y-auto relative pt-6 pb-10">
      <!-- Change Error message to vue-sonner -->
      <!-- <div
        v-if="error"
        class="mx-6 mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ error }}
      </div> -->

      <ClientOnly>
        <!-- Loading Overlay - using v-show inside the container -->
        <div
          v-show="isLoading"
          class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>

        <!-- ==================== TAB COMPONENTS ==================== -->
        <OverviewTab
          v-if="activeTab === 'Overview'"
          :stats-cards="overviewStatsCards"
          :financial-chart-options="financialChartOptions"
          :financial-chart-series="financialChartSeries"
          :top5-chart-options="top5ChartOptions"
          :top5-chart-series="top5ChartSeries"
          :chart-data="chartData || {}"
          :margin-trend-chart-options="marginTrendChartOptions"
          :margin-trend-chart-series="marginTrendChartSeries"
        />

        <TransactionTab
          v-else-if="activeTab === 'Transaction'"
          :stats-cards="transactionStatsCards"
          :transactions="transactions"
          :is-loading="isLoading"
          :is-loading-customers="isLoadingCustomers"
          :pagination="pagination"
          :companies="companies"
          v-model:search-query="transactionSearch"
          v-model:selected-year="transactionYear"
          v-model:transaction-type="transactionType"
          v-model:customer-id="transactionCustomerId"
          v-model:sort-by="transactionSortBy"
          v-model:sort-order="transactionSortOrder"
          v-model:show-sort-dropdown="showTransactionSortDropdown"
          :available-years="availableYears"
          :sort-options="transactionSortOptions"
          :type-options="transactionTypeOptions"
          @year-change="handleTransactionYearChange"
          @type-change="handleTransactionTypeChange"
          @customer-change="handleTransactionCustomerChange"
          @search="handleTransactionSearch"
          @search-input="handleTransactionSearchInput"
          @search-keydown="handleTransactionSearchKeydown"
          @sort="handleTransactionSort"
          @toggle-sort-dropdown="handleTransactionSortDropdownToggle"
          @export="openExportPopup($event)"
          @page-change="handlePageChange"
          @create="handleTransactionCreate"
          @edit="handleTransactionEdit"
          @delete="handleTransactionDelete"
        />

        <FinanceCloseTab
          v-else-if="activeTab === 'Finance Close'"
          :finance-close-data="financeCloseData"
          :transactions="transactions"
          :is-loading="isLoading"
          :is-loading-customers="isLoadingCustomers"
          :pagination="pagination"
          :companies="companies"
          v-model:search-query="financeCloseSearch"
          v-model:selected-year="financeCloseYear"
          v-model:transaction-type="financeCloseType"
          v-model:customer-id="financeCloseCustomerId"
          v-model:sort-by="financeCloseSortBy"
          v-model:sort-order="financeCloseSortOrder"
          v-model:show-sort-dropdown="showFinanceCloseSortDropdown"
          :available-years="availableYears"
          :sort-options="transactionSortOptions"
          :type-options="transactionTypeOptions"
          :closed-periods="closedPeriods"
          @year-change="handleFinanceCloseYearChange"
          @type-change="handleFinanceCloseTypeChange"
          @customer-change="handleFinanceCloseCustomerChange"
          @search="handleFinanceCloseSearch"
          @search-input="handleFinanceCloseSearchInput"
          @search-keydown="handleFinanceCloseSearchKeydown"
          @sort="handleFinanceCloseSort"
          @toggle-sort-dropdown="handleFinanceCloseSortDropdownToggle"
          @page-change="handlePageChange"
          @reopen-period="handleReopenPeriod"
          @export="openExportPopup($event)"
        />

        <TrialBalanceTab
          v-else-if="activeTab === 'Trial Balance'"
          v-model:selected-year="selectedYear"
          :selected-period="selectedPeriod"
          :available-years="availableYears"
        />

        <AccountsReceivableTab
          v-else-if="activeTab === 'Accounts Receivable'"
          :stats="arApStats || { totalAr: 0, overdueAr: 0, totalAp: 0, overdueAp: 0 }"
          :items="arApItems"
          :is-loading="isLoading"
          :pagination="pagination"
          v-model:search-query="arApSearch"
          v-model:ar-ap-toggle="arApToggle"
          v-model:sort-by="arApSortBy"
          v-model:sort-order="arApSortOrder"
          v-model:show-sort-dropdown="showArApSortDropdown"
          v-model:status-filter="arApStatusFilter"
          :sort-options="arApSortOptions"
          :status-options="arApStatusOptions"
          @search="handleArApSearch"
          @search-input="handleArApSearchInput"
          @search-keydown="handleArApSearchKeydown"
          @sort="handleArApSort"
          @toggle-sort-dropdown="handleArApSortDropdownToggle"
          @status-filter-change="handleArApStatusFilterChange"
          @page-change="handlePageChange"
          @refresh="handleArApRefresh"
        />

        <AssetsTab
          v-else-if="activeTab === 'Assets'"
          :stats-cards="assetsStatsCards"
          :assets="assetsData"
          :is-loading="isLoadingAssets"
          :is-loading-services="isLoadingServices"
          :is-loading-companies="isLoadingCustomers"
          :pagination="assetsPagination"
          :services="services"
          :companies="companies"
          v-model:search-query="assetsSearch"
          v-model:selected-year="assetsYear"
          v-model:service-id="assetsServiceId"
          v-model:company-id="assetsCompanyId"
          v-model:sort-by="assetsSortBy"
          v-model:sort-order="assetsSortOrder"
          v-model:show-sort-dropdown="assetsShowSortDropdown"
          :available-years="availableYears"
          :sort-options="assetsSortOptions"
          @year-change="(y) => (assetsYear = y)"
          @service-change="(s) => (assetsServiceId = s)"
          @company-change="(c) => (assetsCompanyId = c)"
          @search="handleAssetsSearch"
          @search-input="handleAssetsSearchInput"
          @search-keydown="handleAssetsSearchKeydown"
          @sort="handleAssetsSort"
          @toggle-sort-dropdown="() => (assetsShowSortDropdown = !assetsShowSortDropdown)"
          @page-change="handleAssetsPageChange"
          @export="openExportPopup($event)"
          @add-asset="handleAssetsAdd"
        />

        <TaxReportTab
          v-else-if="activeTab === 'Tax Report'"
          :is-loading="isLoadingTaxReport"
          :tax-report-data="taxReportData"
          :stats-cards="taxStatsCards"
          @export="openExportPopup($event)"
        />

        <!-- Placeholder for other tabs -->
        <div v-else class="bg-gray-50 rounded-xl border border-border p-8 text-center">
          <p class="text-muted-foreground">{{ activeTab }} - Coming Soon</p>
        </div>
      </ClientOnly>
    </div>

    <UiModal
      v-model="showAssetModal"
      title="Tambah Asset"
      description="Catat asset baru"
      width="max-w-lg"
      @close="resetAssetForm"
    >
      <form class="space-y-4" @submit.prevent="handleAssetSave">
        <div>
          <label class="text-sm font-medium">Nama Asset</label>
          <input v-model="assetForm.name" type="text" class="input-field" required />
        </div>
        <div>
          <label class="text-sm font-medium">Tanggal</label>
          <input v-model="assetForm.date" type="date" class="input-field" required />
        </div>
        <div>
          <label class="text-sm font-medium">Harga</label>
          <input v-model.number="assetForm.price" type="number" min="0" class="input-field" />
        </div>
        <div>
          <label class="text-sm font-medium">Service</label>
          <SearchSelect
            v-model="assetForm.serviceId"
            :initial-options="serviceOptions"
            placeholder="Pilih service (opsional)"
          />
        </div>
        <div>
          <label class="text-sm font-medium">Company</label>
          <SearchSelect
            v-model="assetForm.companyId"
            :initial-options="companyOptions"
            placeholder="Pilih company (opsional)"
          />
        </div>
        <div>
          <label class="text-sm font-medium">Pajak</label>
          <SearchSelect
            v-model="assetForm.taxId"
            :initial-options="formattedAssetTaxOptions"
            placeholder="Pilih Pajak (opsional)"
          />
        </div>
        <div>
          <label class="text-sm font-medium">Deskripsi</label>
          <textarea v-model="assetForm.description" rows="3" class="input-field"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-sm border border-border rounded-lg"
            @click="showAssetModal = false"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm bg-[#012D5A] text-white rounded-lg"
            :disabled="isSavingAsset"
          >
            {{ isSavingAsset ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </UiModal>

    <UiExportOptionsModal
      v-model:open="showExportOptions"
      :trigger-x="triggerX"
      :trigger-y="triggerY"
      :trigger-width="triggerWidth"
      :trigger-height="triggerHeight"
      :title="`Export ${activeTab} Report`"
      @export-pdf="dispatchExportPdf"
      @export-excel="dispatchExportExcel"
    />
  </div>
</template>
