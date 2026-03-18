import type { PeriodType, TabName } from "~/types/finance";

// Shared state singletons to ensure consistency across the dashboard
const activeTab = ref<TabName>("Overview");
const selectedPeriod = ref<PeriodType>("month");
const currentPage = ref(1);
const isInitialized = ref(false);

/**
 * Finance Dashboard Page State Composable
 * Provides common state management for the dashboard page
 * including active tab, selected period, and pagination
 */
export function useFinanceDashboardPageState() {
  const route = useRoute();
  const router = useRouter();

  // Initialize from URL on first use
  if (!isInitialized.value) {
    if (route.query.tab) {
      activeTab.value = route.query.tab as TabName;
    }
    isInitialized.value = true;
  }

  // Sync activeTab with URL
  watch(activeTab, (newTab) => {
    router.replace({
      query: { ...route.query, tab: newTab },
    });
  });

  // Common state reset
  function resetPage(): void {
    currentPage.value = 1;
  }

  return {
    activeTab,
    selectedPeriod,
    currentPage,
    resetPage,
  };
}
