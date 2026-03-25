import type {
  TransactionItem,
  TransactionStats,
  TransactionsResponse,
  PaginationInfo,
} from "~/types/finance-dashboard";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

/**
 * Finance Transactions Composable
 * Handles fetching transactions data
 */
export function useFinanceTransactions() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "";

  let currentRequestId = 0;

  const isLoading = ref(false);
  const transactions = ref<TransactionItem[]>([]);
  const transactionStats = ref<TransactionStats | null>(null);
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const error = ref<string | null>(null);

  async function fetchTransactions(
    period: "day" | "week" | "month" | "year" = "month",
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string | number>,
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
        ...filters,
      };

      const data = await $fetch<TransactionsResponse>(`${baseUrl}/finance/dashboard/transactions`, {
        method: "GET",
        query: queryParams,
        credentials: "include",
      });

      if (requestId === currentRequestId) {
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

  async function fetchTransactionStats(
    period: "day" | "week" | "month" | "year" = "month",
  ): Promise<TransactionStats | null> {
    const requestId = ++currentRequestId;

    if (requestId === currentRequestId) {
      isLoading.value = true;
      error.value = null;
    }

    try {
      const data = await $fetch<TransactionStats>(
        `${baseUrl}/finance/dashboard/transactions/stats`,
        {
          method: "GET",
          query: { period },
          credentials: "include",
        },
      );

      if (requestId === currentRequestId) {
        transactionStats.value = data;
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Failed to fetch transaction stats:", message);
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
    transactions,
    transactionStats,
    pagination,
    error,
    fetchTransactions,
    fetchTransactionStats,
  };
}
