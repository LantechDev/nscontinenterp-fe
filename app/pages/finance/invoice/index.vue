<script setup lang="ts">
import {
  Plus,
  Search,
  Receipt,
  Download,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useInvoices } from "~/composables/useInvoices";

definePageMeta({
  layout: "dashboard",
});

const { fetchInvoices } = useInvoices();

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: {
    code: string;
    name: string;
  };
  company: {
    name: string;
  };
}

const invoices = ref<InvoiceData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const statusMap: Record<string, "pending" | "paid" | "overdue"> = {
  UNPAID: "pending",
  PARTIALLY_PAID: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
};

const statusConfig: Record<"pending" | "paid" | "overdue", { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
  overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusType = (statusCode: string): "pending" | "paid" | "overdue" => {
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
    const result = await fetchInvoices();
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
        <select
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Lunas</option>
          <option value="overdue">Jatuh Tempo</option>
        </select>
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
    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
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
              @click="navigateTo(`/finance/invoice/${invoice.id}`)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                    <Receipt class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">{{ invoice.invoiceNumber }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm font-medium">
                {{ invoice.company?.name || "N/A" }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ formatDate(invoice.invoiceDate) }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ formatDate(invoice.dueDate) }}
              </td>
              <td class="py-3 px-4 text-sm font-medium">
                {{ formatCurrency(invoice.total) }}
              </td>
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

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="invoice in invoices"
        :key="invoice.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/finance/invoice/${invoice.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
            >
              <Receipt class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">
                {{ invoice.invoiceNumber }}
              </h3>
              <p class="text-xs text-muted-foreground">
                {{ formatDate(invoice.invoiceDate) }}
              </p>
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
            <p class="text-lg font-bold text-[#012D5A]">
              {{ formatCurrency(invoice.total) }}
            </p>
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

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ invoices.length }} data found.</p>
      <div class="flex items-center gap-2">
        <button class="p-1 hover:text-foreground disabled:opacity-50">
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"
        >
          1
        </button>
        <span class="px-1">...</span>
        <button class="flex items-center gap-1 hover:text-foreground">
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
