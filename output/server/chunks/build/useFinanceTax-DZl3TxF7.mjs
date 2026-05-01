import { u as useRuntimeConfig } from "./server.mjs";
import { ref } from "vue";

function useFinanceTax() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  async function fetchTaxes(filters) {
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
      return await $fetch(`${config.public.apiBase}/finance/tax?${query.toString()}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Tax] Failed to fetch:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchTaxById(id) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/tax/${id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Tax] Failed to fetch by ID:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function createTax(data) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/tax`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
    } catch (error) {
      console.error("[Tax] Failed to create:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateTax(id, data) {
    isLoading.value = true;
    try {
      return await $fetch(`${config.public.apiBase}/finance/tax/${id}`, {
        method: "PATCH",
        body: data,
        credentials: "include",
      });
    } catch (error) {
      console.error("[Tax] Failed to update:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteTax(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/finance/tax/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      console.error("[Tax] Failed to delete:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    isLoading,
    fetchTaxes,
    fetchTaxById,
    createTax,
    updateTax,
    deleteTax,
  };
}

export { useFinanceTax as u };
//# sourceMappingURL=useFinanceTax-DZl3TxF7.mjs.map
