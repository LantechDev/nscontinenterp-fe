<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";

definePageMeta({
  layout: "default",
});

const router = useRouter();
const { login, listOrganizations, setActiveOrganization } = useAuth();
const showPassword = ref(false);
const isLoading = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const result = await login(email.value, password.value);

    if (result.success) {
      // Fetch organizations and set the first one as active
      const orgResult = await listOrganizations();
      if (orgResult.success && orgResult.data && orgResult.data.length > 0) {
        const firstOrg = orgResult.data[0];
        if (firstOrg?.id) {
          await setActiveOrganization(firstOrg.id);
        }
      }
      router.push("/dashboard");
    } else {
      errorMessage.value = "Login gagal. Periksa email dan password Anda.";
    }
  } catch (e) {
    errorMessage.value = "Terjadi kesalahan. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left side - branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"
      ></div>

      <div class="relative z-10 flex flex-col justify-center px-12 xl:px-20">
        <div class="flex items-center gap-4 mb-8">
          <div
            class="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm"
          >
            <img src="/favicon.png" alt="Logo" class="w-9 h-9" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">NSContinent</h1>
            <p class="text-white/70 text-sm">E-Report Finance</p>
          </div>
        </div>

        <div class="space-y-6 max-w-md">
          <h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Kelola Bisnis Logistik Anda dengan Mudah
          </h2>
          <p class="text-lg text-white/80">
            Sistem terintegrasi untuk operasional, penjualan, keuangan, dan pelaporan dalam satu
            platform.
          </p>

          <div class="grid grid-cols-2 gap-4 pt-6">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p class="text-3xl font-bold text-white">500+</p>
              <p class="text-sm text-white/70">Job Selesai</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p class="text-3xl font-bold text-white">150+</p>
              <p class="text-sm text-white/70">Customer Aktif</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
      ></div>
      <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
    </div>

    <!-- Right side - login form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
      <div class="w-full max-w-md space-y-8 animate-fade-in">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div
            class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary/20 backdrop-blur-sm"
          >
            <img src="/favicon.png" alt="Logo" class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-foreground">Lantech</h1>
            <p class="text-xs text-muted-foreground">E-Report Finance</p>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <h2 class="text-2xl font-bold text-foreground">Selamat Datang</h2>
          <p class="text-muted-foreground mt-2">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <div
          v-if="errorMessage"
          class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200"
        >
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="nama@perusahaan.com"
              class="input-field"
              required
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-foreground">
                Password
              </label>
              <button type="button" class="text-sm text-accent hover:text-accent/80 font-medium">
                Lupa Password?
              </button>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input-field pr-12"
                required
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              class="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label for="remember" class="text-sm text-muted-foreground">
              Ingat saya di perangkat ini
            </label>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full btn-primary h-12 text-base">
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span v-else>Masuk</span>
          </button>
        </form>

        <p class="text-center text-sm text-muted-foreground">
          Belum punya akun?
          <button class="text-accent hover:text-accent/80 font-medium">
            Hubungi Administrator
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
