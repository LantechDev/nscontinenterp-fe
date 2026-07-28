<script setup lang="ts">
import {
  Plus,
  Receipt,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Wallet,
  ArrowLeft,
  Download,
  Ban,
  History,
  FileText,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-vue-next";
import JobVendorInvoiceForm from "./JobVendorInvoiceForm.vue";
import JobVendorInvoicePreview from "./JobVendorInvoicePreview.vue";
import JobPaymentTab from "./JobPaymentTab.vue";
import PaymentEntryForm from "~/components/finance/PaymentEntryForm.vue";
import Modal from "~/components/ui/Modal.vue";
import CurrencyStack from "~/components/ui/CurrencyStack.vue";
import { useFinanceExpense, getOverpayment, type Expense } from "~/composables/useFinanceExpense";
import { useQuotations, type Quotation, type QuotationCost } from "~/composables/useQuotations";
import { toast } from "vue-sonner";
import JobFinanceHistoryModal from "./JobFinanceHistoryModal.vue";
import type { ActivityLog } from "~/lib/activity-log-api";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  customerId?: string;
  initialInvoiceId?: string;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-job"): void;
}>();

const {
  fetchExpenses,
  voidExpense,
  createExpense,
  isLoading: isGlobalLoading,
} = useFinanceExpense();
const { fetchQuotations } = useQuotations();
const { canManage, requireManage } = useFeatureAccess("finance.payment");

