<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { ArrowUpRight, ArrowDownLeft } from "lucide-vue-next";
import JobInvoiceTab from "./JobInvoiceTab.vue";
import JobVendorInvoiceTab from "./JobVendorInvoiceTab.vue";
import JobProfitPreview from "./JobProfitPreview.vue";
import { useJobs } from "~/composables/useJobs";
import { Download, Loader2, Save, TrendingUp } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useInvoices } from "~/composables/useInvoices";
import { useFinanceExpense } from "~/composables/useFinanceExpense";
import { formatCurrencyAmount } from "~/utils/currency";
import type { EblParty } from "./ebl/types";
import type { ProfitExpense, ProfitInvoice } from "./ebl/types";

const { currentJob, getJob } = useJobs();
const { updateInvoice } = useInvoices();
const { updateExpense } = useFinanceExpense();
const profitPreviewRef = ref<InstanceType<typeof JobProfitPreview> | null>(null);
const isGeneratingPDF = ref(false);
const estimatedProfitExchangeRate = ref<number | null>(null);
const isApplyingProfitRate = ref(false);

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

const invoiceRowsNeedingEstimatedRate = computed<ProfitInvoice[]>(() =>
  (currentJob.value?.invoices || []).filter(
    (invoice) => !isVoided(invoice) && needsEstimatedRate(invoice),
  ),
);

const expenseRowsNeedingEstimatedRate = computed<ProfitExpense[]>(() =>
  (currentJob.value?.expenses || []).filter(
    (expense) => !isVoided(expense) && needsEstimatedRate(expense),
  ),
);

const needsEstimatedProfitRate = computed(
  () =>
    invoiceRowsNeedingEstimatedRate.value.length > 0 ||
    expenseRowsNeedingEstimatedRate.value.length > 0,
);

const canApplyEstimatedProfitRate = computed(
  () =>
    !props.isCompleted &&
    needsEstimatedProfitRate.value &&
    Number(estimatedProfitExchangeRate.value || 1) > 1,
);

const estimatedProfitRateNotice = computed(() => {
  if (!needsEstimatedProfitRate.value || !estimatedProfitExchangeRate.value) return "";
  return `Estimated API rate: 1 USD = ${formatCurrencyAmount(estimatedProfitExchangeRate.value, "IDR")}. Klik Isi Kurs Estimasi untuk menyimpan rate ini ke invoice/vendor invoice USD yang masih kosong.`;
});

const loadEstimatedProfitRate = async () => {
  if (
    subTab.value !== "profit" ||
    !needsEstimatedProfitRate.value ||
    estimatedProfitExchangeRate.value
  )
    return;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) estimatedProfitExchangeRate.value = res.rate;
  } catch {
    // Preview can still render the saved document values if the rate API is unavailable.
  }
};

const applyEstimatedProfitRate = async () => {
  const rate = Number(estimatedProfitExchangeRate.value || 1);
  if (!canApplyEstimatedProfitRate.value || rate <= 1) return;

  isApplyingProfitRate.value = true;
  try {
    const results = await Promise.all([
      ...invoiceRowsNeedingEstimatedRate.value.map((invoice) =>
        updateInvoice(invoice.id, {
          exchangeRate: rate,
          balanceDue: Number(invoice.balanceDue ?? invoice.total ?? 0),
        }),
      ),
      ...expenseRowsNeedingEstimatedRate.value.map((expense) =>
        updateExpense(expense.id, { exchangeRate: rate }),
      ),
    ]);
    const failed = results.find((result) => "success" in result && result.success === false);
    if (failed && "error" in failed) {
      toast.error(failed.error || "Gagal mengisi kurs estimasi profit analysis.");
      return;
    }

    estimatedProfitExchangeRate.value = null;
    await handleRefresh();
    toast.success("Kurs estimasi sudah diisi ke invoice dan vendor invoice.");
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

watch([subTab, needsEstimatedProfitRate], loadEstimatedProfitRate, { immediate: true });

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
        class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4"
      >
        <p
          v-if="estimatedProfitRateNotice"
          class="text-xs text-amber-900 font-semibold leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
        >
          {{ estimatedProfitRateNotice }}
        </p>
        <div class="flex items-center justify-end gap-2 ml-auto">
          <button
            v-if="canApplyEstimatedProfitRate"
            @click="applyEstimatedProfitRate"
            :disabled="isApplyingProfitRate"
            class="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md text-[11px] font-black uppercase tracking-wider gap-2 transition-all disabled:opacity-50"
          >
            <Loader2 v-if="isApplyingProfitRate" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            {{ isApplyingProfitRate ? "Mengisi" : "Isi Kurs Estimasi" }}
          </button>
          <button
            @click="handleDownloadProfit"
            :disabled="isGeneratingPDF"
            class="inline-flex items-center px-4 py-2 bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg shadow-md text-[11px] font-black uppercase tracking-wider gap-2 transition-all disabled:opacity-50"
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
        <JobProfitPreview ref="profitPreviewRef" :job="currentJob" />
      </div>
    </div>
  </div>
</template>
