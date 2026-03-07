<script setup lang="ts">
import { useCompanies } from "~/composables/useCompanies";
import { useFinanceCharts } from "~/composables/useFinanceCharts";
import { useFinanceDashboard } from "~/composables/useFinanceDashboard";
import { useServices } from "~/composables/useServices";
import { cn } from "~/lib/utils";
import type {
  FinanceCloseStats,
  JobItem,
  JobStatus,
  PeriodType,
  StatCardData,
  TabName,
  TransactionItem,
} from "~/types/finance";
import { STATUS_CONFIG, TABS, TIME_PERIODS } from "~/types/finance";

const { confirm } = useConfirm();

// Import tab components
import CogsTab from "~/components/finance/dashboard/CogsTab.vue";
import FinanceCloseTab from "~/components/finance/dashboard/FinanceCloseTab.vue";
import OverviewTab from "~/components/finance/dashboard/OverviewTab.vue";
import TransactionTab from "~/components/finance/dashboard/TransactionTab.vue";

definePageMeta({
  layout: "dashboard",
  title: "Finance Dashboard",
});

// Helper function for formatting currency
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);

// Composables
const {
  isLoading,
  stats,
  overviewStats,
  chartData,
  jobCosts,
  transactions,
  transactionStats,
  financeCloseStats,
  closedPeriods,
  pagination,
  error,
  fetchAll,
  fetchOverviewStats,
  fetchChartData,
  fetchTransactions,
  fetchFinanceCloseStats,
  fetchClosedPeriods,
  closePeriod,
  reopenPeriod,
  changePage,
  changePeriod,
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

// Tab state
const activeTab = ref<TabName>("Overview");
const selectedPeriod = ref<PeriodType>("month");
const currentPage = ref(1);

// COGS Filter/Sort/Search state
// Initialize with empty year - year filter should only be set when user explicitly selects a year
const selectedYear = ref<string>("");
const searchQuery = ref<string>("");
const cogsCustomerId = ref<string>("");
const cogsServiceId = ref<string>("");
const sortBy = ref<string>("createdAt");
const sortOrder = ref<"asc" | "desc">("desc");
const showSortDropdown = ref(false);

// Transaction Filter/Sort/Search state
const transactionYear = ref<string>("");
const transactionType = ref<string>("all");
const transactionCustomerId = ref<string>("");
const transactionSearch = ref<string>("");
const transactionSortBy = ref<string>("date");
const transactionSortOrder = ref<"asc" | "desc">("desc");
const showTransactionSortDropdown = ref(false);

// Finance Close Filter/Sort/Search state
const financeCloseYear = ref<string>("");
const financeCloseType = ref<string>("all");
const financeCloseCustomerId = ref<string>("");
const financeCloseSearch = ref<string>("");
const financeCloseSortBy = ref<string>("date");
const financeCloseSortOrder = ref<"asc" | "desc">("desc");
const showFinanceCloseSortDropdown = ref(false);

// Customer and Service list for filters
const { companies, fetchCompanies } = useCompanies();
const { services, fetchServices } = useServices();
const isLoadingCustomers = ref(false);
const isLoadingServices = ref(false);

// Available years for dropdown
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }
  return years;
});

// Sort options
const sortOptions = [
  { value: "createdAt", label: "Date" },
  { value: "jobNumber", label: "Job Number" },
  { value: "revenue", label: "Revenue" },
  { value: "cogs", label: "COGS" },
  { value: "profit", label: "Profit" },
  { value: "margin", label: "Margin" },
];

// Transaction sort options
const transactionSortOptions = [
  { value: "date", label: "Date" },
  { value: "jobNumber", label: "Job Number" },
  { value: "customer", label: "Customer" },
  { value: "total", label: "Total Amount" },
];

// Transaction type options
const transactionTypeOptions = [
  { value: "all", label: "All" },
  { value: "invoice", label: "Customer Invoice" },
  { value: "payment", label: "Payment Out" },
];

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
      value: o.totalIncomeFormatted,
      change: o.incomeGrowth,
      changeLabel: "vs Last Period",
      isPrimary: true,
    },
    {
      title: "Total Outcome",
      value: o.totalOutcomeFormatted,
      change: o.outcomeGrowth,
      changeLabel: "vs Last Period",
    },
    {
      title: "Net Profit",
      value: o.netProfitFormatted,
      change: o.incomeGrowth,
      changeLabel: "vs Last Period",
    },
    { title: "Margins", value: `${o.margins}%`, changeLabel: "From income", suffix: "%" },
  ];
});

