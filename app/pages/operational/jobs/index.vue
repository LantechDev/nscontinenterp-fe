<script setup lang="ts">
import {
  Plus,
  Search,
  Ship,
  Plane,
  Eye,
  Calendar,
  MapPin,
  LayoutList,
  LayoutGrid,
  ArrowRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  PowerOff,
  Briefcase,
  CheckCircle2,
  Truck,
} from "lucide-vue-next";
import { cn, formatDate } from "~/lib/utils";
import { toast } from "vue-sonner";
import { useConfirm } from "~/composables/useConfirm";
import Combobox from "~/components/ui/Combobox.vue";
import DashboardStatCard from "~/components/dashboard/StatCard.vue";

definePageMeta({
  layout: "dashboard",
});

const { jobs, fetchJobs, isLoading, updateJob } = useJobs();
const route = useRoute();
const router = useRouter();
const { confirm } = useConfirm();

const { pending } = await useAsyncData("jobs-list", () => fetchJobs(), { server: false });

onUnmounted(() => {});

const searchQuery = ref("");
type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

const filteredJobs = computed(() => {
  return jobs.value.filter((job) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.commodity.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      !statusFilter.value || job.status?.code?.toUpperCase() === statusFilter.value.toUpperCase();

    const matchesShipment = (() => {
      if (!shipmentTypeFilter.value) return true;
      if (shipmentTypeFilter.value === "TRUCKING") {
        return job.serviceType === "TRUCKING";
      }
      if (shipmentTypeFilter.value === "AIR") {
        return job.serviceType === "AIR" || job.shipmentType === "AIR";
      }
      if (shipmentTypeFilter.value === "OCEAN") {
        return (
          job.serviceType === "OCEAN" ||
          (job.serviceType !== "TRUCKING" &&
            job.serviceType !== "AIR" &&
            job.shipmentType === "OCEAN")
        );
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesShipment;
  });
});

// Helper for status badge class
const getStatusClass = (statusCode: string | null | undefined) => {
  const code = (statusCode || "").toUpperCase();
  if (code === "COMPLETED" || code === "CLOSED" || code === "DONE")
    return "bg-green-50 text-green-700 border-green-200";
  if (code === "DRAFT") return "bg-gray-100 text-gray-600 border-gray-200";
  if (code === "CANCELLED" || code === "VOID") return "bg-red-50 text-red-700 border-red-200";
  if (code === "PENDING" || code === "IN_PROGRESS")
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const selectedJobId = ref("");
const isDetailOpen = ref(false);
const initialTab = ref<string | undefined>(undefined);
const initialBlId = ref<string | undefined>(undefined);

// Filters
const statusFilter = ref<string>("");
const shipmentTypeFilter = ref<string>(""); // "", "AIR", "OCEAN"

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "CLOSED", label: "Closed" },
];

const shipmentTypeOptions = [
  { value: "", label: "Semua Tipe" },
  { value: "OCEAN", label: "OCEAN (Vessel)" },
  { value: "AIR", label: "AIR (Plane)" },
  { value: "TRUCKING", label: "TRUCKING (Truck)" },
];

// Stats for header (consistent with other master pages)
const stats = computed(() => {
  const list = jobs.value;
  const total = list.length;

  const active = list.filter((j) => {
    const code = (typeof j.status === "string" ? j.status : j.status?.code || "").toUpperCase();
    return !["CANCELLED", "VOID", "COMPLETED", "CLOSED", "DONE"].includes(code);
  }).length;

  const air = list.filter((j) => j.serviceType === "AIR" || j.shipmentType === "AIR").length;
  const trucking = list.filter((j) => j.serviceType === "TRUCKING").length;
  const ocean = list.filter(
    (j) =>
      j.serviceType === "OCEAN" ||
      (j.serviceType !== "TRUCKING" && j.serviceType !== "AIR" && j.shipmentType === "OCEAN"),
  ).length;

  return { total, active, air, ocean, trucking };
});

function openJobDetail(id: string, tab?: string, blId?: string) {
  selectedJobId.value = id;
  initialTab.value = tab;
  initialBlId.value = blId;
  isDetailOpen.value = true;
}

function copyJob(jobId: string) {
  // Navigate to create page with copyFrom query so it can prefill data
  router.push(`/operational/jobs/create?copyFrom=${jobId}`);
}

async function deactivateJob(jobInput: unknown) {
  // TODO: replace with proper Job type from composable
  const job = jobInput as {
    id: string;
    jobNumber: string;
    status?: string | { code?: string } | null;
  };
  const status = (
    typeof job.status === "string" ? job.status : job.status?.code || ""
  ).toUpperCase();
  if (["CANCELLED", "VOID", "COMPLETED", "CLOSED", "DONE"].includes(status)) {
    toast.error("Job sudah tidak aktif");
    return;
  }

  const confirmed = await confirm({
    title: "Nonaktifkan Job",
    message: `Apakah Anda yakin ingin menonaktifkan job ${job.jobNumber}?`,
    confirmText: "Nonaktifkan",
    type: "warning",
  });
  if (!confirmed) return;

  const res = await updateJob(job.id, { status: "CANCELLED" });
  if (res.success) {
    toast.success("Job berhasil dinonaktifkan");
    await fetchJobs();
  } else {
    toast.error(res.error || "Gagal menonaktifkan job");
  }
}

watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      setTimeout(() => {
        openJobDetail(
          newId as string,
          route.query.tab as string | undefined,
          route.query.blId as string | undefined,
        );
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", route.path);
        }
      }, 50);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10 p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Job / Shipment</h1>
        <p class="text-muted-foreground mt-1">Manage job and shipment</p>
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

    <!-- Stats Cards (same style as Dashboard) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <DashboardStatCard title="Total Jobs" :value="String(stats.total)" :icon="Briefcase" />
      <DashboardStatCard title="Ongoing Jobs" :value="String(stats.active)" :icon="CheckCircle2" />
      <DashboardStatCard title="OCEAN (Vessel)" :value="String(stats.ocean)" :icon="Ship" />
      <DashboardStatCard title="AIR (Plane)" :value="String(stats.air)" :icon="Plane" />
      <DashboardStatCard title="TRUCKING (Truck)" :value="String(stats.trucking)" :icon="Truck" />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <!-- Search -->
        <div class="relative flex-1 max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari job..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        <!-- Filters (stay together, no wrap) -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- Status Filter -->
          <div class="w-44">
            <Combobox
              v-model="statusFilter"
              :options="statusOptions"
              label-key="label"
              value-key="value"
              placeholder="Semua Status"
            />
          </div>

          <!-- Shipment Type Filter -->
          <div class="w-44">
            <Combobox
              v-model="shipmentTypeFilter"
              :options="shipmentTypeOptions"
              label-key="label"
              value-key="value"
              placeholder="Semua Tipe"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/operational/jobs/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Open New Job</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-8 text-center text-muted-foreground">Loading jobs...</div>

    <!-- List View -->
    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                No. Job
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Customer
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Shipper References
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Route
              </th>
              <th
                class="py-3 px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest"
              >
                Schedule
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
            <tr
              v-for="job in filteredJobs"
              :key="job.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="openJobDetail(job.id)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                    <Truck v-if="job.serviceType === 'TRUCKING'" class="w-4 h-4" />
                    <Plane
                      v-else-if="job.shipmentType === 'AIR' || job.serviceType === 'AIR'"
                      class="w-4 h-4"
                    />
                    <Ship v-else class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-[#012D5A]">{{ job.jobNumber }}</span>
                    <span
                      class="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter"
                      >{{ job.serviceType }}</span
                    >
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div
                  class="text-sm text-foreground max-w-[200px] truncate"
                  :title="job.customer?.name || 'No Customer'"
                >
                  {{ job.customer?.name || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-wrap gap-1 max-w-[200px]">
                  <template v-if="job.shipperReferences && job.shipperReferences.length > 0">
                    <span
                      v-for="(ref, idx) in job.shipperReferences.slice(0, 2)"
                      :key="idx"
                      class="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground border border-border"
                    >
                      {{ ref }}
                    </span>
                    <span
                      v-if="job.shipperReferences.length > 2"
                      class="text-[10px] text-muted-foreground"
                    >
                      +{{ job.shipperReferences.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-xs text-muted-foreground italic">-</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col max-w-[200px]">
                  <div class="flex items-center gap-2 text-sm">
                    <span
                      class="text-foreground truncate font-medium"
                      :title="
                        job.serviceType === 'TRUCKING'
                          ? job.pickupAddress || undefined
                          : job.polName || undefined
                      "
                    >
                      {{
                        job.serviceType === "TRUCKING"
                          ? job.pickupAddress || "-"
                          : job.polName || job.pol || "-"
                      }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight class="w-3 h-3" />
                    <span
                      class="truncate"
                      :title="
                        job.serviceType === 'TRUCKING'
                          ? job.deliveryAddress || undefined
                          : job.podName || undefined
                      "
                    >
                      {{
                        job.serviceType === "TRUCKING"
                          ? job.deliveryAddress || "-"
                          : job.podName || job.pod || "-"
                      }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col gap-1">
                  <template v-if="job.serviceType === 'TRUCKING'">
                    <div
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50/50 border border-amber-100 text-amber-700 text-[11px] font-semibold w-fit"
                    >
                      <Calendar class="w-3 h-3 opacity-70" />
                      <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]"
                        >PKP</span
                      >
                      {{ formatDate(job.pickupDate) }}
                    </div>
                    <div
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold w-fit"
                    >
                      <Calendar class="w-3 h-3 opacity-70" />
                      <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]"
                        >DEL</span
                      >
                      {{ formatDate(job.deliveryDate) }}
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-if="job.tradeType?.code === 'EXPORT'"
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50/50 border border-orange-100 text-[#c2410c] text-[11px] font-semibold w-fit"
                    >
                      <Calendar class="w-3 h-3 opacity-70" />
                      <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]"
                        >ETD</span
                      >
                      {{ formatDate(job.etd) }}
                    </div>
                    <div
                      v-else
                      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/50 border border-blue-100 text-[#1d4ed8] text-[11px] font-semibold w-fit"
                    >
                      <Calendar class="w-3 h-3 opacity-70" />
                      <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]"
                        >ETA</span
                      >
                      {{ formatDate(job.eta) }}
                    </div>
                  </template>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col gap-1 items-center">
                  <span
                    :class="
                      cn(
                        'px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider',
                        getStatusClass(job.status?.code),
                      )
                    "
                  >
                    {{ job.status?.name || "Active" }}
                  </span>
                  <span
                    v-if="
                      job.billsOfLading?.some(
                        (bl) =>
                          (typeof bl.status === 'object' ? bl.status?.code : null) ===
                          'PENDING_APPROVAL',
                      )
                    "
                    class="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap"
                  >
                    <div class="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                    PENDING BL APPROVAL
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2 relative">
                  <button
                    class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors"
                    @click.stop="openJobDetail(job.id)"
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
                        @click="openJobDetail(job.id)"
                      >
                        <Eye class="w-4 h-4" />
                        View Details
                      </button>
                      <NuxtLink
                        :to="`/operational/jobs/${job.id}/edit`"
                        class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                      >
                        <Edit class="w-4 h-4" />
                        Edit
                      </NuxtLink>
                      <button
                        class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                        @click="copyJob(job.id)"
                      >
                        <Copy class="w-4 h-4" />
                        Copy Job
                      </button>
                      <button
                        v-if="
                          !['CANCELLED', 'VOID', 'COMPLETED', 'CLOSED', 'DONE'].includes(
                            (typeof job.status === 'string'
                              ? job.status
                              : job.status?.code || ''
                            ).toUpperCase(),
                          )
                        "
                        class="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        @click="deactivateJob(job)"
                      >
                        <PowerOff class="w-4 h-4" />
                        Nonaktifkan Job
                      </button>
                    </template>
                  </UiActionMenu>
                </div>
              </td>
            </tr>
            <tr v-if="filteredJobs.length === 0">
              <td colspan="6" class="p-8 text-center text-muted-foreground">Belum ada data job.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="openJobDetail(job.id)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
            >
              <Truck v-if="job.serviceType === 'TRUCKING'" class="w-6 h-6" />
              <Plane
                v-else-if="job.shipmentType === 'AIR' || job.serviceType === 'AIR'"
                class="w-6 h-6"
              />
              <Ship v-else class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ job.jobNumber }}</h3>
              <p
                class="text-xs text-muted-foreground max-w-[200px] truncate"
                :title="job.commodity"
              >
                {{ job.commodity }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1 relative">
            <button
              class="p-1.5 text-muted-foreground hover:text-[#012D5A] hover:bg-blue-50 rounded transition-colors"
              @click.stop="openJobDetail(job.id)"
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
                  @click="openJobDetail(job.id)"
                >
                  <Eye class="w-4 h-4" />
                  View Details
                </button>
                <NuxtLink
                  :to="`/operational/jobs/${job.id}/edit`"
                  class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <Edit class="w-4 h-4" />
                  Edit
                </NuxtLink>
                <button
                  class="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                  @click="copyJob(job.id)"
                >
                  <Copy class="w-4 h-4" />
                  Copy Job
                </button>
                <button
                  v-if="
                    !['CANCELLED', 'VOID', 'COMPLETED', 'CLOSED', 'DONE'].includes(
                      (typeof job.status === 'string'
                        ? job.status
                        : job.status?.code || ''
                      ).toUpperCase(),
                    )
                  "
                  class="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  @click="deactivateJob(job)"
                >
                  <PowerOff class="w-4 h-4" />
                  Nonaktifkan Job
                </button>
              </template>
            </UiActionMenu>
          </div>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground text-xs uppercase font-bold tracking-tighter"
              >Customer:</span
            >
            <span class="font-semibold truncate">{{ job.customer?.name || "-" }}</span>
          </div>
          <div class="space-y-1 pt-1">
            <div class="flex items-center gap-2 text-sm">
              <MapPin class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span
                class="font-bold text-[#012D5A] truncate"
                :title="
                  job.serviceType === 'TRUCKING'
                    ? job.pickupAddress || undefined
                    : job.polName || undefined
                "
              >
                {{
                  job.serviceType === "TRUCKING"
                    ? job.pickupAddress || "-"
                    : job.polName || job.pol || "-"
                }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs pl-5 text-muted-foreground">
              <ArrowRight class="w-3 h-3 shrink-0" />
              <span
                class="truncate"
                :title="
                  job.serviceType === 'TRUCKING'
                    ? job.deliveryAddress || undefined
                    : job.podName || undefined
                "
              >
                {{
                  job.serviceType === "TRUCKING"
                    ? job.deliveryAddress || "-"
                    : job.podName || job.pod || "-"
                }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm pt-1">
            <Calendar class="w-4 h-4 text-muted-foreground opacity-50" />
            <template v-if="job.serviceType === 'TRUCKING'">
              <div
                class="px-2 py-0.5 rounded bg-amber-50/80 border border-amber-100 text-amber-700 text-[10px] font-bold"
              >
                PKP: {{ formatDate(job.pickupDate) }}
              </div>
              <div
                class="px-2 py-0.5 rounded bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-[10px] font-bold"
              >
                DEL: {{ formatDate(job.deliveryDate) }}
              </div>
            </template>
            <template v-else>
              <div
                v-if="job.tradeType?.code === 'EXPORT'"
                class="px-2 py-0.5 rounded bg-orange-50/80 border border-orange-100 text-[#c2410c] text-[10px] font-bold"
              >
                ETD: {{ formatDate(job.etd) }}
              </div>
              <div
                v-else
                class="px-2 py-0.5 rounded bg-blue-50/80 border border-blue-100 text-[#1d4ed8] text-[10px] font-bold"
              >
                ETA: {{ formatDate(job.eta) }}
              </div>
            </template>
          </div>
          <div
            v-if="job.shipperReferences && job.shipperReferences.length > 0"
            class="flex flex-wrap gap-1 mt-1"
          >
            <span
              v-for="(ref, idx) in job.shipperReferences.slice(0, 3)"
              :key="idx"
              class="px-1.5 py-0.5 rounded bg-muted text-[9px] font-bold text-muted-foreground border border-border"
            >
              {{ ref }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span
            :class="
              cn('px-2 py-0.5 rounded border text-xs font-bold', getStatusClass(job.status?.code))
            "
          >
            {{ job.status?.name || "Active" }}
          </span>
          <span
            v-if="
              job.billsOfLading?.some(
                (bl) =>
                  (typeof bl.status === 'object' ? bl.status?.code : null) === 'PENDING_APPROVAL',
              )
            "
            class="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            PENDING BL APPROVAL
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <p>{{ filteredJobs.length }} data found.</p>
      <div class="flex items-center gap-2">
        <button class="p-1 hover:text-foreground disabled:opacity-50">
          <ChevronLeft class="w-4 h-4" />
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-foreground font-medium"
        >
          1
        </button>
        <span class="px-1">...</span>
        <button class="flex items-center gap-1 hover:text-foreground">
          Next
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Job Details Slide-over -->
    <OperationalJobDetailSlideOver
      v-model="isDetailOpen"
      :job-id="selectedJobId"
      :initial-tab="initialTab"
      :initial-bl-id="initialBlId"
    />
  </div>
</template>
