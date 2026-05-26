<script setup lang="ts">
import { computed } from "vue";
import Combobox from "~/components/ui/Combobox.vue";

const jumlahOriginal = defineModel<number>("jumlahOriginal", { required: true });
const jumlahCopy = defineModel<number>("jumlahCopy", { required: true });
const watermarkColor = defineModel<string>("watermarkColor", { required: true });
const exportMode = defineModel<string>("exportMode", { required: true });

const props = defineProps<{
  permanentBlType: string;
  printSummary: {
    type: string;
    details: string;
    sets: number;
    totalPages: number;
  };
}>();

const printModeOptions = computed(() => {
  if (props.permanentBlType === "ORIGINAL") {
    return [
      { id: "ORIGINAL", name: "ORIGINAL" },
      { id: "EXPRESS_RELEASE", name: "EXPRESS RELEASE" },
    ];
  }
  if (props.permanentBlType === "TELEX_RELEASE") {
    return [{ id: "EXPRESS_RELEASE", name: "EXPRESS RELEASE" }];
  }
  if (props.permanentBlType === "SEAWAYBILL") {
    return [{ id: "SEAWAYBILL", name: "SEAWAYBILL" }];
  }
  return [{ id: "DRAFT", name: "DRAFT" }];
});

const watermarkColorOptions = [
  { id: "red", name: "RED" },
  { id: "blue", name: "BLUE" },
];
</script>

<template>
  <div class="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-5 max-w-4xl mx-auto">
    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
        <span class="w-1.5 h-4 bg-[#012D5A] rounded-full"></span>
        PDF Export Configuration
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
      <!-- Print Mode Display -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Print Mode
        </label>
        <Combobox v-model="exportMode" :options="printModeOptions" placeholder="Select Mode" />
      </div>

      <!-- Jumlah Original (Only shown if mode is ORIGINAL) -->
      <div v-if="exportMode === 'ORIGINAL'" class="space-y-1.5">
        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Jumlah Original
        </label>
        <input
          v-model.number="jumlahOriginal"
          type="number"
          min="0"
          class="w-full h-10 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] transition-all"
        />
      </div>

      <!-- Jumlah Copy -->
      <div class="space-y-1.5">
        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Jumlah Copy
        </label>
        <input
          v-model.number="jumlahCopy"
          type="number"
          min="0"
          class="w-full h-10 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#012D5A]/20 focus:border-[#012D5A] transition-all"
        />
      </div>

      <!-- Watermark Color (Only for Express Release) -->
      <div v-if="exportMode === 'EXPRESS_RELEASE'" class="space-y-1.5">
        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Watermark Color
        </label>
        <Combobox
          v-model="watermarkColor"
          :options="watermarkColorOptions"
          placeholder="Select Color"
        />
      </div>
    </div>

    <!-- Preview Summary -->
    <div
      class="mt-4 p-3 bg-gray-50 border border-gray-150 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-3"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-700 uppercase tracking-wider">Summary:</span>
        <span class="text-gray-600 font-mono">{{ printSummary.details }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold uppercase tracking-wider text-[10px] border border-blue-100"
        >
          {{ printSummary.sets }} Set(s)
        </div>
        <div
          class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold uppercase tracking-wider text-[10px] border border-indigo-100"
        >
          {{ printSummary.totalPages }} Total PDF Page(s)
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
    monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
