<script setup lang="ts">
import { Check, ChevronsUpDown, Plus } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { cn } from "~/lib/utils";

interface ComboboxOption {
  id: string;
  name?: string;
  [key: string]: unknown;
}

const props = defineProps<{
  modelValue: string;
  options: ComboboxOption[];
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  allowCreate?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "create", value: string): void;
}>();

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const getOptionValue = (option: ComboboxOption): string => {
  if (props.valueKey && option[props.valueKey]) {
    return String(option[props.valueKey]);
  }
  return option.id;
};

const getOptionLabel = (option: ComboboxOption): string => {
  if (props.labelKey && option[props.labelKey]) {
    return String(option[props.labelKey]);
  }
  return option.name || "";
};

const filteredOptions = computed(() => {
  if (!props.options) return [];
  if (!searchQuery.value) return props.options;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(lowerQuery));
});

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => getOptionValue(opt) === props.modelValue);
  if (selected) {
    return getOptionLabel(selected);
  }
  return props.placeholder || "Select option...";
});

function selectOption(option: ComboboxOption) {
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
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      <div class="flex items-center border-b px-3 sticky top-0 bg-popover">
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
          v-if="filteredOptions.length === 0 && allowCreate && searchQuery"
          class="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none bg-accent/50 hover:bg-accent text-accent-foreground"
          @click="handleCreate"
        >
          <Plus class="mr-2 h-4 w-4" />
          Create "{{ searchQuery }}"
        </div>

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
  </div>
</template>
