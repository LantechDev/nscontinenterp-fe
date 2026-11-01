<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "vue-sonner";
import { cn, toNumber } from "~/lib/utils";
import { formatCurrencyCode } from "~/utils/currency";
import { getTransportLocationDisplay } from "~/utils/airFreightJob";
import {
  hasProfitReportUsdConversion,
  needsProfitReportFallbackExchangeRate,
  resolveProfitReportEditableExchangeRate,
  toProfitReportBaseAmount,
} from "~/utils/jobProfitReport";
import { sortLogisticsItemsForDisplay } from "~/utils/quotationInvoice";
import type { ProfitInvoice, ProfitExpense, ProfitJob, ProfitLineItem } from "./ebl/types";

const props = defineProps<{
  job: ProfitJob | null;
  fallbackExchangeRate?: number | null;
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
  const num = toNumber(val);
  return formatCurrencyCode(Number.isFinite(num) ? num : 0, currency);
};
const jobPolDisplay = computed(() =>
  getTransportLocationDisplay({
    serviceType: props.job?.serviceType,
    shipmentType: props.job?.shipmentType,
    code: props.job?.pol,
    name: props.job?.polName,
  }),
);
const jobPodDisplay = computed(() =>
  getTransportLocationDisplay({
    serviceType: props.job?.serviceType,
    shipmentType: props.job?.shipmentType,
    code: props.job?.pod,
    name: props.job?.podName,
  }),
);

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
const fallbackExchangeRate = ref<number | null>(null);
const needsFallbackExchangeRate = computed(() =>
  needsProfitReportFallbackExchangeRate([...invoices.value, ...vendorInvoices.value]),
);
const effectiveFallbackExchangeRate = computed(() =>
  resolveProfitReportEditableExchangeRate(props.fallbackExchangeRate, fallbackExchangeRate.value),
);
const isUsingEstimatedExchangeRate = computed(
  () => needsFallbackExchangeRate.value && Number(effectiveFallbackExchangeRate.value || 1) > 1,
);

const loadFallbackExchangeRate = async () => {
  if (!needsFallbackExchangeRate.value || effectiveFallbackExchangeRate.value) return;
  try {
    const res = await $fetch<{ success: boolean; rate?: number }>(
      "/api/finance/invoice/exchange-rate",
    );
    if (res?.success && res.rate) fallbackExchangeRate.value = res.rate;
  } catch {
    // Silent fallback: report still shows saved values if the rate API is unavailable.
  }
};

watch(needsFallbackExchangeRate, loadFallbackExchangeRate, { immediate: true });

const totalRevenue = computed(() => {
  if (allInvoices.value.length > 0) {
    return invoices.value.reduce((sum: number, inv: ProfitInvoice) => {
      return (
        sum +
        toProfitReportBaseAmount(
          inv.total,
          inv.currency,
          inv.exchangeRate,
          effectiveFallbackExchangeRate.value,
        )
      );
    }, 0);
  }
  return toNumber(props.job?.revenue) || 0;
});

