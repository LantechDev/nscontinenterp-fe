<script setup lang="ts">
import {
  Plus,
  Search,
  MoreVertical,
  Ship,
  ChevronDown,
  Save,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { Vessel } from "~/composables/useVessels";

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

// Form state
const formData = ref({
  name: "",
  imoNumber: "",
  description: "",
  isActive: true,
});

const resetForm = () => {
  formData.value = {
    name: "",
    imoNumber: "",
    description: "",
    isActive: true,
  };
  formError.value = null;
  editingVessel.value = null;
};

const openCreateModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (vessel: Vessel) => {
  editingVessel.value = vessel;
  formData.value = {
    name: vessel.name,
    imoNumber: vessel.imoNumber || "",
    description: vessel.description || "",
    isActive: vessel.isActive,
  };
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  // Validation
  if (!formData.value.name) {
    formError.value = "Vessel name is required";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const vesselData = {
    name: formData.value.name,
    imoNumber: formData.value.imoNumber || undefined,
    description: formData.value.description || undefined,
    isActive: formData.value.isActive,
  };

  let result;
  if (editingVessel.value) {
    result = await updateVessel(editingVessel.value.id, vesselData);
  } else {
    result = await createVessel(vesselData);
  }

  if (result.success) {
    isModalOpen.value = false;
    resetForm();
    await fetchVessels();
  } else {
    formError.value = result.error || "Failed to save vessel";
  }

  isSubmitting.value = false;
};

// Delete confirmation
const isDeleteModalOpen = ref(false);
const vesselToDelete = ref<Vessel | null>(null);

const openDeleteModal = (vessel: Vessel) => {
  vesselToDelete.value = vessel;
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

// Close menu when clicking outside (client-side only)
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total Vessels -->
      <div class="bg-white border border-border rounded-xl p-5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Ship class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Vessels</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <!-- Active Vessels -->
      <div class="bg-white border border-border rounded-xl p-5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <Ship class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Active Vessels</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.active }}</p>
          </div>
        </div>
      </div>

      <!-- Inactive Vessels -->
      <div class="bg-white border border-border rounded-xl p-5">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <Ship class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Inactive Vessels</p>
            <p class="text-2xl font-bold text-foreground">{{ stats.inactive }}</p>
          </div>
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
    <div v-else class="border border-border rounded-xl bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('imoNumber')"
              >
                <div class="flex items-center gap-1">
                  IMO Number
                  <ChevronDown
                    v-if="sortField === 'imoNumber'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('name')"
              >
                <div class="flex items-center gap-1">
                  Vessel Name
                  <ChevronDown
                    v-if="sortField === 'name'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('createdAt')"
              >
                <div class="flex items-center gap-1">
                  Create Date
                  <ChevronDown
                    v-if="sortField === 'createdAt'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th
                class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                @click="toggleSort('status')"
              >
                <div class="flex items-center gap-1">
                  Status
                  <ChevronDown
                    v-if="sortField === 'status'"
                    class="w-4 h-4"
                    :class="{ 'rotate-180': sortDirection === 'desc' }"
                  />
                </div>
              </th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vessel in sortedVessels"
              :key="vessel.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="py-3 px-4 text-sm font-medium">{{ vessel.imoNumber }}</td>
              <td class="py-3 px-4 text-sm font-medium">{{ vessel.name }}</td>
              <td class="py-3 px-4 text-sm text-muted-foreground">{{ vessel.createdAt }}</td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                      vessel.status === 'Active'
                        ? 'text-blue-500 border-blue-200'
                        : 'text-red-500 border-red-200',
                    )
                  "
                >
                  {{ vessel.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right relative">
                <button
                  @click.stop="toggleMenu(vessel.id)"
                  class="text-muted-foreground hover:text-foreground dropdown-menu"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>
                <!-- Dropdown Menu -->
                <div
                  v-if="openMenuId === vessel.id"
                  class="absolute right-4 top-10 z-10 w-36 bg-white border border-border rounded-lg shadow-lg overflow-hidden dropdown-menu"
                >
                  <button
                    @click.stop="
                      openEditModal(vesselsList.find((v) => v.id === vessel.id)!);
                      openMenuId = null;
                    "
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Pencil class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    @click.stop="
                      openDeleteModal(vesselsList.find((v) => v.id === vessel.id)!);
                      openMenuId = null;
                    "
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="sortedVessels.length === 0">
              <td colspan="5" class="py-8 text-center text-muted-foreground">No vessels found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UiModal
      v-model="isModalOpen"
      :title="editingVessel ? 'Edit Vessel' : 'Add New Vessel'"
      :description="editingVessel ? 'Update vessel information' : 'Register a new vessel'"
      width="max-w-lg"
    >
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Error Message -->
        <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"
            >Vessel Name <span class="text-red-500">*</span></label
          >
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g. MV Ever Given"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">IMO Number</label>
          <input
            v-model="formData.imoNumber"
            type="text"
            placeholder="e.g. IMO9811000"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Status</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.isActive"
                type="radio"
                :value="true"
                class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              />
              <span class="text-sm text-foreground">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.isActive"
                type="radio"
                :value="false"
                class="w-4 h-4 text-[#012D5A] border-border focus:ring-primary"
              />
              <span class="text-sm text-foreground">Inactive</span>
            </label>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Description</label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Enter vessel description..."
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          @click="isModalOpen = false"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ isSubmitting ? "Saving..." : "Save" }}
        </button>
      </template>
    </UiModal>

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
