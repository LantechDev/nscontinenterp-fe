<script setup lang="ts">
// Index page - redirect to login or dashboard
definePageMeta({
  layout: "default",
});

const router = useRouter();

onMounted(() => {
  // TODO: Check authentication state
  // For now, redirect to login
  router.push("/login");
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-pulse">
      <p class="text-muted-foreground">Memuat...</p>
    </div>
  </div>
</template>
