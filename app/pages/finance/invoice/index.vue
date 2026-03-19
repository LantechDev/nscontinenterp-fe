<script setup lang="ts">
import {
  Plus,
  Search,
  Receipt,
  LayoutList,
  LayoutGrid,
  FileDown,
  Save,
  Trash2,
} from "lucide-vue-next";
import { cn, toNumber, formatRupiah } from "~/lib/utils";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { useCompanies } from "~/composables/useCompanies";
import { useJobs } from "~/composables/useJobs";
import { useServices } from "~/composables/useServices";
import { useConfirm } from "~/composables/useConfirm";
import { InvoiceListView, InvoiceGridView } from "./components";
import { jsPDF } from "jspdf";

definePageMeta({
  layout: "dashboard",
});

const {
  fetchInvoices,
  fetchInvoiceById,
  deleteInvoice,
  updateInvoice,
  isLoading: isInvoiceLoading,
} = useInvoices();
const { confirm } = useConfirm();
const { companies, fetchCompanies } = useCompanies();
const { jobs, fetchJobs } = useJobs();
const { services, fetchServices } = useServices();

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: { code: string; name: string };
  company: { name: string };
}

const invoices = ref<InvoiceData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Helper functions for PDF generation
const statusLabel = (code: string) => {
  const labels: Record<string, string> = {
    PAID: "LUNAS",
    UNPAID: "BELUM LUNAS",
    PARTIALLY_PAID: "SEBAGIAN",
    OVERDUE: "JATUH TEMPO",
  };
  return labels[code] || code;
};

// Search state
const searchQuery = ref("");

const statusMap: Record<string, "pending" | "paid" | "partially" | "overdue"> = {
  UNPAID: "pending",
  PARTIALLY_PAID: "partially",
  PAID: "paid",
  OVERDUE: "overdue",
};

const statusConfig: Record<
  "pending" | "paid" | "partially" | "overdue",
  { label: string; class: string }
> = {
  pending: { label: "Belum Lunas", class: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  partially: { label: "Sebagian", class: "bg-blue-50 text-blue-700 border-blue-200" },
  paid: { label: "Lunas", class: "bg-green-50 text-green-700 border-green-200" },
  overdue: { label: "Jatuh Tempo", class: "bg-red-50 text-red-700 border-red-200" },
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

// Status filter
const selectedStatus = ref<string>("");
const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "PAID", label: "Lunas" },
  { value: "UNPAID", label: "Belum Lunas" },
  { value: "PARTIALLY_PAID", label: "Sebagian" },
  { value: "OVERDUE", label: "Jatuh Tempo" },
];

// Use formatRupiah from utils for currency formatting
const formatCurrency = formatRupiah;

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Filter invoices by status and search query
const filteredInvoices = computed(() => {
  let result = invoices.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.company.name.toLowerCase().includes(query),
    );
  }

  return result;
});

const getStatusType = (statusCode: string): "pending" | "paid" | "partially" | "overdue" => {
  return statusMap[statusCode] || "pending";
};

const getStatusConfig = (statusCode: string) => {
  const type = getStatusType(statusCode);
  return statusConfig[type];
};

const loadInvoices = async () => {
  try {
    loading.value = true;
    error.value = null;
    const result = await fetchInvoices(selectedStatus.value || undefined);
    if (result.success && result.data) {
      invoices.value = result.data;
    } else {
      throw new Error(result.error || "Failed to load invoices");
    }
  } catch (e) {
    console.error("Failed to fetch invoices:", e);
    error.value = "Failed to load invoices";
    invoices.value = [];
  } finally {
    loading.value = false;
  }
};

const handleRowClick = (id: string) => {
  navigateTo(`/finance/invoice/${id}`);
};

// Edit modal state
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const editError = ref<string | null>(null);
const editingInvoiceId = ref<string>("");

