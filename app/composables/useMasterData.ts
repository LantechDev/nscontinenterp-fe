import axios from "axios";

import { type AuthResponse } from "../types/auth";

export interface Address {
  id: string;
  fullAddress: string;
  country?: string;
  city?: string;
  street?: string;
  postalCode?: string;
  state?: string;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
  isVendor: boolean;
  isCustomer: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  const isLoading = useState<boolean>("master-loading", () => false);

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
  });

  type ErrorResponse = {
    message?: string;
    error?: string;
  };

  function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
    const axiosError = error as { response?: { data?: ErrorResponse }; message?: string };
    const apiError = axiosError.response?.data;
    const errorMessage =
      typeof apiError === "string"
        ? apiError
        : apiError?.message || apiError?.error || axiosError.message || "An error occurred";

    return { success: false, error: errorMessage };
  }

  async function fetchCompanies() {
    try {
      const { data } = await api.get<Company[]>("/master/companies");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchContainerTypes() {
    try {
      const { data } = await api.get<ContainerType[]>("/master/container-types");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchPackageTypes() {
    try {
      const { data } = await api.get<PackageType[]>("/master/package-types");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchVessels(query?: string) {
    try {
      const { data } = await api.get<Vessel[]>("/master/vessels", { params: { q: query } });
      return data;
    } catch {
      return [];
    }
  }

  async function createCompany(name: string): Promise<AuthResponse<Company>> {
    try {
      isLoading.value = true;
      // Default to CUSTOMER for now as used in Create Job form
      const { data } = await api.post<Company>("/master/companies", {
        name,
        isCustomer: true,
        isVendor: false,
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<Company>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createVessel(name: string): Promise<AuthResponse<Vessel>> {
    try {
      isLoading.value = true;
      const { data } = await api.post<Vessel>("/master/vessels", { name });
      return { success: true, data };
    } catch (error) {
      return handleApiError<Vessel>(error);
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
    createVessel,
  };
}
