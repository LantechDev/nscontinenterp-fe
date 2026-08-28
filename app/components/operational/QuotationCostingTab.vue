<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Plus,
  Wallet,
  Receipt,
  Loader2,
  Download,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  Printer,
  ArrowLeft,
  Eye,
  MoreHorizontal,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import Modal from "~/components/ui/Modal.vue";
import QuotationCostForm from "./QuotationCostForm.vue";
import QuotationCostingPreview from "./QuotationCostingPreview.vue";
import QuotationCostDetailPreview from "./QuotationCostDetailPreview.vue";
import { useQuotations, type Quotation, type QuotationCost } from "~/composables/useQuotations";
import { useCompanies } from "~/composables/useCompanies";
import { formatCurrencyAmount } from "~/utils/currency";
import { renderElementPdf } from "~/utils/pdfRender";
import {
  calculateQuotationProfitSummary,
  groupCostTotals,
  type ProfitSummary,
} from "~/utils/quotationCost";

const props = defineProps<{
  quotation: Quotation;
  editable: boolean;
}>();

const { updateQuotationCosts } = useQuotations();
const { companies, fetchCompanies } = useCompanies();

const costs = ref<QuotationCost[]>([]);
const isSaving = ref(false);

const showForm = ref(false);
const editingCost = ref<QuotationCost | null>(null);
const editingIndex = ref<number | null>(null);

const costingSubTab = ref<"ap" | "profit">("ap");

const showCostDetail = ref(false);
const activeCostDetail = ref<QuotationCost | null>(null);
const costDetailPreviewRef = ref<InstanceType<typeof QuotationCostDetailPreview> | null>(null);
const showCostActions = ref(false);
const fallbackExchangeRate = ref<number | null>(null);

const openCostDetail = (cost: QuotationCost) => {
  activeCostDetail.value = cost;
  showCostDetail.value = true;
  showCostActions.value = false;
};

const closeCostDetail = () => {
  activeCostDetail.value = null;
  showCostDetail.value = false;
  showCostActions.value = false;
};

const isGeneratingCostPDF = ref(false);
const handleGenerateCostPDF = async () => {
  if (!costDetailPreviewRef.value) return;
  isGeneratingCostPDF.value = true;
  try {
    await costDetailPreviewRef.value.generatePDF();
  } finally {
    isGeneratingCostPDF.value = false;
  }
};

const previewRef = ref<InstanceType<typeof QuotationCostingPreview> | null>(null);
const isGeneratingPDF = ref(false);

const costPrintRef = ref<HTMLElement | null>(null);
const isPrintingCost = ref(false);
const printingCostIdx = ref<number | null>(null);

const printingCost = computed<QuotationCost | null>(() => {
  if (printingCostIdx.value === null) return null;
  return costs.value[printingCostIdx.value] || null;
});

const handlePrintCost = async (cost: QuotationCost, idx: number) => {
  printingCostIdx.value = idx;
  isPrintingCost.value = true;
  try {
    if (!costPrintRef.value) return;
    const fileName = cost.number
      ? `cost-${cost.number.replace(/[/\\?%*:|"<>]/g, "-")}.pdf`
      : `cost-${vendorName(cost).replace(/\s+/g, "-").toLowerCase()}.pdf`;
    await renderElementPdf(costPrintRef.value, fileName);
    toast.success("Cost PDF berhasil diunduh.");
  } catch (err) {
    console.error("Failed to print cost PDF:", err);
    toast.error("Gagal mencetak cost PDF.");
  } finally {
    isPrintingCost.value = false;
    printingCostIdx.value = null;
  }
};

const loadFromQuotation = () => {
  costs.value = (props.quotation.costs || []).map((c) => ({ ...c }));
};

watch(() => props.quotation.id, loadFromQuotation, { immediate: true });
watch(() => props.quotation.costs, loadFromQuotation);

onMounted(() => {
  fetchCompanies({ type: "VENDOR", limit: 500 });
});

const formatCurrency = (amount: number, currency = "IDR") => formatCurrencyAmount(amount, currency);

const vendorName = (cost: QuotationCost) => {
  if (cost.vendorId) {
    const found = companies.value.find((c) => c.id === cost.vendorId);
    if (found) return found.name;
  }
  return cost.vendorName || "No Vendor";
};

