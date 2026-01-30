<script setup lang="ts">
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-vue-next";
import { z } from "zod";

definePageMeta({
    layout: "dashboard",
});

const router = useRouter();
const { createRole } = useRoles();
const isLoading = ref(false);

const formSchema = z.object({
    name: z.string().min(1, "Nama Role wajib diisi"),
    code: z
        .string()
        .min(1, "Kode Role wajib diisi")
        .regex(
            /^[A-Z0-9_]+$/,
            "Kode harus huruf besar, angka, dan underscore (contoh: ADMIN_USER)"
        ),
    description: z.string().optional(),
});

const form = ref({
    name: "",
    code: "",
    description: "",
    permissions: {} as Record<string, string[]>,
});

// Auto-format code input
const handleCodeInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase();
    // Replace spaces and hyphens with underscores, remove other non-allowed chars
    value = value.replace(/[\s-]/g, "_").replace(/[^A-Z0-9_]/g, "");
    form.value.code = value;
};

const availableActions = ["create", "read", "update", "delete"] as const;

type AvailableResourceKey = (typeof availableResources)[number]["key"];

const availableResources = [
    { key: "organization", label: "Organization", description: "Manage company settings" },
    { key: "member", label: "Member", description: "Manage team members" },
    { key: "invitation", label: "Invitation", description: "Manage invites" },
    { key: "job", label: "Job", description: "Operational jobs" },
    { key: "invoice", label: "Invoice", description: "Financial invoices" },
    { key: "payment", label: "Payment", description: "Payment records" },
    { key: "company", label: "Company", description: "Master data companies" },
    { key: "report", label: "Report", description: "View analytical reports" },
];

const errors = ref<Record<string, string>>({});

const hasPermission = (resource: string, action: string) => {
    return form.value.permissions[resource]?.includes(action) || false;
};

const togglePermission = (resource: string, action: string) => {
    if (!form.value.permissions[resource]) {
        form.value.permissions[resource] = [];
    }

    const actions = form.value.permissions[resource];
    if (actions.includes(action)) {
        form.value.permissions[resource] = actions.filter((a) => a !== action);
    } else {
        form.value.permissions[resource].push(action);
    }
};

const isAllSelected = (resource: string) => {
    const current = form.value.permissions[resource];
    return current && current.length === availableActions.length;
};

const toggleAll = (resource: string) => {
    if (isAllSelected(resource)) {
        form.value.permissions[resource] = [];
    } else {
        form.value.permissions[resource] = [...availableActions];
    }
};

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

    isLoading.value = true;

    try {
        // Filter out empty permission arrays to keep it clean
        const cleanPermissions: Record<string, string[]> = {};
        for (const [key, actions] of Object.entries(form.value.permissions)) {
            if (actions.length > 0) {
                cleanPermissions[key] = actions;
            }
        }

        const result = await createRole({
            name: form.value.name,
            code: form.value.code,
            description: form.value.description,
            permissions: cleanPermissions,
        });

        if (result.success) {
            router.push("/settings/roles");
        } else {
            errors.value.root = result.error || "Gagal membuat role.";
        }
    } catch (e) {
        const error = e as Error;
        errors.value.root = error.message || "Terjadi kesalahan sistem.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="space-y-6 animate-fade-in">
        <div class="page-header">
            <div class="flex items-center gap-4">
                <NuxtLink
                    to="/settings/roles"
                    class="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <ArrowLeft class="w-5 h-5" />
                </NuxtLink>
                <div>
                    <h1 class="page-title">Tambah Role</h1>
                    <p class="text-muted-foreground mt-1">
                        Buat role baru dengan permission khusus
                    </p>
                </div>
            </div>
        </div>

        <div
            v-if="errors.root"
            class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200"
        >
            {{ errors.root }}
        </div>

        <form @submit.prevent="handleSubmit" class="card-elevated p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Info -->
                <div class="space-y-2">
                    <label class="text-sm font-medium"
                        >Nama Role <span class="text-red-500">*</span></label
                    >
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Contoh: Administrator"
                        class="input-field"
                        :class="{ 'border-red-500': errors.name }"
                    />
                    <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium"
                        >Kode Role <span class="text-red-500">*</span></label
                    >
                    <input
                        :value="form.code"
                        @input="handleCodeInput"
                        type="text"
                        placeholder="Contoh: ADMIN"
                        class="input-field uppercase"
                        :class="{ 'border-red-500': errors.code }"
                    />
                    <p class="text-[10px] text-muted-foreground">
                        Hanya huruf besar, angka, dan underscore (UNIQUE).
                    </p>
                    <p v-if="errors.code" class="text-xs text-red-500">{{ errors.code }}</p>
                </div>
                <div class="col-span-1 md:col-span-2 space-y-2">
                    <label class="text-sm font-medium">Deskripsi</label>
                    <textarea
                        v-model="form.description"
                        rows="2"
                        placeholder="Deskripsi singkat tentang role ini..."
                        class="input-field"
                    ></textarea>
                </div>

                <!-- Permissions Builder -->
                <div class="col-span-1 md:col-span-2 pt-4 border-t border-border">
                    <div class="flex items-center justify-between mb-4">
                        <label class="text-sm font-medium">Permissions</label>
                    </div>

                    <div class="border border-border rounded-lg overflow-hidden bg-white">
                        <table class="w-full text-sm">
                            <thead class="bg-gray-50 border-b border-border">
                                <tr>
                                    <th
                                        class="text-left py-3 px-4 font-medium text-muted-foreground w-1/3"
                                    >
                                        Resource
                                    </th>
                                    <th
                                        v-for="action in availableActions"
                                        :key="action"
                                        class="text-center py-3 px-4 font-medium text-muted-foreground capitalize"
                                    >
                                        {{ action }}
                                    </th>
                                    <th
                                        class="text-center py-3 px-4 font-medium text-muted-foreground"
                                    >
                                        All
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(resource, index) in availableResources"
                                    :key="resource.key"
                                    class="border-b border-border last:border-0 hover:bg-gray-50/50 transition-colors"
                                >
                                    <td class="py-3 px-4">
                                        <div class="font-medium text-foreground">
                                            {{ resource.label }}
                                        </div>
                                        <div class="text-xs text-muted-foreground">
                                            {{ resource.description }}
                                        </div>
                                    </td>
                                    <td
                                        v-for="action in availableActions"
                                        :key="action"
                                        class="text-center py-3 px-4"
                                    >
                                        <div class="flex justify-center">
                                            <UiCheckbox
                                                :model-value="hasPermission(resource.key, action)"
                                                @update:model-value="
                                                    togglePermission(resource.key, action)
                                                "
                                            />
                                        </div>
                                    </td>
                                    <td class="text-center py-3 px-4">
                                        <div class="flex justify-center">
                                            <UiCheckbox
                                                :model-value="isAllSelected(resource.key)"
                                                @update:model-value="toggleAll(resource.key)"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="text-xs text-muted-foreground mt-2">
                        Configure what this role can do for each resource in the system.
                    </p>
                </div>
            </div>

            <div class="flex justify-end items-center gap-6 pt-4 border-t border-border">
                <NuxtLink to="/settings/roles" class="btn-secondary">Batal</NuxtLink>
                <button type="submit" :disabled="isLoading" class="btn-primary">
                    <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                    <Save v-else class="w-4 h-4 mr-2" />
                    Simpan Role
                </button>
            </div>
        </form>
    </div>
</template>
