<script setup lang="ts">
import { Plus, Search, Receipt, LayoutList, LayoutGrid } from "lucide-vue-next";
import { cn, toNumber } from "~/lib/utils";
import { useInvoices } from "~/composables/useInvoices";
import { InvoiceListView, InvoiceGridView } from "./components";

definePageMeta({
  layout: "dashboard",
});

const { fetchInvoices } = useInvoices();

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

const invoices = ref<InvoiceData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const statusMap: Record<string, "pending" | "paid" | "partially" | "overdue"> = {
  UNPAID: "pending",
  PARTIALLY_PAID: "partially",
  PAID: "paid",
  OVERDUE: "overdue",
};

const statusConfig: Record<
  "pending" | "paid" | "partially" | "overdue",
  { label: string; class: string }
> = {
  pending: { label: "Belum Lunas", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  partially: { label: "Sebagian", class: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
  overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

// Status filter
const selectedStatus = ref<string>("");
const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "PAID", label: "Lunas" },
  { value: "UNPAID", label: "Belum Lunas" },
  { value: "PARTIALLY_PAID", label: "Sebagian" },
  { value: "OVERDUE", label: "Jatuh Tempo" },
];

// Format currency - handles Prisma Decimal conversion
const formatCurrency = (value: unknown) => {
  const num = toNumber(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusType = (statusCode: string): "pending" | "paid" | "partially" | "overdue" => {
  return statusMap[statusCode] || "pending";
};

const getStatusConfig = (statusCode: string) => {
  const type = getStatusType(statusCode);
  return statusConfig[type];
};

const loadInvoices = async () => {
  try {
    loading.value = true;
    error.value = null;
    const result = await fetchInvoices(selectedStatus.value || undefined);
    if (result.success && result.data) {
      invoices.value = result.data;
    } else {
      throw new Error(result.error || "Failed to load invoices");
    }
  } catch (e) {
    console.error("Failed to fetch invoices:", e);
    error.value = "Failed to load invoices";
    invoices.value = [];
  } finally {
    loading.value = false;
  }
};

const handleRowClick = (id: string) => {
  navigateTo(`/finance/invoice/${id}`);
};

const currentPage = ref(1);
const pagination = ref({ total: 0, limit: 10, page: 1 });

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadInvoices();
};

// Watch for status filter changes
watch(selectedStatus, () => {
  loadInvoices();
});

onMounted(() => {
  loadInvoices();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Invoice</h1>
        <p class="text-muted-foreground mt-1">Kelola tagihan customer</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari invoice..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/finance/invoice/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Buat Invoice</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
      <button @click="loadInvoices" class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg">
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="invoices.length === 0"
      class="text-center py-12 border border-border rounded-xl bg-white"
    >
      <Receipt class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p class="text-muted-foreground">Belum ada invoice</p>
      <NuxtLink
        to="/finance/invoice/create"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#012D5A] text-white rounded-lg"
      >
        <Plus class="w-4 h-4" />
        Buat Invoice Pertama
      </NuxtLink>
    </div>

    <!-- List View -->
    <InvoiceListView
      v-else-if="viewMode === 'list'"
      :invoices="invoices"
      :get-status-config="getStatusConfig"
      :format-currency="formatCurrency"
      :format-date="formatDate"
      @row-click="handleRowClick"
    />

    <!-- Grid View -->
    <InvoiceGridView
      v-else
      :invoices="invoices"
      :get-status-config="getStatusConfig"
      :format-currency="formatCurrency"
      :format-date="formatDate"
      @row-click="handleRowClick"
    />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ invoices.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>
