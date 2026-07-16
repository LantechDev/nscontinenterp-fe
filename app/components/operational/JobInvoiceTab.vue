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
  History,
} from "lucide-vue-next";
import JobInvoiceForm from "./JobInvoiceForm.vue";
import JobInvoicePreview from "./JobInvoicePreview.vue";
import JobPaymentTab from "./JobPaymentTab.vue";
import PaymentEntryForm from "../finance/PaymentEntryForm.vue";
import Modal from "~/components/ui/Modal.vue";
import { getOverpayment } from "~/composables/useFinanceExpense";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { useQuotations, type Quotation, type QuotationInvoice } from "~/composables/useQuotations";
import { toast } from "vue-sonner";
import JobFinanceHistoryModal from "./JobFinanceHistoryModal.vue";
import type { ActivityLog } from "~/lib/activity-log-api";

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

const {
  fetchInvoices,
  isLoading,
  fetchInvoiceById,
  voidInvoice,
  deleteInvoice,
  fetchSuggestedExchangeRate: getSuggestedExchangeRate,
} = useInvoices();
const { fetchQuotations } = useQuotations();
const { canManage, requireManage } = useFeatureAccess("finance.invoice");
const invoices = ref<
  Array<{
    id: string;
    invoiceNumber: string;
    createdAt: string;
    status?: { code: string; name: string };
    total: number;
    balanceDue: number;
    creditBalance?: number;
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
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);
const showHistoryModal = ref(false);
const isLoadingHistory = ref(false);
const historyLogs = ref<ActivityLog[]>([]);

const isJobHistory = ref(false);

const fetchInvoiceHistory = async (invoiceId: string) => {
  isJobHistory.value = false;
  showHistoryModal.value = true;
  isLoadingHistory.value = true;
  try {
    const data = await $fetch<ActivityLog[]>(`/api/finance/invoice/${invoiceId}/activity-logs`);
    historyLogs.value = data || [];
  } catch (err) {
    console.error("Failed to load invoice history:", err);
    toast.error("Failed to load invoice history");
  } finally {
    isLoadingHistory.value = false;
  }
};

const fetchJobInvoiceHistory = async () => {
  isJobHistory.value = true;
  showHistoryModal.value = true;
  isLoadingHistory.value = true;
  try {
    const data = await $fetch<ActivityLog[]>(
      `/api/operational/jobs/${props.jobId}/invoice-activity-logs`,
    );
    historyLogs.value = data || [];
  } catch (err) {
    console.error("Failed to load job invoice history:", err);
    toast.error("Failed to load job invoice history");
  } finally {
    isLoadingHistory.value = false;
  }
};

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
const showSourcePicker = ref(false);
const sourcePickerQuotation = ref<Quotation | null>(null);
const showCurrencySelectModal = ref(false);
const mixedCurrencyQuotation = ref<Quotation | null>(null);
const availableCurrenciesInQuotation = ref<string[]>([]);
const prefillFromQuotation = ref<{
  quotationId?: string | null;
  currency?: string;
  exchangeRate?: number;
  notes?: string | null;
  taxId?: string | null;
  items?: Array<{
    serviceId?: string | null;
    description: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
    taxId?: string | null;
    atCost?: boolean;
  }>;
} | null>(null);

const selectedInvoiceCurrency = ref<"IDR" | "USD">("IDR");
const conversionExchangeRate = ref<number | null>(null);
const isFetchingRate = ref(false);
const rateFetchError = ref<string | null>(null);
const isRateSuggested = ref(false);

const showItemSelection = ref(false);
const itemSelectionQuotation = ref<Quotation | null>(null);
const selectedItemIndices = ref<Set<number>>(new Set());

const toggleItem = (idx: number) => {
  const next = new Set(selectedItemIndices.value);
  if (next.has(idx)) next.delete(idx);
  else next.add(idx);
  selectedItemIndices.value = next;
};

const selectAllItems = () => {
  if (!itemSelectionQuotation.value?.charges) return;
  selectedItemIndices.value = new Set(itemSelectionQuotation.value.charges.map((_, i) => i));
};

const deselectAllItems = () => {
  selectedItemIndices.value = new Set();
};

const openItemSelection = (q: Quotation) => {
  itemSelectionQuotation.value = q;
  selectedItemIndices.value = new Set((q.charges || []).map((_, i) => i));
  showItemSelection.value = true;
  showQuotationPicker.value = false;
};

const confirmItemSelection = () => {
  if (!itemSelectionQuotation.value) return;
  const q = itemSelectionQuotation.value;
  const selectedCharges = (q.charges || []).filter((_, i) => selectedItemIndices.value.has(i));
  if (selectedCharges.length === 0) {
    toast.error("Pilih minimal 1 item untuk dijadikan invoice.");
    return;
  }

  const currencies = Array.from(new Set(selectedCharges.map((ch) => ch.currency || "IDR")));

  if (currencies.length > 1) {
    mixedCurrencyQuotation.value = q;
    availableCurrenciesInQuotation.value = currencies;
    selectedInvoiceCurrency.value = "IDR";
    showCurrencySelectModal.value = true;
    showItemSelection.value = false;
    loadExchangeRate();
  } else {
    const currency = currencies[0] || "IDR";
    proceedPrefillQuotationWithSelection(q, currency, 1);
  }
};