const expenses = ref<Expense[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const editingExpense = ref<Expense | null>(null);

// Payment & Detail State
const showPaymentForm = ref(false);
const activeExpense = ref<Expense | null>(null);
const showDetail = ref(false);
const previewRef = ref<InstanceType<typeof JobVendorInvoicePreview> | null>(null);
const isGeneratingPDF = ref(false);
const showMoreActions = ref(false);
const paymentTabRef = ref<InstanceType<typeof JobPaymentTab> | null>(null);
const isVoiding = ref(false);
const showVoidConfirm = ref(false);

const showHistoryModal = ref(false);
const isLoadingHistory = ref(false);
const historyLogs = ref<ActivityLog[]>([]);
const isJobHistory = ref(false);

// Quotation picker state
const showQuotationPicker = ref(false);
const quotationsList = ref<Quotation[]>([]);
const isLoadingQuotations = ref(false);
const isImportingCosts = ref(false);

const showReviewModal = ref(false);
const selectedQuotation = ref<Quotation | null>(null);
const expandedCostIds = ref<Set<string>>(new Set());
const importedCostIds = ref<Set<string>>(new Set());
const currentImportingCostId = ref<string | null>(null);

const toggleExpandCost = (costId: string) => {
  const next = new Set(expandedCostIds.value);
  if (next.has(costId)) next.delete(costId);
  else next.add(costId);
  expandedCostIds.value = next;
};

const isCostAlreadyImported = (cost: QuotationCost) => {
  if (cost.id && importedCostIds.value.has(cost.id)) return true;
  if (!cost.number) return false;
  return expenses.value.some((e) => e.number?.toUpperCase() === cost.number?.toUpperCase());
};

const fetchExpenseHistory = async (expenseId: string) => {
  isJobHistory.value = false;
  showHistoryModal.value = true;
  isLoadingHistory.value = true;
  try {
    const data = await $fetch<ActivityLog[]>(`/api/finance/expense/${expenseId}/activity-logs`);
    historyLogs.value = data || [];
  } catch (err) {
    console.error("Failed to load expense history:", err);
    toast.error("Failed to load expense history");
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

const loadExpenses = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await fetchExpenses({ jobId: props.jobId, limit: 100 });
    expenses.value = result.items || [];

    // Refresh active expense if in detail view
    if (activeExpense.value) {
      const updated = expenses.value.find((e) => e.id === activeExpense.value?.id);
      if (updated) activeExpense.value = updated;
    }

    // Auto-open detail if initialInvoiceId is provided
    if (props.initialInvoiceId) {
      const expense = expenses.value.find((e) => e.id === props.initialInvoiceId);
      if (expense) {
        openDetail(expense);
      }
    }
  } catch (err: unknown) {
    error.value = (err as Error).message || "Failed to load vendor invoices";
  } finally {
    isLoading.value = false;
  }
};

const expenseSummary = computed(() => {
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

  expenses.value.forEach((exp) => {
    if (getExpenseStatusCode(exp) === "VOIDED") return;

    const rate = Number(exp.exchangeRate || 1);
    const isUSD = exp.currency === "USD";
    const useRate = isUSD && rate > 1;

    const amount = Number(exp.amount || 0);
    const balanceDue = Number(exp.balanceDue || 0);

    const overpayment = getOverpayment(exp);
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

watch(
  () => props.jobId,
  async (newJobId) => {
    if (newJobId) {
      await loadExpenses();
    }
  },
);

const openCreateForm = () => {
  if (!requireManage("You only have view access for vendor invoices.")) return;

  editingExpense.value = null;
  showForm.value = true;
};

const openQuotationPicker = async () => {
  if (!requireManage("You only have view access for vendor invoices.")) return;
  isLoadingQuotations.value = true;
  showQuotationPicker.value = true;
  const res = await fetchQuotations({ limit: 100, status: undefined });
  if (res.success && res.data) {
    quotationsList.value = (res.data.items || []).filter(
      (q) =>
        q.costs && q.costs.length > 0 && (!props.customerId || q.customerId === props.customerId),
    );
  }
  isLoadingQuotations.value = false;
};

const getQuotationCostTotals = (q: Quotation) => {
  const totals: Record<string, number> = {};
  (q.costs || []).forEach((c) => {
    totals.IDR = (totals.IDR || 0) + Number(c.amount || 0);
  });
  return totals;
};

const openReviewModal = (q: Quotation) => {
  selectedQuotation.value = q;
  expandedCostIds.value = new Set();
  importedCostIds.value = new Set();
  currentImportingCostId.value = null;
  showQuotationPicker.value = false;
  showReviewModal.value = true;
};

const costSummaryDescription = (c: QuotationCost) => {
  const items = c.items || [];
  if (items.length === 0) return c.notes || "Vendor Cost";
  const first = items[0]?.description || "Vendor Cost";
  return items.length > 1 ? `${first} +${items.length - 1} items` : first;
};

const handleImportCost = (cost: QuotationCost) => {
  currentImportingCostId.value = cost.id || null;

  const prefilledExpense: Partial<Expense> = {
    number: cost.number || `EXP-${Date.now().toString().slice(-6)}`,
    description: costSummaryDescription(cost),
    amount: Number(cost.amount || 0),
    date: cost.date || new Date().toISOString().split("T")[0],
    categoryId: cost.categoryId || "",
    vendorId: cost.vendorId || "",
    taxId: cost.taxId || "",
    notes: cost.notes || "",
    currency: (cost.items?.[0]?.currency || "IDR") as "IDR" | "USD",
    exchangeRate: Number(cost.exchangeRate || 1),
    vendor: cost.vendorId ? { id: cost.vendorId, name: cost.vendorName || "No Vendor" } : undefined,
    items: (cost.items || []).map((it) => ({
      serviceId: it.serviceId || "",
      description: it.description,
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unitPrice || 0),
      currency: it.currency || "IDR",
      amount: Number(it.amount || Number(it.quantity || 1) * Number(it.unitPrice || 0)),
    })),
  };

  editingExpense.value = prefilledExpense as unknown as Expense;
  showReviewModal.value = false;
  showQuotationPicker.value = false;
  showForm.value = true;
  toast.success(`Prefilled vendor invoice from quotation.`);
};

const openEditForm = () => {
  if (!requireManage("You only have view access for vendor invoices.")) return;

  editingExpense.value = activeExpense.value;
  showForm.value = true;
};

const openDetail = (expense: Expense) => {
  activeExpense.value = expense;
  showDetail.value = true;
};

const closeDetail = () => {
  activeExpense.value = null;
  showDetail.value = false;
};

const handleVoid = async () => {
  if (!activeExpense.value) return;
  if (!requireManage("You only have view access for vendor invoices.")) return;

  isVoiding.value = true;
  const result = await voidExpense(activeExpense.value.id);
  if (result.success) {
    showVoidConfirm.value = false;
    await loadExpenses();
    paymentTabRef.value?.refresh();
    emit("refresh-job");
    toast.success("Vendor invoice voided");
  } else {
    toast.error(result.error || "Failed to void vendor invoice");
  }
  isVoiding.value = false;
};

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

onMounted(async () => {
  await loadExpenses();
  if (props.initialInvoiceId) {
    const expense = expenses.value.find((e) => e.id === props.initialInvoiceId);
    if (expense) {
      openDetail(expense);
    }
  }
});

watch(
  () => props.initialInvoiceId,
  (newId) => {
    if (newId) {
      const expense = expenses.value.find((e) => e.id === newId);
      if (expense) {
        openDetail(expense);
      }
    }
  },
);

const handleSuccess = () => {
  showForm.value = false;
  if (currentImportingCostId.value) {
    importedCostIds.value.add(currentImportingCostId.value);
    currentImportingCostId.value = null;
    showReviewModal.value = true;
  }
  loadExpenses();
  emit("refresh-job");
};

const handleCancel = () => {
  showForm.value = false;
  if (currentImportingCostId.value) {
    currentImportingCostId.value = null;
    showReviewModal.value = true;
  }
};

const handlePaymentSuccess = () => {
  showPaymentForm.value = false;
  loadExpenses();
  paymentTabRef.value?.refresh();
  emit("refresh-job");
};

const handlePaymentVoided = async () => {
  await loadExpenses();
  emit("refresh-job");
};

const handlePrint = async () => {
  if (previewRef.value) {
    isGeneratingPDF.value = true;
    await previewRef.value.generatePDF();
    isGeneratingPDF.value = false;
  }
};

const getExpenseStatusCode = (expense?: Expense | null) => {
  const explicitCode = expense?.status?.code?.toUpperCase();
  if (explicitCode) return explicitCode;
  if (!expense) return "";

  const amount = Number(expense.amount || 0);
  const balanceDue = Number(expense.balanceDue || 0);
  if (balanceDue <= 0) return "PAID";
  if (amount > 0 && balanceDue < amount) return "PARTIALLY_PAID";
  return "UNPAID";
};

const getExpenseStatusName = (expense?: Expense | null) => {
  if (expense?.status?.name) return expense.status.name;
  const code = getExpenseStatusCode(expense);
  const names: Record<string, string> = {
    PAID: "Paid",
    PARTIALLY_PAID: "Partially Paid",
    UNPAID: "Unpaid",
    VOIDED: "Voided",
    VOID: "Voided",
  };
  return names[code] || code || "-";
};

const activeExpenseStatusCode = computed(() => getExpenseStatusCode(activeExpense.value));

const getStatusColor = (code?: string) => {
  switch (code?.toUpperCase()) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "PARTIALLY_PAID":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "VOIDED":
      return "bg-red-100 text-red-700 border-red-200";
    case "UNPAID":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Form Modal -->
    <Modal
      v-model="showForm"
      :title="editingExpense ? 'Edit Vendor Invoice' : 'Record Vendor Invoice'"
      :description="
        editingExpense
          ? 'Modify existing vendor invoice details.'
          : 'Record a new incoming invoice from a vendor.'
      "
      width="2xl"
    >
      <JobVendorInvoiceForm
        :key="editingExpense?.id || 'new-' + (editingExpense?.number || '')"
        :job-id="jobId"
        :expense="editingExpense"
        @success="handleSuccess"
        @cancel="handleCancel"
      />
    </Modal>

    <!-- Detail View -->
    <div v-if="showDetail && activeExpense" class="animate-fade-in flex flex-col gap-6">
      <div class="flex items-start justify-between gap-4 border-b border-border/50 pb-4">
        <div class="flex min-w-0 items-start gap-3">
          <button
            @click="closeDetail"
            class="mt-1 p-2 -ml-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="min-w-0">
            <h2 class="text-xl font-bold leading-tight text-foreground">
              Vendor Invoice {{ activeExpense.number }}
            </h2>
            <p class="text-sm text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">
              {{ activeExpense.vendor?.name }} • {{ formatDate(activeExpense.date) }}
            </p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <span
                v-if="activeExpense.number?.toUpperCase().startsWith('VCOST-')"
                class="inline-flex h-6 items-center rounded-md border border-blue-200 bg-blue-50 px-2 text-[10px] font-bold uppercase tracking-wider text-blue-700"
              >
                From Quotation
              </span>
              <span
                :class="[
                  'inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-bold uppercase tracking-wider',
                  getStatusColor(activeExpenseStatusCode),
                ]"
              >
                {{ getExpenseStatusName(activeExpense) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <!-- Record Payment (Primary Action) -->
          <button
            v-if="
              canManage &&
              !['PAID', 'VOIDED', 'VOID'].includes(activeExpenseStatusCode) &&
              !isCompleted
            "
            @click="showPaymentForm = true"
            class="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Wallet class="w-4 h-4" />
            Record Payment
          </button>

          <!-- Download PDF (Secondary Action) -->
          <button
            @click="handlePrint"
            :disabled="isGeneratingPDF"
            class="inline-flex h-10 items-center gap-2 rounded-md bg-[#062c58] px-3.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#062c58]/90 disabled:opacity-50"
          >
            <Loader2 v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" />
            <Download v-else class="w-4 h-4" />
            {{ isGeneratingPDF ? "Generating" : "Download PDF" }}
          </button>

          <!-- More Actions Dropdown -->
          <div class="relative">
            <button
              @click="showMoreActions = !showMoreActions"
              class="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
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
              </div>

              <button
                v-if="canManage && !isCompleted"
                @click="
                  openEditForm();
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
              >
                <Pencil class="w-4 h-4 text-primary" />
                Edit Details
              </button>

              <button
                v-if="
                  canManage && !['VOIDED', 'VOID'].includes(activeExpenseStatusCode) && !isCompleted
                "
                @click="
                  showVoidConfirm = true;
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
              >
                <Ban class="w-4 h-4" />
                Void Vendor Invoice
              </button>

              <button
                @click="
                  fetchExpenseHistory(activeExpense.id);
                  showMoreActions = false;
                "
                class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
              >
                <History class="w-4 h-4 text-muted-foreground" />
                View History Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment History Mini List -->
      <div
        v-if="activeExpense.paymentAllocations && activeExpense.paymentAllocations.length > 0"
        class="bg-gray-50/50 border border-border rounded-xl p-4"
      >
        <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Payment History
        </h4>
        <div class="space-y-2">
          <div
            v-for="alloc in activeExpense.paymentAllocations"
            :key="alloc.id"
            class="flex items-center justify-between p-2 bg-white rounded-lg border border-border/50 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700"
              >
                <Wallet class="w-4 h-4" />
              </div>
              <div v-if="alloc.payment">
                <p class="text-sm font-bold text-foreground">
                  {{ formatCurrency(alloc.amount, activeExpense.currency) }}
                </p>
                <p
                  v-if="activeExpense.currency && activeExpense.currency !== 'IDR'"
                  class="text-[10px] text-muted-foreground font-semibold"
                >
                  ≈
                  {{
                    formatCurrency(Number(alloc.amount) * Number(activeExpense.exchangeRate || 1))
                  }}
                </p>
                <p class="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {{ alloc.payment.paymentMethod?.name || "-" }} •
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
        v-else-if="['VOIDED', 'VOID'].includes(activeExpenseStatusCode)"
        class="bg-gray-50/50 border border-border border-dashed rounded-xl p-8 text-center mt-4"
      >
        <Receipt class="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Payment History Cleared
        </p>
        <p class="text-[10px] text-muted-foreground mt-1 max-w-[220px] mx-auto leading-relaxed">
          Applied vendor payments were released back to their original records when this invoice was
          voided.
        </p>
      </div>

      <!-- Preview Component -->
      <JobVendorInvoicePreview ref="previewRef" :expense="activeExpense" />
    </div>

    <!-- List View -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-foreground">Vendor Invoices (Invoice Masuk)</h3>
        <div class="flex items-center gap-2">
          <!-- Always show Job Invoice Logs -->
          <button
            @click="fetchJobInvoiceHistory"
            class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors gap-1.5 shadow-sm"
          >
            <History class="w-3.5 h-3.5 text-slate-500" />
            Job Invoice Logs
          </button>

          <button
            v-if="canManage && !isCompleted"
            @click="openQuotationPicker"
            class="inline-flex items-center px-3 py-1.5 bg-white border border-[#062c58]/20 text-[#062c58] text-xs font-semibold rounded-md hover:bg-blue-50 transition-colors gap-1.5 shadow-sm"
          >
            <FileText class="w-3.5 h-3.5" />
            From Quotation
          </button>

          <button
            v-if="canManage && !isCompleted"
            @click="openCreateForm"
            class="inline-flex items-center px-3 py-1.5 bg-[#012D5A] text-white text-xs font-semibold rounded-md hover:bg-[#012D5A]/90 transition-colors gap-1.5 shadow-sm uppercase tracking-wider"
          >
            <Plus class="w-3.5 h-3.5" />
            Record Invoice
          </button>
        </div>
      </div>

      <!-- Expense Summary Cards -->
      <div v-if="expenses.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Card 1: Total Cost -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Total Cost
              </span>
              <p class="text-base font-black text-[#012D5A] mt-1.5">
                {{ formatCurrency(expenseSummary.totalBilledIDR, "IDR") }}
                <span
                  v-if="expenseSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-[#012D5A]/70 ml-1"
                >
                  + {{ formatCurrency(expenseSummary.totalBilledUSD, "USD") }}
                </span>
              </p>
            </div>
            <Receipt class="w-4 h-4 text-[#012D5A] opacity-60" />
          </div>
          <p
            v-if="expenseSummary.hasUSD && !expenseSummary.hasUSDWithoutRate"
            class="text-[9px] text-muted-foreground opacity-70 font-semibold mt-1"
          >
            {{ formatCurrency(expenseSummary.totalBilledUSD, "USD") }}
          </p>
        </div>

        <!-- Card 2: Total Paid -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Total Paid
              </span>
              <p class="text-base font-black text-emerald-600 mt-1.5">
                {{ formatCurrency(expenseSummary.totalPaidIDR, "IDR") }}
                <span
                  v-if="expenseSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-emerald-600/70 ml-1"
                >
                  + {{ formatCurrency(expenseSummary.totalPaidUSD, "USD") }}
                </span>
              </p>
            </div>
            <Check class="w-4 h-4 text-emerald-600" />
          </div>
          <div class="space-y-0.5 mt-1">
            <p
              v-if="expenseSummary.totalOverpaidIDR > 0 || expenseSummary.totalOverpaidUSD > 0"
              class="text-[9px] text-emerald-600 font-bold"
            >
              Includes Overpayment: {{ formatCurrency(expenseSummary.totalOverpaidIDR, "IDR") }}
              <span v-if="expenseSummary.totalOverpaidUSD > 0">
                + {{ formatCurrency(expenseSummary.totalOverpaidUSD, "USD") }}</span
              >
            </p>
            <p
              v-if="expenseSummary.hasUSD && !expenseSummary.hasUSDWithoutRate"
              class="text-[9px] text-muted-foreground opacity-70 font-semibold"
            >
              {{ formatCurrency(expenseSummary.totalPaidUSD, "USD") }}
            </p>
          </div>
        </div>

        <!-- Card 3: Outstanding Balance -->
        <div
          class="rounded-xl p-4 shadow-sm text-white flex flex-col justify-between min-h-[110px]"
          :class="
            expenseSummary.totalDueIDR > 0 || expenseSummary.totalDueUSD > 0
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
                {{ formatCurrency(expenseSummary.totalDueIDR, "IDR") }}
                <span
                  v-if="expenseSummary.hasUSDWithoutRate"
                  class="text-xs font-bold text-white/80 ml-1"
                >
                  + {{ formatCurrency(expenseSummary.totalDueUSD, "USD") }}
                </span>
              </p>
            </div>
            <AlertCircle
              v-if="expenseSummary.totalDueIDR > 0 || expenseSummary.totalDueUSD > 0"
              class="w-4 h-4 text-white"
            />
            <Check v-else class="w-4 h-4 text-emerald-400" />
          </div>
          <p
            v-if="expenseSummary.hasUSD && !expenseSummary.hasUSDWithoutRate"
            class="text-[9px] text-white/70 font-semibold mt-1"
          >
            {{ formatCurrency(expenseSummary.totalDueUSD, "USD") }}
          </p>
        </div>
      </div>

      <div v-if="isLoading" class="py-2">
        <UiLoadingSkeleton variant="table" :columns="6" />
      </div>

      <div v-else-if="error" class="p-6 text-center bg-red-50 rounded-xl border border-red-100">
        <AlertCircle class="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p class="text-sm font-medium text-red-800">{{ error }}</p>
        <button @click="loadExpenses" class="mt-4 text-xs font-bold text-red-700 hover:underline">
          Try Again
        </button>
      </div>

      <div
        v-else-if="expenses.length === 0"
        class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
      >
        <div
          class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
        >
          <Receipt class="w-6 h-6 text-muted-foreground opacity-40" />
        </div>
        <p class="text-sm font-semibold text-foreground mb-1">No Vendor Invoices Found</p>
        <p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
          Record incoming invoices from vendors like shipping lines, trucking, or port authorities.
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          @click="openDetail(expense)"
          class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer flex flex-col gap-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100"
              >
                <Wallet class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span
                    class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors"
                  >
                    {{ expense.number }}
                  </span>
                  <span
                    v-if="expense.number?.toUpperCase().startsWith('VCOST-')"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider shrink-0"
                  >
                    From Quotation
                  </span>
                  <span
                    :class="[
                      'text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider',
                      getStatusColor(getExpenseStatusCode(expense)),
                    ]"
                  >
                    {{ getExpenseStatusName(expense) }}
                  </span>
                </div>
                <p class="text-xs font-bold text-foreground mt-1 uppercase">
                  {{ expense.vendor?.name }}
                </p>
                <p
                  class="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium"
                >
                  {{ formatDate(expense.date) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p
                class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
              >
                Amount
              </p>
              <CurrencyStack
                :amount="expense.amount"
                :currency="expense.currency"
                :exchange-rate="expense.exchangeRate"
                primary-class="font-black text-sm text-red-600 whitespace-nowrap"
                secondary-class="text-[10px] text-muted-foreground opacity-70 font-semibold whitespace-nowrap"
                align="right"
                show-rate
              />
            </div>
          </div>

          <div class="border-t border-border pt-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p
                  class="text-[9px] text-muted-foreground mb-1 uppercase tracking-widest font-bold opacity-70"
                >
                  Description
                </p>
                <p class="text-[10px] font-bold text-foreground line-clamp-2">
                  {{ expense.description }}
                </p>
              </div>
              <div class="text-right">
                <p
                  class="text-[9px] text-muted-foreground mb-1 uppercase tracking-widest font-bold opacity-70"
                >
                  Balance Due
                </p>
                <template v-if="getExpenseStatusCode(expense) === 'VOIDED'">
                  <p class="font-black text-xs text-gray-400 line-through whitespace-nowrap">
                    Voided
                  </p>
                </template>
                <template v-else-if="Number(expense.balanceDue || 0) > 0">
                  <template
                    v-if="expense.currency === 'USD' && Number(expense.exchangeRate || 1) > 1"
                  >
                    <CurrencyStack
                      :amount="expense.balanceDue"
                      :currency="expense.currency"
                      :exchange-rate="expense.exchangeRate"
                      primary-class="font-black text-xs text-red-600 whitespace-nowrap"
                      secondary-class="text-[9px] text-muted-foreground opacity-70 font-semibold whitespace-nowrap"
                      align="right"
                    />
                  </template>
                  <template v-else>
                    <p class="font-black text-xs text-red-600 whitespace-nowrap">
                      {{ formatCurrency(Number(expense.balanceDue), expense.currency) }}
                    </p>
                  </template>
                </template>
                <template v-else>
                  <p class="font-black text-xs text-green-600 whitespace-nowrap">Paid In Full</p>
                  <template v-if="getOverpayment(expense) > 0">
                    <template
                      v-if="expense.currency === 'USD' && Number(expense.exchangeRate || 1) > 1"
                    >
                      <CurrencyStack
                        :amount="getOverpayment(expense)"
                        :currency="expense.currency"
                        :exchange-rate="expense.exchangeRate"
                        primary-class="text-[10px] text-emerald-600 font-semibold whitespace-nowrap"
                        secondary-class="text-[9px] text-muted-foreground opacity-70 whitespace-nowrap"
                        align="right"
                        prefix="+"
                        suffix="overpaid"
                      />
                    </template>
                    <template v-else>
                      <p class="text-[10px] text-emerald-600 font-semibold mt-0.5 font-bold">
                        +{{ formatCurrency(getOverpayment(expense), expense.currency) }} overpaid
                      </p>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            <div class="flex items-center justify-end mt-2">
              <span
                class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase border border-gray-200"
                >{{ expense.category?.name || "General" }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Consolidated Payment History -->
      <div v-if="expenses.length > 0" class="mt-12 pt-12 border-t border-border/50">
        <h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 px-1">
          Consolidated Payment History
        </h3>
        <JobPaymentTab
          ref="paymentTabRef"
          :job-id="jobId"
          :is-completed="isCompleted"
          mode="out"
          @reload="handlePaymentVoided"
        />
      </div>
    </div>

    <!-- Payment Modal -->
    <Modal
      v-model="showPaymentForm"
      title="Record Payment"
      description="Allocate payment to vendor invoice."
      width="lg"
    >
      <PaymentEntryForm
        v-if="activeExpense"
        :expense-id="activeExpense.id"
        :company-id="activeExpense.vendorId"
        mode="out"
        @success="handlePaymentSuccess"
        @cancel="showPaymentForm = false"
      />
    </Modal>

    <!-- Void Confirm Modal -->
    <Modal
      v-model="showVoidConfirm"
      title="Void Vendor Invoice"
      description="Are you sure you want to void this vendor invoice? This will create a reversal journal entry and cannot be undone."
      width="max-w-sm"
    >
      <div class="space-y-4 pt-2">
        <div class="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p class="text-xs text-red-800 leading-relaxed font-medium">
            Voiding a vendor invoice will record it as inactive for audit purposes and zero out the
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
          : 'List of all activities and changes related to this vendor invoice.'
      "
    />

    <!-- Review Costs Modal -->
    <Modal
      v-model="showReviewModal"
      title="Review Vendor Costs"
      :description="`Quotation ${selectedQuotation?.number || ''} — pilih cost yang ingin diimpor.`"
      width="max-w-4xl"
    >
      <div class="space-y-3 pt-1">
        <div
          v-if="!selectedQuotation || !selectedQuotation.costs?.length"
          class="py-8 text-center text-muted-foreground text-sm"
        >
          Tidak ada vendor cost.
        </div>
        <div v-else class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          <div
            v-for="cost in selectedQuotation.costs"
            :key="cost.id"
            class="rounded-lg border border-border hover:border-[#062c58]/20 transition-all flex flex-col bg-white overflow-hidden"
          >
            <!-- Header Row -->
            <div
              class="flex items-center gap-3 p-3 cursor-pointer select-none bg-white hover:bg-slate-50/50"
              @click="cost.id && toggleExpandCost(cost.id)"
            >
              <Checkbox
                :modelValue="isCostAlreadyImported(cost)"
                :disabled="true"
                class="pointer-events-none"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-foreground flex items-center gap-1.5">
                  {{ cost.vendorName || "No Vendor" }}
                  <span
                    v-if="cost.number"
                    class="text-[10px] text-muted-foreground font-normal bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
                  >
                    {{ cost.number }}
                  </span>
                  <span
                    v-if="isCostAlreadyImported(cost)"
                    class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    Imported
                  </span>
                </p>
                <p class="text-[10px] text-muted-foreground mt-0.5">
                  {{ cost.items?.length || 0 }} item(s)
                </p>
              </div>
              <div class="text-right shrink-0 mr-2">
                <p class="text-sm font-bold text-red-600">
                  {{
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(Number(cost.amount || 0))
                  }}
                </p>
                <p
                  v-for="curr in [...new Set((cost.items || []).map((it) => it.currency || 'IDR'))]"
                  :key="curr"
                  class="text-[9px] font-bold text-muted-foreground uppercase"
                >
                  {{ curr }}
                </p>
              </div>

              <button
                type="button"
                @click.stop="handleImportCost(cost)"
                :disabled="isCostAlreadyImported(cost)"
                class="px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm shrink-0 uppercase tracking-wider border"
                :class="
                  isCostAlreadyImported(cost)
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-[#012D5A] hover:bg-[#012D5A]/90 border-transparent text-white'
                "
              >
                {{ isCostAlreadyImported(cost) ? "Imported" : "Import" }}
              </button>

              <button
                type="button"
                @click.stop="cost.id && toggleExpandCost(cost.id)"
                class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                :title="expandedCostIds.has(cost.id || '') ? 'Hide details' : 'Show details'"
              >
                <ChevronDown
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': cost.id && expandedCostIds.has(cost.id || '') }"
                />
              </button>
            </div>

            <!-- Items Details (Collapsible) -->
            <div
              v-if="cost.id && expandedCostIds.has(cost.id || '')"
              class="border-t border-border/50 bg-slate-50/50 px-4 py-3 text-xs space-y-2"
            >
              <div
                class="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/60 pb-1.5 mb-1.5 flex justify-between"
              >
                <span>Item Description</span>
                <div class="flex gap-10">
                  <span class="w-16 text-center">Qty / Curr</span>
                  <span class="w-24 text-right">Unit Price</span>
                  <span class="w-24 text-right">Total</span>
                </div>
              </div>
              <div
                v-for="item in cost.items"
                :key="item.id"
                class="flex justify-between items-start py-1"
              >
                <div class="flex-1 min-w-0 pr-4">
                  <p class="font-bold text-foreground uppercase truncate">
                    {{ item.serviceName || item.description }}
                  </p>
                  <p
                    v-if="item.serviceName"
                    class="text-[10px] text-muted-foreground uppercase mt-0.5 truncate"
                  >
                    {{ item.description }}
                  </p>
                </div>
                <div class="flex gap-10 shrink-0 font-mono text-[11px]">
                  <span class="w-16 text-center text-foreground font-semibold">
                    {{ item.quantity }}
                    <span class="text-[10px] text-muted-foreground font-normal">{{
                      item.currency
                    }}</span>
                  </span>
                  <span class="w-24 text-right text-foreground">
                    {{
                      new Intl.NumberFormat(item.currency === "IDR" ? "id-ID" : "en-US", {
                        minimumFractionDigits: item.currency === "IDR" ? 0 : 2,
                        maximumFractionDigits: item.currency === "IDR" ? 0 : 2,
                      }).format(Number(item.unitPrice))
                    }}
                  </span>
                  <span class="w-24 text-right text-[#012D5A] font-bold">
                    {{
                      new Intl.NumberFormat(item.currency === "IDR" ? "id-ID" : "en-US", {
                        minimumFractionDigits: item.currency === "IDR" ? 0 : 2,
                        maximumFractionDigits: item.currency === "IDR" ? 0 : 2,
                      }).format(Number(item.quantity) * Number(item.unitPrice))
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end items-center pt-3 border-t border-border">
          <button
            type="button"
            @click="showReviewModal = false"
            class="px-4 py-2 text-xs font-bold text-[#062c58] hover:bg-muted border border-border bg-white rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>

    <!-- Quotation Picker Modal -->
    <Modal
      v-model="showQuotationPicker"
      title="Import dari Quotation"
      description="Pilih quotation yang memiliki vendor cost untuk diimpor sebagai vendor invoice."
      width="max-w-4xl"
    >
      <div class="space-y-3 pt-1">
        <UiLoadingSkeleton v-if="isLoadingQuotations" variant="cards" :cards="3" />
        <div v-else-if="quotationsList.length === 0" class="py-8 text-center">
          <FileText class="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p class="text-sm font-semibold text-muted-foreground">
            Tidak ada quotation dengan vendor cost
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Tambahkan vendor cost di tab Costing quotation terlebih dahulu.
          </p>
        </div>
        <div v-else class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          <div v-for="q in quotationsList" :key="q.id">
            <button
              @click="openReviewModal(q)"
              class="w-full text-left p-4 rounded-xl border border-border hover:border-[#062c58]/40 hover:bg-blue-50/30 transition-all group cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg shrink-0 bg-blue-50 text-[#062c58]">
                    <FileText class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-[#062c58]">{{ q.number }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      {{ q.customerName }} · {{ q.date }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <p
                      v-for="(amount, curr) in getQuotationCostTotals(q)"
                      :key="curr"
                      class="text-xs font-bold text-foreground"
                    >
                      {{ curr }}
                      {{
                        new Intl.NumberFormat("id-ID", {
                          minimumFractionDigits: 0,
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
                    >
                      {{ q.status }}
                    </span>
                  </div>
                  <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-[#062c58]" />
                </div>
              </div>
              <div v-if="q.costs?.length" class="mt-2 pl-11">
                <p class="text-[10px] text-muted-foreground">
                  {{ q.costs.length }} vendor cost{{ q.costs.length > 1 ? "s" : "" }}:
                  {{
                    (q.costs || [])
                      .slice(0, 2)
                      .map((c) => c.vendorName || "No Vendor")
                      .join(", ")
                  }}
                  <template v-if="(q.costs || []).length > 2">
                    +{{ (q.costs || []).length - 2 }} more
                  </template>
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
