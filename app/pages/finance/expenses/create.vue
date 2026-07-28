<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  navigateTo("/finance/expenses");
});
</script>

<template>
  <div class="min-h-[400px]">
    <UiLoadingSkeleton variant="form" />
  </div>
</template>
