import axios, { type AxiosError } from "axios";

export interface Payment {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  invoice: {
    invoiceNumber: string;
    companyId?: string;
  };
  invoiceNumber?: string;
  companyName?: string;
  paymentMethod?: {
    code: string;
    name: string;
  };
  reference?: string;
  notes?: string;
  recorder?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface PaymentDetail {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  invoice: {
    id: string;
    invoiceNumber: string;
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
  };
  paymentMethod?: {
    code: string;
    name: string;
  };
  reference?: string;
  notes?: string;
  recorder?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const deletePayment = async (id: string) => {
  await axios.delete(`${useRuntimeConfig().public.apiBase}/finance/payment/${id}`);
};

export function usePayments() {
  const config = useRuntimeConfig();
  const isLoading = useState<boolean>("payments-loading", () => false);

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

  async function fetchPayments(): Promise<{
    success: boolean;
    data?: Payment[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<Payment[]>("/finance/payment");
      return { success: true, data };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("[Payments] Failed to fetch:", axiosError.response?.data || axiosError.message);
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPaymentById(
    id: string,
  ): Promise<{ success: boolean; data?: PaymentDetail; error?: string }> {
    isLoading.value = true;
    try {
      const { data } = await api.get<PaymentDetail>(`/finance/payment/${id}`);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createPayment(data: {
    invoiceId: string;
    paymentDate: string;
    amount: number;
    paymentMethodId?: string;
    reference?: string;
    notes?: string;
  }): Promise<{ success: boolean; data?: Payment; error?: string }> {
    isLoading.value = true;
    try {
      const { data: responseData } = await api.post<Payment>("/finance/payment", data);
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePayment(
    id: string,
    data: Partial<{
      paymentDate: string;
      amount: number;
      paymentMethodId: string;
      reference: string;
      notes: string;
    }>,
  ): Promise<{ success: boolean; data?: Payment; error?: string }> {
    isLoading.value = true;
    try {
      const { data: responseData } = await api.patch<Payment>(`/finance/payment/${id}`, data);
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    fetchPayments,
    fetchPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
