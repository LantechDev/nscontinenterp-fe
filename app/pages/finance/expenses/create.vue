<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  navigateTo("/finance/expenses");
});
</script>

<template>
  <div class="flex items-center justify-center min-h-[400px]">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
  </div>
</template>
