import axios, { type AxiosError } from "axios";
import type { Company } from "./useMasterData";

export type CreateCompanyInput = {
  name: string;
  email?: string;
  phone?: string;
  fullAddress?: string;
  country?: string;
  city?: string;
  isCustomer?: boolean;
  isVendor?: boolean;
};

export type MappedCompany = Company & {
  address: string;
  type: string;
  status: string;
  totalJobs: number;
  selected: boolean;
};

export function useCompanies() {
  const companies = useState<Company[]>("companies", () => []);
  const isLoading = useState<boolean>("companies-loading", () => false);
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: `${config.public.apiBase}/master`,
    withCredentials: true,
  });

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

  async function fetchCompanies(params?: {
    search?: string;
    type?: "ALL" | "CUSTOMER" | "VENDOR";
  }): Promise<{
    success: boolean;
    data?: Company[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<Company[]>("/companies", { params });
      companies.value = data || [];
      return { success: true, data: companies.value };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getCompanyById(
    id: string,
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<Company>(`/companies/${id}`);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCompany(
    companyData: CreateCompanyInput,
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    isLoading.value = true;
    try {
      const { data } = await api.post<Company>("/companies", companyData);
      companies.value = [data, ...companies.value];
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCompany(
    id: string,
    companyData: Partial<Omit<Company, "id">>,
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    isLoading.value = true;
    try {
      const { data } = await api.put<Company>(`/companies/${id}`, companyData);
      companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...data } : c));
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCompany(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await api.delete(`/companies/${id}`);
      companies.value = companies.value.filter((c) => c.id !== id);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    companies,
    isLoading,
    fetchCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}
