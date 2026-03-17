<script setup lang="ts">
import { FileText, Edit, Plus } from "lucide-vue-next";
import type { JobWithBls, BlParty } from "~/composables/useJobs";

const props = defineProps<{
  job: JobWithBls;
}>();

const emit = defineEmits<{
  (e: "edit-bl", blId: string): void;
}>();

function openBlEditor(blId: string) {
  emit("edit-bl", blId);
}
</script>

<template>
  <div class="space-y-6 animate-fade-in-up">
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">Managed Bills of Lading</h2>
      <button class="btn-primary text-sm" disabled>
        <Plus class="w-4 h-4 mr-2" />
        New BL
      </button>
    </div>

    <div v-if="job.billsOfLading && job.billsOfLading.length > 0" class="grid gap-4">
      <div
        v-for="bl in job.billsOfLading"
        :key="bl.id"
        class="card-elevated p-0 overflow-hidden hover:shadow-lg transition-shadow group"
      >
        <div class="p-5 flex items-start gap-4">
          <div
            class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"
          >
            <FileText class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3
                class="font-semibold text-lg hover:text-primary cursor-pointer transition-colors"
                @click="openBlEditor(bl.id)"
              >
                {{ bl.blNumber }}
              </h3>
              <span class="badge-secondary">{{ bl.status?.name || "DRAFT" }}</span>
            </div>
            <div class="flex gap-6 text-sm text-muted-foreground mb-3">
              <span class="flex items-center gap-1">
                <span class="font-medium text-foreground">Container:</span>
                {{ bl.containerNumber || "Pending" }}
              </span>
              <span class="flex items-center gap-1">
                <span class="font-medium text-foreground">Seal:</span>
                {{ bl.sealNumber || "-" }}
              </span>
            </div>
            <!-- Quick Party Preview -->
            <div class="flex gap-2 text-xs text-muted-foreground mt-2">
              <div class="px-2 py-1 bg-muted rounded border border-border">
                Shipper:
                {{
                  bl.blParties?.find((p: BlParty) => p.partyRoleCode === "SHIPPER")?.companyName ||
                  "Not Set"
                }}
              </div>
              <div class="px-2 py-1 bg-muted rounded border border-border">
                Consignee:
                {{
                  bl.blParties?.find((p: BlParty) => p.partyRoleCode === "CONSIGNEE")
                    ?.companyName || "Not Set"
                }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="openBlEditor(bl.id)" class="btn-outline text-xs w-full">
              <Edit class="w-3.5 h-3.5 mr-2" />
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border"
    >
      <FileText class="w-12 h-12 mx-auto mb-3 opacity-20" />
      No Bills of Lading found.
    </div>
  </div>
</template>
