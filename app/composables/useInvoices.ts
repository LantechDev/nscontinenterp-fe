export interface Invoice {
  id: string;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  currency: string;
  companyName?: string;
  companyAddress?: string;
  companyId?: string;
  subTotal: number;
  taxId?: string;
  taxAmount: number;
  total: number;
  balanceDue: number;
  status: {
    code: string;
    name: string;
  };
  company: {
    name: string;
  };
  job?: {
    id: string;
    jobNumber: string;
  };
  createdAt: string;
  paymentAllocations?: Array<{
    id: string;
    amount: number;
    payment: {
      id: string;
      paymentNumber?: string;
      paymentDate: string;
      status: string;
      paymentMethod?: {
        name: string;
        code: string;
      };
      reference?: string;
    };
  }>;
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
    amount: number;
    service?: {
      id: string;
      name: string;
    };
  }>;
  job?: {
    id: string;
    jobNumber: string;
    tradeTypeId?: string;
    tradeType?: {
      id: string;
      name: string;
    };
    vessels?: Array<{
      id: string;
      vesselName: string;
      vessel?: { name: string };
      voyageNumber: string;
    }>;
    pol?: string;
    pod?: string;
    polName?: string;
    podName?: string;
    polPort?: { name: string };
    podPort?: { name: string };
    customerReference?: string;
    billsOfLading?: Array<{
      shipperReferences: string[];
    }>;
  };
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
  const isLoading = ref(false);

  async function deleteInvoice(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await $fetch(`/api/finance/invoice/${id}`, {
        method: "DELETE",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async function fetchInvoices(
    jobId?: string,
    filters?: { companyId?: string; status?: string },
  ): Promise<{
    success: boolean;
    data?: Invoice[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<Invoice[]>(`/api/finance/invoice`, {
        query: {
          ...(jobId ? { jobId } : {}),
          ...(filters?.companyId ? { companyId: filters.companyId } : {}),
          ...(filters?.status ? { status: filters.status } : {}),
        },
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
      const data = await $fetch<InvoiceDetail>(`/api/finance/invoice/${id}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createInvoice(data: {
    jobId?: string;
    invoiceNumber: string;
    companyId: string;
    issuedDate: string;
    dueDate: string;
    subTotal: number;
    taxId?: string;
    taxAmount: number;
    total: number;
    balanceDue: number;
    items: Array<{
      serviceId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
    notes?: string;
  }): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Invoice>(`/api/finance/invoice`, {
        method: "POST",
        body: data,
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
      invoiceNumber: string;
      issuedDate: string;
      dueDate: string;
      companyId: string;
      jobId: string;
      notes: string;
      subTotal: number;
      taxId: string;
      taxAmount: number;
      total: number;
      balanceDue: number;
      statusId: string;
      items: Array<{
        id?: string;
        serviceId?: string;
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
      }>;
    }>,
  ): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Invoice>(`/api/finance/invoice/${id}`, {
        method: "PATCH",
        body: data,
      });
      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function voidInvoice(
    id: string,
  ): Promise<{ success: boolean; data?: Invoice; error?: string }> {
    isLoading.value = true;
    try {
      const responseData = await $fetch<Invoice>(`/api/finance/invoice/${id}/void`, {
        method: "POST",
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
    voidInvoice,
  };
}
