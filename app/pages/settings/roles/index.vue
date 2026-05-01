<script setup lang="ts">
import {
  Plus,
  Search,
  Shield,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  LayoutList,
  ChevronDown,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { Role } from "~/composables/useRoles";

definePageMeta({
  layout: "dashboard",
});

const { roles, fetchRoles, deleteRole, isLoading } = useRoles();
const { confirm } = useConfirm();
const searchQuery = ref("");
const isDeleting = ref(false);
const errorRoot = ref("");

const { pending } = await useAsyncData("roles-list", () => fetchRoles(), { server: false });

// Pagination
const currentPage = ref(1);
const pagination = ref({
  total: 0,
  limit: 10,
  page: 1,
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchRoles();
};

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(lowerQuery) ||
      role.code.toLowerCase().includes(lowerQuery) ||
      (role.description && role.description.toLowerCase().includes(lowerQuery)),
  );
});

const handleDelete = async (role: Role) => {
  const isConfirmed = await confirm({
    title: "Hapus Role?",
    message: `Apakah Anda yakin ingin menghapus role ${role.name}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Ya, Hapus",
    cancelText: "Batal",
    type: "danger",
  });

  if (!isConfirmed) return;

  isDeleting.value = true;
  errorRoot.value = "";

  try {
    const result = await deleteRole(role.id);
    if (!result.success) {
      const deleteResult = result as { success: boolean; error?: string };
      errorRoot.value = deleteResult.error || "Gagal menghapus role.";
    }
  } catch (e) {
    const error = e as Error;
    errorRoot.value = error.message || "Terjadi kesalahan sistem.";
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Role Management</h1>
    </div>

    <div
      v-if="errorRoot"
      class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200"
    >
      {{ errorRoot }}
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Role..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/settings/roles/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New Role</span>
        </NuxtLink>
      </div>
    </div>

    <!-- List View -->
    <div class="border border-border rounded-xl bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">Name</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Code</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Description</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="text-center p-8 text-muted-foreground">
                <Loader2 class="w-6 h-6 mx-auto animate-spin mb-2" />
                Loading roles...
              </td>
            </tr>
            <tr v-else-if="filteredRoles.length === 0">
              <td colspan="6" class="text-center p-8 text-muted-foreground">No roles found.</td>
            </tr>
            <tr
              v-else
              v-for="role in filteredRoles"
              :key="role.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="py-3 px-4 text-sm font-medium">
                <div class="flex items-center gap-3">
                  <span>{{ role.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm font-mono text-muted-foreground">
                {{ role.code }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ role.description || "-" }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                      role.isActive
                        ? 'text-blue-500 border-blue-200'
                        : 'text-gray-500 border-gray-200',
                    )
                  "
                >
                  {{ role.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/settings/roles/${role.id}/edit`"
                    class="text-muted-foreground hover:text-foreground"
                    title="Edit role"
                  >
                    <Edit class="w-4 h-4" />
                  </NuxtLink>
                  <button
                    @click="handleDelete(role)"
                    :disabled="isDeleting"
                    class="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="Delete role"
                  >
                    <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
                    <Trash2 v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ filteredRoles.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>
