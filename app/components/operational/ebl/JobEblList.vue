<script setup lang="ts">
import { FileText, ArrowLeft, CheckCircle2, Send, Loader2 } from "lucide-vue-next";
import type { ActiveJobData } from "./types";
import { useAuth } from "~/composables/useAuth";

const { canApproveJobs } = useAuth();

const props = defineProps<{
  job: ActiveJobData;
  approvingId?: string | null;
  rejectingId?: string | null;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
  (e: "approve", id: string): void;
  (e: "reject", id: string): void;
  (e: "request-finalize", id: string): void;
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

const getStatusCode = (status?: string | { code?: string; name?: string } | null) => {
  if (!status) return "";
  const code = typeof status === "string" ? status.toLowerCase() : status.code?.toLowerCase() || "";
  if (code === "confirmed" || code === "finalized") return "finalized";
  if (code === "pending_approval") return "pending_approval";
  return code;
};

const getStatusName = (status?: string | { code?: string; name?: string } | null) => {
  if (!status) return "DRAFT";
  const name = typeof status === "string" ? status : status.name || status.code || "DRAFT";
  const upper = name.toUpperCase();
  if (upper === "CONFIRMED") return "FINALIZED";
  if (upper === "PENDING_APPROVAL") return "PENDING APPROVAL";
  return upper;
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
          <div class="flex items-center gap-2">
            <span
              class="px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest leading-none"
              :class="{
                'bg-emerald-50 text-emerald-700 border-emerald-200':
                  getStatusCode(bl.status) === 'finalized',
                'bg-amber-50 text-amber-700 border-amber-200':
                  getStatusCode(bl.status) === 'draft' && !bl.rejectReason,
                'bg-red-50 text-red-700 border-red-200':
                  getStatusCode(bl.status) === 'draft' && !!bl.rejectReason,
                'bg-blue-50 text-blue-700 border-blue-200':
                  getStatusCode(bl.status) === 'pending_approval',
              }"
            >
              {{
                getStatusCode(bl.status) === "draft" && bl.rejectReason
                  ? "REVISION REQUIRED"
                  : getStatusName(bl.status)
              }}
            </span>
            <button
              v-if="canApproveJobs && getStatusCode(bl.status) === 'pending_approval'"
              @click.stop="bl.id && $emit('reject', bl.id)"
              :disabled="rejectingId === bl.id || approvingId === bl.id"
              class="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold rounded hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Loader2 v-if="rejectingId === bl.id" class="w-3 h-3 animate-spin" />
              {{ rejectingId === bl.id ? "REJECTING..." : "REJECT" }}
            </button>
            <button
              v-if="canApproveJobs && getStatusCode(bl.status) === 'pending_approval'"
              @click.stop="bl.id && $emit('approve', bl.id)"
              :disabled="approvingId === bl.id || rejectingId === bl.id"
              class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Loader2 v-if="approvingId === bl.id" class="w-3 h-3 animate-spin" />
              {{ approvingId === bl.id ? "APPROVING..." : "APPROVE" }}
            </button>
            <button
              v-if="getStatusCode(bl.status) === 'draft'"
              @click.stop="bl.id && $emit('request-finalize', bl.id)"
              class="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              REQUEST FINALIZE
            </button>
          </div>
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
