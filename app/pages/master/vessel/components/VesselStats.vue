<script setup lang="ts">
import { Ship } from "lucide-vue-next";

interface Props {
  total: number;
  active: number;
  inactive: number;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Total Vessels -->
    <div class="bg-white border border-border rounded-xl p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <Ship class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Total Vessels</p>
          <p class="text-2xl font-bold text-foreground">{{ total }}</p>
        </div>
      </div>
    </div>

    <!-- Active Vessels -->
    <div class="bg-white border border-border rounded-xl p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
          <Ship class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Active Vessels</p>
          <p class="text-2xl font-bold text-foreground">{{ active }}</p>
        </div>
      </div>
    </div>

    <!-- Inactive Vessels -->
    <div class="bg-white border border-border rounded-xl p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <Ship class="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Inactive Vessels</p>
          <p class="text-2xl font-bold text-foreground">{{ inactive }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
