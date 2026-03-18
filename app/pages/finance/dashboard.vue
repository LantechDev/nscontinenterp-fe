<script setup lang="ts">
import { useFinanceDashboardPage } from "~/composables/useFinanceDashboardPage";
import {
  useFinanceDashboardFilters,
  useAvailableYears,
  useCogsSortOptions,
  useTransactionSortOptions,
  useTransactionTypeOptions,
  useArApSortOptions,
  useArApStatusOptions,
  useAssetsSortOptions,
} from "~/composables/useFinanceDashboardFilters";
import { useFinanceDashboardAssets } from "~/composables/useFinanceDashboardAssets";
import { cn, formatRupiah } from "~/lib/utils";
import { TABS, TIME_PERIODS, type PeriodType } from "~/types/finance";

// Import tab components
import CogsTab from "~/components/finance/dashboard/CogsTab.vue";
import FinanceCloseTab from "~/components/finance/dashboard/FinanceCloseTab.vue";
import OverviewTab from "~/components/finance/dashboard/OverviewTab.vue";
import TransactionTab from "~/components/finance/dashboard/TransactionTab.vue";
import TrialBalanceTab from "~/components/finance/dashboard/TrialBalanceTab.vue";
import AccountsReceivableTab from "~/components/finance/dashboard/AccountsReceivableTab.vue";
import AssetsTab from "~/components/finance/dashboard/AssetsTab.vue";

definePageMeta({
  layout: "dashboard",
  title: "Finance Dashboard",
});

// Use the extracted composable
const {
  // State
  isLoading,
  error,
  selectedPeriod,
  activeTab,
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
  jobCosts,
  transactions,
  closedPeriods,
  arApItems,
  arApStats,
  pagination,
  companies,
  services,

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
  cogsStats,
  transactionStatsCards,
  financeCloseData,

  // Event handlers
  handlePeriodChange,
  handleTabChange,
  handlePageChange,
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
  handleTransactionSortDropdownToggle,
  handleTransactionExport,
  handleFinanceCloseYearChange,
  handleFinanceCloseTypeChange,
  handleFinanceCloseCustomerChange,
  handleFinanceCloseSearch,
  handleFinanceCloseSearchInput,
  handleFinanceCloseSearchKeydown,
  handleFinanceCloseSort,
  handleArApToggleChange,
  handleArApSearch,
  handleArApSearchInput,
  handleArApSearchKeydown,
  handleArApSort,
  handleArApSortDropdownToggle,
  handleArApStatusFilterChange,
} = useFinanceDashboardPage();

// Filter options
const availableYears = useAvailableYears();
const sortOptions = useCogsSortOptions();
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

// Local state for Assets tab
const assetsSearch = ref("");
const assetsYear = ref("");
const assetsServiceId = ref("");
const assetsCompanyId = ref("");
const assetsSortBy = ref("date");
const assetsSortOrder = ref<"asc" | "desc">("desc");
const assetsShowSortDropdown = ref(false);
const isLoadingAssets = ref(false);

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

// Watch for tab change to load assets
watch(
  activeTab,
  (newTab) => {
    if (newTab === "Assets") {
      loadAssets();
    }
  },
  { immediate: true },
);

// Watch for period change to reload assets
watch(selectedPeriod, () => {
  if (activeTab.value === "Assets") {
    loadAssets();
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
  // Generate PDF export with filter values
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  // Build query params from current filters
  const queryParams = new URLSearchParams({
    format: "pdf",
  });

  if (assetsYear.value) queryParams.append("year", assetsYear.value);
  if (assetsServiceId.value) queryParams.append("serviceId", assetsServiceId.value);
  if (assetsCompanyId.value) queryParams.append("companyId", assetsCompanyId.value);

  // Open export URL in new tab to trigger download
  const exportUrl = `${baseUrl}/finance/dashboard/assets/export?${queryParams.toString()}`;
  window.open(exportUrl, "_blank");
}

async function handleAssetsAdd() {
  // Navigate to asset creation page
  const router = useRouter();
  await router.push("/master/assets/create");
}
</script>

<template>
  <div class="pb-10 relative">
    <div class="bg-white border-b border-border mb-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-6 pb-6">
        <div>
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <p class="text-muted-foreground mt-1">
            Manage cash flow, COGS, receivables/payables, and financial reports
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

    <!-- Tab Content -->
    <div class="relative min-h-[400px]">
      <div
        v-if="error"
        class="mx-6 mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ error }}
      </div>

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

        <CogsTab
          v-else-if="activeTab === 'COGS'"
          :stats-cards="cogsStats"
          :jobs="jobCosts"
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
          @search="handleCogsSearch"
          @search-input="handleCogsSearchInput"
          @search-keydown="handleCogsSearchKeydown"
          @sort="handleCogsSort"
          @toggle-sort-dropdown="() => {}"
          @page-change="handlePageChange"
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
          @export="handleTransactionExport"
          @page-change="handlePageChange"
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
          @toggle-sort-dropdown="() => {}"
          @page-change="handlePageChange"
          @reopen-period="handleReopenPeriod"
        />

        <TrialBalanceTab
          v-else-if="activeTab === 'Trial Balance'"
          v-model:selected-year="selectedYear"
          :selected-period="selectedPeriod"
          :available-years="availableYears"
          @year-change="handleYearChange"
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
          @page-change="handlePageChange"
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
          @export="handleAssetsExport"
          @add-asset="handleAssetsAdd"
        />

        <!-- Placeholder for other tabs -->
        <div v-else class="bg-gray-50 rounded-xl border border-border p-8 text-center">
          <p class="text-muted-foreground">{{ activeTab }} - Coming Soon</p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