const loadExchangeRate = async () => {
  isFetchingRate.value = true;
  rateFetchError.value = null;
  isRateSuggested.value = false;
  const result = await getSuggestedExchangeRate();
  if (result.success && result.rate) {
    conversionExchangeRate.value = result.rate;
    isRateSuggested.value = true;
  } else {
    conversionExchangeRate.value = null;
    rateFetchError.value = "Failed to fetch exchange rate. Please input manually.";
  }
  isFetchingRate.value = false;
};

const isConfirmDisabled = computed(() => {
  return (
    !conversionExchangeRate.value ||
    isNaN(Number(conversionExchangeRate.value)) ||
    Number(conversionExchangeRate.value) <= 0
  );
});

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

const invoiceSummary = computed(() => {
  let totalBilledIDR = 0;
  let totalBilledUSD = 0;
  let totalPaidIDR = 0;
  let totalPaidUSD = 0;
  let totalDueIDR = 0;
  let totalDueUSD = 0;
  let totalOverpaidIDR = 0;
  let totalOverpaidUSD = 0;

  let hasUSD = false;
  let hasUSDWithoutRate = false;

  invoices.value.forEach((inv) => {
    if (inv.status?.code === "VOIDED") return;

    const rate = Number(inv.exchangeRate || 1);
    const isUSD = inv.currency === "USD";
    const useRate = isUSD && rate > 1;

    const amount = Number(inv.total || 0);
    const balanceDue = Number(inv.balanceDue || 0);

    const overpayment = getOverpayment(inv);
    let paid = balanceDue > 0 ? amount - balanceDue : amount + overpayment;
    if (paid < 0) paid = 0;

    if (isUSD) {
      hasUSD = true;
      totalBilledUSD += amount;
      totalPaidUSD += paid;
      totalDueUSD += balanceDue;
      if (overpayment > 0) {
        totalOverpaidUSD += overpayment;
      }
    }

    if (useRate) {
      totalBilledIDR += amount * rate;
      totalPaidIDR += paid * rate;
      totalDueIDR += balanceDue * rate;
      if (overpayment > 0) {
        totalOverpaidIDR += overpayment * rate;
      }
    } else {
      if (isUSD) {
        hasUSDWithoutRate = true;
      } else {
        totalBilledIDR += amount;
        totalPaidIDR += paid;
        totalDueIDR += balanceDue;
        if (overpayment > 0) {
          totalOverpaidIDR += overpayment;
        }
      }
    }
  });

  return {
    totalBilledIDR,
    totalBilledUSD,
    totalPaidIDR,
    totalPaidUSD,
    totalDueIDR,
    totalDueUSD,
    totalOverpaidIDR,
    totalOverpaidUSD,
    hasUSD,
    hasUSDWithoutRate,
  };
});

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
  if (!requireManage("You only have view access for invoices.")) return;

  isEditing.value = true;
  showForm.value = true;
};

const openBlankInvoiceForm = () => {
  if (!requireManage("You only have view access for invoices.")) return;

  showForm.value = true;
  selectedQuotation.value = null;
  prefillFromQuotation.value = null;
};

const handleVoid = async () => {
  if (!activeInvoice.value) return;
  if (!requireManage("You only have view access for invoices.")) return;

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

const handleDeleteInvoice = async () => {
  if (!activeInvoice.value) return;
  if (!requireManage("You only have view access for invoices.")) return;

  isDeleting.value = true;
  const result = await deleteInvoice(activeInvoice.value.id);
  if (result.success) {
    showDeleteConfirm.value = false;
    activeInvoice.value = null;
    await loadInvoices();
    emit("refresh-job");
    toast.success("Invoice deleted successfully");
  } else {
    toast.error(result.error || "Failed to delete invoice");
  }
  isDeleting.value = false;
};

onMounted(async () => {
  await loadInvoices();
  if (props.initialInvoiceId) {
    loadInvoiceDetail(props.initialInvoiceId);
  }
});

const openQuotationPicker = async () => {
  if (!requireManage("You only have view access for invoices.")) return;

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
        canUseQuotationForInvoice(q),
    );
  }
  isLoadingQuotations.value = false;
};