/** Satu baris revenue/cost setelah di-breakdown per item/service (kayak quotation costing). */
interface ProfitBreakdownRow {
  key: string;
  serviceName: string | null;
  categoryName: string | null;
  vendorName: string | null;
  description: string;
  refLabel: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  isAdjustment?: boolean;
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const itemLineAmount = (it: {
  amount?: number | string | null;
  quantity?: number | string | null;
  unitPrice?: number | string | null;
}) => {
  const raw = it.amount;
  if (raw !== null && raw !== undefined && raw !== "") return toNumber(raw);
  return toNumber(it.quantity) * toNumber(it.unitPrice);
};

const serviceLabel = (it: ProfitLineItem | null | undefined) => {
  const svc = it?.service;
  return svc?.name || svc?.category?.name || null;
};

const categoryLabel = (it: ProfitLineItem | null | undefined) =>
  it?.service?.category?.name || it?.service?.category?.code || null;

/** Sort key: pakai category + serviceName + description supaya FSC/CCC (cat FREIGHT) ikut rank Freight. */
const sortBreakdownRows = <
  T extends {
    serviceName: string | null;
    categoryName: string | null;
    description: string;
    isAdjustment?: boolean;
  },
>(
  rows: T[],
): T[] => {
  const lineRows = rows.filter((r) => !r.isAdjustment);
  const adjRows = rows.filter((r) => r.isAdjustment);
  const sorted = sortLogisticsItemsForDisplay(
    lineRows.map((r) => ({
      ...r,
      service: {
        name: r.serviceName,
        category: { name: r.categoryName, code: null },
      },
    })),
  );
  // ADJUSTMENT / TAX selalu di bawah, biar tidak nyampur baris service.
  return [...sorted, ...adjRows];
};

const invoiceBreakdownRows = (inv: ProfitInvoice): ProfitBreakdownRow[] => {
  const items = inv.items || [];
  const parentCurrency = inv.currency || "IDR";
  const parentRate = toNumber(inv.exchangeRate) || 1;

  if (items.length === 0) {
    return [
      {
        key: inv.id,
        serviceName: null,
        categoryName: null,
        vendorName: null,
        description: inv.notes || "SALES REVENUE",
        refLabel: inv.invoiceNumber || "",
        amount: toNumber(inv.total),
        currency: parentCurrency,
        exchangeRate: parentRate,
      },
    ];
  }

  const rows: ProfitBreakdownRow[] = items.map((it, idx) => ({
    key: `${inv.id}-item-${it.id || idx}`,
    serviceName: serviceLabel(it),
    categoryName: categoryLabel(it),
    vendorName: null,
    description: it.description || inv.notes || "SALES REVENUE",
    refLabel: inv.invoiceNumber || "",
    amount: itemLineAmount(it),
    currency: it.currency || parentCurrency,
    exchangeRate: parentRate,
  }));

  const itemsBase = rows.reduce(
    (sum, r) =>
      sum +
      toProfitReportBaseAmount(
        r.amount,
        r.currency,
        r.exchangeRate,
        effectiveFallbackExchangeRate.value,
      ),
    0,
  );
  const totalBase = toProfitReportBaseAmount(
    inv.total,
    inv.currency,
    inv.exchangeRate,
    effectiveFallbackExchangeRate.value,
  );
  const residualBase = totalBase - itemsBase;
  if (Math.abs(residualBase) >= 0.01) {
    const sameCurrency = rows.every((r) => r.currency === parentCurrency);
    const residualAmount = sameCurrency
      ? roundMoney(toNumber(inv.total) - rows.reduce((s, r) => s + r.amount, 0))
      : roundMoney(residualBase);
    rows.push({
      key: `${inv.id}-tax-discount`,
      serviceName: "TAX & DISCOUNT",
      categoryName: null,
      vendorName: null,
      description: "TAX & DISCOUNT (HEADER − ITEMS)",
      refLabel: inv.invoiceNumber || "",
      amount: residualAmount,
      currency: sameCurrency ? parentCurrency : "IDR",
      exchangeRate: sameCurrency ? parentRate : 1,
      isAdjustment: true,
    });
  }

  return rows;
};

const expenseBreakdownRows = (exp: ProfitExpense): ProfitBreakdownRow[] => {
  const items = exp.items || [];
  const parentCurrency = exp.currency || "IDR";
  const parentRate = toNumber(exp.exchangeRate) || 1;
  const vendorName = exp.vendor?.name || null;
  const headerDesc = exp.description || exp.category?.name || "VENDOR EXPENSE";

  if (items.length === 0) {
    return [
      {
        key: exp.id,
        serviceName: exp.category?.name || null,
        categoryName: exp.category?.name || null,
        vendorName,
        description: headerDesc,
        refLabel: "",
        amount: toNumber(exp.amount),
        currency: parentCurrency,
        exchangeRate: parentRate,
      },
    ];
  }

  const rows: ProfitBreakdownRow[] = items.map((it, idx) => ({
    key: `${exp.id}-item-${it.id || idx}`,
    serviceName: serviceLabel(it) || exp.category?.name || null,
    categoryName: categoryLabel(it) || exp.category?.name || null,
    vendorName,
    description: it.description || headerDesc,
    refLabel: "",
    amount: itemLineAmount(it),
    currency: it.currency || parentCurrency,
    exchangeRate: parentRate,
  }));

  const itemsBase = rows.reduce(
    (sum, r) =>
      sum +
      toProfitReportBaseAmount(
        r.amount,
        r.currency,
        r.exchangeRate,
        effectiveFallbackExchangeRate.value,
      ),
    0,
  );
  const totalBase = toProfitReportBaseAmount(
    exp.amount,
    exp.currency,
    exp.exchangeRate,
    effectiveFallbackExchangeRate.value,
  );
  const residualBase = totalBase - itemsBase;
  if (Math.abs(residualBase) >= 0.01) {
    const sameCurrency = rows.every((r) => r.currency === parentCurrency);
    const residualAmount = sameCurrency
      ? roundMoney(toNumber(exp.amount) - rows.reduce((s, r) => s + r.amount, 0))
      : roundMoney(residualBase);
    rows.push({
      key: `${exp.id}-adjustment`,
      serviceName: "ADJUSTMENT",
      categoryName: null,
      vendorName,
      description: residualAmount >= 0 ? "TAX / FEE (HEADER − ITEMS)" : "DISCOUNT / OVER-ITEMS",
      refLabel: "",
      amount: residualAmount,
      currency: sameCurrency ? parentCurrency : "IDR",
      exchangeRate: sameCurrency ? parentRate : 1,
      isAdjustment: true,
    });
  }

  return rows;
};

const revenueRows = computed<ProfitBreakdownRow[]>(() =>
  sortBreakdownRows(invoices.value.flatMap(invoiceBreakdownRows)),
);

const costRows = computed<ProfitBreakdownRow[]>(() =>
  sortBreakdownRows(vendorInvoices.value.flatMap(expenseBreakdownRows)),
);

const totalCost = computed(() => {
  if (allVendorInvoices.value.length > 0) {
    return vendorInvoices.value.reduce((sum: number, exp: ProfitExpense) => {
      return (
        sum +
        toProfitReportBaseAmount(
          exp.amount,
          exp.currency,
          exp.exchangeRate,
          effectiveFallbackExchangeRate.value,
        )
      );
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

const MAIN_PX = 950;
const SECTION_PX = 56;
const JOBINFO_PX = 92;
const SUMMARY_PX = 50;
const FOOTER_PX = 108;
const ROW_BASE_PX = 24;
const LINE_PX = 14;
const VENDOR_CHARS_PER_LINE = 20;
/** Kolom SERVICE ~22% lebar page mono font — konservatif biar wrap nggak overflow di PDF. */
const SERVICE_CHARS_PER_LINE = 18;

const linesFor = (text: string | null | undefined, charsPerLine: number) =>
  Math.max(1, Math.ceil((text?.length || 0) / charsPerLine));

const revenueRowPx = (row: ProfitBreakdownRow) =>
  ROW_BASE_PX +
  Math.max(
    1,
    linesFor(row.serviceName, SERVICE_CHARS_PER_LINE),
    hasProfitReportUsdConversion(
      row.currency,
      row.exchangeRate,
      effectiveFallbackExchangeRate.value,
    )
      ? 2
      : 1,
  ) *
    LINE_PX;

const costRowPx = (row: ProfitBreakdownRow) => {
  const vendorLines = linesFor(row.vendorName, VENDOR_CHARS_PER_LINE);
  const serviceLines = linesFor(row.serviceName, SERVICE_CHARS_PER_LINE);
  const amountLines = hasProfitReportUsdConversion(
    row.currency,
    row.exchangeRate,
    effectiveFallbackExchangeRate.value,
  )
    ? 2
    : 1;
  return ROW_BASE_PX + Math.max(vendorLines, serviceLines, amountLines) * LINE_PX;
};

interface ReportPage {
  isFirst: boolean;
  isLast: boolean;
  showRevenue: boolean;
  revenueRows: ProfitBreakdownRow[];
  revenueContinued: boolean;
  showCost: boolean;
  costRows: ProfitBreakdownRow[];
  costContinued: boolean;
}

const reportPages = computed<ReportPage[]>(() => {
  const revs = revenueRows.value;
  const costs = costRows.value;

  const pages: ReportPage[] = [];
  let ri = 0;
  let ci = 0;
  let costStarted = false;
  let first = true;

  while (true) {
    let budget = first ? MAIN_PX - JOBINFO_PX - SUMMARY_PX : MAIN_PX;
    const page: ReportPage = {
      isFirst: first,
      isLast: false,
      showRevenue: false,
      revenueRows: [],
      revenueContinued: false,
      showCost: false,
      costRows: [],
      costContinued: costStarted,
    };

    if (ri < revs.length || (first && revs.length === 0)) {
      page.showRevenue = true;
      page.revenueContinued = ri > 0;
      budget -= SECTION_PX;
      while (ri < revs.length) {
        const inv = revs[ri];
        if (!inv) break;
        const h = revenueRowPx(inv);
        if (budget - h < 0 && page.revenueRows.length > 0) break;
        page.revenueRows.push(inv);
        ri++;
        budget -= h;
      }
    }

    const revenueDone = ri >= revs.length;

    if (revenueDone && budget > SECTION_PX + ROW_BASE_PX && (ci < costs.length || !costStarted)) {
      page.showCost = true;
      page.costContinued = costStarted;
      budget -= SECTION_PX;
      costStarted = true;

      while (ci < costs.length) {
        const exp = costs[ci];
        if (!exp) break;
        const h = costRowPx(exp);
        const reserve = ci === costs.length - 1 ? FOOTER_PX : 0;
        if (budget - h - reserve < 0 && page.costRows.length > 0) break;
        page.costRows.push(exp);
        ci++;
        budget -= h;
      }
    }

    pages.push(page);
    first = false;

    if (ri >= revs.length && ci >= costs.length && costStarted) break;
    if (pages.length > 100) break;
  }

  const lastPage = pages[pages.length - 1];
  if (lastPage) lastPage.isLast = true;
  return pages;
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
        v-for="(page, pIdx) in reportPages"
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
            <span
              v-if="isUsingEstimatedExchangeRate"
              class="text-[0.48rem] font-bold uppercase tracking-wider text-amber-700 mt-1"
            >
              estimated API rate
            </span>
          </div>
          <div class="w-[35%] text-right pb-1 flex flex-col items-end justify-end h-full">
            <div class="text-[0.6rem] font-mono mb-1 text-black">
              PAGE: {{ pIdx + 1 }} OF {{ reportPages.length }}
            </div>
            <h1 class="text-xl font-bold tracking-widest uppercase leading-none text-[#062c58]">
              PROFIT REPORT
            </h1>
          </div>
        </div>

        <!-- Main Content Bordered Container -->
        <div
          class="main-border-container border border-[#062c58] flex-1 flex flex-col text-[0.7rem] relative overflow-hidden h-full"
        >
          <!-- Job Info Section (first page only) -->
          <div v-if="page.isFirst" class="flex border-b border-[#062c58]" style="min-height: 80px">
            <div class="w-1/2 border-r border-[#062c58] flex flex-col">
              <div class="border-b border-[#062c58] pt-1 px-2 pb-1" style="height: 40px">
                <span class="font-bold mb-1 text-[0.6rem] leading-none block uppercase"
                  >CUSTOMER:</span
                >
                <div class="font-medium text-xs text-black uppercase leading-tight">
                  {{ customerName }}
                </div>
              </div>
              <div class="flex flex-1">
                <div class="w-1/2 border-r border-[#062c58] pt-1 px-2 pb-1">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >FROM / POL</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-tight break-words"
                  >
                    {{ jobPolDisplay }}
                  </span>
                </div>
                <div class="w-1/2 pt-1 px-2 pb-1">
                  <span class="font-bold text-[0.6rem] leading-none mb-1 block uppercase"
                    >TO / POD</span
                  >
                  <span
                    class="font-mono text-[0.65rem] text-black uppercase leading-tight break-words"
                  >
                    {{ jobPodDisplay }}
                  </span>
                </div>
              </div>
            </div>
            <div class="w-1/2 flex flex-col">
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
              <div class="flex flex-1">
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

          <!-- Financial Summary Header (first page only) -->
          <div
            v-if="page.isFirst"
            class="bg-[#062c58] text-white px-3 py-2 flex justify-between items-center"
          >
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
            <div v-if="page.showRevenue" class="flex flex-col border-b border-[#062c58]">
              <div
                class="bg-[#062c58]/5 px-3 py-1.5 border-b border-[#062c58] flex justify-between"
              >
                <span class="font-bold text-[0.65rem] text-[#062c58]"
                  >REVENUE (PRICING){{ page.revenueContinued ? " — CONTINUED" : "" }}</span
                >
                <span class="font-bold text-[0.65rem] text-[#062c58]"
                  >TOTAL: {{ formatCurrency(totalRevenue) }}</span
                >
              </div>
              <div class="relative">
                <table class="w-full text-left font-mono">
                  <thead
                    class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50"
                  >
                    <tr>
                      <th class="px-3 py-1 w-[22%]">SERVICE</th>
                      <th class="px-3 py-1 w-[23%]">REF</th>
                      <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                      <th class="px-3 py-1 w-[22%] text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody class="text-[0.65rem]">
                    <tr
                      v-for="row in page.revenueRows"
                      :key="row.key"
                      class="border-b border-[#062c58]/5"
                    >
                      <td class="px-3 py-2 font-bold uppercase">
                        {{ row.serviceName || "—" }}
                      </td>
                      <td class="px-3 py-2">{{ row.refLabel || "-" }}</td>
                      <td class="px-3 py-2 truncate max-w-xs uppercase">
                        {{ row.description }}
                      </td>
                      <td class="px-3 py-2 text-right">
                        <div class="flex flex-col items-end">
                          <template
                            v-if="
                              hasProfitReportUsdConversion(
                                row.currency,
                                row.exchangeRate,
                                effectiveFallbackExchangeRate,
                              )
                            "
                          >
                            <span class="font-bold">
                              {{
                                formatCurrency(
                                  toProfitReportBaseAmount(
                                    row.amount,
                                    row.currency,
                                    row.exchangeRate,
                                    effectiveFallbackExchangeRate,
                                  ),
                                  "IDR",
                                )
                              }}
                            </span>
                            <span class="text-[0.5rem] text-muted-foreground italic">
                              {{ formatCurrency(row.amount, row.currency || "IDR") }}
                            </span>
                          </template>
                          <template v-else>
                            <span class="font-bold">
                              {{ formatCurrency(row.amount, row.currency || "IDR") }}
                            </span>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="page.revenueRows.length === 0">
                      <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                        No revenue recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Cost Table -->
            <div v-if="page.showCost" class="flex flex-col">
              <div class="bg-red-50/50 px-3 py-1.5 border-b border-[#062c58] flex justify-between">
                <span class="font-bold text-[0.65rem] text-red-700"
                  >COSTS (VENDOR){{ page.costContinued ? " — CONTINUED" : "" }}</span
                >
                <span class="font-bold text-[0.65rem] text-red-700"
                  >TOTAL: {{ formatCurrency(totalCost) }}</span
                >
              </div>
              <div class="relative">
                <table class="w-full text-left font-mono">
                  <thead
                    class="text-[0.55rem] font-bold border-b border-[#062c58]/20 bg-gray-50/50"
                  >
                    <tr>
                      <th class="px-3 py-1 w-[22%]">VENDOR</th>
                      <th class="px-3 py-1 w-[23%]">SERVICE</th>
                      <th class="px-3 py-1 flex-1">DESCRIPTION</th>
                      <th class="px-3 py-1 w-[22%] text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody class="text-[0.65rem]">
                    <tr
                      v-for="row in page.costRows"
                      :key="row.key"
                      class="border-b border-[#062c58]/5"
                    >
                      <td class="px-3 py-2 font-bold">{{ row.vendorName || "-" }}</td>
                      <td class="px-3 py-2 uppercase">{{ row.serviceName || "—" }}</td>
                      <td class="px-3 py-2 truncate max-w-xs uppercase">
                        {{ row.description }}
                      </td>
                      <td class="px-3 py-2 text-right">
                        <div class="flex flex-col items-end">
                          <template
                            v-if="
                              hasProfitReportUsdConversion(
                                row.currency,
                                row.exchangeRate,
                                effectiveFallbackExchangeRate,
                              )
                            "
                          >
                            <span class="font-bold">
                              {{
                                formatCurrency(
                                  toProfitReportBaseAmount(
                                    row.amount,
                                    row.currency,
                                    row.exchangeRate,
                                    effectiveFallbackExchangeRate,
                                  ),
                                  "IDR",
                                )
                              }}
                            </span>
                            <span class="text-[0.5rem] text-muted-foreground italic">
                              {{ formatCurrency(row.amount, row.currency || "IDR") }}
                            </span>
                          </template>
                          <template v-else>
                            <span class="font-bold">
                              {{ formatCurrency(row.amount, row.currency || "IDR") }}
                            </span>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="page.costRows.length === 0">
                      <td colspan="4" class="px-3 py-4 text-center text-muted-foreground italic">
                        No costs recorded
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Summary Footer area (last page only) -->
          <div v-if="page.isLast" class="border-t border-[#062c58] mt-auto bg-gray-50">
            <div class="flex h-24">
              <div class="w-1/2 p-3 text-[0.55rem] italic text-muted-foreground leading-tight">
                This report is generated for internal management analysis purposes. Data shown is
                based on recorded invoices and expenses linked to the job. Profit calculation: Total
                Revenue - Total Cost (COGS), with USD amounts converted to IDR using each recorded
                exchange rate<span v-if="isUsingEstimatedExchangeRate">
                  or estimated API rate where a USD document rate is still empty</span
                >.
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
