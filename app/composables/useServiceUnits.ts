import type { ComputedRef } from "vue";
import type { ServiceUnit } from "~/types/master";

export interface ServiceUnitStats {
  total: number;
}

export interface CreateServiceUnitInput {
  name: string;
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

export function useServiceUnits() {
  const units = useState<ServiceUnit[]>("service-units", () => []);
  const isLoading = ref(false);

  const stats: ComputedRef<ServiceUnitStats> = computed(() => {
    const list = units.value || [];
    return {
      total: list.length,
    };
  });

  const fetchUnits = async (): Promise<{
    success: boolean;
    data?: ServiceUnit[];
    error?: string;
  }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit[]>("/api/master/service-units");
      units.value = data || [];
      return { success: true, data: units.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const createUnit = async (
    payload: CreateServiceUnitInput,
  ): Promise<{ success: boolean; data?: ServiceUnit; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit>("/api/master/service-units", {
        method: "POST",
        body: payload,
      });
      units.value = [...units.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const updateUnit = async (
    id: string,
    payload: CreateServiceUnitInput,
  ): Promise<{ success: boolean; data?: ServiceUnit; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit>(`/api/master/service-units/${id}`, {
        method: "PUT",
        body: payload,
      });
      units.value = units.value.map((u) => (u.id === id ? { ...u, ...data } : u));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteUnit = async (id: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/service-units/${id}`, {
        method: "DELETE",
      });
      units.value = units.value.filter((u) => u.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    units: readonly(units),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}
