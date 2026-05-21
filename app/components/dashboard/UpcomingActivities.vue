<script setup lang="ts">
import { Calendar, Clock, ChevronRight, Anchor, MapPin, Plane } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Activity {
  id: string;
  type: "Departure" | "Arrival";
  title: string;
  description: string;
  time: string;
  isAir?: boolean;
}

const props = defineProps<{
  events?: Activity[];
}>();

const activities = computed(() => props.events || []);
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">Operational Schedule</h3>
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
      class="flex-1 flex flex-col items-center justify-center text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border"
    >
      <Calendar class="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p class="text-sm font-medium text-muted-foreground">No upcoming schedule</p>
      <p class="text-xs text-muted-foreground/60 mt-1">Vessel/Plane ETD/ETA will appear here</p>
    </div>

    <div v-else class="space-y-3 flex-1 overflow-auto pr-1">
      <NuxtLink
        v-for="activity in activities"
        :key="activity.id"
        :to="`/operational/jobs?id=${activity.id}`"
        class="block p-4 rounded-xl border border-border bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-3">
            <div
              :class="
                cn(
                  'p-2 rounded-lg transition-colors',
                  activity.type === 'Departure'
                    ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                    : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
                )
              "
            >
              <template v-if="activity.type === 'Departure'">
                <Plane v-if="activity.isAir" class="w-4 h-4" />
                <Anchor v-else class="w-4 h-4" />
              </template>
              <MapPin v-else class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-bold text-foreground leading-tight">{{ activity.title }}</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">{{ activity.description }}</p>
            </div>
          </div>
          <ChevronRight
            class="w-4 h-4 text-muted-foreground/50 group-hover:text-blue-500 transition-colors"
          />
        </div>

        <div
          :class="
            cn(
              'flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-md w-fit',
              activity.type === 'Departure'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-emerald-50 text-emerald-700',
            )
          "
        >
          <Calendar class="w-3.5 h-3.5" />
          <span>{{ activity.time }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
