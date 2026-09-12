<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { ArrowUpRight, ArrowDownLeft } from "lucide-vue-next";
import JobInvoiceTab from "./JobInvoiceTab.vue";
import JobVendorInvoiceTab from "./JobVendorInvoiceTab.vue";
import JobProfitPreview from "./JobProfitPreview.vue";
import { useJobs } from "~/composables/useJobs";
import { Download, Loader2, RefreshCw, Save, TrendingUp } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useInvoices } from "~/composables/useInvoices";
import { useFinanceExpense } from "~/composables/useFinanceExpense";
import { formatCurrencyAmount } from "~/utils/currency";
import { parseProfitReportExchangeRateInput } from "~/utils/jobProfitReport";
import type { EblParty } from "./ebl/types";
import type { ProfitExpense, ProfitInvoice } from "./ebl/types";

const { currentJob, getJob } = useJobs();
const { updateInvoice } = useInvoices();
const { updateExpense } = useFinanceExpense();
const profitPreviewRef = ref<InstanceType<typeof JobProfitPreview> | null>(null);
const isGeneratingPDF = ref(false);
const estimatedProfitExchangeRate = ref<number | null>(null);
const showProfitRateInput = ref(false);
const isApplyingProfitRate = ref(false);
const isFetchingProfitRate = ref(false);

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  quotationId?: string | null;
  customerId?: string;
  jobParties?: EblParty[];
  initialInvoiceId?: string;
  initialSubTab?: string;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-job"): void;
}>();

const subTab = ref(props.initialSubTab || "ar"); // ar = Customer Invoices, ap = Vendor Invoices, profit = Profit Analysis

const getStatusCode = (status?: string | { code?: string; name?: string } | null) => {
  if (!status) return "";
  return (typeof status === "string" ? status : status.code || status.name || "").toUpperCase();
};

const isVoided = (item: { status?: string | { code?: string; name?: string } | null }) =>
  getStatusCode(item.status) === "VOIDED" || getStatusCode(item.status) === "VOID";

const needsEstimatedRate = (item: {
  currency?: string | null;
  exchangeRate?: string | number | null;
}) => (item.currency || "IDR") === "USD" && Number(item.exchangeRate || 1) <= 1;

const usesUsdRate = (item: { currency?: string | null }) => (item.currency || "IDR") === "USD";

const invoiceRowsUsingProfitRate = computed<ProfitInvoice[]>(() =>
  (currentJob.value?.invoices || []).filter(
    (invoice) => !isVoided(invoice) && usesUsdRate(invoice),
  ),
);

const expenseRowsUsingProfitRate = computed<ProfitExpense[]>(() =>
  (currentJob.value?.expenses || []).filter(
    (expense) => !isVoided(expense) && usesUsdRate(expense),
  ),
);

const invoiceRowsNeedingEstimatedRate = computed<ProfitInvoice[]>(() =>
  invoiceRowsUsingProfitRate.value.filter((invoice) => needsEstimatedRate(invoice)),
);

const expenseRowsNeedingEstimatedRate = computed<ProfitExpense[]>(() =>
  expenseRowsUsingProfitRate.value.filter((expense) => needsEstimatedRate(expense)),
);

const hasProfitRateRows = computed(
  () => invoiceRowsUsingProfitRate.value.length > 0 || expenseRowsUsingProfitRate.value.length > 0,
);

const needsEstimatedProfitRate = computed(
  () =>
    invoiceRowsNeedingEstimatedRate.value.length > 0 ||
    expenseRowsNeedingEstimatedRate.value.length > 0,
);

const savedProfitExchangeRates = computed(() => {
  const allRows = [...invoiceRowsUsingProfitRate.value, ...expenseRowsUsingProfitRate.value];
  const rates = allRows
    .map((row) => Number(row.exchangeRate || 1))
    .filter((rate) => Number.isFinite(rate) && rate > 1);
  return Array.from(new Set(rates));
});

const canApplyEstimatedProfitRate = computed(
  () =>
    !props.isCompleted &&
    hasProfitRateRows.value &&
    Number(estimatedProfitExchangeRate.value || 1) > 1,
);

