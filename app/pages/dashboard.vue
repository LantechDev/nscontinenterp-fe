<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  EXCEL_COLORS,
  EXCEL_FONTS,
  makeCellStyle,
  applyStyleToRange,
  mergeCells,
  setColWidth,
  setRowHeight,
} from "~/lib/excel-styles";
import {
  Wallet,
  Ship,
  Receipt,
  FileText,
  Calendar,
  Download,
  Plus,
  ChevronDown,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { formatRupiah } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const { pendingApprovals } = useDashboard();
const { canApproveJobs, user } = useAuth();

// State
const isExporting = ref(false);
const showPeriodDropdown = ref(false);
const periodDropdownRef = ref<HTMLElement | null>(null);
const showExportOptions = ref(false);

// Period selection state
const currentYear = new Date().getFullYear();
const selectedStartMonth = ref(0); // Jan
const selectedEndMonth = ref(11); // Dec
const selectedYear = ref(currentYear);

// Calculate start and end dates from selected period
const periodParams = computed(() => {
  const startDate = new Date(selectedYear.value, selectedStartMonth.value, 1);
  const endDate = new Date(selectedYear.value, selectedEndMonth.value + 1, 0, 23, 59, 59);
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
});

// Fetch dashboard data with SSR
const {
  data: dashboardData,
  pending: loading,
  refresh: refreshDashboard,
} = await useAsyncData<DashboardData>(
  "dashboard-data",
  async () => {
    const query = `?${new URLSearchParams(periodParams.value).toString()}`;
    return await $fetch<DashboardData>(`/api/admin/dashboard${query}`);
  },
  { server: false },
);

// Fetch pending approvals (lazy - doesn't block navigation)
const { refresh: refreshPendingApprovals } = await useAsyncData<PendingApprovalBl[]>(
  "pending-approvals",
  async () => {
    if (!canApproveJobs.value) return [];
    return await $fetch<PendingApprovalBl[]>("/api/dashboard/pending-approvals");
  },
  { lazy: true, server: false },
);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const periodDisplay = computed(() => {
  const start = months[selectedStartMonth.value];
  const end = months[selectedEndMonth.value];
  return `${start} - ${end}, ${selectedYear.value}`;
});

const applyPeriod = () => {
  if (selectedStartMonth.value > selectedEndMonth.value) {
    toast.error("Start month must be before or equal to end month");
    return;
  }

  showPeriodDropdown.value = false;
  refreshDashboard();
};

const handleExportPdf = async () => {
  if (!dashboardData.value) {
    toast.error("Dashboard data is not ready yet");
    return;
  }

  isExporting.value = true;

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let yPos = 18;

    const addLine = (
      text: string,
      options?: { bold?: boolean; indent?: number; size?: number },
    ) => {
      const indent = options?.indent || 0;
      doc.setFont("helvetica", options?.bold ? "bold" : "normal");
      doc.setFontSize(options?.size || 10);

      const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - indent);
      if (yPos + lines.length * 6 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }

      doc.text(lines, margin + indent, yPos);
      yPos += lines.length * 6;
    };

    const addSection = (title: string) => {
      yPos += 4;
      addLine(title, { bold: true, size: 12 });
      yPos += 1;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Dashboard Summary", margin, yPos);
    yPos += 8;

    addLine(`Period: ${periodDisplay.value}`);
    addLine(`Generated: ${new Date().toLocaleString("id-ID")}`);

    addSection("Key Metrics");
    const metricLines = [
      `Total Income: ${dashboardData.value.stats.totalIncome}`,
      `Active Job: ${dashboardData.value.stats.activeJobs}`,
      `Invoice Pending: ${dashboardData.value.stats.pendingInvoices}`,
      `Active Offer: ${dashboardData.value.stats.activeOffers}`,
    ];
    metricLines.forEach((line) => addLine(line, { indent: 2 }));

    addSection("Financial Overview");
    if (
      dashboardData.value.financialOverview.categories &&
      dashboardData.value.financialOverview.categories.length > 0 &&
      dashboardData.value.financialOverview.income &&
      dashboardData.value.financialOverview.outcome
    ) {
      dashboardData.value.financialOverview.categories.forEach((category, index) => {
        const income = dashboardData.value?.financialOverview.income[index] || 0;
        const outcome = dashboardData.value?.financialOverview.outcome[index] || 0;
        addLine(
          `${category}: Income ${formatRupiah(income * 1000000)} | Outcome ${formatRupiah(outcome * 1000000)}`,
          { indent: 2 },
        );
      });
    } else {
      addLine("No financial data available", { indent: 2 });
    }

    addSection("Recent Jobs");
    if (dashboardData.value.recentJobs.length === 0) {
      addLine("No recent jobs", { indent: 2 });
    } else {
      dashboardData.value.recentJobs.forEach((job) => {
        addLine(
          `${job.jobNumber} • ${job.customer} • ${job.origin} -> ${job.destination} • ${job.status}`,
          { indent: 2 },
        );
      });
    }

    addSection("Upcoming Activities");
    if (dashboardData.value.upcomingEvents.length === 0) {
      addLine("No upcoming activities", { indent: 2 });
    } else {
      dashboardData.value.upcomingEvents.forEach((activity) => {
        addLine(`${activity.title} • ${activity.description} • ${activity.time}`, { indent: 2 });
      });
    }

    doc.save(
      `dashboard-summary-${selectedYear.value}-${selectedStartMonth.value + 1}-${selectedEndMonth.value + 1}.pdf`,
    );
    toast.success("Dashboard exported to PDF");
  } catch (exportError) {
    console.error("Failed to export dashboard PDF:", exportError);
    toast.error("Failed to export dashboard");
  } finally {
    isExporting.value = false;
  }
};

