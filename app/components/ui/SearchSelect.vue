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

const options = ref<SearchSelectOption[]>([]);
const isLoading = ref(false);
const hasFetched = ref(false);

// Default format display function
const defaultFormatDisplay = (option: SearchSelectOption): string => {
  if (props.labelKey && option[props.labelKey]) {
    return String(option[props.labelKey]);
  }
  return option.name || option.label || "";
};

// Use provided formatDisplay or default
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
  if (!options.value || options.value.length === 0) return [];
  if (!searchQuery.value) return options.value;

  // If we have async fetch, just return all loaded options
  if (props.fetchOptions) {
    return options.value;
  }

  // Client-side filtering for non-async mode
  const lowerQuery = searchQuery.value.toLowerCase();
  return options.value.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
});

const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return props.placeholder || "Select option...";
  }
  const selected = options.value.find((opt) => getOptionValue(opt) === props.modelValue);
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
      options.value = result.data;
      hasFetched.value = true;
    }
  } catch (error) {
    console.error("[SearchSelect] Failed to fetch options:", error);
  } finally {
    isLoading.value = false;
  }
}, props.debounceMs || 300);

// Handle search query changes
watch(searchQuery, (newQuery) => {
  if (props.fetchOptions) {
    debouncedSearch(newQuery);
  }
});

// Initial fetch
async function initialFetch() {
  if (props.initialOptions && props.initialOptions.length > 0) {
    options.value = props.initialOptions;
    hasFetched.value = true;
    return;
  }

  if (props.fetchOptions && !hasFetched.value) {
    isLoading.value = true;
    try {
      const result = await props.fetchOptions({ query: "", limit: 50 });
      if (result.success && result.data) {
        options.value = result.data;
        hasFetched.value = true;
      }
    } catch (error) {
      console.error("[SearchSelect] Initial fetch failed:", error);
    } finally {
      isLoading.value = false;
    }
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
      // Fetch initial options when opening
      if (!hasFetched.value) {
        initialFetch();
      }
    });
  }
});

// Click outside to close
onClickOutside(containerRef as Ref<HTMLElement>, () => {
  open.value = false;
});

// Expose refresh method
defineExpose({
  refresh: initialFetch,
});
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :class="{
        'opacity-50': disabled,
      }"
      :disabled="disabled"
      @click="open = !open"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        class="fixed z-[1200] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
        :style="dropdownStyle"
      >
        <div class="flex items-center border-b px-3 sticky top-0 bg-popover">
          <input
            ref="inputRef"
            v-model="searchQuery"
            class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            :disabled="disabled"
          />
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        <div class="p-1">
          <!-- Loading state -->
          <div
            v-if="isLoading && filteredOptions.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
          >
            <Loader2 class="h-4 w-4 animate-spin mx-auto mb-2" />
            Loading...
          </div>

          <!-- No results -->
          <div
            v-else-if="!isLoading && filteredOptions.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
          >
            No results found.
          </div>

          <!-- Options list -->
          <div
            v-for="option in filteredOptions"
            :key="getOptionValue(option)"
            class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            :class="{
              'bg-accent': modelValue === getOptionValue(option),
            }"
            @click="selectOption(option)"
          >
            <Check
              class="mr-2 h-4 w-4"
              :class="modelValue === getOptionValue(option) ? 'opacity-100' : 'opacity-0'"
            />
            {{ getOptionLabel(option) }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
