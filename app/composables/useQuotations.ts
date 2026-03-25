export interface QuotationItem {
  id?: string;
  serviceId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  number: string;
  organizationId: string;
  customerId?: string | null;
  customer?: { name: string } | null;
  date: string;
  validUntil: string;
  status: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  notes?: string | null;
  subTotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  items: QuotationItem[];
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotation {
  customerId: string;
  date: string;
  validUntil: string;
  notes?: string;
  currency?: string;
  items: Omit<QuotationItem, "id" | "amount">[];
}

export interface UpdateQuotation {
  customerId?: string;
  date?: string;
  validUntil?: string;
  status?: "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED";
  notes?: string;
  currency?: string;
  items?: Omit<QuotationItem, "amount">[];
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

function calculateItemAmount(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

// Helper to calculate quotation totals
function calculateTotals(items: { quantity: number; unitPrice: number }[]): {
  subTotal: number;
  taxAmount: number;
  total: number;
} {
  const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subTotal * 0.11; // 11% tax rate
  const total = subTotal + taxAmount;
  return { subTotal, taxAmount, total };
}

export function useQuotations() {
  const config = useRuntimeConfig();
  const isLoading = ref(false);
  const quotations = useState<Quotation[]>("quotations-list", () => []);
  const currentQuotation = useState<Quotation | null>("quotations-current", () => null);

  async function fetchQuotations(search?: string, status?: string) {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation[]>(`${config.public.apiBase}/marketing/quotations`, {
        params: { search, status },
        credentials: "include",
      });
      quotations.value = data || [];
      return { success: true, data: quotations.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function getQuotation(id: string) {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>(`${config.public.apiBase}/marketing/quotations/${id}`, {
        credentials: "include",
      });
      currentQuotation.value = data;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createQuotation(payload: CreateQuotation) {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>(`${config.public.apiBase}/marketing/quotations`, {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      quotations.value = [...quotations.value, data];
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateQuotation(id: string, payload: UpdateQuotation) {
    isLoading.value = true;
    try {
      const data = await $fetch<Quotation>(`${config.public.apiBase}/marketing/quotations/${id}`, {
        method: "PUT",
        body: payload,
        credentials: "include",
      });
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = data;
      }
      quotations.value = quotations.value.map((q) => (q.id === id ? { ...q, ...data } : q));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteQuotation(id: string) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/marketing/quotations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      quotations.value = quotations.value.filter((q) => q.id !== id);
      if (currentQuotation.value?.id === id) {
        currentQuotation.value = null;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    quotations,
    currentQuotation,
    isLoading,
    fetchQuotations,
    getQuotation,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    calculateItemAmount,
    calculateTotals,
  };
}
