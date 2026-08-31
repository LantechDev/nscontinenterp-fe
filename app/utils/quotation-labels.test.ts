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
const serviceItemEditorFiles = ["app/pages/operational/quotations/[id]/edit.vue"];

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

  it("keeps persisted quotation service item editors focused on service lines", () => {
    for (const file of serviceItemEditorFiles) {
      const contents = readFileSync(resolve(root, file), "utf8");

      expect(contents).not.toContain("Add Quotation");
      expect(contents).toContain("Record Cost");
      expect(contents).toContain("Add Service Line");
    }
  });

  it("does not create service items on the create quotation page", () => {
    const create = readFileSync(
      resolve(root, "app/pages/operational/quotations/create.vue"),
      "utf8",
    );

    expect(create).not.toContain("Service Items & Pricing");
    expect(create).not.toContain('id="pricing-info"');
    expect(create).not.toContain("formData.charges.map");
    expect(create).toContain("charges: []");
  });

  it("keeps quotation revenue items away from the removed additional tab", () => {
    const detail = readFileSync(
      resolve(root, "app/components/operational/QuotationDetailSlideOver.vue"),
      "utf8",
    );

    expect(detail).not.toContain("Additional Quotations");
    expect(detail).not.toContain("activeTab === 'invoices'");
    expect(detail).toContain("Add Service Item");
    expect(detail).not.toContain("Edit Service Items");
    expect(detail).not.toContain("showServiceItemForm");
    expect(detail).not.toContain("handleServiceItemSubmit");
    expect(detail).toContain("openCreateInvoiceForm");
    expect(detail).toContain("QuotationInvoiceForm");
    expect(detail).toContain("quotationInvoices");
  });

  it("keeps quotation edit deep links capable of opening at service item pricing", () => {
    const edit = readFileSync(
      resolve(root, "app/pages/operational/quotations/[id]/edit.vue"),
      "utf8",
    );

    expect(edit).toContain('route.hash === "#pricing-info"');
    expect(edit).toContain('scrollTo("pricing-info")');
  });
});
