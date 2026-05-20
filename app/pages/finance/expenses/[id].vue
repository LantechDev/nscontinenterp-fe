<script setup lang="ts">
import { ArrowLeft, Wallet, Edit, Trash2, Download } from "lucide-vue-next";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { useExpensePage } from "~/composables/useExpensePage";
import { ExpenseEditModal } from "./components";
import { generateExpensePdf } from "./utils/pdf-generator";
import { toast } from "vue-sonner";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const expenseId = route.params.id as string;
const { fetchExpenseById, deleteExpense } = useFinanceExpense();

// SSR-first: fetch expense detail
const {
  data: expenseData,
  pending: loading,
  error,
} = await useAsyncData<Expense>(
  `expense-${expenseId}`,
  async () => await fetchExpenseById(expenseId),
  { server: false },
);

const expense = computed(() => expenseData.value);
const isLoading = computed(() => loading.value);

// Use expense page composable for modal
const {
  isEditModalOpen,
  isVendorCreateModalOpen,
  isSubmitting,
  editError,
  editingExpenseId,
  presetVendorName,
  formData,
  categoryOptions,
  companies,
  jobs,
  taxOptions,
  openEditModal,
  closeEditModal,
  handleCreateVendor,
  handleVendorCreateSuccess,
  handleCreateCategory,
  handleUpdate,
  initialize,
} = useExpensePage();

async function handleDelete() {
  if (confirm("Apakah Anda yakin ingin menghapus biaya ini?")) {
    try {
      await deleteExpense(expenseId);
      navigateTo("/finance/expenses");
    } catch (err) {
      toast.error("Gagal menghapus biaya: " + (err as Error).message);
    }
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function handleDownloadPdf() {
  if (!expense.value) return;
  generateExpensePdf(expense.value.id, fetchExpenseById);
}

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <div v-if="isLoading && !expense" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else-if="expense">
      <div class="page-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/finance/expenses"
              class="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold">{{ expense.number }}</h1>
              <p class="text-muted-foreground mt-1">Detail biaya operasional</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleDownloadPdf"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Download class="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              @click="handleDelete"
              class="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 class="w-5 h-5" />
            </button>
            <button
              @click="openEditModal(expense.id)"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Edit class="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-xl border border-border shadow-sm">
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-border">
          <div class="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Wallet class="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ expense.number }}</h2>
            <p class="text-muted-foreground font-medium">
              {{ expense.vendor?.name || "Manual Entry" }}
            </p>
          </div>
          <div class="ml-auto text-right">
            <p class="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p class="text-3xl font-black text-destructive">
              {{ formatCurrency(Number(expense.amount)) }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="space-y-1.5 md:col-span-2 lg:col-span-3">
            <p class="text-sm text-muted-foreground">Deskripsi</p>
            <p class="text-lg font-medium">{{ expense.description }}</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">No. Job</p>
            <p v-if="expense.job" class="font-bold text-primary">{{ expense.job.jobNumber }}</p>
            <p v-else class="text-muted-foreground">N/A</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Tanggal</p>
            <p class="font-bold">{{ formatDate(expense.date) }}</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-sm text-muted-foreground">Kategori</p>
            <div>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border"
              >
                {{ expense.expenseCategory?.name || expense.category?.name || "Uncategorized" }}
              </span>
            </div>
          </div>
          <div class="space-y-1.5 md:col-span-2 lg:col-span-3 pt-4 border-t">
            <p class="text-sm text-muted-foreground">Keterangan Tambahan</p>
            <p class="text-sm text-foreground italic">{{ expense.notes || "-" }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Edit Modal -->
  <ExpenseEditModal
    :is-open="isEditModalOpen"
    :is-submitting="isSubmitting"
    :edit-error="editError"
    :editing-expense-id="editingExpenseId"
    :form-data="formData"
    :category-options="categoryOptions"
    :companies="companies"
    :jobs="jobs"
    :tax-options="taxOptions"
    :hide-job="true"
    @close="closeEditModal"
    @create-vendor="handleCreateVendor"
    @create-category="handleCreateCategory"
    @submit="handleUpdate"
  />

  <CompanyCreateModal
    v-model="isVendorCreateModalOpen"
    :preset-name="presetVendorName"
    preset-role="vendor"
    @success="handleVendorCreateSuccess"
  />
</template>
