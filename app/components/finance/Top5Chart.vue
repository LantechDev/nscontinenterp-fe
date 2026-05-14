<script setup lang="ts">
interface Top5Item {
  name: string;
  value: number;
}

interface ChartData {
  top5?: Top5Item[];
}

const props = defineProps<{
  chartData?: ChartData;
  options: unknown;
  series: unknown;
}>();

const colors = ["#1e3a8a", "#38bdf8", "#3b82f6", "#60a5fa", "#2563eb"];

const dynamicTop5Items = computed(() => {
  const data = props.chartData?.top5 || [];

  if (data.length === 0) {
    return [];
  }

  // Sort by value descending
  const sortedData = data.toSorted((a, b) => b.value - a.value).slice(0, 5);
  const totalValue = sortedData.reduce((acc, item) => acc + item.value, 0);

  return sortedData.map((item, index) => ({
    name: item.name,
    value: totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0,
    color: colors[index % colors.length],
  }));
});

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
        <template v-if="dynamicTop5Items.length > 0">
          <apexchart type="donut" height="220" :options="options" :series="series" />
        </template>
        <div v-else class="flex flex-col items-center justify-center text-gray-400">
          <Icon name="ph:chart-pie-slice" class="w-12 h-12 opacity-20 mb-2" />
          <span class="text-xs">No data available</span>
        </div>
      </ClientOnly>
    </div>

    <!-- Legend List (Vertical) -->
    <div v-if="dynamicTop5Items.length > 0" class="flex flex-col gap-3 mt-2">
      <div
        v-for="item in dynamicTop5Items"
        :key="item.name"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: item.color }"></div>
          <span class="text-xs text-gray-500">{{ item.name }}</span>
        </div>
        <span class="text-xs font-semibold text-black">{{ item.value }}%</span>
      </div>
    </div>
  </div>
</template>
