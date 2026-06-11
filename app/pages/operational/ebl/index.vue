<script setup lang="ts">
import {
  Plus,
  Search,
  FileText,
  LayoutList,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ArrowRight,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { toast } from "vue-sonner";
import Combobox from "~/components/ui/Combobox.vue";

definePageMeta({
  layout: "dashboard",
});

interface EblItem {
  id: string;
  blNumber: string;
  jobId: string;
  job?: {
    id?: string;
    jobNumber: string;
    jobParties?: {
      partyRole: { code: string; name: string };
      company?: { id: string; name: string } | null;
    }[];
  };
  statusId: string | null;
  status?: {
    code: string | null;
    name: string | null;
  } | null;
  statusRaw: string | null;
  rejectReason: string | null;
  polName?: string | null;
  podName?: string | null;
  containerTypeId: string | null;
  containerType?: {
    code: string;
    name: string;
  } | null;
  grossWeight: string | null;
  measurement: string | null;
  createdAt: string;
}

const { ebls, fetchEbls, isLoading } = useEbls();

const { pending } = await useAsyncData("ebls-list", () => fetchEbls(), { server: false });

const { finalizeBl, rejectBl } = useJobs();
const { confirm } = useConfirm();
const { canApprove, requireAccess } = useFeatureAccess("operational.ebl");

// State for Approve/Reject actions
const showRejectModal = ref(false);
const rejectReasonForm = ref("");
const isRejecting = ref(false);
const rejectingBlId = ref<string | null>(null);
const approvingBlId = ref<string | null>(null);

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Unknown error";
};

const handleApprove = async (blId: string) => {
  if (!requireAccess("approve", "You need approve access for eBL.")) return;

  const isConfirmed = await confirm({
    title: "Approve Bill of Lading",
    message:
      "Are you sure you want to approve this BL? This action will finalize the BL and lock all details.",
    confirmText: "Approve BL",
    type: "warning",
  });

  if (isConfirmed) {
    approvingBlId.value = blId;
    try {
      const resp = await finalizeBl(blId);
      if (resp.success) {
        toast.success("eBL approved and finalized successfully!");
        await fetchEbls();
      } else {
        toast.error(resp.error || "Failed to approve eBL");
      }
    } catch (err: unknown) {
      toast.error("An error occurred: " + getErrorMessage(err));
    } finally {
      approvingBlId.value = null;
    }
  }
};

const openRejectModal = (blId: string) => {
  if (!requireAccess("approve", "You need approve access for eBL.")) return;

  rejectingBlId.value = blId;
  rejectReasonForm.value = "";
  showRejectModal.value = true;
};

const submitReject = async () => {
  if (!rejectingBlId.value || !rejectReasonForm.value.trim()) return;
  if (!requireAccess("approve", "You need approve access for eBL.")) return;

  isRejecting.value = true;
  try {
    const resp = await rejectBl(rejectingBlId.value, rejectReasonForm.value.trim());
    if (resp.success) {
      toast.success("eBL rejected and sent back to Draft.");
      showRejectModal.value = false;
      await fetchEbls();
    } else {
      toast.error(resp.error || "Failed to reject eBL");
    }
  } catch (err: unknown) {
    toast.error("An error occurred: " + getErrorMessage(err));
  } finally {
    isRejecting.value = false;
    rejectingBlId.value = null;
  }
};

// Helper functions for status (sync with JobEblList.vue)
const getStatusCode = (ebl: EblItem) => {
  const status = ebl.status;
  if (!status) return "";
  const code = status.code?.toLowerCase() || "";
  if (code === "confirmed" || code === "finalized") return "finalized";
  if (code === "pending_approval") return "pending_approval";
  return code;
};

const getStatusName = (ebl: EblItem) => {
  const status = ebl.status;
  if (!status) return "DRAFT";
  const name = status.name || status.code || "DRAFT";
  const upper = name.toUpperCase();
  if (upper === "CONFIRMED") return "FINALIZED";
  if (upper === "PENDING_APPROVAL") return "PENDING APPROVAL";
  return upper;
};

