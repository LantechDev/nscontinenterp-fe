<script setup lang="ts">
import { CheckCircle2, ChevronRight, Download, Search, WalletCards, X } from "lucide-vue-next";
import { formatFullRupiah, cn } from "~/lib/utils";
import type { StatCardData } from "~/types/finance";
import JobDetailSlideOver from "~/components/operational/JobDetailSlideOver.vue";
import Combobox from "~/components/ui/Combobox.vue";
import DatePicker from "~/components/ui/DatePicker.vue";

export interface DetailedTaxReportItem {
  sourceId: string;
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
  currency?: string;
  exchangeRate?: number;
  taxId?: string | null;
  taxReportKey: string;
  isTaxPayable: boolean;
  taxPaymentStatus: "UNPAID" | "PAID" | "NOT_APPLICABLE";
  taxPaymentId?: string | null;
  taxPaidDate?: string | null;
  taxPaymentReference?: string | null;
}

const formatCurrency = (amount: unknown, currency?: string): string => {
  if (amount === undefined || amount === null) return "-";
  const num = Number(amount);
  const curr = currency || "IDR";
  if (curr === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } else {
    return formatFullRupiah(num);
  }
};

interface Props {
  isLoading: boolean;
  taxReportData: DetailedTaxReportItem[];
  statsCards: StatCardData[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "export", event: MouseEvent): void;
  (e: "paid"): void;
}>();

const searchQuery = ref("");
const selectedType = ref("all");
const selectedTaxName = ref("all");
const isPayModalOpen = ref(false);
const selectedTaxItem = ref<DetailedTaxReportItem | null>(null);
const isSubmittingPayment = ref(false);
const paymentError = ref("");
const paymentForm = ref({
  paymentDate: new Date().toISOString().slice(0, 10),
  reference: "",
});

const taxTypeOptions = [
  { id: "all", name: "Semua Tipe" },
  { id: "SALES", name: "Customer (Sales)" },
  { id: "PURCHASE", name: "Vendor (Purchase)" },
];

const taxNameOptions = computed(() => {
  const names = new Set<string>();
  props.taxReportData.forEach((item) => {
    if (item.taxName) names.add(item.taxName);
  });
  return [
    { id: "all", name: "Semua Pajak" },
    ...Array.from(names).map((name) => ({ id: name, name })),
  ];
});

const filteredTaxReportData = computed(() => {
  let list = props.taxReportData;

  // Type Filter
  if (selectedType.value !== "all") {
    list = list.filter((item) => item.type === selectedType.value);
  }

  // Tax Name Filter
  if (selectedTaxName.value !== "all") {
    list = list.filter((item) => item.taxName === selectedTaxName.value);
  }

  // Search Query
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.taxName?.toLowerCase().includes(lowerQuery) ||
        item.invoiceNumber?.toLowerCase().includes(lowerQuery) ||
        item.companyName?.toLowerCase().includes(lowerQuery) ||
        item.type?.toLowerCase().includes(lowerQuery),
    );
  }

  return list;
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

const openPayModal = (item: DetailedTaxReportItem) => {
  selectedTaxItem.value = item;
  paymentError.value = "";
  paymentForm.value = {
    paymentDate: new Date().toISOString().slice(0, 10),
    reference: item.taxPaymentReference || "",
  };
  isPayModalOpen.value = true;
};

const closePayModal = (force = false) => {
  if (isSubmittingPayment.value && !force) return;
  isPayModalOpen.value = false;
  selectedTaxItem.value = null;
  paymentError.value = "";
};

