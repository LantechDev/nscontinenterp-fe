import axios, { type AxiosError } from "axios";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: {
    code: string;
    name: string;
  };
  company: {
    name: string;
  };
  createdAt: string;
}

export interface InvoiceDetail extends Invoice {
  company: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    service?: {
      name: string;
    };
  }>;
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod?: {
      name: string;
    };
  }>;
  notes?: string;
}

const deleteInvoice = async (id: string) => {
  await axios.delete(`${useRuntimeConfig().public.apiBase}/finance/invoice/${id}`);
};

export function useInvoices() {
  const config = useRuntimeConfig();
  const isLoading = useState<boolean>("invoices-loading", () => false);

  const api = axios.create({
    baseURL: config.public.apiBase,
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

  async function fetchInvoices(): Promise<{
    success: boolean;
    data?: Invoice[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<Invoice[]>("/finance/invoice");
      return { success: true, data };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("[Invoices] Failed to fetch:", axiosError.response?.data || axiosError.message);
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchInvoiceById(
    id: string,
  ): Promise<{ success: boolean; data?: InvoiceDetail; error?: string }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<InvoiceDetail>(`/finance/invoice/${id}`);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createInvoice(data: {
    companyId: string;
    invoiceDate: string;
    dueDate: string;
    items: Array<{
      serviceId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    notes?: string;
  }): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    isLoading.value = true;
    try {
      const { data: responseData } = await api.post<Invoice>("/finance/invoice", data);
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateInvoice(
    id: string,
    data: Partial<{
      invoiceDate: string;
      dueDate: string;
      statusId: string;
      notes: string;
    }>,
  ): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    isLoading.value = true;
    try {
      const { data: responseData } = await api.patch<Invoice>(`/finance/invoice/${id}`, data);
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };
}
