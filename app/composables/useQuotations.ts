import { ref } from "vue";
import { useState } from "#app";

export interface QuotationCharge {
  id?: string;
  quotationId?: string;
  serviceId: string | null;
  serviceName?: string | null;
  taxId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;

  // Backward compatibility
  vendorId?: string | null;
  vendorName?: string | null;
  costUnitPrice?: number;
  costTotal?: number;
  costCurrency?: string;
  costExchangeRate?: number;
  sellingUnitPrice?: number;
  sellingTotal?: number;
  sellingCurrency?: string;
  sellingExchangeRate?: number;
}

export interface Quotation {
  id: string;
  number: string;
  customerId: string;
  customerName?: string | null;
  customerAddress?: string | null;
  picName?: string | null;
  date: string;
  validUntil: string;
  freeTime?: string | null;
  salesName?: string | null;
  tradeTypeId?: string | null;
  serviceType?: string | null;
  shipmentType?: string | null;
  pol?: string | null;
  polName?: string | null;
  pod?: string | null;
  podName?: string | null;
  containerTypeId?: string | null;
  containerTypeName?: string | null;
  truckType?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  pickupDate?: string | null;
  deliveryDate?: string | null;
  term?: string | null;
  status: "DRAFT" | "SENT" | "CONFIRMED" | "CONVERTED" | "CANCELLED" | "EXPIRED";
  notes?: string | null; // Remarks

  currency: string;
  exchangeRate: number;
  subTotal: number;
  taxId?: string | null;
  taxAmount: number;
  taxTotal: number;
  total: number;

  // Backward compatibility
  totalEstimatedCost?: number;
  totalEstimatedRevenue?: number;
  totalEstimatedProfit?: number;

  createdBy?: string | null;
  creatorName?: string | null;
  createdAt: string;
  updatedAt: string;

  charges: QuotationCharge[];

  // Multi-use feature (from the switch in create quotation)
  allowMultipleInvoices?: boolean;

  // Usage / Traceability — invoices created from this quotation
  invoices?: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
    total: number;
    currency: string;
    createdAt: string;
    jobId?: string;
    jobNumber?: string;
  }>;
}

export interface CreateQuotation {
  customerId: string;
  picName?: string | null;
  date: string;
  validUntil: string;
  freeTime?: string | null;
  salesName?: string | null;
  tradeTypeId?: string | null;
  serviceType?: string | null;
  shipmentType?: string | null;
  pol?: string | null;
  pod?: string | null;
  containerTypeId?: string | null;
  truckType?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  pickupDate?: string | null;
  deliveryDate?: string | null;
  term?: string | null;
  notes?: string | null;
  allowMultipleInvoices?: boolean;

  currency?: string;
  exchangeRate?: number;
  subTotal?: number;
  taxId?: string | null;
  taxAmount?: number;
  taxTotal?: number;
  total?: number;

  charges: QuotationCharge[];
}

export interface UpdateQuotation {
  customerId?: string;
  picName?: string | null;
  date?: string;
  validUntil?: string;
  freeTime?: string | null;
  salesName?: string | null;
  tradeTypeId?: string | null;
  serviceType?: string | null;
  shipmentType?: string | null;
  pol?: string | null;
  pod?: string | null;
  containerTypeId?: string | null;
  truckType?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  pickupDate?: string | null;
  deliveryDate?: string | null;
  term?: string | null;
  allowMultipleInvoices?: boolean;
  status?: string;
  notes?: string | null;

  currency?: string;
  exchangeRate?: number;
  subTotal?: number;
  taxId?: string | null;
  taxAmount?: number;
  taxTotal?: number;
  total?: number;

