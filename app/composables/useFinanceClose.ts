import type { FinanceCloseStats, FinanceClosePeriod } from "~/types/finance-dashboard";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

/**
 * Finance Close Composable
 * Handles fetching and managing finance close data
 */
export function useFinanceClose() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  let currentRequestId = 0;

  const isLoading = ref(false);
  const financeCloseStats = ref<FinanceCloseStats | null>(null);
  const closedPeriods = ref<FinanceClosePeriod[]>([]);
  const error = ref<string | null>(null);

  async function fetchFinanceCloseStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<FinanceCloseStats | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) {
        queryParams.year = year;
      }

      const data = await $fetch<FinanceCloseStats>(`${baseUrl}/finance/dashboard/finance-close`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === currentRequestId) {
        financeCloseStats.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance close stats:", message);
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

  async function fetchClosedPeriods(): Promise<FinanceClosePeriod[] | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<FinanceClosePeriod[]>(
        `${baseUrl}/finance/dashboard/finance-close/periods`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (requestId === currentRequestId) {
        closedPeriods.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch closed periods:", message);
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

  async function closePeriod(periodId: string, notes?: string): Promise<boolean> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/close`, {
        method: "POST",
        body: { notes },
        credentials: "include",
      });

      // Refresh data after closing
      await fetchClosedPeriods();
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to close period:", message);
      if (requestId === currentRequestId) {
        error.value = message;
      }
      return false;
    } finally {
      if (requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  async function reopenPeriod(periodId: string): Promise<boolean> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/reopen`, {
        method: "POST",
        credentials: "include",
      });

      // Refresh data after reopening
      await fetchClosedPeriods();
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to reopen period:", message);
      if (requestId === currentRequestId) {
        error.value = message;
      }
      return false;
    } finally {
      if (requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  return {
    isLoading,
    financeCloseStats,
    closedPeriods,
    error,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  };
}
