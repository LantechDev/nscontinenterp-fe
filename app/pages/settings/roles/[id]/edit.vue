<script setup lang="ts">
import { ArrowLeft, Save, Loader2 } from "lucide-vue-next";
import { z } from "zod";
import { PermissionsTable } from "../components";

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
  code: z
    .string()
    .min(1, "Kode Role wajib diisi")
    .regex(/^[A-Z0-9_]+$/, "Kode harus huruf besar, angka, dan underscore (contoh: ADMIN_USER)"),
  description: z.string().optional(),
});

const form = ref({
  name: "",
  code: "",
  description: "",
  permissions: {} as Record<string, string[]>,
});

const handleCodeInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.toUpperCase();
  value = value.replace(/[\s-]/g, "_").replace(/[^A-Z0-9_]/g, "");
  form.value.code = value;
};

const availableActions = ["create", "read", "update", "delete"];

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

const toggleAll = (resource: string) => {
  const isAll =
    form.value.permissions[resource] &&
    form.value.permissions[resource].length === availableActions.length;
  if (isAll) {
    form.value.permissions[resource] = [];
  } else {
    form.value.permissions[resource] = [...availableActions];
  }
};

onMounted(async () => {
  try {
    await fetchRoles();
    const existingRole = roles.value.find((r) => r.id === roleId);
    if (existingRole) {
      form.value = {
        name: existingRole.name,
        code: existingRole.code,
        description: existingRole.description || "",
        permissions: existingRole.permissions || {},
      };
    } else {
      fetchError.value = "Role tidak ditemukan.";
    }
  } catch (e) {
    const error = e as Error;
    fetchError.value = error.message || "Gagal memuat data role.";
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

  isLoading.value = true;
  try {
    const cleanPermissions: Record<string, string[]> = {};
    for (const [key, actions] of Object.entries(form.value.permissions)) {
      if (actions.length > 0) {
        cleanPermissions[key] = actions;
      }
    }

    const result = await updateRole(roleId, {
      name: form.value.name,
      code: form.value.code,
      description: form.value.description,
      permissions: cleanPermissions,
    });

    if (result.success) {
      router.push("/settings/roles");
    } else {
      const updateResult = result as { success: boolean; error?: string };
      errors.value.root = updateResult.error || "Gagal mengupdate role.";
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
  <div class="space-y-6 animate-fade-in p-6">
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
      <div
        v-if="fetchError"
        class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200"
      >
        <p class="font-medium">Error:</p>
        <p>{{ fetchError }}</p>
        <NuxtLink to="/settings/roles" class="text-sm underline mt-2"
          >Kembali ke List Role</NuxtLink
        >
      </div>

      <div
        v-if="errors.root"
        class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 mb-6"
      >
        {{ errors.root }}
      </div>

      <form v-if="!fetchError" @submit.prevent="handleSubmit" class="card-elevated p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium">Nama Role <span class="text-red-500">*</span></label>
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
            <label class="text-sm font-medium">Kode Role <span class="text-red-500">*</span></label>
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

          <div class="col-span-1 md:col-span-2 pt-4 border-t border-border">
            <div class="flex items-center justify-between mb-4">
              <label class="text-sm font-medium">Permissions</label>
            </div>
            <PermissionsTable
              :permissions="form.permissions"
              :available-actions="availableActions"
              :available-resources="availableResources"
              @toggle="togglePermission"
              @toggle-all="toggleAll"
            />
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
