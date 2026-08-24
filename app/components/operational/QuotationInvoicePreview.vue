<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import CurrencyStack from "~/components/ui/CurrencyStack.vue";
import type {
  Quotation,
  QuotationInvoice,
  QuotationInvoiceItem,
} from "~/composables/useQuotations";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import { formatCurrencyDecimal, formatExchangeRateLabel } from "~/utils/currency";
import { formatAmountInWords } from "~/utils/numberWords";
import { paginatePdfRows, type PdfRowPage } from "~/utils/pdfPagination";
import { renderA4Pdf } from "~/utils/pdfRender";
import { formatQuotationDate } from "~/utils/quotation-display";

const props = defineProps<{
  quotation: Quotation | null;
  invoice: QuotationInvoice | null;
}>();

const invoiceItems = computed(() => props.invoice?.items || []);
const documentCurrency = computed(() => {
  if (props.invoice?.currency) return props.invoice.currency;
  const itemCurrencies = [
    ...new Set(invoiceItems.value.map((item) => item.currency || "IDR").filter(Boolean)),
  ];
  if (itemCurrencies.length === 1) return itemCurrencies[0] || "IDR";
  return props.quotation?.currency || "IDR";
});
const documentExchangeRate = computed(() => Number(props.quotation?.exchangeRate || 1));
const documentDisplayCurrency = computed(() =>
  documentCurrency.value === "USD" && documentExchangeRate.value > 1
    ? "IDR"
    : documentCurrency.value,
);
const exchangeRateDisplay = computed(() =>
  formatExchangeRateLabel(documentExchangeRate.value, {
    idrPosition: "prefix",
    defaultLabel: "1 USD = USD 1",
  }),
);

const displayAmount = (amount: unknown, currency = documentCurrency.value): number => {
  const num = Number(amount || 0);
  return currency === "USD" && documentExchangeRate.value > 1
    ? num * documentExchangeRate.value
    : num;
};

const amountInWords = computed(() => {
  const total = displayAmount(props.invoice?.total);
  return formatAmountInWords(total, documentDisplayCurrency.value);
});

const logoUrl = ref("/images/transparentnscontinenttebal.png");
const bankAccounts = ref<BankAccount[]>([]);
const { fetchBankAccounts } = useBankAccounts();

onMounted(async () => {
  if (typeof window !== "undefined")
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  const res = await fetchBankAccounts({ isActive: true });
  if (res.success) bankAccounts.value = res.data || [];
});

const formatCurrency = (amount: unknown, currency = documentCurrency.value): string => {
  if (amount === undefined || amount === null) return "-";
  const displayCurrency = currency === "USD" && documentExchangeRate.value > 1 ? "IDR" : currency;
  return formatCurrencyDecimal(displayAmount(amount, currency), displayCurrency);
};

const FIRST_PAGE_ITEM_SLOTS = 10;
const MAIN_PX = 1009;
const FIRST_HEADER_PX = 250;
const CONT_HEADER_PX = 34;
const TABLE_HEADER_PX = 35;
const FOOTER_PX = 145;
const SIGNATURE_PX = 95;
const LAST_PAGE_RESERVE_PX = FOOTER_PX + SIGNATURE_PX;
const ITEM_ROW_MIN_PX = 35;
const ITEM_LINE_PX = 14;
const ITEM_ROW_PADDING_PX = 14;
const DESC_CHARS_PER_LINE = 42;

const itemRowPx = (item?: QuotationInvoiceItem | null) => {
  const descriptionLines = Math.max(
    1,
    Math.ceil((item?.description || "").length / DESC_CHARS_PER_LINE),
  );
  const amountLines = item?.currency === "USD" ? 2 : 1;
  return Math.max(
    ITEM_ROW_MIN_PX,
    Math.max(descriptionLines, amountLines) * ITEM_LINE_PX + ITEM_ROW_PADDING_PX,
  );
};

