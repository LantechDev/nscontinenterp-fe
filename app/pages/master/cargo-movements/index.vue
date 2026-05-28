<script setup lang="ts">
import MovementTypesPage from "../components/MovementTypesPage.vue";

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <MovementTypesPage
    kind="cargo"
    title="Cargo Movement"
    singular-label="Cargo Movement"
    search-placeholder="Search Cargo Movement..."
  />
</template>
