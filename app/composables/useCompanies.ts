import type { Company, Address } from "./useMasterData";

export type CreateCompanyInput = {
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  notes?: string;
  fullAddress?: string;
  country?: string;
  city?: string;
  isCustomer?: boolean;
  isVendor?: boolean;
};

export type CreateAddressInput = {
  label: string;
  fullAddress: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  eori?: string;
  isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export interface CompanyActivityLog {
  id: string;
  userId: string | null;
  action: string;
  targetModel: string;
  targetId: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CompanyJob {
  id: string;
  jobNumber: string;
  pol: string;
  pod: string;
  commodity: string;
  etd: string | null;
  eta: string | null;
  status?: {
    id: string;
    code: string;
    name: string;
  } | null;
  vessel?: {
    id: string;
    name: string;
  } | null;
  containerType?: {
    id: string;
    code: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface CompanyInvoice {
  id: string;
  invoiceNumber: string;
  subTotal: string | number;
  taxAmount: string | number;
  total: string | number;
  currency: string;
  issuedDate: string;
  dueDate: string;
  status?: {
    id: string;
    code: string;
    name: string;
  } | null;
  type?: {
    id: string;
    code: string;
    name: string;
  } | null;
  createdAt: string;
}

export interface CompanyDetails extends Company {
  activities: CompanyActivityLog[];
  jobs: CompanyJob[];
  invoices: CompanyInvoice[];
  totalJobs: number;
}

export type MappedCompany = Company & {
  address: string;
  type: string;
  status: string;
  totalJobs: number;
  selected: boolean;
};

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

export function useCompanies() {
  const config = useRuntimeConfig();
  const companies = useState<Company[]>("companies", () => []);
  const isLoading = ref(false);

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
      const data = await $fetch<Company[]>(`${config.public.apiBase}/master/companies`, {
        params,
        credentials: "include",
      });
      companies.value = data || [];
      return { success: true, data: companies.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function getCompanyById(
    id: string,
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Company>(`${config.public.apiBase}/master/companies/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function getCompanyDetails(
    id: string,
  ): Promise<{ success: boolean; data?: CompanyDetails; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<CompanyDetails>(
        `${config.public.apiBase}/master/companies/${id}/details`,
        {
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createCompany(
    companyData: CreateCompanyInput,
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Company>(`${config.public.apiBase}/master/companies`, {
        method: "POST",
        body: companyData,
        credentials: "include",
      });
      companies.value = [data, ...companies.value];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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
      const data = await $fetch<Company>(`${config.public.apiBase}/master/companies/${id}`, {
        method: "PUT",
        body: companyData,
        credentials: "include",
      });
      companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...data } : c));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCompany(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/master/companies/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      companies.value = companies.value.filter((c) => c.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  // =====================
  // Address CRUD
  // =====================

  async function createAddress(
    companyId: string,
    addressData: CreateAddressInput,
  ): Promise<{ success: boolean; data?: Address; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Address>(
        `${config.public.apiBase}/master/companies/${companyId}/addresses`,
        {
          method: "POST",
          body: addressData,
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAddress(
    companyId: string,
    addressId: string,
    addressData: UpdateAddressInput,
  ): Promise<{ success: boolean; data?: Address; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Address>(
        `${config.public.apiBase}/master/companies/${companyId}/addresses/${addressId}`,
        {
          method: "PUT",
          body: addressData,
          credentials: "include",
        },
      );
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAddress(
    companyId: string,
    addressId: string,
  ): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(
        `${config.public.apiBase}/master/companies/${companyId}/addresses/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    companies,
    isLoading,
    fetchCompanies,
    getCompanyById,
    getCompanyDetails,
    createCompany,
    updateCompany,
    deleteCompany,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
