export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
}

export interface ServiceUnit {
  id: string;
  code: string;
  name: string;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  categoryId?: string | null;
  category?: ServiceCategory | null;
  unitId?: string | null;
  unit?: ServiceUnit | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateService {
  code: string;
  name: string;
  categoryId?: string;
  unitId?: string;
  isActive?: boolean;
}

export interface UpdateService {
  code?: string;
  name?: string;
  categoryId?: string;
  unitId?: string;
  isActive?: boolean;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

type ApiResponse<T> = { success: boolean; data?: T; error?: string };

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

export function useServices() {
  const isLoading = ref(false);
  const services = useState<Service[]>("services-list", () => []);
  const currentService = useState<Service | null>("services-current", () => null);
  const categories = useState<ServiceCategory[]>("service-categories-list", () => []);
  const units = useState<ServiceUnit[]>("service-units-list", () => []);

  async function fetchServices(
    search?: string,
    categoryId?: string,
  ): Promise<ApiResponse<Service[]>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Service[]>("/api/master/services", {
        params: { search, categoryId },
      });
      services.value = data || [];
      return { success: true, data: services.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    try {
      const data = await $fetch<ServiceCategory[]>("/api/master/service-categories");
      categories.value = data || [];
      return { success: true, data: categories.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function fetchUnits(): Promise<ApiResponse<ServiceUnit[]>> {
    try {
      const data = await $fetch<ServiceUnit[]>("/api/master/service-units");
      units.value = data || [];
      return { success: true, data: units.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function getService(id: string): Promise<ApiResponse<Service>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Service>(`/api/master/services/${id}`);
      currentService.value = data;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createService(payload: CreateService): Promise<ApiResponse<Service>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Service>("/api/master/services", {
        method: "POST",
        body: payload,
      });
      services.value = [...services.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateService(id: string, payload: UpdateService): Promise<ApiResponse<Service>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Service>(`/api/master/services/${id}`, {
        method: "PUT",
        body: payload,
      });
      if (currentService.value?.id === id) {
        currentService.value = data;
      }
      services.value = services.value.map((s) => (s.id === id ? { ...s, ...data } : s));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteService(id: string): Promise<ApiResponse<void>> {
    isLoading.value = true;
    try {
      await $fetch(`/api/master/services/${id}`, {
        method: "DELETE",
      });
      services.value = services.value.filter((s) => s.id !== id);
      if (currentService.value?.id === id) {
        currentService.value = null;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    services,
    currentService,
    categories,
    units,
    isLoading,
    fetchServices,
    fetchCategories,
    fetchUnits,
    getService,
    createService,
    updateService,
    deleteService,
  };
}
