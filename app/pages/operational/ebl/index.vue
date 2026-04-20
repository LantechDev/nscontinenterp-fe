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
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

interface EblItem {
  id: string;
  blNumber: string;
  jobId: string;
  job?: {
    jobNumber: string;
  };
  statusId: string | null;
  status?: {
    code: string | null;
    name: string | null;
  } | null;
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

// Map status code to display format
const getStatusInfo = (ebl: EblItem): { label: string; class: string } => {
  const statusCode = ebl.status?.code || ebl.statusId || "";
  const statusMap: Record<string, { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
    issued: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
    surrendered: {
      label: "Surrendered",
      class: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    DRAFT: { label: "Draft", class: "bg-gray-100 text-gray-700 border-gray-200" },
    ISSUED: { label: "Terbit", class: "bg-green-50 text-green-700 border-green-200" },
  };
  return (
    statusMap[statusCode] || {
      label: ebl.status?.name || statusCode || "Unknown",
      class: "bg-gray-100 text-gray-700",
    }
  );
};

type ViewMode = "list" | "grid";
const viewMode = ref<ViewMode>("list");

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

  ebls.value.forEach((ebl) => {
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
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">eBL (Electronic Bill of Lading)</h1>
        <p class="text-muted-foreground mt-1">Kelola dokumen eBL</p>
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
          type="text"
          placeholder="Cari eBL..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/operational/ebl/create"
          class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#012D5A] text-white hover:bg-[#012D5A]/90 rounded-lg transition-colors min-w-fit whitespace-nowrap"
        >
          <Plus class="w-4 h-4" />
          <span>Buat eBL</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-8 text-center text-muted-foreground">Loading EBLs...</div>

    <!-- List View -->
    <div
      v-else-if="viewMode === 'list'"
      class="border border-border rounded-xl bg-white overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-white text-left">
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. eBL</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="group in groupedEbls" :key="group.jobId">
              <!-- Job Header Row -->
              <tr class="bg-gray-50 border-b border-border">
                <td colspan="3" class="py-2.5 px-4">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
                      >Job:</span
                    >
                    <span class="text-sm font-bold text-[#012D5A]">{{ group.jobNumber }}</span>
                    <span
                      class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black ml-2"
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
                class="border-b border-border last:border-b hover:bg-muted/30 transition-colors cursor-pointer"
                @click="openBlDetail(ebl.id)"
              >
                <td class="py-3 px-4 pl-8">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                      <FileText class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium">{{ ebl.blNumber }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-sm text-muted-foreground">
                  {{ ebl.job?.jobNumber || "-" }}
                </td>
                <td class="py-3 px-4">
                  <span
                    :class="
                      cn('px-2 py-0.5 rounded border text-xs font-medium', getStatusInfo(ebl).class)
                    "
                  >
                    {{ getStatusInfo(ebl).label }}
                  </span>
                </td>
              </tr>
            </template>
            <tr v-if="ebls.length === 0">
              <td colspan="3" class="p-8 text-center text-muted-foreground">Belum ada data eBL.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ebl in ebls"
        :key="ebl.id"
        class="border border-border rounded-xl bg-white p-5 hover:shadow-sm transition-shadow cursor-pointer"
        @click="openBlDetail(ebl.id)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-50 text-[#012D5A] flex items-center justify-center shrink-0"
            >
              <FileText class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base text-foreground">{{ ebl.blNumber }}</h3>
              <p class="text-xs text-muted-foreground">
                {{ ebl.job?.jobNumber || "-" }}
              </p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span
            :class="cn('px-2 py-0.5 rounded border text-xs font-medium', getStatusInfo(ebl).class)"
          >
            {{ getStatusInfo(ebl).label }}
          </span>
        </div>
      </div>
      <div v-if="ebls.length === 0" class="col-span-full p-8 text-center text-muted-foreground">
        Belum ada data eBL.
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="ebls.length > 0"
      class="flex items-center justify-between text-sm text-muted-foreground"
    >
      <p>{{ ebls.length }} data found.</p>
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

    <!-- Job Details Slide-over showing eBL tab -->
    <OperationalJobDetailSlideOver
      v-model="isDetailOpen"
      :job-id="selectedJobId"
      initial-tab="ebl"
      :initial-bl-id="initialBlId"
    />
  </div>
</template>
