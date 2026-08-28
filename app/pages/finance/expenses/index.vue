<script setup lang="ts">
import {
  Plus,
  Search,
  Wallet,
  LayoutList,
  LayoutGrid,
  Pencil,
  Trash2,
  Download,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useExpensePage } from "~/composables/useExpensePage";
import { type Expense, type Pagination, getOverpayment } from "~/composables/useFinanceExpense";
import { type Company } from "~/composables/useMasterData";
import { type Tax } from "~/composables/useFinanceTax";
import { useFinanceExpense } from "~/composables/useFinanceExpense";
import type { JobWithBls } from "~/composables/useJobs";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";
import { ExpenseEditModal } from "./components";
import { generateExpensePdf } from "./utils/pdf-generator";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

interface ExpenseBootstrapData {
  expenses: {
    items: Expense[];
    pagination: Pagination;
    summary: {
      totalAmount: number;
      totalPaid: number;
      totalOutstanding: number;
      totalIncome: number;
      totalExpense: number;
      totalIncomePaid: number;
      totalIncomeOutstanding: number;
      totalExpensePaid: number;
      totalExpenseOutstanding: number;
      count: number;
    };
  };
  companies: Company[];
  jobs: JobWithBls[];
  taxes: { items: Tax[] };
}

const {
  expenses,
  filters,
  pagination,
  summary,
  viewMode,
  searchQuery,
  isEditModalOpen,
  isVendorCreateModalOpen,
  isSubmitting,
  editError,
  editingExpenseId,
  presetVendorName,
  formData,
  useManualAccount,
  categoryOptions,
  taxOptions,
  companies,
  jobs,
  formatCurrency,
  formatDate,
  isLoading,
  handlePageChange,
  handleRowClick,
  openCreateModal,
  openEditModal,
  closeEditModal,
  handleCreateVendor,
  handleVendorCreateSuccess,
  handleCreateCategory,
  handleUpdate,
  handleDelete,
  handleAccountSearch,
  setData,
} = useExpensePage();
const { canManage, requireManage } = useFeatureAccess("finance.payment");
const { canView: canViewCompanies } = useFeatureAccess("master.company");
const { canView: canViewJobs } = useFeatureAccess("operational.job");
const { canView: canViewAccounting } = useFeatureAccess("finance.accounting");

const openCreateModalIfAllowed = () => {
  if (!requireManage("You only have view access for payments and expenses.")) return;
  openCreateModal();
};

const openEditModalIfAllowed = (id: string) => {
  if (!requireManage("You only have view access for payments and expenses.")) return;
  const expense = expenses.value.find((item) => item.id === id);
  if (expense && isReadOnlyExpense(expense)) {
    toast.info("Transaksi dari invoice/payment hanya bisa dilihat dari Cash In/Out.");
    return;
  }
  if (expense?.isOrphaned) {
    toast.error("Transaksi ini terhubung ke job yang sudah dihapus. Audit dulu sebelum diedit.");
    return;
  }
  openEditModal(id);
};

const handleDeleteIfAllowed = (id: string) => {
  if (!requireManage("You only have view access for payments and expenses.")) return;
  const expense = expenses.value.find((item) => item.id === id);
  if (expense && isReadOnlyExpense(expense)) {
    toast.info("Transaksi dari invoice/payment tidak bisa dihapus dari Cash In/Out.");
    return;
  }
  handleDelete(id);
};

const handleUpdateIfAllowed = () => {
  if (!requireManage("You only have view access for payments and expenses.")) return;
  handleUpdate();
};

const handleToggleManualAccount = (checked: boolean) => {
  useManualAccount.value = checked;
  if (checked) {
    formData.value.categoryId = "";
    formData.value.expenseCategoryId = "";
    formData.value.overrideAccountId = "";
  } else {
    formData.value.overrideAccountId = "";
  }
};

const handleRowClickIfAllowed = (id: string) => {
  if (!canManage.value) return;
  const expense = expenses.value.find((item) => item.id === id);
  if (expense && isReadOnlyExpense(expense)) return;
  handleRowClick(id);
};

const isOrphanExpense = (expense: Expense) => Boolean(expense.isOrphaned);
const isReadOnlyExpense = (expense: Expense) => expense.isEditable === false;

const getOrphanLabel = (expense: Expense) => {
  if (expense.orphanReason === "DELETED_JOB") return "Job Deleted";
  if (expense.orphanReason === "MISSING_JOB") return "Job Missing";
  return "Orphan";
};

