// @ts-ignore
import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const componentPath = resolve(root, "app/components/ui/CurrencyStack.vue");

const consumerFiles = [
  "app/pages/finance/invoice/components/InvoiceGridView.vue",
  "app/pages/finance/invoice/components/InvoiceListView.vue",
  "app/pages/finance/invoice/components/VendorInvoiceSection.vue",
  "app/components/operational/JobInvoiceTab.vue",
  "app/components/operational/JobVendorInvoiceTab.vue",
  "app/components/operational/QuotationPreview.vue",
  "app/components/operational/QuotationCostingPreview.vue",
  "app/components/operational/QuotationInvoicePreview.vue",
  "app/components/operational/JobInvoicePreview.vue",
];

describe("exchange-rate amount display", () => {
  it("has a shared stacked display that renders IDR primary and source USD as secondary", () => {
    expect(existsSync(componentPath)).toBe(true);
    const contents = readFileSync(componentPath, "utf8");

    expect(contents).toContain("primaryCurrency");
    expect(contents).toContain("secondaryCurrency");
    expect(contents).toContain("convertedAmount");
    expect(contents).toContain("text-muted-foreground");
    expect(contents).toContain("opacity-70");
  });

  it("uses the shared stacked display in quotation and invoice surfaces", () => {
    for (const file of consumerFiles) {
      const contents = readFileSync(resolve(root, file), "utf8");
      expect(contents).toContain("CurrencyStack");
    }
  });

  it("keeps costing amount rows on the shared IDR-primary stack instead of hand-rolled USD primary markup", () => {
    const contents = readFileSync(
      resolve(root, "app/components/operational/QuotationCostingPreview.vue"),
      "utf8",
    );

    expect(contents).toContain(':amount="c.amount"');
    expect(contents).toContain(':currency="c.currency"');
    expect(contents).toContain(':exchange-rate="c.exchangeRate"');
    expect(contents).not.toContain("formatCurrency(c.amount, c.currency)");
    expect(contents).not.toContain("formatCurrency(c.amount * c.exchangeRate)");
  });

  it("keeps quotation item amount rows on the shared IDR-primary stack", () => {
    const contents = readFileSync(
      resolve(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );

    expect(contents).toContain(':amount="item.unitPrice"');
    expect(contents).toContain(':amount="item.amount"');
    expect(contents).toContain(':exchange-rate="quotation?.exchangeRate"');
    expect(contents).not.toContain("formatCurrency(item.unitPrice, item.currency)");
    expect(contents).not.toContain("formatCurrency(item.amount, item.currency)");
  });

  it("does not squeeze multi-currency quotation totals into two narrow footer columns", () => {
    const contents = readFileSync(
      resolve(root, "app/components/operational/QuotationPreview.vue"),
      "utf8",
    );

    expect(contents).toContain("flex flex-col divide-y");
    expect(contents).toContain("quotation-total-table");
    expect(contents).toContain("whitespace-nowrap");
    expect(contents).not.toContain("grid-cols-2 divide-x");
  });
});
