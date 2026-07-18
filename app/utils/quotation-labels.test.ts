// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const userFacingFiles = [
  "app/pages/operational/quotations/create.vue",
  "app/pages/operational/quotations/[id]/edit.vue",
  "app/components/operational/QuotationDetailSlideOver.vue",
  "app/components/operational/QuotationInvoiceForm.vue",
  "app/components/operational/QuotationInvoicePreview.vue",
];
const mainQuotationFormFiles = [
  "app/pages/operational/quotations/create.vue",
  "app/pages/operational/quotations/[id]/edit.vue",
];

describe("quotation user-facing labels", () => {
  it("does not call quotation documents invoices in the UI/PDF", () => {
    for (const file of userFacingFiles) {
      const contents = readFileSync(resolve(root, file), "utf8");
      expect(contents).not.toContain("Quotation Invoice");
      expect(contents).not.toContain("Quotation Invoices");
      expect(contents).not.toContain("QUOTATION INVOICE");
      expect(contents).not.toContain("Add Invoice");
      expect(contents).not.toContain("Create Invoice");
      expect(contents).not.toContain("Quotation Docs");
      expect(contents).not.toContain("Quotation Documents");
      expect(contents).not.toContain("Manage Quotation");
    }
  });

  it("keeps main quotation forms focused on service lines", () => {
    for (const file of mainQuotationFormFiles) {
      const contents = readFileSync(resolve(root, file), "utf8");

      expect(contents).not.toContain("Add Quotation");
      expect(contents).toContain("Record Cost");
      expect(contents).toContain("Add Service Line");
    }
  });
});
