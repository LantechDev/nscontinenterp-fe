<script setup lang="ts">
import { ArrowLeft, Edit, User, Shield } from "lucide-vue-next";
import type { User as AuthUser } from "~/types/auth";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
  status: string;
  lastLogin: string;
  createdAt: string;
}

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const userId = route.params.id as string;
const { fetchUserById } = useAuth();

const user = ref<DisplayUser | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
  try {
    const result = await fetchUserById(userId);
    if (result.success && result.data) {
      const u = result.data.user || result.data; // adjust based on actual response structure
      user.value = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.banned ? "inactive" : "active",
        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "-",
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-",
      } as DisplayUser;
    } else {
      errorMessage.value = result.error || "Gagal mengambil data user.";
    }
  } catch (e) {
    const error = e as Error;
    errorMessage.value = error.message || "Terjadi kesalahan.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/settings/users" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ user?.name || "Loading..." }}</h1>
          <p class="text-muted-foreground mt-1">Detail user</p>
        </div>
      </div>
      <NuxtLink
        :to="`/settings/users/${userId}/edit`"
        class="btn-primary"
        :class="{ 'opacity-50 pointer-events-none': isLoading || !user }"
      >
        <Edit class="w-4 h-4 mr-2" />
        Edit
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-muted-foreground">Loading...</div>

    <div
      v-else-if="errorMessage"
      class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200"
    >
      {{ errorMessage }}
    </div>

    <div v-else-if="user" class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <User class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ user.name }}</h2>
          <p class="text-muted-foreground">{{ user.email }}</p>
        </div>
        <span
          :class="[
            'ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            user.status === 'active' ? 'badge-success' : 'bg-muted text-muted-foreground',
          ]"
        >
          {{ user.status === "active" ? "Aktif" : "Tidak Aktif" }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Role</p>
          <p class="font-medium flex items-center gap-2">
            <Shield class="w-4 h-4 text-accent" />
            {{ user.role }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Status</p>
          <p class="font-medium">
            {{ user.status === "active" ? "Aktif" : "Tidak Aktif" }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Login Terakhir</p>
          <p class="font-medium">{{ user.lastLogin }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Tanggal Dibuat</p>
          <p class="font-medium">{{ user.createdAt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