const getStatusInfo = (ebl: EblItem): { label: string; class: string } => {
  const code = getStatusCode(ebl);
  const isRejected = !!ebl.rejectReason;

  if (code === "finalized") {
    return {
      label: "FINALIZED",
      class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (code === "pending_approval") {
    return {
      label: "PENDING APPROVAL",
      class: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  if (code === "draft" && isRejected) {
    return {
      label: "REVISION REQUIRED",
      class: "bg-red-50 text-red-700 border-red-200",
    };
  }

  return {
    label: getStatusName(ebl),
    class: "bg-amber-50 text-amber-700 border-amber-200",
  };
};

const getShipperName = (ebl: EblItem) => {
  const shipper = ebl.job?.jobParties?.find((p) => p.partyRole.code === "SHIPPER");
  return shipper?.company?.name || "-";
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");
const searchQuery = ref("");
const statusFilter = ref("all");
const statusOptions = [
  { id: "all", name: "All Status" },
  { id: "draft", name: "Draft" },
  { id: "pending_approval", name: "Pending Approval" },
  { id: "finalized", name: "Finalized" },
  { id: "revision_required", name: "Revision Required" },
];

const selectedJobId = ref("");
const initialBlId = ref("");
const isDetailOpen = ref(false);

function openBlDetail(id: string) {
  const ebl = ebls.value.find((e) => e.id === id);
  if (ebl) {
    selectedJobId.value = ebl.jobId;
    initialBlId.value = id;
    isDetailOpen.value = true;
  }
}

const groupedEbls = computed(() => {
  const groups: Record<string, { jobId: string; jobNumber: string; ebls: EblItem[] }> = {};

  filteredEbls.value.forEach((ebl) => {
    const jobId = ebl.jobId;
    if (!groups[jobId]) {
      groups[jobId] = {
        jobId,
        jobNumber: ebl.job?.jobNumber || "Unknown Job",
        ebls: [],
      };
    }
    groups[jobId].ebls.push(ebl);
  });

  return Object.values(groups);
});

const filteredEbls = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return ebls.value.filter((ebl) => {
    const statusCode = getStatusCode(ebl);
    const normalizedStatus =
      statusCode === "draft" && ebl.rejectReason ? "revision_required" : statusCode || "draft";
    const matchesStatus = statusFilter.value === "all" || normalizedStatus === statusFilter.value;

    const matchesSearch =
      !query ||
      ebl.blNumber.toLowerCase().includes(query) ||
      (ebl.job?.jobNumber || "").toLowerCase().includes(query) ||
      getShipperName(ebl).toLowerCase().includes(query) ||
      (ebl.polName || "").toLowerCase().includes(query) ||
      (ebl.podName || "").toLowerCase().includes(query);

    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">eBL (Electronic Bill of Lading)</h1>
        <p class="text-muted-foreground mt-1">Kelola dan pantau dokumen eBL Anda secara terpusat</p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-white border border-border rounded-lg p-1 shadow-sm">
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

    <!-- Filters -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm"
    >
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan No. eBL atau Job..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <Combobox
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="All Status"
          class="min-w-[180px]"
        />
        <span class="text-xs text-muted-foreground font-medium uppercase tracking-wider"
          >Total: {{ filteredEbls.length }} eBL</span
        >
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div
        class="w-8 h-8 border-4 border-[#012D5A] border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-muted-foreground animate-pulse text-sm">Memuat data eBL...</p>
    </div>

    <!-- List View -->
    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-gray-50/50 text-left">
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-10"
              >
                No. eBL
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Shipper
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
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center"
              >
                Status
              </th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in groupedEbls" :key="group.jobId">
              <!-- Job Header Row -->
              <tr class="bg-gray-50/80 border-b border-border group">
                <td colspan="6" class="py-2.5 px-4">
                  <div class="flex items-center gap-2">
                    <div class="p-1 rounded bg-[#012D5A]/5 text-[#012D5A]">
                      <Briefcase class="w-3.5 h-3.5" />
                    </div>
                    <span
                      class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                      >Job:</span
                    >
                    <span class="text-sm font-bold text-[#012D5A]">{{ group.jobNumber }}</span>
                    <span
                      class="text-[10px] px-2 py-0.5 bg-[#012D5A]/10 text-[#012D5A] rounded-full font-bold ml-2 border border-[#012D5A]/20"
                    >
                      {{ group.ebls.length }} BL{{ group.ebls.length > 1 ? "S" : "" }}
                    </span>
                  </div>
                </td>
              </tr>
              <!-- BL Rows -->
              <tr
                v-for="ebl in group.ebls"
                :key="ebl.id"
                class="border-b border-border last:border-b-0 hover:bg-muted/30 transition-all cursor-pointer group/row"
                @click="openBlDetail(ebl.id)"
              >
                <td class="py-3.5 px-4 pl-10">
                  <div class="flex items-center gap-3">
                    <div
                      class="p-2 rounded-lg bg-blue-50 text-[#012D5A] group-hover/row:bg-[#012D5A] group-hover/row:text-white transition-colors shadow-sm"
                    >
                      <FileText class="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        class="text-sm font-bold text-foreground group-hover/row:text-[#012D5A] transition-colors"
                        >{{ ebl.blNumber }}</span
                      >
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="text-sm font-medium text-foreground">{{ getShipperName(ebl) }}</span>
                </td>
                <td class="py-3.5 px-4">
                  <div class="flex flex-col max-w-[200px]">
                    <div class="flex items-center gap-2 text-sm">
                      <span
                        class="text-foreground truncate font-medium"
                        :title="ebl.polName || ''"
                        >{{ ebl.polName || "-" }}</span
                      >
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight class="w-3 h-3" />
                      <span class="truncate" :title="ebl.podName || ''">{{
                        ebl.podName || "-"
                      }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="text-xs text-muted-foreground font-medium">{{
                    formatDate(ebl.createdAt)
                  }}</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span
                    :class="
                      cn(
                        'px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider',
                        getStatusInfo(ebl).class,
                      )
                    "
                  >
                    {{ getStatusInfo(ebl).label }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right" @click.stop>
                  <div class="flex items-center justify-end gap-2 relative">
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
                          @click="openBlDetail(ebl.id)"
                        >
                          <Eye class="w-4 h-4 text-muted-foreground" />
                          View Details
                        </button>
                        <button
                          v-if="canApprove && getStatusCode(ebl) === 'pending_approval'"
                          class="w-full px-4 py-2 text-left text-sm hover:bg-muted text-emerald-600 flex items-center gap-2"
                          @click="handleApprove(ebl.id)"
                          :disabled="approvingBlId === ebl.id || isRejecting"
                        >
                          <Loader2 v-if="approvingBlId === ebl.id" class="w-4 h-4 animate-spin" />
                          <CheckCircle2 v-else class="w-4 h-4" />
                          {{ approvingBlId === ebl.id ? "Approving..." : "Approve" }}
                        </button>
                        <button
                          v-if="canApprove && getStatusCode(ebl) === 'pending_approval'"
                          class="w-full px-4 py-2 text-left text-sm hover:bg-muted text-red-600 flex items-center gap-2"
                          @click="openRejectModal(ebl.id)"
                          :disabled="approvingBlId === ebl.id || isRejecting"
                        >
                          <XCircle class="w-4 h-4" />
                          Reject
                        </button>
                      </template>
                    </UiActionMenu>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredEbls.length === 0">
              <td colspan="6" class="p-20 text-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <FileText class="w-10 h-10 opacity-20 mb-2" />
                  <p class="font-medium">Belum ada data eBL.</p>
                  <p class="text-xs opacity-70">
                    eBL akan muncul di sini setelah Anda membuat job baru.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ebl in filteredEbls"
        :key="ebl.id"
        class="group border border-border rounded-2xl bg-white p-6 hover:shadow-xl hover:border-[#012D5A]/20 transition-all cursor-pointer relative overflow-hidden"
        @click="openBlDetail(ebl.id)"
      >
        <!-- Card Accent -->
        <div
          class="absolute top-0 left-0 w-1 h-full bg-[#012D5A] opacity-0 group-hover:opacity-100 transition-opacity"
        ></div>

        <div class="flex items-start justify-between mb-6">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#012D5A] group-hover:text-white transition-all duration-300"
            >
              <FileText class="w-6 h-6" />
            </div>
            <div>
              <h3
                class="font-bold text-lg text-foreground group-hover:text-[#012D5A] transition-colors"
              >
                {{ ebl.blNumber }}
              </h3>
              <div class="flex items-center gap-1.5 mt-0.5">
                <Briefcase class="w-3 h-3 text-muted-foreground" />
                <p class="text-xs font-bold text-muted-foreground">
                  {{ ebl.job?.jobNumber || "-" }}
                </p>
              </div>
            </div>
          </div>
          <UiActionMenu>
            <template #trigger>
              <button
                class="p-2 hover:bg-gray-100 rounded-full text-muted-foreground transition-colors"
                @click.stop
              >
                <MoreVertical class="w-4 h-4" />
              </button>
            </template>
            <template #content>
              <button
                class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                @click="openBlDetail(ebl.id)"
              >
                <Eye class="w-4 h-4 text-muted-foreground" />
                View Details
              </button>
              <button
                v-if="canApprove && getStatusCode(ebl) === 'pending_approval'"
                class="w-full px-4 py-2 text-left text-sm hover:bg-muted text-emerald-600 flex items-center gap-2"
                @click="handleApprove(ebl.id)"
                :disabled="approvingBlId === ebl.id || isRejecting"
              >
                <Loader2 v-if="approvingBlId === ebl.id" class="w-4 h-4 animate-spin" />
                <CheckCircle2 v-else class="w-4 h-4" />
                {{ approvingBlId === ebl.id ? "Approving..." : "Approve" }}
              </button>
              <button
                v-if="canApprove && getStatusCode(ebl) === 'pending_approval'"
                class="w-full px-4 py-2 text-left text-sm hover:bg-muted text-red-600 flex items-center gap-2"
                @click="openRejectModal(ebl.id)"
                :disabled="approvingBlId === ebl.id || isRejecting"
              >
                <XCircle class="w-4 h-4" />
                Reject
              </button>
            </template>
          </UiActionMenu>
        </div>

        <div class="space-y-4 mb-6">
          <div class="p-3 bg-gray-50 rounded-xl space-y-1.5 border border-gray-100">
            <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Shipper
            </p>
            <p class="text-sm font-semibold text-foreground truncate">{{ getShipperName(ebl) }}</p>
          </div>

          <div class="space-y-1 pt-1">
            <div class="flex items-center gap-2 text-sm">
              <MapPin class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span class="font-bold text-[#012D5A] truncate">{{ ebl.polName || "-" }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs pl-5 text-muted-foreground">
              <ArrowRight class="w-3 h-3 shrink-0" />
              <span class="truncate">{{ ebl.podName || "-" }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-5 border-t border-border mt-auto">
          <p class="text-[10px] text-muted-foreground font-medium">
            {{ formatDate(ebl.createdAt) }}
          </p>
          <span
            :class="
              cn(
                'px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider shadow-sm',
                getStatusInfo(ebl).class,
              )
            "
          >
            {{ getStatusInfo(ebl).label }}
          </span>
        </div>
      </div>
      <div v-if="ebls.length === 0" class="col-span-full py-20 text-center text-muted-foreground">
        Belum ada data eBL.
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="ebls.length > 0"
      class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-sm text-muted-foreground border-t border-border"
    >
      <p class="font-medium">
        Menampilkan <span class="text-foreground font-bold">{{ ebls.length }}</span> data eBL.
      </p>
      <div class="flex items-center gap-2">
        <button
          class="p-2 hover:bg-muted rounded-lg hover:text-foreground disabled:opacity-30 transition-all"
          disabled
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-[#012D5A] text-white font-bold shadow-sm"
        >
          1
        </button>
        <span class="px-2 opacity-30 font-bold">...</span>
        <button
          class="flex items-center gap-2 py-2 px-4 hover:bg-muted rounded-lg hover:text-foreground transition-all font-bold"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Rejection Modal -->
    <UiModal v-model="showRejectModal" width="max-w-lg">
      <div class="p-4">
        <div class="flex flex-col items-center text-center gap-4 py-4">
          <div
            class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"
          >
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div class="space-y-2 w-full">
            <h3 class="text-lg font-semibold">Reject Bill of Lading</h3>
            <p class="text-sm text-muted-foreground w-full mb-6">
              Please provide a reason for rejecting this BL. It will be reverted to Draft for
              revision.
            </p>
            <div class="text-left w-full pt-2">
              <label
                class="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5"
              >
                Rejection Reason <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="rejectReasonForm"
                class="input-field min-h-[120px] py-3 resize-y transition-all duration-200"
                placeholder="E.g., Cargo description is incomplete"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-4">
          <button
            type="button"
            class="btn-secondary flex-1 justify-center"
            @click="showRejectModal = false"
            :disabled="isRejecting"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn-primary flex-1 justify-center bg-red-600 hover:bg-red-700 border-red-600 disabled:opacity-50"
            @click="submitReject"
            :disabled="!rejectReasonForm.trim() || isRejecting"
          >
            <Loader2 v-if="isRejecting" class="w-4 h-4 animate-spin mr-2" />
            {{ isRejecting ? "Rejecting..." : "Confirm Reject" }}
          </button>
        </div>
      </div>
    </UiModal>

    <!-- Job Details Slide-over showing eBL tab -->
    <OperationalJobDetailSlideOver
      v-model="isDetailOpen"
      :job-id="selectedJobId"
      initial-tab="ebl"
      :initial-bl-id="initialBlId"
    />
  </div>
</template>
