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

type LocalMutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

const localMutationOptions = <TBody>(method: LocalMutationMethod, body?: TBody) =>
  body === undefined
    ? { method, skipNuxtDataRefresh: true }
    : { method, body, skipNuxtDataRefresh: true };

export function useServiceCategories() {
  const categories = useState<ServiceCategory[]>("service-categories-list", () => []);
  const isLoading = ref(false);

  const debugCategoriesState = (action: string, id?: string) => {
    if (!import.meta.client || localStorage.getItem("debug_api_refresh") !== "true") return;

    console.debug("[Service Category UI state]", {
      source: 'useState("service-categories")',
      action,
      item: id ? categories.value.find((category) => category.id === id) : null,
      total: categories.value.length,
    });
  };

  const stats: ComputedRef<ServiceCategoryStats> = computed(() => {
    const list = categories.value || [];
    return {
      total: list.length,
    };
  });

  async function fetchCategories(): Promise<{
    success: boolean;
    data?: ServiceCategory[];
    error?: string;
  }> {
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
  }

  async function createCategory(
    payload: CreateServiceCategoryInput,
  ): Promise<{ success: boolean; data?: ServiceCategory; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceCategory>("/api/master/service-categories", {
        ...localMutationOptions("POST", payload),
      });
      categories.value = [...categories.value, data];
      debugCategoriesState("create", data.id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCategory(
    id: string,
    payload: CreateServiceCategoryInput,
  ): Promise<{ success: boolean; data?: ServiceCategory; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceCategory>(`/api/master/service-categories/${id}`, {
        ...localMutationOptions("PUT", payload),
      });
      categories.value = categories.value.map((c) => (c.id === id ? { ...c, ...data } : c));
      debugCategoriesState("update", id);
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
      await $fetch(`/api/master/service-categories/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      categories.value = categories.value.filter((c) => c.id !== id);
      debugCategoriesState("delete", id);
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
