<script setup lang="ts">
import { Ship, Eye } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  type: "Export" | "Import";
  serviceType?: string | null;
  shipmentType?: string | null;
  serviceLabel?: string;
  status: {
    code: string;
    name: string;
  };
  origin: string;
  destination: string;
  date: string;
}

const props = defineProps<{
  jobs?: Job[];
}>();

const jobs = computed(() => props.jobs || []);

const getServiceLabel = (job: Job) => {
  if (job.serviceLabel) return job.serviceLabel;
  if (job.serviceType === "TRUCKING") return "Trucking";
  if (job.serviceType === "CUSTOM_CLEARANCE") return "Custom Clearance";
  if (job.serviceType === "AIR" || job.shipmentType === "AIR") return "Air Freight";
  return "Ocean Freight";
};

const getServiceClass = (job: Job) => {
  if (job.serviceType === "TRUCKING") return "bg-amber-100 text-amber-700";
  if (job.serviceType === "CUSTOM_CLEARANCE") return "bg-violet-100 text-violet-700";
  if (job.serviceType === "AIR" || job.shipmentType === "AIR") return "bg-sky-100 text-sky-700";
  return "bg-blue-100 text-blue-600";
};

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
</script>

<template>
  <div class="border border-border rounded-xl bg-white overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between p-5 border-b border-border">
      <h3 class="text-lg font-semibold text-foreground">Recent Jobs</h3>
      <NuxtLink
        to="/operational/jobs"
        class="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View All
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div
      v-if="jobs.length === 0"
      class="flex flex-col items-center justify-center text-center py-12"
    >
      <Ship class="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p class="text-sm font-medium text-muted-foreground">No recent jobs</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Jobs will appear here when created</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full table-fixed">
        <thead>
          <tr class="border-b border-border bg-gray-50/50">
            <th class="w-[15%] py-3 px-4 text-left text-sm font-medium text-gray-500">No. Job</th>
            <th class="w-[18%] py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
            <th class="w-[28%] py-3 px-4 text-left text-sm font-medium text-gray-500">Route</th>
            <th class="w-[11%] py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
            <th class="w-[14%] py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
            <th class="w-[14%] py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
            <th class="py-3 px-4 text-right text-sm font-medium text-gray-500 w-10"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs"
            :key="job.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <td class="py-3 px-4">
              <span class="text-sm font-medium text-[#012D5A]">{{ job.jobNumber }}</span>
            </td>
            <td class="py-3 px-4 text-sm truncate" :title="job.customer">{{ job.customer }}</td>
            <td class="py-3 px-4 text-sm">
              <span class="block truncate" :title="`${job.origin} → ${job.destination}`">
                {{ job.origin }} → {{ job.destination }}
              </span>
            </td>
            <td class="py-3 px-4 text-sm">{{ job.date }}</td>
            <td class="py-3 px-4">
              <span :class="cn('text-xs px-2 py-1 rounded font-medium', getServiceClass(job))">
                {{ getServiceLabel(job) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'text-xs px-2 py-1 rounded border font-medium whitespace-nowrap',
                    getStatusClass(job.status.code),
                  )
                "
              >
                {{ job.status.name }}
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              <NuxtLink
                :to="`/operational/jobs?id=${job.id}`"
                class="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye class="w-4 h-4" />
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
