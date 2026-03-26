import type { PaginationInfo } from "~/types/finance-dashboard";
import { toast } from "vue-sonner";
import { getErrorMessage } from "./useFinanceDashboardApi";

// AR/AP types (mirrored from the original file)
export interface ArApItem {
  id: string;
  invoiceNumber: string;
  company: string;
  total: number;
  paid: number;
  remaining: number;
  dueDate: string;
  aging: number | null;
  status: "paid" | "partial" | "payment_out";
}

export interface ArApStats {
  totalAr: number;
  overdueAr: number;
  totalAp: number;
  overdueAp: number;
}

export interface ArApResponse {
  items: ArApItem[];
  pagination: PaginationInfo;
}

// Shared state singletons to ensure consistency across the dashboard
const arApItems = ref<ArApItem[]>([]);
const arApStats = ref<ArApStats | null>(null);
const pagination = ref<PaginationInfo>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

/**
 * Finance Dashboard AR/AP Composable
 * Provides AR/AP items and stats fetching
 */
export function useFinanceDashboardArAp() {
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
   * Fetch AR/AP items
   */
  async function fetchArApItems(
    period: "day" | "week" | "month" | "year" = "month",
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string | number>,
  ): Promise<ArApResponse | null> {
    const requestId = getNextRequestId("arAp");

    setLoading(true);
    clearError("arAp", requestId);

    try {
      const queryParams: Record<string, string | number> = {
        period,
        page,
        limit,
        ...filters,
      };
      const data = await $fetch<ArApResponse>(`${baseUrl}/finance/dashboard/ar-ap`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (isLatestRequest("arAp", requestId)) {
        arApItems.value = data.items;
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
      console.error("Failed to fetch AR/AP items:", message);
      toast.error(message || "Gagal memuat data AR/AP.");
      setError("arAp", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("arAp", requestId)) setLoading(false);
    }
  }

  /**
   * Fetch AR/AP stats
   */
  async function fetchArApStats(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<ArApStats | null> {
    const requestId = getNextRequestId("arApStats");

    setLoading(true);
    clearError("arApStats", requestId);

    try {
      const data = await $fetch<ArApStats>(`${baseUrl}/finance/dashboard/ar-ap/stats`, {
        method: "GET",
        query: { period },
        credentials: "include",
      });

      if (isLatestRequest("arApStats", requestId)) arApStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch AR/AP stats:", message);
      toast.error(message || "Gagal memuat statistik AR/AP.");
      setError("arApStats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("arApStats", requestId)) setLoading(false);
    }
  }

  return {
    arApItems,
    arApStats,
    pagination,
    fetchArApItems,
    fetchArApStats,
  };
}
