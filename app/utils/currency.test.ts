// @ts-ignore
import { describe, expect, it } from "bun:test";
import {
  ceilTaxByCurrency,
  formatCurrencyCode,
  formatCurrencyInput,
  parseCurrencyInput,
  roundByCurrency,
} from "./currency";

// #9 — shared currency-rounding rules (previously copy-pasted across four components).
describe("roundByCurrency", () => {
  it("rounds IDR to whole rupiah", () => {
    expect(roundByCurrency(1000.4, "IDR")).toBe(1000);
    expect(roundByCurrency(1000.5, "IDR")).toBe(1001);
  });

  it("rounds non-IDR to 2 decimals", () => {
    expect(roundByCurrency(10.256, "USD")).toBe(10.26);
    expect(roundByCurrency(10.254, "USD")).toBe(10.25);
  });
});

describe("ceilTaxByCurrency", () => {
  it("rounds IDR tax UP to whole rupiah (never underpay)", () => {
    expect(ceilTaxByCurrency(99.01, "IDR")).toBe(100);
    expect(ceilTaxByCurrency(100, "IDR")).toBe(100);
  });

  it("rounds non-IDR tax UP to 2 decimals", () => {
    expect(ceilTaxByCurrency(1.111, "USD")).toBe(1.12);
    expect(ceilTaxByCurrency(1.25, "USD")).toBe(1.25); // already at 2dp -> unchanged
  });
});

describe("formatCurrencyCode", () => {
  it("formats USD amounts with the USD code instead of a currency symbol", () => {
    expect(formatCurrencyCode(3076.61, "USD")).toBe("USD 3,076.61");
  });

  it("formats IDR amounts with the IDR code and whole rupiah", () => {
    expect(formatCurrencyCode(9396131, "IDR")).toBe("IDR 9.396.131");
  });
});

describe("currency input helpers", () => {
  it("parses IDR input as whole-number rupiah", () => {
    expect(parseCurrencyInput("16.250.500", "IDR")).toBe(16250500);
    expect(parseCurrencyInput("Rp 1,250", "IDR")).toBe(1250);
  });

  it("parses USD input with either comma or dot decimals", () => {
    expect(parseCurrencyInput("1,25", "USD")).toBe(1.25);
    expect(parseCurrencyInput("1,234.56", "USD")).toBe(1234.56);
    expect(parseCurrencyInput("1.234,56", "USD")).toBe(1234.56);
  });

  it("formats currency inputs without currency symbols", () => {
    expect(formatCurrencyInput(16250500, "IDR")).toBe("16.250.500");
    expect(formatCurrencyInput(1234.56, "USD")).toBe("1,234.56");
    expect(formatCurrencyInput("", "USD")).toBe("");
  });
});
