<script setup lang="ts">
import { Ship } from "lucide-vue-next";
import type { JobWithBls } from "~/composables/useJobs";

defineProps<{
  job: JobWithBls;
}>();

// Helper for date formatting
const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};
</script>

<template>
  <div class="space-y-6 animate-fade-in p-6-up">
    <div class="card-elevated p-6">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Ship class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ job.commodity }}</h2>
          <p class="text-muted-foreground">Job Overview</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Route Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">Route</h4>
          <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4">
            <div class="w-1 h-full bg-border relative">
              <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
              ></div>
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
              ></div>
            </div>
            <div class="space-y-6">
              <div>
                <p class="text-xs text-muted-foreground">POL (Port of Loading)</p>
                <p class="font-medium text-lg">{{ job.pol }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(job.etd) || "TBA" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">POD (Port of Discharge)</p>
                <p class="font-medium text-lg">{{ job.pod }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(job.eta) || "TBA" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Details
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between border-b border-dashed border-border pb-2">
              <span class="text-sm text-muted-foreground">Vessel</span>
              <span class="font-medium">{{ job.vessel?.name || "-" }}</span>
            </div>
            <div class="flex justify-between border-b border-dashed border-border pb-2">
              <span class="text-sm text-muted-foreground">Container Type</span>
              <span class="font-medium">{{ job.containerType?.name || "-" }}</span>
            </div>
            <div class="flex justify-between border-b border-dashed border-border pb-2">
              <span class="text-sm text-muted-foreground">Total BLs</span>
              <span class="font-medium">{{ job.totalBlCount }}</span>
            </div>
          </div>
        </div>

        <!-- Parties Section -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Parties (Default)
          </h4>
          <div class="space-y-3">
            <div v-for="party in job.jobParties" :key="party.id" class="p-3 bg-muted/30 rounded-lg">
              <p class="text-xs text-muted-foreground mb-1">
                {{ party.partyRole?.name || party.partyRoleId }}
              </p>
              <p class="font-medium truncate">
                {{ party.companyName || party.company?.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
