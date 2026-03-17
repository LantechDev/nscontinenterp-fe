<script setup lang="ts">
import { Receipt, Download, MoreVertical } from "lucide-vue-next";
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
}>();

const handleClick = (id: string) => {
  emit("row-click", id);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="invoice in invoices"
      :key="invoice.id"
      class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
      @click="handleClick(invoice.id)"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
          >
            <Receipt class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-bold text-base text-foreground">{{ invoice.invoiceNumber }}</h3>
            <p class="text-xs text-muted-foreground">{{ formatDate(invoice.issuedDate) }}</p>
          </div>
        </div>
        <button class="text-muted-foreground hover:text-foreground" @click.stop>
          <MoreVertical class="w-4 h-4" />
        </button>
      </div>

      <div class="space-y-3 mb-4">
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
        <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
          <Download class="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  </div>
</template>
