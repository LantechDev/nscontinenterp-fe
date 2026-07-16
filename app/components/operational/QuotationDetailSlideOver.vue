<script setup lang="ts">
import { cn } from "~/lib/utils";
import {
  X,
  FileText,
  Calendar,
  Clock,
  Loader2,
  Settings,
  CheckCircle2,
  CalendarClock,
  Edit,
  Briefcase,
  User,
  MessageSquare,
  Sparkles,
  Building2,
  Receipt,
  Users,
  Timer,
  Download,
  Package,
  MapPin,
  Ship,
  Truck,
  Plane as PlaneIcon,
  Plus,
  Trash2,
  MoreHorizontal,
  Pencil,
  ArrowLeft,
  Eye,
  ChevronRight,
} from "lucide-vue-next";
import {
  useQuotations,
  type Quotation,
  type QuotationCharge,
  type QuotationInvoice,
  type QuotationInvoiceItem,
} from "~/composables/useQuotations";
import { useFinanceTax } from "~/composables/useFinanceTax";
import { toast } from "vue-sonner";
import Modal from "~/components/ui/Modal.vue";
import QuotationPreview from "./QuotationPreview.vue";
import QuotationCostingTab from "./QuotationCostingTab.vue";
import QuotationInvoiceForm from "./QuotationInvoiceForm.vue";
import QuotationInvoicePreview from "./QuotationInvoicePreview.vue";

interface Props {
  modelValue: boolean;
  quotationId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "converted"): void;
  (e: "status-updated"): void;
}>();

const { currentQuotation, getQuotation, updateQuotation, updateQuotationInvoices, isLoading } =
  useQuotations();
const { confirm } = useConfirm();
const { fetchTaxes } = useFinanceTax();
const router = useRouter();
const { canManage, requireManage } = useFeatureAccess("operational.quotation");

const activeTab = ref("overview");
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Service Items" },
  { id: "invoices", label: "Quotation Invoices" },
  { id: "costing", label: "Costing & Profit" },
  { id: "usage", label: "Usage" },
];

const canEditCosting = computed(() => canManage.value && quotation.value?.status !== "CONVERTED");

const isConverting = ref(false);
const isUpdatingStatus = ref(false);
const isGeneratingPDF = ref(false);
const previewRef = ref<InstanceType<typeof QuotationPreview> | null>(null);
const taxesList = ref<Array<{ id: string; name: string; rate: number }>>([]);

const quotation = computed(() => currentQuotation.value);

const isMultiUse = computed(() => Boolean(quotation.value?.allowMultipleInvoices));

const relatedInvoices = computed(() => quotation.value?.invoices || []);

const quotationInvoices = computed(() => quotation.value?.quotationInvoices || []);

const getPol = computed(() => quotation.value?.polName || quotation.value?.pol || "-");
const getPod = computed(() => quotation.value?.podName || quotation.value?.pod || "-");

const tradeTypeLabel = computed(() => {
  const tradeType = quotation.value?.tradeTypeId;
  if (tradeType === "IMPORT") return "Import";
  if (tradeType === "DOMESTIC") return "Domestic";
  return "Export";
});

const serviceTypeLabel = computed(() => {
  const serviceType = quotation.value?.serviceType;
  if (serviceType === "TRUCKING") return "TRUCKING";
  if (serviceType === "CUSTOM_CLEARANCE") return "CUSTOM CLEARANCE";
  return "OCEAN (FREIGHT)";
});

const shipmentTypeLabel = computed(() => {
  const shipmentType = quotation.value?.shipmentType;
  if (shipmentType === "AIR") return "Air Freight";
  if (shipmentType === "OCEAN") return "Ocean Freight";
  return "-";
});

const isOceanService = computed(() => quotation.value?.serviceType === "OCEAN");
const isAirFreight = computed(
  () => quotation.value?.serviceType === "OCEAN" && quotation.value?.shipmentType === "AIR",
);
const isTrucking = computed(() => quotation.value?.serviceType === "TRUCKING");
const isCustomClearance = computed(() => quotation.value?.serviceType === "CUSTOM_CLEARANCE");

const originLabel = computed(() => {
  if (isTrucking.value) return "Pickup Address";
  if (isCustomClearance.value) return "Clearance Origin / Port";
  return isAirFreight.value ? "Origin Airport" : "Port of Loading (POL)";
});

const destinationLabel = computed(() => {
  if (isTrucking.value) return "Delivery Address";
  if (isCustomClearance.value) return "Clearance Destination / Port";
  return isAirFreight.value ? "Destination Airport" : "Port of Discharge (POD)";
});

const originValue = computed(() => {
  if (isTrucking.value) return quotation.value?.pickupAddress || "-";
  return getPol.value;
});

const destinationValue = computed(() => {
  if (isTrucking.value) return quotation.value?.deliveryAddress || "-";
  return getPod.value;
});

const containerTypeValue = computed(() => {
  if (isCustomClearance.value) return "-";
  return quotation.value?.containerTypeName || quotation.value?.containerTypeId || "-";
});

const truckTypeValue = computed(() => {
  if (!isTrucking.value) return "-";
  return quotation.value?.truckType || "-";
});

