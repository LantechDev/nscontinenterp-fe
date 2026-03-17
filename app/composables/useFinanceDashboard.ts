import {
  getErrorMessage,
  type FinanceDashboardStats,
  type OverviewStats,
  type ChartData,
  type JobCostItem,
  type PaginationInfo,
  type JobCostBreakdownResponse,
  type TransactionItem,
  type TransactionStats,
  type TransactionsResponse,
  type FinanceCloseStats,
  type FinanceClosePeriod,
} from "~/types/finance-dashboard";

/**
 * Finance Dashboard Composable
 * Provides functions to fetch finance dashboard data from the API
 *
 * This composable combines multiple data fetching concerns:
 * - Stats (COGS)
 * - Overview
 * - Charts
 * - Job Costs
 * - Transactions
 * - Finance Close
 */
export function useFinanceDashboard() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  // Request tracking for each data type to support parallel calls
  const requestIds = {
    stats: ref(0),
    overview: ref(0),
    charts: ref(0),
    jobCosts: ref(0),
    transactions: ref(0),
    transactionStats: ref(0),
    financeClose: ref(0),
    closedPeriods: ref(0),
  };

  // Reactive state
  const isLoading = ref(false);
  const stats = ref<FinanceDashboardStats | null>(null);
  const overviewStats = ref<OverviewStats | null>(null);
  const chartData = ref<ChartData | null>(null);
  const jobCosts = ref<JobCostItem[]>([]);
  const transactions = ref<TransactionItem[]>([]);
  const transactionStats = ref<TransactionStats | null>(null);
  const financeCloseStats = ref<FinanceCloseStats | null>(null);
  const closedPeriods = ref<FinanceClosePeriod[]>([]);
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const error = ref<string | null>(null);

  /**
   * Fetch dashboard statistics (COGS)
   */
  async function fetchStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<FinanceDashboardStats | null> {
    const requestId = ++requestIds.stats.value;

    isLoading.value = true;
    error.value = null;

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) queryParams.year = year;

      const data = await $fetch<FinanceDashboardStats>(`${baseUrl}/finance/dashboard`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });
      console.log("[FE_TRACE] Stats response:", data);

      if (requestId === requestIds.stats.value) stats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch stats:", message);
      if (requestId === requestIds.stats.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.stats.value) isLoading.value = false;
    }
  }

  /**
   * Fetch overview statistics
   */
  async function fetchOverviewStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<OverviewStats | null> {
    const requestId = ++requestIds.overview.value;

    isLoading.value = true;
    error.value = null;

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) queryParams.year = year;

      const data = await $fetch<OverviewStats>(`${baseUrl}/finance/dashboard/overview`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === requestIds.overview.value) overviewStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch overview stats:", message);
      if (requestId === requestIds.overview.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.overview.value) isLoading.value = false;
    }
  }

  /**
   * Fetch chart data
   */
  async function fetchChartData(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<ChartData | null> {
    const requestId = ++requestIds.charts.value;

    isLoading.value = true;
    error.value = null;

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) queryParams.year = year;

      const data = await $fetch<ChartData>(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === requestIds.charts.value) chartData.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch chart data:", message);
      if (requestId === requestIds.charts.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.charts.value) isLoading.value = false;
    }
  }

  /**
   * Fetch job costs
   */
  async function fetchJobCosts(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Record<string, string | number>,
  ): Promise<JobCostBreakdownResponse | null> {
    const requestId = ++requestIds.jobCosts.value;

    isLoading.value = true;
    error.value = null;

    try {
      // Ensure pagination params are included
      const queryParams: Record<string, string | number> = {
        period,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        ...filters,
      };
      // Remove page/limit from filters to avoid duplication
      delete queryParams.page;
      delete queryParams.limit;
      // Re-add with correct values
      queryParams.page = filters?.page || 1;
      queryParams.limit = filters?.limit || 10;

      const data = await $fetch<JobCostBreakdownResponse>(
        `${baseUrl}/finance/dashboard/job-costs`,
        {
          method: "GET",
          query: queryParams,
          credentials: "include",
        },
      );
      console.log("[FE_TRACE] Job costs response:", {
        itemCount: data.items?.length,
        total: data.pagination?.total,
      });

      if (requestId === requestIds.jobCosts.value) {
        jobCosts.value = data.items || [];
        if (data.pagination) {
          pagination.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch job costs:", message);
      if (requestId === requestIds.jobCosts.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.jobCosts.value) isLoading.value = false;
    }
  }

  /**
   * Fetch transactions
   */
  async function fetchTransactions(
    period: "day" | "week" | "month" | "year" = "month",
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string | number>,
  ): Promise<TransactionsResponse | null> {
    const requestId = ++requestIds.transactions.value;

    isLoading.value = true;
    error.value = null;

    try {
      const queryParams: Record<string, string | number> = {
        period,
        page,
        limit,
        ...filters,
      };
      const data = await $fetch<TransactionsResponse>(`${baseUrl}/finance/dashboard/transactions`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === requestIds.transactions.value) {
        transactions.value = data.items;
        if (data.pagination) {
          pagination.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transactions:", message);
      if (requestId === requestIds.transactions.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.transactions.value) isLoading.value = false;
    }
  }

  /**
   * Fetch transaction stats
   */
  async function fetchTransactionStats(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<TransactionStats | null> {
    const requestId = ++requestIds.transactionStats.value;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<TransactionStats>(
        `${baseUrl}/finance/dashboard/transactions/stats`,
        {
          method: "GET",
          query: { period },
          credentials: "include",
        },
      );

      if (requestId === requestIds.transactionStats.value) transactionStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transaction stats:", message);
      if (requestId === requestIds.transactionStats.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.transactionStats.value) isLoading.value = false;
    }
  }

  /**
   * Fetch finance close stats
   */
  async function fetchFinanceCloseStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<FinanceCloseStats | null> {
    const requestId = ++requestIds.financeClose.value;

    isLoading.value = true;
    error.value = null;

    try {
      const queryParams: Record<string, string | number> = { period };
      if (year) queryParams.year = year;

      const data = await $fetch<FinanceCloseStats>(`${baseUrl}/finance/dashboard/finance-close`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === requestIds.financeClose.value) financeCloseStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance close stats:", message);
      if (requestId === requestIds.financeClose.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.financeClose.value) isLoading.value = false;
    }
  }

  /**
   * Fetch closed periods
   */
  async function fetchClosedPeriods(): Promise<FinanceClosePeriod[] | null> {
    const requestId = ++requestIds.closedPeriods.value;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch<FinanceClosePeriod[]>(
        `${baseUrl}/finance/dashboard/finance-close/periods`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (requestId === requestIds.closedPeriods.value) closedPeriods.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch closed periods:", message);
      if (requestId === requestIds.closedPeriods.value) error.value = message;
      return null;
    } finally {
      if (requestId === requestIds.closedPeriods.value) isLoading.value = false;
    }
  }

  /**
   * Close a period
   */
  async function closePeriod(
    periodId: string,
    notes?: string,
  ): Promise<{ success: boolean; message: string }> {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/close`, {
        method: "POST",
        body: { notes },
        credentials: "include",
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period closed successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to close period:", message);
      error.value = message;
      return { success: false, message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Reopen a period
   */
  async function reopenPeriod(periodId: string): Promise<{ success: boolean; message: string }> {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`${baseUrl}/finance/dashboard/finance-close/periods/${periodId}/reopen`, {
        method: "POST",
        credentials: "include",
      });
      await fetchClosedPeriods();
      return { success: true, message: "Period reopened successfully" };
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to reopen period:", message);
      error.value = message;
      return { success: false, message };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetch all dashboard data
   */
  async function fetchAll(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Record<string, string | number>,
  ): Promise<void> {
    isLoading.value = true;
    error.value = null;

    // Extract year from filters for use in stats calls
    const year = filters?.year as number | undefined;

    try {
      // Each fetch should handle its own loading if called individually,
      // but for fetchAll we want a single loading state.
      // We'll temporarily override the individual loading states or just
      // rely on the fact that we set isLoading=true here.

      await Promise.all([
        fetchStats(period, year),
        fetchOverviewStats(period, year),
        fetchJobCosts(period, filters),
        fetchTransactionStats(period),
      ]);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    stats,
    overviewStats,
    chartData,
    jobCosts,
    transactions,
    transactionStats,
    financeCloseStats,
    closedPeriods,
    pagination,
    error,
    fetchAll,
    fetchOverviewStats,
    fetchChartData,
    fetchJobCosts,
    fetchTransactions,
    fetchTransactionStats,
    fetchFinanceCloseStats,
    fetchClosedPeriods,
    closePeriod,
    reopenPeriod,
  };
}
