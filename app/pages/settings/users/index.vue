<script setup lang="ts">
import { Plus, Search, User, Edit, Trash2, Shield } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const { fetchUsers } = useAuth();
const { roles, fetchRoles } = useRoles();
const users = ref<any[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedRole = ref("");

const filteredUsers = computed(() => {
    return users.value.filter((user) => {
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
            users.value = result.data.users.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: u.banned ? "inactive" : "active", // mapping better-auth 'banned' to 'inactive' if applicable, or logic
                lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
            }));
        }
    } catch (e) {
        console.error("Failed to fetch users", e);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">User & Role</h1>
                <p class="text-muted-foreground mt-1">Kelola pengguna dan hak akses</p>
            </div>
            <div class="flex gap-3">
                <NuxtLink to="/settings/roles" class="btn-primary">
                    <Shield class="w-4 h-4 mr-2" />
                    Kelola Role
                </NuxtLink>
                <NuxtLink to="/settings/users/create" class="btn-primary">
                    <Plus class="w-4 h-4 mr-2" />
                    Tambah User
                </NuxtLink>
            </div>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Cari user..."
                        class="input-field pl-10"
                    />
                </div>
                <select v-model="selectedRole" class="input-field w-36">
                    <option value="">Semua Role</option>
                    <option v-for="role in roles" :key="role.id" :value="role.code">
                        {{ role.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Login Terakhir</th>
                        <th class="w-28">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="5" class="text-center p-4 text-muted-foreground">
                            Loading users...
                        </td>
                    </tr>
                    <tr v-else-if="filteredUsers.length === 0">
                        <td colspan="5" class="text-center p-4 text-muted-foreground">
                            No users found.
                        </td>
                    </tr>
                    <tr
                        v-else
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/settings/users/${user.id}`)"
                    >
                        <td>
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"
                                >
                                    <User class="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p class="font-medium">{{ user.name }}</p>
                                    <p class="text-xs text-muted-foreground">{{ user.email }}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="flex items-center gap-1 text-sm">
                                <Shield class="w-3 h-3 text-accent" />
                                {{ user.role }}
                            </span>
                        </td>
                        <td>
                            <span
                                :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    user.status === 'active'
                                        ? 'badge-success'
                                        : 'bg-muted text-muted-foreground',
                                ]"
                            >
                                {{ user.status === "active" ? "Aktif" : "Tidak Aktif" }}
                            </span>
                        </td>
                        <td class="text-sm text-muted-foreground">{{ user.lastLogin }}</td>
                        <td>
                            <div class="flex items-center gap-2">
                                <NuxtLink
                                    :to="`/settings/users/${user.id}/edit`"
                                    class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                    title="Edit user"
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
</template>
