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
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="space-y-4 px-6">
    <template v-if="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="card in 6"
          :key="card"
          class="border border-border rounded-xl bg-white p-4 animate-pulse"
        >
          <div class="h-3 w-28 rounded bg-muted mb-4" />
          <div class="h-7 w-36 rounded bg-muted mb-3" />
          <div class="h-3 w-20 rounded bg-muted" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-white rounded-xl border border-border p-4 animate-pulse">
          <div class="h-4 w-40 rounded bg-muted mb-6" />
          <div class="h-72 w-full rounded-lg bg-muted" />
        </div>
        <div class="bg-white rounded-xl border border-border p-4 animate-pulse">
          <div class="h-4 w-28 rounded bg-muted mb-6" />
          <div class="space-y-4">
            <div v-for="item in 5" :key="item" class="flex items-center gap-3">
              <div class="h-3 w-5 rounded bg-muted" />
              <div class="h-3 flex-1 rounded bg-muted" />
              <div class="h-3 w-16 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-border p-4 animate-pulse">
        <div class="flex items-center justify-between mb-6">
          <div class="h-4 w-32 rounded bg-muted" />
          <div class="h-3 w-20 rounded bg-muted" />
        </div>
        <div class="h-72 w-full rounded-lg bg-muted" />
      </div>
    </template>

    <!-- Stat Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- Charts Row -->
    <div v-if="!isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
    <div v-if="!isLoading" class="bg-white rounded-xl border border-border p-4">
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
