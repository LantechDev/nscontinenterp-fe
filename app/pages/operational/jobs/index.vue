<script setup lang="ts">
import {
  Plus,
  Search,
  Ship,
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
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const { jobs, fetchJobs, isLoading } = useJobs();
const route = useRoute();
const router = useRouter();

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
    return matchesSearch;
  });
});

// Helper for status badge class
const getStatusClass = (statusCode: string | null | undefined) => {
  const code = (statusCode || "").toUpperCase();
  if (code === "COMPLETED" || code === "CLOSED" || code === "DONE")
    return "bg-green-50 text-green-700 border-green-200";
  if (code === "DRAFT") return "bg-gray-100 text-gray-600 border-gray-200";
  if (code === "CANCELLED" || code === "VOID") return "bg-red-50 text-red-700 border-red-200";
  if (code === "PENDING" || code === "ACTIVE" || code === "IN_PROGRESS")
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (code === "CONFIRMED") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const selectedJobId = ref("");
const isDetailOpen = ref(false);
const initialTab = ref<string | undefined>(undefined);
const initialBlId = ref<string | undefined>(undefined);

function openJobDetail(id: string, tab?: string, blId?: string) {
  selectedJobId.value = id;
  initialTab.value = tab;
  initialBlId.value = blId;
  isDetailOpen.value = true;
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

    <!-- Filters -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari job..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
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
                    <Ship class="w-4 h-4" />
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
                      :title="job.polName || undefined"
                      >{{ job.polName || job.pol }}</span
                    >
                  </div>
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight class="w-3 h-3" />
                    <span class="truncate" :title="job.podName || undefined">{{
                      job.podName || job.pod
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex flex-col gap-1">
                  <div
                    v-if="job.tradeType?.code === 'EXPORT'"
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50/50 border border-orange-100 text-[#c2410c] text-[11px] font-semibold w-fit"
                  >
                    <Calendar class="w-3 h-3 opacity-70" />
                    <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]">ETD</span>
                    {{ formatDate(job.etd || "") || "-" }}
                  </div>
                  <div
                    v-else
                    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/50 border border-blue-100 text-[#1d4ed8] text-[11px] font-semibold w-fit"
                  >
                    <Calendar class="w-3 h-3 opacity-70" />
                    <span class="opacity-70 uppercase tracking-tighter mr-0.5 text-[9px]">ETA</span>
                    {{ formatDate(job.eta || "") || "-" }}
                  </div>
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
              <Ship class="w-6 h-6" />
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
              <span class="font-bold text-[#012D5A] truncate">{{ job.polName || job.pol }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs pl-5 text-muted-foreground">
              <ArrowRight class="w-3 h-3 shrink-0" />
              <span class="truncate">{{ job.podName || job.pod }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm pt-1">
            <Calendar class="w-4 h-4 text-muted-foreground opacity-50" />
            <div
              v-if="job.tradeType?.code === 'EXPORT'"
              class="px-2 py-0.5 rounded bg-orange-50/80 border border-orange-100 text-[#c2410c] text-[10px] font-bold"
            >
              ETD: {{ formatDate(job.etd || "") || "-" }}
            </div>
            <div
              v-else
              class="px-2 py-0.5 rounded bg-blue-50/80 border border-blue-100 text-[#1d4ed8] text-[10px] font-bold"
            >
              ETA: {{ formatDate(job.eta || "") || "-" }}
            </div>
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
