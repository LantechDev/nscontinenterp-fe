/**
 * Finance Dashboard Page Handlers Composable
 * Handles event handlers for the finance dashboard page
 */
import type { TabName, PeriodType } from "~/types/finance";
import { useFinanceDashboardPageState } from "./useFinanceDashboardPageState";
import { useFinanceDashboardFilters } from "./useFinanceDashboardFilters";

export function useFinanceDashboardPageHandlers() {
  const { activeTab, selectedPeriod, currentPage, resetPage } = useFinanceDashboardPageState();
  const filters = useFinanceDashboardFilters();

  async function handlePeriodChange(period: PeriodType) {
    selectedPeriod.value = period;
    resetPage();
    // fetchDataForTab would be called from the main composable
  }

  async function handleTabChange(tab: TabName) {
    activeTab.value = tab;
    resetPage();
    // loadCustomers/loadServices and fetchDataForTab would be called from the main composable
  }

  async function handlePageChange(newPage: number) {
    currentPage.value = newPage;
    // fetchDataForTab would be called from the main composable
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) filters.closeAllDropdowns();
  }

  return {
    handlePeriodChange,
    handleTabChange,
    handlePageChange,
    handleClickOutside,
  };
}
