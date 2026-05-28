<script setup lang="ts">
import {
  Plus,
  Search,
  FileText,
  Calendar,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowRight,
  CheckCircle,
  FileClock,
  Clock,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { useQuotations, type Quotation } from "~/composables/useQuotations";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
  title: "Quotation & Pricing",
  hideHeader: true,
});

const { quotations, isLoading, fetchQuotations, deleteQuotation } = useQuotations();
const { confirm } = useConfirm();
const router = useRouter();
const { canManage, requireManage } = useFeatureAccess("operational.quotation");

const page = ref(1);
const limit = ref(10);
const search = ref("");
const statusFilter = ref("ALL");
const totalItems = ref(0);
const totalPages = ref(0);

const apiStats = ref({
  total: 0,
  draft: 0,
  sent: 0,
  confirmed: 0,
  converted: 0,
  cancelled: 0,
  expired: 0,
});

// Load data
async function loadData() {
  const params = {
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    status: statusFilter.value !== "ALL" ? statusFilter.value : undefined,
  };

  const res = await fetchQuotations(params);
  if (res.success && res.data) {
    totalItems.value = res.data.total;
    totalPages.value = res.data.totalPages;
    if (res.data.stats) {
      apiStats.value = res.data.stats;
    }
  } else if (res.error) {
    toast.error("Failed to load quotations: " + res.error);
  }
}

// Watchers for reactive pagination & filters
watch([page, statusFilter], () => {
  loadData();
});

let debounceTimeout: number;
watch(search, () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = window.setTimeout(() => {
    page.value = 1;
    loadData();
  }, 300);
});

onMounted(() => {
  loadData();
});

// KPI Summary based on sales funnel status matching finance/dashboard.vue style
const stats = computed(() => {
  return {
    totalQuotes: apiStats.value.total,
    draftCount: apiStats.value.draft,
    sentCount: apiStats.value.sent,
    confirmedCount: apiStats.value.confirmed + apiStats.value.converted,
  };
});

// Format helpers
function formatCurrency(amount: number, currency: string = "IDR") {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

// Status Badges Styling
const getStatusClass = (status: string) => {
  const s = status.toUpperCase();
  if (s === "CONVERTED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "CONFIRMED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "DRAFT") return "bg-gray-100 text-gray-700 border-gray-300";
  if (s === "SENT") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "EXPIRED") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
};

// Actions
async function handleDelete(q: Quotation) {
  if (!requireManage("You only have view access for quotations.")) return;

  const yes = await confirm({
    title: "Delete Quotation",
    message: `Apakah Anda yakin ingin menghapus quotation ${q.number}?`,
    confirmText: "Hapus",
    cancelText: "Batal",
  });

  if (yes) {
    const res = await deleteQuotation(q.id);
    if (res.success) {
      toast.success("Quotation berhasil dihapus.");
      loadData();
    } else {
      toast.error(res.error || "Gagal menghapus quotation.");
    }
  }
}

import QuotationDetailSlideOver from "~/components/operational/QuotationDetailSlideOver.vue";

const isDetailOpen = ref(false);
const selectedQuotationId = ref<string | null>(null);

