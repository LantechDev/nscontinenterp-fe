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