function getQuotationTotals(q: Quotation) {
  const totals: Record<string, number> = {};
  const rate = Number(q.exchangeRate || 1);
  const shouldConvert = rate > 1;

  if (!q.charges || q.charges.length === 0) {
    if (shouldConvert && (q.currency || "IDR") === "USD") {
      totals.IDR = Math.round(Number(q.total || 0) * rate);
    } else {
      totals[q.currency || "IDR"] = Number(q.total || 0);
    }
    return totals;
  }

  q.charges.forEach((ch) => {
    const currency = ch.currency || "IDR";
    const qty = Number(ch.quantity || 0);
    const price = Number(ch.unitPrice || 0);
    const amount = qty * price;
    const taxRate = Number(ch.taxRate || 0);
    const taxAmount = amount * (taxRate / 100);
    const lineTotal = amount + taxAmount;

    if (shouldConvert && currency === "USD") {
      totals.IDR = (totals.IDR || 0) + Math.round(lineTotal * rate);
    } else {
      totals[currency] = (totals[currency] || 0) + lineTotal;
    }
  });

  if (totals.IDR !== undefined) {
    totals.IDR = Math.round(totals.IDR);
  }
  return totals;
}

function getQuotationRevenue(q: Quotation): number {
  if (!q.charges || q.charges.length === 0) return 0;
  let total = 0;
  const rate = Number(q.exchangeRate || 1);
  q.charges.forEach((ch) => {
    if (ch.atCost) return;
    const amt = Number(ch.quantity || 0) * Number(ch.unitPrice || 0);
    total += (ch.currency || "IDR") === "USD" && rate > 1 ? amt * rate : amt;
  });
  return total;
}

function getQuotationCostTotal(q: Quotation): number {
  const costs = q.costs || [];
  if (costs.length > 0) {
    return costs.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  }
  return Number(q.totalEstimatedCost || 0);
}

function hasCostData(q: Quotation): boolean {
  return getQuotationCostTotal(q) > 0;
}

const handleQuotationClick = (q: Quotation) => {
  const hasInvoices = (q.quotationInvoices || []).length > 0;
  if (hasInvoices) {
    sourcePickerQuotation.value = q;
    showSourcePicker.value = true;
  } else {
    openItemSelection(q);
  }
};

const selectQuotationInvoice = (qinv: QuotationInvoice) => {
  if (!sourcePickerQuotation.value) return;
  const q = sourcePickerQuotation.value;

  const items = (qinv.items || []).map((item) => ({
    serviceId: null,
    description: item.description,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
    currency: item.currency || "IDR",
    taxId: null,
    atCost: false,
  }));

  const itemCurrencies = Array.from(new Set(items.map((item) => item.currency || "IDR")));

  prefillFromQuotation.value = {
    quotationId: q.id,
    currency: itemCurrencies.length === 1 ? itemCurrencies[0] : "IDR",
    exchangeRate: Number(q.exchangeRate || 1),
    notes: qinv.notes || q.notes,
    taxId: q.taxId || null,
    items,
  };

  selectedQuotation.value = q;
  showSourcePicker.value = false;
  showQuotationPicker.value = false;
  isEditing.value = false;
  showForm.value = true;
  toast.success(`Prefilled invoice from quotation invoice ${qinv.number || ""}.`);
};

const selectQuotation = (q: Quotation) => {
  handleQuotationClick(q);
};

const proceedPrefillQuotationWithSelection = (
  q: Quotation,
  targetCurrency: string,
  exchangeRate: number,
) => {
  const selectedCharges = (q.charges || []).filter((_, i) => selectedItemIndices.value.has(i));

  const convertedItems = selectedCharges.map((ch) => {
    const originCurrency = ch.currency || "IDR";
    let unitPrice = Number(ch.unitPrice || 0);

    if (originCurrency !== targetCurrency) {
      if (targetCurrency === "IDR" && originCurrency === "USD") {
        unitPrice = Math.round(unitPrice * exchangeRate);
      } else if (targetCurrency === "USD" && originCurrency === "IDR") {
        unitPrice = Number((unitPrice / exchangeRate).toFixed(2));
      }
    }

    return {
      serviceId: ch.serviceId || null,
      description: ch.description,
      quantity: Number(ch.quantity),
      unitPrice: unitPrice,
      currency: targetCurrency,
      taxId: ch.taxId || null,
      atCost: Boolean(ch.atCost),
    };
  });

  prefillFromQuotation.value = {
    quotationId: q.id,
    currency: targetCurrency,
    exchangeRate: targetCurrency === "IDR" ? 1 : exchangeRate,
    notes: q.notes,
    taxId: q.taxId || null,
    items: convertedItems,
  };

  selectedQuotation.value = q;
  showCurrencySelectModal.value = false;
  showItemSelection.value = false;
  showQuotationPicker.value = false;
  isEditing.value = false;
  showForm.value = true;
  toast.success(
    `Prefilled invoice from quotation with ${selectedCharges.length} item(s) converted to ${targetCurrency}.`,
  );
};

