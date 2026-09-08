// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  needsProfitReportFallbackExchangeRate,
  resolveProfitReportExchangeRate,
  toProfitReportBaseAmount,
} from "./jobProfitReport";

describe("job profit report currency conversion", () => {
  it("converts USD invoices with a missing invoice rate using the suggested API rate", () => {
    const fallbackRate = 17_417;
    const rate = resolveProfitReportExchangeRate("USD", 1, fallbackRate);

    expect(rate).toBe(fallbackRate);
    expect(toProfitReportBaseAmount(1206.96, "USD", 1, fallbackRate)).toBe(21_021_622.32);
  });

  it("keeps explicit invoice rates ahead of fallback rates", () => {
    expect(resolveProfitReportExchangeRate("USD", 16_000, 17_417)).toBe(16_000);
  });

  it("requests a fallback rate only for USD rows with no usable saved rate", () => {
    expect(
      needsProfitReportFallbackExchangeRate([
        { currency: "IDR", exchangeRate: 1 },
        { currency: "USD", exchangeRate: 1 },
      ]),
    ).toBe(true);
    expect(needsProfitReportFallbackExchangeRate([{ currency: "USD", exchangeRate: 16_000 }])).toBe(
      false,
    );
  });

  it("loads the profit report fallback exchange rate from the shared API endpoint", () => {
    const source = readFileSync(
      join(process.cwd(), "app/components/operational/JobProfitPreview.vue"),
      "utf8",
    );

    expect(source).toContain("/api/finance/invoice/exchange-rate");
    expect(source).not.toContain("findProfitReportFallbackExchangeRate");
  });

  it("lets users write the estimated job profit rate back into invoices and vendor invoices", () => {
    const source = readFileSync(
      join(process.cwd(), "app/components/operational/JobFinanceTab.vue"),
      "utf8",
    );

    expect(source).toContain("applyEstimatedProfitRate");
    expect(source).toContain("updateInvoice(");
    expect(source).toContain("balanceDue: Number(invoice.balanceDue ?? invoice.total ?? 0)");
    expect(source).toContain("updateExpense(");
    expect(source).toContain("Isi Kurs Estimasi");
  });

  it("labels job profit PDFs when fallback API rates are still estimated", () => {
    const source = readFileSync(
      join(process.cwd(), "app/components/operational/JobProfitPreview.vue"),
      "utf8",
    );

    expect(source).toContain("isUsingEstimatedExchangeRate");
    expect(source).toContain("estimated API rate");
  });
});
