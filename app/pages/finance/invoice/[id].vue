<script setup lang="ts">
import { ArrowLeft, Edit, Download, Receipt, Loader2, Save, Plus, Trash2 } from "lucide-vue-next";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { useCompanies } from "~/composables/useCompanies";
import { useJobs } from "~/composables/useJobs";
import { useServices } from "~/composables/useServices";
import { toNumber, formatRupiah } from "~/lib/utils";
import { generateInvoicePdf } from "./utils/pdf-generator";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const invoiceId = route.params.id as string;

const { fetchInvoiceById, updateInvoice, isLoading } = useInvoices();
const { companies, fetchCompanies } = useCompanies();
const { jobs, fetchJobs } = useJobs();
const { services, fetchServices } = useServices();

// Invoice data state
const invoice = ref<InvoiceDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Edit modal state
const isEditModalOpen = ref(false);
const isSubmitting = ref(false);
const editError = ref<string | null>(null);

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

// Status options
const statusOptions = [
  { id: "PAID", name: "Lunas (Paid)" },
  { id: "UNPAID", name: "Belum Lunas (Unpaid)" },
  { id: "OVERDUE", name: "Jatuh Tempo (Overdue)" },
];

// Tax options
const taxOptions = [
  { value: 0, label: "Tanpa PPN" },
  { value: 1.1, label: "PPN 1.1% (Freight)" },
  { value: 11, label: "PPN 11%" },
];

const selectedTaxRate = ref(0);

// Status badge configuration
// Handle download invoice PDF
const handleDownload = async () => {
  if (!invoice.value) return;
  await generateInvoicePdf(invoice.value);
};

const getStatusBadge = (statusCode: string) => {
  const statusMap: Record<string, { label: string; class: string }> = {
    PAID: { label: "Lunas", class: "badge-success" },
    UNPAID: { label: "Pending", class: "badge-warning" },
    PARTIALLY_PAID: { label: "Sebagian", class: "badge-warning" },
    OVERDUE: { label: "Jatuh Tempo", class: "badge-danger" },
  };
  return statusMap[statusCode] || { label: statusCode, class: "badge-warning" };
};

const formatCurrency = formatRupiah;

// Format date for input
const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0] || "";
};

// Format date for display
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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

// Load invoice data
const loadInvoice = async () => {
  try {
    loading.value = true;
    error.value = null;
    const result = await fetchInvoiceById(invoiceId);
    if (result.success && result.data) {
      invoice.value = result.data;
    } else {
      throw new Error(result.error || "Failed to load invoice");
    }
  } catch (e) {
    console.error("Failed to fetch invoice:", e);
    error.value = "Failed to load invoice";
  } finally {
    loading.value = false;
  }
};

// Load dropdown data
const loadDropdownData = async () => {
  await Promise.all([fetchCompanies({ type: "CUSTOMER" }), fetchJobs(), fetchServices()]);
};

// Open edit modal with full form
const openEditModal = async () => {
  if (!invoice.value) return;

  await loadDropdownData();

  // Initialize form with existing data
  const inv = invoice.value;
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
  if (invoice.value.subTotal && invoice.value.taxAmount) {
    selectedTaxRate.value =
      (toNumber(invoice.value.taxAmount) / toNumber(invoice.value.subTotal)) * 100;
  } else {
    selectedTaxRate.value = 0;
  }

  isEditModalOpen.value = true;
  editError.value = null;
};

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editError.value = null;
};

