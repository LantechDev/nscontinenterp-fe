<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/reports/profit-loss");
    },
  ],
});
</script>

<template>
  <div>Redirecting to Profit & Loss...</div>
</template>
