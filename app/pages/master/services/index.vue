<script setup lang="ts">
import { Plus, Search, LayoutList, LayoutGrid, Loader2 } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { Service } from "~/composables/useServices";
import { ServiceListView, ServiceGridView, ServiceCreateModal } from "./components";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

const {
  services: servicesList,
  isLoading,
  fetchServices,
  createService,
  updateService,
  deleteService,
} = useServices();

const pending = ref(false);
onMounted(async () => {
  pending.value = true;
  await fetchServices();
  pending.value = false;
});
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    fetchServices();
  },
);
const { canManage, requireManage } = useFeatureAccess("master.service");
const { confirm } = useConfirm();

// Search and filter state
const searchQuery = ref("");
const selectedStatus = ref<string>("all");
const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

// Transform API services to view format with filtering
const services = computed(() => {
  let filtered = servicesList.value.map((s: Service) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    unit: s.unit?.name || "-",
    unitId: s.unit?.id || "",
    selected: false,
    status: s.isActive ? "Active" : "Inactive",
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query),
    );
  }

  // Apply status filter
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (s) => s.status.toLowerCase() === selectedStatus.value.toLowerCase(),
    );
  }

  return filtered;
});

const serviceStats = computed(() => {
  const total = servicesList.value.length;
  const active = servicesList.value.filter((service) => service.isActive).length;
  return {
    total,
    active,
    inactive: total - active,
  };
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedServices = computed(() => {
  const sorted = [...services.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
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
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const editingService = ref<Service | null>(null);

// Modal ref for resetting form
const createModalRef = ref<{ resetForm: () => void } | null>(null);

const openCreateModal = () => {
  if (!requireManage("You only have view access for services.")) return;
  editingService.value = null;
  if (createModalRef.value) {
    createModalRef.value.resetForm();
  }
  isCreateOpen.value = true;
};

const openEditModal = (id: string) => {
  if (!requireManage("You only have view access for services.")) return;
  editingService.value = servicesList.value.find((service) => service.id === id) || null;
  formError.value = null;
  isCreateOpen.value = Boolean(editingService.value);
};

const handleSaveService = async (formData: {
  name: string;
  code: string;
  status: string;
  unitId: string;
  categoryId: string;
}) => {
  // Validation
  if (!formData.name || !formData.code) {
    formError.value = "Please fill in all required fields (Name, Code)";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const serviceData = {
    name: formData.name,
    code: formData.code,
    unitId: formData.unitId || undefined,
    categoryId: formData.categoryId || undefined,
    isActive: formData.status === "Active",
  };

  const result = editingService.value
    ? await updateService(editingService.value.id, serviceData)
    : await createService(serviceData);

  if (result.success) {
    isCreateOpen.value = false;
    editingService.value = null;
  } else {
    formError.value = result.error || "Failed to save service";
  }

  isSubmitting.value = false;
};

const handleDeleteService = async (id: string) => {
  if (!requireManage("You only have view access for services.")) return;

  const service = servicesList.value.find((item) => item.id === id);
  const confirmed = await confirm({
    title: "Delete Service",
    message: `Are you sure you want to delete ${service?.name || "this service"}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });
  if (!confirmed) return;

  isSubmitting.value = true;
  formError.value = null;
  const result = await deleteService(id);

  if (!result.success) {
    formError.value = result.error || "Failed to delete service";
  }

  isSubmitting.value = false;
};

// Row click handler
const handleRowClick = (id: string) => {
  navigateTo(`/master/services/${id}`);
};

// Pagination
const currentPage = ref(1);
const pagination = ref({
  total: 0,
  limit: 10,
  page: 1,
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchServices();
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Services</h1>

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

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Total Services</p>
        <p class="text-2xl font-bold text-foreground mt-1">{{ serviceStats.total }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Active Services</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ serviceStats.active }}</p>
      </div>
      <div class="bg-white border border-border rounded-xl p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">Inactive Services</p>
        <p class="text-2xl font-bold text-muted-foreground mt-1">{{ serviceStats.inactive }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Service..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="All Status"
          class="min-w-[160px]"
        />
        <button
          v-if="canManage"
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- List View -->
    <ServiceListView
      v-else-if="viewMode === 'list'"
      :services="sortedServices"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      :can-manage="canManage"
      @toggle-sort="toggleSort"
      @row-click="handleRowClick"
      @edit="openEditModal"
      @delete="handleDeleteService"
    />

    <!-- Grid View -->
    <ServiceGridView
      v-else
      :services="sortedServices"
      :can-manage="canManage"
      @row-click="handleRowClick"
      @edit="openEditModal"
      @delete="handleDeleteService"
    />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ sortedServices.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Create Modal -->
    <ServiceCreateModal
      ref="createModalRef"
      :is-open="isCreateOpen"
      :is-submitting="isSubmitting"
      :error="formError"
      :initial-data="editingService"
      @update:is-open="
        (val) => {
          isCreateOpen = val;
          if (!val) editingService = null;
        }
      "
      @submit="handleSaveService"
    />
  </div>
</template>
