<script setup lang="ts">
import { LayoutGrid, LayoutList, Plus, Search, Loader2, Trash2 } from "lucide-vue-next";
import type { Vessel } from "~/composables/useVessels";
import { VesselFormModal, VesselTable, VesselStats } from "./components";
import { cn } from "~/lib/utils";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

const {
  vessels: vesselsList,
  stats,
  isLoading,
  fetchVessels,
  createVessel,
  updateVessel,
  deleteVessel,
} = useVessels();

const pending = ref(false);
onMounted(async () => {
  pending.value = true;
  await fetchVessels();
  pending.value = false;
});
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    fetchVessels();
  },
);
const { canManage, requireManage } = useFeatureAccess("master.logistics");

// Search state
const searchQuery = ref("");
const selectedStatus = ref("all");
const viewMode = ref<"list" | "grid">("list");
const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inactive" },
];

// Transform API vessels to view format with filtering
const vessels = computed(() => {
  let filtered = vesselsList.value.map((v: Vessel) => ({
    id: v.id,
    name: v.name,
    imoNumber: v.imoNumber || "-",
    createdAt: new Date(v.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: v.isActive && !v.deletedAt ? "Active" : "Inactive",
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (v) => v.name.toLowerCase().includes(query) || v.imoNumber.toLowerCase().includes(query),
    );
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((v) => v.status.toLowerCase() === selectedStatus.value);
  }

  return filtered;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedVessels = computed(() => {
  const sorted = [...vessels.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "imoNumber":
        comparison = a.imoNumber.localeCompare(b.imoNumber);
        break;
      case "createdAt":
        comparison = a.createdAt.localeCompare(b.createdAt);
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

// Modal state
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const editingVessel = ref<Vessel | null>(null);

const openCreateModal = () => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  editingVessel.value = null;
  isModalOpen.value = true;
};

const openEditModal = (id: string) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  editingVessel.value = vesselsList.value.find((v) => v.id === id) || null;
  isModalOpen.value = true;
};

const handleSubmit = async (formData: {
  name: string;
  imoNumber: string;
  description: string;
  isActive: boolean;
}) => {
  if (!formData.name) {
    formError.value = "Vessel name is required";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const vesselData = {
    name: formData.name,
    imoNumber: formData.imoNumber || undefined,
    description: formData.description || undefined,
    isActive: formData.isActive,
  };

  let result;
  if (editingVessel.value) {
    result = await updateVessel(editingVessel.value.id, vesselData);
  } else {
    result = await createVessel(vesselData);
  }

  if (result.success) {
    isModalOpen.value = false;
    editingVessel.value = null;
  } else {
    formError.value = result.error || "Failed to save vessel";
  }

  isSubmitting.value = false;
};

// Delete confirmation
const isDeleteModalOpen = ref(false);
const vesselToDelete = ref<Vessel | null>(null);

const openDeleteModal = (id: string) => {
  if (!requireManage("You only have view access for logistics master data.")) return;
  vesselToDelete.value = vesselsList.value.find((v) => v.id === id) || null;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!vesselToDelete.value) return;

  isSubmitting.value = true;
  const result = await deleteVessel(vesselToDelete.value.id);

  if (result.success) {
    isDeleteModalOpen.value = false;
    vesselToDelete.value = null;
  } else {
    formError.value = result.error || "Failed to delete vessel";
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vessels</h1>
      <div class="flex items-center bg-white border border-border rounded-lg p-1">
        <button
          type="button"
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
          type="button"
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

    <!-- Stats Cards -->
    <VesselStats :total="stats.total" :active="stats.active" :inactive="stats.inactive" />

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Vessel..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="All Status"
          class="min-w-[150px]"
        />
        <button
          v-if="canManage"
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Vessel</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- Table -->
    <VesselTable
      v-else-if="viewMode === 'list'"
      :vessels="sortedVessels"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @toggle-sort="toggleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
      :can-manage="canManage"
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="vessel in sortedVessels"
        :key="vessel.id"
        class="border border-border rounded-xl bg-white p-4 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              IMO {{ vessel.imoNumber }}
            </p>
            <h3 class="font-semibold text-foreground truncate">{{ vessel.name }}</h3>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="
                  cn(
                    'text-xs px-2 py-1 rounded border font-medium',
                    vessel.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200',
                  )
                "
              >
                {{ vessel.status }}
              </span>
              <span class="text-xs text-muted-foreground">{{ vessel.createdAt }}</span>
            </div>
          </div>
          <div v-if="canManage" class="flex items-center gap-1">
            <button
              type="button"
              class="px-2 py-1 text-xs font-medium rounded border border-border hover:bg-muted"
              @click="openEditModal(vessel.id)"
            >
              Edit
            </button>
            <button
              type="button"
              class="px-2 py-1 text-xs font-medium rounded border border-red-200 text-red-600 hover:bg-red-50"
              @click="openDeleteModal(vessel.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="sortedVessels.length === 0"
        class="md:col-span-2 xl:col-span-3 py-8 text-center text-muted-foreground"
      >
        No vessels found
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <VesselFormModal
      :is-open="isModalOpen"
      :is-submitting="isSubmitting"
      :error="formError"
      :editing-vessel="editingVessel"
      @update:is-open="(val) => (isModalOpen = val)"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <UiModal
      v-model="isDeleteModalOpen"
      title="Delete Vessel"
      description="Are you sure you want to delete this vessel? This action cannot be undone."
      width="max-w-md"
    >
      <div v-if="vesselToDelete" class="py-4">
        <p class="text-sm text-muted-foreground">
          You are about to delete
          <span class="font-medium text-foreground">{{ vesselToDelete.name }}</span
          >.
        </p>
      </div>

      <template #footer>
        <button
          type="button"
          @click="isDeleteModalOpen = false"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
          {{ isSubmitting ? "Deleting..." : "Delete" }}
        </button>
      </template>
    </UiModal>
  </div>
</template>