const estimatedProfitRateNotice = computed(() => {
  if (showProfitRateInput.value && estimatedProfitExchangeRate.value) {
    return `1 USD = ${formatCurrencyAmount(estimatedProfitExchangeRate.value, "IDR")}`;
  }
  if (showProfitRateInput.value) {
    return "Masukkan kurs untuk preview profit. Tarik API kalau ingin pakai kurs terbaru.";
  }
  if (!hasProfitRateRows.value) return "Tidak ada invoice/vendor invoice USD di job ini.";
  if (savedProfitExchangeRates.value.length === 1) {
    const [savedRate] = savedProfitExchangeRates.value;
    if (savedRate) {
      return `Kurs USD tersimpan: 1 USD = ${formatCurrencyAmount(savedRate, "IDR")}. Kamu tetap bisa edit.`;
    }
  }
  if (savedProfitExchangeRates.value.length > 1) {
    return `${savedProfitExchangeRates.value.length} kurs USD berbeda tersimpan. Edit kurs untuk menyamakan.`;
  }
  return "Invoice/vendor invoice USD masih ada yang belum punya kurs.";
});

const effectiveProfitExchangeRate = computed(() =>
  Number(estimatedProfitExchangeRate.value || 1) > 1
    ? Number(estimatedProfitExchangeRate.value)
    : null,
);

const parseRateInput = (val: string) => {
  return parseProfitReportExchangeRateInput(val);
};

const formatRateInput = (val: number | string | null) => {
  if (val === undefined || val === null || val === "") return "";
  const numericVal = typeof val === "string" ? parseRateInput(val) : val;
  if (!numericVal || !Number.isFinite(numericVal)) return "";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericVal);
};

const getSavedProfitExchangeRate = () => {
  return savedProfitExchangeRates.value[0] ?? null;
};

const loadEstimatedProfitRate = async (force = false) => {
  if (
    subTab.value !== "profit" ||
    (!hasProfitRateRows.value && !showProfitRateInput.value) ||
    (!force && estimatedProfitExchangeRate.value)
  )
    return;
  isFetchingProfitRate.value = true;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) estimatedProfitExchangeRate.value = res.rate;
  } catch {
    toast.error("Gagal tarik kurs dari API.");
  } finally {
    isFetchingProfitRate.value = false;
  }
};

const openProfitRateInput = async () => {
  showProfitRateInput.value = true;
  estimatedProfitExchangeRate.value =
    estimatedProfitExchangeRate.value || getSavedProfitExchangeRate();
  await loadEstimatedProfitRate();
};

const refreshProfitRateFromApi = async () => {
  showProfitRateInput.value = true;
  await loadEstimatedProfitRate(true);
};

const applyEstimatedProfitRate = async () => {
  const rate = Number(estimatedProfitExchangeRate.value || 1);
  if (!canApplyEstimatedProfitRate.value || rate <= 1) return;

  isApplyingProfitRate.value = true;
  try {
    const results = await Promise.all([
      ...invoiceRowsUsingProfitRate.value.map((invoice) =>
        updateInvoice(invoice.id, {
          exchangeRate: rate,
          balanceDue: Number(invoice.balanceDue ?? invoice.total ?? 0),
        }),
      ),
      ...expenseRowsUsingProfitRate.value.map((expense) =>
        updateExpense(expense.id, { exchangeRate: rate }),
      ),
    ]);
    const failed = results.find((result) => "success" in result && result.success === false);
    if (failed && "error" in failed) {
      toast.error(failed.error || "Gagal mengisi kurs estimasi profit analysis.");
      return;
    }

    await handleRefresh();
    estimatedProfitExchangeRate.value = rate;
    toast.success("Kurs sudah disimpan ke invoice dan vendor invoice USD.");
  } catch (error: unknown) {
    toast.error((error as Error).message || "Gagal mengisi kurs estimasi profit analysis.");
  } finally {
    isApplyingProfitRate.value = false;
  }
};

const handleDownloadProfit = async () => {
  if (!profitPreviewRef.value) return;
  isGeneratingPDF.value = true;
  await profitPreviewRef.value.generatePDF();
  isGeneratingPDF.value = false;
};

onMounted(async () => {
  if (props.jobId) {
    await getJob(props.jobId);
  }
  if (props.initialSubTab) {
    subTab.value = props.initialSubTab;
  }
});

watch(
  [() => props.jobId, () => props.initialSubTab],
  ([newJobId, newSubTab]) => {
    showProfitRateInput.value = false;
    estimatedProfitExchangeRate.value = null;
    if (newSubTab) {
      subTab.value = newSubTab;
    } else {
      subTab.value = "ar";
    }
  },
  { immediate: true },
);

watch(subTab, async (newVal) => {
  if (newVal === "profit" && props.jobId) {
    await getJob(props.jobId);
    await loadEstimatedProfitRate();
  }
});

const handleRefresh = async () => {
  if (props.jobId) {
    await getJob(props.jobId);
  }
  emit("refresh-job");
};
</script>

