<script setup lang="ts">
import { Ship, Eye } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Job {
  id: string;
  jobNumber: string;
  customer: string;
  type: "Export" | "Import";
  status: "Active" | "Pending" | "Canceled" | "Done";
  origin: string;
  destination: string;
  date: string;
}

const props = defineProps<{
  jobs?: Job[];
}>();

const jobs = computed(() => props.jobs || []);

const statusConfig: Record<Job["status"], { label: string; className: string }> = {
  Active: { label: "Active", className: "text-blue-600 border-blue-200 bg-blue-50 border" },
  Pending: {
    label: "Pending",
    className: "text-yellow-600 border-yellow-200 bg-yellow-50 border",
  },
  Canceled: { label: "Canceled", className: "text-red-600 border-red-200 bg-red-50 border" },
  Done: { label: "Done", className: "text-emerald-600 border-emerald-200 bg-emerald-50 border" },
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
      <table class="w-full">
        <thead>
          <tr class="border-b border-border bg-gray-50/50">
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">No. Job</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Route</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">ETA</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
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
            <td class="py-3 px-4 text-sm">{{ job.customer }}</td>
            <td class="py-3 px-4 text-sm">{{ job.origin }} → {{ job.destination }}</td>
            <td class="py-3 px-4 text-sm">{{ job.date }}</td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'text-xs px-2 py-1 rounded font-medium',
                    job.type === 'Export'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600',
                  )
                "
              >
                {{ job.type }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span
                :class="
                  cn(
                    'text-xs px-3 py-1 rounded-full border font-medium',
                    statusConfig[job.status]?.className,
                  )
                "
              >
                {{ statusConfig[job.status]?.label }}
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              <NuxtLink
                :to="`/operational/jobs/${job.id}`"
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
