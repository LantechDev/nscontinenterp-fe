<script setup lang="ts">
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-vue-next";
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

// viewDate tracks which month is currently displayed in the calendar
const viewDate = ref(props.modelValue ? new Date(props.modelValue) : new Date());

// Format the selected date for display in the trigger
const formattedDate = computed(() => {
  if (!props.modelValue) return props.placeholder || "Select date...";
  try {
    const date = new Date(props.modelValue);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return props.modelValue;
  }
});

const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
    viewDate.value,
  );
});

const daysInMonth = computed(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  // Padding from previous month (Sunday = 0)
  const firstDayIdx = firstDay.getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayIdx - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: month - 1,
      year: year,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    });
  }

  // Padding from next month
  const remaining = 42 - days.length; // Always show 6 rows (42 days) for stability
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: year,
      isCurrentMonth: false,
    });
  }

  return days;
});

const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.modelValue) {
    viewDate.value = new Date(props.modelValue);
  }
}

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
}

function selectDate(d: { day: number; month: number; year: number }) {
  const selected = new Date(d.year, d.month, d.day);
  // Format as YYYY-MM-DD for consistency with input[type=date]
  const offset = selected.getTimezoneOffset();
  const adjusted = new Date(selected.getTime() - offset * 60 * 1000);
  const dateStr = adjusted.toISOString().split("T")[0];

  emit("update:modelValue", dateStr);
  isOpen.value = false;
}

function isSelected(d: { day: number; month: number; year: number }) {
  if (!props.modelValue) return false;
  const sel = new Date(props.modelValue);
  return sel.getDate() === d.day && sel.getMonth() === d.month && sel.getFullYear() === d.year;
}

function isToday(d: { day: number; month: number; year: number }) {
  const today = new Date();
  return (
    today.getDate() === d.day && today.getMonth() === d.month && today.getFullYear() === d.year
  );
}

onClickOutside(containerRef as Ref<HTMLElement>, () => {
  isOpen.value = false;
});
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <button
      type="button"
      class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-muted/50"
      :class="{ 'text-muted-foreground': !modelValue, 'ring-2 ring-ring ring-offset-2': isOpen }"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="truncate">{{ formattedDate }}</span>
      <CalendarIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-[1001] mt-1 w-72 rounded-md border bg-white dark:bg-slate-950 p-3 shadow-lg animate-in fade-in zoom-in-95"
    >
      <!-- Calendar Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          @click="prevMonth"
          class="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <span class="text-sm font-semibold">{{ currentMonthName }}</span>
        <button
          type="button"
          @click="nextMonth"
          class="p-1 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Day Labels -->
      <div class="grid grid-cols-7 gap-1 mb-1">
        <span
          v-for="label in dayLabels"
          :key="label"
          class="text-center text-[10px] font-bold text-muted-foreground uppercase py-1"
        >
          {{ label }}
        </span>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(d, idx) in daysInMonth"
          :key="idx"
          type="button"
          @click="selectDate(d)"
          class="h-8 w-full flex items-center justify-center rounded-md text-xs transition-all"
          :class="[
            d.isCurrentMonth ? 'text-foreground hover:bg-muted' : 'text-muted-foreground/40',
            isSelected(d) ? 'bg-[#012D5A] text-white hover:bg-[#012D5A]' : '',
            isToday(d) && !isSelected(d) ? 'border border-[#012D5A] text-[#012D5A]' : '',
          ]"
        >
          {{ d.day }}
        </button>
      </div>
    </div>
  </div>
</template>