// Form state for full invoice edit
interface InvoiceItemForm {
  id?: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const formData = ref({
  invoiceNumber: "",
  issuedDate: "",
  dueDate: "",
  companyId: "",
  jobId: "",
  notes: "",
  subTotal: 0,
  taxAmount: 0,
  total: 0,
  statusId: "",
  items: [] as InvoiceItemForm[],
});

// Status options for edit modal
const editStatusOptions = [
  { id: "PAID", name: "Lunas (Paid)" },
  { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
  { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
];

// Tax options for edit modal
const editTaxOptions = [
  { value: 0, label: "Tanpa PPN" },
  { value: 1.1, label: "PPN 1.1% (Freight)" },
  { value: 11, label: "PPN 11%" },
];

const selectedTaxRate = ref(0);

// Calculate line item amount
const calculateItemAmount = (item: InvoiceItemForm) => {
  return item.quantity * item.unitPrice;
};

// Calculate subtotal
const calculateSubTotal = () => {
  return formData.value.items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
};

// Calculate tax amount
const calculateTaxAmount = () => {
  return (calculateSubTotal() * selectedTaxRate.value) / 100;
};

// Calculate total
const calculateTotal = () => {
  return calculateSubTotal() + calculateTaxAmount();
};

// Add new line item
const addLineItem = () => {
  formData.value.items.push({
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  });
};

// Remove line item
const removeLineItem = (index: number) => {
  formData.value.items.splice(index, 1);
  recalculateTotals();
};

// Recalculate totals
const recalculateTotals = () => {
  formData.value.subTotal = calculateSubTotal();
  formData.value.taxAmount = calculateTaxAmount();
  formData.value.total = calculateTotal();
};

// Update item amount when quantity or price changes
const updateItemAmount = (index: number) => {
  const item = formData.value.items[index];
  if (item) {
    item.amount = calculateItemAmount(item);
    recalculateTotals();
  }
};

// Format date for input
const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};

// Load dropdown data for edit modal
const loadDropdownData = async () => {
  await Promise.all([fetchCompanies({ type: "CUSTOMER" }), fetchJobs(), fetchServices()]);
};

// Open edit modal with full form
const openEditModal = async (id: string) => {
  try {
    // Store the invoice ID
    editingInvoiceId.value = id;

    // Fetch invoice data
    const result = await fetchInvoiceById(id);
    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to load invoice");
    }

    const inv = result.data;

    // Load dropdown data
    await loadDropdownData();

    // Initialize form with existing data
    const issuedDateVal: string = (inv.issuedDate as string) || "";
    const dueDateVal: string = (inv.dueDate as string) || "";

    formData.value = {
      invoiceNumber: inv.invoiceNumber || "",
      issuedDate: formatDateForInput(issuedDateVal),
      dueDate: formatDateForInput(dueDateVal),
      companyId: inv.company?.id || "",
      jobId: inv.job?.id || "",
      notes: inv.notes || "",
      subTotal: toNumber(inv.subTotal),
      taxAmount: toNumber(inv.taxAmount),
      total: toNumber(inv.total),
      statusId: inv.status?.code || "",
      items:
        inv.items?.map((item) => ({
          id: item.id,
          serviceId: item.service?.id,
          description: item.description,
          quantity: toNumber(item.quantity),
          unitPrice: toNumber(item.unitPrice),
          amount: toNumber(item.amount),
        })) || [],
    };

    // Calculate tax rate from existing tax amount
    if (inv.subTotal && inv.taxAmount) {
      selectedTaxRate.value = (toNumber(inv.taxAmount) / toNumber(inv.subTotal)) * 100;
    } else {
      selectedTaxRate.value = 0;
    }

    isEditModalOpen.value = true;
    editError.value = null;
  } catch (e) {
    console.error("Failed to open edit modal:", e);
    editError.value = "Failed to load invoice data";
  }
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editError.value = null;
  editingInvoiceId.value = "";
};

// Submit full invoice update
const handleFullUpdate = async () => {
  if (!formData.value.companyId || !editingInvoiceId.value) return;

  try {
    isSubmitting.value = true;
    editError.value = null;

    const invoiceId = editingInvoiceId.value;

    // Prepare items for update
    const itemsToUpdate = formData.value.items.map((item) => ({
      id: item.id,
      serviceId: item.serviceId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
    }));

    // Recalculate totals before submit
    const subTotal = calculateSubTotal();
    const taxAmount = calculateTaxAmount();
    const total = calculateTotal();

    const result = await updateInvoice(invoiceId, {
      invoiceNumber: formData.value.invoiceNumber,
      issuedDate: formData.value.issuedDate,
      dueDate: formData.value.dueDate,
      companyId: formData.value.companyId,
      jobId: formData.value.jobId || undefined,
      notes: formData.value.notes,
      subTotal,
      taxAmount,
      total,
      balanceDue: total,
      statusId: formData.value.statusId,
      items: itemsToUpdate,
    });

    if (result.success) {
      closeEditModal();
      // Reload invoices to get updated data
      await loadInvoices();
    } else {
      throw new Error(result.error || "Failed to update invoice");
    }
  } catch (e) {
    console.error("Failed to update invoice:", e);
    editError.value = "Failed to update invoice";
  } finally {
    isSubmitting.value = false;
  }
};

// Watch for tax rate changes
watch(selectedTaxRate, () => {
  recalculateTotals();
});

// Handle edit - open modal inline on same page
const handleEdit = (id: string) => {
  openEditModal(id);
};

// Handle delete with confirmation dialog
const handleDelete = async (id: string) => {
  const invoice = invoices.value.find((inv) => inv.id === id);
  const invoiceNumber = invoice?.invoiceNumber || id;

  const confirmed = await confirm({
    title: "Hapus Invoice",
    message: `Apakah Anda yakin ingin menghapus invoice ${invoiceNumber}? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Hapus",
    cancelText: "Batal",
    type: "danger",
  });

  if (confirmed) {
    try {
      const result = await deleteInvoice(id);
      if (result.success) {
        // Reload invoices after successful delete
        await loadInvoices();
      } else {
        console.error("Failed to delete invoice:", result.error);
        alert(result.error || "Failed to delete invoice");
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    }
  }
};

const isDownloading = ref(false);

const handleDownloadPdf = async (id: string) => {
  if (isDownloading.value) return;

  try {
    isDownloading.value = true;

    // Fetch invoice details
    const result = await fetchInvoiceById(id);
    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to fetch invoice");
    }

    const invoice = result.data;

    // Create PDF using jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Colors
    const primaryColor: [number, number, number] = [1, 45, 90]; // #012D5A
    const textColor: [number, number, number] = [31, 41, 55]; // #1f2937
    const grayColor: [number, number, number] = [107, 114, 128]; // #6b7280
    const lightGrayColor: [number, number, number] = [229, 231, 235]; // #e5e7eb

    // Company Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", margin, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.invoiceNumber, pageWidth - margin, 20, { align: "right" });
    doc.text(statusLabel(invoice.status?.code || ""), pageWidth - margin, 30, { align: "right" });

    yPos = 55;

    // Company Info (left) and Invoice Details (right)
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("From:", margin, yPos);
    doc.setFont("helvetica", "normal");
    doc.text("PT. Nusantara Continent", margin, yPos + 7);
    doc.setTextColor(...grayColor);
    doc.text("Jakarta, Indonesia", margin, yPos + 14);

    // Invoice details on the right
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Date:", pageWidth - margin - 50, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(invoice.issuedDate), pageWidth - margin, yPos, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text("Due Date:", pageWidth - margin - 50, yPos + 7);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(invoice.dueDate), pageWidth - margin, yPos + 7, { align: "right" });

    if (invoice.job) {
      doc.setFont("helvetica", "bold");
      doc.text("Job Reference:", pageWidth - margin - 50, yPos + 14);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.job.jobNumber, pageWidth - margin, yPos + 14, { align: "right" });
    }

    yPos += 35;

    // Bill To section
    doc.setDrawColor(...lightGrayColor);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BILL TO:", margin, yPos);
    yPos += 7;

    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(invoice.company?.name || "-", margin, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    if (invoice.company?.address) {
      doc.text(invoice.company.address, margin, yPos);
      yPos += 6;
    }
    if (invoice.company?.email) {
      doc.text(invoice.company.email, margin, yPos);
      yPos += 6;
    }
    if (invoice.company?.phone) {
      doc.text(invoice.company.phone, margin, yPos);
      yPos += 6;
    }

    yPos += 15;

    // Items Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, contentWidth, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("DESCRIPTION", margin + 5, yPos + 7);
    doc.text("QTY", margin + 95, yPos + 7, { align: "center" });
    doc.text("UNIT PRICE", margin + 125, yPos + 7, { align: "right" });
    doc.text("AMOUNT", pageWidth - margin - 5, yPos + 7, { align: "right" });

    yPos += 10;

    // Items Table Body
    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    for (const item of invoice.items) {
      // Check if we need a new page
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }

      // Draw row background
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPos, contentWidth, 12, "F");

      doc.text(item.description, margin + 5, yPos + 8);
      doc.text(String(item.quantity), margin + 95, yPos + 8, { align: "center" });
      doc.text(formatCurrency(item.unitPrice), margin + 125, yPos + 8, { align: "right" });
      doc.text(formatCurrency(item.amount), pageWidth - margin - 5, yPos + 8, { align: "right" });

      yPos += 12;
    }

    // Draw bottom border for table
    doc.setDrawColor(...lightGrayColor);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 15;

    // Totals section
    const totalsX = pageWidth - margin - 80;
    const totalsWidth = 80;

    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Subtotal
    doc.text("Subtotal:", totalsX, yPos);
    doc.text(formatCurrency(toNumber(invoice.subTotal) || 0), pageWidth - margin, yPos, {
      align: "right",
    });
    yPos += 8;

    // Tax
    doc.text("Pajak (PPN):", totalsX, yPos);
    doc.text(formatCurrency(toNumber(invoice.taxAmount) || 0), pageWidth - margin, yPos, {
      align: "right",
    });
    yPos += 12;

    // Total line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(totalsX - 5, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", totalsX, yPos);
    doc.text(formatCurrency(toNumber(invoice.total)), pageWidth - margin, yPos, { align: "right" });

    yPos += 20;

    // Notes section
    if (invoice.notes) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPos, contentWidth, 30, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text("Notes:", margin + 5, yPos + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...grayColor);

      // Split notes into multiple lines
      const noteLines = doc.splitTextToSize(invoice.notes, contentWidth - 10);
      doc.text(noteLines, margin + 5, yPos + 16);
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY - 5, pageWidth, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Thank you for your business!", pageWidth / 2, footerY + 5, { align: "center" });

    // Generate filename
    const filename = `Invoice_${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;

    // Download the PDF directly
    doc.save(filename);
  } catch (error) {
    console.error("Failed to download invoice PDF:", error);
    alert("Failed to download invoice. Please try again.");
  } finally {
    isDownloading.value = false;
  }
};

const currentPage = ref(1);
const pagination = ref({ total: 0, limit: 10, page: 1 });

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadInvoices();
};

// Watch for status filter changes
watch(selectedStatus, () => {
  loadInvoices();
});

onMounted(() => {
  loadInvoices();
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Invoice</h1>
        <p class="text-muted-foreground mt-1">Kelola tagihan customer</p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]"
        >
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
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

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari invoice..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/finance/invoice/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Buat Invoice</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
      <button @click="loadInvoices" class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg">
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="invoices.length === 0"
      class="text-center py-12 border border-border rounded-xl bg-white"
    >
      <Receipt class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p class="text-muted-foreground">Belum ada invoice</p>
      <NuxtLink
        to="/finance/invoice/create"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#012D5A] text-white rounded-lg"
      >
        <Plus class="w-4 h-4" />
        Buat Invoice Pertama
      </NuxtLink>
    </div>

    <!-- List View -->
    <InvoiceListView
      v-else-if="viewMode === 'list'"
      :invoices="filteredInvoices"
      :get-status-config="getStatusConfig"
      :format-currency="formatCurrency"
      :format-date="formatDate"
      @row-click="handleRowClick"
      @download-pdf="handleDownloadPdf"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Grid View -->
    <InvoiceGridView
      v-else
      :invoices="filteredInvoices"
      :get-status-config="getStatusConfig"
      :format-currency="formatCurrency"
      :format-date="formatDate"
      @row-click="handleRowClick"
      @download-pdf="handleDownloadPdf"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ filteredInvoices.length }} data found.</p>
      <UiPagination
        v-model:page="currentPage"
        :total="pagination.total"
        :items-per-page="pagination.limit"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Edit Modal -->
    <UiModal
      v-model="isEditModalOpen"
      title="Edit Invoice"
      description="Ubah semua detail invoice"
      width="max-w-4xl"
      @close="closeEditModal"
    >
      <form class="space-y-6" @submit.prevent="handleFullUpdate">
        <!-- Error Message -->
        <div v-if="editError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ editError }}</p>
        </div>

