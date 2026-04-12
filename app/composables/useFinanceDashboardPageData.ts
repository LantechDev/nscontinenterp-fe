/**
 * Finance Dashboard Page Data Composable
 * Handles data fetching logic for the finance dashboard page
 */
import { ref } from "vue";
import type { TabName, PeriodType } from "~/types/finance";
import { useFinanceDashboard } from "./useFinanceDashboard";
import { useCompanies } from "./useCompanies";
import { useServices } from "./useServices";

export function useFinanceDashboardPageData() {
  // Shared dashboard
  const dashboard = useFinanceDashboard();
  const { isLoading, error } = dashboard;

  // Companies & services
  const { companies, fetchCompanies } = useCompanies();
  const { services, fetchServices } = useServices();
  const isLoadingCustomers = ref(false);
  const isLoadingServices = ref(false);

  // Data fetching
  // eslint-disable-next-line unicorn/consistent-function-scoping
  async function fetchDataForTab(tab: TabName, _period: PeriodType) {
    switch (tab) {
      case "Overview": {
        // Overview data is fetched in useFinanceDashboardPageOverview
        break;
      }
      case "Transaction":
        // Transaction data is fetched in useFinanceDashboardPageTransactions
        break;
      case "Finance Close":
        // Finance close data is fetched in useFinanceDashboardPageFinanceClose
        break;
      case "Accounts Receivable":
        // AR/AP data is fetched in useFinanceDashboardPageArAp
        break;
    }
  }

  async function loadCustomers() {
    if (companies.value.length) return;
    isLoadingCustomers.value = true;
    try {
      await fetchCompanies({ type: "CUSTOMER" });
    } finally {
      isLoadingCustomers.value = false;
    }
  }

  async function loadServices() {
    if (services.value.length) return;
    isLoadingServices.value = true;
    try {
      await fetchServices();
    } finally {
      isLoadingServices.value = false;
    }
  }

  return {
    // State
    isLoading,
    error,
    companies,
    services,
    isLoadingCustomers,
    isLoadingServices,

    // Data fetching
    fetchDataForTab,
    loadCustomers,
    loadServices,
  };
}