const getSourceLabel = (expense: Expense) => {
  if (expense.sourceType === "CLIENT_PAYMENT") return "Client Payment";
  if (expense.sourceType === "VENDOR_PAYMENT") return "Vendor Payment";
  if (expense.sourceType === "TAX_PAYMENT") return "Tax Payment";
  return "Manual";
};

const getCategoryName = (expense: Expense) => {
  if (isReadOnlyExpense(expense)) {
    return expense.expenseCategory?.name || expense.category?.name || getSourceLabel(expense);
  }
  return expense.expenseCategory?.name || expense.category?.name || "Uncategorized";
};

const statsCards = computed(() => {
  const creditTotal = expenses.value.reduce((sum, e) => sum + getOverpayment(e), 0);
  const netFlow = (summary.value.totalIncome || 0) - (summary.value.totalExpense || 0);
  return [
    {
      title: "Uang Masuk",
      value: formatCurrency(summary.value.totalIncome || 0),
      changeLabel: "Total kas masuk",
      isPrimary: false,
      color: "green" as const,
    },
    {
      title: "Uang Keluar",
      value: formatCurrency(summary.value.totalExpense || 0),
      changeLabel: "Total kas keluar",
      isPrimary: false,
      color: "red" as const,
    },
    {
      title: "Arus Kas Bersih",
      value: formatCurrency(netFlow),
      changeLabel: netFlow >= 0 ? "Surplus periode" : "Defisit periode",
      isPrimary: true,
      color: netFlow >= 0 ? ("green" as const) : ("red" as const),
    },
    {
      title: "Kelebihan Bayar",
      value: formatCurrency(creditTotal),
      changeLabel: "Overpayment",
      isPrimary: false,
    },
  ];
});

filters.value.type = "GENERAL";

const { fetchExpenseById } = useFinanceExpense();

// Handle download PDF
const handleDownloadPdf = async (id: string) => {
  await generateExpensePdf(id, fetchExpenseById);
};

// Client-side: fetch initial data (avoid slow cross-region SSR)
const {
  data: expensesData,
  pending: isBootstrapping,
  error: bootstrapError,
  refresh: refreshBootstrap,
} = useAsyncData<ExpenseBootstrapData>(
  "expense-list",
  async () => {
    const expensesResp = await $fetch<{
      items: Expense[];
      pagination: Pagination;
      summary: {
        totalAmount: number;
        totalPaid: number;
        totalOutstanding: number;
        totalIncome: number;
        totalExpense: number;
        totalIncomePaid: number;
        totalIncomeOutstanding: number;
        totalExpensePaid: number;
        totalExpenseOutstanding: number;
        count: number;
      };
    }>("/api/finance/expense", {
      query: { type: "GENERAL" },
    });

    if (!canManage.value) {
      return { expenses: expensesResp, companies: [], jobs: [], taxes: { items: [] } };
    }

    const [companiesResp, jobsResp, taxesResp] = await Promise.allSettled([
      canViewCompanies.value
        ? $fetch<Company[]>("/api/master/companies?type=VENDOR")
        : Promise.resolve([]),
      canViewJobs.value ? $fetch<JobWithBls[]>("/api/operational/jobs") : Promise.resolve([]),
      canViewAccounting.value
        ? $fetch<{ items: Tax[] }>("/api/finance/tax?isActive=true")
        : Promise.resolve({ items: [] }),
    ]);

    return {
      expenses: expensesResp,
      companies: companiesResp.status === "fulfilled" ? companiesResp.value : [],
      jobs: jobsResp.status === "fulfilled" ? jobsResp.value : [],
      taxes: taxesResp.status === "fulfilled" ? taxesResp.value : { items: [] },
    };
  },
  { server: false },
);

watch(
  expensesData,
  (value) => {
    if (!value) return;
    setData({
      items: value.expenses?.items || [],
      pagination: value.expenses?.pagination || {
        total: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
      },
      companies: Array.isArray(value.companies)
        ? value.companies
        : (value.companies as unknown as { data: Company[] })?.data || [],
      jobs: value.jobs,
      taxOptions: value.taxes?.items,
      summary: value.expenses?.summary || {
        totalAmount: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        totalIncome: 0,
        totalExpense: 0,
        totalIncomePaid: 0,
        totalIncomeOutstanding: 0,
        totalExpensePaid: 0,
        totalExpenseOutstanding: 0,
        count: 0,
      },
    });
  },
  { immediate: true },
);