const submitTaxPayment = async () => {
  if (!selectedTaxItem.value) return;
  paymentError.value = "";
  if (!paymentForm.value.paymentDate) {
    paymentError.value = "Tanggal bayar wajib diisi";
    return;
  }

  isSubmittingPayment.value = true;
  try {
    await $fetch("/api/finance/tax-report/pay", {
      method: "POST",
      body: {
        type: selectedTaxItem.value.type,
        sourceId: selectedTaxItem.value.sourceId || selectedTaxItem.value.invoiceId,
        taxId: selectedTaxItem.value.taxId,
        paymentDate: paymentForm.value.paymentDate,
        reference: paymentForm.value.reference.trim() || undefined,
      },
    });
    emit("paid");
    closePayModal(true);
  } catch (error) {
    paymentError.value =
      error instanceof Error ? error.message : "Gagal menyimpan pembayaran pajak";
  } finally {
    isSubmittingPayment.value = false;
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
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="card in 3"
        :key="card"
        class="border border-border rounded-xl bg-white p-4 animate-pulse"
      >
        <div class="h-3 w-32 rounded bg-muted mb-4" />
        <div class="h-7 w-36 rounded bg-muted mb-3" />
        <div class="h-3 w-20 rounded bg-muted" />
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <!-- Filters Row -->
      <div class="flex flex-wrap items-center gap-2 p-5 border-b border-border bg-gray-50/30">
        <!-- Type Filter -->
        <div class="w-48">
          <Combobox v-model="selectedType" :options="taxTypeOptions" placeholder="Semua Tipe" />
        </div>

        <!-- Tax Name Filter -->
        <div class="w-48">
          <Combobox v-model="selectedTaxName" :options="taxNameOptions" placeholder="Semua Pajak" />
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
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Status</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">Tgl Bayar</th>
              <th class="py-3 px-6 text-left text-sm font-medium text-gray-500">No Ref</th>
              <th class="py-3 px-6 text-right text-sm font-medium text-gray-500">
                Dasar Pengenaan
              </th>
              <th class="py-3 px-6 text-right text-sm font-medium text-gray-500">Total Pajak</th>
              <th class="py-3 px-4 text-center text-sm font-medium text-gray-500 w-28"></th>
            </tr>
          </thead>
          <UiLoadingSkeleton v-if="isLoading" variant="table-rows" :columns="11" />
          <tbody v-else class="divide-y divide-gray-100">
            <tr v-if="!filteredTaxReportData.length && !isLoading">
              <td colspan="11" class="py-12 text-center text-muted-foreground italic">
                Tidak ada data pajak untuk periode ini
              </td>
            </tr>
            <tr
              v-for="item in filteredTaxReportData"
              :key="item.taxReportKey || item.invoiceId + item.taxName"
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
              <td class="py-4 px-6">
                <span
                  v-if="item.taxPaymentStatus === 'PAID'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700"
                >
                  <CheckCircle2 class="h-3 w-3" />
                  PAID
                </span>
                <span
                  v-else-if="item.taxPaymentStatus === 'UNPAID'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700"
                >
                  BELUM BAYAR
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500"
                >
                  -
                </span>
              </td>
              <td class="py-4 px-6 text-sm text-gray-600">
                {{
                  item.taxPaidDate ? new Date(item.taxPaidDate).toLocaleDateString("id-ID") : "-"
                }}
              </td>
              <td class="py-4 px-6 text-sm text-gray-600">
                {{ item.taxPaymentReference || "-" }}
              </td>
              <td class="py-4 px-6 text-right text-sm font-mono text-gray-700">
                <div>{{ formatCurrency(item.baseAmount, item.currency) }}</div>
                <div
                  v-if="item.currency && item.currency !== 'IDR'"
                  class="text-[10px] text-gray-400 mt-0.5 font-normal"
                >
                  ≈ {{ formatCurrency(item.baseAmount * (item.exchangeRate || 1)) }}
                </div>
              </td>
              <td class="py-4 px-6 text-right text-sm font-bold text-primary font-mono">
                <div>{{ formatCurrency(item.taxAmount, item.currency) }}</div>
                <div
                  v-if="item.currency && item.currency !== 'IDR'"
                  class="text-[10px] text-gray-400 mt-0.5 font-normal"
                >
                  ≈ {{ formatCurrency(item.taxAmount * (item.exchangeRate || 1)) }}
                </div>
              </td>
              <td class="py-4 px-4 text-center">
                <div class="inline-flex items-center justify-center gap-1">
                  <button
                    v-if="item.isTaxPayable && item.taxPaymentStatus === 'UNPAID'"
                    @click.stop="openPayModal(item)"
                    class="p-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Input Tax Paid"
                  >
                    <WalletCards class="w-5 h-5" />
                  </button>
                  <button
                    @click="handleRowClick(item)"
                    class="p-1.5 text-gray-400 hover:text-[#012D5A] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Lihat Detail Invoice"
                  >
                    <ChevronRight class="w-5 h-5" />
                  </button>
                </div>
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

    <Teleport defer to="body">
      <div
        v-if="isPayModalOpen"
        class="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="() => closePayModal()" />
        <div
          class="relative w-full max-w-md overflow-visible rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95"
        >
          <div class="flex items-start justify-between border-b border-border px-6 py-4">
            <h2 class="text-xl font-bold text-foreground">Input Tax Paid</h2>
            <button
              type="button"
              class="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted"
              @click="() => closePayModal()"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <form class="space-y-4 px-6 py-5 overflow-visible" @submit.prevent="submitTaxPayment">
            <div v-if="selectedTaxItem" class="rounded-lg border border-border bg-gray-50 p-3">
              <p class="text-xs uppercase font-semibold text-gray-500">Pajak</p>
              <p class="mt-1 text-sm font-semibold text-foreground">
                {{ selectedTaxItem.invoiceNumber }} · {{ selectedTaxItem.taxName }}
              </p>
              <p class="mt-1 text-sm font-mono font-bold text-primary">
                {{ formatCurrency(selectedTaxItem.taxAmount, selectedTaxItem.currency) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Bayar</label>
              <DatePicker
                v-model="paymentForm.paymentDate"
                placeholder="Pilih tanggal bayar"
                class="w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No Ref</label>
              <input
                v-model="paymentForm.reference"
                type="text"
                placeholder="NTPN / nomor referensi"
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <p v-if="paymentError" class="text-sm text-red-600">{{ paymentError }}</p>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="btn-outline" @click="() => closePayModal()">
                Batal
              </button>
              <button type="submit" class="btn-primary" :disabled="isSubmittingPayment">
                {{ isSubmittingPayment ? "Menyimpan..." : "Simpan" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
