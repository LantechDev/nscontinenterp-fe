// @ts-ignore
import { describe, expect, it } from "bun:test";
import {
  hasMixedInvoiceCurrencyItems,
  requiresInvoiceExchangeRate,
  resolveSingleCurrencyPrefillExchangeRate,
} from "./jobInvoiceExchangeRate";

describe("resolveSingleCurrencyPrefillExchangeRate", () => {
  it("keeps the quotation exchange rate when pre-filling a single-currency USD invoice", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("USD", 17200)).toBe(17200);
  });

  it("uses rate 1 for an IDR invoice", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("IDR", 17200)).toBe(1);
  });

  it("uses rate 1 for a single-currency USD invoice", () => {
    expect(resolveSingleCurrencyPrefillExchangeRate("USD", 1)).toBe(1);
  });
});

describe("hasMixedInvoiceCurrencyItems", () => {
  it("does not require exchange rate for USD invoice with USD items", () => {
    expect(hasMixedInvoiceCurrencyItems("USD", [{ currency: "USD" }])).toBe(false);
  });

  it("does not require exchange rate for IDR invoice with IDR items", () => {
    expect(hasMixedInvoiceCurrencyItems("IDR", [{ currency: "IDR" }])).toBe(false);
  });

  it("requires exchange rate for IDR invoice with USD items", () => {
    expect(hasMixedInvoiceCurrencyItems("IDR", [{ currency: "USD" }])).toBe(true);
  });

  it("requires exchange rate for USD invoice with IDR items", () => {
    expect(hasMixedInvoiceCurrencyItems("USD", [{ currency: "IDR" }])).toBe(true);
  });
});

describe("requiresInvoiceExchangeRate", () => {
  it("requires exchange rate for a single-currency USD invoice", () => {
    expect(requiresInvoiceExchangeRate("USD", [{ currency: "USD" }])).toBe(true);
  });

  it("requires exchange rate when invoice items differ from invoice currency", () => {
    expect(requiresInvoiceExchangeRate("IDR", [{ currency: "USD" }])).toBe(true);
  });

  it("does not require exchange rate for an IDR invoice with only IDR items", () => {
    expect(requiresInvoiceExchangeRate("IDR", [{ currency: "IDR" }])).toBe(false);
  });
});
