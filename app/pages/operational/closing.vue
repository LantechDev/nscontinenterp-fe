<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Search,
  CheckCircle,
  Clock,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  X,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import Modal from "~/components/ui/Modal.vue";
import { useJobs } from "~/composables/useJobs";
import type { JobCostItem } from "~/types/finance-dashboard";
import { toast } from "vue-sonner";
import JobProfitPreview from "~/components/operational/JobProfitPreview.vue";
import { Download, FileSpreadsheet } from "lucide-vue-next";
import { buildStyledWorkbook, type StyledRow } from "~/lib/excel-styled";

definePageMeta({
  layout: "dashboard",
});

const { fetchClosingJobs, completeJob, isLoading } = useJobs();

const closingJobs = ref<JobCostItem[]>([]);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
});

const profitPreviewRef = ref<InstanceType<typeof JobProfitPreview> | null>(null);
const isGeneratingPDF = ref(false);
const activeJobForPdf = ref<unknown>(null);

const handleDownloadProfit = async (job: JobCostItem) => {
  isGeneratingPDF.value = true;
  try {
    // Fetch full job data including financial details from correct endpoints
    const [jobDetail, invoicesRes, expensesRes] = await Promise.all([
      $fetch<Record<string, unknown>>(`/api/operational/jobs/${job.id}`),
      $fetch<unknown[]>(`/api/finance/invoice`, { query: { jobId: job.id } }),
      $fetch<{ items: unknown[] }>(`/api/finance/expense`, { query: { jobId: job.id } }),
    ]);

    // Combine them for the preview
    activeJobForPdf.value = {
      ...job,
      ...jobDetail,
      invoices: invoicesRes || [],
      expenses: expensesRes?.items || [],
      revenue: job.revenue,
      cogs: job.cogs,
      profit: job.profit,
      margin: job.margin,
    };

    await nextTick();
    if (profitPreviewRef.value) {
      const success = await profitPreviewRef.value.generatePDF();
      if (!success) throw new Error("PDF generation failed");
    }
  } catch (error) {
    console.error("Failed to fetch job details for export:", error);
    toast.error("Gagal mengambil detail job untuk laporan. Pastikan koneksi aman.");
  } finally {
    isGeneratingPDF.value = false;
    activeJobForPdf.value = null;
  }
};

const searchQuery = ref("");
const period = ref("month");

const loadData = async () => {
  const response = await fetchClosingJobs({
    search: searchQuery.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
    period: period.value,
  });

  if (response.success && response.data) {
    closingJobs.value = response.data.items;
    pagination.value = response.data.pagination;
  }
};

onMounted(() => {
  loadData();
});

// Watch for search or pagination changes
watch([searchQuery, period], () => {
  pagination.value.page = 1;
  loadData();
});

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const selectedJob = ref<JobCostItem | null>(null);
const showJobModal = ref(false);

const openJobModal = (job: JobCostItem): void => {
  selectedJob.value = job;
  showJobModal.value = true;
};

const handleCloseJob = async () => {
  if (!selectedJob.value) return;

  const response = await completeJob(selectedJob.value.id);
  if (response.success) {
    toast.success("Job berhasil diselesaikan secara operasional.");
    showJobModal.value = false;
    selectedJob.value = null;
    await loadData();
  } else {
    toast.error(response.error || "Gagal menyelesaikan job.");
  }
};

