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

export interface FinanceDashboardFilters {
  period?: "day" | "week" | "month" | "year";
  serviceId?: string;
  companyId?: string;
  page?: number;
  limit?: number;
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
  const jobCosts = ref<JobCostItem[]>([]);
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const error = ref<string | null>(null);

  /**
   * Fetch dashboard statistics
   */
  async function fetchStats(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<FinanceDashboardStats | null> {
    // Track this request
    const requestId = ++currentRequestId;

    // Only set loading if this is the latest request
    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<FinanceDashboardStats>(`${baseUrl}/finance/dashboard`, {
        method: "GET",
        query: { period },
        credentials: "include",
      });

      // Only update state if this is still the latest request
      if (requestId === currentRequestId) {
        stats.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch finance dashboard stats:", message);
      // Only set error if this is still the latest request
      if (requestId === currentRequestId) {
        error.value = message;
      }
      return null;
    } finally {
      // Only clear loading if this is still the latest request
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
  ): Promise<JobCostBreakdownResponse | null> {
    // Track this request
    const requestId = ++currentRequestId;

    // Only set loading if this is the latest request
    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const { period = "month", serviceId, companyId, page = 1, limit = 10 } = filters;

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

      const data = await $fetch<JobCostBreakdownResponse>(`${baseUrl}/finance/dashboard/jobs`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      // Only update state if this is still the latest request
      if (requestId === currentRequestId) {
        jobCosts.value = data.data;
        pagination.value = data.pagination;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch job cost breakdown:", message);
      // Only set error if this is still the latest request
      if (requestId === currentRequestId) {
        error.value = message;
      }
      return null;
    } finally {
      // Only clear loading if this is still the latest request
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
    // Track this request
    const requestId = ++currentRequestId;

    isLoading.value = true;
    error.value = null;

    try {
      // Fetch sequentially to avoid race conditions and ensure proper state updates
      // First fetch stats
      const statsData = await fetchStats(period);

      // Check if this request is still valid (not superseded by another)
      if (requestId !== currentRequestId) {
        return;
      }

      // Then fetch job costs
      const jobCostsData = await fetchJobCosts({ period, ...filters });

      // Check again if this request is still valid
      if (requestId !== currentRequestId) {
        return;
      }

      if (!statsData || !jobCostsData) {
        error.value = "Failed to fetch some dashboard data";
      }
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch all dashboard data:", message);
      // Only set error if this is still the latest request
      if (requestId === currentRequestId) {
        error.value = message;
      }
    } finally {
      // Only clear loading if this is still the latest request
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
    jobCosts,
    pagination,
    error,

    // Methods
    fetchStats,
    fetchJobCosts,
    fetchAll,
    changePage,
    changePeriod,
    clearError,
  };
}
