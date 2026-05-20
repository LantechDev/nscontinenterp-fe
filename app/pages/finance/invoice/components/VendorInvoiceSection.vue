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
  ArrowRight,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useExpensePage } from "~/composables/useExpensePage";
import { type Expense, type Pagination } from "~/composables/useFinanceExpense";
import { type Company } from "~/composables/useMasterData";
import { type Tax } from "~/composables/useFinanceTax";
import { useFinanceExpense } from "~/composables/useFinanceExpense";
import type { JobWithBls } from "~/composables/useJobs";
import { ExpenseEditModal } from "~/pages/finance/expenses/components";
import { generateExpensePdf } from "~/pages/finance/expenses/utils/pdf-generator";
import OperationalJobDetailSlideOver from "~/components/operational/JobDetailSlideOver.vue";
import CompanyCreateModal from "~/pages/master/company/components/CompanyCreateModal.vue";

interface ExpenseBootstrapData {
  expenses: { items: Expense[]; pagination: Pagination };
  companies: Company[];
  jobs: JobWithBls[];
  taxes: { items: Tax[] };
}

const {
  expenses,
  filters,
  pagination,
  viewMode,
  searchQuery,
  isEditModalOpen,
  isVendorCreateModalOpen,
  isSubmitting,
  editError,
  editingExpenseId,
  presetVendorName,
  formData,
  categoryOptions,
  taxOptions,
  companies,
  jobs,
  formatCurrency,
  formatDate,
  isLoading,
  handlePageChange,
  handleRowClick,
  openEditModal,
  closeEditModal,
  handleCreateVendor,
  handleVendorCreateSuccess,
  handleCreateCategory,
  handleUpdate,
  handleDelete,
  setData,
} = useExpensePage();

filters.value.type = "JOB";

const { fetchExpenseById } = useFinanceExpense();

