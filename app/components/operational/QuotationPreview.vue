<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- loose quotation charge data */
import { ref, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import type { Quotation, QuotationCharge } from "~/composables/useQuotations";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";
import { useServices, type Service } from "~/composables/useServices";
import CurrencyStack from "~/components/ui/CurrencyStack.vue";
import { formatCurrencyDecimal, formatExchangeRateLabel } from "~/utils/currency";
import { numberToEnglishWords, numberToIndonesianWords } from "~/utils/numberWords";
import { paginatePdfRows, type PdfRowPage } from "~/utils/pdfPagination";
import {
  formatQuotationDate,
  getQuotationPreviewGroupedTotals,
  getQuotationRouteDisplay,
  getQuotationServiceLabels,
} from "~/utils/quotation-display";
import { renderA4Pdf } from "~/utils/pdfRender";

const props = defineProps<{
  quotation: Quotation | null;
  organizationName?: string;
}>();

const amountInWords = computed(() => {
  const totals = groupedTotals.value;
  const parts: string[] = [];

  Object.entries(totals).forEach(([currency, t]) => {
    if (t.total <= 0) return;

    if (currency === "IDR") {
      const rupiahSpelling = numberToIndonesianWords(Math.floor(t.total)) + " Rupiah";
      parts.push(`IDR: ${rupiahSpelling}`);
    } else if (currency === "USD") {
      const integerPart = Math.floor(t.total);
      const decimalPart = Math.round((t.total - integerPart) * 100);
      let spelling = numberToEnglishWords(integerPart) + " US Dollars";
      if (decimalPart > 0) {
        spelling += " and " + numberToEnglishWords(decimalPart) + " Cents";
      }
      parts.push(`USD: ${spelling}`);
    } else {
      const integerPart = Math.floor(t.total);
      const decimalPart = Math.round((t.total - integerPart) * 100);
      let spelling = numberToEnglishWords(integerPart) + ` ${currency}`;
      if (decimalPart > 0) {
        spelling += ` and ${decimalPart}/100`;
      }
      parts.push(`${currency}: ${spelling}`);
    }
  });

  return parts.join(" | ");
});

const logoUrl = ref("/images/transparentnscontinenttebal.png");
const bankAccounts = ref<BankAccount[]>([]);
const { fetchBankAccounts } = useBankAccounts();

const loadBankAccounts = async () => {
  const res = await fetchBankAccounts({ isActive: true });
  if (res.success) {
    bankAccounts.value = res.data || [];
  }
};

const { fetchTaxes } = useFinanceTax();
const taxList = ref<Tax[]>([]);

const { fetchServices } = useServices();
const serviceList = ref<Service[]>([]);

const serviceUnitMap = computed(() => {
  const map = new Map<string, string>();
  serviceList.value.forEach((s) => {
    if (s.unit?.name) map.set(s.id, s.unit.name);
  });
  return map;
});

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  await loadBankAccounts();

  const taxRes = await fetchTaxes({ limit: 100 });
  if (taxRes && taxRes.items) {
    taxList.value = taxRes.items;
  }

  const servicesRes = await fetchServices();
  if (servicesRes && servicesRes.data) {
    serviceList.value = servicesRes.data;
  }
});

const getTaxRateLabel = (taxId: string | null | undefined) => {
  if (!taxId) {
    const fallbackId = props.quotation?.taxId;
    if (!fallbackId) return "-";
    const found = taxList.value.find((t) => t.id === fallbackId);
    return found ? `${found.rate}%` : "-";
  }
  const found = taxList.value.find((t) => t.id === taxId);
  return found ? `${found.rate}%` : "-";
};

const groupedTotals = computed(() =>
  getQuotationPreviewGroupedTotals(props.quotation || {}, taxList.value),
);

const visibleGroupedTotals = computed(() => {
  const totals = groupedTotals.value;
  const entries = Object.entries(totals).filter(([, t]) => t.total > 0);

  if (entries.length === 0) {
    return [["IDR", totals.IDR || { subTotal: 0, taxAmount: 0, total: 0 }]] as Array<
      [string, { subTotal: number; taxAmount: number; total: number }]
    >;
  }

  return entries as Array<[string, { subTotal: number; taxAmount: number; total: number }]>;
});

const matchedBankAccount = computed(() =>
  props.quotation ? selectBankAccount(bankAccounts.value, props.quotation.currency) : null,
);

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const exchangeRateLabel = computed(() => {
  return formatExchangeRateLabel(props.quotation?.exchangeRate, {
    idrPosition: "prefix",
    defaultLabel: "1 USD = USD 1",
  });
});

const serviceLabels = computed(() => getQuotationServiceLabels(props.quotation || {}));
const routeDisplay = computed(() =>
  getQuotationRouteDisplay(props.quotation || {}, { labelCase: "upper" }),
);

