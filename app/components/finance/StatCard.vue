<script setup lang="ts">
import { TrendingUp } from "lucide-vue-next";
import { cn } from "~/lib/utils";

export interface StatCardData {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  suffix?: string;
  isPrimary?: boolean;
}

defineProps<{
  card: StatCardData;
  index: number;
  class?: string;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'border border-border rounded-xl p-5',
        card.isPrimary ? 'bg-[#012D5A] border-[#012D5A] text-white' : 'bg-white border-border',
        $props.class,
      )
    "
  >
    <div class="flex items-start justify-between">
      <div>
        <p
          :class="
            cn('text-sm font-medium', card.isPrimary ? 'text-white/80' : 'text-muted-foreground')
          "
        >
          {{ card.title }}
        </p>
        <p
          :class="cn('text-2xl font-bold mt-1', card.isPrimary ? 'text-white' : 'text-foreground')"
        >
          {{ card.value }}
        </p>
      </div>
      <div
        v-if="card.change && card.change > 0 && !card.suffix"
        :class="
          cn(
            'flex items-center gap-1 text-xs font-medium',
            card.isPrimary ? 'text-green-400' : 'text-green-600',
          )
        "
      >
        <TrendingUp class="w-3 h-3" />
        <span>{{ card.change }}%</span>
      </div>
    </div>
    <p :class="cn('text-xs mt-2', card.isPrimary ? 'text-white/60' : 'text-muted-foreground')">
      {{ card.changeLabel }}
    </p>
  </div>
</template>
