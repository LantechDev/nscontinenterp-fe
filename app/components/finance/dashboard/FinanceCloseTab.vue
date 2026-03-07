<script setup lang="ts">
import type { TransactionItem, FinanceCloseStats, FinanceClosePeriod } from "~/types/finance";

const props = defineProps<{
  financeCloseData: FinanceCloseStats;
  transactions: TransactionItem[];
  isLoading: boolean;
  isLoadingCustomers: boolean;
  pagination: { page: number; limit: number; total: number };
  companies: { id: string; name: string }[];
  searchQuery: string;
  selectedYear: string;
  transactionType: string;
  customerId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
  availableYears: string[];
  sortOptions: { value: string; label: string }[];
  typeOptions: { value: string; label: string }[];
  closedPeriods: FinanceClosePeriod[];
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:selectedYear", value: string): void;
  (e: "update:transactionType", value: string): void;
  (e: "update:customerId", value: string): void;
  (e: "update:sortBy", value: string): void;
  (e: "update:sortOrder", value: "asc" | "desc"): void;
  (e: "update:showSortDropdown", value: boolean): void;
  (e: "yearChange", year: string): void;
  (e: "typeChange", type: string): void;
  (e: "customerChange", customerId: string): void;
  (e: "search"): void;
  (e: "searchInput", event: Event): void;
  (e: "searchKeydown", event: KeyboardEvent): void;
  (e: "sort", field: string): void;
  (e: "toggleSortDropdown"): void;
  (e: "pageChange", page: number): void;
  (e: "closePeriod"): void;
  (e: "reopenPeriod", periodCloseId: string): void;
}>();

// Expose transactions for template use
const transactionsList = computed(() => props.transactions || []);

// Modal state for period details
const showPeriodModal = ref(false);
const selectedPeriod = ref<FinanceClosePeriod | null>(null);

// Format date for closed periods
function formatClosedDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// Parse currency string to number
function parseCurrency(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return Number(cleaned) || 0;
}

// Calculate gross profit (revenue - COGS)
function calculateGrossProfit(revenue: string, cogs: string): string {
  const rev = parseCurrency(revenue);
  const cogsValue = parseCurrency(cogs);
  const grossProfit = rev - cogsValue;
  return grossProfit.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Handle row click to show period details
function handleRowClick(period: FinanceClosePeriod) {
  selectedPeriod.value = period;
  showPeriodModal.value = true;
}

// Close modal
function closePeriodModal() {
  showPeriodModal.value = false;
  selectedPeriod.value = null;
}

// Format readiness score with percentage
function formatReadinessScore(score: number): string {
  return `${score}%`;
}
</script>

<template>
  <div>
    <!-- Closed Periods List -->
    <div v-if="closedPeriods && closedPeriods.length > 0" class="mb-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Closed Periods History</h3>
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-gray-600 font-medium">Period</th>
              <th class="px-4 py-2 text-right text-gray-600 font-medium">Revenue</th>
              <th class="px-4 py-2 text-right text-gray-600 font-medium">COGS</th>
              <th class="px-4 py-2 text-right text-gray-600 font-medium">Nett P&L</th>
              <th class="px-4 py-2 text-center text-gray-600 font-medium">Closed Date</th>
              <th class="px-4 py-2 text-center text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="period in closedPeriods"
              :key="period.id"
              class="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="handleRowClick(period)"
            >
              <td class="px-4 py-3">
                <span class="font-medium text-gray-900">{{ period.period }}</span>
                <span class="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">Closed</span>
              </td>
              <td class="px-4 py-3 text-right text-gray-900">{{ period.revenue }}</td>
              <td class="px-4 py-3 text-right text-gray-900">{{ period.cogs }}</td>
              <td
                class="px-4 py-3 text-right font-medium"
                :class="
                  Number(period.nettPL.replace(/[^0-9.-]/g, '')) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ period.nettPL }}
              </td>
              <td class="px-4 py-3 text-center text-gray-600">
                {{ formatClosedDate(period.periodEnd) }}
              </td>
              <td class="px-4 py-3 text-center" @click.stop>
                <button
                  @click="emit('reopenPeriod', period.id)"
                  class="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium transition-colors"
                >
                  Reopen
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Period Details Modal -->
    <UiModal
      v-model="showPeriodModal"
      title="Period Details"
      width="max-w-lg"
      @close="closePeriodModal"
    >
      <div v-if="selectedPeriod" class="space-y-4">
        <!-- Period Header -->
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h4 class="text-lg font-semibold text-gray-900">{{ selectedPeriod.period }}</h4>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1"
            >
              {{ selectedPeriod.status }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">Readiness Score</p>
            <p
              class="text-2xl font-bold"
              :class="
                selectedPeriod.readinessScore >= 80
                  ? 'text-green-600'
                  : selectedPeriod.readinessScore >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600'
              "
            >
              {{ formatReadinessScore(selectedPeriod.readinessScore) }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="selectedPeriod.description" class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm text-gray-600">{{ selectedPeriod.description }}</p>
        </div>

        <!-- Financial Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Revenue</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedPeriod.revenue }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 uppercase tracking-wide">COGS</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">{{ selectedPeriod.cogs }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Gross Profit</p>
            <p class="text-lg font-semibold text-gray-900 mt-1">
              {{ calculateGrossProfit(selectedPeriod.revenue, selectedPeriod.cogs) }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 uppercase tracking-wide">Nett P&L</p>
            <p
              class="text-lg font-semibold mt-1"
              :class="
                Number(selectedPeriod.nettPL.replace(/[^0-9.-]/g, '')) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{ selectedPeriod.nettPL }}
            </p>
          </div>
        </div>

        <!-- Date Details -->
        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <p class="text-xs text-gray-500">Period Start</p>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ formatClosedDate(selectedPeriod.periodStart) || "-" }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Period End</p>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ formatClosedDate(selectedPeriod.periodEnd) || "-" }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-gray-500">Closed Date</p>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ formatClosedDate(selectedPeriod.closedAt) || "-" }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="closePeriodModal"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          Close
        </button>
      </template>
    </UiModal>

    <FinanceDashboardFinanceCloseStatus
      :finance-close-data="financeCloseData"
      @close-period="emit('closePeriod')"
    />
    <FinanceDashboardFinanceCloseTransactions
      :transactions="transactionsList"
      :is-loading="isLoading"
      :is-loading-customers="isLoadingCustomers"
      :pagination="pagination"
      :companies="companies"
      :search-query="searchQuery"
      :selected-year="selectedYear"
      :transaction-type="transactionType"
      :customer-id="customerId"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :show-sort-dropdown="showSortDropdown"
      :available-years="availableYears"
      :sort-options="sortOptions"
      :type-options="typeOptions"
      @update:search-query="emit('update:searchQuery', $event)"
      @update:selected-year="emit('update:selectedYear', $event)"
      @update:transaction-type="emit('update:transactionType', $event)"
      @update:customer-id="emit('update:customerId', $event)"
      @update:show-sort-dropdown="emit('update:showSortDropdown', $event)"
      @year-change="emit('yearChange', $event)"
      @type-change="emit('typeChange', $event)"
      @customer-change="emit('customerChange', $event)"
      @search-input="emit('searchInput', $event)"
      @search-keydown="emit('searchKeydown', $event)"
      @sort="emit('sort', $event)"
      @toggle-sort-dropdown="emit('toggleSortDropdown')"
      @page-change="emit('pageChange', $event)"
    />
  </div>
</template>
