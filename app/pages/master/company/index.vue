<script setup lang="ts">
import {
  Plus,
  Search,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-vue-next";
import CompanyList from "./components/CompanyList.vue";
import CompanyGrid from "./components/CompanyGrid.vue";
import CompanyCreateModal from "./components/CompanyCreateModal.vue";
import CompanyDetailModal from "./components/CompanyDetailModal.vue";
import type { MappedCompany } from "~/composables/useCompanies";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const { companies: companiesList, isLoading, fetchCompanies } = useCompanies();

// Modal state
const isDetailOpen = ref(false);
const selectedCompanyDetail = ref<MappedCompany | null>(null);

const openDetailModal = (company: MappedCompany) => {
  selectedCompanyDetail.value = company;
  isDetailOpen.value = true;
};

// Fetch companies on mount
onMounted(async () => {
  await fetchCompanies();
});

// Search and filter state
const searchQuery = ref("");
const selectedType = ref<string>("all");
const selectedStatus = ref<string>("all");

// Transform API companies to view format with filtering
const companies = computed(() => {
  let filtered = companiesList.value.map((c: Company) => ({
    ...c,
    code: c.code || `CUST-${c.id.slice(0, 6).toUpperCase()}`,
    email: c.email || "-",
    phone: c.phone || "-",
    address: c.addresses?.[0]?.fullAddress || "-",
    type: c.isVendor && c.isCustomer ? "Both" : c.isVendor ? "Vendor" : "Company",
    status: c.isActive ? "Active" : "Inactive",
    totalJobs: 0, // TODO: fetch from API
    selected: false,
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query),
    );
  }

  // Apply type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter((c) => c.type.toLowerCase() === selectedType.value.toLowerCase());
  }

  // Apply status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (c) => c.status.toLowerCase() === selectedStatus.value.toLowerCase(),
    );
  }

  return filtered;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedCompanies = computed(() => {
  const sorted = [...companies.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
  return sorted;
});

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const isCreateOpen = ref(false);

const selectAll = computed({
  get: () => companies.value.length > 0 && companies.value.every((c) => c.selected),
  set: (val) => companies.value.forEach((c) => (c.selected = val)),
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Company</h1>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Company..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <select
            v-model="selectedType"
            class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="company">Company</option>
            <option value="vendor">Vendor</option>
            <option value="both">Both</option>
          </select>
          <ChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>
        <button
          @click="isCreateOpen = true"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Company</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- List View -->
    <CompanyList
      v-else-if="viewMode === 'list'"
      :companies="sortedCompanies"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      :select-all="selectAll"
      @update:sort="toggleSort"
      @open-detail="openDetailModal"
      @update:select-all="selectAll = $event"
    />

    <!-- Grid View -->
    <CompanyGrid v-else :companies="sortedCompanies" @open-detail="openDetailModal" />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ sortedCompanies.length }} data found.</p>
      <div class="flex items-center gap-2">
        <button class="p-1 hover:text-foreground disabled:opacity-50">
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"
        >
          1
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          2
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          3
        </button>
        <span class="px-1">...</span>
        <button class="flex items-center gap-1 hover:text-foreground">
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Create Modal -->
    <CompanyCreateModal v-model="isCreateOpen" @refresh="fetchCompanies" />
    <CompanyDetailModal v-model="isDetailOpen" :company="selectedCompanyDetail" />
  </div>
</template>
