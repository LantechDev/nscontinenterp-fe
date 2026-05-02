<script setup lang="ts">
import type { TransactionItem, FinanceCloseStats, FinanceClosePeriod } from "~/types/finance";
import { useRouter } from "#app";

const router = useRouter();

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
  (e: "reopenPeriod", periodCloseId: string): void;
  (e: "export"): void;
}>();

// Expose transactions for template use
const transactionsList = computed(() => props.transactions || []);

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

// Handle row click to navigate to period detail page
function handleRowClick(period: FinanceClosePeriod) {
  router.push(`/finance/finance-close/${period.id}`);
}
</script>

<template>
  <div class="space-y-4 px-6">
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

    <FinanceDashboardFinanceCloseStatus :finance-close-data="financeCloseData" />
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
      @export="emit('export')"
    />
  </div>
</template>
