<script setup lang="ts">
import {
  Plus,
  Receipt,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-vue-next";
import JobVendorInvoiceForm from "./JobVendorInvoiceForm.vue";
import Modal from "~/components/ui/Modal.vue";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { toast } from "vue-sonner";

const props = defineProps<{
  jobId: string;
  jobNumber: string;
  isCompleted?: boolean;
}>();

const { fetchExpenses, deleteExpense, isLoading: isGlobalLoading } = useFinanceExpense();

const expenses = ref<Expense[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const editingExpense = ref<Expense | null>(null);
const showDeleteConfirm = ref(false);
const expenseToDelete = ref<string | null>(null);

const loadExpenses = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await fetchExpenses({ jobId: props.jobId, limit: 100 });
    expenses.value = result.items || [];
  } catch (err: unknown) {
    error.value = (err as Error).message || "Failed to load vendor invoices";
  } finally {
    isLoading.value = false;
  }
};

const openCreateForm = () => {
  editingExpense.value = null;
  showForm.value = true;
};

const openEditForm = (expense: Expense) => {
  editingExpense.value = expense;
  showForm.value = true;
};

const confirmDelete = (id: string) => {
  expenseToDelete.value = id;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (!expenseToDelete.value) return;
  try {
    await deleteExpense(expenseToDelete.value);
    toast.success("Vendor invoice deleted");
    showDeleteConfirm.value = false;
    await loadExpenses();
  } catch (err: unknown) {
    toast.error("Failed to delete: " + (err as Error).message);
  }
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

onMounted(loadExpenses);

const handleSuccess = () => {
  showForm.value = false;
  loadExpenses();
};
</script>

<template>
  <div class="space-y-6">
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

    <!-- Loading State -->
    <div
      v-if="isLoading && expenses.length === 0"
      class="py-12 flex flex-col items-center justify-center space-y-3"
    >
      <Loader2 class="w-8 h-8 animate-spin text-[#012D5A] opacity-60" />
      <p class="text-sm text-muted-foreground">Loading vendor invoices...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 text-center bg-red-50 rounded-xl border border-red-100">
      <AlertCircle class="w-8 h-8 text-red-400 mx-auto mb-3" />
      <p class="text-sm font-medium text-red-800">{{ error }}</p>
      <button @click="loadExpenses" class="mt-4 text-xs font-bold text-red-700 hover:underline">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
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

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="expense in expenses"
        :key="expense.id"
        @click="openEditForm(expense)"
        class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
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
                  class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-500 border border-gray-200 uppercase"
                >
                  {{ expense.category?.name || "General" }}
                </span>
              </div>
              <p class="text-xs font-medium text-foreground mt-1">{{ expense.description }}</p>
              <div class="flex items-center gap-3 mt-2">
                <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {{ formatDate(expense.date) }}
                </p>
                <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <p class="text-[10px] text-muted-foreground font-bold">
                  Vendor:
                  <span class="text-foreground">{{
                    expense.vendor?.name || "Unknown Vendor"
                  }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-3">
            <div class="text-right">
              <p
                class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
              >
                Amount
              </p>
              <p class="font-black text-sm text-red-600 whitespace-nowrap">
                {{ formatCurrency(Number(expense.amount), expense.currency) }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                v-if="!isCompleted"
                @click="openEditForm(expense)"
                class="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                title="Edit"
              >
                <Pencil class="w-3.5 h-3.5" />
              </button>
              <button
                v-if="!isCompleted"
                @click.stop="confirmDelete(expense.id)"
                class="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                title="Delete"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal
      v-model="showForm"
      :title="editingExpense ? 'Edit Vendor Invoice' : 'Record Vendor Invoice'"
      :description="
        editingExpense ? 'Modify vendor invoice details.' : 'Add new incoming invoice from vendor.'
      "
      width="lg"
    >
      <JobVendorInvoiceForm
        :job-id="jobId"
        :expense="editingExpense"
        @success="handleSuccess"
        @cancel="showForm = false"
      />
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal
      v-model="showDeleteConfirm"
      title="Delete Invoice"
      description="Are you sure you want to delete this vendor invoice? This action cannot be undone."
      width="max-w-sm"
    >
      <div class="flex justify-end gap-3 pt-4">
        <button
          @click="showDeleteConfirm = false"
          class="px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-md"
        >
          Confirm Delete
        </button>
      </div>
    </Modal>
  </div>
</template>
