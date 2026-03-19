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
import {
  useFinanceExpense,
  type Expense,
  type ExpenseFilters,
  type Pagination,
} from "~/composables/useFinanceExpense";
import { useConfirm } from "~/composables/useConfirm";
import { useCompanies } from "~/composables/useCompanies";
import { useJobs } from "~/composables/useJobs";
import { jsPDF } from "jspdf";

definePageMeta({
  layout: "dashboard",
});

const {
  fetchExpenses,
  fetchExpenseById,
  deleteExpense,
  updateExpense,
  isLoading: isExpenseLoading,
} = useFinanceExpense();
const { confirm } = useConfirm();
const { companies, fetchCompanies } = useCompanies();
const { jobs, fetchJobs } = useJobs();

// Filters & Pagination
const filters = ref<ExpenseFilters>({
  search: "",
  categoryId: "",
  page: 1,
  limit: 10,
});

const expenses = ref<Expense[]>([]);
const pagination = ref<Pagination>({
  total: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
});

const viewMode = ref<"list" | "grid">("list");

// Load data
async function loadExpenses() {
  try {
    const result = await fetchExpenses(filters.value);
    expenses.value = result.items;
    pagination.value = result.pagination;
  } catch (error) {
    console.error("Failed to load expenses:", error);
  }
}

// Watch for filter changes
watch(
  () => [filters.value.search, filters.value.categoryId, filters.value.page],
  () => {
    loadExpenses();
  },
  { deep: true },
);

// Debounced search
const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.search = val;
    filters.value.page = 1;
  }, 500);
});

const handlePageChange = (page: number) => {
  filters.value.page = page;
};

onMounted(() => {
  loadExpenses();
});

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Handle edit - open inline edit modal
const handleEdit = (id: string) => {
  openEditModal(id);
};

