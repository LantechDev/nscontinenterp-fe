import type { Company, Address } from "~/composables/useMasterData";
import type {
  CreateCompanyInput,
  CreateAddressInput,
  UpdateAddressInput,
  CompanyDetails,
  CompanyPagination,
  CompanyQueryParams,
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
  async fetchCompanies(params?: CompanyQueryParams) {
    try {
      const headers = useRequestHeaders(["cookie"]);
      const response = await $fetch<Company[] | { data: Company[]; pagination: CompanyPagination }>(
        `${getApiBase()}/master/companies`,
        {
          params,
          credentials: "include",
          headers,
        },
      );

      if (Array.isArray(response)) {
        return { success: true, data: response || [] };
      }

      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      return { success: false, error: getErrorMessage(error), data: [] };
    }
  },

  async getCompanyById(id: string) {
    try {
      const data = await $fetch<Company>(`${getApiBase()}/master/companies/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateCompany(id: string, companyData: Partial<CreateCompanyInput>) {
    try {
      const data = await $fetch<Company>(`${getApiBase()}/master/companies/${id}`, {
        method: "PUT",
        body: companyData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
          headers: {
            "Content-Type": "application/json",
          },
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
          headers: {
            "Content-Type": "application/json",
          },
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
