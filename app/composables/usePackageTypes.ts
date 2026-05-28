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

export function usePackageTypes() {
  const packageTypes = useState<PackageType[]>("package-types", () => []);
  const isLoading = ref(false);

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
        method: "POST",
        body: payload,
      });
      packageTypes.value = [...packageTypes.value, data];
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
        method: "PUT",
        body: payload,
      });
      packageTypes.value = packageTypes.value.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      );
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
        method: "DELETE",
      });
      packageTypes.value = packageTypes.value.filter((item) => item.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    packageTypes: readonly(packageTypes),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchPackageTypes,
    createPackageType,
    updatePackageType,
    deletePackageType,
  };
}
