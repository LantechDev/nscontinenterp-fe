<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import { cn, toNumber } from "~/lib/utils";
import type { ActiveJobData, ProfitInvoice, ProfitExpense, ProfitJob } from "./ebl/types";

const props = defineProps<{
  job: ProfitJob | null;
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

const formatCurrency = (val: number | string | null | undefined, currency: string = "IDR") => {
  if (val === null || val === undefined) return `${currency} 0`;
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return `${currency} 0`;

  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  })
    .format(num)
    .replace("Rp", "IDR")
    .replace("US$", "USD");
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(d)
      .toUpperCase();
  } catch {
    return dateStr || "";
  }
};

const getStatusCode = (status?: string | { code?: string; name?: string } | null) => {
  if (!status) return "";
  return (typeof status === "string" ? status : status.code || status.name || "").toUpperCase();
};

const isVoided = (item: { status?: string | { code?: string; name?: string } | null }) =>
  getStatusCode(item.status) === "VOIDED" || getStatusCode(item.status) === "VOID";

const allInvoices = computed(() => props.job?.invoices || []);
const allVendorInvoices = computed(() => props.job?.expenses || []);
const invoices = computed(() => allInvoices.value.filter((inv) => !isVoided(inv)));
const vendorInvoices = computed(() => allVendorInvoices.value.filter((exp) => !isVoided(exp)));

const totalRevenue = computed(() => {
  if (allInvoices.value.length > 0) {
    return invoices.value.reduce((sum: number, inv: ProfitInvoice) => {
      const amount = toNumber(inv.total) || 0;
      const rate = toNumber(inv.exchangeRate) || 1;
      return sum + amount * rate;
    }, 0);
  }
  return toNumber(props.job?.revenue) || 0;
});

const getItemDescriptions = (items: { description: string | null }[] | null | undefined) => {
  if (!items || items.length === 0) return "";
  return items
    .map((it) => it.description)
    .filter(Boolean)
    .join(", ");
};

const totalCost = computed(() => {
  if (allVendorInvoices.value.length > 0) {
    return vendorInvoices.value.reduce((sum: number, exp: ProfitExpense) => {
      const amount = toNumber(exp.amount) || 0;
      const rate = toNumber(exp.exchangeRate) || 1;
      return sum + amount * rate;
    }, 0);
  }
  return toNumber(props.job?.cogs || props.job?.cost) || 0;
});

const profit = computed(() => {
  // Always prefer calculated profit if we have detailed data
  if (allInvoices.value.length > 0 || allVendorInvoices.value.length > 0) {
    return totalRevenue.value - totalCost.value;
  }
  if (props.job?.profit !== undefined && props.job?.profit !== null)
    return toNumber(props.job.profit);
  return totalRevenue.value - totalCost.value;
});

const margin = computed(() => {
  // Always prefer calculated margin if we have detailed data
  if (
    (allInvoices.value.length > 0 || allVendorInvoices.value.length > 0) &&
    totalRevenue.value !== 0
  ) {
    return (profit.value / totalRevenue.value) * 100;
  }
  if (props.job?.margin !== undefined && props.job?.margin !== null)
    return Number(props.job.margin);
  if (totalRevenue.value === 0) return 0;
  return (profit.value / totalRevenue.value) * 100;
});

const customerName = computed(() => {
  if (typeof props.job?.customer === "string") return props.job.customer;
  return props.job?.customer?.name || "-";
});

