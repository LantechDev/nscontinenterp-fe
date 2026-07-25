// Shared currency-rounding rules for quotations, cost sheets and invoices. Kept in one
// place so a change to the VAT/rounding policy applies everywhere (previously copy-pasted
// across QuotationPreview, QuotationDetailSlideOver, JobInvoiceForm and QuotationCostForm,
// which risked silently divergent tax totals between those views).

/**
 * Round a monetary amount to the currency's smallest unit: IDR to whole rupiah, other
 * currencies (e.g. USD) to 2 decimals.
 */
export function roundByCurrency(amount: number, currency: string): number {
  return currency === "IDR" ? Math.round(amount) : Math.round(amount * 100) / 100;
}

/**
 * Round tax UP (never down, to avoid underpaying): IDR to whole rupiah, other currencies
 * to 2 decimals (cents matter for small USD amounts).
 */
export function ceilTaxByCurrency(amount: number, currency: string): number {
  return currency === "IDR" ? Math.ceil(amount) : Math.ceil(amount * 100) / 100;
}

export function normalizeCurrencyCode(currency: string | null | undefined): string {
  return (currency || "IDR").toUpperCase();
}

export function formatCurrencyCode(amount: number, currency: string | null | undefined): string {
  const currencyCode = normalizeCurrencyCode(currency);
  const formatted = new Intl.NumberFormat(currencyCode === "IDR" ? "id-ID" : "en-US", {
    style: "decimal",
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);

  return `${currencyCode} ${formatted}`;
}
