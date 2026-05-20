export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  parentId?: string | null;
  normalBalance?: string;
  isPosting?: boolean;
  isActive: boolean;
  description?: string;
}

export interface ChartOfAccountPayload {
  accountCode: string;
  accountName: string;
  accountType: string;
  normalBalance: string;
  isPosting: boolean;
  parentId?: string | null;
  isActive: boolean;
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
  const isLoading = ref(false);
  const accounts = ref<ChartOfAccount[]>([]);

  /**
   * Fetch all chart of accounts
   */
  async function fetchAccounts(includeInactive = false): Promise<{
    success: boolean;
    data?: ChartOfAccount[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ChartOfAccount[]>("/api/finance/chart-of-accounts", {
        query: includeInactive ? { includeInactive: true } : undefined,
      });
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

  async function createAccount(payload: ChartOfAccountPayload): Promise<{
    success: boolean;
    data?: ChartOfAccount;
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ChartOfAccount>("/api/finance/chart-of-accounts", {
        method: "POST",
        body: payload,
      });
      accounts.value = [...accounts.value, data].toSorted((a, b) =>
        a.accountCode.localeCompare(b.accountCode),
      );
      return { success: true, data };
    } catch (error) {
      console.error("[ChartOfAccounts] Failed to create:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAccount(
    id: string,
    payload: Partial<ChartOfAccountPayload>,
  ): Promise<{
    success: boolean;
    data?: ChartOfAccount;
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ChartOfAccount>(`/api/finance/chart-of-accounts/${id}`, {
        method: "PATCH",
        body: payload,
      });
      accounts.value = accounts.value
        .map((account) => (account.id === id ? data : account))
        .toSorted((a, b) => a.accountCode.localeCompare(b.accountCode));
      return { success: true, data };
    } catch (error) {
      console.error("[ChartOfAccounts] Failed to update:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/finance/chart-of-accounts/${id}`, {
        method: "DELETE",
      });
      accounts.value = accounts.value.filter((account) => account.id !== id);
      return { success: true };
    } catch (error) {
      console.error("[ChartOfAccounts] Failed to delete:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    accounts,
    fetchAccounts,
    searchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    formatAccountDisplay,
    getAccountById,
  };
}
