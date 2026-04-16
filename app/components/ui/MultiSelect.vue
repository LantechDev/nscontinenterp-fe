<script setup lang="ts">
import { Check, ChevronsUpDown, Search, X } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import Checkbox from "~/components/ui/Checkbox.vue";
import { cn } from "~/lib/utils";

interface Option {
  id: string;
  name: string;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    options: Option[];
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
    maxVisible?: number;
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: "Select options...",
    labelKey: "name",
    valueKey: "id",
    maxVisible: 2,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const getOptionValue = (option: Option): string => {
  return String(option[props.valueKey] || option.id);
};

const getOptionLabel = (option: Option): string => {
  return String(option[props.labelKey] || option.name);
};

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => getOptionLabel(opt).toLowerCase().includes(query));
});

const selectedOptions = computed(() => {
  return props.options.filter((opt) => props.modelValue.includes(getOptionValue(opt)));
});

const displayText = computed(() => {
  if (props.modelValue.length === 0) return props.placeholder;

  const labels = selectedOptions.value.map(getOptionLabel);
  if (labels.length <= props.maxVisible) {
    return labels.join(", ");
  }
  return `${labels.length} items selected`;
});

const isSelected = (option: Option) => {
  return props.modelValue.includes(getOptionValue(option));
};

const toggleOption = (option: Option) => {
  const value = getOptionValue(option);
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(value);

  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(value);
  }

  emit("update:modelValue", newValue);
};

const removeOption = (value: string) => {
  const newValue = props.modelValue.filter((v) => v !== value);
  emit("update:modelValue", newValue);
};

const clearAll = () => {
  emit("update:modelValue", []);
};

watch(open, (val) => {
  if (val) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    searchQuery.value = "";
  }
});

onClickOutside(containerRef, () => {
  open.value = false;
});
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <div
      class="min-h-[42px] w-full flex items-center justify-between rounded-lg border border-border bg-white px-3 py-1.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer transition-all hover:border-slate-300"
      @click="open = !open"
    >
      <div class="flex flex-wrap gap-1 items-center">
        <template v-if="selectedOptions.length > 0">
          <div
            v-for="option in selectedOptions.slice(0, maxVisible)"
            :key="getOptionValue(option)"
            class="flex items-center gap-1 bg-slate-100 text-[#012D5A] px-2 py-0.5 rounded text-xs font-medium"
            @click.stop
          >
            {{ getOptionLabel(option) }}
            <X
              class="w-3 h-3 cursor-pointer hover:text-red-500"
              @click="removeOption(getOptionValue(option))"
            />
          </div>
          <span
            v-if="selectedOptions.length > maxVisible"
            class="text-xs text-muted-foreground font-medium ml-1"
          >
            +{{ selectedOptions.length - maxVisible }} more
          </span>
        </template>
        <span v-else class="text-muted-foreground">{{ placeholder }}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0 ml-2">
        <X
          v-if="modelValue.length > 0"
          class="w-3.5 h-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
          @click.stop="clearAll"
        />
        <ChevronsUpDown class="w-4 h-4 text-muted-foreground opacity-50" />
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute z-[100] mt-2 w-full min-w-[200px] overflow-hidden rounded-xl border border-border bg-white shadow-xl animate-in fade-in-0 zoom-in-95"
    >
      <div class="flex items-center border-b border-border px-3 bg-slate-50/50">
        <Search class="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref="inputRef"
          v-model="searchQuery"
          class="flex h-10 w-full rounded-md bg-transparent py-3 pl-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search options..."
          @keydown.escape="open = false"
        />
      </div>
      <div class="max-h-60 overflow-y-auto p-1 custom-scrollbar">
        <div
          v-if="filteredOptions.length === 0"
          class="py-6 text-center text-sm text-muted-foreground"
        >
          No matches found.
        </div>
        <div
          v-for="option in filteredOptions"
          :key="getOptionValue(option)"
          class="relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-slate-50 group"
          @click.stop="toggleOption(option)"
        >
          <Checkbox
            :model-value="isSelected(option)"
            class="mr-3"
            @update:model-value="toggleOption(option)"
          />
          <span
            :class="{ 'font-bold text-[#012D5A]': isSelected(option) }"
            class="transition-colors"
          >
            {{ getOptionLabel(option) }}
          </span>
        </div>
      </div>
    </div>
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