const handleExportExcel = () => {
  if (!dashboardData.value) {
    toast.error("Dashboard data is not ready yet");
    return;
  }
  isExporting.value = true;
  try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[], []]);

    const HEADER_ROW = 0;
    const PERIOD_ROW = 1;
    const KEY_METRICS_ROW = 2;
    const DATA_START = 3;

    // Row 1: Header
    XLSX.utils.sheet_add_aoa(ws, [["PT NOVA SYNC — DASHBOARD SUMMARY"]], {
      origin: { r: HEADER_ROW, c: 0 },
    });
    mergeCells(ws, { c: 0, r: HEADER_ROW }, { c: 3, r: HEADER_ROW });
    setRowHeight(ws, HEADER_ROW, 22);
    applyStyleToRange(
      ws,
      { s: { c: 0, r: HEADER_ROW }, e: { c: 3, r: HEADER_ROW } },
      makeCellStyle({ bold: true, fontSize: 14, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
    );

    // Row 2: Period info
    XLSX.utils.sheet_add_aoa(ws, [[`Period: ${periodDisplay.value}`]], {
      origin: { r: PERIOD_ROW, c: 0 },
    });
    mergeCells(ws, { c: 0, r: PERIOD_ROW }, { c: 3, r: PERIOD_ROW });
    setRowHeight(ws, PERIOD_ROW, 18);
    applyStyleToRange(
      ws,
      { s: { c: 0, r: PERIOD_ROW }, e: { c: 3, r: PERIOD_ROW } },
      makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.white, bgColor: EXCEL_COLORS.darkNavy, align: "center" }),
    );

    // Row 3: Key Metrics Header
    XLSX.utils.sheet_add_aoa(ws, [["KEY METRICS", "", "", ""]], {
      origin: { r: KEY_METRICS_ROW, c: 0 },
    });
    mergeCells(ws, { c: 0, r: KEY_METRICS_ROW }, { c: 3, r: KEY_METRICS_ROW });
    setRowHeight(ws, KEY_METRICS_ROW, 18);
    applyStyleToRange(
      ws,
      { s: { c: 0, r: KEY_METRICS_ROW }, e: { c: 3, r: KEY_METRICS_ROW } },
      makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
    );

    const metrics = [
      ["Total Income", formatRupiah(dashboardData.value.stats.totalIncome)],
      ["Active Jobs", String(dashboardData.value.stats.activeJobs)],
      ["Invoice Pending", String(dashboardData.value.stats.pendingInvoices)],
      ["Active Offers", String(dashboardData.value.stats.activeOffers)],
    ];

    metrics.forEach(([label, val], idx) => {
      const row = DATA_START + idx;
      XLSX.utils.sheet_add_aoa(ws, [[label, val]], { origin: { r: row, c: 0 } });
      setRowHeight(ws, row, 16);
      const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
      mergeCells(ws, { c: 0, r: row }, { c: 0, r: row });
      applyStyleToRange(
        ws,
        { s: { c: 0, r: row }, e: { c: 0, r: row } },
        makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }),
      );
      applyStyleToRange(
        ws,
        { s: { c: 1, r: row }, e: { c: 3, r: row } },
        makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }),
      );
    });

    const financialRow = DATA_START + metrics.length + 1;
    XLSX.utils.sheet_add_aoa(ws, [["FINANCIAL OVERVIEW", "", "", ""]], {
      origin: { r: financialRow, c: 0 },
    });
    mergeCells(ws, { c: 0, r: financialRow }, { c: 3, r: financialRow });
    setRowHeight(ws, financialRow, 18);
    applyStyleToRange(
      ws,
      { s: { c: 0, r: financialRow }, e: { c: 3, r: financialRow } },
      makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
    );

    let r = financialRow + 1;
    if (dashboardData.value.financialOverview.categories?.length) {
      dashboardData.value.financialOverview.categories.forEach((cat, idx) => {
        const income = dashboardData.value?.financialOverview.income[idx] || 0;
        const outcome = dashboardData.value?.financialOverview.outcome[idx] || 0;
        XLSX.utils.sheet_add_aoa(ws, [[cat, "Income: " + formatRupiah(income * 1000000), "Outcome: " + formatRupiah(outcome * 1000000), ""]], {
          origin: { r, c: 0 },
        });
        setRowHeight(ws, r, 16);
        const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
        applyStyleToRange(ws, { s: { c: 0, r }, e: { c: 3, r } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
        r++;
      });
    }

    r++;
    XLSX.utils.sheet_add_aoa(ws, [["RECENT JOBS", "", "", ""]], {
      origin: { r, c: 0 },
    });
    mergeCells(ws, { c: 0, r }, { c: 3, r });
    setRowHeight(ws, r, 18);
    applyStyleToRange(
      ws,
      { s: { c: 0, r }, e: { c: 3, r } },
      makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
    );
    r++;

    if (dashboardData.value.recentJobs.length === 0) {
      XLSX.utils.sheet_add_aoa(ws, [["No recent jobs", "", "", ""]], {
        origin: { r, c: 0 },
      });
      setRowHeight(ws, r, 16);
      applyStyleToRange(ws, { s: { c: 0, r }, e: { c: 3, r } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: EXCEL_COLORS.white, align: "left" }));
      r++;
    } else {
      dashboardData.value.recentJobs.forEach((job, idx) => {
        XLSX.utils.sheet_add_aoa(ws, [[job.jobNumber, job.customer, `${job.origin} -> ${job.destination}`, job.status]], {
          origin: { r, c: 0 },
        });
        setRowHeight(ws, r, 16);
        const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
        applyStyleToRange(ws, { s: { c: 0, r }, e: { c: 3, r } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
        r++;
      });
    }

    r++;
    XLSX.utils.sheet_add_aoa(ws, [["UPCOMING ACTIVITIES", "", "", ""]], {
      origin: { r, c: 0 },
    });
    mergeCells(ws, { c: 0, r }, { c: 3, r });
    setRowHeight(ws, r, 18);
    applyStyleToRange(
      ws,
      { s: { c: 0, r }, e: { c: 3, r } },
      makeCellStyle({ bold: true, fontSize: EXCEL_FONTS.colHeaderSize, fontColor: EXCEL_COLORS.darkNavy, bgColor: EXCEL_COLORS.lightBlue, align: "left" }),
    );
    r++;

    if (dashboardData.value.upcomingEvents.length === 0) {
      XLSX.utils.sheet_add_aoa(ws, [["No upcoming activities", "", "", ""]], {
        origin: { r, c: 0 },
      });
      setRowHeight(ws, r, 16);
      applyStyleToRange(ws, { s: { c: 0, r }, e: { c: 3, r } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: EXCEL_COLORS.white, align: "left" }));
    } else {
      dashboardData.value.upcomingEvents.forEach((act, idx) => {
        XLSX.utils.sheet_add_aoa(ws, [[act.title, act.description, act.time, ""]], {
          origin: { r, c: 0 },
        });
        setRowHeight(ws, r, 16);
        const bg = idx % 2 === 0 ? EXCEL_COLORS.white : EXCEL_COLORS.lightGray;
        applyStyleToRange(ws, { s: { c: 0, r }, e: { c: 3, r } }, makeCellStyle({ fontSize: EXCEL_FONTS.dataSize, bgColor: bg, align: "left" }));
        r++;
      });
    }

    setColWidth(ws, 0, 25);
    setColWidth(ws, 1, 35);
    setColWidth(ws, 2, 30);
    setColWidth(ws, 3, 20);

    ws["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 3, r: r } });

    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
    XLSX.writeFile(wb, `DASHBOARD_SUMMARY_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Dashboard exported to Excel");
  } catch (exportError) {
    console.error("Failed to export dashboard Excel:", exportError);
    toast.error("Failed to export dashboard");
  } finally {
    isExporting.value = false;
  }
};

// Close dropdown when clicking outside
onClickOutside(periodDropdownRef as Ref<HTMLElement>, () => {
  showPeriodDropdown.value = false;
});

// Fetch dashboard data
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="page-title text-2xl font-bold">Dashboard</h1>

      <div class="flex items-center gap-2">
        <div ref="periodDropdownRef" class="relative">
          <button
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            @click="showPeriodDropdown = !showPeriodDropdown"
          >
            <Calendar class="w-4 h-4 text-muted-foreground" />
            <span
              >Time Period:
              <span class="text-foreground font-semibold">{{ periodDisplay }}</span></span
            >
            <ChevronDown
              class="w-4 h-4 text-muted-foreground transition-transform"
              :class="{ 'rotate-180': showPeriodDropdown }"
            />
          </button>

          <!-- Period Dropdown -->
          <div
            v-if="showPeriodDropdown"
            class="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-border z-50 animate-in fade-in zoom-in-95"
          >
            <div class="p-4 space-y-4">
              <h3 class="font-semibold text-foreground">Select Period</h3>

              <!-- Year Selection -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground uppercase">Year</label>
                <div class="flex items-center gap-2">
                  <button
                    class="p-1 rounded hover:bg-muted transition-colors"
                    @click="selectedYear--"
                  >
                    <ChevronDown class="w-4 h-4 rotate-90" />
                  </button>
                  <span class="flex-1 text-center font-medium">{{ selectedYear }}</span>
                  <button
                    class="p-1 rounded hover:bg-muted transition-colors"
                    @click="selectedYear++"
                  >
                    <ChevronDown class="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              </div>

              <!-- Start Month -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground uppercase"
                  >Start Month</label
                >
                <select
                  v-model="selectedStartMonth"
                  class="w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none"
                >
                  <option v-for="(month, index) in months" :key="index" :value="index">
                    {{ month }}
                  </option>
                </select>
              </div>

              <!-- End Month -->
              <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground uppercase">End Month</label>
                <select
                  v-model="selectedEndMonth"
                  class="w-full px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-2 focus:ring-[#012D5A] outline-none"
                >
                  <option v-for="(month, index) in months" :key="index" :value="index">
                    {{ month }}
                  </option>
                </select>
              </div>

              <!-- Apply Button -->
              <button
                class="w-full px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
                @click="applyPeriod"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <button
          class="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          :disabled="isExporting || loading"
          @click="showExportOptions = true"
        >
          <Loader2 v-if="isExporting" class="w-4 h-4 text-muted-foreground animate-spin" />
          <Download v-else class="w-4 h-4 text-muted-foreground" />
          <span>{{ isExporting ? "Exporting..." : "Export" }}</span>
        </button>
        <NuxtLink
          to="/operational/jobs/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Quick Add</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Pending Approvals (Only for Owner/Admin) -->
    <div
      v-if="canApproveJobs && pendingApprovals.length > 0"
      class="border border-border rounded-xl bg-white overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500"
    >
      <div class="flex items-center justify-between p-5 border-b border-border">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <h3 class="text-lg font-semibold text-foreground">Pending BL Approvals</h3>
          <span class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">
            {{ pendingApprovals.length }} Action Required
          </span>
        </div>
        <NuxtLink
          v-if="pendingApprovals.length > 3"
          to="/operational/jobs"
          class="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </NuxtLink>
      </div>

      <div class="divide-y divide-border">
        <div
          v-for="bl in pendingApprovals.slice(0, 5)"
          :key="bl.id"
          class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors group"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform"
            >
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-foreground">{{ bl.blNumber || "DRAFT BL" }}</p>
                <span
                  class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase"
                  >{{ bl.job?.jobNumber }}</span
                >
              </div>
              <p class="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock class="w-3.5 h-3.5" /> Requested
                {{ new Date(bl.updatedAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/operational/jobs?id=${bl.jobId || bl.job?.id}&tab=ebl&blId=${bl.id}`"
              class="px-4 py-2 bg-[#012D5A] text-white text-sm font-medium rounded-lg hover:bg-[#012D5A]/90 transition-colors flex items-center gap-2"
            >
              Review EBL
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="card-stat p-4 rounded-xl border border-border animate-pulse"
      >
        <div class="h-4 bg-muted rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-muted rounded w-3/4"></div>
      </div>
    </div>

    <!-- Stats grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard
        title="Total Income"
        :value="dashboardData?.stats?.totalIncome || 'Rp0'"
        :change="dashboardData?.stats?.totalIncomeChange ?? 0"
        icon-name="Wallet"
        :icon="Wallet"
        variant="primary"
      />
      <DashboardStatCard
        title="Active Job"
        :value="String(dashboardData?.stats?.activeJobs || 0)"
        :change="dashboardData?.stats?.activeJobsChange ?? 0"
        change-label="vs Last Year"
        :icon="Ship"
      />
      <DashboardStatCard
        title="Invoice Pending"
        :value="String(dashboardData?.stats?.pendingInvoices || 0)"
        :change="dashboardData?.stats?.pendingInvoicesChange ?? 0"
        change-label="vs Last Year"
        :icon="Receipt"
      />
      <DashboardStatCard
        title="Active Offer"
        :value="String(dashboardData?.stats?.activeOffers || 0)"
        :change="dashboardData?.stats?.activeOffersChange ?? 0"
        change-label="vs Last Year"
        :icon="FileText"
      />
    </div>

    <!-- Charts and tables row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <DashboardRevenueChart :data="dashboardData?.financialOverview" />
      </div>
      <div>
        <DashboardUpcomingActivities :events="dashboardData?.upcomingEvents" />
      </div>
    </div>

    <!-- Recent jobs -->
    <DashboardRecentJobs :jobs="dashboardData?.recentJobs" />

    <UiExportOptionsModal
      v-model:open="showExportOptions"
      title="Export Dashboard"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />
  </div>
</template>
