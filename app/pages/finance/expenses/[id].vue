<script setup lang="ts">
import {
  ArrowLeft,
  Wallet,
  Pencil,
  Trash2,
  Download,
  Calendar,
  Building2,
  Tag,
  Briefcase,
  FileText,
  AlertCircle,
  Coins,
  History,
  Loader2,
} from "lucide-vue-next";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { useExpensePage } from "~/composables/useExpensePage";
import { ExpenseEditModal } from "./components";
import { generateExpensePdf } from "./utils/pdf-generator";
import { useConfirm } from "~/composables/useConfirm";
import { cn } from "~/lib/utils";
import { toast } from "vue-sonner";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const expenseId = route.params.id as string;
const { fetchExpenseById, deleteExpense } = useFinanceExpense();
const { confirm } = useConfirm();

// SSR-first: fetch expense detail
const {
  data: expenseData,
  pending: loading,
  error,
  refresh,
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

// Wrapped handleUpdate to refresh data on success
const handleFormSubmit = async () => {
  await handleUpdate();
  await refresh();
};

async function handleDelete() {
  const confirmed = await confirm({
    title: "Hapus Biaya",
    message: `Apakah Anda yakin ingin menghapus biaya ${expense.value?.number || ""}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Hapus",
    cancelText: "Batal",
    type: "danger",
  });

  if (confirmed) {
    try {
      await deleteExpense(expenseId);
      toast.success("Biaya berhasil dihapus");
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

const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function handleDownloadPdf() {
  if (!expense.value) return;
  generateExpensePdf(expense.value.id, fetchExpenseById);
}

// Payment computations
const totalAmount = computed(() => Number(expense.value?.amount || 0));
const balanceDue = computed(() => Number(expense.value?.balanceDue || 0));
const totalPaid = computed(() => Math.max(0, totalAmount.value - balanceDue.value));
const payProgress = computed(() => {
  if (totalAmount.value <= 0) return 0;
  return Math.min(100, Math.round((totalPaid.value / totalAmount.value) * 100));
});

// Status Badge resolution
const statusInfo = computed(() => {
  const due = balanceDue.value;
  const total = totalAmount.value;
  if (due === 0) {
    return { name: "Terbayar", class: "bg-green-100 text-green-700 border-green-200" };
  } else if (due > 0 && due < total) {
    return { name: "Dibayar Sebagian", class: "bg-amber-100 text-amber-700 border-amber-200" };
  } else {
    return { name: "Belum Dibayar", class: "bg-red-100 text-red-700 border-red-200" };
  }
});

onMounted(() => {
  initialize();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Loading State -->
    <div v-if="isLoading && !expense" class="flex items-center justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-rose-50 border border-rose-100 text-rose-800 p-6 rounded-2xl shadow-sm flex items-center gap-4"
    >
      <AlertCircle class="w-8 h-8 text-rose-500 animate-bounce" />
      <div>
        <h3 class="font-bold text-lg">Gagal Memuat Data</h3>
        <p class="text-sm text-rose-700">Terjadi kesalahan saat memuat detail biaya operasional.</p>
      </div>
    </div>

    <template v-else-if="expense">
      <!-- Page Header (styled exactly like master/services/[id].vue) -->
      <div class="page-header">
        <div class="flex items-center gap-4">
          <NuxtLink to="/finance/expenses" class="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div>
            <h1 class="page-title">{{ expense.number }}</h1>
            <p class="text-muted-foreground mt-1">Detail biaya operasional</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Status Badge -->
          <div
            :class="
              cn(
                'px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider',
                statusInfo.class,
              )
            "
          >
            {{ statusInfo.name }}
          </div>

          <!-- PDF Export -->
          <button @click="handleDownloadPdf" class="btn-secondary">
            <Download class="w-4 h-4 mr-2" />
            Export PDF
          </button>

          <!-- Edit Button -->
          <button @click="openEditModal(expense.id)" class="btn-secondary">
            <Pencil class="w-4 h-4 mr-2" />
            Edit
          </button>

          <!-- Delete Button -->
          <button
            @click="handleDelete"
            class="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Hapus
          </button>
        </div>
      </div>

      <!-- Main Layout Grid (styled exactly like master/services/[id].vue 4-columns layout) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Content (lg:col-span-3) -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Expense Information Card (styled like Service Information) -->
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 border-b border-border bg-slate-50 flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="font-bold text-foreground">Expense Information</h2>
                <p class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  General details & classification
                </p>
              </div>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Description</p>
                  <p class="font-bold text-slate-900">{{ expense.description }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Category</p>
                  <p class="font-bold text-slate-900 capitalize">
                    {{ expense.expenseCategory?.name || expense.category?.name || "-" }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Date</p>
                  <p class="font-bold text-slate-900">{{ formatDate(expense.date) }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Vendor</p>
                  <p class="font-bold text-slate-900">{{ expense.vendor?.name || "-" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Job Number</p>
                  <p v-if="expense.job" class="font-bold text-primary">
                    {{ expense.job.jobNumber }}
                  </p>
                  <p v-else class="font-bold text-slate-400">N/A</p>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground font-medium">Currency & Rate</p>
                  <p class="font-bold text-slate-900">
                    {{ expense.currency || "IDR" }} ({{
                      formatCurrency(Number(expense.exchangeRate || 1))
                    }})
                  </p>
                </div>
              </div>

              <!-- Notes -->
              <div class="mt-8 pt-6 border-t border-border space-y-2">
                <p class="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  Keterangan / Notes
                </p>
                <p
                  class="text-slate-700 italic bg-slate-50/50 p-4 rounded-xl border border-border/50 text-sm"
                >
                  {{ expense.notes || "Tidak ada keterangan tambahan." }}
                </p>
              </div>
            </div>
          </div>

          <!-- Items Breakdown Card -->
          <div
            v-if="expense.items && expense.items.length > 0"
            class="border border-border rounded-xl bg-white overflow-hidden"
          >
            <div class="p-4 border-b border-border bg-slate-50 flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="font-bold text-foreground">Items Breakdown</h2>
                <p class="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Itemized operational costs
                </p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border bg-slate-50/30 text-left">
                    <th
                      class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Item Deskripsi
                    </th>
                    <th
                      class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
                    >
                      Jumlah
                    </th>
                    <th
                      class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"
                    >
                      Harga Satuan
                    </th>
                    <th
                      class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border text-sm">
                  <tr
                    v-for="item in expense.items"
                    :key="item.id"
                    class="hover:bg-slate-50/30 transition-colors"
                  >
                    <td class="py-3.5 px-4 font-medium text-gray-900">{{ item.description }}</td>
                    <td class="py-3.5 px-4 text-gray-600 text-center">{{ item.quantity }}</td>
                    <td class="py-3.5 px-4 text-gray-600 text-right">
                      {{ formatCurrency(Number(item.unitPrice)) }}
                    </td>
                    <td class="py-3.5 px-4 font-bold text-gray-900 text-right">
                      {{ formatCurrency(Number(item.amount)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar / Right Column (styled like metadata sidebar on services/[id].vue) -->
        <div class="space-y-6">
          <!-- Financial Summary Card -->
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 bg-slate-50 border-b border-border">
              <h3 class="font-bold text-xs uppercase tracking-widest text-slate-500">
                Financial Summary
              </h3>
            </div>

            <div class="p-5 space-y-6 text-sm">
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase text-muted-foreground">Total Amount</p>
                <p class="text-xl font-bold text-slate-900">{{ formatCurrency(totalAmount) }}</p>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Progres Pelunasan</span>
                  <span>{{ payProgress }}%</span>
                </div>
                <div
                  class="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-border"
                >
                  <div
                    class="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    :style="{ width: `${payProgress}%` }"
                  ></div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div class="space-y-1">
                  <p class="text-[10px] font-bold uppercase text-muted-foreground">Terbayar</p>
                  <p class="text-sm font-semibold text-emerald-600">
                    {{ formatCurrency(totalPaid) }}
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-bold uppercase text-muted-foreground">Outstanding</p>
                  <p class="text-sm font-semibold text-rose-600">
                    {{ formatCurrency(balanceDue) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Allocations -->
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 bg-slate-50 border-b border-border">
              <h3 class="font-bold text-xs uppercase tracking-widest text-slate-500">
                Payment Allocations
              </h3>
            </div>

            <div class="p-5">
              <div
                v-if="expense.paymentAllocations && expense.paymentAllocations.length > 0"
                class="relative pl-4 border-l border-border space-y-6"
              >
                <div
                  v-for="alloc in expense.paymentAllocations"
                  :key="alloc.id"
                  class="relative group"
                >
                  <!-- Timeline dot -->
                  <div
                    class="absolute -left-[23px] top-1 w-3 h-3 rounded-full border border-emerald-500 bg-white"
                  ></div>

                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between items-start gap-4">
                      <span class="font-bold text-[#012D5A] hover:underline cursor-pointer">
                        {{ alloc.payment.paymentNumber || "Receipt" }}
                      </span>
                      <span class="font-semibold text-emerald-600">
                        {{ formatCurrency(Number(alloc.amount)) }}
                      </span>
                    </div>

                    <div class="text-[10px] text-muted-foreground space-y-0.5">
                      <p>{{ formatDate(alloc.payment.paymentDate) }}</p>
                      <p
                        v-if="alloc.payment.paymentMethod"
                        class="inline-block px-1 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium"
                      >
                        {{ alloc.payment.paymentMethod.name }}
                      </p>
                      <p v-if="alloc.payment.reference" class="italic">
                        Ref: {{ alloc.payment.reference }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-6 text-xs text-muted-foreground">
                Belum ada alokasi pembayaran.
              </div>
            </div>
          </div>

          <!-- Metadata Sidebar (styled exactly like master/services/[id].vue metadata) -->
          <div class="border border-border rounded-xl bg-white overflow-hidden">
            <div class="p-4 bg-slate-50 border-b border-border">
              <h3 class="font-bold text-xs uppercase tracking-widest text-slate-500">Metadata</h3>
            </div>

            <div class="p-5 space-y-4 text-xs">
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase text-muted-foreground">Registered At</p>
                <p class="font-semibold text-slate-700">{{ formatDate(expense.createdAt) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase text-muted-foreground">Last Updated</p>
                <p class="font-semibold text-slate-700">{{ formatDate(expense.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white border border-border rounded-xl"
    >
      <Wallet class="w-12 h-12 mb-4 opacity-20" />
      <p>Biaya tidak ditemukan</p>
      <NuxtLink to="/finance/expenses" class="mt-4 text-primary hover:underline">
        Back to Expenses
      </NuxtLink>
    </div>
  </div>

  <!-- Edit Modal -->
  <client-only>
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
      @submit="handleFormSubmit"
    />

    <CompanyCreateModal
      v-model="isVendorCreateModalOpen"
      :preset-name="presetVendorName"
      preset-role="vendor"
      @success="handleVendorCreateSuccess"
    />
  </client-only>
</template>
