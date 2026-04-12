export interface Expense {
  id: string;
  number: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  vendorId?: string;
  jobId?: string;
  category?: { id: string; name: string };
  vendor?: { id: string; name: string };
  job?: { id: string; jobNumber: string };
  notes?: string;
  createdAt: string;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface ExpenseFilters {
  search?: string;
  categoryId?: string;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export function useFinanceExpense() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  async function fetchExpenses(filters?: ExpenseFilters) {
    isLoading.value = true;
    try {
      const query = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
          }
        });
      }
      return await $fetch<{ items: Expense[]; pagination: Pagination }>(
        `${config.public.apiBase}/finance/expense?${query.toString()}`,
        { credentials: "include" },
      );
    } catch (error) {
      console.error("[Expense] Failed to fetch:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchExpenseById(id: string) {
    isLoading.value = true;
    try {
      return await $fetch<Expense>(`${config.public.apiBase}/finance/expense/${id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Expense] Failed to fetch by ID:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createExpense(data: Partial<Expense>) {
    isLoading.value = true;
    try {
      return await $fetch<Expense>(`${config.public.apiBase}/finance/expense`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
    } catch (error) {
      console.error("[Expense] Failed to create:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateExpense(id: string, data: Partial<Expense>) {
    isLoading.value = true;
    try {
      return await $fetch<Expense>(`${config.public.apiBase}/finance/expense/${id}`, {
        method: "PATCH",
        body: data,
        credentials: "include",
      });
    } catch (error) {
      console.error("[Expense] Failed to update:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteExpense(id: string) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/finance/expense/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      console.error("[Expense] Failed to delete:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
