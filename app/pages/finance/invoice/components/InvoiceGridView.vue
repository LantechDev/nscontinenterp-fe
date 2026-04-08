<script setup lang="ts">
import { Receipt, Download } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: { code: string; name: string };
  company: { name: string };
  job?: { jobNumber: string };
}

interface Props {
  invoices: InvoiceData[];
  getStatusConfig: (code: string) => { label: string; class: string };
  formatCurrency: (value: unknown) => string;
  formatDate: (dateStr: string) => string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "row-click", id: string): void;
  (e: "download-pdf", id: string): void;
}>();

const handleClick = (id: string) => {
  emit("row-click", id);
};

const handleDownloadPdf = (id: string) => {
  emit("download-pdf", id);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="invoice in invoices"
      :key="invoice.id"
      :class="[
        'border border-border rounded-xl p-5 transition-all cursor-pointer',
        invoice.status?.code === 'VOIDED'
          ? 'bg-gray-50 opacity-60 hover:opacity-80 hover:shadow-none'
          : 'bg-white hover:shadow-sm',
      ]"
      @click="handleClick(invoice.id)"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
              invoice.status?.code === 'VOIDED'
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-50 text-[#012D5A]',
            ]"
          >
            <Receipt class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3
                :class="[
                  'font-bold text-base',
                  invoice.status?.code === 'VOIDED'
                    ? 'line-through text-gray-400'
                    : 'text-foreground',
                ]"
              >
                {{ invoice.invoiceNumber }}
              </h3>
              <span
                v-if="invoice.status?.code === 'VOIDED'"
                class="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded"
                >VOID</span
              >
            </div>
            <p class="text-xs text-muted-foreground">{{ formatDate(invoice.issuedDate) }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3 mb-4">
        <div>
          <p class="text-xs text-muted-foreground mb-1">Job No.</p>
          <p class="text-sm font-mono uppercase text-muted-foreground">
            {{ invoice.job?.jobNumber || "-" }}
          </p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-1">Customer</p>
          <p class="text-sm font-medium">{{ invoice.company?.name || "N/A" }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-1">Total Amount</p>
          <p class="text-lg font-bold text-[#012D5A]">{{ formatCurrency(invoice.total) }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-1">Due Date</p>
          <p class="text-sm text-gray-700">{{ formatDate(invoice.dueDate) }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-border">
        <span
          :class="
            cn(
              'px-2 py-0.5 rounded border text-xs font-medium',
              getStatusConfig(invoice.status?.code || 'UNPAID').class,
            )
          "
        >
          {{ getStatusConfig(invoice.status?.code || "UNPAID").label }}
        </span>
        <div class="flex gap-1">
          <button
            class="p-1.5 rounded hover:bg-muted transition-colors"
            @click.stop="handleDownloadPdf(invoice.id)"
          >
            <Download class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
