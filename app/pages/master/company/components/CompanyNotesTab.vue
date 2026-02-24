<script setup lang="ts">
import { Building2 } from "lucide-vue-next";

defineProps<{
  notes?: string | null;
}>();
</script>

<template>
  <div class="justify-start text-black text-sm font-semibold font-['Inter'] leading-5">Notes</div>
  <div
    v-if="notes"
    class="self-stretch p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 bg-slate-50"
  >
    <p class="text-black text-xs font-normal font-['Inter'] leading-5 whitespace-pre-wrap">
      {{ notes }}
    </p>
  </div>
  <div v-else class="w-full py-8 flex flex-col items-center justify-center text-gray-400">
    <Building2 class="w-8 h-8 mb-2 text-gray-300" />
    <p class="text-sm">No notes available yet.</p>
  </div>
</template>
