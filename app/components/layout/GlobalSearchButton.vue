<script setup lang="ts">
import { Search } from "lucide-vue-next";

defineProps<{
  /** compact = icon + shortcut only (for page headers); default = full search bar (header) */
  compact?: boolean;
}>();

const { open } = useGlobalSearch();

const isMac = ref(false);
const shortcutKey = computed(() => (isMac.value ? "⌘" : "Ctrl"));
onMounted(() => {
  isMac.value = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
});
</script>

<template>
  <!-- Compact variant: a real (fixed-width) search bar for pages with a custom header -->
  <button
    v-if="compact"
    type="button"
    class="flex items-center gap-2 w-64 max-w-full px-3 py-2 text-sm text-left border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
    @click="open"
  >
    <Search class="w-4 h-4 shrink-0 text-gray-400" />
    <span class="flex-1 truncate text-gray-400">Cari job, quotation, customer...</span>
    <span class="flex items-center gap-0.5 shrink-0">
      <kbd
        class="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-semibold leading-none text-gray-400"
        >{{ shortcutKey }}</kbd
      >
      <kbd
        class="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-semibold leading-none text-gray-400"
        >K</kbd
      >
    </span>
  </button>

  <!-- Bar variant: for the main dashboard header -->
  <button
    v-else
    type="button"
    class="relative flex items-center gap-2 w-full pl-10 pr-3 py-2 text-sm text-left border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
    @click="open"
  >
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <span class="flex-1 truncate text-gray-400">Cari job, quotation, customer, invoice...</span>
    <span class="flex items-center gap-0.5 shrink-0">
      <kbd
        class="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-semibold leading-none text-gray-400"
        >{{ shortcutKey }}</kbd
      >
      <kbd
        class="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-semibold leading-none text-gray-400"
        >K</kbd
      >
    </span>
  </button>
</template>