// COGS Stats (computed from API)
const cogsStats = computed<StatCardData[]>(() => {
  if (!stats.value) {
    return [
      { title: "Total COGS", value: "Rp0", changeLabel: "vs Last Period", isPrimary: true },
      { title: "Average Cost/Job", value: "Rp0", changeLabel: "vs Last Period" },
      { title: "Highest Job", value: "Rp0", changeLabel: "vs Last Period" },
      { title: "Cost Growth", value: "0%", changeLabel: "From income", suffix: "%" },
    ];
  }
  const s = stats.value;
  return [
    {
      title: "Total COGS",
      value: s.totalCogsFormatted,
      change: s.costGrowth,
      changeLabel: "vs Last Period",
      isPrimary: true,
    },
    {
      title: "Average Cost/Job",
      value: s.averageCostPerJobFormatted,
      change: s.costGrowth,
      changeLabel: "vs Last Period",
    },
    {
      title: "Highest Job",
      value: s.highestJob.cogsFormatted,
      change: s.costGrowth,
      changeLabel: s.highestJob.jobNumber,
    },
    {
      title: "Cost Growth",
      value: `${s.costGrowth}%`,
      changeLabel: "From previous period",
      suffix: "%",
    },
  ];
});

// Jobs from API
const jobs = computed<JobItem[]>(() => {
  if (!jobCosts.value?.length) return [];
  return jobCosts.value.map((job) => ({
    ...job,
    status: job.status as JobStatus,
  }));
});

// Transactions from API
const transactionItems = computed<TransactionItem[]>(() => {
  return transactions.value || [];
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
    { title: "Journal", value: formatCurrency(t.totalJournal), isPrimary: true },
    {
      title: "Total Income",
      value: formatCurrency(t.totalIncome),
      change: 0,
      changeLabel: "vs Last Period",
    },
    {
      title: "Total Outcome",
      value: formatCurrency(t.totalOutcome),
      change: 0,
      changeLabel: "vs Last Period",
    },
    { title: "Today Transaction", value: `${t.todayTransactions}`, changeLabel: "", suffix: "" },
  ];
});

// Finance Close Stats from API
const financeCloseData = computed<FinanceCloseStats>(() => {
  return (
    financeCloseStats.value || {
      period: "Loading...",
      status: "Open",
      description: "Loading...",
      revenue: "Rp0",
      cogs: "Rp0",
      nettPL: "Rp0",
      readinessScore: 0,
    }
  );
});

// Helper functions
const getStatusConfig = (status: JobStatus) => STATUS_CONFIG[status];

// Get current filters for COGS tab
const getCogsFilters = () => ({
  search: searchQuery.value || undefined,
  companyId: cogsCustomerId.value || undefined,
  serviceId: cogsServiceId.value || undefined,
  sortBy: sortBy.value as "jobNumber" | "revenue" | "cogs" | "profit" | "margin" | "createdAt",
  sortOrder: sortOrder.value,
  year: selectedYear.value ? parseInt(selectedYear.value) : undefined,
});

// Get current filters for Transaction tab
const getTransactionFilters = () => ({
  search: transactionSearch.value || undefined,
  sortBy: transactionSortBy.value as "date" | "jobNumber" | "customer" | "total",
  sortOrder: transactionSortOrder.value,
  type: transactionType.value as "invoice" | "payment" | "all",
  companyId: transactionCustomerId.value || undefined,
  year: transactionYear.value ? parseInt(transactionYear.value) : undefined,
});

// Get current filters for Finance Close tab
const getFinanceCloseFilters = () => ({
  search: financeCloseSearch.value || undefined,
  sortBy: financeCloseSortBy.value as "date" | "jobNumber" | "customer" | "total",
  sortOrder: financeCloseSortOrder.value,
  type: financeCloseType.value as "invoice" | "payment" | "all",
  companyId: financeCloseCustomerId.value || undefined,
  year: financeCloseYear.value ? parseInt(financeCloseYear.value) : undefined,
});

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

