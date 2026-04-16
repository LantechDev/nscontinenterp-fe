<script setup lang="ts">
import { Check, ChevronsUpDown, Plus } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { cn } from "~/lib/utils";

interface ComboboxOption {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined;
    options: ComboboxOption[];
    labelKey?: string;
    valueKey?: string;
    placeholder?: string;
    allowCreate?: boolean;
    filterLocal?: boolean;
  }>(),
  {
    filterLocal: true,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null | undefined): void;
  (e: "create", value: string): void;
  (e: "search", value: string): void;
}>();

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

watch(searchQuery, (q) => {
  emit("search", q);
});

const getOptionValue = (option: ComboboxOption): string => {
  if (props.valueKey && option[props.valueKey]) {
    return String(option[props.valueKey]);
  }
  return option.id || "";
};

const getOptionLabel = (option: ComboboxOption): string => {
  if (props.labelKey && option[props.labelKey]) {
    return String(option[props.labelKey]);
  }
  return option.name || "";
};

const filteredOptions = computed(() => {
  if (!props.options) return [];
  if (!props.filterLocal) return props.options;

  if (!searchQuery.value) return props.options;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
});

const hasExactMatch = computed(() => {
  if (!searchQuery.value) return true;
  const lowerQuery = searchQuery.value.toLowerCase();
  return filteredOptions.value.some((opt) => getOptionLabel(opt).toLowerCase() === lowerQuery);
});

const cachedSelectedOption = ref<ComboboxOption | null>(null);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      cachedSelectedOption.value = null;
    }
  },
);

watch(
  () => props.options,
  (newOptions) => {
    if (props.modelValue && newOptions) {
      const found = newOptions.find((opt) => getOptionValue(opt) === props.modelValue);
      if (found) {
        cachedSelectedOption.value = found;
      }
    }
  },
  { immediate: true, deep: true },
);

const selectedLabel = computed(() => {
  if (
    cachedSelectedOption.value &&
    getOptionValue(cachedSelectedOption.value) === props.modelValue
  ) {
    return getOptionLabel(cachedSelectedOption.value);
  }

  const selected = props.options.find((opt) => getOptionValue(opt) === props.modelValue);
  if (selected) {
    cachedSelectedOption.value = selected;
    return getOptionLabel(selected);
  }
  return props.placeholder || "Select option...";
});

function selectOption(option: ComboboxOption) {
  cachedSelectedOption.value = option;
  emit("update:modelValue", getOptionValue(option));
  open.value = false;
  searchQuery.value = "";
}

function handleCreate() {
  if (!props.allowCreate || !searchQuery.value) return;
  emit("create", searchQuery.value);
  open.value = false;
  searchQuery.value = "";
}

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

// Click outside to close
onClickOutside(containerRef as Ref<HTMLElement>, () => {
  open.value = false;
});
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      @click="open = !open"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <div
      v-if="open"
      class="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white dark:bg-slate-950 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      <div class="flex items-center border-b px-3 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <input
          ref="inputRef"
          v-model="searchQuery"
          class="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search..."
        />
      </div>
      <div class="p-1">
        <div v-if="filteredOptions.length === 0 && !allowCreate" class="py-6 text-center text-sm">
          No results found.
        </div>

        <div
          v-if="allowCreate && searchQuery && !hasExactMatch"
          class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-[#012D5A]/10 hover:bg-[#012D5A] hover:text-white"
          @click="handleCreate"
        >
          <Plus class="mr-2 h-4 w-4" />
          Create "{{ searchQuery }}"
        </div>

        <div
          v-for="option in filteredOptions"
          :key="getOptionValue(option)"
          class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#012D5A] hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          :class="{
            'bg-[#012D5A] text-white': modelValue === getOptionValue(option),
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
  </div>
</template>
