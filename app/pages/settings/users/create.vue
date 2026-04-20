<script setup lang="ts">
import { ArrowLeft, Save, Loader2 } from "lucide-vue-next";
import { z } from "zod";
import { toast } from "vue-sonner";
import type { Role } from "~/composables/useRoles";

definePageMeta({
  layout: "dashboard",
});

const router = useRouter();
const { createUser } = useAuth();
const isLoading = ref(false);

// Fetch roles eagerly on page load
const {
  data: roles,
  pending: isRolesLoading,
  error: rolesError,
  refresh: refreshRoles,
} = await useAsyncData<Role[]>(
  "roles-create",
  async () => await $fetch<Role[]>("/api/admin/roles"),
  {
    server: false,
  },
);

const formSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
    role: z.string().min(1, "Role wajib dipilih"),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak cocok",
    path: ["confirmPassword"],
  });

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  status: "active" as "active" | "inactive",
});

const errors = ref<Record<string, string>>({});

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
    const result = await createUser(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.role,
    );

    if (result.success) {
      toast.success("User berhasil dibuat");
      router.push("/settings/users");
    } else {
      toast.error(result.error || "Gagal membuat user.");
    }
  } catch (e) {
    const error = e as Error;
    toast.error(error.message || "Terjadi kesalahan sistem.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/settings/users" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Tambah User</h1>
          <p class="text-muted-foreground mt-1">Buat akun user baru</p>
        </div>
      </div>
    </div>

    <div
      v-if="rolesError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Gagal memuat daftar role. Silakan coba lagi.</span>
        <button class="btn-secondary" type="button" @click="refreshRoles()">Coba lagi</button>
      </div>
    </div>

    <div v-if="isRolesLoading" class="flex justify-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <form @submit.prevent="handleSubmit" class="card-elevated p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="text-sm font-medium">Nama</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nama lengkap"
            class="input-field"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            class="input-field"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="input-field"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Konfirmasi Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="input-field"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="text-xs text-red-500">
            {{ errors.confirmPassword }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Role</label>
          <select
            v-model="form.role"
            class="input-field"
            :class="{ 'border-red-500': errors.role }"
          >
            <option value="">Pilih role</option>
            <option v-for="role in roles" :key="role.id" :value="role.code">
              {{ role.name }}
            </option>
          </select>
          <p v-if="errors.role" class="text-xs text-red-500">{{ errors.role }}</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Status</label>
          <select v-model="form.status" class="input-field">
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end items-center gap-6 pt-4 border-t border-border">
        <NuxtLink to="/settings/users" class="btn-secondary">Batal</NuxtLink>
        <button type="submit" :disabled="isLoading" class="btn-primary">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>
