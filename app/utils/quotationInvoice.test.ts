// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  calculateInvoiceTotal,
  groupInvoiceTotals,
  isWithholdingInvoiceTax,
  sortInvoiceItemsForDisplay,
} from "./quotationInvoice";

const root = process.cwd();

describe("quotation invoice totals", () => {
  it("converts mixed USD/IDR invoice items when the invoice currency is IDR", () => {
    const totals = calculateInvoiceTotal({
      items: [
        { description: "Freight", quantity: 2, unitPrice: 10, currency: "USD" },
        { description: "Admin", quantity: 1, unitPrice: 5_000, currency: "IDR" },
      ],
      invoiceCurrency: "IDR",
      exchangeRate: 16_000,
      discountType: null,
      discountValue: 0,
      tax: { rate: 11 },
    });

    expect(totals.subTotal).toBe(325_000);
    expect(totals.taxAmount).toBe(35_750);
    expect(totals.total).toBe(360_750);
  });

  it("caps fixed discounts and applies withholding tax as a deduction", () => {
    const totals = calculateInvoiceTotal({
      items: [{ description: "Clearance", quantity: 1, unitPrice: 100, currency: "USD" }],
      invoiceCurrency: "USD",
      exchangeRate: 16_000,
      discountType: "FIXED",
      discountValue: 150,
      tax: { rate: 2, type: "PPH" },
    });

    expect(totals.discountAmount).toBe(100);
    expect(totals.discountedBase).toBe(0);
    expect(totals.taxAmount).toBe(0);
    expect(totals.total).toBe(0);
    expect(isWithholdingInvoiceTax({ rate: 2, type: "PPH" })).toBe(true);
  });

  it("groups invoice totals per currency when no exchange rate conversion is used", () => {
    const totals = groupInvoiceTotals(
      [
        { description: "Freight", quantity: 1, unitPrice: 10.125, currency: "USD" },
        { description: "Admin", quantity: 1, unitPrice: 10_000.4, currency: "IDR" },
      ],
      11,
      false,
    );

    expect(totals.USD!.subTotal).toBe(10.125);
    expect(totals.USD!.taxAmount).toBe(1.12);
    expect(totals.USD!.total).toBeCloseTo(11.245, 3);
    expect(totals.IDR).toEqual({ subTotal: 10_000, taxAmount: 1_100, total: 11_100 });
  });

  it("sorts invoice items by logistics service category for display", () => {
    const items = [
      { id: "warehouse", description: "Warehouse Handling", service: { name: "Warehouse" } },
      { id: "trucking", description: "Delivery", service: { category: { name: "Trucking" } } },
      { id: "freight", description: "Ocean Freight 20FT", service: { name: "Ocean Freight" } },
      { id: "other", description: "Bank Admin Fee", service: { category: { name: "Others" } } },
      {
        id: "clearance",
        description: "PIB Process",
        service: { category: { name: "Custom Clearance" } },
      },
      {
        id: "local",
        description: "THC",
        service: { category: { name: "Local Charges" } },
      },
      { id: "docs", description: "BL Fee", service: { category: { name: "Documentation" } } },
    ];

    expect(sortInvoiceItemsForDisplay(items).map((item) => item.id)).toEqual([
      "freight",
      "local",
      "docs",
      "clearance",
      "trucking",
      "warehouse",
      "other",
    ]);
  });

  it("keeps quotation invoice form on shared invoice total helpers", () => {
    const contents = readFileSync(
      join(root, "app/components/operational/QuotationInvoiceForm.vue"),
      "utf8",
    );

    expect(contents).toContain("calculateInvoiceTotal(");
    expect(contents).toContain("groupInvoiceTotals(");
    expect(contents).not.toContain("const subTotal = computed(() => {");
    expect(contents).not.toContain("const groupedTotals = computed(() => {");
  });
});
