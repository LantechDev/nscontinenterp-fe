<script setup lang="ts">
import { ArrowLeft, Wallet, Edit, Trash2, Download } from "lucide-vue-next";
import { useFinanceExpense, type Expense } from "~/composables/useFinanceExpense";
import { useExpensePage } from "~/composables/useExpensePage";
import { ExpenseEditModal } from "./components";
import { jsPDF } from "jspdf";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const expenseId = route.params.id as string;
const { fetchExpenseById, deleteExpense, isLoading } = useFinanceExpense();

// Use expense page composable for modal
const {
  isEditModalOpen,
  isSubmitting,
  editError,
  editingExpenseId,
  formData,
  categoryOptions,
  companies,
  jobs,
  taxOptions,
  openEditModal,
  closeEditModal,
  handleUpdate,
  initialize,
} = useExpensePage();

const expense = ref<Expense | null>(null);

async function loadExpense() {
  try {
    expense.value = await fetchExpenseById(expenseId);
  } catch (error) {
    console.error("Failed to load expense:", error);
    navigateTo("/finance/expenses");
  }
}

async function handleDelete() {
  if (confirm("Apakah Anda yakin ingin menghapus biaya ini?")) {
    try {
      await deleteExpense(expenseId);
      navigateTo("/finance/expenses");
    } catch (error) {
      toast.error("Gagal menghapus biaya: " + (error as Error).message);
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
  const e = expense.value;

  try {
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
    if (e.notes) {
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
      const noteLines = doc.splitTextToSize(e.notes, pageWidth - margin * 2 - 10);
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
    toast.error("Failed to download PDF. Please try again.");
  }
}

onMounted(() => {
  loadExpense();
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
                {{ expense.category?.name || "Uncategorized" }}
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
    @close="closeEditModal"
    @submit="handleUpdate"
  />
</template>
