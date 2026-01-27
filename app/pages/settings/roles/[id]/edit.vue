<script setup lang="ts">
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-vue-next";
import { z } from "zod";

definePageMeta({
    layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const roleId = route.params.id as string;
const { updateRole, roles, fetchRoles } = useRoles();
const isLoading = ref(false);
const isFetching = ref(true);
const fetchError = ref("");

const formSchema = z.object({
    name: z.string().min(1, "Nama Role wajib diisi"),
    code: z.string().min(1, "Kode Role wajib diisi").regex(/^[A-Z_]+$/, "Kode harus huruf besar dan underscore (contoh: ADMIN_USER)"),
    description: z.string().optional(),
});

const form = ref({
    name: "",
    code: "",
    description: "",
    permissions: {} as Record<string, string[]>
});

const permissionList = ref<{ resource: string, actions: string }[]>([
    { resource: "", actions: "" }
]);

const errors = ref<Record<string, string>>({});

const addPermissionRow = () => {
    permissionList.value.push({ resource: "", actions: "" });
};

const removePermissionRow = (index: number) => {
    permissionList.value.splice(index, 1);
};

onMounted(async () => {
    try {
        await fetchRoles(); // Ensure we have latest list
        const existingRole = roles.value.find(r => r.id === roleId);

        if (existingRole) {
            form.value = {
                name: existingRole.name,
                code: existingRole.code,
                description: existingRole.description || "",
                permissions: existingRole.permissions || {}
            };

            // Transform permissions object back to list for UI
            permissionList.value = Object.entries(existingRole.permissions || {}).map(([resource, actions]) => ({
                resource,
                actions: Array.isArray(actions) ? actions.join(', ') : ''
            }));

            if (permissionList.value.length === 0) {
                permissionList.value.push({ resource: "", actions: "" });
            }

        } else {
            fetchError.value = "Role tidak ditemukan.";
        }
    } catch (e: any) {
        fetchError.value = e.message || "Gagal memuat data role.";
    } finally {
        isFetching.value = false;
    }
});

const handleSubmit = async () => {
    errors.value = {};
    const validation = formSchema.safeParse(form.value);

    if (!validation.success) {
        validation.error.issues.forEach((issue) => {
            if (issue.path[0]) {
                errors.value[issue.path[0].toString()] = issue.message;
            }
        });
        return;
    }

    // Process permissions
    const processedPermissions: Record<string, string[]> = {};
    permissionList.value.forEach(p => {
        if (p.resource.trim()) {
            processedPermissions[p.resource.trim()] = p.actions.split(',').map(a => a.trim()).filter(Boolean);
        }
    });

    isLoading.value = true;

    try {
        const result = await updateRole(roleId, {
            name: form.value.name,
            code: form.value.code,
            description: form.value.description,
            permissions: processedPermissions
        });

        if (result.success) {
            router.push("/settings/roles");
        } else {
            errors.value.root = result.error || "Gagal mengupdate role.";
        }
    } catch (e: any) {
        errors.value.root = e.message || "Terjadi kesalahan sistem.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink to="/settings/roles" class="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Edit Role</h1>
                    <p class="text-muted-foreground mt-1">Update informasi dan permission role</p>
                </div>
            </div>
        </div>

        <div v-if="isFetching" class="p-12 text-center">
            <Loader2 class="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
            <p class="mt-2 text-muted-foreground">Loading role data...</p>
        </div>

        <div v-else>
            <div v-if="fetchError" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                <p class="font-medium">Error:</p>
                <p>{{ fetchError }}</p>
                <NuxtLink to="/settings/roles" class="text-sm underline mt-2">Kembali ke List Role</NuxtLink>
            </div>

            <div v-if="errors.root" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 mb-6">
                {{ errors.root }}
            </div>

            <form v-if="!fetchError" @submit.prevent="handleSubmit" class="card-elevated p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Info -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Nama Role <span class="text-red-500">*</span></label>
                        <input v-model="form.name" type="text" placeholder="Contoh: Administrator" class="input-field"
                            :class="{ 'border-red-500': errors.name }" />
                        <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium">Kode Role <span class="text-red-500">*</span></label>
                        <input v-model="form.code" type="text" placeholder="Contoh: ADMIN" class="input-field uppercase"
                            :class="{ 'border-red-500': errors.code }" />
                        <p class="text-[10px] text-muted-foreground">Hanya huruf besar dan underscore (UNIQUE).</p>
                        <p v-if="errors.code" class="text-xs text-red-500">{{ errors.code }}</p>
                    </div>
                    <div class="col-span-1 md:col-span-2 space-y-2">
                        <label class="text-sm font-medium">Deskripsi</label>
                        <textarea v-model="form.description" rows="2"
                            placeholder="Deskripsi singkat tentang role ini..." class="input-field"></textarea>
                    </div>

                    <!-- Permissions Builder -->
                    <div class="col-span-1 md:col-span-2 pt-4 border-t border-border">
                        <div class="flex items-center justify-between mb-4">
                            <label class="text-sm font-medium">Permissions</label>
                            <button type="button" @click="addPermissionRow"
                                class="text-xs btn-secondary px-3 py-1 h-8 flex items-center">
                                <Plus class="w-3 h-3 mr-1" /> Add Permission
                            </button>
                        </div>

                        <div class="space-y-3 bg-muted/30 p-4 rounded-lg">
                            <div v-for="(perm, index) in permissionList" :key="index" class="flex gap-4 items-start">
                                <div class="flex-1 space-y-1">
                                    <input v-model="perm.resource" placeholder="Resource (ex: jobs, users)"
                                        class="input-field h-9 text-sm" />
                                </div>
                                <div class="flex-[2] space-y-1">
                                    <input v-model="perm.actions"
                                        placeholder="Actions (comma separated, ex: create, read, update)"
                                        class="input-field h-9 text-sm" />
                                </div>
                                <button type="button" @click="removePermissionRow(index)"
                                    class="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                                    title="Hapus baris">
                                    <X class="w-4 h-4" />
                                </button>
                            </div>
                            <p v-if="permissionList.length === 0"
                                class="text-sm text-muted-foreground text-center py-2">
                                Klik "Add Permission" untuk menambahkan hak akses.
                            </p>
                        </div>
                        <p class="text-xs text-muted-foreground mt-2">
                            Format: Resource adalah nama entitas. Actions dipisahkan koma (create, read, update,
                            delete).
                        </p>
                    </div>
                </div>

                <div class="flex justify-end items-center gap-6 pt-4 border-t border-border">
                    <NuxtLink to="/settings/roles" class="btn-secondary">Batal</NuxtLink>
                    <button type="submit" :disabled="isLoading" class="btn-primary">
                        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                        <Save v-else class="w-4 h-4 mr-2" />
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
