<script setup lang="ts">
import { useFinanceCharts } from "~/composables/useFinanceCharts";

const { top5ChartOptions, top5ChartSeries } = useFinanceCharts();

const top5Items = [
  { name: "Lorem Ipsum", value: 40, color: "#1e3a8a" },
  { name: "Dolor Sit", value: 30, color: "#38bdf8" },
  { name: "Amet Consect", value: 22, color: "#3b82f6" },
  { name: "Elit Sed", value: 10, color: "#60a5fa" },
  { name: "Tempor Inc", value: 8, color: "#2563eb" },
];

const selectedType = ref("Income");
</script>

<template>
  <div class="bg-white rounded-xl border border-border p-4 h-full flex flex-col">
    <!-- Header with dropdown -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900">Top 5</h3>
      <div class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 rounded-md">
        <select
          v-model="selectedType"
          class="text-xs font-medium text-gray-500 bg-transparent focus:outline-none"
        >
          <option value="Income">Income</option>
          <option value="Outcome">Outcome</option>
        </select>
      </div>
    </div>

    <!-- Donut Chart -->
    <div class="flex-1 flex items-center justify-center min-h-[200px]">
      <ClientOnly>
        <apexchart
          type="donut"
          height="220"
          :options="top5ChartOptions"
          :series="top5ChartSeries"
        />
      </ClientOnly>
    </div>

    <!-- Legend List (Vertical) -->
    <div class="flex flex-col gap-3 mt-2">
      <div v-for="item in top5Items" :key="item.name" class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: item.color }"></div>
          <span class="text-xs text-gray-500">{{ item.name }}</span>
        </div>
        <span class="text-xs font-semibold text-black">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>
