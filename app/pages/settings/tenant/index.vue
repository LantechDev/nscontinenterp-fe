<script setup lang="ts">
import { Save, Loader2, Building, MapPin, Phone, Mail, FileText } from "lucide-vue-next";
import { z } from "zod";

definePageMeta({
  layout: "dashboard",
});

const {
  session,
  fetchSession,
  updateOrganization,
  createOrganization,
  setActiveOrganization,
  isLoading: isAuthLoading,
} = useAuth();
const { confirm } = useConfirm();
const isLoading = ref(false);
const errorRoot = ref("");
const successMessage = ref("");
const isEditing = ref(false);
const logoPreviewError = ref(false);

// Form Schema
const formSchema = z.object({
  name: z.string().min(1, "Nama Tenant wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  logo: z.string().optional(),
  // Metadata fields
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  taxId: z.string().optional(),
});

const form = ref({
  name: "",
  slug: "",
  logo: "",
  address: "",
  phone: "",
  email: "",
  taxId: "",
});

const errors = ref<Record<string, string>>({});

const initData = async () => {
  if (form.value.name) return;

  isLoading.value = true;
  try {
    const { listOrganizations } = useAuth();
    const res = await listOrganizations();

    if (res.success && res.data) {
      const activeOrgId = session.value?.activeOrganizationId;
      const org = res.data.find((o) => o.id === activeOrgId);

      if (org) {
        form.value = {
          name: org.name,
          slug: org.slug || "",
          logo: org.logo || "",
          address: org.metadata?.address || "",
          phone: org.metadata?.phone || "",
          email: org.metadata?.email || "",
          taxId: org.metadata?.taxId || "",
        };
        logoPreviewError.value = false;
      }
    }
  } catch (e) {
    console.error("Failed to load organization data", e);
  } finally {
    isLoading.value = false;
  }
};

// Initialize form from session
watchEffect(() => {
  // Check if we have an active organization to decide mode
  if (session.value?.activeOrganizationId) {
    isEditing.value = true;
    initData();
  } else {
    isEditing.value = false;
  }
});

watch(
  () => form.value.name,
  (newName) => {
    // Sync slug with name if creating new or if slug is currently empty
    if (!isEditing.value || !form.value.slug) {
      form.value.slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
  },
);

watch(
  () => form.value.logo,
  () => {
    logoPreviewError.value = false;
  },
);

const handleSubmit = async () => {
  errors.value = {};
  successMessage.value = "";
  errorRoot.value = "";

  console.log("TenantSettings: handleSubmit triggered", { isEditing: isEditing.value });

  const validation = formSchema.safeParse(form.value);
  if (!validation.success) {
    console.warn("TenantSettings: Validation failed", validation.error);
    validation.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message;
      }
    });
    return;
  }

  const isConfirmed = await confirm({
    title: isEditing.value ? "Simpan Perubahan?" : "Buat Tenant Baru?",
    message: isEditing.value
      ? "Apakah Anda yakin ingin menyimpan perubahan pada profil Tenant ini?"
      : "Apakah Anda yakin ingin membuat tenant baru ini?",
    confirmText: isEditing.value ? "Ya, Simpan" : "Ya, Buat",
    cancelText: "Batal",
    type: "info",
  });

  if (!isConfirmed) {
    console.log("TenantSettings: Confirmation cancelled");
    return;
  }

  isLoading.value = true;

  try {
    const activeOrgId = session.value?.activeOrganizationId;

    const payload = {
      name: form.value.name,
      slug: form.value.slug,
      logo: form.value.logo || undefined, // Send undefined if empty to avoid URL validation issues if any
      metadata: {
        address: form.value.address,
        phone: form.value.phone,
        email: form.value.email,
        taxId: form.value.taxId,
      },
    };

    let result;

    if (isEditing.value) {
      if (!activeOrgId) throw new Error("Tidak ada organisasi yang aktif untuk diedit");
      console.log("TenantSettings: Updating tenant", payload);
      result = await updateOrganization(activeOrgId, payload);
    } else {
      console.log("TenantSettings: Creating tenant", payload);
      result = await createOrganization(payload);
    }

    console.log("TenantSettings: Result", result);

    if (result.success) {
      successMessage.value = isEditing.value
        ? "Data tenant berhasil diperbarui."
        : "Tenant berhasil dibuat.";

      // If created, set active?
      if (!isEditing.value && result.data?.id) {
        await setActiveOrganization(result.data.id);
        // After setting active, page might reload or session update might trigger watchEffect
        // But let's verify
      } else {
        await fetchSession();
      }
    } else {
      errorRoot.value =
        result.error || (isEditing.value ? "Gagal mengupdate tenant." : "Gagal membuat tenant.");
    }
  } catch (e) {
    const error = e as Error;
    console.error("TenantSettings: Error", error);
    errorRoot.value = error.message || "Terjadi kesalahan sistem.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Tenant Settings</h1>
        <p class="text-muted-foreground mt-1">
          Kelola informasi perusahaan dan profil organisasi Anda.
        </p>
      </div>
    </div>

    <div
      v-if="successMessage"
      class="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200"
    >
      {{ successMessage }}
    </div>

    <div v-if="errorRoot" class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
      {{ errorRoot }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- General Info -->
      <div class="card-elevated p-6">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div
            class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]"
          >
            <Building class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold">Informasi Umum</h2>
            <p class="text-sm text-muted-foreground">Profil dasar organisasi</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium"
              >Nama Tenant <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: NS Continent"
              class="input-field"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Slug <span class="text-red-500">*</span></label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="ns-continent"
              class="input-field bg-muted/50"
              :class="{ 'border-red-500': errors.slug }"
              readonly
              title="Slug digunakan untuk identifikasi URL"
            />
            <p v-if="errors.slug" class="text-xs text-red-500">{{ errors.slug }}</p>
            <p class="text-[10px] text-muted-foreground">
              Slug digunakan untuk identifikasi URL dan sistem. (Auto-generated & Read-only)
            </p>
          </div>
          <div class="col-span-1 md:col-span-2 space-y-2">
            <label class="text-sm font-medium">Logo URL</label>
            <div class="flex gap-4 items-center">
              <div
                v-if="form.logo && !logoPreviewError"
                class="w-12 h-12 rounded border border-border overflow-hidden bg-white flex-shrink-0"
              >
                <img
                  :src="form.logo"
                  alt="Logo"
                  class="h-full w-full object-contain"
                  @error="logoPreviewError = true"
                />
              </div>
              <div
                v-else-if="form.logo"
                class="w-12 h-12 rounded border border-dashed border-border bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground text-center px-1"
              >
                Invalid image
              </div>
              <input
                v-model="form.logo"
                type="text"
                placeholder="https://..."
                class="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="card-elevated p-6">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div
            class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#012D5A]"
          >
            <MapPin class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold">Kontak & Alamat</h2>
            <p class="text-sm text-muted-foreground">Informasi detail untuk dokumen dan footer</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-1 md:col-span-2 space-y-2">
            <label class="text-sm font-medium">Alamat Lengkap</label>
            <textarea
              v-model="form.address"
              rows="3"
              placeholder="Jl. Raya..."
              class="input-field"
            ></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium flex items-center gap-2">
              <Phone class="w-3.5 h-3.5" /> Telepon
            </label>
            <input v-model="form.phone" type="text" placeholder="+62..." class="input-field" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium flex items-center gap-2">
              <Mail class="w-3.5 h-3.5" /> Email Resmi
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="contact@company.com"
              class="input-field"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium flex items-center gap-2">
              <FileText class="w-3.5 h-3.5" /> Tax ID (NPWP)
            </label>
            <input
              v-model="form.taxId"
              type="text"
              placeholder="XX.XXX.XXX.X-XXX.XXX"
              class="input-field"
            />
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="flex justify-end pt-4">
        <button type="submit" :disabled="isLoading" class="btn-primary min-w-[150px]">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          {{ isEditing ? "Simpan Perubahan" : "Buat Tenant" }}
        </button>
      </div>
    </form>
  </div>
</template>
