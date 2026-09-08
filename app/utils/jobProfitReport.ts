import { toNumber } from "../lib/utils";
import { normalizeCurrencyCode } from "./currency";

export interface ProfitReportExchangeRatedItem {
  currency?: string | null;
  exchangeRate?: number | string | null;
}

export function resolveProfitReportExchangeRate(
  currency?: string | null,
  exchangeRate?: number | string | null,
  fallbackExchangeRate?: number | string | null,
) {
  const rate = toNumber(exchangeRate) || 1;
  if (normalizeCurrencyCode(currency) !== "USD") return rate;
  if (rate > 1) return rate;

  const fallbackRate = toNumber(fallbackExchangeRate) || 1;
  return fallbackRate > 1 ? fallbackRate : rate;
}

export function toProfitReportBaseAmount(
  amount: number | string | null | undefined,
  currency?: string | null,
  exchangeRate?: number | string | null,
  fallbackExchangeRate?: number | string | null,
) {
  const value = toNumber(amount) || 0;
  const effectiveRate = resolveProfitReportExchangeRate(
    currency,
    exchangeRate,
    fallbackExchangeRate,
  );
  return normalizeCurrencyCode(currency) === "USD" ? value * effectiveRate : value;
}

export function hasProfitReportUsdConversion(
  currency?: string | null,
  exchangeRate?: number | string | null,
  fallbackExchangeRate?: number | string | null,
) {
  return (
    normalizeCurrencyCode(currency) === "USD" &&
    resolveProfitReportExchangeRate(currency, exchangeRate, fallbackExchangeRate) > 1
  );
}

export function needsProfitReportFallbackExchangeRate(items: ProfitReportExchangeRatedItem[]) {
  return items.some(
    (item) =>
      normalizeCurrencyCode(item.currency) === "USD" && (toNumber(item.exchangeRate) || 1) <= 1,
  );
}