<template>
  <div class="space-y-6">
    <!-- Sub-tabs header -->
    <div class="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl w-fit border border-gray-200">
      <button
        @click="subTab = 'ar'"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
        :class="
          subTab === 'ar'
            ? 'bg-white text-[#012D5A] shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <ArrowUpRight class="w-3.5 h-3.5" />
        Customer Billing (A/R)
      </button>
      <button
        @click="subTab = 'ap'"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
        :class="
          subTab === 'ap'
            ? 'bg-white text-red-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <ArrowDownLeft class="w-3.5 h-3.5" />
        Vendor Invoices (A/P)
      </button>
      <button
        @click="subTab = 'profit'"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
        :class="
          subTab === 'profit'
            ? 'bg-white text-emerald-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <TrendingUp class="w-3.5 h-3.5" />
        Profit Analysis
      </button>
    </div>

    <div class="pt-2">
      <div
        v-if="subTab === 'profit'"
        class="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="min-w-0">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Kurs Profit Analysis
          </p>
          <p
            v-if="estimatedProfitRateNotice"
            class="mt-0.5 text-xs font-semibold leading-relaxed text-slate-700"
          >
            {{ estimatedProfitRateNotice }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
          <div
            v-if="showProfitRateInput"
            class="flex h-10 items-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
          >
            <span
              class="flex h-full items-center border-r border-slate-200 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              USD
            </span>
            <input
              type="text"
              :value="formatRateInput(estimatedProfitExchangeRate)"
              @input="
                (e) =>
                  (estimatedProfitExchangeRate = parseRateInput(
                    (e.target as HTMLInputElement).value,
                  ))
              "
              class="h-full w-28 bg-transparent px-3 text-right text-sm font-black text-[#062c58] outline-none"
              placeholder="17.603"
            />
          </div>
          <button
            v-if="hasProfitRateRows && !showProfitRateInput"
            @click="openProfitRateInput"
            class="inline-flex h-10 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-[11px] font-black uppercase tracking-wider text-amber-800 transition-colors hover:bg-amber-100"
          >
            <Save class="w-4 h-4" />
            {{ needsEstimatedProfitRate ? "Isi Kurs Estimasi" : "Edit Kurs" }}
          </button>
          <button
            v-if="showProfitRateInput"
            @click="refreshProfitRateFromApi"
            :disabled="isFetchingProfitRate"
            class="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-black uppercase tracking-wider text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <Loader2 v-if="isFetchingProfitRate" class="w-4 h-4 animate-spin" />
            <RefreshCw v-else class="w-4 h-4" />
            Tarik API
          </button>
          <button
            v-if="showProfitRateInput && canApplyEstimatedProfitRate"
            @click="applyEstimatedProfitRate"
            :disabled="isApplyingProfitRate"
            class="inline-flex h-10 items-center gap-2 rounded-md bg-amber-600 px-3 text-[11px] font-black uppercase tracking-wider text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
          >
            <Loader2 v-if="isApplyingProfitRate" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            {{ isApplyingProfitRate ? "Menyimpan" : "Simpan Kurs" }}
          </button>
          <button
            @click="handleDownloadProfit"
            :disabled="isGeneratingPDF"
            class="inline-flex h-10 items-center gap-2 rounded-md bg-[#062c58] px-3 text-[11px] font-black uppercase tracking-wider text-white transition-colors hover:bg-[#062c58]/90 disabled:opacity-50"
          >
            <Loader2 v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" />
            <Download v-else class="w-4 h-4" />
            {{ isGeneratingPDF ? "Generating" : "Download Profit Report" }}
          </button>
        </div>
      </div>
      <!-- Customer Billing (A/R) -->
      <div v-if="subTab === 'ar'" class="animate-fade-in">
        <JobInvoiceTab
          :job-id="jobId"
          :job-number="jobNumber"
          :quotation-id="quotationId"
          :customer-id="customerId"
          :job-parties="jobParties"
          :initial-invoice-id="initialInvoiceId"
          :is-completed="isCompleted"
          @refresh-job="handleRefresh"
        />
      </div>

      <!-- Vendor Invoices (A/P) -->
      <div v-else-if="subTab === 'ap'" class="animate-fade-in">
        <JobVendorInvoiceTab
          :job-id="jobId"
          :job-number="jobNumber"
          :customer-id="customerId"
          :job-parties="jobParties"
          :initial-invoice-id="initialInvoiceId"
          :is-completed="isCompleted"
          @refresh-job="handleRefresh"
        />
      </div>

      <!-- Profit Analysis -->
      <div v-else-if="subTab === 'profit'" class="animate-fade-in">
        <JobProfitPreview
          ref="profitPreviewRef"
          :job="currentJob"
          :fallback-exchange-rate="effectiveProfitExchangeRate"
        />
      </div>
    </div>
  </div>
</template>
