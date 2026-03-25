export interface Invoice {
  id: string;
  invoiceNumber: string;
  issuedDate: string;
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
  job?: {
    id: string;
    jobNumber: string;
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
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod?: {
      name: string;
    };
  }>;
  notes?: string;
  issuedDate: string;
  subTotal: number;
  taxAmount: number;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

/**
 * Format invoice for display in dropdown
 * Format: INV-001 | Company Name | Rp 1,000,000
 */
function formatInvoiceDisplay(invoice: Invoice): string {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(invoice.total);

  return `${invoice.invoiceNumber} | ${invoice.company.name} | ${formattedAmount}`;
}

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

  async function fetchInvoices(status?: string): Promise<{
    success: boolean;
    data?: Invoice[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const queryParams = status ? `?status=${status}` : "";
      const data = await $fetch<Invoice[]>(
        `${config.public.apiBase}/finance/invoice${queryParams}`,
        {
          credentials: "include",
        },
      );
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
    issuedDate: string;
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
      invoiceNumber: string;
      issuedDate: string;
      dueDate: string;
      companyId: string;
      jobId: string;
      notes: string;
      subTotal: number;
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

  /**
   * Search invoices with a query string
   * Uses client-side filtering from fetched invoices
   */
  async function searchInvoices(
    query: string,
    invoices?: Invoice[],
  ): Promise<{ success: boolean; data?: Invoice[]; error?: string }> {
    if (!query || query.trim() === "") {
      // If no query, return all invoices or fetch if not provided
      if (invoices && invoices.length > 0) {
        return { success: true, data: invoices };
      }
      return fetchInvoices();
    }

    // If we already have invoices, filter client-side
    if (invoices && invoices.length > 0) {
      const lowerQuery = query.toLowerCase().trim();
      const filtered = invoices.filter((invoice) => {
        const invoiceNumberMatch = invoice.invoiceNumber.toLowerCase().includes(lowerQuery);
        const companyNameMatch = invoice.company.name.toLowerCase().includes(lowerQuery);
        const totalMatch = invoice.total.toString().includes(lowerQuery);
        const statusMatch = invoice.status.name.toLowerCase().includes(lowerQuery);
        return invoiceNumberMatch || companyNameMatch || totalMatch || statusMatch;
      });
      return { success: true, data: filtered };
    }

    // Otherwise fetch and then filter
    const result = await fetchInvoices();
    if (result.success && result.data) {
      const lowerQuery = query.toLowerCase().trim();
      const filtered = result.data.filter((invoice) => {
        const invoiceNumberMatch = invoice.invoiceNumber.toLowerCase().includes(lowerQuery);
        const companyNameMatch = invoice.company.name.toLowerCase().includes(lowerQuery);
        const totalMatch = invoice.total.toString().includes(lowerQuery);
        const statusMatch = invoice.status.name.toLowerCase().includes(lowerQuery);
        return invoiceNumberMatch || companyNameMatch || totalMatch || statusMatch;
      });
      return { success: true, data: filtered };
    }
    return result;
  }

  return {
    isLoading,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    formatInvoiceDisplay,
  };
}
