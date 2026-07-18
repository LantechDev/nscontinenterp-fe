export type LocationType = "SEA_PORT" | "AIRPORT";
export type LocationSource = "SYSTEM" | "CUSTOM";

export interface TransportLocation {
  id?: string;
  type?: LocationType;
  code: string;
  name: string;
  city?: string;
  country: string;
  countryCode?: string;
  province?: string;
  timezone?: string;
  iataCode?: string;
  icaoCode?: string;
  source?: LocationSource;
  isActive?: boolean;
}

export interface SaveTransportLocationPayload {
  type: LocationType;
  code: string;
  name: string;
  city?: string | null;
  country: string;
  countryCode?: string | null;
  province?: string | null;
  timezone?: string | null;
  iataCode?: string | null;
  icaoCode?: string | null;
  isActive?: boolean;
}

export interface PortsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PortsStats {
  total: number;
  active: number;
  system: number;
  custom: number;
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

export function usePorts() {
  const ports = ref<TransportLocation[]>([]);
  const pagination = ref<PortsPagination>({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const stats = ref<PortsStats>({ total: 0, active: 0, system: 0, custom: 0 });
  const isLoading = ref(false);

  async function fetchPorts(params?: {
    search?: string;
    type?: "ocean" | "air";
    page?: number;
    limit?: number;
    status?: "all" | "active" | "inactive";
    source?: "all" | "SYSTEM" | "CUSTOM";
    country?: string;
    city?: string;
    paginated?: boolean;
  }): Promise<TransportLocation[]> {
    isLoading.value = true;
    try {
      if (params?.paginated) {
        const response = await $fetch<{
          data: TransportLocation[];
          pagination: PortsPagination;
          stats: PortsStats;
        }>("/api/master/ports", {
          params: {
            paginated: true,
            q: params.search || undefined,
            type: params.type || "ocean",
            page: params.page || 1,
            limit: params.limit || 25,
            status: params.status || "active",
            source: params.source || "all",
            country: params.country || undefined,
            city: params.city || undefined,
          },
        });
        ports.value = response.data;
        pagination.value = response.pagination;
        stats.value = response.stats;
        return response.data;
      }

      const data = await $fetch<TransportLocation[]>("/api/master/ports", {
        params: {
          q: params?.search || undefined,
          type: params?.type || "ocean",
          limit: params?.limit || 100,
        },
      });
      ports.value = data;
      return data;
    } catch {
      ports.value = [];
      pagination.value = { page: 1, limit: params?.limit || 25, total: 0, totalPages: 0 };
      stats.value = { total: 0, active: 0, system: 0, custom: 0 };
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function createPort(payload: SaveTransportLocationPayload) {
    isLoading.value = true;
    try {
      const data = await $fetch<TransportLocation>("/api/master/ports", {
        method: "POST",
        body: payload,
      });
      await fetchPorts({ type: payload.type === "AIRPORT" ? "air" : "ocean" });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePort(id: string, payload: Partial<SaveTransportLocationPayload>) {
    isLoading.value = true;
    try {
      const data = await $fetch<TransportLocation>(`/api/master/ports/${id}`, {
        method: "PUT",
        body: payload,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePort(id: string) {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/ports/${id}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    ports,
    pagination,
    stats,
    isLoading,
    fetchPorts,
    createPort,
    updatePort,
    deletePort,
  };
}
