import type { Company, Address } from "~/composables/useMasterData";
import type {
  CreateCompanyInput,
  CreateAddressInput,
  UpdateAddressInput,
  CompanyDetails,
  CompanyPagination,
  CompanyQueryParams,
} from "~/composables/useCompanies";

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
      const response = await $fetch<Company[] | { data: Company[]; pagination: CompanyPagination }>(
        "/api/master/companies",
        { params },
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
      return {
        success: false,
        error: getErrorMessage(error),
        data: [],
      };
    }
  },

  async getCompanyById(id: string) {
    try {
      const data = await $fetch<Company>(`/api/master/companies/${id}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getCompanyDetails(id: string) {
    try {
      const data = await $fetch<CompanyDetails>(`/api/master/companies/${id}/details`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createCompany(companyData: CreateCompanyInput) {
    try {
      const data = await $fetch<Company>("/api/master/companies", {
        method: "POST",
        body: companyData,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateCompany(id: string, companyData: Partial<CreateCompanyInput>) {
    try {
      const data = await $fetch<Company>(`/api/master/companies/${id}`, {
        method: "PUT",
        body: companyData,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteCompany(id: string) {
    try {
      await $fetch(`/api/master/companies/${id}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createAddress(companyId: string, addressData: CreateAddressInput) {
    try {
      const data = await $fetch<Address>(`/api/master/companies/${companyId}/addresses`, {
        method: "POST",
        body: addressData,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateAddress(companyId: string, addressId: string, addressData: UpdateAddressInput) {
    try {
      const data = await $fetch<Address>(
        `/api/master/companies/${companyId}/addresses/${addressId}`,
        {
          method: "PUT",
          body: addressData,
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteAddress(companyId: string, addressId: string) {
    try {
      await $fetch(`/api/master/companies/${companyId}/addresses/${addressId}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
