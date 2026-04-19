import { type AuthResponse } from "../types/auth";
import type { Vessel } from "./useVessels";

export { type Vessel };

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  country: string;
  city?: string;
  street?: string;
  postalCode?: string;
  state?: string;
  eori?: string;
  taxId?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyCategory {
  id: string;
  name: string;
  code: string;
}

export interface Company {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  totalJobs?: number;
  description?: string;
  notes?: string;
  addresses?: Address[];
  categoryId?: string;
  category?: CompanyCategory;
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

export interface PackageType {
  id: string;
  code: string;
  name: string;
}

export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
  province?: string;
  timezone?: string;
}

export interface PaymentMethod {
  id: string;
  code: string;
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

function handleApiError<T = unknown>(error: unknown): AuthResponse<T> {
  return { success: false, error: getErrorMessage(error) };
}

export function useMasterData() {
  const isLoading = ref(false);

  async function fetchCompanies() {
    try {
      const response = await $fetch<Company[] | { data?: Company[] }>("/api/master/companies");
      return Array.isArray(response) ? response : response.data || [];
    } catch {
      return [];
    }
  }

  async function fetchCompaniesWithParams(params?: {
    search?: string;
    type?: "ALL" | "CUSTOMER" | "VENDOR" | "BOTH";
    status?: "ALL" | "ACTIVE" | "INACTIVE";
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await $fetch<Company[] | { data?: Company[] }>("/api/master/companies", {
        params,
      });
      return Array.isArray(response) ? response : response.data || [];
    } catch {
      return [];
    }
  }

  async function fetchContainerTypes() {
    try {
      const data = await $fetch<ContainerType[]>("/api/master/container-types");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchPackageTypes() {
    try {
      const data = await $fetch<PackageType[]>("/api/master/package-types");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchCompanyCategories() {
    try {
      const data = await $fetch<CompanyCategory[]>("/api/master/company-categories");
      return data;
    } catch {
      return [];
    }
  }

  async function fetchVessels(query?: string) {
    try {
      const data = await $fetch<Vessel[]>("/api/master/vessels", {
        params: { search: query },
      });
      return data;
    } catch {
      return [];
    }
  }

  async function fetchPorts(query?: string) {
    try {
      const data = await $fetch<Port[]>("/api/master/ports", {
        params: { search: query },
      });
      return data;
    } catch {
      return [];
    }
  }

  async function createCompany(
    name: string,
    address?: {
      fullAddress: string;
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      eori?: string;
      taxId?: string;
    },
  ): Promise<AuthResponse<Company>> {
    try {
      isLoading.value = true;
      // Default to CUSTOMER for now as used in Create Job form
      const data = await $fetch<Company>(`/api/master/companies`, {
        method: "POST",
        body: {
          name,
          isCustomer: true,
          isVendor: false,
          ...address,
        },
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
      const data = await $fetch<Vessel>(`/api/master/vessels`, {
        method: "POST",
        body: { name },
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<Vessel>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCompanyCategory(name: string): Promise<AuthResponse<CompanyCategory>> {
    try {
      isLoading.value = true;
      const data = await $fetch<CompanyCategory>(`/api/master/company-categories`, {
        method: "POST",
        body: { name },
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError<CompanyCategory>(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPaymentMethods() {
    try {
      const data = await $fetch<PaymentMethod[]>(`/api/master/payment-methods`);
      return data;
    } catch {
      return [];
    }
  }

  return {
    isLoading,
    fetchCompanies,
    fetchCompaniesWithParams,
    fetchContainerTypes,
    fetchPackageTypes,
    fetchVessels,
    fetchPorts,
    fetchPaymentMethods,
    fetchCompanyCategories,
    createCompany,
    createVessel,
    createCompanyCategory,
  };
}
