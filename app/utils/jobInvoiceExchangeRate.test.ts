// @ts-ignore
import { describe, expect, it } from "bun:test";
import { resolveSingleCurrencyPrefillExchangeRate } from "./jobInvoiceExchangeRate";

describe("resolveSingleCurrencyPrefillExchangeRate", () => {
  it("keeps the quotation exchange rate when pre-filling a single-currency USD invoice", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("USD", 17200)).toBe(17200);
  });

  it("uses rate 1 for an IDR invoice", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("IDR", 17200)).toBe(1);
  });

  it("returns null when a USD invoice has no usable exchange rate", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("USD", 1)).toBeNull();
  });
});
