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
   * Create a manual transaction
   */
  async function createManualTransaction(data: {
    journalDate: string;
    description: string;
    entries: {
      accountId: string;
      debit: number;
      credit: number;
      jobId?: string;
    }[];
  }): Promise<TransactionItem | null> {
    const requestId = getNextRequestId("transactions");

    setLoading(true);
    clearError("transactions", requestId);

    try {
      const result = await $fetch<TransactionItem>(`${baseUrl}/finance/dashboard/transactions`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      // Refresh transactions after creation
      await fetchTransactions("month", 1, pagination.value.limit);

      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to create manual transaction:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }

  /**
   * Update a manual transaction
   */
  async function updateManualTransaction(
    id: string,
    data: {
      journalDate?: string;
      description?: string;
      entries?: {
        accountId: string;
        debit: number;
        credit: number;
        jobId?: string;
      }[];
    },
  ): Promise<TransactionItem | null> {
    const requestId = getNextRequestId("transactions");

    setLoading(true);
    clearError("transactions", requestId);

    try {
      const result = await $fetch<TransactionItem>(
        `${baseUrl}/finance/dashboard/transactions/${id}`,
        {
          method: "PUT",
          body: data,
          credentials: "include",
        },
      );

      // Refresh transactions after update
      await fetchTransactions("month", pagination.value.page, pagination.value.limit);

      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to update manual transaction:", message);
      setError("transactions", requestId, message);
      return null;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
    }
  }

  /**
   * Delete a manual transaction
   */
  async function deleteManualTransaction(id: string): Promise<boolean> {
    const requestId = getNextRequestId("transactions");

    setLoading(true);
    clearError("transactions", requestId);

    try {
      await $fetch(`${baseUrl}/finance/dashboard/transactions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Refresh transactions after deletion
      await fetchTransactions("month", pagination.value.page, pagination.value.limit);

      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to delete manual transaction:", message);
      setError("transactions", requestId, message);
      return false;
    } finally {
      if (isLatestRequest("transactions", requestId)) setLoading(false);
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
    createManualTransaction,
    updateManualTransaction,
    deleteManualTransaction,
  };
}
