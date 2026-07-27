export const normalizeInvoiceCurrency = (currency: string | null | undefined) =>
  currency === "USD" ? "USD" : "IDR";

export const resolveSingleCurrencyPrefillExchangeRate = (
  currency: string | null | undefined,
  sourceExchangeRate: number | string | null | undefined,
) => {
  const normalized = normalizeInvoiceCurrency(currency);
  if (normalized === "IDR") return 1;

  const rate = Number(sourceExchangeRate || 1);
  return rate > 1 ? rate : null;
};