const route = useRoute();
watch(
  () => route.fullPath,
  () => refreshBootstrap(),
);

const isPageLoading = computed(() => isLoading.value || isBootstrapping.value);
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Cash In/Out</h1>
        <p class="text-muted-foreground mt-1">Catat penerimaan dan pengeluaran kas</p>
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

    <!-- Rekap Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FinanceStatCard
        v-for="(card, index) in statsCards"
        :key="index"
        :card="card"
        :index="index"
      />
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari transaksi..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.direction"
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Tipe</option>
          <option value="IN">Uang Masuk</option>
          <option value="OUT">Uang Keluar</option>
        </select>
        <select
          v-model="filters.expenseCategoryId"
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Kategori</option>
          <option
            v-for="opt in categoryOptions.filter((o) => o.value !== '')"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <button
          v-if="canManage"
          type="button"
          @click="openCreateModalIfAllowed"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Transaksi</span>
        </button>
      </div>
    </div>

    <div
      v-if="bootstrapError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Gagal memuat data biaya. Silakan coba lagi.</span>
        <button class="btn-secondary" type="button" @click="refreshBootstrap()">Coba lagi</button>
      </div>
    </div>

    <template v-if="isPageLoading && viewMode === 'list'">
      <div class="border border-border rounded-xl bg-white overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-white text-left">
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[180px]">
                  No. Transaksi
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[150px]">Tipe</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[360px]">
                  Deskripsi
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[140px]">
                  Kategori
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor/Kontak</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Kelebihan</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <UiLoadingSkeleton variant="table-rows" :columns="9" />
          </table>
        </div>
      </div>
    </template>
    <UiLoadingSkeleton v-else-if="isPageLoading" variant="cards" />

    <template v-else>
      <!-- List View -->
      <div
        v-if="viewMode === 'list'"
        class="border border-border rounded-xl bg-white overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-white text-left">
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[180px]">
                  No. Transaksi
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[150px]">Tipe</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[360px]">
                  Deskripsi
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground min-w-[140px]">
                  Kategori
                </th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor/Kontak</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Kelebihan</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="expense in expenses"
                :key="expense.id"
                :class="
                  cn(
                    'border-b border-border last:border-0 hover:bg-muted/30 transition-colors',
                    isReadOnlyExpense(expense) ? 'cursor-default' : 'cursor-pointer',
                  )
                "
                @click="handleRowClickIfAllowed(expense.id)"
              >
                <td class="py-3 px-4 min-w-[180px]">
                  <div class="flex items-center gap-2 whitespace-nowrap">
                    <div
                      :class="
                        cn(
                          'p-1.5 rounded',
                          expense.direction === 'IN'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-destructive',
                        )
                      "
                    >
                      <Wallet class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ expense.number }}</span>
                    <span
                      v-if="isOrphanExpense(expense)"
                      class="text-[9px] font-black uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded"
                    >
                      {{ getOrphanLabel(expense) }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm min-w-[150px]">
                  <div class="flex flex-col items-start gap-1.5">
                    <span
                      v-if="isReadOnlyExpense(expense)"
                      class="inline-flex whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded"
                    >
                      {{ getSourceLabel(expense) }}
                    </span>
                    <span
                      :class="
                        cn(
                          'inline-flex whitespace-nowrap px-2 py-0.5 rounded text-xs font-semibold',
                          expense.direction === 'IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800',
                        )
                      "
                    >
                      {{ expense.direction === "IN" ? "Uang Masuk" : "Uang Keluar" }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm min-w-[360px] max-w-[560px]">
                  <span class="block break-words leading-relaxed">{{ expense.description }}</span>
                </td>
                <td class="py-3 px-4 text-sm min-w-[140px]">
                  <span
                    class="inline-flex whitespace-nowrap px-2 py-0.5 rounded bg-muted text-muted-foreground border text-xs"
                  >
                    {{ getCategoryName(expense) }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ expense.vendor?.name || "N/A" }}
                </td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ formatDate(expense.date) }}
                </td>
                <td
                  :class="
                    cn(
                      'py-3 px-4 text-sm font-medium',
                      expense.direction === 'IN' ? 'text-emerald-600' : 'text-destructive',
                    )
                  "
                >
                  {{ formatCurrency(Number(expense.amount)) }}
                </td>
                <td class="py-3 px-4 text-sm font-medium">
                  <span v-if="getOverpayment(expense) > 0" class="text-emerald-600">
                    {{ formatCurrency(getOverpayment(expense)) }}
                  </span>
                  <span v-else class="text-muted-foreground">-</span>
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      v-if="canManage && !isReadOnlyExpense(expense)"
                      :class="
                        cn(
                          'p-1.5 rounded transition-colors',
                          isOrphanExpense(expense)
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'hover:bg-muted',
                        )
                      "
                      @click.stop="openEditModalIfAllowed(expense.id)"
                      :title="
                        isOrphanExpense(expense)
                          ? 'Job sudah dihapus, audit dulu sebelum edit'
                          : 'Edit'
                      "
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      v-if="canManage && !isReadOnlyExpense(expense)"
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleDeleteIfAllowed(expense.id)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      v-if="!isReadOnlyExpense(expense)"
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleDownloadPdf(expense.id)"
                    >
                      <Download class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="expenses.length === 0">
                <td colspan="9" class="py-12 text-center text-muted-foreground">
                  Tidak ada transaksi ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          :class="
            cn(
              'border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow',
              isReadOnlyExpense(expense) ? 'cursor-default' : 'cursor-pointer',
            )
          "
          @click="handleRowClickIfAllowed(expense.id)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                :class="
                  cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
                    expense.direction === 'IN'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-destructive',
                  )
                "
              >
                <Wallet class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-base text-foreground">
                  {{ expense.number }}
                </h3>
                <span
                  v-if="isOrphanExpense(expense)"
                  class="mt-1 inline-flex text-[9px] font-black uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded"
                >
                  {{ getOrphanLabel(expense) }}
                </span>
                <span
                  v-if="isReadOnlyExpense(expense)"
                  class="mt-1 inline-flex whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded"
                >
                  {{ getSourceLabel(expense) }}
                </span>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(expense.date) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              v-if="canManage && !isReadOnlyExpense(expense)"
              :class="
                cn(
                  'p-1',
                  isOrphanExpense(expense)
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click.stop="openEditModalIfAllowed(expense.id)"
              :title="
                isOrphanExpense(expense) ? 'Job sudah dihapus, audit dulu sebelum edit' : 'Edit'
              "
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              v-if="canManage && !isReadOnlyExpense(expense)"
              class="text-muted-foreground hover:text-foreground p-1"
              @click.stop="handleDeleteIfAllowed(expense.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <button
              v-if="!isReadOnlyExpense(expense)"
              class="text-muted-foreground hover:text-foreground p-1"
              @click.stop="handleDownloadPdf(expense.id)"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3 mb-4 mt-3">
            <div>
              <p class="text-xs text-muted-foreground mb-1">Description</p>
              <p class="text-sm font-medium line-clamp-2">{{ expense.description }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Vendor/Kontak</p>
              <p class="text-sm font-medium">{{ expense.vendor?.name || "N/A" }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Amount</p>
              <p
                :class="
                  cn(
                    'text-lg font-bold',
                    expense.direction === 'IN' ? 'text-emerald-600' : 'text-destructive',
                  )
                "
              >
                {{ formatCurrency(Number(expense.amount)) }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <span
              class="inline-flex whitespace-nowrap text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
            >
              {{ getCategoryName(expense) }}
            </span>
            <span
              :class="
                cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                  expense.direction === 'IN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800',
                )
              "
            >
              {{ expense.direction === "IN" ? "Uang Masuk" : "Uang Keluar" }}
            </span>
          </div>
        </div>
        <div
          v-if="expenses.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          Tidak ada transaksi ditemukan.
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <p>{{ pagination.total }} data found.</p>
        <UiPagination
          v-if="pagination.total > 0"
          v-model:page="filters.page"
          :total="pagination.total"
          :items-per-page="pagination.limit"
          @update:page="handlePageChange"
        />
      </div>
    </template>
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
      :use-manual-account="useManualAccount"
      :handle-account-search="handleAccountSearch"
      @close="closeEditModal"
      @create-vendor="handleCreateVendor"
      @create-category="handleCreateCategory"
      @toggle-manual-account="handleToggleManualAccount"
      @submit="handleUpdateIfAllowed"
    />

    <CompanyCreateModal
      v-if="canManage"
      v-model="isVendorCreateModalOpen"
      :preset-name="presetVendorName"
      preset-role="vendor"
      @success="handleVendorCreateSuccess"
    />
  </client-only>
</template>
