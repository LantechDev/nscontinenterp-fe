// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("PDF rendering helper", () => {
  it("keeps PDF preview components on the shared A4 renderer", () => {
    const files = [
      "app/components/operational/QuotationPreview.vue",
      "app/components/operational/QuotationInvoicePreview.vue",
      "app/components/operational/QuotationCostDetailPreview.vue",
      "app/components/operational/QuotationCostingPreview.vue",
    ];

    files.forEach((file) => {
      const contents = readFileSync(join(root, file), "utf8");

      expect(contents).toContain("renderA4Pdf(");
      expect(contents).not.toContain('from "jspdf"');
      expect(contents).not.toContain('from "html2canvas"');
      expect(contents).not.toContain('querySelectorAll(".a4-page-wrapper")');
      expect(contents).not.toContain('toDataURL("image/jpeg", 0.95)');
    });
  });

  it("keeps the costing tab print action on the shared element renderer", () => {
    const contents = readFileSync(
      join(root, "app/components/operational/QuotationCostingTab.vue"),
      "utf8",
    );

    expect(contents).toContain("renderElementPdf(");
    expect(contents).not.toContain('from "jspdf"');
    expect(contents).not.toContain('from "html2canvas"');
    expect(contents).not.toContain('toDataURL("image/png")');
  });
});
