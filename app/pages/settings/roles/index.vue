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
} from "lucide-vue-next";

definePageMeta({
    layout: "dashboard",
});

const { roles, fetchRoles, deleteRole, isLoading } = useRoles();
const searchQuery = ref("");
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);
const roleToDelete = ref<any>(null);
const errorRoot = ref("");

// Fetch roles on mount
onMounted(() => {
    fetchRoles();
});

const filteredRoles = computed(() => {
    if (!searchQuery.value) return roles.value;
    const lowerQuery = searchQuery.value.toLowerCase();
    return roles.value.filter(
        (role) =>
            role.name.toLowerCase().includes(lowerQuery) ||
            role.code.toLowerCase().includes(lowerQuery) ||
            (role.description && role.description.toLowerCase().includes(lowerQuery))
    );
});

const confirmDelete = (role: any) => {
    roleToDelete.value = role;
    showDeleteConfirm.value = true;
};

const handleDelete = async () => {
    if (!roleToDelete.value) return;

    isDeleting.value = true;
    errorRoot.value = "";

    try {
        const result = await deleteRole(roleToDelete.value.id);
        if (result.success) {
            showDeleteConfirm.value = false;
            roleToDelete.value = null;
        } else {
            errorRoot.value = result.error || "Gagal menghapus role.";
        }
    } catch (e: any) {
        errorRoot.value = e.message || "Terjadi kesalahan sistem.";
    } finally {
        isDeleting.value = false;
    }
};

const cancelDelete = () => {
    showDeleteConfirm.value = false;
    roleToDelete.value = null;
    errorRoot.value = "";
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink
                    to="/settings/users"
                    class="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Role Management</h1>
                    <p class="text-muted-foreground mt-1">Kelola role dan permission user</p>
                </div>
            </div>
            <NuxtLink to="/settings/roles/create" class="btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Role
            </NuxtLink>
        </div>

        <div class="card-elevated p-4">
            <div class="relative">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                />
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari role (nama, code)..."
                    class="input-field pl-10"
                />
            </div>
        </div>

        <div class="card-elevated overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nama Role</th>
                        <th>Code</th>
                        <th>Deskripsi</th>
                        <th>Status</th>
                        <th class="w-28">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoading">
                        <td colspan="5" class="text-center p-8 text-muted-foreground">
                            <Loader2 class="w-6 h-6 mx-auto animate-spin mb-2" />
                            Loading roles...
                        </td>
                    </tr>
                    <tr v-else-if="filteredRoles.length === 0">
                        <td colspan="5" class="text-center p-8 text-muted-foreground">
                            Tidak ada role ditemukan.
                        </td>
                    </tr>
                    <tr
                        v-else
                        v-for="role in filteredRoles"
                        :key="role.id"
                        class="hover:bg-muted/50 border-b last:border-0 border-border"
                    >
                        <td>
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center"
                                >
                                    <Shield class="w-4 h-4 text-accent" />
                                </div>
                                <span class="font-medium">{{ role.name }}</span>
                            </div>
                        </td>
                        <td class="font-mono text-sm text-muted-foreground">{{ role.code }}</td>
                        <td class="text-muted-foreground">{{ role.description || "-" }}</td>
                        <td>
                            <span
                                :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    role.isActive
                                        ? 'badge-success'
                                        : 'bg-muted text-muted-foreground',
                                ]"
                            >
                                {{ role.isActive ? "Active" : "Inactive" }}
                            </span>
                        </td>
                        <td>
                            <div class="flex items-center gap-2">
                                <NuxtLink
                                    :to="`/settings/roles/${role.id}/edit`"
                                    class="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                    title="Edit role"
                                >
                                    <Edit class="w-4 h-4" />
                                </NuxtLink>
                                <button
                                    @click="confirmDelete(role)"
                                    class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                    title="Hapus role"
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
    >
        <div class="bg-background rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <div class="flex items-center gap-3 text-red-600 mb-4">
                <div class="p-2 bg-red-100 rounded-full">
                    <AlertTriangle class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-semibold">Hapus Role?</h3>
            </div>

            <p
                v-if="errorRoot"
                class="bg-red-50 text-red-600 p-2 rounded text-sm mb-4 border border-red-200"
            >
                {{ errorRoot }}
            </p>

            <p class="text-muted-foreground mb-6">
                Apakah Anda yakin ingin menghapus role <strong>{{ roleToDelete?.name }}</strong
                >? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div class="flex justify-end gap-3">
                <button
                    type="button"
                    @click="cancelDelete"
                    class="btn-secondary"
                    :disabled="isDeleting"
                >
                    Batal
                </button>
                <button
                    type="button"
                    @click="handleDelete"
                    class="btn-destructive"
                    :disabled="isDeleting"
                >
                    <Loader2 v-if="isDeleting" class="w-4 h-4 mr-2 animate-spin" />
                    <span v-else>Ya, Hapus</span>
                </button>
            </div>
        </div>
    </div>
</template>
