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

type LocalMutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

const localMutationOptions = <TBody>(method: LocalMutationMethod, body?: TBody) =>
  body === undefined
    ? { method, skipNuxtDataRefresh: false }
    : { method, body, skipNuxtDataRefresh: false };

export function useServiceUnits() {
  const isLoading = ref(false);
  const units = useState<ServiceUnit[]>("units-list", () => []);
  const currentUnit = useState<ServiceUnit | null>("units-current", () => null);

  const debugUnitsState = (action: string, id?: string) => {
    if (!import.meta.client || localStorage.getItem("debug_api_refresh") !== "true") return;

    console.debug("[Service Unit UI state]", {
      source: 'useState("units-list")',
      action,
      item: id ? units.value.find((unit) => unit.id === id) : null,
      total: units.value.length,
    });
  };

  const stats: ComputedRef<ServiceUnitStats> = computed(() => {
    const list = units.value || [];
    return {
      total: list.length,
    };
  });

  async function fetchUnits(): Promise<{
    success: boolean;
    data?: ServiceUnit[];
    error?: string;
  }> {
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
  }

  async function getUnit(
    id: string,
  ): Promise<{ success: boolean; data?: ServiceUnit; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit>(`/api/master/service-units/${id}`);
      currentUnit.value = data;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createUnit(
    payload: CreateServiceUnitInput,
  ): Promise<{ success: boolean; data?: ServiceUnit; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit>("/api/master/service-units", {
        ...localMutationOptions("POST", payload),
      });
      units.value = [...units.value, data];
      refreshNuxtData("units-list");
      debugUnitsState("create", data.id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUnit(
    id: string,
    payload: CreateServiceUnitInput,
  ): Promise<{ success: boolean; data?: ServiceUnit; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<ServiceUnit>(`/api/master/service-units/${id}`, {
        ...localMutationOptions("PUT", payload),
      });
      if (currentUnit.value?.id === id) {
        currentUnit.value = data;
      }
      units.value = units.value.map((u) => (u.id === id ? { ...u, ...data } : u));
      refreshNuxtData("units-list");
      debugUnitsState("update", id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUnit(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/service-units/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      units.value = units.value.filter((u) => u.id !== id);
      refreshNuxtData("units-list");
      if (currentUnit.value?.id === id) {
        currentUnit.value = null;
      }
      debugUnitsState("delete", id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    units,
    currentUnit,
    stats,
    isLoading,
    fetchUnits,
    getUnit,
    createUnit,
    updateUnit,
    deleteUnit,
  };
}
