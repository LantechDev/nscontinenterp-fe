<script setup lang="ts">
import { Plus, Search, Loader2, Trash2 } from "lucide-vue-next";
import type { Plane } from "~/composables/usePlanes";
import { PlaneFormModal, PlaneTable, PlaneStats } from "./components";

definePageMeta({
  layout: "dashboard",
});

const {
  planes: planesList,
  stats,
  isLoading,
  fetchPlanes,
  createPlane,
  updatePlane,
  deletePlane,
} = usePlanes();

const { pending } = await useAsyncData("planes-list", () => fetchPlanes(), { server: false });

// Search state
const searchQuery = ref("");

// Transform API planes to view format with filtering
const planes = computed(() => {
  let filtered = planesList.value.map((p: Plane) => ({
    id: p.id,
    name: p.name,
    code: p.code || "-",
    createdAt: new Date(p.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    status: p.isActive && !p.deletedAt ? "Active" : "Inactive",
  }));

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query),
    );
  }

  return filtered;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedPlanes = computed(() => {
  const sorted = [...planes.value];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortField.value) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "code":
        comparison = a.code.localeCompare(b.code);
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
const editingPlane = ref<Plane | null>(null);

const openCreateModal = () => {
  editingPlane.value = null;
  isModalOpen.value = true;
};

const openEditModal = (id: string) => {
  editingPlane.value = planesList.value.find((p) => p.id === id) || null;
  isModalOpen.value = true;
};

const handleSubmit = async (formData: {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}) => {
  if (!formData.name) {
    formError.value = "Plane name is required";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const planeData = {
    name: formData.name,
    code: formData.code || undefined,
    description: formData.description || undefined,
    isActive: formData.isActive,
  };

  let result;
  if (editingPlane.value) {
    result = await updatePlane(editingPlane.value.id, planeData);
  } else {
    result = await createPlane(planeData);
  }

  if (result.success) {
    isModalOpen.value = false;
    editingPlane.value = null;
    await fetchPlanes();
  } else {
    formError.value = result.error || "Failed to save plane";
  }

  isSubmitting.value = false;
};

// Delete confirmation
const isDeleteModalOpen = ref(false);
const planeToDelete = ref<Plane | null>(null);

const openDeleteModal = (id: string) => {
  planeToDelete.value = planesList.value.find((p) => p.id === id) || null;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!planeToDelete.value) return;

  isSubmitting.value = true;
  const result = await deletePlane(planeToDelete.value.id);

  if (result.success) {
    isDeleteModalOpen.value = false;
    planeToDelete.value = null;
    await fetchPlanes();
  } else {
    formError.value = result.error || "Failed to delete plane";
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Planes</h1>
    </div>

    <!-- Stats Cards -->
    <PlaneStats :total="stats.total" :active="stats.active" :inactive="stats.inactive" />

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Plane..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
      >
        <Plus class="w-4 h-4" />
        <span>New Plane</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- Table -->
    <PlaneTable
      v-else
      :planes="sortedPlanes"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @toggle-sort="toggleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Create/Edit Modal -->
    <PlaneFormModal
      :is-open="isModalOpen"
      :is-submitting="isSubmitting"
      :error="formError"
      :editing-plane="editingPlane"
      @update:is-open="(val) => (isModalOpen = val)"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <UiModal
      v-model="isDeleteModalOpen"
      title="Delete Plane"
      description="Are you sure you want to delete this plane? This action cannot be undone."
      width="max-w-md"
    >
      <div v-if="planeToDelete" class="py-4">
        <p class="text-sm text-muted-foreground">
          You are about to delete
          <span class="font-medium text-foreground">{{ planeToDelete.name }}</span
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
