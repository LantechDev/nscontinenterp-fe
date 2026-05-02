<script setup lang="ts">
import { FileText, Table2 } from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  title?: string;
  triggerX?: number;
  triggerY?: number;
  triggerWidth?: number;
  triggerHeight?: number;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "export-pdf"): void;
  (e: "export-excel"): void;
}>();

const popupStyle = computed(() => {
  const x = props.triggerX ?? 0;
  const y = props.triggerY ?? 0;
  const w = props.triggerWidth ?? 160;
  const popupHeight = 160;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const popupWidth = 240;

  let top = y + 44 + 4;

  let left = x + w / 2 - popupWidth / 2;
  const clampedLeft = Math.max(8, Math.min(left, vw - popupWidth - 8));

  if (top + popupHeight > vh - 8) {
    top = y - popupHeight - 4;
  }
  const clampedTop = Math.max(8, top);

  return {
    left: `${clampedLeft}px`,
    top: `${clampedTop}px`,
  };
});

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
    <Transition name="dropdown">
      <div
        v-if="open"
        class="fixed z-[100] w-60 bg-white rounded-xl shadow-2xl border border-border overflow-hidden"
        :style="popupStyle"
      >
        <div class="px-4 py-3 border-b border-border bg-[#012D5A]">
          <p class="text-sm font-semibold text-white">{{ title || "Export Options" }}</p>
        </div>
        <div class="p-1.5">
          <button
            class="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors group"
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
            class="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-green-50 transition-colors group"
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
    </Transition>
  </Teleport>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