const proceedPrefillQuotation = (q: Quotation, targetCurrency: string, exchangeRate: number) => {
  selectedQuotation.value = q;

  const convertedItems = (q.charges || []).map((ch) => {
    const originCurrency = ch.currency || "IDR";
    let unitPrice = Number(ch.unitPrice || 0);

    if (originCurrency !== targetCurrency) {
      if (targetCurrency === "IDR" && originCurrency === "USD") {
        unitPrice = Math.round(unitPrice * exchangeRate);
      } else if (targetCurrency === "USD" && originCurrency === "IDR") {
        unitPrice = Number((unitPrice / exchangeRate).toFixed(2));
      }
    }

    return {
      serviceId: ch.serviceId || null,
      description: ch.description,
      quantity: Number(ch.quantity),
      unitPrice: unitPrice,
      currency: targetCurrency,
      taxId: ch.taxId || null,
      atCost: Boolean(ch.atCost),
    };
  });

  prefillFromQuotation.value = {
    quotationId: q.id,
    currency: targetCurrency,
    exchangeRate: targetCurrency === "IDR" ? 1 : exchangeRate,
    notes: q.notes,
    taxId: q.taxId || null,
    items: convertedItems,
  };

  showCurrencySelectModal.value = false;
  showQuotationPicker.value = false;
  isEditing.value = false;
  showForm.value = true;
  toast.success(`Prefilled invoice from quotation for all items converted to ${targetCurrency}.`);
};

