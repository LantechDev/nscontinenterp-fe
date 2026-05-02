<script setup lang="ts">
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  EXCEL_COLORS,
  EXCEL_FONTS,
  makeCellStyle,
  applyStyleToRange,
  mergeCells,
  setColWidth,
  setRowHeight,
} from "~/lib/excel-styles";
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
import { useFinanceTax } from "~/composables/useFinanceTax";
import { cn, formatRupiah } from "~/lib/utils";
import { TABS, TIME_PERIODS, type PeriodType } from "~/types/finance";

// Import tab components
import FinanceCloseTab from "~/components/finance/dashboard/FinanceCloseTab.vue";
import OverviewTab from "~/components/finance/dashboard/OverviewTab.vue";
import TransactionTab from "~/components/finance/dashboard/TransactionTab.vue";
import TrialBalanceTab from "~/components/finance/dashboard/TrialBalanceTab.vue";
import AccountsReceivableTab from "~/components/finance/dashboard/AccountsReceivableTab.vue";
import AssetsTab from "~/components/finance/dashboard/AssetsTab.vue";
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
const showExportOptions = ref(false);
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

// Watch for filter changes and reload assets
watch(
  [assetsSearch, assetsYear, assetsServiceId, assetsCompanyId, assetsSortBy, assetsSortOrder],
  () => {
    if (activeTab.value === "Assets") {
      loadAssets();
    }
  },
  { deep: true },
);

// Watch for tab change to load data for the selected tab
// Consolidated data fetching
async function fetchData() {
  if (activeTab.value === "Overview") {
    const year = selectedYear.value ? parseInt(selectedYear.value) : undefined;
    await fetchOverview(selectedPeriod.value, year);
  } else if (activeTab.value === "Assets") {
    await loadAssets();
  }
}

// Watch for tab change
watch(activeTab, async (newTab, oldTab) => {
  if (newTab !== oldTab) {
    await fetchData();
  }
});

// Watch for period change
watch(selectedPeriod, async (newPeriod, oldPeriod) => {
  if (newPeriod !== oldPeriod) {
    await fetchData();
  }
});

// Watch for year change (Overview only)
watch(selectedYear, async (newYear, oldYear) => {
  if (activeTab.value === "Overview" && newYear !== oldYear) {
    await fetchData();
  }
});

// Hydration and initial load logic
const isHydrated = ref(false);

