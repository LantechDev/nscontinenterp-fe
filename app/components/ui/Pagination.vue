<script setup lang="ts">
/**
 * Reusable Pagination Component
 * Wraps Nuxt UI's UPagination with project-specific defaults
 */

interface Props {
  page?: number;
  total: number;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  itemsPerPage: 10,
});

const emit = defineEmits<{
  "update:page": [page: number];
}>();

// Handle page change
const handlePageChange = (newPage: number) => {
  emit("update:page", newPage);
};
</script>

<template>
  <UPagination
    :model-value="page"
    :total="total"
    :items-per-page="itemsPerPage"
    color="primary"
    variant="outline"
    size="sm"
    :sibling-count="1"
    show-edges
    @update:model-value="handlePageChange"
  />
</template>
