<script setup lang="ts">
import { ArrowUpDown, Search, ChevronDown } from "lucide-vue-next";
import { cn, formatRupiah } from "~/lib/utils";
import type { StatCardData } from "~/types/finance";

export interface ArApItem {
  id: string;
  invoiceNumber: string;
  company: string;
  total: number;
  paid: number;
  remaining: number;
  dueDate: string;
  aging: number | null;
  status: "paid" | "partial" | "payment_out";
}

export interface ArApStats {
  totalAr: number;
  overdueAr: number;
  totalAp: number;
  overdueAp: number;
}

const props = defineProps<{
  stats: ArApStats;
  items: ArApItem[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  searchQuery: string;
  arApToggle: "ar" | "ap";
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
  statusFilter: string;
  sortOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:arApToggle", value: "ar" | "ap"): void;
  (e: "update:sortBy", value: string): void;
  (e: "update:sortOrder", value: "asc" | "desc"): void;
  (e: "update:showSortDropdown", value: boolean): void;
  (e: "update:statusFilter", value: string): void;
  (e: "search"): void;
  (e: "searchInput", event: Event): void;
  (e: "searchKeydown", event: KeyboardEvent): void;
  (e: "sort", field: string): void;
  (e: "toggleSortDropdown"): void;
  (e: "pageChange", page: number): void;
}>();

const formatCurrency = formatRupiah;

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Computed stats cards based on AR/AP toggle
const statsCards = computed<StatCardData[]>(() => {
  if (props.arApToggle === "ar") {
    return [
      {
        title: "Total Piutang (AR)",
        value: formatCurrency(props.stats.totalAr),
        isPrimary: true,
      },
      {
        title: "Piutang Overdue",
        value: formatCurrency(props.stats.overdueAr),
        isPrimary: false,
      },
    ];
  } else {
    return [
      {
        title: "Total Hutang (AP)",
        value: formatCurrency(props.stats.totalAp),
        isPrimary: true,
      },
      {
        title: "Hutang Overdue",
        value: formatCurrency(props.stats.overdueAp),
        isPrimary: false,
      },
    ];
  }
});

// Local refs for v-model binding
const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const localArApToggle = computed({
  get: () => props.arApToggle,
  set: (val) => emit("update:arApToggle", val),
});

const localSortDropdown = computed({
  get: () => props.showSortDropdown,
  set: (val) => emit("update:showSortDropdown", val),
});

const localStatusFilter = computed({
  get: () => props.statusFilter,
  set: (val) => emit("update:statusFilter", val),
});

const getStatusBadgeClass = (status: ArApItem["status"]): string => {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";
    case "partial":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "payment_out":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusLabel = (status: ArApItem["status"]): string => {
  switch (status) {
    case "paid":
      return "Paid";
    case "partial":
      return "Partial";
    case "payment_out":
      return "Payment Out";
    default:
      return status;
  }
};

const getAgingBadgeClass = (aging: number | null): string => {
  if (aging === null) {
    return "bg-green-50 text-green-700";
  }
  return "bg-yellow-50 text-yellow-700";
};

const getAgingLabel = (aging: number | null): string => {
  if (aging === null) {
    return "-";
  }
  return `+${aging}d`;
};
</script>

<template>
  <div class="space-y-4 px-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- AR/AP Toggle -->
    <div class="flex items-center gap-2 mt-4 mb-4">
      <span class="text-sm text-muted-foreground">View:</span>
      <div class="flex items-center bg-white border border-border rounded-lg p-1">
        <button
          :class="
            cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
              arApToggle === 'ar'
                ? 'bg-[#012D5A] text-white'
                : 'text-muted-foreground hover:text-foreground',
            )
          "
          @click="emit('update:arApToggle', 'ar')"
        >
          AR
        </button>
        <button
          :class="
            cn(
              'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
              arApToggle === 'ap'
                ? 'bg-[#012D5A] text-white'
                : 'text-muted-foreground hover:text-foreground',
            )
          "
          @click="emit('update:arApToggle', 'ap')"
        >
          AP
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="border border-border rounded-xl bg-white">
      <!-- First Row: Title + Search/Sort -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
        <h2 class="text-lg font-semibold">
          {{ arApToggle === "ar" ? "Account Receivable" : "Account Payable" }}
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <input
              v-model="localSearchQuery"
              @input="emit('searchInput', $event)"
              @keydown="emit('searchKeydown', $event)"
              type="text"
              placeholder="Search by company..."
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
              v-if="localSortDropdown"
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
        </div>
      </div>

      <!-- Second Row: Status Filter -->
      <div class="flex flex-wrap items-center gap-2 p-5 border-b border-border bg-gray-50/30">
        <!-- Status Filter -->
        <select
          v-model="localStatusFilter"
          class="px-3 py-2 text-sm border border-border rounded-lg bg-white"
        >
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Invoice No.</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Company</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Total</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Pay</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Remain</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Due Date</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Aging</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!items.length && !isLoading">
              <td colspan="8" class="py-8 text-center text-muted-foreground">No data available</td>
            </tr>
            <tr
              v-for="item in items"
              :key="item.id"
              class="border-b border-gray-100 hover:bg-gray-50/50"
            >
              <td class="py-3 px-4">
                <span class="text-sm font-medium text-[#012D5A]">{{ item.invoiceNumber }}</span>
              </td>
              <td class="py-3 px-4 text-sm">{{ item.company }}</td>
              <td class="py-3 px-4 text-sm text-right font-medium">
                {{ formatCurrency(item.total) }}
              </td>
              <td class="py-3 px-4 text-sm text-right text-green-600">
                {{ formatCurrency(item.paid) }}
              </td>
              <td
                class="py-3 px-4 text-sm text-right font-medium"
                :class="item.remaining > 0 ? 'text-red-600' : ''"
              >
                {{ formatCurrency(item.remaining) }}
              </td>
              <td class="py-3 px-4 text-sm">{{ formatDate(item.dueDate) }}</td>
              <td class="py-3 px-4 text-center">
                <span
                  :class="
                    cn('px-2 py-1 rounded text-xs font-medium', getAgingBadgeClass(item.aging))
                  "
                >
                  {{ getAgingLabel(item.aging) }}
                </span>
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  :class="
                    cn(
                      'px-2 py-1 rounded text-xs font-medium border',
                      getStatusBadgeClass(item.status),
                    )
                  "
                >
                  {{ getStatusLabel(item.status) }}
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