const canUseQuotationForInvoice = (q: Quotation): boolean => {
  if (q.status === "CONFIRMED") return true;
  if (q.status === "CONVERTED") {
    const flag = (q as unknown as { allowMultipleInvoices?: boolean }).allowMultipleInvoices;
    return Boolean(flag);
  }
  return false;
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

  // Clear any quotation selection used for prefill (no longer marks as CONVERTED,
  // so the same quotation can be used to create multiple invoices)
  selectedQuotation.value = null;
  prefillFromQuotation.value = null;
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
      :title="showSourcePicker ? 'Pilih Sumber Invoice' : 'Pilih Quotation'"
      :description="
        showSourcePicker
          ? 'Pilih quotation invoice atau item individual.'
          : 'Pilih quotation yang ingin dijadikan invoice.'
      "
      width="max-w-3xl"
      @update:model-value="
        (val) => {
          if (!val) {
            showSourcePicker = false;
            sourcePickerQuotation = null;
          }
        }
      "
    >
      <!-- Source Picker View: choose between invoice or individual charges -->
      <div v-if="showSourcePicker && sourcePickerQuotation" class="space-y-4 pt-1">
        <button
          @click="
            showSourcePicker = false;
            sourcePickerQuotation = null;
          "
          class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          Back to quotations
        </button>

        <div class="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
          <FileText class="w-5 h-5 text-[#062c58]" />
          <div>
            <p class="text-sm font-bold text-[#062c58]">{{ sourcePickerQuotation.number }}</p>
            <p class="text-xs text-muted-foreground">{{ sourcePickerQuotation.customerName }}</p>
          </div>
        </div>

        <!-- Quotation Invoices -->
        <div v-if="sourcePickerQuotation.quotationInvoices?.length">
          <h4
            class="text-xs font-bold text-foreground uppercase tracking-wide mb-2 flex items-center gap-2"
          >
            <Receipt class="w-3.5 h-3.5 text-[#062c58]" /> Quotation Invoices
          </h4>
          <div class="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            <div
              v-for="qinv in sourcePickerQuotation.quotationInvoices"
              :key="qinv.id"
              class="w-full text-left p-4 rounded-xl border transition-all group cursor-pointer border-border hover:border-[#062c58]/40 hover:bg-blue-50/30"
              @click="selectQuotationInvoice(qinv)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-50 text-[#062c58] shrink-0">
                    <Receipt class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-[#062c58]">{{ qinv.number || "—" }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ qinv.items?.length || 0 }} charge(s)
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <p class="text-sm font-black text-[#062c58]">
                    {{ formatCurrency(qinv.total || 0) }}
                  </p>
                  <ChevronRight
                    class="w-4 h-4 text-muted-foreground group-hover:text-[#062c58] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-border/50 pt-3">
          <p class="text-[10px] text-muted-foreground mb-2 uppercase tracking-widest font-bold">
            Atau
          </p>
          <button
            @click="
              openItemSelection(sourcePickerQuotation);
              showSourcePicker = false;
            "
            class="w-full text-left p-4 rounded-xl border border-dashed border-border hover:border-[#062c58]/40 hover:bg-blue-50/20 transition-all group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="p-2 rounded-lg bg-gray-50 text-muted-foreground shrink-0 group-hover:bg-blue-50 group-hover:text-[#062c58] transition-colors"
                >
                  <FileText class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-sm font-bold text-foreground group-hover:text-[#062c58]">
                    Select Individual Charges
                  </p>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    {{ sourcePickerQuotation.charges?.length || 0 }} charge items available
                  </p>
                </div>
              </div>
              <ChevronRight
                class="w-4 h-4 text-muted-foreground group-hover:text-[#062c58] transition-colors"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Quotation List View (default) -->
      <div v-else class="space-y-3 pt-1">
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
              @click="canUseQuotationForInvoice(q) ? selectQuotation(q) : undefined"
              :disabled="!canUseQuotationForInvoice(q)"
              :class="[
                'w-full text-left p-4 rounded-xl border transition-all group',
                canUseQuotationForInvoice(q)
                  ? 'border-border hover:border-[#062c58]/40 hover:bg-blue-50/30 cursor-pointer'
                  : 'border-border/40 bg-gray-50/60 opacity-60 cursor-not-allowed',
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'p-2 rounded-lg shrink-0',
                      canUseQuotationForInvoice(q)
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
                        canUseQuotationForInvoice(q) ? 'text-[#062c58]' : 'text-gray-400',
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
                    <p
                      v-for="(amount, curr) in getQuotationTotals(q)"
                      :key="curr"
                      class="text-xs font-bold text-foreground"
                    >
                      {{ curr }}
                      {{
                        new Intl.NumberFormat(curr === "IDR" ? "id-ID" : "en-US", {
                          minimumFractionDigits: curr === "IDR" ? 0 : 2,
                          maximumFractionDigits: curr === "IDR" ? 0 : 2,
                        }).format(amount)
                      }}
                    </p>
                    <span
                      class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border"
                      :class="{
                        'bg-gray-100 text-gray-600 border-gray-200': q.status === 'DRAFT',
                        'bg-amber-50 text-amber-700 border-amber-200': q.status === 'SENT',
                        'bg-blue-50 text-blue-700 border-blue-200': q.status === 'CONFIRMED',
                        'bg-emerald-50 text-emerald-700 border-emerald-200':
                          q.status === 'CONVERTED',
                      }"
                      >{{ q.status }}</span
                    >
                  </div>
                  <ChevronRight
                    v-if="canUseQuotationForInvoice(q)"
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
              <div v-if="hasCostData(q)" class="mt-2 pl-11 flex items-center gap-2">
                <span class="text-[9px] text-muted-foreground font-bold">Revenue:</span>
                <span class="text-[9px] font-extrabold text-[#012D5A]">{{
                  formatCurrency(getQuotationRevenue(q), "IDR")
                }}</span>
                <span class="text-[9px] text-muted-foreground font-bold ml-1">Cost:</span>
                <span class="text-[9px] font-extrabold text-rose-600">{{
                  formatCurrency(getQuotationCostTotal(q), "IDR")
                }}</span>
                <span
                  v-if="getQuotationRevenue(q) > 0"
                  class="text-[9px] px-1.5 py-0.5 rounded font-extrabold border uppercase tracking-wider"
                  :class="
                    getQuotationRevenue(q) >= getQuotationCostTotal(q)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  "
                >
                  {{
                    (
                      ((getQuotationRevenue(q) - getQuotationCostTotal(q)) /
                        getQuotationRevenue(q)) *
                      100
                    ).toFixed(1)
                  }}%
                </span>
              </div>
              <div
                v-if="!canUseQuotationForInvoice(q)"
                class="mt-2 pl-11 flex items-center gap-1.5"
              >
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
                  Harus berstatus CONFIRMED, atau CONVERTED dengan Multi-use aktif
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Item Selection Modal -->
    <Modal
      v-model="showItemSelection"
      title="Pilih Item untuk Invoice"
      :description="
        itemSelectionQuotation
          ? `Pilih charge item dari quotation ${itemSelectionQuotation.number} yang ingin dijadikan invoice.`
          : ''
      "
      width="max-w-2xl"
    >
      <div v-if="itemSelectionQuotation" class="space-y-4 pt-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-muted-foreground">
              {{ (itemSelectionQuotation.charges || []).length }} charge items
            </span>
            <span class="text-[10px] text-muted-foreground">
              · {{ selectedItemIndices.size }} selected
            </span>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="selectAllItems"
              class="px-2 py-1 text-[10px] font-bold text-[#012D5A] hover:bg-blue-50 rounded transition-colors"
            >
              Select All
            </button>
            <button
              @click="deselectAllItems"
              class="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted rounded transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div
          class="max-h-[360px] overflow-y-auto space-y-1 border border-border rounded-xl bg-white"
        >
          <div
            v-for="(ch, idx) in itemSelectionQuotation.charges"
            :key="ch.id || idx"
            @click="toggleItem(idx)"
            class="flex items-center gap-3 p-3 hover:bg-blue-50/30 cursor-pointer transition-colors border-b border-border/50 last:border-0"
            :class="selectedItemIndices.has(idx) ? 'bg-blue-50/20' : ''"
          >
            <div
              class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
              :class="
                selectedItemIndices.has(idx)
                  ? 'bg-[#012D5A] border-[#012D5A]'
                  : 'border-gray-300 hover:border-[#012D5A]/50'
              "
            >
              <Check v-if="selectedItemIndices.has(idx)" class="w-3 h-3 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-[#012D5A] truncate">
                {{ ch.serviceName || ch.description || "Charge Item" }}
              </p>
              <p class="text-[10px] text-muted-foreground mt-0.5 truncate">
                {{ ch.description || "-" }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs font-semibold text-foreground whitespace-nowrap">
                {{ ch.quantity }} x
                {{ formatCurrency(Number(ch.unitPrice || 0), ch.currency || "IDR") }}
              </p>
              <p class="text-[10px] font-extrabold text-[#012D5A] mt-0.5 whitespace-nowrap">
                {{
                  formatCurrency(
                    Number(ch.quantity || 0) * Number(ch.unitPrice || 0),
                    ch.currency || "IDR",
                  )
                }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="itemSelectionQuotation.charges && itemSelectionQuotation.charges.length > 0"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border"
        >
          <span class="text-xs font-bold text-muted-foreground">
            Selected: {{ selectedItemIndices.size }} item(s)
          </span>
          <span class="text-xs font-extrabold text-[#012D5A]">
            {{
              formatCurrency(
                (itemSelectionQuotation.charges || [])
                  .filter((_, i) => selectedItemIndices.has(i))
                  .reduce(
                    (sum, ch) => sum + Number(ch.quantity || 0) * Number(ch.unitPrice || 0),
                    0,
                  ),
                "IDR",
              )
            }}
          </span>
        </div>

        <div class="pt-3 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            @click="
              showItemSelection = false;
              showQuotationPicker = true;
            "
            class="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border-none bg-transparent outline-none cursor-pointer"
          >
            Back to Picker
          </button>
          <button
            type="button"
            :disabled="selectedItemIndices.size === 0"
            @click="confirmItemSelection"
            class="px-5 py-2 text-xs font-black uppercase tracking-wider bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-md shadow-[#062c58]/10 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </Modal>

    <!-- Mixed Currency Selector Modal -->
    <Modal
      v-model="showCurrencySelectModal"
      title="Mixed Currency Invoice Setup"
      description="Quotation ini memiliki item biaya dengan mata uang berbeda. Silakan tentukan mata uang invoice dan kurs konversi."
      width="max-w-md"
    >
      <div class="space-y-5 pt-3">
        <div
          class="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3 text-left"
        >
          <AlertCircle class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div class="text-xs text-blue-800 leading-normal font-medium">
            Item dengan mata uang yang berbeda akan dikonversi secara otomatis ke mata uang invoice
            terpilih.
          </div>
        </div>

        <!-- Invoice Currency Selector -->
        <div class="space-y-1.5 text-left">
          <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Mata Uang Invoice
          </label>
          <div class="flex border border-border rounded-lg overflow-hidden bg-white w-fit">
            <button
              type="button"
              @click="selectedInvoiceCurrency = 'IDR'"
              class="px-4 py-1.5 text-xs font-bold transition-colors"
              :class="
                selectedInvoiceCurrency === 'IDR'
                  ? 'bg-[#062c58] text-white'
                  : 'hover:bg-gray-50 text-muted-foreground'
              "
            >
              IDR
            </button>
            <button
              type="button"
              @click="selectedInvoiceCurrency = 'USD'"
              class="px-4 py-1.5 text-xs font-bold border-l border-border transition-colors"
              :class="
                selectedInvoiceCurrency === 'USD'
                  ? 'bg-[#062c58] text-white'
                  : 'hover:bg-gray-50 text-muted-foreground'
              "
            >
              USD
            </button>
          </div>
        </div>

        <!-- Exchange Rate Input -->
        <div class="space-y-1.5 text-left">
          <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Kurs Konversi (Exchange Rate)
          </label>
          <div class="relative flex items-center">
            <span class="text-xs font-bold text-muted-foreground mr-2">1 USD =</span>
            <input
              type="number"
              v-model.number="conversionExchangeRate"
              @input="isRateSuggested = false"
              placeholder="Masukkan kurs..."
              class="w-full max-w-[180px] px-3 py-2 bg-white border border-border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#062c58]/20 focus:border-[#062c58] outline-none transition-all"
              min="0.0001"
              step="any"
            />
            <span class="text-xs font-bold text-muted-foreground ml-2">IDR</span>

            <div
              v-if="isFetchingRate"
              class="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Loader2 class="w-3.5 h-3.5 animate-spin text-[#062c58]" />
              <span>Mengambil kurs...</span>
            </div>
          </div>

          <!-- Info / Warning messages -->
          <p
            v-if="isRateSuggested && !rateFetchError && !isFetchingRate"
            class="text-[10px] text-green-600 font-bold italic mt-1"
          >
            * Kurs rekomendasi saat ini
          </p>
          <p
            v-if="rateFetchError && !isFetchingRate"
            class="text-[10px] text-red-500 font-bold italic mt-1"
          >
            * Gagal mengambil kurs. Silakan masukkan secara manual.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            @click="
              showCurrencySelectModal = false;
              showItemSelection = true;
            "
            class="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border-none bg-transparent outline-none cursor-pointer"
          >
            Back to Picker
          </button>
          <button
            type="button"
            :disabled="isConfirmDisabled || isFetchingRate"
            @click="
              mixedCurrencyQuotation &&
              proceedPrefillQuotationWithSelection(
                mixedCurrencyQuotation,
                selectedInvoiceCurrency,
                Number(conversionExchangeRate),
              )
            "
            class="px-5 py-2 text-xs font-black uppercase tracking-wider bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-md shadow-[#062c58]/10 cursor-pointer"
          >
            Confirm
          </button>
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
            v-if="canManage && activeInvoice.status?.code !== 'VOIDED'"
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
                v-if="canManage && !isCompleted"
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
                @click="
                  fetchInvoiceHistory(activeInvoice.id);
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-muted flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
              >
                <History class="w-4 h-4 text-muted-foreground" />
                View History Logs
              </button>

              <button
                v-if="canManage && activeInvoice.status?.code !== 'VOIDED' && !isCompleted"
                @click="
                  showVoidConfirm = true;
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
              >
                <Ban class="w-4 h-4" />
                Void Commercial Invoice
              </button>

              <button
                v-if="
                  activeInvoice.status?.code !== 'PAID' &&
                  activeInvoice.status?.code !== 'PARTIALLY_PAID' &&
                  canManage &&
                  !isCompleted
                "
                @click="
                  showDeleteConfirm = true;
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
              >
                <Trash2 class="w-4 h-4" />
                Delete Invoice
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
        <div class="flex items-center gap-2">
          <!-- Always show Job Invoice Logs -->
          <button
            @click="fetchJobInvoiceHistory"
            class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors gap-1.5 shadow-sm"
          >
            <History class="w-3.5 h-3.5 text-slate-500" />
            Job Invoice Logs
          </button>

          <div v-if="canManage && !isCompleted" class="flex items-center gap-2">
            <button
              @click="openQuotationPicker"
              class="inline-flex items-center px-3 py-1.5 bg-white border border-[#062c58]/20 text-[#062c58] text-xs font-semibold rounded-md hover:bg-blue-50 transition-colors gap-1.5 shadow-sm"
            >
              <FileText class="w-3.5 h-3.5" />
              From Quotation
            </button>
            <button
              @click="openBlankInvoiceForm"
              class="inline-flex items-center px-3 py-1.5 bg-[#062c58] text-white text-xs font-semibold rounded-md hover:bg-[#062c58]/90 transition-colors gap-1.5 shadow-sm"
            >
              <Plus class="w-3.5 h-3.5" />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- Invoice Summary Cards -->
      <div v-if="invoices.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Card 1: Total Billed -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Total Billed
              </span>
              <p class="text-base font-black text-[#012D5A] mt-1.5">
                {{ formatCurrency(invoiceSummary.totalBilledIDR, "IDR") }}
                <span
                  v-if="invoiceSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-[#012D5A]/70 ml-1"
                >
                  + {{ formatCurrency(invoiceSummary.totalBilledUSD, "USD") }}
                </span>
              </p>
            </div>
            <FileText class="w-4 h-4 text-[#012D5A] opacity-60" />
          </div>
          <p
            v-if="invoiceSummary.hasUSD && !invoiceSummary.hasUSDWithoutRate"
            class="text-[9px] text-muted-foreground font-bold mt-1"
          >
            Original USD:
            <span class="text-slate-500 font-extrabold">{{
              formatCurrency(invoiceSummary.totalBilledUSD, "USD")
            }}</span>
          </p>
        </div>

        <!-- Card 2: Total Received -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Total Received
              </span>
              <p class="text-base font-black text-emerald-600 mt-1.5">
                {{ formatCurrency(invoiceSummary.totalPaidIDR, "IDR") }}
                <span
                  v-if="invoiceSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-emerald-600/70 ml-1"
                >
                  + {{ formatCurrency(invoiceSummary.totalPaidUSD, "USD") }}
                </span>
              </p>
            </div>
            <Check class="w-4 h-4 text-emerald-600" />
          </div>
          <div class="space-y-0.5 mt-1">
            <p
              v-if="invoiceSummary.totalOverpaidIDR > 0 || invoiceSummary.totalOverpaidUSD > 0"
              class="text-[9px] text-emerald-600 font-bold"
            >
              Includes Overpayment: {{ formatCurrency(invoiceSummary.totalOverpaidIDR, "IDR") }}
              <span v-if="invoiceSummary.totalOverpaidUSD > 0">
                + {{ formatCurrency(invoiceSummary.totalOverpaidUSD, "USD") }}</span
              >
            </p>
            <p
              v-if="invoiceSummary.hasUSD && !invoiceSummary.hasUSDWithoutRate"
              class="text-[9px] text-muted-foreground font-bold"
            >
              Original USD:
              <span class="text-slate-500 font-extrabold">{{
                formatCurrency(invoiceSummary.totalPaidUSD, "USD")
              }}</span>
            </p>
          </div>
        </div>

        <!-- Card 3: Outstanding Balance -->
        <div
          class="rounded-xl p-4 shadow-sm text-white flex flex-col justify-between min-h-[110px]"
          :class="
            invoiceSummary.totalDueIDR > 0 || invoiceSummary.totalDueUSD > 0
              ? 'bg-rose-700'
              : 'bg-[#012D5A]'
          "
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Outstanding Balance
              </p>
              <p class="text-base font-black mt-1.5">
                {{ formatCurrency(invoiceSummary.totalDueIDR, "IDR") }}
                <span
                  v-if="invoiceSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-white/80 ml-1"
                >
                  + {{ formatCurrency(invoiceSummary.totalDueUSD, "USD") }}
                </span>
              </p>
            </div>
            <AlertCircle
              v-if="invoiceSummary.totalDueIDR > 0 || invoiceSummary.totalDueUSD > 0"
              class="w-4 h-4 text-white"
            />
            <Check v-else class="w-4 h-4 text-emerald-400" />
          </div>
          <p
            v-if="invoiceSummary.hasUSD && !invoiceSummary.hasUSDWithoutRate"
            class="text-[9px] text-white/80 font-bold mt-1"
          >
            Original USD:
            <span class="text-white font-extrabold">{{
              formatCurrency(invoiceSummary.totalDueUSD, "USD")
            }}</span>
          </p>
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
              <template v-if="invoice.currency === 'USD' && Number(invoice.exchangeRate || 1) > 1">
                <p class="font-black text-xs text-foreground whitespace-nowrap">
                  {{
                    formatCurrency(Number(invoice.total || 0) * Number(invoice.exchangeRate), "IDR")
                  }}
                </p>
                <p class="text-[9px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap">
                  {{ formatCurrency(invoice.total, "USD") }} · Kurs:
                  {{ formatCurrency(Number(invoice.exchangeRate || 1), "IDR") }}
                </p>
              </template>
              <template v-else>
                <p class="font-black text-xs text-foreground whitespace-nowrap">
                  {{ formatCurrency(invoice.total, invoice.currency) }}
                </p>
              </template>
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
                <template
                  v-if="invoice.currency === 'USD' && Number(invoice.exchangeRate || 1) > 1"
                >
                  <p class="font-black text-xs text-red-600 whitespace-nowrap">
                    {{
                      formatCurrency(
                        Number(invoice.balanceDue) * Number(invoice.exchangeRate),
                        "IDR",
                      )
                    }}
                  </p>
                  <p
                    class="text-[9px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap text-right"
                  >
                    {{ formatCurrency(invoice.balanceDue, "USD") }}
                  </p>
                </template>
                <template v-else>
                  <p class="font-black text-xs text-red-600 whitespace-nowrap">
                    {{ formatCurrency(invoice.balanceDue, invoice.currency) }}
                  </p>
                </template>
              </template>
              <template v-else>
                <p class="font-black text-xs text-green-600 whitespace-nowrap">Paid In Full</p>
                <template v-if="getOverpayment(invoice) > 0">
                  <template
                    v-if="invoice.currency === 'USD' && Number(invoice.exchangeRate || 1) > 1"
                  >
                    <p class="text-[9px] text-emerald-600 font-semibold mt-0.5 whitespace-nowrap">
                      +{{
                        formatCurrency(
                          getOverpayment(invoice) * Number(invoice.exchangeRate),
                          "IDR",
                        )
                      }}
                      overpaid
                    </p>
                    <p class="text-[8px] text-muted-foreground mt-0.5 whitespace-nowrap text-right">
                      +{{ formatCurrency(getOverpayment(invoice), "USD") }}
                    </p>
                  </template>
                  <template v-else>
                    <p class="text-[9px] text-emerald-600 font-semibold mt-0.5 whitespace-nowrap">
                      +{{ formatCurrency(getOverpayment(invoice), invoice.currency) }} overpaid
                    </p>
                  </template>
                </template>
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
      width="max-w-lg"
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

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model="showDeleteConfirm"
      title="Delete Invoice"
      description="Are you sure you want to delete this invoice? This will soft-delete the invoice and hide it from all lists."
      width="max-w-sm"
    >
      <div class="space-y-4 pt-2">
        <div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p class="text-xs text-red-800 leading-relaxed font-medium">
            Deleting an invoice will hide it from normal views, reports, and calculations. You can
            recover it later if needed.
          </p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDeleteInvoice"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2"
          >
            <Loader2 v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" />
            {{ isDeleting ? "Deleting..." : "Confirm Delete" }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- History Log Modal -->
    <JobFinanceHistoryModal
      v-model="showHistoryModal"
      :is-job-history="isJobHistory"
      :is-loading="isLoadingHistory"
      :history-logs="historyLogs"
      :title="isJobHistory ? 'Job Invoice Logs' : 'Activity History'"
      :description="
        isJobHistory
          ? 'List of all activity and invoice logs for this job.'
          : 'List of all activities and changes related to this invoice.'
      "
    />
  </div>
</template>