// Submit full invoice update
const handleFullUpdate = async () => {
  if (!invoice.value || !formData.value.companyId) return;

  try {
    isSubmitting.value = true;
    editError.value = null;

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

    const result = await updateInvoice(invoice.value.id, {
      invoiceNumber: formData.value.invoiceNumber,
      issuedDate: formData.value.issuedDate,
      dueDate: formData.value.dueDate,
      companyId: formData.value.companyId,
      jobId: formData.value.jobId || undefined,
      notes: formData.value.notes,
      subTotal,
      taxAmount,
      total,
      balanceDue: total, // For simplicity, set balanceDue equal to total
      statusId: formData.value.statusId,
      items: itemsToUpdate,
    });

    if (result.success && result.data) {
      // Reload invoice to get updated data
      await loadInvoice();
      closeEditModal();
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

// Load on mount
onMounted(() => {
  loadInvoice();
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#012D5A]"></div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="text-center py-12">
    <p class="text-red-500">{{ error }}</p>
    <button @click="loadInvoice" class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg">
      Retry
    </button>
  </div>

  <!-- Invoice Detail -->
  <div v-else-if="invoice" class="space-y-6 animate-fade-in p-6">
    <div class="page-header">
      <div class="flex items-center gap-4">
        <NuxtLink to="/finance/invoice" class="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="page-title">{{ invoice.invoiceNumber }}</h1>
          <p class="text-muted-foreground mt-1">Detail invoice</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary" @click="handleDownload">
          <Download class="w-4 h-4 mr-2" />
          Download
        </button>
        <button class="btn-primary" @click="openEditModal">
          <Edit class="w-4 h-4 mr-2" />
          Edit Invoice
        </button>
      </div>
    </div>

    <div class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Receipt class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ invoice.invoiceNumber }}</h2>
          <p class="text-muted-foreground">{{ invoice.company?.name }}</p>
        </div>
        <span :class="['ml-auto', getStatusBadge(invoice.status?.code || '').class]">
          {{ getStatusBadge(invoice.status?.code || "").label }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Customer</p>
          <p class="font-medium text-primary">{{ invoice.company?.name }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Tanggal</p>
          <p class="font-medium">{{ formatDate(invoice.issuedDate) }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Jatuh Tempo</p>
          <p class="font-medium">{{ formatDate(invoice.dueDate) }}</p>
        </div>
        <div v-if="invoice.job" class="space-y-1">
          <p class="text-sm text-muted-foreground">Job Reference</p>
          <p class="font-medium">{{ invoice.job.jobNumber }}</p>
        </div>
      </div>

      <div class="border-t border-border pt-6">
        <h3 class="font-semibold mb-4">Detail Item</h3>
        <div class="space-y-2">
          <div
            v-for="(item, index) in invoice.items"
            :key="index"
            class="flex justify-between py-2 border-b border-border last:border-0"
          >
            <div>
              <span class="font-medium">{{ item.description }}</span>
              <span v-if="item.service" class="text-sm text-muted-foreground ml-2"
                >({{ item.service.name }})</span
              >
              <div class="text-sm text-muted-foreground">
                {{ item.quantity }} x {{ formatCurrency(item.unitPrice) }}
              </div>
            </div>
            <span class="font-medium">{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-border space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Subtotal</span>
            <span class="font-medium">{{ formatCurrency(toNumber(invoice.subTotal) || 0) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Pajak (PPN)</span>
            <span class="font-medium">{{ formatCurrency(toNumber(invoice.taxAmount) || 0) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-border">
            <span class="text-muted-foreground">Total</span>
            <span class="font-medium text-lg">{{ formatCurrency(toNumber(invoice.total)) }}</span>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div v-if="invoice.notes" class="border-t border-border pt-6 mt-6">
        <h3 class="font-semibold mb-2">Catatan</h3>
        <p class="text-muted-foreground whitespace-pre-wrap">{{ invoice.notes }}</p>
      </div>
    </div>
  </div>

  <!-- Full Edit Modal -->
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
            <option v-for="status in statusOptions" :key="status.id" :value="status.id">
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
            class="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Plus class="w-4 h-4" />
            Tambah Item
          </button>
        </div>

        <div class="border border-border rounded-lg overflow-hidden">
          <!-- Header -->
          <div class="grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium">
            <div class="col-span-4">Deskripsi</div>
            <div class="col-span-2">Layanan</div>
            <div class="col-span-2">Jumlah</div>
            <div class="col-span-2">Harga Satuan</div>
            <div class="col-span-1.5">Total</div>
            <div class="col-span-0.5"></div>
          </div>

          <!-- Items -->
          <div v-if="formData.items.length === 0" class="p-4 text-center text-muted-foreground">
            Belum ada item. Klik "Tambah Item" untuk menambahkan.
          </div>
          <div
            v-else
            v-for="(item, index) in formData.items"
            :key="index"
            class="grid grid-cols-12 gap-2 p-3 border-t border-border items-center"
          >
            <div class="col-span-4">
              <input
                v-model="item.description"
                type="text"
                placeholder="Deskripsi item"
                class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="col-span-2">
              <select
                v-model="item.serviceId"
                class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="">Pilih</option>
                <option v-for="service in services" :key="service.id" :value="service.id">
                  {{ service.name }}
                </option>
              </select>
            </div>
            <div class="col-span-2">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                @input="updateItemAmount(index)"
                class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="col-span-2">
              <input
                v-model.number="item.unitPrice"
                type="number"
                min="0"
                @input="updateItemAmount(index)"
                class="w-full px-2 py-1.5 text-sm rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div class="col-span-1.5 text-sm font-medium">
              {{ formatCurrency(calculateItemAmount(item)) }}
            </div>
            <div class="col-span-0.5">
              <button
                type="button"
                @click="removeLineItem(index)"
                class="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax and Notes Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"> PPN </label>
          <select
            v-model.number="selectedTaxRate"
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option v-for="tax in taxOptions" :key="tax.value" :value="tax.value">
              {{ tax.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-foreground"> Catatan </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            placeholder="Catatan invoice..."
            class="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-white resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Totals -->
      <div class="border-t border-border pt-4">
        <div class="flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Subtotal</span>
              <span class="font-medium">{{ formatCurrency(calculateSubTotal()) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Pajak (PPN {{ selectedTaxRate }}%)</span>
              <span class="font-medium">{{ formatCurrency(calculateTaxAmount()) }}</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-border">
              <span class="font-medium">Total</span>
              <span class="font-bold text-lg">{{ formatCurrency(calculateTotal()) }}</span>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="closeEditModal"
        class="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors"
        :disabled="isSubmitting"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleFullUpdate"
        :disabled="isSubmitting || !formData.companyId || formData.items.length === 0"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white rounded-lg hover:bg-[#012D5A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        {{ isSubmitting ? "Saving..." : "Save Changes" }}
      </button>
    </template>
  </UiModal>
</template>
