import { getErrorMessage } from "~/types/finance-dashboard";

export { getErrorMessage };

/**
 * Build query params with optional year
 * Moved to outer scope as it doesn't capture any variables from the composable
 */
function buildQueryParams(
  period: "day" | "week" | "month" | "year",
  year?: number,
  additionalParams?: Record<string, string | number>,
): Record<string, string | number> {
  const params: Record<string, string | number> = { period };
  if (year) params.year = year;
  if (additionalParams) {
    Object.assign(params, additionalParams);
  }
  return params;
}

// Shared state singletons to ensure consistency across all dashboard modules
const requestIds = {
  stats: ref(0),
  overview: ref(0),
  charts: ref(0),
  jobCosts: ref(0),
  transactions: ref(0),
  transactionStats: ref(0),
  financeClose: ref(0),
  closedPeriods: ref(0),
  arAp: ref(0),
  arApStats: ref(0),
  assets: ref(0),
  assetsStats: ref(0),
};

const isLoading = ref(false);
const error = ref<string | null>(null);

/**
 * Common API utilities for Finance Dashboard
 * Provides base URL, request tracking, and error handling
 */
export function useFinanceDashboardApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  /**
   * Increment request ID for a specific data type
   */
  function getNextRequestId(key: keyof typeof requestIds): number {
    return ++requestIds[key].value;
  }

  /**
   * Check if current request is still the latest
   */
  function isLatestRequest(key: keyof typeof requestIds, requestId: number): boolean {
    return requestId === requestIds[key].value;
  }

  /**
   * Set loading state
   */
  function setLoading(loading: boolean): void {
    isLoading.value = loading;
  }

  /**
   * Set error message
   */
  function setError(key: keyof typeof requestIds, requestId: number, message: string): void {
    if (isLatestRequest(key, requestId)) {
      error.value = message;
    }
  }

  /**
   * Clear error
   */
  function clearError(key: keyof typeof requestIds, requestId: number): void {
    if (isLatestRequest(key, requestId)) {
      error.value = null;
    }
  }

  return {
    baseUrl,
    requestIds,
    isLoading,
    error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams,
    getErrorMessage,
  };
}
