<script setup lang="ts">
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { Check, ChevronsUpDown, Loader2 } from "lucide-vue-next";

export interface SearchSelectOption {
  id: string;
  name?: string;
  label?: string;
  [key: string]: unknown;
}

export interface SearchSelectFetchOptions {
  query: string;
  page?: number;
  limit?: number;
}

export type SearchSelectFetchFn = (
  options: SearchSelectFetchOptions,
) => Promise<{ success: boolean; data?: SearchSelectOption[]; error?: string }>;

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  labelKey?: string;
  valueKey?: string;
  fetchOptions?: SearchSelectFetchFn;
  initialOptions?: SearchSelectOption[];
  formatDisplay?: (option: SearchSelectOption) => string;
  debounceMs?: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Fetched options for async mode
const fetchedOptions = ref<SearchSelectOption[]>([]);
const isLoading = ref(false);
const hasFetched = ref(false);

// Merged options: Use fetched options if available (usually for search),
// otherwise fallback to initialOptions
const allOptions = computed(() => {
  if (fetchedOptions.value.length > 0) return fetchedOptions.value;
  return props.initialOptions || [];
});

// Default format display function
const defaultFormatDisplay = (option: SearchSelectOption): string => {
  if (props.labelKey && option[props.labelKey]) {
    return String(option[props.labelKey]);
  }
  return option.name || option.label || "";
};

const formatDisplayFn = computed(() => props.formatDisplay || defaultFormatDisplay);

const getOptionValue = (option: SearchSelectOption): string => {
  if (props.valueKey && option[props.valueKey]) {
    return String(option[props.valueKey]);
  }
  return option.id;
};

const getOptionLabel = (option: SearchSelectOption): string => {
  return formatDisplayFn.value(option);
};

// Filter options based on search query (client-side filtering)
const filteredOptions = computed(() => {
  if (allOptions.value.length === 0) return [];
  if (!searchQuery.value) return allOptions.value;

  // If we have async fetch, we assume results are already filtered by backend
  if (props.fetchOptions && fetchedOptions.value.length > 0) {
    return fetchedOptions.value;
  }

  // Client-side filtering
  const lowerQuery = searchQuery.value.toLowerCase();
  return allOptions.value.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
});

const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return props.placeholder || "Select option...";
  }

  // Try to find in all available options
  const selected = allOptions.value.find((opt) => getOptionValue(opt) === props.modelValue);
  if (selected) {
    return getOptionLabel(selected);
  }

  return props.placeholder || "Select option...";
});

// Debounced search function
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!props.fetchOptions) return;

  isLoading.value = true;
  try {
    const result = await props.fetchOptions({ query, limit: 50 });
    if (result.success && result.data) {
      fetchedOptions.value = result.data;
      hasFetched.value = true;
    }
  } catch (error) {
    console.error("[SearchSelect] Failed to fetch options:", error);
  } finally {
    isLoading.value = false;
  }
}, props.debounceMs || 300);

watch(searchQuery, (newQuery) => {
  if (props.fetchOptions) {
    debouncedSearch(newQuery);
  }
});

async function initialFetch() {
  if (!props.fetchOptions || hasFetched.value) return;

  isLoading.value = true;
  try {
    const result = await props.fetchOptions({ query: "", limit: 50 });
    if (result.success && result.data) {
      fetchedOptions.value = result.data;
      hasFetched.value = true;
    }
  } catch (error) {
    console.error("[SearchSelect] Initial fetch failed:", error);
  } finally {
    isLoading.value = false;
  }
}

function selectOption(option: SearchSelectOption) {
  emit("update:modelValue", getOptionValue(option));
  open.value = false;
  searchQuery.value = "";
}

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      inputRef.value?.focus();
      if (!hasFetched.value && props.fetchOptions) {
        initialFetch();
      }
    });
  }
});

onClickOutside(containerRef, (event) => {
  // Don't close if clicking inside a modal dialog
  const modal = document.querySelector("[data-modal]");
  if (modal && modal.contains(event.target as Node)) {
    return;
  }
  open.value = false;
});

// Compute dropdown position for teleport
const dropdownStyle = computed(() => {
  if (!containerRef.value) return {};
  const rect = containerRef.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxWidth: `${rect.width}px`,
  };
});

defineExpose({
  refresh: () => {
    hasFetched.value = false;
    initialFetch();
  },
});
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-slate-300"
      :class="{ 'opacity-50': disabled }"
      :disabled="disabled"
      @click="open = !open"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed z-[1200] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-white text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
        :style="dropdownStyle"
      >
        <div class="flex items-center border-b border-border px-3 sticky top-0 bg-white z-10">
          <input
            ref="inputRef"
            v-model="searchQuery"
            class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            :disabled="disabled"
            @keydown.escape="open = false"
          />
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        <div class="p-1 custom-scrollbar">
          <div
            v-if="isLoading && filteredOptions.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
          >
            <Loader2 class="h-4 w-4 animate-spin mx-auto mb-2" />
            Loading...
          </div>
          <div
            v-else-if="!isLoading && filteredOptions.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
          >
            No results found.
          </div>
          <div
            v-for="option in filteredOptions"
            :key="getOptionValue(option)"
            class="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-slate-50 group"
            :class="{ 'bg-slate-50': modelValue === getOptionValue(option) }"
            @click="selectOption(option)"
          >
            <Check
              class="mr-2 h-4 w-4 text-[#012D5A]"
              :class="modelValue === getOptionValue(option) ? 'opacity-100' : 'opacity-0'"
              stroke-width="3"
            />
            <span
              :class="{ 'font-semibold text-[#012D5A]': modelValue === getOptionValue(option) }"
            >
              {{ getOptionLabel(option) }}
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
