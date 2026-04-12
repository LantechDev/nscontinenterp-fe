<script setup lang="ts">
import { ArrowUpDown, Download, Filter, Search, ChevronDown, Plus } from "lucide-vue-next";
import { cn, formatRupiah } from "~/lib/utils";
import type { StatCardData } from "~/types/finance";

export interface AssetItem {
  id: string;
  name: string;
  date: string;
  description: string;
  price: number;
  service?: string;
  company?: string;
}

const props = defineProps<{
  statsCards: StatCardData[];
  assets: AssetItem[];
  isLoading: boolean;
  isLoadingServices: boolean;
  isLoadingCompanies: boolean;
  pagination: { page: number; limit: number; total: number };
  services: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  searchQuery: string;
  selectedYear: string;
  serviceId: string;
  companyId: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  showSortDropdown: boolean;
  availableYears: string[];
  sortOptions: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:selectedYear", value: string): void;
  (e: "update:serviceId", value: string): void;
  (e: "update:companyId", value: string): void;
  (e: "update:sortBy", value: string): void;
  (e: "update:sortOrder", value: "asc" | "desc"): void;
  (e: "update:showSortDropdown", value: boolean): void;
  (e: "yearChange", year: string): void;
  (e: "serviceChange", serviceId: string): void;
  (e: "companyChange", companyId: string): void;
  (e: "search"): void;
  (e: "searchInput", event: Event): void;
  (e: "searchKeydown", event: KeyboardEvent): void;
  (e: "sort", field: string): void;
  (e: "toggleSortDropdown"): void;
  (e: "pageChange", page: number): void;
  (e: "export"): void;
  (e: "addAsset"): void;
}>();

const formatCurrency = formatRupiah;

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Local refs for v-model binding
const localSearchQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const localSelectedYear = computed({
  get: () => props.selectedYear,
  set: (val) => emit("update:selectedYear", val),
});

const localServiceId = computed({
  get: () => props.serviceId,
  set: (val) => emit("update:serviceId", val),
});

const localCompanyId = computed({
  get: () => props.companyId,
  set: (val) => emit("update:companyId", val),
});

const localShowSortDropdown = computed({
  get: () => props.showSortDropdown,
  set: (val) => emit("update:showSortDropdown", val),
});
</script>

<template>
  <div class="space-y-4 px-6">
    <!-- Stat Cards - First two cards are full width (Total Assets and Asset Count) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
        :class="index < 2 ? 'md:col-span-2' : ''"
      />
    </div>

    <!-- Assets Table -->
    <div class="border border-border rounded-xl bg-white mt-4">
      <!-- First Row: Title + Search/Sort/Export -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
        <h2 class="text-lg font-semibold">Assets</h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <input
              v-model="localSearchQuery"
              @input="emit('searchInput', $event)"
              @keydown="emit('searchKeydown', $event)"
              type="text"
              placeholder="Search assets..."
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

          <!-- Add Asset Button -->
          <button
            class="flex items-center gap-2 px-3 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg"
            @click="emit('addAsset')"
          >
            <Plus class="w-4 h-4" /><span>Add Asset</span>
          </button>
        </div>
      </div>

      <!-- Second Row: Year/Service/Company Filters (full width) -->
      <div class="flex items-center gap-2 p-5 border-b border-border bg-gray-50/30">
        <!-- Year Filter -->
        <div class="relative flex-1">
          <select
            v-model="localSelectedYear"
            @change="emit('yearChange', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 pr-8 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
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

        <!-- Service Filter -->
        <select
          v-model="localServiceId"
          @change="emit('serviceChange', localServiceId)"
          class="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-white"
          :disabled="isLoadingServices"
        >
          <option value="">All Services</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>

        <!-- Company Filter (full width) -->
        <select
          v-model="localCompanyId"
          @change="emit('companyChange', ($event.target as HTMLSelectElement).value)"
          class="w-full flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-white"
          :disabled="isLoadingCompanies"
        >
          <option value="">All Companies</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
              <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!assets.length && !isLoading">
              <td colspan="4" class="py-8 text-center text-muted-foreground">No data available</td>
            </tr>
            <tr
              v-for="asset in assets"
              :key="asset.id"
              class="border-b border-gray-100 hover:bg-gray-50/50"
            >
              <td class="py-3 px-4">
                <span class="text-sm font-medium text-[#012D5A]">{{ asset.name }}</span>
              </td>
              <td class="py-3 px-4 text-sm">{{ formatDate(asset.date) }}</td>
              <td class="py-3 px-4 text-sm">{{ asset.description }}</td>
              <td class="py-3 px-4 text-sm text-right font-medium">
                {{ formatCurrency(asset.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
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
