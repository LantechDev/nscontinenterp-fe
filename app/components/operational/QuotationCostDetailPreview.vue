<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import CurrencyStack from "~/components/ui/CurrencyStack.vue";
import type { Quotation, QuotationCost } from "~/composables/useQuotations";
import { formatCurrencyDecimal, formatExchangeRateLabel } from "~/utils/currency";
import { paginatePdfRows, type PdfRowPage } from "~/utils/pdfPagination";
import { renderA4Pdf } from "~/utils/pdfRender";
import { formatQuotationDate } from "~/utils/quotation-display";

const props = defineProps<{
  quotation: Quotation | null;
  cost: QuotationCost | null;
  vendorName?: string;
}>();

const vendorLabel = computed(() => props.vendorName || props.cost?.vendorName || "No Vendor");

const logoUrl = ref("/images/transparentnscontinenttebal.png");

onMounted(() => {
  if (typeof window !== "undefined")
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const costItems = computed(() => props.cost?.items || []);

const hasUsdItem = computed(() => costItems.value.some((it) => (it.currency || "IDR") === "USD"));
const costExchangeRate = computed(() => Number(props.cost?.exchangeRate || 1));
const effectiveCurrency = computed(() =>
  hasUsdItem.value && costExchangeRate.value > 1 ? "IDR" : hasUsdItem.value ? "USD" : "IDR",
);
const exchangeRateDisplay = computed(() =>
  formatExchangeRateLabel(costExchangeRate.value, {
    idrPosition: "prefix",
    defaultLabel: "1 USD = USD 1",
  }),
);

const displayAmount = (amount: unknown, currency = effectiveCurrency.value): number => {
  const num = Number(amount || 0);
  return currency === "USD" && costExchangeRate.value > 1 ? num * costExchangeRate.value : num;
};

const formatDisplayCurrency = (amount: unknown, currency = effectiveCurrency.value): string => {
  const displayCurrency = currency === "USD" && costExchangeRate.value > 1 ? "IDR" : currency;
  return formatCurrencyDecimal(displayAmount(amount, currency), displayCurrency);
};

type CostPreviewItem = NonNullable<QuotationCost["items"]>[number];

const FIRST_PAGE_ITEM_SLOTS = 14;
const MAIN_PX = 1009;
const FIRST_HEADER_PX = 145;
const CONT_HEADER_PX = 34;
const TABLE_HEADER_PX = 35;
const FOOTER_PX = 125;
const CREDITS_PX = 40;
const LAST_PAGE_RESERVE_PX = FOOTER_PX + CREDITS_PX;
const ITEM_ROW_MIN_PX = 35;
const ITEM_LINE_PX = 14;
const ITEM_ROW_PADDING_PX = 14;
const DESC_CHARS_PER_LINE = 46;

const itemRowPx = (desc?: string | null) => {
  const lines = Math.max(1, Math.ceil((desc || "").length / DESC_CHARS_PER_LINE));
  return Math.max(ITEM_ROW_MIN_PX, lines * ITEM_LINE_PX + ITEM_ROW_PADDING_PX);
};

const previewPages = computed<PdfRowPage<CostPreviewItem>[]>(() =>
  paginatePdfRows({
    items: costItems.value,
    mainHeightPx: MAIN_PX,
    firstHeaderPx: FIRST_HEADER_PX,
    continuationHeaderPx: CONT_HEADER_PX,
    tableHeaderPx: TABLE_HEADER_PX,
    lastPageReservePx: LAST_PAGE_RESERVE_PX,
    getRowHeightPx: (item) => itemRowPx(item.description),
  }),
);

const generatePDF = async () => {
  if (!printContainerRef.value || !props.cost) return false;
  try {
    isGeneratingPDF.value = true;
    return await renderA4Pdf(printContainerRef.value, {
      filename: `COST_${props.cost.number || "VCOST"}.pdf`,
    });
  } catch (error) {
    console.error(error);
    toast.error("Gagal membuat PDF.");
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
        v-for="page in previewPages"
        :key="page.pageNumber"
        class="a4-page-wrapper bg-white shadow-xl shrink-0 flex flex-col text-[#062c58] border"
        style="
          width: 794px;
          height: 1123px;
          padding: 20px 30px;
          box-sizing: border-box;
          position: relative;
        "
      >
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
              class="text-[10px] font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]"
              >VENDOR COST</span
            >
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ page.pageNumber }} OF {{ previewPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none">COST DETAIL</h1>
          </div>
        </div>

        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <div
            v-if="page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 100px"
          >
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                >VENDOR / PAYEE:</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ vendorLabel }}
              </div>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[0.65rem] leading-tight text-black/80 mt-1"
              >
                Quotation: {{ quotation?.number || "-" }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >COST NO.</span
                  >
                  <span class="font-mono text-[0.85rem] text-black font-medium">{{
                    cost?.number || "VCOST"
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatQuotationDate(cost?.date, "pdf")
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 50px">
                <div class="w-1/3 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >QUOTATION</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-medium">{{
                    quotation?.number || "-"
                  }}</span>
                </div>
                <div class="w-1/3 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >CURRENCY</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-bold uppercase">{{
                    effectiveCurrency
                  }}</span>
                </div>
                <div class="w-1/3 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >EXCHANGE RATE</span
                  >
                  <span class="font-mono text-[0.62rem] text-black font-bold uppercase">{{
                    exchangeRateDisplay
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="page.isFirstPage"
            class="flex border-b border-[#062c58] bg-gray-50/10"
            style="min-height: 45px"
          >
            <div class="w-full pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1 uppercase opacity-70"
                >DESCRIPTION / REMARKS</span
              >
              <span
                class="font-mono text-[0.75rem] uppercase text-black font-medium leading-tight"
                >{{ cost?.notes || costItems[0]?.description || "-" }}</span
              >
            </div>
          </div>

          <div
            v-if="!page.isFirstPage"
            class="border-b border-[#062c58] bg-gray-50/10 px-2 py-2 text-[0.65rem] font-bold uppercase tracking-widest"
          >
            {{ cost?.number || "VCOST" }} - Items Continued
          </div>

          <div
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[5%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">DESCRIPTION</div>
            <div class="w-[10%] border-r border-[#062c58] flex items-center justify-center">
              QTY
            </div>
            <div class="w-[20%] border-r border-[#062c58] flex items-center justify-end px-3">
              UNIT PRICE
            </div>
            <div class="w-[20%] flex items-center justify-end px-3">TOTAL AMOUNT</div>
          </div>

          <div class="flex-1 relative">
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[5%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[10%] border-r border-[#062c58]/30"></div>
              <div class="w-[20%] border-r border-[#062c58]/30"></div>
              <div class="w-[20%]"></div>
            </div>
            <div class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in page.items"
                :key="idx"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[5%] text-center text-[0.7rem]">{{ page.startIndex + idx + 1 }}</div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  {{ item.description }}
                </div>
                <div class="w-[10%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[20%] text-right px-3 text-[0.7rem] text-black">
                  <CurrencyStack
                    :amount="item.unitPrice"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="costExchangeRate"
                    primary-class="font-medium text-black whitespace-nowrap"
                    secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                    align="right"
                  />
                </div>
                <div class="w-[20%] text-right px-3 text-[0.7rem] font-medium text-black">
                  <CurrencyStack
                    :amount="item.amount"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="costExchangeRate"
                    primary-class="font-bold text-black whitespace-nowrap"
                    secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                    align="right"
                  />
                </div>
              </div>
              <div
                v-if="page.isLastPage && page.items.length < FIRST_PAGE_ITEM_SLOTS"
                v-for="i in FIRST_PAGE_ITEM_SLOTS - page.items.length"
                :key="'spacer-' + i"
                class="flex min-h-[35px] border-b border-[#062c58]/5"
              >
                <div class="w-[5%]"></div>
                <div class="flex-1"></div>
                <div class="w-[10%]"></div>
                <div class="w-[20%]"></div>
                <div class="w-[20%]"></div>
              </div>
            </div>
          </div>

          <div v-if="page.isLastPage" class="border-t border-[#062c58] mt-auto">
            <div class="flex items-stretch min-h-[120px]">
              <div class="w-[58%] border-r border-[#062c58] p-4">
                <span class="font-bold text-[0.6rem] block text-[#062c58] uppercase mb-6"
                  >APPROVAL WORKFLOW:</span
                >
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="h-14 border-b border-[#062c58]/30 mb-1"></div>
                    <span class="text-[0.55rem] font-bold text-[#062c58]/50 uppercase"
                      >PREPARED BY</span
                    >
                  </div>
                  <div class="text-center">
                    <div class="h-14 border-b border-[#062c58]/30 mb-1"></div>
                    <span class="text-[0.55rem] font-bold text-[#062c58]/50 uppercase"
                      >VERIFIED BY</span
                    >
                  </div>
                  <div class="text-center">
                    <div class="h-14 border-b border-[#062c58]/30 mb-1"></div>
                    <span class="text-[0.55rem] font-bold text-[#062c58]/50 uppercase"
                      >APPROVED BY</span
                    >
                  </div>
                </div>
              </div>
              <div class="w-[42%] flex flex-col">
                <div class="flex-1 flex flex-col">
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      SUBTOTAL ({{ effectiveCurrency }})
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatDisplayCurrency(cost?.subTotal) }}
                    </div>
                  </div>
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">VAT / TAX</div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatDisplayCurrency(cost?.taxTotal || 0) }}
                    </div>
                  </div>
                  <div class="flex bg-[#062c58] text-white flex-1 items-center">
                    <div class="w-1/2 px-3 flex flex-col">
                      <span class="text-[0.55rem] font-bold opacity-70">TOTAL COST</span
                      ><span
                        class="text-[0.8rem] font-black tracking-wider uppercase leading-none mt-1"
                        >{{ effectiveCurrency }}</span
                      >
                    </div>
                    <div class="flex-1 px-3 text-right font-mono text-xl font-black">
                      <CurrencyStack
                        :amount="cost?.amount"
                        :currency="effectiveCurrency"
                        :exchange-rate="costExchangeRate"
                        primary-class="text-xl font-black text-white whitespace-nowrap"
                        secondary-class="text-[0.55rem] text-white/70 italic whitespace-nowrap"
                        align="right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="page.isLastPage" class="mt-4 flex justify-between items-end">
          <div class="w-2/3">
            <p
              class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]"
            >
              Internal vendor cost detail for quotation profitability analysis. Not for client
              distribution.
            </p>
          </div>
          <div class="text-right">
            <span class="text-[0.6rem] font-black text-[#062c58] uppercase tracking-widest"
              >PRINTED: {{ formatQuotationDate(new Date().toISOString(), "pdf") }}</span
            >
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #062c5850;
}
</style>
