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
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-white text-left">
            <th class="py-3 px-4 text-sm font-medium text-foreground">No. Invoice</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Jatuh Tempo</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Total</th>
            <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
            <th class="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
            @click="handleClick(invoice.id)"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-2">
                <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                  <Receipt class="w-4 h-4" />
                </div>
                <span class="text-sm font-medium">{{ invoice.invoiceNumber }}</span>
              </div>
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
                <button class="p-1.5 rounded hover:bg-muted transition-colors" @click.stop>
                  <Download class="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
