<script setup lang="ts">
import { Plus, Search, User, Edit, Trash2, Shield } from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const users = [
    { id: "1", name: "Direktur", email: "direktur@lantech.co.id", role: "Superuser", status: "active", lastLogin: "7 Jan 2025, 09:15" },
    { id: "2", name: "Manager Operasional", email: "ops.manager@lantech.co.id", role: "Manager", status: "active", lastLogin: "7 Jan 2025, 08:30" },
    { id: "3", name: "Staff Finance", email: "finance@lantech.co.id", role: "Staff", status: "active", lastLogin: "6 Jan 2025, 17:45" },
    { id: "4", name: "Staff Sales", email: "sales@lantech.co.id", role: "Staff", status: "inactive", lastLogin: "15 Des 2024, 14:20" },
];
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div>
                <h1 class="page-title">User & Role</h1>
                <p class="text-muted-foreground mt-1">Kelola pengguna dan hak akses</p>
            </div>
            <NuxtLink to="/settings/users/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Tambah User
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Cari user..." class="input-field pl-10" />
                </div>
                <select class="input-field w-36">
                    <option value="">Semua Role</option>
                    <option value="superuser">Superuser</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
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
                    <tr v-for="user in users" :key="user.id" class="cursor-pointer hover:bg-muted/50"
                        @click="navigateTo(`/settings/users/${user.id}`)">
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
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
                                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', user.status === 'active' ? 'badge-success' : 'bg-muted text-muted-foreground']">
                                {{ user.status === "active" ? "Aktif" : "Tidak Aktif" }}
                            </span>
                        </td>
                        <td class="text-sm text-muted-foreground">{{ user.lastLogin }}</td>
                        <td>
                            <div class="flex gap-1">
                                <NuxtLink :to="`/settings/users/${user.id}`"
                                    class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                                    <Edit class="w-4 h-4 text-muted-foreground" />
                                </NuxtLink>
                                <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                                    <Trash2 class="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
