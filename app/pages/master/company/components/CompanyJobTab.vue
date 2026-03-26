<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import type { CompanyJob } from "~/composables/useCompanies";

defineProps<{
  jobs: CompanyJob[];
  companyCode: string;
}>();

const formatShortDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5">
    Current Job
  </div>

  <template v-if="jobs.length > 0">
    <div
      v-for="job in jobs"
      :key="job.id"
      class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 inline-flex justify-start items-start gap-2 overflow-hidden hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <!-- Left Section: Job Number, Company Code, Badge -->
      <div class="flex justify-start items-start gap-2">
        <div class="inline-flex flex-col justify-start items-start gap-1">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-5">
            {{ job.jobNumber }}
          </div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
            {{ companyCode }}
          </div>
        </div>
        <div
          v-if="job.status"
          class="px-2 py-0.5 bg-blue-50 rounded-md shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-blue-200 flex justify-start items-center gap-1"
        >
          <div class="text-center text-blue-700 text-sm font-medium font-['Inter'] leading-5">
            {{ job.status.name }}
          </div>
        </div>
      </div>
      <!-- Right Section: POL -> POD with ETD -->
      <div class="flex-1 flex justify-end items-center gap-4 overflow-hidden">
        <div class="inline-flex flex-col justify-center items-end gap-1">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-5">{{ job.pol }}</div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
            ETD: {{ formatShortDate(job.etd) }}
          </div>
        </div>
        <!-- Arrow Icon -->
        <div class="size-4 relative overflow-hidden flex items-center justify-center">
          <div
            class="w-2.5 h-2.5 outline-2 outline-offset-[-1px] outline-black rotate-45 border-t-2 border-r-2 border-black"
          ></div>
        </div>
        <div class="inline-flex flex-col justify-center items-start gap-1">
          <div class="text-black text-sm font-semibold font-['Inter'] leading-5">{{ job.pod }}</div>
          <div class="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
            ETA: {{ formatShortDate(job.eta) }}
          </div>
        </div>
      </div>
    </div>
  </template>
  <div v-else class="w-full py-8 flex flex-col items-center justify-center text-gray-400">
    <Building2 class="w-8 h-8 mb-2 text-gray-300" />
    <p class="text-sm">No jobs available yet.</p>
  </div>
</template>
