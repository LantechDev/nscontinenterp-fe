<script setup lang="ts">
import type { FinanceClosePeriod } from "~/types/finance-dashboard";

definePageMeta({
  layout: "dashboard",
  title: "Closed Period Details",
});

const route = useRoute();
const periodId = route.params.id as string;

const baseUrl = "/api";

const isLoading = ref(true);
const error = ref<string | null>(null);
const period = ref<FinanceClosePeriod | null>(null);

// Fetch period details
async function fetchPeriodDetails() {
  isLoading.value = true;
  error.value = null;

  try {
    const data = await $fetch<FinanceClosePeriod>(
      `${baseUrl}/finance/dashboard/finance-close/periods/${periodId}`,
      {
        method: "GET",
      },
    );
    period.value = data;
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Failed to fetch period details:", errMsg);
    error.value = errMsg;
  } finally {
    isLoading.value = false;
  }
}

// Format date
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}

// Parse currency string to number
function parseCurrency(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return Number(cleaned) || 0;
}

// Calculate gross profit (revenue - COGS)
function calculateGrossProfit(revenue: string, cogs: string): string {
  const rev = parseCurrency(revenue);
  const cogsValue = parseCurrency(cogs);
  const grossProfit = rev - cogsValue;
  return grossProfit.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Format readiness score with percentage
function formatReadinessScore(score: number): string {
  return `${score}%`;
}

// Go back to finance dashboard
function goBack() {
  navigateTo("/finance/dashboard");
}

// Initial fetch
onMounted(() => {
  fetchPeriodDetails();
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold">Closed Period Details</h1>
          <p class="text-muted-foreground mt-1">
            View detailed financial data for this closed period
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading period details...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      <p>{{ error }}</p>
      <button @click="fetchPeriodDetails" class="mt-2 text-sm font-medium underline">
        Try again
      </button>
    </div>

    <!-- Period Details -->
    <ClientOnly>
      <div v-if="period" class="space-y-6">
        <!-- Period Header Card -->
        <div class="bg-[#012D5A] rounded-xl p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h2 class="text-xl font-semibold text-white">{{ period.period }}</h2>
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  {{ period.status }}
                </span>
              </div>
              <p v-if="period.description" class="text-white/60 text-sm mb-4 max-w-2xl">
                {{ period.description }}
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-white/60 text-xs">Revenue</p>
                  <p class="text-white text-lg font-semibold">{{ period.revenue }}</p>
                </div>
                <div>
                  <p class="text-white/60 text-xs">COGS</p>
                  <p class="text-white text-lg font-semibold">{{ period.cogs }}</p>
                </div>
                <div>
                  <p class="text-white/60 text-xs">Gross Profit</p>
                  <p class="text-white text-lg font-semibold">
                    {{ calculateGrossProfit(period.revenue, period.cogs) }}
                  </p>
                </div>
                <div>
                  <p class="text-white/60 text-xs">Nett P&L</p>
                  <p
                    class="text-lg font-semibold"
                    :class="parseCurrency(period.nettPL) >= 0 ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ period.nettPL }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end lg:w-48">
              <div class="text-right mb-4">
                <p class="text-white/60 text-xs">Readiness Score</p>
                <p
                  class="text-4xl font-bold"
                  :class="
                    period.readinessScore >= 80
                      ? 'text-green-400'
                      : period.readinessScore >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  "
                >
                  {{ formatReadinessScore(period.readinessScore) }}
                </p>
              </div>
              <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-white rounded-full transition-all"
                  :style="{ width: `${period.readinessScore}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Period Date Information -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Period Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-500">Period Start</p>
              <p class="text-base font-medium text-gray-900 mt-1">
                {{ formatDate(period.periodStart) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Period End</p>
              <p class="text-base font-medium text-gray-900 mt-1">
                {{ formatDate(period.periodEnd) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Closed Date</p>
              <p class="text-base font-medium text-gray-900 mt-1">
                {{ formatDate(period.closedAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide">Revenue</p>
              <p class="text-xl font-semibold text-gray-900 mt-1">
                {{ period.revenue }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide">COGS</p>
              <p class="text-xl font-semibold text-gray-900 mt-1">
                {{ period.cogs }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide">Gross Profit</p>
              <p class="text-xl font-semibold text-gray-900 mt-1">
                {{ calculateGrossProfit(period.revenue, period.cogs) }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 uppercase tracking-wide">Nett P&L</p>
              <p
                class="text-xl font-semibold mt-1"
                :class="parseCurrency(period.nettPL) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ period.nettPL }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-gray-50 rounded-xl border border-border p-8 text-center">
        <p class="text-muted-foreground">Period not found</p>
      </div>
    </ClientOnly>
  </div>
</template>