const handleExportExcel = () => {
  if (closingJobs.value.length === 0) return;

  try {
    const colHeaders = [
      "No. Job",
      "Customer",
      "Total Revenue",
      "Total Cost",
      "Profit",
      "Margin (%)",
      "Status",
    ];
    const rows: StyledRow[] = [
      { cells: ["PT Nova Sync Continent — JOB PROFIT REPORT", "", "", "", "", "", ""], style: 7 },
      {
        cells: [
          `Generated: ${new Date().toLocaleDateString("id-ID")} | Search: ${searchQuery.value || "All"}`,
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        style: 8,
      },
      { cells: colHeaders, style: 0 },
    ];

    closingJobs.value.forEach((job, i) => {
      const isEven = i % 2 === 0;
      rows.push({
        cells: [
          job.jobNumber,
          job.customer,
          job.revenue,
          job.cogs,
          job.profit,
          job.margin,
          "Closed",
        ],
        style: isEven ? 5 : 6,
        cellStyles: [
          isEven ? 1 : 2,
          isEven ? 1 : 2,
          isEven ? 5 : 6,
          isEven ? 5 : 6,
          isEven ? 5 : 6,
          isEven ? 5 : 6,
          isEven ? 1 : 2,
        ],
      });
    });

    const colWidths = [20, 30, 20, 20, 20, 15, 12];
    buildStyledWorkbook(
      "Job Profit Report",
      rows,
      colWidths,
      `JOB_PROFIT_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Gagal mengekspor data ke Excel.");
  }
};

const handlePageChange = (newPage: number) => {
  pagination.value.page = newPage;
  loadData();
};

const formatCurrency = (value: unknown) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
};

const stats = computed(() => {
  const jobs = closingJobs.value || [];
  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  jobs.forEach((job) => {
    totalRevenue += Number(job.revenue || 0);
    totalCost += Number(job.cogs || 0);
    totalProfit += Number(job.profit || 0);
  });

  const avgMargin = jobs.length > 0 ? (totalProfit / (totalRevenue || 1)) * 100 : 0;

  return {
    totalRevenue,
    totalCost,
    totalProfit,
    avgMargin: Math.round(avgMargin * 10) / 10,
  };
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Laporan Profit Job</h1>
        <p class="text-muted-foreground mt-1">
          Daftar job yang sudah selesai secara operasional dan perhitungan profitnya
        </p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 mr-2">
          <button
            @click="viewMode = 'list'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutList class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="
              cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#012D5A] text-white'
                  : 'text-muted-foreground hover:bg-muted',
              )
            "
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard
        title="Total Job Selesai"
        :value="String(pagination.total)"
        :icon="CheckCircle"
        variant="primary"
      />
      <DashboardStatCard
        title="Total Revenue"
        :value="formatCurrency(stats.totalRevenue)"
        :icon="TrendingUp"
      />
      <DashboardStatCard
        title="Total Cost"
        :value="formatCurrency(stats.totalCost)"
        :icon="TrendingDown"
      />
      <DashboardStatCard
        title="Total Profit"
        :value="formatCurrency(stats.totalProfit)"
        :icon="DollarSign"
      />
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari data job..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="handleExportExcel"
          :disabled="isLoading || closingJobs.length === 0"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          <FileSpreadsheet class="w-4 h-4 text-green-600" />
          <span>Export Excel</span>
        </button>
      </div>
    </div>

    <!-- List View -->
    <div
      v-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Customer</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Total Revenue</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Total Cost</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Profit</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="py-12 text-center">
                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-8 h-8 border-4 border-[#012D5A] border-t-transparent rounded-full animate-spin"
                  ></div>
                  <p class="text-sm text-muted-foreground font-medium">Memuat data...</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="closingJobs.length === 0" class="border-b border-border last:border-0">
              <td colspan="7" class="py-12 text-center">
                <p class="text-sm text-muted-foreground font-medium">Tidak ada data ditemukan</p>
              </td>
            </tr>
            <tr
              v-else
              v-for="job in closingJobs"
              :key="job.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="openJobModal(job)"
            >
              <td class="py-3 px-4">
                <span class="text-sm font-medium">{{ job.jobNumber }}</span>
              </td>
              <td class="py-3 px-4 text-sm">{{ job.customer }}</td>
              <td class="py-3 px-4 text-sm text-green-600 font-medium">
                {{ formatCurrency(job.revenue) }}
              </td>
              <td class="py-3 px-4 text-sm text-red-600 font-medium">
                {{ formatCurrency(job.cogs) }}
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-[#012D5A]">{{
                    formatCurrency(job.profit)
                  }}</span>
                  <span class="text-[10px] text-muted-foreground italic"
                    >Margin: {{ job.margin }}%</span
                  >
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                >
                  <CheckCircle class="w-3 h-3" /> Closed
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="handleDownloadProfit(job)"
                    class="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-[#012D5A] transition-colors"
                    title="Download Profit Report"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                  <button class="text-muted-foreground hover:text-foreground">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else>
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="border border-border rounded-xl bg-white p-5 animate-pulse"
        >
          <div class="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div class="space-y-3">
            <div class="h-3 bg-muted rounded w-full"></div>
            <div class="h-3 bg-muted rounded w-full"></div>
          </div>
        </div>
      </div>
      <div
        v-else-if="closingJobs.length === 0"
        class="border border-border rounded-xl bg-white p-12 text-center"
      >
        <p class="text-sm text-muted-foreground font-medium">Tidak ada data ditemukan</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="job in closingJobs"
          :key="job.id"
          class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
          @click="openJobModal(job)"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-bold text-base text-foreground">{{ job.jobNumber }}</h3>
              <p class="text-xs text-muted-foreground">{{ job.customer }}</p>
            </div>
            <button class="text-muted-foreground hover:text-foreground" @click.stop>
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-4 mb-4">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Revenue</p>
                <p class="font-medium text-green-600">{{ formatCurrency(job.revenue) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">Cost</p>
                <p class="font-medium text-red-600">{{ formatCurrency(job.cogs) }}</p>
              </div>
            </div>
            <div class="pt-3 border-t border-border">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Profit</p>
                  <p class="text-[10px] text-muted-foreground italic">Margin: {{ job.margin }}%</p>
                </div>
                <p class="text-lg font-bold text-[#012D5A]">{{ formatCurrency(job.profit) }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
            >
              <CheckCircle class="w-3 h-3" /> Closed
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Detail Modal -->
    <!-- Job Details Slide-over -->
    <OperationalJobDetailSlideOver
      v-model="showJobModal"
      :job-id="selectedJob?.id || ''"
      initial-tab="finance"
    />

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ pagination.total }} data found.</p>
      <div class="flex items-center gap-2">
        <button
          @click="handlePageChange(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="p-1 hover:text-foreground disabled:opacity-50"
        >
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="handlePageChange(p)"
          :class="
            cn(
              'w-8 h-8 flex items-center justify-center rounded border transition-colors',
              pagination.page === p
                ? 'border-primary bg-primary text-white font-medium'
                : 'border-border bg-white text-foreground hover:bg-muted',
            )
          "
        >
          {{ p }}
        </button>
        <button
          @click="handlePageChange(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="flex items-center gap-1 hover:text-foreground disabled:opacity-50"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Hidden Preview for PDF generation -->
    <div v-if="activeJobForPdf" class="fixed -left-[9999px] top-0 overflow-hidden">
      <JobProfitPreview ref="profitPreviewRef" :job="activeJobForPdf" />
    </div>
  </div>
</template>
