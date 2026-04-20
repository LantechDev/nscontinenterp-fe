<script setup lang="ts">
import { Plus, Search, Receipt, LayoutList, LayoutGrid } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useInvoices, type InvoiceDetail } from "~/composables/useInvoices";
import { useInvoicePage, type InvoiceData } from "~/composables/useInvoicePage";
import { InvoiceListView, InvoiceGridView, InvoiceEditModal } from "./components";
import JobInvoicePreview from "~/components/operational/JobInvoicePreview.vue";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

type InvoiceListApiResponse =
  | InvoiceData[]
  | { items?: InvoiceData[]; pagination?: { total: number; limit: number; page: number } };

const { fetchInvoiceById } = useInvoices();
const {
  loading,
  invoices,
  error,
  searchQuery,
  selectedStatus,
  viewMode,
  isEditModalOpen,
  isSubmitting,
  editError,
  formData,
  selectedTaxId,
  currentPage,
  pagination,
  statusOptions,
  editStatusOptions,
  taxOptions,
  companies,
  jobs,
  services,
  formatCurrency,
  formatDate,
  getStatusConfig,
  filteredInvoices,
  openEditModal,
  closeEditModal,
  handleFullUpdate,
  handleRowClick,
  handlePageChange,
  addLineItem,
  removeLineItem,
  updateItemAmount,
  initialize,
} = useInvoicePage();

// Client-side: fetch initial data (avoid slow cross-region SSR)
const {
  data: invoicesData,
  pending: isBootstrapping,
  error: bootstrapError,
  refresh: refreshBootstrap,
} = await useAsyncData<InvoiceListApiResponse>(
  "invoice-list",
  async () => await $fetch<InvoiceListApiResponse>("/api/finance/invoice"),
  { server: false },
);

watch(
  isBootstrapping,
  (pending) => {
    loading.value = pending;
  },
  { immediate: true },
);

watch(
  invoicesData,
  (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      invoices.value = value;
      pagination.value = { total: value.length, limit: 10, page: 1 };
      return;
    }
    if (value.items) {
      invoices.value = value.items;
      if (value.pagination) {
        pagination.value = value.pagination;
      }
    }
  },
  { immediate: true },
);

watch(
  bootstrapError,
  (err) => {
    if (!err) return;
    error.value = "Gagal memuat data invoice. Silakan coba lagi.";
  },
  { immediate: true },
);

const isDownloading = ref(false);
const downloadInvoice = ref<InvoiceDetail | null>(null);
const previewRef = ref<InstanceType<typeof JobInvoicePreview> | null>(null);

const handleDownloadPdf = async (id: string) => {
  if (isDownloading.value) return;
  isDownloading.value = true;
  try {
    const result = await fetchInvoiceById(id);
    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to fetch invoice");
    }
    downloadInvoice.value = result.data;
    await nextTick();
    await nextTick(); // double tick to ensure JobInvoicePreview renders
    await previewRef.value?.generatePDF();
  } catch (err) {
    toast.error("Failed to download invoice. Please try again.");
  } finally {
    isDownloading.value = false;
    downloadInvoice.value = null;
  }
};

const isJobDetailOpen = ref(false);
const selectedJobId = ref("");
const initialInvoiceId = ref("");

const handleInvoiceClick = (id: string) => {
  const invoice = filteredInvoices.value.find((inv) => inv.id === id);
  if (invoice?.job?.id) {
    selectedJobId.value = invoice.job.id;
    initialInvoiceId.value = id;
    isJobDetailOpen.value = true;
  } else {
    handleRowClick(id); // Fallback to original behavior if no job id
  }
};

const handleEdit = (id: string) => {
  openEditModal(id);
};

const handleTaxIdChange = (value: string) => {
  selectedTaxId.value = value;
};
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
      <button
        @click="bootstrapError ? refreshBootstrap() : initialize()"
        class="mt-4 px-4 py-2 bg-[#012D5A] text-white rounded-lg"
      >
        Retry
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="filteredInvoices.length === 0"
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
      @row-click="handleInvoiceClick"
      @download-pdf="handleDownloadPdf"
    />

    <!-- Grid View -->
    <InvoiceGridView
      v-else
      :invoices="filteredInvoices"
      :get-status-config="getStatusConfig"
      :format-currency="formatCurrency"
      :format-date="formatDate"
      @row-click="handleInvoiceClick"
      @download-pdf="handleDownloadPdf"
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
    <InvoiceEditModal
      :is-open="isEditModalOpen"
      :is-submitting="isSubmitting"
      :edit-error="editError"
      :form-data="formData"
      :selected-tax-id="selectedTaxId"
      :status-options="editStatusOptions"
      :tax-options="taxOptions"
      :companies="companies"
      :jobs="jobs"
      :services="services"
      @close="closeEditModal"
      @submit="handleFullUpdate"
      @add-line-item="addLineItem"
      @remove-line-item="removeLineItem"
      @update-item-amount="updateItemAmount"
      @update-tax-id="handleTaxIdChange"
    />

    <!-- Job Detail Slide-over -->
    <OperationalJobDetailSlideOver
      v-model="isJobDetailOpen"
      :job-id="selectedJobId"
      initial-tab="invoice"
      :initial-invoice-id="initialInvoiceId"
    />

    <!-- Hidden invoice preview used only for PDF generation -->
    <div
      v-if="downloadInvoice"
      aria-hidden="true"
      class="fixed left-[-9999px] top-0 opacity-0 pointer-events-none z-[-1] w-[210mm]"
    >
      <JobInvoicePreview ref="previewRef" :invoice="downloadInvoice" />
    </div>
  </div>
</template>
