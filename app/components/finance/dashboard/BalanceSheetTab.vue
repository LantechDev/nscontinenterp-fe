<script setup lang="ts">
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Download } from "lucide-vue-next";
import FinanceStatCard from "~/components/finance/StatCard.vue";
import { cn, formatFullRupiah } from "~/lib/utils";
import type { BalanceSheetGroup, BalanceSheetReport } from "~/types/finance-dashboard";

const props = defineProps<{
  selectedYear: string;
  availableYears: string[];
}>();

const emit = defineEmits<{
  (e: "update:reportData", value: BalanceSheetReport | null): void;
  (e: "export", event: MouseEvent): void;
}>();

const baseUrl = "/api";
const isLoading = ref(false);
const error = ref<string | null>(null);
const report = ref<BalanceSheetReport | null>(null);
const asOfDate = ref(new Date().toISOString().split("T")[0]);
const localYear = ref(props.selectedYear || new Date().getFullYear().toString());
const expandedGroups = ref<string[]>(["ASSET", "LIABILITY", "EQUITY"]);

const statCards = computed(() => [
  {
    title: "Total Assets",
    value: formatFullRupiah(report.value?.totals.totalAssets || 0),
    isPrimary: true,
  },
  {
    title: "Total Liabilities",
    value: formatFullRupiah(report.value?.totals.totalLiabilities || 0),
    color: "blue" as const,
  },
  {
    title: "Total Equity",
    value: formatFullRupiah(report.value?.totals.totalEquity || 0),
    color: "green" as const,
  },
  {
    title: "Balance Difference",
    value: formatFullRupiah(report.value?.balanceDifference || 0),
    color: report.value?.isBalanced ? ("neutral" as const) : ("red" as const),
    changeLabel: report.value?.isBalanced ? "Balanced" : "Needs review",
  },
]);

async function fetchBalanceSheet() {
  if (!asOfDate.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const queryParams = new URLSearchParams({ asOfDate: asOfDate.value });
    if (localYear.value) queryParams.append("year", localYear.value);

    const data = await $fetch<BalanceSheetReport>(
      `${baseUrl}/finance/report/balance-sheet?${queryParams.toString()}`,
    );
    report.value = data;
    emit("update:reportData", data);
  } catch (err) {
    console.error("Failed to fetch balance sheet:", err);
    error.value = "Failed to load balance sheet data";
    report.value = null;
    emit("update:reportData", null);
  } finally {
    isLoading.value = false;
  }
}

function toggleGroup(groupType: string) {
  const index = expandedGroups.value.indexOf(groupType);
  if (index > -1) expandedGroups.value.splice(index, 1);
  else expandedGroups.value.push(groupType);
}

function isGroupExpanded(groupType: string) {
  return expandedGroups.value.includes(groupType);
}

function handleYearChange() {
  if (localYear.value) {
    asOfDate.value = `${localYear.value}-12-31`;
  }
  fetchBalanceSheet();
}

const groups = computed<BalanceSheetGroup[]>(() =>
  report.value ? [report.value.assets, report.value.liabilities, report.value.equity] : [],
);

watch([asOfDate, localYear], () => fetchBalanceSheet());

onMounted(() => {
  fetchBalanceSheet();
});
</script>

<template>
  <div class="space-y-6 px-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <component
          :is="report?.isBalanced ? CheckCircle2 : AlertTriangle"
          :class="cn('w-5 h-5', report?.isBalanced ? 'text-emerald-600' : 'text-amber-600')"
        />
        <div>
          <h2 class="text-lg font-semibold text-[#012D5A]">Balance Sheet</h2>
          <p class="text-sm text-muted-foreground">As of {{ report?.asOfDate || asOfDate }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <select v-model="localYear" class="input-field min-w-[130px]" @change="handleYearChange">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <input v-model="asOfDate" type="date" class="input-field min-w-[160px]" />
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90"
          @click="emit('export', $event)"
        >
          <Download class="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statCards"
        :key="card.title"
        :card="card"
        :index="index"
      />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading balance sheet...</span>
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
    >
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="group in groups"
        :key="group.type"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
          @click="toggleGroup(group.type)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="isGroupExpanded(group.type) ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground"
            />
            <h3 class="text-base font-semibold text-[#012D5A]">{{ group.label }}</h3>
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-muted-foreground">
              {{ group.items.length }} accounts
            </span>
          </div>
          <span class="text-sm font-semibold text-foreground">{{
            formatFullRupiah(group.total)
          }}</span>
        </button>

        <div v-if="isGroupExpanded(group.type)" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-t border-border bg-gray-50/50">
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Code</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Name</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.items" :key="item.id" class="border-b border-gray-100">
                <td class="py-3 px-4 text-sm font-medium text-[#012D5A]">{{ item.accountCode }}</td>
                <td class="py-3 px-4 text-sm">{{ item.accountName }}</td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  {{ formatFullRupiah(item.balance) }}
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="py-3 px-4 text-sm font-bold" colspan="2">Total {{ group.label }}</td>
                <td class="py-3 px-4 text-sm text-right font-bold">
                  {{ formatFullRupiah(group.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
