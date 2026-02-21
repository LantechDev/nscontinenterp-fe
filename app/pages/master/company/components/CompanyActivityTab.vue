<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import type { CompanyActivityLog } from "~/composables/useCompanies";

defineProps<{
  activities: CompanyActivityLog[];
}>();

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
};
</script>

<template>
  <div class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5">
    Latest Activity
  </div>

  <template v-if="activities.length > 0">
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="self-stretch inline-flex justify-between items-start flex-wrap content-start"
    >
      <div class="flex justify-start items-start gap-2 overflow-hidden">
        <div
          class="p-2 bg-zinc-100 rounded-full inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden"
        >
          <Building2 class="w-4 h-4 text-[#012D5A]" />
        </div>
        <div class="self-stretch inline-flex flex-col justify-between items-start">
          <div class="justify-start text-black text-xs font-semibold font-['Inter'] leading-4">
            {{ activity.action }}
          </div>
          <div class="justify-start text-black text-xs font-normal font-['Inter'] leading-4">
            by {{ activity.user?.name || "System" }}
          </div>
        </div>
      </div>
      <div class="justify-start text-gray-500 text-xs font-normal font-['Inter'] leading-4">
        {{ formatDate(activity.createdAt) }}
      </div>
    </div>
  </template>
  <div v-else class="w-full py-8 flex flex-col items-center justify-center text-gray-400">
    <Building2 class="w-8 h-8 mb-2 text-gray-300" />
    <p class="text-sm">No activity available yet.</p>
  </div>
</template>