onMounted(async () => {
  isHydrated.value = true;
  // Ensure we fetch data safely after hydration
  await nextTick();
  if (activeTab.value === "Overview" || activeTab.value === "Assets") {
    await fetchData();
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
    doc.text("ASSETS REPORT", margin, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const yearLabel = assetsYear.value ? `Year: ${assetsYear.value}` : "All Years";
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

    const filters: string[] = [];
    if (assetsYear.value) filters.push(`Year: ${assetsYear.value}`);
    if (assetsServiceId.value) filters.push(`Service ID: ${assetsServiceId.value}`);
    if (assetsCompanyId.value) filters.push(`Company ID: ${assetsCompanyId.value}`);
    if (filters.length === 0) filters.push("None (All Data)");

    doc.setTextColor(...grayColor);
    filters.forEach((filter) => {
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
    doc.text("Name", margin + 20, yPos + 7);
    doc.text("Date", margin + 80, yPos + 7);
    doc.text("Service", margin + 110, yPos + 7);
    doc.text("Price", margin + 160, yPos + 7);

    yPos += 10;

    // Table Content
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const assetsList = assetsData.value || [];
    let totalValue = 0;

    assetsList.forEach(
      (asset: { name: string; date: string; service?: string; price: number }, index: number) => {
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
        doc.text(asset.name?.substring(0, 25) || "-", margin + 20, yPos + 7);
        doc.text(
          asset.date ? new Date(asset.date).toLocaleDateString("id-ID") : "-",
          margin + 80,
          yPos + 7,
        );
        doc.text(asset.service?.substring(0, 20) || "-", margin + 110, yPos + 7);
        doc.text(formatRupiah(asset.price || 0), margin + 160, yPos + 7);

        totalValue += asset.price || 0;
        yPos += 10;
      },
    );

    // Total row
    yPos += 5;
    doc.setFillColor(...lightGrayColor);
    doc.rect(margin, yPos, contentWidth, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textColor);
    doc.text("TOTAL", margin + 2, yPos + 8);
    doc.text(formatRupiah(totalValue), margin + 160, yPos + 8);

    // Footer
    const footerY = pageHeight - 15;
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("PT. Nusantara Continent - Assets Report", pageWidth / 2, footerY + 5, {
      align: "center",
    });

    // Generate filename
    const filename = `Assets_Report${assetsYear.value ? `_${assetsYear.value}` : ""}.pdf`;

    // Download the PDF directly
    doc.save(filename);
  } catch (exportError) {
    console.error("Failed to export assets PDF:", exportError);
    toast.error("Failed to export PDF. Please try again.");
  }
}

function handleTransactionExportExcel() {
  const list = transactions.value || [];
  if (list.length === 0) {
    toast.error("No transaction data to export");
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([[], []]);

  const HEADER_ROW = 0;
  const PERIOD_ROW = 1;
  const COL_HEADER_ROW = 2;
  const DATA_START = 3;

  // Row 1: Header
  XLSX.utils.sheet_add_aoa(ws, [["PT NOVA SYNC — TRANSACTIONS REPORT"]], {
    origin: { r: HEADER_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: HEADER_ROW }, { c: 6, r: HEADER_ROW });
  setRowHeight(ws, HEADER_ROW, 22);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: HEADER_ROW }, e: { c: 6, r: HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: 14, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  // Row 2: Period info
  const periodLabel = `Year: ${transactionYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`;
  XLSX.utils.sheet_add_aoa(ws, [[periodLabel]], {
    origin: { r: PERIOD_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: PERIOD_ROW }, { c: 6, r: PERIOD_ROW });
  setRowHeight(ws, PERIOD_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: PERIOD_ROW }, e: { c: 6, r: PERIOD_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  // Row 3: Column Headers
  const colHeaders = ["No.", "Tanggal", "Job Number", "Customer", "Type", "Payment Method", "Total"];
  XLSX.utils.sheet_add_aoa(ws, [colHeaders], {
    origin: { r: COL_HEADER_ROW, c: 0 },
  });
  setRowHeight(ws, COL_HEADER_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: COL_HEADER_ROW }, e: { c: 6, r: COL_HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  // Data rows
  list.forEach((tx, idx) => {
    const row = DATA_START + idx;
    XLSX.utils.sheet_add_aoa(
      ws,
      [[idx + 1, tx.date, tx.jobNumber, tx.customer, tx.type, tx.paymentMethod || "-", tx.total]],
      { origin: { r: row, c: 0 } },
    );
    const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
    applyStyleToRange(ws, { s: { c: 0, r: row }, e: { c: 5, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
    applyStyleToRange(ws, { s: { c: 6, r: row }, e: { c: 6, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "right", numFmt: "#,##0" }));
  });

  // Grand Total
  const totalRow = DATA_START + list.length;
  const grandTotal = list.reduce((sum, tx) => sum + (tx.total || 0), 0);
  XLSX.utils.sheet_add_aoa(ws, [["", "", "", "", "", "GRAND TOTAL", grandTotal]], {
    origin: { r: totalRow, c: 0 },
  });
  setRowHeight(ws, totalRow, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: totalRow }, e: { c: 5, r: totalRow } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.dataSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
  );
  applyStyleToRange(
    ws,
    { s: { c: 6, r: totalRow }, e: { c: 6, r: totalRow } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.dataSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "right", numFmt: "#,##0" }),
  );

  setColWidth(ws, 0, 6);
  setColWidth(ws, 1, 15);
  setColWidth(ws, 2, 18);
  setColWidth(ws, 3, 25);
  setColWidth(ws, 4, 15);
  setColWidth(ws, 5, 18);
  setColWidth(ws, 6, 18);

  ws["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 6, r: totalRow } });

  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, `TRANSACTIONS_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`);
  toast.success("Transactions exported to Excel");
}

function handleAssetsExportExcel() {
  const list = assetsData.value || [];
  if (list.length === 0) {
    toast.error("No asset data to export");
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([[], []]);

  const HEADER_ROW = 0;
  const PERIOD_ROW = 1;
  const COL_HEADER_ROW = 2;
  const DATA_START = 3;

  XLSX.utils.sheet_add_aoa(ws, [["PT NOVA SYNC — ASSETS REPORT"]], {
    origin: { r: HEADER_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: HEADER_ROW }, { c: 5, r: HEADER_ROW });
  setRowHeight(ws, HEADER_ROW, 22);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: HEADER_ROW }, e: { c: 5, r: HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: 14, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  XLSX.utils.sheet_add_aoa(ws, [[`Year: ${assetsYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`]], {
    origin: { r: PERIOD_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: PERIOD_ROW }, { c: 5, r: PERIOD_ROW });
  setRowHeight(ws, PERIOD_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: PERIOD_ROW }, e: { c: 5, r: PERIOD_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  const colHeaders = ["No.", "Name", "Date", "Service", "Company", "Price"];
  XLSX.utils.sheet_add_aoa(ws, [colHeaders], {
    origin: { r: COL_HEADER_ROW, c: 0 },
  });
  setRowHeight(ws, COL_HEADER_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: COL_HEADER_ROW }, e: { c: 5, r: COL_HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  list.forEach((asset, idx) => {
    const row = DATA_START + idx;
    XLSX.utils.sheet_add_aoa(
      ws,
      [[idx + 1, asset.name, asset.date, asset.service || "-", asset.company || "-", asset.price]],
      { origin: { r: row, c: 0 } },
    );
    const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
    applyStyleToRange(ws, { s: { c: 0, r: row }, e: { c: 4, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
    applyStyleToRange(ws, { s: { c: 5, r: row }, e: { c: 5, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "right", numFmt: "#,##0" }));
  });

  const totalRow = DATA_START + list.length;
  const totalValue = list.reduce((sum, a) => sum + (a.price || 0), 0);
  XLSX.utils.sheet_add_aoa(ws, [["", "", "", "", "TOTAL", totalValue]], {
    origin: { r: totalRow, c: 0 },
  });
  setRowHeight(ws, totalRow, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: totalRow }, e: { c: 4, r: totalRow } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.dataSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
  );
  applyStyleToRange(
    ws,
    { s: { c: 5, r: totalRow }, e: { c: 5, r: totalRow } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.dataSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "right", numFmt: "#,##0" }),
  );

  setColWidth(ws, 0, 6);
  setColWidth(ws, 1, 25);
  setColWidth(ws, 2, 15);
  setColWidth(ws, 3, 20);
  setColWidth(ws, 4, 20);
  setColWidth(ws, 5, 18);

  ws["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 5, r: totalRow } });

  XLSX.utils.book_append_sheet(wb, ws, "Assets");
  XLSX.writeFile(wb, `ASSETS_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`);
  toast.success("Assets exported to Excel");
}

function handleFinanceCloseExportExcel() {
  const list = closedPeriods.value || [];
  if (list.length === 0) {
    toast.error("No finance close data to export");
    return;
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([[], []]);

  const HEADER_ROW = 0;
  const PERIOD_ROW = 1;
  const COL_HEADER_ROW = 2;
  const DATA_START = 3;

  XLSX.utils.sheet_add_aoa(ws, [["PT NOVA SYNC — FINANCE CLOSE REPORT"]], {
    origin: { r: HEADER_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: HEADER_ROW }, { c: 5, r: HEADER_ROW });
  setRowHeight(ws, HEADER_ROW, 22);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: HEADER_ROW }, e: { c: 5, r: HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: 14, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  XLSX.utils.sheet_add_aoa(ws, [[`Year: ${financeCloseYear.value || "All"} | Generated: ${new Date().toLocaleDateString("id-ID")}`]], {
    origin: { r: PERIOD_ROW, c: 0 },
  });
  mergeCells(ws, { c: 0, r: PERIOD_ROW }, { c: 5, r: PERIOD_ROW });
  setRowHeight(ws, PERIOD_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: PERIOD_ROW }, e: { c: 5, r: PERIOD_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  const colHeaders = ["Period", "Revenue", "COGS", "Nett P&L", "Closed Date", "Status"];
  XLSX.utils.sheet_add_aoa(ws, [colHeaders], {
    origin: { r: COL_HEADER_ROW, c: 0 },
  });
  setRowHeight(ws, COL_HEADER_ROW, 18);
  applyStyleToRange(
    ws,
    { s: { c: 0, r: COL_HEADER_ROW }, e: { c: 5, r: COL_HEADER_ROW } },
    makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
  );

  list.forEach((period, idx) => {
    const row = DATA_START + idx;
    XLSX.utils.sheet_add_aoa(
      ws,
      [[period.period, period.revenue, period.cogs, period.nettPL, period.periodEnd || "-", "Closed"]],
      { origin: { r: row, c: 0 } },
    );
    const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
    applyStyleToRange(ws, { s: { c: 0, r: row }, e: { c: 3, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
    applyStyleToRange(ws, { s: { c: 4, r: row }, e: { c: 5, r: row } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "center" }));
  });

  setColWidth(ws, 0, 20);
  setColWidth(ws, 1, 20);
  setColWidth(ws, 2, 20);
  setColWidth(ws, 3, 20);
  setColWidth(ws, 4, 18);
  setColWidth(ws, 5, 12);

  ws["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 5, r: DATA_START + list.length - 1 } });

  XLSX.utils.book_append_sheet(wb, ws, "Finance Close");
  XLSX.writeFile(wb, `FINANCE_CLOSE_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`);
  toast.success("Finance Close exported to Excel");
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
  }
}

function dispatchExportExcel() {
  if (activeTab.value === "Transaction") {
    handleTransactionExportExcel();
  } else if (activeTab.value === "Assets") {
    handleAssetsExportExcel();
  } else if (activeTab.value === "Finance Close") {
    handleFinanceCloseExportExcel();
  }
}

// Finance Close PDF export (minimal placeholder)
function handleFinanceCloseExport() {
  const list = closedPeriods.value || [];
  if (list.length === 0) {
    toast.error("No finance close data to export");
    return;
  }
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  doc.setFillColor(1, 45, 90);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FINANCE CLOSE REPORT", margin, 20);
  yPos = 45;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Period", margin, yPos);
  doc.text("Revenue", margin + 50, yPos);
  doc.text("COGS", margin + 100, yPos);
  doc.text("Nett P&L", margin + 140, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  list.forEach((p) => {
    doc.text(p.period || "-", margin, yPos);
    doc.text(String(p.revenue || 0), margin + 50, yPos);
    doc.text(String(p.cogs || 0), margin + 100, yPos);
    doc.text(p.nettPL || "-", margin + 140, yPos);
    yPos += 7;
  });

  doc.save(`FINANCE_CLOSE_REPORT_${new Date().toISOString().split("T")[0]}.pdf`);
  toast.success("Finance Close exported to PDF");
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
          @export="showExportOptions = true"
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
          @export="showExportOptions = true"
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
          @export="showExportOptions = true"
          @add-asset="handleAssetsAdd"
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
      :title="`Export ${activeTab} Report`"
      @export-pdf="dispatchExportPdf"
      @export-excel="dispatchExportExcel"
    />
  </div>
</template>
