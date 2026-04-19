<script setup lang="ts">
import { ArrowLeft, Save, Loader2, Trash2, AlertTriangle } from "lucide-vue-next";
import { z } from "zod";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;
const { adminUpdateUser, deleteUser } = useAuth();
const { roles } = useRoles();
const isLoading = ref(false);

interface UserResponseData {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      banned: boolean;
      createdAt?: string;
      lastLogin?: string;
    };
  };
  error?: string;
}

// Fetch roles and user data in parallel
const { data: rolesData } = await useAsyncData<{ roles: Role[]; user: UserResponseData }>(
  `user-edit-${userId}`,
  async () => {
    const [rolesResponse, userResponse] = await Promise.all([
      $fetch<Role[]>("/api/admin/roles"),
      $fetch<UserResponseData>(`/api/auth/users/${userId}`),
    ]);
    return { roles: rolesResponse, user: userResponse };
  },
);

const userData = computed(() => rolesData.value?.user?.data?.user);
const isFetching = computed(() => !rolesData.value);
const fetchError = computed(() => "");

// Schema differs slightly from create: password is optional
const formSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    role: z.string().min(1, "Role wajib dipilih"),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password dan Konfirmasi Password tidak cocok",
      path: ["confirmPassword"],
    },
  );

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  status: "active" as "active" | "inactive",
});

const errors = ref<Record<string, string>>({});

watch(
  () => userData.value,
  (user) => {
    if (user) {
      form.value = {
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || "",
        status: user.banned === true ? "inactive" : "active",
      };
    }
  },
  { immediate: true },
);

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
    const updateData: Record<string, unknown> = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      banned: form.value.status === "inactive",
    };

    if (form.value.password) {
      updateData.password = form.value.password;
    }

    const result = await adminUpdateUser(userId, updateData);

    if (result.success) {
      toast.success("User berhasil diupdate");
      router.push(`/settings/users/${userId}`);
    } else {
      toast.error(result.error || "Gagal mengupdate user.");
    }
  } catch (e) {
    const error = e as Error;
    toast.error(error.message || "Terjadi kesalahan sistem.");
  } finally {
    isLoading.value = false;
  }
};

const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success("User berhasil dihapus", { duration: 3000 });
      router.push("/settings/users");
    } else {
      toast.error(result.error || "Gagal menghapus user.");
      showDeleteConfirm.value = false;
    }
  } catch (e) {
    const error = e as Error;
    toast.error(error.message || "Terjadi kesalahan sistem.");
    showDeleteConfirm.value = false;
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink
          :to="`/settings/users/${userId}`"
          class="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">Edit User</h1>
          <p class="text-muted-foreground mt-1">Edit informasi user</p>
        </div>
      </div>

      <button type="button" @click="showDeleteConfirm = true" class="btn-destructive">
        <Trash2 class="w-4 h-4 mr-2" />
        Hapus User
      </button>
    </div>

    <div v-if="isFetching" class="p-12 text-center">
      <Loader2 class="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
      <p class="mt-2 text-muted-foreground">Loading user data...</p>
    </div>

    <div v-else>
      <div
        v-if="fetchError"
        class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200"
      >
        <p class="font-medium">Error:</p>
        <p>{{ fetchError }}</p>
        <button @click="router.go(0)" class="text-sm underline mt-2">Coba lagi/Refresh</button>
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

          <div class="col-span-1 md:col-span-2 border-t pt-4 mt-2">
            <p class="text-sm font-medium mb-4 text-muted-foreground">Ubah Password (Optional)</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium">Password Baru</label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Biarkan kosong jika tidak diubah"
                  class="input-field"
                  :class="{ 'border-red-500': errors.password }"
                />
                <p v-if="errors.password" class="text-xs text-red-500">
                  {{ errors.password }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Konfirmasi Password</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Ulangi password baru"
                  class="input-field"
                  :class="{ 'border-red-500': errors.confirmPassword }"
                />
                <p v-if="errors.confirmPassword" class="text-xs text-red-500">
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </div>
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
          <NuxtLink :to="`/settings/users/${userId}`" class="btn-secondary">Batal</NuxtLink>
          <button type="submit" :disabled="isLoading" class="btn-primary">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            <Save v-else class="w-4 h-4 mr-2" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 animate-fade-in"
  >
    <div class="bg-background rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
      <div class="flex items-center gap-3 text-red-600 mb-4">
        <div class="p-2 bg-red-100 rounded-full">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-semibold">Hapus User?</h3>
      </div>
      <p class="text-muted-foreground mb-6">
        Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="showDeleteConfirm = false"
          class="btn-secondary"
          :disabled="isDeleting"
        >
          Batal
        </button>
        <button type="button" @click="handleDelete" class="btn-destructive" :disabled="isDeleting">
          <Loader2 v-if="isDeleting" class="w-4 h-4 mr-2 animate-spin" />
          <span v-else>Ya, Hapus</span>
        </button>
      </div>
    </div>
  </div>
</template>
