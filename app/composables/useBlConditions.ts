import { ref } from "vue";

export interface BlCondition {
  id: string;
  clauseNumber: string;
  clauseTitle: string;
  clauseContent: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const useBlConditions = () => {
  const conditions = ref<BlCondition[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchConditions = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ success: boolean; data: BlCondition[] }>(
        "/api/master/bl-conditions",
      );
      if (response.success) {
        conditions.value = response.data;
      } else {
        error.value = "Failed to fetch conditions";
      }
    } catch (err: unknown) {
      error.value = (err as Error).message || "An error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  const createCondition = async (data: Partial<BlCondition>) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{ success: boolean; data: BlCondition }>(
        "/api/master/bl-conditions",
        {
          method: "POST",
          body: data,
        },
      );
      if (response.success) {
        await fetchConditions();
        return { success: true, data: response.data };
      }
      return { success: false, error: "Failed to create condition" };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || "An error occurred" };
    } finally {
      isLoading.value = false;
    }
  };

  const updateCondition = async (id: string, data: Partial<BlCondition>) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{ success: boolean; data: BlCondition }>(
        `/api/master/bl-conditions/${id}`,
        {
          method: "PUT",
          body: data,
        },
      );
      if (response.success) {
        await fetchConditions();
        return { success: true, data: response.data };
      }
      return { success: false, error: "Failed to update condition" };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || "An error occurred" };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCondition = async (id: string) => {
    isLoading.value = true;
    try {
      const response = await $fetch<{ success: boolean }>(`/api/master/bl-conditions/${id}`, {
        method: "DELETE",
      });
      if (response.success) {
        await fetchConditions();
        return { success: true };
      }
      return { success: false, error: "Failed to delete condition" };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || "An error occurred" };
    } finally {
      isLoading.value = false;
    }
  };

  const reorderConditions = async (items: { id: string; sortOrder: number }[]) => {
    try {
      const response = await $fetch<{ success: boolean }>(`/api/master/bl-conditions/reorder`, {
        method: "PUT",
        body: { items },
      });
      if (response.success) {
        await fetchConditions();
        return { success: true };
      }
      return { success: false, error: "Failed to reorder conditions" };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || "An error occurred" };
    }
  };

  return {
    conditions,
    isLoading,
    error,
    fetchConditions,
    createCondition,
    updateCondition,
    deleteCondition,
    reorderConditions,
  };
};
