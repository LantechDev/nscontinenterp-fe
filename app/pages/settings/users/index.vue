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

const [
  { pending: usersPending, error: usersError, refresh: refreshUsers },
  { pending: rolesPending, error: rolesError, refresh: refreshRoles },
] = await Promise.all([
  useAsyncData(
    "users-list",
    async () => {
      const result = await fetchUsers();
      if (result.success && result.data && Array.isArray(result.data.users)) {
        users.value = result.data.users.map(
          (u: AuthUser): DisplayUser => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.banned ? "inactive" : "active",
            lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
          }),
        );
      }
      return result;
    },
    { server: false },
  ),
  useAsyncData("roles-list", () => fetchRoles(), { server: false }),
]);

const pending = computed(() => usersPending.value || rolesPending.value);
const bootstrapError = computed(() => usersError.value || rolesError.value);
const refreshAll = async () => {
  await Promise.all([refreshUsers(), refreshRoles()]);
};

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

const openCreateModal = () => {
  navigateTo("/settings/users/create");
};

const openEditModal = (userId: string) => {
  navigateTo(`/settings/users/${userId}/edit`);
};

const handleDeleteUser = async (userId: string, userName: string) => {
  const { confirm } = useConfirm();
  const isConfirmed = await confirm({
    title: "Delete User?",
    message: `Are you sure you want to delete user "${userName}"?`,
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!isConfirmed) return;

  try {
    const { deleteUser } = useAuth();
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success("User deleted successfully");
      await fetchUsers();
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  } catch (e) {
    console.error("Failed to delete user", e);
    toast.error("Failed to delete user");
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">User & Role</h1>
    </div>

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
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>New User</span>
        </button>
      </div>
    </div>

    <div
      v-if="bootstrapError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Gagal memuat data user/role. Silakan coba lagi.</span>
        <button class="btn-secondary" type="button" @click="refreshAll()">Coba lagi</button>
      </div>
    </div>

    <div v-else-if="pending" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <div class="bg-white rounded-lg border border-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Last Login
            </th>
            <th class="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-muted/30">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-sm font-medium text-primary">{{
                    user.name.charAt(0).toUpperCase()
                  }}</span>
                </div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
              >
                <Shield class="w-3 h-3" />
                {{ user.role || "N/A" }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="
                  cn(
                    'px-2 py-1 rounded-full text-xs',
                    user.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-700',
                  )
                "
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.lastLogin }}</td>
            <td class="px-4 py-3 text-right">
              <UiActionMenu>
                <template #trigger>
                  <button class="p-1 hover:bg-muted rounded">
                    <ChevronDown class="w-4 h-4" />
                  </button>
                </template>
                <template #content>
                  <button
                    @click="openEditModal(user.id)"
                    class="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                  >
                    <Edit class="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    @click="handleDeleteUser(user.id, user.name)"
                    class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                  >
                    <Trash2 class="w-3 h-3" />
                    Delete
                  </button>
                </template>
              </UiActionMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
