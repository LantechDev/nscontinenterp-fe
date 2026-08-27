<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import CurrencyStack from "~/components/ui/CurrencyStack.vue";
import type { Quotation, QuotationCost, QuotationCharge } from "~/composables/useQuotations";
import { formatCurrencyCode, formatExchangeRateLabel } from "~/utils/currency";
import { getTransportLocationDisplay } from "~/utils/airFreightJob";
import { renderA4Pdf } from "~/utils/pdfRender";
import { formatQuotationDate } from "~/utils/quotation-display";

interface CurrencyBucket {
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}
interface ProfitSummary {
  byCurrency: Record<string, CurrencyBucket>;
  combined: { revenueIDR: number; costIDR: number; profitIDR: number; marginIDR: number };
}

const props = defineProps<{
  quotation: Quotation | null;
  costs: QuotationCost[];
  profit: ProfitSummary;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");
onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const toNumber = (v: unknown) => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return isNaN(n) ? 0 : n;
};

const formatCurrency = (val: number | string | null | undefined, currency = "IDR") => {
  if (val === null || val === undefined) return `${currency} 0`;
  return formatCurrencyCode(toNumber(val), currency);
};

const customerName = computed(() => props.quotation?.customerName || "-");
const quotationExchangeRate = computed(() => Number(props.quotation?.exchangeRate || 1));
const exchangeRateDisplay = computed(() =>
  formatExchangeRateLabel(quotationExchangeRate.value, {
    idrPosition: "prefix",
    defaultLabel: "1 USD = USD 1",
  }),
);
const routeText = computed(() => {
  const pol = getTransportLocationDisplay({
    serviceType: props.quotation?.serviceType,
    shipmentType: props.quotation?.shipmentType,
    code: props.quotation?.pol,
    name: props.quotation?.polName,
  });
  const pod = getTransportLocationDisplay({
    serviceType: props.quotation?.serviceType,
    shipmentType: props.quotation?.shipmentType,
    code: props.quotation?.pod,
    name: props.quotation?.podName,
  });
  return `${pol} -> ${pod}`;
});

// Revenue rows = pricing charges (exclude AT COST); Cost rows = vendor costs
const revenueRows = computed<QuotationCharge[]>(() =>
  (props.quotation?.charges || []).filter((ch) => !ch.atCost),
);

interface CostRow {
  vendorName: string | null;
  description: string;
  currency: "IDR" | "USD";
  amount: number;
  exchangeRate: number;
}
const costRows = computed<CostRow[]>(() => {
  const rows: CostRow[] = [];
  (props.costs || []).forEach((c) => {
    const rate = toNumber(c.exchangeRate || 1);
    (c.items || []).forEach((it) => {
      rows.push({
        vendorName: c.vendorName || null,
        description: it.description,
        currency: (it.currency || "IDR") as "IDR" | "USD",
        amount: toNumber(it.amount || toNumber(it.quantity) * toNumber(it.unitPrice)),
        exchangeRate: rate,
      });
    });
  });
  return rows;
});

const totalRevenueIDR = computed(() => props.profit.combined.revenueIDR);
const totalCostIDR = computed(() => props.profit.combined.costIDR);
const profitIDR = computed(() => props.profit.combined.profitIDR);
const marginIDR = computed(() => props.profit.combined.marginIDR);

const chargeAmount = (ch: QuotationCharge) => toNumber(ch.quantity) * toNumber(ch.unitPrice);

// ---- pagination (adapted from JobProfitPreview) ----
const MAIN_PX = 950;
const SECTION_PX = 56;
const JOBINFO_PX = 92;
const SUMMARY_PX = 50;
const FOOTER_PX = 108;
const ROW_BASE_PX = 24;
const LINE_PX = 14;
const VENDOR_CHARS_PER_LINE = 20;

const linesFor = (text: string | null | undefined, cpl: number) =>
  Math.max(1, Math.ceil((text?.length || 0) / cpl));

