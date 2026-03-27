<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  id: string;
  title: string;
  icon: Component;
  bodyClass?: string;
  noPadding?: boolean;
}>();
</script>

<template>
  <section :id="id" class="bg-card rounded-xl border border-border shadow-sm scroll-mt-6">
    <div
      class="px-6 py-4 border-b border-border/50 flex items-center gap-2.5 bg-muted/10 rounded-t-xl"
    >
      <component :is="icon" class="w-4 h-4 text-primary" />
      <h2 class="font-medium text-[15px]">{{ title }}</h2>
    </div>
    <div :class="noPadding ? '' : 'p-6 ' + (bodyClass || '')">
      <slot />
    </div>
  </section>
</template>
