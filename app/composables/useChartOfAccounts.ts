export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  parentId?: string;
  isActive: boolean;
  description?: string;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

/**
 * Format account for display in dropdown
 * Format: 1101 - Kas
 */
function formatAccountDisplay(account: ChartOfAccount): string {
  return `${account.accountCode} - ${account.accountName}`;
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

export function useChartOfAccounts() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const accounts = ref<ChartOfAccount[]>([]);

  /**
   * Fetch all chart of accounts
   */
  async function fetchAccounts(): Promise<{
    success: boolean;
    data?: ChartOfAccount[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ChartOfAccount[]>(
        `${config.public.apiBase}/finance/chart-of-accounts`,
        {
          credentials: "include",
        },
      );
      accounts.value = data || [];
      return { success: true, data: accounts.value };
    } catch (error) {
      console.error("[ChartOfAccounts] Failed to fetch:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Search accounts by query (client-side filtering)
   */
  async function searchAccounts(query: string): Promise<{
    success: boolean;
    data?: ChartOfAccount[];
    error?: string;
  }> {
    // If we don't have accounts yet, fetch them first
    if (accounts.value.length === 0) {
      const result = await fetchAccounts();
      if (!result.success) return result;
    }

    // Filter accounts based on query
    if (!query || query.trim() === "") {
      return { success: true, data: accounts.value };
    }

    const lowerQuery = query.toLowerCase().trim();
    const filtered = accounts.value.filter((account) => {
      const codeMatch = account.accountCode.toLowerCase().includes(lowerQuery);
      const nameMatch = account.accountName.toLowerCase().includes(lowerQuery);
      const typeMatch = account.accountType.toLowerCase().includes(lowerQuery);
      return codeMatch || nameMatch || typeMatch;
    });

    return { success: true, data: filtered };
  }

  /**
   * Get account by ID
   */
  function getAccountById(accountId: string): ChartOfAccount | undefined {
    return accounts.value.find((acc) => acc.id === accountId);
  }

  return {
    isLoading,
    accounts,
    fetchAccounts,
    searchAccounts,
    formatAccountDisplay,
    getAccountById,
  };
}
