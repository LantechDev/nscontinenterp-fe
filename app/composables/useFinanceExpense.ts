export interface ExpenseItem {
  id?: string;
  serviceId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
  amount: number;
}

export interface CompanyAddress {
  id: string;
  label: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface ExpensePaymentAllocation {
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
  creditBalance?: number;
  date: string;
  categoryId?: string;
  expenseCategoryId?: string;
  vendorId?: string;
  jobId?: string;
  taxId?: string;
  category?: { id: string; name: string };
  expenseCategory?: { id: string; name: string };
  vendor?: { id: string; name: string; address?: string; addresses?: CompanyAddress[] };
  job?: { id: string; jobNumber: string; deletedAt?: string | null };
  jobStatus?: "ACTIVE" | "DELETED" | "MISSING" | "NONE";
  orphanReason?: "DELETED_JOB" | "MISSING_JOB" | null;
  orphanJobNumber?: string | null;
  isOrphaned?: boolean;
  status?: { id: string; code: string; name: string };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  currency?: string;
  exchangeRate?: number;
  direction?: string;
  sourceType?: "MANUAL" | "CLIENT_PAYMENT" | "VENDOR_PAYMENT" | "TAX_PAYMENT";
  sourceId?: string;
  referenceType?: string;
  referenceId?: string;
  isEditable?: boolean;
  items?: ExpenseItem[];
  paymentAllocations?: ExpensePaymentAllocation[];
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
  expenseCategoryId?: string;
  vendorId?: string;
  jobId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  type?: "JOB" | "GENERAL";
  direction?: string;
}

export const getOverpayment = (expense: {
  creditBalance?: number | null;
  balanceDue?: number | null;
}) => {
  const cb = Number(expense.creditBalance || 0);
  if (cb > 0) return cb;
  const bd = Number(expense.balanceDue || 0);
  return bd < 0 ? Math.abs(bd) : 0;
};

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
      return await $fetch<{
        items: Expense[];
        pagination: Pagination;
        summary: {
          totalAmount: number;
          netAmount: number;
          totalPaid: number;
          totalOutstanding: number;
          totalIncome: number;
          totalExpense: number;
          totalIncomePaid: number;
          totalIncomeOutstanding: number;
          totalExpensePaid: number;
          totalExpenseOutstanding: number;
          count: number;
        };
      }>(`/api/finance/expense?${query.toString()}`);
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

  async function voidExpense(
    id: string,
  ): Promise<{ success: boolean; data?: Expense; error?: string }> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Expense>(`/api/finance/expense/${id}/void`, {
        method: "POST",
      });
      return { success: true, data: responseData };
    } catch (error: unknown) {
      console.error("[Expense] Failed to void:", error);
      const err = error as { data?: { message?: string; error?: string }; message?: string };
      return {
        success: false,
        error: err.data?.message || err.data?.error || err.message || "Failed to void expense",
      };
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
    voidExpense,
  };
}