function openDetail(id: string) {
  selectedQuotationId.value = id;
  isDetailOpen.value = true;
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Sticky Header -->
    <div class="shrink-0 bg-white border-b border-border">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
        <div>
          <h1 class="text-2xl font-bold">Quotation & Pricing</h1>
          <p class="text-muted-foreground text-sm font-medium">
            Manage quotation pricing, sales proposals, and customer approvals
          </p>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="canManage"
            to="/operational/quotations/create"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#062c58] hover:bg-[#062c58]/90 text-white rounded-lg transition-all shadow-sm active:scale-95"
          >
            <Plus class="w-4 h-4" />
            <span>Create Quotation</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="px-6">
        <nav class="flex gap-1 overflow-x-auto -mb-px">
          <button
            v-for="s in ['ALL', 'DRAFT', 'SENT', 'CONFIRMED', 'CONVERTED', 'CANCELLED', 'EXPIRED']"
            :key="s"
            :class="
              cn(
                'px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors uppercase tracking-wider',
                statusFilter === s
                  ? 'border-[#062c58] text-[#062c58]'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-gray-300',
              )
            "
            @click="
              statusFilter = s;
              page = 1;
            "
          >
            {{ s }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto relative pt-6 pb-10 space-y-6 bg-slate-50/50">
      <ClientOnly>
        <!-- Loading Overlay -->
        <div
          v-show="isLoading"
          class="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 border-2 border-[#062c58] border-t-transparent rounded-full animate-spin"
            ></div>
            <span class="text-sm font-medium text-muted-foreground">Loading...</span>
          </div>
        </div>

        <!-- KPI Summary Row matching finance/dashboard.vue font weights -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
          <div
            class="bg-white border border-border p-4 rounded-xl flex items-center justify-between shadow-sm"
          >
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Total Sales Proposals
              </p>
              <p class="text-2xl font-bold text-[#062c58]">{{ stats.totalQuotes }}</p>
            </div>
            <div class="p-3 bg-blue-50 text-[#062c58] rounded-lg">
              <FileText class="w-5 h-5" />
            </div>
          </div>

          <div
            class="bg-white border border-border p-4 rounded-xl flex items-center justify-between shadow-sm"
          >
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Draft Quotations
              </p>
              <p class="text-2xl font-bold text-gray-700">{{ stats.draftCount }}</p>
            </div>
            <div class="p-3 bg-gray-50 text-gray-600 rounded-lg">
              <Clock class="w-5 h-5" />
            </div>
          </div>

          <div
            class="bg-white border border-border p-4 rounded-xl flex items-center justify-between shadow-sm"
          >
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Sent to Clients
              </p>
              <p class="text-2xl font-bold text-amber-600">{{ stats.sentCount }}</p>
            </div>
            <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <FileClock class="w-5 h-5" />
            </div>
          </div>

          <div
            class="bg-white border border-border p-4 rounded-xl flex items-center justify-between shadow-sm"
          >
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Approved (Confirmed)
              </p>
              <p class="text-2xl font-bold text-emerald-600">{{ stats.confirmedCount }}</p>
            </div>
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Table List Container -->
        <div class="px-6">
          <div class="border border-border rounded-xl bg-white overflow-hidden shadow-sm">
            <!-- Table Header Row -->
            <div
              class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-border bg-white"
            >
              <h2 class="text-lg font-bold text-[#062c58]">Quotations list</h2>
              <div class="flex flex-wrap items-center gap-2">
                <!-- Search Input -->
                <div class="relative flex items-center">
                  <input
                    v-model="search"
                    type="text"
                    placeholder="Search quotation or customer..."
                    class="w-64 px-3 py-2 pl-9 text-xs font-semibold border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#062c58] placeholder:text-muted-foreground"
                  />
                  <Search
                    class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <!-- Table Block -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border bg-white text-left">
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      No. Quotation
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      Customer
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      Route
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      Date
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      Valid Until
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right"
                    >
                      Grand Total
                    </th>
                    <th
                      class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center"
                    >
                      Status
                    </th>
                    <th class="py-3 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!quotations.length && !isLoading">
                    <td
                      colspan="8"
                      class="py-12 text-center text-xs font-medium text-muted-foreground"
                    >
                      Belum ada data quotation yang sesuai filter.
                    </td>
                  </tr>
                  <tr
                    v-for="q in quotations"
                    :key="q.id"
                    class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    @click="openDetail(q.id)"
                  >
                    <!-- No. Quotation -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                          <FileText class="w-4 h-4" />
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-semibold text-[#012D5A]">{{ q.number }}</span>
                          <span
                            class="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter"
                            >{{ q.currency || "IDR" }}</span
                          >
                        </div>
                      </div>
                    </td>

                    <!-- Customer -->
                    <td class="py-3 px-4">
                      <div
                        class="text-sm text-foreground max-w-[200px] truncate"
                        :title="q.customerName || ''"
                      >
                        {{ q.customerName || "-" }}
                      </div>
                      <div class="text-[10px] text-muted-foreground" v-if="q.picName">
                        {{ q.picName }}
                      </div>
                    </td>

                    <!-- Route -->
                    <td class="py-3 px-4">
                      <div class="flex flex-col max-w-[200px]" v-if="q.pol || q.pod">
                        <div class="flex items-center gap-2 text-sm">
                          <span
                            class="text-foreground truncate font-medium"
                            :title="q.polName || q.pol || undefined"
                          >
                            {{ q.polName || q.pol || "-" }}
                          </span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                          <ArrowRight class="w-3 h-3" />
                          <span class="truncate" :title="q.podName || q.pod || undefined">{{
                            q.podName || q.pod || "-"
                          }}</span>
                        </div>
                      </div>
                      <span v-else class="text-xs text-muted-foreground italic">-</span>
                    </td>

                    <!-- Date -->
                    <td class="py-3 px-4">
                      <div
                        class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/50 border border-blue-100 text-[#1d4ed8] text-[11px] font-semibold w-fit"
                      >
                        <Calendar class="w-3 h-3 opacity-70" />
                        {{ formatDate(q.date) }}
                      </div>
                    </td>

                    <!-- Valid Until -->
                    <td class="py-3 px-4">
                      <div
                        class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50/50 border border-orange-100 text-[#c2410c] text-[11px] font-semibold w-fit"
                      >
                        <Calendar class="w-3 h-3 opacity-70" />
                        {{ formatDate(q.validUntil) }}
                      </div>
                    </td>

                    <!-- Grand Total -->
                    <td class="py-3 px-4 text-sm font-bold text-right text-[#062c58]">
                      <div>{{ formatCurrency(q.total || 0, q.currency) }}</div>
                      <div
                        v-if="q.currency && q.currency !== 'IDR'"
                        class="text-[10.5px] text-muted-foreground font-semibold mt-0.5 whitespace-nowrap"
                      >
                        {{ formatCurrency((q.total || 0) * (q.exchangeRate || 1), "IDR") }}
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="py-3 px-4">
                      <div class="flex justify-center">
                        <span
                          :class="
                            cn(
                              'px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                              getStatusClass(q.status),
                            )
                          "
                        >
                          {{ q.status }}
                        </span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-right" @click.stop>
                      <div class="flex items-center justify-end gap-2 relative">
                        <button
                          class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors"
                          @click.stop="openDetail(q.id)"
                          title="View Details"
                        >
                          <Eye class="w-4 h-4" />
                        </button>
                        <UiActionMenu>
                          <template #trigger>
                            <button
                              class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                            >
                              <MoreVertical class="w-4 h-4" />
                            </button>
                          </template>
                          <template #content>
                            <button
                              class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                              @click="openDetail(q.id)"
                            >
                              <Eye class="w-4 h-4" />
                              View Details
                            </button>
                            <NuxtLink
                              v-if="canManage"
                              :to="`/operational/quotations/${q.id}/edit`"
                              class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                            >
                              <Edit class="w-4 h-4" />
                              Edit
                            </NuxtLink>
                            <button
                              v-if="canManage"
                              class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 text-rose-600"
                              @click="handleDelete(q)"
                            >
                              <Trash2 class="w-4 h-4 text-rose-600" />
                              Hapus
                            </button>
                          </template>
                        </UiActionMenu>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Footer Pagination -->
            <div class="flex items-center justify-between p-4 border-t border-border bg-white">
              <p class="text-xs font-medium text-muted-foreground">
                <template v-if="totalItems > 0"
                  >Showing {{ (page - 1) * limit + 1 }} to
                  {{ Math.min(page * limit, totalItems) }}
                  of {{ totalItems }} results</template
                >
                <template v-else>No results found</template>
              </p>
              <UiPagination
                v-model:page="page"
                :total="totalItems"
                :items-per-page="limit"
                @update:page="loadData"
              />
            </div>
          </div>
        </div>
      </ClientOnly>

      <!-- Premium Quotation Detail SlideOver -->
      <QuotationDetailSlideOver
        v-model="isDetailOpen"
        :quotation-id="selectedQuotationId"
        @converted="loadData"
        @status-updated="loadData"
      />
    </div>
  </div>
</template>
