import type { FinanceCloseStats, FinanceClosePeriod } from "~/types/finance-dashboard";
import { getErrorMessage } from "./useFinanceDashboardApi";

// Shared state singletons to ensure consistency across the dashboard
const financeCloseStats = ref<FinanceCloseStats | null>(null);
const closedPeriods = ref<FinanceClosePeriod[]>([]);

/**
 * Finance Dashboard Finance Close Composable
 * Provides finance close and closed periods fetching
 */
export function useFinanceDashboardFinanceClose() {
  const {
    baseUrl,
    isLoading: _isLoading,
    error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
    buildQueryParams,
  } = useFinanceDashboardApi();

  /**
   * Fetch finance close stats
   */
  async function fetchFinanceCloseStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<FinanceCloseStats | null> {
    const requestId = getNextRequestId("financeClose");

    setLoading(true);
    clearError("financeClose", requestId);

    try {
      const queryParams = buildQueryParams(period, year);

      const data = await $fetch<FinanceCloseStats>(`${baseUrl}/finance/dashboard/finance-close`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (isLatestRequest("financeClose", requestId)) financeCloseStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance close stats:", message);
      setError("financeClose", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("financeClose", requestId)) setLoading(false);
    }
  }

  /**
   * Fetch closed periods
   */
  async function fetchClosedPeriods(): Promise<FinanceClosePeriod[] | null> {
    const requestId = getNextRequestId("closedPeriods");

    setLoading(true);
    clearError("closedPeriods", requestId);

    try {
      const data = await $fetch<FinanceClosePeriod[]>(
        `${baseUrl}/finance/dashboard/finance-close/periods`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (isLatestRequest("closedPeriods", requestId)) closedPeriods.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch closed periods:", message);
      setError("closedPeriods", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("closedPeriods", requestId)) setLoading(false);
    }
  }

  /**
   * Close a period
   */
  async function closePeriod(
    periodId: string,
    notes?: string,
  ): Promise<{ success: boolean; message: string }> {
    setLoading(true);
    clearError("financeClose", 0);

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/close`, {
        method: "POST",
        body: { notes },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period closed successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to close period:", message);
      error.value = message;
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }

  /**
   * Reopen a period
   */
  async function reopenPeriod(periodId: string): Promise<{ success: boolean; message: string }> {
    setLoading(true);
    clearError("financeClose", 0);

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/reopen`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period reopened successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to reopen period:", message);
      error.value = message;
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }

  return {
    financeCloseStats,
    closedPeriods,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  };
}
