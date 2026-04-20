<script setup lang="ts">
import { LayoutGrid, LayoutList, Loader2, Plus, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";
import SearchSelect from "~/components/ui/SearchSelect.vue";
import { useCompanies, type MappedCompany } from "~/composables/useCompanies";
import { useMasterData } from "~/composables/useMasterData";
import { cn } from "~/lib/utils";
import CompanyCreateModal from "./components/CompanyCreateModal.vue";
import CompanyDetailModal from "./components/CompanyDetailModal.vue";
import CompanyGrid from "./components/CompanyGrid.vue";
import CompanyList from "./components/CompanyList.vue";

definePageMeta({
  layout: "dashboard",
});

const { companies: companiesList, pagination, loadCompanies, deleteCompany } = useCompanies();
const { fetchCompanyCategories } = useMasterData();

const [companiesData, categoriesData] = await Promise.all([
  useAsyncData(
    "companies-list",
    () =>
      loadCompanies({
        page: 1,
        limit: 50,
        type: "ALL",
        status: "ALL",
      }),
    { server: false },
  ),
  useAsyncData("company-categories", () => fetchCompanyCategories(), { server: false }),
]);

const pending = computed(() => companiesData.pending.value);
const refresh = companiesData.refresh;

const { confirm } = useConfirm();

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

const searchQuery = ref("");
const selectedType = ref<string>("all");
const selectedStatus = ref<string>("all");
const selectedCategory = ref<string>("all");
const pageSize = ref(50);

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
    categoryName: c.category?.name || "-",
    status: c.isActive ? "Active" : "Inactive",
    totalJobs: c.totalJobs ?? 0,
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
      case "category":
        comparison = a.categoryName.localeCompare(b.categoryName);
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
  { id: "all", name: "All Roles" },
  { id: "customer", name: "Customer" },
  { id: "vendor", name: "Vendor" },
  { id: "both", name: "Customer & Vendor" },
];

const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

const categoryOptions = computed(() => [
  { id: "all", name: "All Types" },
  ...(categoriesData.data.value?.map((c) => ({ id: c.id, name: c.name })) ?? []),
]);

const filteredCompanies = computed(() => {
  let result = companiesList.value;

  if (selectedType.value !== "all") {
    result = result.filter((c) => {
      if (selectedType.value === "customer") return c.isCustomer;
      if (selectedType.value === "vendor") return c.isVendor;
      if (selectedType.value === "both") return c.isCustomer && c.isVendor;
      return true;
    });
  }

  if (selectedStatus.value !== "all") {
    const isActiveFilter = selectedStatus.value === "active";
    result = result.filter((c) => c.isActive === isActiveFilter);
  }

  if (selectedCategory.value !== "all") {
    result = result.filter((c) => c.categoryId === selectedCategory.value);
  }

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

const fetchWithFilters = async (page = 1) => {
  await loadCompanies({
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

watch([selectedType, selectedStatus, selectedCategory], () => {
  fetchWithFilters(1);
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
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
          placeholder="Filter by role..."
        />
        <SearchSelect
          v-model="selectedStatus"
          :initial-options="statusOptions"
          placeholder="Filter by status..."
        />
        <SearchSelect
          v-model="selectedCategory"
          :initial-options="categoryOptions"
          placeholder="Filter by type..."
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

    <div v-if="pending" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

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

    <CompanyGrid
      v-else
      :companies="sortedCompanies"
      :active-menu-id="activeActionMenu"
      @open-detail="openDetailModal"
      @toggle-menu="toggleActionMenu"
      @edit="openEditModal"
      @delete="handleDeleteCompany"
    />

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

    <CompanyCreateModal
      v-model="isFormOpen"
      :mode="formMode"
      :company="selectedCompanyForm"
      @refresh="fetchWithFilters(currentPage)"
    />
    <CompanyDetailModal v-model="isDetailOpen" :company="selectedCompanyDetail" />
  </div>
</template>
