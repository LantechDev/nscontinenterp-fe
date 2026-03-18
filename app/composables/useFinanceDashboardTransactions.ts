import type {
  TransactionItem,
  TransactionStats,
  TransactionsResponse,
  PaginationInfo,
} from "~/types/finance-dashboard";
import { getErrorMessage } from "./useFinanceDashboardApi";

// Shared state singletons to ensure consistency
const transactions = ref<TransactionItem[]>([]);
const transactionStats = ref<TransactionStats | null>(null);
const pagination = ref<PaginationInfo>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

/**
 * Finance Dashboard Transactions Composable
 * Provides transactions and transaction stats fetching
 */
export function useFinanceDashboardTransactions() {
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
   * Fetch transactions
   */
  async function fetchTransactions(
    period: "day" | "week" | "month" | "year" = "month",
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string | number>,
  ): Promise<TransactionsResponse | null> {
    const requestId = getNextRequestId("transactions");

    setLoading(true);
    clearError("transactions", requestId);

    try {
      // Ensure filters don't overwrite the explicit pagination parameters
      const { page: _p, limit: _l, ...safeFilters } = filters || {};

      const queryParams: Record<string, string | number> = {
        period,
        page,
        limit,
        ...safeFilters,
      };

      const data = await $fetch<TransactionsResponse>(`${baseUrl}/finance/dashboard/transactions`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (isLatestRequest("transactions", requestId)) {
        transactions.value = data.items;
        if (data.pagination) {
          pagination.value = {
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
          };
        }
        // Use stats from the transactions response (covers all transactions, not just paginated)
        if (data.stats) {
          transactionStats.value = data.stats;
        }
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transactions:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }

  /**
   * Fetch transaction stats
   */
  async function fetchTransactionStats(
    period: "day" | "week" | "month" | "year" = "month",
    filters?: Record<string, string | number>,
  ): Promise<TransactionStats | null> {
    const requestId = getNextRequestId("transactionStats");

    setLoading(true);
    clearError("transactionStats", requestId);

    try {
      const queryParams: Record<string, string | number> = { period };
      if (filters) {
        Object.assign(queryParams, filters);
      }
      const data = await $fetch<TransactionStats>(
        `${baseUrl}/finance/dashboard/transactions/stats`,
        {
          method: "GET",
          query: queryParams,
          credentials: "include",
        },
      );

      if (isLatestRequest("transactionStats", requestId)) transactionStats.value = data;
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transaction stats:", message);
      setError("transactionStats", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactionStats", requestId)) setLoading(false);
    }
  }

  return {
    transactions,
    transactionStats,
    pagination,
    fetchTransactions,
    fetchTransactionStats,
  };
}
