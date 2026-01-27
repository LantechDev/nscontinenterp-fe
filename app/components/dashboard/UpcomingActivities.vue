<script setup lang="ts">
import { Calendar, Clock, ChevronRight } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Activity {
    id: string;
    title: string;
    description: string;
    time: string;
}

const activities: Activity[] = [
    {
        id: "1",
        title: "Kapal ETD - MV Sinar Jaya",
        description: "JOB-2026-001234",
        time: "02:30 WIB",
    },
    {
        id: "2",
        title: "Kapal ETD - MV Sinar Jaya",
        description: "JOB-2026-001234",
        time: "02:30 WIB",
    },
    {
        id: "3",
        title: "Kapal ETD - MV Sinar Jaya",
        description: "JOB-2026-001234",
        time: "02:30 WIB",
    },
    {
        id: "4",
        title: "Kapal ETD - MV Sinar Jaya",
        description: "JOB-2026-001234",
        time: "02:30 WIB",
    },
];
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-lg">Upcoming Event</h3>
            <NuxtLink to="#" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All
            </NuxtLink>
        </div>

        <div class="space-y-4 flex-1 overflow-auto pr-2">
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
