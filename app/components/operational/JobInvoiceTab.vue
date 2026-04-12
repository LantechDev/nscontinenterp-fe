<script setup lang="ts">
import {
  Plus,
  Receipt,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Download,
  Check,
  Ban,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-vue-next";
import JobInvoiceForm from "./JobInvoiceForm.vue";
import JobInvoicePreview from "./JobInvoicePreview.vue";
import JobPaymentTab from "./JobPaymentTab.vue";
import PaymentEntryForm from "../finance/PaymentEntryForm.vue";
import Modal from "~/components/ui/Modal.vue";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId?: string;
  jobParties?: Array<{ partyRole?: { code?: string } | null; companyId?: string | null }>;
  initialInvoiceId?: string;
}>();

const { fetchInvoices, isLoading, fetchInvoiceById, voidInvoice } = useInvoices();
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
const isEditing = ref(false);
const showPaymentForm = ref(false);
const activeInvoice = ref<InvoiceDetail | null>(null);
const isLoadingDetail = ref(false);
const previewRef = ref<InstanceType<typeof JobInvoicePreview> | null>(null);
const isGeneratingPDF = ref(false);
const isVoiding = ref(false);
const showVoidConfirm = ref(false);
const showMoreActions = ref(false);

const resolvedCustomerId = computed(() => {
  if (props.customerId) return props.customerId;

  // Fallback order: SHIPPER -> CONSIGNEE -> NOTIFY_PARTY -> First available party
  const shipper = props.jobParties?.find((p) => p.partyRole?.code === "SHIPPER");
  if (shipper?.companyId) return shipper.companyId;

  const consignee = props.jobParties?.find((p) => p.partyRole?.code === "CONSIGNEE");
  if (consignee?.companyId) return consignee.companyId;

  const notify = props.jobParties?.find((p) => p.partyRole?.code === "NOTIFY_PARTY");
  if (notify?.companyId) return notify.companyId;

  return props.jobParties?.[0]?.companyId || null;
});

const loadInvoices = async () => {
  error.value = null;
  const result = await fetchInvoices(props.jobId);
  if (result.success) {
    invoices.value = result.data || [];
  } else {
    error.value = result.error || "Failed to load invoices";
  }
};

const loadInvoiceDetail = async (id: string) => {
  isLoadingDetail.value = true;
  error.value = null;
  const result = await fetchInvoiceById(id);
  if (result.success && result.data) {
    activeInvoice.value = result.data;
  } else {
    error.value = result.error || "Failed to load invoice details";
  }
  isLoadingDetail.value = false;
};

const handleGeneratePDF = async () => {
  if (!previewRef.value) return;
  isGeneratingPDF.value = true;
  await previewRef.value.generatePDF();
  isGeneratingPDF.value = false;
};

const closeDetail = () => {
  activeInvoice.value = null;
  isEditing.value = false;
};

const handleEdit = () => {
  isEditing.value = true;
  showForm.value = true;
};

const handleVoid = async () => {
  if (!activeInvoice.value) return;

  isVoiding.value = true;
  const result = await voidInvoice(activeInvoice.value.id);
  if (result.success) {
    showVoidConfirm.value = false;
    await loadInvoiceDetail(activeInvoice.value.id);
    await loadInvoices();
  } else {
    toast.error(result.error || "Failed to void invoice");
  }
  isVoiding.value = false;
};

onMounted(async () => {
  await loadInvoices();
  if (props.initialInvoiceId) {
    loadInvoiceDetail(props.initialInvoiceId);
  }
});

watch(
  () => props.initialInvoiceId,
  (newId) => {
    if (newId) {
      loadInvoiceDetail(newId);
    }
  },
);

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
    case "VOIDED":
      return "bg-gray-100 text-gray-400 border-gray-200 grayscale opacity-70";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const handleFormSuccess = () => {
  showForm.value = false;
  if (isEditing.value && activeInvoice.value) {
    loadInvoiceDetail(activeInvoice.value.id);
  }
  isEditing.value = false;
  loadInvoices();
};

