<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import type { CompanyInvoice } from "~/composables/useCompanies";

defineProps<{
  invoices: CompanyInvoice[];
}>();

const formatShortDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5">
    Invoices
  </div>

  <template v-if="invoices.length > 0">
    <div
      v-for="invoice in invoices"
      :key="invoice.id"
      class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-center items-start gap-2 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <div class="self-stretch flex justify-between items-start">
        <div class="flex justify-start items-start gap-3">
          <div class="inline-flex flex-col justify-start items-start gap-1">
            <div class="text-black text-xs font-semibold font-['Inter'] leading-4">
              {{ invoice.invoiceNumber }}
            </div>
            <div class="text-gray-500 text-xs font-normal font-['Inter'] leading-4">
              {{ invoice.currency }} {{ Number(invoice.total).toLocaleString() }}
            </div>
          </div>
          <div
            v-if="invoice.status"
            class="px-2 py-0.5 bg-blue-50 rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1"
          >
            <div class="text-center text-blue-700 text-xs font-medium font-['Inter'] leading-4">
              {{ invoice.status.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-gray-500 text-xs">
        Issued: {{ formatShortDate(invoice.issuedDate) }} | Due:
        {{ formatShortDate(invoice.dueDate) }}
      </div>
    </div>
  </template>
  <div v-else class="w-full py-8 flex flex-col items-center justify-center text-gray-400">
    <Building2 class="w-8 h-8 mb-2 text-gray-300" />
    <p class="text-sm">No invoices available yet.</p>
  </div>
</template>
