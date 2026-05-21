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
} from "lucide-vue-next";
import JobVendorInvoiceForm from "./JobVendorInvoiceForm.vue";
import JobVendorInvoicePreview from "./JobVendorInvoicePreview.vue";
import JobPaymentTab from "./JobPaymentTab.vue";
import PaymentEntryForm from "~/components/finance/PaymentEntryForm.vue";
import Modal from "~/components/ui/Modal.vue";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  initialInvoiceId?: string;
  isCompleted?: boolean;
}>();

const emit = defineEmits<{
  (e: "refresh-job"): void;
}>();

const { fetchExpenses, voidExpense, isLoading: isGlobalLoading } = useFinanceExpense();

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

watch(
  () => props.jobId,
  async (newJobId) => {
    if (newJobId) {
      await loadExpenses();
    }
  },
);

const openCreateForm = () => {
  editingExpense.value = null;
  showForm.value = true;
};

const openEditForm = () => {
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
  loadExpenses();
  emit("refresh-job");
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
        :job-id="jobId"
        :expense="editingExpense"
        @success="handleSuccess"
        @cancel="showForm = false"
      />
    </Modal>

    <!-- Detail View -->
    <div v-if="showDetail && activeExpense" class="animate-fade-in flex flex-col gap-6">
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
              Vendor Invoice {{ activeExpense.number }}
            </h2>
            <p class="text-sm text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">
              {{ activeExpense.vendor?.name }} • {{ formatDate(activeExpense.date) }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span
            :class="[
              'px-3 py-1.5 rounded-md text-[10px] font-bold border uppercase tracking-widest shadow-sm shadow-black/5',
              getStatusColor(activeExpenseStatusCode),
            ]"
          >
            {{ getExpenseStatusName(activeExpense) }}
          </span>

          <div class="h-8 w-px bg-border/40 mx-1"></div>

          <div class="flex items-center gap-3">
            <!-- Record Payment (Primary Action) -->
            <button
              v-if="!['PAID', 'VOIDED', 'VOID'].includes(activeExpenseStatusCode) && !isCompleted"
              @click="showPaymentForm = true"
              class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-emerald-200/50 text-[11px] font-black uppercase tracking-wider gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Wallet class="w-4 h-4" />
              Record Payment
            </button>

            <!-- Download PDF (Secondary Action) -->
            <button
              @click="handlePrint"
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
                </div>

                <button
                  v-if="!isCompleted"
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
                  v-if="!['VOIDED', 'VOID'].includes(activeExpenseStatusCode) && !isCompleted"
                  @click="
                    showVoidConfirm = true;
                    showMoreActions = false;
                  "
                  class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
                >
                  <Ban class="w-4 h-4" />
                  Void Vendor Invoice
                </button>
              </div>
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
        <button
          v-if="!isCompleted"
          @click="openCreateForm"
          class="inline-flex items-center px-3 py-1.5 bg-[#012D5A] text-white text-xs font-semibold rounded-md hover:bg-[#012D5A]/90 transition-colors gap-1.5 shadow-sm uppercase tracking-wider"
        >
          <Plus class="w-3.5 h-3.5" />
          Record Invoice
        </button>
      </div>

      <div
        v-if="isLoading && expenses.length === 0"
        class="py-12 flex flex-col items-center justify-center space-y-3"
      >
        <Loader2 class="w-8 h-8 animate-spin text-[#012D5A] opacity-60" />
        <p class="text-sm text-muted-foreground">Loading vendor invoices...</p>
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
              <p class="font-black text-sm text-red-600 whitespace-nowrap">
                {{ formatCurrency(Number(expense.amount), expense.currency) }}
              </p>
              <p
                v-if="expense.currency && expense.currency !== 'IDR'"
                class="text-[10px] text-muted-foreground font-semibold mt-0.5"
              >
                ≈ {{ formatCurrency(Number(expense.amount) * Number(expense.exchangeRate || 1)) }}
              </p>
            </div>
          </div>

          <div class="border-t border-border pt-3 flex items-center justify-between">
            <p
              class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-1 flex-1 pr-4"
            >
              {{ expense.description }}
            </p>
            <div
              class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-500 uppercase border border-gray-200"
            >
              {{ expense.category?.name || "General" }}
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
  </div>
</template>
