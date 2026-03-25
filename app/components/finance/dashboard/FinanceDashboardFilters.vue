<script setup lang="ts">
import { ref, watch } from "vue";
import { Search, ChevronDown, X, Calendar, Filter } from "lucide-vue-next";
import { useCompanies } from "~/composables/useCompanies";
import { useServices } from "~/composables/useServices";
import {
  useFinanceDashboardFilters,
  useAvailableYears,
  useCogsSortOptions,
  useTransactionSortOptions,
  useTransactionTypeOptions,
} from "~/composables/useFinanceDashboardFilters";

const emit = defineEmits<{
  (e: "filter-change"): void;
}>();

// Filter state
const {
  selectedPeriod,
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
  getCogsFilters,
  getTransactionFilters,
  getFinanceCloseFilters,
  resetPage,
  closeAllDropdowns,
} = useFinanceDashboardFilters();

// Customer and Service list for filters
const { companies, fetchCompanies } = useCompanies();
const { services, fetchServices } = useServices();
const isLoadingCustomers = ref(false);
const isLoadingServices = ref(false);

// Filter options
const availableYears = useAvailableYears();
const sortOptions = useCogsSortOptions();
const transactionSortOptions = useTransactionSortOptions();
const transactionTypeOptions = useTransactionTypeOptions();

// Initialize data
const initializeFilters = async () => {
  isLoadingCustomers.value = true;
  isLoadingServices.value = true;
  try {
    await Promise.all([fetchCompanies(), fetchServices()]);
  } finally {
    isLoadingCustomers.value = false;
    isLoadingServices.value = false;
  }
};

// Watch for filter changes
watch(
  [selectedPeriod, selectedYear, searchQuery, cogsCustomerId, cogsServiceId, sortBy, sortOrder],
  () => emit("filter-change"),
);

watch(
  [
    transactionYear,
    transactionType,
    transactionCustomerId,
    transactionSearch,
    transactionSortBy,
    transactionSortOrder,
  ],
  () => emit("filter-change"),
);

watch(
  [
    financeCloseYear,
    financeCloseType,
    financeCloseCustomerId,
    financeCloseSearch,
    financeCloseSortBy,
    financeCloseSortOrder,
  ],
  () => emit("filter-change"),
);

// Expose for parent
defineExpose({
  initializeFilters,
  getCogsFilters,
  getTransactionFilters,
  getFinanceCloseFilters,
  selectedPeriod,
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
  closeAllDropdowns,
  companies,
  services,
  isLoadingCustomers,
  isLoadingServices,
  availableYears,
  sortOptions,
  transactionSortOptions,
  transactionTypeOptions,
  resetPage,
});
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
    <!-- Search -->
    <div class="relative flex-1 max-w-md">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
        @keydown.enter="resetPage"
      />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Period Selector -->
      <div class="relative">
        <select
          v-model="selectedPeriod"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background cursor-pointer"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
      </div>

      <!-- Year Selector -->
      <div class="relative">
        <select
          v-model="selectedYear"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background cursor-pointer"
        >
          <option value="">All Years</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
      </div>

      <!-- Customer Filter -->
      <div class="relative">
        <select
          v-model="cogsCustomerId"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background cursor-pointer min-w-[140px]"
          :disabled="isLoadingCustomers"
        >
          <option value="">All Customers</option>
          <option v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
      </div>

      <!-- Service Filter -->
      <div class="relative">
        <select
          v-model="cogsServiceId"
          class="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background cursor-pointer min-w-[140px]"
          :disabled="isLoadingServices"
        >
          <option value="">All Services</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
        <ChevronDown
          class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
      </div>

      <!-- Sort Dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 bg-background"
          @click.stop="showSortDropdown = !showSortDropdown"
        >
          <span>Sort: {{ sortOptions.find((o) => o.value === sortBy)?.label || "Default" }}</span>
          <ChevronDown class="w-4 h-4" />
        </button>
        <div
          v-if="showSortDropdown"
          class="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-10"
        >
          <button
            v-for="option in sortOptions"
            :key="option.value"
            class="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
            @click="
              sortBy = option.value;
              showSortDropdown = false;
            "
          >
            {{ option.label }}
            <span v-if="sortBy === option.value">{{ sortOrder === "asc" ? "↑" : "↓" }}</span>
          </button>
        </div>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="searchQuery || cogsCustomerId || cogsServiceId || sortBy"
        class="p-2 text-sm text-muted-foreground hover:text-foreground"
        @click="
          searchQuery = '';
          cogsCustomerId = '';
          cogsServiceId = '';
          sortBy = '';
          resetPage();
        "
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
