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
  FileText,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import Modal from "~/components/ui/Modal.vue";
import QuotationCostForm from "./QuotationCostForm.vue";
import QuotationCostingPreview from "./QuotationCostingPreview.vue";
import { useQuotations, type Quotation, type QuotationCost } from "~/composables/useQuotations";
import { useCompanies } from "~/composables/useCompanies";

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

const showReport = ref(false);
const previewRef = ref<InstanceType<typeof QuotationCostingPreview> | null>(null);
const isGeneratingPDF = ref(false);

const loadFromQuotation = () => {
  costs.value = (props.quotation.costs || []).map((c) => ({ ...c }));
};

watch(() => props.quotation.id, loadFromQuotation, { immediate: true });
watch(() => props.quotation.costs, loadFromQuotation);

onMounted(() => {
  fetchCompanies({ type: "VENDOR", limit: 500 });
});

const formatCurrency = (amount: number, currency = "IDR") =>
  new Intl.NumberFormat(currency === "USD" ? "en-US" : "id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(Number(amount || 0));

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

const previewCosts = computed<QuotationCost[]>(() =>
  costs.value.map((c) => ({ ...c, vendorName: vendorName(c) })),
);

// ---------- Profit analysis ----------
const profitSummary = computed(() => {
  const byCurrency: Record<
    string,
    { revenue: number; cost: number; profit: number; margin: number }
  > = {
    IDR: { revenue: 0, cost: 0, profit: 0, margin: 0 },
    USD: { revenue: 0, cost: 0, profit: 0, margin: 0 },
  };

  const quotationRate = Number(props.quotation.exchangeRate || 1);
  const isQuotationRateConfigured = quotationRate > 1;
  let revenueIDR = 0;
  let costIDR = 0;

  (props.quotation.charges || []).forEach((ch) => {
    if (ch.atCost) return;
    const curr = ch.currency || "IDR";
    const amt = Number(ch.quantity || 0) * Number(ch.unitPrice || 0);

    const targetCurr = curr === "USD" && isQuotationRateConfigured ? "IDR" : curr;
    const targetAmt = curr === "USD" && isQuotationRateConfigured ? amt * quotationRate : amt;

    if (!byCurrency[targetCurr])
      byCurrency[targetCurr] = { revenue: 0, cost: 0, profit: 0, margin: 0 };
    byCurrency[targetCurr].revenue += targetAmt;
    revenueIDR += curr === "USD" ? amt * quotationRate : amt;
  });

  costs.value.forEach((c) => {
    const rate = Number(c.exchangeRate || 1);
    const isCostRateConfigured = rate > 1;
    (c.items || []).forEach((it) => {
      const curr = it.currency || "IDR";
      const amt = Number(it.amount || Number(it.quantity || 0) * Number(it.unitPrice || 0));

      const shouldConvertToIDR =
        curr === "USD" && (isQuotationRateConfigured || isCostRateConfigured);
      const targetCurr = shouldConvertToIDR ? "IDR" : curr;
      const targetAmt = shouldConvertToIDR ? amt * rate : amt;

      if (!byCurrency[targetCurr])
        byCurrency[targetCurr] = { revenue: 0, cost: 0, profit: 0, margin: 0 };
      byCurrency[targetCurr].cost += targetAmt;
      costIDR += curr === "USD" ? amt * rate : amt;
    });
  });

  Object.values(byCurrency).forEach((b) => {
    b.profit = b.revenue - b.cost;
    b.margin = b.revenue > 0 ? (b.profit / b.revenue) * 100 : 0;
  });

  const profitIDR = revenueIDR - costIDR;
  return {
    byCurrency,
    combined: {
      revenueIDR,
      costIDR,
      profitIDR,
      marginIDR: revenueIDR > 0 ? (profitIDR / revenueIDR) * 100 : 0,
    },
  };
});

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
  const next = costs.value.filter((_, i) => i !== idx);
  const res = await persist(next);
  if (res.success) toast.success("Cost dihapus.");
  else toast.error(res.error || "Gagal menghapus costing.");
};

const handlePrint = async () => {
  showReport.value = true;
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
          @click="showReport = !showReport"
          class="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors gap-1.5 shadow-sm"
        >
          <FileText class="w-3.5 h-3.5 text-slate-500" />
          {{ showReport ? "Hide" : "Profit Report" }}
        </button>
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
              Net Profit (IDR eq.)
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
              Net Profit (IDR eq.)
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

    <!-- Cost list (vendor-invoice style cards) -->
    <div>
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
          Catat biaya vendor (shipping line, trucking, dsb.) untuk melihat analisa profit quotation
          ini.
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
          class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all flex flex-col gap-4"
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
                  <span class="font-bold text-sm text-foreground uppercase">
                    {{ vendorName(cost) }}
                  </span>
                  <span
                    v-for="curr in costCurrencies(cost)"
                    :key="curr"
                    class="text-[9px] px-1.5 py-0.5 rounded font-black border uppercase tracking-wider bg-gray-100 text-gray-500 border-gray-200"
                  >
                    {{ curr }}
                  </span>
                </div>
                <p v-if="cost.number" class="text-[10px] text-muted-foreground/70 mt-0.5 uppercase">
                  {{ cost.number }}
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
              <div
                v-if="editable"
                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEdit(cost, idx)"
                  class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(idx)"
                  :disabled="isSaving"
                  class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                  title="Hapus"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profit Report Preview -->
    <section v-if="showReport" class="space-y-3 pt-2 border-t border-border/60">
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
    </section>

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
