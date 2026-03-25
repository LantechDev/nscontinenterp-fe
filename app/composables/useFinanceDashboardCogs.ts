import type {
  JobCostItem,
  JobCostBreakdownResponse,
  PaginationInfo,
} from "~/types/finance-dashboard";
import { getErrorMessage } from "./useFinanceDashboardApi";

// Shared state singletons to ensure consistency across the dashboard
const jobCosts = ref<JobCostItem[]>([]);
const pagination = ref<PaginationInfo>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

/**
 * Finance Dashboard COGS Composable
 * Provides job costs fetching
 */
export function useFinanceDashboardCogs() {
  const {
    baseUrl,
    isLoading: _isLoading,
    error: _error,
    getNextRequestId,
    isLatestRequest,
    setLoading,
    setError,
    clearError,
  } = useFinanceDashboardApi();

  /**
   * Fetch job costs data
   */
  async function fetchJobCosts(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Record<string, string | number>,
  ): Promise<JobCostBreakdownResponse | null> {
    const requestId = getNextRequestId("jobCosts");

    setLoading(true);
    clearError("jobCosts", requestId);

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

      if (isLatestRequest("jobCosts", requestId)) {
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
      setError("jobCosts", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("jobCosts", requestId)) setLoading(false);
    }
  }

  return {
    jobCosts,
    pagination,
    fetchJobCosts,
  };
}
