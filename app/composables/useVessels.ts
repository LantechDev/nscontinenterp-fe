import type { ComputedRef } from "vue";

export interface Vessel {
  id: string;
  name: string;
  imoNumber: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VesselStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CreateVesselInput {
  name: string;
  imoNumber?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateVesselInput {
  name?: string;
  imoNumber?: string;
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

export function useVessels() {
  const vessels = useState<Vessel[]>("vessels", () => []);
  const isLoading = ref(false);

  // Computed stats from vessels data
  const stats: ComputedRef<VesselStats> = computed(() => {
    const list = vessels.value || [];
    return {
      total: list.length,
      active: list.filter((v) => v.isActive && !v.deletedAt).length,
      inactive: list.filter((v) => !v.isActive || v.deletedAt).length,
    };
  });

  // Fetch vessels using $fetch
  const fetchVessels = async (
    search?: string,
  ): Promise<{ success: boolean; data?: Vessel[]; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<Vessel[]>("/api/master/vessels", {
        params: { search },
      });
      vessels.value = data || [];
      return { success: true, data: vessels.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  // Create vessel using $fetch
  const createVessel = async (
    vesselData: CreateVesselInput,
  ): Promise<{ success: boolean; data?: Vessel; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<Vessel>("/api/master/vessels", {
        method: "POST",
        body: vesselData,
      });
      vessels.value = [data, ...vessels.value];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  // Update vessel using $fetch
  const updateVessel = async (
    id: string,
    vesselData: UpdateVesselInput,
  ): Promise<{ success: boolean; data?: Vessel; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<Vessel>(`/api/master/vessels/${id}`, {
        method: "PUT",
        body: vesselData,
      });
      vessels.value = vessels.value.map((v) => (v.id === id ? { ...v, ...data } : v));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete vessel using $fetch
  const deleteVessel = async (id: string): Promise<{ success: boolean; error?: string }> => {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/vessels/${id}`, {
        method: "DELETE",
      });
      vessels.value = vessels.value.filter((v) => v.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  // Get vessel by ID using $fetch
  const getVesselById = async (
    id: string,
  ): Promise<{ success: boolean; data?: Vessel; error?: string }> => {
    isLoading.value = true;
    try {
      const data = await $fetch<Vessel>(`/api/master/vessels/${id}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    vessels: readonly(vessels),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchVessels,
    createVessel,
    updateVessel,
    deleteVessel,
    getVesselById,
  };
}
