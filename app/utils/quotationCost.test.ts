// @ts-ignore
import { describe, expect, it } from "bun:test";
import { combineCostToIDR, filterValidCostItems, groupCostTotals } from "./quotationCost";

// #5 — the persisted cost header must be computed from the items actually saved
// (valid items) so a priced line with a blank description can't inflate the total.
describe("quotation cost totals", () => {
  it("drops blank-description or zero-price lines from the persisted set", () => {
    const items = [
      { description: "Freight", quantity: 1, unitPrice: 1000, currency: "IDR" as const },
      { description: "   ", quantity: 1, unitPrice: 500, currency: "IDR" as const }, // blank desc
      { description: "Handling", quantity: 1, unitPrice: 0, currency: "IDR" as const }, // no price
    ];
    expect(filterValidCostItems(items).map((i) => i.description)).toEqual(["Freight"]);
  });

  it("proves the bug: header over ALL items overstates vs header over valid items", () => {
    const items = [
      { description: "Freight", quantity: 1, unitPrice: 1000, currency: "IDR" as const },
      { description: "", quantity: 1, unitPrice: 500, currency: "IDR" as const }, // priced, blank desc
    ];

    // Old behaviour: header from all items -> inflated by the dropped line.
    const inflated = combineCostToIDR(items, 0, 1);
    expect(inflated.subTotal).toBe(1500);

    // Fixed behaviour: header from persisted (valid) items only -> matches saved items.
    const valid = filterValidCostItems(items);
    const header = combineCostToIDR(valid, 0, 1);
    expect(header.subTotal).toBe(1000);
    expect(header.total).toBe(1000);
  });

  it("applies tax ceil and converts USD to IDR at the exchange rate", () => {
    const items = [{ description: "Ocean", quantity: 1, unitPrice: 100, currency: "USD" as const }];
    // 11% tax on 100 USD = 11 USD; at rate 15000 -> subTotal 1_500_000, tax 165_000.
    const header = combineCostToIDR(items, 11, 15000);
    expect(header.subTotal).toBe(1_500_000);
    expect(header.tax).toBe(165_000);
    expect(header.total).toBe(1_665_000);
  });

  it("groups per currency with IDR rounding", () => {
    const totals = groupCostTotals(
      [{ description: "x", quantity: 3, unitPrice: 333.3, currency: "IDR" as const }],
      0,
    );
    expect(totals.IDR!.subTotal).toBe(1000); // 999.9 -> rounded
  });
});
