<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowUpRight, ArrowDownLeft } from "lucide-vue-next";
import JobInvoiceTab from "./JobInvoiceTab.vue";
import JobVendorInvoiceTab from "./JobVendorInvoiceTab.vue";
import JobProfitPreview from "./JobProfitPreview.vue";
import { useJobs } from "~/composables/useJobs";
import { Download, Loader2, TrendingUp } from "lucide-vue-next";
import type { EblParty } from "./ebl/types";

const { currentJob, getJob } = useJobs();
const profitPreviewRef = ref<InstanceType<typeof JobProfitPreview> | null>(null);
const isGeneratingPDF = ref(false);

const handleDownloadProfit = async () => {
  if (!profitPreviewRef.value) return;
  isGeneratingPDF.value = true;
  await profitPreviewRef.value.generatePDF();
  isGeneratingPDF.value = false;
};

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId?: string;
  jobParties?: EblParty[];
  initialInvoiceId?: string;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-job"): void;
}>();

const subTab = ref("ar"); // ar = Customer Invoices, ap = Vendor Invoices, profit = Profit Analysis

onMounted(async () => {
  if (!currentJob.value && props.jobId) {
    await getJob(props.jobId);
  }
});
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
      <div v-if="subTab === 'profit'" class="flex justify-end mb-4">
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
      <!-- Customer Billing (A/R) -->
      <div v-if="subTab === 'ar'" class="animate-fade-in">
        <JobInvoiceTab
          :job-id="jobId"
          :job-number="jobNumber"
          :customer-id="customerId"
          :job-parties="jobParties"
          :initial-invoice-id="initialInvoiceId"
          :is-completed="isCompleted"
          @refresh-job="emit('refresh-job')"
        />
      </div>

      <!-- Vendor Invoices (A/P) -->
      <div v-else-if="subTab === 'ap'" class="animate-fade-in">
        <JobVendorInvoiceTab
          :job-id="jobId"
          :job-number="jobNumber"
          :job-parties="jobParties"
          :is-completed="isCompleted"
          @refresh-job="emit('refresh-job')"
        />
      </div>

      <!-- Profit Analysis -->
      <div v-else-if="subTab === 'profit'" class="animate-fade-in">
        <JobProfitPreview ref="profitPreviewRef" :job="currentJob" />
      </div>
    </div>
  </div>
</template>
