export interface ExpenseItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CompanyAddress {
  id: string;
  label: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface PaymentAllocation {
  id: string;
  amount: number;
  payment: {
    id: string;
    paymentNumber?: string;
    paymentDate: string;
    status: string;
    paymentMethod?: {
      name: string;
      code: string;
    };
    reference?: string;
  };
}

export interface Expense {
  id: string;
  number: string;
  description: string;
  amount: number;
  balanceDue: number;
  date: string;
  categoryId?: string;
  vendorId?: string;
  jobId?: string;
  taxId?: string;
  category?: { id: string; name: string };
  vendor?: { id: string; name: string; address?: string; addresses?: CompanyAddress[] };
  job?: { id: string; jobNumber: string };
  status?: { id: string; code: string; name: string };
  notes?: string;
  createdAt: string;
  currency?: string;
  exchangeRate?: number;
  items?: ExpenseItem[];
  paymentAllocations?: PaymentAllocation[];
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
  jobId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  type?: "JOB" | "GENERAL";
}

export function useFinanceExpense() {
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
        `/api/finance/expense?${query.toString()}`,
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
      return await $fetch<Expense>(`/api/finance/expense/${id}`);
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
      return await $fetch<Expense>("/api/finance/expense", {
        method: "POST",
        body: data,
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
      return await $fetch<Expense>(`/api/finance/expense/${id}`, {
        method: "PATCH",
        body: data,
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
      await $fetch(`/api/finance/expense/${id}`, {
        method: "DELETE",
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
