<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { jsPDF } from "jspdf";
import { buildStyledWorkbook, type StyledRow } from "~/lib/excel-styled";
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
import { useExportPopup } from "~/composables/useExportPopup";

definePageMeta({
  layout: "dashboard",
});

const { pendingApprovals } = useDashboard();
const { canApproveJobs, user } = useAuth();
const { showExportOptions, triggerX, triggerY, triggerWidth, triggerHeight, openExportPopup } =
  useExportPopup();

// State
const isExporting = ref(false);
const showPeriodDropdown = ref(false);
const periodDropdownRef = ref<HTMLElement | null>(null);

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
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Colors
    const darkNavy = [1, 45, 90] as [number, number, number];
    const lightBlue = [214, 228, 240] as [number, number, number];
    const white = [255, 255, 255] as [number, number, number];
    const black = [31, 41, 55] as [number, number, number];
    const gray = [249, 250, 251] as [number, number, number];

    // Helper: check page break
    const checkPage = (needed: number) => {
      if (yPos + needed > pageHeight - margin - 12) {
        addFooter();
        doc.addPage();
        yPos = margin;
      }
    };

    // Helper: draw section header row (light blue bg, dark navy text, bold, NO borders)
    const drawSectionHeader = (text: string) => {
      checkPage(12);
      doc.setFillColor(...lightBlue);
      doc.rect(margin, yPos, contentWidth, 8, "F");
      doc.setTextColor(...darkNavy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(text, margin + 3, yPos + 5.5);
      yPos += 10;
    };

    // Helper: draw column header row (dark navy bg, white text)
    const drawColHeader = (cols: string[], colWidths: number[]) => {
      checkPage(10);
      doc.setFillColor(...darkNavy);
      doc.rect(margin, yPos, contentWidth, 8, "F");
      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      let tx = margin + 2;
      cols.forEach((col, i) => {
        doc.text(col, tx, yPos + 5.5);
        tx += colWidths[i] ?? 0;
      });
      yPos += 8;
    };

    // Helper: draw data row with alternating white/gray bg, thin navy borders, black text
    const drawDataRow = (cols: string[], colWidths: number[], idx: number) => {
      checkPage(8);
      const bg = idx % 2 === 0 ? white : gray;
      doc.setFillColor(...bg);
      doc.rect(margin, yPos, contentWidth, 7, "F");

      // Draw all borders (thin navy)
      doc.setDrawColor(...darkNavy);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPos, contentWidth, 7);

      // Draw text
      doc.setTextColor(...black);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let tx = margin + 2;
      cols.forEach((col, i) => {
        const maxW = (colWidths[i] ?? 0) - 4;
        const text = doc.splitTextToSize(col, maxW);
        doc.text(text[0]?.toString() || "", tx, yPos + 5);
        tx += colWidths[i] ?? 0;
      });
      yPos += 7;
    };

    // Helper: add footer on all pages
    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(...darkNavy);
        doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
        doc.setTextColor(...white);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(new Date().toLocaleDateString("id-ID"), margin, pageHeight - 4);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 4, {
          align: "right",
        });
      }
    };

    // === Row 1: Company Header (dark navy, company name left, report title right) ===
    doc.setFillColor(...darkNavy);
    doc.rect(0, 0, pageWidth, 16, "F");
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("PT NOVA SYNC", margin, 11);
    doc.setFontSize(11);
    doc.text("Dashboard Summary", pageWidth / 2, 11, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("id-ID")}`, pageWidth - margin, 11, {
      align: "right",
    });
    yPos = 20;

    // === Row 2: Period info bar (dark navy) ===
    doc.setFillColor(...darkNavy);
    doc.rect(0, yPos - 4, pageWidth, 8, "F");
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Period: ${periodDisplay.value}`, margin, yPos);
    yPos += 8;

    // === Key Metrics ===
    drawSectionHeader("KEY METRICS");
    const colW3 = [contentWidth * 0.3, contentWidth * 0.35, contentWidth * 0.35];
    drawColHeader(["Description", "Value", "Change"], colW3);
    const metricItems = [
      [
        "Total Income",
        dashboardData.value.stats.totalIncome || "Rp0",
        `${(dashboardData.value.stats.totalIncomeChange ?? 0) >= 0 ? "+" : ""}${dashboardData.value.stats.totalIncomeChange ?? 0}%`,
      ],
      [
        "Active Jobs",
        String(dashboardData.value.stats.activeJobs ?? 0),
        `${(dashboardData.value.stats.activeJobsChange ?? 0) >= 0 ? "+" : ""}${dashboardData.value.stats.activeJobsChange ?? 0}%`,
      ],
      [
        "Invoice Pending",
        String(dashboardData.value.stats.pendingInvoices ?? 0),
        `${(dashboardData.value.stats.pendingInvoicesChange ?? 0) >= 0 ? "+" : ""}${dashboardData.value.stats.pendingInvoicesChange ?? 0}%`,
      ],
      [
        "Active Offers",
        String(dashboardData.value.stats.activeOffers ?? 0),
        `${(dashboardData.value.stats.activeOffersChange ?? 0) >= 0 ? "+" : ""}${dashboardData.value.stats.activeOffersChange ?? 0}%`,
      ],
    ];
    metricItems.forEach((row, idx) => drawDataRow(row, colW3, idx));

    // === Financial Overview ===
    yPos += 4;
    drawSectionHeader("FINANCIAL OVERVIEW");
    const colW4 = [contentWidth * 0.25, contentWidth * 0.375, contentWidth * 0.375];
    drawColHeader(["Category", "Income", "Outcome"], colW4);
    if (dashboardData.value.financialOverview.categories?.length) {
      dashboardData.value.financialOverview.categories.forEach((cat, idx) => {
        const income = dashboardData.value?.financialOverview.income[idx] || 0;
        const outcome = dashboardData.value?.financialOverview.outcome[idx] || 0;
        drawDataRow(
          [cat, formatRupiah(income * 1000000), formatRupiah(outcome * 1000000)],
          colW4,
          idx,
        );
      });
    } else {
      drawDataRow(["No financial data available", "", ""], colW4, 0);
    }

    // === Recent Jobs ===
    yPos += 4;
    drawSectionHeader("RECENT JOBS");
    const colW5 = [
      contentWidth * 0.15,
      contentWidth * 0.25,
      contentWidth * 0.38,
      contentWidth * 0.22,
    ];
    drawColHeader(["Job No.", "Customer", "Route", "Status"], colW5);
    if (dashboardData.value.recentJobs.length === 0) {
      drawDataRow(["No recent jobs", "", "", ""], colW5, 0);
    } else {
      dashboardData.value.recentJobs.forEach((job, idx) => {
        drawDataRow(
          [job.jobNumber, job.customer, `${job.origin} -> ${job.destination}`, job.status],
          colW5,
          idx,
        );
      });
    }

    // === Upcoming Activities ===
    yPos += 4;
    drawSectionHeader("UPCOMING ACTIVITIES");
    const colW6 = [contentWidth * 0.3, contentWidth * 0.42, contentWidth * 0.28];
    drawColHeader(["Activity", "Description", "Time"], colW6);
    if (dashboardData.value.upcomingEvents.length === 0) {
      drawDataRow(["No upcoming activities", "", ""], colW6, 0);
    } else {
      dashboardData.value.upcomingEvents.forEach((act, idx) => {
        drawDataRow([act.title, act.description || "-", act.time || "-"], colW6, idx);
      });
    }

    addFooter();

    doc.save(`DASHBOARD_SUMMARY_${new Date().toISOString().split("T")[0]}.pdf`);
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
    const rows: StyledRow[] = [];

    // Row 0: Title
    rows.push({ cells: ["PT NOVA SYNC — DASHBOARD SUMMARY", "", "", ""], style: 7 });
    // Row 1: Period
    rows.push({
      cells: [
        `Period: ${periodDisplay.value}  |  Generated: ${new Date().toLocaleDateString("id-ID")}`,
        "",
        "",
        "",
      ],
      style: 8,
    });
    // Row 2: Key Metrics section header
    rows.push({ cells: ["KEY METRICS", "", "", ""], style: 9 });

    // Metrics rows
    const stats = dashboardData.value.stats;
    const metrics = [
      [
        "Total Income",
        stats.totalIncome || "Rp0",
        `${(stats.totalIncomeChange ?? 0) >= 0 ? "+" : ""}${stats.totalIncomeChange ?? 0}%`,
      ],
      [
        "Active Jobs",
        String(stats.activeJobs ?? 0),
        `${(stats.activeJobsChange ?? 0) >= 0 ? "+" : ""}${stats.activeJobsChange ?? 0}%`,
      ],
      [
        "Invoice Pending",
        String(stats.pendingInvoices ?? 0),
        `${(stats.pendingInvoicesChange ?? 0) >= 0 ? "+" : ""}${stats.pendingInvoicesChange ?? 0}%`,
      ],
      [
        "Active Offers",
        String(stats.activeOffers ?? 0),
        `${(stats.activeOffersChange ?? 0) >= 0 ? "+" : ""}${stats.activeOffersChange ?? 0}%`,
      ],
    ];
    metrics.forEach((m, i) => {
      rows.push({ cells: [m[0], m[1], m[2], ""], style: i % 2 === 0 ? 1 : 2 });
    });

    // Spacer
    rows.push({ cells: ["", "", "", ""], style: 1 });
    // Financial Overview section
    rows.push({ cells: ["FINANCIAL OVERVIEW", "", "", ""], style: 9 });
    if (dashboardData.value.financialOverview.categories?.length) {
      dashboardData.value.financialOverview.categories.forEach((cat, idx) => {
        const income = dashboardData.value?.financialOverview.income[idx] || 0;
        const outcome = dashboardData.value?.financialOverview.outcome[idx] || 0;
        rows.push({
          cells: [
            cat,
            "Income: " + formatRupiah(income * 1000000),
            "Outcome: " + formatRupiah(outcome * 1000000),
            "",
          ],
          style: idx % 2 === 0 ? 1 : 2,
        });
      });
    } else {
      rows.push({ cells: ["No financial data available", "", "", ""], style: 1 });
    }

    // Spacer
    rows.push({ cells: ["", "", "", ""], style: 1 });
    // Recent Jobs section
    rows.push({ cells: ["RECENT JOBS", "", "", ""], style: 9 });
    if (dashboardData.value.recentJobs.length === 0) {
      rows.push({ cells: ["No recent jobs", "", "", ""], style: 1 });
    } else {
      dashboardData.value.recentJobs.forEach((job, i) => {
        rows.push({
          cells: [job.jobNumber, job.customer, `${job.origin} → ${job.destination}`, job.status],
          style: i % 2 === 0 ? 1 : 2,
        });
      });
    }

    // Spacer
    rows.push({ cells: ["", "", "", ""], style: 1 });
    // Upcoming Activities section
    rows.push({ cells: ["UPCOMING ACTIVITIES", "", "", ""], style: 9 });
    if (dashboardData.value.upcomingEvents.length === 0) {
      rows.push({ cells: ["No upcoming activities", "", "", ""], style: 1 });
    } else {
      dashboardData.value.upcomingEvents.forEach((act, i) => {
        rows.push({
          cells: [act.title, act.description || "", act.time || "", ""],
          style: i % 2 === 0 ? 1 : 2,
        });
      });
    }

    const colWidths = [26, 36, 32, 22];
    buildStyledWorkbook(
      "Dashboard",
      rows,
      colWidths,
      `DASHBOARD_SUMMARY_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
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
          @click="openExportPopup($event)"
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
      :trigger-x="triggerX"
      :trigger-y="triggerY"
      :trigger-width="triggerWidth"
      :trigger-height="triggerHeight"
      title="Export Dashboard"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />
  </div>
</template>