// Event handlers
const handlePeriodChange = async (period: PeriodType) => {
  selectedPeriod.value = period;
  currentPage.value = 1;

  // Preserve year filters across period changes to allow user to view past months/weeks/days
  // The backend has been updated to use the provided year as the reference for all periods.

  await fetchDataForTab(activeTab.value, period);
};

const handleTabChange = async (tab: TabName) => {
  activeTab.value = tab;
  currentPage.value = 1;

  // Load customers when switching to relevant tabs
  if (["COGS", "Transaction", "Finance Close"].includes(tab) && !companies.value.length) {
    await loadCustomers();
  }

  // Load services when switching to COGS tab
  if (tab === "COGS" && !services.value.length) {
    await loadServices();
  }

  await fetchDataForTab(tab, selectedPeriod.value);
};

// COGS Tab handlers
const handleYearChange = async (year: string) => {
  selectedYear.value = year;
  currentPage.value = 1;
  await fetchAll(selectedPeriod.value, getCogsFilters());
};

const handleCogsCustomerChange = async (customerId: string) => {
  cogsCustomerId.value = customerId;
  currentPage.value = 1;
  await fetchAll(selectedPeriod.value, getCogsFilters());
};

const handleCogsServiceChange = async (serviceId: string) => {
  cogsServiceId.value = serviceId;
  currentPage.value = 1;
  await fetchAll(selectedPeriod.value, getCogsFilters());
};

const handleSearch = async () => {
  currentPage.value = 1;
  await fetchAll(selectedPeriod.value, getCogsFilters());
};

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
};

const handleSearchKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await handleSearch();
  }
};

const handleSort = async (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortOrder.value = "desc";
  }
  showSortDropdown.value = false;
  currentPage.value = 1;
  await fetchAll(selectedPeriod.value, getCogsFilters());
};

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value;
};

// Transaction Tab handlers
const handleTransactionYearChange = async (year: string) => {
  transactionYear.value = year;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getTransactionFilters(),
  );
};

const handleTransactionTypeChange = async (type: string) => {
  transactionType.value = type;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getTransactionFilters(),
  );
};

const handleTransactionCustomerChange = async (customerId: string) => {
  transactionCustomerId.value = customerId;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getTransactionFilters(),
  );
};

const handleTransactionSearch = async () => {
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getTransactionFilters(),
  );
};

const handleTransactionSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  transactionSearch.value = target.value;
};

const handleTransactionSearchKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
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
  showTransactionSortDropdown.value = false;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getTransactionFilters(),
  );
};

const toggleTransactionSortDropdown = () => {
  showTransactionSortDropdown.value = !showTransactionSortDropdown.value;
};

// Load customers for filter
const loadCustomers = async () => {
  isLoadingCustomers.value = true;
  try {
    await fetchCompanies({ type: "CUSTOMER" });
  } finally {
    isLoadingCustomers.value = false;
  }
};

// Load services for COGS filter
const loadServices = async () => {
  isLoadingServices.value = true;
  try {
    await fetchServices();
  } finally {
    isLoadingServices.value = false;
  }
};

// Finance Close Tab handlers
const handleFinanceCloseYearChange = async (year: string) => {
  financeCloseYear.value = year;
  currentPage.value = 1;
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
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getFinanceCloseFilters(),
  );
};

const handleFinanceCloseCustomerChange = async (customerId: string) => {
  financeCloseCustomerId.value = customerId;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getFinanceCloseFilters(),
  );
};

const handleFinanceCloseSearch = async () => {
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getFinanceCloseFilters(),
  );
};

const handleFinanceCloseSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  financeCloseSearch.value = target.value;
};

const handleFinanceCloseSearchKeydown = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
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
  showFinanceCloseSortDropdown.value = false;
  currentPage.value = 1;
  await fetchTransactions(
    selectedPeriod.value,
    currentPage.value,
    pagination.value.limit,
    getFinanceCloseFilters(),
  );
};

