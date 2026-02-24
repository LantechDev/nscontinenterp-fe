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

export function usePayments() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  async function deletePayment(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await $fetch(`${config.public.apiBase}/finance/payment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function fetchPayments(): Promise<{
    success: boolean;
    data?: Payment[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Payment[]>(`${config.public.apiBase}/finance/payment`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      console.error("[Payments] Failed to fetch:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPaymentById(
    id: string,
  ): Promise<{ success: boolean; data?: PaymentDetail; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PaymentDetail>(`${config.public.apiBase}/finance/payment/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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
      const responseData = await $fetch<Payment>(`${config.public.apiBase}/finance/payment`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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
      const responseData = await $fetch<Payment>(`${config.public.apiBase}/finance/payment/${id}`, {
        method: "PATCH",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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
