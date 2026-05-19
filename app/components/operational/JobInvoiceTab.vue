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
  Printer,
  FileText,
  ChevronRight,
} from "lucide-vue-next";
import JobInvoiceForm from "./JobInvoiceForm.vue";
import JobInvoicePreview from "./JobInvoicePreview.vue";
import JobPaymentTab from "./JobPaymentTab.vue";
import PaymentEntryForm from "../finance/PaymentEntryForm.vue";
import Modal from "~/components/ui/Modal.vue";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { useQuotations, type Quotation } from "~/composables/useQuotations";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId?: string;
  jobParties?: Array<{ partyRole?: { code?: string } | null; companyId?: string | null }>;
  initialInvoiceId?: string;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-job"): void;
}>();

const { fetchInvoices, isLoading, fetchInvoiceById, voidInvoice } = useInvoices();
const { fetchQuotations, updateQuotation } = useQuotations();
const invoices = ref<
  Array<{
    id: string;
    invoiceNumber: string;
    createdAt: string;
    status?: { code: string; name: string };
    total: number;
    balanceDue: number;
    quotationId?: string | null;
    currency: string;
    exchangeRate?: number;
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
const printMode = ref<"invoice" | "receipt">("invoice");
const printReceiptAmount = ref<number | undefined>(undefined);
const printReceiptDate = ref<string | undefined>(undefined);
const generatingAllocId = ref<string | null>(null);
const paymentTabRef = ref<InstanceType<typeof JobPaymentTab> | null>(null);

// Quotation Picker State
const showQuotationPicker = ref(false);
const quotationsList = ref<Quotation[]>([]);
const isLoadingQuotations = ref(false);
const selectedQuotation = ref<Quotation | null>(null);
const prefillFromQuotation = ref<{
  quotationId?: string | null;
  currency?: string;
  exchangeRate?: number;
  notes?: string | null;
  items?: Array<{
    serviceId?: string | null;
    description: string;
    quantity: number;
    unitPrice: number;
    taxId?: string | null;
  }>;
} | null>(null);

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

const handleGeneratePDF = async (
  mode: "invoice" | "receipt" = "invoice",
  alloc?: NonNullable<InvoiceDetail["paymentAllocations"]>[number],
) => {
  if (!previewRef.value) return;
  printMode.value = mode;

  if (mode === "receipt" && alloc) {
    printReceiptAmount.value = Number(alloc.amount);
    printReceiptDate.value = alloc.payment?.paymentDate || alloc.payment?.createdAt;
    generatingAllocId.value = alloc.id;
  } else {
    printReceiptAmount.value = undefined;
    printReceiptDate.value = undefined;
    generatingAllocId.value = null;
  }

  await nextTick(); // Ensure mode is applied to preview
  isGeneratingPDF.value = true;
  try {
    await previewRef.value.generatePDF();
  } finally {
    isGeneratingPDF.value = false;
    printMode.value = "invoice";
    printReceiptAmount.value = undefined;
    printReceiptDate.value = undefined;
    generatingAllocId.value = null;
  }
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
    emit("refresh-job");
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

const openQuotationPicker = async () => {
  isLoadingQuotations.value = true;
  showQuotationPicker.value = true;
  const res = await fetchQuotations({
    limit: 100,
    status: undefined,
  });
  if (res.success && res.data) {
    quotationsList.value = (res.data.items || []).filter(
      (q) =>
        (!resolvedCustomerId.value || q.customerId === resolvedCustomerId.value) &&
        q.status !== "CONVERTED",
    );
  }
  isLoadingQuotations.value = false;
};

const selectQuotation = (q: Quotation) => {
  selectedQuotation.value = q;
  prefillFromQuotation.value = {
    quotationId: q.id,
    currency: q.currency,
    exchangeRate: q.exchangeRate,
    notes: q.notes,
    items: (q.charges || []).map((ch) => ({
      serviceId: ch.serviceId || null,
      description: ch.description,
      quantity: Number(ch.quantity),
      unitPrice: Number(ch.unitPrice),
      taxId: ch.taxId || null,
    })),
  };
  showQuotationPicker.value = false;
  isEditing.value = false;
  showForm.value = true;
};

watch(
  () => props.initialInvoiceId,
  (newId) => {
    if (newId) {
      loadInvoiceDetail(newId);
    }
  },
);

const formatCurrency = (amount: number, currency: string = "IDR") => {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
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

const handleFormSuccess = async () => {
  showForm.value = false;
  if (isEditing.value && activeInvoice.value) {
    loadInvoiceDetail(activeInvoice.value.id);
  }
  isEditing.value = false;
  loadInvoices();

  // If this invoice was created from a quotation, mark that quotation CONVERTED
  if (selectedQuotation.value) {
    const res = await updateQuotation(selectedQuotation.value.id, { status: "CONVERTED" });
    if (res.success) {
      toast.success(`Quotation ${selectedQuotation.value.number} ditandai CONVERTED.`);
    }
    selectedQuotation.value = null;
    prefillFromQuotation.value = null;
  }
};

const handlePaymentSuccess = () => {
  showPaymentForm.value = false;
  if (activeInvoice.value) {
    loadInvoiceDetail(activeInvoice.value.id);
  }
  loadInvoices();
  paymentTabRef.value?.refresh();
  emit("refresh-job");
};

const handlePaymentVoided = async () => {
  await loadInvoices();
  if (activeInvoice.value) {
    await loadInvoiceDetail(activeInvoice.value.id);
  }
  emit("refresh-job");
};
</script>

<template>
  <div class="space-y-6">
    <!-- Form Modal -->
    <Modal
      v-model="showForm"
      :title="
        isEditing
          ? 'Edit Invoice'
          : selectedQuotation
            ? `Create Invoice from ${selectedQuotation.number}`
            : 'Create Invoice'
      "
      :description="
        isEditing
          ? 'Update commercial invoice details.'
          : 'Generate a new commercial invoice for this job.'
      "
      width="2xl"
    >
      <JobInvoiceForm
        :job-id="jobId"
        :job-number="jobNumber"
        :customer-id="resolvedCustomerId"
        :invoice="isEditing ? activeInvoice : null"
        :prefill-data="!isEditing ? prefillFromQuotation : null"
        @cancel="
          showForm = false;
          isEditing = false;
          if (!isEditing) {
            selectedQuotation = null;
            prefillFromQuotation = null;
          }
        "
        @success="handleFormSuccess"
      />
    </Modal>

    <!-- Quotation Picker Modal -->
    <Modal
      v-model="showQuotationPicker"
      title="Pilih Quotation"
      description="Pilih quotation yang ingin dijadikan invoice."
      width="max-w-3xl"
    >
      <div class="space-y-3 pt-1">
        <div v-if="isLoadingQuotations" class="py-8 flex justify-center">
          <Loader2 class="w-6 h-6 animate-spin text-[#062c58]" />
        </div>
        <div v-else-if="quotationsList.length === 0" class="py-8 text-center">
          <FileText class="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p class="text-sm font-semibold text-muted-foreground">Tidak ada quotation tersedia</p>
          <p class="text-xs text-muted-foreground mt-1">
            Belum ada quotation aktif untuk customer ini.
          </p>
        </div>
        <div v-else class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          <div v-for="q in quotationsList" :key="q.id">
            <button
              @click="q.status === 'CONFIRMED' ? selectQuotation(q) : undefined"
              :disabled="q.status !== 'CONFIRMED'"
              :class="[
                'w-full text-left p-4 rounded-xl border transition-all group',
                q.status === 'CONFIRMED'
                  ? 'border-border hover:border-[#062c58]/40 hover:bg-blue-50/30 cursor-pointer'
                  : 'border-border/40 bg-gray-50/60 opacity-60 cursor-not-allowed',
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'p-2 rounded-lg shrink-0',
                      q.status === 'CONFIRMED'
                        ? 'bg-blue-50 text-[#062c58]'
                        : 'bg-gray-100 text-gray-400',
                    ]"
                  >
                    <FileText class="w-4 h-4" />
                  </div>
                  <div>
                    <p
                      :class="[
                        'text-sm font-bold',
                        q.status === 'CONFIRMED' ? 'text-[#062c58]' : 'text-gray-400',
                      ]"
                    >
                      {{ q.number }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ q.customerName }} · {{ q.date }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <p class="text-xs font-bold text-foreground">
                      {{ q.currency }} {{ new Intl.NumberFormat("id-ID").format(q.total || 0) }}
                    </p>
                    <span
                      class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border"
                      :class="{
                        'bg-gray-100 text-gray-600 border-gray-200': q.status === 'DRAFT',
                        'bg-amber-50 text-amber-700 border-amber-200': q.status === 'SENT',
                        'bg-blue-50 text-blue-700 border-blue-200': q.status === 'CONFIRMED',
                      }"
                      >{{ q.status }}</span
                    >
                  </div>
                  <ChevronRight
                    v-if="q.status === 'CONFIRMED'"
                    class="w-4 h-4 text-muted-foreground group-hover:text-[#062c58] transition-colors"
                  />
                </div>
              </div>
              <div v-if="q.charges?.length" class="mt-2 pl-11">
                <p class="text-[10px] text-muted-foreground">
                  {{ q.charges.length }} charge item{{ q.charges.length > 1 ? "s" : "" }}:
                  {{
                    q.charges
                      .slice(0, 2)
                      .map((c) => c.description)
                      .join(", ")
                  }}{{
                    q.charges.length > 2
                      ? `
                  +${q.charges.length - 2} more`
                      : ""
                  }}
                </p>
              </div>
              <div v-if="q.status !== 'CONFIRMED'" class="mt-2 pl-11 flex items-center gap-1.5">
                <svg
                  class="w-3 h-3 text-amber-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="text-[10px] text-amber-600 font-semibold">
                  Harus berstatus CONFIRMED dulu sebelum bisa dijadikan invoice
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Detail View -->
    <div v-if="activeInvoice" class="animate-fade-in flex flex-col gap-6">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-border/50 pb-4 gap-4"
      >
        <!-- Left Section: Back button, Title, Status & Date -->
        <div class="flex items-center gap-3">
          <button
            @click="closeDetail"
            class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-bold flex items-center gap-2 text-foreground">
                Invoice {{ activeInvoice.invoiceNumber }}
              </h2>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider shadow-sm shrink-0',
                  getStatusClass(activeInvoice.status?.code || ''),
                ]"
              >
                {{ activeInvoice.status?.name || activeInvoice.status?.code }}
              </span>
              <span
                v-if="activeInvoice.quotationId"
                class="px-2 py-0.5 rounded text-[9px] font-bold border border-blue-200 bg-blue-50 text-blue-700 uppercase tracking-wider shadow-sm shrink-0"
              >
                From Quotation
              </span>
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">
              Issued on {{ formatDate(activeInvoice.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
          <!-- Record Payment (Primary Action) -->
          <button
            v-if="activeInvoice.status?.code !== 'VOIDED'"
            @click="showPaymentForm = true"
            class="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm hover:shadow-emerald-100 text-[10px] font-black uppercase tracking-wider gap-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Receipt class="w-3.5 h-3.5" />
            Record Payment
          </button>

          <!-- Download PDF (Secondary Action) -->
          <button
            @click="handleGeneratePDF('invoice')"
            :disabled="isGeneratingPDF"
            class="inline-flex items-center px-3 py-1.5 bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg shadow-sm hover:shadow-blue-100 text-[10px] font-black uppercase tracking-wider gap-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <Loader2
              v-if="isGeneratingPDF && printMode === 'invoice'"
              class="w-3.5 h-3.5 animate-spin"
            />
            <Download v-else class="w-3.5 h-3.5" />
            {{ isGeneratingPDF && printMode === "invoice" ? "Generating" : "Download PDF" }}
          </button>

          <!-- More Actions Dropdown -->
          <div class="relative">
            <button
              @click="showMoreActions = !showMoreActions"
              class="p-2 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white shadow-sm flex items-center justify-center w-8 h-8"
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
                v-if="!isCompleted"
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
                v-if="activeInvoice.status?.code !== 'VOIDED' && !isCompleted"
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
            class="flex items-center justify-between p-3 bg-white rounded-xl border border-border/60 hover:border-emerald-500/20 shadow-sm transition-all"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
              >
                <Check class="w-4 h-4" />
              </div>
              <div v-if="alloc.payment">
                <p class="text-sm font-black text-foreground">
                  {{ formatCurrency(alloc.amount, activeInvoice.currency) }}
                </p>
                <p
                  class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5"
                >
                  {{ alloc.payment.paymentMethod?.name || "Payment" }} •
                  {{ formatDate(alloc.payment.paymentDate) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div v-if="alloc.payment?.reference" class="text-right">
                <p class="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Ref/Check
                </p>
                <p class="text-xs font-semibold text-foreground mt-0.5">
                  {{ alloc.payment.reference }}
                </p>
              </div>

              <!-- Print Kwitansi Button for this specific payment allocation! -->
              <button
                @click.stop="handleGeneratePDF('receipt', alloc)"
                :disabled="isGeneratingPDF"
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-[#062c58]/30 hover:bg-slate-50 transition-all text-[10px] font-bold text-[#062c58] shadow-sm disabled:opacity-50 active:scale-95"
                title="Print Kwitansi Pembayaran"
              >
                <Loader2
                  v-if="isGeneratingPDF && generatingAllocId === alloc.id"
                  class="w-3.5 h-3.5 animate-spin"
                />
                <Printer v-else class="w-3.5 h-3.5" />
                Print Kwitansi
              </button>
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
      <JobInvoicePreview
        ref="previewRef"
        :invoice="activeInvoice"
        :mode="printMode"
        :receipt-amount="printReceiptAmount"
        :receipt-date="printReceiptDate"
      />
    </div>

    <!-- List View -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-foreground">Job Invoices</h3>
        <div v-if="!isCompleted" class="flex items-center gap-2">
          <button
            @click="openQuotationPicker"
            class="inline-flex items-center px-3 py-1.5 bg-white border border-[#062c58]/20 text-[#062c58] text-xs font-semibold rounded-md hover:bg-blue-50 transition-colors gap-1.5 shadow-sm"
          >
            <FileText class="w-3.5 h-3.5" />
            From Quotation
          </button>
          <button
            @click="
              showForm = true;
              selectedQuotation = null;
              prefillFromQuotation = null;
            "
            class="inline-flex items-center px-3 py-1.5 bg-[#062c58] text-white text-xs font-semibold rounded-md hover:bg-[#062c58]/90 transition-colors gap-1.5 shadow-sm"
          >
            <Plus class="w-3.5 h-3.5" />
            Create Invoice
          </button>
        </div>
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
                <span
                  v-if="invoice.quotationId"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider shrink-0"
                >
                  From Quotation
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
                class="text-[9px] text-muted-foreground mb-1.5 uppercase tracking-widest font-bold opacity-70"
              >
                Total Amount
              </p>
              <p class="font-black text-xs text-foreground whitespace-nowrap">
                {{ formatCurrency(invoice.total, invoice.currency) }}
              </p>
              <p
                v-if="invoice.currency && invoice.currency !== 'IDR'"
                class="text-[9px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap"
              >
                {{
                  formatCurrency(
                    Number(invoice.total || 0) * Number(invoice.exchangeRate || 1),
                    "IDR",
                  )
                }}
              </p>
            </div>
            <div class="text-right">
              <p
                class="text-[9px] text-muted-foreground mb-1.5 uppercase tracking-widest font-bold opacity-70"
              >
                Balance Due
              </p>
              <template v-if="invoice.status?.code === 'VOIDED'">
                <p class="font-black text-xs text-gray-400 line-through whitespace-nowrap">
                  Voided
                </p>
              </template>
              <template v-else-if="Number(invoice.balanceDue) > 0">
                <p class="font-black text-xs text-red-600 whitespace-nowrap">
                  {{ formatCurrency(invoice.balanceDue, invoice.currency) }}
                </p>
                <p
                  v-if="invoice.currency && invoice.currency !== 'IDR'"
                  class="text-[9px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap text-right"
                >
                  {{
                    formatCurrency(
                      Number(invoice.balanceDue || 0) * Number(invoice.exchangeRate || 1),
                      "IDR",
                    )
                  }}
                </p>
              </template>
              <template v-else>
                <p class="font-black text-xs text-green-600 whitespace-nowrap">Paid In Full</p>
              </template>
            </div>
          </div>
        </div>

        <!-- Consolidated Payment History -->
        <div class="mt-12 pt-12 border-t border-border/50">
          <h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Consolidated Payment History
          </h3>
          <JobPaymentTab
            ref="paymentTabRef"
            :job-id="jobId"
            :is-completed="isCompleted"
            @reload="handlePaymentVoided"
          />
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
