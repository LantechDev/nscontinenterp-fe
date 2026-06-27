// @ts-ignore
import { describe, expect, it } from "bun:test";
import { selectBankAccount, selectDefaultId } from "./masterDefaults";

describe("selectDefaultId", () => {
  it("returns the flagged default item's id", () => {
    const items = [{ id: "a", isDefault: false }, { id: "b", isDefault: true }, { id: "c" }];
    expect(selectDefaultId(items)).toBe("b");
  });

  it("falls back to the empty string when nothing is flagged", () => {
    expect(selectDefaultId([{ id: "a" }, { id: "b" }])).toBe("");
  });

  it("uses the provided fallback (e.g. a legacy hardcoded value)", () => {
    expect(selectDefaultId([{ id: "a" }], "FCL_FCL")).toBe("FCL_FCL");
    // A real default still wins over the fallback.
    expect(selectDefaultId([{ id: "a", isDefault: true }], "FCL_FCL")).toBe("a");
  });

  it("is safe on null/undefined/empty input", () => {
    expect(selectDefaultId(null)).toBe("");
    expect(selectDefaultId(undefined, "x")).toBe("x");
    expect(selectDefaultId([])).toBe("");
  });

  it("returns the first default when several are flagged (defensive)", () => {
    const items = [
      { id: "a", isDefault: true },
      { id: "b", isDefault: true },
    ];
    expect(selectDefaultId(items)).toBe("a");
  });
});

describe("selectBankAccount", () => {
  const idr1 = { id: "idr1", currency: "IDR" };
  const idr2 = { id: "idr2", currency: "IDR", isDefault: true };
  const usd1 = { id: "usd1", currency: "USD" };
  const usd2 = { id: "usd2", currency: "USD", isDefault: true };

  it("prefers the default account in the document currency", () => {
    expect(selectBankAccount([idr1, idr2, usd1], "IDR")?.id).toBe("idr2");
    expect(selectBankAccount([idr1, idr2, usd1, usd2], "USD")?.id).toBe("usd2");
  });

  it("falls back to any account in the currency when no default matches", () => {
    expect(selectBankAccount([idr1, usd2], "IDR")?.id).toBe("idr1");
  });

  it("falls back to the default of another currency when currency has no account", () => {
    // EUR invoice, only IDR/USD accounts -> the flagged default wins over plain IDR.
    expect(selectBankAccount([idr1, usd2], "EUR")?.id).toBe("usd2");
  });

  it("falls back to an IDR account, then the first, then null", () => {
    expect(selectBankAccount([idr1, usd1], "EUR")?.id).toBe("idr1");
    expect(selectBankAccount([usd1], "EUR")?.id).toBe("usd1");
    expect(selectBankAccount([], "IDR")).toBe(null);
    expect(selectBankAccount(null, "IDR")).toBe(null);
  });

  it("does not put a wrong-currency default on an invoice that has a matching account", () => {
    // USD invoice with a USD account present must not show the IDR default.
    expect(selectBankAccount([idr2, usd1], "USD")?.id).toBe("usd1");
  });
});
