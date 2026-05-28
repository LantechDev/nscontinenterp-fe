<script setup lang="ts">
import {
  ChevronDown,
  Loader2,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-vue-next";
import type { PackageType } from "~/composables/useMasterData";

definePageMeta({
  layout: "dashboard",
});

const {
  packageTypes,
  stats,
  isLoading,
  fetchPackageTypes,
  createPackageType,
  updatePackageType,
  deletePackageType,
} = usePackageTypes();

await useAsyncData("package-types-list", () => fetchPackageTypes(), { server: false });

const searchQuery = ref("");
const sortField = ref<"code" | "name" | "createdAt">("code");
const sortDirection = ref<"asc" | "desc">("asc");

const filteredPackageTypes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return packageTypes.value;

  return packageTypes.value.filter(
    (item) => item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query),
  );
});

const sortedPackageTypes = computed(() => {
  const sorted = [...filteredPackageTypes.value];
  sorted.sort((a, b) => {
    const aValue = String(a[sortField.value as keyof PackageType] || "");
    const bValue = String(b[sortField.value as keyof PackageType] || "");
    const comparison = aValue.localeCompare(bValue);
    return sortDirection.value === "asc" ? comparison : -comparison;
  });
  return sorted;
});

const toggleSort = (field: "code" | "name" | "createdAt") => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);
const editingPackageType = ref<PackageType | null>(null);
const packageTypeToDelete = ref<PackageType | null>(null);
const formData = ref({
  code: "",
  name: "",
});

const resetForm = () => {
  formData.value = {
    code: "",
    name: "",
  };
  formError.value = null;
};

const openCreateModal = () => {
  editingPackageType.value = null;
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (packageType: PackageType) => {
  editingPackageType.value = packageType;
  formData.value = {
    code: packageType.code,
    name: packageType.name,
  };
  formError.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingPackageType.value = null;
  resetForm();
};

const handleSubmit = async () => {
  if (!formData.value.name.trim()) {
    formError.value = "Unit name is required";
    return;
  }

  isSubmitting.value = true;
  formError.value = null;

  const result = editingPackageType.value
    ? await updatePackageType(editingPackageType.value.id, {
        name: formData.value.name.toUpperCase(),
      })
    : await createPackageType({
        code: formData.value.code.toUpperCase() || undefined,
        name: formData.value.name.toUpperCase(),
      });

  if (result.success) {
    await fetchPackageTypes();
    closeModal();
  } else {
    formError.value = result.error || "Failed to save package unit";
  }

  isSubmitting.value = false;
};

const openDeleteModal = (packageType: PackageType) => {
  packageTypeToDelete.value = packageType;
  formError.value = null;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!packageTypeToDelete.value) return;

  isSubmitting.value = true;
  formError.value = null;
  const result = await deletePackageType(packageTypeToDelete.value.id);

  if (result.success) {
    await fetchPackageTypes();
    isDeleteModalOpen.value = false;
    packageTypeToDelete.value = null;
  } else {
    formError.value = result.error || "Failed to delete package unit";
  }

  isSubmitting.value = false;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Package Unit</h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="border border-border rounded-lg bg-white p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total Unit</p>
            <p class="text-2xl font-bold">{{ stats.total }}</p>
          </div>
          <div
            class="h-10 w-10 rounded-lg bg-[#012D5A]/10 text-[#012D5A] flex items-center justify-center"
          >
            <Package class="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Package Unit..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <button
        type="button"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        @click="openCreateModal"
      >
        <Plus class="w-4 h-4" />
        <span>New Unit</span>
      </button>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
    </div>

    <div v-else class="border border-border rounded-xl bg-white overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th
              class="py-3 px-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
              @click="toggleSort('code')"
            >
              <div class="flex items-center gap-1">
                Unit Code
                <ChevronDown
                  v-if="sortField === 'code'"
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
                Unit Name
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
            <th class="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="packageType in sortedPackageTypes"
            :key="packageType.id"
            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
          >
            <td class="py-3 px-4 text-sm font-medium">{{ packageType.code }}</td>
            <td class="py-3 px-4 text-sm font-medium">{{ packageType.name }}</td>
            <td class="py-3 px-4 text-sm text-muted-foreground">
              {{ formatDate(packageType.createdAt) }}
            </td>
            <td class="py-3 px-4 text-right">
              <UiActionMenu>
                <template #trigger>
                  <button class="text-muted-foreground hover:text-foreground">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                </template>
                <template #content>
                  <button
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    @click="openEditModal(packageType)"
                  >
                    <Pencil class="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    @click="openDeleteModal(packageType)"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </button>
                </template>
              </UiActionMenu>
            </td>
          </tr>
          <tr v-if="sortedPackageTypes.length === 0">
            <td colspan="4" class="py-8 text-center text-muted-foreground">
              No package units found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UiModal
      v-model="isModalOpen"
      :title="editingPackageType ? 'Edit Package Unit' : 'Add New Package Unit'"
      :description="
        editingPackageType ? 'Update package unit details' : 'Register a new package unit'
      "
      width="max-w-lg"
      @close="closeModal"
    >
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ formError }}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">Unit Code</label>
          <input
            v-model="formData.code"
            v-uppercase
            type="text"
            placeholder="e.g. PKGS"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
            :disabled="Boolean(editingPackageType)"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground">
            Unit Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            v-uppercase
            type="text"
            placeholder="e.g. PACKAGES"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting || !formData.name.trim()"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Plus v-else-if="!editingPackageType" class="w-4 h-4" />
          <Pencil v-else class="w-4 h-4" />
          {{ isSubmitting ? "Saving..." : "Save" }}
        </button>
      </template>
    </UiModal>

    <UiModal
      v-model="isDeleteModalOpen"
      title="Delete Package Unit"
      description="Are you sure you want to delete this package unit? This action cannot be undone."
      width="max-w-md"
    >
      <div v-if="formError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ formError }}</p>
      </div>
      <div v-if="packageTypeToDelete" class="py-4">
        <p class="text-sm text-muted-foreground">
          You are about to delete
          <span class="font-medium text-foreground">{{ packageTypeToDelete.name }}</span
          >.
        </p>
      </div>

      <template #footer>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
          @click="isDeleteModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isSubmitting"
          @click="handleDelete"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
          {{ isSubmitting ? "Deleting..." : "Delete" }}
        </button>
      </template>
    </UiModal>
  </div>
</template>
