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
  ClipboardList,
} from "lucide-vue-next";
import { useRouter, useRoute } from "#app";

const router = useRouter();
const route = useRoute();
const { notifications, fetchNotifications } = useDashboard();
const { canAccessPath, ensureRolesLoaded } = useRoleAccess();
const isSidebarCollapsed = useState("dashboard-sidebar-collapsed", () => false);

// Check route meta to show/hide header
const showHeader = computed(() => route.meta.hideHeader !== true);

// Use client-only for time to avoid hydration mismatch
const currentDate = ref("");
const currentTime = ref("");

type SearchResultType =
  | "job"
  | "company"
  | "invoice"
  | "quotation"
  | "payment"
  | "service"
  | "vessel";

interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
}

// Category order + labels for grouped rendering
const CATEGORY_ORDER: SearchResultType[] = [
  "job",
  "quotation",
  "company",
  "invoice",
  "service",
  "vessel",
];
const CATEGORY_LABELS: Record<SearchResultType, string> = {
  job: "Jobs",
  quotation: "Quotations",
  company: "Companies",
  invoice: "Invoices",
  service: "Services",
  vessel: "Vessels",
  payment: "Payments",
};

// Global search state
const searchQuery = ref("");
const searchResults = ref<SearchResult[]>([]);
const isSearching = ref(false);
const showDropdown = ref(false);
const hasSearched = ref(false);
const activeIndex = ref(0);

// Rank results: entries whose title/subtitle START WITH the query come first
const rankResults = (results: SearchResult[], query: string): SearchResult[] => {
  const q = query.toLowerCase();
  const score = (r: SearchResult) => {
    const title = r.title.toLowerCase();
    if (title === q) return 0;
    if (title.startsWith(q)) return 1;
    if (title.includes(q)) return 2;
    if (r.subtitle.toLowerCase().startsWith(q)) return 3;
    return 4;
  };
  return results.toSorted((a, b) => score(a) - score(b));
};

// Grouped + flattened views (flat list drives keyboard navigation)
const groupedResults = computed(() =>
  CATEGORY_ORDER.map((type) => ({
    type,
    label: CATEGORY_LABELS[type],
    items: searchResults.value.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0),
);
const flatResults = computed(() => groupedResults.value.flatMap((g) => g.items));
const flatIndexOf = (result: SearchResult) =>
  flatResults.value.findIndex((r) => r.type === result.type && r.id === result.id);

// Split a string into matched / unmatched parts for highlighting
const highlightParts = (text: string): { text: string; hit: boolean }[] => {
  const q = searchQuery.value.trim();
  if (!q || !text) return [{ text: text || "", hit: false }];
  const lower = text.toLowerCase();
  const lq = q.toLowerCase();
  const parts: { text: string; hit: boolean }[] = [];
  let i = 0;
  let idx = lower.indexOf(lq, i);
  while (idx !== -1) {
    if (idx > i) parts.push({ text: text.slice(i, idx), hit: false });
    parts.push({ text: text.slice(idx, idx + q.length), hit: true });
    i = idx + q.length;
    idx = lower.indexOf(lq, i);
  }
  if (i < text.length) parts.push({ text: text.slice(i), hit: false });
  return parts;
};
const searchInputRef = ref<HTMLInputElement | null>(null);
const notificationContainerRef = ref<HTMLElement | null>(null);
// Shared palette state — also togglable from pages that hide the header
const { isOpen: isSearchModalOpen } = useGlobalSearch();
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

// Unwrap list endpoints that return either a bare array or a { items: [...] } shape
const asList = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Array.isArray((value as { items?: unknown[] }).items)) {
    return (value as { items: unknown[] }).items;
  }
  return [];
};

