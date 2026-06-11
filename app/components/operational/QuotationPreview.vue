<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { Quotation } from "~/composables/useQuotations";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import { useFinanceTax, type Tax } from "~/composables/useFinanceTax";

const props = defineProps<{
  quotation: Quotation | null;
  organizationName?: string;
}>();

// Spellings & Words helpers (matches invoice style)
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

  const convertLessThanThousand = (n: number): string => {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  };

  let words = "";
  let scaleIndex = 0;
  let tempNum = num;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const chunkWords = convertLessThanThousand(chunk);
      words = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + words;
    }
    tempNum = Math.floor(tempNum / 1000);
    scaleIndex++;
  }

  return words.trim();
};

const amountInWords = computed(() => {
  const totals = groupedTotals.value;
  const parts: string[] = [];

  Object.entries(totals).forEach(([currency, t]) => {
    if (t.total <= 0) return;

    if (currency === "IDR") {
      const rupiahSpelling = terbilang(Math.floor(t.total)) + " Rupiah";
      parts.push(`IDR: ${rupiahSpelling}`);
    } else if (currency === "USD") {
      const integerPart = Math.floor(t.total);
      const decimalPart = Math.round((t.total - integerPart) * 100);
      let spelling = numberToEnglish(integerPart) + " US Dollars";
      if (decimalPart > 0) {
        spelling += " and " + numberToEnglish(decimalPart) + " Cents";
      }
      parts.push(`USD: ${spelling}`);
    } else {
      const integerPart = Math.floor(t.total);
      const decimalPart = Math.round((t.total - integerPart) * 100);
      let spelling = numberToEnglish(integerPart) + ` ${currency}`;
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

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  await loadBankAccounts();

  const taxRes = await fetchTaxes({ limit: 100 });
  if (taxRes && taxRes.items) {
    taxList.value = taxRes.items;
  }
});

const getTaxRateLabel = (taxId: string | null | undefined) => {
  if (!taxId) return "-";
  const found = taxList.value.find((t) => t.id === taxId);
  return found ? `${found.rate}%` : "-";
};

const groupedTotals = computed(() => {
  const totals: {
    IDR: { subTotal: number; taxAmount: number; total: number };
    USD: { subTotal: number; taxAmount: number; total: number };
    [key: string]: { subTotal: number; taxAmount: number; total: number };
  } = {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };

  if (!props.quotation?.charges) return totals;

  props.quotation.charges.forEach((ch) => {
    const currency = ch.currency || "IDR";
    if (!totals[currency]) {
      totals[currency] = { subTotal: 0, taxAmount: 0, total: 0 };
    }
    const qty = Number(ch.quantity || 0);
    const price = Number(ch.unitPrice || 0);
    const amount = qty * price;

    const tax = taxList.value.find((t) => t.id === ch.taxId);
    const rate = tax ? Number(tax.rate) : 0;
    const taxValue = amount * (rate / 100);

    totals[currency].subTotal += amount;
    totals[currency].taxAmount += taxValue;
  });

  // Round IDR
  totals.IDR.subTotal = Math.round(totals.IDR.subTotal);
  totals.IDR.taxAmount = Math.round(totals.IDR.taxAmount);
  totals.IDR.total = totals.IDR.subTotal + totals.IDR.taxAmount;

  totals.USD.total = totals.USD.subTotal + totals.USD.taxAmount;

  return totals;
});

const matchedBankAccount = computed(() => {
  if (!props.quotation) return null;

  return (
    bankAccounts.value.find((b) => b.currency === props.quotation?.currency) ||
    bankAccounts.value.find((b) => b.currency === "IDR") ||
    bankAccounts.value[0] ||
    null
  );
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const formatCurrency = (amount: unknown, currency?: string): string => {
  if (amount === undefined || amount === null) return "-";
  const num = Number(amount);
  const curr = currency || props.quotation?.currency || "IDR";
  return new Intl.NumberFormat(curr === "USD" ? "en-US" : "id-ID", {
    style: "decimal",
    minimumFractionDigits: curr === "IDR" ? 0 : 2,
    maximumFractionDigits: curr === "IDR" ? 0 : 2,
  }).format(num);
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

const tradeTypeLabel = computed(() => {
  const tradeType = props.quotation?.tradeTypeId;
  if (tradeType === "IMPORT") return "Import";
  if (tradeType === "DOMESTIC") return "Domestic";
  return "Export";
});

const serviceTypeLabel = computed(() => {
  const serviceType = props.quotation?.serviceType;
  if (serviceType === "TRUCKING") return "TRUCKING";
  if (serviceType === "CUSTOM_CLEARANCE") return "CUSTOM CLEARANCE";
  return "OCEAN (FREIGHT)";
});

const shipmentTypeLabel = computed(() => {
  const shipmentType = props.quotation?.shipmentType;
  if (shipmentType === "AIR") return "Air Freight";
  if (shipmentType === "OCEAN") return "Ocean Freight";
  return "-";
});

const isAirFreight = computed(
  () => props.quotation?.serviceType === "OCEAN" && props.quotation?.shipmentType === "AIR",
);
const isTrucking = computed(() => props.quotation?.serviceType === "TRUCKING");
const isCustomClearance = computed(() => props.quotation?.serviceType === "CUSTOM_CLEARANCE");

const originLabel = computed(() => {
  if (isTrucking.value) return "PICKUP ADDRESS";
  if (isCustomClearance.value) return "CLEARANCE ORIGIN / PORT";
  return isAirFreight.value ? "ORIGIN AIRPORT" : "PORT OF LOADING (POL)";
});

const destinationLabel = computed(() => {
  if (isTrucking.value) return "DELIVERY ADDRESS";
  if (isCustomClearance.value) return "CLEARANCE DESTINATION / PORT";
  return isAirFreight.value ? "DESTINATION AIRPORT" : "PORT OF DISCHARGE (POD)";
});

const originValue = computed(() => {
  if (isTrucking.value) return props.quotation?.pickupAddress || "-";
  return props.quotation?.polName || props.quotation?.pol || "-";
});

const destinationValue = computed(() => {
  if (isTrucking.value) return props.quotation?.deliveryAddress || "-";
  return props.quotation?.podName || props.quotation?.pod || "-";
});

const containerTypeValue = computed(() => {
  if (isCustomClearance.value) return "-";
  return props.quotation?.containerTypeName || props.quotation?.containerTypeId || "-";
});

const truckTypeValue = computed(() => {
  if (!isTrucking.value) return "-";
  return props.quotation?.truckType || "-";
});

const generatePDF = async () => {
  if (!printContainerRef.value || !props.quotation) return false;

  try {
    isGeneratingPDF.value = true;
    await nextTick();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pages = printContainerRef.value.querySelectorAll(".a4-page-wrapper");

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();

      const canvas = await html2canvas(pages[i] as HTMLElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    const filename = `QUOTATION_${props.quotation.number || "DRAFT"}.pdf`;
    pdf.save(filename);
    return true;
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
          <div class="w-[30%] text-center pb-1 flex flex-col justify-end h-full">
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              QUOTATION
            </h1>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">PAGE: 1 OF 1</div>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Parties & Quotation Info Header -->
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
                    formatDate(quotation?.date)
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 50px">
                <div class="w-full pt-2 px-3">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >VALID UNTIL</span
                  >
                  <span class="font-mono text-[0.75rem] text-black">{{
                    formatDate(quotation?.validUntil)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Sales Operational Info -->
          <div class="flex border-b border-[#062c58]" style="min-height: 45px">
            <div class="w-1/3 border-r border-[#062c58] pt-2 px-3 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1"
                >SALES REPRESENTATIVE</span
              >
              <span class="font-mono text-[0.75rem] uppercase text-black">
                {{ quotation?.salesName || "-" }}
              </span>
            </div>
            <div class="w-1/3 border-r border-[#062c58] pt-2 px-3 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">CUSTOMER PIC</span>
              <span class="font-mono text-[0.75rem] uppercase text-black">
                {{ quotation?.picName || "-" }}
              </span>
            </div>
            <div class="w-1/3 pt-2 px-3 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">FREE TIME</span>
              <span class="font-mono text-[0.75rem] uppercase text-black">
                {{ quotation?.freeTime || "-" }}
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
              <span class="font-bold text-[0.6rem] block leading-none mb-1">TYPE OF SHIPMENT</span>
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
              <span class="font-bold text-[0.6rem] block leading-none mb-1">{{ originLabel }}</span>
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

          <!-- Items Table Header -->
          <div
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[5%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">
              SERVICE / CHARGE DESCRIPTION
            </div>
            <div class="w-[8%] border-r border-[#062c58] flex items-center justify-center">QTY</div>
            <div class="w-[18%] border-r border-[#062c58] flex items-center justify-end px-3">
              UNIT PRICE
            </div>
            <div class="w-[12%] border-r border-[#062c58] flex items-center justify-center">
              TAX
            </div>
            <div class="w-[18%] flex items-center justify-end px-3">TOTAL AMOUNT</div>
          </div>

          <!-- Items List Container -->
          <div class="flex-1 relative">
            <!-- Vertical Grid Lines Background -->
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[5%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[8%] border-r border-[#062c58]/30"></div>
              <div class="w-[18%] border-r border-[#062c58]/30"></div>
              <div class="w-[12%] border-r border-[#062c58]/30"></div>
              <div class="w-[18%]"></div>
            </div>

            <!-- Scrollable Items Area -->
            <div class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in quotation?.charges || []"
                :key="idx"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[5%] text-center text-[0.7rem]">{{ idx + 1 }}</div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  <span>{{ item.description || "-" }}</span>
                </div>
                <div class="w-[8%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[18%] text-right px-3 text-[0.7rem] text-black">
                  {{ item.currency || "IDR" }} {{ formatCurrency(item.unitPrice, item.currency) }}
                </div>
                <div class="w-[12%] text-center text-[0.7rem] text-[#062c58]/80">
                  {{ getTaxRateLabel(item.taxId) }}
                </div>
                <div class="w-[18%] text-right px-3 text-[0.7rem] font-medium text-black">
                  {{ item.currency || "IDR" }} {{ formatCurrency(item.amount, item.currency) }}
                </div>
              </div>

              <!-- Empty spacer rows to maintain layout if few items -->
              <div
                v-if="(quotation?.charges?.length || 0) < 10"
                v-for="i in 10 - (quotation?.charges?.length || 0)"
                :key="'spacer-' + i"
                class="flex min-h-[35px] border-b border-[#062c58]/5"
              >
                <div class="w-[5%]"></div>
                <div class="flex-1"></div>
                <div class="w-[8%]"></div>
                <div class="w-[18%]"></div>
                <div class="w-[12%]"></div>
                <div class="w-[18%]"></div>
              </div>
            </div>
          </div>

          <!-- Notes & Totals Footer Area -->
          <div class="border-t border-[#062c58] mt-auto">
            <div class="flex items-stretch min-h-[140px]">
              <!-- Left: Remarks / Notes (full width) -->
              <div class="w-[58%] border-r border-[#062c58] p-3 flex flex-col justify-start gap-1">
                <span class="font-bold text-[0.6rem] block text-[#062c58] uppercase"
                  >REMARKS / NOTES:</span
                >
                <p
                  class="text-[0.65rem] text-black leading-normal uppercase whitespace-pre-wrap flex-1"
                >
                  {{ quotation?.notes || "-" }}
                </p>
              </div>

              <!-- Right: Subtotal & Tax & Total -->
              <div class="w-[42%] flex flex-col border-l border-[#062c58] bg-[#062c58]/5">
                <div class="flex-1 flex flex-col divide-y divide-[#062c58]/20">
                  <div v-for="(t, curr) in groupedTotals" :key="curr" class="p-2 space-y-1">
                    <div
                      v-if="
                        t.total > 0 ||
                        (curr === 'IDR' && Object.values(groupedTotals).every((x) => x.total === 0))
                      "
                      class="space-y-0.5"
                    >
                      <div
                        class="text-[0.6rem] font-extrabold text-[#062c58] uppercase tracking-wider"
                      >
                        {{ curr }} Charges
                      </div>
                      <div class="flex justify-between text-[0.65rem] text-black">
                        <span class="opacity-70 font-semibold">Subtotal</span>
                        <span class="font-bold">{{ formatCurrency(t.subTotal, curr) }}</span>
                      </div>
                      <div class="flex justify-between text-[0.65rem] text-black">
                        <span class="opacity-70 font-semibold">VAT / Tax</span>
                        <span class="font-bold">{{ formatCurrency(t.taxAmount, curr) }}</span>
                      </div>
                      <div
                        class="flex justify-between text-[0.7rem] font-extrabold text-[#062c58] pt-0.5 border-t border-dashed border-[#062c58]/30"
                      >
                        <span>Total Amount</span>
                        <span>{{ curr }} {{ formatCurrency(t.total, curr) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Authorized Signature & Footer Credits -->
        <div class="mt-4 flex justify-between items-end">
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
</style>
