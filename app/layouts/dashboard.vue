<script setup lang="ts">
import {
  Search,
  Bell,
  X,
  Briefcase,
  Building2,
  FileText,
  CreditCard,
  Wrench,
  Anchor,
} from "lucide-vue-next";
import { useRouter, useRoute } from "#app";

const router = useRouter();
const route = useRoute();
const { notifications, fetchNotifications } = useDashboard();
const { canAccessPath, ensureRolesLoaded } = useRoleAccess();

// Check route meta to show/hide header
const showHeader = computed(() => route.meta.hideHeader !== true);

// Use client-only for time to avoid hydration mismatch
const currentDate = ref("");
const currentTime = ref("");

// Global search state
const searchQuery = ref("");
const searchResults = ref<
  {
    type: "job" | "company" | "invoice" | "payment" | "service" | "vessel";
    id: string;
    title: string;
    subtitle: string;
  }[]
>([]);
const isSearching = ref(false);
const showDropdown = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);
const notificationContainerRef = ref<HTMLElement | null>(null);
const showNotifications = ref(false);
const isNotificationsLoading = ref(false);
const hasFetchedNotifications = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const canViewActivityLogs = computed(() => canAccessPath("/settings/activity-logs"));

const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

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

// Debounced search function
const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  isSearching.value = true;
  try {
    const config = useRuntimeConfig();
    const results: {
      type: "job" | "company" | "invoice" | "payment" | "service" | "vessel";
      id: string;
      title: string;
      subtitle: string;
    }[] = [];

    try {
      const companiesResponse = await $fetch<unknown>(`${config.public.apiBase}/master/companies`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        query: { search: query, limit: 5 },
      });

      const companiesArray: {
        id: string;
        name: string;
        isVendor?: boolean;
        isCustomer?: boolean;
      }[] = Array.isArray(companiesResponse)
        ? companiesResponse
        : (companiesResponse as { data?: unknown[] })?.data || [];

      if (companiesArray && companiesArray.length > 0) {
        companiesArray.forEach((company) => {
          results.push({
            type: "company",
            id: company.id,
            title: company.name,
            subtitle: company.isVendor ? "Vendor" : company.isCustomer ? "Customer" : "Company",
          });
        });
      }
    } catch {
      // Ignore company search errors
    }

    // Search jobs - filter client-side since API doesn't support search parameter
    try {
      console.log("[SEARCH] Calling jobs API (fetching all jobs for client-side filtering)");
      const jobsResponse = await $fetch<
        {
          id: string;
          jobNumber: string;
          pol: string;
          pod: string;
          customer?: { name: string };
        }[]
      >(`${config.public.apiBase}/operational/jobs`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("[SEARCH] Jobs API response count:", jobsResponse?.length || 0);

      // Filter jobs client-side since API doesn't support search
      if (jobsResponse && Array.isArray(jobsResponse)) {
        const queryLower = query.toLowerCase();
        const filteredJobs = jobsResponse
          .filter((job) => {
            return (
              job.jobNumber?.toLowerCase().includes(queryLower) ||
              job.pol?.toLowerCase().includes(queryLower) ||
              job.pod?.toLowerCase().includes(queryLower) ||
              job.customer?.name?.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5);

        console.log("[SEARCH] Filtered jobs count:", filteredJobs.length);
        filteredJobs.forEach((job) => {
          results.push({
            type: "job",
            id: job.id,
            title: job.jobNumber,
            subtitle: `${job.pol} → ${job.pod}`,
          });
        });
      }
    } catch (error) {
      console.error("[SEARCH] Jobs API error:", error);
      // Ignore job search errors
    }

    // Search invoices (filter client-side since API may not support search)
    try {
      const invoicesResponse = await $fetch<
        {
          id: string;
          invoiceNumber: string;
          customer?: { name: string } | string;
          total?: number;
        }[]
      >(`${config.public.apiBase}/finance/invoice`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (invoicesResponse && Array.isArray(invoicesResponse)) {
        const queryLower = query.toLowerCase();
        const filteredInvoices = invoicesResponse
          .filter((invoice) => {
            const customerName =
              typeof invoice.customer === "object" ? invoice.customer?.name : invoice.customer;
            return (
              invoice.invoiceNumber?.toLowerCase().includes(queryLower) ||
              customerName?.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5);

        filteredInvoices.forEach((invoice) => {
          const customerName =
            typeof invoice.customer === "object" ? invoice.customer?.name : invoice.customer;
          results.push({
            type: "invoice",
            id: invoice.id,
            title: invoice.invoiceNumber,
            subtitle: customerName || "Invoice",
          });
        });
      }
    } catch {
      // Ignore invoice search errors
    }

    // Search payments (filter client-side since API may not support search)
    try {
      const paymentsResponse = await $fetch<
        { id: string; paymentNumber: string; customer?: { name: string } | string }[]
      >(`${config.public.apiBase}/finance/payment`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (paymentsResponse && Array.isArray(paymentsResponse)) {
        const queryLower = query.toLowerCase();
        const filteredPayments = paymentsResponse
          .filter((payment) => {
            const customerName =
              typeof payment.customer === "object" ? payment.customer?.name : payment.customer;
            return (
              payment.paymentNumber?.toLowerCase().includes(queryLower) ||
              customerName?.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5);

        filteredPayments.forEach((payment) => {
          const customerName =
            typeof payment.customer === "object" ? payment.customer?.name : payment.customer;
          results.push({
            type: "payment",
            id: payment.id,
            title: payment.paymentNumber,
            subtitle: customerName || "Payment",
          });
        });
      }
    } catch {
      // Ignore payment search errors
    }

    // Search services
    try {
      const servicesResponse = await $fetch<{ id: string; name: string; code?: string }[]>(
        `${config.public.apiBase}/master/services`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (servicesResponse && Array.isArray(servicesResponse)) {
        const queryLower = query.toLowerCase();
        const filteredServices = servicesResponse
          .filter((service) => {
            return (
              service.name?.toLowerCase().includes(queryLower) ||
              service.code?.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5);

        filteredServices.forEach((service) => {
          results.push({
            type: "service",
            id: service.id,
            title: service.name,
            subtitle: service.code || "Service",
          });
        });
      }
    } catch {
      // Ignore service search errors
    }

    // Search vessels
    try {
      const vesselsResponse = await $fetch<{ id: string; name: string; imoNumber?: string }[]>(
        `${config.public.apiBase}/master/vessels`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (vesselsResponse && Array.isArray(vesselsResponse)) {
        const queryLower = query.toLowerCase();
        const filteredVessels = vesselsResponse
          .filter((vessel) => {
            return (
              vessel.name?.toLowerCase().includes(queryLower) ||
              vessel.imoNumber?.toLowerCase().includes(queryLower)
            );
          })
          .slice(0, 5);

        filteredVessels.forEach((vessel) => {
          results.push({
            type: "vessel",
            id: vessel.id,
            title: vessel.name,
            subtitle: vessel.imoNumber || "Vessel",
          });
        });
      }
    } catch {
      // Ignore vessel search errors
    }

    searchResults.value = results;
    showDropdown.value = results.length > 0;
  } catch {
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Handle input change with debounce
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    performSearch(searchQuery.value);
  }, 300);
};

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    showDropdown.value = false;
    searchInputRef.value?.blur();
  }
};

const handleResultClick = (result: { type: string; id: string }) => {
  showDropdown.value = false;
  searchQuery.value = "";
  searchResults.value = [];

  switch (result.type) {
    case "job":
      router.push(`/operational/jobs?id=${result.id}`);
      break;
    case "company":
      router.push(`/master/company?id=${result.id}`);
      break;
    case "invoice":
      router.push(`/finance/invoice/${result.id}`);
      break;
    case "payment":
      router.push(`/finance/payment/${result.id}`);
      break;
    case "service":
      router.push(`/master/services/${result.id}`);
      break;
    case "vessel":
      router.push(`/master/vessel?id=${result.id}`);
      break;
    default:
      break;
  }
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;

  if (!showNotifications.value || hasFetchedNotifications.value) {
    return;
  }

  isNotificationsLoading.value = true;
  try {
    await fetchNotifications();
    hasFetchedNotifications.value = true;
  } finally {
    isNotificationsLoading.value = false;
  }
};

const handleNotificationClick = (notification: { targetModel: string; targetId: string }) => {
  showNotifications.value = false;

  switch (notification.targetModel) {
    case "Job":
      router.push(`/operational/jobs/${notification.targetId}`);
      break;
    case "Company":
      router.push(`/master/company?id=${notification.targetId}`);
      break;
    case "Invoice":
      router.push(`/finance/invoice/${notification.targetId}`);
      break;
    case "Payment":
      router.push(`/finance/payment/${notification.targetId}`);
      break;
    default:
      if (canViewActivityLogs.value) {
        router.push("/settings/activity-logs");
      }
      break;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (searchContainerRef.value && !searchContainerRef.value.contains(target)) {
    showDropdown.value = false;
  }
  if (notificationContainerRef.value && !notificationContainerRef.value.contains(target)) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000);
  ensureRolesLoaded();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  document.removeEventListener("click", handleClickOutside);
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
        v-if="showHeader"
        class="sticky top-0 z-[1000] h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6"
      >
        <ClientOnly>
          <div ref="searchContainerRef" class="relative max-w-md flex-1">
            <!-- LOG CHECK: VERSION 1.2 -->
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Type a command for search..."
              class="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#012D5A] placeholder:text-gray-400"
              @input="handleSearchInput"
              @keydown="handleSearchKeydown"
              @focus="searchQuery && performSearch(searchQuery)"
            />
            <button
              v-if="searchQuery"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="
                searchQuery = '';
                searchResults = [];
                showDropdown = false;
              "
            >
              <X class="w-3 h-3" />
            </button>

            <!-- Search Dropdown -->
            <div
              v-if="showDropdown && searchResults.length > 0"
              class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
              <div v-if="isSearching" class="p-4 text-center text-gray-500">
                <div
                  class="w-4 h-4 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin mx-auto"
                ></div>
                <span class="text-xs mt-2 block">Searching...</span>
              </div>
              <template v-else>
                <button
                  v-for="result in searchResults"
                  :key="`${result.type}-${result.id}`"
                  class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                  @click="handleResultClick(result)"
                >
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    :class="{
                      'bg-blue-50': result.type === 'job',
                      'bg-green-50': result.type === 'company',
                      'bg-purple-50': result.type === 'invoice',
                      'bg-amber-50': result.type === 'payment',
                      'bg-cyan-50': result.type === 'service',
                      'bg-indigo-50': result.type === 'vessel',
                    }"
                  >
                    <Briefcase v-if="result.type === 'job'" class="w-4 h-4 text-blue-600" />
                    <Building2
                      v-else-if="result.type === 'company'"
                      class="w-4 h-4 text-green-600"
                    />
                    <FileText
                      v-else-if="result.type === 'invoice'"
                      class="w-4 h-4 text-purple-600"
                    />
                    <CreditCard
                      v-else-if="result.type === 'payment'"
                      class="w-4 h-4 text-amber-600"
                    />
                    <Wrench v-else-if="result.type === 'service'" class="w-4 h-4 text-cyan-600" />
                    <Anchor v-else-if="result.type === 'vessel'" class="w-4 h-4 text-indigo-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ result.title }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ result.subtitle }}
                    </p>
                  </div>
                </button>
              </template>
            </div>
          </div>
        </ClientOnly>

        <div class="flex items-center gap-4">
          <div ref="notificationContainerRef" class="relative">
            <button
              class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click.stop="toggleNotifications"
            >
              <Bell class="w-5 h-5 text-gray-500" />
              <span
                v-if="notifications.length > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button>

            <div
              v-if="showNotifications"
              class="absolute right-0 top-full mt-2 w-[360px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
            >
              <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">Notifications</p>
                  <p class="text-xs text-gray-500">Recent dashboard activities</p>
                </div>
                <button
                  v-if="canViewActivityLogs"
                  class="text-xs font-medium text-[#012D5A] hover:underline"
                  @click="
                    showNotifications = false;
                    router.push('/settings/activity-logs');
                  "
                >
                  View all
                </button>
              </div>

              <div
                v-if="isNotificationsLoading"
                class="px-4 py-6 text-center text-sm text-gray-500"
              >
                Loading notifications...
              </div>

              <div
                v-else-if="notifications.length === 0"
                class="px-4 py-6 text-center text-sm text-gray-500"
              >
                No recent notifications
              </div>

              <div v-else class="max-h-[420px] overflow-y-auto">
                <button
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="mt-1 size-2 shrink-0 rounded-full bg-[#012D5A]"></div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">
                      <p class="truncate text-sm font-medium text-gray-900">
                        {{ notification.title }}
                      </p>
                      <span class="shrink-0 text-[11px] text-gray-400">
                        {{ formatNotificationTime(notification.createdAt) }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ notification.description }}
                    </p>
                    <p class="mt-1 text-[11px] font-medium text-gray-400">
                      {{ notification.actorName }}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ currentDate }}</p>
            <p class="text-xs text-gray-500">{{ currentTime }}</p>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main>
        <NuxtPage :key="$route.fullPath" />
      </main>
    </div>

    <UiConfirmDialog />
  </div>
</template>
