import type { Company } from "./useMasterData";
import { companyApi } from "~/lib/company-api";

export type CreateCompanyInput = {
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  notes?: string;
  fullAddress?: string;
  street?: string;
  country?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  eori?: string;
  taxId?: string;
  isCustomer?: boolean;
  isVendor?: boolean;
};

export type CompanyQueryParams = {
  search?: string;
  type?: "ALL" | "CUSTOMER" | "VENDOR" | "BOTH";
  status?: "ALL" | "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
};

export interface CompanyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
  user?: { id: string; name: string; email: string } | null;
}

export interface CompanyJob {
  id: string;
  jobNumber: string;
  pol: string;
  pod: string;
  commodity: string;
  etd: string | null;
  eta: string | null;
  status?: { id: string; code: string; name: string } | null;
  vessel?: { id: string; name: string } | null;
  containerType?: { id: string; code: string; name: string } | null;
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
  status?: { id: string; code: string; name: string } | null;
  type?: { id: string; code: string; name: string } | null;
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
};

export function useCompanies() {
  const companies = useState<Company[]>("companies", () => []);
  const pagination = useState<CompanyPagination>("company-pagination", () => ({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }));
  const isLoading = ref(false);

  async function fetchCompanies(params?: CompanyQueryParams) {
    isLoading.value = true;
    try {
      const result = await companyApi.fetchCompanies(params);
      if (result.success && result.data) {
        companies.value = result.data;
        pagination.value = result.pagination || {
          page: params?.page || 1,
          limit: params?.limit || result.data.length || 10,
          total: result.data.length,
          totalPages: result.data.length > 0 ? 1 : 0,
        };
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function getCompanyById(id: string) {
    isLoading.value = true;
    try {
      return await companyApi.getCompanyById(id);
    } finally {
      isLoading.value = false;
    }
  }

  async function getCompanyDetails(id: string) {
    isLoading.value = true;
    try {
      return await companyApi.getCompanyDetails(id);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCompany(companyData: CreateCompanyInput) {
    isLoading.value = true;
    try {
      const result = await companyApi.createCompany(companyData);
      if (result.success && result.data) {
        companies.value = [result.data, ...companies.value];
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCompany(id: string, companyData: Partial<CreateCompanyInput>) {
    isLoading.value = true;
    try {
      const result = await companyApi.updateCompany(id, companyData);
      if (result.success && result.data) {
        companies.value = companies.value.map((c) => (c.id === id ? { ...c, ...result.data } : c));
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCompany(id: string) {
    isLoading.value = true;
    try {
      const result = await companyApi.deleteCompany(id);
      if (result.success) {
        companies.value = companies.value.filter((c) => c.id !== id);
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }

  async function createAddress(companyId: string, addressData: CreateAddressInput) {
    isLoading.value = true;
    try {
      return await companyApi.createAddress(companyId, addressData);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAddress(
    companyId: string,
    addressId: string,
    addressData: UpdateAddressInput,
  ) {
    isLoading.value = true;
    try {
      return await companyApi.updateAddress(companyId, addressId, addressData);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAddress(companyId: string, addressId: string) {
    isLoading.value = true;
    try {
      return await companyApi.deleteAddress(companyId, addressId);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    companies,
    pagination,
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
