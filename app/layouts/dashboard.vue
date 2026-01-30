<script setup lang="ts">
import { Search, Bell } from "lucide-vue-next";

const currentDate = computed(() => {
    const now = new Date();
    // Simulate the date in the screenshot if desired, or use real date.
    // User asked to "samain aja layout", usually implies current date but formatted same way.
    // Format: DayName, Day Month Year
    const formatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return formatter.format(now);
});

const currentTime = computed(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} WIB`;
});
</script>

<template>
    <div class="min-h-screen bg-background">
        <LayoutAppSidebar />

        <!-- Main content area -->
        <div class="ml-64">
            <!-- Top header -->
            <header
                class="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6"
            >
                <div class="relative max-w-md flex-1">
                    <Search
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Type a command for search..."
                        class="input-field pl-10 bg-muted/50 w-full"
                    />
                </div>

                <div class="flex items-center gap-4">
                    <button class="relative p-2 rounded-lg hover:bg-muted transition-colors">
                        <Bell class="w-5 h-5 text-muted-foreground" />
                        <span class="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                    </button>
                    <div class="text-right">
                        <p class="text-sm font-medium">{{ currentDate }}</p>
                        <p class="text-xs text-muted-foreground">{{ currentTime }}</p>
                    </div>
                </div>
            </header>

            <!-- Page content -->
            <main class="p-6">
                <NuxtPage :key="$route.fullPath" />
            </main>
        </div>

        <UiConfirmDialog />
    </div>
</template>
