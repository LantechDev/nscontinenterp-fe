import type { FinanceDashboardStats, OverviewStats, ChartData } from "~/types/finance-dashboard";
import { getErrorMessage } from "./useFinanceDashboardApi";

// Shared state singletons to ensure consistency across the dashboard
const stats = ref<FinanceDashboardStats | null>(null);
const overviewStats = ref<OverviewStats | null>(null);
const chartData = ref<ChartData | null>(null);

/**
 * Finance Dashboard Overview Composable
 * Provides stats, overview, and charts fetching functionality
 */
export function useFinanceDashboardOverview() {
  const {
    baseUrl,
    isLoading: _isLoading,
    error: _error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams,
  } = useFinanceDashboardApi();

  /**
   * Fetch summary stats (for card display)
   */
  async function fetchStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<FinanceDashboardStats | null> {
    const requestId = getNextRequestId("stats");

    setLoading(true);
    clearError("stats", requestId);

    try {
      const queryParams = buildQueryParams(period, year);

      const data = await $fetch<FinanceDashboardStats>(`${baseUrl}/finance/dashboard`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("[FE_TRACE] Stats response:", data);

      if (isLatestRequest("stats", requestId)) stats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch stats:", message);
      setError("stats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("stats", requestId)) setLoading(false);
    }
  }

  /**
   * Fetch overview statistics
   */
  async function fetchOverviewStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<OverviewStats | null> {
    const requestId = getNextRequestId("overview");

    setLoading(true);
    clearError("overview", requestId);

    try {
      const queryParams = buildQueryParams(period, year);

      const data = await $fetch<OverviewStats>(`${baseUrl}/finance/dashboard/overview`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (isLatestRequest("overview", requestId)) overviewStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch overview stats:", message);
      setError("overview", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("overview", requestId)) setLoading(false);
    }
  }

  /**
   * Fetch chart data
   */
  async function fetchChartData(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<ChartData | null> {
    const requestId = getNextRequestId("charts");

    setLoading(true);
    clearError("charts", requestId);

    try {
      const queryParams = buildQueryParams(period, year);

      const data = await $fetch<ChartData>(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (isLatestRequest("charts", requestId)) chartData.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch chart data:", message);
      setError("charts", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("charts", requestId)) setLoading(false);
    }
  }

  return {
    stats,
    overviewStats,
    chartData,
    fetchStats,
    fetchOverviewStats,
    fetchChartData,
  };
}
