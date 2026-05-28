<script setup lang="ts">
import { ArrowLeft, Save, Loader2 } from "lucide-vue-next";
import { z } from "zod";
import { PermissionsTable } from "./components";
import type { AccessLevel } from "~/lib/permission-registry";

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
      /^[a-zA-Z0-9_\-\s]+$/,
      "Kode hanya boleh berisi huruf, angka, spasi, strip, dan underscore",
    ),
  description: z.string().optional(),
});

const form = ref({
  name: "",
  code: "",
  description: "",
  permissions: {} as Record<string, AccessLevel>,
});

// Auto-format code input
watch(
  () => form.value.code,
  (newVal) => {
    if (newVal) {
      let formatted = newVal
        .toUpperCase()
        .replace(/[\s-]/g, "_")
        .replace(/[^A-Z0-9_]/g, "");
      if (newVal !== formatted) {
        form.value.code = formatted;
      }
    }
  },
);

const errors = ref<Record<string, string>>({});

const setPermissionLevel = (feature: string, level: AccessLevel) => {
  if (level === "none") {
    delete form.value.permissions[feature];
  } else {
    form.value.permissions[feature] = level;
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
    const result = await createRole({
      name: form.value.name,
      code: form.value.code,
      description: form.value.description,
      permissions: form.value.permissions,
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
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/settings/roles" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Tambah Role</h1>
          <p class="text-muted-foreground mt-1">Buat role baru dengan permission khusus</p>
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
          <label class="text-sm font-medium">Nama Role <span class="text-red-500">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Contoh: Administrator"
            class="input-field"
            :class="{ 'border-red-500': errors.name }"
            v-uppercase
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Kode Role <span class="text-red-500">*</span></label>
          <input
            v-model="form.code"
            type="text"
            placeholder="Contoh: ADMIN"
            class="input-field uppercase"
            :class="{ 'border-red-500': errors.code }"
            v-uppercase
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
            v-uppercase
          ></textarea>
        </div>

        <!-- Permissions Builder -->
        <div class="col-span-1 md:col-span-2 pt-4 border-t border-border">
          <div class="flex items-center justify-between mb-4">
            <label class="text-sm font-medium">Permissions</label>
          </div>

          <PermissionsTable :permissions="form.permissions" @update="setPermissionLevel" />
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
