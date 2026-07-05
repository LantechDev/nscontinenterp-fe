// @ts-ignore
import { describe, expect, it } from "bun:test";
import { ceilTaxByCurrency, roundByCurrency } from "./currency";

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
