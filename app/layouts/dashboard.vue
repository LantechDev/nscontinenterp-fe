<script setup lang="ts">
import { Search, Bell } from "lucide-vue-next";

// Use client-only for time to avoid hydration mismatch
const currentDate = ref("");
const currentTime = ref("");

const updateDateTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  currentDate.value = formatter.format(now);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  currentTime.value = `${hours}:${minutes} WIB`;
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <LayoutAppSidebar />

    <!-- Main content area -->
    <div class="ml-64">
      <!-- Top header -->
      <header
        class="sticky top-0 z-[1000] h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6"
      >
        <div class="relative max-w-md flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Type a command for search..."
            class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#012D5A] placeholder:text-gray-400"
          />
        </div>

        <div class="flex items-center gap-4">
          <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell class="w-5 h-5 text-gray-500" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ currentDate }}</p>
            <p class="text-xs text-gray-500">{{ currentTime }}</p>
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
