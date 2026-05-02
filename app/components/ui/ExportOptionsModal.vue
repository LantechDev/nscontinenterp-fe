<script setup lang="ts">
import { FileText, Table2 } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "export-pdf"): void;
  (e: "export-excel"): void;
}>();

function close() {
  emit("update:open", false);
}

function handleExportPdf() {
  emit("export-pdf");
  close();
}

function handleExportExcel() {
  emit("export-excel");
  close();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" @click="close" />

        <!-- Modal -->
        <div
          class="relative z-10 w-72 bg-white rounded-xl shadow-2xl border border-border overflow-hidden"
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-border bg-[#012D5A]">
            <p class="text-sm font-semibold text-white">{{ title || "Export Options" }}</p>
          </div>

          <!-- Options -->
          <div class="p-2">
            <button
              class="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
              @click="handleExportPdf"
            >
              <div
                class="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors"
              >
                <FileText class="w-4 h-4 text-red-600" />
              </div>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900">Export to PDF</p>
                <p class="text-xs text-muted-foreground">Download as PDF document</p>
              </div>
            </button>

            <button
              class="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
              @click="handleExportExcel"
            >
              <div
                class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors"
              >
                <Table2 class="w-4 h-4 text-green-600" />
              </div>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900">Export to Excel</p>
                <p class="text-xs text-muted-foreground">Download as spreadsheet</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