const groupedTotals = computed(() => {
  const totals: {
    IDR: { subTotal: number; taxAmount: number; total: number };
    USD: { subTotal: number; taxAmount: number; total: number };
    [key: string]: { subTotal: number; taxAmount: number; total: number };
  } = {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };

  if (!quotation.value?.charges) return totals;

  const rate = Number(quotation.value?.exchangeRate || 1);
  const shouldConvert = rate > 1;

  quotation.value.charges.forEach((ch) => {
    const currency = ch.currency || "IDR";
    const qty = Number(ch.quantity || 0);
    const price = Number(ch.unitPrice || 0);
    const amount = qty * price;
    const tr = getTaxRate(ch.taxId);
    const taxValue = amount * (tr / 100);

    if (shouldConvert && currency === "USD") {
      const idrAmount = amount * rate;
      const idrTax = taxValue * rate;
      totals.IDR.subTotal += idrAmount;
      totals.IDR.taxAmount += idrTax;
    } else {
      if (!totals[currency]) {
        totals[currency] = { subTotal: 0, taxAmount: 0, total: 0 };
      }
      totals[currency].subTotal += amount;
      totals[currency].taxAmount += taxValue;
    }
  });

  totals.IDR.subTotal = roundByCurrency(totals.IDR.subTotal, "IDR");
  totals.IDR.taxAmount = ceilTaxByCurrency(totals.IDR.taxAmount, "IDR");
  totals.IDR.total = totals.IDR.subTotal + totals.IDR.taxAmount;

  totals.USD.taxAmount = ceilTaxByCurrency(totals.USD.taxAmount, "USD");
  totals.USD.total = totals.USD.subTotal + totals.USD.taxAmount;

  // USD will show zero when all converted — template hides it via v-if t.total > 0

  return totals;
});

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.quotationId) {
      activeTab.value = "overview";
      const [taxRes] = await Promise.all([
        fetchTaxes({ isActive: true }),
        getQuotation(props.quotationId),
      ]);
      if (taxRes?.items) {
        taxesList.value = taxRes.items.map((t) => ({
          id: t.id,
          name: t.name,
          rate: Number(t.rate),
        }));
      }
    }
  },
  { immediate: true },
);

// Helpers
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
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

const formatCurrencyIDR = (amount: number, currency: string = "IDR") => {
  const rate = Number(quotation.value?.exchangeRate || 1);
  const idrAmount = currency === "USD" && rate > 1 ? amount * rate : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(idrAmount);
};

const exchangeRateLabel = computed(() => {
  const rate = Number(quotation.value?.exchangeRate || 1);
  if (rate > 1) {
    return `1 USD = ${new Intl.NumberFormat("id-ID").format(rate)} IDR`;
  }
  return "";
});

const itemsTotalRevenue = computed(() => {
  let idrTotal = 0;
  let usdTotal = 0;
  const rate = Number(quotation.value?.exchangeRate || 1);
  (quotation.value?.charges || []).forEach((ch) => {
    if (ch.atCost) return;
    const amt = Number(ch.quantity || 0) * Number(ch.unitPrice || 0);
    if ((ch.currency || "IDR") === "USD") {
      usdTotal += amt;
      if (rate > 1) idrTotal += amt * rate;
    } else {
      idrTotal += amt;
    }
  });
  return { idrTotal, usdTotal, hasUsd: usdTotal > 0, hasRate: rate > 1 };
});

const invoiceSummary = computed(() => {
  let totalInvoicedIDR = 0;
  let totalInvoicedUSD = 0;
  let hasUSD = false;
  const rate = Number(quotation.value?.exchangeRate || 1);
  (relatedInvoices.value || []).forEach((inv) => {
    const amt = Number(inv.total || 0);
    if (inv.currency === "USD") {
      hasUSD = true;
      totalInvoicedUSD += amt;
      if (rate > 1) totalInvoicedIDR += amt * rate;
    } else {
      totalInvoicedIDR += amt;
    }
  });
  return { totalInvoicedIDR, totalInvoicedUSD, hasUSD, hasRate: rate > 1 };
});

const getStatusBadgeClass = (status?: string) => {
  if (!status) return "bg-gray-50 text-gray-600 border-gray-200";
  const s = status.toUpperCase();
  if (s === "CONVERTED") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "CONFIRMED") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "DRAFT") return "bg-gray-100 text-gray-800 border-gray-300";
  if (s === "SENT") return "bg-amber-100 text-[#8a5d00] border-amber-200";
  if (s === "CANCELLED") return "bg-rose-100 text-rose-800 border-rose-200";
  if (s === "EXPIRED") return "bg-indigo-100 text-indigo-800 border-indigo-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
};

// Conversions

// Update Status quick action
const handleUpdateStatus = async (newStatus: string) => {
  if (!quotation.value) return;
  if (!requireManage("You only have view access for quotations.")) return;

  const yes = await confirm({
    title: "Update Quotation Status",
    message: `Ubah status quotation menjadi ${newStatus}?`,
    confirmText: "Ubah",
    cancelText: "Batal",
  });

  if (!yes) return;

  isUpdatingStatus.value = true;
  const res = await updateQuotation(quotation.value.id, { status: newStatus });
  isUpdatingStatus.value = false;

  if (res.success) {
    toast.success(`Status berhasil diubah menjadi ${newStatus}`);
    emit("status-updated");
    await getQuotation(quotation.value.id);
  } else {
    toast.error(res.error || "Gagal mengubah status.");
  }
};

