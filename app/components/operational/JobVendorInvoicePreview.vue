<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import type { Expense } from "~/composables/useFinanceExpense";

const props = defineProps<{
  expense: Expense | null;
  organizationName?: string;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");

onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
});

const isGeneratingPDF = ref(false);
const printContainerRef = ref<HTMLElement | null>(null);

const getVal = (val: unknown, fallback: unknown = "") =>
  val ? String(val) : fallback ? String(fallback) : "";

const formatCurrency = (amount: unknown): string => {
  if (amount === undefined || amount === null) return "-";
  const num = Number(amount);
  const currency = props.expense?.currency || "IDR";
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "id-ID", {
    style: "decimal",
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(num);
};

const displayAddress = computed(() => {
  const vendor = props.expense?.vendor;
  if (!vendor) return "NO ADDRESS PROVIDED";

  if (vendor.address) return vendor.address;

  const addresses = vendor.addresses || [];
  if (addresses.length > 0) {
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr?.fullAddress || addresses[0]?.fullAddress || "NO ADDRESS PROVIDED";
  }

  return "NO ADDRESS PROVIDED";
});

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

const subtotal = computed(() => {
  if (!props.expense?.items) return Number(props.expense?.amount || 0);
  return props.expense.items.reduce((sum, item) => sum + Number(item.amount), 0);
});

const taxAmount = computed(() => {
  const total = Number(props.expense?.amount || 0);
  return Math.max(0, total - subtotal.value);
});

const generatePDF = async () => {
  if (!printContainerRef.value || !props.expense) return false;

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

    pdf.save(`AP_VOUCHER_${props.expense.number || "DRAFT"}.pdf`);
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
              class="text-[10px] font-bold tracking-[0.2em] uppercase block leading-none text-[#062c58]"
            >
              INTERNAL ACCOUNTS PAYABLE
            </span>
            <div v-if="expense?.status" class="mt-1.5 flex justify-center">
              <span
                :class="[
                  'text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest shadow-sm',
                  expense.status.code === 'PAID'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : expense.status.code === 'PARTIALLY_PAID'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200',
                ]"
              >
                {{ expense.status.name }}
              </span>
            </div>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">PAGE: 1 OF 1</div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none">AP VOUCHER</h1>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Vendor & Voucher Info -->
          <div class="flex border-b border-[#062c58]" style="min-height: 100px">
            <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
              <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                >VENDOR / PAYEE:</span
              >
              <div class="font-medium text-xs text-black uppercase leading-tight">
                {{ getVal(expense?.vendor?.name, "UNKNOWN VENDOR") }}
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
                    >VOUCHER NO.</span
                  >
                  <span class="font-mono text-[0.85rem] text-black font-medium">{{
                    getVal(expense?.number, "DRAFT")
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatDate(expense?.date)
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 50px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >JOB NO.</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-medium">{{
                    getVal(expense?.job?.jobNumber, "-")
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >CURRENCY</span
                  >
                  <span class="font-mono text-[0.75rem] text-black font-bold uppercase">{{
                    expense?.currency || "IDR"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description / Reference -->
          <div class="flex border-b border-[#062c58] bg-gray-50/10" style="min-height: 45px">
            <div class="w-full pt-1 px-2 pb-1">
              <span class="font-bold text-[0.6rem] block leading-none mb-1 uppercase opacity-70"
                >DESCRIPTION / REMARKS</span
              >
              <span class="font-mono text-[0.75rem] uppercase text-black font-medium leading-tight">
                {{ expense?.description || "-" }}
              </span>
            </div>
          </div>

          <!-- Items Table Header -->
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

          <!-- Items List Container -->
          <div class="flex-1 relative">
            <!-- Vertical Grid Lines Background -->
            <div class="absolute inset-0 flex pointer-events-none">
              <div class="w-[5%] border-r border-[#062c58]/30"></div>
              <div class="flex-1 border-r border-[#062c58]/30"></div>
              <div class="w-[10%] border-r border-[#062c58]/30"></div>
              <div class="w-[20%] border-r border-[#062c58]/30"></div>
              <div class="w-[20%]"></div>
            </div>

            <!-- Scrollable Items Area -->
            <div class="relative z-[1] p-0 font-mono text-black">
              <template v-if="expense?.items && expense.items.length > 0">
                <div
                  v-for="(item, idx) in expense.items"
                  :key="idx"
                  class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2"
                >
                  <div class="w-[5%] text-center text-[0.7rem]">{{ idx + 1 }}</div>
                  <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                    {{ item.description }}
                  </div>
                  <div class="w-[10%] text-center text-[0.7rem]">{{ item.quantity }}</div>
                  <div class="w-[20%] text-right px-3 text-[0.7rem] text-black">
                    {{ formatCurrency(item.unitPrice) }}
                  </div>
                  <div class="w-[20%] text-right px-3 text-[0.7rem] font-medium text-black">
                    {{ formatCurrency(item.amount) }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex border-b border-[#062c58]/10 min-h-[35px] items-start py-2">
                  <div class="w-[5%] text-center text-[0.7rem]">1</div>
                  <div class="flex-1 px-3 text-[0.7rem] font-medium uppercase leading-tight">
                    {{ expense?.description }}
                  </div>
                  <div class="w-[10%] text-center text-[0.7rem]">1</div>
                  <div class="w-[20%] text-right px-3 text-[0.7rem] text-black">
                    {{ formatCurrency(expense?.amount) }}
                  </div>
                  <div class="w-[20%] text-right px-3 text-[0.7rem] font-medium text-black">
                    {{ formatCurrency(expense?.amount) }}
                  </div>
                </div>
              </template>

              <!-- Empty spacer rows -->
              <div
                v-if="(expense?.items?.length || 1) < 12"
                v-for="i in 12 - (expense?.items?.length || 1)"
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

          <!-- Totals Footer Area -->
          <div class="border-t border-[#062c58] mt-auto">
            <div class="flex items-stretch min-h-[120px]">
              <!-- Left: Approval Section -->
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

              <!-- Right: Subtotal & Tax & Total -->
              <div class="w-[42%] flex flex-col">
                <div class="flex-1 flex flex-col">
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">
                      SUBTOTAL ({{ expense?.currency || "IDR" }})
                    </div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(subtotal) }}
                    </div>
                  </div>
                  <div class="flex border-b border-[#062c58]/20 h-[35px] items-center shrink-0">
                    <div class="w-1/2 px-3 font-bold text-[0.65rem] text-[#062c58]">VAT / TAX</div>
                    <div
                      class="flex-1 px-3 text-right font-mono text-[0.75rem] font-medium text-black"
                    >
                      {{ formatCurrency(taxAmount) }}
                    </div>
                  </div>
                  <div class="flex bg-[#062c58] text-white flex-1 items-center">
                    <div class="w-1/2 px-3 flex flex-col">
                      <span class="text-[0.55rem] font-bold opacity-70">TOTAL PAYABLE</span>
                      <span
                        class="text-[0.8rem] font-black tracking-wider uppercase leading-none mt-1"
                        >{{ expense?.currency || "IDR" }}</span
                      >
                    </div>
                    <div class="flex-1 px-3 text-right font-mono text-xl font-black">
                      {{ formatCurrency(expense?.amount) }}
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
              This is an internal accounts payable voucher. No signature required unless
              specifically requested for audit purposes. All business transacted is subject to
              standard company policies.
            </p>
          </div>
          <div class="text-right">
            <span class="text-[0.6rem] font-black text-[#062c58] uppercase tracking-widest">
              PRINTED ON: {{ formatDate(new Date().toISOString()) }}
            </span>
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