const revenueRowPx = (ch: QuotationCharge) =>
  ROW_BASE_PX + Math.max(1, ch.currency === "USD" ? 2 : 1) * LINE_PX;

const costRowPx = (c: CostRow) => {
  const vendorLines = linesFor(c.vendorName, VENDOR_CHARS_PER_LINE);
  const amountLines = c.currency === "USD" ? 2 : 1;
  return ROW_BASE_PX + Math.max(vendorLines, amountLines) * LINE_PX;
};

interface ReportPage {
  isFirst: boolean;
  isLast: boolean;
  showRevenue: boolean;
  revenueRows: QuotationCharge[];
  revenueContinued: boolean;
  showCost: boolean;
  costRows: CostRow[];
  costContinued: boolean;
}

const reportPages = computed<ReportPage[]>(() => {
  const revs = revenueRows.value;
  const costs = costRows.value;
  const pages: ReportPage[] = [];
  let ri = 0;
  let ci = 0;
  let costStarted = false;
  let first = true;

  while (true) {
    let budget = first ? MAIN_PX - JOBINFO_PX - SUMMARY_PX : MAIN_PX;
    const page: ReportPage = {
      isFirst: first,
      isLast: false,
      showRevenue: false,
      revenueRows: [],
      revenueContinued: false,
      showCost: false,
      costRows: [],
      costContinued: costStarted,
    };

    if (ri < revs.length || (first && revs.length === 0)) {
      page.showRevenue = true;
      page.revenueContinued = ri > 0;
      budget -= SECTION_PX;
      while (ri < revs.length) {
        const inv = revs[ri];
        if (!inv) break;
        const h = revenueRowPx(inv);
        if (budget - h < 0 && page.revenueRows.length > 0) break;
        page.revenueRows.push(inv);
        ri++;
        budget -= h;
      }
    }

    const revenueDone = ri >= revs.length;
    if (revenueDone && budget > SECTION_PX + ROW_BASE_PX && (ci < costs.length || !costStarted)) {
      page.showCost = true;
      page.costContinued = costStarted;
      budget -= SECTION_PX;
      costStarted = true;
      while (ci < costs.length) {
        const exp = costs[ci];
        if (!exp) break;
        const h = costRowPx(exp);
        const reserve = ci === costs.length - 1 ? FOOTER_PX : 0;
        if (budget - h - reserve < 0 && page.costRows.length > 0) break;
        page.costRows.push(exp);
        ci++;
        budget -= h;
      }
    }

    pages.push(page);
    first = false;
    if (ri >= revs.length && ci >= costs.length && costStarted) break;
    if (pages.length > 100) break;
  }

  const lastPage = pages[pages.length - 1];
  if (lastPage) lastPage.isLast = true;
  return pages;
});

const generatePDF = async () => {
  if (!printContainerRef.value || !props.quotation) return false;
  try {
    isGeneratingPDF.value = true;
    return await renderA4Pdf(printContainerRef.value, {
      filename: `COSTING_PROFIT_${props.quotation.number || "DRAFT"}.pdf`,
      resetScroll: true,
    });
  } catch (error) {
    console.error(error);
    toast.error("Gagal membuat PDF. Cek console.");
    return false;
  } finally {
    isGeneratingPDF.value = false;
  }
};

defineExpose({ generatePDF, isGeneratingPDF });
</script>

