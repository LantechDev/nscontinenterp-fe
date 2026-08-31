// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  calculateQuotationProfitSummary,
  combineCostToIDR,
  filterValidCostItems,
  groupCostTotals,
} from "./quotationCost";

const root = process.cwd();

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

  it("calculates quotation profit summary with USD conversion rules", () => {
    const summary = calculateQuotationProfitSummary(
      {
        exchangeRate: 15000,
        charges: [
          { currency: "USD", quantity: 2, unitPrice: 100 },
          { currency: "IDR", quantity: 1, unitPrice: 500000 },
          { currency: "IDR", quantity: 1, unitPrice: 999999, atCost: true },
        ],
      },
      [
        {
          exchangeRate: 14000,
          items: [
            { currency: "USD", quantity: 1, unitPrice: 50, amount: 50 },
            { currency: "IDR", quantity: 1, unitPrice: 100000, amount: 100000 },
          ],
        },
      ],
    );

    expect(summary.combined).toEqual({
      revenueIDR: 3500000,
      costIDR: 800000,
      profitIDR: 2700000,
      marginIDR: (2700000 / 3500000) * 100,
    });
    expect(summary.byCurrency.IDR).toMatchObject({
      revenue: 3500000,
      cost: 800000,
      profit: 2700000,
    });
    expect(summary.byCurrency.USD).toMatchObject({ revenue: 0, cost: 0, profit: 0 });
  });

  it("includes standalone quotation documents in profit revenue", () => {
    const summary = calculateQuotationProfitSummary(
      {
        exchangeRate: 1,
        charges: [{ currency: "IDR", quantity: 1, unitPrice: 1_000_000 }],
        quotationInvoices: [
          {
            items: [
              { currency: "IDR", quantity: 2, unitPrice: 500_000, amount: 1_000_000 },
              { currency: "IDR", quantity: 1, unitPrice: 250_000, amount: 250_000 },
            ],
          },
        ],
      },
      [],
    );

    expect(summary.combined.revenueIDR).toBe(2_250_000);
    expect(summary.byCurrency.IDR?.revenue).toBe(2_250_000);
  });

  it("uses quotation currency when a service item has no currency", () => {
    const summary = calculateQuotationProfitSummary(
      {
        currency: "USD",
        exchangeRate: 15500,
        charges: [{ currency: null, quantity: 1, unitPrice: 1746.64 }],
      },
      [
        {
          exchangeRate: 1,
          items: [{ currency: "IDR", quantity: 1, unitPrice: 9698600, amount: 9698600 }],
        },
      ],
    );

    expect(summary.combined.revenueIDR).toBe(27_072_920);
    expect(summary.combined.costIDR).toBe(9_698_600);
    expect(summary.combined.profitIDR).toBe(17_374_320);
    expect(summary.byCurrency.IDR).toMatchObject({
      revenue: 27_072_920,
      cost: 9_698_600,
      profit: 17_374_320,
    });
  });

  it("uses quotation currency when a service item has no currency", () => {
    const summary = calculateQuotationProfitSummary(
      {
        currency: "USD",
        exchangeRate: 15500,
        charges: [{ currency: null, quantity: 1, unitPrice: 1746.64 }],
      },
      [
        {
          exchangeRate: 1,
          items: [{ currency: "IDR", quantity: 1, unitPrice: 9698600, amount: 9698600 }],
        },
      ],
    );

    expect(summary.combined.revenueIDR).toBe(27_072_920);
    expect(summary.combined.costIDR).toBe(9_698_600);
    expect(summary.combined.profitIDR).toBe(17_374_320);
    expect(summary.byCurrency.IDR).toMatchObject({
      revenue: 27_072_920,
      cost: 9_698_600,
      profit: 17_374_320,
    });
  });

  it("estimates net profit with API exchange rate when quotation USD has no stored rate", () => {
    const summary = calculateQuotationProfitSummary(
      {
        currency: "USD",
        exchangeRate: 1,
        charges: [{ currency: null, quantity: 1, unitPrice: 1746.64 }],
      },
      [
        {
          exchangeRate: 1,
          items: [{ currency: "IDR", quantity: 1, unitPrice: 9698600, amount: 9698600 }],
        },
      ],
      { fallbackExchangeRate: 15500 },
    );

    expect(summary.isEstimated).toBe(true);
    expect(summary.combined.revenueIDR).toBe(27_072_920);
    expect(summary.combined.costIDR).toBe(9_698_600);
    expect(summary.combined.profitIDR).toBe(17_374_320);
  });

  it("keeps quotation cost form on shared currency and cost helpers", () => {
    const contents = readFileSync(
      join(root, "app/components/operational/QuotationCostForm.vue"),
      "utf8",
    );

    expect(contents).toContain("formatCurrencyAmount(");
    expect(contents).toContain("formatCurrencyInput(");
    expect(contents).toContain("parseCurrencyInput(");
    expect(contents).toContain("groupCostTotals(");
    expect(contents).toContain("combineCostToIDR(");
    expect(contents).not.toContain("new Intl.NumberFormat");
  });

  it("labels costing net profit as estimate only when fallback currency data is used", () => {
    const contents = readFileSync(
      join(root, "app/components/operational/QuotationCostingTab.vue"),
      "utf8",
    );

    expect(contents).toContain("fallbackExchangeRate");
    expect(contents).toContain("/api/finance/invoice/exchange-rate");
    expect(contents).toContain("Estimate Net Profit (IDR eq.)");
    expect(contents).toContain("Net Profit (IDR eq.)");
  });
});
