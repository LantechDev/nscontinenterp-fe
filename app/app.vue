<script setup lang="ts">
import "vue-sonner/style.css";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ClientOnly>
      <UiToaster position="bottom-right" richColors />
    </ClientOnly>
    <!-- Nuxt Loading Indicator - handles page transitions automatically -->
    <NuxtLoadingIndicator color="#012D5A" :height="3" :duration="2000" />

    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
