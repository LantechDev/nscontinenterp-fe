<script setup lang="ts">
import { ArrowUpRight, ArrowDownLeft } from "lucide-vue-next";
import JobInvoiceTab from "./JobInvoiceTab.vue";
import JobVendorInvoiceTab from "./JobVendorInvoiceTab.vue";
import type { EblParty } from "./ebl/types";

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

const subTab = ref("ar"); // ar = Customer Invoices, ap = Vendor Invoices
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
    </div>

    <div class="pt-2">
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
    </div>
  </div>
</template>
