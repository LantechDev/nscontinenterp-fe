<script setup lang="ts">
import Top5Chart from "~/components/finance/Top5Chart.vue";
import type { StatCardData } from "~/types/finance";

interface OverviewChartData {
  top5?: Array<{ name: string; value: number }>;
  [key: string]: unknown;
}

// Props from parent
const props = defineProps<{
  statsCards: StatCardData[];
  financialChartOptions: Record<string, unknown>;
  financialChartSeries: unknown[];
  top5ChartOptions: Record<string, unknown>;
  top5ChartSeries: unknown[];
  chartData: OverviewChartData;
  marginTrendChartOptions: Record<string, unknown>;
  marginTrendChartSeries: unknown[];
}>();
</script>

<template>
  <div class="space-y-4 px-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Financial Overview Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl border border-border p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold text-gray-900">Financial Overview</h3>
        </div>
        <div class="h-72 w-full">
          <ClientOnly>
            <apexchart
              type="area"
              height="280"
              :options="financialChartOptions"
              :series="financialChartSeries"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- Top 5 Chart -->
      <Top5Chart :chart-data="chartData" :options="top5ChartOptions" :series="top5ChartSeries" />
    </div>

    <!-- Margin Trend Chart -->
    <div class="bg-white rounded-xl border border-border p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900">Margin Trend</h3>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-[#012D5A]"></div>
            <span class="text-[10px] text-neutral-700">Margin</span>
          </div>
        </div>
      </div>
      <div class="h-72 w-full">
        <ClientOnly>
          <apexchart
            type="area"
            height="280"
            :options="marginTrendChartOptions"
            :series="marginTrendChartSeries"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
