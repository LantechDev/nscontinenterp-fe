<script setup lang="ts">
import { AlertTriangle, ChevronDown, ChevronUp, Download } from "lucide-vue-next";
import FinanceStatCard from "~/components/finance/StatCard.vue";
import { formatFullRupiah } from "~/lib/utils";
import type { CashFlowActivityGroup, CashFlowReport } from "~/types/finance-dashboard";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";

const props = defineProps<{
  selectedYear: string;
  availableYears: string[];
}>();

const emit = defineEmits<{
  (e: "update:reportData", value: CashFlowReport | null): void;
  (e: "export", event: MouseEvent): void;
}>();

const baseUrl = "/api";
const isLoading = ref(false);
const error = ref<string | null>(null);
const report = ref<CashFlowReport | null>(null);
const localYear = ref(props.selectedYear || new Date().getFullYear().toString());
const yearOptions = computed(() => props.availableYears.map((year) => ({ id: year, name: year })));
const startDate = ref(`${localYear.value}-01-01`);
const endDate = ref(`${localYear.value}-12-31`);
const expandedGroups = ref<string[]>(["OPERATING", "INVESTING", "FINANCING"]);

const statCards = computed(() => [
  {
    title: "Opening Cash",
    value: formatFullRupiah(report.value?.openingCashBalance || 0),
    isPrimary: true,
  },
  {
    title: "Cash In",
    value: formatFullRupiah(report.value?.cashIn || 0),
    color: "green" as const,
  },
  {
    title: "Cash Out",
    value: formatFullRupiah(report.value?.cashOut || 0),
    color: "red" as const,
  },
  {
    title: "Net Cash",
    value: formatFullRupiah(report.value?.netCashFlow || 0),
    color: "blue" as const,
  },
  {
    title: "Closing Cash",
    value: formatFullRupiah(report.value?.closingCashBalance || 0),
    color: "neutral" as const,
  },
]);

async function fetchCashFlow() {
  if (!startDate.value || !endDate.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const queryParams = new URLSearchParams({
      startDate: startDate.value,
      endDate: endDate.value,
      method: "direct",
    });

    const data = await $fetch<CashFlowReport>(
      `${baseUrl}/finance/report/cash-flow?${queryParams.toString()}`,
    );
    report.value = data;
    emit("update:reportData", data);
  } catch (err) {
    console.error("Failed to fetch cash flow:", err);
    error.value = "Failed to load cash flow data";
    report.value = null;
    emit("update:reportData", null);
  } finally {
    isLoading.value = false;
  }
}

watch(localYear, (newYear) => {
  if (newYear) {
    startDate.value = `${newYear}-01-01`;
    endDate.value = `${newYear}-12-31`;
  }
});

function toggleGroup(activity: string) {
  const index = expandedGroups.value.indexOf(activity);
  if (index > -1) expandedGroups.value.splice(index, 1);
  else expandedGroups.value.push(activity);
}

function isGroupExpanded(activity: string) {
  return expandedGroups.value.includes(activity);
}

const groups = computed<CashFlowActivityGroup[]>(() =>
  report.value
    ? [report.value.groups.operating, report.value.groups.investing, report.value.groups.financing]
    : [],
);

watch([startDate, endDate], () => fetchCashFlow());

onMounted(() => {
  fetchCashFlow();
});
</script>

<template>
  <div class="space-y-6 px-6">
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-[#012D5A]">Cash Flow</h2>
        <p class="text-sm text-muted-foreground">
          {{ report?.startDate || startDate }} to {{ report?.endDate || endDate }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <Combobox
          v-model="localYear"
          :options="yearOptions"
          placeholder="Year"
          class="min-w-[130px]"
        />
        <DatePicker v-model="startDate" placeholder="Start Date" class="min-w-[160px]" />
        <DatePicker v-model="endDate" placeholder="End Date" class="min-w-[160px]" />
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 h-10"
          @click="emit('export', $event)"
        >
          <Download class="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statCards"
        :key="card.title"
        :card="card"
        :index="index"
      />
    </div>

    <div
      v-if="report?.unclassified.count"
      class="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl"
    >
      <AlertTriangle class="w-5 h-5 mt-0.5 shrink-0" />
      <div class="text-sm">
        <p class="font-medium">Some counterpart accounts do not have cash flow metadata.</p>
        <p class="text-amber-700">
          They are reported under Operating Activities until COA mapping is completed.
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2">
        <div
          class="w-6 h-6 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-muted-foreground">Loading cash flow...</span>
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
        :key="group.activity"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <button
          class="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
          @click="toggleGroup(group.activity)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="isGroupExpanded(group.activity) ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground"
            />
            <h3 class="text-base font-semibold text-[#012D5A]">{{ group.label }}</h3>
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-muted-foreground">
              {{ group.items.length }} accounts
            </span>
          </div>
          <span class="text-sm font-semibold text-foreground">
            {{ formatFullRupiah(group.netCashFlow) }}
          </span>
        </button>

        <div v-if="isGroupExpanded(group.activity)" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-t border-border bg-gray-50/50">
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Code</th>
                <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Account Name</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Cash In</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Cash Out</th>
                <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Net</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in group.items"
                :key="item.accountId"
                class="border-b border-gray-100"
              >
                <td class="py-3 px-4 text-sm font-medium text-[#012D5A]">{{ item.accountCode }}</td>
                <td class="py-3 px-4 text-sm">{{ item.accountName }}</td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  {{ formatFullRupiah(item.cashIn) }}
                </td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  {{ formatFullRupiah(item.cashOut) }}
                </td>
                <td class="py-3 px-4 text-sm text-right font-semibold">
                  {{ formatFullRupiah(item.netCashFlow) }}
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="py-3 px-4 text-sm font-bold" colspan="2">Total {{ group.label }}</td>
                <td class="py-3 px-4 text-sm text-right font-bold">
                  {{ formatFullRupiah(group.cashIn) }}
                </td>
                <td class="py-3 px-4 text-sm text-right font-bold">
                  {{ formatFullRupiah(group.cashOut) }}
                </td>
                <td class="py-3 px-4 text-sm text-right font-bold">
                  {{ formatFullRupiah(group.netCashFlow) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
