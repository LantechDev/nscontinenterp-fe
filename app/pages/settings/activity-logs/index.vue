<script setup lang="ts">
import {
  getActivityLogs,
  getActionLabel,
  getActionColor,
  type ActivityLog,
  type ActivityAction,
  type PaginatedResponse,
} from "~/lib/activity-log-api";
import { useAuth } from "~/composables/useAuth";
import { formatDateTime } from "~/lib/utils";
import { useDebounceFn } from "@vueuse/core";

// Simplified action categories for better UX
const ACTION_CATEGORIES = [
  { value: "", label: "All Actions" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "LOGIN_FAILED", label: "Login Failed" },
  { value: "CRUD", label: "CRUD Operations" },
  { value: "DATA", label: "Data Actions" },
];

// Simplified action filter mapping
const actionCategoryMap: Record<string, ActivityAction[]> = {
  CRUD: ["CREATE", "READ", "UPDATE", "DELETE"],
  DATA: [
    "EXPORT",
    "IMPORT",
    "APPROVE",
    "REJECT",
    "SUBMIT",
    "CANCEL",
    "CLOSE",
    "OPEN",
    "ARCHIVE",
    "RESTORE",
  ],
};

// Common target models for dropdown
const TARGET_MODELS = [
  { value: "", label: "All Models" },
  { value: "User", label: "User" },
  { value: "Company", label: "Company" },
  { value: "Vessel", label: "Vessel" },
  { value: "Job", label: "Job" },
  { value: "Invoice", label: "Invoice" },
  { value: "Quotation", label: "Quotation" },
  { value: "EBL", label: "EBL" },
  { value: "JournalEntry", label: "Journal Entry" },
  { value: "Tax", label: "Tax" },
  { value: "Expense", label: "Expense" },
  { value: "Role", label: "Role" },
];

definePageMeta({
  layout: "dashboard",
});

const { user, session } = useAuth();
const router = useRouter();

// Auth guard
watch(
  user,
  (newUser) => {
    if (!newUser) {
      router.push("/login");
    }
  },
  { immediate: true },
);

const logs = ref<ActivityLog[]>([]);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

const filters = ref({
  actionCategory: "" as string,
  targetModel: "",
  startDate: "",
  endDate: "",
  search: "",
});

// Initial fetch with useAsyncData
const { data: initialData, pending: isLoading } = await useAsyncData<
  PaginatedResponse<ActivityLog>
>("activity-logs-initial", async () => {
  return await getActivityLogs({
    page: pagination.value.page,
    limit: pagination.value.limit,
    organizationId: session.value?.activeOrganizationId,
  });
});

// Computed loading state that combines pending + client loading
const isLoadingAny = computed(() => isLoading.value);

watch(
  initialData,
  (response) => {
    if (response) {
      logs.value = response.logs;
      pagination.value = response.pagination;
    }
  },
  { immediate: true },
);

// Helper to get filtered logs
async function fetchLogsInternal() {
  const category = filters.value.actionCategory;
  let actionValue: ActivityAction | undefined = undefined;
  if (category && category !== "CRUD" && category !== "DATA") {
    actionValue = category as ActivityAction;
  }

  const response = await getActivityLogs({
    action: actionValue,
    targetModel: filters.value.targetModel || undefined,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined,
    search: filters.value.search || undefined,
    page: pagination.value.page,
    limit: pagination.value.limit,
    organizationId: session.value?.activeOrganizationId,
  });

  let filteredLogs = response.logs;
  if (category === "CRUD" || category === "DATA") {
    const allowedActions = getActionsForCategory(category);
    filteredLogs = response.logs.filter((log) => allowedActions.includes(log.action));
  }

  return { logs: filteredLogs, pagination: response.pagination };
}

// Debounced fetch for filter changes
const debouncedFetchLogs = useDebounceFn(async () => {
  try {
    const result = await fetchLogsInternal();
    logs.value = result.logs;
    pagination.value = result.pagination;
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
  }
}, 300);

async function fetchLogs() {
  try {
    const result = await fetchLogsInternal();
    logs.value = result.logs;
    pagination.value = result.pagination;
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
  }
}

// User Agent parser for friendly device names
function parseUA(ua: string | null): string {
  if (!ua) return "Unknown Device";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("iPhone")) os = "iPhone";
  else if (ua.includes("iPad")) os = "iPad";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("Linux")) os = "Linux";

  let browser = "Unknown Browser";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  else if (ua.includes("Opera")) browser = "Opera";

  return `${os} • ${browser}`;
}

// Get actions to filter based on category
const getActionsForCategory = (category: string): ActivityAction[] => {
  return actionCategoryMap[category] || [];
};

function clearFilters() {
  filters.value = {
    actionCategory: "",
    targetModel: "",
    startDate: "",
    endDate: "",
    search: "",
  };
  pagination.value.page = 1;
  fetchLogs();
}

function goToPage(page: number) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page;
    fetchLogs();
  }
}

watch(
  [filters],
  () => {
    pagination.value.page = 1;
    debouncedFetchLogs();
  },
  { deep: true },
);
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Activity Logs</h1>
      <p class="text-sm text-gray-500 mt-1">
        Track all user activities including login, data changes, and more
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Bar -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search Keywords</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="i-lucide-search h-4 w-4 text-gray-400" />
            </span>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by user, description, or target..."
              class="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Action Type - Simplified -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
          <select
            v-model="filters.actionCategory"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="cat in ACTION_CATEGORIES" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>

        <!-- Target Model - Changed to dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target</label>
          <select
            v-model="filters.targetModel"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="model in TARGET_MODELS" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button @click="clearFilters" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Activity Logs Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">Loading activity logs...</div>

      <div v-else-if="logs.length === 0" class="p-8 text-center text-gray-500">
        No activity logs found
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Time
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Target
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Details
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDateTime(log.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ log.user?.name || "System" }}
              </div>
              <div class="text-xs text-gray-500">
                {{ log.user?.email || "" }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getActionColor(log.action),
                ]"
              >
                {{ getActionLabel(log.action) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ log.targetModel || "System" }}</div>
              <div v-if="log.targetName" class="text-xs text-gray-500">{{ log.targetName }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 mb-1">{{ log.description }}</div>
              <div class="flex flex-wrap gap-x-3 gap-y-1">
                <div v-if="log.ipAddress" class="flex items-center text-xs text-gray-400">
                  <div class="i-lucide-globe h-3 w-3 mr-1" />
                  {{ log.ipAddress }}
                </div>
                <div v-if="log.userAgent" class="flex items-center text-xs text-gray-400">
                  <div class="i-lucide-monitor h-3 w-3 mr-1" />
                  {{ parseUA(log.userAgent) }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="px-6 py-4 flex items-center justify-between border-t border-gray-200"
      >
        <div class="text-sm text-gray-500">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
          {{ pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
