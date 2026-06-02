import type { ComputedRef } from "vue";
import type { ExpenseCategory } from "~/types/master";

export interface ExpenseCategoryStats {
  total: number;
}

export interface CreateExpenseCategoryInput {
  name: string;
  defaultDebitAccountId?: string | null;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

type LocalMutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

const localMutationOptions = <TBody>(method: LocalMutationMethod, body?: TBody) =>
  body === undefined
    ? { method, skipNuxtDataRefresh: true }
    : { method, body, skipNuxtDataRefresh: true };

export function useExpenseCategories() {
  const categories = useState<ExpenseCategory[]>("expense-categories-list", () => []);
  const isLoading = ref(false);

  const stats: ComputedRef<ExpenseCategoryStats> = computed(() => {
    const list = categories.value || [];
    return {
      total: list.length,
    };
  });

  async function fetchCategories(): Promise<{
    success: boolean;
    data?: ExpenseCategory[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ExpenseCategory[]>("/api/master/expense-categories");
      categories.value = data || [];
      return { success: true, data: categories.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createCategory(
    payload: CreateExpenseCategoryInput,
  ): Promise<{ success: boolean; data?: ExpenseCategory; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ExpenseCategory>("/api/master/expense-categories", {
        ...localMutationOptions("POST", payload),
      });
      categories.value = [...categories.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCategory(
    id: string,
    payload: CreateExpenseCategoryInput,
  ): Promise<{ success: boolean; data?: ExpenseCategory; error?: string }> {
    isLoading.value = true;
    try {
      // Backend uses PATCH for updating expense categories
      const data = await $fetch<ExpenseCategory>(`/api/master/expense-categories/${id}`, {
        ...localMutationOptions("PATCH", payload),
      });
      categories.value = categories.value.map((c) => (c.id === id ? { ...c, ...data } : c));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/expense-categories/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      categories.value = categories.value.filter((c) => c.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    categories: categories,
    stats: stats,
    isLoading: isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
