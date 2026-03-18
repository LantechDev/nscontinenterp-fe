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
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- Trial Balance Table -->
    <div v-else class="space-y-6">
      <div
        v-for="group in trialBalanceData"
        :key="group.type"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <!-- Group Header -->
        <button
          class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          @click="toggleGroup(group.type)"
        >
          <div class="flex items-center gap-2">
            <component
              :is="isGroupExpanded(group.type) ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground"
            />
            <span class="font-semibold text-[#012D5A]">{{ getTypeLabel(group.type) }}</span>
            <span class="text-sm text-muted-foreground">({{ group.items.length }} accounts)</span>
          </div>
          <div class="flex items-center gap-6 text-sm">
            <span class="text-muted-foreground">Debit: {{ formatCurrency(group.totalDebit) }}</span>
            <span class="text-muted-foreground"
              >Credit: {{ formatCurrency(group.totalCredit) }}</span
            >
          </div>
        </button>

        <!-- Group Content -->
        <div v-if="isGroupExpanded(group.type)" class="divide-y divide-border">
          <!-- Table Header -->
          <div
            class="hidden md:grid md:grid-cols-6 gap-4 px-4 py-2 bg-gray-50 text-xs font-medium text-muted-foreground uppercase"
          >
            <div class="col-span-1">Account Code</div>
            <div class="col-span-2">Account Name</div>
            <div class="col-span-1 text-right">Opening Balance</div>
            <div class="col-span-1 text-right">Debit</div>
            <div class="col-span-1 text-right">Credit</div>
          </div>

          <!-- Table Rows -->
          <div
            v-for="item in group.items"
            :key="item.id"
            class="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
            @click="handleRowClick(item.id)"
          >
            <div class="col-span-1 font-mono text-sm">{{ item.accountCode }}</div>
            <div class="col-span-2 text-sm">{{ item.accountName }}</div>
            <div
              class="col-span-1 text-right font-medium"
              :class="item.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatCurrency(item.openingBalance) }}
            </div>
            <div class="col-span-1 text-right">{{ formatCurrency(item.debitTotal) }}</div>
            <div
              class="col-span-1 text-right"
              :class="item.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatCurrency(item.closingBalance) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Grand Total -->
      <div class="border border-border rounded-xl bg-[#012D5A] text-white p-4">
        <div class="flex justify-between items-center">
          <span class="font-semibold">Grand Total</span>
          <div class="flex gap-8">
            <span>Debit: {{ formatCurrency(totalDebit) }}</span>
            <span>Credit: {{ formatCurrency(totalCredit) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="trialBalanceData.length === 0" class="text-center py-12 text-muted-foreground">
        No trial balance data available for the selected period
      </div>
    </div>
  </div>
</template>
