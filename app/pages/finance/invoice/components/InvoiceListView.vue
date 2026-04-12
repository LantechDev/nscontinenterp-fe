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
  job?: { id?: string; jobNumber: string };
}

interface Props {
  invoices: InvoiceData[];
  getStatusConfig: (code: string) => { label: string; class: string };
  formatCurrency: (value: unknown) => string;
  formatDate: (dateStr: string) => string;
}

const props = defineProps<Props>();

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

const groupedInvoices = computed(() => {
  const groups: Record<string, { jobKey: string; jobNumber: string; invoices: InvoiceData[] }> = {};

  props.invoices.forEach((invoice: InvoiceData) => {
    const jobKey = invoice.job?.jobNumber || "no-job";
    if (!groups[jobKey]) {
      groups[jobKey] = {
        jobKey,
        jobNumber: invoice.job?.jobNumber || "Tanpa Job",
        invoices: [],
      };
    }
    groups[jobKey].invoices.push(invoice);
  });

  return Object.values(groups);
});
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th class="py-3 px-4 text-sm font-medium text-foreground">No. Invoice</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Job No.</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Jatuh Tempo</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Total</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
            <th class="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in groupedInvoices" :key="group.jobKey">
            <!-- Job Header Row -->
            <tr class="bg-gray-50 border-b border-border">
              <td colspan="8" class="py-2.5 px-4">
                <div class="flex items-center gap-2">
                  <span
                    class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                    >Job:</span
                  >
                  <span class="text-sm font-bold text-[#012D5A]">{{ group.jobNumber }}</span>
                  <span
                    class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2"
                  >
                    {{ group.invoices.length }} INVOICE{{ group.invoices.length > 1 ? "S" : "" }}
                  </span>
                </div>
              </td>
            </tr>
            <!-- Invoice Rows -->
            <tr
              v-for="invoice in group.invoices"
              :key="invoice.id"
              :class="[
                'border-b border-border last:border-b transition-colors cursor-pointer',
                invoice.status?.code === 'VOIDED'
                  ? 'bg-gray-50/80 opacity-60 hover:opacity-80'
                  : 'hover:bg-muted/30',
              ]"
              @click="handleClick(invoice.id)"
            >
              <td class="py-3 px-4 pl-8">
                <div class="flex items-center gap-2">
                  <div
                    :class="[
                      'p-1.5 rounded',
                      invoice.status?.code === 'VOIDED'
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-50 text-[#012D5A]',
                    ]"
                  >
                    <Receipt class="w-4 h-4" />
                  </div>
                  <span
                    :class="[
                      'text-sm font-medium',
                      invoice.status?.code === 'VOIDED' ? 'line-through text-gray-400' : '',
                    ]"
                  >
                    {{ invoice.invoiceNumber }}
                  </span>
                  <span
                    v-if="invoice.status?.code === 'VOIDED'"
                    class="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded"
                  >
                    VOID
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm font-mono text-muted-foreground uppercase">
                {{ invoice.job?.jobNumber || "-" }}
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ invoice.company?.name || "N/A" }}</td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ formatDate(invoice.issuedDate) }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="py-3 px-4 text-sm font-medium">{{ formatCurrency(invoice.total) }}</td>
              <td class="py-3 px-4">
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
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex gap-1 justify-end">
                  <button
                    class="p-1.5 rounded hover:bg-muted transition-colors"
                    @click.stop="handleDownloadPdf(invoice.id)"
                  >
                    <Download class="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
