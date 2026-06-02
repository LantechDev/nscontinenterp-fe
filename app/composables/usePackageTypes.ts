import type { PackageType } from "~/composables/useMasterData";

export interface CreatePackageTypeInput {
  name: string;
  code?: string;
}

export interface UpdatePackageTypeInput {
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
    ? { method, skipNuxtDataRefresh: true }
    : { method, body, skipNuxtDataRefresh: true };

export function usePackageTypes() {
  const packageTypes = useState<PackageType[]>("package-types-list", () => []);
  const isLoading = ref(false);

  const debugPackageTypesState = (action: string, id?: string) => {
    if (!import.meta.client || localStorage.getItem("debug_api_refresh") !== "true") return;

    console.debug("[Package Type UI state]", {
      source: 'useState("package-types")',
      action,
      item: id ? packageTypes.value.find((item) => item.id === id) : null,
      total: packageTypes.value.length,
    });
  };

  const stats = computed(() => ({
    total: packageTypes.value.length,
  }));

  async function fetchPackageTypes(): Promise<{
    success: boolean;
    data?: PackageType[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PackageType[]>("/api/master/package-types");
      packageTypes.value = data || [];
      return { success: true, data: packageTypes.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createPackageType(
    payload: CreatePackageTypeInput,
  ): Promise<{ success: boolean; data?: PackageType; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PackageType>("/api/master/package-types", {
        ...localMutationOptions("POST", payload),
      });
      packageTypes.value = [...packageTypes.value, data];
      debugPackageTypesState("create", data.id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePackageType(
    id: string,
    payload: UpdatePackageTypeInput,
  ): Promise<{ success: boolean; data?: PackageType; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PackageType>(`/api/master/package-types/${id}`, {
        ...localMutationOptions("PUT", payload),
      });
      packageTypes.value = packageTypes.value.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      );
      debugPackageTypesState("update", id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePackageType(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/package-types/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      packageTypes.value = packageTypes.value.filter((item) => item.id !== id);
      debugPackageTypesState("delete", id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    packageTypes: packageTypes,
    stats: stats,
    isLoading: isLoading,
    fetchPackageTypes,
    createPackageType,
    updatePackageType,
    deletePackageType,
  };
}
