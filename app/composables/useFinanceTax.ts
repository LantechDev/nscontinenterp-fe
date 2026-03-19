export interface Tax {
  id: string;
  name: string;
  rate: number;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface TaxFilters {
  search?: string;
  type?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export function useFinanceTax() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  async function fetchTaxes(filters?: TaxFilters) {
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
      return await $fetch<{ items: Tax[]; pagination: Pagination }>(
        `${config.public.apiBase}/finance/tax?${query.toString()}`,
        { credentials: "include" },
      );
    } catch (error) {
      console.error("[Tax] Failed to fetch:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTaxById(id: string) {
    isLoading.value = true;
    try {
      return await $fetch<Tax>(`${config.public.apiBase}/finance/tax/${id}`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("[Tax] Failed to fetch by ID:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTax(data: Partial<Tax>) {
    isLoading.value = true;
    try {
      return await $fetch<Tax>(`${config.public.apiBase}/finance/tax`, {
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

  async function updateTax(id: string, data: Partial<Tax>) {
    isLoading.value = true;
    try {
      return await $fetch<Tax>(`${config.public.apiBase}/finance/tax/${id}`, {
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

  async function deleteTax(id: string) {
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