<template>
  <div
    class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto custom-scrollbar font-mono"
  >
    <div class="relative group flex flex-col gap-10" ref="printContainerRef">
      <div
        v-for="(page, pIdx) in reportPages"
        :key="pIdx"
        class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border"
        style="
          width: 794px;
          height: 1123px;
          padding: 20px 30px;
          box-sizing: border-box;
          position: relative;
        "
      >
        <!-- Header -->
        <div
          class="header-section flex justify-between items-end mb-1 relative z-[1] bg-white"
          style="height: 70px"
        >
          <div class="w-[35%] pb-1">
            <img
              :src="logoUrl"
              alt="NS Continent Logo"
              class="h-16 object-contain max-w-[190px]"
              crossorigin="anonymous"
            />
          </div>
          <div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full">
            <span
              class="text-xs font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]"
            >
              QUOTATION COSTING
            </span>
            <span class="text-[0.5rem] font-semibold uppercase tracking-wider text-rose-600 mt-1">
              Confidential — Internal
            </span>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ pIdx + 1 }} OF {{ reportPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              PROFIT REPORT
            </h1>
          </div>
        </div>

        <!-- Main bordered container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Quotation info (first page) -->
          <div v-if="page.isFirst" class="flex border-b border-[#062c58]" style="min-height: 80px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                >CUSTOMER:</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ customerName }}
              </div>
              <div class="mt-4">
                <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                  >ROUTE:</span
                >
                <div class="font-mono text-[0.7rem] uppercase text-black">{{ routeText }}</div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="height: 40px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >QUOTATION NO.</span
                  >
                  <span class="font-mono text-[0.8rem] text-black font-medium">{{
                    quotation?.number || "-"
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatQuotationDate(quotation?.date, "pdf")
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 40px">
                <div class="w-1/3 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >VALID UNTIL</span
                  >
                  <span class="font-mono text-[0.7rem] text-black uppercase">{{
                    formatQuotationDate(quotation?.validUntil, "pdf")
                  }}</span>
                </div>
                <div class="w-1/3 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >STATUS</span
                  >
                  <span class="font-mono text-[0.7rem] text-black uppercase">{{
                    quotation?.status || "-"
                  }}</span>
                </div>
                <div class="w-1/3 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >EXCHANGE RATE</span
                  >
                  <span class="font-mono text-[0.58rem] text-black uppercase font-bold">{{
                    exchangeRateDisplay
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial summary bar (first page) -->
          <div
            v-if="page.isFirst"
            class="bg-[#062c58] text-white px-3 py-2 flex justify-between items-center"
          >
            <span class="font-bold text-xs tracking-wider">FINANCIAL PERFORMANCE SUMMARY</span>
            <div class="flex gap-6">
              <div class="flex flex-col items-end">
                <span class="text-[0.5rem] opacity-70">NET PROFIT</span>
                <span class="text-sm font-black">{{ formatCurrency(profitIDR) }}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[0.5rem] opacity-70">MARGIN</span>
                <span class="text-sm font-black">{{ marginIDR.toFixed(2) }}%</span>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1 flex flex-col">
            <!-- Revenue table -->
            <div v-if="page.showRevenue" class="flex flex-col border-b border-[#062c58]">
              <div
                class="bg-[#062c58]/5 px-3 py-1.5 border-b border-[#062c58] flex justify-between"
              >
                <span class="font-bold text-[0.65rem] text-[#062c58]"
                  >REVENUE (PRICING){{ page.revenueContinued ? " — CONTINUED" : "" }}</span
                >
                <span class="font-bold text-[0.65rem] text-[#062c58]"
                  >TOTAL: {{ formatCurrency(totalRevenueIDR) }}</span
                >
              </div>
              <table class="w-full text-left font-mono">
                <thead class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50">
                  <tr>
                    <th class="px-3 py-1 w-[8%]">NO</th>
                    <th class="px-3 py-1 w-[30%]">SERVICE</th>
                    <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                    <th class="px-3 py-1 w-[22%] text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody class="text-[0.65rem]">
                  <tr
                    v-for="(ch, i) in page.revenueRows"
                    :key="ch.id || i"
                    class="border-b border-[#062c58]/5"
                  >
                    <td class="px-3 py-2">{{ i + 1 }}</td>
                    <td class="px-3 py-2 font-bold uppercase">{{ ch.serviceName || "SERVICE" }}</td>
                    <td class="px-3 py-2 truncate max-w-xs uppercase">
                      {{ ch.description || "-" }}
                    </td>
                    <td class="px-3 py-2 text-right">
                      <CurrencyStack
                        :amount="chargeAmount(ch)"
                        :currency="ch.currency || 'IDR'"
                        :exchange-rate="quotation?.exchangeRate"
                        primary-class="font-bold text-[#062c58] whitespace-nowrap"
                        secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                        align="right"
                      />
                    </td>
                  </tr>
                  <tr v-if="page.revenueRows.length === 0">
                    <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                      No pricing recorded
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Cost table -->
            <div v-if="page.showCost" class="flex flex-col">
              <div class="bg-red-50/50 px-3 py-1.5 border-b border-[#062c58] flex justify-between">
                <span class="font-bold text-[0.65rem] text-red-700"
                  >COSTS (VENDOR){{ page.costContinued ? " — CONTINUED" : "" }}</span
                >
                <span class="font-bold text-[0.65rem] text-red-700"
                  >TOTAL: {{ formatCurrency(totalCostIDR) }}</span
                >
              </div>
              <table class="w-full text-left font-mono">
                <thead class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50">
                  <tr>
                    <th class="px-3 py-1 w-[8%]">NO</th>
                    <th class="px-3 py-1 w-[30%]">VENDOR</th>
                    <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                    <th class="px-3 py-1 w-[22%] text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody class="text-[0.65rem]">
                  <tr v-for="(c, i) in page.costRows" :key="i" class="border-b border-[#062c58]/5">
                    <td class="px-3 py-2">{{ i + 1 }}</td>
                    <td class="px-3 py-2 font-bold uppercase">{{ c.vendorName || "-" }}</td>
                    <td class="px-3 py-2 truncate max-w-xs uppercase">{{ c.description }}</td>
                    <td class="px-3 py-2 text-right">
                      <CurrencyStack
                        :amount="c.amount"
                        :currency="c.currency"
                        :exchange-rate="c.exchangeRate"
                        primary-class="font-bold text-[#062c58] whitespace-nowrap"
                        secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                        align="right"
                      />
                    </td>
                  </tr>
                  <tr v-if="page.costRows.length === 0">
                    <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                      No costs recorded
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Summary footer (last page) -->
          <div v-if="page.isLast" class="border-t border-[#062c58] mt-auto bg-gray-50">
            <div class="flex h-24">
              <div class="w-1/2 p-3 text-[0.55rem] italic text-muted-foreground leading-tight">
                Laporan internal untuk analisa manajemen. Data berdasarkan pricing & biaya vendor
                pada quotation ini. Profit = Total Revenue − Total Cost. Nilai USD dikonversi ke IDR
                memakai kurs tercatat.
              </div>
              <div class="w-1/2 flex flex-col border-l border-[#062c58]">
                <div class="flex-1 flex border-b border-[#062c58]/10 items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.6rem] uppercase">Total Revenue</div>
                  <div class="flex-1 px-3 text-right font-bold text-green-600">
                    {{ formatCurrency(totalRevenueIDR) }}
                  </div>
                </div>
                <div class="flex-1 flex border-b border-[#062c58]/10 items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.6rem] uppercase">Total Cost</div>
                  <div class="flex-1 px-3 text-right font-bold text-red-600">
                    ({{ formatCurrency(totalCostIDR) }})
                  </div>
                </div>
                <div class="flex-1 flex bg-[#062c58] text-white items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.7rem] uppercase">Net Profit</div>
                  <div class="flex-1 px-3 text-right font-black text-lg">
                    {{ formatCurrency(profitIDR) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer credits -->
        <div class="mt-4 flex justify-between items-end">
          <div class="w-2/3">
            <p class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium">
              NS CONTINENT - OPERATIONAL MANAGEMENT SYSTEM · INTERNAL COSTING
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #062c5830;
  border-radius: 10px;
}
</style>
