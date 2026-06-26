<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any -- reads the loose live Job relation graph */
import { ref, computed, nextTick, onMounted } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";

// Standalone internal "Job Cover" filing sheet. Read-only — it only renders the
// existing job detail (GET /api/operational/jobs/{id}) and exports a single A4 PDF.
// It does NOT touch the BL/eBL components; it reuses the SAME visual language and the
// jsPDF + html2canvas + .a4-page-wrapper print pattern as the other documents.
const props = defineProps<{
  job: any;
}>();

const logoUrl = ref("/images/transparentnscontinenttebal.png");
onMounted(() => {
  if (typeof window !== "undefined") {
    logoUrl.value = window.location.origin + "/images/transparentnscontinenttebal.png";
  }
});

const isGeneratingPDF = ref(false);
const coverContainer = ref<HTMLElement | null>(null);

// ---- Helpers -------------------------------------------------------------
const getVal = (val: unknown, fallback = "-") => {
  const s = val ? String(val).trim() : "";
  return s || fallback;
};

const getStatusCode = (status?: string | { code?: string; name?: string } | null) => {
  if (!status) return "";
  return (typeof status === "string" ? status : status.code || status.name || "").toUpperCase();
};

// Exclude voided / cancelled documents from revenue & cost.
const isExcluded = (item: { status?: string | { code?: string; name?: string } | null }) => {
  const s = getStatusCode(item.status);
  return s === "VOIDED" || s === "VOID" || s === "CANCELLED" || s === "CANCELED";
};

const formatMoney = (val: number, currency = "IDR") => {
  const n = Number(val) || 0;
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  })
    .format(n)
    .replace("Rp", "IDR")
    .replace("US$", "USD");
};

const formatNumber = (num: unknown, decimals = 3): string => {
  if (num === null || num === undefined || num === "") return "-";
  const n = parseFloat(num as string);
  if (isNaN(n)) return "-";
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date(dateStr))
      .toUpperCase();
  } catch {
    return dateStr || "-";
  }
};

// ---- Parties -------------------------------------------------------------
const findParty = (code: string) =>
  (props.job?.jobParties || []).find((p: any) => p.partyRole?.code === code);
const partyName = (p?: any) => (p ? p.companyName || p.company?.name || "-" : "-");

const companyName = computed(() => props.job?.customer?.name || "-");
const shipperName = computed(() => partyName(findParty("SHIPPER")));
const consigneeName = computed(() => partyName(findParty("CONSIGNEE")));
// Agent: prefer FORWARDER, fall back to CARRIER.
const agentName = computed(() => partyName(findParty("FORWARDER") || findParty("CARRIER")));

// ---- Routing -------------------------------------------------------------
const polDisplay = computed(() => getVal(props.job?.polName || props.job?.pol));
const podDisplay = computed(() => getVal(props.job?.podName || props.job?.pod));
const vesselVoyage = computed(() => {
  const v = props.job?.vessels?.[0];
  const name =
    v?.vesselName || v?.vessel?.name || props.job?.vessel?.name || props.job?.plane?.name || "";
  const voy = v?.voyageNumber || "";
  return [name, voy].filter(Boolean).join(" / ") || "-";
});

const serviceName = computed(() => getVal(props.job?.service?.name));
const statusName = computed(() => getVal(props.job?.status?.name));
const commodityDisplay = computed(() => getVal(props.job?.commodity || props.job?.mainDescription));
const jobNumber = computed(() => getVal(props.job?.jobNumber));
const jobDate = computed(() => formatDate(props.job?.createdAt));
const etdDisplay = computed(() => formatDate(props.job?.etd));
const etaDisplay = computed(() => formatDate(props.job?.eta));

// ---- Cargo ---------------------------------------------------------------
const containers = computed(() => props.job?.jobContainers || []);

