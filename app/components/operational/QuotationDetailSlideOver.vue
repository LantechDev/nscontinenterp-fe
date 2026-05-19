<script setup lang="ts">
import { cn } from "~/lib/utils";
import {
  X,
  FileText,
  Calendar,
  Loader2,
  Settings,
  CheckCircle2,
  CalendarClock,
  Edit,
  DollarSign,
  TrendingUp,
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
} from "lucide-vue-next";
import { useQuotations, type Quotation, type QuotationCharge } from "~/composables/useQuotations";
import { useFinanceTax } from "~/composables/useFinanceTax";
import { toast } from "vue-sonner";
import QuotationPreview from "./QuotationPreview.vue";

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

const { currentQuotation, getQuotation, updateQuotation, isLoading } = useQuotations();
const { confirm } = useConfirm();
const { fetchTaxes } = useFinanceTax();
const router = useRouter();

const activeTab = ref("overview");
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Quotation Items & Pricing" },
  { id: "pdf", label: "PDF Preview" },
];

const isConverting = ref(false);
const isUpdatingStatus = ref(false);
const isGeneratingPDF = ref(false);
const previewRef = ref<InstanceType<typeof QuotationPreview> | null>(null);
const taxesList = ref<Array<{ id: string; name: string; rate: number }>>([]);

const quotation = computed(() => currentQuotation.value);

const getPol = computed(() => quotation.value?.polName || quotation.value?.pol || "-");
const getPod = computed(() => quotation.value?.podName || quotation.value?.pod || "-");

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
  if (!taxId) return 0;
  const tax = taxesList.value.find((t) => t.id === taxId);
  return tax ? tax.rate : 0;
};