const costDescription = (cost: QuotationCost) => {
  const items = cost.items || [];
  if (items.length === 0) return "-";
  const first = items[0]?.description || "-";
  return items.length > 1 ? `${first} +${items.length - 1} more` : first;
};

const costCurrencies = (cost: QuotationCost) => {
  const set = new Set((cost.items || []).map((it) => it.currency || "IDR"));
  return Array.from(set);
};

const hasUsdItem = (cost: QuotationCost) =>
  (cost.items || []).some((it) => (it.currency || "IDR") === "USD");

const usdTotal = (cost: QuotationCost) => {
  const totals = groupCostTotals(cost.items || [], cost.taxRate || 0);
  return totals.USD?.total || 0;
};

const needsEstimateExchangeRate = computed(() => {
  if (Number(props.quotation.exchangeRate || 1) > 1) return false;
  if (props.quotation.currency === "USD") return true;
  if (
    (props.quotation.charges || []).some((charge) => !charge.currency || charge.currency === "USD")
  )
    return true;
  return costs.value.some((cost) => hasUsdItem(cost) && Number(cost.exchangeRate || 1) <= 1);
});

const loadFallbackExchangeRate = async () => {
  if (!needsEstimateExchangeRate.value || fallbackExchangeRate.value) return;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) fallbackExchangeRate.value = res.rate;
  } catch {
    // Silent fallback: costing still shows saved currency buckets if API rate is unavailable.
  }
};

watch(needsEstimateExchangeRate, loadFallbackExchangeRate, { immediate: true });

const previewCosts = computed<QuotationCost[]>(() =>
  costs.value.map((c) => ({ ...c, vendorName: vendorName(c) })),
);

// ---------- Profit analysis ----------
const profitSummary = computed<ProfitSummary>(() =>
  calculateQuotationProfitSummary(props.quotation, costs.value, {
    fallbackExchangeRate: fallbackExchangeRate.value,
  }),
);

const netProfitTitle = computed(() =>
  profitSummary.value.isEstimated ? "Estimate Net Profit (IDR eq.)" : "Net Profit (IDR eq.)",
);

const currencyCards = computed(() =>
  Object.entries(profitSummary.value.byCurrency).filter(([, b]) => b.revenue !== 0 || b.cost !== 0),
);

const totalCostIDR = computed(() => profitSummary.value.combined.costIDR);

const totalCostUSD = computed(() => {
  return costs.value.reduce((sum, c) => sum + usdTotal(c), 0);
});

const usdRevenue = computed(() => {
  return profitSummary.value.byCurrency.USD?.revenue || 0;
});

// ---------- Persistence ----------
const persist = async (list: QuotationCost[]) => {
  isSaving.value = true;
  const payload: QuotationCost[] = list.map((c) => ({
    number: c.number ?? null,
    vendorId: c.vendorId ?? null,
    vendorName: c.vendorName ?? null,
    categoryId: c.categoryId ?? null,
    date: c.date ?? null,
    exchangeRate: Number(c.exchangeRate || 1),
    taxId: c.taxId ?? null,
    subTotal: Number(c.subTotal || 0),
    taxTotal: Number(c.taxTotal || 0),
    amount: Number(c.amount || 0),
    notes: c.notes ?? null,
    items: (c.items || []).map((it) => ({
      serviceId: it.serviceId ?? null,
      description: it.description,
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unitPrice || 0),
      currency: it.currency || "IDR",
      amount: Number(it.amount || Number(it.quantity || 0) * Number(it.unitPrice || 0)),
    })),
  }));
  const res = await updateQuotationCosts(props.quotation.id, payload);
  isSaving.value = false;
  return res;
};

const openCreate = () => {
  editingCost.value = null;
  editingIndex.value = null;
  showForm.value = true;
};

const openEdit = (cost: QuotationCost, idx: number) => {
  editingCost.value = cost;
  editingIndex.value = idx;
  showForm.value = true;
  showCostActions.value = false;
};

const handleFormSubmit = async (payload: QuotationCost) => {
  const next = [...costs.value];
  if (editingIndex.value !== null) next[editingIndex.value] = payload;
  else next.push(payload);

  const res = await persist(next);
  if (res.success) {
    toast.success(editingIndex.value !== null ? "Costing diperbarui." : "Costing ditambahkan.");
    showForm.value = false;
    editingCost.value = null;
    editingIndex.value = null;
  } else {
    toast.error(res.error || "Gagal menyimpan costing.");
  }
};

