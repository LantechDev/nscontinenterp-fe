/**
 * Finance Dashboard Types
 */
export interface FinanceDashboardStats {
  totalCogs: number;
  totalCogsFormatted: string;
  averageCostPerJob: number;
  averageCostPerJobFormatted: string;
  highestJob: {
    jobNumber: string;
    cogs: number;
    cogsFormatted: string;
  };
  costGrowth: number;
  previousPeriodCogs: number;
  currentPeriodCogs: number;
}

export interface OverviewStats {
  totalIncome: number;
  totalIncomeFormatted: string;
  totalOutcome: number;
  totalOutcomeFormatted: string;
  netProfit: number;
  netProfitFormatted: string;
  margins: number;
  incomeGrowth: number;
  outcomeGrowth: number;
}

export interface ChartData {
  incomeData: number[];
  expenseData: number[];
  marginData: number[];
  months: string[];
  top5: { name: string; value: number }[];
}

export interface JobCostItem {
  id: string;
  jobNumber: string;
  polPod: string;
  customer: string;
  revenue: number;
  revenueFormatted: string;
  cogs: number;
  cogsFormatted: string;
  profit: number;
  profitFormatted: string;
  margin: number;
  status: "active" | "closed" | "pending";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobCostBreakdownResponse {
  data: JobCostItem[];
  pagination: PaginationInfo;
}

export interface TransactionItem {
  id: string;
  jobNumber: string;
  date: string;
  customer: string;
  type: "Customer Invoice" | "Payment Out";
  total: number;
  isIncome: boolean;
}

export interface TransactionStats {
  totalJournal: number;
  totalIncome: number;
  totalOutcome: number;
  todayTransactions: number;
}

export interface TransactionsResponse {
  data: TransactionItem[];
  pagination: PaginationInfo;
  stats: TransactionStats;
}

export interface FinanceCloseStats {
  id?: string;
  period: string;
  status: "Open" | "Closed";
  description: string;
  revenue: string;
  cogs: string;
  nettPL: string;
  readinessScore: number;
  periodStart?: string;
  periodEnd?: string;
}

export interface FinanceClosePeriod {
  id: string;
  period: string;
  status: "Open" | "Closed";
  description: string;
  revenue: string;
  cogs: string;
  nettPL: string;
  readinessScore: number;
  periodStart?: string;
  periodEnd?: string;
  closedAt?: string;
}

export interface FinanceDashboardFilters {
  period?: "day" | "week" | "month" | "year";
  serviceId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "jobNumber" | "revenue" | "cogs" | "profit" | "margin" | "createdAt";
  sortOrder?: "asc" | "desc";
  year?: number;
}

/**
 * Error response type
 */
interface ErrorResponse {
  message?: string;
  error?: string;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

/**
 * Finance Dashboard Composable
 * Provides functions to fetch finance dashboard data from the API
 *
 * IMPORTANT: Use useState or provide unique key to prevent multiple instances
 * from being created during SSR/hydration which can cause data loss
 */
export function useFinanceDashboard() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  // Request tracking to prevent race conditions
  let currentRequestId = 0;

  // Reactive state - preserve data during refetches
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
        credentials: "include",
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

