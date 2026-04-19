import { toast } from "vue-sonner";

export interface PaymentAllocation {
  id: string;
  invoiceId: string;
  amount: number;
  invoice?: {
    invoiceNumber: string;
  };
}

export interface PaymentItem {
  id: string;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  reference?: string;
  notes?: string;
  company?: {
    name: string;
    code: string;
  };
  paymentMethod?: {
    name: string;
    code: string;
  };
  allocations: PaymentAllocation[];
}

export interface OutstandingReport {
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    total: number;
    balanceDue: number;
    issuedDate: string;
    status: { name: string; code: string };
    company: { name: string; code: string };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    count: number;
  };
}

export interface CreatePaymentPayload {
  companyId: string;
  amount: number;
  paymentDate: string;
  paymentMethodId?: string;
  taxId?: string;
  reference?: string;
  notes?: string;
  useFifo?: boolean;
  allocations?: { invoiceId: string; amount: number }[];
}

export const usePayments = () => {
  const isLoading = ref(false);
  const isSaving = ref(false);

  async function fetchPayments(): Promise<{
    success: boolean;
    data?: PaymentItem[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PaymentItem[]>("/api/finance/payment");
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error).message || "Failed to fetch payments",
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPaymentById(
    id: string,
  ): Promise<{ success: boolean; data?: PaymentItem; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<PaymentItem>(`/api/finance/payment/${id}`);
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error).message || "Failed to fetch payment details",
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function createPayment(
    data: CreatePaymentPayload,
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    isSaving.value = true;
    try {
      const responseData = await $fetch("/api/finance/payment", {
        method: "POST",
        body: data,
      });
      toast.success("Payment recorded successfully");
      return { success: true, data: responseData };
    } catch (error: unknown) {
      const errorMsg = (error as Error).message || "Failed to record payment";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isSaving.value = false;
    }
  }

  async function fetchOutstandingReport(
    filters: {
      companyId?: string;
      month?: number;
      year?: number;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ success: boolean; data?: OutstandingReport; error?: string }> {
    isLoading.value = true;
    try {
      const query: Record<string, string | number> = {};
      if (filters.companyId) query.companyId = filters.companyId;
      if (filters.month) query.month = filters.month;
      if (filters.year) query.year = filters.year;
      if (filters.page) query.page = filters.page;
      if (filters.limit) query.limit = filters.limit;

      const data = await $fetch<OutstandingReport>("/api/finance/report/outstanding", {
        query,
      });
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error).message || "Failed to fetch outstanding report",
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePayment(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/finance/payment/${id}`, {
        method: "DELETE",
      });
      toast.success("Payment deleted successfully");
      return { success: true };
    } catch (error: unknown) {
      const msg = (error as Error).message || "Failed to delete payment";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  }

  async function voidPayment(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`/api/finance/payment/${id}/void`, {
        method: "POST",
      });

      toast.success("Payment voided successfully");
      return { success: true };
    } catch (error: unknown) {
      const e = error as { data?: { message?: string }; message?: string };
      const errorMsg = e.data?.message || e.message || "Failed to void payment";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    isSaving,
    fetchPayments,
    fetchPaymentById,
    createPayment,
    fetchOutstandingReport,
    deletePayment,
    voidPayment,
  };
};
