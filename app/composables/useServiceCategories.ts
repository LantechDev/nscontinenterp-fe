import type { ComputedRef } from "vue";
import type { ServiceCategory } from "~/types/master";

export interface ServiceCategoryStats {
  total: number;
}

export interface CreateServiceCategoryInput {
  name: string;
  defaultRevenueAccountId?: string | null;
  defaultCostAccountId?: string | null;
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

export function useServiceCategories() {
  const categories = useState<ServiceCategory[]>("service-categories", () => []);
  const isLoading = ref(false);

  const stats: ComputedRef<ServiceCategoryStats> = computed(() => {
    const list = categories.value || [];
    return {
      total: list.length,
    };
  });

  const fetchCategories = async (): Promise<{
    success: boolean;
    data?: ServiceCategory[];
    error?: string;
  }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceCategory[]>("/api/master/service-categories");
      categories.value = data || [];
      return { success: true, data: categories.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const createCategory = async (
    payload: CreateServiceCategoryInput,
  ): Promise<{ success: boolean; data?: ServiceCategory; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceCategory>("/api/master/service-categories", {
        method: "POST",
        body: payload,
      });
      categories.value = [...categories.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const updateCategory = async (
    id: string,
    payload: CreateServiceCategoryInput,
  ): Promise<{ success: boolean; data?: ServiceCategory; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceCategory>(`/api/master/service-categories/${id}`, {
        method: "PUT",
        body: payload,
      });
      categories.value = categories.value.map((c) => (c.id === id ? { ...c, ...data } : c));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/service-categories/${id}`, {
        method: "DELETE",
      });
      categories.value = categories.value.filter((c) => c.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    categories: readonly(categories),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
