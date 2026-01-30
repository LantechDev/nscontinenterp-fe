<script setup lang="ts">
import {
  Plus,
  Search,
  Ship,
  Eye,
  Calendar,
  MapPin,
  Box,
  LayoutList,
  LayoutGrid,
  ArrowRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

definePageMeta({
  layout: "dashboard",
});

const { jobs, fetchJobs, isLoading } = useJobs();

// Fetch jobs on mount
onMounted(async () => {
  await fetchJobs();
});

const searchQuery = ref("");
const typeFilter = ref("");
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
const getStatusClass = (statusId: string | null | undefined) => {
  if (statusId === "completed") return "bg-gray-100 text-gray-700 border-gray-200";
  if (statusId === "pending") return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};
</script>

<template>
  <div class="space-y-6 animate-fade-in pb-10">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Job / Shipment</h1>
        <p class="text-muted-foreground mt-1">Kelola job dan shipment</p>
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
          <span>Open Job Baru</span>
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
              <th class="py-3 px-4 text-sm font-medium text-foreground">No. Job</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Komoditas</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Rute</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">ETA</th>
              <th class="py-3 px-4 text-sm font-medium text-foreground">Status</th>
              <th class="py-3 px-4 w-10"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="job in filteredJobs"
              :key="job.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              @click="navigateTo(`/operational/jobs/${job.id}`)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-blue-50 text-[#012D5A]">
                    <Ship class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-medium">{{ job.jobNumber }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-sm">{{ job.commodity }}</td>
              <td class="py-3 px-4">
                <div class="flex flex-col text-sm">
                  <span class="flex items-center gap-1 font-medium">
                    {{ job.pol }}
                  </span>
                  <span class="flex items-center gap-1 text-muted-foreground text-xs">
                    <ArrowRight class="w-3 h-3" /> {{ job.pod }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar class="w-3 h-3" />
                  {{ job.eta || "-" }}
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="
                    cn(
                      'px-2 py-0.5 rounded border text-xs font-medium',
                      getStatusClass(job.statusId),
                    )
                  "
                >
                  {{ job.statusId || "Active" }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="text-muted-foreground hover:text-foreground">
                  <MoreVertical class="w-4 h-4" />
                </button>
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
        @click="navigateTo(`/operational/jobs/${job.id}`)"
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
              <p class="text-xs text-muted-foreground">{{ job.commodity }}</p>
            </div>
          </div>
          <button class="text-muted-foreground hover:text-foreground" @click.stop>
            <MoreVertical class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex items-center gap-2 text-sm">
            <MapPin class="w-4 h-4 text-muted-foreground" />
            <span class="font-medium">{{ job.pol }}</span>
            <ArrowRight class="w-3 h-3 text-muted-foreground" />
            <span class="font-medium">{{ job.pod }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Calendar class="w-4 h-4 text-muted-foreground" />
            <span>ETA: {{ job.eta || "-" }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-border">
          <span
            :class="
              cn('px-2 py-0.5 rounded border text-xs font-medium', getStatusClass(job.statusId))
            "
          >
            {{ job.statusId || "Active" }}
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
  </div>
</template>
