<script setup lang="ts">
import { Plus, Search, Edit, Trash2, Shield, LayoutList, ChevronDown } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { User as AuthUser } from "~/types/auth";
import { toast } from "vue-sonner";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
  status: string;
  lastLogin: string;
}

definePageMeta({
  layout: "dashboard",
});

const { fetchUsers } = useAuth();
const { roles, fetchRoles } = useRoles();
const users = ref<DisplayUser[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedRole = ref("");

const filteredUsers = computed(() => {
  return users.value.filter((user: DisplayUser) => {
    const matchesSearch =
      searchQuery.value === "" ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesRole = selectedRole.value === "" || user.role === selectedRole.value;

    return matchesSearch && matchesRole;
  });
});

onMounted(async () => {
  fetchRoles();
  try {
    const result = await fetchUsers();
    if (result.success && result.data && Array.isArray(result.data.users)) {
      users.value = result.data.users.map(
        (u: AuthUser): DisplayUser => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.banned ? "inactive" : "active", // mapping better-auth 'banned' to 'inactive' if applicable, or logic
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
        }),
      );
    }
  } catch (e) {
    console.error("Failed to fetch users", e);
    toast.error("Gagal memuat daftar user.");
  } finally {
    isLoading.value = false;
  }
});

// Pagination
const currentPage = ref(1);
const pagination = ref({
  total: 0,
  limit: 10,
  page: 1,
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchUsers();
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">User & Role</h1>

      <div class="flex items-center gap-2">
        <NuxtLink to="/settings/roles" class="btn-secondary">
          <Shield class="w-4 h-4 mr-2" />
          <span>Manage Roles</span>
        </NuxtLink>
        <div class="flex items-center bg-white border border-border rounded-lg p-1">
          <button class="bg-primary text-primary-foreground p-1.5 rounded transition-colors">
            <LayoutList class="w-4 h-4" />
          </button>
          <!-- Grid view placeholder if needed -->
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
          placeholder="Search User..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <select
            v-model="selectedRole"
            class="appearance-none flex items-center justify-between gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px] text-foreground pr-8 cursor-pointer focus:outline-none"
          >
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role.id" :value="role.code">
              {{ role.name }}
            </option>
          </select>
          <ChevronDown
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
        </div>

        <NuxtLink to="/settings/users/create" class="btn-primary min-w-fit whitespace-nowrap">
          <Plus class="w-4 h-4 mr-2" />
          <span>New User</span>
        </NuxtLink>
      </div>
    </div>

    <!-- List View -->
    <div class="border border-border rounded-xl bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 w-10">
                <UiCheckbox disabled />
              </th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Name</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Email</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Role</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Last Login</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center p-8 text-muted-foreground">Loading users...</td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="7" class="text-center p-8 text-muted-foreground">No users found.</td>
            </tr>
            <tr
              v-else
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/settings/users/${user.id}`)"
            >
              <td class="py-3 px-4">
                <UiCheckbox />
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ user.name }}</td>
              <td class="py-3 px-4 text-sm font-normal">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span class="flex items-center gap-1 text-sm text-gray-700">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium bg-white',
                      user.status === 'active'
                        ? 'text-blue-500 border-blue-200'
                        : 'text-red-500 border-red-200',
                    )
                  "
                >
                  {{ user.status === "active" ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ user.lastLogin }}
              </td>
              <td class="py-3 px-4 text-right" @click.stop>
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/settings/users/${user.id}/edit`"
                    class="text-muted-foreground hover:text-foreground"
                  >
                    <Edit class="w-4 h-4" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ filteredUsers.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>
