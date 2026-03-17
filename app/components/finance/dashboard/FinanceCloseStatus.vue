<script setup lang="ts">
import { cn } from "~/lib/utils";
import type { FinanceCloseStats } from "~/types/finance";

const props = defineProps<{
  financeCloseData: FinanceCloseStats;
}>();

const emit = defineEmits<{
  (e: "closePeriod"): void;
}>();

// Format closedAt date if available
const formattedClosedDate = computed(() => {
  if (props.financeCloseData.status === "Closed" && props.financeCloseData.periodEnd) {
    try {
      const date = new Date(props.financeCloseData.periodEnd);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }
  return "";
});
</script>

<template>
  <div class="bg-[#012D5A] rounded-xl p-4 mb-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-base font-semibold text-white">
            {{ financeCloseData.period }}
          </h3>
          <span
            :class="
              cn(
                'px-2 py-0.5 text-xs font-medium rounded-md',
                financeCloseData.status === 'Open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              )
            "
            >{{ financeCloseData.status }}</span
          >
        </div>
        <p class="text-white/60 text-[10px] mb-4 max-w-md">
          {{ financeCloseData.description }}
        </p>
        <div class="flex items-center gap-6">
          <div>
            <p class="text-white/60 text-[10px]">Revenue</p>
            <p class="text-white text-base font-semibold">
              {{ financeCloseData.revenue }}
            </p>
          </div>
          <div class="w-[1px] h-8 bg-white/20"></div>
          <div>
            <p class="text-white/60 text-[10px]">COGS</p>
            <p class="text-white text-base font-semibold">
              {{ financeCloseData.cogs }}
            </p>
          </div>
          <div class="w-[1px] h-8 bg-white/20"></div>
          <div>
            <p class="text-white/60 text-[10px]">Nett P&L</p>
            <p class="text-green-400 text-base font-semibold">
              {{ financeCloseData.nettPL }}
            </p>
          </div>
        </div>
        <div v-if="financeCloseData.status === 'Closed' && formattedClosedDate" class="mt-3">
          <p class="text-white/40 text-[10px]">Closed on: {{ formattedClosedDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
