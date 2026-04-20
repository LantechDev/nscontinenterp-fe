import { u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

function useFinanceExpense() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  async function fetchExpenses(filters) {
    isLoading.value = true;
    try {
      const query = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== void 0 && value !== null && value !== "") {
            query.append(key, String(value));
          }
        });
      }
      return await $fetch(`${config.public.apiBase}/finance/expense?${query.toString()}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Expense] Failed to fetch:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchExpenseById(id) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/expense/${id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Expense] Failed to fetch by ID:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function createExpense(data) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/expense`, {
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
  async function updateExpense(id, data) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/expense/${id}`, {
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
  async function deleteExpense(id) {
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

export { useFinanceExpense as u };
//# sourceMappingURL=useFinanceExpense-CyuGq-0f.mjs.map