const getContainerTotals = (cnt: any) => {
  let gw = 0,
    nw = 0,
    cbm = 0,
    qty = 0;
  (cnt?.items || []).forEach((it: any) => {
    qty += Number(it.qty) || 0;
    gw += Number(it.grossWeight) || 0;
    nw += Number(it.netWeight) || 0;
    cbm += Number(it.measurementCbm) || 0;
  });
  if (qty === 0) qty = Number(cnt?.totalQty) || 0;
  if (gw === 0) gw = Number(cnt?.totalGrossWeight) || 0;
  if (nw === 0) nw = Number(cnt?.totalNetWeight) || 0;
  if (cbm === 0) cbm = Number(cnt?.totalMeasurementCbm) || 0;
  return { qty, gw, nw, cbm };
};

// Grand totals: aggregate containers, else fall back to job-level fields.
const totals = computed(() => {
  let qty = 0,
    gw = 0,
    nw = 0,
    cbm = 0;
  for (const c of containers.value) {
    const t = getContainerTotals(c);
    qty += t.qty;
    gw += t.gw;
    nw += t.nw;
    cbm += t.cbm;
  }
  if (qty === 0) qty = Number(props.job?.quantity) || 0;
  if (gw === 0) gw = Number(props.job?.grossWeight) || 0;
  if (nw === 0) nw = Number(props.job?.netWeight) || 0;
  if (cbm === 0) cbm = Number(props.job?.measurement) || 0;
  return { qty, gw, nw, cbm };
});

// Pagination: container rows can overflow a page. Page 1 shares space with the job
// info + parties + routing, so it holds fewer rows; the cargo totals + financial
// summary render only on the last page.
const CARGO_ROWS_PAGE_1 = 9;
const CARGO_ROWS_PAGE_N = 22;

interface CoverPage {
  rows: any[];
  isFirst: boolean;
  isLast: boolean;
}

const coverPages = computed<CoverPage[]>(() => {
  const rows = containers.value;
  if (rows.length === 0) return [{ rows: [], isFirst: true, isLast: true }];
  const pages: CoverPage[] = [];
  let idx = 0;
  let first = true;
  while (idx < rows.length) {
    const cap = first ? CARGO_ROWS_PAGE_1 : CARGO_ROWS_PAGE_N;
    const slice = rows.slice(idx, idx + cap);
    idx += cap;
    pages.push({ rows: slice, isFirst: first, isLast: idx >= rows.length });
    first = false;
  }
  return pages;
});

// Display values that honour the requested fallbacks (NW -> "-" when empty).
const qtyDisplay = computed(() => (totals.value.qty > 0 ? formatNumber(totals.value.qty, 0) : "-"));
const gwDisplay = computed(() =>
  props.job?.grossWeight
    ? formatNumber(totals.value.gw)
    : totals.value.gw > 0
      ? formatNumber(totals.value.gw)
      : "-",
);
const nwDisplay = computed(() => (totals.value.nw > 0 ? formatNumber(totals.value.nw) : "-"));
const cbmDisplay = computed(() => (totals.value.cbm > 0 ? formatNumber(totals.value.cbm) : "-"));

// ---- Finance (Revenue / Cost / Profit) -----------------------------------
const validInvoices = computed(() =>
  (props.job?.invoices || []).filter((i: any) => !isExcluded(i)),
);
const validExpenses = computed(() =>
  (props.job?.expenses || []).filter((e: any) => !isExcluded(e)),
);

const groupByCurrency = (items: any[], amountKey: string) => {
  const byCur: Record<string, number> = {};
  for (const it of items) {
    const cur = it.currency || "IDR";
    byCur[cur] = (byCur[cur] || 0) + (Number(it[amountKey]) || 0);
  }
  return byCur;
};