  /**
   * Fetch overview statistics
   */
  async function fetchOverviewStats(
    period: "day" | "week" | "month" | "year" = "month",
    year?: number,
  ): Promise<OverviewStats | null> {
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

      const data = await $fetch<OverviewStats>(`${baseUrl}/finance/dashboard/overview`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === currentRequestId) {
        overviewStats.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch overview stats:", message);
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

  /**
   * Fetch chart data
   */
  async function fetchChartData(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<ChartData | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<ChartData>(`${baseUrl}/finance/dashboard/charts`, {
        method: "GET",
        query: { period },
        credentials: "include",
      });

      if (requestId === currentRequestId) {
        chartData.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch chart data:", message);
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

  /**
   * Fetch job cost breakdown
   */
  async function fetchJobCosts(
    filters: FinanceDashboardFilters,
    forcedRequestId?: number,
  ): Promise<JobCostBreakdownResponse | null> {
    const requestId = forcedRequestId ?? ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const {
        period = "month",
        serviceId,
        companyId,
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
        year,
      } = filters;

      const queryParams: Record<string, string | number> = {
        period,
        page,
        limit,
      };

      if (serviceId) {
        queryParams.serviceId = serviceId;
      }
      if (companyId) {
        queryParams.companyId = companyId;
      }
      if (search) {
        queryParams.search = search;
      }
      if (sortBy) {
        queryParams.sortBy = sortBy;
      }
      if (sortOrder) {
        queryParams.sortOrder = sortOrder;
      }
      if (year) {
        queryParams.year = year;
      }

      const data = await $fetch<JobCostBreakdownResponse>(`${baseUrl}/finance/dashboard/jobs`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === currentRequestId) {
        jobCosts.value = data.data;
        pagination.value = data.pagination;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch job cost breakdown:", message);
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

  /**
   * Fetch transactions
   */
  async function fetchTransactions(
    period: "day" | "week" | "month" | "year" = "month",
    page: number = 1,
    limit: number = 10,
    filters?: {
      companyId?: string;
      type?: "invoice" | "payment" | "all";
      search?: string;
      sortBy?: "date" | "jobNumber" | "customer" | "total";
      sortOrder?: "asc" | "desc";
      year?: number;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<TransactionsResponse | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const queryParams: Record<string, string | number> = {
        period,
        page,
        limit,
      };

      if (filters?.companyId) {
        queryParams.companyId = filters.companyId;
      }
      if (filters?.type) {
        queryParams.type = filters.type;
      }
      if (filters?.search) {
        queryParams.search = filters.search;
      }
      if (filters?.sortBy) {
        queryParams.sortBy = filters.sortBy;
      }
      if (filters?.sortOrder) {
        queryParams.sortOrder = filters.sortOrder;
      }
      if (filters?.year) {
        queryParams.year = filters.year;
      }
      if (filters?.startDate) {
        queryParams.startDate = filters.startDate;
      }
      if (filters?.endDate) {
        queryParams.endDate = filters.endDate;
      }

      const data = await $fetch<TransactionsResponse>(`${baseUrl}/finance/dashboard/transactions`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === currentRequestId) {
        transactions.value = data.data;
        pagination.value = data.pagination;
        transactionStats.value = data.stats;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transactions:", message);
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

  /**
   * Fetch finance close stats
   */
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
      const query: Record<string, string | number> = { period };
      if (year) {
        query.year = year;
      }

      const data = await $fetch<FinanceCloseStats>(`${baseUrl}/finance/dashboard/finance-close`, {
        method: "GET",
        query,
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

  /**
   * Close period
   */
  async function closePeriod(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<{ success: boolean; message: string } | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<{ success: boolean; message: string }>(
        `${baseUrl}/finance/dashboard/finance-close`,
        {
          method: "POST",
          query: { period },
          credentials: "include",
        },
      );

      if (requestId === currentRequestId && data.success) {
        // Refresh stats after closing
        await fetchFinanceCloseStats(period);
        // Also refresh closed periods list
        await fetchClosedPeriods();
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to close period:", message);
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

  /**
   * Fetch closed periods list
   */
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

  /**
   * Reopen a closed period
   */
  async function reopenPeriod(
    periodCloseId: string,
  ): Promise<{ success: boolean; message: string } | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<{ success: boolean; message: string }>(
        `${baseUrl}/finance/dashboard/finance-close/reopen`,
        {
          method: "POST",
          body: { periodCloseId },
          credentials: "include",
        },
      );

      if (requestId === currentRequestId && data.success) {
        // Refresh stats and closed periods list after reopening
        await fetchFinanceCloseStats();
        await fetchClosedPeriods();
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to reopen period:", message);
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

  /**
   * Fetch all dashboard data (stats + job costs)
   * Uses sequential fetching to ensure proper loading states
   */
  async function fetchAll(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Omit<FinanceDashboardFilters, "period">,
  ): Promise<void> {
    const requestId = ++currentRequestId;

    isLoading.value = true;
    error.value = null;

    try {
      // Extract year from filters
      const year = filters?.year;

      // Fetch sequentially to avoid race conditions and ensure proper state updates
      // First fetch stats
      const statsData = await fetchStats(period, year, requestId);

      if (requestId !== currentRequestId) {
        return;
      }

      // Then fetch job costs
      const jobCostsData = await fetchJobCosts({ period, ...filters }, requestId);

      if (requestId !== currentRequestId) {
        return;
      }

      if (!statsData || !jobCostsData) {
        error.value = "Failed to fetch some dashboard data";
      }
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch all dashboard data:", message);
      if (requestId === currentRequestId) {
        error.value = message;
      }
    } finally {
      if (requestId === currentRequestId) {
        isLoading.value = false;
      }
    }
  }

  /**
   * Change page for job costs
   */
  async function changePage(
    newPage: number,
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Omit<FinanceDashboardFilters, "period" | "page">,
  ): Promise<void> {
    await fetchJobCosts({ period, page: newPage, ...filters });
  }

  /**
   * Change period and reset pagination
   */
  async function changePeriod(
    newPeriod: "day" | "week" | "month" | "year",
    filters?: Omit<FinanceDashboardFilters, "period">,
  ): Promise<void> {
    await fetchAll(newPeriod, filters);
  }

  /**
   * Clear error
   */
  function clearError(): void {
    error.value = null;
  }

  return {
    // State
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

    // Methods
    fetchStats,
    fetchOverviewStats,
    fetchChartData,
    fetchJobCosts,
    fetchTransactions,
    fetchFinanceCloseStats,
    closePeriod,
    fetchClosedPeriods,
    reopenPeriod,
    fetchAll,
    changePage,
    changePeriod,
    clearError,
  };
}
