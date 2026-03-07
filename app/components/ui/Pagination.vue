<script setup lang="ts">
/**
 * Reusable Pagination Component
 * Custom implementation using Tailwind CSS (no external UI library dependency)
 */

interface Props {
  page?: number;
  total: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  itemsPerPage: 10,
  maxVisiblePages: 5,
});

const emit = defineEmits<{
  "update:page": [page: number];
}>();

// Calculate total pages
const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage));

// Calculate visible page range
const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = props.page;
  const maxVisible = props.maxVisiblePages;

  if (total <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Calculate start and end of visible range
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (end < total) {
      if (end < total - 1) {
        pages.push("...");
      }
      pages.push(total);
    }
  }

  return pages;
});

// Check if navigation is possible
const canGoPrevious = computed(() => props.page > 1);
const canGoNext = computed(() => props.page < totalPages.value);

// Handle page change
const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value && newPage !== props.page) {
    emit("update:page", newPage);
  }
};

const goToPrevious = () => {
  if (canGoPrevious.value) {
    emit("update:page", props.page - 1);
  }
};

const goToNext = () => {
  if (canGoNext.value) {
    emit("update:page", props.page + 1);
  }
};

// Helper to check if page is a number (not ellipsis)
const isPageNumber = (p: number | string): p is number => typeof p === "number";
</script>

<template>
  <nav class="flex items-center gap-1" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      :disabled="!canGoPrevious"
      class="px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors"
      :class="[
        canGoPrevious
          ? 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed',
      ]"
      aria-label="Previous page"
      @click="goToPrevious"
    >
      Previous
    </button>

    <!-- Page Numbers -->
    <template v-for="(p, index) in visiblePages" :key="index">
      <!-- Ellipsis -->
      <span v-if="!isPageNumber(p)" class="px-2 py-1.5 text-sm text-gray-400">
        {{ p }}
      </span>

      <!-- Page Number -->
      <button
        v-else
        class="px-3 py-1.5 text-sm font-medium rounded-md border transition-colors"
        :class="[
          p === page
            ? 'bg-[#012D5A] text-white border-[#012D5A]'
            : 'bg-white text-gray-700 border-border hover:bg-gray-50 hover:text-gray-900',
        ]"
        :aria-current="p === page ? 'page' : undefined"
        @click="handlePageChange(p)"
      >
        {{ p }}
      </button>
    </template>

    <!-- Next Button -->
    <button
      :disabled="!canGoNext"
      class="px-3 py-1.5 text-sm font-medium rounded-md border border-border transition-colors"
      :class="[
        canGoNext
          ? 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed',
      ]"
      aria-label="Next page"
      @click="goToNext"
    >
      Next
    </button>
  </nav>
</template>