const handlePaymentSuccess = () => {
  showPaymentForm.value = false;
  if (activeInvoice.value) {
    loadInvoiceDetail(activeInvoice.value.id);
  }
  loadInvoices();
};

const handlePaymentVoided = async () => {
  await loadInvoices();
  if (activeInvoice.value) {
    await loadInvoiceDetail(activeInvoice.value.id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Form View -->
    <div v-if="showForm" class="animate-fade-in">
      <JobInvoiceForm
        :job-id="jobId"
        :job-number="jobNumber"
        :customer-id="resolvedCustomerId"
        :invoice="isEditing ? activeInvoice : null"
        @cancel="
          showForm = false;
          isEditing = false;
        "
        @success="handleFormSuccess"
      />
    </div>

    <!-- Detail View -->
    <div v-else-if="activeInvoice" class="animate-fade-in flex flex-col gap-6">
      <div class="flex items-center justify-between border-b border-border/50 pb-4">
        <div class="flex items-center gap-4">
          <button
            @click="closeDetail"
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h2 class="text-xl font-bold flex items-center gap-2">
              Invoice {{ activeInvoice.invoiceNumber }}
            </h2>
            <p class="text-sm text-muted-foreground mt-0.5">
              Issued on {{ formatDate(activeInvoice.createdAt) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span
            :class="[
              'px-3 py-1.5 rounded-md text-[10px] font-bold border uppercase tracking-widest shadow-sm shadow-black/5',
              getStatusClass(activeInvoice.status?.code || ''),
            ]"
          >
            {{ activeInvoice.status?.name || activeInvoice.status?.code }}
          </span>

          <div class="h-8 w-px bg-border/40 mx-1"></div>

          <div class="flex items-center gap-3">
            <!-- Record Payment (Primary Action) -->
            <button
              v-if="activeInvoice.status?.code !== 'VOIDED'"
              @click="showPaymentForm = true"
              class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-emerald-200/50 text-[11px] font-black uppercase tracking-wider gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Receipt class="w-4 h-4" />
              Record Payment
            </button>

            <!-- Download PDF (Secondary Action) -->
            <button
              @click="handleGeneratePDF"
              :disabled="isGeneratingPDF"
              class="inline-flex items-center px-4 py-2 bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg shadow-md hover:shadow-blue-200/50 text-[11px] font-black uppercase tracking-wider gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Loader2 v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" />
              <Download v-else class="w-4 h-4" />
              {{ isGeneratingPDF ? "Generating" : "Download PDF" }}
            </button>

            <!-- More Actions Dropdown -->
            <div class="relative ml-1">
              <button
                @click="showMoreActions = !showMoreActions"
                class="p-2.5 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white shadow-sm flex items-center justify-center"
              >
                <MoreHorizontal class="w-4 h-4" />
              </button>

              <div
                v-if="showMoreActions"
                @click="showMoreActions = false"
                class="fixed inset-0 z-40"
              ></div>

              <div
                v-if="showMoreActions"
                class="absolute right-0 mt-3 w-52 bg-white border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 origin-top-right py-1.5 flex flex-col"
              >
                <div
                  class="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between gap-2"
                >
                  <p
                    class="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0"
                  >
                    Manage Invoice
                  </p>
                  <span class="text-[8px] font-mono text-muted-foreground opacity-50 truncate"
                    >#{{ activeInvoice.status?.code || "None" }}</span
                  >
                </div>

                <button
                  @click="
                    handleEdit();
                    showMoreActions = false;
                  "
                  class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
                >
                  <Pencil class="w-4 h-4 text-primary" />
                  Edit Invoice Settings
                </button>

                <button
                  v-if="activeInvoice.status?.code !== 'VOIDED'"
                  @click="
                    showVoidConfirm = true;
                    showMoreActions = false;
                  "
                  class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
                >
                  <Ban class="w-4 h-4" />
                  Void Commercial Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment History Mini List -->
      <div
        v-if="activeInvoice.paymentAllocations && activeInvoice.paymentAllocations.length > 0"
        class="bg-gray-50/50 border border-border rounded-xl p-4"
      >
        <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Payment History
        </h4>
        <div class="space-y-2">
          <div
            v-for="alloc in activeInvoice.paymentAllocations"
            :key="alloc.id"
            class="flex items-center justify-between p-2 bg-white rounded-lg border border-border/50 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700"
              >
                <Check class="w-4 h-4" />
              </div>
              <div v-if="alloc.payment">
                <p class="text-sm font-bold text-foreground">{{ formatCurrency(alloc.amount) }}</p>
                <p class="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {{ alloc.payment.paymentMethod?.name || "Bank Transfer" }} •
                  {{ formatDate(alloc.payment.paymentDate) }}
                </p>
              </div>
            </div>
            <div v-if="alloc.payment?.reference" class="text-right">
              <p class="text-[10px] text-muted-foreground uppercase font-bold">Ref/Check</p>
              <p class="text-xs text-foreground">{{ alloc.payment.reference }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="activeInvoice.status?.code === 'VOIDED'"
        class="bg-gray-50/50 border border-border border-dashed rounded-xl p-8 text-center mt-4"
      >
        <Receipt class="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Payment History Cleared
        </p>
        <p class="text-[10px] text-muted-foreground mt-1 max-w-[200px] mx-auto leading-relaxed">
          Applied payments were released back to their original records when this invoice was
          voided.
        </p>
      </div>

      <!-- Preview Component -->
      <JobInvoicePreview ref="previewRef" :invoice="activeInvoice" />
    </div>

    <!-- List View -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-foreground">Job Invoices</h3>
        <button
          @click="showForm = true"
          class="inline-flex items-center px-3 py-1.5 bg-[#062c58] text-white text-xs font-semibold rounded-md hover:bg-[#062c58]/90 transition-colors gap-1.5 shadow-sm"
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
          @click="loadInvoiceDetail(invoice.id)"
          class="group p-4 rounded-xl border border-border bg-white hover:border-[#062c58]/30 hover:shadow-md transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span
                  class="font-bold text-sm text-foreground group-hover:text-[#062c58] flex items-center gap-1.5 transition-colors"
                >
                  {{ invoice.invoiceNumber }}
                  <ExternalLink
                    class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </span>
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
              <p
                class="font-bold text-sm text-gray-400 line-through"
                v-if="invoice.status?.code === 'VOIDED'"
              >
                Voided
              </p>
              <p class="font-bold text-sm text-red-600" v-else-if="Number(invoice.balanceDue) > 0">
                {{ formatCurrency(invoice.balanceDue) }}
              </p>
              <p class="font-bold text-sm text-green-600" v-else>Paid In Full</p>
            </div>
          </div>
        </div>

        <!-- Consolidated Payment History -->
        <div class="mt-12 pt-12 border-t border-border/50">
          <h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Consolidated Payment History
          </h3>
          <JobPaymentTab :job-id="jobId" @reload="handlePaymentVoided" />
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <Modal
      v-model="showPaymentForm"
      title="Record Payment"
      description="Allocate customer payment to invoices."
      width="lg"
    >
      <PaymentEntryForm
        v-if="activeInvoice"
        :company-id="activeInvoice.company.id"
        :invoice-id="activeInvoice.id"
        @success="handlePaymentSuccess"
        @cancel="showPaymentForm = false"
      />
    </Modal>

    <!-- Void Confirmation Modal -->
    <Modal
      v-model="showVoidConfirm"
      title="Void Invoice"
      description="Are you sure you want to void this invoice? This will create a reversal journal entry and cannot be undone."
      width="max-w-sm"
    >
      <div class="space-y-4 pt-2">
        <div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p class="text-xs text-red-800 leading-relaxed font-medium">
            Voiding an invoice will record it as inactive for audit purposes and zero out the
            balance due.
          </p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="showVoidConfirm = false"
            class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleVoid"
            :disabled="isVoiding"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2"
          >
            <Loader2 v-if="isVoiding" class="w-3.5 h-3.5 animate-spin" />
            {{ isVoiding ? "Voiding..." : "Confirm Void" }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
