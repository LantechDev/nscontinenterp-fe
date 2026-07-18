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
});
