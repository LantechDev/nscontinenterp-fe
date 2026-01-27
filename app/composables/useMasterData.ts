import axios from "axios";

export interface Company {
  id: string;
  name: string;
  email?: string;
}

export interface ContainerType {
  id: string;
  code: string;
  name: string;
}

export interface Vessel {
  id: string;
  name: string;
  imoNumber?: string;
}

export interface PackageType {
  id: string;
  code: string;
  name: string;
}

export function useMasterData() {
    const config = useRuntimeConfig();
    const isLoading = useState<boolean>('master-loading', () => false);

    const api = axios.create({
        baseURL: config.public.apiBase,
        withCredentials: true,
    });

    async function fetchCompanies() {
        try {
            const { data } = await api.get("/master/companies");
            return data;
        } catch (e) {
            console.error("Failed to fetch companies", e);
            return [];
        }
    }

    async function fetchContainerTypes() {
        try {
            const { data } = await api.get("/master/container-types");
            return data;
        } catch (e) {
            console.error("Failed to fetch container types", e);
            return [];
        }
    }

    async function fetchPackageTypes() {
        try {
            const { data } = await api.get("/master/package-types");
            return data;
        } catch (e) {
            console.error("Failed to fetch package types", e);
            return [];
        }
    }

    async function fetchVessels(query?: string) {
        try {
            const { data } = await api.get("/master/vessels", { params: { q: query } });
            return data;
        } catch (e) {
            console.error("Failed to fetch vessels", e);
            return [];
        }
    }

    async function createCompany(name: string) {
        try {
            isLoading.value = true;
            const { data } = await api.post("/master/companies", { name });
            return { success: true, data };
        } catch (error: any) {
            console.error("Failed to create company", error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        } finally {
            isLoading.value = false;
        }
    }

    async function createVessel(name: string) {
        try {
            isLoading.value = true;
            const { data } = await api.post("/master/vessels", { name });
            return { success: true, data };
        } catch (error: any) {
            console.error("Failed to create vessel", error);
            return {
                success: false,
                error: error.response?.data || error.message
            };
        } finally {
            isLoading.value = false;
        }
    }

    return {
        fetchCompanies,
        fetchContainerTypes,
        fetchPackageTypes,
        fetchVessels,
        createCompany,
        createVessel
    }
}
