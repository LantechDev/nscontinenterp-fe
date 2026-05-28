<script setup lang="ts">
import MovementTypesPage from "../components/MovementTypesPage.vue";

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <MovementTypesPage
    kind="delivery"
    title="Delivery Movement"
    singular-label="Delivery Movement"
    search-placeholder="Search Delivery Movement..."
  />
</template>
