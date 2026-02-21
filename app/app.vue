<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Nuxt Loading Indicator - handles page transitions automatically -->
    <NuxtLoadingIndicator color="#012D5A" :height="3" :duration="2000" />

    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
