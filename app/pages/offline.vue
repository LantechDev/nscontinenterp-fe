<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Offline - NS Continent ERP",
});

const handleReload = (): void => {
  if (import.meta.client) {
    window.location.reload();
  }
};
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-gradient-primary/15 flex items-center justify-center">
          <NuxtImg src="/pwa/icon-192x192.png" alt="App icon" class="h-6 w-6" />
        </div>
        <div>
          <h1 class="text-lg font-semibold text-foreground">Kamu sedang offline</h1>
          <p class="text-sm text-muted-foreground">Periksa koneksi internet lalu coba lagi.</p>
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-3">
        <button type="button" class="btn-primary h-11 w-full" @click="handleReload">
          Muat ulang
        </button>
        <NuxtLink to="/login" class="w-full text-center text-sm text-accent hover:text-accent/80">
          Kembali ke Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