const getTaxRate = (taxId?: string | null) => {
  if (!taxId) {
    const fallbackId = quotation.value?.taxId;
    if (!fallbackId) return 0;
    const fallbackTax = taxesList.value.find((t) => t.id === fallbackId);
    return fallbackTax ? fallbackTax.rate : 0;
  }
  const tax = taxesList.value.find((t) => t.id === taxId);
  return tax ? tax.rate : 0;
};

const showInvoiceForm = ref(false);
const showPreview = ref(false);
const editingInvoice = ref<QuotationInvoice | null>(null);
const isCreatingInvoice = ref(false);
const showQInvActions = ref<string | null>(null);
const showQInvDetailActions = ref(false);
const showQInvDetail = ref(false);
const activeQInvDetail = ref<QuotationInvoice | null>(null);

const openQInvDetail = (qinv: QuotationInvoice) => {
  activeQInvDetail.value = qinv;
  showQInvDetail.value = true;
  showQInvActions.value = null;
  showQInvDetailActions.value = false;
};

const closeQInvDetail = () => {
  activeQInvDetail.value = null;
  showQInvDetail.value = false;
  showQInvDetailActions.value = false;
};

const qinvPreviewRef = ref<InstanceType<typeof QuotationInvoicePreview> | null>(null);

const isGeneratingQInvPDF = ref(false);
const handleGenerateQInvPDF = async () => {
  if (!qinvPreviewRef.value) return;
  isGeneratingQInvPDF.value = true;
  try {
    await qinvPreviewRef.value.generatePDF();
  } finally {
    isGeneratingQInvPDF.value = false;
  }
};

const openEditInvoiceForm = (invoice: QuotationInvoice) => {
  editingInvoice.value = invoice;
  showInvoiceForm.value = true;
  showQInvActions.value = null;
  showQInvDetailActions.value = false;
};

const nextInvoiceNumber = computed(() => {
  const count = (quotationInvoices.value?.length || 0) + 1;
  return `QINV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${String(count).padStart(3, "0")}`;
});

const openCreateInvoiceForm = () => {
  editingInvoice.value = null;
  showInvoiceForm.value = true;
};

const handleInvoiceFormSubmit = async (payload: QuotationInvoice) => {
  if (!quotation.value) return;
  isCreatingInvoice.value = true;
  try {
    const existingId = editingInvoice.value?.id;
    const updated = existingId
      ? (quotationInvoices.value || []).map((inv) =>
          inv.id === existingId ? { ...payload, id: existingId } : inv,
        )
      : [...(quotationInvoices.value || []), payload];
    const res = await updateQuotationInvoices(quotation.value.id, updated);
    if (res.success) {
      toast.success(editingInvoice.value ? "Invoice updated." : "Invoice created.");
      showInvoiceForm.value = false;
      editingInvoice.value = null;
    } else {
      toast.error(res.error || "Failed to save invoice.");
    }
  } finally {
    isCreatingInvoice.value = false;
  }
};

const handleDeleteInvoice = async (invoiceId?: string) => {
  if (!quotation.value || !invoiceId) return;
  const yes = await confirm({
    title: "Delete Quotation Invoice",
    message: "Hapus quotation invoice ini?",
    confirmText: "Hapus",
    cancelText: "Batal",
  });
  if (!yes) return;
  const updated = (quotationInvoices.value || []).filter((inv) => inv.id !== invoiceId);
  const res = await updateQuotationInvoices(quotation.value.id, updated);
  if (res.success) {
    toast.success("Invoice deleted.");
    if (activeQInvDetail.value?.id === invoiceId) closeQInvDetail();
  } else {
    toast.error(res.error || "Failed to delete invoice.");
  }
};

