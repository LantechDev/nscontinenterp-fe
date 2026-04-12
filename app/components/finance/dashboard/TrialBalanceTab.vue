<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Search, ChevronDown, ChevronUp } from "lucide-vue-next";
import { cn, formatRupiah } from "~/lib/utils";
import type { TrialBalanceGroup } from "~/types/finance-dashboard";

const props = defineProps<{
  selectedPeriod: string;
  selectedYear: string;
  availableYears: string[];
}>();

const emit = defineEmits<{
  (e: "update:selectedYear", value: string): void;
  (e: "yearChange", value: string): void;
}>();

// State
const isLoading = ref(false);
const trialBalanceData = ref<TrialBalanceGroup[]>([]);
const error = ref<string | null>(null);
// Use array instead of Set for SSR compatibility
const expandedGroups = ref<string[]>([
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "COGS",
  "EXPENSE",
]);

const formatCurrency = formatRupiah;

// Get API base URL
const config = useRuntimeConfig();
const baseUrl = config.public.apiBase || "";

// Fetch trial balance data
async function fetchTrialBalance() {
  const requestId = Date.now();
  isLoading.value = true;
  error.value = null;

  try {
    const queryParams = new URLSearchParams({
      period: props.selectedPeriod,
    });

    if (props.selectedYear) {
      queryParams.append("year", props.selectedYear);
    }

    const data = await $fetch<TrialBalanceGroup[]>(
      `${baseUrl}/finance/dashboard/trial-balance?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    trialBalanceData.value = data || [];
  } catch (err) {
    console.error("Failed to fetch trial balance:", err);
    error.value = "Failed to load trial balance data";
    trialBalanceData.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Handle row click
function handleRowClick(accountId: string) {
  // Navigate to account detail page
  const router = useRouter();
  const queryParams = new URLSearchParams({
    period: props.selectedPeriod,
  });
  if (props.selectedYear) {
    queryParams.append("year", props.selectedYear);
  }
  router.push(`/finance/trial-balance/${accountId}?${queryParams.toString()}`);
}

// Toggle group expansion
function toggleGroup(groupType: string) {
  const index = expandedGroups.value.indexOf(groupType);
  if (index > -1) {
    expandedGroups.value.splice(index, 1);
  } else {
    expandedGroups.value.push(groupType);
  }
}

// Helper to check if group is expanded
function isGroupExpanded(groupType: string): boolean {
  return expandedGroups.value.includes(groupType);
}

// Get type label
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ASSET: "Assets",
    LIABILITY: "Liabilities",
    EQUITY: "Equity",
    REVENUE: "Revenue",
    COGS: "Cost of Goods Sold",
    EXPENSE: "Expenses",
  };
  return labels[type] || type;
}

// Watch for filter changes - only fetch after mount to avoid SSR hydration issues
watch(
  () => [props.selectedPeriod, props.selectedYear],
  () => {
    // Only fetch on client-side after initial mount
    if (import.meta.client) {
      fetchTrialBalance();
    }
  },
);

// Fetch data on mount (client-side only)
onMounted(() => {
  fetchTrialBalance();
});

// Handle year change
function handleYearChange(year: string) {
  emit("update:selectedYear", year);
  emit("yearChange", year);
}

// Calculate totals
const totalDebit = computed(() => {
  return trialBalanceData.value.reduce((sum, group) => sum + group.totalDebit, 0);
});

const totalCredit = computed(() => {
  return trialBalanceData.value.reduce((sum, group) => sum + group.totalCredit, 0);
});
</script>

<template>
  <div class="space-y-4 px-6">
    <!-- Header: Grand Total + Action -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border rounded-xl bg-[#012D5A] text-white p-5"
    >
      <div class="flex items-center gap-8">
        <h2 class="text-lg font-semibold">Grand Total</h2>
        <div class="flex items-center gap-6 text-sm">
          <div class="flex flex-col">
            <span class="text-white/60 text-xs">Debit</span>
            <span class="font-semibold text-base">{{ formatCurrency(totalDebit) }}</span>
          </div>
          <div class="w-px h-8 bg-white/20"></div>
          <div class="flex flex-col">
            <span class="text-white/60 text-xs">Credit</span>
            <span class="font-semibold text-base">{{ formatCurrency(totalCredit) }}</span>
          </div>
        </div>
      </div>
      <NuxtLink
        to="/finance/journal/create"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#012D5A] hover:bg-white/90 rounded-lg transition-colors"
      >
        <span>Input Jurnal</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading trial balance...</span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
    >
      {{ error }}
    </div>

    <!-- Trial Balance Groups -->
    <div v-else class="space-y-4">
      <div
        v-for="group in trialBalanceData"
        :key="group.type"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <!-- Group Header -->
        <button
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
          @click="toggleGroup(group.type)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="isGroupExpanded(group.type) ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground"
            />
            <h2 class="text-lg font-semibold text-[#012D5A]">
              {{ getTypeLabel(group.type) }}
            </h2>
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-muted-foreground"
              >{{ group.items.length }} accounts</span
            >
          </div>
          <div class="flex items-center gap-6 text-sm">
            <span class="text-muted-foreground"
              >Debit:
              <span class="font-semibold text-foreground">{{
                formatCurrency(group.totalDebit)
              }}</span></span
            >
            <span class="text-muted-foreground"
              >Credit:
              <span class="font-semibold text-foreground">{{
                formatCurrency(group.totalCredit)
              }}</span></span
            >
          </div>
        </button>

        <!-- Group Content - Table -->
        <div v-if="isGroupExpanded(group.type)" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-t border-border bg-gray-50/50">
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Code</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Name</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">
                  Opening Balance
                </th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Debit</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer transition-colors"
                @click="handleRowClick(item.id)"
              >
                <td class="py-3 px-4">
                  <span class="text-sm font-medium text-[#012D5A]">{{ item.accountCode }}</span>
                </td>
                <td class="py-3 px-4 text-sm">{{ item.accountName }}</td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  <span :class="item.openingBalance >= 0 ? 'text-green-700' : 'text-red-600'">{{
                    formatCurrency(item.openingBalance)
                  }}</span>
                </td>
                <td class="py-3 px-4 text-sm text-right">
                  {{ formatCurrency(item.debitTotal) }}
                </td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  <span :class="item.closingBalance >= 0 ? 'text-green-700' : 'text-red-600'">{{
                    formatCurrency(item.closingBalance)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grand Total Footer -->
      <div class="border border-border rounded-xl bg-[#012D5A] text-white overflow-hidden">
        <div class="flex justify-between items-center p-5">
          <h2 class="text-lg font-semibold">Grand Total</h2>
          <div class="flex gap-8 text-sm">
            <span
              >Debit: <span class="font-semibold">{{ formatCurrency(totalDebit) }}</span></span
            >
            <span
              >Credit: <span class="font-semibold">{{ formatCurrency(totalCredit) }}</span></span
            >
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="trialBalanceData.length === 0"
        class="border border-border rounded-xl bg-white text-center py-12 text-muted-foreground"
      >
        No trial balance data available for the selected period
      </div>
    </div>
  </div>
</template>
