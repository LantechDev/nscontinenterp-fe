<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { Clock } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import type { Ref } from "vue";

const props = defineProps<{
  modelValue: string | null | undefined;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null | undefined): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// Separate hour and minute components derived from modelValue
const selectedHour = computed(() => {
  if (!props.modelValue) return null;
  const [h] = props.modelValue.split(":");
  return h;
});

const selectedMinute = computed(() => {
  if (!props.modelValue) return null;
  const [, m] = props.modelValue.split(":");
  return m;
});

// Calculate formatted display value
const displayValue = computed(() => {
  if (selectedHour.value && selectedMinute.value) {
    return `${selectedHour.value}:${selectedMinute.value}`;
  }
  return props.placeholder || "Select time...";
});

// Generate options for hours (00-23) and minutes (00-59)
const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

const toggle = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

// Handlers for selection
const setHour = (h: string) => {
  const currentMin = selectedMinute.value || "00";
  emit("update:modelValue", `${h}:${currentMin}`);
};

const setMinute = (m: string) => {
  const currentHr = selectedHour.value || "12";
  emit("update:modelValue", `${currentHr}:${m}`);
};

// Close when clicking outside
onClickOutside(containerRef as Ref<HTMLElement>, () => {
  isOpen.value = false;
});
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Trigger Button -->
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-muted/50"
      :class="{ 'text-muted-foreground': !modelValue, 'ring-2 ring-ring ring-offset-2': isOpen }"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="truncate">{{ displayValue }}</span>
      <Clock class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <!-- Custom Popover Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-[1001] bottom-full mb-1 w-48 rounded-md border bg-white dark:bg-slate-950 p-2 shadow-lg animate-in fade-in zoom-in-95"
    >
      <div class="flex h-56 gap-2">
        <!-- Hours Column -->
        <div class="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar pb-6 relative">
          <div
            class="text-[10px] font-bold text-muted-foreground/60 tracking-wider text-center mb-1 sticky top-0 bg-white dark:bg-slate-950 py-1 z-10 border-b border-border/50"
          >
            HOUR
          </div>
          <button
            v-for="h in hoursList"
            :key="'h-' + h"
            type="button"
            @click="setHour(h)"
            class="w-full py-1.5 px-2 rounded-md transition-colors text-xs font-medium focus:outline-none"
            :class="
              selectedHour === h
                ? 'bg-[#012D5A] text-white hover:bg-[#012D5A]'
                : 'text-foreground hover:bg-muted'
            "
          >
            {{ h }}
          </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-px bg-border/50 my-2"></div>

        <!-- Minutes Column -->
        <div class="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar pb-6 relative">
          <div
            class="text-[10px] font-bold text-muted-foreground/60 tracking-wider text-center mb-1 sticky top-0 bg-white dark:bg-slate-950 py-1 z-10 border-b border-border/50"
          >
            MINUTE
          </div>
          <button
            v-for="m in minutesList"
            :key="'m-' + m"
            type="button"
            @click="setMinute(m)"
            class="w-full py-1.5 px-2 rounded-md transition-colors text-xs font-medium focus:outline-none"
            :class="
              selectedMinute === m
                ? 'bg-[#012D5A] text-white hover:bg-[#012D5A]'
                : 'text-foreground hover:bg-muted'
            "
          >
            {{ m }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
