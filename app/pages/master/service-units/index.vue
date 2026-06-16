<script setup lang="ts">
import { LayoutGrid, LayoutList, Plus, Search, Loader2, Trash2 } from "lucide-vue-next";
import type { ServiceUnit } from "~/types/master";
import { UnitFormModal, UnitTable, UnitStats } from "./components";
import { cn } from "~/lib/utils";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

const {
  units: unitsList,
  stats,
  isLoading,
  fetchUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} = useServiceUnits();

const pending = ref(false);
onMounted(async () => {
  pending.value = true;
  await fetchUnits();
  pending.value = false;
});
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    fetchUnits();
  },
);
const { canManage, requireManage } = useFeatureAccess("master.service");

// Search state
const searchQuery = ref("");
const selectedCodeFilter = ref("all");
const viewMode = ref<"list" | "grid">("list");
const codeFilterOptions = [
  { id: "all", name: "All Codes" },
  { id: "manual", name: "Manual Code" },
  { id: "auto", name: "Auto Code" },
];

// Filtered units (keep full ServiceUnit objects to satisfy table prop types and enable accurate date sorting)
const filteredUnits = computed(() => {
  let list = unitsList.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(
      (u) => u.name.toLowerCase().includes(query) || u.code.toLowerCase().includes(query),
    );
  }

  if (selectedCodeFilter.value === "manual") {
    list = list.filter((unit) => !unit.code.startsWith("GEN_"));
  } else if (selectedCodeFilter.value === "auto") {
    list = list.filter((unit) => unit.code.startsWith("GEN_"));
  }

  return list;
});

// Sorting state
const sortField = ref<string>("name");
const sortDirection = ref<"asc" | "desc">("asc");

const sortedUnits = computed(() => {
  const sorted = [...filteredUnits.value];
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
const editingUnit = ref<ServiceUnit | null>(null);

const openCreateModal = () => {
  if (!requireManage("You only have view access for service units.")) return;
  editingUnit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (unit: ServiceUnit) => {
  if (!requireManage("You only have view access for service units.")) return;
  editingUnit.value = unit;
  isModalOpen.value = true;
};

const handleSubmit = async (formData: { name: string }) => {
  if (!formData.name) {
    formError.value = "Unit name is required";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const unitData = {
    name: formData.name,
  };

  let result;
  if (editingUnit.value) {
    result = await updateUnit(editingUnit.value.id, unitData);
  } else {
    result = await createUnit(unitData);
  }

  if (result.success) {
    isModalOpen.value = false;
    editingUnit.value = null;
  } else {
    formError.value = result.error || "Failed to save unit";
  }

  isSubmitting.value = false;
};

// Delete confirmation
const isDeleteModalOpen = ref(false);
const unitToDelete = ref<ServiceUnit | null>(null);

const openDeleteModal = (unit: ServiceUnit) => {
  if (!requireManage("You only have view access for service units.")) return;
  unitToDelete.value = unit;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!unitToDelete.value) return;

  isSubmitting.value = true;
  const result = await deleteUnit(unitToDelete.value.id);

  if (result.success) {
    isDeleteModalOpen.value = false;
    unitToDelete.value = null;
  } else {
    formError.value = result.error || "Failed to delete unit";
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Service Unit</h1>
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
    <UnitStats :total="stats.total" />

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Unit..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="selectedCodeFilter"
          :options="codeFilterOptions"
          placeholder="All Codes"
          class="min-w-[150px]"
        />
        <button
          v-if="canManage"
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Unit</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <!-- Table -->
    <UnitTable
      v-else-if="viewMode === 'list'"
      :units="sortedUnits"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @toggle-sort="toggleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
      :can-manage="canManage"
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="unit in sortedUnits"
        :key="unit.id"
        class="border border-border rounded-xl bg-white p-4 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {{ unit.code }}
            </p>
            <h3 class="font-semibold text-foreground truncate">{{ unit.name }}</h3>
            <p class="text-xs text-muted-foreground mt-2">
              Created {{ new Date(unit.createdAt).toLocaleDateString("id-ID") }}
            </p>
          </div>
          <div v-if="canManage" class="flex items-center gap-1">
            <button
              type="button"
              class="px-2 py-1 text-xs font-medium rounded border border-border hover:bg-muted"
              @click="openEditModal(unit)"
            >
              Edit
            </button>
            <button
              type="button"
              class="px-2 py-1 text-xs font-medium rounded border border-red-200 text-red-600 hover:bg-red-50"
              @click="openDeleteModal(unit)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="sortedUnits.length === 0"
        class="md:col-span-2 xl:col-span-3 py-8 text-center text-muted-foreground"
      >
        No service units found
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UnitFormModal
      :is-open="isModalOpen"
      :is-submitting="isSubmitting"
      :error="formError"
      :editing-unit="editingUnit"
      @update:is-open="(val) => (isModalOpen = val)"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <UiModal
      v-model="isDeleteModalOpen"
      title="Delete Unit"
      description="Are you sure you want to delete this unit? This action cannot be undone."
      width="max-w-md"
    >
      <div v-if="unitToDelete" class="py-4">
        <p class="text-sm text-muted-foreground">
          You are about to delete
          <span class="font-medium text-foreground">{{ unitToDelete.name }}</span
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
