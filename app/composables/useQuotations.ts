import axios, { type AxiosError } from "axios";

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

function handleApiError(error: unknown): { success: false; error: string } {
    const axiosError = error as AxiosError<ErrorResponse>;
    const apiError = axiosError.response?.data;
    const errorMessage =
        typeof apiError === "string"
            ? apiError
            : apiError?.message || apiError?.error || axiosError.message || "An error occurred";

    return { success: false, error: errorMessage };
}

// Helper to calculate item amount
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
    const isLoading = useState<boolean>("quotations-loading", () => false);
    const quotations = useState<Quotation[]>("quotations-list", () => []);
    const currentQuotation = useState<Quotation | null>("quotations-current", () => null);

    const api = axios.create({
        baseURL: `${config.public.apiBase}/marketing`,
        withCredentials: true,
    });

    async function fetchQuotations(search?: string, status?: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Quotation[]>("/quotations", {
                params: { search, status },
            });
            quotations.value = data || [];
            return { success: true, data: quotations.value };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function getQuotation(id: string) {
        isLoading.value = true;
        try {
            const { data } = await api.get<Quotation>(`/quotations/${id}`);
            currentQuotation.value = data;
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createQuotation(payload: CreateQuotation) {
        isLoading.value = true;
        try {
            const { data } = await api.post<Quotation>("/quotations", payload);
            quotations.value = [...quotations.value, data];
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateQuotation(id: string, payload: UpdateQuotation) {
        isLoading.value = true;
        try {
            const { data } = await api.put<Quotation>(`/quotations/${id}`, payload);
            if (currentQuotation.value?.id === id) {
                currentQuotation.value = data;
            }
            quotations.value = quotations.value.map((q) => (q.id === id ? { ...q, ...data } : q));
            return { success: true, data };
        } catch (error) {
            return handleApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteQuotation(id: string) {
        isLoading.value = true;
        try {
            await api.delete(`/quotations/${id}`);
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