const previewPages = computed<PdfRowPage<QuotationInvoiceItem>[]>(() =>
  paginatePdfRows({
    items: invoiceItems.value,
    mainHeightPx: MAIN_PX,
    firstHeaderPx: FIRST_HEADER_PX,
    continuationHeaderPx: CONT_HEADER_PX,
    tableHeaderPx: TABLE_HEADER_PX,
    lastPageReservePx: LAST_PAGE_RESERVE_PX,
    getRowHeightPx: itemRowPx,
  }),
);

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const generatePDF = async () => {
  if (!printContainerRef.value || !props.invoice) return false;
  try {
    isGeneratingPDF.value = true;
    return await renderA4Pdf(printContainerRef.value, {
      filename: `QUOTATION_${props.invoice.number || "DRAFT"}.pdf`,
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
          <div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full"></div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ page.pageNumber }} OF {{ previewPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              QUOTATION
            </h1>
          </div>
        </div>

        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Parties & quotation info -->
          <div
            v-if="page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 100px"
          >
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                >BILL TO:</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ quotation?.customerName || "-" }}
              </div>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[0.65rem] leading-tight text-black/80 mt-1"
              >
                {{ quotation?.customerAddress || "-" }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >QUOTATION NO.</span
                  >
                  <span class="font-mono text-[0.85rem] text-black font-medium">{{
                    invoice?.number || "DRAFT"
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatQuotationDate(invoice?.date, "pdf")
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >QUOTATION NO.</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-medium">{{
                    quotation?.number || "-"
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >TERM</span
                  >
                  <span class="font-mono text-[0.75rem] text-black">{{
                    quotation?.term || "PREPAID"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipment info rows -->
          <div
            v-if="page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 45px"
          >
            <div class="w-1/4 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">POL / ORIGIN</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">{{
                quotation?.polName || quotation?.pol || quotation?.pickupAddress || "-"
              }}</span>
            </div>
            <div class="w-1/4 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">POD / DESTINATION</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">{{
                quotation?.podName || quotation?.pod || quotation?.deliveryAddress || "-"
              }}</span>
            </div>
            <div class="w-1/4 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">CURRENCY</span>
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium">{{
                documentDisplayCurrency
              }}</span>
            </div>
            <div class="w-1/4 pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">EXCHANGE RATE</span>
              <span class="font-mono text-[0.62rem] uppercase text-black font-bold">{{
                exchangeRateDisplay
              }}</span>
            </div>
          </div>

          <!-- Continuation header -->
          <div
            v-if="!page.isFirstPage"
            class="border-b border-[#062c58] bg-gray-50/10 px-2 py-2 text-[0.65rem] font-bold uppercase tracking-widest"
          >
            {{ invoice?.number || "DRAFT" }} - Charges Continued
          </div>

          <!-- Items Table Header -->
          <div
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[4%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">DESCRIPTION</div>
            <div class="w-[6%] border-r border-[#062c58] flex items-center justify-center">QTY</div>
            <div class="w-[15%] border-r border-[#062c58] flex items-center justify-end px-3">
              UNIT PRICE
            </div>
            <div class="w-[15%] flex items-center justify-end px-3">TOTAL AMOUNT</div>
          </div>

          <!-- Items -->
          <div class="flex-1 relative">
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[4%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[6%] border-r border-[#062c58]/30"></div>
              <div class="w-[15%] border-r border-[#062c58]/30"></div>
              <div class="w-[15%]"></div>
            </div>
            <div class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in page.items"
                :key="idx"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[4%] text-center text-[0.7rem]">{{ page.startIndex + idx + 1 }}</div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  {{ item.description }}
                </div>
                <div class="w-[6%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] text-black">
                  <CurrencyStack
                    :amount="item.unitPrice"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="documentExchangeRate"
                    primary-class="font-medium text-black whitespace-nowrap"
                    secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                    align="right"
                  />
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] font-medium text-black">
                  <CurrencyStack
                    :amount="item.amount"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="documentExchangeRate"
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
                <div class="w-[4%]"></div>
                <div class="flex-1"></div>
                <div class="w-[6%]"></div>
                <div class="w-[15%]"></div>
                <div class="w-[15%]"></div>
              </div>
            </div>
          </div>

          <!-- Totals Footer -->
          <div v-if="page.isLastPage" class="border-t border-[#062c58] mt-auto">
            <div class="flex items-stretch min-h-[140px]">
              <div class="w-[58%] border-r border-[#062c58] p-3">
                <span class="font-bold text-[0.6rem] block text-[#062c58] uppercase mb-2"
                  >REMARKS / NOTES:</span
                >
                <p class="text-[0.65rem] text-black/60 italic leading-tight uppercase">
                  {{ invoice?.notes || quotation?.notes || "-" }}
                </p>
              </div>
              <div class="w-[42%] flex flex-col">
                <div class="flex-1 flex flex-col">
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">SUBTOTAL</div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(invoice?.subTotal) }}
                    </div>
                  </div>
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">VAT / TAX</div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(invoice?.taxAmount) }}
                    </div>
                  </div>
                  <div class="flex bg-[#062c58] text-white flex-1 items-center">
                    <div class="w-1/2 px-3 flex flex-col">
                      <span class="text-[0.55rem] font-bold opacity-70">TOTAL AMOUNT</span>
                      <span
                        class="text-[0.8rem] font-black tracking-wider uppercase leading-none mt-1"
                        >{{ documentDisplayCurrency }}</span
                      >
                    </div>
                    <div class="flex-1 px-3 text-right font-mono text-xl font-black">
                      <CurrencyStack
                        :amount="invoice?.total"
                        :currency="documentCurrency"
                        :exchange-rate="documentExchangeRate"
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

        <!-- Signature -->
        <div v-if="page.isLastPage" class="mt-4 flex justify-between items-end">
          <div class="w-2/3">
            <p
              class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]"
            >
              Computer generated quotation. No signature required unless specifically requested by
              the recipient for legal compliance.
            </p>
          </div>
          <div class="text-center min-w-[200px]">
            <div class="text-[0.65rem] font-bold text-[#062c58] uppercase mb-12">
              AUTHORIZED SIGNATORY
            </div>
            <div class="w-full h-[0.5px] bg-[#062c58] mb-1"></div>
            <div class="text-[0.7rem] font-black text-[#062c58] uppercase">
              PT Nova Sync Continent
            </div>
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
