<script setup lang="ts">
import { Scale } from "lucide-vue-next";

interface Props {
  total: number;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Total Units -->
    <div class="bg-white border border-border rounded-xl p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Scale class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Total Units</p>
          <p class="text-2xl font-bold text-foreground">{{ total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
