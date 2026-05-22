<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import Modal from "~/components/ui/Modal.vue";
import { formatLogDetails, formatLogDescription } from "~/lib/finance-activity-log";

import type { ActivityLog } from "~/lib/activity-log-api";

const props = defineProps<{
  modelValue: boolean;
  isJobHistory?: boolean;
  isLoading?: boolean;
  historyLogs: ActivityLog[];
  title?: string;
  description?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="title || (isJobHistory ? 'Job History Logs' : 'Activity History')"
    :description="
      description ||
      (isJobHistory
        ? 'List of all activity and history logs for this job.'
        : 'List of all activities and changes related to this entry.')
    "
    width="max-w-xl"
  >
    <div class="space-y-4 pt-2">
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground"
      >
        <Loader2 class="w-8 h-8 animate-spin text-primary" />
        <span class="text-xs">Loading history...</span>
      </div>
      <div
        v-else-if="historyLogs.length === 0"
        class="text-center py-8 text-xs text-muted-foreground"
      >
        No activity logs found.
      </div>
      <div v-else class="max-h-[350px] overflow-y-auto pr-1 pl-4 space-y-4">
        <div
          v-for="log in historyLogs"
          :key="log.id"
          class="relative pl-6 pb-2 border-l border-slate-200 last:border-transparent last:pb-0"
        >
          <!-- Timeline node icon -->
          <span
            class="absolute -left-1.5 top-1 flex h-3 w-3 rounded-full ring-4 ring-white"
            :class="[
              log.action === 'CREATE'
                ? 'bg-emerald-500'
                : log.action === 'UPDATE'
                  ? 'bg-blue-500'
                  : log.action === 'DELETE'
                    ? 'bg-red-500'
                    : log.action === 'CANCEL'
                      ? 'bg-amber-500'
                      : 'bg-slate-400',
            ]"
          ></span>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-slate-800">
                {{ formatLogDescription(log) }}
              </span>
              <span class="text-[10px] text-muted-foreground shrink-0">
                {{
                  new Date(log.createdAt).toLocaleString("id-ID", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                }}
              </span>
            </div>
            <div class="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span
                >By: <strong class="text-slate-700">{{ log.user?.name || "System" }}</strong></span
              >
              <span class="text-slate-300">|</span>
              <span
                class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                :class="[
                  log.action === 'CREATE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : log.action === 'UPDATE'
                      ? 'bg-blue-50 text-blue-700'
                      : log.action === 'DELETE'
                        ? 'bg-red-50 text-red-700'
                        : log.action === 'CANCEL'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-50 text-slate-700',
                ]"
              >
                {{ log.action }}
              </span>
            </div>

            <!-- Changes list if any -->
            <div
              v-if="formatLogDetails(log).length > 0"
              class="mt-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 space-y-0.5"
            >
              <div
                v-for="(change, idx) in formatLogDetails(log)"
                :key="idx"
                class="flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>{{ change }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-2 border-t border-border">
        <button
          @click="emit('update:modelValue', false)"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
</template>