const handleGeneratePDF = async () => {
  if (!previewRef.value) return;
  isGeneratingPDF.value = true;
  try {
    await previewRef.value.generatePDF();
  } finally {
    isGeneratingPDF.value = false;
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
                v-if="quotation && quotation.status !== 'CONVERTED'"
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

                  <!-- Quotation Header Info Cards Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- PIC info -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <Users class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          PIC Customer
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">
                          {{ quotation.picName || "-" }}
                        </p>
                      </div>
                    </div>

                    <!-- Sales representative -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <User class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Sales Representative
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">
                          {{ quotation.salesName || "-" }}
                        </p>
                      </div>
                    </div>

                    <!-- Free Time -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <Timer class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Free Time
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">
                          {{ quotation.freeTime || "-" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Routing & Cargo Details -->
                  <div
                    v-if="
                      quotation.pol || quotation.pod || quotation.containerTypeId || quotation.term
                    "
                    class="grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    <!-- POL -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <Building2 class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Port of Loading (POL)
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">{{ getPol }}</p>
                      </div>
                    </div>

                    <!-- POD -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <Building2 class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Port of Discharge (POD)
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">{{ getPod }}</p>
                      </div>
                    </div>

                    <!-- Container Type -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <Package class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Container Type
                        </p>
                        <p class="text-sm font-bold text-foreground truncate">
                          {{ quotation.containerTypeName || "-" }}
                        </p>
                      </div>
                    </div>

                    <!-- Term -->
                    <div
                      class="bg-white border border-border rounded-xl p-4 shadow-sm flex items-start gap-3"
                    >
                      <div class="p-2.5 bg-blue-50 text-[#012D5A] rounded-lg shrink-0">
                        <FileText class="w-5 h-5" />
                      </div>
                      <div class="space-y-0.5 min-w-0">
                        <p
                          class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Term
                        </p>
                        <p class="text-sm font-bold text-foreground truncate font-mono uppercase">
                          {{ quotation.term || "-" }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Quotation Workflow Actions Panel -->
                  <section
                    v-if="quotation.status !== 'CONVERTED'"
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

                <!-- Tab 2: Pricing Charges -->
                <div v-else-if="activeTab === 'items'" class="space-y-6 animate-fade-in">
                  <!-- Tabular service lines list -->
                  <div class="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                    <table class="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr
                          class="border-b border-border bg-gray-50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                        >
                          <th class="py-3.5 px-6">Service / Description</th>
                          <th class="py-3.5 px-4 text-center">Qty</th>
                          <th class="py-3.5 px-4 text-right">Unit Price</th>
                          <th class="py-3.5 px-4 text-right">Tax Rate</th>
                          <th class="py-3.5 px-6 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border/50">
                        <tr
                          v-for="(ch, idx) in quotation.charges"
                          :key="ch.id || idx"
                          class="hover:bg-gray-50/50 transition-colors"
                        >
                          <td class="py-4 px-6">
                            <p class="font-bold text-[#012D5A] text-sm">
                              {{ ch.serviceName || "Service Item" }}
                            </p>
                            <p class="text-xs text-muted-foreground mt-0.5 whitespace-pre-line">
                              {{ ch.description || "-" }}
                            </p>
                          </td>
                          <td class="py-4 px-4 text-center font-semibold text-foreground">
                            {{ ch.quantity }}
                          </td>
                          <td class="py-4 px-4 text-right font-medium text-foreground">
                            {{ formatCurrency(ch.unitPrice, quotation.currency) }}
                          </td>
                          <td class="py-4 px-4 text-right text-xs font-semibold text-slate-400">
                            {{ getTaxRate(ch.taxId) }}%
                          </td>
                          <td class="py-4 px-6 text-right font-bold text-[#012D5A]">
                            {{
                              formatCurrency(
                                Number(ch.quantity || 1) *
                                  Number(ch.unitPrice || 0) *
                                  (1 + getTaxRate(ch.taxId) / 100),
                                quotation.currency,
                              )
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Totals computation block -->
                  <div class="flex justify-end pt-2">
                    <div
                      class="w-80 space-y-3 bg-white p-5 rounded-xl border border-border shadow-sm"
                    >
                      <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground font-medium">Subtotal</span>
                        <span class="font-bold text-foreground">{{
                          formatCurrency(quotation.subTotal || 0, quotation.currency)
                        }}</span>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-muted-foreground font-medium">Total Tax</span>
                        <span class="font-bold text-foreground">{{
                          formatCurrency(quotation.taxTotal || 0, quotation.currency)
                        }}</span>
                      </div>
                      <div class="flex justify-between border-t border-border pt-3 mt-3">
                        <span class="font-bold text-[#012D5A] text-base">Grand Total</span>
                        <span class="font-extrabold text-[#012D5A] text-xl">{{
                          formatCurrency(quotation.total || 0, quotation.currency)
                        }}</span>
                      </div>
                      <div
                        v-if="quotation.currency === 'USD'"
                        class="flex justify-between border-t border-border/50 pt-2.5 mt-1.5 italic"
                      >
                        <span class="text-[10px] font-bold text-muted-foreground uppercase"
                          >IDR Equivalent</span
                        >
                        <span class="text-[10px] font-black text-[#012D5A]">
                          {{
                            new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format((quotation.total || 0) * (quotation.exchangeRate || 1))
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tab 3: PDF Printable Layout -->
                <div v-else-if="activeTab === 'pdf'" class="space-y-4 animate-fade-in">
                  <div
                    class="flex items-center justify-between bg-white border border-border p-4 rounded-xl shadow-sm"
                  >
                    <div>
                      <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Quotation PDF Printout
                      </h4>
                      <p class="text-xs text-muted-foreground mt-0.5">
                        Generate high-fidelity legal PDF for client acceptance.
                      </p>
                    </div>
                    <button
                      @click="handleGeneratePDF"
                      :disabled="isGeneratingPDF"
                      class="inline-flex items-center px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white text-xs font-bold rounded-lg shadow-sm gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Loader2
                        v-slot:default
                        v-if="isGeneratingPDF"
                        class="w-3.5 h-3.5 animate-spin"
                      />
                      <Download v-else class="w-3.5 h-3.5" />
                      <span>{{ isGeneratingPDF ? "Generating" : "Download Proposal PDF" }}</span>
                    </button>
                  </div>

                  <QuotationPreview ref="previewRef" :quotation="quotation" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
