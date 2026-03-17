<script setup lang="ts">
import { Plus, Search, Loader2, Trash2 } from "lucide-vue-next";
import type { Vessel } from "~/composables/useVessels";
import { VesselFormModal, VesselTable, VesselStats } from "./components";

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

// Fetch vessels on mount
onMounted(() => {
  fetchVessels();
});

// Search state
const searchQuery = ref("");

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
  editingVessel.value = null;
  isModalOpen.value = true;
};

const openEditModal = (id: string) => {
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
    await fetchVessels();
  } else {
    formError.value = result.error || "Failed to save vessel";
  }

  isSubmitting.value = false;
};

// Delete confirmation
const isDeleteModalOpen = ref(false);
const vesselToDelete = ref<Vessel | null>(null);

const openDeleteModal = (id: string) => {
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
    await fetchVessels();
  } else {
    formError.value = result.error || "Failed to delete vessel";
  }

  isSubmitting.value = false;
};

// Dropdown menu state
const openMenuId = ref<string | null>(null);

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

// Close menu when clicking outside
onMounted(() => {
  if (import.meta.client) {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-menu")) {
        openMenuId.value = null;
      }
    });
  }
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vessels</h1>
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

      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
      >
        <Plus class="w-4 h-4" />
        <span>New Vessel</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- Table -->
    <VesselTable
      v-else
      :vessels="sortedVessels"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      :open-menu-id="openMenuId"
      @toggle-sort="toggleSort"
      @toggle-menu="toggleMenu"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

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
