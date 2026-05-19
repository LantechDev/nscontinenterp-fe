<script setup lang="ts">
import { TrendingUp, Info } from "lucide-vue-next";
import { cn } from "~/lib/utils";

export interface StatCardData {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  suffix?: string;
  isPrimary?: boolean;
  tooltip?: string;
  color?: "green" | "red" | "purple" | "blue" | "neutral";
  subtitle?: string;
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
        'border rounded-xl p-5 relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-white border-border',
        card.isPrimary ? 'bg-[#012D5A] border-[#012D5A] text-white' : '',
        card.color === 'green' &&
          'border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-500/5',
        card.color === 'red' && 'border-rose-100 hover:border-rose-200 hover:shadow-rose-500/5',
        card.color === 'purple' &&
          'border-purple-100 hover:border-purple-200 hover:shadow-purple-500/5',
        card.color === 'blue' && 'border-blue-100 hover:border-blue-200 hover:shadow-blue-500/5',
        card.color === 'neutral' && 'border-gray-200 hover:border-gray-300 hover:shadow-gray-500/5',
        $props.class,
      )
    "
  >
    <!-- Background colored subtle glow or accent bar at the top -->
    <div
      v-if="card.color"
      :class="
        cn(
          'absolute top-0 left-0 right-0 h-1 rounded-t-xl',
          card.color === 'green' && 'bg-emerald-500',
          card.color === 'red' && 'bg-rose-500',
          card.color === 'purple' && 'bg-purple-500',
          card.color === 'blue' && 'bg-blue-500',
          card.color === 'neutral' && 'bg-gray-400',
        )
      "
    />

    <div class="flex items-start justify-between">
      <div class="space-y-1 pr-4 w-full">
        <div class="flex items-center gap-1.5 flex-wrap">
          <!-- Colored dot indicator -->
          <span
            v-if="card.color"
            :class="
              cn(
                'w-2 h-2 rounded-full inline-block shrink-0',
                card.color === 'green' && 'bg-emerald-500 animate-pulse',
                card.color === 'red' && 'bg-rose-500 animate-pulse',
                card.color === 'purple' && 'bg-purple-500 animate-pulse',
                card.color === 'blue' && 'bg-blue-500 animate-pulse',
                card.color === 'neutral' && 'bg-gray-400',
              )
            "
          />
          <p
            :class="
              cn(
                'text-xs font-semibold uppercase tracking-wider',
                card.isPrimary ? 'text-white/80' : 'text-muted-foreground',
              )
            "
          >
            {{ card.title }}
          </p>
          <!-- Info Tooltip Icon -->
          <div
            v-if="card.tooltip"
            class="group relative cursor-pointer ml-1 inline-flex items-center"
          >
            <Info class="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
            <!-- Custom Tooltip styling -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg z-50 text-center leading-normal font-normal pointer-events-none"
            >
              {{ card.tooltip }}
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
              />
            </div>
          </div>
        </div>

        <p v-if="card.subtitle" class="text-[11px] text-gray-400 font-medium leading-tight mt-0.5">
          {{ card.subtitle }}
        </p>

        <p
          :class="
            cn(
              'text-2xl font-bold mt-2 font-mono',
              card.isPrimary ? 'text-white' : 'text-foreground',
            )
          "
        >
          {{ card.value }}
        </p>
      </div>

      <div
        v-if="card.change && card.change > 0 && !card.suffix"
        :class="
          cn(
            'flex items-center gap-1 text-xs font-medium shrink-0',
            card.isPrimary ? 'text-green-400' : 'text-green-600',
          )
        "
      >
        <TrendingUp class="w-3.5 h-3.5" />
        <span>{{ card.change }}%</span>
      </div>
    </div>
    <p
      v-if="card.changeLabel"
      :class="cn('text-xs mt-3', card.isPrimary ? 'text-white/60' : 'text-muted-foreground')"
    >
      {{ card.changeLabel }}
    </p>
  </div>
</template>
