<script setup lang="ts">
import { Calendar, Clock, ChevronRight } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}

const props = defineProps<{
  events?: Activity[];
}>();

const activities = computed(() => props.events || []);
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">Upcoming Event</h3>
      <NuxtLink
        to="/operational/jobs"
        class="text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View All
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div
      v-if="activities.length === 0"
      class="flex-1 flex flex-col items-center justify-center text-center py-8"
    >
      <Calendar class="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p class="text-sm font-medium text-muted-foreground">No upcoming activities</p>
      <p class="text-xs text-muted-foreground/60 mt-1">
        Activities will appear here when scheduled
      </p>
    </div>

    <div v-else class="space-y-4 flex-1 overflow-auto pr-2">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-foreground">{{ activity.title }}</p>
          <ChevronRight class="w-4 h-4 text-muted-foreground" />
        </div>
        <p class="text-sm text-foreground/70 mb-3">{{ activity.description }}</p>
        <div class="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
          <Clock class="w-3.5 h-3.5" />
          <span>{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
