import type { Company, Address } from "~/composables/useMasterData";
import type {
  CreateCompanyInput,
  CreateAddressInput,
  UpdateAddressInput,
  CompanyDetails,
} from "~/composables/useCompanies";

function getApiBase() {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: { message?: string; error?: string } }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

export const companyApi = {
  async fetchCompanies(params?: { search?: string; type?: "ALL" | "CUSTOMER" | "VENDOR" }) {
    try {
      const data = await $fetch<Company[]>(`${getApiBase()}/master/companies`, {
        params,
        credentials: "include",
      });
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: getErrorMessage(error), data: [] };
    }
  },

  async getCompanyById(id: string) {
    try {
      const data = await $fetch<Company>(`${getApiBase()}/master/companies/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getCompanyDetails(id: string) {
    try {
      const data = await $fetch<CompanyDetails>(`${getApiBase()}/master/companies/${id}/details`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createCompany(companyData: CreateCompanyInput) {
    try {
      const data = await $fetch<Company>(`${getApiBase()}/master/companies`, {
        method: "POST",
        body: companyData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateCompany(id: string, companyData: Partial<Omit<Company, "id">>) {
    try {
      const data = await $fetch<Company>(`${getApiBase()}/master/companies/${id}`, {
        method: "PUT",
        body: companyData,
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteCompany(id: string) {
    try {
      await $fetch(`${getApiBase()}/master/companies/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createAddress(companyId: string, addressData: CreateAddressInput) {
    try {
      const data = await $fetch<Address>(
        `${getApiBase()}/master/companies/${companyId}/addresses`,
        {
          method: "POST",
          body: addressData,
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateAddress(companyId: string, addressId: string, addressData: UpdateAddressInput) {
    try {
      const data = await $fetch<Address>(
        `${getApiBase()}/master/companies/${companyId}/addresses/${addressId}`,
        {
          method: "PUT",
          body: addressData,
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteAddress(companyId: string, addressId: string) {
    try {
      await $fetch(`${getApiBase()}/master/companies/${companyId}/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