  charges?: QuotationCharge[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const formatPath = (path: (string | number)[]) => {
  if (!path || path.length === 0) return "";
  return path
    .map((p) => {
      if (typeof p === "number") return (p + 1).toString();
      if (p === "charges") return "Charge #";
      return p;
    })
    .join("")
    .replace(/#(\d+)/g, "#$1 ")
    .replace(/\.([^0-9])/g, " $1")
    .trim();
};

const formatIssues = (issues: Array<{ path: (string | number)[]; message: string }>) => {
  return issues
    .map((issue) => {
      const path = formatPath(issue.path);
      return `${path ? path + ": " : ""}${issue.message}`;
    })
    .join(" | ");
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (
      error as {
        data?: {
          error?: { issues?: Array<{ path: (string | number)[]; message: string }> };
          message?: string;
        };
      }
    ).data;

    if (errorData?.error?.issues && Array.isArray(errorData.error.issues)) {
      return formatIssues(errorData.error.issues);
    }

    if (
      typeof errorData?.message === "string" &&
      (errorData.message.startsWith("[") || errorData.message.startsWith("{"))
    ) {
      try {
        const parsed = JSON.parse(errorData.message);
        const issues = Array.isArray(parsed) ? parsed : parsed.issues || parsed.error?.issues || [];
        if (Array.isArray(issues) && issues.length > 0) {
          return formatIssues(issues);
        }
      } catch {
        // Fallback
      }
    }

    if (errorData?.message) return errorData.message;
    if (errorData?.error) {
      return typeof errorData.error === "string"
        ? errorData.error
        : JSON.stringify(errorData.error);
    }
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

function handleApiError<T = unknown>(error: unknown): ApiResponse<T> {
  console.error("[useQuotations API Error]", error);
  return { success: false, error: getErrorMessage(error) };
}

export function useQuotations() {
  const isLoading = ref(false);
  const quotations = useState<Quotation[]>("quotations-list", () => []);
  const currentQuotation = useState<Quotation | null>("quotations-current", () => null);

  async function fetchQuotations(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    customerId?: string;
  }): Promise<
    ApiResponse<{
      items: Quotation[];
      total: number;
      totalPages: number;
      stats: {
        total: number;
        draft: number;
        sent: number;
        confirmed: number;
        converted: number;
        cancelled: number;
        expired: number;
      };
    }>
  > {
    isLoading.value = true;
    try {
      const data = await $fetch<{
        items: Quotation[];
        total: number;
        totalPages: number;
        stats: {
          total: number;
          draft: number;
          sent: number;
          confirmed: number;
          converted: number;
          cancelled: number;
          expired: number;
        };
      }>("/api/operational/quotations", { params });
      quotations.value = data.items || [];
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getQuotation(id: string): Promise<ApiResponse<Quotation>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>(`/api/operational/quotations/${id}`);
      currentQuotation.value = data;
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createQuotation(payload: CreateQuotation): Promise<ApiResponse<Quotation>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>("/api/operational/quotations", {
        method: "POST",
        body: payload,
      });
      quotations.value = [data, ...quotations.value];
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateQuotation(
    id: string,
    payload: UpdateQuotation,
  ): Promise<ApiResponse<Quotation>> {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>(`/api/operational/quotations/${id}`, {
        method: "PUT",
        body: payload,
      });
      const index = quotations.value.findIndex((q) => q.id === id);
      if (index !== -1) {
        quotations.value[index] = data;
      }
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = data;
      }
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteQuotation(id: string): Promise<ApiResponse> {
    isLoading.value = true;
    try {
      await $fetch(`/api/operational/quotations/${id}`, {
        method: "DELETE",
      });
      quotations.value = quotations.value.filter((q) => q.id !== id);
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = null;
      }
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function convertQuotationToJob(
    id: string,
  ): Promise<ApiResponse<{ jobId: string; message: string }>> {
    isLoading.value = true;
    try {
      const data = await $fetch<{ jobId: string; message: string }>(
        `/api/operational/quotations/${id}/convert`,
        { method: "POST" },
      );
      await getQuotation(id);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    quotations,
    currentQuotation,
    fetchQuotations,
    getQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    convertQuotationToJob,
  };
}
