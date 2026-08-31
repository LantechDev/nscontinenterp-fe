import { ceilTaxByCurrency, roundByCurrency } from "./currency";

// Pure quotation-cost total math, shared by the live form display and the persisted
// header so the saved subTotal/tax/amount always match the items that are actually
// stored. Previously the header was computed over ALL form items while only valid items
// were persisted, so a priced line with a blank description inflated the saved header.

export interface CostItem {
  description?: string;
  quantity: number;
  unitPrice: number;
  currency: "IDR" | "USD";
}

export interface CurrencyTotal {
  subTotal: number;
  tax: number;
  total: number;
}

export interface ProfitCurrencyBucket {
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface ProfitSummary {
  byCurrency: Record<string, ProfitCurrencyBucket>;
  combined: { revenueIDR: number; costIDR: number; profitIDR: number; marginIDR: number };
  isEstimated?: boolean;
  effectiveExchangeRate?: number;
}

export interface ProfitCharge {
  atCost?: boolean | null;
  currency?: string | null;
  quantity?: string | number | null;
  unitPrice?: string | number | null;
}

export interface ProfitQuotationInvoiceItem {
  currency?: string | null;
  amount?: string | number | null;
  quantity?: string | number | null;
  unitPrice?: string | number | null;
}

export interface ProfitQuotationInvoice {
  currency?: string | null;
  items?: ProfitQuotationInvoiceItem[] | null;
}

export interface ProfitCostItem {
  currency?: string | null;
  amount?: string | number | null;
  quantity?: string | number | null;
  unitPrice?: string | number | null;
}

export interface ProfitCost {
  exchangeRate?: string | number | null;
  items?: ProfitCostItem[] | null;
}

export interface ProfitQuotation {
  currency?: string | null;
  exchangeRate?: string | number | null;
  charges?: ProfitCharge[] | null;
  quotationInvoices?: ProfitQuotationInvoice[] | null;
}

export interface ProfitSummaryOptions {
  fallbackExchangeRate?: string | number | null;
}

function emptyProfitBucket(): ProfitCurrencyBucket {
  return { revenue: 0, cost: 0, profit: 0, margin: 0 };
}

function ensureProfitBucket(summary: ProfitSummary, currency: string) {
  if (!summary.byCurrency[currency]) summary.byCurrency[currency] = emptyProfitBucket();
  return summary.byCurrency[currency]!;
}

function numeric(value: string | number | null | undefined) {
  return Number(value || 0);
}

/** Items that are actually persisted: a non-blank description AND a positive unit price. */
export function filterValidCostItems<T extends CostItem>(items: T[]): T[] {
  return items.filter((it) => Boolean(it.description?.trim()) && Number(it.unitPrice) > 0);
}

/** Per-currency subtotal/tax/total with the IDR-round / USD-2dp / tax-ceil rules. */
export function groupCostTotals(items: CostItem[], taxRate: number): Record<string, CurrencyTotal> {
  const totals: Record<string, CurrencyTotal> = {
    IDR: { subTotal: 0, tax: 0, total: 0 },
    USD: { subTotal: 0, tax: 0, total: 0 },
  };
  items.forEach((it) => {
    const curr = it.currency || "IDR";
    if (!totals[curr]) totals[curr] = { subTotal: 0, tax: 0, total: 0 };
    totals[curr]!.subTotal += Number(it.quantity || 0) * Number(it.unitPrice || 0);
  });
  Object.keys(totals).forEach((c) => {
    const entry = totals[c]!;
    if (c === "IDR") entry.subTotal = roundByCurrency(entry.subTotal, c);
    entry.tax = ceilTaxByCurrency(entry.subTotal * (taxRate / 100), c);
    entry.total = entry.subTotal + entry.tax;
  });
  return totals;
}

/** Combined IDR-equivalent totals (USD converted at exchangeRate). */
export function combineCostToIDR(
  items: CostItem[],
  taxRate: number,
  exchangeRate: number,
): CurrencyTotal {
  const g = groupCostTotals(items, taxRate);
  const r = Number(exchangeRate || 1);
  const subTotal = (g.IDR?.subTotal || 0) + (g.USD?.subTotal || 0) * r;
  const tax = (g.IDR?.tax || 0) + (g.USD?.tax || 0) * r;
  return { subTotal, tax, total: subTotal + tax };
}

export function calculateQuotationProfitSummary(
  quotation: ProfitQuotation,
  costs: ProfitCost[],
  options: ProfitSummaryOptions = {},
): ProfitSummary {
  const summary: ProfitSummary = {
    byCurrency: {
      IDR: emptyProfitBucket(),
      USD: emptyProfitBucket(),
    },
    combined: { revenueIDR: 0, costIDR: 0, profitIDR: 0, marginIDR: 0 },
    isEstimated: false,
    effectiveExchangeRate: 1,
  };

  const quotationRate = Number(quotation.exchangeRate || 1);
  const fallbackRate = Number(options.fallbackExchangeRate || 1);
  const effectiveQuotationRate =
    quotationRate > 1 ? quotationRate : fallbackRate > 1 ? fallbackRate : 1;
  const isQuotationRateConfigured = effectiveQuotationRate > 1;
  const quotationCurrency = quotation.currency || "IDR";

  (quotation.charges || []).forEach((charge) => {
    if (charge.atCost) return;
    const currency = charge.currency || quotationCurrency;
    const isRevenueEstimated =
      !charge.currency || (currency === "USD" && quotationRate <= 1 && fallbackRate > 1);
    const amount = numeric(charge.quantity) * numeric(charge.unitPrice);
    const targetCurrency = currency === "USD" && isQuotationRateConfigured ? "IDR" : currency;
    const targetAmount =
      currency === "USD" && isQuotationRateConfigured ? amount * effectiveQuotationRate : amount;

    ensureProfitBucket(summary, targetCurrency).revenue += targetAmount;
    summary.combined.revenueIDR += currency === "USD" ? amount * effectiveQuotationRate : amount;
    if (isRevenueEstimated) summary.isEstimated = true;
  });

  (quotation.quotationInvoices || []).forEach((invoice) => {
    const invoiceCurrency = invoice.currency || quotationCurrency;
    (invoice.items || []).forEach((item) => {
      const currency = item.currency || invoiceCurrency;
      const isRevenueEstimated =
        !item.currency || (currency === "USD" && quotationRate <= 1 && fallbackRate > 1);
      const amount = Number(item.amount || numeric(item.quantity) * numeric(item.unitPrice));
      const targetCurrency = currency === "USD" && isQuotationRateConfigured ? "IDR" : currency;
      const targetAmount =
        currency === "USD" && isQuotationRateConfigured ? amount * effectiveQuotationRate : amount;

      ensureProfitBucket(summary, targetCurrency).revenue += targetAmount;
      summary.combined.revenueIDR += currency === "USD" ? amount * effectiveQuotationRate : amount;
      if (isRevenueEstimated) summary.isEstimated = true;
    });
  });

  costs.forEach((cost) => {
    const rate = Number(cost.exchangeRate || 1);
    const effectiveCostRate = rate > 1 ? rate : fallbackRate > 1 ? fallbackRate : 1;
    const isCostRateConfigured = effectiveCostRate > 1;

    (cost.items || []).forEach((item) => {
      const currency = item.currency || "IDR";
      const amount = Number(item.amount || numeric(item.quantity) * numeric(item.unitPrice));
      const isCostEstimated = currency === "USD" && rate <= 1 && fallbackRate > 1;
      const shouldConvertToIDR =
        currency === "USD" && (isQuotationRateConfigured || isCostRateConfigured);
      const targetCurrency = shouldConvertToIDR ? "IDR" : currency;
      const targetAmount = shouldConvertToIDR ? amount * effectiveCostRate : amount;

      ensureProfitBucket(summary, targetCurrency).cost += targetAmount;
      summary.combined.costIDR += currency === "USD" ? amount * effectiveCostRate : amount;
      if (isCostEstimated) summary.isEstimated = true;
    });
  });

  Object.values(summary.byCurrency).forEach((bucket) => {
    bucket.profit = bucket.revenue - bucket.cost;
    bucket.margin = bucket.revenue > 0 ? (bucket.profit / bucket.revenue) * 100 : 0;
  });

  summary.combined.profitIDR = summary.combined.revenueIDR - summary.combined.costIDR;
  summary.combined.marginIDR =
    summary.combined.revenueIDR > 0
      ? (summary.combined.profitIDR / summary.combined.revenueIDR) * 100
      : 0;

  summary.effectiveExchangeRate = effectiveQuotationRate;

  return summary;
}