const tradeTypeLabel = computed(() => serviceLabels.value.tradeTypeLabel);
const serviceTypeLabel = computed(() => serviceLabels.value.serviceTypeLabel);
const shipmentTypeLabel = computed(() => serviceLabels.value.shipmentTypeLabel);
const originLabel = computed(() => routeDisplay.value.originLabel);
const destinationLabel = computed(() => routeDisplay.value.destinationLabel);
const originValue = computed(() => routeDisplay.value.originValue);
const destinationValue = computed(() => routeDisplay.value.destinationValue);
const containerTypeValue = computed(() => routeDisplay.value.containerTypeValue);
const truckTypeValue = computed(() => routeDisplay.value.truckTypeValue);

const MAIN_PX = 1009;
const FIRST_HEADER_PX = 250;
const CONT_HEADER_PX = 42;
const TABLE_HEADER_PX = 35;
const SUMMARY_FOOTER_BASE_PX = 132;
const SUMMARY_FOOTER_EXTRA_CURRENCY_PX = 86;
const SIGNATURE_PX = 110;
const LAST_PAGE_GAP_PX = 20;
const ITEM_ROW_MIN_PX = 35;
const ITEM_LINE_PX = 14;
const ITEM_ROW_PADDING_PX = 14;
const DESC_CHARS_PER_LINE = 42;

const summaryFooterPx = computed(() => {
  const currencyCount = Math.max(1, visibleGroupedTotals.value.length);
  return SUMMARY_FOOTER_BASE_PX + (currencyCount - 1) * SUMMARY_FOOTER_EXTRA_CURRENCY_PX;
});

const lastPageReservePx = computed(() => summaryFooterPx.value + SIGNATURE_PX + LAST_PAGE_GAP_PX);

