import type {
  QuotationCharge,
  QuotationCost,
  QuotationCostItem,
  QuotationInvoice,
  QuotationInvoiceItem,
} from "~/composables/useQuotations";

export const mapCopiedQuotationCharges = (
  charges: QuotationCharge[] | null | undefined,
): QuotationCharge[] =>
  (charges || []).map((charge) => ({
    serviceId: charge.serviceId || null,
    taxId: charge.taxId || null,
    description: charge.description,
    quantity: Number(charge.quantity || 1),
    unitPrice: Number(charge.unitPrice || 0),
    amount: Number(charge.amount || 0),
    currency: charge.currency || "IDR",
    atCost: Boolean(charge.atCost),
    vendorId: charge.vendorId || null,
    costUnitPrice: charge.costUnitPrice,
    costCurrency: charge.costCurrency,
    costExchangeRate: charge.costExchangeRate,
    sellingUnitPrice: charge.sellingUnitPrice,
    sellingCurrency: charge.sellingCurrency,
    sellingExchangeRate: charge.sellingExchangeRate,
  }));

const mapCopiedQuotationCostItems = (
  items: QuotationCostItem[] | null | undefined,
): QuotationCostItem[] =>
  (items || []).map((item) => ({
    serviceId: item.serviceId || null,
    description: item.description,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
    currency: item.currency || "IDR",
    amount: Number(item.amount || 0),
  }));

export const mapCopiedQuotationCosts = (
  costs: QuotationCost[] | null | undefined,
): QuotationCost[] =>
  (costs || []).map((cost) => ({
    number: cost.number || null,
    vendorId: cost.vendorId || null,
    categoryId: cost.categoryId || null,
    date: cost.date || null,
    exchangeRate: Number(cost.exchangeRate || 1),
    taxId: cost.taxId || null,
    subTotal: Number(cost.subTotal || 0),
    taxTotal: Number(cost.taxTotal || 0),
    amount: Number(cost.amount || 0),
    notes: cost.notes || null,
    items: mapCopiedQuotationCostItems(cost.items),
  }));

const mapCopiedQuotationInvoiceItems = (
  items: QuotationInvoiceItem[] | null | undefined,
): QuotationInvoiceItem[] =>
  (items || []).map((item) => ({
    chargeId: null,
    serviceId: item.serviceId || null,
    description: item.description,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
    currency: item.currency || "IDR",
    amount: Number(item.amount || 0),
  }));

export const mapCopiedQuotationInvoices = (
  invoices: QuotationInvoice[] | null | undefined,
): QuotationInvoice[] =>
  (invoices || []).map((invoice) => ({
    number: invoice.number || null,
    date: invoice.date || null,
    notes: invoice.notes || null,
    subTotal: Number(invoice.subTotal || 0),
    taxAmount: Number(invoice.taxAmount || 0),
    total: Number(invoice.total || 0),
    items: mapCopiedQuotationInvoiceItems(invoice.items),
  }));