const toggleFinanceCloseSortDropdown = () => {
  showFinanceCloseSortDropdown.value = !showFinanceCloseSortDropdown.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showSortDropdown.value = false;
    showTransactionSortDropdown.value = false;
    showFinanceCloseSortDropdown.value = false;
  }
};

// Handle page change (preserves all filters for all tabs)
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

const handleClosePeriod = async () => {
  const confirmed = await confirm({
    title: "Close Period",
    message: "Are you sure you want to close this period? This action cannot be undone.",
    type: "danger",
  });
  if (!confirmed) {
    return;
  }
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
  if (!confirmed) {
    return;
  }
  const result = await reopenPeriod(periodCloseId);
  if (result) {
    await confirm({
      title: result.success ? "Success" : "Error",
      message: result.message,
      type: result.success ? undefined : "danger",
    });
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await fetchDataForTab(activeTab.value, selectedPeriod.value);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10 relative">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Manage cash flow, COGS, receivables/payables, and financial reports
        </p>
      </div>
      <div class="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
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
    <div class="border-b border-border">
      <nav class="flex gap-1 overflow-x-auto -mb-px">
        <button
          v-for="tab in TABS"
          :key="tab"
          :class="
            cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab
                ? 'border-[#012D5A] text-[#012D5A]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
            )
          "
          @click="handleTabChange(tab)"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Loading & Error -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-4 h-4 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- ==================== OVERVIEW TAB ==================== -->
    <OverviewTab
      v-if="activeTab === 'Overview'"
      :stats-cards="overviewStatsCards"
      :financial-chart-options="financialChartOptions"
      :financial-chart-series="financialChartSeries"
      :top5-chart-options="top5ChartOptions"
      :top5-chart-series="top5ChartSeries"
      :margin-trend-chart-options="marginTrendChartOptions"
      :margin-trend-chart-series="marginTrendChartSeries"
    />

    <!-- ==================== COGS TAB ==================== -->
    <CogsTab
      v-if="activeTab === 'COGS'"
      :stats-cards="cogsStats"
      :jobs="jobs"
      :is-loading="isLoading"
      :is-loading-customers="isLoadingCustomers"
      :is-loading-services="isLoadingServices"
      :companies="companies"
      :services="services"
      :pagination="pagination"
      v-model:selected-year="selectedYear"
      v-model:search-query="searchQuery"
      v-model:customer-id="cogsCustomerId"
      v-model:service-id="cogsServiceId"
      v-model:sort-by="sortBy"
      v-model:sort-order="sortOrder"
      v-model:show-sort-dropdown="showSortDropdown"
      :available-years="availableYears"
      :sort-options="sortOptions"
      @year-change="handleYearChange"
      @customer-change="handleCogsCustomerChange"
      @service-change="handleCogsServiceChange"
      @search="handleSearch"
      @search-input="handleSearchInput"
      @search-keydown="handleSearchKeydown"
      @sort="handleSort"
      @toggle-sort-dropdown="toggleSortDropdown"
      @page-change="handlePageChange"
    />

    <!-- ==================== TRANSACTION TAB ==================== -->
    <TransactionTab
      v-if="activeTab === 'Transaction'"
      :stats-cards="transactionStatsCards"
      :transactions="transactionItems"
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
      @toggle-sort-dropdown="toggleTransactionSortDropdown"
      @page-change="handlePageChange"
    />

    <!-- ==================== FINANCE CLOSE TAB ==================== -->
    <FinanceCloseTab
      v-if="activeTab === 'Finance Close'"
      :finance-close-data="financeCloseData"
      :transactions="transactionItems"
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
      @toggle-sort-dropdown="toggleFinanceCloseSortDropdown"
      @page-change="handlePageChange"
      @close-period="handleClosePeriod"
      @reopen-period="handleReopenPeriod"
    />

    <!-- Placeholder for other tabs -->
    <div
      v-if="!['Overview', 'COGS', 'Transaction', 'Finance Close'].includes(activeTab)"
      class="bg-gray-50 rounded-xl border border-border p-8 text-center"
    >
      <p class="text-muted-foreground">{{ activeTab }} - Coming Soon</p>
    </div>
  </div>
</template>