        <!-- Basic Info Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">
              Nomor Invoice <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.invoiceNumber"
              type="text"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">
              Status Invoice <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.statusId"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              required
            >
              <option value="" disabled>Pilih status</option>
              <option v-for="status in editStatusOptions" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">
              Tanggal Invoice <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.issuedDate"
              type="date"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">
              Jatuh Tempo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.dueDate"
              type="date"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">
              Customer <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.companyId"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              required
            >
              <option value="" disabled>Pilih customer</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground"> Job Reference </label>
            <select
              v-model="formData.jobId"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              <option value="">Pilih job (opsional)</option>
              <option v-for="job in jobs" :key="job.id" :value="job.id">
                {{ job.jobNumber }}
              </option>
            </select>
          </div>
        </div>

        <!-- Line Items Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-foreground">
              Item Invoice <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              @click="addLineItem"
              class="text-sm text-[#012D5A] hover:text-[#012D5A]/80 font-medium flex items-center gap-1"
            >
              <Plus class="w-4 h-4" />
              Tambah Item
            </button>
          </div>

          <!-- Line Items Table -->
          <div class="border border-border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-muted">
                <tr>
                  <th class="px-3 py-2 text-left font-medium text-foreground w-1/3">Deskripsi</th>
                  <th class="px-3 py-2 text-left font-medium text-foreground">Service</th>
                  <th class="px-3 py-2 text-center font-medium text-foreground w-20">Qty</th>
                  <th class="px-3 py-2 text-right font-medium text-foreground">Harga Satuan</th>
                  <th class="px-3 py-2 text-right font-medium text-foreground">Jumlah</th>
                  <th class="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="(item, index) in formData.items" :key="index" class="hover:bg-muted/50">
                  <td class="p-2">
                    <input
                      v-model="item.description"
                      type="text"
                      placeholder="Deskripsi"
                      class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
                      required
                    />
                  </td>
                  <td class="p-2">
                    <select
                      v-model="item.serviceId"
                      class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
                    >
                      <option value="">Pilih service</option>
                      <option v-for="service in services" :key="service.id" :value="service.id">
                        {{ service.name }}
                      </option>
                    </select>
                  </td>
                  <td class="p-2">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-center"
                      @input="updateItemAmount(index)"
                      required
                    />
                  </td>
                  <td class="p-2">
                    <input
                      v-model.number="item.unitPrice"
                      type="number"
                      min="0"
                      class="w-full px-2 py-1.5 rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm text-right"
                      @input="updateItemAmount(index)"
                      required
                    />
                  </td>
                  <td class="p-2 text-right font-medium">
                    {{ formatCurrency(item.amount) }}
                  </td>
                  <td class="p-2">
                    <button
                      type="button"
                      @click="removeLineItem(index)"
                      class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tax and Notes Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">PPN</label>
            <select
              v-model="selectedTaxRate"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              <option v-for="tax in editTaxOptions" :key="tax.value" :value="tax.value">
                {{ tax.label }}
              </option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-foreground">Catatan</label>
            <textarea
              v-model="formData.notes"
              rows="2"
              placeholder="Catatan invoice (opsional)"
              class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white text-sm"
            ></textarea>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-border pt-4">
          <div class="flex justify-end">
            <div class="w-64 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Subtotal:</span>
                <span class="font-medium">{{ formatCurrency(formData.subTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Pajak (PPN):</span>
                <span class="font-medium">{{ formatCurrency(formData.taxAmount) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-border">
                <span class="font-semibold">Total:</span>
                <span class="font-semibold text-lg">{{ formatCurrency(formData.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" @click="closeEditModal" class="btn-secondary">Batal</button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary flex items-center gap-2"
          >
            <Save class="w-4 h-4" />
            {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
