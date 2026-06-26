<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { InvoiceDetail } from "~/composables/useInvoices";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";
import { useServices, type Service } from "~/composables/useServices";

const props = defineProps<{
  invoice: InvoiceDetail | null;
  organizationName?: string;
  mode?: "invoice" | "receipt";
  receiptAmount?: number;
  receiptDate?: string;
}>();

const mode = computed(() => props.mode || "invoice");

// Tax line in the totals: PPh is a withholding tax shown as a deduction; PPN is added.
const firstTax = computed(() => props.invoice?.invoiceTaxes?.[0] || null);
const isWithholdingTax = computed(() => (firstTax.value?.taxType || "").toLowerCase() === "pph");
const taxRatesLabel = computed(() => {
  const taxesArr = props.invoice?.invoiceTaxes || [];
  if (!taxesArr.length) return "0%";
  return Array.from(new Set(taxesArr.map((t) => Number(t.rate))))
    .map((r) => r + "%")
    .join(", ");
});
const taxDisplayAmount = computed(() =>
  Number(firstTax.value?.taxAmount ?? props.invoice?.taxAmount ?? 0),
);

const headerTitle = computed(() => {
  if (mode.value === "receipt") return "";
  return props.invoice?.status?.code === "draft" ? "PROFORMA INVOICE" : "COMMERCIAL INVOICE";
});

const invoiceTitle = computed(() => {
  if (mode.value === "receipt") return "OFFICIAL RECEIPT";

  const invoiceTaxes = props.invoice?.invoiceTaxes || [];
  if (invoiceTaxes.length === 0) {
    return "INVOICE REIMBURSEMENT";
  }

  const allZero = invoiceTaxes.every((t) => Number(t.rate) === 0);
  if (allZero) {
    return "INVOICE REIMBURSEMENT";
  }

  return "INVOICE";
});

// Helper for "Sum in Words" (Robust Indonesian Terbilang)
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

// Helper for English number spelling
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
  const total =
    props.receiptAmount !== undefined ? props.receiptAmount : Number(props.invoice?.total || 0);
  if (!total) return "";
  const currency = props.invoice?.currency || "IDR";

  if (currency === "IDR") {
    const rupiahSpelling = terbilang(Math.floor(total)) + " Rupiah";
    const engSpelling = numberToEnglish(Math.floor(total)) + " Rupiahs";
    return `${rupiahSpelling} / ${engSpelling}`;
  } else {
    const integerPart = Math.floor(total);
    const decimalPart = Math.round((total - integerPart) * 100);

    let spelling = numberToEnglish(integerPart);
    if (currency === "USD") {
      spelling += " US Dollars";
      if (decimalPart > 0) {
        spelling += " and " + numberToEnglish(decimalPart) + " Cents";
      }
    } else {
      spelling += ` ${currency}`;
      if (decimalPart > 0) {
        spelling += ` and ${decimalPart}/100`;
      }
    }
    return spelling;
  }
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

  const servicesRes = await fetchServices();
  if (servicesRes && servicesRes.data) {
    serviceList.value = servicesRes.data;
  }
});

