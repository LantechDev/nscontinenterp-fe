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
  const formatted = formatCurrencyDecimal(amount, currencyCode);

  return `${currencyCode} ${formatted}`;
}

export function formatCurrencyDecimal(amount: number, currency: string | null | undefined): string {
  const currencyCode = normalizeCurrencyCode(currency);
  return new Intl.NumberFormat(currencyCode === "IDR" ? "id-ID" : "en-US", {
    style: "decimal",
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCurrencyAmount(amount: number, currency: string | null | undefined): string {
  const currencyCode = normalizeCurrencyCode(currency);
  return new Intl.NumberFormat(currencyCode === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function parseCurrencyInput(value: string, currency: string | null | undefined): number {
  if (!value) return 0;

  const currencyCode = normalizeCurrencyCode(currency);
  if (currencyCode === "IDR") {
    const numeric = Number(value.replace(/[^0-9-]/g, ""));
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  let normalized = value;
  const hasComma = value.includes(",");
  const hasDot = value.includes(".");
  if (hasComma && !hasDot) {
    normalized = value.replace(",", ".");
  } else if (hasComma && hasDot) {
    normalized =
      value.lastIndexOf(",") > value.lastIndexOf(".")
        ? value.replace(/\./g, "").replace(",", ".")
        : value.replace(/,/g, "");
  }

  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

export function formatCurrencyInput(
  value: number | string | null | undefined,
  currency: string | null | undefined,
): string {
  if (value === undefined || value === null || value === "") return "";

  const currencyCode = normalizeCurrencyCode(currency);
  const numericValue = typeof value === "string" ? parseCurrencyInput(value, currencyCode) : value;
  if (Number.isNaN(numericValue)) return "";

  return new Intl.NumberFormat(currencyCode === "IDR" ? "id-ID" : "en-US", {
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(numericValue);
}

export function formatExchangeRateLabel(
  rate: string | number | null | undefined,
  options: { idrPosition: "prefix" | "suffix"; defaultLabel: string },
): string {
  const numericRate = Number(rate || 1);
  if (numericRate <= 1) return options.defaultLabel;

  const formattedRate = new Intl.NumberFormat("id-ID").format(numericRate);
  return options.idrPosition === "prefix"
    ? `1 USD = IDR ${formattedRate}`
    : `1 USD = ${formattedRate} IDR`;
}
