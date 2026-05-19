<script setup lang="ts">
import { Download, Search, FileText, ChevronRight } from "lucide-vue-next";
import { formatRupiah, cn } from "~/lib/utils";
import type { StatCardData } from "~/types/finance";
import JobDetailSlideOver from "~/components/operational/JobDetailSlideOver.vue";

export interface DetailedTaxReportItem {
  invoiceId: string;
  jobId: string | null;
  invoiceNumber: string;
  issuedDate: string;
  companyName: string;
  taxName: string;
  rate: number;
  baseAmount: number;
  taxAmount: number;
  type: "SALES" | "PURCHASE";
}

interface Props {
  isLoading: boolean;
  taxReportData: DetailedTaxReportItem[];
  statsCards: StatCardData[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "export", event: MouseEvent): void;
}>();

const searchQuery = ref("");

const filteredTaxReportData = computed(() => {
  if (!searchQuery.value) return props.taxReportData;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.taxReportData.filter(
    (item) =>
      item.taxName?.toLowerCase().includes(lowerQuery) ||
      item.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
      item.companyName?.toLowerCase().includes(lowerQuery) ||
      item.type?.toLowerCase().includes(lowerQuery),
  );
});

const isJobDetailOpen = ref(false);
const selectedJobId = ref("");
const initialInvoiceId = ref("");
const initialSubTab = ref("ar");

const handleRowClick = (item: DetailedTaxReportItem) => {
  if (item.jobId) {
    selectedJobId.value = item.jobId;
    initialInvoiceId.value = item.invoiceId;
    initialSubTab.value = item.type === "PURCHASE" ? "ap" : "ar";
    isJobDetailOpen.value = true;
  }
};

watch(isJobDetailOpen, (isOpen) => {
  if (!isOpen) {
    selectedJobId.value = "";
    initialInvoiceId.value = "";
    initialSubTab.value = "ar";
  }
});
</script>

<template>
  <div class="space-y-4 px-6 pb-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- Main Content -->
    <div class="border border-border rounded-xl bg-white mt-4 overflow-hidden">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
        <h2 class="text-lg font-semibold">Tax Report</h2>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search Input -->
          <div class="relative flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari invoice, customer, pajak..."
              class="w-64 px-3 py-2 pl-9 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
          </div>

          <button
            class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg"
            @click="emit('export', $event)"
          >
            <Download class="w-4 h-4" /><span>Export</span>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50">
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">No. Invoice</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Tipe</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Tanggal</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Customer/Vendor</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Nama Pajak</th>
              <th class="py-3 px-6 text-right text-sm font-medium text-gray-500">
                Dasar Pengenaan
              </th>
              <th class="py-3 px-6 text-right text-sm font-medium text-gray-500">Total Pajak</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500 w-12"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!filteredTaxReportData.length && !isLoading">
              <td colspan="8" class="py-12 text-center text-muted-foreground italic">
                Tidak ada data pajak untuk periode ini
              </td>
            </tr>
            <tr v-if="isLoading" class="animate-pulse">
              <td colspan="8" class="py-8 text-center text-muted-foreground">
                <div class="flex items-center justify-center gap-2">
                  <div
                    class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
                  ></div>
                  Memuat data...
                </div>
              </td>
            </tr>
            <tr
              v-for="item in filteredTaxReportData"
              :key="item.invoiceId + item.taxName"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <td class="py-4 px-6">
                <span class="text-sm font-semibold text-[#012D5A] hover:underline">{{
                  item.invoiceNumber
                }}</span>
              </td>
              <td class="py-4 px-6">
                <span
                  v-if="item.type === 'SALES'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700"
                >
                  CUSTOMER
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700"
                >
                  VENDOR
                </span>
              </td>
              <td class="py-4 px-6 text-sm text-gray-600">
                {{ item.issuedDate ? new Date(item.issuedDate).toLocaleDateString("id-ID") : "-" }}
              </td>
              <td class="py-4 px-6 text-sm font-medium text-gray-700">
                {{ item.companyName || "-" }}
              </td>
              <td class="py-4 px-6 text-sm">{{ item.taxName }} ({{ item.rate }}%)</td>
              <td class="py-4 px-6 text-right text-sm font-mono text-gray-700">
                {{ formatRupiah(item.baseAmount) }}
              </td>
              <td class="py-4 px-6 text-right text-sm font-bold text-primary font-mono">
                {{ formatRupiah(item.taxAmount) }}
              </td>
              <td class="py-4 px-4 text-center">
                <button
                  @click="handleRowClick(item)"
                  class="p-1.5 text-gray-400 hover:text-[#012D5A] hover:bg-gray-100 rounded-lg transition-colors"
                  title="Lihat Detail Invoice"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <JobDetailSlideOver
      v-model="isJobDetailOpen"
      :job-id="selectedJobId"
      :initial-invoice-id="initialInvoiceId"
      :initial-sub-tab="initialSubTab"
      initial-tab="finance"
    />
  </div>
</template>
