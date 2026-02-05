<script setup lang="ts">
import {
  Plus,
  Search,
  CreditCard,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { usePayments } from "~/composables/usePayments";

definePageMeta({
  layout: "dashboard",
});

const { fetchPayments } = usePayments();

interface PaymentData {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  invoice: {
    invoiceNumber: string;
  };
  paymentMethod?: {
    name: string;
  };
}

const payments = ref<PaymentData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

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

const loadPayments = async () => {
  try {
    loading.value = true;
    error.value = null;
    const result = await fetchPayments();
    if (result.success && result.data) {
      payments.value = result.data;
    } else {
      throw new Error(result.error || "Failed to load payments");
    }
  } catch (e) {
    console.error("Failed to fetch payments:", e);
    error.value = "Failed to load payments";
    payments.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPayments();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Pembayaran</h1>
        <p class="text-muted-foreground mt-1">Catat pembayaran dari customer</p>
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
          placeholder="Cari pembayaran..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/finance/payment/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Pembayaran</span>
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
      <button @click="loadPayments" class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg">
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="payments.length === 0"
      class="text-center py-12 border border-border rounded-xl bg-white"
    >
      <CreditCard class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p class="text-muted-foreground">Belum ada pembayaran</p>
      <NuxtLink
        to="/finance/payment/create"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#012D5A] text-white rounded-lg"
      >
        <Plus class="w-4 h-4" />
        Catat Pembayaran Pertama
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
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Pembayaran</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Invoice</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Metode</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="payment in payments"
              :key="payment.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/finance/payment/${payment.id}`)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-green-50 text-success">
                    <CreditCard class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">{{ payment.paymentNumber }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ payment.invoice?.invoiceNumber || "N/A" }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ formatDate(payment.paymentDate) }}
              </td>
              <td class="py-3 px-4 text-sm font-medium text-success">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="py-3 px-4 text-sm text-muted-foreground">
                {{ payment.paymentMethod?.name || "Bank Transfer" }}
              </td>
              <td class="py-3 px-4 text-right">
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="payment in payments"
        :key="payment.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="navigateTo(`/finance/payment/${payment.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-green-50 text-success flex items-center justify-center shrink-0"
            >
              <CreditCard class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">
                {{ payment.paymentNumber }}
              </h3>
              <p class="text-xs text-muted-foreground">
                {{ payment.invoice?.invoiceNumber || "N/A" }}
              </p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4 mb-4">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Method</p>
            <p class="text-sm font-medium">
              {{ payment.paymentMethod?.name || "Bank Transfer" }}
            </p>
          </div>

          <div class="pt-3 border-t border-border">
            <p class="text-xs text-muted-foreground mb-1">Amount</p>
            <p class="text-lg font-bold text-success">
              {{ formatCurrency(payment.amount) }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span class="text-xs text-muted-foreground">{{ formatDate(payment.paymentDate) }}</span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ payments.length }} data found.</p>
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