// Handle delete with confirmation dialog
const handleDelete = async (id: string) => {
  const expense = expenses.value.find((e) => e.id === id);
  const expenseNumber = expense?.number || id;

  const confirmed = await confirm({
    title: "Hapus Biaya",
    message: `Apakah Anda yakin ingin menghapus biaya ${expenseNumber}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Hapus",
    cancelText: "Batal",
    type: "danger",
  });

  if (confirmed) {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      alert("Gagal menghapus biaya. Silakan coba lagi.");
    }
  }
};

// Handle download PDF
const handleDownloadPdf = async (id: string) => {
  try {
    const expenseData = await fetchExpenseById(id);
    if (!expenseData) {
      throw new Error("Failed to fetch expense data");
    }

    const e = expenseData as Expense & { notes?: string };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Colors
    const redColor: [number, number, number] = [220, 38, 38]; // #dc2626
    const textColor: [number, number, number] = [31, 41, 55]; // #1f2937
    const grayColor: [number, number, number] = [107, 114, 128]; // #6b7280

    // Header
    doc.setFillColor(...redColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("EXPENSE RECORD", margin, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(e.number || "-", pageWidth - margin, 20, { align: "right" });
    doc.text(formatDate(e.date), pageWidth - margin, 30, { align: "right" });

    let yPos = 55;

    // Amount Box
    doc.setFillColor(254, 242, 242); // #fef2f2
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 40, 3, 3, "F");
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", pageWidth / 2, yPos + 15, { align: "center" });
    doc.setTextColor(...redColor);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(Number(e.amount) || 0), pageWidth / 2, yPos + 32, { align: "center" });

    yPos += 55;

    // Details
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Description:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.description || "-", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Vendor:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.vendor?.name || "N/A", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Category:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.category?.name || "Uncategorized", margin + 35, yPos);

    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Job Number:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(e.job?.jobNumber || "N/A", margin + 35, yPos);

    // Notes
    if (expenseData.notes) {
      yPos += 20;
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 3, 3, "F");
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text("Additional Notes:", margin + 5, yPos);
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      const noteLines = doc.splitTextToSize(expenseData.notes, pageWidth - margin * 2 - 10);
      doc.text(noteLines, margin + 5, yPos);
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFillColor(...redColor);
    doc.rect(0, footerY - 5, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("PT. Nusantara Continent - Expense Record", pageWidth / 2, footerY + 5, {
      align: "center",
    });

    // Generate filename
    const filename = `Expense_${e.number?.replace(/\//g, "-") || "Record"}.pdf`;

    // Download the PDF directly
    doc.save(filename);
  } catch (error) {
    console.error("Failed to download expense PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Edit modal state
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const editError = ref<string | null>(null);
const editingExpenseId = ref<string>("");

// Form state for expense edit
const formData = ref({
  number: "",
  description: "",
  amount: 0,
  date: "",
  categoryId: "",
  vendorId: "",
  jobId: "",
  notes: "",
});

// Format date for input
const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};

// Load dropdown data for edit modal
const loadDropdownData = async () => {
  await Promise.all([fetchCompanies({ type: "VENDOR" }), fetchJobs()]);
};

// Open edit modal with form
const openEditModal = async (id: string) => {
  try {
    editingExpenseId.value = id;

    const expenseData = await fetchExpenseById(id);
    if (!expenseData) {
      throw new Error("Failed to load expense data");
    }

    const exp = expenseData as Expense & { notes?: string };

    await loadDropdownData();

    formData.value = {
      number: exp.number || "",
      description: exp.description || "",
      amount: Number(exp.amount) || 0,
      date: formatDateForInput(exp.date),
      categoryId: exp.categoryId || "",
      vendorId: exp.vendor?.id || exp.vendorId || "",
      jobId: exp.job?.id || exp.jobId || "",
      notes: exp.notes || "",
    };

    isEditModalOpen.value = true;
    editError.value = null;
  } catch (e) {
    console.error("Failed to open edit modal:", e);
    editError.value = "Failed to load expense data";
  }
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editError.value = null;
  editingExpenseId.value = "";
};

// Submit expense update
const handleUpdate = async () => {
  if (!editingExpenseId.value) return;

  try {
    isSubmitting.value = true;
    editError.value = null;

    const result = await updateExpense(editingExpenseId.value, {
      number: formData.value.number,
      description: formData.value.description,
      amount: formData.value.amount,
      date: formData.value.date,
      categoryId: formData.value.categoryId || undefined,
      vendorId: formData.value.vendorId || undefined,
      jobId: formData.value.jobId || undefined,
      notes: formData.value.notes,
    });

    if (result) {
      closeEditModal();
      await loadExpenses();
    } else {
      throw new Error("Failed to update expense");
    }
  } catch (e) {
    console.error("Failed to update expense:", e);
    editError.value = "Failed to update expense";
  } finally {
    isSubmitting.value = false;
  }
};

const isLoading = computed(() => isExpenseLoading.value);
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Biaya Operasional</h1>
        <p class="text-muted-foreground mt-1">Catat pengeluaran operasional</p>
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

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari biaya..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filters.categoryId"
          class="px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Semua Kategori</option>
          <!-- Categories should ideally be fetched from Master Data -->
          <option value="trucking">Trucking</option>
          <option value="port">Port</option>
          <option value="customs">Customs</option>
        </select>
        <NuxtLink
          to="/finance/expenses/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Biaya</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
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
                <th class="py-3 px-4 text-sm font-medium text-foreground">No. Biaya</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Deskripsi</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Vendor</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Tanggal</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Jumlah</th>
                <th class="py-3 px-4 text-sm font-medium text-foreground">Kategori</th>
                <th class="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="expense in expenses"
                :key="expense.id"
                class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                @click="navigateTo(`/finance/expenses/${expense.id}`)"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-red-50 text-destructive">
                      <Wallet class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ expense.number }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm">{{ expense.description }}</td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ expense.vendor?.name || "N/A" }}
                </td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ new Date(expense.date).toLocaleDateString("id-ID") }}
                </td>
                <td class="py-3 px-4 text-sm font-medium text-destructive">
                  {{ formatCurrency(Number(expense.amount)) }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground border"
                  >
                    {{ expense.category?.name || "Uncategorized" }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex gap-1 justify-end">
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleEdit(expense.id)"
                    >
                      <Pencil class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleDelete(expense.id)"
                    >
                      <Trash2 class="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      class="p-1.5 rounded hover:bg-muted transition-colors"
                      @click.stop="handleDownloadPdf(expense.id)"
                    >
                      <Download class="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
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
          @click="navigateTo(`/finance/expenses/${expense.id}`)"
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
                  {{ new Date(expense.date).toLocaleDateString("id-ID") }}
                </p>
              </div>
            </div>
            <button
              class="text-muted-foreground hover:text-foreground"
              @click.stop
              @click="handleEdit(expense.id)"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button
              class="text-muted-foreground hover:text-foreground"
              @click.stop
              @click="handleDelete(expense.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
            <button
              class="text-muted-foreground hover:text-foreground"
              @click.stop
              @click="handleDownloadPdf(expense.id)"
            >
              <Download class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-3 mb-4">
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
                {{ formatCurrency(Number(expense.amount)) }}
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
  <Teleport to="body">
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="closeEditModal"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 class="text-xl font-bold">Edit Biaya</h2>
          <button @click="closeEditModal" class="p-1 hover:bg-muted rounded-lg transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleUpdate" class="p-6 space-y-4">
          <div v-if="editError" class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {{ editError }}
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Nomor Biaya</label>
            <input
              v-model="formData.number"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              v-model="formData.description"
              rows="2"
              required
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Jumlah</label>
              <input
                v-model.number="formData.amount"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tanggal</label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Vendor</label>
              <select
                v-model="formData.vendorId"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Vendor</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Job</label>
              <select
                v-model="formData.jobId"
                class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Job</option>
                <option v-for="job in jobs" :key="job.id" :value="job.id">
                  {{ job.jobNumber }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori</label>
            <select
              v-model="formData.categoryId"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Pilih Kategori</option>
              <option value="trucking">Trucking</option>
              <option value="port">Port</option>
              <option value="customs">Customs</option>
              <option value="handling">Handling</option>
              <option value="storage">Storage</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              v-model="formData.notes"
              rows="2"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
