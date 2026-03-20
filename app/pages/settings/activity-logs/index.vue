<script setup lang="ts">
import {
  getActivityLogs,
  getActionLabel,
  getActionColor,
  type ActivityLog,
  type ActivityAction,
  ACTIVITY_ACTIONS,
} from "~/lib/activity-log-api";
import { useAuth } from "~/composables/useAuth";
import { formatDateTime } from "~/lib/utils";
import { useDebounceFn } from "@vueuse/core";

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
const isLoading = ref(true);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
});

// Filters
const filters = ref({
  action: "" as ActivityAction | "",
  targetModel: "",
  startDate: "",
  endDate: "",
});

async function fetchLogs() {
  isLoading.value = true;
  try {
    const response = await getActivityLogs({
      action: filters.value.action || undefined,
      targetModel: filters.value.targetModel || undefined,
      startDate: filters.value.startDate || undefined,
      endDate: filters.value.endDate || undefined,
      page: pagination.value.page,
      limit: pagination.value.limit,
      organizationId: session.value?.activeOrganizationId,
    });
    logs.value = response.logs;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
  } finally {
    isLoading.value = false;
  }
}

// Debounced version of fetchLogs to avoid excessive API calls
const debouncedFetchLogs = useDebounceFn(fetchLogs, 300);

function clearFilters() {
  filters.value = {
    action: "",
    targetModel: "",
    startDate: "",
    endDate: "",
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

onMounted(() => {
  fetchLogs();
});

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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <select
            v-model="filters.action"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option v-for="action in ACTIVITY_ACTIONS" :key="action" :value="action">
              {{ getActionLabel(action) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target Model</label>
          <input
            v-model="filters.targetModel"
            type="text"
            placeholder="e.g., User, Invoice, Job"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="mt-4 flex justify-end">
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
              <div class="text-sm text-gray-900">{{ log.targetModel }}</div>
              <div class="text-xs text-gray-500">{{ log.targetId }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-500">
                <div v-if="log.path">{{ log.method }} {{ log.path }}</div>
                <div v-if="log.ipAddress" class="text-xs">IP: {{ log.ipAddress }}</div>
                <div v-if="log.description" class="text-xs mt-1">{{ log.description }}</div>
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
