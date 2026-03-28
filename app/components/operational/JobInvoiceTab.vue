<script setup lang="ts">
import { Plus, Receipt, ExternalLink, Loader2, AlertCircle, ArrowLeft } from "lucide-vue-next";
import JobInvoiceForm from "./JobInvoiceForm.vue";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId?: string;
}>();

const { fetchInvoices, isLoading } = useInvoices();
const invoices = ref<
  Array<{
    id: string;
    invoiceNumber: string;
    createdAt: string;
    status?: { code: string; name: string };
    total: number;
    balanceDue: number;
  }>
>([]);
const error = ref<string | null>(null);
const showForm = ref(false);

const loadInvoices = async () => {
  error.value = null;
  const result = await fetchInvoices(props.jobId);
  if (result.success) {
    invoices.value = result.data || [];
  } else {
    error.value = result.error || "Failed to load invoices";
  }
};

onMounted(() => {
  loadInvoices();
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700 border-green-200";
    case "PARTIAL":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "UNPAID":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "OVERDUE":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const handleFormSuccess = () => {
  showForm.value = false;
  loadInvoices();
};
</script>

<template>
  <div class="space-y-6">
    <!-- Form View -->
    <div v-if="showForm" class="animate-fade-in">
      <JobInvoiceForm
        :job-id="jobId"
        :job-number="jobNumber"
        :customer-id="customerId || null"
        @cancel="showForm = false"
        @success="handleFormSuccess"
      />
    </div>

    <!-- List View -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-foreground">Job Invoices</h3>
        <button
          @click="showForm = true"
          class="inline-flex items-center px-3 py-1.5 bg-[#012D5A] text-white text-xs font-semibold rounded-md hover:bg-[#012D5A]/90 transition-colors gap-1.5 shadow-sm"
        >
          <Plus class="w-3.5 h-3.5" />
          Create Invoice
        </button>
      </div>

      <div
        v-if="isLoading && invoices.length === 0"
        class="py-12 flex flex-col items-center justify-center space-y-3"
      >
        <Loader2 class="w-8 h-8 animate-spin text-primary opacity-60" />
        <p class="text-sm text-muted-foreground">Loading invoices...</p>
      </div>

      <div v-else-if="error" class="p-6 text-center bg-red-50 rounded-xl border border-red-100">
        <AlertCircle class="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p class="text-sm font-medium text-red-800">{{ error }}</p>
        <button @click="loadInvoices" class="mt-4 text-xs font-bold text-red-700 hover:underline">
          Try Again
        </button>
      </div>

      <div
        v-else-if="invoices.length === 0"
        class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
      >
        <div
          class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
        >
          <Receipt class="w-6 h-6 text-muted-foreground opacity-40" />
        </div>
        <p class="text-sm font-semibold text-foreground mb-1">No Invoices Found</p>
        <p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
          There are no invoices linked to this job yet. Click "Create Invoice" to start a new
          billing.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="invoice in invoices"
          :key="invoice.id"
          class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/finance/invoice/${invoice.id}`"
                  class="font-bold text-sm text-foreground hover:text-[#012D5A] flex items-center gap-1.5 transition-colors"
                >
                  {{ invoice.invoiceNumber }}
                  <ExternalLink
                    class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </NuxtLink>
              </div>
              <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Issued on {{ formatDate(invoice.createdAt) }}
              </p>
            </div>
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide',
                getStatusClass(invoice.status?.code || ''),
              ]"
            >
              {{ invoice.status?.name || invoice.status?.code }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p
                class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"
              >
                Total Amount
              </p>
              <p class="font-bold text-sm text-foreground">{{ formatCurrency(invoice.total) }}</p>
            </div>
            <div class="text-right">
              <p
                class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold"
              >
                Balance Due
              </p>
              <p class="font-bold text-sm text-red-600" v-if="Number(invoice.balanceDue) > 0">
                {{ formatCurrency(invoice.balanceDue) }}
              </p>
              <p class="font-bold text-sm text-green-600" v-else>Paid In Full</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
