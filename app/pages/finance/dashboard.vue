<script setup lang="ts">
import { useFinanceDashboardPage } from "~/composables/useFinanceDashboardPage";
import {
  useFinanceDashboardFilters,
  useAvailableYears,
  useCogsSortOptions,
  useTransactionSortOptions,
  useTransactionTypeOptions,
} from "~/composables/useFinanceDashboardFilters";
import { cn } from "~/lib/utils";
import { TABS, TIME_PERIODS, type PeriodType } from "~/types/finance";

// Import tab components
import CogsTab from "~/components/finance/dashboard/CogsTab.vue";
import FinanceCloseTab from "~/components/finance/dashboard/FinanceCloseTab.vue";
import OverviewTab from "~/components/finance/dashboard/OverviewTab.vue";
import TransactionTab from "~/components/finance/dashboard/TransactionTab.vue";
import TrialBalanceTab from "~/components/finance/dashboard/TrialBalanceTab.vue";

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
  isLoadingCustomers,
  isLoadingServices,

  // Data
  jobCosts,
  transactions,
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
} = useFinanceDashboardPage();

// Filter options
const availableYears = useAvailableYears();
const sortOptions = useCogsSortOptions();
const transactionSortOptions = useTransactionSortOptions();
const transactionTypeOptions = useTransactionTypeOptions();
</script>

<template>
  <div class="space-y-6 pb-10 relative">
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
                : 'uted-foreground hoverborder-transparent text-m:text-foreground hover:border-gray-300',
            )
          "
          @click="handleTabChange(tab)"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Loading Overlay - using v-show to prevent DOM mounting/unmounting flicker -->
    <div v-show="isLoading" class="absolute inset-0 bg-white z-10 flex items-center justify-center">
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
    <ClientOnly>
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
    </ClientOnly>

    <!-- ==================== COGS TAB ==================== -->
    <ClientOnly>
      <CogsTab
        v-if="activeTab === 'COGS'"
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
    </ClientOnly>

    <!-- ==================== TRANSACTION TAB ==================== -->
    <ClientOnly>
      <TransactionTab
        v-if="activeTab === 'Transaction'"
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
        @toggle-sort-dropdown="() => {}"
        @page-change="handlePageChange"
      />
    </ClientOnly>

    <!-- ==================== FINANCE CLOSE TAB ==================== -->
    <ClientOnly>
      <FinanceCloseTab
        v-if="activeTab === 'Finance Close'"
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
    </ClientOnly>

    <!-- ==================== TRIAL BALANCE TAB ==================== -->
    <ClientOnly>
      <TrialBalanceTab
        v-if="activeTab === 'Trial Balance'"
        v-model:selected-year="selectedYear"
        :selected-period="selectedPeriod"
        :available-years="availableYears"
        @year-change="handleYearChange"
      />
    </ClientOnly>

    <!-- Placeholder for other tabs -->
    <div
      v-if="
        !['Overview', 'COGS', 'Transaction', 'Finance Close', 'Trial Balance'].includes(activeTab)
      "
      class="bg-gray-50 rounded-xl border border-border p-8 text-center"
    >
      <p class="text-muted-foreground">{{ activeTab }} - Coming Soon</p>
    </div>
  </div>
</template>