const generatePDF = async () => {
  if (!printContainerRef.value || !props.job) return false;

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

    pdf.save(`PROFIT_REPORT_${props.job.jobNumber || "JOB"}.pdf`);
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
              JOB PROFIT ANALYSIS
            </span>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">PAGE: 1 OF 1</div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              PROFIT REPORT
            </h1>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Job Info Section -->
          <div class="flex border-b border-[#062c58]" style="min-height: 80px">
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
                <div class="font-mono text-[0.7rem] uppercase text-black">
                  {{ job?.polName || job?.pol || "-" }} -> {{ job?.podName || job?.pod || "-" }}
                </div>
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex border-b border-[#062c58]" style="height: 40px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >JOB NO.</span
                  >
                  <span class="font-mono text-[0.8rem] text-black font-medium">{{
                    job?.jobNumber || "-"
                  }}</span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >DATE</span
                  >
                  <span class="font-mono text-[0.8rem] text-black">{{
                    formatDate(job?.createdAt)
                  }}</span>
                </div>
              </div>
              <div class="flex" style="height: 40px">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >VESSEL</span
                  >
                  <span class="font-mono text-[0.7rem] text-black uppercase">
                    {{ job?.vessels?.[0]?.vesselName || job?.vessel?.name || "-" }}
                  </span>
                </div>
                <div class="w-1/2 pt-1 px-2">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >STATUS</span
                  >
                  <span class="font-mono text-[0.7rem] text-black uppercase">{{
                    job?.status?.name || "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Summary Header -->
          <div class="bg-[#062c58] text-white px-3 py-2 flex justify-between items-center">
            <span class="font-bold text-xs tracking-wider">FINANCIAL PERFORMANCE SUMMARY</span>
            <div class="flex gap-6">
              <div class="flex flex-col items-end">
                <span class="text-[0.5rem] opacity-70">NET PROFIT</span>
                <span class="text-sm font-black">{{ formatCurrency(profit) }}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[0.5rem] opacity-70">MARGIN</span>
                <span class="text-sm font-black">{{ margin.toFixed(2) }}%</span>
              </div>
            </div>
          </div>

          <!-- Details Section -->
          <div class="flex-1 flex flex-col">
            <!-- Revenue Table -->
            <div class="flex-1 flex flex-col min-h-0 border-b border-[#062c58]">
              <div
                class="bg-[#062c58]/5 px-3 py-1.5 border-b border-[#062c58] flex justify-between"
              >
                <span class="font-bold text-[0.65rem] text-[#062c58]">REVENUE (INVOICES)</span>
                <span class="font-bold text-[0.65rem] text-[#062c58]"
                  >TOTAL: {{ formatCurrency(totalRevenue) }}</span
                >
              </div>
              <div class="flex-1 overflow-hidden relative">
                <table class="w-full text-left font-mono">
                  <thead
                    class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50"
                  >
                    <tr>
                      <th class="px-3 py-1 w-[20%]">DATE</th>
                      <th class="px-3 py-1 w-[25%]">INV NO.</th>
                      <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                      <th class="px-3 py-1 w-[20%] text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody class="text-[0.65rem]">
                    <tr v-for="inv in invoices" :key="inv.id" class="border-b border-[#062c58]/5">
                      <td class="px-3 py-2">{{ formatDate(inv.issuedDate || inv.createdAt) }}</td>
                      <td class="px-3 py-2 font-bold">{{ inv.invoiceNumber }}</td>
                      <td class="px-3 py-2 truncate max-w-xs">
                        {{ getItemDescriptions(inv.items) || inv.notes || "SALES REVENUE" }}
                      </td>
                      <td class="px-3 py-2 text-right">
                        <div class="flex flex-col items-end">
                          <span class="font-bold">{{
                            formatCurrency(inv.total, inv.currency || "IDR")
                          }}</span>
                          <span
                            v-if="inv.currency === 'USD'"
                            class="text-[0.5rem] text-muted-foreground italic"
                          >
                            {{
                              formatCurrency(
                                toNumber(inv.total) * (toNumber(inv.exchangeRate) || 1),
                              )
                            }}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="invoices.length === 0">
                      <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                        No revenue recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Cost Table -->
            <div class="flex-1 flex flex-col min-h-0">
              <div class="bg-red-50/50 px-3 py-1.5 border-b border-[#062c58] flex justify-between">
                <span class="font-bold text-[0.65rem] text-red-700">COSTS (VENDOR INVOICES)</span>
                <span class="font-bold text-[0.65rem] text-red-700"
                  >TOTAL: {{ formatCurrency(totalCost) }}</span
                >
              </div>
              <div class="flex-1 overflow-hidden relative">
                <table class="w-full text-left font-mono">
                  <thead
                    class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50"
                  >
                    <tr>
                      <th class="px-3 py-1 w-[20%]">DATE</th>
                      <th class="px-3 py-1 w-[25%]">VENDOR</th>
                      <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                      <th class="px-3 py-1 w-[20%] text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody class="text-[0.65rem]">
                    <tr
                      v-for="exp in vendorInvoices"
                      :key="exp.id"
                      class="border-b border-[#062c58]/5"
                    >
                      <td class="px-3 py-2">{{ formatDate(exp.date || exp.createdAt) }}</td>
                      <td class="px-3 py-2 font-bold">{{ exp.vendor?.name || "-" }}</td>
                      <td class="px-3 py-2 truncate max-w-xs">
                        {{
                          getItemDescriptions(exp.items) ||
                          exp.description ||
                          exp.category?.name ||
                          "VENDOR EXPENSE"
                        }}
                      </td>
                      <td class="px-3 py-2 text-right">
                        <div class="flex flex-col items-end">
                          <span class="font-bold">{{
                            formatCurrency(exp.amount, exp.currency || "IDR")
                          }}</span>
                          <span
                            v-if="exp.currency === 'USD'"
                            class="text-[0.5rem] text-muted-foreground italic"
                          >
                            {{
                              formatCurrency(
                                toNumber(exp.amount) * (toNumber(exp.exchangeRate) || 1),
                              )
                            }}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="vendorInvoices.length === 0">
                      <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                        No costs recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary Footer area -->
          <div class="border-t border-[#062c58] mt-auto bg-gray-50">
            <div class="flex h-24">
              <div class="w-1/2 p-3 text-[0.55rem] italic text-muted-foreground leading-tight">
                This report is generated for internal management analysis purposes. Data shown is
                based on recorded invoices and expenses linked to the job. Profit calculation: Total
                Revenue - Total Cost (COGS).
              </div>
              <div class="w-1/2 flex flex-col border-l border-[#062c58]">
                <div class="flex-1 flex border-b border-[#062c58]/10 items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.6rem] uppercase">Total Revenue</div>
                  <div class="flex-1 px-3 text-right font-bold text-green-600">
                    {{ formatCurrency(totalRevenue) }}
                  </div>
                </div>
                <div class="flex-1 flex border-b border-[#062c58]/10 items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.6rem] uppercase">Total Cost</div>
                  <div class="flex-1 px-3 text-right font-bold text-red-600">
                    ({{ formatCurrency(totalCost) }})
                  </div>
                </div>
                <div class="flex-1 flex bg-[#062c58] text-white items-center">
                  <div class="w-1/2 px-3 font-bold text-[0.7rem] uppercase">Net Profit</div>
                  <div class="flex-1 px-3 text-right font-black text-lg">
                    {{ formatCurrency(profit) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Credits -->
        <div class="mt-4 flex justify-between items-end">
          <div class="w-2/3">
            <p class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium">
              NS CONTINENT - OPERATIONAL MANAGEMENT SYSTEM
            </p>
          </div>
          <div class="text-right">
            <p class="text-[0.6rem] font-bold text-[#062c58]">
              PRINTED ON: {{ new Date().toLocaleString() }}
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

@font-face {
  font-family: "Inter";
  src: url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");
}

.font-sans {
  font-family: "Inter", sans-serif;
}
</style>
