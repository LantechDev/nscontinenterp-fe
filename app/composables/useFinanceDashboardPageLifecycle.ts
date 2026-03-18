/**
 * Finance Dashboard Page Lifecycle Composable
 * Handles lifecycle events for the finance dashboard page
 */
import { onMounted, onUnmounted, watch } from "vue";
import { useAuth } from "./useAuth";
import type { TabName } from "~/types/finance";
import type { PeriodType } from "~/types/finance";

export function useFinanceDashboardPageLifecycle(
  fetchDataForTab: () => Promise<void>,
  loadCustomers: () => Promise<void>,
  loadServices: () => Promise<void>,
  activeTab: { value: TabName },
  selectedPeriod: { value: PeriodType },
  resetPage: () => void,
  arApToggle: { value: string },
) {
  // Lifecycle
  onMounted(async () => {
    // In a real implementation, we would add event listeners here
    // For now, we'll just initialize data
    try {
      const { session } = useAuth();
      console.log("[FE_TRACE] Active Org ID:", session.value?.activeOrganizationId);
    } catch {
      /* ignore */
    }
    await Promise.all([loadCustomers(), loadServices()]);
    await fetchDataForTab();
  });

  onUnmounted(() => {
    // Remove event listeners if any were added
    // document.removeEventListener("click", handleClickOutside);
  });

  watch(arApToggle, async () => {
    if (activeTab.value === "Accounts Receivable") {
      resetPage();
      await fetchDataForTab();
    }
  });
}