const itemRowPx = (item?: QuotationCharge | null) => {
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

const previewPages = computed<PdfRowPage<QuotationCharge>[]>(() =>
  paginatePdfRows({
    items: props.quotation?.charges || [],
    mainHeightPx: MAIN_PX,
    firstHeaderPx: FIRST_HEADER_PX,
    continuationHeaderPx: CONT_HEADER_PX,
    tableHeaderPx: TABLE_HEADER_PX,
    lastPageReservePx: lastPageReservePx.value,
    getRowHeightPx: itemRowPx,
  }),
);

const generatePDF = async () => {
  if (!printContainerRef.value || !props.quotation) return false;

  try {
    isGeneratingPDF.value = true;
    return await renderA4Pdf(printContainerRef.value, {
      filename: `QUOTATION_${props.quotation.number || "DRAFT"}.pdf`,
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

defineExpose({
  generatePDF,
  isGeneratingPDF,
});
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
        <!-- Header Section -->
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
          <div class="w-[30%] text-center pb-3 flex flex-col justify-end h-full">
            <h1 class="text-xl font-bold tracking-widest uppercase leading-tight text-[#062c58]">
              QUOTATION
            </h1>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ page.pageNumber }} OF {{ previewPages.length }}
            </div>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 min-h-0 flex flex-col text-[0.7rem] relative overflow-hidden"
        >
          <!-- Parties & Quotation Info Header (first page only) -->
          <template v-if="page.isFirstPage">
            <div class="flex border-b border-[#062c58]" style="min-height: 100px">
              <div
                class="w-1/2 border-r border-[#062c58] pt-2 px-3 pb-2 flex flex-col justify-between"
              >
                <div>
                  <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                    >QUOTATION TO:</span
                  >
                  <div class="text-xs text-black uppercase leading-tight">
                    {{ quotation?.customerName || "-" }}
                  </div>
                  <div
                    class="text-[0.65rem] text-black leading-normal mt-1 uppercase whitespace-pre-wrap"
                  >
                    {{ quotation?.customerAddress || "-" }}
                  </div>
                </div>
              </div>
              <div class="w-1/2">
                <div class="flex border-b border-[#062c58]" style="height: 50px">
                  <div class="w-1/2 border-r border-[#062c58] pt-2 px-3">
                    <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                      >QUOTATION NO.</span
                    >
                    <span class="font-mono text-[0.8rem] text-black">{{
                      quotation?.number || "DRAFT"
                    }}</span>
                  </div>
                  <div class="w-1/2 pt-2 px-3">
                    <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                      >DATE</span
                    >
                    <span class="font-mono text-[0.75rem] text-black">{{
                      formatQuotationDate(quotation?.date, "pdf")
                    }}</span>
                  </div>
                </div>
                <div class="flex" style="height: 50px">
                  <div class="w-full pt-2 px-3">
                    <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                      >VALID UNTIL</span
                    >
                    <span class="font-mono text-[0.75rem] text-black">{{
                      formatQuotationDate(quotation?.validUntil, "pdf")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Secondary Sales Operational Info -->
            <div class="flex border-b border-[#062c58]" style="min-height: 45px">
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1"
                  >SALES REPRESENTATIVE</span
                >
                <span class="font-mono text-[0.75rem] uppercase text-black">
                  {{ quotation?.salesName || "-" }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">CUSTOMER PIC</span>
                <span class="font-mono text-[0.75rem] uppercase text-black">
                  {{ quotation?.picName || "-" }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">FREE TIME</span>
                <span class="font-mono text-[0.75rem] uppercase text-black">
                  {{ quotation?.freeTime || "-" }}
                </span>
              </div>
              <div class="w-1/4 pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">EXCHANGE RATE</span>
                <span class="font-mono text-[0.65rem] uppercase text-black font-bold">
                  {{ exchangeRateLabel }}
                </span>
              </div>
            </div>

            <!-- Routing & Cargo Info -->
            <div class="flex border-b border-[#062c58]" style="min-height: 45px">
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">TRADE TYPE</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ tradeTypeLabel }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">SERVICE TYPE</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ serviceTypeLabel }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1"
                  >TYPE OF SHIPMENT</span
                >
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ shipmentTypeLabel }}
                </span>
              </div>
              <div class="w-1/4 pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">TRUCK TYPE</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ truckTypeValue }}
                </span>
              </div>
            </div>

            <div class="flex border-b border-[#062c58]" style="min-height: 45px">
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">{{
                  originLabel
                }}</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ originValue }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">{{
                  destinationLabel
                }}</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ destinationValue }}
                </span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">CONTAINER TYPE</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ containerTypeValue }}
                </span>
              </div>
              <div class="w-1/4 pt-2 px-3 pb-1">
                <span class="font-bold text-[0.6rem] block leading-none mb-1">TERM</span>
                <span class="font-mono text-[0.7rem] uppercase text-black">
                  {{ quotation?.term || "-" }}
                </span>
              </div>
            </div>
          </template>

          <!-- Continuation header (page 2+) -->
          <template v-else>
            <div
              class="flex border-b border-[#062c58] items-center px-3 bg-white"
              style="min-height: 40px"
            >
              <span class="font-bold text-[0.6rem] uppercase tracking-wider text-[#062c58]">
                QUOTATION {{ quotation?.number || "DRAFT" }} — {{ quotation?.customerName || "-" }}
                (CONTINUED)
              </span>
            </div>
          </template>

          <!-- Items Table Header -->
          <div
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[4%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">
              SERVICE / CHARGE DESCRIPTION
            </div>
            <div class="w-[6%] border-r border-[#062c58] flex items-center justify-center">QTY</div>
            <div class="w-[11%] border-r border-[#062c58] flex items-center justify-center">
              UOP
            </div>
            <div class="w-[15%] border-r border-[#062c58] flex items-center justify-end px-3">
              UNIT PRICE
            </div>
            <div class="w-[10%] border-r border-[#062c58] flex items-center justify-center">
              TAX
            </div>
            <div class="w-[15%] flex items-center justify-end px-3">TOTAL AMOUNT</div>
          </div>

          <!-- Items List Container -->
          <div class="flex-1 min-h-0 overflow-hidden relative">
            <!-- Vertical Grid Lines Background -->
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[4%] border-r border-[#062c58]/45"></div>
              <div class="flex-1 border-r border-[#062c58]/45"></div>
              <div class="w-[6%] border-r border-[#062c58]/45"></div>
              <div class="w-[11%] border-r border-[#062c58]/45"></div>
              <div class="w-[15%] border-r border-[#062c58]/45"></div>
              <div class="w-[10%] border-r border-[#062c58]/45"></div>
              <div class="w-[15%]"></div>
            </div>

            <!-- Scrollable Items Area -->
            <div class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in page.items"
                :key="page.startIndex + idx"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[4%] text-center text-[0.7rem]">{{ page.startIndex + idx + 1 }}</div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  <span>{{ item.description || "-" }}</span>
                </div>
                <div class="w-[6%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[11%] text-center text-[0.7rem] font-medium text-black/70">
                  {{ item.serviceId ? serviceUnitMap.get(item.serviceId) || "-" : "-" }}
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] text-black">
                  <template v-if="item.atCost">AT COST</template>
                  <CurrencyStack
                    v-else
                    :amount="item.unitPrice"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="quotation?.exchangeRate"
                    primary-class="font-medium text-black whitespace-nowrap"
                    secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                    align="right"
                  />
                </div>
                <div class="w-[10%] text-center text-[0.7rem] text-[#062c58]/80">
                  {{ getTaxRateLabel(item.taxId) }}
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] font-medium text-black">
                  <template v-if="item.atCost">AT COST</template>
                  <CurrencyStack
                    v-else
                    :amount="item.amount"
                    :currency="item.currency || 'IDR'"
                    :exchange-rate="quotation?.exchangeRate"
                    primary-class="font-semibold text-black whitespace-nowrap"
                    secondary-class="text-[0.5rem] text-muted-foreground italic whitespace-nowrap"
                    align="right"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Notes & Totals Footer Area (last page only) -->
          <div v-if="page.isLastPage" class="border-t border-[#062c58] mt-auto shrink-0">
            <div class="flex items-stretch" :style="{ minHeight: `${summaryFooterPx}px` }">
              <!-- Left: Remarks / Notes (full width) -->
              <div
                class="w-[58%] border-r border-[#062c58] p-2 flex flex-col justify-start gap-1 min-w-0"
              >
                <span class="font-bold text-[0.55rem] block text-[#062c58] uppercase"
                  >REMARKS / NOTES:</span
                >
                <p
                  class="text-[0.52rem] text-black leading-[1.25] uppercase whitespace-pre-wrap flex-1 overflow-hidden"
                >
                  {{ quotation?.notes || "-" }}
                </p>
              </div>

              <!-- Right: Subtotal & Tax & Total -->
              <div class="w-[42%] flex flex-col border-l border-[#062c58] bg-[#062c58]/5">
                <div
                  class="flex-1"
                  :class="
                    visibleGroupedTotals.length > 1
                      ? 'flex flex-col divide-y divide-[#062c58]/20'
                      : 'grid grid-cols-1'
                  "
                >
                  <table
                    v-for="[curr, t] in visibleGroupedTotals"
                    :key="curr"
                    class="quotation-total-table"
                    :class="visibleGroupedTotals.length > 1 ? 'flex-1' : ''"
                  >
                    <tbody>
                      <tr>
                        <th colspan="2" class="quotation-total-heading">{{ curr }} Charges</th>
                      </tr>
                      <tr>
                        <td>Subtotal</td>
                        <td class="amount">{{ formatCurrencyDecimal(t.subTotal, curr) }}</td>
                      </tr>
                      <tr>
                        <td>VAT / Tax</td>
                        <td class="amount">{{ formatCurrencyDecimal(t.taxAmount, curr) }}</td>
                      </tr>
                      <tr class="grand">
                        <td>Total</td>
                        <td class="amount">
                          {{ curr }} {{ formatCurrencyDecimal(t.total, curr) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Authorized Signature & Footer Credits (last page only) -->
        <div v-if="page.isLastPage" class="mt-4 shrink-0 flex justify-between items-end">
          <div class="w-[55%]">
            <p class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium">
              This quotation is a formal proposal for standard cargo services. All quotes are
              subject to final container loading and space availability at departure. To accept this
              proposal, please sign and return this page.
            </p>
          </div>

          <div class="flex gap-4">
            <div class="text-center min-w-[140px] flex flex-col justify-between">
              <span class="text-[0.55rem] font-bold text-[#062c58]/70 uppercase leading-none mb-10"
                >CUSTOMER ACCEPTANCE</span
              >
              <div class="w-full h-[0.5px] bg-[#062c58] mb-1"></div>
              <span class="text-[0.6rem] font-bold text-black/60 uppercase">SIGN & DATE</span>
            </div>

            <div class="text-center min-w-[160px] flex flex-col justify-between">
              <span class="text-[0.55rem] font-bold text-[#062c58]/70 uppercase leading-none mb-10"
                >PT Nova Sync Continent</span
              >
              <div class="w-full h-[0.5px] bg-[#062c58] mb-1"></div>
              <span class="text-[0.6rem] font-black text-[#062c58] uppercase"
                >AUTHORIZED REPRESENTATIVE</span
              >
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

@font-face {
  font-family: "Inter";
  src: url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");
}

.font-sans {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}

.quotation-total-table {
  border-collapse: separate;
  border-spacing: 0;
  color: #000;
  font-family: inherit;
  font-size: 10px;
  line-height: 1.45;
  padding: 10px 8px;
  table-layout: fixed;
  width: 100%;
}

.quotation-total-table th,
.quotation-total-table td {
  border: 0;
  height: 18px;
  padding: 1px 0;
  vertical-align: middle;
}

.quotation-total-heading {
  color: #062c58;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 16px;
  padding-bottom: 3px !important;
  text-align: left;
  text-transform: uppercase;
}

.quotation-total-table td:first-child {
  color: rgb(0 0 0 / 70%);
  font-weight: 700;
  width: 38%;
}

.quotation-total-table .amount {
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
  width: 62%;
}

.quotation-total-table .grand td {
  border-top: 1px dashed rgb(6 44 88 / 45%);
  color: #062c58;
  font-size: 11px;
  font-weight: 800;
  height: 24px;
  padding-top: 7px;
}
</style>
