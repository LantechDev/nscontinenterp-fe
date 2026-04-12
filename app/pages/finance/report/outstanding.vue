<script setup lang="ts">
import {
  FileText,
  Search,
  Printer,
  Filter,
  TrendingUp,
  Wallet,
  Clock,
  Building2,
  Calendar,
  Loader2,
  ChevronLeft,
} from "lucide-vue-next";
import * as XLSX from "xlsx";
import { usePayments, type OutstandingReport } from "~/composables/usePayments";
import { useCompanies } from "~/composables/useCompanies";
import { formatRupiah } from "~/lib/utils";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
  title: "Outstanding Report",
  hideHeader: true,
});

const { fetchOutstandingReport, isLoading } = usePayments();
const { companies, fetchCompanies } = useCompanies();

const filters = ref({
  companyId: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
});

const reportData = ref<OutstandingReport | null>(null);

const loadReport = async () => {
  const result = await fetchOutstandingReport({
    companyId: filters.value.companyId || undefined,
    month: filters.value.month || undefined,
    year: filters.value.year || undefined,
    page: pagination.value.page,
    limit: pagination.value.limit,
  });
  if (result.success && result.data) {
    reportData.value = result.data;
    pagination.value.total = result.data.pagination.total;
  }
};

watch(
  filters,
  () => {
    pagination.value.page = 1;
  },
  { deep: true },
);

const formatCurrency = formatRupiah;

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isExporting = ref(false);

const handleExport = () => {
  if (!reportData.value) return;
  isExporting.value = true;

  try {
    const headers = ["Inv Date", "Invoice No.", "Customer", "Total", "Outstanding", "Status"];
    const rows = reportData.value.invoices.map((inv) => [
      formatDate(inv.issuedDate),
      inv.invoiceNumber,
      inv.company.name,
      inv.total,
      inv.balanceDue,
      inv.status.name,
    ]);

    // Add summary row
    rows.push([]);
    rows.push([
      "",
      "",
      "GRAND TOTALS",
      reportData.value.summary.totalInvoiced,
      reportData.value.summary.totalOutstanding,
      "",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Outstanding Report");

    XLSX.writeFile(workbook, `OUTSTANDING_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`);
  } catch (error) {
    console.error("Export error:", error);
  } finally {
    isExporting.value = false;
  }
};

const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i;
  return { label: String(y), value: y };
});

const router = useRouter();
const goBack = () => router.push("/finance/dashboard");

// Format stats for FinanceStatCard
const statsCards = computed(() => {
  if (!reportData.value) return [];
  return [
    {
      title: "Total Invoiced",
      value: formatCurrency(reportData.value.summary.totalInvoiced),
      changeLabel: `From ${reportData.value.summary.count} invoices`,
      isPrimary: false,
    },
    {
      title: "Total Paid",
      value: formatCurrency(reportData.value.summary.totalPaid),
      changeLabel: "Collected funds",
      isPrimary: false,
    },
    {
      title: "Total Outstanding",
      value: formatCurrency(reportData.value.summary.totalOutstanding),
      changeLabel: "Awaiting collection",
      isPrimary: true,
    },
  ];
});

// For Combobox compatibility since company object uses 'id' and 'name'
const companyOptions = computed(() => {
  return [
    { name: "All Customers", id: "" },
    ...companies.value.map((c) => ({ name: c.name, id: c.id })),
  ];
});

const logoUrl = ref("/images/transparentnscontinenttebal.png");

// Proxy for numeric month/year values to strings if Combobox only handles strings
const monthValue = computed({
  get: () => String(filters.value.month),
  set: (val) => (filters.value.month = Number(val)),
});

const yearValue = computed({
  get: () => String(filters.value.year),
  set: (val) => (filters.value.year = Number(val)),
});

onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  fetchCompanies({ type: "CUSTOMER" });
  loadReport();
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-white">
    <!-- Sticky Header -->
    <div class="shrink-0 bg-white border-b border-border">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="w-10 h-10 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-all active:scale-95"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-bold">Outstanding Payments</h1>
            <p class="text-muted-foreground text-base">Financial aging and collection report</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="handleExport"
            :disabled="isExporting || !reportData"
            class="flex items-center gap-2 px-3 py-2 text-sm border border-border bg-white hover:bg-gray-50 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <FileText v-if="!isExporting" class="w-4 h-4 text-green-600" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            <span class="font-medium text-gray-700">Export Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Scrollable Content Area -->
    <div class="flex-1 overflow-y-auto pt-6 pb-20 custom-scrollbar">
      <div class="space-y-6 px-6">
        <!-- Summary Cards -->
        <div v-if="reportData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FinanceStatCard
            v-for="(card, index) in statsCards"
            :key="index"
            :card="card"
            :index="index"
          />
        </div>

        <!-- Filters & Table Section -->
        <div class="border border-border rounded-xl bg-white">
          <!-- Filter Header Row -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
            <h2 class="text-lg font-semibold">Report Data</h2>
            <div class="flex flex-wrap items-center gap-2">
              <button
                @click="loadReport"
                :disabled="isLoading"
                class="flex items-center gap-2 px-4 py-2 text-sm bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Search v-if="!isLoading" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          <!-- Secondary Filter Row -->
          <div class="flex flex-wrap items-center gap-3 p-5 border-b border-border bg-gray-50/30">
            <!-- Customer Filter -->
            <div class="flex-1 min-w-[200px]">
              <Combobox
                v-model="filters.companyId"
                :options="companyOptions"
                label-key="name"
                value-key="id"
                placeholder="All Customers"
              />
            </div>

            <!-- Month Filter -->
            <div class="w-48">
              <Combobox
                v-model="monthValue"
                :options="monthOptions"
                label-key="label"
                value-key="value"
                placeholder="Month"
              />
            </div>

            <!-- Year Filter -->
            <div class="w-32">
              <Combobox
                v-model="yearValue"
                :options="yearOptions"
                label-key="label"
                value-key="value"
                placeholder="Year"
              />
            </div>
          </div>

          <!-- Table Content -->
          <div v-if="reportData" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-gray-50/50">
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Inv Date</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Invoice No.</th>
                  <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">Total</th>
                  <th class="py-3 px-4 text-right text-sm font-medium text-gray-500">
                    Outstanding
                  </th>
                  <th class="py-3 px-4 text-center text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="inv in reportData.invoices"
                  :key="inv.id"
                  class="hover:bg-gray-50/50 transition-colors"
                >
                  <td class="py-3 px-4 text-sm text-gray-600">{{ formatDate(inv.issuedDate) }}</td>
                  <td class="py-3 px-4">
                    <span class="text-sm font-medium text-[#012D5A]">{{ inv.invoiceNumber }}</span>
                  </td>
                  <td class="py-3 px-4 text-sm">
                    <div class="flex flex-col">
                      <span class="font-medium text-gray-900">{{ inv.company.name }}</span>
                      <span
                        class="text-[10px] text-muted-foreground uppercase font-bold tracking-tight"
                        >{{ inv.company.code }}</span
                      >
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-right font-medium text-gray-700">
                    {{ formatCurrency(inv.total) }}
                  </td>
                  <td class="py-3 px-4 text-sm text-bold text-right text-orange-600">
                    {{ formatCurrency(inv.balanceDue) }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider',
                        inv.status.code === 'PARTIALLY_PAID'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200',
                      ]"
                    >
                      {{ inv.status.name }}
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50/50 font-bold border-t border-border">
                <tr>
                  <td
                    colspan="3"
                    class="py-4 px-4 text-sm text-gray-700 text-right uppercase tracking-wider"
                  >
                    Grand Totals
                  </td>
                  <td class="py-4 px-4 text-right text-sm text-[#012D5A] font-bold">
                    {{ formatCurrency(reportData.summary.totalInvoiced) }}
                  </td>
                  <td class="py-4 px-4 text-right text-sm text-orange-600 font-bold">
                    {{ formatCurrency(reportData.summary.totalOutstanding) }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Pagination Section -->
          <div
            v-if="reportData && pagination.total > 0"
            class="flex items-center justify-between p-4 border-t border-border bg-gray-50/10"
          >
            <p class="text-sm text-muted-foreground font-medium">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
              {{ pagination.total }} results
            </p>
            <UiPagination
              v-model:page="pagination.page"
              :total="pagination.total"
              :items-per-page="pagination.limit"
              @update:page="loadReport"
            />
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoading" class="flex flex-col items-center justify-center py-24 px-6">
            <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Search class="w-8 h-8 text-gray-300" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Generate Report</h3>
            <p class="text-muted-foreground text-center max-w-sm text-sm">
              Select filters above and click generate to analyze outstanding payments.
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
            <Loader2 class="w-10 h-10 animate-spin text-[#012D5A] opacity-20 mb-4" />
            <p class="text-sm font-medium text-muted-foreground animate-pulse">
              Calculating balances...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media print {
  .overflow-y-auto {
    overflow: visible !important;
    height: auto !important;
  }

  .h-screen {
    height: auto !important;
  }

  .shrink-0,
  button,
  .Secondary-Filter-Row,
  .bg-gray-50\/30,
  .shadow-sm,
  .Summary-Cards {
    display: none !important;
  }

  .pt-6,
  .pb-20,
  .px-6,
  .p-5,
  .p-6 {
    padding: 0 !important;
  }

  .border {
    border: none !important;
  }

  .rounded-xl {
    border-radius: 0 !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  th,
  td {
    border-bottom: 1px solid #e5e7eb !important;
  }
}
</style>
