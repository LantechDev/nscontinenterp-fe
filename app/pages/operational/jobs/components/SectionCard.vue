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
  <section
    :id="id"
    class="bg-card rounded-xl border border-border/60 shadow-sm scroll-mt-24 transition-all duration-300"
  >
    <div
      class="px-6 py-3.5 border-b border-border/40 flex items-center gap-2.5 bg-muted/5 rounded-t-xl"
    >
      <div class="p-1.5 rounded-lg bg-primary/5 text-primary">
        <component :is="icon" class="w-4 h-4" />
      </div>
      <h2 class="font-semibold text-[14px] text-foreground/90 uppercase tracking-tight">
        {{ title }}
      </h2>
    </div>
    <div :class="noPadding ? '' : 'p-6 ' + (bodyClass || '')">
      <slot />
    </div>
  </section>
</template>
