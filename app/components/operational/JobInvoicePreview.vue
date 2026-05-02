<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { InvoiceDetail } from "~/composables/useInvoices";
import { useBankAccounts, type BankAccount } from "~/composables/useBankAccounts";

const props = defineProps<{
  invoice: InvoiceDetail | null;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");
const bankAccounts = ref<BankAccount[]>([]);
const { fetchBankAccounts } = useBankAccounts();

const loadBankAccounts = async () => {
  const res = await fetchBankAccounts({ isActive: true });
  if (res.success) {
    bankAccounts.value = res.data || [];
  }
};

onMounted(async () => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
  await loadBankAccounts();
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

    pdf.save(`INVOICE_${props.invoice.invoiceNumber || "DRAFT"}.pdf`);
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
          <div class="w-[30%] text-center pb-2 flex flex-col justify-end h-full">
            <span
              class="text-xs font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]"
            >
              {{ invoice?.status?.code === "draft" ? "PROFORMA INVOICE" : "COMMERCIAL INVOICE" }}
            </span>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">PAGE: 1 OF 1</div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none">INVOICE</h1>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Parties & Invoice Info -->
          <div class="flex border-b border-[#062c58]" style="min-height: 100px">
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
          <div class="flex border-b border-[#062c58]" style="min-height: 45px">
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
          <div class="flex border-b border-[#062c58]" style="min-height: 45px">
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
          <div class="flex border-b border-[#062c58]" style="min-height: 45px">
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
          <div class="flex border-b border-[#062c58] bg-gray-50/10" style="min-height: 40px">
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

          <!-- Items Table Header -->
          <div
            class="flex border-b border-[#062c58] bg-[#062c58]/5 font-bold text-[0.6rem] h-[35px]"
          >
            <div class="w-[8%] border-r border-[#062c58] flex items-center justify-center">NO</div>
            <div class="flex-1 border-r border-[#062c58] flex items-center px-3">DESCRIPTION</div>
            <div class="w-[10%] border-r border-[#062c58] flex items-center justify-center">
              QTY
            </div>
            <div class="w-[18%] border-r border-[#062c58] flex items-center justify-end px-3">
              UNIT PRICE
            </div>
            <div class="w-[20%] flex items-center justify-end px-3">TOTAL AMOUNT</div>
          </div>

          <!-- Items List Container -->
          <div class="flex-1 relative">
            <!-- Vertical Grid Lines Background -->
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[8%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[10%] border-r border-[#062c58]/30"></div>
              <div class="w-[18%] border-r border-[#062c58]/30"></div>
              <div class="w-[20%]"></div>
            </div>

            <!-- Scrollable Items Area -->
            <div class="relative z-[1] p-0 font-mono text-black">
              <div
                v-for="(item, idx) in invoice?.items || []"
                :key="idx"
                class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
              >
                <div class="w-[8%] text-center text-[0.7rem]">{{ idx + 1 }}</div>
                <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                  {{ item.description }}
                </div>
                <div class="w-[10%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                <div class="w-[18%] text-right px-3 text-[0.7rem] text-black">
                  {{ formatCurrency(item.unitPrice) }}
                </div>
                <div class="w-[20%] text-right px-3 text-[0.7rem] font-medium text-black">
                  {{ formatCurrency(item.amount) }}
                </div>
              </div>

              <!-- Empty spacer rows to maintain layout if few items -->
              <div
                v-if="(invoice?.items?.length || 0) < 10"
                v-for="i in 10 - (invoice?.items?.length || 0)"
                :key="'spacer-' + i"
                class="flex min-h-[35px] border-b border-[#062c58]/5"
              >
                <div class="w-[8%]"></div>
                <div class="flex-1"></div>
                <div class="w-[10%]"></div>
                <div class="w-[18%]"></div>
                <div class="w-[20%]"></div>
              </div>
            </div>
          </div>

          <!-- Bank & Totals Footer Area -->
          <div class="border-t border-[#062c58] mt-auto">
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
                    matchedBankAccount?.accountHolder || "PT NOVA SYNC CONTINENT"
                  }}</span>
                  <span class="text-[#062c58]/70">ACCOUNT NO:</span>
                  <span class="font-bold text-sm"
                    >{{ matchedBankAccount?.accountNumber || "1234567890" }} ({{
                      matchedBankAccount?.currency || props.invoice?.currency || "IDR"
                    }})</span
                  >
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
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      VAT / TAX ({{
                        Math.round(((invoice?.taxAmount || 0) / (invoice?.subTotal || 1)) * 100)
                      }}%)
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(invoice?.taxAmount) }}
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
        <div class="mt-4 flex justify-between items-end">
          <div class="w-2/3">
            <p
              class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium max-w-[400px]"
            >
              Computer generated invoice. No signature required unless specifically requested by the
              recipient for legal compliance. All business transacted is subject to the standard
              trading conditions of the carrier.
            </p>
          </div>
          <div class="text-center min-w-[200px]">
            <div class="text-[0.65rem] font-bold text-[#062c58] uppercase mb-12">
              AUTHORIZED SIGNATORY
            </div>
            <div class="w-full h-[0.5px] bg-[#062c58] mb-1"></div>
            <div class="text-[0.7rem] font-black text-[#062c58] uppercase">
              PT NOVA SYNC CONTINENT
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
