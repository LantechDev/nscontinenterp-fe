import type { ComputedRef } from "vue";

export interface Plane {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PlaneStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CreatePlaneInput {
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdatePlaneInput {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
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

export function usePlanes() {
  const planes = useState<Plane[]>("planes-list", () => []);
  const isLoading = ref(false);

  // Computed stats from planes data
  const stats: ComputedRef<PlaneStats> = computed(() => {
    const list = planes.value || [];
    return {
      total: list.length,
      active: list.filter((p) => p.isActive && !p.deletedAt).length,
      inactive: list.filter((p) => !p.isActive || p.deletedAt).length,
    };
  });

  // Fetch planes using $fetch
  async function fetchPlanes(
    search?: string,
  ): Promise<{ success: boolean; data?: Plane[]; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Plane[]>("/api/master/planes", {
        params: { search, _t: Date.now() },
      });
      planes.value = data || [];
      return { success: true, data: planes.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  // Create plane using $fetch
  async function createPlane(
    planeData: CreatePlaneInput,
  ): Promise<{ success: boolean; data?: Plane; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Plane>("/api/master/planes", {
        ...localMutationOptions("POST", planeData),
      });
      await fetchPlanes();
      await refreshNuxtData("planes-list");
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  // Update plane using $fetch
  async function updatePlane(
    id: string,
    planeData: UpdatePlaneInput,
  ): Promise<{ success: boolean; data?: Plane; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Plane>(`/api/master/planes/${id}`, {
        ...localMutationOptions("PUT", planeData),
      });
      await fetchPlanes();
      await refreshNuxtData("planes-list");
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  // Delete plane using $fetch
  async function deletePlane(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/planes/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      await fetchPlanes();
      await refreshNuxtData("planes-list");
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  // Get plane by ID using $fetch
  async function getPlaneById(
    id: string,
  ): Promise<{ success: boolean; data?: Plane; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Plane>(`/api/master/planes/${id}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    planes: planes,
    stats: stats,
    isLoading: isLoading,
    fetchPlanes,
    createPlane,
    updatePlane,
    deletePlane,
    getPlaneById,
  };
}
