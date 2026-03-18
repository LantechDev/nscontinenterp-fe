<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, X } from "lucide-vue-next";
import { cn, toNumber, formatRupiah } from "~/lib/utils";
import type { TrialBalanceAccountDetail, JournalEntryDetail } from "~/types/finance-dashboard";

definePageMeta({
  layout: "dashboard",
  title: "Account Detail",
});

const route = useRoute();
const router = useRouter();

// Get accountId from route params
const accountId = computed(() => route.params.accountId as string);

// State
const isLoading = ref(false);
const accountDetail = ref<TrialBalanceAccountDetail | null>(null);
const error = ref<string | null>(null);

// Filters from query params
const selectedPeriod = ref((route.query.period as string) || "month");
const selectedYear = ref((route.query.year as string) || new Date().getFullYear().toString());
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }
  return years;
});

const formatCurrency = formatRupiah;

// Get API base URL
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase || "";

// Fetch account detail
async function fetchAccountDetail() {
  if (!accountId.value) return;

  isLoading.value = true;
  error.value = null;
  accountDetail.value = null;

  try {
    const queryParams = new URLSearchParams({
      period: selectedPeriod.value,
    });

    if (selectedYear.value) {
      queryParams.append("year", selectedYear.value);
    }

    const data = await $fetch<TrialBalanceAccountDetail>(
      `${baseUrl}/finance/dashboard/trial-balance/${accountId.value}?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    accountDetail.value = data;
  } catch (err) {
    console.error("Failed to fetch account detail:", err);
    error.value = "Failed to load account details";
  } finally {
    isLoading.value = false;
  }
}

// Handle period change
function handlePeriodChange(period: string) {
  selectedPeriod.value = period;
  updateQueryParams();
  fetchAccountDetail();
}

// Handle year change
function handleYearChange(year: string) {
  selectedYear.value = year;
  updateQueryParams();
  fetchAccountDetail();
}

// Update URL query params without navigation
function updateQueryParams() {
  router.replace({
    query: {
      ...route.query,
      period: selectedPeriod.value,
      year: selectedYear.value,
    },
  });
}

// Go back to trial balance
function goBack() {
  router.push("/finance/dashboard?tab=Trial%20Balance");
}

// Watch for route changes
watch(
  () => route.params.accountId,
  () => {
    if (accountId.value) {
      fetchAccountDetail();
    }
  },
  { immediate: true },
);

// Initial fetch
onMounted(() => {
  fetchAccountDetail();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="goBack">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold">Account Detail</h1>
        <p v-if="accountDetail" class="text-muted-foreground mt-1">
          {{ accountDetail.accountCode }} - {{ accountDetail.accountName }}
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-muted-foreground">Period:</label>
        <div class="flex bg-white border border-border rounded-lg p-1">
          <button
            v-for="period in ['day', 'week', 'month', 'year']"
            :key="period"
            :class="
              cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize',
                selectedPeriod === period
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )
            "
            @click="handlePeriodChange(period)"
          >
            {{ period }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-muted-foreground">Year:</label>
        <select
          :value="selectedYear"
          class="px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
          @change="handleYearChange(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading account details...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- Account Detail Content -->
    <div v-else-if="accountDetail" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-muted-foreground uppercase">Opening Balance</div>
          <div
            class="text-lg font-semibold"
            :class="accountDetail.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(accountDetail.openingBalance) }}
          </div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-muted-foreground uppercase">Debit Total</div>
          <div class="text-lg font-semibold">{{ formatCurrency(accountDetail.debitTotal) }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-muted-foreground uppercase">Credit Total</div>
          <div class="text-lg font-semibold">{{ formatCurrency(accountDetail.creditTotal) }}</div>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="text-xs text-muted-foreground uppercase">Closing Balance</div>
          <div
            class="text-lg font-semibold"
            :class="accountDetail.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(accountDetail.closingBalance) }}
          </div>
        </div>
      </div>

      <!-- Journal Entries -->
      <div class="border border-border rounded-xl bg-white overflow-hidden">
        <div class="px-6 py-4 border-b border-border">
          <h2 class="text-lg font-semibold">Journal Entries</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Date
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Reference
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Description
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"
                >
                  Debit
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"
                >
                  Credit
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase"
                >
                  Running Balance
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="entry in accountDetail.journalEntries"
                :key="entry.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-sm">{{ entry.journalDate }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="entry.referenceType" class="text-muted-foreground">
                    {{ entry.referenceType }}
                  </span>
                  <span v-else class="text-muted-foreground">-</span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <div>{{ entry.description || "-" }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-right">
                  {{ entry.debit > 0 ? formatCurrency(entry.debit) : "-" }}
                </td>
                <td class="px-4 py-3 text-sm text-right">
                  {{ entry.credit > 0 ? formatCurrency(entry.credit) : "-" }}
                </td>
                <td
                  class="px-4 py-3 text-sm text-right font-medium"
                  :class="entry.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(entry.runningBalance) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="accountDetail.journalEntries.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          No journal entries for this account in the selected period
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-muted-foreground">No account details available</div>
  </div>
</template>