const matchedBankAccount = computed(() => {
  if (!props.invoice) return null;

  return (
    bankAccounts.value.find((b) => b.currency === props.invoice?.currency) ||
    bankAccounts.value.find((b) => b.currency === "IDR") ||
    bankAccounts.value[0] ||
    null
  );
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const getVal = (val: unknown, fallback: unknown = "") =>
  val ? String(val) : fallback ? String(fallback) : "";

const displayAddress = computed(() => {
  if (props.invoice?.companyAddress) return props.invoice.companyAddress;

  const company = props.invoice?.company;
  const addresses = company?.addresses;

  if (addresses && addresses.length > 0) {
    const defaultAddr = addresses.find((a) => a.isDefault);
    const firstAddr = addresses[0];
    return defaultAddr?.fullAddress || firstAddr?.fullAddress || "-";
  }

  return company?.address || "-";
});

const allContainerNumbers = computed(() => {
  const job = props.invoice?.job;
  const bls = job?.billsOfLading || [];
  const jobContainers = job?.jobContainers || [];
  const numbers = new Set<string>();

  // Use numbers from BLs
  bls.forEach((bl) => {
    if (bl.containerNumber) numbers.add(bl.containerNumber);
    bl.blContainers?.forEach((bc) => {
      if (bc.container?.containerNumber) numbers.add(bc.container.containerNumber);
    });
  });

  // Use numbers from Job Containers (fallback/additional)
  jobContainers.forEach((jc) => {
    if (jc.containerNumber) numbers.add(jc.containerNumber);
  });

  const uniqueList = Array.from(numbers).filter((n) => !!n);
  return uniqueList.length > 0 ? uniqueList.toSorted().join(", ") : "-";
});

const allContainerTypes = computed(() => {
  const job = props.invoice?.job;
  const bls = job?.billsOfLading || [];
  const jobContainers = job?.jobContainers || [];

  const processedContainerIds = new Set<string>();
  const typeCounts = new Map<string, number>();

  const processContainer = (
    idStr: string | null | undefined,
    typeCode: string | null | undefined,
  ) => {
    if (!typeCode) return;

    const uniqueId = idStr || `unknown-${Math.random()}`;

    if (processedContainerIds.has(uniqueId)) return;
    processedContainerIds.add(uniqueId);

    typeCounts.set(typeCode, (typeCounts.get(typeCode) || 0) + 1);
  };

  bls.forEach((bl) => {
    // Top-level containers in BL
    if (bl.containerType?.code) {
      processContainer(bl.id, bl.containerType.code);
    }
    // Linked containers in BL
    bl.blContainers?.forEach((bc) => {
      if (bc.container?.containerType?.code) {
        processContainer(
          bc.container.id || bc.container.containerNumber,
          bc.container.containerType.code,
        );
      }
    });
  });

  jobContainers.forEach((jc) => {
    if (jc.containerType?.code) {
      processContainer(jc.id || jc.containerNumber, jc.containerType.code);
    }
  });

  const parts: string[] = [];
  typeCounts.forEach((count, type) => {
    parts.push(`${count}x${type}`);
  });

  return parts.length > 0 ? parts.toSorted().join(", ") : "-";
});

const formatCurrency = (amount: unknown): string => {
  if (amount === undefined || amount === null) return "-";
  const num = Number(amount);
  return new Intl.NumberFormat(props.invoice?.currency === "USD" ? "en-US" : "id-ID", {
    style: "decimal",
    minimumFractionDigits: props.invoice?.currency === "IDR" ? 0 : 2,
    maximumFractionDigits: props.invoice?.currency === "IDR" ? 0 : 2,
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

type InvoicePreviewItem = InvoiceDetail["items"][number];

interface InvoicePreviewPage {
  items: InvoicePreviewItem[];
  pageNumber: number;
  startIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const FIRST_PAGE_ITEM_SLOTS = 10;
const CONTINUATION_PAGE_ITEM_SLOTS = 18;
const DESCRIPTION_CHARS_PER_SLOT = 52;

const getItemSlotCount = (description?: string | null) =>
  Math.max(1, Math.ceil((description || "").length / DESCRIPTION_CHARS_PER_SLOT));

const paginatedInvoicePages = computed<InvoicePreviewPage[]>(() => {
  const items = props.invoice?.items || [];
  const pages: Array<{ items: InvoicePreviewItem[]; startIndex: number }> = [];

  let currentItems: InvoicePreviewItem[] = [];
  let currentStartIndex = 0;
  let currentSlots = 0;
  let currentBudget = FIRST_PAGE_ITEM_SLOTS;

  items.forEach((item, index) => {
    const itemSlots = getItemSlotCount(item.description);
    const shouldStartNewPage = currentItems.length > 0 && currentSlots + itemSlots > currentBudget;

    if (shouldStartNewPage) {
      pages.push({ items: currentItems, startIndex: currentStartIndex });
      currentItems = [];
      currentStartIndex = index;
      currentSlots = 0;
      currentBudget = CONTINUATION_PAGE_ITEM_SLOTS;
    }

    currentItems.push(item);
    currentSlots += itemSlots;
  });

  if (currentItems.length > 0 || pages.length === 0) {
    pages.push({ items: currentItems, startIndex: currentStartIndex });
  }

  return pages.map((page, index) => ({
    ...page,
    pageNumber: index + 1,
    isFirstPage: index === 0,
    isLastPage: index === pages.length - 1,
  }));
});

const previewPages = computed<InvoicePreviewPage[]>(() => {
  if (mode.value === "receipt") {
    return [
      {
        items: [],
        pageNumber: 1,
        startIndex: 0,
        isFirstPage: true,
        isLastPage: true,
      },
    ];
  }
  return paginatedInvoicePages.value;
});

const generatePDF = async () => {
  if (!printContainerRef.value || !props.invoice) return false;

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

    const filename =
      mode.value === "receipt"
        ? `RECEIPT_${props.invoice.invoiceNumber || "DRAFT"}.pdf`
        : `INVOICE_${props.invoice.invoiceNumber || "DRAFT"}.pdf`;
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
          <div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full">
            <!-- <span class="text-xs font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]">
              {{ headerTitle }}
            </span> -->
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ page.pageNumber }} OF {{ previewPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              {{ invoiceTitle }}
            </h1>
          </div>
        </div>

        <!-- Receipt Mode Labels (Subtitle) -->
        <div
          v-if="mode === 'receipt'"
          class="text-center py-2 bg-[#062c58] text-white text-[10px] font-bold tracking-[0.4em] uppercase"
        >
          Kwitansi Pembayaran
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Receipt Header / Metadata (Matches Invoice Info Grid Style!) -->
          <div
            v-if="mode === 'receipt'"
            class="flex border-b border-[#062c58]"
            style="min-height: 100px"
          >
            <div class="w-1/2 border-r border-[#062c58] pt-2 px-4 pb-2">
              <span
                class="font-bold mb-1 text-[0.6rem] leading-none block uppercase text-[#062c58]/80"
                >RECEIPT TO (PAYER):</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ getVal(invoice?.companyName, invoice?.company?.name) }}
              </div>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[0.65rem] leading-tight text-black/80 mt-1"
              >
                {{ displayAddress }}
              </div>
            </div>
            <div class="w-1/2 flex flex-col justify-between">
              <div class="flex border-b border-[#062c58] flex-1">
                <div class="w-1/2 border-r border-[#062c58] pt-2 px-4">
                  <span
                    class="font-bold text-[0.6rem] leading-none mb-1 block uppercase text-[#062c58]/80"
                    >RECEIPT NO.</span
                  >
                  <span class="font-mono text-[0.8rem] text-black font-semibold"
                    >REC-{{ getVal(invoice?.invoiceNumber, "DRAFT") }}</span
                  >
                </div>
                <div class="w-1/2 pt-2 px-4">
                  <span
                    class="font-bold text-[0.6rem] leading-none mb-1 block uppercase text-[#062c58]/80"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatDate(invoice?.issuedDate)
                  }}</span>
                </div>
              </div>
              <div class="flex flex-1">
                <div class="w-1/2 border-r border-[#062c58] pt-2 px-4">
                  <span
                    class="font-bold text-[0.6rem] leading-none mb-1 block uppercase text-[#062c58]/80"
                    >REF INVOICE NO.</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-semibold">{{
                    getVal(invoice?.invoiceNumber, "DRAFT")
                  }}</span>
                </div>
                <div class="w-1/2 pt-2 px-4">
                  <span
                    class="font-bold text-[0.6rem] leading-none mb-1 block uppercase text-[#062c58]/80"
                    >JOB NO.</span
                  >
                  <span class="font-mono text-[0.75rem] text-black">{{
                    getVal(invoice?.job?.jobNumber, "-")
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Receipt Body (Only in Receipt Mode) -->
          <div
            v-if="mode === 'receipt'"
            class="p-8 flex-1 flex flex-col justify-between"
            style="min-height: 400px"
          >
            <div class="space-y-6">
              <!-- Received From Row -->
              <div
                class="grid grid-cols-[150px_1fr] items-center border-b border-[#062c58]/20 pb-2"
              >
                <span class="text-[0.65rem] font-bold text-[#062c58] uppercase tracking-wider"
                  >Received From:</span
                >
                <span class="text-sm font-bold text-black uppercase">{{
                  getVal(invoice?.companyName, invoice?.company?.name)
                }}</span>
              </div>

              <!-- Amount in Words Row (Say In Words / Terbilang) -->
              <div class="grid grid-cols-[150px_1fr] items-start border-b border-[#062c58]/20 pb-2">
                <span
                  class="text-[0.65rem] font-bold text-[#062c58] uppercase tracking-wider pt-0.5"
                  >The Sum Of:</span
                >
                <div
                  class="bg-gray-50 border border-dashed border-[#062c58]/30 rounded p-3 font-mono text-[0.75rem] leading-normal text-[#062c58] uppercase italic font-bold"
                >
                  # {{ amountInWords }} #
                </div>
              </div>

              <!-- Payment For Row -->
              <div
                class="grid grid-cols-[150px_1fr] items-center border-b border-[#062c58]/20 pb-2"
              >
                <span class="text-[0.65rem] font-bold text-[#062c58] uppercase tracking-wider"
                  >Payment For:</span
                >
                <span class="text-[0.7rem] font-medium text-black uppercase leading-tight">
                  Payment for Invoice #{{ invoice?.invoiceNumber }} -
                  {{ invoice?.notes || "Services Rendered" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Full-Width Amount Paid Bar (Only in Receipt Mode) -->
          <div
            v-if="mode === 'receipt'"
            class="border-t border-[#062c58] bg-[#062c58] text-white flex items-stretch mt-auto min-h-[60px]"
          >
            <div class="w-[30%] px-6 py-3 flex flex-col justify-center border-r border-white/20">
              <span
                class="text-[0.55rem] font-bold tracking-[0.2em] uppercase opacity-75 leading-none"
                >AMOUNT PAID</span
              >
              <span class="text-xs font-black tracking-wider uppercase mt-1">{{
                invoice?.currency || "IDR"
              }}</span>
            </div>
            <div
              class="flex-1 px-8 py-3 flex items-center justify-end font-mono text-xl font-black tracking-tight"
            >
              {{ formatCurrency(receiptAmount !== undefined ? receiptAmount : invoice?.total) }}
            </div>
          </div>

          <!-- Parties & Invoice Info (Hide Items Table in Receipt mode for cleaner look) -->
          <div
            v-if="mode === 'invoice' && page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 100px"
          >
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                >BILL TO:</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ getVal(invoice?.companyName, invoice?.company?.name) }}
              </div>
              <div
                class="whitespace-pre-wrap font-mono uppercase text-[0.65rem] leading-tight text-black/80 mt-1"
              >
                {{ displayAddress }}
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >INVOICE NO.</span
                  >
                  <span class="font-mono text-[0.85rem] text-black font-medium">{{
                    getVal(invoice?.invoiceNumber, "DRAFT")
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatDate(invoice?.issuedDate)
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >JOB NO.</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-medium">{{
                    getVal(invoice?.job?.jobNumber, "-")
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DUE DATE</span
                  >
                  <span class="font-mono text-[0.75rem] text-black">{{
                    formatDate(invoice?.dueDate)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipment Operational Info Row 1 -->
          <div
            v-if="mode === 'invoice' && page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 45px"
          >
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">VESSEL / VOYAGE</span>
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium">
                {{
                  invoice?.job?.vessels?.[0]?.vessel?.name ||
                  invoice?.job?.vessels?.[0]?.vesselName ||
                  invoice?.job?.vessel?.name ||
                  "-"
                }}
                {{
                  invoice?.job?.vessels?.[0]?.voyageNumber || invoice?.job?.voyageNumber
                    ? "/ " +
                      (invoice?.job?.vessels?.[0]?.voyageNumber || invoice?.job?.voyageNumber)
                    : ""
                }}
              </span>
            </div>
            <div class="w-1/2 pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">B/L NUMBER</span>
              <span class="font-mono text-[0.75rem] uppercase text-black">
                {{ invoice?.blNumber || "-" }}
              </span>
            </div>
          </div>

          <!-- Shipment Operational Info Row 2 -->
          <div
            v-if="mode === 'invoice' && page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 45px"
          >
            <div class="w-1/4 border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">DEPARTURE DATE</span>
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium">
                {{ formatDate(invoice?.job?.vessels?.[0]?.etd || invoice?.job?.etd) || "-" }}
              </span>
            </div>
            <div class="w-[30%] border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">PORT OF LOADING</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">
                {{ invoice?.job?.polName || invoice?.job?.pol || "-" }}
              </span>
            </div>
            <div class="w-[30%] border-r border-[#062c58] pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">PORT OF DISCHARGE</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">
                {{ invoice?.job?.podName || invoice?.job?.pod || "-" }}
              </span>
            </div>
            <div class="w-[15%] pt-1 px-2 pb-1 text-center">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">TERM</span>
              <span class="font-mono text-[0.7rem] uppercase text-black">{{
                getVal(invoice?.job?.tradeType?.name, "PREPAID")
              }}</span>
            </div>
          </div>

          <!-- Terms & Reference Row 3 -->
          <div
            v-if="mode === 'invoice' && page.isFirstPage"
            class="flex border-b border-[#062c58]"
            style="min-height: 45px"
          >
            <div class="w-[15%] border-r border-[#062c58] pt-1 px-2">
              <span class="font-bold text-[0.6rem] block leading-none mb-1">CURRENCY</span>
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium">{{
                invoice?.currency || "IDR"
              }}</span>
            </div>
            <div class="flex-1 pt-1 px-2">
              <span class="font-bold text-[0.6rem] block leading-none mb-1"
                >CUSTOMER REFERENCE</span
              >
              <span class="font-mono text-[0.7rem] uppercase text-black">
                {{
                  (() => {
                    const refs =
                      props.invoice?.job?.billsOfLading?.flatMap(
                        (bl) => bl.shipperReferences || [],
                      ) || [];
                    const uniqueRefs = [...new Set(refs.filter((r) => !!r))];
                    return uniqueRefs.length ? uniqueRefs.join(", ") : "-";
                  })()
                }}
              </span>
            </div>
          </div>

          <!-- Container Info Section -->
          <div
            v-if="mode === 'invoice' && page.isFirstPage"
            class="flex border-b border-[#062c58] bg-gray-50/10"
            style="min-height: 40px"
          >
            <div
              class="w-[70%] border-r border-[#062c58] pt-1 px-2 pb-1 flex flex-col justify-center"
            >
              <span
                class="font-bold text-[0.6rem] block leading-none mb-1 uppercase tracking-wider text-[#062c58]/70"
                >CONTAINER NO.</span
              >
              <span class="font-mono text-[0.75rem] uppercase text-black break-all leading-tight">
                {{ allContainerNumbers }}
              </span>
            </div>
            <div class="w-[30%] pt-1 px-2 pb-1 flex flex-col justify-center">
              <span
                class="font-bold text-[0.6rem] block leading-none mb-1 uppercase tracking-wider text-[#062c58]/70"
                >TYPE</span
              >
              <span class="font-mono text-[0.75rem] uppercase text-black font-bold leading-tight">
                {{ allContainerTypes }}
              </span>
            </div>
          </div>

          <div
            v-if="mode === 'invoice' && !page.isFirstPage"
            class="border-b border-[#062c58] bg-gray-50/10 px-2 py-2 text-[0.65rem] font-bold uppercase tracking-widest"
          >
            {{ invoice?.invoiceNumber || "DRAFT" }} - Charges Continued
          </div>

          <!-- Items Table Header -->
          <div
            v-if="mode === 'invoice'"
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[4%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">DESCRIPTION</div>
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
          <div v-if="mode === 'invoice'" class="flex-1 relative">
            <!-- Vertical Grid Lines Background -->
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[4%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[6%] border-r border-[#062c58]/30"></div>
              <div class="w-[11%] border-r border-[#062c58]/30"></div>
              <div class="w-[15%] border-r border-[#062c58]/30"></div>
              <div class="w-[10%] border-r border-[#062c58]/30"></div>
              <div class="w-[15%]"></div>
            </div>

            <!-- Scrollable Items Area -->
            <div v-if="mode === 'invoice'" class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in page.items"
                :key="item.id || `${page.pageNumber}-${idx}`"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[4%] text-center text-[0.7rem]">
                  {{ page.startIndex + idx + 1 }}
                </div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  {{ item.description }}
                </div>
                <div class="w-[6%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[11%] text-center text-[0.7rem] font-medium text-black/70">
                  {{ item.service?.id ? serviceUnitMap.get(item.service.id) || "-" : "-" }}
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] text-black">
                  {{ formatCurrency(item.unitPrice) }}
                </div>
                <div class="w-[10%] text-center text-[0.7rem] text-[#062c58]/80">
                  {{ item.tax?.rate ? Number(item.tax.rate) + "%" : "-" }}
                </div>
                <div class="w-[15%] text-right px-3 text-[0.7rem] font-medium text-black">
                  {{ formatCurrency(item.amount) }}
                </div>
              </div>

              <!-- Empty spacer rows to maintain layout if few items -->
              <div
                v-if="page.isLastPage && page.items.length < FIRST_PAGE_ITEM_SLOTS"
                v-for="i in FIRST_PAGE_ITEM_SLOTS - page.items.length"
                :key="`spacer-${page.pageNumber}-${i}`"
                class="flex min-h-[35px] border-b border-[#062c58]/5"
              >
                <div class="w-[4%]"></div>
                <div class="flex-1"></div>
                <div class="w-[6%]"></div>
                <div class="w-[11%]"></div>
                <div class="w-[15%]"></div>
                <div class="w-[10%]"></div>
                <div class="w-[15%]"></div>
              </div>
            </div>
          </div>

          <!-- Bank & Totals Footer Area -->
          <div
            v-if="mode === 'invoice' && page.isLastPage"
            class="border-t border-[#062c58] mt-auto"
          >
            <div class="flex items-stretch min-h-[140px]">
              <!-- Left: Bank Information -->
              <div class="w-[58%] border-r border-[#062c58] p-3">
                <span class="font-bold text-[0.6rem] block text-[#062c58] uppercase mb-2"
                  >PLEASE REMIT PAYMENT TO:</span
                >
                <div
                  class="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 text-[0.65rem] font-mono text-black leading-tight uppercase"
                >
                  <span class="text-[#062c58]/70">BANK NAME:</span>
                  <span class="font-bold underline">{{
                    matchedBankAccount?.bankName || "BANK CENTRAL ASIA (BCA)"
                  }}</span>
                  <span class="text-[#062c58]/70">ACCOUNT NAME:</span>
                  <span class="font-medium">{{
                    matchedBankAccount?.accountHolder || "PT Nova Sync Continent"
                  }}</span>
                  <span class="text-[#062c58]/70">ACCOUNT NO:</span>
                  <span class="font-bold text-sm"
                    >{{ matchedBankAccount?.accountNumber || "1234567890" }} ({{
                      matchedBankAccount?.currency || props.invoice?.currency || "IDR"
                    }})</span
                  >
                  <template v-if="matchedBankAccount?.swiftCode">
                    <span class="text-[#062c58]/70">SWIFT CODE:</span>
                    <span class="font-bold">{{ matchedBankAccount.swiftCode }}</span>
                  </template>
                </div>
                <div class="mt-4 pt-2 border-t border-[#062c58]/10">
                  <span class="font-bold text-[0.55rem] text-[#062c58]/50 block uppercase"
                    >REMARKS:</span
                  >
                  <p class="text-[0.65rem] text-black/60 italic leading-tight uppercase">
                    {{ invoice?.notes || "PLEASE INCLUDE THE INVOICE NUMBER ON YOUR REMITTANCE." }}
                  </p>
                </div>
              </div>

              <!-- Right: Subtotal & Tax & Total -->
              <div class="w-[42%] flex flex-col">
                <div class="flex-1 flex flex-col">
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      SUBTOTAL ({{ invoice?.currency || "IDR" }})
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(invoice?.subTotal) }}
                    </div>
                  </div>
                  <div
                    v-if="Number(invoice?.discountAmount) > 0"
                    class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0"
                  >
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      DISCOUNT{{
                        invoice?.discountType === "PERCENTAGE"
                          ? ` (${Number(invoice?.discountValue)}%)`
                          : ""
                      }}
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      - {{ formatCurrency(invoice?.discountAmount) }}
                    </div>
                  </div>
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      {{ isWithholdingTax ? "PPh" : "VAT / TAX" }} ({{ taxRatesLabel }})
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ isWithholdingTax ? "- " : "" }}{{ formatCurrency(taxDisplayAmount) }}
                    </div>
                  </div>
                  <div class="flex bg-[#062c58] text-white flex-1 items-center">
                    <div class="w-1/2 px-3 flex flex-col">
                      <span class="text-[0.55rem] font-bold opacity-70">TOTAL AMOUNT DUE</span>
                      <span
                        class="text-[0.8rem] font-black tracking-wider uppercase leading-none mt-1"
                        >{{ invoice?.currency || "IDR" }}</span
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

        <!-- Authorized Signature & Footer Credits -->
        <div
          v-if="mode === 'receipt' || page.isLastPage"
          class="mt-4 flex justify-between items-end"
        >
          <div class="w-2/3">
            <p
              v-if="mode === 'invoice'"
              class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]"
            >
              Computer generated invoice. No signature required unless specifically requested by the
              recipient for legal compliance. All business transacted is subject to the standard
              trading conditions of the carrier.
            </p>
            <p
              v-else
              class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]"
            >
              This is an official receipt of payment. All transactions are subject to the standard
              trading conditions of the company.
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