// Debounced search function
const performSearch = async (query: string) => {
  const q = query.trim();
  if (!q || q.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    hasSearched.value = false;
    return;
  }

  isSearching.value = true;
  showDropdown.value = true;
  const results: SearchResult[] = [];

  try {
    // Parallelize search requests across all searchable modules
    const [companiesRes, jobsRes, invoicesRes, quotationsRes, servicesRes, vesselsRes] =
      await Promise.allSettled([
        $fetch<unknown>(`/api/master/companies`, { query: { search: q, limit: 5, type: "ALL" } }),
        $fetch<unknown>(`/api/operational/jobs`, { query: { search: q, limit: 5 } }),
        $fetch<unknown>(`/api/finance/invoice`, { query: { search: q, limit: 5 } }),
        $fetch<unknown>(`/api/operational/quotations`, { query: { search: q, limit: 5 } }),
        $fetch<unknown>(`/api/master/services`, { query: { search: q } }),
        $fetch<unknown>(`/api/master/vessels`, { query: { search: q } }),
      ]);

    // 1. Jobs
    if (jobsRes.status === "fulfilled") {
      asList(jobsRes.value)
        .slice(0, 5)
        .forEach((job) => {
          const j = job as {
            id: string;
            jobNumber: string;
            polName?: string;
            pol?: string;
            podName?: string;
            pod?: string;
            customer?: { name?: string };
          };
          results.push({
            type: "job",
            id: j.id,
            title: j.jobNumber,
            subtitle: `${j.polName || j.pol || "-"} → ${j.podName || j.pod || "-"}`,
          });
        });
    }

    // 2. Quotations
    if (quotationsRes.status === "fulfilled") {
      asList(quotationsRes.value)
        .slice(0, 5)
        .forEach((quotation) => {
          const qo = quotation as { id: string; number: string; customerName?: string | null };
          results.push({
            type: "quotation",
            id: qo.id,
            title: qo.number,
            subtitle: qo.customerName || "Quotation",
          });
        });
    }

    // 3. Companies
    if (companiesRes.status === "fulfilled") {
      asList(companiesRes.value)
        .slice(0, 5)
        .forEach((company) => {
          const c = company as {
            id: string;
            name: string;
            isVendor?: boolean;
            isCustomer?: boolean;
          };
          results.push({
            type: "company",
            id: c.id,
            title: c.name,
            subtitle: c.isVendor ? "Vendor" : c.isCustomer ? "Customer" : "Company",
          });
        });
    }

    // 4. Invoices
    if (invoicesRes.status === "fulfilled") {
      asList(invoicesRes.value)
        .slice(0, 5)
        .forEach((invoice) => {
          const inv = invoice as {
            id: string;
            invoiceNumber: string;
            company?: { name?: string };
          };
          results.push({
            type: "invoice",
            id: inv.id,
            title: inv.invoiceNumber,
            subtitle: inv.company?.name || "Invoice",
          });
        });
    }

    // 5. Services
    if (servicesRes.status === "fulfilled") {
      asList(servicesRes.value)
        .slice(0, 5)
        .forEach((service) => {
          const s = service as {
            id: string;
            code?: string;
            name: string;
            category?: { name?: string } | null;
          };
          results.push({
            type: "service",
            id: s.id,
            title: s.code ? `${s.code} — ${s.name}` : s.name,
            subtitle: s.category?.name || "Service",
          });
        });
    }

    // 6. Vessels
    if (vesselsRes.status === "fulfilled") {
      asList(vesselsRes.value)
        .slice(0, 5)
        .forEach((vessel) => {
          const v = vessel as { id: string; name: string; imoNumber?: string | null };
          results.push({
            type: "vessel",
            id: v.id,
            title: v.name,
            subtitle: v.imoNumber ? `IMO ${v.imoNumber}` : "Vessel",
          });
        });
    }

    searchResults.value = rankResults(results, q);
    activeIndex.value = 0;
    hasSearched.value = true;
  } catch (error) {
    console.error("[SEARCH] Search error:", error);
    searchResults.value = [];
    hasSearched.value = true;
  } finally {
    isSearching.value = false;
  }
};

// Handle input change with debounce
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  activeIndex.value = 0;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    performSearch(searchQuery.value);
  }, 300);
};

const scrollActiveIntoView = () => {
  nextTick(() => {
    const el = document.getElementById(`gs-item-${activeIndex.value}`);
    el?.scrollIntoView({ block: "nearest" });
  });
};

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeSearchModal();
    return;
  }

  if (!isSearchModalOpen.value || flatResults.value.length === 0) return;
  const n = flatResults.value.length;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % n;
    scrollActiveIntoView();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + n) % n;
    scrollActiveIntoView();
  } else if (event.key === "Enter") {
    event.preventDefault();
    const active = flatResults.value[activeIndex.value];
    if (active) handleResultClick(active);
  }
};

