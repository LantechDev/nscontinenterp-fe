import axios, { type AxiosError } from "axios";

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
    vendorPrice?: number | null;
    customerPrice?: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateService {
    code: string;
    name: string;
    categoryId?: string;
    unitId?: string;
    vendorPrice?: number;
    customerPrice?: number;
}

export interface UpdateService {
    code?: string;
    name?: string;
    categoryId?: string;
    unitId?: string;
    vendorPrice?: number;
    customerPrice?: number;
    isActive?: boolean;
}

type ErrorResponse = {
    message?: string;
    error?: string;
};

function handleApiError(error: unknown): { success: false; error: string } {
    const axiosError = error as AxiosError<ErrorResponse>;
    const apiError = axiosError.response?.data;
    const errorMessage =
        typeof apiError === "string"
            ? apiError
            : apiError?.message || apiError?.error || axiosError.message || "An error occurred";

    return { success: false, error: errorMessage };
}

export function useServices() {
    const config = useRuntimeConfig();
    const isLoading = useState<boolean>("services-loading", () => false);
    const services = useState<Service[]>("services-list", () => []);
    const currentService = useState<Service | null>("services-current", () => null);

    const api = axios.create({
        baseURL: `${config.public.apiBase}/master/services`,
        withCredentials: true,
    });

    async function fetchServices(search?: string, categoryId?: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Service[]>("/", { params: { search, categoryId } });
            services.value = data || [];
            return { success: true, data: services.value };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function getService(id: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Service>(`/${id}`);
            currentService.value = data;
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createService(payload: CreateService) {
        isLoading.value = true;
        try {
            const { data } = await api.post<Service>("/", payload);
            services.value = [...services.value, data];
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateService(id: string, payload: UpdateService) {
        isLoading.value = true;
        try {
            const { data } = await api.put<Service>(`/${id}`, payload);
            if (currentService.value?.id === id) {
                currentService.value = data;
            }
            services.value = services.value.map((s) => (s.id === id ? { ...s, ...data } : s));
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteService(id: string) {
        isLoading.value = true;
        try {
            await api.delete(`/${id}`);
            services.value = services.value.filter((s) => s.id !== id);
            if (currentService.value?.id === id) {
                currentService.value = null;
            }
            return { success: true };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        services,
        currentService,
        isLoading,
        fetchServices,
        getService,
        createService,
        updateService,
        deleteService,
    };
}
