<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type {
  Quotation,
  QuotationInvoice,
  QuotationInvoiceItem,
} from "~/composables/useQuotations";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";

const props = defineProps<{
  quotation: Quotation | null;
  invoice: QuotationInvoice | null;
}>();

const invoiceItems = computed(() => props.invoice?.items || []);

const terbilang = (n: number): string => {
  if (n === 0) return "";
  const words = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];
  if (n < 12) return words[n] || "";
  if (n < 20) return terbilang(n - 10) + " Belas";
  if (n < 100) {
    const utama = Math.floor(n / 10);
    const sisa = n % 10;
    return (
      (utama === 1 ? "Sepuluh" : words[utama] + " Puluh") + (sisa > 0 ? " " + terbilang(sisa) : "")
    );
  }
  if (n < 1000) {
    const utama = Math.floor(n / 100);
    const sisa = n % 100;
    return (
      (utama === 1 ? "Seratus" : words[utama] + " Ratus") + (sisa > 0 ? " " + terbilang(sisa) : "")
    );
  }
  if (n < 1000000) {
    const utama = Math.floor(n / 1000);
    const sisa = n % 1000;
    return (
      (utama === 1 ? "Seribu" : terbilang(utama) + " Ribu") +
      (sisa > 0 ? " " + terbilang(sisa) : "")
    );
  }
  if (n < 1000000000) {
    const utama = Math.floor(n / 1000000);
    const sisa = n % 1000000;
    return terbilang(utama) + " Juta" + (sisa > 0 ? " " + terbilang(sisa) : "");
  }
  if (n < 1000000000000) {
    const utama = Math.floor(n / 1000000000);
    const sisa = n % 1000000000;
    return terbilang(utama) + " Miliar" + (sisa > 0 ? " " + terbilang(sisa) : "");
  }
  return "";
};

const numberToEnglish = (num: number): string => {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  const clt = (n: number): string => {
    let s = "";
    if (n >= 100) {
      s += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      s += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) s += ones[n] + " ";
    return s.trim();
  };
  let w = "";
  let si = 0;
  let tn = num;
  while (tn > 0) {
    const c = tn % 1000;
    if (c > 0) w = clt(c) + (scales[si] ? " " + scales[si] : "") + " " + w;
    tn = Math.floor(tn / 1000);
    si++;
  }
  return w.trim();
};

const amountInWords = computed(() => {
  const total = Number(props.invoice?.total || 0);
  if (!total) return "";
  const rupiahSpelling = terbilang(Math.floor(total)) + " Rupiah";
  const engSpelling = numberToEnglish(Math.floor(total)) + " Rupiahs";
  return `${rupiahSpelling} / ${engSpelling}`;
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

const formatCurrency = (amount: unknown): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const parts = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).formatToParts(d);
    return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
  } catch {
    return dateStr;
  }
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

const itemRowPx = (desc?: string | null) => {
  const lines = Math.max(1, Math.ceil((desc || "").length / DESC_CHARS_PER_LINE));
  return Math.max(ITEM_ROW_MIN_PX, lines * ITEM_LINE_PX + ITEM_ROW_PADDING_PX);
};

interface PreviewPage {
  items: QuotationInvoiceItem[];
  pageNumber: number;
  startIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const previewPages = computed<PreviewPage[]>(() => {
  const items = invoiceItems.value;
  const pages: Array<{ items: QuotationInvoiceItem[]; startIndex: number }> = [];
  let i = 0;
  let first = true;
  while (i < items.length) {
    const header = first ? FIRST_HEADER_PX : CONT_HEADER_PX;
    let budget = MAIN_PX - header - TABLE_HEADER_PX;
    const startIndex = i;
    const pageItems: QuotationInvoiceItem[] = [];
    while (i < items.length) {
      const item = items[i];
      if (!item) break;
      const h = itemRowPx(item.description);
      const reserve = i === items.length - 1 ? LAST_PAGE_RESERVE_PX : 0;
      if (budget - h - reserve < 0 && pageItems.length > 0) break;
      pageItems.push(item);
      i++;
      budget -= h;
    }
    pages.push({ items: pageItems, startIndex });
    first = false;
  }
  if (pages.length === 0) pages.push({ items: [], startIndex: 0 });
  return pages.map((page, idx) => ({
    ...page,
    pageNumber: idx + 1,
    isFirstPage: idx === 0,
    isLastPage: idx === pages.length - 1,
  }));
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const generatePDF = async () => {
  if (!printContainerRef.value || !props.invoice) return false;
  try {
    isGeneratingPDF.value = true;
    await nextTick();
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pages = printContainerRef.value.querySelectorAll(".a4-page-wrapper");
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }
    pdf.save(`QINVOICE_${props.invoice.number || "DRAFT"}.pdf`);
    return true;
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
              QUOTATION INVOICE
            </h1>
          </div>
        </div>

        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Parties & Invoice Info -->
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
                    >INVOICE NO.</span
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
                    formatDate(invoice?.date)
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
            <div class="w-1/3 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">POL / ORIGIN</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">{{
                quotation?.polName || quotation?.pol || quotation?.pickupAddress || "-"
              }}</span>
            </div>
            <div class="w-1/3 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">POD / DESTINATION</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">{{
                quotation?.podName || quotation?.pod || quotation?.deliveryAddress || "-"
              }}</span>
            </div>
            <div class="w-1/3 pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">CURRENCY</span>
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium">IDR</span>
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
                  {{ item.currency || "IDR" }} {{ formatCurrency(item.unitPrice) }}
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] font-medium text-black">
                  {{ item.currency || "IDR" }} {{ formatCurrency(item.amount) }}
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
                        >IDR</span
                      >
                    </div>
                    <div class="flex-1 px-3 text-right font-mono text-xl font-black">
                      {{ formatCurrency(invoice?.total) }}
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
              Computer generated invoice. No signature required unless specifically requested by the
              recipient for legal compliance.
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
