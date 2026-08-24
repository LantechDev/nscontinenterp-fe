import { ceilTaxByCurrency } from "./currency";

type InvoiceItemDraft = {
  description: string;
  quantity: number;
  unitPrice: number;
  currency?: string;
};

type InvoiceCurrency = "IDR" | "USD";
type InvoiceDiscountType = "PERCENTAGE" | "FIXED" | null;

export type InvoiceTaxDraft = {
  rate?: string | number | null;
  dppBasePercent?: string | number | null;
  isDeduction?: boolean | null;
  type?: string | null;
};

export type InvoiceGroupedTotal = {
  subTotal: number;
  taxAmount: number;
  total: number;
};

export function buildInvoiceItems(items: InvoiceItemDraft[]) {
  return items.map((it) => {
    const quantity = Number(it.quantity || 1);
    const unitPrice = Number(it.unitPrice || 0);

    return {
      chargeId: null,
      description: it.description.trim(),
      quantity,
      unitPrice,
      currency: (it.currency || "IDR") as "IDR" | "USD",
      amount: quantity * unitPrice,
    };
  });
}

export function isWithholdingInvoiceTax(tax: InvoiceTaxDraft | null | undefined): boolean {
  return tax?.isDeduction ?? (tax?.type || "").toLowerCase() === "pph";
}

export function calculateInvoiceSubtotal(
  items: InvoiceItemDraft[],
  invoiceCurrency: string,
  exchangeRate: number,
): number {
  const rate = Number(exchangeRate || 1);
  const sum = items.reduce((total, item) => {
    const itemAmount = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    const itemCurrency = item.currency || "IDR";

    if (itemCurrency === "USD" && invoiceCurrency === "IDR") return total + itemAmount * rate;
    if (itemCurrency === "IDR" && invoiceCurrency === "USD")
      return total + (rate > 0 ? itemAmount / rate : 0);
    return total + itemAmount;
  }, 0);

  return invoiceCurrency === "IDR" ? Math.round(sum) : sum;
}

export function calculateInvoiceDiscount(
  subTotal: number,
  currency: string,
  discountType: InvoiceDiscountType,
  discountValue: number,
): number {
  const value = Number(discountValue) || 0;
  if (!discountType || value <= 0) return 0;

  const raw = discountType === "PERCENTAGE" ? (subTotal * value) / 100 : value;
  const cappedDiscount = Math.max(0, Math.min(raw, subTotal));
  return currency === "IDR" ? Math.round(cappedDiscount) : cappedDiscount;
}

export function calculateInvoiceTaxAmount(
  taxableBase: number,
  currency: string,
  tax: InvoiceTaxDraft | null | undefined,
): number {
  const rate = tax ? Number(tax.rate) : 0;
  const dppBasePercent = tax ? Number(tax.dppBasePercent ?? 100) : 100;
  return ceilTaxByCurrency((taxableBase * (dppBasePercent / 100) * rate) / 100, currency);
}

export function calculateInvoiceTotal({
  items,
  invoiceCurrency,
  exchangeRate,
  discountType,
  discountValue,
  tax,
}: {
  items: InvoiceItemDraft[];
  invoiceCurrency: InvoiceCurrency;
  exchangeRate: number;
  discountType: InvoiceDiscountType;
  discountValue: number;
  tax: InvoiceTaxDraft | null | undefined;
}) {
  const subTotal = calculateInvoiceSubtotal(items, invoiceCurrency, exchangeRate);
  const discountAmount = calculateInvoiceDiscount(
    subTotal,
    invoiceCurrency,
    discountType,
    discountValue,
  );
  const discountedBase = subTotal - discountAmount;
  const taxAmount = calculateInvoiceTaxAmount(discountedBase, invoiceCurrency, tax);
  const signedTax = isWithholdingInvoiceTax(tax) ? -taxAmount : taxAmount;
  const total =
    invoiceCurrency === "IDR" ? Math.round(discountedBase + signedTax) : discountedBase + signedTax;

  return { subTotal, discountAmount, discountedBase, taxAmount, signedTax, total };
}

export function groupInvoiceTotals(
  items: InvoiceItemDraft[],
  taxRate: number,
  isWithholdingTax: boolean,
): Record<string, InvoiceGroupedTotal> {
  const totals: Record<string, InvoiceGroupedTotal> = {
    IDR: { subTotal: 0, taxAmount: 0, total: 0 },
    USD: { subTotal: 0, taxAmount: 0, total: 0 },
  };

  items.forEach((item) => {
    const currency = item.currency || "IDR";
    if (!totals[currency]) totals[currency] = { subTotal: 0, taxAmount: 0, total: 0 };
    totals[currency]!.subTotal += Number(item.quantity || 0) * Number(item.unitPrice || 0);
  });

  Object.keys(totals).forEach((currency) => {
    const entry = totals[currency]!;
    const roundedSubTotal = currency === "IDR" ? Math.round(entry.subTotal) : entry.subTotal;
    const taxAmount = ceilTaxByCurrency((roundedSubTotal * taxRate) / 100, currency);

    entry.subTotal = roundedSubTotal;
    entry.taxAmount = taxAmount;
    entry.total = roundedSubTotal + (isWithholdingTax ? -taxAmount : taxAmount);
  });

  return totals;
}
