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

export function useInvoices() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);

  async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await $fetch(`${config.public.apiBase}/finance/invoice/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function fetchInvoices(): Promise<{
    success: boolean;
    data?: Invoice[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Invoice[]>(`${config.public.apiBase}/finance/invoice`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      console.error("[Invoices] Failed to fetch:", error);
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchInvoiceById(
    id: string,
  ): Promise<{ success: boolean; data?: InvoiceDetail; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<InvoiceDetail>(`${config.public.apiBase}/finance/invoice/${id}`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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
      const responseData = await $fetch<Invoice>(`${config.public.apiBase}/finance/invoice`, {
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
      const responseData = await $fetch<Invoice>(`${config.public.apiBase}/finance/invoice/${id}`, {
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
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };
}
