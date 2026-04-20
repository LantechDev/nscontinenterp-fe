import type { OverviewStats, ChartData, StatsResult } from "~/types/finance";
import { useFinanceDashboardApi } from "./useFinanceDashboardApi";

// Singleton state for overview tab data
const overviewStats = ref<OverviewStats | null>(null);
const chartData = ref<ChartData | null>(null);
const stats = ref<StatsResult | null>(null);

export const useFinanceDashboardOverview = () => {
  const {
    baseUrl,
    setLoading,
    setError,
    clearError,
    getNextRequestId,
    isLatestRequest,
    getSignal,
    getErrorMessage,
    buildQueryParams,
  } = useFinanceDashboardApi();

  /**
   * Fetch main stats (cards)
   */
  async function fetchStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<StatsResult | null> {
    const requestId = getNextRequestId("stats");

    setLoading(true);
    clearError("stats", requestId);

    try {
      const queryParams = buildQueryParams(period, year);
      const signal = getSignal("stats");

      const data = await $fetch<StatsResult>(`${baseUrl}/finance/dashboard/stats`, {
        method: "GET",
        query: queryParams,
        signal,
      });
      console.log("[FE_TRACE] Stats response:", data);

      if (isLatestRequest("stats", requestId)) stats.value = data;
      return data;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return null;
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
      const signal = getSignal("overview");

      const data = await $fetch<OverviewStats>(`${baseUrl}/finance/dashboard/overview`, {
        method: "GET",
        query: queryParams,
        signal,
      });

      if (isLatestRequest("overview", requestId)) overviewStats.value = data;
      return data;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return null;
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
      const signal = getSignal("charts");

      const data = await $fetch<ChartData>(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        signal,
      });

      if (isLatestRequest("charts", requestId)) chartData.value = data;
      return data;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return null;
      const message = getErrorMessage(err);
      console.error("Failed to fetch chart data:", message);
      setError("charts", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("charts", requestId)) setLoading(false);
    }
  }

  return {
    // State (Singletons)
    overviewStats,
    chartData,
    stats,

    // Methods
    fetchStats,
    fetchOverviewStats,
    fetchChartData,
  };
};