const handleDelete = async (idx: number) => {
  if (idx < 0) return;
  const next = costs.value.filter((_, i) => i !== idx);
  const res = await persist(next);
  if (res.success) toast.success("Cost dihapus.");
  else toast.error(res.error || "Gagal menghapus costing.");
  showCostActions.value = false;
};

const handlePrint = async () => {
  await nextTick();
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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-foreground">Costing (Internal)</h3>
        <p class="text-[11px] text-muted-foreground mt-0.5 max-w-lg">
          Biaya vendor untuk quotation ini (sisi AP). Internal — tidak tampil di PDF client.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="editable"
          @click="openCreate"
          class="inline-flex items-center px-3 py-1.5 bg-[#012D5A] text-white text-xs font-semibold rounded-md hover:bg-[#012D5A]/90 transition-colors gap-1.5 shadow-sm uppercase tracking-wider"
        >
          <Plus class="w-3.5 h-3.5" />
          Record Cost
        </button>
      </div>
    </div>

    <!-- Profit summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- Case A: Kurs Terkonfigurasi (Exchange Rate > 1) -->
      <template v-if="Number(props.quotation.exchangeRate || 1) > 1">
        <!-- Card 1: Total Revenue -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div>
            <span class="text-[10px] font-black text-[#012D5A] uppercase tracking-widest">
              Total Revenue
            </span>
            <p class="text-lg font-black text-[#012D5A] mt-1.5">
              {{ formatCurrency(profitSummary.combined.revenueIDR, "IDR") }}
            </p>
          </div>
          <p v-if="usdRevenue > 0" class="text-[9px] text-muted-foreground font-bold mt-1">
            Original USD:
            <span class="text-slate-500 font-extrabold">{{
              formatCurrency(usdRevenue, "USD")
            }}</span>
          </p>
        </div>

        <!-- Card 2: Total Cost -->
        <div
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between min-h-[110px]"
        >
          <div>
            <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Total Cost
            </span>
            <p class="text-lg font-black text-rose-600 mt-1.5">
              {{ formatCurrency(profitSummary.combined.costIDR, "IDR") }}
            </p>
          </div>
          <p v-if="totalCostUSD > 0" class="text-[9px] text-muted-foreground font-bold mt-1">
            Original USD:
            <span class="text-slate-500 font-extrabold">{{
              formatCurrency(totalCostUSD, "USD")
            }}</span>
          </p>
        </div>

        <!-- Card 3: Net Profit -->
        <div
          class="rounded-xl p-4 shadow-sm text-white flex flex-col justify-between min-h-[110px]"
          :class="profitSummary.combined.profitIDR >= 0 ? 'bg-[#012D5A]' : 'bg-rose-700'"
        >
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-white/70">
              {{ netProfitTitle }}
            </p>
            <p class="text-xl font-black mt-1">
              {{ formatCurrency(profitSummary.combined.profitIDR, "IDR") }}
            </p>
          </div>
          <div class="flex items-center gap-1 text-[11px] text-white/95 mt-1.5 font-bold">
            <TrendingUp
              v-if="profitSummary.combined.profitIDR >= 0"
              class="w-3.5 h-3.5 text-emerald-400 shrink-0"
            />
            <TrendingDown v-else class="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Margin {{ profitSummary.combined.marginIDR.toFixed(1) }}%</span>
          </div>
        </div>
      </template>

      <!-- Case B: Kurs Tidak Terkonfigurasi -->
      <template v-else>
        <div
          v-for="[curr, b] in currencyCards"
          :key="curr"
          class="border border-border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
        >
          <div>
            <div class="text-[10px] font-extrabold text-[#012D5A] uppercase tracking-wider mb-2">
              {{ curr }} Margin
            </div>
            <div class="flex justify-between text-xs py-0.5">
              <span class="text-muted-foreground">Revenue</span>
              <span class="font-semibold">{{ formatCurrency(b.revenue, curr) }}</span>
            </div>
            <div class="flex justify-between text-xs py-0.5">
              <span class="text-muted-foreground">Cost</span>
              <span class="font-semibold text-red-600">{{ formatCurrency(b.cost, curr) }}</span>
            </div>
          </div>
          <div
            class="flex justify-between text-sm font-bold pt-1.5 mt-1.5 border-t border-dashed border-border"
            :class="b.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'"
          >
            <span class="flex items-center gap-1">
              <TrendingUp v-if="b.profit >= 0" class="w-3.5 h-3.5" />
              <TrendingDown v-else class="w-3.5 h-3.5" />
              {{ b.margin.toFixed(1) }}%
            </span>
            <span>{{ formatCurrency(b.profit, curr) }}</span>
          </div>
        </div>

        <div
          class="rounded-xl p-4 shadow-sm text-white flex flex-col justify-between"
          :class="profitSummary.combined.profitIDR >= 0 ? 'bg-[#012D5A]' : 'bg-rose-700'"
        >
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-white/70">
              {{ netProfitTitle }}
            </p>
            <p class="text-xl font-black mt-1">
              {{ formatCurrency(profitSummary.combined.profitIDR, "IDR") }}
            </p>
          </div>
          <p class="text-[11px] text-white/80 mt-1">
            Margin {{ profitSummary.combined.marginIDR.toFixed(1) }}% · Cost
            {{ formatCurrency(totalCostIDR, "IDR") }}
          </p>
        </div>
      </template>
    </div>

    <!-- Sub-tab Navigation -->
    <div class="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl w-fit border border-gray-200">
      <button
        @click="costingSubTab = 'ap'"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
        :class="
          costingSubTab === 'ap'
            ? 'bg-white text-red-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <ArrowDownLeft class="w-3.5 h-3.5" />
        Vendor Costs (A/P)
      </button>
      <button
        @click="costingSubTab = 'profit'"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
        :class="
          costingSubTab === 'profit'
            ? 'bg-white text-emerald-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
      >
        <TrendingUp class="w-3.5 h-3.5" />
        Profit Analysis
      </button>
    </div>

    <!-- A/P: Vendor Costs -->
    <div v-if="costingSubTab === 'ap'" class="animate-fade-in">
      <!-- Cost Detail View -->
      <div v-if="showCostDetail && activeCostDetail" class="space-y-6">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6"
        >
          <div class="flex items-start gap-4">
            <button
              @click="closeCostDetail"
              class="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div class="flex flex-col gap-2 mt-1">
              <h1 class="text-2xl font-bold text-foreground leading-none">
                {{ vendorName(activeCostDetail) }}
              </h1>
              <p class="text-sm text-muted-foreground leading-none mb-1">
                {{ activeCostDetail.number || "VCOST" }} ·
                {{ (activeCostDetail.items || []).length }} item(s)
              </p>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-red-50 text-red-700 border-red-200 w-fit"
                >Vendor Cost</span
              >
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
            <button
              @click="handleGenerateCostPDF"
              :disabled="isGeneratingCostPDF"
              class="px-4 py-2 bg-[#012D5A] hover:bg-[#012D5A]/90 text-white rounded-md shadow-sm text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="isGeneratingCostPDF" class="w-3.5 h-3.5 animate-spin" />
              <Download v-else class="w-3.5 h-3.5" />
              {{ isGeneratingCostPDF ? "Generating..." : "Download PDF" }}
            </button>
            <div v-if="editable" class="relative">
              <button
                @click="showCostActions = !showCostActions"
                class="p-2 rounded-lg hover:bg-muted border border-border transition-colors text-muted-foreground hover:text-foreground bg-white shadow-sm flex items-center justify-center w-9 h-9"
              >
                <MoreHorizontal class="w-4 h-4" />
              </button>

              <div
                v-if="showCostActions"
                @click="showCostActions = false"
                class="fixed inset-0 z-40"
              ></div>

              <div
                v-if="showCostActions"
                class="absolute right-0 mt-3 w-52 bg-white border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200 origin-top-right py-1.5 flex flex-col"
              >
                <div
                  class="px-3 py-2 border-b border-border/50 mb-1 flex items-center justify-between gap-2"
                >
                  <p
                    class="text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0"
                  >
                    Manage Cost
                  </p>
                  <span class="text-[8px] font-mono text-muted-foreground opacity-50 truncate">
                    #{{ activeCostDetail.number || "VCOST" }}
                  </span>
                </div>

                <button
                  @click="
                    openEdit(
                      activeCostDetail,
                      costs.findIndex((c) => c === activeCostDetail),
                    );
                    showCostActions = false;
                  "
                  class="w-full text-left px-4 py-2.5 hover:bg-muted/50 flex items-center gap-3 text-xs font-bold text-foreground transition-colors border-none bg-transparent outline-none"
                >
                  <Pencil class="w-4 h-4 text-primary" />
                  Edit Cost Settings
                </button>

                <button
                  :disabled="isSaving"
                  @click="
                    handleDelete(costs.findIndex((c) => c === activeCostDetail));
                    closeCostDetail();
                  "
                  class="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center gap-3 text-xs font-bold text-red-600 transition-colors border-none bg-transparent outline-none disabled:opacity-50"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete Cost
                </button>
              </div>
            </div>
          </div>
        </div>
        <QuotationCostDetailPreview
          v-if="quotation && activeCostDetail"
          ref="costDetailPreviewRef"
          :quotation="quotation"
          :cost="activeCostDetail"
          :vendor-name="vendorName(activeCostDetail)"
        />
      </div>

      <!-- Cost List -->
      <template v-if="!showCostDetail">
        <h4 class="text-sm font-bold text-foreground mb-3">Vendor Costs</h4>

        <div
          v-if="costs.length === 0"
          class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
        >
          <div
            class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
          >
            <Receipt class="w-6 h-6 text-muted-foreground opacity-40" />
          </div>
          <p class="text-sm font-semibold text-foreground mb-1">Belum ada biaya vendor</p>
          <p class="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
            Catat biaya vendor (shipping line, trucking, dsb.) untuk melihat analisa profit
            quotation ini.
          </p>
          <button
            v-if="editable"
            @click="openCreate"
            class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-lg text-[10px] font-bold text-[#012D5A] hover:bg-[#012D5A] hover:text-white transition-all uppercase tracking-widest shadow-sm"
          >
            <Plus class="w-3.5 h-3.5" /> Record First Cost
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(cost, idx) in costs"
            :key="cost.id || idx"
            @click="openCostDetail(cost)"
            class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer flex flex-col gap-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex gap-4">
                <div
                  class="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100"
                >
                  <Wallet class="w-5 h-5" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-foreground uppercase">{{
                      vendorName(cost)
                    }}</span>
                    <span
                      v-for="curr in costCurrencies(cost)"
                      :key="curr"
                      class="text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider bg-gray-100 text-gray-500 border-gray-200"
                      >{{ curr }}</span
                    >
                  </div>
                  <p
                    v-if="cost.number"
                    class="text-[10px] text-muted-foreground/70 mt-0.5 uppercase"
                  >
                    {{ cost.number }}
                  </p>
                  <p class="text-[10px] text-muted-foreground/70 mt-0.5">
                    <span class="font-bold">Quotation:</span> {{ props.quotation.number }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1 uppercase">
                    {{ costDescription(cost) }}
                  </p>
                  <p class="text-[10px] text-muted-foreground/70 mt-0.5">
                    {{ (cost.items || []).length }} item(s)
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="text-right">
                  <p
                    class="text-[9px] text-muted-foreground mb-0.5 uppercase tracking-widest font-bold opacity-70"
                  >
                    Total Cost
                  </p>
                  <template v-if="hasUsdItem(cost) && Number(cost.exchangeRate || 1) > 1">
                    <p class="font-black text-sm text-red-600 whitespace-nowrap">
                      {{ formatCurrency(cost.amount, "IDR") }}
                    </p>
                    <p class="text-[11px] font-bold text-slate-500 whitespace-nowrap mt-0.5">
                      {{ formatCurrency(usdTotal(cost), "USD") }}
                    </p>
                  </template>
                  <template v-else-if="hasUsdItem(cost)">
                    <p class="font-black text-sm text-red-600 whitespace-nowrap">
                      {{ formatCurrency(usdTotal(cost), "USD") }}
                    </p>
                  </template>
                  <template v-else>
                    <p class="font-black text-sm text-red-600 whitespace-nowrap">
                      {{ formatCurrency(cost.amount, "IDR") }}
                    </p>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Profit Analysis -->
    <div v-else-if="costingSubTab === 'profit'" class="animate-fade-in space-y-3 pt-2">
      <div
        class="flex items-center justify-between bg-white border border-border p-4 rounded-xl shadow-sm"
      >
        <div>
          <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Profit Report (Internal)
          </h4>
          <p class="text-xs text-muted-foreground mt-0.5">
            Laporan biaya vendor + analisa profit. Jangan dibagikan ke client.
          </p>
        </div>
        <button
          @click="handlePrint"
          :disabled="isGeneratingPDF"
          class="inline-flex items-center px-4 py-2 bg-[#062c58] hover:bg-[#062c58]/90 text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-md gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Loader2 v-if="isGeneratingPDF" class="w-4 h-4 animate-spin" />
          <Download v-else class="w-4 h-4" />
          {{ isGeneratingPDF ? "Generating" : "Download PDF" }}
        </button>
      </div>

      <QuotationCostingPreview
        ref="previewRef"
        :quotation="quotation"
        :costs="previewCosts"
        :profit="profitSummary"
      />
    </div>

    <!-- Hidden single-cost print container -->
    <div
      ref="costPrintRef"
      class="fixed left-[-9999px] top-0 w-[794px] bg-white"
      style="z-index: -1"
    >
      <div v-if="printingCost" class="p-10" style="font-family: Arial, sans-serif">
        <div class="mb-6">
          <h1 class="text-xl font-bold text-[#012D5A] mb-1">VENDOR COST DETAIL</h1>
          <p class="text-xs text-gray-500">Quotation: {{ quotation.number }}</p>
        </div>
        <div class="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-gray-500">Vendor:</span>
              <span class="font-bold ml-2">{{ vendorName(printingCost) }}</span>
            </div>
            <div v-if="printingCost.number">
              <span class="text-gray-500">Cost #:</span>
              <span class="font-bold ml-2">{{ printingCost.number }}</span>
            </div>
            <div v-if="printingCost.date">
              <span class="text-gray-500">Date:</span>
              <span class="font-bold ml-2">{{ printingCost.date }}</span>
            </div>
          </div>
        </div>
        <table class="w-full text-xs border-collapse border border-gray-300 mb-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 p-2 text-left">#</th>
              <th class="border border-gray-300 p-2 text-left">Description</th>
              <th class="border border-gray-300 p-2 text-center">Qty</th>
              <th class="border border-gray-300 p-2 text-right">Unit Price</th>
              <th class="border border-gray-300 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in printingCost.items" :key="i">
              <td class="border border-gray-300 p-2 text-center">{{ i + 1 }}</td>
              <td class="border border-gray-300 p-2">{{ item.description }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ item.quantity }}</td>
              <td class="border border-gray-300 p-2 text-right">
                {{ formatCurrency(item.unitPrice, item.currency) }}
              </td>
              <td class="border border-gray-300 p-2 text-right font-bold">
                {{ formatCurrency(item.amount, item.currency) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50 font-bold">
              <td colspan="4" class="border border-gray-300 p-2 text-right">Total Cost</td>
              <td class="border border-gray-300 p-2 text-right text-[#012D5A]">
                {{
                  formatCurrency(
                    printingCost.amount,
                    hasUsdItem(printingCost) && Number(printingCost.exchangeRate || 1) > 1
                      ? "IDR"
                      : hasUsdItem(printingCost)
                        ? "USD"
                        : "IDR",
                  )
                }}
              </td>
            </tr>
          </tfoot>
        </table>
        <div v-if="printingCost.notes" class="text-xs text-gray-500 border-t pt-2">
          <span class="font-bold">Notes:</span> {{ printingCost.notes }}
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal
      v-model="showForm"
      :title="editingCost ? 'Edit Vendor Cost' : 'Record Vendor Cost'"
      :description="
        editingCost
          ? 'Ubah detail biaya vendor pada quotation ini.'
          : 'Catat biaya vendor untuk analisa profit quotation.'
      "
      width="2xl"
    >
      <QuotationCostForm
        :cost="editingCost"
        :is-saving="isSaving"
        @submit="handleFormSubmit"
        @cancel="showForm = false"
      />
    </Modal>
  </div>
</template>
