<script setup lang="ts">
import {
  ArrowUpDown,
  Download,
  Filter,
  Search,
  ChevronDown,
  Lock,
  Pencil,
  Trash2,
  Plus,
} from "lucide-vue-next";
import { cn, formatRupiah } from "~/lib/utils";
import type { StatCardData, TransactionItem } from "~/types/finance";

const props = defineProps<{
  statsCards: StatCardData[];
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
  (e: "export"): void;
  (e: "create"): void;
  (e: "edit", transaction: TransactionItem): void;
  (e: "delete", transaction: TransactionItem): void;
}>();

const formatCurrency = formatRupiah;

// Helper to check if transaction is auto-created (from invoice or payment)
function isAutoCreated(transaction: TransactionItem): boolean {
  return transaction.referenceType === "INVOICE" || transaction.referenceType === "PAYMENT";
}

// Helper to check if transaction is manual
function isManualTransaction(transaction: TransactionItem): boolean {
  return transaction.referenceType === "MANUAL" || !transaction.referenceType;
}

// Local refs for v-model binding
const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const localSelectedYear = computed({
  get: () => props.selectedYear,
  set: (val) => emit("update:selectedYear", val),
});

const localTransactionType = computed({
  get: () => props.transactionType,
  set: (val) => emit("update:transactionType", val),
});

const localCustomerId = computed({
  get: () => props.customerId,
  set: (val) => emit("update:customerId", val),
});

const localShowSortDropdown = computed({
  get: () => props.showSortDropdown,
  set: (val) => emit("update:showSortDropdown", val),
});
</script>

<template>
  <div class="space-y-4 px-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- Transaction Table -->
    <div class="border border-border rounded-xl bg-white mt-4">
      <!-- First Row: Title + Search/Sort/Export -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
        <h2 class="text-lg font-semibold">Transactions</h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <input
              v-model="localSearchQuery"
              @input="emit('searchInput', $event)"
              @keydown="emit('searchKeydown', $event)"
              type="text"
              placeholder="Search job or customer..."
              class="w-48 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
          </div>

          <!-- Sort Dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg"
              @click="emit('toggleSortDropdown')"
            >
              <ArrowUpDown class="w-4 h-4" />
              <span>Sort</span>
              <ChevronDown class="w-3 h-3" />
            </button>

            <!-- Sort Dropdown Menu -->
            <div
              v-if="localShowSortDropdown"
              class="absolute right-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-10"
            >
              <button
                v-for="option in sortOptions"
                :key="option.value"
                @click="emit('sort', option.value)"
                :class="
                  cn(
                    'w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between',
                    sortBy === option.value ? 'text-[#012D5A] font-medium' : 'text-gray-700',
                  )
                "
              >
                <span>{{ option.label }}</span>
                <span v-if="sortBy === option.value" class="text-xs text-muted-foreground">
                  {{ sortOrder === "asc" ? "↑" : "↓" }}
                </span>
              </button>
            </div>
          </div>

          <button
            class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg"
            @click="emit('export')"
          >
            <Download class="w-4 h-4" /><span>Export</span>
          </button>

          <!-- Create Manual Transaction Button -->
          <button
            class="flex items-center gap-2 px-3 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg"
            @click="emit('create')"
          >
            <Plus class="w-4 h-4" /><span>Add Transaction</span>
          </button>
        </div>
      </div>
      <!-- Second Row: Year/Type/Customer Filters -->
      <div class="flex items-center gap-2 p-5 border-b border-border bg-gray-50/30">
        <!-- Year Filter -->
        <div class="relative">
          <select
            v-model="localSelectedYear"
            @change="emit('yearChange', ($event.target as HTMLSelectElement).value)"
            class="w-full flex-1 px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <Filter
            class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>

        <!-- Type Filter -->
        <select
          v-model="localTransactionType"
          @change="emit('typeChange', localTransactionType)"
          class="px-3 py-2 flex-1 text-sm border border-border rounded-lg bg-white"
        >
          <option v-for="type in typeOptions" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <!-- Customer Filter -->
        <select
          v-model="localCustomerId"
          @change="emit('customerChange', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-2 flex-1 text-sm border border-border rounded-lg bg-white"
          :disabled="isLoadingCustomers"
        >
          <option value="">All Customers</option>
          <option v-for="customer in companies" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">JOB</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Tanggal</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Payment Method</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Total</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!transactions.length && !isLoading">
              <td colspan="7" class="py-8 text-center text-muted-foreground">No data available</td>
            </tr>
            <tr
              v-for="t in transactions"
              :key="t.id"
              class="border-b border-gray-100 hover:bg-gray-50/50"
            >
              <td class="py-3 px-4">
                <span class="text-sm font-medium text-[#012D5A]">{{ t.jobNumber }}</span>
              </td>
              <td class="py-3 px-4 text-sm">{{ t.date }}</td>
              <td class="py-3 px-4 text-sm">{{ t.customer }}</td>
              <td class="py-3 px-4 text-sm">
                <span
                  :class="
                    cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      t.isIncome
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200',
                    )
                  "
                  >{{ t.type }}</span
                >
              </td>
              <td class="py-3 px-4 text-sm">
                <span
                  v-if="t.paymentMethod"
                  :class="
                    cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      t.paymentMethod === 'Cash'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200',
                    )
                  "
                >
                  {{ t.paymentMethod }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </td>
              <td class="py-3 px-4 text-sm text-right font-semibold">
                <span :class="t.isIncome ? 'text-green-700' : 'text-red-600'">{{
                  formatCurrency(t.total)
                }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <!-- Auto-created indicator (lock icon) -->
                <div v-if="isAutoCreated(t)" class="flex items-center justify-center gap-1">
                  <Lock class="w-4 h-4 text-gray-400" title="Auto-created from invoice" />
                </div>
                <!-- Manual transaction actions -->
                <div v-else class="flex items-center justify-center gap-1">
                  <button
                    class="p-1.5 text-gray-500 hover:text-[#012D5A] hover:bg-gray-100 rounded transition-colors"
                    title="Edit transaction"
                    @click="emit('edit', t)"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete transaction"
                    @click="emit('delete', t)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between p-4 border-t border-border">
        <p class="text-sm text-muted-foreground">
          <template v-if="pagination.total > 0"
            >Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }}
            of {{ pagination.total }} results</template
          >
          <template v-else>No results found</template>
        </p>
        <UiPagination
          v-model:page="pagination.page"
          :total="pagination.total"
          :items-per-page="pagination.limit"
          @update:page="emit('pageChange', $event)"
        />
      </div>
    </div>
  </div>
</template>
