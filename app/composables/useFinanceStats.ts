import type { FinanceDashboardStats } from "~/types/finance-dashboard";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

/**
 * Finance Dashboard Stats Composable
 * Handles fetching COGS stats (fetchStats)
 */
export function useFinanceStats() {
  const baseUrl = "/api";

  let currentRequestId = 0;

  const isLoading = ref(false);
  const stats = ref<FinanceDashboardStats | null>(null);
  const error = ref<string | null>(null);

  async function fetchStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
    forcedRequestId?: number,
  ): Promise<FinanceDashboardStats | null> {
    const requestId = forcedRequestId ?? ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) {
        queryParams.year = year;
      }

      const data = await $fetch<FinanceDashboardStats>(`${baseUrl}/finance/dashboard`, {
        method: "GET",
        query: queryParams,
      });

      if (requestId === currentRequestId) {
        stats.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance dashboard stats:", message);
      if (requestId === currentRequestId) {
        error.value = message;
      }
      return null;
    } finally {
      if (requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  return {
    isLoading,
    stats,
    error,
    fetchStats,
  };
}