const formatExpenseAmount = (amount: number, currency?: string) => {
  const curr = currency || "IDR";
  if (curr === "IDR") {
    return formatCurrency(amount);
  }
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(amount);
  } catch {
    return `${curr} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

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
} = await useAsyncData<ExpenseBootstrapData>(
  "expense-list",
  async () => {
    const [expensesResp, companiesResp, jobsResp, taxesResp] = await Promise.all([
      $fetch<{ items: Expense[]; pagination: Pagination }>("/api/finance/expense", {
        query: { type: "JOB" },
      }),
      $fetch<Company[]>("/api/master/companies?type=VENDOR"),
      $fetch<JobWithBls[]>("/api/operational/jobs"),
      $fetch<{ items: Tax[] }>("/api/finance/tax?isActive=true"),
    ]);
    return { expenses: expensesResp, companies: companiesResp, jobs: jobsResp, taxes: taxesResp };
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
    });
  },
  { immediate: true },
);

const isPageLoading = computed(() => isLoading.value || isBootstrapping.value);

const getStatusConfig = (code?: string) => {
  switch (code?.toUpperCase()) {
    case "PAID":
      return { label: "Paid", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "PARTIALLY_PAID":
      return { label: "Partial", class: "bg-amber-50 text-amber-700 border-amber-200" };
    case "VOIDED":
      return { label: "Void", class: "bg-red-50 text-red-700 border-red-200" };
    case "UNPAID":
      return { label: "Unpaid", class: "bg-yellow-50 text-yellow-700 border-yellow-200" };
    default:
      return { label: code || "Unpaid", class: "bg-slate-50 text-slate-700 border-slate-200" };
  }
};

const groupedExpenses = computed(() => {
  const groups: Record<string, { jobKey: string; jobNumber: string; expenses: Expense[] }> = {};

  expenses.value.forEach((exp: Expense) => {
    const jobKey = exp.job?.jobNumber || "no-job";
    if (!groups[jobKey]) {
      groups[jobKey] = {
        jobKey,
        jobNumber: exp.job?.jobNumber || "Tanpa Job",
        expenses: [],
      };
    }
    groups[jobKey].expenses.push(exp);
  });

  return Object.values(groups);
});

const isJobDetailOpen = ref(false);
const selectedJobId = ref("");
const initialInvoiceId = ref("");

const handleInvoiceClick = (expense: Expense) => {
  if (expense.job?.id) {
    selectedJobId.value = expense.job.id;
    initialInvoiceId.value = expense.id;
    isJobDetailOpen.value = true;
  } else {
    handleRowClick(expense.id); // Fallback to original behavior if no job id
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Vendor Invoice..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.categoryId"
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

    <div
      v-if="bootstrapError"
      class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm animate-fade-in"
    >
      <div class="flex items-center justify-between gap-4">
        <span>Gagal memuat data biaya. Silakan coba lagi.</span>
        <button class="btn-secondary" type="button" @click="refreshBootstrap()">Coba lagi</button>
      </div>
    </div>

    <div v-if="isPageLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

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
                <th class="py-3 px-4 text-sm font-medium text-foreground">No. Invoice Vendor</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Job No.</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in groupedExpenses" :key="group.jobKey">
                <!-- Job Header Row -->
                <tr class="bg-gray-50 border-b border-border">
                  <td colspan="7" class="py-2.5 px-4">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >Job:</span
                      >
                      <span class="text-sm font-bold text-[#012D5A]">{{ group.jobNumber }}</span>
                      <span
                        class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2"
                      >
                        {{ group.expenses.length }} BILL{{ group.expenses.length > 1 ? "S" : "" }}
                      </span>
                    </div>
                  </td>
                </tr>
                <!-- Expense Rows -->
                <tr
                  v-for="expense in group.expenses"
                  :key="expense.id"
                  :class="[
                    'border-b border-border last:border-b transition-colors cursor-pointer',
                    expense.status?.code === 'VOIDED'
                      ? 'bg-gray-50/80 opacity-60 hover:opacity-80'
                      : 'hover:bg-muted/30',
                  ]"
                  @click="handleInvoiceClick(expense)"
                >
                  <td class="py-3 px-4 pl-8">
                    <div class="flex items-center gap-2">
                      <div
                        :class="[
                          'p-1.5 rounded',
                          expense.status?.code === 'VOIDED'
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-red-50 text-destructive',
                        ]"
                      >
                        <Wallet class="w-4 h-4" />
                      </div>
                      <span
                        :class="[
                          'text-sm font-medium',
                          expense.status?.code === 'VOIDED' ? 'line-through text-gray-400' : '',
                        ]"
                      >
                        {{ expense.number }}
                      </span>
                      <span
                        v-if="expense.status?.code === 'VOIDED'"
                        class="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded"
                      >
                        VOID
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm font-mono text-muted-foreground uppercase">
                    {{ expense.job?.jobNumber || "-" }}
                  </td>
                  <td class="py-3 px-4 text-sm font-medium">{{ expense.vendor?.name || "N/A" }}</td>
                  <td class="py-3 px-4 text-sm text-muted-foreground">
                    {{ formatDate(expense.date) }}
                  </td>
                  <td class="py-3 px-4 text-sm font-medium text-destructive">
                    <div>{{ formatExpenseAmount(Number(expense.amount), expense.currency) }}</div>
                    <div
                      v-if="expense.currency && expense.currency !== 'IDR'"
                      class="text-[10px] text-muted-foreground font-mono font-normal mt-0.5 whitespace-nowrap"
                    >
                      Rp
                      {{
                        (Number(expense.amount) * Number(expense.exchangeRate || 1)).toLocaleString(
                          "id-ID",
                        )
                      }}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      :class="
                        cn(
                          'px-2 py-0.5 rounded border text-xs font-medium',
                          getStatusConfig(expense.status?.code || 'UNPAID').class,
                        )
                      "
                    >
                      {{ getStatusConfig(expense.status?.code || "UNPAID").label }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex gap-1 justify-end">
                      <button
                        class="p-1.5 rounded hover:bg-muted transition-colors"
                        @click.stop="handleDownloadPdf(expense.id)"
                        title="Download PDF"
                      >
                        <Download class="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        v-if="expense.job?.id"
                        class="p-1.5 rounded hover:bg-blue-50 transition-colors"
                        @click.stop="handleInvoiceClick(expense)"
                        title="Buka Detail Job Shipment"
                      >
                        <ArrowRight class="w-4 h-4 text-[#012D5A]" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="expenses.length === 0">
                <td colspan="7" class="py-12 text-center text-muted-foreground">
                  Tidak ada biaya ditemukan.
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
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
          @click="handleRowClick(expense.id)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-red-50 text-destructive flex items-center justify-center shrink-0"
              >
                <Wallet class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-base text-foreground">
                  {{ expense.number }}
                </h3>
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(expense.date) }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button
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
              <p class="text-xs text-muted-foreground mb-1">Vendor</p>
              <p class="text-sm font-medium">{{ expense.vendor?.name || "N/A" }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Amount</p>
              <p class="text-lg font-bold text-destructive">
                {{ formatExpenseAmount(Number(expense.amount), expense.currency) }}
              </p>
              <p
                v-if="expense.currency && expense.currency !== 'IDR'"
                class="text-xs text-muted-foreground font-mono mt-0.5"
              >
                Rp
                {{
                  (Number(expense.amount) * Number(expense.exchangeRate || 1)).toLocaleString(
                    "id-ID",
                  )
                }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <span class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border">
              {{ expense.category?.name || "Uncategorized" }}
            </span>
          </div>
        </div>
        <div
          v-if="expenses.length === 0"
          class="col-span-full py-12 text-center text-muted-foreground"
        >
          Tidak ada biaya ditemukan.
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

  <!-- Job Detail Slide-over -->
  <OperationalJobDetailSlideOver
    v-model="isJobDetailOpen"
    :job-id="selectedJobId"
    initial-tab="finance"
    initial-sub-tab="ap"
    :initial-invoice-id="initialInvoiceId"
  />
</template>
