<script setup lang="ts">
import { Plus, Search, LayoutList, LayoutGrid, ChevronDown, Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import CompanyList from "./components/CompanyList.vue";
import CompanyGrid from "./components/CompanyGrid.vue";
import CompanyCreateModal from "./components/CompanyCreateModal.vue";
import CompanyDetailModal from "./components/CompanyDetailModal.vue";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import type { MappedCompany } from "~/composables/useCompanies";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const {
  companies: companiesList,
  isLoading,
  fetchCompanies,
  pagination,
  deleteCompany,
} = useCompanies();
const { confirm } = useConfirm();

// Modal state
const isDetailOpen = ref(false);
const selectedCompanyDetail = ref<MappedCompany | null>(null);
const isFormOpen = ref(false);
const formMode = ref<"create" | "edit">("create");
const selectedCompanyForm = ref<MappedCompany | null>(null);
const activeActionMenu = ref<string | null>(null);
const selectedIds = ref<Set<string>>(new Set());

const openDetailModal = (company: MappedCompany) => {
  selectedCompanyDetail.value = company;
  isDetailOpen.value = true;
};

// Search and filter state
const searchQuery = ref("");
const selectedType = ref<string>("all");
const selectedStatus = ref<string>("all");
const pageSize = ref(50); // Increase to fetch more for client-side filtering
let filterDebounce: ReturnType<typeof setTimeout> | null = null;

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedCompanies = computed(() => {
  const mapped = filteredCompanies.value.map((c) => ({
    ...c,
    code: c.code || `CUST-${c.id.slice(0, 6).toUpperCase()}`,
    email: c.email || "-",
    phone: c.phone || "-",
    address: c.addresses?.[0]?.fullAddress || "-",
    type: c.isVendor && c.isCustomer ? "Both" : c.isVendor ? "Vendor" : "Customer",
    status: c.isActive ? "Active" : "Inactive",
    totalJobs: jobCounts.value[c.id] ?? c.totalJobs ?? 0,
  }));

  const sorted = [...mapped];
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

const currentPage = computed({
  get: () => pagination.value.page || 1,
  set: (value) => {
    pagination.value.page = value;
  },
});

const toQueryType = () => {
  switch (selectedType.value) {
    case "customer":
      return "CUSTOMER";
    case "vendor":
      return "VENDOR";
    case "both":
      return "BOTH";
    default:
      return "ALL";
  }
};

const typeOptions = [
  { id: "all", name: "All Types" },
  { id: "customer", name: "Customer" },
  { id: "vendor", name: "Vendor" },
  { id: "both", name: "Customer & Vendor" },
];

const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

// Apply client-side filtering since API might not filter correctly
const filteredCompanies = computed(() => {
  let result = companiesList.value;

  // Filter by type
  if (selectedType.value !== "all") {
    result = result.filter((c) => {
      if (selectedType.value === "customer") return c.isCustomer && !c.isVendor;
      if (selectedType.value === "vendor") return c.isVendor && !c.isCustomer;
      if (selectedType.value === "both") return c.isCustomer && c.isVendor;
      return true;
    });
  }

  // Filter by status
  if (selectedStatus.value !== "all") {
    const isActiveFilter = selectedStatus.value === "active";
    result = result.filter((c) => c.isActive === isActiveFilter);
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.code?.toLowerCase().includes(query),
    );
  }

  return result;
});

const toQueryStatus = () => {
  switch (selectedStatus.value) {
    case "active":
      return "ACTIVE";
    case "inactive":
      return "INACTIVE";
    default:
      return "ALL";
  }
};

// Job counts cache
const jobCounts = ref<Record<string, number>>({});

const fetchJobCounts = async () => {
  const config = useRuntimeConfig();
  try {
    const allJobs = await $fetch<
      Array<{
        id: string;
        customerId: string | null;
        vendorId: string | null;
        shipperId: string | null;
        consigneeId: string | null;
      }>
    >(`${config.public.apiBase}/operational/jobs`, { credentials: "include" });
    const counts: Record<string, number> = {};
    for (const job of allJobs || []) {
      if (job.customerId) {
        counts[job.customerId] = (counts[job.customerId] || 0) + 1;
      }
      if (job.vendorId) {
        counts[job.vendorId] = (counts[job.vendorId] || 0) + 1;
      }
      if (job.shipperId) {
        counts[job.shipperId] = (counts[job.shipperId] || 0) + 1;
      }
      if (job.consigneeId) {
        counts[job.consigneeId] = (counts[job.consigneeId] || 0) + 1;
      }
    }
    jobCounts.value = counts;
  } catch {
    jobCounts.value = {};
  }
};

const fetchWithFilters = async (page = 1) => {
  await fetchCompanies({
    search: searchQuery.value || undefined,
    type: toQueryType(),
    status: toQueryStatus(),
    page,
    limit: pageSize.value,
  });
};

const handlePageChange = async (page: number) => {
  await fetchWithFilters(page);
};

const selectAll = computed({
  get: () =>
    sortedCompanies.value.length > 0 &&
    sortedCompanies.value.every((c) => selectedIds.value.has(c.id)),
  set: (val) => {
    const next = new Set(selectedIds.value);
    sortedCompanies.value.forEach((company) => {
      if (val) {
        next.add(company.id);
      } else {
        next.delete(company.id);
      }
    });
    selectedIds.value = next;
  },
});

const toggleSelect = (payload: { id: string; value: boolean }) => {
  const next = new Set(selectedIds.value);
  if (payload.value) {
    next.add(payload.id);
  } else {
    next.delete(payload.id);
  }
  selectedIds.value = next;
};

const toggleActionMenu = (id: string) => {
  activeActionMenu.value = activeActionMenu.value === id ? null : id;
};

const closeActionMenu = () => {
  activeActionMenu.value = null;
};

const openCreateModal = () => {
  formMode.value = "create";
  selectedCompanyForm.value = null;
  isFormOpen.value = true;
};

const openEditModal = (company: MappedCompany) => {
  closeActionMenu();
  formMode.value = "edit";
  selectedCompanyForm.value = company;
  isFormOpen.value = true;
};

const handleDeleteCompany = async (company: MappedCompany) => {
  closeActionMenu();
  const isConfirmed = await confirm({
    title: "Delete company?",
    message: `Are you sure you want to delete "${company.name}"? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });
  if (!isConfirmed) return;
  const result = await deleteCompany(company.id);
  if (result.success) {
    toast.success("Company deleted.");
    await fetchWithFilters(currentPage.value);
  } else {
    toast.error(result.error || "Failed to delete company.");
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".company-action-menu")) {
    closeActionMenu();
  }
};

// Watch for search changes to filter locally (no API call needed as we filter client-side)
watch(searchQuery, () => {
  // Search is handled by computed filteredCompanies
});

// Watch for type/status changes to reload data and filter
watch([selectedType, selectedStatus], () => {
  fetchWithFilters(1);
  fetchJobCounts();
});

onMounted(async () => {
  await fetchWithFilters(1);
  await fetchJobCounts();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (filterDebounce) clearTimeout(filterDebounce);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
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
        <SearchSelect
          v-model="selectedType"
          :initial-options="typeOptions"
          placeholder="Filter by type..."
        />
        <SearchSelect
          v-model="selectedStatus"
          :initial-options="statusOptions"
          placeholder="Filter by status..."
        />
        <button
          @click="openCreateModal"
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
      :selected-ids="selectedIds"
      :active-menu-id="activeActionMenu"
      @update:sort="toggleSort"
      @open-detail="openDetailModal"
      @update:select-all="selectAll = $event"
      @toggle-select="toggleSelect"
      @toggle-menu="toggleActionMenu"
      @edit="openEditModal"
      @delete="handleDeleteCompany"
    />

    <!-- Grid View -->
    <CompanyGrid
      v-else
      :companies="sortedCompanies"
      :active-menu-id="activeActionMenu"
      @open-detail="openDetailModal"
      @toggle-menu="toggleActionMenu"
      @edit="openEditModal"
      @delete="handleDeleteCompany"
    />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ pagination.total || sortedCompanies.length }} data found.</p>
      <UiPagination
        v-if="pagination.total > pagination.limit"
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Create Modal -->
    <CompanyCreateModal
      v-model="isFormOpen"
      :mode="formMode"
      :company="selectedCompanyForm"
      @refresh="fetchWithFilters(currentPage)"
    />
    <CompanyDetailModal v-model="isDetailOpen" :company="selectedCompanyDetail" />
  </div>
</template>