const handleResultClick = (result: { type: string; id: string }) => {
  isSearchModalOpen.value = false;
  showDropdown.value = false;
  searchQuery.value = "";
  searchResults.value = [];
  hasSearched.value = false;
  activeIndex.value = 0;

  switch (result.type) {
    case "job":
      router.push(`/operational/jobs?id=${result.id}`);
      break;
    case "quotation":
      router.push(`/operational/quotations?id=${result.id}`);
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
  if (notificationContainerRef.value && !notificationContainerRef.value.contains(target)) {
    showNotifications.value = false;
  }
};

const openSearchModal = () => {
  isSearchModalOpen.value = true;
};

const closeSearchModal = () => {
  isSearchModalOpen.value = false;
};

// React to palette open/close (works whether triggered from the header,
// a page's search button, or the ⌘K / "/" shortcut)
watch(isSearchModalOpen, (open) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (open) {
    nextTick(() => {
      searchInputRef.value?.focus();
      if (searchQuery.value.trim()) performSearch(searchQuery.value);
    });
  } else {
    showDropdown.value = false;
    searchQuery.value = "";
    searchResults.value = [];
    hasSearched.value = false;
    activeIndex.value = 0;
  }
});

// Global shortcut: Cmd/Ctrl+K opens the search palette (also "/" when not already typing)
const handleGlobalKeydown = (event: KeyboardEvent) => {
  const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (isShortcut) {
    event.preventDefault();
    if (isSearchModalOpen.value) closeSearchModal();
    else openSearchModal();
    return;
  }

  if (event.key === "Escape" && isSearchModalOpen.value) {
    closeSearchModal();
    return;
  }

  if (event.key === "/") {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    const isTyping = tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable === true;
    if (!isTyping) {
      event.preventDefault();
      openSearchModal();
    }
  }
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000);
  ensureRolesLoaded();
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <LayoutAppSidebar />

    <!-- Main content area -->
    <div
      :class="
        isSidebarCollapsed
          ? 'ml-20 transition-[margin] duration-300'
          : 'ml-64 transition-[margin] duration-300'
      "
    >
      <!-- Top header -->
      <header
        v-if="showHeader"
        class="sticky top-0 z-[1000] h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6"
      >
        <ClientOnly>
          <!-- Search trigger (opens the Spotlight-style palette) -->
          <LayoutGlobalSearchButton class="max-w-md flex-1" />
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

      <!-- Spotlight-style search palette — rendered outside the header so it also
           works on pages that hide the header (finance dashboard, quotations, ...) -->
      <ClientOnly>
        <Teleport to="body">
          <Transition name="gs-fade">
            <div v-if="isSearchModalOpen" class="fixed inset-0 z-[3000]">
              <!-- Backdrop -->
              <div
                class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                @click="closeSearchModal"
              />

              <!-- Panel -->
              <div class="absolute left-1/2 top-[14vh] -translate-x-1/2 w-[92vw] max-w-xl">
                <div class="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
                  <!-- Input row -->
                  <div class="relative flex items-center border-b border-gray-100">
                    <Search
                      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                      ref="searchInputRef"
                      v-model="searchQuery"
                      type="text"
                      placeholder="Cari job, quotation, customer, invoice, vessel..."
                      class="w-full pl-12 pr-14 py-4 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
                      @input="handleSearchInput"
                      @keydown="handleSearchKeydown"
                    />
                    <button
                      v-if="searchQuery"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      @click="
                        searchQuery = '';
                        searchResults = [];
                        hasSearched = false;
                        activeIndex = 0;
                        searchInputRef?.focus();
                      "
                    >
                      <X class="w-4 h-4" />
                    </button>
                    <kbd
                      v-else
                      class="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-semibold leading-none text-gray-400"
                      >esc</kbd
                    >
                  </div>

                  <!-- Results scroll area -->
                  <div class="max-h-[60vh] overflow-y-auto">
                    <!-- Idle hint (empty query) -->
                    <div v-if="!searchQuery.trim()" class="px-4 py-10 text-center">
                      <p class="text-sm text-gray-500">Ketik untuk mencari di seluruh sistem</p>
                      <p class="text-xs text-gray-400 mt-1">
                        Jobs · Quotations · Companies · Invoices · Services · Vessels
                      </p>
                    </div>

                    <!-- Loading -->
                    <div v-else-if="isSearching" class="p-6 text-center text-gray-500">
                      <div
                        class="w-5 h-5 border-2 border-[#012D5A] border-t-transparent rounded-full animate-spin mx-auto"
                      ></div>
                      <span class="text-xs mt-2 block">Searching...</span>
                    </div>

                    <!-- Empty state -->
                    <div
                      v-else-if="hasSearched && flatResults.length === 0"
                      class="px-4 py-8 text-center"
                    >
                      <p class="text-sm text-gray-500">
                        Tidak ada hasil untuk
                        <span class="font-medium text-gray-700">"{{ searchQuery }}"</span>
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        Coba kata kunci lain — no job, PO, customer, invoice, quotation, vessel
                      </p>
                    </div>

                    <!-- Grouped results -->
                    <template v-else>
                      <div v-for="group in groupedResults" :key="group.type">
                        <div
                          class="sticky top-0 z-10 flex items-center justify-between px-4 py-1.5 bg-gray-50/95 backdrop-blur border-b border-gray-100"
                        >
                          <span
                            class="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                          >
                            {{ group.label }}
                          </span>
                          <span class="text-[10px] font-medium text-gray-400">{{
                            group.items.length
                          }}</span>
                        </div>
                        <button
                          v-for="result in group.items"
                          :id="`gs-item-${flatIndexOf(result)}`"
                          :key="`${result.type}-${result.id}`"
                          class="w-full px-4 py-2.5 flex items-start gap-3 transition-colors text-left"
                          :class="
                            flatIndexOf(result) === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                          "
                          @click="handleResultClick(result)"
                          @mouseenter="activeIndex = flatIndexOf(result)"
                        >
                          <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            :class="{
                              'bg-blue-50': result.type === 'job',
                              'bg-orange-50': result.type === 'quotation',
                              'bg-green-50': result.type === 'company',
                              'bg-purple-50': result.type === 'invoice',
                              'bg-amber-50': result.type === 'payment',
                              'bg-cyan-50': result.type === 'service',
                              'bg-indigo-50': result.type === 'vessel',
                            }"
                          >
                            <Briefcase v-if="result.type === 'job'" class="w-4 h-4 text-blue-600" />
                            <ClipboardList
                              v-else-if="result.type === 'quotation'"
                              class="w-4 h-4 text-orange-600"
                            />
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
                            <Wrench
                              v-else-if="result.type === 'service'"
                              class="w-4 h-4 text-cyan-600"
                            />
                            <Anchor
                              v-else-if="result.type === 'vessel'"
                              class="w-4 h-4 text-indigo-600"
                            />
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              <template v-for="(part, i) in highlightParts(result.title)" :key="i"
                                ><mark
                                  v-if="part.hit"
                                  class="bg-yellow-200/70 text-inherit rounded-sm px-0.5"
                                  >{{ part.text }}</mark
                                ><template v-else>{{ part.text }}</template></template
                              >
                            </p>
                            <p class="text-xs text-gray-500 truncate">
                              {{ result.subtitle }}
                            </p>
                          </div>
                        </button>
                      </div>
                    </template>
                  </div>

                  <!-- Keyboard hint footer -->
                  <div
                    class="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400"
                  >
                    <span class="flex items-center gap-1">
                      <kbd class="px-1 py-0.5 rounded border border-gray-200 bg-white">↑</kbd>
                      <kbd class="px-1 py-0.5 rounded border border-gray-200 bg-white">↓</kbd>
                      navigasi
                    </span>
                    <span class="flex items-center gap-1">
                      <kbd class="px-1 py-0.5 rounded border border-gray-200 bg-white">↵</kbd>
                      buka
                    </span>
                    <span class="flex items-center gap-1">
                      <kbd class="px-1 py-0.5 rounded border border-gray-200 bg-white">esc</kbd>
                      tutup
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
      </ClientOnly>

      <!-- Page content -->
      <main>
        <NuxtPage :key="$route.fullPath" />
      </main>
    </div>

    <UiConfirmDialog />
  </div>
</template>

<style scoped>
.gs-fade-enter-active,
.gs-fade-leave-active {
  transition: opacity 0.15s ease;
}
.gs-fade-enter-from,
.gs-fade-leave-to {
  opacity: 0;
}
</style>
