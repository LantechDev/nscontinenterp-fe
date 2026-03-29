<script setup lang="ts">
import { FileText, ArrowLeft } from "lucide-vue-next";
import type { ActiveJobData } from "./types.ts";

const props = defineProps<{
  job: ActiveJobData;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const parts = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).formatToParts(d);
    return `${parts.find((p) => p.type === "day")?.value} ${parts.find((p) => p.type === "month")?.value.toUpperCase()} ${parts.find((p) => p.type === "year")?.value}`;
  } catch {
    return dateStr;
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-foreground">Bill of Lading</h3>
      </div>
    </div>

    <div
      v-if="!job.billsOfLading || job.billsOfLading.length === 0"
      class="border border-dashed border-border rounded-xl p-10 text-center bg-gray-50/50"
    >
      <div
        class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-border"
      >
        <FileText class="w-6 h-6 text-muted-foreground opacity-40" />
      </div>
      <p class="text-sm font-semibold text-foreground mb-1">No Bills of Lading available</p>
      <p class="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
        There are no bills of lading linked to this job yet.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="bl in job.billsOfLading"
        :key="bl.id"
        @click="bl.id && emit('select', bl.id)"
        class="group p-4 rounded-xl border border-border bg-white hover:border-[#012D5A]/30 hover:shadow-md transition-all cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span
                class="font-bold text-sm text-foreground group-hover:text-[#012D5A] transition-colors flex items-center gap-1.5"
              >
                {{ bl.blNumber || "Draft BL" }}
                <ArrowLeft
                  class="w-3 h-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </span>
            </div>
            <p class="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Created on {{ formatDate(bl.createdAt) }}
            </p>
          </div>
          <span
            class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200':
                bl.status?.toLowerCase() === 'finalized',
              'bg-amber-50 text-amber-700 border-amber-200': bl.status?.toLowerCase() === 'draft',
            }"
          >
            {{ bl.status }}
          </span>
        </div>

        <div class="border-t border-border pt-4">
          <p class="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
            Cargo Description
          </p>
          <p class="text-sm text-foreground line-clamp-2">{{ bl.cargoDescription || "-" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
