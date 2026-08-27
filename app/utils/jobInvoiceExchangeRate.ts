export const normalizeInvoiceCurrency = (currency: string | null | undefined) =>
  currency === "USD" ? "USD" : "IDR";

export const resolveSingleCurrencyPrefillExchangeRate = (
  currency: string | null | undefined,
  sourceExchangeRate: number | string | null | undefined,
) => {
  const normalized = normalizeInvoiceCurrency(currency);
  const rate = Number(sourceExchangeRate || 1);
  if (normalized === "IDR") return 1;
  return rate > 1 ? rate : 1;
};

export const hasMixedInvoiceCurrencyItems = (
  invoiceCurrency: string | null | undefined,
  items: Array<{ currency?: string | null }> | null | undefined,
) => {
  const normalizedInvoiceCurrency = normalizeInvoiceCurrency(invoiceCurrency);
  return (items || []).some(
    (item) => normalizeInvoiceCurrency(item.currency) !== normalizedInvoiceCurrency,
  );
};