const revenueByCur = computed(() => groupByCurrency(validInvoices.value, "total"));
const costByCur = computed(() => groupByCurrency(validExpenses.value, "amount"));
const allCurrencies = computed(() => [
  ...new Set([...Object.keys(revenueByCur.value), ...Object.keys(costByCur.value)]),
]);
const allRatesValid = computed(() =>
  [...validInvoices.value, ...validExpenses.value].every((i: any) => Number(i.exchangeRate) > 0),
);
const financeMode = computed<"single" | "idr" | "grouped">(() => {
  if (allCurrencies.value.length <= 1) return "single";
  return allRatesValid.value ? "idr" : "grouped";
});

const sumConverted = (items: any[], amountKey: string) =>
  items.reduce((s, it) => s + (Number(it[amountKey]) || 0) * (Number(it.exchangeRate) || 1), 0);

const summary = computed(() => {
  if (financeMode.value === "idr") {
    const revenue = sumConverted(validInvoices.value, "total");
    const cost = sumConverted(validExpenses.value, "amount");
    return { currency: "IDR", revenue, cost, profit: revenue - cost, converted: true };
  }
  const cur = allCurrencies.value[0] || "IDR";
  const revenue = revenueByCur.value[cur] || 0;
  const cost = costByCur.value[cur] || 0;
  return { currency: cur, revenue, cost, profit: revenue - cost, converted: false };
});

const margin = computed(() =>
  summary.value.revenue !== 0 ? (summary.value.profit / summary.value.revenue) * 100 : 0,
);

const groupedRows = computed(() =>
  allCurrencies.value.map((cur) => {
    const revenue = revenueByCur.value[cur] || 0;
    const cost = costByCur.value[cur] || 0;
    return { currency: cur, revenue, cost, profit: revenue - cost };
  }),
);