const handleGeneratePDF = async () => {
  if (!quotation.value) return;
  const prevTab = activeTab.value;
  const prevShowPreview = showPreview.value;
  if (activeTab.value !== "items") {
    activeTab.value = "items";
    showPreview.value = true;
    await nextTick();
  } else if (!showPreview.value) {
    showPreview.value = true;
    await nextTick();
  }
  if (!previewRef.value) return;
  isGeneratingPDF.value = true;
  try {
    await previewRef.value.generatePDF();
  } finally {
    isGeneratingPDF.value = false;
    activeTab.value = prevTab;
    showPreview.value = prevShowPreview;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-over">
      <div v-if="modelValue" class="fixed inset-0 z-[1050] flex justify-end">
        <!-- Backdrop Overlay -->
        <div
          class="absolute inset-0 bg-black/40 transition-opacity"
          @click="$emit('update:modelValue', false)"
        ></div>

        <!-- Drawer Content Container -->
        <div
          class="slide-panel relative w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        >
          <!-- Sticky SlideOver Top Header -->
          <div
            class="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between shrink-0 bg-white z-20"
          >
            <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              Quotation <span class="mx-1">›</span>
              <span class="text-foreground font-semibold">{{ quotation?.number || "..." }}</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Print Button -->
              <button
                v-if="quotation"
                @click="handleGeneratePDF"
                :disabled="isGeneratingPDF"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#012D5A] hover:bg-[#012D5A]/90 text-white transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Loader2 v-slot:default v-if="isGeneratingPDF" class="w-3.5 h-3.5 animate-spin" />
                <Download v-else class="w-3.5 h-3.5" />
                <span>{{ isGeneratingPDF ? "Generating" : "Download PDF" }}</span>
              </button>

              <!-- Edit Button -->
              <button
                v-if="quotation && quotation.status !== 'CONVERTED' && canManage"
                @click="router.push(`/operational/quotations/${quotation.id}/edit`)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit class="w-3.5 h-3.5" />
                <span>Edit Quotation</span>
              </button>

              <!-- Close X Trigger -->
              <button
                @click="$emit('update:modelValue', false)"
                class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <Loader2 class="w-8 h-8 animate-spin text-[#012D5A]" />
          </div>

          <!-- Main Layout -->
          <div v-else-if="quotation" class="flex-1 flex flex-col min-h-0 bg-white">
            <div class="flex-1 overflow-y-auto">
              <!-- Quotation Summary Header -->
              <div class="px-8 py-6 pb-2">
                <h2 class="text-2xl font-bold text-foreground mb-1">{{ quotation.number }}</h2>
                <p class="text-sm text-muted-foreground mb-6">
                  {{ quotation.customerName || "Customer Client" }}
                </p>

                <div class="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Calendar class="w-4 h-4" /> Quotation Date
                  </div>
                  <div class="font-medium">{{ formatDate(quotation.date) }}</div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <CalendarClock class="w-4 h-4" /> Valid Until
                  </div>
                  <div class="font-medium">{{ formatDate(quotation.validUntil) }}</div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Clock class="w-4 h-4" /> Created Time
                  </div>
                  <div class="font-medium">{{ formatDateTime(quotation.createdAt) }}</div>

                  <div class="flex items-center gap-2 text-muted-foreground">
                    <Settings class="w-4 h-4" /> Status
                  </div>
                  <div>
                    <span
                      :class="
                        cn(
                          'inline-flex items-center px-3 py-1 rounded-md text-xs font-bold leading-none border uppercase tracking-wider',
                          getStatusBadgeClass(quotation.status),
                        )
                      "
                    >
                      {{ quotation.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div
                class="px-8 mt-6 pt-4 border-b border-border flex gap-8 sticky top-0 bg-white z-10"
              >
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="pb-3 text-base font-bold transition-colors relative tracking-tight"
                  :class="
                    activeTab === tab.id
                      ? 'text-[#012D5A]'
                      : 'text-muted-foreground hover:text-foreground'
                  "
                >
                  {{ tab.label }}
                  <div
                    v-if="activeTab === tab.id"
                    class="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#012D5A] rounded-t-full"
                  ></div>
                </button>
              </div>

              <!-- TAB CONTENT LAYOUTS -->
              <div class="p-8">
                <!-- Tab 1: Overview Details -->
                <div v-if="activeTab === 'overview'" class="space-y-8 animate-fade-in">
                  <!-- Lock State Alert Banner -->
                  <div
                    v-if="quotation.status === 'CONVERTED'"
                    class="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3 shadow-sm"
                  >
                    <Sparkles class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 class="text-sm font-bold">Quotation Locked & Converted</h4>
                      <p class="text-xs text-emerald-700/90 mt-1">
                        Quotation ini telah sukses dikonversi menjadi operasional Job aktif dan
                        dikunci demi kepentingan audit keuangan ERP. Seluruh pricing charges telah
                        dipindahkan.
                      </p>
                    </div>
                  </div>

                  <section>
                    <h3 class="text-base font-bold">Shipments Details</h3>
                    <div class="grid grid-cols-2 gap-x-8 gap-y-6 mt-6">
                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <MapPin v-if="isTrucking" class="w-5 h-5 text-[#012D5A]/80" />
                          <Building2 v-else class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">{{ originLabel }}</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ originValue }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <MapPin v-if="isTrucking" class="w-5 h-5 text-[#012D5A]/80" />
                          <Building2 v-else class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">
                            {{ destinationLabel }}
                          </p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ destinationValue }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Truck v-if="isTrucking" class="w-5 h-5 text-[#012D5A]/80" />
                          <PlaneIcon v-else-if="isAirFreight" class="w-5 h-5 text-[#012D5A]/80" />
                          <Ship v-else class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Service Type</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ serviceTypeLabel }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Briefcase class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Trade Type</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ tradeTypeLabel }}
                          </p>
                        </div>
                      </div>

                      <div v-if="isOceanService" class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Package class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Type of Shipment</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ shipmentTypeLabel }}
                          </p>
                        </div>
                      </div>

                      <div v-if="!isCustomClearance" class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Package class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Container Type</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ containerTypeValue }}
                          </p>
                        </div>
                      </div>

                      <template v-if="isTrucking">
                        <div class="flex gap-4 items-center">
                          <div
                            class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                          >
                            <Truck class="w-5 h-5 text-[#012D5A]/80" />
                          </div>
                          <div class="min-w-0">
                            <p class="text-xs text-muted-foreground mb-0.5">Truck Type</p>
                            <p class="font-bold text-sm text-foreground truncate">
                              {{ truckTypeValue }}
                            </p>
                          </div>
                        </div>

                        <div class="flex gap-4 items-center">
                          <div
                            class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                          >
                            <Calendar class="w-5 h-5 text-[#012D5A]/80" />
                          </div>
                          <div class="min-w-0">
                            <p class="text-xs text-muted-foreground mb-0.5">Pickup Date</p>
                            <p class="font-bold text-sm text-foreground truncate">
                              {{ formatDate(quotation.pickupDate) }}
                            </p>
                          </div>
                        </div>

                        <div class="flex gap-4 items-center">
                          <div
                            class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                          >
                            <Calendar class="w-5 h-5 text-[#012D5A]/80" />
                          </div>
                          <div class="min-w-0">
                            <p class="text-xs text-muted-foreground mb-0.5">Delivery Date</p>
                            <p class="font-bold text-sm text-foreground truncate">
                              {{ formatDate(quotation.deliveryDate) }}
                            </p>
                          </div>
                        </div>
                      </template>
                    </div>
                  </section>

                  <section>
                    <h3 class="text-base font-bold">Quotation Details</h3>
                    <div class="grid grid-cols-2 gap-x-8 gap-y-6 mt-6">
                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Users class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">PIC Customer</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ quotation.picName || "-" }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <User class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Sales Representative</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ quotation.salesName || "-" }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <Timer class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Free Time</p>
                          <p class="font-bold text-sm text-foreground truncate">
                            {{ quotation.freeTime || "-" }}
                          </p>
                        </div>
                      </div>

                      <div class="flex gap-4 items-center">
                        <div
                          class="w-10 h-10 rounded-full bg-blue-50/80 flex items-center justify-center text-[#012D5A] shrink-0 border border-blue-100"
                        >
                          <FileText class="w-5 h-5 text-[#012D5A]/80" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs text-muted-foreground mb-0.5">Term</p>
                          <p class="font-bold text-sm text-foreground truncate uppercase">
                            {{ quotation.term || "-" }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Quotation Workflow Actions Panel -->
                  <section
                    v-if="quotation.status !== 'CONVERTED' && canManage"
                    class="bg-white border border-border rounded-xl p-5 shadow-sm space-y-4"
                  >
                    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Settings class="w-4 h-4 text-[#012D5A]" />
                      <span>Quotation Status Actions</span>
                    </h3>
                    <p class="text-xs text-muted-foreground">
                      Ubah status untuk mengontrol daur hidup sales agreement. Setelah customer
                      menyetujui pricing, ubah status menjadi
                      <strong class="text-blue-700">CONFIRMED</strong> agar bisa dikonversi menjadi
                      operasional Job.
                    </p>

                    <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
                      <button
                        v-if="quotation.status === 'DRAFT'"
                        @click="handleUpdateStatus('SENT')"
                        :disabled="isUpdatingStatus"
                        class="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 class="w-3.5 h-3.5" />
                        <span>Kirim ke Customer (SENT)</span>
                      </button>

                      <button
                        v-if="quotation.status === 'SENT'"
                        @click="handleUpdateStatus('CONFIRMED')"
                        :disabled="isUpdatingStatus"
                        class="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 class="w-3.5 h-3.5" />
                        <span>Customer Confirm (CONFIRMED)</span>
                      </button>

                      <button
                        v-if="quotation.status !== 'CANCELLED'"
                        @click="handleUpdateStatus('CANCELLED')"
                        class="px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X class="w-3.5 h-3.5" />
                        <span>Batalkan Quotation</span>
                      </button>

                      <button
                        v-if="quotation.status === 'SENT'"
                        @click="handleUpdateStatus('EXPIRED')"
                        :disabled="isUpdatingStatus"
                        class="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CalendarClock class="w-3.5 h-3.5" />
                        <span>Set Expired</span>
                      </button>

                      <button
                        v-if="quotation.status === 'EXPIRED'"
                        @click="handleUpdateStatus('SENT')"
                        :disabled="isUpdatingStatus"
                        class="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CalendarClock class="w-3.5 h-3.5" />
                        <span>Batal Expired</span>
                      </button>
                    </div>
                  </section>

                  <!-- General Notes Section -->
                  <section class="bg-white border border-border rounded-xl p-6 shadow-sm space-y-3">
                    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <MessageSquare class="w-4 h-4 text-[#012D5A]" />
                      <span>Remarks & Internal Terms</span>
                    </h3>
                    <div
                      class="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg min-h-[80px] italic border border-border/40 whitespace-pre-line"
                    >
                      {{ quotation.notes || "Tidak ada catatan internal untuk quotation ini." }}
                    </div>
                  </section>
                </div>
                <!-- Tab 2: Service Items (Printable Preview) -->
                <div v-else-if="activeTab === 'items'" class="animate-fade-in">
                  <!-- Card View -->
                  <div v-if="!showPreview" class="space-y-4">
                    <div>
                      <h3 class="text-base font-bold text-foreground">Service Items</h3>
                      <p class="text-[11px] text-muted-foreground mt-0.5 max-w-lg">
                        Printable quotation preview untuk dikirim ke customer. Klik untuk melihat
                        tampilan PDF.
                      </p>
                    </div>
                    <div
                      @click="showPreview = true"
                      class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="w-10 h-10 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0 border border-blue-100"
                        >
                          <FileText class="w-5 h-5" />
                        </div>
                        <div>
                          <span
                            class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors"
                            >{{ quotation.number }}</span
                          >
                          <p class="text-xs text-muted-foreground mt-0.5">
                            {{ quotation.customerName || "—" }} ·
                            {{ (quotation.charges || []).length }} item(s)
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider"
                          :class="getStatusBadgeClass(quotation.status)"
                          >{{ quotation.status }}</span
                        >
                        <div class="text-right">
                          <p class="font-black text-sm text-[#012D5A]">
                            {{ formatCurrency(itemsTotalRevenue.idrTotal, "IDR") }}
                          </p>
                          <p
                            v-if="itemsTotalRevenue.hasUsd && itemsTotalRevenue.hasRate"
                            class="text-[9px] text-muted-foreground font-bold"
                          >
                            {{ formatCurrency(itemsTotalRevenue.usdTotal, "USD") }}
                          </p>
                        </div>
                        <ChevronRight
                          class="w-4 h-4 text-muted-foreground group-hover:text-[#012D5A] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Detail/Preview View -->
                  <template v-else>
                    <div
                      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6"
                    >
                      <div class="flex items-start gap-4">
                        <button
                          @click="showPreview = false"
                          class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                        >
                          <ArrowLeft class="w-5 h-5" />
                        </button>
                        <div class="flex flex-col gap-2 mt-1">
                          <h1 class="text-2xl font-bold text-foreground leading-none">
                            {{ quotation.number }}
                          </h1>
                          <p class="text-sm text-muted-foreground leading-none mb-1">
                            {{ quotation.customerName || "—" }} · {{ formatDate(quotation.date) }}
                          </p>
                          <div class="flex items-center gap-3">
                            <span
                              class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border leading-none max-w-fit"
                              :class="getStatusBadgeClass(quotation.status)"
                              >{{ quotation.status }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
                        <button
                          @click="handleGeneratePDF"
                          :disabled="isGeneratingPDF"
                          class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <Loader2 v-if="isGeneratingPDF" class="w-3.5 h-3.5 animate-spin" />
                          <Download v-else class="w-3.5 h-3.5" />
                          {{ isGeneratingPDF ? "Generating..." : "Download PDF" }}
                        </button>
                      </div>
                    </div>
                    <QuotationPreview ref="previewRef" :quotation="quotation" />
                  </template>
                </div>
                <!-- Tab 3: Quotation Invoices -->
                <div v-else-if="activeTab === 'invoices'" class="animate-fade-in space-y-6">
                  <div>
                    <h3 class="text-base font-bold text-foreground">Quotation Invoices</h3>
                    <p class="text-[11px] text-muted-foreground mt-0.5 max-w-lg">
                      Dokumen invoice customer-facing yang dibuat dari item quotation ini. Setiap
                      invoice mengelompokkan charge items menjadi dokumen yang bisa dicetak.
                    </p>
                  </div>
                  <!-- Summary Cards -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <span
                            class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                            >Quotation Total</span
                          >
                          <p class="text-lg font-black text-[#012D5A] mt-1.5">
                            {{ formatCurrency(itemsTotalRevenue.idrTotal, "IDR") }}
                          </p>
                        </div>
                        <FileText class="w-4 h-4 text-[#012D5A] opacity-60" />
                      </div>
                      <p
                        v-if="itemsTotalRevenue.hasUsd && itemsTotalRevenue.hasRate"
                        class="text-[9px] text-muted-foreground font-bold mt-1"
                      >
                        Original USD:
                        <span class="text-slate-500 font-extrabold">{{
                          formatCurrency(itemsTotalRevenue.usdTotal, "USD")
                        }}</span>
                      </p>
                    </div>
                    <div
                      class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <span
                            class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                            >Quotation Invoices</span
                          >
                          <p class="text-lg font-black text-[#012D5A] mt-1.5">
                            {{ quotationInvoices.length }}
                          </p>
                        </div>
                        <Receipt class="w-4 h-4 text-[#012D5A] opacity-60" />
                      </div>
                      <p class="text-[9px] text-muted-foreground font-bold mt-1">
                        Customer-facing invoice docs
                      </p>
                    </div>
                    <div
                      class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <span
                            class="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
                            >Job Invoices</span
                          >
                          <p class="text-lg font-black text-[#012D5A] mt-1.5">
                            {{ relatedInvoices.length }}
                          </p>
                        </div>
                        <Receipt class="w-4 h-4 text-[#012D5A] opacity-60" />
                      </div>
                      <p class="text-[9px] text-muted-foreground font-bold mt-1">
                        Converted to jobs
                      </p>
                    </div>
                  </div>

                  <!-- Quotation Invoices -->
                  <div v-if="!showQInvDetail">
                    <div class="flex items-center justify-between mb-3">
                      <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                        <Receipt class="w-4 h-4" /> Quotation Invoices
                      </h3>
                      <button
                        v-if="canManage && quotation?.status !== 'CONVERTED'"
                        @click="openCreateInvoiceForm"
                        class="inline-flex items-center px-3 py-1.5 bg-[#012D5A] text-white text-xs font-semibold rounded-md hover:bg-[#012D5A]/90 transition-colors gap-1.5 shadow-sm"
                      >
                        <Plus class="w-3.5 h-3.5" />
                        Create Invoice
                      </button>
                    </div>

                    <div
                      v-if="quotationInvoices.length === 0"
                      class="border border-dashed border-border rounded-2xl p-8 text-center bg-white"
                    >
                      <Receipt class="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                      <p class="text-sm font-semibold text-foreground mb-1">
                        No quotation invoices yet
                      </p>
                      <p
                        class="text-xs text-muted-foreground max-w-[300px] mx-auto leading-relaxed"
                      >
                        Create customer-facing invoices from this quotation's charges. Each invoice
                        groups selected charges into a printable document.
                      </p>
                    </div>

                    <div v-else class="space-y-3">
                      <div
                        v-for="qinv in quotationInvoices"
                        :key="qinv.id"
                        @click="openQInvDetail(qinv)"
                        class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex gap-4">
                            <div
                              class="w-10 h-10 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0 border border-blue-100"
                            >
                              <FileText class="w-5 h-5" />
                            </div>
                            <div>
                              <div class="flex items-center gap-2">
                                <span
                                  class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors"
                                  >{{ qinv.number || "—" }}</span
                                >
                                <span
                                  class="text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200"
                                  >Invoice</span
                                >
                              </div>
                              <p class="text-xs text-muted-foreground mt-1">
                                {{ qinv.items?.length || 0 }} charge(s)
                              </p>
                            </div>
                          </div>
                          <div class="flex items-start gap-3" @click.stop>
                            <div class="text-right shrink-0">
                              <p
                                class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
                              >
                                Total
                              </p>
                              <p class="font-black text-sm text-[#012D5A] whitespace-nowrap">
                                {{ formatCurrency(qinv.total, "IDR") }}
                              </p>
                            </div>
                            <div
                              v-if="canManage && quotation?.status !== 'CONVERTED'"
                              class="relative"
                            >
                              <button
                                @click.stop="
                                  showQInvActions =
                                    showQInvActions === qinv.id ? null : (qinv.id ?? null)
                                "
                                class="p-1.5 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal class="w-4 h-4" />
                              </button>
                              <div
                                v-if="showQInvActions === qinv.id"
                                @click.stop
                                class="absolute right-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-2xl z-50 py-1.5 flex flex-col"
                              >
                                <div class="px-3 py-1.5 border-b border-border/50 mb-1">
                                  <p
                                    class="text-[9px] font-black uppercase tracking-widest text-muted-foreground"
                                  >
                                    Manage Invoice
                                  </p>
                                </div>
                                <button
                                  @click="openEditInvoiceForm(qinv)"
                                  class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors"
                                >
                                  <Pencil class="w-4 h-4 text-primary" />
                                  Edit Invoice
                                </button>
                                <button
                                  @click="
                                    handleDeleteInvoice(qinv.id);
                                    showQInvActions = null;
                                  "
                                  class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors"
                                >
                                  <Trash2 class="w-4 h-4" />
                                  Delete Invoice
                                </button>
                              </div>
                              <div
                                v-if="showQInvActions === qinv.id"
                                @click="showQInvActions = null"
                                class="fixed inset-0 z-40"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Invoice Detail View -->
                  <div v-else class="space-y-6">
                    <div
                      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6"
                    >
                      <div class="flex items-start gap-4">
                        <button
                          @click="closeQInvDetail"
                          class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                        >
                          <ArrowLeft class="w-5 h-5" />
                        </button>
                        <div class="flex flex-col gap-2 mt-1">
                          <h1 class="text-2xl font-bold text-foreground leading-none">
                            {{ activeQInvDetail?.number || "—" }}
                          </h1>
                          <p class="text-sm text-muted-foreground leading-none mb-1">
                            {{ activeQInvDetail?.items?.length || 0 }} charge(s) ·
                            {{ quotation?.customerName || "—" }}
                          </p>
                          <span
                            class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200 w-fit"
                            >Quotation Invoice</span
                          >
                        </div>
                      </div>
                      <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
                        <button
                          @click="handleGenerateQInvPDF"
                          :disabled="isGeneratingQInvPDF"
                          class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <Loader2 v-if="isGeneratingQInvPDF" class="w-3.5 h-3.5 animate-spin" />
                          <Download v-else class="w-3.5 h-3.5" />
                          {{ isGeneratingQInvPDF ? "Generating..." : "Download PDF" }}
                        </button>
                        <div v-if="canManage && quotation?.status !== 'CONVERTED'" class="relative">
                          <button
                            @click="showQInvDetailActions = !showQInvDetailActions"
                            class="p-2 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white shadow-sm flex items-center justify-center w-9 h-9"
                          >
                            <MoreHorizontal class="w-4 h-4" />
                          </button>

                          <div
                            v-if="showQInvDetailActions"
                            @click="showQInvDetailActions = false"
                            class="fixed inset-0 z-40"
                          ></div>

                          <div
                            v-if="showQInvDetailActions"
                            class="absolute right-0 mt-3 w-52 bg-white border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 origin-top-right py-1.5 flex flex-col"
                          >
                            <div
                              class="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between gap-2"
                            >
                              <p
                                class="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0"
                              >
                                Manage Invoice
                              </p>
                              <span
                                class="text-[8px] font-mono text-muted-foreground opacity-50 truncate"
                              >
                                #{{ activeQInvDetail?.number || "DRAFT" }}
                              </span>
                            </div>

                            <button
                              @click="
                                activeQInvDetail && openEditInvoiceForm(activeQInvDetail);
                                showQInvDetailActions = false;
                              "
                              class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
                            >
                              <Pencil class="w-4 h-4 text-primary" />
                              Edit Invoice Settings
                            </button>

                            <button
                              @click="
                                handleDeleteInvoice(activeQInvDetail?.id);
                                showQInvDetailActions = false;
                              "
                              class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none"
                            >
                              <Trash2 class="w-4 h-4" />
                              Delete Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <QuotationInvoicePreview
                      v-if="quotation && activeQInvDetail"
                      ref="qinvPreviewRef"
                      :quotation="quotation"
                      :invoice="activeQInvDetail"
                    />
                  </div>
                </div>

                <!-- Tab 3: Costing & Profit -->
                <div v-else-if="activeTab === 'costing'" class="animate-fade-in">
                  <QuotationCostingTab
                    v-if="quotation"
                    :quotation="quotation"
                    :editable="canEditCosting"
                  />
                </div>

                <!-- Tab: Usage (Invoice & Job Traceability) -->
                <div v-else-if="activeTab === 'usage'" class="space-y-8 animate-fade-in">
                  <div>
                    <h3 class="text-base font-bold text-foreground">Usage & Traceability</h3>
                    <p class="text-[11px] text-muted-foreground mt-0.5 max-w-lg">
                      Lacak invoice yang dibuat dari quotation ini, termasuk multi-use status dan
                      riwayat konversi ke job.
                    </p>
                  </div>
                  <!-- Multi-use Status -->
                  <div class="bg-white border border-border rounded-2xl p-6 shadow-sm">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <div class="flex items-center gap-2">
                          <h3 class="text-sm font-bold text-foreground">Multi-use Quotation</h3>
                          <span
                            class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border"
                            :class="
                              isMultiUse
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            "
                          >
                            {{ isMultiUse ? "ENABLED" : "DISABLED" }}
                          </span>
                        </div>
                        <p class="text-xs text-muted-foreground mt-1 max-w-md">
                          {{
                            isMultiUse
                              ? "This quotation can be converted into multiple invoices across different jobs."
                              : "This quotation can only be converted once. After first conversion it becomes locked for further invoicing."
                          }}
                        </p>
                      </div>
                      <div
                        class="px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shrink-0"
                        :class="
                          isMultiUse
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        "
                      >
                        <span>{{ relatedInvoices.length }}</span>
                        <span class="font-medium"
                          >invoice{{ relatedInvoices.length !== 1 ? "s" : "" }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Related Invoices -->
                  <div>
                    <h3 class="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <Receipt class="w-4 h-4" />
                      Invoices Created from this Quotation
                    </h3>

                    <div
                      v-if="relatedInvoices.length === 0"
                      class="border border-dashed border-border rounded-2xl p-8 text-center bg-white"
                    >
                      <Receipt class="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                      <p class="text-sm font-medium text-muted-foreground">No invoices yet</p>
                      <p class="text-xs text-muted-foreground mt-1">
                        This quotation has not been converted into any invoice.
                      </p>
                    </div>

                    <div
                      v-else
                      class="border border-border rounded-2xl overflow-hidden bg-white shadow-sm"
                    >
                      <table class="w-full text-sm">
                        <thead>
                          <tr
                            class="border-b border-border bg-gray-50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                          >
                            <th class="py-3 px-6 text-left">Invoice</th>
                            <th class="py-3 px-4 text-left">Job</th>
                            <th class="py-3 px-4 text-left">Date</th>
                            <th class="py-3 px-4 text-right">Amount</th>
                            <th class="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-border/50">
                          <tr
                            v-for="inv in relatedInvoices"
                            :key="inv.id"
                            class="hover:bg-muted/30 transition-colors"
                          >
                            <td class="py-4 px-6">
                              <span class="font-semibold text-[#012D5A]">{{
                                inv.invoiceNumber
                              }}</span>
                            </td>
                            <td class="py-4 px-4">
                              <span v-if="inv.jobNumber" class="font-medium text-foreground">
                                {{ inv.jobNumber }}
                              </span>
                              <span v-else class="text-muted-foreground italic text-xs">—</span>
                            </td>
                            <td class="py-4 px-4 text-xs text-muted-foreground">
                              {{ inv.createdAt ? formatDate(inv.createdAt) : "—" }}
                            </td>
                            <td class="py-4 px-4 text-right font-semibold text-foreground">
                              {{ formatCurrency(inv.total || 0, inv.currency) }}
                            </td>
                            <td class="py-4 px-6">
                              <div class="flex justify-center">
                                <span
                                  class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border"
                                  :class="getStatusBadgeClass(inv.status)"
                                >
                                  {{ inv.status || "—" }}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p class="text-[10px] text-muted-foreground px-1">
                    This section shows all invoices that were created using this quotation as the
                    source.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Quotation Invoice Form Modal -->
  <Modal
    v-model="showInvoiceForm"
    :title="editingInvoice ? 'Edit Quotation Invoice' : 'Create Quotation Invoice'"
    :description="
      editingInvoice
        ? 'Modify the customer-facing quotation invoice.'
        : 'Create a new customer-facing invoice document from quotation charges.'
    "
    width="2xl"
  >
    <QuotationInvoiceForm
      v-if="quotation"
      :invoice="editingInvoice"
      :is-saving="isCreatingInvoice"
      :next-number="nextInvoiceNumber"
      :quotation-currency="quotation.currency || 'IDR'"
      :quotation-exchange-rate="Number(quotation.exchangeRate || 1)"
      @submit="handleInvoiceFormSubmit"
      @cancel="showInvoiceForm = false"
    />
  </Modal>
</template>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-over-enter-from,
.slide-over-leave-to {
  opacity: 0;
}

.slide-over-enter-active .slide-panel,
.slide-over-leave-active .slide-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-over-enter-from .slide-panel,
.slide-over-leave-to .slide-panel {
  transform: translateX(100%);
}
</style>
