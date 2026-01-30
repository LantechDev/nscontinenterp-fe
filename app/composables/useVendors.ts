import axios, { type AxiosError } from "axios";

export interface Vendor {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    isVendor: boolean;
    isCustomer: boolean;
    isActive: boolean;
    addresses?: VendorAddress[];
    createdAt: string;
    updatedAt: string;
}

export interface VendorAddress {
    id: string;
    label: string;
    fullAddress: string;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country: string;
    eori?: string | null;
    taxId?: string | null;
    isDefault: boolean;
}

export interface CreateVendor {
    name: string;
    email?: string;
    phone?: string;
    address?: {
        label?: string;
        fullAddress: string;
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        eori?: string;
        taxId?: string;
    };
}

export interface UpdateVendor {
    name?: string;
    email?: string;
    phone?: string;
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

export function useVendors() {
    const config = useRuntimeConfig();
    const isLoading = useState<boolean>("vendors-loading", () => false);
    const vendors = useState<Vendor[]>("vendors-list", () => []);
    const currentVendor = useState<Vendor | null>("vendors-current", () => null);

    const api = axios.create({
        baseURL: `${config.public.apiBase}/master/vendors`,
        withCredentials: true,
    });

    async function fetchVendors(search?: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Vendor[]>("/", { params: { search } });
            vendors.value = data || [];
            return { success: true, data: vendors.value };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function getVendor(id: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Vendor>(`/${id}`);
            currentVendor.value = data;
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createVendor(payload: CreateVendor) {
        isLoading.value = true;
        try {
            const { data } = await api.post<Vendor>("/", payload);
            vendors.value = [...vendors.value, data];
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateVendor(id: string, payload: UpdateVendor) {
        isLoading.value = true;
        try {
            const { data } = await api.put<Vendor>(`/${id}`, payload);
            if (currentVendor.value?.id === id) {
                currentVendor.value = data;
            }
            vendors.value = vendors.value.map((v) => (v.id === id ? { ...v, ...data } : v));
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteVendor(id: string) {
        isLoading.value = true;
        try {
            await api.delete(`/${id}`);
            vendors.value = vendors.value.filter((v) => v.id !== id);
            if (currentVendor.value?.id === id) {
                currentVendor.value = null;
            }
            return { success: true };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        vendors,
        currentVendor,
        isLoading,
        fetchVendors,
        getVendor,
        createVendor,
        updateVendor,
        deleteVendor,
    };
}