// ---- PDF export (same pattern as JobBcPreview / JobProfitPreview) ---------
const generatePDF = async () => {
  if (!coverContainer.value || !props.job) return false;
  try {
    isGeneratingPDF.value = true;
    toast.info("Generating Job Cover, please wait...");
    await nextTick();

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pages = coverContainer.value.querySelectorAll(".a4-page-wrapper");

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      if (!pageEl) continue;
      if (i > 0) pdf.addPage();
      const canvas = await html2canvas(pageEl as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.save(`JOB_COVER_${props.job.jobNumber || "JOB"}.pdf`);
    toast.success("Job Cover exported successfully");
    return true;
  } catch (error) {
    console.error("Job Cover PDF generation failed:", error);
    toast.error("Failed to generate Job Cover");
    return false;
  } finally {
    isGeneratingPDF.value = false;
  }
};

defineExpose({ generatePDF, isGeneratingPDF });
</script>

<template>
  <div class="flex justify-center bg-gray-50/50 py-12 rounded-2xl overflow-auto font-mono">
    <div
      v-if="!job"
      class="flex items-center justify-center h-48 text-sm text-muted-foreground italic"
    >
      No job data available.
    </div>

    <div v-else class="relative flex flex-col gap-10" ref="coverContainer">
      <div
        v-for="(page, pIdx) in coverPages"
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
              class="text-[0.6rem] font-bold tracking-[0.2em] uppercase leading-none text-[#062c58]/70"
            >
              Internal Filing Document
            </span>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ pIdx + 1 }} OF {{ coverPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              JOB COVER
            </h1>
          </div>
        </div>

        <!-- Main bordered container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <template v-if="page.isFirst">
            <!-- Job info -->
            <div class="flex border-b border-[#062c58]" style="min-height: 78px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                  >Customer</span
                >
                <div class="font-mono uppercase text-[11px] text-black leading-tight">
                  {{ companyName }}
                </div>
                <div class="mt-3">
                  <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                    >Route</span
                  >
                  <div class="font-mono uppercase text-[10px] text-black">
                    {{ polDisplay }} &rarr; {{ podDisplay }}
                  </div>
                </div>
              </div>
              <div class="w-1/2">
                <div class="flex border-b border-[#062c58]" style="min-height: 39px">
                  <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block uppercase"
                      >Job No.</span
                    >
                    <span class="font-mono text-[0.8rem] text-black font-medium">{{
                      jobNumber
                    }}</span>
                  </div>
                  <div class="w-1/2 pt-1 px-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block uppercase"
                      >Date</span
                    >
                    <span class="font-mono text-[0.8rem] text-black">{{ jobDate }}</span>
                  </div>
                </div>
                <div class="flex" style="min-height: 39px">
                  <div class="w-1/2 border-r border-[#062c58] pt-1 px-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block uppercase"
                      >Service</span
                    >
                    <span class="font-mono text-[10px] text-black uppercase">{{
                      serviceName
                    }}</span>
                  </div>
                  <div class="w-1/2 pt-1 px-2">
                    <span class="font-bold text-[0.6rem] leading-none mb-0.5 block uppercase"
                      >Status</span
                    >
                    <span class="font-mono text-[10px] text-black uppercase">{{ statusName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipper / Consignee -->
            <div class="flex border-b border-[#062c58]" style="min-height: 66px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                  >Shipper / Exporter</span
                >
                <div class="font-mono uppercase text-[10px] text-black leading-tight">
                  {{ shipperName }}
                </div>
              </div>
              <div class="w-1/2 pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                  >Consignee</span
                >
                <div class="font-mono uppercase text-[10px] text-black leading-tight">
                  {{ consigneeName }}
                </div>
              </div>
            </div>

            <!-- Agent / Commodity -->
            <div class="flex border-b border-[#062c58]" style="min-height: 48px">
              <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                  >Agent</span
                >
                <div class="font-mono uppercase text-[10px] text-black leading-tight">
                  {{ agentName }}
                </div>
              </div>
              <div class="w-1/2 pt-1 px-2 pb-2">
                <span class="font-bold mb-0.5 text-[0.6rem] leading-none block uppercase"
                  >Commodity</span
                >
                <div class="font-mono uppercase text-[10px] text-black leading-tight">
                  {{ commodityDisplay }}
                </div>
              </div>
            </div>

            <!-- Vessel / ETD / ETA -->
            <div class="flex border-b border-[#062c58]" style="min-height: 40px">
              <div class="w-1/2 border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5 uppercase"
                  >Vessel / Voyage</span
                >
                <span class="font-mono text-[10px] uppercase text-black leading-none">{{
                  vesselVoyage
                }}</span>
              </div>
              <div class="w-1/4 border-r border-[#062c58] pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5 uppercase">ETD</span>
                <span class="font-mono text-[10px] uppercase text-black leading-none">{{
                  etdDisplay
                }}</span>
              </div>
              <div class="w-1/4 pt-0.5 px-2 pb-1.5">
                <span class="font-bold text-[0.6rem] block leading-none mb-0.5 uppercase">ETA</span>
                <span class="font-mono text-[10px] uppercase text-black leading-none">{{
                  etaDisplay
                }}</span>
              </div>
            </div>
          </template>

          <!-- Cargo particulars -->
          <div class="flex bg-[#062c58]/5 font-bold text-[0.55rem] border-b border-[#062c58]">
            <div class="w-[34%] border-r border-[#062c58] p-1.5 uppercase">Container / Marks</div>
            <div class="w-[12%] border-r border-[#062c58] p-1.5 text-center uppercase">Qty</div>
            <div class="w-[24%] border-r border-[#062c58] p-1.5 uppercase">Description</div>
            <div class="w-[10%] border-r border-[#062c58] p-1.5 text-right uppercase">GW</div>
            <div class="w-[10%] border-r border-[#062c58] p-1.5 text-right uppercase">NW</div>
            <div class="w-[10%] p-1.5 text-right uppercase">CBM</div>
          </div>

          <div
            class="cargo-window flex-1 relative overflow-hidden text-black font-mono text-[10px]"
          >
            <template v-if="page.rows.length > 0">
              <div
                v-for="(cnt, idx) in page.rows"
                :key="idx"
                class="flex border-b border-[#062c58]/10"
              >
                <div class="w-[34%] border-r border-[#062c58]/20 px-2 py-1.5 break-words">
                  {{ cnt.containerNumber || cnt.vehicleNumber || "-"
                  }}<span v-if="cnt.sealNumber"> / {{ cnt.sealNumber }}</span>
                </div>
                <div class="w-[12%] border-r border-[#062c58]/20 px-2 py-1.5 text-center">
                  {{ formatNumber(getContainerTotals(cnt).qty, 0) }}
                </div>
                <div class="w-[24%] border-r border-[#062c58]/20 px-2 py-1.5 break-words uppercase">
                  {{ cnt.containerType?.code || cnt.containerType?.name || commodityDisplay }}
                </div>
                <div class="w-[10%] border-r border-[#062c58]/20 px-2 py-1.5 text-right">
                  {{ formatNumber(getContainerTotals(cnt).gw) }}
                </div>
                <div class="w-[10%] border-r border-[#062c58]/20 px-2 py-1.5 text-right">
                  {{ formatNumber(getContainerTotals(cnt).nw) }}
                </div>
                <div class="w-[10%] px-2 py-1.5 text-right">
                  {{ formatNumber(getContainerTotals(cnt).cbm) }}
                </div>
              </div>
            </template>
            <template v-else-if="containers.length === 0">
              <div class="flex border-b border-[#062c58]/10">
                <div class="w-[34%] border-r border-[#062c58]/20 px-2 py-1.5">-</div>
                <div class="w-[12%] border-r border-[#062c58]/20 px-2 py-1.5 text-center">
                  {{ qtyDisplay }}
                </div>
                <div class="w-[24%] border-r border-[#062c58]/20 px-2 py-1.5 uppercase">
                  {{ commodityDisplay }}
                </div>
                <div class="w-[10%] border-r border-[#062c58]/20 px-2 py-1.5 text-right">
                  {{ gwDisplay }}
                </div>
                <div class="w-[10%] border-r border-[#062c58]/20 px-2 py-1.5 text-right">
                  {{ nwDisplay }}
                </div>
                <div class="w-[10%] px-2 py-1.5 text-right">{{ cbmDisplay }}</div>
              </div>
            </template>
          </div>

          <template v-if="page.isLast">
            <!-- Cargo totals -->
            <div class="flex border-t border-[#062c58] font-bold text-[10px] bg-[#062c58]/5">
              <div class="w-[34%] border-r border-[#062c58] px-2 py-1.5 uppercase text-[#062c58]">
                Total
              </div>
              <div class="w-[12%] border-r border-[#062c58] px-2 py-1.5 text-center text-black">
                {{ qtyDisplay }}
              </div>
              <div class="w-[24%] border-r border-[#062c58] px-2 py-1.5"></div>
              <div class="w-[10%] border-r border-[#062c58] px-2 py-1.5 text-right text-black">
                {{ gwDisplay }}
              </div>
              <div class="w-[10%] border-r border-[#062c58] px-2 py-1.5 text-right text-black">
                {{ nwDisplay }}
              </div>
              <div class="w-[10%] px-2 py-1.5 text-right text-black">{{ cbmDisplay }}</div>
            </div>

            <!-- Financial Summary bar -->
            <div class="bg-[#062c58] text-white px-3 py-2 flex justify-between items-center">
              <span class="font-bold text-[0.65rem] tracking-wider uppercase"
                >Financial Summary</span
              >
              <div class="flex gap-6 items-center">
                <span v-if="summary.converted" class="text-[0.5rem] opacity-70 italic"
                  >converted to IDR</span
                >
                <div v-if="financeMode !== 'grouped'" class="flex flex-col items-end">
                  <span class="text-[0.5rem] opacity-70 uppercase">Net Profit</span>
                  <span class="text-sm font-black">{{
                    formatMoney(summary.profit, summary.currency)
                  }}</span>
                </div>
                <div v-if="financeMode !== 'grouped'" class="flex flex-col items-end">
                  <span class="text-[0.5rem] opacity-70 uppercase">Margin</span>
                  <span class="text-sm font-black">{{ margin.toFixed(1) }}%</span>
                </div>
              </div>
            </div>

            <!-- single / idr finance rows -->
            <template v-if="financeMode !== 'grouped'">
              <div class="flex border-b border-[#062c58]/20 text-[0.75rem] items-center">
                <div class="w-1/2 px-3 py-2 font-bold uppercase text-[0.62rem] text-[#062c58]">
                  Revenue
                </div>
                <div class="flex-1 px-3 py-2 text-right font-mono text-green-700">
                  {{ formatMoney(summary.revenue, summary.currency) }}
                </div>
              </div>
              <div class="flex border-b border-[#062c58]/20 text-[0.75rem] items-center">
                <div class="w-1/2 px-3 py-2 font-bold uppercase text-[0.62rem] text-[#062c58]">
                  Cost
                </div>
                <div class="flex-1 px-3 py-2 text-right font-mono text-red-600">
                  ({{ formatMoney(summary.cost, summary.currency) }})
                </div>
              </div>
              <div class="flex bg-[#062c58]/5 items-center">
                <div class="w-1/2 px-3 py-2.5 font-black uppercase text-[0.7rem] text-[#062c58]">
                  Profit
                </div>
                <div
                  class="flex-1 px-3 py-2.5 text-right font-mono text-base font-black"
                  :class="summary.profit >= 0 ? 'text-[#062c58]' : 'text-red-600'"
                >
                  {{ formatMoney(summary.profit, summary.currency) }}
                </div>
              </div>
            </template>

            <!-- grouped finance (mixed currency, no cross-currency sum) -->
            <template v-else>
              <div
                class="px-3 py-1 text-[0.52rem] italic text-[#062c58]/70 border-b border-[#062c58]/20"
              >
                Mixed currency without reliable exchange rate — shown per currency.
              </div>
              <div
                class="flex bg-[#062c58]/5 text-[0.55rem] font-bold uppercase text-[#062c58] border-b border-[#062c58]/20"
              >
                <div class="w-[16%] px-3 py-1.5">Currency</div>
                <div class="flex-1 px-3 py-1.5 text-right">Revenue</div>
                <div class="flex-1 px-3 py-1.5 text-right">Cost</div>
                <div class="flex-1 px-3 py-1.5 text-right">Profit</div>
              </div>
              <div
                v-for="row in groupedRows"
                :key="row.currency"
                class="flex border-b border-[#062c58]/20 text-[0.72rem] items-center"
              >
                <div class="w-[16%] px-3 py-1.5 font-bold text-black">{{ row.currency }}</div>
                <div class="flex-1 px-3 py-1.5 text-right font-mono text-green-700">
                  {{ formatMoney(row.revenue, row.currency) }}
                </div>
                <div class="flex-1 px-3 py-1.5 text-right font-mono text-red-600">
                  ({{ formatMoney(row.cost, row.currency) }})
                </div>
                <div
                  class="flex-1 px-3 py-1.5 text-right font-mono font-bold"
                  :class="row.profit >= 0 ? 'text-[#062c58]' : 'text-red-600'"
                >
                  {{ formatMoney(row.profit, row.currency) }}
                </div>
              </div>
            </template>
          </template>
        </div>

        <!-- Footer credits (matches Profit Report) -->
        <div class="mt-3 flex justify-between items-end">
          <p
            class="text-[0.5rem] italic text-[#062c58]/60 uppercase leading-tight font-medium w-2/3"
          >
            NS Continent — Operational Management System · Internal job filing cover sheet (not a
            customer document).
          </p>
          <p class="text-[0.6rem] font-bold text-[#062c58]/70">
            PRINTED: {{ formatDate(new Date().toISOString()) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-border-container {
  border: 1px solid #062c58;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.cargo-window {
  flex: 1 1 0%;
  min-height: 0;
}
.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
}
</style>
