<script setup lang="ts">
import { TrendingUp, TrendingDown, ArrowUpDown, Download, Filter } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useFinanceDashboard } from "~/composables/useFinanceDashboard";

definePageMeta({
  layout: "dashboard",
  title: "Finance Dashboard",
});

// Type for period
type PeriodType = "day" | "week" | "month" | "year";

// Initialize composable
const { isLoading, stats, jobCosts, pagination, error, fetchAll, changePage, changePeriod } =
  useFinanceDashboard();

// Tab navigation
const tabs = [
  "Overview",
  "COGS",
  "Transaction",
  "Accounts Receivable",
  "Trial Balance",
  "Finance Close",
];

const activeTab = ref("Overview");

// Time period buttons
const timePeriods: { label: string; value: PeriodType }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
const selectedPeriod = ref<PeriodType>("month");

// Filter dropdowns
const timePeriodFilter = ref("Jan - Dec 2025");
const filterOptions = ["All"];

// Pagination
const currentPage = ref(1);

// Computed stat cards from API data
const statCards = computed(() => {
  if (!stats.value) {
    // Return loading skeleton data
    return [
      {
        title: "Total COGS",
        value: "Rp0",
        change: 0,
        changeLabel: "vs Last Period",
        isPrimary: true,
      },
      {
        title: "Average Cost/Job",
        value: "Rp0",
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Highest Job",
        value: "Rp0",
        change: 0,
        changeLabel: "vs Last Period",
      },
      {
        title: "Cost Growth",
        value: "0%",
        change: 0,
        changeLabel: "From income",
        suffix: "%",
      },
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
      change: 0,
      changeLabel: "From previous period",
      suffix: "%",
    },
  ];
});

// Jobs from API
const jobs = computed(() => {
  if (!jobCosts.value || jobCosts.value.length === 0) {
    return [];
  }
  return jobCosts.value.map((job) => ({
    id: job.id,
    jobNumber: job.jobNumber,
    polPod: job.polPod,
    customer: job.customer,
    revenue: job.revenue,
    cogs: job.cogs,
    profit: job.profit,
    margin: job.margin,
    status: job.status,
  }));
});

// Status config
type JobStatus = "active" | "closed" | "pending";
const statusConfig: Record<JobStatus, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-blue-50 text-blue-700 border-blue-200" },
  closed: { label: "Closed", class: "bg-green-50 text-green-700 border-green-200" },
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

// Helper function to get status config
const getStatusConfig = (status: JobStatus) => statusConfig[status];

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Handle period change
const handlePeriodChange = async (period: PeriodType) => {
  selectedPeriod.value = period;
  currentPage.value = 1;
  await changePeriod(period);
};

// Handle page change
const handlePageChange = async (newPage: number) => {
  currentPage.value = newPage;
  await changePage(newPage, selectedPeriod.value);
};

// Initial data fetch
onMounted(async () => {
  await fetchAll(selectedPeriod.value);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10 relative">
    <!-- Page header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Manage cash flow, COGS, receivables/payables, and financial reports
        </p>
      </div>

      <!-- Time period buttons -->
      <div class="flex items-center gap-1 bg-white border border-border rounded-lg p-1">
        <button
          v-for="period in timePeriods"
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

    <!-- Tab navigation -->
    <div class="border-b border-border">
      <nav class="flex gap-1 overflow-x-auto -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="
            cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab
                ? 'border-[#012D5A] text-[#012D5A]'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
            )
          "
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- Loading overlay -->
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

    <!-- Error message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(card, index) in statCards"
        :key="index"
        :class="
          cn(
            'border border-border rounded-xl p-5',
            card.isPrimary ? 'bg-[#012D5A] border-[#012D5A] text-white' : 'bg-white border-border',
          )
        "
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              :class="
                cn(
                  'text-sm font-medium',
                  card.isPrimary ? 'text-white/80' : 'text-muted-foreground',
                )
              "
            >
              {{ card.title }}
            </p>
            <p
              :class="
                cn('text-2xl font-bold mt-1', card.isPrimary ? 'text-white' : 'text-foreground')
              "
            >
              {{ card.value }}
            </p>
          </div>
          <div
            v-if="card.change > 0 && !card.suffix"
            :class="
              cn(
                'flex items-center gap-1 text-xs font-medium',
                card.isPrimary ? 'text-green-400' : 'text-green-600',
              )
            "
          >
            <TrendingUp class="w-3 h-3" />
            <span>{{ card.change }}%</span>
          </div>
        </div>
        <p :class="cn('text-xs mt-2', card.isPrimary ? 'text-white/60' : 'text-muted-foreground')">
          {{ card.changeLabel }}
        </p>
      </div>
    </div>

    <!-- Job Cost Breakdown Section -->
    <div class="border border-border rounded-xl bg-white">
      <!-- Section Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-border"
      >
        <h2 class="text-lg font-semibold">Job Cost Breakdown</h2>

        <!-- Filters and Actions -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Time Period Filter -->
          <div class="relative">
            <select
              v-model="timePeriodFilter"
              class="appearance-none px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option>Jan - Dec 2025</option>
              <option>Jan - Dec 2024</option>
            </select>
            <Filter
              class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            />
          </div>

          <!-- All Filter -->
          <select
            class="px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option v-for="opt in filterOptions" :key="opt">{{ opt }}</option>
          </select>

          <!-- Sort Button -->
          <button
            class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowUpDown class="w-4 h-4" />
            <span>Sort</span>
          </button>

          <!-- Export Button -->
          <button
            class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Download class="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">JOB</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">POL - POD</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Revenue</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">COGS</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Profit</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Margin</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="jobs.length === 0 && !isLoading">
              <td colspan="8" class="py-8 text-center text-muted-foreground">No data available</td>
            </tr>
            <tr
              v-for="job in jobs"
              :key="job.id"
              class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-3 px-4">
                <span class="text-sm font-medium text-[#012D5A]">{{ job.jobNumber }}</span>
              </td>
              <td class="py-3 px-4 text-sm">{{ job.polPod }}</td>
              <td class="py-3 px-4 text-sm">{{ job.customer }}</td>
              <td class="py-3 px-4 text-sm text-right font-medium">
                {{ formatCurrency(job.revenue) }}
              </td>
              <td class="py-3 px-4 text-sm text-right">
                {{ formatCurrency(job.cogs) }}
              </td>
              <td class="py-3 px-4 text-sm text-right">
                {{ formatCurrency(job.profit) }}
              </td>
              <td class="py-3 px-4 text-sm text-right">
                {{ formatPercent(job.margin) }}
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  :class="
                    cn(
                      'px-2 py-1 rounded border text-xs font-medium',
                      getStatusConfig(job.status).class,
                    )
                  "
                >
                  {{ getStatusConfig(job.status).label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between p-4 border-t border-border">
        <p class="text-sm text-muted-foreground">
          <template v-if="pagination.total > 0">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
            {{ pagination.total }} results
          </template>
          <template v-else> No results found </template>
        </p>
        <UiPagination
          v-model:page="currentPage"
          :total="pagination.total"
          :items-per-page="pagination.limit"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
